import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const candidate='8a31c58902a3395f39a8236bdef1193e4c992788';
const root=path.resolve('target');
const outputDir=path.resolve('qualification-output');
fs.mkdirSync(outputDir,{recursive:true});
const outputFile=path.join(outputDir,'task17r-d-character-card-qualification.json');
const expected=[
  ['01','ALARIC_AXION','Alaric Axion','NORTH','WINTER',5470618671],
  ['02','ELARA_SYLENE','Elara Sylene','EAST','SPRING',5470628682],
  ['03','TARIAN_MERROW','Tarian Merrow','SOUTH','SUMMER',5470642869],
  ['04','SOREN_SEVRIN','Soren Sevrin','WEST','AUTUMN',5470634971]
];
const data=JSON.parse(fs.readFileSync(path.join(root,'characters/spatial-field-foundation/character-cards.v1.json'),'utf8'));
assert.equal(data.schema,'CHARACTERS_TASK17R_D_PRODUCTION_CHARACTER_CARDS_v1');
assert.equal(data.sourceAssembly.issue,2378);
assert.equal(data.sourceAssembly.authority,'OWNER_ORIGINATING_CHARACTER_SOURCE_HANDOFFS_ONLY');
assert.equal(data.slots.length,8);
for(const [anchor,id,name,seat,season,comment] of expected){const s=data.slots.find(x=>x.anchor===anchor);assert.ok(s);assert.equal(s.state,'SOURCE_BOUND_CARDINAL_CARD');assert.equal(s.characterId,id);assert.equal(s.displayName,name);assert.equal(s.seat,seat);assert.equal(s.season,season);assert.equal(s.sourceCommentId,comment);assert.ok(Array.isArray(s.heldUnknownFields)&&s.heldUnknownFields.length>0);}
for(const anchor of ['05','06','07','08']){const s=data.slots.find(x=>x.anchor===anchor);assert.ok(s);assert.equal(s.state,'UNASSIGNED_SOURCE_HOLD');assert.equal(s.characterId,null);assert.equal(s.displayName,'Unassigned source hold');}
assert.deepEqual(data.hardNegatives,{chronology:false,relationships:false,p12:false,legacyShell:false,dossierIframe:false,worldRuntime:false,freeCamera:false,publication:false});

const server=spawn(process.execPath,['-e',`const http=require('http'),fs=require('fs'),path=require('path');const root=${JSON.stringify(root)};http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/favicon.ico'){res.statusCode=204;return res.end()}if(p.endsWith('/'))p+='index.html';const f=path.join(root,p.replace(/^\\//,''));fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end('not found')}const ext=path.extname(f);if(ext==='.js')res.setHeader('Content-Type','text/javascript; charset=utf-8');else if(ext==='.css')res.setHeader('Content-Type','text/css; charset=utf-8');else if(ext==='.html')res.setHeader('Content-Type','text/html; charset=utf-8');else if(ext==='.json')res.setHeader('Content-Type','application/json; charset=utf-8');res.end(d)})}).listen(4173,'127.0.0.1')`],{stdio:'inherit'});
await new Promise(r=>setTimeout(r,800));
const browser=await chromium.launch({headless:true});
const evidence=[];
const viewports=[['desktop',1440,1000],['tablet',768,1024],['phone',390,844]];
async function gesture(page,from,to){const cdp=await page.context().newCDPSession(page);try{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:from.x,y:from.y,id:1,radiusX:5,radiusY:5,force:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:to.x,y:to.y,id:1,radiusX:5,radiusY:5,force:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}finally{await cdp.detach();}}
async function assertCard(page,index){const slot=data.slots[index];await page.waitForFunction(i=>document.querySelector('[data-spatial-foundation]')?.dataset.carouselIndex===String(i+1).padStart(2,'0')&&document.querySelector('.carousel-attachment')?.dataset.characterState,index,{timeout:1800});const card=page.locator('.carousel-attachment');assert.equal(await card.getAttribute('data-character-state'),slot.state);assert.equal((await page.locator('.carousel-attachment__label').textContent())?.trim(),slot.displayName);if(slot.characterId===null){assert.equal(await card.getAttribute('data-character-id'),'');assert.ok((await page.locator('.character-card__hold').textContent())?.includes('No owner-originating character source'));}else{assert.equal(await card.getAttribute('data-character-id'),slot.characterId);assert.ok((await page.locator('.character-card__provenance').textContent())?.includes(`comment ${slot.sourceCommentId}`));}}
try{
 for(const [name,width,height] of viewports){for(const reducedMotion of ['no-preference','reduce']){
  const context=await browser.newContext({viewport:{width,height},reducedMotion,hasTouch:true,isMobile:name==='phone'});const page=await context.newPage();const pageErrors=[];const consoleErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});await page.goto('http://127.0.0.1:4173/characters/spatial-field-foundation/',{waitUntil:'networkidle'});
  const rootLoc=page.locator('[data-spatial-foundation]'),anchors=page.locator('.anchor[data-carousel-anchor="true"]'),controls=page.locator('.anchor__control');
  assert.equal(await rootLoc.getAttribute('data-character-cards-ready'),'true');assert.equal(await rootLoc.getAttribute('data-production-content'),'four-source-bound-cardinal-cards-four-unassigned-source-holds');assert.equal(await rootLoc.getAttribute('data-character-source-authority'),'issue-2378-owner-originating-only');assert.equal(await rootLoc.getAttribute('data-character-inference'),'forbidden');assert.equal(await rootLoc.getAttribute('data-dom-attachment-model'),'canonical-anchor-reference');assert.equal(await anchors.count(),8);assert.equal(await controls.count(),8);assert.equal(await page.locator('[data-carousel-attachment-reference]').count(),8);assert.equal(await page.locator('iframe').count(),0);assert.equal(await page.locator('script[src*="h-earth"],script[src*="audralia"],script[src*="spatial-narrative"]').count(),0);
  const touchAction=await page.locator('.field').evaluate(el=>getComputedStyle(el).touchAction);assert.ok(touchAction.includes('pan-y')&&touchAction.includes('pinch-zoom'));if(reducedMotion==='reduce'){const duration=await page.locator('.carousel-attachment').evaluate(el=>getComputedStyle(el).transitionDuration);assert.ok(duration.split(',').every(v=>parseFloat(v)===0));}
  for(let i=0;i<8;i++){await controls.nth(i).click();await assertCard(page,i);}await controls.nth(0).click();await assertCard(page,0);await controls.nth(0).focus();await page.keyboard.press('ArrowRight');await assertCard(page,1);assert.equal(await controls.nth(1).evaluate(el=>document.activeElement===el),true);await page.keyboard.press('End');await assertCard(page,7);await page.keyboard.press('Home');await assertCard(page,0);await page.keyboard.press('ArrowLeft');await assertCard(page,7);await controls.nth(3).click();await assertCard(page,3);
  await gesture(page,{x:250,y:500},{x:160,y:505});await assertCard(page,4);const before=await rootLoc.getAttribute('data-carousel-index');await gesture(page,{x:200,y:480},{x:205,y:570});assert.equal(await rootLoc.getAttribute('data-carousel-index'),before);
  const field=await page.locator('.field').boundingBox();const cardBox=await page.locator('.carousel-attachment').boundingBox();assert.ok(field&&cardBox);assert.ok(cardBox.x>=field.x-2&&cardBox.x+cardBox.width<=field.x+field.width+2);await page.setViewportSize({width:Math.max(320,width-24),height:Math.max(700,height-24)});assert.equal(await anchors.count(),8);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.anchor[data-carousel-anchor="true"]').count(),8);assert.equal(pageErrors.length,0,JSON.stringify(pageErrors));assert.equal(consoleErrors.length,0,JSON.stringify(consoleErrors));
  evidence.push({viewport:name,reducedMotion,anchors:8,canonicalCards:4,unassignedHolds:4,keyboard:'PASS',focus:'PASS',horizontalSwipe:'PASS',verticalGestureOwnership:'PASS',touchAction,pageErrors,consoleErrors});await context.close();
 }}
 const receipt={schema:'CHARACTERS_TASK17R_D_CHARACTER_CARD_QUALIFICATION_v1',candidate,result:'PASS_CLOSED',sourceAssemblyIssue:2378,canonicalCharacterIds:expected.map(x=>x[1]),unassignedHoldAnchors:['05','06','07','08'],frozenPredecessor:data.frozenPredecessor,evidence};fs.writeFileSync(outputFile,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}catch(error){const receipt={schema:'CHARACTERS_TASK17R_D_CHARACTER_CARD_QUALIFICATION_v1',candidate,result:'FAIL_CLOSED',error:String(error?.stack||error),evidence};fs.writeFileSync(outputFile,JSON.stringify(receipt,null,2)+'\n');console.error(JSON.stringify(receipt,null,2));process.exitCode=1;}finally{await browser.close();server.kill('SIGTERM');}