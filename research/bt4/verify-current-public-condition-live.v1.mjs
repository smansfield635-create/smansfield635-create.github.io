import fs from 'node:fs';

const forbidden=/\bBT4\b|Breakthrough\s*4/i;
const html=fs.readFileSync('evidence/index.html','utf8');
const js=fs.readFileSync('evidence/current-public-condition.mjs','utf8');
const css=fs.readFileSync('evidence/current-public-condition.css','utf8');
for(const [name,text] of [['evidence/index.html',html],['evidence/current-public-condition.mjs',js],['evidence/current-public-condition.css',css]])if(forbidden.test(text))throw new Error(`PUBLIC_LANGUAGE_LEAK:${name}`);
for(const token of ['Current Public Condition','data-current-public-condition','current-public-condition.mjs'])if(!html.includes(token))throw new Error(`PUBLIC_SURFACE_TOKEN_MISSING:${token}`);
if(!js.includes("/evidence/readiness/bt4-site-governance/site-entitlement.v1.mjs"))throw new Error('SOURCE_BINDING_FAILURE');
if(process.argv.includes('--static')){console.log(JSON.stringify({result:'PASS',boundary:'CURRENT_PUBLIC_CONDITION_STATIC'}));process.exit(0)}

const target=process.env.TARGET_SHA, chrome=process.env.CHROME_PATH;
if(!target||!chrome)throw new Error('TARGET_SHA_AND_CHROME_PATH_REQUIRED');
const base='https://diamondgatebridge.com';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let commit=null;
for(let i=0;i<48;i++){try{const r=await fetch(`${base}/.well-known/dgb-release.json?condition=${Date.now()}`,{cache:'no-store'});if(r.ok)commit=(await r.json()).commit}catch{}if(commit===target)break;await sleep(5000)}
if(commit!==target)throw new Error(`LIVE_PUBLICATION_MISMATCH:expected=${target}:observed=${commit}`);
const {default:puppeteer}=await import('puppeteer-core');
const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
try{
 const page=await browser.newPage(); await page.goto(`${base}/evidence/?condition=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>['QUALIFIED','RESTRICTED'].includes(document.documentElement.dataset.currentPublicCondition),{timeout:90000});
 const observed=await page.evaluate(()=>({aggregate:document.documentElement.dataset.currentPublicCondition,visible:document.querySelector('[data-condition-state]')?.textContent?.trim(),objects:[...document.querySelectorAll('[data-condition-objects] [data-object]')].map(x=>({id:x.dataset.object,served:x.dataset.served})),text:document.querySelector('[data-current-public-condition]')?.innerText||''}));
 if(observed.aggregate!==observed.visible)throw new Error('AGGREGATE_MISMATCH');
 if(observed.objects.length!==4)throw new Error(`OBJECT_STATE_MISMATCH:count=${observed.objects.length}`);
 if(forbidden.test(observed.text))throw new Error('PUBLIC_LANGUAGE_LEAK:live');
 const expectedAggregate=observed.objects.every(x=>x.served==='QUALIFIED')?'QUALIFIED':'RESTRICTED';
 if(observed.aggregate!==expectedAggregate)throw new Error(`AGGREGATE_MISMATCH:expected=${expectedAggregate}:observed=${observed.aggregate}`);
 console.log(JSON.stringify({result:'PASS',schema:'CURRENT_PUBLIC_CONDITION_LIVE_PROOF_v1',target,...observed,law:'PUBLIC_REPRESENTATION<=CURRENT_ENTITLEMENT'},null,2));
}finally{await browser.close()}
