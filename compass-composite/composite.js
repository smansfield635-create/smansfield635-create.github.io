(()=>{'use strict';
const BUILD='gen1596-surgical-composite-5';
const PRESENTATION_OWNER='DGB_COMPASS_PRESENTATION_OWNER_GEN1591';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const force=(el,prop,value)=>el?.style?.setProperty(prop,value,'important');
const CARDINALS={
  north:{eyebrow:'North · Orientation',title:'Find your bearings before you choose a destination.',purpose:"Orientation is the estate's context-facing direction: products, entry points, human origin, guidance, and philosophy.",relationship:'Bring North forward when the question is still becoming clear. Open the star when you are ready to see its rooms.'},
  east:{eyebrow:'East · Worlds',title:'Sometimes a system becomes clearer when you can stand inside it.',purpose:'Worlds turns comparison, environment, history, civilization, and consequence into places you can explore.',relationship:'Bring East forward when place, contrast, or an alternate world can reveal relationships ordinary explanation leaves hidden.'},
  south:{eyebrow:'South · Instruments',title:'Measure, govern, and inspect without mistaking the instrument for the whole truth.',purpose:'Instruments gathers the Lab, Laws, Governance, and operational control surfaces.',relationship:'Bring South forward when the next responsibility is to measure, verify, govern, or decide what may happen next.'},
  west:{eyebrow:'West · Frontier',title:'When understanding is no longer enough, build the next thing.',purpose:"Frontier is the estate's construction-facing direction: prototypes, energy, water, infrastructure, and long-range design.",relationship:'Bring West forward when the next question is what should be made, tested, repaired, or carried forward.'}
};
const start=()=>{
  const root=q('[data-compass-root]');
  if(!root){requestAnimationFrame(start);return;}
  document.documentElement.dataset.compassComposite=BUILD;
  root.dataset.compassComposite=BUILD;
  root.dataset.compassCompositeOwnership='subordinate-presentation-augmentation';
  let interactionCommitted=false;
  let lastForeground='';

  const visibleCardinal=()=>{
    const wing=qa('[data-compass-cardinal]',root).find(w=>qa(':scope > span',w).some(span=>{const c=getComputedStyle(span);return Boolean((span.textContent||'').trim())&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)>0.5;}));
    return wing?.dataset.cardinalId||wing?.dataset.wing||'';
  };

  const commitInteraction=()=>{
    if(!interactionCommitted){interactionCommitted=true;root.dataset.compassInteractionCommitted='true';}
    const current=visibleCardinal()||root.dataset.renderedForegroundCardinal||root.dataset.orbitPreviewFocus||root.dataset.orbitFocus||'';
    if(CARDINALS[current])lastForeground=current;
    queueMicrotask(sync);
  };

  const lockForegroundContext=()=>{
    if(!interactionCommitted)return;
    const mode=root.dataset.compassMode||'CONSTELLATION';
    if(mode!=='CONSTELLATION')return;
    const current=visibleCardinal()||root.dataset.renderedForegroundCardinal||root.dataset.orbitPreviewFocus||root.dataset.orbitFocus||lastForeground;
    if(CARDINALS[current])lastForeground=current;
    if(!CARDINALS[lastForeground])return;
    const panel=q('[data-compass-panel]');
    if(!panel)return;
    const context=CARDINALS[lastForeground];
    const set=(selector,value)=>{const node=q(selector,panel);if(node&&node.textContent!==value)node.textContent=value;};
    set('[data-compass-panel-eyebrow]',context.eyebrow);
    set('[data-compass-panel-title]',context.title);
    set('[data-compass-panel-purpose]',context.purpose);
    set('[data-compass-panel-relationship]',context.relationship);
    panel.dataset.compassPersistentCardinal=lastForeground;
  };

  /* Preserve native cardinal ownership. The Compass controller alone decides
     which cardinal is readable. The composite is a subordinate visual
     augmentation and only removes a label shell when that rendered wing has
     no actually visible label text. */
  const suppressEmptyWingShells=()=>{
    if((root.dataset.compassMode||'CONSTELLATION')!=='CONSTELLATION')return;
    qa('[data-compass-cardinal]',root).forEach(wing=>{
      const hasVisibleText=qa(':scope > span',wing).some(span=>{
        const c=getComputedStyle(span);
        return Boolean((span.textContent||'').trim())&&c.display!=='none'&&c.visibility!=='hidden'&&Number(c.opacity)>0.5;
      });
      if(hasVisibleText){
        if(wing.dataset.gen1596EmptyShellSuppressed==='true'){
          ['background','border-color','box-shadow','outline-color'].forEach(prop=>wing.style.removeProperty(prop));
          delete wing.dataset.gen1596EmptyShellSuppressed;
        }
        return;
      }
      force(wing,'background','transparent');
      force(wing,'border-color','transparent');
      force(wing,'box-shadow','none');
      force(wing,'outline-color','transparent');
      wing.dataset.gen1596EmptyShellSuppressed='true';
    });
  };

  const suppressStaleMirrorlandLabel=()=>{
    const mode=root.dataset.compassMode||'CONSTELLATION';
    const mirror=q('[data-compass-object="mirrorland"]',root)||q('.compass-object--mirrorland',root);
    if(!mirror)return;
    const ordinary=mode==='CONSTELLATION'||mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED';
    if(ordinary){
      force(mirror,'background','transparent');force(mirror,'border-color','transparent');force(mirror,'box-shadow','none');force(mirror,'outline-color','transparent');force(mirror,'color','transparent');force(mirror,'text-shadow','none');
      qa('span',mirror).forEach(span=>{force(span,'display','none');force(span,'opacity','0');force(span,'visibility','hidden');force(span,'pointer-events','none');});
      mirror.dataset.gen1596MirrorlandLabelSuppressed='true';
    }else{
      ['background','border-color','box-shadow','outline-color','color','text-shadow'].forEach(prop=>mirror.style.removeProperty(prop));
      qa('span',mirror).forEach(span=>['display','opacity','visibility','pointer-events'].forEach(prop=>span.style.removeProperty(prop)));
      delete mirror.dataset.gen1596MirrorlandLabelSuppressed;
    }
  };

  const syncRooms=()=>{
    const labels=qa('.compass-projected-room-label',root);if(!labels.length)return;
    const mode=root.dataset.compassMode||'CONSTELLATION';
    if(mode==='CONSTELLATION'){labels.forEach(label=>label.removeAttribute('data-gen1596-current'));return;}
    const selected=root.dataset.selectedRoom||root.dataset.clusterPrimaryRoom||root.dataset.clusterPreviewPrimaryRoom||'';
    let owner=labels.find(label=>label.dataset.gen1587Current==='true')||null;
    if(!owner&&selected)owner=labels.find(label=>label.dataset.roomId===selected||label.getAttribute('data-room-id')===selected)||null;
    if(!owner)owner=labels.find(label=>!label.hidden&&getComputedStyle(label).display!=='none')||null;
    labels.forEach(label=>{if(label===owner)label.dataset.gen1596Current='true';else label.removeAttribute('data-gen1596-current');});
  };

  const suppressDuplicateCapabilityOwner=()=>{const accepted=q('.compass-monuments');if(!accepted)return;qa('[data-capability-orbit]').forEach(orbit=>{if(!accepted.contains(orbit))orbit.dataset.compassLegacyCapabilityOrbit='true';});};
  const sync=()=>{syncRooms();suppressStaleMirrorlandLabel();suppressEmptyWingShells();lockForegroundContext();suppressDuplicateCapabilityOwner();};
  const scene=q('[data-compass-scene]');
  scene?.addEventListener('pointerdown',commitInteraction,{passive:true});
  scene?.addEventListener('touchstart',commitInteraction,{passive:true});
  scene?.addEventListener('keydown',commitInteraction);
  scene?.addEventListener('click',commitInteraction,{passive:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{subtree:true,attributes:true,childList:true,characterData:true,attributeFilter:['data-compass-mode','data-selected-room','data-cluster-primary-room','data-cluster-preview-primary-room','data-gen1587-current','data-rendered-foreground-cardinal','data-orbit-focus','data-orbit-preview-focus','hidden','aria-current','style','class']});
  sync();
  setTimeout(sync,60);setTimeout(sync,120);setTimeout(sync,250);setTimeout(sync,500);setTimeout(sync,900);setTimeout(sync,1600);
};
const startSubordinate=()=>{
  let frames=0;
  const ready=()=>{
    const owner=globalThis[PRESENTATION_OWNER];
    const receipt=globalThis.DGB_COMPASS_PRESENTATION_RETIREMENT_V2;
    if(owner?.mounted&&receipt?.mounted){
      globalThis.DGB_COMPASS_COMPOSITE_SUBORDINATE=Object.freeze({mounted:true,build:BUILD,owner:PRESENTATION_OWNER,ownership:'SUBORDINATE_PRESENTATION_AUGMENTATION',mechanicsAuthority:'DGB_COMPASS_CONTROLLER'});
      start();
      return;
    }
    if(frames++<120){requestAnimationFrame(ready);return;}
    throw new Error('COMPASS_COMPOSITE_PRESENTATION_OWNER_NOT_MOUNTED');
  };
  if(document.readyState==='complete'||document.readyState==='interactive')queueMicrotask(ready);else document.addEventListener('DOMContentLoaded',ready,{once:true});
};
startSubordinate();
})();
