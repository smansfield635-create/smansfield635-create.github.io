import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const c01=(v)=>clamp(v,0,1);
const mix=(a,b,t)=>a+(b-a)*t;
const mix3=(a,b,t)=>[mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];
const smooth=(a,b,v)=>{const t=c01((v-a)/(b-a||1));return t*t*(3-2*t);};
const norm=(v)=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const wrap=(v)=>Math.atan2(Math.sin(v),Math.cos(v));
const radians=(d)=>d*Math.PI/180;
const wrapLon=(v)=>{let x=v;while(x>Math.PI)x-=Math.PI*2;while(x<-Math.PI)x+=Math.PI*2;return x;};

const PALETTE=Object.freeze({
  sky:[0.055,0.075,0.105],
  haze:[0.36,0.42,0.44],
  ocean:[0.055,0.24,0.37],
  oceanDeep:[0.035,0.14,0.25],
  gratitudeLow:[0.29,0.43,0.24],
  gratitudeHigh:[0.39,0.42,0.31],
  gratitudeRock:[0.43,0.41,0.38],
  unresolvedLow:[0.27,0.33,0.28],
  unresolvedHigh:[0.34,0.36,0.33],
  beach:[0.68,0.60,0.44],
  wet:[0.47,0.42,0.32],
  meadow:[0.34,0.45,0.24],
  coastal:[0.28,0.39,0.23],
  upland:[0.31,0.35,0.28],
  rock:[0.40,0.40,0.38],
  estate:[0.41,0.50,0.29],
  earth:[0.35,0.29,0.19],
  reservoir:[0.07,0.27,0.35,0.90],
  waterfall:[0.60,0.80,0.84,0.95],
  localOcean:[0.07,0.30,0.43,0.82]
});

export const AUDRALIA_PLANET_AUTHORING_CONTRACT=Object.freeze({
  schema:'AUDRALIA_NINE_CONTINENT_AUTHORING_MODEL_v1',
  planetIdentity:'AUDRALIA',
  hEarthClass:'PLAYER_EXPERIENCE_ON_AUDRALIA',
  continentCount:9,
  resolvedContinent:'GRATITUDE',
  unresolvedContinentCount:8,
  otherContinentsNarrativelyDefined:false,
  otherContinentsPlacementsCanonical:false,
  gratitudeNineSummitsTrack:true,
  gratitudeSummitAnchorCount:9,
  liveIntegrationAuthorized:false,
  authoringPreviewOnly:true
});

const CONTINENTS=Object.freeze([
  Object.freeze({id:'GRATITUDE',resolved:true,lat:-8,lon:0,lobes:Object.freeze([
    [-8,0,26,31,1.00],[-1,-14,17,18,.88],[-16,15,19,18,.86],[8,8,15,20,.74],[-24,-9,14,18,.70]
  ])}),
  Object.freeze({id:'CONTINENT_02',resolved:false,lat:31,lon:58,lobes:Object.freeze([[31,58,22,24,1],[42,46,13,15,.78],[18,69,14,18,.74]])}),
  Object.freeze({id:'CONTINENT_03',resolved:false,lat:-29,lon:82,lobes:Object.freeze([[-29,82,20,25,1],[-18,94,13,17,.75],[-41,72,12,18,.72]])}),
  Object.freeze({id:'CONTINENT_04',resolved:false,lat:29,lon:126,lobes:Object.freeze([[29,126,20,24,1],[40,139,13,16,.76],[17,115,14,18,.75]])}),
  Object.freeze({id:'CONTINENT_05',resolved:false,lat:-17,lon:159,lobes:Object.freeze([[-17,159,22,25,1],[-31,151,13,18,.72],[-5,171,12,16,.73]])}),
  Object.freeze({id:'CONTINENT_06',resolved:false,lat:37,lon:-147,lobes:Object.freeze([[37,-147,21,25,1],[48,-159,12,16,.70],[24,-136,14,18,.78]])}),
  Object.freeze({id:'CONTINENT_07',resolved:false,lat:-31,lon:-118,lobes:Object.freeze([[-31,-118,21,26,1],[-19,-129,13,17,.75],[-43,-105,12,17,.70]])}),
  Object.freeze({id:'CONTINENT_08',resolved:false,lat:16,lon:-83,lobes:Object.freeze([[16,-83,20,25,1],[29,-73,12,17,.76],[2,-94,13,17,.72]])}),
  Object.freeze({id:'CONTINENT_09',resolved:false,lat:-39,lon:-45,lobes:Object.freeze([[-39,-45,19,24,1],[-27,-56,12,16,.72],[-49,-31,11,16,.68]])})
]);

const GRATITUDE_SUMMITS=Object.freeze([
  [-20,-9,.72],[-16,-5,.78],[-12,-1,.86],[-7,2,.94],[-2,5,1.02],[3,8,1.08],[8,9,1.14],[12,6,1.20],[15,2,1.28]
]);

function continentField(lat,lon,continent){
  let field=0;
  for(const [clat,clon,latRadius,lonRadius,strength] of continent.lobes){
    const dy=(lat-radians(clat))/radians(latRadius);
    const dx=wrapLon(lon-radians(clon))*Math.cos(radians(clat))/radians(lonRadius);
    const r=Math.hypot(dx,dy);
    const coastNoise=.10*Math.sin(lon*7.0+lat*3.4+clon*.07)+.06*Math.sin(lon*13.0-lat*5.0+clat*.11);
    const w=(1-smooth(.58+coastNoise,.99+coastNoise,r))*strength;
    field=Math.max(field,w);
  }
  if(continent.id==='GRATITUDE'){
    const bayDy=(lat-radians(-20))/radians(10);
    const bayDx=wrapLon(lon-radians(5))*Math.cos(radians(-20))/radians(12);
    const bay=Math.hypot(bayDx,bayDy);
    field*=1-.78*(1-smooth(.38,.95,bay));
  }
  return c01(field);
}

function classifyPlanet(lat,lon){
  let best=null;
  let bestField=0;
  for(const continent of CONTINENTS){
    const field=continentField(lat,lon,continent);
    if(field>bestField){bestField=field;best=continent;}
  }
  return {continent:best,field:bestField,land:smooth(.42,.57,bestField)};
}

function summitRelief(lat,lon){
  let total=0;
  for(const [slat,slon,strength] of GRATITUDE_SUMMITS){
    const dy=(lat-radians(slat))/radians(7.0);
    const dx=wrapLon(lon-radians(slon))*Math.cos(radians(slat))/radians(8.0);
    const r2=dx*dx+dy*dy;
    total+=Math.exp(-r2*2.2)*strength;
  }
  return total;
}

function planetSurface(lat,lon){
  const c=classifyPlanet(lat,lon);
  const oceanVariation=.5+.5*Math.sin(lon*2.2+lat*1.7);
  if(!c.continent||c.land<.01){
    return {radius:1,color:mix3(PALETTE.oceanDeep,PALETTE.ocean,oceanVariation*.35),land:0,continentId:null};
  }
  const unresolved=!c.continent.resolved;
  const macro=.35+.22*Math.sin(lon*4.7+lat*2.1)+.18*Math.sin(lon*8.1-lat*5.6);
  const summit=c.continent.id==='GRATITUDE'?summitRelief(lat,lon):0;
  const elevation=c.land*(.010+.012*c.field+.007*macro+(unresolved?0:.010*summit));
  const high=c01((elevation-.014)/.020);
  let color=unresolved?mix3(PALETTE.unresolvedLow,PALETTE.unresolvedHigh,high):mix3(PALETTE.gratitudeLow,PALETTE.gratitudeHigh,high);
  if(!unresolved&&high>.55)color=mix3(color,PALETTE.gratitudeRock,(high-.55)/.45*.7);
  const coast=1-smooth(.52,.70,c.field);
  color=mix3(color,PALETTE.beach,coast*.32*c.land);
  return {radius:1+elevation,color,land:c.land,continentId:c.continent.id};
}

function buildPlanetMesh(){
  const lonSegments=112,latSegments=72;
  const vertices=[],indices=[];
  const continentHits=new Set();
  let landVertices=0,gratitudeVertices=0;
  for(let row=0;row<=latSegments;row++){
    const lat=-Math.PI/2+row/latSegments*Math.PI;
    const cosLat=Math.cos(lat),sinLat=Math.sin(lat);
    for(let col=0;col<=lonSegments;col++){
      const lon=-Math.PI+col/lonSegments*Math.PI*2;
      const surf=planetSurface(lat,lon);
      const direction=[cosLat*Math.cos(lon),sinLat,cosLat*Math.sin(lon)];
      if(surf.land>.15&&surf.continentId){continentHits.add(surf.continentId);landVertices++;if(surf.continentId==='GRATITUDE')gratitudeVertices++;}
      vertices.push(direction[0]*surf.radius,direction[1]*surf.radius,direction[2]*surf.radius,direction[0],direction[1],direction[2],surf.color[0],surf.color[1],surf.color[2]);
    }
  }
  const idx=(r,c)=>r*(lonSegments+1)+c;
  for(let r=0;r<latSegments;r++)for(let c=0;c<lonSegments;c++){
    const a=idx(r,c),b=idx(r,c+1),d=idx(r+1,c),e=idx(r+1,c+1);
    indices.push(a,d,b,b,d,e);
  }
  return Object.freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:Object.freeze({vertexCount:vertices.length/9,triangleCount:indices.length/3,continentCount:continentHits.size,landVertices,gratitudeVertices,unresolvedContinentCount:8,gratitudeResolved:true,gratitudeSummitAnchorCount:GRATITUDE_SUMMITS.length,planetBordersRectangular:false,closedPlanetarySurface:true,otherContinentsPlacementsCanonical:false,authoringPreviewOnly:true})});
}

function gratitudeDisplayElevation(terrain,x,z){
  let y=terrain.presentationElevation;
  if(z<-244){
    const ridge=.9*Math.sin((x+46)/31)+.55*Math.sin((x-17)/17)+.35*Math.sin((x+80)/9);
    const depth=smooth(-244,-318,z);
    y+=ridge*depth*3.1;
  }
  return y;
}

function localColor(terrain,x,z){
  const beach=c01(terrain.coastline?.beachWeight??0),wet=c01(terrain.coastline?.wetSandWeight??0),bar=c01(terrain.coastline?.sandbarWeight??0),site=c01(terrain.sitePreparation?.weight??0);
  const elevation=terrain.presentationElevation;
  const high=c01((elevation-25)/38),low=c01((28-elevation)/22);
  let color=PALETTE.meadow;
  color=mix3(color,PALETTE.coastal,low*.48);
  const dist=terrain.coastline?.distanceToShore??-999;
  const dune=smooth(-42,-14,dist)*(1-smooth(-14,-2,dist));
  color=mix3(color,[.46,.49,.27],dune*.58);
  color=mix3(color,PALETTE.beach,beach*.88);
  color=mix3(color,PALETTE.wet,wet*.58);color=mix3(color,PALETTE.beach,bar*.92);
  color=mix3(color,PALETTE.upland,high*.44);
  color=mix3(color,PALETTE.rock,high*.62);
  if(terrain.insideReservedEstateEnvelope)color=mix3(color,PALETTE.estate,.38);
  color=mix3(color,PALETTE.earth,site*.42);
  return color;
}

function gridNormal(samples,row,col,cols,rows,dx,dz){
  const at=(r,c)=>samples[r*cols+c].displayY;
  const l=at(row,Math.max(0,col-1)),r=at(row,Math.min(cols-1,col+1));
  const b=at(Math.max(0,row-1),col),f=at(Math.min(rows-1,row+1),col);
  return norm([(l-r)/(dx*2),1,(b-f)/(dz*2)]);
}

function brokenSandbarLift(x,z){
  const pieces=[[-145,3,22,6,-.14,.55],[-118,6,18,5,-.08,.42],[-36,10,21,6,.04,.46],[-5,11,24,7,.08,.62],[22,12,15,5,.12,.36],[107,-6,18,5,-.18,.38],[136,-7,20,6,-.13,.48]];
  let best=0;
  for(const [cx,cz,rx,rz,rot,h] of pieces){
    const co=Math.cos(rot),si=Math.sin(rot),dx=x-cx,dz=z-cz;
    const lx=dx*co+dz*si,lz=-dx*si+dz*co;
    const rr=Math.hypot(lx/rx,lz/rz);
    let w=1-smooth(.45,1,rr);
    w*=clamp(.72+.20*Math.sin(lx*.18)+.10*Math.sin(lz*.31+cx),.22,1);
    best=Math.max(best,w*h);
  }
  return best;
}

function buildGratitudeMesh(){
  const domain={xMin:-256,xMax:256,zMin:-320,zMax:64,cols:81,rows:61};
  const dx=(domain.xMax-domain.xMin)/(domain.cols-1),dz=(domain.zMax-domain.zMin)/(domain.rows-1);
  const samples=new Array(domain.cols*domain.rows),vertices=[],indices=[];
  let min=Infinity,max=-Infinity,beachSamples=0;
  for(let row=0;row<domain.rows;row++){
    const z=mix(domain.zMin,domain.zMax,row/(domain.rows-1));
    for(let col=0;col<domain.cols;col++){
      const x=mix(domain.xMin,domain.xMax,col/(domain.cols-1));
      const terrain=sampleTerrain(x,z);if(terrain?.valid!==true)throw new Error(`GRATITUDE_TERRAIN_SAMPLE_INVALID:${x}:${z}`);
      let displayY=gratitudeDisplayElevation(terrain,x,z);
      const candidateBar=c01(terrain.coastline?.sandbarWeight??0);
      if(candidateBar>.01){const sea=HYDRO.seaLevelY;displayY=mix(displayY,sea+.18+brokenSandbarLift(x,z),candidateBar*.82);}
      samples[row*domain.cols+col]={terrain,displayY,x,z};min=Math.min(min,displayY);max=Math.max(max,displayY);if((terrain.coastline?.beachWeight??0)>.1)beachSamples++;
    }
  }
  for(let row=0;row<domain.rows;row++)for(let col=0;col<domain.cols;col++){
    const s=samples[row*domain.cols+col],n=gridNormal(samples,row,col,domain.cols,domain.rows,dx,dz),color=localColor(s.terrain,s.x,s.z);
    vertices.push(s.x,s.displayY,s.z,n[0],n[1],n[2],color[0],color[1],color[2]);
  }
  const idx=(r,c)=>r*domain.cols+c;
  for(let r=0;r<domain.rows-1;r++)for(let c=0;c<domain.cols-1;c++){const a=idx(r,c),b=idx(r,c+1),d=idx(r+1,c),e=idx(r+1,c+1);indices.push(a,d,b,b,d,e);}
  return Object.freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:Object.freeze({validSampleCount:samples.length,triangleCount:indices.length/3,minimumElevation:min,maximumElevation:max,beachSampleCount:beachSamples,gratitudeHighResolution:true,revision7TerrainSourcePreserved:true,displayMountainStaggering:true,brokenSandbarPresentation:true,organicCoastalColorTransition:true,liveTerrainMutation:false})});
}

function buildLocalWaterMesh(){
  const vertices=[],indices=[];const push=(x,y,z,c)=>vertices.push(x,y,z,c[0],c[1],c[2],c[3]);
  const oceanSeg=64,oceanBase=0,oceanY=HYDRO.seaLevelY+.10;
  for(let i=0;i<=oceanSeg;i++){
    const x=mix(-300,300,i/oceanSeg),shore=resolveHEarthMapWideShorelineZ(clamp(x,-256,256))-3;
    push(x,oceanY,shore,PALETTE.localOcean);push(x,oceanY,105,PALETTE.localOcean);
  }
  for(let i=0;i<oceanSeg;i++){const a=oceanBase+i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}
  const res=HYDRO.reservoir,resBase=vertices.length/7,resSeg=64;push(res.center.x,res.waterSurfaceElevation+.10,res.center.z,PALETTE.reservoir);
  for(let i=0;i<=resSeg;i++){const angle=i/resSeg*Math.PI*2,b=resolveHEarthMapWideReservoirBoundaryPoint(angle);push(b.x,res.waterSurfaceElevation+.10,b.z,PALETTE.reservoir);}
  for(let i=0;i<resSeg;i++)indices.push(resBase,resBase+i+1,resBase+i+2);
  const wf=HYDRO.waterfall,wfBase=vertices.length/7,wfSeg=24,crest=sampleTerrain(wf.visibleCrest.x,wf.visibleCrest.z);const top=crest?.valid?gratitudeDisplayElevation(crest,wf.visibleCrest.x,wf.visibleCrest.z)+1.6:res.waterSurfaceElevation+30,bottom=res.waterSurfaceElevation+.55,hw=wf.visibleWaterHalfWidth??7.5;
  for(let i=0;i<=wfSeg;i++){const t=i/wfSeg,x=mix(wf.visibleCrest.x,wf.landing.x,t),z=mix(wf.visibleCrest.z,wf.landing.z,t),y=mix(top,bottom,t);push(x-hw,y,z,PALETTE.waterfall);push(x+hw,y,z,PALETTE.waterfall);}
  for(let i=0;i<wfSeg;i++){const a=wfBase+i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}
  return Object.freeze({vertices:new Float32Array(vertices),indices:new Uint32Array(indices),statistics:Object.freeze({triangleCount:indices.length/3,oceanTriangleCount:oceanSeg*2,reservoirTriangleCount:resSeg,waterfallTriangleCount:wfSeg*2,authoringContextOnly:true,liveWaterMutation:false})});
}

const VS=`#version 300 es
precision highp float;layout(location=0)in vec3 aPosition;layout(location=1)in vec3 aNormal;layout(location=2)in vec3 aColor;uniform mat4 uVP;uniform float uScale;out vec3 vPos;out vec3 vNormal;out vec3 vColor;void main(){vec3 p=vec3(aPosition.x,aPosition.y*uScale,aPosition.z);vPos=aPosition;vNormal=normalize(vec3(aNormal.x,aNormal.y/max(uScale,.0001),aNormal.z));vColor=aColor;gl_Position=uVP*vec4(p,1.0);}`;
const FS=`#version 300 es
precision highp float;in vec3 vPos;in vec3 vNormal;in vec3 vColor;uniform vec3 uEye;uniform vec3 uHaze;uniform float uFogStart;uniform float uFogEnd;out vec4 outColor;void main(){vec3 n=normalize(vNormal);vec3 light=normalize(vec3(.42,.78,.46));float d=max(dot(n,light),0.0);float hemi=.62+.38*clamp(n.y*.5+.5,0.0,1.0);vec3 c=vColor*(.50+.62*d)*hemi;float dist=length(vPos-uEye);float fog=clamp((dist-uFogStart)/max(1.0,uFogEnd-uFogStart),0.0,.72);outColor=vec4(mix(c,uHaze,fog),1.0);}`;
const WATER_VS=`#version 300 es
precision highp float;layout(location=0)in vec3 aPosition;layout(location=1)in vec4 aColor;uniform mat4 uVP;uniform float uScale;out vec4 vColor;void main(){gl_Position=uVP*vec4(aPosition.x,aPosition.y*uScale,aPosition.z,1);vColor=aColor;}`;
const WATER_FS=`#version 300 es
precision highp float;in vec4 vColor;out vec4 outColor;void main(){outColor=vColor;}`;

function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(s)}`);return s;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);return p;}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
function lookAt(eye,target,up){const z=norm(sub(eye,target));let x=cross(up,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x[0]*eye[0]-x[1]*eye[1]-x[2]*eye[2],-y[0]*eye[0]-y[1]*eye[1]-y[2]*eye[2],-z[0]*eye[0]-z[1]*eye[1]-z[2]*eye[2],1]);}
function multiply(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}
function buffers(gl,mesh,stride,attrs){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,mesh.vertices,gl.STATIC_DRAW);for(const [loc,size,off]of attrs){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,off);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.STATIC_DRAW);return{vao};}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const terrainProgram=program(gl,VS,FS),waterProgram=program(gl,WATER_VS,WATER_FS);
  const planetMesh=buildPlanetMesh(),gratitudeMesh=buildGratitudeMesh(),waterMesh=buildLocalWaterMesh();
  const planetBuffers=buffers(gl,planetMesh,9*4,[[0,3,0],[1,3,12],[2,3,24]]),gratitudeBuffers=buffers(gl,gratitudeMesh,9*4,[[0,3,0],[1,3,12],[2,3,24]]),waterBuffers=buffers(gl,waterMesh,7*4,[[0,3,0],[1,4,12]]);
  const state={mode:'PLANET',planetYaw:1.55,planetPitch:.20,planetDistance:3.25,gratitudeYaw:-.62,gratitudePitch:.82,gratitudeDistance:760,targetX:0,targetZ:-132,verticalScale:1.34,renderedFrames:0};
  function resize(){const dpr=Math.min(1.35,window.devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
  function planetCamera(){state.planetPitch=clamp(state.planetPitch,-1.35,1.35);state.planetDistance=clamp(state.planetDistance,1.8,8);const cp=Math.cos(state.planetPitch);return{eye:[state.planetDistance*cp*Math.sin(state.planetYaw),state.planetDistance*Math.sin(state.planetPitch),state.planetDistance*cp*Math.cos(state.planetYaw)],target:[0,0,0]};}
  function gratitudeCamera(){state.gratitudePitch=clamp(state.gratitudePitch,.46,1.49);state.gratitudeDistance=clamp(state.gratitudeDistance,95,1700);state.targetX=clamp(state.targetX,-246,246);state.targetZ=clamp(state.targetZ,-310,54);const t=sampleTerrain(state.targetX,state.targetZ),ty=(t?.valid?gratitudeDisplayElevation(t,state.targetX,state.targetZ):18)*state.verticalScale,cp=Math.cos(state.gratitudePitch),target=[state.targetX,ty,state.targetZ],eye=[target[0]+state.gratitudeDistance*cp*Math.sin(state.gratitudeYaw),target[1]+state.gratitudeDistance*Math.sin(state.gratitudePitch),target[2]+state.gratitudeDistance*cp*Math.cos(state.gratitudeYaw)];return{eye,target};}
  function drawOpaque(mesh,b,cam,scale,fogStart,fogEnd){const proj=perspective(Math.PI/3,canvas.width/canvas.height,.02,state.mode==='PLANET'?20:2600),vp=multiply(proj,lookAt(cam.eye,cam.target,[0,1,0]));gl.useProgram(terrainProgram);gl.uniformMatrix4fv(gl.getUniformLocation(terrainProgram,'uVP'),false,vp);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uScale'),scale);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uEye'),cam.eye);gl.uniform3fv(gl.getUniformLocation(terrainProgram,'uHaze'),PALETTE.haze);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogStart'),fogStart);gl.uniform1f(gl.getUniformLocation(terrainProgram,'uFogEnd'),fogEnd);gl.bindVertexArray(b.vao);gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_INT,0);return vp;}
  function render(){resize();gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(true);gl.clearColor(...PALETTE.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);if(state.mode==='PLANET'){const cam=planetCamera();drawOpaque(planetMesh,planetBuffers,cam,1,20,40);}else{const cam=gratitudeCamera(),vp=drawOpaque(gratitudeMesh,gratitudeBuffers,cam,state.verticalScale,330,820);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(waterProgram);gl.uniformMatrix4fv(gl.getUniformLocation(waterProgram,'uVP'),false,vp);gl.uniform1f(gl.getUniformLocation(waterProgram,'uScale'),state.verticalScale);gl.bindVertexArray(waterBuffers.vao);gl.drawElements(gl.TRIANGLES,waterMesh.indices.length,gl.UNSIGNED_INT,0);gl.depthMask(true);gl.disable(gl.BLEND);}state.renderedFrames++;}
  function orbit(dx,dy){if(state.mode==='PLANET'){state.planetYaw=wrap(state.planetYaw+clamp(Number(dx)||0,-64,64)*.006);state.planetPitch=clamp(state.planetPitch+clamp(Number(dy)||0,-64,64)*.004,-1.35,1.35);}else{state.gratitudeYaw=wrap(state.gratitudeYaw+clamp(Number(dx)||0,-64,64)*.0052);state.gratitudePitch=clamp(state.gratitudePitch+clamp(Number(dy)||0,-64,64)*.0032,.46,1.49);}render();}
  function zoom(delta){if(state.mode==='PLANET')state.planetDistance=clamp(state.planetDistance*Math.exp(clamp(Number(delta)||0,-900,900)*.0012),1.8,8);else state.gratitudeDistance=clamp(state.gratitudeDistance*Math.exp(clamp(Number(delta)||0,-900,900)*.00115),95,1700);render();}
  function zoomByFactor(f){const factor=clamp(Number(f)||1,.75,1.33);if(state.mode==='PLANET')state.planetDistance=clamp(state.planetDistance/factor,1.8,8);else state.gratitudeDistance=clamp(state.gratitudeDistance/factor,95,1700);render();}
  function pan(dx,dz){if(state.mode!=='GRATITUDE')return;state.targetX=clamp(state.targetX+(Number(dx)||0),-246,246);state.targetZ=clamp(state.targetZ+(Number(dz)||0),-310,54);render();}
  function panScreen(dx,dy){if(state.mode!=='GRATITUDE')return;const s=clamp(state.gratitudeDistance*.0021,.28,2.2),rx=Math.cos(state.gratitudeYaw),rz=-Math.sin(state.gratitudeYaw),fx=Math.sin(state.gratitudeYaw),fz=Math.cos(state.gratitudeYaw);pan((-dx*rx+dy*fx)*s,(-dx*rz+dy*fz)*s);}
  function fitWorld(){if(state.mode==='PLANET')Object.assign(state,{planetYaw:1.55,planetPitch:.20,planetDistance:3.25});else Object.assign(state,{gratitudeYaw:-.62,gratitudePitch:.82,gratitudeDistance:760,targetX:0,targetZ:-132});render();}
  function setMode(mode){const next=mode==='GRATITUDE'?'GRATITUDE':'PLANET';state.mode=next;fitWorld();return next;}
  function toggleMode(){return setMode(state.mode==='PLANET'?'GRATITUDE':'PLANET');}
  function getCameraSafety(){return Object.freeze({modeRecognized:state.mode==='PLANET'||state.mode==='GRATITUDE',planetDistanceSafe:state.planetDistance>=1.8&&state.planetDistance<=8,gratitudeDistanceSafe:state.gratitudeDistance>=95&&state.gratitudeDistance<=1700,planetHasNoRectangularBorder:planetMesh.statistics.planetBordersRectangular===false,nineContinentsPresent:planetMesh.statistics.continentCount===9,fitWorldAvailable:true,liveMutationAbsent:true});}
  return Object.freeze({planetMesh,gratitudeMesh,waterMesh,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld,setMode,toggleMode,getMode:()=>state.mode,getCameraSafety,getSnapshot:()=>Object.freeze({...state,planetStatistics:planetMesh.statistics,gratitudeStatistics:gratitudeMesh.statistics,waterStatistics:waterMesh.statistics,planetContract:AUDRALIA_PLANET_AUTHORING_CONTRACT,manorGeometryConstructed:false,liveRuntimeMutated:false,liveNavigationMutated:false,liveWaterMutated:false})});
}

export default createMapWideEnvironmentRenderer;
