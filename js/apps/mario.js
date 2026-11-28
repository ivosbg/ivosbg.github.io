'use strict';

APPS.mario={t:'Вирус Марио',i:`<img class="mvi" alt="" src="${IMG}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=FB">`,w:380,h:310,open(b){
 b.style.cssText+=';background:radial-gradient(#7a0010,#2a0006);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:16px';
 mvLbl=h('b',{style:'font-size:34px'},'5');
 b.append(h('h2',{},'☠ ВИРУС МАРИО ☠'),h('p',{},'Просто безобидна шега: нищо на компютъра ви не е засегнато. Копия на Марио се разхождат по работния ви плот. Кликнете върху някое, за да го спукате.'),h('div',{},mvLbl,' остават'),h('button',{class:'b big',onclick:()=>{mvKill();sfx('ding')}},'Почисти'),h('button',{class:'b',onclick:mvSpawn},'Зарази отново'));
 b.go=mvSpawn;mvSpawn()}};
