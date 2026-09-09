const EARTH_INSTRUMENT_CYCLE_MS=12000;
const AXIAL_TILT_DEG=23.44;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
function getEarthInstrumentState(ms,variant='door-gauges',reduced=false){
  if(reduced)return Object.freeze({phase:'READ',wake:1,orient:.72,measure:1,read:1,spin:.34,camera:.58,reference:variant==='measurement'?1:.45});
  const t=(((ms%EARTH_INSTRUMENT_CYCLE_MS)+EARTH_INSTRUMENT_CYCLE_MS)%EARTH_INSTRUMENT_CYCLE_MS)/EARTH_INSTRUMENT_CYCLE_MS;
  let phase='REST',wake=0,orient=0,measure=0,read=0,spin=0,camera=0,reference=0;
  if(t<.16){phase='REST';wake=smooth(t/.16)*.18;}
  else if(t<.34){phase='WAKE';const p=smooth((t-.16)/.18);wake=.18+.82*p;orient=.24*p;spin=.08*p;camera=.18*p;}
  else if(t<.52){phase='ORIENT';const p=smooth((t-.34)/.18);wake=1;orient=.24+.76*p;spin=.08+.16*p;camera=.18+.42*p;}
  else if(t<.70){phase='MEASURE';const p=smooth((t-.52)/.18);wake=1;orient=1;measure=p;spin=.24+.10*p;camera=.60;reference=(variant==='measurement'?1:.48)*p;}
  else if(t<.88){phase='READ';const p=smooth((t-.70)/.18);wake=1;orient=1;measure=1;read=p;spin=.34+.06*p;camera=.60-.02*p;reference=variant==='measurement'?1:.48;}
  else {phase='RETURN';const p=smooth((t-.88)/.12);wake=1-p;orient=1-p;measure=1-p;read=1-p;spin=.40*(1-p);camera=.58*(1-p);reference=(variant==='measurement'?1:.48)*(1-p);}
  return Object.freeze({phase,wake:clamp(wake),orient:clamp(orient),measure:clamp(measure),read:clamp(read),spin:clamp(spin),camera:clamp(camera),reference:clamp(reference)});
}
const SPECIMEN_ID='DOOR_EXPLORE_EARTH_INSTRUMENT_SPATIAL_V2';
const SAMPLE_LAT=0.43,SAMPLE_LON=-1.17;
const LAT_SEG=12,LON_SEG=20;
function rotateX(p,a){const c=Math.cos(a),s=Math.sin(a);return[p[0],p[1]*c-p[2]*s,p[1]*s+p[2]*c]}
function rotateY(p,a){const c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c]}
function rotateZ(p,a){const c=Math.cos(a),s=Math.sin(a);return[p[0]*c-p[1]*s,p[0]*s+p[1],p[2]]}
function transformPoint(p,state,variant,spin=true){
  let q=spin?rotateY(p,state.spin*Math.PI*2):p;
  q=rotateZ(q,AXIAL_TILT_DEG*Math.PI/180);
  const yaw=(variant==='door-gauges'?-18:variant==='explore-gauges'?-28:-24)+(state.camera*(variant==='measurement'?9:12));
  q=rotateY(q,yaw*Math.PI/180);
  q=rotateX(q,(variant==='measurement'?9:12)*Math.PI/180);
  return q;
}
function project(p,cx,cy,scale){const depth=4.5-p[2],k=scale/depth;return[cx+p[0]*k,cy-p[1]*k,p[2],k]}
function normal(a,b,c){const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,l=Math.hypot(nx,ny,nz)||1;return[nx/l,ny/l,nz/l]}
function spherePoint(lat,lon,r=1){const cl=Math.cos(lat);return[cl*Math.cos(lon)*r,Math.sin(lat)*r,cl*Math.sin(lon)*r]}
function latticeSample(lat,lon){const api=globalThis.DGBEarthLattice256;if(!api?.sample)throw new Error('EARTH_LATTICE_256_UNAVAILABLE');return api.sample(lat,lon,{timeSeconds:0,cloudPhase:0})}
function buildSurface(state,variant,cx,cy,scale){
  const tris=[];
  for(let i=0;i<LAT_SEG;i++){
    const lat0=-Math.PI/2+i*Math.PI/LAT_SEG,lat1=-Math.PI/2+(i+1)*Math.PI/LAT_SEG;
    for(let j=0;j<LON_SEG;j++){
      const lon0=-Math.PI+j*Math.PI*2/LON_SEG,lon1=-Math.PI+(j+1)*Math.PI*2/LON_SEG;
      const base=[spherePoint(lat0,lon0),spherePoint(lat0,lon1),spherePoint(lat1,lon1),spherePoint(lat1,lon0)];
      const world=base.map(p=>transformPoint(p,state,variant,true));
      const sample=latticeSample((lat0+lat1)/2,(lon0+lon1)/2);
      for(const f of [[0,1,2],[0,2,3]]){
        const a=world[f[0]],b=world[f[1]],c=world[f[2]],n=normal(a,b,c);if(n[2]>.25)continue;
        const light=clamp(.28+Math.max(0,-n[0]*.35+n[1]*.42-n[2]*.78)*.9,.18,1),color=sample.color||[35,90,110];
        tris.push({z:(a[2]+b[2]+c[2])/3,p:[project(a,cx,cy,scale),project(b,cx,cy,scale),project(c,cx,cy,scale)],color,light});
      }
    }
  }
  tris.sort((a,b)=>a.z-b.z);return tris;
}
function drawTriangle(ctx,t,alpha){const p=t.p;ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);ctx.lineTo(p[1][0],p[1][1]);ctx.lineTo(p[2][0],p[2][1]);ctx.closePath();const c=t.color.map(v=>Math.round(v*(.72+.42*t.light)));ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${alpha})`;ctx.fill()}
function drawRing(ctx,state,variant,cx,cy,scale){const pts=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2;let p=[Math.cos(a)*1.15,0,Math.sin(a)*1.15];p=transformPoint(p,state,variant,false);pts.push(project(p,cx,cy,scale))}ctx.save();ctx.strokeStyle=`rgba(139,230,255,${.14+.34*state.orient})`;ctx.lineWidth=1.1;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore()}
function drawMeasurement(ctx,state,variant,cx,cy,scale){
  if(state.measure<=.02)return;
  const p0=transformPoint(spherePoint(SAMPLE_LAT,SAMPLE_LON,1.03),state,variant,true),p=project(p0,cx,cy,scale);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=`rgba(243,200,111,${.25+.7*state.measure})`;ctx.shadowColor='rgba(243,200,111,.9)';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(p[0],p[1],3.2+2*state.read,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  const sample=latticeSample(SAMPLE_LAT,SAMPLE_LON);
  if(variant==='measurement'){
    const y=.12,corners=[[-1.35,y,-1.35],[1.35,y,-1.35],[1.35,y,1.35],[-1.35,y,1.35]].map(q=>project(transformPoint(q,state,variant,false),cx,cy,scale));
    ctx.fillStyle=`rgba(185,156,255,${.03+.13*state.reference})`;ctx.strokeStyle=`rgba(185,156,255,${.15+.5*state.reference})`;ctx.lineWidth=1;ctx.beginPath();corners.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fill();ctx.stroke();
  }
  ctx.font='700 9px system-ui';ctx.fillStyle=`rgba(238,246,250,${.35+.6*state.read})`;ctx.textAlign='center';ctx.fillText(variant==='measurement'?`STATE ${sample.stateId} · ${String(sample.biome).replace('_',' ').toUpperCase()}`:`STATE ${sample.stateId}`,p[0],p[1]-11);ctx.restore();
}
function drawEarth(ctx,w,h,state,variant){
  ctx.clearRect(0,0,w,h);const cx=w*.5,cy=h*.46,scale=Math.min(w,h)*1.52;
  const bg=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.62);bg.addColorStop(0,`rgba(46,104,147,${.05+.14*state.wake})`);bg.addColorStop(1,'rgba(2,5,12,0)');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.shadowColor='rgba(90,184,255,.45)';ctx.shadowBlur=18*state.wake;ctx.fillStyle=`rgba(34,85,125,${.08+.12*state.wake})`;ctx.beginPath();ctx.arc(cx,cy,Math.min(w,h)*.285,0,Math.PI*2);ctx.fill();ctx.restore();
  for(const t of buildSurface(state,variant,cx,cy,scale))drawTriangle(ctx,t,.42+.58*state.wake);
  drawRing(ctx,state,variant,cx,cy,scale);drawMeasurement(ctx,state,variant,cx,cy,scale);
  const rim=ctx.createRadialGradient(cx,cy,Math.min(w,h)*.24,cx,cy,Math.min(w,h)*.32);rim.addColorStop(0,'rgba(0,0,0,0)');rim.addColorStop(.82,'rgba(93,205,255,.02)');rim.addColorStop(1,`rgba(139,230,255,${.10+.14*state.wake})`);ctx.fillStyle=rim;ctx.beginPath();ctx.arc(cx,cy,Math.min(w,h)*.33,0,Math.PI*2);ctx.fill();
}
function mountEarthInstrument(root){
  if(!(root instanceof Element)||root.dataset.earthInstrumentMounted==='true')return root?.__earthInstrumentV2||null;
  const variant=['door-gauges','explore-gauges','measurement'].includes(root.dataset.earthInstrumentVariant)?root.dataset.earthInstrumentVariant:'door-gauges';
  if(!globalThis.DGBEarthLattice256?.sample)throw new Error('EARTH_LATTICE_256_UNAVAILABLE');
  const canvas=document.createElement('canvas');canvas.className='earth-instrument-v2-canvas';canvas.setAttribute('aria-hidden','true');root.prepend(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)throw new Error('EARTH_INSTRUMENT_CANVAS_UNAVAILABLE');
  const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches??false;let active=true,raf=0,last=0,start=performance.now();
  function frame(now){if(!active&&!reduced)return;if(!reduced&&now-last<33){raf=requestAnimationFrame(frame);return}last=now;const rect=root.getBoundingClientRect(),dpr=Math.min(1.2,devicePixelRatio||1),W=Math.max(1,Math.round(rect.width*dpr)),H=Math.max(1,Math.round(rect.height*dpr));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;canvas.style.width=`${rect.width}px`;canvas.style.height=`${rect.height}px`}ctx.setTransform(dpr,0,0,dpr,0,0);const state=getEarthInstrumentState(now-start,variant,reduced);drawEarth(ctx,rect.width,rect.height,state,variant);root.dataset.earthInstrumentPhase=state.phase;if(active&&!reduced)raf=requestAnimationFrame(frame)}
  const io=typeof IntersectionObserver==='function'?new IntersectionObserver(e=>{active=!!e[0]?.isIntersecting;cancelAnimationFrame(raf);if(active&&!reduced)raf=requestAnimationFrame(frame)},{threshold:.04}):null;io?.observe(root);reduced?frame(performance.now()):raf=requestAnimationFrame(frame);
  const api=Object.freeze({specimenId:SPECIMEN_ID,variant,cycleMs:EARTH_INSTRUMENT_CYCLE_MS,axialTiltDegrees:AXIAL_TILT_DEG,latticeContract:globalThis.DGBEarthLattice256.getStatus?.().contract||'EARTH_G6_256_LATTICE_PHYSICS_SYNTHETIC_SATELLITE_VIEW_TNT_v1',reducedMotion:reduced,destroy(){active=false;cancelAnimationFrame(raf);io?.disconnect();canvas.remove();root.dataset.earthInstrumentMounted='false'}});
  root.dataset.earthInstrumentMounted='true';root.__earthInstrumentV2=api;return api;
}
function auto(){document.querySelectorAll('[data-earth-instrument-v2]').forEach(mountEarthInstrument)}
if(typeof document!=='undefined'){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',auto,{once:true}):auto()}
export {SPECIMEN_ID,getEarthInstrumentState,mountEarthInstrument};
