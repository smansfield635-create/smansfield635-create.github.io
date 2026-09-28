import { chromium } from 'playwright';
import fs from 'node:fs';
const CANDIDATE='559a8eff21d026ce48a3996eebef76676453cdd8';
const origin='http://127.0.0.1:4173';
const out='.qualification/auren-spatial-proof1';
fs.mkdirSync(out,{recursive:true});
const viewports={desktop:{width:1440,height:1000},tablet:{width:900,height:1000},mobile:{width:390,height:844}};
const receipt={schema:'AUREN_SPATIAL_PROOF1_BROWSER_QUALIFICATION_RECEIPT_v1',candidateHead:CANDIDATE,result:'PASS',viewports:{},reducedMotion:null};
const fail=(code,detail)=>{throw new Error(code+': '+detail)};
const browser=await chromium.launch({headless:true});
async function runCase(name,viewport,reducedMotion='no-preference'){
 const context=await browser.newContext({viewport,reducedMotion});
 const page=await context.newPage(); const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 const r=await page.goto(origin+'/products/auren/',{waitUntil:'networkidle'});
 if(!r||!r.ok())fail('DEAD_ROUTE',name+' '+(r?.status()));
 await page.waitForFunction(()=>document.querySelector('[data-auren-chamber]')?.getAttribute('data-auren-ready')==='true');
 const initial=await page.evaluate(()=>({
  overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
  ready:document.querySelector('[data-auren-chamber]')?.getAttribute('data-auren-ready'),
  custody:document.querySelector('[data-auren-chamber]')?.getAttribute('data-custody-state'),
  receipt:globalThis.AUREN_CHAMBER_RECEIPT,
  promptCount:document.querySelectorAll('[data-auren-options] button').length,
  bubbleCount:document.querySelectorAll('[data-auren-thread] .auren-bubble').length
 }));
 if(initial.overflow>2)fail('HORIZONTAL_OVERFLOW',name+' '+initial.overflow);
 if(initial.ready!=='true'||!initial.receipt?.ready||initial.receipt?.conversationPrimary!==true)fail('READINESS_INVALID',name);
 if(initial.receipt?.presentation?.renderer!=='DOM_CSS_3D'||initial.receipt?.presentation?.webglContextCount!==0)fail('PRESENTATION_INVALID',name);
 if(initial.custody!=='PROTECTED')fail('INITIAL_CUSTODY_INVALID',name+' '+initial.custody);
 if(initial.promptCount<1||initial.bubbleCount<1)fail('CONVERSATION_EMPTY',name);
 await page.getByRole('button',{name:'What are you protecting over there?',exact:true}).click();
 await page.getByRole('button',{name:'Show me what you mean.',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('[data-auren-chamber]')?.getAttribute('data-custody-state')==='REVEALED');
 const terminal=await page.evaluate(()=>({
  overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
  custody:document.querySelector('[data-auren-chamber]')?.getAttribute('data-custody-state'),
  promptCount:document.querySelectorAll('[data-auren-options] button').length,
  bubbleCount:document.querySelectorAll('[data-auren-thread] .auren-bubble').length,
  presentation:globalThis.AUREN_ROOM_PRESENTATION?.getReceipt?.()
 }));
 if(terminal.overflow>2)fail('HORIZONTAL_OVERFLOW_AFTER_REVEAL',name+' '+terminal.overflow);
 if(terminal.custody!=='REVEALED'||terminal.promptCount<1||terminal.bubbleCount<=initial.bubbleCount)fail('INTERACTION_INVALID',name);
 if(errors.length)fail('PAGE_ERROR',name+' '+errors.join('|'));
 await page.screenshot({path:out+'/'+name+(reducedMotion==='reduce'?'-reduced':'')+'.png',fullPage:true});
 await context.close(); return {viewport,reducedMotion,initial,terminal,pageErrors:errors};
}
for(const [name,vp] of Object.entries(viewports))receipt.viewports[name]=await runCase(name,vp);
receipt.reducedMotion=await runCase('mobile',viewports.mobile,'reduce');
await browser.close();
fs.writeFileSync(out+'/receipt.json',JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));