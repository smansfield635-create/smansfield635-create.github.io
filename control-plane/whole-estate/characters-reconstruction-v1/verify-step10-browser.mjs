import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE='http://127.0.0.1:4173/characters/';
const outDir=process.env.STEP10_ARTIFACT_DIR || '/tmp/characters-step10';
fs.mkdirSync(outDir,{recursive:true});

const cases=[
  {id:'desktop',viewport:{width:1440,height:900},reducedMotion:'no-preference',isMobile:false},
  {id:'mobile',viewport:{width:390,height:844},reducedMotion:'no-preference',isMobile:true},
  {id:'reduced-motion',viewport:{width:1440,height:900},reducedMotion:'reduce',isMobile:false}
];

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const receipts=[];
let failed=false;
for(const spec of cases){
  const context=await browser.newContext({viewport:spec.viewport,reducedMotion:spec.reducedMotion,isMobile:spec.isMobile,hasTouch:spec.isMobile});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  const consoleErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
  await page.goto(BASE,{waitUntil:'networkidle'});
  await page.waitForTimeout(800);
  const initial=await page.evaluate(()=>({
    webgl2:!!document.querySelector('#scene')?.getContext('webgl2'),
    fatal:document.querySelector('#fatal')?.classList.contains('show')===true,
    bodyWidth:document.body.scrollWidth,
    viewportWidth:innerWidth,
    status:document.querySelector('#status')?.textContent||'',
    signalCount:[...document.querySelectorAll('.signal')].filter(el=>!el.hidden).length,
    reduced:matchMedia('(prefers-reduced-motion: reduce)').matches
  }));
  let returnPath=false;
  let arrivalStatus='';
  let returnStatus='';
  const visibleSignal=page.locator('.signal:not([hidden])').first();
  if(await visibleSignal.count()){
    await visibleSignal.click({force:true});
    await page.waitForFunction(()=>document.querySelector('#return')?.classList.contains('show'),null,{timeout:7000});
    arrivalStatus=await page.locator('#status').textContent();
    await page.locator('#return').click({force:true});
    await page.waitForFunction(()=>!document.querySelector('#return')?.classList.contains('show'),null,{timeout:7000});
    if(spec.reducedMotion==='reduce') await page.waitForTimeout(100); else await page.waitForTimeout(2700);
    returnStatus=await page.locator('#status').textContent();
    returnPath=/Orbit/.test(returnStatus||'');
  }
  const mapButton=page.locator('#map-toggle');
  await mapButton.click();
  const mapOpen=await page.locator('#coast-map').evaluate(el=>el.classList.contains('show'));
  await page.locator('#map-close').click();
  const noHorizontalEscape=initial.bodyWidth<=initial.viewportWidth;
  await page.screenshot({path:`${outDir}/${spec.id}.png`,fullPage:true});
  const ok=initial.webgl2&&!initial.fatal&&initial.signalCount>0&&noHorizontalEscape&&returnPath&&mapOpen&&pageErrors.length===0;
  if(!ok) failed=true;
  receipts.push({id:spec.id,ok,initial,arrivalStatus,returnStatus,returnPath,mapOpen,noHorizontalEscape,pageErrors,consoleErrors});
  await context.close();
}
await browser.close();
const receipt={schema:'CHARACTERS_STEP10_BROWSER_ACCEPTANCE_RECEIPT_v1',result:failed?'FAIL':'PASS',cases:receipts};
fs.writeFileSync(`${outDir}/receipt.json`,JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
if(failed) process.exit(1);
