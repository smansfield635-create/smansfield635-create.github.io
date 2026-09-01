import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const resultPath = process.env.RUNTIME_RESULT_PATH;
const url = `${process.env.PUBLIC_BASE_URL}/inspection/h-earth/stage1-cost-decoupling/showroom/globe/audralia/weather-presentation-reconciliation/`;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: 'new',
  args: ['--no-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});

let result;
try {
  const page = await browser.newPage();
  await page.setViewport({width:720,height:1280,deviceScaleFactor:1});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime()?.invariants?.pass===true,{timeout:45000});
  await page.waitForFunction(()=>window.__AUDRALIA_FAP1_STAGE1_COST_DECOUPLING__?.getRuntimeEvidence?.()?.patchedCloudShaders>0,{timeout:15000});
  const evidence = await page.evaluate(()=>({
    pageStatus:document.querySelector('[data-h-earth-status]')?.dataset?.status||null,
    invariantsPass:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime()?.invariants?.pass===true,
    stage1:window.__AUDRALIA_FAP1_STAGE1_COST_DECOUPLING__?.getRuntimeEvidence?.()||null,
    error:window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__||null
  }));
  const pass = evidence.invariantsPass && evidence.stage1?.patchedCloudShaders > 0 && !evidence.error;
  result = {status:pass?'PASS':'FAIL', verifier:'h-earth-stage1-runtime.v1', url, viewport:{width:720,height:1280,deviceScaleFactor:1}, evidence};
} catch (error) {
  result = {status:'FAIL', verifier:'h-earth-stage1-runtime.v1', url, error:String(error?.stack||error)};
} finally {
  await browser.close();
}

fs.writeFileSync(resultPath, JSON.stringify(result,null,2)+'\n');
if (result.status !== 'PASS') process.exit(1);
