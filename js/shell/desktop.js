'use strict';

/* wallpapers + themes */
const sv=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
const sky=(a,b,c,sun,hill)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fe9ee"/><stop offset="1" stop-color="#1b8fc9"/></linearGradient><linearGradient id="h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hill}"/><stop offset="1" stop-color="#2f9e3a"/></linearGradient></defs><rect width="1600" height="900" fill="url(#s)"/><circle cx="1180" cy="190" r="150" fill="#fff" opacity=".3"/><circle cx="1180" cy="190" r="60" fill="${sun}"/><g fill="#fff" opacity=".85"><ellipse cx="300" cy="150" rx="150" ry="36"/><ellipse cx="400" cy="130" rx="100" ry="40"/><ellipse cx="820" cy="260" rx="170" ry="30"/><ellipse cx="1350" cy="340" rx="120" ry="26"/></g><path d="M0 520Q250 380 520 470T1050 440T1600 480V900H0z" fill="#5dbb63"/><path d="M0 600Q300 470 650 560T1250 520T1600 580V900H0z" fill="url(#h)"/><path d="M700 900C760 760 880 680 1000 600S1180 545 1230 545L1262 552C1150 595 1050 660 1020 740S1060 840 1120 900z" fill="url(#r)"/><path d="M0 900V770Q300 700 520 790T900 900z" fill="#2c9a3c"/></svg>`;
const WP={day:()=>sv(sky('#1c7fd8','#8fdcff','#eafcff','#fffbd0','#9be34a')),dusk:()=>sv(sky('#2b4fa8','#ff9f8a','#ffe6b0','#fff0c0','#7fcf5a'))};
const desk=$('#desk');
const setWp=k=>{desk.style.background=k==='photo'?`url("${IMG}") center/contain no-repeat,${WP.day()} center/cover`:`${WP[k]()} center/cover`;store.set('wp',k)};
const TH=[['Небе','rgba(60,170,230,.5)'],['Листо','rgba(80,200,90,.5)'],['Аква','rgba(30,200,200,.5)'],['Корал','rgba(245,130,100,.5)']];
const setTheme=i=>{document.documentElement.style.setProperty('--t',TH[i][1]);store.set('th',i)};
/* window manager */
const wins={},tasks=$('#tasks');let zi=10;
const focusW=w=>{Object.values(wins).forEach(o=>{o.el.classList.toggle('top',o===w);o.btn.classList.toggle('on',o===w)});w.el.style.zIndex=++zi};
const focusNext=()=>{const l=Object.values(wins).filter(o=>!o.el.classList.contains('min')).sort((a,b)=>a.el.style.zIndex-b.el.style.zIndex).pop();l?focusW(l):Object.values(wins).forEach(o=>o.btn.classList.remove('on'))};
function openApp(id,arg){const A=APPS[id];let w=wins[id];
 if(w){w.el.classList.remove('min');sfx('restore');focusW(w);w.b.go&&w.b.go(arg);return}
 const n=Object.keys(wins).length,el=h('div',{class:'win',style:`left:${60+n*30}px;top:${24+n*26}px;width:${Math.min(A.w,innerWidth-16)}px;height:${Math.min(A.h,innerHeight-56)}px`}),b=h('div',{class:'bd'}),tb=h('div',{class:'tb'}),btn=h('div',{class:'tk',title:A.t});
 tb.innerHTML=`${A.i}<b>${A.t}</b><div class="wb"><i data-a="m" title="Минимизирай">–</i><i data-a="x" title="Максимизирай / възстанови">▢</i><i data-a="c" title="Затвори">✕</i></div>`;
 btn.innerHTML=`${A.i}<span>${A.t}</span>`;el.append(tb,b);desk.append(el);tasks.append(btn);
 w=wins[id]={el,b,btn};if(innerWidth<700)el.classList.add('max');
 tb.addEventListener('click',e=>{const a=e.target.dataset.a;if(a==='c'){sfx('close');A.close&&A.close(b);el.remove();btn.remove();delete wins[id];focusNext()}else if(a==='m'){sfx('min');el.classList.add('min');focusNext()}else if(a==='x'){sfx('max');el.classList.toggle('max')}});
 tb.addEventListener('dblclick',e=>{if(!e.target.dataset.a)el.classList.toggle('max')});
 btn.onclick=()=>{if(el.classList.contains('min')){el.classList.remove('min');focusW(w)}else if(el.classList.contains('top')){el.classList.add('min');focusNext()}else focusW(w)};
 el.addEventListener('pointerdown',()=>focusW(w),true);
 tb.addEventListener('pointerdown',e=>{if(e.target.dataset.a||el.classList.contains('max'))return;const ox=e.clientX-el.offsetLeft,oy=e.clientY-el.offsetTop;tb.setPointerCapture(e.pointerId);const mv=ev=>{el.style.left=Math.min(innerWidth-60,Math.max(120-el.offsetWidth,ev.clientX-ox))+'px';el.style.top=Math.min(innerHeight-90,Math.max(0,ev.clientY-oy))+'px'};tb.addEventListener('pointermove',mv);tb.addEventListener('pointerup',()=>tb.removeEventListener('pointermove',mv),{once:true})});
 sfx('open');focusW(w);A.open(b,arg)}
/* embedded video */
const qmanURL=()=>{const s=atob($('#qvd').textContent.trim()),a=new Uint8Array(s.length);for(let i=0;i<s.length;i++)a[i]=s.charCodeAt(i);return URL.createObjectURL(new Blob([a],{type:'video/mp4'}))};
/* mario virus (harmless prank) */
const MV=[];let mvLbl=null,mvRun=0;
const mvKill=()=>{MV.splice(0).forEach(o=>o.e.remove())};
const mvLoop=()=>{if(mvRun)return;mvRun=1;let last=performance.now();const f=ts=>{if(!MV.length){mvRun=0;mvLbl&&(mvLbl.textContent='0');return}requestAnimationFrame(f);const dt=Math.min(.05,(ts-last)/1000);last=ts;const W=innerWidth-90,Hh=innerHeight-130;
 MV.forEach(o=>{o.x+=o.vx*dt;o.y+=o.vy*dt;o.r+=o.vr*dt;if(o.x<0){o.x=0;o.vx=Math.abs(o.vx)}if(o.x>W){o.x=W;o.vx=-Math.abs(o.vx)}if(o.y<0){o.y=0;o.vy=Math.abs(o.vy)}if(o.y>Hh){o.y=Hh;o.vy=-Math.abs(o.vy)}o.e.style.transform=`translate(${o.x}px,${o.y}px) rotate(${o.r}deg)`});mvLbl&&(mvLbl.textContent=MV.length)};requestAnimationFrame(f)};
const mvSpawn=()=>{mvKill();for(let i=0;i<5;i++){const e=h('img',{class:'mvf',alt:'Вирус Марио',draggable:'false'});e.referrerPolicy='no-referrer';e.onerror=()=>{e.onerror=null;e.src=FB};e.src=IMG;
 const a=Math.random()*6.28,s=170+Math.random()*180,o={e,x:Math.random()*(innerWidth-90),y:Math.random()*(innerHeight-130),vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:0,vr:(Math.random()<.5?-1:1)*(80+Math.random()*200)};
 e.addEventListener('pointerdown',()=>{const k=MV.indexOf(o);if(k>=0){MV.splice(k,1);e.remove();sfx('pop')}});document.body.append(e);MV.push(o)}sfx('error');mvLoop()};
