import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const DIAGNOSTIC_MODES=Object.freeze(['unlit-albedo','substrate','after-soil','after-identity','after-groundcover']);
export const DIAGNOSTIC_STAGE_MEANINGS=Object.freeze({
 'unlit-albedo':'Final composed terrain base after all material overlays, without lighting or fog.',
 substrate:'Terrain palette immediately before the approved world-soil texture blend.',
 'after-soil':'Terrain palette after the approved world-soil texture blend, before environmental identity.',
 'after-identity':'Terrain palette immediately after environmental identity, before broad groundcover.',
 'after-groundcover':'Terrain palette immediately after broad groundcover, before subsequent local overlays.'
});
export const RENDERER_SHA256='7ac013645110fc91ac9d454916e30f3cc526b716b0c0ffad4c702e1e44b8bec2';
export const HEADS=Object.freeze({baseline:'85372f3dc896d73457f6a7d008ac08a51d0ba85b',candidate:'9127904e725a3f4ca13c1221451023102ad09435'});
export const POSES=Object.freeze([{name:'river-overlook',x:18,z:-226,yaw:210,pitch:-14},{name:'bare-mountain',x:88,z:-260,yaw:95,pitch:-10},{name:'coast-oblique',x:0,z:-110,yaw:170,pitch:-8},{name:'foothill-west',x:-52,z:-208,yaw:180,pitch:-12},
{name:'inland-seam-near',x:-200,z:-728,y:18.361431,yaw:0,pitch:-14,diagnosticObserver:true},
{name:'inland-seam-mid',x:-200,z:-704,y:18.272624,yaw:0,pitch:-4,diagnosticObserver:true},
{name:'inland-seam-far',x:-200,z:-656,y:18.793665,yaw:0,pitch:-2,diagnosticObserver:true},
{name:'coastal-seam-east',x:376,z:-96,y:2.603263,yaw:90,pitch:-14,diagnosticObserver:true},
{name:'coastal-seam-west',x:-376,z:-96,y:2.518974,yaw:270,pitch:-14,diagnosticObserver:true},
{name:'patch-close-south',x:88,z:-236,yaw:180,pitch:-17.72},
{name:'patch-east',x:92,z:-232,yaw:270,pitch:-6.69},
{name:'patch-west',x:84,z:-232,yaw:90,pitch:-13.5}].map(Object.freeze));
export const DIAGNOSTIC_POSES=Object.freeze(POSES.filter(p=>p.name==='inland-seam-near'));
// Observer heights exceed measured immutable mesh/analytic elevations by 2.25m.
// These views are outside walking bounds and confer no traversal/support authority.
export function comparisonState(nav,pose,sequence,action){
  if(pose.diagnosticObserver===true){
    if(!['x','y','z','yaw','pitch'].every(k=>Number.isFinite(pose[k])))throw Error('DIAGNOSTIC_POSE_INVALID');
    return {contractId:nav.H_EARTH_FUNCTIONAL_LANDSCAPE_NAVIGATION_CONTRACT_ID,position:{x:pose.x,y:pose.y,z:pose.z},yawDegrees:pose.yaw,pitchDegrees:pose.pitch,verticalFovDegrees:56,sequence,action,accepted:false,terrainSupported:false,geologicalPhysicalSupport:false,diagnosticObserver:true,canonicalCameraStateAuthority:false,collisionOrPhysicsClaim:false};
  }
  const r=nav.auditResolvePosition(pose.x,pose.z,pose.yaw,'SURFACE');if(!r.eligible)throw Error('POSE_INELIGIBLE');
  return nav.auditStateFrom(r,{yaw:pose.yaw,pitch:pose.pitch,fov:56,sequence,action});
}
const ROOT='/showroom/globe/h-earth/';
const RENDERER=ROOT+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const ROUTE=ROOT+'vegetation-prototype/route.js';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
export function replaceExactlyOnce(source,needle,replacement){if(source.split(needle).length!==2)throw Error('INSTRUMENTATION_ANCHOR_NOT_UNIQUE:'+needle);return source.replace(needle,replacement);}
export function instrumentRoute(source){return replaceExactlyOnce(source,'const cssWidth=','globalThis.__HEarthAuditPresent=present;globalThis.__HEarthAuditPacket=createHEarthRun8ER3AFrameUniformPacket;\nconst cssWidth=');}
export function instrumentRenderer(source){return replaceExactlyOnce(source,'resources.singleOwnerVegetation?.draw(packet);','if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');}
export function instrumentDiagnosticRenderer(source){
 if(sha(source)!==RENDERER_SHA256)throw Error('DIAGNOSTIC_SOURCE_HASH_MISMATCH');
 return transformDiagnosticSource(source);
}
export function transformDiagnosticSource(source){
 const start=source.indexOf('const FS ='),end=source.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<0)throw Error('DIAGNOSTIC_FS_BOUNDARY');
 let fsSource=source.slice(start,end);
 fsSource=replaceExactlyOnce(fsSource,'out vec4 outColor;','out vec4 outColor;\nuniform int uGroundDiagnosticMode;');
 fsSource=replaceExactlyOnce(fsSource,'void main(){','void main(){\n vec3 diagnosticSubstrate=vec3(0.0);\n vec3 diagnosticAfterSoil=vec3(0.0);\n vec3 diagnosticAfterIdentity=vec3(0.0);\n vec3 diagnosticAfterGroundcover=vec3(0.0);');
 const soilAnchor='    // Coast/sand, rock-exposure and local ecological overlays stay native.\n    if(uClearingEnabled==1){';
 fsSource=replaceExactlyOnce(fsSource,soilAnchor,'    // Coast/sand, rock-exposure and local ecological overlays stay native.\n    diagnosticSubstrate=palette;\n    if(uClearingEnabled==1){');
 const identityAnchor='    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN';
 // Identity and broad groundcover are skipped for geological rock; a skipped
 // stage retains the preceding snapshot instead of showing an uninitialized color.
 fsSource=replaceExactlyOnce(fsSource,identityAnchor,'    diagnosticAfterSoil=palette;\n    diagnosticAfterIdentity=palette;\n    diagnosticAfterGroundcover=palette;\n'+identityAnchor);
 fsSource=replaceExactlyOnce(fsSource,'      palette=mix(palette,identityBase,identityWeight);','      palette=mix(palette,identityBase,identityWeight);\n      diagnosticAfterIdentity=palette;');
 fsSource=replaceExactlyOnce(fsSource,'      palette=mix(palette,groundcoverTone,groundcoverWeight);','      palette=mix(palette,groundcoverTone,groundcoverWeight);\n      diagnosticAfterGroundcover=palette;');
 fsSource=replaceExactlyOnce(fsSource,'lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));',`if(worldSoilTerrain){
    if(uGroundDiagnosticMode==0)lit=base;
    else if(uGroundDiagnosticMode==1)lit=diagnosticSubstrate;
    else if(uGroundDiagnosticMode==2)lit=diagnosticAfterSoil;
    else if(uGroundDiagnosticMode==3)lit=diagnosticAfterIdentity;
    else if(uGroundDiagnosticMode==4)lit=diagnosticAfterGroundcover;
  }
  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));`);
 source=source.slice(0,start)+fsSource+source.slice(end);
 const anchor='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
 source=replaceExactlyOnce(source,anchor,anchor+`\n    {const mode=globalThis.__groundDiagnosticMode;if(!Number.isInteger(mode)||mode<0||mode>4)throw Error('DIAGNOSTIC_MODE_INVALID');const loc=gl.getUniformLocation(resources.geometryProgram,'uGroundDiagnosticMode');if(loc===null)throw Error('DIAGNOSTIC_UNIFORM_MISSING');gl.uniform1i(loc,mode);globalThis.__groundDiagnosticApplied=mode;}`);
 return instrumentRenderer(source);
}
export function validateDiagnosticSet(views){
 if(views.length!==5)throw Error('DIAGNOSTIC_INCOMPLETE');
 for(const pose of DIAGNOSTIC_POSES){const group=views.filter(v=>v.pose.name===pose.name);if(group.length!==5||new Set(group.map(v=>v.mode)).size!==5||!DIAGNOSTIC_MODES.every(m=>group.some(v=>v.mode===m)))throw Error('DIAGNOSTIC_MODE_SET');const ref=group.find(v=>v.mode==='unlit-albedo');for(const v of group)if(!v.grassHidden||v.diagnosticApplied!==DIAGNOSTIC_MODES.indexOf(v.mode)||v.assetSignature!==ref.assetSignature||JSON.stringify(v.state.position)!==JSON.stringify(ref.state.position)||JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition))throw Error('DIAGNOSTIC_MATCH_MISMATCH');}
 return true;
}
export function sameHeading(a,b){return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(((a-b)%360+540)%360-180)<1e-8;}
export function validateFrame(value,pose,sequence){
  const {state,lastFrame,canvas,expectedCameraPosition}=value;
  if(pose.diagnosticObserver&&(state?.diagnosticObserver!==true||state.accepted!==false||state.terrainSupported!==false||state.geologicalPhysicalSupport!==false||state.position?.y!==pose.y))throw Error('DIAGNOSTIC_AUTHORITY_MISMATCH');
  if(!state||!lastFrame||state.sequence!==sequence||lastFrame.navigationSequence!==sequence)throw Error('FRAME_NAVIGATION_MISMATCH');
  if(!Number.isInteger(lastFrame.frameSequence)||lastFrame.frameSequence<1)throw Error('FRAME_SEQUENCE_INVALID');
  if(state.position.x!==pose.x||state.position.z!==pose.z||!sameHeading(state.yawDegrees,pose.yaw)||state.pitchDegrees!==pose.pitch||state.verticalFovDegrees!==56)throw Error('POSE_MISMATCH');
  if(!Number.isFinite(state.position.y)||!expectedCameraPosition||!['x','y','z'].every(k=>Number.isFinite(expectedCameraPosition[k])&&Number.isFinite(lastFrame.cameraPosition?.[k])&&Math.abs(expectedCameraPosition[k]-lastFrame.cameraPosition[k])<1e-8))throw Error('FRAME_CAMERA_MISMATCH');
  if(canvas.width!==529||canvas.height!==980||canvas.cssWidth!==540||canvas.cssHeight!==1000)throw Error('RESOLUTION_MISMATCH');
  return true;
}
export function assetReadiness(resources,camera){
  const tree=resources?.treeCollection,jac=resources?.jacaranda;
  if(!tree?.queue||!Array.isArray(tree.entries)||!jac||!Number.isFinite(camera?.x)||!Number.isFinite(camera?.z))throw Error('ASSET_RECEIPT_MISSING');
  const all=[jac,...tree.entries];
  if(all.some(x=>!['IDLE','LOADING','READY'].includes(x.state)||x.failure)||Object.keys(tree.queue.failures??{}).length)throw Error('ASSET_FAILURE');
  const near=(e,inclusive)=>{const a=inclusive?e.targetAnchor:e;if(!Number.isFinite(a.x)||!Number.isFinite(a.z))throw Error('ASSET_ANCHOR_MISSING');const d=Math.hypot(camera.x-a.x,camera.z-a.z);return inclusive?d<=180:d<180;};
  const pending=tree.queue.loading||all.some(x=>x.state==='LOADING')||(jac.state==='IDLE'&&near(jac,true))||tree.entries.some(e=>e.state==='IDLE'&&near(e,false));
  return {ready:!pending,signature:JSON.stringify(all.map(e=>({id:e.focusId??e.id,state:e.state,ready:e.ready}))),queue:tree.queue};
}
export function decodeCanvasCapture(capture,expectedFrame){
  for(const frame of [capture.before,capture.after])if(!frame||frame.navigationSequence!==expectedFrame.navigationSequence||frame.frameSequence!==expectedFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
  if(!/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(capture.dataUrl??''))throw Error('CAPTURE_PNG_INVALID');
  const bytes=Buffer.from(capture.dataUrl.split(',')[1],'base64');
  if(bytes.length<1024)throw Error('EMPTY_CAPTURE');
  if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)!==529||bytes.readUInt32BE(20)!==980)throw Error('CAPTURE_PNG_DIMENSIONS_INVALID');
  return bytes;
}
export function assertCheckout(dir,expected){const head=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==expected)throw Error('CHECKOUT_HEAD_MISMATCH');if(execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('CHECKOUT_TRACKED_BYTES_CHANGED');}
export function parseArgs(argv){const a={};for(let i=0;i<argv.length;i+=2){if(!['--baseline-dir','--candidate-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('CLI_NOT_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}if(Object.keys(a).length!==3)throw Error('CLI_INCOMPLETE');if(new Set(Object.values(a)).size!==3)throw Error('DIRECTORIES_NOT_DISTINCT');return a;}
export async function run(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,poses:DIAGNOSTIC_POSES,modes:DIAGNOSTIC_MODES,diagnosticOnly:true,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,colorTransform:'ALL_STAGES_LINEAR_RGB_TIMES_1.12_THEN_GAMMA_1_OVER_2.2',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  const onTerm=()=>interrupt('SIGTERM'),onInt=()=>interrupt('SIGINT');
  process.once('SIGTERM',onTerm);process.once('SIGINT',onInt);persist();
  try{
    for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of ['candidate'].entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      await page.addInitScript({content:'globalThis.__groundDiagnosticMode=0;globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';'});
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,instrumentDiagnosticRenderer]]){
        const original=fs.readFileSync(path.join(dir,pathname),'utf8'),transformed=transform(original);runRecord.instrumentation.push({path:pathname,sourceSha256:sha(original),observedSha256:sha(transformed)});
        await page.route(url=>url.pathname===pathname,route=>route.fulfill({status:200,contentType:'text/javascript',body:transformed}));
      }
      persist();
      await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('RENDERER_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(270,350);await page.mouse.down();await page.mouse.move(320,350,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
      let sequence=10000,previousFrame=0;
      for(const pose of DIAGNOSTIC_POSES)for(const mode of DIAGNOSTIC_MODES){
        const hidden=true;await page.evaluate(value=>{globalThis.__groundDiagnosticMode=value;},DIAGNOSTIC_MODES.indexOf(mode));
        const settleDeadline=Date.now()+180000;let stable=0,signature=null;
        while(stable<2){
          const settled=await page.evaluate(async({pose,hidden,sequence})=>{
            globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON_SETTLE');
            globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
            const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');const expected=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});return {asset:globalThis.__groundAssetReadiness(gpu.resources,expected.camera.position),frame:gpu.frameRecords.at(-1)};
          },{pose,hidden,sequence:sequence+1});
          receipt.lastSettle={label,pose,...settled};persist();
          stable=settled.frame.navigationSequence===sequence+1&&settled.asset.ready&&settled.asset.signature===signature?stable+1:0;signature=settled.asset.signature;
          if(Date.now()>settleDeadline)throw Error('ASSETS_NOT_SETTLED');
          if(stable<2)await new Promise(r=>setTimeout(r,250));
        }

        const view=await page.evaluate(async({pose,hidden,sequence})=>{
          globalThis.__groundComparisonHideGrass=hidden;const state=globalThis.__groundComparisonState(globalThis.__groundComparisonNav,pose,sequence,'READ_ONLY_GROUND_COMPARISON');
          globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
          const costs=[];for(let i=0;i<12;i++){const t=performance.now();globalThis.__HEarthAuditPresent(state);costs.push(performance.now()-t);await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');
          const expectedPacket=globalThis.__HEarthAuditPacket({deferVegetation:true,navigationState:state,viewport:{width:canvas.width,height:canvas.height,pixelRatio:1},frameSequence:sequence});
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__groundDiagnosticApplied};
        },{pose,hidden,sequence:++sequence});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==DIAGNOSTIC_MODES.indexOf(mode))throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    validateDiagnosticSet(receipt.views);
    receipt.result='DIAGNOSTIC_CAPTURE_COMPLETE_CAUSE_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});

