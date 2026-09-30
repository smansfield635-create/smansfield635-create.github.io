import { createCardClock } from './card-lifecycle-v1.mjs';
const PRODUCTS_SPATIAL_CYCLE_MS=11000;
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};

function getProductsSpatialState(ms,variant='door',reduced=false){
  const explore=variant==='explore';
  if(reduced)return Object.freeze({phase:'INSPECTION',breathe:.62,facet:.78,glint:.38,orbit:.42,spread:.72,lift:.58,brightness:.78,camera:.52});
  const t=(((ms%PRODUCTS_SPATIAL_CYCLE_MS)+PRODUCTS_SPATIAL_CYCLE_MS)%PRODUCTS_SPATIAL_CYCLE_MS)/PRODUCTS_SPATIAL_CYCLE_MS;
  let phase='REST',breathe=0,facet=0,glint=0,orbit=0,spread=0,lift=0,brightness=.22,camera=0;
  if(t<.15){const p=smooth(t/.15);breathe=.18*p;brightness=.22+.08*p;camera=.08*p;}
  else if(t<.32){phase='BREATHE';const p=smooth((t-.15)/.17);breathe=.18+.82*p;lift=.62*p;brightness=.30+.30*p;camera=.08+.18*p;}
  else if(t<.49){phase='FACET';const p=smooth((t-.32)/.17);breathe=1-.12*p;facet=p;lift=.62+.18*p;spread=.20*p;brightness=.60+.18*p;camera=.26+.16*p;}
  else if(t<.65){phase='GLINT';const p=smooth((t-.49)/.16);breathe=.88;facet=1;glint=p;orbit=.12*p;spread=.20+.26*p;lift=.80;brightness=.78+.18*Math.sin(Math.PI*p);camera=.42+.10*p;}
  else if(t<.86){phase='ORBIT';const p=smooth((t-.65)/.21);breathe=.88-.18*p;facet=1-.14*p;glint=1-p;orbit=.12+.88*p;spread=.46+.54*p;lift=.80-.18*p;brightness=.78-.14*p;camera=.52+.18*p;}
  else {phase='RETURN';const p=smooth((t-.86)/.14);breathe=.70*(1-p);facet=.86*(1-p);orbit=1-p;spread=1-p;lift=.62*(1-p);brightness=.64-.42*p;camera=.70*(1-p);}
  if(explore){camera=clamp(camera+.12);spread=clamp(spread+.08);}
  return Object.freeze({phase,breathe:clamp(breathe),facet:clamp(facet),glint:clamp(glint),orbit:clamp(orbit),spread:clamp(spread),lift:clamp(lift),brightness:clamp(brightness),camera:clamp(camera)});
}

const SPECIMEN_ID='DOOR_EXPLORE_PRODUCTS_VOLUMETRIC_CONSTELLATION_V2';
const V=(x,y,z)=>[x,y,z];
function gemMesh(segments=8){
  const verts=[V(0,1.35,0),V(0,.42,0),V(0,-.52,0),V(0,-1.42,0)];
  for(let i=0;i<segments;i++){const a=Math.PI*2*i/segments;verts.push(V(Math.cos(a)*.78,.48,Math.sin(a)*.78));}
  const lowStart=verts.length;
  for(let i=0;i<segments;i++){const a=Math.PI*2*(i+.5)/segments;verts.push(V(Math.cos(a)*.66,-.48,Math.sin(a)*.66));}
  const faces=[];
  for(let i=0;i<segments;i++){
    const u=4+i,un=4+(i+1)%segments,l=lowStart+i,ln=lowStart+(i+1)%segments;
    faces.push([0,u,un],[1,un,u],[1,u,l],[1,l,2],[1,2,ln],[1,ln,un],[2,l,ln],[3,ln,l]);
  }
  return {verts,faces};
}
const GEM=gemMesh(8);
const GEMS=Object.freeze([
  {scale:1.28,base:[0,0,0],hue:'jade',phase:0},
  {scale:.46,base:[2.3,.22,.2],hue:'cyan',phase:.00},
  {scale:.38,base:[-2.05,.05,.25],hue:'gold',phase:.25},
  {scale:.42,base:[.28,.38,2.05],hue:'violet',phase:.50},
  {scale:.34,base:[-.3,-.05,-2.05],hue:'jade',phase:.75}
]);
const PALETTES={
  jade:[[.16,.82,.62],[.07,.42,.35]],cyan:[[.30,.84,.96],[.06,.35,.50]],gold:[[.95,.69,.27],[.48,.28,.06]],violet:[[.67,.54,.96],[.28,.18,.55]]
};
function rotate(v,yaw,pitch,roll=0){let[x,y,z]=v;const cr=Math.cos(roll),sr=Math.sin(roll);[x,y]=[x*cr-y*sr,x*sr+y*cr];const cy=Math.cos(yaw),sy=Math.sin(yaw);[x,z]=[x*cy-z*sy,x*sy+z*cy];const cp=Math.cos(pitch),sp=Math.sin(pitch);[y,z]=[y*cp-z*sp,y*sp+z*cp];return[x,y,z]}
function add(a,b){return[a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
function scale(v,s){return[v[0]*s,v[1]*s,v[2]*s]}
function normal(a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1;return n.map(x=>x/l)}
function project(v,w,h,focal=7.8){const d=Math.max(2.8,focal-v[2]);const s=Math.min(w,h)*.86/d;return[w*.5+v[0]*s,h*.44-v[1]*s,v[2],s]}
function gemTransform(spec,state,variant,index){
  const central=index===0;let pos=[...spec.base];
  if(!central){const ang=(spec.phase+state.orbit*(variant==='explore'?-1:1))*Math.PI*2;const r=(1.40+1.04*state.spread);const y=.12*Math.sin(ang*2+index)+.35*state.lift;pos=[Math.cos(ang)*r,y,Math.sin(ang)*r*.72];}
  else pos=[0,.18*state.lift,0];
  const breathe=1+(central?.055:.025)*Math.sin(Math.PI*state.breathe);
  const localYaw=(central?-.18:.12*index)+state.facet*(central?.62:.34)*(index%2?1:-1);
  const roll=(central?.08:.16)*Math.sin(state.orbit*Math.PI*2+spec.phase*Math.PI*2);
  return {pos,scale:spec.scale*breathe,yaw:localYaw,roll};
}
function buildScene(state,variant,w,h){
  const tris=[];const gems=[];
  const cameraYaw=((variant==='explore'?-22:-30)+state.camera*(variant==='explore'?-16:20))*Math.PI/180;
  const cameraPitch=((variant==='explore'?17:13)+state.camera*5)*Math.PI/180;
  for(let gi=0;gi<GEMS.length;gi++){
    const spec=GEMS[gi],tr=gemTransform(spec,state,variant,gi),worldVerts=[];
    for(const v of GEM.verts){let p=rotate(scale(v,tr.scale),tr.yaw,0,tr.roll);p=add(p,tr.pos);p=rotate(p,cameraYaw,cameraPitch,0);worldVerts.push(p)}
    const projected=worldVerts.map(v=>project(v,w,h));gems.push({spec,tr,projected,worldVerts});
    for(let fi=0;fi<GEM.faces.length;fi++){
      const face=GEM.faces[fi],a=worldVerts[face[0]],b=worldVerts[face[1]],c=worldVerts[face[2]],n=normal(a,b,c),light=clamp(.18+.82*(n[0]*-.34+n[1]*.72+n[2]*.52+.15),0,1);
      tris.push({gi,fi,z:(a[2]+b[2]+c[2])/3,p:face.map(i=>projected[i]),light,hue:spec.hue});
    }
  }
  tris.sort((a,b)=>a.z-b.z);return{tris,gems};
}
function rgbMix(a,b,t){return a.map((x,i)=>Math.round((x+(b[i]-x)*t)*255))}
function drawOrbit(ctx,w,h,state,variant){ctx.save();ctx.globalCompositeOperation='lighter';for(let ring=0;ring<2;ring++){ctx.beginPath();const rev=ring? -1:1;for(let i=0;i<=120;i++){const a=Math.PI*2*i/120+state.orbit*Math.PI*2*rev;let p=[Math.cos(a)*(ring?2.05:2.52),ring?.10:-.02,Math.sin(a)*(ring?1.55:1.78)];p=rotate(p,((variant==='explore'?-22:-30)+state.camera*(variant==='explore'?-16:20))*Math.PI/180,((variant==='explore'?17:13)+state.camera*5)*Math.PI/180,0);const q=project(p,w,h);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])}ctx.strokeStyle=ring?'rgba(139,230,255,.13)':'rgba(114,233,196,.16)';ctx.lineWidth=1;ctx.stroke()}ctx.restore()}
function render(ctx,w,h,state,variant){ctx.clearRect(0,0,w,h);const bg=ctx.createRadialGradient(w*.5,h*.46,0,w*.5,h*.48,Math.max(w,h)*.68);bg.addColorStop(0,variant==='explore'?'rgba(88,72,145,.18)':'rgba(43,132,113,.17)');bg.addColorStop(1,'rgba(1,4,9,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);drawOrbit(ctx,w,h,state,variant);const scene=buildScene(state,variant,w,h);
  for(const tri of scene.tris){const pal=PALETTES[tri.hue],rgb=rgbMix(pal[1],pal[0],.25+.75*tri.light),alpha=.58+.38*tri.light;ctx.beginPath();ctx.moveTo(tri.p[0][0],tri.p[0][1]);ctx.lineTo(tri.p[1][0],tri.p[1][1]);ctx.lineTo(tri.p[2][0],tri.p[2][1]);ctx.closePath();ctx.fillStyle=`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;ctx.fill();ctx.strokeStyle=`rgba(227,255,246,${.035+.10*tri.light})`;ctx.lineWidth=.5;ctx.stroke()}
  const central=scene.gems[0];if(state.glint>.02){const a=central.projected[0],b=central.projected[3],p=Math.sin(Math.PI*state.glint);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,255,255,${.68*p})`;ctx.lineWidth=2.2+2.5*p;ctx.shadowColor='rgba(180,255,239,.8)';ctx.shadowBlur=10+8*p;ctx.beginPath();ctx.moveTo(a[0]-9*(1-state.glint),a[1]+6);ctx.lineTo(b[0]+12*state.glint,b[1]-5);ctx.stroke();ctx.restore()}
  const halo=ctx.createRadialGradient(w*.5,h*.46,2,w*.5,h*.46,Math.min(w,h)*.34);halo.addColorStop(0,`rgba(111,244,207,${.03+.08*state.brightness})`);halo.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
}
function mountProductsConstellation(root){
  if(!(root instanceof Element)||root.dataset.productsSpatialMounted==='true')return root?.__productsSpatialV2||null;
  const variant=root.dataset.productsSpatialVariant==='explore'?'explore':'door';const canvas=document.createElement('canvas');canvas.className='products-constellation-v2-canvas';canvas.setAttribute('aria-hidden','true');root.prepend(canvas);const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw new Error('PRODUCTS_SPATIAL_CANVAS_UNAVAILABLE');const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;const clock=createCardClock(root);let active=true,raf=0,last=0;
  function frame(now){if(!active&&!reduced)return;if(!reduced&&now-last<30){raf=requestAnimationFrame(frame);return}last=now;const rect=root.getBoundingClientRect(),dpr=Math.min(1.25,devicePixelRatio||1),W=Math.max(1,Math.round(rect.width*dpr)),H=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`}ctx.setTransform(dpr,0,0,dpr,0,0);const cardTime=clock.sample(now);const state=getProductsSpatialState(cardTime.elapsedMs,variant,reduced);render(ctx,rect.width,rect.height,state,variant);root.dataset.productsSpatialPhase=state.phase;root.dataset.productsLifecycleGeneration=String(cardTime.generation);if(active&&!reduced)raf=requestAnimationFrame(frame)}
  const io=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{active=!!entries[0]?.isIntersecting;cancelAnimationFrame(raf);if(active&&!reduced)raf=requestAnimationFrame(frame)},{threshold:.04}):null;io?.observe(root);reduced?frame(performance.now()):raf=requestAnimationFrame(frame);
  const api=Object.freeze({specimenId:SPECIMEN_ID,variant,cycleMs:PRODUCTS_SPATIAL_CYCLE_MS,reducedMotion:reduced,gemCount:GEMS.length,facesPerGem:GEM.faces.length,cardClockContract:clock.contract,destroy(){active=false;cancelAnimationFrame(raf);io?.disconnect();clock.destroy();canvas.remove();root.dataset.productsSpatialMounted='false'}});root.dataset.productsSpatialMounted='true';root.__productsSpatialV2=api;return api;
}
function auto(){document.querySelectorAll('[data-products-constellation-v2]').forEach(mountProductsConstellation)}
if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}
export {SPECIMEN_ID,PRODUCTS_SPATIAL_CYCLE_MS,getProductsSpatialState,GEM,GEMS,mountProductsConstellation};
