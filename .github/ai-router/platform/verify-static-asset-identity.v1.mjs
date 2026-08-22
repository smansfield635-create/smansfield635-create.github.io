import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const base=process.env.STATIC_IDENTITY_BASE||process.argv[2];
const head=process.env.STATIC_IDENTITY_HEAD||process.argv[3]||'HEAD';
if(!base) throw new Error('STATIC_IDENTITY_BASE_REQUIRED');
const git=(args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const changed=git(['diff','--name-only',`${base}...${head}`]).split('\n').filter(Boolean);
const assetRe=/\.(?:js|mjs|css|json|webmanifest|svg|png|jpe?g|webp|avif|gif|woff2?|mp4|webm)$/i;
const pageRe=/\.(?:html|htm|js|mjs|css)$/i;
const changedAssets=changed.filter(p=>assetRe.test(p)&&!p.startsWith('.github/')&&!p.startsWith('docs/')&&!p.startsWith('preview/'));
const candidatePages=changed.filter(p=>pageRe.test(p)&&!p.startsWith('.github/')&&!p.startsWith('docs/')&&!p.startsWith('preview/'));

const show=(ref,path)=>{try{return git(['show',`${ref}:${path}`]);}catch{return '';}};
const exists=(ref,path)=>{try{git(['cat-file','-e',`${ref}:${path}`]);return true;}catch{return false;}};
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const refs=(text,path)=>{
  const target='/'+path.replace(/^\.\//,'');
  const re=new RegExp(esc(target)+'(?:\\?[^"\'\\s)<>]*)?','g');
  return [...text.matchAll(re)].map(m=>m[0]);
};
const isConsumer=(page,asset)=>{
  if(page===asset)return false;
  if(!pageRe.test(page))return false;
  return exists(head,page);
};

const violations=[];
const evidence=[];
for(const asset of changedAssets){
  const searchPaths=new Set();
  for(const p of candidatePages){if(isConsumer(p,asset))searchPaths.add(p);}
  // Root and same-directory HTML are authoritative loader candidates only when they actually exist.
  for(const p of ['index.html',asset.split('/').slice(0,-1).concat('index.html').join('/')]){
    if(isConsumer(p,asset))searchPaths.add(p);
  }
  for(const page of searchPaths){
    const before=show(base,page),after=show(head,page);
    const beforeRefs=refs(before,asset),afterRefs=refs(after,asset);
    if(!afterRefs.length) continue;
    const beforeSet=new Set(beforeRefs),fresh=afterRefs.some(r=>!beforeSet.has(r));
    evidence.push({asset,page,beforeRefs,afterRefs,fresh,consumerAuthority:true});
    if(beforeRefs.length&&!fresh) violations.push({asset,page,requestIdentity:afterRefs});
  }
}
const receipt={schema:'STATIC_ASSET_IDENTITY_GATE_v1',base,head,changedAssets,evidence,violations,result:violations.length?'STALE_ASSET_IDENTITY_BLOCKED':'PASS'};
console.log(JSON.stringify(receipt,null,2));
if(violations.length) process.exit(1);
