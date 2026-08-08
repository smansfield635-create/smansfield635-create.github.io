(function(root,factory){
  const data = typeof module==='object'&&module.exports ? require('./prototype-data.js') : root.R8F_DATA;
  const coordinates = typeof module==='object'&&module.exports ? require('./prototype-coordinate-state.js') : root.R8F_COORDINATES;
  const value = factory(data,coordinates);
  if(typeof module==='object'&&module.exports) module.exports=value;
  else root.R8F_PROJECTION=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(DATA,COORDINATES){
  'use strict';

  const statesById=Object.fromEntries(DATA.canonicalDeliveryStates.map(function(state){return [state.deliveryStateId,state];}));
  const claimById=Object.fromEntries(DATA.claims.map(function(claim){return [claim.id,claim];}));
  const claimStateIds=DATA.claims.map(function(_,index){return 'DS_CLAIM_'+(index+1);});
  const relationStateIds=DATA.claims.map(function(_,index){return 'DS_RELATION_'+(index+1);});

  function unique(values){ return Array.from(new Set(values)); }
  function parentChain(activeStateId){
    const result=[];
    let cursor=DATA.navigation.parentByStateId[activeStateId];
    while(cursor){
      result.unshift(cursor);
      cursor=DATA.navigation.parentByStateId[cursor];
    }
    return result;
  }
  function exposureFor(activeStateId){
    const active=statesById[activeStateId];
    if(!active) throw new Error('R8F_UNKNOWN_ACTIVE_STATE:'+activeStateId);
    const ancestors=parentChain(activeStateId);
    let exposed=[activeStateId].concat(ancestors);
    if(active.contextFrameId==='ROOT'){
      exposed.push('DS_DEST_METHODS');
    }else if(active.contextFrameId==='DESTINATION'){
      exposed=exposed.concat(claimStateIds);
    }else if(active.contextFrameId==='CLAIM'){
      exposed.push(DATA.navigation.relationStateByClaimState[activeStateId]);
    }else if(active.contextFrameId==='RELATION'){
      exposed.push(DATA.navigation.studyStateByRelationState[activeStateId]);
    }else if(active.contextFrameId==='STUDY'){
      exposed=unique(['DS_DEST_METHODS',activeStateId].concat(claimStateIds,relationStateIds));
    }
    return unique(exposed);
  }
  function labelFor(state){
    if(state.contextFrameId==='ROOT') return 'Methods & Models';
    if(state.contextFrameId==='DESTINATION') return 'Battery evidence vertical';
    if(state.contextFrameId==='CLAIM') return claimById[state.sourceObjectIdentityRef].label;
    if(state.contextFrameId==='RELATION'){
      const claim=DATA.claims.find(function(item){return item.relationId===state.sourceObjectIdentityRef;});
      return claim ? claim.relation.type.replaceAll('_',' ') : state.sourceObjectIdentityRef;
    }
    if(state.contextFrameId==='STUDY') return DATA.study.label;
    return state.sourceObjectIdentityRef;
  }
  function scientificMeta(state){
    if(state.contextFrameId==='CLAIM'){
      const claim=claimById[state.sourceObjectIdentityRef];
      return {status:claim.status,ceiling:claim.ceiling,direction:claim.relation.direction,summary:claim.relation.summary};
    }
    if(state.contextFrameId==='RELATION'){
      const claim=DATA.claims.find(function(item){return item.relationId===state.sourceObjectIdentityRef;});
      return claim ? {status:claim.status,ceiling:claim.ceiling,direction:claim.relation.direction,summary:claim.relation.summary} : {};
    }
    if(state.contextFrameId==='STUDY'){
      return {status:DATA.study.standing,ceiling:state.claimCeilingRef,direction:'MIXED_WITH_ADVERSE_COMPONENT_TESTS',summary:'1 supporting and 3 adverse declared battery relations are preserved in this bounded study context.'};
    }
    return {};
  }
  function roleFor(stateId,activeStateId){
    if(stateId===activeStateId) return 'ACTIVE';
    if(parentChain(activeStateId).includes(stateId)) return 'ANCESTOR';
    const state=statesById[stateId];
    const activeState=statesById[activeStateId];
    if(activeState&&activeState.contextFrameId==='STUDY'&&!parentChain(activeStateId).includes(stateId)) return 'BACKGROUND';
    if(state.contextFrameId==='RELATION') return 'RELATION';
    if(state.contextFrameId==='STUDY') return 'EVIDENCE';
    return 'AVAILABLE';
  }
  function edgesFor(exposed,activeStateId){
    const set=new Set(exposed);
    const edges=[];
    function add(from,to,type,label){
      if(set.has(from)&&set.has(to)) edges.push({from:from,to:to,type:type,label:label});
    }
    add('DS_ROOT_METHODS','DS_DEST_METHODS','DELIVERY_PARENT','destination');
    claimStateIds.forEach(function(claimStateId,index){
      const relationStateId='DS_RELATION_'+(index+1);
      add('DS_DEST_METHODS',claimStateId,'DELIVERY_BRANCH','claim');
      add(claimStateId,relationStateId,'TYPED_RELATION',DATA.claims[index].relationId);
      const active=statesById[activeStateId];
      if(active&&active.contextFrameId==='STUDY'){
        add(relationStateId,activeStateId,'STUDY_EVIDENCE',DATA.claims[index].relationId);
      }else{
        add(relationStateId,'DS_STUDY_'+(index+1),'STUDY_EVIDENCE',DATA.claims[index].relationId);
      }
    });
    return edges;
  }

  function project(activeStateId,chartId){
    const exposed=exposureFor(activeStateId);
    const disclosureStateByCanonicalObject={};
    DATA.canonicalDeliveryStates.forEach(function(state){
      disclosureStateByCanonicalObject[state.deliveryStateId]=exposed.includes(state.deliveryStateId)
        ? 'EXPOSED_BY_PROJECTION'
        : 'HIDDEN_BY_PROJECTION';
    });
    const nodes=exposed.map(function(stateId){
      const state=statesById[stateId];
      return Object.freeze({
        deliveryStateId:stateId,
        sourceObjectIdentityRef:state.sourceObjectIdentityRef,
        contextFrameId:state.contextFrameId,
        label:labelFor(state),
        role:roleFor(stateId,activeStateId),
        coordinateState:COORDINATES.getCoordinateState(chartId,stateId),
        scientificMeta:scientificMeta(state)
      });
    });
    return Object.freeze({
      projectionStateId:'R8F_PROJECTION::'+chartId+'::'+activeStateId,
      projectionId:'R8F_CONTEXT_LOCAL_NATIVE_SPATIAL_PROJECTION_v1',
      sourceCoordinateChartId:chartId,
      activeDeliveryStateId:activeStateId,
      nodes:Object.freeze(nodes),
      edges:Object.freeze(edgesFor(exposed,activeStateId)),
      disclosureStateByCanonicalObject:Object.freeze(disclosureStateByCanonicalObject),
      canonicalAbsenceInferredFromHidden:false,
      presentationMayChangeDisclosure:false
    });
  }

  return Object.freeze({
    id:'R8F_CONTEXT_LOCAL_PROJECTION_RUNTIME_v1',
    project:project,
    statesById:Object.freeze(statesById),
    sourceCoordinateStateRegistryId:COORDINATES.id,
    hiddenByProjectionIsCanonicalAbsence:false,
    coordinateAuthorship:false,
    scientificAuthorship:false
  });
});
