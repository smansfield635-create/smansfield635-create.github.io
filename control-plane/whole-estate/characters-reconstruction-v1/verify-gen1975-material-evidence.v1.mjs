#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const HERE=path.dirname(fileURLToPath(import.meta.url));
const CONTRACT=JSON.parse(fs.readFileSync(path.join(HERE,'gen1975-material-evidence-contract.v1.json'),'utf8'));
const args={};
for(let i=2;i<process.argv.length;i++){
  const token=process.argv[i];
  if(!token.startsWith('--'))throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  args[token.slice(2)]=process.argv[++i]??null;
}
if(!args.manifest||!args['evidence-root']||!args.output)throw new Error('MANIFEST_EVIDENCE_ROOT_OUTPUT_REQUIRED');

const manifestPath=path.resolve(args.manifest);
const evidenceRoot=path.resolve(args['evidence-root']);
const outputPath=path.resolve(args.output);
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const checks=[];
const check=(id,pass,detail={})=>checks.push({id,pass:Boolean(pass),detail});
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

check('MANIFEST_SCHEMA',manifest.schema==='MIRRORLAND_GEN1975_MATERIAL_EVIDENCE_MANIFEST_v1',{observed:manifest.schema});
check('OPERATION_IDENTITY',manifest.operationId===CONTRACT.operationId,{observed:manifest.operationId});
check('LOCK_GENERATION',manifest.lockGeneration===CONTRACT.lockGeneration,{observed:manifest.lockGeneration});
check('FROZEN_PRODUCT_SHA_EXACT',manifest.frozenProductSha===CONTRACT.frozenProductSha,{observed:manifest.frozenProductSha});
check('V5_BLOB_BYTE_IDENTICAL',manifest.frozenV5BlobSha===CONTRACT.frozenV5BlobSha,{observed:manifest.frozenV5BlobSha});
check('PRODUCT_PATH_MUTATION_ABSENT',manifest.productPathMutationDetected===false,{observed:manifest.productPathMutationDetected});
check('CAPTURE_HAS_NO_MATERIAL_AUTHORITY',manifest.visualDispositionAuthority==='NOT_ASSIGNED_BY_CAPTURE_JOB'&&manifest.materialDisposition==='EVIDENCE_CAPTURED_PENDING_VISUAL_ADJUDICATION',{visualDispositionAuthority:manifest.visualDispositionAuthority,materialDisposition:manifest.materialDisposition});

const captures=Array.isArray(manifest.captures)?manifest.captures:[];
const expectedProfiles=Object.entries(CONTRACT.profiles);
let expectedCount=0;
for(const [profile,config] of expectedProfiles){
  expectedCount+=config.requiredStates.length;
  const subset=captures.filter(x=>x.profile===profile);
  check(`${profile.toUpperCase()}_CAPTURE_COUNT`,subset.length===config.requiredStates.length,{observed:subset.length,expected:config.requiredStates.length});
  check(`${profile.toUpperCase()}_STATE_SET`,same([...subset.map(x=>x.state)].sort(),[...config.requiredStates].sort()),{observed:subset.map(x=>x.state)});
  for(const state of config.requiredStates){
    const c=subset.find(x=>x.state===state);
    if(!c)continue;
    check(`${profile}:${state}:DIMENSIONS`,c.width===config.viewport[0]&&c.height===config.viewport[1],{observed:[c.width,c.height],expected:config.viewport});
    check(`${profile}:${state}:WEBGL2`,c.runtime?.webgl2===true&&c.runtime?.fatal===false,{runtime:c.runtime});
    if(profile==='compactMobile')check(`${profile}:${state}:COMPACT_MEDIA_QUERY`,c.compactMediaQueryMatches===true,{observed:c.compactMediaQueryMatches});
    const file=typeof c.file==='string'?c.file:'';
    const resolved=path.resolve(evidenceRoot,file);
    const inside=resolved.startsWith(evidenceRoot+path.sep);
    const exists=inside&&fs.existsSync(resolved)&&fs.statSync(resolved).isFile();
    check(`${profile}:${state}:PNG_EXISTS`,exists,{file});
    if(exists){
      const digest=sha256(resolved);
      check(`${profile}:${state}:PNG_SHA256`,digest===c.sha256,{observed:digest,manifest:c.sha256});
    }
  }
}
check('TOTAL_CAPTURE_COUNT',captures.length===expectedCount,{observed:captures.length,expected:expectedCount});

const witness=manifest.independentInteriorWitness||{};
check('INDEPENDENT_INTERIOR_NORMAL_DESTINATION',witness.normalDestinationCamera===true&&witness.syntheticCameraUsed===false,{normalDestinationCamera:witness.normalDestinationCamera,syntheticCameraUsed:witness.syntheticCameraUsed});
check('INDEPENDENT_INTERIOR_NOT_MANOR',typeof witness.destinationId==='string'&&witness.destinationId!=='manor'&&witness.distinctFromManor===true,{destinationId:witness.destinationId,distinctFromManor:witness.distinctFromManor});
check('INDEPENDENT_INTERIOR_ZONE',witness.spatialZone===CONTRACT.independentInteriorRule.mustResolveSpatialZone,{observed:witness.spatialZone});
check('INDEPENDENT_INTERIOR_STAND_CLASS',CONTRACT.independentInteriorRule.allowedStandClasses.includes(witness.standClass),{observed:witness.standClass});
check('INDEPENDENT_INTERIOR_LOCAL_CANOPY',Number.isInteger(witness.nearbyInteriorCanopyCount)&&witness.nearbyInteriorCanopyCount>=CONTRACT.independentInteriorRule.minimumNearbyInteriorCanopyCount,{observed:witness.nearbyInteriorCanopyCount,minimum:CONTRACT.independentInteriorRule.minimumNearbyInteriorCanopyCount});
check('INDEPENDENT_INTERIOR_CAMERA_DISTINCT',witness.cameraIdentityDigest&&witness.manorCameraIdentityDigest&&witness.cameraIdentityDigest!==witness.manorCameraIdentityDigest,{cameraIdentityDigest:witness.cameraIdentityDigest,manorCameraIdentityDigest:witness.manorCameraIdentityDigest});

const failed=checks.filter(x=>!x.pass);
const receipt={
  schema:'MIRRORLAND_GEN1975_MATERIAL_EVIDENCE_VERIFICATION_RECEIPT_v1',
  operationId:CONTRACT.operationId,
  lockGeneration:CONTRACT.lockGeneration,
  frozenProductSha:CONTRACT.frozenProductSha,
  checkCount:checks.length,
  passCount:checks.length-failed.length,
  failCount:failed.length,
  result:failed.length===0?'PASS_CLOSED':'FAIL_CLOSED',
  materialDispositionAuthority:false,
  materialDisposition:'UNASSIGNED_BY_VERIFIER',
  checks
};
fs.mkdirSync(path.dirname(outputPath),{recursive:true});
fs.writeFileSync(outputPath,JSON.stringify(receipt,null,2)+'\n');
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
if(failed.length)process.exitCode=1;
