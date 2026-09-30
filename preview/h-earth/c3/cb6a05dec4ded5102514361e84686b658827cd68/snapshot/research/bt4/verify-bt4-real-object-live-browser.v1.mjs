import puppeteer from 'puppeteer-core';

const chrome=process.env.CHROME_PATH;
const target=process.env.TARGET_SHA;
const base='https://diamondgatebridge.com';
const url=`${base}/evidence/readiness/governance-gen3-entitlement/`;
if(!chrome||!target) throw new Error('CHROME_PATH and TARGET_SHA are required');

async function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function liveCommit(){
 try{const r=await fetch(`${base}/.well-known/dgb-release.json?bt4=${Date.now()}`,{cache:'no-store'});if(!r.ok)return null;return (await r.json()).commit||null}catch{return null}
}

let observed=null;
for(let i=0;i<36;i++){
 observed=await liveCommit();
 if(observed===target) break;
 await sleep(5000);
}
if(observed!==target) throw new Error(`Exact live commit not observed. expected=${target} observed=${observed}`);

const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
try{
 const page=await browser.newPage();
 await page.goto(`${url}?commit=${target}`,{waitUntil:'networkidle0',timeout:60000});
 await page.waitForFunction(()=>document.documentElement.dataset.bt4RealObject==='ready',{timeout:30000});
 const actual=await page.evaluate(async()=>{
   const binding=await fetch(`./binding.v1.json?v=${Date.now()}`,{cache:'no-store'}).then(r=>r.json());
   return {
     expected:binding.expectedServedState,
     phase:binding.phase,
     served:document.documentElement.dataset.bt4Served,
     entitlement:document.documentElement.dataset.bt4Entitlement,
     visible:document.querySelector('[data-state]')?.textContent?.trim(),
     override:document.querySelector('[data-override]')?.textContent?.trim(),
     observedBlob:document.querySelector('[data-observed-blob]')?.textContent?.trim(),
     expectedBlob:document.querySelector('[data-expected-blob]')?.textContent?.trim(),
     epoch:document.querySelector('[data-epoch]')?.textContent?.trim()
   };
 });
 const pass=actual.served===actual.expected&&actual.visible===actual.expected&&actual.entitlement===actual.expected;
 const result={schema:'BT4_REAL_OBJECT_LIVE_LIFECYCLE_VERIFICATION_v1',url,targetCommit:target,...actual,pass};
 console.log(JSON.stringify(result,null,2));
 if(!pass) process.exitCode=1;
}finally{await browser.close()}
