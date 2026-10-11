function cmp(v,op,t){if(op==='>=')return v>=t;if(op==='>')return v>t;if(op==='<=')return v<=t;if(op==='<')return v<t;if(op==='==')return v===t;return false;}
export function evaluateQualityMeasure(input={}) {
 const {measureId,numerator,denominator,windowId,acceptance,longitudinal=false,history=[]}=input;
 if(typeof measureId!=='string'||!measureId) return stop('MEASURE_ID_MISSING');
 if(!Number.isFinite(numerator)||!Number.isFinite(denominator)||denominator<=0||numerator<0||numerator>denominator) return stop('MEASURE_TERMS_INVALID');
 if(typeof windowId!=='string'||!windowId) return stop('OBSERVATION_WINDOW_MISSING');
 if(!acceptance||!Number.isFinite(acceptance.threshold)||typeof acceptance.operator!=='string') return stop('ACCEPTANCE_RULE_INVALID');
 if(longitudinal){
   const distinct=new Set([windowId,...history.map(x=>x.windowId).filter(Boolean)]);
   if(distinct.size<2) return stop('LONGITUDINAL_HISTORY_INSUFFICIENT');
 }
 const value=numerator/denominator, passed=cmp(value,acceptance.operator,acceptance.threshold);
 return {schema:'L2_QUALITY_MEASURE_RECEIPT_v1',result:passed?'PASS_CLOSED':'FAIL_CLOSED',disposition:passed?'EVIDENCED':'GAP',measureId,value,numerator,denominator,windowId,historyWindowCount:new Set(history.map(x=>x.windowId)).size,acceptance,authorityCreated:false};
}
function stop(errorCode){return {schema:'L2_QUALITY_MEASURE_RECEIPT_v1',result:'STOP',disposition:'GAP',errorCode,authorityCreated:false};}
