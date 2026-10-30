/* Universe first slice. Geometry: H-Earth kernel; motion: unchanged Compass physics.
 * Heart contour and dome proportions: nine-summits-of-love/index.html at 171a74bc.
 * Planet lighting is a visual metaphor; no physical simulation claims. */
const summits = [
  ['Gratitude','Joy','#d5aa66'],['Generosity','Love','#cb7584'],['Dependability','Stability','#749cab'],
  ['Accountability','Character','#b88360'],['Forgiveness','Peace','#a3b8aa'],['Self-Control','Balance','#8e8ead'],
  ['Patience','Structure','#9caa7d'],['Humility','Dignity','#ba9cae'],['Purity','Free Will','#b8c9d2']
];
// Teaching text follows the nine relationships on the book page; examples invite reflection.
const teachings = [
  {
    "title": "Joy begins with noticing.",
    "intro": "Gratitude makes room for joy in what is already here.",
    "teaching": "Joy does not begin with having everything. It begins with recognizing what is already alive, valuable, and worth receiving.",
    "choice": "After a difficult day, fear can narrow your attention to what is missing. Choosing love can begin with noticing one kindness without pretending the difficulty has disappeared.",
    "question": "What is worth appreciating in your life today?"
  },
  {
    "title": "Love becomes something we give.",
    "intro": "Generosity gives love a visible expression.",
    "teaching": "Love becomes visible when value moves outward without destroying the person giving it.",
    "choice": "Someone needs your help. You can offer time, attention, or support honestly, without promising more than you can give. A loving yes can live alongside a necessary boundary.",
    "question": "What can you offer someone today without neglecting yourself?"
  },
  {
    "title": "Trust grows through showing up.",
    "intro": "Dependability gives love something steady to stand on.",
    "teaching": "Stability is not a feeling. It is trustworthy action repeated long enough for others—and your future self—to stand on it.",
    "choice": "When keeping a promise becomes inconvenient, return to why you made it. Follow through, or speak honestly and make a new agreement. Conviction takes shape in what you do again tomorrow.",
    "question": "What promise can you honor today?"
  },
  {
    "title": "Our choices ask something of us.",
    "intro": "Accountability turns intention into responsibility.",
    "teaching": "Character begins when we stop asking only what we intended and become willing to answer for what our choices produced.",
    "choice": "When your words hurt someone, fear may urge you to defend your intentions. Choosing love means listening to the impact, owning your part, and taking a concrete step toward repair.",
    "question": "What can you take responsibility for and begin to repair?"
  },
  {
    "title": "Peace leaves room for truth.",
    "intro": "Forgiveness releases the fight without erasing what happened.",
    "teaching": "Forgiveness does not erase truth. It ends the unnecessary war so truth, boundaries, and repair can occupy the same room.",
    "choice": "You can choose to stop feeding resentment while keeping an honest boundary. Forgiveness does not require pretending trust has already been restored.",
    "question": "What would peace look like while keeping an honest boundary?"
  },
  {
    "title": "Feel deeply. Choose deliberately.",
    "intro": "Self-control creates room between an impulse and a response.",
    "teaching": "Balance is not the absence of emotion. It is the ability to feel deeply without surrendering authority over what happens next.",
    "choice": "In a tense conversation, pause before sending the message or raising your voice. You can acknowledge anger and still choose words that protect dignity—yours and theirs.",
    "question": "What response would express your convictions rather than your first impulse?"
  },
  {
    "title": "Give strong things time to form.",
    "intro": "Patience supports what cannot be built in a moment.",
    "teaching": "Anything built too quickly can collapse under the weight it was meant to carry. Patience gives strong things time to form.",
    "choice": "When progress feels slow, fear can push you to force an outcome. Choosing love may mean continuing the small, necessary work and allowing growth its own time.",
    "question": "What deserves your steady care instead of being rushed?"
  },
  {
    "title": "Honesty makes room for dignity.",
    "intro": "Humility lets us learn without denying our worth.",
    "teaching": "Humility is not becoming smaller. It is seeing yourself in honest proportion—without self-erasure or artificial superiority.",
    "choice": "When someone offers a perspective you have missed, you can listen without treating it as a threat to your worth. Admitting you do not know creates room to learn together.",
    "question": "Where can you acknowledge a limitation without denying your worth?"
  },
  {
    "title": "Make room for a freer choice.",
    "intro": "Purity asks what is influencing the choice we call our own.",
    "teaching": "A choice is not fully free when fear, coercion, resentment, or appetite is making it for us. Purity clears the field.",
    "choice": "Before a consequential decision, notice what is pressing you: approval, resentment, or an immediate urge. Make space to choose from love rather than simply obeying that pressure.",
    "question": "What would you choose if fear were not deciding for you?"
  }
];
const scene=document.querySelector('#universe-scene'), canvas=document.querySelector('#universe-canvas');
const panel=document.querySelector('#reflection'), status=document.querySelector('#status');
const approach=document.querySelector('#approach'), returnButton=document.querySelector('#return-view');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let P, gl, program, meshes=[], labels=[], labelSizes=[], centers=[], projected=[], selected=-1, close=false;
let quaternion=[0,0,0,1], pointer=null, inertia=null, suppressUntil=0, raf=0, lastTime=0;
let width=1,height=1, viewWidth=3, viewHeight=3, zoom=1,targetZoom=1, offset=[0,0,0],targetOffset=[0,0,0];
// Ambient traversal uses the Compass delta-time clock and its slow 0.08 rad/s cadence.
// Gesture quaternions and release physics remain owned by the shared Compass module.
const ORBIT_RADIANS_PER_SECOND=.08;
let orbitPhase=0, orbitSpeed=0, motionPaused=false, sceneVisible=true, windowFocused=true, pageActive=true;
let ready=false, reduced=media.matches, receipt={status:'loading'}, disposed=false, teachingRevealVersion=0;
// Gen2970 one-world proof: dedicated spatial encounter; the public Gen2968 page is untouched.
let flight=0,flightTarget=0,cameraZ=9,flightStage='arrival',universeClock=0,peaceFocusReturn=null,joyFocusReturn=null,loveFocusReturn=null,stabilityFocusReturn=null,emberFocusReturn=null,balanceFocusReturn=null,canopyFocusReturn=null,highlandsFocusReturn=null,opalFocusReturn=null;
const $=s=>document.querySelector(s);
const peaceOverlay=$('#peace-encounter');
const joyOverlay=$('#joy-world'), joyHud=$('#joy-world-hud');
const loveOverlay=$('#love-world'),loveHud=$('#love-world-hud');
const stabilityOverlay=$('#stability-world'),stabilityHud=$('#stability-world-hud');
const emberOverlay=$('#ember-world'),emberHud=$('#ember-world-hud');
const balanceOverlay=$('#balance-world'),balanceHud=$('#balance-world-hud');
const canopyOverlay=$('#canopy-world'),canopyHud=$('#canopy-world-hud');
const highlandsOverlay=$('#highlands-world'),highlandsHud=$('#highlands-world-hud');
const opalOverlay=$('#opal-world'),opalHud=$('#opal-world-hud');
const color=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
function requestFrame(){if(!raf && ready && !disposed && !document.hidden && sceneVisible && pageActive)raf=requestAnimationFrame(render);}
function orbitCanMove(){return !reduced&&!motionPaused&&!pointer&&!inertia&&selected<0&&flight<.001&&sceneVisible&&windowFocused&&pageActive&&!document.hidden;}
function updateMotionControl(){const button=$('#toggle-motion');button.disabled=reduced||!ready;button.textContent=reduced?'Reduced motion':motionPaused?'Resume motion':(selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)?'World in focus':'Pause motion';button.setAttribute('aria-pressed',String(motionPaused));}
$('#toggle-motion').addEventListener('click',()=>{motionPaused=!motionPaused;orbitSpeed=0;lastTime=0;updateMotionControl();requestFrame();});
function stopInertia(){if(inertia){quaternion=P.constellationReleaseQuaternionAt(inertia,Math.min(inertia.durationMs,performance.now()-inertia.startedAt));inertia=null;}}
function choose(index,scroll=true){
  if(pointer?.dragging || performance.now()<suppressUntil)return;
  stopInertia();
  // Switching from the exemplar must not leave its camera zoom, hidden labels or overlay behind.
  if(index!==selected&&(selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)&&(flight>.002||flightTarget>0)){
    flight=0;flightTarget=0;cameraZ=9;flightStage='arrival';
    peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');
    joyOverlay.classList.remove('is-visible');joyOverlay.setAttribute('aria-hidden','true');
    loveOverlay.classList.remove('is-visible');loveOverlay.setAttribute('aria-hidden','true');
    stabilityOverlay.classList.remove('is-visible');stabilityOverlay.setAttribute('aria-hidden','true');emberOverlay.classList.remove('is-visible');emberOverlay.setAttribute('aria-hidden','true');balanceOverlay.classList.remove('is-visible');balanceOverlay.setAttribute('aria-hidden','true');canopyOverlay.classList.remove('is-visible');canopyOverlay.setAttribute('aria-hidden','true');highlandsOverlay.classList.remove('is-visible');highlandsOverlay.setAttribute('aria-hidden','true');opalOverlay.classList.remove('is-visible');opalOverlay.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('universe-joy','universe-love','universe-stability','universe-ember','universe-peace','universe-balance','universe-canopy','universe-highlands','universe-opal');joyFocusReturn=null;loveFocusReturn=null;stabilityFocusReturn=null;emberFocusReturn=null;balanceFocusReturn=null;canopyFocusReturn=null;highlandsFocusReturn=null;opalFocusReturn=null;
    scene.dataset.stage='arrival';document.documentElement.classList.remove('universe-encounter','universe-approaching');
    peaceFocusReturn=null;
  }
  if((index===4||index===0||index===1||index===2||index===3||index===5||index===6||index===7)&&ready){
    const active=document.activeElement;
    const stored=active&&active!==document.body&&typeof active.focus==='function'
      ?active:labels[index]||document.querySelector(`[data-summit="${index}"]`);
    if(index===4)peaceFocusReturn=stored;else if(index===1)loveFocusReturn=stored;else if(index===2)stabilityFocusReturn=stored;else if(index===3)emberFocusReturn=stored;else if(index===5)balanceFocusReturn=stored;else if(index===6)canopyFocusReturn=stored;else if(index===7)highlandsFocusReturn=stored;else if(index===8)opalFocusReturn=stored;else joyFocusReturn=stored;
  }
  teachingRevealVersion++;$('#scene-note').textContent='Begin with Peace · or turn the universe and explore all nine'; selected=index; close=false; targetZoom=1;targetOffset=[0,0,0];panel.style.setProperty('--world-accent',summits[index][2]);scene.style.setProperty('--world-accent',summits[index][2]);
  const [begin,summit]=summits[index], teaching=teachings[index];
  $('#reflection-path').textContent=`Summit ${index+1} of 9 · ${begin} → ${summit}`;
  $('#reflection-title').textContent=teaching.title;
  $('#reflection-copy').textContent=teaching.intro;
  $('#teaching-copy').textContent=teaching.teaching;
  $('#teaching-choice').textContent=teaching.choice;
  $('#reflection-question').textContent=teaching.question;
  $('#summit-teaching').hidden=true;
  panel.hidden=false;returnButton.hidden=false;approach.hidden=false;approach.disabled=false;approach.textContent='Look closer';
  approach.setAttribute('aria-expanded','false');
  labels.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));
  status.textContent=`${begin} leads to ${summit}.`;
  updateMotionControl();
  if(index===4&&ready){startPeaceFlight();return;}
  if(index===0&&ready){startJoyFlight();return;}
  if(index===1&&ready){startLoveFlight();return;}
  if(index===2&&ready){startStabilityFlight();return;}
  if(index===3&&ready){startEmberFlight();return;}
  if(index===5&&ready){startBalanceFlight();return;}
  if(index===6&&ready){startCanopyFlight();return;}
  if(index===7&&ready){startHighlandsFlight();return;}
  if(index===8&&ready){startOpalFlight();return;}
  requestFrame();
  if(scroll){panel.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});panel.focus({preventScroll:true});}
}
function returnToAll(){
  if((selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)&&(flight>.002||flightTarget>0)){flightTarget=0;flightStage='return';peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');joyOverlay.classList.remove('is-visible');joyOverlay.setAttribute('aria-hidden','true');loveOverlay.classList.remove('is-visible');loveOverlay.setAttribute('aria-hidden','true');
    stabilityOverlay.classList.remove('is-visible');stabilityOverlay.setAttribute('aria-hidden','true');emberOverlay.classList.remove('is-visible');emberOverlay.setAttribute('aria-hidden','true');balanceOverlay.classList.remove('is-visible');balanceOverlay.setAttribute('aria-hidden','true');canopyOverlay.classList.remove('is-visible');canopyOverlay.setAttribute('aria-hidden','true');highlandsOverlay.classList.remove('is-visible');highlandsOverlay.setAttribute('aria-hidden','true');opalOverlay.classList.remove('is-visible');opalOverlay.setAttribute('aria-hidden','true');peaceOverlay.style.opacity='0';peaceOverlay.style.pointerEvents='none';scene.dataset.stage='return';document.documentElement.classList.remove('universe-encounter','universe-joy','universe-love','universe-stability','universe-ember','universe-peace','universe-balance','universe-canopy','universe-highlands','universe-opal');updateMotionControl();requestFrame();return;}
  stopInertia();teachingRevealVersion++;$('#scene-note').textContent='Begin with Peace · or turn the universe and explore all nine'; const prior=selected; selected=-1;close=false;targetZoom=1;targetOffset=[0,0,0];panel.style.removeProperty('--world-accent');scene.style.removeProperty('--world-accent');
  panel.hidden=true;returnButton.hidden=true;status.textContent='All nine summits. One path. Your orientation is preserved.';
  $('#summit-teaching').hidden=true;approach.setAttribute('aria-expanded','false');
  labels.forEach(el=>el.setAttribute('aria-pressed','false'));requestFrame();
  if(prior>=0){const target=ready?labels[prior]:$(`[data-summit="${prior}"]`);target?.focus({preventScroll:true});scene.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});}
}

function startPeaceFlight(){
  panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';
  if(!peaceGL){try{setupPeaceWorld();}catch(error){console.error('Forgiveness world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Quiet Ocean is unavailable. Read the complete Peace teaching below.';panel.focus({preventScroll:true});return;}}
  scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});
  peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');
  $('#scene-note').textContent='Approaching Forgiveness — Peace';status.textContent='Traveling toward The Quiet Ocean.';
  updateMotionControl();requestFrame();
}
function openWorldList(){
 const list=$('#path-list');list.open=true;
 list.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 list.querySelector('summary')?.focus({preventScroll:true});
}
function beginWithPeace(){
  if(selected!==4) choose(4,false);
  setTimeout(()=>{ if(selected===4) startPeaceFlight(); }, reduced?0:180);
}
$('#explore-worlds').addEventListener('click',beginWithPeace);
$('#view-all-worlds').addEventListener('click',openWorldList);
$('#peace-return').addEventListener('click',returnToAll);
$('#joy-return').addEventListener('click',returnToAll);
$('#love-return').addEventListener('click',returnToAll);
$('#stability-return').addEventListener('click',returnToAll);
$('#ember-return').addEventListener('click',returnToAll);
$('#balance-return').addEventListener('click',returnToAll);
$('#canopy-return').addEventListener('click',returnToAll);
$('#highlands-return').addEventListener('click',returnToAll);
$('#opal-return').addEventListener('click',returnToAll);
function startLoveFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!loveGL){try{setupLoveWorld();}catch(error){console.error('Generosity world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Living Constellation is unavailable. Read the complete Love teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Generosity — Love';status.textContent='Traveling toward the Living Constellation.';updateMotionControl();requestFrame();}
function startHighlandsFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!highlandsGL){try{setupHighlandsWorld();}catch(error){console.error('Humility world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Quiet Highlands are unavailable. Read the complete Dignity teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Humility — Dignity';status.textContent='Traveling toward The Quiet Highlands.';updateMotionControl();requestFrame();}
function startOpalFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!opalGL){try{setupOpalWorld();}catch(error){console.error('Opal Passage world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Opal Passage is unavailable. Read the complete Free Will teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Purity — Free Will';status.textContent='Traveling toward The Opal Passage.';updateMotionControl();requestFrame();}

function startCanopyFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!canopyGL){try{setupCanopyWorld();}catch(error){console.error('Patience world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Ancient Canopy is unavailable. Read the complete Structure teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Patience — Structure';status.textContent='Traveling toward The Ancient Canopy.';updateMotionControl();requestFrame();}
function startBalanceFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!balanceGL){try{setupBalanceWorld();}catch(error){console.error('Self-Control world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Twin Equilibrium is unavailable. Read the complete Balance teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Self-Control — Balance';status.textContent='Traveling toward The Twin Equilibrium.';updateMotionControl();requestFrame();}
function startEmberFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!emberGL){try{setupEmberWorld();}catch(error){console.error('Accountability world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Ember Canyons are unavailable. Read the complete Character teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Accountability — Character';status.textContent='Traveling toward the Ember Canyons.';updateMotionControl();requestFrame();}
function startStabilityFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!stabilityGL){try{setupStabilityWorld();}catch(error){console.error('Dependability world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;approach.hidden=true;$('#summit-teaching').hidden=false;status.textContent='The Great Basalt Terraces are unavailable. Read the complete Stability teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Dependability — Stability';status.textContent='Traveling toward the Great Basalt Terraces.';updateMotionControl();requestFrame();}
function startJoyFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Gratitude — Joy';status.textContent='Traveling toward the Dawn Archipelago.';updateMotionControl();requestFrame();}

document.querySelectorAll('[data-summit]').forEach(el=>el.addEventListener('click',()=>choose(Number(el.dataset.summit))));
returnButton.addEventListener('click',returnToAll);
$('#return-from-teaching').addEventListener('click',returnToAll);
approach.addEventListener('click',()=>{
  if(selected<0)return;if(selected===4){startPeaceFlight();return;}if(selected===0){startJoyFlight();return;}if(selected===1){startLoveFlight();return;}if(selected===2){startStabilityFlight();return;}if(selected===3){startEmberFlight();return;}if(selected===5){startBalanceFlight();return;}if(selected===6){startCanopyFlight();return;}if(selected===7){startHighlandsFlight();return;}stopInertia();close=true;
  if(ready){targetOffset=centers[selected].map(value=>value*(width<600?.12:.20));targetZoom=width<600?1.08:1.27;requestFrame();}
  approach.disabled=true;approach.textContent='Exploring this summit';approach.setAttribute('aria-expanded','true');
  $('#scene-note').textContent=`${summits[selected][0]} → ${summits[selected][1]} · Return to all nine to keep exploring`;
  const teaching=$('#summit-teaching');teaching.hidden=false;
  status.textContent=`${summits[selected][1]} teaching opened.`;
  const openedIndex=selected,openedVersion=++teachingRevealVersion;const reveal=()=>{if(selected!==openedIndex||teachingRevealVersion!==openedVersion||teaching.hidden)return;teaching.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});teaching.focus({preventScroll:true});};if(reduced)reveal();else setTimeout(reveal,520);
});
$('#reset-view').addEventListener('click',()=>{if(!ready)return;cancelPointer();stopInertia();quaternion=[0,0,0,1];returnToAll();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&selected>=0){returnToAll();event.preventDefault();}});

// Book-derived contour preserved; non-radial tessellation prevents the previous pinwheel-face artifact.
const GEM_POINTS=[[0.038321,-0.619263,0.027],[0.081923,-0.578522,0.027],[0.130073,-0.535765,0.027],[0.182039,-0.490852,0.027],[0.23709,-0.443644,0.027],[0.294495,-0.394005,0.027],[0.353521,-0.341795,0.027],[0.413438,-0.286875,0.027],[0.47451,-0.225621,0.027],[0.528346,-0.16229,0.027],[0.574508,-0.09718,0.027],[0.612563,-0.030586,0.027],[0.642074,0.037194,0.027],[0.662607,0.105864,0.027],[0.673728,0.175128,0.027],[0.675,0.244688,0.027],[0.666965,0.315764,0.027],[0.650584,0.382667,0.027],[0.626056,0.444231,0.027],[0.593578,0.499289,0.027],[0.553348,0.546674,0.027],[0.505564,0.58522,0.027],[0.450424,0.613759,0.027],[0.388125,0.631125,0.027],[0.331996,0.636211,0.027],[0.278596,0.63131,0.027],[0.227648,0.61656,0.027],[0.178875,0.592102,0.027],[0.132001,0.558071,0.027],[0.086748,0.514608,0.027],[0.04284,0.461851,0.027],[0.0,0.399938,0.027],[-0.04284,0.461851,0.027],[-0.086748,0.514608,0.027],[-0.132001,0.558071,0.027],[-0.178875,0.592102,0.027],[-0.227648,0.61656,0.027],[-0.278596,0.63131,0.027],[-0.331996,0.636211,0.027],[-0.388125,0.631125,0.027],[-0.450424,0.613759,0.027],[-0.505564,0.58522,0.027],[-0.553348,0.546674,0.027],[-0.593578,0.499289,0.027],[-0.626056,0.444231,0.027],[-0.650584,0.382667,0.027],[-0.666965,0.315764,0.027],[-0.675,0.244688,0.027],[-0.673728,0.175128,0.027],[-0.662607,0.105864,0.027],[-0.642074,0.037194,0.027],[-0.612563,-0.030586,0.027],[-0.574508,-0.09718,0.027],[-0.528346,-0.16229,0.027],[-0.47451,-0.225621,0.027],[-0.413438,-0.286875,0.027],[-0.353521,-0.341795,0.027],[-0.294495,-0.394005,0.027],[-0.23709,-0.443644,0.027],[-0.182039,-0.490852,0.027],[-0.130073,-0.535765,0.027],[-0.081923,-0.578522,0.027],[-0.038321,-0.619263,0.027],[0.0,-0.658125,0.027],[0.441029,0.296273,0.110641],[-0.57938,0.039844,0.040794],[0.257699,0.284519,0.07507],[-0.381744,-0.239077,0.044458],[0.167658,0.008157,0.201803],[0.361226,-0.066697,0.064477],[-0.223385,0.14124,0.083239],[0.067468,0.387699,0.051578],[-0.231415,0.30497,0.116968],[0.351589,0.42104,0.131299],[-0.527722,0.235665,0.106675],[0.153628,0.097277,0.186437],[-0.186239,-0.35239,0.077398],[-0.50222,0.154127,0.109195],[0.629685,0.221869,0.047402],[-0.157223,-0.129676,0.121603],[0.565301,0.333784,0.05606],[-0.493114,0.295233,0.106134],[-0.36323,-0.188588,0.072262],[-0.415354,0.020324,0.10595],[0.480373,-0.111487,0.041529],[-0.057955,0.273172,0.093327],[-0.467307,0.535603,0.044343],[-0.225503,-0.097996,0.147158],[0.290705,-0.04109,0.105155],[0.447281,0.439952,0.099926],[0.259293,-0.132623,0.10736],[0.595483,0.034111,0.043264],[0.007951,-0.08531,0.130982],[-0.172481,0.262657,0.109636],[0.250741,0.484349,0.082147],[0.491874,0.232113,0.112165],[-0.086619,-0.460627,0.068774],[-0.027944,0.09646,0.140717],[0.428201,-0.001515,0.062676],[-0.526198,-0.099987,0.039374],[0.177534,-0.304252,0.089569],[0.278788,0.043903,0.144496],[-0.026212,-0.387943,0.10277],[0.357486,-0.231921,0.064134],[-0.128959,0.221481,0.099379],[0.007945,-0.600847,0.04046],[-0.036006,0.355689,0.057459],[-0.339986,0.405705,0.070831],[0.004664,0.247353,0.091178],[0.261052,-0.189465,0.105015],[-0.124023,-0.394981,0.086032],[-0.100356,-0.168294,0.091776],[-0.304943,-0.267252,0.057515],[0.378902,0.363628,0.127541],[-0.105128,0.342127,0.091016],[0.207023,0.352281,0.07882],[-0.443804,0.442323,0.054932],[0.154715,-0.376782,0.061],[-0.112914,-0.088764,0.128496],[0.047119,-0.347639,0.091408],[0.166749,0.277262,0.070851],[0.5105,0.391385,0.073123],[-0.261404,0.021202,0.132673],[0.175076,0.191214,0.098053],[-0.56346,0.316688,0.07065],[-0.175126,0.496469,0.055285],[0.122301,-0.056975,0.180051],[-0.585176,0.17822,0.069672],[-0.27821,0.113906,0.098013],[0.41777,0.079365,0.10277],[0.341509,0.15572,0.124278],[-0.381499,0.145416,0.131251],[-0.282519,0.183643,0.109335],[-0.108287,0.054188,0.119787],[-0.370374,-0.043221,0.125884],[0.178129,-0.430765,0.03846],[0.474285,0.103511,0.105222],[-0.12185,0.453123,0.055328],[-0.632564,0.256131,0.044673],[-0.048797,-0.530404,0.049599],[-0.030435,-0.450051,0.08202],[-0.081088,0.142918,0.101785],[-0.557686,0.43445,0.049169],[-0.433606,0.279363,0.128453],[-0.392295,-0.140106,0.084923],[0.359246,0.029379,0.093081],[0.239794,0.565125,0.045926],[0.080428,-0.127932,0.125989],[0.617355,0.345125,0.036578],[0.279423,0.373879,0.106564],[0.245866,-0.353994,0.05498],[0.069952,0.176167,0.115743],[0.483989,0.552837,0.042015],[0.479719,0.033972,0.071317],[0.103929,0.284391,0.075227],[-0.434171,0.18378,0.140483],[-0.346234,0.578446,0.048684],[0.376283,-0.130967,0.061964],[0.566303,0.157435,0.083377],[0.636174,0.160499,0.044247],[-0.14531,-0.315473,0.094139],[-0.303943,0.305289,0.122174],[-0.489131,0.364888,0.076082],[-0.254114,-0.157985,0.120343],[-0.282588,-0.323287,0.049531],[-0.062473,-0.030936,0.1431],[-0.312023,-0.158949,0.10771],[0.616293,0.280044,0.046121],[0.518206,0.291569,0.086627],[0.023435,0.150701,0.126756],[-0.519439,-0.037048,0.050131],[0.397746,-0.19737,0.054787],[-0.187648,-0.231794,0.093561],[-0.274105,0.393145,0.087612],[0.11579,-0.178427,0.109616],[-0.012026,-0.261513,0.090714],[0.546977,0.22749,0.090154],[-0.434984,0.370254,0.077641],[-0.468047,0.036491,0.084309],[0.558524,-0.046583,0.038262],[0.41889,0.154887,0.127126],[0.283006,0.438193,0.11043],[0.186628,0.501211,0.051809],[0.350263,0.266005,0.107506],[-0.21579,0.564254,0.045068],[-0.310063,0.06678,0.117516],[-0.362267,0.044908,0.121369],[0.229023,0.172427,0.109032],[0.574193,0.397833,0.04432],[-0.219382,0.414769,0.085829],[-0.258727,-0.210846,0.092749],[0.017688,-0.500688,0.058652],[-0.378645,0.487633,0.054035],[0.171951,-0.143501,0.126209],[0.25935,-0.297508,0.077733],[0.508574,0.166148,0.111869],[0.186245,-0.211331,0.11337],[0.050397,-0.440215,0.063535],[-0.001957,-0.205161,0.081835],[0.001673,-0.015743,0.17052],[0.421116,-0.054702,0.05086],[0.451844,0.371024,0.104223],[0.124696,0.226875,0.086153],[0.107706,-0.262201,0.097609],[0.078099,0.052342,0.208233],[-0.285451,0.530215,0.060775],[0.257471,0.220046,0.082891],[-0.24614,-0.036651,0.153387],[0.038321,-0.619263,-0.027],[0.081923,-0.578522,-0.027],[0.130073,-0.535765,-0.027],[0.182039,-0.490852,-0.027],[0.23709,-0.443644,-0.027],[0.294495,-0.394005,-0.027],[0.353521,-0.341795,-0.027],[0.413438,-0.286875,-0.027],[0.47451,-0.225621,-0.027],[0.528346,-0.16229,-0.027],[0.574508,-0.09718,-0.027],[0.612563,-0.030586,-0.027],[0.642074,0.037194,-0.027],[0.662607,0.105864,-0.027],[0.673728,0.175128,-0.027],[0.675,0.244688,-0.027],[0.666965,0.315764,-0.027],[0.650584,0.382667,-0.027],[0.626056,0.444231,-0.027],[0.593578,0.499289,-0.027],[0.553348,0.546674,-0.027],[0.505564,0.58522,-0.027],[0.450424,0.613759,-0.027],[0.388125,0.631125,-0.027],[0.331996,0.636211,-0.027],[0.278596,0.63131,-0.027],[0.227648,0.61656,-0.027],[0.178875,0.592102,-0.027],[0.132001,0.558071,-0.027],[0.086748,0.514608,-0.027],[0.04284,0.461851,-0.027],[0.0,0.399938,-0.027],[-0.04284,0.461851,-0.027],[-0.086748,0.514608,-0.027],[-0.132001,0.558071,-0.027],[-0.178875,0.592102,-0.027],[-0.227648,0.61656,-0.027],[-0.278596,0.63131,-0.027],[-0.331996,0.636211,-0.027],[-0.388125,0.631125,-0.027],[-0.450424,0.613759,-0.027],[-0.505564,0.58522,-0.027],[-0.553348,0.546674,-0.027],[-0.593578,0.499289,-0.027],[-0.626056,0.444231,-0.027],[-0.650584,0.382667,-0.027],[-0.666965,0.315764,-0.027],[-0.675,0.244688,-0.027],[-0.673728,0.175128,-0.027],[-0.662607,0.105864,-0.027],[-0.642074,0.037194,-0.027],[-0.612563,-0.030586,-0.027],[-0.574508,-0.09718,-0.027],[-0.528346,-0.16229,-0.027],[-0.47451,-0.225621,-0.027],[-0.413438,-0.286875,-0.027],[-0.353521,-0.341795,-0.027],[-0.294495,-0.394005,-0.027],[-0.23709,-0.443644,-0.027],[-0.182039,-0.490852,-0.027],[-0.130073,-0.535765,-0.027],[-0.081923,-0.578522,-0.027],[-0.038321,-0.619263,-0.027],[0.0,-0.658125,-0.027],[0.441029,0.296273,-0.110641],[-0.57938,0.039844,-0.040794],[0.257699,0.284519,-0.07507],[-0.381744,-0.239077,-0.044458],[0.167658,0.008157,-0.201803],[0.361226,-0.066697,-0.064477],[-0.223385,0.14124,-0.083239],[0.067468,0.387699,-0.051578],[-0.231415,0.30497,-0.116968],[0.351589,0.42104,-0.131299],[-0.527722,0.235665,-0.106675],[0.153628,0.097277,-0.186437],[-0.186239,-0.35239,-0.077398],[-0.50222,0.154127,-0.109195],[0.629685,0.221869,-0.047402],[-0.157223,-0.129676,-0.121603],[0.565301,0.333784,-0.05606],[-0.493114,0.295233,-0.106134],[-0.36323,-0.188588,-0.072262],[-0.415354,0.020324,-0.10595],[0.480373,-0.111487,-0.041529],[-0.057955,0.273172,-0.093327],[-0.467307,0.535603,-0.044343],[-0.225503,-0.097996,-0.147158],[0.290705,-0.04109,-0.105155],[0.447281,0.439952,-0.099926],[0.259293,-0.132623,-0.10736],[0.595483,0.034111,-0.043264],[0.007951,-0.08531,-0.130982],[-0.172481,0.262657,-0.109636],[0.250741,0.484349,-0.082147],[0.491874,0.232113,-0.112165],[-0.086619,-0.460627,-0.068774],[-0.027944,0.09646,-0.140717],[0.428201,-0.001515,-0.062676],[-0.526198,-0.099987,-0.039374],[0.177534,-0.304252,-0.089569],[0.278788,0.043903,-0.144496],[-0.026212,-0.387943,-0.10277],[0.357486,-0.231921,-0.064134],[-0.128959,0.221481,-0.099379],[0.007945,-0.600847,-0.04046],[-0.036006,0.355689,-0.057459],[-0.339986,0.405705,-0.070831],[0.004664,0.247353,-0.091178],[0.261052,-0.189465,-0.105015],[-0.124023,-0.394981,-0.086032],[-0.100356,-0.168294,-0.091776],[-0.304943,-0.267252,-0.057515],[0.378902,0.363628,-0.127541],[-0.105128,0.342127,-0.091016],[0.207023,0.352281,-0.07882],[-0.443804,0.442323,-0.054932],[0.154715,-0.376782,-0.061],[-0.112914,-0.088764,-0.128496],[0.047119,-0.347639,-0.091408],[0.166749,0.277262,-0.070851],[0.5105,0.391385,-0.073123],[-0.261404,0.021202,-0.132673],[0.175076,0.191214,-0.098053],[-0.56346,0.316688,-0.07065],[-0.175126,0.496469,-0.055285],[0.122301,-0.056975,-0.180051],[-0.585176,0.17822,-0.069672],[-0.27821,0.113906,-0.098013],[0.41777,0.079365,-0.10277],[0.341509,0.15572,-0.124278],[-0.381499,0.145416,-0.131251],[-0.282519,0.183643,-0.109335],[-0.108287,0.054188,-0.119787],[-0.370374,-0.043221,-0.125884],[0.178129,-0.430765,-0.03846],[0.474285,0.103511,-0.105222],[-0.12185,0.453123,-0.055328],[-0.632564,0.256131,-0.044673],[-0.048797,-0.530404,-0.049599],[-0.030435,-0.450051,-0.08202],[-0.081088,0.142918,-0.101785],[-0.557686,0.43445,-0.049169],[-0.433606,0.279363,-0.128453],[-0.392295,-0.140106,-0.084923],[0.359246,0.029379,-0.093081],[0.239794,0.565125,-0.045926],[0.080428,-0.127932,-0.125989],[0.617355,0.345125,-0.036578],[0.279423,0.373879,-0.106564],[0.245866,-0.353994,-0.05498],[0.069952,0.176167,-0.115743],[0.483989,0.552837,-0.042015],[0.479719,0.033972,-0.071317],[0.103929,0.284391,-0.075227],[-0.434171,0.18378,-0.140483],[-0.346234,0.578446,-0.048684],[0.376283,-0.130967,-0.061964],[0.566303,0.157435,-0.083377],[0.636174,0.160499,-0.044247],[-0.14531,-0.315473,-0.094139],[-0.303943,0.305289,-0.122174],[-0.489131,0.364888,-0.076082],[-0.254114,-0.157985,-0.120343],[-0.282588,-0.323287,-0.049531],[-0.062473,-0.030936,-0.1431],[-0.312023,-0.158949,-0.10771],[0.616293,0.280044,-0.046121],[0.518206,0.291569,-0.086627],[0.023435,0.150701,-0.126756],[-0.519439,-0.037048,-0.050131],[0.397746,-0.19737,-0.054787],[-0.187648,-0.231794,-0.093561],[-0.274105,0.393145,-0.087612],[0.11579,-0.178427,-0.109616],[-0.012026,-0.261513,-0.090714],[0.546977,0.22749,-0.090154],[-0.434984,0.370254,-0.077641],[-0.468047,0.036491,-0.084309],[0.558524,-0.046583,-0.038262],[0.41889,0.154887,-0.127126],[0.283006,0.438193,-0.11043],[0.186628,0.501211,-0.051809],[0.350263,0.266005,-0.107506],[-0.21579,0.564254,-0.045068],[-0.310063,0.06678,-0.117516],[-0.362267,0.044908,-0.121369],[0.229023,0.172427,-0.109032],[0.574193,0.397833,-0.04432],[-0.219382,0.414769,-0.085829],[-0.258727,-0.210846,-0.092749],[0.017688,-0.500688,-0.058652],[-0.378645,0.487633,-0.054035],[0.171951,-0.143501,-0.126209],[0.25935,-0.297508,-0.077733],[0.508574,0.166148,-0.111869],[0.186245,-0.211331,-0.11337],[0.050397,-0.440215,-0.063535],[-0.001957,-0.205161,-0.081835],[0.001673,-0.015743,-0.17052],[0.421116,-0.054702,-0.05086],[0.451844,0.371024,-0.104223],[0.124696,0.226875,-0.086153],[0.107706,-0.262201,-0.097609],[0.078099,0.052342,-0.208233],[-0.285451,0.530215,-0.060775],[0.257471,0.220046,-0.082891],[-0.24614,-0.036651,-0.153387]];
const GEM_TRIANGLES=[78,14,15,14,159,13,159,14,78,146,26,27,125,205,189,19,20,89,42,43,142,86,42,142,116,86,142,124,142,45,46,124,45,65,50,51,50,65,49,122,133,70,198,175,203,75,123,151,204,151,169,204,75,151,126,204,199,72,114,189,159,158,13,158,159,78,16,167,15,167,78,15,129,180,130,168,167,80,130,183,206,180,183,130,183,180,64,113,183,64,101,145,130,145,129,130,129,145,98,145,101,88,151,108,169,192,86,116,20,152,89,152,20,21,125,184,205,188,18,19,188,17,18,142,44,45,43,44,142,127,48,49,65,127,49,52,170,51,170,65,51,175,111,160,111,175,198,165,92,199,92,126,199,92,111,198,87,166,163,67,54,55,58,76,57,105,139,62,105,62,63,0,105,63,105,191,139,105,0,1,191,105,1,2,191,1,191,140,139,139,61,62,60,61,139,84,8,9,84,200,157,10,84,9,157,90,109,8,171,7,84,171,8,171,84,157,123,202,151,202,108,151,108,202,154,101,187,75,187,123,75,123,187,206,187,130,206,187,101,130,204,68,75,68,204,126,68,101,75,101,68,88,68,90,88,108,141,169,133,141,70,141,104,70,72,93,114,104,93,70,153,129,98,95,180,195,180,95,64,95,168,64,168,201,64,113,201,89,201,113,64,73,113,89,152,73,89,73,152,23,24,73,23,183,66,206,94,115,181,94,24,146,73,94,181,94,73,24,93,85,114,85,93,104,141,85,104,85,141,108,114,137,189,137,125,189,115,71,154,71,108,154,156,192,205,192,156,86,37,156,205,184,37,205,37,184,36,22,152,21,152,22,23,184,35,36,148,188,80,188,148,17,17,148,16,148,167,16,167,148,80,138,46,47,138,124,46,48,138,47,127,138,48,54,144,53,144,166,134,170,178,65,118,92,165,92,118,111,133,118,165,79,87,163,118,79,111,79,118,87,207,122,134,166,207,134,87,207,166,118,207,87,207,133,122,207,118,133,5,150,4,6,150,5,150,135,4,135,150,117,76,110,160,110,58,59,58,110,76,96,60,139,140,96,139,60,96,59,96,110,59,175,119,203,119,117,203,200,69,157,90,69,88,69,90,157,69,145,88,145,69,98,69,200,98,90,193,109,193,68,126,68,193,90,103,157,109,103,171,157,171,103,7,103,6,7,162,116,142,124,162,142,107,192,116,192,107,205,138,74,124,74,138,127,93,132,70,132,93,72,141,97,169,97,141,133,204,97,199,97,204,169,97,165,199,97,133,165,153,136,129,180,136,195,136,180,129,136,158,195,12,91,11,91,12,13,158,91,13,136,91,158,91,136,153,200,179,98,179,153,98,84,179,200,179,84,10,179,10,11,91,179,11,179,91,153,168,176,167,95,176,168,167,176,78,176,158,78,158,176,195,176,95,195,121,168,80,121,201,168,188,121,80,201,121,89,121,19,89,121,188,19,113,149,183,149,66,183,149,73,181,73,149,113,115,149,181,66,149,115,120,123,206,66,120,206,120,202,123,202,120,154,120,115,154,120,66,115,94,182,115,182,71,115,182,146,27,182,94,146,106,85,108,71,106,108,85,106,114,106,137,114,137,106,32,146,25,26,24,25,146,86,41,42,137,33,125,33,137,32,34,184,125,34,35,184,33,34,125,170,99,134,99,144,134,144,99,53,99,52,53,99,170,52,144,82,166,82,112,166,112,82,67,67,82,54,82,144,54,186,122,185,122,186,134,83,170,134,83,178,170,186,83,134,76,164,57,193,196,109,117,100,203,150,100,117,100,196,203,135,3,4,197,135,117,119,197,117,2,197,191,197,140,191,3,197,2,197,3,135,102,96,140,96,102,110,197,102,140,102,197,119,102,119,175,102,175,160,110,102,160,174,198,203,196,174,203,174,196,193,194,150,6,103,194,6,194,103,109,194,100,150,196,194,109,100,194,196,81,162,124,74,81,124,81,74,143,177,81,143,81,177,162,162,177,116,177,107,116,161,132,72,132,161,143,161,177,143,177,161,107,205,173,189,107,173,205,161,173,107,173,72,189,173,161,72,77,74,127,77,127,65,178,77,65,132,128,70,122,128,185,128,122,70,182,29,71,106,31,32,31,106,71,37,38,156,38,39,156,156,40,86,39,40,156,40,41,86,56,164,112,56,67,55,56,112,67,164,56,57,172,76,160,172,164,76,172,79,163,111,172,160,79,172,111,147,92,198,174,147,198,92,147,126,147,193,126,147,174,193,74,155,143,77,155,74,28,182,27,28,29,182,29,30,71,30,31,71,164,190,112,172,190,164,190,172,163,166,190,163,112,190,166,131,132,143,155,131,143,131,128,132,128,131,185,131,186,185,83,131,178,131,83,186,131,77,178,131,155,77,286,223,222,222,221,367,367,286,222,354,235,234,333,397,413,227,297,228,250,350,251,294,350,250,324,350,294,332,253,350,254,253,332,273,259,258,258,257,273,330,278,341,406,411,383,283,359,331,412,377,359,412,359,283,334,407,412,280,397,322,367,221,366,366,286,367,224,223,375,375,223,286,337,338,388,376,288,375,338,414,391,388,338,391,391,272,388,321,272,391,309,338,353,353,338,337,337,306,353,353,296,309,359,377,316,400,324,294,228,297,360,360,229,228,333,413,392,396,227,226,396,226,225,350,253,252,251,350,252,335,257,256,273,257,335,260,259,378,378,259,273,383,368,319,319,406,383,373,407,300,300,407,334,300,406,319,295,371,374,275,263,262,266,265,284,313,270,347,313,271,270,208,271,313,313,347,399,313,209,208,399,209,313,210,209,399,399,347,348,347,270,269,268,347,269,292,217,216,292,365,408,218,217,292,365,317,298,216,215,379,292,216,379,379,365,292,331,359,410,410,359,316,316,362,410,309,283,395,395,283,331,331,414,395,395,414,338,395,338,309,412,283,276,276,334,412,276,283,309,309,296,276,276,296,298,316,377,349,341,278,349,349,278,312,280,322,301,312,278,301,361,306,337,303,403,388,388,272,303,303,272,376,376,272,409,321,297,409,409,272,321,281,297,321,360,297,281,281,231,360,232,231,281,391,414,274,302,389,323,302,354,232,281,389,302,302,232,281,301,322,293,293,312,301,349,312,293,293,316,349,322,397,345,345,397,333,323,362,279,279,362,316,364,413,400,400,294,364,245,413,364,392,413,245,245,244,392,230,229,360,360,231,230,392,244,243,356,288,396,396,225,356,225,224,356,356,224,375,375,288,356,346,255,254,346,254,332,256,255,346,335,256,346,262,261,352,352,342,374,378,273,386,326,373,300,300,319,326,341,373,326,287,371,295,326,319,287,287,295,326,415,342,330,374,342,415,295,374,415,326,295,415,415,330,341,415,341,326,213,212,358,214,213,358,358,212,343,343,325,358,284,368,318,318,267,266,266,284,318,304,347,268,348,347,304,268,267,304,304,267,318,383,411,327,327,411,325,408,365,277,298,296,277,277,365,298,277,296,353,353,306,277,277,306,408,298,317,401,401,334,276,276,298,401,311,317,365,311,365,379,379,215,311,311,215,214,370,350,324,332,350,370,315,324,400,400,413,315,346,332,282,282,335,346,301,278,340,340,280,301,349,377,305,305,341,349,412,407,305,305,377,412,305,407,373,305,373,341,361,337,344,388,403,344,344,337,388,344,403,366,220,219,299,299,221,220,366,221,299,344,366,299,299,361,344,408,306,387,387,306,361,292,408,387,387,218,292,387,219,218,299,219,387,387,361,299,376,375,384,303,376,384,375,286,384,384,286,366,366,403,384,384,403,303,329,288,376,329,376,409,396,288,329,409,297,329,329,297,227,329,227,396,321,391,357,357,391,274,357,389,281,281,321,357,323,389,357,274,323,357,328,414,331,274,414,328,328,331,410,410,362,328,328,362,323,328,323,274,302,323,390,390,323,279,390,235,354,390,354,302,314,316,293,279,316,314,293,322,314,314,322,345,345,240,314,354,234,233,232,354,233,294,250,249,345,333,241,241,240,345,242,333,392,242,392,243,241,333,242,378,342,307,307,342,352,352,261,307,307,261,260,307,260,378,352,374,290,290,374,320,320,275,290,275,262,290,290,262,352,394,393,330,330,342,394,291,342,378,291,378,386,394,342,291,284,265,372,401,317,404,325,411,308,358,325,308,308,411,404,343,212,211,405,325,343,327,325,405,210,399,405,405,399,348,211,210,405,405,343,211,310,348,304,304,318,310,405,348,310,310,327,405,310,383,327,310,368,383,318,368,310,382,411,406,404,411,382,382,401,404,402,214,358,311,214,402,402,317,311,402,358,308,404,317,402,308,404,402,289,332,370,282,332,289,289,351,282,385,351,289,289,370,385,370,324,385,385,324,315,369,280,340,340,351,369,369,351,385,385,315,369,413,397,381,315,413,381,369,315,381,381,397,280,381,280,369,285,335,282,285,273,335,386,273,285,340,278,336,330,393,336,336,278,330,390,279,237,314,240,239,239,279,314,245,364,246,246,364,247,364,294,248,247,364,248,248,294,249,264,320,372,264,263,275,264,275,320,372,265,264,380,368,284,380,284,372,380,371,287,319,368,380,287,319,380,355,406,300,382,406,355,300,334,355,355,334,401,355,401,382,282,351,363,285,282,363,236,235,390,236,390,237,237,279,238,238,279,239,372,320,398,380,372,398,398,371,380,374,371,398,320,374,398,339,351,340,363,351,339,339,340,336,336,393,339,339,393,394,291,386,339,339,394,291,339,386,285,339,285,363,0,208,209,0,209,1,1,209,210,1,210,2,2,210,211,2,211,3,3,211,212,3,212,4,4,212,213,4,213,5,5,213,214,5,214,6,6,214,215,6,215,7,7,215,216,7,216,8,8,216,217,8,217,9,9,217,218,9,218,10,10,218,219,10,219,11,11,219,220,11,220,12,12,220,221,12,221,13,13,221,222,13,222,14,14,222,223,14,223,15,15,223,224,15,224,16,16,224,225,16,225,17,17,225,226,17,226,18,18,226,227,18,227,19,19,227,228,19,228,20,20,228,229,20,229,21,21,229,230,21,230,22,22,230,231,22,231,23,23,231,232,23,232,24,24,232,233,24,233,25,25,233,234,25,234,26,26,234,235,26,235,27,27,235,236,27,236,28,28,236,237,28,237,29,29,237,238,29,238,30,30,238,239,30,239,31,31,239,240,31,240,32,32,240,241,32,241,33,33,241,242,33,242,34,34,242,243,34,243,35,35,243,244,35,244,36,36,244,245,36,245,37,37,245,246,37,246,38,38,246,247,38,247,39,39,247,248,39,248,40,40,248,249,40,249,41,41,249,250,41,250,42,42,250,251,42,251,43,43,251,252,43,252,44,44,252,253,44,253,45,45,253,254,45,254,46,46,254,255,46,255,47,47,255,256,47,256,48,48,256,257,48,257,49,49,257,258,49,258,50,50,258,259,50,259,51,51,259,260,51,260,52,52,260,261,52,261,53,53,261,262,53,262,54,54,262,263,54,263,55,55,263,264,55,264,56,56,264,265,56,265,57,57,265,266,57,266,58,58,266,267,58,267,59,59,267,268,59,268,60,60,268,269,60,269,61,61,269,270,61,270,62,62,270,271,62,271,63,63,271,208,63,208,0];
function heartDescriptor(K){
 const vertices=GEM_POINTS.map(p=>K.createHEarthVector3(p[0],p[1],p[2]));
 return K.constructHEarthTriangleMesh({primitiveId:'universe-diamond-heart',vertices,indices:GEM_TRIANGLES,expectedClosure:'CLOSED_REQUIRED',semanticRole:'ILLUMINATED_CENTRAL_HEART'});
}
function buildGeometry(K){
  const results=[heartDescriptor(K),...summits.map((p,i)=>K.constructHEarthEllipsoidMesh({primitiveId:`universe-planet-${i}`,center:K.createHEarthVector3(0,0,0),radii:K.createHEarthVector3(1,1,1),longitudeSampleCount:i===4?72:24,latitudeSampleCount:i===4?40:13,semanticRole:`${p[0]}_TO_${p[1]}`}))];
  for(const result of results)if(!result.valid||K.hasHEarthBlockingIssues(result.issues))throw Error('Geometry construction: '+result.issues.map(x=>x.code).join(','));
  const admitted=K.admitHEarthPrimitiveBatch(results.map(x=>x.primitiveRecord),{frameId:'nine-summits-universe-first-slice'});
  if(!admitted.valid||!K.isHEarthAggregateFrameAdmissionRecord(admitted.frame)||K.hasHEarthBlockingIssues(admitted.issues))throw Error('Geometry admission failed');
  receipt={status:'ready',geometryKernel:'/showroom/globe/h-earth/render/geometry-kernel.js',westAdmitted:true,primitiveCount:admitted.frame.primitiveCount,triangleCount:0,physics:'/assets/compass/compass.orbit-physics.js',heartContourSource:'nine-summits-of-love/index.html@171a74bc3f1f170c36079b00407fb569b56992bf'};
  return admitted.frame.primitives.map((primitive,meshIndex)=>{
    const g=primitive.geometry, data=[];
    g.indices.forEach((index,j)=>{const p=g.vertices[index],n=meshIndex===0?g.faceNormals[Math.floor(j/3)]:g.normals[index];data.push(p.x,p.y,p.z,n.x,n.y,n.z,(Math.sin((Math.floor(j/3)+1)*78.233)*43758.5453)%1);});
    receipt.triangleCount+=g.indices.length/3;
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    return {buffer,count:g.indices.length};
  });
}
/* GRATITUDE / JOY: THE DAWN ARCHIPELAGO — an independently articulated WebGL environment.
   One-world proof: no external photos, no new public dependencies. */
let joyGL=null,joyProgram=null,joySkyProgram=null,joyMesh=null,joyOcean=null,joySkyBuffer=null,joyLocation={},joySkyLocation={};
const joyWorldCanvas=document.querySelector('#joy-world-canvas');
const joyVertexSource=`precision mediump float;attribute vec3 aPosition;attribute vec3 aNormal;uniform vec2 uViewport;uniform float uTime;varying vec3 vWorld,vNormal;varying float vDepth;
void main(){
 vec3 p=aPosition;
 if(p.y<.01){p.y+=.028*sin(p.x*1.1+uTime*.72)+.018*sin(p.z*.77+uTime*.48);}
 vec3 cam=p-vec3(0.,1.58,-7.);
 float d=max(.5,cam.z);
 float f=1.83;
 gl_Position=vec4(cam.x*f/uViewport.x,(cam.y+cam.z*.058)*f,cam.z*.996-.22,d);
 vWorld=p;vNormal=aNormal;vDepth=d;
}`;
const joyFragmentSource=`precision mediump float;uniform float uTime,uKind;varying vec3 vWorld,vNormal;varying float vDepth;
float rand(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453123);}
float wave(vec2 p){return sin(p.x*1.9+uTime*.67)*.5+sin(p.y*1.5-uTime*.43)*.32+sin((p.x+p.y)*2.9+uTime*.23)*.18;}
void main(){
 vec3 sun=normalize(vec3(-.33,.62,-.73));
 vec3 n=normalize(vNormal);
 vec3 c;
 if(uKind<.5){
   float w=wave(vWorld.xz);
   float sunset=pow(max(0.,dot(normalize(vec3(vWorld.x*.08,.2,vWorld.z*.08+.38)),sun)),5.);
   float streak=pow(max(0.,sin(vWorld.x*.75-vWorld.z*.3+uTime*.23)*.5+.5),16.);
   c=mix(vec3(.018,.18,.25),vec3(.16,.43,.46),clamp(.5+.24*w,0.,1.));
   c+=vec3(.92,.53,.19)*pow(max(0.,.6+sunset),2.)*.46;
   c+=vec3(1.,.76,.35)*(streak*.10 + .16*pow(max(0.,sin(vWorld.z*.65+uTime*.25)),22.));
   c+=vec3(.13,.21,.18)*clamp((vWorld.z-4.)/48.,0.,1.);
 }else{
   float slope=max(0.,dot(n,sun));
   float level=vWorld.y;
   vec3 sand=vec3(.72,.49,.27),rock=vec3(.24,.25,.27),grass=vec3(.27,.32,.21);
   float fractures=rand(floor(vWorld.xz*3.4))*.19;
   c=mix(sand,rock,smoothstep(.38,1.5,level));
   c=mix(c,grass,smoothstep(1.15,2.3,level)*.74);
   c*=.54+.76*slope+fractures;
   c+=vec3(.46,.21,.075)*pow(max(0.,dot(n,sun)),12.)*.22;
 }
 float fog=clamp((vDepth-15.)/56.,0.,.73);
 c=mix(c,vec3(.88,.52,.45),fog*.5);
 c=pow(max(c,vec3(.002)),vec3(.87));
 gl_FragColor=vec4(c,1.);
}`;
const joySkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const joySkyFragment=`precision mediump float;uniform float uTime,uAspect;varying vec2 vUv;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.54);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 p=vUv;float elev=clamp(p.y,0.,1.);
 vec3 sky=mix(vec3(.98,.55,.36),vec3(.23,.28,.53),smoothstep(.18,.89,elev));
 sky=mix(vec3(.42,.19,.35),sky,smoothstep(0.,.29,elev));
 float dusk=smoothstep(.28,.025,abs(p.y-.50));sky+=vec3(.30,.13,.07)*dusk;
 vec2 sun=(p-vec2(.53,.68))*vec2(uAspect,1.);
 float sd=length(sun);
 sky+=vec3(1.,.55,.23)*(.55*exp(-sd*6.)+.28*exp(-sd*28.));
 sky=mix(sky,vec3(1.,.92,.68),1.-smoothstep(.028,.044,sd));
 float cloud=n(vec2(p.x*uAspect*4.2,p.y*7.3)+vec2(uTime*.012,0.));
 cloud=.60*cloud+.30*n(p*vec2(uAspect*13.,16.)+vec2(3.,uTime*.009));
 float stripe=smoothstep(.30,.64,cloud)*smoothstep(.24,.35,p.y)*(1.-smoothstep(.71,.85,p.y));
 sky=mix(sky,mix(vec3(.31,.31,.52),vec3(1.,.79,.67),p.y),stripe*.52);
 gl_FragColor=vec4(pow(sky,vec3(.93)),1.);
}`;
function joyCompile(type,source){const sh=joyGL.createShader(type);joyGL.shaderSource(sh,source);joyGL.compileShader(sh);if(!joyGL.getShaderParameter(sh,joyGL.COMPILE_STATUS))throw Error('Joy shader: '+joyGL.getShaderInfoLog(sh));return sh;}
function joyLink(vs,fs){const pr=joyGL.createProgram(),a=joyCompile(joyGL.VERTEX_SHADER,vs),b=joyCompile(joyGL.FRAGMENT_SHADER,fs);joyGL.attachShader(pr,a);joyGL.attachShader(pr,b);joyGL.linkProgram(pr);joyGL.deleteShader(a);joyGL.deleteShader(b);if(!joyGL.getProgramParameter(pr,joyGL.LINK_STATUS))throw Error('Joy link: '+joyGL.getProgramInfoLog(pr));return pr;}
function joyBuildIslands(){
 const verts=[],normals=[];
 const islands=[[-7.8,1.,6.8,4.9,1.2],[8.2,3.5,7.4,6.,1.35],[-2.7,16.5,4.4,3.9,1.25],[6.1,21.,5.8,5.6,1.9],[-10.,27.,5.,4.5,1.7],[12.,33.,6.,6.,2.0],[-13.,38.,6.,5.5,1.45]];
 for(const [cx,cz,rx,rz,height] of islands){
  const steps=40,rings=8;
  let nodes=[];
  for(let j=0;j<=rings;j++){
   const t=j/rings,arr=[];
   for(let i=0;i<steps;i++){
    const ang=2*Math.PI*i/steps;
    const wrinkle=1+.13*Math.sin(ang*5+cx)+.085*Math.cos(ang*9+cz);
    const radial=t*wrinkle;
    const x=cx+Math.cos(ang)*rx*radial,z=cz+Math.sin(ang)*rz*radial;
    const ridge=.63+.23*Math.sin(2.3*x+.37*z)+.12*Math.sin(z*3.12-x*.61)+.08*Math.cos(x*4.7+z*2.0);
    const y=.012+height*Math.pow(Math.max(0.,1-Math.pow(t,3.1)),.79)*Math.max(.36,ridge);
    arr.push([x,y,z]);
   }
   nodes.push(arr);
  }
  function tri(a,b,c){const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ac=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let nx=ab[1]*ac[2]-ab[2]*ac[1],ny=ab[2]*ac[0]-ab[0]*ac[2],nz=ab[0]*ac[1]-ab[1]*ac[0];const len=Math.hypot(nx,ny,nz)||1;let norm=[nx/len,ny/len,nz/len];if(norm[1]<0)norm=norm.map(v=>-v);for(const v of [a,b,c]){verts.push(...v,...norm)}}
  for(let j=0;j<rings;j++)for(let i=0;i<steps;i++){const k=(i+1)%steps;tri(nodes[j][i],nodes[j+1][i],nodes[j+1][k]);tri(nodes[j][i],nodes[j+1][k],nodes[j][k]);}
 }
 return new Float32Array(verts);
}
function joyBuildOcean(){
 const data=[];const tri=(a,b,c)=>{for(const p of [a,b,c])data.push(...p,0,1,0);};
 // Continuous 3D ocean mesh with correct depth and physically coherent wave phase.
 for(let iz=0;iz<48;iz++)for(let ix=0;ix<18;ix++){
   const x0=-32+ix*64/18,x1=-32+(ix+1)*64/18;
   const z0=-3+iz*79/48,z1=-3+(iz+1)*79/48;
   tri([x0,0,z0],[x1,0,z0],[x0,0,z1]);tri([x1,0,z0],[x1,0,z1],[x0,0,z1]);
 }
 return new Float32Array(data);
}
function setupJoyWorld(){
 joyGL=joyWorldCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!joyGL)throw Error('Gratitude world WebGL unavailable');
 joyProgram=joyLink(joyVertexSource,joyFragmentSource);joySkyProgram=joyLink(joySkyVertex,joySkyFragment);
 for(const key of ['aPosition','aNormal'])joyLocation[key]=joyGL.getAttribLocation(joyProgram,key);
 for(const key of ['uViewport','uTime','uKind'])joyLocation[key]=joyGL.getUniformLocation(joyProgram,key);
 joySkyLocation.aXY=joyGL.getAttribLocation(joySkyProgram,'aXY');
 for(const key of ['uTime','uAspect'])joySkyLocation[key]=joyGL.getUniformLocation(joySkyProgram,key);
 function buf(data){let b=joyGL.createBuffer();joyGL.bindBuffer(joyGL.ARRAY_BUFFER,b);joyGL.bufferData(joyGL.ARRAY_BUFFER,data,joyGL.STATIC_DRAW);return{buffer:b,count:data.length/6};}
 joyMesh=buf(joyBuildIslands());joyOcean=buf(joyBuildOcean());
 joySkyBuffer=joyGL.createBuffer();joyGL.bindBuffer(joyGL.ARRAY_BUFFER,joySkyBuffer);joyGL.bufferData(joyGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),joyGL.STATIC_DRAW);
 joyGL.enable(joyGL.DEPTH_TEST);joyGL.clearColor(.2,.23,.42,1.);
}
function drawJoyWorld(t){
 if(!joyGL)return;
 const bounds=joyWorldCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3);
 const w=Math.max(1,Math.round(bounds.width*dpr)),h=Math.max(1,Math.round(bounds.height*dpr));
 if(joyWorldCanvas.width!==w||joyWorldCanvas.height!==h){joyWorldCanvas.width=w;joyWorldCanvas.height=h;}
 joyGL.viewport(0,0,w,h);joyGL.clear(joyGL.COLOR_BUFFER_BIT|joyGL.DEPTH_BUFFER_BIT);
 joyGL.disable(joyGL.DEPTH_TEST);joyGL.useProgram(joySkyProgram);joyGL.bindBuffer(joyGL.ARRAY_BUFFER,joySkyBuffer);
 joyGL.vertexAttribPointer(joySkyLocation.aXY,2,joyGL.FLOAT,false,0,0);joyGL.enableVertexAttribArray(joySkyLocation.aXY);
 joyGL.uniform1f(joySkyLocation.uTime,t);joyGL.uniform1f(joySkyLocation.uAspect,w/h);joyGL.drawArrays(joyGL.TRIANGLES,0,3);
 joyGL.enable(joyGL.DEPTH_TEST);joyGL.useProgram(joyProgram);joyGL.uniform2f(joyLocation.uViewport,w/h,1);joyGL.uniform1f(joyLocation.uTime,t);
 function draw(b,kind){joyGL.bindBuffer(joyGL.ARRAY_BUFFER,b.buffer);joyGL.vertexAttribPointer(joyLocation.aPosition,3,joyGL.FLOAT,false,24,0);joyGL.enableVertexAttribArray(joyLocation.aPosition);joyGL.vertexAttribPointer(joyLocation.aNormal,3,joyGL.FLOAT,false,24,12);joyGL.enableVertexAttribArray(joyLocation.aNormal);joyGL.uniform1f(joyLocation.uKind,kind);joyGL.drawArrays(joyGL.TRIANGLES,0,b.count);}
 draw(joyOcean,0);draw(joyMesh,1);
}

/* WORLD 02 — GENEROSITY → LOVE / THE LIVING CONSTELLATION.
 * One independently modeled landscape: valley terrain, branching luminous channels,
 * suspended root-bridges, polar-evening aurora and downstream traveling energy.
 * This world has its own geography and spatial cues, not a Joy recolor. */
let loveGL=null,loveTerrainProgram=null,loveSkyProgram=null,loveMesh=null,loveRivers=[],loveRoots=[],loveSkyBuffer=null,loveLocations={},loveSkyLocations={};
const loveCanvas=document.querySelector('#love-world-canvas');
const loveVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vWorld,vNormal;varying float vDepth,vArc;
void main(){
 vec3 p=aPosition;
 if(uKind>1.5 && uKind<2.5) p.y+=.021*sin(p.z*.63+uTime*.44+p.x*.47);
 vec3 eye=p-vec3(0.,2.65,-8.5);
 float depth=max(.6,eye.z);
 gl_Position=vec4(eye.x*2.10/uViewport.x,(eye.y+eye.z*.037)*2.10,eye.z*.997-.27,depth);
 vWorld=p;vNormal=aNormal;vDepth=depth;vArc=p.z;
}`;
const loveFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vWorld,vNormal;varying float vDepth,vArc;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec3 n=normalize(vNormal);vec3 key=normalize(vec3(-.48,.72,-.52));
 float diffuse=max(0.,dot(n,key));float farFade=clamp((vDepth-12.)/59.,0.,1.);
 vec3 c;
 if(uKind<1.5){
  float grain=noise(vWorld.xz*.32)*.18+noise(vWorld.xz*1.34)*.055;
  float layers=.86+.08*sin(vWorld.y*3.3+noise(vWorld.xz*.42));
  vec3 rock=mix(vec3(.092,.058,.145),vec3(.37,.16,.34),clamp(vWorld.y/7.,0.,1.));
  c=rock*(.36+.78*diffuse+grain)*layers;
  c=mix(c,vec3(.60,.31,.48),pow(max(0.,dot(n,normalize(vec3(.45,.87,-.42)))),9.)*.23);
  float ridgeGlint=pow(1.-max(0.,dot(n,vec3(0.,1.,0.))),2.);
  c+=vec3(.21,.08,.20)*ridgeGlint*.18;
 }else if(uKind<2.5){
  // River branch pulses travel through real 3D ribbons, never an all-over flash.
  float travel=pow(.5+.5*sin(vArc*.31-uTime*.85+vWorld.x*.14),7.);
  float micro=pow(.5+.5*sin(vArc*1.4-uTime*1.15),11.);
  c=mix(vec3(.21,.038,.18),vec3(.95,.36,.53),clamp(.48+travel*.35+micro*.16,0.,1.));
  c+=vec3(.54,.20,.45)*(travel*.50+micro*.31);
 }else{
  float travel=pow(.5+.5*sin(vArc*.22-uTime*.65),8.);
  c=vec3(.78,.28,.53)+vec3(.31,.38,.44)*travel;
 }
 float fog=clamp((vDepth-17.)/67.,0.,.80);
 c=mix(c,vec3(.23,.12,.35),fog*(uKind<1.5?.78:.35));
 c=max(c,vec3(.003));gl_FragColor=vec4(pow(c,vec3(.88)),1.);
}`;
const loveSkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const loveSkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 p=vUv;float y=p.y;
 vec3 sky=mix(vec3(.38,.11,.32),vec3(.022,.024,.13),smoothstep(.22,.94,y));
 sky+=vec3(.33,.11,.20)*exp(-pow((y-.39)/.15,2.));
 vec2 sun=(p-vec2(.77,.57))*vec2(uAspect,1.);
 float sunrad=length(sun);
 sky+=vec3(1.,.33,.44)*(.23*exp(-sunrad*4.)+.33*exp(-sunrad*13.));
 // Three slowly evolving curtains, curved instead of horizontal painted bands.
 vec2 uv=vec2((p.x-.5)*uAspect,p.y);
 float warp=n(vec2(uv.x*2.6+uTime*.006,uv.y*3.8))-.5;
 float curtain=0.;
 for(int i=0;i<3;i++){
  float k=float(i);
  float fold=.54+.095*k+.075*sin(uv.x*(2.8+k*.6)+k*2.2+uTime*.011)+warp*.09;
  float width=.033+.016*k;
  curtain+=exp(-pow((uv.y-fold)/width,2.))*(.31-.055*k);
 }
 vec3 aurora=mix(vec3(.27,.31,.62),vec3(.69,.18,.57),clamp(uv.x*.7+.54,0.,1.));
 sky+=aurora*curtain*smoothstep(.28,.58,y);
 float stars=step(.994,h(floor(p*vec2(uAspect*520.,600.))))*smoothstep(.52,.77,y);
 sky+=vec3(.45,.49,.75)*stars*.27;
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.88)),1.);
}`;
function loveCompile(type,src){const sh=loveGL.createShader(type);loveGL.shaderSource(sh,src);loveGL.compileShader(sh);if(!loveGL.getShaderParameter(sh,loveGL.COMPILE_STATUS))throw Error('Love shader: '+loveGL.getShaderInfoLog(sh));return sh;}
function loveLink(vs,fs){const a=loveCompile(loveGL.VERTEX_SHADER,vs),b=loveCompile(loveGL.FRAGMENT_SHADER,fs),pr=loveGL.createProgram();loveGL.attachShader(pr,a);loveGL.attachShader(pr,b);loveGL.linkProgram(pr);loveGL.deleteShader(a);loveGL.deleteShader(b);if(!loveGL.getProgramParameter(pr,loveGL.LINK_STATUS))throw Error('Love program: '+loveGL.getProgramInfoLog(pr));return pr;}
function loveHeight(x,z){
 const winding=.93*Math.sin(z*.17)+.48*Math.sin(z*.38+.8);
 const d=Math.abs(x-winding);
 const walls=3.6*Math.pow(Math.max(0.,d-2.4)/16.,1.26);
 const ribs=.55*Math.sin(x*.30+z*.23)*Math.sin(z*.17-x*.13)+.21*Math.cos(z*.51+x*.48);
 return -.85+walls+ribs*(.27+Math.min(1,d/12));
}
function lovePushTri(out,a,b,c){const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ac=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let nn=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];let len=Math.hypot(...nn)||1;nn=nn.map(v=>v/len);if(nn[1]<0)nn=nn.map(v=>-v);for(const p of [a,b,c])out.push(...p,...nn);}
function loveTerrain(){
 const out=[],nx=88,nz=118;
 for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){
  const x0=-28+ix*56/nx,x1=-28+(ix+1)*56/nx;
  const z0=-1+iz*78/nz,z1=-1+(iz+1)*78/nz;
  const a=[x0,loveHeight(x0,z0),z0],b=[x1,loveHeight(x1,z0),z0],c=[x0,loveHeight(x0,z1),z1],d=[x1,loveHeight(x1,z1),z1];
  lovePushTri(out,a,b,c);lovePushTri(out,b,d,c);
 }
 return new Float32Array(out);
}
function loveBranchPoint(branch,t){
 let z,x;
 if(branch===0){z=1+73*t;x=.93*Math.sin(z*.17)+.48*Math.sin(z*.38+.8);}
 else{
  const start=branch===1?12:branch===2?28:branch===3?48:branch===4?19:branch===5?38:56;
  const side=(branch%2)?1:-1;
  z=start+t*(branch===6?25:18);
  const root=.93*Math.sin(z*.17)+.48*Math.sin(z*.38+.8);
  x=root+side*(.35+13.0*t*t)+Math.sin(t*Math.PI)*side*(1.2+branch*.22);
 }
 return [x,loveHeight(x,z)+.42,z];
}
function loveRibbon(branch,width){
 const out=[],steps=branch===0?176:64;
 for(let i=0;i<steps;i++){
  let p=loveBranchPoint(branch,i/steps),q=loveBranchPoint(branch,(i+1)/steps);
  let tangent=[q[0]-p[0],q[2]-p[2]],len=Math.hypot(...tangent)||1;
  let nx=tangent[1]/len,nz=-tangent[0]/len;
  const w0=width*(branch===0?1:.4+.6*Math.sin(Math.PI*(i/steps)));
  const w1=width*(branch===0?1:.4+.6*Math.sin(Math.PI*((i+1)/steps)));
  const a=[p[0]+nx*w0,p[1],p[2]+nz*w0],b=[p[0]-nx*w0,p[1],p[2]-nz*w0],c=[q[0]+nx*w1,q[1],q[2]+nz*w1],d=[q[0]-nx*w1,q[1],q[2]-nz*w1];
  lovePushTri(out,a,b,c);lovePushTri(out,b,d,c);
 }
 return new Float32Array(out);
}
function loveRootBridge(cx,cz,span,lift){
 // Raised ridgelines introduce a physical foreground/midground silhouette.
 const out=[],steps=48;
 for(let i=0;i<steps;i++){
  const t=i/steps,q=(i+1)/steps;
  function p(v,side){const x=cx+(v-.5)*span;const z=cz+1.8*Math.sin(v*Math.PI);const y=loveHeight(x,z)+lift*Math.sin(v*Math.PI)+.17;return[x,y,z+side*.15];}
  lovePushTri(out,p(t,-1),p(t,1),p(q,-1));lovePushTri(out,p(t,1),p(q,1),p(q,-1));
 }
 return new Float32Array(out);
}
function setupLoveWorld(){
 if(loveGL)return;
 loveGL=loveCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!loveGL)throw Error('Generosity world WebGL unavailable');
 loveTerrainProgram=loveLink(loveVertex,loveFragment);loveSkyProgram=loveLink(loveSkyVertex,loveSkyFragment);
 for(const key of ['aPosition','aNormal'])loveLocations[key]=loveGL.getAttribLocation(loveTerrainProgram,key);
 for(const key of ['uViewport','uTime','uKind'])loveLocations[key]=loveGL.getUniformLocation(loveTerrainProgram,key);
 loveSkyLocations.aXY=loveGL.getAttribLocation(loveSkyProgram,'aXY');
 for(const key of ['uAspect','uTime'])loveSkyLocations[key]=loveGL.getUniformLocation(loveSkyProgram,key);
 const buf=data=>{const b=loveGL.createBuffer();loveGL.bindBuffer(loveGL.ARRAY_BUFFER,b);loveGL.bufferData(loveGL.ARRAY_BUFFER,data,loveGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 loveMesh=buf(loveTerrain());loveRivers=Array.from({length:7},(_,i)=>buf(loveRibbon(i,i===0?.87:.42)));
 loveRoots=[buf(loveRootBridge(-5.,14.,9.,2.9)),buf(loveRootBridge(6.,31.,12.,4.5)),buf(loveRootBridge(-7.,52.,16.,6.))];
 loveSkyBuffer=loveGL.createBuffer();loveGL.bindBuffer(loveGL.ARRAY_BUFFER,loveSkyBuffer);loveGL.bufferData(loveGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),loveGL.STATIC_DRAW);
 loveGL.enable(loveGL.DEPTH_TEST);loveGL.clearColor(.04,.02,.11,1.);
}
function drawLoveWorld(t){
 if(!loveGL)return;const box=loveCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3);
 const w=Math.max(1,Math.round(box.width*dpr)),h=Math.max(1,Math.round(box.height*dpr));
 if(loveCanvas.width!==w||loveCanvas.height!==h){loveCanvas.width=w;loveCanvas.height=h;}
 loveGL.viewport(0,0,w,h);loveGL.clear(loveGL.COLOR_BUFFER_BIT|loveGL.DEPTH_BUFFER_BIT);
 loveGL.disable(loveGL.DEPTH_TEST);loveGL.useProgram(loveSkyProgram);loveGL.bindBuffer(loveGL.ARRAY_BUFFER,loveSkyBuffer);
 loveGL.vertexAttribPointer(loveSkyLocations.aXY,2,loveGL.FLOAT,false,0,0);loveGL.enableVertexAttribArray(loveSkyLocations.aXY);
 loveGL.uniform1f(loveSkyLocations.uTime,t);loveGL.uniform1f(loveSkyLocations.uAspect,w/h);loveGL.drawArrays(loveGL.TRIANGLES,0,3);
 loveGL.enable(loveGL.DEPTH_TEST);loveGL.useProgram(loveTerrainProgram);
 loveGL.uniform2f(loveLocations.uViewport,w/h,1);loveGL.uniform1f(loveLocations.uTime,t);
 function draw(data,kind){loveGL.bindBuffer(loveGL.ARRAY_BUFFER,data.buffer);loveGL.vertexAttribPointer(loveLocations.aPosition,3,loveGL.FLOAT,false,24,0);loveGL.enableVertexAttribArray(loveLocations.aPosition);loveGL.vertexAttribPointer(loveLocations.aNormal,3,loveGL.FLOAT,false,24,12);loveGL.enableVertexAttribArray(loveLocations.aNormal);loveGL.uniform1f(loveLocations.uKind,kind);loveGL.drawArrays(loveGL.TRIANGLES,0,data.count);}
 draw(loveMesh,0);loveRivers.forEach(b=>draw(b,2));loveRoots.forEach(b=>draw(b,3));
}

/* WORLD 03 — DEPENDABILITY → STABILITY / The Great Basalt Terraces.
 * Independent source-modeled escarpments, a six-sided column field, one natural
 * arch landmark and slowly drifting valley fog. Rock geometry does not move. */
let stabilityGL=null,stabilityTerrainProgram=null,stabilitySkyProgram=null,stabilityMesh=null,stabilityArch=null,stabilityColumns=null,stabilitySkyBuffer=null,stabilityLoc={},stabilitySkyLoc={};
const stabilityCanvas=document.querySelector('#stability-world-canvas');
const stabilityVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vWorld,vNormal;varying float vDepth;
void main(){vec3 p=aPosition;vec3 eye=p-vec3(0.,2.8,-8.5);float depth=max(.6,eye.z);
 gl_Position=vec4(eye.x*2.20/uViewport.x,(eye.y+eye.z*.040)*2.20,eye.z*.997-.27,depth);
 vWorld=p;vNormal=aNormal;vDepth=depth;}`;
const stabilityFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vWorld,vNormal;varying float vDepth;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
void main(){
 vec3 norm=normalize(vNormal);vec3 key=normalize(vec3(-.7,.71,-.31));
 float diff=max(.0,dot(norm,key));float ambient=.36+diff*.91;
 float strata=.82+.12*sin(vWorld.y*8.1+n(vWorld.xz*.17)*1.8);
 float grain=n(vWorld.xz*.61+vWorld.y*.24)*.11+n(vWorld.xy*2.1)*.038;
 vec3 c;
 if(uKind<.5){
   vec3 shale=vec3(.19,.29,.39),face=vec3(.51,.65,.74);
   float upper=clamp((vWorld.y-.4)/8.,0.,1.);
   c=mix(shale,face,.38+upper*.36)*strata;
   float ledge=pow(max(0.,norm.y),3.);
   c+=vec3(.13,.18,.21)*ledge;
 }else if(uKind<1.5){
   c=mix(vec3(.22,.32,.43),vec3(.43,.57,.67),clamp(vWorld.y/12.,0.,1.));
   c*=.89+.09*sin(vWorld.y*12.);
 }else{
   float dark=h(floor(vWorld.xz*1.1));c=mix(vec3(.12,.21,.29),vec3(.32,.44,.52),dark*.5+.25);
 }
 c=(c+grain)*ambient;
 float ridge=pow(max(0.,dot(reflect(-key,norm),vec3(0.,.1,-1.))),16.);
 c+=vec3(.14,.22,.29)*ridge*.14;
 float fog=clamp((vDepth-28.)/100.,0.,.69);
 // A quiet long-timescale valley fog is the only animated landscape process.
 float drift=n(vec2(vWorld.x*.13+uTime*.003,vWorld.z*.04))*.09;
 fog=clamp(fog+drift*.47,0.,.76);
 c=mix(c,vec3(.35,.47,.59),fog);
 gl_FragColor=vec4(pow(max(c,vec3(.002)),vec3(.88)),1.);
}`;
const stabilitySkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const stabilitySkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=vUv;float y=uv.y;
 vec3 sky=mix(vec3(.43,.56,.65),vec3(.045,.095,.17),smoothstep(.16,.98,y));
 float sun=length((uv-vec2(.23,.62))*vec2(uAspect,1.));
 sky+=vec3(.51,.62,.72)*(.13*exp(-sun*3.5)+.37*exp(-sun*17.));
 float fogline=.31+.035*sin(uv.x*4.6+uTime*.014)+.025*noise(uv*vec2(5.,7.));
 float fog=exp(-pow((y-fogline)/.08,2.))*.23;
 sky+=vec3(.65,.75,.77)*fog;
 float clouds=noise(vec2(uv.x*6.3+uTime*.007,uv.y*4.1));
 sky+=vec3(.21,.27,.36)*smoothstep(.55,.77,clouds)*.18*smoothstep(.31,.75,y);
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.9)),1.);
}`;
function stabilityCompile(type,source){const shader=stabilityGL.createShader(type);stabilityGL.shaderSource(shader,source);stabilityGL.compileShader(shader);if(!stabilityGL.getShaderParameter(shader,stabilityGL.COMPILE_STATUS))throw Error('Stability shader: '+stabilityGL.getShaderInfoLog(shader));return shader;}
function stabilityLink(vs,fs){const pr=stabilityGL.createProgram(),a=stabilityCompile(stabilityGL.VERTEX_SHADER,vs),b=stabilityCompile(stabilityGL.FRAGMENT_SHADER,fs);stabilityGL.attachShader(pr,a);stabilityGL.attachShader(pr,b);stabilityGL.linkProgram(pr);stabilityGL.deleteShader(a);stabilityGL.deleteShader(b);if(!stabilityGL.getProgramParameter(pr,stabilityGL.LINK_STATUS))throw Error('Stability program: '+stabilityGL.getProgramInfoLog(pr));return pr;}
function stabilityTri(out,a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let N=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];let l=Math.hypot(...N)||1;N=N.map(x=>x/l);if(N[1]<0)N=N.map(x=>-x);for(const point of [a,b,c])out.push(...point,...N);}
function stabilityQuad(out,a,b,c,d){stabilityTri(out,a,b,c);stabilityTri(out,b,d,c);}
function stabilityHeight(x,z){
 const meander=.9*Math.sin(z*.16)+1.4*Math.sin(z*.06);
 const lateral=Math.abs(x-meander);const rough=.33*Math.sin(x*.31+z*.15)*Math.sin(z*.18)+.19*Math.sin(x*.72-z*.28);
 const foothill=Math.max(0,lateral-3.6)*.24+Math.max(0,lateral-14)*.27;
 const elevated=foothill+rough+.13*Math.sin(z*.14);
 // Coherent stair-step landform, with small erosion ramps instead of striped paint.
 const terraced=Math.floor(Math.max(0,elevated)/.86)*.86 + (Math.max(0,elevated)%.86)*.19;
 return -.5+terraced;
}
function stabilityTerrain(){const out=[],nx=80,nz=118;for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
 const x0=-30+x*60/nx,x1=-30+(x+1)*60/nx,z0=-1+z*80/nz,z1=-1+(z+1)*80/nz;
 const a=[x0,stabilityHeight(x0,z0),z0],b=[x1,stabilityHeight(x1,z0),z0],c=[x0,stabilityHeight(x0,z1),z1],d=[x1,stabilityHeight(x1,z1),z1];stabilityQuad(out,a,b,c,d);
 }return new Float32Array(out);}
function stabilityColumnsMesh(){
 const out=[];const positions=[[-12,7,4.5],[-17,12,5.1],[13,12,5.4],[17,18,7.0],[-21,23,7.8],[20,30,7.0],[-11,31,5.0],[12,42,6.8],[-19,50,10.3],[18,54,9.0],[-8,65,6.8],[23,69,9.2]];
 for(let index=0;index<positions.length;index++){
  const [cx,cz,height]=positions[index],radius=1.0+(index%3)*.43,base=stabilityHeight(cx,cz);
  for(let side=0;side<6;side++){const a=side*Math.PI/3,b=(side+1)*Math.PI/3;
   const p0=[cx+radius*Math.cos(a),base,cz+radius*Math.sin(a)],p1=[cx+radius*Math.cos(b),base,cz+radius*Math.sin(b)];
   const p2=[p0[0],base+height,p0[2]],p3=[p1[0],base+height,p1[2]];
   stabilityQuad(out,p0,p1,p2,p3);
   stabilityTri(out,[cx,base+height,cz],p2,p3);
  }
 }
 return new Float32Array(out);
}
function stabilityArchMesh(){
 const out=[],steps=46,cx=2,cz=35;
 function surface(theta,r,z){const x=cx+5.4*r*Math.cos(theta);const y=2.8+5.0*r*Math.sin(theta);return[x,y,z];}
 for(let i=0;i<steps;i++){
  const t=Math.PI*i/steps,q=Math.PI*(i+1)/steps;
  // Outer rock is thick; open void is a true geometric hole, not a painted arch.
  const a=surface(t,1,cz-.78),b=surface(t,.70,cz-.78),c=surface(q,1,cz-.78),d=surface(q,.70,cz-.78);
  stabilityQuad(out,a,b,c,d);
  const e=surface(t,1,cz+.78),f=surface(t,.70,cz+.78),g=surface(q,1,cz+.78),h=surface(q,.70,cz+.78);
  stabilityQuad(out,e,f,g,h);stabilityQuad(out,a,e,c,g);stabilityQuad(out,b,f,d,h);
 }
 // Root bases stabilize each end of the open arch, with real geological geometry.
 for(const dir of [-1,1]){
  const xx=cx+dir*5.1,z=cz,ground=stabilityHeight(xx,z),base=2.8;
  const a=[xx-dir*.85,ground,z-1.1],b=[xx+dir*.82,ground,z-1.1],c=[xx-dir*.65,base,z-1.0],d=[xx+dir*.65,base,z-1.0];
  stabilityQuad(out,a,b,c,d);
 }
 return new Float32Array(out);
}
function setupStabilityWorld(){if(stabilityGL)return;
 stabilityGL=stabilityCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!stabilityGL)throw Error('Dependability world WebGL unavailable');
 stabilityTerrainProgram=stabilityLink(stabilityVertex,stabilityFragment);stabilitySkyProgram=stabilityLink(stabilitySkyVertex,stabilitySkyFragment);
 for(const name of ['aPosition','aNormal'])stabilityLoc[name]=stabilityGL.getAttribLocation(stabilityTerrainProgram,name);
 for(const name of ['uViewport','uTime','uKind'])stabilityLoc[name]=stabilityGL.getUniformLocation(stabilityTerrainProgram,name);
 stabilitySkyLoc.aXY=stabilityGL.getAttribLocation(stabilitySkyProgram,'aXY');for(const name of ['uAspect','uTime'])stabilitySkyLoc[name]=stabilityGL.getUniformLocation(stabilitySkyProgram,name);
 const upload=data=>{const b=stabilityGL.createBuffer();stabilityGL.bindBuffer(stabilityGL.ARRAY_BUFFER,b);stabilityGL.bufferData(stabilityGL.ARRAY_BUFFER,data,stabilityGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 stabilityMesh=upload(stabilityTerrain());stabilityArch=upload(stabilityArchMesh());stabilityColumns=upload(stabilityColumnsMesh());
 stabilitySkyBuffer=stabilityGL.createBuffer();stabilityGL.bindBuffer(stabilityGL.ARRAY_BUFFER,stabilitySkyBuffer);stabilityGL.bufferData(stabilityGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),stabilityGL.STATIC_DRAW);
 stabilityGL.enable(stabilityGL.DEPTH_TEST);stabilityGL.clearColor(.09,.14,.20,1.);
}
function drawStabilityWorld(t){if(!stabilityGL)return;
 const rect=stabilityCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
 if(stabilityCanvas.width!==w||stabilityCanvas.height!==h){stabilityCanvas.width=w;stabilityCanvas.height=h;}
 stabilityGL.viewport(0,0,w,h);stabilityGL.clear(stabilityGL.COLOR_BUFFER_BIT|stabilityGL.DEPTH_BUFFER_BIT);
 stabilityGL.disable(stabilityGL.DEPTH_TEST);stabilityGL.useProgram(stabilitySkyProgram);stabilityGL.bindBuffer(stabilityGL.ARRAY_BUFFER,stabilitySkyBuffer);
 stabilityGL.vertexAttribPointer(stabilitySkyLoc.aXY,2,stabilityGL.FLOAT,false,0,0);stabilityGL.enableVertexAttribArray(stabilitySkyLoc.aXY);stabilityGL.uniform1f(stabilitySkyLoc.uTime,t);stabilityGL.uniform1f(stabilitySkyLoc.uAspect,w/h);stabilityGL.drawArrays(stabilityGL.TRIANGLES,0,3);
 stabilityGL.enable(stabilityGL.DEPTH_TEST);stabilityGL.useProgram(stabilityTerrainProgram);stabilityGL.uniform2f(stabilityLoc.uViewport,w/h,1);stabilityGL.uniform1f(stabilityLoc.uTime,t);
 const drawMesh=(mesh,kind)=>{stabilityGL.bindBuffer(stabilityGL.ARRAY_BUFFER,mesh.buffer);stabilityGL.vertexAttribPointer(stabilityLoc.aPosition,3,stabilityGL.FLOAT,false,24,0);stabilityGL.enableVertexAttribArray(stabilityLoc.aPosition);stabilityGL.vertexAttribPointer(stabilityLoc.aNormal,3,stabilityGL.FLOAT,false,24,12);stabilityGL.enableVertexAttribArray(stabilityLoc.aNormal);stabilityGL.uniform1f(stabilityLoc.uKind,kind);stabilityGL.drawArrays(stabilityGL.TRIANGLES,0,mesh.count);};
 drawMesh(stabilityMesh,0);drawMesh(stabilityArch,1);drawMesh(stabilityColumns,2);
}

/* WORLD 04 — ACCOUNTABILITY → CHARACTER / The Ember Canyons.
 * Intersecting, asymmetric geological corridors, exposed strata and rare vents.
 * Deliberately dissimilar from island/ocean, network valley and basalt terraces. */
let emberGL=null,emberProgram=null,emberSkyProgram=null,emberGround=null,emberSpurs=null,emberFaults=null,emberSkyBuffer=null,emberLoc={},emberSkyLoc={};
const emberCanvas=document.querySelector('#ember-world-canvas');
const emberVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vPos,vNorm;varying float vFog;
void main(){vec3 p=aPosition;vec3 eye=p-vec3(0.,4.6,-8.8);float depth=max(.6,eye.z);
 gl_Position=vec4(eye.x*2.13/uViewport.x,(eye.y+eye.z*.036)*2.13,eye.z*.997-.31,depth);
 vPos=p;vNorm=aNormal;vFog=depth;
}`;
const emberFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vPos,vNorm;varying float vFog;
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hs(i),hs(i+vec2(1.,0.)),f.x),mix(hs(i+vec2(0.,1.)),hs(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec3 norm=normalize(vNorm);vec3 light=normalize(vec3(-.65,.71,-.48));
 float lambert=max(0.,dot(norm,light));float rockshade=.32+lambert*.85;
 float erosion=ns(vPos.xz*.38+vPos.y*.045)*.13+ns(vPos.xy*1.63)*.065;
 float planes=sin(vPos.y*5.8+ns(vPos.xz*.37)*1.4);
 vec3 tone;
 if(uKind<.5){
   tone=mix(vec3(.085,.045,.049),vec3(.40,.18,.12),.36+.26*planes+.20*ns(vPos.xz*.17));
   float top=pow(max(0.,norm.y),4.);tone+=vec3(.19,.105,.055)*top;
   float cliff=pow(1.-abs(norm.y),3.);tone=mix(tone,vec3(.24,.116,.088),cliff*.45);
 }else if(uKind<1.5){
   float stratum=sin(vPos.y*7.5+vPos.x*.09);tone=mix(vec3(.21,.085,.061),vec3(.46,.22,.12),stratum*.32+.43);
 }else{
   float ember=.50+.22*sin(vPos.z*.41-uTime*.39)+.12*ns(vPos.xz*.44);
   tone=mix(vec3(.48,.10,.025),vec3(1.0,.53,.17),clamp(ember,0.,1.));
   rockshade=1.;
 }
 tone=(tone+erosion*.24)*rockshade;
 float rim=pow(max(0.,dot(reflect(-light,norm),vec3(0.,.08,-1.))),16.);
 tone+=vec3(.16,.07,.04)*rim*.12;
 float dust=ns(vec2(vPos.z*.075+uTime*.0016,vPos.y*.34+uTime*.003))*.11;
 float fog=clamp((vFog-24.)/115.+dust,0.,.72);
 tone=mix(tone,vec3(.35,.175,.14),fog);
 if(uKind>1.5){tone+=vec3(.42,.13,.018)*(.8+ns(vPos.xz*.8))*.44;}
 gl_FragColor=vec4(pow(max(tone,vec3(.001)),vec3(.87)),1.);
}`;
const emberSkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const emberSkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=vUv;
 vec3 sky=mix(vec3(.36,.16,.135),vec3(.022,.026,.045),smoothstep(.04,1.,uv.y));
 float sun=length((uv-vec2(.18,.38))*vec2(uAspect,1.));
 sky+=vec3(.63,.23,.07)*(.15*exp(-sun*4.)+.55*exp(-sun*21.));
 float wind=noise(vec2(uv.x*7.1-uTime*.006,uv.y*11.));
 float streak=smoothstep(.49,.80,wind)*exp(-pow((uv.y-.30)/.18,2.));
 sky+=vec3(.28,.16,.12)*streak*.31;
 sky+=vec3(.18,.09,.06)*.12*noise(vec2(uv.x*21.-uTime*.016,uv.y*25.));
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.92)),1.);
}`;
function emberCompile(type,src){let sh=emberGL.createShader(type);emberGL.shaderSource(sh,src);emberGL.compileShader(sh);if(!emberGL.getShaderParameter(sh,emberGL.COMPILE_STATUS))throw Error('Ember shader: '+emberGL.getShaderInfoLog(sh));return sh;}
function emberLink(v,f){let p=emberGL.createProgram(),a=emberCompile(emberGL.VERTEX_SHADER,v),b=emberCompile(emberGL.FRAGMENT_SHADER,f);emberGL.attachShader(p,a);emberGL.attachShader(p,b);emberGL.linkProgram(p);emberGL.deleteShader(a);emberGL.deleteShader(b);if(!emberGL.getProgramParameter(p,emberGL.LINK_STATUS))throw Error('Ember program: '+emberGL.getProgramInfoLog(p));return p;}
function emberTriangle(o,a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
 let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const len=Math.hypot(...n)||1;n=n.map(x=>x/len);if(n[1]<0)n=n.map(x=>-x);for(const p of [a,b,c])o.push(...p,...n);}
function emberQuad(o,a,b,c,d){emberTriangle(o,a,b,c);emberTriangle(o,b,d,c);}
function emberTrack(z){return 2.15*Math.sin(z*.14)+1.3*Math.sin(z*.042+.7);}
function emberHeight(x,z){
 const track=emberTrack(z),d=Math.abs(x-track);
 const fan=Math.exp(-Math.pow((z-42)/17,2))*Math.abs(x-(-15+(z-38)*.59));
 const branch=z>26&&z<75?Math.max(0,1.-Math.abs(fan)/3.6)*3.0:0;
 const body=Math.max(0,d-3.1);
 const wall=7.9*(1.-Math.exp(-Math.pow(body/6.9,1.72)));
 const uneven=.53*Math.sin(x*.31+z*.12)*Math.sin(z*.17)+.27*Math.sin(x*.74-z*.22);
 const mesa=.83*Math.max(0,d-19)*.07;
 return -.86+wall+mesa+uneven*(.15+.85*Math.min(1,body/7))-branch;
}
function emberTerrain(){const out=[],nx=100,nz=124;for(let zi=0;zi<nz;zi++)for(let xi=0;xi<nx;xi++){
 const x0=-37+xi*74/nx,x1=-37+(xi+1)*74/nx,z0=-1+zi*92/nz,z1=-1+(zi+1)*92/nz;
 const a=[x0,emberHeight(x0,z0),z0],b=[x1,emberHeight(x1,z0),z0],c=[x0,emberHeight(x0,z1),z1],d=[x1,emberHeight(x1,z1),z1];emberQuad(out,a,b,c,d);
 }return new Float32Array(out);}
function emberSpurMesh(){const out=[];
 const buttes=[[-17,13,7,4.4],[20,21,9,5.1],[-24,32,8,4.5],[19,45,7,3.4],[-20,59,10,6.7],[26,67,11,5.4],[-9,79,7,3.2],[12,84,8,3.9]];
 for(let i=0;i<buttes.length;i++){
   let [cx,cz,high,rad]=buttes[i],levels=7;
   for(let layer=0;layer<levels;layer++){
    let y0=emberHeight(cx,cz)+high*layer/levels,y1=emberHeight(cx,cz)+high*(layer+1)/levels;
    let r0=rad*(1.-.45*layer/levels),r1=rad*(1.-.45*(layer+1)/levels);
    for(let side=0;side<7;side++){
       const t=Math.PI*2*side/7,q=Math.PI*2*(side+1)/7;
       const wobble=1.+.14*Math.sin(i*2.8+side*1.7+layer*.62);
       const a=[cx+r0*wobble*Math.cos(t),y0,cz+r0*wobble*Math.sin(t)],b=[cx+r0*Math.cos(q),y0,cz+r0*Math.sin(q)];
       const c=[cx+r1*wobble*Math.cos(t),y1,cz+r1*wobble*Math.sin(t)],d=[cx+r1*Math.cos(q),y1,cz+r1*Math.sin(q)];emberQuad(out,a,b,c,d);
    }
   }
 }return new Float32Array(out);}
function emberFaultMesh(){const out=[],length=87,segments=185;
 for(let i=0;i<segments;i++){
  const z0=1+i*length/segments,z1=1+(i+1)*length/segments;
  const a=emberTrack(z0),b=emberTrack(z1),w0=.22+.08*Math.sin(z0*.36),w1=.22+.08*Math.sin(z1*.36);
  emberQuad(out,[a-w0,emberHeight(a,z0)+.07,z0],[a+w0,emberHeight(a,z0)+.07,z0],[b-w1,emberHeight(b,z1)+.07,z1],[b+w1,emberHeight(b,z1)+.07,z1]);
 }
 return new Float32Array(out);}
function setupEmberWorld(){if(emberGL)return;
 emberGL=emberCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!emberGL)throw Error('Character world WebGL unavailable');
 emberProgram=emberLink(emberVertex,emberFragment);emberSkyProgram=emberLink(emberSkyVertex,emberSkyFragment);
 for(const n of ['aPosition','aNormal'])emberLoc[n]=emberGL.getAttribLocation(emberProgram,n);
 for(const n of ['uViewport','uTime','uKind'])emberLoc[n]=emberGL.getUniformLocation(emberProgram,n);
 emberSkyLoc.aXY=emberGL.getAttribLocation(emberSkyProgram,'aXY');for(const n of ['uAspect','uTime'])emberSkyLoc[n]=emberGL.getUniformLocation(emberSkyProgram,n);
 const upload=a=>{const b=emberGL.createBuffer();emberGL.bindBuffer(emberGL.ARRAY_BUFFER,b);emberGL.bufferData(emberGL.ARRAY_BUFFER,a,emberGL.STATIC_DRAW);return{buffer:b,count:a.length/6};};
 emberGround=upload(emberTerrain());emberSpurs=upload(emberSpurMesh());emberFaults=upload(emberFaultMesh());
 emberSkyBuffer=emberGL.createBuffer();emberGL.bindBuffer(emberGL.ARRAY_BUFFER,emberSkyBuffer);emberGL.bufferData(emberGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),emberGL.STATIC_DRAW);
 emberGL.enable(emberGL.DEPTH_TEST);emberGL.clearColor(.1,.045,.04,1);
}
function drawEmberWorld(t){if(!emberGL)return;
 const rect=emberCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(rect.height*dpr));
 if(emberCanvas.width!==w||emberCanvas.height!==h){emberCanvas.width=w;emberCanvas.height=h;}
 emberGL.viewport(0,0,w,h);emberGL.clear(emberGL.COLOR_BUFFER_BIT|emberGL.DEPTH_BUFFER_BIT);
 emberGL.disable(emberGL.DEPTH_TEST);emberGL.useProgram(emberSkyProgram);emberGL.bindBuffer(emberGL.ARRAY_BUFFER,emberSkyBuffer);
 emberGL.vertexAttribPointer(emberSkyLoc.aXY,2,emberGL.FLOAT,false,0,0);emberGL.enableVertexAttribArray(emberSkyLoc.aXY);emberGL.uniform1f(emberSkyLoc.uTime,t);emberGL.uniform1f(emberSkyLoc.uAspect,w/h);emberGL.drawArrays(emberGL.TRIANGLES,0,3);
 emberGL.enable(emberGL.DEPTH_TEST);emberGL.useProgram(emberProgram);emberGL.uniform2f(emberLoc.uViewport,w/h,1);emberGL.uniform1f(emberLoc.uTime,t);
 const drawMesh=(mesh,kind)=>{emberGL.bindBuffer(emberGL.ARRAY_BUFFER,mesh.buffer);emberGL.vertexAttribPointer(emberLoc.aPosition,3,emberGL.FLOAT,false,24,0);emberGL.enableVertexAttribArray(emberLoc.aPosition);emberGL.vertexAttribPointer(emberLoc.aNormal,3,emberGL.FLOAT,false,24,12);emberGL.enableVertexAttribArray(emberLoc.aNormal);emberGL.uniform1f(emberLoc.uKind,kind);emberGL.drawArrays(emberGL.TRIANGLES,0,mesh.count);};
 drawMesh(emberGround,0);drawMesh(emberSpurs,1);drawMesh(emberFaults,2);
}


/* WORLD 05 — FORGIVENESS → PEACE / The Quiet Ocean.
 * An actual coastal horizon, five independent islands, sandy shore, cloud banks
 * and waves; no enlarged texture sphere masquerades as a world encounter. */

/* The Peace arrival uses a licensed, high-detail photographic plate with actual
 * CSS parallax/atmospheric passage. This is 2.5D—not a claim that a still photo
 * is navigable photogrammetry. The original WEST-admitted WebGL coast remains
 * an honest offline fallback if the image fails. Unsplash photo by XT7 Core:
 * https://unsplash.com/photos/stunning-tropical-islands-and-calm-ocean-waters-eFf1cHTOG8o
 * License: https://unsplash.com/license (site can use the image; not resale).
 * All new DOM/CSS is local to #peace-encounter, not other eight worlds. */
const PEACE_CINEMA_IMAGE='https://images.unsplash.com/photo-1744069729070-f946b4fba608?auto=format&fit=crop&w=2400&q=86';
let peaceCinemaState='loading',peaceCinemaLayer=null,peaceCinemaPhoto=null,peaceCinemaLastX=0,peaceCinemaLastY=0;
const peaceCinemaPreload=new Image();
peaceCinemaPreload.decoding='async';
peaceCinemaPreload.fetchPriority='high';
peaceCinemaPreload.onload=()=>{
 if(peaceCinemaState==='error')return;
 peaceCinemaState='ready';
 // Display readiness belongs to the actual staged image, not just its preloader.
 if(peaceCinemaLayer&&peaceCinemaPhoto?.complete&&peaceCinemaPhoto.naturalWidth>0)
  peaceCinemaLayer.classList.add('peace-cinema-ready');
};
peaceCinemaPreload.onerror=()=>{
 // A separately staged photo may have loaded even if the preload request failed.
 if(peaceCinemaLayer&&peaceCinemaPhoto?.complete&&peaceCinemaPhoto.naturalWidth>0){
  peaceCinemaState='ready';peaceCinemaLayer.classList.add('peace-cinema-ready');return;
 }
 peaceCinemaState='error';
 if(peaceCinemaLayer){peaceCinemaLayer.remove();peaceCinemaLayer=null;}
 peaceCinemaPhoto=null;
 // The active class hides the fallback canvas. It MUST be cleared on failure.
 peaceOverlay.classList.remove('peace-cinema-active');
 // Preserve the real geometry/teaching fallback when off-network.
 setTimeout(()=>{if(!peaceGL&&peaceCanvas){try{setupPeaceGLFallback();}catch(error){console.error('Peace fallback:',error);}}},0);
};
peaceCinemaPreload.src=PEACE_CINEMA_IMAGE;
function ensurePeaceCinema(){
 if(peaceCinemaLayer||peaceCinemaState==='error')return;
 const style=document.createElement('style');
 style.textContent=`
 #peace-encounter .peace-cinema-stage{position:absolute;inset:0;overflow:hidden;z-index:1;pointer-events:none;
 background:#113f5d;isolation:isolate;opacity:1}
 #peace-encounter .peace-cinema-image{display:block;position:absolute;inset:-8%;width:116%;height:116%;
 object-fit:cover;object-position:50% 47%;max-width:none;max-height:none;
 transform-origin:50% 48%;transform:translate3d(calc(var(--peace-look-x,0px)*.35),calc(var(--peace-look-y,0px)*.35),0) scale(var(--peace-arrival-scale,1.22));
 transition:transform .18s linear,filter 1.2s ease;filter:saturate(1.1) contrast(1.025) blur(2px);opacity:0;}
 #peace-encounter .peace-cinema-ready .peace-cinema-image{opacity:1;filter:saturate(1.1) contrast(1.025) blur(0)}
 #peace-encounter .peace-cinema-light{position:absolute;inset:0;z-index:2;opacity:.84;mix-blend-mode:screen;
 background:radial-gradient(ellipse at 20% 22%,rgba(255,240,184,.18),transparent 45%),linear-gradient(125deg,rgba(14,88,132,.22),transparent 42%);}
 #peace-encounter .peace-cinema-vignette{position:absolute;inset:0;z-index:3;
 background:linear-gradient(180deg,rgba(4,19,32,.14),transparent 23%,transparent 50%,rgba(3,12,21,.62) 100%);}
 #peace-encounter .peace-cinema-veil{position:absolute;inset:-5%;z-index:4;
 background:radial-gradient(ellipse at 50% 54%,rgba(221,244,249,.9) 0%,rgba(198,232,243,.33) 46%,rgba(166,216,232,0) 80%);
 opacity:var(--peace-atmos-opacity,0);transform:scale(var(--peace-atmos-scale,1));}
 #peace-encounter .peace-cinema-motion{position:absolute;inset:0;z-index:3;pointer-events:none;
 background:repeating-linear-gradient(90deg,transparent 0 84px,rgba(233,254,248,.018) 86px,transparent 92px);
 opacity:.35;animation:peace-water-light 19s linear infinite;}
 @keyframes peace-water-light{from{transform:translateX(-2%)}to{transform:translateX(2%)}}
 #peace-encounter.peace-cinema-active #peace-world-canvas{opacity:0;pointer-events:none;}
 #peace-encounter .peace-world-hud{z-index:9;}
 #peace-encounter .peace-horizon-mark{z-index:9;}
 @media(prefers-reduced-motion:reduce){#peace-encounter .peace-cinema-image{transition:none;transform:scale(1.08)!important}
 #peace-encounter .peace-cinema-motion{animation:none}}
 `;
 peaceOverlay.appendChild(style);
 const layer=document.createElement('div');layer.className='peace-cinema-stage';layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<div class="peace-cinema-light"></div><div class="peace-cinema-motion"></div><div class="peace-cinema-vignette"></div><div class="peace-cinema-veil"></div>';
 const photo=document.createElement('img');photo.className='peace-cinema-image';photo.alt='';photo.decoding='async';
 photo.onload=()=>{
  if(photo.naturalWidth>0&&peaceCinemaState!=='error'){
   peaceCinemaState='ready';layer.classList.add('peace-cinema-ready');
  }
 };
 photo.onerror=()=>{if(peaceCinemaState!=='error')peaceCinemaPreload.onerror();};
 photo.src=PEACE_CINEMA_IMAGE;layer.prepend(photo);peaceCinemaPhoto=photo;
 peaceOverlay.insertBefore(layer,peaceCanvas);peaceCinemaLayer=layer;
 if(peaceCinemaState==='ready')layer.classList.add('peace-cinema-ready');
 peaceOverlay.classList.add('peace-cinema-active');
 peaceOverlay.addEventListener('pointermove',event=>{
  if(reduced||!peaceCinemaLayer)return;
  const rect=peaceOverlay.getBoundingClientRect();peaceCinemaLastX=((event.clientX-rect.left)/Math.max(1,rect.width)-.5)*26;
  peaceCinemaLastY=((event.clientY-rect.top)/Math.max(1,rect.height)-.5)*12;
 },{passive:true});
 peaceOverlay.addEventListener('pointerleave',()=>{peaceCinemaLastX=peaceCinemaLastY=0;},{passive:true});
}
function updatePeaceCinema(){
 if(!peaceCinemaLayer||peaceCinemaState==='error')return;
 const f=Math.max(0,Math.min(1,(flight-.55)/.45)),ease=f*f*(3.-2.*f);
 const entering=Math.max(0,1.-ease);
 const scale=1.32-.24*ease;
 const x=reduced?0:peaceCinemaLastX*ease,y=reduced?0:peaceCinemaLastY*ease;
 peaceCinemaLayer.style.setProperty('--peace-arrival-scale',scale.toFixed(4));
 peaceCinemaLayer.style.setProperty('--peace-look-x',x.toFixed(2)+'px');
 peaceCinemaLayer.style.setProperty('--peace-look-y',y.toFixed(2)+'px');
 peaceCinemaLayer.style.setProperty('--peace-atmos-opacity',(entering*entering*.86).toFixed(3));
 peaceCinemaLayer.style.setProperty('--peace-atmos-scale',(1.16-.16*ease).toFixed(3));
}

let peaceKernelFacade=null;
let peaceGL=null,peaceProgram=null,peaceSkyProgram=null,peaceOcean=null,peaceIslands=null,peaceShore=null,peaceRocks=null,peaceSkyBuffer=null,peaceLoc={},peaceSkyLoc={};
const peaceCanvas=document.querySelector('#peace-world-canvas'),peaceHud=document.querySelector('#peace-world-hud');
const peaceVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vPos,vNormal;varying float vFog;
void main(){
 vec3 p=aPosition;
 if(uKind<.5){p.y+=.095*sin(p.z*.47-uTime*.70+p.x*.21)+.060*sin(p.x*.85+uTime*.48+p.z*.13);}
 vec3 eye=p-vec3(0.,3.25,-8.0);float depth=max(.7,eye.z);
 gl_Position=vec4(eye.x*1.8/uViewport.x,(eye.y+eye.z*.025)*1.8,eye.z*.998-.32,depth);
 vPos=p;vNormal=aNormal;vFog=depth;
}`;
const peaceFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vPos,vNormal;varying float vFog;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float s=0.;s+=.54*noise2(p);s+=.27*noise2(p*2.17+13.);s+=.13*noise2(p*4.41+7.);return s/.94;}
float reefDistance(vec2 q){
 float d=100.;vec2 v;
 v=vec2((q.x+20.)/12.,(q.y-22.)/8.04); d=min(d,length(v)-1.);
 v=vec2((q.x+4.)/14.,(q.y-43.)/9.38); d=min(d,length(v)-1.);
 v=vec2((q.x-24.)/14.,(q.y-35.)/9.38); d=min(d,length(v)-1.);
 v=vec2((q.x+26.)/21.,(q.y-75.)/14.07); d=min(d,length(v)-1.);
 v=vec2((q.x-18.)/22.,(q.y-92.)/14.74); d=min(d,length(v)-1.);
 v=vec2((q.x-4.)/24.,(q.y-110.)/16.08); d=min(d,length(v)-1.);
 return d;
}
void main(){
 vec3 n=normalize(vNormal);vec3 sun=normalize(vec3(-.57,.8,-.36));
 float lit=max(0.,dot(n,sun));vec3 col;
 if(uKind<.5){
  // Bathymetry, pale coral shelves and a deep-blue open channel are world-coordinate bound.
  vec2 q=vPos.xz;
  float d=reefDistance(q);
  float irregular=fbm(q*.10)-.5;
  float shallow=1.-smoothstep(-.05,1.75,d+.19*irregular);
  float reef=fbm(q*.35+vec2(5.,11.));
  vec3 deep=vec3(.017,.23,.40);
  vec3 shelf=mix(vec3(.040,.45,.60),vec3(.085,.75,.68),shallow*.9);
  col=mix(deep,shelf,shallow);
  float patch=smoothstep(.49,.72,reef)*shallow;
  col=mix(col,vec3(.032,.24,.27),patch*.58);
  float sand=(1.-smoothstep(.03,.14,abs(d+.12*irregular)))*shallow;
  col+=vec3(.23,.22,.12)*sand*.45;
  float wave=.5+.5*sin(q.y*.54-uTime*.66+sin(q.x*.13+q.y*.09));
  float rip=noise2(q*.46+vec2(uTime*.031,-uTime*.043));
  col+=vec3(.065,.10,.11)*(wave*.15+rip*.18);
  float glint=pow(max(0.,.48*wave+.52*rip-.53),5.);
  col+=vec3(.72,.75,.60)*glint*.42;
  float foam=(1.-smoothstep(.025,.13,abs(d+.02*sin(q.x*.9+uTime*.2))))*.19;
  col+=vec3(.45,.58,.50)*foam;
 }else if(uKind<1.5){
  // Sand to wet-rock transition gives beaches clear boundaries around cliffs.
  float sediment=fbm(vPos.xz*.66);
  col=mix(vec3(.43,.46,.37),vec3(.88,.83,.62),.54+.46*sediment);
  col=mix(col,vec3(.14,.47,.47),smoothstep(.36,.72,sediment)*.20);
  col*=.72+.30*lit;
 }else if(uKind<2.5){
  // Triplanar, height-independent stone variation prevents vertical painted bands.
  float grainX=fbm(vPos.yz*.57+vec2(4.,11.));
  float grainY=fbm(vPos.xz*.53+vec2(9.,3.));
  float grainZ=fbm(vPos.xy*.61+vec2(2.,17.));
  float fine=noise2(vPos.xy*2.33+vPos.z*.61);
  vec3 stoneN=normalize(n+vec3(grainX-.5,grainY-.5,grainZ-.5)*.78);
  float rockLam=max(0.,dot(stoneN,sun));
  float erosion=.40*grainX+.24*grainY+.36*grainZ;
  float veins=1.-smoothstep(.05,.26,abs(sin(vPos.x*.61+vPos.y*.57+vPos.z*.63+erosion*5.3)));
  float rockLight=clamp(.35+.63*rockLam+.20*erosion-.12*veins,0.,1.);
  vec3 limestone=mix(vec3(.18,.22,.21),vec3(.74,.72,.62),rockLight);
  limestone*=.86+.23*fine;
  limestone=mix(limestone,vec3(.11,.14,.15),veins*.18);
  // Physically added canopy crowns have upward faces and occupy upper shelves.
  // Keep the vertical cliff walls limestone, with scattered vegetation in fissures.
  float highland=smoothstep(4.2,10.0,vPos.y+1.3);
  float cap=smoothstep(.05,.52,n.y)*highland;
  float niche=smoothstep(.67,.79,erosion)*highland;
  float canopy=clamp(cap*.94+niche*.21,0.,.95);
  float leafDetail=fbm(vPos.xy*1.34+vPos.z*.41);
  vec3 leaves=mix(vec3(.024,.12,.035),vec3(.27,.43,.085),leafDetail);
  leaves*=.65+.42*rockLam;
  col=mix(limestone,leaves,canopy);
  col*=.79+.27*rockLam;
 }else{
  float grain=fbm(vPos.xz*.72+vPos.y*.18);
  col=mix(vec3(.14,.19,.20),vec3(.45,.47,.43),clamp(.42+.38*lit+.20*grain,0.,1.));
 }
 float fog=clamp((vFog-44.)/125.,0.,.67);
 col=mix(col,vec3(.40,.62,.68),fog);
 gl_FragColor=vec4(pow(max(col,vec3(.001)),vec3(.90)),1.);
}`;
const peaceSkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const peaceSkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){return .52*noise2(p)+.28*noise2(p*2.11+7.)+.14*noise2(p*4.3+11.);}
void main(){vec2 uv=vUv;
 vec3 sky=mix(vec3(.68,.84,.83),vec3(.035,.26,.46),smoothstep(.17,.96,uv.y));
 float sun=length((uv-vec2(.77,.56))*vec2(uAspect,1.));
 sky+=vec3(1.0,.79,.47)*(.12*exp(-sun*4.)+.29*exp(-sun*25.));
 vec2 drift=vec2(uTime*.0017,-uTime*.0005);
 float warp=fbm(vec2(uv.x*3.7,uv.y*4.2)+drift);
 float field=fbm(vec2(uv.x*5.+warp*.65,uv.y*10.7-warp*.7)+drift);
 float small=noise2(vec2(uv.x*17.4,uv.y*28.)+drift*3.);
 float cloud=smoothstep(.44,.66,field*.82+small*.18);
 float atmospheric=exp(-pow((uv.y-.60)/.23,2.));
 sky=mix(sky,vec3(.94,.95,.91),cloud*atmospheric*.78);
 sky+=vec3(.16,.23,.17)*exp(-pow((uv.y-.33)/.085,2.));
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.93)),1.);
}`;
function peaceCompile(type,source){const s=peaceGL.createShader(type);peaceGL.shaderSource(s,source);peaceGL.compileShader(s);if(!peaceGL.getShaderParameter(s,peaceGL.COMPILE_STATUS))throw Error('Peace shader: '+peaceGL.getShaderInfoLog(s));return s;}
function peaceLink(v,f){const p=peaceGL.createProgram(),a=peaceCompile(peaceGL.VERTEX_SHADER,v),b=peaceCompile(peaceGL.FRAGMENT_SHADER,f);peaceGL.attachShader(p,a);peaceGL.attachShader(p,b);peaceGL.linkProgram(p);peaceGL.deleteShader(a);peaceGL.deleteShader(b);if(!peaceGL.getProgramParameter(p,peaceGL.LINK_STATUS))throw Error('Peace program: '+peaceGL.getProgramInfoLog(p));return p;}
/* Peace geometry is constructed and West-admitted through the existing H-Earth kernel.
 * Destination GLSL, scene navigation and all other worlds remain unchanged. */
// PALAWAN REFERENCE: steep, vegetated limestone towers framing protected channels.
// Coordinates and polygon topology remain the same source-controlled Peace island layout.
const PEACE_ISLANDS=[[-20,22,12,9],[-4,43,14,12],[24,35,14,11],[-26,75,21,17],[18,92,22,19],[4,110,24,17]];
function peaceIslandHeight(cx,cz,r,ang,seed){
 const teeth=1.+.13*Math.sin(ang*3.+seed)+.09*Math.cos(ang*7.-seed*.67)+.046*Math.sin(ang*11.+seed*.41);
 return r*teeth;
}
function peaceBuildKernelMeshes(K){
 if(!K)throw Error('Peace geometry kernel unavailable');
 const constructed=[];
 const add=(id,kind,positions,indices)=>{
  const result=K.constructHEarthTriangleMesh({primitiveId:'nine-summits-peace-'+id,
   vertices:positions.map(p=>K.createHEarthVector3(p[0],p[1],p[2])),indices,
   normalMode:'FACE',expectedClosure:'OPEN_ALLOWED',semanticRole:'FORGIVENESS_PEACE_'+id.toUpperCase()});
  if(!result.valid||K.hasHEarthBlockingIssues(result.issues))
   throw Error('Peace kernel construction failed: '+id+': '+result.issues.map(e=>e.code).join(','));
  constructed.push({kind,record:result.primitiveRecord});
 };
 // Indexed shared-vertex ocean; wave movement remains in the existing shader.
 {const positions=[],indices=[],nx=48,nz=64;
  for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++)positions.push([-52+104*ix/nx,-1.35,125*iz/nz]);
  for(let iz=0;iz<nz;iz++)for(let ix=0;ix<nx;ix++){
   const a=iz*(nx+1)+ix,b=a+1,c=a+nx+1,d=c+1;
   indices.push(a,c,b,b,c,d);
  }
  add('open-ocean',0,positions,indices);
 }
 for(let k=0;k<PEACE_ISLANDS.length;k++){
  const [cx,cz,rad,height]=PEACE_ISLANDS[k],sides=56,rings=12;
  const point=(r,a)=>{
   const t=a*Math.PI*2/sides,edge=peaceIslandHeight(cx,cz,rad,t,k*1.9+.5);
   const x=cx+edge*r*Math.cos(t),z=cz+edge*r*.67*Math.sin(t);
   // Asymmetric crown and eroded buttresses: high walls retain height close to water,
   // rather than tapering from a radial apex. Narrow ledges and pinnacle ridges form cliffs.
   const theta=.46+k*.77,u=(x-cx)/rad,v=(z-cz)/(rad*.67);
   const ridge=u*Math.cos(theta)+v*Math.sin(theta);
   const valley=-u*Math.sin(theta)+v*Math.cos(theta);
   const crown=.56+.24*Math.sin(valley*3.1+k*1.7)+.13*Math.sin(ridge*6.8+valley*3.9);
   const pinnacles=.095*Math.pow(.5+.5*Math.sin(t*5.+k*2.3+Math.sin(t*9.)),3.);
   const ledges=.048*Math.sin(t*17.+k*1.9+r*11.)+.030*Math.cos(t*29.-r*19.);
   const core=(.68+.16*Math.sin(k*1.3)+crown*.18+pinnacles+ledges);
   const coastT=Math.min(1.,Math.max(0.,(r-.78)/.205));
   const wall=1.-coastT*coastT*(3.-2.*coastT);
   const crags=(.038*Math.sin(t*23.+r*17.)+.025*Math.sin(t*37.-r*8.))*(1.-r);
   const y=-1.33+height*Math.max(0.,wall*(core+crags));
   return [x,y,z];
  };
  const positions=[point(0,0)],indices=[];
  for(let ring=1;ring<=rings;ring++)for(let side=0;side<sides;side++)positions.push(point(ring/rings,side));
  for(let side=0;side<sides;side++)indices.push(0,1+(side+1)%sides,1+side);
  for(let ring=1;ring<rings;ring++)for(let side=0;side<sides;side++){
   const a=1+(ring-1)*sides+side,b=1+(ring-1)*sides+(side+1)%sides,c=1+ring*sides+side,d=1+ring*sides+(side+1)%sides;
   indices.push(a,b,c,b,d,c);
  }
  // Small source-built canopy crowns on the upper karst shelves, not a wallpaper texture.
  // These triangles remain part of the SAME West-admitted island mesh.
  const frac=x=>x-Math.floor(x);
  for(let clump=0;clump<46;clump++){
   const a=2.*Math.PI*frac((clump+1)*.61803398875+k*.217);
   const rr=.14+.54*frac((clump+3)*.754877666+k*.133);
   const foot=point(rr,a),size=.68+.48*frac((clump+7)*.414213562+k*.287);
   const crownHeight=size*(.65+.38*frac(clump*.193+k*.119));
   const offset=positions.length;
   positions.push([foot[0],foot[1]+crownHeight,foot[2]]);
   for(let petal=0;petal<7;petal++){
    const theta=petal*2.*Math.PI/7.,radial=size*(.85+.15*Math.sin(petal*3.7+clump));
    positions.push([foot[0]+Math.cos(theta)*radial,foot[1]+crownHeight*.12,foot[2]+Math.sin(theta)*radial]);
   }
   for(let petal=0;petal<7;petal++)indices.push(offset,offset+1+petal,offset+1+(petal+1)%7);
  }
  add('island-'+k,2,positions,indices);
  // Explicit open annular shore strips.
  {const positions=[],indices=[],shoreSides=96;
   const mk=(r,a)=>{const t=a*Math.PI*2/shoreSides,edge=peaceIslandHeight(cx,cz,rad,t,k*1.9+.5);
    return [cx+edge*r*Math.cos(t),-1.28,cz+edge*r*.67*Math.sin(t)];};
   for(const r of [.95,1.08])for(let side=0;side<shoreSides;side++)positions.push(mk(r,side));
   for(let side=0;side<shoreSides;side++){
    const a=side,b=(side+1)%shoreSides,c=shoreSides+side,d=shoreSides+(side+1)%shoreSides;
    indices.push(a,b,c,b,d,c);
   }
   add('shore-'+k,1,positions,indices);
  }
 }
 const rocks=[[-17,1.7,2.7],[18,2.2,3.8],[-31,8.2,5.5],[29,11.5,6.4]];
 for(let i=0;i<rocks.length;i++){
  const [cx,cz,rad]=rocks[i],sides=9,positions=[],indices=[];
  const ring=(s,a)=>{const t=2*Math.PI*a/sides,r=rad*s*(1+.18*Math.sin(t*3.1+i));
   return [cx+r*Math.cos(t),-1.25+rad*(1.-s)*.85,cz+r*.7*Math.sin(t)];};
  for(const rr of [.05,.52,.99])for(let a=0;a<sides;a++)positions.push(ring(rr,a));
  for(let rr=0;rr<2;rr++)for(let a=0;a<sides;a++){
   const A=rr*sides+a,B=rr*sides+(a+1)%sides,C=(rr+1)*sides+a,D=(rr+1)*sides+(a+1)%sides;
   indices.push(A,B,C,B,D,C);
  }
  add('rock-'+i,3,positions,indices);
 }
 const admitted=K.admitHEarthPrimitiveBatch(constructed.map(v=>v.record),{frameId:'nine-summits-peace-coast-v1'});
 if(!admitted.valid||!K.isHEarthAggregateFrameAdmissionRecord(admitted.frame)||K.hasHEarthBlockingIssues(admitted.issues))
  throw Error('Peace coast kernel admission failed: '+(admitted.issues||[]).map(e=>e.code).join(','));
 if(admitted.frame.primitives.length!==17)throw Error('Peace kernel primitive count mismatch');
 const batches=[[],[],[],[]];
 for(let i=0;i<admitted.frame.primitives.length;i++){
  const g=admitted.frame.primitives[i].geometry,kind=constructed[i].kind,vertices=batches[kind];
  g.indices.forEach((index,j)=>{
   const p=g.vertices[index],n=g.faceNormals[Math.floor(j/3)],sign=n.y<0?-1:1;
   vertices.push(p.x,p.y,p.z,n.x*sign,n.y*sign,n.z*sign);
  });
 }
 return batches.map(x=>new Float32Array(x));
}
function setupPeaceWorld(){
 ensurePeaceCinema();
 if(peaceCinemaState!=='error')return;
 setupPeaceGLFallback();
}
function setupPeaceGLFallback(){if(peaceGL)return;
 peaceGL=peaceCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 if(!peaceGL)throw Error('Peace coast WebGL unavailable');
 peaceProgram=peaceLink(peaceVertex,peaceFragment);peaceSkyProgram=peaceLink(peaceSkyVertex,peaceSkyFragment);
 for(const n of ['aPosition','aNormal'])peaceLoc[n]=peaceGL.getAttribLocation(peaceProgram,n);
 for(const n of ['uViewport','uTime','uKind'])peaceLoc[n]=peaceGL.getUniformLocation(peaceProgram,n);
 peaceSkyLoc.aXY=peaceGL.getAttribLocation(peaceSkyProgram,'aXY');for(const n of ['uAspect','uTime'])peaceSkyLoc[n]=peaceGL.getUniformLocation(peaceSkyProgram,n);
 const upload=data=>{const b=peaceGL.createBuffer();peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,b);peaceGL.bufferData(peaceGL.ARRAY_BUFFER,data,peaceGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 const groups=peaceBuildKernelMeshes(peaceKernelFacade);
 peaceOcean=upload(groups[0]);peaceShore=upload(groups[1]);peaceIslands=upload(groups[2]);peaceRocks=upload(groups[3]);
 peaceSkyBuffer=peaceGL.createBuffer();peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,peaceSkyBuffer);peaceGL.bufferData(peaceGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),peaceGL.STATIC_DRAW);
 peaceGL.enable(peaceGL.DEPTH_TEST);peaceGL.clearColor(.04,.14,.19,1.);
}
function drawPeaceWorld(t){
 updatePeaceCinema();
 if(peaceCinemaState!=='error')return;
 if(!peaceGL)return;
 const r=peaceCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
 if(peaceCanvas.width!==w||peaceCanvas.height!==h){peaceCanvas.width=w;peaceCanvas.height=h;}
 peaceGL.viewport(0,0,w,h);peaceGL.clear(peaceGL.COLOR_BUFFER_BIT|peaceGL.DEPTH_BUFFER_BIT);
 peaceGL.disable(peaceGL.DEPTH_TEST);peaceGL.useProgram(peaceSkyProgram);peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,peaceSkyBuffer);
 peaceGL.vertexAttribPointer(peaceSkyLoc.aXY,2,peaceGL.FLOAT,false,0,0);peaceGL.enableVertexAttribArray(peaceSkyLoc.aXY);
 peaceGL.uniform1f(peaceSkyLoc.uTime,t);peaceGL.uniform1f(peaceSkyLoc.uAspect,w/h);peaceGL.drawArrays(peaceGL.TRIANGLES,0,3);
 peaceGL.enable(peaceGL.DEPTH_TEST);peaceGL.useProgram(peaceProgram);peaceGL.uniform2f(peaceLoc.uViewport,w/h,1);peaceGL.uniform1f(peaceLoc.uTime,t);
 const draw=(mesh,kind)=>{peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,mesh.buffer);peaceGL.vertexAttribPointer(peaceLoc.aPosition,3,peaceGL.FLOAT,false,24,0);peaceGL.enableVertexAttribArray(peaceLoc.aPosition);peaceGL.vertexAttribPointer(peaceLoc.aNormal,3,peaceGL.FLOAT,false,24,12);peaceGL.enableVertexAttribArray(peaceLoc.aNormal);peaceGL.uniform1f(peaceLoc.uKind,kind);peaceGL.drawArrays(peaceGL.TRIANGLES,0,mesh.count);};
 draw(peaceOcean,0);draw(peaceShore,1);draw(peaceIslands,2);draw(peaceRocks,3);
}


/* WORLD 06 — SELF-CONTROL → BALANCE / The Twin Equilibrium.
 * Geological saddle between a cold current basin and a warm ridgeline.
 * Non-straight geographic transition, two asynchronously drifting cloud streams.
 */
let balanceGL=null,balanceProgram=null,balanceSkyProgram=null,balanceTerrain=null,balanceCool=null,balanceWarm=null,balanceStones=null,balanceSkyBuffer=null,balanceLoc={},balanceSkyLoc={};
const balanceCanvas=document.querySelector('#balance-world-canvas');
const balanceVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vPos,vNormal;varying float vFog;
void main(){vec3 p=aPosition;
 if(uKind>0.5 && uKind<2.5){float speed=uKind<1.5?.23:.12;p.y+=.075*sin(p.z*.19-uTime*speed+p.x*.12);}
 vec3 eye=p-vec3(0.,3.4,-8.);
 float depth=max(.7,eye.z);
 gl_Position=vec4(eye.x*1.75/uViewport.x,(eye.y+eye.z*.026)*1.75,eye.z*.997-.30,depth);
 vPos=p;vNormal=aNormal;vFog=depth;}`;
const balanceFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vPos,vNormal;varying float vFog;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec3 n=normalize(vNormal);float edge=vPos.x-(3.8*sin(vPos.z*.041)+2.1*sin(vPos.z*.099));
 float mixGeo=smoothstep(-6.,6.,edge);
 float coolLight=max(.0,dot(n,normalize(vec3(-.70,.85,-.24))));
 float warmLight=max(.0,dot(n,normalize(vec3(.74,.61,-.30))));
 float rock=noise2(vPos.xz*.16)*.15+noise2(vPos.xz*.61)*.075;
 vec3 col;
 if(uKind<.5){
  vec3 basin=mix(vec3(.065,.115,.19),vec3(.18,.31,.41),clamp(.26+.85*coolLight+rock,0.,1.));
  vec3 ridge=mix(vec3(.23,.105,.23),vec3(.48,.28,.37),clamp(.2+.88*warmLight+rock,0.,1.));
  col=mix(basin,ridge,mixGeo);
  float strata=.055*sin(vPos.y*2.3+vPos.z*.12);
  col+=mix(vec3(.024,.058,.08),vec3(.08,.035,.044),mixGeo)*strata;
 }else if(uKind<1.5){
  float current=.5+.5*sin(vPos.z*.34-uTime*.28+sin(vPos.x*.35));
  col=mix(vec3(.075,.32,.47),vec3(.45,.79,.85),current*.64);
 }else if(uKind<2.5){
  float current=.5+.5*sin(vPos.z*.21+uTime*.13+sin(vPos.x*.17));
  col=mix(vec3(.29,.15,.38),vec3(.90,.53,.62),current*.64);
 }else{
  col=mix(vec3(.14,.23,.34),vec3(.38,.29,.40),mixGeo);
  col*=.46+.52*mix(coolLight,warmLight,mixGeo);
 }
 float fog=clamp((vFog-22.)/105.,0.,.82);
 col=mix(col,mix(vec3(.21,.33,.46),vec3(.46,.32,.46),mixGeo),fog);
 gl_FragColor=vec4(pow(max(col,vec3(.001)),vec3(.87)),1.);}`;
const balanceSkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const balanceSkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=vUv;
 vec3 left=mix(vec3(.33,.47,.64),vec3(.023,.06,.14),smoothstep(.13,1.,uv.y));
 vec3 right=mix(vec3(.70,.40,.49),vec3(.10,.046,.19),smoothstep(.13,1.,uv.y));
 float division=smoothstep(.27,.74,uv.x+.048*sin(uv.y*10.));
 vec3 sky=mix(left,right,division);
 float halo=exp(-length((uv-vec2(.77,.43))*vec2(uAspect,1.))*8.);
 sky+=vec3(.42,.23,.28)*halo*.58;
 float ice=noise2(vec2(uv.x*8.-uTime*.002,uv.y*29.));
 float warm=noise2(vec2(uv.x*12.+uTime*.0035,uv.y*24.)+vec2(3.,0.));
 float clouds=mix(smoothstep(.55,.77,ice)*.43,smoothstep(.57,.81,warm)*.50,division)*exp(-pow((uv.y-.50)/.24,2.));
 sky=mix(sky,mix(vec3(.63,.75,.85),vec3(.88,.64,.72),division),clouds);
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.9)),1.);}`;
function balanceCompile(type,source){const s=balanceGL.createShader(type);balanceGL.shaderSource(s,source);balanceGL.compileShader(s);if(!balanceGL.getShaderParameter(s,balanceGL.COMPILE_STATUS))throw Error('Balance shader: '+balanceGL.getShaderInfoLog(s));return s;}
function balanceLink(v,f){const p=balanceGL.createProgram(),a=balanceCompile(balanceGL.VERTEX_SHADER,v),b=balanceCompile(balanceGL.FRAGMENT_SHADER,f);balanceGL.attachShader(p,a);balanceGL.attachShader(p,b);balanceGL.linkProgram(p);balanceGL.deleteShader(a);balanceGL.deleteShader(b);if(!balanceGL.getProgramParameter(p,balanceGL.LINK_STATUS))throw Error('Balance link: '+balanceGL.getProgramInfoLog(p));return p;}
function balanceTri(o,a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,normal=n.map(x=>x/l);if(normal[1]<0)for(let i=0;i<3;i++)normal[i]=-normal[i];for(const p of [a,b,c])o.push(...p,...normal);}
function balanceQuad(o,a,b,c,d){balanceTri(o,a,b,c);balanceTri(o,b,d,c);}
function balanceHeight(x,z){const boundary=3.8*Math.sin(z*.041)+2.1*Math.sin(z*.099),t=x-boundary;
 const saddle=3.1*Math.exp(-Math.pow(t/8.0,2))*Math.exp(-Math.pow((z-21)/40.,2));
 const leftRidge=3.5*Math.exp(-Math.pow((x+36-6*Math.sin(z*.025))/14,2));
 const rightRidge=5.5*Math.exp(-Math.pow((x-33-5*Math.cos(z*.031))/13,2));
 const distant=9.*Math.max(0.,(z-66)/100.)*Math.pow(Math.abs(Math.sin(x*.067+z*.027)),2.);
 const undulate=.56*Math.sin(x*.18+z*.043)+.38*Math.cos(z*.14-x*.068);
 const basin=t<0?-1.5*Math.exp(-Math.pow((t+16)/15,2)):2.0*Math.exp(-Math.pow((t-19)/15,2));
 return -2.3+saddle+leftRidge+rightRidge+distant+undulate+basin;}
function balanceTerrainMesh(){const o=[],nx=138,nz=154;for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
 const x0=-58+116*x/nx,x1=-58+116*(x+1)/nx,z0=0+137*z/nz,z1=0+137*(z+1)/nz;
 balanceQuad(o,[x0,balanceHeight(x0,z0),z0],[x1,balanceHeight(x1,z0),z0],[x0,balanceHeight(x0,z1),z1],[x1,balanceHeight(x1,z1),z1]);}
 return new Float32Array(o);}
function balanceCurrentMesh(warm){const out=[],segments=115;const point=(z,sign)=>{const boundary=3.8*Math.sin(z*.041)+2.1*Math.sin(z*.099),x=(warm?17:-18)+boundary*.6+3.5*Math.sin(z*.034+(warm?1.8:0));return [x+sign*(warm?1.1:1.45),balanceHeight(x,z)+.14,z];};for(let i=0;i<segments;i++){const z0=5+i*1.05,z1=5+(i+1)*1.05;balanceQuad(out,point(z0,-1),point(z0,1),point(z1,-1),point(z1,1));}return new Float32Array(out);}
function balanceStonesMesh(){const out=[],stones=[[-5,6,2.8],[5,9,3.1],[-11,17,3.5],[12,23,3.3],[-9,31,4.2],[8,42,5.2],[26,56,6.4],[-28,61,7.2],[-41,87,9],[35,104,10]];for(let k=0;k<stones.length;k++){const [cx,cz,r]=stones[k],n=9;
 const ring=(radius,y,a)=>{const t=a*Math.PI*2/n,rr=r*radius*(1+.15*Math.sin(t*3+k*1.4));return[cx+rr*Math.cos(t),balanceHeight(cx,cz)+y*r,cz+rr*.68*Math.sin(t)];};
 for(let a=0;a<n;a++){balanceQuad(out,ring(.6,.84,a),ring(.6,.84,a+1),ring(1,.0,a),ring(1,.0,a+1));}}
 return new Float32Array(out);}
function setupBalanceWorld(){if(balanceGL)return;
 balanceGL=balanceCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!balanceGL)throw Error('Balance landscape WebGL unavailable');
 balanceProgram=balanceLink(balanceVertex,balanceFragment);balanceSkyProgram=balanceLink(balanceSkyVertex,balanceSkyFragment);
 for(const n of ['aPosition','aNormal'])balanceLoc[n]=balanceGL.getAttribLocation(balanceProgram,n);
 for(const n of ['uViewport','uTime','uKind'])balanceLoc[n]=balanceGL.getUniformLocation(balanceProgram,n);
 balanceSkyLoc.aXY=balanceGL.getAttribLocation(balanceSkyProgram,'aXY');for(const n of ['uAspect','uTime'])balanceSkyLoc[n]=balanceGL.getUniformLocation(balanceSkyProgram,n);
 const upload=data=>{const b=balanceGL.createBuffer();balanceGL.bindBuffer(balanceGL.ARRAY_BUFFER,b);balanceGL.bufferData(balanceGL.ARRAY_BUFFER,data,balanceGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 balanceTerrain=upload(balanceTerrainMesh());balanceCool=upload(balanceCurrentMesh(false));balanceWarm=upload(balanceCurrentMesh(true));balanceStones=upload(balanceStonesMesh());
 balanceSkyBuffer=balanceGL.createBuffer();balanceGL.bindBuffer(balanceGL.ARRAY_BUFFER,balanceSkyBuffer);balanceGL.bufferData(balanceGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),balanceGL.STATIC_DRAW);
 balanceGL.enable(balanceGL.DEPTH_TEST);balanceGL.clearColor(.07,.09,.18,1.);
}
function drawBalanceWorld(t){if(!balanceGL)return;
 const r=balanceCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(balanceCanvas.width!==w||balanceCanvas.height!==h){balanceCanvas.width=w;balanceCanvas.height=h;}
 balanceGL.viewport(0,0,w,h);balanceGL.clear(balanceGL.COLOR_BUFFER_BIT|balanceGL.DEPTH_BUFFER_BIT);
 balanceGL.disable(balanceGL.DEPTH_TEST);balanceGL.useProgram(balanceSkyProgram);balanceGL.bindBuffer(balanceGL.ARRAY_BUFFER,balanceSkyBuffer);balanceGL.vertexAttribPointer(balanceSkyLoc.aXY,2,balanceGL.FLOAT,false,0,0);balanceGL.enableVertexAttribArray(balanceSkyLoc.aXY);balanceGL.uniform1f(balanceSkyLoc.uTime,t);balanceGL.uniform1f(balanceSkyLoc.uAspect,w/h);balanceGL.drawArrays(balanceGL.TRIANGLES,0,3);
 balanceGL.enable(balanceGL.DEPTH_TEST);balanceGL.useProgram(balanceProgram);balanceGL.uniform2f(balanceLoc.uViewport,w/h,1);balanceGL.uniform1f(balanceLoc.uTime,t);
 const draw=(mesh,kind)=>{balanceGL.bindBuffer(balanceGL.ARRAY_BUFFER,mesh.buffer);balanceGL.vertexAttribPointer(balanceLoc.aPosition,3,balanceGL.FLOAT,false,24,0);balanceGL.enableVertexAttribArray(balanceLoc.aPosition);balanceGL.vertexAttribPointer(balanceLoc.aNormal,3,balanceGL.FLOAT,false,24,12);balanceGL.enableVertexAttribArray(balanceLoc.aNormal);balanceGL.uniform1f(balanceLoc.uKind,kind);balanceGL.drawArrays(balanceGL.TRIANGLES,0,mesh.count);};
 draw(balanceTerrain,0);draw(balanceCool,1);draw(balanceWarm,2);draw(balanceStones,3);
}

/* WORLD 07 — PATIENCE → STRUCTURE: The Ancient Canopy.
 * Walkable old-growth nave with branching architecture, emergent crowns,
 * exposed root buttresses and leaf-filtered light. No generated image.
 */
let canopyGL=null,canopyProgram=null,canopySkyProgram=null,canopyMeshes={},canopySkyBuffer=null,canopyLoc={},canopySkyLoc={};
const canopyCanvas=document.querySelector('#canopy-world-canvas');
const canopyVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vPos,vNormal;varying float vFog;
void main(){vec3 p=aPosition;
 if(uKind>1.5&&uKind<2.5){p.x+=.08*sin(p.y*.29+uTime*.11+p.z*.24);}
 vec3 eye=p-vec3(0.,3.7,-8.);
 float depth=max(.7,eye.z);
 gl_Position=vec4(eye.x*1.75/uViewport.x,(eye.y+eye.z*.026)*1.75,eye.z*.997-.30,depth);
 vPos=p;vNormal=aNormal;vFog=depth;}`;
const canopyFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vPos,vNormal;varying float vFog;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec3 n=normalize(vNormal);float light=max(.0,dot(n,normalize(vec3(-.73,.87,-.30))));
 float local=noise2(vPos.xz*.15)*.15+noise2(vPos.xz*.51)*.08;
 vec3 col;
 if(uKind<.5){
  float path=1.-smoothstep(2.0,7.,abs(vPos.x+1.7*sin(vPos.z*.039)));
  vec3 fern=mix(vec3(.035,.075,.048),vec3(.17,.30,.12),clamp(.18+light*.78+local,0.,1.));
  vec3 moss=mix(vec3(.20,.20,.105),vec3(.42,.38,.20),clamp(light*.58+local,0.,1.));
  col=mix(fern,moss,path*.73);
 }else if(uKind<1.5){
  float rings=.5+.5*sin(vPos.y*.59+sin(vPos.x*1.8+vPos.z*2.1));
  col=mix(vec3(.085,.065,.042),vec3(.32,.20,.11),clamp(light*.7+.20*rings+local,0.,1.));
 }else if(uKind<2.5){
  float variation=noise2(vPos.xz*.24+vPos.y*.07);
  col=mix(vec3(.024,.091,.063),vec3(.17,.43,.22),clamp(.06+light*.77+variation*.24,0.,1.));
  col+=vec3(.10,.14,.025)*pow(max(.0,dot(n,normalize(vec3(-.65,.90,-.25)))),3.)*.42;
 }else if(uKind<3.5){col=mix(vec3(.075,.10,.053),vec3(.19,.27,.09),light*.66+local);}
 else {float fil=.55+.45*sin(vPos.y*.14+uTime*.13);col=vec3(.52,.64,.38)*fil*(.45+.35*light);}
 float fog=clamp((vFog-20.)/110.,0.,.80);
 col=mix(col,vec3(.09,.19,.16),fog);
 gl_FragColor=vec4(pow(max(col,vec3(.001)),vec3(.88)),1.);}`;
const canopySkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const canopySkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=vUv;
 vec3 mist=mix(vec3(.24,.43,.33),vec3(.017,.065,.057),smoothstep(.12,1.,uv.y));
 float light=exp(-length((uv-vec2(.57,.59))*vec2(uAspect*.66,1.))*5.);
 vec3 sky=mist+vec3(.34,.32,.16)*light*.51;
 float foliage=noise2(vec2(uv.x*17.+sin(uv.y*13.)*.5,uv.y*21.)+uTime*.001);
 foliage+=noise2(vec2(uv.x*37.,uv.y*35.))*.35;
 float silhouettes=smoothstep(.81,1.06,foliage)*smoothstep(.40,.84,uv.y);
 sky=mix(sky,vec3(.009,.036,.029),silhouettes*.72);
 float rays=pow(max(0.,sin((uv.x-.57)*32.+sin(uv.y*3.)*.45)),28.)*light*.24;
 sky+=vec3(.62,.67,.37)*rays;
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.88)),1.);}`;
function canopyCompile(type,src){const s=canopyGL.createShader(type);canopyGL.shaderSource(s,src);canopyGL.compileShader(s);if(!canopyGL.getShaderParameter(s,canopyGL.COMPILE_STATUS))throw Error('Canopy shader: '+canopyGL.getShaderInfoLog(s));return s;}
function canopyLink(v,f){const p=canopyGL.createProgram(),a=canopyCompile(canopyGL.VERTEX_SHADER,v),b=canopyCompile(canopyGL.FRAGMENT_SHADER,f);canopyGL.attachShader(p,a);canopyGL.attachShader(p,b);canopyGL.linkProgram(p);canopyGL.deleteShader(a);canopyGL.deleteShader(b);if(!canopyGL.getProgramParameter(p,canopyGL.LINK_STATUS))throw Error('Canopy link: '+canopyGL.getProgramInfoLog(p));return p;}
function canopyTri(out,a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,nn=n.map(q=>q/l);for(const p of [a,b,c])out.push(...p,...nn);}
function canopyQuad(out,a,b,c,d){canopyTri(out,a,b,c);canopyTri(out,b,d,c);}
function canopyHeight(x,z){const central=x+1.7*Math.sin(z*.039),bank=3.6*Math.exp(-Math.pow((Math.abs(central)-19.)/13.,2.));return -2.1+bank+.64*Math.sin(x*.18+z*.04)+.34*Math.sin(z*.23-x*.12)+.004*Math.abs(x)**1.50+3.5*Math.max(0.,(z-80)/83.)*Math.sin(x*.057+z*.016)**2;}
function canopyGround(){const o=[],nx=98,nz=116;for(let i=0;i<nz;i++)for(let j=0;j<nx;j++){const x0=-58+116*j/nx,x1=-58+116*(j+1)/nx,z0=0+143*i/nz,z1=0+143*(i+1)/nz;canopyQuad(o,[x0,canopyHeight(x0,z0),z0],[x1,canopyHeight(x1,z0),z0],[x0,canopyHeight(x0,z1),z1],[x1,canopyHeight(x1,z1),z1]);}return new Float32Array(o);}
function canopyTube(o,a,b,ra,rb,n=7){const vx=b[0]-a[0],vy=b[1]-a[1],vz=b[2]-a[2],l=Math.hypot(vx,vy,vz)||1;
let ux=-vz/l,uy=0,uz=vx/l,ulen=Math.hypot(ux,uz)||1;ux/=ulen;uz/=ulen;
let wx=vy*uz/l,wy=(vz*ux-vx*uz)/l,wz=-vy*ux/l;let wl=Math.hypot(wx,wy,wz)||1;wx/=wl;wy/=wl;wz/=wl;
const ring=(p,r,t)=>[p[0]+r*(Math.cos(t)*ux+Math.sin(t)*wx),p[1]+r*(Math.cos(t)*uy+Math.sin(t)*wy),p[2]+r*(Math.cos(t)*uz+Math.sin(t)*wz)];
for(let i=0;i<n;i++){let t=i*2*Math.PI/n,nt=(i+1)*2*Math.PI/n;canopyQuad(o,ring(a,ra,t),ring(a,ra,nt),ring(b,rb,t),ring(b,rb,nt));}}
function canopyCrown(o,center,rx,ry,rz,seed){const [x,y,z]=center;const lat=5,lon=9;for(let j=0;j<lat;j++)for(let i=0;i<lon;i++){const phi0=Math.PI*j/lat,phi1=Math.PI*(j+1)/lat,ta=i*Math.PI*2/lon,tb=(i+1)*Math.PI*2/lon;
 const point=(p,t)=>{const f=1+.13*Math.sin(seed*3.+t*3.6+p*4.8);return [x+Math.sin(p)*Math.cos(t)*rx*f,y+Math.cos(p)*ry*f,z+Math.sin(p)*Math.sin(t)*rz*f];};
 canopyQuad(o,point(phi0,ta),point(phi0,tb),point(phi1,ta),point(phi1,tb));} }
function canopyTrees(){const trunks=[],leaves=[],roots=[];const count=46;for(let k=0;k<count;k++){const near=k<22,z=7+(k/2|0)*(near?7.5:5.4)+(k%2)*2.6;
const side=k%2?-1:1,offset=near?14:16+(k%7)*1.7;
const x=side*(offset+3.3*Math.sin(k*1.7)),baseY=canopyHeight(x,z),height=(near?25:33)+(k%7)*3.0,thick=near?1.45:1.18;
const a=[x,baseY,z],m=[x+1.8*Math.sin(k*2.2),baseY+height*.55,z+1.2*Math.cos(k*.79)],top=[x+side*2.2+Math.sin(k),baseY+height,z+3*Math.sin(k*.72)];
 canopyTube(trunks,a,m,thick,thick*.68);canopyTube(trunks,m,top,thick*.68,.22);
 // Buttress roots anchor living growth to the valley and frame the central corridor.
 for(let n=0;n<4;n++){const t=n*Math.PI/2+k*.3,p=[x+Math.cos(t)*3.5,canopyHeight(x+Math.cos(t)*3.5,z+Math.sin(t)*3.5)+.05,z+Math.sin(t)*3.5];canopyTube(roots,a,p,thick*.62,.10,5);}
 const fan=4+(k%3);for(let n=0;n<fan;n++){const theta=n*Math.PI*2/fan+k*.27,reach=(7+(k%5))*((n%2)?1.0:.78);const end=[top[0]+Math.cos(theta)*reach,top[1]-(n%3)*1.25,top[2]+Math.sin(theta)*reach];
 canopyTube(trunks,m,end,.34,.085,5);canopyCrown(leaves,[end[0],end[1]+2.8,end[2]],4.0+(k%3),3.8+(n%3),4.1+(n%2),k*2.1+n);
 }canopyCrown(leaves,top,5.0,4.5,5.0,k*.93);
}return{trunks:new Float32Array(trunks),leaves:new Float32Array(leaves),roots:new Float32Array(roots)};}
function setupCanopyWorld(){if(canopyGL)return;canopyGL=canopyCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!canopyGL)throw Error('Ancient Canopy WebGL unavailable');
 canopyProgram=canopyLink(canopyVertex,canopyFragment);canopySkyProgram=canopyLink(canopySkyVertex,canopySkyFragment);
 for(const n of ['aPosition','aNormal'])canopyLoc[n]=canopyGL.getAttribLocation(canopyProgram,n);for(const n of ['uViewport','uTime','uKind'])canopyLoc[n]=canopyGL.getUniformLocation(canopyProgram,n);
 canopySkyLoc.aXY=canopyGL.getAttribLocation(canopySkyProgram,'aXY');for(const n of ['uAspect','uTime'])canopySkyLoc[n]=canopyGL.getUniformLocation(canopySkyProgram,n);
 const upload=data=>{const b=canopyGL.createBuffer();canopyGL.bindBuffer(canopyGL.ARRAY_BUFFER,b);canopyGL.bufferData(canopyGL.ARRAY_BUFFER,data,canopyGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 canopyMeshes.ground=upload(canopyGround());for(const [k,d]of Object.entries(canopyTrees()))canopyMeshes[k]=upload(d);
 canopySkyBuffer=canopyGL.createBuffer();canopyGL.bindBuffer(canopyGL.ARRAY_BUFFER,canopySkyBuffer);canopyGL.bufferData(canopyGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),canopyGL.STATIC_DRAW);canopyGL.enable(canopyGL.DEPTH_TEST);canopyGL.clearColor(.018,.08,.062,1.);}
function drawCanopyWorld(t){if(!canopyGL)return;const r=canopyCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
 if(canopyCanvas.width!==w||canopyCanvas.height!==h){canopyCanvas.width=w;canopyCanvas.height=h;}
 canopyGL.viewport(0,0,w,h);canopyGL.clear(canopyGL.COLOR_BUFFER_BIT|canopyGL.DEPTH_BUFFER_BIT);
 canopyGL.disable(canopyGL.DEPTH_TEST);canopyGL.useProgram(canopySkyProgram);canopyGL.bindBuffer(canopyGL.ARRAY_BUFFER,canopySkyBuffer);canopyGL.vertexAttribPointer(canopySkyLoc.aXY,2,canopyGL.FLOAT,false,0,0);canopyGL.enableVertexAttribArray(canopySkyLoc.aXY);canopyGL.uniform1f(canopySkyLoc.uTime,t);canopyGL.uniform1f(canopySkyLoc.uAspect,w/h);canopyGL.drawArrays(canopyGL.TRIANGLES,0,3);
 canopyGL.enable(canopyGL.DEPTH_TEST);canopyGL.depthFunc(canopyGL.LEQUAL);canopyGL.useProgram(canopyProgram);canopyGL.uniform2f(canopyLoc.uViewport,w/h,1);canopyGL.uniform1f(canopyLoc.uTime,t);
 const draw=(mesh,k)=>{canopyGL.bindBuffer(canopyGL.ARRAY_BUFFER,mesh.buffer);canopyGL.vertexAttribPointer(canopyLoc.aPosition,3,canopyGL.FLOAT,false,24,0);canopyGL.enableVertexAttribArray(canopyLoc.aPosition);canopyGL.vertexAttribPointer(canopyLoc.aNormal,3,canopyGL.FLOAT,false,24,12);canopyGL.enableVertexAttribArray(canopyLoc.aNormal);canopyGL.uniform1f(canopyLoc.uKind,k);canopyGL.drawArrays(canopyGL.TRIANGLES,0,mesh.count);};
 draw(canopyMeshes.ground,0);draw(canopyMeshes.roots,3);draw(canopyMeshes.trunks,1);draw(canopyMeshes.leaves,2);
}

/* WORLD 08 — HUMILITY → DIGNITY: The Quiet Highlands.
 * Wide eroded uplands, a winding natural pass, scattered weathered stones,
 * rose-violet atmospheric distance. Independent geometry, not a recolored globe.
 */
let highlandsGL=null,highlandsProgram=null,highlandsSkyProgram=null,highlandsMeshes={},highlandsSkyBuffer=null,highlandsLoc={},highlandsSkyLoc={};
const highlandsCanvas=document.querySelector('#highlands-world-canvas');
const highlandsVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vPos,vNormal;varying float vFog;
void main(){vec3 p=aPosition;vec3 eye=p-vec3(0.,3.5,-8.);
 float depth=max(.7,eye.z);
 gl_Position=vec4(eye.x*1.75/uViewport.x,(eye.y+eye.z*.026)*1.75,eye.z*.997-.30,depth);
 vPos=p;vNormal=aNormal;vFog=depth;}`;
const highlandsFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vPos,vNormal;varying float vFog;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec3 n=normalize(vNormal);float light=.34+.65*max(0.,dot(n,normalize(vec3(-.63,.76,-.52))));
 float erode=noise2(vPos.xz*.085)*.23+noise2(vPos.xz*.30)*.085;
 float stratum=.5+.5*sin(vPos.y*2.25+noise2(vPos.xz*.15)*3.2);
 vec3 col;
 if(uKind<.5){
  vec3 rose=mix(vec3(.21,.16,.20),vec3(.60,.39,.39),light*.82+erode);
  vec3 sedge=vec3(.28,.34,.25);
  float meadow=smoothstep(-1.0,1.6,vPos.y)*(.3+.35*noise2(vPos.xz*.20));
  col=mix(rose,sedge,meadow*.34);col*=.87+.11*stratum;
 }else if(uKind<1.5){
  col=mix(vec3(.19,.14,.19),vec3(.65,.48,.42),light*.86+erode*.4);
  col*=.91+.13*stratum;
 }else{
  col=mix(vec3(.21,.18,.23),vec3(.73,.61,.55),light*.75+erode*.35);
  col+=vec3(.10,.07,.045)*stratum*.12;
 }
 float distance=clamp((vFog-22.)/124.,0.,.87);
 col=mix(col,vec3(.39,.32,.39),distance*.58);
 gl_FragColor=vec4(pow(max(col,vec3(.001)),vec3(.91)),1.);}`;
const highlandsSkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const highlandsSkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=vUv;
 vec3 sky=mix(vec3(.79,.59,.55),vec3(.23,.27,.42),smoothstep(.08,1.,uv.y));
 float sun=exp(-length((uv-vec2(.78,.45))*vec2(uAspect*.65,1.))*7.3);
 sky+=vec3(.27,.18,.12)*sun*.55;
 float n=noise2(uv*vec2(5.5,15.)+vec2(uTime*.0012,0.));
 float n2=noise2(uv*vec2(14.,38.));
 float cloud=smoothstep(.52,.73,n*.70+n2*.30)*smoothstep(.17,.60,uv.y);
 sky=mix(sky,vec3(.72,.55,.59),cloud*.21);
 float far=exp(-pow((uv.y-.34)*17.,2.))*(.28+.14*sin(uv.x*18.+n*3.));
 sky=mix(sky,vec3(.60,.45,.49),far*.35);
 gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.93)),1.);}`;
function highlandsCompile(type,src){const s=highlandsGL.createShader(type);highlandsGL.shaderSource(s,src);highlandsGL.compileShader(s);if(!highlandsGL.getShaderParameter(s,highlandsGL.COMPILE_STATUS))throw Error('Highlands shader: '+highlandsGL.getShaderInfoLog(s));return s;}
function highlandsLink(v,f){const p=highlandsGL.createProgram(),a=highlandsCompile(highlandsGL.VERTEX_SHADER,v),b=highlandsCompile(highlandsGL.FRAGMENT_SHADER,f);highlandsGL.attachShader(p,a);highlandsGL.attachShader(p,b);highlandsGL.linkProgram(p);highlandsGL.deleteShader(a);highlandsGL.deleteShader(b);if(!highlandsGL.getProgramParameter(p,highlandsGL.LINK_STATUS))throw Error('Highlands link: '+highlandsGL.getProgramInfoLog(p));return p;}
function highlandsTri(out,a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,nn=n.map(q=>q/l);for(const p of [a,b,c])out.push(...p,...nn);}
function highlandsQuad(out,a,b,c,d){highlandsTri(out,a,b,c);highlandsTri(out,b,d,c);}
function highlandsHeight(x,z){
 const pass=x-4.4*Math.sin(z*.036)+1.8*Math.sin(z*.089);
 const ridge=Math.pow(Math.max(0.,Math.abs(pass)-9.)/39.,1.45)*17.2;
 const long=2.7*Math.sin(z*.027+x*.025)+1.5*Math.sin(z*.084-x*.042);
 const erosion=.73*Math.sin(x*.41+z*.10)*Math.cos(z*.15-x*.13)+.40*Math.sin(z*.28+x*.25);
 const plateau=Math.max(0.,Math.sin(x*.041+z*.012))**2*3.2;
 return -3.0+ridge+long*.32+erosion+plateau*(Math.abs(x)>16?1:.18)+Math.max(0.,z-75)*.036;
}
function highlandsGround(){const o=[],nx=116,nz=122;for(let i=0;i<nz;i++)for(let j=0;j<nx;j++){const x0=-60+120*j/nx,x1=-60+120*(j+1)/nx,z0=0+157*i/nz,z1=0+157*(i+1)/nz;highlandsQuad(o,[x0,highlandsHeight(x0,z0),z0],[x1,highlandsHeight(x1,z0),z0],[x0,highlandsHeight(x0,z1),z1],[x1,highlandsHeight(x1,z1),z1]);}return new Float32Array(o);}
function highlandsStones(){const o=[];for(let k=0;k<28;k++){
 const side=k%2?-1:1,z=8+(k*8.91)%139,x=side*(11.5+(k*5.73)%31),radius=1.35+(k%5)*.49;
 const y=highlandsHeight(x,z),height=.68+(k%7)*.43;
 const ring=(r,a,alt)=>[x+Math.cos(a)*r*(1+.12*Math.sin(k*1.71+a*3.)),y+alt,z+Math.sin(a)*r*(.72+.12*Math.cos(k+a*2.))];
 const sides=7;for(let i=0;i<sides;i++){let a=i*Math.PI*2/sides,b=(i+1)*Math.PI*2/sides;highlandsQuad(o,ring(radius,a,0),ring(radius,b,0),ring(radius*.80,a,height),ring(radius*.80,b,height));highlandsTri(o,ring(radius*.80,a,height),ring(radius*.80,b,height),[x,y+height+.17,z]);}
}return new Float32Array(o);}
function highlandsDistantRidges(){const o=[];for(let layer=0;layer<3;layer++){
 const z=110+layer*20,base=-.7+layer*.85;
 for(let j=0;j<75;j++){const x0=-78+156*j/75,x1=-78+156*(j+1)/75;
 const y=x=>base+6.5*Math.sin(x*.037+layer*1.2)+2.3*Math.sin(x*.104+layer*.61)+1.2*Math.sin(x*.21+layer*2.7);
 highlandsQuad(o,[x0,base-17,z],[x1,base-17,z],[x0,y(x0),z],[x1,y(x1),z]);
 }
}return new Float32Array(o);}
function setupHighlandsWorld(){if(highlandsGL)return;highlandsGL=highlandsCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!highlandsGL)throw Error('Quiet Highlands WebGL unavailable');
 highlandsProgram=highlandsLink(highlandsVertex,highlandsFragment);highlandsSkyProgram=highlandsLink(highlandsSkyVertex,highlandsSkyFragment);
 for(const n of ['aPosition','aNormal'])highlandsLoc[n]=highlandsGL.getAttribLocation(highlandsProgram,n);for(const n of ['uViewport','uTime','uKind'])highlandsLoc[n]=highlandsGL.getUniformLocation(highlandsProgram,n);
 highlandsSkyLoc.aXY=highlandsGL.getAttribLocation(highlandsSkyProgram,'aXY');for(const n of ['uAspect','uTime'])highlandsSkyLoc[n]=highlandsGL.getUniformLocation(highlandsSkyProgram,n);
 const upload=data=>{const b=highlandsGL.createBuffer();highlandsGL.bindBuffer(highlandsGL.ARRAY_BUFFER,b);highlandsGL.bufferData(highlandsGL.ARRAY_BUFFER,data,highlandsGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 highlandsMeshes.ground=upload(highlandsGround());highlandsMeshes.stones=upload(highlandsStones());highlandsMeshes.ridges=upload(highlandsDistantRidges());
 highlandsSkyBuffer=highlandsGL.createBuffer();highlandsGL.bindBuffer(highlandsGL.ARRAY_BUFFER,highlandsSkyBuffer);highlandsGL.bufferData(highlandsGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),highlandsGL.STATIC_DRAW);highlandsGL.enable(highlandsGL.DEPTH_TEST);highlandsGL.clearColor(.46,.35,.42,1.);}
function drawHighlandsWorld(t){if(!highlandsGL)return;const r=highlandsCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
 if(highlandsCanvas.width!==w||highlandsCanvas.height!==h){highlandsCanvas.width=w;highlandsCanvas.height=h;}
 highlandsGL.viewport(0,0,w,h);highlandsGL.clear(highlandsGL.COLOR_BUFFER_BIT|highlandsGL.DEPTH_BUFFER_BIT);
 highlandsGL.disable(highlandsGL.DEPTH_TEST);highlandsGL.useProgram(highlandsSkyProgram);highlandsGL.bindBuffer(highlandsGL.ARRAY_BUFFER,highlandsSkyBuffer);highlandsGL.vertexAttribPointer(highlandsSkyLoc.aXY,2,highlandsGL.FLOAT,false,0,0);highlandsGL.enableVertexAttribArray(highlandsSkyLoc.aXY);highlandsGL.uniform1f(highlandsSkyLoc.uTime,t);highlandsGL.uniform1f(highlandsSkyLoc.uAspect,w/h);highlandsGL.drawArrays(highlandsGL.TRIANGLES,0,3);
 highlandsGL.enable(highlandsGL.DEPTH_TEST);highlandsGL.depthFunc(highlandsGL.LEQUAL);highlandsGL.useProgram(highlandsProgram);highlandsGL.uniform2f(highlandsLoc.uViewport,w/h,1);highlandsGL.uniform1f(highlandsLoc.uTime,t);
 const draw=(mesh,k)=>{highlandsGL.bindBuffer(highlandsGL.ARRAY_BUFFER,mesh.buffer);highlandsGL.vertexAttribPointer(highlandsLoc.aPosition,3,highlandsGL.FLOAT,false,24,0);highlandsGL.enableVertexAttribArray(highlandsLoc.aPosition);highlandsGL.vertexAttribPointer(highlandsLoc.aNormal,3,highlandsGL.FLOAT,false,24,12);highlandsGL.enableVertexAttribArray(highlandsLoc.aNormal);highlandsGL.uniform1f(highlandsLoc.uKind,k);highlandsGL.drawArrays(highlandsGL.TRIANGLES,0,mesh.count);};
 draw(highlandsMeshes.ridges,2);draw(highlandsMeshes.ground,0);draw(highlandsMeshes.stones,1);
}

/* WORLD 09 — PURITY → FREE WILL: The Opal Passage.
 * Mineral spires, open faceted arch, drifting opalescent dusk and luminous path.
 * Explicit physical geometry; not a recolored world, no shared kernel mutation.
 */
let opalGL=null,opalProgram=null,opalSkyProgram=null,opalMeshes={},opalSkyBuffer=null,opalLoc={},opalSkyLoc={};
const opalCanvas=document.querySelector('#opal-world-canvas');
const opalVertex=`precision highp float;
attribute vec3 aPosition,aNormal;uniform vec2 uViewport;uniform float uTime,uKind;
varying vec3 vPos,vNormal;varying float vFog;
void main(){vec3 p=aPosition;vec3 eye=p-vec3(0.,4.5,-8.);
 float depth=max(.7,eye.z);
 gl_Position=vec4(eye.x*1.74/uViewport.x,(eye.y+eye.z*.022)*1.74,eye.z*.997-.30,depth);
 vPos=p;vNormal=aNormal;vFog=depth;}`;
const opalFragment=`precision highp float;
uniform float uTime,uKind;varying vec3 vPos,vNormal;varying float vFog;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec3 n=normalize(vNormal);vec3 sun=normalize(vec3(-.50,.82,-.32));float lam=.28+.74*max(0.,dot(n,sun));
float sed=noise2(vPos.xz*.12)*.26+noise2(vPos.xz*.52)*.05;
float spec=pow(max(0.,dot(reflect(-sun,n),normalize(vec3(0.,.28,-1.)))),18.);
float pr=sin(vPos.x*.08+vPos.z*.063+uTime*.012)*.5+.5;
vec3 c;
if(uKind<.5){c=mix(vec3(.035,.14,.23),vec3(.23,.47,.52),clamp(.36+.48*lam+sed,0.,1.));c+=vec3(.12,.10,.15)*pr*.19;}
else if(uKind<1.5){float hue=.5+.5*sin(vPos.y*.38+vPos.x*.37+vPos.z*.16);c=mix(vec3(.14,.53,.68),vec3(.78,.76,.88),hue);c*=.60+.61*lam;c+=vec3(.45,.62,.74)*spec*.32;}
else if(uKind<2.5){c=mix(vec3(.19,.44,.64),vec3(.94,.95,.98),lam*.73+.26);c+=vec3(.18,.44,.47)*spec*.55;}
else if(uKind<3.5){float pulse=.75+.25*sin(uTime*.65+vPos.z*.20);c=vec3(.17,.75,.82)*pulse+vec3(.10,.11,.16);c+=vec3(.35,.25,.28)*spec*.31;}
else {c=mix(vec3(.12,.21,.35),vec3(.54,.68,.80),lam*.72+sed);}
float fog=clamp((vFog-28.)/120.,0.,.8);c=mix(c,vec3(.17,.38,.51),fog*.58);
gl_FragColor=vec4(pow(max(c,vec3(.001)),vec3(.92)),1.);}`;
const opalSkyVertex=`precision mediump float;attribute vec2 aXY;varying vec2 vUv;void main(){vUv=aXY*.5+.5;gl_Position=vec4(aXY,0.,1.);}`;
const opalSkyFragment=`precision highp float;uniform float uTime,uAspect;varying vec2 vUv;
float hash2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash2(i),hash2(i+vec2(1.,0.)),f.x),mix(hash2(i+vec2(0.,1.)),hash2(i+vec2(1.,1.)),f.x),f.y);}
void main(){vec2 uv=vUv;vec3 sky=mix(vec3(.16,.45,.58),vec3(.014,.045,.13),smoothstep(.13,.97,uv.y));
float glow=exp(-length((uv-vec2(.71,.49))*vec2(uAspect*.75,1.))*10.);
sky+=vec3(.31,.34,.37)*glow*.58;
float veil=noise2(uv*vec2(6.5,12.)+vec2(uTime*.003,0.));
float aurora=smoothstep(.48,.74,veil)*smoothstep(.29,.65,uv.y)*(1.-smoothstep(.86,1.,uv.y));
sky=mix(sky,vec3(.23,.51,.56),aurora*.31);
float haze=exp(-pow((uv.y-.42)*13.5,2.));sky+=vec3(.12,.22,.23)*haze*.45;
float star=step(.9986,hash2(floor(uv*vec2(360.,240.))))*smoothstep(.36,.78,uv.y);
sky+=vec3(star)*.43;
gl_FragColor=vec4(pow(max(sky,vec3(.001)),vec3(.92)),1.);}`;
function opalCompile(type,source){const sh=opalGL.createShader(type);opalGL.shaderSource(sh,source);opalGL.compileShader(sh);if(!opalGL.getShaderParameter(sh,opalGL.COMPILE_STATUS))throw Error('Opal shader: '+opalGL.getShaderInfoLog(sh));return sh;}
function opalLink(v,f){const p=opalGL.createProgram(),a=opalCompile(opalGL.VERTEX_SHADER,v),b=opalCompile(opalGL.FRAGMENT_SHADER,f);opalGL.attachShader(p,a);opalGL.attachShader(p,b);opalGL.linkProgram(p);opalGL.deleteShader(a);opalGL.deleteShader(b);if(!opalGL.getProgramParameter(p,opalGL.LINK_STATUS))throw Error('Opal link: '+opalGL.getProgramInfoLog(p));return p;}
function opalTri(out,a,b,c){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1,nn=n.map(x=>x/l);for(const p of [a,b,c])out.push(...p,...nn);}
function opalQuad(out,a,b,c,d){opalTri(out,a,b,c);opalTri(out,b,d,c);}
function opalHeight(x,z){let path=x-3.*Math.sin(z*.041);let bank=Math.pow(Math.max(0.,Math.abs(path)-8.)/48.,1.5)*6.8;return -2.7+bank+.75*Math.sin(z*.05+x*.039)+.25*Math.sin(x*.38+z*.17)*Math.sin(z*.20);}
function opalGround(){const o=[],nx=100,nz=108;for(let i=0;i<nz;i++)for(let j=0;j<nx;j++){const x0=-55+110*j/nx,x1=-55+110*(j+1)/nx,z0=0+145*i/nz,z1=0+145*(i+1)/nz;opalQuad(o,[x0,opalHeight(x0,z0),z0],[x1,opalHeight(x1,z0),z0],[x0,opalHeight(x0,z1),z1],[x1,opalHeight(x1,z1),z1]);}return new Float32Array(o);}
// Eight-sided elongated diamonds: each surface triangulated with different normals.
function opalSpire(o,x,z,rx,height,seed){const y=opalHeight(x,z),n=7;
 const base=i=>{const a=i*2*Math.PI/n;return[x+rx*Math.cos(a),y,z+rx*.70*Math.sin(a)];};
 const mid=i=>{const a=i*2*Math.PI/n;return[x+rx*.54*Math.cos(a)+.30*Math.sin(seed),y+height*.46,z+rx*.44*Math.sin(a)];};
 const tip=[x+.7*Math.sin(seed*2.1),y+height,z+.53*Math.cos(seed*1.7)];
 for(let i=0;i<n;i++){const b=(i+1)%n;opalQuad(o,base(i),base(b),mid(i),mid(b));opalTri(o,mid(i),mid(b),tip);}
}
function opalSpires(){const o=[];for(let k=0;k<54;k++){let z=9+((k*11.3)%124),side=k%2?-1:1,x=side*(12+(k*7.31)%34)+2*Math.sin(z*.035),rx=.65+(k%6)*.28,h=4.4+(k%9)*1.7;opalSpire(o,x,z,rx,h,k*1.37);}return new Float32Array(o);}
// Explicitly hollow faceted arch, a ring not a filled wall.
function opalGateway(){const o=[];const segments=27,zc=48,yc=opalHeight(0,zc)+2.7,rx=16.0,ry=22.0;
 const at=(theta,r,z)=>[Math.cos(theta)*rx*r,yc+Math.sin(theta)*ry*r,z];
 for(let i=0;i<segments;i++){const t0=i*Math.PI/segments,t1=(i+1)*Math.PI/segments;
  for(let k=0;k<2;k++){const depth=zc+(k?1.7:-1.7);opalQuad(o,at(t0,.82,depth),at(t0,1.03,depth),at(t1,.82,depth),at(t1,1.03,depth));}
  opalQuad(o,at(t0,.82,zc-1.7),at(t0,.82,zc+1.7),at(t1,.82,zc-1.7),at(t1,.82,zc+1.7));
  opalQuad(o,at(t0,1.03,zc-1.7),at(t0,1.03,zc+1.7),at(t1,1.03,zc-1.7),at(t1,1.03,zc+1.7));
 }
 for(const x of [-rx,rx]){const yy=opalHeight(x,zc);opalSpire(o,x,zc,2.0,7.1,Math.abs(x)*.29);}
 return new Float32Array(o);}
function opalPath(){const o=[];for(let k=0;k<260;k++){const z0=k*.55,z1=(k+1)*.55;const center=z=>3.*Math.sin(z*.041);const y=(x,z)=>opalHeight(x,z)+.09;const x0=center(z0),x1=center(z1);const w=1.6+.4*Math.sin(k*.08);
 opalQuad(o,[x0-w,y(x0-w,z0),z0],[x0+w,y(x0+w,z0),z0],[x1-w,y(x1-w,z1),z1],[x1+w,y(x1+w,z1),z1]);}return new Float32Array(o);}
function opalDistant(){const o=[];for(let layer=0;layer<3;layer++){const z=106+layer*17,base=-3+layer*1.1;for(let j=0;j<86;j++){const x0=-79+158*j/86,x1=-79+158*(j+1)/86;const y=x=>base+11*Math.pow(Math.abs(Math.sin(x*.044+layer*.37)),3.)+4*Math.sin(x*.095+layer*1.7);opalQuad(o,[x0,base-14,z],[x1,base-14,z],[x0,y(x0),z],[x1,y(x1),z]);}}return new Float32Array(o);}
function setupOpalWorld(){if(opalGL)return;opalGL=opalCanvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});if(!opalGL)throw Error('Opal Passage WebGL unavailable');
 opalProgram=opalLink(opalVertex,opalFragment);opalSkyProgram=opalLink(opalSkyVertex,opalSkyFragment);
 for(const n of ['aPosition','aNormal'])opalLoc[n]=opalGL.getAttribLocation(opalProgram,n);for(const n of ['uViewport','uTime','uKind'])opalLoc[n]=opalGL.getUniformLocation(opalProgram,n);
 opalSkyLoc.aXY=opalGL.getAttribLocation(opalSkyProgram,'aXY');for(const n of ['uAspect','uTime'])opalSkyLoc[n]=opalGL.getUniformLocation(opalSkyProgram,n);
 const upload=data=>{const b=opalGL.createBuffer();opalGL.bindBuffer(opalGL.ARRAY_BUFFER,b);opalGL.bufferData(opalGL.ARRAY_BUFFER,data,opalGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 opalMeshes.ground=upload(opalGround());opalMeshes.spires=upload(opalSpires());opalMeshes.gateway=upload(opalGateway());opalMeshes.path=upload(opalPath());opalMeshes.distant=upload(opalDistant());
 opalSkyBuffer=opalGL.createBuffer();opalGL.bindBuffer(opalGL.ARRAY_BUFFER,opalSkyBuffer);opalGL.bufferData(opalGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),opalGL.STATIC_DRAW);opalGL.enable(opalGL.DEPTH_TEST);opalGL.clearColor(.015,.10,.19,1);}
function drawOpalWorld(t){if(!opalGL)return;const r=opalCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
 if(opalCanvas.width!==w||opalCanvas.height!==h){opalCanvas.width=w;opalCanvas.height=h;}
 opalGL.viewport(0,0,w,h);opalGL.clear(opalGL.COLOR_BUFFER_BIT|opalGL.DEPTH_BUFFER_BIT);
 opalGL.disable(opalGL.DEPTH_TEST);opalGL.useProgram(opalSkyProgram);opalGL.bindBuffer(opalGL.ARRAY_BUFFER,opalSkyBuffer);opalGL.vertexAttribPointer(opalSkyLoc.aXY,2,opalGL.FLOAT,false,0,0);opalGL.enableVertexAttribArray(opalSkyLoc.aXY);opalGL.uniform1f(opalSkyLoc.uTime,t);opalGL.uniform1f(opalSkyLoc.uAspect,w/h);opalGL.drawArrays(opalGL.TRIANGLES,0,3);
 opalGL.enable(opalGL.DEPTH_TEST);opalGL.depthFunc(opalGL.LEQUAL);opalGL.useProgram(opalProgram);opalGL.uniform2f(opalLoc.uViewport,w/h,1);opalGL.uniform1f(opalLoc.uTime,t);
 const draw=(mesh,k)=>{opalGL.bindBuffer(opalGL.ARRAY_BUFFER,mesh.buffer);opalGL.vertexAttribPointer(opalLoc.aPosition,3,opalGL.FLOAT,false,24,0);opalGL.enableVertexAttribArray(opalLoc.aPosition);opalGL.vertexAttribPointer(opalLoc.aNormal,3,opalGL.FLOAT,false,24,12);opalGL.enableVertexAttribArray(opalLoc.aNormal);opalGL.uniform1f(opalLoc.uKind,k);opalGL.drawArrays(opalGL.TRIANGLES,0,mesh.count);};
 draw(opalMeshes.distant,4);draw(opalMeshes.ground,0);draw(opalMeshes.path,3);draw(opalMeshes.gateway,2);draw(opalMeshes.spires,1);
}

const vertexSource=`attribute vec3 aPosition;attribute vec3 aNormal;attribute float aFacet;
uniform vec3 uCenter,uOffset;uniform float uRadius,uZoom,uCameraZ;uniform vec2 uView;
varying vec3 vWorld,vNormal,vLocal;varying float vFacet;
void main(){vFacet=abs(aFacet);vec3 world=aPosition*uRadius+uCenter;vec3 view=world-uOffset;float perspective=uCameraZ/max(.48,uCameraZ-view.z);gl_Position=vec4(view.xy/uView*uZoom*perspective,-view.z/20.0,1.0);vWorld=world;vNormal=aNormal;vLocal=aPosition;}`;
const fragmentSource=`precision mediump float;
varying vec3 vWorld,vNormal,vLocal;varying float vFacet;
uniform vec3 uColor;
uniform float uHeart,uSelected,uWorld,uAtmosphere,uTime;
float hash3(vec3 p) {
 p=fract(p*.1031);
 p+=dot(p,p.yzx+33.33);
 return fract((p.x+p.y)*p.z);
}
float noise3(vec3 p) {
 vec3 i=floor(p), f=fract(p);f=f*f*(3.0-2.0*f);
 float a=mix(hash3(i),hash3(i+vec3(1.,0.,0.)),f.x);
 float b=mix(hash3(i+vec3(0.,1.,0.)),hash3(i+vec3(1.,1.,0.)),f.x);
 float c=mix(hash3(i+vec3(0.,0.,1.)),hash3(i+vec3(1.,0.,1.)),f.x);
 float d=mix(hash3(i+vec3(0.,1.,1.)),hash3(i+vec3(1.,1.,1.)),f.x);
 return mix(mix(a,b,f.y),mix(c,d,f.y),f.z);
}
float fbm(vec3 p) {
 float r=0.,amp=.55;
 for(int k=0;k<3;k++){r+=amp*noise3(p);p=p*2.07+vec3(13.4,7.1,19.2);amp*=.5;}
 return r;
}
void main() {
 vec3 n=normalize(vNormal);
 vec3 light=normalize(-vWorld+vec3(-.2,.25,.15));
 float diffuse=max(0.,dot(n,light));
 float rim=pow(1.-max(0.,n.z),2.8);
 float rough=.65, glow=0., grain=0., metal=.05;
 vec3 p=normalize(vLocal);
 vec3 material=uColor;
 if(uAtmosphere>.5){
   float fresnel=pow(1.0-max(0.0,dot(n,vec3(0.,0.,1.))),2.8);
   float cloud=fbm(p*7.5+vec3(uTime*.025,-uTime*.017,0.));
   float haze=smoothstep(.43,.78,cloud);
   vec3 air=mix(vec3(.11,.56,.66),vec3(.67,.92,.91),haze);
   gl_FragColor=vec4(air*(.55+1.5*fresnel),clamp(.09+.72*fresnel+.16*haze,0.,.88));
   return;
 }
 if(uHeart>.5) {
    vec3 eye=normalize(vec3(-.22,.09,1.));
    vec3 key=normalize(vec3(-.73,.76,1.1));
    vec3 amber=normalize(vec3(.8,-.34,1.));
    float diffuseKey=max(0.,dot(n,key));
    float diffuseAmber=max(0.,dot(n,amber));
    float fresnel=pow(1.-abs(dot(n,eye)),2.4);
    float pulse=.85+.15*sin(uTime*.22);
    float spectrum=fract(sin(vFacet*187.47)*43758.5453);
    float mineral=fbm(vLocal*15.+vec3(0.,0.,uTime*.01));
    vec3 deep=vec3(.018,.058,.115);
    vec3 ice=vec3(.23,.72,.84);
    vec3 pearl=vec3(.89,.95,.96);
    vec3 glass=mix(deep,ice,clamp(.19+.45*diffuseKey+.34*spectrum,0.,1.));
    glass=mix(glass,pearl,clamp(diffuseKey*diffuseKey*.48 + mineral*.16,0.,.65));
    glass+=vec3(.88,.58,.25)*pow(diffuseAmber,3.6)*(.20+.42*spectrum);
    float streak=pow(max(0.,dot(reflect(-key,n),eye)),35.);
    glass+=vec3(.96,1.,1.)*(streak*1.25+fresnel*.48);
    // No procedural bands: opaque by design, visually deep through multi-axis facet illumination.
    gl_FragColor=vec4(glass*pulse,1.);return;
 } else {
   float a=fbm(p*4.4+uWorld*3.11);
   float b=fbm(p*11.3+vec3(4.3,7.7,2.9)*uWorld);
   float c=fbm(p*24.7+vec3(10.1,3.3,5.9)*uWorld);
   if(uWorld<.5) { // Gratitude: dawn archipelago, deep ocean and gold island chains
     float land=smoothstep(.45,.61,a*.78+b*.22);
     float lagoon=smoothstep(.32,.48,a*.78+b*.22);
     material=mix(vec3(.026,.19,.28),vec3(.12,.46,.48),lagoon*.65);
     material=mix(material,vec3(.80,.55,.28),land);
     material+=vec3(.27,.16,.05)*smoothstep(.72,.91,c)*land;
     glow=smoothstep(.81,.96,b*.75+c*.33)*.055;rough=.42;
   } else if(uWorld<1.5) { // Generosity: geographic living network across cloud-shelf valleys
     float shelf=fbm(p*2.8+vec3(a*.45,b*.3,.1));
     float basin=smoothstep(.39,.64,shelf*.78+a*.24);
     material=mix(vec3(.105,.052,.19),vec3(.66,.24,.47),basin);
     float lon=atan(p.z,p.x),lat=asin(clamp(p.y,-1.,1.));
     float threadA=abs(sin(lon*2.35+sin(lat*3.6)*.7)-lat*.72);
     float threadB=abs(sin(lon*4.4-lat*2.1+sin(lon*1.5))*.40-lat);
     float branching=1.-smoothstep(.045,.11,min(threadA,threadB));
     float pulse=.65+.35*sin(uTime*.42+lon*4.0+lat*6.0);
     material=mix(material,vec3(.99,.41,.59),branching*(.47+.2*pulse));
     glow=branching*.19;rough=.36;
   } else if(uWorld<2.5) { // Dependability: coherent terraced plateaus and shadowed escarpments
     float fracture=fbm(p*3.1+vec3(1.9,-.8,2.4));
     float region=smoothstep(.34,.59,a*.63+fracture*.37);
     float elev=region*(.37+.64*fbm(p*8.1+vec3(.4,1.2,.8)));
     float terrace=floor(elev*6.4)/6.4;
     float escarpment=1.-smoothstep(.025,.09,abs(fract(elev*6.4)-.50));
     material=mix(vec3(.035,.10,.16),vec3(.32,.52,.64)*(.62+terrace*.55),region);
     material*=.79+.28*b;
     material-=vec3(.035,.047,.055)*escarpment*region;
     rough=.87;
   } else if(uWorld<3.5) { // Accountability: dark copper strata and branching asymmetric canyons
     float basin=fbm(p*3.2+vec3(.8,-1.2,2.5));
     float fissure=abs(sin(p.x*4.7+p.y*2.5+fbm(p*6.8)*3.7));
     float fault=(1.-smoothstep(.028,.16,fissure))*(.3+.7*basin);
     material=mix(vec3(.08,.039,.043),vec3(.53,.24,.13),smoothstep(.25,.81,basin));
     material+=vec3(.30,.075,.017)*fault*.4;
     rough=.91;metal=.06;
   } else if(uWorld<4.5) { // Forgiveness: sea glass and soft tidal layers
     float coast=fbm(p*7.8+vec3(a*.35,0.,b*.38));
     float deep=smoothstep(.32,.67,coast*.75+a*.32);
     float cap=smoothstep(.58,.76,fbm(p*16.0+vec3(0.,uTime*.02,0.)));
     material=mix(vec3(.025,.13,.19),vec3(.12,.61,.62),deep);
     material=mix(material,vec3(.72,.92,.82),cap*.73);
     rough=.27;glow=.055;
   } else if(uWorld<5.5) { // Self-control: opposed but continuous basin and ridge geology
     float waveline=p.x+.35*sin(p.y*3.8+sin(p.z*2.7))+.15*sin(p.z*6.2);
     float biome=smoothstep(-.26,.29,waveline);
     float basin=fbm(p*4.8+vec3(a*.4,0.,b*.6));
     float plateau=fbm(p*6.3+vec3(2.5,1.9,-3.));
     float shelf=pow(smoothstep(.34,.69,plateau),1.6);
     vec3 cold=mix(vec3(.055,.14,.27),vec3(.27,.55,.67),clamp(.12+.9*basin,0.,1.));
     vec3 warm=mix(vec3(.20,.09,.28),vec3(.73,.38,.53),clamp(.15+.7*shelf+.15*a,0.,1.));
     material=mix(cold,warm,biome);
     float join=1.-smoothstep(.025,.15,abs(waveline));
     material=mix(material,vec3(.33,.36,.47),join*.52);
     glow=join*.06;metal=.08;rough=.72;
   } else if(uWorld<6.5) { // Patience: old-growth roots, branching canopies and age rings
     vec3 q=p+vec3(.20*sin(p.y*9.+b*2.2),.14*sin(p.z*8.+a*1.6),.16*sin(p.x*8.));
     float age=fbm(q*3.2+vec3(b*.24,a*.18,0.));
     float root=abs(sin(q.x*10.+q.y*4.8+age*5.6)*sin(q.z*6.5+age*3.9));
     float canopy=smoothstep(.36,.71,fbm(q*11.7+vec3(0.,b*.7,a*.4)));
     float bark=1.-smoothstep(.07,.27,root);
     material=mix(vec3(.025,.105,.074),vec3(.23,.46,.21),canopy*.75+age*.25);
     material=mix(material,vec3(.22,.16,.076),bark*.48);
     material+=vec3(.15,.20,.035)*pow(canopy,2.)*.21;
     rough=.86;metal=.015;
   } else if(uWorld<7.5) { // Humility: spatially weathered, nonconcentric eroded uplands
     vec3 q=p+vec3(.12*sin(p.y*9.+b*3.2),.15*sin(p.z*7.6+a*3.4),.12*sin(p.x*8.9));
     float longRidge=fbm(vec3(q.x*2.3,q.y*1.4,q.z*3.1));
     float erosion=fbm(q*12.5+vec3(b*.55,a*.28,0.));
     float exposed=smoothstep(.34,.78,longRidge*.70+erosion*.30);
     float shadow=smoothstep(.27,.73,fbm(q*5.7));
     material=mix(vec3(.18,.13,.20),vec3(.61,.44,.43),exposed*.72+shadow*.24);
     material+=vec3(.14,.12,.12)*pow(erosion,2.)*.16;
     rough=.91;metal=.015;
   } else { // Purity: luminous opaline ice/mineral mosaic
     vec3 crystal=floor(p*10.2+vec3(a*.35));
     float facets=hash3(crystal);
     material=mix(vec3(.44,.58,.66),vec3(.90,.97,1.),clamp(facets*.63+a*.46,0.,1.));
     metal=.24;rough=.24;glow=.075;
   }
 }
 float halfLambert=.22+.83*diffuse;
 // World 05 only: camera-side sea-glass bounce reveals the near hemisphere
 // while preserving the opposing night side and other eight world materials.
 float peaceNearFace=(uHeart<.5&&uWorld>3.5&&uWorld<4.5&&uAtmosphere<.5)?1.:0.;
 float peaceViewFill=max(0.,dot(n,normalize(vec3(-.28,.38,1.))));
 halfLambert=max(halfLambert,peaceNearFace*(.30+.38*peaceViewFill));
 float spec=pow(max(0.,dot(reflect(-light,n),vec3(0.,0.,1.))),mix(8.,44.,1.-rough));
 vec3 shaded=material*halfLambert;
 if(peaceNearFace>.5){
   // Peace only: offshore topography and irregular pale mineral shelves.
   float formation=noise3(p*5.1+vec3(4.2,1.6,7.3));
   float fine=noise3(p*21.4+vec3(2.4,6.2,1.9));
   float shelf=smoothstep(.27,.72,formation*.78+fine*.22);
   float coast=1.-smoothstep(.025,.13,abs(formation-.54));
   vec3 depth=mix(vec3(.08,.24,.31),vec3(.30,.65,.62),shelf);
   depth=mix(depth,vec3(.68,.86,.78),coast*(.26+.24*fine));
   float fill=.65+.30*max(0.,dot(n,normalize(vec3(-.36,.7,.55))));
   shaded=mix(shaded,max(shaded,depth*fill),.91);
   float fresnel=pow(1.-abs(n.z),2.4);
   shaded+=vec3(.025,.11,.14)*fresnel*.45;
 }
 shaded+=mix(vec3(.22,.14,.08),vec3(.91,.86,.77),metal)*spec*(.08+.42*(1.-rough));
 shaded+=material*rim*(.17+glow);
 shaded+=material*glow;
 if(uSelected>.5)shaded+=material*.14+vec3(.07,.07,.05);
 gl_FragColor=vec4(shaded,1.);
}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
let loc={};
// Depth-based starfield is an actual WebGL point cloud, not a CSS wallpaper.
let starProgram=null,starBuffer=null,starCount=0,starLocation={};
const starVertexSource=`attribute vec3 aStar;attribute float aSeed;
uniform float uClock,uPixelRatio;
varying float vSeed;
void main(){
 float depth=.38+aStar.z*.62;
 vec2 drift=vec2(sin(uClock*.036+depth*3.4),cos(uClock*.027+depth*2.1))*depth*.009;
 gl_Position=vec4(aStar.xy+drift,.94,1.);
 gl_PointSize=min(6.6,(1.+depth*2.0)*uPixelRatio*(.91+.09*sin(uClock*.46+aSeed*24.)));
 vSeed=aSeed;
}`;
const starFragmentSource=`precision mediump float;
varying float vSeed;
void main(){
 float d=length(gl_PointCoord-.5);
 float a=(1.-smoothstep(.07,.5,d))*(.12+.46*vSeed);
 vec3 c=mix(vec3(.45,.69,.87),vec3(1.,.81,.55),smoothstep(.72,.99,vSeed));
 gl_FragColor=vec4(c,a);
}`;
function setupStars(){
 starProgram=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,starVertexSource),fs=shader(gl.FRAGMENT_SHADER,starFragmentSource);
 gl.attachShader(starProgram,vs);gl.attachShader(starProgram,fs);gl.linkProgram(starProgram);
 gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(starProgram,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(starProgram));
 for(const name of ['aStar','aSeed'])starLocation[name]=gl.getAttribLocation(starProgram,name);
 for(const name of ['uClock','uPixelRatio'])starLocation[name]=gl.getUniformLocation(starProgram,name);
 let seed=2970;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const points=[];
 for(let i=0;i<1620;i++){
   let x=random()*2-1,y=random()*2-1,z=random(),lum=random();
   if(i>=800){
     // A tilted, volumetric interstellar dust stream, not an opaque background photograph.
     const distance=random()*2.-1.;
     x=distance*1.3+.20*(random()-.5);
     y=-.14-distance*.34 + .42*(random()+random()-1);
     z=.08+random()*.53;lum=.22+random()*.42;
   }
   points.push(x,y,z,lum);
 }
 starCount=points.length/4;starBuffer=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,starBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
}
function drawStars(){
 gl.useProgram(starProgram);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffer);
 gl.vertexAttribPointer(starLocation.aStar,3,gl.FLOAT,false,16,0);gl.enableVertexAttribArray(starLocation.aStar);
 gl.vertexAttribPointer(starLocation.aSeed,1,gl.FLOAT,false,16,12);gl.enableVertexAttribArray(starLocation.aSeed);
 gl.uniform1f(starLocation.uClock,reduced?0:universeClock);gl.uniform1f(starLocation.uPixelRatio,Math.min(devicePixelRatio||1,2));
 gl.disable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
 gl.drawArrays(gl.POINTS,0,starCount);gl.disable(gl.BLEND);gl.enable(gl.DEPTH_TEST);
}
function setupGL(){
  gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
  program=gl.createProgram();const vs=shader(gl.VERTEX_SHADER,vertexSource),fs=shader(gl.FRAGMENT_SHADER,fragmentSource);gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  for(const name of ['aPosition','aNormal','aFacet'])loc[name]=gl.getAttribLocation(program,name);
  for(const name of ['uCenter','uOffset','uRadius','uZoom','uView','uColor','uHeart','uSelected','uWorld','uCameraZ','uAtmosphere','uTime'])loc[name]=gl.getUniformLocation(program,name);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);setupStars();
}
const ARRIVAL_CONSTELLATION=Object.freeze([
 [-1.35,.30,-3.4],[1.1,1.04,-2.0],[1.88,.29,-1.3],[1.62,-.67,-.4],
 [1.80,-1.53,-.25],[-1.26,-1.19,-2.1],[-2.1,-.78,-3.3],[-2.20,.07,-3.9],[-.81,1.12,-3.7]
]);
function basePosition(i){
 const b=ARRIVAL_CONSTELLATION[i];
 // Perspective-correct signed depth: nearer bodies are monumental, not equal-size orbit markers.
 const a=orbitPhase*(.22 + .05*(i%4));
 return [b[0]*Math.cos(a)-b[2]*Math.sin(a)*.06,b[1]+Math.sin(orbitPhase*.6+i*.95)*.033,b[2]+Math.sin(a)*b[0]*.045];
}
function project(center){const s=cameraZ/Math.max(.48,cameraZ-center[2]+offset[2]);return {x:width/2+(center[0]-offset[0])/viewWidth*zoom*s*width/2,y:height/2-(center[1]-offset[1])/viewHeight*zoom*s*height/2,scale:s*zoom*width/(2*viewWidth)};}
function radius(i){return [.26,.44,.34,.28,.94,.27,.31,.22,.23][i];}
function draw(mesh,center,r,c,isHeart,isSelected,worldIndex=-1,atmosphere=false){
  gl.bindBuffer(gl.ARRAY_BUFFER,mesh.buffer);gl.vertexAttribPointer(loc.aPosition,3,gl.FLOAT,false,28,0);gl.vertexAttribPointer(loc.aNormal,3,gl.FLOAT,false,28,12);gl.vertexAttribPointer(loc.aFacet,1,gl.FLOAT,false,28,24);gl.enableVertexAttribArray(loc.aPosition);gl.enableVertexAttribArray(loc.aNormal);gl.enableVertexAttribArray(loc.aFacet);
  gl.uniform3fv(loc.uCenter,center);gl.uniform1f(loc.uRadius,r);gl.uniform3fv(loc.uColor,c);gl.uniform1f(loc.uHeart,isHeart?1:0);gl.uniform1f(loc.uSelected,isSelected?1:0);gl.uniform1f(loc.uWorld,worldIndex);gl.uniform1f(loc.uAtmosphere,atmosphere?1:0);gl.drawArrays(gl.TRIANGLES,0,mesh.count);
}

function placeLabels(){
  const items=projected.map((p,i)=>{
    if(p.hidden)return null;
    const size=labelSizes[i]||{width:94,height:43};
    const side=(centers[i][0]>=0)?1:-1;
    return {i,x:Math.max(size.width/2+7,Math.min(width-size.width/2-7,p.x)),
      y:Math.max(size.height/2+7,Math.min(height-size.height/2-7,p.y+radius(i)*p.scale+10)),
      desiredY:p.y+radius(i)*p.scale+10,
      w:size.width,h:size.height,side};
  });
  for(let pass=0;pass<10;pass++){
    let moved=false;
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
      const a=items[i],b=items[j];if(!a||!b)continue;
      const ox=(a.w+b.w)/2+8-Math.abs(a.x-b.x);
      const oy=(a.h+b.h)/2+6-Math.abs(a.y-b.y);
      if(ox<=0||oy<=0)continue;
      const direction=a.y===b.y?(a.i<b.i?-1:1):Math.sign(a.y-b.y);
      const shift=Math.min(15,oy/2+1);
      a.y+=direction*shift;b.y-=direction*shift;
      a.x-=a.side*Math.min(3,ox*.06);b.x+=b.side*Math.min(3,ox*.06);
      moved=true;
    }
    for(const item of items){if(!item)continue;
      item.x=Math.max(item.w/2+7,Math.min(width-item.w/2-7,item.x));
      item.y=Math.max(item.h/2+7,Math.min(height-item.h/2-7,item.y));
    }
    if(!moved)break;
  }
  items.forEach((item,i)=>{
    if(!item)return;
    labels[i].style.transform="translate("+item.x.toFixed(2)+"px,"+item.y.toFixed(2)+"px) translate(-50%,-50%)";
  });
}

function render(time){
  raf=0;if(!ready||disposed)return;const dt=lastTime?Math.min(.05,(time-lastTime)/1000):1/60;lastTime=time;
  if(inertia){const elapsed=Math.min(inertia.durationMs,time-inertia.startedAt);quaternion=P.constellationReleaseQuaternionAt(inertia,elapsed);if(elapsed>=inertia.durationMs)inertia=null;}
  const orbitActive=orbitCanMove();
  if(orbitActive){orbitSpeed+=(ORBIT_RADIANS_PER_SECOND-orbitSpeed)*(1-Math.exp(-P.GESTURE.settleSpeed*dt));orbitPhase=(orbitPhase+orbitSpeed*dt)%(Math.PI*2);}else orbitSpeed=0;
  const settle=reduced?1:1-Math.exp(-P.GESTURE.settleSpeed*dt);
  const flightStep=reduced?1:Math.min(1,dt/.95);
  if(selected===0||selected===1||selected===2||selected===3||selected===4||selected===5){if(reduced)flight=flightTarget;else{const delta=flightTarget-flight;flight=Math.abs(delta)<.00001?flightTarget:Math.max(0,Math.min(1,flight+Math.sign(delta)*Math.min(Math.abs(delta),dt/3.4)));}}
  else flight+=(flightTarget-flight)*flightStep;
  if(Math.abs(flight-flightTarget)<.0006)flight=flightTarget;
  const smooth=flight*flight*(3-2*flight);
  cameraZ=9-4.6*smooth;
  if(!reduced&&sceneVisible)universeClock+=dt;
  if((selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)&&flight>.01){
    const focus=P.quaternionRotateVector(quaternion,basePosition(selected));
    targetOffset=[focus[0]*smooth-.18*smooth,focus[1]*smooth,focus[2]*smooth];
    targetZoom=1+2.6*smooth;
  }
  if(selected===8&&flight>.55){
    opalOverlay.classList.add('is-visible');opalOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    opalOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    opalOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawOpalWorld(reduced?0:universeClock);
  }else if(selected===8&&flight<=.55){opalOverlay.style.opacity='0';opalOverlay.style.pointerEvents='none';}
  if(selected===7&&flight>.55){
    highlandsOverlay.classList.add('is-visible');highlandsOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    highlandsOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    highlandsOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawHighlandsWorld(reduced?0:universeClock);
  }else if(selected===7&&flight<=.55){highlandsOverlay.style.opacity='0';highlandsOverlay.style.pointerEvents='none';}
  if(selected===6&&flight>.55){
    canopyOverlay.classList.add('is-visible');canopyOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    canopyOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    canopyOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawCanopyWorld(reduced?0:universeClock);
  }else if(selected===6&&flight<=.55){canopyOverlay.style.opacity='0';canopyOverlay.style.pointerEvents='none';}
  if(selected===5&&flight>.55){
    balanceOverlay.classList.add('is-visible');balanceOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    balanceOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    balanceOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawBalanceWorld(reduced?0:universeClock);
  }else if(selected===5&&flight<=.55){balanceOverlay.style.opacity='0';balanceOverlay.style.pointerEvents='none';}
  if(selected===4&&flight>.55){
    peaceOverlay.classList.add('is-visible');peaceOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    peaceOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    peaceOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawPeaceWorld(reduced?0:universeClock);
  }else if(selected===4&&flight<=.55){peaceOverlay.style.opacity='0';peaceOverlay.style.pointerEvents='none';}
  if(selected===3&&flight>.55){
    emberOverlay.classList.add('is-visible');emberOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    emberOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    emberOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawEmberWorld(reduced?0:universeClock);
  }else if(selected===3&&flight<=.55){emberOverlay.style.opacity='0';emberOverlay.style.pointerEvents='none';}
  if(selected===2&&flight>.55){
    stabilityOverlay.classList.add('is-visible');stabilityOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    stabilityOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    stabilityOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawStabilityWorld(reduced?0:universeClock);
  }else if(selected===2&&flight<=.55){stabilityOverlay.style.opacity='0';stabilityOverlay.style.pointerEvents='none';}
  if(selected===1&&flight>.55){
    loveOverlay.classList.add('is-visible');loveOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    loveOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    loveOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawLoveWorld(reduced?0:universeClock);
  }else if(selected===1&&flight<=.55){loveOverlay.style.opacity='0';loveOverlay.style.pointerEvents='none';}
  if(selected===0&&flight>.55){
    joyOverlay.classList.add('is-visible');joyOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    joyOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    joyOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawJoyWorld(reduced?0:universeClock);
  }else if(selected===0&&flight<=.55){joyOverlay.style.opacity='0';joyOverlay.style.pointerEvents='none';}
  if(selected===0&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';joyOverlay.classList.add('is-visible');joyOverlay.setAttribute('aria-hidden','false');joyOverlay.style.opacity='1';joyOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-joy');
    $('#scene-note').textContent='Gratitude → Joy · The Dawn Archipelago';status.textContent='Arrived at the world of Joy.';joyHud.focus({preventScroll:true});
  }
  if(selected===3&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';emberOverlay.classList.add('is-visible');emberOverlay.setAttribute('aria-hidden','false');emberOverlay.style.opacity='1';emberOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-ember');
    $('#scene-note').textContent='Accountability → Character · The Ember Canyons';status.textContent='Arrived at the world of Character.';emberHud.focus({preventScroll:true});
  }
  if(selected===2&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';stabilityOverlay.classList.add('is-visible');stabilityOverlay.setAttribute('aria-hidden','false');stabilityOverlay.style.opacity='1';stabilityOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-stability');
    $('#scene-note').textContent='Dependability → Stability · The Great Basalt Terraces';status.textContent='Arrived at the world of Stability.';stabilityHud.focus({preventScroll:true});
  }
  if(selected===1&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';loveOverlay.classList.add('is-visible');loveOverlay.setAttribute('aria-hidden','false');loveOverlay.style.opacity='1';loveOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-love');
    $('#scene-note').textContent='Generosity → Love · The Living Constellation';status.textContent='Arrived at the world of Love.';loveHud.focus({preventScroll:true});
  }
  if(selected===8&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';opalOverlay.classList.add('is-visible');opalOverlay.setAttribute('aria-hidden','false');opalOverlay.style.opacity='1';opalOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-opal');
    $('#scene-note').textContent='Purity → Free Will · The Opal Passage';status.textContent='Arrived at the world of Free Will.';opalHud.focus({preventScroll:true});
  }
  if(selected===7&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';highlandsOverlay.classList.add('is-visible');highlandsOverlay.setAttribute('aria-hidden','false');highlandsOverlay.style.opacity='1';highlandsOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-highlands');
    $('#scene-note').textContent='Humility → Dignity · The Quiet Highlands';status.textContent='Arrived at the world of Dignity.';highlandsHud.focus({preventScroll:true});
  }
  if(selected===6&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';canopyOverlay.classList.add('is-visible');canopyOverlay.setAttribute('aria-hidden','false');canopyOverlay.style.opacity='1';canopyOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-canopy');
    $('#scene-note').textContent='Patience → Structure · The Ancient Canopy';status.textContent='Arrived at the world of Structure.';canopyHud.focus({preventScroll:true});
  }
  if(selected===5&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';balanceOverlay.classList.add('is-visible');balanceOverlay.setAttribute('aria-hidden','false');balanceOverlay.style.opacity='1';balanceOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-balance');
    $('#scene-note').textContent='Self-Control → Balance · The Twin Equilibrium';status.textContent='Arrived at the world of Balance.';balanceHud.focus({preventScroll:true});
  }
  if(selected===4&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';peaceOverlay.classList.add('is-visible');peaceOverlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('universe-encounter','universe-peace');peaceOverlay.style.opacity='1';peaceOverlay.style.pointerEvents='auto';
    $('#scene-note').textContent='Forgiveness → Peace · The Quiet Ocean';status.textContent='Arrived at the world of Peace.';
    // The new encounter precedes the path list in DOM order: move focus to its readable landmark.
    peaceHud.focus({preventScroll:true});
  }
  if((selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)&&flight===0&&flightStage==='return'){
    const wasOpal=selected===8,wasJoy=selected===0,wasLove=selected===1,wasStability=selected===2,wasEmber=selected===3,wasBalance=selected===5,wasCanopy=selected===6,wasHighlands=selected===7;
    selected=-1;close=false;flightStage='arrival';targetZoom=1;targetOffset=[0,0,0];
    scene.dataset.stage='arrival';panel.hidden=true;returnButton.hidden=true;document.documentElement.classList.remove('universe-approaching','universe-encounter','universe-peace','universe-balance','universe-canopy','universe-highlands','universe-opal');peaceOverlay.classList.remove('is-visible');peaceOverlay.style.opacity='0';peaceOverlay.style.pointerEvents='none';balanceOverlay.classList.remove('is-visible');balanceOverlay.style.opacity='0';balanceOverlay.style.pointerEvents='none';canopyOverlay.classList.remove('is-visible');canopyOverlay.style.opacity='0';canopyOverlay.style.pointerEvents='none';highlandsOverlay.classList.remove('is-visible');highlandsOverlay.style.opacity='0';highlandsOverlay.style.pointerEvents='none';opalOverlay.classList.remove('is-visible');opalOverlay.style.opacity='0';opalOverlay.style.pointerEvents='none';joyOverlay.classList.remove('is-visible');joyOverlay.style.opacity='0';loveOverlay.classList.remove('is-visible');loveOverlay.style.opacity='0';stabilityOverlay.classList.remove('is-visible');stabilityOverlay.style.opacity='0';emberOverlay.classList.remove('is-visible');emberOverlay.style.opacity='0';
    labels.forEach(el=>el.setAttribute('aria-pressed','false'));
    $('#scene-note').textContent='Begin with Peace · or turn the universe and explore all nine';
    status.textContent='Returned to the universe.';updateMotionControl();
    const saved=wasOpal?opalFocusReturn:wasJoy?joyFocusReturn:wasLove?loveFocusReturn:wasStability?stabilityFocusReturn:wasEmber?emberFocusReturn:wasBalance?balanceFocusReturn:wasCanopy?canopyFocusReturn:wasHighlands?highlandsFocusReturn:peaceFocusReturn;const restore=saved?.isConnected?saved:(labels[wasOpal?8:wasJoy?0:wasLove?1:wasStability?2:wasEmber?3:wasBalance?5:wasCanopy?6:wasHighlands?7:4]||document.querySelector(`[data-summit="${wasOpal?8:wasJoy?0:wasLove?1:wasStability?2:wasEmber?3:wasBalance?5:wasCanopy?6:wasHighlands?7:4}"]`));
    peaceFocusReturn=null;joyFocusReturn=null;loveFocusReturn=null;stabilityFocusReturn=null;emberFocusReturn=null;balanceFocusReturn=null;canopyFocusReturn=null;highlandsFocusReturn=null;opalFocusReturn=null;restore?.focus({preventScroll:true});
  }
  zoom+=(targetZoom-zoom)*settle;offset=offset.map((v,i)=>v+(targetOffset[i]-v)*settle);
  const moving=Math.abs(zoom-targetZoom)>.0001||offset.some((v,i)=>Math.abs(v-targetOffset[i])>.0001);
  if(!moving){zoom=targetZoom;offset=targetOffset.slice();}
  gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);drawStars();gl.useProgram(program);
  gl.uniform2f(loc.uView,viewWidth,viewHeight);gl.uniform3fv(loc.uOffset,offset);gl.uniform1f(loc.uZoom,zoom);gl.uniform1f(loc.uCameraZ,cameraZ);gl.uniform1f(loc.uTime,reduced?0:universeClock);
  centers=summits.map((_,i)=>P.quaternionRotateVector(quaternion,basePosition(i)));
  const heartPosition=[width<600?-.35:.38,width<600?-.37:-.14,.40];
  draw(meshes[0],heartPosition,(width<600?1.90:1.72)*(1-.38*smooth),[.76,.9,.96],true,false);
  projected=centers.map((center,i)=>{
    draw(meshes[i+1],center,radius(i)*((i===4&&selected===4||i===0&&selected===0||i===1&&selected===1||i===2&&selected===2||i===3&&selected===3||i===5&&selected===5||i===6&&selected===6||i===7&&selected===7||i===8&&selected===8)?1+3.1*smooth:1),color(summits[i][2]),false,i===selected,i);
    const p=project(center),label=labels[i];
    const obscured=center[2]<-.1&&Math.hypot(center[0],center[1])<.75;
    const hidden=flight>.16||close&&i!==selected||obscured;
    label.style.visibility=hidden?'hidden':'visible';label.tabIndex=hidden?-1:0;
    label.style.opacity=String(Math.max(.68,Math.min(1,.86+center[2]*.1)));label.style.zIndex=String(Math.round(center[2]*10)+40);
    return {...p,radius:Math.max(22,radius(i)*p.scale),hidden};
  });
  placeLabels();
  if(flight>.08&&(selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)){
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    const k=selected;draw(meshes[k+1],centers[k],radius(k)*(1+3.1*smooth)*1.095,color(summits[k][2]),false,true,k,true);
    gl.depthMask(true);gl.disable(gl.BLEND);
  }
  // The Joy landscape is drawn during its cross-atmosphere transition above.
  const heart=project(heartPosition), glow=$('.heart-glow');glow.style.left=heart.x+'px';glow.style.top=heart.y+'px';glow.style.transform=`translate(-50%,-50%) scale(${zoom})`;
  if(inertia||moving||orbitActive||flight!==flightTarget||((selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)&&flight>.02&&!reduced&&windowFocused&&pageActive&&sceneVisible))requestFrame();else lastTime=0;
}
function resize(){if(!gl)return;const b=scene.getBoundingClientRect();width=b.width;height=b.height;labelSizes=labels.map(el=>({width:el.offsetWidth||96,height:el.offsetHeight||44}));const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);viewWidth=width<600?2.85:Math.max(3.9,width/height*2.5);viewHeight=viewWidth*height/width;if(close&&selected>=0&&selected!==4&&selected!==0&&selected!==1&&selected!==2&&selected!==3&&selected!==5&&selected!==6&&selected!==7)targetOffset=P.quaternionRotateVector(quaternion,basePosition(selected));requestFrame();}
function cancelPointer(){if(!pointer)return;const id=pointer.id;quaternion=pointer.startQuaternion.slice();pointer=null;try{if(scene.hasPointerCapture(id))scene.releasePointerCapture(id);}catch{}suppressUntil=performance.now()+P.GESTURE.suppressClickMs;requestFrame();}
function hitTest(x,y){const b=scene.getBoundingClientRect();return projected.map((p,i)=>({...p,i})).filter(p=>!p.hidden&&Math.hypot(x-b.left-p.x,y-b.top-p.y)<=p.radius).sort((a,b)=>centers[b.i][2]-centers[a.i][2])[0]?.i;}
function bindInput(){
  scene.addEventListener('pointermove',event=>{
    if(pointer||selected>=0||!ready)return;
    const i=hitTest(event.clientX,event.clientY);
    labels.forEach((label,k)=>label.classList.toggle('is-hovered',i===k));
  });
  scene.addEventListener('pointerleave',()=>labels.forEach(label=>label.classList.remove('is-hovered')));
  scene.addEventListener('pointerdown',event=>{
    // The in-world teaching buttons and links own their own taps; do not reinterpret them as planet hits.
    if(event.target.closest('#peace-encounter,#joy-world,#love-world,#stability-world,#ember-world,#balance-world,#canopy-world,#highlands-world,#opal-world'))return;
    if(!ready||event.button!==0||!event.isPrimary||pointer)return;
    stopInertia();const now=performance.now();pointer={id:event.pointerId,startX:event.clientX,startY:event.clientY,startTime:now,startQuaternion:quaternion.slice(),currentQuaternion:quaternion.slice(),samples:[],dragging:false,hit:event.target.closest('[data-planet]')?Number(event.target.closest('[data-planet]').dataset.planet):hitTest(event.clientX,event.clientY)};
    P.addPointerSample(pointer,event.clientX,event.clientY,now);scene.setPointerCapture(event.pointerId);orbitSpeed=0;requestFrame();
  });
  scene.addEventListener('pointermove',event=>{
    if(!pointer||event.pointerId!==pointer.id)return;P.addPointerSample(pointer,event.clientX,event.clientY,performance.now());
    if(close||!pointer.dragging&&P.pointerDistance(pointer,event.clientX,event.clientY)<P.GESTURE.minimumDragDistancePx)return;
    pointer.dragging=true;event.preventDefault();quaternion=P.dragQuaternionFromPointer(pointer,event.clientX,event.clientY,width,height);pointer.currentQuaternion=quaternion.slice();requestFrame();
  });
  scene.addEventListener('pointerup',event=>{
    if(!pointer||event.pointerId!==pointer.id)return;const p=pointer,now=performance.now(),metrics=P.gestureMetrics(p,event.clientX,event.clientY,now);pointer=null;
    try{if(scene.hasPointerCapture(event.pointerId))scene.releasePointerCapture(event.pointerId);}catch{}
    if(p.dragging){quaternion=p.currentQuaternion.slice();const params=P.releaseParameters(metrics,width,height,reduced);inertia=params?{...params,startedAt:now,releaseQuaternion:quaternion.slice()}:null;suppressUntil=now+P.GESTURE.suppressClickMs;event.preventDefault();requestFrame();}
    else if(metrics.distance<=P.GESTURE.maximumTapDistancePx&&p.hit!==undefined){choose(p.hit);suppressUntil=now+P.GESTURE.suppressClickMs;}
    lastTime=0;requestFrame();
  });
  scene.addEventListener('pointercancel',cancelPointer);scene.addEventListener('lostpointercapture',()=>{if(pointer)cancelPointer();});
  scene.addEventListener('click',event=>{if(performance.now()<suppressUntil){event.preventDefault();event.stopPropagation();}},true);
  window.addEventListener('blur',()=>{windowFocused=false;orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();requestFrame();});
  window.addEventListener('focus',()=>{windowFocused=true;lastTime=0;requestFrame();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;}else{lastTime=0;requestFrame();}});
  media.addEventListener('change',()=>{reduced=media.matches;orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();updateMotionControl();requestFrame();});
  window.addEventListener('pagehide',()=>{pageActive=false;orbitSpeed=0;lastTime=0;cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;});
  window.addEventListener('pageshow',()=>{pageActive=true;lastTime=0;requestFrame();});
}
function fallback(error){cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;$('#planet-labels').hidden=true;canvas.hidden=true;$('.heart-glow').hidden=true;ready=false;updateMotionControl();receipt={...receipt,status:'fallback',error:String(error.message||error)};scene.classList.remove('ready');$('.loading').textContent='The nine summits are available below.';$('#path-list').open=true;status.textContent='Explore the summit teachings below, or continue to the book.';approach.hidden=selected<0;$('#reset-view').disabled=true;console.error('Universe:',error);}
async function init(){
  P=globalThis.DGB_COMPASS_ORBIT_PHYSICS;if(!P)throw Error('Shared Compass physics unavailable');
  const K=await import('../../showroom/globe/h-earth/render/geometry-kernel.js');
  peaceKernelFacade=K;
  setupGL();meshes=buildGeometry(K);
  summits.forEach(([begin,summit],i)=>{const el=document.createElement('button');el.type='button';el.className='planet-label';el.dataset.planet=i;el.setAttribute('aria-label',`${begin} leads to ${summit}`);el.setAttribute('aria-pressed','false');el.innerHTML=`<strong>${begin}</strong><span>${summit}</span>`;el.addEventListener('click',event=>{if(event.detail===0)choose(i);});$('#planet-labels').append(el);labels.push(el);});
  try{setupJoyWorld();}catch(error){console.error('Gratitude world:',error);}
  ready=true;scene.dataset.stage='arrival';updateMotionControl();scene.classList.add('ready');resize();bindInput();new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;orbitSpeed=0;lastTime=0;if(!sceneVisible&&raf){cancelAnimationFrame(raf);raf=0;}if(sceneVisible)requestFrame();}).observe(scene);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;fallback(Error('Graphics context interrupted'));});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  globalThis.DGB_UNIVERSE=Object.freeze({readback:()=>({...receipt,quaternion:quaternion.slice(),selected,close,flight,flightStage,cameraZ,orbitPhase,orbitSpeed,motionPaused,orbitActive:orbitCanMove(),sceneVisible,reducedMotion:reduced,inertiaActive:Boolean(inertia),pointerActive:Boolean(pointer),zoom,canvasSize:[canvas.width,canvas.height],glError:gl?.getError(),world02WebGL:Boolean(loveGL),world02GLError:loveGL?.getError()??null,world03WebGL:Boolean(stabilityGL),world03GLError:stabilityGL?.getError()??null,world04WebGL:Boolean(emberGL),world04GLError:emberGL?.getError()??null,world05WebGL:Boolean(peaceGL),world05GLError:peaceGL?.getError()??null,world06WebGL:Boolean(balanceGL),world06GLError:balanceGL?.getError()??null,world07WebGL:Boolean(canopyGL),world07GLError:canopyGL?.getError()??null,world08WebGL:Boolean(highlandsGL),world08GLError:highlandsGL?.getError()??null,world09WebGL:Boolean(opalGL),world09GLError:opalGL?.getError()??null})});
}
init().catch(fallback);
