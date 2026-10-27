import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
 GEN2928_HEAD,GEN2928_SHADER_SHA256,MODES,POSES,HEADS,
 transformHardBoundaryRenderer,verifyExactMaterialCandidate,
 instrumentDiagnosticRenderer,validateDiagnosticSet,SOURCE_FIRST_TARGET_POSES,SOURCE_FIRST_TARGET_MODES
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
 piecewiseDivide,hillsideResponse,atlasCrossSections,protectionCrossSections,combinedHabitatRange,effectiveCoastalCrossing
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
 pixels.fill(0,0,8*16);
 const coastalOnly=combinedHabitatRange(mask,regions,5,2);
 assert(coastalOnly.upper>coastalOnly.lower);
 assert(coastalOnly.upperDominance.includes('coastal'));
});
