/* ==========================================================
   cloud.js — Login (nome+senha), sincronização e ranking
   ========================================================== */
(function () {
  'use strict';

  const cfg = window.CLOUD_CONFIG || {};
  const configured = cfg.binId && cfg.binId !== 'COLE_AQUI'
                     && cfg.masterKey && cfg.masterKey !== 'COLE_AQUI';

  const API = 'https://api.jsonbin.io/v3/b';
  const SESSION_KEY = 'mystude_session';

  let currentUser = null;
  let busy = false;
  let syncing = false;
  let syncTimer = null;
  let lastRemoteUpdatedAt = 0;
  let rankMode = 'xp';
  let rankCache = [];

  window.addEventListener('DOMContentLoaded', boot);

  function boot() {
    if (!configured) {
      hideLogin();
      return;
    }
    injectLoginScreen();
    injectAccountPanel();
    injectSyncBadge();
    buildRankingView();
    bindEvents();

    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) { currentUser = JSON.parse(s); afterLogin(true); }
      else showLogin();
    } catch (e) { showLogin(); }
  }

  /* ================= UI: LOGIN ================= */
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
          <span>Sua senha é guardada com hash. Ninguém além de você vê seus dados.</span>
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

  /* ================= UI: CONTA ================= */
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

  /* ================= UI: RANKING ================= */
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
      xp: { icon:'zap', title:'Top XP' },
      questions:{icon:'target',title:'Top Questões'},
      streak:{icon:'flame',title:'Top Sequência'},
      achievements:{icon:'award',title:'Top Conquistas'}
    };
    const L = labels[rankMode] || labels.xp;
    if (title) title.innerHTML = `<i data-lucide="${L.icon}"></i> ${L.title}`;

    const getVal = u => {
      const s = u.stats || {};
      if (rankMode === 'xp') return s.xp || 0;
      if (rankMode === 'questions') return s.questions || 0;
      if (rankMode === 'streak') return s.streak || 0;
      if (rankMode === 'achievements') return s.achievements || 0;
      return 0;
    };
    const fmtVal = v => {
      if (rankMode === 'xp') return `${v.toLocaleString('pt-BR')} XP`;
      if (rankMode === 'questions') return `${v} ${v === 1 ? 'questão' : 'questões'}`;
      if (rankMode === 'streak') return `${v} ${v === 1 ? 'dia' : 'dias'}`;
      if (rankMode === 'achievements') return `${v} ${v === 1 ? 'conquista' : 'conquistas'}`;
      return String(v);
    };

    const sorted = [...rankCache].sort((a, b) => getVal(b) - getVal(a));
    const meKey = currentUser ? currentUser.key : null;

    list.innerHTML = sorted.map((u, i) => {
      const pos = i + 1;
      const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : `#${pos}`;
      const isMe = u.key === meKey;
      const rankBadge = u.stats?.rank ? `<em class="rank-tier">${escapeHtml(u.stats.rank)}</em>` : '';
      return `
        <div class="rank-row ${pos <= 3 ? 'rank-top' : ''} ${isMe ? 'rank-me' : ''}">
          <span class="rank-pos">${medal}</span>
          <div class="rank-name-box">
            <strong>${escapeHtml(u.name || 'Anônimo')}${isMe ? ' <em>(você)</em>' : ''}</strong>
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
    if (mt) mt.textContent = '@' + currentUser.key;

    const s = collectStats();
    st.innerHTML = `
      <div class="rank-hero-stat"><strong>${s.xp.toLocaleString('pt-BR')}</strong><span>XP</span></div>
      <div class="rank-hero-stat"><strong>${s.questions}</strong><span>Questões</span></div>
      <div class="rank-hero-stat"><strong>${s.streak}</strong><span>Dias</span></div>
      <div class="rank-hero-stat"><strong>${s.achievements}</strong><span>Conquistas</span></div>
    `;
  }

  /* ================= Helpers ================= */
  const setErr = m => { const e = document.getElementById('lgError'); if (e) e.textContent = m || ''; };
  const sanitizeName = n => String(n || '').trim().replace(/\s+/g, ' ');
  const normalizeKey = n => String(n || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  async function hashPass(nameKey, pass) {
    const input = nameKey + '::' + pass + '::mystude';
    if (window.crypto && crypto.subtle) {
      try {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {}
    }
    let h = 0;
    for (let i = 0; i < input.length; i++) { h = ((h << 5) - h) + input.charCodeAt(i); h |= 0; }
    return 'fb' + (h >>> 0).toString(16);
  }

  const escapeHtml = s => String(s || '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const fmtDate = ts => {
    const d = new Date(ts);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
  };

  /* ================= API ================= */
  async function fetchBin() {
    const r = await fetch(`${API}/${cfg.binId}/latest`, { headers: { 'X-Master-Key': cfg.masterKey } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    let rec = j && j.record;
    if (!rec || typeof rec !== 'object') rec = { users: {} };
    if (!rec.users || typeof rec.users !== 'object') rec.users = {};
    return rec;
  }
  async function saveBin(data) {
    const r = await fetch(`${API}/${cfg.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': cfg.masterKey,
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify(data)
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }

  /* ================= Eventos ================= */
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
      hideLogin();
      setSyncBadge('offline');
    });
    const open = document.getElementById('cloudOpenLogin');
    if (open) open.addEventListener('click', showLogin);
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

  /* ================= Login / Signup ================= */
  async function doLogin() {
    if (busy) return; busy = true;
    setErr('');
    try {
      const name = sanitizeName(document.getElementById('lgName').value);
      const pass = document.getElementById('lgPass').value;
      if (!name || !pass) { setErr('Informe nome e senha.'); return; }
      const data = await fetchBin();
      const key = normalizeKey(name);
      const u = data.users[key];
      if (!u) { setErr('Nenhuma conta com esse nome. Crie uma.'); return; }
      const hash = await hashPass(key, pass);
      if (u.hash !== hash) { setErr('Senha incorreta.'); return; }
      currentUser = { key, name: u.name || name, hash };
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      afterLogin(false);
      toast('Bem-vindo, ' + currentUser.name + '!', 'success');
    } catch (e) {
      console.error(e);
      setErr('Falha de rede. Tente novamente.');
    } finally { busy = false; }
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

      const data = await fetchBin();
      const key = normalizeKey(name);
      if (data.users[key]) { setErr('Esse nome já existe. Faça login ou escolha outro.'); return; }

      const hash = await hashPass(key, pass);
      const payload = safeReadLocalPayload();
      data.users[key] = {
        name,
        hash,
        payload: payload,
        stats: collectStats(),
        updatedAt: Date.now()
      };
      await saveBin(data);
      currentUser = { key, name, hash };
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      afterLogin(false);
      toast('Conta criada!', 'success');
    } catch (e) {
      console.error(e);
      setErr('Falha de rede. Tente novamente.');
    } finally { busy = false; }
  }

  function doLogout() {
    if (!confirm('Sair da conta? Seus dados locais permanecem no navegador.')) return;
    currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
    renderAccount();
    renderRankHero();
    setSyncBadge('offline');
    showLogin();
    toast('Sessão encerrada.', 'warn');
  }

  function afterLogin() {
    hideLogin();
    renderAccount();
    renderRankHero();
    setSyncBadge('connected');
    syncPull(false).then(() => {
      startAutoSync();
      refreshRanking();
    });
  }

  /* ================= Conta ================= */
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
      if (m) m.textContent = '@' + currentUser.key;
      if (b) { b.textContent = 'Conectado'; b.style.color = 'var(--emerald-2)'; }
    } else {
      out.hidden = false; inn.hidden = true;
      if (b) { b.textContent = 'Offline'; b.style.color = 'var(--amber-2)'; }
    }
  }

  /* ================= Sync badge ================= */
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

  /* ================= Stats ================= */
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

  /* ================= Sync ================= */
  async function syncPull(manual) {
    if (!configured || !currentUser || syncing) return;
    syncing = true;
    setSyncBadge('syncing');
    try {
      const data = await fetchBin();
      const u = data.users[currentUser.key];
      if (!u) { toast('Conta não encontrada na nuvem.', 'warn'); return; }
      const remoteTs = u.updatedAt || 0;
      if (remoteTs > lastRemoteUpdatedAt && u.payload) {
        applyPayloadToApp(u.payload);
        lastRemoteUpdatedAt = remoteTs;
      }
      const el = document.getElementById('cloudLastSync');
      if (el) el.textContent = 'Última sincronização: ' + fmtDate(Date.now());
      setSyncBadge('connected');
      if (manual) toast('Baixado da nuvem.', 'success');
    } catch (e) {
      console.error(e);
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
      const data = await fetchBin();
      const u = data.users[currentUser.key] || {};
      u.name = currentUser.name;
      u.hash = currentUser.hash;
      u.payload = payload;
      u.stats = stats;
      u.updatedAt = Date.now();
      data.users[currentUser.key] = u;
      await saveBin(data);
      lastRemoteUpdatedAt = u.updatedAt;
      const el = document.getElementById('cloudLastSync');
      if (el) el.textContent = 'Última sincronização: ' + fmtDate(Date.now());
      setSyncBadge('connected');
      if (manual) toast('Enviado para a nuvem.', 'success');
    } catch (e) {
      console.error(e);
      setSyncBadge('error');
      if (manual) toast('Falha ao enviar.', 'warn');
    } finally { syncing = false; }
  }

  function startAutoSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(async () => {
      if (!currentUser || syncing) return;
      try {
        const data = await fetchBin();
        const u = data.users[currentUser.key];
        if (u && (u.updatedAt || 0) > lastRemoteUpdatedAt && u.payload) {
          applyPayloadToApp(u.payload);
          lastRemoteUpdatedAt = u.updatedAt;
          setSyncBadge('connected');
        }
      } catch (e) {}
    }, 30 * 1000);

    hookSaveState();
    window.addEventListener('beforeunload', () => { if (currentUser) syncPush(false); });
  }

  function hookSaveState() {
    if (typeof window.saveState !== 'function' || window.__saveStateHooked) return;
    window.__saveStateHooked = true;
    const orig = window.saveState;
    window.saveState = function () {
      try { orig.apply(this, arguments); } catch (e) {}
      if (currentUser) {
        clearTimeout(window.__pushDebounce);
        window.__pushDebounce = setTimeout(() => { syncPush(false); renderRankHero(); }, 1200);
      }
    };
  }

  /* ================= Ranking ================= */
  async function refreshRanking() {
    if (!configured) return;
    const list = document.getElementById('rankList');
    if (list && !rankCache.length) {
      list.innerHTML = '<p class="muted small" style="padding:20px;text-align:center">Carregando…</p>';
    }
    try {
      const data = await fetchBin();
      rankCache = Object.entries(data.users).map(([key, u]) => ({
        key,
        name: u.name || key,
        stats: u.stats || {}
      }));
      renderRanking();
      renderRankHero();
    } catch (e) {
      console.error(e);
      if (list) list.innerHTML = '<p class="muted small" style="padding:20px;text-align:center;color:#fda4af">Falha ao carregar o ranking.</p>';
    }
  }

  // Recarrega ranking ao entrar na aba
  const _origSwitchView = window.switchView;
  window.switchView = function (name) {
    if (typeof _origSwitchView === 'function') _origSwitchView.apply(this, arguments);
    if (name === 'ranking') { renderRankHero(); refreshRanking(); }
  };
})();