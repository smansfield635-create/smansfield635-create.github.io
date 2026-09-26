import puppeteer from 'puppeteer-core';

const url='https://diamondgatebridge.com/preview/bt4/operational-release-v1/';
const browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-setuid-sandbox']});
const page=await browser.newPage();
page.setDefaultTimeout(30000);

const results=[];
function record(name,actual,expected){const pass=actual===expected;results.push({name,actual,expected,pass});if(!pass)throw new Error(`${name}: expected ${expected}, got ${actual}`);}
async function state(){return page.$eval('#status',el=>({entitlement:el.dataset.entitlement,label:el.textContent.trim()}));}
async function click(action){await page.click(`button[data-action="${action}"]`);await new Promise(r=>setTimeout(r,100));return state();}

try{
  let response=null;
  for(let i=0;i<18;i++){
    try{response=await page.goto(url,{waitUntil:'networkidle0',timeout:20000});if(response?.ok())break;}catch{}
    await new Promise(r=>setTimeout(r,10000));
  }
  if(!response?.ok())throw new Error(`live operational surface unavailable: ${response?.status?.() ?? 'no-response'}`);
  await page.waitForSelector('#status[data-entitlement]');

  let s=await state();record('baseline entitlement',s.entitlement,'QUALIFIED');record('baseline operational label',s.label,'RELEASE AUTHORIZED');
  s=await click('corrupt');record('artifact identity contraction',s.entitlement,'HELD');record('artifact identity operational label',s.label,'RELEASE HELD');
  const overrideHeld=await page.$eval('#override',el=>el.textContent.trim());
  if(!overrideHeld.includes('override BLOCKED')||!overrideHeld.includes('RELEASE HELD'))throw new Error(`operational override not blocked: ${overrideHeld}`);results.push({name:'operational override blocked',actual:overrideHeld,expected:'blocked to RELEASE HELD',pass:true});
  s=await click('repair');record('stale repair ceiling',s.entitlement,'SUPPORTED');record('stale repair operational label',s.label,'REQUALIFICATION REQUIRED');
  s=await click('fresh');record('fresh release receipt recovery',s.entitlement,'QUALIFIED');record('fresh release operational label',s.label,'RELEASE AUTHORIZED');
  s=await click('adverse');record('blocking evidence contraction',s.entitlement,'CONTRADICTED');record('blocking evidence operational label',s.label,'RELEASE BLOCKED');
  s=await click('repair');record('post-block stale repair ceiling',s.entitlement,'SUPPORTED');
  s=await click('fresh');record('post-block fresh recovery',s.entitlement,'QUALIFIED');

  console.log(JSON.stringify({schema:'BT4_OPERATIONAL_CROSS_OBJECT_LIVE_VERIFICATION_v1',url,checks:results.length,passed:results.filter(r=>r.pass).length,result:'PASS',results},null,2));
}finally{await browser.close();}
