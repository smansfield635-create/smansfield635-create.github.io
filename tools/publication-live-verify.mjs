import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const inspectBrowserExecutable=executablePath=>{
  const resolvedPath=fs.realpathSync(executablePath);
  fs.accessSync(resolvedPath,fs.constants.X_OK);
  const version=execFileSync(resolvedPath,['--version'],{encoding:'utf8',timeout:5000,maxBuffer:65536}).trim();
  return {requestedPath:executablePath,resolvedPath,version};
};
export const launchVerifiedBrowser=async({puppeteer,executablePath,inspect=inspectBrowserExecutable,report=value=>console.error('BROWSER_STARTUP_DIAGNOSTIC '+JSON.stringify(value)),probeTimeoutMs=10000})=>{
  let browser,timer,phase='EXECUTABLE_IDENTITY';
  try{
    const identity=inspect(executablePath);report({phase,result:'PASS',...identity});
    phase='BROWSER_LAUNCH';report({phase,result:'START',timeoutMs:30000});
    browser=await puppeteer.launch({executablePath:identity.resolvedPath,headless:'new',timeout:30000,dumpio:true,
      args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
    phase='BLANK_PAGE_CONNECTION';
    const probe=async()=>{
      const page=await browser.newPage();
      await page.goto('about:blank',{waitUntil:'domcontentloaded',timeout:probeTimeoutMs});
      const ready=await page.evaluate(()=>location.href==='about:blank'&&document.documentElement?.tagName==='HTML');
      if(!ready)throw Error('BROWSER_BLANK_PAGE_PROBE_FAILED');
      await page.close();
    };
    await Promise.race([probe(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('BROWSER_BLANK_PAGE_PROBE_TIMEOUT')),probeTimeoutMs);})]);
    clearTimeout(timer);report({phase,result:'PASS'});return browser;
  }catch(error){
    clearTimeout(timer);report({phase,result:'FAIL',error:String(error?.stack||error)});
    // A failed diagnostic cannot proceed into world loading or leave its process alive.
    if(browser){try{browser.process()?.kill('SIGKILL');}catch{}}
    throw error;
  }
};

export const launchSurfaceBrowser=({puppeteer,executablePath,surfaceId,scenePolicy,diagnosticLaunch=launchVerifiedBrowser})=>
  surfaceId==='h-earth'
    ? diagnosticLaunch({puppeteer,executablePath})
    : puppeteer.launch({executablePath,headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});

const ALLOWED_KEYS=new Set(['ArrowLeft','ArrowRight','Home','End','Enter','Space']);
const MAX_INTERACTIONS=32;
const MAX_ASSERTIONS=8;
const MAX_SELECTOR_LENGTH=240;
const MAX_NAME_LENGTH=80;
const MAX_VALUE_LENGTH=240;

const assertPlainObject=(value,label)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error(`INTERACTION_CONTRACT_INVALID ${label} object required`);
};
const assertExactKeys=(value,allowed,required,label)=>{
  assertPlainObject(value,label);
  const keys=Object.keys(value);
  for(const key of keys)if(!allowed.includes(key))throw new Error(`INTERACTION_CONTRACT_INVALID ${label} unsupported field ${key}`);
  for(const key of required)if(!(key in value))throw new Error(`INTERACTION_CONTRACT_INVALID ${label} missing field ${key}`);
};
const assertBoundedString=(value,label,{min=1,max=MAX_VALUE_LENGTH}={})=>{
  if(typeof value!=='string'||value.length<min||value.length>max)throw new Error(`INTERACTION_CONTRACT_INVALID ${label} string length`);
  return value;
};
const validateSelector=(value,label)=>assertBoundedString(value,label,{max:MAX_SELECTOR_LENGTH});

export const validateDeclaredInteractions=interactions=>{
  if(interactions===undefined)return [];
  if(!Array.isArray(interactions))throw new Error('INTERACTION_CONTRACT_INVALID interactions array required');
  if(interactions.length>MAX_INTERACTIONS)throw new Error(`INTERACTION_CONTRACT_INVALID interactions max ${MAX_INTERACTIONS}`);
  return interactions.map((interaction,index)=>{
    const label=`interactions[${index}]`;
    assertExactKeys(interaction,['name','action','assertions','timeoutMs'],['name','action','assertions'],label);
    assertBoundedString(interaction.name,`${label}.name`,{max:MAX_NAME_LENGTH});
    if(interaction.timeoutMs!==undefined&&(!Number.isInteger(interaction.timeoutMs)||interaction.timeoutMs<250||interaction.timeoutMs>15000))throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.timeoutMs`);
    const action=interaction.action;
    assertPlainObject(action,`${label}.action`);
    if(action.type==='click'){
      assertExactKeys(action,['type','selector'],['type','selector'],`${label}.action`);
      validateSelector(action.selector,`${label}.action.selector`);
    }else if(action.type==='key'){
      assertExactKeys(action,['type','selector','key'],['type','selector','key'],`${label}.action`);
      validateSelector(action.selector,`${label}.action.selector`);
      if(!ALLOWED_KEYS.has(action.key))throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.action.key`);
    }else{
      throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.action unsupported type ${String(action.type)}`);
    }
    if(!Array.isArray(interaction.assertions)||interaction.assertions.length<1||interaction.assertions.length>MAX_ASSERTIONS)throw new Error(`INTERACTION_CONTRACT_INVALID ${label}.assertions`);
    interaction.assertions.forEach((assertion,assertionIndex)=>{
      const assertionLabel=`${label}.assertions[${assertionIndex}]`;
      assertPlainObject(assertion,assertionLabel);
      if(assertion.type==='exists'){
        assertExactKeys(assertion,['type','selector'],['type','selector'],assertionLabel);
        validateSelector(assertion.selector,`${assertionLabel}.selector`);
      }else if(assertion.type==='attributeEquals'||assertion.type==='attributeContains'){
        assertExactKeys(assertion,['type','selector','name','value'],['type','selector','name','value'],assertionLabel);
        validateSelector(assertion.selector,`${assertionLabel}.selector`);
        assertBoundedString(assertion.name,`${assertionLabel}.name`,{max:MAX_NAME_LENGTH});
        assertBoundedString(assertion.value,`${assertionLabel}.value`,{min:0,max:MAX_VALUE_LENGTH});
      }else if(assertion.type==='textContains'){
        assertExactKeys(assertion,['type','selector','value'],['type','selector','value'],assertionLabel);
        validateSelector(assertion.selector,`${assertionLabel}.selector`);
        assertBoundedString(assertion.value,`${assertionLabel}.value`,{max:MAX_VALUE_LENGTH});
      }else{
        throw new Error(`INTERACTION_CONTRACT_INVALID ${assertionLabel} unsupported type ${String(assertion.type)}`);
      }
    });
    return interaction;
  });
};

export const runDeclaredInteractions=async(page,interactions)=>{
  const declared=validateDeclaredInteractions(interactions);
  const results=[];
  for(const interaction of declared){
    const started=Date.now();
    try{
      const timeout=interaction.timeoutMs||5000;
      await page.waitForSelector(interaction.action.selector,{timeout});
      if(interaction.action.type==='click'){
        await page.click(interaction.action.selector);
      }else{
        await page.focus(interaction.action.selector);
        await page.keyboard.press(interaction.action.key);
      }
      await page.waitForFunction(assertions=>assertions.every(assertion=>{
        const element=document.querySelector(assertion.selector);
        if(assertion.type==='exists')return Boolean(element);
        if(!element)return false;
        if(assertion.type==='attributeEquals')return String(element.getAttribute(assertion.name)||'')===assertion.value;
        if(assertion.type==='attributeContains')return String(element.getAttribute(assertion.name)||'').includes(assertion.value);
        if(assertion.type==='textContains')return String(element.textContent||'').includes(assertion.value);
        return false;
      }),{timeout},interaction.assertions);
      results.push({name:interaction.name,action:interaction.action.type,ok:true,elapsedMs:Date.now()-started});
    }catch(error){
      results.push({name:interaction.name,action:interaction.action.type,ok:false,elapsedMs:Date.now()-started,error:String(error?.stack||error)});
    }
  }
  return results;
};


// Fixed post-entry qualification: genuine controls, immutable approved asset,
// and read-only renderer receipts. This never installs a product navigation hook.
const H_EARTH_SCENE_POLICY='H_EARTH_APPROVED_JACARANDA_SCENE_V1';
const H_EARTH_COLLECTION_POLICY='H_EARTH_APPROVED_TREE_COLLECTION_SCENE_V1';
const JACARANDA_SHA256='46b65326f75c29b1f076fdd161213a226bae3f519c92a3ac9d9a1972398b7189';
const JACARANDA_BYTES=33184612;
const COMPANION_IDS=['PROPOSED_OASIS_02','PROPOSED_OASIS_03','PROPOSED_OASIS_04'];
export const validateHEarthScenePolicy=(surfaceId,policy)=>{
  if(policy===undefined||policy===null)return null;
  if(surfaceId!=='h-earth'||![H_EARTH_SCENE_POLICY,H_EARTH_COLLECTION_POLICY].includes(policy))throw Error('H_EARTH_SCENE_POLICY_INVALID');
  return policy;
};
export const assessHEarthJacarandaScene=(resources,asset)=>{
  const j=resources?.jacaranda;
  const ids=resources?.oasisTrees?.placements?.map(p=>p.id)??[];
  const gaps=j?.placement?.gaps?.map(p=>p.id)??[];
  const conditions={
    exactFetchedAsset:asset?.status===200&&asset?.bytes===JACARANDA_BYTES&&asset?.sha256===JACARANDA_SHA256,
    approvedResource:j?.assetSha256===JACARANDA_SHA256&&j?.focusId==='PROPOSED_OASIS_01',
    readyWithoutFallback:j?.state==='READY'&&j?.ready===true&&j?.fallbackUsed===false,
    actualDraw:Number.isFinite(j?.drawCount)&&j.drawCount>0,
    geometry:j?.loadedGeometry?.triangles===454746&&j?.loadedGeometry?.vertices===651794&&j?.loadedGeometry?.assetLength===JACARANDA_BYTES,
    gpuResources:j?.textureCount===9&&j?.vertexArrayCount===3&&j?.programCount===1,
    threeCompanions:j?.threeCompanionsPreserved===true&&j?.placement?.companionsPreserved===true&&Number(resources?.oasisTrees?.drawCount)>0&&COMPANION_IDS.every(id=>ids.includes(id)&&gaps.includes(id))&&j.placement.gaps.every(g=>Number.isFinite(g.gapMeters)&&g.gapMeters>=0),
    existingEcology:['cavernUnderstory','cavernIvy','cavernPalms'].every(key=>Number(resources?.[key]?.drawCount)>0)&&['flower','fern','broadleaf'].every(kind=>resources?.cavernUnderstory?.placements?.some(p=>p.kind===kind)),
    cavernAndRiver:Number(resources?.geologicalFormation?.attachedMeshCount)>0&&resources?.geologicalFormation?.designedFreshwaterRendered===true,
    unchangedWorld:j?.originalHydratedWorldUnchanged===true&&j?.perFrameGeometryConstruction===false
  };
  return {pass:Object.values(conditions).every(Boolean),conditions,unmet:Object.keys(conditions).filter(key=>!conditions[key])};
};
export const observeHEarthSceneAsset=(page,surfaceId,policy)=>{
  if(!validateHEarthScenePolicy(surfaceId,policy))return null;
  const pending=[],responses=[];
  const listener=response=>{
    const url=new URL(response.url());
    if(url.pathname!=='/showroom/globe/h-earth/assets/jacaranda/Gratitude-Jacaranda-Candidate.glb'&&!(policy===H_EARTH_COLLECTION_POLICY&&url.pathname.startsWith('/showroom/globe/h-earth/assets/tree-collection/')&&url.pathname.endsWith('.glb')))return;
    // Buffer errors are recorded and rejected after navigation; no unhandled task.
    pending.push((async()=>{try{const bytes=await response.buffer();responses.push({url:response.url(),status:response.status(),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}catch(error){responses.push({url:response.url(),error:String(error.message)});}})());
  };
  page.on('response',listener);
  return {async finish(){await Promise.all(pending);page.off('response',listener);return responses;}};
};
// Navigation receipts are updated by native input independently of animation frames.
// Software rendering can delay RAF polling past the deadline despite real movement.
export const waitForHEarthNavigation=async(page,sequence)=>{
  const advanced=previous=>Number(window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt()?.currentNavigationState?.sequence)>previous;
  try{await page.waitForFunction(advanced,{timeout:15000,polling:100},sequence);}
  catch(error){
    if(error?.name!=='TimeoutError'||!await page.evaluate(advanced,sequence))throw error;
  }
};
// Serializable predicate shared by the live wait and post-release readback.
export const hasHEarthGoalProgress=({axis,target,tolerance,error,sequence,start})=>{
  const n=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt()?.currentNavigationState;
  const delta=(a,b)=>axis==='yawDegrees'?((a-b+540)%360)-180:a-b;
  const remaining=delta(target,n?.[axis]),progress=delta(n?.[axis],start);
  return n?.sequence>sequence&&Number.isFinite(remaining)&&Number.isFinite(progress)
    &&progress*Math.sign(error)>0
    &&(Math.abs(remaining)<=tolerance||Math.sign(remaining)!==Math.sign(error));
};
export const hasHEarthDirectionalProgress=({axis,error,sequence,start})=>{
  const n=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt()?.currentNavigationState;
  const progress=axis==='yawDegrees'?((n?.[axis]-start+540)%360)-180:n?.[axis]-start;
  return n?.sequence>sequence&&Number.isFinite(progress)&&progress*Math.sign(error)>.1;
};
export const createHEarthBudget=(milliseconds,now=Date.now)=>{
  const deadline=now()+milliseconds,timings=[];
  const remaining=()=>Math.max(0,deadline-now());
  const check=()=>{if(!remaining())throw Error('H_EARTH_SCENE_TIME_BUDGET_EXCEEDED');};
  const run=async(label,action,cap=Infinity)=>{
    check();const start=now();let timer;
    try{return await Promise.race([Promise.resolve().then(action),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('H_EARTH_OPERATION_DEADLINE:'+label)),Math.min(cap,remaining()));})]);}
    finally{clearTimeout(timer);timings.push({label,elapsedMs:now()-start});if(timings.length>300)timings.shift();}
  };
  return {check,run,remaining,timings};
};
export const closeHEarthBrowser=async(browser,timeoutMs=5000)=>{
  try{await createHEarthBudget(timeoutMs).run('browser.close',()=>browser.close());}
  catch(error){try{browser.process()?.kill('SIGKILL');}catch{}throw error;}
};
export const hasHEarthPresentedPose=({sequence,minimumFrame=0,minimumDraw=-1})=>{
  const r=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt();
  const f=r?.frameRecords?.at(-1);
  return Number.isFinite(f?.frameSequence)&&f.frameSequence>minimumFrame&&f.navigationSequence===sequence
    &&(minimumDraw<0||r?.resources?.jacaranda?.drawCount>minimumDraw);
};
export const pulseHEarthNavigation=async({page,read,box,bounded},dx,dy,goal)=>{
  bounded();const before=(await read()).navigation;
  const x=box.x+box.width*.5,y=box.y+box.height*.5;
  const args=goal?{...goal,sequence:before.sequence,start:before[goal.axis]}:null;
  await page.mouse.move(x,y);await page.mouse.down();
  let failure;
  try{
    await page.mouse.move(x+dx*box.width,y+dy*box.height);
    if(goal)await page.waitForFunction(hasHEarthGoalProgress,{timeout:12000,polling:50},args);
    else await waitForHEarthNavigation(page,before.sequence);
  }catch(error){failure=error;}
  finally{await page.mouse.up();}
  // Stop native input before inspecting the final receipt. Only an angular
  // timeout with verified movement in the requested direction can recover.
  if(failure){
    if(!goal||failure.name!=='TimeoutError'||!await page.evaluate(hasHEarthDirectionalProgress,args))throw failure;
  }
};
export const aimHEarthAxis=async({axis,target,tolerance,read,pulse,trace,now=Date.now,bounded=()=>{}})=>{
  const delta=value=>axis==='yawDegrees'?((target-value+540)%360)-180:target-value;
  let stalled=0,reversals=0,previousError=null,best=Infinity;
  for(let step=0;step<32;step++){
    const before=(await read()).navigation,error=delta(before[axis]);
    if(!Number.isFinite(error))throw Error('H_EARTH_AIM_INVALID_STATE:'+axis);
    if(Math.abs(error)<=tolerance)return;
    bounded();const stepStarted=now();
    const amplitude=axis==='yawDegrees'&&Math.abs(error)>20?.15:.061;
    // Aim at the requested heading; each hold remains time-bounded.
    // Progress at a hold deadline is reconciled after releasing native input.
    const increment=Math.sign(error)*Math.abs(error);
    const stepTarget=before[axis]+increment;
    await pulse(axis==='yawDegrees'?Math.sign(error)*amplitude:0,axis==='pitchDegrees'?-Math.sign(error)*amplitude:0,{axis,target:stepTarget,tolerance:.5,error:increment});
    const after=(await read()).navigation,nextError=delta(after[axis]);
    trace.push({axis,target,before:before[axis],after:after[axis],beforeSequence:before.sequence,afterSequence:after.sequence,error:nextError,elapsedMs:now()-stepStarted});
    if(trace.length>160)trace.shift();
    if(!Number.isFinite(nextError))throw Error('H_EARTH_AIM_INVALID_STATE:'+axis);
    if(Math.abs(nextError)<=tolerance)return;
    stalled=Math.abs(nextError)>=Math.abs(error)-.01?stalled+1:0;
    if(previousError!==null&&Math.sign(nextError)!==Math.sign(previousError))reversals++;
    if(Math.abs(nextError)<best-.1){best=Math.abs(nextError);reversals=0;}
    previousError=nextError;
    if(stalled>=3)throw Error('H_EARTH_AIM_NO_PROGRESS:'+axis);
    if(reversals>=4)throw Error('H_EARTH_AIM_OSCILLATION:'+axis);
  }
  throw Error('H_EARTH_AIM_STEP_LIMIT:'+axis);
};
export const travelHEarthScene=async({page,read,aim,bounded},tx,tz)=>{
    for(let i=0;i<40;i++){
      bounded();const n=(await read()).navigation,p=n.position,d=Math.hypot(tx-p.x,tz-p.z);
      if(d<3)return;
      await aim((Math.atan2(tx-p.x,p.z-tz)*180/Math.PI+360)%360);
      const before=(await read()).navigation;
      await page.mouse.wheel({deltaY:-70*Math.min(10,Math.max(1,d-1))});
      await waitForHEarthNavigation(page,before.sequence);
      const after=(await read()).navigation.position;
      if(Math.hypot(after.x-p.x,after.z-p.z)<=.1)throw Error('H_EARTH_SCENE_TRAVEL_BLOCKED');
    }
    throw Error('H_EARTH_SCENE_DESTINATION_NOT_REACHED');
  };
export const observeHEarthFailure=async(read)=>{
  try{return {observation:await read(),error:null};}
  catch(error){return {observation:null,error:String(error?.stack||error)};}
};
export const assessHEarthTreeCollection=(resources,assets,expected)=>{
  const c=resources?.treeCollection,entries=c?.entries??[];
  const conditions={
    exactPopulation:c?.replacementCount===7&&c?.additionalShrubCount===1&&entries.length===8&&entries.filter(e=>e.replaces).length===7,
    allApprovedResources:expected.every(a=>entries.some(e=>e.assetId===a.id&&e.assetSha256===a.sha256&&e.loadedGeometry?.assetLength===a.bytes&&e.loadedGeometry?.triangles===a.triangles&&e.loadedGeometry?.vertices===a.vertices&&e.vertexArrayCount===a.materials&&e.textureCount>=a.images&&e.programCount===1)),
    allDrawn:entries.length===8&&entries.every(e=>e.ready===true&&e.state==='READY'&&!e.fallbackUsed&&e.drawCount>0),
    sevenReplacementsActive:entries.filter(e=>e.replacementActive===true).length===7,
    exactFetchedFiles:expected.every(a=>assets.some(r=>r.status===200&&r.sha256===a.sha256&&r.bytes===a.bytes)),
    originalJacaranda:resources?.jacaranda?.ready===true&&resources.jacaranda.assetSha256===JACARANDA_SHA256&&resources.jacaranda.drawCount>0,
    existingEcology:['cavernUnderstory','cavernIvy','cavernPalms'].every(k=>resources?.[k]?.drawCount>0)&&resources?.geologicalFormation?.designedFreshwaterRendered===true,
    grounded:entries.length===8&&entries.every(e=>e.placement?.groundWitnesses?.length===5),
    noParkedAssets:c?.parkedAssetsIncluded===false
  };
  return {pass:Object.values(conditions).every(Boolean),conditions,unmet:Object.keys(conditions).filter(k=>!conditions[k]),gpuResourceBytes:entries.reduce((n,e)=>n+(e.gpuResourceBytes??0),resources?.jacaranda?.gpuResourceBytes??0)};
};
async function qualifyCollection({page,snapshot,read,pulse,aim,travel,capture,bounded,assetObserver,budget,views,check,started}){
  const {TREE_ASSETS,TREE_PLACEMENTS}=await import('../showroom/globe/h-earth/render/geometry-tree-collection.v1.js');
  const waitGroup=async(group)=>{
    const until=Date.now()+180000;
    while(true){
      bounded();const r=await snapshot(),rows=r.resources?.treeCollection?.entries?.filter(e=>e.group===group)??[];
      check(!rows.some(e=>e.state==='FALLBACK'),'TREE_COLLECTION_IMPORT_FAILED:'+JSON.stringify(rows.filter(e=>e.failure).map(e=>({id:e.id,failure:e.failure}))));
      if(rows.length&&rows.every(e=>e.ready&&e.drawCount>0))return;
      check(Date.now()<until,'TREE_COLLECTION_GROUP_LOAD_TIMEOUT:'+group);
      // Genuine look input presents completed uploads and starts the next queued asset.
      await pulse(.061,0);
    }
  };
  const lookAt=async(p,pitch=8)=>{const n=(await read()).navigation;await aim((Math.atan2(p.x-n.position.x,n.position.z-p.z)*180/Math.PI+360)%360,pitch);};
  await travel(-142,-244);await waitGroup('woodland');
  await lookAt({x:-143,z:-214},12);await capture('Approved woodland collection');
  for(const id of ['maple-large','maple-medium','jacaranda','wild-syringa']){
    const p=TREE_PLACEMENTS.find(p=>p.assetId===id);await lookAt(p,id==='wild-syringa'?2:12);await capture('Approved '+id);
  }
  await travel(-145,-280);await travel(-60,-310);await travel(40,-300);
  await waitGroup('oasis');
  await page.waitForFunction(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().resources.jacaranda?.ready,{timeout:Math.min(60000,budget.remaining())});
  await lookAt({x:55.5,z:-307.5},12);await capture('Original Jacaranda and river group');
  for(const id of ['coastal-01','coastal-02','coastal-03','searsia']){const p=TREE_PLACEMENTS.find(p=>p.assetId===id);await lookAt(p,3);await capture('Approved '+id);}
  await aim(160,2);await capture('Preserved river cavern flowers and palms');
  const assets=await budget.run('asset.finish',()=>assetObserver.finish()),final=await snapshot();
  const assessment=assessHEarthTreeCollection(final.resources,assets,TREE_ASSETS);
  check(assessment.pass,'TREE_COLLECTION_ASSERTION_FAILED:'+assessment.unmet.join(','));
  check(views.some(v=>v.resources?.singleOwnerVegetation?.drawCallCount>0),'TREE_COLLECTION_GRASS_DRAW_MISSING');
  return {schema:'H_EARTH_APPROVED_TREE_COLLECTION_OBSERVATION_v1',result:'RUNTIME_PASS_VISUAL_REVIEW_PENDING',assessment,assets,views,elapsedMs:Date.now()-started,physicalDeviceAcceptance:false,ownerPerceptualAcceptance:false,publicationAuthorized:false};
}

export const runHEarthSceneQualification=async(page,surfaceId,policy,assetObserver)=>{
  if(!validateHEarthScenePolicy(surfaceId,policy))return null;
  const started=Date.now(),budget=createHEarthBudget(600000),views=[],images=[],aimTrace=[];
  const rawPage=page;
  // Every scene browser call shares one deadline, including control RPCs.
  const wrap=(object,prefix)=>new Proxy(object,{get(target,key){const value=target[key];return typeof value==='function'?(...args)=>budget.run(prefix+'.'+String(key),()=>value.apply(target,args)):value;}});
  const mouse=wrap(page.mouse??{},'mouse');
  page=new Proxy(page,{get(target,key){if(key==='mouse')return mouse;if(key==='browser')return target.browser.bind(target);const value=target[key];return typeof value==='function'?(...args)=>budget.run('page.'+String(key),()=>value.apply(target,args)):value;}});
  const check=(condition,message)=>{if(!condition)throw Error(message);};
  const bounded=budget.check;
  const snapshot=()=>page.evaluate(()=>{
    const r=window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getReceipt();
    const all=r?.liveGpu?.resources;
    const resources=all?Object.fromEntries(['treeCollection','jacaranda','oasisTrees','cavernUnderstory','cavernIvy','cavernPalms','geologicalFormation','woodlandClearing','woodlandFineGrass','singleOwnerVegetation'].map(key=>[key,all[key]])):null;
    return {mode:r?.mode,navigation:r?.intake?.currentNavigationState,resources,frame:r?.liveGpu?.frameRecords?.at(-1),counters:r?.liveGpu?.counters,entered:window.H_EARTH_STARTUP_LOADER?.getReceipt()?.mode==='entered',ready:document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady==='true'};
  });
  const read=()=>page.evaluate(()=>({navigation:window.H_EARTH_RUN8E_PUBLIC_ROUTE.getIntakeReceipt().currentNavigationState}));
  const initial=await snapshot();
  check(initial.mode==='manual-public'&&initial.entered&&initial.ready,'H_EARTH_SCENE_REQUIRES_GENUINE_ENTRY');
  check(assetObserver,'H_EARTH_SCENE_ASSET_OBSERVER_REQUIRED');
  const canvas=await page.$('#h-earth-functional-landscape-canvas'),box=await budget.run('canvas.bounds',()=>canvas?.boundingBox());
  check(box&&box.width>=250&&box.height>=180,'H_EARTH_SCENE_CANVAS_UNAVAILABLE');
  const difference=(a,b)=>((a-b+540)%360)-180;
  const pulse=(dx,dy,goal)=>pulseHEarthNavigation({page,read,box,bounded},dx,dy,goal);
  const aim=async(yaw,pitch)=>{
    bounded();
    await aimHEarthAxis({axis:'yawDegrees',target:yaw,tolerance:6,read,pulse,trace:aimTrace,bounded});
    if(pitch!==undefined)await aimHEarthAxis({axis:'pitchDegrees',target:pitch,tolerance:2.2,read,pulse,trace:aimTrace,bounded});
  };
  const travel=(tx,tz)=>travelHEarthScene({page,read,aim,bounded},tx,tz);
  const capture=async(name,proof={})=>{
    bounded();
    const {navigation}=await read();
    await page.waitForFunction(hasHEarthPresentedPose,{timeout:Math.min(30000,budget.remaining()),polling:250},{sequence:navigation.sequence,...proof});
    const observation=await snapshot();
    check(observation.frame?.navigationSequence===navigation.sequence&&observation.navigation.sequence===navigation.sequence,'H_EARTH_CAPTURE_POSE_CHANGED');
    const bytes=Buffer.from(await page.screenshot({type:'png'}));
    check(bytes.length>0&&bytes.length<=8*1024*1024,'H_EARTH_SCENE_SCREENSHOT_SIZE_INVALID');
    images.push({name,bytes});views.push({name,...observation,distanceToJacarandaMeters:Math.hypot(observation.navigation.position.x-55.5,observation.navigation.position.z+307.5),screenshotSha256:createHash('sha256').update(bytes).digest('hex'),screenshotBytes:bytes.length});
  };
  let result;
  try{
    if(policy===H_EARTH_COLLECTION_POLICY){
      result=await qualifyCollection({page,snapshot,read,pulse,aim,travel,capture,bounded,assetObserver,budget,views,check,started});
    }else{
    await capture('Woodland entry');
    await travel(-145,-280);await travel(-60,-310);
    await aim(89,4);
    await page.waitForFunction(()=>['READY','FALLBACK'].includes(window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().resources.jacaranda?.state),{timeout:180000});
    check((await snapshot()).resources?.jacaranda?.state==='READY','H_EARTH_SCENE_JACARANDA_LOAD_FAILED');
    const farBefore=await snapshot();
    await pulse(.065,0);await aim(89,4);
    await page.waitForFunction(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().resources.jacaranda?.drawCount>0,{timeout:30000});
    await capture('River group distant context',{minimumFrame:farBefore.frame.frameSequence,minimumDraw:farBefore.resources.jacaranda.drawCount});
    await travel(40,-300);await aim(64,8);
    await page.waitForFunction(()=>['READY','FALLBACK'].includes(window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().resources.jacaranda?.state),{timeout:180000});
    check((await snapshot()).resources?.jacaranda?.state==='READY','H_EARTH_SCENE_JACARANDA_LOAD_FAILED');
    // Loading does not itself force a presentation. A real look pulse draws it.
    const nearBefore=await snapshot();
    await pulse(.065,0);await aim(64,8);
    await page.waitForFunction(()=>window.H_EARTH_RUN8E_PUBLIC_ROUTE.getLiveGpuReceipt().resources.jacaranda?.drawCount>0,{timeout:30000});
    await capture('Approved Jacaranda near',{minimumFrame:nearBefore.frame.frameSequence,minimumDraw:nearBefore.resources.jacaranda.drawCount});
    await aim(160,2);await capture('River cavern flowers and palms');
    const assets=await budget.run('asset.finish',()=>assetObserver.finish());
    const final=await snapshot(),assessment=assessHEarthJacarandaScene(final.resources,assets.find(a=>a.sha256===JACARANDA_SHA256));
    check(assessment.pass,'H_EARTH_SCENE_ASSERTION_FAILED:'+assessment.unmet.join(','));
    const near=views.find(v=>v.name==='Approved Jacaranda near'),far=views.find(v=>v.name==='River group distant context');
    check(views.some(v=>Number(v.resources?.singleOwnerVegetation?.drawCallCount)>0&&Number(v.resources?.singleOwnerVegetation?.installedRootCount)>0),'H_EARTH_SCENE_GRASS_DRAW_MISSING');
    check(near?.distanceToJacarandaMeters<25&&far?.distanceToJacarandaMeters>80&&far.distanceToJacarandaMeters<140&&[near,far].every(v=>v.resources?.jacaranda?.state==='READY'&&v.resources.jacaranda.drawCount>0),'H_EARTH_SCENE_NEAR_FAR_PROOF_MISSING');
    result={schema:'H_EARTH_APPROVED_JACARANDA_SCENE_OBSERVATION_v1',result:'RUNTIME_PASS_VISUAL_REVIEW_PENDING',assessment,assets,views,elapsedMs:Date.now()-started,physicalDeviceAcceptance:false,ownerPerceptualAcceptance:false,publicationAuthorized:false};
    }
  }catch(error){
    const recovery=createHEarthBudget(10000);
    try{await recovery.run('failure.release',()=>rawPage.mouse.up(),2000);}catch{}
    const failureObservation=await observeHEarthFailure(()=>recovery.run('failure.read',()=>rawPage.evaluate(()=>({navigation:window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getIntakeReceipt()?.currentNavigationState,jacaranda:window.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt()?.resources?.jacaranda})))) ;
    console.error('H_EARTH_SCENE_FAILURE_STATE '+JSON.stringify({failureObservation,aimTrace,timings:budget.timings}));
    result={schema:'H_EARTH_APPROVED_JACARANDA_SCENE_OBSERVATION_v1',result:'FAIL',failure:String(error.stack||error),failureObservation,aimTrace,views,elapsedMs:Date.now()-started,physicalDeviceAcceptance:false,publicationAuthorized:false};
  }
  // Reuse the existing uploaded PNG artifact: labeled unaltered scene captures
  // are assembled in a separate evidence document, never in the product page.
  try{if(images.length&&budget.remaining()>0){
    const directory=process.env.RUNNER_TEMP;
    check(directory,'H_EARTH_SCENE_RUNNER_TEMP_REQUIRED');
    const rawSheet=await budget.run('evidence.page',()=>page.browser().newPage()),sheet=wrap(rawSheet,'evidence');
    try{
      await sheet.setViewport({width:1280,height:images.length*836,deviceScaleFactor:1});
      await sheet.setContent('<html><body style="margin:0;background:#111;color:white;font:20px sans-serif">'+images.map(({name,bytes})=>'<section style="height:836px;display:flex;flex-direction:column;align-items:center"><div style="height:36px">'+name+'</div><img style="height:800px;max-width:1280px;object-fit:contain" src="data:image/png;base64,'+bytes.toString('base64')+'"></section>').join('')+'</body></html>');
      await sheet.waitForFunction(()=>Array.from(document.images).every(image=>image.complete&&image.naturalWidth>0),{timeout:15000});
      const output=`${directory}/publication-preflight-screenshot.png`;
      await sheet.screenshot({path:output,fullPage:true});
      result.screenshotEvidence={file:'publication-preflight-screenshot.png',bytes:fs.statSync(output).size,sha256:createHash('sha256').update(fs.readFileSync(output)).digest('hex'),kind:'LABELED_ACTUAL_VIEW_CONTACT_SHEET'};
    }finally{try{await createHEarthBudget(2000).run('evidence.close',()=>rawSheet.close());}catch{}}
  }}catch(error){result.result='FAIL';result.evidenceError=String(error.stack||error);}
  if(result.result!=='FAIL'&&!result.screenshotEvidence){result.result='FAIL';result.evidenceError='SCREENSHOT_EVIDENCE_MISSING';}
  result.timings=budget.timings;
  return result;
};

const H_EARTH_PRE_ENTRY_POLICY='H_EARTH_CONTROL_TEST_ENTER_V1';
export const validateHEarthPreEntryPolicy=(surfaceId,policy)=>{
  if(policy===undefined||policy===null)return null;
  if(surfaceId!=='h-earth'||policy!==H_EARTH_PRE_ENTRY_POLICY)throw Error('H_EARTH_PRE_ENTRY_POLICY_INVALID');
  return policy;
};
export const assessHEarthInputReadiness=signals=>{
  // These are independent observations of the existing user-facing entry contract.
  const conditions={
    loadingScreenReady:signals?.mode==='ready',
    enterButtonEnabled:signals?.disabled===false,
    cameraInputRecorded:signals?.inputChanged===true,
    changedCameraFrameRendered:signals?.inputRendered===true,
    animationFrameOpportunityObserved:signals?.nextFrame===true,
    gpuFramebufferPresented:Number.isFinite(signals?.gpuFrames)&&signals.gpuFrames>0
  };
  const unmet=Object.keys(conditions).filter(key=>!conditions[key]);
  return {schema:'H_EARTH_INPUT_READINESS_CONDITIONS_v1',pass:unmet.length===0,conditions,unmet};
};
export const observeHEarthInputReadiness=async page=>page.evaluate(()=>{
  const root=document.querySelector('#h-earth-functional-landscape-route');
  const shell=document.querySelector('#h-earth-loading-screen');
  const button=shell?.querySelector('[data-enter]');
  const input=globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.();
  const gpu=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.();
  return {
    mode:shell?.dataset.mode??null,disabled:button?.disabled??null,
    inputChanged:Number.isFinite(input?.firstInputCameraChangeMilliseconds),
    inputRendered:Number.isFinite(input?.firstInputPoseRenderedMilliseconds),
    nextFrame:Number.isFinite(input?.nextAnimationFrameOpportunityMilliseconds),
    gpuFrames:Number(gpu?.counters?.gpuFramebufferPresentationCount)||0,
    rootPrototype:root?.dataset.singleOwnerPrototype??null,
    rootReady:root?.dataset.run8eReady??null,
    rootError:root?.dataset.run8eError??null,
    loaderReceiptMode:input?.mode??null,
    controlsEnabled:Number.isFinite(input?.controlsEnabledMilliseconds),
    inputPoseSequence:input?.firstInputPose?.navigationSequence??null,
    renderedPoseSequence:input?.renderedInputPose?.navigationSequence??null,
    gpuReceiptPresent:Boolean(gpu)
  };
});
export const runHEarthPreEntry=async(page,surfaceId,policy,timeoutMs=120000)=>{
  if(!validateHEarthPreEntryPolicy(surfaceId,policy))return null;
  // Follow the user-facing control test. Never set readiness attributes or invoke entry callbacks directly.
  await page.waitForFunction(()=>{
    const root=document.querySelector('#h-earth-functional-landscape-route');
    const shell=document.querySelector('#h-earth-loading-screen');
    const button=shell?.querySelector('[data-enter]');
    return root?.dataset.singleOwnerPrototype==='controls-test'&&root.dataset.run8eReady==='false'&&shell?.dataset.mode==='test'&&button?.disabled===true;
  },{timeout:timeoutMs});
  const before=await page.evaluate(()=>({
    mode:document.querySelector('#h-earth-loading-screen')?.dataset.mode??null,
    ready:document.querySelector('#h-earth-functional-landscape-route')?.dataset.run8eReady??null
  }));
  if(before.mode!=='test'||before.ready!=='false')throw Error('H_EARTH_PRE_ENTRY_STATE_INVALID');
  const canvas=await page.$('#h-earth-functional-landscape-canvas');
  const bounds=await canvas?.boundingBox();
  if(!bounds||bounds.width<250||bounds.height<180)throw Error('H_EARTH_INPUT_CANVAS_UNAVAILABLE');
  const x=bounds.x+bounds.width*.42,y=bounds.y+bounds.height*.42;
  await page.mouse.move(x,y);
  await page.mouse.down();
  try{await page.mouse.move(x+Math.min(bounds.width*.17,130),y+16,{steps:14});}
  finally{await page.mouse.up();}
  await page.mouse.wheel({deltaY:-360});
  try{
    await page.waitForFunction(()=>{
      const shell=document.querySelector('#h-earth-loading-screen'),button=shell?.querySelector('[data-enter]');
      const input=globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.();
      const gpu=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.();
      return shell?.dataset.mode==='ready'&&button?.disabled===false&&
        Number.isFinite(input?.firstInputCameraChangeMilliseconds)&&
        Number.isFinite(input?.firstInputPoseRenderedMilliseconds)&&
        Number.isFinite(input?.nextAnimationFrameOpportunityMilliseconds)&&
        Number(gpu?.counters?.gpuFramebufferPresentationCount)>0;
    },{timeout:16000});
  }catch(error){
    // Report each predicate separately. Never change production state or fake readiness.
    let observed=null,inspectionError=null;
    try{observed=await observeHEarthInputReadiness(page);}
    catch(e){inspectionError=String(e?.message||e);}
    const assessment=assessHEarthInputReadiness(observed);
    const authenticPreEntryState=observed?.rootPrototype==='controls-test'&&
      observed?.rootReady==='false'&&observed?.loaderReceiptMode==='ready'&&
      observed?.gpuReceiptPresent===true&&observed?.rootError!=='true';
    const detail={...assessment,observed,inspectionError,
      authenticPreEntryState,phase:'AFTER_NATIVE_POINTER_AND_WHEEL'};
    if(assessment.pass&&authenticPreEntryState){
      // Chromium may report its 16-second polling deadline while the genuine
      // renderer/input signals have become true. A fresh complete readback is
      // valid evidence; the real user-facing Enter and post-click gates remain.
      console.log('H_EARTH_PRE_ENTRY_DEADLINE_READBACK_PASS '+JSON.stringify(detail));
    }else{
      console.error('H_EARTH_PRE_ENTRY_SIGNAL_DIAGNOSTIC '+JSON.stringify(detail));
      throw new Error('H_EARTH_INPUT_GATE_TIMEOUT:'+(
        assessment.unmet.join(',')||'AUTHENTIC_PRE_ENTRY_STATE_NOT_OBSERVED'
      ),{cause:error});
    }
  }
  const observed=await page.evaluate(()=>{
    const shell=document.querySelector('#h-earth-loading-screen'),button=shell?.querySelector('[data-enter]');
    const input=globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.();
    const gpu=globalThis.H_EARTH_RUN8E_PUBLIC_ROUTE?.getLiveGpuReceipt?.();
    return {
      mode:shell?.dataset.mode??null,disabled:button?.disabled??true,
      inputChanged:Number.isFinite(input?.firstInputCameraChangeMilliseconds),
      inputRendered:Number.isFinite(input?.firstInputPoseRenderedMilliseconds),
      nextFrame:Number.isFinite(input?.nextAnimationFrameOpportunityMilliseconds),
      gpuFrames:Number(gpu?.counters?.gpuFramebufferPresentationCount)||0
    };
  });
  if(observed.mode!=='ready'||observed.disabled||!observed.inputChanged||!observed.inputRendered||!observed.nextFrame||observed.gpuFrames<1)
    throw Error('H_EARTH_INPUT_FRAME_NOT_VERIFIED');
  await page.click('#h-earth-loading-screen [data-enter]');
  await page.waitForFunction(()=>{
    const root=document.querySelector('#h-earth-functional-landscape-route');
    const shell=document.querySelector('#h-earth-loading-screen');
    return root?.dataset.run8eReady==='true'&&root.dataset.singleOwnerPrototype==='manual-ready'&&globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.()?.mode==='entered'&&shell?.hidden===true;
  },{timeout:12000});
  const after=await page.evaluate(()=>{
    const root=document.querySelector('#h-earth-functional-landscape-route');
    const shell=document.querySelector('#h-earth-loading-screen');
    return {ready:root?.dataset.run8eReady??null,mode:globalThis.H_EARTH_STARTUP_LOADER?.getReceipt?.()?.mode??null,overlayMode:shell?.dataset.mode??null,hidden:shell?.hidden??false};
  });
  if(after.ready!=='true'||after.mode!=='entered'||!after.hidden)throw Error('H_EARTH_ENTER_CALLBACK_NOT_OBSERVED');
  return {schema:'H_EARTH_NATIVE_INPUT_CONFIRMED_ENTRY_v1',result:'PASS',
    method:'REAL_POINTER_DRAG_WHEEL_AND_ENABLED_ENTER_CLICK',
    changedCameraInput:true,renderedChangedView:true,nextFrameObserved:true,
    gpuFramebufferPresentationCount:observed.gpuFrames,entered:true};
};

export const verifyTrophyPredicate=async(page,spec)=>{
  if(spec?.trophyPredicate?.enabled!==true)return null;
  const predicate=spec.trophyPredicate;
  return page.evaluate(predicate=>{
    const field=document.querySelector(predicate.fieldSelector||'[data-award-trophy]');
    const canvas=document.querySelector(predicate.canvasSelector||'[data-award-trophy] canvas');
    const fallback=document.querySelector(predicate.fallbackSelector||'[data-award-trophy] .compass-trophy-fallback');
    let inspect=null;
    try{inspect=window.CompassTrophyScene?.inspect?.()||null;}catch{}
    const renderer=canvas?.dataset?.trophyRenderer||null;
    const frames=Number(canvas?.dataset?.trophyFrames||0);
    const style=canvas?getComputedStyle(canvas):null;
    const rect=canvas?.getBoundingClientRect?.()||null;
    const visible=Boolean(canvas&&!canvas.hidden&&style?.display!=='none'&&style?.visibility!=='hidden'&&rect&&rect.width>0&&rect.height>0);
    const fallbackFalse=Boolean(inspect&&inspect.fallback===false&&!field?.classList?.contains('is-fallback')&&(!fallback||fallback.hidden||getComputedStyle(fallback).display==='none'));
    let nonblank=false;
    let nonblankSampleCount=0;
    try{
      const gl=canvas?.getContext?.('webgl');
      if(gl&&canvas.width>0&&canvas.height>0){
        const pixels=new Uint8Array(canvas.width*canvas.height*4);
        gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
        for(let i=0;i<pixels.length;i+=4){
          if(pixels[i]||pixels[i+1]||pixels[i+2]||pixels[i+3]){nonblankSampleCount++;if(nonblankSampleCount>=8){nonblank=true;break;}}
        }
      }
    }catch{}
    const checks={
      fieldPresent:Boolean(field),
      canvasPresent:Boolean(canvas),
      rendererApproved:renderer===predicate.approvedRenderer,
      frameCount:frames>=Number(predicate.minFrames||1),
      visible:predicate.requireVisible===false?true:visible,
      fallbackFalse:predicate.requireFallbackFalse===false?true:fallbackFalse,
      nonblank:predicate.requireNonblank===false?true:nonblank
    };
    return {ok:Object.values(checks).every(Boolean),renderer,frames,visible,fallbackFalse,nonblank,nonblankSampleCount,inspect,checks};
  },predicate);
};

export const main=async()=>{
  const mode=process.argv[2];
  const pageUrl=(process.argv[3]||'').replace(/\/$/,'');
  const manifestPath=process.argv[4];

  if(!['static','runtime'].includes(mode)||!pageUrl||!manifestPath){
    console.error('usage: node tools/publication-live-verify.mjs <static|runtime> <page-url> <manifest-path>');
    process.exitCode=2;
    return;
  }

  const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

  if(mode==='static'){
    for(const check of manifest.checks||[]){
      const url=pageUrl+check.path;
      const response=await fetch(url,{redirect:'follow'});
      if(!response.ok)throw new Error(`FETCH_FAILED ${url} ${response.status}`);
      const body=await response.text();
      for(const token of check.includes||[]){
        if(!body.includes(token))throw new Error(`MISSING_TOKEN ${url} ${token}`);
      }
      for(const token of check.excludes||[]){
        if(body.includes(token))throw new Error(`FORBIDDEN_TOKEN ${url} ${token}`);
      }
    }
    console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_STATIC_RECEIPT_v1',surfaceId:manifest.surfaceId,result:'PASS'},null,2));
    return;
  }

  if(manifest.runtime?.enabled!==true){
    console.log(JSON.stringify({schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',surfaceId:manifest.surfaceId,result:'SKIPPED_NOT_DECLARED'},null,2));
    return;
  }

  validateDeclaredInteractions(manifest.runtime.interactions);
  validateHEarthPreEntryPolicy(manifest.surfaceId,manifest.runtime.preReadyEntry);
  validateHEarthScenePolicy(manifest.surfaceId,manifest.runtime.sceneQualification);

  const {default:puppeteer}=await import('puppeteer-core');
  const executablePath=process.env.CHROME_PATH;
  if(!executablePath)throw new Error('CHROME_PATH is required for runtime verification');
  const spec=manifest.runtime;
  const browser=await launchSurfaceBrowser({puppeteer,executablePath,surfaceId:manifest.surfaceId,scenePolicy:spec.sceneQualification});
  try{
    const page=await browser.newPage();
    await page.setViewport([H_EARTH_SCENE_POLICY,H_EARTH_COLLECTION_POLICY].includes(spec.sceneQualification)
      ? {width:1280,height:800,deviceScaleFactor:1}
      : spec.captureScreenshot===true
      ? {width:1440,height:2200,deviceScaleFactor:1}
      : {width:720,height:1280,deviceScaleFactor:1});
    const pageErrors=[];
    const consoleErrors=[];
    const evidenceInteractions=[];
    let declaredInteractions=[];
    let preReadyEntryReceipt=null;
    let trophyPredicate=null;
    let sceneQualification=null;
    const sceneAssetObserver=observeHEarthSceneAsset(page,manifest.surfaceId,spec.sceneQualification);
    page.on('pageerror',error=>pageErrors.push(String(error?.stack||error)));
    page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
    page.on('response',response=>{
      const status=response.status();
      if(status<400)return;
      const request=response.request();
      console.error(`PUBLICATION_RUNTIME_HTTP_ERROR status=${status} method=${request.method()} resourceType=${request.resourceType()} url=${response.url()}`);
    });
    const url=pageUrl+spec.path;
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});

    const verifyEvidenceCarousel=async phase=>{
      if(manifest.surfaceId!=='evidence'||spec.requireEvidenceCarouselInteraction!==true)return;
      try{
        await page.waitForFunction(()=>Boolean(document.querySelector('[data-carousel]')?.dataset.activeId),{timeout:10000});
        const before=await page.$eval('[data-carousel]',el=>el.dataset.activeId||'');
        const target=before==='orientation'?1:0;
        await page.click(`[data-tabs] [data-index="${target}"]`);
        await page.waitForFunction(previous=>{
          const current=document.querySelector('[data-carousel]')?.dataset.activeId||'';
          return Boolean(current&&current!==previous);
        },{timeout:5000},before);
        const after=await page.$eval('[data-carousel]',el=>el.dataset.activeId||'');
        evidenceInteractions.push({phase,before,after,ok:Boolean(after&&after!==before)});
      }catch(error){
        evidenceInteractions.push({phase,ok:false,error:String(error?.stack||error)});
      }
    };

    await verifyEvidenceCarousel('BEFORE_CONDITION_TERMINAL');

    const captureRuntimeDiagnostic=async failure=>page.evaluate(({spec,surfaceId,failure})=>{
      const serializeError=value=>{
        if(!value)return null;
        if(typeof value==='string')return {message:value};
        return {name:value.name||null,message:value.message||String(value),stack:value.stack||null};
      };
      const loader=document.querySelector('[data-audralia-loader]');
      const base={
        title:document.title,
        href:location.href,
        readyState:document.readyState,
        readySelector:spec.readySelector||null,
        readySelectorPresent:spec.readySelector?Boolean(document.querySelector(spec.readySelector)):null,
        readyAttribute:spec.readyAttribute||null,
        currentPublicCondition:document.querySelector('[data-condition-state]')?.textContent?.trim()||null,
        carouselActiveId:document.querySelector('[data-carousel]')?.dataset.activeId||null,
        failure
      };
      if(surfaceId!=='audralia')return base;
      let reconciliationRuntime=null;
      let reconciliationRuntimeError=null;
      try{reconciliationRuntime=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()||null;}catch(error){reconciliationRuntimeError=serializeError(error);}
      return {
        ...base,
        audralia:{
          loader:loader?{className:loader.className,dataset:{...loader.dataset},stage:document.querySelector('[data-audralia-loader-stage]')?.textContent?.trim()||null,progress:document.querySelector('[data-audralia-loader-progress]')?.textContent?.trim()||null,elapsed:document.querySelector('[data-audralia-loader-elapsed]')?.textContent?.trim()||null}:null,
          startupDiagnostic:window.__AUDRALIA_STARTUP_DIAGNOSTIC__||null,
          startupPhase:window.__AUDRALIA_STARTUP_PHASE__||null,
          reconciliationError:serializeError(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__),
          reconciliationRuntime:reconciliationRuntime?{invariants:reconciliationRuntime.invariants||null,status:reconciliationRuntime.status||null,state:reconciliationRuntime.state||null}:null,
          reconciliationRuntimeError,
          milestones:{renderer:Boolean(window.__H_EARTH_AUDRALIA_OPEN_WORLD_OW01_PREVIEW__?.renderer),clearAtmosphere:Boolean(document.querySelector('[data-audralia-clear-atmosphere="true"]')),orbitalCloud:Boolean(globalThis.__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__),regionalWeather:Boolean(document.querySelector('[data-audralia-exterior-weather="true"]')),localContinuity:Boolean(document.querySelector('[data-canonical-weather-projection="true"]'))}
        }
      };
    },{spec,surfaceId:manifest.surfaceId,failure:String(failure?.stack||failure)});

    try{
      preReadyEntryReceipt=await runHEarthPreEntry(page,manifest.surfaceId,spec.preReadyEntry,spec.timeoutMs||120000);
      if(spec.readySelector)await page.waitForSelector(spec.readySelector,{timeout:spec.timeoutMs||45000});
      if(spec.readyAttribute){
        await page.waitForFunction(({selector,name,contains})=>{
          const element=document.querySelector(selector);
          if(!element)return false;
          return String(element.getAttribute(name)||'').includes(contains);
        },{timeout:spec.timeoutMs||45000},spec.readyAttribute);
      }
    }catch(error){
      let diagnostic=null;
      try{diagnostic=await captureRuntimeDiagnostic(error);}catch(diagnosticError){diagnostic={captureError:String(diagnosticError?.stack||diagnosticError)};}
      console.error(JSON.stringify({schema:'PUBLICATION_SURFACE_RUNTIME_DIAGNOSTIC_v1',surfaceId:manifest.surfaceId,url,result:'FAIL',phase:spec.preReadyEntry&&preReadyEntryReceipt===null?'PRE_READY_ENTRY':'READINESS_WAIT',failure:String(error?.stack||error),diagnostics:{pageErrors,consoleErrors,evidenceInteractions,declaredInteractions,failures:['RUNTIME_READINESS_FAILED']},diagnostic},null,2));
      throw error;
    }

    await verifyEvidenceCarousel('AFTER_CONDITION_TERMINAL');
    declaredInteractions=await runDeclaredInteractions(page,spec.interactions);
    trophyPredicate=await verifyTrophyPredicate(page,spec);
    sceneQualification=await runHEarthSceneQualification(page,manifest.surfaceId,spec.sceneQualification,sceneAssetObserver);

    const binding=spec.binding||{mode:'direct-document'};
    const result=await page.evaluate(({spec,binding})=>{
      const currentUrl=new URL(location.href);
      const normalized=value=>{const path=String(value||'/').replace(/\/+$/,'')||'/';return path.startsWith('/')?path:`/${path}`;};
      const expectedPath=normalized(binding.path||spec.path);
      let bindingResult={mode:binding.mode||'direct-document',expectedPath,ok:false};
      if(bindingResult.mode==='direct-document'){
        bindingResult={...bindingResult,observedPath:normalized(currentUrl.pathname),ok:normalized(currentUrl.pathname)===expectedPath};
      }else if(bindingResult.mode==='iframe'){
        const selector=binding.selector||'iframe';
        const frame=document.querySelector(selector);
        const rawSrc=frame?.getAttribute('src')||'';
        let observedPath='';
        try{observedPath=rawSrc?normalized(new URL(rawSrc,currentUrl.href).pathname):'';}catch{}
        bindingResult={...bindingResult,selector,rawSrc,observedPath,ok:Boolean(frame&&rawSrc&&observedPath===expectedPath)};
      }else{
        bindingResult={...bindingResult,error:'UNSUPPORTED_BINDING_MODE'};
      }
      return {
        title:document.title,
        finalUrl:currentUrl.href,
        readySelector:spec.readySelector?Boolean(document.querySelector(spec.readySelector)):null,
        attributeValue:spec.readyAttribute?document.querySelector(spec.readyAttribute.selector)?.getAttribute(spec.readyAttribute.name)||null:null,
        currentPublicCondition:document.querySelector('[data-condition-state]')?.textContent?.trim()||null,
        carouselActiveId:document.querySelector('[data-carousel]')?.dataset.activeId||null,
        binding:bindingResult
      };
    },{spec,binding});

    const ignoreTokens=spec.ignoreConsoleErrorIncludes||[];
    const ignoredConsoleErrors=consoleErrors.filter(error=>ignoreTokens.some(token=>error.includes(token)));
    const actionableConsoleErrors=consoleErrors.filter(error=>!ignoreTokens.some(token=>error.includes(token)));
    const failures=[];
    if(sceneQualification&&sceneQualification.result!=='RUNTIME_PASS_VISUAL_REVIEW_PENDING')failures.push('H_EARTH_SCENE_QUALIFICATION_FAILED');
    if(!result.binding.ok)failures.push('RUNTIME_PUBLICATION_BINDING_FAILED');
    if(spec.failOnPageErrors!==false&&pageErrors.length)failures.push('PAGE_ERROR');
    if(spec.failOnConsoleErrors!==false&&actionableConsoleErrors.length)failures.push('CONSOLE_ERROR');
    if(spec.requireEvidenceCarouselInteraction===true&&evidenceInteractions.some(x=>!x.ok))failures.push('EVIDENCE_CAROUSEL_INTERACTION_FAILED');
    if(declaredInteractions.some(x=>!x.ok))failures.push('DECLARED_INTERACTION_FAILED');
    if(spec.trophyPredicate?.enabled===true&&trophyPredicate?.ok!==true)failures.push('TROPHY_RUNTIME_PREDICATE_FAILED');
    if(manifest.surfaceId==='evidence'&&result.currentPublicCondition==='CHECKING')failures.push('EVIDENCE_CONDITION_NOT_TERMINAL');

    // Opt-in read-only visual evidence uses the existing preflight artifact path.
    // No caller-selected file path or change to existing surface defaults.
    let screenshotEvidence=sceneQualification?.screenshotEvidence??null;
    if(spec.captureScreenshot===true&&!sceneQualification&&failures.length===0){
      const directory=process.env.RUNNER_TEMP;
      if(!directory)throw new Error('SCREENSHOT_RUNNER_TEMP_REQUIRED');
      const output=`${directory}/publication-preflight-screenshot.png`;
      await page.screenshot({path:output,fullPage:true});
      if(fs.statSync(output).size===0)throw new Error('SCREENSHOT_EVIDENCE_EMPTY');
      screenshotEvidence={file:'publication-preflight-screenshot.png',bytes:fs.statSync(output).size};
    }
    const receipt={schema:'PUBLICATION_SURFACE_RUNTIME_RECEIPT_v1',surfaceId:manifest.surfaceId,url,result:failures.length?'FAIL':'PASS',runtime:{...result,trophyPredicate,preReadyEntryReceipt,sceneQualification},diagnostics:{pageErrors,consoleErrors,ignoredConsoleErrors,actionableConsoleErrors,evidenceInteractions,declaredInteractions,failures},...(screenshotEvidence?{screenshotEvidence}:{})};
    console.log(JSON.stringify(receipt,null,2));
    if(failures.length)process.exitCode=1;
  }finally{
    if(manifest.surfaceId==='h-earth')await closeHEarthBrowser(browser);
    else await browser.close();
  }
};

const isMain=Boolean(process.argv[1])&&import.meta.url===pathToFileURL(process.argv[1]).href;
if(isMain)await main();
