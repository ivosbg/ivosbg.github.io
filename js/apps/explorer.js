'use strict';

APPS.explorer={t:'ivOS Файлове',i:ico('#ffe27a','#f0a020',G.fold),w:580,h:380,open(b){
 let path=[];const fi=ico('#ffe27a','#f0a020',G.fold),di=ico('#fff','#b9d3e6',G.note);
 const root=()=>({k:[{n:'Снимки',k:[{n:'Портрет на Дунав.jpg',a:'photos'},{n:'Тапети (в Настройки)',a:'settings'}]},{n:'Документи',k:Object.keys(store.get('docs',{})).map(n=>({n,a:'notepad',g:n}))},{n:'Видеа',k:[{n:'qman kuper',a:'player'}]},{n:'Изтегляния',k:[{n:'Вирус Марио.exe',a:'mario'}]},{n:'Игри',k:[{n:'Дунавско приключение',a:'game'},{n:'AfaiCraft',a:'afaicraft'}]},{n:'Прочети ме.txt',txt:'Добре дошли в ivOS. Кликнете двукратно върху файловете, за да ги отворите, щракнете с десния бутон върху работния плот за опции и използвайте бутона Старт, за да намерите всички приложения.'}]});
 const render=()=>{let cur=root();path.forEach(p=>cur=cur.k.find(x=>x.n===p));b.innerHTML='';
  b.append(h('div',{class:'row'},h('button',{class:'b',onclick:()=>{path.pop();render()}},'↑ Нагоре'),h('span',{style:'flex:1;background:#fff;border:1px solid #9bc;padding:3px 8px;font-size:13px'},'Компютър'+path.map(p=>' › '+p).join(''))));
  const g=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px;padding:10px;align-content:flex-start'});
  cur.k.forEach(f=>{const e=h('div',{class:'xi'});e.innerHTML=(f.k?fi:f.a?APPS[f.a].i:di)+`<div></div>`;e.lastChild.textContent=f.n;
   e.ondblclick=()=>{if(f.k){path.push(f.n);render()}else if(f.txt){const d=store.get('docs',{});if(!(f.n in d))d[f.n]=f.txt;store.set('docs',d);openApp('notepad',f.n)}else openApp(f.a,f.g)};g.append(e)});
  if(!cur.k.length)g.append(h('i',{style:'color:#678;padding:10px'},'Тази папка е празна. Запишете файл в Бележника, за да се покаже тук.'));b.append(g)};
 render()}};
