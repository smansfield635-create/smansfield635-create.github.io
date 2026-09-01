#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const HEX40=/^[0-9a-f]{40}$/;
const STATIC_EXTENSIONS=new Set(['.html','.htm','.md','.txt','.css']);
const EXECUTABLE_EXTENSIONS=new Set(['.js','.mjs','.cjs','.ts','.tsx','.jsx','.wasm','.py','.rb','.php','.sh','.bash','.zsh','.ps1']);
const AUTHORITY_PREFIXES=['.github/','tools/','control-plane/','governance/','evidence/'];
const HTML_RUNTIME_PATTERNS=[/<script\b/i,/\bon[a-z]+\s*=/i,/javascript\s*:/i,/\bdata-[a-z0-9_-]+\s*=/i];
const CSS_RUNTIME_PATTERNS=[/\bpointer-events\s*:/i,/\btouch-action\s*:/i,/\buser-select\s*:/i,/\bz-index\s*:/i,/\bdisplay\s*:/i,/\bvisibility\s*:/i,/\bposition\s*:\s*fixed/i];
function die(code,detail=null){const receipt={schema:'STATIC_EDITORIAL_MICRO_VERIFICATION_RECEIPT_v1',result:'FAIL_CLOSED',errorCode:code,detail};process.stderr.write(`${JSON.stringify(receipt,null,2)}\n`);process.exit(1);}
function run(args){const r=spawnSync('git',args,{encoding:'utf8'});if(r.status!==0)die('GIT_COMMAND_FAILED',`${args.join(' ')}:${r.stderr||r.stdout}`);return r.stdout;}
function normalize(p){return String(p??'').trim().replaceAll('\\','/').replace(/^\.\/+/, '');}
function parse(argv){const out={base:null,head:null,paths:[]};for(let i=0;i<argv.length;i+=1){const t=argv[i];if(t==='--base')out.base=argv[++i]??null;else if(t==='--head')out.head=argv[++i]??null;else if(t==='--path')out.paths.push(normalize(argv[++i]??''));else if(t==='--help'){process.stdout.write('Usage: node tools/static-editorial-micro-verifier.v1.mjs --base <sha> --head <sha> --path <declared-path> [--path ...]\n');process.exit(0);}else die('UNKNOWN_ARGUMENT',t);}return out;}
const args=parse(process.argv.slice(2));
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
for(const p of changed){const ext=path.extname(p).toLowerCase();if(ext==='.html'||ext==='.htm'){for(const line of addedOrRemoved)if(HTML_RUNTIME_PATTERNS.some(re=>re.test(line)))die('HTML_RUNTIME_DELTA_DETECTED',line);}if(ext==='.css'){for(const line of addedOrRemoved)if(CSS_RUNTIME_PATTERNS.some(re=>re.test(line)))die('CSS_RUNTIME_OR_HIT_SURFACE_DELTA_DETECTED',line);}}
const receipt={schema:'STATIC_EDITORIAL_MICRO_VERIFICATION_RECEIPT_v1',instrumentId:'STATIC_EDITORIAL_MICRO_VERIFIER_v1',result:'PASS',baseHead:args.base,candidateHead:args.head,declaredPaths:declared,changedPaths:changed,proofs:{EXACT_HEAD:true,DECLARED_PATHS_ONLY:true,NO_EXECUTABLE_RUNTIME_DELTA:true,NO_UNRELATED_DIFF:true}};
process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
