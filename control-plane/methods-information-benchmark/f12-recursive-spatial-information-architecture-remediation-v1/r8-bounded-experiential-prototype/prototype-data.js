(function(root,factory){const value=factory();if(typeof module==='object'&&module.exports)module.exports=value;else root.R8_DATA=value;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  return Object.freeze({
    prototypeId:'METHODS_F12_R8_BATTERY_VERTICAL_PROTOTYPE_v1',
    title:'Methods & Models · Battery Evidence Vertical',
    subtitle:'Bounded R8 experiential prototype — not the full estate',
    destination:'METHODS_AND_MODELS',
    scientificAuthorityHead:'d39d9f110ed7fe16109ddcb5b8043b3752c1a36e',
    scientificStateDigest:'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5',
    relationGraphDigest:'4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b',
    projectionGraphDigest:'9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8',
    boundedScope:{label:'BATTERY_VERTICAL_ONLY',completeDestination:false,disclosure:'This prototype intentionally materializes only the certified battery vertical. Other Methods & Models claims remain outside this R8 review surface.'},
    study:{
      id:'BATTERY_COHERENCE_HELDOUT_STUDY',
      label:'Battery coherence held-out study',
      domain:'ENERGY_BATTERY',
      class:'EMPIRICAL_STUDY',
      admission:'LEVEL_A_STATEFUL',
      standing:'DOMAIN_SPECIFIC_HELD_OUT_EMPIRICAL_SUPPORT_WITH_ADVERSE_COMPONENT_TESTS',
      evaluationCycles:1653,
      source:{pr:43,merge:'49a11c15780ebe3404947c8eccbdd537f056e37a',evidenceBlob:'bdcfef012c1c0f23485030339555ca46c9d6b776'}
    },
    claims:[
      {
        id:'UCIC_CLAIM_BATTERY_HELDOUT_DOMAIN_SIGNAL',
        label:'Held-out domain signal',
        status:'SUPPORTED_WITHIN_DOMAIN_BOUND',
        ceiling:'DOMAIN_SPECIFIC_HELD_OUT_EMPIRICAL_SUPPORT_ONLY',
        relationId:'BATTERY_DOMAIN',
        relation:{type:'DOMAIN_HELDOUT_PERFORMANCE',direction:'SUPPORTING',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'Axis logistic AUROC 0.9394 on 1,653 cell-disjoint held-out cycles.'}
      },
      {
        id:'UCIC_CLAIM_BATTERY_INCREMENT_OVER_BURDEN',
        label:'Increment over burden',
        status:'NOT_SUPPORTED',
        ceiling:'NO_INCREMENTAL_SUPERIORITY_OVER_BURDEN_CLAIM',
        relationId:'BATTERY_BURDEN',
        relation:{type:'COMPARATOR_CHALLENGE',direction:'ADVERSE',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'Burden AUROC 0.9704 exceeded combined 0.9394.'}
      },
      {
        id:'UCIC_CLAIM_BATTERY_HSTAR_INCREMENT',
        label:'H* incremental value',
        status:'NOT_SUPPORTED',
        ceiling:'NO_HSTAR_INCREMENTAL_SUPERIORITY_CLAIM',
        relationId:'BATTERY_HSTAR',
        relation:{type:'COMPONENT_INCREMENT_TEST',direction:'ADVERSE',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'Raw plus H* AUROC 0.7770 versus raw 0.7850; delta -0.0080.'}
      },
      {
        id:'UCIC_CLAIM_BATTERY_HARD_MQ',
        label:'Hard MQ conjunction',
        status:'NOT_SUPPORTED',
        ceiling:'NO_HARD_MQ_SUPPORT_CLAIM',
        relationId:'BATTERY_MQ',
        relation:{type:'HARD_CONJUNCTION_TEST',direction:'ADVERSE',standing:'DOMAIN_SPECIFIC_HELDOUT',summary:'MQ sensitivity 0%; balanced accuracy 0.4994.'}
      }
    ],
    routeActions:{
      enterDestination:'ENTER_DESTINATION::METHODS_AND_MODELS',
      openClaimPrefix:'OPEN_CLAIM::',
      openRelationPrefix:'OPEN_RELATION::',
      openStudy:'OPEN_STUDY::BATTERY_COHERENCE_HELDOUT_STUDY'
    },
    presentation:{
      transformId:'RECURSIVE_DEPTH_EMBODIMENT_v1',
      semanticSource:'R4_ACTIVE_DEPTH_AND_R3_FOREGROUND_BACKGROUND_STATE',
      r6AuthorizedTransformationCount:0,
      r6TransformExecutionAuthorized:false,
      primaryNavigation:false,
      scientificAuthority:false
    },
    userDifferential:'NOT_YET_REVIEWED'
  });
});
