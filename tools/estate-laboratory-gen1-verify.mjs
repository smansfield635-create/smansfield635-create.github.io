#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const HTML_PATH='showroom/globe/audralia/disposition/index.html';
const JS_PATH='showroom/globe/audralia/disposition/laboratory.js';
const ANCHOR_GATE_PATH='tools/h-earth-experience-anchor-gate.mjs';
const OUTPUT_DIR=process.env.OUTPUT_DIR||'estate-laboratory-gen1-verification';
const mode=process.argv.includes('--runtime')?'runtime':'static';
const fail=code=>{throw new Error(`ESTATE_LABORATORY_GEN1_VERIFY_FAIL:${code}`)};
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const html=read(HTML_PATH),js=read(JS_PATH),anchorGate=read(ANCHOR_GATE_PATH);

function staticVerification(){
  const requiredHtml=[
    'data-page="estate-laboratory-cockpit"',
    'data-lab-shell',
    'data-heavy-runtime-loaded="false"',
    'Estate Laboratory',
    'Run all lightweight tests',
    'data-instrument-grid',
    'data-run-selected',
    'data-target-panel',
    'data-receipt-output',
    '/showroom/globe/audralia/diagnostic/',
    '/showroom/globe/h-earth/diagnostic/',
    '/showroom/globe/hearth/diagnostic/',
    '/coherence-diagnostic/',
    '/showroom/globe/audralia/disposition/laboratory.js?v=ESTATE_LABORATORY_COCKPIT_GEN1_v1'
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

  const syntax=spawnSync(process.execPath,['--check',JS_PATH],{cwd:ROOT,encoding:'utf8'});
  if(syntax.status!==0)fail(`JAVASCRIPT_SYNTAX:${String(syntax.stderr||syntax.stdout).trim().slice(0,800)}`);

  const exemption=anchorGate.match(/const NON_EXPERIENCE_AUDRALIA_PREFIXES=\[([\s\S]*?)\];/);
  if(!exemption)fail('ANCHOR_GATE_NONEXPERIENCE_SET_MISSING');
  const body=exemption[1];
  if(!body.includes("'showroom/globe/audralia/disposition/'"))fail('DISPOSITION_EXEMPTION_MISSING');
  if(body.includes("'showroom/globe/audralia/'"))fail('AUDRALIA_PRODUCT_ROOT_EXEMPTION_FORBIDDEN');
  const entries=[...body.matchAll(/'([^']+)'/g)].map(match=>match[1]);
  if(entries.length!==1||entries[0]!=='showroom/globe/audralia/disposition/')fail('ANCHOR_GATE_EXEMPTION_SCOPE_WIDENED');
  if(!anchorGate.includes("if(p.startsWith('showroom/globe/audralia/'))return !NON_EXPERIENCE_AUDRALIA_PREFIXES.some(prefix=>p.startsWith(prefix));"))fail('ANCHOR_GATE_EXEMPTION_NOT_BOUND');

  return {
    schema:'ESTATE_LABORATORY_GEN1_STATIC_VERIFICATION_v1',
    result:'PASS',
    laboratoryPaths:[HTML_PATH,JS_PATH],
    instrumentCount:instrumentIds.length,
    lightweightInstrumentCount:7,
    deepInstrumentCount:2,
    staticIframeCount:0,
    audraliaNonExperienceExemptions:entries,
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

try{
  for(const viewport of viewports){
    const page=await browser.newPage();
    const pageErrors=[],consoleErrors=[];
    page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
    page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
    await page.setViewport({width:viewport.width,height:viewport.height,deviceScaleFactor:1});
    await page.goto(`${baseUrl}/showroom/globe/audralia/disposition/?verify=${Date.now()}`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForFunction(()=>document.querySelectorAll('.instrument-card').length===9,{timeout:15000});

    const initial=await page.evaluate(()=>{
      const rects=selectors=>selectors.flatMap(selector=>[...document.querySelectorAll(selector)].filter(el=>!el.hidden).map(el=>{const r=el.getBoundingClientRect();return{selector,width:r.width,height:r.height}}));
      return {
        viewport:{width:innerWidth,height:innerHeight},
        documentScrollWidth:document.documentElement.scrollWidth,
        bodyScrollWidth:document.body.scrollWidth,
        heavyRuntimeLoaded:document.documentElement.dataset.heavyRuntimeLoaded||null,
        iframeCount:document.querySelectorAll('iframe').length,
        controls:rects(['[data-run-all]','[data-run-selected]','.instrument-card'])
      };
    });
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
    }

    viewportReceipts.push({
      viewport,
      initial,
      afterSuite,
      pageErrors,
      consoleErrors,
      screenshot
    });
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
  boundaries:{
    audraliaProductRootProtected:true,
    staticIframeForbidden:true,
    lightweightHeavyRuntimeBootForbidden:true,
    productionMutationAuthority:false
  }
};
fs.writeFileSync(path.join(ROOT,OUTPUT_DIR,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
