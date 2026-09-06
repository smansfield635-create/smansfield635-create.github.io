#!/usr/bin/env node
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import {runAudraliaTravelSpatialConsistencyDiagnostic} from '../showroom/globe/audralia/validation/audralia-gesture-response-adapter-v1.mjs';

const CANDIDATE='87214524d795fac747117f60c5dc148271bd8206';
const OUTPUT='/tmp/audralia-travel-spatial-consistency-receipt.json';
const base=process.env.AUDRALIA_BASE_URL||'http://127.0.0.1:4173';
const chrome=process.env.CHROME_PATH;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function preserve(receipt){
  fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);
  console.log(JSON.stringify(receipt,null,2));
  return receipt;
}

function apparatusOnly(error,stage){
  const receipt=Object.freeze({
    schema:'AUDRALIA_TWO_FINGER_TRAVEL_SPATIAL_CONSISTENCY_RECEIPT_v1',
    result:'APPARATUS_ONLY',candidateHead:CANDIDATE,stage,
    error:String(error?.stack||error),
    productFailureEstablished:false,
    blockingAuthority:false,
    nextAction:'USE_AVAILABLE_OWNER_VISIBLE_OR_BROWSER_SURFACE;DO_NOT_OPEN_APPARATUS_REPAIR_SUCCESSOR'
  });
  preserve(receipt);
  process.exitCode=0;
}

if(!chrome){
  apparatusOnly('CHROME_PATH_MISSING','BROWSER_LAUNCH_INPUT');
}else{
  let browser=null;
  try{
    browser=await puppeteer.launch({
      executablePath:chrome,
      headless:'new',
      args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
    });
    const page=await browser.newPage();
    await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
    await page.goto(`${base}/showroom/globe/audralia/`,{waitUntil:'domcontentloaded',timeout:60000});
    const started=Date.now();
    let last=null;
    while(Date.now()-started<105000){
      last=await page.evaluate(()=>({
        ready:Boolean(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.renderer?.getSnapshot?.()),
        error:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null,
        status:document.querySelector('[data-h-earth-status]')?.dataset?.status||null
      }));
      if(last.error)throw new Error(`AUDRALIA_RUNTIME_UNAVAILABLE:${JSON.stringify(last.error)}`);
      if(last.ready)break;
      await sleep(250);
    }
    if(!last?.ready)throw new Error(`AUDRALIA_RUNTIME_NOT_READY:${JSON.stringify(last)}`);
    const receipt=await runAudraliaTravelSpatialConsistencyDiagnostic(page,{candidateHead:CANDIDATE});
    preserve(receipt);
    if(receipt.result==='PRODUCT_FAULT_ESTABLISHED'){
      throw new Error(`AUDRALIA_DEFINITIVE_TRAVEL_FAULT:${receipt.firstDefinitiveFault}`);
    }
  }catch(error){
    if(String(error?.message||error).startsWith('AUDRALIA_DEFINITIVE_TRAVEL_FAULT:'))throw error;
    apparatusOnly(error,'BROWSER_OR_RUNTIME_APPARATUS');
  }finally{
    await browser?.close().catch(()=>{});
  }
}
