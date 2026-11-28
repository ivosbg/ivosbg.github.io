/* ===== TOUCH CONTROLS — on-screen controls for phones & tablets =====
   Feeds the game the SAME events a keyboard + mouse would (KeyboardEvent codes, mousemove drags, wheel),
   so driving, sprint, crouch, enter/exit vehicle, horn, map, radio… all work unchanged. */
(function(){
'use strict';
var D=window.DEVICE;if(!D)return;
var doc=document,W=window;
function store(k,v){try{if(v===undefined)return W.localStorage.getItem(k);W.localStorage.setItem(k,v)}catch(e){return null}}

/* ---------- styles ---------- */
var css=[
'html[data-controls="touch"],html[data-controls="touch"] body{touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}',
/* game HUD re-layout so it never collides with the touch controls */
'html[data-controls="touch"] .mtaHp{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;background:rgba(8,10,14,.86)!important}',
'html[data-controls="touch"] .mtaCross{mix-blend-mode:normal!important;text-shadow:0 0 2px #000,0 0 5px #000}',
'.mtc-perf{position:fixed;left:50%;top:34px;transform:translateX(-50%);z-index:80;pointer-events:none;font:600 11px/1.35 ui-monospace,Menlo,Consolas,monospace;color:#fff;text-shadow:0 1px 2px #000;background:rgba(0,0,0,.5);padding:3px 9px;border-radius:6px;white-space:pre;text-align:center}',
'html[data-controls="touch"] .mtaMap{left:calc(env(safe-area-inset-left,0px) + 8px)!important;top:50px!important;bottom:auto!important;width:104px!important;height:104px!important;border-width:2px!important;border-radius:12px!important}',
'html[data-controls="touch"] .mtaMap.big{width:min(60vmin,300px)!important;height:min(60vmin,300px)!important}',
'html[data-controls="touch"] .mtaSpeed{right:auto!important;left:50%!important;transform:translateX(-50%)!important;bottom:calc(env(safe-area-inset-bottom,0px) + 4px)!important;width:200px!important;height:70px!important}',
'html[data-controls="touch"] .mtaCompass{width:min(46vw,300px)!important;height:auto!important;top:4px!important}',
'html[data-controls="touch"] .mtaHp{min-width:0!important;transform:scale(.78);transform-origin:top right;right:calc(env(safe-area-inset-right,0px) + 6px)!important;top:6px!important}',
'html[data-controls="touch"] .mtaPrompt{bottom:calc(env(safe-area-inset-bottom,0px) + 82px)!important;font-size:16px!important}',
'html[data-controls="touch"] .mtaHelp{max-width:min(88vw,640px);font:500 clamp(11px,1.9vmin,14px)/1.5 system-ui,sans-serif;color:#ffd6ec;opacity:.9;margin-top:6px}',
/* controls layer */
'.mtc{position:fixed;inset:0;z-index:25;pointer-events:none;display:none;--u:clamp(44px,10.5vmin,76px);--us:clamp(34px,8vmin,50px);--js:clamp(112px,30vmin,170px);--sb:env(safe-area-inset-bottom,0px);--sl:env(safe-area-inset-left,0px);--sr:env(safe-area-inset-right,0px);--m:2.6vmin;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}',
'.mtc.show{display:block}',
'.mtc-zone{position:absolute;top:0;bottom:0;pointer-events:auto;touch-action:none}',
'.mtc-zone.l{left:0;width:44%}.mtc-zone.r{left:44%;right:0}',
'.mtc-stick{position:absolute;width:var(--js);height:var(--js);margin:calc(var(--js)/-2) 0 0 calc(var(--js)/-2);border-radius:50%;border:2px solid rgba(255,255,255,.4);background:radial-gradient(circle,rgba(255,255,255,.12),rgba(255,255,255,.03));opacity:.42;transition:opacity .15s;pointer-events:none}',
'.mtc-stick.on{opacity:.95}',
'.mtc-knob{position:absolute;left:50%;top:50%;width:44%;height:44%;margin:-22% 0 0 -22%;border-radius:50%;background:rgba(255,255,255,.52);border:2px solid rgba(255,255,255,.85);box-shadow:0 2px 10px rgba(0,0,0,.4)}',
'.mtc-stick.run .mtc-knob{background:rgba(255,190,70,.8);border-color:#ffd27a}',
'.mtc-b{position:absolute;pointer-events:auto;touch-action:none;width:var(--w,var(--u));height:var(--w,var(--u));border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:700;background:rgba(14,18,30,.46);border:2px solid rgba(255,255,255,.4);box-shadow:0 2px 10px rgba(0,0,0,.35);text-shadow:0 1px 2px #000;-webkit-user-select:none;user-select:none;cursor:pointer}',
'.mtc-b i{font-style:normal;font-size:calc(var(--w,var(--u))*.42);line-height:1}',
'.mtc-b span{font-size:calc(var(--w,var(--u))*.17);letter-spacing:.04em;opacity:.92;margin-top:2px;line-height:1}',
'.mtc-b.on{background:rgba(255,255,255,.36);border-color:#fff;transform:scale(.94)}',
'.mtc-b.latch{background:rgba(255,190,70,.5);border-color:#ffd27a}',
'.mtc-b.pulse::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:3px solid rgba(255,214,120,.9);pointer-events:none;animation:mtcp 1.05s ease-out infinite}',
'@keyframes mtcp{0%{transform:scale(.88);opacity:.95}100%{transform:scale(1.28);opacity:0}}',
'.mtc-b.s{--w:var(--us)}.mtc-b.s i{font-size:calc(var(--us)*.5)}',
/* right-hand action cluster (thumb arc) */
'.mtc-b.jump{--w:calc(var(--u)*1.55);right:calc(var(--sr) + var(--m));bottom:calc(var(--sb) + var(--m))}',
'.mtc-b.use{--w:calc(var(--u)*1.15);right:calc(var(--sr) + var(--m) + var(--u)*.2);bottom:calc(var(--sb) + var(--m) + var(--u)*1.72)}',
'.mtc-b.run{--w:calc(var(--u)*1.05);right:calc(var(--sr) + var(--m) + var(--u)*1.78);bottom:calc(var(--sb) + var(--m) + var(--u)*.1)}',
'.mtc-b.crouch{--w:calc(var(--u)*.95);right:calc(var(--sr) + var(--m) + var(--u)*1.78);bottom:calc(var(--sb) + var(--m) + var(--u)*1.35)}',
'.mtc-b.horn{--w:calc(var(--u)*.9);right:calc(var(--sr) + var(--m) + var(--u)*3.0);bottom:calc(var(--sb) + var(--m) + var(--u)*.55)}',
/* top-right utility row (under the health bar) */
'.mtc-util{position:absolute;right:calc(var(--sr) + 8px);top:calc(env(safe-area-inset-top,0px) + 46px);display:flex;gap:6px;pointer-events:none}',
'.mtc-util .mtc-b{position:relative;pointer-events:auto}',
/* panels */
'.mtc-panel{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(4,6,12,.78);pointer-events:auto;touch-action:manipulation;font-family:system-ui,sans-serif}',
'.mtc-panel.show{display:flex}',
'.mtc-card{background:#12151f;border:1px solid #3a4258;border-radius:12px;padding:16px 20px;width:min(92vw,420px);max-height:92vh;overflow:auto;color:#eee;font-size:14px;line-height:1.4}',
'.mtc-card h3{margin:0 0 4px;font:800 18px system-ui}.mtc-card .sub{opacity:.7;font-size:12px;margin-bottom:12px}',
'.mtc-row{display:grid;grid-template-columns:1fr 1.2fr;gap:8px 12px;align-items:center;margin:8px 0}',
'.mtc-card select,.mtc-card input[type=range]{width:100%;background:#1b2030;color:#fff;border:1px solid #3a4258;border-radius:6px;padding:6px;font-size:14px}',
'.mtc-btnrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}',
'.mtc-card button{flex:1;min-width:110px;padding:10px 12px;border-radius:8px;border:1px solid #4a557a;background:#26304e;color:#fff;font:700 14px system-ui;cursor:pointer}',
'.mtc-card button.pri{background:#2d6cdf;border-color:#6aa0ff}',
'.mtc-tip{font-size:12px;opacity:.7;margin-top:8px}',
'.mtc-rot{position:fixed;inset:0;z-index:55;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:rgba(6,8,16,.93);color:#fff;text-align:center;padding:24px;font-family:system-ui,sans-serif;pointer-events:auto}',
'.mtc-rot.show{display:flex}',
'.mtc-rot .ph{font-size:64px;animation:mtcrot 2.2s ease-in-out infinite}@keyframes mtcrot{0%,20%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}',
'.mtc-rot button{padding:10px 18px;border-radius:8px;border:1px solid #4a557a;background:#26304e;color:#fff;font:700 14px system-ui}',
'.mtc-chip{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);transform:translateX(-50%);z-index:70;display:none;align-items:center;gap:10px;padding:8px 14px;border-radius:99px;background:rgba(10,14,24,.86);border:1px solid rgba(255,255,255,.28);color:#fff;font:600 13px system-ui,sans-serif;max-width:92vw;white-space:nowrap;box-shadow:0 4px 18px rgba(0,0,0,.5);pointer-events:auto}',
'.mtc-chip.show{display:flex}.mtc-chip button{padding:4px 10px;border-radius:99px;border:1px solid #6aa0ff;background:#2d6cdf;color:#fff;font:700 12px system-ui;cursor:pointer}'
].join('\n');
var st=doc.createElement('style');st.id='mtcStyle';st.textContent=css;(doc.head||doc.documentElement).appendChild(st);

/* ---------- synthetic input (same events as keyboard + mouse) ---------- */
var KN={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',Space:' ',ShiftLeft:'Shift',KeyC:'c',KeyF:'f',KeyH:'h',KeyM:'m',KeyR:'r',KeyN:'n',KeyY:'y'};
var held={};
function gameEl(){return doc.querySelector('.bd')}
function focusGame(){var g=gameEl();if(g&&doc.activeElement!==g){try{g.focus({preventScroll:true})}catch(e){}}}
function key(code,on){on=!!on;if(!!held[code]===on)return;held[code]=on;if(on)focusGame();
 try{doc.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code:code,key:KN[code]||code,bubbles:true,cancelable:true}))}catch(e){}}
function tap(code){key(code,true);setTimeout(function(){key(code,false)},70)}
function releaseAll(){Object.keys(held).forEach(function(c){if(held[c])key(c,false)})}
var sens=parseFloat(store('mta_sens'))||1;
function look(dx,dy,x,y){var g=gameEl();if(!g)return;var k=2.2*sens;
 var ev=new MouseEvent('mousemove',{bubbles:true,cancelable:true,buttons:1,clientX:x||0,clientY:y||0});
 try{Object.defineProperty(ev,'movementX',{value:dx*k});Object.defineProperty(ev,'movementY',{value:dy*k})}catch(e){}
 g.dispatchEvent(ev)}
function zoom(dir){var g=gameEl();if(!g)return;try{g.dispatchEvent(new WheelEvent('wheel',{deltaY:dir*120,bubbles:true,cancelable:true}))}catch(e){}}
function buzz(){try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}}

/* ---------- build the UI ---------- */
var root=doc.createElement('div');root.className='mtc';
var zl=doc.createElement('div'),zr=doc.createElement('div');zl.className='mtc-zone l';zr.className='mtc-zone r';
var stick=doc.createElement('div'),knob=doc.createElement('div');stick.className='mtc-stick';knob.className='mtc-knob';stick.appendChild(knob);
root.appendChild(zl);root.appendChild(zr);root.appendChild(stick);

var shiftLatch=false,stickRun=false,runBtn=null,useBtn=null;
function syncShift(){key('ShiftLeft',shiftLatch||stickRun)}
function btn(parent,cls,icon,lab,h){
 var b=doc.createElement('div');b.className='mtc-b '+cls;b.innerHTML='<i>'+icon+'</i>'+(lab?'<span>'+lab+'</span>':'');
 var rep=0;
 function down(e){e.preventDefault();e.stopPropagation();try{b.setPointerCapture(e.pointerId)}catch(x){}b.classList.add('on');buzz();focusGame();h.down&&h.down(b);if(h.rep){rep=setInterval(function(){h.down&&h.down(b)},h.rep)}}
 function up(e){if(!b.classList.contains('on'))return;b.classList.remove('on');clearInterval(rep);h.up&&h.up(b)}
 b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
 b.addEventListener('contextmenu',function(e){e.preventDefault()});
 parent.appendChild(b);return b}
function holdKey(code){return{down:function(){key(code,true)},up:function(){key(code,false)}}}
function tapKey(code){return{down:function(){tap(code)}}}

btn(root,'jump','⬆','JUMP',holdKey('Space'));
useBtn=btn(root,'use','🚗','ENTER',tapKey('KeyF'));
btn(root,'crouch','⬇','CROUCH',holdKey('KeyC'));
runBtn=btn(root,'run','🏃','RUN',{down:function(b){shiftLatch=!shiftLatch;b.classList.toggle('latch',shiftLatch);syncShift()},up:function(){}});
btn(root,'horn','📣','HORN',{down:function(){tap('KeyH')},rep:260});
var util=doc.createElement('div');util.className='mtc-util';root.appendChild(util);
btn(util,'s','🗺','',tapKey('KeyM'));
btn(util,'s','📻','',tapKey('KeyR'));
btn(util,'s','🌗','',tapKey('KeyN'));
btn(util,'s','🔧','',tapKey('KeyY'));
var fsB=btn(util,'s','⛶','',{down:function(){toggleFullscreen()}});
btn(util,'s','⚙','',{down:function(){openPanel()}});
doc.body.appendChild(root);

/* ---------- floating joystick (left zone) ---------- */
var sId=null,sx=0,sy=0,R=60;
function restPos(){var vh=W.innerHeight,vw=W.innerWidth,js=stick.offsetWidth||130;R=js/2;
 var sl=parseFloat(getComputedStyle(root).getPropertyValue('--sl'))||0;
 return{x:Math.max(R+10,sl+R+vw*.035+10),y:vh-R-Math.max(14,vh*.05)-(parseFloat(getComputedStyle(root).getPropertyValue('--sb'))||0)}}
function placeStick(x,y){stick.style.left=x+'px';stick.style.top=y+'px'}
function resetStick(){var p=restPos();placeStick(p.x,p.y);knob.style.transform='';stick.classList.remove('on','run');stickRun=false;syncShift();['KeyW','KeyA','KeyS','KeyD'].forEach(function(c){key(c,false)})}
function stickMove(cx,cy){
 var dx=cx-sx,dy=cy-sy,rr=R*.62,len=Math.hypot(dx,dy)||1,m=Math.min(1,len/rr),nx=dx/len*m,ny=dy/len*m;
 knob.style.transform='translate('+(nx*rr)+'px,'+(ny*rr)+'px)';
 var T=.34;key('KeyW',ny<-T);key('KeyS',ny>T);key('KeyA',nx<-T);key('KeyD',nx>T);
 var run=len>=R*1.02&&ny<-.25;                 /* sprint: thumb pushed beyond the outer ring */if(run!==stickRun){stickRun=run;stick.classList.toggle('run',run);syncShift()}}
zl.addEventListener('pointerdown',function(e){if(sId!==null)return;e.preventDefault();sId=e.pointerId;try{zl.setPointerCapture(e.pointerId)}catch(x){}
 var vw=W.innerWidth,vh=W.innerHeight;R=(stick.offsetWidth||130)/2;
 sx=Math.min(Math.max(e.clientX,R+6),vw*.44-6);sy=Math.min(Math.max(e.clientY,R+6),vh-R-6);placeStick(sx,sy);stick.classList.add('on');focusGame();stickMove(e.clientX,e.clientY)});
zl.addEventListener('pointermove',function(e){if(e.pointerId===sId)stickMove(e.clientX,e.clientY)});
function sEnd(e){if(e.pointerId===sId){sId=null;resetStick()}}
zl.addEventListener('pointerup',sEnd);zl.addEventListener('pointercancel',sEnd);

/* ---------- camera look + pinch zoom (right zone) ---------- */
var pts={},pinch=0;
function dist(){var k=Object.keys(pts);if(k.length<2)return 0;var a=pts[k[0]],b=pts[k[1]];return Math.hypot(a.x-b.x,a.y-b.y)}
zr.addEventListener('pointerdown',function(e){e.preventDefault();try{zr.setPointerCapture(e.pointerId)}catch(x){}pts[e.pointerId]={x:e.clientX,y:e.clientY};focusGame();if(Object.keys(pts).length===2)pinch=dist()});
zr.addEventListener('pointermove',function(e){var p=pts[e.pointerId];if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(Object.keys(pts).length>=2){var d=dist();if(Math.abs(d-pinch)>34){zoom(d>pinch?-1:1);pinch=d}}else look(dx,dy,e.clientX,e.clientY)});
function rEnd(e){delete pts[e.pointerId];pinch=0}
zr.addEventListener('pointerup',rEnd);zr.addEventListener('pointercancel',rEnd);
[zl,zr].forEach(function(z){z.addEventListener('contextmenu',function(e){e.preventDefault()})});

/* ---------- fullscreen / orientation ---------- */
var fsOK=!!(doc.documentElement.requestFullscreen||doc.documentElement.webkitRequestFullscreen);
if(!fsOK)fsB.style.display='none';
function isFS(){return !!(doc.fullscreenElement||doc.webkitFullscreenElement)}
function toggleFullscreen(){var el=doc.documentElement;
 if(isFS()){(doc.exitFullscreen||doc.webkitExitFullscreen).call(doc);return}
 var p=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);
 var lock=function(){try{screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(function(){})}catch(e){}};
 if(p&&p.then)p.then(lock,function(){});else lock()}
var wl=null;function keepAwake(){try{if(navigator.wakeLock&&!wl)navigator.wakeLock.request('screen').then(function(s){wl=s;s.addEventListener('release',function(){wl=null})}).catch(function(){})}catch(e){}}


/* ---------- performance overlay: FPS, JS time per frame, draw calls, triangles, verdict ---------- */
var perf={on:false,el:null,ts:-1,js:0,calls:0,tris:0,fr:[],tm:0,wt:0,rafOrig:null};
function glCtx(){var a=W.__mtaGLs||[],g=gameEl();for(var i=a.length-1;i>=0;i--){var c=a[i].canvas;if(g&&c&&g.contains(c))return a[i]}return a.length?a[a.length-1]:null}
function wrapGL(){var gl=glCtx();if(!gl||gl.__mtaW)return !!(gl&&gl.__mtaW);gl.__mtaW=[];
 function w(n,fn){if(typeof gl[n]!=='function')return;var f=gl[n];gl.__mtaW.push(n);gl[n]=function(){perf.calls++;fn.apply(null,arguments);return f.apply(gl,arguments)}}
 w('drawElements',function(m,c){if(m===4)perf.tris+=c/3});w('drawArrays',function(m,f,c){if(m===4)perf.tris+=c/3});
 w('drawElementsInstanced',function(m,c,t,o,n){if(m===4)perf.tris+=c/3*n});w('drawArraysInstanced',function(m,f,c,n){if(m===4)perf.tris+=c/3*n});return true}
function unwrapGL(){(W.__mtaGLs||[]).forEach(function(gl){if(!gl.__mtaW)return;gl.__mtaW.forEach(function(n){try{delete gl[n]}catch(e){}});gl.__mtaW=null})}
function rafWrap(cb){return perf.rafOrig.call(W,function(ts){
 if(ts!==perf.ts){if(perf.ts>=0){perf.fr.push([ts-perf.ts,perf.js,perf.calls,perf.tris]);if(perf.fr.length>90)perf.fr.shift()}perf.ts=ts;perf.js=0;perf.calls=0;perf.tris=0}
 var a=performance.now();try{cb(ts)}finally{perf.js+=performance.now()-a}})}
function perfShow(){var n=perf.fr.length;if(n<10){perf.el.textContent='measuring…';return}
 var d=0,j=0,mj=0,c=0,t=0;perf.fr.forEach(function(f){d+=f[0];j+=f[1];if(f[1]>mj)mj=f[1];c+=f[2];t+=f[3]});d/=n;j/=n;c/=n;t/=n;
 var v=j>d*.7?'CPU-bound (JS / draw submit)':(d>28&&d<38&&j<d*.5)?'capped ~30 fps (Low Power Mode?)':d>22?'GPU / compositor-bound':'smooth';
 var gl=glCtx(),res=gl&&gl.canvas?gl.canvas.width+'×'+gl.canvas.height:'?';
 perf.el.textContent=Math.round(1000/d)+' FPS ('+d.toFixed(1)+' ms)  ·  JS '+j.toFixed(1)+' ms (max '+mj.toFixed(0)+')\n'+Math.round(c)+' draw calls  ·  '+Math.round(t/1000)+'k tris  ·  '+res+'\n'+v}
function setPerf(on){on=!!on;if(on===perf.on)return;perf.on=on;store('mta_perf',on?'1':'0');
 if(on){perf.el=doc.createElement('div');perf.el.className='mtc-perf';perf.el.textContent='measuring…';doc.body.appendChild(perf.el);
  perf.rafOrig=W.requestAnimationFrame;W.requestAnimationFrame=rafWrap;perf.fr=[];perf.ts=-1;
  perf.wt=setInterval(function(){wrapGL()},500);perf.tm=setInterval(perfShow,500)}
 else{clearInterval(perf.tm);clearInterval(perf.wt);if(perf.rafOrig){W.requestAnimationFrame=perf.rafOrig;perf.rafOrig=null}unwrapGL();if(perf.el){perf.el.remove();perf.el=null}}}
if(/[?&]perf=1\b/.test(W.location.search)||store('mta_perf')==='1')setPerf(true);

/* ---------- settings panel ---------- */
var panel=doc.createElement('div');panel.className='mtc-panel';
var GP={medium:{res:1,sh:1024,dist:1,fx:0,half:1},low:{res:.75,sh:0,dist:2,fx:0,half:0},potato:{res:.5,sh:0,dist:2,fx:0,half:0}};
function curGfx(){try{return JSON.parse(store('mta_gfx')||'{}').preset||'auto'}catch(e){return'auto'}}
panel.innerHTML='<div class="mtc-card"><h3>⚙ Settings</h3><div class="sub" id="mtcDev"></div>'+
 '<div class="mtc-row"><label>Look sensitivity</label><input id="mtcSens" type="range" min="0.5" max="2.5" step="0.1"></div>'+
 '<div class="mtc-row"><label>Controls</label><select id="mtcCtl"><option value="auto">Auto-detect</option><option value="touch">Touch screen</option><option value="keyboard">Keyboard + mouse</option></select></div>'+
 '<div class="mtc-row"><label>Graphics</label><select id="mtcGfx"><option value="auto">Auto (recommended)</option><option value="medium">Medium</option><option value="low">Low</option><option value="potato">Potato</option></select></div>'+
 '<div class="mtc-row"><label>Performance overlay</label><select id="mtcPerf"><option value="0">Off</option><option value="1">On (FPS, JS ms, draw calls)</option></select></div>'+
 '<div class="mtc-tip" id="mtcGfxTip" style="display:none">Graphics change applies after restart.</div>'+
 '<div class="mtc-btnrow"><button id="mtcFs">⛶ Fullscreen</button><button id="mtcRst" style="display:none">↻ Restart now</button><button class="pri" id="mtcClose">Close</button></div>'+
 '<div class="mtc-tip" id="mtcIosTip" style="display:none">iPhone tip: tap Share → “Add to Home Screen” to play fullscreen.</div></div>';
doc.body.appendChild(panel);
var $=function(id){return panel.querySelector('#'+id)};
function openPanel(){releaseAll();shiftLatch=false;runBtn.classList.remove('latch');$('mtcDev').textContent='Detected: '+D.label+' · '+D.os+' · '+D.browser+' · '+W.innerWidth+'×'+W.innerHeight;
 $('mtcSens').value=sens;$('mtcPerf').value=perf.on?'1':'0';$('mtcCtl').value=D.pref;$('mtcGfx').value=curGfx();
 $('mtcFs').style.display=fsOK?'':'none';$('mtcIosTip').style.display=(D.iOS&&!fsOK)?'':'none';panel.classList.add('show');refresh()}
function closePanel(){panel.classList.remove('show');focusGame();refresh()}
$('mtcClose').addEventListener('click',closePanel);
$('mtcFs').addEventListener('click',toggleFullscreen);
$('mtcSens').addEventListener('input',function(){sens=parseFloat(this.value)||1;store('mta_sens',String(sens))});
$('mtcCtl').addEventListener('change',function(){D.setControls(this.value);refresh()});
$('mtcGfx').addEventListener('change',function(){var v=this.value,o={};try{o=JSON.parse(store('mta_gfx')||'{}')}catch(e){}
 o=(v==='auto')?Object.assign(o,{preset:'auto'}):Object.assign(o,{preset:v},GP[v]);store('mta_gfx',JSON.stringify(o));
 $('mtcGfxTip').style.display='';$('mtcRst').style.display=''});
$('mtcPerf').addEventListener('change',function(){setPerf(this.value==='1')});
$('mtcRst').addEventListener('click',function(){W.location.reload()});
panel.addEventListener('pointerdown',function(e){if(e.target===panel)closePanel()});

/* ---------- portrait hint (phones) ---------- */
var rot=doc.createElement('div');rot.className='mtc-rot';
rot.innerHTML='<div class="ph">📱</div><div style="font:800 20px system-ui">Rotate your phone</div><div style="opacity:.75;font-size:14px;max-width:320px">Mario Theft Auto plays best in landscape.</div><button id="mtcPort">Play in portrait anyway</button>';
doc.body.appendChild(rot);var portraitOK=false;
rot.querySelector('#mtcPort').addEventListener('click',function(){portraitOK=true;refresh()});

/* ---------- start-of-game chip: tells the player what was detected ---------- */
var chip=doc.createElement('div');chip.className='mtc-chip';doc.body.appendChild(chip);var chipT=0;
function showChip(html,ms,onBtn){chip.innerHTML=html;chip.classList.add('show');clearTimeout(chipT);
 var b=chip.querySelector('button');if(b&&onBtn)b.addEventListener('click',function(){chip.classList.remove('show');onBtn()});
 if(ms)chipT=setTimeout(function(){chip.classList.remove('show')},ms)}

/* ---------- visibility: only while actually playing ---------- */
function playing(){
 var intro=doc.getElementById('launchIntro');
 if(intro){var cs=getComputedStyle(intro);if(cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>.02&&intro.getClientRects().length)return false}
 if(doc.getElementById('cinemaLoader'))return false;
 var g=gameEl();if(!g)return false;
 var ov=g.querySelector('.ov');if(!ov||getComputedStyle(ov).display!=='none')return false;
 if(g.querySelector('.gfxp'))return false;
 for(var c=g.firstElementChild;c;c=c.nextElementSibling){if(c.style&&c.style.zIndex==='40'&&c.style.display!=='none')return false}
 return true}
var wasShown=false,wasPlaying=false;
function refresh(){
 var touchUI=D.touchUI,pl=touchUI&&playing(),port=D.phone&&!D.landscape&&!portraitOK;
 root.classList.toggle('show',pl&&!panel.classList.contains('show'));
 rot.classList.toggle('show',touchUI&&port&&(pl||wasPlaying));
 if(pl&&!wasShown){resetStick();keepAwake()}
 if(!pl&&wasShown){releaseAll();sId=null;pts={};shiftLatch=false;runBtn.classList.remove('latch');resetStick()}
 if(pl)wasPlaying=true;wasShown=pl}
setInterval(refresh,250);W.addEventListener('resize',function(){if(wasShown)resetStick();refresh()});
W.addEventListener('blur',releaseAll);doc.addEventListener('visibilitychange',function(){if(doc.hidden)releaseAll()});
W.addEventListener('devicechange',function(){refresh()});
['gesturestart','gesturechange','gestureend'].forEach(function(n){doc.addEventListener(n,function(e){if(D.touchUI)e.preventDefault()},{passive:false})});
doc.addEventListener('contextmenu',function(e){if(D.touchUI)e.preventDefault()});
/* iOS only starts audio from touchend/click */
function unlockAudio(){try{typeof au==='function'&&au()}catch(e){}}
doc.addEventListener('touchend',unlockAudio,{once:true,passive:true});doc.addEventListener('click',unlockAudio,{once:true});

/* ---------- HUD text: replace keyboard hints with button hints on touch ---------- */
function rewriteHints(){if(!D.touchUI)return;var g=gameEl();if(!g)return;
 for(var c=g.firstElementChild;c;c=c.nextElementSibling){
  if(!c.style)continue;var s=c.style.cssText;
  if(s.indexOf('bottom: 12%')>-1||s.indexOf('bottom:12%')>-1){var t=c.textContent,n=t.replace(/^F\s—\s/,'🚗 ');if(n!==t)c.textContent=n;useBtn.classList.toggle('pulse',!!n)}
  else if(s.indexOf('left: 10px')>-1&&s.indexOf('top: 8px')>-1){var t2=c.textContent,n2=t2.replace(/R\s—\sradio/,'📻 radio').replace(/\(R\s—\soff\)/,'(📻 off)');if(n2!==t2)c.textContent=n2}}}
setInterval(rewriteHints,300);

/* ---------- mini-map "big" state → css class ---------- */
setInterval(function(){var g=gameEl();if(!g)return;var m=g.querySelector('.mtaMap');if(m)m.classList.toggle('big',parseInt(m.style.width,10)>300)},400);

/* ---------- detection chip + hybrid-device offer ---------- */
var shownChip=false;
setInterval(function(){if(shownChip)return;var g=gameEl();if(!g)return;var ov=g.querySelector('.ov');
 if(ov&&getComputedStyle(ov).display==='flex'&&!doc.getElementById('cinemaLoader')&&!doc.getElementById('launchIntro')){shownChip=true;
  var ic=D.phone?'📱':D.tablet?'📲':'💻';
  showChip(ic+' '+D.label+' detected — '+(D.touchUI?'touch controls on':'keyboard & mouse'),7000)}},500);
if(!D.touchUI&&D.pref==='auto'){W.addEventListener('pointerdown',function f(e){if(e.pointerType==='touch'){W.removeEventListener('pointerdown',f,true);
 showChip('👆 Touch screen detected <button>Enable touch controls</button>',9000,function(){D.setControls('touch');refresh()})}},true)}
refresh();
})();
