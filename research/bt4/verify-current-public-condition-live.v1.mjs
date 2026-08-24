#!/usr/bin/env node
import fs from 'node:fs';
const args=new Set(process.argv.slice(2));
const staticMode=args.has('--static');
const required=['Current Public Condition','data-current-public-condition','current-public-condition.mjs','current-public-condition.css'];
const banned=[/>\s*BT4\s*</i,/>[^<]*Breakthrough 4[^<]*</i];
if(staticMode){
  const html=fs.readFileSync('evidence/index.html','utf8');
  const js=fs.readFileSync('evidence/current-public-condition.mjs','utf8');
  for(const token of required)if(!html.includes(token))throw new Error('MISSING_PUBLIC_CONDITION_TOKEN:'+token);
  for(const re of banned)if(re.test(html)||re.test(js))throw new Error('PUBLIC_LANGUAGE_LEAK:'+re);
  if(!js.includes('evaluateSite'))throw new Error('SITE_ENTITLEMENT_SOURCE_NOT_BOUND');
  console.log(JSON.stringify({schema:'CURRENT_PUBLIC_CONDITION_STATIC_PROOF_v1',result:'PASS_CLOSED'}));
  process.exit(0);
}
const { chromium }=await import('playwright');
const base=process.env.PUBLIC_BASE_URL||'https://www.diamondgatebridge.com';
const expected=process.env.EXPECTED_HEAD||'';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  await page.goto(`${base}/evidence/?condition-proof=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>window.__CURRENT_PUBLIC_CONDITION__?.objects?.length===4,null,{timeout:90000});
  const observed=await page.evaluate(()=>({condition:window.__CURRENT_PUBLIC_CONDITION__,text:document.querySelector('[data-current-public-condition]')?.innerText||''}));
  if(/BT4|Breakthrough 4/i.test(observed.text))throw new Error('PUBLIC_LANGUAGE_LEAK');
  if(!['QUALIFIED','RESTRICTED'].includes(observed.condition.siteState))throw new Error('AGGREGATE_STATE_INVALID');
  if(observed.condition.objects.length!==4)throw new Error('OBJECT_COUNT_INVALID');
  if(expected){const marker=await page.evaluate(async()=>await (await fetch('/.well-known/dgb-release.json',{cache:'no-store'})).json());if(String(marker.commit||'')!==expected)throw new Error(`LIVE_PUBLICATION_MISMATCH:${marker.commit}`);}
  const receipt={schema:'CURRENT_PUBLIC_CONDITION_LIVE_PROOF_v1',result:'PASS_CLOSED',expectedHead:expected||null,siteState:observed.condition.siteState,objects:observed.condition.objects};
  fs.mkdirSync('research/bt4',{recursive:true});fs.writeFileSync('research/bt4/current-public-condition-live-proof.json',JSON.stringify(receipt,null,2)+'\n');
  console.log(JSON.stringify(receipt));
}finally{await browser.close();}
