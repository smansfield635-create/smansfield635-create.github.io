#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const HASH_PARAM='cb';
const STATIC_EXT=/\.(?:css|js|mjs)$/i;
const TEXT_EXT=/\.(?:html|css|js|mjs)$/i;
const EXCLUDED_PREFIXES=['preview/','proof-media/','node_modules/','.git/'];
const SCOPE=(process.env.CACHE_IDENTITY_SCOPE||'').split(',').map(x=>x.trim()).filter(Boolean);
const inScope=p=>!SCOPE.length||SCOPE.includes(p);
const GIT_MAX_BUFFER=64*1024*1024;
const git=(args,{allowFailure=false}={})=>{const r=spawnSync('git',args,{encoding:'utf8',maxBuffer:GIT_MAX_BUFFER});if(r.error&&!allowFailure)throw new Error(`git ${args.join(' ')} execution failed: ${r.error.message}`);if(!allowFailure&&r.status!==0)throw new Error(`git ${args.join(' ')} failed: ${r.stderr||`status=${r.status}`}`);return (r.stdout||'').trim()};
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
  const replaceUrl=url=>{const resolved=resolveLocal(file,url);if(!resolved||resolved===file||!targets.has(resolved))return url;const next=withHash(url,targets.get(resolved));if(next!==url)changed=true;return next};
  if(file.endsWith('.html'))text=text.replace(/\b(?:src|href)=(['"])([^'"]+)\1/g,(m,q,u)=>m.replace(u,replaceUrl(u)));
  if(file.endsWith('.css'))text=text.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(m,q,u)=>m.replace(u,replaceUrl(u)));
  if(/\.(?:js|mjs)$/i.test(file))text=text.replace(/(['"])(\/?(?:assets|scripts|styles)\/[^'"\s]+\.(?:css|js|mjs)(?:\?[^'"\s]*)?(?:#[^'"\s]*)?)\1/g,(m,q,u)=>`${q}${replaceUrl(u)}${q}`);
  if(changed)fs.writeFileSync(file,text);
  return changed;
}
function changedStatic(base,head){
  if(!base)return [];
  return git(['diff','--name-only',`${base}...${head}`]).split(/\r?\n/).filter(Boolean).filter(p=>STATIC_EXT.test(p)&&!excluded(p)&&inScope(p)&&fs.existsSync(p));
}
function lastSuccessfulSync(head){
  return git(['log','-1','--format=%H','--fixed-strings','--grep=[cache-identity-sync]',head],{allowFailure:true});
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
const recoveryBase=lastSuccessfulSync(head);
const immediate=changedStatic(base,head);
const recovery=recoveryBase&&recoveryBase!==head?changedStatic(recoveryBase,head):[];
const initial=[...new Set([...immediate,...recovery])].sort();
const tracked=git(['ls-files']).split(/\r?\n/).filter(Boolean).filter(p=>TEXT_EXT.test(p)&&!excluded(p)&&inScope(p)&&fs.existsSync(p));
const targets=new Map(initial.map(p=>[p,sha(p)]));
const rewritten=new Set();
const passDiagnostics=[];
for(let pass=0;pass<8;pass++){
  const changedThisPass=[];
  for(const file of tracked){
    if(rewriteFile(file,targets)){
      rewritten.add(file);changedThisPass.push(file);
      if(STATIC_EXT.test(file))targets.set(file,sha(file));
    }
  }
  passDiagnostics.push(changedThisPass);
  console.log(`CACHE_IDENTITY_PASS_${pass+1}: ${JSON.stringify(changedThisPass)}`);
  if(!changedThisPass.length)break;
  if(pass===7)throw new Error(`CACHE_IDENTITY_PROPAGATION_DID_NOT_SETTLE ${JSON.stringify(passDiagnostics.slice(-3))}`);
}
const receipt={schema:'POST_MERGE_CACHE_IDENTITY_SYNC_RECEIPT_v1',base,head,recoveryBase:recoveryBase||null,scope:SCOPE.length?SCOPE:null,immediateChangedAssets:immediate,recoveryChangedAssets:recovery,initialChangedAssets:initial,rewrittenFiles:[...rewritten].sort(),passDiagnostics,assetIdentities:Object.fromEntries([...targets].sort()),result:'PASS_CLOSED'};
fs.writeFileSync(process.env.CACHE_IDENTITY_RECEIPT||'/tmp/post-merge-cache-identity.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
