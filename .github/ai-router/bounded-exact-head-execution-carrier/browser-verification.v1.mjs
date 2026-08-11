#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import cp from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const PLAYWRIGHT_VERSION='1.55.0';
const LEGACY_RUNNER_BLOB='e63433efe50614cb88e2ccaf5e25d19b2d8a4c62';
const MATRIX_PROFILES=Object.freeze({
  PHONE_390X844:{viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true},
  TABLET_820X1180:{viewport:{width:820,height:1180},deviceScaleFactor:1,isMobile:true,hasTouch:true},
  DESKTOP_1440X1000:{viewport:{width:1440,height:1000},deviceScaleFactor:1,isMobile:false,hasTouch:false}
});
const MATRIX_INTERACTIONS=new Set(['CLICK','POINTER_DRAG','WHEEL','EXPAND_DETAILS']);
const MATRIX_ASSERTIONS=new Set([
  'PAGE_LOAD_OK','NO_CONSOLE_ERRORS','NO_PAGE_ERRORS','SELECTOR_VISIBLE','SELECTOR_EXISTS',
  'NO_DOCUMENT_HORIZONTAL_OVERFLOW','SELECTOR_HORIZONTAL_VIEWPORT_ACCESSIBLE',
  'SELECTOR_INTERNAL_VERTICAL_SCROLL_PRESERVED','GLOBAL_PATH_EQUALS',
  'GLOBAL_PATH_UNCHANGED_AFTER_INTERACTION','GLOBAL_PATH_CHANGED_AFTER_INTERACTION','SCREENSHOT_NONEMPTY'
]);
const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
function fail(code,detail=null){const e=new Error(detail==null?code:`${code}:${typeof detail==='string'?detail:JSON.stringify(detail)}`);e.code=code;e.detail=detail;throw e;}
function obj(v,c){if(!v||typeof v!=='object'||Array.isArray(v))fail(c);return v;}
function closed(v,keys,p){obj(v,`${p}_OBJECT_REQUIRED`);const a=Object.keys(v).sort(),b=[...keys].sort();if(JSON.stringify(a)!==JSON.stringify(b))fail(`${p}_KEYSET_INVALID`,{expected:b,observed:a});}
function str(v,c,max=256){if(typeof v!=='string'||!v||v.length>max)fail(c,v);return v;}
function commit(v,c){if(!/^[0-9a-f]{40}$/.test(v??''))fail(c,String(v));return v;}
function selector(v,c='MATRIX_SELECTOR_INVALID'){str(v,c,256);return v;}
function dotPath(v,c='MATRIX_GLOBAL_PATH_INVALID'){if(typeof v!=='string'||!/^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*)*$/.test(v))fail(c,v);return v;}
function exactKeysForInteraction(x){
  if(x.type==='CLICK'||x.type==='EXPAND_DETAILS')return ['type','selector'];
  if(x.type==='POINTER_DRAG')return ['type','selector','startX','startY','endX','endY'];
  if(x.type==='WHEEL')return ['type','deltaY'];
  return [];
}
function exactKeysForAssertion(a){
  if(['PAGE_LOAD_OK','NO_CONSOLE_ERRORS','NO_PAGE_ERRORS','NO_DOCUMENT_HORIZONTAL_OVERFLOW','SCREENSHOT_NONEMPTY'].includes(a.type))return ['type'];
  if(['SELECTOR_VISIBLE','SELECTOR_EXISTS','SELECTOR_HORIZONTAL_VIEWPORT_ACCESSIBLE','SELECTOR_INTERNAL_VERTICAL_SCROLL_PRESERVED'].includes(a.type))return ['type','selector'];
  if(a.type==='GLOBAL_PATH_EQUALS')return ['type','path','expected'];
  if(['GLOBAL_PATH_UNCHANGED_AFTER_INTERACTION','GLOBAL_PATH_CHANGED_AFTER_INTERACTION'].includes(a.type))return ['type','path'];
  return [];
}
export function validateMatrixContract(raw){
  closed(raw,['schema','candidateHead','route','scenarios','screenshot'],'MATRIX_CONTRACT');
  if(raw.schema!=='CANONICAL_OPERATION_BROWSER_SCENARIO_MATRIX_CONTRACT_v1')fail('MATRIX_CONTRACT_SCHEMA_MISMATCH');
  commit(raw.candidateHead,'MATRIX_CANDIDATE_INVALID');
  if(typeof raw.route!=='string'||!raw.route.startsWith('/')||raw.route.includes('://')||raw.route.includes('..')||raw.route.length>300)fail('MATRIX_ROUTE_INVALID');
  if(!Array.isArray(raw.scenarios)||raw.scenarios.length<1||raw.scenarios.length>64)fail('MATRIX_SCENARIO_COUNT_INVALID');
  const ids=new Set();
  for(const s of raw.scenarios){
    closed(s,['caseId','profile','interactions','assertions'],'MATRIX_SCENARIO');
    if(typeof s.caseId!=='string'||!/^[A-Za-z0-9._:-]{1,96}$/.test(s.caseId)||ids.has(s.caseId))fail('MATRIX_CASE_ID_INVALID',s.caseId);ids.add(s.caseId);
    if(!Object.hasOwn(MATRIX_PROFILES,s.profile))fail('MATRIX_PROFILE_INVALID',s.profile);
    if(!Array.isArray(s.interactions)||s.interactions.length>16)fail('MATRIX_INTERACTIONS_INVALID',s.caseId);
    for(const x of s.interactions){
      obj(x,'MATRIX_INTERACTION_INVALID');if(!MATRIX_INTERACTIONS.has(x.type))fail('MATRIX_INTERACTION_TYPE_INVALID',x.type);
      closed(x,exactKeysForInteraction(x),'MATRIX_INTERACTION');
      if(x.selector!=null)selector(x.selector);
      if(x.type==='POINTER_DRAG')for(const k of ['startX','startY','endX','endY'])if(typeof x[k]!=='number'||!Number.isFinite(x[k])||x[k]<0||x[k]>1)fail('MATRIX_POINTER_FRACTION_INVALID',{k,value:x[k]});
      if(x.type==='WHEEL'&&(typeof x.deltaY!=='number'||!Number.isFinite(x.deltaY)||Math.abs(x.deltaY)>4000))fail('MATRIX_WHEEL_DELTA_INVALID',x.deltaY);
    }
    if(!Array.isArray(s.assertions)||s.assertions.length<1||s.assertions.length>64)fail('MATRIX_ASSERTIONS_INVALID',s.caseId);
    for(const a of s.assertions){
      obj(a,'MATRIX_ASSERTION_INVALID');if(!MATRIX_ASSERTIONS.has(a.type))fail('MATRIX_ASSERTION_TYPE_INVALID',a.type);
      closed(a,exactKeysForAssertion(a),'MATRIX_ASSERTION');
      if(a.selector!=null)selector(a.selector);
      if(a.path!=null)dotPath(a.path);
      if(a.type==='GLOBAL_PATH_EQUALS'&&!['string','number','boolean'].includes(typeof a.expected)&&a.expected!==null)fail('MATRIX_EXPECTED_VALUE_INVALID');
    }
  }
  closed(raw.screenshot,['fullPage','format','quality'],'MATRIX_SCREENSHOT');
  if(raw.screenshot.fullPage!==true||raw.screenshot.format!=='jpeg'||!Number.isInteger(raw.screenshot.quality)||raw.screenshot.quality<35||raw.screenshot.quality>90)fail('MATRIX_SCREENSHOT_INVALID');
  return stable(raw);
}
function git(args,cwd=ROOT,encoding='utf8'){return cp.execFileSync('git',args,{cwd,encoding,maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']}).trim();}
function gitHead(root){return cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{cwd:root,encoding:'utf8'}).trim();}
function legacyRunnerBytes(){const b=cp.execFileSync('git',['cat-file','blob',LEGACY_RUNNER_BLOB],{cwd:ROOT});const h=crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${b.length}\0`),b])).digest('hex');if(h!==LEGACY_RUNNER_BLOB)fail('LEGACY_BROWSER_RUNNER_BLOB_MISMATCH');return b;}
function invokeLegacy(args,{cwd=process.cwd()}={}){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'browser-v1-delegate-')),runner=path.join(d,'browser-v1.mjs');
  try{fs.writeFileSync(runner,legacyRunnerBytes());const c=cp.spawnSync(process.execPath,[runner,...args],{cwd,env:{...process.env},encoding:'utf8',maxBuffer:64*1024*1024});if(c.error)fail('LEGACY_BROWSER_RUNNER_EXECUTION_FAILURE',c.error.message);return c;}
  finally{fs.rmSync(d,{recursive:true,force:true});}
}
export async function executeBrowserContract(raw,{root=process.cwd()}={}){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'browser-v1-contract-')),input=path.join(d,'contract.json'),output=path.join(d,'out.json');
  try{fs.writeFileSync(input,JSON.stringify(raw));const c=invokeLegacy(['--contract',input,'--output',output],{cwd:root});if(!fs.existsSync(output))fail('LEGACY_BROWSER_RECEIPT_MISSING');const r=JSON.parse(fs.readFileSync(output,'utf8'));if(c.status!==0&&r.result==='PASS')fail('LEGACY_BROWSER_EXIT_RECEIPT_MISMATCH');return r;}
  finally{fs.rmSync(d,{recursive:true,force:true});}
}
export function runContractSelfTest(){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'browser-v1-selftest-')),output=path.join(d,'out.json');
  try{const c=invokeLegacy(['--self-test',output],{cwd:ROOT});if(!fs.existsSync(output))fail('LEGACY_BROWSER_SELF_TEST_MISSING');const r=JSON.parse(fs.readFileSync(output,'utf8'));if(c.status!==0&&r.result==='PASS')fail('LEGACY_BROWSER_SELF_TEST_EXIT_MISMATCH');return r;}
  finally{fs.rmSync(d,{recursive:true,force:true});}
}
function dependencyRoot(){const d=path.join(os.tmpdir(),`diamond-gate-playwright-${PLAYWRIGHT_VERSION}`);fs.mkdirSync(d,{recursive:true});return d;}
function ensurePlaywright(){
  const root=dependencyRoot(),pkg=path.join(root,'node_modules','playwright','package.json');let valid=false;
  if(fs.existsSync(pkg)){try{valid=JSON.parse(fs.readFileSync(pkg,'utf8')).version===PLAYWRIGHT_VERSION;}catch{}}
  if(!valid)cp.execFileSync('npm',['install','--prefix',root,'--no-save',`playwright@${PLAYWRIGHT_VERSION}`],{stdio:'inherit',env:{...process.env,npm_config_fund:'false',npm_config_audit:'false'}});
  const cli=path.join(root,'node_modules','playwright','cli.js'),browsers=path.join(root,'browsers');
  cp.execFileSync(process.execPath,[cli,'install','--with-deps','chromium'],{stdio:'inherit',env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:browsers}});
  process.env.PLAYWRIGHT_BROWSERS_PATH=browsers;return {modulePath:path.join(root,'node_modules','playwright','index.mjs'),browserPath:browsers};
}
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.wasm':'application/wasm'})[ext]??'application/octet-stream';}
async function startServer(root){
  const server=http.createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);let rel=pathname.replace(/^\/+/, '');if(rel===''||rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,rel);if(!(file===root||file.startsWith(root+path.sep)))throw new Error('PATH_ESCAPE');if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('not found');return;}res.writeHead(200,{'content-type':mime(file),'cache-control':'no-store'});fs.createReadStream(file).pipe(res);}catch{res.writeHead(400);res.end('bad request');}});
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});return {server,port:server.address().port};
}
async function globalValue(page,p){return page.evaluate(x=>{let v=window;for(const k of x.split('.'))v=v?.[k];return v;},p);}
async function visibleBox(page,sel){const loc=page.locator(sel);const n=await loc.count();for(let i=0;i<n;i++){const x=loc.nth(i);if(await x.isVisible()){const b=await x.boundingBox();if(b)return {loc:x,box:b};}}fail('MATRIX_INTERACTION_TARGET_NOT_VISIBLE',sel);}
async function performMatrixInteraction(page,x){
  if(x.type==='CLICK'){const {box}=await visibleBox(page,x.selector);await page.mouse.click(box.x+box.width/2,box.y+box.height/2);}
  else if(x.type==='POINTER_DRAG'){const {box}=await visibleBox(page,x.selector);const sx=box.x+box.width*x.startX,sy=box.y+box.height*x.startY,ex=box.x+box.width*x.endX,ey=box.y+box.height*x.endY;await page.mouse.move(sx,sy);await page.mouse.down();await page.mouse.move(ex,ey,{steps:10});await page.mouse.up();}
  else if(x.type==='WHEEL'){await page.mouse.wheel(0,x.deltaY);}
  else if(x.type==='EXPAND_DETAILS'){const loc=page.locator(x.selector);const n=await loc.count();if(n<1)fail('MATRIX_DETAILS_TARGET_MISSING',x.selector);for(let i=0;i<n;i++){const d=loc.nth(i);if(!(await d.isVisible()))continue;await d.evaluate(el=>{if(el instanceof HTMLDetailsElement)el.open=true;});}}
  await page.waitForTimeout(120);
}
async function matrixAssertion(page,state,a,shot,before){
  try{
    if(a.type==='PAGE_LOAD_OK')return {type:a.type,result:state.loadOk?'PASS':'FAIL',observed:state.status};
    if(a.type==='NO_CONSOLE_ERRORS')return {type:a.type,result:state.consoleErrors.length===0?'PASS':'FAIL',observed:state.consoleErrors};
    if(a.type==='NO_PAGE_ERRORS')return {type:a.type,result:state.pageErrors.length===0?'PASS':'FAIL',observed:state.pageErrors};
    if(a.type==='SELECTOR_VISIBLE'){const ok=await page.locator(a.selector).first().isVisible();return {type:a.type,selector:a.selector,result:ok?'PASS':'FAIL',observed:ok};}
    if(a.type==='SELECTOR_EXISTS'){const n=await page.locator(a.selector).count();return {type:a.type,selector:a.selector,result:n>0?'PASS':'FAIL',observed:n};}
    if(a.type==='NO_DOCUMENT_HORIZONTAL_OVERFLOW'){const o=await page.evaluate(()=>({innerWidth:window.innerWidth,root:document.documentElement.scrollWidth,body:document.body?.scrollWidth??0}));const max=Math.max(o.root,o.body),ok=max<=o.innerWidth+1;return {type:a.type,result:ok?'PASS':'FAIL',observed:{...o,maxScrollWidth:max}};}
    if(a.type==='SELECTOR_HORIZONTAL_VIEWPORT_ACCESSIBLE'){const r=await page.locator(a.selector).evaluateAll((els)=>{const v=[];for(const el of els){const cs=getComputedStyle(el),b=el.getBoundingClientRect();if(cs.display==='none'||cs.visibility==='hidden'||b.width<=0||b.height<=0)continue;v.push({left:b.left,right:b.right,width:b.width});}return {innerWidth:window.innerWidth,rects:v};});const ok=r.rects.length>0&&r.rects.every(b=>b.left>=-1&&b.right<=r.innerWidth+1);return {type:a.type,selector:a.selector,result:ok?'PASS':'FAIL',observed:r};}
    if(a.type==='SELECTOR_INTERNAL_VERTICAL_SCROLL_PRESERVED'){const r=await page.locator(a.selector).first().evaluate(el=>{const cs=getComputedStyle(el),before=el.scrollTop,canStyle=['auto','scroll'].includes(cs.overflowY),horizontal=el.scrollWidth<=el.clientWidth+1;let moved=true;if(el.scrollHeight>el.clientHeight+1){el.scrollTop=Math.min(40,el.scrollHeight-el.clientHeight);moved=el.scrollTop>0;el.scrollTop=before;}return {overflowY:cs.overflowY,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,canStyle,horizontal,moved};});const ok=r.canStyle&&r.horizontal&&r.moved;return {type:a.type,selector:a.selector,result:ok?'PASS':'FAIL',observed:r};}
    if(a.type==='GLOBAL_PATH_EQUALS'){const v=await globalValue(page,a.path),ok=Object.is(v,a.expected);return {type:a.type,path:a.path,result:ok?'PASS':'FAIL',expected:a.expected,observed:v??null};}
    if(a.type==='GLOBAL_PATH_UNCHANGED_AFTER_INTERACTION'){const v=await globalValue(page,a.path),bv=before[a.path],ok=JSON.stringify(v)===JSON.stringify(bv);return {type:a.type,path:a.path,result:ok?'PASS':'FAIL',before:bv??null,observed:v??null};}
    if(a.type==='GLOBAL_PATH_CHANGED_AFTER_INTERACTION'){const v=await globalValue(page,a.path),bv=before[a.path],ok=JSON.stringify(v)!==JSON.stringify(bv);return {type:a.type,path:a.path,result:ok?'PASS':'FAIL',before:bv??null,observed:v??null};}
    if(a.type==='SCREENSHOT_NONEMPTY')return {type:a.type,result:shot.length>100?'PASS':'FAIL',observedBytes:shot.length};
  }catch(e){return {type:a.type,result:'FAIL',error:e.message};}
  return {type:a.type,result:'FAIL',error:'UNSUPPORTED'};
}
export async function executeBrowserScenarioMatrixContract(raw,{root=process.cwd()}={}){
  const contract=validateMatrixContract(raw),actual=gitHead(root);if(actual!==contract.candidateHead)fail('EXACT_CANDIDATE_HEAD_MISMATCH',{expected:contract.candidateHead,observed:actual});
  const dep=ensurePlaywright(),{chromium}=await import(pathToFileURL(dep.modulePath).href),{server,port}=await startServer(root),browser=await chromium.launch({headless:true,env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:dep.browserPath}});
  const cases=[];
  try{
    for(const s of contract.scenarios){
      const context=await browser.newContext(MATRIX_PROFILES[s.profile]),page=await context.newPage(),consoleErrors=[],pageErrors=[];
      page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});page.on('pageerror',e=>pageErrors.push(e.message));
      let response=null;try{response=await page.goto(`http://127.0.0.1:${port}${contract.route}`,{waitUntil:'networkidle',timeout:45000});}catch{}
      const state={status:response?.status()??null,loadOk:!!response&&response.status()<400,consoleErrors,pageErrors},before={};
      for(const a of s.assertions)if(['GLOBAL_PATH_UNCHANGED_AFTER_INTERACTION','GLOBAL_PATH_CHANGED_AFTER_INTERACTION'].includes(a.type))before[a.path]=await globalValue(page,a.path);
      let interactionError=null;try{for(const x of s.interactions)await performMatrixInteraction(page,x);}catch(e){interactionError=e.code??e.message;}
      const shot=await page.screenshot({type:'jpeg',quality:contract.screenshot.quality,fullPage:true}),checks=[];
      if(interactionError)checks.push({type:'INTERACTION_SEQUENCE',result:'FAIL',error:interactionError});
      for(const a of s.assertions)checks.push(await matrixAssertion(page,state,a,shot,before));
      cases.push(stable({caseId:s.caseId,profile:s.profile,viewport:MATRIX_PROFILES[s.profile].viewport,result:checks.every(c=>c.result==='PASS')?'PASS':'FAIL',assertions:checks,consoleErrors,pageErrors,screenshot:{format:'jpeg',sha256:sha256(shot),byteLength:shot.length,base64:shot.toString('base64')}}));
      await context.close();
    }
  }finally{await browser.close();await new Promise(r=>server.close(r));}
  return stable({schema:'CANONICAL_BROWSER_SCENARIO_MATRIX_RECEIPT_v1',result:cases.every(c=>c.result==='PASS')?'PASS':'FAIL',candidateHead:contract.candidateHead,route:contract.route,scenarioCount:cases.length,cases,playwrightVersion:PLAYWRIGHT_VERSION,browser:'chromium',localhostOnly:true,fixedViewportProfilesOnly:true,freshContextPerScenario:true,callerScriptAccepted:false,callerPlaywrightAccepted:false,arbitraryViewportAccepted:false,environmentOverrideAccepted:false,repositoryWritesPerformed:false,productAuthorityCreated:false,semanticAuthorityCreated:false});
}
export function runMatrixContractSelfTest(){
  const base={schema:'CANONICAL_OPERATION_BROWSER_SCENARIO_MATRIX_CONTRACT_v1',candidateHead:'a'.repeat(40),route:'/index.html',scenarios:[{caseId:'case-1',profile:'PHONE_390X844',interactions:[],assertions:[{type:'PAGE_LOAD_OK'},{type:'NO_DOCUMENT_HORIZONTAL_OVERFLOW'},{type:'SCREENSHOT_NONEMPTY'}]}],screenshot:{fullPage:true,format:'jpeg',quality:50}},results=[];
  const ok=(n,f)=>{try{f();results.push({name:n,result:'PASS'});}catch(e){results.push({name:n,result:'FAIL',detail:e.code??e.message});}};
  const bad=(n,c,f)=>{try{f();results.push({name:n,result:'FAIL',detail:'UNEXPECTED_PASS'});}catch(e){results.push({name:n,result:(e.code??e.message)===c?'PASS':'FAIL',detail:e.code??e.message});}};
  ok('VALID_MATRIX_CONTRACT',()=>validateMatrixContract(base));
  bad('REMOTE_ROUTE_REJECTED','MATRIX_ROUTE_INVALID',()=>validateMatrixContract({...base,route:'https://example.com'}));
  bad('ARBITRARY_PROFILE_REJECTED','MATRIX_PROFILE_INVALID',()=>validateMatrixContract({...base,scenarios:[{...base.scenarios[0],profile:'CUSTOM'}]}));
  bad('ARBITRARY_VIEWPORT_FIELD_REJECTED','MATRIX_SCENARIO_KEYSET_INVALID',()=>validateMatrixContract({...base,scenarios:[{...base.scenarios[0],viewport:{width:1,height:1}}]}));
  bad('ARBITRARY_ASSERTION_REJECTED','MATRIX_ASSERTION_TYPE_INVALID',()=>validateMatrixContract({...base,scenarios:[{...base.scenarios[0],assertions:[{type:'EVAL'}]}]}));
  bad('ARBITRARY_INTERACTION_REJECTED','MATRIX_INTERACTION_TYPE_INVALID',()=>validateMatrixContract({...base,scenarios:[{...base.scenarios[0],interactions:[{type:'SCRIPT'}]}]}));
  bad('TOO_MANY_SCENARIOS_REJECTED','MATRIX_SCENARIO_COUNT_INVALID',()=>validateMatrixContract({...base,scenarios:Array.from({length:65},(_,i)=>({...base.scenarios[0],caseId:`c${i}`}))}));
  return stable({schema:'CANONICAL_BROWSER_SCENARIO_MATRIX_RUNNER_SELF_TEST_v1',result:results.every(x=>x.result==='PASS')?'PASS':'FAIL',testCount:results.length,passCount:results.filter(x=>x.result==='PASS').length,failCount:results.filter(x=>x.result!=='PASS').length,playwrightVersion:PLAYWRIGHT_VERSION,localhostOnly:true,fixedViewportProfilesOnly:true,callerScriptAccepted:false,arbitraryViewportAccepted:false,results});
}
async function main(){
  const a=process.argv.slice(2);
  if(a.length===2&&a[0]==='--self-test'){const r=runContractSelfTest();fs.writeFileSync(path.resolve(a[1]),JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS')process.exitCode=1;return;}
  if(a.length===2&&a[0]==='--matrix-self-test'){const r=runMatrixContractSelfTest();fs.writeFileSync(path.resolve(a[1]),JSON.stringify(r,null,2)+'\n');if(r.result!=='PASS')process.exitCode=1;return;}
  if(a.length!==4||!['--contract','--matrix-contract'].includes(a[0])||a[2]!=='--output')fail('CLI_ARGUMENTS_INVALID');
  const raw=JSON.parse(fs.readFileSync(path.resolve(a[1]),'utf8'));let receipt;
  try{receipt=a[0]==='--contract'?await executeBrowserContract(raw):await executeBrowserScenarioMatrixContract(raw);}
  catch(e){receipt=stable({schema:a[0]==='--contract'?'CANONICAL_BROWSER_VERIFICATION_RECEIPT_v1':'CANONICAL_BROWSER_SCENARIO_MATRIX_RECEIPT_v1',result:'FAIL',errorCode:e.code??'UNEXPECTED_BROWSER_FAILURE',detail:e.detail??e.message,localhostOnly:true,callerScriptAccepted:false,repositoryWritesPerformed:false,productAuthorityCreated:false,semanticAuthorityCreated:false});}
  fs.writeFileSync(path.resolve(a[3]),JSON.stringify(receipt,null,2)+'\n');if(receipt.result!=='PASS')process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{process.stderr.write(`${e.stack??e}\n`);process.exitCode=1;});
