#!/usr/bin/env node
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const argv=process.argv.slice(2); const a={}; for(let i=0;i<argv.length;i++) if(argv[i].startsWith('--')) a[argv[i].slice(2)]=argv[++i];
const need=k=>{if(!a[k]) throw new Error(`MISSING_${k.toUpperCase().replaceAll('-','_')}`); return a[k]};
const mode=need('mode'), root=path.resolve(need('staging-dir')), allowed=path.resolve('.media-staging/awards-compass-v2');
if(!(root===allowed||root.startsWith(allowed+path.sep))) throw new Error('STAGING_PATH_NOT_AUTHORIZED');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(mode==='pack'){
 const source=path.resolve(need('source')), expected=need('expected-sha256'), data=fs.readFileSync(source);
 if(hash(data)!==expected) throw new Error('SOURCE_SHA256_MISMATCH');
 const chars=Number(a['chunk-chars']||750000); if(!Number.isSafeInteger(chars)||chars<4||chars>900000||chars%4) throw new Error('INVALID_CHUNK_CHARS');
 fs.mkdirSync(root,{recursive:true}); for(const f of fs.readdirSync(root)) if(/^part-\d{4}\.b64$/.test(f)||f==='manifest.json') fs.unlinkSync(path.join(root,f));
 const b64=data.toString('base64'), parts=[];
 for(let off=0,n=1;off<b64.length;off+=chars,n++){const body=b64.slice(off,off+chars);const name=`part-${String(n).padStart(4,'0')}.b64`;fs.writeFileSync(path.join(root,name),body+'\n');parts.push({name,chars:body.length,sha256:hash(Buffer.from(body))});}
 const m={schema:'AI_MEDIA_TRANSPORT_MANIFEST_v1',sourceBytes:data.length,sourceSha256:expected,base64Chars:b64.length,chunkChars:chars,partCount:parts.length,parts};
 fs.writeFileSync(path.join(root,'manifest.json'),JSON.stringify(m,null,2)+'\n'); console.log(JSON.stringify(m));
}else if(mode==='verify'){
 const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8')); if(m.schema!=='AI_MEDIA_TRANSPORT_MANIFEST_v1') throw new Error('INVALID_MANIFEST');
 let b64=''; for(const p of m.parts){const body=fs.readFileSync(path.join(root,p.name),'utf8').trim();if(body.length!==p.chars||hash(Buffer.from(body))!==p.sha256)throw new Error(`PART_INTEGRITY_FAILURE:${p.name}`);b64+=body;}
 if(b64.length!==m.base64Chars)throw new Error('BASE64_LENGTH_MISMATCH'); const data=Buffer.from(b64,'base64'); if(data.length!==m.sourceBytes||hash(data)!==m.sourceSha256)throw new Error('RECONSTRUCTION_INTEGRITY_FAILURE');
 if(a.output)fs.writeFileSync(path.resolve(a.output),data); console.log(JSON.stringify({schema:'AI_MEDIA_TRANSPORT_QUALIFICATION_RECEIPT_v1',result:'PASS',sourceBytes:data.length,sourceSha256:m.sourceSha256,partCount:m.partCount}));
}else throw new Error('INVALID_MODE');
