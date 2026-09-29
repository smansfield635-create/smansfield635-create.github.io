import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE=process.env.AWARD_BASE_URL||'http://127.0.0.1:4173';
const OUT=process.env.AWARD_EVIDENCE_DIR||'/tmp/award-readiness';
fs.mkdirSync(OUT,{recursive:true});
const failures=[],checks=[];
const record=(surface,name,ok,detail='')=>{checks.push({surface,name,status:ok?'PASS':'FAIL',detail});if(!ok)failures.push({surface,name,detail})};
const paths={job:'/governance-bridge/fort-worth-job-fair/',lbs:'/governance-bridge/collaboration/',bridge:'/governance-bridge/',model:'/governance-bridge/governance/'};
const browser=await chromium.launch({headless:true});
async function pageFor(surface,path,viewport,reducedMotion='no-preference'){
 const page=await browser.newPage({viewportSize:viewport,reducedMotion});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push('console:'+m.text())});
 await page.goto(BASE+path,{waitUntil:'networkidle'});
 record(surface,'no runtime errors',errors.length===0,errors.join(' | '));
 return page;
}
async function noOverflow(page,surface){const v=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));record(surface,'no horizontal overflow',v.sw<=v.cw+2,JSON.stringify(v))}
async function disclosures(page,surface,selector,expected){
 const items=page.locator(selector);record(surface,'disclosure count',(await items.count())===expected,'observed '+await items.count());
 for(let i=0;i<await items.count();i++){const d=items.nth(i),s=d.locator(':scope > summary');await s.focus();record(surface,`summary ${i+1} keyboard focus`,await s.evaluate(el=>el===document.activeElement));await s.press('Enter');record(surface,`disclosure ${i+1} opens`,await d.evaluate(el=>el.open));}
}
async function job(viewport,reduced='no-preference'){const surface=`JOB_${viewport.width}_${reduced}`,p=await pageFor(surface,paths.job,viewport,reduced);await disclosures(p,surface,'.question',5);await noOverflow(p,surface);record(surface,'DGB exit',await p.locator('a[href="https://diamondgatebridge.com/"]').count()>0);record(surface,'model exit',await p.locator('a[href="/governance-bridge/governance/"]').count()>0);await p.close()}
async function lbs(viewport,reduced='no-preference'){const surface=`LBS_${viewport.width}_${reduced}`,p=await pageFor(surface,paths.lbs,viewport,reduced);await disclosures(p,surface,'.question',6);const deep=p.locator('.deep');record(surface,'nested evidence count',(await deep.count())===5,'observed '+await deep.count());for(let i=0;i<await deep.count();i++){const s=deep.nth(i).locator(':scope > summary');await s.focus();await s.press('Enter');record(surface,`nested evidence ${i+1} opens`,await deep.nth(i).evaluate(el=>el.open))}await noOverflow(p,surface);record(surface,'bridge exit',await p.locator('a[href="/governance-bridge/"]').count()>0);record(surface,'model exit',await p.locator('a[href="/governance-bridge/governance/"]').count()>0);if(reduced==='reduce'){record(surface,'spacecraft suppressed',await p.locator('#laws-spacecraft-background-host').evaluateAll(es=>es.length===0||es.every(e=>getComputedStyle(e).display==='none')));record(surface,'fireworks suppressed',await p.locator('canvas[data-dgb-fireworks]').evaluateAll(es=>es.length===0||es.every(e=>getComputedStyle(e).display==='none')))}await p.close()}
async function bridge(viewport,reduced='no-preference'){const surface=`BRIDGE_${viewport.width}_${reduced}`,p=await pageFor(surface,paths.bridge,viewport,reduced);await noOverflow(p,surface);record(surface,'collaboration return',await p.locator('a[href="/governance-bridge/collaboration/"]').count()>0);record(surface,'model handoff',await p.locator('a[href="/governance-bridge/governance/"]').count()>0);const buttons=p.locator('button');record(surface,'interactive controls present',await buttons.count()>0,'buttons '+await buttons.count());if(await buttons.count()){await buttons.first().focus();record(surface,'control keyboard focus',await buttons.first().evaluate(el=>el===document.activeElement))}await p.close()}
async function model(viewport,reduced='no-preference'){const surface=`MODEL_${viewport.width}_${reduced}`,p=await pageFor(surface,paths.model,viewport,reduced);await p.waitForSelector('.governance-panel.is-open');record(surface,'14 nodes',await p.locator('[data-node]').count()===14);record(surface,'21 edges',await p.locator('[data-edge]').count()===21);record(surface,'8 procedures',await p.locator('[data-governance-op]').count()===8);record(surface,'8 failures',await p.locator('[data-governance-failure]').count()===8);const flip=p.locator('[data-governance-flip]');await flip.focus();record(surface,'flip keyboard focus',await flip.evaluate(el=>el===document.activeElement));await flip.press('Enter');await p.waitForTimeout(450);record(surface,'failure face opens',(await flip.getAttribute('aria-pressed'))==='true');await noOverflow(p,surface);await p.close()}
for(const v of [{width:1440,height:1000},{width:390,height:844}]){await job(v);await lbs(v);await bridge(v);await model(v)}
await job({width:390,height:844},'reduce');await lbs({width:390,height:844},'reduce');await bridge({width:390,height:844},'reduce');await model({width:390,height:844},'reduce');
await browser.close();
const receipt={schema:'DGB_AWARD_READINESS_BROWSER_RECEIPT_v1',targetSha:process.env.TARGET_SHA||'',generatedAt:new Date().toISOString(),scope:Object.values(paths),browser:'chromium',checks,failures,result:failures.length?'DEFECTS_FOUND':'PASS_BROWSER_BOUNDARY',unproven:['Safari/iOS native execution','VoiceOver/TalkBack screen-reader execution','Firefox native execution','Edge native execution','Core Web Vitals field data','400% browser zoom']};
fs.writeFileSync(OUT+'/award-readiness-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({result:receipt.result,checks:checks.length,failures:failures.length},null,2));
if(failures.length)process.exit(1);
