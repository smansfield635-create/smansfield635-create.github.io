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
// The saved candidate is input, not regenerated at startup or during compilation.
const {execFileSync}=await import('node:child_process');
const {gzipSync}=await import('node:zlib');
const sha=b=>createHash('sha256').update(b).digest('hex');
const baseline='08bcd74a55022e60b4e3d743ecf9bd1df9bb08d0';
const gitRead=p=>execFileSync('git',['show',baseline+':'+p],{cwd:root.pathname,maxBuffer:80*1024*1024});
const asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.';
const dependencyPaths=['live-render-package.run8e-r2.js','live-render-package.run8e-r2.canonical.js','landscape-planting-pilot.v1.js','woodland-fine-grass.v1.js','woodland-habitat-field.v1.js','landscape-groundcover.global-v1.js','gpu-upload-views.run8e-r2d.js','verified-planting-packet.v1.js'].map(p=>'showroom/globe/h-earth/render/'+p).concat(['showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js','h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs','h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js','h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js','h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs']);
for(const p of dependencyPaths)assert.deepEqual(fs.readFileSync(new URL(p,root)),gitRead(p),'Admission dependency changed: '+p);
const priorManifest=JSON.parse(gitRead(asset+'json')),prior=gunzipSync(gitRead(asset+'bin.gz'));
assert.equal(sha(prior),priorManifest.rawSha256);assert.equal(priorManifest.rootCount,988170);
const inputPath=new URL('h-earth-3d/evidence/connector-fine-grass-v1/connector-roots.json.gz',root);
const input=gunzipSync(fs.readFileSync(inputPath));assert.equal(sha(input),'2f90e9ddd3e4e3cb082289fcc49198002afa8b22480ebcdea65121e7892270a5');
const additions=JSON.parse(input);assert.equal(additions.length,28954);
const tiles=new Map(),positions=new Set(),occupancy=new Map(),newCells=new Set();let offset=0;
const cell=(x,z)=>Math.floor(x)+':'+Math.floor(z);
for(const t of priorManifest.tiles){
 const bytes=prior.subarray(offset,offset+t.count*52);offset+=bytes.length;
 tiles.set(t.id,{...t,originalCount:t.count,records:[bytes],added:0});
 for(let i=0;i<t.count;i++){const x=bytes.readDoubleLE(i*52),z=bytes.readDoubleLE(i*52+16),key=x+':'+z;assert(!positions.has(key));positions.add(key);const c=cell(x,z);occupancy.set(c,(occupancy.get(c)||0)+1);}
}
assert.equal(offset,988170*52);
for(const r of additions){
 assert.equal(r.region,'RAVINE_SUPPLEMENT');assert(!positions.has(r.x+':'+r.z));positions.add(r.x+':'+r.z);
 const tx=Math.floor(r.x/4),tz=Math.floor(r.z/4),id=tx+':'+tz;
 if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,count:0,originalCount:0,records:[],added:0});
 const t=tiles.get(id),b=Buffer.alloc(52);
 for(const [i,k]of ['x','y','z','angle','slope'].entries()){assert(Number.isFinite(r[k]));b.writeDoubleLE(r[k],i*8);}
 for(const [i,k]of ['seed','triangleId'].entries()){assert(Number.isInteger(r[k])&&r[k]>=0&&r[k]<=0xffffffff);b.writeUInt32LE(r[k],40+i*4);}
 b.writeUInt32LE(2,48);t.records.push(b);t.count++;t.added++;assert(t.count<=1600);
 const c=cell(r.x,r.z);newCells.add(c);occupancy.set(c,(occupancy.get(c)||0)+1);
}
const habitat=structuredClone(priorManifest.habitat),pixels=Buffer.from(prior.subarray(offset)),size=habitat.size,width=habitat.width;
const [x0,z0,x1,z1]=habitat.ravine.bounds;let atlasCandidates=0,atlasRejected=0,atlasChanged=0;
for(let z=0;z<size;z++)for(let x=0;x<size;x++){
 const xx=x0+(x+.5)/size*(x1-x0),zz=z0+(z+.5)/size*(z1-z0),c=cell(xx,zz);
 if(!newCells.has(c))continue;atlasCandidates++;
 if(typeof admit(xx,zz)==='string'){atlasRejected++;continue;}
 const i=z*width+size+x,v=Math.round(255*Math.min(1,occupancy.get(c)/41.9375));
 if(v>pixels[i]){pixels[i]=v;atlasChanged++;}
}
for(let z=0;z<size;z++)assert.deepEqual(pixels.subarray(z*width,z*width+size),prior.subarray(offset+z*width,offset+z*width+size));
// Existing tile order and within-tile order survive; new tiles follow deterministically.
const ordered=[...tiles.values()],rootBytes=Buffer.concat(ordered.flatMap(t=>t.records));
assert.equal(rootBytes.length,1017124*52);
const preserved=Buffer.concat(ordered.filter(t=>t.originalCount).map(t=>t.records[0]));assert.deepEqual(preserved,prior.subarray(0,offset));
const packed=new Float32Array(1017124*4);for(let i=0;i<1017124;i++)for(let j=0;j<4;j++)packed[i*4+j]=rootBytes.readDoubleLE(i*52+j*8);
const raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9});
const savedRoute=[[-109,-257],[-109,-259],[-109,-261],[-109,-263],[-109,-265],[-109,-267],[-109,-269],[-109,-271],[-107,-271],[-105,-271],[-103,-271],[-101,-271],[-99,-271],[-97,-271],[-95,-271],[-95,-273],[-95,-275],[-93,-275],[-91,-275],[-89,-275],[-87,-275],[-85,-275],[-83,-275],[-81,-275],[-79,-275],[-77,-275],[-75,-275],[-75,-277],[-73,-277],[-71,-277],[-71,-279],[-69,-279],[-67,-279],[-65,-279],[-63,-279],[-61,-279],[-59,-279],[-57,-279],[-55,-279],[-53,-279],[-51,-279],[-49,-279],[-47,-279],[-45,-279],[-43,-279],[-41,-279],[-41,-277],[-39,-277],[-37,-277],[-35,-277],[-33,-277],[-31,-277],[-29,-277],[-27,-277],[-25,-277],[-23,-277],[-21,-277],[-19,-277],[-19,-275],[-17,-275],[-15,-275],[-13,-275],[-11,-275],[-9,-275],[-9,-273],[-7,-273],[-5,-273],[-3,-273],[-1,-273],[1,-273],[3,-273],[5,-273],[7,-273],[7,-271],[9,-271],[11,-271],[11,-269],[13,-269],[15,-269],[17,-269],[19,-269],[21,-269],[23,-269],[25,-269],[27,-269],[27,-267],[27,-265]];
const rightPixels=new Uint8Array(size*size);for(let z=0;z<size;z++)rightPixels.set(pixels.subarray(z*width+size,z*width+2*size),z*size);
const routeCoverage=[];for(let i=1;i<savedRoute.length;i++){const a=savedRoute[i-1],b=savedRoute[i],steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.25);for(let j=0;j<steps;j++){const t=j/steps;routeCoverage.push(habitatModule.sampleWoodlandHabitat({pixels:rightPixels,size,bounds:habitat.ravine.bounds},a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t));}}
const connector={schema:'H_EARTH_CONNECTOR_FINE_GRASS_v1',baseline,addedContacts:28954,totalContacts:1017124,packedBytes:16273984,maximumTileRoots:Math.max(...ordered.map(t=>t.count)),savedCandidateSha256:sha(input),originalRootsSha256:sha(preserved),originalRootsPreserved:true,woodlandAtlasPreserved:true,atlasCandidates,atlasRejected,atlasChanged,routeAtlasCoverage:{samples:routeCoverage.length,minimum:Math.min(...routeCoverage),mean:routeCoverage.reduce((a,b)=>a+b,0)/routeCoverage.length,belowQuarter:routeCoverage.filter(x=>x<.25).length},atlasAdmission:'ACTUAL_PRODUCTION_ADMISSION_AT_TEXEL_CENTER_WITH_ADDED_ROOT_CELL',browserVerified:false,physicalDeviceAccepted:false};
const allocation={...priorManifest.receipt.grassContinuity.allocation,maximumRoots:1017124,maximumPackedBytes:16273984,maximumRavineRoots:631180};
const grassContinuity={...priorManifest.receipt.grassContinuity,addedContacts:491982,totalContacts:1017124,packedBytes:16273984,allocation,maximumTileRoots:connector.maximumTileRoots,priorSupplementContacts:463028,connectorContacts:28954,candidates:priorManifest.receipt.grassContinuity.candidates+67247,rejectedCandidates:priorManifest.receipt.grassContinuity.rejectedCandidates+38293};
const receipt={...priorManifest.receipt,contactCount:1017124,tileCount:ordered.length,grassContinuity,connector};
const manifest={...priorManifest,baseline,rootCount:1017124,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),tiles:ordered.map(({id,minX,minZ,count})=>({id,minX,minZ,count})),habitat:{...habitat,receipt:{...habitat.receipt,grassContinuity,connector}},receipt};
const json=JSON.stringify(manifest)+'\n';
fs.writeFileSync(new URL(asset+'bin.gz',root),compressed);fs.writeFileSync(new URL(asset+'json',root),json);
const loaderPath=new URL('precomputed-grass.v1.js',render);fs.writeFileSync(loaderPath,fs.readFileSync(loaderPath,'utf8').replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`));
const checkpoint={...connector,rawSha256:sha(raw),packedSha256:manifest.packedSha256,originalTileCounts:priorManifest.tiles.map(t=>({id:t.id,count:t.count})),originalAtlasSha256:priorManifest.atlasSha256,atlasSha256:sha(pixels),routeSamples:602,routeSampleFailures:0,continuousRouteProof:false,uniform20mCoverageClaim:false,shortfallCells:757,originalPopulation:988170,woodlandRoots:385944,ravineRoots:631180,bladeHalfWidthMeters:[.010,.016],bladeHeightMeters:[.11,.21],soilChange:'Habitat-only organic earth palette and stronger blend; terrain geometry unchanged',compileMilliseconds:performance.now()-begin};
fs.writeFileSync(new URL('h-earth-3d/evidence/connector-fine-grass-v1/checkpoint.json',root),JSON.stringify(checkpoint,null,2)+'\n');
console.log(JSON.stringify(connector));
