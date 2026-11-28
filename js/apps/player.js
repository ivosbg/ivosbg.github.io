'use strict';

APPS.player={t:'Иво плейър',i:ico('#b98cff','#5a1fb8','<path d="M18 13l18 11-18 11z" fill="#fff"/>'),w:780,h:500,open(b){
 b.style.cssText+=';display:flex;background:#10131c;color:#fff';
 const list=[{n:'qman kuper',emb:1}];let v=null;
 const fmt=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
 const area=h('div',{style:'flex:1;position:relative;background:#000;min-height:0;display:flex;justify-content:center;overflow:auto'}),ls=h('div'),bar=h('div',{class:'row',style:'background:#1d2335;color:#fff'});
 const pp=h('button',{class:'b',title:'Пуск / пауза',onclick:()=>v&&(v.paused?v.play():v.pause())},'▶'),
 sk=h('input',{type:'range',min:0,max:1000,value:0,style:'flex:1',oninput:()=>v&&v.duration&&(v.currentTime=sk.value/1000*v.duration)}),
 tm=h('span',{style:'font-size:12px;min-width:80px'},'0:00 / 0:00'),
 vl=h('input',{type:'range',min:0,max:100,value:80,style:'width:70px',title:'Сила на звука',oninput:()=>v&&(v.volume=vl.value/100)}),
 fs=h('button',{class:'b',title:'Цял екран',onclick:()=>area.requestFullscreen&&area.requestFullscreen()},'⛶');
 bar.append(pp,sk,tm,'🔊',vl,fs);
 const draw=sel=>{ls.innerHTML='';list.forEach((it,i)=>ls.append(h('div',{style:`padding:6px 8px;border-radius:5px;font-size:13px;cursor:default;word-break:break-all;background:${i===sel?'#2c3a66':'none'}`,onclick:()=>play(i)},'🎞 '+it.n)))};
 const play=i=>{const it=list[i];if(it.emb&&!it.u)it.u=qmanURL();draw(i);area.innerHTML='';v=null;
  {bar.style.display='flex';v=h('video',{src:it.u,style:'max-width:100%;max-height:100%;margin:auto'});v.volume=vl.value/100;
   v.onclick=()=>v.paused?v.play():v.pause();v.onplay=()=>pp.textContent='⏸';v.onpause=()=>pp.textContent='▶';
   v.ontimeupdate=()=>{sk.value=v.duration?v.currentTime/v.duration*1000:0;tm.textContent=fmt(v.currentTime)+' / '+fmt(v.duration)};
   v.onerror=()=>{area.innerHTML='<p style="padding:20px;align-self:center">Този файл не може да бъде възпроизведен от браузъра ви.</p>'};area.append(v);v.play().catch(()=>{})}};
 const fi=h('input',{type:'file',accept:'video/*,audio/*',style:'display:none',onchange:()=>{const f=fi.files[0];if(f){list.push({n:f.name,u:URL.createObjectURL(f)});play(list.length-1)}}});
 b.append(h('div',{style:'flex:1;display:flex;flex-direction:column;min-width:0'},area,bar),h('div',{style:'width:190px;background:#171c2a;overflow:auto;padding:6px;flex:none;border-left:1px solid #334'},h('button',{class:'b',style:'width:100%;margin-bottom:6px',onclick:()=>fi.click()},'📂 Отвори файл…'),fi,ls));
 play(0)}};
