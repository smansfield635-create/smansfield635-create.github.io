#!/usr/bin/env node
import fs from 'node:fs';
const argv=process.argv.slice(2);const a={};for(let i=0;i<argv.length;i++)if(argv[i].startsWith('--'))a[argv[i].slice(2)]=argv[++i];
const need=k=>{if(!a[k])throw new Error(`MISSING_${k.toUpperCase().replaceAll('-','_')}`);return a[k]};
const sha=need('source-sha256');const bytes=Number(need('source-bytes'));const parts=Number(need('part-count'));const manifestSha=need('manifest-sha256');const holder=need('execution-holder');const output=need('output');
if(!/^[0-9a-f]{64}$/.test(sha)||!/^[0-9a-f]{64}$/.test(manifestSha))throw new Error('INVALID_SHA256');
if(!Number.isSafeInteger(bytes)||bytes<1||bytes>1073741824)throw new Error('INVALID_SOURCE_BYTES');
if(!Number.isSafeInteger(parts)||parts<1||parts>4096)throw new Error('INVALID_PART_COUNT');
if(!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(holder))throw new Error('INVALID_EXECUTION_HOLDER');
const receipt={schema:'AI_MEDIA_TRANSPORT_ADMISSION_RECEIPT_v1',result:'PASS',executionHolder:holder,sourceSha256:sha,sourceBytes:bytes,partCount:parts,manifestSha256:manifestSha,stagingRoot:'.media-staging/awards-compass-v2/',destinationAuthorityGranted:false,productMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,genericCommandAuthority:false};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n','utf8');
