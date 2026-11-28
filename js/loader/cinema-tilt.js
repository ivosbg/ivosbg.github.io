(function(){var root=document.getElementById('cinemaLoader');if(!root)return;
 var tilts=[];root.querySelectorAll('.cinema-scene').forEach(function(sc){var w=document.createElement('div');w.className='cinema-tilt';while(sc.firstChild)w.appendChild(sc.firstChild);var s=document.createElement('div');s.className='cinema-sway';s.appendChild(w);sc.appendChild(s);tilts.push(w)});
 var bgs=root.querySelectorAll('.cinema-bg'),subs=root.querySelectorAll('.cinema-subject'),main=root.querySelector('.cinema-main');
 var tx=0,ty=0,cx=0,cy=0,seen=-1e9,gyro=-1e9,last=0,still=false;try{still=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
 function clamp(v){return v<-1?-1:v>1?1:v}
 addEventListener('pointermove',function(e){tx=clamp((e.clientX/innerWidth-.5)*2);ty=clamp((e.clientY/innerHeight-.5)*2);seen=performance.now()},{passive:true});
 addEventListener('deviceorientation',function(e){if(e.gamma==null)return;gyro=performance.now();tx=clamp(e.gamma/22);ty=clamp(((e.beta||0)-50)/22)},{passive:true});
 function reset(){tilts.forEach(function(w){w.style.transform=''});bgs.forEach(function(b){b.style.translate=''});subs.forEach(function(s){s.style.translate=''});if(main)main.style.translate=''}
 function frame(now){
  if(!root.isConnected||root.classList.contains('is-done'))return;
  if(still){reset();return}
  var dt=last?Math.min(.05,(now-last)/1000):.016;last=now;
  var k=1-Math.exp(-dt/.14),px=cx,py=cy;cx+=(tx-cx)*k;cy+=(ty-cy)*k;
  if(Math.abs(cx-px)+Math.abs(cy-py)>.00008){
   var t='rotateX('+(-cy*3).toFixed(3)+'deg) rotateY('+(cx*4.6).toFixed(3)+'deg)',i;
   for(i=0;i<tilts.length;i++)tilts[i].style.transform=t;
   var bt=(-cx*22).toFixed(2)+'px '+(-cy*12).toFixed(2)+'px -180px',st=(-cx*44).toFixed(2)+'px '+(-cy*16).toFixed(2)+'px 140px';
   for(i=0;i<bgs.length;i++)bgs[i].style.translate=bt;
   for(i=0;i<subs.length;i++)subs[i].style.translate=st;
   if(main)main.style.translate=(-cx*12).toFixed(2)+'px '+(-cy*7).toFixed(2)+'px'}
  requestAnimationFrame(frame)}
 requestAnimationFrame(frame)})();
