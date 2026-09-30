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
 const proof=await page.evaluate(async()=>{
   const dom={
     site:document.documentElement.dataset.bt4SiteState,
     cards:[...document.querySelectorAll('[data-object]')].map(x=>({id:x.dataset.object,served:x.dataset.served}))
   };
   const m=await import(`./site-entitlement.v1.mjs?proof=${Date.now()}`);
   const live=await m.evaluateSite();
   const normalizedCycles=live.objects.map(x=>{
     const q={...x.state,provenance:true,reproduction:true,evidence:'supporting',authority:true,receiptEpoch:Number(x.state.epoch)};
     return {id:x.id,states:m.controlledLifecycle(q).map(y=>y.served),liveServed:x.entitlement.served};
   });
   return {dom,live,normalizedCycles};
 });

 const expectedIds=['claim','world','diagnostic','release'];
 if(proof.dom.cards.length!==4)throw new Error(`expected 4 public objects observed=${proof.dom.cards.length}`);
 for(const id of expectedIds){
   const card=proof.dom.cards.find(x=>x.id===id);
   const live=proof.live.objects.find(x=>x.id===id);
   if(!card||!live)throw new Error(`missing site object ${id}`);
   if(card.served!==live.entitlement.served)throw new Error(`${id} public projection mismatch dom=${card.served} computed=${live.entitlement.served}`);
 }
 const expectedAggregate=proof.live.objects.every(x=>x.entitlement.served==='QUALIFIED')?'QUALIFIED':'RESTRICTED';
 if(proof.dom.site!==expectedAggregate)throw new Error(`aggregate public projection mismatch dom=${proof.dom.site} computed=${expectedAggregate}`);
 if(proof.live.siteState!==expectedAggregate)throw new Error(`adapter aggregate mismatch ${proof.live.siteState} != ${expectedAggregate}`);

 for(const x of proof.normalizedCycles){
   const expectedCycle=['QUALIFIED','HELD','SUPPORTED','QUALIFIED'];
   if(JSON.stringify(x.states)!==JSON.stringify(expectedCycle))throw new Error(`${x.id} invariant lifecycle mismatch ${JSON.stringify(x.states)}`);
 }

 console.log(JSON.stringify({
   result:'PASS',
   boundary:'BT4_SITE_LEVEL_LIVE_BROWSER_TRUTHFUL_STATE',
   target,
   aggregate:expectedAggregate,
   publicObjects:proof.dom.cards,
   liveStates:proof.normalizedCycles.map(x=>({id:x.id,current:x.liveServed,invariantCycle:x.states})),
   law:'PUBLIC_REPRESENTATION<=CURRENT_ENTITLEMENT'
 },null,2));
}finally{await browser.close()}
