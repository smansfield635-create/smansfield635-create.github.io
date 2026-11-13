// Gen3255: one frozen exact-product Chromium/WebGL frame at a recorded meadow pose.
// Two independent checkouts invoke this source-bound opt-in without editing product bytes.
// Every historical runtime mode below remains unchanged.
if(process.env.H_EARTH_GEN3254_EXACT_SINGLE_FRAME==='1'){
  const Fs=(await import('node:fs')).default;
  const Path=(await import('node:path')).default;
  const Http=(await import('node:http')).default;
  const {createRequire}=await import('node:module');
  const {execFileSync}=await import('node:child_process');
  const {createHash}=await import('node:crypto');
  const Assert=(await import('node:assert/strict')).default;
  const require=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/package.json');
  const {chromium}=require('playwright');
  const out=process.env.H_EARTH_RUNTIME_SCREENSHOT_DIR;
  const subject=process.env.H_EARTH_GEN3254_FRAME_LABEL;
  const expected=process.env.H_EARTH_GEN3254_EXPECTED_HEAD;
  const subjects={
    BASELINE_GEN3252:'d30a0c6a154b9882e782113730e5fbdcf9366c44',
    GEN3254_CANDIDATE:'45858854674824ee12de1939082b59d20dbd8afe'
  };
  Assert(out&&subject&&Object.hasOwn(subjects,subject)&&subjects[subject]===expected,'GEN3254_SUBJECT_BINDING_INVALID');
  const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  Assert.equal(head,expected,'GEN3254_EXACT_HEAD_DRIFT');
  const actualRoot=process.cwd(),kinds={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.gz':'application/octet-stream'};
  const server=Http.createServer((req,res)=>{
    try{
      let p=Path.join(actualRoot,decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if(Fs.statSync(p).isDirectory())p=Path.join(p,'index.html');
      res.setHeader('Content-Type',kinds[Path.extname(p)]||'application/octet-stream');
      Fs.createReadStream(p).pipe(res);
    }catch{res.statusCode=404;res.end('Not found');}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const context=await browser.newContext({viewport:{width:960,height:540},deviceScaleFactor:1});
  const page=await context.newPage(),problems=[],startedAt=Date.now();
  page.on('pageerror',error=>problems.push('PAGE:'+String(error)));
  page.on('console',message=>{if(message.type()==='error')problems.push('CONSOLE:'+message.text())});
  page.on('requestfailed',request=>problems.push('NETWORK:'+request.url()+':'+String(request.failure())));
  page.on('response',response=>{if(response.status()>=400)problems.push('HTTP:'+response.status()+':'+response.url())});
  let routeInterceptions=0,image=null,error=null,result='FAIL';
  Fs.mkdirSync(out,{recursive:true});
  const target={x:124.4127167356344,z:-394.77901544898066,yaw:-58.17022448618572,pitch:-4.2995192852338775};
  try{
    await page.route(url=>url.pathname==='/showroom/globe/h-earth/vegetation-prototype/route.js',async route=>{
      const response=await route.fetch(),source=await response.text(),needle='const cssWidth=';
      Assert.equal(source.split(needle).length,2,'GEN3254_ROUTE_PRESENT_HOOK_ANCHOR');
      routeInterceptions++;
      await route.fulfill({response,contentType:'text/javascript',body:source.replace(needle,
        'globalThis.__Gen3254Present=present;\nconst cssWidth=')});
    });
    const base='http://127.0.0.1:'+server.address().port;
    await page.goto(base+'/showroom/globe/h-earth/',{waitUntil:'domcontentloaded',timeout:120000});
    await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.singleOwnerPrototype==='controls-test',null,{timeout:420000,polling:500});
    await page.mouse.move(400,220);await page.mouse.down();await page.mouse.move(530,235,{steps:14});await page.mouse.up();await page.mouse.wheel(0,-360);
    await page.waitForFunction(()=>document.querySelector('#h-earth-loading-screen')?.dataset.mode==='ready',null,{timeout:120000,polling:500});
    await page.locator('#h-earth-loading-screen [data-enter]').click();
    await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true',null,{timeout:120000,polling:500});
    await page.waitForFunction(()=>{
      const p=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.vegetationBackground?.phase;
      return p==='OWNER_PREPARED'||p==='FAILED';
    },null,{timeout:780000,polling:500});
    const pose=await page.evaluate(async target=>{
      const urls=[...new Set(performance.getEntriesByType('resource').map(r=>r.name).filter(u=>/\/navigation\.js\?/.test(u)))];
      if(urls.length!==1)throw Error('GEN3254_NAV_MODULE_NOT_UNIQUE:'+urls.length);
      const url=urls[0];let source=await(await fetch(url)).text();
      source=source.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,quote,p)=>'from '+JSON.stringify(new URL(p,url).href));
      source+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';
      const nav=await import(URL.createObjectURL(new Blob([source],{type:'text/javascript'})));
      const resolved=nav.auditResolvePosition(target.x,target.z,target.yaw,'SURFACE');
      if(!resolved.eligible)throw Error('GEN3254_RECORDED_CAMERA_INELIGIBLE');
      const state=nav.auditStateFrom(resolved,{yaw:target.yaw,pitch:target.pitch,fov:56,sequence:30001,action:'GEN3254_FROZEN_SAME_CAMERA_COMPARISON'});
      if(typeof globalThis.__Gen3254Present!=='function')throw Error('GEN3254_RENDER_HOOK_MISSING');
      for(let k=0;k<12;k++){globalThis.__Gen3254Present(state);await new Promise(requestAnimationFrame);}
      return {position:state.position,yaw:state.yawDegrees,pitch:state.pitchDegrees,sequence:state.sequence};
    },target);
    const gpu=await page.evaluate(()=>{
      const g=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.();
      const canvas=document.getElementById('h-earth-functional-landscape-canvas');
      return {phase:g?.vegetationBackground?.phase,owner:g?.resources?.singleOwnerVegetation,
        counters:g?.counters,frame:g?.frameRecords?.at(-1)??null,canvas:{width:canvas?.width,height:canvas?.height}};
    });
    Assert.equal(gpu.phase,'OWNER_PREPARED','GEN3254_OWNER_NOT_PREPARED');
    Assert.equal(gpu.owner?.installedRootCount,3805291,'GEN3254_ROOTS_DRIFT');
    Assert.equal(gpu.owner?.gpuRequestedBytes,60884656,'GEN3254_GPU_REQUESTED_DRIFT');
    Assert.equal(gpu.owner?.gpuObservedBufferBytes,60884656,'GEN3254_GPU_BUFFER_DRIFT');
    Assert.equal(gpu.owner?.gpuUploadedBytes,60884656,'GEN3254_GPU_UPLOAD_DRIFT');
    Assert.equal(gpu.owner?.perFrameUploadBytes,0,'GEN3254_GPU_REUPLOAD');
    Assert.equal(gpu.owner?.allocationGlError,0,'GEN3254_GPU_ALLOCATION_ERROR');
    Assert.equal(gpu.owner?.uploadGlError,0,'GEN3254_GPU_UPLOAD_ERROR');
    Assert.equal(gpu.counters?.worldRebuildCount,0,'GEN3254_WORLD_REBUILT');
    Assert(gpu.counters?.gpuFramebufferPresentationCount>0,'GEN3254_NO_WEBGL_FRAME');
    Assert.equal(routeInterceptions,1,'GEN3254_ROUTE_INTERCEPT_UNEXPECTED');
    Assert.equal(problems.length,0,'GEN3254_BROWSER_ERRORS:'+problems.join('|'));
    Assert.equal(pose.sequence,30001,'GEN3254_NAV_SEQUENCE_INVALID');
    Assert.equal(pose.yaw,target.yaw,'GEN3254_YAW_INVALID');
    Assert.equal(pose.pitch,target.pitch,'GEN3254_PITCH_INVALID');
    const camera=gpu.frame?.cameraPosition;
    Assert(camera&&Math.hypot(camera.x-target.x,camera.z-target.z)<0.02,'GEN3254_CAMERA_SUPPORT_OFFSET');
    const png=await page.locator('#h-earth-functional-landscape-canvas').screenshot({timeout:120000});
    Fs.writeFileSync(Path.join(out,subject+'.png'),png);
    image={subject,head,canvas:gpu.canvas,camera,pose,frameCount:gpu.counters.gpuFramebufferPresentationCount,
      rootCount:gpu.owner.installedRootCount,gpuRequestedBytes:gpu.owner.gpuRequestedBytes,
      gpuPackedBytes:gpu.owner.gpuObservedBufferBytes,gpuUploadedBytes:gpu.owner.gpuUploadedBytes,
      pngBytes:png.byteLength,pngSha256:createHash('sha256').update(png).digest('hex'),routeInterceptions};
    result='PASS_CAPTURED';
  }catch(e){error=String(e);problems.push(error);}
  finally{
    Fs.writeFileSync(Path.join(out,'receipt.json'),JSON.stringify({
      schema:'H_EARTH_GEN3254_EXACT_SOURCE_SINGLE_CAMERA_NATIVE_FRAME_v1',
      result,head,subject,image,problems,noProductMutation:true,physicalAndroidAccepted:false,
      elapsedMs:Date.now()-startedAt
    },null,2)+'\n');
    console.log(JSON.stringify({result,head,subject,image,problems}));
    await context.close();await browser.close();server.close();
  }
  if(result!=='PASS_CAPTURED')process.exitCode=1;
  process.exit();
}

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const root=process.cwd(),types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.gz':'application/octet-stream'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));try{if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/package.json'),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:960,height:540}}),errors=[],views=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const started=performance.now();
try{
 await page.goto(`http://127.0.0.1:${server.address().port}/showroom/globe/h-earth/`,{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.singleOwnerPrototype==='controls-test',{timeout:240000});
 const sample=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const gpu=await page.evaluate(()=>globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt());const owner=gpu.resources.singleOwnerVegetation;assert(owner.gpuAllocationVerified);assert.equal(owner.gpuObservedBufferBytes,owner.installedRootCount*16);assert.equal(owner.gpuUploadedBytes,owner.gpuObservedBufferBytes);assert.equal(owner.perFrameUploadBytes,0);assert.equal(owner.allocationGlError,0);assert.equal(owner.uploadGlError,0);views.push({name,owner,frame:gpu.frame??null,counters:gpu.counters});};
 await sample('ENTRY');
 await page.mouse.move(400,220);await page.mouse.down();await page.mouse.move(530,235,{steps:14});await page.mouse.up();await page.mouse.wheel(0,-360);
 await page.waitForFunction(()=>document.querySelector('#h-earth-loading-screen')?.dataset.mode==='ready',{timeout:30000});
 await page.locator('#h-earth-loading-screen [data-enter]').click();
 await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true',{timeout:30000});
 await sample('ENTERED');
 for(const delta of [-480,-480,480,480]){await page.mouse.wheel(0,delta);await sample('WHEEL_'+delta);}
 for(const dx of [140,-280,140]){await page.mouse.move(400,220);await page.mouse.down();await page.mouse.move(400+dx,220,{steps:16});await page.mouse.up();await sample('TURN_'+dx);}
 assert(views.every(v=>v.owner.installedRootCount===views[0].owner.installedRootCount));assert.equal(errors.length,0,errors.join('\n'));
 const receipt={schema:'H_EARTH_TERRAIN_GRASS_RUNTIME_v2',head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingTreeDiffSha256:process.env.DIFF_SHA256??null,result:'PASS',elapsedMilliseconds:performance.now()-started,browser:await browser.version(),scope:'LOCAL_SOFTWARE_WEBGL2; CPU_SUBMISSION_TIMES_EXCLUDE_GPU_EXECUTION; NOT_PHYSICAL_DEVICE_ACCEPTANCE',views,errors};
 fs.writeFileSync(new URL('./runtime.json',import.meta.url),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({result:receipt.result,roots:views[0].owner.installedRootCount,bytes:views[0].owner.gpuObservedBufferBytes,views:views.length,elapsedMilliseconds:receipt.elapsedMilliseconds}));
}catch(e){console.error(JSON.stringify({error:String(e),errors,diagnostics:await page.evaluate(()=>({route:document.querySelector('#h-earth-functional-landscape-route')?.dataset,loader:globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.()})).catch(()=>null)}));throw e;}finally{await browser.close();server.close();}
