#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';

const argv=process.argv.slice(2);const a={};for(let i=0;i<argv.length;i++)if(argv[i].startsWith('--'))a[argv[i].slice(2)]=argv[++i];
const need=k=>{if(!a[k])throw new Error(`MISSING_${k.toUpperCase().replaceAll('-','_')}`);return a[k]};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const root=path.resolve(a.root||'.');
const admissionPath=path.resolve(need('admission-receipt'));
const staging=path.resolve(root,need('staging-dir'));
const destinationRel=need('destination');
const destination=path.resolve(root,destinationRel);
const output=path.resolve(need('output'));
const expectedSha=need('expected-sha256');
const commitMode=a['commit-mode']==='true';
const allowedStage=path.resolve(root,'.media-staging/awards-compass-v2');
const allowedDestination=path.resolve(root,'proof-media/awards-compass-v2');
if(!(staging===allowedStage||staging.startsWith(allowedStage+path.sep)))throw new Error('STAGING_PATH_NOT_AUTHORIZED');
if(!(destination===allowedDestination||destination.startsWith(allowedDestination+path.sep)))throw new Error('DESTINATION_PATH_NOT_AUTHORIZED');
if(!destination.endsWith('.mp4'))throw new Error('DESTINATION_EXTENSION_NOT_AUTHORIZED');
if(!/^[0-9a-f]{64}$/.test(expectedSha))throw new Error('INVALID_EXPECTED_SHA256');
const admission=JSON.parse(fs.readFileSync(admissionPath,'utf8'));
if(admission.schema!=='AI_MEDIA_TRANSPORT_ADMISSION_RECEIPT_v1'||admission.result!=='PASS')throw new Error('ADMISSION_RECEIPT_NOT_PASS');
if(admission.sourceSha256!==expectedSha)throw new Error('ADMISSION_SOURCE_SHA_MISMATCH');
if(admission.destinationAuthorityGranted!==false||admission.genericCommandAuthority!==false)throw new Error('ADMISSION_AUTHORITY_SHAPE_INVALID');
const manifest=JSON.parse(fs.readFileSync(path.join(staging,'manifest.json'),'utf8'));
if(manifest.schema!=='AI_MEDIA_TRANSPORT_MANIFEST_v1')throw new Error('INVALID_MANIFEST');
if(manifest.sourceSha256!==expectedSha||manifest.sourceBytes!==admission.sourceBytes||manifest.partCount!==admission.partCount)throw new Error('MANIFEST_ADMISSION_MISMATCH');
let b64='';for(const p of manifest.parts){if(!/^part-\d{4}\.b64$/.test(p.name))throw new Error('INVALID_PART_NAME');const body=fs.readFileSync(path.join(staging,p.name),'utf8').trim();if(body.length!==p.chars||hash(Buffer.from(body))!==p.sha256)throw new Error(`PART_INTEGRITY_FAILURE:${p.name}`);b64+=body;}
if(b64.length!==manifest.base64Chars)throw new Error('BASE64_LENGTH_MISMATCH');
const media=Buffer.from(b64,'base64');if(media.length!==manifest.sourceBytes||hash(media)!==expectedSha)throw new Error('RECONSTRUCTION_INTEGRITY_FAILURE');
fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,media);if(hash(fs.readFileSync(destination))!==expectedSha)throw new Error('DESTINATION_WRITE_INTEGRITY_FAILURE');
let commitSha=null;
if(commitMode){const rel=path.relative(root,destination).replaceAll('\\','/');if(rel!==destinationRel)throw new Error('DESTINATION_PATH_NORMALIZATION_MISMATCH');cp.execFileSync('git',['add','--',rel],{cwd:root});const changed=cp.execFileSync('git',['diff','--cached','--name-only'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);if(changed.length!==1||changed[0]!==rel)throw new Error('UNAUTHORIZED_STAGED_PATH');cp.execFileSync('git',['commit','-m',`Materialize qualified media ${expectedSha.slice(0,12)}`],{cwd:root,stdio:'pipe'});commitSha=cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{cwd:root,encoding:'utf8'}).trim();}
const receipt={schema:'AI_MEDIA_DESTINATION_JOB_RECEIPT_v1',result:'PASS',sourceSha256:expectedSha,sourceBytes:media.length,partCount:manifest.partCount,stagingRoot:'.media-staging/awards-compass-v2/',destination:destinationRel,destinationSha256:hash(fs.readFileSync(destination)),commitMode,commitSha,changedPaths:[destinationRel],genericCommandAuthority:false,productMutationPerformed:false,deploymentPerformed:false,releasePerformed:false};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
