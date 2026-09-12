const CONTRACT=Object.freeze({
  id:'AWARDS_ESTATE_LIVING_OBJECT_CYCLE_E_V1',
  cycle:'E_ESTATE',
  claim:'The surprise is not one feature. It is that the pieces belong together.',
  governingHead:'e764b8ea37a7ed6c3f0a2c5be5d4be520db489f4',
  sourceBinding:Object.freeze([
    Object.freeze({id:'COMPASS',role:'ORIENTATION',authorityClass:'NAVIGATION',maturityClass:'PUBLIC_OPERATING_SURFACE',path:'index.html',blob:'3a684cf4f4aedcfa2c76fa2686fb4c733d5903bb'}),
    Object.freeze({id:'H_EARTH',role:'WORLD',authorityClass:'EXPERIENCE',maturityClass:'PUBLIC_OPERATING_SURFACE',path:'showroom/globe/h-earth/index.html',blob:'f4fa5df980c639184352d978909532dc8f1bcbd8'}),
    Object.freeze({id:'CHARACTERS',role:'ENCOUNTER',authorityClass:'EXPERIENCE',maturityClass:'PUBLIC_EVOLVING_SURFACE',path:'characters/index.html',blob:'6bebd977905ec9c9d7b717a4ea4305688e82aa03'}),
    Object.freeze({id:'COHERENCE',role:'INSPECTION',authorityClass:'DIAGNOSTIC',maturityClass:'BOUNDED_INSTRUMENT',path:'products/coherence-diagnostic/index.html',blob:'b0785f36d913c286dc19e042f33ea91afcd166bc'}),
    Object.freeze({id:'LAWS',role:'CONSTRAINT',authorityClass:'KNOWLEDGE',maturityClass:'PUBLIC_KNOWLEDGE_SURFACE',path:'laws/index.html',blob:'d6de5558a6ba38e66ad6284a80c03de67682628b'}),
    Object.freeze({id:'GOVERNANCE',role:'AUTHORIZATION',authorityClass:'GOVERNANCE',maturityClass:'PUBLIC_CONTROL_SURFACE',path:'governance/index.html',blob:'9b216d8f86e5dbc76794ab01ce967d3e9357ef21'})
  ]),
  relations:Object.freeze([
    Object.freeze({from:'COMPASS',to:'H_EARTH',kind:'ORIENTS_TO'}),
    Object.freeze({from:'COMPASS',to:'CHARACTERS',kind:'ORIENTS_TO'}),
    Object.freeze({from:'COHERENCE',to:'LAWS',kind:'INSPECTS_WITHIN'}),
    Object.freeze({from:'LAWS',to:'GOVERNANCE',kind:'CONSTRAINS_WITHIN'}),
    Object.freeze({from:'GOVERNANCE',to:'H_EARTH',kind:'BOUNDS_CLAIMS_FOR'}),
    Object.freeze({from:'GOVERNANCE',to:'CHARACTERS',kind:'BOUNDS_CLAIMS_FOR'}),
    Object.freeze({from:'H_EARTH',to:'COHERENCE',kind:'SHARES_ESTATE_WITH'}),
    Object.freeze({from:'CHARACTERS',to:'COHERENCE',kind:'SHARES_ESTATE_WITH'})
  ]),
  invariants:Object.freeze({
    relationIsClaim:true,
    identicalMaturityImplied:false,
    identicalAuthorityImplied:false,
    completionEquivalenceImplied:false,
    sourceMutationAuthorized:false,
    webglContexts:0
  }),
  lifecycle:Object.freeze(['REAR_INERT','APPROACHING','FOREGROUND_REST','SIGNATURE_PLAY','FOREGROUND_IDLE','SELECT_RESPONSE','READER_OPEN','RETURN_RESTORING'])
});

function makeNode(doc,item,index){
  const node=doc.createElement('button');
  node.type='button';
  node.className='awards-estate-node';
  node.dataset.estateId=item.id;
  node.dataset.role=item.role;
  node.dataset.authority=item.authorityClass;
  node.dataset.maturity=item.maturityClass;
  node.style.setProperty('--estate-index',String(index));
  node.innerHTML=`<span class="awards-estate-node__id">${item.id}</span><span class="awards-estate-node__role">${item.role}</span>`;
  return node;
}

export function createAwardsEstateCycleE({document:doc=document,reducedMotion=false}={}){
  const root=doc.createElement('section');
  root.className='awards-living-object awards-estate-object';
  root.dataset.cycle='E_ESTATE';
  root.dataset.lifecycle='REAR_INERT';
  root.dataset.reducedMotion=reducedMotion?'true':'false';
  root.setAttribute('aria-label','Estate constellation');

  const field=doc.createElement('div');
  field.className='awards-estate-field';
  const relationLayer=doc.createElement('div');
  relationLayer.className='awards-estate-relations';
  relationLayer.setAttribute('aria-hidden','true');
  field.append(relationLayer);

  const nodes=new Map();
  CONTRACT.sourceBinding.forEach((item,index)=>{
    const node=makeNode(doc,item,index);
    node.addEventListener('click',()=>select(item.id));
    nodes.set(item.id,node);
    field.append(node);
  });

  const center=doc.createElement('div');
  center.className='awards-estate-center';
  center.textContent='ONE ESTATE';
  field.append(center);
  root.append(field);

  let state='REAR_INERT';
  let selected=null;
  function setState(next){
    if(!CONTRACT.lifecycle.includes(next))throw new Error('ESTATE_INVALID_LIFECYCLE');
    state=next;root.dataset.lifecycle=next;return api;
  }
  function stable(){return setState('FOREGROUND_IDLE')}
  function approach(){return setState('APPROACHING')}
  function rest(){return setState('FOREGROUND_REST')}
  function playSignature(){
    setState('SIGNATURE_PLAY');
    root.dataset.relationship='BELONGING_VISIBLE';
    root.dataset.configuration='CONSTELLATION_CONVERGED';
    if(reducedMotion){root.dataset.motionEquivalent='RELATIONSHIP_REVEALED_WITHOUT_TRANSIT';return stable()}
    root.dataset.motionEquivalent='ANIMATED_CONVERGENCE';
    return api;
  }
  function select(id){
    if(!nodes.has(id))throw new Error('ESTATE_UNKNOWN_NODE');
    selected=id;root.dataset.selected=id;setState('SELECT_RESPONSE');
    for(const [nodeId,node] of nodes)node.dataset.selected=nodeId===id?'true':'false';
    return api;
  }
  function openReader(){return setState('READER_OPEN')}
  function restore(){
    selected=null;delete root.dataset.selected;delete root.dataset.relationship;delete root.dataset.configuration;
    for(const node of nodes.values())delete node.dataset.selected;
    setState('RETURN_RESTORING');return rest();
  }
  function inspect(){return Object.freeze({state,selected,reducedMotion,sourceCount:CONTRACT.sourceBinding.length,relationCount:CONTRACT.relations.length,webglContexts:0})}
  function destroy(){root.remove()}
  const api=Object.freeze({element:root,contract:CONTRACT,approach,rest,playSignature,select,openReader,restore,stable,inspect,destroy});
  return api;
}

export {CONTRACT as AWARDS_ESTATE_CYCLE_E_CONTRACT};
export default createAwardsEstateCycleE;
