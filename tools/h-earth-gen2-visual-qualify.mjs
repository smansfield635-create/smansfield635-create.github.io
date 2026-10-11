#!/usr/bin/env node
// Existing registered Gen2 visual qualifier. The Gen2638 branch must draw
// the four approved trees; a loading-screen canvas cannot qualify as a render.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {chromium} from 'playwright';

const productHeads=new Set([
  '783c6347f768565e794418ff02a0201e69e0730d',
  '192404eda2fae556c452083309061c82901a933f'
]);
const approvedIds=['P2_TREE_A_03','P2_TREE_A_06','P2_TREE_A_08','P2_TREE_A_11'];
const approvedFourTreeGeometryBlob='c26247dcb69cb52c968fcd3ef6c2626eaa577d03';
const isApprovedFourTreeGeometryBlob=blob=>blob===approvedFourTreeGeometryBlob;
const out='/tmp/gen2-evidence';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
// Gen2652 scoped read-only observation of already qualified product bytes.
// With no source-bound observer receipt, the registered legacy verifier is unchanged.
const walkingObserverReceiptPath='h-earth-3d/experience-anchor/receipts/h-earth-soil-expansion-walking-view-observer-20261011.receipt.json';
const walkingObserverReceipt=await fs.readFile(walkingObserverReceiptPath,'utf8').then(JSON.parse).catch(error=>{
 if(error?.code==='ENOENT')return null;
 throw error;
});
const walkingObserverActive=walkingObserverReceipt?.schema==='H_EARTH_SOIL_EXPANSION_WALKING_VIEW_OBSERVER_v1'&&
 walkingObserverReceipt?.operationId==='H_EARTH_SOIL_EXPANSION_WALKING_VIEW_OBSERVER_20261011_001'&&
 walkingObserverReceipt?.releaseEligible===false;
if(walkingObserverReceipt&&!walkingObserverActive)throw Error('INVALID_SOIL_WALKING_OBSERVER_RECEIPT');

const readiness=s=>Boolean(
  s?.routeReady&&s?.hasPublicRoute&&!s?.loadingScreen&&s?.canvas?.present&&
  s.canvas.visible&&s.canvas.width>=100&&s.canvas.height>=100&&
  s.webgl2Alive&&s.gpuPresentations>0&&!s.firstFailureStage
);
const residencyReady=r=>Boolean(
  r?.preparationComplete===true&&r?.validationStatus==='VALIDATED'&&
  r?.totalBatchCount===108&&r?.residentBatchCount===108&&
  r?.totalInstanceCount===27585&&r?.residentInstanceCount===27585&&
  r?.complete===true&&r?.droppedPlacementCount===0&&r?.worldRebuildCount===0
);
if(process.argv.includes('--self-test')){
  const example={routeReady:true,hasPublicRoute:true,loadingScreen:false,canvas:{present:true,visible:true,width:320,height:180},webgl2Alive:true,gpuPresentations:2,firstFailureStage:null};
  const complete={preparationComplete:true,validationStatus:'VALIDATED',totalBatchCount:108,residentBatchCount:108,totalInstanceCount:27585,residentInstanceCount:27585,complete:true,droppedPlacementCount:0,worldRebuildCount:0};
  if(!readiness(example)||readiness({...example,loadingScreen:true})||readiness({...example,canvas:{present:false}})||readiness({...example,gpuPresentations:0})||!residencyReady(complete)||residencyReady({...complete,residentBatchCount:2})||!isApprovedFourTreeGeometryBlob('c26247dcb69cb52c968fcd3ef6c2626eaa577d03')||isApprovedFourTreeGeometryBlob('02a2568e8a478fb9153ec29910266671ba349b01'))throw Error('GEN2638_QUALIFIER_SELF_TEST_FAILED');
  console.log(JSON.stringify({schema:'H_EARTH_GEN2_VISUAL_QUALIFIER_SELF_TEST_v1',result:'PASS',loadingOverlayRejected:true,missingGpuRejected:true,incompleteResidencyRejected:true}));
}else{
 const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const geometryBlob=execFileSync('git',['rev-parse','HEAD:showroom/globe/h-earth/render/geometry-landscape-sector.p2.js'],{encoding:'utf8'}).trim();
 const fourOnly=productHeads.has(sha)||isApprovedFourTreeGeometryBlob(geometryBlob);
 if(walkingObserverActive){
  if(!fourOnly)throw Error('WALKING_OBSERVER_REQUIRES_APPROVED_FOUR_TREE_PRODUCT');
  for(const [path,expectedBlob] of Object.entries(walkingObserverReceipt.exactProtectedBlobs||{})){
   const actualBlob=execFileSync('git',['rev-parse','HEAD:'+path],{encoding:'utf8'}).trim();
   if(actualBlob!==expectedBlob)throw Error('WALKING_OBSERVER_PROTECTED_SOURCE_MISMATCH:'+path);
  }
 }

 const receipt={schema:'H_EARTH_GEN2_VISUAL_QUALIFICATION_v1',candidateHead:sha,actualBrowserExecution:false,productMode:fourOnly?'GEN2638_FOUR_TREES':'GEN2',views:[],result:'PENDING',physicalAndroidQualified:false};
 let server=null,browser=null;
 await fs.mkdir(out,{recursive:true});
 try{
  if(fourOnly){
   // The registered workflow checks out the candidate with fetch-depth:1.
   // The established independent tree verifier compares against an immutable
   // production baseline, so materialize only that exact commit when absent.
   // This changes local git object availability, not the candidate worktree.
   const baseline='23eb1bb79c13b2d79e7006e2d9bf664ecf31aed2';
   const baselineObject=baseline+'^{commit}';
   try{execFileSync('git',['cat-file','-e',baselineObject],{stdio:'ignore'});}
   catch{execFileSync('git',['fetch','--no-tags','--depth=1','origin',baseline],{stdio:'ignore',timeout:120000});}
   execFileSync('git',['cat-file','-e',baselineObject],{stdio:'ignore'});
   const proof=JSON.parse(execFileSync(process.execPath,['showroom/globe/h-earth/validation/four-tree-only.verify.mjs'],{encoding:'utf8',timeout:180000,maxBuffer:2*1024*1024}));
   if(proof.result!=='PASS'||proof.approvedCount!==4||proof.oldVisibleTreeCount!==0||proof.approvedGeometryUnchanged!==true||proof.deferredConiferGpuDrawExcluded!==true||approvedIds.some(id=>!proof.approvedTreeIds.includes(id)))throw Error('FOUR_TREE_SOURCE_CENSUS_FAILED');
   receipt.sourceTreeCensus={approvedIds:proof.approvedTreeIds,approvedCount:4,oldVisibleTreeCount:0,approvedGeometryUnchanged:true,legacyConiferDrawFilterPresent:true};
  }
  server=spawn('python3',['-m','http.server','4173','--bind','127.0.0.1','--directory','.'],{stdio:'ignore'});
  let serving=false;
  for(let i=0;i<80;i++){try{serving=(await fetch('http://127.0.0.1:4173/showroom/globe/h-earth/')).ok;if(serving)break;}catch{}await sleep(250);}
  if(!serving)throw Error('GEN2638_STAGE_NOT_SERVING');
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  receipt.actualBrowserExecution=true;
  const views=fourOnly?[
   {id:'approved-four-tree-clearing',query:'?arrival=approved-four-trees',x:-139.40267987050615,z:-194.5},
   {id:'coast',query:'',x:0,z:-96}
  ]:[{id:'coast',query:'',x:null,z:null}];
  for(const v of views){
   const context=await browser.newContext({viewport:{width:412,height:915},deviceScaleFactor:2,isMobile:true,hasTouch:true});
   const page=await context.newPage();
   const entry={id:v.id,result:'PENDING',progress:[],errors:[],failedRequests:[]};
   receipt.views.push(entry);
   page.on('pageerror',error=>entry.errors.push(String(error?.message||error)));
   page.on('console',msg=>{if(msg.type()==='error')entry.errors.push('console:'+msg.text())});
   page.on('requestfailed',req=>entry.failedRequests.push({url:req.url(),failure:req.failure()}));
   try{
    await page.goto('http://127.0.0.1:4173/showroom/globe/h-earth/'+v.query,{waitUntil:'domcontentloaded',timeout:90000});
    const observe=()=>page.evaluate(()=>{
     const root=document.getElementById('h-earth-functional-landscape-route');
     const canvas=document.getElementById('h-earth-functional-landscape-canvas');
     const loader=document.querySelector('.h-earth-experience-loader');
     const route=window.H_EARTH_RUN8E_PUBLIC_ROUTE;
     const gpu=route?.getLiveGpuReceipt?.()||null;
     const rect=canvas?.getBoundingClientRect();
     const style=canvas?getComputedStyle(canvas):null;
     let gl=null;try{gl=canvas?.getContext('webgl2')}catch{}
     const startup=window.H_EARTH_RENDERER_STARTUP_DIAGNOSTICS?.getReceipt?.()||null;
     return {
      routeReady:root?.dataset.run8eReady==='true',
      routeError:root?.dataset.run8eError==='true',
      loadingScreen:Boolean(loader&&loader.isConnected&&loader.dataset.ready!=='true'&&getComputedStyle(loader).visibility!=='hidden'),
      loaderProgress:loader?.querySelector('.h-earth-experience-loader__percent')?.textContent||null,
      hasPublicRoute:Boolean(route?.getLiveGpuReceipt&&route?.getIntakeReceipt),
      canvas:{present:canvas instanceof HTMLCanvasElement,width:canvas?.width||0,height:canvas?.height||0,visible:Boolean(rect&&rect.width>0&&rect.height>0&&style?.visibility!=='hidden'&&style?.display!=='none')},
      webgl2Alive:Boolean(gl&&!gl.isContextLost()),
      gpuPresentations:gpu?.counters?.gpuFramebufferPresentationCount??0,
      gpuFourTreeFloorCount:gpu?.resources?.landscapeFloor?.treeCount??null,
      clearingGpuReady:gpu?.resources?.woodlandClearing?.ready===true,
      clearingCasterIndexCount:gpu?.resources?.woodlandClearing?.casterIndexCount??null,
      firstFailureStage:startup?.firstFailureStage||null,
      position:route?.getIntakeReceipt?.()?.currentNavigationState?.position||null,
      navigation:(()=>{const n=route?.getIntakeReceipt?.()?.currentNavigationState;return n?{yawDegrees:n.yawDegrees,pitchDegrees:n.pitchDegrees,position:n.position,sequence:n.sequence}:null})(),
      residencyStatus:root?.dataset.vegetationResidency||null,
      residency:route?.getVegetationResidency?.()||null
     };
    });
    let snap,ready=false;
    const startupBegin=Date.now();
    for(let k=0;k<90;k++){
     snap=await observe();
     if(k%5===0)entry.progress.push({phase:'STARTUP',elapsedMs:Date.now()-startupBegin,loader:snap.loaderProgress,ready:snap.routeReady,frames:snap.gpuPresentations});
     if(readiness(snap)){ready=true;break}
     if(snap.routeError||snap.firstFailureStage)break;
     await sleep(2000);
    }
    entry.readiness={pass:ready,snapshot:snap};
    if(!ready){await page.screenshot({path:out+'/'+v.id+'-loading-or-error.png',fullPage:true});throw Error('ACTUAL_WORLD_NOT_RENDERED_LOADING_SCREEN_REJECTED')}
    if(v.x!==null&&(!snap.position||Math.abs(snap.position.x-v.x)>0.03||Math.abs(snap.position.z-v.z)>0.03))throw Error('GEN2638_ARRIVAL_POSITION_MISMATCH:'+JSON.stringify(snap.position));
    if(fourOnly){
     entry.gpuTreeCensus={treeCount:snap.gpuFourTreeFloorCount,clearingReady:snap.clearingGpuReady,casterIndexCount:snap.clearingCasterIndexCount};
     if(snap.gpuFourTreeFloorCount!==4||snap.clearingGpuReady!==true||!(snap.clearingCasterIndexCount>0))throw Error('GEN2638_ACTUAL_GPU_FLOOR_OR_CLEARING_CENSUS_FAILED');
    }
    entry.position=snap.position;
    const image=await page.locator('#h-earth-functional-landscape-canvas').screenshot({path:out+'/'+v.id+'-ready-canvas.png'});
    if(image.length<1024)throw Error('ACTUAL_GPU_CANVAS_IMAGE_EMPTY');
    await page.screenshot({path:out+'/'+v.id+'-ready-page.png',fullPage:true});
    if(fourOnly){
     const started=Date.now();let previous=-1;
     while(Date.now()-started<9*60*1000){
      snap=await observe();
      const n=snap.residency?.residentBatchCount??0;
      if(n!==previous){entry.progress.push({phase:'RESIDENCY',elapsedMs:Date.now()-started,completedBatches:n,totalBatches:snap.residency?.totalBatchCount||null,instances:snap.residency?.residentInstanceCount||0});previous=n;}
      if(snap.residencyStatus==='failed'||snap.firstFailureStage)throw Error('GEN2638_VEGETATION_FAILED');
      if(residencyReady(snap.residency))break;
      await sleep(2000);
     }
     entry.residency=snap.residency;
     if(!residencyReady(snap.residency)){await page.screenshot({path:out+'/'+v.id+'-incomplete-residency.png',fullPage:true});throw Error('GEN2638_DEFERRED_RESIDENCY_INCOMPLETE')}
     if(!readiness(snap))throw Error('GEN2638_POST_RESIDENCY_RENDERER_NOT_READY');
     if(snap.gpuFourTreeFloorCount!==4||snap.clearingGpuReady!==true||!(snap.clearingCasterIndexCount>0))throw Error('GEN2638_POST_RESIDENCY_GPU_TREE_CENSUS_FAILED');
     const post=await page.locator('#h-earth-functional-landscape-canvas').screenshot({path:out+'/'+v.id+'-post-residency-canvas.png'});
     if(post.length<1024)throw Error('POST_RESIDENCY_GPU_IMAGE_EMPTY');
     await page.screenshot({path:out+'/'+v.id+'-post-residency-page.png',fullPage:true});
     // The owner-requested question is soil quality OUTSIDE the reference,
     // not whether the 32m border is merely concealed. The existing
     // canonical wheel/navigation APIs supply true WebGL2 positions.
     if(v.id==='approved-four-tree-clearing'&&walkingObserverActive){
       entry.walkingExpansion={schema:'H_EARTH_SOIL_EXPANSION_WALKING_VIEW_OBSERVER_v1',receiptSource:walkingObserverReceiptPath,referencePosition:snap.position,views:[]};
       const canvas=page.locator('#h-earth-functional-landscape-canvas');
       const box=await canvas.boundingBox();
       if(!box||box.width<150||box.height<150)throw Error('WALKING_OBSERVER_CANVAS_GEOMETRY_MISSING');
       const midX=box.x+box.width*0.53,midY=box.y+box.height*0.53;
       await page.mouse.move(midX,midY);
       const initialZ=v.z;
       for(let step=1;step<=7;step++){
         await page.mouse.wheel(0,700);
         let current=null;
         const expectedZ=initialZ+10*step;
         for(let attempt=0;attempt<36;attempt++){
           current=await observe();
           if(current.position&&Math.abs(current.position.z-expectedZ)<0.08&&readiness(current)&&residencyReady(current.residency))break;
           await sleep(250);
         }
         if(!current?.position||Math.abs(current.position.z-expectedZ)>=0.08)
           throw Error('WALKING_OBSERVER_NAVIGATION_REJECTED_OR_DRIFT:'+JSON.stringify({step,expectedZ,actual:current?.position}));
         if(!readiness(current)||!residencyReady(current.residency)||current.gpuFourTreeFloorCount!==4)
           throw Error('WALKING_OBSERVER_GPU_OR_VEGETATION_RESIDENCY_REGRESSION:'+step);
         // Lower the view with the product's actual one-finger PITCH_DOWN
         // gesture, once beyond the original rectangular edge.
         if(step===2){
           await page.mouse.move(midX,midY-110);
           await page.mouse.down();
           await page.mouse.move(midX,midY+100,{steps:10});
           await sleep(480);
           await page.mouse.up();
           await page.mouse.move(midX,midY);
           current=await observe();
           if((current?.navigation?.pitchDegrees??999)>0)
             throw Error('WALKING_OBSERVER_REAL_PITCH_DOWN_NOT_APPLIED:'+JSON.stringify(current?.navigation));
         }
         if([1,2,4,7].includes(step)){
           await sleep(750);
           const after=await observe();
           if(!readiness(after)||!residencyReady(after.residency))throw Error('WALKING_OBSERVER_POST_NAV_RENDERER_NOT_READY:'+step);
           const filename='approved-four-tree-clearing-outside-north-'+(step*10)+'m-canvas.png';
           const bytes=await canvas.screenshot({path:out+'/'+filename});
           entry.walkingExpansion.views.push({
             id:'NORTH_'+(step*10)+'M',distanceFromReferenceMeters:step*10,filename,
             sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
             actualCameraPosition:after.position,actualCameraOrientation:after.navigation,
             gpuPresentations:after.gpuPresentations,
             residentBatchCount:after.residency?.residentBatchCount,
             residentInstanceCount:after.residency?.residentInstanceCount,
             approvedTreeCount:after.gpuFourTreeFloorCount
           });
         }
       }
       if(entry.walkingExpansion.views.length!==4)throw Error('WALKING_OBSERVER_MISSING_FOUR_ACTUAL_VIEWS');
     }

    }
    if(entry.errors.length||entry.failedRequests.length)throw Error('GEN2638_BROWSER_ERRORS_OR_REQUEST_FAILURES');
    entry.result='PASS';
   }catch(error){entry.result='FAIL';entry.error=String(error?.stack||error);throw error;}
   finally{await context.close()}
  }
  receipt.result='PASS';
  receipt.limitations=['Actual screenshots require perceptual inspection for individual tree silhouettes','Headless Chromium is not physical Android performance'];
 }catch(error){receipt.result='FAIL';receipt.error=String(error?.stack||error);process.exitCode=1;}
 finally{
  try{await browser?.close()}catch{}
  server?.kill('SIGTERM');
  await fs.writeFile(out+'/receipt.json',JSON.stringify(receipt,null,2)+'\n');
  console.log('H_EARTH_GEN2_VISUAL_QUALIFICATION_EVIDENCE '+JSON.stringify(receipt));
  if(receipt.result!=='PASS')process.exitCode=1;
 }
}
