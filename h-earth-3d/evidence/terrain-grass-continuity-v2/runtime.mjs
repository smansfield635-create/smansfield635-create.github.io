import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const root=process.cwd(),types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.gz':'application/octet-stream'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));try{if(fs.statSync(p).isDirectory())p=path.join(p,'index.html');res.setHeader('Content-Type',types[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const require=createRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/package.json':import.meta.url),{chromium}=require('playwright');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH??chromium.executablePath(),headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:960,height:540}}),errors=[],views=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const started=performance.now();
const gen3238=process.env.H_EARTH_GEN3238_GPU_ONLY==='1';
const exactGen3238='125d5251d07955d8e17be7d8e28134ebc41e466f';
const actualHead=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(gen3238)assert.equal(actualHead,exactGen3238,'GEN3238_PRODUCT_HEAD_NOT_EXACT');
const networkErrors=[],images=[];
if(gen3238){
 page.on('requestfailed',request=>networkErrors.push({url:request.url(),failure:request.failure()}));
 page.on('response',response=>{if(response.status()>=400)networkErrors.push({url:response.url(),status:response.status()});});
}
const gen3238Output=process.env.H_EARTH_RUNTIME_OUTPUT_PATH??null;
const gen3238ScreenshotDir=process.env.H_EARTH_RUNTIME_SCREENSHOT_DIR??null;
try{
 await page.goto(`http://127.0.0.1:${server.address().port}/showroom/globe/h-earth/`,{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.singleOwnerPrototype==='controls-test',{timeout:240000});
 const sample=async name=>{await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const gpu=await page.evaluate(()=>globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt());const owner=gpu?.resources?.singleOwnerVegetation;assert(owner,'SINGLE_OWNER_GPU_RECEIPT_MISSING');assert(owner.gpuAllocationVerified);assert.equal(owner.gpuObservedBufferBytes,owner.installedRootCount*16);assert.equal(owner.gpuUploadedBytes,owner.gpuObservedBufferBytes);assert.equal(owner.perFrameUploadBytes,0);assert.equal(owner.allocationGlError,0);assert.equal(owner.uploadGlError,0);if(gen3238){
 assert.equal(owner.installedRootCount,3805291,'GEN3238_ROOT_COUNT');
 assert.equal(owner.gpuRequestedBytes,60884656,'GEN3238_REQUESTED_GPU_BYTES');
 assert.equal(owner.gpuObservedBufferBytes,60884656,'GEN3238_OBSERVED_GPU_BYTES');
 assert.equal(owner.gpuUploadedBytes,60884656,'GEN3238_UPLOADED_GPU_BYTES');
 assert.equal(gpu?.vegetationBackground?.phase,'OWNER_PREPARED','GEN3238_OWNER_NOT_PREPARED');
 assert.equal(gpu?.counters?.worldRebuildCount,0,'GEN3238_WORLD_REBUILD');
 assert(gpu?.counters?.gpuFramebufferPresentationCount>0,'GEN3238_NO_WEBGL_PRESENTATION');
}
views.push({name,owner,frame:gpu.frame??gpu.frameRecords?.at(-1)??null,counters:gpu.counters});
if(gen3238){
 const png=await page.locator('#h-earth-functional-landscape-canvas').screenshot({timeout:60000});
 const digest=createHash('sha256').update(png).digest('hex');
 images.push({name,sha256:digest,bytes:png.byteLength,position:gpu.frameRecords?.at(-1)?.cameraPosition??null,frameCount:gpu.counters?.gpuFramebufferPresentationCount??0});
 if(gen3238ScreenshotDir){fs.mkdirSync(gen3238ScreenshotDir,{recursive:true});fs.writeFileSync(path.join(gen3238ScreenshotDir,name+'.png'),png);}
}};
 if(!gen3238)await sample('ENTRY');
 await page.mouse.move(400,220);await page.mouse.down();await page.mouse.move(530,235,{steps:14});await page.mouse.up();await page.mouse.wheel(0,-360);
 await page.waitForFunction(()=>document.querySelector('#h-earth-loading-screen')?.dataset.mode==='ready',{timeout:30000});
 await page.locator('#h-earth-loading-screen [data-enter]').click();
 await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true',{timeout:30000});
 if(gen3238){
  // Gen3187 precedent: controls/READY precede asynchronous replacement-owner residency.
  await page.waitForFunction(()=>{
   const phase=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.vegetationBackground?.phase;
   return phase==='OWNER_PREPARED'||phase==='FAILED';
  },null,{timeout:780000,polling:500});
  const state=await page.evaluate(()=>globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.());
  assert.equal(state?.vegetationBackground?.phase,'OWNER_PREPARED','BACKGROUND_OWNER_PREPARATION_FAILED:'+String(state?.vegetationBackground?.error??''));
  assert(state?.resources?.singleOwnerVegetation,'PREPARED_WITHOUT_SINGLE_OWNER_GPU');
  await sample('NEAR_ARRIVAL');
  // The genuine wheel intake provides different measured positions and browser frames.
  for(const [name,delta] of [['CORRIDOR_TRAVEL',-480],['FAR_TRAVEL',-480],['RETURN_TRAVEL',960]]){
   await page.mouse.wheel(0,delta);
   await sample(name);
  }
  const positions=images.map(image=>image.position&&[image.position.x,image.position.z].map(n=>Number(n).toFixed(3)).join(':'));
  assert(positions.every(Boolean),'GEN3238_VIEW_POSITIONS_MISSING');
  assert(new Set(positions).size>=3,'GEN3238_NEAR_CORRIDOR_FAR_NOT_DISTINCT');
  assert(new Set(images.map(image=>image.sha256)).size>=2,'GEN3238_RENDERED_VIEWS_NOT_CHANGED');
  assert.equal(networkErrors.length,0,'GEN3238_BROWSER_NETWORK_ERRORS:'+JSON.stringify(networkErrors));
 }else{
  await sample('ENTERED');
  for(const delta of [-480,-480,480,480]){await page.mouse.wheel(0,delta);await sample('WHEEL_'+delta);}
  for(const dx of [140,-280,140]){await page.mouse.move(400,220);await page.mouse.down();await page.mouse.move(400+dx,220,{steps:16});await page.mouse.up();await sample('TURN_'+dx);}
 }
 assert(views.every(v=>v.owner.installedRootCount===views[0].owner.installedRootCount));assert.equal(errors.length,0,errors.join('\n'));
 const receipt={schema:gen3238?'H_EARTH_GEN3238_GPU_RESIDENCY_RUNTIME_v1':'H_EARTH_TERRAIN_GRASS_RUNTIME_v2',head:actualHead,workingTreeDiffSha256:process.env.DIFF_SHA256??null,result:'PASS',elapsedMilliseconds:performance.now()-started,browser:await browser.version(),scope:'LOCAL_SOFTWARE_WEBGL2; CPU_SUBMISSION_TIMES_EXCLUDE_GPU_EXECUTION; NOT_PHYSICAL_DEVICE_ACCEPTANCE',views,errors,...(gen3238?{networkErrors,images,requiredRoots:3805291,requiredGpuBytes:60884656,fullOwnerResidencyVerified:true}: {})};
 const output=gen3238&&gen3238Output?gen3238Output:new URL('./runtime.json',import.meta.url);
 if(gen3238&&gen3238Output)fs.mkdirSync(path.dirname(gen3238Output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({result:receipt.result,roots:views[0].owner.installedRootCount,bytes:views[0].owner.gpuObservedBufferBytes,views:views.length,elapsedMilliseconds:receipt.elapsedMilliseconds}));
}catch(e){
 const diagnostics=await page.evaluate(()=>({route:document.querySelector('#h-earth-functional-landscape-route')?.dataset,loader:globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.(),vegetation:globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.vegetationBackground})).catch(()=>null);
 const failure={schema:'H_EARTH_GEN3238_GPU_RESIDENCY_RUNTIME_v1',result:'FAIL',head:actualHead,error:String(e),errors,networkErrors,views,images,diagnostics};
 if(gen3238&&gen3238Output){fs.mkdirSync(path.dirname(gen3238Output),{recursive:true});fs.writeFileSync(gen3238Output,JSON.stringify(failure,null,2)+'\n');}
 console.error(JSON.stringify(failure));throw e;
}finally{await browser.close();server.close();}
