'use strict';

APPS.browser={t:'ivOS Браузър',i:ico('#4fd0ff','#1272c8',G.globe),w:880,h:560,open(b){
 b.style.cssText+=';display:flex;flex-direction:column;overflow:hidden';
 const HOME='ivos:home';let T=[],cur=null;
 const tabs=h('div',{class:'tabs'}),addr=h('input',{class:'in',style:'flex:1',placeholder:'Търсете в Google или въведете адрес'}),bm=h('div',{class:'row',style:'padding:2px 5px;flex-wrap:wrap'}),view=h('div',{style:'flex:1;position:relative;background:#fff;min-height:0'}),prog=h('div',{style:'height:3px;background:#2ad;width:0;transition:width .4s;position:absolute;top:0;left:0;z-index:3'}),msg=h('div',{class:'msg'}),home=h('div',{class:'home'}),note=h('div',{class:'note'},'Някои сайтове не позволяват да бъдат показвани във вградени страници. Ако тази страница е празна или пише, че връзката е отказана, отворете я в нов раздел.',h('button',{class:'b',style:'padding:1px 8px',onclick:()=>window.open(cur.h[cur.i],'_blank','noopener')},'Отвори в нов раздел'));
 const norm=q=>{q=q.trim();return /^https?:\/\//i.test(q)?q:/^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(q)?'https://'+q:'https://www.google.com/search?igu=1&hl=bg&q='+encodeURIComponent(q)};
 const BM=()=>store.get('bm',[{t:'Уикипедия',u:'https://bg.wikipedia.org'},{t:'OpenStreetMap',u:'https://www.openstreetmap.org/export/embed.html'},{t:'Пример',u:'https://example.com'}]);
 const host=u=>{try{return new URL(u).hostname}catch(e){return u}};
 const drawTabs=()=>{tabs.innerHTML='';T.forEach(t=>tabs.append(h('div',{class:'tab'+(t===cur?' on':''),onclick:()=>{cur=t;drawTabs();show()}},h('span',{style:'flex:1;overflow:hidden;text-overflow:ellipsis'},t.title),h('b',{title:'Затвори раздела',onclick:e=>{e.stopPropagation();closeTab(t)}},'×'))));tabs.append(h('button',{class:'b',style:'padding:0 10px',title:'Нов раздел',onclick:()=>newTab()},'+'))};
 const drawBM=()=>{bm.innerHTML='';BM().forEach(x=>bm.append(h('button',{class:'b',style:'padding:1px 8px;font-size:12px',onclick:()=>go(x.u)},'★ '+x.t)))};
 const drawHome=()=>{home.innerHTML=`<div style="width:90px">${LOGO}</div><h1>ivOS Браузър</h1>`;const s=h('input',{class:'in',placeholder:'Търсене в Google…',style:'width:min(460px,85%);padding:10px 16px;border-radius:20px;font-size:16px'});s.onkeydown=e=>e.key==='Enter'&&go(s.value);const t=h('div',{style:'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:18px'});BM().forEach(x=>t.append(h('button',{class:'b',style:'width:120px;padding:14px 4px',onclick:()=>go(x.u)},x.t)));home.append(s,t)};
 const err=(ti,tx,u)=>{msg.innerHTML=`<h2>${ti}</h2><p>${tx}</p>`;msg.append(h('div',{class:'row',style:'background:none'},h('button',{class:'b',onclick:()=>window.open(u,'_blank','noopener')},'Отвори в нов раздел'),h('button',{class:'b',onclick:()=>{cur.f.dataset.u='';show()}},'Опитай отново')));msg.style.display='flex';prog.style.width='0'};
 const show=()=>{const t=cur,u=t.h[t.i];$$('iframe',view).forEach(f=>f.style.display='none');msg.style.display='none';T.forEach(x=>clearTimeout(x.tm));prog.style.width='0';
  home.style.display=u===HOME?'flex':'none';note.style.display=u===HOME?'none':'flex';addr.value=u===HOME?'':u;
  if(u===HOME){drawHome();t.title='Нов раздел'}else{
   if(!t.f){t.f=h('iframe',{class:'fr',referrerpolicy:'no-referrer'});t.f.addEventListener('load',()=>{if(!t.f.dataset.u)return;clearTimeout(t.tm);if(t===cur){prog.style.width='100%';setTimeout(()=>prog.style.width='0',300)}});view.append(t.f)}
   if(t.f.dataset.u!==u){t.f.dataset.u=u;if(!navigator.onLine)err('Изглежда нямате връзка с интернет','Проверете интернет връзката си и опитайте отново.',u);else{prog.style.width='70%';t.f.src=u;t.tm=setTimeout(()=>{if(t===cur)err('Страницата се зарежда твърде дълго','Сайтът може да блокира вграденото показване или връзката ви е бавна.',u)},10000)}}
   t.f.style.display='block';t.title=host(u)}
  drawTabs()};
 const go=u=>{const t=cur;t.h=t.h.slice(0,t.i+1);t.h.push(u===HOME?HOME:norm(u));t.i++;show()};
 const newTab=u=>{const t={h:[HOME],i:0,title:'Нов раздел'};T.push(t);cur=t;u?go(u):show()};
 const closeTab=t=>{t.f&&t.f.remove();clearTimeout(t.tm);T=T.filter(x=>x!==t);if(!T.length)return newTab();if(cur===t)cur=T[T.length-1];show()};
 const star=()=>{const u=cur.h[cur.i];if(u===HOME)return;const l=BM(),i=l.findIndex(x=>x.u===u);i>=0?l.splice(i,1):l.push({t:host(u),u});store.set('bm',l);drawBM()};
 addr.onkeydown=e=>{if(e.key==='Enter'&&addr.value.trim())go(addr.value)};addr.onfocus=()=>addr.select();
 b.append(tabs,h('div',{class:'row'},h('button',{class:'b',title:'Назад',onclick:()=>{if(cur.i>0){cur.i--;show()}}},'◀'),h('button',{class:'b',title:'Напред',onclick:()=>{if(cur.i<cur.h.length-1){cur.i++;show()}}},'▶'),h('button',{class:'b',title:'Презареди',onclick:()=>{if(cur.f)cur.f.dataset.u='';show()}},'⟳'),h('button',{class:'b',title:'Начало',onclick:()=>go(HOME)},'⌂'),addr,h('button',{class:'b',title:'Добави страницата в отметки',onclick:star},'☆')),bm,view,note);
 view.append(prog,home,msg);drawBM();newTab();b.go=u=>u&&newTab(u)}};
