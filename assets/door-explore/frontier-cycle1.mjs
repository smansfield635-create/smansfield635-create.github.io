import {
  createHEarthVector3,
  constructHEarthTriangleMesh,
  admitHEarthPrimitiveRecord
} from '/showroom/globe/h-earth/render/geometry-kernel.js';
import {
  FRONTIER_CYCLE_MS,
  getFrontierCycleState,
  deterministicUnit
} from './frontier-cycle1.state.mjs';

export const FRONTIER_GEOMETRY_SOURCE = '/showroom/globe/h-earth/render/geometry-kernel.js';
export const FRONTIER_SPECIMEN_ID = 'DOOR_FRONTIER_APPLIED_SYSTEMS_CYCLE1_V1';
export const FRONTIER_SEED = 0x41d06a31;

const BOX_INDICES = Object.freeze([
  0,2,1, 0,3,2,
  4,5,6, 4,6,7,
  0,4,7, 0,7,3,
  1,2,6, 1,6,5,
  0,1,5, 0,5,4,
  3,7,6, 3,6,2
]);

function makeBoxVertices(cx, cz, w, d, h) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;
  return [
    createHEarthVector3(x0,0,z0), createHEarthVector3(x1,0,z0),
    createHEarthVector3(x1,h,z0), createHEarthVector3(x0,h,z0),
    createHEarthVector3(x0,0,z1), createHEarthVector3(x1,0,z1),
    createHEarthVector3(x1,h,z1), createHEarthVector3(x0,h,z1)
  ];
}

function constructAdmittedBox(index, descriptor) {
  const primitiveId = `${FRONTIER_SPECIMEN_ID}:block:${String(index).padStart(2,'0')}`;
  const result = constructHEarthTriangleMesh({
    primitiveId,
    vertices: makeBoxVertices(descriptor.x, descriptor.z, descriptor.w, descriptor.d, descriptor.h),
    indices: BOX_INDICES,
    semanticRole: 'APPLIED_SYSTEM_PERSISTENT_STRUCTURE',
    materialHint: {family:'DOOR_FRONTIER_APPLIED_SYSTEMS'},
    metadata: {seed:FRONTIER_SEED, descriptor, cycleInvariant:'PERSISTENT_GEOMETRY'}
  });
  if (!result?.valid || !result?.primitiveRecord) {
    throw new Error(`FRONTIER_GEOMETRY_CONSTRUCTION_FAILED:${primitiveId}`);
  }
  const admission = admitHEarthPrimitiveRecord(result.primitiveRecord, {
    admissionId:`${primitiveId}:admitted`,
    metadata:{specimenId:FRONTIER_SPECIMEN_ID}
  });
  if (!admission?.valid || !admission?.primitive?.geometry) {
    throw new Error(`FRONTIER_GEOMETRY_ADMISSION_FAILED:${primitiveId}`);
  }
  return Object.freeze({descriptor:Object.freeze(descriptor), primitive:admission.primitive});
}

export function buildFrontierAdmittedGeometry() {
  const blocks = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      const i = r * 5 + c;
      const descriptor = {
        x:(c - 2) * 1.46 + (deterministicUnit(FRONTIER_SEED, i * 7 + 1) - 0.5) * 0.32,
        z:(r - 1) * 1.45 + (deterministicUnit(FRONTIER_SEED, i * 7 + 2) - 0.5) * 0.24,
        w:0.72 + deterministicUnit(FRONTIER_SEED, i * 7 + 3) * 0.46,
        d:0.68 + deterministicUnit(FRONTIER_SEED, i * 7 + 4) * 0.40,
        h:0.70 + deterministicUnit(FRONTIER_SEED, i * 7 + 5) * 1.75,
        windowPhase:deterministicUnit(FRONTIER_SEED, i * 7 + 6),
        tier:i % 3
      };
      blocks.push(constructAdmittedBox(i, descriptor));
    }
  }
  return Object.freeze(blocks);
}

function project(vertex, width, height, yaw, pitch, scale) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const x = vertex.x * cy - vertex.z * sy;
  const z = vertex.x * sy + vertex.z * cy;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const y = vertex.y * cp - z * sp;
  const depth = vertex.y * sp + z * cp;
  const perspective = 1 / Math.max(0.48, 1 + depth * 0.055);
  return {x:width * 0.5 + x * scale * perspective, y:height * 0.72 - y * scale * perspective, depth};
}

function hexToRgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a,b,t) {
  const A=hexToRgb(a), B=hexToRgb(b);
  return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`;
}

function drawGeometry(ctx, blocks, state, width, height) {
  const yaw = -0.72 + state.inspection * 0.15;
  const pitch = 0.63;
  const scale = Math.min(width, height) * (0.095 + state.inspection * 0.006);
  const faces = [];
  for (const block of blocks) {
    const projected = block.primitive.geometry.vertices.map(v => project(v,width,height,yaw,pitch,scale));
    for (let i=0;i<BOX_INDICES.length;i+=3) {
      const ids=[BOX_INDICES[i],BOX_INDICES[i+1],BOX_INDICES[i+2]];
      const pts=ids.map(id=>projected[id]);
      faces.push({pts,depth:pts.reduce((s,p)=>s+p.depth,0)/3,tier:block.descriptor.tier});
    }
  }
  faces.sort((a,b)=>a.depth-b.depth);
  const base='#17243a', active='#5d7f8f', transformed='#9b7b42';
  for (const face of faces) {
    const structural = Math.min(1, 0.18 + state.awaken*0.48 + state.transformed*0.34);
    ctx.beginPath();
    ctx.moveTo(face.pts[0].x,face.pts[0].y);
    ctx.lineTo(face.pts[1].x,face.pts[1].y);
    ctx.lineTo(face.pts[2].x,face.pts[2].y);
    ctx.closePath();
    ctx.fillStyle = state.energy > 0.08
      ? mix(mix(base,active,structural), transformed, state.energy * (0.34 + face.tier*0.12))
      : mix(base,active,structural);
    ctx.fill();
    ctx.strokeStyle=`rgba(210,232,244,${0.08+state.awaken*0.16})`;
    ctx.lineWidth=1;
    ctx.stroke();
  }
}

function drawGround(ctx,width,height,state) {
  const y=height*0.73;
  const g=ctx.createLinearGradient(0,y,width,y);
  g.addColorStop(0,'rgba(40,78,98,0)');
  g.addColorStop(0.45,`rgba(54,112,137,${0.08+state.flow*0.16})`);
  g.addColorStop(1,'rgba(184,144,67,0)');
  ctx.strokeStyle=g; ctx.lineWidth=1.2;
  for(let i=0;i<5;i+=1){
    ctx.beginPath();
    ctx.moveTo(width*(0.12+i*0.16),y+height*(0.02+i*0.002));
    ctx.lineTo(width*(0.22+i*0.14),height*0.40);
    ctx.stroke();
  }
}

function drawPulse(ctx,path,state,kind,width,height) {
  const progress = kind==='water' ? state.waterPulse : state.energyPulse;
  const amount = kind==='water' ? state.flow : state.energy;
  if(amount<=0.01) return;
  const pts=path.map(([x,y])=>[x*width,y*height]);
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  for(let i=1;i<pts.length;i+=1)ctx.lineTo(...pts[i]);
  ctx.strokeStyle=kind==='water'?`rgba(94,220,255,${0.10+0.28*amount})`:`rgba(255,204,102,${0.10+0.32*amount})`;
  ctx.lineWidth=kind==='water'?2.2:1.8; ctx.stroke();
  const scaled=Math.max(0,Math.min(0.999,progress))*(pts.length-1);
  const idx=Math.floor(scaled), local=scaled-idx;
  const a=pts[idx], b=pts[Math.min(idx+1,pts.length-1)];
  const x=a[0]+(b[0]-a[0])*local, y=a[1]+(b[1]-a[1])*local;
  const grad=ctx.createRadialGradient(x,y,0,x,y,kind==='water'?14:12);
  if(kind==='water') {grad.addColorStop(0,'rgba(202,248,255,.95)');grad.addColorStop(1,'rgba(68,205,255,0)');}
  else {grad.addColorStop(0,'rgba(255,239,180,.98)');grad.addColorStop(1,'rgba(255,185,68,0)');}
  ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,kind==='water'?14:12,0,Math.PI*2);ctx.fill();
}

function drawWindows(ctx,blocks,state,width,height) {
  const yaw=-0.72+state.inspection*0.15, pitch=0.63;
  const scale=Math.min(width,height)*(0.095+state.inspection*0.006);
  blocks.forEach((block,index)=>{
    const d=block.descriptor;
    const p=project(createHEarthVector3(d.x,d.h*0.72,d.z-d.d*0.51),width,height,yaw,pitch,scale);
    const on=state.windowLevel > (0.2+d.windowPhase*0.75);
    ctx.fillStyle=on?`rgba(255,220,132,${0.38+state.energy*0.48})`:'rgba(116,167,190,.13)';
    const size=Math.max(1.4,Math.min(3.2,width/280));
    ctx.fillRect(p.x-size/2,p.y-size/2,size,size);
    if(on && index%3===0){ctx.fillStyle='rgba(255,226,147,.12)';ctx.fillRect(p.x-size*2,p.y-size*2,size*4,size*4);}
  });
}

export function mountFrontierCycle1(root) {
  if (!(root instanceof Element)) return null;
  if (root.dataset.frontierCycleMounted==='true') return root.__frontierCycle1 || null;
  const canvas=document.createElement('canvas');
  canvas.className='frontier-cycle1-canvas';
  canvas.setAttribute('aria-hidden','true');
  root.prepend(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx) throw new Error('FRONTIER_CANVAS_2D_UNAVAILABLE');
  const geometry=buildFrontierAdmittedGeometry();
  const reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  let active=true, raf=0, started=performance.now();
  const dpr=()=>Math.min(1.5,window.devicePixelRatio||1);
  function resize(){
    const rect=root.getBoundingClientRect(); const ratio=dpr();
    const w=Math.max(1,Math.round(rect.width*ratio)); const h=Math.max(1,Math.round(rect.height*ratio));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`;}
  }
  const waterPath=[[.12,.72],[.25,.66],[.39,.69],[.52,.61],[.68,.65],[.86,.55]];
  const energyPath=[[.16,.57],[.31,.48],[.45,.53],[.58,.42],[.73,.48],[.86,.38]];
  function draw(now){
    resize(); const ratio=dpr(), width=canvas.width/ratio, height=canvas.height/ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0); ctx.clearRect(0,0,width,height);
    const state=getFrontierCycleState(now-started,reduce);
    const bg=ctx.createRadialGradient(width*.5,height*.56,0,width*.5,height*.56,width*.62);
    bg.addColorStop(0,`rgba(28,65,86,${.11+state.awaken*.11})`);bg.addColorStop(.55,'rgba(13,24,42,.16)');bg.addColorStop(1,'rgba(3,7,14,0)');
    ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
    drawGround(ctx,width,height,state); drawGeometry(ctx,geometry,state,width,height); drawWindows(ctx,geometry,state,width,height);
    drawPulse(ctx,waterPath,state,'water',width,height); drawPulse(ctx,energyPath,state,'energy',width,height);
    root.dataset.frontierPhase=state.phase; root.dataset.frontierGeometryCount=String(geometry.length);
    if(active && !reduce) raf=requestAnimationFrame(draw);
  }
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    active=Boolean(entries[0]?.isIntersecting);
    if(active && !reduce){cancelAnimationFrame(raf);raf=requestAnimationFrame(draw);} else cancelAnimationFrame(raf);
  },{threshold:0.05}):null;
  observer?.observe(root);
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(reduce)draw(performance.now());}):null; ro?.observe(root);
  if(reduce) draw(performance.now()); else raf=requestAnimationFrame(draw);
  const api=Object.freeze({
    specimenId:FRONTIER_SPECIMEN_ID,
    geometrySource:FRONTIER_GEOMETRY_SOURCE,
    geometryCount:geometry.length,
    cycleMs:FRONTIER_CYCLE_MS,
    reducedMotion:reduce,
    destroy(){active=false;cancelAnimationFrame(raf);observer?.disconnect();ro?.disconnect();canvas.remove();root.dataset.frontierCycleMounted='false';}
  });
  root.dataset.frontierCycleMounted='true'; root.__frontierCycle1=api; return api;
}

function autoMount(){document.querySelectorAll('[data-frontier-cycle1]').forEach(node=>mountFrontierCycle1(node));}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',autoMount,{once:true});else autoMount();
}
