import { buildNeutralMesh, MASSES } from '../manor-blueprint/manor.estate.neutral-blockout.mjs';
import { createCardClock } from './card-lifecycle-v1.mjs';

const HOME_IDENTITY_CYCLE_MS = 12000;
const SPECIMEN_ID = 'DOOR_EXPLORE_HOME_IDENTITY_SPATIAL_V2';
const PHASE4_MODULE = '../manor-blueprint/manor.estate.gothic-detail-phase4.mjs';
const clamp01 = x => Math.max(0, Math.min(1, Number(x) || 0));
const smooth01 = x => { x = clamp01(x); return x*x*(3-2*x); };
const lerp = (a,b,t) => a + (b-a)*t;
const finitePoint = p => Array.isArray(p) && p.length >= 3 && p.every(Number.isFinite);
const rgba = (rgb,a) => `rgba(${Math.round(rgb[0]*255)},${Math.round(rgb[1]*255)},${Math.round(rgb[2]*255)},${clamp01(a)})`;
const SUBSTANTIVE_ROLES = new Set(['great-house','west-wing','east-wing','central-crown-tower','old-core-tower','east-stair-tower','great-house-roof','great-house-cross-roof','west-wing-roof','east-wing-roof','central-crown-tower-crown','old-core-tower-crown','east-stair-tower-crown']);

function getHomeIdentityState(elapsedMs, variant='home', reduced=false) {
  const identity = variant === 'identity';
  if (reduced) return Object.freeze(identity
    ? { phase:'NETWORK', camera:.56, lights:.52, links:1, pulse:.68, settle:1 }
    : { phase:'LIVED', camera:.62, lights:1, links:0, pulse:.18, settle:1 });
  const t = (((elapsedMs % HOME_IDENTITY_CYCLE_MS) + HOME_IDENTITY_CYCLE_MS) % HOME_IDENTITY_CYCLE_MS) / HOME_IDENTITY_CYCLE_MS;
  let phase, camera=0, lights=0, links=0, pulse=0, settle=0;
  if (!identity) {
    if (t < .18) { phase='ARRIVAL'; camera=smooth01(t/.18)*.25; }
    else if (t < .42) { phase='APPROACH'; const p=smooth01((t-.18)/.24); camera=.25+.55*p; lights=.18*p; }
    else if (t < .64) { phase='LIGHT'; const p=smooth01((t-.42)/.22); camera=.8-.12*p; lights=.18+.82*p; pulse=.18*p; }
    else if (t < .84) { phase='LIVED'; const p=smooth01((t-.64)/.20); camera=.68-.08*p; lights=1; pulse=.18+.28*Math.sin(Math.PI*p); settle=p; }
    else { phase='RETURN'; const p=smooth01((t-.84)/.16); camera=.60*(1-p); lights=1-p; pulse=.18*(1-p); settle=1-p; }
  } else {
    if (t < .20) { phase='ROOT'; camera=smooth01(t/.20)*.28; lights=.24; }
    else if (t < .43) { phase='RESOLVE'; const p=smooth01((t-.20)/.23); camera=.28+.36*p; lights=.24+.24*p; links=.36*p; pulse=.12*p; }
    else if (t < .66) { phase='LINK'; const p=smooth01((t-.43)/.23); camera=.64-.08*p; lights=.48; links=.36+.64*p; pulse=.12+.58*p; }
    else if (t < .85) { phase='NETWORK'; const p=smooth01((t-.66)/.19); camera=.56+.05*Math.sin(Math.PI*p); lights=.48+.08*p; links=1; pulse=.70+.24*Math.sin(Math.PI*p); settle=p; }
    else { phase='RETURN'; const p=smooth01((t-.85)/.15); camera=.56*(1-p); lights=.56-.30*p; links=1-p; pulse=.70*(1-p); settle=1-p; }
  }
  return Object.freeze({phase,camera:clamp01(camera),lights:clamp01(lights),links:clamp01(links),pulse:clamp01(pulse),settle:clamp01(settle)});
}

function materialFor(mesh,state,variant){
  const role=String(mesh?.role||''), mat=String(mesh?.material||'');
  if(role==='interior-window-light') return {rgb:[1,.62,.2],alpha:.28+.72*state.lights,emissive:true};
  if(role.includes('window-reveal')||role.includes('portal-reveal')) return {rgb:[.08,.09,.11],alpha:.96};
  if(role.includes('roof')||role.includes('crown')) return {rgb:variant==='identity'?[.24,.27,.36]:[.24,.22,.19],alpha:1};
  if(role.includes('garden')) return {rgb:[.18,.28,.19],alpha:.7};
  if(role.includes('court')||role.includes('terrace')) return {rgb:[.34,.35,.34],alpha:.76};
  if(mat.includes('OLD')) return {rgb:[.43,.44,.46],alpha:1};
  if(mat.includes('LATER')) return {rgb:[.55,.56,.59],alpha:1};
  if(mat.includes('CARVED')) return {rgb:[.66,.64,.60],alpha:1};
  return {rgb:variant==='identity'?[.52,.56,.68]:[.60,.56,.48],alpha:1};
}
function rotatePoint(v,yaw,pitch,center){
  const x=v[0]-center[0], y=v[1]-center[1], z=v[2]-center[2];
  const cy=Math.cos(yaw),sy=Math.sin(yaw),x1=x*cy-z*sy,z1=x*sy+z*cy;
  const cp=Math.cos(pitch),sp=Math.sin(pitch);
  return [x1,y*cp-z1*sp,y*sp+z1*cp];
}
function normal(a,b,c){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;return[nx/l,ny/l,nz/l]}
function project(p,dist){const d=Math.max(24,dist-p[2]);return[p[0]/d,p[1]/d,p[2],d]}
function buildFrame(meshes,state,variant,w,h){
  const identity=variant==='identity', yaw=((identity?-26:-38)+state.camera*(identity?-11:15))*Math.PI/180, pitch=(identity?15:17)*Math.PI/180;
  const center=[0,8,7], dist=identity?92:96, tris=[], focus=[];
  for(const mesh of meshes||[]){
    const t=Array.isArray(mesh?.triangles)?mesh.triangles:[];
    for(let i=0;i+2<t.length;i+=3){
      if(!finitePoint(t[i])||!finitePoint(t[i+1])||!finitePoint(t[i+2])) continue;
      const a=rotatePoint(t[i],yaw,pitch,center),b=rotatePoint(t[i+1],yaw,pitch,center),c=rotatePoint(t[i+2],yaw,pitch,center);
      const pa=project(a,dist),pb=project(b,dist),pc=project(c,dist);
      if(!finitePoint(pa)||!finitePoint(pb)||!finitePoint(pc)) continue;
      const n=normal(a,b,c), light=.34+.66*clamp01(n[0]*-.35+n[1]*.72+n[2]*.56), m=materialFor(mesh,state,variant);
      tris.push({p:[pa,pb,pc],z:(a[2]+b[2]+c[2])/3,mesh,light,m});
      if(SUBSTANTIVE_ROLES.has(String(mesh.role||''))) focus.push(pa,pb,pc);
    }
  }
  const pts=(focus.length?focus:tris.flatMap(t=>t.p)).filter(finitePoint);
  if(!pts.length||!Number.isFinite(w)||!Number.isFinite(h)||w<2||h<2) return null;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const p of pts){minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);}
  if(![minX,maxX,minY,maxY].every(Number.isFinite)) return null;
  const sx=(w*.82)/Math.max(.0001,maxX-minX),sy=(h*.72)/Math.max(.0001,maxY-minY),s=Math.min(sx,sy);
  if(!Number.isFinite(s)||s<=0) return null;
  const ox=w*.5-(minX+maxX)*.5*s,oy=h*.50+(minY+maxY)*.5*s,map=p=>[ox+p[0]*s,oy-p[1]*s,p[2]];
  for(const tri of tris) tri.q=tri.p.map(map);
  tris.sort((a,b)=>a.z-b.z);
  return {tris,yaw,pitch,center,dist,s,ox,oy,map};
}
function drawRelations(ctx,frame,state){
  if(!frame||state.links<=.02)return;
  const root=MASSES.find(m=>m.id==='GH')?.center||[0,6,0],targets=MASSES.filter(m=>['WW','EW','CT','OC','ST','GHSE'].includes(m.id)).map(m=>m.center);
  const rp=frame.map(project(rotatePoint(root,frame.yaw,frame.pitch,frame.center),frame.dist));
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineWidth=1.35;
  targets.forEach((target,i)=>{const tp=frame.map(project(rotatePoint(target,frame.yaw,frame.pitch,frame.center),frame.dist)),phase=clamp01(state.links*1.35-i*.07);if(phase<=0)return;const mx=lerp(rp[0],tp[0],phase),my=lerp(rp[1],tp[1],phase);ctx.strokeStyle=`rgba(177,168,255,${.18+.62*phase})`;ctx.beginPath();ctx.moveTo(rp[0],rp[1]);ctx.lineTo(mx,my);ctx.stroke();ctx.fillStyle=`rgba(139,230,255,${.25+.70*phase})`;ctx.beginPath();ctx.arc(mx,my,2+1.8*state.pulse,0,Math.PI*2);ctx.fill();});
  ctx.restore();
}
function drawFallbackSilhouette(ctx,w,h,variant,state){
  const baseY=h*.66, cx=w*.5, unit=Math.min(w/42,h/24), stone=variant==='identity'?'rgba(130,145,190,.9)':'rgba(157,139,108,.92)', roof=variant==='identity'?'rgba(64,73,105,.98)':'rgba(69,61,49,.98)';
  ctx.save();ctx.translate(cx,baseY);
  const block=(x,y,bw,bh)=>{ctx.fillStyle=stone;ctx.fillRect(x*unit,-(y+bh)*unit,bw*unit,bh*unit);ctx.strokeStyle='rgba(255,244,215,.20)';ctx.strokeRect(x*unit,-(y+bh)*unit,bw*unit,bh*unit)};
  block(-7,0,14,8);block(-13,0,6,6);block(7,0,7,6);block(-2.3,0,4.6,13);block(-8.4,0,3.4,10);block(4.8,0,3.2,9);
  ctx.fillStyle=roof;const gable=(x,y,bw,rh)=>{ctx.beginPath();ctx.moveTo((x-bw/2)*unit,-y*unit);ctx.lineTo(x*unit,-(y+rh)*unit);ctx.lineTo((x+bw/2)*unit,-y*unit);ctx.closePath();ctx.fill()};gable(0,8,14,4);gable(-10,6,6,2.8);gable(10.5,6,7,2.8);
  if(state.lights>.08){ctx.fillStyle=`rgba(255,181,75,${.24+.70*state.lights})`;for(const [x,y] of [[-4,3],[-1,3],[2,3],[5,3],[-10,2],[10,2],[0,8]])ctx.fillRect((x-.35)*unit,-(y+.8)*unit,.7*unit,.8*unit)}
  ctx.restore();
}
function render(ctx,w,h,meshes,state,variant){
  ctx.clearRect(0,0,w,h);
  const sky=ctx.createRadialGradient(w*.52,h*.40,0,w*.52,h*.48,Math.max(w,h)*.72);sky.addColorStop(0,variant==='identity'?'rgba(82,88,148,.26)':'rgba(143,99,45,.24)');sky.addColorStop(1,'rgba(2,5,11,0)');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  const frame=buildFrame(meshes,state,variant,w,h);
  let drawn=0;
  if(frame){for(const tri of frame.tris){const {q,m,light}=tri;if(!q?.every(p=>Number.isFinite(p[0])&&Number.isFinite(p[1])))continue;ctx.beginPath();ctx.moveTo(q[0][0],q[0][1]);ctx.lineTo(q[1][0],q[1][1]);ctx.lineTo(q[2][0],q[2][1]);ctx.closePath();if(m.emissive){ctx.fillStyle=rgba(m.rgb,m.alpha);ctx.shadowColor='rgba(255,166,67,.86)';ctx.shadowBlur=8+11*state.lights}else{ctx.shadowBlur=0;ctx.fillStyle=rgba(m.rgb,m.alpha*(.70+.30*light))}ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=`rgba(244,232,207,${.05+.09*light})`;ctx.lineWidth=.55;ctx.stroke();drawn++;}}
  if(drawn===0) drawFallbackSilhouette(ctx,w,h,variant,state);
  if(variant==='identity'&&frame) drawRelations(ctx,frame,state);
  const vignette=ctx.createRadialGradient(w*.5,h*.48,Math.min(w,h)*.28,w*.5,h*.5,Math.max(w,h)*.76);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.46)');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
  return drawn;
}

function loadPhase4Detail(){
  return import(PHASE4_MODULE).then(mod=>{
    const audit=mod.auditPhase4();
    if(!audit?.passStatic) throw new Error('MIRROR_MANOR_PHASE4_AUDIT_FAILED');
    return {audit,manor:mod.buildPhase4DetailMesh()};
  }).catch(()=>null);
}

function mountHomeIdentity(root){
  if(typeof Element==='undefined'||!(root instanceof Element)||root.dataset.homeIdentityMounted==='true')return root?.__homeIdentityV2||null;
  const variant=root.dataset.homeIdentityVariant==='identity'?'identity':'home', neutral=buildNeutralMesh();
  let meshes=neutral.meshes, detailAudit=null, detailState='neutral-fallback';
  const canvas=document.createElement('canvas');canvas.className='home-identity-v2-canvas';canvas.setAttribute('aria-hidden','true');root.prepend(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw new Error('HOME_IDENTITY_CANVAS_UNAVAILABLE');
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false,clock=createCardClock(root);let active=true,raf=0,last=0,destroyed=false;
  function frame(now){if(destroyed)return;if(!active&&!reduced)return;if(!reduced&&now-last<30){raf=requestAnimationFrame(frame);return}last=now;const rect=root.getBoundingClientRect(),dpr=Math.min(1.25,globalThis.devicePixelRatio||1),W=Math.max(1,Math.round(rect.width*dpr)),H=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`}ctx.setTransform(dpr,0,0,dpr,0,0);const cardTime=clock.sample(now),state=getHomeIdentityState(cardTime.elapsedMs,variant,reduced),drawn=render(ctx,rect.width,rect.height,meshes,state,variant);root.dataset.homeIdentityPhase=state.phase;root.dataset.homeIdentityLifecycleGeneration=String(cardTime.generation);root.dataset.homeIdentityRendered='true';root.dataset.homeIdentityTriangleCount=String(drawn);root.dataset.homeIdentityDetail=detailState;if(active&&!reduced)raf=requestAnimationFrame(frame)}
  const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{active=!!entries[0]?.isIntersecting;cancelAnimationFrame(raf);if(active){frame(performance.now());if(!reduced)raf=requestAnimationFrame(frame)}},{threshold:.04}):null;
  io?.observe(root);frame(performance.now());if(!reduced)raf=requestAnimationFrame(frame);
  loadPhase4Detail().then(detail=>{if(destroyed||!detail)return;meshes=detail.manor.meshes;detailAudit=detail.audit;detailState='phase4';root.dataset.homeIdentityDetail='phase4';frame(performance.now())});
  const api=Object.freeze({specimenId:SPECIMEN_ID,variant,sourceContract:neutral.contract,get sourceAudit(){return detailAudit},cycleMs:HOME_IDENTITY_CYCLE_MS,reducedMotion:reduced,cardClockContract:clock.contract,destroy(){destroyed=true;active=false;cancelAnimationFrame(raf);io?.disconnect();clock.destroy();canvas.remove();root.dataset.homeIdentityMounted='false'}});
  root.dataset.homeIdentityMounted='true';root.__homeIdentityV2=api;return api;
}
function auto(){document.querySelectorAll('[data-home-identity-v2]').forEach(mountHomeIdentity)}
if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}
export { SPECIMEN_ID, getHomeIdentityState, mountHomeIdentity };
