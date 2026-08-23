(()=>{'use strict';
const BUILD='gen1596-surgical-composite-3';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const force=(el,prop,value)=>el?.style?.setProperty(prop,value,'important');
const start=()=>{
  const root=q('[data-compass-root]');
  if(!root){requestAnimationFrame(start);return;}
  document.documentElement.dataset.compassComposite=BUILD;
  root.dataset.compassComposite=BUILD;

  const clearPriorCardinalForces=wing=>{
    ['background','border-color','box-shadow','outline-color'].forEach(prop=>wing.style.removeProperty(prop));
    qa('span',wing).forEach(span=>['display','opacity','visibility','pointer-events'].forEach(prop=>span.style.removeProperty(prop)));
  };

  const resolveSettledOwner=()=>{
    const wings=qa('[data-compass-cardinal]',root);
    const primary=wings.find(wing=>wing.dataset.primary==='true');
    if(primary)return primary.dataset.cardinalId||primary.dataset.wing||'north';
    return root.dataset.orbitFocus||root.dataset.readableCardinal||root.dataset.renderedForegroundCardinal||'north';
  };

  const syncCardinals=()=>{
    if(root.dataset.compassMode!=='CONSTELLATION')return;
    const readable=resolveSettledOwner();
    root.dataset.gen1596RenderedLabelOwner=readable;
    qa('[data-compass-cardinal]',root).forEach(wing=>{
      const id=wing.dataset.cardinalId||wing.dataset.wing||'';
      const active=id===readable;
      clearPriorCardinalForces(wing);
      wing.hidden=false;
      wing.removeAttribute('aria-hidden');
      if(wing.classList.contains('is-readable-cardinal')!==active)wing.classList.toggle('is-readable-cardinal',active);
      wing.tabIndex=active?0:-1;
      wing.dataset.gen1596StarOwner='present';
      wing.dataset.gen1596Readable=String(active);
    });
  };

  const suppressStaleMirrorlandLabel=()=>{
    const mode=root.dataset.compassMode||'CONSTELLATION';
    const mirror=q('[data-compass-object="mirrorland"]',root)||q('.compass-object--mirrorland',root);
    if(!mirror)return;
    const ordinary=mode==='CONSTELLATION'||mode==='CLUSTER_OPEN'||mode==='ROOM_SELECTED';
    if(ordinary){
      force(mirror,'background','transparent');
      force(mirror,'border-color','transparent');
      force(mirror,'box-shadow','none');
      force(mirror,'outline-color','transparent');
      force(mirror,'color','transparent');
      force(mirror,'text-shadow','none');
      qa('span',mirror).forEach(span=>{
        force(span,'display','none');force(span,'opacity','0');force(span,'visibility','hidden');force(span,'pointer-events','none');
      });
    }else{
      ['background','border-color','box-shadow','outline-color','color','text-shadow'].forEach(prop=>mirror.style.removeProperty(prop));
      qa('span',mirror).forEach(span=>['display','opacity','visibility','pointer-events'].forEach(prop=>span.style.removeProperty(prop)));
    }
  };

  const syncRooms=()=>{
    const labels=qa('.compass-projected-room-label',root);
    if(!labels.length)return;
    const mode=root.dataset.compassMode||'CONSTELLATION';
    if(mode==='CONSTELLATION'){labels.forEach(label=>label.removeAttribute('data-gen1596-current'));return;}
    const selected=root.dataset.selectedRoom||root.dataset.clusterPrimaryRoom||root.dataset.clusterPreviewPrimaryRoom||'';
    let owner=labels.find(label=>label.dataset.gen1587Current==='true')||null;
    if(!owner&&selected)owner=labels.find(label=>label.dataset.roomId===selected||label.getAttribute('data-room-id')===selected)||null;
    if(!owner)owner=labels.find(label=>!label.hidden&&getComputedStyle(label).display!=='none')||null;
    labels.forEach(label=>label===owner?label.dataset.gen1596Current='true':label.removeAttribute('data-gen1596-current'));
  };

  const suppressDuplicateCapabilityOwner=()=>{
    const accepted=q('.compass-monuments');
    if(!accepted)return;
    qa('[data-capability-orbit]').forEach(orbit=>{if(!accepted.contains(orbit))orbit.dataset.compassLegacyCapabilityOrbit='true';});
  };

  let scheduled=false;
  const sync=()=>{scheduled=false;syncCardinals();syncRooms();suppressStaleMirrorlandLabel();suppressDuplicateCapabilityOwner();};
  const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(sync);};
  const observer=new MutationObserver(schedule);
  observer.observe(root,{subtree:true,attributes:true,attributeFilter:['data-compass-mode','data-primary','data-orbit-focus','data-readable-cardinal','data-rendered-foreground-cardinal','data-selected-room','data-cluster-primary-room','data-cluster-preview-primary-room','data-gen1587-current','hidden','aria-current','class']});
  sync();
  setTimeout(sync,120);setTimeout(sync,350);setTimeout(sync,900);setTimeout(sync,1600);
};
start();
})();
