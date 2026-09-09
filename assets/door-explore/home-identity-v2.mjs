import { buildPhase4DetailMesh, auditPhase4 } from '../manor-blueprint/manor.estate.gothic-detail-phase4.mjs';
import { MASSES } from '../manor-blueprint/manor.estate.neutral-blockout.mjs';
const HOME_IDENTITY_CYCLE_MS = 12000;
const clampState = (x) => Math.max(0, Math.min(1, x));
const smoothState = (x) => { x = clampState(x); return x*x*(3-2*x); };

function getHomeIdentityState(elapsedMs, variant='home', reduced=false) {
  const identity = variant === 'identity';
  if (reduced) {
    return Object.freeze(identity
      ? { phase:'NETWORK', camera:.56, lights:.48, links:1, pulse:.68, settle:1 }
      : { phase:'LIVED', camera:.62, lights:1, links:0, pulse:.18, settle:1 });
  }
  const t = (((elapsedMs % HOME_IDENTITY_CYCLE_MS) + HOME_IDENTITY_CYCLE_MS) % HOME_IDENTITY_CYCLE_MS) / HOME_IDENTITY_CYCLE_MS;
  let phase, camera=0, lights=0, links=0, pulse=0, settle=0;
  if (!identity) {
    if (t < .18) { phase='ARRIVAL'; camera=smoothState(t/.18)*.25; }
    else if (t < .42) { phase='APPROACH'; const p=smoothState((t-.18)/.24); camera=.25+.55*p; lights=.18*p; }
    else if (t < .64) { phase='LIGHT'; const p=smoothState((t-.42)/.22); camera=.8-.12*p; lights=.18+.82*p; pulse=.18*p; }
    else if (t < .84) { phase='LIVED'; const p=smoothState((t-.64)/.20); camera=.68-.08*p; lights=1; pulse=.18+.28*Math.sin(Math.PI*p); settle=p; }
    else { phase='RETURN'; const p=smoothState((t-.84)/.16); camera=.60*(1-p); lights=1-p; pulse=.18*(1-p); settle=1-p; }
  } else {
    if (t < .20) { phase='ROOT'; camera=smoothState(t/.20)*.28; lights=.22; }
    else if (t < .43) { phase='RESOLVE'; const p=smoothState((t-.20)/.23); camera=.28+.36*p; lights=.22+.22*p; links=.36*p; pulse=.12*p; }
    else if (t < .66) { phase='LINK'; const p=smoothState((t-.43)/.23); camera=.64-.08*p; lights=.44; links=.36+.64*p; pulse=.12+.58*p; }
    else if (t < .85) { phase='NETWORK'; const p=smoothState((t-.66)/.19); camera=.56+.05*Math.sin(Math.PI*p); lights=.44+.08*p; links=1; pulse=.70+.24*Math.sin(Math.PI*p); settle=p; }
    else { phase='RETURN'; const p=smoothState((t-.85)/.15); camera=.56*(1-p); lights=.52-.30*p; links=1-p; pulse=.70*(1-p); settle=1-p; }
  }
  return Object.freeze({phase,camera:clampState(camera),lights:clampState(lights),links:clampState(links),pulse:clampState(pulse),settle:clampState(settle)});
}

const SPECIMEN_ID='DOOR_EXPLORE_HOME_IDENTITY_SPATIAL_V2';
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const rgba=(rgb,a)=>`rgba(${Math.round(rgb[0]*255)},${Math.round(rgb[1]*255)},${Math.round(rgb[2]*255)},${clamp(a)})`;
const SUBSTANTIVE_ROLES=new Set(['great-house','west-wing','east-wing','central-crown-tower','old-core-tower','east-stair-tower','great-house-roof','great-house-cross-roof','west-wing-roof','east-wing-roof','central-crown-tower-crown','old-core-tower-crown','east-stair-tower-crown']);

function materialFor(mesh, state, variant){
  const role=String(mesh.role||'');
  const mat=String(mesh.material||'');
  if(role==='interior-window-light') return {rgb:[.98,.58,.18], alpha:.16+.82*state.lights, emissive:true};
  if(role.includes('window-reveal')||role.includes('portal-reveal')) return {rgb:[.055,.065,.075],alpha:.95};
  if(role.includes('roof')||role.includes('crown')) return {rgb:[.12,.14,.17],alpha:.98};
  if(role.includes('garden')) return {rgb:[.14,.22,.16],alpha:.62};
  if(role.includes('court')||role.includes('terrace')) return {rgb:[.28,.29,.28],alpha:.66};
  if(mat.includes('OLD')) return {rgb:[.34,.35,.36],alpha:.98};
  if(mat.includes('LATER')) return {rgb:[.48,.49,.50],alpha:.98};
  if(mat.includes('CARVED')) return {rgb:[.58,.57,.54],alpha:.98};
  return {rgb:variant==='identity'?[.46,.49,.56]:[.52,.50,.46],alpha:.96};
}
function rotatePoint(v,yaw,pitch,center){
  let x=v[0]-center[0], y=v[1]-center[1], z=v[2]-center[2];
  const cy=Math.cos(yaw),sy=Math.sin(yaw); const x1=x*cy-z*sy,z1=x*sy+z*cy;
  const cp=Math.cos(pitch),sp=Math.sin(pitch); const y1=y*cp-z1*sp,z2=y*sp+z1*cp;
  return [x1,y1,z2];
}
function normal(a,b,c){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;return[nx/l,ny/l,nz/l]}
function project(p,dist){const d=Math.max(24,dist-p[2]);return[p[0]/d,p[1]/d,p[2],d]}
function buildFrame(meshes,state,variant,w,h){
  const identity=variant==='identity';
  const yaw=((identity?-26:-38)+state.camera*(identity?-11:15))*Math.PI/180;
  const pitch=(identity?15:17)*Math.PI/180;
  const center=[0,8,7]; const dist=identity?92:96;
  const tris=[]; const focus=[];
  for(const mesh of meshes){
    const t=mesh.triangles||[]; for(let i=0;i+2<t.length;i+=3){
      const a=rotatePoint(t[i],yaw,pitch,center),b=rotatePoint(t[i+1],yaw,pitch,center),c=rotatePoint(t[i+2],yaw,pitch,center);
      const pa=project(a,dist),pb=project(b,dist),pc=project(c,dist),n=normal(a,b,c);
      const light=.26+.74*clamp(n[0]*-.35+n[1]*.72+n[2]*.56,0,1); const m=materialFor(mesh,state,variant);
      const tri={p:[pa,pb,pc],z:(a[2]+b[2]+c[2])/3,mesh,light,m}; tris.push(tri);
      if(SUBSTANTIVE_ROLES.has(String(mesh.role||''))) focus.push(pa,pb,pc);
    }
  }
  const pts=focus.length?focus:tris.flatMap(t=>t.p); let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const p of pts){minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])}
  const sx=(w*.78)/Math.max(.0001,maxX-minX), sy=(h*.68)/Math.max(.0001,maxY-minY), s=Math.min(sx,sy);
  const ox=w*.5-(minX+maxX)*.5*s, oy=h*.52+(minY+maxY)*.5*s;
  const map=p=>[ox+p[0]*s,oy-p[1]*s,p[2]];
  tris.forEach(t=>t.q=t.p.map(map)); tris.sort((a,b)=>a.z-b.z);
  return {tris,yaw,pitch,center,dist,s,ox,oy,map};
}
function drawRelations(ctx,frame,state){
  if(state.links<=.02)return;
  const root=MASSES.find(m=>m.id==='GH')?.center||[0,6,0];
  const targets=MASSES.filter(m=>['WW','EW','CT','OC','ST','GHSE'].includes(m.id)).map(m=>m.center);
  const rp=frame.map(project(rotatePoint(root,frame.yaw,frame.pitch,frame.center),frame.dist));
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineWidth=1.25;
  targets.forEach((target,i)=>{
    const tp=frame.map(project(rotatePoint(target,frame.yaw,frame.pitch,frame.center),frame.dist));
    const phase=clamp(state.links*1.35-i*.07); if(phase<=0)return;
    const mx=lerp(rp[0],tp[0],phase),my=lerp(rp[1],tp[1],phase);
    ctx.strokeStyle=`rgba(177,168,255,${.12+.55*phase})`;ctx.beginPath();ctx.moveTo(rp[0],rp[1]);ctx.lineTo(mx,my);ctx.stroke();
    ctx.fillStyle=`rgba(139,230,255,${.18+.62*phase})`;ctx.beginPath();ctx.arc(mx,my,1.8+1.7*state.pulse,0,Math.PI*2);ctx.fill();
  });ctx.restore();
}
function render(ctx,w,h,meshes,state,variant){
  ctx.clearRect(0,0,w,h);
  const sky=ctx.createRadialGradient(w*.52,h*.42,0,w*.52,h*.48,Math.max(w,h)*.72);sky.addColorStop(0,variant==='identity'?'rgba(62,67,113,.22)':'rgba(115,79,36,.20)');sky.addColorStop(1,'rgba(2,5,11,0)');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  const frame=buildFrame(meshes,state,variant,w,h);
  for(const tri of frame.tris){const {q,m,light}=tri;if(!q.every(p=>Number.isFinite(p[0])&&Number.isFinite(p[1])))continue;ctx.beginPath();ctx.moveTo(q[0][0],q[0][1]);ctx.lineTo(q[1][0],q[1][1]);ctx.lineTo(q[2][0],q[2][1]);ctx.closePath();
    if(m.emissive){ctx.fillStyle=rgba(m.rgb,m.alpha);ctx.shadowColor='rgba(255,166,67,.8)';ctx.shadowBlur=8+10*state.lights;}else{ctx.shadowBlur=0;ctx.fillStyle=rgba(m.rgb,m.alpha*(.58+.42*light));}
    ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=`rgba(235,226,204,${.018+.045*light})`;ctx.lineWidth=.45;ctx.stroke();}
  if(variant==='identity')drawRelations(ctx,frame,state);
  const vignette=ctx.createRadialGradient(w*.5,h*.48,Math.min(w,h)*.25,w*.5,h*.5,Math.max(w,h)*.72);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.58)');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
}
function mountHomeIdentity(root){
  if(!(root instanceof Element)||root.dataset.homeIdentityMounted==='true')return root?.__homeIdentityV2||null;
  const variant=root.dataset.homeIdentityVariant==='identity'?'identity':'home';
  const audit=auditPhase4(); if(!audit.passStatic) throw new Error('MIRROR_MANOR_PHASE4_AUDIT_FAILED');
  const manor=buildPhase4DetailMesh(); const canvas=document.createElement('canvas'); canvas.className='home-identity-v2-canvas'; canvas.setAttribute('aria-hidden','true'); root.prepend(canvas);
  const ctx=canvas.getContext('2d',{alpha:true}); if(!ctx)throw new Error('HOME_IDENTITY_CANVAS_UNAVAILABLE');
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false; let active=true,raf=0,last=0,start=performance.now();
  function frame(now){if(!active&&!reduced)return;if(!reduced&&now-last<30){raf=requestAnimationFrame(frame);return}last=now;const rect=root.getBoundingClientRect(),dpr=Math.min(1.25,devicePixelRatio||1),W=Math.max(1,Math.round(rect.width*dpr)),H=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`}ctx.setTransform(dpr,0,0,dpr,0,0);const state=getHomeIdentityState(now-start,variant,reduced);render(ctx,rect.width,rect.height,manor.meshes,state,variant);root.dataset.homeIdentityPhase=state.phase;if(active&&!reduced)raf=requestAnimationFrame(frame)}
  const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{active=!!entries[0]?.isIntersecting;cancelAnimationFrame(raf);if(active&&!reduced)raf=requestAnimationFrame(frame)},{threshold:.04}):null;io?.observe(root); reduced?frame(performance.now()):raf=requestAnimationFrame(frame);
  const api=Object.freeze({specimenId:SPECIMEN_ID,variant,sourceContract:manor.contract,sourceAudit:audit,cycleMs:HOME_IDENTITY_CYCLE_MS,reducedMotion:reduced,destroy(){active=false;cancelAnimationFrame(raf);io?.disconnect();canvas.remove();root.dataset.homeIdentityMounted='false'}});
  root.dataset.homeIdentityMounted='true';root.__homeIdentityV2=api;return api;
}
function auto(){document.querySelectorAll('[data-home-identity-v2]').forEach(mountHomeIdentity)}
if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}
export { SPECIMEN_ID, mountHomeIdentity };

const carouselReduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;
function bindCarousel(carousel){if(!carousel||carousel.dataset.spatialCarouselBound==='true')return;carousel.dataset.spatialCarouselBound='true';carousel.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();carousel.scrollBy({left:carousel.clientWidth*.72*(e.key==='ArrowRight'?1:-1),behavior:carouselReduced?'auto':'smooth'})});let tracking=false,dragging=false,startX=0,startY=0,startLeft=0,moved=false,pid=null;carousel.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;tracking=true;dragging=e.pointerType==='mouse';moved=false;pid=e.pointerId;startX=e.clientX;startY=e.clientY;startLeft=carousel.scrollLeft;if(dragging){carousel.classList.add('dragging');try{carousel.setPointerCapture?.(e.pointerId)}catch{}}});carousel.addEventListener('pointermove',e=>{if(!tracking||e.pointerId!==pid)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(!dragging){if(Math.abs(dx)<8&&Math.abs(dy)<8)return;if(Math.abs(dy)>Math.abs(dx)){tracking=false;return}dragging=true;carousel.classList.add('dragging');try{carousel.setPointerCapture?.(e.pointerId)}catch{}}if(Math.abs(dx)>5)moved=true;if(e.cancelable)e.preventDefault();carousel.scrollLeft=startLeft-dx},{passive:false});const end=e=>{if(e.pointerId!==pid)return;tracking=false;dragging=false;carousel.classList.remove('dragging');try{carousel.releasePointerCapture?.(e.pointerId)}catch{}pid=null};carousel.addEventListener('pointerup',end);carousel.addEventListener('pointercancel',end);carousel.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true)}
document.querySelectorAll('.carousel').forEach(bindCarousel);
document.documentElement.dataset.doorExploreSpatialTraversal='v2-cycle1-home-identity';
