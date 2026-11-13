// Gen3256: one exact-live-source, nonpublished shader-tint GPU isolation.
// This opt-in branch executes before the unchanged historical runtime below.
if (process.env.H_EARTH_GEN3256_OPERAND_ISOLATION === '1') {
  const {createRequire: makeRequire} = await import('node:module');
  const {createHash: shaCreate} = await import('node:crypto');
  const {execFileSync: exec} = await import('node:child_process');
  const assert = (await import('node:assert/strict')).default;
  const require = makeRequire(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/package.json');
  const {chromium} = require('playwright');
  const {PNG} = require('pngjs');
  const productHead = 'd30a0c6a154b9882e782113730e5fbdcf9366c44';
  const actualHead = exec('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  assert.equal(actualHead,productHead,'GEN3256_EXACT_PUBLISHED_PRODUCT_HEAD');
  const bodyNeedle='base=mix(base,habitatSoil,habitatColorCoverage*.68);';
  const rendererPath='/showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
  const outDir=process.env.H_EARTH_RUNTIME_SCREENSHOT_DIR;
  assert(outDir,'GEN3256_OUTPUT_DIR_REQUIRED');fs.mkdirSync(outDir,{recursive:true});
  const errors=[],images=[],startedAt=Date.now();
  const baseTypes={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml','.gz':'application/octet-stream'};
  const localServer=http.createServer((req,res)=>{
    try{
      let file=path.join(process.cwd(),decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
      res.setHeader('Content-Type',baseTypes[path.extname(file)]||'application/octet-stream');
      fs.createReadStream(file).pipe(res);
    }catch(error){res.statusCode=404;res.end('Not found');}
  });
  await new Promise(resolve=>localServer.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const urlBase='http://127.0.0.1:'+localServer.address().port;
  const target={x:124.4127167356344,z:-394.77901544898066,yaw:-58.17022448618572,pitch:-4.2995192852338775};
  async function capture(name,mode){
    const context=await browser.newContext({viewport:{width:960,height:540},deviceScaleFactor:1});
    const page=await context.newPage(),problems=[];
    page.on('pageerror',e=>problems.push('PAGE:'+String(e)));
    page.on('console',m=>{if(m.type()==='error')problems.push('CONSOLE:'+m.text())});
    page.on('requestfailed',r=>problems.push('NETWORK:'+r.url()+':'+String(r.failure())));
    let rendererIntercepted=false,routeIntercepted=false,actualSourceDigest=null;
    await page.route(u=>u.pathname===rendererPath,async route=>{
      const response=await route.fetch(),source=await response.text();
      assert.equal(source.split(bodyNeedle).length,2,'GEN3256_SHADER_NEEDLE_NOT_EXACT');
      actualSourceDigest=shaCreate('sha256').update(source).digest('hex');
      rendererIntercepted=true;
      const coverageNeedle='float habitatColorCoverage=clamp(habitatCoverage+habitatMaterialProtection(vWorldPosition.xz)*(habitatMaterialCoverage-habitatCoverage),0.0,1.0);';
      const unionNeedle='habitatColorCoverage=max(habitatColorCoverage,meadowOccupancy*meadowOuterWeight);';
      assert.equal(source.split(coverageNeedle).length,2,'GEN3256_COVERAGE_OPERAND_SOURCE_DRIFT');
      assert.equal(source.split(unionNeedle).length,2,'GEN3256_MEADOW_OPERAND_SOURCE_DRIFT');
      const expressions={
        NORMAL:bodyNeedle,
        OPERANDS_RGB:'base=vec3(gen3256HabitatWeight,gen3256MeadowWeight,habitatColorCoverage);',
        PRE_BLEND:'base=base;',
        MEADOW_ONLY:'base=mix(base,habitatSoil,gen3256MeadowWeight*.68);',
        HABITAT_ONLY:'base=mix(base,habitatSoil,gen3256HabitatWeight*.68);'
      };
      assert(expressions[mode],'GEN3256_UNREGISTERED_DIAGNOSTIC_MODE:'+mode);
      let body=source;
      if(mode!=='NORMAL'){
        body=body.replace(coverageNeedle,coverageNeedle+'\n    float gen3256HabitatWeight=habitatColorCoverage;\n    float gen3256MeadowWeight=0.0;');
        body=body.replace(unionNeedle,'gen3256MeadowWeight=meadowOccupancy*meadowOuterWeight;\n      '+unionNeedle);
        body=body.replace(bodyNeedle,expressions[mode]);
      }
      await route.fulfill({response,contentType:'text/javascript',body});
    });
    await page.route(u=>u.pathname==='/showroom/globe/h-earth/vegetation-prototype/route.js',async route=>{
      const response=await route.fetch(),source=await response.text(),needle='const cssWidth=';
      assert.equal(source.split(needle).length,2,'GEN3256_PUBLIC_ROUTE_NEEDLE_DRIFT');
      routeIntercepted=true;
      await route.fulfill({response,contentType:'text/javascript',body:source.replace(needle,
        'globalThis.__Gen3256Present=present;globalThis.__Gen3256FrameBridge=spatialFrameBridge;\nconst cssWidth=')});
    });
    await page.goto(urlBase+'/showroom/globe/h-earth/',{waitUntil:'domcontentloaded',timeout:120000});
    try {
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.singleOwnerPrototype==='controls-test',null,{timeout:150000,polling:500});
    }catch(waitError){
      const diagnosis=await page.evaluate(()=>({
        route:document.querySelector('#h-earth-functional-landscape-route')?.dataset??null,
        loading:document.querySelector('#h-earth-loading-screen')?.dataset??null,
        title:document.title
      })).catch(()=>null);
      throw Error('GEN3256_SOURCE_MODE_STARTUP_FAILURE:'+JSON.stringify({
        mode,reason:String(waitError),rendererIntercepted,routeIntercepted,problems,diagnosis
      }));
    }
    await page.mouse.move(400,220);await page.mouse.down();await page.mouse.move(530,235,{steps:14});await page.mouse.up();await page.mouse.wheel(0,-360);
    await page.waitForFunction(()=>document.querySelector('#h-earth-loading-screen')?.dataset.mode==='ready',null,{timeout:120000,polling:500});
    await page.locator('#h-earth-loading-screen [data-enter]').click();
    await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true',null,{timeout:120000,polling:500});
    await page.waitForFunction(()=>{
      const phase=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.vegetationBackground?.phase;
      return phase==='OWNER_PREPARED'||phase==='FAILED';
    },null,{timeout:780000,polling:500});
    const pose=await page.evaluate(async target=>{
      const urls=[...new Set(performance.getEntriesByType('resource').map(r=>r.name).filter(u=>/\/navigation\.js\?/.test(u)))];
      if(urls.length!==1)throw Error('GEN3256_NAVIGATION_MODULE_NOT_UNIQUE:'+urls.length);
      const url=urls[0];let source=await(await fetch(url)).text();
      source=source.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,quote,p)=>'from '+JSON.stringify(new URL(p,url).href));
      source+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';
      const nav=await import(URL.createObjectURL(new Blob([source],{type:'text/javascript'})));
      const resolved=nav.auditResolvePosition(target.x,target.z,target.yaw,'SURFACE');
      if(!resolved.eligible)throw Error('GEN3256_OWNER_CAMERA_INVALID');
      const state=nav.auditStateFrom(resolved,{yaw:target.yaw,pitch:target.pitch,fov:56,sequence:30001,action:'GEN3256_TINT_ISOLATION'});
      if(typeof globalThis.__Gen3256Present!=='function')throw Error('GEN3256_PRESENT_HOOK_MISSING');
      for(let k=0;k<12;k++){globalThis.__Gen3256Present(state);await new Promise(requestAnimationFrame);}
      return {position:state.position,yaw:state.yawDegrees,pitch:state.pitchDegrees,sequence:state.sequence};
    },target);
    const gpu=await page.evaluate(()=>{
      const g=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.();
      const canvas=document.getElementById('h-earth-functional-landscape-canvas');
      const spatial=globalThis.__Gen3256FrameBridge?.getCopyReportFrameEvidence?.({canvas,rendererReceipt:g?.resources})??null;
      return {phase:g?.vegetationBackground?.phase,owner:g?.resources?.singleOwnerVegetation,
        counters:g?.counters,frame:g?.frameRecords?.at(-1)??null,spatial,canvas:{width:canvas?.width,height:canvas?.height}};
    });
    assert.equal(gpu.phase,'OWNER_PREPARED','GEN3256_OWNER_NOT_PREPARED');
    assert.equal(gpu.owner?.installedRootCount,3805291,'GEN3256_ROOT_COUNT_DRIFT');
    assert.equal(gpu.owner?.gpuObservedBufferBytes,60884656,'GEN3256_PACKED_GPU_DRIFT');
    assert.equal(gpu.owner?.gpuUploadedBytes,60884656,'GEN3256_UPLOAD_DRIFT');
    assert.equal(gpu.owner?.perFrameUploadBytes,0,'GEN3256_REUPLOAD');
    assert.equal(gpu.owner?.allocationGlError,0,'GEN3256_GL_ALLOCATION');
    assert.equal(gpu.owner?.uploadGlError,0,'GEN3256_GL_UPLOAD');
    assert.equal(gpu.counters?.worldRebuildCount,0,'GEN3256_WORLD_REBUILT');
    assert(rendererIntercepted&&routeIntercepted,'GEN3256_BROWSER_SOURCE_INTERCEPT_MISSING');
    assert.equal(problems.length,0,'GEN3256_BROWSER_ERRORS:'+problems.join('|'));
    const camera=gpu.frame?.cameraPosition;
    assert(camera&&Math.hypot(camera.x-target.x,camera.z-target.z)<0.02,'GEN3256_OWNER_CAMERA_SUPPORT_OFFSET');
    const png=await page.locator('#h-earth-functional-landscape-canvas').screenshot({timeout:120000});
    const filename=path.join(outDir,name+'.png');fs.writeFileSync(filename,png);
    const image={name,sourceHead:actualHead,shaderMode:mode,
      pngSha256:shaCreate('sha256').update(png).digest('hex'),pngBytes:png.length,
      rendererSourceSha256:actualSourceDigest,camera,pose,frameSequence:gpu.frame?.frameSequence,
      navigationSequence:gpu.frame?.navigationSequence,canvas:gpu.canvas,
      rootCount:gpu.owner.installedRootCount,gpuPackedBytes:gpu.owner.gpuObservedBufferBytes,
      spatialFrameEvidence:gpu.spatial,problems:[]};
    images.push(image);
    await context.close();return {image,pixels:PNG.sync.read(png)};
  }
  let result='FAIL',difference=null,failure=null;
  try{
    const modes=['NORMAL','OPERANDS_RGB','PRE_BLEND','MEADOW_ONLY','HABITAT_ONLY'];
    const captures=[];
    for(const mode of modes)captures.push(await capture(mode,mode));
    const reference=captures[0];
    difference={reference:'NORMAL',comparisonModes:[],diagnosticMaskEncoding:'OPERANDS_RGB: red=habitat color coverage, green=admitted meadow occupancy after outer feather, blue=max combined coverage; subsequent normal terrain lighting affects displayed RGB',source:'ONE_PUBLISHED_GEN3252_PRODUCT_FIVE_EPHEMERAL_BROWSER_SHADER_MODES_SAME_POSE'};
    for(const candidate of captures.slice(1)){
      const A=reference.pixels,B=candidate.pixels;
      assert.equal(A.width,B.width,'GEN3256_VIEWPORT_WIDTH_DRIFT');
      assert.equal(A.height,B.height,'GEN3256_VIEWPORT_HEIGHT_DRIFT');
      assert.equal(reference.image.rendererSourceSha256,candidate.image.rendererSourceSha256,'GEN3256_RENDERER_SOURCE_DRIFT');
      assert.equal(reference.image.pose.yaw,candidate.image.pose.yaw,'GEN3256_YAW_MISMATCH');
      assert.equal(reference.image.pose.pitch,candidate.image.pose.pitch,'GEN3256_PITCH_MISMATCH');
      assert.equal(reference.image.navigationSequence,candidate.image.navigationSequence,'GEN3256_NAV_SEQUENCE_MISMATCH');
      const c0=reference.image.camera,c1=candidate.image.camera;
      assert(Math.hypot(c0.x-c1.x,c0.y-c1.y,c0.z-c1.z)<0.02,'GEN3256_CAMERA_MISMATCH');
      let changed=0,groundChanged=0,skyChanged=0,abs=0;
      for(let i=0;i<A.width*A.height;i++){
        const b=i*4,delta=Math.max(Math.abs(A.data[b]-B.data[b]),Math.abs(A.data[b+1]-B.data[b+1]),Math.abs(A.data[b+2]-B.data[b+2]));
        if(delta>8){changed++;const y=Math.floor(i/A.width);if(y>=220)groundChanged++;if(y<175)skyChanged++;}
        abs+=Math.abs(A.data[b]-B.data[b])+Math.abs(A.data[b+1]-B.data[b+1])+Math.abs(A.data[b+2]-B.data[b+2]);
      }
      difference.comparisonModes.push({mode:candidate.image.shaderMode,pixels:A.width*A.height,changedPixelsGt8:changed,groundPixelsChangedGt8:groundChanged,skyPixelsChangedGt8:skyChanged,meanAbsoluteRgbDelta:abs/(A.width*A.height*3),pngSha256:candidate.image.pngSha256});
    }
    assert.equal(captures.length,5,'GEN3256_INCOMPLETE_OPERAND_SET');
    assert(difference.comparisonModes.some(x=>x.groundPixelsChangedGt8>100),'GEN3256_NO_VISIBLE_OPERAND_EFFECT');
    result='PASS_CAPTURED_OPERAND_VISUAL_DISPOSITION_PENDING';
  }catch(e){failure=String(e);errors.push(failure);}
  finally{
    const receipt={schema:'H_EARTH_GEN3256_FOREGROUND_MATERIAL_OPERAND_ISOLATION_v1',result,head:actualHead,
      sourceRendererGitBlob:'c69ef60c6e3126c0267ea60709768c35219f4ee6',
      originalRootCount:3805291,originalPackedGpuBytes:60884656,images,difference,errors,
      noRepositoryProductMutation:true,noPublication:true,physicalAndroidClaim:false,
      elapsedMilliseconds:Date.now()-startedAt};
    fs.writeFileSync(path.join(outDir,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
    console.log(JSON.stringify({result,images:images.length,difference,errors}));
    await browser.close();localServer.close();
  }
  if(result!=='PASS_CAPTURED_OPERAND_VISUAL_DISPOSITION_PENDING')process.exitCode=1;
  else process.exitCode=0;
  // The historical runtime below is left source-identical and is not executed
  // when this explicit diagnostic branch is enabled.
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
