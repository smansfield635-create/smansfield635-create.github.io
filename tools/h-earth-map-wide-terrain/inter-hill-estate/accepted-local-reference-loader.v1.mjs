#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

export const IDENTITIES = Object.freeze({
  governingMain: '0d88fe21aba99c97b73fcdc68d44af57d55b68be',
  currentTerrain: { head: '0d88fe21aba99c97b73fcdc68d44af57d55b68be', path: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js', blob: '0bd36eec01a75311bf6441d575bae5a057195bbc' },
  accepted: { head: 'd1147c67c366fad53e824c64519998e7ccd5f8f5', deltaPath: 'h-earth-3d/terrain/h-earth.r06-c10.official-landform-candidate-001.js', deltaBlob: 'eb544a41aaa56bdee5d6d92114e85d6b4e6262f3', successorFieldPath: 'h-earth-3d/terrain/h-earth.successor-terrain-field.run8b.js', successorFieldBlob: 'aa6111a2e37a0ddfd5004a2ec9920a2451f5a4b8' }
});
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const git = (root,args) => execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
const resolveBlob = (root,head,file) => git(root,['rev-parse',`${head}:${file}`]);
const requireBlob = (root,head,file,expected,code) => { const actual=resolveBlob(root,head,file); if(actual!==expected) throw new Error(`${code}:${actual}:${expected}`); return actual; };

export function verifySourceIdentities({root='.',governingMain=IDENTITIES.governingMain}={}) {
  const repositoryRoot=path.resolve(root);
  if(governingMain!==IDENTITIES.governingMain) throw new Error(`CURRENT_MAIN_HEAD_MISMATCH:${governingMain}`);
  git(repositoryRoot,['cat-file','-e',`${governingMain}^{commit}`]);
  const currentBlob=requireBlob(repositoryRoot,IDENTITIES.currentTerrain.head,IDENTITIES.currentTerrain.path,IDENTITIES.currentTerrain.blob,'CURRENT_TERRAIN_BLOB_MISMATCH');
  const acceptedDeltaBlob=requireBlob(repositoryRoot,IDENTITIES.accepted.head,IDENTITIES.accepted.deltaPath,IDENTITIES.accepted.deltaBlob,'ACCEPTED_R06_C10_BLOB_MISMATCH');
  const acceptedSuccessorBlob=requireBlob(repositoryRoot,IDENTITIES.accepted.head,IDENTITIES.accepted.successorFieldPath,IDENTITIES.accepted.successorFieldBlob,'ACCEPTED_SUCCESSOR_FIELD_BLOB_MISMATCH');
  const workingBlob=git(repositoryRoot,['hash-object',IDENTITIES.currentTerrain.path]);
  if(workingBlob!==currentBlob) throw new Error(`WORKTREE_CURRENT_TERRAIN_IDENTITY_MISMATCH:${workingBlob}:${currentBlob}`);
  return Object.freeze({governingMain,currentBlob,acceptedDeltaBlob,acceptedSuccessorBlob,acceptedReferenceMergedMain:false,pass:true});
}

function materializeGitObject(root,head,file,target) {
  const bytes=execFileSync('git',['show',`${head}:${file}`],{cwd:root,encoding:null,maxBuffer:64*1024*1024});
  fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,bytes); return {sha256:sha256(bytes),byteCount:bytes.length};
}

export async function loadAcceptedLocalReference({root='.',governingMain=IDENTITIES.governingMain}={}) {
  const repositoryRoot=path.resolve(root); const identityVerification=verifySourceIdentities({root:repositoryRoot,governingMain});
  const currentUrl=pathToFileURL(path.join(repositoryRoot,IDENTITIES.currentTerrain.path)); currentUrl.searchParams.set('identity',identityVerification.currentBlob);
  const current=await import(currentUrl.href);
  if(typeof current.sampleHEarthRun8BSuccessorTerrainElevation!=='function') throw new Error('CURRENT_TERRAIN_SAMPLER_MISSING');
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'h-earth-inter-hill-reference-'));
  const deltaFile=path.join(temporary,'accepted-r06-c10.mjs');
  const materialized=materializeGitObject(repositoryRoot,IDENTITIES.accepted.head,IDENTITIES.accepted.deltaPath,deltaFile);
  const deltaUrl=pathToFileURL(deltaFile); deltaUrl.searchParams.set('identity',identityVerification.acceptedDeltaBlob);
  const accepted=await import(deltaUrl.href);
  if(typeof accepted.sampleHEarthR06C10OfficialLandformDelta!=='function') throw new Error('ACCEPTED_DELTA_SAMPLER_MISSING');
  const currentSample=(x,z)=>current.sampleHEarthRun8BSuccessorTerrainElevation(x,z);
  const compositeSample=(x,z)=>currentSample(x,z)+accepted.sampleHEarthR06C10OfficialLandformDelta(x,z);
  return Object.freeze({
    identityVerification:{...identityVerification,materializedAcceptedDeltaSha256:materialized.sha256},
    modes:Object.freeze({
      CURRENT_MAIN_BASELINE:Object.freeze({id:'CURRENT_MAIN_BASELINE',generationRevision:2,analysisOnly:false,sampleElevation:currentSample}),
      CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE:Object.freeze({id:'CURRENT_MAIN_PLUS_ACCEPTED_R06_C10_ANALYSIS_COMPOSITE',generationRevision:3,analysisOnly:true,runtimeImportProhibited:true,mergedMain:false,sampleElevation:compositeSample})
    }),
    cleanup:()=>fs.rmSync(temporary,{recursive:true,force:true})
  });
}
