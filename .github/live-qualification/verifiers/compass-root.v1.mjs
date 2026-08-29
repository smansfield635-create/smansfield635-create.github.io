import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const base=(process.env.PUBLIC_BASE_URL||'https://diamondgatebridge.com').replace(/\/$/,'');
const out=process.env.RUNTIME_RESULT_PATH||'/tmp/runtime-result.json';
const chrome=process.env.CHROME_PATH;
if(!chrome) throw new Error('CHROME_PATH is required');

const CURRENT_TABLET_SCENE_CENTER_ERROR=0;
const SCENE_BASELINE_TOLERANCE=18;
const CONTEXT_CENTER_TOLERANCE=12;
const SETTLED_ANCHOR_TOLERANCE=20;
const OLD_PRIMARY_DEPARTURE_MIN=28;
const SETTLED_DRIFT_TOLERANCE=6;
const DRAG_FRACTION=.42;

const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
const page=await browser.newPage();
await page.setViewport({width:900,height:1000,deviceScaleFactor:1,isMobile:false,hasTouch:false});
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
await page.goto(`${base}/`,{waitUntil:'domcontentloaded',timeout:60000});
await new Promise(r=>setTimeout(r,1600));
const auditStartUrl=page.url();
let navigationObserved=null;
page.on('framenavigated',frame=>{
  if(frame===page.mainFrame()&&frame.url()!==auditStartUrl){
    navigationObserved={url:frame.url(),observedAt:Date.now()};
  }
});

await page.evaluate(()=>{
  const suppress=e=>e.preventDefault();
  document.addEventListener('click',suppress,true);
  document.addEventListener('auxclick',suppress,true);
});

const snapshot=()=>page.evaluate(()=>{
  const rect=el=>{const r=el?.getBoundingClientRect?.();return r?{x:r.x,y:r.y,width:r.width,height:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2}:null};
  const textUnion=el=>{
    if(!el)return null;
    const range=document.createRange();range.selectNodeContents(el);
    const rs=[...range.getClientRects()].filter(r=>r.width>0&&r.height>0);
    if(!rs.length)return rect(el);
    const left=Math.min(...rs.map(r=>r.left)),right=Math.max(...rs.map(r=>r.right));
    const top=Math.min(...rs.map(r=>r.top)),bottom=Math.max(...rs.map(r=>r.bottom));
    return{x:left,y:top,width:right-left,height:bottom-top,cx:(left+right)/2,cy:(top+bottom)/2};
  };
  const root=document.querySelector('[data-compass-root]');
  const scene=document.querySelector('[data-compass-scene]');
  const intro=document.querySelector('.compass-orbit-intro');
  const heading=intro?.querySelector('h2');
  const guidance=intro?.querySelector(':scope > p:last-child');
  const center=innerWidth/2;
  const cardinals=[...document.querySelectorAll('[data-compass-cardinal]')].map(el=>{
    const r=rect(el);
    const spans=[...el.querySelectorAll(':scope>span')];
    const labelVisible=spans.some(s=>{const cs=getComputedStyle(s);const rr=s.getBoundingClientRect();return cs.visibility!=='hidden'&&Number(cs.opacity)>.5&&rr.width>0&&rr.height>0});
    return{wing:el.dataset.wing||el.dataset.cardinalId||'',primary:el.dataset.primary==='true',readable:el.classList.contains('is-readable-cardinal'),labelVisible,rect:r};
  });
  return{
    viewport:{width:innerWidth,height:innerHeight,center},
    root:{
      mode:root?.dataset.compassMode||'',
      focus:root?.dataset.orbitFocus||'',
      preview:root?.dataset.orbitPreviewFocus||'',
      phase:root?.dataset.orbitPhase||'',
      dragging:root?.dataset.compassDragging||'',
      gestureScope:root?.dataset.compassGestureScope||''
    },
    scene:rect(scene),
    sceneCenterError:scene?rect(scene).cx-center:null,
    context:{heading:textUnion(heading),guidance:textUnion(guidance)},
    contextCenterError:{heading:heading?textUnion(heading).cx-center:null,guidance:guidance?textUnion(guidance).cx-center:null},
    cardinals,
    primary:cardinals.filter(x=>x.primary).map(x=>x.wing),
    visibleLabels:cardinals.filter(x=>x.labelVisible).map(x=>x.wing),
    binding:globalThis.DGB_COMPASS_LAWS_LABEL_BINDING||null,
    overflow:document.documentElement.scrollWidth-innerWidth
  };
});

const safeSnapshot=async stage=>{
  try{return{value:await snapshot(),error:null};}
  catch(error){
    const message=String(error?.message||error);
    if(message.includes('Execution context was destroyed')||message.includes('Cannot find context')||message.includes('Navigating frame was detached')){
      return{value:null,error:{stage,message,url:page.url()}};
    }
    throw error;
  }
};

const failures=[];
const checks=[];
const add=(id,pass,evidence)=>{checks.push({id,status:pass?'PASS':'FAIL',evidence});if(!pass)failures.push(id)};

const initial=await snapshot();
add('AUDIT_FOUR_STAR_PRESENCE',initial.cardinals.length===4&&initial.cardinals.every(x=>x.rect&&x.rect.width>0&&x.rect.height>0),{count:initial.cardinals.length,cardinals:initial.cardinals});
add('AUDIT_SINGLE_SETTLED_LABEL_INITIAL',initial.visibleLabels.length===1&&initial.primary.length===1&&initial.visibleLabels[0]===initial.primary[0],{focus:initial.root.focus,primary:initial.primary,visibleLabels:initial.visibleLabels});
add('AUDIT_TABLET_SCENE_PRESERVATION',initial.sceneCenterError!==null&&Math.abs(initial.sceneCenterError-CURRENT_TABLET_SCENE_CENTER_ERROR)<=SCENE_BASELINE_TOLERANCE,{requiredBaseline:CURRENT_TABLET_SCENE_CENTER_ERROR,tolerance:SCENE_BASELINE_TOLERANCE,observed:initial.sceneCenterError});
const contextAligned=initial.contextCenterError.heading!==null&&initial.contextCenterError.guidance!==null&&Math.abs(initial.contextCenterError.heading)<=CONTEXT_CENTER_TOLERANCE&&Math.abs(initial.contextCenterError.guidance)<=CONTEXT_CENTER_TOLERANCE;
add('AUDIT_CONTEXTUAL_ALIGNMENT',contextAligned,{tolerance:CONTEXT_CENTER_TOLERANCE,errors:initial.contextCenterError,rects:initial.context});
add('AUDIT_NO_HORIZONTAL_OVERFLOW',Math.abs(initial.overflow)<=1,{overflow:initial.overflow});

const sceneHandle=await page.$('[data-compass-scene]');
await sceneHandle?.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest'}));
await new Promise(r=>setTimeout(r,180));
const interactionBaseline=await snapshot();
const primary0=interactionBaseline.cardinals.find(x=>x.primary)||interactionBaseline.cardinals.find(x=>x.wing===(interactionBaseline.root.focus||'north'));
const initialAnchor=primary0?.rect?{cx:primary0.rect.cx,cy:primary0.rect.cy}:null;

if(!initialAnchor){
  add('AUDIT_POINTER_TRANSACTION_BINDING',false,{reason:'NO_INITIAL_FOREGROUND_ANCHOR'});
  add('AUDIT_SETTLED_GEOMETRY',false,{reason:'NO_INITIAL_FOREGROUND_ANCHOR'});
  add('AUDIT_SINGLE_SETTLED_LABEL',false,{reason:'NO_INITIAL_FOREGROUND_ANCHOR'});
  add('AUDIT_RELEASE_STABILITY',false,{reason:'NO_INITIAL_FOREGROUND_ANCHOR'});
}else{
  const b=await sceneHandle?.boundingBox();
  if(!b){
    add('AUDIT_POINTER_TRANSACTION_BINDING',false,{reason:'NO_SCENE_BOUNDS'});
    add('AUDIT_SETTLED_GEOMETRY',false,{reason:'NO_SCENE_BOUNDS'});
    add('AUDIT_SINGLE_SETTLED_LABEL',false,{reason:'NO_SCENE_BOUNDS'});
    add('AUDIT_RELEASE_STABILITY',false,{reason:'NO_SCENE_BOUNDS'});
  }else{
    const transitions=[];
    const attempts=[];
    let transitionNavigation=null;
    let acceptedPointerCount=0;
    let dragBoundCount=0;
    let previewChangedCount=0;
    let committedChangeCount=0;

    for(let attempt=0;attempt<8&&new Set([interactionBaseline.root.focus,...transitions.map(t=>t.after.root.focus)].filter(Boolean)).size<4;attempt++){
      const beforeResult=await safeSnapshot(`attempt-${attempt+1}-before`);
      if(!beforeResult.value){transitionNavigation=beforeResult.error;break;}
      const before=beforeResult.value;
      const currentPrimary=before.cardinals.find(x=>x.primary)||before.cardinals.find(x=>x.wing===before.root.focus);
      if(!currentPrimary?.rect){
        attempts.push({attempt:attempt+1,stage:'NO_CURRENT_PRIMARY'});
        continue;
      }

      const x1=currentPrimary.rect.cx;
      const y1=currentPrimary.rect.cy;
      const direction=attempt%2===0?1:-1;
      const proposed=x1+direction*b.width*DRAG_FRACTION;
      const x2=Math.min(b.x+b.width-18,Math.max(b.x+18,proposed));
      const y2=y1;
      navigationObserved=null;

      await page.mouse.move(x1,y1);
      await page.mouse.down({button:'left'});
      await new Promise(r=>setTimeout(r,35));
      const downResult=await safeSnapshot(`attempt-${attempt+1}-down`);
      if(!downResult.value){transitionNavigation=downResult.error;break;}
      acceptedPointerCount+=1;

      const thresholdX=x1+Math.sign(x2-x1)*Math.min(18,Math.abs(x2-x1));
      await page.mouse.move(thresholdX,y1,{steps:1});
      await new Promise(r=>setTimeout(r,45));
      const thresholdResult=await safeSnapshot(`attempt-${attempt+1}-threshold`);
      if(!thresholdResult.value){transitionNavigation=thresholdResult.error;break;}
      const threshold=thresholdResult.value;
      const dragBound=threshold.root.dragging==='true'&&threshold.root.gestureScope==='constellation';
      if(dragBound)dragBoundCount+=1;

      for(let i=2;i<=18;i++){
        const t=i/18;
        await page.mouse.move(x1+(x2-x1)*t,y1,{steps:1});
        await new Promise(r=>setTimeout(r,22));
      }
      await new Promise(r=>setTimeout(r,90));
      const previewResult=await safeSnapshot(`attempt-${attempt+1}-preview`);
      if(!previewResult.value){transitionNavigation=previewResult.error;break;}
      const preview=previewResult.value;
      const previewChanged=Boolean(preview.root.preview&&preview.root.preview!==before.root.focus);
      if(previewChanged)previewChangedCount+=1;

      await page.mouse.up({button:'left'});
      await new Promise(r=>setTimeout(r,260));
      if(navigationObserved){transitionNavigation={stage:`attempt-${attempt+1}-post-release-early`,...navigationObserved};break;}
      const earlyResult=await safeSnapshot(`attempt-${attempt+1}-early`);
      if(!earlyResult.value){transitionNavigation=earlyResult.error;break;}
      const early=earlyResult.value;
      await new Promise(r=>setTimeout(r,650));
      if(navigationObserved){transitionNavigation={stage:`attempt-${attempt+1}-post-release-settled`,...navigationObserved};break;}
      const afterResult=await safeSnapshot(`attempt-${attempt+1}-after`);
      if(!afterResult.value){transitionNavigation=afterResult.error;break;}
      const after=afterResult.value;
      const committedChange=after.root.phase==='COMMITTED'&&Boolean(after.root.focus)&&after.root.focus!==before.root.focus;
      if(committedChange){
        committedChangeCount+=1;
        transitions.push({before,threshold,preview,early,after});
      }
      attempts.push({
        attempt:attempt+1,
        from:before.root.focus,
        start:{x:x1,y:y1},
        end:{x:x2,y:y2},
        down:{phase:downResult.value.root.phase,dragging:downResult.value.root.dragging,gestureScope:downResult.value.root.gestureScope},
        threshold:{phase:threshold.root.phase,focus:threshold.root.focus,preview:threshold.root.preview,dragging:threshold.root.dragging,gestureScope:threshold.root.gestureScope,dragBound},
        preview:{phase:preview.root.phase,focus:preview.root.focus,preview:preview.root.preview,dragging:preview.root.dragging,gestureScope:preview.root.gestureScope,previewChanged},
        after:{phase:after.root.phase,focus:after.root.focus,preview:after.root.preview,committedChange}
      });
    }

    const bindingPass=!transitionNavigation&&acceptedPointerCount>0&&dragBoundCount>0&&previewChangedCount>0&&committedChangeCount>0;
    add('AUDIT_POINTER_TRANSACTION_BINDING',bindingPass,{acceptedPointerCount,dragBoundCount,previewChangedCount,committedChangeCount,inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',attempts});

    if(transitionNavigation)add('AUDIT_TRANSITION_NAVIGATION',false,transitionNavigation);
    else add('AUDIT_TRANSITION_NAVIGATION',true,{navigationObserved:false,inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION'});

    const geometryEvidence=[];
    let geometryPass=!transitionNavigation&&transitions.length>=3;
    for(const t of transitions){
      const beforePrimary=t.before.cardinals.find(x=>x.primary)||t.before.cardinals.find(x=>x.wing===t.before.root.focus);
      const transitionAnchor=beforePrimary?.rect?{cx:beforePrimary.rect.cx,cy:beforePrimary.rect.cy}:null;
      const incoming=t.after.cardinals.find(x=>x.wing===t.after.root.focus);
      const outgoing=t.after.cardinals.find(x=>x.wing===t.before.root.focus);
      const incomingEarly=t.early.cardinals.find(x=>x.wing===t.after.root.focus);
      const anchorError=(incoming?.rect&&transitionAnchor)?Math.hypot(incoming.rect.cx-transitionAnchor.cx,incoming.rect.cy-transitionAnchor.cy):Infinity;
      const outgoingDistance=(outgoing?.rect&&transitionAnchor)?Math.hypot(outgoing.rect.cx-transitionAnchor.cx,outgoing.rect.cy-transitionAnchor.cy):0;
      const drift=(incoming?.rect&&incomingEarly?.rect)?Math.hypot(incoming.rect.cx-incomingEarly.rect.cx,incoming.rect.cy-incomingEarly.rect.cy):Infinity;
      const labelPass=t.after.primary.length===1&&t.after.primary[0]===t.after.root.focus&&t.after.visibleLabels.length===1&&t.after.visibleLabels[0]===t.after.root.focus;
      const onePass=Boolean(transitionAnchor)&&anchorError<=SETTLED_ANCHOR_TOLERANCE&&outgoingDistance>=OLD_PRIMARY_DEPARTURE_MIN&&drift<=SETTLED_DRIFT_TOLERANCE&&labelPass;
      geometryPass&&=onePass;
      geometryEvidence.push({from:t.before.root.focus,to:t.after.root.focus,phase:t.after.root.phase,anchor:transitionAnchor,anchorError,outgoingDistance,settledDrift:drift,primary:t.after.primary,visibleLabels:t.after.visibleLabels,status:onePass?'PASS':'FAIL'});
    }
    add('AUDIT_SETTLED_GEOMETRY',geometryPass,{requiredDistinctTransitions:3,observedTransitions:transitions.length,anchorPolicy:'PER_TRANSACTION_PRE_DRAG_PRIMARY_SAME_VIEWPORT_FRAME',initialAnchor,tolerances:{anchor:SETTLED_ANCHOR_TOLERANCE,outgoingDeparture:OLD_PRIMARY_DEPARTURE_MIN,drift:SETTLED_DRIFT_TOLERANCE},navigation:transitionNavigation,inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',transactions:attempts,transitions:geometryEvidence});
    add('AUDIT_SINGLE_SETTLED_LABEL',!transitionNavigation&&transitions.length>=1&&transitions.every(t=>t.after.visibleLabels.length===1&&t.after.primary.length===1&&t.after.visibleLabels[0]===t.after.root.focus&&t.after.primary[0]===t.after.root.focus),{navigation:transitionNavigation,inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',transitions:geometryEvidence.map(x=>({from:x.from,to:x.to,primary:x.primary,visibleLabels:x.visibleLabels}))});
    add('AUDIT_RELEASE_STABILITY',!transitionNavigation&&transitions.length>=1&&geometryEvidence.every(x=>x.settledDrift<=SETTLED_DRIFT_TOLERANCE),{navigation:transitionNavigation,inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',drifts:geometryEvidence.map(x=>({to:x.to,drift:x.settledDrift}))});
  }
}

add('AUDIT_NO_BROWSER_ERRORS',pageErrors.length===0,{errors:pageErrors});
const status=failures.length?'FAIL':'PASS';
const result={status,schema:'DGB_COMPASS_AUDIT_DERIVED_RUNTIME_v1',publicUrl:`${base}/`,auditAuthority:'docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md + docs/COMPASS_RELEASE_SETTLEMENT_AND_TABLET_CONTEXT_CYCLE_20260822.md',inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',checks,failures,initial};
fs.writeFileSync(out,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
if(status!=='PASS')process.exit(1);
