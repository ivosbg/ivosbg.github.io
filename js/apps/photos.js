'use strict';

APPS.photos={t:'ivOS Снимки',i:ico('#ff9a5a','#d8421c',G.pic),w:560,h:520,open(b){
 let z=1;b.style.cssText+=';display:flex;flex-direction:column;background:#0c2438';
 const im=h('img',{alt:'Портрет на Дунав',style:'display:block;margin:auto'}),box=h('div',{style:'flex:1;overflow:auto;display:flex;min-height:0'},im),note=h('span',{style:'font-size:12px;color:#456;flex:1'},'Портрет на Дунав.jpg');
 im.referrerPolicy='no-referrer';const fit=()=>{im.style.width=Math.max(60,(Math.min(box.clientWidth,box.clientHeight)-8)*z)+'px'};
 im.onerror=()=>{if(im.src!==FB){im.src=FB;note.textContent='Оригиналната снимка не е налична – връзката ѝ може да е изтекла.'}};im.src=IMG;
 const zb=(t,f)=>h('button',{class:'b',onclick:()=>{f();fit()}},t);
 b.append(box,h('div',{class:'row'},zb('−',()=>z=Math.max(.25,z/1.25)),zb('+',()=>z=Math.min(6,z*1.25)),zb('Побери',()=>z=1),h('button',{class:'b',onclick:()=>box.requestFullscreen&&box.requestFullscreen()},'⛶ Цял екран'),h('button',{class:'b',onclick:()=>{setWp('photo');note.textContent='Постави като тапет'}},'Постави като тапет'),note));
 new ResizeObserver(fit).observe(box)}};
