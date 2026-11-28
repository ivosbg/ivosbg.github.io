'use strict';

APPS.ivonly={t:'IVOnlyfans',i:ico('#00c2ff','#0072b8',`<image href="${LOGO2}" x="0" y="0" width="48" height="48"/>`,1),w:420,h:620,open(b){
 b.style.cssText+=';background:#000;display:flex;flex-direction:column;color:#fff;outline:0';
 const SRC='https://drive.google.com/uc?export=download&id=1ergtm2mp1wITPGp8jLpfFydgdnLF0Pa9';
 const area=h('div',{style:'flex:1;min-height:0;display:flex;align-items:center;justify-content:center;position:relative'}),
 v=h('video',{style:'max-width:100%;max-height:100%;display:block',playsinline:''}),
 fi=h('input',{type:'file',accept:'video/*,image/gif',style:'display:none'}),
 msg=h('div',{style:'display:none;position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:20px;background:#0a1220'},h('h3',{},'Видеото не можа да се зареди'),h('p',{style:'max-width:300px;font-size:13px'},'Google Drive блокира директното показване. Изберете файла от компютъра си – ще се върти безкрайно.'),h('button',{class:'b big',onclick:()=>fi.click()},'📂 Избери файл…'));
 v.loop=true;v.muted=true;v.autoplay=true;v.setAttribute('loop','');v.setAttribute('muted','');
 v.onended=()=>{v.currentTime=0;v.play().catch(()=>{})};
 v.onerror=()=>{msg.style.display='flex'};
 v.onclick=()=>v.paused?v.play():v.pause();
 fi.onchange=()=>{const f=fi.files[0];if(!f)return;msg.style.display='none';v.src=URL.createObjectURL(f);v.loop=true;v.play().catch(()=>{})};
 area.append(v,msg);
 b.append(h('div',{style:'padding:8px 12px;font-weight:700;font-size:18px;background:linear-gradient(90deg,#00aff0,#0072b8)'},'IVOnlyfans'),area,h('div',{class:'row',style:'background:#1d2335;color:#fff'},h('button',{class:'b',onclick:()=>fi.click()},'📂 Друг файл…'),h('span',{style:'font-size:12px;flex:1;text-align:right'},'🔁 безкраен цикъл'),fi));
 try{const q=atob($('#ivd').textContent.trim()),a=new Uint8Array(q.length);for(let i=0;i<q.length;i++)a[i]=q.charCodeAt(i);v.src=URL.createObjectURL(new Blob([a],{type:'video/mp4'}))}catch(e){v.src=SRC}
 v.play().catch(()=>{})}};
