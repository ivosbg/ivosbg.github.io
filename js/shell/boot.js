'use strict';

/* standalone: run only Mario Theft Auto */
document.body.classList.add('solo');
const gwrap=h('div',{style:'position:fixed;inset:0;display:flex;flex-direction:column;background:#000;z-index:5'}),gw=h('div',{class:'bd'});gwrap.append(gw);document.body.append(gwrap);
gw.tabIndex=0;window.__mtaStartGame=()=>{try{window.__cinemaLoader&&window.__cinemaLoader.attach(window.THREE);APPS.game.open(gw);window.__cinemaLoader&&window.__cinemaLoader.markAppReady()}catch(e){console.error(e);window.__cinemaLoader&&window.__cinemaLoader.fail(e);throw e}};window.dispatchEvent(new Event('mta-game-starter-ready'));
addEventListener('pointerdown',()=>{au()},{once:true,capture:true});
