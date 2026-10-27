import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
 GEN2928_HEAD,GEN2928_SHADER_SHA256,MODES,POSES,HEADS,
 transformHardBoundaryRenderer,verifyExactMaterialCandidate,
 instrumentDiagnosticRenderer,validateDiagnosticSet,SOURCE_FIRST_TARGET_POSES,SOURCE_FIRST_TARGET_MODES,SOURCE_RAVINE_TARGET_POSES,SOURCE_RAVINE_TARGET_MODES,SOURCE_NEAR_FAR_TARGET_POSES,SOURCE_NEAR_FAR_TARGET_MODES,NEAR_FAR_EXTRA_MODES
} from './h-earth-hard-boundary-stage-probe.v1.mjs';

const rendererPath=new URL('../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url);
const production=fs.readFileSync(rendererPath,'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');

test('new diagnostic is pinned to exactly published Gen2928 source, not prior 4-camera images',()=>{
 assert.equal(GEN2928_HEAD,'cb57c275b95d0d48883bc4da4dcfcf17cbec5060');
 assert.equal(HEADS.candidate,GEN2928_HEAD);
 assert.equal(HEADS.baseline,GEN2928_HEAD);
 assert.equal(sha(production),GEN2928_SHADER_SHA256);
 assert.equal(verifyExactMaterialCandidate(production),GEN2928_SHADER_SHA256);
 assert.equal(POSES.length,6);
 assert.equal(MODES.length,10);
 assert.equal(POSES.length*MODES.length,60);
 assert(POSES.every(p=>p.name.startsWith('new-')));
 assert(MODES.includes('reference-lit-with-grass'));
});

test('source intercept draws ordered stages but never changes product disk bytes',()=>{
 const original=fs.readFileSync(rendererPath);
 const result=transformHardBoundaryRenderer(production);
 assert.equal(result.originalSha256,GEN2928_SHADER_SHA256);
 assert.equal(result.productDiskMutation,false);
 assert.notEqual(result.instrumentedSha256,GEN2928_SHADER_SHA256);
 assert.equal(Buffer.compare(fs.readFileSync(rendererPath),original),0);
 const relevant=[
  'bndBeforeSoil=palette;',
  'bndSoil=palette;',
  'bndIdentity=palette;',
  'bndGCWeight=groundcoverWeight;',
  'bndGroundcover=palette;',
  'bndLocal=palette;',
  'bndHabitatWeight=habitatCoverage*.68;',
  'bndHabitat=base;',
  "globalThis.__hardBoundaryModeApplied=mode;"
 ];
 for(const anchor of relevant)assert.equal(result.source.includes(anchor),true,anchor);
 assert(result.source.indexOf('bndSoil=palette;')<result.source.indexOf('bndGCWeight=groundcoverWeight;'));
 assert(result.source.indexOf('bndGroundcover=palette;')<result.source.indexOf('bndLocal=palette;'));
 assert(result.source.indexOf('bndLocal=palette;')<result.source.indexOf('bndHabitat=base;'));
});

test('source mismatch fails closed on any candidate shader edit, including cosmetic edits',()=>{
 assert.throws(()=>transformHardBoundaryRenderer(production+'\n'),/PUBLISHED_GEN2928_SOURCE_SHA_MISMATCH/);
 assert.throws(()=>verifyExactMaterialCandidate(production+'\n'),/EXACT_GEN2928_SHADER_REQUIRED/);
 assert.throws(()=>instrumentDiagnosticRenderer(production+'\n'),/EXACT_GEN2928_SHADER_REQUIRED/);
});

test('diagnostic source routes all stages but shows actual vegetation in only physical-control frame',()=>{
 const s=instrumentDiagnosticRenderer(production);
 assert(s.includes('if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);'));
 assert(s.includes('globalThis.__hardBoundaryStageMode'));
 assert.equal(MODES.at(-1),'reference-lit-with-grass');
 assert.equal(MODES[0],'reference-lit');
});

test('paired source-camera-mode validation refuses incomplete or mixed vegetation state',()=>{
 const views=[];
 for(const pose of POSES)for(const [index,mode] of MODES.entries()){
   views.push({pose,mode,grassHidden:mode!=='reference-lit-with-grass',diagnosticApplied:index,
     assetSignature:'fixed',state:{position:{x:pose.x,y:pose.y??20,z:pose.z}},
     lastFrame:{cameraPosition:{x:pose.x,y:pose.y??20,z:pose.z}},sourceHead:GEN2928_HEAD,rendererHash:GEN2928_SHADER_SHA256});
 }
 assert.equal(validateDiagnosticSet(views),true);
 views.at(-1).grassHidden=true;
 assert.throws(()=>validateDiagnosticSet(views),/DIAGNOSTIC_MATCH_MISMATCH/);
});

import {
 PUBLISHED_HEAD,PUBLISHED_RENDERER_SHA,smooth,outsideDistance,groundProtection,
 piecewiseDivide,hillsideResponse,atlasCrossSections,protectionCrossSections,combinedHabitatRange,effectiveCoastalCrossing,rankEffectiveHabitatBorders,withinWalkingBounds,rankWithinWalkingBounds,makeCanonicalTerrainObserverSeed
} from '../h-earth-3d/evidence/post-gen2928-hard-boundary-20261027/source-first-census.v1.mjs';

test('source-first method preserves published identity and uses continuous analytic ramps',()=>{
 assert.equal(PUBLISHED_HEAD,GEN2928_HEAD);
 assert.equal(PUBLISHED_RENDERER_SHA,GEN2928_SHADER_SHA256);
 assert.equal(smooth(-48,-24,-48),0);
 assert.equal(smooth(-48,-24,-24),1);
 assert.equal(smooth(-48,-24,-36),.5);
 assert.equal(outsideDistance([-18,-204,34,-131],0,-175),0);
 assert.equal(outsideDistance([-18,-204,34,-131],-30,-175),12);
 assert.equal(groundProtection(0,-175),0);
 assert(groundProtection(-40,-175)>groundProtection(-28,-175));
 assert.equal(groundProtection(150,-175)>0,true);
});
test('published coastal-divide knots have continuous values and smooth hillside masking',()=>{
 const spine=[[-52,-208],[18,-226],[86,-235],[148,-224]];
 for(const [x,z] of spine)assert.equal(piecewiseDivide(x,spine),z);
 for(const [x] of spine)assert(Math.abs(piecewiseDivide(x-1e-6,spine)-piecewiseDivide(x+1e-6,spine))<.00001);
 assert.equal(hillsideResponse(18,-226-48,spine),0);
 assert.equal(hillsideResponse(18,-226-24,spine),1);
 assert.equal(hillsideResponse(18,-226-36,spine),.5);
});
test('atlas geographic gates fade to zero on region perimeter, not assumed to be hard seam',()=>{
 const mask={size:8,width:24,bytes:new Uint8Array(8*24).fill(255)};
 const region={name:'test',panel:1,bounds:[0,0,80,80]};
 const m=atlasCrossSections(mask,region,4);
 assert.equal(m.region,'test');
 assert(m.examined>0);
 assert(m.largestTwoMetre[0].twoMetres>0);
 assert(m.largestTwoMetre.every(x=>x.zeroLimit<.00001));
 const p=protectionCrossSections([18,-210,132,-125],'estate');
 assert(p.examined>0);
 assert(p.maximumTwoMetreMaskContrast>0);
});

test('source-first GPU targets correspond to independently measured source coordinates rather than arbitrary survey poses',()=>{
 assert.deepEqual(SOURCE_FIRST_TARGET_POSES.map(p=>[p.sourceBoundary.x,p.sourceBoundary.z]),
  [[-146,-283],[-146,-283],[132,-202]]);
 assert.equal(SOURCE_FIRST_TARGET_POSES.length*SOURCE_FIRST_TARGET_MODES.length,24);
 assert(SOURCE_FIRST_TARGET_POSES.every(p=>p.sourceBoundary.origin==='SOURCE_FIRST_CENSUS_ARTIFACT_12768211588'));
 assert(SOURCE_FIRST_TARGET_POSES.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)&&Number.isFinite(p.yaw)&&Number.isFinite(p.pitch)));
 assert(SOURCE_FIRST_TARGET_MODES.includes('reference-lit-with-grass'));
});

test('source first coastal atlas edge is evaluated after overlapping woodland and ravine max composition',()=>{
 const pixels=new Uint8Array(8*24).fill(255);
 const mask={size:8,width:24,bytes:pixels};
 const regions=[
  {name:'woodland',panel:0,bounds:[-10,-10,20,20]},
  {name:'ravine',panel:1,bounds:[-10,-10,20,20]},
  {name:'coastal',panel:2,bounds:[0,0,10,10]}
 ];
 const withoutCoastal=combinedHabitatRange(mask,regions,5,-1);
 const withCoastal=combinedHabitatRange(mask,regions,5,2);
 assert(Math.abs(withoutCoastal.lower-withCoastal.lower)<.00001);
 assert(Math.abs(withoutCoastal.upper-withCoastal.upper)<.00001);
 assert(withCoastal.lowerDominance.includes('woodland'));
 assert(!withCoastal.upperDominance.includes('coastal'));
 const transect=effectiveCoastalCrossing(mask,regions,5,0);
 assert.equal(transect.acrossFourMetres.maximumPossibleCoverageDifference,0);
 for(let row=0;row<8;row++)pixels.fill(0,row*24,row*24+16);
 const coastalOnly=combinedHabitatRange(mask,regions,5,2);
 assert(coastalOnly.upper>coastalOnly.lower);
 assert(coastalOnly.upperDominance.includes('coastal'));
});

test('source-first border ranking excludes fully masked coastal panel while detecting active unmasked panel',()=>{
 const n=16,width=n*3,pixels=new Uint8Array(n*width).fill(255);
 for(let y=0;y<n;y++)pixels.fill(0,y*width,y*width+n); // woodland absent: ravine alone masks coastal
 const mask={size:n,width,bytes:pixels};
 const regions=[
  {name:'woodland',bounds:[-20,-20,30,30],panel:0},
  {name:'ravine',bounds:[-20,-20,30,30],panel:1},
  {name:'coastal',bounds:[0,0,10,10],panel:2}
 ];
 const all=rankEffectiveHabitatBorders(mask,regions,{stepMetres:2});
 assert.equal(all.perRegion.find(x=>x.region==='coastal').effectiveAtTwoMetres,0);
 assert(all.perRegion.find(x=>x.region==='coastal').maskedAtTwoMetres>0);
 assert(all.perRegion.some(x=>x.region==='ravine'&&x.effectiveAtTwoMetres>0));
 for(let y=0;y<n;y++)pixels.fill(0,y*width,y*width+n*2);
 const isolated=rankEffectiveHabitatBorders(mask,regions,{stepMetres:2});
 assert(isolated.perRegion.find(x=>x.region==='coastal').effectiveAtTwoMetres>0);
 assert(isolated.ranked.every(x=>Number.isFinite(x.x)&&Number.isFinite(x.z)));
 assert.equal(isolated.result,'ACTUAL_MAX_COMPOSITED_REGION_CONTRIBUTIONS_RANKED');
});

test('source candidate ranking prefers current walking domain but does not assert GPU camera eligibility',()=>{
 assert.equal(withinWalkingBounds(-298,-546),false);
 assert.equal(withinWalkingBounds(88,-286),true);
 assert.equal(withinWalkingBounds(-256,-400),true);
 assert.equal(withinWalkingBounds(257,-286),false);
 const synthetic={ranked:[{region:'ravine',side:'west',x:-298,z:-546,rank:.56},{region:'ravine',side:'east',x:88,z:-286,rank:.46}],
  perRegion:[{topSourceCoordinates:[{region:'ravine',side:'east',x:88,z:-286,rank:.46}]}]};
 const r=rankWithinWalkingBounds(synthetic);
 assert.equal(r.top.length,1);
 assert.deepEqual([r.top[0].x,r.top[0].z],[88,-286]);
 const seed=makeCanonicalTerrainObserverSeed(102,-286,270,{x:88,z:-286});
 assert.equal(seed.diagnosticObserver,true);
 assert.equal(seed.navigablePositionDeclared,false);
 assert(Number.isFinite(seed.y)&&Number.isFinite(seed.terrainElevation));
 assert(Math.abs(seed.y-seed.terrainElevation-9)<.000002);
});

test('ravine east targeted cameras derive elevations from canonical world terrain, without inventing navigation approval',()=>{
 assert.deepEqual(SOURCE_RAVINE_TARGET_POSES.map(p=>[p.x,p.z,p.yaw]),[[102,-286,270],[74,-286,90]]);
 assert(SOURCE_RAVINE_TARGET_POSES.every(p=>p.diagnosticObserver===true&&p.cameraNotNavigationAuthorized===true));
 assert(SOURCE_RAVINE_TARGET_POSES.every(p=>Number.isFinite(p.y)&&Number.isFinite(p.observedElevation)&&Number.isFinite(p.targetElevation)));
 assert(SOURCE_RAVINE_TARGET_POSES.every(p=>Math.abs((p.y-p.observedElevation)-9)<.000002));
 assert(SOURCE_RAVINE_TARGET_POSES.every(p=>p.sourceBoundary.x===88&&p.sourceBoundary.z===-286&&p.sourceBoundary.sourceArtifact===12770542590));
 assert.equal(SOURCE_RAVINE_TARGET_POSES.length*SOURCE_RAVINE_TARGET_MODES.length,16);
 assert(SOURCE_RAVINE_TARGET_MODES.includes('reference-lit-with-grass'));
});

test('near far observed GPU roles and role-only final lighting can be isolated without writing the real shader',()=>{
 const original=fs.readFileSync(rendererPath);
 const patched=transformHardBoundaryRenderer(production);
 assert(patched.source.includes('if(vRoleCode==1u&&uHardBoundaryStageMode!=10){'));
 assert(patched.source.includes('isExactFarLandSoilPrimitive?vec3(0.0,1.0,0.0)'));
 assert.equal(Buffer.compare(original,fs.readFileSync(rendererPath)),0);
 assert.deepEqual(NEAR_FAR_EXTRA_MODES,['role1-contact-disabled-lit','primitive-role-raw']);
 assert.equal(SOURCE_NEAR_FAR_TARGET_POSES.length,2);
 assert.equal(SOURCE_NEAR_FAR_TARGET_MODES.length,10);
 assert.equal(SOURCE_NEAR_FAR_TARGET_POSES.length*SOURCE_NEAR_FAR_TARGET_MODES.length,20);
 assert.deepEqual(SOURCE_NEAR_FAR_TARGET_POSES.map(p=>[p.sourceBoundary.x,p.sourceBoundary.z]),[[-384,-112],[384,-112]]);
 assert(SOURCE_NEAR_FAR_TARGET_POSES.every(p=>p.diagnosticObserver===true&&p.navigationAuthorized===false&&p.terrainDerivedY===true));
});
