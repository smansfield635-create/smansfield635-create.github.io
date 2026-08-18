#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const stable=v=>Array.isArray(v)?v.map(stable):(v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v);
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
function repositoryHead(root){try{return execFileSync('git',['-C',root,'rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{throw new Error('REPOSITORY_HEAD_UNAVAILABLE');}}
function files(root){const out=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else out.push(p);}};walk(root);return out;}
export function discoverConsumers({repoRoot,governingHead,searchRoots=['.'],tokens=[]}){
 if(!/^[0-9a-f]{40}$/.test(governingHead||'')) throw new Error('GOVERNING_HEAD_INVALID');
 if(!Array.isArray(tokens)||tokens.length===0||tokens.some(t=>typeof t!=='string'||!t)) throw new Error('TOKENS_INVALID');
 const root=path.resolve(repoRoot); const actualHead=repositoryHead(root); if(actualHead!==governingHead) throw new Error('REPOSITORY_HEAD_MISMATCH');
 const scanned=[]; const matches=[];
 for(const relRoot of searchRoots){const abs=path.resolve(root,relRoot); if(!(abs===root||abs.startsWith(root+path.sep))) throw new Error('SEARCH_ROOT_ESCAPE'); if(!fs.existsSync(abs)) continue; const candidates=fs.statSync(abs).isDirectory()?files(abs):[abs]; for(const file of candidates){let text;try{text=fs.readFileSync(file,'utf8')}catch{continue} if(text.includes('\u0000'))continue; const rel=path.relative(root,file).replaceAll(path.sep,'/');scanned.push(rel);const hit=tokens.filter(t=>text.includes(t));if(hit.length)matches.push({path:rel,tokens:hit.sort()});}}
 scanned.sort();matches.sort((a,b)=>a.path.localeCompare(b.path));const core={schema:'WORKFLOW_LIFECYCLE_CONSUMER_DISCOVERY_RECEIPT_v2',governingHead,searchRoots:[...searchRoots].sort(),tokens:[...tokens].sort(),scannedFileCount:scanned.length,scannedPathDigest:digest(scanned),matchedConsumers:matches};return stable({...core,receiptDigest:digest(core)});
}
function parse(argv){const o={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!['--request','--output'].includes(k)||v===undefined)throw new Error('CLI_ARGUMENT_INVALID');o[k.slice(2)]=v;}if(!o.request||!o.output)throw new Error('CLI_ARGUMENT_INCOMPLETE');return o;}
function main(){const a=parse(process.argv.slice(2));const q=JSON.parse(fs.readFileSync(path.resolve(a.request),'utf8'));const r=discoverConsumers(q);fs.mkdirSync(path.dirname(path.resolve(a.output)),{recursive:true});fs.writeFileSync(path.resolve(a.output),JSON.stringify(r,null,2)+'\n');}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{main()}catch(e){process.stderr.write(JSON.stringify({schema:'WORKFLOW_LIFECYCLE_CONSUMER_DISCOVERY_FAILURE_v2',result:'FAIL_CLOSED',errorCode:e.message})+'\n');process.exitCode=1;}}
