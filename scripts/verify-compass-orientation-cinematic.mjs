#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';

const ROOT=process.cwd();
const GOVERNING='be6234fd0768095f10227a4adf0fbb36e5f7800f';
const EXPECTED_CHANGED=new Set([
  'assets/compass/compass.orientation-cinematic.css',
  'assets/compass/compass.orientation-cinematic.js',
  'assets/compass/compass.orientation-cinematic.render.js',
  'assets/compass/compass.orientation-cinematic.media.js',
  'scripts/verify-compass-orientation-cinematic.mjs'
]);
const FILES={
  css:'assets/compass/compass.orientation-cinematic.css',
  runtime:'assets/compass/compass.orientation-cinematic.js',
  renderer:'assets/compass/compass.orientation-cinematic.render.js',
  media:'assets/compass/compass.orientation-cinematic.media.js'
};
const expectedScenes=['arrival','orientation','chapter-one','choice-readiness','threshold','elsewhere','return-handoff'];
const expectedBoundaries=[0,4500,9500,14500,19500,27000,33000,38000];
const checks=[];
const failures=[];
const record=(id,pass,evidence={})=>{checks.push({id,status:pass?'PASS':'FAIL',evidence});if(!pass)failures.push(id);return pass;};
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const src=Object.fromEntries(Object.entries(FILES).map(([k,p])=>[k,read(p)]));

record('SOURCE_TIMELINE_38_SECONDS',/MASTER_DURATION=38000/.test(src.runtime),{});
record('SOURCE_SEVEN_SCENES',expectedScenes.every(x=>src.runtime.includes(`key:'${x}'`))&&expectedScenes.length===7,{});
record('SOURCE_NO_IFRAME',![src.runtime,src.renderer].some(s=>/iframe|createElement\(['"]iframe/i.test(s)),{});
record('SOURCE_NO_SCROLLTO_CINEMATOGRAPHY',![src.runtime,src.renderer].some(s=>/scrollTo\s*\(/.test(s)),{});
record('SOURCE_NO_HISTORY_OR_LOCATION_MUTATION',![src.runtime,src.renderer].some(s=>/history\.(pushState|replaceState)|location\.(assign|replace)|location\s*=/.test(s)),{});
record('SOURCE_DETERMINISTIC_MEDIA_LAYER',/DGB_COMPASS_CINEMATIC_MEDIA/.test(src.media)&&/durationMs:38000/.test(src.media)&&/derivedMediaRequired:false/.test(src.media),{});
record('SOURCE_REDUCED_SEMANTIC_EQUIVALENT',/reducedShell/.test(src.runtime)&&/data-cinematic-reduced-continue/.test(src.runtime)&&/Choice and readiness/.test(src.runtime)&&/Elsewhere/.test(src.runtime),{});
record('SOURCE_RENDERER_TRANSITION_VARIABLES',src.renderer.includes("setProperty('--cinematic-entry'")&&src.renderer.includes("setProperty('--cinematic-exit'"),{});
record('SOURCE_FINAL_HANDOFF_SCENE_FIXED',src.renderer.includes("if(name==='RETURN_HANDOFF'&&i===idx){o=entry;y=0;b=(1-entry)*5;}"),{});
record('SOURCE_HANDOFF_BASE_GEOMETRY',src.runtime.includes("closest('.compass-cinematic-renderer__geometry--handoff')")&&src.runtime.includes('g.offsetWidth'),{});
record('SOURCE_IDEMPOTENT_COMPLETE_TARGET',src.runtime.includes("reason==='complete'&&!session.handoff"),{});

function externalBoundary(){
  const git=spawnSync('git',['rev-parse','--is-inside-work-tree'],{cwd:ROOT,encoding:'utf8'});
  if(git.status===0&&git.stdout.trim()==='true'){
    const changed=spawnSync('git',['diff','--name-only',`${GOVERNING}...HEAD`],{cwd:ROOT,encoding:'utf8'});
    if(changed.status!==0)return {mode:'git',ok:false,error:changed.stderr.trim()};
    const paths=changed.stdout.trim().split(/\r?\n/).filter(Boolean);
    const scopeOk=paths.every(p=>EXPECTED_CHANGED.has(p));
    const protectedPaths=['assets/compass/compass.controller.js','assets/compass/compass.crystals.js','assets/compass/compass.mirrorland-window.js'];
    let protectedOk=true, protectedEvidence=[];
    for(const p of protectedPaths){
      const a=spawnSync('git',['rev-parse',`${GOVERNING}:${p}`],{cwd:ROOT,encoding:'utf8'});
      const b=spawnSync('git',['rev-parse',`HEAD:${p}`],{cwd:ROOT,encoding:'utf8'});
      const same=a.status===0&&b.status===0&&a.stdout.trim()===b.stdout.trim(); protectedOk&&=same; protectedEvidence.push({path:p,governing:a.stdout.trim(),candidate:b.stdout.trim(),same});
    }
    return {mode:'git',ok:scopeOk&&protectedOk,paths,scopeOk,protectedOk,protectedEvidence};
  }
  const supplied=(process.env.DGB_CHANGED_PATHS||'').split(',').map(x=>x.trim()).filter(Boolean);
  const scopeOk=supplied.length>0&&supplied.every(p=>EXPECTED_CHANGED.has(p));
  const protectedOk=process.env.DGB_PROTECTED_AUTHORITY_INTEGRITY==='PASS';
  const preflight=process.env.DGB_ALLOW_MATERIALIZED_PREFLIGHT==='1';
  return {mode:'materialized-exact-head',ok:(scopeOk&&protectedOk)||preflight,paths:supplied,scopeOk,protectedOk,preflight};
}
const boundary=externalBoundary();
record('ALLOWED_PATH_AND_PROTECTED_AUTHORITY_BOUNDARY',boundary.ok,boundary);

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function getJson(url){return new Promise((resolve,reject)=>{http.get(url,res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve(JSON.parse(d))}catch(e){reject(e)}})}).on('error',reject)});}
class CDP{
  constructor(ws){this.ws=ws;this.id=0;this.pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&this.pending.has(m.id)){const {resolve,reject}=this.pending.get(m.id);this.pending.delete(m.id);m.error?reject(new Error(m.error.message||JSON.stringify(m.error))):resolve(m.result);}};}
  send(method,params={}){return new Promise((resolve,reject)=>{const id=++this.id;this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  async value(expression){const r=await this.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'Runtime evaluation failed');return r.result?.value;}
  close(){try{this.ws.close()}catch{}}
}
async function launchChrome(){
  const candidates=[process.env.CHROME_PATH,'/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome','/usr/bin/google-chrome-stable'].filter(Boolean);
  const chromePath=candidates.find(p=>fs.existsSync(p));
  if(!chromePath)throw new Error('CHROME_RUNTIME_UNAVAILABLE');
  const port=9400+Math.floor(Math.random()*400),dir=fs.mkdtempSync(path.join(os.tmpdir(),'compass-cinematic-chrome-'));
  const proc=spawn(chromePath,['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-gpu',`--remote-debugging-port=${port}`,`--user-data-dir=${dir}`,'about:blank'],{stdio:'ignore'});
  let target=null;
  for(let i=0;i<120;i++){try{const list=await getJson(`http://127.0.0.1:${port}/json/list`);target=list.find(x=>x.type==='page'&&x.webSocketDebuggerUrl)||list[0];if(target?.webSocketDebuggerUrl)break;}catch{}await sleep(50);}
  if(!target?.webSocketDebuggerUrl){proc.kill('SIGKILL');throw new Error('CHROME_DEBUG_TARGET_UNAVAILABLE');}
  const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
  const cdp=new CDP(ws);await cdp.send('Runtime.enable');await cdp.send('Page.enable');return {cdp,proc,dir,chromePath};
}

const geomStub=`(()=>{window.__mirrorlandPaneReads=0;const panes=Array.from({length:21},(_,i)=>({color:'#55bcd4',points:[[100+(i%5)*40,100+Math.floor(i/5)*40],[130+(i%5)*40,100+Math.floor(i/5)*40],[130+(i%5)*40,130+Math.floor(i/5)*40],[100+(i%5)*40,130+Math.floor(i/5)*40]]}));window.DGB_MIRRORLAND_WINDOW_GEOMETRY={ready:true,dimensions:{designWidth:400,designHeight:400},traceOuterWindow(ctx){ctx.beginPath();ctx.rect(40,40,320,320)},getPanes(){window.__mirrorlandPaneReads++;return panes},tracePolygon(ctx,pts){ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.closePath()},rgba(c,a){return 'rgba(89,203,224,'+a+')'},getFrameSegments(){return [[[40,200],[360,200]],[[200,40],[200,360]]]}}})();`;
const planetStub=`(()=>{window.__audraliaMounts=0;window.DGB_ARCHCOIN_CENTER_WORLD={mount(el){window.__audraliaMounts++;el.dataset.archcoinCenterWorldMounted='true';const x=document.createElement('div');x.dataset.worldMounted='true';x.style.cssText='position:absolute;inset:0;border-radius:50%';el.appendChild(x);return true;}}})();`;
function harness({step=100,rendererMode='normal',pauseScene=null}={}){
  const renderer=rendererMode==='normal'?src.renderer:`(()=>{window.DGB_COMPASS_CINEMATIC_RENDERER={mount(){throw new Error('NEGATIVE_CONTROL_RENDERER_FAILURE')}}})();`;
  const instrument=`window.__cinematicEvents=[];window.__frameAudit=[];window.__clockPaused=false;window.__releaseClock=false;const pauseScene=${JSON.stringify(pauseScene)};for(const n of ['dgb:compass-orientation-cinematic-scene','dgb:compass-orientation-cinematic-settled','dgb:compass-orientation-cinematic-handoff-proof'])document.addEventListener(n,e=>window.__cinematicEvents.push({type:n,detail:e.detail,t:performance.now()}));let advance=0;const realNow=performance.now.bind(performance);window.requestAnimationFrame=(cb)=>setTimeout(()=>{const o=document.querySelector('#compass-orientation-cinematic');if(pauseScene&&o?.dataset.state==='PLAYING'&&o?.dataset.scene===pauseScene&&!window.__releaseClock){window.__clockPaused=true;window.__pausedRaf=cb;return;}advance+=${step};cb(realNow()+advance);const r=document.querySelector('[data-cinematic-renderer]');if(r){const os=[...r.querySelectorAll('[data-render-scene]')].map(x=>Number(getComputedStyle(x).opacity)||0);window.__frameAudit.push({scene:r.dataset.scene||'',maxOpacity:Math.max(0,...os)});}},0);window.cancelAnimationFrame=id=>clearTimeout(id);`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${src.css}</style><style>html,body{margin:0;min-height:2400px;background:#111;color:white}[data-compass-root]{min-height:2400px}[data-compass-scene]{position:absolute;left:50%;top:812px;transform:translateX(-50%);width:min(87.38vw,786px);height:720px;background:rgba(30,70,90,.1)}@media(max-width:700px){[data-compass-scene]{top:650px;width:92vw;height:520px}}</style><script>${instrument}</script><script>${geomStub}</script><script>${planetStub}</script><script>${src.media}</script><script>${renderer}</script></head><body><main data-compass-root><button id="prior-focus">prior</button><section data-compass-scene></section></main><script>document.getElementById('prior-focus').focus()</script><script>${src.runtime}</script></body></html>`;
}
async function setDoc(cdp,html,{width=900,height=1000,reduced=false}={}){
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<700});
  await cdp.send('Emulation.setEmulatedMedia',{media:'screen',features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
  await cdp.value(`document.open();document.write(${JSON.stringify(html)});document.close();true`);
}
async function waitFor(cdp,expr,timeout=7000){const start=Date.now();while(Date.now()-start<timeout){try{if(await cdp.value(expr))return true;}catch{}await sleep(20);}throw new Error(`WAIT_TIMEOUT:${expr}`);}
async function snapshot(cdp){return cdp.value(`(()=>{const root=document.querySelector('[data-compass-root]'),settled=window.__cinematicEvents.find(e=>e.type==='dgb:compass-orientation-cinematic-settled')?.detail||null;return{settled,events:window.__cinematicEvents,root:root?{inert:root.inert,aria:root.getAttribute('aria-hidden')}:null,overlay:!!document.querySelector('#compass-orientation-cinematic'),activeId:document.activeElement?.id||'',reducedItems:document.querySelectorAll('.compass-orientation-cinematic__reduced-map li').length,reducedText:document.querySelector('.compass-orientation-cinematic__reduced')?.innerText||'',mirrorlandPaneReads:window.__mirrorlandPaneReads||0,audraliaMounts:window.__audraliaMounts||0,frameAudit:window.__frameAudit||[],api:window.DGB_MAIN_ORIENTATION_CINEMATIC?{durationMs:window.DGB_MAIN_ORIENTATION_CINEMATIC.durationMs,scenes:window.DGB_MAIN_ORIENTATION_CINEMATIC.scenes}:null};})()`);}

async function isolated(html,options,body){
  const b=await launchChrome();
  try{
    await setDoc(b.cdp,html,options);
    await waitFor(b.cdp,`!!document.querySelector('#compass-orientation-cinematic')`,2500);
    return await body(b.cdp);
  } finally {
    b.cdp.close();b.proc.kill('SIGKILL');try{fs.rmSync(b.dir,{recursive:true,force:true})}catch{}
  }
}

try{
  const viewports=[['desktop',1440,1000],['tablet',900,1000],['portrait-mobile',390,844]];
  for(const [name,width,height] of viewports){
    await isolated(harness({step:100}),{width,height},async c=>{
      const armed=await c.value(`(()=>{const o=document.querySelector('#compass-orientation-cinematic'),r=document.querySelector('[data-compass-root]');return !!o&&o.dataset.state==='ARMED'&&r.inert===true&&r.getAttribute('aria-hidden')==='true'&&document.activeElement?.matches('[data-cinematic-play]')})()`);
      record(`RUNTIME_${name.toUpperCase().replaceAll('-','_')}_ARMED_ISOLATION`,armed,{});
      await c.value(`document.querySelector('[data-cinematic-play]').click();true`);await waitFor(c,`window.__cinematicEvents.some(e=>e.type==='dgb:compass-orientation-cinematic-settled')`);
      const s=await snapshot(c), scenes=s.events.filter(e=>e.type==='dgb:compass-orientation-cinematic-scene').map(e=>e.detail.key);
      const noReset=s.frameAudit.filter(x=>x.scene&&x.scene!=='ARRIVAL').every(x=>x.maxOpacity>0.02);
      record(`RUNTIME_${name.toUpperCase().replaceAll('-','_')}_NATURAL_COMPLETION`,s.settled?.reason==='complete'&&s.settled?.durationMs===38000&&JSON.stringify(s.settled?.boundariesMs)===JSON.stringify(expectedBoundaries)&&JSON.stringify(scenes)===JSON.stringify(expectedScenes)&&s.settled?.urlUnchanged===true&&s.settled?.historyUnchanged===true&&s.settled?.navigationIntentEvents===0&&s.settled?.handoffAligned===true&&s.root?.inert===false&&s.root?.aria===null&&!s.overlay&&s.activeId==='prior-focus'&&s.mirrorlandPaneReads>0&&s.audraliaMounts>0&&noReset,{settled:s.settled,scenes,mirrorlandPaneReads:s.mirrorlandPaneReads,audraliaMounts:s.audraliaMounts,noReset,minVisible:s.frameAudit.filter(x=>x.scene&&x.scene!=='ARRIVAL').reduce((m,x)=>Math.min(m,x.maxOpacity),1)});
    });
  }

  for(const mode of ['button','escape']){
    await isolated(harness(),{},async c=>{
      if(mode==='button')await c.value(`document.querySelector('[data-cinematic-armed] [data-cinematic-skip]').click();true`);else await c.value(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));true`);
      await waitFor(c,`window.__cinematicEvents.some(e=>e.type==='dgb:compass-orientation-cinematic-settled')`,2500);const s=await snapshot(c);
      record(`ARMED_${mode.toUpperCase()}_RESTORATION`,s.settled?.reason==='skip-armed'&&!s.overlay&&s.root?.inert===false&&s.root?.aria===null&&s.activeId==='prior-focus'&&s.settled?.urlUnchanged&&s.settled?.historyUnchanged,{settled:s.settled});
    });
  }

  for(const target of expectedScenes){for(const mode of ['skip','escape']){
    await isolated(harness({step:150,pauseScene:target}),{},async c=>{
      await c.value(`document.querySelector('[data-cinematic-play]').click();true`);
      await waitFor(c,`window.__clockPaused===true&&document.querySelector('#compass-orientation-cinematic')?.dataset.scene===${JSON.stringify(target)}`);
      if(mode==='skip')await c.value(`document.querySelector('[data-cinematic-player] [data-cinematic-skip]').click();true`);else await c.value(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));true`);
      await waitFor(c,`window.__cinematicEvents.some(e=>e.type==='dgb:compass-orientation-cinematic-settled')`,2500);const s=await snapshot(c);
      record(`SCENE_${target.toUpperCase().replaceAll('-','_')}_${mode.toUpperCase()}_RESTORATION`,s.settled?.reason==='skip-playing'&&!s.overlay&&s.root?.inert===false&&s.root?.aria===null&&s.activeId==='prior-focus'&&s.settled?.urlUnchanged&&s.settled?.historyUnchanged,{settled:s.settled});
    });
  }}

  await isolated(harness(),{reduced:true},async c=>{
    let s=await snapshot(c);const reducedOk=s.overlay&&s.root?.inert===true&&s.reducedItems===7&&['Arrival','Orientation','Chapter One','Choice and readiness','Threshold','Elsewhere','Return'].every(x=>s.reducedText.includes(x));
    record('REDUCED_MOTION_SEMANTIC_EQUIVALENT_PRESENT',reducedOk,{items:s.reducedItems,text:s.reducedText});
    await c.value(`document.querySelector('[data-cinematic-reduced-continue]').click();true`);await waitFor(c,`window.__cinematicEvents.some(e=>e.type==='dgb:compass-orientation-cinematic-settled')`,2500);s=await snapshot(c);
    record('REDUCED_MOTION_RESTORATION',s.settled?.reason==='reduced-motion-complete'&&!s.overlay&&s.root?.inert===false&&s.root?.aria===null&&s.activeId==='prior-focus'&&s.settled?.urlUnchanged&&s.settled?.historyUnchanged,{settled:s.settled});
  });

  await isolated(harness({rendererMode:'throw'}),{},async c=>{
    await c.value(`document.querySelector('[data-cinematic-play]').click();true`);await waitFor(c,`window.__cinematicEvents.some(e=>e.type==='dgb:compass-orientation-cinematic-settled')`,2500);const s=await snapshot(c);
    record('NEGATIVE_CONTROL_RENDERER_FAIL_OPEN',s.settled?.reason==='fail-open'&&String(s.settled?.errorCode||'').includes('NEGATIVE_CONTROL_RENDERER_FAILURE')&&!s.overlay&&s.root?.inert===false&&s.root?.aria===null&&s.activeId==='prior-focus',{settled:s.settled});
  });

  await isolated(harness(),{},async c=>{
    await c.value(`window.DGB_MAIN_ORIENTATION_CINEMATIC.restore('manual-one');window.DGB_MAIN_ORIENTATION_CINEMATIC.restore('manual-two');true`);await waitFor(c,`window.__cinematicEvents.some(e=>e.type==='dgb:compass-orientation-cinematic-settled')`,2500);const s=await snapshot(c),settledEvents=s.events.filter(e=>e.type==='dgb:compass-orientation-cinematic-settled');
    record('IDEMPOTENT_SINGLE_RESTORATION_RECEIPT',settledEvents.length===1&&settledEvents[0].detail.reason==='manual-one'&&!s.overlay&&s.root?.inert===false&&s.activeId==='prior-focus',{count:settledEvents.length,settled:settledEvents[0]?.detail});
  });
} catch(e){record('NATIVE_BROWSER_EXECUTION',false,{error:e.stack||String(e)});}
const receipt={schema:'COMPASS_MAIN_ORIENTATION_CINEMATIC_QUALIFICATION_RECEIPT_v1',status:failures.length?'FAIL':'PASS',governingHead:GOVERNING,candidate:process.env.DGB_CANDIDATE_SHA||null,executionTransport:'NATIVE_LOCAL_CHROMIUM_CDP_NO_GITHUB_ACTIONS',sourceHashes:Object.fromEntries(Object.entries(src).map(([k,v])=>[k,sha(v)])),checks,failures,generatedAt:new Date().toISOString()};
const out=process.env.DGB_QUALIFICATION_RECEIPT||'/tmp/compass-main-orientation-cinematic-qualification.json';fs.writeFileSync(out,JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));process.exitCode=failures.length?1:0;
