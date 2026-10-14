// Operations Chamber public-safe rolling-study bridge.
// Private source data stay exclusively in memory on the existing GitHub runner.
// This module extends four already-approved display files; it creates no new host.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export const PRIVATE_REPO='smansfield635-create/geodiametrics1';
export const SOURCE_BRANCH='ops-chamber-study-checkpoint-v1';
export const DATA_PATH='tools/private-public-bridge/standalone/study/runtime/dashboard-data.v1.json';
export const RECEIPT_PATH='tools/private-public-bridge/standalone/study/runtime/dashboard-projection-receipt.v1.json';
export const OUTPUT_SCHEMA='DGB_CHAMBER_PUBLIC_SAFE_AGGREGATE_v1';
export const QUALIFIED_STUDY_SOURCE='8759b71e068737f6954de1f17af78e5da706266a';
export const PINNED_UI_INDEX='3b958cecfddb33cf98ffe43a40f936629f343f97';
export const PINNED_UI_MODULE='45c2f6c1d23fe487b109ad8e3c26af82caf92eea';
const hex40=/^[0-9a-f]{40}$/;
const hex64=/^[0-9a-f]{64}$/;
const fail=code=>{const error=new Error(code);error.code=code;throw error};
const stable=x=>Array.isArray(x)?x.map(stable):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,stable(x[k])])):x;
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(stable(x))).digest('hex');
const gitObjectId=s=>{const b=Buffer.from(s,'utf8');return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex')};
const exact=(x,names)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join('|')===names.slice().sort().join('|');
const utc=s=>typeof s==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString()===new Date(Date.parse(s)).toISOString();
const qty=n=>Number.isSafeInteger(n)&&n>=0&&n<=10_000_000;

export function extractSummary(data,receipt){
  if(!data||data.schema!=='DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1'||!hex64.test(receipt?.projectionDigest))fail('PROJECTION_SCHEMA_OR_DIGEST_INVALID');
  if(digest(data)!==receipt.projectionDigest)fail('PROJECTION_DIGEST_MISMATCH');
  if(receipt.schema!=='DGB_PRIVATE_STUDY_DASHBOARD_PROJECTION_RECEIPT_v1'||receipt.result!=='PRIVATE_PROJECTION_PREPARED_NOT_HOSTED'||receipt.sourceHead!==QUALIFIED_STUDY_SOURCE||receipt.hostedPublicationVerified!==false||receipt.publicRawDataExported!==false||receipt.displayedThrough!==null)fail('SOURCE_RECEIPT_INVALID');
  if(!hex40.test(receipt.checkpointHead)||!utc(receipt.savedThrough)||!utc(receipt.projectionObservedAt)||Date.parse(receipt.savedThrough)>Date.parse(receipt.projectionObservedAt)+120000)fail('PROJECTION_TIME_INVALID');
  if(receipt.cycleReceipt?.result!=='SAVED_AND_VERIFIED'||receipt.cycleReceipt.head!==receipt.checkpointHead||receipt.cycleReceipt.savedThrough!==receipt.savedThrough)fail('CHECKPOINT_NOT_VERIFIED');
  const s=data.rollingStudy;
  if(s?.measurement!=='AUTOMATED_BASELINE_WITH_PRESERVED_CORRECTIONS'||s.through!==receipt.savedThrough||s.checkpoint?.commit!==receipt.checkpointHead||s.checkpoint?.savedThrough!==receipt.savedThrough||!Array.isArray(s.cohorts)||s.cohorts.length!==2)fail('ROLLING_STUDY_MISMATCH');
  const repos=new Set(s.cohorts.map(x=>x.repository));
  if(repos.size!==2||!repos.has('smansfield635-create/geodiametrics1')||!repos.has('smansfield635-create/smansfield635-create.github.io'))fail('COHORT_REPOSITORY_MISMATCH');
  const classified=s.cohorts.reduce((n,x)=>{if(!qty(x.total)||!qty(x.UNRESOLVED))fail('COUNT_INVALID');return n+x.total},0);
  const unresolved=s.cohorts.reduce((n,x)=>n+x.UNRESOLVED,0);
  const reviews=s.reviewedCount,auditFlags=s.auditFlagCount;
  if(![classified,unresolved,reviews,auditFlags].every(qty)||unresolved>classified||reviews>classified||auditFlags>classified)fail('COUNT_CONTRADICTION');
  return {schema:OUTPUT_SCHEMA,savedThrough:receipt.savedThrough,capturedAt:receipt.projectionObservedAt,metrics:{classified,unresolved,reviews,auditFlags}};
}

export function validatePublicSummary(s){
  if(!exact(s,['schema','savedThrough','capturedAt','metrics'])||s.schema!==OUTPUT_SCHEMA||!utc(s.savedThrough)||!utc(s.capturedAt)||!exact(s.metrics,['classified','unresolved','reviews','auditFlags'])||!Object.values(s.metrics).every(qty)||s.metrics.unresolved>s.metrics.classified||s.metrics.reviews>s.metrics.classified||s.metrics.auditFlags>s.metrics.classified)return false;
  return true;
}

const STUDY_CARD=`const rolling=current.rollingStudySummary;const box=$('rolling-summary');if(box){const valid=rolling&&rolling.schema==='DGB_CHAMBER_PUBLIC_SAFE_AGGREGATE_v1'&&rolling.metrics&&['classified','unresolved','reviews','auditFlags'].every(k=>Number.isSafeInteger(rolling.metrics[k])&&rolling.metrics[k]>=0&&rolling.metrics[k]<=10000000)&&Number.isFinite(Date.parse(rolling.savedThrough))&&Number.isFinite(Date.parse(rolling.capturedAt))&&rolling.metrics.unresolved<=rolling.metrics.classified&&rolling.metrics.reviews<=rolling.metrics.classified&&rolling.metrics.auditFlags<=rolling.metrics.classified;const age=valid?Date.now()-Date.parse(rolling.savedThrough):Infinity;const status=valid?(age>=-120000&&age<35*60000?'Recent saved checkpoint':'Older saved checkpoint'):'Source unavailable';box.innerHTML=valid?'<span class="badge '+(status.startsWith('Recent')?'good':'warning')+'">'+status+'</span><h3 class="study-total">'+rolling.metrics.classified.toLocaleString()+' classified PRs</h3><p>Saved through '+esc(new Date(rolling.savedThrough).toLocaleString())+'. These are automated classifications with preserved review corrections; not a productivity or operational-health certification.</p><div class="statrow"><div class="stat"><div class="value">'+rolling.metrics.unresolved+'</div><div class="label">Unresolved</div></div><div class="stat"><div class="value">'+rolling.metrics.reviews+'</div><div class="label">Source reviews</div></div><div class="stat"><div class="value">'+rolling.metrics.auditFlags+'</div><div class="label">Audit flags</div></div></div>':'<p>Current verified rolling study unavailable. Historical study remains below.</p>';}`;

export function integratePublicDisplay({index,module,publicData,summary}){
  if(gitObjectId(index)!==PINNED_UI_INDEX||gitObjectId(module)!==PINNED_UI_MODULE)fail('UNQUALIFIED_UI_SOURCE');
  if(!validatePublicSummary(summary))fail('PUBLIC_SUMMARY_INVALID');
  if(publicData?.schema!=='DGB_OPERATIONS_CHAMBER_DASHBOARD_DATA_v1'||publicData?.commandsEnabled!==false||!Array.isArray(publicData.projects)||!publicData.study||!utc(publicData.observedAt))fail('EXISTING_DISPLAY_INVALID');
  const anchor='<div class="panel" id="study"></div>';
  if(index.split(anchor).length!==2)fail('INDEX_MARKER_NOT_UNIQUE');
  const scriptAnchor='const study=current.study;';
  if(module.split(scriptAnchor).length!==2)fail('MODULE_MARKER_NOT_UNIQUE');
  const nextIndex=index.replace(anchor,'<div class="panel" id="rolling-summary"><p>Loading the verified rolling-study summary…</p></div>'+anchor);
  const nextModule=module.replace(scriptAnchor,STUDY_CARD+scriptAnchor);
  return {index:nextIndex,module:nextModule,data:{...publicData,rollingStudySummary:summary}};
}

async function github(pathname,token){
  const response=await fetch(`https://api.github.com/repos/${PRIVATE_REPO}/${pathname}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'DGB-Public-Safe-Rolling-Study/1'},redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok)fail('SOURCE_UNAVAILABLE');
  const raw=await response.text();if(raw.length>2_800_000)fail('SOURCE_TOO_LARGE');
  try{return JSON.parse(raw)}catch{fail('SOURCE_NOT_JSON')}
}
export async function authenticatedSnapshot(token){
  if(!token||typeof token!=='string')fail('SOURCE_AUTH_UNAVAILABLE');
  const ref=()=>github(`git/ref/heads/${SOURCE_BRANCH}`,token);
  const first=await ref(),head=first?.object?.sha;
  if(!hex40.test(head))fail('SOURCE_REF_INVALID');
  async function file(relative){
    const x=await github(`contents/${relative}?ref=${head}`,token);
    if(x?.encoding!=='base64'||!hex40.test(x.sha)||typeof x.content!=='string')fail('SOURCE_BLOB_INVALID');
    const decoded=Buffer.from(x.content.replace(/\s/g,''),'base64').toString('utf8');
    if(gitObjectId(decoded)!==x.sha)fail('SOURCE_BLOB_IDENTITY_MISMATCH');
    try{return JSON.parse(decoded)}catch{fail('SOURCE_JSON_INVALID')}
  }
  const [data,receipt]=await Promise.all([file(DATA_PATH),file(RECEIPT_PATH)]);
  if((await ref())?.object?.sha!==head)fail('SOURCE_REF_MOVED_RETRY_NEXT_CYCLE');
  return extractSummary(data,receipt);
}

export async function main(){
  const dir=process.env.CHAMBER_SITE_DIR;
  if(!dir)fail('SITE_DIR_REQUIRED');
  const token=process.env.PRIVATE_GITHUB_TOKEN;
  const summary=await authenticatedSnapshot(token);
  const file=n=>path.join(dir,n);
  const [index,module,raw]=await Promise.all(['index.html','dashboard.mjs','data.json'].map(n=>fs.readFile(file(n),'utf8')));
  let data;try{data=JSON.parse(raw)}catch{fail('DISPLAY_JSON_INVALID')}
  const next=integratePublicDisplay({index,module,publicData:data,summary});
  await fs.writeFile(file('index.html'),next.index);
  await fs.writeFile(file('dashboard.mjs'),next.module);
  await fs.writeFile(file('data.json'),JSON.stringify(next.data,null,2)+'\n');
  console.log(JSON.stringify({schema:'DGB_CHAMBER_PUBLIC_SAFE_DELIVERY_RECEIPT_v1',result:'PUBLIC_SAFE_PAYLOAD_PREPARED',classified:summary.metrics.classified,rawPrivateDataExported:false}));
}
if(process.argv[1]&&import.meta.url===new URL('file://'+path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.code||'PUBLIC_SAFE_PREPARATION_FAILED');process.exitCode=1});