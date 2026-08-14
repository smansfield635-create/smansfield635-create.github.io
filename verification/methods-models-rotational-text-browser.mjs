import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ORIGIN=process.env.METHODS_MODELS_ORIGIN||'http://127.0.0.1:4173';
const CHROME_PATH=process.env.CHROME_PATH;
const EXECUTION_COMMIT=process.env.EXECUTION_COMMIT||'UNKNOWN';
if(!CHROME_PATH) throw new Error('CHROME_PATH_REQUIRED');
const route=`${ORIGIN}/laws/research/methods-and-models/`;
const OUT='methods-models-rendered-evidence'; fs.mkdirSync(OUT,{recursive:true});
const PROFILES=[['DESKTOP',1440,1000],['TABLET_PORTRAIT',900,1100],['TABLET_LANDSCAPE',1180,820],['MOBILE_PORTRAIT',390,844]];
const browser=await puppeteer.launch({executablePath:CHROME_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const evidence=[]; const failures=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function ready(page){await page.waitForFunction(()=>document.documentElement.dataset.mmRotationalTextStatus==='ready',{timeout:15000});await sleep(500);}
async function snap(page,profile,state){const file=path.join(OUT,`${profile}-${state}.png`);await page.screenshot({path:file,fullPage:true});evidence.push({profile,state,file});}
async function metrics(page){return page.evaluate(()=>{
 const all=[...document.querySelectorAll('body *')];
 const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
 const escaped=all.filter(e=>visible(e)).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,cls:String(e.className||''),text:(e.textContent||'').trim().slice(0,80),left:r.left,right:r.right,top:r.top,bottom:r.bottom};}).filter(r=>r.left<-3||r.right>innerWidth+3);
 const tabs=[...document.querySelectorAll('[data-mm-family-tabs] .mm-family-tab')].map((e,i)=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{i,text:e.textContent.trim(),selected:e.getAttribute('aria-selected')==='true',depth:e.dataset.mmOrbitDepth||'',vector:e.dataset.mmOrbitVector||'',left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,opacity:Number(s.opacity)}});
 const cards=[...document.querySelectorAll('.mm-model-card')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,position:e.dataset.position||'',text:(e.textContent||'').trim().slice(0,120)}});
 return {innerWidth,scrollWidth:document.documentElement.scrollWidth,horizontalOverflow:document.documentElement.scrollWidth-innerWidth,escaped:escaped.slice(0,40),tabs,cards,active:document.documentElement.dataset.mmRotationalTextActive};
});}
function assertContainment(m,profile,label){if(m.horizontalOverflow>2) failures.push(`${profile}:${label}:DOCUMENT_HORIZONTAL_OVERFLOW:${m.horizontalOverflow}`);if(m.escaped.some(x=>/mm-model-card|mm-inspect|toast|panel|card/i.test(x.cls))) failures.push(`${profile}:${label}:PRIMARY_PANEL_VIEWPORT_ESCAPE`);if(m.tabs.some(t=>t.left<-3||t.right>m.innerWidth+3)) failures.push(`${profile}:${label}:ESSENTIAL_CONTROL_CLIPPED`);if(m.cards.some(c=>c.left<-3||c.right>m.innerWidth+3)) failures.push(`${profile}:${label}:ESSENTIAL_TEXT_CLIPPED`);}
function assertDepth(m,profile,label){if(m.tabs.length!==4){failures.push(`${profile}:${label}:TAB_COUNT`);return;}const xs=m.tabs.map(t=>(t.left+t.right)/2), ys=m.tabs.map(t=>(t.top+t.bottom)/2), ws=m.tabs.map(t=>t.width), os=m.tabs.map(t=>t.opacity);const spatialBuckets=new Set(m.tabs.map((t,i)=>`${Math.round(xs[i]/8)}:${Math.round(ys[i]/8)}`));if(spatialBuckets.size<4) failures.push(`${profile}:${label}:DEPTH_POSITIONS_NOT_DISTINCT`);if(Math.max(...ws)-Math.min(...ws)<12&&Math.max(...os)-Math.min(...os)<0.12) failures.push(`${profile}:${label}:ORBIT_COLLAPSES_TO_FLAT_TABSET`);}
async function select(page,index){await page.evaluate(i=>document.querySelectorAll('[data-mm-family-tabs] .mm-family-tab')[i]?.click(),index);await page.waitForFunction(i=>document.documentElement.dataset.mmRotationalTextActive===String(i),{timeout:5000},index);await sleep(550);}

for(const [profile,width,height] of PROFILES){
 const page=await browser.newPage(); await page.setViewport({width,height}); await page.goto(route,{waitUntil:'networkidle0',timeout:45000}); await ready(page);
 const states=[];
 let m=await metrics(page); assertContainment(m,profile,'INITIAL'); assertDepth(m,profile,'INITIAL'); states.push({state:'INITIAL',metrics:m}); await snap(page,profile,'INITIAL');
 await select(page,1); m=await metrics(page); assertContainment(m,profile,'AFTER_ONE_ROTATION'); assertDepth(m,profile,'AFTER_ONE_ROTATION'); states.push({state:'AFTER_ONE_ROTATION',metrics:m}); await snap(page,profile,'AFTER_ONE_ROTATION');
 await select(page,2); m=await metrics(page); assertContainment(m,profile,'REAR_STATE_VISIBLE'); assertDepth(m,profile,'REAR_STATE_VISIBLE'); const rearVisible=m.tabs.some(t=>t.depth==='rear'&&t.opacity>0.08&&t.width>20); if(!rearVisible) failures.push(`${profile}:REAR_STATE_NOT_VISIBLE`); states.push({state:'REAR_STATE_VISIBLE',metrics:m}); await snap(page,profile,'REAR_STATE_VISIBLE');
 await select(page,0); m=await metrics(page); assertContainment(m,profile,'AFTER_FULL_CYCLE'); assertDepth(m,profile,'AFTER_FULL_CYCLE'); if(m.active!=='0') failures.push(`${profile}:EXACT_CYCLE_RETURN_FAILURE`); states.push({state:'AFTER_FULL_CYCLE',metrics:m}); await snap(page,profile,'AFTER_FULL_CYCLE');
 await page.focus('[data-mm-family-tabs] .mm-family-tab[aria-selected="true"]'); await page.keyboard.press('ArrowRight'); await page.waitForFunction(()=>document.documentElement.dataset.mmRotationalTextActive==='1',{timeout:5000}).catch(()=>failures.push(`${profile}:KEYBOARD_STATE_DIVERGENCE`));
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]); await page.goto(route,{waitUntil:'networkidle0',timeout:45000}); await ready(page); await select(page,1); if((await metrics(page)).active!=='1') failures.push(`${profile}:REDUCED_MOTION_STATE_DIVERGENCE`);
 evidence.push({profile,width,height,states}); await page.close();
}
await browser.close();
const receipt={schema:'METHODS_MODELS_ROTATIONAL_TEXT_BROWSER_QUALIFICATION_RECEIPT_v2',executionCommit:EXECUTION_COMMIT,requiredProfiles:PROFILES.map(x=>x[0]),requiredRenderedStates:['INITIAL','AFTER_ONE_ROTATION','REAR_STATE_VISIBLE','AFTER_FULL_CYCLE'],renderedEvidenceDirectory:OUT,evidence,result:failures.length?'FAIL':'PASS',failures,ownerInspectionAdmitted:failures.length===0,automatedOwnerAcceptanceCreated:false};
fs.writeFileSync('methods-models-rotational-text-browser.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
if(failures.length) process.exit(1);
