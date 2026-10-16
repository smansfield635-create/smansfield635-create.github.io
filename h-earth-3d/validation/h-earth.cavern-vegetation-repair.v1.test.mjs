import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';

const rendererURL=new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const navigationURL=new URL('../../showroom/globe/h-earth/functional-landscape/navigation.js',import.meta.url);
const packageURL=new URL('../../showroom/globe/h-earth/render/live-render-package.run8e-r2.js',import.meta.url);
function dependencyURL(parent,file){
  const source=readFileSync(parent,'utf8');
  const matches=[...source.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)].filter(match=>match[1].split('?')[0].endsWith(file));
  assert.equal(matches.length,1,`Expected one production import of ${file}`);
  return new URL(matches[0][1],parent);
}
let cachedCanonical;
function canonical(){
  if(!cachedCanonical){
    const bytes=readFileSync(process.env.H_EARTH_EXACT_WORLD_BINARY||new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
    cachedCanonical=JSON.parse(gunzipSync(bytes)).canonical;
  }
  return cachedCanonical;
}

test('renderer-installed production bridge actually supports navigation through the cavern',async()=>{
  // Resolve the real renderer edge, including its query string. Installing a
  // separately hardcoded bare bridge is precisely the former false-positive.
  const rendererBridge=await import(dependencyURL(rendererURL,'geological-runtime-bridge.v1.js'));
  const navigationBridge=await import(dependencyURL(navigationURL,'geological-runtime-bridge.v1.js'));
  const navigation=await import(navigationURL);
  const model=rendererBridge.constructGeologicalRuntimeBridge(canonical());
  rendererBridge.installGeologicalRuntimeBridge(model);
  assert.equal(navigationBridge.getGeologicalRuntimeBridge(),model,'Renderer installation did not reach the navigation module instance');
  let state=navigation.createHEarthFunctionalLandscapeNavigationState({waypointId:'GEOLOGICAL_CAVERN_REAR_APPROACH'}).state;
  let interiorSteps=0;
  for(let step=0;step<6;step++){
    const proposal=navigation.proposeHEarthFunctionalLandscapeNavigation(state,{action:'MOVE_FORWARD',magnitude:Math.min(4,-240-state.position.z)});
    assert.equal(proposal.ok,true,`Cavern approach rejected at step ${step}: ${JSON.stringify(proposal.issues)}`);
    state=proposal.state;
    assert.equal(state.geologicalPhysicalSupport,true,`Geological support missing at step ${step}`);
    assert(Math.abs(state.clearance-2.25)<1e-6,'Camera floated above its physical support');
    if(state.geologicalFloorClass==='INTERIOR'){
      interiorSteps++;
      assert(state.position.y<state.geologicalCeilingY,'Camera crossed the cavern roof');
    }
  }
  assert(interiorSteps>=5,'Walk did not continue inside the cavern');
  assert.equal(state.position.z,-240);
  assert.equal(state.geologicalFloorClass,'INTERIOR');
  assert(Math.abs(state.position.y-13.999558697658308)<1e-5);
});

test('asymmetric renderer clip grounds every collar on refinement rather than obsolete base',async()=>{
  const {buildHEarthGlobalGroundCover}=await import(dependencyURL(rendererURL,'landscape-groundcover.global-v1.js'));
  const positions=y=>new Float32Array([40,y,-330,80,y,-330,40,y,-290,80,y,-290]);
  const indices=new Uint32Array([0,2,1,1,2,3]);
  const pkg={buffers:{positions:positions(10),indices},primitiveSpans:[{role:'TERRAIN',primitiveId:'REFINEMENT_REGRESSION',indexStart:0,indexCount:6}],landscapeCoverFootprints:[]};
  // The renderer contract is minX,minZ,maxX,maxZ. Asymmetry ensures a copied
  // minX,maxX,minZ,maxZ predicate cannot accidentally pass this fixture.
  const refinement={positions:positions(2),indices,clip:[40,-330,80,-290]};
  const cover=await buildHEarthGlobalGroundCover(pkg,{refinement,compositionEnabled:false});
  assert(cover.records.length>0,'Fixture selected no roots');
  for(let offset=0;offset<cover.records.length;offset+=20)
    for(let collar=0;collar<12;collar++)assert.equal(cover.records[offset+collar],2,`Root ${offset/20}:${collar} used retired base height`);
});

test('all 108 late batch compositions retire old fan geometry and preserve other plants',async()=>{
  // Follow the same dependency URLs and composition order as BOTH production
  // batch constructors; their versioned lowland edge must not hide a split.
  const {applyHEarthLowlandGrassTrialBatch}=await import(dependencyURL(packageURL,'grass-lowland-trial.js'));
  const {applyHEarthLandscapeCoverBatch}=await import(dependencyURL(packageURL,'geometry-landscape-cover.js'));
  const source=readFileSync(packageURL,'utf8');
  for(const name of ['createHEarthRun8ER2VegetationPresentationBatch','createHEarthRun8ER2VegetationPresentationBatchAsync']){
    const start=source.indexOf(`function ${name}(`);
    assert(start>=0,`Production constructor missing: ${name}`);
    const end=source.indexOf('\n',start);
    assert(source.slice(start,end<0?undefined:end).includes('applyHEarthLandscapeCoverBatch(applyHEarthLowlandGrassTrialBatch('),`${name} no longer uses tested batch composition`);
  }
  const sentinel=Object.freeze({primitiveId:'PRESERVED_OTHER_PLANT',materialHint:{archetypeId:'COASTAL_SHRUB'},metadata:{worldAnchor:{x:0,y:0,z:0}}});
  const oldGrass={primitiveId:'RETIRED_OLD_GRASS',materialHint:{archetypeId:'COASTAL_GRASS_TUFT'},metadata:{worldAnchor:{x:100,y:0,z:-400}}};
  let survivingFans=0;
  for(let index=0;index<108;index++){
    const batch={batchId:`REGRESSION_BATCH_${index}`,primitives:[sentinel,oldGrass],instanceCount:2};
    const presented=applyHEarthLandscapeCoverBatch(applyHEarthLowlandGrassTrialBatch(batch,canonical()),canonical(),index);
    assert(presented.primitives.includes(sentinel),`Non-grass plant lost in batch ${index}`);
    assert(!presented.primitives.some(primitive=>primitive.primitiveId===oldGrass.primitiveId),`Old canonical grass survived in batch ${index}`);
    survivingFans+=presented.primitives.filter(primitive=>primitive.metadata?.landscapeIdentity?.sourceRecipe==='ACCEPTED_WOODLAND_FOUR_BLADE_FAN').length;
  }
  assert.equal(survivingFans,0,'Deferred batches re-added retired broad four-blade fans after filtering');
});

test('visible root surface respects retired ground, exterior overlap, water and shell exclusions',async()=>{
  const {buildVegetationVisibleSurface}=await import('../../showroom/globe/h-earth/render/vegetation-visible-surface.v1.js');
  const mesh=(y,x=40,z=-330)=>({positions:new Float32Array([x,y,z,x+40,y,z,x,y,z+40,x+40,y,z+40]),indices:new Uint32Array([0,2,1,1,2,3])});
  const base=mesh(10),pkg={buffers:base,primitiveSpans:[{role:'TERRAIN',primitiveId:'OBSOLETE_BASE',indexStart:0,indexCount:6}]};
  const retirement={triangleOffsets:new Uint32Array([0,3])};
  const geology={retirement,meshes:[
    {role:'ERODED_TERRAIN',mesh:mesh(2)},
    {role:'MOUNTAIN_OVERBURDEN',mesh:mesh(3)},
    {role:'CAVERN_PHYSICAL_SHELL',mesh:mesh(20)},
    {role:'NATURAL_CLIFF_FACE',mesh:mesh(25)},
    {role:'FRESHWATER_RIVER',mesh:mesh(4)},
    {role:'OASIS_WATER',mesh:mesh(5)}
  ]};
  const surface=buildVegetationVisibleSurface(pkg,{geology,waterPresentationEnabled:true});
  assert.equal(surface.ground.sample(50,-320).y,3,'Retired base or shell incorrectly became outdoor root support');
  assert.equal(surface.ground.sample(50,-320).owner,'MOUNTAIN_OVERBURDEN');
  assert.equal(surface.water.sample(50,-320).y,5,'New geological water footprint was omitted');
  const missing=buildVegetationVisibleSurface(pkg,{geology:{retirement,meshes:[{role:'CAVERN_PHYSICAL_SHELL',mesh:mesh(20)}]}});
  assert.equal(missing.ground.sample(50,-320),null,'Absent exterior support resurrected retired base or underground shell');
  const degenerate={positions:mesh(2).positions,indices:new Uint32Array([0,0,0]),clip:[40,-330,80,-290]};
  const clipped=buildVegetationVisibleSurface(pkg,{refinement:degenerate});
  assert.equal(clipped.ground.sample(50,-320),null,'Degenerate refinement fell back to hidden base');
  // Outside the refinement clip, ordinary visible terrain remains untouched.
  const partial={...mesh(2,55,-325),clip:[55,-325,95,-285]};
  assert.equal(buildVegetationVisibleSurface(pkg,{refinement:partial}).ground.sample(45,-320).y,10);
});

test('nearby fine grass keeps grounded unique roots byte-identical after an A-B-A walk',async()=>{
  const {createNearbyFineGrassCache}=await import(dependencyURL(rendererURL,'woodland-fine-grass.v1.js'));
  const {buildVegetationVisibleSurface}=await import('../../showroom/globe/h-earth/render/vegetation-visible-surface.v1.js');
  const quad=(x0,z0,x1,z1,y)=>({positions:new Float32Array([x0,y,z0,x1,y,z0,x0,y,z1,x1,y,z1]),indices:new Uint32Array([0,2,1,1,2,3])});
  const ground=quad(54,-322,78,-298,2),water=quad(60,-320,72,-300,3);
  const pkg={buffers:ground,primitiveSpans:[{role:'TERRAIN',primitiveId:'NEARBY_VISIBLE_GROUND',indexStart:0,indexCount:6}],landscapeCoverFootprints:[],landscapeFloorFootprints:[]};
  const visibleSurface=buildVegetationVisibleSurface(pkg,{waterPresentationEnabled:true,geology:{meshes:[{role:'FRESHWATER_RIVER',mesh:water}]}});
  const cache=createNearbyFineGrassCache(pkg,{visibleSurface});
  const rootsOf=p=>p.tiles.flatMap(tile=>tile.roots);
  const bytesOf=roots=>{
    const bytes=Buffer.alloc(roots.length*20);
    roots.forEach((root,i)=>{for(const [k,value] of [root.x,root.y,root.z,root.angle].entries())bytes.writeFloatLE(value,i*20+k*4);bytes.writeUInt32LE(root.seed,i*20+16);});
    return bytes;
  };
  const first=await cache.update({x:60,z:-310}),roots=rootsOf(first);
  assert(roots.length>1000,'Nearby fixture did not exercise meaningful coverage');
  assert.equal(new Set(roots.map(root=>`${root.x}:${root.z}`)).size,roots.length,'Tile apron duplicated a root');
  for(const root of roots){
    assert.equal(root.y,2,'Nearby root floated above its actual visible triangle');
    assert(!(root.x>=60&&root.x<=72&&root.z>=-320&&root.z<=-300),'Nearby root was accepted over the actual river mesh');
  }
  // A distant visit evicts A, so the return tests deterministic regeneration,
  // rather than merely retrieving the same object from a last-camera cache.
  await cache.update({x:240,z:-250});
  const returned=await cache.update({x:60,z:-310});
  assert(returned.receipt.builtTiles>0,'A-B-A did not exercise tile regeneration');
  assert.deepEqual(bytesOf(rootsOf(returned)),bytesOf(roots));
  assert(returned.receipt.cachedRoots<=65536);
});


test('shared fine-grass selection excludes distant fixed roots while preserving nearby identities',async()=>{
  const {selectWoodlandFineGrass,prepareWoodlandSelectionCache}=await import(dependencyURL(rendererURL,'woodland-fine-grass.v1.js'));
  // seed zero belongs to the persistent underlay, formerly packed regardless of distance.
  const root={x:-141,y:2,z:-226,angle:0,seed:0};
  const presentation={tiles:[{id:'FIXED_ROOT',minX:-144,minZ:-228,roots:[root]}]};
  await prepareWoodlandSelectionCache(presentation);
  const near=selectWoodlandFineGrass(presentation,{x:-141,z:-226});
  assert.equal(near.contactCount,1,'Nearby persistent root disappeared');
  assert.equal(near.persistentContactCount,1,'Fixture did not exercise the fixed underlay');
  const far=selectWoodlandFineGrass(presentation,{x:300,z:300});
  assert.equal(far.contactCount,0,'Distant persistent root consumed nearby draw budget');
  const returned=selectWoodlandFineGrass(presentation,{x:-141,z:-226});
  assert.deepEqual(returned.pixels,near.pixels,'Distance culling changed the root on return');
});
