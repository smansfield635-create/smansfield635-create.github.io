#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';

const OPERATION_ID='COMPASS_EXPERIENCE_CONSOLIDATION_SUCCESSOR_20260818_v1';
const LOCK_GENERATION=1552;
const GOVERNING_HEAD='cfd1924c485893dedeeb2fd1fefcb91c521d7c2a';
const output=process.env.COMPASS_EXPERIENCE_OUTPUT||'/tmp/compass-experience-consolidation-receipt.json';
const captureInput=process.env.COMPASS_EXPERIENCE_CAPTURE_INPUT||'/tmp/compass-experience-capture-receipt.json';
const amendmentPath='.github/ai-router/projects/compass/experience-consolidation-amendment.v1.json';
const candidateHead=process.env.COMPASS_CANDIDATE_HEAD||cp.execFileSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}).trim();

const productEnvelope=new Set(['index.html','assets/compass/compass.css','assets/compass/compass.statement-carousel.css','assets/compass/compass.capability-carousel.css','assets/compass/compass.identity-3d.css']);
const qualificationEnvelope=new Set([amendmentPath,'.github/ai-router/projects/compass/verify-experience-consolidation.v1.mjs','.github/workflows/compass-display-continuity-validation.yml','.github/ai-router/projects/compass/entrypoint.v1.json','.github/ai-router/router.v1.json']);
const protectedRuntime=['assets/compass/compass.controller.js','assets/compass/compass.crystals.js','assets/compass/compass.cosmos.js','assets/compass/compass.mirrorland-window.js','assets/compass/compass.laws-spacecraft.js','assets/compass/compass.identity-3d.js','assets/compass/compass.statement-carousel.js','assets/compass/compass.capability-carousel.js','assets/compass/compass.brain.js','assets/compass/compass.brain-scene.js'];
const hardZeroNames=['visualSystemCoherence','narrativeContinuity','interactionLegibility','responsiveRecomposition','evidenceHierarchy','categoryPreservation','visibleGeometryIntegrity','traversalContinuity'];
const requiredViewports={desktop:[1440,1000],tablet:[1024,1366],phone:[390,844]};
const requiredDesktopBeats=['opening','compass-constellation','mirrorland-threshold','selected-room','brain','trophy','house','purpose-engagement','readiness-evidence','conclusion'];
const requiredPhoneBeats=['compass-constellation','dimensional-capability','readiness-evidence','conclusion'];
const requiredReduced={desktop:['opening','compass','dimensional-capability','conclusion'],phone:['opening','compass','conclusion']};

const failures=[];const checks={};
const check=(id,pass,evidence=null)=>{checks[id]={pass:Boolean(pass),evidence};if(!pass)failures.push(id)};
const read=p=>fs.readFileSync(p,'utf8');

let amendment=null;try{amendment=JSON.parse(read(amendmentPath));}catch{failures.push('AMENDMENT_READ_FAILURE')}
check('AMENDMENT_BOUND',Boolean(amendment)&&amendment.operationId===OPERATION_ID&&amendment.lockGeneration===LOCK_GENERATION&&amendment.governingHead===GOVERNING_HEAD,amendment&&{operationId:amendment.operationId,lockGeneration:amendment.lockGeneration,governingHead:amendment.governingHead});
check('ACCEPTANCE_IS_CONJUNCTIVE',amendment?.acceptance==='ENGINEERING_PASS_AND_EXPERIENCE_PASS',amendment?.acceptance);
check('CONSTRUCTION_ORDER_SUBTRACTION_FIRST',Array.isArray(amendment?.constructionOrder)&&amendment.constructionOrder.join('>')==='INVENTORY>PRESERVE>REMOVE>DEMOTE>MERGE>DISSOLVE>RECOMPOSE>ADD_ONLY_IF_NECESSARY',amendment?.constructionOrder);

let changed=[];try{changed=cp.execFileSync('git',['diff','--name-only',`${GOVERNING_HEAD}...HEAD`],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}catch{failures.push('DIFF_READ_FAILURE')}
const allowed=new Set([...productEnvelope,...qualificationEnvelope]);
check('EXACT_MUTATION_ENVELOPE',changed.every(p=>allowed.has(p)),changed);
check('PROTECTED_RUNTIME_PATHS_UNCHANGED',protectedRuntime.every(p=>!changed.includes(p)),changed.filter(p=>protectedRuntime.includes(p)));
check('PRODUCT_MUTATION_PRESENT',changed.some(p=>productEnvelope.has(p)),changed.filter(p=>productEnvelope.has(p)));

const consolidationCss=fs.existsSync('assets/compass/compass.statement-carousel.css')?read('assets/compass/compass.statement-carousel.css'):'';
const cssSignals={
 glassIntroductionDissolved:/\.compass-introduction__body[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 compassPanelDissolved:/\.compass-panel\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 statementStageDissolved:/\.compass-statement-orbit\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 capabilityCardsDissolved:/\.compass-monument\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 dimensionalPlaqueDissolved:/\.compass-orbit-plaque\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 proofStageDissolved:/\.compass-built\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 proofCardsDissolved:/\.compass-proof-card\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss)||/\.compass-built__active-proof,\[data-compass-root\] \.compass-proof-card\{[^}]*border:0!important[^}]*background:none!important[^}]*box-shadow:none!important/s.test(consolidationCss),
 ctaDissolved:/\.compass-build-cta a\{[^}]*border:0!important[^}]*background:none!important/s.test(consolidationCss),
 openingFloorRemoved:/\.compass-estate__header\{[^}]*min-height:auto!important[^}]*height:auto!important/s.test(consolidationCss),
 tabletRecomposition:/@media\(max-width:(?:10(?:2[4-9]|[3-9]\d)|11\d\d)px\)/.test(consolidationCss)&&/\.compass-panel\{grid-template-columns:1fr!important/.test(consolidationCss),
 phoneRecomposition:/@media\(max-width:560px\)/.test(consolidationCss)&&/\.compass-capability-choices\{grid-template-columns:1fr!important/.test(consolidationCss),
 reducedMotion:/@media\(prefers-reduced-motion:reduce\)/.test(consolidationCss)
};
check('VISIBLE_MECHANISM_REDUCTION_STATIC',Object.entries(cssSignals).filter(([k])=>!['tabletRecomposition','phoneRecomposition','reducedMotion'].includes(k)).every(([,v])=>v),cssSignals);
check('RESPONSIVE_RECOMPOSITION_STATIC',cssSignals.tabletRecomposition&&cssSignals.phoneRecomposition,cssSignals);
check('REDUCED_MOTION_RULE_PRESERVED',cssSignals.reducedMotion,cssSignals.reducedMotion);

let capture=null;if(fs.existsSync(captureInput)){try{capture=JSON.parse(read(captureInput));}catch{failures.push('CAPTURE_RECEIPT_PARSE_FAILURE')}}
check('CAPTURE_RECEIPT_PRESENT',Boolean(capture),captureInput);

// Deep geometry/state audit. Runs after the normal Playwright capture while the exact-candidate server is still alive.
let geometryAudit={result:'NOT_RUN',viewports:{},states:[],defects:[],traversal:{}};
try{
 const {chromium}=await import('playwright');
 const browser=await chromium.launch({headless:true});
 const viewportList=Object.entries(requiredViewports);
 const selectors={
  identity:'.compass-identity-3d',statement:'.compass-statement-orbit',scene:'[data-compass-scene]',guidance:'[data-compass-guidance]',panel:'[data-compass-panel]',purpose:'.compass-purpose-stage',capabilities:'.compass-monuments',dimensional:'.compass-capability-orbit',plaque:'.compass-orbit-plaque[data-slot="front"]',brain:'.compass-brain-field',trophy:'.compass-award-trophy',house:'.compass-house-parent',readiness:'.compass-built',proof:'.compass-proof-card[data-slot="front"]',evidence:'[data-evidence-registry-exit]',conclusion:'.compass-build-cta'
 };
 const inspectGeometry=async(page,label)=>page.evaluate(({selectors,label})=>{
  const visible=el=>{if(!el)return false;const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>.01&&r.width>1&&r.height>1};
  const rect=o=>o?{left:+o.left.toFixed(1),top:+o.top.toFixed(1),right:+o.right.toFixed(1),bottom:+o.bottom.toFixed(1),width:+o.width.toFixed(1),height:+o.height.toFixed(1)}:null;
  const ratio=(a,b)=>{const l=Math.max(a.left,b.left),t=Math.max(a.top,b.top),r=Math.min(a.right,b.right),bt=Math.min(a.bottom,b.bottom),area=Math.max(0,r-l)*Math.max(0,bt-t);return a.width*a.height?area/(a.width*a.height):1};
  const clippingAncestor=el=>{let p=el?.parentElement;while(p&&p!==document.body){const s=getComputedStyle(p);if(/hidden|clip/.test(`${s.overflow} ${s.overflowX} ${s.overflowY}`))return p;p=p.parentElement}return null};
  const items={};const defects=[];const vw=innerWidth,vh=innerHeight;
  for(const [name,sel] of Object.entries(selectors)){const el=document.querySelector(sel);if(!visible(el)){items[name]={present:Boolean(el),visible:false};continue}const r=el.getBoundingClientRect(),ancestor=clippingAncestor(el),ar=ancestor?.getBoundingClientRect();const clipRatio=ancestor?ratio(r,ar):1;const viewportRatio=ratio(r,{left:0,top:0,right:vw,bottom:vh,width:vw,height:vh});items[name]={present:true,visible:true,rect:rect(r),clipAncestor:ancestor?`${ancestor.tagName.toLowerCase()}${ancestor.id?'#'+ancestor.id:''}${ancestor.classList.length?'.'+[...ancestor.classList].slice(0,2).join('.'):''}`:null,clipRatio:+clipRatio.toFixed(3),viewportRatio:+viewportRatio.toFixed(3)};if(clipRatio<.94)defects.push({type:'ANCESTOR_CLIP',name,ratio:+clipRatio.toFixed(3),ancestor:items[name].clipAncestor});}
  const controls=[...document.querySelectorAll('button,a,[role="button"],[role="tab"]')].filter(visible).map(el=>{const r=el.getBoundingClientRect();return {text:(el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,70),rect:rect(r),viewportRatio:+ratio(r,{left:0,top:0,right:vw,bottom:vh,width:vw,height:vh}).toFixed(3)}}).filter(x=>x.viewportRatio>0&&x.viewportRatio<.94);
  controls.forEach(x=>defects.push({type:'CONTROL_EDGE_CLIP',...x}));
  const textOverflow=[...document.querySelectorAll('h1,h2,h3,p,summary,li,span')].filter(visible).filter(el=>el.scrollWidth>el.clientWidth+2||el.scrollHeight>el.clientHeight+2).slice(0,30).map(el=>({tag:el.tagName,text:(el.innerText||'').trim().slice(0,80),scroll:[el.scrollWidth,el.scrollHeight],client:[el.clientWidth,el.clientHeight],overflow:getComputedStyle(el).overflow}));
  textOverflow.filter(x=>/hidden|clip/.test(x.overflow)).forEach(x=>defects.push({type:'TEXT_CLIP',...x}));
  return {label,scrollY:+scrollY.toFixed(1),documentOverflowX:document.documentElement.scrollWidth-document.documentElement.clientWidth,items,defects};
 },{selectors,label});
 try{
  for(const [id,[width,height]] of viewportList){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});const page=await context.newPage();await page.goto(`http://127.0.0.1:4173/?candidate=${candidateHead}&lawsSpacecraftTest=1`,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(1100);
   geometryAudit.viewports[id]={};
   const captureState=async name=>{const state=await inspectGeometry(page,`${id}:${name}`);geometryAudit.viewports[id][name]=state;geometryAudit.states.push(state.label);geometryAudit.defects.push(...state.defects.map(d=>({...d,state:state.label})));const path=`/tmp/compass-experience-captures/geometry-${id}-${name}.png`;await page.screenshot({path,fullPage:true});};
   await captureState('constellation');
   await page.evaluate(()=>{const api=globalThis.DGB_COMPASS_CONTROLLER;api?.requestCardinalSelection?.('east');});await page.waitForTimeout(450);await captureState('cluster-open');
   const beforeRoom=await page.evaluate(()=>({y:scrollY,sceneTop:document.querySelector('[data-compass-scene]')?.getBoundingClientRect().top??null}));
   await page.evaluate(()=>{const api=globalThis.DGB_COMPASS_CONTROLLER;api?.requestRoomSelection?.('east-1');});await page.waitForTimeout(800);const afterRoom=await page.evaluate(()=>({y:scrollY,mode:document.querySelector('[data-compass-root]')?.dataset.compassMode||'',panelTop:document.querySelector('[data-compass-panel]')?.getBoundingClientRect().top??null,returnVisible:!![...document.querySelectorAll('[data-compass-return-to-orbit]')].find(el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&!el.hidden})}));await captureState('room-selected');
   const returnButton=page.locator('[data-compass-return-to-orbit]').first();let afterReturn=null;if(await returnButton.count()&&await returnButton.isVisible()){await returnButton.click({force:true});await page.waitForTimeout(800);afterReturn=await page.evaluate(()=>({y:scrollY,mode:document.querySelector('[data-compass-root]')?.dataset.compassMode||'',sceneTop:document.querySelector('[data-compass-scene]')?.getBoundingClientRect().top??null}));await captureState('return-orbit')}
   const descended=afterRoom.y>beforeRoom.y+80||Number(afterRoom.panelTop)>=0&&Number(afterRoom.panelTop)<height*.8;const restored=Boolean(afterReturn)&&(afterReturn.mode==='CONSTELLATION'||afterReturn.mode==='CLUSTER_OPEN')&&afterReturn.y<afterRoom.y-40&&Number(afterReturn.sceneTop)<height*.7;
   geometryAudit.traversal[id]={beforeRoom,afterRoom,afterReturn,descended,restored,pass:descended&&restored};
   const mirror=page.locator('[data-compass-object="mirrorland"]').first();if(await mirror.count()){await mirror.click({force:true});await page.waitForTimeout(650);await captureState('mirrorland');const back=page.locator('[data-compass-mirrorland-back]').first();if(await back.count()&&await back.isVisible()){await back.click({force:true});await page.waitForTimeout(500)}}
   const orbit=page.locator('.compass-capability-orbit').first();if(await orbit.count()){await orbit.scrollIntoViewIfNeeded();await page.waitForTimeout(250);await captureState('brain');const next=page.locator('.compass-orbit-controls button').last();if(await next.count()){await next.click({force:true});await page.waitForTimeout(400);await captureState('trophy');await next.click({force:true});await page.waitForTimeout(400);await captureState('house')}}
   const readiness=page.locator('.compass-built').first();if(await readiness.count()){await readiness.scrollIntoViewIfNeeded();await page.waitForTimeout(250);await captureState('trl');const tra=page.locator('[data-readiness-mode-button="tra"]').first();if(await tra.count()){await tra.click({force:true});await page.waitForTimeout(350);await captureState('tra')}}
   await context.close();
  }
 } finally {await browser.close()}
 const criticalDefects=geometryAudit.defects.filter(d=>['ANCESTOR_CLIP','CONTROL_EDGE_CLIP','TEXT_CLIP'].includes(d.type));
 const geometryPass=criticalDefects.length===0&&Object.values(geometryAudit.viewports).every(states=>Object.values(states).every(s=>Number(s.documentOverflowX)<=1));
 const traversalPass=Object.values(geometryAudit.traversal).every(x=>x.pass===true);
 geometryAudit.result=geometryPass&&traversalPass?'PASS_CLOSED':'FAIL_CLOSED';geometryAudit.geometryPass=geometryPass;geometryAudit.traversalPass=traversalPass;
 fs.writeFileSync('/tmp/compass-experience-captures/geometry-audit.json',JSON.stringify(geometryAudit,null,2)+'\n');
}catch(error){geometryAudit={...geometryAudit,result:'FAIL_CLOSED',error:String(error)};fs.mkdirSync('/tmp/compass-experience-captures',{recursive:true});fs.writeFileSync('/tmp/compass-experience-captures/geometry-audit.json',JSON.stringify(geometryAudit,null,2)+'\n');}

if(capture){
 capture.hardZero={...(capture.hardZero||{}),visibleGeometryIntegrity:geometryAudit.geometryPass===true,traversalContinuity:geometryAudit.traversalPass===true};
 capture.geometryAudit=geometryAudit;
 fs.writeFileSync(captureInput,JSON.stringify(capture,null,2)+'\n');
 check('CAPTURE_CANDIDATE_BOUND',capture.candidateHead===candidateHead,{expected:candidateHead,actual:capture.candidateHead});
 check('CAPTURE_BASELINE_BOUND',capture.governingHead===GOVERNING_HEAD,{expected:GOVERNING_HEAD,actual:capture.governingHead});
 const viewportMap=Object.fromEntries((capture.viewports||[]).map(v=>[v.id,[v.width,v.height]]));
 check('VIEWPORT_MATRIX_EXACT',Object.entries(requiredViewports).every(([id,dims])=>JSON.stringify(viewportMap[id])===JSON.stringify(dims)),viewportMap);
 const desktopBeats=new Set(capture.beats?.desktop||[]),phoneBeats=new Set(capture.beats?.phone||[]);
 check('DESKTOP_BEAT_MATRIX',requiredDesktopBeats.every(x=>desktopBeats.has(x)),[...desktopBeats]);check('PHONE_BEAT_MATRIX',requiredPhoneBeats.every(x=>phoneBeats.has(x)),[...phoneBeats]);
 const rd=new Set(capture.reducedMotionBeats?.desktop||[]),rp=new Set(capture.reducedMotionBeats?.phone||[]);check('REDUCED_MOTION_BEAT_MATRIX',requiredReduced.desktop.every(x=>rd.has(x))&&requiredReduced.phone.every(x=>rp.has(x)),{desktop:[...rd],phone:[...rp]});
 check('NO_HORIZONTAL_OVERFLOW',(capture.overflow||[]).every(x=>Number(x.delta)<=1),capture.overflow);
 check('VISIBLE_GEOMETRY_INTEGRITY',geometryAudit.geometryPass===true,{defects:geometryAudit.defects,result:geometryAudit.result});
 check('CAMERA_TRAVERSAL_CONTINUITY',geometryAudit.traversalPass===true,geometryAudit.traversal);
 check('PROTECTED_CAPABILITY_NONREGRESSION',capture.protectedCapabilityNonregression===true,capture.protectedCapabilityNonregression);
 check('PUBLIC_CLAIM_EVIDENCE_SEPARATION',capture.publicClaimEvidenceSeparation===true,capture.publicClaimEvidenceSeparation);
 check('CATEGORY_TEXT_PRESERVED',capture.categoryPreservationText==='Independent Studio for Interactive Worlds, Creative Technology & Original Systems',capture.categoryPreservationText);
 for(const name of hardZeroNames)check(`HARD_ZERO_${name}`,capture.hardZero?.[name]===true,capture.hardZero?.[name]);
}

const experiencePass=failures.length===0;
const receipt={schema:'COMPASS_EXPERIENCE_CONSOLIDATION_RECEIPT_v1',operationId:OPERATION_ID,lockGeneration:LOCK_GENERATION,candidateHead,governingHead:GOVERNING_HEAD,changedPaths:changed,hardZero:hardZeroNames.reduce((o,k)=>(o[k]=capture?.hardZero?.[k]===true,o),{}),geometryAudit:{result:geometryAudit.result,geometryPass:geometryAudit.geometryPass===true,traversalPass:geometryAudit.traversalPass===true,defectCount:geometryAudit.defects?.length||0},checks,failures,result:experiencePass?'EXPERIENCE_PASS_CLOSED':'EXPERIENCE_FAIL_CLOSED'};
fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));if(!experiencePass)process.exit(1);
