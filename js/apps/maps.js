'use strict';

APPS.maps={t:'Карти',i:ico('#7fe0a0','#1a8a55','<path d="M24 10c-6 0-10 4.500-10 10 0 7 10 18 10 18s10-11 10-18c0-5.500-4-10-10-10z" fill="#e8402a" stroke="#fff" stroke-width="2"/><circle cx="24" cy="20" r="4" fill="#fff"/>'),w:860,h:580,open(b){
 b.style.cssText+=';display:flex;flex-direction:column;overflow:hidden';
 const LAT=43.8152164,LON=23.5143897,GL='https://www.google.com/maps/place/3642+%D0%94%D0%BE%D0%BB%D0%BD%D0%B8+%D0%A6%D0%B8%D0%B1%D1%8A%D1%80/@43.8141966,23.4965874,15z/data=!3m1!4b1!4m6!3m5!1s0x47535377b44bc0a5:0xa00a014cd0e2780!8m2!3d43.8152164!4d23.5143897!16s%2Fm%2F0129gc_q';
 const LY=[['m','🗺 Карта'],['k','🛰 Сателит'],['h','🛰 Сателит + имена'],['p','⛰ Релеф'],['osm','OpenStreetMap']],Z0=15;
 let z=Z0,ly='m';
 const u=()=>{if(ly==='osm'){const w=360/Math.pow(2,z)*1.7,t=w*.38;return `https://www.openstreetmap.org/export/embed.html?bbox=${LON-w},${LAT-t},${LON+w},${LAT+t}&layer=mapnik&marker=${LAT},${LON}`}return `https://maps.google.com/maps?q=${LAT},${LON}(%D0%94%D0%BE%D0%BB%D0%BD%D0%B8%20%D0%A6%D0%B8%D0%B1%D1%8A%D1%80)&t=${ly}&z=${z}&hl=bg&ie=UTF8&output=embed`};
 const fr=h('iframe',{style:'flex:1;border:0;width:100%;min-height:0;background:#e8eef4',referrerpolicy:'no-referrer',loading:'eager'}),lb=[],ld=()=>{fr.src=u();lb.forEach(([k,x])=>{x.style.boxShadow=k===ly?'inset 0 0 0 2px #1a8a55':'';x.style.fontWeight=k===ly?'700':''})};
 const row=h('div',{class:'row'},h('button',{class:'b',title:'Към Долни Цибър',onclick:()=>{z=Z0;ld()}},'📍 Долни Цибър'),h('button',{class:'b',title:'Приближи',onclick:()=>{z=Math.min(19,z+1);ld()}},'＋'),h('button',{class:'b',title:'Отдалечи',onclick:()=>{z=Math.max(5,z-1);ld()}},'−'),h('span',{style:'flex:1;font-size:12px;color:#345'},'3642 Долни Цибър, общ. Вълчедръм, обл. Монтана · 43.8152° с.ш., 23.5144° и.д.'),h('button',{class:'b',onclick:()=>window.open(GL,'_blank','noopener')},'Отвори в Google Maps'));
 const row2=h('div',{class:'row',style:'flex-wrap:wrap'},...LY.map(([k,n])=>{const x=h('button',{class:'b',title:'Слой: '+n,onclick:()=>{ly=k;ld()}},n);lb.push([k,x]);return x}));
 b.append(row,row2,fr);ld();b.go=()=>{z=Z0;ld()}}};
