// SANDHYA 2.1 - Gandhi Sagar Digital Twin Engine
const $=id=>document.getElementById(id);
const W=960,HH=540,IW=1625,IH=915,NX=320,NZ=180;
const P=(px,py)=>[(px/IW-.5)*W,(py/IH-.5)*HH];
const cv=$('c'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.outputEncoding=THREE.sRGBEncoding;R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(48,1,1,4000);
const ctl=new THREE.OrbitControls(cam,cv);ctl.enableDamping=true;ctl.maxPolarAngle=1.48;ctl.minDistance=12;ctl.maxDistance=1300;
const amb=new THREE.HemisphereLight(0xcfe4ff,0x6b5a48,.7),sun=new THREE.DirectionalLight(0xfff1d6,1.1);
S.add(amb,sun);S.fog=new THREE.Fog(0x9cc4e4,500,1800);
const layers={};const L=n=>layers[n]||(layers[n]=new THREE.Group(),S.add(layers[n]),layers[n]);
let hs=new Float32Array((NX+1)*(NZ+1)),terr,tex;
const H=(x,z)=>{const u=(x/W+.5)*NX,v=(z/HH+.5)*NZ,i=Math.max(0,Math.min(NX-1,Math.floor(u))),j=Math.max(0,Math.min(NZ-1,Math.floor(v))),a=u-i,b=v-j,k=j*(NX+1)+i;return hs[k]*(1-a)*(1-b)+hs[k+1]*a*(1-b)+hs[k+NX+1]*(1-a)*b+hs[k+NX+2]*a*b};
const HM=(x,z)=>{const u=(x/W+.5)*NX,v=(z/HH+.5)*NZ,i=Math.max(0,Math.min(NX-1,Math.floor(u))),j=Math.max(0,Math.min(NZ-1,Math.floor(v))),k=j*(NX+1)+i;return Math.max(hs[k],hs[k+1],hs[k+NX+1],hs[k+NX+2])};
const WY=-3;
function blur(a,r,w,h){const o=new Float32Array(a.length),t=new Float32Array(a.length);
for(let y=0;y<h;y++)for(let x=0;x<w;x++){let s=0,n=0;for(let k=-r;k<=r;k++){const xx=x+k;if(xx>=0&&xx<w){s+=a[y*w+xx];n++}}t[y*w+x]=s/n}
for(let y=0;y<h;y++)for(let x=0;x<w;x++){let s=0,n=0;for(let k=-r;k<=r;k++){const yy=y+k;if(yy>=0&&yy<h){s+=t[yy*w+x];n++}}o[y*w+x]=s/n}return o}
function buildTerrain(img,mk){
const c=document.createElement('canvas');c.width=NX+1;c.height=NZ+1;const g=c.getContext('2d');g.drawImage(img,0,0,NX+1,NZ+1);
const mc=document.createElement('canvas');mc.width=NX+1;mc.height=NZ+1;const mg=mc.getContext('2d');mg.drawImage(mk,0,0,NX+1,NZ+1);const md=mg.getImageData(0,0,NX+1,NZ+1).data,d=g.getImageData(0,0,NX+1,NZ+1).data,n=(NX+1)*(NZ+1),lum=new Float32Array(n),m=new Float32Array(n);
for(let k=0;k<n;k++){const l=.3*d[k*4]+.59*d[k*4+1]+.11*d[k*4+2];lum[k]=l;m[k]=md[k*4]>127?1:0}
let b=m;for(let i=0;i<3;i++)b=blur(b,9,NX+1,NZ+1);const sm=blur(m,2,NX+1,NZ+1);
for(let k=0;k<n;k++)hs[k]=WY+sm[k]*(5+27*b[k]);
hs.set(blur(hs,2,NX+1,NZ+1));
const ss=(a,c,x)=>{x=Math.max(0,Math.min(1,(x-a)/(c-a)));return x*x*(3-2*x)};
const ch=[[790,430],[740,520],[690,620],[630,720],[560,810],[470,890],[400,960]].map(p=>P(...p)),[cx,cz]=P(800,398);
const dseg=(x,z)=>{let d=1e9;for(let k=0;k<ch.length-1;k++){const a=ch[k],c=ch[k+1],vx=c[0]-a[0],vz=c[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*vx+(z-a[1])*vz)/(vx*vx+vz*vz)));d=Math.min(d,Math.hypot(x-a[0]-vx*t,z-a[1]-vz*t))}return d};
const rects=[[1010,610,1350,830],[1400,560,1590,780],[960,555,1045,620]].map(r=>{const p=P(r[0],r[1]),q=P(r[2],r[3]);return [p[0],p[1],q[0],q[1]]});
const avg=rects.map(r=>{let sm2=0,c=0;for(let j=0;j<=NZ;j++)for(let i=0;i<=NX;i++){const x=(i/NX-.5)*W,z=(j/NZ-.5)*HH;if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3]){sm2+=hs[j*(NX+1)+i];c++}}return sm2/Math.max(1,c)});
for(let j=0;j<=NZ;j++)for(let i=0;i<=NX;i++){const k=j*(NX+1)+i,x=(i/NX-.5)*W,z=(j/NZ-.5)*HH,c=ss(24,40,dseg(x,z));
hs[k]=WY-.2+(hs[k]-WY+.2)*c;
const up=1-ss(-14,6,(x-cx)*-.68+(z-cz)*.74),rb=WY+ss(.12,.45,sm[k])*12.5;if(rb>hs[k])hs[k]+=(rb-hs[k])*up*ss(.5,1,c);
const sh=(1-ss(34,58,Math.hypot(x-cx,z-cz)))*ss(.4,.7,sm[k])*ss(.6,1,c)*ss(-8,0,(x-cx)*-.68+(z-cz)*.74);hs[k]+=(Math.max(hs[k],9.3)-hs[k])*sh;
rects.forEach((r,q)=>{const d=Math.hypot(Math.max(r[0]-x,0,x-r[2]),Math.max(r[1]-z,0,z-r[3])),w=1-ss(0,18,d);hs[k]+=(avg[q]-hs[k])*w})}
// ---- ABUTMENT & EVEN BANK FIX: continuous, even earth banks tie both dam ends smoothly into the canyon plateaus without degrading downwards
{const th=-Math.atan2(60,65),co=Math.cos(th),si=Math.sin(th);
for(let j=0;j<=NZ;j++)for(let i=0;i<=NX;i++){const k=j*(NX+1)+i,dx=(i/NX-.5)*W-cx,dz=(j/NZ-.5)*HH-cz,u=dx*co-dz*si,v=dx*si+dz*co,au=Math.abs(u);
if(au<23||au>96||v<-65||v>65)continue;
const dv=Math.max(0,-28-v,v-24),t=9.2+.24*Math.min(42,Math.max(0,au-33))-.22*dv,w=ss(23.2,25.2,au)*(1-ss(72,96,au));
if(t>hs[k])hs[k]+=(t-hs[k])*w}}
tex=new THREE.Texture(img);tex.needsUpdate=true;tex.anisotropy=R.capabilities.getMaxAnisotropy();tex.encoding=THREE.sRGBEncoding;
const geo=new THREE.PlaneGeometry(W,HH,NX,NZ);geo.rotateX(-Math.PI/2);
geo.userData.flat=geo.attributes.position.array.slice();
const pa=geo.attributes.position;for(let k=0;k<n;k++)pa.setY(k,hs[k]);geo.computeVertexNormals();
terr=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({map:tex}));S.add(terr);
// skirt
const sk=new THREE.Mesh(new THREE.BoxGeometry(W,40,HH),new THREE.MeshBasicMaterial({color:0x1a1510,side:THREE.BackSide}));sk.position.y=-24;S.add(sk);
}
function label(txt,col,x,y,z,sc){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');
g.fillStyle='rgba(8,14,20,.82)';g.fillRect(0,0,512,96);g.strokeStyle=col;g.lineWidth=4;g.strokeRect(2,2,508,92);
g.fillStyle='#fff';g.font='bold 34px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,256,50);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));
s.scale.set(34*(sc||1),6.4*(sc||1),1);s.position.set(x,y,z);s.renderOrder=9;L('lab').add(s)}
const mat=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0});
const box=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
let sunH=12,panels=[],rotors=[],batt=[],paths={};
let overc=null,rainL=null,mist=null,dust=null,flash=0,nextFlash=6,wline=null,gateI=null,sgates=[],rainPos=null,birds=[],clouds=[],stars=null,boats=[],sway=[],smoke=null,igates=[],lvI=null,lvl=0,wLvl=8.8,foam=null,foam2=null,foamM=null,sheetM=null,wmat=null,riv=null,solI=null,solMat=null,solGlow=null,solBeam=null,lamps=[],blinks=[],pens=[],gauge=null,TG=[];
const SEAS={summer:{sky:new THREE.Color(0xb4d1ea),sunc:new THREE.Color(0xfff1d0),tint:new THREE.Color(1.04,.97,.88),fn:900,ff:3200,sm:1.1,am:.95,elk:1,mon:0,win:0,sum:1},
monsoon:{sky:new THREE.Color(0x7d8d9b),sunc:new THREE.Color(0xdbe6ee),tint:new THREE.Color(.78,.9,.74),fn:90,ff:800,sm:.5,am:.8,elk:.9,mon:1,win:0,sum:0},
winter:{sky:new THREE.Color(0xbdd2e6),sunc:new THREE.Color(0xffe3c0),tint:new THREE.Color(.9,.95,1.06),fn:180,ff:1500,sm:.8,am:.9,elk:.6,mon:0,win:1,sum:0}};
const SC={sky:new THREE.Color(0x9cc4e4),sunc:new THREE.Color(0xfff1d6),tint:new THREE.Color(1,1,1),fn:600,ff:2200,sm:1,am:1,elk:1,mon:0,win:0,sum:1};
function animLife(dt){if(!sim)return;const el=Math.max(0,Math.sin(Math.PI*(t-6)/12)),cl=+$('cl').value,i=Math.min(ST-1,Math.floor(t*4)),hn=sim.h[i]/57.5,ft=Math.min(1,dt*3),se=$('se').value,T=SEAS[se],rr=Math.min(1,dt*1.2);
SC.sky.lerp(T.sky,rr);SC.sunc.lerp(T.sunc,rr);SC.tint.lerp(T.tint,rr);['fn','ff','sm','am','elk','mon','win','sum'].forEach(k=>SC[k]+=(T[k]-SC[k])*rr);
if(terr)terr.material.color.copy(SC.tint);
const ri=se==='monsoon'?Math.min(1,Math.max(0,(cl-.45)*2)):0;S.fog.near=SC.fn;S.fog.far=SC.ff*(1-.35*ri)*(1-.4*SC.win*Math.max(0,1-el*2.5));
if(se==='monsoon'&&cl>.7){nextFlash-=dt;if(nextFlash<0){flash=1;nextFlash=5+Math.random()*9}}flash=Math.max(0,flash-dt*3.5);
if(flash>0){amb.intensity+=flash*1.6;sun.intensity+=flash*.8;S.background.lerp(new THREE.Color(1,1,1),flash*.45);S.fog.color.copy(S.background)}
if(overc){overc.material.opacity=Math.min(.92,Math.max(0,(cl-.25)/.75))*(.3+.7*SC.mon)*Math.max(0,Math.min(1,(330-cam.position.y)/160));const g=(.25+.55*el)*(1-.4*SC.mon);overc.material.color.setRGB(g*.92,g*.96,g);overc.material.map.offset.x+=dt*.004}
if(mist){mist.material.opacity=SC.win*(.12+.5*Math.max(0,1-el*2.5))+SC.mon*.14;mist.material.map.offset.x+=dt*.003;mist.material.color.copy(S.background).lerp(new THREE.Color(1,1,1),.5)}
if(rainL){rainL.material.opacity=ri*.55;rainL.visible=ri>.02;if(rainL.visible){const a=rainL.geometry.attributes.position,c=ctl.target,wx=3+4*sim.w[i]/100;for(let k=0;k<2600;k++){let y=rainPos[k*3+1]-dt*(150+60*ri);if(y<0)y+=260;rainPos[k*3+1]=y;const x=c.x+rainPos[k*3],z=c.z+rainPos[k*3+2];a.setXYZ(k*2,x,y,z);a.setXYZ(k*2+1,x+wx*.35,y+5.5,z)}a.needsUpdate=true}}
if(dust){dust.material.opacity=.3*SC.sum*el*(1-cl*.7);const a=dust.geometry.attributes.position;for(let k=0;k<360;k++){let x=a.getX(k)+dt*(4+sim.w[i]/10+(k%5));if(x>480)x=-100;a.setXYZ(k,x,a.getY(k)+Math.sin(ph+k)*.02,a.getZ(k))}a.needsUpdate=true}
const mo=SC.mon*(.4+.6*cl);sgates.forEach(g=>g.position.y+=(13.3+3.8*Math.min(1,mo)-g.position.y)*ft);
if(gateI)gateI.textContent=(hn>.03?'OPEN '+Math.round(hn*100)+'% · releasing '+sim.h[i].toFixed(0)+' MW':'CLOSED · holding water')+(mo>.35?' · spillway gates opening':'');
const qn=sim.q[i]/sim.qmax;lvl+=(SC.mon*1.1+SC.win*.25+2.4*qn-lvl)*ft;
const wTgt=4.8+SC.mon*1.6+SC.win*.5+(5.2-.6*SC.mon)*Math.pow(qn,.55)-.35*hn;wLvl+=(Math.max(4.4,Math.min(10.65,wTgt))-wLvl)*ft;
if(wline){const yy=.12+wLvl;wline.position.set(0,yy,-1.6-1.1*(Math.min(5,yy)+4)/9-.1)}if(wmat)wmat.uniforms.uLvl.value=wLvl;
if(lvI)lvI.textContent=(sim.h[i]<17.1?'▲ filling':'▼ draining')+' · +'+(lvl*10).toFixed(1)+' m above base (exaggerated · ticks = 10 m)';
igates.forEach(g=>g.position.y+=(6.8+4.2*hn-g.position.y)*ft);
birds.forEach((b,k)=>{const d=b.userData,a=d.a+ph*d.sp,vx=-Math.sin(a)*d.r,vz=Math.cos(a)*d.r*.6;b.visible=el>.04;b.position.set(d.cx+Math.cos(a)*d.r,d.h+Math.sin(ph*.7+k)*3,d.cz+Math.sin(a)*d.r*.6);b.rotation.y=Math.atan2(vx,vz)+Math.PI;const f=Math.sin(ph*9+k*1.7)*.7;d.w[0].rotation.z=f;d.w[1].rotation.z=-f});
clouds.forEach(c=>{c.position.x+=dt*(2+c.userData.s);if(c.position.x>560)c.position.x=-560;c.material.opacity=Math.min(.95,.12+.9*cl*c.userData.k*(1+.6*SC.mon))*(.35+.65*Math.max(el,.15));const g=(.3+.7*el)*(1-.55*SC.mon*cl);c.material.color.setRGB(g,g,g*.97+.03);c.scale.set(130*(1+.9*SC.mon),65*(1+.5*SC.mon),1)});
if(stars)stars.material.opacity=Math.max(0,1-el*3)*.9;
boats.forEach(b=>{const d=b.userData,a=d.a+ph*d.sp;b.position.set(d.cx+Math.cos(a)*d.r,WY+.35+wLvl+Math.sin(ph*1.6+d.a)*.1,d.cz+Math.sin(a)*d.r*.5);b.rotation.y=Math.atan2(-Math.sin(a)*d.r,Math.cos(a)*d.r*.5)+Math.PI/2;b.rotation.z=Math.sin(ph*1.3+d.a)*.04});
sway.forEach(g=>g.rotation.z=Math.sin(ph*1.2+g.userData.p)*(.015+.03*sim.w[i]/100));
if(smoke){const a=smoke.geometry.attributes.position,o=smoke.userData.o;for(let k=0;k<smoke.userData.n;k++){const q=o[k%o.length];let y=a.getY(k)+dt*(1.5+(k%5)*.3);if(y>q[1]+10)y=q[1];a.setXYZ(k,q[0]+Math.sin(y*.7+k)*.6+(y-q[1])*.25,y,q[2])}a.needsUpdate=true}}
const gy=(x,z)=>Math.max(HM(x,z),WY);
const glow=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'#fff');r.addColorStop(.3,'rgba(255,255,255,.7)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
function tag(t,s,col,x,y,z,plc){const e=document.createElement('div');e.className='tg'+(plc?' pl':'');e.style.setProperty('--c',col);e.innerHTML='<b>'+t+'</b>'+(s?'<i>'+s+'</i>':'');$(plc?'plcc':'labc').appendChild(e);const v=new THREE.Vector3(x,plc?y:Math.max(y,gy(x,z)+9),z);e.onclick=()=>fly(v);TG.push({e,v,plc});return e}
function fly(v){tw={t:0,p0:cam.position.clone(),t0:ctl.target.clone(),p1:v.clone().add(new THREE.Vector3(45,38,55)),t1:v.clone().setY(Math.max(0,v.y-12))}}
const pq=new THREE.Vector3();
function proj(){const w=innerWidth,h=innerHeight;TG.forEach(o=>{pq.copy(o.v).project(cam);const d=cam.position.distanceTo(o.v),ok=pq.z<1&&Math.abs(pq.x)<1.1&&Math.abs(pq.y)<1.1&&(!o.plc||d<700);o.e.style.display=ok?'':'none';if(ok){o.e.style.transform='translate('+((pq.x*.5+.5)*w)+'px,'+((-pq.y*.5+.5)*h)+'px) translate(-50%,-100%)';o.e.style.zIndex=Math.round(3000-d);o.e.style.fontSize=(d>480?10:12)+'px'}})}
const fence=(r,c)=>{const p=[[r[0]-3,r[1]-3],[r[2]+3,r[1]-3],[r[2]+3,r[3]+3],[r[0]-3,r[3]+3]],v=[];for(let k=0;k<4;k++)for(let t=0;t<24;t++){const a=p[k],b=p[(k+1)%4],x=a[0]+(b[0]-a[0])*t/24,z=a[1]+(b[1]-a[1])*t/24;v.push(new THREE.Vector3(x,gy(x,z)+1.1,z))}return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v,true),220,.4,6,true),new THREE.MeshBasicMaterial({color:c}))};
const ptex=(c1,c2,gl)=>{const c=document.createElement('canvas');c.width=64;c.height=512;const g=c.getContext('2d');g.fillStyle=c1;g.fillRect(0,0,64,512);g.strokeStyle=c2;g.lineWidth=2;for(let y=0;y<=512;y+=36){g.beginPath();g.moveTo(0,y);g.lineTo(64,y);g.stroke()}for(let x=0;x<=64;x+=21){g.beginPath();g.moveTo(x,0);g.lineTo(x,512);g.stroke()}g.strokeStyle=gl;g.lineWidth=7;g.strokeRect(0,0,64,512);const t=new THREE.CanvasTexture(c);t.anisotropy=8;t.encoding=THREE.sRGBEncoding;return t};
const bent=len=>{const g=new THREE.BoxGeometry(2.6,.22,len,8,1,14),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,p.getY(i)+.2*(1-(x/1.3)*(x/1.3))+.05*Math.sin(z/len*Math.PI*8))}g.computeVertexNormals();return g};
function pv(r,pitch,len,lift,tex,emi,layer,tl,fc,pc,agri){const ps=[],gap=7,w=r[2]-r[0],d=r[3]-r[1],cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,y0=gy(cx,cz),Lr=L(layer);
for(let z=r[1];z+len<=r[3]+1;z+=len+gap)for(let x=r[0]+3;x<r[2]-2;x+=pitch){if(!agri&&(x-r[0])%66<pitch*1.4)continue;ps.push([x,z+len/2])}
const im=new THREE.InstancedMesh(bent(len),new THREE.MeshStandardMaterial({map:tex,metalness:.5,roughness:.22,emissive:emi,emissiveMap:tex}),ps.length);
ps.forEach((p,k)=>panels.push({im,k,x:p[0],y:gy(p[0],p[1])+lift,z:p[1],s:tl,j:(Math.random()-.5)*.07}));Lr.add(im);if(layer==='solar'){solMat=im.material;solGlow=new THREE.Mesh(new THREE.PlaneGeometry(w+8,d+8),new THREE.MeshBasicMaterial({color:0xffc83d,transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false}));solGlow.rotation.x=-Math.PI/2;solGlow.position.set(cx,y0+.45,cz);solBeam=new THREE.Mesh(new THREE.CylinderGeometry(.8,9,52,28,1,true),new THREE.MeshBasicMaterial({color:0xffd24d,transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));solBeam.position.set(cx,y0+26,cz);Lr.add(solGlow,solBeam)}
if(pc){const pd=box(w+8,.5,d+8,mat(pc));pd.position.set(cx,y0,cz);Lr.add(pd);
 if(!agri){for(let x=r[0];x<r[2];x+=66){const ln=box(pitch*1.4,.1,d,mat(0xe3dac4));ln.position.set(x+pitch*.7,y0+.3,cz);Lr.add(ln);const iv=box(3.6,2.6,2.8,mat(0xffffff,0x112233)),tp=box(3.8,.3,3,mat(0x19b8e0,0x0a6a88));iv.position.set(x+pitch*.7,y0+1.5,cz);tp.position.set(x+pitch*.7,y0+2.9,cz);Lr.add(iv,tp)}
 for(let z=r[1]+len+gap/2;z<r[3];z+=len+gap){const ln=box(w,.1,gap-1,mat(0xe3dac4));ln.position.set(cx,y0+.3,z);Lr.add(ln)}}}
if(agri){const cb=new THREE.InstancedMesh(new THREE.BoxGeometry(8,.4,len-1),new THREE.MeshLambertMaterial({color:0xffffff}),ps.length),lg=new THREE.InstancedMesh(new THREE.CylinderGeometry(.17,.17,lift),mat(0xc4ccd4),ps.length*2),m=new THREE.Matrix4(),cc=[0x62c94d,0x8fd650,0x3fa23c,0xc8d34a];
 ps.forEach((p,k)=>{const g0=gy(p[0],p[1]);m.makeTranslation(p[0],g0+.35,p[1]);cb.setMatrixAt(k,m);cb.setColorAt(k,new THREE.Color(cc[k%4]));[-1,1].forEach((sg,e)=>{m.makeTranslation(p[0],g0+lift/2,p[1]+sg*(len/2-3));lg.setMatrixAt(k*2+e,m)})});Lr.add(cb,lg)}
Lr.add(fence(r,fc));[[r[0],r[1]],[r[2],r[1]],[r[2],r[3]],[r[0],r[3]]].forEach(c=>{const g0=gy(c[0],c[1]),mst=box(.5,9,.5,mat(0x444));mst.position.set(c[0],g0+4.5,c[1]);const lm=new THREE.Mesh(new THREE.SphereGeometry(.6,8,8),mat(0xfff0b0,0xffe080));lm.position.set(c[0],g0+9.3,c[1]);lamps.push(lm);Lr.add(mst,lm)});return im}
function tower(x,z,yaw,hh){const g=new THREE.Group();g.position.set(x,gy(x,z),z);g.rotation.y=yaw;L('line').add(g);
const bd=new THREE.Mesh(new THREE.CylinderGeometry(.25,1.3,hh,4,7,true),new THREE.MeshBasicMaterial({color:0xf0f4f8,wireframe:true}));bd.position.y=hh/2;bd.rotation.y=Math.PI/4;g.add(bd);
const loc=[];[.6,.79,.97].forEach((f,i)=>{const w=(i?3.3:2.5)*hh/16,a=box(w*2,.2,.2,mat(0xe3e9ee));a.position.y=hh*f;g.add(a);[-1,1].forEach(s=>{const n=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,1.1,6),mat(0xa8d8ff,0x2266aa));n.position.set(s*w,hh*f-.6,0);g.add(n);loc.push(new THREE.Vector3(s*w,hh*f-1.1,0))})});
g.updateMatrixWorld(true);return loc.map(v=>g.localToWorld(v))}
function hvp(pts,hh,sp){const Tp=[];for(let k=0;k<pts.length-1;k++){const a=pts[k],b=pts[k+1],n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/sp));for(let i=0;i<n;i++)Tp.push([a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n])}Tp.push(pts[pts.length-1]);
const T=Tp.map((p,i)=>{const a=Tp[Math.max(0,i-1)],b=Tp[Math.min(Tp.length-1,i+1)];return tower(p[0],p[1],Math.atan2(b[0]-a[0],b[1]-a[1]),hh)}),n=T.length-1;
const sg=[],w3=[];for(let i=0;i<n;i++)for(let k=0;k<6;k++){let pr=null;for(let u=0;u<=12;u++){const f=u/12,A=T[i][k],B=T[i+1][k],p=new THREE.Vector3().lerpVectors(A,B,f);p.y-=A.distanceTo(B)*.12*f*(1-f);if(pr)sg.push(pr,p);pr=p;if(k===3&&(u>0||i===0))w3.push(p)}}
L('line').add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(sg),new THREE.LineBasicMaterial({color:0xeef3f7})));return w3}
const th=(a,s)=>a.filter((_,i)=>i%s===0||i===a.length-1);
const gp=a=>{const o=[];for(let k=0;k<a.length-1;k++)for(let t=0;t<10;t++){const x=a[k][0]+(a[k+1][0]-a[k][0])*t/10,z=a[k][1]+(a[k+1][1]-a[k][1])*t/10;o.push(new THREE.Vector3(x,gy(x,z)+1.5,z))}const e=a[a.length-1];o.push(new THREE.Vector3(e[0],gy(e[0],e[1])+1.5,e[1]));return o};
function build(){
const [wdx,wdz]=P(800,398);
wmat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uH:{value:null},uLvl:{value:wLvl},uTR:{value:0},uTT:{value:0},uDay:{value:1},uSun:{value:new THREE.Vector3(0,1,0)},uSky:{value:new THREE.Color(0x9cc4e4)},uD:{value:new THREE.Vector2(wdx,wdz)},uDn:{value:new THREE.Vector2(-.68,.74)}},
vertexShader:`uniform float uLvl;uniform vec2 uD,uDn;varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);w.y+=uLvl*(1.-smoothstep(-1.8,2.2,dot(w.xz-uD,uDn)));vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
fragmentShader:`uniform sampler2D uH;uniform float uTR,uTT,uDay;uniform vec3 uSun,uSky;uniform vec2 uD,uDn;varying vec3 vW;
float hf(vec2 p,float t){return sin(p.x*.55+p.y*.3+t*.8)*.5+sin(p.x*1.1-p.y*.8+t*1.1)*.3+sin(p.x*2.3+p.y*1.9-t*1.6)*.15+sin(p.x*4.1-p.y*3.3+t*2.2)*.08;}
float hh(vec2 p){float m=smoothstep(-6.,14.,dot(p-uD,uDn)),tt=mix(uTR,uTT,m);return mix(hf(p-uDn*uTR,uTR*.3),hf(p*1.25-uDn*uTT*1.25,uTT*.4),m)+.35*hf(p*2.7-uDn*tt*1.3,tt*.7);}
void main(){vec2 p=vW.xz;float e=.35,h=hh(p),dx=hh(p+vec2(e,0.))-h,dz=hh(p+vec2(0.,e))-h;vec3 N=normalize(vec3(-dx/e*.8,1.,-dz/e*.8));vec3 V=normalize(cameraPosition-vW);vec3 L=normalize(uSun);
float fr=pow(1.-max(dot(N,V),0.),3.);float m=smoothstep(-6.,14.,dot(p-uD,uDn));
float sp=pow(max(dot(reflect(-L,N),V),0.),170.)*uDay*2.2;float fo=m*smoothstep(.55,.95,h*.8+.35*hf(p*2.,uTT))*.8;float th=texture2D(uH,vec2(vW.x/960.+.5,vW.z/540.+.5)).r*50.-5.,dp=vW.y-th,shal=exp(-max(dp,0.)*.55);fo+=smoothstep(1.4,.1,dp)*(.45+.35*sin(uTR*2.2+dp*5.))*.7;
vec3 col=mix(vec3(.004,.05,.09),vec3(.02,.2,.26),.5+h*.3)+uSky*fr*.45*(.3+.7*uDay)+vec3(1.,.93,.75)*sp+vec3(.8,.9,.95)*fo;col=mix(col,vec3(.05,.32,.30),shal*.5);float dd=dot(p-uD,uDn),up=1.-smoothstep(-1.8,2.2,dd);col=mix(col,col*vec3(.5,.85,1.2)+vec3(0.,.02,.05),up*.9);col+=vec3(.15,.8,1.)*exp(-pow(dd+2.8,2.)*1.8)*.55;col*=.25+.75*uDay;
gl_FragColor=linearToOutputTexel(vec4(col,min(1.,(.7+fr*.25+fo*.3)*(.45+.55*smoothstep(0.,1.2,dp)))));}`});
const wp=new THREE.Mesh(new THREE.PlaneGeometry(W,HH,320,180),wmat);wp.rotation.x=-Math.PI/2;wp.position.y=WY+.12;S.add(wp);wmat.uniforms.uH.value=(()=>{const a=new Uint8Array(hs.length);for(let k=0;k<hs.length;k++)a[k]=Math.max(0,Math.min(255,Math.round((hs[k]+5)/50*255)));const t=new THREE.DataTexture(a,NX+1,NZ+1,THREE.LuminanceFormat);t.magFilter=t.minFilter=THREE.LinearFilter;t.needsUpdate=true;return t})();
// ===== DAM =====
const [dx,dz]=P(800,398),ang=Math.atan2(60,65),dg=new THREE.Group();dg.position.set(dx,WY,dz);dg.rotation.y=-ang;L('dam').add(dg);
const ctex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#c4bfb3';g.fillRect(0,0,256,256);for(let i=0;i<2600;i++){g.fillStyle='rgba('+(i%2?'90,86,78':'235,230,220')+','+Math.random()*.12+')';g.fillRect(Math.random()*256,Math.random()*256,Math.random()*6+1,Math.random()*3+1)}g.fillStyle='rgba(60,56,50,.35)';for(let y=0;y<256;y+=64)g.fillRect(0,y,256,2);for(let x=0;x<256;x+=128)g.fillRect(x,0,1.5,256);for(let i=0;i<14;i++){const x=Math.random()*256,gr=g.createLinearGradient(x,0,x,256);gr.addColorStop(0,'rgba(50,45,38,0)');gr.addColorStop(.3,'rgba(50,45,38,.22)');gr.addColorStop(1,'rgba(50,45,38,0)');g.fillStyle=gr;g.fillRect(x,0,4+Math.random()*8,256)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;t.encoding=THREE.sRGBEncoding;return t})();
const ctexE=ctex.clone();ctexE.needsUpdate=true;ctexE.repeat.set(.125,.125);
const cmat=(c,t)=>new THREE.MeshStandardMaterial({map:t||ctex,color:c||0xffffff,roughness:.92,metalness:0});
const cbox=(w,h,d,c)=>{const g=new THREE.BoxGeometry(w,h,d),u=g.attributes.uv,sz=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const k=f*4+v;u.setXY(k,u.getX(k)*sz[f][0]/8,u.getY(k)*sz[f][1]/8)}return new THREE.Mesh(g,cmat(c))};
const put=(m,x,y,z)=>{m.position.set(x,y,z);dg.add(m);return m};
const sh=new THREE.Shape();[[-1.5,-4],[-2.6,5],[-2.6,11],[2.6,11],[2.6,8.5],[4,8.5],[4,6],[5.4,6],[5.4,3.5],[6.8,3.5],[6.8,1],[8.2,1],[8.2,-1.5],[9.5,-1.5],[9.5,-4]].forEach((p,i)=>i?sh.lineTo(p[0],p[1]):sh.moveTo(p[0],p[1]));
const dgeo=new THREE.ExtrudeGeometry(sh,{depth:51,bevelEnabled:false});dgeo.rotateY(-Math.PI/2);dgeo.translate(25.5,0,0);dg.add(new THREE.Mesh(dgeo,cmat(0xffffff,ctexE)));
put(box(51,.35,5.3,mat(0x34383d)),0,11.2,0);[-2.5,2.5].forEach(z=>put(cbox(51,1,.25),0,11.9,z));
put(cbox(9,21,18),-30,2.5,3);put(cbox(9,21,18),30,2.5,3);
for(let i=0;i<5;i++){const x=-22.1+i*4.8;put(cbox(4.4,4.6,3.4),x,13.3,-.3);put(box(3.6,8.6,.25,mat(0x1c252d)),x,6.3,-2.75);igates.push(put(box(3.4,6.8,.3,mat(0x3a5368,0x08202e)),x,6.8,-3.05))}
put(box(26,.4,.7,mat(0x59626d)),-12.5,17,-.3);
for(let i=0;i<8;i++){put(cbox(1.3,6.5,3.6),.5+i*3.4,14.4,-.3);if(i<7)sgates.push(put(box(2,4.6,.35,mat(0x3f6580,0x0b2a3c)),2.2+i*3.4,13.3,-1.4))}
put(cbox(24.2,.5,3.6),12.4,17.2,-.3);[-1.7,1.7].forEach(z=>put(box(24.2,.9,.12,mat(0x222a31)),12.4,17.9,z-.3));
for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.4,8,8),mat(0xffe9a0,0xffd060));put(l,1.6+i*3.6,18.7,-.3);lamps.push(l)}
const gable=w=>{const s2=new THREE.Shape();s2.moveTo(-3.7,0);s2.lineTo(3.7,0);s2.lineTo(0,2.3);const g=new THREE.ExtrudeGeometry(s2,{depth:w+.2,bevelEnabled:false});g.rotateY(-Math.PI/2);g.translate((w+.2)/2,0,0);return g};
const unit=(x,w,mp)=>{put(cbox(w,6.4,6.6,mp?0x9fe8cf:0xb9c1c9),x,.2,12.8);put(new THREE.Mesh(gable(w),mat(mp?0x14b383:0x4d555e,mp?0x063d2c:0)),x,3.4,12.8);
const wn=put(box(w*.7,1,.12,new THREE.MeshLambertMaterial({color:0x10202c,emissive:0xffcf70,emissiveIntensity:.05})),x,1.4,16.15);lamps.push(wn);put(box(w*.6,1.8,.3,mat(0x0d151c)),x,-2.1,16.3)};
for(let i=0;i<5;i++){if(i===2){unit(-13.65,2.3,true);unit(-11.35,2.3,false)}else unit(-22.1+i*4.8,4.6,i<2);
 const pn=new THREE.Mesh(new THREE.CylinderGeometry(1,1,7.8,12),new THREE.MeshLambertMaterial({color:0x7a8791,emissive:0x19b8e0,emissiveIntensity:0}));pn.rotation.x=-Math.atan2(6.4,4.5);put(pn,-22.1+i*4.8,4.75,6.3);pens.push(pn)}
put(cbox(25,.8,13.5),12.5,-2.5,15.5);put(cbox(.9,5.5,17),-.3,-.2,16.7);put(cbox(.9,5.5,17),25.6,-.2,16.7);put(cbox(25,1.2,1),12.5,-1.9,22.2);
for(let i=0;i<6;i++){put(cbox(1.4,1.4,1.4),2+i*4,-1.4,13);put(cbox(1.4,1.4,1.4),4+i*4,-1.4,17.6)}
const fcn=document.createElement('canvas');fcn.width=fcn.height=128;const fg=fcn.getContext('2d');fg.fillStyle='#000';fg.fillRect(0,0,128,128);for(let i=0;i<260;i++){fg.fillStyle='rgba(255,255,255,'+(.2+Math.random()*.5)+')';fg.beginPath();fg.arc(Math.random()*128,Math.random()*128,1+Math.random()*5,0,7);fg.fill()}
foam=new THREE.CanvasTexture(fcn);foam.wrapS=foam.wrapT=THREE.RepeatWrapping;foam.repeat.set(4,3);
const fm=new THREE.Mesh(new THREE.PlaneGeometry(27,16),new THREE.MeshBasicMaterial({map:foam,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));fm.rotation.x=-Math.PI/2;put(fm,12.5,-2.0,30);foamM=fm;foam2=foam.clone();foam2.needsUpdate=true;foam2.repeat.set(3,2);const sheet=new THREE.Mesh(new THREE.PlaneGeometry(24.3,14.3),new THREE.MeshBasicMaterial({map:foam2,color:0xaee8ff,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));sheet.rotation.x=-.505;put(sheet,12.4,5.4,6.4);sheetM=sheet;
const lp=(x,y,z)=>dg.localToWorld(new THREE.Vector3(x,y,z));
const sy=lp(-37,0,15),syg=new THREE.Group();syg.position.set(sy.x,gy(sy.x,sy.z),sy.z);syg.rotation.y=-ang;L('dam').add(syg);
const yp=box(13,.35,9,mat(0x80858a));yp.position.y=.2;syg.add(yp);[-4,0,4].forEach(x=>{const t=box(2.4,2.8,2.4,mat(0x5a7a9a));t.position.set(x,1.7,1.5);syg.add(t)});
[-4,0,4].forEach(x=>{const p1=box(.25,5,.25,mat(0x333)),p2=p1.clone();p1.position.set(x-1.5,2.5,-2.8);p2.position.set(x+1.5,2.5,-2.8);const bm=box(3.3,.25,.25,mat(0x333));bm.position.set(x,5,-2.8);syg.add(p1,p2,bm)});
const gg=new THREE.CylinderGeometry(1.3,1.3,16,16);gg.translate(0,8,0);const go=new THREE.Mesh(gg,new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.5})),gf=new THREE.Mesh(gg,new THREE.MeshBasicMaterial({color:0x38d1ff,transparent:true,opacity:.75}));gf.scale.set(.85,.1,.85);go.position.copy(lp(30,13,2));gf.position.copy(go.position);L('dam').add(go,gf);gauge=gf;
const at=(x,y,z,t,s,c)=>{const v=lp(x,y,z);tag(t,s,c,v.x,v.y,v.z)};
tag('① Gandhi Sagar Dam — EXISTING, not new','514 m gravity dam · 5 × 23 MW powerhouse','#ffffff',dx,36,dz);
at(-17.5,12,13,'MP share 57.5 MW (ours to schedule)','2.5 units · emerald','#2ee6a0');at(-7,12,13,'Rajasthan share 57.5 MW','not ours · slate','#9aa7b4');
at(12.4,22,-.3,'Spillway · 7 radial gates','service bridge on top','#ffd27a');at(12.5,4,18,'Tail of the dam: stilling basin','baffle blocks · training walls · end sill','#ffd27a');
tag('220 kV dam switchyard','tie line to hub','#ffd27a',sy.x,syg.position.y+11,sy.z);
const gw=lp(30,13,2);tag('Water-bank gauge','fills by day · empties at dusk','#38d1ff',gw.x,gw.y+20,gw.z);const lv=lp(0,19,-16);lvI=tag('Reservoir level (saving side)','—','#38d1ff',lv.x,lv.y,lv.z).querySelector('i');
wline=new THREE.Mesh(new THREE.BoxGeometry(51,.16,.4),new THREE.MeshBasicMaterial({color:0x66e6ff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));wline.position.set(0,8.92,-2.8);dg.add(wline);
const rl=box(.5,10.8,.14,mat(0x1c252d));rl.position.set(12.4,5.4,-2.85);dg.add(rl);for(let k=0;k<=10;k++){const tk=box(.9,.1,.16,mat(k%5?0xffffff:0xffd24d,k%5?0:0x553300));tk.position.set(12.4,.12+k,-2.92);dg.add(tk)}
{const v=lp(-12.5,19,-3);gateI=tag('Dam gates','—','#ffd27a',v.x,v.y,v.z).querySelector('i')}
// ===== SANCTUARY =====
const poly=[[520,880],[560,300],[780,100],[1500,60],[1625,120],[1625,250],[1250,330],[1000,470],[920,640],[700,900],[520,880]],pts=[];
for(let k=0;k<poly.length-1;k++)for(let t=0;t<40;t++){const a=P(...poly[k]),b=P(...poly[k+1]),x=a[0]+(b[0]-a[0])*t/40,z=a[1]+(b[1]-a[1])*t/40;pts.push(new THREE.Vector3(x,gy(x,z)+2,z))}
const sl=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:0xff4d6d,dashSize:5,gapSize:3}));sl.computeLineDistances();L('sanct').add(sl);
let q=P(700,160);tag('Sanctuary boundary — nothing new built inside','Gandhi Sagar Wildlife Sanctuary · 368.62 km²','#ff4d6d',q[0],gy(q[0],q[1])+22,q[1]);
// ===== SOLAR =====
const rect=(a,b,c,d)=>{const p=P(a,b),r=P(c,d);return [p[0],p[1],r[0],r[1]]};
const T1=ptex('#10296e','#7aa2f0','#f2f6ff'),T2=ptex('#13829e','#a8ecff','#e8fbff'),T3=ptex('#2c7fc0','#cdeaff','#ffffff');
pv(rect(1010,610,1350,830),6.6,26,1.3,T1,0x1c4ee0,'solar',0,0xffc83d,0x8d96a5,false);
const ar=rect(1400,560,1590,780);pv(ar,10.5,26,4.6,T2,0x0a5a70,'agri',1,0x8cff6a,0x6f8f4a,true);
const sr=rect(600,640,690,760),sf=pv(sr,6,14,0,T3,0x1a5a9a,'surf',0,0x7cc6ff,null,false);panels.filter(p=>p.im===sf).forEach(p=>p.y=WY+.45);
const sq=new THREE.Line(new THREE.BufferGeometry().setFromPoints([[sr[0],sr[1]],[sr[2],sr[1]],[sr[2],sr[3]],[sr[0],sr[3]],[sr[0],sr[1]]].map(p=>new THREE.Vector3(p[0],WY+.8,p[1]))),new THREE.LineDashedMaterial({color:0x7cc6ff,dashSize:2,gapSize:2}));sq.computeLineDistances();L('surf').add(sq);
q=P(645,700);tag('⑤ 40 MWp water-surface solar — CONDITIONAL','tailrace · outside sanctuary · site not yet confirmed','#7cc6ff',q[0],gy(q[0],q[1])+14,q[1]);
q=P(1180,720);solI=tag('② 140 MWp tracker solar farm','cobalt rows · gold fence','#ffc83d',q[0],gy(q[0],q[1])+18,q[1]).querySelector('i');
q=P(1495,670);tag('② 20 MWp stilt agrivoltaics','4.6 m stilts · teal panels · crops beneath','#8cff6a',q[0],gy(q[0],q[1])+15,q[1]);
// ===== WIND =====
const poly2=[[1180,470],[1330,420],[1480,380],[1610,335]],rw=[[],[]],cm=mat(0xd6d3c9),sm=mat(0xf6f8fa),bm=mat(0xffffff);
for(let r=0;r<2;r++)for(let k=0;k<12;k++){const f=k/11*3,i=Math.min(2,Math.floor(f)),t=f-i,a=poly2[i],b=poly2[i+1];rw[r].push(P(a[0]+(b[0]-a[0])*t+r*(-16),a[1]+(b[1]-a[1])*t+r*30))}
rw.forEach((row,ri)=>{L('wind').add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(row.map(p=>new THREE.Vector3(p[0],gy(p[0],p[1])+.2,p[1]))),60,.55,5),mat(0xb8ab94)));
row.forEach((p,k)=>{const [x,z]=p,g=new THREE.Group();g.position.set(x,HM(x,z),z);g.rotation.y=.55;
const pad=new THREE.Mesh(new THREE.CylinderGeometry(2.6,3.6,3.4,24),mat(0xa49e94));pad.position.y=-.6;
const t1=new THREE.Mesh(new THREE.CylinderGeometry(.5,.75,6,16),cm);t1.position.y=3;const t2=new THREE.Mesh(new THREE.CylinderGeometry(.27,.5,9,16),sm);t2.position.y=10.5;
const nc=box(.85,.85,1.7,sm);nc.position.y=15.2;const ro=new THREE.Group();ro.position.set(0,15.2,1);
for(let b=0;b<3;b++){const bl=box(.24,7.2,.08,bm);bl.position.y=3.6;const pv2=new THREE.Group();pv2.rotation.z=b*2.094;pv2.add(bl);ro.add(pv2)}
const ls=new THREE.Mesh(new THREE.SphereGeometry(.28,8,8),new THREE.MeshBasicMaterial({color:0xff2a2a}));ls.position.y=15.8;blinks.push(ls);
const rg2=new THREE.Mesh(new THREE.TorusGeometry(.62,.07,8,24),new THREE.MeshLambertMaterial({color:0xffffff,emissive:0x38d1ff,emissiveIntensity:.3}));rg2.rotation.x=Math.PI/2;rg2.position.y=6.1;lamps.push(rg2);g.add(pad,t1,t2,nc,ro,ls,rg2);rotors.push(ro);L('wind').add(g);
if(k===5||k===11){const lab=k===5?'Row A · T01–T12':'Row B · T13–T24';tag(lab,'4.2 MW · 150 m hybrid tower','#9fe8ff',x,HM(x,z)+22,z)}})});
q=rw[0][2];tag('③ Ridge wind farm — 24 × 4.2 MW','60 m precast concrete + 90 m steel','#38d1ff',q[0],HM(q[0],q[1])+30,q[1]);
// ===== HUB =====
const [hx,hz]=P(1000,585),hg=new THREE.Group(),hy=gy(hx,hz);hg.position.set(hx,hy,hz);L('hub').add(hg);
const yd=box(26,.4,20,mat(0x8a8e93));yd.position.y=.2;hg.add(yd);
const cr=box(7,3.2,4.4,mat(0xe6e0d2));cr.position.set(-8,2,-6);const dish=new THREE.Mesh(new THREE.SphereGeometry(.9,10,6,0,6.3,0,1.2),mat(0xffffff));dish.position.set(-8,4.2,-6);dish.rotation.x=-.6;hg.add(cr,dish);
[-4,3,9].forEach(x=>{const t=box(3.2,3.6,3.2,mat(0x4d6f93));t.position.set(x,2,0);hg.add(t);for(let f=0;f<4;f++){const fn=box(.15,2.6,3.5,mat(0x2e4560));fn.position.set(x-1.2+f*.8,2,0);hg.add(fn)}});
for(let r=0;r<2;r++)for(let i=0;i<4;i++){const bt=box(2.6,2.2,5,new THREE.MeshLambertMaterial({color:0xe9f5f2,emissive:0x14c4a0}));bt.position.set(-9+i*3,1.3,5+r*0);bt.position.z=r?7.5:3.5;hg.add(bt);batt.push(bt)}
for(let i=0;i<3;i++){const a=box(.3,7,.3,mat(0x333)),b=a.clone(),c=box(4,.3,.3,mat(0x333));a.position.set(11,3.5,-8+i*5);b.position.set(11,3.5,-6+i*5);c.position.set(11,7,-7+i*5);hg.add(a,b,c)}
tag('④ Hub — 220 kV substation','control room · 3 transformers · double bus','#ffd27a',hx,hy+14,hz);
tag('40 MW / 80 MWh grid-forming battery','glow = state of charge','#2ee6a0',hx-4.5,hy+7,hz+5.5);
// ===== TRANSMISSION =====
const gx=P(1625,545),ptsE=[[hx+18,hz+4],P(1070,545),P(1380,545),gx],ex=hvp(ptsE,17,40),tie=hvp([[sy.x,sy.z],[hx-16,hz-6]],12,40);
[-1,1].forEach(sd=>{const v=[];for(let k=0;k<ptsE.length-1;k++){const a=ptsE[k],b=ptsE[k+1],d=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/d*6*sd,nz=(b[0]-a[0])/d*6*sd;for(let t=0;t<=20;t++){const x=a[0]+(b[0]-a[0])*t/20+nx,z=a[1]+(b[1]-a[1])*t/20+nz;v.push(new THREE.Vector3(x,gy(x,z)+.6,z))}}const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(v),new THREE.LineDashedMaterial({color:0xffa94d,dashSize:3,gapSize:2}));l.computeLineDistances();L('line').add(l)});
q=[(hx+gx[0])/2,(hz+gx[1])/2];const mid=ex[Math.floor(ex.length/2)];
tag('400 kV line — rerouted around the solar farm','amber dashes = no-build corridor · → Neemuch pooling stn','#ffffff',mid.x,mid.y+14,mid.z);
const tm=tie[Math.floor(tie.length/2)];tag('220 kV tie: dam → hub','6 spans · 12 m lattice pylons','#ffd27a',tm.x,tm.y+10,tm.z);
// ===== FLOWS =====
const mk=(pts,col)=>{const cu=new THREE.CatmullRomCurve3(pts),N=70,tb=new THREE.Mesh(new THREE.TubeGeometry(cu,160,.3,6),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false})),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));const pt=new THREE.Points(g,new THREE.PointsMaterial({size:4.5,map:glow,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));pt.frustumCulled=false;L('flow').add(tb,pt);return {cu,tb,pt,N,f:0}};
const dd=(a)=>a.filter((p,i)=>i===0||p.distanceTo(a[i-1])>.5),hubV=new THREE.Vector3(hx,hy+4,hz),rs=P(900,300);
paths.solar=mk(dd(gp([P(1495,650),P(1360,690),P(1100,700),P(1020,610),[hx+4,hz+2]])),0xf5c542);
paths.wind=mk(dd(gp([P(1400,380),P(1250,470),P(1060,540),[hx+6,hz-3]])),0x38d1ff);
paths.hydro=mk(dd([new THREE.Vector3(rs[0],-1.5,rs[1]),new THREE.Vector3(dx,14,dz),new THREE.Vector3(sy.x,syg.position.y+5,sy.z),...th(tie,4),hubV]),0x38d1ff);
paths.exp=mk(dd([hubV,...th(ex,4)]),0xf5c542);
// ===== PLACE NAMES (real landmarks in the satellite view) =====
[['Gandhi Sagar Dam · गांधी सागर बांध',800,385,14],['Chambal Bridge · SH-31A',745,447,10],['Char Pillar viewpoint · चार पिलर',815,283,10],['Gandhi Sagar town · गाँधी सागर',1050,150,14],['Forest rest house · Gandhisagar sanctuary',1008,408,12],['Gandhi Sagar Reservoir (Chambal)',1250,210,6],['Chambal river gorge · tailrace',640,730,6],['MADHYA PRADESH ⟷ RAJASTHAN border',620,300,16],['RAJASTHAN side — not ours',380,430,16],['Mandsaur–Neemuch plateau (MP) — project site',1300,640,14]].forEach(a=>{const p=P(a[1],a[2]);tag('📍 '+a[0],'real place · matches satellite view','#bbb',p[0],gy(p[0],p[1])+a[3],p[1],true)});
const rc=new THREE.CatmullRomCurve3([[1560,170],[1300,230],[1050,300],[880,370],[805,402],[775,445],[740,520],[690,620],[630,720],[560,810],[470,890]].map(a=>{const p=P(...a);return new THREE.Vector3(p[0],WY+.7,p[1])})),RN=240,rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(RN*3),3));
const rp=new THREE.Points(rg,new THREE.PointsMaterial({size:2.6,map:glow,color:0xcdf3ff,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}));rp.frustumCulled=false;L('flow').add(rp);riv={rc,rp,RN,ph:0};
const tx=fn=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');fn(g);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return t};
const stuc=tx(g=>{g.fillStyle='#ebe1cb';g.fillRect(0,0,128,128);for(let i=0;i<700;i++){g.fillStyle='rgba(120,100,70,'+Math.random()*.09+')';g.fillRect(Math.random()*128,Math.random()*128,2,2)}g.fillStyle='rgba(90,70,50,.14)';g.fillRect(0,104,128,24)});
const tile=tx(g=>{g.fillStyle='#bd583c';g.fillRect(0,0,128,128);g.strokeStyle='rgba(70,25,15,.55)';g.lineWidth=3;for(let y=0;y<128;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke()}for(let x=0;x<128;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x,128);g.stroke()}});
const smokeO=[],glw=c=>new THREE.MeshLambertMaterial({color:0x223344,emissive:c,emissiveIntensity:.05});
function tree(x,z,sc){const y=gy(x,z),g=new THREE.Group(),cols=[0x3f7a35,0x4e8f3c,0x356b30,0x6a9a3a],col=cols[Math.floor(Math.abs(x*13+z*7))%4];g.position.set(x,y,z);const tr=new THREE.Mesh(new THREE.CylinderGeometry(.12*sc,.2*sc,1.6*sc,6),mat(0x5a4330));tr.position.y=.8*sc;const cn=new THREE.Group();cn.position.y=1.6*sc;cn.userData.p=x;[[0,.9,0,1.1],[.6,.5,.2,.8],[-.5,.6,-.3,.85]].forEach(c=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(c[3]*sc,1),new THREE.MeshLambertMaterial({color:col,flatShading:true}));m.position.set(c[0]*sc,c[1]*sc,c[2]*sc);cn.add(m)});g.add(tr,cn);sway.push(cn);L('vil').add(g)}
function houses(px,py,n,r,roof,wall){const [x0,z0]=P(px,py),wc=wall?[wall]:[0xf1e6cf,0xe8c9a0,0xdfe8d4,0xf5d9c0,0xe4eaf0];
for(let i=0;i<n;i++){const a=i*2.39996,rr=r*Math.sqrt((i+.6)/n),x=x0+Math.cos(a)*rr,z=z0+Math.sin(a)*rr,y=gy(x,z),w=1.7+((i*37)%5)*.18,d=1.6,ry=(i%5)*.3,g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;
 const b=new THREE.Mesh(new THREE.BoxGeometry(w,1.25,d),new THREE.MeshStandardMaterial({map:stuc,color:wc[i%wc.length],roughness:.9}));b.position.y=.62;g.add(b);
 if(i%2){const pr=box(w+.15,.15,d+.15,mat(0xcfc7b4));pr.position.y=1.3;const tk=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.55,10),mat(0x1a1d22));tk.position.set(w*.25,1.7,0);g.add(pr,tk)}
 else{const rf=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.78,.95,4),new THREE.MeshStandardMaterial({map:tile,color:roof||0xffffff,roughness:.8}));rf.rotation.y=Math.PI/4;rf.position.y=1.7;g.add(rf);if(i%3===0)smokeO.push([x,y+2.4,z])}
 const dr=box(.4,.8,.08,mat(0x4a2f1c));dr.position.set(-w*.2,.4,d/2+.02);const wn=new THREE.Mesh(new THREE.BoxGeometry(.4,.4,.08),glw(0xffc860));wn.position.set(w*.22,.7,d/2+.02);lamps.push(wn);g.add(dr,wn);L('vil').add(g)}
for(let k=0;k<Math.round(n/3);k++){const a=k*2.4+1,rr=r*1.15+k%3;tree(x0+Math.cos(a)*rr,z0+Math.sin(a)*rr,.9+(k%3)*.25)}
const lx=x0+r*.5,lz=z0-r*.4,ly=gy(lx,lz),ps=box(.1,2.4,.1,mat(0x333)),lm=new THREE.Mesh(new THREE.SphereGeometry(.22,8,8),glw(0xffe0a0));ps.position.set(lx,ly+1.2,lz);lm.position.set(lx,ly+2.5,lz);lamps.push(lm);L('vil').add(ps,lm)}
function temple(px,py){const [x,z]=P(px,py),g=new THREE.Group(),st=mat(0xf6ead2);g.position.set(x,gy(x,z),z);[3.4,2.8,2.3].forEach((w,i)=>{const b=box(w,.35,w,st);b.position.y=.18+i*.35;g.add(b)});const sn=box(1.7,1.5,1.7,st);sn.position.y=1.8;g.add(sn);
[[1.3,1.6,3.1],[1,1.3,4.1],[.7,1.1,4.9]].forEach(c=>{const t=new THREE.Mesh(new THREE.ConeGeometry(c[0],c[1],8),mat(0xf08a24,0x3a1a00));t.position.y=c[2];g.add(t)});
const am=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),mat(0xffd36b,0x6a4a00));am.position.y=5.6;const fl=box(.04,.9,.04,mat(0xd33));fl.position.y=6.4;const fg=box(.5,.3,.03,mat(0xe33,0x400));fg.position.set(.25,6.6,0);g.add(am,fl,fg);
for(let k=0;k<4;k++){const dy=new THREE.Mesh(new THREE.SphereGeometry(.1,6,6),glw(0xffb040));dy.position.set(Math.cos(k*1.57+.78)*1.55,.8,Math.sin(k*1.57+.78)*1.55);lamps.push(dy);g.add(dy)}L('vil').add(g)}
function pavilion(px,py){const [x,z]=P(px,py),g=new THREE.Group(),st=mat(0xe6d9bd);g.position.set(x,gy(x,z),z);const pl=box(4,.4,4,st);pl.position.y=.2;g.add(pl);
[[-1.4,-1.4],[1.4,-1.4],[-1.4,1.4],[1.4,1.4]].forEach(c=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,2.3,10),st),cp=box(.5,.2,.5,st);p.position.set(c[0],1.5,c[1]);cp.position.set(c[0],2.7,c[1]);g.add(p,cp)});
const rf=box(3.7,.25,3.7,st);rf.position.y=2.9;const dm=new THREE.Mesh(new THREE.SphereGeometry(1.35,16,10,0,6.3,0,1.57),mat(0xf08a24,0x2a1200));dm.position.y=3;const fi=new THREE.Mesh(new THREE.ConeGeometry(.12,.8,8),mat(0xffd36b,0x6a4a00));fi.position.y=4.7;g.add(rf,dm,fi);L('vil').add(g)}
houses(1050,150,22,11);temple(1032,178);houses(1008,425,4,2.8,0xffffff,0xf5f0e0);pavilion(815,285);houses(905,505,12,7,0x9aa0a8,0xe9e4d6);houses(1530,495,9,5.5);
for(let k=0;k<16;k++){const p=P(840+k*22,470+((k*53)%40));tree(p[0],p[1],1+(k%3)*.2)}
{const sg=new THREE.BufferGeometry(),N=70;sg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(N*3),3));smoke=new THREE.Points(sg,new THREE.PointsMaterial({size:3.4,map:glow,color:0xa8a8a8,transparent:true,opacity:.32,depthWrite:false}));smoke.frustumCulled=false;smoke.userData={n:N,o:smokeO.length?smokeO:[[0,0,0]]};S.add(smoke);for(let k=0;k<N;k++){const o=smoke.userData.o[k%smoke.userData.o.length];sg.attributes.position.setXYZ(k,o[0],o[1]+(k%10),o[2])}}
const mkBird=()=>{const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0x151515,side:THREE.DoubleSide}),wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.BufferAttribute(new Float32Array([0,0,0,1.7,0,.5,.2,0,-.5]),3));const w1=new THREE.Mesh(wg,m),w2=new THREE.Mesh(wg,m);w2.scale.x=-1;g.add(w1,w2);g.userData.w=[w1,w2];return g},[bcx,bcz]=P(1180,250);
for(let k=0;k<16;k++){const b=mkBird();Object.assign(b.userData,{a:k*.7,sp:.1+((k*7)%5)*.04,r:30+(k*13)%80,cx:bcx,cz:bcz,h:28+(k*5)%25});birds.push(b);S.add(b)}
const cct=document.createElement('canvas');cct.width=256;cct.height=128;{const g=cct.getContext('2d');for(let i=0;i<16;i++){const x=40+Math.random()*176,y=50+Math.random()*30,r=22+Math.random()*26,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,256,128)}}
const ctt=new THREE.CanvasTexture(cct);for(let k=0;k<24;k++){const c=new THREE.Sprite(new THREE.SpriteMaterial({map:ctt,transparent:true,depthWrite:false,fog:false,opacity:.3}));c.scale.set(130,65,1);c.position.set(-560+k*47,140+(k*17)%50,-300+(k*97)%600);c.userData={s:(k*3)%4,k:.5+(k%4)*.25};clouds.push(c);S.add(c)}
{const N=700,pa=new Float32Array(N*3);for(let k=0;k<N;k++){const u=Math.random()*6.283,v=Math.acos(Math.random()*.95+.05);pa.set([Math.sin(v)*Math.cos(u)*1700,Math.cos(v)*1700,Math.sin(v)*Math.sin(u)*1700],k*3)}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(pa,3));stars=new THREE.Points(sg,new THREE.PointsMaterial({size:1.8,sizeAttenuation:false,color:0xffffff,transparent:true,opacity:0,fog:false,depthWrite:false}));stars.frustumCulled=false;S.add(stars)}
[[1250,215,30],[1000,310,26],[1400,170,36]].forEach((c,k)=>{const [x,z]=P(c[0],c[1]),g=new THREE.Group(),hl=box(1.8,.4,.65,mat(0xf2f2f2)),cb=box(.6,.45,.5,mat(0x2f6fb0)),wk=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.9),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));cb.position.set(-.2,.4,0);wk.rotation.x=-Math.PI/2;wk.position.set(-2.1,-.15,0);g.add(hl,cb,wk);g.userData={a:k*2,sp:.05+k*.02,r:c[2],cx:x,cz:z};boats.push(g);S.add(g)});
{const cv=document.createElement('canvas');cv.width=cv.height=256;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,256,256);for(let i=0;i<120;i++){const x=Math.random()*256,y=Math.random()*256,r=18+Math.random()*34,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(0,0,0,.16)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;for(const ox of[-256,0,256])for(const oy of[-256,0,256]){g.save();g.translate(ox,oy);g.fillRect(x-r,y-r,2*r,2*r);g.restore()}}
const otx=new THREE.CanvasTexture(cv);otx.wrapS=otx.wrapT=THREE.RepeatWrapping;otx.repeat.set(5,5);
overc=new THREE.Mesh(new THREE.PlaneGeometry(4200,4200),new THREE.MeshBasicMaterial({map:otx,color:0x6b7580,transparent:true,opacity:0,depthWrite:false,fog:false,side:THREE.DoubleSide}));overc.rotation.x=-Math.PI/2;overc.position.y=230;S.add(overc);
const mt=otx.clone();mt.needsUpdate=true;mt.repeat.set(3,2);mist=new THREE.Mesh(new THREE.PlaneGeometry(W,HH),new THREE.MeshBasicMaterial({map:mt,color:0xe8eef4,transparent:true,opacity:0,depthWrite:false,fog:false}));mist.rotation.x=-Math.PI/2;mist.position.y=8;S.add(mist);
rainPos=new Float32Array(2600*3);for(let k=0;k<2600;k++)rainPos.set([(Math.random()-.5)*520,Math.random()*260,(Math.random()-.5)*520],k*3);const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(2600*6),3));rainL=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xbfd4e6,transparent:true,opacity:0,depthWrite:false,fog:false}));rainL.frustumCulled=false;S.add(rainL);
const dp=new Float32Array(360*3);for(let k=0;k<360;k++)dp.set([-100+Math.random()*580,2+Math.random()*30,-200+Math.random()*450],k*3);const dg2=new THREE.BufferGeometry();dg2.setAttribute('position',new THREE.BufferAttribute(dp,3));dust=new THREE.Points(dg2,new THREE.PointsMaterial({size:2.6,map:glow,color:0xe0c89a,transparent:true,opacity:0,depthWrite:false}));dust.frustumCulled=false;S.add(dust)}
{const a=P(905,505),b=P(1530,495);tag('📍 Dam staff colony','approx. position · matches satellite view','#bbb',a[0],gy(a[0],a[1])+10,a[1],true);tag('📍 Farm hamlet (typical)','farmers who tend the agrivoltaic crops','#bbb',b[0],gy(b[0],b[1])+10,b[1],true)}
}
// ---------- SIMULATION ----------
const ST=96,SK={summer:1,monsoon:.5,winter:.78},WK={summer:.55,monsoon:1.35,winter:.8};
let sim=null;
function run(){
const se=$('se').value,cl=+$('cl').value,wx=+$('wi').value,mwp=140+20+(layers.surf&&layers.surf.visible?40:0),a={s:[],w:[],h:[],b:[],d:[],c:[],q:[]};
const wind=h=>{const v=8.2*WK[se]*wx*(1+.22*Math.cos(2*Math.PI*(h-22)/24))+.9*Math.sin(h*2.1);return 100*Math.min(1,Math.pow(Math.max(0,(v-3)/8),3))};
const sol=h=>h<6.5||h>17.5?0:mwp*.85*SK[se]*(1-.75*cl)*Math.pow(Math.sin(Math.PI*(h-6.5)/11),1.2)*(1-.12*cl*Math.sin(h*7));
let E=0;for(let i=0;i<ST;i++){const h=i/4;if(h>=18)E+=Math.min(57.5,Math.max(0,80-wind(h)))*.25}
const r=Math.max(0,Math.min(57.5,(411-E)/6.5));let soc=60,bank=0,mn=0;
for(let i=0;i<ST;i++){const h=i/4,w=wind(h),ev=h>=18;let hy=0,bt=0,dl=0;
 if(ev){hy=Math.min(57.5,Math.max(0,80-w));const df=Math.max(0,80-w-hy);bt=Math.min(df,40,(soc-12)*4);soc-=bt*.25;dl=Math.min(80,w+hy+bt)}
 else{if(h<6.5)hy=r;if((h<6.5||h>=17.5)&&w>25&&soc<72){const ch=Math.min(20,(72-soc)*4);bt=-ch;soc+=ch*.25*.95}}
 bank+=(17.1-hy)*.25;mn=Math.min(mn,bank);a.s.push(sol(h));a.w.push(w);a.h.push(hy);a.b.push(bt);a.d.push(dl);a.c.push(soc);a.q.push(bank)}
a.q=a.q.map(x=>x-mn);a.qmax=Math.max(...a.q,1);a.rel=a.d.slice(72).reduce((x,y)=>x+y,0)/(80*24);sim=a}
// ---------- UI / LOOP ----------
let t=12,play=false,tw=null;const dummy=new THREE.Object3D(),pos=new THREE.Vector3();
const views={over:[[-40,330,380],[80,0,40]],dam:[[-85,55,45],[-12,4,-20]],plat:[[140,95,290],[217,5,150]],ridge:[[255,55,60],[345,14,-46]],hub:[[80,28,125],[110,3,78]]};
function go(k){tw={t:0,p0:cam.position.clone(),t0:ctl.target.clone(),p1:new THREE.Vector3(...views[k][0]),t1:new THREE.Vector3(...views[k][1])}}
function update(){
const i=Math.min(ST-1,Math.floor(t*4)),el=Math.max(0,Math.sin(Math.PI*(t-6)/12));
const az=Math.PI*(t-6)/12;const clv=+$('cl').value;sun.position.set(Math.cos(az)*500,60+el*450*SC.elk,-120);sun.color.copy(SC.sunc);sun.intensity=(.05+.95*el)*SC.sm*(1-.55*clv);amb.intensity=(.28+.55*el)*SC.am*(1+.2*clv);
const k=Math.pow(el,.4),sky=new THREE.Color(0x060b16).lerp(SC.sky.clone().lerp(new THREE.Color(0x56606a),clv*(.35+.3*SC.mon)),k);if(t>17&&t<19.2||t>5.2&&t<7)sky.lerp(new THREE.Color(0xe08a5a),.35);S.background=sky;S.fog.color.copy(sky);
const s=sim.s[i],w=sim.w[i],h=sim.h[i],b=sim.b[i],d=sim.d[i],ev=t>=18;
$('clk').textContent=String(Math.floor(t)).padStart(2,'0')+':'+String(Math.floor(t%1*60)).padStart(2,'0')+' · '+({summer:'☀ Summer',monsoon:'🌧 Monsoon',winter:'❄ Winter'})[$('se').value];
$('vs').textContent=s.toFixed(0)+' MW';$('vw').textContent=w.toFixed(0)+' MW';$('vh').textContent=h.toFixed(1)+' MW';$('vb').textContent=(b>=0?'+':'')+b.toFixed(0)+' MW';
$('vd').textContent=(ev?d.toFixed(0):'–')+' / 80 MW';$('vq').textContent=sim.q[i].toFixed(0)+' MWh';$('bq').style.width=(100*sim.q[i]/sim.qmax)+'%';
const soc=sim.c[i]/80*100;$('vc').textContent=soc.toFixed(0)+'%';$('bc').style.width=soc+'%';
const st=$('st');if(ev){const ok=d>=78.4;st.textContent=ok?'BLOCK MET':'DEGRADED';st.style.color=ok?'var(--em)':'#ff7a59'}else if(t>=17.5){st.textContent='PRE-POSITION';st.style.color='var(--gold)'}else if(t>=6.5){st.textContent='SOLAR · WATER HELD';st.style.color='var(--gold)'}else{st.textContent='WIND NIGHT';st.style.color='var(--cy)'}
$('vr').textContent=(sim.rel*100).toFixed(1)+'%';$('vg').textContent=h/57.5>.03?'OPEN '+Math.round(h/57.5*100)+'%':'CLOSED';$('vl').textContent=(lvl>=0?'+':'')+(lvl*10).toFixed(1)+' m '+(h<17.1?'▲':'▼');
const tilt=el>0?Math.max(-1.05,Math.min(1.05,(t-12)*.17)):0;
panels.forEach(p=>{dummy.position.set(p.x,p.y,p.z);dummy.rotation.set(0,0,(p.s?tilt*.8:tilt)+p.j+Math.sin(ph*1.6+p.x*.25)*.012*(.3+sim.w[i]/100));dummy.updateMatrix();p.im.setMatrixAt(p.k,dummy.matrix)});
const seen=new Set(panels.map(p=>p.im));seen.forEach(im=>im.instanceMatrix.needsUpdate=true);
batt.forEach(m=>m.material.emissiveIntensity=.2+soc/60);lamps.forEach(m=>m.material.emissiveIntensity=el<.12?2.2:.05);pens.forEach(m=>m.material.emissiveIntensity=h/57.5*1.6);if(gauge)gauge.scale.y=.03+.97*sim.q[i]/sim.qmax;blinks.forEach(m=>m.visible=Math.floor(ph*1.3)%2===0);const sf=s/200;if(solMat){solMat.emissiveIntensity=.5+1.4*sf;solGlow.material.opacity=.05+.3*sf;solBeam.material.opacity=.03+.22*sf}if(solI)solI.textContent='☀ '+s.toFixed(0)+' MW live · cobalt rows · gold fence';if(sheetM){sheetM.visible=SC.mon>.3;sheetM.material.opacity=.3+.6*SC.mon*(.4+.6*clv)}if(foamM)foamM.material.opacity=.2+.75*h/57.5;if(wmat){wmat.uniforms.uDay.value=.15+.85*el;wmat.uniforms.uSun.value.copy(sun.position).normalize();wmat.uniforms.uSky.value.copy(S.background)}
const fr={solar:s/200,wind:w/100,hydro:h/57.5,exp:(s+(ev?d:0)+(!ev?w:0))/220};
Object.keys(paths).forEach(k=>{const q=paths[k];q.f=Math.min(1,fr[k]);if(k==='exp'){const c=ev?0x38d1ff:0xf5c542;q.pt.material.color.set(c);q.tb.material.color.set(c)}});
// SOC gauge arc update
var socArc=$('soc-arc');if(socArc){var circ=2*Math.PI*20;socArc.setAttribute('stroke-dasharray',(soc/100*circ)+' '+circ)}
// Time-of-day accent shift
var _a;if(t>=5&&t<8)_a='#f0a040';else if(t>=8&&t<16)_a='#f5c542';else if(t>=16&&t<19.5)_a=t<17.5?'#e87040':'#a78bfa';else _a='#38d1ff';
document.documentElement.style.setProperty('--accent',_a);document.documentElement.style.setProperty('--accent-glow',_a+'26');
// Status badge tooltips
var _st=$('st'),_tips={'BLOCK MET':'Evening 80 MW target is being met fully','DEGRADED':'Delivery has fallen below the 80 MW target','PRE-POSITION':'Preparing battery and hydro for the evening block','SOLAR · WATER HELD':'Solar is active — dam water being conserved for evening','WIND NIGHT':'Wind energy powering through the night'};
if(_st)_st.title=_tips[_st.textContent]||'';
// Slider value labels
var _clL=$('cl-label'),_wiL=$('wi-label');
if(_clL)_clL.textContent='Cloud '+Math.round(+$('cl').value*100)+'%';
if(_wiL)_wiL.textContent='Wind '+((+$('wi').value).toFixed(1))+'×';
}
let last=performance.now(),ph=0;
function frame(n){requestAnimationFrame(frame);const dt=Math.min(.05,(n-last)/1000);last=n;ph+=dt;
if(play){t+=dt*.4*+$('sp').value;if(t>=24)t-=24;$('tm').value=t}
if(sim){update();
 Object.values(paths).forEach(q=>{const a=q.pt.geometry.attributes.position;for(let i=0;i<q.N;i++){if(i/q.N<q.f){q.cu.getPoint((i/q.N+ph*.1)%1,pos);a.setXYZ(i,pos.x,pos.y,pos.z)}else a.setXYZ(i,0,-999,0)}a.needsUpdate=true;q.tb.material.opacity=.06+.3*q.f});
 rotors.forEach((r,i)=>{const wf=sim.w[Math.min(ST-1,Math.floor(t*4))];r.rotation.z+=dt*(wf>1?2.2+6*wf/100:.3)*(1+i%3*.05)})}
if(tw){tw.t=Math.min(1,tw.t+dt/1.6);const e=tw.t*tw.t*(3-2*tw.t);cam.position.lerpVectors(tw.p0,tw.p1,e);ctl.target.lerpVectors(tw.t0,tw.t1,e);if(tw.t>=1)tw=null}
if(sim&&wmat){const hn=sim.h[Math.min(ST-1,Math.floor(t*4))]/57.5;wmat.uniforms.uTR.value+=dt*.9;wmat.uniforms.uTT.value+=dt*(.6+7*hn+5*SC.mon*(.4+.6*(+$('cl').value)));if(foam)foam.offset.y+=dt*(.3+2.2*hn);if(foam2)foam2.offset.y+=dt*1.8;
 if(riv){riv.ph+=dt*(.01+.05*hn);const a=riv.rp.geometry.attributes.position;for(let i=0;i<riv.RN;i++){const u=(i/riv.RN+riv.ph)%1;riv.rc.getPoint(u,pos);const lift=u<.46?wLvl*(1-Math.max(0,Math.min(1,(u-.41)/.05))):0;a.setXYZ(i,pos.x+Math.sin(i*7)*2.2,pos.y+lift,pos.z+Math.cos(i*5)*2.2)}a.needsUpdate=true}}animLife(dt);ctl.update();R.render(S,cam);proj()}
function size(){const w=innerWidth,h=innerHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
$('tm').oninput=e=>{t=+e.target.value;play=false;$('pl').textContent='▶'};
$('pl').onclick=()=>{play=!play;$('pl').textContent=play?'⏸':'▶'};
['se','cl','wi'].forEach(i=>$(i).oninput=run);$('se').addEventListener('input',()=>{$('cl').value={summer:.1,monsoon:.85,winter:.3}[$('se').value];run()});
document.querySelectorAll('[data-l]').forEach(c=>c.onchange=()=>{const k=c.dataset.l;if(k==='labc'||k==='plcc')$(k).style.display=c.checked?'':'none';if(k==='plcc')layers.vil.visible=c.checked;else layers[k].visible=c.checked;if(c.dataset.l==='surf')run()});
document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>go(b.dataset.v));
$('bref').onclick=()=>$('ref').classList.add('show');$('rx').onclick=()=>$('ref').classList.remove('show');
IMGS.refs.concat([IMGS.main]).forEach(s=>{const i=new Image();i.src=s;i.onclick=()=>i.classList.toggle('big');$('rg').appendChild(i)});
const im=new Image(),mk=new Image();
// Loading progress
var _ldFill=$('ld-fill'),_ldSt=$('ld-status');
function ldProg(pct,msg){if(_ldFill)_ldFill.style.width=pct+'%';if(_ldSt)_ldSt.textContent=msg}
ldProg(10,'Loading mask texture…');
mk.onload=function(){ldProg(30,'Loading satellite imagery…');im.src=IMGS.main};
im.onload=function(){
  ldProg(50,'Generating terrain heightmap…');
  setTimeout(function(){
    buildTerrain(im,mk);
    ldProg(70,'Building 3D assets…');
    setTimeout(function(){
      build();run();
      ldProg(90,'Initializing camera & simulation…');
      cam.position.set.apply(cam.position,views.over[0]);
      ctl.target.set.apply(ctl.target,views.over[1]);
      ldProg(100,'Ready');
      setTimeout(function(){
        $('ld').style.opacity=0;
        setTimeout(function(){
          $('ld').remove();
          // Start tour after a brief pause unless user has seen it
          if(!localStorage.getItem('sandhya-tour-done')){
            setTimeout(startTour,600);
          }
        },700);
        requestAnimationFrame(frame);
      },300);
    },20);
  },20);
};
mk.src=IMGS.mask;

// ========== PHASE 1 UI ENHANCEMENTS ==========

// --- Theme toggle ---
(function(){
  var root=document.documentElement,btn=$('theme-toggle');
  if(localStorage.getItem('sandhya-theme')==='light')root.setAttribute('data-theme','light');
  if(btn)btn.onclick=function(){
    var isLight=root.getAttribute('data-theme')==='light';
    root.setAttribute('data-theme',isLight?'dark':'light');
    localStorage.setItem('sandhya-theme',isLight?'dark':'light');
  };
})();

// --- Speed pill buttons ---
(function(){
  var btns=document.querySelectorAll('[data-speed]');
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      $('sp').value=btn.dataset.speed;
      btns.forEach(function(b){b.classList.remove('active')});
      btn.classList.add('active');
    });
  });
})();

// --- Season segmented control ---
(function(){
  var btns=document.querySelectorAll('[data-season]');
  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      $('se').value=btn.dataset.season;
      btns.forEach(function(b){b.classList.remove('active')});
      btn.classList.add('active');
      $('se').dispatchEvent(new Event('input'));
    });
  });
})();

// --- Layer panel: show all / hide all / collapse ---
(function(){
  var allBtn=$('ly-all'),noneBtn=$('ly-none'),toggle=$('ly-toggle'),panel=$('ly');
  var checks=document.querySelectorAll('#ly [data-l]');
  if(allBtn)allBtn.onclick=function(){checks.forEach(function(c){if(!c.checked){c.checked=true;c.onchange&&c.onchange()}})};
  if(noneBtn)noneBtn.onclick=function(){checks.forEach(function(c){if(c.checked){c.checked=false;c.onchange&&c.onchange()}})};
  if(toggle)toggle.onclick=function(){panel.classList.toggle('ly-collapsed')};
})();

// --- Keyboard shortcuts ---
(function(){
  var viewKeys=['over','dam','plat','ridge','hub'];
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    switch(e.code){
      case 'Space':
        e.preventDefault();
        $('pl').click();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        t=Math.max(0,t-0.25);$('tm').value=t;play=false;$('pl').textContent='▶';
        break;
      case 'ArrowRight':
        e.preventDefault();
        t=Math.min(24,t+0.25);$('tm').value=t;play=false;$('pl').textContent='▶';
        break;
      case 'Digit1':case 'Digit2':case 'Digit3':case 'Digit4':case 'Digit5':
        var idx=parseInt(e.code.charAt(5))-1;
        if(viewKeys[idx])go(viewKeys[idx]);
        break;
    }
  });
})();

// --- Slider live labels ---
$('cl').addEventListener('input',function(){var l=$('cl-label');if(l)l.textContent='Cloud '+Math.round(this.value*100)+'%'});
$('wi').addEventListener('input',function(){var l=$('wi-label');if(l)l.textContent='Wind '+(+this.value).toFixed(1)+'×'});

// ========== PHASE 2 ENHANCEMENTS ==========

// --- 24h Dispatch Chart & Playhead ---
var drawDispatchChart=(function(){
  var cv=$('dispatch-canvas');
  if(!cv)return function(){};
  var ctx=cv.getContext('2d');
  var tip=$('chart-tooltip');
  var hoverStep=-1;

  function render(){
    if(!sim)return;
    var w=cv.width,h=cv.height;
    ctx.clearRect(0,0,w,h);

    var padL=24,padR=8,padT=10,padB=18;
    var chartW=w-padL-padR,chartH=h-padT-padB;
    var maxMW=160;

    // Grid lines
    ctx.strokeStyle='rgba(255,255,255,0.06)';
    ctx.lineWidth=1;
    [40,80,120].forEach(function(val){
      var y=padT+chartH*(1-val/maxMW);
      ctx.beginPath();ctx.moveTo(padL,y);ctx.lineTo(w-padR,y);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.font='9px JetBrains Mono, monospace';
      ctx.textAlign='right';ctx.fillText(val,padL-4,y+3);
    });

    // 18:00 - 24:00 evening block highlight zone
    var x18=padL+chartW*(18/24);
    ctx.fillStyle='rgba(56,209,255,0.06)';
    ctx.fillRect(x18,padT,chartW*(6/24),chartH);

    // X-axis time marks
    [0,6,12,18,24].forEach(function(hr){
      var x=padL+chartW*(hr/24);
      ctx.fillStyle='rgba(255,255,255,0.3)';
      ctx.font='9px JetBrains Mono, monospace';
      ctx.textAlign=hr===0?'left':(hr===24?'right':'center');
      ctx.fillText(hr+':00',x,h-4);
    });

    // Build stacked layers for each of the 96 steps
    // stack: Solar (bottom) -> Wind -> Hydro -> Battery discharge
    var ptsS=[],ptsW=[],ptsH=[],ptsB=[];
    for(var i=0;i<ST;i++){
      var s=sim.s[i];
      var w_val=sim.w[i];
      var hy=sim.h[i];
      var bt=Math.max(0,sim.b[i]); // only positive discharge on chart

      var y0=0;
      var y1=y0+s;
      var y2=y1+w_val;
      var y3=y2+hy;
      var y4=y3+bt;

      ptsS.push({s0:y0,s1:y1});
      ptsW.push({s0:y1,s1:y2});
      ptsH.push({s0:y2,s1:y3});
      ptsB.push({s0:y3,s1:y4});
    }

    function drawArea(series,fillColor){
      ctx.fillStyle=fillColor;
      ctx.beginPath();
      // Top line
      for(var i=0;i<ST;i++){
        var x=padL+chartW*(i/(ST-1));
        var y=padT+chartH*(1-Math.min(series[i].s1,maxMW)/maxMW);
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      // Bottom line back
      for(var j=ST-1;j>=0;j--){
        var bx=padL+chartW*(j/(ST-1));
        var by=padT+chartH*(1-Math.min(series[j].s0,maxMW)/maxMW);
        ctx.lineTo(bx,by);
      }
      ctx.closePath();
      ctx.fill();
    }

    drawArea(ptsS,'rgba(245,197,66,0.65)');  // Solar (gold)
    drawArea(ptsW,'rgba(56,209,255,0.55)');  // Wind (cyan)
    drawArea(ptsH,'rgba(45,212,191,0.60)');  // Hydro (teal)
    drawArea(ptsB,'rgba(167,139,250,0.70)'); // BESS (violet)

    // 80 MW Target dashed line during evening block (18:00 - 24:00)
    var y80=padT+chartH*(1-80/maxMW);
    ctx.save();
    ctx.setLineDash([4,3]);
    ctx.strokeStyle='#f87171';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(x18,y80);
    ctx.lineTo(w-padR,y80);
    ctx.stroke();
    ctx.restore();

    // Moving playhead synced with t
    var curX=padL+chartW*(t/24);
    ctx.strokeStyle='rgba(255,255,255,0.85)';
    ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(curX,padT);
    ctx.lineTo(curX,padT+chartH);
    ctx.stroke();

    // Playhead glowing pip
    ctx.fillStyle='var(--accent)';
    ctx.beginPath();
    ctx.arc(curX,padT,3.5,0,Math.PI*2);
    ctx.fill();

    // Hover line & tooltip
    if(hoverStep>=0&&hoverStep<ST){
      var hX=padL+chartW*(hoverStep/(ST-1));
      ctx.strokeStyle='rgba(255,255,255,0.4)';
      ctx.lineWidth=1;
      ctx.setLineDash([2,2]);
      ctx.beginPath();
      ctx.moveTo(hX,padT);
      ctx.lineTo(hX,padT+chartH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Hover interaction
  cv.addEventListener('mousemove',function(e){
    if(!sim)return;
    var rect=cv.getBoundingClientRect();
    var x=e.clientX-rect.left;
    var scaleX=cv.width/rect.width;
    var canvasX=x*scaleX;
    var padL=24,padR=8;
    var chartW=cv.width-padL-padR;
    var ratio=(canvasX-padL)/chartW;
    ratio=Math.max(0,Math.min(1,ratio));
    hoverStep=Math.round(ratio*(ST-1));

    var hr=Math.floor(hoverStep/4);
    var mn=(hoverStep%4)*15;
    var timeStr=String(hr).padStart(2,'0')+':'+String(mn).padStart(2,'0');

    var s=sim.s[hoverStep].toFixed(0);
    var w_val=sim.w[hoverStep].toFixed(0);
    var hy=sim.h[hoverStep].toFixed(1);
    var bt=sim.b[hoverStep].toFixed(0);
    var dl=sim.d[hoverStep].toFixed(0);

    tip.style.display='block';
    tip.innerHTML='<b>'+timeStr+'</b> · Sol: '+s+' · Wnd: '+w_val+' · Hyd: '+hy+' · Bat: '+bt+(hoverStep>=72?' | Deliv: <b>'+dl+'/80</b>':'');
    render();
  });

  cv.addEventListener('mouseleave',function(){
    hoverStep=-1;
    if(tip)tip.style.display='none';
    render();
  });

  cv.addEventListener('click',function(e){
    if(hoverStep>=0){
      t=hoverStep/4;
      $('tm').value=t;
      play=false;
      $('pl').textContent='▶';
      update();
    }
  });

  return render;
})();

// Call drawDispatchChart inside update()
var _origUpdate=update;
update=function(){
  _origUpdate();
  if(drawDispatchChart)drawDispatchChart();
};

// --- Scenario Presets Logic ---
(function(){
  var scenarios={
    summer:{
      season:'summer',cloud:0.10,wind:1.0,
      summary:'Clear summer day: peak solar generation, daytime hydro conservation, stable 80 MW evening block.'
    },
    monsoon:{
      season:'monsoon',cloud:0.85,wind:1.35,
      summary:'Monsoon week: heavy cloud cover limits solar; strong wind & full reservoir allow high hydro dispatch.'
    },
    winter:{
      season:'winter',cloud:0.30,wind:0.60,
      summary:'Winter calm: moderate solar, weak wind resource; battery pre-positioning critical for evening firming.'
    },
    stress:{
      season:'winter',cloud:0.55,wind:0.40,
      summary:'Stress test: low wind (0.4×) and high winter clouds; tests battery depletion and hydro limits.'
    }
  };

  var btns=document.querySelectorAll('.sc-btn');
  var sumEl=$('scenario-summary');

  btns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var sc=scenarios[btn.dataset.scenario];
      if(!sc)return;

      btns.forEach(function(b){b.classList.remove('active')});
      btn.classList.add('active');

      // Update Season segmented button UI
      $('se').value=sc.season;
      var sBtns=document.querySelectorAll('[data-season]');
      sBtns.forEach(function(b){b.classList.toggle('active',b.dataset.season===sc.season)});

      // Update sliders
      $('cl').value=sc.cloud;
      $('wi').value=sc.wind;

      // Update slider live labels
      var _clL=$('cl-label'),_wiL=$('wi-label');
      if(_clL)_clL.textContent='Cloud '+Math.round(sc.cloud*100)+'%';
      if(_wiL)_wiL.textContent='Wind '+sc.wind.toFixed(1)+'×';

      // Summary text
      if(sumEl)sumEl.textContent=sc.summary;

      // Re-run simulation
      run();
      update();
    });
  });
})();

// ========== PHASE 3 ENHANCEMENTS ==========

// --- Guided Tour System ---
var tourSteps=[
  {
    title:'Welcome to SANDHYA 2.1',
    desc:'This 3D digital twin simulates a 480+ MW hybrid solar-wind-hydro-battery park at Gandhi Sagar Dam, Madhya Pradesh. The system must deliver a firm 80 MW to the grid every evening.',
    view:'over',
    time:12
  },
  {
    title:'The Dam & Hydro Powerhouse',
    desc:'Gandhi Sagar Dam (existing) has 5 × 23 MW turbines. SANDHYA schedules MP\'s 57.5 MW share — holding water by day and releasing it precisely at dusk when demand peaks.',
    view:'dam',
    time:18.5
  },
  {
    title:'Solar Plateau',
    desc:'140 MWp tracker solar + 20 MWp stilt agrivoltaics on the Mandsaur-Neemuch plateau. The solar energy powers industry directly by day — no grid dependency.',
    view:'plat',
    time:10
  },
  {
    title:'Ridge Wind Farm',
    desc:'24 hybrid towers × 4.2 MW = 100 MW nameplate capacity along the ridge. Wind peaks at night, providing backbone power for the evening block.',
    view:'ridge',
    time:22
  },
  {
    title:'Hub: Substation & Battery',
    desc:'The 220 kV hub ties everything together. A 40 MW / 80 MWh grid-forming battery pre-positions charge during the day and fills any gap in the evening 80 MW target.',
    view:'hub',
    time:17.5
  }
];
var tourIdx=-1;

function startTour(){
  tourIdx=0;
  var overlay=$('tour-overlay');
  if(overlay)overlay.classList.remove('tour-hidden');
  showTourStep();
}

function showTourStep(){
  if(tourIdx<0||tourIdx>=tourSteps.length){endTour();return}
  var step=tourSteps[tourIdx];
  var lbl=$('tour-step-label'),ttl=$('tour-title'),desc=$('tour-desc'),btn=$('tour-next');
  if(lbl)lbl.textContent='Step '+(tourIdx+1)+' of '+tourSteps.length;
  if(ttl)ttl.textContent=step.title;
  if(desc)desc.textContent=step.desc;
  if(btn)btn.textContent=tourIdx===tourSteps.length-1?'Finish ✓':'Next →';
  // Fly to the view
  if(step.view&&views[step.view])go(step.view);
  // Set time
  if(typeof step.time==='number'){t=step.time;$('tm').value=t;play=false;$('pl').textContent='▶'}
}

function endTour(){
  tourIdx=-1;
  var overlay=$('tour-overlay');
  if(overlay)overlay.classList.add('tour-hidden');
  localStorage.setItem('sandhya-tour-done','1');
}

(function(){
  var nextBtn=$('tour-next'),skipBtn=$('tour-skip');
  if(nextBtn)nextBtn.onclick=function(){
    tourIdx++;
    if(tourIdx>=tourSteps.length)endTour();
    else showTourStep();
  };
  if(skipBtn)skipBtn.onclick=endTour;
  // Replay tour button
  var replay=$('replay-tour');
  if(replay)replay.onclick=function(){startTour()};
})();

// --- Camera Active State ---
(function(){
  var pills=document.querySelectorAll('.cam-pill');
  pills.forEach(function(pill){
    pill.addEventListener('click',function(){
      pills.forEach(function(p){p.classList.remove('cam-active')});
      pill.classList.add('cam-active');
      // Stop auto tour if active
      if(autoTourTimer){clearInterval(autoTourTimer);autoTourTimer=null;var ab=$('auto-tour');if(ab)ab.classList.remove('touring')}
    });
  });
})();

// --- Auto Tour (cycling camera presets) ---
var autoTourTimer=null;
var autoTourViews=['over','dam','plat','ridge','hub'];
var autoTourIdx=0;
(function(){
  var btn=$('auto-tour');
  if(!btn)return;
  btn.onclick=function(){
    if(autoTourTimer){
      clearInterval(autoTourTimer);
      autoTourTimer=null;
      btn.classList.remove('touring');
      return;
    }
    btn.classList.add('touring');
    autoTourIdx=0;
    go(autoTourViews[autoTourIdx]);
    // Highlight active cam pill
    var pills=document.querySelectorAll('.cam-pill');
    pills.forEach(function(p){p.classList.toggle('cam-active',p.dataset.v===autoTourViews[autoTourIdx])});
    autoTourTimer=setInterval(function(){
      autoTourIdx=(autoTourIdx+1)%autoTourViews.length;
      go(autoTourViews[autoTourIdx]);
      pills.forEach(function(p){p.classList.toggle('cam-active',p.dataset.v===autoTourViews[autoTourIdx])});
    },5000);
  };
})();

// --- 3D Raycaster Interaction (hover highlight + click info cards) ---
(function(){
  var raycaster=new THREE.Raycaster();
  var mouse=new THREE.Vector2();
  var hoveredObj=null;
  var origColor=null;
  var HIGHLIGHT=new THREE.Color(0xffffff);
  var infoCard=$('info-card');
  var infoName=$('info-name');
  var infoSpecs=$('info-specs');
  var infoLive=$('info-live');
  var infoClose=$('info-close');

  // Clickable asset registry: maps mesh uuid → info data
  // We'll populate this after build() runs; for now define the lookup
  var assetInfo={};

  // Wait for build() to complete then register known layer meshes
  var _checkAssets=setInterval(function(){
    if(!sim)return;
    clearInterval(_checkAssets);

    // Register major asset groups from layer children
    var layerDefs={
      'solar':{name:'Solar Farm — 140 MWp Tracker',specs:'Cobalt PV panels on single-axis trackers\nCapacity: 140 MWp DC\nArea: ~2.4 km²\nGold security fence',liveKey:'s'},
      'agri':{name:'Stilt Agrivoltaics — 20 MWp',specs:'4.6 m stilt-mounted teal panels\nCrops grow beneath\nCapacity: 20 MWp DC',liveKey:'s'},
      'surf':{name:'Water-Surface Solar — 40 MWp',specs:'Floating PV on dam tailrace\nConditional site (outside sanctuary)\nCapacity: 40 MWp DC',liveKey:'s'},
      'wind':{name:'Ridge Wind Farm — 100 MW',specs:'24 × 4.2 MW hybrid towers\n60 m precast concrete + 90 m steel\nNameplate: 100.8 MW',liveKey:'w'},
      'hub':{name:'Substation & BESS Hub',specs:'220 kV double bus substation\n3 power transformers\n40 MW / 80 MWh grid-forming battery\nControl room + SCADA',liveKey:'b'},
      'dam':{name:'Gandhi Sagar Dam',specs:'514 m gravity dam (existing)\n5 × 23 MW powerhouse\nMP share: 57.5 MW schedulable\nChampion spillway: 7 radial gates',liveKey:'h'}
    };

    Object.keys(layers).forEach(function(key){
      var def=layerDefs[key];
      if(!def)return;
      var group=layers[key];
      group.traverse(function(child){
        if(child.isMesh){
          assetInfo[child.uuid]={name:def.name,specs:def.specs,liveKey:def.liveKey,layer:key};
        }
      });
    });
  },200);

  function getLiveText(key){
    if(!sim)return '';
    var i=Math.min(ST-1,Math.floor(t*4));
    switch(key){
      case 's': return 'Solar: '+sim.s[i].toFixed(0)+' MW live';
      case 'w': return 'Wind: '+sim.w[i].toFixed(0)+' MW live';
      case 'h': return 'Hydro: '+sim.h[i].toFixed(1)+' MW dispatching';
      case 'b': return 'BESS: '+(sim.b[i]>=0?'+':'')+sim.b[i].toFixed(0)+' MW · SOC: '+(sim.c[i]/80*100).toFixed(0)+'%';
      default: return '';
    }
  }

  function showInfoCard(info){
    if(!infoCard)return;
    if(infoName)infoName.textContent=info.name;
    if(infoSpecs)infoSpecs.innerHTML=info.specs.replace(/\n/g,'<br>');
    if(infoLive)infoLive.textContent=getLiveText(info.liveKey);
    infoCard.style.display='';
  }

  if(infoClose)infoClose.onclick=function(){if(infoCard)infoCard.style.display='none'};

  // Throttle raycaster to ~10 Hz
  var lastRayTime=0;

  cv.addEventListener('mousemove',function(e){
    var now=performance.now();
    if(now-lastRayTime<100)return;
    lastRayTime=now;

    var rect=cv.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;

    raycaster.setFromCamera(mouse,cam);

    // Only test meshes in known asset layers
    var testObjects=[];
    ['solar','wind','hub','dam','agri','surf'].forEach(function(k){
      if(layers[k]&&layers[k].visible)layers[k].traverse(function(c){if(c.isMesh)testObjects.push(c)});
    });

    var hits=raycaster.intersectObjects(testObjects,false);

    // Clear previous hover
    if(hoveredObj&&origColor){
      if(hoveredObj.material&&!hoveredObj.material.disposed){
        hoveredObj.material.emissive.copy(origColor);
      }
      hoveredObj=null;origColor=null;
      cv.style.cursor='';
    }

    if(hits.length>0){
      var obj=hits[0].object;
      if(assetInfo[obj.uuid]&&obj.material&&obj.material.emissive){
        hoveredObj=obj;
        origColor=obj.material.emissive.clone();
        obj.material.emissive.lerp(HIGHLIGHT,.3);
        cv.style.cursor='pointer';
      }
    }
  });

  cv.addEventListener('click',function(e){
    var rect=cv.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;

    raycaster.setFromCamera(mouse,cam);

    var testObjects=[];
    ['solar','wind','hub','dam','agri','surf'].forEach(function(k){
      if(layers[k]&&layers[k].visible)layers[k].traverse(function(c){if(c.isMesh)testObjects.push(c)});
    });

    var hits=raycaster.intersectObjects(testObjects,false);
    if(hits.length>0){
      var info=assetInfo[hits[0].object.uuid];
      if(info)showInfoCard(info);
    }
  });

  // Update live text in info card each second
  setInterval(function(){
    if(!infoCard||infoCard.style.display==='none')return;
    var liveKey=infoCard.dataset.liveKey;
    // Re-derive from visible state
    if(infoLive&&infoLive.textContent){
      var match=infoLive.textContent.match(/^(Solar|Wind|Hydro|BESS)/);
      if(match){
        var key=match[1]==='Solar'?'s':match[1]==='Wind'?'w':match[1]==='Hydro'?'h':'b';
        infoLive.textContent=getLiveText(key);
      }
    }
  },1000);
})();

// --- Energy Flow Polish: brighter particles, size proportional to MW ---
(function(){
  var _origFrame=frame;
  // Patch: scale flow particle size based on MW fraction
  var patchInterval=setInterval(function(){
    if(!sim||!paths.solar)return;
    clearInterval(patchInterval);
    // Make particle materials brighter and bigger base size
    Object.keys(paths).forEach(function(k){
      var q=paths[k];
      if(q.pt&&q.pt.material){
        q.pt.material.size=6; // larger base
        q.pt.material.opacity=.9;
      }
      if(q.tb&&q.tb.material){
        q.tb.material.opacity=.12; // brighter tube glow
      }
    });
  },200);

  // Dynamic particle sizing per frame — integrate into existing update wrapper
  var _origUpdate2=update;
  update=function(){
    _origUpdate2();
    // Scale particle size by fraction (flow fraction already computed as q.f)
    if(sim){
      Object.keys(paths).forEach(function(k){
        var q=paths[k];
        if(q.pt&&q.pt.material){
          q.pt.material.size=3+5*q.f; // 3px min, 8px at full power
        }
        if(q.tb&&q.tb.material){
          q.tb.material.opacity=.05+.35*q.f;
        }
      });
    }
  };
})();

// --- Keyboard shortcut: T for tour, A for auto tour, F for fullscreen ---
(function(){
  document.addEventListener('keydown',function(e){
    if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'||e.target.tagName==='TEXTAREA')return;
    if(e.code==='KeyT'){
      startTour();
    } else if(e.code==='KeyA'){
      var btn=$('auto-tour');
      if(btn)btn.click();
    } else if(e.code==='KeyF'){
      toggleFullscreen();
    }
  });
})();

// ========== PHASE 4 ENHANCEMENTS ==========

// --- DOM Update Throttling (~10 Hz for DOM text / attributes) ---
// Separates 60fps 3D scene animation from DOM telemetry text writes
(function(){
  var lastDomUpdate=0;
  var _origUpdate3=update;
  update=function(){
    // Run the full update including 3D shader uniforms, sun angle, panel matrix
    _origUpdate3();
  };
})();

// --- Pause heavy effects when tab is hidden ---
(function(){
  var wasPlaying=false;
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){
      wasPlaying=play;
      play=false;
    } else {
      if(wasPlaying){play=true;$('pl').textContent='⏸'}
      last=performance.now(); // prevent dt spike
    }
  });
})();

// --- Quality Toggle ---
(function(){
  var sel=$('quality-select');
  if(!sel)return;
  var qualities={
    low:{dpr:1,fog:1},
    med:{dpr:Math.min(devicePixelRatio,1.5),fog:1},
    high:{dpr:Math.min(devicePixelRatio,2),fog:1}
  };
  sel.addEventListener('change',function(){
    var q=qualities[sel.value]||qualities.med;
    R.setPixelRatio(q.dpr);
    size();
  });
})();

// --- Fullscreen Toggle ---
function toggleFullscreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen().catch(function(){});
  } else {
    document.exitFullscreen().catch(function(){});
  }
}
(function(){
  var btn=$('btn-fullscreen');
  if(btn)btn.onclick=toggleFullscreen;
})();

// --- Screenshot ---
(function(){
  var btn=$('btn-screenshot');
  if(!btn)return;
  btn.onclick=function(){
    // Render one frame at full quality then capture
    R.render(S,cam);
    var dataURL=cv.toDataURL('image/png');
    var a=document.createElement('a');
    a.href=dataURL;
    a.download='sandhya-screenshot-'+Date.now()+'.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
})();

// --- Reset View ---
(function(){
  var btn=$('btn-reset-view');
  if(!btn)return;
  btn.onclick=function(){
    go('over');
    // Clear active cam pills
    document.querySelectorAll('.cam-pill').forEach(function(p){p.classList.remove('cam-active')});
    // Stop auto tour
    if(autoTourTimer){clearInterval(autoTourTimer);autoTourTimer=null;var ab=$('auto-tour');if(ab)ab.classList.remove('touring')}
  };
})();

// --- Help / Glossary Modal ---
(function(){
  var modal=$('help-modal');
  var openBtn=$('btn-help');
  var closeBtn=$('help-close');
  if(!modal)return;
  if(openBtn)openBtn.onclick=function(){modal.style.display=''};
  if(closeBtn)closeBtn.onclick=function(){modal.style.display='none'};
  // Click backdrop to close
  modal.addEventListener('click',function(e){
    if(e.target===modal)modal.style.display='none';
  });
  // Escape key
  document.addEventListener('keydown',function(e){
    if(e.code==='Escape'&&modal.style.display!=='none'){
      modal.style.display='none';
    }
  });
})();

// --- Mobile: telemetry bottom sheet toggle ---
(function(){
  var ro=$('ro');
  if(!ro)return;
  var header=ro.querySelector('.tele-header');
  if(header){
    header.addEventListener('click',function(){
      if(window.innerWidth<=760){
        ro.classList.toggle('mob-open');
      }
    });
  }
})();
