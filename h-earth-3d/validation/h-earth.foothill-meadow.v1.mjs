import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash,webcrypto} from 'node:crypto';
const begin=performance.now();
const sourceDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../showroom/globe/h-earth/render');
const read=name=>fs.readFileSync(path.join(sourceDir,name),'utf8');
const src=read('live-render-package.run8e-r2.js'),canon=read('live-render-package.run8e-r2.canonical.js'),grass=read('woodland-fine-grass.v1.js');
const packet=read('verified-planting-packet.v1.js');
const trees=JSON.parse(packet.match(/H_EARTH_VERIFIED_PLANTING_TREES = Object.freeze\((\[.*\])\.map\(Object.freeze\)\)/)[1]);
const identity=JSON.parse(packet.match(/H_EARTH_VERIFIED_PLANTING_PACKET = Object.freeze\((\{.*\})\);/)[1]);
const world=fs.readFileSync(process.env.H_EARTH_EXACT_WORLD_BINARY||path.join(sourceDir,'assets/h-earth-canonical-base-world.v1.json.gz'));
assert.equal(createHash('sha256').update(world).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
const value=JSON.parse(gunzipSync(world)),base=value.raw;
for(const pkg of [value.raw,value.canonical]){Object.values(pkg.buffers).forEach(Object.freeze);Object.freeze(pkg.buffers);Object.freeze(pkg.primitiveSpans);Object.freeze(pkg.drawRanges);}
// Execute exact adapter/evaluator bodies without regenerating the world or census.
const prelude=src.slice(src.indexOf('function createHashWriter()'),src.indexOf('export function buildHEarthRun8ER2ImmutableLiveRenderPackage'));
const evaluate=src.slice(src.indexOf('function* evaluatePackageChecks('),src.indexOf('export async function adoptHEarthRun8ER2DeferredLiveRenderPackage')).replaceAll('export ','');
const adapter=src.slice(src.indexOf('export function applyHEarthVerifiedPlantingPackage('),src.indexOf('let cachedDeferredPackage = null;')).replaceAll('export ','');
const context={H_EARTH_VERIFIED_PLANTING_TREES:trees,H_EARTH_VERIFIED_PLANTING_PACKET:identity,H_EARTH_RUN_8E_R2_CONTRACT_ID:base.contractId,H_EARTH_RUN_8E_PACKET_002_TRANSFER_CONTRACT_ID:base.sourceAuthorities.packet002TransferContractId,H_EARTH_RUN_8C_SUCCESSOR_SURFACE_MATERIAL_CONTRACT_ID:base.sourceAuthorities.run8CMaterialContractId,H_EARTH_ATMOSPHERE_STATE_CONTRACT_ID:base.sourceAuthorities.atmosphereContractId,H_EARTH_RUN_8E_R2_HISTORICAL_OCCURRENCE_ID:'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_OCCURRENCE_001',finite:Number.isFinite,freezeArray:x=>Object.freeze(Array.from(x)),freezeRecord:Object.freeze};
const apply=Function(...Object.keys(context),prelude+evaluate+adapter+'\nreturn applyHEarthVerifiedPlantingPackage;')(...Object.values(context));
const integrated=apply(base),canonical=apply(base,{canonicalBase:value.canonical});


const grassModule=new URL('grass-continuity-supplement.v1.js',new URL('file://'+sourceDir+'/'));
const root=new URL('../../../../',new URL('file://'+sourceDir+'/')),render=new URL('showroom/globe/h-earth/render/',root);
const mod=rel=>import(new URL(rel,root));
console.log('STAGE adapters-ready');
const bridge=await mod('showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js');
const geology=bridge.constructGeologicalRuntimeBridge(canonical);
console.log('STAGE geology-ready');
const terrain=await mod('h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs');
const placement=await mod('h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js');
const materials=await mod('h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js');
const woodland=await import(new URL('woodland-fine-grass.v1.js',render));
const habitatModule=await import(new URL('woodland-habitat-field.v1.js',render));
const oasis=await import(new URL('grass-lowland-trial.js',render));
const pilot=await import(new URL('landscape-planting-pilot.v1.js',render));
const owner=await import(new URL('vegetation-single-owner.prototype.v1.js',render));
const fixtureSource=fs.readFileSync(new URL('h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs',root),'utf8');
const start=fixtureSource.indexOf('async function buildCanonicalBeachFixture('),end=fixtureSource.indexOf("\n\n\ntest(",start);
const {readFile}=await import('node:fs/promises');
const fixture=Function('assert','readFile',fixtureSource.slice(start,end)+';return buildCanonicalBeachFixture;')(assert,readFile);
// This is the replacement-vegetation renderer's actual reference callback;
// source assertion prevents a fixture-only bypass if production changes.
assert(read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').slice(read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').indexOf('  function prepareReplacementVegetation')).includes('const protectedReferenceAt=()=>false;'));
const {visibleSurface}=await fixture({baseDirectory:root.pathname,pkg:integrated,geology,uploadSource:read('gpu-upload-views.run8e-r2d.js'),protectedReferenceAt:()=>false});
console.log('STAGE surface-ready');
const groundAdmission=await pilot.createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints,oasis:oasis.H_EARTH_OASIS_FOLIAGE_SAMPLE,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12});

const cover=await import(new URL('landscape-groundcover.global-v1.js',render));

function admit(x,z){const support=visibleSurface.sample(x,z);if(!support)return 'NO_TERRAIN';const before=groundAdmission.getReceipt().rejections;if(!groundAdmission(x,z,support)){const after=groundAdmission.getReceipt().rejections;return Object.keys(after).find(k=>after[k]>(before[k]??0))??'UNKNOWN';}
 const a=cover.inverseHEarthGroundCoverPoint(x,support.y,z),m=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z),w=visibleSurface.water.sample(x,z);
 if(w&&support.y<=w.y+.03)return 'WATER';
 if(m?.valid!==true||habitatModule.habitatSlopeWeight(support.slope,'RAVINE')<=0||!(m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20))return 'MATERIAL_OR_SLOPE';
 if(!woodland.woodlandGrassClear(a.x,a.z)||integrated.landscapeCoverFootprints.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.radius+.03))||integrated.landscapeFloorFootprints.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.trunkRadius+.10)))return 'PROTECTED_FOOTPRINT';return support;}

const {execFileSync}=await import('node:child_process');const {gzipSync}=await import('node:zlib');
const baseline='a4104e8014e78f86e4e576ea61cec6dcd94be003',sha=b=>createHash('sha256').update(b).digest('hex');
const gitRead=p=>execFileSync('git',['show',baseline+':'+p],{cwd:root.pathname,maxBuffer:100*1024*1024});
const asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',evidence='h-earth-3d/evidence/foothill-meadow-v1/';
const priorManifest=JSON.parse(gitRead(asset+'json')),prior=gunzipSync(gitRead(asset+'bin.gz'));
assert.equal(sha(prior),'a2f319294c9bbdadd02f6fee46348dc648511ad9ca41bca06ed24d87cb7c621d');assert.equal(priorManifest.rootCount,1017124);
const input=gunzipSync(fs.readFileSync(new URL(evidence+'roots.json.gz',root)));assert.equal(sha(input),'baed1236d4d65f5170709799cea295e3006e8604ca7394cf7498eec604f3b0a8');
const additions=JSON.parse(input);assert.equal(additions.length,110779);
const checkpoint=JSON.parse(fs.readFileSync(new URL(evidence+'checkpoint.json',root)));
const tiles=new Map(),positions=new Set(),occupancy=new Map(),newCells=new Set();let offset=0;
const cell=(x,z)=>Math.floor(x)+':'+Math.floor(z);
for(const t of priorManifest.tiles){const bytes=prior.subarray(offset,offset+t.count*52);offset+=bytes.length;tiles.set(t.id,{...t,originalCount:t.count,records:[bytes]});for(let i=0;i<t.count;i++){const x=bytes.readDoubleLE(i*52),z=bytes.readDoubleLE(i*52+16);assert(!positions.has(x+':'+z));positions.add(x+':'+z);const c=cell(x,z);occupancy.set(c,(occupancy.get(c)||0)+1);}}
let verified=0;
for(const r of additions){assert(!positions.has(r.x+':'+r.z));positions.add(r.x+':'+r.z);const s=admit(r.x,r.z);assert.notEqual(typeof s,'string','NEW_ROOT_ADMISSION');assert.equal(Math.fround(s.y),r.y);assert.equal(s.triangleId,r.triangleId);assert.equal(s.slope,r.slope);const tx=Math.floor(r.x/4),tz=Math.floor(r.z/4),id=tx+':'+tz;if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,count:0,originalCount:0,records:[]});const t=tiles.get(id),b=Buffer.alloc(52);for(const [i,k]of ['x','y','z','angle','slope'].entries()){assert(Number.isFinite(r[k]));b.writeDoubleLE(r[k],i*8);}for(const [i,k]of ['seed','triangleId'].entries()){assert(Number.isInteger(r[k]));b.writeUInt32LE(r[k],40+i*4);}b.writeUInt32LE(2,48);t.records.push(b);t.count++;assert(t.count<=1600);const c=cell(r.x,r.z);newCells.add(c);occupancy.set(c,(occupancy.get(c)||0)+1);verified++;}
console.log('STAGE all-additions-readmitted',verified);
const habitat=structuredClone(priorManifest.habitat),pixels=Buffer.from(prior.subarray(offset)),size=habitat.size,width=habitat.width,oldRight=new Uint8Array(size*size);for(let z=0;z<size;z++)oldRight.set(pixels.subarray(z*width+size,z*width+2*size),z*size);
const oldField={pixels:oldRight,size,bounds:habitat.ravine.bounds},bounds=checkpoint.config.atlasBounds,[x0,z0,x1,z1]=bounds;let atlasNewCells=0,atlasRejected=0;
for(let z=0;z<size;z++)for(let x=0;x<size;x++){const xx=x0+(x+.5)/size*(x1-x0),zz=z0+(z+.5)/size*(z1-z0),old=habitatModule.sampleWoodlandHabitat(oldField,xx,zz),c=cell(xx,zz);let extra=0;if(newCells.has(c)){if(typeof admit(xx,zz)==='string')atlasRejected++;else{extra=Math.min(1,(occupancy.get(c)||0)/24);atlasNewCells++;}}pixels[z*width+size+x]=Math.round(255*Math.max(old,extra));}
const newRight=new Uint8Array(size*size);for(let z=0;z<size;z++){newRight.set(pixels.subarray(z*width+size,z*width+2*size),z*size);assert.deepEqual(pixels.subarray(z*width,z*width+size),prior.subarray(offset+z*width,offset+z*width+size));}
const newField={pixels:newRight,size,bounds};let samples=0,sumAbs=0,maxLoss=0,maxGain=0,nonzeroOld=0,oldNonzeroLost=0,nonzeroAbs=0,nonzeroLoss=0;
for(let z=0;z<size;z++)for(let x=0;x<size;x++){const [a,b,c,d]=oldField.bounds,xx=a+(x+.5)/size*(c-a),zz=b+(z+.5)/size*(d-b),old=oldRight[z*size+x]/255,next=habitatModule.sampleWoodlandHabitat(newField,xx,zz),delta=next-old;samples++;sumAbs+=Math.abs(delta);maxLoss=Math.max(maxLoss,-delta);maxGain=Math.max(maxGain,delta);if(old>0){nonzeroOld++;nonzeroAbs+=Math.abs(delta);nonzeroLoss+=Math.max(0,-delta);if(next===0)oldNonzeroLost++;}}
const ordered=[...tiles.values()],rootBytes=Buffer.concat(ordered.flatMap(t=>t.records)),preserved=Buffer.concat(ordered.filter(t=>t.originalCount).map(t=>t.records[0]));assert.deepEqual(preserved,prior.subarray(0,offset));const total=1017124+additions.length;assert.equal(rootBytes.length,total*52);
const packed=new Float32Array(total*4);for(let i=0;i<total;i++)for(let j=0;j<4;j++)packed[i*4+j]=rootBytes.readDoubleLE(i*52+j*8);
const raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9});
const allocation={...priorManifest.receipt.grassContinuity.allocation,maximumRoots:total,maximumPackedBytes:total*16,maximumRavineRoots:total-385944};
const grassContinuity={...priorManifest.receipt.grassContinuity,addedContacts:priorManifest.receipt.grassContinuity.addedContacts+additions.length,totalContacts:total,packedBytes:total*16,allocation,foothillMeadowContacts:additions.length,maximumTileRoots:Math.max(...ordered.map(t=>t.count))};
const meadow={schema:'H_EARTH_FOOTHILL_MEADOW_v1',baseline,addedContacts:additions.length,totalContacts:total,savedCandidateSha256:sha(input),originalRootsPreserved:true,originalRootsSha256:sha(preserved),woodlandAtlasPreserved:true,atlasNewCells,atlasRejected,oldRavineWorldSpaceDelta:{samples,meanAbsolute:sumAbs/samples,maxLoss,maxGain,nonzeroOld,oldNonzeroLost,nonzeroMeanAbsolute:nonzeroAbs/nonzeroOld,nonzeroMeanLoss:nonzeroLoss/nonzeroOld},browserVerified:false,physicalDeviceAccepted:false};
const routeSource=fs.readFileSync(new URL('h-earth-3d/validation/h-earth.connector-fine-grass.v1.mjs',root),'utf8'),route=JSON.parse(routeSource.match(/const savedRoute=(\[.*?\]);/)[1]),routeValues=[];
for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.25);for(let j=0;j<steps;j++){const x=a[0]+(b[0]-a[0])*j/steps,z=a[1]+(b[1]-a[1])*j/steps;routeValues.push({old:habitatModule.sampleWoodlandHabitat(oldField,x,z),next:habitatModule.sampleWoodlandHabitat(newField,x,z)});}}
meadow.connectorRoute={samples:routeValues.length,oldMinimum:Math.min(...routeValues.map(v=>v.old)),newMinimum:Math.min(...routeValues.map(v=>v.next)),newMean:routeValues.reduce((a,v)=>a+v.next,0)/routeValues.length,belowQuarter:routeValues.filter(v=>v.next<.25).length,maxLoss:Math.max(...routeValues.map(v=>v.old-v.next))};
assert.equal(meadow.connectorRoute.belowQuarter,0,'CONNECTOR_SOIL_CONTINUITY_LOST');
const receipt={...priorManifest.receipt,contactCount:total,tileCount:ordered.length,grassContinuity,foothillMeadow:meadow};habitat.ravine.bounds=bounds;habitat.ravine.receipt={...habitat.ravine.receipt,bounds};habitat.receipt={...habitat.receipt,ravine:{...habitat.receipt.ravine,bounds},grassContinuity,foothillMeadow:meadow,coverageSource:'PRESERVED_WOODLAND_RESAMPLED_RAVINE_AND_ADMITTED_FOOTHILL_MEADOW'};
const manifest={...priorManifest,baseline,rootCount:total,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),tiles:ordered.map(({id,minX,minZ,count})=>({id,minX,minZ,count})),habitat,receipt};
const json=JSON.stringify(manifest)+'\n';fs.writeFileSync(new URL(asset+'bin.gz',root),compressed);fs.writeFileSync(new URL(asset+'json',root),json);
const loaderPath=new URL('precomputed-grass.v1.js',render);fs.writeFileSync(loaderPath,fs.readFileSync(loaderPath,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`).replaceAll('1017124',String(total)));
Object.assign(checkpoint,meadow,{originalTileCounts:priorManifest.tiles.map(t=>({id:t.id,count:t.count})),originalAtlasSha256:priorManifest.atlasSha256,rawSha256:sha(raw),packedSha256:manifest.packedSha256,atlasSha256:sha(pixels),compileMilliseconds:performance.now()-begin,compressedBytes:compressed.length});fs.writeFileSync(new URL(evidence+'checkpoint.json',root),JSON.stringify(checkpoint,null,2)+'\n');console.log(JSON.stringify(meadow));
