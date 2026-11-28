'use strict';

APPS.settings={t:'ivOS Настройки',i:ico('#9ab4c8','#4a6a86',G.gear),w:500,h:430,open(b){
 b.style.padding='14px';
 const sec=(t,...c)=>h('div',{style:'margin-bottom:16px'},h('b',{},t),h('div',{style:'display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;align-items:center'},...c));
 const wpb=[['day','Слънчева река'],['dusk','Лагуна в здрача'],['photo','Портрет на Дунав']].map(([k,n])=>h('button',{class:'b',onclick:()=>setWp(k),style:`width:130px;height:80px;color:#fff;text-shadow:0 1px 3px #000;align-self:flex-end;background:${k==='photo'?`url("${IMG}") center/cover,`+WP.day()+' center/cover':WP[k]()+' center/cover'}`},n));
 b.append(sec('Тапет',...wpb),sec('Цвят на прозорците',...TH.map((t,i)=>h('button',{class:'b',onclick:()=>setTheme(i)},t[0]))),sec('Звук',h('input',{type:'range',min:0,max:100,value:SND.v,oninput:e=>{SND.v=+e.target.value;SND.m=false;syncSnd()}}),h('button',{class:'b',onclick:()=>{SND.m=!SND.m;syncSnd()}},'Mute / unmute')),sec('Система',h('button',{class:'b',onclick:()=>{if(confirm('Да се изтрият ли запазените бележки, отметки и настройки?')){try{Object.keys(localStorage).filter(k=>k.startsWith('ivos.')).forEach(k=>localStorage.removeItem(k))}catch(e){}location.reload()}}},'Нулирай ivOS')))}};
