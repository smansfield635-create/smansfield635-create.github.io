(function(root){
  'use strict';
  const DATA=root.R8F_DATA;
  const COORDINATES=root.R8F_COORDINATES;
  const PROJECTION=root.R8F_PROJECTION;
  if(!DATA||!COORDINATES||!PROJECTION) throw new Error('R8F_RUNTIME_DEPENDENCY_MISSING');

  const state={
    activeDeliveryStateId:DATA.navigation.startStateId,
    chartId:DATA.defaultChartId,
    swipeStartX:null,
    swipeStartY:null
  };

  const els={
    stage:document.getElementById('spatial-stage'),
    field:document.getElementById('spatial-field'),
    edges:document.getElementById('spatial-edges'),
    breadcrumb:document.getElementById('breadcrumb'),
    depth:document.getElementById('depth-readout'),
    coordinate:document.getElementById('coordinate-readout'),
    frameName:document.getElementById('frame-name'),
    detailTitle:document.getElementById('detail-title'),
    detailType:document.getElementById('detail-type'),
    detailBody:document.getElementById('detail-body'),
    evidenceList:document.getElementById('evidence-list'),
    equivalentList:document.getElementById('equivalent-list'),
    back:document.getElementById('back-button'),
    scope:document.getElementById('scope-disclosure'),
    frameButtons:Array.from(document.querySelectorAll('[data-coordinate-frame]'))
  };

  const statesById=PROJECTION.statesById;
  const claimById=Object.fromEntries(DATA.claims.map(function(claim){return [claim.id,claim];}));
  const claimByRelationId=Object.fromEntries(DATA.claims.map(function(claim){return [claim.relationId,claim];}));

  function claimForDeliveryState(deliveryState){
    if(deliveryState.contextFrameId==='CLAIM') return claimById[deliveryState.sourceObjectIdentityRef]||null;
    if(deliveryState.contextFrameId==='RELATION') return claimByRelationId[deliveryState.sourceObjectIdentityRef]||null;
    if(deliveryState.contextFrameId==='STUDY'){
      const relationId=deliveryState.typedRelationRefs[0];
      return claimByRelationId[relationId]||null;
    }
    return null;
  }

  function chart(){
    return DATA.systemCoordinateCharts.find(function(item){return item.chartId===state.chartId;});
  }

  function frameBounds(){
    const records=Object.values(COORDINATES.coordinateStateRegistry[state.chartId]);
    const mins=[Infinity,Infinity,Infinity];
    const maxs=[-Infinity,-Infinity,-Infinity];
    records.forEach(function(record){
      record.coordinateVector.forEach(function(value,index){
        mins[index]=Math.min(mins[index],value);
        maxs[index]=Math.max(maxs[index],value);
      });
    });
    return {mins:mins,maxs:maxs};
  }

  function normalize(value,min,max){
    if(max===min) return 0;
    return ((value-min)/(max-min))*2-1;
  }

  function screenPosition(record,bounds,width,height){
    const v=record.coordinateVector;
    const nx=normalize(v[0],bounds.mins[0],bounds.maxs[0]);
    const ny=normalize(v[1],bounds.mins[1],bounds.maxs[1]);
    const nz=normalize(v[2],bounds.mins[2],bounds.maxs[2]);
    return {
      x:width*0.5 + nx*width*0.32 + nz*width*0.10,
      y:height*0.52 + ny*height*0.23 - nz*height*0.18,
      scale:0.78 + (nz+1)*0.12,
      z:nz
    };
  }

  function isNavigable(targetId){
    if(targetId===state.activeDeliveryStateId) return true;
    const active=statesById[state.activeDeliveryStateId];
    const target=statesById[targetId];
    if(!active||!target) return false;
    if(DATA.navigation.parentByStateId[state.activeDeliveryStateId]===targetId) return true;
    const children=DATA.navigation.childrenByStateId[state.activeDeliveryStateId]||[];
    if(children.includes(targetId)) return true;
    let cursor=DATA.navigation.parentByStateId[state.activeDeliveryStateId];
    while(cursor){
      if(cursor===targetId) return true;
      cursor=DATA.navigation.parentByStateId[cursor];
    }
    return false;
  }

  function activate(targetId){
    if(!isNavigable(targetId)) return;
    state.activeDeliveryStateId=targetId;
    render();
    const target=document.querySelector('[data-delivery-state-id="'+CSS.escape(targetId)+'"]');
    if(target) target.focus({preventScroll:true});
  }

  function goBack(){
    const parent=DATA.navigation.parentByStateId[state.activeDeliveryStateId];
    if(parent) activate(parent);
  }

  function breadcrumbLabels(activeStateId){
    const chain=[];
    let cursor=activeStateId;
    while(cursor){
      chain.unshift(cursor);
      cursor=DATA.navigation.parentByStateId[cursor];
    }
    return chain.map(function(id){
      const st=statesById[id];
      if(st.contextFrameId==='ROOT') return 'Methods';
      if(st.contextFrameId==='DESTINATION') return 'Battery';
      if(st.contextFrameId==='CLAIM') return claimById[st.sourceObjectIdentityRef].label;
      if(st.contextFrameId==='RELATION') return claimByRelationId[st.sourceObjectIdentityRef].relation.type.replaceAll('_',' ');
      return 'Study';
    });
  }

  function nodeClass(node){
    const meta=node.scientificMeta||{};
    const direction=(meta.direction||'').toLowerCase();
    return ['field-node','role-'+node.role.toLowerCase(),direction==='adverse'?'is-adverse':'',direction==='supporting'?'is-supporting':''].filter(Boolean).join(' ');
  }

  function renderSpatial(projection){
    const rect=els.stage.getBoundingClientRect();
    const width=Math.max(rect.width,320);
    const height=Math.max(rect.height,380);
    const bounds=frameBounds();
    const positions={};
    els.field.replaceChildren();
    projection.nodes.forEach(function(node){
      const pos=screenPosition(node.coordinateState,bounds,width,height);
      positions[node.deliveryStateId]=pos;
      const button=document.createElement('button');
      button.type='button';
      button.className=nodeClass(node);
      button.dataset.deliveryStateId=node.deliveryStateId;
      button.style.left=pos.x+'px';
      button.style.top=pos.y+'px';
      button.style.transform='translate(-50%,-50%) scale('+pos.scale+')';
      button.style.zIndex=String(20+Math.round((pos.z+1)*20));
      button.setAttribute('aria-current',node.role==='ACTIVE'?'true':'false');
      button.setAttribute('aria-label',node.label+'; '+node.contextFrameId+'; coordinate '+node.coordinateState.coordinateVector.join(', '));
      const type=document.createElement('span');
      type.className='node-type';
      type.textContent=node.contextFrameId;
      const label=document.createElement('span');
      label.className='node-label';
      label.textContent=node.label;
      const coord=document.createElement('span');
      coord.className='node-coordinate';
      coord.textContent='['+node.coordinateState.coordinateVector.join(' · ')+']';
      button.append(type,label,coord);
      if(!isNavigable(node.deliveryStateId)){
        button.disabled=true;
        button.setAttribute('aria-disabled','true');
      }else{
        button.addEventListener('click',function(){activate(node.deliveryStateId);});
      }
      els.field.appendChild(button);
    });

    els.edges.setAttribute('viewBox','0 0 '+width+' '+height);
    els.edges.replaceChildren();
    projection.edges.forEach(function(edge){
      const from=positions[edge.from];
      const to=positions[edge.to];
      if(!from||!to) return;
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',from.x);
      line.setAttribute('y1',from.y);
      line.setAttribute('x2',to.x);
      line.setAttribute('y2',to.y);
      line.setAttribute('class','field-edge '+(edge.type==='TYPED_RELATION'||edge.type==='STUDY_EVIDENCE'?'relation-edge':'delivery-edge'));
      line.setAttribute('aria-hidden','true');
      els.edges.appendChild(line);
    });
  }

  function renderEquivalentContext(projection){
    els.equivalentList.replaceChildren();
    projection.nodes.forEach(function(node){
      const item=document.createElement('li');
      const button=document.createElement('button');
      button.type='button';
      button.dataset.deliveryStateId=node.deliveryStateId;
      button.className='equivalent-item';
      button.disabled=!isNavigable(node.deliveryStateId);
      button.innerHTML='<strong>'+escapeHtml(node.label)+'</strong><span>'+escapeHtml(node.contextFrameId)+' · '+escapeHtml(node.role)+' · ['+node.coordinateState.coordinateVector.map(escapeHtml).join(', ')+']</span>';
      if(!button.disabled) button.addEventListener('click',function(){activate(node.deliveryStateId);});
      item.appendChild(button);
      els.equivalentList.appendChild(item);
    });
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,function(char){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char];
    });
  }

  function renderDetail(projection){
    const activeState=statesById[state.activeDeliveryStateId];
    const activeNode=projection.nodes.find(function(node){return node.deliveryStateId===state.activeDeliveryStateId;});
    const activeClaim=claimForDeliveryState(activeState);
    els.detailTitle.textContent=activeNode.label;
    els.detailType.textContent=activeState.contextFrameId+' · '+activeState.sourceObjectIdentityRef;
    const chunks=[];
    if(activeState.contextFrameId==='ROOT'){
      chunks.push('Enter the bounded Methods & Models battery vertical. The spatial field is the native review surface; there is no alternate non-spatial product mode.');
    }else if(activeState.contextFrameId==='DESTINATION'){
      chunks.push(DATA.boundedScope.disclosure);
      chunks.push('Four claim branches are available: one supporting within its domain bound and three adverse component/comparator results.');
    }else if(activeClaim){
      chunks.push(activeClaim.relation.summary);
      chunks.push('Scientific state: '+activeClaim.status+'.');
      chunks.push('Claim ceiling: '+activeClaim.ceiling+'.');
    }
    if(activeState.contextFrameId==='STUDY'){
      chunks.push('Study standing: '+DATA.study.standing+'. Evaluation cycles: '+DATA.study.evaluationCycles+'.');
    }
    els.detailBody.textContent=chunks.join(' ');
    els.evidenceList.replaceChildren();
    if(activeState.contextFrameId==='STUDY'){
      DATA.claims.forEach(function(claim){
        const li=document.createElement('li');
        li.className=claim.relation.direction==='ADVERSE'?'evidence-adverse':'evidence-supporting';
        li.innerHTML='<strong>'+escapeHtml(claim.label)+'</strong><span>'+escapeHtml(claim.relation.direction)+' · '+escapeHtml(claim.relation.summary)+'</span>';
        els.evidenceList.appendChild(li);
      });
    }else if(activeClaim){
      const li=document.createElement('li');
      li.className=activeClaim.relation.direction==='ADVERSE'?'evidence-adverse':'evidence-supporting';
      li.innerHTML='<strong>'+escapeHtml(activeClaim.relation.type.replaceAll('_',' '))+'</strong><span>'+escapeHtml(activeClaim.relation.direction)+' · '+escapeHtml(activeClaim.relation.summary)+'</span>';
      els.evidenceList.appendChild(li);
    }
  }

  function render(){
    const projection=PROJECTION.project(state.activeDeliveryStateId,state.chartId);
    const coordinate=COORDINATES.getCoordinateState(state.chartId,state.activeDeliveryStateId);
    const currentChart=chart();
    els.scope.textContent=DATA.boundedScope.disclosure;
    els.breadcrumb.textContent=breadcrumbLabels(state.activeDeliveryStateId).join('  /  ');
    els.depth.textContent='Depth '+statesById[state.activeDeliveryStateId].recursiveDepth;
    els.coordinate.textContent='Coordinate ['+coordinate.coordinateVector.join(', ')+']';
    els.frameName.textContent=currentChart.systemId+' · '+currentChart.representedDimensions.join(' / ');
    els.back.disabled=!DATA.navigation.parentByStateId[state.activeDeliveryStateId];
    els.frameButtons.forEach(function(button){
      const selected=button.dataset.coordinateFrame===state.chartId;
      button.setAttribute('aria-pressed',selected?'true':'false');
      button.classList.toggle('is-selected',selected);
    });
    renderSpatial(projection);
    renderEquivalentContext(projection);
    renderDetail(projection);
  }

  els.back.addEventListener('click',goBack);
  els.frameButtons.forEach(function(button){
    button.addEventListener('click',function(){
      const next=button.dataset.coordinateFrame;
      if(next===state.chartId) return;
      if(!COORDINATES.coordinateStateRegistry[next]) return;
      state.chartId=next;
      render();
    });
  });

  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'||(event.altKey&&event.key==='ArrowLeft')||(event.key==='Backspace'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement&&document.activeElement.tagName))){
      if(DATA.navigation.parentByStateId[state.activeDeliveryStateId]){
        event.preventDefault();
        goBack();
      }
    }
  });

  els.stage.addEventListener('pointerdown',function(event){
    state.swipeStartX=event.clientX;
    state.swipeStartY=event.clientY;
  });
  els.stage.addEventListener('pointerup',function(event){
    if(state.swipeStartX===null) return;
    const dx=event.clientX-state.swipeStartX;
    const dy=event.clientY-state.swipeStartY;
    state.swipeStartX=null;
    state.swipeStartY=null;
    if(dx>72&&Math.abs(dy)<48) goBack();
  });

  window.addEventListener('resize',function(){render();},{passive:true});
  render();
})(typeof globalThis!=='undefined'?globalThis:this);
