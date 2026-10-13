#!/usr/bin/env node
// Public runner transport; original normalizeRun/partition remain private. Never
// publishes private source or raw workflow records to public repository/artifacts.
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';

const PRIVATE='smansfield635-create/geodiametrics1';
const PUBLIC='smansfield635-create/smansfield635-create.github.io';
const HEAD='8578824669d41f542f375741c5fec4a5a08d4329';
const BASELINE='a6ed141170b596f5204e104f3526413ce65b26ad';
const PR=748;
const ROOT=resolve('private-source');
const SOURCE=resolve(ROOT,'tools/private-public-bridge/operations-chamber-run-history.v1.mjs');
const CONTINUATION=resolve(ROOT,'tools/private-public-bridge/standalone/history/continuation.v1.json');
const FIELDS=['id','name','path','head_branch','head_sha','run_number','event','status','conclusion','created_at','updated_at','run_started_at','run_attempt','workflow_id'];
const DICT=['name','path','head_branch','head_sha','event','status','conclusion'];
const fail=m=>{throw new Error(m)};
const key=(r,w)=>[r,w.from,w.through,w.page].join(':');
const iso=n=>new Date(n*1000).toISOString().replace('.000Z','Z');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const api=async(path,token,options={})=>{
 if(!/^\/repos\/smansfield635-create\/(?:geodiametrics1|smansfield635-create\.github\.io)\//.test(path))fail('SOURCE_OR_DESTINATION_NOT_ALLOWLISTED');
 const method=options.method||'GET';
 for(let attempt=0;attempt<6;attempt++){
  const r=await fetch('https://api.github.com'+path,{method,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28',...(method==='POST'?{'Content-Type':'application/json'}:{})},body:options.body&&JSON.stringify(options.body)});
  if((r.status===429||r.status===502||r.status===503||r.status===504)&&attempt<5){const after=Number(r.headers.get('retry-after'));await sleep(Number.isFinite(after)&&after>0?Math.min(after*1000,60000):(attempt+1)*4000);continue;}
  if(!r.ok)fail(`GITHUB_HTTP_${r.status}_${method}_${path.split('?')[0]}`);
  return r.json();
 }
 fail('GITHUB_RETRY_EXHAUSTED');
};

export function document(pages){
 const dictionaries=Object.fromEntries(DICT.map(f=>[f,[]]));
 const maps=Object.fromEntries(DICT.map(f=>[f,new Map()]));
 const result=pages.map(p=>{
  const rows=p.runs.map(r=>FIELDS.map(f=>{
   let v=r[f]??null;
   if(!maps[f])return v;
   if(!maps[f].has(v)){maps[f].set(v,dictionaries[f].length);dictionaries[f].push(v);}
   return maps[f].get(v);
  }));
  return {from:p.from,through:p.through,total:p.total,page:p.page,observedAt:p.observedAt,url:p.url,rowCount:rows.length,rows};
 });
 return {schema:'DGB_CHAMBER_OPERATIONAL_RUN_PAGE_GET_ESCROW_v1',repository:PUBLIC,candidateHead:BASELINE,sourcePublisher:{kind:'GITHUB_APP',appId:Number(process.env.PRIVATE_APP_ID)},fields:FIELDS,dictionaryFields:DICT,dictionaries,pages:result,errors:[],archiveMutation:false,qualification:'AUTHENTICATED_PRIVATE_SOURCE_ESCROW_NOT_ARCHIVE'};
}

async function main(){
 if(process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!==PUBLIC||process.env.GITHUB_REF!=='refs/heads/gen653-source-traversal-20261012')fail('PUBLIC_EXACT_RUNNER_ONLY');
 if(!process.env.PRIVATE_APP_TOKEN||!process.env.PUBLIC_ACTIONS_TOKEN)fail('TOKENS_REQUIRED');
 const privateToken=process.env.PRIVATE_APP_TOKEN, publicToken=process.env.PUBLIC_ACTIONS_TOKEN;
 const appId=Number(process.env.PRIVATE_APP_ID);if(!Number.isSafeInteger(appId)||appId<=0)fail('PRIVATE_APP_ID_UNVERIFIED');
 const trustedComment=c=>c.user?.login==='smansfield635-create'||(c.user?.type==='Bot'&&Number(c.performed_via_github_app?.id)===appId);
 const {normalizeRun,partition,REPOSITORIES}=await import(pathToFileURL(SOURCE));
 if(REPOSITORIES[0]!==PRIVATE||REPOSITORIES[1]!==PUBLIC)fail('SOURCE_REPOSITORY_SET_DRIFT');
 const continuation=JSON.parse(await readFile(CONTINUATION,'utf8'));
 if(continuation.schema!=='DGB_OPERATIONAL_HISTORY_CONTINUATION_v1'||continuation.through!=='2026-10-12T02:38:57Z')fail('SOURCE_CUTOFF_CHANGED');
 const exact=await api(`/repos/${PRIVATE}/git/ref/heads/ops-chamber-operational-history-20261012`,privateToken);
 if(exact.object?.sha!==HEAD)fail('PRIVATE_CANDIDATE_HEAD_MOVED');
 const ledgerFile=await api(`/repos/${PRIVATE}/contents/.github/operation-intake/active-operation-ledger.v1.json?ref=operation-locks%2Frepository-operation-intake-v1`,privateToken);
 const ledger=JSON.parse(Buffer.from(ledgerFile.content.replace(/\s/g,''),'base64').toString('utf8'));
 const lock=Object.values(ledger.activeScopes||{}).find(x=>x.operationId==='DGB_CHAMBER_OPERATIONAL_HISTORY_COMPLETION_20261012_001_S1');
 if(lock?.state!=='ADMITTED_LOCKED'||lock?.released!==false||lock?.lockGeneration!==653)fail('SOURCE_ESCROW_OPERATION_NOT_ADMITTED');
 const mainRef=await api(`/repos/${PRIVATE}/git/ref/heads/main`,privateToken);
 if(mainRef.object?.sha!=='4a3d78ab251bea3d7d4bc77e81e04349a4db4663')fail('GOVERNING_HEAD_CHANGED');

 const pageKeys=new Set(continuation.pages.map(p=>key(p.repository,p)));
 const committedPages=pageKeys.size;
 let commentPage=1, existingComments=0;
 for(;;commentPage++){
  const cs=await api(`/repos/${PRIVATE}/issues/${PR}/comments?per_page=100&page=${commentPage}`,privateToken);
  if(!Array.isArray(cs))fail('INVALID_COMMENT_LIST');
  for(const c of cs){
   if(!trustedComment(c)||!c.body?.includes('DGB_CHAMBER_OPERATIONAL_RUN_PAGE_GET_ESCROW_v1'))continue;
   const block=c.body.match(/```json\s*\n([\s\S]*?)\n```/i);if(!block)continue;
   const d=JSON.parse(block[1]);
   if(d.schema!=='DGB_CHAMBER_OPERATIONAL_RUN_PAGE_GET_ESCROW_v1'||d.repository!==PUBLIC||d.candidateHead!==BASELINE||!Array.isArray(d.pages))continue;
   for(const p of d.pages){if(!Number.isInteger(p.from)||!Number.isInteger(p.through)||!Number.isInteger(p.page)||p.page<1||!Array.isArray(p.rows))fail('EXISTING_ESCROW_INVALID');pageKeys.add(key(PUBLIC,p));}
   existingComments++;
  }
  if(cs.length<100)break;
  if(commentPage>40)fail('COMMENT_TRAVERSAL_BOUND');
 }
 const pending=continuation.pending.filter(p=>p.repository===PUBLIC).map(p=>({...p}));
 const unfinishedPrivate=continuation.pending.filter(p=>p.repository===PRIVATE&&!pageKeys.has(key(PRIVATE,p)));
 // Only the public cohort is automated here. Private cohort's pending requests
 // are separately saved in the existing pinned private escrows, not re-published.
 const pendingKeys=new Set(pending.map(p=>key(PUBLIC,p)));
 const savedKeys=new Set(), savedIds=[],knownWindows=new Map(continuation.windows.filter(w=>w.repository===PUBLIC).map(w=>[[w.from,w.through].join(':'),w.total]));
 let buffered=[], requests=0, newPages=0, newRows=0, saturated=0, readback=0;
 const maxRequests=Number(process.env.MAX_SOURCE_REQUESTS||3000);
 const deadline=Date.now()+Number(process.env.MAX_RUNTIME_MINUTES||155)*60*1000;
 if(!Number.isInteger(maxRequests)||maxRequests<1||maxRequests>3000)fail('BOUNDED_REQUEST_LIMIT_INVALID');
 const flush=async()=>{
  if(!buffered.length)return;
  const doc=document(buffered);
  const body=`Gen653 automatic public-cohort source escrow | retained API cutoff 2026-10-12T02:38:57Z | historical recovery only.\n\n\`\`\`json\n${JSON.stringify(doc)}\n\`\`\`\n\nNo source, archive, private branch, or production mutation. Verified source pages awaiting governed private import.`;
  if(body.length>60000)fail('COMMENT_PAYLOAD_TOO_LARGE');
  const out=await api(`/repos/${PRIVATE}/issues/${PR}/comments`,privateToken,{method:'POST',body:{body}});
  if(!out.id||!out.html_url?.includes('/pull/748#issuecomment-'))fail('ESCROW_RESULT_INVALID');
  const check=await api(`/repos/${PRIVATE}/issues/comments/${out.id}`,privateToken);
  if(check.body!==body||!trustedComment(check)||check.id!==out.id)fail('PRIVATE_ESCROW_READBACK_FAILURE');
  savedIds.push(out.id);readback++;
  for(const p of buffered){pageKeys.add(key(PUBLIC,p));savedKeys.add(key(PUBLIC,p));newPages++;newRows+=p.runs.length;}
  buffered=[];
  await sleep(1300); // bounded secondary-rate-limit pressure
 };

 const enqueue=(p)=>{
  const k=key(PUBLIC,p);
  if(!pageKeys.has(k)&&!pendingKeys.has(k)){pending.push(p);pendingKeys.add(k);}
 };
 for(let i=0;i<pending.length;i++){
  if(Date.now()>deadline||requests>=maxRequests)break;
  const w=pending[i],k=key(PUBLIC,w);
  if(pageKeys.has(k))continue;
  if(w.attempt){fail('PUBLIC_MISSING_ATTEMPT_REQUIRES_SEPARATE_ATTEMPT_ESCROW');}
  const url=`/repos/${PUBLIC}/actions/runs?created=${encodeURIComponent(iso(w.from)+'..'+iso(w.through))}&per_page=100&page=${w.page}`;
  const d=await api(url,publicToken);requests++;
  if(!Number.isSafeInteger(d.total_count)||d.total_count<0||!Array.isArray(d.workflow_runs))fail('INVALID_RUN_SOURCE');
  const windowKey=[w.from,w.through].join(':');
  if(knownWindows.has(windowKey)&&knownWindows.get(windowKey)!==d.total_count)fail('WINDOW_SOURCE_DRIFT');
  if(w.page===1&&d.total_count>=900){
   const pair=partition(iso(w.from),iso(w.through));saturated++;
   for(const [from,through] of pair)enqueue({repository:PUBLIC,from:Date.parse(from)/1000,through:Date.parse(through)/1000,page:1});
   continue;
  }
  const observedAt=new Date().toISOString();
  const normalized=d.workflow_runs.map(r=>normalizeRun(r,PUBLIC,observedAt));
  const expected=Math.min(100,Math.max(0,d.total_count-100*(w.page-1)));
  if(normalized.length!==expected)fail('SOURCE_PAGE_ROW_COUNT_DRIFT');
  for(const row of normalized){const at=Date.parse(row.created_at)/1000;if(at<w.from||at>w.through)fail('OUT_OF_SOURCE_WINDOW');}
  knownWindows.set(windowKey,d.total_count);
  const item={...w,total:d.total_count,url:'https://api.github.com'+url,observedAt,runs:normalized};
  if(buffered.length&&JSON.stringify(document([...buffered,item])).length>47000)await flush();
  if(JSON.stringify(document([item])).length>55000)fail('SINGLE_SOURCE_PAGE_TOO_LARGE');
  buffered.push(item);
  // Trigger complete pagination even for windows that were not in the old pending list.
  if(w.page===1){for(let page=2;page<=Math.ceil(d.total_count/100);page++)enqueue({...w,page});}
  if(JSON.stringify(document(buffered)).length>43000)await flush();
 }
 await flush();
 const remaining=pending.filter(w=>!pageKeys.has(key(PUBLIC,w))).length;
 const result={schema:'DGB_GEN653_PUBLIC_SOURCE_ESCROW_TRAVERSAL_v1',result:remaining===0?'SOURCE_ESCROW_COHORT_EXHAUSTED':'CHECKPOINTED_PARTIAL',fixedCutoff:'2026-10-12T02:38:57Z',originalPublicPending:continuation.pending.filter(p=>p.repository===PUBLIC).length,originalPrivatePending:continuation.pending.filter(p=>p.repository===PRIVATE).length,existingEscrowComments:existingComments,committedPageCount:committedPages,additionalSourceRequests:requests,saturatedWindowsSplit:saturated,verifiedNewPages:newPages,verifiedNewRunRows:newRows,privateEscrowCommentsCommitted:readback,privateEscrowCommentIds:savedIds,remainingPublicSourceRequests:remaining,privateArchiveWritten:false,privateCodePublished:false,dashboardActivated:false};
  // Return only a redacted count+IDs to the publicly visible job summary.
  const publicReceipt={...result,privateEscrowCommentIds:undefined};
  console.log(JSON.stringify(publicReceipt));
  if(process.env.GITHUB_STEP_SUMMARY){const {appendFile}=await import('node:fs/promises');await appendFile(process.env.GITHUB_STEP_SUMMARY,`## Gen653 source-only traversal\n\nResult: **${result.result}**\n\nVerified new run records: **${newRows}** over ${newPages} pages.\n\nPrivate source comments: ${readback}; pending public source requests: ${remaining}.\n\nNo private archive, code or product mutation.\n`);}
  const privateSummary=`Gen653 unattended public-runner source-escrow traversal result (fixed cutoff 2026-10-12T02:38:57Z).\n\n\`\`\`json\n${JSON.stringify(result)}\n\`\`\`\n\nSource GET and private issue comments only. No archival, source, workflow, merge or deployment authority is claimed.`;
  await api(`/repos/${PRIVATE}/issues/${PR}/comments`,privateToken,{method:'POST',body:{body:privateSummary}});
  if(remaining)process.exitCode=2;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(JSON.stringify({result:'FAIL_CLOSED',error:String(e.message||e)}));process.exitCode=1});
