import {
  H_EARTH_TERRAIN_FIELD,
  H_EARTH_GRATITUDE_COASTAL_SYSTEM,
  H_EARTH_INLAND_MOUNTAIN_WATERSHED_SYSTEM,
  getHEarthCanonicalShorelineZ,
  sampleHEarthTerrainField
} from '../../../../h-earth-3d/terrain/h-earth.terrain-field.js';

import { GCR2_METRIC_FRAME, GCR2_ANCHORS, regionalMetersToGeodetic, regionalMetersToContinentalKm } from './metric-geography-bridge.v1.mjs';
import { GRATITUDE_RIVERS, GRATITUDE_LAKES, GRATITUDE_CANDIDATE_CONTINENT_REMAINDER, GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE, clipCandidateRiverBankToLand, reconcileGratitudeNorthCoastZ, verifyNamedHydrology, verifyCandidateDeltaCoast, verifyCandidateEasternConfluence } from './hydrology-graph.v1.mjs';
import { sampleContinentalEcology, ECOLOGY_SOURCE } from './ecology-field.v1.mjs';
import { resolveAudraliaGratitudeShorelineZ } from '../../../../inspection/audralia-24057-exact/snapshot/h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';

const canvas=document.getElementById('world');
const scaleLabel=document.getElementById('scaleLabel');
const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});
const status=document.getElementById('status');
const showStatus=message=>{if(status)status.textContent=message;};

if(!gl) throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1),0,1);return t*t*(3-2*t);};
const norm=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l)};
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const mix3=(a,b,t)=>a.map((v,i)=>mix(v,b[i],t));
const gaussian=(x,z,cx,cz,rx,rz,a)=>{const dx=(x-cx)/rx,dz=(z-cz)/rz;return a*Math.exp(-(dx*dx+dz*dz)*1.6)};

const PLANET_RADIUS=GCR2_METRIC_FRAME.planetRadiusKm;
const CENTER=[0,-PLANET_RADIUS,0];
const LOCAL_CENTER_Z=GCR2_METRIC_FRAME.continentalAnchorZKm;
const RESOLVED=H_EARTH_TERRAIN_FIELD.worldDomain;

const PALETTE={
  sky:[0.045,0.105,0.17], ocean:[0.025,0.19,0.34], oceanDeep:[0.012,0.075,0.16],
  provisional:[0.19,0.31,0.22], low:[0.28,0.43,0.22], meadow:[0.34,0.49,0.25],
  upland:[0.40,0.42,0.25], rock:[0.42,0.37,0.31], high:[0.48,0.46,0.40], sand:[0.63,0.57,0.40]
};

function tangentDirection(u,v){const r=Math.hypot(u,v);if(r<1e-9)return[0,1,0];const a=r/PLANET_RADIUS,s=Math.sin(a),c=Math.cos(a);return norm([s*u/r,c,s*v/r]);}
function surface(direction,elevation=0,relief=1){const r=PLANET_RADIUS+elevation*relief;return[CENTER[0]+direction[0]*r,CENTER[1]+direction[1]*r,CENTER[2]+direction[2]*r];}
function directionFromLatLon(lat,lon){lat*=Math.PI/180;lon*=Math.PI/180;return norm([Math.cos(lat)*Math.cos(lon),Math.sin(lat),Math.cos(lat)*Math.sin(lon)]);}

// Protected rev5 northern shoreline is a historical geographic input, not
// proof that its 512-meter H-Earth core occupies 512 continental kilometers.
// The middle interval is a bounded macro interpolation; this contour remains
// a candidate pending authoritative physical coast re-authoring.
const northEdgeWest=-1130,northEdgeEast=1120;
const leftSample=resolveAudraliaGratitudeShorelineZ(-260);
const rightSample=resolveAudraliaGratitudeShorelineZ(260);
function macroShoreZ(x){
  const t=clamp((x+260)/520,0,1);
  const s=x<=-260||x>=260
    ?resolveAudraliaGratitudeShorelineZ(x)
    :mix(leftSample,rightSample,smooth(0,1,t))+
      9*Math.sin(t*Math.PI)*Math.sin(x*.015);
  const edgeT=clamp((x-northEdgeWest)/(northEdgeEast-northEdgeWest),0,1);
  // Join GCR1's explicitly provisional southern envelope without edge jumps.
  const westAdjustment=-245-resolveAudraliaGratitudeShorelineZ(northEdgeWest);
  const eastAdjustment=-176-resolveAudraliaGratitudeShorelineZ(northEdgeEast);
  const provisional=s+westAdjustment*(1-smooth(0,.12,edgeT))+
    eastAdjustment*smooth(.88,1,edgeT);
  return reconcileGratitudeNorthCoastZ(x,provisional);
}
// Stage 2: 8-metre core shoreline samples, retaining the outer 12-km coast.
const northCoastXs=[];
for(let x=northEdgeWest;x<northEdgeEast;x+=12)northCoastXs.push(x);
northCoastXs.push(northEdgeEast);
for(let i=0;i<=80;i++)northCoastXs.push(-0.32+i*0.008);
const NORTH_COAST=[...new Set(northCoastXs.map(x=>x.toFixed(9)))]
  .map(Number).sort((a,b)=>a-b).map(x=>[x,macroShoreZ(x)]);

// Share the coast with the qualified hydrology source and test model.
const CONTINENT_LOOP=[...NORTH_COAST,...GRATITUDE_CANDIDATE_CONTINENT_REMAINDER];

function pointInPolygon(x,z,loop=CONTINENT_LOOP){let inside=false;for(let i=0,j=loop.length-1;i<loop.length;j=i++){const a=loop[i],b=loop[j];if(((a[1]>z)!==(b[1]>z))&&(x<(b[0]-a[0])*(z-a[1])/((b[1]-a[1])||1e-9)+a[0]))inside=!inside;}return inside;}
// Reject any modeled water centerline offshore except the exact delta mouths.
function verifySourceDrainageOnCandidateLand(){
  const network=[...GRATITUDE_RIVERS,GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE];
  for(const river of network){
    for(let i=0;i<river.points.length-1;i++){
      const a=river.points[i],b=river.points[i+1],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const samples=Math.max(1,Math.ceil(length/2));
      for(let j=0;j<samples;j++){
        const t=(j+.5)/samples;
        if(!pointInPolygon(mix(a[0],b[0],t),mix(a[1],b[1],t)))return false;
      }
    }
  }
  return true;
}
function distanceToSegment(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz||1,t=clamp(((x-a[0])*dx+(z-a[1])*dz)/d,0,1);return Math.hypot(x-(a[0]+dx*t),z-(a[1]+dz*t));}
function coastDistance(x,z){let best=1e9;for(let i=0;i<CONTINENT_LOOP.length;i++)best=Math.min(best,distanceToSegment(x,z,CONTINENT_LOOP[i],CONTINENT_LOOP[(i+1)%CONTINENT_LOOP.length]));return best;}

// Relief and color derive from the separate deterministic continental ecology.
function canonicalEcologyAt(x,z,edge){return sampleContinentalEcology(x,z,Math.max(0,edge));}

function buildAxis(min,max,fineMin,fineMax,coarse=22,fine=9){const out=[min];let x=min;while(x<max-1e-6){let step=x>=fineMin&&x<fineMax?fine:coarse,next=Math.min(max,x+step);if(x<fineMin&&next>fineMin)next=fineMin;if(x<fineMax&&next>fineMax)next=fineMax;out.push(next);x=next;}return out;}
// One nonuniform indexed mesh; fine-resolution nodes are introduced only in
// the core-aligned axes, with unchanged continental sampling elsewhere.
function locallyRefinedAxis(base,low,high,step){
  const values=new Set(base.map(x=>x.toFixed(6)));
  const n=Math.round((high-low)/step);
  for(let i=0;i<=n;i++)values.add((low+i*step).toFixed(6));
  return [...values].map(Number).sort((a,b)=>a-b);
}
function buildGratitudeMesh(){
  const xs=locallyRefinedAxis(buildAxis(-1600,1550,-320,320,22,8),-0.384,0.384,0.008),
    zs=locallyRefinedAxis(buildAxis(-2050,260,-420,120,22,8),-128.36,-127.70,0.008),
    cols=xs.length,rows=zs.length;
  if(cols*rows>80000)throw new Error('GCR2_LOCAL_LOD_VERTEX_BUDGET_EXCEEDED');
  const vertices=[],indices=[],inside=new Uint8Array(cols*rows),at=(r,c)=>r*cols+c;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const x=xs[c],z=zs[r],land=pointInPolygon(x,z);inside[at(r,c)]=land?1:0;
    const v=z-LOCAL_CENTER_Z,dir=tangentDirection(x,v),edge=land?coastDistance(x,z):0,eco=land?canonicalEcologyAt(x,z,edge):null,e=eco?eco.altitudeKm:0,col=eco?eco.color:PALETTE.low;
    vertices.push(...dir,e,...col);
  }
  // Clip nearshore partial triangles instead of filling across water. Every
  // replacement triangle belongs to the original single continent mesh.
  function emitShoreIntersection(x,z){
    const id=vertices.length/7,dir=tangentDirection(x,z-LOCAL_CENTER_Z);
    const eco=canonicalEcologyAt(x,z,coastDistance(x,z));
    vertices.push(...dir,eco.altitudeKm,...eco.color);
    return id;
  }
  function clipLocalCoastTriangle(ids){
    const tri=ids.map(id=>({id,x:xs[id%cols],z:zs[Math.floor(id/cols)],land:inside[id]===1}));
    if(tri.every(p=>p.land)){indices.push(...ids);return;}
    if(tri.every(p=>!p.land))return;
    const clipped=[];
    for(let i=0;i<3;i++){
      const a=tri[i],b=tri[(i+1)%3];
      if(a.land!==b.land){
        let lo=0,hi=1;
        for(let k=0;k<27;k++){
          const t=(lo+hi)*.5;
          if(pointInPolygon(mix(a.x,b.x,t),mix(a.z,b.z,t))===a.land)lo=t;
          else hi=t;
        }
        const t=(lo+hi)*.5;
        clipped.push(emitShoreIntersection(mix(a.x,b.x,t),mix(a.z,b.z,t)));
      }
      if(b.land)clipped.push(b.id);
    }
    for(let i=1;i<clipped.length-1;i++)indices.push(clipped[0],clipped[i],clipped[i+1]);
  }
  for(let r=0;r<rows-1;r++)for(let c=0;c<cols-1;c++){
    const ids=[at(r,c),at(r,c+1),at(r+1,c+1),at(r+1,c)],count=ids.reduce((n,i)=>n+inside[i],0);
    const localCell=xs[c+1]>=-0.40&&xs[c]<=0.40&&zs[r+1]>=-128.40&&zs[r]<=-127.68;
    if(localCell){
      clipLocalCoastTriangle([ids[0],ids[3],ids[1]]);
      clipLocalCoastTriangle([ids[1],ids[3],ids[2]]);
      continue;
    }
    if(count===4)indices.push(ids[0],ids[3],ids[1],ids[1],ids[3],ids[2]);
    else if(count>=2){const x=(xs[c]+xs[c+1])*.5,z=(zs[r]+zs[r+1])*.5;if(pointInPolygon(x,z))indices.push(ids[0],ids[3],ids[1],ids[1],ids[3],ids[2]);}
  }
  return{vertices:new Float32Array(vertices),indices:new Uint32Array(indices)};
}

// Source-bound authoring corridors: widths here are VISUAL ONLY, not claims
// that source rev5 authoring units equal real-world river kilometers.
function buildHydrologyOverlay(){
  const vertices=[],indices=[],blue=[.058,.235,.325];
  const emit=(x,z)=>{
    const e=canonicalEcologyAt(x,z,coastDistance(x,z)).altitudeKm+.026;
    const d=tangentDirection(x,z-LOCAL_CENTER_Z),n=vertices.length/7;
    vertices.push(...d,e,...blue);return n;
  };
  // The final course is a candidate inferred eastern outlet, not rev5 data.
  for(const river of [...GRATITUDE_RIVERS,GRATITUDE_EASTERN_CONFLUENCE_CANDIDATE]){
    for(let i=0;i<river.points.length-1;i++){
      const a=river.points[i],b=river.points[i+1],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
      if(!(len>0))continue;
      const nx=-dz/len,nz=dx/len,width=Math.max(2.3,(river.widthAuthoringUnits??river.widthVisualUnits)*.25);
      const steps=Math.max(1,Math.ceil(len/6));
      for(let s=0;s<steps;s++){
        const t=s/steps,q=(s+1)/steps;
        const x0=mix(a[0],b[0],t),z0=mix(a[1],b[1],t),
          x1=mix(a[0],b[0],q),z1=mix(a[1],b[1],q);
        const bank0L=clipCandidateRiverBankToLand(x0,z0,x0+nx*width,z0+nz*width,pointInPolygon);
        const bank0R=clipCandidateRiverBankToLand(x0,z0,x0-nx*width,z0-nz*width,pointInPolygon);
        const bank1L=clipCandidateRiverBankToLand(x1,z1,x1+nx*width,z1+nz*width,pointInPolygon);
        const bank1R=clipCandidateRiverBankToLand(x1,z1,x1-nx*width,z1-nz*width,pointInPolygon);
        const v0=emit(...bank0L),v1=emit(...bank0R),
          v2=emit(...bank1L),v3=emit(...bank1R);
        indices.push(v0,v2,v1,v1,v2,v3);
      }
    }
  }
  for(const lake of GRATITUDE_LAKES){
    const cx=lake.xKm,cz=lake.zKm,c=emit(cx,cz),ring=[];
    for(let i=0;i<=48;i++){
      const a=i/48*Math.PI*2;
      ring.push(emit(cx+lake.rxAuthoring*.80*Math.cos(a),
                     cz+lake.rzAuthoring*.80*Math.sin(a)));
    }
    for(let i=0;i<48;i++)indices.push(c,ring[i],ring[i+1]);
  }
  return {vertices:new Float32Array(vertices),indices:new Uint32Array(indices)};
}

const PROVISIONAL_CENTERS=[
  [28,38,.34],[-24,72,.30],[15,119,.28],[-32,154,.31],[34,-149,.30],[-27,-112,.32],[8,-76,.29],[-42,-37,.28]
].map(([a,b,r],i)=>({dir:directionFromLatLon(a,b),radius:r,phase:i*1.731}));
function provisionalScore(d){let score=0;for(const p of PROVISIONAL_CENTERS){const a=Math.acos(clamp(dot(d,p.dir),-1,1)),r=p.radius*(.82+.14*Math.sin(d[0]*11+p.phase)+.10*Math.sin(d[2]*17-p.phase));score=Math.max(score,1-smooth(r*.72,r,a));}return score;}
function buildPlanetMesh(){
  const lon=224,lat=144,vertices=[],indices=[],at=(r,c)=>r*(lon+1)+c;
  for(let r=0;r<=lat;r++){
    const la=-Math.PI/2+r/lat*Math.PI,cl=Math.cos(la),sl=Math.sin(la);
    for(let c=0;c<=lon;c++){
      const lo=-Math.PI+c/lon*Math.PI*2,d=norm([cl*Math.cos(lo),sl,cl*Math.sin(lo)]),p=provisionalScore(d);
      const ocean=mix3(PALETTE.oceanDeep,PALETTE.ocean,.42+.16*(.5+.5*Math.sin(d[0]*9+d[2]*7)));
      const col=p>.53?mix3(ocean,PALETTE.provisional,clamp((p-.53)/.12,0,1)*.88):ocean;
      vertices.push(...d,0,...col);
    }
  }
  for(let r=0;r<lat;r++)for(let c=0;c<lon;c++){const a=at(r,c),b=at(r,c+1),d=at(r+1,c),e=at(r+1,c+1);indices.push(a,d,b,b,d,e)}
  return{vertices:new Float32Array(vertices),indices:new Uint32Array(indices)};
}

const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aDirection;
layout(location=1) in float aElevation;
layout(location=2) in vec3 aColor;
uniform mat4 uVP;
uniform vec3 uCenter;
uniform float uRadius;
uniform float uRelief;
out vec3 vNormal;
out vec3 vColor;
void main(){vec3 d=normalize(aDirection);vec3 p=uCenter+d*(uRadius+aElevation*uRelief);vNormal=d;vColor=aColor;gl_Position=uVP*vec4(p,1.0);}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vColor;
out vec4 outColor;
void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.46,.76,.42));float sun=max(dot(n,light),0.0);float hemi=.72+.28*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor*(.62+.50*sun)*hemi;outColor=vec4(c,1.0);}`;
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
function vao(mesh){const v=gl.createVertexArray();gl.bindVertexArray(v);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,28,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,1,gl.FLOAT,false,28,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,3,gl.FLOAT,false,28,16);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return v;}
if(!verifyNamedHydrology())throw new Error('REV5_HYDROLOGY_IDENTITY_FAILED');
if(!verifyCandidateDeltaCoast())throw new Error('DELTA_MOUTH_TO_COAST_RECONCILIATION_FAILED');
if(!verifyCandidateEasternConfluence())throw new Error('EASTERN_CONFLUENCE_CANDIDATE_INVALID');
if(!verifySourceDrainageOnCandidateLand())throw new Error('CANDIDATE_RIVERS_OUTSIDE_LAND');
const planetMesh=buildPlanetMesh(),gratitudeMesh=buildGratitudeMesh(),
  hydroMesh=buildHydrologyOverlay(),
  planetVao=vao(planetMesh),gratitudeVao=vao(gratitudeMesh),hydroVao=vao(hydroMesh);

function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),q=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*q,-1,0,0,2*far*near*q,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-dot(x,eye),-dot(y,eye),-dot(z,eye),1]);}
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}

const state={yaw:-.28,pitch:.92,distance:5000,targetU:0,targetV:-620};
function viewScale(){return state.distance<850?'Region':state.distance<2400?'Continent':'Planetary';}
function reliefScale(){return 1+2.8*smooth(1100,5200,state.distance);} // visual exaggeration only
function resize(){
  const cssPixels=Math.max(1,canvas.clientWidth*canvas.clientHeight);
  const pixelBudget=(navigator.maxTouchPoints>0?850000:1800000);
  const dpr=Math.min(1.35,devicePixelRatio||1,Math.sqrt(pixelBudget/cssPixels));
  const w=Math.max(1,Math.round(canvas.clientWidth*dpr)),
    h=Math.max(1,Math.round(canvas.clientHeight*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  gl.viewport(0,0,w,h);
}
function camera(){state.pitch=clamp(state.pitch,.42,1.48);state.distance=clamp(state.distance,130,5600);const dir=tangentDirection(state.targetU,state.targetV),target=surface(dir,0),du=norm(sub(surface(tangentDirection(state.targetU+1,state.targetV)),surface(tangentDirection(state.targetU-1,state.targetV)))),dv=norm(sub(surface(tangentDirection(state.targetU,state.targetV+1)),surface(tangentDirection(state.targetU,state.targetV-1)))),h=norm(add(mul(du,Math.sin(state.yaw)),mul(dv,Math.cos(state.yaw)))),eye=add(add(target,mul(dir,state.distance*Math.sin(state.pitch)+24)),mul(h,state.distance*Math.cos(state.pitch)));return{target,eye,up:dir}}
function draw(mesh,v,VP,relief){gl.bindVertexArray(v);gl.uniformMatrix4fv(gl.getUniformLocation(program,'uVP'),false,VP);gl.uniform3fv(gl.getUniformLocation(program,'uCenter'),CENTER);gl.uniform1f(gl.getUniformLocation(program,'uRadius'),PLANET_RADIUS);gl.uniform1f(gl.getUniformLocation(program,'uRelief'),relief);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0)}
function render(){resize();gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LESS);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const cam=camera(),VP=multiply(perspective(54*Math.PI/180,canvas.width/canvas.height,2,PLANET_RADIUS*4.2),lookAt(cam.eye,cam.target,cam.up));gl.useProgram(program);draw(planetMesh,planetVao,VP,1);draw(gratitudeMesh,gratitudeVao,VP,reliefScale());draw(hydroMesh,hydroVao,VP,reliefScale());scaleLabel.textContent=viewScale();}
function setView(which){
  if(which==='world')Object.assign(state,{distance:5350,pitch:1.00,targetU:0,targetV:-620});
  else if(which==='gratitude')Object.assign(state,{distance:2850,pitch:.92,targetU:0,targetV:-650});
  else{
    const p=regionalMetersToContinentalKm(-139,-216);
    Object.assign(state,{distance:660,pitch:.82,targetU:p.xKm,targetV:p.zKm-LOCAL_CENTER_Z});
  }
  render();
}
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>setView(b.dataset.view));

const pointers=new Map();let lastSingle=null,lastPinch=null;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size===1)lastSingle=[e.clientX,e.clientY]});
canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,[e.clientX,e.clientY]);const pts=[...pointers.values()];if(pts.length===1&&lastSingle){const dx=pts[0][0]-lastSingle[0],dy=pts[0][1]-lastSingle[1];state.yaw-=dx*.0047;state.pitch=clamp(state.pitch+dy*.0032,.42,1.48);lastSingle=pts[0];render()}else if(pts.length>=2){const d=Math.hypot(pts[0][0]-pts[1][0],pts[0][1]-pts[1][1]);if(lastPinch){state.distance=clamp(state.distance*(lastPinch/d),130,5600);render()}lastPinch=d}});
function endPointer(e){pointers.delete(e.pointerId);lastPinch=null;lastSingle=pointers.size===1?[...pointers.values()][0]:null}
canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
canvas.addEventListener('wheel',e=>{e.preventDefault();state.distance=clamp(state.distance*Math.exp(clamp(e.deltaY,-800,800)*.0011),130,5600);render()},{passive:false});
canvas.addEventListener('dblclick',()=>setView('gratitude'));
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();showStatus('WebGL context lost · reload to inspect');});
window.addEventListener('resize',render);

const anchors=Object.freeze(GCR2_ANCHORS.map(anchor=>Object.freeze({
  id:anchor.id,
  ...regionalMetersToContinentalKm(anchor.xMeters,anchor.zMeters),
  ...regionalMetersToGeodetic(anchor.xMeters,anchor.zMeters)
})));
const gcr2Diagnostics=Object.freeze({
  schema:'AUDRALIA_GCR2_INSPECTION_RUNTIME_v1',
  status:'UNAPPROVED_NONPRODUCTION_CANDIDATE',
  model:ECOLOGY_SOURCE.schema,
  world:'AUDRALIA',continent:'GRATITUDE',
  planetRadiusKm:PLANET_RADIUS,focusLatitude:30,focusLongitude:0,
  sourceRev5DrainageCount:GRATITUDE_RIVERS.length,
  sourceRev5LakeCount:GRATITUDE_LAKES.length,
  candidateThreeMouthDeltaReconciled:true,
  candidatePeripheralHeadwatersLandward:true,
  riverBanksClippedToCandidateLand:true,
  candidateEastConfluenceProposedNotCanonical:true,
  oceanwardMeshZMinKm:-2050,
  localPlantsMagnifiedToContinentalScale:false,
  localWaterFlowAssumed:false,
  localCoastLodCandidate:{sourceStepMeters:8,vertexBudget:80000,sharedIndexedMesh:true,deviceVerified:false},
  candidateCoastlineProvisional:true,
  contourVisualExaggerationOnly:true,
  sameCanvasAsGCR1Precedent:true,
  activeAudraliaChanged:false,activeHEarthChanged:false,
  anchors
});
window.__AUDRALIA_GCR2_INSPECTION__=gcr2Diagnostics;
console.info('AUDRALIA_GCR2_CONTINENTAL_ECOLOGY_CANDIDATE',gcr2Diagnostics);
showStatus('Candidate geography · rev5 hydrology and ecological provinces · not live');
render();
