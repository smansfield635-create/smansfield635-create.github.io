#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PLAYWRIGHT_VERSION = '1.55.0';
const ALLOWED_DEVICES = Object.freeze({
  DESKTOP_1440: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  S26_ULTRA: { viewport: { width: 412, height: 915 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  TAB_A9: { viewport: { width: 800, height: 1280 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
});
const ASSERTION_TYPES = new Set(['PAGE_LOAD_OK','NO_CONSOLE_ERRORS','NO_PAGE_ERRORS','SELECTOR_VISIBLE','SELECTOR_EXISTS','GLOBAL_PATH_EQUALS','GLOBAL_PATH_TRUTHY','SCREENSHOT_NONEMPTY']);
const INTERACTION_TYPES = new Set(['POINTER_DRAG','WHEEL','TOUCH_DRAG','PINCH']);

const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])])) : value;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function fail(code, detail=null){const e=new Error(detail==null?code:`${code}:${typeof detail==='string'?detail:JSON.stringify(detail)}`);e.code=code;e.detail=detail;throw e;}
function object(v,c){if(!v||typeof v!=='object'||Array.isArray(v))fail(c);return v;}
function closed(v,keys,prefix){object(v,`${prefix}_OBJECT_REQUIRED`);const a=Object.keys(v).sort(),b=[...keys].sort();if(JSON.stringify(a)!==JSON.stringify(b))fail(`${prefix}_KEYSET_INVALID`,{expected:b,observed:a});}
function commit(v,c){if(!/^[0-9a-f]{40}$/.test(v??''))fail(c,String(v));return v;}
function parseArgs(argv){const out={};for(let i=0;i<argv.length;i+=2){const k=argv[i],v=argv[i+1];if(!['--contract','--output','--self-test'].includes(k)||v===undefined)fail('CLI_ARGUMENTS_INVALID',k);out[k.slice(2)]=v;}return out;}
function validateContract(raw){
  const keys=['schema','candidateHead','route','devices','assertions','interactions','screenshot'];
  closed(raw,keys,'BROWSER_CONTRACT');
  if(raw.schema!=='CANONICAL_OPERATION_BROWSER_VERIFICATION_CONTRACT_v1')fail('BROWSER_CONTRACT_SCHEMA_MISMATCH');
  commit(raw.candidateHead,'BROWSER_CONTRACT_CANDIDATE_INVALID');
  if(typeof raw.route!=='string'||!raw.route.startsWith('/')||raw.route.includes('://')||raw.route.includes('..')||raw.route.length>300)fail('BROWSER_ROUTE_INVALID');
  if(!Array.isArray(raw.devices)||raw.devices.length<1||raw.devices.length>3||new Set(raw.devices).size!==raw.devices.length||raw.devices.some(x=>!Object.hasOwn(ALLOWED_DEVICES,x)))fail('BROWSER_DEVICE_MATRIX_INVALID');
  if(!Array.isArray(raw.assertions)||raw.assertions.length<1||raw.assertions.length>64)fail('BROWSER_ASSERTIONS_INVALID');
  for(const a of raw.assertions){
    object(a,'BROWSER_ASSERTION_INVALID');
    if(!ASSERTION_TYPES.has(a.type))fail('BROWSER_ASSERTION_TYPE_INVALID',a.type);
    if(['SELECTOR_VISIBLE','SELECTOR_EXISTS'].includes(a.type)&&(typeof a.selector!=='string'||!a.selector||a.selector.length>256))fail('BROWSER_SELECTOR_INVALID');
    if(['GLOBAL_PATH_EQUALS','GLOBAL_PATH_TRUTHY'].includes(a.type)&&(typeof a.path!=='string'||!/^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(a.path)))fail('BROWSER_GLOBAL_PATH_INVALID');
    if(a.type==='GLOBAL_PATH_EQUALS'&&!['string','number','boolean'].includes(typeof a.expected)&&a.expected!==null)fail('BROWSER_EXPECTED_VALUE_INVALID');
  }
  if(!Array.isArray(raw.interactions)||raw.interactions.length>16)fail('BROWSER_INTERACTIONS_INVALID');
  for(const x of raw.interactions){
    object(x,'BROWSER_INTERACTION_INVALID');
    if(!INTERACTION_TYPES.has(x.type))fail('BROWSER_INTERACTION_TYPE_INVALID',x.type);
    if(x.selector!=null&&(typeof x.selector!=='string'||!x.selector||x.selector.length>256))fail('BROWSER_SELECTOR_INVALID');
  }
  object(raw.screenshot,'BROWSER_SCREENSHOT_INVALID');
  if(raw.screenshot.fullPage!==true||raw.screenshot.format!=='jpeg'||!Number.isInteger(raw.screenshot.quality)||raw.screenshot.quality<35||raw.screenshot.quality>90)fail('BROWSER_SCREENSHOT_INVALID');
  return stable(raw);
}
function gitHead(root){return cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{cwd:root,encoding:'utf8'}).trim();}
function dependencyRoot(){
  const base=path.join(os.tmpdir(),`diamond-gate-playwright-${PLAYWRIGHT_VERSION}`);
  fs.mkdirSync(base,{recursive:true});
  return base;
}
function ensurePlaywright(){
  const root=dependencyRoot(), pkg=path.join(root,'node_modules','playwright','package.json');
  let valid=false;
  if(fs.existsSync(pkg)){try{valid=JSON.parse(fs.readFileSync(pkg,'utf8')).version===PLAYWRIGHT_VERSION;}catch{}}
  if(!valid){
    cp.execFileSync('npm',['install','--prefix',root,'--no-save',`playwright@${PLAYWRIGHT_VERSION}`],{stdio:'inherit',env:{...process.env,npm_config_fund:'false',npm_config_audit:'false'}});
  }
  const cli=path.join(root,'node_modules','playwright','cli.js');
  cp.execFileSync(process.execPath,[cli,'install','--with-deps','chromium'],{stdio:'inherit',env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:path.join(root,'browsers')}});
  process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(root,'browsers');
  return { root, modulePath:path.join(root,'node_modules','playwright','index.mjs'), browserPath:path.join(root,'browsers') };
}
function mime(file){
  const ext=path.extname(file).toLowerCase();
  return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.wasm':'application/wasm'})[ext]??'application/octet-stream';
}
async function startServer(root){
  const server=http.createServer((req,res)=>{
    try{
      const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
      let rel=pathname.replace(/^\/+/, '');
      if(rel===''||rel.endsWith('/'))rel+= 'index.html';
      const file=path.resolve(root,rel);
      if(!(file===root||file.startsWith(root+path.sep)))throw new Error('PATH_ESCAPE');
      if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('not found');return;}
      res.writeHead(200,{'content-type':mime(file),'cache-control':'no-store'});
      fs.createReadStream(file).pipe(res);
    }catch{res.writeHead(400);res.end('bad request');}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {server,port:server.address().port};
}
function boundedNumber(v,min,max,def){return typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max?v:def;}
async function targetPoint(page,selector,xf=.5,yf=.5){
  const sel=selector||'canvas';const loc=page.locator(sel).first();const box=await loc.boundingBox();if(!box)fail('INTERACTION_TARGET_NOT_VISIBLE',sel);
  return {x:box.x+box.width*boundedNumber(xf,0,1,.5),y:box.y+box.height*boundedNumber(yf,0,1,.5),box};
}
async function performInteraction(page,context,x){
  if(x.type==='POINTER_DRAG'){
    const a=await targetPoint(page,x.selector,x.startX,x.startY),b=await targetPoint(page,x.selector,x.endX,x.endY);
    await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();
  }else if(x.type==='WHEEL'){
    await page.mouse.wheel(0,boundedNumber(x.deltaY,-2000,2000,-420));
  }else{
    const a=await targetPoint(page,x.selector,.45,.52), session=await context.newCDPSession(page);
    if(x.type==='TOUCH_DRAG'){
      const b=await targetPoint(page,x.selector,.62,.42);
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x,y:a.y}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:b.x,y:b.y}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }else if(x.type==='PINCH'){
      const c=a.box, cx=c.x+c.width*.5, cy=c.y+c.height*.5, r=Math.min(c.width,c.height)*.1, r2=r*1.8;
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx-r,y:cy},{x:cx+r,y:cy}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx-r2,y:cy},{x:cx+r2,y:cy}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }
  }
  await page.waitForTimeout(180);
}
async function globalValue(page,dotPath){return page.evaluate(p=>{let v=window;for(const k of p.split('.'))v=v?.[k];return v;},dotPath);}
async function assertion(page,state,a,screenshotBytes){
  try{
    if(a.type==='PAGE_LOAD_OK')return {type:a.type,result:state.loadOk?'PASS':'FAIL',observed:state.status};
    if(a.type==='NO_CONSOLE_ERRORS')return {type:a.type,result:state.consoleErrors.length===0?'PASS':'FAIL',observed:state.consoleErrors};
    if(a.type==='NO_PAGE_ERRORS')return {type:a.type,result:state.pageErrors.length===0?'PASS':'FAIL',observed:state.pageErrors};
    if(a.type==='SELECTOR_VISIBLE'){const ok=await page.locator(a.selector).first().isVisible();return {type:a.type,selector:a.selector,result:ok?'PASS':'FAIL',observed:ok};}
    if(a.type==='SELECTOR_EXISTS'){const n=await page.locator(a.selector).count();return {type:a.type,selector:a.selector,result:n>0?'PASS':'FAIL',observed:n};}
    if(a.type==='GLOBAL_PATH_TRUTHY'){const v=await globalValue(page,a.path);return {type:a.type,path:a.path,result:v?'PASS':'FAIL',observed:v??null};}
    if(a.type==='GLOBAL_PATH_EQUALS'){const v=await globalValue(page,a.path),ok=Object.is(v,a.expected);return {type:a.type,path:a.path,result:ok?'PASS':'FAIL',expected:a.expected,observed:v??null};}
    if(a.type==='SCREENSHOT_NONEMPTY')return {type:a.type,result:screenshotBytes.length>100?'PASS':'FAIL',observedBytes:screenshotBytes.length};
  }catch(e){return {type:a.type,result:'FAIL',error:e.message};}
  return {type:a.type,result:'FAIL',error:'UNSUPPORTED'};
}
export async function executeBrowserContract(raw,{root=process.cwd()}={}){
  const contract=validateContract(raw), actual=gitHead(root);
  if(actual!==contract.candidateHead)fail('EXACT_CANDIDATE_HEAD_MISMATCH',{expected:contract.candidateHead,observed:actual});
  const dep=ensurePlaywright();
  const { chromium }=await import(pathToFileURL(dep.modulePath).href);
  const {server,port}=await startServer(root), browser=await chromium.launch({headless:true,env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:dep.browserPath}});
  const deviceReceipts=[];
  try{
    for(const deviceId of contract.devices){
      const context=await browser.newContext(ALLOWED_DEVICES[deviceId]);
      const page=await context.newPage(),consoleErrors=[],pageErrors=[];
      page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
      page.on('pageerror',e=>pageErrors.push(e.message));
      let response=null;
      try{response=await page.goto(`http://127.0.0.1:${port}${contract.route}`,{waitUntil:'networkidle',timeout:45000});}catch{}
      const state={status:response?.status()??null,loadOk:!!response&&response.status()<400,consoleErrors,pageErrors};
      for(const x of contract.interactions)await performInteraction(page,context,x);
      const shot=await page.screenshot({type:'jpeg',quality:contract.screenshot.quality,fullPage:true});
      const checks=[];
      for(const a of contract.assertions)checks.push(await assertion(page,state,a,shot));
      deviceReceipts.push(stable({deviceId,viewport:ALLOWED_DEVICES[deviceId].viewport,result:checks.every(c=>c.result==='PASS')?'PASS':'FAIL',assertions:checks,consoleErrors,pageErrors,screenshot:{format:'jpeg',sha256:sha256(shot),byteLength:shot.length,base64:shot.toString('base64')}}));
      await context.close();
    }
  }finally{await browser.close();await new Promise(r=>server.close(r));}
  const result=deviceReceipts.every(x=>x.result==='PASS')?'PASS':'FAIL';
  return stable({schema:'CANONICAL_BROWSER_VERIFICATION_RECEIPT_v1',result,candidateHead:contract.candidateHead,route:contract.route,deviceCount:deviceReceipts.length,devices:deviceReceipts,playwrightVersion:PLAYWRIGHT_VERSION,browser:'chromium',localhostOnly:true,arbitraryUrlAccepted:false,callerScriptAccepted:false,environmentOverrideAccepted:false,repositoryWritesPerformed:false,productAuthorityCreated:false,semanticAuthorityCreated:false});
}
export function runContractSelfTest(){
  const base={schema:'CANONICAL_OPERATION_BROWSER_VERIFICATION_CONTRACT_v1',candidateHead:'a'.repeat(40),route:'/index.html',devices:['DESKTOP_1440'],assertions:[{type:'PAGE_LOAD_OK'},{type:'SCREENSHOT_NONEMPTY'}],interactions:[],screenshot:{fullPage:true,format:'jpeg',quality:50}};
  const results=[];
  const ok=(name,fn)=>{try{fn();results.push({name,result:'PASS'});}catch(e){results.push({name,result:'FAIL',detail:e.code??e.message});}};
  const bad=(name,code,fn)=>{try{fn();results.push({name,result:'FAIL',detail:'UNEXPECTED_PASS'});}catch(e){results.push({name,result:(e.code??e.message)===code?'PASS':'FAIL',detail:e.code??e.message});}};
  ok('VALID_CONTRACT',()=>validateContract(base));
  bad('REMOTE_URL_REJECTED','BROWSER_ROUTE_INVALID',()=>validateContract({...base,route:'https://example.com'}));
  bad('UNKNOWN_DEVICE_REJECTED','BROWSER_DEVICE_MATRIX_INVALID',()=>validateContract({...base,devices:['EVIL']}));
  bad('UNKNOWN_ASSERTION_REJECTED','BROWSER_ASSERTION_TYPE_INVALID',()=>validateContract({...base,assertions:[{type:'EVAL'}]}));
  bad('SCREENSHOT_POLICY_CLOSED','BROWSER_SCREENSHOT_INVALID',()=>validateContract({...base,screenshot:{fullPage:false,format:'png',quality:100}}));
  return stable({schema:'CANONICAL_BROWSER_VERIFICATION_RUNNER_SELF_TEST_v1',result:results.every(x=>x.result==='PASS')?'PASS':'FAIL',testCount:results.length,passCount:results.filter(x=>x.result==='PASS').length,failCount:results.filter(x=>x.result!=='PASS').length,playwrightVersion:PLAYWRIGHT_VERSION,localhostOnly:true,arbitraryUrlAccepted:false,callerScriptAccepted:false,results});
}
async function main(){
  const argv=process.argv.slice(2);
  if(argv.length===2&&argv[0]==='--self-test'){
    const r=runContractSelfTest();fs.writeFileSync(path.resolve(argv[1]),JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS')process.exitCode=1;return;
  }
  const args=parseArgs(argv);if(!args.contract||!args.output)fail('INPUT_AND_OUTPUT_REQUIRED');
  let receipt;
  try{receipt=await executeBrowserContract(JSON.parse(fs.readFileSync(path.resolve(args.contract),'utf8')));}
  catch(e){receipt=stable({schema:'CANONICAL_BROWSER_VERIFICATION_RECEIPT_v1',result:'FAIL',errorCode:e.code??'UNEXPECTED_BROWSER_FAILURE',detail:e.detail??e.message,localhostOnly:true,arbitraryUrlAccepted:false,callerScriptAccepted:false,environmentOverrideAccepted:false,repositoryWritesPerformed:false,productAuthorityCreated:false,semanticAuthorityCreated:false});}
  fs.writeFileSync(path.resolve(args.output),JSON.stringify(receipt,null,2)+'\n');if(receipt.result!=='PASS')process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{process.stderr.write(`${e.stack??e}\n`);process.exitCode=1;});
