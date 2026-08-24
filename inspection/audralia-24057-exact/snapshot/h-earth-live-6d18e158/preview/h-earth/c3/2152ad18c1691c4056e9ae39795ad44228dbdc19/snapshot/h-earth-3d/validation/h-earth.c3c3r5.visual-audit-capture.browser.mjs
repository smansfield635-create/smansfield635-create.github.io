import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const origin=process.env.CP3D_ORIGIN??'http://127.0.0.1:4173';
const evidenceDirectory=process.env.CP3D_EVIDENCE_DIR??'h-earth-3d/validation/evidence/cp3d';
await mkdir(evidenceDirectory,{recursive:true});

const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=swiftshader','--disable-dev-shm-usage']});
const records=[];
try {
  const page=await browser.newPage({viewport:{width:709,height:1536},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const response=await page.goto(`${origin}/showroom/globe/h-earth/`,{waitUntil:'domcontentloaded',timeout:60000});
  assert.ok(response&&response.status()>=200&&response.status()<400,`R5_VISUAL_HTTP_${response?.status()}`);
  await page.waitForTimeout(7000);
  const canvas=page.locator('#h-earth-functional-landscape-canvas');
  assert.equal(await canvas.count(),1,'R5_VISUAL_CANVAS_MISSING');

  async function capture(index,label){
    const snapshot=await page.evaluate(()=>globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getSnapshot?.()??null);
    assert.ok(snapshot,'R5_VISUAL_SNAPSHOT_MISSING');
    const liveGpu=snapshot?.liveGpu??null;
    const liveGpuActive=liveGpu?.eligible===true&&liveGpu?.status==='RUN_8E_R3D3_LIVE_GPU_CAMERA_RESPONSE_ACTIVE'&&(liveGpu?.counters?.gpuFramebufferPresentationCount??0)>0;
    assert.equal(liveGpuActive,true,'R5_VISUAL_GPU_NOT_ACTIVE');
    const path=`${evidenceDirectory}/c3c3r5-visual-${String(index).padStart(2,'0')}-${label}.png`;
    await canvas.screenshot({path});
    records.push({
      index,
      label,
      path,
      navigation:liveGpu?.latestNavigationState??null,
      liveGpuActive,
      frameCount:liveGpu?.counters?.gpuFramebufferPresentationCount??0,
      rendererPath:liveGpu?.selectedRendererPath??null,
      resourceReceipt:liveGpu?.resources??null
    });
  }

  async function yaw(pointerId,direction=1){
    await page.evaluate(async({id,direction})=>{
      const canvas=document.getElementById('h-earth-functional-landscape-canvas');
      if(!(canvas instanceof HTMLCanvasElement))throw new Error('R5_VISUAL_CANVAS_MISSING');
      const b=canvas.getBoundingClientRect();
      const y=b.top+b.height*.48;
      const x0=b.left+b.width*(direction>0?.76:.24);
      const x1=b.left+b.width*(direction>0?.34:.66);
      const emit=(type,x,buttons)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons,pressure:buttons?0.5:0}));
      emit('pointerdown',x0,1);
      emit('pointermove',x1,1);
      await new Promise(r=>setTimeout(r,220));
      emit('pointerup',x1,0);
      await new Promise(r=>setTimeout(r,180));
    },{id:pointerId,direction});
  }

  await capture(0,'initial');
  for(let view=1;view<=8;view+=1){
    for(let step=0;step<3;step+=1) await yaw(7000+view*10+step,1);
    await capture(view,`yaw-${view}`);
  }

  const readyCount=records.filter(record=>record.liveGpuActive).length;
  assert.equal(readyCount,records.length,'R5_VISUAL_GPU_NOT_READY_DURING_SCAN');
  await writeFile(`${evidenceDirectory}/c3c3r5-visual-audit-capture.receipt.json`,`${JSON.stringify({receiptType:'H_EARTH_C3C3R5_MULTI_VIEW_VISUAL_AUDIT_CAPTURE_v1',status:'CAPTURE_COMPLETE_NOT_VISUAL_PASS',perspectiveChangeCountsAsImprovement:false,viewCount:records.length,records,requiredHumanAudit:['GLOBE_PERCEPTION','NO_RECTANGULAR_TERMINALS','OCEAN_REVEAL','GRID_DEPTH_LEGIBILITY','COLOR_TOPOLOGY_MARRIAGE','NO_OCEAN_DOME_OR_WALL']},null,2)}\n`);
  console.log(JSON.stringify({status:'CAPTURE_COMPLETE_NOT_VISUAL_PASS',viewCount:records.length},null,2));
} finally {
  await browser.close();
}
