import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {integrated,visibleSurface,geology,terrain,placement,materials,habitatModule} from '../hillside-shoreline-continuity-v1/support-fixture.mjs';
import {createUniformGroundAdmission} from '../../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';
import {buildHEarthOasisConnectedBasinIndex,H_EARTH_OASIS_FOLIAGE_SAMPLE as oasis} from '../../../showroom/globe/h-earth/render/grass-lowland-trial.js';
import {createOasisBankField,OASIS_BANK_ALLOCATION} from '../../../showroom/globe/h-earth/render/oasis-bank-field.v1.js';
const base='2f3d00175eaf6edae6d59cf0a5f5fa4e36f9e088',root=new URL('../../../',import.meta.url),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',sha=b=>createHash('sha256').update(b).digest('hex');
const git=p=>execFileSync('git',['show',base+':'+p],{cwd:root,maxBuffer:180*1024*1024});
const prior=JSON.parse(git(asset+'json')),before=gunzipSync(git(asset+'bin.gz'));assert.equal(sha(before),prior.rawSha256);
const field=createOasisBankField(buildHEarthOasisConnectedBasinIndex(integrated).wetCells);
const admit=await createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints,oasis,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12,oasisReservedAt:(x,z)=>field(x,z)<=0});
const tiles=new Map(),occupied=new Set();let offset=0;
for(const t of prior.tiles){const records=[];for(let j=0;j<t.count;j++){const b=before.subarray(offset,offset+52);offset+=52;records.push(b);const x=b.readDoubleLE(0),z=b.readDoubleLE(16);if(x>-30&&x<45&&z>-215&&z<-120)occupied.add(`${Math.floor(x/.12)}:${Math.floor(z/.12)}`);}tiles.set(t.id,{...t,records});}
const candidates=[],hash=habitatModule.habitatHash;let eligibleCount=0;const diagnostics={field:0,admitted:0,material:0};
for(let iz=-1040;iz<-635;iz++)for(let ix=-110;ix<190;ix++){
 const x=Math.fround((ix+.15+.7*hash(ix,iz,10)/4294967296)*.2),z=Math.fround((iz+.15+.7*hash(ix,iz,11)/4294967296)*.2),s=visibleSurface.sample(x,z);if(!s||s.slope>.55)continue;
 const local=terrain.unprojectPlanetVertex(x,s.y,z),weight=field(local.x,local.z);if(weight<=0||hash(ix,iz,12)/4294967296>weight*.75)continue;
 diagnostics.field++;if(!admit(x,z,s)||occupied.has(`${Math.floor(x/.12)}:${Math.floor(z/.12)}`))continue;
 diagnostics.admitted++;const m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(local.x,local.z);if(!m.valid||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL','DRY_SAND'].includes(m.surfaceClass)&&m.soilDepth>=.20))continue;
 diagnostics.material++;eligibleCount++;candidates.push({x,y:Math.fround(s.y),z,local,weight,slope:s.slope,triangleId:s.triangleId,seed:hash(ix,iz,2880),rank:hash(ix,iz,13)/4294967296});
}
console.log('ADMISSION',diagnostics,admit.getReceipt());
candidates.sort((a,b)=>a.rank-b.rank||a.x-b.x||a.z-b.z);
const additions=[];
for(const p of candidates){if(additions.length>=OASIS_BANK_ALLOCATION.maximumRoots)break;const id=`${Math.floor(p.x/4)}:${Math.floor(p.z/4)}`;if(!tiles.has(id))tiles.set(id,{id,minX:Math.floor(p.x/4)*4,minZ:Math.floor(p.z/4)*4,baselineCount:0,records:[]});const t=tiles.get(id);if(t.records.length>=1600)continue;
 const b=Buffer.alloc(52);[p.x,p.y,p.z,p.rank*Math.PI*2,p.slope].forEach((v,i)=>b.writeDoubleLE(v,i*8));b.writeUInt32LE(p.seed,40);b.writeUInt32LE(p.triangleId,44);b.writeUInt32LE(3,48);t.records.push(b);additions.push(p);
}
assert(additions.length>100,'INSUFFICIENT_SUPPORTED_BANK_GRASS');
const packed=new Float32Array(additions.length*4);
for(let i=0;i<additions.length;i++){const p=additions[i];packed.set([p.x,p.y,p.z,p.rank*Math.PI*2],i*4);}
const payload=Buffer.from(packed.buffer),encoded=payload.toString('base64');
const report={schema:'H_EARTH_OASIS_BANK_NATURALIZATION_v1',baseline:base,originalRoots:prior.rootCount,addedRoots:additions.length,eligibleCount,globalAllocationChanged:false,oasisAllowance:OASIS_BANK_ALLOCATION,additionalPackedBytes:payload.length,maximumAdditionalTriangles:additions.length*4,originalRecordsSha256:sha(before.subarray(0,prior.rootCount*52)),originalGrassAssetUnchanged:true,atlasPreserved:true,baselinePrefixesPreserved:true,packedSha256:sha(payload),actualDevicePerformance:'NOT_MEASURED'};
const fieldPath=new URL('showroom/globe/h-earth/render/oasis-bank-field.v1.js',root),source=fs.readFileSync(fieldPath,'utf8');
const next=source.replace(/const OASIS_BANK_DATA='[^']*';/,`const OASIS_BANK_DATA='${encoded}';`);
if(process.argv.includes('--verify')){assert.equal(source,next);assert.equal(fs.readFileSync(new URL('./addition-witnesses.json',import.meta.url),'utf8'),JSON.stringify(additions)+'\n');assert.equal(fs.readFileSync(new URL('./receipt.json',import.meta.url),'utf8'),JSON.stringify(report,null,2)+'\n');console.log('DETERMINISTIC_BANK_REBUILD_PASS');}else{
 fs.writeFileSync(fieldPath,next);fs.writeFileSync(new URL('./addition-witnesses.json',import.meta.url),JSON.stringify(additions)+'\n');fs.writeFileSync(new URL('./receipt.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
