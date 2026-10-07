/* ==========================================================
   cloud.js — Firebase Auth + Firestore + Ranking
   Carregar DEPOIS de script.js e firebase-config.js
   ==========================================================
   REGRAS DO FIRESTORE (Firestore → Rules → Publish):

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       match /ranking/{userId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ========================================================== */
(function () {
  'use strict';

  const cfg = window.FIREBASE_CONFIG || {};
  const configured = cfg.apiKey && cfg.apiKey !== 'COLE_AQUI'
                     && cfg.projectId && cfg.projectId !== 'COLE_AQUI';

  let auth = null;
  let db = null;
  let currentUser = null;
  let busy = false;
  let syncing = false;
  let unsubscribeUser = null;
  let syncDebounce = null;
  let lastLocalSave = 0;
  let rankMode = 'xp';
  let rankCache = [];

  window.addEventListener('DOMContentLoaded', boot);

  function boot() {
    if (!configured) { hideLogin(); return; }
    if (typeof firebase === 'undefined' || !firebase.initializeApp) {
      console.warn('[cloud] SDK do Firebase não carregado.');
      hideLogin();
      return;
    }
    try {
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      auth = firebase.auth();
      db = firebase.firestore();
      db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
    } catch (e) {
      console.error('[cloud] init', e);
      hideLogin();
      return;
    }
    injectLoginScreen();
    injectAccountPanel();
    injectSyncBadge();
    buildRankingView();
    bindEvents();
    auth.onAuthStateChanged(handleAuthState);
  }

  /* ============ TELA DE LOGIN ============ */
  function injectLoginScreen() {
    if (document.getElementById('loginScreen')) return;
    const el = document.createElement('div');
    el.className = 'login-screen';
    el.id = 'loginScreen';
    el.innerHTML = `
      <div class="login-bg-blob login-blob-1"></div>
      <div class="login-bg-blob login-blob-2"></div>
      <div class="login-card">
        <div class="login-logo">
          <div class="login-mark"><i data-lucide="book-marked"></i></div>
          <h1>My <span>StudE</span></h1>
          <p>Entre para sincronizar e disputar o ranking</p>
        </div>
        <div class="login-tabs">
          <button class="login-tab active" data-tab="login">Entrar</button>
          <button class="login-tab" data-tab="signup">Criar conta</button>
        </div>
        <form id="loginForm" class="login-form">
          <div class="field">
            <label>Nome</label>
            <input type="text" id="lgName" maxlength="20" placeholder="ex: carlos" autocomplete="username" required>
          </div>
          <div class="field">
            <label>Senha</label>
            <input type="password" id="lgPass" maxlength="60" placeholder="mínimo 6 caracteres" autocomplete="current-password" required>
          </div>
          <button type="submit" class="btn btn-primary login-submit" id="lgSubmit"><i data-lucide="log-in"></i> Entrar</button>
          <p class="login-error" id="lgError"></p>
        </form>
        <div class="login-info">
          <i data-lucide="shield-check"></i>
          <span>Login via Firebase (Google). Sua senha é criptografada pelo próprio Google.</span>
        </div>
        <button class="login-skip" id="lgSkip" title="Usar sem sincronizar">
          <i data-lucide="wifi-off"></i> Continuar offline
        </button>
      </div>
    `;
    document.body.appendChild(el);
    if (window.lucide) lucide.createIcons();
  }

  function showLogin() {
    const el = document.getElementById('loginScreen');
    if (!el) return;
    el.classList.add('show');
    el.style.display = 'flex';
    setTimeout(() => document.getElementById('lgName')?.focus(), 100);
    if (window.lucide) lucide.createIcons();
  }
  function hideLogin() {
    const el = document.getElementById('loginScreen');
    if (!el) return;
    el.classList.remove('show');
    el.style.display = 'none';
  }

  /* ============ PAINEL DE CONTA ============ */
  function injectAccountPanel() {
    const cfgView = document.getElementById('view-config');
    if (!cfgView || document.getElementById('cloudAccountPanel')) return;
    const p = document.createElement('div');
    p.className = 'panel';
    p.id = 'cloudAccountPanel';
    p.innerHTML = `
      <div class="panel-head">
        <h3><i data-lucide="cloud"></i> Conta</h3>
        <span class="badge" id="cloudStatusBadge">—</span>
      </div>
      <div id="cloudLoggedOut" hidden>
        <p class="muted small">Você está offline. Entre para sincronizar entre dispositivos.</p>
        <div class="form-actions"><button class="btn btn-primary" id="cloudOpenLogin"><i data-lucide="log-in"></i> Entrar</button></div>
      </div>
      <div id="cloudLoggedIn" hidden>
        <div class="cloud-user-card">
          <div class="cloud-user-avatar" id="cloudAvatar">?</div>
          <div class="cloud-user-info">
            <strong id="cloudUserName">—</strong>
            <span class="muted small" id="cloudUserMeta">—</span>
          </div>
          <div class="cloud-user-actions">
            <button class="btn btn-ghost btn-sm" id="cloudSyncNow" title="Baixar da nuvem"><i data-lucide="refresh-cw"></i></button>
            <button class="btn btn-ghost btn-sm" id="cloudForcePush" title="Enviar para a nuvem"><i data-lucide="upload-cloud"></i></button>
            <button class="btn btn-ghost btn-sm" id="cloudLogout" title="Sair"><i data-lucide="log-out"></i></button>
          </div>
        </div>
        <p class="muted small mt" id="cloudLastSync">Nunca sincronizado.</p>
      </div>
    `;
    if (cfgView.firstChild) cfgView.insertBefore(p, cfgView.firstChild);
    else cfgView.appendChild(p);
  }

  function injectSyncBadge() {
    const topbar = document.querySelector('.topbar-right');
    if (!topbar || document.getElementById('syncBadge')) return;
    const el = document.createElement('span');
    el.className = 'pill sync-pill';
    el.id = 'syncBadge';
    el.innerHTML = '<i data-lucide="cloud-off"></i> <span>Offline</span>';
    topbar.appendChild(el);
    if (window.lucide) lucide.createIcons();
  }

  /* ============ RANKING ============ */
  function buildRankingView() {
    const view = document.getElementById('view-ranking');
    if (!view) return;
    view.innerHTML = `
      <div class="view-head">
        <h2>Ranking</h2>
        <p>Compare seu progresso com o dos outros estudantes.</p>
      </div>
      <div class="rank-hero panel">
        <div class="rank-hero-you">
          <div class="rank-hero-avatar" id="rankYouAvatar">?</div>
          <div class="rank-hero-info">
            <span>Você</span>
            <strong id="rankYouName">—</strong>
            <em id="rankYouMeta">—</em>
          </div>
        </div>
        <div class="rank-hero-stats" id="rankYouStats"></div>
      </div>
      <div class="rank-filters" id="rankFilters">
        <button data-rank="xp" class="active"><i data-lucide="zap"></i> XP</button>
        <button data-rank="questions"><i data-lucide="target"></i> Questões</button>
        <button data-rank="streak"><i data-lucide="flame"></i> Sequência</button>
        <button data-rank="achievements"><i data-lucide="award"></i> Conquistas</button>
      </div>
      <div class="panel">
        <div class="panel-head">
          <h3 id="rankTitle"><i data-lucide="trophy"></i> Top Estudantes</h3>
          <button class="btn btn-ghost btn-sm" id="rankRefresh"><i data-lucide="refresh-cw"></i> Atualizar</button>
        </div>
        <div id="rankList" class="rank-list"><p class="muted small">Carregando…</p></div>
        <p class="muted small mt" id="rankUpdated"></p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  }

  function renderRanking() {
    const list = document.getElementById('rankList');
    const title = document.getElementById('rankTitle');
    const upd = document.getElementById('rankUpdated');
    if (!list) return;
    if (!rankCache.length) {
      list.innerHTML = '<p class="muted small" style="padding:20px;text-align:center">Nenhum participante ainda. Seja o primeiro!</p>';
      return;
    }
    const labels = {
      xp:{icon:'zap',title:'Top XP'},
      questions:{icon:'target',title:'Top Questões'},
      streak:{icon:'flame',title:'Top Sequência'},
      achievements:{icon:'award',title:'Top Conquistas'}
    };
    const L = labels[rankMode] || labels.xp;
    if (title) title.innerHTML = `<i data-lucide="${L.icon}"></i> ${L.title}`;
    const getVal = u => Number(u[rankMode] || 0);
    const fmtVal = v => {
      if (rankMode === 'xp') return `${v.toLocaleString('pt-BR')} XP`;
      if (rankMode === 'questions') return `${v} ${v === 1 ? 'questão' : 'questões'}`;
      if (rankMode === 'streak') return `${v} ${v === 1 ? 'dia' : 'dias'}`;
      if (rankMode === 'achievements') return `${v} ${v === 1 ? 'conquista' : 'conquistas'}`;
      return String(v);
    };
    const sorted = [...rankCache].sort((a, b) => getVal(b) - getVal(a));
    const meUid = currentUser ? currentUser.uid : null;
    list.innerHTML = sorted.map((u, i) => {
      const pos = i + 1;
      const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `#${pos}`;
      const isMe = u.key === meUid;
      const rankBadge = u.rank ? `<em class="rank-tier">${escapeHtml(u.rank)}</em>` : '';
      return `
        <div class="rank-row ${pos <= 3 ? 'rank-top' : ''} ${isMe ? 'rank-me' : ''}">
          <span class="rank-pos">${medal}</span>
          <div class="rank-name-box">
            <strong>${escapeHtml(u.displayName || 'Anônimo')}${isMe ? ' <em>(você)</em>' : ''}</strong>
            ${rankBadge}
          </div>
          <span class="rank-val">${fmtVal(getVal(u))}</span>
        </div>
      `;
    }).join('');
    if (upd) upd.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR')} · ${sorted.length} participante(s)`;
    if (window.lucide) lucide.createIcons();
  }

  function renderRankHero() {
    const av = document.getElementById('rankYouAvatar');
    const nm = document.getElementById('rankYouName');
    const mt = document.getElementById('rankYouMeta');
    const st = document.getElementById('rankYouStats');
    if (!st) return;
    if (!currentUser) {
      if (av) av.textContent = '?';
      if (nm) nm.textContent = 'Modo offline';
      if (mt) mt.textContent = 'Entre para participar do ranking';
      st.innerHTML = '';
      return;
    }
    if (av) av.textContent = (currentUser.name.charAt(0) || '?').toUpperCase();
    if (nm) nm.textContent = currentUser.name;
    if (mt) mt.textContent = 'UID ' + currentUser.uid.slice(0, 8) + '…';
    const s = collectStats();
    st.innerHTML = `
      <div class="rank-hero-stat"><strong>${s.xp.toLocaleString('pt-BR')}</strong><span>XP</span></div>
      <div class="rank-hero-stat"><strong>${s.questions}</strong><span>Questões</span></div>
      <div class="rank-hero-stat"><strong>${s.streak}</strong><span>Dias</span></div>
      <div class="rank-hero-stat"><strong>${s.achievements}</strong><span>Conquistas</span></div>
    `;
  }

  /* ============ HELPERS ============ */
  const setErr = m => { const e = document.getElementById('lgError'); if (e) e.textContent = m || ''; };
  const sanitizeName = n => String(n || '').trim().replace(/\s+/g, ' ');
  const normalizeKey = n => String(n || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  const nameToEmail = n => normalizeKey(n) + '@mystude.local';
  const escapeHtml = s => String(s || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const fmtDate = ts => {
    const d = new Date(ts);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  };

  /* ============ EVENTOS ============ */
  function bindEvents() {
    document.querySelectorAll('.login-tab').forEach(t => t.addEventListener('click', () => {
      document.querySelectorAll('.login-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const tab = t.dataset.tab;
      const btn = document.getElementById('lgSubmit');
      if (btn) btn.innerHTML = tab === 'login'
        ? '<i data-lucide="log-in"></i> Entrar'
        : '<i data-lucide="user-plus"></i> Criar conta';
      setErr('');
      if (window.lucide) lucide.createIcons();
    }));
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', e => {
      e.preventDefault();
      const tab = document.querySelector('.login-tab.active').dataset.tab;
      if (tab === 'login') doLogin(); else doSignup();
    });
    const skip = document.getElementById('lgSkip');
    if (skip) skip.addEventListener('click', () => {
      sessionStorage.setItem('mystude_skip_login', '1');
      hideLogin();
      setSyncBadge('offline');
    });
    const open = document.getElementById('cloudOpenLogin');
    if (open) open.addEventListener('click', () => {
      sessionStorage.removeItem('mystude_skip_login');
      showLogin();
    });
    const logout = document.getElementById('cloudLogout');
    if (logout) logout.addEventListener('click', doLogout);
    const syncNow = document.getElementById('cloudSyncNow');
    if (syncNow) syncNow.addEventListener('click', () => syncPull(true));
    const forcePush = document.getElementById('cloudForcePush');
    if (forcePush) forcePush.addEventListener('click', () => syncPush(true));
    document.querySelectorAll('#rankFilters button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('#rankFilters button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      rankMode = b.dataset.rank;
      renderRanking();
    }));
    const refresh = document.getElementById('rankRefresh');
    if (refresh) refresh.addEventListener('click', refreshRanking);
  }

  /* ============ LOGIN / SIGNUP ============ */
  async function doLogin() {
    if (busy) return; busy = true;
    setErr('');
    try {
      const name = sanitizeName(document.getElementById('lgName').value);
      const pass = document.getElementById('lgPass').value;
      if (!name) { setErr('Informe um nome.'); return; }
      if (!pass || pass.length < 6) { setErr('Senha deve ter no mínimo 6 caracteres.'); return; }
      await auth.signInWithEmailAndPassword(nameToEmail(name), pass);
    } catch (e) { handleAuthError(e); }
    finally { busy = false; }
  }

  async function doSignup() {
    if (busy) return; busy = true;
    setErr('');
    try {
      const name = sanitizeName(document.getElementById('lgName').value);
      const pass = document.getElementById('lgPass').value;
      if (name.length < 3) { setErr('Nome precisa de pelo menos 3 caracteres.'); return; }
      if (!/^[A-Za-z0-9À-ÿ _.-]+$/.test(name)) { setErr('Nome só pode ter letras, números, espaço, _ . -'); return; }
      if (pass.length < 6) { setErr('Senha precisa de pelo menos 6 caracteres.'); return; }
      const cred = await auth.createUserWithEmailAndPassword(nameToEmail(name), pass);
      await cred.user.updateProfile({ displayName: name });
      const localPayload = safeReadLocalPayload() || defaultStatePayload();
      await db.collection('users').doc(cred.user.uid).set({
        displayName: name,
        payload: localPayload,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      const stats = collectStats();
      await db.collection('ranking').doc(cred.user.uid).set({
        displayName: name,
        xp: stats.xp,
        questions: stats.questions,
        streak: stats.streak,
        achievements: stats.achievements,
        rank: stats.rank,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      toast('Conta criada!', 'success');
    } catch (e) { handleAuthError(e); }
    finally { busy = false; }
  }

  function doLogout() {
    if (!confirm('Sair da conta? Seus dados locais permanecem no navegador.')) return;
    auth.signOut();
    sessionStorage.removeItem('mystude_skip_login');
    toast('Sessão encerrada.', 'warn');
  }

  function handleAuthError(e) {
    const code = e && e.code || '';
    const map = {
      'auth/email-already-in-use': 'Esse nome já existe. Faça login ou escolha outro.',
      'auth/user-not-found': 'Nenhuma conta com esse nome. Crie uma.',
      'auth/wrong-password': 'Senha incorreta.',
      'auth/invalid-email': 'Nome inválido.',
      'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).',
      'auth/network-request-failed': 'Sem conexão com a internet.',
      'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos.',
      'auth/invalid-login-credentials': 'Nome ou senha inválidos.'
    };
    setErr(map[code] || ('Erro: ' + (e.message || code)));
  }

  /* ============ AUTH STATE ============ */
  function handleAuthState(user) {
    if (user) {
      currentUser = {
        uid: user.uid,
        name: user.displayName || (user.email || '').split('@')[0] || 'estudante',
        email: user.email
      };
      hideLogin();
      renderAccount();
      renderRankHero();
      setSyncBadge('connected');
      syncPull(false).then(() => {
        subscribeToUser();
        refreshRanking();
      });
      hookSaveState();
    } else {
      currentUser = null;
      if (unsubscribeUser) { unsubscribeUser(); unsubscribeUser = null; }
      renderAccount();
      renderRankHero();
      setSyncBadge('offline');
      const skipped = sessionStorage.getItem('mystude_skip_login') === '1';
      if (!skipped) showLogin();
    }
  }

  /* ============ CONTA ============ */
  function renderAccount() {
    const out = document.getElementById('cloudLoggedOut');
    const inn = document.getElementById('cloudLoggedIn');
    if (!out || !inn) return;
    const b = document.getElementById('cloudStatusBadge');
    if (currentUser) {
      out.hidden = true; inn.hidden = false;
      const a = document.getElementById('cloudAvatar');
      const n = document.getElementById('cloudUserName');
      const m = document.getElementById('cloudUserMeta');
      if (a) a.textContent = (currentUser.name.charAt(0) || '?').toUpperCase();
      if (n) n.textContent = currentUser.name;
      if (m) m.textContent = 'UID ' + currentUser.uid.slice(0, 8) + '…';
      if (b) { b.textContent = 'Conectado'; b.style.color = 'var(--emerald-2)'; }
    } else {
      out.hidden = false; inn.hidden = true;
      if (b) { b.textContent = 'Offline'; b.style.color = 'var(--amber-2)'; }
    }
  }

  /* ============ SYNC BADGE ============ */
  function setSyncBadge(state, extra) {
    const b = document.getElementById('syncBadge');
    if (!b) return;
    if (state === 'connected') {
      b.className = 'pill sync-pill connected';
      b.innerHTML = '<i data-lucide="cloud"></i> <span>Sincronizado</span>';
    } else if (state === 'syncing') {
      b.className = 'pill sync-pill syncing';
      b.innerHTML = '<i data-lucide="refresh-cw"></i> <span>Sincronizando…</span>';
    } else if (state === 'error') {
      b.className = 'pill sync-pill error';
      b.innerHTML = '<i data-lucide="cloud-off"></i> <span>Erro</span>';
    } else {
      b.className = 'pill sync-pill';
      b.innerHTML = '<i data-lucide="cloud-off"></i> <span>Offline</span>';
    }
    if (extra) b.title = extra;
    if (window.lucide) lucide.createIcons();
  }

  /* ============ STATS ============ */
  function collectStats() {
    try {
      if (typeof window.calcTotalXP === 'function' &&
          typeof window.totalQuestionsCount === 'function' &&
          typeof window.studyStreak === 'function') {
        const xp = window.calcTotalXP();
        let rankName = '';
        if (typeof window.getXPProgress === 'function') {
          const p = window.getXPProgress();
          rankName = p.current ? p.current.rank : '';
        }
        const achCount = window.state && window.state.unlockedAchievements
          ? Object.keys(window.state.unlockedAchievements).length : 0;
        return {
          xp,
          questions: window.totalQuestionsCount(),
          streak: window.studyStreak(),
          achievements: achCount,
          rank: rankName
        };
      }
    } catch (e) {}
    return { xp:0, questions:0, streak:0, achievements:0, rank:'' };
  }

  function safeReadLocalPayload() {
    try {
      if (typeof window.state !== 'undefined' && window.state) {
        return JSON.parse(JSON.stringify(window.state));
      }
      const raw = localStorage.getItem('mystude_v2');
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function defaultStatePayload() {
    try { if (typeof window.defaultState === 'function') return window.defaultState(); } catch (e) {}
    return {};
  }

  function applyPayloadToApp(payload) {
    if (!payload || typeof payload !== 'object') return false;
    try {
      if (typeof window.state !== 'undefined' && window.state) {
        Object.keys(window.state).forEach(k => { try { delete window.state[k]; } catch (e) {} });
        Object.assign(window.state, payload);
        if (typeof window.saveState === 'function') window.saveState();
        if (typeof window.renderDashboard === 'function') window.renderDashboard();
        if (typeof window.renderCycle === 'function') window.renderCycle();
        if (typeof window.renderStudies === 'function') window.renderStudies();
        if (typeof window.renderQuestions === 'function') window.renderQuestions();
        if (typeof window.renderCalendar === 'function') window.renderCalendar();
        if (typeof window.renderAchievements === 'function') window.renderAchievements();
        if (typeof window.renderXPWidget === 'function') window.renderXPWidget();
        if (typeof window.fillSubjectSelects === 'function') window.fillSubjectSelects();
        if (window.lucide) lucide.createIcons();
        return true;
      }
    } catch (e) { console.error(e); }
    return false;
  }

  /* ============ SYNC ============ */
  async function syncPull(manual) {
    if (!configured || !currentUser || syncing) return;
    syncing = true;
    setSyncBadge('syncing');
    try {
      const ref = db.collection('users').doc(currentUser.uid);
      const snap = await ref.get();
      if (snap.exists) {
        const data = snap.data();
        if (data.payload && (!window.state || JSON.stringify(data.payload) !== JSON.stringify(window.state))) {
          applyPayloadToApp(data.payload);
        }
      } else {
        await syncPush(false);
      }
      const el = document.getElementById('cloudLastSync');
      if (el) el.textContent = 'Última sincronização: ' + fmtDate(Date.now());
      setSyncBadge('connected');
      if (manual) toast('Baixado da nuvem.', 'success');
    } catch (e) {
      console.error('[syncPull]', e);
      setSyncBadge('error');
      if (manual) toast('Falha ao sincronizar.', 'warn');
    } finally { syncing = false; }
  }

  async function syncPush(manual) {
    if (!configured || !currentUser || syncing) return;
    syncing = true;
    setSyncBadge('syncing');
    try {
      const payload = safeReadLocalPayload();
      const stats = collectStats();
      const ref = db.collection('users').doc(currentUser.uid);
      await ref.set({
        displayName: currentUser.name,
        payload: payload,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      const rankRef = db.collection('ranking').doc(currentUser.uid);
      await rankRef.set({
        displayName: currentUser.name,
        xp: stats.xp,
        questions: stats.questions,
        streak: stats.streak,
        achievements: stats.achievements,
        rank: stats.rank,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      const el = document.getElementById('cloudLastSync');
      if (el) el.textContent = 'Última sincronização: ' + fmtDate(Date.now());
      setSyncBadge('connected');
      if (manual) toast('Enviado para a nuvem.', 'success');
    } catch (e) {
      console.error('[syncPush]', e);
      setSyncBadge('error');
      if (manual) toast('Falha ao enviar.', 'warn');
    } finally { syncing = false; }
  }

  function hookSaveState() {
    if (typeof window.saveState !== 'function' || window.__fbSaveHooked) return;
    window.__fbSaveHooked = true;
    const orig = window.saveState;
    window.saveState = function () {
      try { orig.apply(this, arguments); } catch (e) {}
      if (currentUser) {
        lastLocalSave = Date.now();
        clearTimeout(syncDebounce);
        syncDebounce = setTimeout(() => {
          if (currentUser) { syncPush(false); renderRankHero(); }
        }, 1500);
      }
    };
  }

  function subscribeToUser() {
    if (!currentUser) return;
    if (unsubscribeUser) unsubscribeUser();
    unsubscribeUser = db.collection('users').doc(currentUser.uid).onSnapshot(snap => {
      if (!snap.exists) return;
      const data = snap.data();
      if (syncing) return;
      if (Date.now() - lastLocalSave < 3000) return;
      if (data.payload) applyPayloadToApp(data.payload);
    }, err => console.warn('[onSnapshot]', err));
  }

  /* ============ RANKING ============ */
  async function refreshRanking() {
    if (!configured) return;
    const list = document.getElementById('rankList');
    if (list && !rankCache.length) {
      list.innerHTML = '<p class="muted small" style="padding:20px;text-align:center">Carregando…</p>';
    }
    try {
      const snap = await db.collection('ranking').orderBy('xp', 'desc').limit(100).get();
      rankCache = snap.docs.map(d => ({ key: d.id, ...d.data() }));
      renderRanking();
      renderRankHero();
    } catch (e) {
      console.error('[ranking]', e);
      if (list) list.innerHTML = '<p class="muted small" style="padding:20px;text-align:center;color:#fda4af">Falha ao carregar o ranking.</p>';
    }
  }

  const _origSwitchView = window.switchView;
  window.switchView = function (name) {
    if (typeof _origSwitchView === 'function') _origSwitchView.apply(this, arguments);
    if (name === 'ranking') { renderRankHero(); refreshRanking(); }
  };
})();