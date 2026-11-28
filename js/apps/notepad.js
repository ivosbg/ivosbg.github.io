'use strict';

APPS.notepad={t:'ivOS Бележник',i:ico('#ffd45a','#e39a14',G.note),w:520,h:400,open(b){
 b.style.cssText+=';display:flex;flex-direction:column';
 const nm=h('input',{class:'in',value:'Без име.txt',style:'flex:1'}),ta=h('textarea',{style:'flex:1;border:0;padding:8px;font:14px Consolas,monospace;resize:none;outline:0;user-select:text'}),st=h('span',{style:'font-size:12px;color:#456'}),sel=h('select',{class:'in'});
 const docs=()=>store.get('docs',{});
 const ref=()=>{sel.innerHTML='<option value="">Отвори…</option>';Object.keys(docs()).forEach(n=>sel.append(h('option',{},n)))};
 const ld=n=>{const d=docs();if(n in d){nm.value=n;ta.value=d[n];st.textContent='Отворен: '+n}};
 const save=()=>{const d=docs(),n=nm.value.trim()||'Без име.txt';d[n]=ta.value;store.set('docs',d);st.textContent='Записано в '+new Date().toLocaleTimeString();ref()};
 b.append(h('div',{class:'row'},h('button',{class:'b',onclick:()=>{nm.value='Без име.txt';ta.value='';st.textContent='Нов документ'}},'Нов'),h('button',{class:'b',onclick:save},'Запази'),sel,nm),ta,h('div',{class:'row'},st));
 sel.onchange=()=>sel.value&&ld(sel.value);ta.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();save()}});
 b.go=a=>{ref();if(a==='')nm.value='Без име.txt',ta.value='';else if(a)ld(a)};b.go();ta.focus()}};
