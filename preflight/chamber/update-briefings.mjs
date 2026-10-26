#!/usr/bin/env node
// Prepare a public display record only. Source review and release remain separate.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {safeEvidenceUrl} from './presentation-guard.mjs';

const SCHEMA='DGB_PROJECT_BRIEFINGS_v1';
const FACTS=['accomplishment','publication','unfinished','blocker','nextStep'];
const BASES=new Set(['VERIFIED_RECORD','REPORTED_RESULT','PROPOSED_NEXT_STEP','NOT_ESTABLISHED']);
const SECRET=/github_pat_|gh[pousr]_[A-Za-z0-9]{20}|sk-proj-|-----BEGIN .*PRIVATE KEY|Bearer\s+[A-Za-z0-9._-]{20}/;
function requireValue(ok,message){if(!ok)throw Error(message);}
function fields(value,allowed,label){
 requireValue(value&&typeof value==='object'&&!Array.isArray(value),label+' must be an object');
 requireValue(Object.keys(value).every(k=>allowed.includes(k))&&allowed.every(k=>Object.hasOwn(value,k)),label+' has missing or non-display fields');
}
function text(value,label){requireValue(typeof value==='string'&&value.trim().length>0&&value.length<=20000&&!SECRET.test(value),label+' is empty, too long, or contains credentials');}
function timestamp(value,nowMs,label){
 requireValue(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value),label+' must be a UTC timestamp');
 const ms=Date.parse(value);
 requireValue(Number.isFinite(ms)&&new Date(ms).toISOString().slice(0,19)===value.slice(0,19)&&ms<=nowMs+300000,label+' is invalid or in the future');
 return ms;
}
function fact(value,label){
 fields(value,['text','basis','sources'],label);text(value.text,label+'.text');
 requireValue(BASES.has(value.basis),label+' has an invalid proof basis');
 requireValue(Array.isArray(value.sources)&&(value.sources.length>0||value.basis==='NOT_ESTABLISHED'),label+' requires evidence');
 for(const source of value.sources){
  fields(source,['label','url'],label+'.source');text(source.label,'source label');text(source.url,'source URL');
  const url=safeEvidenceUrl(source.url);
  requireValue(url&&url===source.url,label+' requires an exact credential-free GitHub evidence URL without query parameters');
 }
}
export function validateBriefings(feed,{nowMs=Date.now()}={}){
 requireValue(Number.isFinite(nowMs),'Invalid validation clock');
 fields(feed,['schema','updatedAt','records'],'briefings');requireValue(feed.schema===SCHEMA,'Wrong briefing schema');
 if(feed.updatedAt!==null)timestamp(feed.updatedAt,nowMs,'updatedAt');
 requireValue(Array.isArray(feed.records)&&feed.records.length<=100,'Invalid briefing population');
 const ids=new Set();
 for(const r of feed.records){
  fields(r,['projectId','observedAt','sourceHeads',...FACTS,'instruments'],'record');
  requireValue(typeof r.projectId==='string'&&/^[A-Z][A-Z0-9_]{1,79}$/.test(r.projectId)&&!ids.has(r.projectId),'Invalid or duplicate project identity');ids.add(r.projectId);
  timestamp(r.observedAt,nowMs,r.projectId+'.observedAt');
  requireValue(Array.isArray(r.sourceHeads)&&r.sourceHeads.length>0,'Missing source heads');
  const repos=new Set();
  for(const source of r.sourceHeads){
   fields(source,['repository','head'],'source head');
   requireValue(typeof source.repository==='string'&&/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source.repository)&&!repos.has(source.repository),'Invalid or duplicate source repository');repos.add(source.repository);
   requireValue(typeof source.head==='string'&&/^[0-9a-f]{40}$/.test(source.head),'Source head must be an exact commit');
  }
  for(const key of FACTS)fact(r[key],r.projectId+'.'+key);
  requireValue(r.nextStep.basis==='PROPOSED_NEXT_STEP'||r.nextStep.basis==='NOT_ESTABLISHED','Next step must remain proposed or not established');
  requireValue(Array.isArray(r.instruments),'Invalid instruments');
  for(const instrument of r.instruments){fields(instrument,['name','use','result'],'instrument');text(instrument.name,'instrument name');text(instrument.use,'instrument use');fact(instrument.result,'instrument result');}
 }
 return feed;
}
export function prepareBriefingUpdate(feed,record,{nowMs=Date.now(),allowNew=false}={}){
 validateBriefings(feed,{nowMs});
 validateBriefings({schema:SCHEMA,updatedAt:null,records:[record]},{nowMs});
 const previous=feed.records.find(r=>r.projectId===record.projectId);
 requireValue(previous||allowNew,'Unknown project identity; explicitly allow a new project after identity reconciliation');
 requireValue(!previous||Date.parse(record.observedAt)>=Date.parse(previous.observedAt),'Older source observation cannot replace a newer record');
 if(previous&&isDeepStrictEqual(previous,record))return structuredClone(feed);
 requireValue(feed.updatedAt===null||nowMs>=Date.parse(feed.updatedAt),'Packaging clock precedes existing update');
 const next=structuredClone(feed);
 if(previous)next.records[next.records.findIndex(r=>r.projectId===record.projectId)]=structuredClone(record);
 else next.records.push(structuredClone(record));
 next.updatedAt=new Date(nowMs).toISOString();
 return validateBriefings(next,{nowMs});
}
function main(){
 const args=process.argv.slice(2),options={};
 for(let i=0;i<args.length;i++){
  const key=args[i];requireValue(['--input','--output','--base','--allow-new'].includes(key)&&!Object.hasOwn(options,key),'Unknown or duplicate option');
  if(key==='--allow-new')options[key]=true;
  else {requireValue(args[i+1]&&!args[i+1].startsWith('--'),'Missing option value');options[key]=args[++i];}
 }
 requireValue(options['--input']&&options['--output'],'Usage: node preflight/chamber/update-briefings.mjs --input reviewed-record.json --output candidate-briefings.json [--base briefing-feed.json] [--allow-new]');
 const base=path.resolve(options['--base']||fileURLToPath(new URL('./data/briefings.json',import.meta.url)));
 const input=path.resolve(options['--input']),output=path.resolve(options['--output']);
 requireValue(output!==base&&output!==input,'Output must be a separate candidate file');
 const next=prepareBriefingUpdate(JSON.parse(fs.readFileSync(base,'utf8')),JSON.parse(fs.readFileSync(input,'utf8')),{allowNew:options['--allow-new']===true});
 fs.writeFileSync(output,JSON.stringify(next,null,2)+'\n',{flag:'wx'});
 process.stdout.write('Prepared '+output+'. Review the diff, update the manifest hash, test, and use the existing release process.\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{main();}catch(error){process.stderr.write(error.message+'\n');process.exitCode=1;}
}
