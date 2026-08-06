import { METHODS_CORPUS, LENSES, validateCorpus } from './data.mjs';
import { damp, clamp, wrap } from './math.mjs';
import { createState, createReturnEnvelope, verifyAndRestore, assertStateContract } from './state.mjs';
import { MethodsRenderer } from './renderer.mjs';
import { NavigationController } from './navigation.mjs';

validateCorpus(METHODS_CORPUS);
let corpus=METHODS_CORPUS;
let state=createState(corpus);
assertStateContract(state);

const $=selector=>document.querySelector(selector);
const canvas=$('#scene');
const modelButtons=$('#model-buttons');
const announcement=$('#announcement');
const renderer=new MethodsRenderer(canvas,corpus);
$('#gpu-status').textContent='Persistent WebGL2 · active';

let returnEnvelope=null;
let travelPreview=0;
let last=performance.now();
let raf=0;
let targetYaw=0;
let targetPitch=-.08;
let targetDistance=10.5;
let targetTarget=[...state.cameraOrViewTransform.target];
let activeFloat=state.activeModelByStage[0];

const currentStage=()=>corpus.stages[state.currentStage];
const currentModel=()=>currentStage().models[state.activeModelByStage[state.currentStage]];
const stageTarget=stageIndex=>[...corpus.stages[stageIndex].origin];

function announce(text){announcement.textContent='';requestAnimationFrame(()=>announcement.textContent=text);}
function setTransition(value,text){state.transition=value;$('#state-status').textContent=text;}
function settle(text='Spatial state settled'){state.transition='SETTLED';$('#state-status').textContent=text;}
function setInputMode(mode){state.inputMode=mode;}

function renderModelButtons(){
  modelButtons.replaceChildren(...currentStage().models.map((model,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='model-button';
    button.dataset.index=index;
    button.innerHTML=`<span>${String(index+1).padStart(2,'0')}</span><strong>${model.title}</strong>`;
    button.addEventListener('click',()=>selectOrFocus(index));
    return button;
  }));
}

function updateDOM(){
  const stage=currentStage();
  const model=currentModel();
  document.querySelectorAll('.stage-orb').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.stage)===state.currentStage));
  document.querySelectorAll('.model-button').forEach(button=>button.classList.toggle('is-active',Number(button.dataset.index)===state.activeModelByStage[state.currentStage]));
  $('#model-relation').textContent=`${stage.title} · ${model.relationship} · source ${model.sourceState}`;
  $('#model-title').textContent=model.title;
  $('#model-equation').textContent=model.equation;
  $('#model-statement').textContent=model.statement;
  for(const lens of LENSES){
    const content=model.lenses[lens.id];
    $(`#${lens.id}-title`).textContent=content.title;
    $(`#${lens.id}-body`).textContent=content.body;
    $(`#${lens.id}-footer`).textContent=content.footer;
    document.querySelector(`[data-lens="${lens.id}"]`).classList.toggle('is-emphasized',state.activeLens===lens.id);
  }
  $('#return-control').hidden=!state.focusedModel;
  renderLinear();
}

function renderLinear(){
  $('#linear-content').innerHTML=corpus.stages.map((stage,stageIndex)=>`<section class="linear-stage"><p class="eyebrow">Stage ${String(stageIndex+1).padStart(2,'0')}</p><h3>${stage.title}</h3>${stage.models.map(model=>`<article class="linear-model"><h4>${model.title}</h4><p>${model.equation}</p><p>${model.statement}</p><div class="linear-lenses">${LENSES.map(lens=>`<section class="linear-lens"><h5>${lens.label}: ${model.lenses[lens.id].title}</h5><p>${model.lenses[lens.id].body}</p></section>`).join('')}</div></article>`).join('')}</section>`).join('');
}

function orbit(dx,dy){
  if(state.focusedModel)return;
  targetYaw+=dx;
  targetPitch=clamp(targetPitch+dy,-.55,.42);
  activeFloat+=dx*.55;
  setTransition('PREVIEW','Sweeping model field');
}
function zoom(delta){targetDistance=clamp(targetDistance+delta,4.4,16);setTransition('PREVIEW','Inspection distance changing');}
function previewTravel(delta){travelPreview=clamp(travelPreview+delta,-1,1);targetTarget[2]+=delta*.9;setTransition('PREVIEW','Stage travel preview');}
function commitTravel(){if(Math.abs(travelPreview)>.16)travelStage(travelPreview>0?1:-1);else targetTarget=stageTarget(state.currentStage);travelPreview=0;}
function stepModel(delta){selectModel(state.activeModelByStage[state.currentStage]+delta);}
function flick(delta,magnitude){activeFloat+=delta*magnitude;selectModel(Math.round(activeFloat));}
function settleNearest(){selectModel(Math.round(activeFloat));}

function selectModel(index){
  if(state.focusedModel)return;
  const length=currentStage().models.length;
  index=wrap(index,length);
  activeFloat=index;
  state.activeModelByStage[state.currentStage]=index;
  state.priorSelection={kind:'model',model:currentModel().id};
  targetYaw=index*.24-.24;
  setTransition('SETTLING',`Settling ${currentModel().title}`);
  updateDOM();
  announce(`${currentModel().title} selected.`);
  setTimeout(()=>settle(`${currentModel().title} settled`),360);
}
function selectOrFocus(index){if(index===state.activeModelByStage[state.currentStage])focus();else selectModel(index);}

async function focus(){
  if(state.focusedModel)return;
  returnEnvelope=await createReturnEnvelope(state);
  state.returnToken=returnEnvelope.token;
  state.priorSelection=returnEnvelope.snapshot;
  state.focusedModel=currentModel().id;
  targetDistance=5.0;
  targetTarget=modelWorldPosition(state.currentStage,state.activeModelByStage[state.currentStage]);
  setTransition('FOCUS_TRANSITION',`Approaching ${currentModel().title}`);
  updateDOM();
  announce(`${currentModel().title} focused. Practical, Engineering, and Evidence remain visible.`);
  setTimeout(()=>settle(`${currentModel().title} in focused inspection`),520);
}

async function restore(){
  if(!state.focusedModel||!returnEnvelope)return;
  setTransition('RETURN_TRANSITION','Verifying exact return token');
  state=await verifyAndRestore(state,returnEnvelope);
  targetYaw=state.cameraOrViewTransform.yaw;
  targetPitch=state.cameraOrViewTransform.pitch;
  targetDistance=state.cameraOrViewTransform.distance;
  targetTarget=[...state.cameraOrViewTransform.target];
  activeFloat=state.activeModelByStage[state.currentStage];
  returnEnvelope=null;
  renderModelButtons();
  updateDOM();
  announce(`Exact state restored to ${currentModel().title}.`);
  settle('Exact prefocus state restored');
}

function travelStage(delta){
  if(state.focusedModel)return;
  state.currentStage=wrap(state.currentStage+delta,corpus.stages.length);
  activeFloat=state.activeModelByStage[state.currentStage];
  targetTarget=stageTarget(state.currentStage);
  targetYaw=0;
  targetDistance=10.5;
  travelPreview=0;
  renderModelButtons();
  updateDOM();
  setTransition('INTER_STAGE_TRANSITION',`Travelling to ${currentStage().title}`);
  announce(`Entered ${currentStage().title}.`);
  setTimeout(()=>settle(`Arrived at ${currentStage().title}`),620);
}
function emphasize(id){
  if(!LENSES.some(lens=>lens.id===id))return;
  state.activeLens=id;
  updateDOM();
  announce(`${id} lens emphasized. All three lenses remain visible.`);
}
function pick(x,y){return renderer.pick(x,y);}
function modelWorldPosition(stageIndex,modelIndex){
  const stage=corpus.stages[stageIndex];
  const position=stage.models[modelIndex].position;
  return [stage.origin[0]+position[0],stage.origin[1]+position[1],stage.origin[2]+position[2]];
}

function animate(now){
  const dt=Math.min(.05,(now-last)/1000);
  last=now;
  const camera=state.cameraOrViewTransform;
  camera.yaw=damp(camera.yaw,targetYaw,7,dt);
  camera.pitch=damp(camera.pitch,targetPitch,7,dt);
  camera.distance=damp(camera.distance,targetDistance,6,dt);
  camera.target=camera.target.map((value,index)=>damp(value,targetTarget[index],6,dt));
  renderer.render(state);
  raf=requestAnimationFrame(animate);
}

const navigation=new NavigationController(canvas,{inputMode:setInputMode,orbit,zoom,previewTravel,commitTravel,stepModel,travelStage,focus,restore,emphasize,pick,selectOrFocus,flick,settleNearest});
document.querySelectorAll('.stage-orb').forEach(button=>button.addEventListener('click',()=>{const destination=Number(button.dataset.stage);if(destination!==state.currentStage)travelStage(destination-state.currentStage);}));
document.querySelectorAll('.lens').forEach(card=>card.addEventListener('click',()=>emphasize(card.dataset.lens)));
$('#return-control').addEventListener('click',restore);
$('#mode-toggle').addEventListener('click',()=>{
  const linear=$('#linear-view').hidden;
  $('#linear-view').hidden=!linear;
  canvas.hidden=linear;
  $('.veil').hidden=linear;
  $('#mode-toggle').textContent=linear?'Spatial view':'Linear view';
  $('#mode-toggle').setAttribute('aria-pressed',String(linear));
});
renderModelButtons();
updateDOM();
raf=requestAnimationFrame(animate);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);navigation.destroy();renderer.destroy();},{once:true});
