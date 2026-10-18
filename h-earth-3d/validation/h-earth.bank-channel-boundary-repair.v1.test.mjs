import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createUniformGroundAdmission} from '../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';
import {constructGeologicalRuntimeBridge} from '../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js';
import {resolveHEarthNavigationBoundaryFeedback,H_EARTH_MOUNTAIN_TRAVERSAL_DOMAIN} from '../../showroom/globe/h-earth/functional-landscape/navigation.js';
const canonical=JSON.parse(gunzipSync(readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url)))).canonical;
const model=constructGeologicalRuntimeBridge(canonical);
test('shared planned footprint excludes the whole12m corridor independently of presentation and support height',async()=>{
 for(const p of model.formation.vegetationCorridorPoints){assert(model.isPlannedWaterFootprint(p.x,p.z));for(const dx of [-5.9,0,5.9])assert(model.isPlannedWaterFootprint(p.x+dx,p.z));}
 const box={minX:1000,maxX:1001,minZ:1000,maxZ:1001};
 const admit=await createUniformGroundAdmission({visibleSurface:{beach:{sample:()=>({valid:true,rawSandCoverage:0})},water:{sample:()=>null}},geology:model,toLocal:(x,y,z)=>({x,z}),estate:{manorCore:box,gardens:box,outbuildingProposal:box,acceptedEnvelope:box,footRoute:[],footRouteRadius:0},oasis:box,sampleStructure:()=>({}),maximumSandCoverage:.12});
 for(const y of [-100,0,1000])assert.equal(admit(-80,-400,{y}),false,'planned drychannel excluded regardless supportheight');
 assert(admit.getReceipt().rejections.FUTURE_WATER>=3);
});
test('actual public callback restores existing notice semantics without expanding navigation',()=>{
 const route=readFileSync(new URL('../../showroom/globe/h-earth/vegetation-prototype/route.js',import.meta.url),'utf8');
 const callback=route.match(/onProposal:\(proposal,state\)=>\{([^\n]+)\}\}\);/)[1];
 let message='';const updateBoundaryFeedback=proposal=>{message=resolveHEarthNavigationBoundaryFeedback(message,proposal)};
 const invoke=Function('proposal','state','updateBoundaryFeedback','renderer',callback);
 invoke({intent:{action:'MOVE_FORWARD'},accepted:false,issues:['OUTER_NAVIGATION_BOUNDARY']},{},updateBoundaryFeedback,null);assert(message.includes('Turn back'));
 invoke({intent:{action:'TURN_LEFT'},accepted:true,moved:false},{},updateBoundaryFeedback,null);assert(message.includes('Turn back'));
 invoke({intent:{action:'MOVE_BACKWARD'},accepted:true,moved:true},{},updateBoundaryFeedback,null);assert.equal(message,'');
 assert.deepEqual(H_EARTH_MOUNTAIN_TRAVERSAL_DOMAIN,{xMin:-256,xMax:256,zMin:-400,zMax:-80});
});
test('every terminal cut and bank vertex is hidden by final emitted terrain from walking boundary',()=>{
 const mesh=model.portal.terrainWithoutAperture,p=mesh.positions,bins=new Map();
 for(let n=0;n<mesh.indices.length;n+=3){const tri=[...mesh.indices.slice(n,n+3)].map(i=>[p[i*3],p[i*3+1],p[i*3+2]]);const key=Math.floor(Math.min(...tri.map(v=>v[0]))/2)+':'+Math.floor(Math.min(...tri.map(v=>v[2]))/2);if(!bins.has(key))bins.set(key,[]);bins.get(key).push(tri);}
 const top=(x,z)=>{for(const t of bins.get(Math.floor(x/2)+':'+Math.floor(z/2))??[]){const [a,b,c]=t,d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);if(Math.abs(d)<1e-9)continue;const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d;if(Math.min(u,v,1-u-v)>=-1e-5)return u*a[1]+v*b[1]+(1-u-v)*c[1];}const y=model.originalTerrainElevationAt(x,z);assert(Number.isFinite(y),`LOS terrain missing ${x},${z}`);return y;};
 const terminal=[];for(let i=0;i<p.length;i+=3)if(Math.hypot(p[i]-model.formation.vegetationCorridorPoints.at(-1).x,p[i+2]+544)<=14){assert([p[i],p[i+1],p[i+2]].every(Number.isFinite));terminal.push([p[i],p[i+1],p[i+2]]);}
 const observers=[];for(let x=-256;x<=256;x+=8)observers.push([x,-400],[x,-80]);for(let z=-392;z<-80;z+=8)observers.push([-256,z],[256,z]);
 let rays=0,visible=0;for(const [x,z] of observers){const y=top(x,z)+2.25;assert(Number.isFinite(y));for(const q of terminal){let blocked=false;const distance=Math.hypot(q[0]-x,q[2]-z),steps=Math.ceil(distance);for(let k=1;k<steps;k++){const t=k/steps,rx=x+(q[0]-x)*t,rz=z+(q[2]-z)*t;if(top(rx,rz)>y+(q[1]-y)*t+.01){blocked=true;break;}}rays++;if(!blocked){visible++;if(visible<=8)console.log('VISIBLE_TERMINAL_RAY',JSON.stringify({observer:[x,y,z],terminal:q}));}}}
 console.log('TERMINAL_EMITTED_LOS',JSON.stringify({terminalVertices:terminal.length,observers:observers.length,rays,visible}));assert(terminal.length>50);assert.equal(visible,0);
});
