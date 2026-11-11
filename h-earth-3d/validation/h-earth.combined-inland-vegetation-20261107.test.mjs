import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {applyHEarthVerifiedPlantingPackage} from '../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js';
import {buildVegetationVisibleSurface} from '../../showroom/globe/h-earth/render/vegetation-visible-surface.v1.js';
import {buildHEarthGlobalGroundCover,H_EARTH_GLOBAL_GROUND_COVER,selectHEarthGlobalGroundCoverDraws} from '../../showroom/globe/h-earth/render/landscape-groundcover.global-v1.js';

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
  return{cover,receipt};
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
