// Exact-checkout desktop and constrained touch qualification. No product shims.
// Usage: node tools/h-earth-full-environment-touch-verification.mjs <40-hex SHA> <output-directory>
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const [sha,out]=process.argv.slice(2),root=process.cwd();
if(!/^[0-9a-f]{40}$/.test(sha??'')||!out)throw Error('EXACT_SHA_AND_OUTPUT_REQUIRED');
if(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()!==sha)throw Error('CHECKOUT_SHA_MISMATCH');
if(execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('TRACKED_CHECKOUT_NOT_CLEAN');
await fs.mkdir(out,{recursive:true});
const types={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let file=path.resolve(root,'.'+pathname);
    if(!file.startsWith(root+path.sep))throw Error('PATH_OUTSIDE_CHECKOUT');
    if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');
    res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');
    res.setHeader('Cache-Control','no-store');res.end(await fs.readFile(file));
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const receipts=[];
try{
  browser=await chromium.launch({headless:true});
  for(const profile of [{id:'desktop',viewport:{width:1280,height:800},cpu:1},{id:'constrained-mobile',viewport:{width:390,height:844},cpu:4,isMobile:true,hasTouch:true},{id:'mobile-landscape-controls',viewport:{width:844,height:390},cpu:1,isMobile:true,hasTouch:true}]){
    const receipt={sha,profile,emulationOnly:true,errors:[],requestsFailed:[],result:'FAIL'};
    const context=await browser.newContext({viewport:profile.viewport,isMobile:profile.isMobile??false,hasTouch:profile.hasTouch??false,deviceScaleFactor:1});
    const page=await context.newPage(),cdp=await context.newCDPSession(page);
    await page.addInitScript(()=>{window.__vegetationProgressEvidence=[];window.__vegetationTextEvidence=[];let lastText='';new MutationObserver(()=>{const e=document.getElementById('h-earth-vegetation-progress');if(e&&e.textContent!==lastText){lastText=e.textContent;window.__vegetationTextEvidence.push({atMs:performance.now(),text:lastText,complete:window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getVegetationResidency()?.complete??false});}}).observe(document,{childList:true,subtree:true,characterData:true});window.addEventListener('h-earth-vegetation-progress',event=>{window.__vegetationProgressEvidence.push({atMs:performance.now(),...event.detail});});});
    page.on('pageerror',e=>receipt.errors.push(String(e)));
    page.on('console',m=>{if(m.type()==='error')receipt.errors.push(m.text());});
    page.on('requestfailed',r=>receipt.requestsFailed.push({url:r.url(),error:r.failure()}));
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
    try{
      await page.goto(`http://127.0.0.1:${server.address().port}/showroom/globe/h-earth/`,{waitUntil:'domcontentloaded',timeout:240000});
      await page.waitForFunction(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE?.ready===true,{},{timeout:240000});
      receipt.atReady=await page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getVegetationResidency());
      receipt.readyHitTest=await page.evaluate(()=>{const c=document.querySelector('canvas'),b=c.getBoundingClientRect(),e=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2),l=document.querySelector('.h-earth-experience-loader');return {atMs:performance.now(),hitTag:e?.tagName,hitClass:e?.className,canvasHit:e===c,loaderReady:l?.dataset.ready??null,loaderConnected:!!l};});
      await page.waitForFunction(()=>{const c=document.querySelector('canvas'),b=c?.getBoundingClientRect();return b&&document.elementFromPoint(b.x+b.width/2,b.y+b.height/2)===c;},{},{timeout:30000});
      receipt.inputEnabledAtMs=await page.evaluate(()=>performance.now());
      receipt.progressAtReady=await page.evaluate(()=>{const e=document.getElementById('h-earth-vegetation-progress');if(!e)return null;const range=document.createRange();range.selectNodeContents(e);return {text:e.textContent,hidden:e.hidden,pointerEvents:getComputedStyle(e).pointerEvents,hudRects:[...document.querySelectorAll('.semantic-readout,.h-earth-3d-public-header,#h-earth-b10-world-heading')].map(n=>n.getBoundingClientRect().toJSON()),font:getComputedStyle(e).font,textRect:range.getBoundingClientRect().toJSON(),rect:e.getBoundingClientRect().toJSON()};});
      if(receipt.progressAtReady&&receipt.progressAtReady.hudRects.some(h=>{const b=receipt.progressAtReady.rect;return h.width>0&&h.height>0&&b.left<h.right&&b.right>h.left&&b.top<h.bottom&&b.bottom>h.top;}))throw Error('VEGETATION_PROGRESS_OVERLAPS_HUD');
      if(receipt.progressAtReady&&!(receipt.progressAtReady.textRect.width>80&&receipt.progressAtReady.textRect.height>8))throw Error('VEGETATION_PROGRESS_TEXT_NOT_RENDERED');
      if(receipt.progressAtReady&&!(receipt.progressAtReady.rect.width>0&&receipt.progressAtReady.rect.height>0&&receipt.progressAtReady.rect.x>=0&&receipt.progressAtReady.rect.y>=0&&receipt.progressAtReady.rect.right<=profile.viewport.width&&receipt.progressAtReady.rect.bottom<=profile.viewport.height))throw Error('VEGETATION_PROGRESS_OUTSIDE_VIEWPORT');
      if(!receipt.progressAtReady||receipt.progressAtReady.hidden||receipt.progressAtReady.pointerEvents!=='none'||!receipt.progressAtReady.text)throw Error('NONBLOCKING_VEGETATION_PROGRESS_MISSING');
      await page.screenshot({path:path.join(out,profile.id+'-preparing.png')});
      await fs.writeFile(path.join(out,profile.id+'-ready.json'),JSON.stringify(receipt,null,2)+'\n');
      if(profile.hasTouch){
        const canvas=page.locator('canvas').first(),box=await canvas.boundingBox();
        if(!box)throw Error('CANVAS_NOT_VISIBLE');
        receipt.canvasBox=box;
        const read=()=>page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getIntakeReceipt());
        const move=async(direction)=>{
          const before=await read(),x=box.x+box.width/2,y=box.y+box.height/2;
          const points=offset=>[{id:1,x:x-25,y:y+offset},{id:2,x:x+25,y:y+offset}];
          await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(0)});
          for(let i=1;i<=10;i++){
            await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points(direction*i*box.height*0.012)});
            await page.waitForTimeout(30);
          }
          await page.waitForTimeout(300);
          await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
          const after=await read();
          const a=before.currentNavigationState.position,b=after.currentNavigationState.position;
          receipt.lastGesture={direction,before,after};
          if(Math.hypot(b.x-a.x,b.z-a.z)<0.001)throw Error('TWO_FINGER_TRAVEL_NO_MOVEMENT');
          const yaw=before.currentNavigationState.yawDegrees*Math.PI/180;
          const forwardDistance=(b.x-a.x)*Math.sin(yaw)-(b.z-a.z)*Math.cos(yaw);
          if(forwardDistance*(-direction)<=0)throw Error('TWO_FINGER_CAMERA_RELATIVE_DIRECTION_FAILED');
          await page.waitForTimeout(200);
          const stopped=(await read()).currentNavigationState.position;
          if(Math.hypot(stopped.x-b.x,stopped.z-b.z)>0.001)throw Error('TOUCH_RELEASE_DID_NOT_STOP_TRAVEL');
          return {requestedPixels:direction*box.height*.12,normalizedCentroidTravel:direction*.12,before:a,after:b,delta:{x:b.x-a.x,z:b.z-a.z},counters:after.counters};
        };
        receipt.forward=await move(-1);receipt.backward=await move(1);
        const cx=box.x+box.width/2,cy=box.y+box.height/2;
        const lookBefore=await read();
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:cx,y:cy}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:cx+box.width*.12,y:cy}]});
        await page.waitForTimeout(300);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
        const lookAfter=await read();
        if(Math.abs(lookAfter.currentNavigationState.yawDegrees-lookBefore.currentNavigationState.yawDegrees)<0.01)throw Error('ONE_FINGER_LOOK_NO_ROTATION');
        await page.waitForTimeout(200);
        const lookStopped=await read();
        if(Math.abs(lookStopped.currentNavigationState.yawDegrees-lookAfter.currentNavigationState.yawDegrees)>0.01)throw Error('LOOK_RELEASE_DID_NOT_STOP');
        receipt.look={requestedPixels:box.width*.12,normalizedCentroidTravel:.12,before:lookBefore.currentNavigationState,after:lookAfter.currentNavigationState,stopped:lookStopped.currentNavigationState};
        const cancelBefore=await read();
        await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:cx-25,y:cy},{id:2,x:cx+25,y:cy}]});
        await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:cx-25,y:cy-box.height*.12},{id:2,x:cx+25,y:cy-box.height*.12}]});
        await page.waitForTimeout(250);
        await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
        const cancelled=await read();
        if(cancelled.counters.pointerCancelCount<=cancelBefore.counters.pointerCancelCount)throw Error('NATIVE_POINTER_CANCEL_NOT_OBSERVED');
        if(Math.hypot(cancelled.currentNavigationState.position.x-cancelBefore.currentNavigationState.position.x,cancelled.currentNavigationState.position.z-cancelBefore.currentNavigationState.position.z)<0.001)throw Error('CANCEL_TEST_HAD_NO_ACTIVE_TRAVEL');
        await page.waitForTimeout(250);
        const cancelStopped=await read(),a=cancelled.currentNavigationState.position,b=cancelStopped.currentNavigationState.position;
        if(Math.hypot(b.x-a.x,b.z-a.z)>0.001)throw Error('TOUCH_CANCEL_DID_NOT_STOP');
        receipt.cancel={requestedPixels:-box.height*.12,normalizedCentroidTravel:-.12,cancelled:cancelled.currentNavigationState,stopped:cancelStopped.currentNavigationState,counters:cancelStopped.counters};

        if(receipt.forward.delta.x*receipt.backward.delta.x+receipt.forward.delta.z*receipt.backward.delta.z>=0)throw Error('TWO_FINGER_DIRECTIONS_NOT_OPPOSED');
      }
      await page.waitForFunction(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getVegetationResidency()?.complete===true,{},{timeout:480000});
      receipt.final=await page.evaluate(()=>({residency:window.H_EARTH_RUN8E_PUBLIC_ROUTE.getVegetationResidency(),live:window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),startup:window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS.getReceipt(),progress:window.__vegetationProgressEvidence,progressText:window.__vegetationTextEvidence}));
      const r=receipt.final.residency,t=r.timing;
      if(r.residentInstanceCount!==27585||r.residentBatchCount!==108||r.droppedPlacementCount!==0||r.worldRebuildCount!==0||r.cameraIndependent!==true)throw Error('FINAL_ENVIRONMENT_INVARIANT_FAILED');
      if(![t?.firstFrameAtMs,t?.readyAtMs,t?.vegetationStartAtMs,t?.vegetationCompleteAtMs].every(Number.isFinite)||!(t.firstFrameAtMs<=t.readyAtMs&&t.readyAtMs<t.vegetationStartAtMs&&t.vegetationStartAtMs<t.vegetationCompleteAtMs))throw Error('STARTUP_ORDER_FAILED');
      const events=receipt.final.progress,loads=events.filter(e=>e.phase==='RESIDENCY');
      if(loads.length!==108||loads.some((e,i)=>e.residentBatchCount!==i+1)||events.at(-1)?.phase!=='COMPLETE')throw Error('MEASURED_PROGRESS_SEQUENCE_FAILED');
      if(!receipt.final.progressText.some(e=>e.text.startsWith('Loading vegetation')&&e.text.includes('%'))||receipt.final.progressText.some(e=>e.text.includes('100%')&&!e.complete))throw Error('RENDERED_PERCENTAGE_PROGRESS_FAILED');
      const stages=receipt.final.startup.timing.stages,firstVegetation=stages.FIRST_VEGETATION_FRAME_PRESENTED?.firstPassAtMs;
      if(!Number.isFinite(firstVegetation)||firstVegetation<t.readyAtMs||firstVegetation>t.vegetationCompleteAtMs)throw Error('FIRST_VISIBLE_VEGETATION_TIMING_MISSING');
      if(!(stages.OASIS_PREPARATION_START?.firstPassAtMs>t.readyAtMs&&stages.OASIS_PREPARATION_START.firstPassAtMs<stages.VEGETATION_PLAN_VALIDATED.firstPassAtMs))throw Error('POST_READY_PREPARATION_OVERLAP_FAILED');
      if(receipt.errors.length||receipt.requestsFailed.length)throw Error('BROWSER_ERRORS');
      await page.screenshot({path:path.join(out,profile.id+'.png')});receipt.result='PASS';
    }catch(error){receipt.failure=String(error);process.exitCode=1;}
    finally{receipts.push(receipt);await fs.writeFile(path.join(out,profile.id+'.json'),JSON.stringify(receipt,null,2)+'\n');await context.close();}
  }
}catch(error){
  process.exitCode=1;
  await fs.writeFile(path.join(out,'infrastructure-failure.json'),JSON.stringify({sha,result:'BLOCKED',failure:String(error)},null,2)+'\n');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
console.log(JSON.stringify({schema:'H_EARTH_STARTUP_TOUCH_QUALIFICATION_v1',sha,receipts},null,2));
