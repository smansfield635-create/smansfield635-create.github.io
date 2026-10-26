import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const HEADS=Object.freeze({baseline:'6caa1f644c8869349192fe274b50e79c45b894e8',candidate:'9486b1cf5d42915ee61fef58c758f4b952486f0c'});
export const POSES=Object.freeze([{name:'river-overlook',x:18,z:-226,yaw:210,pitch:-14},{name:'bare-mountain',x:88,z:-260,yaw:95,pitch:-10},{name:'coast-oblique',x:0,z:-110,yaw:170,pitch:-8},{name:'foothill-west',x:-52,z:-208,yaw:180,pitch:-12}]);
const ROOT='/showroom/globe/h-earth/';
const RENDERER=ROOT+'render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js';
const ROUTE=ROOT+'vegetation-prototype/route.js';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
export function replaceExactlyOnce(source,needle,replacement){if(source.split(needle).length!==2)throw Error('INSTRUMENTATION_ANCHOR_NOT_UNIQUE:'+needle);return source.replace(needle,replacement);}
export function instrumentRoute(source){return replaceExactlyOnce(source,'const cssWidth=','globalThis.__HEarthAuditPresent=present;\nconst cssWidth=');}
export function instrumentRenderer(source){return replaceExactlyOnce(source,'resources.singleOwnerVegetation?.draw(packet);','if(!globalThis.__groundComparisonHideGrass)resources.singleOwnerVegetation?.draw(packet);');}
export function validateFrame(value,pose,sequence){
  const {state,lastFrame,canvas}=value;
  if(!state||!lastFrame||state.sequence!==sequence||lastFrame.navigationSequence!==sequence)throw Error('FRAME_NAVIGATION_MISMATCH');
  if(!Number.isInteger(lastFrame.frameSequence)||lastFrame.frameSequence<1)throw Error('FRAME_SEQUENCE_INVALID');
  if(state.position.x!==pose.x||state.position.z!==pose.z||state.yawDegrees!==pose.yaw||state.pitchDegrees!==pose.pitch||state.verticalFovDegrees!==56)throw Error('POSE_MISMATCH');
  if(!Number.isFinite(state.position.y)||!['x','y','z'].every(k=>Math.abs(state.position[k]-lastFrame.cameraPosition[k])<1e-8))throw Error('FRAME_CAMERA_MISMATCH');
  if(canvas.width!==529||canvas.height!==980||canvas.cssWidth!==540||canvas.cssHeight!==1000)throw Error('RESOLUTION_MISMATCH');
  return true;
}
export function assertCheckout(dir,expected){const head=execFileSync('git',['-C',dir,'rev-parse','HEAD'],{encoding:'utf8'}).trim();if(head!==expected)throw Error('CHECKOUT_HEAD_MISMATCH');if(execFileSync('git',['-C',dir,'status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim())throw Error('CHECKOUT_TRACKED_BYTES_CHANGED');}
export function parseArgs(argv){const a={};for(let i=0;i<argv.length;i+=2){if(!['--baseline-dir','--candidate-dir','--output'].includes(argv[i])||!argv[i+1]||a[argv[i]])throw Error('CLI_NOT_CLOSED');a[argv[i]]=path.resolve(argv[i+1]);}if(Object.keys(a).length!==3)throw Error('CLI_INCOMPLETE');if(new Set(Object.values(a)).size!==3)throw Error('DIRECTORIES_NOT_DISTINCT');return a;}
export async function run(argv){
  const a=parseArgs(argv),out=a['--output'];fs.mkdirSync(out,{recursive:true});
  const receipt={schema:'H_EARTH_GROUND_MATERIAL_FIXED_COMPARISON_v1',result:'INCOMPLETE',heads:HEADS,poses:POSES,viewport:{cssWidth:540,cssHeight:1000,backingWidth:529,backingHeight:980,fov:56},evidenceScope:'READ_ONLY_DIAGNOSTIC_FIXED_VIEWS_SOFTWARE_GPU',physicalAndroidPerformanceProven:false,ownerVisualAcceptance:false,releaseAuthorized:false,productDiskMutation:false,views:[],runs:[],errors:[]};
  const persist=()=>{fs.writeFileSync(out+'/receipt.tmp',JSON.stringify(receipt,null,2)+'\n');fs.renameSync(out+'/receipt.tmp',out+'/receipt.json');};
  let browser=null,server=null;
  const interrupt=signal=>{receipt.result='INTERRUPTED';receipt.errors.push(signal);persist();server?.kill();process.exit(signal==='SIGTERM'?143:130);};
  process.once('SIGTERM',interrupt);process.once('SIGINT',interrupt);persist();
  try{
    for(const label of Object.keys(HEADS))assertCheckout(a['--'+label+'-dir'],HEADS[label]);
    const {chromium}=await import('playwright');
    browser=await chromium.launch({headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-dev-shm-usage']});
    for(const [index,label] of Object.keys(HEADS).entries()){
      const dir=a['--'+label+'-dir'],port=18767+index,base='http://127.0.0.1:'+port;
      const runRecord={label,head:HEADS[label],errors:[],instrumentation:[],startedAt:new Date().toISOString()};receipt.runs.push(runRecord);persist();
      server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1','--directory',dir],{stdio:['ignore','ignore','ignore']});
      const serverError=[];server.on('error',e=>serverError.push(e.message));
      let listening=false;for(let n=0;n<50;n++){try{const r=await fetch(base+ROOT);if(r.ok){listening=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!listening)throw Error('SERVER_UNAVAILABLE:'+serverError.join(';'));
      const context=await browser.newContext({viewport:{width:540,height:1000},deviceScaleFactor:1});const page=await context.newPage();page.setDefaultTimeout(30000);
      const errors=runRecord.errors;page.on('pageerror',e=>errors.push('PAGE:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('CONSOLE:'+m.text());});page.on('response',r=>{if(r.status()>=400)errors.push('HTTP:'+r.status()+':'+r.url());});page.on('requestfailed',r=>errors.push('REQUEST:'+r.url()+':'+r.failure()?.errorText));
      for(const [pathname,transform] of [[ROUTE,instrumentRoute],[RENDERER,instrumentRenderer]]){
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
      for(const pose of POSES)for(const hidden of [false,true]){
        const view=await page.evaluate(async({pose,hidden,sequence})=>{
          globalThis.__groundComparisonHideGrass=hidden;const nav=globalThis.__groundComparisonNav,r=nav.auditResolvePosition(pose.x,pose.z,pose.yaw,'SURFACE');if(!r.eligible)throw Error('POSE_INELIGIBLE');
          const state=nav.auditStateFrom(r,{yaw:pose.yaw,pitch:pose.pitch,fov:56,sequence,action:'READ_ONLY_GROUND_COMPARISON'});
          globalThis.__HEarthAuditPresent(state);await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
          const costs=[];for(let i=0;i<12;i++){const t=performance.now();globalThis.__HEarthAuditPresent(state);costs.push(performance.now()-t);await new Promise(requestAnimationFrame);}
          const gpu=H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt(),canvas=document.querySelector('#h-earth-functional-landscape-canvas');
          return {state,lastFrame:gpu.frameRecords.at(-1),canvas:{width:canvas.width,height:canvas.height,cssWidth:canvas.clientWidth,cssHeight:canvas.clientHeight},cpuSubmitMilliseconds:costs,resources:gpu.resources,grassHidden:hidden};
        },{pose,hidden,sequence:++sequence});
        validateFrame(view,pose,sequence);if(view.lastFrame.frameSequence<=previousFrame)throw Error('FRAME_DID_NOT_ADVANCE');previousFrame=view.lastFrame.frameSequence;
        const name=label+'-'+pose.name+'-'+(hidden?'grass-hidden':'normal')+'.png';const bytes=await page.locator('#h-earth-functional-landscape-canvas').screenshot({path:path.join(out,name),timeout:30000});if(bytes.length<1024)throw Error('EMPTY_CAPTURE');
        const after=await page.evaluate(()=>H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().frameRecords.at(-1));if(after.navigationSequence!==sequence||after.frameSequence!==view.lastFrame.frameSequence)throw Error('CAPTURE_FRAME_CHANGED');
        receipt.views.push({label,pose,mode:hidden?'grass-hidden':'normal',...view,image:name,imageSha256:sha(bytes),imageBytes:bytes.length});persist();
      }
      runRecord.transfers=await page.evaluate(()=>performance.getEntriesByType('resource').map(x=>({name:x.name,transferSize:x.transferSize,duration:x.duration})));runRecord.completedAt=new Date().toISOString();persist();
      await context.close();server.kill();server=null;assertCheckout(dir,HEADS[label]);if(errors.length)throw Error('BROWSER_ERRORS:'+label);
    }
    if(receipt.views.length!==16)throw Error('COMPARISON_INCOMPLETE');
    for(const pose of POSES)for(const mode of ['normal','grass-hidden']){const pair=receipt.views.filter(v=>v.pose.name===pose.name&&v.mode===mode);if(pair.length!==2||JSON.stringify(pair[0].state.position)!==JSON.stringify(pair[1].state.position))throw Error('MATCHED_CAMERA_MISMATCH');}
    receipt.result='CAPTURE_COMPLETE_OWNER_VISUAL_REVIEW_PENDING';
  }catch(e){receipt.result='INCOMPLETE_OR_FAILED';receipt.errors.push(String(e?.stack??e));throw e;}
  finally{persist();server?.kill();if(browser)await browser.close();process.removeListener('SIGTERM',interrupt);process.removeListener('SIGINT',interrupt);}
  return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))run(process.argv.slice(2)).catch(e=>{console.error(e);process.exitCode=1;});
