#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const REQUEST_SCHEMA='L2_CONTROL_PLANE_OBSERVABILITY_REQUEST_v1';
export const EVENT_SCHEMA='L2_CONTROL_PLANE_OBSERVATION_EVENT_v1';
export const RECEIPT_SCHEMA='L2_CONTROL_PLANE_STATE_RECEIPT_v1';
const STATUSES=new Set(['ADMITTED','CONSTRUCTING','PASS_CLOSED','FAIL_CLOSED','STOP','SUPERSEDED']);
const LANES=new Set(['L1_PRODUCT','L2_CONTROL_PLANE','L3_LAWS']);
const SHA40=/^[0-9a-f]{40}$/;const SHA256=/^[0-9a-f]{64}$/;
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const digest=v=>crypto.createHash('sha256').update(JSON.stringify(stable(v))).digest('hex');
const boundary={authorityCreated:false,sourceEvidenceRewritten:false,mergeAuthorityCreated:false,repositoryMutationAuthorityCreated:false,repositorySettingsAuthorityCreated:false,rulesetActivationAuthorityCreated:false,hEarthAuthorityCreated:false,lawsAuthorityCreated:false};
function fail(code,reasons=[]){return stable({schema:RECEIPT_SCHEMA,result:'FAIL_CLOSED',errorCode:code,reasons,operations:[],contradictionCount:0,...boundary});}
function validEvent(e){return obj(e)&&e.schema===EVENT_SCHEMA&&typeof e.eventId==='string'&&e.eventId.length>0&&typeof e.operationId==='string'&&e.operationId.length>0&&Number.isInteger(e.sequence)&&e.sequence>=0&&LANES.has(e.lane)&&STATUSES.has(e.status)&&SHA40.test(e.subjectHead??'')&&SHA256.test(e.evidenceDigest??'');}
export function projectControlPlaneState(input){
  if(!obj(input)||input.schema!==REQUEST_SCHEMA||!Array.isArray(input.events))return fail('OBSERVABILITY_REQUEST_SCHEMA_INVALID',['REQUEST_OR_EVENTS_INVALID']);
  const before=digest(input.events);
  if(input.events.some(e=>!validEvent(e)))return fail('OBSERVATION_EVENT_INVALID',['EVENT_SCHEMA_OR_FIELD_INVALID']);
  const ids=input.events.map(e=>e.eventId);if(new Set(ids).size!==ids.length)return fail('DUPLICATE_EVENT_ID',['EVENT_ID_MUST_BE_UNIQUE']);
  const groups=new Map();for(const e of input.events){if(!groups.has(e.operationId))groups.set(e.operationId,[]);groups.get(e.operationId).push(e);}
  const operations=[];let contradictionCount=0;
  for(const [operationId,events] of [...groups.entries()].sort(([a],[b])=>a.localeCompare(b))){
    const ordered=[...events].sort((a,b)=>a.sequence-b.sequence||a.eventId.localeCompare(b.eventId));
    const latestSequence=Math.max(...ordered.map(e=>e.sequence));
    const latest=ordered.filter(e=>e.sequence===latestSequence);
    const statuses=[...new Set(latest.map(e=>e.status))].sort();
    const contradiction=statuses.length>1;if(contradiction)contradictionCount+=1;
    operations.push(stable({operationId,latestSequence,currentStatus:contradiction?'CONTRADICTED':statuses[0],contradiction,alternativeStatuses:contradiction?statuses:[],eventIds:ordered.map(e=>e.eventId),sourceEvidenceDigests:ordered.map(e=>e.evidenceDigest),lanes:[...new Set(ordered.map(e=>e.lane))].sort(),heads:[...new Set(ordered.map(e=>e.subjectHead))].sort()}));
  }
  const after=digest(input.events);if(before!==after)return fail('SOURCE_EVIDENCE_MUTATION_DETECTED',['PROJECTOR_MUTATED_INPUT']);
  return stable({schema:RECEIPT_SCHEMA,result:'PASS_CLOSED',errorCode:null,eventCount:input.events.length,operationCount:operations.length,contradictionCount,operations,sourceEventDigest:before,sourceEvidenceRewritten:false,contradictionsPreserved:true,...boundary});
}
function args(argv){const o={};for(let i=0;i<argv.length;i+=2){if(!argv[i]?.startsWith('--')||argv[i+1]===undefined)throw Error('CLI_ARGUMENT_INVALID');o[argv[i].slice(2)]=argv[i+1];}return o;}
const direct=()=>process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(direct()){try{const a=args(process.argv.slice(2));const input=JSON.parse(fs.readFileSync(a.input,'utf8'));const receipt=projectControlPlaneState(input);fs.writeFileSync(a.output,JSON.stringify(receipt,null,2)+'\n');if(receipt.result!=='PASS_CLOSED')process.exitCode=3;}catch(error){const r=fail(error.message||'OBSERVABILITY_EXCEPTION',['PROJECTOR_EXCEPTION']);const i=process.argv.indexOf('--output');if(i>=0&&process.argv[i+1])fs.writeFileSync(process.argv[i+1],JSON.stringify(r,null,2)+'\n');else process.stderr.write(JSON.stringify(r)+'\n');process.exitCode=1;}}
