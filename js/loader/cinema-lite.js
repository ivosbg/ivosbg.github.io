(function(){var root=document.getElementById('cinemaLoader');if(!root)return;
 function mq(q){try{return matchMedia(q).matches}catch(e){return false}}
 var cn=navigator.connection||{},low=mq('(prefers-reduced-motion: reduce)')||cn.saveData===true;
 function lite(){root.classList.add('is-lite');var li=document.getElementById('launchIntro');if(li)li.classList.add('is-lite')}
 if(low){lite();return}
 var last=0,slow=0,n=0,t0=performance.now();
 function tick(now){if(root.classList.contains('is-done')||!root.isConnected)return;if(last){var dt=now-last;if(dt<250){n++;if(dt>34)slow++}}last=now;if(n>=30){if(slow/n>.45){lite();return}n=0;slow=0}if(now-t0<20000)requestAnimationFrame(tick)}
 requestAnimationFrame(tick)})();
