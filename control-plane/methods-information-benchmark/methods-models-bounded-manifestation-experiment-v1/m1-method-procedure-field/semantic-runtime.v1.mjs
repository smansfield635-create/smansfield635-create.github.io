export const OPERATION='FOCUS_MOVE';
const clone=v=>structuredClone(v);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const title=id=>id.toLowerCase().split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');

export function buildBindingRegistry(method,objects,plan){
  const methods=objects.objects.find(x=>x.contentId==='METHODS');
  if(!methods) throw new Error('METHODS_SOURCE_MISSING');
  const deps=new Map(method.sequence.map(s=>[s.id,[]]));
  for(const s of method.sequence) for(const r of s.requires) deps.get(r).push(s.id);
  const relation=(a,b)=>`METHOD_DEPENDENCY:${a}->${b}`;
  const stages=method.sequence.map(s=>({
    bindingId:`METHOD_STAGE:${s.id}`,bindingClass:'METHOD_STAGE',primaryReferent:s.id,
    allowedOperations:[OPERATION],authorityRef:plan.stageRule.authority,
    orientationContext:{
      IDENTITY:s.id,CLASS:'METHOD_STAGE',STANDING:'SOURCE_BOUND_METHOD_STAGE',
      CLAIM_CEILING:method.claimCeilingRef,MATERIAL_QUALIFIER:`ORDER_${s.order}`,
      REQUIRED_RELATIONS:[...s.requires.map(r=>relation(r,s.id)),...deps.get(s.id).map(d=>relation(s.id,d))],
      METHODS_PARENT:'METHODS',PREREQUISITES:[...s.requires],IMMEDIATE_DEPENDENTS:[...deps.get(s.id)],CUSTODY_DOMAIN:s.custody
    },label:title(s.id),order:s.order
  }));
  const parent={
    bindingId:'ENTITY:METHODS',bindingClass:'ENTITY',primaryReferent:'METHODS',
    allowedOperations:[OPERATION],authorityRef:plan.parent.authority,
    orientationContext:{
      IDENTITY:'METHODS',CLASS:'METHOD',STANDING:'SOURCE_BOUND_SCIENTIFIC_PROCEDURE',
      CLAIM_CEILING:method.claimCeilingRef,MATERIAL_QUALIFIER:methods.definition,
      REQUIRED_RELATIONS:stages.map(s=>`CONTAINS_METHOD_STAGE:${s.primaryReferent}`)
    },label:'Methods'
  };
  const relations=[];
  for(const s of method.sequence) for(const r of s.requires) relations.push({
    bindingId:`DECLARED_RELATION:${relation(r,s.id)}`,bindingClass:'DECLARED_RELATION',
    relationRef:relation(r,s.id),source:r,target:s.id,edgeSemantics:plan.relationRule.semantics,allowedOperations:[]
  });
  return {schema:'METHODS_MODELS_M1_RUNTIME_BINDINGS_v1',scientificStateHash:null,bindings:[parent,...stages],relations};
}

export function createInitialState(registry,scientificStateHash){
  const binding=registry.bindings[0];
  return {activeReferent:'METHODS',scientificStateHash,routeDestination:null,depth:'BASE',
    authorizedDisclosedFields:Object.keys(binding.orientationContext),orientation:clone(binding.orientationContext)};
}
export function semanticOutcome(s){return{
  ACTIVE_REFERENT:s.activeReferent,SCIENTIFIC_STATE_HASH:s.scientificStateHash,
  ROUTE_DESTINATION:s.routeDestination,DEPTH:s.depth,
  AUTHORIZED_DISCLOSED_FIELDS:[...s.authorizedDisclosedFields].sort()
};}
export function dispatchFocus({state,registry,bindingId,target,route,modality}){
  const direct=route==='DIRECT'&&['POINTER','TOUCH'].includes(modality);
  const access=route==='ACCESSIBLE'&&['KEYBOARD','ASSISTIVE_TECHNOLOGY'].includes(modality);
  if(!direct&&!access)return{valid:false,errors:['ROUTE_MODALITY_INVALID']};
  const b=registry.bindings.find(x=>x.bindingId===bindingId);
  if(!b)return{valid:false,errors:['BINDING_NOT_FOUND']};
  if(!['ENTITY','METHOD_STAGE'].includes(b.bindingClass)||!b.allowedOperations.includes(OPERATION))
    return{valid:false,errors:['BINDING_NOT_FOCUSABLE']};
  if(b.primaryReferent!==target)return{valid:false,errors:['LOCUS_TARGET_MISMATCH']};
  const before=semanticOutcome(state),next=clone(state);
  next.activeReferent=target;next.orientation=clone(b.orientationContext);
  next.authorizedDisclosedFields=Object.keys(b.orientationContext);
  if(next.scientificStateHash!==state.scientificStateHash)return{valid:false,errors:['SCIENTIFIC_STATE_MUTATION']};
  const after=semanticOutcome(next);
  return{valid:true,errors:[],state:next,output:{operation:OPERATION,target,semanticOutcome:after},
    auditTrace:{ACTION:`${route}:${modality}:${OPERATION}`,TARGET:target,TRANSFORMATION:'CHANGE_ATTENTION_ONLY',
      INFORMATION_DELTA:before.ACTIVE_REFERENT===target?'ORIENTATION_CONTEXT_REAFFIRMED':`ACTIVE_REFERENT:${before.ACTIVE_REFERENT}->${target}`}};
}
export function evaluateHardGates(registry,hash){
  const bs=registry.bindings;
  const base=['IDENTITY','CLASS','STANDING','CLAIM_CEILING','MATERIAL_QUALIFIER','REQUIRED_RELATIONS'];
  const extra=['METHODS_PARENT','PREREQUISITES','IMMEDIATE_DEPENDENTS','CUSTODY_DOMAIN'];
  const I_EMBODIMENT=bs.length===16&&bs.every(b=>b.primaryReferent&&b.allowedOperations.includes(OPERATION));
  const initial=createInitialState(registry,hash);
  const I_LOCUS=bs.every(b=>dispatchFocus({state:initial,registry,bindingId:b.bindingId,target:b.primaryReferent,route:'DIRECT',modality:'POINTER'}).valid
    &&dispatchFocus({state:initial,registry,bindingId:b.bindingId,target:'__WRONG__',route:'DIRECT',modality:'POINTER'}).errors?.includes('LOCUS_TARGET_MISMATCH'));
  const I_ORIENTATION=bs.every(b=>base.every(k=>k in b.orientationContext)&&(b.bindingClass!=='METHOD_STAGE'||extra.every(k=>k in b.orientationContext)));
  const I_ROUTE_EQUIVALENCE=bs.every(b=>{
    const d=dispatchFocus({state:initial,registry,bindingId:b.bindingId,target:b.primaryReferent,route:'DIRECT',modality:'POINTER'});
    const a=dispatchFocus({state:initial,registry,bindingId:b.bindingId,target:b.primaryReferent,route:'ACCESSIBLE',modality:'KEYBOARD'});
    return d.valid&&a.valid&&same(d.output.semanticOutcome,a.output.semanticOutcome);
  });
  const terms={I_EMBODIMENT,I_LOCUS,I_ORIENTATION,I_ROUTE_EQUIVALENCE};
  return{terms,pass:Object.values(terms).every(Boolean)};
}
