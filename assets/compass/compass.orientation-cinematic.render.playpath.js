import {createCinematicRenderer as createLegacyRenderer} from './compass.orientation-cinematic.render.js?playpath-base=a378cb421db0e663';

const WRAPPER_SCHEMA='COMPASS_MAIN_HOMEPAGE_CINEMATIC_RENDERER_PLAYPATH_REPAIR_v1';
const WINGS=['north','east','south','west'];
const PALETTE=Object.freeze({north:[.72,.88,1],east:[.56,.92,1],south:[1,.82,.48],west:[.96,.68,.46]});
const SPHERE=Object.freeze({horizontalRadius:1.50,verticalRadius:1.34,depthRadius:1.16,primaryAnchor:[0,.625,.78],vectors:Object.freeze({north:[0,1,0],east:[1,0,0],south:[0,-1,0],west:[-1,0,0]})});
const MATERIAL=Object.freeze({idle:Object.freeze({specular:1.18,rim:1.02,emissive:.17,alpha:.90,sparkle:.26,halo:.82,contrast:1.16}),focused:Object.freeze({specular:1.50,rim:1.30,emissive:.24,alpha:.96,sparkle:.36,halo:1.18,contrast:1.24})});
const MIRRORLAND=Object.freeze({
  designWidth:480,designHeight:720,dormantScale:.30,focusedScale:1,dormantOpacity:.38,focusedOpacity:1,
  leadWidthDormant:4.5,leadWidthFocused:8,innerLeadWidthDormant:1.4,innerLeadWidthFocused:4,
  colors:Object.freeze({frameNearBlack:[5,8,15],frameEdge:[37,48,68],leadDark:[17,21,29],leadLight:[69,80,101],cyan:[87,210,231],blue:[67,112,204],violet:[133,83,201],amber:[226,164,79],rose:[198,85,132],paleCyan:[161,235,244],paleBlue:[143,181,234],paleViolet:[184,149,232],paleAmber:[239,202,132],paleRose:[229,151,185]})
});
const MIRROR_PANES=Object.freeze([
  ['crown-left','paleCyan',[[240,46],[164,106],[204,168],[240,134]],.74,.45,.86,.20],
  ['crown-right','paleViolet',[[240,46],[240,134],[278,168],[318,106]],.72,.42,.82,.62],
  ['upper-left-edge','blue',[[164,106],[98,210],[154,246],[204,168]],.72,.28,.62,.92],
  ['upper-right-edge','violet',[[318,106],[278,168],[326,246],[382,210]],.74,.30,.66,1.22],
  ['upper-center-left','cyan',[[204,168],[154,246],[216,268],[240,208],[240,134]],.66,.38,.78,1.50],
  ['upper-center-right','rose',[[240,134],[240,208],[264,268],[326,246],[278,168]],.68,.36,.76,1.84],
  ['mid-left-high','paleBlue',[[98,210],[66,332],[148,338],[154,246]],.68,.25,.56,2.20],
  ['mid-left-inner','violet',[[154,246],[148,338],[212,334],[216,268]],.74,.30,.72,2.52],
  ['mid-center','paleAmber',[[216,268],[212,334],[240,382],[268,334],[264,268],[240,208]],.70,.48,.90,2.92],
  ['mid-right-inner','cyan',[[264,268],[268,334],[332,338],[326,246]],.72,.31,.73,3.20],
  ['mid-right-high','blue',[[326,246],[332,338],[414,332],[382,210]],.68,.26,.57,3.58],
  ['lower-left-edge','rose',[[66,332],[82,470],[156,446],[148,338]],.72,.25,.58,3.90],
  ['lower-left-center','cyan',[[148,338],[156,446],[216,430],[240,382],[212,334]],.70,.34,.75,4.20],
  ['lower-right-center','violet',[[268,334],[240,382],[264,430],[324,446],[332,338]],.72,.34,.75,4.56],
  ['lower-right-edge','amber',[[332,338],[324,446],[398,470],[414,332]],.70,.28,.59,4.92],
  ['lower-left-deep','blue',[[82,470],[116,594],[192,530],[156,446]],.72,.24,.56,5.22],
  ['lower-center-left','paleViolet',[[156,446],[192,530],[240,624],[240,500],[216,430]],.72,.40,.82,5.54],
  ['lower-center-right','paleRose',[[264,430],[240,500],[240,624],[288,530],[324,446]],.72,.40,.82,5.88],
  ['lower-right-deep','cyan',[[324,446],[288,530],[364,594],[398,470]],.70,.25,.57,6.20],
  ['base-left','amber',[[116,594],[168,660],[240,676],[240,624],[192,530]],.68,.35,.72,6.54],
  ['base-right','blue',[[288,530],[240,624],[240,676],[312,660],[364,594]],.70,.34,.72,6.86]
]);
const MIRROR_FRAME=Object.freeze([
  Object.freeze([[240,34],[165,78],[104,144],[66,232],[48,350],[58,482],[96,590],[158,662],[240,694]]),
  Object.freeze([[240,34],[315,78],[376,144],[414,232],[432,350],[422,482],[384,590],[322,662],[240,694]])
]);

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a||1));return t*t*(3-2*t);};
const normalize=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const subtract=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const qNormalize=q=>{const l=Math.hypot(...q)||1;return q.map(x=>x/l);};
const qConjugate=q=>[-q[0],-q[1],-q[2],q[3]];
function qMultiplyRaw(a,b){return[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];}
function qRotate(q,v){const p=[v[0],v[1],v[2],0],n=qNormalize(q),r=qMultiplyRaw(qMultiplyRaw(n,p),qConjugate(n));return[r[0],r[1],r[2]];}
function qFromUnitVectors(aValue,bValue){const a=normalize(aValue),b=normalize(bValue),c=clamp(dot(a,b),-1,1);if(c>.999999)return[0,0,0,1];if(c<-.999999){let axis=cross([1,0,0],a);if(Math.hypot(...axis)<1e-6)axis=cross([0,1,0],a);axis=normalize(axis);return[axis[0],axis[1],axis[2],0];}const axis=cross(a,b);return qNormalize([axis[0],axis[1],axis[2],1+c]);}
function qSlerp(aValue,bValue,t){const a=qNormalize(aValue);let b=qNormalize(bValue);let c=a.reduce((sum,x,i)=>sum+x*b[i],0);if(c<0){b=b.map(x=>-x);c=-c;}if(c>.9995)return qNormalize(a.map((x,i)=>mix(x,b[i],t)));const th=Math.acos(clamp(c,-1,1)),st=Math.sin(th),wa=Math.sin((1-t)*th)/st,wb=Math.sin(t*th)/st;return qNormalize(a.map((x,i)=>x*wa+b[i]*wb));}
function rotatePoint(p,rx,ry,rz){let[x,y,z]=p;let c=Math.cos(rx),s=Math.sin(rx);[y,z]=[y*c-z*s,y*s+z*c];c=Math.cos(ry);s=Math.sin(ry);[x,z]=[x*c+z*s,-x*s+z*c];c=Math.cos(rz);s=Math.sin(rz);[x,y]=[x*c-y*s,x*s+y*c];return[x,y,z];}
function rgba255(rgb,a){return`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;}

function buildDiamondStarMesh(){const points=8,radius=.72,inner=.30,depth=.42,crown=.20,vertices=[],faces=[],add=p=>(vertices.push(p),vertices.length-1),face=(a,b,c)=>faces.push([a,b,c]);const fa=add([0,0,depth]),ra=add([0,0,-depth]),fc=add([0,0,depth+crown]),rc=add([0,0,-depth-crown*.72]),outer=[],innerRing=[],front=[],rear=[];for(let i=0;i<points*2;i++){const point=i%2===0,a=Math.PI*2*i/(points*2)-Math.PI/2,r=point?radius:inner,ys=.78,ridge=point?.05:-.02;outer.push(add([Math.cos(a)*r,Math.sin(a)*r*ys,ridge]));innerRing.push(add([Math.cos(a)*r*.38,Math.sin(a)*r*ys*.38,depth*.14]));front.push(add([Math.cos(a)*r*.72,Math.sin(a)*r*ys*.72,depth*.52]));rear.push(add([Math.cos(a)*r*.68,Math.sin(a)*r*ys*.68,-depth*.48]));}for(let i=0;i<outer.length;i++){const n=(i+1)%outer.length;face(fa,innerRing[i],innerRing[n]);face(fc,front[n],front[i]);face(front[i],outer[i],outer[n]);face(front[i],outer[n],front[n]);face(innerRing[i],front[i],front[n]);face(innerRing[i],front[n],innerRing[n]);face(ra,rear[n],rear[i]);face(rc,rear[i],rear[n]);face(rear[i],outer[n],outer[i]);face(rear[i],rear[n],outer[n]);}return{vertices,faces};}
const DIAMOND=buildDiamondStarMesh();
const colorCss=(rgb,a=1)=>`rgba(${Math.round(rgb[0]*255)},${Math.round(rgb[1]*255)},${Math.round(rgb[2]*255)},${a})`;
function drawCrystal(ctx,cx,cy,scale,color,rotation,material,depthScore,primary){const hr=scale*(1.15+material.halo*.3),halo=ctx.createRadialGradient(cx,cy,0,cx,cy,hr);halo.addColorStop(0,colorCss(color,.10*material.halo*(.6+primary*.4)));halo.addColorStop(.48,colorCss(color,.045*material.halo));halo.addColorStop(1,colorCss(color,0));ctx.fillStyle=halo;ctx.beginPath();ctx.arc(cx,cy,hr,0,Math.PI*2);ctx.fill();const points=DIAMOND.vertices.map(p=>{const r=rotatePoint(p,-.08,.10,rotation*.12),perspective=1/(1-r[2]*.20);return{x:cx+r[0]*scale*perspective,y:cy+r[1]*scale*perspective,z:r[2],raw:r};});const key=normalize([-.45,.72,.53]);const faces=DIAMOND.faces.map((f,i)=>{const a=points[f[0]],b=points[f[1]],c=points[f[2]],normal=normalize(cross(subtract(b.raw,a.raw),subtract(c.raw,a.raw))),front=Math.max(0,dot(normal,key)),camera=Math.max(0,normal[2]),lift=.84+(i%7)*.034+(i%5===0?.13:0),light=.34+front*.56+camera*.18+material.emissive*.22,spark=i%11===0?material.sparkle*.12:0;return{f,z:(a.z+b.z+c.z)/3,fill:color.map(v=>clamp(v*lift*light+spark,0,1)),alpha:material.alpha*(.68+depthScore*.26)};}).sort((a,b)=>a.z-b.z);for(const item of faces){const[a,b,c]=item.f.map(i=>points[i]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.fillStyle=colorCss(item.fill,item.alpha);ctx.fill();ctx.strokeStyle=colorCss(color,.08+primary*.08);ctx.lineWidth=Math.max(.5,scale*.004);ctx.stroke();}}
function constellationPositions(width,height,q,elapsedMs,foreground){const positions=[];for(const wing of WINGS){const unit=qRotate(q,SPHERE.vectors[wing]),x=unit[0]*SPHERE.horizontalRadius,y=unit[1]*SPHERE.verticalRadius,z=unit[2]*SPHERE.depthRadius,depth=(unit[2]+1)/2,primary=clamp((dot(unit,normalize(SPHERE.primaryAnchor))+1)/2),perspective=.78+depth*.38,cx=width*.5+x*width*.155*perspective,cy=height*.50-y*height*.18*perspective,focused=wing===foreground,scale=Math.min(width,height)*.13*perspective*(focused?1.24:.88),material=focused?MATERIAL.focused:MATERIAL.idle;positions.push({wing,cx,cy,z,depth,primary,scale,material,rotation:elapsedMs*.00016+(WINGS.indexOf(wing)*1.37+.22)});}positions.sort((a,b)=>a.z-b.z);return positions;}
function drawConstellation(ctx,width,height,q,elapsedMs,foreground,alpha=1){ctx.save();ctx.globalAlpha=alpha;for(const item of constellationPositions(width,height,q,elapsedMs,foreground))drawCrystal(ctx,item.cx,item.cy,item.scale,PALETTE[item.wing],item.rotation,item.material,item.depth,item.primary);ctx.restore();}
function constellationFrame(p){const anchor=normalize(SPHERE.primaryAnchor),qNorth=qFromUnitVectors(SPHERE.vectors.north,anchor),qEast=qFromUnitVectors(SPHERE.vectors.east,anchor),turn=smooth(.24,.66,p),q=qSlerp(qNorth,qEast,turn);return{q,foreground:turn<.52?'north':'east'};}
function redrawOrientation(stage,p,elapsedMs){const scene=stage.querySelector('[data-scene="S02"]');if(!scene)return;const canvas=scene.querySelector('canvas'),rect=scene.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);if(!canvas||rect.width<=0||rect.height<=0)return;if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));}const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);const{q,foreground}=constellationFrame(p);for(const item of constellationPositions(rect.width,rect.height,q,elapsedMs,foreground))drawCrystal(ctx,item.cx,item.cy,item.scale,PALETTE[item.wing],item.rotation,item.material,item.depth,item.primary);}
function tracePane(ctx,points){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();}
function drawMirrorWindow(ctx,width,height,reveal,crossAmount,elapsedMs){const focus=smooth(0,1,reveal),sourceScale=mix(MIRRORLAND.dormantScale,MIRRORLAND.focusedScale,focus),scale=sourceScale*mix(1,2.06,crossAmount),opacity=mix(MIRRORLAND.dormantOpacity,MIRRORLAND.focusedOpacity,focus)*(1-smooth(.84,1,crossAmount)*.16),fit=Math.min(width/(MIRRORLAND.designWidth*1.18),height/(MIRRORLAND.designHeight*1.10)),finalScale=fit*scale,tx=width*.5-MIRRORLAND.designWidth*.5*finalScale,ty=height*.5-MIRRORLAND.designHeight*.5*finalScale;ctx.save();ctx.globalAlpha=opacity;ctx.translate(tx,ty);ctx.scale(finalScale,finalScale);const glow=ctx.createRadialGradient(240,350,18,240,350,330);glow.addColorStop(0,rgba255(MIRRORLAND.colors.paleCyan,.12+.20*focus));glow.addColorStop(.52,rgba255(MIRRORLAND.colors.violet,.07+.10*focus));glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(-40,-40,560,800);for(const pane of MIRROR_PANES){const color=MIRRORLAND.colors[pane[1]],phase=Number.isFinite(pane[6])?pane[6]:0,pulse=.94+.06*Math.sin(elapsedMs*.00217+phase),alpha=pane[3]*mix(.55,1,focus)*pulse;tracePane(ctx,pane[2]);const gradient=ctx.createLinearGradient(110,80,390,650);gradient.addColorStop(0,rgba255(color,alpha));gradient.addColorStop(1,rgba255(color,alpha*.58));ctx.fillStyle=gradient;ctx.shadowColor=rgba255(color,pane[4]*(.22+.48*focus));ctx.shadowBlur=4+pane[4]*18*focus;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=rgba255(MIRRORLAND.colors.leadDark,.68+.24*focus);ctx.lineWidth=mix(MIRRORLAND.innerLeadWidthDormant,MIRRORLAND.innerLeadWidthFocused,focus);ctx.stroke();}ctx.lineJoin='round';ctx.lineCap='round';for(const segment of MIRROR_FRAME){ctx.beginPath();ctx.moveTo(segment[0][0],segment[0][1]);for(let i=1;i<segment.length;i++)ctx.lineTo(segment[i][0],segment[i][1]);ctx.strokeStyle=rgba255(MIRRORLAND.colors.frameNearBlack,.98);ctx.lineWidth=mix(MIRRORLAND.leadWidthDormant,MIRRORLAND.leadWidthFocused,focus)*2.2;ctx.stroke();ctx.strokeStyle=rgba255(MIRRORLAND.colors.frameEdge,.82);ctx.lineWidth=mix(MIRRORLAND.leadWidthDormant,MIRRORLAND.leadWidthFocused,focus);ctx.stroke();ctx.strokeStyle=rgba255(MIRRORLAND.colors.leadLight,.42+.28*focus);ctx.lineWidth=mix(1.2,3,focus);ctx.stroke();}ctx.restore();}
function renderThreshold(stage,p,elapsedMs){const scene=stage.querySelector('[data-scene="S05"]');if(!scene)return;const canvas=scene.querySelector('canvas'),rect=scene.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);if(!canvas||rect.width<=0||rect.height<=0)return;if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.max(1,Math.round(rect.width*dpr));canvas.height=Math.max(1,Math.round(rect.height*dpr));}const ctx=canvas.getContext('2d'),w=rect.width,h=rect.height;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const anchor=normalize(SPHERE.primaryAnchor),qNorth=qFromUnitVectors(SPHERE.vectors.north,anchor),reveal=smooth(.1833,.4333,p),focused=smooth(.4333,.6667,p),crossAmount=smooth(.6667,1,p),compassAlpha=1-smooth(.18,.62,p)*.78-smooth(.72,1,p)*.22;drawConstellation(ctx,w,h,qNorth,elapsedMs,'north',clamp(compassAlpha,0,1));drawMirrorWindow(ctx,w,h,Math.max(reveal,focused),crossAmount,elapsedMs);const copy=scene.querySelector('.cinematic-threshold__copy');if(copy){copy.style.opacity=String(smooth(.36,.49,p)*(1-smooth(.67,.82,p)));copy.style.transform=`translate3d(0,${mix(12,0,smooth(.36,.49,p))}px,0)`;}scene.style.opacity=String(smooth(.01,.10,p));}

export function createCinematicRenderer({stage,media}){
  const legacy=createLegacyRenderer({stage,media});
  let mounted=false,lastShot=null;
  return Object.freeze({
    schema:WRAPPER_SCHEMA,
    mount(){const value=legacy.mount();mounted=true;return value;},
    renderFrame(frame){const id=frame?.shot?.id;lastShot=id||lastShot;if(id==='S02'){legacy.renderFrame(frame);redrawOrientation(stage,frame.shotProgress,frame.elapsedMs);return;}if(id==='S05'){legacy.renderFrame({...frame,shot:{...frame.shot,id:'S04',beat:'Choice / Readiness'},shotProgress:1});const s04=stage.querySelector('[data-scene="S04"]');if(s04)s04.style.opacity='0';renderThreshold(stage,frame.shotProgress,frame.elapsedMs);return;}legacy.renderFrame(frame);},
    inspect(){return Object.freeze({schema:WRAPPER_SCHEMA,mounted,lastShot,legacy:legacy.inspect?.()||null,s05PanePhaseSlot:6,starOrientation:'CAMERA_FACING_FIXED_XY_TILT_RESTRAINED_ROLL'});},
    dispose(){legacy.dispose?.();mounted=false;}
  });
}
