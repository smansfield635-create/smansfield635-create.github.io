import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {gunzipSync,gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const DIR='showroom/globe/h-earth/terrain-estate-construction-v1/';
export const TERRAIN_SHA='ed0905a208ee6bc8b99ff7271a3d636119d947dc57306a9293ba7405c3de0442';
export async function context(root){
 const snap='inspection/audralia-24057-exact/snapshot/',geo=pathToFileURL(path.join(root,snap,'h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js')).href;
 const code=fs.readFileSync(path.join(root,snap,DIR,'renderer.mjs'),'utf8').replace("from '../../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';",'from '+JSON.stringify(geo)+';')+'\nexport {COAST_MODEL,tangentPosition,tangentCoordinatesFromDirection,sampleCanonicalCoast};';
 const m=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const raw=gunzipSync(fs.readFileSync(path.join(root,DIR,'gratitude-mesh-v1.bin.gz')));if(hash(raw)!==TERRAIN_SHA)throw Error('BASE_TERRAIN_IDENTITY');
 const nv=raw.readUInt32LE(12)/10,ni=raw.readUInt32LE(16),points=[];for(let i=0;i<nv;i++){const xyz=[0,1,2].map(k=>raw.readFloatLE(32+40*i+4*k)),q=m.tangentCoordinatesFromDirection([xyz[0],xyz[1]+6200,xyz[2]]);points.push({...q,xyz});}
 const ids=Array.from({length:ni},(_,i)=>raw.readUInt32LE(32+40*nv+4*i)),bins=new Map(),cell=24;
 for(let i=0;i<ni;i+=3){const t=ids.slice(i,i+3).map(j=>points[j]);for(let x=Math.floor(Math.min(...t.map(p=>p.u))/cell);x<=Math.floor(Math.max(...t.map(p=>p.u))/cell);x++)for(let z=Math.floor(Math.min(...t.map(p=>p.v))/cell);z<=Math.floor(Math.max(...t.map(p=>p.v))/cell);z++){const k=x+','+z;if(!bins.has(k))bins.set(k,[]);bins.get(k).push(t);}}
 function sample(u,v){for(const t of bins.get(Math.floor(u/cell)+','+Math.floor(v/cell))||[]){const[a,b,c]=t,D=(b.v-c.v)*(a.u-c.u)+(c.u-b.u)*(a.v-c.v);if(Math.abs(D)<1e-10)continue;const A=((b.v-c.v)*(u-c.u)+(c.u-b.u)*(v-c.v))/D,B=((c.v-a.v)*(u-c.u)+(a.u-c.u)*(v-c.v))/D,C=1-A-B;if(Math.min(A,B,C)>=-2e-5)return [0,1,2].map(k=>A*a.xyz[k]+B*b.xyz[k]+C*c.xyz[k]);}return null;}
 return {...m,raw,sample};
}
function catmull(a,b,c,d,t){return ['u','v'].reduce((o,k)=>(o[k]=.5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t*t+(-a[k]+3*b[k]-3*c[k]+d[k])*t*t*t),o),{});}
export async function build(root){
 const ctx=await context(root),source=JSON.parse(fs.readFileSync(path.join(root,DIR,'h-earth-river-source-v1.json')));if(hash(JSON.stringify(source.sourcePoints))!==source.pointsIdentity)throw Error('NATIVE_SOURCE_IDENTITY');
 const prefix=source.visibleChannelCenters.map(p=>({u:p.x,v:p.z+128,origin:'PROGRAMMED_H_EARTH'}));
 // Only this downstream continuation is authored. Original 79 centers are copied exactly.
 const controls=[prefix.at(-1),{u:-80.234,v:-236},{u:-107,v:-252},{u:-132,v:-282},{u:-147,v:-345},{u:-120,v:-430},{u:-150,v:-525},{u:-119,v:-625},{u:-145,v:-735},{u:-132,v:-835},{u:-132,v:-915},{u:-132,v:-964},{u:-136.00000685164517,v:-985.317475481161}];
 const route=[...prefix];for(let i=0;i<controls.length-1;i++){const a=controls[Math.max(0,i-1)],b=controls[i],c=controls[i+1],d=controls[Math.min(controls.length-1,i+2)],n=Math.ceil(Math.hypot(c.u-b.u,c.v-b.v));for(let j=1;j<=n;j++)route.push({...catmull(a,b,c,d,j/n),origin:'AUTHORED_CONTINUATION'});}
 // Extend the mouth into the actual lake; land stencil clips the additive strip at the established shore.
 const mouth=route.at(-1),prev=route.at(-2),du=mouth.u-prev.u,dv=mouth.v-prev.v,L=Math.hypot(du,dv);for(let i=1;i<=5;i++)route.push({u:mouth.u+du/L*i,v:mouth.v+dv/L*i,origin:'LAKE_MOUTH_OVERLAP'});
 // Densify all source segments without changing or dropping any programmed center.
 const centers=[];for(let i=0;i<route.length;i++){if(i){const a=route[i-1],b=route[i],n=Math.ceil(Math.hypot(b.u-a.u,b.v-a.v));for(let j=1;j<n;j++)centers.push({u:a.u+(b.u-a.u)*j/n,v:a.v+(b.v-a.v)*j/n,origin:b.origin});}centers.push(route[i]);}
 const vertices=[],indices=[],sections=[];let progress=0,total=0;for(let i=1;i<centers.length;i++)total+=Math.hypot(centers[i].u-centers[i-1].u,centers[i].v-centers[i-1].v);
 for(let i=0;i<centers.length;i++){const p=centers[i],a=centers[Math.max(0,i-1)],b=centers[Math.min(centers.length-1,i+1)],dx=b.u-a.u,dz=b.v-a.v,len=Math.hypot(dx,dz)||1;if(i)progress+=Math.hypot(p.u-centers[i-1].u,p.v-centers[i-1].v);const w=p.origin==='PROGRAMMED_H_EARTH'?1.65+1.75*Math.min(1,progress/250):3.4+2.1*Math.max(0,(progress-250)/(total-250)),section={...p,halfWidth:w,firstVertex:vertices.length/7};
  for(let j=0;j<7;j++){const offset=(j/6*2-1)*w,u=p.u-dz/len*offset,v=p.v+dx/len*offset,base=ctx.sample(u,v)||ctx.tangentPosition(u,v,1.94),rad=[base[0],base[1]+6200,base[2]],r=Math.hypot(...rad),lift=.24;const xyz=base.map((x,k)=>x+rad[k]/r*lift);vertices.push(...xyz,.125,.395,.485,1);}
  sections.push(section);
 }
 for(let i=1;i<centers.length;i++)for(let j=0;j<6;j++){const a=(i-1)*7+j,b=a+1,c=i*7+j,d=c+1;indices.push(a,c,b,b,c,d);}
 // Match outward winding to the renderer's land surface.
 for(let i=0;i<indices.length;i+=3){const [a,b,c]=indices.slice(i,i+3).map(id=>vertices.slice(id*7,id*7+3)),ab=b.map((v,k)=>v-a[k]),ac=c.map((v,k)=>v-a[k]),n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];if(n[0]*a[0]+n[1]*(a[1]+6200)+n[2]*a[2]<0)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];}
 const data=Buffer.alloc(16+4*(vertices.length+indices.length));data.write('AUDRIV1');data.writeUInt32LE(vertices.length,8);data.writeUInt32LE(indices.length,12);vertices.forEach((v,i)=>data.writeFloatLE(v,16+i*4));indices.forEach((v,i)=>data.writeUInt32LE(v,16+vertices.length*4+i*4));const zip=gzipSync(data,{level:9});fs.writeFileSync(path.join(root,DIR,'river-mesh-v1.bin.gz'),zip);
 const result={schema:'AUDRALIA_SOURCE_RIVER_CONTINUITY_v1',operationId:'AUDRALIA_SOURCE_RIVER_CONTINUITY_V1_20261020_001',generation:2839,baselineCandidate:'7042c6a83525b17f9b35af4b399095d8bf4b7d86',terrainPayloadSha256:TERRAIN_SHA,sourcePointsIdentity:source.pointsIdentity,sourceFileSha256:hash(fs.readFileSync(path.join(root,DIR,'h-earth-river-source-v1.json'))),sourcePointCount:79,programmedCenters:prefix,continuationControls:controls.slice(1),sections,mouth:{u:mouth.u,v:mouth.v},lakeLoop:ctx.COAST_MODEL.inlandWaterLoops[0],mesh:{compressedSha256:hash(zip),payloadSha256:hash(data),vertexFloatCount:vertices.length,indexCount:indices.length,vertexCount:vertices.length/7,triangleCount:indices.length/3},representation:'GLOBAL_COLOR_ELEVATION_AND_SOURCE_BOUND_RIVER',physicalVegetation:false,physicalRocks:false,existingTerrainAndCoastAndWaterUnchanged:true,physicalDownhillSimulation:false};fs.writeFileSync(path.join(root,DIR,'river-route-v1.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({result:'BUILT',sections:sections.length,vertices:vertices.length/7,compressedBytes:zip.length,payloadSha256:hash(data)}));return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await build(process.cwd());
