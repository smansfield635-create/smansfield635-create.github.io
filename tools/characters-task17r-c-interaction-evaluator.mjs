import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const candidate = 'd1a9fbfe151910d0cb2783feb84a250ef598ae47';
const root = path.resolve('target');
const server = spawn(process.execPath, ['-e', `const http=require('http'),fs=require('fs'),path=require('path');const root=${JSON.stringify(root)};http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/favicon.ico'){res.statusCode=204;return res.end()}if(p.endsWith('/'))p+='index.html';const f=path.join(root,p.replace(/^\\//,''));fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end('not found')}const ext=path.extname(f);if(ext==='.js')res.setHeader('Content-Type','text/javascript; charset=utf-8');else if(ext==='.css')res.setHeader('Content-Type','text/css; charset=utf-8');else if(ext==='.html')res.setHeader('Content-Type','text/html; charset=utf-8');res.end(d)})}).listen(4173,'127.0.0.1')`], {stdio:'inherit'});
await new Promise(r=>setTimeout(r,800));

const browser = await chromium.launch({headless:true});
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference',hasTouch:true});
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/characters/spatial-field-foundation/',{waitUntil:'networkidle'});
  await page.waitForTimeout(480);
  await page.locator('.anchor__control').nth(3).click();
  await page.waitForTimeout(480);
  const geometry = await page.evaluate(() => {
    const field = document.querySelector('.field');
    const anchor = document.querySelector('.anchor[data-selected="true"]');
    const attachment = document.querySelector('.carousel-attachment');
    const fr = field.getBoundingClientRect();
    const ar = anchor.getBoundingClientRect();
    const tr = attachment.getBoundingClientRect();
    const acs = getComputedStyle(anchor);
    const tcs = getComputedStyle(attachment);
    return {
      selected: document.querySelector('[data-spatial-foundation]').dataset.carouselIndex,
      field: {left:fr.left, top:fr.top, width:fr.width, height:fr.height},
      anchorRect: {left:ar.left, top:ar.top, width:ar.width, height:ar.height, centerX:ar.left+ar.width/2, centerY:ar.top+ar.height/2},
      anchorLayout: {offsetLeft:anchor.offsetLeft, offsetTop:anchor.offsetTop, offsetWidth:anchor.offsetWidth, offsetHeight:anchor.offsetHeight, cssLeft:acs.left, cssTop:acs.top, transform:acs.transform, transformOrigin:acs.transformOrigin},
      attachmentRect: {left:tr.left, top:tr.top, width:tr.width, height:tr.height, centerX:tr.left+tr.width/2, centerY:tr.top+tr.height/2},
      attachmentLayout: {offsetLeft:attachment.offsetLeft, offsetTop:attachment.offsetTop, cssLeft:tcs.left, cssTop:tcs.top, transform:tcs.transform, anchorX:tcs.getPropertyValue('--anchor-x').trim(), anchorY:tcs.getPropertyValue('--anchor-y').trim()},
      deltaX: (tr.left+tr.width/2) - (ar.left+ar.width/2),
      deltaY: (tr.top+tr.height) - ar.top
    };
  });
  console.log(JSON.stringify({schema:'CHARACTERS_TASK17R_C_GEOMETRY_DIAGNOSTIC_v1',candidate,result:'MEASURED',geometry},null,2));
  process.exitCode = 1;
  await context.close();
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
