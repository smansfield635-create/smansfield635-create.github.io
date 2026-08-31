import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve('target');
const server = spawn(process.execPath, ['-e', `const http=require('http'),fs=require('fs'),path=require('path');const root=${JSON.stringify(root)};http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/favicon.ico'){res.statusCode=204;return res.end()}if(p.endsWith('/'))p+='index.html';const f=path.join(root,p.replace(/^\\//,''));fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end('not found')}res.end(d)})}).listen(4173,'127.0.0.1')`], {stdio:'inherit'});
await new Promise(r=>setTimeout(r,800));

const browser = await chromium.launch({headless:true});
const viewports=[['desktop',1440,1000],['tablet',768,1024],['phone',390,844]];
const evidence=[];
try {
  for (const [name,width,height] of viewports) {
    const context=await browser.newContext({viewport:{width,height}, reducedMotion:'reduce'});
    const page=await context.newPage();
    const pageErrors=[]; const consoleErrors=[];
    page.on('pageerror',e=>pageErrors.push(e.message));
    page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text())});
    await page.goto('http://127.0.0.1:4173/characters/spatial-field-foundation/',{waitUntil:'networkidle'});
    const anchors=page.locator('.anchor');
    assert.equal(await anchors.count(),8,`${name}: 8 anchors`);
    for(let i=0;i<8;i++){const b=await anchors.nth(i).boundingBox();assert.ok(b,`${name}: anchor ${i+1} visible`);assert.ok(b.x>=-1&&b.y>=-1&&b.x+b.width<=width+1&&b.y+b.height<=Math.max(height,860)+1,`${name}: anchor ${i+1} contained`)}
    assert.equal(pageErrors.length,0,`${name}: page errors ${JSON.stringify(pageErrors)}`); assert.equal(consoleErrors.length,0,`${name}: console errors ${JSON.stringify(consoleErrors)}`);
    assert.equal(await page.locator('[data-spatial-foundation]').getAttribute('data-world-runtime'),'absent');
    assert.equal(await page.locator('[data-spatial-foundation]').getAttribute('data-free-camera'),'absent');
    assert.equal(await page.locator('[data-spatial-foundation]').getAttribute('data-legacy-presentation'),'absent');
    assert.equal(await page.locator('iframe').count(),0,`${name}: no iframe`);
    assert.equal(await page.locator('script[src*="h-earth"],script[src*="audralia"]').count(),0,`${name}: no world runtime script`);
    const touchAction=await page.locator('.field').evaluate(el=>getComputedStyle(el).touchAction);
    assert.ok(touchAction.includes('pan-y')&&touchAction.includes('pinch-zoom'),`${name}: browser touch ownership`);
    await page.setViewportSize({width:width-20,height:height-20}); await page.waitForTimeout(160);
    assert.equal((await page.locator('.anchor').count()),8,`${name}: anchors survive resize`);
    await page.reload({waitUntil:'networkidle'}); assert.equal((await page.locator('.anchor').count()),8,`${name}: anchors survive reload`);
    evidence.push({name,pageErrors,consoleErrors,touchAction,anchors:8});
    await context.close();
  }
  console.log(JSON.stringify({schema:'CHARACTERS_TASK17R_FOUNDATION_QUALIFICATION_v1',candidate:'feb19ebcb9dd08f5585db337cb15bba8e6202a89',result:'PASS_CLOSED',evidence},null,2));
} catch (error) {
  console.error(JSON.stringify({schema:'CHARACTERS_TASK17R_FOUNDATION_QUALIFICATION_v1',candidate:'feb19ebcb9dd08f5585db337cb15bba8e6202a89',result:'FAIL_CLOSED',error:String(error?.stack||error)},null,2));
  process.exitCode=1;
} finally { await browser.close(); server.kill('SIGTERM'); }
