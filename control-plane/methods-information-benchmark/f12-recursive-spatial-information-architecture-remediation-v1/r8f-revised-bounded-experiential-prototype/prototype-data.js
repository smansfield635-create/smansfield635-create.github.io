(function(root,factory){
  const value=factory();
  if(typeof module==='object'&&module.exports) module.exports=value;
  else root.R8F_DATA=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const SCIENCE=Object.freeze({
    head:'d39d9f110ed7fe16109ddcb5b8043b3752c1a36e',
    scientificStateDigest:'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5',
    relationGraphDigest:'4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b',
    projectionGraphDigest:'9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8'
  });
  const STUDY=Object.freeze({
    id:'BATTERY_COHERENCE_HELDOUT_STUDY',
    label:'Battery coherence held-out study',
    domain:'ENERGY_BATTERY',
    class:'EMPIRICAL_STUDY',
    admission:'LEVEL_A_STATEFUL',
    standing:'DOMAIN_SPECIFIC_HELD_OUT_EMPIRICAL_SUPPORT_WITH_ADVERSE_COMPONENT_TESTS',
    evaluationCycles:1653,
    source:Object.freeze({pr:43,merge:'49a11c15780ebe3404947c8eccbdd537f056e37a',evidenceBlob:'bdcfef012c1c0f23485030339555ca46c9d6b776'})
  });
  const CLAIMS=Object.freeze([
    Object.freeze({id:'UCIC_CLAIM_BATTERY_HELDOUT_DOMAIN_SIGNAL',label:'Held-out domain signal',status:'SUPPORTED_WITHIN_DOMAIN_BOUND',ceiling:'DOMAIN_SPECIFIC_HELD_OUT_EMPIRICAL_SUPPORT_ONLY',relationId:'BATTERY_DOMAIN',relation:Object.freeze({type:'DOMAIN_HELDOUT_PERFORMANCE',direction:'SUPPORTING',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'Axis logistic AUROC 0.9394 on 1,653 cell-disjoint held-out cycles.'})}),
    Object.freeze({id:'UCIC_CLAIM_BATTERY_INCREMENT_OVER_BURDEN',label:'Increment over burden',status:'NOT_SUPPORTED',ceiling:'NO_INCREMENTAL_SUPERIORITY_OVER_BURDEN_CLAIM',relationId:'BATTERY_BURDEN',relation:Object.freeze({type:'COMPARATOR_CHALLENGE',direction:'ADVERSE',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'Burden AUROC 0.9704 exceeded combined 0.9394.'})}),
    Object.freeze({id:'UCIC_CLAIM_BATTERY_HSTAR_INCREMENT',label:'H* incremental value',status:'NOT_SUPPORTED',ceiling:'NO_HSTAR_INCREMENTAL_SUPERIORITY_CLAIM',relationId:'BATTERY_HSTAR',relation:Object.freeze({type:'COMPONENT_INCREMENT_TEST',direction:'ADVERSE',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'Raw plus H* AUROC 0.7770 versus raw 0.7850; delta -0.0080.'})}),
    Object.freeze({id:'UCIC_CLAIM_BATTERY_HARD_MQ',label:'Hard MQ conjunction',status:'NOT_SUPPORTED',ceiling:'NO_HARD_MQ_SUPPORT_CLAIM',relationId:'BATTERY_MQ',relation:Object.freeze({type:'HARD_CONJUNCTION_TEST',direction:'ADVERSE',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'MQ sensitivity 0%; balanced accuracy 0.4994.'})})
  ]);
  const ROOT_ID='METHODS_AND_MODELS_ROOT';
  const DEST_ID='METHODS_AND_MODELS';
  const SPINE='BATTERY_VERTICAL_SPINE';
  const SOURCE_DIGESTS=Object.freeze([SCIENCE.scientificStateDigest,SCIENCE.relationGraphDigest,SCIENCE.projectionGraphDigest,STUDY.source.evidenceBlob]);

  function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.freeze(value);Object.values(value).forEach(freeze);}return value;}
  function deliveryState(id,identity,frame,family,relations,depth,lineage,evidence,ceiling,scientific){
    return freeze({
      deliveryStateId:id,sourceObjectIdentityRef:identity,contextFrameId:frame,destinationRef:DEST_ID,
      familyDescriptorRef:family,typedRelationRefs:relations,recursiveDepth:depth,ancestorLineage:lineage,
      evidenceStandingRef:evidence,claimCeilingRef:ceiling,scientificStateRef:scientific,sourceAuthorityRef:SCIENCE.head,
      sourceRecordDigests:SOURCE_DIGESTS,temporalDescriptorRef:'BATTERY_HELDOUT_1653_CYCLES',
      disclosureStateRef:'R8F_BOUNDED_CONTEXT_LOCAL',continuityStateRef:'R7_CONTINUITY_CORE',
      canonicalPresenceState:'PRESENT_IN_CANONICAL_STATE'
    });
  }

  const CANONICAL=[
    deliveryState('DS_ROOT_METHODS',ROOT_ID,'ROOT',SPINE,[],0,[],'NOT_APPLICABLE_NONSCIENTIFIC_CONTAINER','NOT_APPLICABLE_NONSCIENTIFIC_CONTAINER','NONSCIENTIFIC_DELIVERY_CONTAINER'),
    deliveryState('DS_DEST_METHODS',DEST_ID,'DESTINATION',SPINE,[],1,[ROOT_ID],'NOT_APPLICABLE_DESTINATION_CONTAINER','NOT_APPLICABLE_DESTINATION_CONTAINER','NONSCIENTIFIC_DELIVERY_CONTAINER')
  ];
  CLAIMS.forEach(function(claim,index){
    const n=index+1;
    CANONICAL.push(
      deliveryState('DS_CLAIM_'+n,claim.id,'CLAIM',claim.id,[claim.relationId],2,[ROOT_ID,DEST_ID],claim.relation.standing,claim.ceiling,claim.status),
      deliveryState('DS_RELATION_'+n,claim.relationId,'RELATION',claim.id,[claim.relationId],3,[ROOT_ID,DEST_ID,claim.id],claim.relation.standing,claim.ceiling,claim.status),
      deliveryState('DS_STUDY_'+n,STUDY.id,'STUDY',claim.id,[claim.relationId],4,[ROOT_ID,DEST_ID,claim.id,claim.relationId],STUDY.standing,claim.ceiling,STUDY.standing)
    );
  });
  freeze(CANONICAL);

  function entries(object){return Object.entries(object).map(function(pair){return {value:pair[0],coordinate:pair[1]};});}
  const families=[SPINE].concat(CLAIMS.map(function(c){return c.id;}));
  const branch={}; branch[SPINE]=0; CLAIMS.forEach(function(c,i){branch[c.id]=(i-1.5)*2;});
  const lineageBranch={}; lineageBranch[SPINE]=0; CLAIMS.forEach(function(c,i){lineageBranch[c.id]=(1.5-i)*3;});
  const frames={ROOT:0,DESTINATION:1,CLAIM:2,RELATION:3,STUDY:4};
  const identities=[ROOT_ID,DEST_ID].concat(CLAIMS.map(function(c){return c.id;}),CLAIMS.map(function(c){return c.relationId;}),[STUDY.id]);
  const identityMap={}; identities.forEach(function(id,i){identityMap[id]=i*1.5;});
  const overlap='R8F_BATTERY_STRUCTURE_LINEAGE_OVERLAP';
  function dimension(id,index,label,semantic,source,values,rule,authority){
    return freeze({dimensionId:id,dimensionIndex:index,label:label,semanticClass:semantic,sourceDeliveryFieldRefs:[source],valueDomain:values,normalizationRule:rule,distanceParticipation:false,authorityBasis:authority});
  }
  function chart(id,system,represented,dimensions,peer){
    return freeze({
      chartId:id,chartVersion:'1',systemId:system,canonicalDomainDeclaration:{type:'ALL_ADMITTED_DELIVERY_STATES'},
      codomainDimension:3,representedDimensions:represented,coordinateSemantics:dimensions,recoverabilityClass:'EXACT_COORDINATE_CHART',
      metricPolicy:{distanceMeaning:'NONE'},topologyPolicy:{neighborhoodMeaning:'NONE'},
      overlapDeclarations:[{overlapId:overlap,peerChartId:peer,peerChartVersion:'1',canonicalOverlapPolicy:'DECLARED_CANONICAL_DOMAIN_INTERSECTION',resolutionPolicy:'EXACT_CANONICAL_STATE_REGISTRY_RESOLUTION',reciprocityRequired:true}],
      authorityBasis:'R8F_BOUNDED_PROTOTYPE_DELIVERY_CHART_UNDER_R8B',chartDigest:'AUTO_DERIVE'
    });
  }
  const CHART_STRUCTURE=chart(
    'METHODS_BATTERY_STRUCTURE_FRAME_v1','METHODS_BATTERY_STRUCTURE_SYSTEM',
    ['BRANCH_AXIS','FRAME_AXIS','DEPTH_AXIS'],
    [
      dimension('BRANCH_AXIS',0,'Bounded branch lane','INDEX_COORDINATE','familyDescriptorRef',{type:'DECLARED_VALUES',values:families},{type:'DECLARED_LOOKUP',entries:entries(branch)},'R8F_BOUNDED_DELIVERY_CHART_ONLY'),
      dimension('FRAME_AXIS',1,'Context-frame order','ORDINAL_NUMERIC','contextFrameId',{type:'DECLARED_VALUES',values:Object.keys(frames)},{type:'DECLARED_LOOKUP',entries:entries(frames)},'R3_R4_CONTEXT_AND_RECURSIVE_NAVIGATION_STATE'),
      dimension('DEPTH_AXIS',2,'Recursive delivery depth','ORDINAL_NUMERIC','recursiveDepth',{type:'ANY_FINITE_NUMBER'},{type:'IDENTITY_NUMERIC'},'R4_RECURSIVE_DEPTH_DELIVERY_STATE')
    ],
    'METHODS_BATTERY_LINEAGE_FRAME_v1'
  );
  const CHART_LINEAGE=chart(
    'METHODS_BATTERY_LINEAGE_FRAME_v1','METHODS_BATTERY_LINEAGE_SYSTEM',
    ['IDENTITY_AXIS','DEPTH_AXIS_L','BRANCH_AXIS_L'],
    [
      dimension('IDENTITY_AXIS',0,'Persistent object identity lane','INDEX_COORDINATE','sourceObjectIdentityRef',{type:'DECLARED_VALUES',values:identities},{type:'DECLARED_LOOKUP',entries:entries(identityMap)},'R8F_BOUNDED_DELIVERY_CHART_ONLY'),
      dimension('DEPTH_AXIS_L',1,'Scaled recursive depth','ORDINAL_NUMERIC','recursiveDepth',{type:'ANY_FINITE_NUMBER'},{type:'AFFINE_NUMERIC',scale:2,offset:0},'R4_RECURSIVE_DEPTH_DELIVERY_STATE'),
      dimension('BRANCH_AXIS_L',2,'Lineage branch lane','INDEX_COORDINATE','familyDescriptorRef',{type:'DECLARED_VALUES',values:families},{type:'DECLARED_LOOKUP',entries:entries(lineageBranch)},'R8F_BOUNDED_DELIVERY_CHART_ONLY')
    ],
    'METHODS_BATTERY_STRUCTURE_FRAME_v1'
  );

  const parent={DS_DEST_METHODS:'DS_ROOT_METHODS'};
  const children={DS_ROOT_METHODS:['DS_DEST_METHODS'],DS_DEST_METHODS:[]};
  const relationByClaim={},studyByRelation={},claimByRelation={};
  CLAIMS.forEach(function(_,index){
    const n=index+1,c='DS_CLAIM_'+n,r='DS_RELATION_'+n,s='DS_STUDY_'+n;
    parent[c]='DS_DEST_METHODS'; parent[r]=c; parent[s]=r;
    children.DS_DEST_METHODS.push(c); children[c]=[r]; children[r]=[s]; children[s]=[];
    relationByClaim[c]=r; studyByRelation[r]=s; claimByRelation[r]=c;
  });

  return freeze({
    prototypeId:'METHODS_F12_R8F_BATTERY_NATIVE_SPATIAL_PROTOTYPE_v1',
    title:'Methods & Models · Native Spatial Evidence Field',
    subtitle:'R8F revised bounded experiential prototype',
    destination:DEST_ID,scientificAuthority:SCIENCE,
    boundedScope:{label:'BATTERY_VERTICAL_ONLY',completeDestination:false,disclosure:'This review surface materializes only the certified battery vertical. It does not represent the full Methods & Models estate.'},
    study:STUDY,claims:CLAIMS,canonicalDeliveryStates:CANONICAL,
    systemCoordinateCharts:[CHART_STRUCTURE,CHART_LINEAGE],defaultChartId:CHART_STRUCTURE.chartId,
    navigation:{startStateId:'DS_ROOT_METHODS',parentByStateId:parent,childrenByStateId:children,claimStateByRelationState:claimByRelation,relationStateByClaimState:relationByClaim,studyStateByRelationState:studyByRelation},
    userDifferential:'NOT_YET_REVIEWED'
  });
});
