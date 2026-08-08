(function(root,factory){
  const data = typeof module==='object'&&module.exports ? require('./prototype-data.js') : root.R8F_DATA;
  const value = factory(data);
  if(typeof module==='object'&&module.exports) module.exports=value;
  else root.R8F_COORDINATES=value;
})(typeof globalThis!=='undefined'?globalThis:this,function(DATA){
  'use strict';

  function getPath(object,path){
    return path.split('.').reduce(function(current,segment){
      if(current===null||typeof current!=='object'||!Object.prototype.hasOwnProperty.call(current,segment)){
        throw new Error('R8F_REQUIRED_DELIVERY_FIELD_MISSING:'+path);
      }
      return current[segment];
    },object);
  }
  function stable(value){
    if(value===null) return 'null';
    if(Array.isArray(value)) return '['+value.map(stable).join(',')+']';
    if(typeof value==='object'){
      return '{'+Object.keys(value).sort().map(function(key){return JSON.stringify(key)+':'+stable(value[key]);}).join(',')+'}';
    }
    return JSON.stringify(value);
  }
  function lookup(rule,source){
    const match=rule.entries.find(function(entry){ return stable(entry.value)===stable(source); });
    if(!match) throw new Error('R8F_COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN');
    return match.coordinate;
  }
  function normalize(dimension,state){
    const source=getPath(state,dimension.sourceDeliveryFieldRefs[0]);
    const rule=dimension.normalizationRule;
    if(rule.type==='IDENTITY_NUMERIC'){
      if(typeof source!=='number'||!Number.isFinite(source)) throw new Error('R8F_NON_NUMERIC_COORDINATE_VALUE');
      return source;
    }
    if(rule.type==='AFFINE_NUMERIC'){
      if(typeof source!=='number'||!Number.isFinite(source)) throw new Error('R8F_NON_NUMERIC_COORDINATE_VALUE');
      return source*rule.scale+rule.offset;
    }
    if(rule.type==='DECLARED_LOOKUP') return lookup(rule,source);
    throw new Error('R8F_UNSUPPORTED_NORMALIZATION_RULE:'+rule.type);
  }
  function embed(state,chart){
    const coordinateVector=chart.coordinateSemantics
      .slice()
      .sort(function(a,b){return a.dimensionIndex-b.dimensionIndex;})
      .map(function(dimension){return normalize(dimension,state);});
    return Object.freeze({
      coordinateStateId:'R8F_CSTATE::'+chart.chartId+'::'+state.deliveryStateId,
      sourceDeliveryStateId:state.deliveryStateId,
      sourceObjectIdentityRef:state.sourceObjectIdentityRef,
      chartId:chart.chartId,
      chartVersion:chart.chartVersion,
      systemId:chart.systemId,
      coordinateVector:Object.freeze(coordinateVector),
      representedDimensionIds:Object.freeze(chart.representedDimensions.slice()),
      recursiveDepth:state.recursiveDepth,
      canonicalPresenceState:state.canonicalPresenceState
    });
  }

  const registry={};
  DATA.systemCoordinateCharts.forEach(function(chart){
    registry[chart.chartId]={};
    DATA.canonicalDeliveryStates.forEach(function(state){
      registry[chart.chartId][state.deliveryStateId]=embed(state,chart);
    });
    Object.freeze(registry[chart.chartId]);
  });
  Object.freeze(registry);

  function getCoordinateState(chartId,deliveryStateId){
    if(!registry[chartId]) throw new Error('R8F_UNKNOWN_CHART:'+chartId);
    if(!registry[chartId][deliveryStateId]) throw new Error('R8F_UNKNOWN_DELIVERY_STATE:'+deliveryStateId);
    return registry[chartId][deliveryStateId];
  }

  return Object.freeze({
    id:'R8F_DECLARED_COORDINATE_STATE_REGISTRY_v1',
    sourceClass:'CANONICAL_DELIVERY_STATE_PLUS_DECLARED_SYSTEM_COORDINATE_CHART',
    coordinateStateRegistry:registry,
    getCoordinateState:getCoordinateState,
    embed:embed,
    stable:stable,
    sourceMutationPermitted:false,
    coordinateTransitionRuntimeConstructed:false,
    projectionRuntimeConstructed:false,
    presentationRuntimeConstructed:false
  });
});
