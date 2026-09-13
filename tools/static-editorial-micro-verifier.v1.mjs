#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const HEX40=/^[0-9a-f]{40}$/;
const STATIC_EXTENSIONS=new Set(['.html','.htm','.md','.txt','.css']);
const EXECUTABLE_EXTENSIONS=new Set(['.js','.mjs','.cjs','.ts','.tsx','.jsx','.wasm','.py','.rb','.php','.sh','.bash','.zsh','.ps1']);
const AUTHORITY_PREFIXES=['.github/','tools/','control-plane/','governance/','evidence/'];
const CSS_RUNTIME_PATTERNS=[/\bpointer-events\s*:/i,/\btouch-action\s*:/i,/\buser-select\s*:/i,/\bz-index\s*:/i,/\bdisplay\s*:/i,/\bvisibility\s*:/i,/\bposition\s*:\s*fixed/i];
const HTML_RUNTIME_ATTRIBUTE_PATTERNS={
  inlineHandlers:/\bon[a-z][a-z0-9_-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
  dataAttributes:/\bdata-[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
  javascriptUrls:/\b(?:href|src|action|formaction)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|\s*javascript:[^\s>]+)/gi
};

function die(code,detail=null){const receipt={schema:'STATIC_EDITORIAL_MICRO_VERIFICATION_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:code,detail};process.stderr.write(`${JSON.stringify(receipt,null,2)}\n`);process.exit(1);}
function run(args){const r=spawnSync('git',args,{encoding:'utf8',maxBuffer:32*1024*1024});if(r.status!==0)die('GIT_COMMAND_FAILED',`${args.join(' ')}:${r.stderr||r.stdout}`);return r.stdout;}
function normalize(p){return String(p??'').trim().replaceAll('\\','/').replace(/^\.\/+/, '');}
function parse(argv){
  if(argv.length===1&&argv[0]==='--self-test')return{selfTest:true,base:null,head:null,paths:[]};
  const out={selfTest:false,base:null,head:null,paths:[]};
  for(let i=0;i<argv.length;i+=1){
    const t=argv[i];
    if(t==='--base')out.base=argv[++i]??null;
    else if(t==='--head')out.head=argv[++i]??null;
    else if(t==='--path')out.paths.push(normalize(argv[++i]??''));
    else if(t==='--help'){process.stdout.write('Usage: node tools/static-editorial-micro-verifier.v1.mjs --base <sha> --head <sha> --path <declared-path> [--path ...]\n       node tools/static-editorial-micro-verifier.v1.mjs --self-test\n');process.exit(0);}
    else die('UNKNOWN_ARGUMENT',t);
  }
  return out;
}

function scanTags(html){
  const tags=[];
  for(let i=0;i<html.length;i+=1){
    if(html[i]!=='<')continue;
    let quote=null;
    let j=i+1;
    for(;j<html.length;j+=1){
      const ch=html[j];
      if(quote){if(ch===quote)quote=null;continue;}
      if(ch==='"'||ch==="'"){quote=ch;continue;}
      if(ch==='>'){tags.push(html.slice(i,j+1));i=j;break;}
    }
    if(j>=html.length)break;
  }
  return tags;
}
function matchAll(text,re){return [...text.matchAll(re)].map(m=>m[0]);}
function htmlRuntimeSignature(html){
  const source=String(html??'');
  const scripts=source.match(/<script\b[\s\S]*?(?:<\/script\s*>|$)/gi)??[];
  const tags=scanTags(source);
  const signature={scripts:[...scripts],inlineHandlers:[],dataAttributes:[],javascriptUrls:[]};
  for(const tag of tags){
    for(const [key,re] of Object.entries(HTML_RUNTIME_ATTRIBUTE_PATTERNS))signature[key].push(...matchAll(tag,re));
  }
  return signature;
}
function signatureDifference(base,head){
  for(const key of Object.keys(base)){
    if(JSON.stringify(base[key])!==JSON.stringify(head[key]))return{surface:key,base:base[key],head:head[key]};
  }
  return null;
}
function readAt(ref,p){
  const exists=spawnSync('git',['cat-file','-e',`${ref}:${p}`],{encoding:'utf8'});
  if(exists.status!==0)return null;
  const r=spawnSync('git',['show',`${ref}:${p}`],{encoding:'utf8',maxBuffer:32*1024*1024});
  if(r.status!==0)die('GIT_COMMAND_FAILED',`show ${ref}:${p}:${r.stderr||r.stdout}`);
  return r.stdout;
}
function verifyHtmlRuntimeInvariance(baseHead,candidateHead,p){
  const before=htmlRuntimeSignature(readAt(baseHead,p));
  const after=htmlRuntimeSignature(readAt(candidateHead,p));
  const difference=signatureDifference(before,after);
  if(difference)die('HTML_RUNTIME_DELTA_DETECTED',{path:p,...difference});
}
function selfTest(){
  const sameRuntimeBase='<article data-story="x"><h3>Old copy</h3><a href="/proof">Inspect</a><script>window.x=1;</script></article>';
  const sameRuntimeHead='<article data-story="x"><h3>New copy on the same minified line</h3><a href="/proof">Verify</a><script>window.x=1;</script></article>';
  const changedData='<article data-story="y"><h3>New copy</h3><a href="/proof">Verify</a><script>window.x=1;</script></article>';
  const changedScript='<article data-story="x"><h3>New copy</h3><a href="/proof">Verify</a><script>window.x=2;</script></article>';
  const changedHandler='<article data-story="x" onclick="go()"><h3>New copy</h3><a href="/proof">Verify</a><script>window.x=1;</script></article>';
  const changedJsUrl='<article data-story="x"><h3>New copy</h3><a href="javascript:go()">Verify</a><script>window.x=1;</script></article>';
  const sig=htmlRuntimeSignature(sameRuntimeBase);
  const checks=[
    {id:'MINIFIED_COPY_ONLY_PASSES',pass:signatureDifference(sig,htmlRuntimeSignature(sameRuntimeHead))===null},
    {id:'DATA_ATTRIBUTE_CHANGE_FAILS',pass:signatureDifference(sig,htmlRuntimeSignature(changedData))?.surface==='dataAttributes'},
    {id:'SCRIPT_CHANGE_FAILS',pass:signatureDifference(sig,htmlRuntimeSignature(changedScript))?.surface==='scripts'},
    {id:'INLINE_HANDLER_CHANGE_FAILS',pass:signatureDifference(sig,htmlRuntimeSignature(changedHandler))?.surface==='inlineHandlers'},
    {id:'JAVASCRIPT_URL_CHANGE_FAILS',pass:signatureDifference(sig,htmlRuntimeSignature(changedJsUrl))?.surface==='javascriptUrls'}
  ];
  const result=checks.every(x=>x.pass)?'PASS_CLOSED':'FAIL_CLOSED';
  process.stdout.write(`${JSON.stringify({schema:'STATIC_EDITORIAL_MICRO_VERIFIER_SELF_TEST_RECEIPT_v1',result,checks},null,2)}\n`);
  process.exit(result==='PASS_CLOSED'?0:1);
}

const args=parse(process.argv.slice(2));
if(args.selfTest)selfTest();
if(!HEX40.test(args.base??'')||!HEX40.test(args.head??''))die('INVALID_EXACT_HEAD');
if(args.paths.length===0)die('NO_DECLARED_PATHS');
const declared=[...new Set(args.paths)].sort();
for(const p of declared){const ext=path.extname(p).toLowerCase();if(AUTHORITY_PREFIXES.some(prefix=>p.startsWith(prefix)))die('AUTHORITY_SURFACE_NOT_MICRO',p);if(EXECUTABLE_EXTENSIONS.has(ext)||!STATIC_EXTENSIONS.has(ext))die('NON_STATIC_PATH_NOT_MICRO',p);}
run(['cat-file','-e',`${args.base}^{commit}`]);run(['cat-file','-e',`${args.head}^{commit}`]);
const changed=run(['diff','--name-only',args.base,args.head,'--']).split(/\r?\n/).filter(Boolean).map(normalize).sort();
if(changed.length===0)die('NO_CHANGED_PATHS');
const undeclared=changed.filter(p=>!declared.includes(p));if(undeclared.length)die('UNRELATED_DIFF',undeclared);
const missing=declared.filter(p=>!changed.includes(p));if(missing.length)die('DECLARED_PATH_NOT_CHANGED',missing);
const patch=run(['diff','--unified=0',args.base,args.head,'--',...changed]);
const addedOrRemoved=patch.split(/\r?\n/).filter(line=>(line.startsWith('+')&&!line.startsWith('+++'))||(line.startsWith('-')&&!line.startsWith('---'))).map(line=>line.slice(1));
for(const p of changed){
  const ext=path.extname(p).toLowerCase();
  if(ext==='.html'||ext==='.htm')verifyHtmlRuntimeInvariance(args.base,args.head,p);
  if(ext==='.css')for(const line of addedOrRemoved)if(CSS_RUNTIME_PATTERNS.some(re=>re.test(line)))die('CSS_RUNTIME_OR_HIT_SURFACE_DELTA_DETECTED',line);
}
const receipt={schema:'STATIC_EDITORIAL_MICRO_VERIFICATION_RECEIPT_v1',instrumentId:'STATIC_EDITORIAL_MICRO_VERIFIER_v1',result:'PASS',baseHead:args.base,candidateHead:args.head,declaredPaths:declared,changedPaths:changed,proofs:{EXACT_HEAD:true,DECLARED_PATHS_ONLY:true,NO_EXECUTABLE_RUNTIME_DELTA:true,NO_UNRELATED_DIFF:true}};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
