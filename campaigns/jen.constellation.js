/* DGB_JEN_SOURCE_CONSTELLATION_v2
   Donor-exact composition:
   - Products owns visual geometry/compositor/planet/cosmos unchanged.
   - Laws + Main Compass own transition grammar through this bounded adapter.
   - Jen source records remain semantic/navigation authority.
*/
(()=>{
  "use strict";
  if(document.documentElement.dataset.page!=="jen-leney")return;

  const SOURCE_SLOT_IDS=Object.freeze(["archcoin","five-flags","aai","education","nutrition","book"]);
  const ORIENTATION_PHASES=Object.freeze({IDLE:"IDLE",PREVIEW:"PREVIEW",SETTLING:"SETTLING",COMMITTED:"COMMITTED",CANCELLED:"CANCELLED"});
  const STATES=Object.freeze({CLUSTER_OPEN:"CLUSTER_OPEN",PRODUCT_SELECTED:"PRODUCT_SELECTED",HELD:"HELD"});
  const Q_ID=Object.freeze([0,0,0,1]);
  const CLUSTER=Object.freeze({horizontalRadius:1.34,verticalRadius:1.12,depthRadius:1.06,primaryAnchor:Object.freeze([0,.70,.714]),latitudeAmplitude:.50,latitudeFrequency:1.67});
  const SETTLE_MS=360;

  const source=document.querySelector('[data-community-source-carousel]');
  if(!source)return;
  const originalCards=[...source.querySelectorAll('a.community-source-carousel__card')];
  if(originalCards.length!==6)return;
  const section=source.closest('.campaign-route-panel');
  if(!section)return;

  const records=Object.freeze(originalCards.map((card,index)=>Object.freeze({
    slotId:SOURCE_SLOT_IDS[index],
    href:card.href,
    label:card.querySelector('strong')?.textContent?.trim()||`Source ${index+1}`,
    kicker:card.querySelector('small')?.textContent?.trim()||String(index+1).padStart(2,'0'),
    summary:card.querySelector('span')?.textContent?.trim()||"Open source"
  })));
  const recordBySlot=new Map(records.map(record=>[record.slotId,record]));

  function ensureStylesheet(href,key){
    if(document.querySelector(`link[data-jen-donor-style="${key}"]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    link.dataset.jenDonorStyle=key;
    document.head.append(link);
  }
  ensureStylesheet('/products/index.compass.css','products-compass');

  const cue=section.querySelector('.community-source-carousel__cue');
  if(cue)cue.textContent='Drag or swipe the source cluster. Bring a star forward to reveal it; tap the committed foreground star to open its source. Tap the globe for navigation.';

  const shell=document.createElement('div');
  shell.className='jen-source-cluster products-page';
  shell.dataset.pageId='products';
  shell.dataset.productsRoot='true';
  shell.dataset.productsState=STATES.CLUSTER_OPEN;
  shell.dataset.productsHeld='false';
  shell.dataset.orbitFocus='products';
  shell.dataset.orbitPreviewFocus='products';
  shell.dataset.orbitPhase=ORIENTATION_PHASES.COMMITTED;
  shell.dataset.orbitGestureActive='false';
  shell.dataset.orbitRevision='0';
  shell.dataset.orbitQuaternion='[0,0,0,1]';
  shell.dataset.productsActiveCluster='products';
  shell.dataset.clusterPrimaryProduct=SOURCE_SLOT_IDS[0];
  shell.dataset.clusterPreviewPrimaryProduct=SOURCE_SLOT_IDS[0];
  shell.dataset.clusterPhase=ORIENTATION_PHASES.COMMITTED;
  shell.dataset.clusterGestureActive='false';
  shell.dataset.clusterRevision='0';
  shell.dataset.clusterQuaternion='[0,0,0,1]';
  shell.dataset.productsSelectedId='';
  shell.dataset.productsSelectedRoute='';
  shell.dataset.productsPanelDescended='false';
  shell.dataset.reducedMotion=String(Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches));

  const scene=document.createElement('div');
  scene.className='jen-source-cluster__scene products-scene';
  scene.dataset.productsScene='true';
  scene.dataset.productsSceneField='true';
  scene.setAttribute('role','group');
  scene.setAttribute('aria-label','Jen Leney six-source spherical cluster. Drag or swipe to rotate. Tap a foreground source to open it.');
  scene.tabIndex=0;

  const cosmos=document.createElement('div');
  cosmos.className='products-cosmic-field';
  cosmos.dataset.productsCosmicField='true';
  cosmos.setAttribute('aria-hidden','true');
  scene.append(cosmos);

  const compassLayer=document.createElement('div');
  compassLayer.className='products-compass-layer';
  compassLayer.dataset.productsCompassLayer='true';
  compassLayer.dataset.productsCenterLayer='true';
  compassLayer.dataset.productsCompassPhysicalProjection='FIXED_CENTER_INDEPENDENT_SIBLING';
  compassLayer.dataset.productsCompassSemanticModel='HOME_COMPASS_CONTROL';
  compassLayer.dataset.productsCompassPresentation='fixed-center';

  const globeButton=document.createElement('button');
  globeButton.type='button';
  globeButton.className='products-compass-control';
  globeButton.dataset.upstreamCompassControl='true';
  globeButton.dataset.productsCenterControl='true';
  globeButton.dataset.productsCenterRoute='/';
  globeButton.dataset.productsCenterRole='MAIN_COMPASS_RETURN_DISCLOSURE';
  globeButton.dataset.fixedCenter='true';
  globeButton.setAttribute('aria-label','Open community traversal navigation');
  globeButton.setAttribute('aria-controls','jen-source-center-menu');
  globeButton.setAttribute('aria-expanded','false');

  const globeMount=document.createElement('span');
  globeMount.className='products-compass-mount products-planet-mount';
  globeMount.dataset.upstreamCompassMount='true';
  globeMount.dataset.productsCompassVisualMount='true';
  globeMount.dataset.productsPlanetMount='true';
  globeMount.dataset.productsCompassVisualOnly='true';
  globeMount.dataset.productsCompassPointerAuthority='false';
  globeMount.dataset.productsPlanetWorldPosition='0,0,0';
  globeMount.dataset.productsPlanetProductMember='false';
  globeMount.dataset.productsPlanetLabelMember='false';
  globeMount.dataset.productsPlanetSettlementMember='false';
  globeMount.dataset.productsPlanetNavigationAuthority='false';
  globeMount.setAttribute('aria-hidden','true');
  globeButton.append(globeMount);
  const hiddenGlobeLabel=document.createElement('span');
  hiddenGlobeLabel.className='products-compass-control__label';
  hiddenGlobeLabel.textContent='Community navigation';
  globeButton.append(hiddenGlobeLabel);
  compassLayer.append(globeButton);
  scene.append(compassLayer);

  const semantic=document.createElement('div');
  semantic.className='products-semantic';
  semantic.dataset.productsSemantic='true';
  semantic.setAttribute('aria-label','Jen Leney source controls');

  const primary=document.createElement('button');
  primary.type='button';
  primary.className='products-star products-star--primary';
  primary.dataset.productsPrimaryEntry='true';
  primary.dataset.destinationType='cluster-entry';
  primary.dataset.destinationId='products';
  primary.dataset.label='SOURCES';
  primary.hidden=true;
  primary.tabIndex=-1;
  primary.setAttribute('aria-hidden','true');
  semantic.append(primary);

  records.forEach(record=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='products-star jen-source-semantic-star';
    button.dataset.productsProduct='true';
    button.dataset.productId=record.slotId;
    button.dataset.destinationType='source';
    button.dataset.destinationId=record.slotId;
    button.dataset.label=record.label;
    button.dataset.route=record.href;
    button.setAttribute('aria-label',`Bring ${record.label} forward. When foregrounded, tap again to open source.`);
    const label=document.createElement('span');label.className='products-star__label';label.textContent=record.label;
    const short=document.createElement('span');short.className='products-star__short';short.textContent=record.kicker;
    button.append(label,short);
    semantic.append(button);
  });
  scene.append(semantic);
  shell.append(scene);

  const identity=document.createElement('div');
  identity.className='jen-source-identity';
  identity.setAttribute('aria-live','polite');
  identity.innerHTML='<small>Foreground source</small><strong></strong><span></span>';
  shell.append(identity);

  const centerMenu=document.createElement('div');
  centerMenu.id='jen-source-center-menu';
  centerMenu.className='jen-source-center-menu';
  centerMenu.hidden=true;
  centerMenu.setAttribute('role','group');
  centerMenu.setAttribute('aria-label','Community traversal navigation');
  const orbitButton=document.createElement('button');
  orbitButton.type='button';orbitButton.textContent='Return to Orbit';
  const compassLink=document.createElement('a');
  compassLink.href='/';compassLink.textContent='Return to Main Compass';
  centerMenu.append(orbitButton,compassLink);
  shell.append(centerMenu);

  for(const attr of ['controller','crystals','cosmos','planet']){
    const output=document.createElement('output');
    output.hidden=true;output.setAttribute('aria-hidden','true');
    output.dataset[`products${attr[0].toUpperCase()+attr.slice(1)}Receipt`]='true';
    shell.append(output);
  }

  source.replaceWith(shell);

  const state={
    current:STATES.CLUSTER_OPEN,
    phase:ORIENTATION_PHASES.COMMITTED,
    gestureActive:false,
    revision:0,
    orientation:{quaternion:Q_ID.slice(),primaryId:SOURCE_SLOT_IDS[0]},
    committed:{quaternion:Q_ID.slice(),primaryId:SOURCE_SLOT_IDS[0]},
    primary:SOURCE_SLOT_IDS[0],
    previewPrimary:SOURCE_SLOT_IDS[0],
    settlingTimer:0,
    centerOpen:false,
    reducedMotion:Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  };

  const finite=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
  const norm3=(v,f=[0,0,1])=>{const a=[finite(v?.[0]),finite(v?.[1]),finite(v?.[2])],n=Math.hypot(...a);return n>1e-12?a.map(x=>x/n):f.slice();};
  const qn=(v,f=Q_ID)=>{const a=(Array.isArray(v)||ArrayBuffer.isView(v))?Array.from(v):[];if(a.length!==4)return Array.from(f);const q=a.map((x,i)=>finite(x,i===3?1:0)),n=Math.hypot(...q);return n>1e-8?q.map(x=>x/n):Array.from(f);};
  const qRaw=(a,b)=>[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
  const qm=(a,b)=>qn(qRaw(qn(a),qn(b)));
  const qc=v=>{const q=qn(v);return[-q[0],-q[1],-q[2],q[3]];};
  const rotate=(q,v)=>{const r=qRaw(qRaw(qn(q),[finite(v?.[0]),finite(v?.[1]),finite(v?.[2]),0]),qc(q));return[r[0],r[1],r[2]];};
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const axisAngle=(axis,angle)=>{const n=norm3(axis),h=angle*.5,s=Math.sin(h);return qn([n[0]*s,n[1]*s,n[2]*s,Math.cos(h)]);};
  const between=(from,to)=>{const a=norm3(from),b=norm3(to),c=Math.max(-1,Math.min(1,dot(a,b)));if(c>.999999)return Q_ID.slice();if(c<-.999999){let x=cross([1,0,0],a);if(Math.hypot(...x)<1e-6)x=cross([0,1,0],a);return axisAngle(x,Math.PI);}const x=cross(a,b);return qn([x[0],x[1],x[2],1+c]);};
  const clusterVector=(index,count)=>{const safe=Math.max(1,count),longitude=Math.PI*2*index/safe-Math.PI/2,latitude=Math.sin((index+.5)*CLUSTER.latitudeFrequency)*CLUSTER.latitudeAmplitude,c=Math.cos(latitude);return norm3([Math.cos(longitude)*c,Math.sin(latitude),Math.sin(longitude)*c]);};
  const vectors=new Map(SOURCE_SLOT_IDS.map((id,index)=>[id,clusterVector(index,SOURCE_SLOT_IDS.length)]));
  const anchor=norm3(CLUSTER.primaryAnchor);
  const primaryFrom=q=>{let id=SOURCE_SLOT_IDS[0],score=-Infinity;for(const slot of SOURCE_SLOT_IDS){const s=dot(norm3(rotate(q,vectors.get(slot))),anchor);if(s>score){score=s;id=slot;}}return id;};
  const settledFor=(slot,current)=>{const base=vectors.get(slot)||vectors.get(SOURCE_SLOT_IDS[0]);return qm(between(rotate(current,base),anchor),current);};

  function syncDom(action='sync'){
    shell.dataset.productsState=state.current;
    shell.dataset.productsActiveCluster='products';
    shell.dataset.clusterPrimaryProduct=state.primary;
    shell.dataset.clusterPreviewPrimaryProduct=state.previewPrimary;
    shell.dataset.clusterPhase=state.phase;
    shell.dataset.clusterGestureActive=String(state.gestureActive);
    shell.dataset.clusterRevision=String(state.revision);
    shell.dataset.clusterQuaternion=JSON.stringify(state.orientation.quaternion);
    shell.dataset.jenSourceAction=action;
    const record=recordBySlot.get(state.phase===ORIENTATION_PHASES.PREVIEW?state.previewPrimary:state.primary)||records[0];
    identity.querySelector('strong').textContent=record.label;
    identity.querySelector('span').textContent=record.summary;
    for(const button of semantic.querySelectorAll('[data-products-product]')){
      const id=button.dataset.productId;
      const committed=id===state.primary&&state.phase===ORIENTATION_PHASES.COMMITTED;
      button.dataset.jenCommittedForeground=String(committed);
      const r=recordBySlot.get(id);
      button.setAttribute('aria-label',committed?`Open ${r.label} source`:`Bring ${r.label} forward`);
    }
    globalThis.DGB_JEN_SOURCE_CONSTELLATION_RECEIPT=Object.freeze({
      contract:'DGB_JEN_SOURCE_CONSTELLATION_DONOR_EXACT_v2',
      geometryDonor:'/products/index.crystals.js',
      compositorDonor:'/products/index.compositor.js',
      planetDonor:'/products/index.planet.js',
      cosmosDonor:'/products/index.cosmos.js',
      transitionDonors:Object.freeze(['/laws/index.interactions.js','/laws/index.controller.js','/assets/compass/compass.controller.js']),
      state:state.current,phase:state.phase,primarySource:state.primary,revision:state.revision,
      geometryInvented:false,cameraInvented:false,planetInvented:false
    });
  }

  function freezeOrientation(o){return Object.freeze({quaternion:Object.freeze(Array.from(qn(o?.quaternion))),primaryId:String(o?.primaryId||'')});}
  function frame(){
    return Object.freeze({
      state:state.current,
      orbitFocus:'products',orbitPreviewFocus:'products',orbitPhase:ORIENTATION_PHASES.COMMITTED,orbitGestureActive:false,orbitRevision:0,
      orbitOrientation:freezeOrientation({quaternion:Q_ID,primaryId:'products'}),committedOrbitOrientation:freezeOrientation({quaternion:Q_ID,primaryId:'products'}),
      activeClusterId:'products',
      cluster:Object.freeze({id:'products',productIds:Object.freeze(SOURCE_SLOT_IDS.slice()),primaryProduct:state.primary,previewPrimaryProduct:state.previewPrimary,phase:state.phase,gestureActive:state.gestureActive,revision:state.revision,orientation:freezeOrientation(state.orientation),committedOrientation:freezeOrientation(state.committed)}),
      selectedProductId:'',selectedDestinationType:'',selectedDestinationId:'',selectedDestinationLabel:'',selectedRoute:'',selectedPreviewRecord:null,panelDescended:false,reducedMotion:state.reducedMotion
    });
  }

  function commitAfterSettle(quaternion,primaryId,action){
    clearTimeout(state.settlingTimer);
    state.phase=ORIENTATION_PHASES.SETTLING;
    state.gestureActive=false;
    state.orientation={quaternion:qn(quaternion),primaryId};
    state.previewPrimary=primaryId;
    syncDom(`${action}-settling`);
    const finish=()=>{
      state.phase=ORIENTATION_PHASES.COMMITTED;
      state.primary=primaryId;
      state.previewPrimary=primaryId;
      state.committed={quaternion:qn(quaternion),primaryId};
      state.orientation={quaternion:qn(quaternion),primaryId};
      state.revision+=1;
      syncDom(`${action}-committed`);
    };
    if(state.reducedMotion)finish();else state.settlingTimer=setTimeout(finish,SETTLE_MS);
    return true;
  }

  const controller=Object.freeze({
    contract:Object.freeze({id:'PRODUCTS_CONTROLLER_COMPASS_NAVIGATION_ANCHOR_v2',adapter:'DGB_JEN_SOURCE_LAWS_COMPASS_ADAPTER_v1'}),
    receipt:()=>globalThis.DGB_JEN_SOURCE_CONSTELLATION_RECEIPT,
    getFrameState:frame,
    beginOrbitGesture:()=>false,
    requestOrbitPreview:()=>false,
    requestOrbitCommit:()=>false,
    requestOrbitCancel:()=>true,
    beginClusterGesture(payload={}){
      clearTimeout(state.settlingTimer);
      state.phase=ORIENTATION_PHASES.PREVIEW;state.gestureActive=true;
      const q=qn(payload.quaternion||state.committed.quaternion);
      state.orientation={quaternion:q,primaryId:state.primary};state.previewPrimary=state.primary;syncDom('gesture-begin');return true;
    },
    requestClusterPreview(payload={}){
      if(!state.gestureActive)state.gestureActive=true;
      state.phase=ORIENTATION_PHASES.PREVIEW;
      const q=qn(payload.quaternion||state.orientation.quaternion);
      const p=SOURCE_SLOT_IDS.includes(payload.primaryProductId)?payload.primaryProductId:primaryFrom(q);
      state.orientation={quaternion:q,primaryId:p};state.previewPrimary=p;syncDom('gesture-preview');return true;
    },
    requestClusterCommit(payload={}){
      const q=qn(payload.quaternion||state.orientation.quaternion);
      const p=SOURCE_SLOT_IDS.includes(payload.primaryProductId)?payload.primaryProductId:primaryFrom(q);
      return commitAfterSettle(q,p,'gesture');
    },
    requestClusterCancel(){
      clearTimeout(state.settlingTimer);state.phase=ORIENTATION_PHASES.CANCELLED;state.gestureActive=false;state.orientation={quaternion:state.committed.quaternion.slice(),primaryId:state.primary};state.previewPrimary=state.primary;syncDom('gesture-cancelled');
      requestAnimationFrame(()=>{state.phase=ORIENTATION_PHASES.COMMITTED;syncDom('gesture-restored');});return true;
    },
    requestReturnToConstellation:()=>false,
    requestPrimaryProductsSelection:()=>false,
    requestProductSelection(slotId){
      if(!SOURCE_SLOT_IDS.includes(slotId))return false;
      if(state.phase===ORIENTATION_PHASES.COMMITTED&&slotId===state.primary){
        const record=recordBySlot.get(slotId);if(record){globalThis.location.assign(record.href);return true;}return false;
      }
      const q=settledFor(slotId,state.orientation.quaternion);
      return commitAfterSettle(q,slotId,'direct-foreground');
    },
    requestCompassSelection(){
      state.centerOpen=!state.centerOpen;
      centerMenu.hidden=!state.centerOpen;
      globeButton.setAttribute('aria-expanded',String(state.centerOpen));
      if(state.centerOpen)orbitButton.focus({preventScroll:true});
      syncDom(state.centerOpen?'center-open':'center-close');
      return true;
    },
    requestReturnToMainCompass(){globalThis.location.assign('/');return true;},
    requestReturnToOrbit(){state.centerOpen=false;centerMenu.hidden=true;globeButton.setAttribute('aria-expanded','false');scene.focus({preventScroll:true});syncDom('return-to-orbit');return true;},
    requestEnterProduct:()=>false
  });
  globalThis.DGB_PRODUCTS_CONTROLLER=controller;
  orbitButton.addEventListener('click',()=>controller.requestReturnToOrbit());

  /* Prevent semantic controls from navigating independently; Products renderer
     remains hit/projection authority and calls controller.requestProductSelection. */
  semantic.addEventListener('click',event=>{
    const button=event.target.closest('[data-products-product]');
    if(!button)return;
    event.preventDefault();event.stopPropagation();
    controller.requestProductSelection(button.dataset.productId||'');
  },true);

  function loadScript(src,key){
    return new Promise((resolve,reject)=>{
      if(document.querySelector(`script[data-jen-donor-script="${key}"]`)){resolve();return;}
      const script=document.createElement('script');script.src=src;script.defer=false;script.dataset.jenDonorScript=key;
      script.onload=()=>resolve();script.onerror=()=>reject(new Error(`JEN_DONOR_LOAD_FAILED:${src}`));document.body.append(script);
    });
  }

  async function boot(){
    try{
      syncDom('adapter-ready');
      await loadScript('/assets/audralia/audralia.planet.js?build=jen-source-donor-v2','audralia-geometry');
      await loadScript('/products/index.cosmos.js?build=jen-source-donor-v2','products-cosmos');
      await loadScript('/products/index.planet.js?build=jen-source-donor-v2','products-planet');
      await loadScript('/products/index.compositor.js?build=jen-source-donor-v2','products-compositor');
      await loadScript('/products/index.crystals.js?build=jen-source-donor-v2','products-crystals');
      document.documentElement.dataset.jenSourceConstellationStatus='ready';
      syncDom('donors-mounted');
    }catch(error){
      document.documentElement.dataset.jenSourceConstellationStatus='held';
      shell.dataset.jenSourceFailure=error?.message||String(error);
      console.error(error);
    }
  }
  boot();
})();
