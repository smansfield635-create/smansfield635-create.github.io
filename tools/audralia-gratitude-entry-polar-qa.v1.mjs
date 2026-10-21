import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
const read=p=>fs.readFileSync(p,'utf8');
const base='aaeae59e12c65ddef901d8fc69dafe6539678a2c',root='showroom/globe/audralia/',frozen='inspection/audralia-24057-exact/snapshot/showroom/globe/audralia/weather-presentation-reconciliation/';
const index=read(root+'index.html'),ga=read(root+'exterior-weather.polar-continuity-v1.mjs'),qa=read(root+'cloud-continuity-qa-v1.html');
const original=execFileSync('git',['show',base+':'+frozen+'exterior-weather.ga-v2-spatial-handoff.mjs'],{encoding:'utf8'});
const source=ga.slice(ga.indexOf('vec2 sphericalWeatherOffset('),ga.indexOf('\nvec2 raySphere'));
// Execute the coordinate function extracted from the actual shader with scalar/vector helpers.
const translated=source.replace('vec2 sphericalWeatherOffset(float lat,float lon,vec2 center)','function offset(lat,lon,center)')
 .replace(/float /g,'let ').replace(/center\.x/g,'center[0]').replace(/center\.y/g,'center[1]')
 .replace('return R*(sine>1e-6?angle/sine:1.0)*vec2(east,north);','return [east,north].map(v=>R*(sine>1e-6?angle/sine:1)*v);');
const context={R:6200,sin:Math.sin,cos:Math.cos,atan:Math.atan2,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),length:v=>Math.hypot(...v),vec2:(a,b=a)=>[a,b]};vm.createContext(context);vm.runInContext(translated,context);
const offset=(lat,lon,c)=>context.offset(lat,lon,c),rad=d=>d*Math.PI/180;
let maximumCutDifference=0,maximumPoleSpread=0;
for(const latCenter of [-89,-80,-65,0,65,80.6197608073602,89])for(const lat of [-90,-86,-75,-30,0,30,75,86,90]){
 const center=[rad(latCenter),rad(151.93436896318713)],epsilon=1e-9;
 const a=offset(rad(lat),center[1]+Math.PI-epsilon,center),b=offset(rad(lat),center[1]-Math.PI+epsilon,center);
 const difference=Math.hypot(a[0]-b[0],a[1]-b[1]);maximumCutDifference=Math.max(maximumCutDifference,difference);assert(difference<.001,'SHADER_LONGITUDE_CUT_REMAINS');
 if(Math.abs(lat)===90&&Math.abs(latCenter)>=65){const ref=offset(rad(lat),0,center);for(let lon=-180;lon<=180;lon+=30){const p=offset(rad(lat),rad(lon),center);const spread=Math.hypot(p[0]-ref[0],p[1]-ref[1]);maximumPoleSpread=Math.max(maximumPoleSpread,spread);assert(spread<1e-6,'SHADER_POLE_DEPENDS_ON_LONGITUDE');}}
}
assert(Math.hypot(...offset(0,0,[0,0]))===0);assert(Math.abs(offset(0,.1,[0,0])[0]-620)<1e-8);assert(offset(0,Math.PI,[0,0])[0]===1e8,'TRUE_ANTIPODE_NOT_REJECTED');
const c=[rad(80.6197608073602),rad(151.93436896318713)],old=(lat,lon)=>[Math.atan2(Math.sin(lon-c[1]),Math.cos(lon-c[1]))*Math.cos(c[0])*6200,(lat-c[0])*6200];
const oldA=old(rad(75),c[1]+Math.PI-1e-9),oldB=old(rad(75),c[1]-Math.PI+1e-9);assert(Math.hypot(oldA[0]-oldB[0],oldA[1]-oldB[1])>6000,'NEGATIVE_BASELINE_DID_NOT_EXPOSE_SEAM');
// All render budgets, morphology, lighting and authority stay byte-identical outside the declared coordinate/import/evidence delta.
let restored=ga.replace("from '/"+frozen+"fap1-gpu-weather-descriptors.mjs'","from './fap1-gpu-weather-descriptors.mjs'");
restored=restored.replace(/\n\/\/ Center-local spherical logarithm[\s\S]*?\n}\nvec2 raySphere/,'\nvec2 raySphere');
restored=restored.replace('float z=(h-a.z)/max(a.w-a.z,.001);vec2 offset=sphericalWeatherOffset(lat,lon,a.xy);float dx=offset.x,dy=offset.y;','float z=(h-a.z)/max(a.w-a.z,.001),dlon=wrapPi(lon-a.y),dx=dlon*cos(a.x)*R,dy=(lat-a.x)*R;').replace("coordinateProjection:'CENTER_LOCAL_SPHERICAL_LOG_v1',",'');assert.equal(restored,original,'UNDECLARED_CLOUD_IMPLEMENTATION_CHANGE');
const module=index.match(/<script type="module" data-gratitude-entry-runtime>([\s\S]*?)<\/script>/)[1];
const marker={href:'https://diamondgatebridge.com/showroom/globe/h-earth/',hidden:true},canvas={};const entryContext={document:{querySelector:s=>s==='[data-gratitude-entry]'?marker:canvas},window:{},requestAnimationFrame:()=>{},URL};vm.createContext(entryContext);vm.runInContext(module,entryContext);
const project=entryContext.window.__GRATITUDE_COASTAL_ENTRY__.projectCoastalEntry;
const frame={eye:[0,0,10],forward:[0,0,-1],right:[1,0,0],up:[0,1,0],planetCenter:[0,0,0]};
assert(project(frame,[0,0,1],1024,944));assert.equal(project(frame,[0,0,-1],1024,944),null,'FAR_SIDE_MARKER_VISIBLE');assert.equal(project(frame,[100,0,1],1024,944),null,'OFFSCREEN_MARKER_VISIBLE');assert.equal(project(frame,[0,0,20],1024,944),null,'BEHIND_CAMERA_MARKER_VISIBLE');
assert(index.includes('>Enter Gratitude</a>'));assert(!index.includes('H-Earth · Play'));assert(index.includes('min-height:44px'));assert(!index.includes('setInterval('));
const local=read('showroom/globe/h-earth/index.html'),priorLocal=execFileSync('git',['show',base+':showroom/globe/h-earth/index.html'],{encoding:'utf8'});assert.equal(local.replace('<title>Gratitude · Live Interactive World</title>','<title>H-Earth · Live Interactive World</title>').replace('Navigable Gratitude woodland.','Navigable H-Earth woodland.'),priorLocal,'LOCAL_SCENE_CHANGED');
const sha=crypto.createHash('sha256').update(index).digest('hex');assert(qa.includes(sha),'QA_ENTRY_IDENTITY_STALE');assert(qa.includes('captureScreenshot')===false);assert.equal(new Date(1792627200000).toISOString(),'2026-10-22T00:00:00.000Z');
for(const script of index.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)){if(script[0].includes('type="importmap"'))JSON.parse(script[1]);else if(!script[0].includes('type="module"'))new vm.Script(script[1]);}
console.log(JSON.stringify({schema:'AUDRALIA_GRATITUDE_ENTRY_POLAR_CHEAP_QA_v1',result:'PASS',maximumCutDifference,maximumPoleSpread,oldCutJump:Math.hypot(oldA[0]-oldB[0],oldA[1]-oldB[1]),entrySha256:sha,cloudDeltaOnly:true,markerOcclusionAndDestination:true,localSceneUnchanged:true,physicalDevicePerformanceClaimed:false},null,2));
