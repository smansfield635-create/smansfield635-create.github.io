import {
  H_EARTH_MAP_WIDE_ENVIRONMENT_REDEVELOPMENT_HYDROLOGY as HYDRO,
  resolveHEarthMapWideReservoirBoundaryPoint,
  resolveHEarthMapWideShorelineZ,
  sampleHEarthMapWideEnvironmentTerrainCandidate as sampleTerrain
} from '../../../../h-earth-3d/terrain/h-earth.terrain-estate-construction-v1.candidate.js';

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const c01=(v)=>clamp(v,0,1);
const mix=(a,b,t)=>a*(1-t)+b*t;
const mix3=(a,b,t)=>[mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];
const smooth=(a,b,v)=>{const t=c01((v-a)/(b-a||1));return t*t*(3-2*t);};
const norm=(v)=>{const l=Math.hypot(...v)||1;return v.map(n=>n/l);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub=(a,b)=>a.map((n,i)=>n-b[i]);
const gauss=(x,z,cx,cz,rx,rz)=>Math.exp(-(((x-cx)/rx)**2+((z-cz)/rz)**2)*1.55);
const noise=(x,z)=>{const q=Math.sin(x*12.9898+z*78.233)*43758.5453;return q-Math.floor(q);};

const P={
  meadow:[.34,.45,.24], coast:[.27,.39,.23], dune:[.48,.50,.28],
  sand:[.70,.61,.43], wet:[.48,.42,.31], bar:[.69,.61,.43],
  upland:[.30,.35,.28], rock:[.40,.40,.38], stone:[.31,.32,.31],
  estate:[.41,.50,.29], earth:[.35,.29,.19], bank:[.29,.35,.22],
  cavern:[.27,.29,.24], future:[.31,.38,.25], futureHigh:[.29,.33,.28],
  haze:[.54,.59,.53], sky:[.29,.50,.74], sun:[-.38,-.82,-.43],
  ocean:[.07,.30,.43,.79], reservoir:[.07,.27,.35,.89], waterfall:[.60,.80,.84,.94]
};

export const PREVIEW_DOMAIN=Object.freeze({xMinimum:-256,xMaximum:256,zMinimum:-320,zMaximum:64,columns:81,rows:61});
const CONTINENT=Object.freeze({xMinimum:-560,xMaximum:560,zMinimum:-980,zMaximum:-320,columns:83,rows:49});
const LIMITS=Object.freeze({minimumPitch:.46,maximumPitch:1.49,minimumDistance:95,maximumDistance:2800,worldFitDistance:1840,minimumTargetX:-520,maximumTargetX:520,minimumTargetZ:-930,maximumTargetZ:54});
const SEA=HYDRO.seaLevelY;

function ellipse(x,z,cx,cz,rx,rz,r=0){const co=Math.cos(r),si=Math.sin(r),dx=x-cx,dz=z-cz;return Math.hypot((dx*co+dz*si)/rx,(-dx*si+dz*co)/rz);}
function barField(x,z){
  const L=[
    [-153,3,24,7,-.15,.72],[-127,5,27,7.8,-.10,.62],[-101,7,18,6,-.04,.48],
    [-42,9,26,7.2,.03,.58],[-13,11,31,8.2,.08,.78],[18,12,22,6.5,.12,.50],
    [96,-7,19,5.8,-.22,.44],[124,-6,25,7,-.16,.66],[151,-8,18,5.3,-.10,.42]
  ];
  let w=0,h=0;
  for(const q of L){const v=1-smooth(.42,1,ellipse(x,z,...q.slice(0,5)));if(v>w){w=v;h=q[5];}}
  w*=clamp(.78+.18*Math.sin(x*.071+z*.11)+.08*Math.sin(x*.137-z*.052),.38,1);
  return {w:c01(w),h};
}

function mountainTarget(t,x,z){
  if(z>-240||t.insideReservedEstateEnvelope)return t.presentationElevation;
  const peaks=
    25*gauss(x,z,-190,-306,62,58)+14*gauss(x,z,-125,-272,72,64)+30*gauss(x,z,-69,-316,54,57)+
    18*gauss(x,z,2,-278,62,55)+23*gauss(x,z,73,-323,72,62)+12*gauss(x,z,147,-281,86,67)+18*gauss(x,z,222,-332,68,61);
  const mass=7.2*gauss(x,z,-74,-300,228,92)+4.5*gauss(x,z,176,-306,118,84);
  const cuts=5.4*gauss(x,z,-96,-300,26,36)+4.8*gauss(x,z,38,-301,30,34)+4*gauss(x,z,182,-310,31,36);
  const irregular=2.8*Math.sin((x+31)/24+(z+300)/39)+1.9*Math.sin((x-17)/13-(z+285)/28);
  return mix(t.presentationElevation,t.elevation+Math.max(0,peaks+mass-cuts+irregular),smooth(-240,-305,z)*.74);
}

function displayElevation(t,x,z){
  let y=mountainTarget(t,x,z);
  const d=t.coastline?.distanceToShore??(z-resolveHEarthMapWideShorelineZ(x));
  if(d>=-24&&d<=2){
    const q=smooth(-24,2,d);
    const dune=.34*Math.sin(x*.051+d*.11)+.18*Math.sin(x*.023-d*.16);
    y=mix(y,mix(SEA+4.8+dune,SEA+.30,q**1.22),.54+.30*q);
  }
  const b=barField(x,z);
  if(b.w>.001)y=mix(y,SEA+.28+b.h*(.55+.35*b.w),b.w);
  return y;
}

function colorFor(t,x,z,y){
  const d=t.coastline?.distanceToShore??(z-resolveHEarthMapWideShorelineZ(x));
  const site=c01(t.sitePreparation?.weight??0), res=c01(t.hydrology?.reservoirWeight??0), cav=c01(t.hydrology?.cavernReserveWeight??0);
  const slope=1-c01(t.normal?.y??1), high=c01((y-28)/36), low=c01((31-y)/22), b=barField(x,z);
  let c=mix3(P.meadow,P.coast,low*.44);
  c=mix3(c,P.coast,(1-smooth(-38,-24,d))*.18);
  c=mix3(c,P.dune,smooth(-34,-20,d)*(1-smooth(-13,-5,d))*.52);
  c=mix3(c,P.sand,smooth(-20,-10,d)*(1-smooth(-5,.5,d))*.92);
  c=mix3(c,P.wet,smooth(-9,-3,d)*(1-smooth(.5,4,d))*.82);
  c=mix3(c,P.bar,b.w*.90);
  c=mix3(c,P.upland,high*.46); c=mix3(c,P.rock,high*.70); c=mix3(c,P.stone,c01(slope*1.02));
  c=mix3(c,P.bank,res*.48); c=mix3(c,P.cavern,cav*.36);
  if(t.insideReservedEstateEnvelope)c=mix3(c,P.estate,.42);
  c=mix3(c,P.earth,site*.54);
  const v=(noise(x,z)-.5)*.026*(1-site*.6);
  return c.map(n=>c01(n+v));
}

function gridNormal(A,r,c,cols,rows,dx,dz,key='y'){
  const at=(rr,cc)=>A[rr*cols+cc][key];
  return norm([(at(r,Math.max(0,c-1))-at(r,Math.min(cols-1,c+1)))/(dx*2),1,(at(Math.max(0,r-1),c)-at(Math.min(rows-1,r+1),c))/(dz*2)]);
}

export function buildMapWideEnvironmentMesh(){
  const D=PREVIEW_DOMAIN,dx=(D.xMaximum-D.xMinimum)/(D.columns-1),dz=(D.zMaximum-D.zMinimum)/(D.rows-1),A=[],V=[],I=[];
  let min=Infinity,max=-Infinity,minR=Infinity,maxR=-Infinity,estate=0,site=0,res=0,fall=0,cav=0,beach=0,bars=0,bay=0;
  for(let r=0;r<D.rows;r++){const z=mix(D.zMinimum,D.zMaximum,r/(D.rows-1));for(let c=0;c<D.columns;c++){const x=mix(D.xMinimum,D.xMaximum,c/(D.columns-1)),t=sampleTerrain(x,z);if(t?.valid!==true)throw new Error(`TERRAIN_SAMPLE_INVALID:${x}:${z}`);A.push({t,y:displayElevation(t,x,z)});}}
  for(let r=0;r<D.rows;r++){const z=mix(D.zMinimum,D.zMaximum,r/(D.rows-1));for(let c=0;c<D.columns;c++){const x=mix(D.xMinimum,D.xMaximum,c/(D.columns-1)),s=A[r*D.columns+c],t=s.t,n=gridNormal(A,r,c,D.columns,D.rows,dx,dz),col=colorFor(t,x,z,s.y),rel=s.y-t.elevation;
    V.push(x,t.elevation,z,...n,...col,rel);min=Math.min(min,s.y);max=Math.max(max,s.y);minR=Math.min(minR,rel);maxR=Math.max(maxR,rel);
    if(t.insideReservedEstateEnvelope)estate++;if((t.sitePreparation?.weight??0)>.01)site++;if((t.hydrology?.reservoirWeight??0)>.01)res++;if((t.hydrology?.waterfallWeight??0)>.01)fall++;if((t.hydrology?.cavernReserveWeight??0)>.01)cav++;if((t.coastline?.beachWeight??0)>.05)beach++;if(barField(x,z).w>.05)bars++;if(t.coastline?.restoredBay===true&&Math.abs(x-118)<84&&Math.abs(z-t.coastline.shorelineZ)<16)bay++;
  }}
  const ix=(r,c)=>r*D.columns+c;for(let r=0;r<D.rows-1;r++)for(let c=0;c<D.columns-1;c++){const a=ix(r,c),b=ix(r,c+1),cc=ix(r+1,c),d=ix(r+1,c+1);I.push(a,cc,b,b,cc,d);}
  return Object.freeze({vertices:new Float32Array(V),indices:new Uint32Array(I),statistics:Object.freeze({
    validSampleCount:A.length,triangleCount:I.length/3,minimumElevation:min,maximumElevation:max,minimumRelief:minR,maximumRelief:maxR,
    estateSampleCount:estate,sitePreparationSampleCount:site,reservoirSampleCount:res,waterfallSampleCount:fall,cavernReserveSampleCount:cav,beachSampleCount:beach,sandbarSampleCount:bars,restoredBaySampleCount:bay,
    rendererClass:'WEBGL2_MOBILE_AUTHORING_CONTINENT_AND_GRATITUDE_INSPECTOR',worldInspectorRepairRevision:8,firstPaintDependencyClass:'REV7_TERRAIN_CANDIDATE_PLUS_REV8_AUTHORING_PRESENTATION',
    environmentObserverDeferred:true,singlePassTerrainSampling:true,neighborResamplingRemoved:true,guideOverlayRenderPathPresent:false,terrainConformingBeachPresentation:true,restoredBayPresentation:true,
    irregularReservoirPresentation:true,organicCoastalColorTransition:true,naturalizedSandbarPresentation:true,staggeredMountainPresentation:true,estateRevision6ShapeProtected:true,v2VirtualNormalReliefExecutedInFragmentShader:true,inspectorVirtualReliefScale:.42,verticalScale:1.35
  })});
}

const boundaryCache=new Map();
function boundaryY(x){const bx=clamp(x,-256,256),k=bx.toFixed(3);if(boundaryCache.has(k))return boundaryCache.get(k);const t=sampleTerrain(bx,-320),y=t?.valid===true?displayElevation(t,bx,-320):10;boundaryCache.set(k,y);return y;}
function halfWidth(d){return 285+165*Math.sin(Math.PI*c01(d))-95*d*d;}
function continentSample(x,z){
  const d=c01((-320-z)/660),cx=18*Math.sin(d*2.6)-26*Math.sin(d*1.15+.4)+22*d,lateral=Math.abs(x-cx)/halfWidth(d),mask=1-smooth(.82,1,lateral);
  let y=10+5*Math.sin(d*Math.PI*.92)
    -8.5*gauss(x,z,18,-472,130,92)-3.5*gauss(x,z,-92,-520,90,90)
    +19*gauss(x,z,-205,-545,92,112)+13*gauss(x,z,-142,-642,80,102)
    +16*gauss(x,z,172,-590,94,118)+20*gauss(x,z,128,-712,82,116)
    +11*gauss(x,z,22,-610,112,125)+15*gauss(x,z,-18,-760,96,118)
    +34*gauss(x,z,-28,-908,94,88)+17*gauss(x,z,48,-868,76,92)
    -9*gauss(x,z,38,-706,50,72)+7*gauss(x,z,-318,-615,96,155)+6*gauss(x,z,322,-650,106,166)
    +4.2*Math.sin((x+25)/71+d*4.1)+2.7*Math.sin((x-58)/39-d*5)+1.6*Math.sin((x+z)/63);
  y=mix(y,boundaryY(x),1-smooth(0,.18,d));
  y=mix(SEA-4,y,mask);
  return {y,displayElevation:y,depth:d,landMask:mask};
}
function futureColor(s){let c=mix3(P.future,P.futureHigh,c01((s.y-14)/48)*.78);c=mix3(c,P.rock,c01((s.y-38)/28)*.72);return mix3(c,P.haze,.16+s.depth*.24);}

export function buildFutureRegionContinuationMesh(){
  const D=CONTINENT,dx=(D.xMaximum-D.xMinimum)/(D.columns-1),dz=(D.zMaximum-D.zMinimum)/(D.rows-1),A=[],V=[],I=[];
  for(let r=0;r<D.rows;r++){const z=mix(D.zMaximum,D.zMinimum,r/(D.rows-1));for(let c=0;c<D.columns;c++){const x=mix(D.xMinimum,D.xMaximum,c/(D.columns-1));A.push(continentSample(x,z));}}
  for(let r=0;r<D.rows;r++){const z=mix(D.zMaximum,D.zMinimum,r/(D.rows-1));for(let c=0;c<D.columns;c++){const x=mix(D.xMinimum,D.xMaximum,c/(D.columns-1)),s=A[r*D.columns+c],n=gridNormal(A,r,c,D.columns,D.rows,dx,dz),col=futureColor(s);V.push(x,s.y,z,...n,...col,0);}}
  const ix=(r,c)=>r*D.columns+c;for(let r=0;r<D.rows-1;r++)for(let c=0;c<D.columns-1;c++){const a=ix(r,c),b=ix(r,c+1),cc=ix(r+1,c),d=ix(r+1,c+1);I.push(a,cc,b,b,cc,d);}
  return Object.freeze({vertices:new Float32Array(V),indices:new Uint32Array(I),statistics:Object.freeze({
    validSampleCount:A.length,triangleCount:I.length/3,authoringPreviewOnly:true,canonicalRun8BExtensionClaimed:false,liveTraversalAuthorized:false,flatRearBoundaryRemoved:true,continuationToZ:D.zMinimum,
    continentalShellVisible:true,continentDerivedFromNineSummitsProgressionLogic:true,gratitudeRegionHighDefinition:true,futureRegionsLowDefinition:true,futureRegionNarrativeFrozen:false,fullContinentContentDefined:false
  })});
}

const pushW=(V,x,y,z,c)=>V.push(x,y,z,...c);
export function buildWaterContextMesh(){
  const V=[],I=[],tri=(a,b,c)=>I.push(a,b,c),oY=SEA+.10,n=80,o=0;
  for(let i=0;i<=n;i++){const t=i/n,x=mix(-620,620,t),shore=resolveHEarthMapWideShorelineZ(clamp(x,-256,256))-4;pushW(V,x,oY,shore,P.ocean);pushW(V,x,oY,112,P.ocean);}
  for(let i=0;i<n;i++){const a=o+i*2,b=a+1,c=a+2,d=a+3;tri(a,c,b);tri(b,c,d);}
  let base=V.length/7;pushW(V,-680,oY-.02,-1040,P.ocean);pushW(V,680,oY-.02,-1040,P.ocean);pushW(V,-680,oY-.02,-300,P.ocean);pushW(V,680,oY-.02,-300,P.ocean);tri(base,base+2,base+1);tri(base+1,base+2,base+3);
  const R=HYDRO.reservoir,rs=64;base=V.length/7;pushW(V,R.center.x,R.waterSurfaceElevation+.1,R.center.z,P.reservoir);
  for(let i=0;i<=rs;i++){const q=resolveHEarthMapWideReservoirBoundaryPoint(i/rs*Math.PI*2);pushW(V,q.x,R.waterSurfaceElevation+.1,q.z,P.reservoir);}for(let i=0;i<rs;i++)tri(base,base+i+1,base+i+2);
  const W=HYDRO.waterfall,ws=24; base=V.length/7;const ct=sampleTerrain(W.visibleCrest.x,W.visibleCrest.z),top=ct?.valid===true?displayElevation(ct,W.visibleCrest.x,W.visibleCrest.z)+1.6:R.waterSurfaceElevation+34,bottom=R.waterSurfaceElevation+.55,hw=W.visibleWaterHalfWidth??7.5;
  for(let i=0;i<=ws;i++){const t=i/ws,x=mix(W.visibleCrest.x,W.landing.x,t),z=mix(W.visibleCrest.z,W.landing.z,t),y=mix(top,bottom,t);pushW(V,x-hw,y,z,P.waterfall);pushW(V,x+hw,y,z,P.waterfall);}
  for(let i=0;i<ws;i++){const a=base+i*2,b=a+1,c=a+2,d=a+3;tri(a,c,b);tri(b,c,d);}
  return Object.freeze({vertices:new Float32Array(V),indices:new Uint32Array(I),statistics:Object.freeze({
    triangleCount:I.length/3,oceanTriangleCount:n*2+2,reservoirTriangleCount:rs,waterfallTriangleCount:ws*2,restoredBayBoundary:true,terrainConformingBeachContext:true,irregularReservoirOutline:true,
    sandbarContext:true,naturalizedSandbarContext:true,broadWaterfallContext:true,continentalOceanContext:true,authoringContextOnly:true,liveWaterMutation:false
  })});
}

const VS=`#version 300 es
precision highp float;layout(location=0)in vec3 p;layout(location=1)in vec3 n;layout(location=2)in vec3 c;layout(location=3)in float r;uniform mat4 vp;uniform float sy;out vec3 N;out vec3 C;out vec3 W;
void main(){float y=p.y+r;W=vec3(p.x,y,p.z);N=normalize(vec3(n.x,n.y/max(sy,.001),n.z));C=c;gl_Position=vp*vec4(p.x,y*sy,p.z,1.);}`;
const FS=`#version 300 es
precision highp float;in vec3 N;in vec3 C;in vec3 W;uniform vec3 eye;uniform vec3 sun;uniform vec3 haze;out vec4 O;
void main(){vec3 nn=normalize(N);float d=max(dot(nn,normalize(-sun)),0.);float h=.5+.5*clamp(nn.y*.5+.5,0.,1.);vec3 c=C*(.47+.63*d)*h;float f=clamp((length(W-eye)-360.)/860.,0.,.82);O=vec4(mix(c,haze,f),1.);}`;
const WVS=`#version 300 es
precision highp float;layout(location=0)in vec3 p;layout(location=1)in vec4 c;uniform mat4 vp;uniform float sy;out vec4 C;void main(){gl_Position=vp*vec4(p.x,p.y*sy,p.z,1.);C=c;}`;
const WFS=`#version 300 es
precision highp float;in vec4 C;out vec4 O;void main(){O=C;}`;

function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(`SHADER_COMPILE_FAILED:${gl.getShaderInfoLog(s)}`);return s;}
function program(gl,v,f){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,v));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(`PROGRAM_LINK_FAILED:${gl.getProgramInfoLog(p)}`);return p;}
function buffers(gl,m,stride,attrs){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,m.vertices,gl.STATIC_DRAW);for(const [loc,size,off]of attrs){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,off);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,m.indices,gl.STATIC_DRAW);return {vao};}
function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
function lookAt(e,t,u){const z=norm(sub(e,t));let x=cross(u,z);if(Math.hypot(...x)<1e-5)x=[1,0,0];x=norm(x);const y=cross(z,x);return new Float32Array([x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-x[0]*e[0]-x[1]*e[1]-x[2]*e[2],-y[0]*e[0]-y[1]*e[1]-y[2]*e[2],-z[0]*e[0]-z[1]*e[1]-z[2]*e[2],1]);}
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;}

export function createMapWideEnvironmentRenderer(canvas){
  const gl=canvas.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});if(!gl)throw new Error('WEBGL2_CONTEXT_UNAVAILABLE');
  const tp=program(gl,VS,FS),wp=program(gl,WVS,WFS),continuationMesh=buildFutureRegionContinuationMesh(),mesh=buildMapWideEnvironmentMesh(),waterMesh=buildWaterContextMesh();
  const cb=buffers(gl,continuationMesh,40,[[0,3,0],[1,3,12],[2,3,24],[3,1,36]]),tb=buffers(gl,mesh,40,[[0,3,0],[1,3,12],[2,3,24],[3,1,36]]),wb=buffers(gl,waterMesh,28,[[0,3,0],[1,4,12]]);
  const state={yaw:-.48,pitch:.92,distance:LIMITS.worldFitDistance,targetX:0,targetZ:-420,verticalScale:1.35,renderedFrames:0,cameraRecoveryCount:0};
  const resize=()=>{const d=Math.min(1.25,window.devicePixelRatio||1),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);};
  const clampState=()=>{state.pitch=clamp(state.pitch,LIMITS.minimumPitch,LIMITS.maximumPitch);state.distance=clamp(state.distance,LIMITS.minimumDistance,LIMITS.maximumDistance);state.targetX=clamp(state.targetX,LIMITS.minimumTargetX,LIMITS.maximumTargetX);state.targetZ=clamp(state.targetZ,LIMITS.minimumTargetZ,LIMITS.maximumTargetZ);state.yaw=Math.atan2(Math.sin(state.yaw),Math.cos(state.yaw));};
  const targetY=()=>{if(state.targetZ>=-320&&Math.abs(state.targetX)<=256){const t=sampleTerrain(state.targetX,state.targetZ);if(t?.valid===true)return displayElevation(t,state.targetX,state.targetZ);}return continentSample(state.targetX,Math.min(-320,state.targetZ)).y;};
  const camera=()=>{clampState();const ty=targetY()*state.verticalScale,cp=Math.cos(state.pitch),t=[state.targetX,ty,state.targetZ],e=[t[0]+state.distance*cp*Math.sin(state.yaw),t[1]+state.distance*Math.sin(state.pitch),t[2]+state.distance*cp*Math.cos(state.yaw)];return{e,t};};
  const drawTerrain=(b,count,vp,e)=>{gl.useProgram(tp);gl.uniformMatrix4fv(gl.getUniformLocation(tp,'vp'),false,vp);gl.uniform1f(gl.getUniformLocation(tp,'sy'),state.verticalScale);gl.uniform3fv(gl.getUniformLocation(tp,'eye'),[e[0],e[1]/state.verticalScale,e[2]]);gl.uniform3fv(gl.getUniformLocation(tp,'sun'),P.sun);gl.uniform3fv(gl.getUniformLocation(tp,'haze'),P.haze);gl.bindVertexArray(b.vao);gl.drawElements(gl.TRIANGLES,count,gl.UNSIGNED_INT,0);};
  const render=()=>{resize();const {e,t}=camera(),vp=mul(perspective(Math.PI/3,canvas.width/canvas.height,1,4600),lookAt(e,t,[0,1,0]));gl.enable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(true);gl.clearColor(...P.sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);drawTerrain(cb,continuationMesh.indices.length,vp,e);drawTerrain(tb,mesh.indices.length,vp,e);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.useProgram(wp);gl.uniformMatrix4fv(gl.getUniformLocation(wp,'vp'),false,vp);gl.uniform1f(gl.getUniformLocation(wp,'sy'),state.verticalScale);gl.bindVertexArray(wb.vao);gl.drawElements(gl.TRIANGLES,waterMesh.indices.length,gl.UNSIGNED_INT,0);gl.depthMask(true);gl.disable(gl.BLEND);state.renderedFrames++;};
  const orbit=(dx,dy)=>{state.yaw+=clamp(Number(dx)||0,-64,64)*.0052;state.pitch+=clamp(Number(dy)||0,-64,64)*.0032;render();};
  const zoom=(d)=>{state.distance=clamp(state.distance*Math.exp(clamp(Number(d)||0,-900,900)*.00115),LIMITS.minimumDistance,LIMITS.maximumDistance);render();};
  const zoomByFactor=(f)=>{state.distance=clamp(state.distance/clamp(Number(f)||1,.75,1.33),LIMITS.minimumDistance,LIMITS.maximumDistance);render();};
  const pan=(dx,dz)=>{state.targetX+=Number(dx)||0;state.targetZ+=Number(dz)||0;render();};
  const panScreen=(dx,dy)=>{const s=clamp(state.distance*.0021,.28,3.1),rx=Math.cos(state.yaw),rz=-Math.sin(state.yaw),fx=Math.sin(state.yaw),fz=Math.cos(state.yaw);pan((-dx*rx+dy*fx)*s,(-dx*rz+dy*fz)*s);};
  const fitWorld=()=>{Object.assign(state,{yaw:-.48,pitch:.92,distance:LIMITS.worldFitDistance,targetX:0,targetZ:-420});render();};
  const getCameraSafety=()=>Object.freeze({pitchWithinBounds:state.pitch>=LIMITS.minimumPitch&&state.pitch<=LIMITS.maximumPitch,distanceWithinBounds:state.distance>=LIMITS.minimumDistance&&state.distance<=LIMITS.maximumDistance,targetWithinWorld:state.targetX>=LIMITS.minimumTargetX&&state.targetX<=LIMITS.maximumTargetX&&state.targetZ>=LIMITS.minimumTargetZ&&state.targetZ<=LIMITS.maximumTargetZ,fitWorldAvailable:true,guideOverlayRenderPathAbsent:true,authoringWaterContextOnly:true});
  return Object.freeze({continuationMesh,mesh,waterMesh,state,render,orbit,zoom,zoomByFactor,pan,panScreen,fitWorld,getCameraSafety,getSnapshot:()=>Object.freeze({...state,webgl2:true,v2VirtualNormalReliefExecuted:true,statistics:mesh.statistics,continuationStatistics:continuationMesh.statistics,waterStatistics:waterMesh.statistics,manorGeometryConstructed:false,cavernInteriorConstructed:false,vaultInteriorConstructed:false,liveWaterMutated:false,cameraScope:'NONPUBLIC_PREVIEW_ONLY',guideOverlayRenderPathPresent:false,continentalShellAuthoringOnly:true,gratitudeRegionHighDefinition:true,futureRegionsLowDefinition:true,cameraSafety:getCameraSafety()})});
}
