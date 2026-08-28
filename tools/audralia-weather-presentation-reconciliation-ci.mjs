#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';

const GOVERNING_HEAD='ef443c9e37a532447a9fe7eea1f328b2f6679f35';
const ORIGINAL='tools/audralia-weather-presentation-reconciliation-ci.mjs';
const HARNESS='tools/interaction-response/gesture-response-harness-v1.mjs';
const ADAPTER='showroom/globe/audralia/validation/audralia-gesture-response-adapter-v1.mjs';
const CONTRACT='showroom/globe/audralia/validation/audralia-gesture-response.receipt.json';
const SUCCESSOR_OPERATION='AUDRALIA_HOOK5_GESTURE_STEP_SUMMARY_RECEIPT_20260828_001';
const SUCCESSOR_GENERATION=1801;
const chrome=process.env.CHROME_PATH;
if(!chrome)throw new Error('CHROME_PATH_MISSING');

function run(command,args,{capture=false}={}){
  const result=spawnSync(command,args,{cwd:process.cwd(),env:process.env,encoding:'utf8',stdio:capture?'pipe':'inherit'});
  if(result.status!==0)throw new Error(`DIAGNOSTIC_PREREQUISITE_COMMAND_FAILED:${command}:${args.join(' ')}:${result.stderr||''}`);
  return result.stdout||'';
}

function exportFailure(error){
  const firstFailure=Object.freeze({
    schema:'AUDRALIA_GESTURE_RESPONSE_DIAGNOSTIC_RECEIPT_v1',
    result:'FAIL',
    operationId:SUCCESSOR_OPERATION,
    lockGeneration:SUCCESSOR_GENERATION,
    governingHead:GOVERNING_HEAD,
    predecessorOperationId:'AUDRALIA_HOOK5_GESTURE_READABLE_ERROR_RECEIPT_20260828_004',
    predecessorGeneration:1799,
    firstFailure:Object.freeze({
      name:String(error?.name||'Error'),
      message:String(error?.message||error),
      stack:String(error?.stack||error)
    }),
    preservation:Object.freeze({
      audraliaProductControlLawMutated:false,
      gestureLogicMutated:false,
      verifierBehavioralAssertionsMutated:false
    })
  });
  const text=JSON.stringify(firstFailure,null,2);
  fs.writeFileSync('/tmp/audralia-gesture-response-receipt.json',`${text}\n`);
  console.log('AUDRALIA_GESTURE_RESPONSE_FIRST_FAILURE_RECEIPT');
  console.log(text);
  if(process.env.GITHUB_STEP_SUMMARY){
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`\n### Audralia first browser failure\n\n\`\`\`json\n${text}\n\`\`\`\n`);
  }
}

run('git',['-c','protocol.version=2','fetch','--no-tags','--depth=1','origin',GOVERNING_HEAD]);
const originalSource=run('git',['show',`FETCH_HEAD:${ORIGINAL}`],{capture:true});
const originalPath=path.join(process.cwd(),'tools','.audralia-weather-presentation-reconciliation-governing-head.mjs');
fs.writeFileSync(originalPath,originalSource);
run(process.execPath,[originalPath]);
fs.rmSync(originalPath,{force:true});

for(const file of [HARNESS,ADAPTER,CONTRACT]){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,run('git',['show',`HEAD:${file}`],{capture:true}));
}

const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
if(contract.schema!=='AUDRALIA_GESTURE_RESPONSE_DIAGNOSTIC_RECEIPT_v1')throw new Error('GESTURE_DIAGNOSTIC_CONTRACT_SCHEMA_INVALID');
if(contract.governingHead!==GOVERNING_HEAD)throw new Error('GESTURE_DIAGNOSTIC_GOVERNING_HEAD_MISMATCH');
if(contract.productMutationAllowed!==false||contract.originalHEarthRun8EChamberMutationAllowed!==false)throw new Error('GESTURE_DIAGNOSTIC_PRESERVATION_CONTRACT_INVALID');

const {runAudraliaGestureResponseDiagnostic}=await import(`../showroom/globe/audralia/validation/audralia-gesture-response-adapter-v1.mjs?qualification=${Date.now()}`);
let browser=null;
try{
  browser=await puppeteer.launch({
    executablePath:chrome,headless:'new',
    args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader-webgl','--enable-unsafe-swiftshader']
  });
  const page=await browser.newPage();
  await page.setViewport({width:412,height:915,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  const response=await page.goto('http://127.0.0.1:4173/showroom/globe/audralia/',{waitUntil:'domcontentloaded',timeout:60000});
  if(response?.status()!==200)throw new Error(`AUDRALIA_GESTURE_PAGE_HTTP_${response?.status()}`);
  await page.waitForFunction(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true,{timeout:105000});
  const candidateHead=(process.env.GITHUB_HEAD_REF&&run('git',['ls-remote','origin',`refs/heads/${process.env.GITHUB_HEAD_REF}`],{capture:true}).trim().split(/\s+/)[0])||run('git',['rev-parse','HEAD'],{capture:true}).trim();
  const receipt=await runAudraliaGestureResponseDiagnostic(page,{candidateHead});
  if(pageErrors.length)throw new Error(`AUDRALIA_GESTURE_PAGE_ERROR:${JSON.stringify(pageErrors)}`);
  const exactReceipt=Object.freeze({...receipt,operationId:SUCCESSOR_OPERATION,lockGeneration:SUCCESSOR_GENERATION,governingHead:GOVERNING_HEAD,predecessorOperationId:contract.operationId,predecessorGeneration:contract.lockGeneration});
  fs.writeFileSync('/tmp/audralia-gesture-response-receipt.json',`${JSON.stringify(exactReceipt,null,2)}\n`);
  console.log('AUDRALIA_GESTURE_RESPONSE_DIAGNOSTIC_RECEIPT');
  console.log(JSON.stringify(exactReceipt,null,2));
  await page.close();
}catch(error){
  exportFailure(error);
  throw error;
}finally{
  if(browser)await browser.close();
}
