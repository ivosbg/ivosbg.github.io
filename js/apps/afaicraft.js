'use strict';

APPS.afaicraft={t:'AfaiCraft',i:ico('#8be04a','#2f7d2a','<path d="M10 20l14-7 14 7v14l-14 7-14-7z" fill="#8b5a2b" stroke="#fff" stroke-width="1.5"/><path d="M10 20l14-7 14 7-14 7z" fill="#5fc13a"/>'),w:880,h:580,close(b){b.dead=1},open(b){
 b.style.cssText+=';background:#8fd0ff;overflow:hidden;outline:0;position:relative';
 const cv=h('canvas',{style:'width:100%;height:100%;display:block'}),hud=h('div',{style:'position:absolute;left:8px;top:6px;color:#fff;font:bold 15px Segoe UI;text-shadow:0 1px 3px #000;pointer-events:none'}),
 cross=h('div',{class:'mtaCross',style:'position:absolute;left:50%;top:50%;color:#fff;font:bold 22px sans-serif;transform:translate(-50%,-50%);pointer-events:none;mix-blend-mode:difference'},'+'),
 ov=h('div',{class:'ov'}),fl=h('div',{style:'position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none'}),
 vid=h('video',{style:'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;display:none;z-index:5',playsinline:''});
 b.append(cv,hud,cross,fl,ov,vid);let rdy=0;
 const spl=h('div',{style:'position:absolute;inset:0;z-index:20;background:#EF323D;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .6s'}),lg=h('canvas',{width:128,height:128,style:'width:96px;height:96px;flex:none'}),bar=h('div',{style:'height:100%;background:#fff;transform-origin:left;transform:scaleX(0);animation:afb 2.6s cubic-bezier(.2,.7,.3,1) forwards'});
 const lim=new Image();lim.onload=()=>lg.getContext('2d').drawImage(lim,73,105,190,190,0,0,128,128);lim.src=IMG;
 spl.append(h('div',{style:'display:flex;align-items:center;gap:18px;margin-bottom:12%'},lg,h('div',{style:'color:#fff;font:900 clamp(26px,7vw,60px) "Segoe UI Black","Arial Black",Arial,sans-serif;letter-spacing:.06em'},'AFAICRAFT')),h('div',{style:'position:absolute;bottom:14%;width:min(60%,420px);height:20px;border:3px solid #fff;padding:3px;background:#EF323D'},bar));
 b.append(spl);const t0=performance.now(),iv=setInterval(()=>{if(b.dead||!spl.isConnected)return clearInterval(iv);if(rdy&&performance.now()-t0>2300){clearInterval(iv);bar.style.transform='scaleX(.88)';bar.style.animation='none';void bar.offsetWidth;bar.style.transition='transform .25s';bar.style.transform='scaleX(1)';setTimeout(()=>{spl.style.opacity=0;setTimeout(()=>spl.remove(),650)},350)}},100);
 const msg=(t,p,bt,f)=>{ov.style.display='flex';ov.innerHTML=`<h2>${t}</h2><p>${p}</p>`;bt&&ov.append(h('button',{class:'b big',onclick:f},bt))};
 msg('AfaiCraft','Зареждане на 3D света…');
 const go=()=>{
 const T=THREE,R=new T.WebGLRenderer({canvas:cv}),sc=new T.Scene(),cam=new T.PerspectiveCamera(70,1,.1,160);
 sc.background=new T.Color(0x8fd0ff);sc.fog=new T.Fog(0x8fd0ff,35,100);sc.add(cam);sc.add(new T.AmbientLight(0xffffff,.7));const dl=new T.DirectionalLight(0xffffff,.55);dl.position.set(.5,1,.3);sc.add(dl);
 const nz=(c,v,fn)=>{const k=document.createElement('canvas');k.width=k.height=16;const g=k.getContext('2d');for(let x=0;x<16;x++)for(let y=0;y<16;y++){const d=(Math.random()-.5)*v,q=fn&&fn(y)||c;g.fillStyle=`rgb(${q[0]+d|0},${q[1]+d|0},${q[2]+d|0})`;g.fillRect(x,y,1,1)}const t=new T.CanvasTexture(k);t.magFilter=T.NearestFilter;return new T.MeshLambertMaterial({map:t})};
 const mT=nz([95,170,60],40),mD=nz([130,90,55],40),mS=nz([125,125,125],35),mSi=nz([130,90,55],40,y=>y<4?[95,170,60]:0);
 const geo=new T.BoxGeometry(1,1,1),mats=[[mSi,mSi,mT,mD,mSi,mSi],mD,mS,nz([222,204,140],26),nz([238,236,226],10),nz([172,62,46],30),nz([112,76,42],30),nz([46,120,52],40)],CAP=20000,ms=mats.map(m=>{const x=new T.InstancedMesh(geo,m,CAP);x.count=0;x.frustumCulled=false;sc.add(x);return x});
 const gone=new Set(),blocks=new Map(),keys=[[],[],[],[],[],[],[],[]],tm=new T.Matrix4(),NX=160,NZ=64,SX=40.5,SZ=45.5;
 const add=(x,y,z,t)=>{const k=x+','+y+','+z;if(blocks.has(k))return;const m=ms[t],n=m.count;tm.makeTranslation(x+.5,y+.5,z+.5);m.setMatrixAt(n,tm);keys[t][n]=k;m.count++;m.instanceMatrix.needsUpdate=true;blocks.set(k,{t,i:n})};
 const del=(x,y,z)=>{const k=x+','+y+','+z,o=blocks.get(k);if(!o||y<=0)return;const m=ms[o.t],l=m.count-1;if(o.i!==l){m.getMatrixAt(l,tm);m.setMatrixAt(o.i,tm);const lk=keys[o.t][l];keys[o.t][o.i]=lk;blocks.get(lk).i=o.i}m.count--;keys[o.t].pop();blocks.delete(k);m.instanceMatrix.needsUpdate=true;gone.add(k);for(const q of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])rev(x+q[0],y+q[1],z+q[2])};
 /* Долни Цибър + р. Дунав */
 const zc=x=>22+3.5*Math.sin(x*.07),HM=new Int8Array(NX*NZ),bt=(y,H)=>H<=4?(y>H-3?3:2):(y===H?0:y>H-3?1:2),hm=(x,z)=>x<0||z<0||x>=NX||z>=NZ?99:HM[x*NZ+z];
 const rev=(x,y,z)=>{if(x<0||z<0||x>=NX||z>=NZ||y<0)return;const k=x+','+y+','+z;if(y<=HM[x*NZ+z]&&!blocks.has(k)&&!gone.has(k))add(x,y,z,bt(y,HM[x*NZ+z]))};
 for(let x=0;x<NX;x++)for(let z=0;z<NZ;z++){const c=zc(x),d=Math.abs(z-c),hw=11;let h=d<hw-3?1:d<hw-1?2:d<hw?3:d<hw+1?4:d<hw+2?5:z<c?5+(Math.sin(x*.31+z)>.8?1:0):z<54?6:6+Math.round((z-54)*.5+1.3*Math.sin(x*.2));const di=Math.hypot(x-100,z-c);if(di<5)h=Math.max(h,di<3?4:3);HM[x*NZ+z]=h}
 for(let x=0;x<NX;x++)for(let z=0;z<NZ;z++){const H=HM[x*NZ+z],mn=Math.min(H,hm(x+1,z),hm(x-1,z),hm(x,z+1),hm(x,z-1));for(let y=Math.min(H,mn+1);y<=H;y++)add(x,y,z,bt(y,H))}
 const wp=new T.Mesh(new T.PlaneGeometry(NX,NZ),new T.MeshLambertMaterial({color:0x2b86c9,transparent:true,opacity:.8}));wp.rotation.x=-Math.PI/2;wp.position.set(NX/2,3.85,NZ/2);sc.add(wp);
 const house=(x0,z0,w,d)=>{for(let y=0;y<3;y++)for(let x=0;x<w;x++)for(let z=0;z<d;z++)if((x==0||z==0||x==w-1||z==d-1)&&!(y<2&&z==0&&x==w>>1)&&!(y==1&&(x==2||x==w-3)&&(z==0||z==d-1)))add(x0+x,7+y,z0+z,4);for(let k=0;k<3;k++)for(let x=k;x<w-k;x++)for(let z=0;z<d;z++)add(x0+x,10+k,z0+z,5)};
 [26,34,42,58,66,74,84].forEach(x=>house(x,38,5,6));[28,38,62,70,80].forEach(x=>house(x,48,5,6));
 house(50,48,5,7);for(let y=0;y<9;y++)for(let x=0;x<3;x++)for(let z=0;z<3;z++)if(x!=1||z!=1)add(51+x,7+y,55+z,4);add(52,16,56,5);add(52,17,56,5);
 for(let a=0;a<6.28;a+=.12){const x=118+Math.round(Math.cos(a)*8),z=46+Math.round(Math.sin(a)*8);if(Math.random()>.3)for(let y=0,n=2+(Math.random()*2|0);y<n;y++)add(x,7+y,z,2)}
 const tree=(x,z)=>{const y=HM[x*NZ+z]+1;for(let i=0;i<4;i++)add(x,y+i,z,6);for(let a=-1;a<=1;a++)for(let b2=-1;b2<=1;b2++)for(let k=0;k<2;k++)add(x+a,y+4+k,z+b2,7)};
 for(let x=6;x<NX-4;x+=7){tree(x,Math.round(zc(x)+13));tree(x+3,Math.round(zc(x)-13))}
 for(let z=29;z<=36;z++)for(let x=36;x<=37;x++){add(x,4,z,6);if(z%3==0)for(let y=2;y<4;y++)add(x,y,z,6)}
 const lab=(s,x,y,z,w2)=>{const k=document.createElement('canvas');k.width=512;k.height=64;const g=k.getContext('2d');g.font='bold 40px Segoe UI,Arial';g.textAlign='center';g.textBaseline='middle';g.lineWidth=7;g.strokeStyle='#000';g.fillStyle='#fff';g.strokeText(s,256,34);g.fillText(s,256,34);const p=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(k),transparent:true,depthWrite:false}));p.scale.set(w2,w2/8,1);p.position.set(x,y,z);sc.add(p)};
 lab('ДОЛНИ ЦИБЪР',48,19,44,12);lab('р. ДУНАВ',60,9,22,10);lab('РУМЪНИЯ →',60,10,6,10);lab('Римска крепост Ciabrus',118,13,46,12);
 const solid=(x,y,z)=>blocks.has(Math.floor(x)+','+Math.floor(y)+','+Math.floor(z)),gy=(x,z)=>{for(let y=40;y>=0;y--)if(solid(x,y,z))return y+1;return 0};
 const hit=(x,y,z)=>{for(const a of[-.3,.3])for(const c of[-.3,.3])for(const d of[.05,.9,1.7])if(solid(x+a,y+d,z+c))return 1;return 0};
 const P={x:SX,y:0,z:SZ,vy:0,yaw:0,pit:0,hp:20,g:0,sw:0};P.y=gy(SX,SZ)+.1;
 /* his skin on the arm */
 const skin=new T.MeshLambertMaterial({color:0xb87d58}),bx=(w,hh,d,m,x,y,z)=>{const o=new T.Mesh(new T.BoxGeometry(w,hh,d),m);o.position.set(x,y,z);return o};
 const arm=new T.Group();arm.add(bx(.17,.17,.6,skin,0,0,0),bx(.19,.19,.22,new T.MeshLambertMaterial({color:0x1fa7b8}),0,0,.2));arm.position.set(.42,-.36,-.6);cam.add(arm);
 /* параходът „Радецки“ */
 const L2=q=>new T.MeshLambertMaterial({color:q}),boat=new T.Group(),B={x:40,z:27,a:-Math.PI/2,v:0,on:0},wet=(x,z)=>x>=0&&z>=0&&x<NX&&z<NZ&&HM[(x|0)*NZ+(z|0)]<=2;
 const rk=document.createElement('canvas');rk.width=256;rk.height=40;const rg=rk.getContext('2d');rg.fillStyle='#202428';rg.fillRect(0,0,256,40);rg.fillStyle='#f2c94c';rg.font='bold 30px Arial';rg.textAlign='center';rg.textBaseline='middle';rg.fillText('РАДЕЦКИ',128,22);
 const rf=document.createElement('canvas');rf.width=3;rf.height=3;const rq=rf.getContext('2d');['#fff','#00966e','#d62612'].forEach((q,i)=>{rq.fillStyle=q;rq.fillRect(0,i,3,1)});const rft=new T.CanvasTexture(rf);rft.magFilter=T.NearestFilter;
 boat.add(bx(2.4,.9,7,L2(0x202428),0,.2,0),bx(2.5,.12,7.1,L2(0xf2f2f2),0,.55,0),bx(1.8,1.2,2.6,L2(0xf4f1e8),0,1.25,.6),bx(1.9,.12,2.8,L2(0x7a2a1a),0,1.9,.6),bx(.12,3.4,.12,L2(0x4a2e18),0,2.6,-2.6),bx(.12,3,.12,L2(0x4a2e18),0,2.4,3),bx(.06,2,.06,L2(0x4a2e18),0,1.8,3.5),bx(.2,1.7,1.7,L2(0x6b4a2a),-1.45,.5,.3),bx(.2,1.7,1.7,L2(0x6b4a2a),1.45,.5,.3));
 const rfn=new T.Mesh(new T.CylinderGeometry(.35,.42,2.6,10),L2(0x181818));rfn.position.set(0,3.1,1.5);const rbd=new T.Mesh(new T.CylinderGeometry(.43,.43,.35,10),L2(0xc4161c));rbd.position.set(0,3.5,1.5);
 const rfl=new T.Mesh(new T.PlaneGeometry(1.3,.8),new T.MeshBasicMaterial({map:rft,side:T.DoubleSide}));rfl.rotation.y=Math.PI/2;rfl.position.set(0,2.6,4.2);boat.add(rfn,rbd,rfl);
 for(const sd of[1,-1]){const q=new T.Mesh(new T.PlaneGeometry(3,.48),new T.MeshBasicMaterial({map:new T.CanvasTexture(rk),side:T.DoubleSide}));q.rotation.y=sd*Math.PI/2;q.position.set(sd*1.21,.25,-.4);boat.add(q)}
 sc.add(boat);boat.position.set(B.x,3.9,B.z);boat.rotation.y=B.a;
 const board=()=>{if(S!=='play')return;if(B.on){B.on=0;B.v=0;let ok=0;for(let r=3;r<9&&!ok;r++)for(let i=0;i<16;i++){const x=B.x+Math.cos(i*.4)*r,z=B.z+Math.sin(i*.4)*r;if(x>1&&z>1&&x<NX-1&&z<NZ-1&&HM[(x|0)*NZ+(z|0)]>=5){P.x=x;P.z=z;P.y=gy(x,z)+.1;P.vy=0;ok=1;break}}if(!ok)B.on=1}else if(Math.hypot(P.x-B.x,P.z-B.z)<8){B.on=1;sfx('board')}};
 let stp=0,wI=false,sw2=0,eng=0;const bh2=()=>B.on?'   ⛵ Радецки · W/S ход, A/D кормило, [E] слизане, [H] свирка':Math.hypot(P.x-B.x,P.z-B.z)<8?'   [E] качи се на „Радецки“':'';
 /* паметник на Иво в центъра на Долни Цибър, с български и румънски флаг */
 {const cx=46,cz=45,mk2=q=>new T.MeshLambertMaterial({color:q});
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){add(cx+x,7,cz+z,2);add(cx+x,8,cz+z,2)}add(cx,9,cz,2);
  const pk=document.createElement('canvas');pk.width=pk.height=64;const pg=pk.getContext('2d');pg.fillStyle='#b08d57';pg.fillRect(0,0,64,64);const pt=new T.CanvasTexture(pk),pi=new Image();pi.onload=()=>{pg.drawImage(pi,73,105,190,190,0,0,64,64);pt.needsUpdate=true};pi.src=IMG;
  const br=mk2(0xb08d57),st2=new T.Group();
  st2.add(bx(.5,.9,.34,br,0,.45,0),bx(.74,1,.42,br,0,1.4,0),bx(.2,.95,.26,br,-.5,1.4,0),bx(.2,.95,.26,br,.5,1.4,0),bx(.62,.62,.62,[br,br,br,br,new T.MeshLambertMaterial({map:pt}),br],0,2.21,0));
  st2.position.set(cx+.5,10,cz+.5);sc.add(st2);
  const fc=(cols,vert)=>{const k=document.createElement('canvas');k.width=k.height=3;const g=k.getContext('2d');cols.forEach((q,i)=>{g.fillStyle=q;vert?g.fillRect(i,0,1,3):g.fillRect(0,i,3,1)});const t=new T.CanvasTexture(k);t.magFilter=T.NearestFilter;return new T.MeshBasicMaterial({map:t,side:T.DoubleSide})};
  [[cx-3,['#fff','#00966e','#d62612'],0],[cx+4,['#002b7f','#fcd116','#ce1126'],1]].forEach(([x,cols,v])=>{const pl2=bx(.14,8,.14,mk2(0xcccccc),x+.5,11,cz+.5);const fl3=new T.Mesh(new T.PlaneGeometry(2.4,1.5),fc(cols,v));fl3.position.set(x+1.7,14.2,cz+.5);sc.add(pl2,fl3);for(let y=7;y<9;y++)add(x,y,cz,2)});
  lab('ПАМЕТНИК НА ИВО',cx+.5,17,cz+.5,10)}
 /* his face on the zombies */
 const fk=document.createElement('canvas');fk.width=fk.height=64;const fg=fk.getContext('2d');fg.fillStyle='#6a9a56';fg.fillRect(0,0,64,64);const ft=new T.CanvasTexture(fk),im=new Image();im.onload=()=>{fg.drawImage(im,73,105,190,190,0,0,64,64);fg.fillStyle='rgba(60,150,50,.28)';fg.fillRect(0,0,64,64);ft.needsUpdate=true};im.src=IMG;
 /* inventory: hotbar + sword with his photo */
 let sel=0;const hot=[],hb=h('div',{style:'position:absolute;left:50%;bottom:8px;transform:translateX(-50%);display:flex;gap:4px;pointer-events:none'});
 ['✋','','','🔫'].forEach((t,i)=>{const d=h('div',{style:'width:54px;height:54px;border:3px solid #444;background:#2229;background-size:contain;background-repeat:no-repeat;background-position:center;display:flex;align-items:center;justify-content:center;font-size:28px;color:#fff;box-sizing:border-box'},t);if(i===2)d.style.background='linear-gradient(#5fc13a 28%,#8b5a2b 29%) center/32px 32px no-repeat,#2229';hot.push(d);hb.append(d)});b.append(hb);
 const sk=document.createElement('canvas');sk.width=128;sk.height=144;const sg=sk.getContext('2d'),st=new T.CanvasTexture(sk),sI=new Image(),bl=()=>{sg.beginPath();sg.moveTo(64,2);sg.lineTo(86,22);sg.lineTo(86,88);sg.lineTo(42,88);sg.lineTo(42,22);sg.closePath()};
 const dS=()=>{sg.clearRect(0,0,128,144);sg.save();bl();sg.clip();if(sI.complete&&sI.naturalWidth)sg.drawImage(sI,123,105,90,190,42,2,44,86);else{sg.fillStyle='#cfd8e0';sg.fillRect(42,2,44,86)}sg.restore();sg.lineWidth=3;sg.strokeStyle='#e8eef5';bl();sg.stroke();sg.fillStyle='#8a5a2b';sg.strokeStyle='#3a2410';sg.lineWidth=2;sg.fillRect(32,88,64,10);sg.strokeRect(32,88,64,10);sg.fillStyle='#5b3a1e';sg.fillRect(58,98,12,30);sg.fillStyle='#e6b92e';sg.beginPath();sg.arc(64,134,7,0,7);sg.fill();st.needsUpdate=true;hot[1].style.backgroundImage=`url(${sk.toDataURL()})`};
 sI.onload=dS;sI.src=IMG;dS();
 const sw=new T.Mesh(new T.PlaneGeometry(.6,.675),new T.MeshBasicMaterial({map:st,transparent:true,side:T.DoubleSide,alphaTest:.1}));cam.add(sw);
 const gun=new T.Group(),gm2=c=>new T.MeshLambertMaterial({color:c});gun.add(bx(.1,.16,.5,gm2(0x2a6fd0),0,0,0),bx(.05,.05,.45,gm2(0x9bd3ff),0,.03,-.45),bx(.13,.13,.24,new T.MeshLambertMaterial({color:0x4fc3ff,transparent:true,opacity:.75}),0,.14,.05),bx(.08,.2,.1,gm2(0x1c4f96),0,-.15,.18));cam.add(gun);
 const txs=[],tk=document.createElement('canvas');tk.width=640;tk.height=96;const tg=tk.getContext('2d');tg.font='bold 56px Segoe UI,Arial';tg.textAlign='center';tg.textBaseline='middle';tg.lineWidth=8;tg.lineJoin='round';tg.strokeStyle='#000';tg.fillStyle='#ffe23a';tg.strokeText('ПААА ПРЕДАЙ СЕ БЕ',320,50);tg.fillText('ПААА ПРЕДАЙ СЕ БЕ',320,50);
 const tt2=new T.CanvasTexture(tk),say=p=>{const sp=new T.Sprite(new T.SpriteMaterial({map:tt2,transparent:true,depthTest:false}));sp.scale.set(3.2,.48,1);sp.position.copy(p);sp.position.y+=2.2;sp.renderOrder=20;sp.userData={t:0,y0:sp.position.y};sc.add(sp);txs.push(sp)};
 let gcd=0,zoom=false;const rc2=new T.Raycaster(),wfx=[],wm=new T.MeshBasicMaterial({color:0x4fc3ff,transparent:true,opacity:.85}),sg2=new T.SphereGeometry(.06,6,6),UP=new T.Vector3(0,1,0);rc2.far=60;
 const shoot=()=>{const n=performance.now();if(n<gcd)return;gcd=n+450;P.sw=1;sfx('shot');rc2.setFromCamera({x:0,y:0},cam);const mh=rc2.intersectObjects(mobs.map(m=>m.g),true)[0],bh=rc2.intersectObjects(ms)[0];let pt;
  if(mh&&(!bh||mh.distance<=bh.distance)){pt=mh.point;const m=mobs.find(q=>{let o=mh.object;while(o){if(o===q.g)return 1;o=o.parent}});if(m)say(m.g.position);if(m&&(m.hp-=3)<=0){sc.remove(m.g);mobs.splice(mobs.indexOf(m),1);sfx('mobdie')}}
  else pt=bh?bh.point:rc2.ray.at(60,new T.Vector3());
  const o=new T.Vector3(.3,-.2,-.9).applyMatrix4(cam.matrixWorld),d=pt.clone().sub(o),cy=new T.Mesh(new T.CylinderGeometry(.03,.03,d.length(),6),wm.clone());cy.position.copy(o).addScaledVector(d,.5);cy.quaternion.setFromUnitVectors(UP,d.clone().normalize());cy.userData={t:0,k:'s'};sc.add(cy);wfx.push(cy);
  for(let i=0;i<10;i++){const q=new T.Mesh(sg2,wm.clone());q.position.copy(pt);q.userData={t:0,k:'p',v:new T.Vector3((Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3)};sc.add(q);wfx.push(q)}sfx('wsplash')};
 const setSel=i=>{sel=i;sfx('tick');zoom=false;hot.forEach((d,k)=>d.style.borderColor=k===i?'#fff':'#444');sw.visible=i===1;gun.visible=i===3;arm.visible=i!==1&&i!==3};setSel(0);
 const ck=document.createElement('canvas');ck.width=ck.height=16;const cg=ck.getContext('2d');cg.fillStyle='#4cae3a';cg.fillRect(0,0,16,16);cg.fillStyle='#111';cg.fillRect(3,4,3,3);cg.fillRect(10,4,3,3);cg.fillRect(6,8,4,3);cg.fillRect(5,10,2,4);cg.fillRect(9,10,2,4);const ct=new T.CanvasTexture(ck);ct.magFilter=T.NearestFilter;const cim=new Image();cim.onload=()=>{ck.width=ck.height=64;cg.drawImage(cim,73,105,190,190,0,0,64,64);cg.fillStyle='rgba(40,170,40,.35)';cg.fillRect(0,0,64,64);ct.needsUpdate=true};cim.src=IMG;
 const mobs=[],fx=[];let ivu=null;
 const mk=k=>{const g=new T.Group(),z=k==='z',L=m=>new T.MeshLambertMaterial(m),gm=L({color:z?0x5a8f4a:0x4cae3a});let hm=gm,hd;
  if(z){hd=bx(.55,.55,.55,[gm,gm,gm,gm,L({map:ft}),gm],0,1.62,0);g.add(bx(.5,.7,.26,L({color:0x1fa7b8}),0,1.02,0),bx(.2,.2,.7,gm,-.35,1.3,.35),bx(.2,.2,.7,gm,.35,1.3,.35),hd);g.l1=bx(.24,.7,.24,L({color:0x3a3a8a}),-.13,.35,0);g.l2=bx(.24,.7,.24,L({color:0x3a3a8a}),.13,.35,0);g.add(g.l1,g.l2)}
  else{hm=L({map:ct});hd=bx(.5,.5,.5,[gm,gm,gm,gm,hm,gm],0,1.35,0);g.add(bx(.5,.8,.3,gm,0,.8,0),hd);g.l1=bx(.2,.4,.2,gm,-.13,.2,.2);g.l2=bx(.2,.4,.2,gm,.13,.2,-.2);g.add(g.l1,g.l2,bx(.2,.4,.2,gm,-.13,.2,-.2),bx(.2,.4,.2,gm,.13,.2,.2));g.mats=[gm,hm]}
  const a=Math.random()*6.28,d=11+Math.random()*6;let x=Math.min(NX-3,Math.max(2,P.x+Math.cos(a)*d)),zz=Math.min(NZ-3,Math.max(2,P.z+Math.sin(a)*d));if(HM[(x|0)*NZ+(zz|0)]<=4){x=30+Math.random()*40;zz=39+Math.random()*10}g.position.set(x,gy(x,zz),zz);sc.add(g);mobs.push({g,z,hp:3,cd:0,f:0,t:Math.random()*9})};
 const fresh=()=>{mobs.splice(0).forEach(m=>sc.remove(m.g));for(let i=0;i<3;i++)mk('z');for(let i=0;i<2;i++)mk('c')};fresh();
 const showVid=pp=>{if(!ivu){const q=atob($('#ivd').textContent.trim()),a=new Uint8Array(q.length);for(let i=0;i<q.length;i++)a[i]=q.charCodeAt(i);ivu=URL.createObjectURL(new Blob([a],{type:'video/mp4'}))}
  const c=pp.clone();c.y+=1;for(let i=0;i<10;i++){const q=document.createElement('video');q.muted=true;q.playsInline=true;q.src=ivu;const m=new T.Mesh(new T.PlaneGeometry(1.3,1.3),new T.MeshBasicMaterial({map:new T.VideoTexture(q),transparent:true,opacity:0,side:T.DoubleSide,fog:false,depthWrite:false})),a=Math.random()*6.28,r=1.2+Math.random()*1.8;m.position.set(c.x+Math.cos(a)*r,c.y+(Math.random()-.5)*2.4,c.z+Math.sin(a)*r);m.userData={q,t0:performance.now()+i*120,roll:(Math.random()-.5)*.6};m.renderOrder=10;sc.add(m);fx.push(m)}};
 const boom=m=>{const p=m.g.position,cx=Math.floor(p.x),cy=Math.floor(p.y),cz=Math.floor(p.z);for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++)for(let z=-3;z<=3;z++)if(x*x+y*y+z*z<=11)del(cx+x,cy+y,cz+z);
  const d=Math.hypot(P.x-p.x,P.y-p.y,P.z-p.z);if(d<6)P.hp-=Math.round(14*(1-d/6));sc.remove(m.g);mobs.splice(mobs.indexOf(m),1);sfx('boom');fl.style.transition='none';fl.style.opacity=1;setTimeout(()=>{fl.style.transition='opacity .9s';fl.style.opacity=0},60);showVid(p.clone())};
 let S='ready',last=performance.now(),tt=0,sp=0;const K={},rc=new T.Raycaster();rc.far=5.5;
 const act=btn=>{if(S!=='play')return;if(sel===3){if(btn===0)shoot();else zoom=!zoom;return}P.sw=1;rc.setFromCamera({x:0,y:0},cam);const mh=rc.intersectObjects(mobs.map(m=>m.g),true)[0],bh=rc.intersectObjects(ms)[0];
  if(mh&&(!bh||mh.distance<bh.distance)&&btn===0){const m=mobs.find(q=>{let o=mh.object;while(o){if(o===q.g)return 1;o=o.parent}});if(m)say(m.g.position);if(m)sfx(sel===1?'sword':'punch');if(m&&(m.hp-=sel===1?2:1)<=0){sc.remove(m.g);mobs.splice(mobs.indexOf(m),1);sfx('mobdie')}}
  else if(bh){const k=keys[ms.indexOf(bh.object)][bh.instanceId].split(',').map(Number);if(btn===0){del(...k);sfx('dig')}else if(sel===2){const n=bh.face.normal,x=k[0]+n.x,y=k[1]+n.y,z=k[2]+n.z;if(!(Math.abs(x+.5-P.x)<.8&&Math.abs(z+.5-P.z)<.8&&y>=P.y-1&&y<=P.y+1.8)&&y<60){add(x,y,z,1);sfx('place')}}}};
 const lock=()=>cv.requestPointerLock&&cv.requestPointerLock();
 const pl=()=>{const on=document.pointerLockElement===cv;if(on&&S==='ready')S='play';if(on)ov.style.display='none';else if(S==='play'||S==='ready'){S='ready';msg('AfaiCraft','Кликнете, за да играете. WASD – ходене, интервал – скок, мишка – оглед, ляв бутон – удар/копане, десен – поставяне на блок. 1–4 или колелце – инвентар (ръка, меч с лицето на Иво, блок, воден пистолет „Дунав Снайп“; при него десен бутон е мерник). E – качване/слизане от парахода „Радецки“ (плаване по Дунав). H – свирка на парахода. Esc – пауза.','▶ Играй',lock)}};
 const mm=e=>{if(document.pointerLockElement!==cv)return;P.yaw-=e.movementX*.0025;P.pit=Math.max(-1.5,Math.min(1.5,P.pit-e.movementY*.0025))},kd=e=>{const k=e.key.toLowerCase();K[k]=1;if(k>='1'&&k<='4')setSel(+k-1);if(k==='e')board();if(k==='h'&&B.on)sfx('horn');if(document.pointerLockElement===cv&&(k===' '||k.startsWith('arrow')))e.preventDefault()},ku=e=>K[e.key.toLowerCase()]=0;
 document.addEventListener('pointerlockchange',pl);document.addEventListener('mousemove',mm);document.addEventListener('keydown',kd);document.addEventListener('keyup',ku);
 cv.addEventListener('mousedown',e=>{if(document.pointerLockElement===cv)act(e.button);else lock()});cv.addEventListener('contextmenu',e=>e.preventDefault());cv.addEventListener('wheel',e=>{e.preventDefault();setSel((sel+(e.deltaY>0?1:3))%4)},{passive:false});
 const reset=()=>{P.hp=20;P.x=SX,P.z=SZ;P.y=gy(SX,SZ)+.1;P.vy=0;fresh();S='ready';pl();lock()};
 pl();
 const loop=ts=>{if(b.dead||!cv.isConnected){['pointerlockchange','mousemove','keydown','keyup'].forEach((n,i)=>document.removeEventListener(n,[pl,mm,kd,ku][i]));R.dispose();return}requestAnimationFrame(loop);
  const w=cv.clientWidth,hh=cv.clientHeight;if(w&&(cv.width!==w||cv.height!==hh)){R.setSize(w,hh,false);cam.aspect=w/hh;cam.updateProjectionMatrix()}
  const dt=Math.min(.05,(ts-last)/1000);last=ts;if(!cv.offsetParent){R.render(sc,cam);return}
  if(S==='play'){tt+=dt;const f=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0),r=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),l=Math.hypot(f,r)||1,v=B.on?0:4.5*dt,sy=Math.sin(P.yaw),cy=Math.cos(P.yaw),dx=(-sy*f+cy*r)/l*v,dz=(-cy*f-sy*r)/l*v;
   if(!hit(P.x+dx,P.y,P.z))P.x+=dx;if(!hit(P.x,P.y,P.z+dz))P.z+=dz;P.x=Math.min(NX-.5,Math.max(.5,P.x));P.z=Math.min(NZ-.5,Math.max(.5,P.z));
   const inW=P.y<3.7&&HM[(P.x|0)*NZ+(P.z|0)]<=3&&!B.on;P.vy-=(inW?5:22)*dt;if(inW){P.vy=Math.max(P.vy,-1.6);if(K[' '])P.vy=Math.max(P.vy,3)}const ny=P.y+P.vy*dt;if(hit(P.x,ny,P.z)){if(P.vy<0)P.g=1;P.vy=0}else{P.y=ny;P.g=0}if(K[' ']&&P.g){P.vy=7.5;P.g=0}if(P.y<-12){P.y=gy(SX,SZ)+1;P.x=SX,P.z=SZ}
   {const mv=K.w||K.a||K.s||K.d||K.arrowup||K.arrowdown||K.arrowleft||K.arrowright;
   if(!B.on&&mv&&P.g&&!inW){stp+=dt;if(stp>.4){stp=0;sfx(HM[(P.x|0)*NZ+(P.z|0)]<=4?'stepsand':'step')}}else if(!mv)stp=.3;
   if(inW&&!wI)sfx('splash');wI=inW;if(inW&&mv&&(sw2+=dt)>.55){sw2=0;sfx('swim')}
   if(B.on){eng+=dt;if(eng>.2){eng=0;sfx('engine',Math.abs(B.v))}}
   if(Math.random()<dt*.22){const m=mobs.find(q=>Math.hypot(q.g.position.x-P.x,q.g.position.z-P.z)<12);m&&sfx(m.z?'groan':'hissq')}}
   {const q=performance.now()/700;boat.position.set(B.x,3.9+Math.sin(q)*.05,B.z);boat.rotation.set(Math.sin(q*.9)*.012,B.a,Math.sin(q*1.3)*.02,'YXZ');
   if(B.on){const th=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?.5:0),tr=(K.a||K.arrowleft?1:0)-(K.d||K.arrowright?1:0),sn=Math.sin(B.a),cs=Math.cos(B.a);B.v+=(th*7-B.v)*Math.min(1,dt*.7);B.a+=tr*dt*.45*Math.min(1,.25+Math.abs(B.v)/3);const nx=B.x-sn*B.v*dt,nz=B.z-cs*B.v*dt;if(wet(nx,nz)&&wet(nx-sn*4,nz-cs*4)&&wet(nx+sn*4,nz+cs*4)){B.x=nx;B.z=nz}else B.v*=-.3;P.x=B.x-Math.sin(B.a)*2.2;P.z=B.z-Math.cos(B.a)*2.2;P.y=boat.position.y+.75;P.vy=0}}
   sp+=dt;if(sp>7&&mobs.length<8){sp=0;mk(Math.random()<.6?'z':'c')}
   for(const m of mobs.slice()){const p=m.g.position,dx2=P.x-p.x,dz2=P.z-p.z,d=Math.hypot(dx2,dz2);m.g.lookAt(P.x,p.y,P.z);m.cd-=dt;m.t+=dt;
    if(m.z){if(d>1.1){const nx=p.x+dx2/d*1.7*dt,nz=p.z+dz2/d*1.7*dt;if(gy(nx,nz)-p.y<=1.01&&HM[(nx|0)*NZ+(nz|0)]>3){p.x=nx;p.z=nz}}else if(m.cd<=0&&Math.abs(p.y-P.y)<1.6){P.hp-=2;m.cd=1;sfx('hurt')}}
    else{if(d<2.8){if(m.f===0)sfx('fuse');m.f+=dt}else m.f=Math.max(0,m.f-dt);if(m.f>0){const fl2=Math.floor(m.f*9)%2;m.g.mats.forEach(q=>q.emissive.setHex(fl2?0xffffff:0));m.g.scale.setScalar(1+m.f*.18);if(m.f>1.4){boom(m);continue}}else if(d>2.2){const nx=p.x+dx2/d*1.9*dt,nz=p.z+dz2/d*1.9*dt;if(gy(nx,nz)-p.y<=1.01&&HM[(nx|0)*NZ+(nz|0)]>3){p.x=nx;p.z=nz}}}
    p.y+=(gy(p.x,p.z)-p.y)*Math.min(1,dt*12);m.g.l1.rotation.x=Math.sin(m.t*8)*.6;m.g.l2.rotation.x=-Math.sin(m.t*8)*.6}
   if(P.hp<=0){S='over';document.exitPointerLock&&document.exitPointerLock();msg('ПО ДЯВОЛИТЕ','','Играй отново',reset)}}
  const now=performance.now();for(let i=fx.length-1;i>=0;i--){const m=fx[i],g=(now-m.userData.t0)/1000;if(g<0)continue;const q=m.userData.q;if(!m.userData.s){m.userData.s=1;q.play().catch(()=>{})}m.material.opacity=g<3.6?Math.min(1,g/.15):Math.max(0,1-(g-3.6)/2.2);m.quaternion.copy(cam.quaternion);m.rotateZ(m.userData.roll);if(g>5.9){q.pause();q.removeAttribute('src');sc.remove(m);m.material.map.dispose();m.material.dispose();m.geometry.dispose();fx.splice(i,1)}}
  for(let i=wfx.length-1;i>=0;i--){const o=wfx[i],u=o.userData;u.t+=dt;if(u.k==='s')o.material.opacity=.85*(1-u.t/.25);else{u.v.y-=9*dt;o.position.addScaledVector(u.v,dt);o.material.opacity=1-u.t/.6}if(u.t>(u.k==='s'?.25:.6)){sc.remove(o);o.material.dispose();if(u.k==='s')o.geometry.dispose();wfx.splice(i,1)}}
  for(let i=txs.length-1;i>=0;i--){const o=txs[i],u=o.userData;u.t+=dt;o.position.y=u.y0+u.t*.8;o.material.opacity=u.t<.7?1:1-(u.t-.7)/.5;if(u.t>1.2){sc.remove(o);o.material.dispose();txs.splice(i,1)}}
  const tf=sel===3&&zoom?22:70;if(Math.abs(cam.fov-tf)>.1){cam.fov+=(tf-cam.fov)*Math.min(1,dt*10);cam.updateProjectionMatrix()}gun.position.set(.35,-.3,-.6+P.sw*.12);gun.rotation.x=P.sw*.2;
  P.sw=Math.max(0,P.sw-dt*4);arm.rotation.set(-P.sw*1.1+Math.sin(tt*6)*.02,-.15,0);arm.position.set(.42,-.36-P.sw*.1,-.6-P.sw*.15);sw.position.set(.42,-.28-P.sw*.1,-.7);sw.rotation.set(-P.sw*.9,0,-.45-P.sw*.9);
  cam.position.set(P.x,P.y+1.6,P.z);cam.rotation.order='YXZ';cam.rotation.set(P.pit,P.yaw,0);hud.textContent='❤'.repeat(Math.max(0,Math.ceil(P.hp/2)))+'   Мобове: '+mobs.length+'   ['+['Ръка','Меч','Блок','Дунав Снайп'][sel]+']'+bh2();R.render(sc,cam)};
 requestAnimationFrame(loop);rdy=1};
 const ensureGLTF=()=>{if(window.THREE&&THREE.GLTFLoader){go();return}const ls=document.createElement('script');ls.src='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';ls.onload=go;ls.onerror=()=>msg('Model loader failed','Could not load the 3D character loader.');document.head.append(ls)};if(window.THREE)setTimeout(ensureGLTF,250);else{const sx=document.createElement('script');sx.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';sx.onload=ensureGLTF;sx.onerror=()=>msg('Няма връзка','AfaiCraft има нужда от интернет, за да зареди 3D библиотеката.');document.head.append(sx)}}};
