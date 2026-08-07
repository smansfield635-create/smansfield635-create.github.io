(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.R8_STATE=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const TYPES=Object.freeze({ENTRY:'ENTRY',DESTINATION:'DESTINATION',CLAIM:'CLAIM',RELATION:'RELATION',STUDY:'STUDY'});
  function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.freeze(v);Object.values(v).forEach(freeze);}return v;}
  function frame(type,payload,depth){return freeze({type,payload:payload||{},depth,orientation:'METHODS_AND_MODELS'});}
  function create(data){return freeze({mode:'SPATIAL',history:[],current:frame(TYPES.ENTRY,{prototypeId:data.prototypeId},0),data});}
  function push(state,next){return freeze({mode:state.mode,history:[...state.history,state.current],current:next,data:state.data});}
  function setMode(state,mode){if(!['SPATIAL','TEXT'].includes(mode))throw new Error('INVALID_MODE');return freeze({mode,history:state.history,current:state.current,data:state.data});}
  function enter(state){if(state.current.type!==TYPES.ENTRY)throw new Error('INVALID_TRANSITION');return push(state,frame(TYPES.DESTINATION,{destination:state.data.destination},1));}
  function openClaim(state,claimId){const c=state.data.claims.find(x=>x.id===claimId);if(!c)throw new Error('UNKNOWN_CLAIM');if(![TYPES.DESTINATION,TYPES.STUDY].includes(state.current.type))throw new Error('INVALID_TRANSITION');return push(state,frame(TYPES.CLAIM,{claimId:c.id},state.current.depth+1));}
  function openRelation(state,relationId){const c=state.data.claims.find(x=>x.relationId===relationId);if(!c)throw new Error('UNKNOWN_RELATION');if(![TYPES.CLAIM,TYPES.STUDY].includes(state.current.type))throw new Error('INVALID_TRANSITION');return push(state,frame(TYPES.RELATION,{relationId:c.relationId,claimId:c.id},state.current.depth+1));}
  function openStudy(state){if(state.current.type!==TYPES.RELATION)throw new Error('INVALID_TRANSITION');return push(state,frame(TYPES.STUDY,{studyId:state.data.study.id},state.current.depth+1));}
  function back(state){if(!state.history.length)return state;const history=state.history.slice(0,-1),current=state.history[state.history.length-1];return freeze({mode:state.mode,history,current,data:state.data});}
  function reset(state){return create(state.data);}
  function claim(state){const id=state.current.payload.claimId;return state.data.claims.find(x=>x.id===id)||null;}
  function relation(state){const id=state.current.payload.relationId;return state.data.claims.find(x=>x.relationId===id)||null;}
  function controls(state){switch(state.current.type){
    case TYPES.ENTRY:return [{op:'ENTER',label:'Enter battery evidence vertical'}];
    case TYPES.DESTINATION:return state.data.claims.map(c=>({op:'CLAIM',id:c.id,label:c.label,direction:c.relation.direction}));
    case TYPES.CLAIM:{const c=claim(state);return [{op:'RELATION',id:c.relationId,label:`Open declared ${c.relation.direction.toLowerCase()} relation`,direction:c.relation.direction}];}
    case TYPES.RELATION:return [{op:'STUDY',id:state.data.study.id,label:'Trace to source study'}];
    case TYPES.STUDY:return state.data.claims.map(c=>({op:'RELATION',id:c.relationId,label:`${c.label} · ${c.relation.direction}`,direction:c.relation.direction}));
    default:return [];
  }}
  function descriptor(state){const c=claim(state),r=relation(state);switch(state.current.type){
    case TYPES.ENTRY:return {eyebrow:'R8 · bounded experiential prototype',title:state.data.title,summary:state.data.boundedScope.disclosure,kind:'PROTOTYPE_ENTRY'};
    case TYPES.DESTINATION:return {eyebrow:'Family · Methods & Models',title:'Battery evidence vertical',summary:'Four battery claims from one held-out study. One relation is supporting; three are adverse. Select a claim to recurse into its declared evidence relation.',kind:'DESTINATION_CONTEXT'};
    case TYPES.CLAIM:return {eyebrow:'Claim',title:c.label,summary:`Status: ${c.status}. Ceiling: ${c.ceiling}.`,kind:'CLAIM_CONTEXT',claim:c};
    case TYPES.RELATION:return {eyebrow:`Typed relation · ${r.relation.direction}`,title:r.relation.type,summary:r.relation.summary,kind:'RELATION_CONTEXT',claim:r};
    case TYPES.STUDY:return {eyebrow:'Source study',title:state.data.study.label,summary:`${state.data.study.evaluationCycles.toLocaleString()} cell-disjoint held-out cycles. The local relation set includes both support and adverse comparator/component results.`,kind:'STUDY_CONTEXT',study:state.data.study};
    default:throw new Error('UNKNOWN_STATE');
  }}
  function trail(state){return [...state.history,state.current].map((f,i)=>({index:i,type:f.type,depth:f.depth,orientation:f.orientation,payload:f.payload}));}
  function assertInvariant(state){if(state.current.orientation!=='METHODS_AND_MODELS')throw new Error('ORIENTATION_LOSS');if(state.mode!=='SPATIAL'&&state.mode!=='TEXT')throw new Error('INVALID_MODE');for(const [i,f] of trail(state).entries()){if(f.orientation!=='METHODS_AND_MODELS')throw new Error('ORIENTATION_LOSS');if(i>0&&f.depth<0)throw new Error('INVALID_DEPTH');}return true;}
  return freeze({TYPES,create,setMode,enter,openClaim,openRelation,openStudy,back,reset,controls,descriptor,trail,assertInvariant});
});
