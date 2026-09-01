#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import path from 'node:path';

const argv=process.argv.slice(2),a={};for(let i=0;i<argv.length;i++)if(argv[i].startsWith('--'))a[argv[i].slice(2)]=argv[++i];
const need=k=>{if(!a[k])throw new Error(`MISSING_${k.toUpperCase().replaceAll('-','_')}`);return a[k]};
const registryPath=path.resolve(a.registry||'tools/ai-room-transport/ai-media-source-registry.v1.json');
const sourceId=need('source-id');
const localPath=path.resolve(need('local-path'));
const output=path.resolve(need('output'));
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
const source=registry.sources?.[sourceId];if(!source)throw new Error('SOURCE_ID_NOT_REGISTERED');
if(!fs.existsSync(localPath)||!fs.statSync(localPath).isFile())throw new Error('MATERIALIZED_FILE_NOT_READABLE');
const bytes=fs.statSync(localPath).size;if(bytes!==source.expectedBytes)throw new Error(`BYTE_SIZE_MISMATCH:${bytes}`);
const sha=crypto.createHash('sha256').update(fs.readFileSync(localPath)).digest('hex');if(sha!==source.expectedSha256)throw new Error(`SHA256_MISMATCH:${sha}`);
let probe;try{probe=JSON.parse(cp.execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size,format_name:stream=index,codec_type,codec_name,width,height,avg_frame_rate','-of','json',localPath],{encoding:'utf8'}));}catch{throw new Error('FFPROBE_REJECTED_MATERIALIZED_SOURCE');}
if(!probe.streams?.some(s=>s.codec_type==='video'))throw new Error('NO_VIDEO_STREAM');
const receipt={schema:'AI_MEDIA_SOURCE_MATERIALIZATION_RECEIPT_v1',result:'PASS_CLOSED',sourceId,provider:source.provider,fileId:source.fileId,fileName:source.fileName,localPath,bytes,sha256:sha,probeAccepted:true,probe,sourceBinaryAvailable:true,inlineBase64Used:false,publicDownloadSubstitutionUsed:false,genericCommandAuthority:false,destinationAuthorityGranted:false};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({schema:receipt.schema,result:receipt.result,sourceId,localPath,bytes,sha256:sha,probeAccepted:true}));
