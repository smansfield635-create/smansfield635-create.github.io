import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash,webcrypto} from 'node:crypto';
const sourceDir=process.env.H_EARTH_GRASS_SOURCE_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../showroom/globe/h-earth/render');
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
test('supplement envelope has continuous shoulders and fixed bounded allocation',async()=>{
 const m=await import(grassModule),a=m.GRASS_CONTINUITY_ALLOCATION,e=m.createGrassContinuityEnvelope();
 assert.equal(a.maximumRoots*16,a.maximumPackedBytes);assert.equal(a.maximumTileRoots,1600);
 assert.equal(a.maximumRavineRoots+a.originalWoodlandRoots,a.maximumRoots);
 assert.equal(e.sample(40,-271),1);assert.equal(e.sample(40,-260),1);assert.equal(e.sample(40,-100),0);
 assert(e.weights.some(x=>x>0&&x<1));assert(e.weights.every(x=>Number.isFinite(x)&&x>=0&&x<=1));
 for(const x of [-298,88])assert.equal(e.sample(x,-300),0);
});

test('actual accepted roots survive and supplemented coverage uses actual rendered admission', async()=>{
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
const admissionWitnesses=new Map();const admitGround=(x,z,support)=>{const ok=groundAdmission(x,z,support);if(ok)admissionWitnesses.set(x+':'+z,support.y);return ok;};
const renderer=read('persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js');
const replacement=renderer.slice(renderer.indexOf('  function prepareReplacementVegetation'));
const fieldCode=replacement.slice(replacement.indexOf('      const habitat=applyVerifiedPlantingHabitat'),replacement.indexOf('      const presentation=await buildWoodlandFineGrass'));
assert(fieldCode.length>0);
const ctx={...habitatModule,applyVerifiedPlantingHabitat:woodland.applyVerifiedPlantingHabitat,yieldToBrowserPaint:async()=>{},visibleSurface,admitGround,unprojectPlanetVertex:terrain.unprojectPlanetVertex,pilotMaterialAt:materials.sampleHEarthRun8CSuccessorSurfaceMaterial,woodlandGrassClear:woodland.woodlandGrassClear,pilotPackage:integrated,resources:{geologicalRuntime:geology}};
const field=await Function(...Object.keys(ctx),`return(async()=>{${fieldCode};return habitat;})()`)(...Object.values(ctx));
console.log('STAGE field-ready');



const presentation=await woodland.buildWoodlandFineGrass(integrated,{visibleSurface,admitGround,habitat:field,onProgress:p=>{if(p.phase==='GRASS_CONTINUITY_CONTACTS'&&p.candidates%10000<1000)console.log('STAGE supplement',p.addedContacts,p.candidates);}});
const all=presentation.tiles.flatMap(t=>t.roots),original=all.filter(r=>r.region!=='RAVINE_SUPPLEMENT'),supplement=all.filter(r=>r.region==='RAVINE_SUPPLEMENT');
const sha=v=>createHash('sha256').update(v).digest('hex');
const originalPacked=new Float32Array(original.length*4);original.forEach((r,i)=>originalPacked.set([r.x,r.y,r.z,r.angle],i*4));
assert.equal(original.length,525142);assert.equal(sha(Buffer.from(originalPacked.buffer)),'d90752a5e4d9c4f1f3e0bcc56edac6bc53cff09e07f1c70c0b1f12f9fff06dde');
assert(supplement.length>0);assert.equal(new Set(all.map(r=>r.x+':'+r.z)).size,all.length);
for(const r of supplement){assert(admissionWitnesses.has(r.x+':'+r.z));assert.equal(r.y,Math.fround(admissionWitnesses.get(r.x+':'+r.z)));}
const metadata=Buffer.alloc(original.length*8);original.forEach((r,i)=>{metadata.writeUInt32LE(r.seed>>>0,i*8);metadata.writeUInt32LE(r.region==='RAVINE'?1:0,i*8+4);});
assert.equal(sha(metadata),'fbdd8604fb367bfce0528edfa01f13d5b797ad9d6a0804e7dfbc57806ac09417');
const tiles=owner.planImmutableTiles(presentation),count=tiles.reduce((n,t)=>n+t.count,0);
assert.equal(count,all.length);assert(count<=1000000);assert(count*16<=16000000);assert(tiles.every(t=>t.count<=1600));
for(let z=0;z<field.size;z++)assert.deepEqual(presentation.habitat.pixels.slice(z*field.width,z*field.width+field.size),field.pixels.slice(z*field.width,z*field.width+field.size));
// Density counts include saved and new roots; denominator is independently
// sampled hard-admitted square metres, not the proposal mask footprint.
const byCell=new Map();for(const r of all){const key=Math.floor(r.x)+':'+Math.floor(r.z);byCell.set(key,(byCell.get(key)||0)+1);}
const supplemental=await import(grassModule),envelope=supplemental.createGrassContinuityEnvelope();
const cover=await import(new URL('landscape-groundcover.global-v1.js',render));
const acceptCode=grass.slice(grass.indexOf(' const acceptRoot=(x,z,region)=>{'),grass.indexOf(' return appendGrassContinuity(original'));
const acceptContext={visibleSurface,admitGround:groundAdmission,inverseHEarthGroundCoverPoint:cover.inverseHEarthGroundCoverPoint,materialAt:materials.sampleHEarthRun8CSuccessorSurfaceMaterial,habitatSlopeWeight:habitatModule.habitatSlopeWeight,woodlandGrassClear:woodland.woodlandGrassClear,obstacles:integrated.landscapeCoverFootprints,trees:integrated.landscapeFloorFootprints};
const accept=Function(...Object.keys(acceptContext),acceptCode+';return acceptRoot;')(...Object.values(acceptContext));
const zones=[{id:'WOODLAND_EXIT',bounds:[-120,-272,-100,-252]},{id:'NEAR_BANK',bounds:[-80,-296,-60,-276]},{id:'MID_BANK',bounds:[-40,-296,-20,-276]},{id:'CAVE_ENTRANCE',bounds:[28,-272,52,-256]},{id:'ADDED_TREES',bounds:[44,-324,76,-290]}];
const zoneMetrics=[];
for(const zone of zones){const[x0,z0,x1,z1]=zone.bounds;let eligible=0,occupied=0,roots=0,atlasCovered=0,hardAdmittedArea=0,proposedArea=0,hardOccupiedArea=0;const cells=[];
 for(let z=z0;z<z1;z++)for(let x=x0;x<x1;x++){let ok=true;for(const dz of [.25,.75])for(const dx of [.25,.75]){if(!accept(x+dx,z+dz,'RAVINE'))ok=false;}if(!ok||field.woodland.sample(x+.5,z+.5)>0)continue;hardAdmittedArea++;if((byCell.get(x+':'+z)||0)>0)hardOccupiedArea++;if(envelope.sample(x+.5,z+.5)>0)proposedArea++;if(envelope.sample(x+.5,z+.5)<.95)continue;eligible++;if(presentation.habitat.ravine.sample(x+.5,z+.5)>.05)atlasCovered++;const n=byCell.get(x+':'+z)||0;roots+=n;if(n)occupied++;cells.push([x,z,n]);}
 zoneMetrics.push({id:zone.id,areaConvention:'HARD_ADMITTED_NONWOODLAND_ONE_METRE_CELLS_FOUR_QUARTER_POINT_WITNESSES',hardAdmittedArea,hardOccupiedArea,proposedArea,proposedCoreFraction:hardAdmittedArea?eligible/hardAdmittedArea:null,eligibleArea:eligible,occupiedCells:occupied,atlasCoveredCells:atlasCovered,atlasCoverage:eligible?atlasCovered/eligible:null,rootCount:roots,density:eligible?roots/eligible:null,occupancy:eligible?occupied/eligible:null,woodlandDensityRatio:eligible?roots/eligible/presentation.receipt.grassContinuity.reference.density:null});
}
// Actual occupied, hard-admitted one-metre cells form the path graph. Links
// also require actual midpoint admission, so water/protected gaps are not bridged.
const graph=new Map(),hardGraph=new Map();
for(let z=-340;z<-238;z++)for(let x=-130;x<90;x++){const key=x+':'+z;if(accept(x+.5,z+.5,'RAVINE')){hardGraph.set(key,[x,z]);if((byCell.get(key)||0)>0)graph.set(key,[x,z]);}}
const components=new Map();let component=0;
for(const [key,cell] of graph){if(components.has(key))continue;const queue=[cell];components.set(key,component);for(let i=0;i<queue.length;i++){const[x,z]=queue[i];for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const next=(x+dx)+':'+(z+dz);if(!graph.has(next)||components.has(next)||!accept(x+.5+dx/2,z+.5+dz/2,'RAVINE'))continue;components.set(next,component);queue.push(graph.get(next));}}component++;}
const hardComponents=new Map();let hardComponent=0;for(const[key,cell]of hardGraph){if(hardComponents.has(key))continue;const queue=[cell];hardComponents.set(key,hardComponent);for(let i=0;i<queue.length;i++){const[x,z]=queue[i];for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]]){const next=(x+dx)+':'+(z+dz);if(!hardGraph.has(next)||hardComponents.has(next)||!accept(x+.5+dx/2,z+.5+dz/2,'RAVINE'))continue;hardComponents.set(next,hardComponent);queue.push(hardGraph.get(next));}}hardComponent++;}
const witnesses=[['WOODLAND_EXIT',-108,-256],['NEAR_BANK',-70,-286],['MID_BANK',-30,-286],['CAVE_ENTRANCE',40,-260],['ADDED_TREES',60,-306]].map(([id,x,z])=>{let best=null;for(const[key,[xx,zz]]of graph){const distance=Math.hypot(xx+.5-x,zz+.5-z);if(distance<=8&&(!best||distance<best.distance))best={id,requestedX:x,requestedZ:z,x:xx+.5,z:zz+.5,distance,component:components.get(key),hardComponent:hardComponents.get(key)};}return best??{id,requestedX:x,requestedZ:z,missing:true};});
const connectivity={sampleResolution:1,adjacency:'FOUR_NEIGHBOURS_WITH_ACTUAL_MIDPOINT_ADMISSION',bounds:[-130,-340,90,-238],componentCount:component,hardComponentCount:hardComponent,policy:'CONNECT_WITHIN_HARD_ELIGIBLE_COMPONENTS_PRESERVE_EXCLUSION_GAPS',witnesses};
const caveSupport=visibleSurface.sample(40,-260),beforeCave=groundAdmission.getReceipt().rejections,caveAdmitted=!!accept(40,-260,'RAVINE'),afterCave=groundAdmission.getReceipt().rejections;
const caveRejections=Object.keys(afterCave).filter(k=>(afterCave[k]||0)>(beforeCave[k]||0));
const caveMouth={x:40,z:-260,supportPresent:!!caveSupport,hardAdmitted:caveAdmitted,rejectionReasons:caveRejections,supportOwner:caveSupport?.owner,supportSlope:caveSupport?.slope,proposalWeight:envelope.sample(40,-260),atlasWeight:presentation.habitat.ravine.sample(40,-260),rootsInOneMetreCell:byCell.get('40:-260')||0};
const beachX=3.7832353115081787,beachZ=-127.66645812988281,beachSupport=visibleSurface.ground.sample(beachX,beachZ),beachSignal=visibleSurface.beach.sample({x:beachX,z:beachZ,support:beachSupport});
assert(beachSignal.rawSandCoverage>.90);assert.equal(accept(beachX,beachZ,'RAVINE'),null);assert.equal(presentation.habitat.ravine.sample(beachX,beachZ),0);
const receipt={...presentation.receipt.grassContinuity,connectivity,caveMouth,beachNegative:{x:beachX,z:beachZ,sandCoverage:beachSignal.rawSandCoverage,admitted:false},originalPackedSha256:sha(Buffer.from(originalPacked.buffer)),originalSeedRegionSha256:sha(metadata),zoneMetrics,exactWorldSha256:sha(world),cpuSupportAndSubmissionOnly:true,renderedAcceptance:false};
if(process.env.H_EARTH_GRASS_QUALIFICATION_JSON)fs.writeFileSync(process.env.H_EARTH_GRASS_QUALIFICATION_JSON,JSON.stringify(receipt,null,2)+'\n');
console.log('GRASS_CONTINUITY_CPU',JSON.stringify(receipt));
assert(witnesses.every(w=>!w.missing),'every named region has an eligible occupied witness within 8 metres');for(const a of witnesses)for(const b of witnesses)if(a.hardComponent===b.hardComponent)assert.equal(a.component,b.component,'occupied continuity within admissible bank '+a.id+' to '+b.id);
if(caveMouth.hardAdmitted){assert(caveMouth.rootsInOneMetreCell>0,'admitted cave-mouth cell occupied');assert(caveMouth.atlasWeight>.05,'admitted cave-mouth atlas coverage');}else assert(caveMouth.rejectionReasons.length>0,'actual cave-mouth exclusion reason recorded');
// The exit has no supplemental-eligible cells in this fixed sample.
// Its preservation is established by exact original hashes and occupied witness.
// Supplemental density applies only where the original woodland field is zero.
assert.equal(zoneMetrics.find(z=>z.id==='WOODLAND_EXIT').hardAdmittedArea,0);
for(const zone of zoneMetrics.filter(z=>z.id!=='WOODLAND_EXIT')){assert(zone.atlasCoverage>=.95,'actual linear atlas coverage '+zone.id);assert(zone.eligibleArea>=4,'insufficient eligible interior '+zone.id);assert(zone.occupancy>=.95,'occupied interior '+zone.id);assert(zone.woodlandDensityRatio>=.85&&zone.woodlandDensityRatio<=1.20,'woodland density match '+zone.id+':'+zone.woodlandDensityRatio);}
});
