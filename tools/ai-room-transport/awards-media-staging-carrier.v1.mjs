#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,x)=>{if(v.startsWith('--'))a.push([v.slice(2),x[i+1]]);return a;},[]));
const required=['source','staging-dir','expected-sha256','output'];
for(const k of required) if(!args[k]) throw new Error(`MISSING_${k.toUpperCase().replaceAll('-','_')}`);
const source=path.resolve(args.source);
const staging=path.resolve(args['staging-dir']);
const out=path.resolve(args.output);
const allowedRoot=path.resolve('.media-staging/awards-compass-v2');
if(!(staging===allowedRoot || staging.startsWith(allowedRoot+path.sep))) throw new Error('STAGING_PATH_NOT_AUTHORIZED');
const data=fs.readFileSync(source);
const sha=crypto.createHash('sha256').update(data).digest('hex');
if(sha!==args['expected-sha256']) throw new Error('SOURCE_SHA256_MISMATCH');
fs.mkdirSync(staging,{recursive:true});
const b64=data.toString('base64');
const chunkChars=Number(args['chunk-chars']||750000);
if(!Number.isSafeInteger(chunkChars)||chunkChars<4||chunkChars>900000||chunkChars%4!==0) throw new Error('INVALID_CHUNK_CHARS');
let parts=0;
for(let i=0;i<b64.length;i+=chunkChars){parts++;fs.writeFileSync(path.join(staging,`part-${String(parts).padStart(4,'0')}.b64`),b64.slice(i,i+chunkChars)+'\n','utf8');}
const receipt={schema:'AWARDS_MEDIA_STAGING_CARRIER_RECEIPT_v1',result:'PASS',sourceBytes:data.length,sourceSha256:sha,base64Chars:b64.length,partCount:parts,chunkChars,stagingDir:path.relative(process.cwd(),staging),productMutationPerformed:false,mergePerformed:false,deploymentPerformed:false};
fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n');
