import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import os from 'node:os';
import {createRequire} from 'node:module';

const HEAD='d4dffa1a80fe9f01a9e4ea65b758592d80678f37';
const files={
 'showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js':'0e103e4f6834cb5318a37d669c34ba9930ada134',
 'tools/h-earth-loading-report.test.mjs':'0fde33cd50265fe403a3e822a21c9d0b209baa0a',
 'showroom/globe/h-earth/vegetation-prototype/route.js':'bddf7dcf22c33ba4fa04928016016c37a78e031f',
 'showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js':'3471d386d720382b1b55b146fef6fa0af61f0d36',
 'showroom/globe/h-earth/render/vegetation-single-owner.prototype.v1.js':'7cb62866153d4ceb57b2a2177359bd56a4220d85'
};
const OPERATION='H_EARTH_GEN3262_FULL_ROUTE_FIXED_QUALIFIER_REGISTRATION_20261113_001';
const RECEIPT_SCHEMA='H_EARTH_GEN3262_FULL_ROUTE_QUALIFICATION_RECEIPT_v1';
const FROZEN_MAP='h-earth-3d/evidence/ecological-meadow-coverage-v1/frozen-map.v1.json.gz';
const WORLD='showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz';
const MAP_SHA='a6f408b7375bec5726b9b3931351ddb226f2bbd2606f27fe85f128816bd7e015';
const WORLD_SHA='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a';
const ROOT_COUNT=3805291,ROOT_BYTES=60884656;
const protectedBlobs={
 'showroom/globe/h-earth/render/geometry-landscape-sector.p2.js':'edd3c2047d3d062eb8d60325410af8ae8f3a6fa5',
 'showroom/globe/h-earth/vegetation-prototype/bootstrap.v1.js':'59c77d100d793f9dd28e9db7bd357ef078de0165',
 'showroom/globe/h-earth/index.html':'330cc53cb02943499df8010ae4146696da2bbb06',
 [FROZEN_MAP]:'9139e9c429957679c6e30001ea0e0fb95fbc45fc'
};
function parseArgs(argv){
 if(argv.length!==8)throw Error('FIXED_ARGUMENT_COUNT_REQUIRED');
 const o={};
 for(let i=0;i<argv.length;i+=2){const k=argv[i];if(!['--candidate-head','--execution-holder','--output','--manifest-output'].includes(k)||!argv[i+1]||Object.hasOwn(o,k))throw Error('UNREGISTERED_ARGUMENT:'+k);o[k]=argv[i+1];}
 if(o['--candidate-head']!==HEAD)throw Error('EXACT_CANDIDATE_HEAD_MISMATCH');
 if(!/^[A-Z0-9][A-Z0-9_.:-]{2,127}$/.test(o['--execution-holder']))throw Error('HOLDER_INVALID');
 if(!path.isAbsolute(o['--output'])||!path.isAbsolute(o['--manifest-output'])||o['--output']===o['--manifest-output'])throw Error('OUTPUT_PATH_NOT_EXACT');
 return o;
}
const opts=parseArgs(process.argv.slice(2));
const home=fs.mkdtempSync(path.join(os.tmpdir(),'gen3262-fixed-'));
const root=path.join(home,'candidate'),output=path.join(home,'screenshots');
fs.mkdirSync(root,{recursive:true});fs.mkdirSync(output,{recursive:true});
const g=(...a)=>execFileSync('git',a,{cwd:root,encoding:'utf8',timeout:360000}).trim();
function run(exe,args,cwd,timeout=480000){
 const r=spawnSync(exe,args,{cwd,encoding:'utf8',timeout,maxBuffer:16*1024*1024,env:process.env});
 if(r.status!==0||r.error)throw Error('FIXED_EXECUTION_FAILED:'+exe+':'+(r.error?.message||r.stderr||r.stdout||'').slice(-1600));
 return r.stdout;
}
function materialize(){
 g('init','--quiet','.');g('remote','add','origin','https://github.com/smansfield635-create/smansfield635-create.github.io.git');
 g('config','core.sparseCheckout','true');
 fs.writeFileSync(path.join(root,'.git/info/sparse-checkout'),'/showroom/globe/h-earth/\n/h-earth-3d/\n/tools/h-earth-loading-report.test.mjs\n');
 g('fetch','--no-tags','--depth=16','--filter=blob:none','origin',HEAD);g('checkout','--detach','FETCH_HEAD');
 if(g('rev-parse','HEAD')!==HEAD)throw Error('HEAD_NOT_EXACT');
 g('fetch','--no-tags','--depth=16','--filter=blob:none','origin','961b9741355b2e3f5f746ff3dd0c239025139796');
 const actual=g('diff','--name-only','961b9741355b2e3f5f746ff3dd0c239025139796',HEAD).split(/\r?\n/).filter(Boolean).sort();
 const expected=['showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js','tools/h-earth-loading-report.test.mjs'].sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('UNAUTHORIZED_PRODUCT_PATH_DRIFT:'+JSON.stringify(actual));
 return actual;
}
function installChromium(){
 const dep=path.join(home,'browser-deps');fs.mkdirSync(dep,{recursive:true});
 run('npm',['install','--prefix',dep,'--no-save','--no-package-lock','--no-audit','playwright@1.55.0'],home);
 const cli=path.join(dep,'node_modules/playwright/cli.js');
 if(!fs.existsSync(cli))throw Error('FIXED_PLAYWRIGHT_CLI_MISSING');
 run(process.execPath,[cli,'install','--with-deps','chromium'],dep);
 return createRequire(path.join(dep,'package.json'))('playwright');
}
const check=(v,e)=>{if(!v)throw Error(e)};
const blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const receipt={schema:RECEIPT_SCHEMA,operationId:OPERATION,executionHolder:opts['--execution-holder'],head:HEAD,origin:'REGISTERED_FIXED_TOOLING',caseResults:[],physicalAndroid:false,ownerAccepted:false,anchorAccepted:false,sourceMutationPerformed:false,productMutationPerformed:false,workflowMutationPerformed:false,branchCreated:false,mergePerformed:false,deploymentPerformed:false,releasePerformed:false,publicationPerformed:false,status:'INCOMPLETE'};
let server,browser;
await fsp.mkdir(output,{recursive:true});
try {
 receipt.changedPaths=materialize();
 check(g('rev-parse','HEAD')===HEAD,'EXACT_HEAD_MISMATCH');
 check(!g('status','--porcelain','--untracked-files=no'),'TRACKED_CHECKOUT_DIRTY');
 for(const [name,sha] of Object.entries(files))check(g('hash-object',name)===sha,'SOURCE_BLOB_DRIFT:'+name);
 for(const [p,blobId] of Object.entries(protectedBlobs)){
  check(g('hash-object',p)===blobId,'PROTECTED_BLOB_MISMATCH:'+p);
 }
 const digest=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
 check(digest(FROZEN_MAP)===MAP_SHA,'FROZEN_MEADOW_MAP_DRIFT');
 check(digest(WORLD)===WORLD_SHA,'CANONICAL_WORLD_DRIFT');
 receipt.protectedWorld={frozenMapSha256:MAP_SHA,baseWorldSha256:WORLD_SHA,acceptedGrassRoots:ROOT_COUNT,packedRootGpuBytes:ROOT_BYTES};
 const nodeResult=spawnSync(process.execPath,['--test','tools/h-earth-loading-report.test.mjs'],{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024});
 receipt.nativeNode={version:process.version,actualNodeExecution:true,exitCode:nodeResult.status,stdoutSha256:crypto.createHash('sha256').update(nodeResult.stdout||'').digest('hex'),tap:(nodeResult.stdout||'').slice(-16000)};
 check(nodeResult.status===0&&/^# pass 11$/m.test(nodeResult.stdout||'')&&/^# fail 0$/m.test(nodeResult.stdout||''),'NATIVE_NODE_SUITE_FAILED');
 const {chromium}=installChromium();
 const mime={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.gz':'application/gzip','.bin':'application/octet-stream'};
 server=http.createServer(async(req,res)=>{try{let p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname));check(p===root||p.startsWith(root+path.sep),'PATH_OUTSIDE_ROOT');if((await fsp.stat(p)).isDirectory())p=path.join(p,'index.html');res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(await fsp.readFile(p));}catch(e){res.writeHead(404);res.end(String(e.message||e));}});
 await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-dev-shm-usage']});
 receipt.browserVersion=browser.version();
 for(const cfg of [{id:'desktop-public',mobile:false,inspect:false,w:1280,h:800},{id:'desktop-inspect',mobile:false,inspect:true,w:1280,h:800},{id:'mobile-public',mobile:true,inspect:false,w:390,h:844},{id:'mobile-inspect',mobile:true,inspect:true,w:390,h:844}]) {
   const caseResult={id:cfg.id,pass:false,loaderHash:null,reason:null,images:[],pageErrors:[],httpErrors:[]};receipt.caseResults.push(caseResult);
   const context=await browser.newContext({viewport:{width:cfg.w,height:cfg.h},isMobile:cfg.mobile,hasTouch:cfg.mobile,permissions:['clipboard-read','clipboard-write'],deviceScaleFactor:1,reducedMotion:'reduce'});
   const page=await context.newPage();page.setDefaultTimeout(30000);
   const transfers=[];
   page.on('pageerror',e=>caseResult.pageErrors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)caseResult.httpErrors.push({url:r.url(),status:r.status()});if(new URL(r.url()).pathname.endsWith('/vegetation-prototype/loading-screen.v1.js'))transfers.push(r.body().then(b=>{caseResult.loaderHash=blob(b)}));});
   try {
     const url=`http://127.0.0.1:${server.address().port}/showroom/globe/h-earth/${cfg.inspect?'?inspect=1':''}`;
     const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});check(response.status()===200,'HTTP_ROUTE_FAIL');
     const copy=page.locator('[data-copy-loading-report]');await copy.waitFor({state:'visible',timeout:90000});
     let b=await copy.boundingBox();check(b?.height>=44,'COPY_BUTTON_TAP_HEIGHT_PRE');await copy.click();
     await page.waitForFunction(()=>document.querySelector('[data-loading-report-status]')?.textContent?.includes('Report copied'));
     caseResult.initialCopyStatus=await page.locator('[data-loading-report-status]').textContent();
     const initialReport=await page.evaluate(async()=>JSON.parse(await navigator.clipboard.readText()));
     check(initialReport.schema==='GRATITUDE_LOADING_REPORT_v1','PRE_ENTER_CLIPBOARD_INVALID');
     await page.screenshot({path:path.join(output,cfg.id+'-loading.png')});caseResult.images.push(cfg.id+'-loading.png');
     await page.waitForFunction(()=>{const mode=document.querySelector('#h-earth-loading-screen')?.dataset.mode;const failed=document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eError==='true';return failed||['test','ready'].includes(mode)},{},{timeout:600000});
     check(await page.locator('#h-earth-functional-landscape-route').getAttribute('data-run8e-error')!=='true','WORLD_STARTUP_FAILURE');
     const canvas=page.locator('#h-earth-functional-landscape-canvas');await canvas.waitFor({state:'visible',timeout:120000});
     b=await canvas.boundingBox();check(b?.width>100&&b?.height>100,'WORLD_CANVAS_NOT_READY');
     const x=b.x+b.width/2,y=b.y+b.height/2;
     if(cfg.mobile){const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});const t=(xx,yy)=>[{x:xx,y:yy,id:1,radiusX:4,radiusY:4,force:1}];await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:t(x-50,y)});for(let step=1;step<=10;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:t(x-50+step*12,y)});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
     else{await page.mouse.move(x-60,y);await page.mouse.down();await page.mouse.move(x+80,y+25,{steps:12});await page.mouse.up();}
     await page.waitForFunction(()=>document.querySelector('[data-enter]')?.disabled===false,null,{timeout:180000});
     const pre=await page.evaluate(()=>window.H_EARTH_STARTUP_LOADER?.getReceipt?.());check(pre?.firstInputPoseRenderedMilliseconds!=null,'NO_REAL_CAMERA_PRESENT');
     await page.locator('[data-enter]').click();
     await page.waitForFunction(()=>document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true'&&window.H_EARTH_STARTUP_LOADER?.getReceipt?.().mode==='entered',null,{timeout:180000});
     check(await copy.isVisible(),'COPY_HIDDEN_AFTER_ENTER');b=await copy.boundingBox();check(b?.height>=44,'COPY_BUTTON_TAP_HEIGHT_POST');
     const inspector=await page.locator('[data-h-earth-spatial-selection]').count();check(inspector===(cfg.inspect?1:0),'INSPECTOR_GATE_BROKEN');
     const gpu=await page.evaluate(()=>{const c=document.getElementById('h-earth-functional-landscape-canvas'),gl=c?.getContext('webgl2'),r=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.();return {webgl2:!!gl&&!gl.isContextLost(),error:gl?.getError(),frames:r?.frameRecords?.length??0}});
     caseResult.gpu=gpu;check(gpu.webgl2&&gpu.error===0&&gpu.frames>0,'WEBGL2_FRAME_NOT_VERIFIED');
     await page.waitForFunction(n=>window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.()?.resources?.singleOwnerVegetation?.installedRootCount===n,
       ROOT_COUNT,{timeout:600000});
     const grass=await page.evaluate(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().resources.singleOwnerVegetation);
     check(grass.installedRootCount===ROOT_COUNT&&grass.gpuAllocatedBytes===ROOT_BYTES&&grass.gpuUploadedBytes===ROOT_BYTES&&grass.gpuAllocationVerified===true,'GRASS_GPU_OR_ROOT_DRIFT');
     check(grass.frozenEcologicalMeadow?.pointwiseShortfallRoots===0,'FROZEN_MEADOW_SHORTFALL');
     caseResult.grassGpu={installedRootCount:grass.installedRootCount,gpuAllocatedBytes:grass.gpuAllocatedBytes,gpuUploadedBytes:grass.gpuUploadedBytes,pointwiseShortfallRoots:0};
     await copy.click();const post=await page.evaluate(async()=>JSON.parse(await navigator.clipboard.readText()));check(post.schema==='GRATITUDE_LOADING_REPORT_v1'&&post.mode==='entered','POST_ENTER_COPY_INVALID');
     await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('denied'))}}));await copy.click();
     const fallback=page.locator('[data-loading-report-text]');await fallback.waitFor({state:'visible'});const fb=JSON.parse(await fallback.inputValue());check(fb.mode==='entered','COPY_FALLBACK_INVALID');
     await page.screenshot({path:path.join(output,cfg.id+'-entered.png')});caseResult.images.push(cfg.id+'-entered.png');
     await Promise.all(transfers);check(caseResult.loaderHash===files['showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js'],'SERVED_LOADER_BLOB_MISMATCH');
     check(caseResult.pageErrors.length===0&&caseResult.httpErrors.length===0,'BROWSER_ERROR_OR_MISSING_ASSET');
     caseResult.pass=true;
   }catch(e){caseResult.reason=String(e.stack||e);try{await page.screenshot({path:path.join(output,cfg.id+'-fail.png')});caseResult.images.push(cfg.id+'-fail.png')}catch{}}
   finally{await context.close();await fsp.writeFile(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');}
 }
 receipt.status=receipt.caseResults.length===4&&receipt.caseResults.every(x=>x.pass)?'PASS_CLOSED':'FAIL_CLOSED';
}catch(e){receipt.status='FAIL_CLOSED';receipt.errorCode='FIXED_QUALIFIER_EXECUTION_FAILURE';receipt.error=String(e.stack||e)}
finally{
 if(browser)await browser.close().catch(()=>{});
 if(server)await new Promise(r=>server.close(r));
 const manifest={schema:'H_EARTH_GEN3262_SCREENSHOT_MANIFEST_v1',candidateHead:HEAD,physicalAndroidTested:false,ownerAcceptance:false,screenshots:[]};
 for(const c of receipt.caseResults){
  for(const name of c.images){
   const filename=path.join(output,name);if(!fs.existsSync(filename))continue;
   const bytes=fs.readFileSync(filename);
   manifest.screenshots.push({caseId:c.id,name,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,encoding:'base64',image:bytes.toString('base64')});
  }
 }
 receipt.screenshotCount=manifest.screenshots.length;
 if(receipt.status==='PASS_CLOSED'&&manifest.screenshots.length!==8){receipt.status='FAIL_CLOSED';receipt.errorCode='SCREENSHOT_OR_RECEIPT_MISSING';}
 try{receipt.cleanAfter=g('status','--porcelain','--untracked-files=no')==='';}catch{receipt.cleanAfter=false;}
 if(!receipt.cleanAfter){receipt.status='FAIL_CLOSED';receipt.errorCode=receipt.errorCode||'SOURCE_CLEANLINESS_UNVERIFIED';}
 fs.mkdirSync(path.dirname(opts['--output']),{recursive:true});fs.mkdirSync(path.dirname(opts['--manifest-output']),{recursive:true});
 fs.writeFileSync(opts['--output'],JSON.stringify(receipt,null,2)+'\n');
 fs.writeFileSync(opts['--manifest-output'],JSON.stringify(manifest)+'\n');
 fs.rmSync(home,{recursive:true,force:true});
}
console.log(JSON.stringify({status:receipt.status,cases:receipt.caseResults.map(x=>({id:x.id,pass:x.pass,reason:x.reason})),artifact:'COMMAND_PAYLOAD_RECEIPT_PATH'},null,2));if(receipt.status!=='PASS_CLOSED')process.exitCode=1;