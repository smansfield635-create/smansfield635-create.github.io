import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const viewports=[['desktop',{width:1440,height:1100}],['phone',{width:412,height:915}]];
for(const [name,viewport] of viewports){
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2?.version==='presentation-convergence-v3');
  const base=await page.evaluate(()=>{
    const root=document.querySelector('[data-compass-root]');
    const scene=root?.querySelector('[data-compass-scene]');
    const routes=root?.querySelector('[data-compass-mirrorland-routes]');
    const pair=root?.querySelector('[data-compass-readiness-pair="trl-tra"]');
    return {
      thresholdIntegrated:Boolean(routes&&scene?.contains(routes)&&routes.classList.contains('compass-mirrorland-threshold-routes')),
      hrefs:[...routes?.querySelectorAll('a')||[]].map(a=>a.getAttribute('href')),
      returnCount:routes?.querySelectorAll('[data-compass-mirrorland-inline-back]').length||0,
      carousels:pair?.querySelectorAll('.compass-readiness-carousel').length||0,
      trlSlides:pair?.querySelector('[data-readiness-carousel="trl"]')?.querySelectorAll('.compass-readiness-slide').length||0,
      traSlides:pair?.querySelector('[data-readiness-carousel="tra"]')?.querySelectorAll('.compass-readiness-slide').length||0,
      legacyProofVisible:(()=>{const el=root?.querySelector('[data-proof-orbit]');if(!el)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden';})(),
      overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
    };
  });
  if(!base.thresholdIntegrated) throw new Error(`${name}: Mirrorland route node not integrated into scene`);
  const expected=['/narrative/','/showroom/globe/h-earth/','/world-map/','/'];
  if(JSON.stringify(base.hrefs)!==JSON.stringify(expected)) throw new Error(`${name}: route hrefs changed ${JSON.stringify(base.hrefs)}`);
  if(base.returnCount!==1) throw new Error(`${name}: return route count ${base.returnCount}`);
  if(base.carousels!==2||base.trlSlides!==3||base.traSlides!==4) throw new Error(`${name}: readiness structure ${JSON.stringify(base)}`);
  if(base.legacyProofVisible) throw new Error(`${name}: old combined proof carousel still visible`);
  if(base.overflow>2) throw new Error(`${name}: horizontal overflow ${base.overflow}`);
  await page.evaluate(()=>{const r=document.querySelector('[data-compass-mirrorland-routes]');r.hidden=false;document.querySelector('[data-compass-root]').dataset.compassMode='MIRRORLAND_FOCUSED';});
  const threshold=page.locator('[data-compass-mirrorland-routes]');
  if(!(await threshold.isVisible())) throw new Error(`${name}: integrated Mirrorland threshold not visible when focused`);
  const box=await threshold.boundingBox();if(!box||box.width<250||box.height<120) throw new Error(`${name}: threshold geometry invalid ${JSON.stringify(box)}`);
  for(const type of ['trl','tra']){
    const car=page.locator(`[data-readiness-carousel="${type}"]`);
    const before=await car.locator('.compass-readiness-slide[data-active="true"] strong').innerText();
    await car.getByRole('button',{name:new RegExp(`Next .*${type==='trl'?'TRL':'TRA'}`,'i')}).click();
    const after=await car.locator('.compass-readiness-slide[data-active="true"] strong').innerText();
    if(before===after) throw new Error(`${name}: ${type} next control did not advance`);
  }
  if(errors.length) throw new Error(`${name}: page errors ${errors.join(' | ')}`);
  console.log(`GEN1584_${name.toUpperCase()}_PASS`,JSON.stringify(base));
  await page.close();
}
await browser.close();
console.log('GEN1584_TARGETED_PRESENTATION_PASS_CLOSED');
