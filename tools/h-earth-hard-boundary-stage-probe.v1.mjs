import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const GEN2928_HEAD='cb57c275b95d0d48883bc4da4dcfcf17cbec5060';
export const GEN2928_SHADER_SHA256='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec';
export const MODES=Object.freeze(['reference-lit','pre-worldsoil-unlit','post-worldsoil-unlit','post-identity-unlit','post-groundcover-unlit','post-local-unlit','post-habitat-unlit','groundcover-weight-raw','habitat-weight-raw','reference-lit-with-grass']);
export const MODES_MINIMUM=Object.freeze(MODES.map((_,i)=>i));
function probeOnce(s,needle,repl){if(s.split(needle).length!==2)throw Error('STAGE_ANCHOR_NOT_UNIQUE:'+needle.slice(0,75));return s.replace(needle,repl);}
export function transformHardBoundaryRenderer(original){
 const actual=crypto.createHash('sha256').update(original).digest('hex');
 if(actual!==GEN2928_SHADER_SHA256)throw Error('PUBLISHED_GEN2928_SOURCE_SHA_MISMATCH:'+actual);
 const start=original.indexOf('const FS = '),end=original.indexOf('// Ordered screen-door coverage',start);
 if(start<0||end<=start)throw Error('GPU_FRAGMENT_SOURCE_NOT_FOUND');
 let fs=original.slice(start,end);
 fs=probeOnce(fs,'out vec4 outColor;','out vec4 outColor;\nuniform int uHardBoundaryStageMode;');
 fs=probeOnce(fs,'float terrainRoughnessForLighting=0.72;','float terrainRoughnessForLighting=0.72;\n  vec3 bndBeforeSoil=vec3(0.0),bndSoil=vec3(0.0),bndIdentity=vec3(0.0),bndGroundcover=vec3(0.0),bndLocal=vec3(0.0),bndHabitat=vec3(0.0);\n  float bndGCWeight=0.0,bndHabitatWeight=0.0;');
 fs=probeOnce(fs,'    // H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2\n','    // H_EARTH_ACTUAL_WORLD_SOIL_MATERIAL_20261010_V2\n    bndBeforeSoil=palette;\n');
 fs=probeOnce(fs,'    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN','    bndSoil=palette; bndIdentity=palette; bndGroundcover=palette;\n    // H_EARTH_EAST_A_ENVIRONMENTAL_IDENTITY_GEN2823_STAGE_A_BEGIN');
 fs=probeOnce(fs,'      // H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN','      bndIdentity=palette;\n      // H_EARTH_BROAD_GROUNDCOVER_V1_BEGIN');
 fs=probeOnce(fs,'      palette=mix(palette,groundcoverTone,groundcoverWeight);','      bndGCWeight=groundcoverWeight;\n      palette=mix(palette,groundcoverTone,groundcoverWeight);\n      bndGroundcover=palette;');
 fs=probeOnce(fs,'    base=palette;\n  }else if(vRoleCode==4u){','    bndLocal=palette;\n    base=palette;\n  }else if(vRoleCode==4u){');
 fs=probeOnce(fs,'    vec3 habitatSoil=landscapeCoverPalette(vWorldPosition.xz,foothillDry)*.72;','    bndHabitatWeight=habitatCoverage*.68;\n    vec3 habitatSoil=landscapeCoverPalette(vWorldPosition.xz,foothillDry)*.72;');
 fs=probeOnce(fs,'  if(clearingType>0.5&&clearingType<1.5){','  bndHabitat=base;\n  if(clearingType>0.5&&clearingType<1.5){');
 const gamma='  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));';
 fs=probeOnce(fs,gamma,gamma+"\n  if(worldSoilTerrain&&uHardBoundaryStageMode>0){\n    int m=uHardBoundaryStageMode;\n    if(m>=1&&m<=6){\n      vec3 c=m==1?bndBeforeSoil:m==2?bndSoil:m==3?bndIdentity:m==4?bndGroundcover:m==5?bndLocal:bndHabitat;\n      lit=pow(clamp(c*1.12,0.0,1.0),vec3(1.0/2.2));\n    }else if(m==7)lit=vec3(clamp(bndGCWeight,0.0,1.0));\n    else if(m==8)lit=vec3(clamp(bndHabitatWeight,0.0,1.0));\n  }");
 let source=original.slice(0,start)+fs+original.slice(end);
 const draw='gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);';
 source=probeOnce(source,draw,draw+"\n    {const mode=globalThis.__hardBoundaryStageMode??0;if(!Number.isInteger(mode)||mode<0||mode>=10)throw Error('HARD_BOUNDARY_MODE_INVALID');const loc=gl.getUniformLocation(resources.geometryProgram,'uHardBoundaryStageMode');if(loc===null)throw Error('HARD_BOUNDARY_UNIFORM_MISSING');gl.uniform1i(loc,mode);globalThis.__hardBoundaryModeApplied=mode;}");
 return Object.freeze({source,originalSha256:actual,instrumentedSha256:crypto.createHash('sha256').update(source).digest('hex'),productDiskMutation:false});
}



export const DIAGNOSTIC_MODES=Object.freeze(MODES.slice());
const MODE_ID_BY_NAME=new Map(MODES.map((name,index)=>[name,index]));
export const DIAGNOSTIC_STAGE_MEANINGS=Object.freeze(Object.fromEntries(DIAGNOSTIC_MODES.map(name=>[name,'Read-only browser-injected ordered shader stage, unchanged product disk source'])));
export const SEARCH_PROVENANCE=Object.freeze({kind:'POST_GEN2928_NEW_CAMERAS_OWNER_SCREENSHOT_NOT_EXACT_MATCH',operationId:'H_EARTH_POST_GEN2928_HARD_BOUNDARY_STAGE_DIAGNOSTIC_20261027_001',sourceIssue:6911,sourceHead:GEN2928_HEAD,ownerExactCameraKnown:false});
export const RENDERER_SHA256=GEN2928_SHADER_SHA256;
export const MATERIAL_BASELINE_HEAD=GEN2928_HEAD;
export const HEADS=Object.freeze({baseline:GEN2928_HEAD,candidate:GEN2928_HEAD});
export const POSES=Object.freeze([
{name:'new-inland-arc-west',x:-210,z:-704,y:18.272624,yaw:333,pitch:-12,diagnosticObserver:true},
{name:'new-inland-arc-east',x:-190,z:-704,y:18.272624,yaw:27,pitch:-12,diagnosticObserver:true},
{name:'new-shore-east-inward',x:376,z:-96,y:2.603263,yaw:111,pitch:-13,diagnosticObserver:true},
{name:'new-river-overlook',x:18,z:-226,yaw:165,pitch:-12},
{name:'new-foothill-west',x:-52,z:-208,yaw:136,pitch:-15},
{name:'new-bare-mountain',x:88,z:-260,yaw:118,pitch:-13}
].map(Object.freeze));
export const DIAGNOSTIC_POSES=POSES;
export const SURVEY_POSES=POSES;
export const SURVEY_MODES=DIAGNOSTIC_MODES;
export const SOURCE_FIRST_TARGET_POSES=Object.freeze([
 {name:'coastal-atlas-edge-approach-north',x:-146,z:-270,yaw:180,pitch:-18,sourceBoundary:{x:-146,z:-283,stage:'coastal-habitat',origin:'SOURCE_FIRST_CENSUS_ARTIFACT_12768211588'}},
 {name:'coastal-atlas-edge-approach-south',x:-146,z:-296,yaw:0,pitch:-18,sourceBoundary:{x:-146,z:-283,stage:'coastal-habitat',origin:'SOURCE_FIRST_CENSUS_ARTIFACT_12768211588'}},
 {name:'estate-groundcover-east-edge',x:145,z:-202,yaw:270,pitch:-18,sourceBoundary:{x:132,z:-202,stage:'groundcover-protection',origin:'SOURCE_FIRST_CENSUS_ARTIFACT_12768211588'}}
].map(Object.freeze));
export const SOURCE_FIRST_TARGET_MODES=Object.freeze(['reference-lit','pre-worldsoil-unlit','post-worldsoil-unlit','post-identity-unlit','post-groundcover-unlit','post-local-unlit','post-habitat-unlit','reference-lit-with-grass']);
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
export function verifyExactMaterialCandidate(source){const h=sha(source);if(h!==GEN2928_SHADER_SHA256)throw Error('EXACT_GEN2928_SHADER_REQUIRED:'+h);return h;}
export function instrumentCandidateRenderer(source){verifyExactMaterialCandidate(source);return instrumentRenderer(transformHardBoundaryRenderer(source).source);}
export function instrumentDiagnosticRenderer(source){return instrumentCandidateRenderer(source);}
export function validateDiagnosticSet(views,poses=DIAGNOSTIC_POSES,modes=DIAGNOSTIC_MODES){
 if(views.length!==poses.length*modes.length)throw Error('DIAGNOSTIC_INCOMPLETE');
 for(const pose of poses){
  const group=views.filter(v=>v.pose.name===pose.name);
  if(group.length!==modes.length||new Set(group.map(v=>v.mode)).size!==modes.length||!modes.every(m=>group.some(v=>v.mode===m)))throw Error('DIAGNOSTIC_MODE_SET');
  const ref=group[0];
  for(const v of group){
   if(v.grassHidden!==(v.mode!=='reference-lit-with-grass')||v.diagnosticApplied!==MODE_ID_BY_NAME.get(v.mode)||v.assetSignature!==ref.assetSignature||JSON.stringify(v.state.position)!==JSON.stringify(ref.state.position)||JSON.stringify(v.lastFrame.cameraPosition)!==JSON.stringify(ref.lastFrame.cameraPosition)||v.sourceHead!==ref.sourceHead||v.rendererHash!==ref.rendererHash)throw Error('DIAGNOSTIC_MATCH_MISMATCH');
  }
 }
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
  const profile=process.env.H_EARTH_COMPARISON_PROFILE||'POST_GEN2928_STAGE_PROBE_V1';
  if(!['POST_GEN2928_STAGE_PROBE_V1','SOURCE_FIRST_CALCULATED_TARGETS_V1'].includes(profile))throw Error('COMPARISON_PROFILE_NOT_REGISTERED');
  const poses=profile==='SOURCE_FIRST_CALCULATED_TARGETS_V1'?SOURCE_FIRST_TARGET_POSES:DIAGNOSTIC_POSES;
  const modes=profile==='SOURCE_FIRST_CALCULATED_TARGETS_V1'?SOURCE_FIRST_TARGET_MODES:DIAGNOSTIC_MODES;
  if(poses.length*modes.length>60)throw Error('DIAGNOSTIC_FRAME_CAP_EXCEEDED');
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,profile,poses,modes,repairOperationId:'H_EARTH_POST_GEN2928_HARD_BOUNDARY_STAGE_DIAGNOSTIC_20261027_001',baselineProductSha256:RENDERER_SHA256,diagnosticOnly:true,searchProvenance:SEARCH_PROVENANCE,stageMeanings:DIAGNOSTIC_STAGE_MEANINGS,sourceProductSha256:RENDERER_SHA256,colorTransform:'ORIGINAL_EXPOSURE_1.12_AND_GAMMA_1_OVER_2.2_EXCEPT_RAW_COVERAGE_MODE',viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,newOwnerScreenshotExactMatch:false,views:[],runs:[],errors:[]};
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
      await page.addInitScript({content:'globalThis.__hardBoundaryStageMode=0;globalThis.__groundAssetReadiness='+assetReadiness.toString()+';globalThis.__groundComparisonState='+comparisonState.toString()+';'});
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,instrumentDiagnosticRenderer]]){
        const original=fs.readFileSync(path.join(dir,pathname),'utf8'),transformed=transform(original);runRecord.instrumentation.push({path:pathname,sourceSha256:sha(original),observedSha256:sha(transformed)});
        await page.route(url=>url.pathname===pathname,route=>route.fulfill({status:200,contentType:'text/javascript',body:transformed}));
      }
      receipt.sourceProductSha256=runRecord.instrumentation.find(x=>x.path===RENDERER)?.sourceSha256;
      persist();
      await page.goto(base+ROOT+'?arrival=approved-four-trees',{waitUntil:'domcontentloaded',timeout:120000});
      await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'||!!window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.geologicalFormation?.physicalNavigationInstalled,null,{timeout:600000});
      if(await page.evaluate(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true'))throw Error('RENDERER_STARTUP_FAILED');
      await page.waitForFunction(()=>['test','ready'].includes(document.querySelector('#h-earth-loading-screen')?.dataset.mode),null,{timeout:180000});
      await page.mouse.move(270,350);await page.mouse.down();await page.mouse.move(320,350,{steps:8});await page.mouse.up();
      await page.waitForFunction(()=>!document.querySelector('[data-enter]')?.disabled);await page.click('[data-enter]');
      await page.evaluate(async()=>{const urls=performance.getEntriesByType('resource').map(x=>x.name).filter(x=>/\/navigation\.js\?/.test(x));const unique=[...new Set(urls)];if(unique.length!==1)throw Error('NAVIGATION_MODULE_IDENTITY_AMBIGUOUS:'+JSON.stringify(unique));const url=unique[0];let src=await(await fetch(url)).text();src=src.replace(/from\s*(['"])(\.[^'"]+)\1/g,(_,q,p)=>'from '+JSON.stringify(new URL(p,url).href));src+='\nexport {resolvePosition as auditResolvePosition,stateFrom as auditStateFrom};';globalThis.__groundComparisonNav=await import(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));});
      let sequence=10000,previousFrame=0;
      for(const pose of poses)for(const mode of modes){
        const hidden=mode!=='reference-lit-with-grass';await page.evaluate(value=>{globalThis.__hardBoundaryStageMode=value;},MODE_ID_BY_NAME.get(mode));
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
          return {state,expectedCameraPosition:expectedPacket.camera.position,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,resources:gpu.resources,grassHidden:hidden,diagnosticApplied:globalThis.__hardBoundaryModeApplied};
        },{pose,hidden,sequence:++sequence});
        receipt.lastAttempt={label,pose,mode,...view};persist();
        if(view.diagnosticApplied!==MODE_ID_BY_NAME.get(mode))throw Error('DIAGNOSTIC_MODE_NOT_APPLIED');
        const assets=assetReadiness(view.resources,view.lastFrame.cameraPosition);if(!assets.ready||assets.signature!==signature)throw Error('ASSETS_CHANGED_DURING_CAPTURE');view.assetSignature=assets.signature;
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+mode+'.png';const capture=await page.evaluate(()=>{const canvas=document.querySelector('#h-earth-functional-landscape-canvas');const gl=canvas?.getContext('webgl2');if(!gl||gl.isContextLost()||gl.getContextAttributes()?.preserveDrawingBuffer!==true)throw Error('CAPTURE_CONTEXT_NOT_PRESERVED');const before=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);const dataUrl=canvas.toDataURL('image/png');const after=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1);return {dataUrl,before,after};});const bytes=decodeCanvasCapture(capture,view.lastFrame);fs.writeFileSync(path.join(out,name),bytes);
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        receipt.views.push({label,pose,mode,instrumentation:runRecord.instrumentation,...view,modeId:MODE_ID_BY_NAME.get(mode),sourceHead:HEADS[label],rendererHash:receipt.sourceProductSha256,captureMethod:'PRESERVED_WEBGL_CANVAS_PNG',imageWidth:529,imageHeight:980,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    validateDiagnosticSet(receipt.views,poses,modes);
    receipt.result='DIAGNOSTIC_CAPTURE_COMPLETE_SOURCE_STAGE_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',onTerm);process.removeListener('SIGINT',onInt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});

