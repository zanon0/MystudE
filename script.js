/* =========================================================
   My StudE — v7.0
   ========================================================= */
const STORAGE_KEY = 'mystude_v2';

const CONCURSOS = {
  pmsp:{name:'PMSP',full:'Polícia Militar de São Paulo',icon:'shield',blocks:[
    {name:'Português',topics:['Interpretação de texto','Gramática','Questões']},
    {name:'Matemática',topics:['Operações','Porcentagem','Regra de três','Problemas']},
    {name:'História',topics:['História Geral','História do Brasil']},
    {name:'Geografia',topics:['Geografia Geral','Geografia do Brasil']},
    {name:'Administração Pública',topics:['Constituição Federal','Legislação','Administração Pública']},
    {name:'Informática e Atualidades',topics:['Informática','Atualidades']}
  ]},
  pcsp:{name:'PCSP',full:'Polícia Civil de São Paulo',icon:'badge-check',blocks:[
    {name:'Português',topics:['Interpretação','Gramática','Redação']},
    {name:'Raciocínio Lógico',topics:['Lógica proposicional','Combinatória','Probabilidade']},
    {name:'Direito',topics:['Constitucional','Administrativo','Penal','Processual Penal']},
    {name:'Informática',topics:['Office','Redes','Segurança']},
    {name:'Criminologia',topics:['Conceitos','Escolas penais']}
  ]},
  pf:{name:'PF',full:'Polícia Federal',icon:'shield-check',blocks:[
    {name:'Português',topics:['Interpretação','Gramática']},
    {name:'Direito Constitucional',topics:['Direitos fundamentais','Organização do Estado']},
    {name:'Direito Administrativo',topics:['Princípios','Atos','Licitações']},
    {name:'Direito Penal',topics:['Parte geral','Parte especial']},
    {name:'Informática',topics:['Redes','Segurança','Banco de dados']},
    {name:'Raciocínio Lógico',topics:['Lógica','Matemática']}
  ]},
  prf:{name:'PRF',full:'Polícia Rodoviária Federal',icon:'truck',blocks:[
    {name:'Português',topics:['Interpretação','Gramática']},
    {name:'Física',topics:['Cinemática','Dinâmica','Energia']},
    {name:'Direito',topics:['Constitucional','Administrativo','Penal','Trânsito']},
    {name:'Informática',topics:['Básico','Redes']},
    {name:'Raciocínio Lógico',topics:['Lógica','Matemática']}
  ]},
  enem:{name:'ENEM',full:'Exame Nacional do Ensino Médio',icon:'book-open',blocks:[
    {name:'Linguagens',topics:['Português','Literatura','Redação','Inglês']},
    {name:'Matemática',topics:['Álgebra','Geometria','Estatística']},
    {name:'Ciências Humanas',topics:['História','Geografia','Filosofia','Sociologia']},
    {name:'Ciências da Natureza',topics:['Física','Química','Biologia']}
  ]},
  custom:{name:'Personalizado',full:'Monte seu próprio plano',icon:'sparkles',blocks:[]}
};

const SUBJECT_LEVELS = [
  {key:'medio',name:'Médio'},
  {key:'avancado',name:'Avançado'},
  {key:'mestre',name:'Mestre'}
];

const RANKS = [
  {n:1,xp:0,rank:'Recruta'},{n:2,xp:300,rank:'Soldado'},{n:3,xp:800,rank:'Cabo'},
  {n:4,xp:1500,rank:'Sargento 3º'},{n:5,xp:2500,rank:'Sargento 2º'},{n:6,xp:4000,rank:'Sargento 1º'},
  {n:7,xp:6000,rank:'Subtenente'},{n:8,xp:8500,rank:'Aspirante'},{n:9,xp:12000,rank:'Tenente'},
  {n:10,xp:16000,rank:'Capitão'},{n:11,xp:21000,rank:'Major'},{n:12,xp:27000,rank:'Tenente-Coronel'},
  {n:13,xp:35000,rank:'Coronel'},{n:14,xp:50000,rank:'General'}
];

const ACHIEVEMENTS = [
  {id:'h5',cat:'hours',name:'Primeiros Passos',desc:'5 horas de estudo',icon:'footprints',tier:'bronze',target:5,unit:'h'},
  {id:'h10',cat:'hours',name:'Dedicação',desc:'10 horas de estudo',icon:'book-open',tier:'bronze',target:10,unit:'h'},
  {id:'h15',cat:'hours',name:'Constância',desc:'15 horas de estudo',icon:'calendar-check',tier:'bronze',target:15,unit:'h'},
  {id:'h20',cat:'hours',name:'Compromisso',desc:'20 horas de estudo',icon:'flame',tier:'silver',target:20,unit:'h'},
  {id:'h30',cat:'hours',name:'Disciplina',desc:'30 horas de estudo',icon:'shield',tier:'silver',target:30,unit:'h'},
  {id:'h40',cat:'hours',name:'Foco Total',desc:'40 horas de estudo',icon:'crosshair',tier:'silver',target:40,unit:'h'},
  {id:'h50',cat:'hours',name:'Meio Caminho',desc:'50 horas de estudo',icon:'milestone',tier:'gold',target:50,unit:'h'},
  {id:'h60',cat:'hours',name:'Veterano',desc:'60 horas de estudo',icon:'medal',tier:'gold',target:60,unit:'h'},
  {id:'h80',cat:'hours',name:'Maratonista',desc:'80 horas de estudo',icon:'zap',tier:'gold',target:80,unit:'h'},
  {id:'h100',cat:'hours',name:'Centurião',desc:'100 horas de estudo',icon:'crown',tier:'gold',target:100,unit:'h'},
  {id:'h150',cat:'hours',name:'Mestre do Tempo',desc:'150 horas',icon:'timer',tier:'platinum',target:150,unit:'h'},
  {id:'h200',cat:'hours',name:'Lenda Viva',desc:'200 horas',icon:'star',tier:'platinum',target:200,unit:'h'},
  {id:'h300',cat:'hours',name:'Inquebrável',desc:'300 horas',icon:'trophy',tier:'platinum',target:300,unit:'h'},
  {id:'h500',cat:'hours',name:'Lendário',desc:'500 horas',icon:'award',tier:'platinum',target:500,unit:'h'},
  {id:'q25',cat:'questions',name:'Aquecimento',desc:'25 questões',icon:'play-circle',tier:'bronze',target:25,unit:'q'},
  {id:'q50',cat:'questions',name:'Ritmo',desc:'50 questões',icon:'target',tier:'bronze',target:50,unit:'q'},
  {id:'q100',cat:'questions',name:'Centena',desc:'100 questões',icon:'crosshair',tier:'bronze',target:100,unit:'q'},
  {id:'q250',cat:'questions',name:'Praticante',desc:'250 questões',icon:'zap',tier:'silver',target:250,unit:'q'},
  {id:'q500',cat:'questions',name:'Meio Milhar',desc:'500 questões',icon:'flame',tier:'silver',target:500,unit:'q'},
  {id:'q1000',cat:'questions',name:'Milhar',desc:'1.000 questões',icon:'medal',tier:'gold',target:1000,unit:'q'},
  {id:'q2500',cat:'questions',name:'Destemido',desc:'2.500 questões',icon:'shield',tier:'gold',target:2500,unit:'q'},
  {id:'q5000',cat:'questions',name:'Implacável',desc:'5.000 questões',icon:'trophy',tier:'platinum',target:5000,unit:'q'},
  {id:'q10000',cat:'questions',name:'Enciclopédia',desc:'10.000 questões',icon:'crown',tier:'platinum',target:10000,unit:'q'},
  {id:'s3',cat:'streak',name:'Três é demais',desc:'3 dias seguidos',icon:'flame',tier:'bronze',target:3,unit:'d'},
  {id:'s7',cat:'streak',name:'Semana Perfeita',desc:'7 dias seguidos',icon:'flame',tier:'bronze',target:7,unit:'d'},
  {id:'s15',cat:'streak',name:'Quinzena',desc:'15 dias seguidos',icon:'flame',tier:'silver',target:15,unit:'d'},
  {id:'s30',cat:'streak',name:'Mês Inteiro',desc:'30 dias seguidos',icon:'calendar',tier:'gold',target:30,unit:'d'},
  {id:'s60',cat:'streak',name:'Dois Meses',desc:'60 dias seguidos',icon:'calendar-check',tier:'gold',target:60,unit:'d'},
  {id:'s100',cat:'streak',name:'Centenário',desc:'100 dias seguidos',icon:'crown',tier:'platinum',target:100,unit:'d'},
  {id:'c1',cat:'cycle',name:'Primeiro Ciclo',desc:'1 ciclo completo',icon:'refresh-cw',tier:'bronze',target:1,unit:'c'},
  {id:'c5',cat:'cycle',name:'Ciclista',desc:'5 ciclos',icon:'repeat',tier:'silver',target:5,unit:'c'},
  {id:'c10',cat:'cycle',name:'Volta Redonda',desc:'10 ciclos',icon:'rotate-cw',tier:'gold',target:10,unit:'c'},
  {id:'acc70',cat:'accuracy',name:'Na Média',desc:'70% em 100+ questões',icon:'check-circle',tier:'silver',target:70,unit:'%'},
  {id:'acc80',cat:'accuracy',name:'Preciso',desc:'80% em 250+ questões',icon:'check-circle-2',tier:'gold',target:80,unit:'%'},
  {id:'acc90',cat:'accuracy',name:'Sniper',desc:'90% em 500+ questões',icon:'crosshair',tier:'platinum',target:90,unit:'%'},
  {id:'r10',cat:'records',name:'Anotador',desc:'10 registros',icon:'clipboard-list',tier:'bronze',target:10,unit:'r'},
  {id:'r50',cat:'records',name:'Historiador',desc:'50 registros',icon:'clipboard-check',tier:'silver',target:50,unit:'r'},
  {id:'r100',cat:'records',name:'Arquivista',desc:'100 registros',icon:'archive',tier:'gold',target:100,unit:'r'}
];
const TIER_ORDER={bronze:0,silver:1,gold:2,platinum:3};

const SUBJECT_COLORS = {
  'Português':'#818cf8','Matemática':'#38bdf8','História':'#fbbf24','Geografia':'#34d399',
  'Administração Pública':'#f472b6','Informática':'#60a5fa','Atualidades':'#fb923c','Questões':'#f97316',
  'Raciocínio Lógico':'#06b6d4','Direito':'#a855f7','Física':'#3b82f6','Química':'#10b981',
  'Biologia':'#84cc16','Linguagens':'#ec4899','Ciências Humanas':'#f59e0b','Ciências da Natureza':'#06b6d4',
  'Direito Constitucional':'#8b5cf6','Direito Administrativo':'#a78bfa','Direito Penal':'#f43f5e',
  'Criminologia':'#ef4444','História e Geografia':'#fbbf24'
};
const EVENT_COLORS={red:'#f43f5e',gold:'#f59e0b',green:'#10b981',blue:'#3b82f6',purple:'#a855f7'};

const TAB_DEFS=[
  {id:'dashboard',label:'Dashboard',icon:'layout-dashboard'},
  {id:'ciclo',label:'Ciclo',icon:'refresh-cw'},
  {id:'registros',label:'Registrar',icon:'clock'},
  {id:'stats',label:'Estatísticas',icon:'bar-chart-3'},
  {id:'questoes',label:'Questões',icon:'target'},
  {id:'conquistas',label:'Conquistas',icon:'award'},
  {id:'ranking',label:'Ranking',icon:'trophy'},
  {id:'calendario',label:'Calendário',icon:'calendar'},
  {id:'config',label:'Configurações',icon:'settings'}
];

/* HELPERS */
const todayStr=()=>{const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const dateToStr=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const strToDate=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const addDays=(s,n)=>{const d=strToDate(s);d.setDate(d.getDate()+n);return dateToStr(d);};
function startOfWeek(s){const d=strToDate(s);const day=d.getDay();d.setDate(d.getDate()+(day===0?-6:1-day));return dateToStr(d);}
const endOfWeek=s=>addDays(startOfWeek(s),6);
const startOfMonth=s=>{const d=strToDate(s);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;};
const endOfMonth=s=>{const d=strToDate(s);const l=new Date(d.getFullYear(),d.getMonth()+1,0);return dateToStr(l);};
const fmtDateBR=s=>{if(!s)return'—';const[y,m,d]=s.split('-');return`${d}/${m}/${y}`;};
const fmtDateLong=s=>strToDate(s).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
function fmtMinutes(m){m=Math.round(m);const h=Math.floor(m/60),mm=m%60;if(h===0)return`${mm}min`;return`${h}h${String(mm).padStart(2,'0')}`;}
function fmtSeconds(s){s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const escapeHtml=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escapeAttr=escapeHtml;

/* STATE */
let state=null;
const defaultVisibleTabs=()=>TAB_DEFS.reduce((o,t)=>(o[t.id]=true,o),{});
function defaultState(){
  const today=todayStr();
  return {
    studies:[],questions:[],calendarEvents:[],
    concurso:null,
    cycle:{startDate:today,blocks:[],cyclesCompleted:0},
    unlockedAchievements:{},
    settings:{dailyGoalMin:240,qGoalMin:120,cycleStartDate:today,visibleTabs:defaultVisibleTabs()},
    timers:{q:{accumulated:0,startTime:null,running:false},study:{accumulated:0,startTime:null,running:false}},
    ui:{calMonth:today.slice(0,7)}
  };
}
function loadState(){
  try{
    const raw=localStorage.getItem(STORAGE_KEY);
    if(!raw)return defaultState();
    const p=JSON.parse(raw);const d=defaultState();
    const m={...d,...p,
      cycle:{...d.cycle,...(p.cycle||{})},
      settings:{...d.settings,...(p.settings||{}),visibleTabs:{...d.settings.visibleTabs,...((p.settings||{}).visibleTabs||{})}},
      timers:{q:{...d.timers.q,...(p.timers?.q||{})},study:{...d.timers.study,...(p.timers?.study||{})}},
      ui:{...d.ui,...(p.ui||{})}};
    if(!Array.isArray(m.calendarEvents))m.calendarEvents=[];
    if(!Array.isArray(m.cycle.blocks))m.cycle.blocks=[];
    if(!m.unlockedAchievements||typeof m.unlockedAchievements!=='object')m.unlockedAchievements={};
    return m;
  }catch(e){console.error(e);return defaultState();}
}
const saveState=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){console.error(e);toast('Erro ao salvar','warn');}};

/* TOAST */
let toastTimer=null;
function toast(msg,type=''){
  const el=document.getElementById('toast');
  el.textContent=msg;el.className='toast show '+type;
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{el.className='toast '+type;},2600);
}
const refreshIcons=()=>{if(window.lucide&&window.lucide.createIcons)setTimeout(()=>window.lucide.createIcons(),0);};

/* CONCURSO */
function applyConcursoBlocks(key){
  const c=CONCURSOS[key];if(!c)return;
  state.cycle.blocks=c.blocks.map((b,i)=>({id:i,name:b.name,topics:b.topics.slice(),completed:false,completedDate:null,level:0,levelProgress:0}));
  state.cycle.startDate=todayStr();
  state.cycle.cyclesCompleted=state.cycle.cyclesCompleted||0;
}

/* CÁLCULOS */
const totalMinutesOn=ds=>state.studies.filter(s=>s.date===ds).reduce((a,s)=>a+s.minutes,0);
const totalMinutesRange=(f,t)=>state.studies.filter(s=>s.date>=f&&s.date<=t).reduce((a,s)=>a+s.minutes,0);
const questionsMinutesOn=ds=>state.questions.filter(q=>q.date===ds).reduce((a,q)=>a+q.minutes,0);
const totalQuestionsCount=()=>state.questions.reduce((a,q)=>a+q.count,0);
const totalCorrectCount=()=>state.questions.reduce((a,q)=>a+q.correct,0);
const totalStudyMinutes=()=>state.studies.reduce((a,s)=>a+s.minutes,0);
const totalStudyHours=()=>totalStudyMinutes()/60;

function studyStreak(){
  let s=0,d=todayStr();
  if(totalMinutesOn(d)===0&&questionsMinutesOn(d)===0)d=addDays(d,-1);
  while(totalMinutesOn(d)>0||questionsMinutesOn(d)>0){s++;d=addDays(d,-1);}
  return s;
}
function cycleProgress(){
  const done=state.cycle.blocks.filter(b=>b.completed).length;
  const total=state.cycle.blocks.length;
  return{done,total,pct:total?Math.round(done/total*100):0};
}
const currentBlockIndex=()=>{const i=state.cycle.blocks.findIndex(b=>!b.completed);return i===-1?0:i;};
function hoursBySubject(f,t){
  const map={};state.studies.forEach(s=>{if(s.date<f||s.date>t)return;map[s.subject]=(map[s.subject]||0)+s.minutes;});
  return map;
}
const eventsOn=ds=>state.calendarEvents.filter(e=>e.date===ds);

window.totalMinutesOn=totalMinutesOn;
window.totalMinutesRange=totalMinutesRange;
window.questionsMinutesOn=questionsMinutesOn;
window.totalQuestionsCount=totalQuestionsCount;
window.totalStudyMinutes=totalStudyMinutes;
window.studyStreak=studyStreak;

/* XP */
function calcTotalXP(){
  const studyXP=totalStudyMinutes()*1;
  const qXP=totalQuestionsCount()*3;
  const cycleXP=(state.cycle.cyclesCompleted||0)*100;
  return studyXP+qXP+cycleXP;
}
function getRankForXP(xp){
  let cur=RANKS[0],next=null;
  for(let i=0;i<RANKS.length;i++){if(xp>=RANKS[i].xp)cur=RANKS[i];else{next=RANKS[i];break;}}
  return{current:cur,next};
}
function getXPProgress(){
  const xp=calcTotalXP();
  const{current,next}=getRankForXP(xp);
  const base=current.xp,cap=next?next.xp:current.xp+1;
  const pct=next?Math.round((xp-base)/(cap-base)*100):100;
  return{xp,current,next,pct,base,cap};
}
function checkLevelUp(oldXP,newXP){
  if(newXP<=oldXP)return;
  const oldRank=getRankForXP(oldXP).current.n;
  const info=getRankForXP(newXP);
  if(info.current.n>oldRank)showLevelUp(info.current);
}
function showLevelUp(rank){
  document.getElementById('levelupRank').textContent=rank.rank;
  document.getElementById('levelupLevel').textContent=`Nível ${rank.n}`;
  document.getElementById('levelupXP').textContent=`${rank.xp.toLocaleString('pt-BR')} XP`;
  const ov=document.getElementById('levelupOverlay');
  ov.classList.add('show');refreshIcons();
  setTimeout(()=>ov.classList.remove('show'),3400);
}
window.calcTotalXP=calcTotalXP;
window.getXPProgress=getXPProgress;

/* ACHIEVEMENTS */
function calcAchProgress(a){
  switch(a.cat){
    case'hours':return totalStudyHours();
    case'questions':return totalQuestionsCount();
    case'streak':return studyStreak();
    case'cycle':return state.cycle.cyclesCompleted||0;
    case'records':return state.studies.length;
    case'accuracy':{
      const totalQ=totalQuestionsCount();
      const min={acc70:100,acc80:250,acc90:500}[a.id]||100;
      if(totalQ<min)return 0;
      return totalQ>0?Math.round(totalCorrectCount()/totalQ*100):0;
    }
  }
  return 0;
}
function checkAchievements(showPopup=true){
  const newly=[];
  ACHIEVEMENTS.forEach(a=>{
    if(state.unlockedAchievements[a.id])return;
    if(calcAchProgress(a)>=a.target){state.unlockedAchievements[a.id]=Date.now();newly.push(a);}
  });
  if(newly.length){
    saveState();renderAchievements();
    if(showPopup)newly.forEach((a,i)=>setTimeout(()=>showAchPopup(a),i*1400));
  }
  return newly;
}
let achPopupTimer=null;
function showAchPopup(a){
  const pop=document.getElementById('achPopup');
  document.getElementById('achPopupName').textContent=a.name;
  document.getElementById('achPopupDesc').textContent=a.desc;
  document.getElementById('achPopupIcon').innerHTML=`<i data-lucide="${a.icon}"></i>`;
  pop.classList.add('show');refreshIcons();
  clearTimeout(achPopupTimer);
  achPopupTimer=setTimeout(()=>pop.classList.remove('show'),3600);
}

/* VIEWS */
const VIEW_TITLES={dashboard:'Dashboard',ciclo:'Ciclo de Estudos',registros:'Registrar Estudo',stats:'Estatísticas',questoes:'Central de Questões',conquistas:'Conquistas',ranking:'Ranking',calendario:'Calendário',config:'Configurações'};
function switchView(name){
  if(name!=='config'&&state.settings.visibleTabs[name]===false)name='config';
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  const b=document.querySelector(`.nav-item[data-view="${name}"]`);if(b)b.classList.add('active');
  document.getElementById('pageTitle').textContent=VIEW_TITLES[name]||name;
  closeSidebar();
  if(name==='stats')setTimeout(renderCharts,50);
  if(name==='config'){renderTabsVisibility();renderEventsList();renderConcursoGridCfg();}
  if(name==='conquistas')renderAchievements();
  if(name==='dashboard')renderDashboard();
  refreshIcons();
}
window.switchView=switchView;

const openSidebar=()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('overlay').classList.add('show');};
const closeSidebar=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('overlay').classList.remove('show');};

function applyTabVisibility(){
  TAB_DEFS.forEach(t=>{
    const b=document.querySelector(`.nav-item[data-view="${t.id}"]`);
    if(b)b.classList.toggle('hidden',state.settings.visibleTabs[t.id]===false);
  });
  const active=document.querySelector('.view.active');
  if(active){
    const id=active.id.replace('view-','');
    if(id!=='config'&&state.settings.visibleTabs[id]===false)
      switchView(state.settings.visibleTabs.dashboard?'dashboard':'config');
  }
}

/* DASHBOARD */
function renderDashboard(){
  const today=todayStr();
  const ws=startOfWeek(today),we=endOfWeek(today);
  const ms=startOfMonth(today),me=endOfMonth(today);
  const todayMin=totalMinutesOn(today);
  const weekMin=totalMinutesRange(ws,we);
  const monthMin=totalMinutesRange(ms,me);
  const totalQ=totalQuestionsCount();
  const cp=cycleProgress();
  const qMin=questionsMinutesOn(today);
  const dailyGoal=state.settings.dailyGoalMin;
  const goalPct=Math.min(100,Math.round(todayMin/dailyGoal*100));
  const streak=studyStreak();
  const{xp,current}=getXPProgress();

  const hour=new Date().getHours();
  document.getElementById('heroGreet').textContent=hour<12?'Bom dia':hour<18?'Boa tarde':'Boa noite';
  document.getElementById('heroTitle').textContent=streak>0?`${streak} dia${streak>1?'s':''} de foco 🔥`:'Vamos estudar?';
  document.getElementById('heroSub').textContent=goalPct>=100?'Meta diária batida!':`Você já acumulou ${fmtMinutes(todayMin)} hoje.`;
  document.getElementById('heroXP').textContent=xp.toLocaleString('pt-BR');

  const cards=[
    {i:'clock',l:'Hoje',v:fmtMinutes(todayMin),s:`Meta: ${fmtMinutes(dailyGoal)}`,c:''},
    {i:'calendar-days',l:'Semana',v:fmtMinutes(weekMin),s:'desde segunda',c:'blue'},
    {i:'calendar',l:'Mês',v:fmtMinutes(monthMin),s:'no mês atual',c:'blue'},
    {i:'help-circle',l:'Questões',v:qMin?fmtMinutes(qMin):'0min',s:`${totalQ} no total`,c:'gold'},
    {i:'zap',l:'XP Total',v:xp.toLocaleString('pt-BR'),s:`Rank: ${current.rank}`,c:'gold'},
    {i:'refresh-cw',l:'Ciclo',v:`${cp.done}/${cp.total}`,s:`${cp.pct}% concluído`,c:''},
    {i:'flame',l:'Sequência',v:`${streak}d`,s:'dias seguidos',c:'gold'},
    {i:'target',l:'Meta diária',v:`${goalPct}%`,s:`${fmtMinutes(todayMin)} de ${fmtMinutes(dailyGoal)}`,c:goalPct>=100?'green':''}
  ];
  document.getElementById('statGrid').innerHTML=cards.map(c=>`
    <div class="stat-card ${c.c}">
      <div class="stat-icon"><i data-lucide="${c.i}"></i></div>
      <div class="stat-value">${c.v}</div>
      <div class="stat-label">${c.l}</div>
      <div class="stat-sub">${c.s}</div>
    </div>`).join('');

  renderNextSteps();

  document.getElementById('dashCyclePct').textContent=cp.pct+'%';
  document.getElementById('dashCycle').innerHTML=state.cycle.blocks.map((b,i)=>{
    const cur=i===currentBlockIndex();
    return`<div class="subject-row">
      <span class="dot-c" style="background:${b.completed?'#34d399':(cur?'#818cf8':'#4b5563')}"></span>
      <span class="name">${escapeHtml(b.name)} <span class="muted small">· ${SUBJECT_LEVELS[b.level||0].name}</span></span>
      <span class="val" style="color:${b.completed?'#34d399':'#818cf8'};font-size:12px">${b.completed?'✔':(cur?'▶ Atual':b.levelProgress+'%')}</span>
    </div>`;
  }).join('')||'<div class="muted small">Sem matérias. Vá em Ciclo.</div>';

  const unlocked=Object.entries(state.unlockedAchievements).sort((a,b)=>b[1]-a[1]).slice(0,3)
    .map(([id])=>ACHIEVEMENTS.find(a=>a.id===id)).filter(Boolean);
  const achWrap=document.getElementById('dashAch');
  if(!unlocked.length){
    achWrap.innerHTML='<div class="ach-empty"><i data-lucide="lock" style="margin-right:6px"></i>Nenhuma conquista ainda.</div>';
  }else{
    achWrap.innerHTML=unlocked.map(a=>renderAchCard(a,true)).join('');
  }
  refreshIcons();
}
window.renderDashboard=renderDashboard;

function renderNextSteps(){
  const wrap=document.getElementById('dashNext');if(!wrap)return;
  const steps=[];
  const{xp,current,next}=getXPProgress();

  if(next){
    const missing=next.xp-xp;
    steps.push({icon:'zap',title:`Faltam ${missing.toLocaleString('pt-BR')} XP para ${next.rank}`,desc:`${Math.ceil(missing)}min estudados ou ${Math.ceil(missing/3)} questões.`});
  }

  const lockedAchs=ACHIEVEMENTS.filter(a=>!state.unlockedAchievements[a.id]).map(a=>{
    const prog=calcAchProgress(a);
    return{a,prog,pct:Math.min(100,Math.round(prog/a.target*100)),missing:a.target-prog};
  }).filter(x=>x.pct>0&&x.pct<100).sort((a,b)=>b.pct-a.pct);

  if(lockedAchs.length){
    const top=lockedAchs[0];
    steps.push({icon:'award',title:`Próxima: ${top.a.name}`,desc:`${top.prog.toFixed(top.a.cat==='hours'?1:0)} de ${top.a.target} ${top.a.unit}.`});
  }

  const streak=studyStreak();
  if(streak>=3)steps.push({icon:'flame',title:`Sequência de ${streak} dias`,desc:'Mantenha o ritmo!'});

  if(totalMinutesOn(todayStr())===0)
    steps.push({icon:'play',title:'Nenhum estudo hoje ainda',desc:'Comece com 15–20 min para manter o hábito.'});

  wrap.innerHTML=steps.slice(0,4).map(s=>`
    <div class="subject-row" style="align-items:flex-start">
      <span style="color:var(--indigo-2);margin-top:2px"><i data-lucide="${s.icon}"></i></span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:800;margin-bottom:2px">${escapeHtml(s.title)}</div>
        <div class="muted small" style="line-height:1.4">${escapeHtml(s.desc)}</div>
      </div>
    </div>`).join('')||'<div class="muted small">Tudo em ordem!</div>';
}

/* CICLO */
function renderCycle(){
  const cp=cycleProgress();
  document.getElementById('cyclePct').textContent=cp.pct+'%';
  document.getElementById('cycleBar').style.width=cp.pct+'%';
  document.getElementById('cycleInfo').textContent=`${cp.done} de ${cp.total} blocos`;
  document.getElementById('cycleStartInfo').textContent=`Início: ${fmtDateBR(state.cycle.startDate)} · ${state.cycle.cyclesCompleted||0} ciclo(s) completo(s)`;

  const list=document.getElementById('blocksList');
  if(!state.cycle.blocks.length){
    list.innerHTML='<div class="panel muted" style="text-align:center;padding:40px">Nenhuma matéria. Clique em "➕ Nova matéria".</div>';
    return;
  }
  const curIdx=currentBlockIndex();
  list.innerHTML=state.cycle.blocks.map((b,i)=>{
    const isCur=i===curIdx&&!b.completed;
    const cls=b.completed?'done':(isCur?'current':'');
    const badge=b.completed?`<span class="tag green">✔ ${fmtDateBR(b.completedDate)}</span>`:(isCur?`<span class="tag gold">▶ Atual</span>`:`<span class="tag">Aguardando</span>`);
    const topics=(b.topics||[]).map(t=>`<li>${escapeHtml(t)}</li>`).join('');
    const lvl=SUBJECT_LEVELS[b.level||0];
    const pct=b.levelProgress||0;
    return`
      <div class="block ${cls}">
        <div class="block-head">
          <div class="block-title"><span class="block-num">${i+1}</span> ${escapeHtml(b.name)}</div>
          ${badge}
        </div>
        <ul class="block-topics">${topics}</ul>
        <div class="block-level">
          <div class="block-level-head"><span class="block-level-name">${lvl.name}</span><span class="block-level-pct">${pct}%</span></div>
          <div class="block-level-bar"><i style="width:${pct}%"></i></div>
        </div>
        <div class="block-foot">
          <button class="btn ${b.completed?'btn-ghost':'btn-primary'} btn-sm" data-toggle="${b.id}">${b.completed?'↺ Desmarcar':'✔ Concluir'}</button>
          <div class="block-actions">
            <button class="btn btn-icon btn-ghost" data-edit-block="${b.id}"><i data-lucide="pencil"></i></button>
            <button class="btn btn-icon btn-ghost" data-del-block="${b.id}"><i data-lucide="trash-2"></i></button>
          </div>
          <span class="block-date">${b.completed?'em '+fmtDateBR(b.completedDate):''}</span>
        </div>
      </div>`;
  }).join('');

  document.querySelectorAll('[data-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    const id=Number(btn.dataset.toggle);
    const blk=state.cycle.blocks.find(b=>b.id===id);if(!blk)return;
    const oldXP=calcTotalXP();
    if(blk.completed){blk.completed=false;blk.completedDate=null;toast('Desmarcado.','warn');}
    else{
      blk.completed=true;blk.completedDate=todayStr();toast(`"${blk.name}" concluído!`,'success');
      if(state.cycle.blocks.every(b=>b.completed)){
        state.cycle.cyclesCompleted=(state.cycle.cyclesCompleted||0)+1;
        setTimeout(()=>toast('🏆 Ciclo completo! +100 XP','success'),800);
      }
    }
    const newXP=calcTotalXP();
    checkLevelUp(oldXP,newXP);
    saveState();renderCycle();renderDashboard();checkAchievements();renderXPWidget();
  }));
  document.querySelectorAll('[data-edit-block]').forEach(b=>b.addEventListener('click',()=>openBlockModal(Number(b.dataset.editBlock))));
  document.querySelectorAll('[data-del-block]').forEach(b=>b.addEventListener('click',()=>deleteBlock(Number(b.dataset.delBlock))));
  refreshIcons();
}
window.renderCycle=renderCycle;

function restartCycle(){
  if(!confirm('Reiniciar o ciclo?'))return;
  state.cycle.blocks.forEach(b=>{b.completed=false;b.completedDate=null;});
  state.cycle.startDate=todayStr();
  saveState();renderCycle();renderDashboard();toast('Ciclo reiniciado.','success');
}

/* MODAL BLOCO */
let editingBlockId=null;
function openBlockModal(id=null){
  editingBlockId=id;
  document.getElementById('blockForm').reset();
  const del=document.getElementById('btnBlockDelete');
  const title=document.getElementById('blockModalTitle');
  const save=document.getElementById('btnBlockSave');
  if(id!==null){
    const b=state.cycle.blocks.find(x=>x.id===id);if(!b)return;
    title.textContent='Editar matéria';
    document.getElementById('blockName').value=b.name;
    document.getElementById('blockTopics').value=(b.topics||[]).join('\n');
    document.getElementById('blockLevel').value=b.level||0;
    document.getElementById('blockProgress').value=b.levelProgress||0;
    del.hidden=false;save.textContent='Salvar alterações';
  }else{
    title.textContent='Nova matéria';
    del.hidden=true;save.textContent='Adicionar';
  }
  document.getElementById('blockModal').classList.add('show');
  setTimeout(()=>document.getElementById('blockName').focus(),100);
  refreshIcons();
}
function saveBlockForm(e){
  e.preventDefault();
  const name=document.getElementById('blockName').value.trim();
  const topics=document.getElementById('blockTopics').value.split('\n').map(t=>t.trim()).filter(Boolean);
  const level=Number(document.getElementById('blockLevel').value)||0;
  const levelProgress=Math.max(0,Math.min(100,Number(document.getElementById('blockProgress').value)||0));
  if(!name){toast('Informe o nome da matéria.','warn');return;}
  if(editingBlockId!==null){
    const b=state.cycle.blocks.find(x=>x.id===editingBlockId);if(!b)return;
    Object.assign(b,{name,topics,level,levelProgress});
    toast('Matéria atualizada.','success');
  }else{
    const maxId=state.cycle.blocks.reduce((m,b)=>Math.max(m,Number(b.id)||0),-1);
    state.cycle.blocks.push({id:maxId+1,name,topics,completed:false,completedDate:null,level,levelProgress});
    toast('Matéria adicionada.','success');
  }
  saveState();closeModal('blockModal');renderCycle();renderDashboard();fillSubjectSelects();
}
function deleteBlock(id){
  const b=state.cycle.blocks.find(x=>x.id===id);if(!b)return;
  if(!confirm(`Excluir "${b.name}"?`))return;
  state.cycle.blocks=state.cycle.blocks.filter(x=>x.id!==id);
  saveState();closeModal('blockModal');renderCycle();renderDashboard();fillSubjectSelects();
  toast('Matéria excluída.','warn');
}

/* STUDIES */
function fillSubjectSelects(){
  const set=new Set(Object.keys(SUBJECT_COLORS));
  state.cycle.blocks.forEach(b=>set.add(b.name));
  state.studies.forEach(s=>set.add(s.subject));
  const subs=[...set];
  const opts=subs.map(s=>`<option value="${escapeAttr(s)}">${escapeHtml(s)}</option>`).join('');
  document.getElementById('sSubject').innerHTML=opts;
  document.getElementById('fSubject').innerHTML='<option value="">Todas as matérias</option>'+opts;
  document.getElementById('qSubject').innerHTML=opts;
}
window.fillSubjectSelects=fillSubjectSelects;

let editingStudyId=null;
function renderStudies(){
  const fSub=document.getElementById('fSubject').value;
  const fPer=document.getElementById('fPeriod').value;
  const today=todayStr();
  let from='0000-01-01',to='9999-12-31';
  if(fPer==='today'){from=to=today;}
  else if(fPer==='week'){from=startOfWeek(today);to=endOfWeek(today);}
  else if(fPer==='month'){from=startOfMonth(today);to=endOfMonth(today);}
  const filtered=state.studies.filter(s=>(fSub?s.subject===fSub:true)&&s.date>=from&&s.date<=to).sort((a,b)=>b.date.localeCompare(a.date));
  const total=filtered.reduce((a,s)=>a+s.minutes,0);

  document.getElementById('studyTotals').innerHTML=`
    <div class="item"><strong>${fmtMinutes(total)}</strong><span>Total</span></div>
    <div class="item"><strong>${filtered.length}</strong><span>Registros</span></div>
    <div class="item"><strong>${fmtMinutes(totalMinutesOn(today))}</strong><span>Hoje</span></div>
    <div class="item"><strong>${fmtMinutes(totalMinutesRange(startOfWeek(today),endOfWeek(today)))}</strong><span>Semana</span></div>
    <div class="item"><strong>${fmtMinutes(totalMinutesRange(startOfMonth(today),endOfMonth(today)))}</strong><span>Mês</span></div>
  `;
  const tbody=!filtered.length
    ?`<tbody><tr><td colspan="6" class="empty">Nenhum registro.</td></tr></tbody>`
    :`<tbody>${filtered.map(s=>`
      <tr>
        <td>${fmtDateBR(s.date)}</td>
        <td><span class="tag" style="color:${SUBJECT_COLORS[s.subject]||'#818cf8'}">${escapeHtml(s.subject)}</span></td>
        <td>${fmtMinutes(s.minutes)}</td>
        <td>${escapeHtml(s.type||'—')}</td>
        <td class="muted small">${escapeHtml(s.notes||'—')}</td>
        <td>
          <button class="btn btn-icon btn-ghost" data-edit="${s.id}"><i data-lucide="pencil"></i></button>
          <button class="btn btn-icon btn-ghost" data-del="${s.id}"><i data-lucide="trash-2"></i></button>
        </td>
      </tr>`).join('')}</tbody>`;
  document.getElementById('studiesTable').innerHTML=`<thead><tr><th>Data</th><th>Matéria</th><th>Duração</th><th>Tipo</th><th>Obs.</th><th></th></tr></thead>${tbody}`;
  document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>startEditStudy(b.dataset.edit)));
  document.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',()=>deleteStudy(b.dataset.del)));
  refreshIcons();
}
window.renderStudies=renderStudies;

function startEditStudy(id){
  const s=state.studies.find(x=>x.id===id);if(!s)return;
  editingStudyId=id;
  document.getElementById('sSubject').value=s.subject;
  document.getElementById('sDate').value=s.date;
  document.getElementById('sHours').value=Math.floor(s.minutes/60);
  document.getElementById('sMinutes').value=s.minutes%60;
  document.getElementById('sType').value=s.type||'Teoria';
  document.getElementById('sNotes').value=s.notes||'';
  document.getElementById('studyFormTitle').textContent='Editar Registro';
  document.getElementById('btnStudySubmit').innerHTML='<i data-lucide="check"></i> Salvar';
  document.getElementById('btnCancelEdit').hidden=false;
  refreshIcons();
  window.scrollTo({top:0,behavior:'smooth'});
}
function cancelEditStudy(){
  editingStudyId=null;
  document.getElementById('studyForm').reset();
  document.getElementById('sDate').value=todayStr();
  document.getElementById('studyFormTitle').textContent='Novo Registro';
  document.getElementById('btnStudySubmit').innerHTML='<i data-lucide="plus"></i> Adicionar';
  document.getElementById('btnCancelEdit').hidden=true;
  refreshIcons();
}
function deleteStudy(id){
  if(!confirm('Excluir registro?'))return;
  state.studies=state.studies.filter(s=>s.id!==id);
  saveState();renderStudies();renderDashboard();renderCharts();toast('Excluído.','warn');
}
function handleStudySubmit(e){
  e.preventDefault();
  const subject=document.getElementById('sSubject').value;
  const date=document.getElementById('sDate').value;
  const h=Number(document.getElementById('sHours').value)||0;
  const m=Number(document.getElementById('sMinutes').value)||0;
  const type=document.getElementById('sType').value;
  const notes=document.getElementById('sNotes').value.trim();
  const minutes=h*60+m;
  if(minutes<=0){toast('Duração deve ser maior que zero.','warn');return;}
  const oldXP=calcTotalXP();
  const wasEditing=!!editingStudyId;
  if(wasEditing){
    const s=state.studies.find(x=>x.id===editingStudyId);
    Object.assign(s,{subject,date,minutes,type,notes});
    toast('Atualizado.','success');
  }else{
    state.studies.push({id:uid(),subject,date,minutes,type,notes});
    const blk=state.cycle.blocks.find(b=>b.name===subject);
    if(blk){
      blk.levelProgress=Math.min(100,(blk.levelProgress||0)+Math.round(minutes/60));
      if(blk.levelProgress>=100&&blk.level<2)toast(`🎉 Pronto para subir para ${SUBJECT_LEVELS[blk.level+1].name}!`,'success');
    }
    toast('Registro adicionado.','success');
  }
  saveState();cancelEditStudy();
  if(!wasEditing){state.timers.study={accumulated:0,startTime:null,running:false};saveState();updateTimerDisplays();renderTimerButtons();}
  const newXP=calcTotalXP();
  checkLevelUp(oldXP,newXP);
  renderStudies();renderCycle();renderDashboard();renderCharts();
  checkAchievements();renderXPWidget();
}

/* CHARTS */
let chartBar=null,chartPie=null,statsRange='week';
function renderCharts(){
  const today=todayStr();
  let from,to;
  if(statsRange==='day'){from=to=today;}
  else if(statsRange==='week'){from=startOfWeek(today);to=endOfWeek(today);}
  else if(statsRange==='month'){from=startOfMonth(today);to=endOfMonth(today);}
  else{from='0000-01-01';to='9999-12-31';}
  const map=hoursBySubject(from,to);
  const labels=Object.keys(map);
  const values=labels.map(k=>+(map[k]/60).toFixed(2));
  const colors=labels.map(k=>SUBJECT_COLORS[k]||'#818cf8');
  const ctxBar=document.getElementById('chartBar');
  if(chartBar)chartBar.destroy();
  chartBar=new Chart(ctxBar,{
    type:'bar',
    data:{labels,datasets:[{label:'Horas',data:values,backgroundColor:colors,borderRadius:8,borderSkipped:false,maxBarThickness:44}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.parsed.y.toFixed(2)} h`}}},
      scales:{x:{ticks:{color:'#7a869f',font:{size:11}},grid:{display:false}},y:{beginAtZero:true,ticks:{color:'#7a869f',font:{size:11}},grid:{color:'rgba(129,140,248,.06)'}}}}
  });
  const nz=labels.filter(l=>map[l]>0);
  const ctxPie=document.getElementById('chartPie');
  if(chartPie)chartPie.destroy();
  chartPie=new Chart(ctxPie,{
    type:'doughnut',
    data:{labels:nz.length?nz:['Sem dados'],datasets:[{data:nz.length?nz.map(l=>map[l]):[1],backgroundColor:nz.length?nz.map(l=>SUBJECT_COLORS[l]||'#555'):['#333'],borderWidth:0}]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{position:'bottom',labels:{color:'#7a869f',font:{size:11},padding:10,boxWidth:12}},
        tooltip:{callbacks:{label:c=>{const t=c.dataset.data.reduce((a,b)=>a+b,0);const p=t?(c.parsed/t*100).toFixed(1):0;return`${c.label}: ${fmtMinutes(c.parsed)} (${p}%)`;}}}},
      cutout:'64%'}
  });
  const maxVal=Math.max(...values,1);
  document.getElementById('subjectSummary').innerHTML=labels.map((l,i)=>`
    <div class="subject-row">
      <span class="dot-c" style="background:${colors[i]}"></span>
      <span class="name">${escapeHtml(l)}</span>
      <div class="mini-bar"><i style="width:${values[i]/maxVal*100}%;background:${colors[i]}"></i></div>
      <span class="val">${values[i].toFixed(2)}h</span>
    </div>`).join('')||'<div class="muted small">Sem registros.</div>';
}
window.renderCharts=renderCharts;

/* QUESTÕES */
function renderQuestions(){
  const today=todayStr();
  const doneMin=questionsMinutesOn(today);
  const goal=state.settings.qGoalMin;
  const pct=Math.min(100,Math.round(doneMin/goal*100));
  document.getElementById('qGoalText').textContent=`${doneMin}min / ${goal}min`;
  document.getElementById('qGoalBar').style.width=pct+'%';
  const st=document.getElementById('qGoalStatus');
  if(doneMin>=goal){st.textContent='✅ Meta de questões concluída!';st.className='goal-status ok';}
  else{st.textContent=`Faltam ${goal-doneMin} minutos.`;st.className='goal-status pending';}

  const hist=[...state.questions].sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('qHistorySummary').textContent=`${hist.length} sessões`;
  const tb=!hist.length
    ?`<tbody><tr><td colspan="7" class="empty">Nenhuma sessão.</td></tr></tbody>`
    :`<tbody>${hist.map(q=>{const p=q.count>0?Math.round(q.correct/q.count*100):0;
      return`<tr><td>${fmtDateBR(q.date)}</td><td>${escapeHtml(q.subject)}</td><td>${fmtMinutes(q.minutes)}</td><td>${q.count}</td><td>${q.correct}</td><td>${q.wrong}</td><td><span class="tag ${p>=70?'green':p>=50?'gold':'red'}">${p}%</span></td></tr>`;}).join('')}</tbody>`;
  document.getElementById('qTable').innerHTML=`<thead><tr><th>Data</th><th>Matéria</th><th>Tempo</th><th>Qtd</th><th>Acertos</th><th>Erros</th><th>%</th></tr></thead>${tb}`;
}
window.renderQuestions=renderQuestions;

/* CONQUISTAS */
let achFilter='all';
function renderAchCard(a,compact=false){
  const unlocked=!!state.unlockedAchievements[a.id];
  const prog=calcAchProgress(a);
  const pct=Math.min(100,Math.round(prog/a.target*100));
  const progText=unlocked?'Desbloqueada':`${a.cat==='hours'?prog.toFixed(1):Math.round(prog)} / ${a.target} ${a.unit}`;
  return`
    <div class="ach-card ${unlocked?'unlocked':'locked'}" data-tier="${a.tier}">
      <div class="ach-icon"><i data-lucide="${unlocked?a.icon:'lock'}"></i></div>
      <div class="ach-info">
        <div class="ach-tier">${a.tier}</div>
        <div class="ach-name">${escapeHtml(a.name)}</div>
        <div class="ach-desc">${escapeHtml(a.desc)}</div>
        <div class="ach-progress-mini"><i style="width:${unlocked?100:pct}%"></i></div>
        ${compact?'':`<div class="ach-progress-text">${progText}</div>`}
      </div>
    </div>`;
}
function renderAchievements(){
  const grid=document.getElementById('achGrid');if(!grid)return;
  const list=achFilter==='all'?ACHIEVEMENTS:ACHIEVEMENTS.filter(a=>a.cat===achFilter);
  const sorted=[...list].sort((a,b)=>{
    const ua=state.unlockedAchievements[a.id]?1:0;
    const ub=state.unlockedAchievements[b.id]?1:0;
    if(ua!==ub)return ub-ua;
    return TIER_ORDER[b.tier]-TIER_ORDER[a.tier];
  });
  grid.innerHTML=sorted.map(a=>renderAchCard(a)).join('');
  const total=ACHIEVEMENTS.length;
  const unlocked=Object.keys(state.unlockedAchievements).length;
  const pct=Math.round(unlocked/total*100);
  document.getElementById('achOverall').textContent=pct+'%';
  document.getElementById('achOverallBar').style.width=pct+'%';
  document.getElementById('achSummary').textContent=`${unlocked} de ${total} conquistas desbloqueadas (${pct}%)`;
  document.querySelectorAll('#achFilters button').forEach(b=>{b.classList.toggle('active',b.dataset.cat===achFilter);});
  refreshIcons();
}
window.renderAchievements=renderAchievements;

/* CALENDÁRIO */
let calMonth=null;
function renderCalendar(){
  const base=calMonth||state.ui.calMonth||todayStr().slice(0,7);
  calMonth=base;state.ui.calMonth=base;
  const[y,m]=base.split('-').map(Number);
  const first=new Date(y,m-1,1);const last=new Date(y,m,0);
  document.getElementById('calTitle').textContent=first.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const fw=(first.getDay()+6)%7;const days=last.getDate();
  document.getElementById('calLegend').innerHTML=`
    <span><i class="dot dot-study"></i> Estudou</span>
    <span><i class="dot dot-q"></i> Meta questões</span>
    <span><i class="dot dot-evt"></i> Evento</span>`;
  const cells=[];
  for(let i=0;i<fw;i++)cells.push('<div class="cal-cell empty"></div>');
  const today=todayStr();
  for(let d=1;d<=days;d++){
    const ds=`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const marks=[];
    if(totalMinutesOn(ds)>0)marks.push('<span class="mk" style="background:var(--indigo-2)"></span>');
    if(questionsMinutesOn(ds)>=state.settings.qGoalMin)marks.push('<span class="mk" style="background:var(--amber)"></span>');
    const evs=eventsOn(ds);
    const evHtml=evs.slice(0,3).map(e=>`<div class="cal-event" style="background:${EVENT_COLORS[e.color]||'#a855f7'}"></div>`).join('');
    const cls=[ds===today?'today':''];
    cells.push(`<div class="cal-cell ${cls.join(' ').trim()}" data-date="${ds}">
      <div class="dnum"><span>${d}</span></div>
      <div class="marks">${marks.join('')}</div>
      ${evs.length?`<div class="cal-events">${evHtml}</div>`:''}
    </div>`);
  }
  document.getElementById('calGrid').innerHTML=cells.join('');
  document.querySelectorAll('#calGrid .cal-cell[data-date]').forEach(c=>c.addEventListener('click',()=>openDayModal(c.dataset.date)));
}
window.renderCalendar=renderCalendar;

function openDayModal(ds){
  const studies=state.studies.filter(s=>s.date===ds);
  const qs=state.questions.filter(q=>q.date===ds);
  const evs=eventsOn(ds);
  const totalStudy=studies.reduce((a,s)=>a+s.minutes,0);
  let h=`<div class="modal-row"><span>Dia</span><span>${fmtDateLong(ds)}</span></div>`;
  h+=`<div class="modal-row"><span>Estudo total</span><span>${fmtMinutes(totalStudy)}</span></div>`;
  if(evs.length){
    h+=`<h4 style="margin:16px 0 8px;font-size:13px;color:var(--muted)">Eventos</h4>`;
    evs.forEach(e=>{const c=EVENT_COLORS[e.color]||'#a855f7';
      h+=`<div class="modal-row"><span><i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${c};margin-right:8px"></i>${escapeHtml(e.title)}</span><span>${escapeHtml(e.description||'')}</span></div>`;});
  }
  if(studies.length){
    h+=`<h4 style="margin:16px 0 8px;font-size:13px;color:var(--muted)">Estudos</h4>`;
    studies.forEach(s=>{h+=`<div class="modal-row"><span>${escapeHtml(s.subject)}</span><span>${fmtMinutes(s.minutes)}</span></div>`;});
  }
  if(!studies.length&&!qs.length&&!evs.length)h+=`<p class="muted small" style="margin-top:14px">Nada neste dia.</p>`;
  h+=`<div style="margin-top:16px"><button class="btn btn-primary btn-sm" id="modalAddEvent"><i data-lucide="plus"></i> Adicionar evento</button></div>`;
  document.getElementById('modalTitle').textContent=`Resumo — ${fmtDateBR(ds)}`;
  document.getElementById('modalBody').innerHTML=h;
  document.getElementById('dayModal').classList.add('show');
  document.getElementById('modalAddEvent').addEventListener('click',()=>{closeModal('dayModal');openEventModal(null,ds);});
  refreshIcons();
}

/* MODAL EVENTO */
let editingEventId=null;
function openEventModal(id=null,preset=null){
  editingEventId=id;
  document.getElementById('eventForm').reset();
  const del=document.getElementById('btnEventDelete');
  const title=document.getElementById('eventModalTitle');
  const save=document.getElementById('btnEventSave');
  if(id!==null){
    const ev=state.calendarEvents.find(e=>e.id===id);if(!ev)return;
    title.textContent='Editar evento';
    document.getElementById('eventDate').value=ev.date;
    document.getElementById('eventTitle').value=ev.title;
    document.getElementById('eventDescription').value=ev.description||'';
    document.getElementById('eventColor').value=ev.color||'gold';
    del.hidden=false;save.textContent='Salvar';
  }else{
    title.textContent='Novo evento';
    document.getElementById('eventDate').value=preset||todayStr();
    del.hidden=true;save.textContent='Adicionar';
  }
  document.getElementById('eventModal').classList.add('show');
  refreshIcons();
}
function saveEventForm(e){
  e.preventDefault();
  const date=document.getElementById('eventDate').value;
  const title=document.getElementById('eventTitle').value.trim();
  const description=document.getElementById('eventDescription').value.trim();
  const color=document.getElementById('eventColor').value;
  if(!date||!title){toast('Preencha data e título.','warn');return;}
  if(editingEventId!==null){
    const ev=state.calendarEvents.find(e=>e.id===editingEventId);if(!ev)return;
    Object.assign(ev,{date,title,description,color});
    toast('Atualizado.','success');
  }else{
    state.calendarEvents.push({id:uid(),date,title,description,color});
    toast('Evento adicionado.','success');
  }
  saveState();closeModal('eventModal');renderCalendar();renderEventsList();
}
function deleteEvent(id){
  if(!confirm('Excluir evento?'))return;
  state.calendarEvents=state.calendarEvents.filter(e=>e.id!==id);
  saveState();closeModal('eventModal');renderCalendar();renderEventsList();toast('Excluído.','warn');
}
function renderEventsList(){
  const wrap=document.getElementById('eventsList');if(!wrap)return;
  const evs=[...state.calendarEvents].sort((a,b)=>b.date.localeCompare(a.date));
  if(!evs.length){wrap.innerHTML='<p class="muted small">Nenhum evento.</p>';return;}
  wrap.innerHTML=`<div class="events-list">${evs.map(e=>{
    const c=EVENT_COLORS[e.color]||'#a855f7';
    return`<div class="event-item">
      <span class="ev-dot" style="background:${c}"></span>
      <div class="ev-info"><strong>${escapeHtml(e.title)}</strong><span>${fmtDateBR(e.date)}${e.description?' · '+escapeHtml(e.description):''}</span></div>
      <div class="ev-actions">
        <button class="btn btn-icon btn-ghost" data-edit-ev="${e.id}"><i data-lucide="pencil"></i></button>
        <button class="btn btn-icon btn-ghost" data-del-ev="${e.id}"><i data-lucide="trash-2"></i></button>
      </div>
    </div>`;
  }).join('')}</div>`;
  wrap.querySelectorAll('[data-edit-ev]').forEach(b=>b.addEventListener('click',()=>openEventModal(b.dataset.editEv)));
  wrap.querySelectorAll('[data-del-ev]').forEach(b=>b.addEventListener('click',()=>deleteEvent(b.dataset.delEv)));
  refreshIcons();
}

/* TIMERS */
let timerInterval=null,tickCount=0;
function timerElapsed(k){
  const t=state.timers[k];if(!t)return 0;
  let s=t.accumulated||0;
  if(t.running&&t.startTime)s+=(Date.now()-t.startTime)/1000;
  return s;
}
function startTimer(k){const t=state.timers[k];if(!t||t.running)return;t.running=true;t.startTime=Date.now();saveState();ensureTimerLoop();updateTimerDisplays();renderTimerButtons();}
function pauseTimer(k){const t=state.timers[k];if(!t||!t.running)return;t.accumulated=timerElapsed(k);t.running=false;t.startTime=null;saveState();updateTimerDisplays();renderTimerButtons();}
function resetTimer(k){const t=state.timers[k];if(!t)return;t.accumulated=0;t.startTime=null;t.running=false;saveState();updateTimerDisplays();renderTimerButtons();}
function ensureTimerLoop(){if(timerInterval)return;tickCount=0;timerInterval=setInterval(tick,500);}
function tick(){
  const now=Date.now();let any=false;
  ['q','study'].forEach(k=>{const t=state.timers[k];
    if(t&&t.running&&t.startTime){t.accumulated=(t.accumulated||0)+(now-t.startTime)/1000;t.startTime=now;any=true;}});
  if(!any){clearInterval(timerInterval);timerInterval=null;return;}
  tickCount++;
  if(tickCount%10===0)saveState();
  updateTimerDisplays();
}
function updateTimerDisplays(){
  const q=document.getElementById('qTimerDisplay');
  if(q&&state.timers.q){q.textContent=fmtSeconds(timerElapsed('q'));q.classList.toggle('running',state.timers.q.running);}
  const s=document.getElementById('studyTimerDisplay');
  if(s&&state.timers.study){s.textContent=fmtSeconds(timerElapsed('study'));s.classList.toggle('running',state.timers.study.running);}
}
function renderTimerButtons(){
  const q=state.timers.q;
  if(q){document.getElementById('qStart').disabled=q.running;document.getElementById('qPause').disabled=!q.running;document.getElementById('qFinish').disabled=q.running?false:!(q.accumulated>0);}
  const s=state.timers.study;
  if(s){
    const a=document.getElementById('studyTimerStart'),b=document.getElementById('studyTimerPause'),c=document.getElementById('studyTimerApply');
    if(a)a.disabled=s.running;if(b)b.disabled=!s.running;if(c)c.disabled=!(s.running||s.accumulated>0);
  }
}
function finishQuestions(){
  const sec=timerElapsed('q');const minutes=Math.floor(sec/60);
  if(minutes<1){toast('Menos de 1 minuto.','warn');return;}
  const subject=document.getElementById('qSubject').value;
  const count=Number(document.getElementById('qCount').value)||0;
  const correct=Number(document.getElementById('qCorrect').value)||0;
  const wrong=Number(document.getElementById('qWrong').value)||0;
  const date=todayStr();
  const oldXP=calcTotalXP();
  state.questions.push({id:uid(),date,subject,minutes,count,correct,wrong});
  state.studies.push({id:uid(),subject,date,minutes,type:'Questões',notes:`Sessão (${count}q, ${correct}✓)`});
  resetTimer('q');
  document.getElementById('qCount').value=0;document.getElementById('qCorrect').value=0;document.getElementById('qWrong').value=0;document.getElementById('qPct').value='—';
  saveState();
  const newXP=calcTotalXP();
  checkLevelUp(oldXP,newXP);
  renderQuestions();renderDashboard();renderStudies();renderCharts();renderXPWidget();
  checkAchievements();
  toast(`Salvo (${fmtMinutes(minutes)}).`,'success');
  if(questionsMinutesOn(date)>=state.settings.qGoalMin)setTimeout(()=>toast('🎯 META DE QUESTÕES CONCLUÍDA!','success'),700);
}
function applyStudyTimerToForm(){
  if(state.timers.study.running)pauseTimer('study');
  const sec=Math.floor(timerElapsed('study'));
  if(sec<30){toast('Menos de 30s.','warn');return;}
  const total=Math.max(1,Math.round(sec/60));
  document.getElementById('sHours').value=Math.floor(total/60);
  document.getElementById('sMinutes').value=total%60;
  toast(`Aplicado: ${Math.floor(total/60)}h${String(total%60).padStart(2,'0')}`,'success');
}

/* CONFIG */
function loadSettingsIntoForm(){
  document.getElementById('cfgDailyGoal').value=state.settings.dailyGoalMin;
  document.getElementById('cfgQGoal').value=state.settings.qGoalMin;
  document.getElementById('cfgCycleStart').value=state.cycle.startDate||todayStr();
}
function renderTabsVisibility(){
  const wrap=document.getElementById('tabsVisibility');if(!wrap)return;
  wrap.innerHTML=TAB_DEFS.map(t=>{
    const isCfg=t.id==='config';
    const checked=isCfg?true:(state.settings.visibleTabs[t.id]!==false);
    return`<label class="checkbox-item ${isCfg?'disabled':''}"><input type="checkbox" data-tab="${t.id}" ${checked?'checked':''} ${isCfg?'disabled':''}><i data-lucide="${t.icon}"></i><span>${t.label}</span></label>`;
  }).join('');
  wrap.querySelectorAll('input[data-tab]').forEach(i=>i.addEventListener('change',()=>{
    if(i.dataset.tab==='config')return;
    state.settings.visibleTabs[i.dataset.tab]=i.checked;
    saveState();applyTabVisibility();
  }));
  refreshIcons();
}
function renderConcursoGridCfg(){
  const wrap=document.getElementById('concursoGridCfg');if(!wrap)return;
  wrap.innerHTML=Object.entries(CONCURSOS).map(([k,c])=>`
    <button type="button" class="concurso-card ${state.concurso===k?'active':''}" data-concurso-cfg="${k}">
      <div class="cc-icon"><i data-lucide="${c.icon}"></i></div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-full">${c.full}</div>
    </button>`).join('');
  wrap.querySelectorAll('[data-concurso-cfg]').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.concursoCfg;
    if(k===state.concurso){toast('Já é o concurso atual.','warn');return;}
    if(!confirm(`Trocar para ${CONCURSOS[k].name}?`))return;
    state.concurso=k;applyConcursoBlocks(k);
    saveState();updateBrand();renderConcursoGridCfg();
    renderCycle();renderDashboard();fillSubjectSelects();
    toast(`Concurso: ${CONCURSOS[k].name}`,'success');
  }));
  refreshIcons();
}
function handleCfgGoals(e){e.preventDefault();
  state.settings.dailyGoalMin=Number(document.getElementById('cfgDailyGoal').value)||240;
  state.settings.qGoalMin=Number(document.getElementById('cfgQGoal').value)||120;
  state.cycle.startDate=document.getElementById('cfgCycleStart').value||todayStr();
  saveState();renderDashboard();renderQuestions();renderCycle();toast('Metas salvas.','success');}

/* EXPORT/IMPORT */
function exportJSON(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=`mystude-${todayStr()}.json`;a.click();
  URL.revokeObjectURL(url);toast('JSON exportado.','success');
}
function importJSON(file){
  const r=new FileReader();
  r.onload=e=>{
    try{
      const d=JSON.parse(e.target.result);
      if(!d||typeof d!=='object')throw new Error('Inválido');
      if(!confirm('Substituir todos os dados?'))return;
      state={...defaultState(),...d};
      if(!state.cycle||!Array.isArray(state.cycle.blocks))state.cycle=defaultState().cycle;
      saveState();location.reload();
    }catch(err){toast('Arquivo inválido.','warn');}
  };
  r.readAsText(file);
}
function clearAll(){
  if(!confirm('⚠️ Apagar TUDO permanentemente?'))return;
  if(!confirm('Última confirmação.'))return;
  localStorage.removeItem(STORAGE_KEY);location.reload();
}
const closeModal=id=>document.getElementById(id)?.classList.remove('show');

/* ONBOARDING */
function renderOnboarding(){
  const wrap=document.getElementById('concursoGrid');
  wrap.innerHTML=Object.entries(CONCURSOS).map(([k,c])=>`
    <button type="button" class="concurso-card" data-concurso="${k}">
      <div class="cc-icon"><i data-lucide="${c.icon}"></i></div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-full">${c.full}</div>
    </button>`).join('');
  wrap.querySelectorAll('[data-concurso]').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.concurso;
    state.concurso=k;applyConcursoBlocks(k);saveState();
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('appRoot').hidden=false;
    updateBrand();bootApp();
    setTimeout(()=>toast(`Bem-vindo! Concurso: ${CONCURSOS[k].name}`,'success'),400);
  }));
  refreshIcons();
}
function updateBrand(){
  const c=CONCURSOS[state.concurso];if(!c)return;
  document.getElementById('brandSub').textContent=c.full;
}

/* EVENTS */
function bindEvents(){
  document.querySelectorAll('.nav-item').forEach(n=>n.addEventListener('click',()=>switchView(n.dataset.view)));
  document.getElementById('hamburger').addEventListener('click',openSidebar);
  document.getElementById('overlay').addEventListener('click',closeSidebar);

  document.getElementById('btnRestartCycle').addEventListener('click',restartCycle);
  document.getElementById('btnAddBlock').addEventListener('click',()=>openBlockModal(null));

  document.getElementById('studyForm').addEventListener('submit',handleStudySubmit);
  document.getElementById('btnCancelEdit').addEventListener('click',cancelEditStudy);
  document.getElementById('fSubject').addEventListener('change',renderStudies);
  document.getElementById('fPeriod').addEventListener('change',renderStudies);

  document.getElementById('studyTimerStart').addEventListener('click',()=>startTimer('study'));
  document.getElementById('studyTimerPause').addEventListener('click',()=>pauseTimer('study'));
  document.getElementById('studyTimerReset').addEventListener('click',()=>{if(confirm('Zerar?'))resetTimer('study');});
  document.getElementById('studyTimerApply').addEventListener('click',applyStudyTimerToForm);

  document.querySelectorAll('#statsFilter button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('#statsFilter button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');statsRange=b.dataset.range;renderCharts();
  }));

  document.getElementById('qStart').addEventListener('click',()=>startTimer('q'));
  document.getElementById('qPause').addEventListener('click',()=>pauseTimer('q'));
  document.getElementById('qReset').addEventListener('click',()=>{if(confirm('Zerar?'))resetTimer('q');});
  document.getElementById('qFinish').addEventListener('click',finishQuestions);

  ['qCorrect','qWrong','qCount'].forEach(id=>{
    document.getElementById(id).addEventListener('input',()=>{
      const c=Number(document.getElementById('qCorrect').value)||0;
      const w=Number(document.getElementById('qWrong').value)||0;
      const t=c+w;
      document.getElementById('qPct').value=t>0?Math.round(c/t*100)+'%':'—';
    });
  });

  document.querySelectorAll('#achFilters button').forEach(b=>b.addEventListener('click',()=>{
    achFilter=b.dataset.cat;renderAchievements();
  }));

  document.getElementById('calPrev').addEventListener('click',()=>{
    const[y,m]=calMonth.split('-').map(Number);
    const d=new Date(y,m-2,1);
    calMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    renderCalendar();
  });
  document.getElementById('calNext').addEventListener('click',()=>{
    const[y,m]=calMonth.split('-').map(Number);
    const d=new Date(y,m,1);
    calMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    renderCalendar();
  });

  document.getElementById('btnAddEvent').addEventListener('click',()=>openEventModal(null));
  document.getElementById('btnAddEventCfg').addEventListener('click',()=>openEventModal(null));
  document.getElementById('modalClose').addEventListener('click',()=>closeModal('dayModal'));
  document.getElementById('dayModal').addEventListener('click',e=>{if(e.target.id==='dayModal')closeModal('dayModal');});
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeModal(b.dataset.close)));
  ['blockModal','eventModal'].forEach(id=>{
    document.getElementById(id).addEventListener('click',e=>{if(e.target.id===id)closeModal(id);});
  });

  document.getElementById('blockForm').addEventListener('submit',saveBlockForm);
  document.getElementById('btnBlockDelete').addEventListener('click',()=>deleteBlock(editingBlockId));
  document.getElementById('eventForm').addEventListener('submit',saveEventForm);
  document.getElementById('btnEventDelete').addEventListener('click',()=>deleteEvent(editingEventId));

  document.getElementById('cfgGoals').addEventListener('submit',handleCfgGoals);

  document.getElementById('btnExportJson').addEventListener('click',exportJSON);
  document.getElementById('importFile').addEventListener('change',e=>{
    if(e.target.files[0])importJSON(e.target.files[0]);
    e.target.value='';
  });
  document.getElementById('btnClear').addEventListener('click',clearAll);
}

/* XP WIDGET */
function renderXPWidget(){
  const{xp,current,next,pct,base,cap}=getXPProgress();
  document.getElementById('xpLevelNum').textContent=current.n;
  document.getElementById('xpRank').textContent=current.rank;
  if(next)document.getElementById('xpNext').textContent=`${(xp-base).toLocaleString('pt-BR')} / ${(cap-base).toLocaleString('pt-BR')} XP`;
  else document.getElementById('xpNext').textContent=`${xp.toLocaleString('pt-BR')} XP (máx)`;
  document.getElementById('xpBarFill').style.width=pct+'%';
}
window.renderXPWidget=renderXPWidget;

/* BOOT */
function bootApp(){
  ['q','study'].forEach(k=>{const t=state.timers[k];if(t&&t.running){t.running=false;t.startTime=null;}});
  const lastDay=state.ui.lastDay||todayStr();
  if(lastDay!==todayStr()){
    state.timers.q={accumulated:0,startTime:null,running:false};
    state.timers.study={accumulated:0,startTime:null,running:false};
  }
  state.ui.lastDay=todayStr();

  document.getElementById('sDate').value=todayStr();

  fillSubjectSelects();
  loadSettingsIntoForm();
  applyTabVisibility();

  renderDashboard();
  renderCycle();
  renderStudies();
  renderQuestions();
  renderCalendar();
  renderTabsVisibility();
  renderEventsList();
  renderAchievements();
  renderXPWidget();
  updateTimerDisplays();
  renderTimerButtons();

  document.getElementById('topDate').textContent=new Date().toLocaleDateString('pt-BR',{
    weekday:'long',day:'2-digit',month:'long',year:'numeric'
  });

  checkAchievements(false);
  saveState();
  refreshIcons();
}

function init(){
  state=loadState();
  window.state=state;
  window.defaultState=defaultState;
  window.saveState=saveState;
  bindEvents();
  if(!state.concurso){
    renderOnboarding();
  }else{
    document.getElementById('onboarding').classList.add('hidden');
    document.getElementById('appRoot').hidden=false;
    updateBrand();
    bootApp();
  }
}

document.addEventListener('DOMContentLoaded',init);
window.addEventListener('beforeunload',()=>{if(state)saveState();});