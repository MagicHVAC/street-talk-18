'use strict';
/* ===== Уличный язык 18+: словарь грубостей, ответы, сценки, тесты ===== */
const APP = {ver:'1.0.0', date:'11.10.2026'};
const LV = [null, ['грубовато','#c9a227'], ['грубо','#e07b00'], ['очень грубо','#d32f2f'], ['табу','#7b1fa2']];
const $ = s => document.querySelector(s);
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j = Math.random()*(i+1)|0; [a[i],a[j]] = [a[j],a[i]]; } return a; };
const pick = a => a[Math.random()*a.length|0];
let ST = {lang:'en', tab:'dict', lvl:0, adult:false};
try{ ST = Object.assign(ST, JSON.parse(localStorage.getItem('s18') || '{}')); }catch(e){}
function save(){ try{ localStorage.setItem('s18', JSON.stringify(ST)); }catch(e){} }
const D = () => ST.lang === 'en' ? EN : ZH;
const TX = []; function R(t){ TX.push(t); return TX.length-1; }
function say(t){ if(!('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = D().voice;
  const v = speechSynthesis.getVoices().find(x => x.lang.replace('_','-').startsWith(D().voice.slice(0,2)) && (ST.lang==='zh' ? /CN/i.test(x.lang) : true)); if(v) u.voice = v; u.rate = .9; speechSynthesis.speak(u); }
function sayI(i){ say(TX[i]); }
function badge(l){ return `<span class="lv" style="--lc:${LV[l][1]}">${'●'.repeat(l)}${'○'.repeat(4-l)} ${LV[l][0]}</span>`; }

function gate(){
  $('#app').innerHTML = `<div class="card gate"><div style="font-size:54px">🔞</div><h2>Только для взрослых</h2>
    <p>Учебный материал о грубой лексике и мате в английском и китайском: что означают слова, когда их говорят и как распознать агрессию в разговоре.</p>
    <p class="mut">Содержит нецензурные выражения. Не предназначено для детей.</p>
    <button class="primary" onclick="ST.adult=true;save();render()">Мне есть 18 лет — войти</button>
    <button class="btn" style="width:100%;margin-top:8px" onclick="document.body.innerHTML='<p style=&quot;padding:24px&quot;>Страница закрыта.</p>'">Выйти</button></div>`;
}
function render(){
  TX.length = 0;
  if(!ST.adult) return gate();
  const tabs = [['dict','Словарь'],['calm','Как ответить'],['scenes','Сценки'],['quiz','Тесты'],['tips','Важно']];
  $('#app').innerHTML = `<div class="seg">${[['en','🇬🇧 English'],['zh','🇨🇳 中文']].map(([k,l]) => `<button class="${ST.lang===k?'on':''}" onclick="ST.lang='${k}';save();render()">${l}</button>`).join('')}</div>
    <div class="seg">${tabs.map(([k,l]) => `<button class="${ST.tab===k?'on':''}" onclick="ST.tab='${k}';save();render()">${l}</button>`).join('')}</div><div id="body"></div>`;
  ({dict:dict, calm:calm, scenes:scenes, quiz:quizMenu, tips:tips})[ST.tab]();
}
function dict(){
  const ws = D().words.filter(w => !ST.lvl || w[2] === ST.lvl);
  $('#body').innerHTML = `<div class="seg">${[0,1,2,3,4].map(l => `<button class="${ST.lvl===l?'on':''}" onclick="ST.lvl=${l};save();render()">${l ? LV[l][0] : 'все'}</button>`).join('')}</div>
    <div class="mut">Шкала: ● грубовато · ●● грубо · ●●● очень грубо · ●●●● табу. Нажмите 🔊, чтобы услышать, как это звучит.</div>
    ${ws.map(w => { const a = R(w[0].split(' / ')[0]), b = R(w[5]);
      return `<div class="card word" style="border-left:5px solid ${LV[w[2]][1]}"><div class="row"><b class="w">${w[0]}</b>${w[1]?`<span class="py">${w[1]}</span>`:''}<button class="btn sm" onclick="sayI(${a})">🔊</button></div>
        ${badge(w[2])}<div class="mean">${w[3]}</div><div class="mut">Когда: ${w[4]}</div>
        ${w[5] && w[5] !== '—' && !/^\(/.test(w[5]) ? `<div class="ex">${w[5]} <button class="btn sm" onclick="sayI(${b})">🔊</button><div class="mut">${w[6]}</div></div>` : ''}
        <div class="mut">📍 ${w[7]}</div></div>`; }).join('')}`;
}
function calm(){
  const zh = ST.lang === 'zh';
  $('#body').innerHTML = `<h2>Как ответить и погасить конфликт</h2><div class="mut">Если ругаются на вас — не отвечайте тем же. Спокойные фразы и уход — самый безопасный путь.</div>
    ${D().calm.map(c => { const a = R(c[0]); return `<div class="card"><div class="row"><b class="w">${c[0]}</b><button class="btn sm" onclick="sayI(${a})">🔊</button></div>${zh?`<div class="py">${c[1]}</div>`:''}<div>${zh?c[2]:c[1]}</div></div>`; }).join('')}`;
}
function scenes(){
  $('#body').innerHTML = `<h2>Сценки</h2><div class="mut">Цветом показан уровень грубости каждой реплики.</div>
    ${D().scenes.map(s => `<div class="card"><b>${s[0]}</b>${s[1].map(l => { const a = R(l[1]); return `<div class="line" style="border-left:4px solid ${l[3] ? LV[l[3]][1] : 'var(--ok)'}"><b>${l[0]}:</b> <span class="w2">${l[1]}</span> <button class="btn sm" onclick="sayI(${a})">🔊</button>${l[3] ? ' ' + badge(l[3]) : ' <span class="lv" style="--lc:var(--ok)">нейтрально</span>'}<div class="mut">${l[2]}</div></div>`; }).join('')}
      ${s[2] ? `<div class="tip">💡 ${s[2]}</div>` : ''}</div>`).join('')}`;
}
function tips(){
  $('#body').innerHTML = `<h2>Важно знать</h2>${D().tips.map(t => `<div class="card">${t}</div>`).join('')}
    <div class="card mut">Версия ${APP.ver} от ${APP.date}. Материал учебный: цель — понимать речь и безопасно реагировать, а не учиться ругаться.</div>`;
}
/* ---- тесты ---- */
let Q = null;
function quizMenu(){
  $('#body').innerHTML = `<h2>Тесты</h2>
   <button class="primary" onclick="startQuiz('lvl')">🌡️ Насколько грубо?</button>
   <button class="primary" onclick="startQuiz('mean')">❓ Что это значит?</button>
   <button class="primary" onclick="startQuiz('tone')">⚠️ Агрессия или просто эмоция?</button>`;
}
function startQuiz(kind){
  const ws = D().words;
  let qs;
  if(kind === 'tone') qs = shuffle(D().tone).slice(0, 10).map(t => ({t:t[0], ans:t[1] ? 1 : 0, opts:['Просто эмоция, не опасно','Агрессия — лучше уйти']}));
  else if(kind === 'lvl') qs = shuffle(ws).slice(0, 10).map(w => ({t:w[0], ans:w[2]-1, opts:[1,2,3,4].map(l => LV[l][0])}));
  else qs = shuffle(ws).slice(0, 10).map(w => { const o = shuffle([w].concat(shuffle(ws.filter(x => x !== w)).slice(0,3))); return {t:w[0], ans:o.indexOf(w), opts:o.map(x => x[3])}; });
  Q = {kind, qs, i:0, ok:0}; quizQ();
}
function quizQ(){
  if(Q.i >= Q.qs.length){ $('#body').innerHTML = `<div class="card center"><h2>${Q.ok} из ${Q.qs.length}</h2><button class="primary" onclick="startQuiz('${Q.kind}')">Ещё раз</button><button class="btn" style="width:100%;margin-top:8px" onclick="quizMenu()">Другие тесты</button></div>`; return; }
  const q = Q.qs[Q.i]; Q.done = false; const a = R(q.t);
  $('#body').innerHTML = `<div class="card"><div class="mut">Вопрос ${Q.i+1} из ${Q.qs.length} · верно ${Q.ok}</div>
    <div class="center" style="margin:10px 0"><b class="w" style="font-size:26px">${q.t}</b> <button class="btn sm" onclick="sayI(${a})">🔊</button></div>
    <div id="qo" style="display:grid;gap:8px">${q.opts.map((o,k) => `<button class="opt" onclick="ans(${k})">${o}</button>`).join('')}</div><div id="qr"></div></div>`;
}
function ans(k){
  if(Q.done) return; Q.done = true;
  const q = Q.qs[Q.i], ok = k === q.ans; if(ok) Q.ok++;
  const bs = document.querySelectorAll('#qo button'); bs[q.ans].classList.add('ok'); if(!ok) bs[k].classList.add('bad');
  $('#qr').innerHTML = `<button class="primary" onclick="Q.i++;quizQ()">Дальше →</button>`;
}
$('#ver').textContent = 'v' + APP.ver;
render();
