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

const {execFileSync}=await import('node:child_process'),{gzipSync}=await import('node:zlib');
const {COASTAL_GRASS:config,createCoastalField,coastalDivide}=await import(new URL('grass-coastal-field.v1.js',render));
const {deriveHEarthGen311RegionalArticulation:regional}=await mod('h-earth-3d/terrain/h-earth.gen2514-qualified-successor-terrain-field.run8b.js');
const sha=b=>createHash('sha256').update(b).digest('hex'),asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.',evidence='h-earth-3d/evidence/grass-coastal-v1/';
// Local identical-tree ancestry may be supplied explicitly; immutable hashes remain mandatory.
const gitRead=p=>execFileSync('git',['show',(process.env.H_EARTH_COASTAL_BASELINE_REF||config.baseline)+':'+p],{cwd:root.pathname,maxBuffer:100*1024*1024});
const priorJson=gitRead(asset+'json'),priorCompressed=gitRead(asset+'bin.gz'),prior=gunzipSync(priorCompressed),priorManifest=JSON.parse(priorJson);
assert.equal(sha(priorJson),config.priorManifestSha256);assert.equal(sha(priorCompressed),config.priorCompressedSha256);assert.equal(sha(prior),config.priorRawSha256);assert.equal(priorManifest.rootCount,config.originalRoots);
const tiles=new Map(),positions=new Set(),occupancy=new Map(),newCells=new Set(),unfilledWitnesses=[],cell=(x,z)=>Math.floor(x)+':'+Math.floor(z);let offset=0;
for(const t of priorManifest.tiles){const bytes=prior.subarray(offset,offset+t.count*52);offset+=bytes.length;tiles.set(t.id,{...t,originalCount:t.count,records:[bytes]});for(let i=0;i<t.count;i++){const x=bytes.readDoubleLE(i*52),z=bytes.readDoubleLE(i*52+16);positions.add(x+':'+z);const c=cell(x,z);occupancy.set(c,(occupancy.get(c)||0)+1);}}
const woodlandPixels=new Uint8Array(192*192);for(let z=0;z<192;z++)woodlandPixels.set(prior.subarray(offset+z*384,offset+z*384+192),z*192);
const woodlandField={pixels:woodlandPixels,size:192,bounds:priorManifest.habitat.bounds};
function admit(x,z){if(z<=coastalDivide(x)||habitatModule.sampleWoodlandHabitat(woodlandField,x,z)>0)return null;
 const support=visibleSurface.sample(x,z);if(!support||!groundAdmission(x,z,support))return null;
 const a=cover.inverseHEarthGroundCoverPoint(x,support.y,z),material=materials.sampleHEarthRun8CSuccessorSurfaceMaterial(a.x,a.z),water=visibleSurface.water.sample(x,z);
 if(water&&support.y<=water.y+.03)return null;
 if(material?.valid!==true||support.slope>1.6||!(material.surfaceClass==='STONE_AND_SPARSE_SOIL'?material.soilDepth>=.035:['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)&&material.soilDepth>=.20))return null;
 if(!woodland.woodlandGrassClear(a.x,a.z)||integrated.landscapeCoverFootprints.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.radius+.03))||integrated.landscapeFloorFootprints.some(t=>Math.hypot(x-t.x,z-t.z)<(t.grassExclusionRadius??t.trunkRadius+.10)))return null;
 return{support,material,local:a};}
const rows=[],[scanX0,scanZ0,scanX1,scanZ1]=config.scanBounds;
for(let cz=scanZ0;cz<scanZ1;cz++)for(let cx=scanX0;cx<scanX1;cx++){const x=cx+.5,z=cz+.5;if(z<=coastalDivide(x))continue;const point=admit(x,z);if(point)rows.push({x,z,y:point.support.y,landform:regional(point.local.x,point.local.z).landformClass});}
const field=createCoastalField(rows,(x,z)=>visibleSurface.sample(x,z));
assert(field.bounds[0]>scanX0&&field.bounds[2]<scanX1&&field.bounds[3]<scanZ1,'COASTAL_SCAN_MUST_ENCLOSE_FULL_COMPONENT_AND_SHOULDER');
console.log('STAGE coastal-field',JSON.stringify({bounds:field.bounds,coreBounds:field.coreBounds,coreCells:field.coreCells,frontCells:field.frontCells}));
const originalOccupancy=new Map(occupancy),additions=[],hash=habitatModule.habitatHash,s=config.spacing,f=Math.fround;let eligibleCells=0,unfilledCells=0,rejected=0,targetAdditions=0;
const [x0,z0,x1,z1]=field.bounds;
for(let cz=z0;cz<z1;cz++)for(let cx=x0;cx<x1;cx++){
 const center=admit(cx+.5,cz+.5);if(!center)continue;const density=field.sample(cx+.5,center.support.y,cz+.5,center.material);if(density<=0)continue;
 const quota=Math.floor(density)+(hash(cx,cz,config.seed+1)/4294967296<density%1?1:0),c=cell(cx,cz),needed=Math.max(0,quota-(occupancy.get(c)||0));if(!needed)continue;eligibleCells++;targetAdditions+=needed;
 const points=[];for(let iz=Math.floor(cz/s)-1;iz<=Math.ceil((cz+1)/s);iz++)for(let ix=Math.floor(cx/s)-1;ix<=Math.ceil((cx+1)/s);ix++){
  const x=f((ix+.5+(hash(ix,iz,config.seed+2)/4294967296-.5)*.76)*s),z=f((iz+.5+(hash(ix,iz,config.seed+3)/4294967296-.5)*.76)*s);
  if(Math.floor(x)!==cx||Math.floor(z)!==cz||positions.has(x+':'+z))continue;points.push({x,z,ix,iz,rank:hash(ix,iz,config.seed+4)});
 }points.sort((a,b)=>a.rank-b.rank||a.iz-b.iz||a.ix-b.ix);
 const rejectedBefore=rejected,acceptedBefore=additions.length;
 for(const {x,z,ix,iz}of points){if((occupancy.get(c)||0)>=quota)break;const point=admit(x,z);if(!point||field.sample(x,point.support.y,z,point.material)<=0){rejected++;continue;}
  const support=point.support,tx=Math.floor(x/4),tz=Math.floor(z/4),id=tx+':'+tz;if(!tiles.has(id))tiles.set(id,{id,minX:tx*4,minZ:tz*4,count:0,originalCount:0,records:[]});const tile=tiles.get(id);
  assert(additions.length<config.maximumAdditions,'COASTAL_BUDGET_EXCEEDED_NO_TRUNCATION');assert(tile.count<config.maximumTileRoots,'COASTAL_TILE_EXCEEDED');
  const r={x,y:f(support.y),z,angle:f(hash(ix+10000000,iz+10000000,3)/4294967296*Math.PI*2),slope:support.slope,seed:hash(ix+10000000,iz+10000000,4),triangleId:support.triangleId,region:'RAVINE_SUPPLEMENT'};
  const b=Buffer.alloc(52);for(const [i,k]of ['x','y','z','angle','slope'].entries())b.writeDoubleLE(r[k],i*8);b.writeUInt32LE(r.seed,40);b.writeUInt32LE(r.triangleId,44);b.writeUInt32LE(2,48);tile.records.push(b);tile.count++;additions.push(r);positions.add(x+':'+z);occupancy.set(c,(occupancy.get(c)||0)+1);newCells.add(c);
 }if((occupancy.get(c)||0)<quota){unfilledCells++;unfilledWitnesses.push({cx,cz,quota,prior:originalOccupancy.get(c)||0,final:occupancy.get(c)||0,availableCandidates:points.length,rejectedCandidates:rejected-rejectedBefore,acceptedCandidates:additions.length-acceptedBefore});}
}
console.log('STAGE additions',JSON.stringify({count:additions.length,targetAdditions,eligibleCells,unfilledCells,rejected}));
const habitat=structuredClone(priorManifest.habitat),size=192,width=576,pixels=Buffer.alloc(width*size),priorPixels=prior.subarray(offset);
for(let z=0;z<size;z++)priorPixels.copy(pixels,z*width,z*384,z*384+384);
const stepX=(x1-x0)/size,stepZ=(z1-z0)/size;let coastalTexels=0;
for(let z=0;z<size;z++)for(let x=0;x<size;x++){
 const xx=x0+(x+.5)*stepX,zz=z0+(z+.5)*stepZ;if(!newCells.has(cell(xx,zz)))continue;
 let valid=true;for(const dz of [-1,0,1])for(const dx of [-1,0,1]){const px=xx+dx*stepX,pz=zz+dz*stepZ,p=admit(px,pz);if(!p||field.sample(px,p.support.y,pz,p.material)<=0)valid=false;}
 if(!valid)continue;pixels[z*width+384+x]=Math.round(255*Math.min(1,(occupancy.get(cell(xx,zz))||0)/24));if(pixels[z*width+384+x])coastalTexels++;
}
habitat.width=width;habitat.height=size;habitat.coastal={bounds:field.bounds,size,coverageSource:'ADMITTED_COASTAL_NEW_ROOT_CELLS_WITH_ONE_TEXEL_SUPPORT_BUFFER'};
const ordered=[...tiles.values()],rootBytes=Buffer.concat(ordered.flatMap(t=>t.records)),preserved=Buffer.concat(ordered.filter(t=>t.originalCount).map(t=>t.records[0]));assert.deepEqual(preserved,prior.subarray(0,offset));
for(let z=0;z<size;z++)assert.deepEqual(pixels.subarray(z*width,z*width+384),priorPixels.subarray(z*384,z*384+384));
const total=config.originalRoots+additions.length,packed=new Float32Array(total*4);for(let i=0;i<total;i++)for(let j=0;j<4;j++)packed[i*4+j]=rootBytes.readDoubleLE(i*52+j*8);
assert(total<=config.maximumRoots&&packed.byteLength<=config.maximumPackedBytes);const raw=Buffer.concat([rootBytes,pixels]),compressed=gzipSync(raw,{level:9}),saved=Buffer.from(JSON.stringify(additions));
const measurement={schema:'H_EARTH_COASTAL_GRASS_v1',baseline:config.baseline,originalCount:config.originalRoots,addedContacts:additions.length,totalContacts:total,packedBytes:packed.byteLength,maximumTileRoots:Math.max(...ordered.map(t=>t.count)),eligibleCells,targetAdditions,unfilledCells,unfilledWitnesses,rejectedCandidates:rejected,originalRootsPreserved:true,originalRootsSha256:sha(preserved),oldAtlasPanelsPreserved:true,oldAtlasBoundsPreserved:true,oldAtlasWorldSamplingPreserved:true,combinedAtlasMayIncreaseOnly:true,coastalTexels,field:{bounds:field.bounds,coreBounds:field.coreBounds,coreCells:field.coreCells,frontCells:field.frontCells,componentCount:field.componentCount,sideDefinition:'NAMED_RIDGE_SIDE_WITH_ENDPOINT_CONTINUATION_NOT_WATERSHED',ridgeFeatherMeters:[8,14],shoulderMeters:[10,16],densitySlopeFilter:'SEPARATED_1_4_6_4_1_AT_2M_OFFSETS',shoreDistanceFeather:[34,44]},savedCandidateSha256:sha(saved),browserVerified:false,physicalDeviceAccepted:false};
const allocation={...priorManifest.receipt.grassContinuity.allocation,maximumRoots:config.maximumRoots,maximumPackedBytes:config.maximumPackedBytes,maximumRavineRoots:config.maximumRoots-385944};
const continuity={...priorManifest.receipt.grassContinuity,addedContacts:priorManifest.receipt.grassContinuity.addedContacts+additions.length,totalContacts:total,packedBytes:packed.byteLength,allocation,maximumTileRoots:measurement.maximumTileRoots};
const receipt={...priorManifest.receipt,contactCount:total,tileCount:ordered.length,grassContinuity:continuity,coastalGrass:measurement};habitat.receipt={...habitat.receipt,width,height:size,byteLength:pixels.length,regionCount:3,grassContinuity:continuity,coastalGrass:measurement};
const manifest={...priorManifest,baseline:config.baseline,rootCount:total,rawBytes:raw.length,compressedBytes:compressed.length,rawSha256:sha(raw),compressedSha256:sha(compressed),packedSha256:sha(Buffer.from(packed.buffer)),atlasSha256:sha(pixels),tiles:ordered.map(({id,minX,minZ,count})=>({id,minX,minZ,count})),habitat,receipt};
const json=JSON.stringify(manifest)+'\n',checkpoint={...measurement,config,originalTileCounts:priorManifest.tiles.map(t=>({id:t.id,count:t.count})),originalAtlasSha256:priorManifest.atlasSha256,originalManifestSha256:sha(priorJson),rawSha256:sha(raw),packedSha256:manifest.packedSha256,atlasSha256:manifest.atlasSha256,compressedBytes:compressed.length};
const write=p=>new URL(p,root);
if(process.argv.includes('--verify')){assert.deepEqual(fs.readFileSync(write(asset+'bin.gz')),compressed);assert.equal(fs.readFileSync(write(asset+'json'),'utf8'),json);assert.deepEqual(gunzipSync(fs.readFileSync(write(evidence+'roots.json.gz'))),saved);assert.equal(fs.readFileSync(write(evidence+'checkpoint.json'),'utf8'),JSON.stringify(checkpoint,null,2)+'\n');console.log('DETERMINISTIC_COASTAL_RECOMPILE_EVERY_ROOT_ADMISSION_PASS');process.exit(0);}
fs.mkdirSync(write(evidence),{recursive:true});fs.writeFileSync(write(evidence+'roots.json.gz'),gzipSync(saved,{level:9}));fs.writeFileSync(write(evidence+'checkpoint.json'),JSON.stringify(checkpoint,null,2)+'\n');fs.writeFileSync(write(asset+'bin.gz'),compressed);fs.writeFileSync(write(asset+'json'),json);
// Patch the current startup loader only; never restore a historical loader body.
const loaderPath=new URL('precomputed-grass.v1.js',render),loader=fs.readFileSync(loaderPath,'utf8');
assert(loader.includes('loadedBytes:offset')&&loader.includes('takePrecomputedGrassPlan'));
fs.writeFileSync(loaderPath,loader.replace(/const MANIFEST_SHA256='[^']*';/,`const MANIFEST_SHA256='${sha(json)}';`).replaceAll('manifest.rootCount!==1250134',`manifest.rootCount!==${total}`).replaceAll('manifest.receipt?.contactCount!==1250134',`manifest.receipt?.contactCount!==${total}`));
console.log(JSON.stringify(measurement));
