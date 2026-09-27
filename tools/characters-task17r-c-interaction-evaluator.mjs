import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const candidate = 'd48613af69a244a9e71e7220ab7410e166f9a420';
const root = path.resolve('target');
const server = spawn(process.execPath, ['-e', `const http=require('http'),fs=require('fs'),path=require('path');const root=${JSON.stringify(root)};http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/favicon.ico'){res.statusCode=204;return res.end()}if(p.endsWith('/'))p+='index.html';const f=path.join(root,p.replace(/^\\//,''));fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end('not found')}const ext=path.extname(f);if(ext==='.js')res.setHeader('Content-Type','text/javascript; charset=utf-8');else if(ext==='.css')res.setHeader('Content-Type','text/css; charset=utf-8');else if(ext==='.html')res.setHeader('Content-Type','text/html; charset=utf-8');else if(ext==='.md')res.setHeader('Content-Type','text/markdown; charset=utf-8');res.end(d)})}).listen(4173,'127.0.0.1')`], {stdio:'inherit'});
await new Promise(r=>setTimeout(r,800));

const browser = await chromium.launch({headless:true});
const viewports=[['desktop',1440,1000],['tablet',768,1024],['phone',390,844]];
const evidence=[];

async function waitForAttachmentBinding(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-spatial-foundation]');
    const attachment = document.querySelector('.carousel-attachment');
    const selected = document.querySelector('.anchor[data-selected="true"]');
    if (!root || !attachment || !selected) return false;
    const ref = selected.querySelector('[data-carousel-attachment-reference]');
    if (!ref || attachment.dataset.boundReference !== selected.dataset.anchor) return false;
    const rr = ref.getBoundingClientRect();
    const ar = attachment.getBoundingClientRect();
    const refX = rr.left;
    const refY = rr.top;
    const attachmentCenterX = ar.left + ar.width / 2;
    return Math.abs(attachmentCenterX - refX) <= 2 && ar.top + ar.height <= refY + 4;
  }, null, { timeout: 1800 });
}

async function assertAttachmentReference(page, name) {
  const geometry = await page.evaluate(() => {
    const selected = document.querySelector('.anchor[data-selected="true"]');
    const attachment = document.querySelector('.carousel-attachment');
    const ref = selected?.querySelector('[data-carousel-attachment-reference]');
    const field = document.querySelector('.field');
    if (!selected || !attachment || !ref || !field) return null;
    const sr = selected.getBoundingClientRect();
    const rr = ref.getBoundingClientRect();
    const ar = attachment.getBoundingClientRect();
    const fr = field.getBoundingClientRect();
    return {
      selected: selected.dataset.anchor,
      boundReference: attachment.dataset.boundReference,
      field: {left:fr.left,top:fr.top,width:fr.width,height:fr.height},
      selectedAnchor: {left:sr.left,top:sr.top,width:sr.width,height:sr.height},
      reference: {x:rr.left,y:rr.top},
      attachment: {left:ar.left,top:ar.top,width:ar.width,height:ar.height,centerX:ar.left+ar.width/2,bottom:ar.top+ar.height},
      deltaX: (ar.left+ar.width/2)-rr.left,
      deltaBottom: (ar.top+ar.height)-rr.top
    };
  });
  assert.ok(geometry, `${name}: attachment geometry available`);
  assert.equal(geometry.boundReference, geometry.selected, `${name}: attachment declares selected reference`);
  assert.ok(Math.abs(geometry.deltaX) <= 2, `${name}: attachment bound to canonical reference x; ${JSON.stringify(geometry)}`);
  assert.ok(geometry.deltaBottom <= 4, `${name}: attachment remains above canonical reference; ${JSON.stringify(geometry)}`);
  return geometry;
}

async function pointerGesture(page, from, to) {
  await page.locator('.field').dispatchEvent('pointerdown',{pointerId:17,pointerType:'touch',isPrimary:true,clientX:from.x,clientY:from.y});
  await page.locator('.field').dispatchEvent('pointermove',{pointerId:17,pointerType:'touch',isPrimary:true,clientX:to.x,clientY:to.y});
  await page.locator('.field').dispatchEvent('pointerup',{pointerId:17,pointerType:'touch',isPrimary:true,clientX:to.x,clientY:to.y});
}

try {
  for (const [name,width,height] of viewports) {
    for (const reducedMotion of ['no-preference','reduce']) {
      const context=await browser.newContext({viewport:{width,height},reducedMotion,hasTouch:true,isMobile:name==='phone'});
      const page=await context.newPage();
      const pageErrors=[]; const consoleErrors=[];
      page.on('pageerror',e=>pageErrors.push(e.message));
      page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text())});
      await page.goto('http://127.0.0.1:4173/characters/spatial-field-foundation/',{waitUntil:'networkidle'});

      const rootLocator=page.locator('[data-spatial-foundation]');
      const anchors=page.locator('.anchor[data-carousel-anchor="true"]');
      const controls=page.locator('.anchor__control');
      const refs=page.locator('[data-carousel-attachment-reference]');
      assert.equal(await anchors.count(),8,`${name}/${reducedMotion}: eight carousel anchors`);
      assert.equal(await controls.count(),8,`${name}/${reducedMotion}: eight accessible controls`);
      assert.equal(await refs.count(),8,`${name}/${reducedMotion}: eight canonical attachment references`);
      assert.equal(await rootLocator.getAttribute('data-carousel-ready'),'true');
      assert.equal(await rootLocator.getAttribute('data-carousel-anchors'),'8');
      assert.equal(await rootLocator.getAttribute('data-dom-attachment-model'),'canonical-anchor-reference');
      assert.equal(await rootLocator.getAttribute('data-production-content'),'absent');
      assert.equal(await rootLocator.getAttribute('data-world-navigation-ownership'),'absent');
      assert.equal(await rootLocator.getAttribute('data-world-runtime'),'absent');
      assert.equal(await rootLocator.getAttribute('data-free-camera'),'absent');
      assert.equal(await rootLocator.getAttribute('data-legacy-presentation'),'absent');
      assert.equal(await page.locator('iframe').count(),0,`${name}/${reducedMotion}: no iframe`);
      assert.equal(await page.locator('script[src*="h-earth"],script[src*="audralia"],script[src*="spatial-narrative"]').count(),0,`${name}/${reducedMotion}: no world runtime`);
      assert.equal(pageErrors.length,0,`${name}/${reducedMotion}: page errors ${JSON.stringify(pageErrors)}`);
      assert.equal(consoleErrors.length,0,`${name}/${reducedMotion}: console errors ${JSON.stringify(consoleErrors)}`);

      const touchAction=await page.locator('.field').evaluate(el=>getComputedStyle(el).touchAction);
      assert.ok(touchAction.includes('pan-y')&&touchAction.includes('pinch-zoom'),`${name}/${reducedMotion}: browser vertical scroll and pinch ownership`);
      assert.equal(await rootLocator.getAttribute('data-carousel-motion'),reducedMotion==='reduce'?'reduced-equivalent':'animated-anchor-transition');
      if (reducedMotion==='reduce') {
        const duration=await page.locator('.carousel-attachment').evaluate(el=>getComputedStyle(el).transitionDuration);
        assert.ok(duration.split(',').every(v=>parseFloat(v)===0),`${name}: reduced motion removes attachment transition`);
      }

      const fieldBox=await page.locator('.field').boundingBox();
      assert.ok(fieldBox,`${name}/${reducedMotion}: field visible`);
      for(let i=0;i<8;i++){
        const b=await anchors.nth(i).boundingBox();
        assert.ok(b,`${name}/${reducedMotion}: anchor ${i+1} visible`);
        assert.ok(b.x>=fieldBox.x-1&&b.y>=fieldBox.y-1&&b.x+b.width<=fieldBox.x+fieldBox.width+1&&b.y+b.height<=fieldBox.y+fieldBox.height+1,`${name}/${reducedMotion}: anchor ${i+1} contained`);
      }

      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'01');
      assert.equal(await controls.nth(0).getAttribute('tabindex'),'0');
      for(let i=1;i<8;i++) assert.equal(await controls.nth(i).getAttribute('tabindex'),'-1');
      await waitForAttachmentBinding(page);
      const initialGeometry=await assertAttachmentReference(page,`${name}/${reducedMotion}/initial`);

      await controls.nth(0).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'02',`${name}: ArrowRight next`);
      assert.equal(await controls.nth(1).evaluate(el=>document.activeElement===el),true,`${name}: focus follows ArrowRight`);
      await page.keyboard.press('End');
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'08',`${name}: End selects final anchor`);
      await page.keyboard.press('Home');
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'01',`${name}: Home selects first anchor`);
      await page.keyboard.press('ArrowLeft');
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'08',`${name}: wraparound previous`);
      await controls.nth(3).click();
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'04',`${name}: click selects anchor`);
      await waitForAttachmentBinding(page);
      const keyboardGeometry=await assertAttachmentReference(page,`${name}/${reducedMotion}/keyboard-click`);

      await pointerGesture(page,{x:250,y:500},{x:160,y:505});
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),'05',`${name}: horizontal swipe advances`);
      const beforeVertical=await rootLocator.getAttribute('data-carousel-index');
      await pointerGesture(page,{x:200,y:480},{x:205,y:570});
      assert.equal(await rootLocator.getAttribute('data-carousel-index'),beforeVertical,`${name}: vertical gesture is not captured as carousel movement`);
      await waitForAttachmentBinding(page);
      const touchGeometry=await assertAttachmentReference(page,`${name}/${reducedMotion}/touch`);

      await page.setViewportSize({width:Math.max(320,width-24),height:Math.max(700,height-24)});
      await waitForAttachmentBinding(page);
      assert.equal(await anchors.count(),8,`${name}: anchors survive resize`);
      assert.equal(await refs.count(),8,`${name}: attachment references survive resize`);
      const resizeGeometry=await assertAttachmentReference(page,`${name}/${reducedMotion}/resize`);
      await page.reload({waitUntil:'networkidle'});
      assert.equal(await page.locator('.anchor[data-carousel-anchor="true"]').count(),8,`${name}: anchors survive reload`);
      assert.equal(await page.locator('[data-carousel-attachment-reference]').count(),8,`${name}: references survive reload`);
      assert.equal(pageErrors.length,0,`${name}/${reducedMotion}: no page errors after interaction`);
      assert.equal(consoleErrors.length,0,`${name}/${reducedMotion}: no console errors after interaction`);

      evidence.push({name,reducedMotion,anchors:8,controls:8,references:8,pageErrors,consoleErrors,touchAction,keyboard:'PASS',focus:'PASS',attachmentReference:'PASS',horizontalSwipe:'PASS',verticalGestureOwnership:'PASS',resizeReload:'PASS',geometry:{initial:initialGeometry,keyboard:keyboardGeometry,touch:touchGeometry,resize:resizeGeometry}});
      await context.close();
    }
  }
  console.log(JSON.stringify({schema:'CHARACTERS_TASK17R_C_INTERACTION_QUALIFICATION_v2',candidate,result:'PASS_CLOSED',evidence},null,2));
} catch (error) {
  console.error(JSON.stringify({schema:'CHARACTERS_TASK17R_C_INTERACTION_QUALIFICATION_v2',candidate,result:'FAIL_CLOSED',error:String(error?.stack||error)},null,2));
  process.exitCode=1;
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
