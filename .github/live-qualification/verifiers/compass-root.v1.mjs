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

const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
const page=await browser.newPage();
await page.setViewport({width:900,height:1000,deviceScaleFactor:1,isMobile:false,hasTouch:false});
const pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e)));
// The Compass intentionally carries long-lived media/runtime requests. Mechanical readiness
// depends on the DOM and governed runtime settling, not on network quiescence.
await page.goto(`${base}/`,{waitUntil:'domcontentloaded',timeout:60000});
await new Promise(r=>setTimeout(r,1600));
const auditStartUrl=page.url();
let navigationObserved=null;
page.on('framenavigated',frame=>{
  if(frame===page.mainFrame()&&frame.url()!==auditStartUrl){
    navigationObserved={url:frame.url(),observedAt:Date.now()};
  }
});

// Mechanical qualification follows the accepted Laws/Main Compass interaction boundary:
// exercise the actual browser pointer transaction, then observe physical settlement and the
// controller's committed cardinal correspondence. Click/auxclick navigation remains suppressed
// because this audit measures rotation/settlement rather than semantic tap intent.
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
    root:{mode:root?.dataset.compassMode||'',focus:root?.dataset.orbitFocus||'',preview:root?.dataset.orbitPreviewFocus||'',phase:root?.dataset.orbitPhase||''},
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

// Pointer coordinates are viewport-relative, so exercise the transition only after bringing the
// scene into view. The physical foreground anchor is sampled again after scrolling so geometry
// comparisons use one coordinate frame. Acceptance criteria are unchanged; only the input
// transport is rebound from raw CDP touch injection to the real pointer transaction used by the
// accepted Laws/Main Compass interaction contract.
const sceneHandle=await page.$('[data-compass-scene]');
await sceneHandle?.evaluate(el=>el.scrollIntoView({block:'center',inline:'nearest'}));
await new Promise(r=>setTimeout(r,150));
const interactionBaseline=await snapshot();
const primary0=interactionBaseline.cardinals.find(x=>x.primary)||interactionBaseline.cardinals.find(x=>x.wing===(interactionBaseline.root.focus||'north'));
const anchor=primary0?.rect?{cx:primary0.rect.cx,cy:primary0.rect.cy}:null;
if(!anchor){
  add('AUDIT_SETTLED_GEOMETRY',false,{reason:'NO_INITIAL_FOREGROUND_ANCHOR'});
}else{
  const b=await sceneHandle?.boundingBox();
  if(!b){
    add('AUDIT_SETTLED_GEOMETRY',false,{reason:'NO_SCENE_BOUNDS'});
  }else{
    const patterns=[[.84,.50,.16,.50],[.50,.80,.50,.20],[.16,.50,.84,.50],[.50,.20,.50,.80]];
    const transitions=[];
    let transitionNavigation=null;
    for(let attempt=0;attempt<8&&new Set([interactionBaseline.root.focus,...transitions.map(t=>t.after.root.focus)].filter(Boolean)).size<4;attempt++){
      const g=patterns[attempt%patterns.length];
      const [sx,sy,ex,ey]=g;
      const x1=b.x+b.width*sx,y1=b.y+b.height*sy,x2=b.x+b.width*ex,y2=b.y+b.height*ey;
      const beforeResult=await safeSnapshot(`attempt-${attempt+1}-before`);
      if(!beforeResult.value){transitionNavigation=beforeResult.error;break;}
      const before=beforeResult.value;
      navigationObserved=null;
      await page.mouse.move(x1,y1);
      await page.mouse.down({button:'left'});
      for(let i=1;i<=18;i++){
        const t=i/18;
        await page.mouse.move(x1+(x2-x1)*t,y1+(y2-y1)*t,{steps:1});
        await new Promise(r=>setTimeout(r,22));
      }
      await new Promise(r=>setTimeout(r,100));
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
      if(after.root.phase==='COMMITTED'&&after.root.focus&&after.root.focus!==before.root.focus)transitions.push({before,early,after});
    }

    if(transitionNavigation)add('AUDIT_TRANSITION_NAVIGATION',false,transitionNavigation);
    else add('AUDIT_TRANSITION_NAVIGATION',true,{navigationObserved:false,inputBoundary:'POINTER_TRANSACTION'});

    const geometryEvidence=[];
    let geometryPass=!transitionNavigation&&transitions.length>=3;
    for(const t of transitions){
      const incoming=t.after.cardinals.find(x=>x.wing===t.after.root.focus);
      const outgoing=t.after.cardinals.find(x=>x.wing===t.before.root.focus);
      const incomingEarly=t.early.cardinals.find(x=>x.wing===t.after.root.focus);
      const anchorError=incoming?.rect?Math.hypot(incoming.rect.cx-anchor.cx,incoming.rect.cy-anchor.cy):Infinity;
      const outgoingDistance=outgoing?.rect?Math.hypot(outgoing.rect.cx-anchor.cx,outgoing.rect.cy-anchor.cy):0;
      const drift=(incoming?.rect&&incomingEarly?.rect)?Math.hypot(incoming.rect.cx-incomingEarly.rect.cx,incoming.rect.cy-incomingEarly.rect.cy):Infinity;
      const labelPass=t.after.primary.length===1&&t.after.primary[0]===t.after.root.focus&&t.after.visibleLabels.length===1&&t.after.visibleLabels[0]===t.after.root.focus;
      const onePass=anchorError<=SETTLED_ANCHOR_TOLERANCE&&outgoingDistance>=OLD_PRIMARY_DEPARTURE_MIN&&drift<=SETTLED_DRIFT_TOLERANCE&&labelPass;
      geometryPass&&=onePass;
      geometryEvidence.push({from:t.before.root.focus,to:t.after.root.focus,phase:t.after.root.phase,anchorError,outgoingDistance,settledDrift:drift,primary:t.after.primary,visibleLabels:t.after.visibleLabels,status:onePass?'PASS':'FAIL'});
    }
    add('AUDIT_SETTLED_GEOMETRY',geometryPass,{requiredDistinctTransitions:3,observedTransitions:transitions.length,anchor,tolerances:{anchor:SETTLED_ANCHOR_TOLERANCE,outgoingDeparture:OLD_PRIMARY_DEPARTURE_MIN,drift:SETTLED_DRIFT_TOLERANCE},navigation:transitionNavigation,inputBoundary:'POINTER_TRANSACTION',transitions:geometryEvidence});
    add('AUDIT_SINGLE_SETTLED_LABEL',!transitionNavigation&&transitions.length>=1&&transitions.every(t=>t.after.visibleLabels.length===1&&t.after.primary.length===1&&t.after.visibleLabels[0]===t.after.root.focus&&t.after.primary[0]===t.after.root.focus),{navigation:transitionNavigation,inputBoundary:'POINTER_TRANSACTION',transitions:geometryEvidence.map(x=>({from:x.from,to:x.to,primary:x.primary,visibleLabels:x.visibleLabels}))});
    add('AUDIT_RELEASE_STABILITY',!transitionNavigation&&transitions.length>=1&&geometryEvidence.every(x=>x.settledDrift<=SETTLED_DRIFT_TOLERANCE),{navigation:transitionNavigation,inputBoundary:'POINTER_TRANSACTION',drifts:geometryEvidence.map(x=>({to:x.to,drift:x.settledDrift}))});
  }
}

add('AUDIT_NO_BROWSER_ERRORS',pageErrors.length===0,{errors:pageErrors});
const status=failures.length?'FAIL':'PASS';
const result={status,schema:'DGB_COMPASS_AUDIT_DERIVED_RUNTIME_v1',publicUrl:`${base}/`,auditAuthority:'docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md + docs/COMPASS_RELEASE_SETTLEMENT_AND_TABLET_CONTEXT_CYCLE_20260822.md',inputBoundary:'POINTER_TRANSACTION',checks,failures,initial};
fs.writeFileSync(out,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
if(status!=='PASS')process.exit(1);
