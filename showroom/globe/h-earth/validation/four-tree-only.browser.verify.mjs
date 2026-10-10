#!/usr/bin/env node
// Gen2638: headless WebGL2 candidate inspection (not phone qualification).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
const stage=process.argv[2],output=process.argv[3];
assert(stage&&output&&process.env.CHROME_PATH,'STAGE_OUTPUT_CHROME_REQUIRED');
assert(fs.existsSync(path.join(stage,'showroom/globe/h-earth/index.html')));
const {default:puppeteer}=await import('puppeteer-core');
const port=Number(process.env.HEARTH_TEST_PORT||41837),origin='http://127.0.0.1:'+port;
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',stage],{stdio:'ignore'});
const sleep=t=>new Promise(resolve=>setTimeout(resolve,t));
const receipt={schema:'H_EARTH_FOUR_TREE_ONLY_BROWSER_VERIFICATION_v1',result:'PENDING',views:[],headlessNotPhysicalPhone:true};
let browser=null;
try{
 let ok=false;for(let k=0;k<50;k++){try{ok=(await fetch(origin+'/showroom/globe/h-earth/')).ok;if(ok)break;}catch{}await sleep(250);}
 assert(ok,'LOCAL_STAGED_SERVER_UNAVAILABLE');
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage();await page.setViewport({width:412,height:915,isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));
 for(const spec of [{id:'clearing',query:'?arrival=approved-four-trees',x:-139.40267987050615,z:-194.5},{id:'coast',query:'',x:0,z:-96}]){
  const t=Date.now();await page.goto(origin+'/showroom/globe/h-earth/'+spec.query,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true'&&window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt?.(),{timeout:150000});
  let x=await page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getIntakeReceipt().currentNavigationState.position);
  assert(Math.abs(x.x-spec.x)<.02&&Math.abs(x.z-spec.z)<.02,'ARRIVAL_MISMATCH:'+spec.id);
  await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.vegetationResidency==='complete',{timeout:240000});
  const state=await page.evaluate(()=>({navigation:window.H_EARTH_RUN8E_PUBLIC_ROUTE.getIntakeReceipt().currentNavigationState,residency:window.H_EARTH_RUN8E_PUBLIC_ROUTE.getVegetationResidency()}));
  assert(state.residency.complete===true,'VEGETATION_INCOMPLETE');
  const canvas=await page.$('#h-earth-functional-landscape-canvas');assert(canvas,'CANVAS_MISSING');
  const screenshot=output.replace(/\.json$/,'.'+spec.id+'.png');await canvas.screenshot({path:screenshot});
  assert(fs.statSync(screenshot).size>1000,'SCREENSHOT_EMPTY');
  receipt.views.push({id:spec.id,position:state.navigation.position,groundCell:state.navigation.selectedSemanticAddressId,residentBatches:state.residency.residentBatchCount,screen:screenshot,elapsedMs:Date.now()-t});
 }
 assert.equal(pageErrors.length,0,'BROWSER_ERRORS:'+JSON.stringify(pageErrors));
 receipt.result='PASS';
}catch(e){receipt.result='FAIL';receipt.error=String(e?.stack||e);process.exitCode=1}
finally{await browser?.close();server.kill('SIGTERM');fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));}
