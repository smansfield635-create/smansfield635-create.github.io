#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const HASH_PARAM='cb';
const STATIC_EXT=/\.(?:css|js|mjs)$/i;
const TEXT_EXT=/\.(?:html|css|js|mjs)$/i;
const EXCLUDED_PREFIXES=['preview/','proof-media/','node_modules/','.git/'];
const git=(args,{allowFailure=false}={})=>{const r=spawnSync('git',args,{encoding:'utf8'});if(!allowFailure&&r.status!==0)throw new Error(`git ${args.join(' ')} failed: ${r.stderr}`);return r.stdout.trim()};
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0,16);
const excluded=p=>EXCLUDED_PREFIXES.some(x=>p.startsWith(x));
const cleanPath=u=>u.split('#',1)[0].split('?',1)[0];
function resolveLocal(refFile,url){
  if(!url||/^(?:https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i.test(url))return null;
  const raw=cleanPath(url);
  const normalized=raw.startsWith('/')?raw.slice(1):path.posix.normalize(path.posix.join(path.posix.dirname(refFile),raw));
  return normalized.startsWith('../')?null:normalized;
}
function withHash(url,token){
  const [beforeHash,fragment='']=url.split('#',2);const [base,query='']=beforeHash.split('?',2);
  const params=new URLSearchParams(query);params.set(HASH_PARAM,token);
  const q=params.toString();return `${base}${q?`?${q}`:''}${fragment?`#${fragment}`:''}`;
}
function rewriteFile(file,targets){
  let text=fs.readFileSync(file,'utf8'),changed=false;
  const replaceUrl=url=>{const resolved=resolveLocal(file,url);if(!resolved||!targets.has(resolved))return url;const next=withHash(url,targets.get(resolved));if(next!==url)changed=true;return next};
  if(file.endsWith('.html'))text=text.replace(/\b(?:src|href)=(['"])([^'"]+)\1/g,(m,q,u)=>m.replace(u,replaceUrl(u)));
  if(file.endsWith('.css'))text=text.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(m,q,u)=>m.replace(u,replaceUrl(u)));
  if(/\.(?:js|mjs)$/i.test(file))text=text.replace(/(['"])(\/?(?:assets|scripts|styles)\/[^'"\s]+\.(?:css|js|mjs)(?:\?[^'"\s]*)?(?:#[^'"\s]*)?)\1/g,(m,q,u)=>`${q}${replaceUrl(u)}${q}`);
  if(changed)fs.writeFileSync(file,text);
  return changed;
}
function selfTest(){
  const a=withHash('/assets/x.js?v=old','abc123');if(a!=='/assets/x.js?v=old&cb=abc123')throw new Error('SELFTEST_APPEND');
  const b=withHash('/assets/x.js?v=old&cb=stale','fresh');if(b!=='/assets/x.js?v=old&cb=fresh')throw new Error('SELFTEST_REPLACE');
  if(resolveLocal('index.html','/assets/x.js?v=1')!=='assets/x.js')throw new Error('SELFTEST_ROOT_RESOLVE');
  if(resolveLocal('foo/index.html','../assets/x.js')!=='assets/x.js')throw new Error('SELFTEST_RELATIVE_RESOLVE');
  console.log('POST_MERGE_CACHE_IDENTITY_SELFTEST_PASS');
}
if(process.argv.includes('--self-test')){selfTest();process.exit(0)}

const base=process.env.CACHE_IDENTITY_BASE||git(['rev-parse','HEAD^1']);
const head=process.env.CACHE_IDENTITY_HEAD||git(['rev-parse','HEAD']);
if(git(['rev-parse','HEAD'])!==head)throw new Error('EXACT_HEAD_MISMATCH');
const initial=git(['diff','--name-only',`${base}...${head}`]).split(/\r?\n/).filter(Boolean).filter(p=>STATIC_EXT.test(p)&&!excluded(p)&&fs.existsSync(p));
const tracked=git(['ls-files','*.html','*.css','*.js','*.mjs']).split(/\r?\n/).filter(Boolean).filter(p=>TEXT_EXT.test(p)&&!excluded(p)&&fs.existsSync(p));
const targets=new Map(initial.map(p=>[p,sha(p)]));
const rewritten=new Set();
for(let pass=0;pass<8;pass++){
  let mutations=0;
  for(const file of tracked){
    if(rewriteFile(file,targets)){
      rewritten.add(file);mutations++;
      if(STATIC_EXT.test(file))targets.set(file,sha(file));
    }
  }
  if(!mutations)break;
  if(pass===7)throw new Error('CACHE_IDENTITY_PROPAGATION_DID_NOT_SETTLE');
}
const receipt={schema:'POST_MERGE_CACHE_IDENTITY_SYNC_RECEIPT_v1',base,head,initialChangedAssets:[...initial],rewrittenFiles:[...rewritten].sort(),assetIdentities:Object.fromEntries([...targets].sort()),result:'PASS_CLOSED'};
fs.writeFileSync(process.env.CACHE_IDENTITY_RECEIPT||'/tmp/post-merge-cache-identity.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
