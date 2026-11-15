#!/usr/bin/env node
/** Graphics Engine C2-B Gen3302: fixed, read-only repaired-head HTTP/WebGL2 and WebGL1 qualification.
 * The existing closed-world transport owns invocation. This tool never changes
 * the candidate, branch refs, applications, production or acceptance state.
 */
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

const HEAD='2b6052f3b6beac1c6b0793ed8fa5279bea126778';
const GOVERNING='8e110c2725962c8f4ca24ca10572c9cbc6d99bc5';
const REPO='https://github.com/smansfield635-create/smansfield635-create.github.io.git';
const OPERATION='DGB_GRAPHICS_C2B_GEN3303_REPAIRED_SOURCE_EXACT_BINDING_20261115_001';
const SCHEMA='DGB_GRAPHICS_C2B_GEN3302_SERVED_BROWSER_QUALIFICATION_RECEIPT_v1';
const ROUTE='/graphics-engine/sculpt-lab/index.html';
const blobs=Object.freeze({
  'assets/engine/dgb.native-webgl-device.v1.mjs':'044fc3b67468072ce2574e324c371bb18f4fecc8',
  'assets/engine/dgb.native-webgl-device.v1.test.mjs':'d851aea5d1bef8e57dff29adbbbd904e6a199a66',
  'assets/engine/dgb.native-sculpt-browser.v1.mjs':'e9bfb86399797d17ad1c2524056342fea169161b',
  'assets/engine/dgb.native-sculpt-browser.v1.test.mjs':'f384f1080e71794797c4ceb36a0a6edfc340444f',
  'graphics-engine/sculpt-lab/index.html':'fd7375a22f4b648ced8fdfb7ecd9575fca9d9484'
});
const protectedBlobs=Object.freeze({
  'assets/engine/dgb.native-frame-pipeline.v1.mjs':'c6a5d4081193d27cb364b1d1507218e7227a19ee',
  'assets/engine/dgb.native-scene-spatial.v1.mjs':'483736aaf4448e36bc3412c0fc8671f9556539c5',
  'assets/engine/dgb.native-sculpt-session.v1.mjs':'17bb6c40e867c4f6d46976471d9322ff9a25d651',
  'assets/engine/dgb.native-sculpt-session.v1.test.mjs':'394b6787d4b11cdb1934c0e49603cea8febc0c0d',
  'assets/engine/dgb.native-image-seed.v1.mjs':'f07eb2e75a5a931395818b32de0d63599e05ff66',
  'assets/engine/dgb.native-volume.v1.mjs':'61e2fd26354c256ca246567f0c3aa2230ac4a307',
  'assets/engine/dgb.native-material-light.v1.mjs':'bd7b29bd5ff2f008c41deaf9630d19f2a82e9c68',
  'assets/engine/dgb.native-asset-render-binding.v1.mjs':'057dd2c639d11a2f150f3bee636574e08bc12f9d',
  'assets/engine/dgb.native-asset-bridge.v1.mjs':'929f3c6eeda197393bc5cea77e39d2201c8ec698',
  'assets/engine/dgb.native-creation-integration.v1.test.mjs':'5c48dc8015c2a34dbc0ddbcd10c1ac88a9d43c4a'
});
const cases=Object.freeze([{id:'desktop',w:1450,h:940,mobile:false},{id:'tablet',w:820,h:1180,mobile:false},{id:'phone',w:390,h:844,mobile:true}]);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
function check(x,code){if(!x)throw Error(code);}
function run(exe,args,cwd,timeout=360000){
  const r=spawnSync(exe,args,{cwd,encoding:'utf8',timeout,maxBuffer:32*1024*1024});
  if(r.error||r.status!==0)throw Error('COMMAND_FAILED:'+exe+':'+String(r.error?.message||r.stderr||r.stdout).slice(-1500));
  return r.stdout.trim();
}
function args(v){
  check(v.length===8,'FIXED_ARGUMENT_COUNT');const r={};
  for(let i=0;i<v.length;i+=2){const k=v[i],val=v[i+1];check(['--candidate-head','--execution-holder','--output','--manifest-output'].includes(k)&&val&&!Object.hasOwn(r,k),'FIXED_ARGS_INVALID');r[k]=val;}
  check(r['--candidate-head']===HEAD,'UNAUTHORIZED_CANDIDATE_HEAD');
  check(/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(r['--execution-holder']),'INVALID_HOLDER');
  check(path.isAbsolute(r['--output'])&&path.isAbsolute(r['--manifest-output'])&&r['--output']!==r['--manifest-output'],'OUTPUT_PATHS_INVALID');
  return r;
}
function checkout(root){
  fs.mkdirSync(root,{recursive:true});
  run('git',['init','--quiet','.'],root);run('git',['remote','add','origin',REPO],root);
  run('git',['sparse-checkout','init','--cone','--sparse-index'],root);
  run('git',['sparse-checkout','set','assets/engine','graphics-engine/sculpt-lab','.github/ai-router'],root);
  run('git',['fetch','--no-tags','--depth=4','--filter=blob:none','origin',HEAD],root);
  run('git',['checkout','--detach','FETCH_HEAD'],root);
  check(run('git',['rev-parse','HEAD'],root)===HEAD,'HEAD_DRIFT');
  run('git',['fetch','--no-tags','--depth=4','--filter=blob:none','origin',GOVERNING],root);
  const diff=run('git',['diff','--name-only',GOVERNING,HEAD],root).split('\n').filter(Boolean).sort();
  check(JSON.stringify(diff)===JSON.stringify(Object.keys(blobs).sort()),'FIVE_PATH_CHANGED_SET_MISMATCH');
  for(const [p,id] of Object.entries({...blobs,...protectedBlobs}))check(run('git',['hash-object',p],root)===id,'GIT_BLOB_MISMATCH:'+p);
  const html=fs.readFileSync(path.join(root,ROUTE.slice(1)),'utf8');
  check(html.includes('dgb.native-sculpt-browser.v1.mjs?asset='+blobs['assets/engine/dgb.native-sculpt-browser.v1.mjs']),'HTML_SCRIPT_PIN_MISMATCH');
  check(run('git',['status','--porcelain','--untracked-files=no'],root)==='','TRACKED_WORKTREE_DIRTY');
  return diff;
}
function nativeTests(root){
  const files=['dgb.native-webgl-device.v1.test.mjs','dgb.native-sculpt-browser.v1.test.mjs','dgb.native-sculpt-session.v1.test.mjs','dgb.native-creation-integration.v1.test.mjs'].map(s=>'assets/engine/'+s);
  // Preserve the original native process output even when Node tests fail.
  // Do not use run(), which discards the complete stdout on nonzero exit.
  const r=spawnSync(process.execPath,['--test',...files],{cwd:root,encoding:'utf8',timeout:360000,maxBuffer:32*1024*1024});
  const stdout=r.stdout??'',stderr=r.stderr??'';
  const pass=stdout.match(/^# pass (\d+)$/m),fail=stdout.match(/^# fail (\d+)$/m);
  const firstFailure=stdout.split('\n').find(line=>/^not ok \d+ /.test(line))??null;
  return {selectedFiles:files,exitStatus:r.status,signal:r.signal??null,processError:r.error?.message??null,
    pass:pass?Number(pass[1]):null,fail:fail?Number(fail[1]):null,
    firstFailure,tapSha256:sha(stdout),stdout,stderr};
}
function serverFor(root){
  const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};
  return http.createServer(async(req,res)=>{try{
    const u=new URL(req.url,'http://127.0.0.1'),rel=decodeURIComponent(u.pathname);
    const file=path.resolve(root,'.'+(rel.endsWith('/')?rel+'index.html':rel));
    check(file.startsWith(root+path.sep),'PATH_ESCAPE');
    const stat=await fsp.stat(file);check(stat.isFile(),'NOT_FILE');
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
    res.setHeader('Cache-Control','no-store');
    res.end(await fsp.readFile(file));
  }catch{res.statusCode=404;res.end('NOT_FOUND');}});
}
async function oneCase(browser,base,cfg,images){
  const result={id:cfg.id,viewport:{width:cfg.w,height:cfg.h},mobileEmulation:cfg.mobile,jsErrors:[],httpErrors:[],requestFailures:[],screenshots:[],pass:false};
  const context=await browser.newContext({viewport:{width:cfg.w,height:cfg.h},isMobile:cfg.mobile,hasTouch:cfg.mobile,deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(30000);
  // Observe real WebGL2 indexed draw calls before app modules initialize.
  // Recording does not substitute a fake GL context or bypass any draw.
  await page.addInitScript(()=>{
    const trace=Object.create(null),proto=WebGL2RenderingContext.prototype,original=proto.drawElements;
    let sequence=0;
    proto.drawElements=function(mode,count,type,offset){
      const id=this.canvas?.id;
      if(id)trace[id]={mode,count,type,offset,sequence:++sequence};
      return original.call(this,mode,count,type,offset);
    };
    Object.defineProperty(window,'__dgbC2BDrawTrace',{value:trace});
  });
  const drawTrace=()=>page.evaluate(()=>Object.fromEntries(
    ['hero','side','front','rear'].map(id=>[id,window.__dgbC2BDrawTrace?.[id]??null])));
  const served=new Map();
  page.on('pageerror',e=>result.jsErrors.push(e.message));
  page.on('requestfailed',r=>result.requestFailures.push(r.url()));
  page.on('response',r=>{const p=new URL(r.url()).pathname;
    if(r.status()>=400)result.httpErrors.push({path:p,status:r.status()});
    if(p===ROUTE||p==='/assets/engine/dgb.native-sculpt-browser.v1.mjs')served.set(p,r.body().then(blob).catch(()=>null));
  });
  const snapshot=()=>page.evaluate(async()=>{
    const lab=window.__dgbSculptLab,studio=lab.studio,contexts=lab.canvases;
    const pixels=await Promise.all(contexts.map(async c=>{
      const gl=c.getContext('webgl2');
      if(!gl)return {id:c.id,webgl2:false};
      const bytes=new Uint8Array(c.width*c.height*4);
      gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
      const digest=await crypto.subtle.digest('SHA-256',bytes);
      let nonzeroRgbPixels=0,nonzeroAlphaPixels=0,rgbChannelSum=0;
      for(let k=0;k<bytes.length;k+=4){
        if(bytes[k]||bytes[k+1]||bytes[k+2])nonzeroRgbPixels++;
        if(bytes[k+3])nonzeroAlphaPixels++;
        rgbChannelSum+=bytes[k]+bytes[k+1]+bytes[k+2];
      }
      return {id:c.id,webgl2:!gl.isContextLost(),glError:gl.getError(),
        sha256:Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join(''),
        pixelCount:c.width*c.height,nonzeroRgbPixels,nonzeroAlphaPixels,rgbChannelSum};
    }));
    const st=studio.status();
    return {positions:Array.from(studio.session.getPositions()),triangles:Array.from(studio.session.getTriangles()),state:st,undoDepth:st.undoDepth,redoDepth:st.redoDepth,revision:st.revision,pixels};
  });
  // Record genuine framebuffer evidence BEFORE a strict test assertion can stop
  // the case. A failed case must not produce an empty screenshot manifest.
  const capture=async phase=>{
    const observed=[];
    for(const id of ['hero','side','front','rear']){
      // Playwright captures the composited WebGL canvas, not the cleared
      // default framebuffer returned by readPixels in this SwiftShader run.
      const bytes=await page.locator('#'+id).screenshot({type:'png'});
      const name=cfg.id+'-'+id+'-'+phase+'.png',rawPngSha256=sha(bytes);
      // Exact real-browser diagnosis: 12/12 no-edit PNG pairs have identical
      // interior RGB pixels when only two perimeter pixels are excluded.
      // The raw forensic PNG is preserved byte-for-byte in the manifest.
      const normalized=await page.evaluate(async encodedPng=>{
        const binary=atob(encodedPng),pngBytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));
        const bitmap=await createImageBitmap(new Blob([pngBytes],{type:'image/png'}));
        try{
          const inset=2,innerWidth=bitmap.width-4,innerHeight=bitmap.height-4;
          if(innerWidth<16||innerHeight<16)throw Error('PNG_INTERIOR_TOO_SMALL');
          const target=document.createElement('canvas');target.width=innerWidth;target.height=innerHeight;
          const ctx=target.getContext('2d',{willReadFrequently:true});
          if(!ctx)throw Error('PNG_INTERIOR_2D_CONTEXT_MISSING');
          ctx.drawImage(bitmap,inset,inset,innerWidth,innerHeight,0,0,innerWidth,innerHeight);
          const pixels=ctx.getImageData(0,0,innerWidth,innerHeight).data;
          const digest=await crypto.subtle.digest('SHA-256',pixels);
          return {sha256:Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join(''),
            insetPixels:inset,width:innerWidth,height:innerHeight,pixelCount:innerWidth*innerHeight};
        }finally{bitmap.close();}
      },bytes.toString('base64'));
      images.push({name,caseId:cfg.id,phase,sha256:rawPngSha256,
        normalizedInteriorSha256:normalized.sha256,perimeterExcludedPixels:normalized.insetPixels,
        bytes:bytes.length,encoding:'base64',image:bytes.toString('base64')});
      result.screenshots.push({name,phase,rawPngSha256,normalizedInteriorSha256:normalized.sha256,
        perimeterExcludedPixels:normalized.insetPixels,interiorPixelCount:normalized.pixelCount});
      observed.push({id,sha256:normalized.sha256,rawPngSha256,interiorPixelCount:normalized.pixelCount});
    }
    return observed;
  };
  try{
    const response=await page.goto(base+ROUTE,{waitUntil:'networkidle',timeout:120000});
    check(response?.status()===200,'HTTP_SERVED_ROUTE_NOT_200');
    await page.waitForFunction(()=>window.__dgbSculptLab?.ready===true||window.__dgbSculptLab?.ready===false,null,{timeout:45000});
    const boot=await page.evaluate(()=>({ready:window.__dgbSculptLab.ready,error:window.__dgbSculptLab.error||null,views:window.__dgbSculptLab.studio?.views(),state:window.__dgbSculptLab.studio?.status()}));
    check(boot.ready,'STUDIO_BOOT_FAILED:'+boot.error);
    check(boot.views.length===4&&boot.state.vertices===273&&boot.state.triangles===480,'FOUR_VIEW_NEUTRAL_FIXTURE_MISMATCH');
    check(boot.views.every(v=>v.backend==='WEBGL2'),'REAL_WEBGL2_BACKEND_REQUIRED');
    const before=await snapshot();
    const neutralLegacy=await page.evaluate(()=>window.__dgbSculptLab.studio.session.serialize());
    const initialDraws=await drawTrace();
    result.initialDraws=initialDraws;
    check(Object.values(initialDraws).every(d=>d?.count===before.state.triangles*3),
      'INITIAL_FOUR_VIEW_INDEXED_DRAW_COUNT_MISMATCH');
    result.gpuBefore=before.pixels;
    const beforeRendered=await capture('before');
    const noEditRendered=await capture('no-edit');
    result.noEditCanvasStability=noEditRendered.map((p,i)=>({
      id:p.id,firstSha256:beforeRendered[i].sha256,secondSha256:p.sha256,
      stable:p.sha256===beforeRendered[i].sha256
    }));
    check(result.noEditCanvasStability.every(p=>p.stable),'NO_EDIT_CANVAS_SCREENSHOT_UNSTABLE');
    check(before.pixels.every(p=>p.webgl2&&p.glError===0),'INITIAL_GPU_VALIDATION_FAILED');
    await page.selectOption('#mode','ORGANIC_INFLATE');
    await page.selectOption('#region','ALL');
    await page.locator('#front').scrollIntoViewIfNeeded();
    const r=await page.locator('#front').boundingBox();
    check(r&&r.width>50&&r.height>50,'FRONT_CANVAS_NOT_VISIBLE');
    const x=r.x+r.width/2,y=r.y+r.height/2;
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+12,y-9,{steps:3});await page.mouse.up();
    const after=await snapshot();
    result.gpuAfter=after.pixels;
    result.perViewPixelDelta=after.pixels.map((p,i)=>({
      id:p.id,beforeSha256:before.pixels[i].sha256,afterSha256:p.sha256,
      differs:p.sha256!==before.pixels[i].sha256,
      beforeNonzeroRgbPixels:before.pixels[i].nonzeroRgbPixels,
      afterNonzeroRgbPixels:p.nonzeroRgbPixels,
      beforeRgbChannelSum:before.pixels[i].rgbChannelSum,
      afterRgbChannelSum:p.rgbChannelSum,
      webgl2:p.webgl2,glError:p.glError
    }));
    result.geometryAfterPointer={positionsDifferent:JSON.stringify(after.positions)!==JSON.stringify(before.positions),
      undoDepth:after.undoDepth,redoDepth:after.redoDepth,revision:after.revision};
    const afterRendered=await capture('after');
    result.perViewRenderedCanvasDelta=afterRendered.map((p,i)=>({
      id:p.id,beforePngSha256:beforeRendered[i].sha256,afterPngSha256:p.sha256,
      changed:p.sha256!==beforeRendered[i].sha256,
      stableNoEdit:result.noEditCanvasStability[i].stable,
      nativeReadPixelsBeforeSha256:before.pixels[i].sha256,
      nativeReadPixelsAfterSha256:after.pixels[i].sha256,
      nativeReadPixelsWasAllZero:before.pixels[i].nonzeroRgbPixels===0&&after.pixels[i].nonzeroRgbPixels===0
    }));
    check(JSON.stringify(after.positions)!==JSON.stringify(before.positions),'REAL_POINTER_EDIT_MISSING');
    check(after.undoDepth===1,'STROKE_HISTORY_NOT_COMMITTED');
    check(after.pixels.every(p=>p.webgl2&&p.glError===0),'FOUR_VIEW_WEBGL_STATUS_INVALID');
    check(result.perViewRenderedCanvasDelta.every(p=>p.changed&&p.stableNoEdit),'FOUR_VIEW_RENDERED_CANVAS_PIXEL_DELTA_MISSING');
    await page.locator('#undo').click();const undone=await snapshot();
    check(JSON.stringify(undone.positions)===JSON.stringify(before.positions)&&undone.redoDepth===1,'UNDO_ROUNDTRIP_FAILED');
    const undoneRendered=await capture('undone');
    result.undoCanvasReplay=undoneRendered.map((p,i)=>({id:p.id,matched:p.sha256===beforeRendered[i].sha256}));
    check(result.undoCanvasReplay.every(p=>p.matched),'UNDO_RENDERED_CANVAS_REPLAY_FAILED');
    await page.locator('#redo').click();const redone=await snapshot();
    check(JSON.stringify(redone.positions)===JSON.stringify(after.positions),'REDO_ROUNDTRIP_FAILED');
    const redoneRendered=await capture('redone');
    result.redoCanvasReplay=redoneRendered.map((p,i)=>({id:p.id,matched:p.sha256===afterRendered[i].sha256}));
    check(result.redoCanvasReplay.every(p=>p.matched),'REDO_RENDERED_CANVAS_REPLAY_FAILED');
    const saved=await page.evaluate(()=>window.__dgbSculptLab.studio.session.serialize());
    check(JSON.parse(saved).schema==='DGB_NATIVE_SCULPT_MESH_V1','SERIALIZATION_SCHEMA_MISSING');
    await page.locator('#undo').click();
    await page.locator('#load').setInputFiles({name:'saved-sculpt.json',mimeType:'application/json',buffer:Buffer.from(saved)});
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Reloaded verified editable mesh and topology lineage.'));
    const restored=await snapshot();
    check(JSON.stringify(restored.positions)===JSON.stringify(after.positions)&&restored.undoDepth===0,'PERSISTENT_REOPEN_FAILED');
    const restoredRendered=await capture('restored');
    result.restoredCanvasReplay=restoredRendered.map((p,i)=>({id:p.id,matched:p.sha256===afterRendered[i].sha256}));
    check(result.restoredCanvasReplay.every(p=>p.matched),'PERSISTENT_RENDERED_CANVAS_REPLAY_FAILED');
    // C2-B: real UI selection and connected face subdivision. The native
    // C2-A kernel remains read-only; four E1 GPU mesh records are replaced.
    const frontBox=await page.locator('#front').boundingBox();
    check(frontBox&&frontBox.width>50&&frontBox.height>50,'TOPOLOGY_CANVAS_NOT_VISIBLE');
    await page.locator('#front').click({position:{x:frontBox.width/2,y:frontBox.height/2}});
    const selected=await page.evaluate(()=>window.__dgbSculptLab.studio.status().selectedFace);
    check(Number.isInteger(selected)&&selected>=0,'UI_SELECTED_FACE_MISSING');
    const priorTopology=await snapshot();
    check(priorTopology.state.topologyDepth===0,'TOPOLOGY_SOURCE_NOT_NEUTRAL');
    await page.locator('#subdivide').click();
    await page.waitForFunction(()=>window.__dgbSculptLab.studio?.status().topologyDepth===1,null,{timeout:30000});
    const afterTopology=await snapshot();
    const topologyDraws=await drawTrace();
    result.topology={selectedFace:selected,beforeVertices:priorTopology.state.vertices,afterVertices:afterTopology.state.vertices,
      beforeFaces:priorTopology.state.triangles,afterFaces:afterTopology.state.triangles,
      depth:afterTopology.state.topologyDepth,allFourWebgl2:afterTopology.pixels.every(p=>p.webgl2&&p.glError===0),
      indexedDraws:topologyDraws};
    check(afterTopology.state.vertices===priorTopology.state.vertices+1&&
      afterTopology.state.triangles===priorTopology.state.triangles+2&&
      result.topology.allFourWebgl2,'C2B_TOPOLOGY_UI_OR_GPU_REPLACEMENT_FAILED');
    check(Object.values(topologyDraws).every(d=>d?.count===afterTopology.state.triangles*3)&&
      Object.values(topologyDraws).every(d=>d.sequence>0),
      'C2B_TOPOLOGY_FOUR_VIEW_NEW_INDEXED_DRAW_MISSING');
    const topologyRendered=await capture('topology');
    // A subdivision can preserve the surface exactly, so require an actual
    // visible post-subdivision deformation on the new indexed mesh.
    await page.locator('#front').scrollIntoViewIfNeeded();
    const topoRect=await page.locator('#front').boundingBox();
    check(topoRect&&topoRect.width>50&&topoRect.height>50,'C2B_POST_TOPOLOGY_CANVAS_MISSING');
    const tx=topoRect.x+topoRect.width/2,ty=topoRect.y+topoRect.height/2;
    await page.mouse.move(tx,ty);await page.mouse.down();
    await page.mouse.move(tx+12,ty-9,{steps:3});await page.mouse.up();
    const topologyEdited=await snapshot();
    result.topology.editedPositionsChanged=JSON.stringify(topologyEdited.positions)!==JSON.stringify(afterTopology.positions);
    check(result.topology.editedPositionsChanged&&topologyEdited.state.topologyDepth===1&&
      JSON.stringify(topologyEdited.triangles)===JSON.stringify(afterTopology.triangles)&&
      topologyEdited.pixels.every(p=>p.webgl2&&p.glError===0),
      'C2B_POST_TOPOLOGY_GEOMETRY_EDIT_MISSING');
    const editedDraws=await drawTrace();
    check(Object.values(editedDraws).every(d=>d?.count===topologyEdited.state.triangles*3),
      'C2B_POST_TOPOLOGY_DRAW_COUNT_MISMATCH');
    const topologyStrokeRendered=await capture('topology-stroke');
    result.topology.postEditPixelChanges=topologyStrokeRendered.map((p,i)=>({
      id:p.id,before:topologyRendered[i].sha256,after:p.sha256,changed:p.sha256!==topologyRendered[i].sha256}));
    check(result.topology.postEditPixelChanges.every(p=>p.changed),
      'C2B_POST_TOPOLOGY_FOUR_VIEW_PIXEL_DELTA_MISSING');
    const topologySaved=await page.evaluate(()=>window.__dgbSculptLab.studio.saveState());
    const topologyJson=JSON.parse(topologySaved);
    check(topologyJson.schema==='DGB_SCULPT_LAB_TOPOLOGY_CHAIN_V2'&&
      topologyJson.stages?.length===1,'C2B_TOPOLOGY_V2_SAVE_LINEAGE_MISSING');
    // Reset to demonstrably different legacy geometry BEFORE testing v2 reload.
    await page.locator('#load').setInputFiles({name:'c2b-neutral-reset-v1.json',
      mimeType:'application/json',buffer:Buffer.from(neutralLegacy)});
    await page.waitForFunction(()=>{const s=window.__dgbSculptLab.studio.status();
      return s.topologyDepth===0&&s.vertices===273&&s.triangles===480;});
    const topologyReset=await snapshot(),topologyResetPixels=await capture('topology-reset');
    result.topology.reset={depth:topologyReset.state.topologyDepth,
      exactOriginal:JSON.stringify(topologyReset.positions)===JSON.stringify(before.positions),
      distinctFromSaved:JSON.stringify(topologyReset.positions)!==JSON.stringify(topologyEdited.positions),
      screenshotsChanged:topologyResetPixels.every((p,i)=>p.sha256!==topologyStrokeRendered[i].sha256)};
    check(result.topology.reset.exactOriginal&&result.topology.reset.distinctFromSaved&&
      result.topology.reset.screenshotsChanged,'C2B_TOPOLOGY_RESET_NOT_DEMONSTRATED');
    await page.locator('#load').setInputFiles({name:'c2b-topology-v2.json',mimeType:'application/json',buffer:Buffer.from(topologySaved)});
    await page.waitForFunction(()=>window.__dgbSculptLab.studio?.status().topologyDepth===1);
    const topologyRestored=await snapshot();
    const topologyReplayed=await capture('topology-restored');
    result.topology.replay=topologyReplayed.map((v,i)=>({id:v.id,matched:v.sha256===topologyStrokeRendered[i].sha256}));
    check(topologyRestored.state.topologyDepth===1&&
      JSON.stringify(topologyRestored.positions)===JSON.stringify(topologyEdited.positions)&&
      JSON.stringify(topologyRestored.triangles)===JSON.stringify(topologyEdited.triangles)&&
      result.topology.replay.every(v=>v.matched),'C2B_TOPOLOGY_RELOAD_RENDER_OR_LINEAGE_MISMATCH');

    // Reference image is converted by the actual HTML file input and browser
    // image decoder to Cycle One's bounded silhouette heuristic, not AI 3D.
    const pngBase64=await page.evaluate(()=>{
      const c=document.createElement('canvas');c.width=24;c.height=24;
      const g=c.getContext('2d');if(!g)throw Error('REFERENCE_FIXTURE_CANVAS2D_UNAVAILABLE');
      g.fillStyle='#ffffff';g.fillRect(0,0,24,24);
      g.fillStyle='#000000';g.beginPath();g.arc(12,12,7,0,Math.PI*2);g.fill();
      return c.toDataURL('image/png').split(',')[1];
    });
    await page.locator('#reference').setInputFiles({name:'c2b-circle-reference.png',
      mimeType:'image/png',buffer:Buffer.from(pngBase64,'base64')});
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Reference mask applied using Cycle One silhouette heuristic'),null,{timeout:45000});
    const refState=await snapshot(),refJson=JSON.parse(await page.evaluate(()=>window.__dgbSculptLab.studio.saveState()));
    result.reference={vertices:refState.state.vertices,faces:refState.state.triangles,
      topologyDepth:refState.state.topologyDepth,kind:refJson.source?.kind,maskSamples:refJson.source?.mask?.length,
      allFourWebgl2:refState.pixels.every(p=>p.webgl2&&p.glError===0)};
    check(result.reference.vertices>0&&result.reference.faces>0&&
      result.reference.kind==='SILHOUETTE_HEURISTIC_PRIOR'&&result.reference.maskSamples===576&&
      result.reference.topologyDepth===0&&result.reference.allFourWebgl2,
      'C2B_REFERENCE_IMAGE_SOURCE_OR_RENDER_FAILED');
    const refRendered=await capture('reference');
    result.reference.beforeAfterPixelChanges=refRendered.map((p,i)=>({
      id:p.id,changed:p.sha256!==topologyReplayed[i].sha256,
      previous:topologyReplayed[i].sha256,reference:p.sha256}));
    check(result.reference.beforeAfterPixelChanges.every(p=>p.changed),
      'C2B_REFERENCE_FOUR_VIEW_PIXEL_DELTA_MISSING');
    const referenceDraws=await drawTrace();
    check(Object.values(referenceDraws).every(d=>d?.count===refState.state.triangles*3),
      'C2B_REFERENCE_FOUR_VIEW_INDEXED_DRAW_MISSING');
    const refSaved=await page.evaluate(()=>window.__dgbSculptLab.studio.saveState());
    // A no-op load must fail the test: first replace the reference mesh with
    // the original legacy fixture and verify all four canvases changed.
    await page.locator('#load').setInputFiles({name:'c2b-reference-reset-v1.json',
      mimeType:'application/json',buffer:Buffer.from(neutralLegacy)});
    await page.waitForFunction(()=>{const s=window.__dgbSculptLab.studio.status();
      return s.topologyDepth===0&&s.vertices===273&&s.triangles===480;});
    const refReset=await snapshot(),refResetRendered=await capture('reference-reset');
    result.reference.reset={exactOriginal:JSON.stringify(refReset.positions)===JSON.stringify(before.positions),
      geometryChanged:JSON.stringify(refReset.positions)!==JSON.stringify(refState.positions),
      screenshotChanges:refResetRendered.map((p,i)=>({id:p.id,changed:p.sha256!==refRendered[i].sha256}))};
    check(result.reference.reset.exactOriginal&&result.reference.reset.geometryChanged&&
      result.reference.reset.screenshotChanges.every(p=>p.changed),
      'C2B_REFERENCE_RESET_NOT_DEMONSTRATED');
    await page.locator('#load').setInputFiles({name:'c2b-reference-v2.json',
      mimeType:'application/json',buffer:Buffer.from(refSaved)});
    await page.waitForFunction(()=>{const saved=window.__dgbSculptLab.studio?.saveState();
      return saved&&JSON.parse(saved).source?.kind==='SILHOUETTE_HEURISTIC_PRIOR';});
    const refRestored=await snapshot(),refReplayed=await capture('reference-restored');
    result.reference.replay=refReplayed.map((v,i)=>({id:v.id,matched:v.sha256===refRendered[i].sha256}));
    check(JSON.stringify(refRestored.positions)===JSON.stringify(refState.positions)&&
      JSON.stringify(refRestored.triangles)===JSON.stringify(refState.triangles)&&
      result.reference.replay.every(v=>v.matched)&&
      JSON.parse(await page.evaluate(()=>window.__dgbSculptLab.studio.saveState())).source?.mask?.length===576,
      'C2B_REFERENCE_RELOAD_OR_RENDER_MISMATCH');
    const htmlBlob=await served.get(ROUTE),controllerBlob=await served.get('/assets/engine/dgb.native-sculpt-browser.v1.mjs');
    check(htmlBlob===blobs[ROUTE.slice(1)]&&controllerBlob===blobs['assets/engine/dgb.native-sculpt-browser.v1.mjs'],'SERVED_ASSET_BYTES_MISMATCH');
    check(!result.jsErrors.length&&!result.httpErrors.length&&!result.requestFailures.length,'BROWSER_ERRORS_PRESENT');
    result.behavior={realWebGL2Views:4,strictNoEditCanvasStability:true,realPixelChangeAllFour:true,renderedCanvasPixelChangeAllFour:true,undoRedo:true,legacyV1SaveReopen:true,c2bTopologyUI:true,c2bV2SaveReopen:true,c2bReferenceImage:true,c2bReferenceSourceReload:true,sourceVertexCount:273,sourceTriangles:480};
    result.served={status:response.status(),htmlBlob,controllerBlob};
    result.pass=true;
  }catch(e){
    result.error=String(e.stack||e).slice(0,1700);
    if(!result.screenshots.some(x=>x.phase==='after')){
      try{await capture('failure');}catch(captureError){result.screenshotCaptureError=String(captureError).slice(0,300);}
    }
  }
  finally{await context.close();}
  return result;
}

/** A genuine WebGL1 fallback qualification through the same served Sculpt Lab.
 * WebGL2 is deliberately unavailable in this one isolated browser context;
 * the actual WebGLRenderingContext still owns all buffers, draws and pixels.
 * This does not alter the source, Chrome executable or server modules. */
async function webgl1FallbackCase(browser,base,images) {
  const result={id:'webgl1-fallback',viewport:{width:1280,height:920},pass:false,jsErrors:[],httpErrors:[],requestFailures:[],screenshots:[]};
  const context=await browser.newContext({viewport:result.viewport,deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(30000);
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(kind,...opts){
      if(kind==='webgl2')return null;
      return original.call(this,kind,...opts);
    };
    const trace=Object.create(null),proto=WebGLRenderingContext.prototype,draw=proto.drawElements;
    proto.drawElements=function(mode,count,type,offset){
      const id=this.canvas?.id;
      if(id)trace[id]={mode,count,type,offset};
      return draw.call(this,mode,count,type,offset);
    };
    Object.defineProperty(window,'__dgbC2BWebGL1Trace',{value:trace});
  });
  page.on('pageerror',e=>result.jsErrors.push(e.message));
  page.on('requestfailed',r=>result.requestFailures.push(r.url()));
  page.on('response',r=>{if(r.status()>=400)result.httpErrors.push({url:r.url(),status:r.status()});});
  const snapshot=()=>page.evaluate(()=>{
    const lab=window.__dgbSculptLab,studio=lab.studio,ids=['hero','side','front','rear'];
    return {state:studio.status(),positions:Array.from(studio.session.getPositions()),
      triangles:Array.from(studio.session.getTriangles()),views:studio.views(),
      gl:ids.map(id=>{const g=document.getElementById(id).getContext('webgl');
        return {id,actualWebGL1:!!g&&!g.isContextLost(),glError:g?.getError()??null};}),
      draws:ids.map(id=>({id,trace:window.__dgbC2BWebGL1Trace?.[id]??null}))};
  });
  const capture=async phase=>{
    const hashes=[];
    for(const id of ['hero','side','front','rear']){
      const bytes=await page.locator('#'+id).screenshot({type:'png'});
      const name='webgl1-'+id+'-'+phase+'.png',digest=sha(bytes);
      const normalized=await page.evaluate(async encoded=>{
        const binary=atob(encoded),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
        const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));
        try{
          const target=document.createElement('canvas');
          target.width=bitmap.width-4;target.height=bitmap.height-4;
          const g=target.getContext('2d',{willReadFrequently:true});
          g.drawImage(bitmap,2,2,target.width,target.height,0,0,target.width,target.height);
          const pixels=g.getImageData(0,0,target.width,target.height).data;
          const digest=await crypto.subtle.digest('SHA-256',pixels);
          return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
        }finally{bitmap.close();}
      },bytes.toString('base64'));
      images.push({name,caseId:'webgl1-fallback',phase,sha256:digest,normalizedInteriorSha256:normalized,bytes:bytes.length,encoding:'base64',image:bytes.toString('base64')});
      result.screenshots.push({name,phase,rawPngSha256:digest,normalizedInteriorSha256:normalized});
      hashes.push(normalized);
    }
    return hashes;
  };
  try{
    const response=await page.goto(base+ROUTE,{waitUntil:'networkidle',timeout:120000});
    check(response?.status()===200,'WEBGL1_HTTP_ROUTE_NOT_200');
    await page.waitForFunction(()=>window.__dgbSculptLab?.ready===true||window.__dgbSculptLab?.ready===false);
    const boot=await page.evaluate(()=>({ready:window.__dgbSculptLab.ready,error:window.__dgbSculptLab.error||null}));
    check(boot.ready,'WEBGL1_FALLBACK_STUDIO_BOOT:'+boot.error);
    const before=await snapshot();
    check(before.views.length===4&&before.views.every(v=>v.backend==='WEBGL1')&&
      before.gl.every(g=>g.actualWebGL1&&g.glError===0)&&
      before.draws.every(d=>d.trace?.count===1440),'WEBGL1_REAL_FOUR_VIEW_INDEXED_DRAW_FAILED');
    result.before=before;const beforeImages=await capture('before');
    const face=page.locator('#faceIndex');
    await face.focus();await face.pressSequentially('251');
    check((await snapshot()).state.selectedFace===251,'WEBGL1_KEYBOARD_FACE_SELECTION_FAILED');
    const subdivide=page.locator('#subdivide');await subdivide.focus();await subdivide.press('Enter');
    await page.waitForFunction(()=>window.__dgbSculptLab?.studio?.status().topologyDepth===1);
    const changed=await snapshot();
    check(changed.state.vertices===274&&changed.state.triangles===482&&
      changed.gl.every(g=>g.actualWebGL1&&g.glError===0)&&
      changed.draws.every(d=>d.trace?.count===1446),'WEBGL1_KEYBOARD_TOPOLOGY_FAILURE');
    const box=await page.locator('#front').boundingBox();
    check(box&&box.width>50&&box.height>50,'WEBGL1_FRONT_CANVAS_NOT_VISIBLE');
    const x=box.x+box.width/2,y=box.y+box.height/2;
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+12,y-9,{steps:3});await page.mouse.up();
    const edited=await snapshot();
    check(JSON.stringify(edited.positions)!==JSON.stringify(changed.positions)&&
      edited.gl.every(g=>g.actualWebGL1&&g.glError===0),'WEBGL1_POST_TOPOLOGY_POINTER_EDIT_FAILED');
    const changedImages=await capture('after');
    check(changedImages.every((digest,i)=>digest!==beforeImages[i]),'WEBGL1_FOUR_VIEW_VISIBLE_PIXEL_CHANGE_MISSING');
    const refInput=page.locator('#reference');
    await refInput.focus();
    check(await page.evaluate(()=>document.activeElement?.id==='reference'),'WEBGL1_KEYBOARD_REFERENCE_INPUT_UNFOCUSABLE');
    const png=await page.evaluate(()=>{
      const c=document.createElement('canvas');c.width=24;c.height=24;
      const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,24,24);
      g.fillStyle='#000';g.fillRect(6,5,12,14);
      return c.toDataURL('image/png').split(',')[1];
    });
    await refInput.setInputFiles({name:'webgl1-rectangle.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
    await page.waitForFunction(()=>document.querySelector('#status')?.textContent?.includes('Reference mask applied using Cycle One silhouette heuristic'));
    const imported=await snapshot(),saved=JSON.parse(await page.evaluate(()=>window.__dgbSculptLab.studio.saveState()));
    check(imported.gl.every(g=>g.actualWebGL1&&g.glError===0)&&
      imported.draws.every(d=>d.trace?.count===imported.state.triangles*3)&&
      saved.source?.kind==='SILHOUETTE_HEURISTIC_PRIOR'&&saved.source?.mask?.length===576,
      'WEBGL1_FOCUSABLE_REFERENCE_IMPORT_OR_DRAW_FAILED');
    const refImages=await capture('reference');
    check(refImages.every((digest,i)=>digest!==changedImages[i]),'WEBGL1_REFERENCE_FOUR_VIEW_PIXELS_UNCHANGED');
    check(!result.jsErrors.length&&!result.httpErrors.length&&!result.requestFailures.length,'WEBGL1_BROWSER_ERRORS');
    result.behavior={realWebGL1Views:4,keyboardSelectedFace:251,keyboardSubdivision:true,
      actualIndexedDraws:true,visibleFourViewPixelChanges:true,focusableReferenceInput:true,
      referenceMaskSamples:576,referenceSourcedV2:true,sourceMutation:false};
    result.pass=true;
  }catch(e){
    result.error=String(e.stack||e).slice(0,1800);
    if(!result.screenshots.length){try{await capture('failure');}catch{}}
  }finally{await context.close();}
  return result;
}

async function main(){
  if(process.argv.length===3&&process.argv[2]==='--self-test'){
    check(blob(Buffer.from('hello\n'))==='ce013625030ba8dba906f756967f9e9ca394464a','GIT_BLOB_HASH_TEST');
    check(Object.keys(blobs).length===5&&Object.keys(protectedBlobs).length===10,'FROZEN_SOURCE_POPULATION_TEST');
    check(HEAD.length===40&&cases.length===3,'TEST_IDENTITY_FAILURE');
    console.log('GRAPHICS_C2B_GEN3302_WEBGL12_QUALIFIER_SELF_TEST_PASS');return;
  }
  const opts=args(process.argv.slice(2));
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dgb-c2b-gen3302-'));
  const root=path.join(tmp,'candidate'),deps=path.join(tmp,'browser-deps');
  const receipt={schema:SCHEMA,operationId:OPERATION,executionHolder:opts['--execution-holder'],candidateHead:HEAD,governingHead:GOVERNING,status:'INCOMPLETE',cases:[],sourceMutationPerformed:false,productMutationPerformed:false,originalGen3273RunnerUntouched:true,workflowMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false,physicalDeviceAccepted:false,rabbitArtAccepted:false};
  const manifest={schema:'DGB_GRAPHICS_C2B_GEN3302_SCREENSHOT_MANIFEST_v1',candidateHead:HEAD,images:[]};
  let browser=null,server=null;
  try{
    receipt.changedPaths=checkout(root);receipt.sourceBlobs={...blobs,...protectedBlobs};
    receipt.native=nativeTests(root);
    check(receipt.native.exitStatus===0&&receipt.native.processError===null,
      'NATIVE_PROCESS_FAILED:'+receipt.native.exitStatus+':'+receipt.native.signal);
    check(receipt.native.fail===0,'NATIVE_ASSERTION_FAILURE:'+receipt.native.firstFailure);
    check(receipt.native.pass!==null&&receipt.native.pass>=100,'NATIVE_TEST_POPULATION_INCOMPLETE');
    fs.mkdirSync(deps,{recursive:true});
    run('npm',['install','--prefix',deps,'--no-save','--no-package-lock','--no-audit','playwright@1.56.1'],tmp,400000);
    run(process.execPath,[path.join(deps,'node_modules/playwright/cli.js'),'install','--with-deps','chromium'],tmp,400000);
    const {chromium}=createRequire(path.join(deps,'package.json'))('playwright');
    server=serverFor(root);
    await new Promise((ok,bad)=>{server.once('error',bad);server.listen(0,'127.0.0.1',ok);});
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
    receipt.browserVersion=browser.version();receipt.transport='ACTUAL_HTTP_ORIGINAL_MODULE_URLS';
    const base='http://127.0.0.1:'+server.address().port;
    for(const cfg of cases)receipt.cases.push(await oneCase(browser,base,cfg,manifest.images));
    receipt.cases.push(await webgl1FallbackCase(browser,base,manifest.images));
    receipt.status=receipt.cases.length===4&&receipt.cases.every(v=>v.pass)&&manifest.images.length===168?'PASS_CLOSED':'FAIL_CLOSED';
  }catch(e){receipt.status='FAIL_CLOSED';receipt.errorCode='FIXED_QUALIFICATION_FAILED';receipt.error=String(e.stack||e).slice(0,1900);}
  finally{
    if(browser)await browser.close().catch(()=>{});
    if(server)await new Promise(ok=>server.close(ok));
    try{receipt.checkoutClean=run('git',['status','--porcelain','--untracked-files=no'],root)==='';}catch{receipt.checkoutClean=false;}
    if(!receipt.checkoutClean){receipt.status='FAIL_CLOSED';receipt.errorCode=receipt.errorCode||'WORKTREE_CLEANLINESS_UNVERIFIED';}
    manifest.imageCount=manifest.images.length;
    fs.mkdirSync(path.dirname(opts['--output']),{recursive:true});fs.mkdirSync(path.dirname(opts['--manifest-output']),{recursive:true});
    fs.writeFileSync(opts['--output'],JSON.stringify(receipt,null,2)+'\n');
    fs.writeFileSync(opts['--manifest-output'],JSON.stringify(manifest)+'\n');
    fs.rmSync(tmp,{recursive:true,force:true});
  }
  console.log(JSON.stringify({status:receipt.status,head:HEAD,cases:receipt.cases.map(x=>({id:x.id,pass:x.pass,error:x.error?.slice(0,250)})),images:manifest.images.length}));
  if(receipt.status!=='PASS_CLOSED')process.exitCode=1;
}
main().catch(e=>{console.error(String(e.stack||e));process.exitCode=1;});
