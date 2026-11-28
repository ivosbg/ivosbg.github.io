/* ===== DEVICE DETECTION — what is the site opened on? =====
   Exposes window.DEVICE and tags <html> with data-device / data-os / data-controls. */
(function(){
 var w=window,nav=navigator,ua=nav.userAgent||'',uad=nav.userAgentData||null;
 function mq(q){try{return w.matchMedia(q).matches}catch(e){return false}}
 function store(k,v){try{if(v===undefined)return w.localStorage.getItem(k);w.localStorage.setItem(k,v)}catch(e){return null}}
 var plat=(uad&&uad.platform)||nav.platform||'',mt=nav.maxTouchPoints||0;
 var iPadOS=/Mac/i.test(plat)&&mt>1;                       /* iPadOS 13+ reports itself as a Mac */
 var iOS=/iPhone|iPad|iPod/i.test(ua)||iPadOS,android=/Android/i.test(ua);
 var os=iOS?'iOS':android?'Android':/CrOS/.test(ua)?'ChromeOS':/Win/i.test(plat+ua)?'Windows':/Mac/i.test(plat)?'macOS':/Linux|X11/i.test(plat+ua)?'Linux':'Unknown';
 var browser=/Edg\//.test(ua)?'Edge':/OPR\/|Opera/.test(ua)?'Opera':/Firefox|FxiOS/.test(ua)?'Firefox':/Chrome|CriOS/.test(ua)?'Chrome':/Safari/.test(ua)?'Safari':'Browser';
 var touch=('ontouchstart' in w)||mt>0,coarse=mq('(pointer:coarse)'),noHover=mq('(hover:none)');
 var mobUA=(uad&&typeof uad.mobile==='boolean')?uad.mobile:(/Mobi|iPhone|iPod|Windows Phone/i.test(ua)||(android&&/Mobile/i.test(ua)));
 var minSide=Math.min((w.screen&&w.screen.width)||0,(w.screen&&w.screen.height)||0)||Math.min(w.innerWidth,w.innerHeight);
 var type='desktop';
 if(/iPad/i.test(ua)||iPadOS)type='tablet';
 else if(mobUA)type=minSide>=600?'tablet':'phone';                        /* big-screen "mobile" UA = tablet / unfolded foldable */
 else if(android)type=minSide>=600?'tablet':'phone';
 else if(touch&&coarse&&noHover)type=minSide>=600?'tablet':'phone';      /* e.g. Surface in tablet mode */
 var D={type:type,phone:type==='phone',tablet:type==='tablet',desktop:type==='desktop',os:os,browser:browser,touch:touch,
  iOS:iOS,android:android,pref:'auto',controls:'keyboard',touchUI:false,
  get landscape(){return w.innerWidth>=w.innerHeight},
  get label(){return type==='phone'?(iOS?'iPhone':os+' phone'):type==='tablet'?(iOS?'iPad':os+' tablet'):(os==='macOS'?'Mac':os==='Windows'?'Windows PC':os==='Linux'?'Linux PC':os==='ChromeOS'?'Chromebook':'PC')},
  help:function(){return D.touchUI
   ?'Left thumb: move (push to the edge to run)  ·  Right thumb: look, pinch to zoom  ·  Buttons: jump, enter/exit vehicle, crouch, horn, map, radio'
   :'W A S D move  ·  Mouse look  ·  Space jump  ·  Shift run  ·  C crouch  ·  F enter/exit vehicle  ·  H horn  ·  M map  ·  R radio  ·  N time of day'},
  setControls:function(mode){D.pref=(mode==='touch'||mode==='keyboard')?mode:'auto';store('mta_ctrl',D.pref);apply();return D.controls}};
 function apply(){
  var q=(w.location.search.match(/[?&]controls=(touch|keyboard)\b/)||[])[1];
  var p=q||store('mta_ctrl')||'auto';if(p!=='touch'&&p!=='keyboard')p='auto';D.pref=p;
  D.controls=p==='auto'?(type==='desktop'?'keyboard':'touch'):p;D.touchUI=D.controls==='touch';
  var r=document.documentElement;r.setAttribute('data-device',type);r.setAttribute('data-os',os.toLowerCase());r.setAttribute('data-controls',D.controls);
  r.setAttribute('data-orient',D.landscape?'landscape':'portrait');
  try{w.dispatchEvent(new CustomEvent('devicechange',{detail:D}))}catch(e){}}
 w.DEVICE=D;apply();
 w.addEventListener('resize',function(){document.documentElement.setAttribute('data-orient',D.landscape?'landscape':'portrait')});
 w.addEventListener('orientationchange',function(){setTimeout(function(){document.documentElement.setAttribute('data-orient',D.landscape?'landscape':'portrait')},200)});
})();
/* remember the game's WebGL context so the performance overlay can count draw calls (no per-call cost unless the overlay is on) */
(function(){try{var P=HTMLCanvasElement.prototype,g=P.getContext;P.getContext=function(t){var c=g.apply(this,arguments);try{if(c&&/webgl/.test(t)){var L=window.__mtaGLs||(window.__mtaGLs=[]);if(L.indexOf(c)<0)L.push(c)}}catch(e){}return c}}catch(e){}})();
