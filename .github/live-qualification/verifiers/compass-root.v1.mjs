import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const base=(process.env.PUBLIC_BASE_URL||'https://diamondgatebridge.com').replace(/\/$/,'');
const out=process.env.RUNTIME_RESULT_PATH||'/tmp/runtime-result.json';
const chrome=process.env.CHROME_PATH;
if(!chrome)throw new Error('CHROME_PATH is required');

const CURRENT_TABLET_SCENE_CENTER_ERROR=0;
const SCENE_BASELINE_TOLERANCE=18;
const CONTEXT_CENTER_TOLERANCE=12;
const SETTLED_DRIFT_TOLERANCE=6;
const DRAG_FRACTION=.42;
const STABILIZATION_DELTA_TOLERANCE=2;
const STABILIZATION_REQUIRED_SAMPLES=3;
const REQUIRED_GEOMETRY_VALIDATION_TRANSITIONS=3;
const RELEASE_JUMP_TOLERANCE=.16;
const RELEASE_RECEIPT_TOLERANCE=.18;
const MIN_INERTIAL_TRAVEL=.018;
const MIN_SAME_DIRECTION_COSINE=.35;
const ENDPOINT_QUATERNION_TOLERANCE=.012;
const FINAL_QUATERNION_DRIFT_TOLERANCE=.008;
const MIN_ENDPOINT_DEPARTURE=.025;
const MIN_MOTION_MS=600;
const MAX_MOTION_MS=820;

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const browser=await puppeteer.launch({
  executablePath:chrome,
  headless:'new',
  args:['--no-sandbox','--ignore-gpu-blocklist','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
});
const page=await browser.newPage();
await page.setViewport({width:900,height:1000,deviceScaleFactor:1,isMobile:false,hasTouch:false});
await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
const pageErrors=[];
page.on('pageerror',error=>pageErrors.push({viewport:'tablet-interaction',error:String(error)}));
await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:60000});
await sleep(1600);

const auditStartUrl=page.url();
let navigationObserved=null;
page.on('framenavigated',frame=>{
  if(frame===page.mainFrame()&&frame.url()!==auditStartUrl){
    navigationObserved={url:frame.url(),observedAt:Date.now()};
  }
});
await page.evaluate(()=>{
  const suppress=event=>event.preventDefault();
  document.addEventListener('click',suppress,true);
  document.addEventListener('auxclick',suppress,true);
});

const snapshot=target=>target.evaluate(()=>{
  const rect=element=>{
    const value=element?.getBoundingClientRect?.();
    return value?{
      x:value.x,
      y:value.y,
      width:value.width,
      height:value.height,
      cx:value.x+value.width/2,
      cy:value.y+value.height/2
    }:null;
  };
  const textUnion=element=>{
    if(!element)return null;
    const range=document.createRange();
    range.selectNodeContents(element);
    const rects=[...range.getClientRects()].filter(value=>value.width>0&&value.height>0);
    if(!rects.length)return rect(element);
    const left=Math.min(...rects.map(value=>value.left));
    const right=Math.max(...rects.map(value=>value.right));
    const top=Math.min(...rects.map(value=>value.top));
    const bottom=Math.max(...rects.map(value=>value.bottom));
    return{x:left,y:top,width:right-left,height:bottom-top,cx:(left+right)/2,cy:(top+bottom)/2};
  };
  const copyOrientation=orientation=>orientation?{
    yaw:Number(orientation.yaw)||0,
    pitch:Number(orientation.pitch)||0,
    roll:Number(orientation.roll)||0,
    quaternion:Array.from(orientation.quaternion||[]),
    primaryId:String(orientation.primaryId||'')
  }:null;
  const root=document.querySelector('[data-compass-root]');
  const scene=document.querySelector('[data-compass-scene]');
  const intro=document.querySelector('.compass-orbit-intro');
  const heading=intro?.querySelector('h2');
  const guidance=intro?.querySelector(':scope > p:last-child');
  const center=innerWidth/2;
  const frame=globalThis.DGB_COMPASS_CONTROLLER?.getFrameState?.()||null;
  const completion=globalThis.DGB_COMPASS_READINESS_CONTEXT_V1?.completionRuntime||null;
  const hasDirectMotionReceipt=Object.prototype.hasOwnProperty.call(globalThis,'DGB_COMPASS_RELEASE_CONTINUITY_RECEIPT');
  const directMotionReceipt=globalThis.DGB_COMPASS_RELEASE_CONTINUITY_RECEIPT||null;
  const motion=hasDirectMotionReceipt?(directMotionReceipt?JSON.parse(JSON.stringify(directMotionReceipt)):null):(completion?.lastMotion?JSON.parse(JSON.stringify(completion.lastMotion)):null);
  const cardinals=[...document.querySelectorAll('[data-compass-cardinal]')].map(element=>{
    const cardinalRect=rect(element);
    const spans=[...element.querySelectorAll(':scope>span')];
    const labelVisible=spans.some(span=>{
      const style=getComputedStyle(span);
      const value=span.getBoundingClientRect();
      return style.display!=='none'&&style.visibility!=='hidden'&&Number(style.opacity)>.5&&value.width>0&&value.height>0;
    });
    return{
      wing:element.dataset.wing||element.dataset.cardinalId||'',
      primary:element.dataset.primary==='true',
      readable:element.classList.contains('is-readable-cardinal'),
      labelVisible,
      rect:cardinalRect
    };
  });
  return{
    viewport:{width:innerWidth,height:innerHeight,devicePixelRatio,center},
    scrollY,
    root:{
      mode:root?.dataset.compassMode||'',
      focus:root?.dataset.orbitFocus||'',
      preview:root?.dataset.orbitPreviewFocus||'',
      rendered:root?.dataset.renderedForegroundCardinal||'',
      phase:root?.dataset.orbitPhase||'',
      dragging:root?.dataset.compassDragging||'',
      gestureScope:root?.dataset.compassGestureScope||'',
      motionOwner:root?.dataset.mainConstellationMotionOwner||'',
      inertiaActive:root?.dataset.mainConstellationInertiaActive||'',
      reducedMotion:root?.dataset.reducedMotion||''
    },
    controller:frame?{
      state:frame.state,
      orbitFocus:frame.orbitFocus,
      orbitPreviewFocus:frame.orbitPreviewFocus,
      orbitPhase:frame.orbitPhase,
      orbitGestureActive:Boolean(frame.orbitGestureActive),
      orbitOrientation:copyOrientation(frame.orbitOrientation),
      committedOrbitOrientation:copyOrientation(frame.committedOrbitOrientation)
    }:null,
    motion,
    scene:rect(scene),
    sceneCenterError:scene?rect(scene).cx-center:null,
    context:{heading:textUnion(heading),guidance:textUnion(guidance)},
    contextCenterError:{
      heading:heading?textUnion(heading).cx-center:null,
      guidance:guidance?textUnion(guidance).cx-center:null
    },
    cardinals,
    primary:cardinals.filter(value=>value.primary).map(value=>value.wing),
    visibleLabels:cardinals.filter(value=>value.labelVisible).map(value=>value.wing),
    binding:globalThis.DGB_COMPASS_LAWS_LABEL_BINDING||null,
    overflow:document.documentElement.scrollWidth-innerWidth
  };
});

const mainSnapshot=()=>snapshot(page);
const primaryOf=value=>value.cardinals.find(cardinal=>cardinal.primary)||value.cardinals.find(cardinal=>cardinal.wing===value.root.rendered)||value.cardinals.find(cardinal=>cardinal.wing===value.root.focus);
const safeSnapshot=async stage=>{
  try{
    return{value:await mainSnapshot(),error:null};
  }catch(error){
    const message=String(error?.message||error);
    if(message.includes('Execution context was destroyed')||message.includes('Cannot find context')||message.includes('Navigating frame was detached')){
      return{value:null,error:{stage,message,url:page.url()}};
    }
    throw error;
  }
};
const normalizeQuaternion=value=>{
  const source=Array.isArray(value)?value.map(Number):[];
  if(source.length!==4||source.some(component=>!Number.isFinite(component)))return null;
  const length=Math.hypot(...source);
  return length>.000001?source.map(component=>component/length):null;
};
const quaternionOf=(value,field='orbitOrientation')=>normalizeQuaternion(value?.controller?.[field]?.quaternion);
const quaternionMultiply=(left,right)=>[
  left[3]*right[0]+left[0]*right[3]+left[1]*right[2]-left[2]*right[1],
  left[3]*right[1]-left[0]*right[2]+left[1]*right[3]+left[2]*right[0],
  left[3]*right[2]+left[0]*right[1]-left[1]*right[0]+left[2]*right[3],
  left[3]*right[3]-left[0]*right[0]-left[1]*right[1]-left[2]*right[2]
];
const quaternionDistance=(leftValue,rightValue)=>{
  const left=normalizeQuaternion(leftValue);
  const right=normalizeQuaternion(rightValue);
  if(!left||!right)return Infinity;
  const dot=Math.min(1,Math.abs(left.reduce((sum,component,index)=>sum+component*right[index],0)));
  return 2*Math.acos(dot);
};
const rotationVector=(fromValue,toValue)=>{
  const from=normalizeQuaternion(fromValue);
  const to=normalizeQuaternion(toValue);
  if(!from||!to)return null;
  let delta=normalizeQuaternion(quaternionMultiply(to,[-from[0],-from[1],-from[2],from[3]]));
  if(!delta)return null;
  if(delta[3]<0)delta=delta.map(component=>-component);
  const sine=Math.hypot(delta[0],delta[1],delta[2]);
  if(sine<.000001)return[0,0,0];
  const angle=2*Math.atan2(sine,Math.max(-1,Math.min(1,delta[3])));
  return delta.slice(0,3).map(component=>component/sine*angle);
};
const vectorLength=value=>Array.isArray(value)?Math.hypot(...value):0;
const vectorCosine=(left,right)=>{
  const leftLength=vectorLength(left);
  const rightLength=vectorLength(right);
  if(leftLength<.000001||rightLength<.000001)return null;
  return left.reduce((sum,component,index)=>sum+component*right[index],0)/(leftLength*rightLength);
};
const centerDistance=(left,right)=>left&&right?Math.hypot(left.cx-right.cx,left.cy-right.cy):Infinity;
const validCardinalGeometry=value=>value.cardinals.length===4&&value.cardinals.every(cardinal=>{
  const rect=cardinal.rect;
  return rect&&[rect.x,rect.y,rect.width,rect.height,rect.cx,rect.cy].every(Number.isFinite)&&rect.width>0&&rect.height>0;
});
const labelAligned=value=>{
  const foreground=value.root.rendered||value.root.focus;
  return value.primary.length===1&&value.visibleLabels.length===1&&value.primary[0]===foreground&&value.visibleLabels[0]===foreground;
};

const failures=[];
const checks=[];
const add=(id,pass,evidence)=>{
  checks.push({id,status:pass?'PASS':'FAIL',evidence});
  if(!pass)failures.push(id);
};

const initial=await mainSnapshot();
add('AUDIT_FOUR_STAR_PRESENCE',validCardinalGeometry(initial),{count:initial.cardinals.length,cardinals:initial.cardinals});
add('AUDIT_SINGLE_SETTLED_LABEL_INITIAL',labelAligned(initial),{focus:initial.root.focus,rendered:initial.root.rendered,primary:initial.primary,visibleLabels:initial.visibleLabels});
add('AUDIT_TABLET_SCENE_PRESERVATION',initial.sceneCenterError!==null&&Math.abs(initial.sceneCenterError-CURRENT_TABLET_SCENE_CENTER_ERROR)<=SCENE_BASELINE_TOLERANCE,{requiredBaseline:CURRENT_TABLET_SCENE_CENTER_ERROR,tolerance:SCENE_BASELINE_TOLERANCE,observed:initial.sceneCenterError});
const contextAligned=initial.contextCenterError.heading!==null&&initial.contextCenterError.guidance!==null&&Math.abs(initial.contextCenterError.heading)<=CONTEXT_CENTER_TOLERANCE&&Math.abs(initial.contextCenterError.guidance)<=CONTEXT_CENTER_TOLERANCE;
add('AUDIT_CONTEXTUAL_ALIGNMENT',contextAligned,{tolerance:CONTEXT_CENTER_TOLERANCE,errors:initial.contextCenterError,rects:initial.context});
add('AUDIT_NO_HORIZONTAL_OVERFLOW',Math.abs(initial.overflow)<=1,{overflow:initial.overflow});

const sceneHandle=await page.$('[data-compass-scene]');
await sceneHandle?.evaluate(element=>element.scrollIntoView({block:'center',inline:'nearest'}));

let interactionBaseline=null;
let previous=null;
let stableSamples=0;
const stabilizationSamples=[];
for(let index=0;index<20;index++){
  await sleep(120);
  const sample=await mainSnapshot();
  const primary=primaryOf(sample);
  const current=primary?.rect?{cx:primary.rect.cx,cy:primary.rect.cy,scrollY:sample.scrollY}:null;
  if(current&&previous){
    const delta=Math.hypot(current.cx-previous.cx,current.cy-previous.cy);
    const scrollDelta=Math.abs(current.scrollY-previous.scrollY);
    stabilizationSamples.push({sample:index+1,focus:sample.root.focus,rendered:sample.root.rendered,delta,scrollDelta,anchor:current});
    stableSamples=delta<=STABILIZATION_DELTA_TOLERANCE&&scrollDelta<=STABILIZATION_DELTA_TOLERANCE?stableSamples+1:0;
    if(stableSamples>=STABILIZATION_REQUIRED_SAMPLES){
      interactionBaseline=sample;
      break;
    }
  }else{
    stabilizationSamples.push({sample:index+1,focus:sample.root.focus,rendered:sample.root.rendered,anchor:current});
  }
  previous=current;
}
if(!interactionBaseline)interactionBaseline=await mainSnapshot();
const initialPrimary=primaryOf(interactionBaseline);
const initialAnchor=initialPrimary?.rect?{cx:initialPrimary.rect.cx,cy:initialPrimary.rect.cy}:null;

const motionCheckIds=[
  'AUDIT_POINTER_TRANSACTION_BINDING',
  'AUDIT_SETTLED_GEOMETRY',
  'AUDIT_SINGLE_SETTLED_LABEL',
  'AUDIT_RELEASE_CONTINUITY',
  'AUDIT_SAME_DIRECTION_INERTIA',
  'AUDIT_INERTIAL_ENDPOINT_COMMIT',
  'AUDIT_RELEASE_STABILITY'
];

if(!initialAnchor){
  for(const id of motionCheckIds)add(id,false,{reason:'NO_INITIAL_FOREGROUND_ANCHOR',stabilizationSamples});
}else{
  const bounds=await sceneHandle?.boundingBox();
  if(!bounds){
    for(const id of motionCheckIds)add(id,false,{reason:'NO_SCENE_BOUNDS'});
  }else{
    const transitions=[];
    const attempts=[];
    let transitionNavigation=null;
    let acceptedPointerCount=0;
    let dragBoundCount=0;
    let previewChangedCount=0;
    let committedChangeCount=0;

    for(let attempt=0;attempt<8&&transitions.length<REQUIRED_GEOMETRY_VALIDATION_TRANSITIONS;attempt++){
      const beforeResult=await safeSnapshot('attempt-'+(attempt+1)+'-before');
      if(!beforeResult.value){
        transitionNavigation=beforeResult.error;
        break;
      }
      const before=beforeResult.value;
      const currentPrimary=primaryOf(before);
      if(!currentPrimary?.rect){
        attempts.push({attempt:attempt+1,stage:'NO_CURRENT_PRIMARY'});
        continue;
      }

      const x1=currentPrimary.rect.cx;
      const y1=currentPrimary.rect.cy;
      const direction=attempt%2===0?1:-1;
      const proposed=x1+direction*bounds.width*DRAG_FRACTION;
      const x2=Math.min(bounds.x+bounds.width-18,Math.max(bounds.x+18,proposed));
      const y2=y1;
      navigationObserved=null;

      await page.mouse.move(x1,y1);
      await page.mouse.down({button:'left'});
      await sleep(35);
      const downResult=await safeSnapshot('attempt-'+(attempt+1)+'-down');
      if(!downResult.value){
        transitionNavigation=downResult.error;
        break;
      }
      acceptedPointerCount++;

      const thresholdX=x1+Math.sign(x2-x1)*Math.min(18,Math.abs(x2-x1));
      await page.mouse.move(thresholdX,y1,{steps:1});
      await sleep(45);
      const thresholdResult=await safeSnapshot('attempt-'+(attempt+1)+'-threshold');
      if(!thresholdResult.value){
        transitionNavigation=thresholdResult.error;
        break;
      }
      const threshold=thresholdResult.value;
      const dragBound=threshold.root.dragging==='true'&&threshold.root.gestureScope==='constellation';
      if(dragBound)dragBoundCount++;

      for(let step=2;step<=18;step++){
        const progress=step/18;
        await page.mouse.move(x1+(x2-x1)*progress,y1,{steps:1});
        await sleep(22);
      }
      await sleep(90);
      const previewResult=await safeSnapshot('attempt-'+(attempt+1)+'-preview');
      if(!previewResult.value){
        transitionNavigation=previewResult.error;
        break;
      }
      const preview=previewResult.value;
      const previewTravel=quaternionDistance(quaternionOf(before,'committedOrbitOrientation'),quaternionOf(preview));
      const previewChanged=previewTravel>.08;
      if(previewChanged)previewChangedCount++;

      await page.mouse.up({button:'left'});
      const releaseResult=await safeSnapshot('attempt-'+(attempt+1)+'-release');
      if(!releaseResult.value){
        transitionNavigation=releaseResult.error;
        break;
      }
      const release=releaseResult.value;

      const releaseQuaternionForTrace=quaternionOf(release);
      const motionSnapshots=[];
      const motionTrace=[];
      const motionPollStartedAt=Date.now();
      const motionPollDeadline=motionPollStartedAt+3400;
      let after=null;
      let receiptAnchor=null;
      let postReceiptStableSamples=0;
      while(Date.now()<motionPollDeadline){
        await sleep(45);
        if(navigationObserved){
          transitionNavigation={stage:'attempt-'+(attempt+1)+'-post-release-motion',...navigationObserved};
          break;
        }
        const sampleResult=await safeSnapshot('attempt-'+(attempt+1)+'-motion-'+(motionSnapshots.length+1));
        if(!sampleResult.value){
          transitionNavigation=sampleResult.error;
          break;
        }
        const sample=sampleResult.value;
        const travel=quaternionDistance(releaseQuaternionForTrace,quaternionOf(sample));
        const hasReceipt=sample.motion?.endpointPolicy==='COMMIT_INERTIAL_ENDPOINT_NO_SNAPBACK';
        let postReceiptGeometryDelta=null;
        if(hasReceipt){
          const primary=primaryOf(sample);
          const anchor=primary?.rect?{cx:primary.rect.cx,cy:primary.rect.cy}:null;
          if(anchor&&receiptAnchor){
            postReceiptGeometryDelta=Math.hypot(anchor.cx-receiptAnchor.cx,anchor.cy-receiptAnchor.cy);
            postReceiptStableSamples=postReceiptGeometryDelta<=STABILIZATION_DELTA_TOLERANCE?postReceiptStableSamples+1:0;
          }
          receiptAnchor=anchor;
        }
        motionSnapshots.push(sample);
        motionTrace.push({
          sample:motionSnapshots.length,
          elapsedMs:Date.now()-motionPollStartedAt,
          travelRadians:travel,
          phase:sample.root.phase,
          receipt:hasReceipt,
          inertiaActive:sample.root.inertiaActive,
          postReceiptGeometryDelta,
          postReceiptStableSamples
        });
        if(hasReceipt&&postReceiptStableSamples>=STABILIZATION_REQUIRED_SAMPLES){
          after=sample;
          break;
        }
      }
      if(transitionNavigation)break;
      if(!after)after=motionSnapshots[motionSnapshots.length-1]||release;
      const early=motionSnapshots.find(sample=>quaternionDistance(releaseQuaternionForTrace,quaternionOf(sample))>=MIN_INERTIAL_TRAVEL)||motionSnapshots[0]||release;

      await sleep(180);
      const settledResult=await safeSnapshot('attempt-'+(attempt+1)+'-settled');
      if(!settledResult.value){
        transitionNavigation=settledResult.error;
        break;
      }
      const settled=settledResult.value;

      const committedTravel=quaternionDistance(quaternionOf(before,'committedOrbitOrientation'),quaternionOf(after,'committedOrbitOrientation'));
      const committedChange=after.root.phase==='COMMITTED'&&committedTravel>.08;
      if(committedChange){
        committedChangeCount++;
        transitions.push({before,threshold,preview,release,early,after,settled,motionTrace});
      }
      attempts.push({
        attempt:attempt+1,
        from:before.root.focus,
        start:{x:x1,y:y1},
        end:{x:x2,y:y2},
        down:{phase:downResult.value.root.phase,dragging:downResult.value.root.dragging,gestureScope:downResult.value.root.gestureScope},
        threshold:{phase:threshold.root.phase,focus:threshold.root.focus,preview:threshold.root.preview,dragging:threshold.root.dragging,gestureScope:threshold.root.gestureScope,dragBound},
        preview:{phase:preview.root.phase,focus:preview.root.focus,preview:preview.root.preview,rendered:preview.root.rendered,previewTravel,previewChanged},
        release:{phase:release.root.phase,focus:release.root.focus,preview:release.root.preview,rendered:release.root.rendered},
        after:{phase:after.root.phase,focus:after.root.focus,preview:after.root.preview,rendered:after.root.rendered,committedTravel,committedChange,motionTrace}
      });
    }

    const bindingPass=!transitionNavigation&&acceptedPointerCount>0&&dragBoundCount>0&&previewChangedCount>0&&committedChangeCount>0;
    add('AUDIT_POINTER_TRANSACTION_BINDING',bindingPass,{
      acceptedPointerCount,
      dragBoundCount,
      previewChangedCount,
      committedChangeCount,
      inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',
      stabilization:{policy:'POST_SCROLL_STABLE_PRIMARY_AND_SCROLL_FRAME',requiredSamples:STABILIZATION_REQUIRED_SAMPLES,deltaTolerance:STABILIZATION_DELTA_TOLERANCE,samples:stabilizationSamples},
      attempts
    });
    if(transitionNavigation){
      add('AUDIT_TRANSITION_NAVIGATION',false,transitionNavigation);
    }else{
      add('AUDIT_TRANSITION_NAVIGATION',true,{navigationObserved:false,inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION'});
    }

    const validationTransitions=transitions.slice(0,REQUIRED_GEOMETRY_VALIDATION_TRANSITIONS);
    const geometryEvidence=validationTransitions.map(transition=>{
      const outgoingBefore=transition.before.cardinals.find(cardinal=>cardinal.wing===transition.before.root.focus);
      const outgoingAfter=transition.after.cardinals.find(cardinal=>cardinal.wing===transition.before.root.focus);
      const outgoingDeparture=centerDistance(outgoingBefore?.rect,outgoingAfter?.rect);
      const perCardinalDrift=transition.after.cardinals.map(cardinal=>{
        const late=transition.settled.cardinals.find(candidate=>candidate.wing===cardinal.wing);
        return{wing:cardinal.wing,drift:centerDistance(cardinal.rect,late?.rect)};
      });
      const settledDrift=Math.max(...perCardinalDrift.map(value=>value.drift));
      const pass=validCardinalGeometry(transition.after)&&validCardinalGeometry(transition.settled)&&settledDrift<=SETTLED_DRIFT_TOLERANCE&&labelAligned(transition.after)&&labelAligned(transition.settled);
      return{
        from:transition.before.root.focus,
        to:transition.after.root.focus,
        phase:transition.after.root.phase,
        outgoingDeparture,
        settledDrift,
        perCardinalDrift,
        primary:transition.after.primary,
        visibleLabels:transition.after.visibleLabels,
        status:pass?'PASS':'FAIL'
      };
    });
    const geometryPass=!transitionNavigation&&validationTransitions.length>=REQUIRED_GEOMETRY_VALIDATION_TRANSITIONS&&geometryEvidence.every(value=>value.status==='PASS');
    add('AUDIT_SETTLED_GEOMETRY',geometryPass,{
      requiredValidationTransitions:REQUIRED_GEOMETRY_VALIDATION_TRANSITIONS,
      observedCommittedTransitions:transitions.length,
      geometryPolicy:'ARBITRARY_ORBIT_ENDPOINT_PRESERVES_FOUR_CARDINAL_TOPOLOGY_AND_LATE_STABILITY',
      initialPresentationAnchor:initialAnchor,
      tolerances:{lateDrift:SETTLED_DRIFT_TOLERANCE},
      navigation:transitionNavigation,
      transactions:attempts,
      transitions:geometryEvidence
    });

    const labelPass=!transitionNavigation&&transitions.length>=1&&transitions.every(transition=>labelAligned(transition.after)&&labelAligned(transition.settled));
    add('AUDIT_SINGLE_SETTLED_LABEL',labelPass,{
      navigation:transitionNavigation,
      transitions:transitions.map(transition=>({
        from:transition.before.root.focus,
        to:transition.after.root.focus,
        rendered:transition.after.root.rendered,
        primary:transition.after.primary,
        visibleLabels:transition.after.visibleLabels
      }))
    });

    const releaseEvidence=transitions.map(transition=>{
      const previewQuaternion=quaternionOf(transition.preview);
      const releaseQuaternion=quaternionOf(transition.release);
      const receiptRelease=normalizeQuaternion(transition.after.motion?.releaseOrientation?.quaternion);
      const releaseJump=quaternionDistance(previewQuaternion,releaseQuaternion);
      const receiptError=quaternionDistance(previewQuaternion,receiptRelease);
      const pass=releaseJump<=RELEASE_JUMP_TOLERANCE&&receiptError<=RELEASE_RECEIPT_TOLERANCE;
      return{
        from:transition.before.root.focus,
        to:transition.after.root.focus,
        releaseJumpRadians:releaseJump,
        releaseReceiptErrorRadians:receiptError,
        previewQuaternion,
        observedReleaseQuaternion:releaseQuaternion,
        recordedReleaseQuaternion:receiptRelease,
        status:pass?'PASS':'FAIL'
      };
    });
    add('AUDIT_RELEASE_CONTINUITY',!transitionNavigation&&releaseEvidence.length>=1&&releaseEvidence.every(value=>value.status==='PASS'),{
      releaseJumpToleranceRadians:RELEASE_JUMP_TOLERANCE,
      releaseReceiptToleranceRadians:RELEASE_RECEIPT_TOLERANCE,
      transitions:releaseEvidence
    });

    const directionEvidence=transitions.map(transition=>{
      const dragVector=rotationVector(quaternionOf(transition.before,'committedOrbitOrientation'),quaternionOf(transition.preview));
      const inertiaVector=rotationVector(quaternionOf(transition.release),quaternionOf(transition.early));
      const dragTravel=vectorLength(dragVector);
      const inertialTravel=vectorLength(inertiaVector);
      const directionCosine=vectorCosine(dragVector,inertiaVector);
      const directIntermediateSamples=transition.motionTrace.filter(sample=>!sample.receipt&&sample.travelRadians>=MIN_INERTIAL_TRAVEL).length;
      const pass=dragTravel>MIN_INERTIAL_TRAVEL&&inertialTravel>=MIN_INERTIAL_TRAVEL&&directionCosine!==null&&directionCosine>=MIN_SAME_DIRECTION_COSINE&&directIntermediateSamples>=1;
      return{
        from:transition.before.root.focus,
        to:transition.after.root.focus,
        dragRotationVector:dragVector,
        inertialRotationVector:inertiaVector,
        dragTravelRadians:dragTravel,
        inertialTravelRadians:inertialTravel,
        directionCosine,
        directIntermediateSamples,
        status:pass?'PASS':'FAIL'
      };
    });
    add('AUDIT_SAME_DIRECTION_INERTIA',!transitionNavigation&&directionEvidence.length>=1&&directionEvidence.every(value=>value.status==='PASS'),{
      minimumInertialTravelRadians:MIN_INERTIAL_TRAVEL,
      minimumDirectionCosine:MIN_SAME_DIRECTION_COSINE,
      transitions:directionEvidence
    });

    const endpointEvidence=transitions.map(transition=>{
      const receipt=transition.after.motion;
      const releaseQuaternion=normalizeQuaternion(receipt?.releaseOrientation?.quaternion);
      const endpointQuaternion=normalizeQuaternion(receipt?.inertialEndpointOrientation?.quaternion);
      const finalReceiptQuaternion=normalizeQuaternion(receipt?.finalCommittedOrientation?.quaternion);
      const observedCommittedQuaternion=quaternionOf(transition.after,'committedOrbitOrientation');
      const endpointCommitError=quaternionDistance(endpointQuaternion,observedCommittedQuaternion);
      const receiptCommitError=quaternionDistance(endpointQuaternion,finalReceiptQuaternion);
      const endpointDeparture=quaternionDistance(releaseQuaternion,endpointQuaternion);
      const motionMs=Number(receipt?.totalMotionMs);
      const pass=Boolean(receipt)&&receipt.endpointPolicy==='COMMIT_INERTIAL_ENDPOINT_NO_SNAPBACK'&&receipt.returnTarget===null&&receipt.settlementMs===0&&motionMs>=MIN_MOTION_MS&&motionMs<=MAX_MOTION_MS&&endpointCommitError<=ENDPOINT_QUATERNION_TOLERANCE&&receiptCommitError<=ENDPOINT_QUATERNION_TOLERANCE&&endpointDeparture>=MIN_ENDPOINT_DEPARTURE;
      return{
        from:transition.before.root.focus,
        to:transition.after.root.focus,
        motionOwner:transition.after.root.motionOwner,
        endpointPolicy:receipt?.endpointPolicy||null,
        returnTarget:receipt?.returnTarget??null,
        inertiaMs:receipt?.inertiaMs??null,
        settlementMs:receipt?.settlementMs??null,
        totalMotionMs:receipt?.totalMotionMs??null,
        endpointCommitErrorRadians:endpointCommitError,
        receiptCommitErrorRadians:receiptCommitError,
        endpointDepartureRadians:endpointDeparture,
        status:pass?'PASS':'FAIL'
      };
    });
    add('AUDIT_INERTIAL_ENDPOINT_COMMIT',!transitionNavigation&&endpointEvidence.length>=1&&endpointEvidence.every(value=>value.status==='PASS'),{
      durationBoundsMs:{minimum:MIN_MOTION_MS,maximum:MAX_MOTION_MS},
      endpointToleranceRadians:ENDPOINT_QUATERNION_TOLERANCE,
      minimumEndpointDepartureRadians:MIN_ENDPOINT_DEPARTURE,
      transitions:endpointEvidence
    });

    const stabilityEvidence=transitions.map(transition=>{
      const afterQuaternion=quaternionOf(transition.after,'committedOrbitOrientation');
      const settledQuaternion=quaternionOf(transition.settled,'committedOrbitOrientation');
      const quaternionDrift=quaternionDistance(afterQuaternion,settledQuaternion);
      const primaryAfter=primaryOf(transition.after);
      const primarySettled=transition.settled.cardinals.find(cardinal=>cardinal.wing===primaryAfter?.wing);
      const geometryDrift=centerDistance(primaryAfter?.rect,primarySettled?.rect);
      const pass=quaternionDrift<=FINAL_QUATERNION_DRIFT_TOLERANCE&&geometryDrift<=SETTLED_DRIFT_TOLERANCE;
      return{to:transition.after.root.focus,quaternionDriftRadians:quaternionDrift,geometryDrift,status:pass?'PASS':'FAIL'};
    });
    add('AUDIT_RELEASE_STABILITY',!transitionNavigation&&stabilityEvidence.length>=1&&stabilityEvidence.every(value=>value.status==='PASS'),{
      policy:'LATE_ENDPOINT_STABILITY_AFTER_INERTIA_NOT_EARLY_TO_ENDPOINT_IMMOBILITY',
      quaternionToleranceRadians:FINAL_QUATERNION_DRIFT_TOLERANCE,
      geometryTolerance:SETTLED_DRIFT_TOLERANCE,
      transitions:stabilityEvidence
    });
  }
}

const responsiveSpecs=[
  {name:'desktop',width:1440,height:1000,deviceScaleFactor:1,isMobile:false,hasTouch:false},
  {name:'tablet',width:900,height:1000,deviceScaleFactor:1,isMobile:false,hasTouch:false},
  {name:'phone',width:390,height:844,deviceScaleFactor:1,isMobile:true,hasTouch:true},
  {name:'1080x2340-owner-reference',width:360,height:780,deviceScaleFactor:3,isMobile:true,hasTouch:true}
];
const responsiveEvidence=[];
for(const spec of responsiveSpecs){
  const probe=await browser.newPage();
  await probe.setViewport({
    width:spec.width,
    height:spec.height,
    deviceScaleFactor:spec.deviceScaleFactor,
    isMobile:spec.isMobile,
    hasTouch:spec.hasTouch
  });
  const errors=[];
  probe.on('pageerror',error=>{
    const entry={viewport:spec.name,error:String(error)};
    errors.push(entry);
    pageErrors.push(entry);
  });
  await probe.goto(base+'/',{waitUntil:'domcontentloaded',timeout:60000});
  await sleep(1500);
  const value=await snapshot(probe);
  const pass=validCardinalGeometry(value)&&labelAligned(value)&&Math.abs(value.overflow)<=1&&errors.length===0;
  responsiveEvidence.push({
    name:spec.name,
    cssViewport:{width:spec.width,height:spec.height},
    deviceScaleFactor:spec.deviceScaleFactor,
    physicalViewport:{width:spec.width*spec.deviceScaleFactor,height:spec.height*spec.deviceScaleFactor},
    cardinals:value.cardinals.length,
    rendered:value.root.rendered,
    primary:value.primary,
    visibleLabels:value.visibleLabels,
    overflow:value.overflow,
    errors,
    status:pass?'PASS':'FAIL'
  });
  await probe.close();
}
add('AUDIT_RESPONSIVE_VIEWPORTS',responsiveEvidence.every(value=>value.status==='PASS'),{viewports:responsiveEvidence});
add('AUDIT_NO_BROWSER_ERRORS',pageErrors.length===0,{errors:pageErrors});

const status=failures.length?'FAIL':'PASS';
const result={
  status,
  schema:'DGB_COMPASS_RELEASE_ORBIT_CONTINUITY_RUNTIME_v1',
  publicUrl:base+'/',
  auditAuthority:'AI_ENTRYPOINT.json + COMPASS construction plan + owner release-continuity requirement',
  inputBoundary:'LAWS_STYLE_POINTER_TRANSACTION',
  checks,
  failures,
  initial
};
fs.writeFileSync(out,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
if(status!=='PASS')process.exit(1);
