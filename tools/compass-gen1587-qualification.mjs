import { chromium } from 'playwright';
import fs from 'node:fs';

const base=process.env.COMPASS_TEST_URL||'http://127.0.0.1:4173/';
const out='.qualification/compass-gen1587';
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const viewports={desktop:{width:1440,height:1100},tablet:{width:900,height:1000},phone:{width:412,height:915}};
const receipts={};

async function boot(page){
  let lastError=null;
  for(let attempt=0;attempt<2;attempt++){
    try{
      const response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
      if(!response||!response.ok())throw new Error(`candidate boot HTTP ${response?.status?.()??'NO_RESPONSE'}`);
      await page.locator('[data-compass-root]').waitFor({state:'attached',timeout:30000});
      await page.waitForFunction(()=>globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2?.version==='presentation-convergence-v6',{timeout:30000});
      await page.waitForTimeout(700);
      return;
    }catch(error){
      lastError=error;
      if(attempt===0)await page.waitForTimeout(900);
    }
  }
  throw lastError;
}

for(const [name,viewport] of Object.entries(viewports)){
  const context=await browser.newContext({viewport,hasTouch:name!=='desktop',isMobile:name==='phone'});
  const page=await context.newPage();
  const pageErrors=[]; const requestFailures=[];
  page.on('pageerror',e=>pageErrors.push(String(e)));
  page.on('requestfailed',r=>requestFailures.push(`${r.method()} ${r.url()} :: ${r.failure()?.errorText||'failed'}`));
  await boot(page);

  const initial=await page.evaluate(()=>{
    const root=document.querySelector('[data-compass-root]');
    const stage=document.querySelector('[data-compass-readiness-stage]');
    const trl=stage?.querySelector('[data-readiness-family="trl"]');
    const tra=stage?.querySelector('[data-readiness-family="tra"]');
    const capabilityOrbit=document.querySelector('[data-capability-orbit]');
    const capabilityChoices=[...(capabilityOrbit?.querySelectorAll('[aria-selected]')||[])];
    const selectedCaps=capabilityChoices.filter(x=>x.getAttribute('aria-selected')==='true');
    const activePlaques=[...document.querySelectorAll('.compass-capability-orbit .compass-orbit-plaque')].filter(x=>getComputedStyle(x).display!=='none'&&getComputedStyle(x).visibility!=='hidden');
    const h=document.querySelector('[data-compass-room-declarations] [data-compass-room][data-label="H-Earth"]');
    const overflow=document.documentElement.scrollWidth-document.documentElement.clientWidth;
    return {
      version:globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2?.version||'',
      carouselPolicy:globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2?.carouselPolicy||'',
      readinessPolicy:globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2?.readinessPolicy||'',
      mode:root?.dataset.compassMode||'',overflow,
      stage:Boolean(stage),activeFamily:stage?.dataset.activeFamily||'',
      trlHidden:Boolean(trl?.hidden),traHidden:Boolean(tra?.hidden),
      trlInert:Boolean(trl?.hasAttribute('inert')),traInert:Boolean(tra?.hasAttribute('inert')),
      trlActiveCards:trl?[...trl.querySelectorAll('.compass-readiness-slide')].filter(x=>x.dataset.active==='true'&&!x.hidden).length:-1,
      traActiveCards:tra?[...tra.querySelectorAll('.compass-readiness-slide')].filter(x=>x.dataset.active==='true'&&!x.hidden).length:-1,
      capabilityOrbit:Boolean(capabilityOrbit),capabilityChoiceCount:capabilityChoices.length,selectedCapCount:selectedCaps.length,activePlaqueCount:activePlaques.length,
      hEarth:h?{href:h.getAttribute('href'),route:h.dataset.route}:null
    };
  });
  const fail=msg=>{throw new Error(`${name}: ${msg} :: ${JSON.stringify(initial)}`)};
  if(initial.version!=='presentation-convergence-v6')fail('Gen1587 presentation owner not mounted');
  if(initial.carouselPolicy!=='SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD')fail('carousel continuity policy missing');
  if(initial.readinessPolicy!=='TRL_TRA_MUTUALLY_EXCLUSIVE')fail('readiness exclusivity policy missing');
  if(initial.overflow>2)fail(`horizontal overflow ${initial.overflow}`);
  if(!initial.stage||initial.activeFamily!=='trl'||initial.trlHidden||!initial.traHidden||initial.trlInert||!initial.traInert)fail('default TRL/TRA ownership invalid');
  if(initial.trlActiveCards!==1)fail('TRL does not expose exactly one active card');
  if(!initial.capabilityOrbit||initial.activePlaqueCount!==1)fail('capability stage does not expose exactly one active presentation owner');
  if(initial.capabilityChoiceCount>0&&initial.selectedCapCount!==1)fail('capability selectors do not preserve one selected state');
  if(!initial.hEarth||initial.hEarth.route!=='/showroom/globe/h-earth/'||!initial.hEarth.href)fail('canonical H-Earth declaration lost ingress');

  const trlTab=page.getByRole('tab',{name:'TRL',exact:true});
  const traTab=page.getByRole('tab',{name:'TRA',exact:true});
  if(await trlTab.count()!==1||await traTab.count()!==1)fail('TRL/TRA family tabs not uniquely exposed');
  await traTab.click(); await page.waitForTimeout(120);
  const traState=await page.evaluate(()=>{const s=document.querySelector('[data-compass-readiness-stage]'),trl=s?.querySelector('[data-readiness-family="trl"]'),tra=s?.querySelector('[data-readiness-family="tra"]');return{active:s?.dataset.activeFamily,trlHidden:trl?.hidden,traHidden:tra?.hidden,trlInert:trl?.hasAttribute('inert'),traInert:tra?.hasAttribute('inert'),activeCards:tra?[...tra.querySelectorAll('.compass-readiness-slide')].filter(x=>x.dataset.active==='true'&&!x.hidden).length:-1,title:tra?.querySelector('.compass-readiness-head h3')?.textContent||''};});
  if(traState.active!=='tra'||!traState.trlHidden||traState.traHidden||!traState.trlInert||traState.traInert||traState.activeCards!==1)fail(`TRA ownership invalid ${JSON.stringify(traState)}`);
  const traFamily=page.locator('[data-readiness-family="tra"]');
  const traTitleBefore=(await traFamily.locator('.compass-readiness-head h3').textContent()||'').trim();
  await traFamily.press('ArrowRight'); await page.waitForTimeout(80);
  const traTitleAfter=(await traFamily.locator('.compass-readiness-head h3').textContent()||'').trim();
  if(!traTitleBefore||traTitleBefore===traTitleAfter)fail('TRA keyboard slide transition did not change state-derived heading');
  await trlTab.click(); await page.waitForTimeout(100);
  const returned=await page.evaluate(()=>{const s=document.querySelector('[data-compass-readiness-stage]'),trl=s?.querySelector('[data-readiness-family="trl"]'),tra=s?.querySelector('[data-readiness-family="tra"]');return{active:s?.dataset.activeFamily,trlHidden:trl?.hidden,traHidden:tra?.hidden};});
  if(returned.active!=='trl'||returned.trlHidden||!returned.traHidden)fail('TRL restoration failed');

  const orbit=page.locator('[data-capability-orbit]').first();
  await orbit.scrollIntoViewIfNeeded();
  const capabilityCollisionSweep=[];
  for(let i=0;i<3;i++){
    await page.waitForTimeout(180);
    const snap=await page.evaluate(()=>{
      const orbit=document.querySelector('[data-capability-orbit]');
      const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&r.width>0&&r.height>0;};
      const active=[...(orbit?.querySelectorAll('.compass-orbit-plaque')||[])].filter(el=>el.dataset.active==='true'&&visible(el));
      const plaque=active[0]||null,caption=plaque?.querySelector('.compass-object-caption')||null,dock=orbit?.querySelector('.compass-action-dock')||null,guidance=orbit?.querySelector('.compass-capability-guidance')||null;
      const rect=el=>{if(!el)return null;const r=el.getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
      const C=rect(caption),D=rect(dock),G=rect(guidance);
      const overlap=(A,B)=>A&&B?{x:Math.min(A.right,B.right)-Math.max(A.left,B.left),y:Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top)}:null;
      return {
        capability:plaque?.dataset.capability||'',activeCount:active.length,
        caption:C,dock:D,guidance:G,
        captionDockOverlap:overlap(C,D),dockGuidanceOverlap:overlap(D,G),
        captionDockGap:C&&D?D.top-C.bottom:null,
        dockGuidanceGap:D&&G?G.top-D.bottom:null,
        actionCount:dock?[...dock.querySelectorAll('a,button')].filter(visible).length:0,
        orbitOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
      };
    });
    capabilityCollisionSweep.push(snap);
    if(snap.activeCount!==1)fail(`capability ${i+1} exposes ${snap.activeCount} active plaques`);
    if(!snap.capability)fail(`capability ${i+1} has no active identity`);
    if(snap.actionCount<1)fail(`${snap.capability}: no visible action control`);
    if(snap.captionDockOverlap&&snap.captionDockOverlap.x>3&&snap.captionDockOverlap.y>0)fail(`${snap.capability}: caption/action collision ${JSON.stringify(snap.captionDockOverlap)}`);
    if(snap.captionDockGap==null||snap.captionDockGap<8)fail(`${snap.capability}: caption/action reservation below 8px (${snap.captionDockGap})`);
    if(snap.dockGuidanceOverlap&&snap.dockGuidanceOverlap.x>3&&snap.dockGuidanceOverlap.y>0)fail(`${snap.capability}: action/guidance collision ${JSON.stringify(snap.dockGuidanceOverlap)}`);
    if(snap.orbitOverflow>2)fail(`${snap.capability}: horizontal overflow ${snap.orbitOverflow}`);
    await orbit.press('ArrowRight');
  }
  const identities=[...new Set(capabilityCollisionSweep.map(x=>x.capability))];
  if(identities.length!==3)fail(`capability sweep did not cover three unique states ${JSON.stringify(identities)}`);

  const collision=await page.evaluate(()=>{
    const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;};
    const overlaps=(a,b)=>{const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();return Math.min(A.right,B.right)-Math.max(A.left,B.left)>3&&Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top)>3;};
    const pairs=[];
    const readiness=document.querySelector('[data-readiness-family="trl"]');
    const rh=readiness?.querySelector('.compass-readiness-head');
    const active=readiness?.querySelector('.compass-readiness-slide[data-active="true"]');
    if(rh&&active&&visible(rh)&&visible(active)&&overlaps(rh,active))pairs.push('readiness-heading/active-card');
    const detail=document.querySelector('.compass-monument-detail');
    if(detail){const nodes=[...detail.children].filter(visible);for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)if(overlaps(nodes[i],nodes[j]))pairs.push(`capability-detail-${i}/${j}`);}
    return pairs;
  });
  if(collision.length)fail(`text/control collision ${collision.join(',')}`);

  await page.screenshot({path:`${out}/${name}.png`,fullPage:true});
  const productFailures=requestFailures.filter(x=>x.includes('/assets/compass/')&&!x.includes('ERR_ABORTED'));
  if(pageErrors.length)fail(`page errors ${pageErrors.join(' | ')}`);
  if(productFailures.length)fail(`Compass asset request failures ${productFailures.join(' | ')}`);
  receipts[name]={initial,traState,traTitleBefore,traTitleAfter,returned,capabilityCollisionSweep,collision,pageErrors,requestFailures};
  await context.close();
}
await browser.close();
fs.writeFileSync(`${out}/receipt.json`,JSON.stringify({result:'GEN1587_TAKEOVER_BOUNDARY_PASS',head:process.env.GITHUB_SHA||null,receipts},null,2));
console.log(JSON.stringify({result:'GEN1587_TAKEOVER_BOUNDARY_PASS',receipts},null,2));