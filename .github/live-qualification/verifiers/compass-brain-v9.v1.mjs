import puppeteer from 'puppeteer-core';

const base = process.env.PUBLIC_BASE_URL || 'http://127.0.0.1:4173';
const chrome = process.env.CHROME_PATH;
if (!chrome) throw new Error('CHROME_PATH required');

const browser = await puppeteer.launch({
  headless:'new',
  executablePath:chrome,
  args:[
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=swiftshader',
    '--enable-unsafe-swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist'
  ]
});

const EXPECTED_RENDERER='COMPASS_BRAIN_V9_GEOMETRY_G123_v12';
const EXPECTED_PASS='G1_CEREBRAL_SILHOUETTE_FINISH__G2_LOCALIZED_SUPERIOR_LATERAL_INTEGRATION__G3_INFERIOR_CONTINUITY';
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
  const res=await page.goto(`${base}/inspection/compass/brain-v9/`,{waitUntil:'domcontentloaded',timeout:30000});
  const httpOk=!!res && res.ok();

  await page.waitForSelector('[data-capability-brain-v9]',{timeout:30000});
  await page.waitForFunction(expected=>{
    const c=document.querySelector('[data-capability-brain-v9]');
    return !!(c && c.dataset.brainRenderer===expected && c._brainV9 && Number(c.dataset.objectFrames||0)>=2);
  },{timeout:30000},EXPECTED_RENDERER);

  const before=await page.evaluate(()=>{
    const c=document.querySelector('[data-capability-brain-v9]');
    return {dataset:{...c.dataset},inspect:c._brainV9.inspect(),width:c.width,height:c.height};
  });

  await page.evaluate(()=>{
    const c=document.querySelector('[data-capability-brain-v9]');
    const r=c.getBoundingClientRect();
    const y=r.top+r.height*.52;
    const x0=r.left+r.width*.45;
    const x1=r.left+r.width*.72;
    const pointerId=17;
    const originalSet=c.setPointerCapture;
    const originalRelease=c.releasePointerCapture;
    c.setPointerCapture=()=>{};
    c.releasePointerCapture=()=>{};
    try {
      const fire=(type,x,buttons)=>c.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons,button:type==='pointerdown'?0:-1}));
      fire('pointerdown',x0,1);
      for(let i=1;i<=8;i++) fire('pointermove',x0+(x1-x0)*(i/8),1);
      fire('pointerup',x1,0);
    } finally {
      c.setPointerCapture=originalSet;
      c.releasePointerCapture=originalRelease;
    }
  });
  await page.waitForFunction(yaw0=>Math.abs(document.querySelector('[data-capability-brain-v9]')._brainV9.inspect().yaw-yaw0)>0.03,{timeout:5000},before.inspect.yaw);
  await new Promise(r=>setTimeout(r,250));
  const after=await page.evaluate(()=>document.querySelector('[data-capability-brain-v9]')._brainV9.inspect());

  const triangles=Number(before.dataset.objectTriangleCount||0);
  const components=(before.dataset.brainComponents||'').split(',');
  const pixelArea=before.width*before.height;
  const duration=Date.now()-t0;
  const result={
    viewport:vp.name,
    httpOk,
    renderer:before.dataset.brainRenderer,
    pass:before.dataset.brainGeometryPass,
    depthModel:before.dataset.brainDepthModel,
    construction:before.dataset.brainConstruction,
    triangles,
    components,
    frames:Number(before.dataset.objectFrames||0),
    pixelArea,
    dragYawDelta:Math.abs(after.yaw-before.inspect.yaw),
    loadMs:duration,
    consoleErrors:errors
  };

  const requiredComponents=[
    'multibank-serpentine-cortex',
    'narrow-longitudinal-fissure',
    'central-sulcus-corridor',
    'lateral-sulcus-corridor',
    'precentral-gyri',
    'postcentral-gyri',
    'deep-intermediate-gyri',
    'compact-cerebellar-folia',
    'pons-fibers',
    'medulla-tracts',
    'brainstem',
    'peduncles'
  ];

  const pass = httpOk &&
    before.dataset.brainRenderer===EXPECTED_RENDERER &&
    before.dataset.brainGeometryPass===EXPECTED_PASS &&
    before.dataset.brainDepthModel==='TRUE_WEBGL_GEOMETRY' &&
    before.dataset.brainConstruction==='NO_ENVELOPE_INDEPENDENT_3D_SPLINES' &&
    triangles>=90000 && triangles<130000 &&
    requiredComponents.every(x=>components.includes(x)) &&
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
const out={schema:'DGB_COMPASS_BRAIN_V9_ISOLATED_QUALIFICATION_v6',status:failed?'FAIL':'PASS',surface:'/inspection/compass/brain-v9/',expectedRenderer:EXPECTED_RENDERER,expectedPass:EXPECTED_PASS,checks};
console.log(JSON.stringify(out,null,2));
if(failed) process.exit(1);
