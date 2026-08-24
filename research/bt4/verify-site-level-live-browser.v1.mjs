import puppeteer from 'puppeteer-core';

const chrome=process.env.CHROME_PATH;
const target=process.env.TARGET_SHA;
const base='https://diamondgatebridge.com';
const url=`${base}/evidence/readiness/bt4-site-governance/`;
if(!chrome||!target)throw new Error('CHROME_PATH and TARGET_SHA are required');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function liveCommit(){
 try{const r=await fetch(`${base}/.well-known/dgb-release.json?bt4site=${Date.now()}`,{cache:'no-store'});if(!r.ok)return null;return (await r.json()).commit||null}catch{return null}
}
let observed=null;
for(let i=0;i<48;i++){observed=await liveCommit();if(observed===target)break;await sleep(5000)}
if(observed!==target)throw new Error(`exact-head publication not observed expected=${target} observed=${observed}`);

const browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
try{
 const page=await browser.newPage();
 await page.goto(`${url}?verify=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForFunction(()=>document.documentElement.dataset.bt4SiteGovernance==='ready',{timeout:90000});
 const observedSite=await page.evaluate(()=>({
   site:document.documentElement.dataset.bt4SiteState,
   cards:[...document.querySelectorAll('[data-object]')].map(x=>({id:x.dataset.object,served:x.dataset.served}))
 }));
 if(observedSite.site!=='QUALIFIED')throw new Error(`site expected QUALIFIED observed=${observedSite.site}`);
 const expected=['claim','world','diagnostic','release'];
 for(const id of expected){const card=observedSite.cards.find(x=>x.id===id);if(!card)throw new Error(`missing site object ${id}`);if(card.served!=='QUALIFIED')throw new Error(`${id} expected QUALIFIED observed=${card.served}`)}

 const lifecycle=await page.evaluate(async()=>{
   const m=await import(`./site-entitlement.v1.mjs?cycle=${Date.now()}`);
   const site=await m.evaluateSite();
   return site.objects.map(x=>({id:x.id,states:m.controlledLifecycle(x.state).map(y=>y.served)}));
 });
 for(const x of lifecycle){
   const expectedCycle=['QUALIFIED','HELD','SUPPORTED','QUALIFIED'];
   if(JSON.stringify(x.states)!==JSON.stringify(expectedCycle))throw new Error(`${x.id} lifecycle mismatch ${JSON.stringify(x.states)}`);
 }
 console.log(JSON.stringify({result:'PASS',boundary:'BT4_SITE_LEVEL_LIVE_BROWSER',target,site:observedSite,lifecycle},null,2));
}finally{await browser.close()}
