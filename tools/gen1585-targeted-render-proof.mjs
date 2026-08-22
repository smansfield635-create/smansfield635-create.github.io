import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:412,height:915}});
const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'}); await page.waitForTimeout(1200);
const result=await page.evaluate(()=>{
 const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)], vis=e=>{if(!e)return false;const c=getComputedStyle(e),r=e.getBoundingClientRect();return c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity||1)>0.02&&r.width>0&&r.height>0};
 const scene=q('[data-compass-scene]'), threshold=q('section.compass-instrument>header.compass-orbit-intro'), routes=q('[data-compass-mirrorland-routes]');
 const pair=q('[data-compass-readiness-pair]'); const carousels=qa('[data-readiness-carousel]');
 const plaques=qa('.compass-orbit-plaque'); const activePlaques=plaques.filter(p=>p.dataset.active==='true');
 const exposedInactive=plaques.filter(p=>p.dataset.active!=='true').filter(p=>vis(p.querySelector('.compass-object-portal'))||vis(p.querySelector('.compass-object-caption')));
 return {routesInThreshold:!!(routes&&threshold&&threshold.contains(routes)),routesInScene:!!(routes&&scene&&scene.contains(routes)),routeCount:routes?.querySelectorAll('a').length||0,pair:!!pair,carouselCount:carousels.length,carouselTypes:carousels.map(c=>c.dataset.readinessCarousel),frontCounts:carousels.map(c=>c.querySelectorAll('[data-slot="front"]').length),activePlaques:activePlaques.length,exposedInactive:exposedInactive.length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
});
if(errors.length) throw new Error('page errors '+errors.join(' | '));
if(!result.routesInThreshold||result.routesInScene||result.routeCount!==4) throw new Error('Mirrorland threshold ownership failed '+JSON.stringify(result));
if(!result.pair||result.carouselCount!==2||!result.carouselTypes.includes('trl')||!result.carouselTypes.includes('tra')||result.frontCounts.some(n=>n!==1)) throw new Error('TRL/TRA carousel structure failed '+JSON.stringify(result));
if(result.activePlaques!==1||result.exposedInactive!==0) throw new Error('capability overlap failed '+JSON.stringify(result));
if(result.overflow>2) throw new Error('mobile overflow '+JSON.stringify(result));
for(const type of ['trl','tra']){const c=page.locator(`[data-readiness-carousel="${type}"]`);const before=await c.locator('[data-slot="front"] strong').innerText();await c.locator('.compass-readiness-controls>button').last().click();await page.waitForTimeout(100);const after=await c.locator('[data-slot="front"] strong').innerText();if(before===after)throw new Error(`${type} next control did not advance`);await c.press('ArrowLeft');await page.waitForTimeout(100);const restored=await c.locator('[data-slot="front"] strong').innerText();if(restored!==before)throw new Error(`${type} keyboard did not restore`);}
console.log(JSON.stringify({result:'PASS',...result},null,2));
await browser.close();
