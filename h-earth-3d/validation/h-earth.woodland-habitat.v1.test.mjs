import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WOODLAND_HABITAT,regionalWoodlandWeight,buildWoodlandHabitatField,sampleWoodlandHabitat,planWoodlandHabitatCandidates,habitatSmooth,RAVINE_HABITAT,ravineHabitatWeight} from '../../showroom/globe/h-earth/render/woodland-habitat-field.v1.js';
import {createUniformGroundAdmission} from '../../showroom/globe/h-earth/render/landscape-planting-pilot.v1.js';

test('regional field tapers continuously beyond old ellipse and is zero at every rectangular boundary',()=>{
 assert.ok(regionalWoodlandWeight(-141,-226)>0);
 let outer=0;
 for(let x=-205;x<-75;x+=1)for(let z=-290;z<-160;z+=1)if(Math.hypot((x+141)/41.25,(z+226)/40)>1.1&&regionalWoodlandWeight(x,z)>.02)outer++;
 assert.ok(outer>1000,'material coverage extends beyond the former ellipse');
 for(const x of [-213,-69])for(let z=-298;z<=-154;z++)assert.equal(regionalWoodlandWeight(x,z),0);
 for(const z of [-298,-154])for(let x=-213;x<=-69;x++)assert.equal(regionalWoodlandWeight(x,z),0);
 for(let x=-205;x<-75;x+=.1)assert.ok(Math.abs(regionalWoodlandWeight(x,-226)-regionalWoodlandWeight(x+.001,-226))<.001);
});
test('shared raster conservatively clears a protected corridor and softly approaches it',async()=>{
 const field=await buildWoodlandHabitatField({suitability:(x,z)=>Math.abs(x+141)<2?0:1});
 assert.equal(field.pixels.byteLength,192*192);
 for(let z=-260;z<-190;z+=.2)for(let x=-143;x<-139;x+=.2)assert.equal(field.sample(x,z),0);
 assert.ok(field.sample(-147,-226)>0);assert.ok(field.sample(-147,-226)<field.sample(-151,-226));
 for(let x=-155;x<-128;x+=.05)assert.ok(Math.abs(field.sample(x,-226)-field.sample(x+.001,-226))<.002);
 const ramp={size:2,bounds:[0,0,2,2],pixels:new Uint8Array([0,255,0,255])};
 assert.equal(sampleWoodlandHabitat(ramp,1,1),.5,'bilinear CPU coordinates match GPU texel-center convention');
 assert.equal(sampleWoodlandHabitat(ramp,.5,.5),0);assert.equal(sampleWoodlandHabitat(ramp,1.5,1.5),1);
});
test('static candidate layout is deterministic and bounded before exact contact sampling',async()=>{
 const field=await buildWoodlandHabitatField({suitability:()=>1});
 const a=planWoodlandHabitatCandidates(field),b=planWoodlandHabitatCandidates(field);
 assert.deepEqual(a,b);assert.ok(a.length>100000);assert.ok(a.length<=450000);
 const tiles=new Map();for(const root of a){const key=`${Math.floor(root.x/4)}:${Math.floor(root.z/4)}`;tiles.set(key,(tiles.get(key)??0)+1);assert.ok(field.sample(root.x,root.z)>0);}
 assert.ok([...tiles.values()].every(n=>n<=1600));
 // Even an adversarial field cannot exceed the global limit.
 const capped=planWoodlandHabitatCandidates({sample:()=>1});assert.equal(capped.length,450000);
});
const box={minX:100,maxX:110,minZ:100,maxZ:110};
test('ravine atlas preserves exact woodland texels and root identities while adding irregular drainage shoulders',async()=>{
 const points=[{x:40,z:-268},{x:32,z:-288},{x:-28,z:-288},{x:-48,z:-306},{x:-68,z:-322},{x:-80,z:-352}];
 const base=await buildWoodlandHabitatField({suitability:()=>.5}),combined=await buildWoodlandHabitatField({suitability:()=>.5,ravinePoints:points});
 assert.deepEqual(combined.woodland.pixels,base.pixels);assert.equal(combined.width,384);assert.equal(combined.height,192);assert.equal(combined.pixels.byteLength,73728);
 const old=planWoodlandHabitatCandidates(base),next=planWoodlandHabitatCandidates(combined);
 assert.deepEqual(next.slice(0,old.length),old,'extension never rehashes or thins the approved woodland');
 assert.ok(next.length>old.length);assert.ok(next.length<=450000);assert.ok(next.length-old.length<=64000);
 assert.ok(next.slice(old.length).every(p=>p.region==='RAVINE'&&combined.ravine.sample(p.x,p.z)>0&&base.sample(p.x,p.z)===0));
 for(let row=0;row<192;row++){assert.deepEqual(combined.pixels.subarray(row*384,row*384+192),base.pixels.subarray(row*192,(row+1)*192));assert.deepEqual(combined.pixels.subarray(row*384+192,(row+1)*384),combined.ravine.pixels.subarray(row*192,(row+1)*192));}
 const [x0,z0,x1,z1]=RAVINE_HABITAT.bounds;
 for(const x of [x0,x1])for(let z=z0;z<=z1;z++)assert.equal(ravineHabitatWeight(points,x,z),0);
 for(let x=-60;x<20;x+=.2)assert.ok(Math.abs(ravineHabitatWeight(points,x,-288)-ravineHabitatWeight(points,x+.001,-288))<.001);
 assert.ok(combined.ravine.sample(-48,-306)>0);assert.equal(combined.ravine.sample(60,-360),0,'atlas extent does not become a filled rectangle');
});
function admissionFixture(sand=0,submerged=false){return {visibleSurface:{beach:{sample:()=>({valid:true,rawSandCoverage:sand})},water:{sample:()=>submerged?{y:4}:null}},geology:{sampleWaterAt:()=>null,meshes:[{role:'FRESHWATER_RIVER',mesh:{positions:new Float32Array([200,0,200,210,0,200,200,0,210]),indices:new Uint32Array([0,1,2])}}]},toLocal:(x,y,z)=>({x,y,z}),estate:{manorCore:box,gardens:box,outbuildingProposal:box,acceptedEnvelope:box,footRoute:[{x:100,z:100},{x:110,z:100}],footRouteRadius:1},oasis:box,sampleStructure:()=>({hardExclusions:[],planningHolds:[]})};}
test('legacy admission remains strict; replacement sand ceiling is bounded and never waives water',async()=>{
 const strict=await createUniformGroundAdmission(admissionFixture(.01));assert.equal(strict(0,0,{y:2}),false);
 const replacement=await createUniformGroundAdmission({...admissionFixture(.08),maximumSandCoverage:.12});assert.equal(replacement(0,0,{y:2}),true);
 assert.ok(1-habitatSmooth(0,.12,.08)>0);assert.equal(1-habitatSmooth(0,.12,.12),0);
 const wet=await createUniformGroundAdmission({...admissionFixture(.08,true),maximumSandCoverage:.12});assert.equal(wet(0,0,{y:2}),false);
 await assert.rejects(createUniformGroundAdmission({...admissionFixture(),maximumSandCoverage:.121}),/SAND_LIMIT/);
});
test('terrain shader and root placement consume one field without per-frame uploads or camera generation',()=>{
 const renderer=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
 const replacement=renderer.slice(renderer.indexOf('  function prepareReplacementVegetation'),renderer.indexOf('  async function uploadGlobalCover'));
 assert.ok(replacement.includes('maximumSandCoverage:WOODLAND_HABITAT.maximumSandCoverage'));
 assert.ok(replacement.includes('visibleSurface:resources.vegetationVisibleSurface,habitat,'));assert.ok(replacement.includes('habitat.pixels'));
 assert.ok(renderer.includes('(vWorldPosition.xz-uWoodlandHabitatBounds.xy)/(uWoodlandHabitatBounds.zw-uWoodlandHabitatBounds.xy)'));
 assert.ok(renderer.includes('texture(uWoodlandHabitat,habitatUv).r'));
 const renderFrame=renderer.slice(renderer.indexOf('  function renderFrame('),renderer.indexOf('  function captureColorSummary('));
 assert.ok(!renderFrame.includes('texImage2D'));assert.ok(!renderFrame.includes('texSubImage2D'));assert.ok(!renderFrame.includes('buildWoodlandHabitatField'));
 const legacy=renderer.slice(renderer.indexOf('  function prepareVegetation'),renderer.indexOf('  function prepareReplacementVegetation'));
 assert.ok(!legacy.includes('maximumSandCoverage:'));
});

test('exact archived world builds finite protected habitat roots with populated fixed control',async()=>{
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
 const {H_EARTH_WOODLAND_CLEARING_BOUNDS:b}=await import(new URL('woodland-clearing-trial.js',renderBase));
 const protectedReferenceAt=()=>false;
 const {visibleSurface}=await fixture({baseDirectory:root.pathname,pkg:payload.raw,geology,uploadSource:readFileSync(new URL('gpu-upload-views.run8e-r2d.js',renderBase),'utf8'),protectedReferenceAt});
 const pilotPackage=payload.raw,admitGround=await createUniformGroundAdmission({visibleSurface,geology,toLocal:terrain.unprojectPlanetVertex,estate:placement.H_EARTH_GEN311_ESTATE_PLACEMENT_POLICY,obstacles:pilotPackage.landscapeCoverFootprints??[],trees:pilotPackage.landscapeFloorFootprints??[],oasis:grass.H_EARTH_OASIS_FOLIAGE_SAMPLE,sampleStructure:placement.sampleHEarthGen311PlacementStructureDisposition,maximumSandCoverage:.12});
 const replacement=renderer.slice(renderer.indexOf('  function prepareReplacementVegetation'));
 const fieldCode=replacement.slice(replacement.indexOf('      const habitat=await buildWoodlandHabitatField'),replacement.indexOf('      const presentation=await buildWoodlandFineGrass'));
 const field=await Function('buildWoodlandHabitatField','habitatSmooth','yieldToBrowserPaint','visibleSurface','admitGround','unprojectPlanetVertex','pilotMaterialAt','woodlandGrassClear','pilotPackage','WOODLAND_HABITAT','resources',`return(async()=>{${fieldCode};return habitat;})()`)(buildWoodlandHabitatField,habitatSmooth,async()=>{},visibleSurface,admitGround,terrain.unprojectPlanetVertex,materials.sampleHEarthRun8CSuccessorSurfaceMaterial,woodland.woodlandGrassClear,pilotPackage,WOODLAND_HABITAT,{geologicalRuntime:geology});
 const presentation=await woodland.buildWoodlandFineGrass(pilotPackage,{visibleSurface,admitGround,habitat:field});
 const tiles=owner.planImmutableTiles(presentation);let roots=0,control=0,expanded=0,ravine=0,maximumTile=0;
 const approachControls=[{x:50,z:-300,roots:0},{x:60,z:-300,roots:0}];
 for(const tile of presentation.tiles){maximumTile=Math.max(maximumTile,tile.roots.length);for(const root of tile.roots){
  roots++;if(root.z< -298&&root.x> -110)ravine++;assert.ok([root.x,root.y,root.z,root.angle,root.seed,root.slope].every(Number.isFinite));assert.ok(admitGround(root.x,root.z,visibleSurface.sample(root.x,root.z)));assert.ok(field.sample(root.x,root.z)>0);
  assert.ok(root.slope<=.35,'ravine expansion preserves the existing steep-surface exclusion');
  for(const point of approachControls)if(Math.hypot(root.x-point.x,root.z-point.z)<5)point.roots++;
  assert.ok(woodland.woodlandGrassClear(terrain.unprojectPlanetVertex(root.x,root.y,root.z).x,terrain.unprojectPlanetVertex(root.x,root.y,root.z).z));
  if(Math.hypot(root.x+139.40267987050615,root.z+194.5)<=2)control++;
  if(Math.hypot((root.x+141)/41.25,(root.z+226)/40)>1.05)expanded++;
 }}
 assert.ok(roots>0&&roots<=450000);assert.ok(ravine>100,'real ravine receives admitted vegetation');assert.equal(field.receipt.woodlandGridPreserved,true);assert.equal(field.pixels.byteLength,73728);assert.ok(control>0,'qualified owner requires populated fixed control');assert.ok(expanded>0,'real rendered admission allows coverage beyond former ellipse');assert.ok(maximumTile<=1600);assert.equal(tiles.reduce((n,t)=>n+t.count,0),roots);
 assert.equal(createHash('sha256').update(JSON.stringify(payload.raw.buffers)).digest('hex'),before);
 for(const point of approachControls){const support=visibleSurface.sample(point.x,point.z);assert.ok(admitGround(point.x,point.z,support),'approach control is supported admissible soil');assert.ok(field.sample(point.x,point.z)>0,'supported approach is inside graded habitat');assert.ok(point.roots>50,'previously empty approach now has actual supported nearby roots');}
 console.log('EXACT_HABITAT_CENSUS',JSON.stringify({roots,control,expanded,ravine,maximumTile,tiles:tiles.length,approachControls,field:field.receipt}));
});
