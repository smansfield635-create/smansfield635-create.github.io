import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WOODLAND_HABITAT,regionalWoodlandWeight,buildWoodlandHabitatField,sampleWoodlandHabitat,planWoodlandHabitatCandidates,habitatSmooth,habitatSlopeWeight,RAVINE_HABITAT,ravineHabitatWeight} from '../../showroom/globe/h-earth/render/woodland-habitat-field.v1.js';
import {createUniformGroundAdmission} from '../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';

test('canonical source produces denser contacted ravine and identical woodland roots',async()=>{
 const {gunzipSync}=await import('node:zlib');const {readFile}=await import('node:fs/promises');
 const {createHash}=await import('node:crypto');
 const root=new URL('../../',import.meta.url),rendererUrl=new URL('showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',root);
 const renderer=readFileSync(rendererUrl,'utf8'),bytes=readFileSync(new URL('showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',root));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a');
 const payload=JSON.parse(gunzipSync(bytes)),before=createHash('sha256').update(JSON.stringify(payload.raw.buffers)).digest('hex');
 const renderBase=new URL('showroom/globe/h-earth/render/',root),bridgeSpecifier=renderer.match(/from ['"]([^'"]*geological-runtime-bridge\.v1\.js[^'"]*)['"]/)[1];
 const bridge=await import(new URL(bridgeSpecifier,rendererUrl));
 const geology=bridge.constructGeologicalRuntimeBridge(payload.canonical);
 const terrain=await import(new URL('h-earth-3d/terrain/h-earth.geological-formation-successor.v1.mjs',root));
 const placement=await import(new URL('h-earth-3d/environment/h-earth.gen2514-qualified-placement-authority.js',root));
 const materials=await import(new URL('h-earth-3d/environment/h-earth.gen2514-qualified-surface-material.run8c.js',root));
 const grass=await import(new URL('grass-lowland-trial.js',renderBase)),woodland=await import(new URL('woodland-fine-grass.v1.js',renderBase)),owner=await import(new URL('vegetation-single-owner.prototype.v1.js',renderBase));
 // Reuse the existing exact Float32 beach fixture, including canonical contact distances.
 const fixtureSource=readFileSync(new URL('h-earth-3d/validation/h-earth.planting-pilot.v1.test.mjs',root),'utf8');
 const fixtureStart=fixtureSource.indexOf('async function buildCanonicalBeachFixture('),fixtureEnd=fixtureSource.indexOf("\n\n\ntest(",fixtureStart);
 const fixture=Function('assert','readFile',fixtureSource.slice(fixtureStart,fixtureEnd)+';return buildCanonicalBeachFixture;')(assert,readFile);
 const protectedReferenceAt=()=>false;
 const {visibleSurface}=await fixture({baseDirectory:root.pathname,pkg:payload.raw,geology,uploadSource:readFileSync(new URL('gpu-upload-views.run8e-r2d.js',renderBase),'utf8'),protectedReferenceAt});
 const pilotPackage=payload.raw,admitGround=await createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:pilotPackage.landscapeCoverFootprints??[],trees:pilotPackage.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12});
 const replacement=renderer.slice(renderer.indexOf('  function prepareReplacementVegetation'));
 const fieldCode=replacement.slice(replacement.indexOf('      const habitat=await buildWoodlandHabitatField'),replacement.indexOf('      const presentation=await buildWoodlandFineGrass'));
 const field=await Function('buildWoodlandHabitatField','habitatSmooth','yieldToBrowserPaint','visibleSurface','admitGround','unprojectPlanetVertex','pilotMaterialAt','woodlandGrassClear','pilotPackage','WOODLAND_HABITAT','resources','habitatSlopeWeight',`return(async()=>{${fieldCode};return habitat;})()`)(buildWoodlandHabitatField,habitatSmooth,async()=>{},visibleSurface,admitGround,terrain.unprojectPlanetVertex,materials.sampleHEarthRun8CSuccessorSurfaceMaterial,woodland.woodlandGrassClear,pilotPackage,WOODLAND_HABITAT,{geologicalRuntime:geology},habitatSlopeWeight);
 const presentation=await woodland.buildWoodlandFineGrass(pilotPackage,{visibleSurface,admitGround,habitat:field});

const planned=planWoodlandHabitatCandidates(field);
const woodlandCandidates=planned.filter(r=>r.region!=='RAVINE');
const woodlandRoots=presentation.tiles.flatMap(t=>t.roots).filter(r=>r.region!=='RAVINE').sort((a,b)=>a.x-b.x||a.z-b.z);
const sha=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const roots=presentation.tiles.flatMap(t=>t.roots), counts={woodland:woodlandRoots.length,ravine:roots.length-woodlandRoots.length,total:roots.length,newExtension:roots.filter(r=>r.region==='RAVINE'&&r.z< -352).length};
console.log('REALIZED_CORRIDOR_CENSUS',JSON.stringify({counts,candidates:planned.length,woodlandPixels:sha(Buffer.from(field.woodland.pixels).toString('hex')),woodlandCandidates:sha(woodlandCandidates),woodlandRoots:sha(woodlandRoots),woodlandIdentity:sha(woodlandRoots.map(({x,y,z,angle,seed})=>({x,y,z,angle,seed}))),maximumTile:Math.max(...presentation.tiles.map(t=>t.roots.length)),drainage:sha(geology.formation.drainage.points),sourceTrace:sha(geology.route),gallery:sha(Buffer.from(geology.formation.kernelCaveBoundary.positions.buffer).toString('hex'))}));

assert.equal(counts.woodland,385944,'accepted woodland root population preserved');
assert(counts.ravine>64000&&counts.ravine<=150000,'independent ravine allocation realized after actual contacts');
assert(counts.newExtension>1000,'new64m corridor receives actual rooted vegetation');
assert(counts.total<=600000);assert(roots.length*16<=9600000);
assert(presentation.tiles.every(t=>t.roots.length<=1600));
const tiles=owner.planImmutableTiles(presentation);assert.equal(tiles.reduce((n,t)=>n+t.count,0),counts.total);
const ids=new Set();let maxContactError=0,checked=0;const bands=[0,0,0,0];
for(const r of roots){
 const id=`${r.x}:${r.z}`;assert(!ids.has(id),'duplicate spatial root');ids.add(id);
 const support=visibleSurface.sample(r.x,r.z);assert(support&&admitGround(r.x,r.z,support));
 maxContactError=Math.max(maxContactError,Math.abs(r.y-support.y));assert(Math.abs(r.y-support.y)<2e-5);
 assert(field.sample(r.x,r.z)>0);assert(woodland.woodlandGrassClear(terrain.unprojectPlanetVertex(r.x,r.y,r.z).x,terrain.unprojectPlanetVertex(r.x,r.y,r.z).z));
 const water=visibleSurface.water.sample(r.x,r.z);assert(!water||r.y>water.y+.029);
 if(r.region==='RAVINE'&&r.z< -352&&r.z>=-416)bands[Math.min(3,Math.floor((-352-r.z)/16))]++;
 checked++;
}
assert(bands.every(n=>n>100),'each16m extension section has supported vegetation');
console.log('ROOT_CONTACT_AND_BANDS',JSON.stringify({checked,maxContactError,bands}));
assert.equal(sha(woodlandCandidates),'e24e0d29da4da6435f043ee0449c0b1ff6abfa057abded77e6db5eceee2b590b');
// Expanded terrain indices may renumber support triangle metadata; persistent roots and uploaded coordinates stay identical.
assert.equal(sha(woodlandRoots.map(({x,y,z,angle,seed})=>({x,y,z,angle,seed}))),'e40321b7e6d05793f66431f38c669055a563c3229970aa6ecda3d838c3d298a5');
assert.equal(sha(Buffer.from(field.woodland.pixels).toString('hex')),'6f982e28c97146a2aea6bf9dbd8b7e8848daf251004dff57b2febbd452759fbe');

});

test('dry channel has32 descending2m stations and retains survey and water identity',async()=>{
 const {gunzipSync}=await import('node:zlib'),{createHash}=await import('node:crypto');
 const bridge=await import('../../showroom/globe/h-earth/functional-landscape/geological-runtime-bridge.v1.js');
 const canonical=JSON.parse(gunzipSync(readFileSync(new URL('../../showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz',import.meta.url)))).canonical;
 const model=bridge.constructGeologicalRuntimeBridge(canonical),points=model.formation.drainage.points,route=model.formation.vegetationCorridorPoints;
 const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
 assert.equal(sha(points),'7799cf58594ec0c6494a2431bd41196204f82c043da7c6f0cde38d9ffcf54990');
 assert.equal(sha(model.route),'42ce8fc5a14247dd9a8e42394cc4d4e7e59a082abe5e7992fa22cebb24c617ef');
 assert.equal(sha(model.formation.drainage),'b75611441acc88ffe6404075ab58aa544a9f3eb60d63407efd8d09d7666937be');
 const meshHash=m=>createHash('sha256').update(m.positions).update(m.indices).digest('hex');
 for(const [role,expected] of Object.entries({MOUNTAIN_OVERBURDEN:'1ac75926ab639b328f33744b75de958033e5329fe5eedaaca9507665d2bbc371',NATURAL_CLIFF_FACE:'2d95baab950ba96e85d3e504f16a076da9e2452d746b619af438142c620f85b0',CAVERN_PHYSICAL_SHELL:'361f271482f2ccdc8a6cc74e18f316851f2021e8143b3cfaaf80e715af6786b2',FRESHWATER_RIVER:'51f9923ba3c803f47cd4f26bbbb4e01f9a0c15744434dc4318995da5dc8b0e2f',OASIS_WATER:'4a8e1cb0d60761430ca4557d6b8776db0f97e8de7d597fe67095e6de2e70f028'}))assert.equal(meshHash(model.meshes.find(p=>p.role===role).mesh),expected,role+' must remain byte-identical');

 assert.equal(model.route.path.length,78);assert.equal(points.length,79);assert.equal(route.length,111);
 assert.deepEqual(route.slice(0,79),points);assert.equal(model.hydrology.connectedOutletProven,false);
 assert.equal(model.route.result,'NO_STRICT_LOWER_NEIGHBOR_IN_STUDY');assert.equal(bridge.H_EARTH_REAR_WATER_PRESENTATION_ENABLED,false);
 assert.deepEqual(model.localBounds,{xMin:-120,xMax:96,zMin:-440,zMax:-224});
 for(let i=79;i<route.length;i++){
  assert.equal(route[i].x,-80);assert.equal(route[i].z,route[i-1].z-2);assert(route[i].bedY<route[i-1].bedY);
  const emitted=model.sampleOutdoorAt(route[i].x,route[i].z);assert(emitted);assert(Math.abs(emitted.y-route[i].bedY)<2e-5);
 }
 assert.equal(route.at(-1).z,-416);
 for(const [x,z] of [[-80,-440],[-120,-420],[96,-420]])assert(Math.abs(model.formation.excavatedOutdoorTerrain(x,z)-model.originalTerrainElevationAt(x,z))<2e-5);
 // A fixed row behind the authored channel smoothly restores canonical ground.
 assert(Math.abs(model.formation.excavatedOutdoorTerrain(-80,-430)-model.originalTerrainElevationAt(-80,-430))<2e-5);
 for(const mesh of model.meshes.map(p=>p.mesh))assert(mesh.positions.every(Number.isFinite));
 assert.deepEqual(bridge.expandVegetationCorridorPoints(points).map(({x,z})=>({x,z})),route.map(({x,z})=>({x,z})));
 assert.throws(()=>bridge.expandVegetationCorridorPoints(points.slice(1)),/DRY_EXTENSION_SOURCE_ENDPOINT/);
});

test('ravine atlas fades organically at new limits and gives independent regional budgets',async()=>{
 const field=await buildWoodlandHabitatField({suitability:()=>1,ravinePoints:[{x:-80,z:-352},{x:-80,z:-416}]});
 assert.equal(RAVINE_HABITAT.maximumRoots,150000);assert.equal(WOODLAND_HABITAT.maximumRoots,450000);
 assert(ravineHabitatWeight([{x:-80,z:-352},{x:-80,z:-416}],-70,-410)>.5);
 for(const [x,z] of [[-110,-400],[96,-400],[-80,-440],[-80,-248]])assert.equal(field.ravine.sample(x,z),0);
 assert.equal(field.ravine.sample(60,-420),0);
 // Saturate both candidate regions without overlapping woodland ownership.
 const woodland={sample:(x,z)=>x>=-213&&x<=-69&&z>=-298&&z<=-154?1:0};
 const candidates=planWoodlandHabitatCandidates({woodland,ravine:{sample:()=>1}});
 assert.equal(candidates.filter(r=>r.region!=='RAVINE').length,450000);
 assert.equal(candidates.filter(r=>r.region==='RAVINE').length,150000);
 assert.equal(candidates.length,600000);
});

test('owner rejects regional ravine overflow before any GPU upload',async()=>{
 const {planImmutableTiles}=await import('../../showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js');
 const tiles=Array.from({length:151},(_,t)=>({id:`r${t}`,minX:t*4,minZ:0,roots:Array.from({length:t===150?1:1000},(_,i)=>({x:t*4+(i%32)*.12,y:1,z:Math.floor(i/32)*.12,angle:0,seed:i,slope:.1,region:'RAVINE'}))}));
 assert.throws(()=>planImmutableTiles({tiles,receipt:{contactCount:150001}}),/RAVINE_ROOT_BUDGET_EXCEEDED/);
 tiles.pop();const planned=planImmutableTiles({tiles,receipt:{contactCount:150000}});
 assert.equal(planned.reduce((n,t)=>n+t.count,0),150000);assert.equal(planned.reduce((n,t)=>n+t.packed.byteLength,0),2400000);
});
