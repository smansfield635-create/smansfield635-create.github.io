import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
 GEN2928_HEAD,GEN2928_SHADER_SHA256,MODES,POSES,HEADS,
 transformHardBoundaryRenderer,verifyExactMaterialCandidate,
 instrumentDiagnosticRenderer,validateDiagnosticSet
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
