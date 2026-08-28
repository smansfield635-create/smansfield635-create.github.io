#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';

const GOVERNING_HEAD='ef443c9e37a532447a9fe7eea1f328b2f6679f35';
const ORIGINAL='tools/audralia-weather-presentation-reconciliation-ci.mjs';
const HARNESS='tools/interaction-response/gesture-response-harness-v1.mjs';
const ADAPTER='showroom/globe/audralia/validation/audralia-gesture-response-adapter-v1.mjs';
const CONTRACT='showroom/globe/audralia/validation/audralia-gesture-response.receipt.json';
const chrome=process.env.CHROME_PATH;
if(!chrome)throw new Error('CHROME_PATH_MISSING');

function run(command,args,{capture=false}={}){
  const result=spawnSync(command,args,{cwd:process.cwd(),env:process.env,encoding:'utf8',stdio:capture?'pipe':'inherit'});
  if(result.status!==0)throw new Error(`DIAGNOSTIC_PREREQUISITE_COMMAND_FAILED:${command}:${args.join(' ')}:${result.stderr||''}`);
  return result.stdout||'';
}

// Preserve every assertion from the exact governing-head verifier. The candidate
// wrapper runs that immutable verifier first; diagnostic assertions are additive.
run('git',['-c','protocol.version=2','fetch','--no-tags','--depth=1','origin',GOVERNING_HEAD]);
const originalSource=run('git',['show',`FETCH_HEAD:${ORIGINAL}`],{capture:true});
const originalPath=path.join(os.tmpdir(),'audralia-weather-presentation-reconciliation-governing-head.mjs');
fs.writeFileSync(originalPath,originalSource);
run(process.execPath,[originalPath]);

// The workflow sparse index intentionally excludes diagnostic-only paths. Materialize
// them from the exact qualification tree without changing the checked-out product.
for(const file of [HARNESS,ADAPTER,CONTRACT]){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,run('git',['show',`HEAD:${file}`],{capture:true}));
}

const contract=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
if(contract.schema!=='AUDRALIA_GESTURE_RESPONSE_DIAGNOSTIC_RECEIPT_v1')throw new Error('GESTURE_DIAGNOSTIC_CONTRACT_SCHEMA_INVALID');
if(contract.governingHead!==GOVERNING_HEAD)throw new Error('GESTURE_DIAGNOSTIC_GOVERNING_HEAD_MISMATCH');
if(contract.productMutationAllowed!==false||contract.originalHEarthRun8EChamberMutationAllowed!==false)throw new Error('GESTURE_DIAGNOSTIC_PRESERVATION_CONTRACT_INVALID');

const {runAudraliaGestureResponseDiagnostic}=await import(`../showroom/globe/audralia/validation/audralia-gesture-response-adapter-v1.mjs?qualification=${Date.now()}`);
const browser=await puppeteer.launch({
  executablePath:chrome,headless:'new',
  args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});
try{
  const page=await browser.newPage();
  await page.setViewport({width:412,height:915,deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
  const response=await page.goto('http://127.0.0.1:4173/showroom/globe/audralia/',{waitUntil:'domcontentloaded',timeout:60000});
  if(response?.status()!==200)throw new Error(`AUDRALIA_GESTURE_PAGE_HTTP_${response?.status()}`);
  await page.waitForFunction(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true,null,{timeout:105000});
  const candidateHead=(process.env.GITHUB_HEAD_REF&&run('git',['ls-remote','origin',`refs/heads/${process.env.GITHUB_HEAD_REF}`],{capture:true}).trim().split(/\s+/)[0])||run('git',['rev-parse','HEAD'],{capture:true}).trim();
  const receipt=await runAudraliaGestureResponseDiagnostic(page,{candidateHead});
  if(pageErrors.length)throw new Error(`AUDRALIA_GESTURE_PAGE_ERROR:${JSON.stringify(pageErrors)}`);
  const exactReceipt=Object.freeze({...receipt,operationId:contract.operationId,lockGeneration:contract.lockGeneration,governingHead:GOVERNING_HEAD});
  fs.writeFileSync('/tmp/audralia-gesture-response-receipt.json',`${JSON.stringify(exactReceipt,null,2)}\n`);
  console.log('AUDRALIA_GESTURE_RESPONSE_DIAGNOSTIC_RECEIPT');
  console.log(JSON.stringify(exactReceipt,null,2));
  await page.close();
}finally{
  await browser.close();
}
