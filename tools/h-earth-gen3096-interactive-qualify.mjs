#!/usr/bin/env node
/** Gen3134: first-party exact-source Copy-report and manual selection browser qualification.
 * Read-only product checkout. Never claims physical Android or GPU material attribution.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';

const PRODUCT_SHA='09967b1caa6401a91b392f4ad80f5d0d55a09806';
const output=process.env.H_EARTH_GEN3096_OUTPUT||'/tmp/h-earth-gen3096-interactive';
const product=path.resolve(process.env.H_EARTH_GEN3096_PRODUCT||'candidate');
const receipt={schema:'H_EARTH_GEN3096_INTERACTIVE_BROWSER_QUALIFICATION_RECEIPT_v1',productHead:PRODUCT_SHA,
  result:'FAIL_CLOSED',actualBrowserExecution:false,physicalAndroidAcceptance:false,ownerKeep:false,
  experienceAnchorAcceptance:false,pagesPublicationAuthorized:false,graphicsAttribution:'UNKNOWN',
  stages:[],shapes:[],screenshots:[],pageErrors:[],requestFailures:[],firstFailure:null};
const record=(name,detail={})=>{receipt.stages.push({name,detail});};
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const save=async()=>fs.writeFile(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser=null,server=null,page=null;
async function capture(name){
  const file=path.join(output,name+'.png');
  await page.screenshot({path:file,fullPage:true,timeout:45000});
  const bytes=await fs.readFile(file);
  receipt.screenshots.push({file:path.basename(file),sha256:sha(bytes),size:bytes.length});
}
async function report(){
  await page.locator('[data-copy-loading-report]').click({timeout:15000});
  await page.waitForFunction(()=>{const el=document.querySelector('[data-loading-report-text]');return el&&el.value.startsWith('{')&&el.value.includes('GRATITUDE_LOADING_REPORT_v1');},null,{timeout:30000});
  const text=await page.locator('[data-loading-report-text]').inputValue();
  const obj=JSON.parse(text);
  assert.equal(obj.schema,'GRATITUDE_LOADING_REPORT_v1');
  return obj;
}
async function select(kind){
  await page.locator('[data-selection-kind="'+kind+'"]').click({timeout:15000});
  const overlay=page.locator('[data-h-earth-manual-selection-overlay]');
  await overlay.waitFor({state:'visible',timeout:15000});
  const rect=await overlay.boundingBox();
  assert(rect&&rect.width>80&&rect.height>80,'SELECTION_OVERLAY_INVALID');
  const x=rect.x+rect.width*.34,y=rect.y+rect.height*.38;
  if(kind==='point')await page.mouse.click(x,y);
  else{
    await page.mouse.move(x,y);await page.mouse.down();
    await page.mouse.move(x+Math.min(80,rect.width*.19),y+Math.min(48,rect.height*.11),{steps:kind==='contour'?12:5});
    await page.mouse.up();
  }
  await overlay.waitFor({state:'detached',timeout:20000});
  const obj=await report();
  const scan=obj.details?.spatialManualSelection;
  assert(scan&&scan.schema==='H_EARTH_SPATIAL_SCAN_RECEIPT_v1','SELECTION_RECEIPT_MISSING_'+kind);
  assert.equal(scan.selection.kind,kind);
  assert(scan.selection.sampleCount>0&&scan.selection.sampleCount<=64,'SELECTION_SAMPLE_BOUND');
  assert.equal(scan.budget.actualGpuPasses,0);
  assert(scan.samples.every(s=>s.firstHit?.status==='UNKNOWN'&&s.materials?.status==='UNKNOWN'),'UNVERIFIED_ATTRIBUTION_INVENTED');
  receipt.shapes.push({kind,frameId:scan.frame?.frameId,samples:scan.selection.sampleCount,materialStatus:'UNKNOWN',actualGpuPasses:0});
  record('SELECTION_'+kind.toUpperCase()+'_PASS',{samples:scan.selection.sampleCount,frameId:scan.frame?.frameId});
  await capture('after-'+kind);
}
try{
  await fs.mkdir(output,{recursive:true});
  const rootIndex=path.join(product,'showroom/globe/h-earth/index.html');
  await fs.access(rootIndex);
  record('PRODUCT_CHECKOUT_REACHABLE',{productHead:PRODUCT_SHA});
  server=spawn('python3',['-m','http.server','4173','--bind','127.0.0.1','--directory',product],{stdio:['ignore','pipe','pipe']});
  server.stdout?.on('data',()=>{});server.stderr?.on('data',()=>{});
  const url='http://127.0.0.1:4173/showroom/globe/h-earth/';
  let httpReady=false;
  for(let i=0;i<90;i++){try{const r=await fetch(url);if(r.ok){httpReady=true;break;}}catch{}await wait(500);}
  assert(httpReady,'LOCAL_HTTP_SERVER_UNAVAILABLE');
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1});
  page=await context.newPage();
  page.on('pageerror',e=>receipt.pageErrors.push(String(e?.message||e)));
  page.on('requestfailed',r=>receipt.requestFailures.push({url:r.url(),reason:r.failure()}));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  receipt.actualBrowserExecution=true;record('REAL_CHROMIUM_NAVIGATION',{viewport:'1280x800'});
  await page.waitForFunction(()=>{
    const mode=document.querySelector('#h-earth-loading-screen')?.dataset.mode;
    const root=document.querySelector('#h-earth-functional-landscape-route');
    return mode==='test'||mode==='ready'||root?.dataset.run8eError==='true';
  },null,{timeout:240000});
  const state=await page.evaluate(()=>({mode:document.querySelector('#h-earth-loading-screen')?.dataset.mode,
    failed:document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'}));
  assert(!state.failed,'PRODUCT_ROUTE_REPORTED_FAILURE');
  const canvas=page.locator('#h-earth-functional-landscape-canvas');
  const bounds=await canvas.boundingBox();
  assert(bounds&&bounds.width>100&&bounds.height>100,'WORLD_CANVAS_NOT_VISIBLE');
  await capture('before-entry');
  const x=bounds.x+bounds.width*.4,y=bounds.y+bounds.height*.42;
  await page.mouse.move(x,y);await page.mouse.down();
  await page.mouse.move(x+80,y,{steps:15});await page.mouse.up();
  await page.waitForFunction(()=>{
    const b=document.querySelector('[data-enter]');
    return !!b&&!b.disabled;
  },null,{timeout:90000});
  await page.locator('[data-enter]').click({timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true',null,{timeout:30000});
  await page.locator('[data-h-earth-spatial-selection]').waitFor({state:'visible',timeout:15000});
  record('NATIVE_NAVIGATION_AND_ENTER_PASS');
  await capture('entered-with-toolbar');
  const original=await report();
  const frame=original.details?.spatialFrameEvidence;
  assert.equal(frame?.status,'CAPTURED_CPU_SUBMITTED_FRAME','COPY_REPORT_FRAME_EVIDENCE_UNAVAILABLE');
  assert(typeof frame.evidence?.frameId==='string'&&frame.evidence.frameId.startsWith('cpu-submit:'),'FRAME_ID_MISSING');
  assert.equal(frame.evidence.evidenceGrade.includes('UNVERIFIED'),true);
  record('COPY_LOADING_REPORT_PASS',{frameId:frame.evidence.frameId,clipboardStatus:await page.locator('[data-loading-report-status]').textContent()});
  await select('point');
  await select('contour');
  await select('rectangle');
  await page.locator('[data-selection-kind="contour"]').click();
  await page.locator('[data-h-earth-manual-selection-overlay]').waitFor({state:'visible'});
  await page.keyboard.press('Escape');
  await page.locator('[data-h-earth-manual-selection-overlay]').waitFor({state:'detached',timeout:15000});
  record('ESCAPE_CANCEL_RESTORES_NAVIGATION');
  await page.locator('[data-selection-kind="rectangle"]').click();
  await page.locator('[data-h-earth-manual-selection-overlay]').waitFor({state:'visible'});
  await page.getByText('Cancel selection',{exact:true}).click();
  await page.locator('[data-h-earth-manual-selection-overlay]').waitFor({state:'detached',timeout:15000});
  record('BUTTON_CANCEL_RESTORES_NAVIGATION');
  const newBounds=await canvas.boundingBox();
  const nx=newBounds.x+newBounds.width*.35,ny=newBounds.y+newBounds.height*.4;
  await page.mouse.move(nx,ny);await page.mouse.down();await page.mouse.move(nx+70,ny,{steps:12});await page.mouse.up();
  const moved=await report();
  const movedFrame=moved.details?.spatialFrameEvidence?.evidence?.frameId;
  assert(movedFrame&&movedFrame!==frame.evidence.frameId,'NAVIGATION_DID_NOT_ADVANCE_SUBMITTED_FRAME');
  record('NAVIGATION_AFTER_CANCEL_PASS',{before:frame.evidence.frameId,after:movedFrame});
  await capture('navigation-restored');
  assert.equal(receipt.shapes.length,3);
  assert.equal(receipt.pageErrors.length,0,'BROWSER_JAVASCRIPT_ERRORS');
  receipt.result='PASS_BROWSER_DESKTOP_INTERACTION_ONLY_OWNER_AND_ANDROID_PENDING';
}catch(error){
  receipt.firstFailure={name:String(error?.name||'Error'),message:String(error?.message||error),lastStage:receipt.stages.at(-1)?.name||null};
  if(page){try{await capture('first-failure');}catch{}}
  process.exitCode=1;
}finally{
  try{if(browser)await browser.close();}catch{}
  try{if(server)server.kill('SIGTERM');}catch{}
  await fs.mkdir(output,{recursive:true});
  await save();
}
