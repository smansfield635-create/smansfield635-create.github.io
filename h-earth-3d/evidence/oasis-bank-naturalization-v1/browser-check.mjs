import {createRequire} from 'node:module';
import fs from 'node:fs';
const {chromium}=createRequire(import.meta.url)('playwright');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
await page.goto('http://127.0.0.1:8765/showroom/globe/h-earth/',{waitUntil:'domcontentloaded'});
try{await page.waitForFunction(()=>{const r=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getReceipt();return r?.terminalFailure||r?.preparation||r?.ready;},{},{timeout:180000});}catch(e){errors.push(e.message);}
const receipt=await page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getReceipt()??null);
await page.screenshot({path:'/workspace/scratch/2c3a27a4ffe2/oasis-browser.png'});
fs.writeFileSync('/workspace/scratch/2c3a27a4ffe2/oasis-browser.json',JSON.stringify({errors,receipt},null,2));console.log(JSON.stringify({errors,receipt},null,2));await browser.close();
