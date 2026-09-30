#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const HTML_PATH='instruments/index.html';
const JS_PATH='instruments/laboratory.js';
const COCKPIT_PATH='showroom/globe/audralia/disposition/index.html';
const COMPASS_PATH='index.html';
const SITE_GUIDE_PATH='site-guide/index.html';
const ANCHOR_GATE_PATH='tools/h-earth-experience-anchor-gate.mjs';
const DEEP_CHAMBER_PATHS=[
  'showroom/globe/audralia/diagnostic/index.html',
  'showroom/globe/h-earth/diagnostic/index.html',
  'showroom/globe/hearth/diagnostic/index.html',
  'coherence-diagnostic/index.html'
];
const OUTPUT_DIR=process.env.OUTPUT_DIR||'estate-laboratory-gen1-verification';
const mode=process.argv.includes('--runtime')?'runtime':'static';
const fail=code=>{throw new Error(`ESTATE_LABORATORY_GEN1_VERIFY_FAIL:${code}`)};
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const html=read(HTML_PATH);
const js=read(JS_PATH);
const cockpit=read(COCKPIT_PATH);
const compass=read(COMPASS_PATH);
const siteGuide=read(SITE_GUIDE_PATH);
const anchorGate=read(ANCHOR_GATE_PATH);
const deepChambers=Object.fromEntries(DEEP_CHAMBER_PATHS.map(p=>[p,read(p)]));

function staticVerification(){
  const requiredHtml=[
    'data-page="estate-laboratory"',
    'data-role="governed-observability-and-diagnostic-environment"',
    'data-version="ESTATE_LABORATORY_GOVERNED_OBSERVABILITY_GEN1_v1"',
    'data-lab-shell',
    'data-heavy-runtime-loaded="false"',
    'Estate Laboratory',
    'Governed observability · diagnostic environment',
    'Run all lightweight tests',
    'data-instrument-grid',
    'data-run-selected',
    'data-target-panel',
    'data-receipt-output',
    '/showroom/globe/audralia/diagnostic/',
    '/showroom/globe/h-earth/diagnostic/',
    '/showroom/globe/hearth/diagnostic/',
    '/coherence-diagnostic/',
    'target="_blank" rel="noopener"',
    '/instruments/laboratory.js?v=ESTATE_LABORATORY_GOVERNED_OBSERVABILITY_GEN1_v1'
  ];
  for(const token of requiredHtml)if(!html.includes(token))fail(`HTML_TOKEN_MISSING:${token}`);
  if(/<iframe\b/i.test(html))fail('STATIC_IFRAME_FORBIDDEN');
  if(!html.includes('overflow-x:hidden'))fail('PAGE_OVERFLOW_PROTECTION_MISSING');
  if(!html.includes('--touch:48px'))fail('TOUCH_TARGET_CONTRACT_MISSING');

  const instrumentIds=[
    'release-identity','evidence-surface','claim-identity','audralia-surface',
    'diagnostic-authority','compass-surface','h-earth-surface','audralia-runtime','evidence-carousel'
  ];
  for(const id of instrumentIds)if(!js.includes(`id: "${id}"`))fail(`INSTRUMENT_MISSING:${id}`);
  for(const token of ['ESTATE_LABORATORY_LIGHTWEIGHT_TEST_RESULT_v1','mode: "light"','mode: "deep"','createTargetFrame','teardownTarget','runAllLightweight','AUDRALIA_READY_TIMEOUT_MS = 120000'])if(!js.includes(token))fail(`RUNTIME_TOKEN_MISSING:${token}`);
  if(js.includes('productionMutationAuthorized: true')||js.includes('data-production-mutation-authorized="true"'))fail('PRODUCTION_MUTATION_AUTHORITY_FORBIDDEN');

  for(const token of [
    'data-page="audralia-command-cockpit"',
    'data-public-facing-name="Audralia Command Cockpit"',
    'Enter the world. Then look beneath it.',
    'Five questions beneath the world',
    'World State',
    'Diagnostics',
    'Construction',
    'Evidence',
    'Next Move'
  ])if(!cockpit.includes(token))fail(`AUDRALIA_COCKPIT_RESTORATION_TOKEN_MISSING:${token}`);
  if(cockpit.includes('data-page="estate-laboratory"')||cockpit.includes('ESTATE_LABORATORY_GOVERNED_OBSERVABILITY_GEN1_v1'))fail('AUDRALIA_COCKPIT_STILL_OWNS_ESTATE_LABORATORY_IDENTITY');

  const compassTokens=[
    'data-coordinate-label="Instruments"',
    'data-route="/instruments/" data-cardinal-route="/instruments/"',
    'data-room-id="south-4" data-label="Estate Laboratory" data-route="/instruments/"',
    'data-local-coordinate="Governed Observability"',
    'href="/instruments/">Estate Laboratory</a>',
    '<a href="/instruments/">Instruments</a>'
  ];
  for(const token of compassTokens)if(!compass.includes(token))fail(`COMPASS_NAVIGATION_TOKEN_MISSING:${token}`);
  if(compass.includes('data-room-id="south-4" data-label="Control Cockpit"'))fail('COMPASS_OLD_ESTATE_LAB_IDENTITY_REMAINS');
  if(!compass.includes('data-panel-body="Explore prototypes, energy, water, infrastructure, and long-range construction."'))fail('UNRELATED_FRONTIER_COPY_DRIFT');

  for(const token of [
    '<a href="/instruments/">Estate Laboratory</a>',
    'Estate Laboratory coordinates observability and diagnostics, Triple G measures readiness',
    '<b>Estate Laboratory</b><span>Observability and diagnostics</span>'
  ])if(!siteGuide.includes(token))fail(`SITE_GUIDE_NAVIGATION_TOKEN_MISSING:${token}`);
  if(siteGuide.includes('<a href="/gauges/">The Lab</a>'))fail('SITE_GUIDE_OLD_PRIMARY_LAB_ROUTE_REMAINS');

  for(const [deepPath,deepHtml] of Object.entries(deepChambers)){
    if(!deepHtml.includes('data-estate-laboratory-return'))fail(`DEEP_CHAMBER_RETURN_MARKER_MISSING:${deepPath}`);
    if(!deepHtml.includes('href="/instruments/"'))fail(`DEEP_CHAMBER_RETURN_ROUTE_MISSING:${deepPath}`);
    if(!deepHtml.includes('Return to Estate Laboratory')&&!deepHtml.includes('Estate Laboratory</a>'))fail(`DEEP_CHAMBER_RETURN_LABEL_MISSING:${deepPath}`);
  }

  for(const token of [
    'NON_EXPERIENCE_H_EARTH_SHOWROOM_PREFIXES',
    "'showroom/globe/h-earth/diagnostic/'",
    'NON_EXPERIENCE_AUDRALIA_PREFIXES',
    "'showroom/globe/audralia/disposition/'",
    "'showroom/globe/audralia/diagnostic/'"
  ])if(!anchorGate.includes(token))fail(`EXPERIENCE_ANCHOR_OBSERVABILITY_BOUNDARY_MISSING:${token}`);

  const syntax=spawnSync(process.execPath,['--check',JS_PATH],{cwd:ROOT,encoding:'utf8'});
  if(syntax.status!==0)fail(`JAVASCRIPT_SYNTAX:${String(syntax.stderr||syntax.stdout).trim().slice(0,800)}`);
  const verifierSyntax=spawnSync(process.execPath,['--check','tools/estate-laboratory-gen1-verify.mjs'],{cwd:ROOT,encoding:'utf8'});
  if(verifierSyntax.status!==0)fail(`VERIFIER_JAVASCRIPT_SYNTAX:${String(verifierSyntax.stderr||verifierSyntax.stdout).trim().slice(0,800)}`);

  return {
    schema:'ESTATE_LABORATORY_GEN1_STATIC_VERIFICATION_v1',
    result:'PASS',
    laboratoryPaths:[HTML_PATH,JS_PATH],
    canonicalLaboratoryRoute:'/instruments/',
    instrumentCount:instrumentIds.length,
    lightweightInstrumentCount:7,
    deepInstrumentCount:2,
    participatingDeepChamberCount:DEEP_CHAMBER_PATHS.length,
    staticIframeCount:0,
    audraliaCommandCockpitRestored:true,
    compassInstrumentsIdentityReconciled:true,
    siteGuideInstrumentsIdentityReconciled:true,
    deepChamberReturnSemantics:true,
    experienceAnchorObservabilityBoundaryPreserved:true,
    audraliaProductRootProtected:true,
    javascriptSyntax:'PASS'
  };
}

const staticReceipt=staticVerification();
if(mode==='static'){
  console.log(JSON.stringify(staticReceipt,null,2));
  process.exit(0);
}

const chromePath=process.env.CHROME_PATH;
const baseUrl=(process.env.BASE_URL||'http://127.0.0.1:4173').replace(/\/$/,'');
if(!chromePath)fail('CHROME_PATH_REQUIRED');
const {default:puppeteer}=await import('puppeteer-core');
fs.mkdirSync(path.join(ROOT,OUTPUT_DIR),{recursive:true});

const viewports=[
  {id:'phone',width:360,height:800},
  {id:'tablet-portrait',width:768,height:1024},
  {id:'tablet-landscape',width:1024,height:768},
  {id:'desktop',width:1440,height:1000}
];
const terminal=new Set(['PASS','FINDING','UNRESOLVED']);
const browser=await puppeteer.launch({executablePath:chromePath,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
const viewportReceipts=[];
let deepEvidenceCarousel=null;
let cockpitRuntime=null;
let compassRuntime=null;
let deepRoundTrips=[];

try{
  for(const viewport of viewports){
    const page=await browser.newPage();
    const pageErrors=[],consoleErrors=[];
    page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
    page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
    await page.setViewport({width:viewport.width,height:viewport.height,deviceScaleFactor:1});
    await page.goto(`${baseUrl}/instruments/?verify=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>document.querySelectorAll('.instrument-card').length===9,{timeout:15000});

    const initial=await page.evaluate(()=>{
      const rects=selectors=>selectors.flatMap(selector=>[...document.querySelectorAll(selector)].filter(el=>!el.hidden).map(el=>{const r=el.getBoundingClientRect();return{selector,width:r.width,height:r.height}}));
      return {
        route:location.pathname,
        page:document.documentElement.dataset.page||null,
        role:document.documentElement.dataset.role||null,
        viewport:{width:innerWidth,height:innerHeight},
        documentScrollWidth:document.documentElement.scrollWidth,
        bodyScrollWidth:document.body.scrollWidth,
        heavyRuntimeLoaded:document.documentElement.dataset.heavyRuntimeLoaded||null,
        iframeCount:document.querySelectorAll('iframe').length,
        controls:rects(['[data-run-all]','[data-run-selected]','.instrument-card'])
      };
    });
    if(initial.route!=='/instruments/'||initial.page!=='estate-laboratory'||initial.role!=='governed-observability-and-diagnostic-environment')fail(`CANONICAL_LAB_ROUTE_IDENTITY_FAILURE:${viewport.id}`);
    if(initial.documentScrollWidth>viewport.width+1||initial.bodyScrollWidth>viewport.width+1)fail(`HORIZONTAL_OVERFLOW_INITIAL:${viewport.id}:${initial.documentScrollWidth}:${initial.bodyScrollWidth}`);
    if(initial.heavyRuntimeLoaded!=='false'||initial.iframeCount!==0)fail(`HEAVY_RUNTIME_LOADED_AT_START:${viewport.id}`);
    const undersized=initial.controls.filter(control=>control.height<44||control.width<44);
    if(undersized.length)fail(`TOUCH_TARGET_FAILURE:${viewport.id}:${JSON.stringify(undersized.slice(0,5))}`);

    await page.click('[data-run-all]');
    await page.waitForFunction(()=>{
      const cards=[...document.querySelectorAll('.instrument-card[data-mode="light"]')];
      return cards.length===7&&cards.every(card=>['PASS','FINDING','UNRESOLVED'].includes(card.querySelector('em')?.dataset.status||''));
    },{timeout:120000});

    const afterSuite=await page.evaluate(()=>{
      const light=[...document.querySelectorAll('.instrument-card[data-mode="light"]')].map(card=>({id:card.dataset.instrumentId,status:card.querySelector('em')?.dataset.status||''}));
      return {
        overall:document.querySelector('[data-summary-overall]')?.textContent?.trim()||null,
        light,
        documentScrollWidth:document.documentElement.scrollWidth,
        bodyScrollWidth:document.body.scrollWidth,
        heavyRuntimeLoaded:document.documentElement.dataset.heavyRuntimeLoaded||null,
        iframeCount:document.querySelectorAll('iframe').length
      };
    });
    if(afterSuite.documentScrollWidth>viewport.width+1||afterSuite.bodyScrollWidth>viewport.width+1)fail(`HORIZONTAL_OVERFLOW_AFTER_SUITE:${viewport.id}:${afterSuite.documentScrollWidth}:${afterSuite.bodyScrollWidth}`);
    if(afterSuite.light.length!==7||afterSuite.light.some(item=>!terminal.has(item.status)))fail(`LIGHTWEIGHT_SUITE_NONTERMINAL:${viewport.id}`);
    if(afterSuite.heavyRuntimeLoaded!=='false'||afterSuite.iframeCount!==0)fail(`LIGHTWEIGHT_SUITE_BOOTED_HEAVY_RUNTIME:${viewport.id}`);

    const screenshot=`${OUTPUT_DIR}/${viewport.id}.png`;
    await page.screenshot({path:path.join(ROOT,screenshot),fullPage:true});

    if(viewport.id==='desktop'){
      await page.click('.instrument-card[data-instrument-id="evidence-carousel"]');
      await page.click('[data-run-selected]');
      await page.waitForFunction(()=>['PASS','FINDING','UNRESOLVED'].includes(document.querySelector('[data-active-state]')?.textContent?.trim()||''),{timeout:45000});
      deepEvidenceCarousel=await page.evaluate(()=>({
        status:document.querySelector('[data-active-state]')?.textContent?.trim()||null,
        result:document.querySelector('[data-result-text]')?.textContent?.trim()||null,
        heavyRuntimeLoaded:document.documentElement.dataset.heavyRuntimeLoaded||null,
        iframeCount:document.querySelectorAll('iframe').length,
        receiptText:document.querySelector('[data-receipt-output]')?.textContent||''
      }));
      if(deepEvidenceCarousel.status!=='PASS')fail(`EVIDENCE_CAROUSEL_DEEP_TEST_FAILURE:${deepEvidenceCarousel.status}:${deepEvidenceCarousel.result}`);
      if(deepEvidenceCarousel.heavyRuntimeLoaded!=='true'||deepEvidenceCarousel.iframeCount!==1)fail('DEEP_TEST_ISOLATION_CHAMBER_NOT_OBSERVED');
      await page.click('[data-teardown-target]');
      await page.waitForFunction(()=>document.querySelectorAll('iframe').length===0&&document.documentElement.dataset.heavyRuntimeLoaded==='false',{timeout:5000});

      const cockpitPage=await browser.newPage();
      await cockpitPage.setViewport({width:1440,height:1000,deviceScaleFactor:1});
      await cockpitPage.goto(`${baseUrl}/showroom/globe/audralia/disposition/?verify=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
      cockpitRuntime=await cockpitPage.evaluate(()=>({
        title:document.title,
        page:document.documentElement.dataset.page||null,
        publicFacingName:document.documentElement.dataset.publicFacingName||null,
        hero:document.querySelector('h1')?.textContent?.trim()||null,
        hasWorldState:[...document.querySelectorAll('[data-plane-target]')].some(el=>el.textContent.trim()==='World State')
      }));
      if(cockpitRuntime.page!=='audralia-command-cockpit'||cockpitRuntime.hero!=='Enter the world. Then look beneath it.'||cockpitRuntime.hasWorldState!==true)fail(`AUDRALIA_COCKPIT_RUNTIME_NOT_RESTORED:${JSON.stringify(cockpitRuntime)}`);
      await cockpitPage.close();

      const compassPage=await browser.newPage();
      await compassPage.setViewport({width:1440,height:1000,deviceScaleFactor:1});
      await compassPage.goto(`${baseUrl}/?verify=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
      compassRuntime=await compassPage.evaluate(()=>{
        const south=document.querySelector('[data-compass-cardinal][data-wing="south"]');
        const estateLab=document.querySelector('[data-compass-room][data-room-id="south-4"]');
        return {
          roomCount:document.querySelectorAll('[data-compass-room]').length,
          southRoute:south?.dataset.route||null,
          southLabel:south?.dataset.coordinateLabel||null,
          estateLabLabel:estateLab?.dataset.label||null,
          estateLabRoute:estateLab?.dataset.route||null,
          oldControlCockpitRoom:Boolean(document.querySelector('[data-compass-room][data-room-id="south-4"][data-label="Control Cockpit"]'))
        };
      });
      if(compassRuntime.roomCount!==19||compassRuntime.southRoute!=='/instruments/'||compassRuntime.southLabel!=='Instruments'||compassRuntime.estateLabLabel!=='Estate Laboratory'||compassRuntime.estateLabRoute!=='/instruments/'||compassRuntime.oldControlCockpitRoom)fail(`COMPASS_NAVIGATION_RUNTIME_FAILURE:${JSON.stringify(compassRuntime)}`);
      await compassPage.close();

      const roundTripRooms=[
        {id:'audralia-diagnostic',href:'/showroom/globe/audralia/diagnostic/'},
        {id:'h-earth-diagnostic',href:'/showroom/globe/h-earth/diagnostic/'},
        {id:'hearth-diagnostic',href:'/showroom/globe/hearth/diagnostic/'},
        {id:'coherence-diagnostic',href:'/coherence-diagnostic/'}
      ];
      for(const room of roundTripRooms){
        const labHref=await page.$eval(`.room-link[href="${room.href}"]`,el=>el.getAttribute('href'));
        if(labHref!==room.href)fail(`LABORATORY_ESCALATION_ROUTE_MISMATCH:${room.id}:${labHref}`);
        const deepPage=await browser.newPage();
        await deepPage.setViewport({width:1440,height:1000,deviceScaleFactor:1});
        await deepPage.goto(`${baseUrl}${room.href}?lab-return-verify=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
        await deepPage.waitForSelector('[data-estate-laboratory-return][href="/instruments/"]',{timeout:15000});
        const openedPath=await deepPage.evaluate(()=>location.pathname);
        await Promise.all([
          deepPage.waitForNavigation({waitUntil:'domcontentloaded',timeout:30000}),
          deepPage.click('[data-estate-laboratory-return][href="/instruments/"]')
        ]);
        const returnedPath=await deepPage.evaluate(()=>location.pathname);
        if(openedPath!==room.href||returnedPath!=='/instruments/')fail(`DEEP_CHAMBER_ROUND_TRIP_FAILURE:${room.id}:${openedPath}:${returnedPath}`);
        deepRoundTrips.push({id:room.id,from:'/instruments/',deepRoute:openedPath,returnRoute:returnedPath});
        await deepPage.close();
      }
    }

    viewportReceipts.push({viewport,initial,afterSuite,pageErrors,consoleErrors,screenshot});
    await page.close();
  }
}finally{
  await browser.close();
}

const receipt={
  schema:'ESTATE_LABORATORY_GEN1_VERIFICATION_RECEIPT_v1',
  result:'PASS',
  verifiedAt:new Date().toISOString(),
  baseUrl,
  static:staticReceipt,
  responsive:{
    viewports:viewportReceipts.map(item=>({
      id:item.viewport.id,
      width:item.viewport.width,
      height:item.viewport.height,
      initialOverflow:false,
      afterSuiteOverflow:false,
      touchTargetsAtLeast44px:true,
      lightweightTerminalStates:item.afterSuite.light,
      lightweightHeavyRuntimeLoaded:false,
      pageErrorCount:item.pageErrors.length,
      consoleErrorCount:item.consoleErrors.length,
      screenshot:item.screenshot
    }))
  },
  deepEvidenceCarousel,
  cockpitRuntime,
  compassRuntime,
  deepRoundTrips,
  boundaries:{
    canonicalLaboratoryRoute:'/instruments/',
    governedObservabilityIdentity:true,
    audraliaCommandCockpitRestored:true,
    compassInstrumentsIdentityReconciled:true,
    siteGuideInstrumentsIdentityReconciled:true,
    deepChamberReturnSemantics:deepRoundTrips.length===4,
    experienceAnchorObservabilityBoundaryPreserved:true,
    audraliaProductRootProtected:true,
    staticIframeForbidden:true,
    lightweightHeavyRuntimeBootForbidden:true,
    productionMutationAuthority:false
  }
};
fs.writeFileSync(path.join(ROOT,OUTPUT_DIR,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
