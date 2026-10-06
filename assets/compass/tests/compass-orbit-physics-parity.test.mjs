import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
const baseline='171a74bc3f1f170c36079b00407fb569b56992bf';
const original=execFileSync('git',['show',`${baseline}:assets/compass/compass.crystals.js`],{encoding:'utf8'});
const slice=(a,b)=>original.slice(original.indexOf(a),original.indexOf(b));
const functionSource=name=>{const start=original.indexOf(`  function ${name}(`);const end=original.indexOf('\n  function ',start+1);assert(start>=0&&end>start);return original.slice(start,end);};
const physicsContext=vm.createContext({});
vm.runInContext(readFileSync(new URL('../compass.orbit-physics.js',import.meta.url),'utf8'),physicsContext);
const shared=physicsContext.DGB_COMPASS_ORBIT_PHYSICS;
assert(Object.isFrozen(shared)); assert(Object.isFrozen(shared.GESTURE));
const sourceNames=['pointerDistance','addPointerSample','gestureMetrics','isQuickClusterFlick','constellationReleaseQuaternionAt','dragQuaternionFromPointer','startConstellationReleaseInertia'];
const reference=vm.createContext({performance:{now:()=>1000},CustomEvent:class{},dispatchEvent:()=>{}});
vm.runInContext(`const state={cssWidth:390,cssHeight:844,reducedMotion:false,root:{dataset:{}},scene:{getBoundingClientRect:()=>({width:state.cssWidth,height:state.cssHeight})}};
const CONSTELLATION_RELEASE_START_EVENT='start',CONSTELLATION_RELEASE_MOTION_OWNER='owner';
const getControllerFrame=()=>null,constellationOrientationReceipt=()=>null,requestRender=()=>{};
${slice('  const GESTURE =','  const SPHERE =')}
${slice('  function clamp(','  function normalizeWing(')}
${slice('  function vectorLength(','  function orientationQuaternion(')}
${sourceNames.map(functionSource).join('\n')}
globalThis.reference={GESTURE,${sourceNames.join(',')},quaternionNormalize,quaternionMultiply,quaternionSlerp,quaternionRotateVector,quaternionFromAxisAngle,state};`,reference);
const old=reference.reference;
const plain=x=>JSON.parse(JSON.stringify(x));
const equal=(a,b)=>assert.deepEqual(plain(a),plain(b));
equal(shared.GESTURE,old.GESTURE);
let assertions=0;
for(const [width,height] of [[390,844],[800,1280],[1,1]]){
 old.state.cssWidth=width;old.state.cssHeight=height;
 for(const [dx,dy,duration,pause] of [[0,0,1,0],[6,0,50,0],[8,0,100,0],[12,0,100,0],[52,0,60,0],[150,90,140,0],[-150,-90,600,200],[0,400,100,0],[4000,4000,20,0]]){
  const pointer={startX:40,startY:60,startTime:0,startQuaternion:[.2,.3,.1,.9273618495495703],samples:[]};
  const a=plain(pointer),b=plain(pointer);
  for(let i=1;i<=24;i++){
   const t=(duration-pause)*i/25;
   const x=40+dx*i/25,y=60+dy*i/25;
   old.addPointerSample(a,x,y,t);shared.addPointerSample(b,x,y,t);
  }
  equal(a,b);
  const metrics=old.gestureMetrics(a,40+dx,60+dy,duration);
  equal(metrics,shared.gestureMetrics(b,40+dx,60+dy,duration));
  equal(old.pointerDistance(a,40+dx,60+dy),shared.pointerDistance(b,40+dx,60+dy));
  equal(old.isQuickClusterFlick(metrics),shared.isQuickClusterFlick(metrics));
  const q=old.dragQuaternionFromPointer(a,40+dx,60+dy);
  equal(q,shared.dragQuaternionFromPointer(b,40+dx,60+dy,width,height));
  for(const reducedMotion of [false,true]){
   old.state.reducedMotion=reducedMotion;old.state.constellationReleaseInertia=null;
   const started=old.startConstellationReleaseInertia(q,'north',metrics);
   const parameters=shared.releaseParameters(metrics,width,height,reducedMotion);
   assert.equal(Boolean(parameters),started);
   if(parameters){
    for(const key of Object.keys(parameters))equal(parameters[key],old.state.constellationReleaseInertia[key]);
    const inertia={...parameters,releaseQuaternion:q};
    for(const elapsed of [0,16,140,parameters.durationMs/2,parameters.durationMs])equal(old.constellationReleaseQuaternionAt(inertia,elapsed),shared.constellationReleaseQuaternionAt(inertia,elapsed));
   }
  }
  assertions++;
 }
}
for(const q of [[0,0,0,1],[.2,.3,.1,.9],[0,0,0,0]]){
 equal(old.quaternionNormalize(q),shared.quaternionNormalize(q));
 equal(old.quaternionRotateVector(q,[.5,.6,.7]),shared.quaternionRotateVector(q,[.5,.6,.7]));
 for(const t of [0,.1,.5,1])equal(old.quaternionSlerp(q,[0,1,0,0],t),shared.quaternionSlerp(q,[0,1,0,0],t));
}
// Extracted bodies stay byte-identical; viewport dependency injection is the sole drag delta.
const moduleSource=readFileSync(new URL('../compass.orbit-physics.js',import.meta.url),'utf8');
for(const name of ['pointerDistance','addPointerSample','gestureMetrics','isQuickClusterFlick','constellationReleaseQuaternionAt'])assert(moduleSource.includes(functionSource(name).trim()));
assert(!/document\.|window\.|requestAnimationFrame|addEventListener|import\(/.test(moduleSource));
console.log(`PASS: ${assertions} baseline gesture cases, release/reduced-motion parity, quaternion checks, original bodies and side-effect-free module.`);
