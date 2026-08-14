#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const HEX40=/^[0-9a-f]{40}$/;
const DEVICES=Object.freeze([
  {id:'DESKTOP',width:1440,height:900,hasTouch:false},
  {id:'TABLET',width:1024,height:768,hasTouch:true},
  {id:'PHONE',width:390,height:844,hasTouch:true}
]);
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const canonical=v=>JSON.stringify(stable(v));
const digest=v=>crypto.createHash('sha256').update(Buffer.from(typeof v==='string'?v:canonical(v),'utf8')).digest('hex');

export function classify(input={}){
  if(input.authorityValid!==true)return{result:'EVIDENCE_INCOMPLETE',failureClass:'GOVERNANCE_AUTHORITY_FAILURE',nextDisposition:'STOP_AND_REVALIDATE_AUTHORITY'};
  if(input.executionComplete!==true)return input.instrumentFailed===true
    ?{result:'EVIDENCE_INCOMPLETE',failureClass:'INSTRUMENT_FAILURE',nextDisposition:'REPAIR_EXECUTOR_SEPARATELY_AND_RERUN_UNCHANGED_CANDIDATE'}
    :{result:'EVIDENCE_INCOMPLETE',failureClass:'EVIDENCE_INCOMPLETE',nextDisposition:'FAIL_CLOSED_UNTIL_COMPLETE_EVIDENCE_EXISTS'};
  if((input.seriousOrCriticalViolations??0)>0||input.keyboardFocusPass!==true||input.accessibilityTreePass!==true||input.runtimePass!==true)
    return{result:'FAIL_CLOSED',failureClass:'PRODUCT_FAILURE',nextDisposition:'RETURN_TO_AUTHORIZED_PRODUCT_CONSTRUCTION_THEN_NEW_SHA_AND_FULL_REQUALIFICATION'};
  return{result:'PASS_CLOSED',failureClass:null,nextDisposition:'RETURN_EVIDENCE_TO_PRIVATE_QUALIFICATION_SAME_EXACT_SHA'};
}

function parse(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!['--candidate-sha','--entry-path','--base-url','--output'].includes(k)||v==null)throw new Error(`CLI_ARGUMENT_INVALID:${k}`);out[k.slice(2)]=v}for(const k of['candidate-sha','entry-path','base-url','output'])if(!out[k])throw new Error(`CLI_ARGUMENT_MISSING:${k}`);return out}
function normalizeViolations(list){return(list??[]).map(v=>stable({id:v.id,impact:v.impact??'unknown',tags:[...(v.tags??[])].sort(),nodeCount:v.nodes?.length??0,targets:(v.nodes??[]).flatMap(n=>n.target??[]).map(String).sort()})).sort((a,b)=>`${a.impact}:${a.id}`.localeCompare(`${b.impact}:${b.id}`))}

async function executeDevice(browser,url,device){
  const context=await browser.newContext({viewport:{width:device.width,height:device.height},hasTouch:device.hasTouch});
  const page=await context.newPage();const fatal=[],consoleErrors=[];
  page.on('pageerror',e=>fatal.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  try{
    await page.goto(url,{waitUntil:'networkidle',timeout:45000});
    const axe=await new AxeBuilder({page}).analyze();
    const violations=normalizeViolations(axe.violations);
    const seriousOrCriticalViolations=violations.filter(v=>v.impact==='serious'||v.impact==='critical').reduce((s,v)=>s+v.nodeCount,0);
    const cdp=await context.newCDPSession(page);await cdp.send('Accessibility.enable');const ax=await cdp.send('Accessibility.getFullAXTree');
    const nodes=Array.isArray(ax?.nodes)?ax.nodes:[];const meaningful=nodes.filter(n=>!n.ignored&&typeof n.role?.value==='string'&&!['none','generic'].includes(n.role.value));
    const focusable=await page.locator('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])').evaluateAll(es=>es.filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return!e.disabled&&s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0}).length);
    await page.evaluate(()=>document.activeElement?.blur());const trace=[];for(let i=0;i<Math.min(Math.max(focusable,1),24);i++){await page.keyboard.press('Tab');trace.push(await page.evaluate(()=>{const e=document.activeElement;if(!e||e===document.body)return'BODY';return`${e.tagName}:${e.id||''}:${e.getAttribute?.('aria-label')||e.textContent?.trim().slice(0,80)||''}`}))}
    const distinct=new Set(trace.filter(x=>x!=='BODY')).size;const keyboardPass=focusable===0||distinct>0;const axPass=meaningful.length>0;const runtimePass=fatal.length===0&&consoleErrors.length===0;
    return stable({device:device.id,viewport:device,axeExecuted:true,accessibilityTreeExecuted:true,keyboardExecuted:true,violations,seriousOrCriticalViolations,accessibilityTree:{totalNodes:nodes.length,meaningfulNodes:meaningful.length,roleNameDigest:digest(meaningful.map(n=>[n.role?.value??null,n.name?.value??null]))},keyboard:{focusableCount:focusable,distinctFocusedCount:distinct,traceDigest:digest(trace),pass:keyboardPass},fatalRuntimeErrors:fatal,consoleErrors,runtimePass,pass:seriousOrCriticalViolations===0&&keyboardPass&&axPass&&runtimePass});
  }finally{await context.close()}
}

function build({candidateSha,entryPath,baseUrl,deviceResults,executionComplete,instrumentFailed,instrumentError=null}){
  const authorityValid=HEX40.test(candidateSha??'')&&typeof entryPath==='string'&&entryPath.startsWith('/');
  const seriousOrCriticalViolations=deviceResults.reduce((s,r)=>s+(r.seriousOrCriticalViolations??0),0);
  const keyboardFocusPass=executionComplete&&deviceResults.every(r=>r.keyboard?.pass===true);
  const accessibilityTreePass=executionComplete&&deviceResults.every(r=>r.accessibilityTree?.meaningfulNodes>0);
  const runtimePass=executionComplete&&deviceResults.every(r=>r.runtimePass===true);
  const disposition=classify({authorityValid,executionComplete,instrumentFailed,seriousOrCriticalViolations,keyboardFocusPass,accessibilityTreePass,runtimePass});
  const evidence=stable({candidateSha,entryPath,engines:{browser:'PLAYWRIGHT_CHROMIUM',accessibility:'AXE_CORE_PLAYWRIGHT',accessibilityTree:'CHROMIUM_CDP_ACCESSIBILITY_GET_FULL_AX_TREE'},deviceMatrix:DEVICES.map(d=>d.id),deviceResults,executionComplete,seriousOrCriticalViolations,keyboardFocusPass,accessibilityTreePass,runtimePass});
  return stable({schema:'ACCESSIBILITY_RUNTIME_EVIDENCE_RECEIPT_v1',version:'1.0.0',producer:'PUBLIC_ACCESSIBILITY_RUNTIME_EVIDENCE_EXECUTOR_20260814_001',candidateSha,entryPath,baseUrlDigest:digest(baseUrl),result:disposition.result,failureClass:disposition.failureClass,nextDisposition:disposition.nextDisposition,realBrowserExecuted:executionComplete,axeExecuted:executionComplete&&deviceResults.every(r=>r.axeExecuted),accessibilityTreeExecuted:executionComplete&&deviceResults.every(r=>r.accessibilityTreeExecuted),keyboardExecuted:executionComplete&&deviceResults.every(r=>r.keyboardExecuted),evidence,evidenceDigest:digest(evidence),instrumentError,authorityBoundary:{evidenceProducerOnly:true,privateQualificationAuthorityPreserved:true,productMutationAuthorized:false,repositoryMutationAuthorizedByReceipt:false,authorityCreationAuthorized:false,mergeAuthorized:false,deploymentAuthorized:false,promotionAuthorized:false,ownerAcceptanceCreated:false},qualificationContinuity:{qualificationLayerMayMutateProduct:false,changedCandidateRequiresNewSha:true,priorExactShaEvidenceTransfersToChangedCandidate:false,productFailureRequiresAuthorizedReconstructionThenFullRequalification:true}});
}

export async function run({candidateSha,entryPath,baseUrl}){
  if(!HEX40.test(candidateSha??'')||typeof entryPath!=='string'||!entryPath.startsWith('/'))return build({candidateSha,entryPath,baseUrl,deviceResults:[],executionComplete:false,instrumentFailed:false});
  let browser;const results=[];try{browser=await chromium.launch({headless:true});for(const d of DEVICES)results.push(await executeDevice(browser,baseUrl,d));return build({candidateSha,entryPath,baseUrl,deviceResults:results,executionComplete:results.length===DEVICES.length,instrumentFailed:false})}catch(e){return build({candidateSha,entryPath,baseUrl,deviceResults:results,executionComplete:false,instrumentFailed:true,instrumentError:String(e?.stack??e)})}finally{await browser?.close()}}

async function main(){const a=parse(process.argv.slice(2));const receipt=await run({candidateSha:a['candidate-sha'],entryPath:a['entry-path'],baseUrl:a['base-url']});fs.mkdirSync(path.dirname(path.resolve(a.output)),{recursive:true});fs.writeFileSync(path.resolve(a.output),JSON.stringify(receipt,null,2)+'\n');process.stdout.write(JSON.stringify(receipt)+'\n');if(receipt.result!=='PASS_CLOSED')process.exitCode=receipt.failureClass==='PRODUCT_FAILURE'?2:receipt.failureClass==='INSTRUMENT_FAILURE'?3:receipt.failureClass==='GOVERNANCE_AUTHORITY_FAILURE'?5:4}
if(process.argv[1]&&path.resolve(process.argv[1])===new URL(import.meta.url).pathname)main().catch(e=>{process.stderr.write(String(e?.stack??e)+'\n');process.exitCode=3});
