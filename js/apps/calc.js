'use strict';

APPS.calc={t:'ivOS Калкулатор',i:ico('#6fd6ff','#1670b8',G.calc),w:270,h:390,open(b){
 let e='';b.tabIndex=0;b.style.cssText+=';background:#e9eef5;display:flex;flex-direction:column;outline:0';
 const d=h('div',{style:'background:#fff;border:1px solid #8e9fb5;color:#000;font:30px/1.3 "Segoe UI";text-align:right;padding:12px;margin:6px;border-radius:5px;min-height:62px;overflow:hidden;word-break:break-all'},'0');
 const sh=()=>d.textContent=e.replace(/\*/g,'×').replace(/\//g,'÷')||'0';
 const eq=()=>{if(!e)return;try{if(!/^[\d+\-*/.%() ]+$/.test(e))throw 0;const v=Function('"use strict";return ('+e.replace(/%/g,'/100')+')')();if(!Number.isFinite(v))throw 0;e=String(+v.toPrecision(12));sh()}catch(x){e='';d.textContent='Грешка'}};
 const press=k=>{if(k==='='){eq();return}if(k==='C')e='';else if(k==='⌫')e=e.slice(0,-1);else if(k==='±')e=e.startsWith('-')?e.slice(1):e&&'-'+e;else e+=k;sh()};
 const g=h('div',{style:'display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:6px;flex:1'});
 'C ⌫ % ÷ 7 8 9 × 4 5 6 − 1 2 3 + ± 0 . ='.split(' ').forEach(l=>g.append(h('button',{class:'b',style:'font-size:18px',onclick:()=>{press({'÷':'/','×':'*','−':'-'}[l]||l);b.focus()}},l)));
 b.onkeydown=ev=>{const k=ev.key;if(/^[\d+\-*/.%]$/.test(k))press(k);else if(k==='Enter'||k==='=')press('=');else if(k==='Backspace')press('⌫');else if(k==='Escape')press('C');else return;ev.preventDefault()};
 b.append(d,g);b.focus()}};
