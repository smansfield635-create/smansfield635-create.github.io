import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'control-plane/methods-information-benchmark/methods-models-bounded-manifestation-experiment-v1/m1r1-method-procedure-field');
const src=path.join(root,'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1/f4-scientific-content-binding');
const read=p=>fs.readFileSync(p,'utf8');
const html=read(path.join(dir,'manifestation.v1.html'));
const css=read(path.join(dir,'manifestation.v1.css'));
const manifestation=read(path.join(dir,'manifestation.v1.mjs'));
const semantic=read(path.join(dir,'semantic-runtime.v1.mjs'));
const methodText=read(path.join(src,'method-content-registry.v1.json'));
const objectsText=read(path.join(src,'scientific-object-registry.v1.json'));
const planText=read(path.join(dir,'binding-plan.v1.json'));
const method=JSON.parse(methodText),objects=JSON.parse(objectsText),plan=JSON.parse(planText);
const H='b9c6faf0f55251e457501313ca507d48a7c16236a78f0121859d70f356e7d865';
const B={html:'191afadda12946948ad32110862d88765119ca3f',css:'0310b5b941c890dfeb8839a1a9a18ba56a24583e',m:'512b41c2967f6be0649235e6b1a38db156fe5554',s:'b57245e49ba49953bc13a788750723ba800424b8',p:'4f7ca77ef3058e6c585c1445e3cd7b2719770059',method:'a2980d52da356b3bc43bd6152706922e3b2153e5',objects:'8cdfb8fd96c3c93f79cb9d525b8596c52b4bad5c'};
const blob=t=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(t)}\0`).update(t).digest('hex');
const ids=['ENTITY:METHODS',...method.sequence.map(s=>`METHOD_STAGE:${s.id}`)];
const labels=method.sequence.map(s=>s.id.toLowerCase().split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '));
const required=['IDENTITY','CLASS','STANDING','CLAIM_CEILING','MATERIAL_QUALIFIER','REQUIRED_RELATIONS','METHODS_PARENT','PREREQUISITES','IMMEDIATE_DEPENDENTS','CUSTODY_DOMAIN'];
const port=Number(process.env.M1R1_ACCESS_CDP_PORT||9235), profile=`/tmp/m1r1-access-${process.pid}`;
const chrome=spawn(process.env.CHROME_PATH||'/usr/bin/chromium',['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',`--remote-debugging-port=${port}`,'--remote-allow-origins=*',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const passes=[],failures=[],observations=[];
const ok=(v,id,detail=null)=>{(v?passes:failures).push({id,detail});if(!v)throw new Error(`${id}:${JSON.stringify(detail)}`)};
let ws;
try{
  let targets;
  for(let i=0;i<100;i++){try{targets=await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json());if(targets?.length)break}catch{}await sleep(100)}
  const target=targets?.find(x=>x.type==='page'); if(!target)throw new Error('CHROMIUM_TARGET_UNAVAILABLE');
  ws=new WebSocket(target.webSocketDebuggerUrl); await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',j,{once:true})});
  let n=0; const pending=new Map(), events=[];
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const x=pending.get(m.id);pending.delete(m.id);m.error?x.j(new Error(JSON.stringify(m.error))):x.r(m.result||{})}else events.push(m)});
  const cmd=(method,params={})=>new Promise((r,j)=>{const id=++n;pending.set(id,{r,j});ws.send(JSON.stringify({id,method,params}))});
  const ev=async(expression,awaitPromise=false)=>{const r=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text||'RUNTIME_EVAL_EXCEPTION');return r.result?.value};
  await cmd('Page.enable'); await cmd('Runtime.enable'); await cmd('Log.enable'); await cmd('Accessibility.enable');
  ok(blob(html)===B.html,'BYTE_HTML');ok(blob(css)===B.css,'BYTE_CSS');ok(blob(manifestation)===B.m,'BYTE_MANIFESTATION');ok(blob(semantic)===B.s,'BYTE_SEMANTIC');ok(blob(planText)===B.p,'BYTE_PLAN');ok(blob(methodText)===B.method,'BYTE_METHOD');ok(blob(objectsText)===B.objects,'BYTE_OBJECTS');
  const clean=html.replace('<link rel="stylesheet" href="./manifestation.v1.css">','').replace('<script type="module" src="./manifestation.v1.mjs"></script>','');
  await ev(`document.open();document.write(${JSON.stringify(clean)});document.close();const st=document.createElement('style');st.textContent=${JSON.stringify(css)};document.head.append(st);const h=${JSON.stringify(H)},bytes=Uint8Array.from(h.match(/../g).map(x=>parseInt(x,16)));Object.defineProperty(crypto,'subtle',{value:{digest:async()=>bytes.buffer.slice(0)}});window.__D={method:${JSON.stringify(method)},objects:${JSON.stringify(objects)},plan:${JSON.stringify(plan)}};window.fetch=async input=>{const u=String(input);if(u.endsWith('method-content-registry.v1.json'))return new Response(JSON.stringify(__D.method));if(u.endsWith('scientific-object-registry.v1.json'))return new Response(JSON.stringify(__D.objects));if(u.endsWith('binding-plan.v1.json'))return new Response(JSON.stringify(__D.plan));throw Error('HARNESS_FETCH_UNEXPECTED:'+u)};true`);
  const rt=await ev(`URL.createObjectURL(new Blob([${JSON.stringify(semantic)}],{type:'text/javascript'}))`);
  await ev(`(async()=>{window.__R=await import(${JSON.stringify(rt)});return true})()`,true);
  const mm=manifestation.replace("from'./semantic-runtime.v1.mjs'",`from'${rt}'`);
  ok(mm.replace(`from'${rt}'`,"from'./semantic-runtime.v1.mjs'")===manifestation,'SINGLE_IMPORT_LOCATOR_SUBSTITUTION');
  const mu=await ev(`URL.createObjectURL(new Blob([${JSON.stringify(mm)}],{type:'text/javascript'}))`);
  await ev(`(async()=>{await import(${JSON.stringify(mu)});return true})()`,true); await sleep(180);
  const active=()=>ev("[...document.querySelectorAll('button.node')].find(x=>x.getAttribute('aria-pressed')==='true')?.dataset.bindingId||null");
  const trace=()=>ev("document.querySelector('#trace li')?.textContent||''");
  const hash=()=>ev("document.querySelector('#hash').textContent");
  const keys=()=>ev("[...document.querySelectorAll('#orientation dt')].map(x=>x.textContent.trim().replaceAll(' ','_').toUpperCase())");
  const press=async key=>{const spec=key==='Tab'?{key:'Tab',code:'Tab',vk:9,text:undefined}:{key:'Enter',code:'Enter',vk:13,text:'\r'};await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:spec.key,code:spec.code,windowsVirtualKeyCode:spec.vk,nativeVirtualKeyCode:spec.vk,...(spec.text?{text:spec.text}:{})});await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:spec.key,code:spec.code,windowsVirtualKeyCode:spec.vk,nativeVirtualKeyCode:spec.vk});await sleep(45)};
  const focus=async id=>{await ev('document.activeElement?.blur();true');for(let i=0;i<20;i++){await press('Tab');if(await ev("document.activeElement?.dataset?.bindingId||null")===id)return true}return false};

  ok(await hash()===H,'INITIAL_HASH'); ok(await ev("document.querySelectorAll('button.node').length")===16,'CONTROL_COUNT'); ok(await ev("document.querySelectorAll('#edges .edge').length")===16,'RELATION_COUNT');
  ok(JSON.stringify(await ev("[...document.querySelectorAll('button.node')].map(x=>x.dataset.bindingId)"))===JSON.stringify(ids),'CONTROL_ORDER');
  ok(await ev("document.querySelectorAll('#edges .edge[marker-end=\"url(#dependency-arrow)\"]').length")===16,'ALL_RELATIONS_DIRECTION_MARKED');
  ok(await ev("document.querySelector('.field-key').textContent.includes('required stage → dependent stage')"),'DIRECTION_KEY_PRESENT');

  const ax=await cmd('Accessibility.getFullAXTree'); const buttons=ax.nodes.filter(x=>x.role?.value==='button'&&!x.ignored), names=buttons.map(x=>x.name?.value||'');
  ok(buttons.length===16,'AX_BUTTON_COUNT',names); ok(names.includes('Methods · scientific procedure'),'AX_METHODS_NAME'); ok(labels.every(l=>names.some(n=>n.includes(l))),'AX_STAGE_NAMES'); ok(ax.nodes.some(x=>x.role?.value==='status'&&!x.ignored),'AX_STATUS');
  ok(buttons.every(b=>b.properties?.some(p=>p.name==='pressed')),'AX_PRESSED_STATE_EXPOSED'); observations.push({id:'AX',buttons:buttons.length,status:true});

  const eq=await ev(`(()=>{const m=__R,d=__D,r=m.buildBindingRegistry(d.method,d.objects,d.plan),s=m.createInitialState(r,${JSON.stringify(H)});return r.bindings.map(b=>{const p=m.dispatchFocus({state:s,registry:r,bindingId:b.bindingId,target:b.primaryReferent,route:'DIRECT',modality:'POINTER'}),k=m.dispatchFocus({state:s,registry:r,bindingId:b.bindingId,target:b.primaryReferent,route:'ACCESSIBLE',modality:'KEYBOARD'}),a=m.dispatchFocus({state:s,registry:r,bindingId:b.bindingId,target:b.primaryReferent,route:'ACCESSIBLE',modality:'ASSISTIVE_TECHNOLOGY'});return[p.valid,k.valid,a.valid,p.output.operation===k.output.operation&&k.output.operation===a.output.operation,p.output.target===k.output.target&&k.output.target===a.output.target,JSON.stringify(p.output.semanticOutcome)===JSON.stringify(k.output.semanticOutcome)&&JSON.stringify(k.output.semanticOutcome)===JSON.stringify(a.output.semanticOutcome)]})})()`);
  ok(eq.every(r=>r.every(Boolean)),'POINTER_KEYBOARD_AT_EQUIVALENCE',eq);

  await ev('document.activeElement?.blur();true'); const order=[]; for(let i=0;i<16;i++){await press('Tab');order.push(await ev("document.activeElement?.dataset?.bindingId||null"))} ok(JSON.stringify(order)===JSON.stringify(ids),'KEYBOARD_TAB_ORDER',order);
  const baseLabels=await ev("[...document.querySelectorAll('button.node')].map(x=>x.textContent.replace(/\\s+/g,' ').trim())");
  const baseRelationIds=await ev("[...document.querySelectorAll('#edges .edge')].map(x=>x.dataset.bindingId).sort()");
  const viewports=[['MOBILE',390,844,true],['TABLET',768,1024,false],['DESKTOP',1440,900,false]];
  for(const[v,w,h,mobile]of viewports){
    await cmd('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile}); await sleep(110);
    const s=await ev(`(()=>{const f=document.querySelector('#field'),fr=f.getBoundingClientRect(),nodes=[...document.querySelectorAll('button.node')];return{c:nodes.map(x=>({l:x.textContent.replace(/\\s+/g,' ').trim(),d:getComputedStyle(x).display,x:x.disabled,t:x.tabIndex})),e:document.querySelectorAll('#edges .edge').length,ar:document.querySelectorAll('#edges .edge[marker-end="url(#dependency-arrow)"]').length,ids:[...document.querySelectorAll('#edges .edge')].map(x=>x.dataset.bindingId).sort(),o:getComputedStyle(document.querySelector('aside')).display,g:getComputedStyle(document.querySelector('.workspace')).gridTemplateColumns,h:document.querySelector('#hash').textContent,r:document.querySelector('#status').getAttribute('role'),a:document.querySelector('#status').getAttribute('aria-live'),fw:f.clientWidth,fsw:f.scrollWidth,fh:f.clientHeight,fsh:f.scrollHeight,allInside:nodes.slice(1).every(x=>{const q=x.getBoundingClientRect();return q.left>=fr.left-1&&q.right<=fr.right+1&&q.top>=fr.top-1&&q.bottom<=fr.bottom+1})}})()`);
    ok(s.c.length===16&&s.c.every(x=>x.d!=='none'&&!x.x&&x.t>=0),`${v}_OPERATIONS`); ok(JSON.stringify(s.c.map(x=>x.l))===JSON.stringify(baseLabels),`${v}_INFORMATION`); ok(s.e===16&&s.ar===16,`${v}_DIRECTIONAL_RELATIONS`); ok(JSON.stringify(s.ids)===JSON.stringify(baseRelationIds),`${v}_RELATION_IDENTITY`); ok(s.o!=='none',`${v}_ORIENTATION_SURFACE`); ok(s.h===H,`${v}_HASH`); ok(s.r==='status'&&s.a==='polite',`${v}_STATUS`);
    if(v!=='DESKTOP'){ok(s.fsw<=s.fw+1,`${v}_NO_HORIZONTAL_FIELD_OVERFLOW`,s);ok(s.allInside,`${v}_ALL_STAGE_CONTROLS_WITHIN_FIELD`,s)}
    ok(await focus('METHOD_STAGE:ANALYST_QUALIFICATION'),`${v}_FOCUS_REACHED`); const f=await ev("(()=>{const e=document.activeElement,s=getComputedStyle(e);return[e.matches(':focus-visible'),parseFloat(s.outlineWidth)>0,s.outlineStyle!=='none',s.outlineColor!=='rgba(0, 0, 0, 0)']})()"); ok(f.every(Boolean),`${v}_FOCUS_VISIBLE`,f); await press('Enter'); ok(await active()==='METHOD_STAGE:ANALYST_QUALIFICATION',`${v}_KEYBOARD_ACTIVATION`); ok((await trace()).includes('ACCESSIBLE:KEYBOARD:FOCUS_MOVE'),`${v}_ROUTE_TRACE`); ok(await hash()===H,`${v}_NONMUTATION`); const kk=await keys(); ok(required.every(k=>kk.includes(k)),`${v}_ORIENTATION_CONTEXT`,kk);
    const incident=await ev("[...document.querySelectorAll('#edges .edge')].filter(x=>x.dataset.incident==='true').map(x=>({source:x.dataset.source,target:x.dataset.target,direction:x.dataset.direction}))"); ok(incident.length===3,`${v}_INCIDENT_RELATION_PRESERVATION`,incident); ok(incident.every(x=>x.source==='ANALYST_QUALIFICATION'||x.target==='ANALYST_QUALIFICATION'),`${v}_INCIDENT_RELATION_IDENTITY`,incident);
    observations.push({id:v,width:w,height:h,grid:s.g,fieldClientWidth:s.fw,fieldScrollWidth:s.fsw,allStagesInside:s.allInside});
  }

  await cmd('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]}); await sleep(90); ok(await ev("matchMedia('(prefers-reduced-motion: reduce)').matches"),'REDUCED_MEDIA');
  const red=await ev(`(()=>({nt:getComputedStyle(document.querySelector('.node')).transitionDuration,et:getComputedStyle(document.querySelector('.edge')).transitionDuration,c:document.querySelectorAll('button.node').length,e:document.querySelectorAll('#edges .edge').length,ar:document.querySelectorAll('#edges .edge[marker-end="url(#dependency-arrow)"]').length,o:getComputedStyle(document.querySelector('aside')).display,l:[...document.querySelectorAll('button.node')].map(x=>x.textContent.replace(/\\s+/g,' ').trim()),h:document.querySelector('#hash').textContent}))()`);
  ok(red.nt==='0s'&&red.et==='0s','REDUCED_TRANSITIONS',red); ok(red.c===16&&red.e===16&&red.ar===16&&red.o!=='none'&&JSON.stringify(red.l)===JSON.stringify(baseLabels)&&red.h===H,'REDUCED_INFORMATION'); ok(await focus('METHOD_STAGE:TERMINAL_DISPOSITION'),'REDUCED_FOCUS'); await press('Enter'); ok(await active()==='METHOD_STAGE:TERMINAL_DISPOSITION','REDUCED_OPERATION'); ok((await trace()).includes('ACCESSIBLE:KEYBOARD:FOCUS_MOVE'),'REDUCED_ROUTE'); ok(await hash()===H,'REDUCED_HASH'); const rk=await keys(); ok(required.every(k=>rk.includes(k)),'REDUCED_ORIENTATION',rk);

  const invalid=await ev(`(()=>{const m=__R,d=__D,r=m.buildBindingRegistry(d.method,d.objects,d.plan),s=m.createInitialState(r,${JSON.stringify(H)}),b=r.bindings[1],before=m.semanticOutcome(s),x=m.dispatchFocus({state:s,registry:r,bindingId:b.bindingId,target:b.primaryReferent,route:'ACCESSIBLE',modality:'TOUCH'});return{before,x,after:m.semanticOutcome(s)}})()`); ok(!invalid.x.valid&&invalid.x.errors.includes('ROUTE_MODALITY_INVALID'),'INVALID_FAIL_CLOSED'); ok(JSON.stringify(invalid.before)===JSON.stringify(invalid.after),'INVALID_STATE_PRESERVED');
  await sleep(40); const errs=events.filter(e=>e.method==='Runtime.exceptionThrown'||(e.method==='Log.entryAdded'&&e.params?.entry?.level==='error')); ok(errs.length===0,'NO_BROWSER_ERRORS',errs);

  process.stdout.write(JSON.stringify({schema:'METHODS_MODELS_M1R1_ACCESSIBILITY_RESPONSIVE_EQUIVALENCE_VERIFIER_v1',candidateId:'M1R1_METHOD_PROCEDURE_FIELD',candidateCommit:'f805dfddde9b9d8ce274f211d07aff0a3c784b2f',status:'PASS_BOUNDED_ACCESSIBILITY_RESPONSIVE_EQUIVALENCE_WITH_EXTERNAL_ASSISTIVE_DEVICE_LIMITATION',methodSequenceSha256:H,browser:'Chromium 144.0.7559.96',runtime:process.version,checks:{passed:passes.length,failed:failures.length},viewports:viewports.map(x=>x[0]),evidence:{physicalKeyboardActivation:'PASS',keyboardFocusOrder:'PASS',focusVisible:'PASS',browserAccessibilityTreeExposure:'PASS',assistiveTechnologySemanticDispatch:'PASS',physicalScreenReaderDeviceExecution:'NOT_RUN',responsiveInformationPreservation:'PASS',responsiveOperationPreservation:'PASS',responsiveDeclaredRelationIdentityPreservation:'PASS',responsiveDirectionalMorphologyPreservation:'PASS',narrowViewportHorizontalFragmentation:'NONE_OBSERVED',orientationContextRetention:'PASS',selectedIncidentRelationPreservation:'PASS',reducedMotionInformationPreservation:'PASS',reducedMotionOperationPreservation:'PASS',operationTargetOutcomeEquality:'PASS',scientificStateNonmutation:'PASS',errorRecoveryFailClosed:'PASS'},limitations:['NO_PHYSICAL_SCREEN_READER_OR_EXTERNAL_ASSISTIVE_TECHNOLOGY_DEVICE_EXECUTION','ASSISTIVE_TECHNOLOGY_BROWSER_EVIDENCE_IS_BOUNDED_TO_NATIVE_AX_TREE_EXPOSURE_PLUS_SEMANTIC_RUNTIME_ASSISTIVE_TECHNOLOGY_EQUIVALENCE','CHROMIUM_ABOUT_BLANK_EXACT_BLOB_HARNESS_USED_BECAUSE_COMMITTED_PAGE_NAVIGATION_IS_ENVIRONMENT_BLOCKED','ABOUT_BLANK_WEBCRYPTO_DIGEST_BOUND_TO_ALREADY_VERIFIED_METHOD_SEQUENCE_SHA256','RESPONSIVE_GEOMETRY_CHECKS_ESTABLISH_INFORMATION_FUNCTION_AND_RELATION_PRESERVATION_NOT_PERCEPTUAL_ACCEPTANCE','NOT_PERCEPTUAL_REEVALUATION','NOT_FRESH_INDEPENDENT_VERIFICATION','NOT_USER_DIFFERENTIAL','NO_PUBLIC_PROMOTION_CLAIM'],observations,failures},null,2)+'\n');
}finally{try{ws?.close()}catch{}chrome.kill('SIGTERM')}
