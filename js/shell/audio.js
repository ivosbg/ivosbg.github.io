'use strict';

/* sound */
const SND={v:store.get('vol',70),m:store.get('mute',false)};let AC,MG;
const au=()=>{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();if(!MG){MG=AC.createGain();const cp=AC.createDynamicsCompressor();MG.connect(cp);cp.connect(AC.destination)}MG.gain.value=SND.v/100;return AC};
const tone=(f,d,ty='sine',o={})=>{if(SND.m||!SND.v)return;try{const a=au(),n=a.currentTime+(o.t||0),os=a.createOscillator(),g=a.createGain();os.type=ty;os.frequency.setValueAtTime(f,n);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,n+d);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(o.v||.2,n+(o.a||.005));g.gain.exponentialRampToValueAtTime(.0001,n+d);let x=os;if(o.lp){const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;os.connect(fl);x=fl}x.connect(g);g.connect(MG);os.start(n);os.stop(n+d+.03)}catch(e){}};
const noise=(d,o={})=>{if(SND.m||!SND.v)return;try{const a=au(),n=a.currentTime+(o.t||0),len=Math.max(1,a.sampleRate*d|0),bf=a.createBuffer(1,len,a.sampleRate),ch=bf.getChannelData(0);for(let i=0;i<len;i++)ch[i]=Math.random()*2-1;const sr=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();sr.buffer=bf;fl.type=o.type||'lowpass';fl.frequency.setValueAtTime(o.f||1000,n);if(o.f2)fl.frequency.exponentialRampToValueAtTime(o.f2,n+d);fl.Q.value=o.q||1;g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(o.v||.2,n+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,n+d);sr.connect(fl);fl.connect(g);g.connect(MG);sr.start(n)}catch(e){}};
const beep=(f,d=.1,ty='sine',f2)=>tone(f,d,ty,{f2,lp:6000,v:.2});
const SFX={
 click:()=>{tone(1100,.045,'triangle',{f2:650,v:.1});noise(.02,{type:'highpass',f:3000,v:.05})},
 tick:()=>tone(1800,.025,'sine',{v:.04}),
 menu:()=>{tone(620,.07,'triangle',{v:.1});tone(930,.1,'triangle',{t:.05,v:.1})},
 open:()=>{noise(.18,{type:'bandpass',f:500,f2:2400,v:.07});tone(523,.14,'triangle',{v:.12});tone(784,.2,'triangle',{t:.07,v:.12})},
 restore:()=>noise(.15,{type:'bandpass',f:600,f2:2200,v:.08}),
 close:()=>{tone(660,.1,'triangle',{f2:330,v:.1});tone(440,.14,'triangle',{t:.06,f2:220,v:.1})},
 min:()=>noise(.16,{type:'bandpass',f:2400,f2:500,v:.09}),
 max:()=>{noise(.14,{type:'bandpass',f:500,f2:2200,v:.09});tone(700,.06,'sine',{t:.08,v:.06})},
 startup:()=>{[523,659,784,1047].forEach((f,i)=>{tone(f,1.1,'sine',{t:i*.13,v:.12,a:.02});tone(f*2,.8,'triangle',{t:i*.13,v:.04,a:.02})});tone(131,1.4,'sine',{v:.15,a:.03})},
 shutdown:()=>[784,659,523,392].forEach((f,i)=>tone(f,.7,'sine',{t:i*.14,v:.12,a:.02})),
 error:()=>{tone(200,.16,'sawtooth',{v:.1,lp:1200});tone(160,.22,'sawtooth',{t:.14,v:.1,lp:1000})},
 ding:()=>{tone(1320,.35,'sine',{v:.14});tone(1760,.5,'sine',{t:.08,v:.1})},
 pop:()=>tone(700,.08,'sine',{f2:1400,v:.15}),
 dig:()=>{noise(.1,{type:'bandpass',f:1100,f2:300,v:.3,q:2});tone(130,.09,'square',{f2:60,v:.1,lp:500})},
 place:()=>{noise(.05,{f:900,v:.2});tone(200,.07,'triangle',{f2:110,v:.18})},
 step:()=>noise(.07,{f:550+Math.random()*250,v:.14}),
 stepsand:()=>noise(.09,{type:'bandpass',f:1600+Math.random()*500,v:.1}),
 swim:()=>noise(.25,{type:'bandpass',f:900,f2:1800,v:.08,q:.8}),
 splash:()=>{noise(.4,{type:'bandpass',f:1500,f2:400,v:.3});tone(250,.15,'sine',{f2:90,v:.12})},
 wsplash:()=>noise(.12,{type:'bandpass',f:2200,f2:900,v:.12}),
 punch:()=>{noise(.07,{f:700,v:.25});tone(110,.08,'square',{f2:55,v:.15,lp:400})},
 sword:()=>{noise(.12,{type:'highpass',f:2000,f2:5000,v:.12});tone(900,.05,'square',{t:.03,f2:300,v:.07,lp:3000})},
 shot:()=>{noise(.12,{type:'bandpass',f:3000,f2:800,v:.2});tone(900,.14,'sine',{f2:200,v:.15})},
 mobdie:()=>{tone(300,.2,'square',{f2:80,v:.14,lp:1500});noise(.15,{f:800,v:.12})},
 hurt:()=>{tone(180,.15,'sawtooth',{f2:70,v:.2,lp:900});noise(.08,{f:600,v:.2})},
 fuse:()=>noise(.9,{type:'highpass',f:2500,f2:6000,v:.14,a:.1}),
 hissq:()=>noise(.35,{type:'highpass',f:3000,v:.04,a:.08}),
 groan:()=>{tone(120,.7,'sawtooth',{f2:75,v:.07,lp:450,a:.1});tone(90,.8,'triangle',{f2:60,v:.07,a:.1})},
 boom:()=>{noise(1,{f:2200,f2:60,v:.5,a:.008});tone(70,.8,'sine',{f2:28,v:.4});noise(.5,{type:'bandpass',f:300,v:.2,t:.1})},
 oink:()=>{tone(170,.14,'sawtooth',{f2:110,v:.09,lp:700});tone(150,.16,'sawtooth',{t:.18,f2:100,v:.08,lp:700})},baa:()=>tone(420,.5,'sawtooth',{f2:300,v:.06,lp:1000,a:.05}),neigh:()=>{tone(500,.7,'sawtooth',{f2:900,v:.07,lp:1500,a:.08});tone(900,.5,'sawtooth',{t:.5,f2:400,v:.06,lp:1400})},
 hoof:()=>{noise(.05,{type:'bandpass',f:1400,v:.2,q:3});tone(180,.05,'square',{f2:90,v:.06,lp:600})},
 board:()=>{tone(170,.12,'triangle',{f2:80,v:.2});noise(.06,{f:500,v:.12})},
 horn:()=>{tone(147,.9,'sawtooth',{v:.16,lp:800,a:.06});tone(185,.9,'sawtooth',{v:.12,lp:800,a:.06});tone(73,.9,'sine',{v:.12,a:.06})},
 engine:v=>{const k=Math.min(1,.25+(v||0)/7);tone(46+(v||0)*4,.2,'sawtooth',{v:.1*k,lp:260,a:.02});noise(.2,{f:500,v:.05*k})}};
const sfx=(n,a)=>{const f=SFX[n];f&&f(a)};
const syncSnd=()=>{$('#spk').textContent=SND.m||!SND.v?'🔇':'🔊';$('#vol').value=SND.v;store.set('vol',SND.v);store.set('mute',SND.m);const g=$('#gm');if(g)g.textContent=SND.m?'🔇 Без звук':'🔊 Звук'};
