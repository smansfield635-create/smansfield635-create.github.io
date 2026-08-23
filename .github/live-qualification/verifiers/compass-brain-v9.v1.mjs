import puppeteer from 'puppeteer-core';

const base = process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:4173';
const chrome = process.env.CHROME_PATH;
if (!chrome) throw new Error('CHROME_PATH required');

const browser = await puppeteer.launch({headless:'new',executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
const viewports = [
  {name:'phone',width:390,height:844,deviceScaleFactor:1},
  {name:'tablet',width:820,height:1180,deviceScaleFactor:1},
  {name:'desktop',width:1440,height:900,deviceScaleFactor:1}
];
const checks=[];
let failed=false;

for (const vp of viewports) {
  const page=await browser.newPage();
  const errors=[];
  page.on('console',m=>{ if(m.type()==='error') errors.push(m.text()); });
  page.on('pageerror',e=>errors.push(String(e)));
  await page.setViewport(vp);
  const t0=Date.now();
  const res=await page.goto(`${base}/inspection/compass/brain-v9/`,{waitUntil:'networkidle0',timeout:30000});
  const httpOk=!!res && res.ok();
  await page.waitForSelector('[data-capability-brain-v9][data-brain-renderer*="REFERENCE_REBUILD"]',{timeout:15000});
  await page.waitForFunction(()=>{
    const c=document.querySelector('[data-capability-brain-v9]');
    return c && Number(c.dataset.objectFrames||0) >= 2 && c._brainV9;
  },{timeout:15000});
  const before=await page.evaluate(()=>{
    const c=document.querySelector('[data-capability-brain-v9]');
    return {dataset:{...c.dataset},inspect:c._brainV9.inspect(),width:c.width,height:c.height};
  });
  const box=await page.$eval('[data-capability-brain-v9]',el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}});
  await page.mouse.move(box.x+box.width*.55,box.y+box.height*.52);
  await page.mouse.down();
  await page.mouse.move(box.x+box.width*.72,box.y+box.height*.60,{steps:8});
  await page.mouse.up();
  await new Promise(r=>setTimeout(r,350));
  const after=await page.evaluate(()=>document.querySelector('[data-capability-brain-v9]')._brainV9.inspect());
  const triangles=Number(before.dataset.objectTriangleCount||0);
  const components=before.dataset.brainComponents||'';
  const pixelArea=before.width*before.height;
  const duration=Date.now()-t0;
  const result={
    viewport:vp.name,
    httpOk,
    renderer:before.dataset.brainRenderer,
    depthModel:before.dataset.brainDepthModel,
    triangles,
    components,
    frames:Number(before.dataset.objectFrames||0),
    pixelArea,
    dragYawDelta:Math.abs(after.yaw-before.inspect.yaw),
    loadMs:duration,
    consoleErrors:errors
  };
  const pass = httpOk &&
    before.dataset.brainRenderer==='COMPASS_BRAIN_V9_REFERENCE_REBUILD_v1' &&
    before.dataset.brainDepthModel==='TRUE_WEBGL_GEOMETRY' &&
    triangles>=24000 && triangles<50000 &&
    components.includes('paired-cerebellar-lobes') &&
    components.includes('continuous-pons-medulla-brainstem') &&
    components.includes('longitudinal-fissure') &&
    result.dragYawDelta>0.03 &&
    result.frames>=2 &&
    pixelArea<=2500000 &&
    errors.length===0;
  result.status=pass?'PASS':'FAIL';
  if(!pass) failed=true;
  checks.push(result);
  await page.close();
}

await browser.close();
const out={schema:'DGB_COMPASS_BRAIN_V9_ISOLATED_QUALIFICATION_v1',status:failed?'FAIL':'PASS',surface:'/inspection/compass/brain-v9/',checks};
console.log(JSON.stringify(out,null,2));
if(failed) process.exit(1);
