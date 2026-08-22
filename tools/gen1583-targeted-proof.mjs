import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.env.PROOF_BASE || 'http://127.0.0.1:4173';
const out = '.qualification/gen1583-targeted';
fs.mkdirSync(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:412,height:915},deviceScaleFactor:1});
const errors=[]; const failed=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('requestfailed',r=>failed.push(`${r.method()} ${r.url()} :: ${r.failure()?.errorText||'failed'}`));

await page.goto(`${base}/`,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForFunction(()=>globalThis.DGB_COMPASS_CONTROLLER?.requestCardinalSelection,{timeout:30000});
await page.waitForTimeout(800);
const opened=await page.evaluate(()=>globalThis.DGB_COMPASS_CONTROLLER.requestCardinalSelection('south'));
if(opened===false) throw new Error('SOUTH_CLUSTER_OPEN_REJECTED');
await page.waitForFunction(()=>document.querySelector('[data-compass-root]')?.dataset.compassMode==='CLUSTER_OPEN',{timeout:5000});
await page.waitForTimeout(700);

const visibleInfo=await page.evaluate(()=>{
  const visible=el=>{if(!el)return false;const c=getComputedStyle(el),r=el.getBoundingClientRect();return !el.hidden&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity||1)>.05&&r.width>1&&r.height>1;};
  const projected=[...document.querySelectorAll('.compass-projected-room-label')].filter(visible).map(e=>e.textContent?.trim()||'');
  const cardinal=[...document.querySelectorAll('.compass-object--wing>span')].filter(visible).map(e=>e.textContent?.trim()||'');
  const pseudo=[];
  for(const el of document.querySelectorAll('button[data-compass-room-proxy]')){
    const c=getComputedStyle(el,'::after'), content=c.content||'';
    if(content&&content!=='none'&&content!=='normal'&&content!=='""'&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity||1)>.05) pseudo.push({room:el.dataset.roomId||'',content});
  }
  return {mode:document.querySelector('[data-compass-root]')?.dataset.compassMode||'',projected,cardinal,pseudo,frame:globalThis.DGB_COMPASS_CONTROLLER.getFrameState()};
});
if(visibleInfo.mode!=='CLUSTER_OPEN') throw new Error(`CLUSTER_MODE_INVALID ${JSON.stringify(visibleInfo)}`);
if(visibleInfo.projected.length!==1) throw new Error(`PROJECTED_LABEL_COUNT_INVALID ${JSON.stringify(visibleInfo)}`);
if(visibleInfo.pseudo.length!==0) throw new Error(`PSEUDO_LABEL_VISIBLE ${JSON.stringify(visibleInfo)}`);
if(visibleInfo.cardinal.length!==0) throw new Error(`CARDINAL_LABEL_RESIDUE ${JSON.stringify(visibleInfo)}`);
await page.screenshot({path:path.join(out,'cluster-label-phone.png')});

const roomId=visibleInfo.frame?.cluster?.primaryRoom;
if(!roomId) throw new Error(`PRIMARY_ROOM_MISSING ${JSON.stringify(visibleInfo.frame)}`);
const selected=await page.evaluate(id=>globalThis.DGB_COMPASS_CONTROLLER.requestRoomSelection(id),roomId);
if(selected===false) throw new Error(`ROOM_SELECTION_REJECTED ${roomId}`);
await page.waitForFunction(()=>document.querySelector('[data-compass-root]')?.dataset.compassMode==='ROOM_SELECTED',{timeout:5000});
await page.waitForTimeout(500);
const selectedLabels=await page.evaluate(()=>{
  const visible=el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return !el.hidden&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity||1)>.05&&r.width>1&&r.height>1;};
  return [...document.querySelectorAll('.compass-projected-room-label')].filter(visible).map(e=>e.textContent?.trim()||'');
});
if(selectedLabels.length!==1) throw new Error(`ROOM_SELECTED_LABEL_COUNT_INVALID ${JSON.stringify(selectedLabels)}`);

await page.goto(`${base}/showroom/globe/h-earth/`,{waitUntil:'domcontentloaded',timeout:120000});
await page.waitForTimeout(1200);
const demo=await page.evaluate(()=>({
  title:document.title,
  coast:document.body.innerText.includes('The coast is the entrance.'),
  path:location.pathname,
  redirectedCarrier:location.pathname.includes('h-earth-live-6d18e158'),
  canvas:Boolean(document.getElementById('h-earth-functional-landscape-canvas')),
  integrationSrc:document.getElementById('h-earth-current-run8e-module')?.getAttribute('src')||''
}));
if(!demo.coast||demo.redirectedCarrier||!demo.canvas) throw new Error(`H_EARTH_PUBLIC_DEMO_INVALID ${JSON.stringify(demo)}`);
await page.waitForFunction(()=>Boolean(globalThis.H_EARTH_MEDIA_AUDIO),{timeout:30000});
const audioBefore=await page.evaluate(()=>({version:globalThis.H_EARTH_MEDIA_AUDIO?.version||'',delivery:globalThis.H_EARTH_MEDIA_AUDIO?.delivery||'',started:globalThis.H_EARTH_MEDIA_AUDIO?.started??null}));
if(!audioBefore.version.includes('H_EARTH_MEDIA_AUDIO_23949')||!audioBefore.delivery) throw new Error(`H_EARTH_AUDIO_API_INVALID ${JSON.stringify(audioBefore)}`);
await page.mouse.click(200,200);
await page.waitForTimeout(700);
const audioAfter=await page.evaluate(()=>({started:globalThis.H_EARTH_MEDIA_AUDIO?.started??null,muted:globalThis.H_EARTH_MEDIA_AUDIO?.muted??null,activeRole:globalThis.H_EARTH_MEDIA_AUDIO?.activeRole||''}));
await page.screenshot({path:path.join(out,'h-earth-demo-phone.png')});

const result={result:'PASS_CLOSED',cluster:visibleInfo,selectedLabels,demo,audioBefore,audioAfter,errors,failed};
fs.writeFileSync(path.join(out,'receipt.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
await browser.close();
