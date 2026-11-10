import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {applyHEarthVerifiedPlantingPackage} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {buildVegetationVisibleSurface} from '../../showroom/globe/h-earth/render/vegetation-visible-surface.v1.js';
import {buildHEarthGlobalGroundCover,H_EARTH_GLOBAL_GROUND_COVER,H_EARTH_GLOBAL_GROUND_COVER_SOUTHERN_PILOT,selectHEarthGlobalGroundCoverDraws,transformHEarthGroundCoverRoot,inverseHEarthGroundCoverPoint} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';
import {sampleHEarthRun8CSuccessorSurfaceMaterial as materialAt} from '../environment/h-earth.gen2514-qualified-surface-material.run8c.js';

const root=fileURLToPath(new URL('../../',import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/assets/precomputed-grass.v1.json'),'utf8'));
const ORIGINAL_SHADER='85ee835060d5106a670077a5f4352b7ad202b49b';
const INLAND_SITES=Object.freeze([{id:'inland-seam-near',x:-200,z:-728},{id:'inland-seam-far',x:-200,z:-656}]);
const MAX_GLOBAL_INSTANCES=65536,MAX_GLOBAL_BYTES=8388608,MAX_TOTAL=57671680;
const EXCLUSION_Z=-576; // Accepted signed native atlas begins at z=-572; preserve a 4m root-free collar.
const radius=24;
let specimen=null;
async function getSpecimen(){
 if(specimen)return specimen;
 specimen=(async()=>{
  // Reproduce the public browser worker's Gen2666 verified hydration path,
  // rather than invoking the legacy procedural builder that fails BARK layout.
  const packed=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'));
  assert.equal(packed.length,11736235,'PRODUCTION_PACKED_WORLD_BYTES_DRIFT');
  assert.equal(createHash('sha256').update(packed).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a','PRODUCTION_WORLD_SHA256_DRIFT');
  const unpacked=gunzipSync(packed);
  assert.equal(unpacked.byteLength,51163475,'PRODUCTION_WORLD_UNPACKED_BYTES_DRIFT');
  const verified=JSON.parse(unpacked.toString('utf8'));
  assert.equal(verified.raw?.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_0C47F685');
  assert.equal(verified.canonical?.packageIdentity,'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_2F3D0EB2');
  assert.equal(verified.raw?.revision,1);
  assert.equal(verified.canonical?.revision,2);
  const pkg=applyHEarthVerifiedPlantingPackage(verified.raw);
  const actualSurface=buildVegetationVisibleSurface(pkg);
  // Pre-implementation gate verifies all existing global generator geometry,
  // material, rendered-water, root-height, structural and source exclusions.
  // The strict route-level planned-water admission is checked again by WebGL2.
  const visibleSurface=Object.freeze({...actualSurface,admitGround:(x,z,support)=>{
   if(!support||!Number.isFinite(support.y)||!Number.isFinite(support.slope))return false;
   const water=actualSurface.water.sample(x,z);
   return !water||support.y>water.y+.03;
  }});
  const cover=await buildHEarthGlobalGroundCover(pkg,{visibleSurface,
   placementExclusion:(x,z)=>z>=EXCLUSION_Z,
   baselineExclusion:()=>false,order:'CAMERA_FIRST',priorityOrigin:{x:-200,z:-728},
   onProgress:()=>{}});
  const metrics=INLAND_SITES.map(site=>{
   let count24=0,count48=0,minimumDistance=Infinity;
   for(let i=0;i<cover.records.length;i+=20){
    const dx=cover.records[i+12]-site.x,dz=cover.records[i+13]-site.z,d=Math.hypot(dx,dz);
    minimumDistance=Math.min(minimumDistance,d);
    if(d<=radius)count24++;
    if(d<=48)count48++;
   }
   const selected=selectHEarthGlobalGroundCoverDraws(cover,{x:site.x,y:20,z:site.z});
   return {...site,count24,count48,minimumDistance,selectedInstances:selected.visibleInstanceCount,drawCalls:selected.draws.length};
  });
  const receipt={schema:'H_EARTH_GEN3164_INLAND_NATIVE_COVERAGE_PREFLIGHT_v1',
   source:'EXISTING_GLOBAL_GROUND_COVER_GENERATOR_UNMODIFIED',
   qualifier:'INTRINSIC_RENDERED_SUPPORT_MATERIAL_WATER_AND_SOURCE_PROTECTIONS; ROUTE_PLANNED_WATER_REQUIRES_GPU_CONFIRMATION',
   sites:metrics,globalStored:cover.receipt.instanceCount,globalGpuBytes:cover.receipt.totalGpuBytes,
   nativeAcceptedRoots:manifest.rootCount,authenticatedMinTileZ:Math.min(...manifest.tiles.map(t=>t.minZ)),
   suppressionZ:EXCLUSION_Z,originalRendererBlob:ORIGINAL_SHADER,
   globalBounds:H_EARTH_GLOBAL_GROUND_COVER.bounds,
   globalMaxInstances:MAX_GLOBAL_INSTANCES,globalMaxGpuBytes:MAX_GLOBAL_BYTES,combinedMaxGpuBytes:MAX_TOTAL,
   actualPositionChecks:true,sourceWorldPopulationCameraIndependent:true};
  if(process.env.RUNNER_TEMP)fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'h-earth-combined-native-coverage-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  console.log('GEN3164_NATIVE_SITE_CENSUS='+JSON.stringify(receipt));
  return{cover,receipt,pkg,visibleSurface};
 })();
 return specimen;
}
test('signed 2.86m-root atlas remains untouched with strict world-space partition',()=>{
 assert.equal(manifest.schema,'H_EARTH_PRECOMPUTED_GRASS_v1');
 assert.equal(manifest.rootCount,2858738);
 assert.equal(Math.min(...manifest.tiles.map(t=>t.minZ)),-572);
 assert.ok(EXCLUSION_Z<=-576);
 assert.equal(H_EARTH_GLOBAL_GROUND_COVER.bounds.minZ,-736);
 assert.equal(H_EARTH_GLOBAL_GROUND_COVER.maximumInstances,MAX_GLOBAL_INSTANCES);
});
test('PRE-MUTATION: existing global source produces accepted physical foliage within 24m of both frozen inland observers',async()=>{
 const {receipt}=await getSpecimen();
 for(const p of receipt.sites){
  assert.ok(p.count24>=8,'EXACT_INLAND_GLOBAL_SITE_NO_PRACTICAL_COVERAGE:'+p.id+':'+p.count24);
  assert.ok(p.selectedInstances>=p.count24,'NO_VISIBILITY_SELECTION:'+p.id);
 }
});
test('existing placement respects environment, no overlap with accepted signed population, bounded GPU records',async()=>{
 const {cover,receipt}=await getSpecimen();
 assert.ok(cover.records.length>0);
 for(let i=0;i<cover.records.length;i+=20){
  assert.ok(cover.records[i+13]<EXCLUSION_Z,'SIGNED_NATIVE_ATLAS_COLLISION');
  for(let j=0;j<20;j++)assert.ok(Number.isFinite(cover.records[i+j]),'NONFINITE_COVER_RECORD');
 }
 assert.ok(receipt.globalStored<=MAX_GLOBAL_INSTANCES);
 assert.ok(receipt.globalGpuBytes<=MAX_GLOBAL_BYTES);
 assert.ok(manifest.rootCount*16+receipt.globalGpuBytes<MAX_TOTAL,'COMBINED_VEGETATION_GPU_BUDGET');
});
test('same population and near/mid selection are camera stable under repeated selections',async()=>{
 const {cover}=await getSpecimen();
 for(const site of INLAND_SITES){
  const c={x:site.x,y:20,z:site.z},a=selectHEarthGlobalGroundCoverDraws(cover,c),b=selectHEarthGlobalGroundCoverDraws(cover,c);
  assert.deepEqual(a,b,'CAMERA_SELECTION_UNSTABLE');
  assert.ok(a.visibleInstanceCount<=4096&&a.draws.length<=64,'EXISTING_LOD_BUDGET');
 }
});


test('Gen3164 renderer actually prepares and draws BOTH existing populations under one shared resource contract',()=>{
 const renderer=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 for(const signature of [
  "if(vegetationStrategy&&!deferVegetation)throw Error('PROTOTYPE_REQUIRES_DEFERRED_BASE')",
  "resources.singleOwnerVegetation=await createSingleOwnerVegetation",
  "const cover=await buildHEarthGlobalGroundCover(pilotPackage",
  "visibleSurface:resources.vegetationVisibleSurface",
  "placementExclusion:(x,z)=>z>=COMBINED_INLAND_GRASS.supplementalNorthernLimitZ",
  "await uploadGlobalCover(cover);",
  "const nativeOwnerDraw=resources.singleOwnerVegetation?.draw(packet);",
  "drawGlobalCover(packet,nativeOwnerDraw);",
  "nativeOwnerDraw.submittedTriangles+partition.triangles>COMBINED_INLAND_GRASS.maximumFrameTriangles",
  "combinedInlandVegetation:combinedInlandVegetationReceipt?",
  "maximumGpuBytes:55*1024*1024",
  "maximumDrawCalls:2048",
  "maximumFrameTriangles:24000000",
  "nativeOwner.originalRootCount!==2858738",
  "globalHabitatAndRouteAdmissionReused:true",
  "palette=mix(palette,groundcoverTone,groundcoverWeight);"
 ])assert.ok(renderer.includes(signature),'GEN3164_RENDER_SOURCE_MISSING:'+signature);
 assert.ok(!renderer.includes('groundcoverMeadowMosaic')&&!renderer.includes('groundcoverSoilBridge'),'COLOR_ONLY_EXPERIMENT_NOT_ALLOWED');
 assert.equal(renderer.split("drawGlobalCover(packet,nativeOwnerDraw);").length,2,'EXACT_ONE_COMBINED_DRAW');
 assert.equal(renderer.split("await uploadGlobalCover(cover);").length,3,'ONE_EXISTING_LEGACY_AND_ONE_NEW_SUPPLEMENTAL_UPLOAD');
});

test('Gen3167 southern pilot: append only real native-admitted roots beyond original z boundary',async()=>{
 const {cover:original,pkg,visibleSurface}=await getSpecimen();
 const options={
  visibleSurface,placementExclusion:(x,z)=>z>=EXCLUSION_Z,
  baselineExclusion:()=>false,order:'CAMERA_FIRST',priorityOrigin:{x:-200,z:-728},
  onProgress:()=>{},southernPilotEnabled:true
 };
 const expanded=await buildHEarthGlobalGroundCover(pkg,options);
 const again=await buildHEarthGlobalGroundCover(pkg,options);
 const originalN=original.receipt.instanceCount,newN=expanded.receipt.instanceCount-originalN;
 assert.ok(newN>0,'SOUTHERN_PILOT_NO_ELIGIBLE_ADDITIONAL_GRASS');
 assert.equal(expanded.receipt.southernPilot.enabled,true);
 assert.equal(expanded.receipt.southernPilot.addedRecords,newN);
 assert.equal(expanded.receipt.southernPilot.originalRecords,originalN);
 assert.equal(original.receipt.southernPilot?.enabled,false,'BASELINE_OPT_IN_NOT_DISABLED');
 assert.deepEqual(expanded.records.subarray(0,original.records.length),original.records,'SOUTHERN_PILOT_ORIGINAL_FLOAT32_RECORDS_CHANGED');
 assert.deepEqual(expanded.recordIds.slice(0,originalN),original.recordIds,'SOUTHERN_PILOT_ORIGINAL_IDS_CHANGED');
 assert.deepEqual(expanded.admittedRecords.subarray(0,originalN),original.admittedRecords,'SOUTHERN_PILOT_ORIGINAL_ADMISSION_CHANGED');
 assert.deepEqual(expanded.records,again.records,'SOUTHERN_PILOT_POPULATION_NOT_DETERMINISTIC');
 assert.deepEqual(expanded.recordIds,again.recordIds,'SOUTHERN_PILOT_IDS_NOT_DETERMINISTIC');
 assert.deepEqual(expanded.admittedRecords,again.admittedRecords,'SOUTHERN_PILOT_ADMISSION_NOT_DETERMINISTIC');
 assert.equal(manifest.rootCount,2858738);
 assert.equal(Math.min(...manifest.tiles.map(t=>t.minZ)),-572);
 assert.ok(expanded.receipt.instanceCount<=MAX_GLOBAL_INSTANCES);
 assert.ok(expanded.receipt.totalGpuBytes<=MAX_GLOBAL_BYTES);
 assert.ok(manifest.rootCount*16+expanded.receipt.totalGpuBytes<MAX_TOTAL);
 const bounds=H_EARTH_GLOBAL_GROUND_COVER_SOUTHERN_PILOT;
 let verifiedRootContacts=0,minimumZ=Infinity,maximumZ=-Infinity,smallestWaterClearance=Infinity;
 const obstacles=pkg.landscapeCoverFootprints??[];
 const f32=v=>Math.fround(v);
 const inside=(x,z)=>x>=bounds.minX&&x<=bounds.maxX&&z>=bounds.minZ&&z<bounds.maxZ;
 for(let i=originalN;i<expanded.receipt.instanceCount;i++){
  const rec=expanded.records.subarray(i*20,i*20+20);
  const [x,z,angle,width]=[rec[12],rec[13],rec[14],rec[15]];
  const id=expanded.recordIds[i];
  assert.ok(inside(x,z),'SOUTHERN_PILOT_RECORD_OUTSIDE_BOUNDARY:'+id);
  assert.ok(z< -736,'SOUTHERN_PILOT_NOT_SOUTH_OF_OLD_BOUNDARY:'+id);
  assert.equal(expanded.admittedRecords[i],1,'SOUTHERN_PILOT_RECORD_NOT_ADMITTED:'+id);
  assert.ok(!id.endsWith(':BUSH'),'SOUTHERN_PILOT_SECONDARY_POPULATION_UNAUTHORIZED');
  assert.ok(!id.startsWith('ECO:'),'SOUTHERN_PILOT_ECOLOGY_POPULATION_UNAUTHORIZED');
  minimumZ=Math.min(minimumZ,z);maximumZ=Math.max(maximumZ,z);
  for(let root=0;root<12;root++){
   const p=transformHEarthGroundCoverRoot(expanded.template,root,x,z,angle,width);
   assert.ok(inside(p.x,p.z),'SOUTHERN_PILOT_ROOT_OUTSIDE_BOUNDARY:'+id+':'+root);
   assert.ok(p.z<EXCLUSION_Z,'SOUTHERN_PILOT_WOODLAND_ATLAS_OVERLAP:'+id+':'+root);
   const support=visibleSurface.sample(p.x,p.z);
   assert.ok(support&&Number.isFinite(support.y)&&Number.isFinite(support.slope),'SOUTHERN_PILOT_ROOT_UNSUPPORTED:'+id+':'+root);
   assert.equal(f32(support.y),rec[root],'SOUTHERN_PILOT_ROOT_NOT_GROUNDED:'+id+':'+root);
   const water=visibleSurface.water.sample(p.x,p.z);
   if(water){
    assert.ok(support.y>water.y+.03,'SOUTHERN_PILOT_ROOT_UNDER_RENDERED_WATER:'+id+':'+root);
    smallestWaterClearance=Math.min(smallestWaterClearance,support.y-water.y);
   }
   const authored=inverseHEarthGroundCoverPoint(p.x,support.y,p.z),m=materialAt(authored.x,authored.z);
   const permitted=m?.valid===true&&support.slope<=.35&&(
    m.surfaceClass==='STONE_AND_SPARSE_SOIL'?m.soilDepth>=.035:
    ['LOWLAND_SOIL','COASTAL_SOIL'].includes(m.surfaceClass)&&m.soilDepth>=.20);
   assert.ok(permitted,'SOUTHERN_PILOT_ROOT_MATERIAL_INELIGIBLE:'+id+':'+root);
   assert.ok(obstacles.every(t=>Math.hypot(p.x-t.x,p.z-t.z)>=t.radius),'SOUTHERN_PILOT_ROOT_PROTECTED_OBSTACLE:'+id+':'+root);
   verifiedRootContacts++;
  }
 }
 const sourceHash=bytes=>createHash('sha256').update(bytes).digest('hex');
 const oldRecordHash=sourceHash(Buffer.from(original.records.buffer,original.records.byteOffset,original.records.byteLength));
 const preservedPrefixHash=sourceHash(Buffer.from(expanded.records.buffer,expanded.records.byteOffset,original.records.byteLength));
 assert.equal(oldRecordHash,preservedPrefixHash);
 const receipt={
  schema:'H_EARTH_SOUTHERN_GROUNDCOVER_PILOT_NATIVE_RECEIPT_v1',result:'SOUTHERN_PILOT_NATIVE_PASS',
  experimental:true,productBaseline:'d0e030b2026b76c04e4ed753257559e369cd3f28',
  sourceGenerator:'showroom/globe/h-earth/render/landscape-groundcover.global-v1.js',
  sourceFixture:'h-earth-3d/validation/h-earth.combined-inland-vegetation-20261107.test.mjs',
  canonicalWorldSha256:'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a',
  bounds,originalLatticeOrigin:{x:-384,z:-736},originalSeed:H_EARTH_GLOBAL_GROUND_COVER.seed,
  baselineRecordCount:originalN,newRecordCount:newN,combinedRecordCount:expanded.receipt.instanceCount,
  originalRecordSha256:oldRecordHash,preservedPrefixSha256:preservedPrefixHash,
  oldIdsAndAdmissionsIdentical:true,deterministicTwice:true,
  newRootContactsVerified:verifiedRootContacts,southernMinZ:minimumZ,southernMaxZ:maximumZ,
  minimumRenderedWaterClearance:Number.isFinite(smallestWaterClearance)?smallestWaterClearance:null,
  signedWoodlandRootCount:manifest.rootCount,signedWoodlandMinZ:-572,noSignedWoodlandOverlap:true,
  globalGpuBytes:expanded.receipt.totalGpuBytes,globalGpuByteCap:MAX_GLOBAL_BYTES,
  combinedGpuBytes:manifest.rootCount*16+expanded.receipt.totalGpuBytes,combinedGpuByteCap:MAX_TOTAL,
  globalInstanceCap:MAX_GLOBAL_INSTANCES,noRuntimeRefinementOrGeologyClaim:true,
  noRendererChanges:true,liveGpuExecuted:false,mergeOrDeployment:false
 };
 if(process.env.RUNNER_TEMP)fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'h-earth-southern-pilot-native-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log('H_EARTH_SOUTHERN_PILOT_NATIVE='+JSON.stringify(receipt));
});


test('Gen3176 systemic grass: preserve 17,637 originals and increase actual selected southern cover',async()=>{
 const {pkg,visibleSurface}=await getSpecimen();
 const opts={
  visibleSurface,placementExclusion:(x,z)=>z>=EXCLUSION_Z,
  baselineExclusion:()=>false,order:'CAMERA_FIRST',
  priorityOrigin:{x:-200,z:-728},onProgress:()=>{},southernPilotEnabled:true
 };
 const baseline=await buildHEarthGlobalGroundCover(pkg,opts);
 const candidate=await buildHEarthGlobalGroundCover(pkg,{...opts,systemicExpansionEnabled:true});
 const again=await buildHEarthGlobalGroundCover(pkg,{...opts,systemicExpansionEnabled:true});
 const oldN=baseline.receipt.instanceCount,added=candidate.receipt.instanceCount-oldN;
 assert.equal(oldN,17637,'GEN3172_EXACT_17637_RECORD_COUNT_CHANGED');
 assert.equal(baseline.receipt.southernPilot.addedRecords,205,'GEN3172_EXACT_SOUTHERN_205_CHANGED');
 assert.equal(candidate.receipt.southernPilot.addedRecords,205,'GEN3172_SOUTHERN_PILOT_NOT_PRESERVED');
 assert.equal(candidate.receipt.systemicExpansion.enabled,true,'SYSTEMIC_OPT_IN_NOT_RECORDED');
 assert.equal(candidate.receipt.systemicExpansion.originalRecordCount,oldN,'SYSTEMIC_ORIGINAL_COUNT_MISMATCH');
 assert.equal(candidate.receipt.systemicExpansion.addedRecords,added,'SYSTEMIC_EXTRA_COUNT_MISMATCH');
 assert.ok(added>=1000,'INSUFFICIENT_SYSTEMIC_GEOMETRY_ADDED:'+added);
 assert.deepEqual(candidate.records.subarray(0,baseline.records.length),baseline.records,'GEN3172_ORIGINAL_FLOAT32_PREFIX_CHANGED');
 assert.deepEqual(candidate.recordIds.slice(0,oldN),baseline.recordIds,'GEN3172_ORIGINAL_GRASS_IDS_CHANGED');
 assert.deepEqual(candidate.admittedRecords.subarray(0,oldN),baseline.admittedRecords,'GEN3172_ORIGINAL_ADMISSIONS_CHANGED');
 assert.deepEqual(candidate.records,again.records,'SYSTEMIC_POPULATION_NOT_DETERMINISTIC');
 assert.deepEqual(candidate.recordIds,again.recordIds,'SYSTEMIC_IDS_NOT_DETERMINISTIC');
 assert.deepEqual(candidate.admittedRecords,again.admittedRecords,'SYSTEMIC_ADMISSION_NOT_DETERMINISTIC');
 assert.ok(candidate.receipt.instanceCount<=MAX_GLOBAL_INSTANCES,'SYSTEMIC_MAX_GLOBAL_INSTANCES_EXCEEDED');
 assert.ok(candidate.receipt.totalGpuBytes<=MAX_GLOBAL_BYTES,'SYSTEMIC_MAX_GLOBAL_GPU_BYTES_EXCEEDED');
 assert.ok(manifest.rootCount*16+candidate.receipt.totalGpuBytes<MAX_TOTAL,'SYSTEMIC_COMBINED_GPU_BYTES_EXCEEDED');
 assert.equal(manifest.rootCount,2858738);
 const obstacles=pkg.landscapeCoverFootprints??[];
 const insidePilot=(x,z)=>x>=-224&&x<=-160&&z>=-768&&z< -736;
 let contacts=0,minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity;
 const sampledTiles=new Set(),sampledSourceClasses=new Set();
 for(let i=oldN;i<candidate.receipt.instanceCount;i++){
  const record=candidate.records.subarray(i*20,i*20+20),id=candidate.recordIds[i];
  assert.ok(id.startsWith('SYSTEMIC:'),'SYSTEMIC_UNEXPECTED_GENERATOR:'+id);
  assert.equal(candidate.admittedRecords[i],1,'SYSTEMIC_NOT_PRESENTATION_ADMITTED:'+id);
  const [x,z,angle,width]=[record[12],record[13],record[14],record[15]];
  assert.ok(z<EXCLUSION_Z,'SYSTEMIC_WOODLAND_JURISDICTION_COLLISION:'+id);
  minX=Math.min(minX,x);maxX=Math.max(maxX,x);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);
  const parsed=id.split(':'),tx=Number(parsed[1]),tz=Number(parsed[2]);
  sampledTiles.add(tx+':'+tz);
  for(let root=0;root<12;root++){
   const p=transformHEarthGroundCoverRoot(candidate.template,root,x,z,angle,width);
   assert.ok(p.z<EXCLUSION_Z,'SYSTEMIC_ROOT_WOODLAND_OVERLAP:'+id+':'+root);
   if(tz===-1)assert.ok(insidePilot(p.x,p.z),'SYSTEMIC_PILOT_ROOT_OUTSIDE_EXISTING_PILOT:'+id+':'+root);
   const support=visibleSurface.sample(p.x,p.z);
   assert.ok(support&&Number.isFinite(support.y),'SYSTEMIC_ROOT_UNSUPPORTED:'+id+':'+root);
   assert.equal(Math.fround(support.y),record[root],'SYSTEMIC_ROOT_HEIGHT_NOT_NATIVE_GROUNDED:'+id+':'+root);
   const water=visibleSurface.water.sample(p.x,p.z);
   if(water)assert.ok(support.y>water.y+.03,'SYSTEMIC_ROOT_WATER_OVERLAP:'+id+':'+root);
   const a=inverseHEarthGroundCoverPoint(p.x,support.y,p.z),material=materialAt(a.x,a.z);
   const permitted=material?.valid===true&&support.slope<=.35&&(
    material.surfaceClass==='STONE_AND_SPARSE_SOIL'?material.soilDepth>=.035:
    ['LOWLAND_SOIL','COASTAL_SOIL'].includes(material.surfaceClass)&&material.soilDepth>=.20);
   assert.ok(permitted,'SYSTEMIC_ROOT_MATERIAL_EXCLUDED:'+id+':'+root);
   assert.ok(obstacles.every(t=>Math.hypot(p.x-t.x,p.z-t.z)>=t.radius),'SYSTEMIC_ROOT_PROTECTED_OBSTACLE:'+id+':'+root);
   sampledSourceClasses.add(material.surfaceClass);
   contacts++;
  }
 }
 assert.equal(contacts,added*12,'SYSTEMIC_ROOT_CONTACT_COUNT');
 assert.ok(sampledTiles.size>=12,'SYSTEMIC_DISTRIBUTION_TOO_LOCAL:'+sampledTiles.size);
 const sites=INLAND_SITES.map(site=>{
  const observer={x:site.x,y:20,z:site.z};
  const prior=selectHEarthGlobalGroundCoverDraws(baseline,observer);
  const next=selectHEarthGlobalGroundCoverDraws(candidate,observer);
  let original24=0,candidate24=0;
  for(let i=0;i<baseline.records.length;i+=20)if(Math.hypot(baseline.records[i+12]-site.x,baseline.records[i+13]-site.z)<=24)original24++;
  for(let i=0;i<candidate.records.length;i+=20)if(Math.hypot(candidate.records[i+12]-site.x,candidate.records[i+13]-site.z)<=24)candidate24++;
  assert.ok(candidate24>=original24+12,'SYSTEMIC_DENSITY_NOT_INCREASED_NEAR_SITE:'+site.id+':'+original24+':'+candidate24);
  assert.ok(next.visibleInstanceCount>=prior.visibleInstanceCount+64,'SYSTEMIC_SELECTION_NOT_VISIBLE:'+site.id+':'+prior.visibleInstanceCount+':'+next.visibleInstanceCount);
  assert.ok(next.visibleInstanceCount<=4096&&next.draws.length<=64,'SYSTEMIC_FRAME_VISIBILITY_LIMIT');
  return {...site,oldPhysicalWithin24m:original24,newPhysicalWithin24m:candidate24,
   oldSelected:prior.visibleInstanceCount,newSelected:next.visibleInstanceCount,
   oldDraws:prior.draws.length,newDraws:next.draws.length};
 });
 const oldHash=createHash('sha256').update(Buffer.from(baseline.records.buffer,baseline.records.byteOffset,baseline.records.byteLength)).digest('hex');
 const prefixHash=createHash('sha256').update(Buffer.from(candidate.records.buffer,candidate.records.byteOffset,baseline.records.byteLength)).digest('hex');
 assert.equal(oldHash,prefixHash,'GEN3172_ORIGINAL_RECORD_BYTES_HASH_CHANGED');
 const renderer=fs.readFileSync(path.join(root,'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js'),'utf8');
 assert.ok(renderer.includes('systemicExpansionEnabled: true'),'RENDERER_SYSTEMIC_OPT_IN_MISSING');
 assert.ok(renderer.includes('palette=mix(palette,groundcoverTone,groundcoverWeight);'),'MATERIAL_SHADER_NOT_GEN3172_BASELINE');
 const receipt={schema:'H_EARTH_GEN3176_SYSTEMIC_GRASS_NATIVE_RECEIPT_v1',
  result:'SYSTEMIC_GRASS_NATIVE_PASS',sourceParent:'fd2c38ccc78bdb90c99a9d03d7cd14dea21bb28b',
  oldRecords:oldN,newRecords:added,combinedRecords:candidate.receipt.instanceCount,
  oldRecordHash:oldHash,preservedPrefixHash:prefixHash,originalGrassRecordsPreserved:true,
  originalWoodlandRoots:manifest.rootCount,originalSouthernPilotRecords:205,
  addedGrassRootContactsVerified:contacts,systemicTileCount:sampledTiles.size,
  bounds:{minX,maxX,minZ,maxZ},surfaceClasses:[...sampledSourceClasses].sort(),
  sites,globalGpuBytes:candidate.receipt.totalGpuBytes,globalGpuLimit:MAX_GLOBAL_BYTES,
  combinedBudgetEstimate:manifest.rootCount*16+candidate.receipt.totalGpuBytes,combinedLimit:MAX_TOTAL,
  nativeDeterminismTwice:true,originalMaterialShaderUnchanged:true,
  ownerAndroidPhotoCameraReproduced:false,browserGpuExecuted:false,releaseAuthorized:false};
 if(process.env.RUNNER_TEMP)fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'h-earth-gen3176-systemic-native-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log('H_EARTH_GEN3176_SYSTEMIC_GRASS_NATIVE='+JSON.stringify(receipt));
});
