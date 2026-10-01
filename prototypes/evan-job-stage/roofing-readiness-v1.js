const RoofingReadiness=(()=>{'use strict';
const REQUIRED=[
 ['INSPECTION_CURRENT','Inspection'],
 ['SCOPE_CURRENT','Scope'],
 ['CUSTOMER_AUTHORIZATION_CURRENT','Customer Authorization'],
 ['PERMIT_REQUIREMENT_SATISFIED','Permit'],
 ['MATERIAL_ORDER_CURRENT','Material Order'],
 ['PRODUCTION_SLOT_AUTHORIZED','Production Slot']
];
const PRECEDENCE=['CONFLICTING','NEGATED','UNPROVEN','ESTABLISHED'];
const NEXT={
 ESTABLISHED:['AUTHORIZE_PRODUCTION_PROGRESSION'],
 NEGATED:['HOLD_PRODUCTION','RESOLVE_NEGATED_REQUIREMENT'],
 UNPROVEN:['HOLD_PRODUCTION','OBTAIN_OR_ESTABLISH_MISSING_EVIDENCE'],
 CONFLICTING:['HOLD_PRODUCTION','RECONCILE_CORRESPONDENCE']
};
const manager={
 ESTABLISHED:{label:'Ready',message:'Production readiness is established by the supplied evidence.'},
 NEGATED:{label:'Blocked',message:'A required production condition is explicitly not satisfied.'},
 UNPROVEN:{label:'Still needed',message:'Required production evidence is still missing or insufficient.'},
 CONFLICTING:{label:'Needs review',message:'Current evidence does not correspond to one coherent production state.'}
};
const norm=v=>String(v??'').trim();
const current=rs=>rs.filter(r=>!['superseded','void','revoked'].includes(norm(r.state).toLowerCase()));
const negative=r=>['rejected','revoked','failed','denied','blocked','invalid'].includes(norm(r.state).toLowerCase());
function latest(rs){return [...rs].sort((a,b)=>norm(b.updatedAt||b.date).localeCompare(norm(a.updatedAt||a.date)))[0]||null}
function refs(r){return{jobId:norm(r.jobId),version:norm(r.version),inspectionRef:norm(r.inspectionRef),scopeRef:norm(r.scopeRef),productionStateRef:norm(r.productionStateRef)}}
function evaluateRequirement(id,type,records,jobId){
 const all=records.filter(r=>r.type===type&&norm(r.jobId)===jobId);
 if(!all.length)return{requirement:id,state:'UNPROVEN',evidence:[],finding:'No '+type+' evidence is established for this job.'};
 const active=current(all);
 if(!active.length)return{requirement:id,state:all.some(negative)?'NEGATED':'UNPROVEN',evidence:all.map(r=>r.id).filter(Boolean),finding:'No current '+type+' evidence is available.'};
 if(active.some(negative))return{requirement:id,state:'NEGATED',evidence:active.map(r=>r.id).filter(Boolean),finding:'Current '+type+' evidence explicitly negates the requirement.'};
 return{requirement:id,state:'ESTABLISHED',evidence:active.map(r=>r.id).filter(Boolean),record:latest(active)};
}
function evaluate(job,records){
 const jobId=norm(job?.id);if(!jobId)throw Error('ROOFING_READINESS_JOB_ID_REQUIRED');
 const rs=Array.isArray(records)?records:[];
 const requirementStates=REQUIRED.map(([id,type])=>evaluateRequirement(id,type,rs,jobId));
 const by=Object.fromEntries(requirementStates.map(x=>[x.requirement,x]));
 const findings=[];
 const inspection=by.INSPECTION_CURRENT.record,scope=by.SCOPE_CURRENT.record,auth=by.CUSTOMER_AUTHORIZATION_CURRENT.record,materials=by.MATERIAL_ORDER_CURRENT.record,slot=by.PRODUCTION_SLOT_AUTHORIZED.record;
 if(inspection&&scope&&norm(scope.inspectionRef)&&norm(scope.inspectionRef)!==norm(inspection.id)){by.SCOPE_CURRENT.state='CONFLICTING';findings.push('Current scope does not correspond to the current inspection.')}
 if(scope&&auth&&norm(auth.scopeRef)&&norm(auth.scopeRef)!==norm(scope.id)){by.CUSTOMER_AUTHORIZATION_CURRENT.state='CONFLICTING';findings.push('Customer authorization does not correspond to the current scope.')}
 if(scope&&materials&&norm(materials.scopeRef)&&norm(materials.scopeRef)!==norm(scope.id)){by.MATERIAL_ORDER_CURRENT.state='CONFLICTING';findings.push('Material order does not correspond to the current scope.')}
 if(slot&&norm(slot.productionStateRef)&&norm(job.productionStateId)&&norm(slot.productionStateRef)!==norm(job.productionStateId)){by.PRODUCTION_SLOT_AUTHORIZED.state='CONFLICTING';findings.push('Production slot does not correspond to the current production state.')}
 const states=requirementStates.map(x=>x.state);
 const overallState=PRECEDENCE.find(s=>states.includes(s))||'UNPROVEN';
 const blockingRequirements=requirementStates.filter(x=>x.state!=='ESTABLISHED').map(x=>x.requirement);
 return{
  schema:'ABC_ROOFING_PRODUCTION_READINESS_RESULT_v1',
  governedJobId:jobId,
  claim:'READY_FOR_PRODUCTION',
  overallState,
  manager:manager[overallState],
  requirementStates:requirementStates.map(({record,...x})=>x),
  blockingRequirements,
  correspondenceFindings:findings,
  permittedNextMoves:NEXT[overallState],
  evidenceReferences:[...new Set(requirementStates.flatMap(x=>x.evidence))]
 };
}
return{evaluate,REQUIRED:Object.freeze(REQUIRED.map(x=>Object.freeze([...x])))};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=RoofingReadiness;