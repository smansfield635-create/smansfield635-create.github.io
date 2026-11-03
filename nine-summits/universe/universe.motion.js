/* Universe first slice. Geometry: H-Earth kernel; motion: unchanged Compass physics.
 * Heart contour and dome proportions: nine-summits-of-love/index.html at 171a74bc.
 * Planet lighting is a visual metaphor; no physical simulation claims. */
// Public summit identity is book-authored. Physical legacy slots stay stable for the renderers.
// Original book order is deliberately distinct from the legacy orbital order.
const BOOK_ORDER_SLOTS=Object.freeze([4,1,2,3,7,0,5,6,8]);
const BOOK_ORDINAL_BY_SLOT=Object.freeze(['VI','II','III','IV','I','VII','VIII','V','IX']);
const BOOK_PAIR_BY_SLOT=Object.freeze([
  ['Forgiveness','Resentment'],['Generosity','Greed'],['Dependability','Irresponsibility'],
  ['Accountability','Blame'],['Gratitude','Entitlement'],['Self-Control','Impulsivity'],
  ['Patience','Instant gratification'],['Humility','Arrogance'],['Purity','Pettiness']
]);
const summits = [
  ['Forgiveness','Resentment','#a3b8aa'],['Generosity','Greed','#cb7584'],['Dependability','Irresponsibility','#749cab'],
  ['Accountability','Blame','#b88360'],['Gratitude','Entitlement','#d5aa66'],['Self-Control','Impulsivity','#8e8ead'],
  ['Patience','Instant gratification','#9caa7d'],['Humility','Arrogance','#ba9cae'],['Purity','Pettiness','#b8c9d2']
];
// Former procedural Joy slot 0 is a book-only Forgiveness portal pending its own approved environment.
const BOOK_ONLY_SUMMIT_SLOT=0;
// Teaching text follows the nine relationships on the book page; examples invite reflection.
const teachings = [
  {
    "title": "Peace leaves room for truth.",
    "intro": "Forgiveness releases the fight without erasing what happened.",
    "teaching": "Forgiveness does not erase truth. It ends the unnecessary war so truth, boundaries, and repair can occupy the same room.",
    "choice": "You can choose to stop feeding resentment while keeping an honest boundary. Forgiveness does not require pretending trust has already been restored.",
    "question": "What would peace look like while keeping an honest boundary?"
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
    "title": "Gratitude begins with seeing.",
    "intro": "Gratitude recognizes value without assuming it was owed.",
    "teaching": "Gratitude does not deny what is missing or difficult. It notices what remains worthy of care, recognizing gifts that entitlement has begun to treat as guarantees.",
    "choice": "When disappointment narrows your attention, name a kindness, relationship, or opportunity you did not create alone. Appreciating its value does not erase the difficulty; it gives you somewhere truthful to begin.",
    "question": "What in your life still deserves gratitude, even when today is difficult?"
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
const returnButton=document.querySelector('#return-view');
const media=matchMedia('(prefers-reduced-motion: reduce)');
let gratitudeAtlasTexture=null,gratitudeAtlasLoaded=false,gratitudeAtlasError=null;
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
  teachingRevealVersion++;$('#scene-note').textContent='Begin with Gratitude · or turn the universe and explore all nine'; selected=index; close=false; targetZoom=1;targetOffset=[0,0,0];panel.style.setProperty('--world-accent',summits[index][2]);scene.style.setProperty('--world-accent',summits[index][2]);
  const [summit,opposing]=summits[index], teaching=teachings[index];
  $('#reflection-path').textContent=`Summit ${BOOK_ORDINAL_BY_SLOT[index]} of IX · ${summit} / ${opposing}`;
  $('#reflection-title').textContent=teaching.title;
  $('#reflection-copy').textContent=teaching.intro;
  $('#teaching-copy').textContent=teaching.teaching;
  $('#teaching-choice').textContent=teaching.choice;
  $('#reflection-question').textContent=teaching.question;
  $('#summit-teaching').hidden=ready&&index!==BOOK_ONLY_SUMMIT_SLOT;
  panel.hidden=false;returnButton.hidden=false;
  labels.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===index)));
  status.textContent=`Summit ${BOOK_ORDINAL_BY_SLOT[index]}: ${summit} stands against ${opposing}.`;
  updateMotionControl();
  if(index===4&&ready){startPeaceFlight();return;}
  if(index===BOOK_ONLY_SUMMIT_SLOT&&ready){status.textContent='Summit VI — Forgiveness. Explore the complete teaching while its distinct environment is developed.';requestFrame();if(scroll){panel.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});panel.focus({preventScroll:true});}return;}
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
  stopInertia();teachingRevealVersion++;$('#scene-note').textContent='Begin with Gratitude · or turn the universe and explore all nine'; const prior=selected; selected=-1;close=false;targetZoom=1;targetOffset=[0,0,0];panel.style.removeProperty('--world-accent');scene.style.removeProperty('--world-accent');
  panel.hidden=true;returnButton.hidden=true;status.textContent='All nine summits. One path. Your orientation is preserved.';
  $('#summit-teaching').hidden=true;
  labels.forEach(el=>el.setAttribute('aria-pressed','false'));requestFrame();
  if(prior>=0){const target=ready?labels[prior]:$(`[data-summit="${prior}"]`);target?.focus({preventScroll:true});scene.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});}
}

function startPeaceFlight(){
  panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';
  if(!peaceGL){try{setupPeaceWorld();}catch(error){console.error('Gratitude world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Golden Lagoon is unavailable. Read the complete Gratitude teaching below.';panel.focus({preventScroll:true});return;}}
  scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});
  peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');
  $('#scene-note').textContent='Approaching Summit I — Gratitude';status.textContent='Traveling toward The Golden Lagoon.';
  updateMotionControl();requestFrame();
}
function openWorldList(){
 const list=$('#path-list');list.open=true;
 list.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 list.querySelector('summary')?.focus({preventScroll:true});
}
function beginWithGratitude(){
  if(selected!==4){choose(4,!ready);return;}
  if(ready)startPeaceFlight();
  else{panel.hidden=false;$('#summit-teaching').hidden=false;panel.scrollIntoView({behavior:'instant',block:'nearest'});panel.focus({preventScroll:true});}
}
$('#explore-worlds').addEventListener('click',beginWithGratitude);
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
function startLoveFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!loveGL){try{setupLoveWorld();}catch(error){console.error('Generosity world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Living Constellation is unavailable. Read the complete Love teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit II — Generosity';status.textContent='Traveling toward the Living Constellation.';updateMotionControl();requestFrame();}
function startHighlandsFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!highlandsGL){try{setupHighlandsWorld();}catch(error){console.error('Humility world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Quiet Highlands are unavailable. Read the complete Dignity teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit V — Humility';status.textContent='Traveling toward The Quiet Highlands.';updateMotionControl();requestFrame();}
function startOpalFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!opalGL){try{setupOpalWorld();}catch(error){console.error('Opal Passage world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Opal Passage is unavailable. Read the complete Free Will teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit IX — Purity';status.textContent='Traveling toward The Opal Passage.';updateMotionControl();requestFrame();}

function startCanopyFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!canopyGL){try{setupCanopyWorld();}catch(error){console.error('Patience world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Ancient Canopy is unavailable. Read the complete Structure teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit VIII — Patience';status.textContent='Traveling toward The Ancient Canopy.';updateMotionControl();requestFrame();}
function startBalanceFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!balanceGL){try{setupBalanceWorld();}catch(error){console.error('Self-Control world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Twin Equilibrium is unavailable. Read the complete Balance teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit VII — Self-Control';status.textContent='Traveling toward The Twin Equilibrium.';updateMotionControl();requestFrame();}
function startEmberFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!emberGL){try{setupEmberWorld();}catch(error){console.error('Accountability world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Ember Canyons are unavailable. Read the complete Character teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit IV — Accountability';status.textContent='Traveling toward the Ember Canyons.';updateMotionControl();requestFrame();}
function startStabilityFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';if(!stabilityGL){try{setupStabilityWorld();}catch(error){console.error('Dependability world:',error);flightTarget=0;flightStage='arrival';close=false;panel.hidden=false;returnButton.hidden=false;$('#summit-teaching').hidden=false;status.textContent='The Great Basalt Terraces are unavailable. Read the complete Stability teaching below.';panel.focus({preventScroll:true});return;}}scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Summit III — Dependability';status.textContent='Traveling toward the Great Basalt Terraces.';updateMotionControl();requestFrame();}
function startJoyFlight(){throw Error('UNAPPROVED_PROCEDURAL_JOY_SCENE_DISABLED');panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Gratitude — Joy';status.textContent='Traveling toward the Dawn Archipelago.';updateMotionControl();requestFrame();}

document.querySelectorAll('[data-summit]').forEach(el=>el.addEventListener('click',()=>choose(Number(el.dataset.summit))));
returnButton.addEventListener('click',returnToAll);
$('#return-from-teaching').addEventListener('click',returnToAll);
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

/* Gen2999 About-native Peace: source-controlled ORIGINAL Diamond Gate SVG coast.
 * This is a composed art environment plus source-local 2D water and the separate
 * H-Earth WEST-admitted true-geometry near field, NOT image-only photogrammetry.
 * No third-party network image dependency. Other eight worlds untouched. */
const PEACE_CINEMA_IMAGE='./peace.environment.svg?cb=peace-v12-material-separation';
// The mountain, shore, and distant terrain are IMMOBILE. The camera's former
// flight-driven 1.32→1.08 zoom was translating the entire landscape during
// the Gratitude arrival. Use the already accepted settled framing from the
// first visible panorama frame onward; only independent sky/water may move.
const PEACE_CINEMA_FIXED_SCALE=1.08;
let peaceWaterCanvas=null,peaceWaterContext=null,peaceWaterLast=0;
let peaceCloudCanvas=null,peaceCloudContext=null,peaceCloudLast=0,peaceGeometryScheduled=false;
let peaceCloudBanks=null,peaceSafeWaterMask=null,peaceSafeSkyMask=null,peaceSkyMotionClearance=null;
let peaceCloudOutputCanvas=null,peaceCloudOutputContext=null,peaceCloudOutputPixels=null;
let peaceWaveFieldCanvas=null,peaceWaveFieldContext=null,peaceWaveFieldPixels=null,peaceWaveSourcePixels=null;
let peaceCinemaState='loading',peaceCinemaLayer=null,peaceCinemaPhoto=null,peaceCinemaLastX=0,peaceCinemaLastY=0;
let peaceBaseSource=null,peaceCloudSource=null,peaceWaterMaskSource=null,peaceSkyMaskSource=null,peaceLayerSourcesPromise=null,peaceMotionStartedAt=0;
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
 #peace-encounter .peace-cinema-image,#peace-encounter .peace-cinema-clouds,#peace-encounter .peace-cinema-water{display:block;position:absolute;inset:0;width:100%;height:100%;
 object-fit:cover;object-position:50% 50%;max-width:none;max-height:none;
 transform-origin:50% 50%;transform:scale(${PEACE_CINEMA_FIXED_SCALE});
 transition:none;opacity:0}
 #peace-encounter .peace-cinema-image{z-index:0;filter:none;transition:none}
 #peace-encounter .peace-cinema-clouds{z-index:1;pointer-events:none;mix-blend-mode:normal}
 #peace-encounter .peace-cinema-water{z-index:2;pointer-events:none;mix-blend-mode:normal}
 #peace-encounter .peace-cinema-ready .peace-cinema-image,#peace-encounter .peace-cinema-ready .peace-cinema-clouds,#peace-encounter .peace-cinema-ready .peace-cinema-water{opacity:1}
 #peace-encounter .peace-cinema-ready .peace-cinema-image{filter:none}
 #peace-encounter.peace-cinema-active #peace-world-canvas{position:absolute;inset:0;z-index:3;opacity:.64;pointer-events:none}
 #peace-encounter .peace-cinema-stage{z-index:1}
 /* V12 MATERIAL_LOCK: no full-frame light, glow, veil or moving luminance overlays. */
 #peace-encounter.peace-cinema-active #peace-world-canvas{opacity:.64;pointer-events:none;}
 #peace-encounter .peace-world-hud{z-index:9;}
 #peace-encounter .peace-horizon-mark{z-index:9;}
 @media(prefers-reduced-motion:reduce){#peace-encounter .peace-cinema-image,#peace-encounter .peace-cinema-clouds,#peace-encounter .peace-cinema-water{transition:none;transform:scale(1.08)!important}}
 `;
 peaceOverlay.appendChild(style);
 const layer=document.createElement('div');layer.className='peace-cinema-stage';layer.setAttribute('aria-hidden','true');
 layer.innerHTML=''; // no global optical overlays over geography
 const photo=document.createElement('img');photo.className='peace-cinema-image';photo.alt='';photo.decoding='async';
 photo.onload=()=>{
  if(photo.naturalWidth>0&&peaceCinemaState!=='error'){
   peaceCinemaState='ready';layer.classList.add('peace-cinema-ready');
  }
 };
 photo.onerror=()=>{if(peaceCinemaState!=='error')peaceCinemaPreload.onerror();};
 photo.src=PEACE_CINEMA_IMAGE;layer.prepend(photo);peaceCinemaPhoto=photo;
 const clouds=document.createElement('canvas');clouds.className='peace-cinema-clouds';clouds.width=960;clouds.height=540;
 clouds.setAttribute('aria-hidden','true');layer.insertBefore(clouds,photo.nextSibling);peaceCloudCanvas=clouds;
 peaceCloudContext=clouds.getContext('2d',{alpha:true});
 const water=document.createElement('canvas');water.className='peace-cinema-water';water.width=960;water.height=540;
 water.setAttribute('aria-hidden','true');layer.insertBefore(water,clouds.nextSibling);peaceWaterCanvas=water;
 peaceWaterContext=water.getContext('2d',{alpha:true});
 peaceOverlay.insertBefore(layer,peaceCanvas);peaceCinemaLayer=layer;
 loadPeaceCinemaSourceLayers();
 if(peaceCinemaState==='ready')layer.classList.add('peace-cinema-ready');
 peaceOverlay.classList.add('peace-cinema-active');
 // V11: no implicit pointer-driven translation of terrain or coast.
 // The shared arrival zoom remains a camera transition, not world motion.
}
function peaceLoadImage(src){
 return new Promise((resolve,reject)=>{
  const image=new Image();image.decoding='async';
  image.onload=()=>image.naturalWidth>0?resolve(image):reject(Error('Peace source layer empty'));
  image.onerror=()=>reject(Error('Peace source layer failed'));
  image.src=src;
 });
}
function peaceLayerHref(doc,id){
 const node=doc.getElementById(id);
 return node?.getAttribute('href')||node?.getAttributeNS('http://www.w3.org/1999/xlink','href')||'';
}
function loadPeaceCinemaSourceLayers(){
 if(peaceCinemaState==='error')return Promise.resolve(false);
 if(peaceLayerSourcesPromise)return peaceLayerSourcesPromise;
 peaceLayerSourcesPromise=fetch(PEACE_CINEMA_IMAGE,{cache:'force-cache'})
  .then(response=>{if(!response.ok)throw Error('Peace V12 asset HTTP '+response.status);return response.text();})
  .then(text=>{
   const doc=new DOMParser().parseFromString(text,'image/svg+xml');
   const ids=['peace-base','peace-cloud-layer','peace-water-mask','peace-sky-mask'];
   const sources=ids.map(id=>peaceLayerHref(doc,id));
   if(sources.some(src=>!src))throw Error('PEACE_V12_MATERIAL_ASSET_MISSING');
   return Promise.all(sources.map(peaceLoadImage));
  })
  .then(([base,cloud,waterMask,skyMask])=>{
   peaceBaseSource=base;peaceCloudSource=cloud;peaceWaterMaskSource=waterMask;peaceSkyMaskSource=skyMask;
   peaceCloudBanks=peaceBuildCloudBanks(cloud);
   peaceSafeSkyMask=peaceBuildSafeSkyMask(skyMask);
   peaceSafeWaterMask=peaceBuildSafeWaterMask(waterMask,base);
   if(!peaceCloudBanks||!peaceSafeSkyMask||!peaceSafeWaterMask||!peaceSkyMotionClearance)
    throw Error('PEACE_V12_MATERIAL_BOUNDARY_INVALID');
   peaceCloudOutputCanvas=peaceCloudOutputContext=peaceCloudOutputPixels=null;
   peaceWaveFieldCanvas=peaceWaveFieldContext=peaceWaveFieldPixels=peaceWaveSourcePixels=null;
   peaceMotionStartedAt=performance.now();peaceCloudLast=peaceWaterLast=0;
   if(peaceCinemaPhoto)peaceCinemaPhoto.src=base.src;
   drawPeaceSourceClouds(peaceMotionStartedAt,true);
   drawPeaceSourceWater(peaceMotionStartedAt,true);
   return true;
  })
  .catch(error=>{
   console.error('Peace V12 material validation failed:',error);
   peaceCinemaState='error';
   if(peaceCinemaLayer){peaceCinemaLayer.remove();peaceCinemaLayer=null;}
   peaceOverlay.classList.remove('peace-cinema-active');
   setTimeout(()=>{if(!peaceGL){try{setupPeaceGLFallback();}catch(e){console.error('Peace geometry fallback:',e);}}},0);
   return false;
  });
 return peaceLayerSourcesPromise;
}
function peaceMaterialRaster(image){
 const canvas=document.createElement('canvas');canvas.width=480;canvas.height=270;
 const g=canvas.getContext('2d',{alpha:true,willReadFrequently:true});
 if(!g)return null;
 g.drawImage(image,0,0,480,270);
 return g.getImageData(0,0,480,270).data;
}
function peaceBuildCloudBanks(image){return peaceMaterialRaster(image);}
function peaceBuildSafeSkyMask(image){
 const original=peaceMaterialRaster(image);
 if(!original)return null;
 const W=480,H=270,safe=new Uint8ClampedArray(original);
 // Source-material sky matte is not sufficient near remote mountains.
 // Erode its sky/land membership by 4 source pixels to avoid moving
 // an opaque cloud texel across a protected ridge or cliff silhouette.
 const threshold=192,radius=4;
 const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 for(let y=0;y<116;y++)for(let x=0;x<W;x++){
  const k=(y*W+x)*4;
  if(original[k+3]<threshold){safe[k+3]=0;continue;}
  let minAlpha=255;
  for(let oy=-radius;oy<=radius;oy++)for(let ox=-radius;ox<=radius;ox++){
   const yy=y+oy,xx=x+ox;
   if(xx<0||xx>=W||yy<0||yy>=H){minAlpha=0;continue;}
   minAlpha=Math.min(minAlpha,original[(yy*W+xx)*4+3]);
  }
  const matteConfidence=smooth(192,250,minAlpha);
  // The center-background panorama has distant mountain spires beneath
  // translucent haze. Keep their high-frequency contours fully still:
  // fade animated clouds out before the uncertain horizon rather than
  // freezing cloud motion elsewhere or translating any scenic RGB.
  const center=smooth(86,145,x)*(1-smooth(325,397,x));
  const nearHorizon=smooth(61,107,y);
  const mountainGuard=1-center*nearHorizon;
  safe[k+3]=Math.round(original[k+3]*matteConfidence*mountainGuard);
 }
 // Separate STATIC source-mask clearance from the changing cloud material.
 // 2-pass L1 distance to non-sky pixels, measured once on source load, gives
 // high ridges a feathered still-air buffer without erasing nearby low haze.
 // The physical land layer and the approved foreground water never enter here.
 const cloudH=116,clearance=new Uint8Array(W*cloudH);
 for(let y=0;y<cloudH;y++)for(let x=0;x<W;x++){
  const i=y*W+x;
  clearance[i]=original[i*4+3]>=245?255:0;
 }
 for(let y=0;y<cloudH;y++)for(let x=0;x<W;x++){
  const i=y*W+x;if(!clearance[i])continue;
  const above=y?clearance[i-W]+1:255,left=x?clearance[i-1]+1:255;
  clearance[i]=Math.min(255,clearance[i],above,left);
 }
 for(let y=cloudH-1;y>=0;y--)for(let x=W-1;x>=0;x--){
  const i=y*W+x;if(!clearance[i])continue;
  const below=y<cloudH-1?clearance[i+W]+1:0;
  const right=x<W-1?clearance[i+1]+1:255;
  clearance[i]=Math.min(255,clearance[i],below,right);
 }
 peaceSkyMotionClearance=clearance;
 // Source-space negative challenge; these points lie below the protected
 // center mountain-safe horizon. No time-varying overlay is admitted here.
 for(const [x,y] of [[175,115],[210,115],[250,115],[295,115]]){
  const alpha=safe[(y*W+x)*4+3];
  if(alpha>1)throw Error('GRATITUDE_SKY_MOUNTAIN_GUARD_FAILED:'+x+','+y+':'+alpha);
 }
 return safe;
}
function peaceBuildSafeWaterMask(image,base){
 const data=peaceMaterialRaster(image);
 if(!data||!base?.complete)return null;
 // The source water matte includes opaque rock/haze beneath the owner's
 // circled far-left midridge. Restrict ONLY that fixed source-art precinct:
 // no time-dependent RGB sampling may move its terrain through the water layer.
 // Genuine cyan water survives via the frozen base-image material signal.
 const originalBase=peaceMaterialRaster(base);
 if(!originalBase)return null;
 const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 for(let y=98;y<159;y++)for(let x=200;x<280;x++){
  const k=(y*480+x)*4;
  if(data[k+3]<1)continue;
  const d=Math.hypot((x-240)/40,(y-125)/28);
  const ridgeGuard=1-smooth(.78,1.14,d);
  if(ridgeGuard<=0)continue;
  const red=originalBase[k],green=originalBase[k+1],blue=originalBase[k+2];
  const genuineWater=Math.min(smooth(75,120,blue-red),smooth(52,88,green-red));
  data[k+3]=Math.round(data[k+3]*(1-ridgeGuard*(1-genuineWater)));
 }
 const alpha=(x,y)=>data[(y*480+x)*4+3];
 // These source points were FALSE water over owner-marked immobile land/haze.
 for(const [x,y] of [[217,114],[222,120],[228,127],[245,116],[256,120]]){
  if(alpha(x,y)>8)throw Error('GRATITUDE_MIDRIDGE_WATER_TERRAIN_GUARD_FAILED:'+x+','+y+':'+alpha(x,y));
 }
 // Fail closed if sky, protected mountains, foreground or islands receive water.
 for(const [x,y] of [[80,100],[45,180],[268,120],[290,160],[348,133],[437,153],[200,250]]){
  if(alpha(x,y)>8)throw Error('PEACE_V12_WATER_LAND_GUARD_FAILED:'+x+','+y);
 }
 let count=0;
 for(let i=3;i<data.length;i+=4)if(data[i]>=192)count++;
 if(count<15000)throw Error('PEACE_V12_WATER_COVERAGE_INADEQUATE:'+count);
 return data;
}
function peaceCloudFieldInit(){
 if(peaceCloudOutputCanvas)return;
 peaceCloudOutputCanvas=document.createElement('canvas');peaceCloudOutputCanvas.width=480;peaceCloudOutputCanvas.height=270;
 peaceCloudOutputContext=peaceCloudOutputCanvas.getContext('2d',{alpha:true});
 if(peaceCloudOutputContext)peaceCloudOutputPixels=peaceCloudOutputContext.createImageData(480,270);
}
function drawPeaceSourceClouds(now,force=false){
 if(!peaceCloudContext||!peaceCloudCanvas||!peaceCloudBanks||!peaceSafeSkyMask)return;
 if(reduced&&!force)return;
 if(!force&&peaceCloudLast&&now-peaceCloudLast<46)return;
 peaceCloudLast=now;
 peaceCloudFieldInit();if(!peaceCloudOutputPixels)return;
 // Distant cloud masses travel more slowly than the already accepted near water.
 // Phase remains zero at entry, so we preserve the same initial camera/cloud pose.
 const t=(reduced?0:Math.max(0,(now-(peaceMotionStartedAt||now))*.001))*.42;
 const src=peaceCloudBanks,sky=peaceSafeSkyMask,out=peaceCloudOutputPixels.data;
 out.fill(0);
 const W=480,H=270;
 // Each original-art cloud carrier retains its own source-space footprint.
 // Independent winds move those footprints; soft membership at source coordinates
 // keeps their contours coherent instead of shearing the destination screen.
 const winds=[2.80,-2.40,1.80],lifts=[-.14,.11,-.07];
 const curlXScale=[1,-.78,.65],curlYScale=[.84,-.72,1.05];
 const smooth=(a,b,v)=>{const u=Math.max(0,Math.min(1,(v-a)/(b-a)));return u*u*(3-2*u);};
 for(let y=0;y<116;y++){
  const depth=.62+.60*y/116;
  for(let x=0;x<W;x++){
   const k=(y*W+x)*4,limit=sky[k+3];
   if(limit<=2)continue;
   // Preserve the accepted V12 initial cloud pose exactly at t=0.
   const staticX=(1.75+.75*depth)*Math.sin(y*.047+x*.008)
     +1.15*Math.sin(x*.026-y*.041);
   const staticY=1.15*Math.sin(x*.041+y*.012)
     +.62*Math.sin(x*.019-y*.071);
   // Low-amplitude evolving curl is zero at t=0 and never acts on scenery.
   const cx=x*.021+y*.017,cy=x*.015-y*.028;
   const curlX=.52*(Math.sin(cx+t*.19)-Math.sin(cx));
   const curlY=.38*(Math.sin(cy+t*.16)-Math.sin(cy));
   let alphaSum=0,weightSum=0,redSum=0,greenSum=0,blueSum=0;
   for(let i=0;i<3;i++){
    const sx=x-staticX-winds[i]*t*depth-curlX*curlXScale[i];
    const sy=y-staticY-lifts[i]*t*depth-curlY*curlYScale[i];
    // Membership follows the sampled ORIGINAL material rather than
    // destination x. The overlapping seams are deliberately feathered.
    const left=smooth(145,225,sx),right=smooth(310,395,sx);
    const weight=i===0?1-left:i===1?left*(1-right):left*right;
    if(weight<=.0001)continue;
    weightSum+=weight;
    const x0=Math.floor(sx),y0=Math.floor(sy);
    if(x0<0||x0>=W-1||y0<0||y0>=H-1)continue;
    const fx=sx-x0,fy=sy-y0;
    const p=(y0*W+x0)*4,q=p+4,z=p+4*W,zq=z+4;
    const w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy;
    const a=src[p+3]*w00+src[q+3]*w10+src[z+3]*w01+src[zq+3]*w11;
    if(a<1)continue;
    const wa=weight*a;
    alphaSum+=wa;
    redSum+=wa*(src[p]*w00+src[q]*w10+src[z]*w01+src[zq]*w11);
    greenSum+=wa*(src[p+1]*w00+src[q+1]*w10+src[z+1]*w01+src[zq+1]*w11);
    blueSum+=wa*(src[p+2]*w00+src[q+2]*w10+src[z+2]*w01+src[zq+2]*w11);
   }
   // Keep the upper clouds independently alive, but hold original source
   // cloud/haze pixels still beside the first landforms and far mountain band.
   // This SOURCE-SPACE transition does not alter the water renderer or base art.
   // A smoothly held low cloud retains its presence without making terrain
   // appear to translate as the upper cloud carriers pass over it.
   // Keep a buffer of still source haze around mountain silhouettes; moving
   // clouds retain distinct depth above them, rather than shearing over rock.
   const ridgeClearance=smooth(4,16,peaceSkyMotionClearance[y*W+x]);
   const skyMotion=(1-smooth(25,56,y))*ridgeClearance;
   const heldAlpha=src[k+3]*limit/255*(1-skyMotion);
   let movingAlpha=0,movingR=0,movingG=0,movingB=0;
   if(skyMotion>0&&alphaSum>=2&&weightSum>=.0001){
    const evolution=.945+.055*Math.sin(x*.038+y*.059-t*.21);
    movingAlpha=Math.min(255,alphaSum/weightSum*limit/255*evolution)*skyMotion;
    movingR=redSum/alphaSum;movingG=greenSum/alphaSum;movingB=blueSum/alphaSum;
   }
   const combinedAlpha=movingAlpha+heldAlpha;
   if(combinedAlpha<2)continue;
   out[k]=(movingR*movingAlpha+src[k]*heldAlpha)/combinedAlpha;
   out[k+1]=(movingG*movingAlpha+src[k+1]*heldAlpha)/combinedAlpha;
   out[k+2]=(movingB*movingAlpha+src[k+2]*heldAlpha)/combinedAlpha;
   out[k+3]=Math.min(255,combinedAlpha);
  }
 }
 peaceCloudOutputContext.putImageData(peaceCloudOutputPixels,0,0);
 peaceCloudContext.clearRect(0,0,960,540);
 peaceCloudContext.drawImage(peaceCloudOutputCanvas,0,0,960,540);
 if(!peaceSkyMaskSource)throw Error('PEACE_V12_SKY_MATTE_MISSING');
 peaceCloudContext.save();peaceCloudContext.globalCompositeOperation='destination-in';
 peaceCloudContext.drawImage(peaceSkyMaskSource,0,0,960,540);peaceCloudContext.restore();
}
function updatePeaceCinema(){
 if(!peaceCinemaLayer||peaceCinemaState==='error')return;
 if(peaceCinemaState==='ready'){
  const now=performance.now();
  loadPeaceCinemaSourceLayers();
  drawPeaceSourceClouds(now);
  drawPeaceSourceWater(now);
 }
 // Gen3034 immobile panorama contract: do not recompute camera scale from
 // flight, approach, return, scrolling, pointer or the animation clock.
 // All three source layers stay at 1.08 for their entire visible lifetime.
 // Cloud and masked water texture animations are unaffected.
 // No atmosphere-wide transparency or luminance animation is permitted.
}
/* Actual source-texture advection inside verified water, never a screen
 * shine or any new light. Neighboring source texels follow spatial waves;
 * all land/background RGB values remain unmodified by this pass. */
function drawPeaceSourceWater(now,force=false){
 if(!peaceWaterContext||!peaceWaterCanvas)return;
 const c=peaceWaterContext;
 if(reduced||!peaceSafeWaterMask||!peaceBaseSource){c.clearRect(0,0,960,540);return;}
 if(!force&&peaceWaterLast&&now-peaceWaterLast<46)return;
 peaceWaterLast=now;
 if(!peaceWaveFieldCanvas){
  peaceWaveFieldCanvas=document.createElement('canvas');peaceWaveFieldCanvas.width=480;peaceWaveFieldCanvas.height=270;
  peaceWaveFieldContext=peaceWaveFieldCanvas.getContext('2d',{alpha:true});
  const srcCanvas=document.createElement('canvas');srcCanvas.width=480;srcCanvas.height=270;
  const ctx=srcCanvas.getContext('2d',{alpha:true,willReadFrequently:true});
  if(peaceWaveFieldContext&&ctx){
   ctx.drawImage(peaceBaseSource,0,0,480,270);
   peaceWaveSourcePixels=ctx.getImageData(0,0,480,270).data;
   peaceWaveFieldPixels=peaceWaveFieldContext.createImageData(480,270);
  }
 }
 if(!peaceWaveFieldContext||!peaceWaveSourcePixels||!peaceWaveFieldPixels)return;
 const t=Math.max(0,(now-(peaceMotionStartedAt||now))*.001)*.75;
 const W=480,H=270,out=peaceWaveFieldPixels.data,src=peaceWaveSourcePixels,mask=peaceSafeWaterMask;
 out.fill(0);
 for(let y=108;y<H;y++){
  const depth=Math.max(0,Math.min(1,(y-108)/162));
  const amp=.8+2.7*Math.pow(depth,1.2);
  for(let x=2;x<W-2;x++){
   const k=(y*W+x)*4,alpha=mask[k+3];
   if(alpha<85)continue;
   // Coupled shallow/long-range waves move water COLOR TEXTURE, never light.
   const dx=amp*(.65*Math.sin(x*.13+y*.046-t*1.03)+.35*Math.sin(x*.068-y*.122+t*.73));
   const dy=(.15+1.25*depth)*(.75*Math.sin(x*.096+y*.186-t*.92)+.25*Math.sin(x*.132-y*.09+t*.54));
   const sx=Math.round(x+dx),sy=Math.round(y+dy);
   if(sx<0||sx>=W||sy<0||sy>=H)continue;
   const j=(sy*W+sx)*4,srcAlpha=mask[j+3];
   if(srcAlpha<85)continue;
   out[k]=src[j];out[k+1]=src[j+1];out[k+2]=src[j+2];
   out[k+3]=Math.min(alpha,srcAlpha);
  }
 }
 peaceWaveFieldContext.putImageData(peaceWaveFieldPixels,0,0);
 c.clearRect(0,0,960,540);
 c.drawImage(peaceWaveFieldCanvas,0,0,960,540);
 if(!peaceWaterMaskSource)throw Error('PEACE_V12_WATER_MATTE_MISSING');
 c.save();c.globalCompositeOperation='destination-in';
 c.drawImage(peaceWaterMaskSource,0,0,960,540);c.restore();
}
function schedulePeaceRealGeometry(){
 // The art appears first; the exact existing H-Earth construction runs after
 // the transition rather than synchronously in the user's Begin click.
 if(peaceGeometryScheduled||peaceGL)return;
 peaceGeometryScheduled=true;
 setTimeout(()=>{
  if(selected!==4||peaceGL){peaceGeometryScheduled=false;return;}
  try{setupPeaceGLFallback();}catch(error){console.error('Peace admitted geometry:',error);}
  peaceGeometryScheduled=false;requestFrame();
 },reduced?160:3700);
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
 if(peaceCinemaState==='error'){setupPeaceGLFallback();return;}
 schedulePeaceRealGeometry();
}
function setupPeaceGLFallback(){if(peaceGL)return;
 peaceGL=peaceCanvas.getContext('webgl',{alpha:true,antialias:false,powerPreference:'low-power'});
 if(!peaceGL)throw Error('Peace coast WebGL unavailable');
 peaceProgram=peaceLink(peaceVertex,peaceFragment);peaceSkyProgram=peaceLink(peaceSkyVertex,peaceSkyFragment);
 for(const n of ['aPosition','aNormal'])peaceLoc[n]=peaceGL.getAttribLocation(peaceProgram,n);
 for(const n of ['uViewport','uTime','uKind'])peaceLoc[n]=peaceGL.getUniformLocation(peaceProgram,n);
 peaceSkyLoc.aXY=peaceGL.getAttribLocation(peaceSkyProgram,'aXY');for(const n of ['uAspect','uTime'])peaceSkyLoc[n]=peaceGL.getUniformLocation(peaceSkyProgram,n);
 const upload=data=>{const b=peaceGL.createBuffer();peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,b);peaceGL.bufferData(peaceGL.ARRAY_BUFFER,data,peaceGL.STATIC_DRAW);return{buffer:b,count:data.length/6};};
 const groups=peaceBuildKernelMeshes(peaceKernelFacade);
 peaceOcean=upload(groups[0]);peaceShore=upload(groups[1]);peaceIslands=upload(groups[2]);peaceRocks=upload(groups[3]);
 peaceSkyBuffer=peaceGL.createBuffer();peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,peaceSkyBuffer);peaceGL.bufferData(peaceGL.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),peaceGL.STATIC_DRAW);
 peaceGL.enable(peaceGL.DEPTH_TEST);peaceGL.clearColor(0,0,0,0);
}
function drawPeaceWorld(t){
 updatePeaceCinema();
 if(!peaceGL)return;
 const r=peaceCanvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));
 if(peaceCanvas.width!==w||peaceCanvas.height!==h){peaceCanvas.width=w;peaceCanvas.height=h;}
 peaceGL.viewport(0,0,w,h);peaceGL.clear(peaceGL.COLOR_BUFFER_BIT|peaceGL.DEPTH_BUFFER_BIT);
 if(peaceCinemaState==='error'){
 peaceGL.disable(peaceGL.DEPTH_TEST);peaceGL.useProgram(peaceSkyProgram);peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,peaceSkyBuffer);
 peaceGL.vertexAttribPointer(peaceSkyLoc.aXY,2,peaceGL.FLOAT,false,0,0);peaceGL.enableVertexAttribArray(peaceSkyLoc.aXY);
 peaceGL.uniform1f(peaceSkyLoc.uTime,t);peaceGL.uniform1f(peaceSkyLoc.uAspect,w/h);peaceGL.drawArrays(peaceGL.TRIANGLES,0,3);
 }
 peaceGL.enable(peaceGL.DEPTH_TEST);peaceGL.useProgram(peaceProgram);peaceGL.uniform2f(peaceLoc.uViewport,w/h,1);peaceGL.uniform1f(peaceLoc.uTime,t);
 const draw=(mesh,kind)=>{peaceGL.bindBuffer(peaceGL.ARRAY_BUFFER,mesh.buffer);peaceGL.vertexAttribPointer(peaceLoc.aPosition,3,peaceGL.FLOAT,false,24,0);peaceGL.enableVertexAttribArray(peaceLoc.aPosition);peaceGL.vertexAttribPointer(peaceLoc.aNormal,3,peaceGL.FLOAT,false,24,12);peaceGL.enableVertexAttribArray(peaceLoc.aNormal);peaceGL.uniform1f(peaceLoc.uKind,kind);peaceGL.drawArrays(peaceGL.TRIANGLES,0,mesh.count);};
 if(peaceCinemaState==='error'){draw(peaceOcean,0);draw(peaceShore,1);draw(peaceIslands,2);}
 draw(peaceRocks,3);
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
uniform vec3 uCenter,uOffset;uniform float uRadius,uZoom,uCameraZ;uniform mediump float uWorld,uAtmosphere;uniform vec2 uView;
varying vec3 vWorld,vNormal,vLocal;varying float vFacet;
float gratitudeTectonic(vec3 p){
 vec3 q=p+vec3(.12*sin(p.y*6.2+p.z*3.8),.10*sin(p.z*8.0-p.x*4.0),.13*sin(p.x*5.3+p.y*7.3));
 return .40*sin(q.x*9.8+q.z*3.2)+.28*cos(q.y*11.1-q.z*5.3)
       +.20*sin(q.z*12.5+q.x*4.9+q.y*3.1)+.12*sin((q.x+q.y)*18.1-q.z*3.5);
}
void main(){
 vFacet=abs(aFacet);
 vec3 local=aPosition;
 // Only book Summit I (legacy slot 4) receives rocky island relief.
 if(uWorld>3.5&&uWorld<4.5&&uAtmosphere<.5){
  float shelf=.5+.5*gratitudeTectonic(normalize(local));
  float land=smoothstep(.59,.72,shelf);
  local*=1.0+.014*land+.033*land*land;
 }
 vec3 world=local*uRadius+uCenter;vec3 view=world-uOffset;
 float perspective=uCameraZ/max(.48,uCameraZ-view.z);
 gl_Position=vec4(view.xy/uView*uZoom*perspective,-view.z/20.0,1.0);
 vWorld=world;vNormal=aNormal;vLocal=aPosition;
}`;
const fragmentSource=`precision mediump float;
uniform sampler2D uGratitudeAtlas;
uniform float uGratitudeAtlasReady;

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
// Shared macro geography with the summit-I-only vertex displacement.
// Warped, crossed ridges form archipelagos rather than parallel latitude bands.
float gratitudeTectonic(vec3 p){
 vec3 q=p+vec3(.12*sin(p.y*6.2+p.z*3.8),.10*sin(p.z*8.0-p.x*4.0),.13*sin(p.x*5.3+p.y*7.3));
 return .40*sin(q.x*9.8+q.z*3.2)+.28*cos(q.y*11.1-q.z*5.3)
       +.20*sin(q.z*12.5+q.x*4.9+q.y*3.1)+.12*sin((q.x+q.y)*18.1-q.z*3.5);
}
void main() {
 vec3 n=normalize(vNormal);
 // One preapproved image-backed, sphere-anchored orbital look. The previous
 // Gratitude material remains the deterministic fallback until texture READY.
 // The other 8 planets, all entered worlds and the heart use prior code.
 if(uHeart<.5&&uWorld>3.5&&uWorld<4.5&&uAtmosphere<.5&&uGratitudeAtlasReady>.5){
   vec3 q=normalize(vLocal);
   float lon=atan(q.x,q.z),lat=asin(clamp(q.y,-1.0,1.0));
   vec2 atlasUV=vec2(fract(lon/6.28318530718+.5),lat/3.14159265359+.5);
   vec3 sourceRGB=texture2D(uGratitudeAtlas,atlasUV).rgb;
   // Source already carries the approved cloud-bank shading and terminator.
   // Do not double-light its baked atmosphere or regenerate meteorology.
   float rim=pow(1.-abs(q.z),8.);
   gl_FragColor=vec4(sourceRGB+vec3(.014,.025,.029)*rim*.4,1.);
   return;
 }
 vec3 light=normalize(-vWorld+vec3(-.2,.25,.15));
 float diffuse=max(0.,dot(n,light));
 float rim=pow(1.-max(0.,n.z),2.8);
 float rough=.65, glow=0., grain=0., metal=.05;
 vec3 p=normalize(vLocal);
 vec3 material=uColor;
 if(uAtmosphere>.5){
   if(uWorld>3.5&&uWorld<4.5){
     // A thin, transparent layer above Gratitude's real surface: humidity and cloud banks.
     // Time only advects this atmosphere; the rock/ocean surface stays still.
     float bank=fbm(p*7.2+vec3(uTime*.006,-uTime*.003,4.1));
     float wisps=fbm(p*13.1+vec3(3.1,uTime*.004,-1.2));
     float moisture=smoothstep(.53,.72,bank*.78+wisps*.22);
     float airRim=pow(1.0-max(0.0,n.z),3.0);
     vec3 lagoonAir=mix(vec3(.085,.39,.49),vec3(.84,.95,.90),moisture);
     gl_FragColor=vec4(vec3(.08,.21,.25)*(.50+.60*airRim),clamp(.008+.055*airRim,0.,.09));
     return;
   }
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
   } else if(uWorld<4.5) { // Gratitude, book Summit I: Golden Lagoon planetary archipelago
     // Layer ONE: a recognizable world seen from orbit. Its accepted entered
     // Golden Lagoon is layer TWO, rendered by the unchanged encounter system.
     float macro=.5+.5*gratitudeTectonic(p);
     float coastalNoise=fbm(p*17.3+vec3(7.2,1.5,-3.8));
     float shelf=clamp(macro+.060*(coastalNoise-.48),0.,1.);
     float islands=smoothstep(.58,.69,shelf);
     float shallows=smoothstep(.37,.59,shelf);
     float reef=smoothstep(.45,.56,shelf)*(1.-smoothstep(.61,.70,shelf));
     vec3 abyss=vec3(.008,.075,.135);
     vec3 ocean=mix(abyss,vec3(.025,.23,.31),smoothstep(.22,.47,shelf));
     ocean=mix(ocean,vec3(.045,.61,.58),shallows*.88);
     ocean=mix(ocean,vec3(.25,.82,.72),reef*.58);
     float canopy=fbm(p*14.7+vec3(1.9,8.3,-4.1));
     float limestone=smoothstep(.59,.79,fbm(p*19.5+vec3(3.7,-1.8,5.1)));
     vec3 tropic=mix(vec3(.69,.64,.50),vec3(.115,.33,.15),smoothstep(.36,.72,canopy)*.86);
     tropic=mix(tropic,vec3(.87,.81,.64),limestone*.68);
     material=mix(ocean,tropic,islands);
     // The coast remains crisp, not glassy: low specular, real rock relief
     // and atmospheric depth on a separately drawn transparent outer shell.
     rough=.84;metal=.012;glow=reef*.017;
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
 // Gratitude receives a diffuse tropical daylight fill, not glass reflections.
 // The source-material coastline remains visible on the near hemisphere.
 float gratitudeNearFace=(uHeart<.5&&uWorld>3.5&&uWorld<4.5&&uAtmosphere<.5)?1.:0.;
 float gratitudeViewFill=max(0.,dot(n,normalize(vec3(-.34,.54,1.0))));
 halfLambert=max(halfLambert,gratitudeNearFace*(.56+.28*gratitudeViewFill));
 float spec=pow(max(0.,dot(reflect(-light,n),vec3(0.,0.,1.))),mix(8.,44.,1.-rough));
 vec3 shaded=material*halfLambert;
 if(gratitudeNearFace>.5){
   float coastRelief=smoothstep(.15,.72,abs(gratitudeTectonic(p)));
   shaded*=.94+.08*coastRelief;
   float atmosphereEdge=pow(1.-abs(n.z),2.4);
   shaded+=vec3(.018,.065,.085)*atmosphereEdge*.27;
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
  for(const name of ['uCenter','uOffset','uRadius','uZoom','uView','uColor','uHeart','uSelected','uWorld','uCameraZ','uAtmosphere','uTime','uGratitudeAtlas','uGratitudeAtlasReady'])loc[name]=gl.getUniformLocation(program,name);
  gratitudeAtlasTexture=gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,gratitudeAtlasTexture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,1,1,0,gl.RGB,gl.UNSIGNED_BYTE,new Uint8Array([38,54,58]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gratitudeAtlasLoaded=false;gratitudeAtlasError=null;
  const image=new Image();
  image.onload=()=>{
    try {
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,gratitudeAtlasTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
      gratitudeAtlasLoaded=true;requestFrame();
    }catch(error){gratitudeAtlasError=String(error);gratitudeAtlasLoaded=false;requestFrame();}
  };
  image.onerror=()=>{gratitudeAtlasError='GRATITUDE_ORBIT_ATLAS_LOAD_FAILED';gratitudeAtlasLoaded=false;requestFrame();};
  image.src='data:image/webp;base64,UklGRoT8AgBXRUJQVlA4IHj8AgCwoRGdASoACAAEPhUIg0GhEMjcyAwAolpbVv2vZn8uh///J9aY+lM/7H7yEVP4B64lP7o8aW0P99sDiD9g/a+BT6P/fPYA/V7z+/7PuvOy/8b2DP6x/mPVazLP6/n0ejX9h9FdqI0nf43EAP0/f1Lsp/afdj9wPy3+eDlP0E+/frP1D+UP4E/7P/D+YH+q8a/q//d/4fy6/yvxye3/0v+e/zP+g/239x////2+4v/t/+P5nfPz+b/8//yfX/+CH8b/n3+A/u/+J/3X9v////w/FH5l/E7/H//D8uvh5/Sf8H/tv87/r//R+/////M3/zf8z+7fDD/J/8D/of5z/CfIR/L/65/xvzr+PT2gv3b9gH+gf4r/ofnR8y3/l/8v+x/1n/8+o3+nf6X/y/6H/Zf/r/b/Yb/Mv7Z/0/2l//v+x+gD/xf//3nf4B/zv//7p/8A/ff/mezP43/9PPJ8i/1fAntV/yf5efO5ib+X8Df6D/D/+P+69j//J4m/lv9p6F/5r/bvvg/Lb52v8vPn1z/3ekN48/8P50/6/4XO9XtP96/La9uP+X52/+L/t+wb+mv/L/k/db/7f/n/uPXt+f/vh/vPgL/nv9z/7v+R/K35y///7rv3h/+fuh/tT/+woeiLYWiVpns924H/EVrBSoTZ1qwwi6mfDtfIZuncIzNEevVrvw2+CbiYKa3a15X4bZGfYEb4vl/enww2wwZm6qQVbVWjve5c2KJ3a1r6toEgCfRmglYF7hARRsWXBOGy6QqumFW4aYkC/wmJG0wYXwGaI9K/ml23oM3TkG3oJRErXOBHgM+UKJMIbmCpKh7oDTCDeNB5E3+WoTe4VLogKR0HnlBSFzphonvEit8iiDrVi7tXpDAlPr0BJW6KU0YmlCAPBXt69W42ZooR1vGphe5josxmd7h3DVdCeTK9+32m6FRH3qTqFkPZvCi4ii85R1nx2ok51JDSj0kLkWJ55tRvnYDaflaVY5E7kPhNtNjycd4/2WovpnC7yWhGJNBeG1XNF75vlG5i3of/1HYDpY4I11q7YZyVb9clFqxstZbielUbAoDoCkdMpO/HogjNoJJMTNRhv8oI3bYRKCIklyZ+tV1uaoDmcqrYrDLXFNhzDTj/Eg+hvLU6YbfgfOM4Z9gAeS/mADo4qML1NIrH/6C1zu9EmatbvrqVE9prPD5Z4IYk9p25HHSSaIq+pE7t++yX41rK8OpwgsBJTl29hLsQuXt0PN51h1jRBQGhWOcemE+zjUFtAYhjEppI9FhyyntL2I/+6G+Ed3q9MLe2FNqv/6CtTs7nPlIIAHfgwOJGGbd2r/KdxTdNKVHTLglwnbSV5cp3sdSBhu/lCM9GDji1wlMJMMgzFH2Bs/iIAU/0kgWtwkbFGJUX213YSBA80kYHh3VD1GC0ZNh3Z7y8Kg20CRzUIw8hK0QS8KKalAU0XE1diuLGKVsU0ezQNaBko35Vmr86mCq5V3bPT0nMV0IUdoT739V01lHm38JGCTTWZIsSqHFDfcPUsSV9ZOp2ZmPF9eiUsxovPHct1d+a9TU3qzgQee1vmXZrKU7JEb7VP71HZORRq7Rd4L6tsQrBVIDHDNIbTRx4ZnhijNTr+LU4CIrZvyv2SQASsufnWpFneb8e/N+ZYv1wxclDmsjN1lSD7pnzWAoRjZlKeLNaWaaP3wS/Ztddt0/kEJDkIXuOYye/chMoo3o2sxGR3G7R5dZHAnLdoh/1VOc833WNgkkGEvIJykipjgxghIN9nYzZwGmifNTTcpVBquKGDp/sHPdaIburzuxX/+K35zuuyPZdVuEN+xOanQYooqMmk5abKy21A2+zq4c6j6dkzXLj/vZq/Os6E+642BCZop3OStLfq0Q3B6Z8OKrXhIaj4u8nKznRcZCxS6azInKddjsM4CYcjYgqzazj///XvtpApzJa/CS84rDq6AwuQMREIsSiSQ5BNmx3tlN04WF596NXg94osfiqhhFUyIDe/QI9Mj1tcLn3traEOjcnbBFinknkIrXPFLfZArDG7dvTbCLhHH5bkBl4N5t0HddxyM81k4NeboWJcDHEpnUSTDqpsGbNjOMJ32zI/rhNazV630e1XLvGouxdRH/C4ZuLp5Yl4Z5bAG6ebS8GZRw0srZ1zH9DYCfrymgsRl1I6z2aaebbWE7LRpyVrb7bFS/jEdLx/+T6JBMRAaZaNsF50jTyt5BkhferhwqBhf8rNmjg86lQgOoipWr7Is2OOsRLv5RX8/2eieXGiXM1IFLoP/4YFVVocdFlojPonYRuPgO/KGdZjji0NK0p+LdYxWnaJFCXVRUFOtjgFxqAQxDLaXgvPmUYZwl7rk/dpBs+jM+QJhVGOtKTplJbgliZZYUYcQBCbA9Jpp8nPOus8aYFxV9cr8sos3LTYS+GGrpWuD19NlxxEBjvFXoOjAxpoujxUWYOAvtuotWTIxe5Ecmq3iyQShB5u3B2g9EZvTbjXPLpOVmCNmVDuZyvKM3uz/LG/BeIcBaCGIONqL5rJE9xAX8wMJQ6VA9tHWoMw7VqepMIa/J0AyS2NokZP5XND4KGnD7I73H9FWjtC0oHRv5V7nA+K0uBpocr82J5X8OcFvt9mCfhUTEvEvCkj/S+aEQA73nbNnEriCxRO1mW5HHBYkGrgFcqUnzYBGcC9mkZU+eXyiiB32orXx4CyspG5+l9hE+G44JLrIHkEZrXEu6igHg5u9rL7RwXcwG5f9zHK56GGlqJmG1v5MY/13hIoNa+Qk2hsJjBIyz4+cAbnYFuR57y3Dt/1u5pK6xkJLVnVJsIOB46ES/n6w3AErK7YahxAKJcdHjS6gO43Qhwc3Jx/M9IGNtcu+Pp5d7c9TPGCnVNhj67cNVdACjdR4T6rZzB1RFT2XYWR0oYFX1IU3U/VVLGJdxrdN4FZQNQ1GSXHrHXBdx1ul0I6Z/mAES4Mn94/1czYXUvT7bfqaQ+jmaToCG9TkSeB/j/+l03i4mhVkjTdM08613LaADHu/yqLMMim8iPG6/snp+Gct3IZI0wrcoa2EXq1UMXRmGgZA1LlIkrFrJxB9Y+j/9VV5fGYJQyfOqolem0mTh4ycV1IP+a6G78ASOIGT/07ib9ZFYNUPviqdUmKKm6a8HsRk1XTtorqua7BBj2sdSwR+S53tliRW5xJ3A+kjXMjVB0NxCOrj2yCVUClSabOOAN3qs60JRhhafOGLl1mm/eF1bDCvfjYjOhqlCmiAM7+igCa9X42xaTBgowplOqCL66ayGJsQJu7LSe9RMWqOpNFXBPhxPCdFJ+dwG1lHI1KRTvrvc8cccHwqEj9ar0KbuATAL8r8c95g8OmLx938MyeoFgDnavI9TGHB1vvQ4IMz8sBatAMYpJ62mH2fct/rOcYrmscZDOAZtHLW6o/zORxlnp0AgmjKoygoGp2M4KRS5bfyPKQk+5d5SvZJ6fnKe8NetVbzfa5syiCoIYLJEpYUiPXsKJ2Mud6hVTCRK//bCKZx/+CUuwxklH04VdR0YfYjLzLmTHa3FaO4eLDRawnSDCdmF3A9F7T8rZIHbEdwyT9xx5yP4oQJ2+taXL6LPum7Bm3yRQ2yLHeukghTRe79YdESR+bBEQ8bcFYA5r0a+/3IR0Ts9sh8OTlPY628La3BLtX0+yiT/7psHkgqYjozGbtm8GhPyyfjqYDDQ+ioyC70PKBgVMRvWc8H7enTls1pvPOJNkuF0E0HxXnEIih6Bqu6i68TWYmmXjSB1GZKn29rIwEA8gvXZfNknfd83zX7xj/DIYp30nzHcJaykizw7p7Igo9hhyU7Q6aPNaqqRuSMllhopfzlH3OrLjGQqdr9HwSZ23YS5hS7ZfMtwAe3810Dw+5vw7OIULs0i5CBTDsdxPZKJC/6Tjxqgtgxm8YfrsOYwnA7Aq6t4zBatB7g7x83v6D7O7VtgJRcEcTmB9oOXsEziDBI+5Q9/zwADuRfjKYaBh1bjuZjW85ED6jj4/O18Eu7XhbVqk8OAiEugpAQ9QzAKJG8LSwP8+i/OEiaSWibFBIjt4+Pfw8AhcGPhsQM4YyacNSCh00FRNvQohhzpw8rAHEG1pkufppZ0A5o44HL5C+73tJTgvobD9z20ds+8UzU3GTIAHwt0r+Km4VQKaFs7fCE9wY7wnu4iiQSGFMsY+cYPedk334aDF6le/BsfTkaj5kGYHtb4W/w33KaMc+2Q1AB75+UFiiOHPTKrnwQye2D/xnK0Ec9ftJYOj0/i2FpdHSm6mU30C9YvYSmNd61Tc2OIWzXypIv3ml+yo6kP/LBTN4+m9l7P9AYK4GmyHYL41FOEBa+uDnkKZlfCS8Aeb+2hg+bbJJwnCu4Ouz3vcbsAc4Zz1rf+7ziLshcjrQWc+CtWFV6282Lx28yd2c2fbAHk85/xHHGRlyaYrYA4v0Xq7z38nW0+POtRZzz/g+9GyKcxVVaTduoStSvUStNNGCh7gcPeVPe+isW3mi8UxSgdv0SIi2NMXk9aCd+bCB6qQBYDGbnCBj59CEqzOnN6kEdaT0KrU+63CvD84yToJF19RVFMbkkbZakNQbtRqH6cKLDEFXQKX2H3TL7f6JSE2pAzrOembWVZ/vCcmOGyD0m63rx2zkQ265UzpJfsfjDLPH1gtvm69sODNEoQCPh6svwekiSps3xPgxF80OH25qlkR3pjsFVspZDKwLydNIZb3AGI+Dt1xvuuCfN6qmbl7SFoZlCsocunPJRM5ZNt3KMGFXvTfr2AUP6ejNCQHZyk0osIUdrbgqOgc3Gw3hotjqdq933Ax85kYydwuif5P/NsxfUoYjCeala76aifirfQqv/MaPbKT6tpjtBs0xjYR9LPs+AIC06WGYWRqPNeUDRLGSoYVm2qvahfbgfh86LHe9eWKRJhxNdEM87NIIXu5hX0VSDjLqgMKRK74g7f2gA67YhYh3SFsgu4lpheVmNLoNCnPcwYWQEJ6BD0SZftBkb5N4ZDHKetvidRSQmjNov9NeViXzPFg/ZLeQVM4uoXPiS5WqE2Yk65FZZGYM/2zzjdYKnI6t+UOHIIwgW9l+cl1LY93pU4Dd/gNn69Tjj62udD+GAEeUFToAaYTKN/Up8M4i9px5cm2Re2tYWXdK5iCPNjLnuGUn26Dh5h6T0fLm99e4fLGf894QhCe/t06LjXSaHTBudGxDoNCIbTV4IDt3Pm1yFC36nPrjZX6Rhb8CYHRHWXak7TNhyI2sBB2aMTvco1N4iR8kI74EHmw+A/qHLMT50t2EB4X46CCj6UC6yOgUZKn8RpTSO1xzEdlXWtpGe97Oxeql4QeCbElcF8NNrW3ktEkkLJ+/DgXLBPJf86fjuEVslTt8ewcs38ZmlTbO7Oby6LqQ+S0THzMu3zTHFmm9T3LNTS7fiBcLy/H+K9YgwYzP5Pyd93P49H2xTbtRKDXetL9nXvTnzSxnaor3hNsb8cBFkFuMhbPUaZEad13Tip++2ecnvmOtV3Yg3T+yIMNbskx0gx1FRksS2W2x2lRDYNWBJwN/kZj7XfUsF7uBwt1QsDiBsfP9++kBU52wOvia2cv3ljMIbdLiKZQ9FLa6ht3JIvlkTG2Qq8f7/sqKd5LkH8vlKgddQSEV52q3LTyJ/YvbKv5Pl1TYoXGKMWFJJxCX9TV2Ov/lF+VwdQFObJicogoHejWaevLWVqEonFkQ6UL/aAR9lLjKEpPsPog0G5jnu1vDjm5Af42sfxWs9zlohVxLE4PhAPzbIkcT+Gs/2x/3dr3Ph6jtIYJ6QieC19G0Wx2yd100mtCrTYRVqLy0xk5zQBYuZ9uGLPur3rzyxiBssiGBSw0lqeZtrtuhHopmIRPQtJMoK0g7lF7HGcbhrOcgohhHCQ9KYsAJLsBOoOAZ0/qmm0aF6mt/eR9njpGfDoYF1Rrrqt7Cq1ZF6viJ7rnStI2vuisEVJgFOL2MsEZ1HVfP2j6gtfD4cMPwbZRR6tKkmVatkNM6TdaJOndhxwWjrG3GFKdPWNNdwPcohPI5KBW7GOXBQvHeY+UW+PNuV9XhEkDp9crjCgcyD6vXfL4Ywt/6bsJ3b38+g/Nz89x6uCPeD1/63hPydPgTMFbXssSejFdvvL22K83ltr2cqOGstbQAyZ1bI39RhW3c8iNEsCAVA2ZbbwCtGyRu7YuQsJSQ2hggBg89FVZhTHD0k53vTzOqtHyK8v1R8xwZWnw7+se7hntjFNIkKnH5kbtfLzbhrX1HZ6eiTl5QaJWb+1YyzrEMsi2NnpSg1h3sv8D+aTFj0Tw0gYd7vYmwZPi4s8pklu4wNHeUGcPs2U/SwkVcpqQj9G8h0Qc0b/D7T+ykJBlzIyJ4/UlOIACtpFAM4A4marIbZKV5WMAqeSQThmHZZIk/383pFh7a7f2e9jxnmLYz9TiJBbzZmEXtRnoPyDATy9xztxdQI/5mG5HWdoaNeptx6Uh8WdIFXjo3DkWebSh3turXoxbtQsyBRL8vPt6orr1s3TA3HF+l0ywuaMPj4ajibY51FRr1ZuA57tVMAT4Kj61pjyzqWdwROPLi6dL+PnF1hdIapa0TjrbQzvsN2Hv3Q5kS1+vkPp4tMNL8ULuf8iSMn3gDS8oqO0cfnHfKwRMMlJn6XeBHXofe4eQIR7ZPQ6AnC1NNyiN6ppz5X9sO2pLrH+CF9LYL41FPk1DWVmBibkROMuUM2syeOkwbj070vETFe4KmbpSn5V63iaeUIqiipbJmWxzIz1Vx3qD7MIuHl8QngoMisF1S/fgIFKW4kOZsT3oo3SLxR1aV6r8hdKkw365+zJUtfAGAvPiMwRd2iE/oYj5xfsRbJy/SotInFRCksNEXcTeXa9tQzUnUjRFDMFkILr3eAGADbeHTgX+44xK4SFxz4ayQxFXM7+afkQjv/HQiGOtCAtd8FlnCXbG2Bz9f4Fb1DDFLzAp6tX1lxr4wUrEdPMwvHKc7dURNkOUp+O98MiGmGp23FaAE7/boP/pdyEpySHyVy0bXhhB7q0muaPqbRcx2xnHQmyDxF/d0JOF28tOX2cGF4DQecYA31D6NRPTLdZpZ2mDCVqctH0IybhGVpW6T3McMYW4sm8pHE3Unz1OTKz7Guc/Gi0avxN/9KjkwZLsoGnPcKE4fPRynx8i2GPQAh9lJIjKPLxnQCBRbYxaXBTe3ew+Wke0sPYiy6m0pZ01aTUQvbCwjkCEln7vdeZi/nWIJCsLFKcb5e1V7OqzUo1qFK7Jv3it5lyy0WWZhtPsPyb2OOBhdsWgjleFxu0TjICHbXl1LBDtIJevXLGDPnqmvRQMKnjrEQa1fayQfecqzoPybNuQfYgRQdPSkRynB4zGY6RAvnSfpdNokUMkNihJUurrEIU0311lpw0vfb0wjQgQwkXFYSsLIBqQeQP+6acup7ztmfKp1eLPiF4Gvlc1HXwT54Tm6S87R8IldFbCBVuqiYUa8e7vjrunMyhV9CtjEd/LYd7f0inRLvP6mKERQSTFlAuHRV0N3mDjsJquxCSe1NmZ5t8iTHWxs4GhNAlX2gfIqljUUhzX1ukYEh8EN3qtQy8xg5LoW4hR/tiRzlfHjmyiNzzjniM18vcj+mnu0u+SnvyRq73IiCzk3qeZsrmZ9VxAr2wTfKJp7z7EmxQQkYyohN7eHrD2LtMDmMw6C6isC+glB8PtEgmO7IsYK6MwDxUh+8NKku2pRRXKJnSnd9FCo1xrmOUB7H4VbPGHYQ4A+Mzp7iK3Onof02N7XGqUGp0lt5k/zsOTj2WNCBet4OZvdLumhc7D2Aj4xLTHpRx0JU8JKiBO+657fyGkBc67CyCHoDbjfUu0FNeZwdYCdazMMo+cCCmFrOEZfoU3Stjo1HdpWmfUC/t3klntGvmgDBYhjF3hmTNBUBAATHcK0dnthRzbGLMuKa8+zoWh3/z0paW26r1efZ7YW6pPA+yIDAcOJYhw3NQZeoVcB7bcMUxTJWzlWtFm7EAyvzhE53ndzCbMZGAA9sm16Ymn37aEu+jDeQQ21S1y3Sl/i8ZhrA/dbwYWN+D37DDCEt8NPZkdiF98CYR63anD9N/wwspWQCqpKXv5Gmp0isSmoUBMNNXmlVwQv2iWnJfTkV+yU4RhpBdHVXt8v7UeblgDHyrIUp/NrNSvBBLTmt+PbHPmw9b/rbizUUCMA0vV7WDgn3YXuJpOt+1nCoyZdwT6WC4kkkmRufZS7u7acg0ZiuQ78g7YDsof5x9fvtNnxllp1rGqza/AffUKAVvQt8wpIU0fW/u6lytt/qkMUMDnYMsnCGRl7O3lV2KmwcPc54DzjPpVjWEw3yt+cR9gskHEE+1DV3wtuqBhql3MnfFQwdis6iTpmtiCLgbWRO31u2crz9iaY2f+XSxp2dEvhpoeF9VI+uIxDGvbubk94fKoXIbSvoO2FyrfCBpSUn1s2z+Yr7IZSHLBui7VdB4VJlOJlrtGHJu/qn8c1Ivysz1IMJWI76U0iPKjCI99N6DcYvPihkor15T7dcBNsE8lKVZWjM8eKjH90zRP9reuCoR5KVztmZ5vWKd6ZOfAskUJ27vEe1uhQ8kbMyXX510yBVtirPq//mk9DwckjobSufO2JARkyzXuSjM1DGy/tkFf0ZOFAeM17s8+8B5tXJ8YxPw2+zu/06lQDgYgrCsVXa3ILIGwavlOfFVnVpQJg4hDK9O5x+0IRrnwe4RkfsSGoQ61DrBEshaKszMcw4MDF/yOrTallq0p8Pk/531AwQq4ybXtQkHavw62ZVXrPZLQfjxSoeN5mNGwG7BkAizB75YkMA0N7qteSYumV0sffRnUizVEqDj0PVvB2r0KPPPgxcleXWBngZ/+W42NWqZ46cd8sBnpHF9gyJNi0jjWZBqjNfy5UsBKw3v2OQm36RZBuVkM+QQxZSIxMEg7z7iWe9oztBDB37JI3p9ilrZYM8SbFTKR8LzpvxjUZ8/+i2nx/Ef/4nLgmwR0v7DVCDH3363Ptw8uMpE/jKVJI8FV3h4lXnXVbIY0Ww+4urtGPT/njdstil/DtHQ6ZKSWYA16m+LyhdUK4/kkAmD50xKwVSZfh9yoISbyzgGpyIF4Lr+0/WsKojG1KS6Bm5FWtsJCeXDcC0utk3172BZZV/YGq9C8ln7h5i3jEqxGrX1BbH119fjIV03Ig5ZqB8jZ5BFNuaXifJPIgiFixsWoor9BS57koOMyPAv/nMHviJ6+ZU+KfnWRaPz4HEuUKLSPyXxcqmPg/tt4KK6nAAUgPIkD0vTy4l1KqjiupaO2Rp7+cx1Yps/ghQcODiXG54yQGdXCFT5XOjnARmrpJ/en7IVvkiVcnvhMXHeQ/ftQ9VW6ym+GoG4D/AVCQ+cNwa0kuxyNEk9sM2kjZOVtZuVhXQBy2OvHO8qIwrEWk/aHXoyuwkDoP4jjJYa217quA9TO9mYxK85LPv/0Kfs2uO30GsjT7AS2VBEujZQSqQL7GxGB5+p9ayyaajM5bwEjo8ua6HhzXUGaYCYz47eTiXb4Mz5RGmbO1llYb8syyNdSggUJU1Eulaudl9PCfuxmg1ldCHLLWhz9576F0WU5mRc8/50dBW+c6mG01UmHUPUNmJ3pGLR376L7GPVIkXwd/UswgLW+TpnM4W6jnJIBJq4BFZKQfpqDdfMMn06saZW3PWN1ZEMjavW4a4BrvVl9skKb236QkzOw36qT96GN+qk+PzHS0wSSuy9U2OhMJIht0ZRBE/on37nXo8zq9sF04GgqY1ReuFQUAu1NqlI0vRnREQibE1NvbY8R2s+06UqT5cU9fOXD1QsXq9x8Ic8ZcHMW23fPycQhFO/E3CubYctC4mhpwylvfMPq/iT9aoRLYlrmJDWIPztU0l68HUemy/w2yXpQibe1MPrWdZYHNrOljlpBjH+1xZSajIjYWiYWSBP47r1DEiYcyOhVJS4R4t0ob4LEgRTXd9nhwUAY7FJGfwc2S/qgsF0zE2/AyQ5b25aBnSajJk7ueIxXfoKgnNfauNrM322QAJbNPoIf0S0sOyEqs5c+k6yabfDrNKZEMajYIAny/dS603jHHni7Y0FXqga/KPej5QQ4Z3HHKixUCJ/S7u9/sEFqUEnF2DeoM73zpLz36pfQ1X7nWI6LjFzr6WlD7Hk6pUpK9vXZVO7p+Yh7D/YA3tawz/Zzi9OJGypC/XPPZGHRZSZH4ja8bAuYvKeoDxSKSQTlDXhnjxkW2cKrkelK6aRZnn/bjmTjO8WNoowSmt5bWbsVIR5hiydc2HkBr/+O/aDFYCwxzCilVYEb91JDDm43JQ2YKa/sUCUgfRQb963o/xIpWqqH7kn66OjGRH73530zPnmIKx3NgGDo5RalM0RsWMmrB0LV52DPcZnAO+koy4cH1wosKOm91pmcvJxteFfSKbP6L16wE12Bwlz0sk+EWiBsbXVXuGdE3ZHa3He0Zo5dyW/ZlFl5JL66kr+BBEgcSeZ8GwdDGddA4l25djy/lggBB4323ueFuFkEl0zeSuaUy4ipwh+n2yT9qUXatkV+5tWEJn1WcBAWW2W/keJyYDuYIhy0y06jQ0RNpNlvk/orzr5DdkIqtrFaJptqa+fQZ/OTnMp4dv5p8jZLDvRCqxCcFJID1feoke9eRC4ywuUQhmgK8nWmJRpQsk4kgn6WfMupdTteIaoNDI+Yt2aeix8WThEymvyitJFxZiQ/QckTyISNZXoMkvOzLLE1uzxlLw3dBVKSVe+Az6IPUZ7i9lEtHHVX3i9yMo8r5cm6o0JtP6oECMh5zlR4SH3SF5xL1EV4g/y1qwXOluEGkazB33ikHfeVd7ersgR5g870c/JFGC54deeo3hlzq7Kp5QmWs1hFJLMImyO86fudymdXmvjRVwVL7tXPSiO3VUQLIq4RcEd/YLo4wZiOAynowHwiLYLfxXISP4B1dIrSsHGmdlTbaf1Nod9XxKhVLAkOF/kHL9KbPMwQVHnmHzN0fDnnWgHAbFRek6FP6vapvXVlAQOr7NOSnXqClgXxUx7RHACDOnsyDtOZr+WaoDF2P6lzOBdABLmMr0bvsCFMwVnZK36SG5+f87zOmrM8tajevi3s987J1mxyGdF+iefTL7cpoNasNyryxEkoaPcdwI/fLhE+h7YLSGnokMktc8aNfmM7H2AHkuDQeyIiUnAvl55AaMyioGs/1GVn5qyCD+M/AAoYUaPu8uDEmREicthwcDdsheaZWg+NWetr6xG9GmsDXSp9rHySsgR2TbNT6km9sdoFw4fkkef6iHhenJF5n8xbOPgFUChVLeUxSLxeZwNkC4bxC2TSO0slfkP8sEr8PJaugMKaVNJsbG6am4aCWGSYI2Ygm6ZbQ5NVT3uqqlaSQwd9WjEARfjWrX9jfS0dzM7O+Q73Gmew1vpIcqqoRo1HOf+nsNdXaObQDYR2lD4aJvOD9l4Q0NMj7mRnDBFbSdttzSZDUBTdKoSEyU1yysVf4eIs2tlfiX7MJIc2LGQuEmAghlWOCAv8sEjlafIbJOy5MRvHpMStxuYaPebESsOPnkmt5UVw4KMVQq1Gw0rJh71+9L+ZAHqzkr3r83ZN/UlRUhIsXEEKVR2MkSb8aAAvhRFa0DKDnipGNZJSpS7ycPwZ8fHhcE8Z3mFXSgdukqPtrmqtyyEfU6cwdifBFMz9XhC6rdvIJRtG2lnQOtdt7dmQG/vcf3eokO6+Mht7iELPcO35uCxcMz5DRkK30oTJqgO05aHV5LtzU8+pN6GlSKT6ko9MbK6fbjDQy0AmDB903GHGYNEDRwQsvXIdSlf77jctyyP3i+rGpL1MwMYpv6SeceVuXqGuhp4Uq4q38NYc/fiplEy8e7Izm1E7y3Z09rR8h8M7dZcAokTWz2Gp6/zHPU815L5un64DAfxp80pHiUX479PjtsACT2sk4znf9WLfIYcIPfg7bJGlAm/0AL4CgCIBtYMTM+mbC0hERobTSzlvtgpizunhYLkYOKFhvD12HSvS+iLNbbYSGcWMx2deOtJ/ujDt6e+9HKrJzdjV014KZvUjM5hp1daL2GR79iyluP4uabD9vRn3Zpea1SRt/3gb6rK3E/nsXO4cFYw45jhKjakyXHRfz8efcfbds2j+MtpIWxfRdFKqE/iCHDUAXKfAl1RIyezPZybXMEq4aWbzfc+YTac4f6/2bWbJyKRMROpx8+J1rWZvS8gD6r7Be+TJ9fQSj37NbATe5jb9aCx+nZgzb1a83MGfdi3lCe5OR+rS8rCgOk3Di1ExxsY/2gA2YmZCUykQKEN8hp6WvSNMxk61Qw4ZP6Pct7OW8JbBQSMR9l6wU+F/PPlSMlaM1r2+Wr/FE/SGB9IiRBy5Ipb6QKzXSNb35Z440wkKrAHUIXdcUbK+iW5ldfh0jagH51YM/+P/pItxJh1FiQpE7W/b8A0EYljYJP85g1Km20zk6RQ3P5hFe4PQm+yNsXuqj1sWR/0zr9zs6+SUgfUuyk+OF7nyLofJPZpfk6wdeMZ13eukh46pXc+InDDm2NnSO0qGMCD+KAG/J0QzI57DmV9UOZbnsDU/xNrvPR1E9Io3RfURwobE9Xf5tuCgxfDLA7WXXV8s4t9yGtjkAiDunXcHEICuyPq96q19ZePQNJPNYZH5U9WxsT9DyKhXKOA4NiA8bBC8vAX9odM9Ry1/WEw9TdMJeePDUOm3C4WPsTG6JBMZgFIhjtbUJgQRcntJ6x2erk9yxM/qHINQMJOQFcVVuKErfmizlabK7IqcrgteexPoFSXbGM9YEc+3705KxnkxRUSUjri1qboBqWQiyxZwgFM/MLa4HMK0yDrE5SVdLxSu2ZjYraGBonFTt/2YPU6uwiPzdCEiU7KZkTOElv///ENKSNX1Ap9lupWoJFvcnZDrlfgnbE1R/icwhX9ki/8oQQVwWLrAF5kZ5pDeLhUX56HVKKo4IVAweREbluV5zolS8GorP+2Sv4YB9NVTZ9Pekr2u3GrPsppKiZV1ETtqp5Z65kfOQZTkD5DIwAnygzeHCRId5Y0NN0HHqSQ7VsAuuIBh22ICGoN+JVLTuPZHs0oVEGbHHxBUkVT2lnqwkXORZ54i60MQBc6wYLHYpMPdTOt/n1/MHM60VpUopjK11asH65RNPgGCvWG5C+S5Ds0icEyKSl+Tu75h4o2rmn4Tfui6ijAMp8502vwGb2KDwF+GpY0PLF0I24cyNHqlWSHyk/OTZc63ahH6uuwflC3epeBnidhIlFN/XBB4o4977AFaTMbSYWyLoZChm4TMQS5grS6Neg9eKPyW2g3IHLQPxdq91Y5G3tVeNxGuP+eygzLhgrqTVYPAO4FU5d/+X/GwuBC9k0eHorAKVjQUZbKv1BoiUqYojwh8agkLoSKD3rOIUd0eBTLIMnlAsk4/JaR8ObiQigO50d30h++nrOk++N+M9FivyKb2rLdGgB0KHkg7r5FuFP9ZexKoImARCqV7qbAx5FVtgK9Q1wtrLV+66vlJg52OsP9sL+D2pifeWrWw95QyAXJ0ccGt0VCIYmbnFXU9N1d7Ma9hM2u7uJrp1NrYtfX6rNbo4KYZ9Z9ZzPxVh/UThNMWR5ddbV1koAtH65+AQQ8rPrNbymv+mhkxtJg9+LdrLhxYdNly2e/FCydg9t0NyWj2PWHaknwiH+kYil0jie6t6A9j9+HWNY3Sa9PjmKx3I8f1xXmTae7WxDW9LZh0F3cMtjmF+KJkGLRfoUmEBDMDV5diUsFI2apozbDoIEnRvd660ZhBRHWkn/UFKi3sc14O2H35boIv0cvEEiUWHTnq8MV9tPD0EM9i9qH4lOaQjroY9IwoNA//KLgNPZh5GS75M91r7jSVaGoCNa7rExPr+V//BfGCk2qZiwagd/XDV7B42o4QaPms1/Fzow8KJk5/qXs/3glv+UmH6DqBCG+ZQbTd5nkNdolmwmkLOnho8rKI5fQMdyl/K95jhPwgJEPR41csWN4mIZa5Dfc3/AC+fFSwOJZvLhLQdQ/f5msdqG9XA1V+zAAuQSDdMzWpkh9AxJfxwF0zaPZ9zyQjfm1/AtllaxL3WtDlWMZDzl6vdK4p3KN3uMfKewAa2Pdtcjw3cleNlCejkZ+9FzOrbWmZXMRD8X9M9KqRgCfvdZqb1ubfB5zDZEWaYkWH/CHEDl6aF11ardkXvqNOMrMHghB8oRPiycjncgCBwQw4Ge5qlaTqWEhVv6pkm4WaUg8pWMlICk/8YVw9jkHqtTPkiCCc3v55ic0GsFLGrHP7OMwt978AV7sRlrOep8YTyIM1lVjVNhmTmmh3JRp6OHuL+4M5mNf35jCMEvVprOtS6GI0BgFzzx7WKnKmHVeBSKqRarLWeF9BjqrF1eqKSTt1xU346JX5PqHXemP7kFZw85jMJAQwamhZ1xiSCOy3aIgzNngIEvoNIQFVJYKZS2I7bxFrfgqecJp51TEerAz8WwvsBMYOWmd7vMeyAtCbojiR/7k/cNjTGNzX6/FLF/juNyAYv43tUreHj3HMc7MxXNf4DzmPjWONhn7ubDUGIoxD9TqBz16gxas65tzeh+Q6B+APTZHxkTvrC+yozbvhPhUELefedq/w8iD7lZGWezGCWFmqesUu7CPZY9F/II0vZdyUhX8MVzO8TOUJeedUzS15DfYMxl9xyDOI5e0VuDgXq8Ek991Ipi2uUfA9NhU1kge4fYc8JXntowF8oB02f/dug4b7k9okV3S7OJ6QPc74Jr6reiruxrm1vfGGwjVpe1roCyoLPvXCKpreAVu6A58rs9h1dhf86sb5dFMBtmmYLv9lQ2QMV2eXm8X7b6GKYQc5pLfYFrxzvKfjY6Ve1Z3N3F8R941uAK0D4s3C90J5s2dVpdvTsrCPc67JscSGHuV6n46p7qoT99OoLa55rC6CsEJnW21KCYhwlVUSsH6BpcAzqUTbWutOwB9zWcssYhq8qqebxsTA2agXYr8JFOvP4CGlMAmXKpBrOaROpEQ6aHmJnK5RiOIrPm+9VPIlbMnmuXJXnWwLHCEuwLQYwnHnHtVYsM8kQOpV6IvopHhjmRVJ4Qdfh9hW5fdX2UBwSLjiqAq9ZaFQk/OQp9dAOTUex2QrR3xIc0r6RYSrlbSZyjrKjJueVIdWbrba0PfFxX4tK1Rev1uHPqkUtkb8q56WfAqYb04baQc3DsFd2GeBbu7apRJXxQ0o536C/vKWyya35DJdSlGBqCBQbtrz1UkcME937oHksZx77IKdmnZrQb42tTzkGoYnaCJsxd6DrTRhbfDu81ywrOeyd5YGYrbRMRi9pEnIUEWCkEPvAL1G+krQLfUyNhmiWu+CxR/pKPW3qHZvnNt2wWngc0DJ6DLqMIHn//wMSUEwv6q4FNMbhMOD21bvdSeaxQABv4jIed2v14uZZgDknaXQhHkpEz2YMp4yPpUP4eH9X+zHXwsdau8p+Zl7327yBXOX/laLK/DuqriBhah+rriy5NtsK+ClCpCsStWR9/RfpxiJbv8w35TFf53UFLmT3/3c4zHszrO3zLAYK/E1P4d3/HAmrGe5xP3mugReLPJSWa1x+ZNjsco/ODcQs8jw+i0C/q08omXsfd5h1DV5SxickWGQ++SWa/gtQF20AA9XqO4r/fudCrUn34A1wWsV9t17rhmhwdu6l4ntbjN9nenT1Ar7S8VH5tp3h1Emqjql/Dtvs7kkpKuE0EDrsUuUv+G/BQPZpNdoC3qwpm7VcHP1xE9+Zm2X12RleHgUUJYLq/m8jcHnRXMDoWPS5lRyokUv7F4tZJFvGo8W4lrsa1wXn7ZtIXQAyrqvAablfJ2e0iRsooy76KXWxMdmIjYll4hC+syG2Uo10xa7cJpYZn3Y5Vk7iO/CT17GgBHI52fHavyYUVX0A2mnKC8Upsx8ZCV70mWFD2bCglQ7oRxVKdaMIK0jBAOCWXGpZWAr+ti4PJ1s8D9eR+pki82TekTDZto8qZOBzR3/cN4J3pQ3mJ6ZnpnI6T+p8CnPeaYeazQd5KiqVk5pFKr5qNNcWvSJJahpTki59g0gmRMPkIiLfuAyzmZ4YBzTLJJdZOWDrnh8iMlfxuErsXHQtwmG+qbYq65a0wgXHxhJfnZD+jCKqQHhLBg4rSf0zi8+9nU1CwMxuKD95rSzobykTQSQjA4OUMLLHnMvcCaNyOkQI0grmO3sBffmActVHUG+qCD+i1rmAMbqR6HGDeLDea70vFdYLyVE0dVvOP1sm3mRE2/aXEtYpH3W+vX7j6k09aGNHjg++08JRNjj1tCkwbBpZCGbXGo4RrvG6FbeMVEdsmeI55M8MYlOlySEorDH1Wh4pJ8hf2jeB2h0Fr1+n2n53nk6h4C3SuXftdggSe2pdhZ8EICLcVLRi7Fpas0DxQZjvxSLdhJ+AEupFrdB3ia/6jhNe8C6k2jU1mEsa8qo8Q8ivgljOEmSaW86j1oC0r55pnagAJBD0JkuEfi4VIwJz881OYtjEUSP4X5NsNSTZMv2qTUGCOHt+OBG9//l2PNjrqy/HFlGuPqdvuzXckT3mqJPuJ2a0je3DXr6UcF7j5vqyzx11IWz5cxN2jKYX9dTFRc/1ljNxYaIIcZDvIuMf9NBkLwk8Mvzg+MzAZAOzEaaV6DrjXDQM9fbnt4aGySW0YqB3XMaSUBlMH835yryMUykHp8C4MpfhwII7dTArq1nVM4kq10wCnKbaCTxlrJgVoaW6qF/kNAn/+zH8kbdOzrVsoSaxZpIDNLTvHeImMKN01hJuC8jP7L3QbFZCsCcIv15pQQssmHtjSzNgvLcCdt7d17BIWtsdUfwknjeehP2z8/Od8psp8rnyeP778OM7+DfbcE+MOP7LAPtNWUnisZapvACsN0fGTlUtxp8ay5LLCf0BLfu8n77GxpIpHR2RL3LjY5I0BD2hb4elbZv0K9+tzKIpPdS43+piiAmyHoQr6pLc+fPCsk5R1zWxs3/dcd9bqtamXRz5J4ZALcnwVzH483G/iQBOeWmVR23Wd8ciwAVDkRG/3N6yH2G96mbnPq6dwqQopMf78+L/kP3+9SzEBcNLLdnGuFRjbQJgw+n+8jO+5Sf8enFFyYNgR0HzyO48lFowFecv+NQMYmHnMu6CVUubphODOrUq9qi+w/a2FH+9HTZYJCUR7igKsxS7+NbGZPQrG89sDHrmrMapNFjGNfaI9zzeN7LQfTVMOtE1nbS+I+jNgrjm9CBbOojXLLUpEHFPK7yGGpM2a/LF3CEccD0+PxRc9Lu7kn5fk8WzLnJopKxpYFlKBT3daaplEAxkaF+KCchgvETdxwEAp7y4WFMiGERqBZKsULDvR6HMtvPJUkkQ2giUqENi35JY+uVAG7vQZOVeTdAmrAalX3oJXyFas9gmpawaHe5FHC3mwKU/nUWXtfjS4B4BdKEuC4x7aH48UeI08G3Eu5JHicqV1Wm3euSPzcKr6Y3t44fRMJzFPwM5jk33AzdkhnwLnJis2sWmFG/eEtBR7tXod1q6xCtdU7VRZFbP5GIHpKzzgXl6ODz0wM03RlU9rtIJLPvwRFOd5tkt6zWctSg/7Vw4UOI6LJ1WLQVB83Z72BGHSPHJy5VyGyebQkR66/mPRrSbpsXqJZWQBfMoWWvkOzYxSv+5w7IhHON+Dw8afKta9I+9l+VhuApkevUxZvN69pkUS2R3DNDvmYhbrPB0b2ruWSIZJC61oTw50/kA2fqfHAfhzRdSbdRpPr7I+HpB5tky6ZhNqoNdwmN4U7OE/juFGoqTJCksukuS+tYc+YJNlemG+KDRle65N3c0IuWAXmc9wIYy3YHtBOF4T/XM21BWnn7XsxLJ8ATPV1LIpHefcQoRToKAWuPqy9zVlqbG/iNYUE0wIAA6RUQPL+x49mosSke0+Nu2RdsB8RR2gNRgJZlDPqSXmJUGLF+zE9IiLUfX/qbo6f7GnLTzb9etI+34mt+PZM/x2vWA5hLPKWxr0AGnnyrffebgSYi4jGWcSASAg4X8yLl1cHNlAGwxXOI9PZXMHRADVx95Jnoyn3AfDuKMWAvbJHCFriysDId4Rk0rLVPp42Zu/Y3/wbEoTO070tdMAfQzCpYvwkdE/eFjsg9FZ4mLvWXS0E3ipCt9hI8mv+Fe9s5cpIsHWfVAfQ5rEOVx6u1kbssFJM0HRuvtjBI3pjwDiU3ljbXo1VF4p0ASMSdmcWaSaE7nAyC+mIlBwxcgAXeNcXtnFNrHvuTP1CDMZqnG2BAEcFrl4NtNChas0ESqyMgq9tYSs1cbt1avQ2FvOc3wPMpwPxDbuFipN7CaHMbWiBiN/dDaJBZQ+Q00G0uEOEOPt7/Y3YURY7JlmiVa/vzhn+HAGS45kTD2V76i0L1TUAkQiuXj9HZKzUwxvkLY9EMyLxAxMjBU6Rrq39aChXIakpl4Z+Ok2dGFsd43ZrejNrBLCrAvqxLE4tEEMvtukoWevtzkIJy6QMePKRz8eh9d+ueJ2CHFquxorgSmYj5sWoRLYxbXaY1lb8IDdLeYu9koVR/DWsLRqUjU2u5hDBECWtUHrtZxy65ZMMd9v5SBhb4ltkZSy8aoWA/2wHPfMxyr77zhbE/wHECPjd6Uh3MS34VvKq0ZWNCYT/5TFaHvgOa4OvV7CJdDH/j/QODvmpZODavL6Jy1tYNSBmUXENy2FeIweRsYLDexvrQeQcNf4aMb/aVznzQfNT9uOzDXgjoOuFfWmS718cn+Cq9Rg7PXp1HrZb4VXLoYjPuG+qnpahHzOl+g8qgDwSCLEEILfGernOJ2eNbDIZDmOIwOGF803ck99ArccN38MpQOAui60+qpJVHNI2BXQ4DVMHd2M0k7uLXY3YH8VEbarGs8Y9gCD0rmagW6J2/6nKrnEWn/M3LNCuywjk7rCTOeudmhDtb1rVIbkfGDv/OzfCtrbC5F1YivCTGg0TH8bWgfryo8r8op9m1zItXRP4v3VDHYvUpqi5MYPTEcjYolwYWE4UYA3HhEJlWJDEm+I16aWx7gRmB2mlHhEENwa+UVE9dqTkK9zTvAeBi+prvmY3CH7Yjncb7EwsMTb10p1Htx4GcjXZrBS7DkyTDca6Ws7UhZGxeN0ePCEre/YIFkMeIZrbDCuY4YzEsvkN/WN6BTOcLJ9JpNELkglrtDN2cCyHkesffaTYVNdX7piVryUbWZ06XesJsDV7nZjh+UxDewOiVcVzf3s2smZPQHD8VInlQ0ZhNyI+xGaFtPGbn2oiFSBNYQ5PkB4+sDSbd4FXyFzDyRS6XTW/0g0jwzUxq/9xYorwOUI+/e72rUWXllnCf+uTbVyjX3j3oUJKJnq7/rbeXyIXnL2hJf1Ei7XmlXVM/cmfo4XF0Vy4ExUNrWXdS9+qad07Kn35WU8kaWzOMZMszl4OR7+kxhB02h62udzpb1PFZgsM1GT96ASWToZ4MGJuIp/Fs4AtMszgb6J+Xz+ejDEAbujEV27bLjOyEClSLlVD97ZsLHFzfcJbgQW0oGk37B7c/L9KkWAtp8zLJiqjhOtsme7WwNJstFNTrf0Lmq54Y/gWmxpso1aUEL78gpjX4klcOX1UAVPaKl5VTwLk0P3xPKF7+NYithpamA0OkMb9tmzcV3py2Moz5+bEs/UWf7NauiLGjiYDvXFf8emJ6Ekaqo9cHo0HwhvJq387C0rpxeZ83VaC9q12r43gMAF0W75Oym6bC24AqlNTm7mDWByittOi8PswKRuMa6Fa5bSJ6SiKi9Av1Y7e7MEkznOO9DYvxwvMTVUu/gY1ilm2r/jO2hSegOJiy6KNhTuW30Zisi006uDWIKMJ8TqmgXIY/MG2ymPnp7CS0nJ64ApdaCP9vlufZakVxflMJrxYV3YtuhdkqVCsR1elrZtBW39nZ4aKN3PEFT30PuS5DwSUoueXTplVBowvA1ucM7OYfZNLCbX0vM01b0kusnnH15o4HTUFJxFcD9fBusdtKRaR81MahjW9FMrQHV+bZPb9cywK3WcXPBEPZ4tQLpqT88BE8vbBL6AWrGzYXNW1tLJv8Aqvyf/vMmRvqDO5FcnXe5PgFO3RDlbTqbJJkyta5dhBlyP1HL2gvYlYyjBx/MECk/d2eUYlivvz5nCR8Uut4mR1BUTle87b9PHzwM5kN7D2XtPyDm6lyZ6AXLP6SN+du9NSB0MI/bzdW0jBq/cSGZd34bXIZ55YrPtb8n1LvU3siBVB6VEAaalVfF/6ZL/v4yk7+UC9QLUlapMjaa94aacl48t24NNQHqLFsmAXsha96J2jya5V7Kn3wUtqnu/zOF3XaIQwlyRTzYQs993QcOMTUapylX0OzlOxdq/pZaofd9/o4JuRcAOMuiAt2rdzz0y6OHVv/dQveHkmJbdX1fgAVkWkeRpGSycjmg4I5BVno2b/Q5ZAelgMMwfLOGYYfdQ81ZRFi+Ub11PVgMoJGUX7BOrMQbQ88x2j5AOP5uvDtRaF2aC5ldfc7gXLPXUBNTEJ4Kgf5+VgV76+BhvhLHAPlIPN89YAin/iaRk9ctuFjTH729ojeGV7WCMAoB/Be1L9By0liAgPTy3KVJ/THZzlv3DeQf6/gaTbJ/z8wiCZbVFy8a9zPivZfQij42rNUy5T/VFWiUPqnYEqYzKOfWvYxTy6VwNbrKU7Ahdx5Wa2VhWFI/VVehD0fs6iHdd54gaOeZC6Je6UeNN3aMN3g7M9x3FnVnCEMCgJgWWKGxSqwPBh0pYnukDsnKpcEGJ7lDZBwszb/DG2f20kqMjKLFOBFT3KAKuYLpp6YZe3oKve62/DCWGvmQADIMMfxNDZuD/OGbeYNyjwV/n78C7M5in3kiv4qUTLn/rpMdjiClafAEfLxC8E2xLTckkIBTbmFzg4Mka/77+7RqST9usaWezI+tHdeqCRgURrmjP3fhiaK5CGg7vOS8dnv54KhKNaJKTzHMe27ruxaAxszf9qjQ2jHJyOb+ya9WdUT2sq9NLgo8OPzPKW5PDb1xoOPCJnoaZvfwwIU7JAsrGksZnEdIdO2QXFZpnBeWkqnFMzYd8CjhGgURZDbSuyE+OYg5vUAcG7KPwmyOVIbDuhVexnwarJtN8/79r36DZSfWoHlTUqyx2T1eRKYzhbRcFZUHZ2HKfrVogDW9sbxmPFMrlR9ZNIN8gDclWOZBTyHJyBB8QbukIcZfxA2E7BYe6MTsrqYsUrTVjmbMfpxWmRXK8lJQ9I28NDjkxkC9Oub9UiUnIgCiy4wSZ+smVoXB+ogA3XeoaJzZyPJdeG5BzRlUPv6JdJPZhbxzr/UF9oouoxPWY9WW9d+QBXQc7QaC2h0+mZ9U9i3LtUQXnlnheu/NnH2Lxhw87yFyll6ECKR+zCrvYFJOU3ztLF9t2U5usIjaT6OthiokKMHYWFKXw/fCV2EkyGJ7bO6IIMNAGz35wjeUiww/kmOjHUQIfaeU9fMT3+7XAOLQQifpve1TcaH5v2MKszRcgQBP0ATgMdwEr0JkwCbJa1KEraBy5xE5McOLXMdwYAWZ5XiiJgfPhPr7gX9t58rAOsMkUb8tDyIFl9LDiW1hI0NcYV/lbfau9dFd5uKdCz/WC8KgY/4GtQO+JrfKQxlwMxb2JjoMGDILl1Ea0HM940+tsVf0likt5lHLXk0J1eVqQd0wPDjb8QJGbSEKkLbFtR6UCTm05PH73+nrXxsQteAoCELdlW7yUXqyZJMgqlVjORSwEu9lAV4MY5012YwyABjFFd32g+tGxTihjo0MuxtOdcmpXW/yEFcnNuNJpGBHynXMCZanSNCSV1/RmeChNvAc6Jjlyjfr//T04I1MJ0pYXXyZR/a40xFajSEAWgGtyekAKisGmFx0P1fgMwaY3+rVj+t7RoslsBwghQlvJujghnK6EKPg6QnTJGm+Q9BDDIEcOjzgiSuE9UNoeFDfn6CWoyhB+/iFyQkOKVwWbaMVZrlST28FOhIAxkkDECxEylc8RbMnfv9Bo3spi0LB6FAImttmUpZH9q90UwO4zV8fvUlf7yhsppwqpWxOOfP/UcQupcbt4N9ldMTOAT+/x0buTqr7exzMOHCh/db1oN7GPdArufTkbN6mPvX0SK8xGxtyQb5xUFYK8Uc3MTk5mqHw9Qn8qmEd/XzG2nCQRREsWlagr/QbNVHVmXHareTqqMLIhqA4gFBx/m0GWfvwaEKUj3lN3FVe6kImH6jvrvwRCnCmuwCPhbbou05s06KZ6RcuMLF4IfhbWP9uIp5c34tWH3NBu9N4LknnAZLSS6VrNNj1nd7mP5iqZUDc7Gqr2znbQ7BgilntOfFCmCc6apHNwppHY47fkgKrXRWCUuGCVQtoQiHo5gOw7v4FqUftqFM4JKrI6Kl0UIJoPIa+ucESpC0bP5DEKseylG1HV6yF0Fhf7KjiosK9wCR5wKcFXl9uLDftMHBS6p+9h0XSLRD2a27mS6BSuCvKAq6we+wN3Zi9nKOclvvTMQBNwTUMrQ2v69iYNyzLGRVnKkcFjpHt9mxffMbnE7IbmkOjIbj8Ef60stkD7vZEopd3IXqlxwNell3kG/+Gm8Byt4fET8NyTgtxDVeW6h/r2HjxgbUAT7pbXaFyl7iBXMjApKWgiI6G9z66Msou4NXlKx4i2AWw/2pmliJ4zis0nSV4Rj1EZp8cqLygmzw/eTSiqBNlxhi+FLwl/VYeKS2wM0r8oD4cS2JJ8F8PLLsao6vVEAUumm++vV+JSy7goj/naQP9OdPm0b1Jnee/j2MpddLdO3NYLOyQax3Gug/+2ObDdCnCbN9RmoUux5/veOc7hzB5Nrpmv+XusyNWJfp/dC+IESVjiItgAbr/ECI7f/89CMQpDsAly9db0ke6+hTG8aEAoc4a5HGSPglAYlwPDCsQyS09ExQVzy8HRSM4sPnvxoGlfZD6Uq6ReUKpGhIPzYyghv0vZvZEe/8BRWkXMZrYExhvoyJ42Q7GN2dkdarBfWPT/2/jBnjsTLSRTw/bw6VR+BYqe3TzNGSrYGs8D12NYtAwlKp7mNYS2J8J/OUr0J6j9ewe+dFuIRrsd+5wYEJAidavNPAZFb5beGf9hsO05WhgTZP0gq6vrdDW0Rziwyz99o1xMf2vgDc/ToEfqXq6jYfEa8x90OF+xv6/072rJgsq18iLCNRx3yv6m5i3CW7DT/KQ+ftbRkFbY+Ti2SHKAZn1usMvBu/q7fRRWzfOH4Rtbk4gG350uSXc5FOE1/F2Cbxs6HFx4OQEBO2P6oGMuD5uz5syCHuLVwcioMS9T2L9hlgHC3nUkmEJME69Rlm0FU3NwLuP2Zlz15Djvmm4l2ELqNkNJHdsVtt3ot4h7x/anUjVb3dlEs08UXaPvJ11pOMUVDD6cONX3F9zGxyCnsO6qANB9LSc35LvFBwRCCr3dQ6QeoZvogdC3vjQR851lqPSl43dF11JDU/yyhKZS/qUtbKvPN8u8WUyjQVbFTO8jRizElaSy+wFU9MzXHDjvu6IhmQAnfT4vQqKcz9d3eZDx1PPHpNIU5BRDIZ6B+elgWqMyIqVkhxihDpd33cKt4936y9dLc6w1VQN0c2uAq34c1jVZtN9gJaIA4xEXK/CwS+w3uNjq6OHzazrSL2HlxAvek/Bb1pfFaokrvUMM9mMkspjaSNCvooSNkb6b/JaxCie83kFwk2CQm25bdPX9QJhSzrOSRkfWD5mA3cEJ5O00ZCu/qfYADL0ZLA1HXvKfrF+Ir2wItHb39RB+gHxk+TDck+5jmKRwpwoQaEJgiiswjPUwCGeElUfYLE6Ybrm5Rqlv+UtJw/VQZb1n7dODggormFV9tu1szFyFsYVM8553VcVIRy+rJJ2TGaajB8A5ZWS2je6j6m45Mogtdzsn4xpnAJHg5x72DKSuF088PRiN6ZpBdrmD/Fd7NoJKBFZMCwE0zcoUBPgiETfZVtwkMi50d2Jyy14Jilmnpcui4KJNszkP0yH+DtQ4xNchmHcTMTlX462lhQtBZkFASp55fZ1KewknMZRQBVRe6sz9jucfqcWymOLnMPEspNqmALGKUZP4phCgdLW3u0RuooQqlnHAAezpmQXbXkpYlis01pRDBVU8MD+/vApOL+gafwqqfaaBZfnMzvgJkp7npPHRRyh81LdHsPuL+5sMEW2dg8j4Ff/79drAez3uKQCxDzYZ50DuZGXP2bTp6TjzxxOsaCJeAeoobXECooLa0eqq5TxzF0nyoOKeYufVzRza2GINIMhGpaWaonxD9CGtGpABFsVrIvcUoedUGDggh5wrVOFgIrD3XY+/4qIb2KfadrKdEaJK7plhfr7ln9OnhNUIzdN3fpOwSR/sGjFlMm5pkf1t+iP9RQxOpD0s/SaqZKHN5kVqks9pVXsA+PtDfb/Yvr3gvXNw6Aojd7DjxSigUTvkPeDPuxLgKrZhkUoRBST8Hdge1GyU43vQfqW0i1HMGTOqo6VFPp7RFL2iEQPctz97438Pz/QiETmCHzR0sfgZumZoaLGZ63y7dfCWmQ4SYhgdQvOVOfNSRZSVvsb0PUBryIGlJ1w2YPJ1HPC4cppjwr5mCUyJqkSlF9A3wCj7Xa41kLkGCOQibM3y3m6VsGPQNo6nDwHOhq5r1PZlQwlai9JS/og5BT1KTMU6t1nt5aoEGEbZ//+RyXi+CcjQKZrCR+wspakXsm4WHjGpSSjriK6qv+MPCQBr4uOedBdwJc0cUKxgv4CNNzxezBWj88yqQf8zBMr4O8A1CUv1s4dFc+avFKJ3ymn/gaBh62DxkbzfniML4G102EDoTjXnvPWXa+UMoPHVK0JzvIqCRFMFXBKSg2BsJcqlOpAvDJixgn2tMpo3QfJQXV1aewWrrYGuoR1KYUDJ+xgPd+F4lOs6U91ZdM67GFXGAHtVhJ6/38qP/uFJDGGNZ5gnJ/zkog7Y7VsgJYWf3gX61nXBk8gpaVwyCY71bSLzY6l9SaIbFj2moVmp2N6xkCUckqRYkmDR0bF1AgehjY0Mzq2z9XwJO07X14yqYrNzXH7NRz+m3JSby7fQ0dgtuHvAIvCTHNPfIrm0E4coJXG2VFRt/pD+XKLPeM48gAoZRTWGIZbjeychXRVgzkIIO7xt+tatZfGWec838csfytDwAscUtXt6nGCaEjxSmW8umLNiwYMul3O3W3C+Kr2qms26ZpAEiaZrdmnIAZlVz54YpEoiIW6lm4xPODy56kghDQjsFBTu+jepHKx47Eqjdo8eCOWyovqQkAz+9Dp1eKML28r8NEq20vUfiNUqvczkZn87IZ+OmTnG9CC+fifyH7ibE3KK40uMRnbOM9i3RzNmlqrxORSf2oame4eAgfEHGEooAGjr3ggj36uHM2P5Bj3QKhj4BS5YdCdRFPV8uUk0K1HVbZXsuZhlPlCpMYpcBdGmgxWMtu8xgV4nOtfv9HzSsP6lg3VRrJG/+Ro6QrbOQOJrdewIgGtrdHQO2cbdiCQMEGN19cLKa3XeIq+IVrqPjxmboN3PAZFs449dFAur6shZjgOVFVhCDE5Ogy8KOlUSvR8199aaWl1jcpvIN8E7Ccl5DCcLqLWdP5/qoG4DSuaNemm53AZqrMkwb3MwSIfM51VFjTw8lPtZNiTVr+AfEzOqajZU1x3znETbiZT2YgGYBgFHFx2K7n12g1G6yGM0J6pNo/BvbuLM1MC80+aDLaAgNC7VSTMapzGoEB9pX/9VU3B9kgB9o7Mkk/RWbU4J7AH3VPNsnkBPJ906AKbInZrv3iTxDl8sSQdzhaeKtPrpIfPwmHvn6DScv0wrcghwKwQYImT4zZ2vyCwM3jw/SywzMrAr1Kifrd+F3C7bT0l8VLHkX+0CLQJ+ARvjvBYbTYGTrLxovrBwPvXHqAfjc8u4VA7JgKoFkBGcPDRVvtBNt6dMg+owlZ883hbc/4bfQ1V0+B5/+ck4hlnpZKZBBlH8iH87fOJQTmzZQQRP60CWf+cHSZ6y5Iwr1uGF37JXbp9IqSKLXXBLUeQeVO6uLxw1BFto8guj2lXVyNwNlywQMKw24tE7IIZKIt1FolwulsXO0VtbNZhDi07UCl+Ior+SGaHjjZO1oN0zhUPqTEHF5akFsAVxImJr98s9ce9UafilezdpHsYhYdWUkrL6vW50Tts/SprIXFrw2zSh7oFrMKmdS+oBLbaGMDP9rB+VZpIU8apGM3xsiniddVFW3hpIb3/zVf2zlpkoADX3vrdT2rNcRqqbKbC1T8FTJ5OOAC62UmokK6lVRq8hl8P7DMJQLQNfUQvdLRuwxhw9yJMvzV/Sr8B2zDHDT3SjGC2SKPkt0CQKe0oA2sZEDYhhHuBuv5fC99QUWddlVYy9Ea5VjZsTlapVfOUVwocJLBcI+lRmuN/ecdXs07rGdIbqLQbMIgpKUpxI+OVYNrgbc5Kz6dCcw7STusijAvnghYGQQCIX/rGecBoPLkH9SaMHiO6k+46Ge5ok7LreVGRXwxZ9XUU8Mv8wR3Y+WV0fa3SeYOWKKvuyRiPTSOK2vv1h+D197QnZMbl/wOp14+fcn3PAnotHox9g/p39qAqRu0DttDYBqTvEC/7ftiXGhOUEDSWfyvsX4JfepWEWfeohdCscpTV9DY04y84XK/hdS9VW/Cg1ghj2GWX/RkkqZ0K9xWGZ71bFoQTCGXozd/qoV/5JhMFzbsP/LLBnIuxCYXUxePVz8/8M/81VqrC7/CpPDwg+Sro0qYvE9bHP5oUZ53CF81VLT35ZvxJaYT/ii2C0FrHxsTNz1q0HCBb80Pe/5QYx2LbYOWGu71afqENgIFbLJUrzO6U1BoAWGpMANUDTFPyNCwaQm99+Jb1EslXBH8egnWz0S2jDVYUoABtU64dKHlg+H85Uop+wgRe+zBhrZOYzsMQ/gF95i/fKVxoLnnSo6SbF9diGAaJIpg3WW9BpsCEUA3IXTUbws5V3tgNJ8kidqnWoNj6c8q0mZOEsKA2K4Z1JNTdD4+uflvmCWOPgdUSM9EpRNySu8oqiCJZX4dqgWgtwFzTCnwEiqkU1ZEAE0MCMSkal+GCE/tjSoXiynchhqcnuYi6WxVZwXhRb99r3Ql6LseCDPmuYR9F7t48WK0fJWKAJucrDZ/eBAd4HbU4ey8OIBZfThGgd969A5F/X2B4JBInwj6e/++xDM9GtTFFrs7lZOKfYdVAyv62LmFA+BhxjaiVNdmopbwB3CKP6V5BZFrVEzcx8zkhX8dQPBSYUj/QlH19Uva9VT6X2tHkqlpPJMNyDIFl6qrTW4Q/7g88/0XWmbraONzk1fRqbwHGST/t2sIntRqxB85jjUpVAoVnjG2c1W0VQZvRKcXCw1A6IH83CjJPt3xsMCWQY1F+tY3N+uB3oq94Qf17KWA1MUM9ps/p/JcBZvnzXGodeCm88gIaXcc9IY2Frm1rjhREGHNpN/whs+OxPcChL805mnltk3uJNk5jTWoJtE4GqaonQxv4FBg+GILHU/WjpZXPSvu4tNRze4teXq/hHb3iqfeekeMz/4czHqCT7DSa9EugtWMjUtJhKzv+C9XSZ4hd3rR+Xi7KNddvFXiAEj9XztRFrRcgqeAuR6jFO1igV76zvxfR26FkSSl5fd0MxMxXWMl46wfz9iSU0f3wgWPGRBKxn5LGxUKcpP7ITUpoZoikwzJPiYnQ6S582SGIQnPz6hclPSf6gt4A1q6jrnUFix86uMnzdCbkkxARjJpYnnjvna/BefuqJqYIwhSGMcr/sxSwCLTKFIrrd/Ur+NeueRBSRdkZobb+a9eH9gWakWGtXrE2Lqwxlwu52Je1GTC6oscv7jDmQnsVczllIK99uGYjsg3L9WI0iong01ZV2uH27UEipBJJwjzMKG1Oc0SqAi2hs7NutviQ9dSjRWX0mDt6xl4Q9O4CtsCR/gKdS2H5TSqppPjz9S5YUsRuX/exN3D0fjWkuiKO+MjSyJc4e4xHpd5nqk5/+W0Mter4NV2SfbIYyy5YS3yqmYSO2CVAsoIFNCIbUCHbdLu9vAiGgYUj+nrPUinFb87JTpyqZjMRQoJdxrwZccz/PINwTPuMe1q23a6lY8MZZj4zZFOIVlityYkTn1uIBW4x4hOOoWKGnK5V6qGVvugHstEqIHUPIR3xuYR47vHogeNUhC6dj39GTLiXoML5Msx7pqH8KSV3HahivDqrMzMAmSkA7KKB09UIQcV9Yk5T56qk530JMUnI27K3OideoevKUIuZTuNcMOhSwydvFluK3ahq80Xua9EW0VphECGjAcOvI3+gP7op5t4E7FFDNi/5vZw4xdYdU3OeWl/+cC3V6Zv/uyGuzNTQW/DuBTmb7o1sd88gzbmeiMUkOVs7P7/s5qlnza6dAiAXZaPEAXS+CHjueRtMuNlCU87exFpzJpYDIzgFgISQ7RiTa1yD3OBReupDT/DUfOcq8PCiuZypvN8ivUFqBuD0dsZYvTAV25EA2OY+LcNEMtFOFQW9X+ZG/dPJxqFD0Nmyh7QlLeps/G654U03RgqkvRNykYzhT/eJyImjFDQjRD1C4d2LpJaDOBzsOsIAUfWzF7MIMmFKIIMWkEYZuFjSO52DKodUe08pvBFAKrDUml32MJqpc1Sgox0QjLpRZBv4/YWWzigAJf0PQt/YMrvEqlQE9ZoB+ODPjY31W9Amo7itKGA5OtBCsFwD0TeY2hIjxjPqja+627sdPnWtVtv2MiHbM8vkDTUZWPVzFZDsr/K3jW9lu473z8/IBp3s2RF9GWloTkXhPHxRArP+kQGXATrUe08VlKtQKh2uZIvEcd1auX7LIsXqutEwWqQsefojUeKUV68Eor1t/AthK9nfdWLDLW4yu97upZ/4zB5O5/HrRx0q/hNhc6c3X/9FNN67oWGjPHV5ex9DHYUIE74kCX3JZGe576rlZj75cDCpGg3GYYjeoMjDZolthLs/4mMrGkkegQlKHF9O/SLFjqpb7oGS5CQLqqsYsC315rjFmKLyg+vjSPNJ0Pq+BU1jhyz8oaf4k9bvmeBGYQFjI0BwBjC3nlYtW3o0zffrrelgjuEfibrftMNBMUjzsgBLTO15CVM9UK2r7/wI4C8o+zcV5WFoWUH80FYuYYyrHCRHTvde8KQq+rDF8mszrhMkaFsyAJ0T8FrNaIDS/t7wxUWjqqNionddVq0APjLia0z5Sa5y2SQB9DExhD8AFPqIK+fASJDr+Cwgm9GHutuw47vK3Bl6yzstd1ArY7bc6FA+S9ZJ7ZsaP/904N0lK1hCvRe90GTpVUGnth6S/KZ83QUVfWukJAaK7sew+sfK/5QmWeDtKfMtif3Iede6N4FZyciZbGQs1e/L5SR2zj0UoGBz+THwLrs4+fU++WBUrbu3ozMtGlbgfxb27KycaJidYFDkgEBKgTUzvGApwG4Qnx8IMllWxALuYdfAUWBLLDg8iW7CxKw1RyDv1EvIzpILhY7fxDioyE9dMM92hAwEjLE3x7U/cMzs6FqiANkY6E9oUZ+1NB+Ij7rlWNRp2N3g1STP8M5MoK/4WRvQMiM3rTNT4W1U61aNH7ztKTOFeIVkg2K7zSUQV2WqubSUcPzO5TFXTlAJoPgMyycu/jOtw6ybAZVJHbS8rzyq2r213+1fnwcqignhTow0SN31Q6I9echf5leFK1gGeIF/RtKzOCBk3aTr3QzUgH0DykkiDRH6GN/pWx5cNIElZ8ALsf7HJYPOmTXYyNBM6/6sMv2Xme4iLU8CgxAiZp3/44LBrKfeD2RUIDCXfo1VQq7NMQ0NwS80mUYQpZFx36LDtcDqfHDu2BCOx/aHpkXyN0WwEtF/SJYOolfgxYyTLXaApDx2kxvhQJMAuN0m9acS7imNvnGxtURGa58CaiN4fuMW0t6gUTg58kdGcs9GP6uzFpOmbifcQaFxoia34qUZhtIshypNEF8AFpeVADu0tvv7Fbuqg/rQN0JZKNFfBzlvgPLMIq1i17D68/g9abxAl/vTPRVfZsmiU4lM/kQtqhH3MYf8BIUz7rZxzzofDmK5glelLTRbXnoghRtjD27nheGrpZUMf5LHSPHWk5Dmc1V+kkxiq09DtXSZ37WqMfeJ2qxDIPQnqg26BLuJjoV582fnGZL6OhIKFJCOMULsKTvHHmncP0OuuCLCKIutOctCHkKMUXz+HLJ+BCD11jBdOKLxyJvIJ99KCuv5DDP1i3uHY2pCLghijhFM5yIfUlwaXq9MWXLJ/8aeB6ZJhWlvNu53RBxDW08hGnTTWzsGFR0VnxFL1OI59s4XPuIwraJfPDGnZhMu5D1W4fRu/g1AtsVyqzi1ZpqB13qZRHftTmb90FqACi/5yzONhBSdxHPEj+J8AKz56zVHApjQE8JTLJ7nYDnNAQUn16yCJgZbZIU2sqegFEGitQkg8GA68KVKGnC2Y3/0LSaFghv2nxjz96dwvIY7EWP55QlYAiXXOaVv2XDgJx+sX89Mlr3/SQV+WElJviaE9r5eeeZ0JgKHe9R5EctPDwxGa3FKyX+bQ5Pc4X19zWn+GFW7R35siK4eCsg2FbBJhILHJt8zlucpH1Cq6voXHCbZgkQFAgvY85289ulHEGmiNkmoFkxmcmLecmeZch0JqJKryOxYsItDHeM+eGsLkCPcqkb0vxMTVJoAJFZSs1qSDGcWJWsDTMYviZPeKMnWGYRU/HCSxPOgGrMtn3KRDh5hDQKEorSOcJ6Q7U1jIIo+3yk07WsUTZzcIqw//k/zT6YDIz45Re2mgFJRdDln+XR6XKX9epDpj7MyRnPLtjcLCw9s2FAhEc2B0JYGaMPgxJ6t+bCVqJtouww8kon92Cbp5nPloh61juWz/FWrZBUBrpgAP1+PQIQmlm8p2mRwG/5wCkaeWvz4SgPlUND6WWT0Htist6y+f/m/COATGPIWrcN1CNsmjDCjBQA9zeOX3W8YOLILh7kXh4LSPfiCp5R1v264eCmgCzuvtQbOVcnXR2/9A0VyHuQRY1S1jqGASa1bLUnXdk0SouZOdkOiTog+KD5UcLQeatWNVNhu3FXcRIpJoZrM6xBemWMSY5flmKpbMZ4qYzBBDut5E1shrUINNkUEUisSM3Tt9/tCP29suphdPl6SzZqtE42o9zRzLIyKTpj4UD4RVT1Tak62fUrK0RjJlBwGiWu/Ww+Xf6VKFVcUiE6gzs5FI3zzjFtbGHBNOl7NA2VKb0fTOJXAn4y0eylwipKUiZDpQSPCJyY3w/yZixUfuYwH/6rQcVTzs/QGCXEpBWnj0q87larE+WQwooA0zFSh17HoBMJC8FsoFktvOF8rLW1Vnwbqn62jkp9u/UIwNfnv6WyNp9UOAm78W+j3aN/aF13o1fyPv9dlRKFTlUENcWOC3XWTg9HXTiFOJWd68cwjDAjycd3Pnp9A5cHigmjS0qEyZdtqwB1MBRFKWueQd2XtKb+OjkNXeYJgro7zTMQgm2gsN4Wi5wXApbkJ7czFpAU+98uTMNYa3e9paw89ZM/JeIbeA1LwsoRyJOkLBrpOUkoYUCH+Z8tovSagfd28QswKxEGwhwp2PSqOt/oNmvJ1JL8T37mFBBSxVu20k3xG6S5pI/XjQeoM/FFamCev9fHy/TNneiv7MMi5MLI7t3A8rIS1e6tWyArJY22zViQ1i5Hm5Bua1bD82iAl0hsgOOBxMq78gUgM00Upcv/5DUoVWz/8x44a//rn24EvCpraaK0eHXdF2NN+EBAn1ZYRE03DR81XccpSNftGLe9q7Rj1rN3u6aDqb5Wsbldxk3YPm5Hg8+2ESa7EgfdeGleQRs0F6KNAozRfYsj2BECJ5BTm0VdmC8zkdQAAMX3zUHQX1BxPD2QBXLoMPoCOZwdp6vR+15e9MGwSwYXktUzXiN27Uk2j4TQZOLkQGORO8uHZ7Masw97XlgGGHbwYFbFS9E2fKEbNVX+dMpeyD5UdSCryLS2fttOXacJBKueLXP94GJHenyDZf30jPIPqSsCcK6hZijE/TF7eSwfcj8qyrnRlXToYSROa66njzcKX4gOBkHm7HfAw71+tC2EJo3NnOGuUIjGNbbs1ue04dJAl9z1LSAIg7z2XklJ9K9ZxlR5YdeWJ1231/edjW9LPG0VQH+XKnIZpH68nNKydmw/UHivcFbg3Tp5mkuVtchfx5XBsPwmL7wH9jB3UlVQkJzv0fU03mg0HGvey0ubzXun2hfWGvPzACTF1wkyNc5IRbbF/ze/Lj5ODC9+iCts/ZcOHk4AudB9I4qxZgWIQ952+7tPw4VyJKmvPgD1zheOpG4om75RnFUhtklB9ziwSggs2eMoWNEsBJ0mUj3rjImDHk4sVuzzgY2LXcRZ/mn9+xjVCjexuLx64+ZqL6upV9oA0n8KDW+DixyQbUjv8qXBAPhBdlBnKpDxt67DiAvwAMIdyaTtceHDpLBqQKK9upbAmlDnnZUe8Y1/OaU40fTIVMufCrT2Dqoa6/cR8mUi36N2nUN6y4GPbnlLDiGO/EdwNlHCocwb6BqGxjhJlqERZsBsMYPcVzTc/Bv/LNE6VQ7nWD3t9oFcn9tYQPW175llPqQbFtTGLhtlf7E1WLhJROnC7tjjlwTuWVeyiVOwQFnyhtGW6FqGUxZqMf2GDT2tM2rmpcRRElbli4p3cO91MycEWxyM9bXPMICTiHgEehotUFKdkZi+9b4urnVU6vUencWLjv6KM5AdJJDe2ZiuzubipTj8k9EB+jgj3BGcZEyakisPeju9FuWBzx5lCTzyCmMw17/ZIYtlOY8m2+6DfRcENziW7sC9W7dLLIIaFUvLU9DPQHolWPC31XVwol2tHsP6kzoQ2XNvGgNIDIZoeJwyVOOcb6FmX+TGxNZz8JYflK039cbWkDgnGykMI9lhZhmJAwzQTE1XurMLYqb4elkDVfJzCi7KG/kBJpGIQuSFQUyIr18Nl63Gkh/UCyzuUigfuxluBMN/yITjHVf4gA8L28o4VR6jwdVrDOiWYeEylY2PXSwet3tpbCA2NtyZJEsg07lIJfO0k+HSRkxgM9i/dN0cx5vAEOR3nI+WJkBEGBmJB0mygppUvTrTGDRLhE6dzGUJ9iX62SYIuOynzKD6HqBmBVO6pXS2FqS0UHJSkbpUGdYGJv2rBkqcUztXMzWTawZz/cfdbdPoZj3IPtZqUQBZugzEWjDiNotmhUTO9ABmh8PWCqvn99kSY982K1uhNcPXMdwRYXEFcRR9anBsaLrkZTAIzefkaDaSfZxSHhhyPNFeGDL0cQcpWyISwU04Fp83hlKhHm6aK9SgZT8iEDIMcYHdlhP7NH74WbKYaEEgXuQ7WkaSvte4GurQuDU7lF47kWFnymcPDVPaF0rw9H5hSaFJwlWow0hCQMliqNfUcJaqm+OxaB5M2fYdMNVMpa/PDoWqoaWbFsNrpUsfsLP6O26CN7O0XzmZqXjimbAIyDZ/Io34aWJ1O6Pvq5a2CvqmBPQQwtIdXvfE8mP0f7EGQcywfi3kfiEaU5WMR9MaLHaidhK93DgSIaSWPoST13k3DAjEynOakQkxJtJl+wUtsz5yBGsQC1jSYTZhL0kemkyf52GDy64xp9Z6QnpdbHxjC2YydeJ3HLrNYBkjjbpo3hvCThM8p+8Mglwt8RkKqT3FJOo2hBVTUyUX2+mOsG7Aj1undjZtyoNOAqL+XWp7lHXMb5Y51qiPkFwNzdEMhioZqLuLDW3mGmsYujV+z6EimeF14ZgEt9sQ5G1iGQxCGAl6Yvy/aOaGKm7uNP/qhAfGSDWt3jKHCf4aMbfW6CN2/aiIlRF43sN7iAX7Z3YlvT8Ufll2kiKSLUhqWF6eB/9TXxUPw0JPgwZq6vg0pWqEgDCg7jaX43bbagvPFx0zkwWLP+F47EMh9a0NV8WwvalFLJ83KrOmcK1GrNE+wJ1LUalHnN6RdYLncfGoGrtrBSvl0E/UwkZNdedsiwCa06NBTqkI4zS3gWG4nLAG+iS0WCQDR9vFaSfv5LipN+fVp+gUpQ8x6tYv0V/v9Kix4uiN/BkvsZpum+QaBwW2M9JkuyR05YibXaEMmUQOYOJyYTwvlrmeDs/Tvkx+/UOHj2NDDcDJ/10nLCcn6BbiC/3vs7PmUki9+WCiZiIqgwlAwf2vJFCRDsZC0vQcEYyuUQ9gmYoGwUkghcFriIA+NM3OLbatyUpDxcC7Q3HHPozX7l8LtJG5w9L3ku82me3/73rghhwn+7lfkLE+Kd6Pi1IsUHumT4EpJXi5NDZS/HSi3GkTuuTWVfhN5DxP4ViYt9PuKIIUA7RoCCO2F30TwDQeQKR4/h1afo4i6R5X2JXvN0l2PoclLOkaFJau/SRGGybKcARnbCVzzfyNqNRlO2PD9WShq1A9NIaBw349CmViqCQ4dyHxCGnNqRIbIZneorQPGgTCEV1bzaObwoLlRdnMLq2LxC0gRK95nIwvV09UflFWKYqQKUbA5peLLq6fwb/MYWXN0d0RePe5RBFB4nczoLs+vbWV7YoLIF422BIWjkfVHwSVLaW+3kw0MOt8SpCvcI88KPF9S9wPae2oQ9OWhA2r+bfYyNwkhomh/EGTx3mzoAA6AQcssUKGWng1ZkhGgm6Jdq7BrS5g39uoIhEKnosPAAWerzb8lptipR2VoBkxiPTf304JucB/nE6DqkDKrtTyN5y298DCFIEwOF99t6PtZUHxaJJ9TMK7Wa/fc/fTFdmXL28ad0RQlw2gPgRCN7Tb4/mTt2rWXatiYQBxKW/4ZPdnJbr6jWgwkDm4ky7uWs5cHx6oeyg9enxGI3UMGmbP/cbj5iYVtMqdiBUneV1JVT2rM2sYq39cEwcJPfdb3Ouwjdse5L1X7cviFnBZ64AaNF/PR1z3ec++xhqc08RDN0TMM9FtpbMDrWsoPryMUR5xAa6dKTeqYa+et68Roer4/1A9Bc+NdRhRKKAXbcV3vHxVp57e15lkJvIuxW63nfBB7hSWsmycPnZvbb6Bx9p/mzp7Fxt9GJh9PFmZChzWdW09TsfXWs7sC9WLXnwLVJeiTxcY4jamcaj60AKTFNIV5i2USdn3g4LKmxaLecZokyiIO/NoCr7zfRD3d+4DwOpmQbS9NdXiWyHwo/80fwQ3xt03fMbS9GHFnfPQc7qp76kegeSZyOQXkyjKlPyiItucMZMI0Jb9F4t3fxHtq2fku3PMUdiQWZ3fStetSmJvJaU2n5FhI1dULgBBBHZGXmJCdZU/bYuu+7DXmur3lEj+TvmaH5BPIWLDmhtXqZupkY0kQJK9v5extG+JnST+tgiApFSv6Vt9avxMYLp5QWQpR6y4+P2YulURSJm24Qshb58rfN1T9+XTUuj3iIhb2J/f27LdJyVWrYAoF37d8D9wV6biPUG1CY+so0LEsNLbvnXwBztyjzVu5b/tQDpMHBOC52mhD7Nnlq0wfdXj5YHKyF3WOXayKWf79BGd8cJxqok3uRXMJeDtx+MUz9JZOHmMfblP5f2EmzUtIZVFlH4/4r/7Yr77lvOauJz82bL/dCJ3NJynEhYlmnBtjrRu2CELgkoNhmN6SzU/EoVuLOr3a5+ZDXMgG3pqQy/1qgLPP2VMGz1lmyOhAyFhAfJ+72G7GtumaK57ygstgqB+xuJd3t+oNT9p4smBlKIGUUob7YPfLuHIpCeJd+TpUAblUN90whgaaWE0BeOqD4XvXtUBg00crK4ySz73U5wn9FD6Zk3FO+otX1j1iFovn9WVH55Vb+a1hDQ++LXG2b7bgWqa5knQAmnqG9WWoj7nYlUPdlmfs2e3OLg0TkUcnVJ+GIA8C1Vt0HMJRhQypvr061vlVA22q+rsUu3LT/opj2nHUilu5AfBW6EsDhDz5g66VKCgq8CD5OPo12NLpbW1QeUyU80HvTzM9tTNzEiLXxfm2Xee2NVsRJJDOGBcKj4Ba2JpMQ0lI5feefaWaESVgOBfyGhKfYSFcOCLs9vttnPuZm0tOwzo+o3Ph+05bPXNZCoaElxQTFI9SAog7BZa1sBXdVgSzyaZhiL7hN7NDsj4LzyqQuc7etan4Sj2p9hrncgq7a7KcKoDgKRsft+71tjCP44FB/rKrjhLcJIFt8HXSUQtabI0WY3XW83EWRcb6gSeOu7dGVga4TtXFZQgkqM4VsTFy5eQn5I4fVpTV4MC8OYzVpYWyfqz65DIk+8nj+OeNNUPjxUDSd2YzeN5N2XL1twQasrFb+clptsBqZjX9EFv3SXn8BcaKSR638ipul0IsZca2PQPn/PGwznMfLk/GdiXRomfvgECJKUleg2qI/FX/BITQmwFjAD8eKNHKDrcaOghzdo/00Q0UOl7T6FYKncwYT+MAH2ybq61JpIGVtsbB1BeEYvyhiQHWHAgy/5ncrrZamk7DI+cYlf59SIIlYD4AkTFYMgSNQmyCVRwIiC57xI65hpLV/jmEhu0GUqmcvSBefSS2GxFk7f4hTf3zisf14MPCpwR5kS38I5P29MMFOKQ3YX5DMrWSakroLuaFDrAXH1ek/ApsxMSrMYSMgsRq8E7v4RKRUhn2kj54ML6yY2tZQIACIHXirKIrCBKMaFoqtcq5v635gN6pcmV/k+Puyq2Cq2GRFpMltGiWdSErcJYO4bYs1waOxD2eo12V87Ic5dy1wIzpFOJd89N5hkN98aAxAl6XwH2adiImmeJ3294P5OESQdWPcq+zJQYacXqcrn6usxrYXrXZ0KNX/OX+4DkyF29Wj7pobs065NdgczZ0H0TQWmWCh/hhCizzznt/jbeYuL82fRnKFJykvn113EWDXdWqHSAZr/G9fVj443V5pN/NndIet378xwBt9pcZdrxWTGJbO6EpR3DheabRHJKQj1UPcRJq9KFjf4WWz4XKdjYoznxJz9ml9MAbWlWpAc2hNI6EQ/XvxJAb6Z6aXGZ4KJqAIR5Mo8/nLMsvcXdPEPcRVONcMUyt4XSwZ2h7aabU/1WGtOn/X1/j0LDnnxYDa7afNhKpn63fmd3FyKVJ5cJYxDMhWeYqJeK6F+HTLYcbzjGuRCLRVgIFoWUAoyZPGyPAtv8Uj+ow6ieClSxDeaeWhD7rzVXFznBSugkPcim+zFwFrX0wqlQF9CCETe/I3thR03Bi959nJgwCZ+qtDx/NY7OOq+EVvHMLVMGIdNAjt4GVsR0M/8GEy/sh5fHdTEsqHKzlf14DL4KWPPy0UXE4EcFcfSmsMlR9BvmJ3jqh+Hn4bG+B4JbY4pV2XKXfwHUoQJb8OfNNYRUJO/cSlBssDnN8XfI4qLm1ryBteQwmV/1DlsrBJmzxu+dNwQbKp4ueAoE7369tPUPnh+/zIrBG+1RBSQYp5Gx7um8TfINMh3t9HV1jmmObdMxFRsA+NpODmWJfa8Dk1C3GNVskVkRTCo0T8DvVdfG/SzJQv7DC/6ENfl3I5bYy4NHmcjMyUDR6S8M+PLyN7AcIeNOfhsZQ3192UBGM3avKXdlAvUczr/43nRxNBvuIOxixWGxnd03JBYOpUUdchez7sZmgdSwke9E75oSKFcxyYud7s3Yaw67q28ctozAPYDTLbAMjnV+z0aaiAurXe+VmJj9QKoaAHX+QOIQRe1W1E2oK06BYDhqlb3J/ofh5IsATrNY/0g40bjhfHDUR+FYKxc6Oc+Dmebcv/mTvCo1crKX1gbAoHyH749Y5b9E3zihtcmals9Kvsri3QhikcHJNzXb7Ooa+HtQlmgUlAYVHI0IyQidxTNE0UzyasYj7h4pNICPkur5IO3KNSNZWfpZSsvpjr0/Ol3kNob+GRrOqGJSuKG4yANJCIuVVrJuPO+yVSod1MnyTXZbdvfS+mCRR6PyuFLXx7cHXmQtNJ6Q2B+2tJ3cv848TRvgOE8kkh7zmAHigHGHH3hN31ypwHlL8nCvDTcC6JvYrqK2UF9zF2z0hkWZamcmUOfIIvvHvTy8QyWECaJn0CQEO27vS7E/O+GcrYuapwf9I9MEJ5kkled+e0L/Yp4pSdxmyneZ+MnQJJPRGEDkts/o/DqnfIKr5nT5JsVbv8f7ohPZXjufgL5ZYDhH46ciIpNXvX+Xfrsp8DtZ3tGsjkaoYlRNVflaL/ekxvFbB+dfIU9yY/aq0pVXZs2+Z7py3HpurCEsBHZDBL+UYApcrxgNyeV2QYtPKSNRipoUVtupCmSuW8ntwUlcky4ib2iCfPOqZybhhmeYqJAgdDQe+P6RmnU2gzZXOWKOZG1zg52yHrn2R8Y7inseqOT04GzSBD5ogD1sAp+E/cKFZkP5ObeNjbtGwPGlTAgL8usn/CtThznJh+INnZcXvh0DznVWdKOsWoxBI/oPdsFxKPjE/q31WbWvwvUgDJs/AmkqYDzCMuLzRt3wyts/EfkkjRQ5qJ905PBZPRoHVI3XSLlNJJd6AWo5BhBHGMuNtF0gPvcPmXMuVwXJ5/PU/lFdhAQls1O/24o/W3bWF6oGDkWsma/+kHFfVXxlpqSxbs9xWr5xSts0XOGx41X5M8yw/2lwwyb8zgoS71/D1l6WLLBQs/zwKnux9eM5glLYLp9DdQ/TCtM7IK43vJFswPfvoi87dStDhT30aZTsfzomQeqFk38sikzJf/vc+0yeXZ28VMxPPGaGNculHVPDsj1J/vk7ahOV5qtwtO7uKZNqY6wJwVBRs1qHb21rQBfYlx2BqgJNfIHzEqpZOXcXAn0SM0V1ELZOHpdYmSUlvO4JWtxB16MJ4Di1cStF53NBDdw7C0vau5GPWKlFTTSseEw0HQWVCGuYWe/kU2nlC/3nITwIyRmK04kzCYpaxF4/Rud3s09E91U2+nkF6/46WepiBYk/8jQaV/H2ndsTbqq//r2U/+oN4ZEmCMkjHfgfFaV5SWJmxG6BD9mUcfyMxlwtj8B1coQcqlDVBoYtyJNO0tdzka/DSaQMrIE8RKgs+6ymzT9Fhjui6kC1UK2HT7wG/M1F8lU+8TaLTSpLmg+ZgjTn9SSH9DJjReG6FaOsNp91V/Dm2XSXnw06nZkyW9ihbJUTDDHA9Ab3Lpa3am3zpml3trmVcKzbZwkSBL1w6vkb+2u+LOwsJNuM5BIhVIpHUeL+2WpHcnKhE435lqgHktmc0hy2vO2Gtl083jRYOnhOgeSTjVUzBC5J2d+Wyv9T9UgFD955y0aUSUGKPEgkBy3740w2UG2/oWa8SCHCILtmXaoHzAvC11bl0OEmsIO/t22GQ5aL9LO0gfxsyJTR/FBNEZQZIOdJWlde7pBJvDV8L/b3FEutP/WPLboKWGLePtdZOGS3Pm35NkEvx8DRsxOtTZ72Yw3ZLY+VkhwRcc20Ft6XyQFo6z7r7ezCA/Q2B5HAeO9sUfQiMf+ipvMiSnL0AbY7/pkH75OtsVlOdNc2T1gpZfsqO2TqPmfMP8WR78kdSJe5DFYLVmaHipFatwlmwa7tWASJ0g+Lpour8tnRE6sJ72hL9z2VDHHXp6RIQQSak741ZnESPQMNWMztd758WtE89fA1ljldPcyUcC/7hQ2S+D1/8exjT1Hv6lNa3gvrfpKj8BG/Y1bnn97gOtFncRHhCr2kxHshrHmo7GhJJFUuMccUl9tz7GKxec0VWS0w44bOGTHEDOdfQRe0vmphXEvTYiJLZAR1l+IDVz0P+khTjwxtqVKyv4dKuNqiZpnY5B2nPgjf3O4zlmAiWr07+r7N4VwGjfLT9fNG+tlpPVO9Dwk2a/qA4/A9pDd/hFQMRlP/lmmzbzk4YxYsuvFaTp38Z6jULdNiuFSz8p0JF8/Hgl9KNzIR5jhr52CDTnLC2HX8Lv8TMZNlmdCHepHGG7ONvNx+pzf+H6SctQ5DfuFWmOo87H1d6kOqNkY8orfe2xNQjaSvj4tN+MYjf03hwacGg5uYeXIRw9BIrI8x6EKtTPEHHH2IsUJjBSjD7RB2gZTpnGkswNNk0bbXeHgC5r8xevKpLwbYRWsQoIr6wJRoLbiaEkW3WgbfJzTOxhku+W3naFpTSrquMEI3HOUqilzG/L4Zi2h8p93HuF3woKju584WXDgwgckjUyXeY2jFF1cmtEKF1bF3sbsFWG8bcifnwITmxsP1MYad5KrSrF3q8r6AWJ6b25dPCTIW3gg2ESKkvbylCpivKqyINzjTiZ0/15w9kDz1BFlwFLLwILX/35P0yQlNp6+wJUu947Dyi5WfHH//GZTEHGu1z1rYTX+puVMV/Vy9vsKCCfyrnlwBZHeeCxkOLsXZhbVR+HYAJ138NEd+6N/Ab7/9j2ZkVCSKIuqY7dKLIJkwZNFgteOmMRtnkuu8sxgRrYReHvpzdbsFXtX6D0cdCEFXI1QzBXvl61vJgLv+Jb+9p5exjz3j2/S5wS4K7ZKboGPsa2CvuhAgCX6m44Lk5WV+iMOrnkdED8J0uBZ17XlK5L2U8GsbTzOlZll3fo8yJquBjRpcuOSsOm07QlfFfH+aOmyIuP6Z6eqzyToA6ZsSr+JV+dKPTc716v5+i6MSBMDnbQaiN0otJhoZKNDFnbRtczkIkKVulvVRpIW+5eTi+0pifAsLGPxa089h592ifUzgyGPOh6HfK1Sf+1m7vZ4WnwaH2dMd4CwwRUaiy8+gDL4F/T48mpN4h6HLLpi0CHD74zPmuNg/dQ71A8DXk52tTr+CCTWYXOGd83da+1JM4dKlN/s85KysAxZ1UHFnIeD+lVrg5z/qsXtlfMU+9VjokhrULnxu0Zlg0f1haw3UVxEI2uaVKBUYMSJiSUNQp3adsI10nusdypsCmDHqIYMPvwp0Dj9+Iitws3LMd1IusYmDcw8xwGUbxMtd88BuuvWN9uv2wBJUENkSA9jKfklhOgFMt2b83sxG0d8pLjNO7/+WauYkWUeh8bnZ9BufSe2k8Dlxrio929FvKgVbBxmJQT0LLZKTwQxM8cQse8ajwV/tFnrcTHD1ZhcAYg5a8XW5fnBEI1AsSM8jSi0OeFexpf7PQsy7NZwseS+cwiJfVrbY48901g7+UI65m0zz+jlUjpBK1Tne2Ik98qE4Cv+RobQB2LcEgI6qr5bU1HbxSzi0JQ5vvCUJ5iRs8x5VRt9hj5a50IV0RmGOrVV4Y2KGrLs11KbgnjIo2/OcvinwyhWnV+9xkesCCkvmAdg7HdXldY9VngVh7j3RUpUozualSRxcYbJmdhNrktqxUgZXGwG+8W4eHSQQChirL11LMUytMwxP8gNdu1npfyVLmMdnBT2LTN/5+4p/j8WgVDVZQylbSNDshG05LSQsuodkHoyDFB3U8ztcUjvbC4uK1P/HnJxuok++6GmhiGiFfyIYGobBhE2cfYQ5UZ/BReSdAG9AROIW513Bx6CtR8gK1JcvRw+Es8yuYjBbIshC/bO/29b3qVFrdX8hWJo6R85qcznjFu1f9TLjvkOCxI9LJkxMMGCJE/Tm4aSBH4eYUv69x0ri8+bDakgaBCeVnQQyNE16aURMcvOfRhXI+D1nT/1LX3NnRmwoU+p185B/QxnrRgGnfYriPL0veqACHd8l1up+6NWH+GjKPgHhoX/X09O38WHEFAZ4IEdfIc5dmFfB+wR6D1AaESmEIeP7CAQrxh+aSapkJOB8FNFhrgz+m2k5PIYNFfKP62CV8fYmGE0uVA8bmDgHDMDu3lj6JQnEnsvMGP/tErchNRy/ER9seTDvKj3iXd79SAVnPMWpMuAfLtmUpvQ7yMPVLQ/RMLdMAlvg9KS2mQZw8ujrR/mlxSDI0KfB8aUqXO+oulXDajqL6r9KtAVpoiWUW8+exFQWDYOIWk4VyCM1LK0NUoJB/7modW42t2S2RxNeywZ16UC9eZAB4G9CPfEgA4CM/qphxCdI5MBcsURh/xUY6nZEwcM0/sTM8c+ZhrsRZknOWJvX52WdRNofVQ6MfkDod5hnMpzfVbwczKcHKYJR8uFJUwpYp6vkDNzOw5I2dphk+PYfNwtJqRDaRKyt4mBb4QH5znIj9vhtFKp9hEij6HhMY/ACogBZW9eFy40oMwlo7oCsKrEXhB9EFUJGJzulFfWpWxwGE1de0wqF8/kV0y60JQwmMq3P3pWKjfLUlUrhy0uINeSiCk5nPWxQWnqOMBda/20xQqn9FiycPeIp57Mc1Yry5Ot6F2BPP9qDXdemJ/PXIPGqO/fsZkUWV9pUnwMmbtGOAGelqUlSqSG84ynT7SaqCurc9UAPmQV+86eHpNK9GzERZ5+xx3p0xRGgAepBQqy5w9BmP05X+eZ0VK0cIx/kaYpjPjehZFY1Pu65iI+3nI3EV9WzL7RyxUb0VwF74QjgXWS99XffIBGPzKQQVX4k01hDrv9qjmtVLvdY3MNlyyygc/I5767BTlOhW1y8KyWjXDdFZg2XtqFx/4WfcgRHCzEKJr/x0v/LnThjQn4gNdNQqBXuA+ElaC/DBcTj1ARhto+Pz8oO7ZlOgjlMY5mLc7agnVXLvNEsjxiTasTb5j95WZ1P/xfdWdyrgrn3yzat399WwnA/8E5V/4ee+iA8qhZ23Rq+fH6ZjkvCZ1y2PokI+2N4Z075BYSUTxBDB3++2QsK271Woft+ydTXuXyPhtgxn5VCH77hlnD3Ul302EeJBp3kzJBsGBsmoPkG+qKQSkr9k0kMF54aTii2pgP3db9Q2rXP1yCIV2oFUyH+bOTDeCR+h4gJy2nAC2aYHqd0TBC/lGIpqOPCGfjk+EscwDAmoXpwbsX1jp5tLAiTb5bvy57vqeObGhcxq+6z/yP/J5gHn1Brl2YVi7wuOkBxl/thbjJLwImA53IjoNjkycxnlUAvzQgm9NbreWyTwpHDSyVUyyP61LVXVDhwXmNEemV3EaOkqRknHC0Dge7DThOYi95EPWUtJaTlZHBBNwxAQGKjI0oa2W+aPv9nMwWs9/+KETea1R22tU39eOOEa5H9oCzJHjgGCJSefccXuehum1oDMqkQQ3VXpgkj4g+WjqM++5NrBoZQE/vEwPdvPvz+Nz9DScpC+RYU47+hte0HTA6qgMK7VV75LYTkJSy1BW7TE2jISXjwapLonFgaWP9JvgamVdzQ5DxU7+znYOgOyAFVZxL5aLxIAavqkRXXxLwEXAENp2r496Hk1jkzJV42SBUkdAsrf/ZjYOTaGfRHRHNH6jqnOemBlgPpfciydibpzDrDdChW0Cm6+us64hBt0jhVsrwaFg77LDvSk4ULGMvtF2WKBMLGec+MB0SWJQuR8/yolPnhAmnOBhFY/q7Voc7gjyn8DHFV3YxFFkfGHQJhNKW6XiTZ9hphuyEY3A1r7God75vA53HmGcICeqW6MD5qEUCPm8Jxg202wtXruspTGntWKBQuuQh3z4yS4qgz0Izqvv/Zt0Te9NgotVQCb1pBVVpq7dosiwPEsVqImXxxxbWRjfUtC1tocA8uFJbh2j/ZipXnTh1GJ7KdxXl/AnGVs+eBmFOKmwrwesK0S+ReBGHF/kyKb2s9F7WQT0HdgyyLNkjJJPU+sN6uC39+OR5iRmlAl0nkI323+qWo+Ow0GU7F/YQ21NnjvzrjBIIBssKOLGOEudj9PsA8yZOg27QIysdiSBMvpKhJZ3r5dYFaH6swgsSoZ4CiqTppMCg95eOmiceCGmZ0dEK9lVUlDuLsnKqaoqh4kBtFwNp/ltJnt2NrSFWVrNlQSFwSokQdOFNueTZ5oQ8xVD2t6NP2M8/+nU9eALDY3t0BHjIKIv5l30Hw5T71/OVOezBUxtvbeUo8dPaSo8kjuP2/GcUBDHLCb2J/ZRoJ/X9nnfUTZaA05/1VfgyRs7D0ZOlataHxBDiPgL+OyITSIzEjswRC8TqwSy7xU4ggtXEdYReq2lHvhmdVj7+n4H0xcr66x2Yqhy9OD5k4LIbJSEh58A4DdSleWkOm0hr0EbNtfajf2gi5NP+0WSIMDJ5N847reDaem6aIM3Bm0WTdNSaa/rUcfpGDJ2TQieo6gFB2XiltEFYLvGdgholAHw2Btkx8KMY7wqJrIUnSHZyBY3iqztF+Ob/PHQj37PFs3Svm0y9skYy4qAgxooSNp2n9UehzMI0SlR9teo8Qj0YeK6+Dliqqrj2N3ePHFMVqu9hIkJq7PT3CiCNxwxsgbpYsB+bMEj/7eF0H1nDicbcr3MWxWXYGAjGhelc6NiMzWGEhB0ma0lGTHIRz1dulG8BOFcqAQk8DBDexhOyg8ysAh+1JbuVYvepwan9upV8U3/VWarRCGdnpRH0Q/SJJVj5tFxDP/I7TvmN2rEe/iGPpZsL72iVz3uF6NOTXiXfgtxmqgITsqqhWRz0E3HmDfSPsT0c5ebzUj0StusIxRZTKOlHTJbBrYZBJ7chGhXNhPMDKwOw6mIml3RmDf/mslyrUga5plNZhcDweJzb0uvql7ckpAZNtVW1fvExlveUy2vX6VrlnKCGzo2HtUPubRd6TWI7CKj2ccn/t0CslDtc6hPqBWG6q82/qIfr0UR7QlbnRgpBmq61rHqOvT4N1OXx7psvSuxdsPDMVe6Gq1g61/qhy7PcOhTMxh7GjNSDXdaeboXbaRGdFZdah6XkAAOfXh936WlLsB8UkjM/sJnRZ3ZPTwXPWjY72jDU7/Im1rGbGnyffI+zu22vBPZIgYSNKJqTALzEUpkpO7rz6xtvqH23GODuB7GOc8QYwHIFtrIziuAayBSJ0LDKBNZQESVSpC2uQaLjKYUo3BYQw8h5gChJvw/rPk8EKN/rhDGoqr14eVzAEu2bkCvXDz45bvMe78L9F76UJZnKxgvU47prAIphjOPQOPQDMF6v9MMH3GaEATG7MGKYm6Xub47HEInE5acuzP8pjYzBk+8YhZ7x0vF8v+gq/HNVlT1X9fMu2Qx04QLhAO93Uqx6BPrYzNY1bo1exgJ9vC8WxwHc33uyZJrrFZPia7/x8PHjpYsEBEEHPXbN6NHzxQJ4ZitveS/ENah4fYnN+41yyFJO6Cv91dAh4uR117/3sF7yAvIxsEexjjJIjeWQ7tVoXTI8ZsNBxaKc4JWXjRj7LLpjoni3rw9y8LjvOujcifYVH8hLQYK+e7uYMK7MN/rWXcST0ZFpSMqIZjMLEA+ZuF4eSWaqNZp2EPU0QPaJrGYDBmMVZxzvZVY7B2gkZf3g0hodPUiuFKXCZKa7jkfiKHIAniSV2rp/RfP957MhjYk3XbwCMVQpTplnxlmKtJPzwIgetk/3fcuGfuaNgOKf+4J5SgWSCINqQ3cX/AQMEveT4jVjn+1dxXR9A0R8HllnYQGfAVHQEYWRjJ/ImY+/YL71CEw+eciawN7QJxfMbzC449oJ/RNTi41arp8St6COEiOQIbwPR+7EojpPeT0vULS5Bi1Foj69pVxnasFai3I7ZQhPX71JVfadhAqLrvtSVBjjfX2EfO/cF+XGjbVvCwVOTO5S6wmMdnqtMWqpWn1QdqpYlVDxJVyjv8FRC+hi4V0YnjTOh86qOKdwXbGxGzY3EpcrW6obVealdylHEjunL75BN2dq72oyd/OVBIh41O/6xTlM4h9rq2lqGinX76P/G/k7apDwdt4dHvv9ZQ5YYCOjYq75rzNmuElXMiuSgNdtGIg5SUTakDkVMqZSfsG0XADajPULMJoGjLnLXMjvE5CQh89h9+yLYRif9pLFIBWNkqkWvP1T5IK1bntgtbSKyjQZ8c6AxXvhvKmgYu8hvi35H7TDCBihufzxFaoLT0NoXhKTR1uks2G5MemMmAauF4omyPmzZpIn3IBj4L/1kf9mC1cp4dUFucvf48cRSZ2oXHbfW0y1kXimTqYoR7N/uK5IcleBHDUdj7Rn4hEs+So0wDIa3KWnofUkc7wQpzDLwoTmHvI2CCjDBn5cCYt61XUpsat9ZDz2ByrXlRMidlpnmNFJzNlksJ7TYUv44NI2R+OGLXBkCHpULfAzKHoAmkyJVj5KUmmAB6bwxjuHIAAgBb4pqvYI1RvOoA+fPoJ1jw9k5ww0qQwELUSybqxuksmrbaxLtdQOf1HpQCb8YIguVcWedm8phLRN0T6zoC2qBbAgSVbpK2qpL37yhrsXnFsg6kUaNJ7WxuLipwZU+pw6E7UFeQBy5/Vib1yS7GRtEAEmabvHduFnwDaMiI0xcqron9LSmF1ei1nWMJkE5X2cV9BwkYAsSAstp66w478OHQaescVeRWFn8IYjYvvV98uSFr5OvGNdChJsTEwabLYOFXBdZMpc2xfjdCmutZ5l4m/Lpc4Arltt+OZqSOHXwciyp+WVoqdep0eQNAYu6VXC11yka+l0HfwLCHqUgec/oqAUubuy2h2HOCLRr/w4eeN8SDX7rm5saFogJvdOhQXBhU7wmJ983F+YgBrIa+B7nnT0/wS8/27RuML5M7JzrUVRGL61gdv1tToG4AnabxsAr7++S87QwGjzkg7ervGbPN+Rck+24F2sjrH8PS05JO2QJDIHwvCd74IukOXEZvC2b3eq/IyETOIlLNQbSG6y4ZWaU1PPgITIjN1ueU04KowDxb13Ve9ce8rWV5tHJQQP/m8i0Rm1hlIhNcP5YLXfuS2zb/AvmTbsvbDWMAWKjD+QnHdU+RMAtGIegG55W4CDr5NS9Mf7erqBhykevSoruIV9+X4JzjTJEr6dU9cURDokDXksesCauJwEz2bcyJ0gx8BJkZ6hhtuOKOae7zV+s+hn0x80dFC1Bm8XXMBtH7IFalYNNj+SptkJAJVYmbdx5olKc4kvPBQXjvfzTGU7R8fI40Rd7RjE+Eabri6mu6D65UJKOsn4MhM/sf6PJPB3xn0Weq2Av5LJYDYWgW9CheQ0enr3ZqFWqHdgqwAnuiM4Zl9ptdLHU4ZQs7auF0wj7kdHbAvDIVTxsgzc+9HyAR8+/6EARgAYlQEVkO6yO96XmOQjWR+q/Id3CmEgNrg7GFDOLrUMmN1/eAzdW9sOWsegzWoEPwO3RLePWnR3G6vsNk4iYC1HmoX3TqEaMLkkerSEoP0Vn4nnNxvGMlOc9+J1mDgZ4XStIUtjojfZY/kL4pn5qAMWMYbT4N5+vZU5o+3FYU/mSjleoM4eEvzCzFreTsxGjwQHp8k+R+DonpgYh3kUsHyPK0pXpemfXHutVCm/k1WEKgwKC4ECue1bKYKWGsL4mFaZEAF4uzYnsw27gcgDrM//8cS+L4NvgoA7Ir4A8bQEi0ESj2CoQAe6a/rGzQhWAwwXRs12peWXhC+cVRtumdGwnDsW6amgMKJ74pmh+d3gm4Apt3zZqf29fSChgwlClf6x8oO3eRd90mcVyV9o2ymBPqIK4X0Pk1s/8qvE4AiNmaRd9PqApiT2LIAx8pscBd5XByI2Uq6MCoyo1KqKPke3ca+4ie+r/IPeAhqs53E2XYxViYS21jtHTcWN/vFwwAuDgusy6NGVPOdTakWoYmR6DMa+I/ZVufrNCyUeUI8xecJvR62Nw9riDmuStNre/4rZlWi7cBLAdTJz1PmEH+dreNZdoxs3O1abZcWuD8ENqhuFzFMmbbuReiRR6PtKKjhjrAFKBDOfNx1vsfTWKuK3GIJ4aINlJauanL6pCQCntsCgSokZRyIE63zp4QtOagnHKhGrmpK8PUmnxJwqCuwAXd1Nn6cJJkgT2sajU1OzywprSy74jDb4LdhbkF7OqM9oZJJWkCbc1UrqIiCcuRPcHN7XWOAxCmRSK5YlvN+AytSJW+5lWlPjvDH8rA6lRFzl6pHHio/dmzuVLAc+oaj6XDKw/TmQp6146ZVzzXaJv51JbVC3eu3lBnSEb0G8kSWQJbC/oUCBSf2YUhPSM1B2UqyCmuHGThz0Qdk6FvHCKFOJ2hZw+ilwOVeZrYcVQNjOs97qLozMdYtfhVPSE0teIcPyMdsWg9vBe/5R7bcQBuOa81Lf8zgSIFonRzMOiVLxsZBh6Hhuui9RTukCK4PUh5/6/WYtIydGYShPe247zsEoCZFDMibmpXCDumom4Y6FRrnRxZtuIbchxypfk6xMwbmsC9rWuIwc9HqMUy/7DuUr6KL+AeYI7MU2u4DXvPpJt41R440+/EYaB5q2z3kOeRFUhtpQvgYOVbYEbYfAQHLzUoi864gXZsZFV4wggNsO0jRKo9f7fdz+vI3dgdGU0DL1zGL/rQUGevi1LbfCbmM3ussJyBBeFE9n/vYrI7cdfhOpLPu9dftcAYOWh1wlusP9vlmIJ0XC+qGfSKBt7PRhQRbbL00Oy0/kP0TzeMNPbPMgUwPICNt8P32SxK/Zcy+8AAP77BfU1dHzBX7U++l7lKGTG9r/fuFnPZ2B0sS+rY0SgO59oMSU9+fKj8UMzE4RuHNbzhnXkTwLLRM17eiJeN7Oexhw3pUeC7BuMiGxrWWAUmpncjq+IaolsteA867XfDmAZiKgzRKQbsftuxj+x0y5AVX2E1MCqAOvwxfGPYCg7YGIutoP/6TTFQqcO3z9K3bCSM1PrcwY1pqrvFTeBtmXlw+URzmOBP1C5h8xkBhNX9mP76psUdXZnhIZJ7AZZngy566tHA5Wqtsy0hL2UqF+DRt+8EChJjN8s+fwC1kxgrUFgzXQCQ7XTaGXTCDFzSoz9BhVuq1ZX4c4sHoTlMb5Vv7vAB3KS213+cNamyLYnsFsYSsGAzwq7pMQyehLRw2ZUXbubRIIQBdHsWcSWp/kLQp8OwCHZ3YFUBmVYFMp/0w34IUdItBxpSr0TW7Eu2nTMU3GaiGeWdDx6cH+pnrLgQQoi9bSxnaMhCcn3vHA9ZJ+SRNkh1oj8+Pev/lozv7zNawZCGNqeiMhGCKJWy1f1Ec5tEe7CWD+0Zpf1bvLVdro6KVy5/jjCS9u7H1il3+QPpfUWrO2tgo2jRwv421758sVEdND2KN1sFAq6MWanyW9wgDUShq2I+gIR2oyJIMITKDUELVFADqXJJSZxet7DPn47r7wIgR9/Vw+j6FRGtJ1rkrDbCM4aNwxmbZA1+/uSTi0yUnf4H5BjS8K1dCcJCPLQARadzQd9rDolmXnFdx+ZntrE7f4Io6ZmAQZAfoxhKOzi9KXWSQY3OZLAbIyNuBVRjjfPMN1v6pQ0Znxv2OwQ4fA8FkhsqYiEtxbs5JlRhk9c5TAZDopKgCO3aGAFwM8ZI38ZhTi40Mh/0Rs7oStsLMYztnTiRpYnm4EHFgXXj0qU1nW8KbE1i7e+evw+/hNvwOTVVvdO21NGCIqquRrURKG12x2G1DntxQ5S5bheealydS3szh2P37O+RXRQ0B7oLVNXgrWNJdH+aVxGvDKIxGdISaw2wAvqAWM5grG2+7Z8kIPxdROfOj5NLBBXavYe903ftst8n1xANdGj82dDy8AZMaLqA9DvAZoLsNKUbTqhQFeiZeIPOJgooUgWofDKF6XQNqQQaUv4XP2PvbjIgLzXgdyw6p/AnNsl86Ngmsifs7SpC2nz53tLFM/xOhvOooeseKYI6Os24QoSx5bXpkUiLa4lPk/rYxEP+fdA3eEi2cFUSSDtAAVf/rHwykseEP5q9m1Bj3WQuHAalg3Xf8n1y8F9YdvmbQQ5ZNz9FFpm/TfieuADuGiQcp5t9H9ihqtR58y5Xf+H+XA2kj+1guJn10hXKuhSDxe0SWhiEbOl81bnTPvacmYgLaNqjlecgMP0CI/rfRxkxmO+2A9i+oy0iq9HvhqvYdfNuwV3MG8UkrdJcpGBVKyMBuoDYLJS2whrZADFecu8xkAkuot1CRazhhl0ZDT6Na0Lo3xTC6UkcDS3K9WrryvgLXm55YiXLY6mdJamrvaFeB2BCEMLtbgaf0cYNy1rj1VGWkLtRUhgrQsAB0YeG8TMHBBOt/WWOLAPN1SFDxpRwsKgea0OzDVIacIil7wYPsYu5A7+BVr0KehkOQdNj8RzhkdZDNrJ+aWL5+xTonUapXwVHwNgRMRK5rv2diwCRn0Ttn/4193oorAv8N7Df2XssrHqDEzpyzvgb0L2+WFuqcIXTZmuiqX5Mrb1mHFBkF87EwHWkeAZ++xsQQ+LPCpWvbltXq26VwEk5YTfBbcKsCByEfHBNpgQF8enESRpcpHLU7F515sLH2FAd1jIXFQMOSXtG3H1/JHzS3cAIHJtL6aX7Y9a8b8SM6ZGBvqG/EXN1b8nmVR6SzWt2q2D+QVsyJHV3cfFgM1SIkpwtYf/z6c71tfDltysBxvJEQl/8Ap+njgOBsRL0omr0IB309wdluuBkoAiqctw5nn8QjMA0FA34SD4pLNwBahD6CYUQme1mQz6wljtRCnltcMWEOblH0uLGN/ThPsEtFaYq/YWrDET0NTN9dINOGY8yNotTE5HT+Fm41Cp6CmYcX6QQ433h106iXHk3e+VjDeJtw3tpkxoWoHEZNSQej+ltNyCLI0+m+Ua7rZVaOCC13HZU6aNzXDLGhnXB7L0sG/wJgFnhy3s6iifHV9aJzVAdKSpUg3nKyTd9XIc3N/66eu8c6gACS9wDf8HKCHIWv2o578rrQ6QGAGCXsROiMj2jDzm5M4WjAroPGRQYON2lGqLfskb+lnGxD+kHDwzfHywsAK/m368p0NRsH+jgwk2ppGrDaivo0/uP/Mq5xZpjGimsQpnOZNGkTewgA7XA/K+3Iqm51GtttnbM/mfPRdIKtxEMRR8mgq/jQCL0f0q12StfOsZ4yMz22Hl+GfxkHj4By2wruQIMt6iiK/WYEQA031MEu9IdJVQY2jdVXiDInh3WoLMSGE20V+Tj8Ce2ADbsmuZlRL8JVTVgb7p9uFMqCAN2/ZUWulF8DmMCCeCFgOsIMN6MWrcv0nEzN/VXcXciXX0W+VCSxoEItufRscsL4AJzGtjPkWg1ru2lSMXoOUO7ucNjKoni9HsxkpcAT/swUflVWqJM4b1krq6u9nqhyXyPrQBCiO6KeApRC9dcYUAfEcnehIEwnJ4Db7MRawKvLIozHr/2HpF8Af56BrQgDqRYTpaIaBz5EMJxg/M9uf4giiLhtQqjKMX85d/B2EBcSc3hGE+DmRrkOIXqup/YTKZjfVUO0PDRN1MvARsL/rWsqJ4wZKtVLQJvF0tMY8+NcZPG0h3s4xUCShwI5ohIgVe+5uTnZq/AV6ZadewwN60bh/gAo4tK15h/fdedfUj/Rky0/2aQ7FtJSXi8ty3dvJkrLyNhzvt9Th56uknVsGOlp3r7omFGce6QrahbTQJSVlnXcK+alST9RyvZDPC76YXU4Fm6svL1MJd8DA/YdguNgs27gP2mMurWEDAmu6VLDN5ugB887FSPLrceHS+35637X3MXSlS+UZnLn7p9XOqs3M2EPxNolqDi5Lfsio+bXmjJM0hwz33CNNfMsKsviqyU/iBBpVggcCELOPpRbChypbyT1yE2JKYBQd1j+S8onudWBg63smdDhtsYLT1VtpBkFsxee9/+nr8tfqz5/xDdaaNmeBMf0OxHJDZS3jxbJSrq3EXitRvPgTO4WptuFymJH/zFaEWIcVer7x3x0FHR1jmX7iZ4CgCZffFN5AFyCQR6DYDs6m423GCp6viD0QZMgdA30ERAqRy3x3/F7D3LLsQGjZ7nJEEf3nRZvkwCDrRvs8egzfvomujdS92WkgyCSKa/97qASH8zrMZ1pVt7OwNjSnaohbSwPlp8KDm4F0tlUJY+0hH7sb0BR29R2lLEEdxG62aBO/NP5is+fhM6WTkwe5wEcD8z7AnECSb2Dwftha7J5aBcXaiITFovHedjjh//78cMlapZ236zBEYt9qnq7nberMTNqTXgKUJ3eHB9yqx4G3gYZ4XL/0Bvd2PbevkgFX8Q9zENNbLdJrNig6X0Hm9WNyy+5be9KRIUgKhapatFFS9t60W9gehc9lGaNSE+uKnA8IZGRKgmounHDHxujz+qz1lT9qLXRMbmtWEKbtTG2zQtEdvSFEtllcMfEFcNOCQS9STZumkPdMS386bNqQ63hi3DshZ3bGC0zxGJ0yua0Ub6KmZYrEqpK8rqWNoaS2G9/KivyRUfKYf/LdCL5+s1d/10Ehs8wZArVKyvgP1npDdl4x0cBaoW/jWFBCwGBia7nk3Ve6W8wKf0pl+t9XW2ixpn+M0Ss2f3GxidJzdGOlN5oZt5LC7ntwhqQgJ9v6MzRztlS89jjPnM3n9uajU57YXo+OAjHgEGfp8/XrnaRoi4PZpoiLA7L1BXsc1OzUYillJXsG5wENJQ7TwAgY9K5+umXxI1T2EhP58A1ssNFCoStyLRsYjwv1hxGDiGR/D33BZT6mFrur3zy3vMaToL/XXOxtl7UiLNPBRBfM8y8E/kVe4722VmG4eV7Y7Yz3GxtiHY0Umo8Y4u1idSEBAvAOZ1auypgzY+fN7BWRAo2VxKM1/38HK6hHO2chWd/8k5MM6ET57S+bFwPYjIFbRHEAHn6XNX1HC+rLkEV7zIxdT922TJ0e+FatrlZjpBKeMQF3coIBGsq3WtS2QkM0sjv/Ht15z2iU8G+fAVwuLVxIMsDx7ZKLsT1IDdJW9W2pCSv6SjyWzeSMup4abgf8WbQS2ow/olx7HrMHMJeJvxjgSlJtpkzTYiK03weGp9oij/Yih/skNAaXJ7K+Hh61kg7Y4rtI8f6W3S+zHjiODeSxgLhgGqcJXK+PplRqsg1hvk4MWWmC3oyGam6YnJgBG86GPmFSzyndHjC2VQe70zBZZcsTeD3mLgxkm6Pw6d77VR7mK6p2rK43f40S61ntJT6STnhO9+7ddp1bx9RIRLap8ID8qTu/lorerWf7o6MTb0n6wUetcIUgxC3nbSsuxWBvuhFaCLkn4lNqMCZUDaXui+SdAuZBIbb4r5rhGrbEfOhm0Zs7J8ZFk4HH6y+1XGPi7BzyBXLd9OfUAmwMz+md5J5MngcEnzMk2E8CJA2pzHqK4lyhi7X17CpfypbXKVgmsMEVJLNT3gTq7vCQwf/r0TfHMw47nMjFwp58pXvfuad0S/DF4rwtX0UmcWaOtV9YgS1YPxIqxZgzG9jIT9NHCUhLOBfCdulW7c334C9HXtFC9hXeTLj0CXJyFcJnAJHwyXWnqpVlL/HeTPenQF+Yq45AdQUmFHY9iy0mcFplII9aQNcecTZHb/BEzMI69hN/Hm7uXK1ZecH2VqX17KGB/GUFurVrG+u9hHozqA72PEQM9JvjmCTtDu0V1uC0GOR8QUxcFCpEocZTfbAW4wgkj3rO+HwR82x6/JZGWkSxEsyyGxw0yYJaZnn+6No6nFeZGMDagukv0Aa4Yg5F4UXzn7KZCkLcF/Y79Q/ue9SeitU4/8vLA0ZHQH0RRbFY854BcMxC3WVYe1omrLIl03EOor3EWIGg7vKPXN5Uw1YQPMklAKaaMYsn9WkahA56OCVIN0VLaYvkm+bhSez+DVQhHnPyUqIEkm2S+VLRtVIsQyrKnh5doHJoOGaTEhNP8mFU2ByMeD4p37y5HIBeqceU6rK2yzXqJLH2/voIUNIQqJAauj+xXNuY+DvIxZFeAP/KUANbeuh5I2EwllwESLhJH2WDQbRY1NoqhvJ99iuxWjfSMPHE3BPBnJ6f0kYY9o5HDmOm/cSUsNELfrswn4Xyw6bcHCCfAAkGgn9ZgvWSxaYANjPLRdweZQ9wd2B+DT8JY3k2hwtm7Aa59NwJqgyHEpjZdfKD/fbbA5f6DeuEdUQ/ZDbclgUIzvow7RcE3u6H8fNxUi2W9FO3Bwmt7CwscRZd1t2jqY6685K9eHqLgJBvs1+WfWiknBPPdbruh+JccHAw91yqFAXe20QyFejFSax7AhzXM9aE29nKRdCNETt7OXaQ+2OGhrlg3AHvV4SgQpDanYhOTeRcRrc7cfXziu9nxXQQxctGkVghzv0tW1j8QwRUyT3Kyz7kY4uNN2Qi/9g9455LDqwdI0SDqWYZEDQHXtWJ0iAHgyujeAIOYoRwlkx9kfUobs4ZdKGxD+iJXDUajbhsisq7OeCN0/FRwi6amlh8M36Zw5OlQB2NUuY2++VLMPXUkJvp/Vsq07IHDsilHrSui/x9NX8lGiKNfYnqVnasB2/K62oJXxhxO6XazLj4/Dxl+gwaYAAzgqWSY8/TMv+8qhzFW64m8NboieYSS6hfLtxNceudjnM2vEZP6zz6lltZTGlVn2dy7njFj85ZqL1ng6nyRMHnC1I5y/6g7I3sT96RgltZRYL3t6X8OZeDbxkJVLoX668eFwaprlqU2cLjhDe9GoaeviIW4u2JOXHK5KMDIdm+Nhu+rNgpBOtobbuZk/fCj7d+iQgq8kSrv5O+qLZce+H3isYms7bKtduu1el86oGQgyZTTk3xqQWxywvN0DTlNnQCFuYJk/CQjojmh4RAOn0ITxqn8f0uSKrHoZj8JkEwnpoIOv47jQ9pok3gNsoaSHlhPWK+5uJ0Twe1I/msrkIe/qBbkHepvO+gNwuBJP7mKQyocmkF3F8nXK0UfueLd3Pr8fBtrn4yASitDLTidA8HTU/uM0U7umadTh7OE9H7reacBlQe/9xKjFcgr29jZXj/SqHVTpVqPOt8YTH6B5bHt/ZyYaZYQxOUpeG0jkfvVkLKSsEZZihC4fX3+1kKjMJ9gqOlUJMG0D/F1dN1f6I0/uZ34OqDVyOE2siqRrbaPDmRO1xlnPwwpVWv0LnZtL/f4gBbjKkgTqrfIgTOJODdQZIN1Lotsb4M1j2Dg4dv43+hdre0VsmvvXc/JQNtgXTXv2AOrddXPaUM54M3dfdNrCrMwcNM0AfdVUTO48T/QQKPKHXPRorjGmPINIAriW4KfD8d1CwDOtX1KUudRB3F5BGwIY13KDPkMtZYAubhbTHetdpiz+5s3Ow/aJ06A6Vtmgx7kfFRk8TZzObdEpm6yvQSYhB7jEBz7mcOWp7HcaaumFIXKHvY/GDCcJ1IC5I29tLtSthokkKTiCNwbSI/YUbA1AkMLY0TASsEAs+XqSsCTNeduuXzuFYWiTTEXqkYMYtlkwBbfzKd64AY6P1GdtI1hoCiffTIb+KFS5kR62ITPMJMbExHj4VooxqsOFkS5NPX9y6hLHPZYuOE+S2J1LOdR6yvIkYb0eu6QhwdZAOXQLWsK99Whyy+a3YCNXRgUj86nDmcQgX8pZu5AFvlXbkYGgADapDZmTvJwXJyBD1NT6kycqXERgHrYtU3wwqyi3USqV70VYg3W0LL7JlLpUCPoD4Nw/zwvT+egvbpxPPEkcOrhewVAwY4qB4AlwgsCBEW/0UjLSyYRtoKaB1IhCl2n1tz0XgR/KP6sfi1zMUbqE63F0aoRcHxn+NX1dZyoWyUX4+he47wtX/VF3934mEwgwCFr7U3hJ2bJPu5c2oaYnRAuNOdY84LIqkccD61PynX5aDYGbLWP/8cWQ8892GSn4AweGnfnlY4Qo8jXUkrUdnOST+8HGxcaqpbCnUwH9LMYaA4xY7ajs7UTCKHNBTTnQmxUpwnLCtYyylMWy0g7ABiV5hB9IZzk9UTM5RdjntgvpMm7DuYQL93Hv/1t11dOKO4AcgzJCbRlz40JtbYa/pqDrm4ve81vEJwHMs2ntA3vZ2M5lF2vRtb3zzyVYu4UvtLK2b0YXtk4DJvrF5iewX4Xiz2wBK8R0L5KqfJiDMzRzlTKcZIC4HhRYZkXuYfLfIFP4143A35I/14+kc3tqTZCPEDZ2eS93pXy4XeQjkBpLF8yFDD+NpZz2LHNhBJW9o1/v7AccnmbbS18wTlNBVj1/JjtmAAAH46u3SWZnJI4ERv3LkC9vRY08Aw6r/9tUFe5hVd667xs+Xy1UJ54w8hZ7WRyz93lCe5xlmUL9n+9RtdK6Lv4PnT4VYplpH+Sr5UzmhDzQI2+cWaFfnOKXF7chkRawxL/kJvtXTkx7B+0ppIpA8BZ4q8jc4ielcpVbIfqXvGtYzs2KgWA3chgDGdhT5sa5bKlbbI851GuuiK03uKaLB5MSBjsO7RBPJOtb+Rkg27xkj9hV7Shxg2/1FRnA/ottqo+izbQDMnl0uXGCuKJFj3EgjUlbiJiKv52AEQ54dTA8+GDIQyddGSAK58LFu5HoWwzQMcg+INMquz+wzi9iWmGc6VrKirt3BIGSc42Jbb5Ldb6xYf6an0AAVx2cdlpEyutnJsxTDcDRRqkX0627ilII2Ne9dl1SxEujCkiEoKbyi5CPPR00Q+SOkyvVZjrhcTEN29chUJrTGZjeeNxQg7EE0tuPiNkqM6oqskODDpiE2XvkWCx7cW6Kk5UZ9KRJh0yrafoetvrxqp5U/QqBmDrcSPAm/C1ZZ2/kF/3+rB7hgdLwVO+clhL+15hkdZsJqt7fUpUd4XYnNNNTUbgI0xu204QQ798qCpQvGvQRizKdLG8QqjrJvkkr2TFf3Y6mimMP+EPtkTYAE5i8z5ZKnY0Nl/vtl6P8irX2lgPdT6I9GBxMjdXcsvTxhHSAhpWISoHR6foA5KtQBM/FxuxTVNYmaSwjU4WFq8/I/oEj5irardbVBNATydF4RR+aypTfzQ4Yd6GLndfEji4xx0feBd44OLvHxFYDo1g3u6SObvPB3JFUMRWI97MCK2fYCyv9vurLq8xVqSIuvEYfV4AdYFQVIvN7nCKS35jOOpdj8rP25aSLMSZTkYTKn1AXhficaX5oJw7I9ndPEOQF9uUF1fvROIJRAHLeHBOX0i83hlT3tN/eqfxVy/QZ+pdBhkADMvIQTcZzAp6Yh7kYONUTF1HTln/cjaSSQZl1j2UztS+Ljk0jIEtwHzfaYCVQO2yNppNgCcZT7oiUvuqG3FjJYI9KjYltPqBi8AxrDTOQ2VYD1wnis6wBJkG3B+ykkx8rnALpj/c6xb+URk3hvwdSRKCAqSPQmQu0CB1poWgWXZBNM2PlTua1m16BdCxvf4yTL9kCYF1QHnmVCCawcPcWTimzxJ3KOJMPbcSLG3IEYTh2SRSaHUu7gIw+H/XydcovVFJDFLsOnnoIZWFAkiaJmNaCKjpj0wDig6od2GeAs45nmtEK04iCfCTEwVdOsguYxBmA0zgUNiBDy2cdtIchBLtJ5b/ybupl1Ki5XtQhS4XTLSBAVjIaMRj/+CPBqpRkkWvi6a/sLPPdK7g6y8Td9yQ8zJXkuoO3IbVlDMWctZIpuUkrAfEDEmll7fOMNFJnVmJWuIoyqQDmYfaKeoj+WU7uJczqZT/AgDtdy0yHBp7sqQh1vK3zOA17TKl8gMNi165h6A5f18vgqkRfATnoX4SGXsjMd9cMlGokebsbffNGfHp5+lR+IlOTzxpo4uZXahn+5LmG8KUMrOUGqkwhIRkCSxg9c6zlfa835gmJCNFPMQzBYe3TwmM6mQSjX1aL4Sb5Nyt7VFwOBTYhwpoOrxuDlQSGAa+bLBX00kQsC4LT4EjjuK+aHicgyW28BeXPc3IyyTw+OQHsgY9nNbXLRjmOhWc/uBDzp7obN8zMdRFKmVL6S8l1EDCinaDJVh/v023NLrQ2eeRdZHcivE468nXqQKJlP3V0lpbGAb8J2sAY+rzP+DbfAj5mykXbV/GZud+AbQdlwgS8W7Dc7LR+O+hpAFI0ValBX7EgVrnBofryCEPEjeP9biiDTjXM5KIbWa8pCYTlXEGR154cM6wHIFxS8/VH9yUAPKhjiQiCuTG0WGByr65YCVcxhnZE6qU8VgzJNl+mI0olrdcQ2E1YYAjCjJtKPP7KPIhkCWfLxWowpmAAleDE4Z4YLdoDi7sJVY0KcNsfBAfnNZXjja7SYGLU3Bk3jOlD08WdcXsku4sTYB5s1b5m3k+QISIsUS6KzRJKrM3Xio2X9ruv9AnKqPFte+f0XCVMs1Z/y2niOSnyKXORR1PqLhI+tO7elTPg1rYWMiBt6JFjYDAKC07LGiMD+k0qXHsFJs07/1iGMYYFE+M+NHIpgwJH3sUN1gJgU9Al4EazuKgSbuhI4UDVjXpLydSkbdYgrc8elpV0ZjCXae6LaotvQhCA5FZW7jpJm5DisWWZqaxRxve3PJ1z4BItXc+YMYSqtdlKski59SsMqiPN6xALF7K6mbpZmIiBTE+gEr/UKLYi8pLo+531Gl2fhO8yaiqqnjtzH8VHHXXe0wWX/emkHqRFtjG89b54808BEgFgt+nOMAncjlr+j7H9XSnir2wGNaI1RETiKvp08Q+4uVdaRlYlwuf4XuhY6G0AlJv/YNs+f8llvTSuSh2cZwyOQ3tGu0Zx9rSmc/UyQuu2Ow4XPb7zKCFz7qm90nwo6QmILLGQqAH3q5Sw8DsmzD+hIQAVNus3uBNyppNuIxZVPYjhN1PfUj4da1BHdAsX4ElJGm92A162iBy1Y2OiDb8kJEP++zr1Ex/3ExEFmPYNUxH/v3nB9aFNM5ar0CVd3qZRaYKbzjRSPEFC/LTXxUVmEAEcoJbTgcrByQAWN1cSe4pVr7T+y8NR54z9LRkqYd/fClieCfyIqcI0pFdyFPV9ivKoFFP8GLsrkhuFGijBLPBxJv0j+653IHo31xxhGxJ47ukg3aQPFiFBkBwTbvXDXmimavHsUTKwYg+eFn5AdC8mCwKPGJ8XVwLr5Wv8aazO16OgmBhhrkQQogK5slCB0olxa4/KEJ/4UB5FDk2AkSoCG0zFVraDmxEldsB6m0NEYDcCtblThaO8rmJgfh4lKgZl9vYTSAz0mdbQSVVNpZDJPto4VbXXMvTvA19JB9h6sWA0xxfWny+9r9X29dHWiEJNRcF8s+AXszgolHOZt4SiAeerXKx+kPepJnCrVLTG7B1odX41QnRz8VBrWnl5wC0YbWYh5YAmqsmGoFN1OX2uHxSIk1sMM+sUipceXu5IOG28ftsvO8nT/4BsG8TRp3ckVyjw8bxHjmwj3dTN2qMJMoTOsddTE5jFyXOoQGnP4DW6W7Ne9uLxn9FqIi+BULtS+4FRYvigxJWzihp08Wrh3WJl6SfXeS1sOoiiLyWu2AIUOuaaDtgqPgRSYss/J/npFDTng0UxEOjmjOm7eWR7TdcNoWecOvrpvjFssHlI27bxxyZSqX3ixdWbiCMnH7nCznnnrhUzWwu4lH85GGgXFShFYwKPnf7eaIHlwUDcXUYDxgpzB7QWK41bM/XjCAvmEaNxIcR7kIm3GsyuW22vJxuw8qEk4TwEe4sF8lDWBFf38eKuosI9bNx6Yj6O7EjqTYNF7kFkHTKDgTVPFX+VOvE6LsNfIVtRxpE35JoNuq/Sn8Da7sCbVfoF+CGhq8Q1dDBjtypXWzsiNNNPLYXbSULPAGW+mk6hgoj8GQnTdyQxnd23k7S2ses5fCutO7GaLkI3FwMDLN1wvVs6InEmiwSGFHLBWWaQ2bsREHfT08FaCm2KTpfGIXheerfilOvlqdpli7jUZvX3zJIl/Dyq+D2xPMZBw0o5FCPIf9iNHwsmjQ9r3u0RAWNUrC+4J2cpj5JlAJUh/0DLgrcC4F8lP39as3oLSfOo+Th7RjfIbsRd8yNtEUqEY9zlB228owfldcsHjB9HNJ5+SHgF420b6F1kDR/vMOEdeMjL0dxdrxjyx0X2/g+yYcUi2ny5sVFtA9nrOUrTaeFDKMsq0YjWuaKC9TqcVo3W6NNPbo8ajLjnQKfzLg+d2SCa49PrqD7fCtboilkT4hIRidsqbAYJbq07mU3/SSLbugBizdMIGkvPewISgsaSXORK6fA818oROll1ZKy1nNaXhGxn6SYoOwcD5YhPKet0aSDKWMocGC9/tnvkdmWvGozIZKzWlr2tF4r/gdWznDh02F0Pw7EwOonrg7xW2vmrDejQ4QoLr1FAVY4scuQcS8n5bwUuqRr8xjjiuZtNUnOJAAyNDG6zqTGJdzCgEablnqSzDQgu517w9x+NbAy8YjbSu/nTr60SWatxTmb9H2OzaBWXZ1+Q+wUra4nfPJNRSGfm29AD59EMhr1YRd8b4VpbB45I321Pvo3SWp6u5OsJF0FmsJeM4+E98x6lavCC+5wSskx9GSScvQu/zEasflUy4l+hb3XZXqxmF5s3krlWkLNtzjfCz3mIpfOMWgkPsu+xuy/SuYJdLCir7fg8RDfRSvSvsb9HQJgXlJYc5BOhxylD1FEJxNwKRjOgfuOxRkgljeRhI6qExl2Sz/wJ8SEoImZXWnGwp3Lmd3GFyN8wT3X/pNaR5dOydQHK7yxDceqstAPStSw+VhYy8ATT54Sxm9NaZnnrZgs1C/gWaFzhLiCTX2N9H/S1gMTWVfsFrUlHy1DKLUT3AklP32qFfmsEAOB/mSKYnwXSYGrZR6gLTzInKo7G8UY4m3A6MNOavl3oVJPfxLKFL6AEPPcaPrQ8pljQGHatgRXVWKcKW9kJ0YqZp366MuTzJP4kMWuJGhMCFish1GO5je/wEjQVLJRd8o+HHJLRj8F7vzz8yhGDXZTTf8Bkbhxg/lQLOEexQ/TPw9ll/WEH6e+Dh3jZR+8WyZd876ElBhaYH6Rau2kRb99Uj/NgBBSB3wTQBwD5YCDkQJM/YCkA2tcvymx2N/O4u917vVH4ncR7NdtTpiLcf3dRxR/VYIrzDbMOXUNI5sT9lziAWwmu5g5nZuPjwRRFpVgBflWoMuzIkHiwKoDcK4RBzAPq54tol2upeQ5leIdEuPmZBgzHBOmGjhMK2i6+kNfGFXnVaq7c5pdF4TkxP/FCTAKvTxjyoWleLCmzBHDVigpUbfPJ/siSOUtzfBZBd3rqsCUYNj5Fl4K4McmX7Sl0XQcJR0K+lT5wlssuRlcNLS2cr5lUTthCOa2Z64LU+6hBTeoJ+u3+235zbvP9GdP59c/ceZ+dl8+1JwVVsQdanc9PhmD42lTSF0IVMJ1+cOWoU/QjoFWxwv20JpFlySFp/ZaSHTs+8NSX2ptr1HCoCC4j7jzFC9iWS9hUcLHru9tJvD0Bwidqp0JLeus7qzEDhPoNmq3Od6ylYPo6Ys127f0lV+ihZbOaQ3VYCHaH3VVaFtQkDgQssVN/YvugMtyzpetXweoAU5kQy4cfcLhrDHHaATz533iuDTn741TjocoJPxmYxtiD+ur576BDgK4/3sfCWnLuQzvTtnA//ayXnpU7yweCFuiCCHydfN7DwDnSilz1s8Ovs6evMm8KKjcy1S5O8JeM+htAxZPBFv5gfxCcGpWgyAko0p4Q4BOEzDWWLhBgV/LNiTtlCbkhpUUIwCk1Ol4ZbopHi9ocn4WQavoE7PnSchRYYUohv6LxFvP/V95aPw9Uz8FlH/POmbuSUa9BVnrhW632DRqATqIUgQGRe7f+m5qITBXDjtAcMcNTy9VAulYTBqkVOE2yFkgtyeMsFA9PcXY9hgiEcWbI2NabMya27Ik1OzyYHK0s5xY8HvQ7IFCS6e1xCvFQ0PPoGGLBd7Rdw58ntugC/cCYj7Dm+130IjlFDQnPHLEMoEuUn5p1vj9w1lptBhW3vtgzVaAiztee3nfXdQYMfg8EUGCl8wWtegwYLA50JBl7wA3QoEk2nhZajapVVHjWReKsMMVEEwckff7dcqd79ojySjq62xOIjodDjoS8fIoqYxQEwjz8ECoa79wD363GkRJxTSQJqdf9aKp1OB7LKlfkPCjSm58pEIWuOoGbwQ7U974380seNeXBs1PEB2dxKtjaDlNo1Sa3CKW1kIJ3j6VkDOv07jflttuHN0NDk9EqZRqcAgGzmnjB2Qksu58p4fzM/wfgCjDRvMVavZqCPaH5yPK4ZVl9pbu1UxEjYd+zy07W7u0s0KgaW41tB5ov043x+dzBXcbT6LsjXBIvg88MUMr8sxuDF3AeTFZ7PFH8BCUZrRAHTV4L4Ckdxp4DjoPLVcvx18BhDjdESJksqEk/8efzr3P7bxtPd2beIYENJF1wE3Ju7hXzsBdRw/RcZNxf1lIXM9b4cC6hcTdJwtCHIM79NPUssTdEb7P8u2hs4mENNXB8FNbRrpmqYpoDgljo0l5MRNF5ilN6G5Xsb/KHZ8RdkxzJcIyMOjQxW3i+bco+pqetcBSD4YAtlmOHm57yHh5NqDuPd6AjRUcZS+oUfK7+OxyJktXVdcOBSB/fPhEvsd2aeBR+a51gMhDuYDJDlO016X9kYey26U13Rca3V3sqwHyvyfqmBOB3s8FMmNXePhJLpnOhoHdZgbtjeLAxIgp55gwQ8VIRE0a7Jv/j7RmwdL9km92IS4nC4/OIvZoIpeZW92GUg4qT++E5t75H5tCdjrrtq9pFrSimkVnuup1sI1wN51ngiv6gdilKph7wMkyjn+fSVLGqfTSCIj9iZLS2As9gXmjDIHRFIZKMsFrdEmwx8RwQuBYD5V0B5gGW0KrWcyMGa9fhvkdcrnLqSot3LN00ACG5huwQ7SHG0ZdefLrTHmmZCKXEfVi2+23FDQrTOTXfZo9GMDq4ejuGyQYgHrUFFxvbPeg2OEAo61aU7ChcxiptPwQp+4QgjJ1Cx+/pn94EPdMovRJEUVMx/7TdcRK+7H9rm9H5nd5HHIwQLnxmZTije3O/56KOCPwqFOCjweF+8OqlXFY/VijEB4kCnza0PvPfaDIaUGrnWu35pKR4g+c+CNOGkTod/iNdocqFan2HLjnIJ5NnqI42Peb/oZY1LEyNuiZtxE0ivCAxccJOiTzz+nBrGQM4cOhU+uy0dgjlEAjTPcOG2vWmX29QOQd8nPrtQn5o1mbkF7YFwN+XljZ7yP/+bO+q17wVud13+YUPrgKPyOsV/atpYzP+yj9zQ3iNwcPqQrsqzYvOwBetIrGEZYyo7m8Bos24KzZVamJTuNBi0t1DEDhRJKI+5XnARkUJEsTtL3AdGEjS5esqr93QxYP0Az7FWAFzp6yWgoSiUs78uboQAfjoC7C8SxrN7MIhxFzNZCCrFfqz6t4BZFcBCXyW7tyRuPN7KPFNHFxqyY52YicTb4PkTnjCY57Y1bgrOQMoYdoV4N5VQgZFI/MYeHJmsUWQwIbYod78e1KgYvmPcervrSaM6lBmpengUxHWIDodr9ccR/G2oA4KrNxPIOW7lxmma6iDJQoZr3fLsX9sexcloFi7N+G8OuhBA6g4h5ErMD3orE4FdoDelaPi5+VqHqP1zKuyxTD612QwT3y5tFoKM9WrCH3BIzpr+kwjzinc3hKZuukIVZ44kIUfJ5LS32Gys9KW+j2WUgRR/0gnEB6zAXN6r9cxet6diaoTPNCdztRGGxy815cu4AgPmOS+JsuugOeoY9J3DQxo9dTFfr4xDV5mliWAR09kTBfL8p1zX+abx8bJdtmMrV/AvO/BP30tFxiEdwoQ7O7eqQ3hVHXtFGguMZzwIEUxhqLsoMudnNVV++n13b/GLBVwOiLo0NNLXE3NTfAHarGsodnsRQemYmk3ZtWc1nbgOJJl2W3hDiO43k2StMgabeAifNqHO48HixWTWXOGgfLGw4XsyAlzQfBW83JY7N01Ra5yI6Pq2UWpMYPLWQ0Bg8K0Dle9vdPFrSFptl86uTY7uS+eaNHq6mnGjbAZWFx8BZu3s3qqWw9YmLuGUitIQD3HnMDKvyumQqiMa2G5hHe/Ez4e5XMfqLz8ELGypyk2RyoK3GjIZKyRN8ZsBP2Ljs9PL49mk3vLumwpzs0G0U2Hravq/N54tIDCrHNij8AFtnUPQCVN8U3KALEHrnsS1tQUM5nCqvNhOZCbWOn7qiGqkCFwEKFqOa+RFGzAWx5zTyxSJta21rE7DilH1mGmD9xsSs6F66NXRUIlXBILvzSPNeMu4ddLBMjo18rnksBQwXZaK7piP5F3fmMXgIGQaR5vfuhRSZ3Z70FCG5G1bDvQSXn3j4mMX8hqv+Cmnx0YNinnLK+WOl8oOGxb8UtZcrJ/wgW6p5+o+74AwOFB8a1rRpRovKbajMBcmdxBna99pRY6gW+LjCHjTufq4nyGI3tt3fUZrrsHISYGmvgYdlKrU4IhScdsLeopusZO4NLC2llsyP+vU0T5KmryhrVvmLJqrm9Drr26+2Do9NcWXuFxoeCogytiVeFV3WY4Z+yJncT5BSDea/E2doYQka3qWrVzIpj0uLHoF70aDzw5p3dq/+mPwgqAKRETTF4S56j5pAJdG9kzjsXA/jBWTpyovf45YSYQwgacKTncJmu2qu7HbV6rWUyGPD7DByqUUk8RSeqod4B1IHhJARyJvtgHh7Q86qECYpLhwDoWjje4CJBlX+oUCf5LJC4Nqvc+rrWoV4KKq8/mLMedQNkOBlUQB+6rCP5m6HcMnDopaYwrWmfFENPLxA4RXqLYE/QUPHeCvc5GZEmdbD9qOTjjwv/a3jp+y63B+uFBSh6VyBY0B2gse7xXWWloMPgwRE4Aj0GRcAu8f6jNF3K5Y4SyTAQEzUtomDrOnYtw1ZCf/oCe2/tz+jg4H4LGfSXGZh6ZxsErxUclwEABSh5FUBM4cpXZZfT+heg8YnxkHFR9omPV2XFSq6UyQMj0KDCcsWSB5IyMStTzg3vJI/Bb13/ymCQNT+Eja7Ew1E0aAf6UrIRWOPHgItGNyw2FGynfeodw0vQlFinmd8bmZAmo5I5eQLxaR1++S77pWtWVN+azDqG1yIT69j/0d3VBRZBh9BM3hvssVPw6FtLGLLVaOdcjbU0sPtz5qK5Xatn+3Ovogg/0sxh8Rs65sDU4zBknSTY/rdLZxC7wgiW0mUnskYhn7eQlP+gFCw47aper7pZ8fraxfNswWTLTwllP5pD7NpWZBls/GIRnbuj55nubKzydr64pwSf6mcy+E2UEbdtD0NZbQwQOphA3wnvLUV4beUtmKClyKbRLflmd04ihHnN+CMmLwtcYu2P2EXucg81obwQ1FItBz2DWEYmFunVd852ZaS2CYD3qi10zuYXNkXPtBpgysJta6cWwjcMOMabrlpUss2ZO6g5xZLBlgLy6qklZTUoini84TOo02rhjwZyBaBFGx7X8gBG5a+YPdLVXvLjV8m4n5uDm7Us6TbNR8Mz4EqByMvCYm6MDYhSmVDweBZYz5EXIMRVck4ZYtTZZ6EriQZ8bkZ5EcO7tWm8wkAqTj4IFEBBuk1+df+Sl1LNOxCVHIBxAaC9tTDzJui4xh3E53jvmbxso/iNWQnCsb+eGUAlKfZ9SUNvrfWsC+NVyjgcV1zjjYZoCzcfm06IEeGQtIkRXodpzW6oNalHGEP6C+zuJVPnA4LnAze9jqv9sx1hx0TuzG0fdwDREf0dncFaSgBA/GqSMe5Ph+YRNWab9RQ0NgmiB6eszagnNuuJ/mpfk72Fa8MTdDpR72rkR4oMRXrU5KEQwoT/pMIMpEcy0EAzb0CAxVwXO5CaitpHy0z+3ocNVqKRqer1UTsc6C8N2alpTXZdQ6RdrIKcKca2cEEg1eZ6jrbUyfXNpMaXsWsbMYdYg7+wCqyxDE8Y85Px9erLaI2mq+mgM9xY99i6EW74/qrxUoT32vq0h1FcS5F/b1K4bdZX0rAI9KXPlaHmXqUr3PSzZ9e6Qu4qFv4RQECO9sdlFKDARMSY4Z+3BTy1dFFBYe96XZ+Rex/QD4/5mZ+B1+2cXeB5cWMyL9whl18i+ksLjUf1zj79P6odAEyjYqYnzdK0h8kiu3py/VgEv/UulNhrSixNrNu1X7kV+aMbpoR0dE8umSUE2QacTriXjmtr0rxqk9ddNxr+BVTYoiU0HsE6lQOtZZPnZaaD4uCZgBh1g4fM7vK5PI8pgiTvJ8k9HwmPthuVl2bXj9le8SfrM4It1UkJpUWxf0Q+wXj1n2vY/DTf1oktEUT7xCPxBuN/uNvBfWmvJTT8GeFjo2sgfoDuxPpQoAkMaiSPE/ZNOJgolA8ojtUpUIERbxzeTNkIIS1+FTB4fHETlhYnIW5loqTEa//gJPhV3Zsm0rcjTkCJ10vwj97uQKVB7noy5oc6Vchm4Hr44NE4aoI1qZVLjg6J7GrhbWmkbbR/HJ3GSToolvw19gDfjt1u1GmfHzGfP1h1/IcZc5oKEwmqX2doT17G2EYCgl5cgZLTD1BKr3ZRt8KBXmbYID01bq9D9et93hRXqYu08kzTDPHDLp7Qn3Dwt+MAtpPH/ZxxF6WOsnoVnXHldM42hOs1F0FnQ8q4X3JSrG8wAkHMxXaxbU0LVdAmc5fyuvGTDB5H8iuSDlwadzeg6SFf1O/76g3+4h7gsTmQUJxA5LSAR8AVSXkxRDaRPJerh2pigaZQydOMwFYpJRz+jq6fjOiYJAs3VE4jSKWCzqFDVUTtgaCVNc+oPwT2ASg5qoLykf0voJsACvuvHYI5n2X/kjZY1g1sddvnOnlA4X7ZVNlTQ27vxeH+xAJasYJ9LY3HA2BQJoOsszWundtAUuoEpaTQYMMtiE7J31zPWk7vihg09IGexp7MegLyPZf6taIIOvaYmWAWbZpkUIldjN/nIQr3cihZ5K2HTB3KYQxxCnrMaHh5rKKkFH7E4R5f/7Ts/qPd2oiltPSFs4lu14B7Nxg+erYRmEm/OlCTsMw7nUaNM1hlWyhry306hNq3cgiwo9n2SvZ2osF3w94Hovyz4BMHHdzqhH2PTKPM/f+3c457m/qDKAsj/pjKX56UMvGd82G0pK/5sKR0p95q6ymLvvJdajNfXcF9n2tjO5gK/pj4Z6ZG52fuRi3x9cbCrtL3fCiqiPN4lnlglE8fKoYZyPdHRXLtpAooFKsg4liAJaTSOEWvGdbsuDWaak2XYvyHR6rCfrvjKxgX17jQ0jOvj5LpQEvLTLCevCMh2fQNZD1yBuPWr4MgzMPjScxFRVkRqNucqC2PRWCF67IBPplKMYDSWKrczxituD6upRXPA4fxiZOuGS5ycjiovg8/LwnTkdQU+DgVHUsz4nPBZL/Anqbq+sJwEiGH+X2YAisAPEJXUPyBxnla2e5eY0pxL7GHrOzLaag3XW85YJUAhqsMkYBHeci9sNsFxrC1spH7Qq0oAd6gegkGhjK5S9x/1iiESfVx44agw8sRccnJHlAxqRsXHBb0KJr/SBTqvxPlGTjveFctYVT57iOsnvpC33s8d+sjW4JpdffYWP4ZYAFaC5wWQ0eeDBJyuapm57ygEnMhRDNBEsczvf75wuYZyjiodMKRTcN1N2TwwaHMrZiHBFqDqXkD/Eb0lPPXr1415g4fuCDSezs8ZC1fnkh2gLdCP9mqAggxf0iVizgp9FRw0gE56vb7RMYC2KoAzboeB2B5rIyIBrkxj6wOtOKyWkg6pO1RxaZokMHDuHJzc6dgHd5fDR8ObbMaPlKDLPnrSqytzFn6bxyJbEGeXtLIsoulxOnnGabvf1Qe8/hTDQfCkczINy+JPYdUGC97jIhC1DIxK0OoUVgBPXTL2t6BLbaSseaz9WW8xmrPwUD7Bc4l6qjeR6obrKy9EQCQbjvCg40AXWTc7l4h5OA6tx5HLNtzFE4FEPshm+LqyxNuuEaLEwMM/QGGgQfFKZ3lrMF+07L5gvcnkfEH9KEkYyMhsdqEasLFTYxG8PcKrbo5Z/vD/iNtlRts8elN8hIiqtV4NWRdIVcEWD64qJPD7Z4x3buIx6dm5ryZDGN1+guk1PkhMOj27lAu1w7lCWsZbxl19T/YcPz3ly9Wn4AVtf9XhtO/nf5RoLAC3tkUz5Ge2ZpRhkkTEDhdEguka80W20A1wD3zwzptRzD6HqYgF8keOBvOCNPk083beOlx/DLZsN09TGUXrN+t2FXFYQqHUNiAxX0u2+U0qXVfOjtE/iT1kFdUIEjzrelGhfIYG4Uhj8tJ+TIangfWNOnbgQEBMkeu4olJMTWx+JZJGLfMW4uzjfSWGHryQoBVYnE2N5N2EO92U/73E3qmxUpGXEkmhdk7qJ+9Bbbk/WwNfdHmr/yVRx+pMVfq3Wxlfb9fNChjm9ZkdzzHJ8MOInexnqo8j3jfhJ1+GR5wAJyR2E1yLxjwkvjq/CzgHy8hKpE7z3mguDz176JCt1PgPJ/bWGyF0NHs7LtDwGaBSSphq0ro97CCTQKBTJoeSQQI4NOhBGz+gCGa+HvjQphG/mad6VptrGzy1odo9WFcE3MH49MhTjj1lyL9ZD9kdnJImLLqSPmxdVd0G159eGl+rScwWn0iQzeKsdajUXVk3/QMhWTIg/fvKbPTba1VpNLvShyjYLD//XYIr4/wFUXKphRJ8QUbLQoTsx++o6oA1YaRhndzyZVTUmSiGZaDUhfO456R8y6P0PN1bfWKvdHRRQo+a8WVWBaSUqrASgnFDK0mdj5BuDSF4PprUXZGcgc6lhi+6BVI++J2+5Z2wMSIe0RyfdLnXYoXQMDhmPAVDtqatVxu+rhm7kW5hCb+F5ASBc/BvMqPakBFcdQfW7lKp8XxXof/vQwLtbSj/qnvSDWQUnFf/gU8w0J33SZps/1i0DHUUDY3h7q0Z/rCMCcEoSObXNCJ3JBdZC0vJeIL2lRSi6w5z9BJZT4tvI+4+3cUnhEl6DAmysZ9fx3bATcgYzsRpRQIj9E33cN2pRarmFvAmyGrg3yAvIqFnL+xqVO/CSOVetppLExDxMnEMWrzCG9eUriFC4B1EThCy5ezXnR7ukXLWR9w5MiBzknllugGNtVnTdUtcKrwCIyWx/kdYNQ4UtoUUyjj0KjhWoN4QuSNXaaksFBXmSzqJnY5f4ioQHniQfy0Mwi+XzkzbBofPv8I5Px9fuj6L6F1bdFu5F3Q0fcgSQA8ebNs8T5lDO+WbllaXZp4vSjf7zs7et5T0sE1rixuKLYWYqLOF9K7Lfr3vQOdMLlaM5KgCetXof0ecTz9/gOJJQdAUGX9/EJc4qKnA+vJOwMUg1mU7jLYY+fxH1rmc6Do4Qz9b0BaIW6msIQDHCjv1+OSqLo9VTZqF9NqRpJJjzbrC/c+zDr4UkhGh5FMmq/DNiTAu0P/mPvJKnTKs5TDZ3YgiBWYFz8BK7fB7an9UdAPuUJdM7bvVwz4KOi67Dngn1ccsuPC185tvFJZeE22rZrT7b5dCNYjkQl5YpUbeMCeIpzETJyeswBJjdAG/+13DoGmzwhqPNTCX2I1Z2sYsDpajjCrdWv6AsFmv+osDUxhSrwjbWLItylHsTDOskLMlVFL1TqIVdzcXSt0FVcDb6uc2znSnfvyXs8aIZZpbUoXbCSqae03FpJtt+1UA7lPThNManHfaFXhLpbkUyQRVNx+cbXZElYCdurYQuTRWRa9G2txrQ4BqJwmGFCxOs/jwQeeTFqKKaouSahzZARaq6c9KKbMi3zQit89ft1A/usQgphrvqTSH9GkeDeOWz79rYBgU9XxpEAPAxZ3HUnS3UWX1g4D3oIdI9ScDDKYjJpkQVYgKzaH7cGbM8DGiXx+jih5UYmNs852WalLDFdMYz41kU7lsRoP/qhqBm6+Rd+LIVpv56rmimr+ovUY2NLWCpY0jmbA0qBkgJBrSvI/XXWsGc+FyZHgL/yTPJMyWezPn8obXqd/F82H4GXbvycOzMlBNn/OfA7v6QNwtyN/tOETy9rJqkJIYVGjt6MfqknH/8H5ZKDvaApS2FzHY30gjEVMQjAwR7fpbx1LaX2OlLQGnGJoA4Mekmykq8ALkDBLRGkBqZLTW9oXJ9dWxVupBxd20k+ly95RwUzU45iWk2IpuZ+KzNG1/IaCnzmawXVJl10trG10qZse/wEbk90gkCzGwvlvAdpyPA/09fILB+kA/69u7jb8p1MNwXSZJsGuO56KDxW4XowyIgqVH3c/KlXzJ/OFyw+Nclq+6qvrv7GXeJhVpirmWqHfL3zId6v/LZWx8iAmn1M9O3G96numXPh2jGRAk+XTnjvPjnOx/WRg4CpABakj0xzvMy170xwvB0dJVYYF5PSSm8qmBk/otami55tFSZygb9/vYtNjNm+mmN+GXYW0UdvLncfK2XNQy7boXeRwLNZUVqsaRlQG198yKwKGVqmm6HSql/tr9LqZRUoKOO9aB0C7pmupz+c/PCSOe8Ki+HeRz8JUbs2Or8oVPpLyhNfOimG4cHi1bXW8zdOBukUNsaMCk3KFx6Rb8vh2GH8yW/Npgvh24OMTImQKd5v+bfW4Fssj7RA9W0O24xR6IY9O5BTKOMMFg1mQxKO9EPH3q32PIFoSBfBcF7UXVQBTtrS3xPMJMxvxn8l6tB4XsI9P1PkIRFS3v7F4PX5aXlVtf8ntoOcaDf2CKIlnhD8BuKbqVp2ed8/2slbv+1XgqCTHKOBsto6zJzxwCmOKHZRrLVXxzN6697kOqgfDejZaY0sfISvC20zAI828mUPVGtt0B7x7AN6SuYUV2tQBqRXQQ0pCRJiZzuQZhwTYRXvAEXR4XLKBhRIiTwM+HeQpUqH6TL2wlIUidt2ha5iTaeWq19ZN3SDrPuiDY+jruYH8+cN0qL5kYU0ypzTp073Q2CyJJHckqNDArM6g6NFWGg4eDm4RKepgV8irXk4+7NBaQjl9Aab7qqzQhRo53VbWGaEJekE4+X4hszCKUySPGxEYi9iUPF9nxNKn//QZS7dNtjrGIGFiY0s+0h/E6Ipp4zu8QuiYewfJVt2SAG4k92V1Css8oQTeXBhoVbTNVGX4k+RPZRBTIKGO/qkcv3a//AE2Un8n5bS5DKPjYm1m0rmdy8VcYm8dfB9sYqXYXdiPa65fJMeEbKECI3xisbwX8ED2kFbH3uv576XVAXMerHDFsy22UThdZwFjbhtCwUKLw4lfvaMgKO8253Sp+5qupPko7asTVt7sNQBtoU9xUYbKl3oo7rGARLqOXUUwH26H/BoG5hzKUBd/1VcjLaEgoJ+vdqOBJ/k2wA5olvu76XXRIlie3xjavfSkpHBBPovVvuqZf4KYaBivAMH2+aqwgVokhTwPSyFPvIJP+VGIbTatMDsxFgWDQal1uNzV0i6UT0Z6fJVKWdTJQTZL/C5uU+DW9woUiGY229HHxYJzK083IzIhIPAR+3xjQJgw7CWgWmA1ItU9GlHmyKfcg8YKYIRtNvZwsUogdILA70tZZTMx4XM506Z0WvnQsHvuZi5XsZ7VimszmAbAaxylSUJ7ojKJyA6n6K22sVtT1iIOYIPYErIDdvCLsl477QEwjq1UjzADoOPK9zpa9W0ri3gbFSWDt6/ng/eALiwryMYUZ4pzF6tD/63cv5iiMFib5pyZquNZ+ZyIt9/Zc/iJrLfCL19zgKQtP8wOdPtbPhcXpdlKdJYVdaC67WyePgIwXZtiir4s4EbX1WNkHnEneU/Tw/1P5GRRIEubxY5xBQbe1ipzGQGRzTCi3ZyD2Cm5kuUG8InA5BXlH35X0Af3PkCFIsHysqPYzCSzO1bdSIsPDotiWKY8qNbGDoiYDfec5D2njbTpu+xDaL26qcJ3jM/f05bV0i2xFA4ed8vcaKzmg1Gcb//oYWN038WFfJPe/5REH81MzXJQJbPZ6rr8FeMBRX3ZXbnj5Nd1BwxL6R6E6RPEMbr1RRCi7RmUdkptIlNgtRayoTDLur5c0pxBIKh33D3EeBYI9Kcy3PPIIxKvJUsYGMQZh3m//PlnRXMJ3pcMDXzKpjlgN/rKvwnkSAdalqCI1/ygbylV1KQ9xRKXlC6N2DkFpDYuRZUCZQdsaiixvg/87PBP3vUrk3Td9q74pnDmOmC1VAzt5P57wsl4TbRjtk92aZPcFKw2bbfpRkqDuU6fWQqBxF+BS/g1eDHDH5lGo+OzE1ZJK6LswjoakoSF5MVTURCtCH6yxhUb2Ns5b3NTWqCbpZNOvuDotXrZnNmcuy8ulOg04ju8vuDWa2R6dN43B1SKQTox5pIZxwyUNvNTFXnQ2/IzfBLCVebNTKTpiAU5+SkqbnWNTm7VpUJB737ENPtwKOAMj/mZptbbRVe19SH6ASgTSvXtp07M8Ds1120y9gbaE92Wyn0qdSkXD5oasZwp+rlwb4577mAzNSyvAH7nrCZi9iWgNGTwdioonXD4VSSKhRCN0KcvffgOeHucw2I0in/M1cZIVm+gXYbOtBWwazojzd0YPVP3KGk4Cv22p76wgoG0wGg3XEXuhJx9QlAcAbnAaSdgpKIayXX6aYSjeYcdFN97Ax2/7uBZOEnWjmW2IAxGEjLiNj+e3Brt1fmaWvkIbcf7gqFFMUbNM8js6wiwuovFD75JKppT57UG2ljRb8CyVfcvCDKqlgUSOUvLpgN+/rzYZLCffgqugxZ3k0hU8ES+mreGvYSp5bAmQa6VgLhfIIHbAdvWK6BiYGiZ4NZ8dXT5HRG2BCjHV+GZ5la95TH5xVDQDGOsjALk55umveqsLmMAAJ5gyglMx4FXiiSEua/WCluNaGVSxC4QOMvAZywQ8yRawFUMIGmz0G6IMcE0xiHmYaOvcjsrDLb1AQ6gq8nHLFEPpWh5oeLAdvixlpgvWJGdIDJBX/qTZktmeO6Paea+IIh69aMeE8O+69M5pDFk/UlYh85++9HByZS5P/WN3jT+358Qdho9Fw5j8xXx0V+yTthkR3MxDNfNF03b1wPpO0RC5v8m1IOKTprOtaTg7twWWbcG+xjawgYWrJg9sOhTnVZONQoMaFzNJ2PUilx4OHZYRontpwu4bnGs18bevBlmlxj0qnx2rRfBmmCVcpc3HJfXXafUS6W+e4WWxt37d/7YTjjqhA/w792D6/nOJjuhBAj9oH2RQTUY7htctCbaR3o0yt7MJxrmC6SpvLsKTvtpHeswjG1+WHcPlp7AyETc5RoQzRGQEcbEOqOZV1SBL0oButdCbn6ZUoMYq2t068ghncCaCBNhL9sWwqSB0sIhoBqDq/dJWzE4oXriHT27XE4Z04cbDDMMeHtDhmdhJbBFkkXqG60XobbYMsDt1dssbQHjr6AmOZt4KBRoNfKcOPAuLYvEd6H0xdWK/pXHfazblTVSe+3V483Cbbzx5WyNp4OT/sC4Gubz3nkAlmr55dYqK6ah2iIfh3QdubugcLVV9BR5KWCzwei9t/emfVpcbyLfWIFJDoL324vX+BkXXZB6CqRde3c4umjV76TrqrLVHelbmLW55lTFw6jOe2IcKA8BAKKHIgcUcUqgVqMjNjfq9+weV9WCssEuDSb8MR8apsXm16z7XAiQPG2SgNXQtQgYptRp93rzIaxOhL2CI/kKL7OyDavrBOkifhMgGBprKNa/8zGSk+ptB+0UICfSxaMkZSJjeSSGenvGMpnCgT2L5rDwRaIE+rwLvBhUOJh9FfRyOW8e+MvpJ2/0odu6I8Dq0vIfzTuDhpV99bFyC63yPTVUbYgMQl814eDRON10NiLGAydZa3sG/p85lgIjr0+8dLrKorC99sv8aZQZkX+Zycv0l1EvY25Ko6xvcaaLl9Ma4lBvK2NftyX/n6RZsM/0tp4Si/3nCbnQ0cxdd6Nao7EUnxwALPqdoYiETMTtAf4+jiRMMj+5/a7FVAcsd4+Y4sE7a3hk3Mu3VIvIxEOTC52jM5GWWkdewiHRhxNe4HddfMPEzRqDIPG2kpft0QkidzPAxls2Ld1ymNYeIbOkAUXNMzC6/aoVbMSUHUDNjG9FhNYX7hfgmnYAipRcEQjH+0aAQJivAqsMm4/7ai4vSDiP8zvtIYDHkibhrJ7STtf/yxi4KlzozlRg96yGk9acR1EHnE7/AAiTLW3BzqPVaeqlT5TTS70+207N/YAqKWwwpp2BnqqhzwzuZZiwz+Pzk8jYSJsWFz6hIEgLZTcYbpHfxzKLOhwbFWNQPGYN8HyV2VgflwzaMsthc0SVsExOebAmDqXnYI0VGZv/zt+oJKSmQeN2ZTH3H4V8hive2J61fClPTojArpYNSe6y39i1hf9596qbd5rxcTKGhD4Unrd4k72in1rgUL/0tQvpnrGLTYx3VwRrNlX7gWZ0Yp705jkGH1oDki54CbrsJiV0q8bVmLeNmkmoX0dVTPNqmq7o9nENYU3XlvRJslm0pv+sWmwewvA3QjZkfBZ0q2BJrE6D+1ALXU8q+nDkoSrwVQ6pdyZh2avdPnFm25Dp2yr4KZQERmiO5drON01k/D5tkci1erwdtWt2AmqJyOZem8unPvaE5zPTK4tlnwsG+XvgiFaEs6SDfWjUUZm62skC/K3jpf2fVQ5VfIgkA+16xwf+6j5OFw/lCp3piRaieWBacGSw6XGzwN0J5LLgti6SMmalI+9CGJ9pgIdaWX05HfKmmOaG6YiznGMUv9v4EXPanJ2Op7wVRZf7mQGcdmFrMfOP1Spo6rYOw3N70zgAO4O5Y+s7uHdJnkUi5GWHI7w0EsBgOiHdWYk/Gyqcks8uWufwbiqzyBg3Irzc8x9W+G9yasnlJMhjl6zuzXN/LYCw0sGJPigNOTW1eP8yaLM5A7aPf5ueTbYGsRUoK7dLKOeyGh/ZJsU+xj1RhiSsgfNd7Icenx5Zn2aJ4UL/yAy1RlHyG6sdOcYkBScHwaffSj0AjgJzTB6DT/jc17ixOoONlfcZNX9gfmMflSLvCNAwBzwlmRli20GJePSFtPgd6JgRwxugCxnvUbiDs2+Bigk3Ib/fDpIIu0e3v5nPmKd9altsN9AjvyotzRj5GQDtU89wvP/NBWkox+C9/4xORovk9qfKQLJcg0cOGkCWPEgn9N+f/HZe/9GyECl2gOEilmqO+abQbd72cGiEQY+ijNAxRps2J1a04/hj/+4dLmCyB0WFb/bJgo1becCEOH61i55nWytlkSTdLnaHRsKlYTDF/Yb2xewj+g9FrlMXaKg5j/pNcfvrAf+aq6nrLavPXNpo/C6lRy+Vt9bUdthfAG65Nfe0rMwOZnwruGUK/siQ0h8rLAEnRAT/dMS7XAi70japCDemn0XOb2OHbAo5qARyQxh0oyEynxhin+dQpuaeNcldFeJviMYj68OK6KUtF4UQFL3DpWWCMkgizZGJ7FWa9Q70Nv4tWjGXQCJylM6YwrMxG8QDoF/QC9BSGUe7JLJG4ewmKZIy48MUUfeyr3scdzPYlmxdq9uLk4Su8QEfMWiYWTIw6N0B5mmLCYgQDBNsS1kCXAPoTMj5QW1wouVkZQ6YB7zMS+JH2LWDzU5NVqKz0ulFgDHQ0IMpyxZI7fa5zpW/z2CTbo5iN3RC/rYZ5S0L47D9RKQTPX7zbr26KeaeqJoaVjoafIayEUOiEdLDPSkkK268An3nQQ/rkboSa/FqKznGLNgvQiLjOyILCNrWNHKXXYhqSoiaOHZuRJnPWP+avvEhMbnQ5Yig+ZMQ+0maHVjScTavy/wUIrHXQHpCwmrv/AwASaJ/9zKgG/48ZEjmK2klzqKfakn+ZmYPNENOuUgYXIm0F37PTEGoSfppEZ+eQGIiidjwnvisWh2ZOWQLsHZdmZ1Agt9sk9LLAGXZAejBQd3cVA1Uo6rA+fDVLN5LJnNzJen/gkAIrxWIlwyUYGiLt6We8smZj5eya7BVAmcd56Y1bQniFsMwK6iRJNKJHmi4S+qAVpNkQrwmLKW0KPm8/rLw3KrCFIgFVTSIV3vENl42dS64A7nOdD3iJ6LpXmpFn3JkmwW7Oi6p1coMkK4iIXoK9iZrLmwz6sen0bcYXSPZBwQbrUs0pw7BqeTK3aLXLyNwaF8NzdNxu2nOTzMpJwTJx5JeLXmEJ+hJ9bW/FRelT7YgFm0pu2k7JU10irMrYMkJehfCLvRQttAanMdEskp0bhX61PW/cRrcd02UR/WbXu4dy3yhSUUewU8Rs4GmikxUtqlPpWk4s1VavmRfUU5vE+dgoJhAK8NIELbVNAAbx9+MkN+dPazR5l2iYlNi0cSPEcI0SbH4SVWAj7GzkC18EBmxOKP/Y8QUFurdVsMJjOSR8u42XyOSe5S5NLOeIK23t8IF/oEny+nZxLAKLymqO1DDIDVSwXHEf71J2LkazxqTjVPDnbyVq4z9NI60GIU3UzJfB3VxdsRoehwhf79rLqWO17rjxMGYS0jTdFWp861ucINTB25wHO1IiedRtj/4exVtmEudSL3v/8/CtCOIQiGOndwiXEi2o7a+qJyhyMemDFVXTR9FFT9ODRYy4Bv3F3CMCKRxGuNeDezTclWfESnIp3Rb66jCKdh9ZxcF0o+Ufo+1jKpyczfpL2PsQuSK1GV95qLjAMKylTTIfDif+UkmwwT6/Y+cfJanQTLzSn2qRW10skcyEKvfFaRTxTFLLlvla3/1AAmIpvbUNBucp5Nqm4VvNjlH/yWjqjw8hdHkniC19L0z9OM93SAf4pKII/HorkCaj12K0MNVfTJW6viHZJpk3yv+hqQag3B0K1OdwMzEFE7G/YtE9pk9g/x+droaZRSkSel5KIzwwXyO/Sxpfyss10fTpkPhQzlqjSWK7QBYHIuCtzC3uQ8wkodGlEpW7g9f6PzjWlSlSqTszqoQmXNLJv5Gmr1yMHTvReFFrEMPm6G+gAlUpAE6ueKKRV7AYHAuKyMEw+VOxSbk2xSBjT87ixBEqo9YoCnkhvUpEqP0UP4N8TVbV6ykGKk7V5iiUzqCbBpgbGb6rXkT2plSAZZCwbLYKrSY5YakXhGn3ZMQSKK6xFTcVfPPmdDaAong3xRTXERDKHkETxXy27vadDqQw9rpBAHaPtPLUU1YEkZ1r/gfy0r33ontoJM1ROKHLgkbQV6UELW0ZgBkdoJGHOvVKvN4IbmCDwHTsfhEXczZIrqjIHnTpFnRydF7Jorf2K5wYUfouyTFesg0P//EX8iYV5GvIRpnuneMcmEqhbaIhhezs7JtiDIiMUunAoBIFNcspCgFF9hzw51IpHwbclO0uu6Vh2eyiWCmKvznfOA+qA9ry0tokBSu+PkNuHhZcGfqrzWPU66raOQzq5oJYe1n2ybTwHlyYr899e9qtjAGMv1Pz3RVewGUM9n+gdZZ4azPTTxnuEzxupEV9nMcxTF5utk4OgT7Bii3uWNnFwF9Z0hFjgyRqv4+UXgS7DFDcCnIFVQoOtCx+ttCMpzjz5BcezFmen3dLAIO89txHg1XH/7ILNWXzP7vE8VnLOg/rw12Wu4Kj0+H/v4WG4oDTez65rkUJcidS5WWumfYIzDO3J6yH1BReps7oeBP/mZKkfaYArWa5SsYyhN1a2Vd2opQii1iY6r0TSOJVwGAYD693rt4ptBCl30XWLuTEbyikJO3OrZVdJd+48SCZjPgnxhFBU5Zb4ezJ7EDMqMJc2O1sz1PjKSF+prD/xO3Ar4X5YkYpyQVqhEXQMXSYYYWqp6NOjDYK6TL+dZMpnB8F0FrsqIfPjrhB90QMKWQ635nKDHOK3BqOcnHxBwfxxKYMDATV65ZoD6sUH3T0SRSTeniQgo3vsJs/Tdi0+/HuXU4UeUdSH7QYuN/2qa4NhWc/mgn3XSWCeorpV+uIJVOlRrCBoecrfd0GcbHf3JJv7hlYQTPIj4U/9zhX9/5ZFNGoGUT3G27IUTg9p3KBwff+HD0eDovmlV9EBvjPPLKRyl34hPwm/WU11fZySmT3WYdOcw+2llI1zK6dQjQ/DP1a6aRQu1BMh1ViLZaOniAzh9BvDLQQSgJEhTNg3uqsXzclc8p1f/4ce4YJ80FR37k4gFCiPVe3zof3oGWsU9xzW321sUtIn/iI6Vs3z6JGgTwJTRkZBZMB8ZPcDCAijw6h6/ESC1S8mvwACqGDbq28qaHCUcNMoFcc9GDDnn/SXqO9hb6QE0me45oOLkG0X3e+o466sGAphNeWTUfFVmoM5M669fspRTWKgo+PqdOPuMlXLtyB0sd4WjsbfplzVElN68EXHChzTMomTSAwDb3EzcqIFOR3OP4Xlo9uye/85NStrwTGAM+7EVJbOqlYXcHtaLotmzxiGZbK5kwRZ/A6FGo5xNelVzqN6OC6eAkRxRmhGAjKfy6GDP4d9FabapRhCfyQkZjWzuYwUYN7qnIH5GYxyX9T8ag/9q03WbVFsDImUS3cugd8qCECKmf6nPNoVyXiJlcNwohFMoaBx2zfH+ro3ii4vUwz5V9gsKnFJRBteydLce6RxoOHapNLCbrqojzcq1jViZy+8I3ZkCKZXuXWr8yhOohWGasjEXUZpCNFL2dTxCBVlHSXlpzDntnp0+7ovknLJtW89aZ2wzNmiB36OpYw2313SuFTiPruy9DEKYneZfYTUH8s6t+wwFxPWyPr9JFT9gUbZcXOhoBhQctBPP0X2rHBFMSj1EyaTFKbaujGyIbWXGbwWtBNwyqTPFTp1b3u+R+XKYthQ2A+aJHmXQiVn++dkZFuqg07ulMy2/YCWKFHOJyXbo+elVQwBlMyO+bjzegQGLjaLG8RxzOgAclWYibf15yJLVk/gjJSODYSp+9Tij11rFVQojuXlhZcZcH1N6nLEQ1WaFD2QT1A6Js+Nl/YICRYIsiGvNX/axyVu+WRjcpNTlwDm+V+PBTtt1ukUtH8xXynQlTTaHrXiXdvS6Ysc/IwhqeddE8EjEUw3fRsGu71Te6rey+zk6mMBWzXlJGbNHcIwreKskZAvE3NKE9koxeCcp75/Q0W7mX32Y/8tt+NVDkwarVELLcM4vT59vIlDC1OZYKxageBcKoM30oPdyUV0wuyNAUiyDUzEzL0qe9vgIA5VHLzP721qcCUjtwZWyjSoNdiaCTP29g5KCcG/DmYZ9Naq+N7oDl1hrwKkp4vTyYE5K5JByWgw64QFf2CBdGELaG2v5PhpA5FeBUvRwkGRbQ2WrHBaAlM55nwfeHGJesI1wW1Ptdg26x58sLnQY/mlqsfys3wVNPBWnF1MWKhBjRRTUrsn7kJ6olWUrAbHXXPQBy5WV8oVMI+s84c1m5QKRTwCJzmiCdCoQ2YO/uXldStCKDTaL9KL75IfB9eRqtOPVqCy4VRmWOAC6FJSp57FbANB+QRkZmvyyNnym+jIKDZ0I9x9Oe8evjWOc/Q6Wq04djqxGrrn99f/Eq7izHBC5whc/SP1OaL4V5K67tuQkstGANvRuERU9eaxHsVArLDS6bgYkDBWKCIXKRcYApE2ru7dC4LYIaAM8kQVs3hOiC43iNWfjP7zCv2Z1EKjyvi1QYN5p4NwPiXXymM+j7WI/tnGxU+fYgbBX3qZoxv12FQZvQWGMEyHeRIK6u1bOzll7klk12oJ4lV4QtBU9OAyxLATDfCL4x/4OimXrvI6fS9MDn72la6SuLAdYql2D9DHyeD50ECITIvgZFKzn9aP9GFegKoAH8/E9WsXu8jsU9GPb9iRa0TV4RC3qFPr9nJY+fJv4aQT5OfA32xSgvDCvYFmNJE+FmbGelPLw5UW6bw+t/mJ5utKd121Y/ey4sxF3USScx9DhW+4y+VBgK0ZmIO1sRzA5U4ILfMxRTug6uGn7jkVom8tk4hW9TrUFyhUi9FH+hKUGUDn8A+mZ1qzSrDqT25q9SbWGKfsDJTuCEaU9bqIXWqpxTreNOTH91646mej/k2BGUAzeFV18YJNCKeGJ4B+lWhuk6EBlIO2s1SBJVCqVTXlh3HS+zIpmlKfVjHJGqQ/KTDymOEIqfvVKBZf8Zl4sEkh1sboyKng63cncRXbMYvp/KX9WS8JHVmgsMgG1/CArHZcME8bhQc7LYBxDDyeI1ELEDdNK6dt6SVJP7Es/3+dsezC3NjeVM4DLyqc/NhnKGCtTZMSaI/FvLKw65u2cftolLbbBNR0RG7IA81mHvO/LP0sbiYLdcGVGbHh9zRHR5OTKyzONOEgZASAYo/fZzZdYH+bRLgR8BjQmg8IujB1rVqsE34D9HXClafeYdoJOu4HnTcZEMFLhWPeEYkvasHhE/4hdFfh7t6xGqVcBPcsjehuCl/C77TX6q46JIw5rKoNzGypNqDbf8ZjBnyujCQk6AIXACraQQ/bbGQfDHABk4CZtbY2IqrHAsT1mbooNrjGZ27bXBoUoQRmRLLqyOX6zBrGZCaBy6Azs5T+UosBbmgxYH602kDUFEWWhFXl5ZVEBR4k84X9KcbObQlj/y3z0VXDfBZlS6HYQCMsX3F8CfpH8Nc8Clwy3YW3u5vn6VePa+6m65GygpAHfHlRwfmInhUbbuSwYnHkN97RQLLVpMfVTq+0BbWWiM8vDVTdXiRn1CaDxnnijvK/ZhZFEF27wKZ5e2zpCnZpxy80wgcyGXPaGtPDhpaTQ023KzssHMAouV9JWR24+ktC36INHL6CTycqnSfboHHMjq2kcluQPRccp9MF2WLLPK+K/xXRulVn18Fp8sDnBbPiPwH77tsq5O6yIzklePhA/EIiajuDm7LPQRMSbf8lOVixXuBkHXGK1HgRRloQHEJMHgrtPy5RyjIRaflQAd6Aw0xnHeieaFfTON+3vF0MAiHy0xpRUwjYfr6QX2qRgAapRob7tyrplwB0pK4caWp2gO3/SIZ8Drbz1/rHTWKU61+LnLRhH0dknKK/d8DIQtJouA1Hl/XOSUiIVx4WL95VD0pnzKq0Bm+V4xk/N1lYagXqNozNsuNSFgEL6xbQ59ftizb4rJFqeopqAQMCnoKj9I4xLaowcOh0dlMR16iQu7iUelo/U8Ebx0BrdGw0kuma6kUIwWxMv6jzTe6qHplva1yBwcYg/ZFU7mJJR5MTjxVr7gExyqFl15Mo+9s4cceM43zzM6C6J4oelFJ0yS+DzOOrgl3F2MT+iEoyNGZOtfHPqFwTHaDTR7OKkJXkwcEW4LqzwIYSIbUzZJm44sQenXpj/wpgggmAF9w8/xh5irD8N4r2MoKYtHcMrcOpdsYlo+eALlciFOG0IMzyzsb9K2l3Qa6Urwy5wnMv6+SeywiwSxzKUW14SvL3h3scu/ERp0vDuowjMTFZQYWnwKUBlmw9VQ8mIR/QMnM0nGCRkAjfUFgSP3FhKXIFbV1RibX7cw+xpi5Tudzg/74A1BXxYfH0zms2E3NQ0Zjz5s/XY6iDHB3OG8KLZ3e8B8J+SlPmmZ1Bi7mTdw9ZkfZK7cB3AAwtXSFWcfw+LPdZmgzH4PRLsQpXx6ZWEaJebsq+q1Ps6wXoqp6O30OAjP605XGyiTRUMHZmfU65+EXEXT3X5WqYv7/UICF1UcDoRxzilE2uECWdXHBpR48RLHw9W7M1qVGnEobIt0SpxqklJfaVR2iKdswzPLrtJQXz+9O6s77nxtxRv4nmbFZ0RiBflIBfcmMTUJ1CzIoP1bpXCvpXWhtcTH65FEJ+83psQkzAzzkvm3M4OikFnP5fqJwb3AiPw3+rMk6WZ+RRX9Ob0n4wo9WQLiiB4HAjqFNO27y9rapaplXGYJE0ZaITaN4Cyxi5lgGsbCjGu94QagLzt3JyfqlvMGmAgZnOgqS3AG0AddngQAuhCcJ3IGJ0j8moamvgWodJW1Qc2L+eejcF/I9fjy1sRUD9A/Ahq+xbOResJbDsx0E0pXxnwzX6IgyEXBo3FxZwUH90EDGbWkb2R5LC4kufVSk3KOiVf5mPT4cMibfOC1QBpR8L4YOC4N8srRD2Gm/6nyG1ziDLaGak0wrHK+tVtiyHv3qpkNs/FXTodF6AL/Av6uvfcG0aG0yWGyNmXL6fvcyio8GXRRSKfq/3Mz46Y1uykwAH4ZidSZ1xy5vmvEbyKnn8dpDO7kKJI7ZMv/1KXGxpI61FQ4kA/9zSNWMsbJTgxo+bpk+wJHcd3wy3chdEAxf+484Cv88b/42mTf8PCNXgL6IQUQoNOTxkms9naSr+fHF0sQj3FC7vj3PHIYgULA1MCPPTmM6fqqJc/7f6s/FCEIBLcgC0ohIlYPIHsWlOYqiNl4xpXNrJ1Ghxxs5PE6Dr3eQ/bIbAog66EQ0eCINfpUsTzj88Zt4POEvZ+fkbTUrvbzJSFRlFrq18dWBSQWM5EJHz1hlcbqMoLbqIxaxV9mveCO6q0cuLtl+d8qJ2PEKBpUi6G5aoB6kjuK+vYjh4ZRB4cLfHzSkIw1j9nOwqKIWJeMYzxE5kpHq+knus13EsmUSLMxw/qOevMYzbqJXCVei8rz+jp7UqvYFwTkqUAuekU8B/d1W734lXvSbpD5g0thRivLOx7q/Z6m6FOJBlp2exedqLSOf2K6lz8CHIjeu566A63GFPRQ4HLkrdX74xOXL1tEfJJfZV8qxtL8Xcs+KD2yP3s+D4wfsZKOckNP04RC1F3VNrknIqU2xm1SziRaSLwXzvpdmPqbXoG/tSxnzaMkcLbQMc1HEOXkjjBgQvaf1hyRVrvUJJ2e+jrTNZafBvSxvVXKpYr9ciMWJfHB7WEIWVffL+SbeT4qmBYiT0UsBpewHT8KAvy7MZdRmQgchnpl1k0vApyu6cGuD6gbfJA7ZsRJDf2E7pjDtf35HO74AoEvhQFsKmWJc1gJlHLZaBf44I8BF6gYxnsJ+jh/uszGmoXTMpgzKcuV/NOn4F1ZUCWkWJjcgozRCBSmvvwfwiZHPk3+My+XnUkVY7abX4Pg1f+eshAHKAsMY/5b0+n6FY9EQtvGLnM3+UCJHhn2XqIrdKsKmLUTNSuGRgVFKAeRgnn7STX4Us8ZOBiNba0/XHJHdimOcXyqa/RDfe3fmAwdWWgL+caAILS3b5EIS+83YdT3V5EgwqATSyOq6yN0tyQTkhxIUqzD4pwyfD00Y0ZGkptg90lncsl11F9iS1MKeX/vu4NeFfYQLpP60nj2o707qLwaBHJLvK6QzoWiuhJXu35UHiSIdlVV/EK/k6ZXIwVQRst+q6JsIN0vkLIhyb+7jJOoKDsGg2DWqDvIFYCVUcnPpRyBD3xGprJzydi8h10qw3aRTO8NKoWt2bqb4F9nGv9L6Habc3UxT//5Q2axguXBRihfbwDyo5PEvclMj41iwH3Bs8X+mI1eMmT+92SaSWjnq/xniwiOF0Rsstp8twBSy2aKxNPahsZw+juloaA+zf3xqnZKtVrD97G0ucektYM0bZXspMow43sPKgdp8rBLj7V4cyw0GzlmDrZ5PUwoYdLwxq9LeJHLFh5ZeXCTAtlN6cV5x0y+xYFqgUOZMv/ttK1mHwRdv0qTXciKiuOwUYWaEkJutwzxMEN8g+aB64BMk6ax51UFHq1bRfBUq5OchrXmkrH54IMymT4C4SxBGogj1b402OgRHB1fR4wn6k7u8bUBVBakH6K5DGezqYk64s4Riy8/J7VtITago1dnVY7CFkSUtlmdp1IFB8kgGOzXeJxOFZgS3n8a/lY/YtVRssYqOfoSPV16y829abCiPpwf4LHhrk/q2jEPnf/C8uRLMZm3cAwB08dVFHGwOOyZhPv8q8gZsagYAhbhGCEbKux7iPzKjSMGOe02MBOQfIFSdECf8d/YvD223nRvIS6z78ptZJMrKeZKtH3Fn3O1J9oWQ68RytdXjaaQiBGObVsf1yoopuRI/RtO5OJGe4sXCHJ8OlwygoeHoCg8BzoKVqknuecGakoWJ9SnDtZSBsLDNVHLpGrPFR3TGUGt3qNaFAlTHrnCSwtsC3bRBhPx4TMI3zX0rZJsaXYOWdDtoNwRhyHoEEmfLNFY6rsXcE15CJbtZzXTWOK2KyFC1Z3sg1YpVzKfG7P4Dn3BKCyjTUjhLSqWmRjCH1kfRCECgVYfdjRS+PjVd5AAk7nMl+UhC6wIIktogXIcsLFcuevD72QOJwUfZwj33aC5P5RSFlj5gX5lpeaeHDphF4u62U3luKgBVAkxmlbaQ+o9BK2sVvz1MnZrwhljuupAkEyX52k8vRM7fNcKvbwaWl59ZOnNO2R8PWYpVw2UZA4/M40jwTfDa4eE6rjYZbxPPAmnZ24gU4zrFh9CWbgBJEohSlnFCTF2Ck9fjI+LmVA94dTJYGOyw9zYIqbbL2Hj1amYAK8hkwlGWG/8diZD8QAl4DeH8AwNG7pfC2ErlSSbc2DVnHDBgs5AsNBKRixK+brDtSCDuyHPa/av62bhS+6C5bckpDUXmxmL+w7g9j0WihDdFjENwDy1fdrFVYdOkWICXox66fvoPHbql7jWcZ+U1Al2ix9UVUbH1UYyGpW1lGeloTFtD29jBggUqu0RLD1yytImNlfVr/TNVXqijHq/bF8FCdeUGZLy3jfpbwZN3Q8eyyMdEm7032vJEP8Wsl571zcp2W90ZjXusAoczF2eEqsqf3TzYE8PdUgc5D12xm6KUjpSFQHjFVXgYVfkUhPPpYqZEpJ1DF0jS19i5Cw3yAaRSefPYXl3duEJQ8h1r2AlpRXz12a/J+NzvCVuqpOMFzsXPEcmrM4hu2DNJVU71JFU99gVc9U55/rHxN4qh0K40Mx1k6LkpOjOnnoxGItfoYyC63fDA1wncZaN10a4ETclxixdJEzUaEizRLXr9WBRlivD+sCf3mXtJ0MD1krQ1IqE+By2ZhjsO6XrZfXd/VcTWPcN4Jm8c0kM7N0PiUFEDPwyedXj9jGwquIQcFmq08QvrbxeaRHGSGH4JAu/9CGTgpvVjW2LwG3J+qn2IxXJ29LxxPlYH004sT3pHf+bXerNZv9HHMQV8sbaAHK6a+dUEph3RwvEvzGw4GakTg2xT4MhdWEss+wsvQfhdiZvIaqujg+UZ7jJVenon0dWHV8YTarJ5xfaamNte+gMA4ClMX1MbJOSuYTZsR/1x/VMZxvKuwOlJCGk06PUwy90ufjg43x8v0AQVkM/hrHD0mlU1F9ssS0WEERpIO4ySNCQy2DgpyoBU0y6fRjY1hKlzG5WoqqZNtnsOneGRLIQ8kjpxHb9bUba/wlplnWbwLUoGUoVnjPNL3A8ebuTQ2M7LxU69hZ8oAzEvYY+Tl7mwVQGqmmXE+TiWF8+AQqGTUsptd6Te5+El1hXiniTS0Xq/1c0dma92NQIu7TEjhKyhCLRC3W9KUhs3xSu2zVVdtWlKmXF2h+Mhmu0ENjCZaFMCQ6I3fRd+TiMTLlh2cbPPypSol/6xVxvAVak/UPVqbIzdV3QtMcx6Sm8mI1c6JVH5RASWK97TChzmXUimDi9zMvmi8WK6YwYzkLwyE5KzEOoen8g7NxkVzL5+WmZRZK41qimXrdwfAl8Y+3QuZI4Q61yfyv+WKjLDOmqZNr8Kbv98Qi5pfiNxvlP8cBvC1tX7TW444zzVhsv4M1s6omAOTIRGgk+7MQFJbhE+5RLe5Po5k4cr01QkSgCMCwMF21+H79BgvXx2/iLxZE77nOo8tsXhl/Lbt/63P9Kt62bapPwBsnnWbonHlo7Yvas40iKEXVV4eENGyZQLu2sPoFO3Clv/r79FDGl95Z7uYMstyPnUH9eJL2eAYZDM//FdvReQW70JxxGlGaTby40D5/+ucvL6gwQZjcQw2bWNjXdaenAhqaYWrEUCFzmjVRS/DYfWwF+zFYU2NDgZqKTAG0NP4STIbUwJ3WF9j0VowShPR12DWFKwbAFBWezIIEfzB1RyU+FDQfuEvLfV/+ozhX1d97cIQ/ePZkOSjngtzTIxnpNlaHx6LD/wrhknBeDG8t70tpZI2wxu4/M8cifbTmV9r69xORIoNH3RIEv3Rd8WlbA2x+Uli29KCyJsKOWYIleoYgTZggHu3dS5dDwiLCROR35Y+V6oDB6bzjckyNbVCwCWwQwLi877oUI0NUbeUs+XMjhDN9zwEFiMXIj2SkjPZtNmppMKlcDTgbiUSdCPSCwO4p4rP1kCxIVd0JNH/5E/dahRMR3jxVirfyQmNgfla3WLjff8uY/xMBo6GS/ECDSOnQWEPa9/NYpSKMMLTuCTd3vZpdX8uQ6U0HrIBJvyAGcrj74mEHOoH1qeuF+GW/Ukb7phrrsDfXeAx0fdR4Lb4nWAo4NtYfWWpaxCfPpzRqplFh5WSOn0WDDBo1IZW1ZUPfEgkMpIYFzEdVmu7Op3h1BskyHOi/eQOUI+XUvhL9GgvA6nyLYSR07TpbeCEelion7pexJxKSpzb5ZBa1PtKi4NxMRJ7tBqNonAYQ2ExNvUHMgabBlQLb1lxrKgiRaKNFewdWlWK9upaWMbInZt3r+9C3p/pnYOu5cxsvDHc+/O7Cvr2ngigPFqT6zZ9rEGbYyMNn+hzG4GdbdNH7S1pYM9V6xJZyoYwltkKjR4xnQ+w5enQ55xdj/e0yp6KeZY1MMRNr2L7O3g+Ai5vpmEW0f8OFteaDZJmrl3oVmOFayUtmjqJuTzwkZ0G8uM6zJkRdNSqqlOw9ca0KFAw3fNP6a8YhmeqHFDiTAJrMxXnK46yk+0DKqcKgqzvTfe9QNP6bO+5Equfxr0zoqdyB9SyPETHgDmGr9+HJdl9hgYvYEg9bp9ZYsWcngzrpWcVnjXXbjYMav7VNxjCiHmr0BX72WsASeeqhxyAJuLqDqlvXcx4ToExq3F+2kEhvyx3eYTfESGh52a89UaZPcknr0c6H2pc16+QUO4bcr7EkKRtpaKbLC39X4XRQSw8ldn3pt+RsnYarRJMZ+kHPU+N3f6y4YPyCB1T9OdqM/81ZLYxKwVMpUuakg0XeedJbPwBolXePVmOzstQz89ndumbjGLVyZyjjlo2h9Q3QsGcWgsskb1qI2rZlQIJFGxUyx0Soy8ATL0sLHxHO6Z7vML9Ta7pu8SiipHlxU2TR4kqR3nifsAYPl1QqY/4pdLcyow9QmHluZ5Iw6EkdqP9oDiwm+8kwIMRR5yrLshLIOcQ8Rodc8cigXkY4hKtpnWQTELkEi/00hBnRJI48O85w57YFOKsKEg5jb8RVmdl0DWOULu6WRo6muNveTXU/3brchxdxV/8LF0gvdNwj0B8wkqu014kX6amhLvKPAtq8i9y959zXZO3nhQzwtlmFEYrfuS8U/gocO4/AvWspRDdm6Y+76yiVhZRW8WqHHea1Vy7ew2g8VPo0rykzye1QgkWG0oaz+BVpJ5xQ7MFcyB7EOkgmeKhEgMd7ejHSaViiSarDedBmla+C9/XYTAe3MdMGqCFWY7N/W0g4IBKWdLsbw99/0kWmWzgNJWDZSHXzhEHFf0cqcCY+/VLoghYbErIh0XCIYr2o2xZ0h3PvNGbBas1t39bWFXRH/5DYvjDxg/w8ArgOavgwgZ19dtBRre1xUkUd3Lf48bkMNtuoAmn44XuFVka9exVq3SP5lTben15ca8pvCLhZZXWQhAYvfH5W991ssXxMVGQVKL1tdiORDjlzp8pLGtuLiO4JWbOGO4p7KPEzEnVv6cZs73dkH1cOfYENmgx70WxTICGFJA6Pu76709FXoWBoxwWGiswEzSuAK7SaagxfuyHHtuz03jOUy3bVoHwDyGANg5egGVAadYGGONJDvFcvP1BSM9f243SyGG68zQnJlSxOTnjxo24lxNieT+Riug9wYOvSZu+uX9eX8w+/KR+wRQ+oFWJ8OBXQjNSSUECvcaN44U6X1Df8RtkHETBSRxdckQyQ5CIvE3HSHs5fI4TtpetlYqucV1sR0OucCaCVod+c5COYgI9+v/9xus6aITxFRR3YOq5800txX7wut2pqk5RjjEobgFtaHUIHmJHODF3gfajaC8z81gF3TN0TjWAwMJVM1vp8fy+mOlMh6P8IPyuDkmfswD5PLde5KheRdYyeobeZKomsWT3ELWlZbYhqKgyRvS1y6YymvTalYuhIRPhNWNOQ1C30bv95lC9SpEmew8xgURARHv0zFmav1pAiyAJ1eh6Pkuaber+kzSj6O8orr8fmEbKKHZ6/A1JXAJgJ+GNQ5vscYqL4jwBUoyPYtueZnymylMrS1iDteYxFVePhJS6GZxVlUk+Ix7zeYilDdxLCrG0r+TqJR/Ye8mTNuEoyOLQGpSfVAA7W0PG517YLc5z8LPVJ600vTnihEy1Zg7epXsSV6GYjmOlA4DmbttkA3Fl2Lsq1tU0qNGJFXNQhsUtMPdbYVcLUH7BNgUkqXRYIHmNDRDLJn0DEH6PDHyewaCLKOfEe/3aNzcoQ1Ay89vSABJaQukBFVLWO120EQztMZ15oDT8XrGUEyoTrjmL7zwPzMZBl/C+gRlEfRVNygEcFAaH/fg5pVey8cNkdScvcZyQBKJdGG/ZaAHVlt3kHBBY/iCCLuk77SX2jxi5kUD6VZCmBLLKkS11NgjXP2jq0Kxuo030Icau4w8EbWS7UyzwPNE6m6y81r0eW/wtyuZwn3lkamaWXk+ncM2bxYn3UVCbyaAK0UWHt8Q4FXrAxEHF7ptB3UXGRPRPF2iy3vT+1VmdsifmlGiNZC1sreNfIMSiBLV8AtJDx1dl4Q8HUCWphFQDHCBpPVWlJSsYxvsKx6xISbIqLj0TyylaE7Tnz8/3Tzhm8N2VCxKSY+3O8C0hjicX6p6ZkEXEViqBOSIXDVSLkoAHXcccgCErUv8tFecwpWoS+RHh11sqGv8N1cXyy45l238CRLl6tcxOmk0Z6AXveY+PvEUqCFORM82Dn+F9uqXr4yOS5xQqygtrGBwsEmd47EW1amndb5A2BmwfQIuYmkT4xRHD/eOC3dEtmfoJv1E+1Tdnwe8ITwn9r2qJ+jjICjIz1atF0Vgg92yYd/4rM10Yv1upEIrO+z96HckOj8hJFg63Sc9B9plB8xJm8guXsNKkgLgjFtKE8MfD2m7yjO9TLhh8h2VDXEV1n4TEGUZheBelvCW/40/dE2F7ZksKy1A2k+jwrXDidJzzrbsotyyXrKbt39NQZAM+29IGDHFDjrX6OOnj+rxf6sTYh4wdpknGCq9iV7mgWToIGUvvu5cAMRVayqEBkWtkG2neWFnFuPWfE7W/D3LdMqh7suOj5Yyn/JUjL30/dDboZnBCw3ajhOJOyeboI3ZrJcjkDRhWjbYLpqQFLyCCu4W9kgnEzqDwoVzqL05jaguoJSrlU2Ggetu2ZNbVnkqqJAOkxwRsnvxA95T27DVPNP01uFj2DWs79UrOIoEVx5GQ7qGpyC49HYbBu4CTWdT020m6V4DPwOl019W7aCmVD0waw0innaW84PnrGyr06JY3gQH6leotvei1UjNzuwOlEmCnL2L8W8yetJunSpLf66FK64d4nmJ4uk9AwT3g3/FLuCPL3mliB3vq94hPwWjQ0z092mlpsVk8Nwb/cMtcc8LwxdAmB+yKo00AM0DC8bjURXpnuarsmOsSN/7L7pCYFFz96j3nAYkexIDi8pYPPeoCDI7mNaABb4MyfMqUn+ylIOkBvgqTMRaaR/v8JQr8XcGSgqEbzniFp4qKvauXjLECoULSugxDz4lffkOWhaPzriPrfU7+NekYXxerfuUjbLGg/ReEZxTG/lXJ5PWj84chfWlSuABaJj5gSWGHSmlrLVqSzDZeGadCGbaX8oo64Zryv7jRUJYlyFpeCYqpacvy9K/mVNsRq9rrQ7IWdP4yDrM4Px81fL0vN4cG+36cGtUSCNGrRRM702/cUVikJyKeMq3LdP3BrKrOI3T10kp8hRIBd8FQxXAFqKXFgXFsWB4N8nO4DLm2fx6CTqUYVfiC3En21ZbR2/MI52tjT8Nh52UZd8GqgN1HhynM8DpY5y11aB/PcQUGnrPCkr2hBS4ghG/rCfFGEIufTZ3i9ArT3xF9B/Is8uXQiN36nYRYLKcE/DIyf2agjD8muMM/h1lGWR41JDbKcG65qZemrQaaRdxct/tM3XVRyhlngWw9INz7wsxiS3fFUMnMOI3PIdd5UxJqQwNOx/B9xN+V05lx44dHgaCzERdGe0fB4JWtMKGmLR8JF0z6XxUeVoz6uIX9JTvOticMmEgVAOTKOv60m2YJ4v4T1qgtrEMWy1c9e//xrl4cUjBEimAJrrUyjmoivLFNA/cmPJYMCK/YiftqQVsI4eQ82Dsn1ERfEVK5HEDuixRDPUh5l/XIi9ByypDCMKi3rrslWPGBph7Wfw++9dcdJapyh4lmeV3vzwirvEcC0PIcycgbTCKvVkbaB7Tpd2CxzaDCg0KBa191to2DLGz6nmdHZHsUsHzRcQecnOrxCVSN5yGUdYmmSnNqFHqWpGNFn4++qN5Y+Cln27rLHb2dzOyb7le1dUw6Uw5uA7DTOJMQ09BZ6nSqDLGyqWAKzG6nH/qB4i+qy8t8CkEHFgFIpo6T8HbKdl9XZmNMqG5GKbRMwDPa7LVRtV1Si0HhPxVi2oZEg8+6SKNGaLUI9huFEQnuIJ8A0unXbh+dmA8KIK/KqMlXdb5L8AERQLb0EZuYbE1Gw2WocNQaGOeYv8mvm45O6cADTbul6y3Uxg9Sc8XcAKUee3XynhWF4F3dModWCGWf/DQoE9K7KXU0U/m4mne6GG7tea7nhGiPUKjgA4qSUa+V66UhV5WMA/gQOj3imCreUMYthIEUHiGvYY75Fh59se9M5JxL7loZAFE55QGpucgEbH0JH8dBAl378OIz5IGW0b80Dsqsauy0l0YcQdpj7YACBR86wWHNlb1KeaShc4WAGZklXU+NLpkEWrp/ppr0rriF1yS4wyLpeLJrFW/d4jdjYpu2hb3iwgyNmxaF08HHSfKKj06LAc2f6ivGgjMNZwdDR0OyFXAb6yFR2ApwNPJqJWyYuoh1Wg8euLY6pqjj+nfLNNbS2xcQy3zOxVO+7Fb4E2pzpg67z//drgN++cigt52YNHbXhz+b/Pm1Xmb9mW54bxQc1Qyj0N/eY1QJIv/zlh9V3i9Iv4S3IrdtrH1MY1C1c08cIS0+nI4VMuXGGD09HCeJCuKbothLvQUfLbsPlMvI7whkvSuuR0uuoG522MY1qAwcCLvBH7JhIJNE/BnMBzWrJhmwnFC2a67hXRqoByi0ZkxuaMj7AKo1M1GxkVCSCb1DQ8q0bs+N8xreG4D7BTP2gsAnLO+l7cmht3Cm4FCFkz4/ZzKeUX3JrKcrF6X6KLhTONQm6kRLRVkaDyYwNSr3z8aD5kTXv2ZCJlBKblenlA1QNIj2Tf4xJ+P11Njeg1JKPaYukbhS4FruS4T0B3N5kjr6dnJn/AQ7zpyc5/Cxs7Xgx2DrXpxFsLqpbmVF+7vgtVRwWjtMoaYORGbjtFAfpYRkxL83XPNantoqNGQxC1tVC3aY8Lj/oQOxAqnch6AXkUa+VmROUS7yv3xThR+g6uDnBph/j6W2zRnJJUDn4fsiWilbWQi3eu+z3JCi/o/NtF85+D1t+DG/J9h88KsW0mvmlgsIE0gBr4uiey2toAEhohEgRjuXWPCDxqW9paC+QyGPRAiJ0TD/ZCh5sEq4R8hMoYS2xafpex7nzBGMpOObivWQsrHt+9wKzfTKPJ5gsD04NnpgMPJbGMN4cixDy1ouHiAWqDO95mlkoPdVLDe810y2gOMxEw3/Ujy9MG039OwMoxU16aBqbaOnRH91yp/aDJNmV0sh2NyR0VCPsyBpZ/FnBitJ9wwXEHWYyaL30XbAggNq6VBtxDov78mVqZhnmaUMMRZV9c1LT3cEdDsfse4imEzDHDQ1E9pl16fT+w0edln+eM25omM0ukcMIRG2sw0qKtQdGCJpXH+qvTynseDriC8Ohw1b32BxA8DynXx/0xf2ZXKa5oFU39U//VA7dh/I/Nf6oud5d3Sk1fohg+rJVtr0dQAld9fotuezPo0RMALijUv0Ou9edoDPh84e/X9D2rO/qj45c91CR4TMg2AjvpcE4Oo0S2ob8nVhfw441MhVFS/GaZ9xCjW32cRpp3nr7DYShkwh+kgfjrpVbA5yMmWXxKg6mE6RHBhWiKxr8bdl3H7Hy6Ek36NMctG4ySIWtIVu0LCC3V0Ug7wNXMo5S/ncOrgKxiaQQsT0NZ+FBSHWeUCNQAxiZtHcS4vFnnirhT5av4EaZXG80/s4yjexjEwfVBlEfkdfKecAf2s0XqAHWUhvHLSOn8BwuI4dwgSkIEi20TDptNh/yiL3lHaUSkf1/J4yKx0eXeh4OAUCg0OmwsaO8HPL8GOgZ8Gp+6XuzKyHDpdh99g+g8lSJv8kgZ61IulSs9N07ynWzqU/dQoJbMp3FMWIiGcHzQX8pLjojAD9zdF0le5zo/bo+SV7R80W7gSkxWZwVBGpY1+9V0xLf3TsQU+bOCtOTMi25HRy9VCleQMXbjxXMc5JdtNas6XcVdKzCvBtIqaGvCz2nyizfidQI0ZlbRI5TLSJ4RDJWXFv+RKwLbTAqX5hjOJqhXi3BGR0iqgFwcUk1hO1dE7i4199uYV7/Bmt8QcjSQGXPSngMZ+crsECu4+aeEImWrkA/xeptlxfDJ1JaLIhVgexw3OfEyyGTw2zrsEs+kLofcCktEWvgoMLaTvbb5ZG98kO6t13kcxdh+9MU2mGUtXh4G7Go7VlX3fyNgBWeLI6WYDiPj9PKSuS4+FNq0aXvVXd42Qt/6YP0qxQYiZIRDWimcG0KJmSr+rQyBnZqcOUQbec4Lppzmwj4cIbnG5bsnJq4nOhqrb8jHp8pa/3fT6iw5VDfGfVWMpbGyL80VSGWb3VUm0N2eFKAhyJW1591fWX4rhTEJZDAJ4nNqowQexfO6ivv5lf1DEk8dwV0PKeUPuQMVgybF2WqTWUvTIgl0eBorJMCc/BPasQo8Qm2Gn/UvhEppsYpX1cnMzY3CydYJU4JB6XN9CI4SLinzjzxZSDm0hlr2sRYAsv37kA/NYziQxNQnkAb6dKkwWI6jpCTvyZmLppkrDyMKz54Ynva2Nc3b8wcuwJSoeznLwMg96xXu03/ZVRkX2XLEAmIm/wO1vZ70HZOQyVCccd+TyiwQaB6q4/MN7pxcSY31/Xi5hEVLF+NU/wOkWpIsbfnaPYMtD7dkn7JXeUAu+L4B/fFCNx2+2/eJxpGcpQj2ENltdW0hFRkNV46ZwylJVXC8CVtFAA6JRFfORdqrtk/QkmJ24boQ1ugtNbzTP23YuO4ZWOu29kICOyYkcNh220ktnFQaRfdxh95tXIthmCT1rmALnVefzGTYNeYlM84AP35EczMKW/lvPrgthq3MQwkgG3/3vxe93b/AuvsrAbOh+ax/1a81VvbKTLbo/koSpG17HOuTpqaUYpMcADqmP2hUWplxrNgefsT4ugHfFED+jWQG6OmKh9LnShJQwosAX0T7EU3VWpL03zC3S1tgXE1MoNjv2jfeXehcFcROyTRpiGjZ//qca9kGR5Xrfj66T+zYyA7VuLpxr7vjs4dg1UroBHfg23n20WLGxXV/L+WPryqjJXuVn51Bap4z+I0BFmHCDkLMF3meJr8CUTpcsV65zW8sxCFxo5x9xD1aNPIqDo0m176AZyX244vechYC/e2ie++Y/jIlop9Nxd5TPw+1jCVqigEnNjyWMAJ/sDND6jMHvGKmowO7TIYBd/qDbjvunisLyENP9X0AAYlDSpnNLp7S1yhB/R/2zOKvbW62z+c0uKNpzfzhqF9RJ3CQr4cYwSHr236ieJnXyLm4MM1bnJuo4MmnFnqRBWTMR91UrHBQpbvqk3Lh8vAE8YNZahZ1NwXTVeJ+vFKefZBNWZvl5A1alZIaVMDvv1RPHIZeiqN2mf8dTPsv9Ch+K3DreJT7zntsMP16cP32evihlRfoIcTa/tMNVStFB7wm2usRBdXZgQVFhsECWFPoFkQqMuR81XpxRfDVeG/YPKvubGtsYEkTbkPqqtmAr7qEmMZyZvq2hicBdw70PjOdMnDnFTQuDwtYxBENbnmAjRRNqd1jKf4TJcfJlPyB54j1cex/9pYzj/NuqI97iK65RRvgR5LQNu+mONcSZdZsjg187anUI08BgZPbotJEbBviT+96ONIJsKRG37m5bBwZiL80GjRERXKLxB2vMo2srBknpxYAWXHrhSBuhJ8Uo8Z642qrcr7L6GUB8v0E4oqRrzHMs/Tq8RLkkpsGsz1vFM/SXet93Ga/yvcxfKdcQ2jvP65dyo2/taPDz02oqMnlGybowP7rz9c66r6hnpIjdyBxRO2/WBeoFRvpnYTx/WokE6H2YSpE+cpLzhfDC7umK8jBvPUNXfc5oHUHh6iGRGCPEdI/TgWzljbJGWmiOjG5Gqu5gA/El3YWi2uV2BDtSodUGUJo871aQ/zkbZxPer7y3ceMGJZFGy591qSiXnj6THnYrvXv4k+KE4/XBFr7oNgcZ87zVLGAKhZ4ECq0BZ+irX1PI5N5Hm4nyPjaQ58qjERi4bhMVb8pG1wuTtT1gKKWlU+l2MS3LLbrVBCAPQ4uzanRgcMiFQfYiZ3zcBAMefEmH52PBjnXOnwmRg4DYlaUXm4MNkGT3RhyIkK0grBJ92DybnkvfqMrwFbtzpV6/PIPL72SzWSmZkeuMXBNeApcWuojy/GVVOtH5l7S1D8Jno5SDnc9MJgZx42sJLuLUwiccygD2gTqM7HgwpJxeExUYLjBhGxe3YPM3A5hpKZAvBMEeM4vB/xQvEJhoKW3t4z2OF4HxoXm5gzUv5cDJFWlcsGifr1Zl0nhdRZgeUsN6FpSy80Ds/8zFCqEgeX9m4/Bdd3S34unHR35NWFYxV6PwHtFVluSR5Sp6yasuQpduLU7S+ghi1mcCGzEcyGRKkwc1n3s4zphjYMG3DZ2+kVW5Er8/HeV75mNMnef+TPldfZsPfsXDJcMFwEh01oKrD+7mmPeekG2Bs9MSNT6ItPVnK7SnNjOoen7lhkftsr0WFFSnr2CwRdxj0cqqgTQWdK3gsGelObi/tQ1am8DgTS/cJkQnGRyz8FOVmc7Y2s3pEVNI8MJeOIhoKj7mMgGtoWzhC3+x0+j8SkCzWLoxBqXCqbEKJUvE5WhG9v9Q/P1ZQNn484jVNNy0AAhxID0WBELfNi5wJX6pvVcWFxFSIizjdvXxyrfMp9IX1xwHCtQkR+aDfKYTUrEA94kAs8Ko2vKjT8scw4zYKedquMozMBUJnD/uCzMT8TCwbN2FCsZqCUpbB3JG3Za5DC8NulAZMzXw2rvN0YOYoov+UOhHLkg53qveJwXE482ldc0FPBk4nhF/S8Hno38XHUOlp+ysKNI/CAttJ9fKzdBoXUmL5NB2WPZbO827ddFvaaSaGBWiL9qq2dPd+AX4LKr7dOjr76sTgktuZ4lEFYKKRpwq9+wANqE87qm1VnLJj/ud3sFcZAqkiUGkFlAdJfYp+1eErC0t82Ae8JJ4r7hPY4hvYjVcj/1xbkH3mSGtj6WeBkqrf7qiaIt+mZb7wweji2kVZD+2XSDoIqyZFN8BM18tLWaPPGohIR1GtDVpRmvdpBy/Akf4JtKd9EWx/RbkwKLpqAODBEzPJeeENkxxKzCg6/U8tnE2qCDo/WEqaqbkSFKNp+T1l999arc3hb/MWX+JUQEc6dzZw/FNgUSNVMulRI1huhM7DR6zM5Z99YbMrmoefMr+UHULV2PpsPh0A9RXN+E6ZD5nhUORBdUTxH7TIbXN/DwEPr3XCNHOjqo5pgMRbga7owcen5hDkTMnQauqf7utyzZa08WHBSLYcjyE8EFaDRsxjoJxMr6F2S08FJ8TMnA7yej41qmJusfNN+RhI4YzFtH5DZ56WwhwivWsFx6DB7dERW+VF1FbdV1rO+QbjimuIM46Yg2Yn9ov4Qy/ZzcojUBcCqPQJDSo914iaXceF8HSn9UNrR0MxY0mZDYhv6BroI/O9BrgnEn4ooP8EsbSjXHXXGe62ueMnCEEVhwJqTGBRkl3JP+cXjGpBbakSKE4eecXZ6nDN4q8btvEK6/M4nva2U+j7dgeK6gAkzjRysrBDH1FNXkjnzlJraETckVS+HAgLHxIaGVi5DgMAVZKKRm2SEpdZtUG06OwKvldCULdmF6vf+yXyRP8IEhdta5rXTOrPevSopaV8qFBL4jh7jflDZ/EoG4n4yUOJ3C3U4KiONTwOswFY3dQJ+4YToC8BDqcj0WRaXAwT3U2Z9dW6x+XViFn2/hTILwFUzC7sFzgZXrpM6or2tj7ssKAEUJEzxop1I+SskMFhR5uUZ5x0rPT64XNuDxRrj2NkbVLh6f8REsryOpkzPpbBNMJTYzQCoLB6Ckx1+NYNmmJuxuwkfxfCfvv94JULiIu4gGUodjlUI5mhdpv2Fd+s8jPpjXiSL61RKj/RGwjQi7Yqyu0klC1H4lDV30zPsW8iNghciEnIGNZyxLXsHxxHCZqRvjStPSYaNQau9Ze775vUUsqzqnq99o/k8DBKyQ2D8t8kakFyFesvjlMYXxBsJxYINi8vDnmzMlbSv32GL715edRnJSuyCzYXmsSNJ77jIVms1v6BmAhQ4x+nCfCVRXO3/ZtQmgF2IcL/G/Q7Aoh7RAHTFMGsxLBQPbqfxmNR/o225OugO5nQouP2YVQYWge0A3mZXgZLspzGWjXhzgmXHi0u78L2G9Yb0CuQkHe9r17pzIi5cQ2+ma0IoHh0QPHG4omLros6B3/sW2QBCd9nfNEXz/u2Qj65tutTNzzZP3Xopdv0njDjWnXaOjGenMvmmdLPz/UzRhVIfrb9QLJArLQZxCyjyR6b0dQMDTB6XHFhASiftlMP0WxXrTiaWRW/8nC3gTLxRTJMRS45Wt3v2PPQb6PvqWqfY9tmttgNZ70p8abnR8lPWcXDgfT+LiNH2I275CkDsvmUD9jYKdOqRmdk3V2yP2L+Bp74s+/BSWnoCNUYCXSs4pHOawUBdWsdztVP+44L50ILM0dGTxTDBMKqsVsM3p1qcVn4tGD6ZrWv2uqf8PIPMFV9oRiaEYyixb2Vu1EtpVlIcLGe43WKW8UzwCJDUYdn+4dqvq+s2gcWBvAXLX3Zkds3DwoPHiTLNhmRHId/WHwSFq16LPPfRW0Yo/A9pSs4p3Xn09DkBAZu1C1SBnXiwfrafOW99n1Fqli0ROp2alQib5wx3u4DANTtWes7nuNzzOFiTDnya/v6sjZIHNIAHLUV8nepbqVNyQY96xfMzFkEjXMKeKGXielBFc3BWxhXY9IduAYyq95DIYKSbwwjXE+wxonULchBKqk4e5sAcL91KQx2/hrh59x4QARQy2bHh6sP9i4mCY21NL7RqjhFqxt4U6fvi+Dz5UQSXbMkxjKX+0BE81GzotbkUvRsaIC4dLzg5YStparHngHxVbHcizWv+gVMqnM+z0GrORbNbFNbucxEouVXxZeifsBNJzc88I0m3esHRCN6vdp1I63220KBMoMTL1kZkhx9x48tpWpOHe3f2ShqA4R2oBxzaPEivXJsWLyG+CraBpQSDPYKglckpFzQ77dsrmHhrP9sr/A8Mf2J0ZCiIK9u+U6qKEMFodnXZEN+lAJVGXGUc1BcAopA2mioGiI7P7zZP23cfrAkpzZVI0vzTMh1GWSlNZ7WOCHsY1tkms99nOXerw3JINuAW/O7THsJKV9JrgSVouB6omuvEQsyIP8sepCpC3PVFkWF6AQbiH5UCMSfCDTqytWv0lK38B8LRBAydr+E2U3sJ5RrvallnWbpCYMrLKyPQDg8JbVzdVaT+Nyx58jnNw3VTAlZgJZvPvQI3x2cBIX9OUDpkTth1bh9aqrHusaAtKVm5Gw6zLTgOXPuTrVgf1bi0lXtMYLY7XOgux7P8pnXUD4jo/3zvLkjmyY1xppcTheM8ahvDas3V9lDp5QGZnBey3skNgqrbodKV08u98v+Nm5Lbi6cQIRrg4PKfJYHCgP6lx8gUT2rXfaZgDtkUQ7CPoweTLE9vzr3oLWcQ631rFlpcstfJkd3Nv6yfAnm7JKYvAEH7a5O+Qg4+EdVezDDMra5dtnafrHUNE779j3fdjVqSJOW+EP6w0P6Pt7WPHVkCHUMG1lf9kMvoGgUOfiCYJOl0Af2ktgulEeAAeqYk/y0Y40dkCOzVO18K2vKDBU5eizOdOQdz7oscjhCHHTbRYndwaK3Bif7PHj98dSFOx01m/7otIzFtK5G4rz0oxAlriksVrA3vX1ihKPD41ISXLwgbZO2mnlS2K87qkKpMryvlQ1fdbj5BoJwfuIqXAWoQ2i7lJNbkt33UNXEg0rRxWfWziLtlursE7rLdRnx073aremS598aU4I2T3LZf3q3quiuUKrgeCa1UwcFDK9E/cTjXGKkIhAnAYzceN25q8oCn7PUWbptT1DJ4jh6c82gHTW6yaUtJECXnV0aF98n7oOv3APE5YjVAm1+ePExQVKPMDIq0MBj+ojcUMZzKE29Mksj4dYnrGzEJXxrh7Hc6BGUQD7POOIn2915vENn7N8gysDjgAG/RrnYS03vxCfyCmbvUykw1FnLuIRr0T7nlMCjvs0Z3fMZT3jOP2hVKDjMBQs3dZ1e2YuSZ6+ydJksXxW/1t+QQJty8Qx6vRVhPVisAx9cytMSkCJN/YhUAURMEoctc8gTOykb5iGZp2osoVLKDYTXJ9yn0wVor1wBdVQsCU32jzz5TFaZ/ciLvCOiHmmkiJ9LasU4+dWi3xrPThhjf2v0cZnUlStThz40qdb7CcAetIXovbN2XauILxcjDF41cOXMiYWflY6PYO1OX/b9/rdeCDdw6Eztiw3JSgJrffls5lTr/sTrTX1iRPmBM3GPNYXlZOsaiO1t9vOFo8OwyNm8Ex7YQ29zmEmrR+Nj/GSlZDMBezETbStf3bwaA0Q44meqWHDKW0tBq0h+fGV1RDblPtboz+ru2fmMRiCUAWV2nrfMtIbsmLu9FrQ3yCQWQdZNX3Ilz7ITI3xIkCQBaVUEIo/vXRsfBEaA+cFEY0PtwPTRGGdYQng8KsiuGaNvJHacF2jNBFqSptNhqwyveXOtwh/3+QQLJkBXWSIXIlDK7fQdJ3dB7p3da26It333vhhQbQhAMXG7ePUVGmbfmAzaDrDWjny6fyUTsKut2DGwQR6XaT8RQnj8P/huL5pq5em6RjNM6SQfqQzkLhU1qMF4236AGdSUgfKL/Lo9Wss1/S296//GqYuZnsWGfRYe5Mar5as66QZFBiaA1olkGo/hntVhgFrXZuFahu1UUxLb49YlYNHY5lFVOdkdQbvumn+eN9roj4s3JYb+UoR8bgCmkou3WT0bnxPHAnDHZ4guxKmT0bn25waJ6tDkcA37ItTAWJe9uLpVV+9k1dnqwh08lSiHG7Ur8Alf16rXBjrjElf3kmGTirZvHcD3dk6lvDnr3qgPKFDx0JzTWIXGRn/AynCj27z9Bs7lUA8WI0Dr1cTVHwcEqWs4NiR7xA5OIJ3VQoUJq4k9ZQRYiQXzMsAdZSm8qYL5smR2sCnC0OABulEuutOSL1ZdFP9CNzNRWWih549wYZ6ZCyazYtnzYQQz/BdNh8zoCKsIOETBszUDZAUMUo64lYZCD+IO0lSM6YbQ4qEZpLC0z8V52nec+qz/Pgkz1eHLZtSWeNwFOiKh8K9OmRhbJxtw+MvpKthJRwcoyLZr5B2QT/UH3tOrxKYdwXe2wB9iP0/8Ttxo0Alr+VSqI0VmZo6YcSvhU2dEnwZp2mR9ZqZjQMyXciayFFCGzUwNSe72p3EL52DjTpO9cZoTWbCnJ4jhB1eFQTJlD/7En12OhZGvqAXlGL8Q08W7oYgWqG0EiRa/XkAXtLV+Axwq9MMnRMFjmbhHFDXVLiQ7qmMI5otU+ko6KUEMn/SphWaq92b4CRjJ3+syJE7vES3Crg/FlQM9EhQ1sVGnk3OUEL1io/HO/2t9F75w+uQHSBs3eU2Jvu1hD3Fqc+kiMObNZaNWwNEVlBUOl0dhK21XwgHh+vWQHXOlrDuOoY7MOGdFC0SUcJVf+2jGNyhu90Sqvh8mrZd0GJ/kQ8ZHoRAdwONsAnYRMRIx7vDQP6PdUjbAlZDvGJJ+Dat8PKKMOoD1uaBCT9qXNcxOx4YdllXfSAL0oX2SY4wNRjJhsEQSBePwoUxd34VCDcgbVFORWlGmfzJGmJYCM44ie0NXV0EjPzL/1TbiKd5vd7Tx2iL7No03abmMp3XULaR9t3SBNTpJ6NLCGURQrrf4yrdraSToKOwFIVMP7liWOWR+A6oQ46svv3VzjUT9mxlSVN/4uOKzqKSx4YBUpbxdkCmCG+tgl+QybiG+Y5a8UIj/xF/DjyGo1Oeb/IpN5+1N6Ot2kvrJr8VgWaTcTPeMhIWWfZuMjN7UtSZIxLWKsPVgDHofnxPeW0U+MImxqGHMuRupDZXX0znaJn3a3u3ltVG8oL6S17DdQcSJBc9cwqqXA9HeaJ/bZ68EbgD0YnpPgd6zMcVqU4hGZWEqSJAIAWQnKzfsrZmkY0E8tSBv2fwUyI2mB0BNOmysAOMB9P2Vv00y2h0C3JdCC52K9PAjLInkl4IFuEhwVDhsliVT0pNZTyqur01pZIJ74BtZ0NI0+bioJi/0OtBnTVHaXAooR5nCYJBx2zN/XH4Jzf1/aU9v2luT+nVCB67Mux7/7o93qKdtVCxlUetzwLmzACTjJdoMdPLbf3gOnK981mE/+CN8bW8HErZmm8JuvWeIudBsZzDq2VwtRjHpM7mkA59VPbA+berD/RwFr00ZPOF2D8TnoNwBcgBfP6PkA09ErNtaVxGfGCS3Oeern6LrN7AIPQJUt8dIEvmFFgA8hfr8x36v6oOu7PyKPb0N2tAF8XQyLdpH4SxZFCHON1hq6YkKhUxq3jWR1z7uWTVnRagXONw1XQKkF8VTTI7yXDd5CBRd7Ccksib9EFveF3j1BxiBZG0O6rUtdgP+y8Lfs3dm0WIvn3vYrvsuNQjc9e8xVM3owa5nq9EmqyeRP4RFUGeKWorklIBy/UL29iBPMYxnzmqAcK+HN8la9ZdYP+I0g6MXGdhEx8bMsmTi64f7Hdk/9lEmRFl9h/w0kmRxmRxG62D1+TIkef+WF7E9nKoNRa2bcT2nhjAFuEC6osxcQCrbiXSwOiNgI2JYTFnqUUamXJuU8kVjCNjFQ6Gs82jJieKqRTIav4DvHUjtPAXAFbWHcbgo+yx8puwdIwjc1A0JnilMABbeEf6c1q24aiaJ+d20DV3xuEe39dWE3FY/epGxT2FgJArs/+WtWTIMs5tM7UnVRlh/vVCXwIfElK+kbxtMfeerOMEa9bhwKOdE3XCu+E6L7/dkSd6/HOPRL1OrivKD+lEVfl586nUKFWUcBsY2/fpq1Sv0Mr7Y5sKxEYmSoxEGZh1OmOIE+YXxVWmUJDyn9FPZWt+Ai6KNks5KYYlCImfU6Nlr5wM7l9j0d2DITLZMEUBJQh90fg6p+A4FQ6bKtK7zY6I/8pK0QXE5Nt5DJiD6MiICCY0CtMw599m8ZjJ9Un39QbU8BTeNZyufaUpWdCgRVe9RWa18eZHjoOzkJycqv2yVSEtpuSqaRCLNTZrQgA9ldg0B29yxIkY1OsrZOw9nKSSCcHdUQqsx8rnf3pYH3G8123+2q38jNeyb0n29qZc0gvwDFx4A4FDIrfsjxsAPVBuz4E/S/pUr8R2hUQKYfJQ2lHp0zJl158GfoJBsNBmC3CuOB9kUt156A63x1y7zztF7Z/ptEs2n0CZiIOqVV/WdBZN3/+e4D8epvseUWOFEQ+ABM6erS2qgx1pXnTeNan+cUQV/rzIUy4rt+tY0SUmRjdBUHcY8VTM3oiGdtyaZwJE4pRDmtQHe8/pLVhb7dzxIQvbOnqnHuaMU7+gkkIf6BunPPEGSPDpwVCnLfKghQ5GgskYvzpuuSwpNhMtjCFubk6OmpTvItfaWQFvt2hTd0k0yc1I1aTXEbWd+pvxVClLwna30i5uVCfAkhRKxHXEeUupRX49wWX8jWIIrXS/c6pc7PSjgdAvoUPjoQ/ENhpMqzxpD8gjfW0CMgFZAFGgeQKgZYrS/Xi8ISbASegYZiNDBKRAG/XtTx1EsCYE7x0x5HAzVbfoBuuxWHBphhuv9AVxC85pUOzw4RVHbCuN2lWu0FyccScJva8gXVXEv5ruzvJ3bnOAlzrO+tQ2YVrGHI4Xnw/XXDYuUYCcMRRbdUCvFR7nHUiCnD3HoQ0XWedqGAQJEBsnQTQPDmvxdire1UEpkyZbH4wFMQhgQub+8To0rfihiK67RjGOZNF9nKzqpDRqxSjSR6AnSuyvd2b2gRbPcGBV55fjaRCsVY+aK1Qyiv9dpPujiqULhqpYiIgEE96L1ro1pXmMtz5m7T0QOFVie8ZuVenWMxd/qTROenS2xeB+QSI6YrCXb4yPsZCY1CCkC6j2u/L4BvpY1D3nsUADpdVhuMWVM95k0+p0M9xgVRgoPXFPmNfF1MZTUYLuePrHbNUKkZuxZOZqq4QP1hfYS9ArQgSTn+RDim1SXZU94Xc8FFXz3+hBgirunBg5AEPog1F4NTfFeE+8axFEPR6bimqjuc19xXfxr4kMfYKAcJMZceBaFMfEHuuVnPXQLSKIzb8LnKMsatuAx+ryl+F5Hqsh94+dmm5UDx+of3wQTv/zGe9rIfHDP6jxRRQ8YeKchEr0V4cJ7wFRhDyqa548kNQvuAjawrPnADi3DzU4RXu6Ra/7/oV2WMQiBvx4OeFEjODRUi93VHbMphEcsiW5jx3vJRE/aiII0k1awCWdSkSKdpUNunrobPzuwylK+qYQkFsQHgKjAU+lobVfOyugDN7pRKVO9+8s/DO671phU4STXBiuqVAO0joRypfcLImIbSPQlRWH5QIHqeXnzjgBrJuRNrgy4fqlv4IiNu0BgSdJVSCmCnFZbuxJacuElsMWHw4TwVZiMRa72tQOpZK41dgq3kdBccx1AqUCezA4pqPiliuaxh1tRu/tFPpEbwujCQcEaVWio4rsYN5O80aIPmWaAF7MZeF+laSmdu1N5nxDJusO0mPIJ6c5WB1HfStZyvPtDVeoZMbezQuR0T5UITBssupWpM1fnRa3tPTUp35IU6hDt3+zYKNCcBagLgf3u5Ru7yNjnBUoVQOvkwEfJEsF2STAxQQeR2zE9DAPA4QyBOwXMlMpqbQW0sNofK3dyWYxiQgcXbc1aH84MZad2nZDzPbZ8g11k08yGbSOpG8OqsWf4q4Y3x3kFGCL/e+7Il1xD1JpGtd38pZaZbmkfoTugdk2DCoquBVMD0ZhzUMzfkqN+4mJFQYPwTEmCMPbas5+UNXk8kVjBoO3WKx3oz1a/odqXixIkKGgU9IzsQ73s6JE+qfDu+jPmDoatCJqc8i2oTDGNcDFHIWKvDhsPo2BXDfyXGHhLfU1Omkqdtt2BcxR64FvDzy1wcO3e6XEaSWk17lPK+dGA6TEvQZJXdZcuRSueBuKqB5YRtao4Vpzu1QGphFp9zSRGS2S8dyAA6pK12RlSR7XPX1mDyyD/W2kHawHnjJrKxHVhVxtDfA0W/Hm9peiWwNpbZBnuyOGE2TzrNlBUbWobL/tqj3QMj5CgbmYrOT7BGIdyYOEkc09UcWzS1L9jP9WU1HmIpWoqOak0+A2ISFsoO0oQDjVZMcK03tZ2pKRi1UUkGed3rLR2v7XD2M56YTKHVlPgVaDq5BAnOEeME0fr7C2GDQKOZOoSgYi7kqjwYEApvYQw9X3TPVAHpTlq90QjO3aXxrtRHCFO5Bw+fTydb3zIMm8inpNbEVH6s2IfxIKsTTh4yCAPk9nPxthteF5mDSURJ7jyiH1AZv96pzxjADicSNNPT6VYA+Ul2W7elaL/8+J6IuOeSPpkKhUFyzfK98PbSNlBEDQKZqnUgpQ4l+vpswGAkoxrg4PLV2ilK6G5j6MuTlVQRoDL60dnUgMy4nq5YosEz2kvI9Xx2Mj7T+pePDhk//TzpWq3Uhk+eB8h52L/Tq7ZtU8iaP9nwQkyFxqmZuWU274d8noIzO1sO82SPI2Qaq2F79pMBtrYITQJQ4SeD1E/BZ9lxCh5fPdwoHKjw+ed2KXBQqqS5brM6kwbHUcgSIsx7mP+QPj3e7n/t9lmbF0p06cKWC6H51oYcPJZ5l+j//wcdvtZwlntkWUweMSMWZ2MpvEuEJlTjxjDHssxNpKzYQs/8mfCwwP2mHGsvP65WyqEso7n+ZXAY6VU/nsoTrFDduSTRjgJ2reT9hO+YpPqbyqv4uzJc7XK4y0ft4VaUGm38SDFftxevE5r/BTWDuLdWL4PPYvDnJjTkdikKl3BKvf1NNh2WuL7PsyAoaKSSF/Ua1RvZbyY5wfxiAh9IHtU1DMlAokoORvel/Mm2UMn7gXVuk469Gdpu0bzibHiIF+OfeuhXThwilUlZFfWsltqgpBf22uy2l2LVOn+X799QYOePW0mgyxc34bQtUSiCJXSG7wB9uRckrG9lzcePlvf5kZst7DgxIqsiJIYOVqoukdRSIYNj2VOQZGEODHK0iypKeyzkAy0GkwQLr+e/87njcTi0RgsEiqOqT/NJWPI/S5pubeU+arOmzXT7+lhxaHwno7cGS6gDNUmJtH0y6O9KoiTGS4fvqUfu3QQf5cAlPF5FSkbdV8bl5vLX+Rzn3IxHpLY5gdxaSuFB1iJxZRn6zwe80t1Ddb6AfTHYCwk8BvupFcYTyn5TY61HKFpZhlNdKDg6t+q0v0x8RdtClAHddhTy5TklAEoJGJSmZWtCzMDVxyfCJWO6HHllkGAv9oX21iGZaDVteDMMyCVrZq88y/kiMqz9whh+lH5a8qt/DCDlSIBQMGVEUW+aXWPF2oZZ+euu/5zvAFfT2le8D4hL1xghEkIxu1e3PNLb68t95IDRdSrjpDCTiSDobJnWtynMm5iYHxz3KqJlv1mP+a7IEGD613fdnebxlCUt7Q0bdpvjyZcJm7jXMmIZ8s1imncNvbccHiSLpKqTlgR9+9+1hO8cmKCO9O6N+JAreqQabvDgRRWYO7dQQw1RRWQVqw/0se8fkYbvtsqdzGKZDmX7IMXueeeN3bgMJcEo3yXy4C9OxhYJOdmfTMRSTYGt6GoOr1PUfKyC/0DZsgwqs7CU7HRGiH+7JhAF2Asj233i9LGCmktIgKuckGnxlQXquRaEJlAb8TyZLac5+a6V3z9fwanrBwG75jqXxYrMuRI6qH01qoRYSlFOl1OGLg+0nV7LYjcVHZB49YMxsGp0NaaogQ0v5DprA9rPqvd6YdMIi0phf7sXVbwsB+sdyWhXM7L9s9c0zk7juC8O4IfKIXsRRdlgn5FB4oBGST8DGP4cjjHmh9FEKb2BUMMRemcFHv9P8SMFW2WBPnma+DmUzyaHPZQWunzh2xYESD2T4jINtM63g1ZUyqGKwE7OMn8Zzvp9UKHQDOQINECOrZL3yo4gf867+MZoczQ+4EMBEVsgLVvBf4N5qFXbOKa7vjg/2Yqj3FA0udk40IIqI6uDyesuvWYd9SFnUylGmuBDViWUFGjfzZ+mdnnEF3nzy3ybv5MPIN1b2boa28JIcZaJa/8Em139QQeq5EFK3BmzoIE3mSBhVHsse3bLAtec92svFbqHr7ka+zi8oD4lXKbE4X3NVH2DmjOhWsmCuwNo7p5HrNnPK9xtWVB5tUXGIcpk9I/JxKauHtWmutbe3eD2a15FT4zZa8A0Ub1j5hbzwsfk6Wzm2xixS59M9Bsg8cKtZT9/4YbsYmVi5c776jLQJimB3Mp5/9BUxIzt4bKNxlbVFnJ5NFVCLO0Y9sBDSOwP4fUKpoqrjHALdYd/ypHaZU8gONOlKRtDE3SG7RGhKUNoxqS8NfVR5LFNGzsoqhR8vSaoQNJ4SSXQU1tYgrovxuRANPPcu/uS1v8fzIHCERvj0a962tXFD6ZsoJL16wfQRE0I6q30yoxe46Y7qLvifcUWcY0YnaYZwbUg0X1t5DRpxTb77sWMIXhBwCdwDnJhpY9otw6S06iR91rGUreHRj8pFws/kTMpyShKcRH4D5cGrnZwPZpjmiBRFfNud04UCLr1FYQuzLf5SERMy0yJ/osaMw+AZ5wvShbXDCPDuVr/aSfZFI0P2wPeDNZaP9ZU2CKK035iYP8I8kplt1eslk2Ol48RuW7Q4YmYxnicBoxUkzPNGv5yxIoExerCWs4h3aX1EYNRA8pcWSyd1OogbvR2DHlAmn+MNOpOZIxRIUsuFWrPhHGMvrgHklbhizU4VgLZby6hePW3IA1H86217G177/yEfh9S+F+8TkSM9bFxg1fWuJWz15iFUmSwdLdeNAqwqBeC2D+/J6jOy9iPGXGu3MEwXKPHw56mfLNFZEfzyR4t28YLeWTzu9VnEkc6Qt0R1TQFVb/VSxi28MHHEs+FeizoDHinZ5Gw1z6KWU8wLd6ldsTZiwH11uciga4x2+W0Qk7SK8QF5jmGt/XyDxDFD1VhO5uXf4yF9sBdjjUIazmI95KBrDl4OeejOs8S6WZS0wPRkgYEa5W4N0k/lbj4b90h1pjZGz6VGqmklSFbhu1+E/lbx+n+UeDmsKsEIrzpULemD6BzlB2JvwjlMsi3ivvxGLNDjn/w451qWmF3VTGHUq3xTNs3lz7kTZ7327SieGj4Td6jBvvhoU17/pikPlTdaDKwWikssvQKJN+rSM7ILGSeT8TsGcm063n3EmJD1SdSzwLhficmUGCd1fbtEJPQZy6lcz4m1T8/Ku67xq91DFNob/+VaWnZOvl+fvR0cvSR4m8EX/sJs2lyCLid7yRa/5iHmW6ZpphCUQhTukk9XNP9whEjP1ZkBGMpDrKFoFuKDfQDa+t/oOWAkb3RvnsvzTKBVho9Ecc48T1jTKZMROyl4JDWLK4yj95RFeaJWzGjZIWxt6BddUxeU1wl+SfVspacv0NeV90FlHZcFcZckRIGWIyr7GNM9VTdKP//N44hunkt8kddwe4s34iJZuOQvuFtCYxxLEC/4UuhYkdWDV2Dl4LT6XWFrZ1hlGaVOLPm7rfWv7jh3PKVDoR7Ml2XUaaoUw1/NZpIKE1RFMF6fbjGOtc2YgHX62/tsxQqJpM8R8HY++utgYCOyxV5XByD0/jMVy1Cd8OlfnSdfOfZB6GVdindWfn7Swgj0f8xaoKaSNwboK5M/GSrvTAZODHdGjwEIMa/9i/xPaLtK3cwaHzPBH2tDU1IH+yaLtOkxByqz77QN4IWIWH3+AAgrCkjX9FGPEsXgCMo7FTL3gIq4KTMU6uGVbPAV2JzbttzdXqT6+2hfapBCwQLjmDIp148AkkQ8cWrLVV5gVJ02gWjzQ/vsC9LhSrd0JrWu6+Y4QMYmuMA5eraLaRh7EFR577tcWToM3ZZ0wt+AA9oJ+X1mWMyn3OP+HN62ORyXrDwS5lqXeArzTXk8wFULhV2bQ7LsZ45ArK+E8Fw939wecfCeJYSvmPu29CYQmPUNj0FJQn/1r71TupMTTw0DADM3SxEQqJp96bywdFFXPZPKP9FD4b5Ll+5TTHhSXkQu8xhO7rccd08JxJReNmyQvV7K6mAH2kujkTvqHXIgfx6ZKVjdiGBRejqYLvf1dE+IHO/N/IFR9xJ1/UqvfDz5uuFLc1M91uE5i1W/O3VgQCV/j4A0LSKnCB++LksZT1RvqcfHq+IXH2vsGo1rEzGHW86O/ybuduOTZtcwJRgmZw8Yaddl8tM7VwpHtXtkrIEYQlUkVtplGILkaOddAHS1LYFs0qZLIfeBJKlglsqK4qSY3hKBTg73vHZ0wbeT4xPdhfZJewHCE6XhmqOzf5X/ioc6dmg4deNaBNp014DNbJ9PJI3kn/Ymg2hZoKDEfIfFug37qKVJsF/evfGlgEoUkgz2wOYtsCc1fC3L38YCxOoO3fXI8foR3DqsZFCtvigNOpC1FsJlxNnliwfxh4vbms1fUS2KubjEOo/LBRz5gIohZXEMy4i1ftAqRViL30SSAWnW4rbROem/8w0hsUJjxoreEaKUcRv0jj4lkzLQJSiBn0+fwbEXqNg8b3Z/edpjedQ0bf0d8uK0eCIl07wsfo7gyId5/JLcocKRltwWPsbMgfDl3j2je/KvBAUgVOZbLDU7SllsA/EH9TqlsHeb78VhVkewLT/Hz+WmL8gSOX8N7zY7Jbl2VtG7/WX6xgaPZPtvO1RdUq9o4BU4bK8A4hehj5A/o6Qe8Xl/RsOgVrMfMQv/fDwoK2anF5EM15Y4rAH9zd9TGr7LMbHhuig8OCrHhe88X1qaCe37gCrSHhRkWFceAKOIYWyXMasEF/LMx42GsS51zfqw7ZUPXyubxz5kko0zBBbSX+uZV2Rn8gSAFUCsvfIJFsHKszdiLbCXTZgG0KEY3Z9svtTH5XNfxlxezuTtFXtkcnc1wb6ie9ESJOBh1LwVu6rzz6QfH3cXIipT7SCzKc8oxodE1Ket0MjWaRGTb52VlZF5c9S7RIqQgLRFTLeePA8vUFEHiJXyl8LslTvRZSDoVn0JZsRMY0w+za4wBv7WxeSCGOptEwwj4zsDOQDs03s9xSS0Qqqb8LljBm3DZnrSo0ldMu2nlbtJU/LtuT8Abhuq8t2OtaJHpa9swPPAAbUYHuQ+gMWznMJmUCZnp7QUWAr6z+Swc5V4TZ7zcayskN4DpkCMVVORLPTWNDFPArFxhUXMEcXR76CAd7674hQ2+Kniei0u2klpF6kH57k8gQfOmRkwnw70Puc3mzcws70XMBKNsyWGZ1T7Sc9T0B13p/1fJpa0Sn18KGaUj62G1BZmrZrPVEXqIaK4huDuBCva/Fx9Go3ZUaPaUwscB/wRke+KkZg+YDt2bIVtjzRvYAbRMQfyPhTdjb9vHoZAbISXzeK5pZyQK9xRm9c0P2dNWRP7eQZmWWJVXGL0lMmoOd8RNf0Pc+O2BAe87MUC24xuldLylizjWvR7eb1QLdZb2nmE3PrxwhpbHk4RWH/E+sPGB/KHNbP39M4Xx08Kyw7Q041btVl8irn3UFV/D/KZYfFZo+Rn3ZHJdm5/i9IsW/nyTW0f8gQVansiWz8/OYrxHz/AtqJzjAc6UdiGqnJzAysVGmTTZCy9tnnOCjcedCCL83RAGa9pQVjvcPtKXsfb3FZ/mkXYdI/qCbALSRq40N7HcQH3OX73skmts7qSRm+HksUDx9662UWTMe6BHaMtYN/1dwN1yjWbnjJ1C1Mo6En6chuvYmF0mq35GYNa4zOPGA76KpilE+aaDLPvFSAEL+uwU8eUveSmboB9C5oiR5OCFnoFY/FPupWrMf4p89SyvVr04iCi252iy82B6CGYXIdqcBDEmceQxs1Vmn5u1+vNZaII6fSadqHeH0aiu6mLFusXpWCclMncEINipgXleMAgyo6EZv130JvM+WLtsL5IQFPF6Ooyo8moyVbU7dWNy/VFg2lRQe6HK+BkgqUUMWairXnuGmPRhzw0LW+hlNEUt6tcKlHP+2wOrNaHjJ8ONmiatlaDx24RmD9+VOxLnJsrSnA7BpBn0spnhhAIXu3wfb/+/uSBNOL/sGbtQz4/cwtjMnGu3sXJUV9LndDb8GIOzF2O3dYMBGDMqfudG79SHUILRi13kmb9S29zkSrj+XZfL7fbaua+3kO7Lb+raBnrGrRw+TdBznFYuHU/+G6yc7F74G/ZF3G1En0OPkcK22TJrFfnbhZdsolLCZgiTu/FSoKYahngX8cIEYumWM81j/myznK6CA5mqkMqOgheSvBQg/KS61QYWDYx6Cu9TeTYFeW11zuOelt/KL53SKdKw3nC6Dzu+4XR1JeqEBrkXOgBMcqno+ulGgycANR1CU2BoBVjs8sLl+xIRNKJlZDil8AWMeJz9JqxHuvnOmH6a3Q7tq62Sx5urxqJF7lk7WPu9c7WLFzVJzhnKlembKG+GJVCVpFZzBC6yosKMFEnUHceknoMNTDdwjKsovNgJkmJCTN97FSm7T8ZcCHO77hHY+/mVHdJxQSQ8E1uwZGhwN1krWF1EOSrogS0h0Z7qPdWsa1bR69SdmJkf3xmOL5hl8QyOuuMWd7mOgIdzBO8Qrp7L3cyO0uaDHu1yL1gvFOtUZnRSixdH/hI9MIv/ApcR5DcAOfnlsruXP6LtAbxS+nI4v3oMhAB0VmCXH45kGxLHO2KoUWaQuGPS1q+0D1hf5n++3lg56CTTi0wVuH5uAIj/RClrIzKs6CiXY/kP8+NwlJffIVyN5cg3hSHRb6ZFnKl5J3r1/Byy/qjRnQls4ub2z+lvveg8ih7zMnt/desZ6BhEtZRDu6TReQH3fv4qUBwsql9w4rbKZQPE0Hw6cdHhvwTmpmPUT7TCIIoS3GCqCih6QxzNcCfZH16FyLM0B4385shRD4nkkLRTBP200jtYub/E2ZzKPMWAjd/UckZTDEWnnb3O/SHPZyX3uTm/Pddb9QxmicTbjH4tktA2jYNj7HhuTGVou2qGIX7Nnk/RPMHzAOqdXvU0SewtZ58tHpfHcEJVQqwads2cDmLqShnOIY2R+8W8gQ9daEbqqSE4QMJxa8mR40iPYjkfB/5naVOg13ZiTWxt54G4y21mgryKm6eO2gIXuRhy/mthsoK3vQFrM+GOXMDQQn3kmY7FDt3U18pqm8l8t2Rc1qldYAM+HzDBnd3Jy2d1zpWtglDrNpqKqE5RaTKrVe8DQJ+7NZ2z0UIcxhA31aHQH9QyfUx16iL22d0iUfRySY0RzxXQxyswS9yP4r1XRHMY5m6t3hDfSwTRH5NIgqz/JH4ZrGcj8yevGuw/MzK+BfhYxacbwBY81PkUpHsSBsiTGHnjF7iMYbhWmUQsc0KLdtAOCV3eMYLnuqACyrZ6EevjH4R3UZscUJLBSKQz2q/CYqqs9eo6E/AuLwlG+0jyRzLBe3z4IljPq8DrW8lqb7j4qkcF8iMN+pnt/BHwI/mBoLS2NiJcv2xmC9t0tS686HU94cudeu/fVDReZmgqWSUJekAifh1plxxw0EAmFF9qEZk7EptFa3GLjJ1V+LeubQ1a5vSujeRPUX/mqmwdhWJQMLN2tvFRXIL6MVV34dVPcl3T08XCjjMz4Wz/IXiz9uGXuEzlBZYytG8hyIbXbqJUoF0yK6th1TuLlU41Wye8o9eULFXe8dTstVO8jHNJLTboXb6zhlQWyk/q30av5yEQa1bSkB2gbHAEQ0if5TqT85gvswnhtoNIwy302mwzvJ/EJCw2Ql/w3+DwHNwNHcOrXoKt9iMpxnY16etDFFgKmv7aWc5nfEZ1xmctjKx4ZVHOtHbyNBmwfzl69Eq0hkDEwX+RGcpBeWNjXIUFbSFm/Sr1JwbnaihgphglItyS0vhyjeCF4DxVM5sy9U4nBlRvd53TkQZOZje823HeLd+WoQQIUK7gFGG3CYYTONXk3tAzdxM0tsWxhsoqgBkz6K9ycpHkn+Sr866pm9RXmg+5INWj3j0C4bySgwH/f8wa19gozSpeoZpJZLgmKVi5tupcWZxafFB/GgJVeSwld9foVHRJeApUiOjPM5KRmJ+kWlPUYYxunBcjMzpuqcimSDqYiIUawe4qnM+fCaC7Q+Vre1PAdqGNdlOZ7VJYRJ/qTDkC7/rGckgknHxwlOVNe1z29mYjTYmzRnESaHlCKttojC67uBLtzc8Xt9LODPV/WIm9nhRCKDBlaMLO3rSxusNmqkaTZq+o/Uejd4Oeaxv5mVpPCkiIZB+Lauj5f/FmD7eimAdyVtT5ZdY/YOzWg0E6zYY/5ZX51e/II2QhaFJpw0fbO5LxkyHCfuldLPyMiR0eWRYVdIWG6oXyp6d34kB87/Sf2BGyc7w5UzS8MoxgGizkO7Us6TuwlNLUOHtKIna8QqHp/4b6BsrZU6KvoPjf40CLCIMlHyXb4XPqDcSRp5ZHyyKLyDMbBDkidDM8+g/QWsgzy2T/ID62VfeNqsPNrDDewBDK7cBtiDjo0xh6ZALv/yZwLiHqGbnd9GSjOvY/IBhpmCPiUk8Ia79YDkaaQcHnUBTv8fu15vEZiH4jIoD+pTAwqpWntZ6F3NvEi+WGqUL1Vys9cpqxEBuSTx8vfdllablUeHUFhRD8dbjeotv+HLFSOslKTn4dD/8WH2xMacr5QVGAVTZbZnsMyLe9Ef3+teE0hb1I5G4fpHyUwQ2x9vGnrkHKZlYUbpV8CXFGvd20scFKRAkACn4Nqc7aGyOGd+jfduouRTnUHRQJ7gR33rjXFAhEh86wbdWMsjaWZGB6DR69zlBLCQa+Y1klMAv2wo+PVUP6peQ+aE4c25C+DiHy0/GTgE287qetY3pjPf6bzH6IzDAzXMI8AO8LkxQlqC4EtYs7SHY3YBszvJzQC7UGZExbm5845QqVM1GOiIAXCm+0qx6iNwEqH1VBNnuC6Ms/YZ3Y3bTD/vSUmGQi+QfWD23oA9vowo3rIZNv5VMeBq0st2U3G2eLwYJ35B6ssKgfTaY1OG0r+BQT7tWGR69sVQUBC+VFSQC0SHlgRAsTCJZT6MwQZmPMgHfNeXxoLGhYpjDWHAUCEGBj1Lm4PU6l6SMA8R5iDozRpyu4oXZl+fo52JwbS+n7mvfhSG1xcwDviubWP2a/Wva9BrrYWaG8tX2PE9bwmu1p2w+eVpwnuyyql1adMFR16DQIaIFcJOmPBulrUvb2Wd1NAw7RpGMvvYgkKlFMmT6bF+2NhhQer4AI/mCYLk1UHJzK/4w+92kSKa9w9SK+iGxuj04SaxiKQtmf3TfuiATiGOo15PVohVqRRpvXk8hLVigP3BSR4nqlDWQTsIdLv2l8jY1F0rImso0hiJQsWcE8ikUH25g1oJOGHybvIbUm5D75fM8leE244BoTKPJMwh12J9IYeJR5rJswSTm1G5+8r6LQnxaJoMuonm6BeJZYJNQAtb0PBiwFhw8ymLPlb7//oslLm9o1qSqnN5rNEASpA8YJHZdYmRXcZaMvLJRCgCrXaViHiWIUE49A9o+tQVRoUnCIoL/c7UDi+r14YQvQaiIyiPoXLKhhQZsljs4+PYjEPnilNA+EbYWj4Fa2La6feXV+lDPpt97o2BevUu2TwxnbC3DNFspnxcnj0ol7mAhgmKJD66Py61qs/RUMPkfZLLphuclmAGjpoE6gZdHVCBZYMeORnlMlxT7JSxR1TtFQ9Lq1hpel6kfJ/uf+h8PT4ljUGuW43cgLhQ4TLANSP7XscJ3+2MzvvN5G2oVBAbcQC//wREpGnnFLPegUzcgWlYkIA+dBgT+d91iv337gdSbZPNBSaeVsw4DA4N+xs/3dO0T7ee3hLyEn4qKZud/EhZsxo2CL5n+ajugKQSv+D5mbRBuVIr6tnNubRlGsC/PoudvNpBEbwXuGWUViSZbGXtpLnVafUhXia3k5lfHo+BrlZtr87ZXtHCKZH25IsuG1z+XIkZLShhoAfErATetNzw6udutDpxPnCeG/v/ZhvZtqNfEybdD3e7Daop8oYRkZxbGV1IRwXfIyRUaSyrDsltq1iv13JJ695tBRMMqKkrudHYj7a5gU0hbpO9PNj+NTZhiJLLo0iQYXvU5aFstmDCaHrxk9KEjtA0/hoB5MBcsVorNDhvCCaLg9sslx0axyYXADsNw/ntJ7+ud0dhvoNEXyzqXW/g7bREom8gXRU8AJdrOMYjl1yhzbbpWQBMzcumWSrxIJjJXemprw9f26UUpNCgy/Nhc1gp58FQAe2RurM8nbySk01rmTTmILXpujwy9GLot4vDMVH+jk7sp+NRYZhDIOhzpdcYlXQcv3GRUK6jiK9tzsFsukAwq/AaZ+17y5JaNY2Zh71W3oNnFxdkKztq5mp43eWl4jHTnpvixrK1UakCyr68rF0GLuX4qYMYsKkrxwIi9mnFhX0lIq6e3cNYmTsJvJyzUA7U9qzBolR8T7zjTsM3APgjkZ+zqRydF65U40dB4eyc2ZzuoLmRiRn9rfWufo7G9JJ8qV1KdsVbEQ7gpm/AiBY54iiX3FhrkagU9KNBzHcvMjY8L19OVMJnDgDb4o+J9Bovgk7ZnaNDdW+vyEeoNEf3JXVqMRthSP+Pj/QVVmRURlos9EzeBOR2XaFiOT5G3bGAG9EZfC/A2VWKPjJFW7MbDWoXtfdF2ToZZtw1GEQSe2qBCkoiZ19yfyGV9mo9sWAJvmF8wklHSGvLnevTuOBNQC3nfYMjrK1/CyfbtRwTJLlxM++J+LQk0ckOdu5gVd0hnuecO7hNC+9DKkWjTg1RpmH+gF/OTny/3GdyOzcH/NVb5S9lsHnIb6xXge22x0lI6o3Z7s8KVkziBJSvYlV4Gr04I+74RCyTjOEbdZv7OHR1BzGoV197hAOeC/xk9HsG2U7kN7gQ3Kv3Y13ZKRZQV+IUZuU89uXET5MfYipteqCKprhCPebLVuW9yMmDDh8yF5CyAT8byrVen5ZFkqdyuPREqKzKq0qJ2twT6PfqNgscf90ecYPBeJG5kPa/E0eI8LjdF6j5xQrHRlX/QMO+82BhILCl03L8tRr7csqQDhgxEaeLfEC69SzCkhGAq1QePj41SLvs0oeSZK/hdN0NE7d9nfoKut2pYc80rEDR15UBdPa6J0AFNTsoYPQMphZqNnxiHgygLgReX7PJu8nvq8YYlmPmxai+Uev70rNz22pB2vwwTJI8HU0pwtH81evogVyMA0gpkcfuV+dx/JroaLAt3PzptiorIqIe7KkmezidEg4F3m+Nw4zS5MOZBPyEk1qTqwi88DvXVJ62imsWK1Rj9bNVzvPimdacz/LWVXEAm+2SWsSgp2cgFWy0U0AbBYW2QEedOwEy6rIMZNkLmjbyvw62u8n2JjfSMWCsZihf2iGQQrOCgYxTcZYFQrmKWvMnJ9QZJgikB443g6++VY5EBvWsT7XC1t6/7gTz+XUopTwWCOiYbwDts8XF7veMVod4EBorSl+rIc4A4WbCcMQBl/Xlqb+k9UVXT++qIuiWqpNoCnvNGXIi5XdaZ4x82f8GXw6Umw96eteRTbkq9R8nrBcfj0QkwDlIvFBRWn909OjUu+2KFzB2sxeXq9RDA6I8M5IVkhoP58Jql3AyryPJZ+Eh8scjK7IxIRJ1VSnW2tuZKtGaocXS4P8YWwdhGCayqNXsnyL1Bg9GtF2a2nt1MR2o6VFaH5Lt65byxXVyuepIk5Mf6+0S4r/89CPzcTnyR7d0CtiroWi17KzlLtPgh22jiTi4Uj8cpJSMzRLPvl2xqCPgXeBh9Q/A1U/M1vYCOiFw+/D/X+ishfRAh7SLChAX82r94CdQF7KSdvnPOOw3dRUZMTysGw4If08/wKfXvjxLzTkFYSdpdDhzeSoioL3x+Yr+7We3bZoZH987a3PpVx9j9Loz9rjMOUtbCSQ9HWDBnrul71QCEAnN9Q2RXyq5vcCKBEZakdr87aQf1aGwRIwBnnIPtlqP0sf8hDYoaW/xq9RmK+aI+dsguaVZPmYIG2WuQGDtL/noujdFcq6cZbYrSEq+hOBZVACLoJ5iZLI1eB9TTz0gW+QfUoeVkhMF1mjiu6KmqoO2raYt3N8Hg41l42js1FPHsVmBCYLT6usKu7pEMbKFpSr9D5iLnT4PQr3A3bZfy0NcsiA7B77nFX/tqYbfUNY2aNWH9Ej6oKnMEOwCEYIRjwcq/2yFodNPag6JmpVIvGXtNcioKHXYYhJMgTrV8JKpn+NEWi77mY++0PyF7aQcaRi1qy2GRC0VkiF4FRGdNaJYBjt4TnEA9ZYl7xBmEQ0Jk1DvORa5rQeoupwl/f8dYt/VjBRosEuFbap7t1O2IeeL7728qdo6hPYjjVomVW71C5bcCogQ5i+lh2TES1Nk4eV0iWyPXAFl0du3gItyAgSa+G+4zIE84BSQDmfOAW4KL5YlO8E7zdE2E/tdHVP8ppDHY4rjea/14S5TJxp7GAdfzzvna6kpyQyqA3ZvRl10jYKEpnEGpAa6ge89JuOKAO61W5eMClR6MJPcGZKfZhqFCqgadn3yQleGGo2bY9zlCoIk2Bg5OpdgujykmNgs8HlzoBEPmj0iHJ2AV2dy68FDHXLfqr57VUQtFolU3YX9bM2Z381fLzsnao+K4cJj+ZwYf1mmBVHKsU+iWWcp0eW14JLKzmcvwCw0numJZt7mqvDfQMaFq85kORWCXETa5UDvMp6shkIJJHc8CU5XYFnGUWjQodXXiRntUiAHvuLzgPCZfccCPxUnmFfs+HWBLqFpqR7qCOC4o4l8vPsv/hCJJSdHxDkMpYpCDF50n0tu0dDXDPyEdlQG7EHgEEnywbYW7tFMmR0BSw0Tlhb+vn62mpoQlmz3cJOhLth5LCXzyvXtnP2+h5JImxnAlGf8ZrfhcsjIijrcnU2DsaoUrvm6ghwh2IOLUwWlg8ieOOQeQJr9S87HhZG19DvmPNeIZ2hSVtAYhTSgKHiSoL41SIHhTCsGY/OJVR5dFSUnHvlKAdA03HYL1Qizqbo5IH8+5onGqQr6ha5jO0cBBEzmZtX0bGnF7r5z8PXYXRLWWQFJAmzN64UVtaSs4G7Hkn8h7BILMrKKPCFLjkyPacMh2gVX3DTfd1vQgrq8mxUoZptPAsDdR/J4eOKfYMyEWsV2UYIsgAqEn9AqWtjjzsWs5CWH5bqf8KEKJKB0jqP1kS6OrnFNhYZP7G+iqLVBuPpu21Ov3CWlJGYB4u1XZuBtv8LU6M0gadm7QJ166WblGCv69TbS/Nl6fy3axSPcaGjQhAEFqRe8xoyVZ7FGUej8zzR/2kRQSvXno0wZ8qPAq0vIZCj5p2N75lFmXsIMrWVeVg7hu92z5JeQM+yG0Tn64D5PDmrVvuO74L+yL8LYBkZVmGUUvxX+MBpDxVufpO57CyfBU213f5mHLHFFNHJ+LAJgREAn6TkLzqNNGS9GCK6P8xUX14wjyCvfOW6hCJmCBUwcnrzy0k7HHCwymr45MS6KL7TiLAiDyf5qtX55UzRFl2upeybGh97+AhH7VrrprZhWEW0pfZH+oOmfDtzaGB2KtcWdM4GfgwmK5piudAOaLRdhRl7d7kWq+63htMjiMkiOLqv5vFLPOyba1J4wzkTl2jWokELf5TKGu3Bpjw3mNlAdmPI9nWjlO7KlSKmxVQ0GN1Ij+euJCbCegQ3urdNItko+LtE61fZ8AOH3Kh3vHkyxDQUAk2Rgzt11n4DilTcBwvP56XOg5mNPZuO/Ll0QUVI6frxV4He8hI4pz9sQ+Tt9T/ta56WZOx9kg/DrjJddTiRikAGuBPebfkBNHHrjWgBO8A0KTTpjP/oYjv5dr7HKZaWJM3Znol3cVhOLCDkf8NTMjjmygMw6Q7i6EYarElaKqXfRL1VHkclBvpyqRDV6ztfTp9PWsAzIN6pXMXxdMr1+NBRXKtfWyBzQd/WXZDn0p+DKQpMAbStmYDcIJhhZQEe/bOS7byocZr/T14Wm9gCULAnJTsTt/vbDFxLP7OUPz4oB8hOaWNTrGTnQQ/jB7/bhaZgv1JjutzECK9Kj1UiqbPdeY/kMQwwYO4SZ+sAI1C0Eq3V5Us7wjyhjvQ9rw9QZndRAvG6C3Bl//7XDdmssVxB3UxgTQraHBHaWz4oq60cGBave9UVJNJYq68dvcL7pOE3pzh/n7iRCiSCZzko53qSuL0ugg0aS2IpR/qNkAxTO0U4P3x1Xyi4cNxXpDVxI9bHmX+rF8nKLjL20QYMK3op2Ey/mxOBqSQq7R3ugLLhQAgstu0j1RzWiIceVQidcceXtIpgN2dLs1R/k/8BORwAQauILWG1xJ5bdRJfARB7KoQCqG6rKkJ5QT31LA3mkOoA5RF84U2ROVI8bGERXCRLIVSTMUjuEwg4YtjjutvKU4K6zmk6tySXIEE6aEG9As+L7QoGp62aPnj08vFgi/ZT89Vv5g18PBFVdnO9S1e8cqJJdh0Kz+XcMR9WoICjNbWGhH6GgnQytUUD0q3lFse7jZ6zsV4MLFq+P/nZFKHwXInexVwDfHlMLcA4Uallv7XzX4cV/wZLv8aInFdNkqrKLmTSkfdf0zWpEA4Iofycq1tNvdHhlsa+vaXvO5Jf/2bzSHtGTtb3F5Ay6ZaEZBMdZmrmB+VtX05nMRZx1vk1EkgR7uJc/SlQvxHu9VV99kRpelcWhn3SoDNbthODt0V6dkT/TW3mF4lhqGNInZ0i7vvuZKumkGNSu1QMVJZkK9veUSfmoANQMJlizziZY96jM7kUt9FCei5NwTA9FA+F4W4llMjKiHyBQmaWLe9hUK01sxajNnlog2GGtGTCZDEh4JX0LpfdqlTsoRFtjEaLhpmdK4OqhZ5qyUb3uxueaHrktkXJ44z9lnGigeh3o8c+UwKfU/5e/taYGzjjK9+6h2e3Qi2AOZFHAOIUTNUkjp59YEilNEaw4ACI/QA4ZrHa0WQdV0oUN0y2MbGoP9sdyNuONyKz628DewcBo3Varh+tTyrypIZcDh8GUjlYyZYWSGCJr8Mor9VpneQpsVlRWw20poQ0H24ebus+t432r53kkXO0QDlikd+UUEbOEPTcncyx2f1ReTNQcG88+7/9IljkR9Oj5EiWHTH7Q3uQ37Thf91r1tv9Zs/4cDkuwtxBD1SAF36j+elAaqVnZ/EL8Y8Tx/cXMp2uwi1sk+5qhMJaHAi6iM3y2UsTTRnmqF4uzg1RJO6QLge6sPrym8K/O4y6yOQ74d5Bo5wLUNVoWVXksicyIi/cD5isUyC/M6H2Y/aqm6iriVKwoAHz19RP1TbxI5G4i3Y/2ccq9Q6hg9xF0HCHHxjOiIjfN3YwCCynD1FdoKjC0wq9qmPVXtuja19xQiRXAHuPIge2n133+dFlVu7dK9CusztauV/W3fembUa7iwatybvO2QKm4YkVsPGJa+bFQLcYK9KQd8fRyH1IaqqETWtvLA+Ecr4+DSBT+kHDKj0DTgZB5NJdzM75SNogQyOlWzk3ghvt9KEjhsBh/fGrbXrovr9D+JHCjsOLcYhzLHYYP7EkhuCOqHnC1itLBwJ5Q2ki+UCg0nnM0xC/Ra2d6NuUwRXyEbwEnwuj2Q59p3nMrN1ieNDqtKnI3VOOwVLxCnYOf25rT8p4aTTKBhmwjx65WB3Yr6hHSFVruYWwJakkRDXstSors0ZIjzKLpbZYXQLRXVyMZBqiOmin2b+1OiznORFuHoOTS0s2ii6nPtDKwX6zhB8J5PRhgppTYW7JQPInHqH7ZEXlYkFimjMWMiSggnD0j0C7wMsWm4ot/RRKBQrdzLlk24ZvyM6ok901o40OG/RSxfk3gVrc5CGsV17VLl4z8SqvDetVy6moXzFJE5F8f55/WZlXL1n5mxQHUapls3I3TBHRJ5pHNxFx7uD5Oq2KH4ADqh+DSMrrxnjsf+KrHp5z94bY7AzW7n5OeNHksxA4H66bUC2QhiMR3U2+lA4ZC5Kt2vGVR8Ykms9D9u57hOAbsYomfB0DJF2PPoorTFcCSsiZs5vHdRvdzslZJZD9wnZR4kq0x3JwLAi4gBMNyYwfT+uI6W7N6R8f2y33G3DHHVWtK/HmT43WYIK/wAmw4hseuhL2qlOcuruj5Soi2EE4+vZN8momIu9dDBg+pmKtKyichpxm8FbbuZX6pUORgrtlkxceJEVvn+IxBnP8TUVEd7OKD1XoRqwWl88l3J64iOQYjQXwDe1Brf75nv0OuQu94JZcN0oRfhMMx8PwOmUSEJYCEelpQjmpG7Ig+8YTAGUC132bL6gr+lAMUa8/QnVLeMT0Ceb+CFTnBXwFymeI872s1FP7jbjq8qafVFhUuBOjdLpDA5ehIiQR2WxehwLXrxm2Vdn166AwQHqMALUMwyG/6Hb6jwNtokK0ip3zdJV5VgSbWIgAQMTPsAiTbpootl0ckTp548Xo8OjVnCnA3wZ1qloWZ5ZJMD8nDRZIhsZOr4zDzEOy0gvKXYo1impwPo2T3qNR4d9yqYb9OY6YzmJ++v4CquFwopRPfqcbCzww7LS5yRXOa3xA0QGJK82VkLPFNBg69RryZmVjHNpm3fow5oSsftmqsw5/NKYAWbFdLd4cq1Q1KNnY3ICWiJiXxn93K8m0q+7WZZ3MbTsPw+ODOsCpvMjXwPx25R0MedPWnvAm6N9+Bz4JWj9YUSyZzlSFcjfZy/9VBmTXZj/Y91BHP/IED/4hllBmbU1IAXE+8cdbTtQkFUcn3T5jYPbGWbm1nWafHRvIhyudZt/7+MjV2/fPGbom2Uthrt/nL5y7kPYuEvXHozXTlFm343Acam65mpQWVfOScCrQXei2XRiq9n8322oWG/e/QOU/dp0ts0SMozd7ViSmh1/iX6WuHdZbhZaKtC/qHrk0xiDl+YSWG+5m9h2c7fcxKfRm7YOesAPw8vV+mwCBeozURsQgR//q/uB0oTzzfKh/77ljzNnAHrhD5QtimdTp/FLa7VY3/6mF/t3+SLvdHAOTVfjSszPEDHbvcTik/ZvGx0e+tMKVn1BAsybPW7n0upjPET15fwakSmFCVUTJGviDS5N/A38wrIpBZtBr/13nH4ZatWKL5QzJA6DgOFVLVNfSdAhgoot7mzJHPnXhCtJQkLtSLDM0qUG1qmh/NKobEqTeozjeQRDl/8pQ5tDoauVSmLsLWKQqM1/8RRCaNKUNIYVfutrneew6bxAFyj6d6ml3HrBQ7XO2DOt0+o67XV9Ta82pvWuzG5zwN59dnbv7qdJECFEI8LDez2H5KNNCXpDL9MJrKTbgrBgkVeSXysY+7MPEo6HMtAxckD1nXAJWzteeQ3wRhTzTNlzmO6vTl5oGlDpQwnaHDDa3DUSfp24P/XrkZEkzQp2crKoXUmV3ilsMPXdcWfuiWx7iAIko6RcwN4oGcGWQnpc4cKGkCkE3mv1hePF+3kkvVkO5CQl9isQUd5m+zKw0zNjHFR/EG4Yi+etiFJBezWQIKETJP3zA5yvi5QKVVDxLiY/ckmFfV9UHMP2ZwIqdMuf3WDnkAHC+KB8ARbkvyNyD3PD4/MBxSCm9zZn82ODnh9RKM1yY4pB+h80ysv726oxk1KexpTegCGPUw9lozAzvUQ3erjAfhq0NuHvYGVmONirPsxmaPdjYXXynuRj/Ip/toCEV+5nyq9oPgwTPzx0uObIoP/jXziyl8o91joyKcR18vR9g+jpBKgdiwPN2l9UzuGHuQJ9NJtuhsUNvr8JMprE3Iyzrp0IxpCyBAaXPSlDqBI1zhrwVttAfM5A22eWL4BTAEVfbcqwT7nwVNRKQ1+gjn7I/8BwWJpCOu+NYI15DxC0VztfpukHN1NfiNNKB+zYRwH0ClBzmFkXsD989sS6DXY/Z5J/9/nD0KB4cmcGpndfaMnOD50sQFppMRB+nSRf/IhBoqD9qEf3l6Cev2/4V+IZtX+gsMzvbxJKqjEVNHePq3JV622/tSt7QS4JwHEBL+3fp5vCXJtuJgjHp431wTDGeuuzOd3SYKddG+SWDHgt1NCulse9XOhW7qXPnb8D3m+hzoHXGrJ0Hgi8k7P/fiuvHSFtzAJqQixulkaVb9lMfjv/d8lWdDUPcjn8p+cOeu6+09mEkd4f9WJ3MMk5ClQHlOVYIkRgjzxeR4O4aQjrGoCGZzfx0wltu09FwwDylGr+ikTkwLvgyxtr0uCOOPcLqFCZ+4r7izyYbQ2zb7E9kr34O5KndmFRvYHxRf900WxyA7Lc4y36Y8uJh2hIuEm9rnMjQXd3eiYlkIKX5ZmN4XhS7p1bQhSccfG4Gatp1J3RRgIozfSAqNSn8EGVfeJXZDghJi9LtOnzxRQYTkBe6y9kY7jyN2yujJqMyol2EKnBtsEBpI+lwaa751vikjA1uZZArWMyaYCaDJlPf2DqZwVoiq1adXZiDOYn84SbGyYrZxlzqp1Yai1RZTKHENrXT6TlRpP4/zV67wMDmhaq7nab/0Ue+PMsomNfwTs2wf/QJB6qDIVl2e+9kEDjxc1E2WCx+eBq9N5SJPxtCIKHvlft2VYk2Tc/vKAHucQfCoWGyZHtTaiZIfUlnTU9jyvmw9RFnjfz0+rVenAu84upz8vdH+h44e+JaeE19hkQ/rpP5tPY6l02vgTdG28Zji7toapqqLfWWKWFsIH6Oiiv2pjO+T0qOlOLLJts87OU2RH8ZPUw3z0DuV6vlvnnB7waKo0/AcDfsNFJqjPTKBS9PkMU7MnIXmV77tZDRaJWv+U9/ZbcB6Gs8urya9vfSix171sruEFRhn28wi/M27kP7UOjKWkXEqMF6YptQTGU2/+COY/qAdWPQ7gHzuRjW0nKLMPATzHSAXpnNxH4RlW2k9aZmPIT9DrGs4Wgxd7JJObXrl6adTbzzp4DsB37zXJYnHfSc4TG5B/z6mC3IXkpbZ8CHH7AyJbqlEllLpZWXpuyeLg1x8JzDKPKlMdc0Z8fMtf8oNzL5PahA9RaKhKe4Y6nYGUMTI4RykxMvNZL8BmcL8r+j+CLhOwffiZwAf2P0xd4HvJL++h2HPRpA15NZF8VuEJ8NyPj+axNzrFvodJ0L27tYhBF2fyc1idWM8JYV8ennk+LkooRqmhL9B8WCbpVZqLVPC4OIgsO1l5mkE2b5JROjVBx1cXbbOkuALii15gPoMMf8Wy2BgRxtfWlF5iSPLGAT2F+/1dIAKyzFXR8ECRzYebyyCDY5pJCbCUTj1xkWxHVgAKoOmBq2nZrjv5JJn0qsvoVqvK37RyTLakujBBSPx/ZoXDhvmXepXiYjD0s9kzMZ9fs613ciJ4r3tHOSrPlT7a9EogQSBgimlM46oi8G59/r2IU/aj8FDikJiqgN3GauAaX6soFynxu1g40xuTyufMJ+YrPxAAvpW6wVjWnZZXio7G7youfpDGS16wYEniH3HQR4WHjKO4oa2YHy9eJDlL2eKQK7dJEiKiYY8kO3nQl53AsizfPmk/uqcVelwathxKIy7raKO/fGwSMIClaZIiuJk+z17a8Mzyc5YHY0WbUzpjX7AtEQ2VyZhiAmkUfBpY/lGLar2eqAnE1L5kv2DNmgRQ2j/joqXNjXJYqihCu33zGBxU/i0YqHIaecX873R6HH2Pdv0qtQsNJewtEPNs3v0HO6Joocn0lEU7b+ZIzjLEKbQ34RFSUOiRDtUnYHCua97BBwNSO5Rlnt9+DzgmqcMK7NRWcKx4m5YB/TyKWs8I9bN9bsk5K5vExaHMAfUiBJDHUDaE/eUh3UVkt9PZYuImyoEUfRXhJX30ZtqW3XCETORzaXdYvTJwDHnf7PKqASuP+LwbXLkt9RB369MoKON2O0dpbkKVQGV9YmyO5fjt0Bkm+gZHKJzqgZ39DqtqXgINFxGK8xRVaV920O0FNmq+7FOGRGhAy8yYLa0ZaWSOrlhkGi+OioKGqyTRsbQVilX/bqCjGn/hPuXfkc91YC8rSBDZ2vLfeBqHMabBVmXP5nShrH5MBePngVKWq+oqyREEDYS6K9Kge6nyZwcH54kUWk65AjWeZZCyULjAfEUep4tduancPcuVWRR9H4Ar15rlS6bjDMafmst16bJpTGicH/mnyfV+Y2exydlz9hFBbhNvhwkMz13bGeF+HdOrYw/4si25xhnenAObbahl8ruOS4OTWPwGE54gmqBr7HP74ZpX37kNlBVypIBojZnFl4cIwNRnijhQ+CSha2LV43AhL+gllJPQmp9I5/DnvAYqzuwbqLv/RBCqiWOM178wpFWk4ov3zqBNglUXho8PMbs+gyN2ScgOVw125hCdwkm7XxNGYwZA+QA4iLmKHA+f6s8em4eOmnotW6out/7dEivSo0fJx1IjJuD0yHcDXbJC53bTuH/wbq+L/ieW2zn7zb7OhLkLRhTu51OfR5iHwZsQ1sCbv6I0YDDjOzM2DtSFqknSvb8qtyctJWgAeDedRacNJHbmpoiIOouYUZBHCI/fEhOt7cCnygLGuelqeyfumVAvJpYHx2xcXLTtqYI87lOYDzyYxAR2K0k+bGzTSAa/M4mjFc/qkvv6kaCOdXvLIA3veV/9V7O/I4Ua6a+VCciYa+rZmF81Eyz1byTcVhVFEbbXaCKel2KTabVdT+MW525Tw0MuW0rGUAXqyYGgP0zpQ19NYYrT36vpyYoOpYeeBUhsrjHLs6kEPfcMRo+NoIxToRDFrz35MYLwtg9V72m/D0zYIDLLelO+eBW5B4JCT8utXqNyRgTbvQZ6T/hsKjgVS5wllPXno97B6gKv12sKmldah1byuAMWhRhSoP7iojcyzhUwHPf+bcriRjFxbB+QDoh6s0awKQQ3p/J4guNOQbmhQ4zij35fxNvWyWlQSxWGPZpqfHbAmpZmVdnq/zADYelcAAcIn5N6FYUA/NN6K4Mcs6QxYjP3nphKsv6BtRjEY7QyQxz9L0L/NN3vRuLt7JqlKHn1NpdrFaZoPuudMc7pIOFjZOkFyUyzLMWEnD5gO6wq7mynMm2FmRYA6ou8rGRq13o/BQMJm/8fFngOSiEkvMsA/lTSzluDuq3GRKXjBW9+NjItT21zGqQXVCL6icHHypCW+UIAvTtovrtMXmEqMmcqU8l21HTJF5DQIEpbkkRRss96z/UTHxRYdX673bmc7vTHhC0YDBbjrVa502m+lgnZTXsEnHiYR6G9/NwWJcBukbLZj4FqoZl6gjXwA0Em/F81xb+cozr8RmfSEQRtg9aZilnfXJ+r/Y8Oz1OSBbh9OCSIb8sxP/n/TRzaaN+cysySnmeoO/KNWPYtUcPikkhhY0vR8MSfHx4w84FSoGHYil15u7z/M2Z+RsKviM5At+Fg8R9fv9MuB/dNQC2NkXCgInT484WZuP2pDBu51z73IhQc2EZr9qEzNwGEe0lF5WAuvTQnoFgpvBmaRJiPvRtg8WZ0EFxIP3cc+TqqGRJiP8qCmp9ZLD9U+qysklYhjNbrdPCfaIJLtnbbhRf9JosDUw1L7b33Gn4eT+ZVDMP3f/W+IvUuqO2lWuh3cBypmuZFisFPvj8foXZd6/dnUH6kyRMMP6Ub7bM7r6WaXRXlGWk1o5K9wp+8KodyF2JaeQQcayXHjmhqhjTGKeBMoYmlq4INjLBRRT+JReTPRzF5onp5V6wl1MJLTI+yKl7pMoJ6Q3OxJVFNRNjqL7bULEQ4d8wVgYKzY6bk3RJ2o2BCozr5o16kDT5Sy7uRWlc5mcTMAOcn322I9bfTepAPyNcWiZS/dY8kR1qD4JczXmdTnaKYO/WYvnB62hB4affE4/ut8EcIKYFoR5zP+Dli6gtrZ0YKIX+ayB67EJ56ha0OrjYnV3lf4gB4K1WcNKgPocf0eVrcVE1abcmmAgdJuvOXaJtqUI3kudJ1zdbX/bPUX+y4L1MhAHNYo0Bfktm1WG7+6i+qnYjNClvQlThDI5iQoDo/BLOOoDpy15nUVQCXwbi1PyadmOisab3AmluEw+1wxc80pa5B9VvBt5/k82plScJh8ze+nxvDu5VP1gG/Tjlgz/8wZ5l+2QxGuN/0/f/OL+kAxG9reaI+FcEpPUNLSTnih5y0EVgILI11Fy399Rfh/PHuP8m3jjk1qWd/7y42hqi7BdLl2+Ss0+PV1ovGIIji/RrVTeZdTmVKuJsxqTmsbUL4wmGz5gH1B0exUpcVzebnV8AmDgn4q6d0sEcj6EBqEZOFGmvCoEvPduBvkewhmi/+KVN3v4jIkBJ7JEFKZSmg5m2adKTSIWRY6fxtv8bzEnLZv2AyRhArQrottSqPSAFMxH+43Awk6J0EcmNidp8vUA/xpmUh0tru7UnLWUbe7eHgLRA7XMeR6HQAZbZ8bcwrbg/N6j5odfequn3OJbmrUYrfAlXN2XQzNjkwDJfNU8scSQmu7dqFNxOeAizWdiG9uWDeRUPhLwb3zWDUVk9q4vQ96zbKKZP3KaqLAgwKR9m53JFD7nHgV7K9OBwcI31BKqe6dDJMoDZaAo4EQny1UBUv2Z0L8bFcxYlLJqKesHsf4Pc56vVinQgZmb+YGb7lKcrvzRLga1uP7ay6NIGJ5B6oxC9LJhZRXTwWbPi0fqUyzuX4oQfXHxsvRvveib1LkzCETlKLTdv/oyPucFu4iz7s/rjrBsc7JXgbVGKzmD5aFYVFobp6uzGGOgmZi1bB5az7j3IkRjPxqnIPWSk3+QGwE4ww7zmJQ7UR/BlkkBx5+t+xKXKebC65K+AQwQidlXQ/SLoZxx7pMnriaW3zFb7wJvpQPJeonDeDi3o+sRBLnIdgSdgxNCtctt/Pe9q6kirSjXvkotI73RnFi/7JQWPgSm4skD9KKwUXQxOA1BdBbXjoFlVTUgHkQb2yYQPXMw6uOFXEgei8wfYUwub0h0KT4wOI9HE/N4/MdKMUrE0+aXO4AHQq2gJt8Ag/SQHEnANehohSCQf/eWN7wuPzM02QmWduKHOSyhToNmBGmzIxwzdRt1BmPda//Njh9DEuseAN8s/9OomR7P6daVZ3v5GfvWqZsO6AOz03vuuGt9PdVN0qbdABeJmbl45eIJoLHryQnoJM+cOWIHf71q/+1abun3vwzlg6tF1ZGW4p/2IvWWUpeJdMEzeUueAMFWGVUQLVkKctvXR5gcuedV33/QwdVwm/NGJWqbBPMBu6VxqmLqIdUBP1GwJ47kVWCcfd1TbqKIfzZzYxRFbucmBYmVmx77oQyw9YTOThPZrJJGfHHmAi9tCyrnFolGiTzfI8xf1QI38XVbbzlSTjRnkCwcf3q4ygrzOemKQla/7SN9w0wehwpi2a4pmNZrnLG9ORDw/0Dj+wVzM7CGlU/7PR6Wcs5GMVdyM/QLVC+GIfgPGEIlvHU0AX/8lzh7zMnImsGuksqFoVhSgqN3WGMl2se6lEdQh+u5OS6XPZ3V305CrHynWogV1MhuXyRgCQTNcUg/jiJEBENVovig+Ln4s2okLxd+Pft7v886e5V/Ld8F9ZQg/rVAfG53l/CkcrFpgM9fQODQ7V3nX5EOGJjWSt37Vhhv9ITD1ZCbqMtFdg9oDZJ7iqFgEDL8p/LBXtla7cycPtgMtEpMZUMS16OqO8H2s/oQoGJ5iWoZ5WV7KWUS2O+Bz2FiTnLn0OnaYPrXf/2RvMKocU3LUwcQjjSuR2NcAA21zty7mZKHJ/vJcwws06BRNgfUERXZhJA0oylrSY0S0WdbYSZad7R3+ETRuOX2+x3nJzSmwqejyttP+gs2ew/oLXFKnjnK14x6IBrSHzHkOVy87Czgn4loCyKkPy/1tkkh4MJILycYKXQ2lQs93zWsIkzCSVetUB3u7BGUJk53fCyuWt+jpU6UchVlng5Ie1La1SQU1ENxoW+3vMqUZydv9Rkb1vf4s2xPI+Q45clSthhqm4Lbgw/ubg1/5kpWeUGsVMo5yyurtcLzX91WL+yfehXLbj9Ke9In1fVtkg6eg6XkrI8W/x/yWZoxO7xUEF7IV1xaAnQHMTVi9dwo9cNppm0Ui8sDQlDIfUNsU+DkLA/17heiPrnp1nqXla4Syz2Px5aRovkTImnYSztaK37YAMtRRWlAHbCP8HsKpMB9KAZg7USuttkrkC+ehLICliLx2lekySlxgTzxUHqV9R2dwRY8tXC8zaJoLZAnHUApdi7dEUvOzpiYFH4LsC/YcqKP3/t0/lAfMUQr7/cT738vmliNnzFfCY1kwH/8ZTQax2vAgqtbiLVCh+/fx/9QQcbAcY5GnG0gdPGyuT2dIhDDPEfR0/4NwSATEvoDEpRY2vq4L2nj9ZvTaUU+617wtENcbYceZHegsfZrTg6vRDQjns0uFygwFk5CISc34MZY/3PWGKs2RRK4gQHXsti/ADAdq+qs8WfsKSR5oAHPr6UH6t2oc1MHxAcHdQWWN+medUgt99kqtKjaqytW3N+eMr7rREQzksDowiSr5q4biHCyKEO/sh6UJ7XaFs57+clVzrA47mWhtNanl+hbWxJSa8tcmbM7l3vSxSVN7wwvh/JqAJZ4R0KT1nz5zt7tBQzHDWv84E1XakFxgjCf89be9Fai9GjRpQAkBj3PuF5swT/KY5ZMvffmZLH68WnIOxYaV8h98y7TNSvWMt7pRXADwxjMGyVr7yG6Vmkz4FxQAH4FOng+z4AC0hSGj5X1+g7WiVKZal+jRulOAT1PobVVVyNp2zYkYuv6c31utebZVLLELtn4B3UVhWzqpbYh6JRGGE9ffGJeuJl48TZlvokZMZ9yaeW5fycnChger1hb9ibNpeyvZth+9ib7uM0VQXiMehqRNcL1h+St/wbffxL0da4rmWs4S3isQ5kHGI/nzlW2OeQ0TuuPe+ndDbG/6fn+Lzrq6mt2Y3/x8++V8qrIQTlqkq6QptlBIpqHSIS2alM7cDWhrX6r3FDNEiiHZUpEHCofFxu6hcma1B4IKflFyXn1oU/D1YblUeuA/2XdkwSq+jGxwnzs7b9LfbqD32W4bdJ/oP6i5kCbbaq8kXsbQJ/oXqmQCQZfkiGvirNNh76wddMeQV28ICGPPiENcIPMv+CJrL9ns7/+BboTXZiLgWvOmCm7G3kc+xGRm6+M8C4rjncLPEP4fEIQxD78qQWnoiqiun5c/O/im31rgRs/C8luTvix5rk6t48jrXfe993s8dAONGMgPdOSuW6kuvYx4Hf2WlyA+0mGY97xxpQxB3o8EUN+m7gAR6NRcCE6OfQjVs+pJIweaw1jkswnYzrNkzZSuVmXC+6i9N4grdJdSyZRLX71rOR7iTyY2U3gPapiTyeT/yVzJNwjJPfHC0DfuK3PD9P3LEAkIwyXBfGcRw9moBSLx8m3FxjyeSYvCVkJljXVo4oMb/sIJgj6Ku4l/tlzWh+87ycMRFoJaEYFj2Rae63ZMz+7hgAszM1UsDtkBf6wiWaV4abKAo7Yo1/kdHqOo8/KjObgMzBdE7QSR3JphkzjyI6OZhASG7E63xMNdnWRblP3iWCzhWSMu4rPHXWwPZ9IurReTmA5tjnHbQXEWIb9VN89QWZKwRG+qEmCU8OKKNhEKeZXkqhepM+BjNvt/RMSdybB1NFazfSgjGlRG9sj2AK3UwaIHimBJXwOgDRe6WpZNALuNdKSybVJabHLSfSV+dBoYUgFoT3N51WWae1DkSeoBTmHmyMsExOOzqwPvbtqWeVGXRpvQ8l67NuZLAOCDLnUf9sywGLYf1obr3W9aWQNJFAbSUK+7N7sEN4FAkjJEIy0wwRb0dsgaAAgWyT/a2BmX7qhN+EyJLGYblRhf6/bMeLeEfIyZmsbml9SLEFcaZHN4h7ojdEOOtb2lMFLrSQBn/3m3FR51iGVHUJU/dSPJzrlt9uaCGZfcv8fkzAop2CUo8sapkDGldngEjKKofQv18QMTuuHvqi/TmGT0izKzBOui4Jnfn90y6CNx56B36zUBlQwqK9mhpHaaaS0v6MK7XKBPVW84h0O0G7DrRoET5jtr1Sp2d7DJidmdoctiDlccovMi8naSt4BbatMSVARkg8n417+vI8pI0Lmd2nWz0EqVgQ9Cwa0Ef/D+aVQlfkYIVVrr3V/biZ0GS+MD1LSRqnFxP/A3+UUkDRySNhoE44smqhlwI/1tuxYsdGs1GJGyx+6wC799teDK8N9Nh4bEJd56SsWG4vF8IzbsjNCG1xPzPKWvh+r0nBERV2BdE/K1RoK0MEDCY5rXcGnhOFo1X2/7f7IAdYoE4AqIjADqQJg6RjypRyBKttki6lRvCzEb2y8RCL1RGYpBpMZFDKCkvei+OGl1ANqlnvDR7YEDSlrJNcDXl6Wopaevl11+Q4GskNBIPkN6JCYW+otn8JYIixEzUp3aCijzy32RgwbAxM1xXc0TV2as1cd8K9j+7TyR/qyn3nmEEa3IFJjV7xBI71+w+iOHEjVr2mYjwLLm61Vdkb6b8/jjlUl4yrSuTjRrxKz1CpSe8YseSPtdnZfRCGE1sBX9yKIpuqrVIT9dMpnpHc7VLyk2M1EN6AkHJTVbztdQyZ4arez6kIN2NblV+BffYrGIkoJWM+OuIYOTNkrRSN0rindQRCbaAxm3GW2DWgK6wcqXqmXZ6t/yGyG0TcuyNVRjU+phjkecsUrH/Fr9iowZoBVRSOjXcpp3753YzI9+Ryno+/5nZH77NxmAiIhFJxWOdOApOd2HsJljumDIvGQV9CWqAfwK2ibQm3lS2YbE7I7CSIEBVhf/5YdqCT/Z1nlo5UEFwcVZ8hraFbWor/GFcSkxOVai8d6qbORjA8KTlFPMxIBwN6TmT7oBQbFrw62g6aGedJgAKSJ5ewvfNk//R32ZNDuavg95D3W+7TDlqBtfunpDX8++ce9dlzYkICcNMP2ML1x8z8SiyQodsz5zPjEmCOJ+W4+rhHVEeVzYb1nTSst90XdKUz/obFBRYsVuec5PysAzdKm305OfneNGbnD/80Jx1+PaEBB4H6DVtv90TYsM8Xnm3qrXSktI/JAtnVgjL76YJ3NDu1nqNJc2OQ7c/pe7Mno2++lO/dFC//8KfL4c9l8a3i/EIW2Yn+EYOKfNydmb9lhhGYNw8DSLRz8Bh2ZRbLaZY61yRqCx/EQfkQ9po8IMNGZDcdvFlAYEPVslHYvGZTIxYNwCnEnEIkCKAyyv0/3/7IlAjbfxAaPrX89g0E5DOr0xSFxdi4azgZukrDLsm9RWrPMGBelvqADSnhekLdXRenOibsHY1IXsuaATubyY0/w8exiVvfjTLourRtA5UkcQWsGfbUCH4lOylidIfSKIt+V0xWzRtWXvvCMsEaLHWC37tIovoRgE8dfSdGMLQy7J3h+y5ng+vvkIRIVZlzZ3J6lNRkU5qBBReUpjJIdH/SpAVczxg9oksgaYb5rwt9z0L3E8xBoxXeLK3NGbeVUpvTJTzA9b1TAReR5SOhPh85foHgo/vwyx5s+4pFUbngtqYUzr7GBlvQfSP0JqFUrZL1eWo/rJoYEtiQCWJyr1okPx1IdHzRRR9M4N7dLhSz+yrmhUQownvpPG+q30dm9KykTO0cVQo+1buXUD09lW8FzaTaH/9sTFYkhON4lB65agthE4KhslsuKtkR48rZl/TiPgdLWnYAfAARKrbVmfTW4AFrerNwp5Nh0c3NWEus/jcnSJBCD1IO7DN/O3Q9Hn9BxgBQ5JK7FWHkfRhfKC2VWKvldcsIxzNivT1e4SrfTUQpawopsPBYiSVYBi1ZVVodapXgZW6xhsw6W4dbSWV6iCzieqgEVXCPC9tDZhJDhxmiL8kXgn3Y/l45XkApsoR35Y3INyDq0tFcpVwtqVu4woCCHArQhx0p/KaNESMIpySIFLkHbbll+xjJ6+YocDaCetRgR2eQ2wSIG54OXCdRxTq5gOHOoqMNfEu9PS9dfkIj9mAvQZ/0A5hXiB7b1K7qx6bm6DrZzMoRoQDIsKo0ApmMhx6sk49IWes0gTOTmzgOEdckWZG4cnIl1ujEngb5v9+hC7FqkpT/tg7awxaxHVSZNkEgl8dGFlc3TsqVwoJFp/PuCSGEX+CEEvlEd2F/DiBGQ8IN929ouICQRRPqJQ3HYE7tFagI01jQBZiDvdilW2FJQTPwM+z0i6d3WiJre2Z7AxuUhz601Yle95ShR7U4qtEHsRGk5rBR08PczKx/vjadWzFu9ix05WyhW9zUnvSJELggjRvLuluMfx5GWA66Ix2Ic4kRh34BvMnssf1I4XMbegZY0JxNqc28RwJ3E7rjJGcXpfGNtMmkh7Ej8DcVO9QHo56H6pjvqRsfA/H7bwQGsSKdP6c8kaFEiWvy5LirjFNS/yV7leukIpA50w+af3kbpZw53QnGkewx61mNnknCTcNKerAK5s9NV6GtrYxI7tHZwso01itspAuJ5Gz99rNmdzpz44mTgVS4SqGiVuLcyPtgDt3WcmLaVAIPMty+11+a18bikpIpOYWJb9NtutKtlqhwoDOM4T3qCHov833DoaQzxA9od1Zbg4g+igIlK7+03rrOCbE9SYpq6Tokc0qS8Kfk///IvxGxLOPScjLJ16ncKj+qz4XA9eil67Os8Iry/w0uB/05GVWGQQgM7GGoS5wAUuDfBnRlf4XAGZt7wt3jDdW288FTzbyktWsyVMUnLffjnDxX05Q4kQUqlVh8ABqvg9icOlRS49tYaZhp/3DnLG9b3zzY7sQnQKXuDsbKTZYGXZMOZQc3YNsHBDBfMQgLji18hcyXQjjwm6b5KvTC0ErRyELtbJjBDmFeWFHh0y3NgVM5IXCPTQdVl2TpJFgPW1YCoYz848u44YVpYsPlVayQ5Qlz3sK5HsC98s3YbpTYYC27Zn6GRCCbvJcewUtYPqLbXscJv062RbZfpVOE/jsPkNrA+KQlzYW+PAlOP8nvgf7IuFV344vU/XtI0OpFX9iHe+gkJ7+TcEFRNfbooOfjpRPfzGiRQTD+z7aKkGvRJrdiqCfum/UMtMDv6/uq9qw45ydWSOjiw35/Penlgqrw/2X3OQm+Woe9PUhGvF5Uxgv+suICO/kZNd8cshRaL98iTVLwD3lmdx/vUu/XUO62QoOqcRmxuGIcxkRNfrrTbub9uNEYwg0ZB7oT2pTeKIktp1Y0YX0V6YFp/HdYiNeZB5S9JRxwYSMN6VFQQxcjCfuxS44nDnhd9N0q5WUE8/ShJSrPETiu++SeMAYIEekUUyHdGjNqyPzuJyw1mxogL0L6afpRe7I1wgJzFXz7tzlOF+NNj94k9LVTt8pEOvsYcF0FXvPL4vpY2djGf1tS4EIY2EI7GyZXHiUnRU3HSS2h+hsUtxv9ITKZgijePaTSQr742P3zo9RP6GPQByzxmr87qOi6tWwQPZQp9lx7hkLBnmompxp13Z9lkJapyHdSq7I9K4FNTD3BUenbX4ksNy0U8xdw2njCk9eVdL+fV9x65msTvyUko/Dy8Tr+XDL2YppozX+iZRr4yK+oB+SjQ8p3ocSQrdQ05Sx8jjnYYTL5p34uv8dZvCi16zwUadz8GzbtMe8WA173yf2CH4Yj8RrreNj57kkoJP4iWj+n2KBMjoRIefKKJjBABQbXd97Y2UB7EpnIGc8ilFgdBtU/i/OOopNStm4mKEVRJ3Rd4I/I6XzfFvQhfjTZIj33llAx7mcVrOSMgcZANxIvN8DLRDkPzLpvcT5GhRhkjOT/bLn1Me3OiYNuI5e923Vr6ZaJhVnrLJNjNtZCj569PzFfwwC3+v+G+MQOBsmZfhfqex9l3y1jAfA0qZAfrVHhU3cdZ4HFD+05+bx/pfKHiyVIcFKHNsYUzDOWED5CVu/BW+Or+/Ku0roZ7ss3vO7IWZdLat9ypxfbJlbAE+Mi5dvdysuE04Yld+yNP6vFL/O+/dib9XQApttXtZ73t6p3F1ZIykZPOYdH8CQlFRR/UtOH/uEVl+st7ZqO3S4ExfJ5euhTzDLQYxgvbXlxXOSK/j64RcvchFuquaYi3i3Qn271kjbIniaCH/ETqS6fGI/Vr/4+6+eYO6w8xQ7AMJjKF47qFHEi0tYWduMepuUhzg1BascZvscZy32nqhSOMULzuD+oVQ+0l5zgcd7ISUcymPvh4E/rxk3ZR8qzyT1ua7U+RUWvWpSekDyydFjleHBoHLQi9hsDxCxBkLhPanb1eqD18jC8Dq7M6QbzTmg7XJ6M+Gsr88oDBZcRaQMQcnMy3tnhjsG8iSwMfSuwvAkBouHnW460Gj1DF5dhvbktAqFOt3B8D1E6C2/xR2B8GGgsw8BCTJo9WRWLdCpZx0Gvlsjdm0tWTQeyNsH1R49OmUrtQ+XnC6npPRuzna86xwwYY70yG+BqKBE13xrmZ//nzKCQAj605Q+/uPRvtd8O0O66q/7PcPLR5Q7/q1FiNR7U5JzqEkk6zK6N8oouPvHlmaoTQMvvGpb8PxZHWN71IXl+J9OU3cB/fMZbHpjyEvfcBdTlOYF8R8YuNNE8zZoqiQn0Xzbp5yBXLKyE+2AVAc2A9P34QzDMp64N7gk8E9iWfLJu+uox4F0e9uE4JCKeocRncWwBxUl+Smw1pUtcFNeGClsSZQqbN+YmBP+DV05RnhJqRIRQQy8QwMN4GX4nQxzx8Wb8rLebfeXdWBSUP3P9b4bHRAcxzQZVQt/M1dK12sQEJ6J1qh2EC/WKQAfNEATvtjw091/IDlPWMcrrDvlCti0V+hxLKwRGZU9MaskO5O986NI03eKwWmQu/Lx5BabeRQfbZn9cbRImV/qFFDC98XtDefOyO+6KfK6ctUkHCoEj9Fx3q1+2U/lBbeyixI8OmcF2ja54sX/WiWbq+A5cKK4eOPWTu71QbfPx65u+0U1Ve+mtiNnerdUQ23/H7+E8yvnVO8UA4uTlFyWuSsU7GJkT+J8mY2T4FEyQCJTIfGWnOvwjMOPtMRuExB+oRS4vhJwlDYEpAP/VaMy2D/3u4vYWKuV91Ln1E3ltj6c6OITueHd8hJjZ0R4VcA1voCdd7dISJZvowvieoea+uT6ibhHeylqeZIc98c5ItkmD6XBUI+ZfRh8pzJQ8Z88IM3ipJwxI2QwdDyu/09FbJJgFmik96sgVgEnpmwnu6HScl0kFz71ULlxtlvO5Mj1saJ7dxgd7GHdc43NeaYbrsqBtnUiQ6sp+08f0xcL4wtSS9VqVxMZ6u1R2OJMXSRj0WU3YqLwHpmaF387iwCysxUXdgl9pMzaIKJPwDVY0V7i4TjYNgEd5XJ0qIKIvHhUyXmSwnyCyOydTdI7QFyzEkS6O4yevE2DW2JksE+/dkVFEXTXrNZg5NUhYXTYBkIvgeOV8UfCGbf8SkQLglj9wC2FeVujpnVKkHVJeDErqrVqUhbKuYsgxswWke2ywx+59cTTzQsChDVxsAvbXtIO8jVykIZ8ajTKnIgfyJBk6lr+AvAxacE30EiMH+0IUnL+xCN258Mkm3HjXfvVUZ2mYN5MATBUTl3ZBBiSAFoqHoaBWhoqtdnY/8Z6knyExhG0e8SAbfSpCL9N4SxnVfntO1beJGOe/0DnbyIUMe7mD7Z03TdU5Zu0tjIr7CmSrZvwOeRBQeqFDFsmfVqie4oYusONPts+T2i4rqqg0czGAt0gCzbd2RcZlefb0ah6YNQa8B9fLMebNOGcR7kcVCxzGbJfoojTy0vXYKKECteQx+LdAOD1wxvQN+bCEveq8z+EGu58WgZ4DhxYvFLFrW/Dxqvv9l5lTexNbK5vHsDBTLOqxJirFg9bDgbzBpFTxNKbY5dVFHGI0VD6BxOYXm1Z38nj2Nl5iSgxq7x7l0WsWNHVIC3ejovGOd0LWeRmWiX+fgjIWLo2wdfGVBI6Nb5E6Do9eCFpZcStg/Q7ZzNYkNF3eoYc6X3kVv5/ow+rRFXiGX3q0+RtXSVC7CnlbGmS2yATH7tca/QPw9WughYKgLT+hY1kEBn+4goz7hI1NPEJ+XtJYWsCkxriXIS+MBLVrahj95b2ZEWNDdediwHDNp5PIK6PSM6NwKd+Var9awKpTnMpXI3PrySVUhRi67tkVi1RciUemza/ivphGj/l5LAvlxANDHm88eYD8eITL3yPEnsCDb4GD2gzf/GCgg7xgTR9tEbmnmCwBDSYKoYR51UTisRKJTnWoDl7TPI4o0VQvVbeypHDN9yNdxqOawzVY1Hm83dvAgmDGZMRz3sV+CkFTqZ+5SrwTCV0WpJroaNKS4ID+2ELuDitbc3BYF5aYBEiB3+Mgp7ypI6L5RWh0u8zMNLMeq8UBuetBwiE/dsZLg0dOWSjg0s+jrhz5jCF4zfttuaEmG3cKdAI4WJisigqVftcnEUrlM75igrUmuEPsmuFM0+sKJXKoo6PLTJLXPREKZMhWlMyqERAOOlCBcBnu1DuzKDdE3eNptczV/VwVzdftBfDXSOLEu3nJjKlM3wHhYsCNb975nk40VOMoftLhaPVzkhoUrIQ+5atXwozBCUOIpbxUOdJduZuwr/Ugd0ZgZxsWNtzCMHeHj86YCrPAcIvqCIJdvzi0nRRqHJwKGyKwQUzdnD0nrcKEWcqbCOyE2Hs8wQfZe0kXCXdEsmHaun505qHFtIgJQV96JGZmiebhSImRERYskP/E5YOoTCcAgT7XQQAubn6/XZnkS9s7+qSVOL3u8aMK4wBx4ChapMqSlhMFujbbTbqA+pMNT9YSiHWYZOQsVVrNoesdekUJmRhM9Wmuk5644U2hLVSQAkCTTCiAi+8bisVuQwutWBeU5JRlFKhptF0OfjXzjwUsbhB4z8YM4a+/GobReLqbEftKmgNC9wfbpa8F0+kbNPfWI9nUkmYgO15E78SU9MzQT1RFZHAgvZ5uIySiAEgMuFxWiFNNJ2gK3ftrW1+nllKwP1k+j7Id2wjdejR7F2+FQXfwCaoEqc5YhOBArUZfQIGXwMLpBpkSe5gxq2kPYG3WRG59ZuATkpUU3o9y6d/Ilz1wrR/6BMcCKG1ocYqKJpohrlsgbCFWMfu12Q23YIxk/ugXJc7SMvZ3Dfukto90HF01S/wWoeI+0fq+9DeXb3Y7YMjPpMfSIoXz5cwiqZZSI86hjz08KQvzBFp5s977vQt4MpBlUjBNsriaaKJTAn2FUxF+DqTpIxZ1dKm+4K5USxBPxd227JiOzVJB8Wj5tqZsn9lgLgtzZhnk1+Jsz+pGrGQoIi5dS8EQfqYX6F94mIUFrFzo1iRTaGYcoLHRchIjo+u3nsV2WOWkph3vyQASBpwOU8MDb30Nu42u5hwtvv7y+OqC1IoTLjvTZtlHu0/HDsU3CiBwkU/unuGHeREdciQkjGGLolTluHBiBQeiPbnG0dHYnVum4bjHeKbXtRv0MT5D5JxE3g5sfMSo8g6RdeopPIdjtxRr/dWpkVEjAdqaRDtxBsrE6zrF+806JTj/4SXBZyvs3Ls1AjhUpyOKdxUDQ7y1BJVRijGNwFfpqG2b9pmjeMmIM88BewxKy22g8AenIHPd8swYHeWNWXqWgujKQMsD21fYCLOkCZKIYrHDyx7wFQy3LeD9Oe6xgY/bJd9fKWAz7aCuF3oRMFpeo2RNZtnEggmRJTW47ziQP0SJhs7RVFVOb+UJNcCpa5ZBx99cf+KH4CnDcXHqag0j4lWi/DniOpLJImAz4ERSyEFPcex/vM/41z2ZaDoG0uYlpsBdBHCSP4CxXOcO0rgxs3w0Y0IB3OohsuaS4cS/4/LM0UoQgk5xYdOYutvmsRnYaTE9iB08QLx420GFPwTI3usdRTaKY9siK8N2QB8Won6fGPHn5e1GdswhYscZzKt+iO+1SuLOZf0GzL4ZzGae4wcVVnBkIsXGxPA2J2Hes/k9+TJe4nKgZqXnHtfIJERgWeg6PmZTw7WnSB7+zDLEbRwC1qScd6MwNnFAWwtOVbGaOs+jed4eEzhl1Ctq7jw3+2HzC1DsmI8vh8e1Hc/kwEe2TY6kGIgfjswFn4TnsqXTICgGhFb7tyEw+X4451BjSWdP8TE3Hq9fmYjTNREAKEDJGRYnYowKjzzRYELG//wAwa1JJWgkMYkh83K+XmsxNwyN4TmVrZDx656b1mWX1RrgFNiuVx54+xrtxR+p4quep3QHK57/ao0LazQQWIy95k3YPuDXOtAzymip0DN1npZIBqPYnSzxElk3nja6emn9zgUDTvPPqN4z9mE7j1VxuqD8Rk+MqLvFJ6Nvurw7c7ZBJ1mHM3l05PV+IxPjIy/JI1EdoYHp/6IY2CaYbS7JU0zFLL6J2yhqUs/wTDufHedEFp2p9wF8OVEG2vKbnZhe7WwT+R47I7D+xyGqtWTEQZZgwFrfp3EYZ4+4OsgP0n4u4ruIBoMfm/FQGGRC75mAU3z3WvdBbBQ28fObp4p9TOTJCAydw+n4cKH9PWkXAskFbKJ/TCcnSeo2CXZhMEghBmGB+KPWwuD4JH2WeJQxE7buijmUSApd36O3txgWa+Lxm00F6G3fWQWlzkJLu2MArLpmcyVU0JyOpoOfocro550hwqm9jFG0h8uk5vSJ6Zt62VhszLbSYs0OjBEjJ0DcGJvE95ZIzVzU1uuWcZEbKOHKZ4Xk1IkqiDekgSPEachhCcn37Wy4CzRf5YOf6yYP2PMuaiQgplPyG5g2Md1hoeIZhxO70os6grLeb7wF5++ho8G0meM6KRnvl6ruFGHkjIsdV9KApdIOGHXqDtCfVRg+TPN0o39hcSO63T4YKwNep7sAFNvR7rvwbLSSjajcbH3fUGNu/At6DaAy4kQU99TqW19g3WX4J/rFzMujaKXnoaTziAOW2DuKkIJt6u0b4V3hhHNImA29X/C90Ywp8MW0ZitndKWjss1mTJOBR61IC/rIMAuYDwSVajDA1AMASZe+0+xQiACAnwnY4/FAi8N36JQ8oJoEkrak9znXyQvyJohjTEe8Ka5RBDjJklF11hFo4PbW5UFizd2sKvACyDVpB9akbZ2IAj+NQRmImJMKtgNJD8OydHKsos4i8KDMozAlgCJ0UuzYHtOfTpqa4pqEwJDrDRDW3UU5lCH6hF6lFx79aW3f2j1F6ZvePD6Dx2WrO2ALWGSM+mBZ2Z8yWeUSn7Ofo+xKHZibkF/U8TXujutN32Hezr3MSFp9MURxmBRWkaupRdBbUXs1sSkh1tNbmy6yRt2gzwYBiwy9bgOXtn5s8SW3X4F4UQJ3SNf1LPX+wgp60Urb+0YOZxFDfHxTFSuNrl7BcQLE3+PfAZWTfgY4ZySL7iiMgU9V5FhV4SViGzaTnRKf73xoRCM+n51mo0dCABY/B4muMrEwvVWkgxFcdi0IIfqXvnD8DP/fxBb5h9DhX7maC0Yvi6NH7qHMQG6QFrUkghZBUfnvtkfmj398ri8dyLzCCxBCoMu8QcgaZ/CPrwD9hQm05BL8u0reR2lL70zDxR9r6YLNQu+MxP6reOYUk3+FVDNCwFz549fLwkQAO+d7JqwABFzpcKP55ytTS7c2z/44WRBFTsveb3ocIxESTGZ8jL/RbCADdHy9SHg0b4yS9z05aYZmo72vCpNT55RhcX9Z2PcwY/fiAzdmxrpM7WlN7pvOVmjrfBCpbMg/TbbxtEuuRpYNeMTRIK7Gtdj+r+Beux7LXXjZQ/gfYSkTZYS9v2ICMTzchyRqNRuJ3V8u82oxO+7MKbRSy0CxqXwYI2sWGC+sKkcyQqhtqpTN2c+jr1vhOswxMhwIQrAeJmBcutj8A3pk2O1zKHlClLzhIJrRMlLXPuCdKcscDGlwAeKwtstDAJIjpQRUJlf20pN7bn43XfChACnyA/7uRiIh+GXaXPKcoTtuTDwbSvWAFGCuOSWMZ0np5rDOYt8NhjRI2S/Q3QTM36SNq7JSUTJRQ9lpzJAdZV1Z7UsuA6p2uZfjGlnT/2Fsa4uSVLcOPRTTGG4H8UUjD9PsF8I3TEKZYxBSKM1fBqpkvXGYGUgz/Ax1OWg1UlFvNafPadZJVqYXfvevUdOozMAqWJhj/mWqzsX3I/43f073steKUC2Zbw+2QdHlYxh7gIqI/YRTfYljoWcfcVxPQ7ElYKJRvhmiUKT6N1wsW2tzvEoosOjJ9a+61d3tTn8h4Tg+n7dAFTCcXORFLdWC9EbDWjKGspO5Z1q0ARvBsMRPilY+wIyEIMDujw+pU5f7WfAAcGbCkTUFmhjiOa6S5DbMNkBd51QDQnqaGy5rLndp09b16p9UJUc3sC2uv1p71TO7tSDkksBKX1HDfzvoIhRCr9Iqut4e2qWrzqYUc3N577arivVkyCszJYmLKFZSvlFGUweaUtdxuQeE01vkDUguwZ4O4NhZduoCWJBlWM1TgqsRgGXCDvQx1HCX9nfmdNJi3n+9OVK6jws78nT0KSCQhMj1N2EBZlxXJzhH91hjkatdClVoIM8bRConFb7Uin1IJNxYBQyHa1oar7lS6jxNBJ7eY15pyBBIynpRedilFqDXj4mKWhCeEd4v2pUZ/2GrpB9NiV0S0KT8qdZLFcmDAPTEGSHVJed3pUCrkJyBCfVGh8t9Co+ag8FO3oaJ+cmZRSePlrFfe457nV7puGmjeTKCHwP17PIGkMaYSHbZY/J1JcqqjC2HpVhjLTC6ppn78bVSF5oDPOi94vE67iO3jNxNKNbqxsqPjG1mm/isMzNm9ba0PQW7lSfmXrNswx/vENV7bS8OTB7/95dbztUVelMEDHt9uQoxzz7COLuhAXs4jvWmFhf2wVKCXVENtkk11C3knFV2XHFaNz4wSQeaqLSw9kVJJfOircWsCuOihNyifIEjbWPn4LhFPnFggnGBHvpYyPyxyQqZOutdtsjuAXY5fsN0WTrh3BmYFUvnt7s3DyN8zkX85RuGg7dbEIsCINdOB3SI3rd5jODMqiKMSV52AeN0k+kbDXzFQcwBkgMrQbDj2QQX7XjvvN6YFlrNI3TjJL6anLxFEY7kgk0Uv+sieIndY/NVM5y5nymBvAbkhnHtD8uF1x6B2uG7k92P5G4QrQrQfD02zknlfwMumQt+g3DWE7Q5D0a4WK90yS8+IdB8Kcl1UL7pB5kUYIGdLDwO/aT5EFUZ9kxpP3cwesWOS0gQUxYJ94uWJAozWp1ezdBH6/f7MPJWUAgeGwR13GLSy6ZpmB97qOs5T6EV4X+kijT68VA6/RFrnk+VMkjT7VWBb/kc0RTFtHvfELchJ3n3wjBAqBwvBQxNGpA6DefqK2LN9FzirRaeE/269o+idV5KICxl5apRLRnESthwz60LXPicgUn1rV13JvhlzZefRJv0IKcj+lvk7Y26IUEQEooqwcjwgnqFd9CUwF3uXAstQAlc4IC6lHWtu/UB3OczB2pU/m/ye0dZixs60/bOxSTPpVEOdIHlTfyhijMA+1wphafszAWR+LmynafCR2LPVQ9OUYzVHeaA1S2gd0IzHh0ERbu68+NMMkMoAEQcCHVJ8IUMTKenh3Jey6FQv5rGivvvZZzPt/pQlcR++YE6heVgo1MIkxN5JJEodqIfo/qlj6va5FFRer0hFlLwsL0K8jaVyHFhrsytYX6VenG/P3hdsI0uU35NVkkV3vS6WVaQyBM8mrJQKS1dWLdJ0PrYO7n9rlFSYiUr3J2/+QqziSxywZX/hibu4bNqQnsCviPXo+jNUcxytuAko36LyC66S5caWzRu1vv0nQmA7u70cfdmbOjIX4A8OLwvcERgAZBLVDGoijJZLcab9zmGAs6TMU46ENwdzWw1wO7TFkOIYFqnqVI4uyInCUOXLk1ixfoXHCI3ha07GGwhDsB0pq0iADRV6VadC/2hU5xkeE8lJwM4XaD890x9Mhgl1rHJAONFAhr/FK4d/WGnZ+PBjpJUJpYvYoPxzuaa8wj0O8+EDUD1wRLvFCE+r1h5J+hYpaRAKEOf2CKpn2tUQmH6a4+wX9DY80v46cDJsYh4sT/9090Em/IO4rev5/aCuCDG1i5C6IX7ldXebmg3AS43dsnX0P/Q/igOJ3MttX+jRB9ILE4FZBXc/HQ1ZnFjtoNVsvqOxwj6RPOMBnmaRGSztDxRJsWJjDZ/871Z80KdtmZt0w2QyLkzYL3tpiNHGYR5wyAKGEq6TQ/9fM1aLTfRdFMJIgWzLU4Ww0hLHEkgF1XaTzXQgItildyI2i1d7dbafLIXaiVJzNYCt47Oj20FGvdBNN2zawefs2mE8Pv9UbnvkRaL3KUx/M3SxxY9aaNStS2xEEfDuXUq4qx884OQQJQyGx1YVPJuVbPPpYQjmhJ6wHHQ2MNQqKAAMU5RSzk/hBdjT9RYPTQWkJK3H0gizByda3Q/PjbeX4nJgUyFkT/vg8PcqEpNz638e3Ir+Ja1Oy5/z+g520w8WweDwd9Iu726rT71wqFKtLwBvlRYtpiNznxIznPf1HUYwEjNZBtiWjBnhXcBnFTL7XcBXC2zrPAy6mW457DG5Uv/ZGM63okzbAq+GaiJM95KxOMykMNqx7eMuQcCWQqZi4a6VKYztWUKftX+2AWkoJSyoU8OvxxoxQTKuBaDF59A5hZpe98aNn++yHqKCD5PXLKod73hXYGKpHrVpoIO+8cOrFbXWNj7oDxvluxPcfm11kuSg5LjT6NJBANxPvoWB0D8lnwb/QeLefqfhmd15QObDQIPScdXeYhugpcDesnAVViXk5+64j9RBQx4S5Zj1fP+oYY82qQLatO+lxNA/q2Ef5XGv2ObaukI9AC0YEI6sxpV4WgwQ71VslOM42muXxR6/ZAaxxXbaUCV1h7Gf0qJXmxR30uU0NAPgzMSHw7sstsBM0ShESu41MoATrgbQYv42G34KJzFM54tQoBTlrUW+HuVc9L8J8hvlfMu58pj81EB8nFgWzFMqU4tPmt2eIWtxp5WuiWeUg73V2T3BOCtoUE1ykrCvioy7BT25zSAZqDif7DiRh7kUcV+1cyTRwl0CFcLXRjPJC5CVVV7H0UCE6RoSe7/KR2w/DitoVI9vBQ2fpHatHNWeH2EbWo8EVJvYPkDcL9x6DDfRbLC2V9Ubqb7wvjflxBzzprA22Rru87483TcwOYzyefRjTgDpu03bl7r7nu9FE0tW+XAsKHV3EzHRSM8ofJOm9XMnGXp9/da/iKcA6+h61QjidbN5dSOzOpRJaIu5yXDxkiGrb09ep/74+P0D/xQ0/6mIiWlDVtL/XoFyFID4hz5sjKZj7snTjH34PbdwE79Z1GVl4anOOEC0tit78Wz6uQlPBi/lelfbmhPgf35OOzmCdEgx2c8cX8DFG+Gei/i0YklLPr3xjapbKJwb00Kw6wfwP9f3UCKq8iFP1yj4+KrsVFxy3CRj2KCLVljv33r4bAyo/icGjo9KHgbsRtqbw3svu/9c4B8UamaXTG9D3mg+UBQug515NiU7GlKsa7NbWzf9CUf9xWNZw63yTdt2zEaEDWdrEp9FB34dc1C0M4WQSjq1K5tHXAnXrfQKIWxHMuJYGtWiWe8BLG+ukMhPbTmCbP67Tj/uqiVvhWhx0CNoH1rR0uGG8bI+Ht1v3RXqxxnVaDnkArJUtnLJyfEzjd8/X4kO8E6yH7luZXxeJks+Mye1pvyoKkiWVq+vCC2dPlu6BxW8hfGTY3KLG2xGQ7VCAEdH/j2sxANcgQhQr8FQh2p5Qgq3ESZprajlJ4mIbcdkaGHkFcR/An8LkYK3LVLyF/eD8DI9cDBAxcSSODdP/LEb6vuM4EavlGwVcXxWKYDSyC1FXpP5qdOX5cMQ+2WfI3b8tsYM5Q9CETPqKdYtGzwCeRcr1msU3O/jJIwbnsnEcrz2PsQ7kIA6z9T+gvTMkiumDcLt+92QXFs381ER9I9U4W3ytQ7B8K8BM2sFXUkca+skXTrHFVDDh4LdJW2P8GnuiwVm8z9mw/p+Mgbm9xaViZTk5rVECXTc4HsZU79310pFNfUUQT/GdGvbDt+5HrzPl6cWrxQoxza3gxipxFMAoblKA9NXqbulSMSLtR3++7bIHZ3g47DRSqMpX2uL23kXUqSZIpVridr8m8lelX+xIY6jDgED3xZkZueYtOPbmTeNfse0UncZu+zhjp2SxukQxOkPT+08u/Pd3uDHkEZIKCo60MRYXZOQkX5RL2i5Gak3HnTqkpIFE9d+QDElAwEwtORXdYAYpTnVyvuHN2q/CKEO+q4p966CbmX8hkg5zBtWRl0zf94OP4OqqsK0XpwhUxbEoKEnHEecwPm2fbtNXzXC8FMz102Ijh3i2JcfQTahnIZRl/PgXaU4t2xUQZLca39pupWNg9lu1CwwiHxLxF3v/aX0f82jV+tN/iwijki4fkxqRpSIpr64vMwf0XfFNAjgTzg4dB3nYOcRzWzQ1VsB8/JAijL/kULhKkrAB+J27IVfClWlGhS6TMdRB0r4FqDg1lRdrGeI5ET61ziVEUYtyuP/p0OX1qQCuzZvPvdLZP9OwB470bT1xQc4IV2zd6aknC7ftfma9k52DS86U48Kho4ipRDtVi9pwaDEhWft/tdi7Mwvnt/W41yfie/4B2Yqfn663Rev8sUHlSTMPtyxzXhztyd5syP3s64Xb/6D8HEMN1ef2ic3DubamHjhxybhZl4qXBTQEFbM9KSXJSAukKv0rlpM8ENhN4YD3ZaA4WBLvncGzzG5EbWAuX3ecTasI7Mk8Ae4CupTEaAUClwu7mDCb0vmGPLMKJmte1+UCvibxHID9d0D5vIl2Nag3RY5tMw9pUY7FUV/oNxxhd0G+CC0UmSD2fj4+xfiypFkFCOsoGAa+zrP3PmBUNjM+DZv7hSzdmQFOY6JfVStrw3jI5Ls2zBNGSPHDWrMHwoMgecvwLxLAJF/llJCz9Xy2NZ6QZYPAnUNzeTM171c8y/vvkXmO4NKIdurNDAI6FMo1fc8osnQugTn03uZQUQgfYRkUsMwbUHkeoqhu1ppY0jlDkh/Q7jjip6EjZDcRlzjLcMwfmHQnBASltyilPDXm+kbvxDfhWsjA37cHHLH8VEup8cPk+yCLX4uJ1zqo+BdHGVdO4wUNrdoaX0R2APP0V+7vT6TR5xOEtf24ksxNPhqDvv7mHL4nnDi0rghswH/Nu1DEgLZgAbFbVpOwyPN6aomr5FvS86BA0VwtapKUT8I9O/KgeiVVj8oIMysUsVzzAqxlmh7I1XzjvAYeFNmfo9iTeNh1OIAsmefiHOmu+SFfXailkpk1PjapTbcPbksQVShrjhiiYfmcUgN9QVCNHX3Yn1HqZU4cek28M9X6Bnwnr1yJQ18GdKhgMWOufDY1uFWYNXC1g4xYpjg2y4f/ANSf58vf9jXkl8YdmyubNqzxAu6fftvecRyHap1qzeIhAtwKQteE8ooIUA/N8vir7axwCcgozjjoDT2Qc4BULn/yHB0z9GR3MwDR/HRZTPVZ1oTS5z7DYPnjuee+/l8fI7D2iY8xVjk0DC3ZfP5flKoM2CnS1mMsD6/azE3rzAB3A1mrsJxs546g+LQMXgfIDsjWvRdRyLAOjPAxHTJ6yLz7Dq+tCGvDur5HiQbhvoyRMtKkbOETpPOgQ8pH4/pU8Bl6+eUe03lddLUksinV+gclBpgFrzSsYRedvCN9xkRa078WGhb2dlc3JAZdvNidTq6AwhK750pWU/sxrGse4acY3vSreiDHEKIG/84/8vf8f3sTtPfKFRwp6OJO9Qklcry93wb/Ia4pR8OnFZHZaqGwCp84fzT+S//sBYwmCmNd/rn5aWbnLeFrSMeb9mHR34M+XPIiRFxq4tzdcH4p7Mt4wpD8Oniyt1UcGfDFV3Pt6wBQNpSkOwkm3M64HTf/mYKiNPLgVQvT9wqwtf26hmYQCalkdvXtSnChYsFnioiEtybqlsuOxkC8CTBX4+TOXPyIhQTz/3v6RPZxPM/RD898KtdLNPEI0EzqVdJ8mKLTkZ17yaJOUfTcSbOK/fUq41G/LOmHtWgh/Lg+3OMS1m+DnMDy1UEXIYQiHbRdL9LsAVzjMOZhKN9NiDSOBm/yfYvk/yiR74A6P03lFEA09U3vJRP+fphKvvdfJooNO5Bw+avkuFoklr4YZDhnPTm1ma7NzVyBn2MYcGcloRfgOVRSb2ZJAH9TgJ4x2pYaWM0iQ9RIkCkNppNTT+sSJ/fRpG9shcJL4qhA3VYxsk4UC0XMIX7wCAU8oh9ClcLHETJgMNaWFK0h8qqYJ+x0OoiI4tOU0p87aT324U86zNikY6s6070AJfsAul32riKHPBUSxFbpodhV83fdabp76gfqkSgKtP68b5oJ99xcHxQSEcJ/RglFnUNZrzx7HhRpPj5It5U+j2v0/SgIcFbVQ0/P6JIFKp6ssBwdNi8ZyfQiVdH+PldgnMCrqfL0Lch8zMgMGfGPhI2mxUXYqtS2qQPNnWSSawViKiZK7Wn2/YfcOFSzC7k6Yo0Z+X73LYSR6HazHMk7G9PrIvZ8MXaN3VVpSaO5y8upljZ8R/hcpqAEDOyC24KSl9Nd/7y4aRhQJ4L2SXtaO3Um/C3u7B4W4KjWV7Vz8kSGxjSA3AlEeUQ3JYCbPpCzMD9kW76wpjJ96HjOMOj1o1p6yR3hC9yNuDOKHDEvIZwSxmN+ywfAjTKplTRigdit/6TLJJiROXj9DrU9wc9EY9xWGbQi0NruRS2Il7MTnz8JoWlG9S2wMSUmgTAhQWGOuc++An6XUNasfov1vWCkxUkSSKpjnFhiOHK10y727UzyCsJBqpTy5oUPZYNHjQn4zBXkxetHYOvwB/btldo4bIPvGWnm4Xo2k01p+cOsw0zlB3RUIDJltzZ+XdXHEjviXi99rJvytSGPJkYjoHY+gW5+4m6qE8EZzzXhXHuXw7CIrHLlC+9apRqbKvEGeNwrZC6GqkxRNMxi+Imwvrz12MjiD2UyZATUdE1WaNblWhGNjMwQ+u9DZ+CwsrTXOvHRcZVsFj+5Z8hpOwl91VVft4FTbnEukIZRnlCMo7vL+BU7NcITBIe46TPLre9tSJp5fzer/qmHIzwvLvm31UyvX9YJohj/YqHvlDg81eGF3CJvjBNJr6FJu5Tne3ls3KlflrHl9dTc0nYXQFJPTqLpANYHv98gLoqe7jfjGV2sGeE6hFy7YHRmVDa8Ms+TWEmnXZbQqEJpALlTwAP6M65X3Tmi/4Y5oBVOe3MC6Bs0zO9i+FC21g0knIQLosRMrMeI+wXRVSrVT+25qwvekcyivyLIzNZ2BxUgGJ1hNpsFhY10TOtbM/F7H4NtLgtwkRGVv24Dixy4e4W+DdzwfpN73/GtN0o8GE8WwGshCOyAiuNUuA87+oGMG20D4UDhiLco3uHyvPs5ahVLHZJyizWa0t4W/xyVms9+XS92vH4t9h+WpWyb8z6x38/b1XpPGZ0nLscK7i8HbgyVNKPNde5/eA9I9YUHpE5HWoqmNaZPS/c+h2u1c7Kql+ipArR34Qpj54pzVLvxj3lMTRelq5TsHeIHk4M7c4UAVN1fZWKQMgPnZLK0mzFc9FqDMhrJ22NuXWyH2n+IydcGpzNhPbVWwcTgn1KpRjBpkmOCjXxtNH5fkFVdqcB7nxuXYBKBFP0Ysaiyc6zk866KNo0O81B9YME8GUCj9z+uSatD2/gp5/g0RIeEj7UcWUrwnXvfNkBfojy61zNE4vu1oRY9221ZJUkgLaglcrMjFwx/3YG61gSwvypeE+N5f8oO+KMV1g9/lq1oeGB/LG8xj++BR1Nr5oUu1yO4yKllBYSnN4XxPNesqDgN/qBNrbCPofzi8EPDuffa3oiMf+Y5jqumVVIQxQFzuv4E1mi6EqBAfcVb+++NNZHt7FqPkvMml1ypymdBudKbpy241hWpGv6H9exifMvxjXv+jwky3HJgQIllQjclB7A6yQTLtiLmG0FCXCptj6V0WKJntfsVWtf57B2ZNmCiGZeETGQ/CIu9gdm6dx9nohtFgM3xCWjGo+6oa/3zATHAhCeLO0j3fROdM+HEud2MnDQXpX5OaQ8/F96EiHI8lFtUGTEh4sTpmEFKst4zDzebrL56O+wrpdsjhOVnaXknJg8pGxFS8CcKFqKWA6AIH+4pWql1xmVt0CwmueKpTLJ2XueLIfDtgbE5W/ob25wx52e/9epS6OQQHQrSRHRoMlqDVcluDaUedKde3VqXOW64PieKodDFR/h0gwv7Y3Rhe8C3oTHOfCHvYgRrotZImuymN2zF634tLg/8SzdljFeTM9yJ6o+eKayPwDicYwB+OD1pKPh0bhW8HmPJ87cHEl3Sfk9rsmOEysTmqc6HgF/EKOqkZlzQKJzT8MRfnzaI/bJPRy0rzQblKydXaUZOhwwFD7yKPfmJu+4ziSZJocZvRZwdAZhYH1nW7oxvTzJtr7WlRYM7EP7irXuDSBDEM6GZUzhUXp8UrBnhhLoPP0AFgehAu05B4pDZ/0lYRtKmeKnt+vpRI/kFbrazOqK5Rxpa+0m1qfA1oJsyUaZ+zBUSeautfg7aOH3oyT5VuMEZGaZwdNH1sY0oasR7soa36Fhtj1IFfbsj8Fyng2BYcaZmIKTZXc3adrk7ZP2bIr4KkVOlRQwQEpCVGFgWSANnzOzYP9jqQPjwvdUTv4RZX1Cw8rAT/z76WIp+jiDr1pQeQlK4/RZNU0teWhOoj4JOJxY2XULg4fuj99v6kaBzZzcB5W2IAudVNVPExOguXSPfIDLz2TWqAnukJ2FIg1+AnvTxivZH1goBqc3IoEYNayCrvhLJIjp/r44PNzBrmMnX+L35SrZs2izTPgddEnzijrLKoaUZISlG6UxTskObDdbyfHmemtfnax/Ujwpul8iZHO0ogWg7BVsmHHa7rJLS45H7PXE1ZHCg8bdntxhuTDmetTfOqWigbhmsAMZ/zeKHH0YMU0tZ+ewW6Ngstv7CHlXYJ1351EnoOoT24sqRvfRPSJUqkyqyFUbRjcB91QEDCSqOD49U0VJo0KFNw5LG/yS1TGPLxkLSi78htux2MdowPxVts59t/dBYAZ27S7eI+/jw2F9trrHykzBFTEVsxEU4RX88X6bwaak+SFUTy4KikQup1O8LmZuY+J7QBzU9SZ7p6kf8MuZkkd/EWIvTAN6njvRcxjLR7ou37Sbpt6bnTdd6NljsT4lBUsvM7BgH7ZOXru2KMGqGNQVPr5U8GseRD+/t402yLeSIJ1Fo/PFajGWKnfn96c05nPF+ZtaqSZeDh+4jHDh0SXuylBh251kC9ZzJqWa2HMASfFZDGJl6E2B8XVI52lcnt59qN2bjxLBqgRlIchVs7C8mZGMi4cHm1k8YaXW4ic4oZ363gEF+0Aq3Mk5wcyZJD369GzTlx4yueNzFcMR5f7EGDjr/dF4fjnlZdlBZUq99KgPujfGa6RqtgbSsSjcrKGu8KnUBZgfI6xoPw1D4ymDSOdYuHSGp2nMrlt91VCThRb3J+fdmOBhojbYRId2sQLIrky9oJiK1IfCLqrMG9xegSPgNw16uuHJPGTJMCfIsgOt8s2nKnY/pW99QPLNPr5g3K+cDNMA17XS5K4Q0TMhI1tvpLrJfxzKQGDF26s5b+dGL4WDeUjonpP1qfUxTQ6Zog8c1PV9Y6WdqYYs1x3EcdEZeGBC1iFKMue1mMtVoGdPVCBei+l0wctbVAMHTzJuT6j/tG+veQSgx8EvrCS7BDXwyjeWOalk9N9pIpOddvOduHcLl1iJKUjj44sifFxKyKcbPQkxqT9lbBvPL7lPV9xnA3lyeGKj1OJT1FV/PcWlvsZTA67hEiSopyqzJTqVCqC5RH5TyxajswdAhYWogFy7yNCOOKLOHflYxF4EfLAbc35NCSx3PrejWdv6zDqw4ZeVDn02XfexjOgOsRs3b5ouM18L59jlpMdspQ0hZUXDnSJGFFFp3usZeJiAys+acT83YePdVZcvoqXJo0Xwd/8WDVE96YijCgszLaGltEiTAr0gOKqM8GofMZyqapMJ1Edg4FEjrX3mXKREHxQWcTvs7HSAkPFHh8D0yL2UZIiSFVlgtOJy+tgJE6/JdLdcUK2gbGAGPzgsBjTcsD5UkbquFHm9uLoftLYcTyjTRZGxlsE9dvjq6XaLAhXsvaC1ag0UhnFroohfIiBvwx4cObuLXshGKl1VmHTSn7lfro0vL9u6i+x/A3Mznwx2wwrZ2pIc0hXYB46uDOy8w1Tp3Z/y8g2KgQ1p9x2rUF2Stt9mPB4lpQGKESExgkbWVfBiaKvr0U0tnzO26x7bg/bfsVImNtCtJNgswjRqbryo8iuwMzTZRgyDd+Kb8WwLoIpSEhiCzL26Pzct1crl15s/+KGyJkztspAZFR7H3y9YKBdTopK3zTGEhFmUwpKdzGCQWovNLkMYf3aB4mQVYKhOQbeBmNaqAjoptrF7rQVjgkL6HKosDyN87c4kuTrOZPVb4WwixTZCMDjQrrq7XZXpB9n5oUUXbCu0DYTcBHyvGQU5PhzGigFuc7MlnnypGF9K0Rd/2zd658gPNAMLRelcZWO/VT8gXM+BRNfRIuV6kX5g9FdUzBZ4Pyl063r2UG/k3p2vjL272Vmv201AV9zY9Yk72m3glHZvjtquohMKWii8pBBXxJig5qauewBlJdcP+ZkBlJ6pMD+sDTazFDkeXf4u9dQgtruFur2nce1ddxU7MXitGtCd8qb0wR44xfFPQ27t8bZB7xOZ/dfoAL93HQS9q+KrHiJa2lZ9aLHgIBZumD2S864Fbw5scVjP0Y6cPgLauN8vzJu66tDUYPlow4IXF+qMAIFdA3PBIRSSZDlHl/d3Cv16otcrAYSplt4ny0VUy9q1w8yl0K0CzJ9SAbzP8vybXAhUlw3yuDVLnQFc+c1N1S+hkJJ6zhiD4C4Mz3hmoGIery8jEBvEOpD/HWTCarJ1PRwx11jUrvDsSzDZ5z1LNubRvZaViOg6xfyR+MTYyLoPuo7AQUlQiCBRUBqvrrsWj4+D+I9JsQtH1tj9YlykELqEXdXpCJvBSdSGWSNvBm+6SUOqUE2pss9DCRo6SEC705KoWb4wUABxJ7/rT9iI/aj4hGJL2pztvKjI+Z8VLF2mRBeggBhOdgaIR9X1lFhRiYuPyA7tluH+ZQ1vLwc2Hb1Jk5CGcJ7YKhh4J12cGO73WZ6c/570HzkDrOqdSWamck1SeaogEAPH4yno8DLdqAwm9p/Oj898/kBH2ea31UdKSh7HMLKjgw5npIvgamVHvrZqxiqdAhwhy93rmbYAVEw0o6fyHwDmeBMMjt8hQdXPlqeFYLtU9irwrHtlxK7d18DnjTrM+L/Y6Rxi/FqTfWuqYJv2uq+qhQ17GD1tOcB3v5NdT0KJzkDukgYYgiaCp7ORmWqK4mHsi7+Jw7PdiX5BnA38Tsqdo+gX0vM/FHL8saWsF6MQH846RoMCeof7U1lmmJV8AnY5P3oULd/QQmeoei3hR5+oKmJptmxkTZvyvgC1iAPogMifD0L5Kx7geybjEP547h5+kAs2CyFfSfsZfiM57ai4/ZTfJgJMQqqE9aXJpJtcHG7EUOPOKyVrLGPcsFbdxNxM24S1zf4DFgIQ/of9LpeckjYwYTmqsjpjUNf6fPaD627qQv5Ppo99dK10k3qs7m/Lw4lT2g1J94mTnaf8jFxQiJnG+5UAG0iJTl7qojM7CUqI2IMDM9dSTneAo2kl3QOmmrThett0Wx182s/dTHai08WGD20SoEqomCsgv/ZMwDpolFn2OKXELccCpriEPRSAiLDzzu7rPXJB2TS0P0tetsEkfShmRBPMg6Dj/KK6Fp9iZDd67npzKDN37zafvl9CIiKX1RZ/Hvlctqm3uOFibndesBVejDki0RDITbZGxxl67a608XAsfLYwEIh7On4CpQsxnJGfysUbgNCJyS92FENKW5UCNeA0QCH68+YzDNHoHEYzXiVfInhTv6tqnwem3LN4x+CTjTN2JXa3owLz/MFrmRY2zfACfkPbHTd9bQPXRKHPRGnSARY17PveOHLuQRBPVykEbPY44t3KhPpI7+Kh73vyTAWhtoxZ84Q4Hkep0yTH79bD51kBHiELmbHXg+vQIJCYsyZ7vod7s19OXorD/bQRes3il+kfyYsSvdonSsYBz0g9bkyvh0o7XqxxoEmuXOPQi01+nzvGN4Z6uKb/k3X60kOY/WxNJxKfZ8oE7hbj5HRZiszRPR2Vo866l/70sJHoaclyX4VGEpkWCFbEckd57fDnUBnX0pHimprmjpgS5dsC3sVsx/ehAppvBeLL0ivIMeQdibHLSuXAWhRw4xRPZwgZfCMmFeMumegWvfKocwTVt2lGOke/meVMP02BH8ZfR/DgpQESRSvRagtDCmTyX1y0rir7S6pxm07srt1HeQmBtQdiJI+Y0MH++k7eH/+F9zdLS2JoAAL+sTjuNQ7/n6mbipWEgJJexGVv3UBONNy53Ijd587G55P+qGpDOxKGwlXLTantFr0mKdRSrX/GQAGZd6axS29uPOtfzBeZm6m3NLkMh23a0aCcLz8DF5EFKclSglCxUwDwK4/xGT0xm4syAbrvFhkFo0Em1FI9Yr1MYw59uOJBptgJ1t5ZU6atCWMFDHSpEQ0rKpCLh8HZ+cF7Eam1NB0+Yz06/VHTVt4Nnz5rxZHSuSe6OrUA+dwn9Et9paHni3SxukO5tMCUj7KZpD/qrNezByMSu50yfU2Kn2fEjufEFsIpTC2P5L3ht/AgN5wrW6uKgVfqUXRcmkbeqX4mHYNg4JE7Wd3bTYPMrT2q+g2vog9iIXwvMuIu2JchvKDjXs11eb8PIw+sK/pLxotYgPjcNZmfDne6wmz2jDJXyFkb/VmqaLYZugCt4pYscz/OTOqi0XnZrNpbWM1L8mfDHswPWkDx8vpzOOghNKNoVaeI7vaxIGNDO59rxKQaw66A/HD52c3zenUoCGWJ3il/eHupsRSpvVLljnfzIUNU3fSPQAKzvm1qOfKyza2JcceQcg58irgJe3QklMz5+StPmHcfwSj4qMEat4Ju2abrUxFWBbt2mX60XDOZYFuwTltVIuurP+BcAnIayk5an+xi5zESYDO51kzsRi451cx80/PSnk+AWHlNMQxFvjETAxvNaJPYdgL1GDKHZKK9gatVIC149t3j2BdIUySAocZ0GNzH6i/mdXWMWUo0wQ0AaWshXICG7blyi2QhzqxkmQcKaPsmES8CjiMGIiGbkVeKLNP+2OSt1SrAC2Wr8QVj54w8Ne+oqtxAqsW3ACn9XXIsn4mbWcSDnUCGxb5KRKX5YQWUaEbr0nT1mYorjGm6VrPyMxoNd80IwNQwgHjuFrGdM5YCp3go2qAJX52asrOloaVdH+hm6BByOfzYiHnPbSurOwVvQ/+JEvu5handEZCaVSHCyw+fe6YnXEX0He9yConhWQuBENbQYNcl+QpmJW+jhsuMxcXRHO6fctLf/xSS7thagXbLo2YeUK5k0w+EiKfTK8J7RGv11SLfzwIOfe20Bj+QlIqvGYmd5n2Uco9s/7Z53XEPGu4+CJrVAchNxbW8rwk4LTjkWeRhc0+mg8N9SIdg1UrRgo4sf7+pFckzTrMZi7ju9QJ13ob1ohUsb7Kv+kqS+0/ZlzltHlgL4en5IYd6xztypSpDamV8kJfaAyhAAd8sWNywjdlNHIbkSyuTosA5d2VDbgzkLydfp4uvz9Yz2tIVxzn1wxJUJPoPMSB4NqVU8aVZ9j2hey99C15AfrQgSP42DAXrP9EtorDEZK9KVIhyzp8xjO83YfjCdS89C6dFVj0UtKqSLXOAbsSOZSSrQLgl0/XUH9ovu2JHVpfGoTm8Dh2RhoVbz5bUsDFUYm0JlHUZbwFOsoh/VNnVuIkRCofcYXdrB4/nBf+/HRO+ZTxq7qPoIvLXU1SZUtjNp1Lnyn1/fMZtO+gW+kql45LZoEIUYDTweG+qnuGd71sGt4rwIHWs6833BHWLCaiMmEkPraCodFHsTbf2oiTYSiSnutZgzfr7ZC4T/dcGhfO+pIP08NKLvVtvhhUZLIh33EmRiTuP82yqxmfuMNQAMxl+Prip/lC60Tlm/5ahYEVRfjmmIUFLDyFV+kBGUDIbFuH+Zyg7eFXvA8akX0iwUViZhZ2Nv7URk2bptFy/ceJNS2oxFocR9IDzuvJICh5AXGoWemsaho7OU1lIP0Tzt2FZBGq1y9Vu7+yzrK1lScQ8Ij2D91mdBlScqKxxQJrpa0u01ZWOJGndUerQ1NJ9897oSRk4hHJA+Ud0ZC/sBjozt57dpd+SKlamjHXBdIDqoT6UiFwVyZUUfAu15Vd9xO2haSOGsAoC7rrQIEk4JG2cnOwgKz7+ypUgiSpfr77OSyV+sWe6TlTnH6G8P73dt40fe8e2SzoUqZ8ITvnSt+iRJ11JOkeaCshqHaU8wRcZALV2nXMUsW2ZGXske9B/rbFkIp/ut4sGTJcCWqxyBs+usc8HlU3OhkJFlCvei3isjsIzqm0ENrf6tiamxKNDpKPsfkLVNCSWKpHgvAd4bFQRaY1oKXXnNfvnl3WbhxqIwQ/15ylBhvKafCRwedxV8tGuGSLSC8MnruGyaLWXuGDJR5qupKHigZPDeZHlwsMB5aXq4QE5hDg/f5LYIe0AwrZtRpUE0jMIku9uj7nawYigrIichx/MeOI7YQmLLY2NSQwp7+o2teOzf0O6aXGmw8uY/zbP36QnqBlKaWMTiG3zTffu2MQguG7Ep1LZu7pduKpwPlfVJjOzP5L1mWmrWnvHIG002szj2PzVKTDKpKeqarnrIOJ/toFdOzYmsNC/XK91mXRj7j+avWQ8ooiR/bQ3EgE5x51XK0wlcQYGy3kwaDi19Zlk0J6gWv8MIKEeirs8UMz8GCLTiMhH5sIlALd+qhln+LgBV7SVNgLYL4Y5PZ9v+eP05oi3TnkKMbhzZqWY7stPV/fBEQNJItGQIlGeRB+1W7hE5k6VW2Qtuav1b0fNmfH4qEhkdk0w4zZFjo9ImmAACXP8jIyKAj/imbfJ4wm/ANL515uLGAsoI4lhK999NPequFQBQekBth2KvTY97Zm9wMPOsaCy/r0j5e/dVLLDjTXkGQnxY62+mPmC5bhrK+Qr5ehflv7rJX4sK5dPKHohTHTdNlIS5m1ebel5wRkAIHnhDWpvD0M9LQYlKk03jm0bnQM1oBdu8xHonTMuYCKUID3YUMqCQWivWpC16gDXbonRvwFtqwdFIzGtLTUTsgUA8f4X0rtrcPOwl7YH2Sh1yrVbEAoBK2YeI0bKtvH4ciClsd95J2fJvc3RFRGkA07M1Sre4QEaNtIRGxPmVCl3RR5PE3MlTe4X/gWqYswbrFgH6MKJcuUIq9DrjGsecTO+GXEWdjgYmjpXgNhUTDjOAUV/yuKGpS2nde1HVt1Md6MzeyMElmGRJP34hsDs78mcfSTx0GeXnRaUo6VznuTJSjgeMtbcky3j074zMh5O2+AInUQnUd2pqbYJtvf7ClsQMC+MlT3OvNL7dXwBRFMym2wAoawt5Qi0wyKp7ItjRQZa1RLBZ4aVYJo3wndNHsNSqAVRFTc8CQN8FaUXndWweyboIOsamwtLXud7XFk4a0so/zW/4aolerlf+rph5kovaFX8QumPkszdmP9Dgo93dGhftocAmuhfzp0z9J+rDkCQltmHuiIYDSxPWKItWvZQMjrCbBCHFvtnUTQbEuJI2xsiOWDYNMxHJcjCfTinSUdebDBm/n0tihx2/MBPqhOyUNwGdN0lgOED1OwEXwXHm9HELA0WxlYAi4zmtagkG9nlonrVzAMd0/rJ7LaNX+xZoY4gfKzB9Yv5xg0vEJqAEKaxpYqCBE29JYqCBzsLh7RwyfMlBYgHCwN6zoe8Bli/DWorgWbGMelX2denQs1DFZzIrPJpSCKv0+HfjKGDpTyono3F0G5JBpfEwxr0PIH9QkkdLpMNcorNUKdf4vi2QejJMFQWYKKp1oXhySaREqjUmLOkZl9oS8Jqg8s0eYk+2gExyX3oEoNkzWhFs+BTY4O8MVvJ3DnJw/46TvbHdENSozWIkJjM/YBM8qgR6HIMTAwhO8LAfpHgm8x7LFb2muaC2XqORxZMJX+1jjGXZS8wnvu9yFjX9D/gnQsJR0CcOxo9H2coHpRp7T96nMp3EK9o/vWY5UovwCl+kZty/O87QnCNnqTgj25WucsmVI83MAMyIZk+2CpqfPS9mwIZ3O5SppcDaLFsBCfap/hV6qqpOnMym6xxg17EGRxWVh5ixpwdgGAvQGyLPGQpzqz0KKCwC0K2P4BMALy/g5fYbpRSvME4TIXWyew7im0W/iO0Ep61JGKLdUNW+2AgErJ8lqn99FZb/K3G7CtAumf2eegF3jnWZwUVHqfFshi0LW26OkIihqEiKwouT4cI3kfdFps4r2MN4VctIcaMZpdAGQBqPVIBctNOYgjthq1msUQb5uNWmfM/+Nv3HAQGes4BMOy62bz5nAwrO+afv9tIkUVyWo+do8W/N8x2k7BzV/bXWEMiccVKPEDfzOjk3e4ta7FX4FbUKQ7J/9fLHuFnNkieQP2KfVzEPek81iIg/s+hV+U2C4y8JyAKdhpwGNnyQGSqMIm17p/W7C44hjfyh+2Rd4nH9v5L+5KMx1hvmaBlww3Sl/PcFSgENTmtxfE4K5pYBwRd2HfJ7ejXqDfYsMA2S/dxZHK4Q3skF8x6Ldzgkq7cRMJZeQnBUwrhKRWJPnCRw64w8O0eT8xt7bNiDYtqIhbvMAYi1aLJTnd56f5WDGeq6K3l5fvCN9Bwkq9We0G2OkISNwtXajG6jTyz/kWghgGlWlzCMayNWSmABEQ0wAAkBdI2+B6PPEQf2GYIwRVGCctGsnKviSc/ERISLHoEEXb3PKQ2ZsnKM1qkqjEgF+cf6sZpdwhxudF0rGDclGEErwvzRQYra1xBujnGWYLaLzbpPzt0a+aLwfbYYtwn2ETvvgaBCaHgE7foU7amX3cR1NvcrQYg4pHJ/ACz/K29PpZEWTczU1mPt7uX0MGu/KFVZ4uACmPYVYUeTGdNQEEj4Rf19vTexJiud4FnWcTo4P/LoQQSSaFV4Oyy70xXW0T2A6U422YrjMtUC2RCST0yLw+wxy1+nsl3/yGXmLywp1vgPbMlg10qEhORM/dZQ+Se69QQRlIpFyj8c3ccOmOSy2xxvdQ61eSyf7RpdFkCfO8sJkY7A/S+D+Ywnvfb/GharzwlF1dpsg5k2DJHGsjLI/vNeJ95eXRNouTBZr22K4qBhgNxp6RSDmmxk5mgY7x+C56/tReJfvUfPj2L0rNAAI7HGighl3QZ0/CwTEBUBTLbc+epP1OZqHelJNSpZGzs7SSS1dEqCd6pVlZ1wruZ/gA6wDNi4UMJpCH5tYSq3zz0+mWpQJ3yrZs51IhAHCgg2NjWQr1dfiSBfItg6gC182wMVXkdnQn0xNO5xo0Zt6lFi9eZcGaEZ9mkIkN7qiSktVHWczfB3zaAq6GuvHrOGedxh1902Wc7Ohj7qUHm02DIoAidSwSFkp56NEA053ivwR7DxNAkFqMYJSGNwrq9lqhbvyuiUnwAol0eqQk2UmeooN50rv1WwQbyxi4Orv6A3ATHFRKQTMhJbp4tosO9YB6T6ZtZrWFBc1l/ppLkEUBQHqSgwIGlCLiLaxnYJB/EHOeDDDcP2xD4f7G1+oMfMNTNKYfP5vROjuurbGWYkewSu3FhuOxQkNI7EP89bZQ8d9n2xG68NXuOQFG5qMcDKqW7MI5CL29UHA/npS37rfxzkEa3uQnk6n0dG34I7pksbL+XGAp6wn4U0qFsnxI0jIGLgEuw/GOxDJddJxl1C4hxJpQr22upmNKgGkmiJC58RR1FVfqqhHkYV23XDPwtBTFVsRTii0ufmV0wH6cf6RSgnW7mHCReTvhcFrYGblHZfHi9gKvYptJ/+hn1kr8IgG4KKD0B8Ufw2o+pqpwNLfLaf1BwGbyVHLhzfzISG90obORTmeWKm03AMOPwC906SrQPErfLqaf9SLM2WVXxmpYvcLngjhtVCqZany5l3YWBoKLTiNckSVWGSeSfC89evs8K5VHj6Wwu3dhBp71Dbv7gitDKWK8z68fGwx/URxWM2ftmGC+d9MndESmKHZOnYsWrJNtUVFd66n+R7B+5iRaFi4LaKycBw28h6gZF6IBiBHrl40LHK9M4OW6GHt+88swXCyKXbVPoqSV8SXGWi0J7A1XAGkYQYniTniM8/A3RTs3yxIxHF3LVKdNN48VumeFW6Ma8Z0fhWqVvtAIrOIdHI1rcnPSzzKoazaYthf4n7cxLSVIsDwBnxiydClOy1YcLaNG3YoOfeABycSV7oxp/Y0speaJFpDeN5wViXvF97TG/K+mGEgC/oTIxz52lrP0vs0NOrJo+oujHPn9ojsYKah3enFNcItNBg7uzy0dqRLnYHliBSfBV0GeXzJJMHTWbHUsbR8XuyX365IvNvuhHJpGFu45rYGSEZBi+DTMM2QkZccRpo6Q/EN6uQfOChm1EIJ/XrmKtwDRnOwRZsNonUEnWn8hSCkqGxU1fcIIsfagxroiw9OzjFFQbavU/SBuYv41jDfZW6EUVomvSSVv/7qDfy/+Mbg5nk0ZgBqX9y6KOvbXBYT4QZAo4dGcae4CuPT56phnk0IETVERlwrB2LT6vRi8hiWie5FdfCZ2JETaZRx9FsAIG5RDmmE4mvIuzGCQPIIzZgf4P3hHYXOkc7u/p/PFF702uAn/LEcQRTsXDTLT/EUmuGcjdAMcnxi0q91askdU+vZ1vNaDCDYPRniHRBJnFOcTO+iGFSa1FxRfcGAkhaJPOZBCfbo3QizLikP3iEwO1Schssj+3bbfMwNCny8GfPwwfx1AuYx1N1rVtVLbEYQlPVaRfBBcrnUc3nakjbp0rHQ+0uh7asM6tJ/Ekeg4SYCHhVnXLzH4CBP1mpD2BFhT9EqOY3729Pj3xlOMLdmsVdpnMJZQWLPy7MvxvVvf6xWp8rtrn4N07PlfHk0xXRRlyMCZpNgEJ0RE0JvgpKudx9wjVecpoUwFQSGxK5jZYxWJUeo5AsLyBj5zceeNynR7rvHhJDknSJNwQ/B3ezIXj4wk/TYdlZ3Eyd08gDQ9GgqI+9DQbTfbUR+OLzs5Hao0kG8mSsbB91H0NzJVvX0fYfkyPIEnOggeltilf+DvM3h3Z9aoayGY8mEaKWzShj7PdKCtaknnYvSOULrwrP1XyCjrmJRJDkrbOFVKspHT2TUC6d3EP35fRb+yBsH4KddKRsQ0lTf82bzAeRZCePRR4nmJfK1VtnvoJ+n5PZv9bimApE0yvT0yC17Ctu78N42I0Kh/UjOdd1JwIi3Va+g7WQ7qlezYdIqsxTgTq0JeN58ZhQsLHiqmt99rn+/YETMhiRbTGMjgLX7CM9eKsepoS8C2BCVgpSzB5WoqmJRYYVdcKCXaZLfWPNNofZUnvIhrVcpSYR5yn2QnYnOVHkj6KphlKtVIYTU6H8ww3sQFkbfmTJG5qOQNXmTjCkJgnW9lufO56tSsyiKrhSAYqocYLouz9vgTOUdDwUo2+MHgpOM6cQRpftRo1Z79DnZVmIdFFm3HopulSVm5YvLZySq4fQ+ZppcRlzVIxOibvZcF0RF05GEHB5/ZYq4Nau7EAvmVmezkcvsbplyju2Uh1QSqg2YXZFhowmnzpO60porJHADmP/k1+qQDo+DmX4138RfBDQVoW9ta7uA1yZqK7pHkgGWV1Peze63oX6oda/vZG6vdJ8bGvVYNBirRCmwwWmJ3sYz2ghjubW+L+i8abGwG9bJdpOj8LITae0QxkyaEsj1+gxopCKAhsJ9S/EN1b8Eh8miWScgwOdyOiPkmYpRwiLvZNMi+i7y51d+WM2GVgjxwBbwHFZallEPqgyiYbeZnvFzZiul9Qj3ZjqfmjkvOanlc+7Qw0ZUqdU2gWXBKQBZk2TjN5ztyXZeTa+tK9FcSbFrL8T8tCGqNeTKhTbFda+yzJAIE+CaBvaXXso0NqVt8U2vqBi6NDoh+VX/XT4wzBDKOpmQR+IxiLUWFDwidzyuD0vyGC8QyRxqappTVNGEqKCG2AHkHCoIImH9Aa1lPhimkQ2XRSysJNnX5IXp1KdBIksGxYg9vFm7ycF/MGHqvg8+VyWLzSOfAAVCQW8mq0PFqtp/S8lI8v0XzB8EJsWD7v5qofdQ997nVA7H/UUKfVaZasB5xkLR5gUFYlBEjBsCkgXeFrmVpLn4Su+W8RJgG1txH1fnu9Hy2FmshUyRQqr1PgBsZ0je1EfTCf8h67QPSzNnEr20rOh43Vu34wRkR/EZvHJXSA9A1AVJIh1gWi5pyvbDgQHGYJs8EyEm5O72gPukYsaxo+gvI2c58qIVWFG1go3w6VximgpYdUW+mTxWNAs0WXhicsES+/q3iVD7l9u0vBQoMIs0G6gETRDKWv7fbKN3PORV6EFEJuIaCOGeaERsat4WpL8pFOvvv6TWipeAdI42LSF+i7pyzoApmfHj3q87iy6xgXRofREyeokwkfCTER/Gd5p96j5+CrNPgnTPpFuVJBt9BxCPnHS+KBmS7T9MCbHXTjVrPAP7fwt650maUibyJYY5xlMZDN7OyVxN6gKe5OO/wblFIXIzg0GFdzgPg5tcF/IlxoHJ3JHkChapRxCUrHID+yHwVDLeHwpKc2wVN5r/dhTRFUTx4X5yiGHnHcE3EcJ7H0NbiUbeoHSdsxm5Y5jFTOJa7lLzP/GHfKO9SIpocWQMabx2AzOof/wrhrEcArOEL6B8MGgc01FLmPBZTBaFtlcf7tAqqTCuME82vr3zibQKxsjrqokBIvqLy3wdshmQ4UpNaYqIDQKhv/uvJ/cScP0ecyiEhzs6bn4E/V/2uhpPw9ZVnzo1JLiTsVrmZ1DVp6JLh4qYLa0MPSotmUJdwK16aiuCud2EOEOv9jcuQxLvBgb2t2c/Mk514hqHTNV2vmjnCSrO8b8kbqnCe0yk4FmJwMd4DTi5OxmJBUPj6jWUu2P6YWNwriZACRyGtnnXzzhaq4wvzPUW4LZKa1RnfLktyxtxNS+VTUabp+obt4JIPWt67yNj0kmalH/qHObm0CQGyBqj4oFitCXefRlnwX77Kcs6rusIdBHKfRvyZ3wrgSI7NfGixf88+GYSPzOxOymNcBDOUvL6Civ0ZzxK3ktx3nk8/Y+OHgQRmgfFcdDOGGl4vGUoGiI45+5QMD2+slMp1J4Qx+CNAlMT/JSOd+tSx5dfvM/C0sttTpxmZzDhut6lNMlqYimPoFlgfweADqyxsOkRP1kC/fedU325KiqOs/4qEQBXBjdIb79u0QqzMgXW1C3aoZ/e6SxvJgPw44hR8YyXssWrVEaF5jxszBpVT2eEyzBlMc+Eic/VZlrCWo9xb1eKVww1soLJG7DrOye1E9E9K5LQ+XpcSThfrT61Huq8Xbl7AegYoxgK96wcrqTPZvgkHJibEsFwgC9n8ZVcZNeXHpziFS7ZxFaBeIK3IvgEzKUf9BpZ63CF9oW1jtYx+DroBJb7xizSlpyg/vlPs1OfkJANKzG68eVP6rN8HjHy4IDQBXYnktUvYRGlffaxWX7H6Dmx8d2P8T77EFTZ5mgnY+UaR8J8KD9F++SUiAdeLtsI6ioz8vAGR2GRWpaWWsBOzrN+K15znZ/f+c1Ma0yDE8i6yVaD+LzXf8Yv7zb1lqOB3AVh2bHTT+CqN29Zt3OaCWDKnAemcEJPmJGqp4ovFHBHmOgsY5eq/gnON106jf6AM07dY1Z1774y8eWGLy0obBJsGi/kul7s01CZ8m8pf94b7waJhx9Bf+R0+dMFUMxdSpHQD/xFwUNJKAzMPtc91lW+QMvfwEwkSHDevEpZwzAFOVVhDEqt5JlH3M97m9KbAHuwEydxCN6heMvxnfIEEtV1TbHFkljL8FXRy5BOV4ByTS2HFBEAcWjVjdtcw7X3Wws0XUDY8siC0TmJfs6t/0DWq5e6MlDQvkIF/Rms4uvsKGCm2eXEjPArljKQ/BbCwWYByEKcyqj+Enk1/mPyYIVaPeBG3uZMG8IsjhkoaE08u7k4+YJTWQT981bThYs0a0C4rb8PiCM+mSGJ0IdKnuBuWF3xUwxNte/WGLr8KjaJmpeZhDH1jNFX5RO/+VJll7MUnEc8QZFLqaKGoC5heaM6foIopCas+OCVmx1KELZ9/H44xita5KHhROXxhndppUwQ+9dLCjoArjfkiA5Pz/8iAnEZEf3RNy5kRUpyjNxfLvogyT/ZpeDHGq5CuNwgLWk0P2Mp1yai3gW8quEJT7oH17Jq/dINOTJmNzVPeelsRKPB6sgpzyLKozFbPKDzKMcyOamqqH5LG8ZFrFLrHE2S/A3/sqYen+WGNY8IvJrlEdaKPTaMXWq37VwilDrJKYzNLjjjX5ZCEBizlfHIK3IRaPTsIoinvNPuQGlb8GO8qCcNA2pfrqD8PYXm157/zUcWaNbaAhP1uIMG0u3UkjTheaGGYESwvQBIZjZHHBwU45xrpARyfYLI3G1nJ9HvBIxlEnHaw5IgRnIxOo4eCCbHSbEv3GHKb6DxZTcsC/pW1yPFREHMX6Er2xf6CvKZrig2lwd6SeA98GlcvBOmxACsBHLATlPk4nk434S/BBWTM8+3P9Q72QOE1Nm4zDquTMw01bFOfouG8GltFhxqiC/1cTS+hse0xF2+EQtw9v8c/f+wsoYqoDXUQZrhgv3foG9V5jvfmd3FXUAqMfmPaZ3V6R0pONulLb1XLsJHWfGzPZnNGqaVQyUF3wKIoI78aAg9o3SX8I0J0pwEgUzLWLRmWfB7QtHcZJhP+MjDSo5oPqEKX8wYbRJS3CRoEoUevc4qSkd5snoZnfW2xCYmJtfXSTiuO2rPL6wtq4gwkW2TG6Tyuk2y7L8/DWW9+7GEzsv/NqTwpaGELgywqdqnPzylQ8UHgaFwWZAL6c37Law0Xu/iGFiAvw8eHwG4pR/8K4/GIA/orp1YLATStXkdppE283K/XyMI8aSRmVLYM4gvDAv4z/3xm7gmE57ECXJlvNWgot2XCtsULoI5gm7sYMNrFwj+t5K2oXUpJnllOd84HLm9bCBzqJkH/XN58iumu8UnELDDMWjkSkujoAwxuyZI699HaFxberdzzZuV0mynwbg6kYx7Elgw5LMTvs3F9VOj0XJddZzPCd3Gxko/kKPMhNtq06tdFDLVrxWNPtONxfQbE829fBcU5DqiyJumBcLkVcUnXCpxWfLXeAEvDGVGLFJCUkDrWJz49W2QxtxQw+udaAbV9WZHfitOdWkonE/qcR2YvTQcsYgkAx0vr/x7VVPoyoLNfvzQyPpkvZgWCKT9P5d62IB9AnKbl0QXozqicldroLX89L21qGP5XQIcMF0eynrntOTqWXvFtplYNB0yb5sT0pX0I3irZPB4pT9Ogjp9cuHB8UVIu1FS7PBOYVH31YjNrpxXmRs58DNeug05LAbXb3jnO0OJ7xrgMiiaIgbDLdwGVTw6+FImSB2KOOhzec8uZVzBYSK2ThMkASKrYJ2rpOHrC12oXQrDEjrMxBF+bj4NEWrO3VsnVk+U1073Gm8e0EVR+BKS4rU9hcbGRImU62Ihps5bwuGfAUuG4Ziu4UDUXGRgA0/jBCcqLJ1bsmmKfX4g+1lDgI4Sekeb48KsnsQIUxqWXLd8aOomujS7Znp1ZGQbvirxRC9Jhif2qG4nvtbjsOl3+pMucqixok8R7iUlnvnA0D6M8SM6PIgd0MYseXrshcgJZsm2cY+uQxIZ8T+h4e2LbwocppH89W2Nbmzm5XjhYd+WX0oQGTMj5Oys80Wo07Ei6AXHkR2R/tTxvpcWGMq8AXeqfessfbebKbFzYttlg8HMtUmR8GsUEEIt4r0C3BlK5KWURzDYECovzlCVBXLSJhcqP2ao8eYYoCQmlB+bp7P0cjTp9Zvn8SpcZaC57l61PlQ9zFC2kRp7MoNH8VjlLeDX/ecB+5cEicDCSgPC1sQKzQhbPE9vdPE1ZBagfzO9N4OeSWgNzOMTDpjC4e4i1JR/dyBDqmptDP2KLU5VK+T7GapmVmGYso4HmRWrc7KkPypEHefI8jwb938gMknPJIJzXruZgvIcJ8PZ0IcfYC3BDID5/fKjFRzQksuvswdpGeaMMhMbGy+aHMR2XNfWCNZWKClzgM85ke6T3auecaiQ0nEESgHR17Rhp2XU5uiw2UBgh8peiy8olhZDXUmfzS3B9XdT4dDSGNB3S6nUQK+JR5WVWIvZfu2aA/9dYs3AOXVDgSDk8QHvklY20hmZCT7sFX9T+XSYNECcp7YgShSMZ7W+2qfJgZFtEfqUDuXr5C8thqAz4adTRhQCZQXTLubzAGpOJnU2zRxQm9M7n+44YJhRHUkU7f5vmxMB9ZSPbmH9gVNFA5uDbifVaA4NSczIwvNzpwLb02kRu7qF4Pkuo3LJSDrHLnxJtieqnUVLtf/y0fU3OZCtaNVku6MkI+QALoFV6Z52tQxbsP2BK2Tvqw42QJ170raG6FXXPBZL5Kurk5/zY8P6vtWgBtj8N056s6nYRHssVWgj7Cdbukxach5+WvNwn7QwMlBKC92JVnziufVyaYjCNOSzpSOZ2NBTNaazOh9Ix1TkxT3cvPSOM7PgdAhuSVJNT8uuByPTHT1qJ/aKbxIXxuy6rk1T/LX2f9iIGfKHe47zOy+7I+Xrbkkz2ITLWWiG7QLx3H0d6vaMDqwiK2qL5r9JkIIyodTh7O1WElmMOLZyXaMhlShJ8OS43H2MUq6+Zc4Ia8zAUN0RZBs3DglYjj5mo75VEbJ1KmYXOnwbjitcii5pbZHw2srVloY06G+bVNo/68ZGS7HOd7wKb3Ks2QSl+baurCFOjrMZMoV0kJwjDA1iuRLg/o15iMmxtRaRdKKDHIp16N+ntr0Cth8FnXivAfU1u92X5idD+iH++uEii1de+y50OdXD+O17Y35VbhX03n/9YUJ9pKh6fyLUcnRoybooy+WxZYvwuNgsmk2lYeF8ThJc6Tifl4FOFDlTFS6plAp62IjxTVYDK0QYXTCPJ6H6jou9aD9qLm9v0oR/NlCpBAWwXI0gdFrzk7Wgwb5ozimtSbajQZXiTGb6Y30KSmpCID8TWZwgtPK5abZMZ1Jb3nAKTAoqt/10FN1vBpxlY6bPRM0bJA9sTamCmiNY7MBFF5gUosoHwYv8HRfTdMpTJ/Qkhfg8+IYHw9QBuAn1w/6gXBHHEDIlO/HFFteEU047Kqxoun/eheP8/sQWhCH/ZPutyny34IgxuxUZR3sC7OjM4g4VIJ8i/SWTWUszpxGeE0izCIjvfFVeV9824pNn/WLGGSvehRx4CDSBjaGJjoE6NqhHXEy1CDoWQuuU0wFGqwSqNMnZQYriCJoN+gnPaf+75agQbnTzWOOvyNXTzvZZXP5S3xHU7GLmTElv3cYXkgpBvblgYGQzrMBg/X4vjHVYmkJrDLBB5KtRYkLFdZjhv5Bged8cWgtOB2k4wSyDiAPcDELCTbzEoanaXmYd1mULMWAaDZMXwoosR4Wy8mtV+wpIKkttpBvsyrdgUnOOGAZqC2VHxLE6CkeH7jxz7x0zfbqHs93+/ZmHjNeJtBsPswlMuD1wO7T/25RcWJLqDyXuvp7LwnsvZEHJj8LwxEvwEQzO14A1rrm759bgAySXG5JtGJQDREN3h4mf2+EjISorzocn0YGUVV3UrS063ILkMuNwU2iIwIjVO5R4GyZykIU3b7PMQV5ZozzN35KlepMtIC8MP7N4NKk/dO7Ab78dLQYLyijaSA4IaBP7UrmxYzTRfhJfAl11VOMRZSS+iju9SDFWavWnvIrK5F66iye6WbzK2COP7LhhfX9/zRltbi1xbXzClpb4IhFgTfhzZAhxicWi8L8byf9oavWcAlXK/+tTP99nSWLkKE+cifkMxtymUXC0IQnG7hqNyPvab6lQrRG93ZxvJxRdjkf0POvQjU1lLQ5u4hBd6SliGpujcGYI/6kcTAvsJfURq4jebrMA0Mw1max5EYvVrZ0T14lcbABalP6xmsq4GOgRs/e5NypUy/zb9HDEecowrqo9aINAAoD9OcEH8pricHfI3ufuC0i7bLcg5kqy3URdeGOPQkyg7q5JaeXVnS7bYfrnxiargAwikC1qOZn5pBruVePuoEpekyNRfZEhgb/3aVS53zyU5Poy6VvbjOhIDOC/InWpN0RXPRASTIA9es2Poqdb1kdxvEtEXjAto6QiWCJdxLqXrkapd6pbed9Bd+OMBVANWTitNpuGyc4NGoJOcEXIC6Gj1W4tOZsdTQXiVCt5I1UA3rCRoZGY4/y5jxRttvezkj23W8wBhMCL3hqs5hIiwpGvjd7oXYUSuCnFitKrPiy0+WbMRTFYQr8XYzxG+x4sEMa+1Z6kw69YWYX48qcW4rBAB2M2ZkoRCzRAjnKpaxDoNoJxHX2EdItHY2URjFapWJf2lawRaoayk+CLhXCi4jZXM1dowuUc23LpfjYFK3ouyUjmBGPP+J4cf4kOvjy2WIumjdHp3YV2LTwHdTyeHwi68FlMdNPO1LK0vCSiRBXjqFwX5ieP+7NUeY5X/Cw4/2DYi0+l65EgIdxCGcAIZor7Np/km+o4SM7BoG8zueO5st1y0ZHwPaaYoPS0DK7HjPhPzFmpUOfzl1Yb8skoBB1Ninf3ZmtYE02yCkiNLdk2/a01C5xtsnLdpEx9ec4oF83OvXdytYNbvniJ1FuXIEdHWq9eC8YJsDjaGcjX9K+6oOgLnBb/jnUCZlVGZtc5bFRpDMQSPLCFW/MCPAzMK6583DR7YQauct5wM58qL661vXrIpHidwJwUZzVXd5UF/boUzji6HUmwKHChm9QvUmV0rpbYK3kg/3oFlPKB/bCMJHPIbgN7yuMV6cB0Lhh5yaHLnjotDgpSrr+NT2HAChXjvvV4mUYbV/LGFrZUWx3a9ZPyi4/bIi2fxlkXaeIdWWqzA3pxkuKnAX8vquOR+Y8E5EZ0L2joM2FDU5D1H0AaeEhlZKqFhaC29BmfFz98b3KrTeVXq43N3calAKBWgjE3QdgJToo4lfE4+48MQnsk/oJcmjpvk9FVwpYw5LWfpaL3Dlza/2beYfIkRYRxrhncmgJeLPKVWaxq5onbdvw7DfdrZ9PJYq9MME7kvWmLD0FqB/GBwfY4flU0DmhF0e2fQSkGJvL+KATvPevvxFVjCZY8w6W89SmmArgSLrqQcgh2G7wTEpbLIrO5dfYS6I0dDj8Ef9fcfmuC8aDk3b1q2LZCY4gHwQCLP45mh+wy6VpdK5qUKeH2kxkKo54F9nnseiJVnGl1ouRxx43Jld08HpIIIxeuJ8kBWviMg/gL/nqyqQSDXaHLcHgg45qXCsn9iGckKGoKenqUoY64FaJ7/yMOVJsDYwar9aF5v/ngppBqjXuvaBB6fKDgCmQbAKIKyGzaLJg14VTi34NElsfR2/ZxM0MrcQu0sDR7e/ptGSD2TIBiOmNgtrulVoYx5nfVioVkPFqWhCJNpX7BkDtUqVKoTgrrYVYVF+uJC6Z9d8uTT35KQ/c2d1AjCuBI44tPiOL3ymRCDIaq3ci3o4r93lk9/8U9Yev+dItI6EG8PChUrHGQlTJlRVyhDjo9H76nIkubMj3bB5pi+PMk3Em0hp8LLBjLqon9lPPzDcJnj1yXbzjzDE0tNK4ByfM6qjgbR4x91HSgPlj68j9dg3ZnhMtmabvqTQbrp/RuA1pTiwryraey9GEJXGnQa6prrEp2fgwHNlRlibBsfFxpAXp27nkXp9q2vZSGRg6UZxqjnLRed6IQaozswl6YwA2GLNgER1yaenA7StXyM8eP5K81MOcfsdX3xFbJKmNZa/UERGIxc9jYRXLnNoIcLWOlimSObZo1tOMfQKThuJylJckbqlPuRQt4FwIsCNtggXVtjiQqairx8bw/jngnWjPatjGIyekRcCecpQ9imfPF981bO4jnWfafIeS74brXyVmi6XVYcBwzbrtCT/bYUq35Q/NPGvrZ5xrRk2Rc8eaPWQmiA04EmwNdXea/hfVnLVFU04uBis3blO5fBIut3NyfZZ3P144AaPVODenVwaZA7oN+SH6Z57+2zilCidkdYnRNLlK/xNBBMSNc/MqdkKs3yuctkwJ0Y3es/dpVOIEifeYY9L+GpgKlPx0QMQoZdihZucYkAN42UTTCFxgF/eOTc1LMv3sR29ph9d/TJsjwMOfmzcKxilRufY2HOo8yvprONL8W11p8ZnLqx453WgJEpYtZuP26T54k681YgQBiIH6UCPLKlzBwX3qGHAolD/5EqJy5QAlc0tTRwIcEka8Tl2hzNclc/jR4Ex5YjR62Jsg5wlQIuW2YA0jqw79P7nyftJWsBjrnf0bkFbuv2PNHbYG3HmUVylC9MC+J5YrFLOLd3ukeRlVDS3vp6zb152MQx1187GWP29pXnCU9N7wXhoeHjeuM3u+jL6zko3oOT5qKsMp73YomMWn26NuCkhnuhRZ6/Mi7+wS/nHxmSngIqmtzdniYQqBHuVH6KSelULwO3iCXoIQ4uKQpQ+Z0mbCX30g/O9LCogpRAklOSBgu7uSB92lp3MRU/+EKuWmw1wV0SJ6Ufv/Nvk8DHE3QCLHM1ab+056h9NkHaPz3rvrKDONj6M5S71e6MJfYCYqkATgGokvehkVpAemvpIX6YCiyMBozp+4P1PJ6aD7Ff+YQKzKzBx25pt+PcDrrZXZh8M+OADo/QIgzI+2Gk0U5JSaIsmTtuov/tHBsQ1CkYWOgdAozCp7qxQnuGw4KPhB48Z4nNnP1N6NAZXrVZSufaPhtV2tvKe89/n/HjaOMPFB8eDA13Yc1SnVpKpiUImpejX8fHbKQdg/mDUgtC8LpuJhElZPVGaN36vrA0u1NPX/rGzckVTZFG+mkX7owDdDw+cC0K71KmN3mOstbFRHgHCniXFfBvOYWUbur6bF+ejVt//DxkyG/99mUpxtr2e/K5w2BVIJ1hJRCyVUnyPm6DiPDYVgCdPMjlXYFBEYeHCi0hu+4Lv1s9xQI/22GiVXQo0edOL9zRAZQheBOmSO/2ml7snnTWCzvqhPjlagPoaTtJNlRiwqgxFIYPITd6WHBxMdrbdMEvYudew6dysyCQhQQnVjWEvi/TVALKGsk9bo+QqB3n6PK+wA0eRnEh4PGxcvnBtXN8ayQtrseUHfe6zWhryFkezsS15TSFa3ORKD6EABqU2j2rehGuDB3ee7l7O1b+Bs5wNuT99+572iADWyulRhhFGG019d1MnL/5mHZMbhR6Zp4YHcbvuCKMYRFB3AFWoR66fbCvy8Lq4+ulbjsYRXR/RscaufWxrczYTVYeu/BEO+Tcu2193M0p+FkIfJOIBaHjc3f77bwRQxiyXdkLntiFtb0B0c+AWmpZbARNS/l5BWp0zX5bIPLWKvXNU6IokQ8Yh4cLXLY9Upl72+/52ThDS+4Njfy20B0X6u51qNZKfVIUJj45QQ9xNIvqDZcR6+EERGOdpo0+7fkmPAhSR2yxvCXBnm0vcoZnRBRax6x01d28bWo9wnhqTdteG3TyHINs40pZd6plJgWmlJi99K6vlx9XudS/egjLN8YOMF4Wa+1HnIKo2QXhbp0DVJPqWvBE6++Wo2+hOnYMjQrTNE8t2w93DWfIfVyzm19l56yfvIz1aPw/v5aM9e9mdtQWV6l7ngHFK5vN7sylXflUVSuR6Pu7BsM+LVTtV9XacxKWsP0tdx1wo+Kn6gblm9hN/zyvEZTseKih2GNAm5zeYLZlptBbCb7fAhoWFzKGRF2dL0XH/aoW2g31CoDyu0hhNZudWN8ubAkOn95s/RJ2m6jHeKV0bHvMVawf+kC9RIEWem/pHtrR5JMfAIYqtiM6R96Vo3w74qelubJ/f3CQGqrC3Lpta2Zk922NCO8pybD6HuW7n5bb/NYGbn/oh8G8PVtQrl4Bs7nexefLVkN/e/HQp9kqFTcN2FL6QH3Mq5Fln+Ismr88eDfITSXfNweGHsFsf40PVLDiZTMAbtgHouIcBfUOSItrwi7npQ+96HFxw7YMmjv7EjgbeqWAsKzbpcJKDXBYspSlUESxwengrolrDQcBu/o+wVzn+YOP1Ki0kO2Y4nfXtR3b97F2c/pw2x3hexORMpMLD1k/ViLffiw4Nb3gQ5MaZNGla5N/cDMLgQqFCnI5VMS2eyxStMXfHWq+7b9HUb0f9ugw9ZzaH2KIFmOsu5xbSgp5f7JSibQIgZND/CnFuFCWPKzTfEemdc22y5tCOkIbeE/PP7JNCab+Pph5EUbtzk8VWl5H0y2+6hc+rbfPEZXAi2Zc8+dGozhInpHu9VZ1yT5926jD12Ega+jUm8ViZqESbe9gJAEBUwK/DVD2Hn4r/13JexH4HTxgFd5zumYHiihqfwbhHj8mwgpg8ihoWqZrDBQ2J8hnVURQ6Fs2nPMi4qczQtbL2+LnPWPJgHPq0v6trjr4Vt2e7HFnyPpW0rM5uHepRs1URu6J8SY765jO37J32Lc6lWJ4f7YapCsqsJ6D6tUODsJK5lSEo7INI2tNwBY9BmAbn4XfQIr0u/mGAmPj34yvPiWDXyfhRgSKKw8V9s6DBvxP5GZXVX9GY4TaEOx+AFS/VFBMePHXem/HW+9yPzrLs81oB3z2JtBHgCqFUAS4wnUXq23487ijDPV1GadDyhKcx5ybu/M+zmdFXEmZWd+l8Onq4M/EdI2C1zywaKfY1ZNxsd+J2kV5DIUXevlYj/fJ6DNMgRZaQ6f/gQ3zqJqcxivx12e4voXUad3wHG78/s9J2/BaQisKzpRx7aG0+tLrldMyL1+IHuvECvYLONjsrOnGXoS++DUl2qKDh9QzfaSNlnto5VDlS2tgHtmAbje1VNo3yJifclB8fqCYNm92uRui/ZTyyFftzoRa4de8yThUH1JMMVotFMy8cuoMcGt7dV6KH4z3/THjYsJ/JSsLHnLV6wFonkg6rgHm8h7/6I2tyD0S5C7oqH1PekFJxP5mhePB04wLC4pOixlAde/VPJYq5Pq/cZfDyU0B/I56VDZdrQ741MKCRUtBti8LrfvMSiAslDI+KtChe1YAjIN4DENLikV8lmWgVcu5LXURjH5q+zJgTZUiszoHx0cdquPjUCJ6iv7EX6Iby9nMHOn7uITxhNbMHpo1TXC/QeRIsMid3BydDZyZyrMhg6yex66UvcTBMGovNiZzuQq+y/wnxjupdYKbxQDwhauhnqKta8r/+kw/XRLqXB8kHndGsd29cKg5LWZqYWaczsILSXzzwO7CvCHBNxOFuk1XzxkywoGkCohZeERRogpHrYjlOrSrJWnBmGcR0iFADMgfhBHx9k+CNukBhw6BN/n8ENa4lfdATfz3vEevfHxt/CUpXS9GaOATMNWILrGYd2gvXI0e8MkYNGgc8jsWztyiZGJuY7cNE85Lo4j+pO+h72nd68Euid2Lf5teLyptwvDzO5K9TntagZ7bv50ZIW5Yz5oPXiqEr/dhckAFdrCrWxxRpxqmob8weEiNAFxoy8KBGqN4cap6xdtWV+yIT75BuSZ+GmUd3BoAD1fbR5xuZbpc+M9zBNvjLrL2KNGc46axqqhzPoElNP2Dec1iTIRPAhEhnGJUjrtddyvvGaKoApGHvT0WqtdlT+5oePJtKUDxLerORvtvqzXWPgSm2zEgo2+8n8SjNPv6MSvjaDiVKHJ96RBs4DJVntLD8+coVYztyW9qbN3w7hBdTdDSCrsL1PrPKVEx5i+b79+WXyav4OFX82c6NNIXGj+FRpsIGVy6690nqPpkyPBnmwM6fizpiZ/Kr5X8K9dIfVAoT5Jrrk3B8RWVxlPZwQXf6E5JlfqQjyhV0iEvF3Heia+6tcoza1JSPxgvgz05IPafx4m/agAKDEBIs6aBZng/BxZgIYYZF8nH1vlaCeicHJ9KVD2M0jfnR7ml7de7l/uxBa7LBgD6sjdn+WlwP5CR3GbxQGxoLM5Ex3xQyYmMX9WAjGI+8HyDrjv/LSWrMfvFA04BHaHWrPpPBGYsHD0wfC/uZzf7ufCPVifEkXN0iOhBVXDLiS/kB5ydg6gvd9A9SBKrEiE2V+jawC2X1k+MLFCahiixnO6hQasJUAzyO/2jnsWRlv2IHaoGr/7IwQtTPvqZ+6IgdEkJqz/12vJHicvUjBUwc/Na7pgA/rvPQwOrFYC5mrrkHKfUU7g4ZkTmUq3BF+1rmvHa4K5ALwjlROnsYemPvArOhvNjXg8ehqYaFFuL4yGC3EbVC5a61jGJsXvmmuZ2bnEvIUQ2djBt3xdVHAEGNfLbMPJfGZVx9bqAPArXwchiZ7UMTD0UEwM5iMyxMDun6yiLC4BCAEaTiYnIVEJYy20DjY92Nji4hMo7FSBHFmE/fF2sQQz/Mk8KaZe/4hzxK+h9LSgwOWHkXNskURSGGjlN/rZ+C6KarrdkUctaDTwQs2eyNWYKfTW89XEbPKqxj59X6vy0dE2ReG+xOfrb9txLkPOfdlxE62LAUNYfGGqKS1jKXoPtY6HxwoCdKHOwrHsNIJYzcNPFnAOoq9xaiAJkuI7g4pkKEFxXUQYkn98E1K4C8B55tUkmYug0kDsIKglv6yLMzQAmUm2yI8DE/I3AsaTGcpXNBYLt9cOZO07Tf4qk/xZOf86pS5gGrzd72vf8GFl/uPsCkMbcMHEVcJM8NkG+nM253gni/h2RdcN1hImiW52Tigw5OOMqqUVsa+gtoxU+7gcBP/U7JN4sd/+TrV/u4DL9KSRZURNJeui7MH+X5EquIwl/RN5+ApaSSLx/OFS44l7b4I6KIn4rQ20P4jyq69EZyaT1aZOclrY42lcdJ5mtgaEBxnKSv+jJtQxyu3A86DiIdPTEq9EzT0fpDqFDz5RuiSAfChNZ1OpSXpgKF7ESJCVf9dFp853/YMZKQf26f0emOuRBC2CAHPql+LwZzltUH3tFZIkeNRUOwXCc5mo7vNQR8dQT/c8jnhbK/ZZfK1mpjfZ4f/yUih9IlZZ4lYtZYc8IDfpdOgJN2bZFCOp7sSwdPrWV0p4hWBbHWSkY/z5AE8M9dsyMvYZYZkZEVDygfsqJTszaJLgEhDjNdNAOUcmxfbjrXawtMNXxj/JOL4VuFMtiu38BmeLgxYPLFrH26fYQMG/mf+IemVuov/IG4cHr+iZr9u98cUbMH8KuexmPtUxzggJf0+wakxOsFpmtbAKjIAa199WPfS0LcOPcykbjAOvmJemYbbiG9L5rE/0JQSy5h19Seidh17EoFmnIO+eBMSgfJm1pv3OnovSZqAFDFgmaa8dEwzLhgYO81ELLpGBUJlbd7YpgLWmmqFct+EpvB2eP2hFeEUSihLrbE+Lp5bSogV5aW53yJxATe8u7hA3Or9vtA13MmDpEBiEQ1bD3+FadPxHMyTtkADj6sKeGsuNNrZ6ONfnamsZ9TxUtyis7W2svmEaNCAPTryHEMAKf7NLOVFwF4Ci1ZmL53HT0X0qJ3beNjEBeAw7URnSbAXfY8R5znLKEbjLSQkUKu1AJ3ZnIyg2nO8wLSMlbbr2Cf/jdA+E36Ksp8rnJJdOGiTS6ER672AJYSuozFkovz76ZJrhzbV62226gwNg7xGHz25ElyYlT2Vo802Ijc28ZgnKyP/2uw/YeRG3DeUdvoRq/k2QbzoZ2PRNgeQKrdXPkSiAeD0fxedPoq7ES0ed4IVMt6iAP5VY7rF/8M7u1IFqgdMWBJlxrK9Jhj2f+WjdXaBGpL4lJoWHS0lbQeEtWQqC5RYSzZKuNxEkgjZPjPchJ5gTDgXTmNV2V20kmIoYwojx/i6tPdvZ8tjnPWmQCF41QlN+7072Fr4CGDC/yJycs8HW5yyY/EX6lJ1ilev8iyoFntr8wO6GidqtOlXHXAh/hUmOupJ/eQHDXpyEdsC4Rp6usUvkJD3K4BRnqxBHqpwTUCWdJ4KHQaTXBo7uJFU0/HEdyqdhPoV/A9XLNL5fps7XzRxENnObWfOiErntinOnjve+okow5VAtKIAc8izTJZx2mKFUSEeRsTkafZdyxyyuRwI79r6DZHeXDANlVYLMfGuAH1VKngRFCLioAf1zWC4HwqZMlBSLT31HD3cXXxaqMIRzatbwuYTDBYjfeke3+sG8cf9QUJKcFDbJ1/8urpMignV+KBkPRB5l6SGZs9OlA+cfwxk1BenS4hSzQX1ZMsAf2nKsCxymmxFclmDX0KbPF0nLh/K0hYvXXX13dwi2qLWb5HJqGdrAF/vESSGPOAM93MWFSp9mvEIcmTVFSX2wY/At64RMhwVEAnkx0rD8Y7GfZRLo47ll0x+3ofCpbX7ZOqqH9ahJsD01hITcnKP8Sxu9WKwvVd1FaseIzr8SKsoGs2ULK7aZewFRkUcd6h15MXgjAPFGGmHDunpZbwKKoPSJj93WdyB7ku17hEsm8lIh02nXcvbDoamNtHOnl8DgUd6rGJD6g1kxiXSad8VCAbqq1joYsv1REM/mJY46R9MEBageHf8JL0e54jN+HHOqivGpnh6EVo++Qgjdn2dIFobOVWRBwWGW3bf1GTII8ZKFdQZxMhnGY5DIsXTJCCSI5hUWEr3eU8eXB3C+fTN1busenXYcUdxDUlYfkFdH7lBNmNUwxswwyaTZ6M8RTGBeNKiVY76hiW45+/kmYBAl4rim1nuBrWmvkYeUhmlK9N4A/ALqBrJUgPdMOtbjC6AHr3BgyEfjIe96FQxys6W5wuwzD2Bx7pAG76UTzPbVjDRefhQCN6ZD36Si8nuzYieIR9h2qDQO24EkhDd8+fcBsKsa2ZRGZswo+whPTWlU/KUc+AqUYU67fqp1t8EHEQMES/moVEIdyt+qdgIG6wLNhKVRiLLb2esJgsjypMtr8x8veLYqjHiA4dYIfpT6oh42WKFx0e8n+hFDVodhwnLL5tRpL9F2aJ/UaCNbOcdTB+9qz7ITMi4HhsLS4z2eMuY5yHcD5vLJYZtJO+Ok/RsNQpesiRXr0bwVp7YdZhqMjznNBkZ2yDXdzZiaU94HyvZXD85+A8IokV9ZDcfYf2RjQNUdf6RVxvrwuBojCkJXaaba6Yb+bjHncGt9JnMkmE5XmsrzqtJVrrSrdXztT4ij4DmbDxkY9M82OpfJYac1S+x2xIc9tk60PGqAKjh9Kf4mAnjvBxzi504P4kYq986MBMSqg0GWkCCHTev8/HwpbTJ0v0MSGSy9v3R0sEY2u1Pwa5KYjQXv4gQlFiny170zzCEyyAztWLQ3BuTldruyfRVlKG7Mbt5AKPAWn/5sMil40eFF72LtqXxIvGN35pmTeDSwKd5k3BGBlgXeIsvAgn09Zw9w/WU6KrTgmUgvr2iKqE22RBPzKyITqQe3/cCy0MC60QKfgvvuqDu8xL5yZY5XioLXTAXQpcn+jUSGowCme364CxTowJbS1G97tfvl8Esi/ld9iirdnX38cBETD+VkB7ZT2/0DG/QuYJ9qOBtBLixY0CPFKn9CJG1IS2QeuJBUuWYPmkJZgpFarO9th+Qw0jCIGVM5od3vkTNfwqCxg4RnzW5dfwQv1sebfJ+ONH110NhnAxMGa5AisuAXZHvzm55k5Ukot67+F0tuInWtXZdz/a3B42MYwPKR5f6iPj5EDLHTnVKvrUlsxtYwUnTV9l4dzmMSPUhS8xLRL3JnIHS0y3ACcInWFnBWoBv6u5k80NtfafuzL19XT9jewsc1znkkcEl3hgah6lA2XRWq37bSZvQm2kfEh8ixJ/7sdsrPJd8ETl1J1etINobNFcLlL3++7Mconmyy9icMNZACqTKkzpJSpF28bZKP/DscHB7qmSZWyVzj0WK2M7f9WMKGHUwjmjJbWQHiIRv5S8WMJJ70drqpuE9JqxptfvwXhrAqk6ewX6Uu7tK3WnTEO3Yb8Gk8Ynms7qZdgtSrvCSfbES8DAXlEe+QsijbCUyV9rg+radASvzFKNTUpu0jbUo5UYo3yHwXX2vlOOl1KO5SgFlCqhy2hZBgW0EyLKA+4iub9vz2JfEK2FDV/xpCLBKBccWCWj/wmlxJHMXGeVd7xyLg0lQo/T4qELlHLo2RWyC4wmn9vxFbPJPF5CSlDPo9x0l/DpPhCaxOhh4GfnTQfBNRVytuuR3g01jdfJU9ThiNkoydtbm1/PeTAEYRyzbYVX8XL4PLgCioQLDmuAqsEoAUVwCD0J9G7BXxokn4aPEb1ucQuOzwZakZsx/vDuT4rmdWZF41W/t9oGAh84PBtM/2KnLh+RKAEQ8HHxSZcgIiyYkQ8XfcQ+P/pZzGNro5+rQSfoC0icW5TldpC9dkiJRlZw1bkftQeQ2SeBdch0IPZOdX6W64NxRyanhfrWxHMt964woyor5tBO//LAcH8jr2VVTqPRpbi/J5sZRVQGvNy7IbA/VoungnhRXGBsXopYgQKPIXxa8cnyHGwSj99fVzk4U60nG+bIBiYM2ktoAGSYUBrDXU3ZFFtPwoixjQKFId/oH0UqXm8GJR9ItiuFbuaoZGFGm06zRLulg2J7Sa+15TuPUyN8cklLm7gt1Vte51Yp0XAym/SCYoVwAjv5PGokMNkeEkpITPkiYLJ/inhOQirqkFVPCpkekFSOvYpqgfhQYwNXMCdx+gDK4KIGhfIj8daT1YEsGtMFz8SF8RLWR75VBhP/L4HcmhxoI+WvKwq2sIXIYWiGtXTywTv9hpR5x01aYODMbH6ERZkl/221B6YvFtQ+KWJjSTWcNBFdmvAKmWmWqbX2awgVlhi2SyisorAL/BzeJDbtPuh5UsFKBNVGfJCtGq/pMwo3b59156ODKY4r22UF3iVWZX3WYyhbLDv1EWw4SFvZImBLyx8Ufsh4vxTHOrvKEbGSioVBNcyu8Ta0FbwuFOBd2rRQsfXo+/phUi83l7KD0Yi4fbPMJ1Ns8c69B9k8eXa+vMqafSvCqXnUVoUqSbXYxk/UbtIqSSueyWUD9ot6lAJHGTrWWhSFVn8vewHwH0p2mb5x2SURwO16fSdd3YFwxr36Dd4BnOSdvhxosB1hdI1fk6HBr3PsYo7RUfurPQhgAUHaulZBldtOinFKzzeuDud24jx9YHrtIgRLYS6+H5V2W7/WYAU5Oh5K6yu0fn+LqhjtVGwBdNxpfs72iZy2jWi7Q7yjS2rcLSUqkeYsoK9dBrZN3rJyOx6+W4OfOtXu6rXN/UlmE6DiQJbwqv75UJYy4F0utoZng//rGNDq3tklb48gIwupDr1pvarg7AGwFGkv24sIErNPWsUQOjV7muC4LTepfPvGeNtKh7LPnEkWkNwsa3rn7uTDYm+Lo6ZNPXiaLZ60gQqtRcsdDikthMaqWG2OH6VCk6Q7LhUK81XjQZmZBOMs6/QoDaQylERFnqHYC1Q6mBDQ8xSN5SP7nwy4bW8h8YAD88BFFEjgw4isATI0rKH+tb7eYPAdQB78HZp/C1iEBPPtfo1Lh0G5wj0YlRCmGqAZvPsZwYD81BGymlK3egWaCyb9/jKvt7gVkuna70DCeeHpmbhyF3DVqJFqMbHwE7rJvK/+6gHJq8nW7ZpvtsCeJRfteUu02r5NVF/6fNf1X/5sY4eAy+Ig6v9UILN0D9nP0WmK7eFQvPtCfwSf0GuS0kmnL5uqIm74OgcystqyoALJsGVSWnE+YiiJgXZz/+YqoXw99Zkb4sOH3XdA4GWDsAq0BS+n5WvhFmXeaCY+pSIDDh0Z7P3Bly5X/su4nOI1Y8/BVZnQXOhEryd1UzCqV4aZ73/nGJ7YCCRSSBU6bhTe9ZVpOhMnWYhpHD/Bk7AvzMVxQmBEUBAcdh6m8RfTZ21dpMxf8vMxGVFMjYrgEU+YDRrwu285Qv/vbLcL/8oZ4WY+OVQEzI7m8hVl+LpQMC1XfYJsit+XWEeE5JRKYqQJdTHoKaUqvIokYh1Qf3RNCPPgW7HcnJuxdJp4hnUEltQ5CBQeWQsYrQCGLT/ISXVQstQznAYrjmHNbAZQWhhbTma2qBv/dNqN0TBLFGrHnDB9mDY3TYLv2tA8r3Ns9wqpaOFGTV/aiqQ0Ch6Dyoyy/8KgHqgYK4axFmL8wg43tzVlGZWI6PKdwpTbqcsDftloRFMCTXp7p0Q5zQ+PAJftUUULsLdftyuYrMmw71Yz3AEvlNQRTQaHpMEpceE6VapTO7LApxmeybQgbC9SoOaNqXtxqwlVxmt/r79OAtWPLQWH9VxvfptZ6L4SPE8RwVkWBZKu3mOV4IGl2rFuw3v2URcp/dfLp+t+hWpytc13Dp29VR/Jc/vEUwYUiLgWzjzFd3xk9R2fCZt8tFQ94J8EpXqmCX66hbp4PBGwUzFf2Ug4gzY3J7n1datOsEKIuHKDR7qyABbLoQdOjr3nXPmfl9zdPcrixaXGUauZdZQ6DFcbuybnCgXunomw9x72GEpkO9SWVO6ayJWVblgqFHi8+K0HlTC59E5Pi31/6LfImsfDDBs5ZKKym4IAlJGp88zLo6oEs9Q1URWv061dftgXvdy0a2XRPJ4MqkSS4ILOwJGuZno0uQI6B4sLF/5R7kTF3eCVS1HDYkrPTvBHBds2/7tKLU+t/hEI3mI+TjL6j36Vb+JnuU4rQeSYR11GgQ5TosEEKp4r2vrAQqcH5/6gM42i5blvqPbQIdHpXHmj9+VsqT/ZvH6P3lrscqB5h4u9eFbPKgmqS3z2EvYhX8AZLUeXX/yPhypkM0bkv/dnxcTZA5uXlV2xg5JkNFB072DvMWqRb5ldP+oJcgAWU+TF15Jzye8a3mjQAWI1UzctVkD+KCCGSPuJgip9FmcdPue5wjO4hwYxHc62aChz9hN5J/gfBtJ7n03qUGfK2NP8W9aiQDAXvWNXSEZe9n3AF6GJqcGOs9LQTyVOzI56bKIZobhLzwqn5TMqcj0zYJC6rv/0Lzqn4O1TLWa2E8rtEYWxZNN3x1nOMmCj9bACuJYWW4GPqyqH+/d9zXMb1daPeP9b31XSxzfOku68a49HllNRWimrXTNOz2ReZpXb6PzZgn42hypVXXzwZ/e0y5rppKe5vCwL17nbuUYIBwyHhdZllOFIauO3f5OQqifM0cNkBv68xzzeEFsJEcryjt+8rzxdctTp2Hogz6b6iZ5/mvh+V4Omdc9HJ0wzG6fd97a3oCw5UFmlcWntSGzAmj69OAh/nikZ2QGaQeXzvaZ28DRMT4xCtSKH2xa7TfeqDA5hC1ZNYq2eGNjuGSEZ8PJflTZ5Il5/Q3vAVjLe/HPnchznThohYBSgV76iOBMk498Z18tx4LpGqZQ2L4fNZkhny31/WcEepzKqMlovMFTxlmdkS1+4oj6Qk38lYfgSXG1TZivfV5mkpH1m/B0bWhPBwyiwXy1ys6TCBIpekQ7NvapXh7gcmAai7zekaSo+1qCPtIQbUeZgE8D4rIndOK8i2j39fQLScer71E9wFqhOgoC8hqDGO2tr2c+acmLpUschOhCnDi3azRUqdHEe6aywhfaB3Z+tsA5spoUC9WNYuy1eXY/h2gCLLHuOeFmeny6sWBMuXzO1vbPIJZ7sT73bUbVTlrt/nwHJbTTljxohDE3e3MReCuhv2tsSwCkwXYGc7SGVEihRIdxEzHde7PykQ14gadiJB+1oxtTBQ/SEq09KDborVVKMT3YgCgOWLiBdxbIW7xk1zARZSA+Rr8lem51wi0txWzr3WNe2NXF9VnbrYfRIJV5iOrP6E0qxbh9cn2t2lONGCDyNmtPCzask81s29wUhVqwEQuqudaUS599+kdnPeLWKMsqEauwawbQ1jTBWEJ95BT6rYpU4+Q+wHFxI9Gl5JjmjBrhYXTuUXaehdPu2ECQFLsGbvQgfiDMI8aw6SX7R+nOlh7pPpc8Jfd3HONVbDwGhP0hHLJpsSiNT5eKF+t/fdIoiWhVdnYJ+KFdnWXnfuAltCkVrr5HOjf9HfJqHuaSbOknm/C6T34yaGW0wJ+lWNlmENTkYv0LkRK/ZDskXcVxM4v/j+MG4dJina/JXXzuC4LIjKi1OrnOOgij4qU+1kCeD4Mgw5w9Pp4puAQj3i4ubbk/hHGp7tzKrApRByEbvHo7vtSMsoeC2qnhFs1EbOp2C3z8KTsD5uXTp8+paOE2EKUX2Ov7DJUput4j+dN81GIGJ0PxQMlk14e5GpeQsVfBT0VELEaZwCEJDweKmx0SWjMKz+pgjRayuvleYPypnBCDBOl2I91N1fP/tb3ol6KB1TZwov0Psz24EyQG2H/QUscHL/aDMZ7meTS1N3yS/NXecTestTUO57drl6KfqIzJGtH0449Ibb+R8GzDZdf4UIOEn+Uj8Ho7ZISPcv3aeA/IMS5IiX1F9tgm+eJuDCkdfSqHO/1FpaFzBXgybam6dZfKd3FIFK5A7ot1Z46/Pyo3ZObNpDTyjsx7uaVKhydbqfI1opR80d8o7ixFbr4qMQM6SDTbjf+C/XULKdSIPA5oXL/mKHyZyFBX1AEWl74+q3J16v2DEQMejLbvSRRgLH5LiIqC4U9voXjOkS3sCMseUDvIMu43cM/98DPKgIB1voKPbQIKm1RududaRzwrTzBCaY/QgDu2u6fE6Tv+rXwsQvLNC9Equ0NN9u8Na5P7yC975aCdA9xy23SyfTRMbn1j3p4XG+WEJwREUDZfosi6A5emt7Ve/gDO7ZKa0hKIy35Vni1+17vUT77s6J1OaF7sq3M/CTMTci/zuG+v/Bh9I9NlPLIBivuK0ohOEj78yuXZkU8j/ijm9q8sfH1a+BPrQyeSAfDAdIbDpkTb7s8Vd/1eLywm9hDeFxbFSyn3l0nx2HZoKFDnxW3HN1I50YkbpZQbiV6U3FbVP3RO0F5S5znB5rR1M9lN8nrx32ZUo5eILlY7eDrHj0y73M2DQ+/8mSxACMkVZQYxI9RhZmhPnBwr2WwLiigcHogRh3xkn0nZJqQPJe+ml/EWpAC3/ztwE3q4EGMzi7qJNs6s2idpW39mic6D0mBi6FzfPpuNLUFA6buCBzYm7ZxasYzbYUWyOo40J8MqyWEuzw0TOXUKIBdqPkiNDKzO9TxjtAuFINgh+4ztTszT9yw2T3l+gf9K6Xm3X8BgsshED4QyBvKfLiGbE9Ht6vxrIm87LnZoJC9YvQrNm/Dk7RJxj+dXr9srE2ho+yOvSnpgWrSGgT6zkSdU9DRxL5hrYddts9aGQ0h19T17VwcJXFiPTqdLDk/iXOhlC6BjoayWkEBnV4KXT7G9XYcZ34RvAUgF2jKU98qRQz/HeMhLHJCjhAeAIvu8hizkzokPQnLEEqIGcwGXMuQJ9Ps/ZwBNXUnzP1hIX6FG22um/IOKJ6XT91/f7+xJnUNH2l1lZjxoV7Cyxn6/oM4zbom7u4SJ+GkMAA3a1rm8XSWXTE+KASOARrq5q2mh7CgFW0LT0b79yzoGnXC5PoW1P6Cm3BUPLVn6apJx+bt/XO56HdaEl2ELCTlbKYi2bryXxC7nBHMcZvcKcCHOUK4KWpWedmBT2ugob9bZcYrKAxsaJAcGpwDUHDuzn+VdHSxeja3FoSU6QpGfpGtbAy6mN4v04FFU+f5VnW2wfBxbV6EHAc+MVacWuc7QPjwFiN5oBv8pJGMEPTHqXey2zttb63dKKRFr2FwRpityizU7Rb+x7+xyawpBbu4xpQQwsT5SAuTLFiNuu9tFY4I9pQ2aln6xPCRdH91EZq6+MgxRUAo7ZonkYdElYpar0p2lqnSU0O4MyM8EWfs29hx+CK+Lng/nwqjqx3fGE3js6T9ybQc3rCqVvkmLFZ7yuLYTutVxNWPZwSq6swrKm1mZEHgG+JPokectZ0bTbFnCnu2g6MfL9q9fT0WsqJ0x+N7HRyDttaoW0aHbBKPy5eQSztgPztlQrKYoAcukvYeRIQMyaUX5TvU6AgGzErkSW4w0MNTJA6oUwUMVEcY4EqpiAEj20xSWrWOeFCyhClS4lT8ruAhdc3S+r7/nyOB9iUYBv/oVskmA3F/SHeygLtNHWxu/TeupJUvNxhbn87Q51vjBFiOtmi9/SvFf4ddHwD1zPfiYvLXAP8DRB+ygWKbgQDtoK9nDnjyV7o2vbvDmK0kdavcAizSFJL9mRFZ4ROz3lnRyNyRe23aYcg5KDLIjztRWBZIbW8wASMk/mPGLsWTXStTmZykegaOEn35Scja78XFI5wxNiFJt6Zni/myPsYDNsGsv70vzG+pBLTzromRymmimz5kv77gyt8WuSZKRTSQwd8SGJlvm4gmJ1ofawVEYJm0JasnkeuGrixZyp6i6nulYofgwD4yY5Q5eWDxgoUMFI8gKsBJVr8ZijXnBkT9o6jzdIhR+T7YN9Krx0zwsT67UZc/DfsY2MC4sfVnkiY6sDe6H0m/rIHwX847cwGHW7xu81xKiENUoQR/Gbb0QWOO6LMPMtviIUcUgPg5RMHC66PqZIxxTZXZhFcFGyPGBwAlFf1WL+M/cfwTRfcuxOilPGdRB8CXTBOil2Jr3EiWbmXFBSsk81jbLAO6i9ptep8N7JllrK5vtVVDK5k4lvt/ezaTDNOSTuLNcbbbr8glQIfWKX+R7fkI4yYbb+KRyMnSUv9S929RsPdcOdfFvAoYwA+cH/bIb/hOYa+/kwFaUDg6s/EO32uLRKs8sP4GdN2joy+bJ08K8Xyw6S+5nE97XwPAmrcWWcV2lRgnNMunrEFCb2uZKnAibkZAJ+q9bQv2AZyqLKgBPd6Tb9y8FDkdpge7NNspohr+/JPGmzcXmrFoCGFsJLvw3L2Td0gKX9k9l0NBjUseRNVnMSnHJQl9SqbusnkK9dt3FNzV5CmGkBksN5Wh2B018O3hRduy66y4EvOC0WYGU1Dg6yx48CZandLzBEZqR5N34nfYENhAzXEhxOAP0J0+It2XjuWpKgp20D2P0+6Ov6th+emZU5sXi40a/zNIXNJhbw3HJCyiKfjme4uakYReesTmkXh7bRRbbiPRr/pBQ2J2/NcU0r7skjTqKN2bYfxvO3e8mtScdWo2bygrrURwNGi87llieZTlrbZ8/rC6OLMk8+MocNUIf506ciPu5fpTT51IUYyvnkpxihY5QfkNozNR7tGcfJPnyGtRHGWR/8RlkMigklH9kMlrpq/CCgBaisTZNdhUW/zK/zY3Jt44RAp11M4lz1fW9ukOAEBI6H+FdKrBwpy64gmOOdh801qULAmVo/ioCPbNgWhjOCxYZbDQMkx+LHtBocv4yMcgg1Tq6/DP2P872jCpyuFWD4EvfqWjF2M0mz7osIQbcKLajwOOl7kwGNyk9yobn8rtgoJKQlb9x+NEWp9hnQ8/a5HdUjSDZBoVWeLVpbY6nKWadtoONzr21tpd0kGzQ3O2WQeoTx42pXZa+7sVkJkKaJsl/QPIhSXNnxfCadFhNnWCzK5QAARTf8g9hWvI/0H3HGiOwUE4t9jxYhGOHVy+GNp9vgTds1VtOrn+ZVKUr3RkpbBeRmSWGvVBtkriIqns6+CuUTXHNPhqQ/b5LNFMhnKk2T8VlxUaFf/T9l7ZuB8NoUo6Dozk040XP8eu8OR/IZd1cZzinnN5dnpyyW5fC6YaIqtf2JHMcSpOy5DWNo0bGALP5Qu19kn+BRA0uSrpQ/r0uOUKIoaKJFLS7v9wC4aMVmL4CGRYrBtlRz2isOdpCV/4piPudaeSgbh795RLf+mgcsXJTCtA6kudFVvtySP4PctgzBJN0LF85cQb/eCqmECeJfbYGh/Wpd6IYp1hAJfRkTyi5UaYYCeu2K65P/FUd+XWx3pegF/4IghiHnejYqLBFV8mwEdFB2319/blbavcPWQwe3xf8HUFL55dxJNZW8uoZUEk/ilFmp5dhKyt59XiqyjKiP2bsQZUE9RlETGGD+qHH/KNo4zXl2uTdh6sa6VsR0X4F1EH5m3fZugjVhEt5NKi4tkzB+Pzjv4aNBdrJcRykmTkZOTGjCtzSAFz57MnB6qcbAU9gho7rubcvJJTt7mkQ6bzlke5iUnPckAXRhsD7g0h+eRNugcF2Mx4MuYWSbNNpVe+uBcY36YJDzoCZZlgwQFGwkr90lcwwCg2qwGofWhi3sqIWQIfS2D59LONfna79xjan1tmS07mh57L9Btj43guKjhgPDTpHQkxNDdpfj72YuLa8lqWeRLE0YRm/ALZuCKbI+Bxqz/K/Crmog8z9NmS/87PsxH3YPT2OZGjTZj1qrfhojobdLPgies4jziAmLeoBIxBmTPe3gBSFZ24FroLpjR8+MeBiQsiW0/3IeMurW5w3D2yv+ZgTwhtlqxlM2pe1awAVFPZ1lTGQHb9Q5LmmgooDgFCP6nbfw35JUVN8UltMV9cwgl3D8c7ZTiwtVUOXVI0l7x3aemSPIfEcK1k1b9ZUVAyCIeNsS7TC/eV4LuVsH/pua7JvNc/2ocllQEKHYZODVQ5LoOEx+QxV5WR3nFzszVoBMpvPS4j3JheTaLSm2nD3Z41nd9MTIg7vzhv6sLMhiWa2Db6rhhVI+0zzt4OWoGGD6s6bpDUEOdd46cA4YrDxzunpm6g6eI6BR2E3RUJtcoX9KXUgrqUO7ru6WBpW6gAtGhMRZgcDKA+PMjp3ICBvn+VB1IF+fojVkfXs3YPCtNRq63kItB7cAEacLXznPzOrhsJ0xC0u6KLU1kd8qc7u4hagtmlUN34lhCKrVGsj6MExOXx8wDzPRF3+TfQTo2CPE8olmqP4kGjP/f9a7BKNeBc2fhyBL2IDU0IX+8l5r+drYHlXIKndLKy3GXNhI0j8Jdi6MKz08lNRI5gYXRtXcsBSSQb3u+mjvDVTwUzjyoECSKnISLvWXUyv5PQYq82QRpjAuiZx+jWR7jImhPxToWGz/A427RgXnk89NQsR/Q6b1fglmqvLqRq3uD0H539Ksbqup/+lFEdgNE8uQBINDsIWaPo27dslID/naqal6r7U05bZ0yErLoQP0UsE/vtIiA6e6YYa2bWEBUzpVF+TyggBPLjJYr8C8aFCglFp2nTg/AvYpxqTtlmyzBD82E1tQpoudQoUHoix3WhLWt4UEQ0IbVn+bL7GTLdAscJDESc7kKDM1QVI0QCI5EBDY/5NoKd3I9vmLKxm8atA+cvykc+LGyVVoLq3HHM9GtZtAQEMKZd/XnERVIwbXtBkHybGmzQHchvfoV653nzbSkviInvlV+oKo+KcwOAgi8XOYhvg+fA+lwZY/wR/DSiSSUst6DO/O66Io5eRvXb5RXAWoqkH/oZSbQjZo6KSANN0oXkyMCvt4pJaSqLGH83mZNFU/IneVQ7buUCr0ICF4p4Q+eG4WWlQzwurBfafWiYHodsm9BsuwxG+WEtxCkugZfLTZmJhczKQBg52R2ImloIugrtdUBYWQyeIV+iLLRI0QbUxzmapGjNZKPGlFiaV/fR5ZZJ+5Tvm9oQ4NQ8YSwM6IVeL0uqptWjwq/gie2lyBB+O5bvPFko4bJVSyIku2XJB4tHM9Rag6thEMVolRJ1ZaGf1IAOvZ/MZNKRVGuf6XKGaabgCFWIjreKu1R4LTjxriYUaIYvJoRNK8yJtfTwHA+F8u7Ofr4FGEUeABXfXzw1R/dXkX5xArh9j20479K9T+Nx38zNg1Syz97KVvmUa2yjEDLtpklrm80CqRPQNVEOYsOKSI/vGzOorCDk7s1lUQGS1A8ZP0kOi1TmVSJfThpcbtbxm5Z4ALJhbEVPCeBr/Pb0h0kjYgVXrLLu/IdhJRFU3iyH7wpKWBMr/+dq5owTnnh81BV2w3qeCtP3AOLfN7+8Of2n5pN85IoKp3TgobiFqDOJJOTBTrNhCkG4vH8GhopyC343fmsErijuJkGWTEsC0l5GVpfnW0HjRIt+EItm2/XBSdmVIKS4MGVKOVAPS3Vj8EkorJS7voqzUwCLXBCziXhGW2Jltwc76zUYsG6+2vNkDq8/DefzmPyDoHwx8PjwRZ2X6SAh//SFtrYsJ9iiMMYsF9HDY/3eSn8ecusFU5mGIFu7RaxhzfoWjmB0D+4EUuh4WinlULIdVwpULm3bi4XKVRqWqVQF/F8SEVw+a8jvQiyM2RCJLwwwb2ueEXdyAAC6PPu6iB5b+AhEERUvbqdFQJgOa7dQcomtTjnAmMW2y0tHJnV0hRKYIZ9MZcVaWYqgJ5l5ADdNO44zPxj+O36/la6/q2tqJLtD+yFBTM3Gge7v0MSatv0S+BpnmtaJiu4m6VIN9ibjD2OsP2PP5YPBm6W5ujeAk8PV1cUrf12N299svibT6XFg3tkpxxRpepKBZQCdQN3hOBKRI3djZH3xqkbRwiTRBXxct6pxLOu25Ul3bO4m57u3wZNBDq3y4ehdVEMgi/+v3vPDNGhLakRdKxefvtX5k7h1de/gjcDgUqjtFrJIy6HQZZZ0BZGPI77oviRFc35ZXBt3OoMNgKm/9gu6QxcUBY9Rt0AarM5HaAztKDpgeyMI+Cnv3qVyP46cigCz+m8k7w9ZFm+tYp/bxJ8kiaW/H3Azva7tT8MEKNeFbuHVrPGQjMn0O9g5Ou0vkibl/t67iAZfna7kI4ccujlpXPRkPknqwhubTrxcBFLBB9IgN9BxGF9tZnimzxa4hATJ4497d0+tX27XbhNsTIvEu2n19yk0Cav/q4vvDPk7YmNErOjZobIYYmP2UYOQG/SDDdldTPZlVD5+d/QqjR+hJ6ekm+J8VUZKY+DziXarOsbbCAAT70WLrDkdSUV9T7sQRpy2YxKYMTGOuW1uasma6AC/DutxanUgt6seqhWGfWpe1ncJc6X/hmQHvJ3tm/qpJ9D/5LrE5GIZQfYm3/IA+2OdutxTJ+oOT6N7PADAanhxJBgfZ2WrHHSnZxYaKujyi4Rz02rzGW0EUqhcoIUpIr8zwdJJ9e74Z4cXzrcO9XzQ87aOSH3xSrEG8e2NdhkkPpOY4ze4MT35pOMwZToB4P+8JKv8nj9LNKWjWdmcURFRv05Rs14lw+ZrIgF5pXZAdVtqfIXuk6YISwHp/5cuDnbO84IQo+zzen4cGk6qGKXrGp8+jEUnU7XMBuANDROl8ZiYUsE6NZVFHGoyk/Pq2IFff7JSOsaSEt142dMdG7UmTveRdnTWN8LA6wOxg0dW9kO1AescwIHx9CI5LPqGSsbygvHa/hA8z/VLsakot5KSJaQgTpYtPSI6j/iPkdAYkiVe2wylmXFP9UFiGYGEWC+UUmS0ZEJMMhYIhkIB6XZBmAF2mC6klnvKx9qOgtdsnn5N06cVtJ7ASIKLLZ6lloil4xLvPM0WS71w1mX4aQYbVQ7OZpaHryXBzVWEk7E13SFu8VNlBYNuHuQAZQSD5lB8fxYcG3rzBbfBhR1vJd4W8Dlq+nsNbvPwKJMKXFosJwwVOHIAtIAh7uitS+6Tb42Qr8SsbOQ9bVpDQ2+k8KtyGP7zb+WGqYqndq3LMsku0aioMFyUw7+Uw70oRo7QPL0LpWS1bxaDttYgenlREHBUTFtptbBVDv3se5JgPyI/mCJVCetxfNieu/3naLGP3iMjyKRnpzYUbJitEoF77M7ARIZs5smCHGfXJ6GHO+bxT2mIXMvO2EJ8oiWYxhodzSO6CUxAagYyk/6Sb48mLMajr3QE2EgC/Yobqrr8vW+05Ox+x/pIGzxnXryoR1tIYtIT6bXn9ZMmxPv3hTlCWt0qU+cNd0GTHFKrcSONMrgp3l63UcI8lYILeIPu3XO0noERf9Hl8ZcW9Q4EjptcCUMO/xTuAYzaZjk/SwqcIRkLq9+iY35LayttQUYvBGEMHbHjLznIdXpPHGhQ5zqXURahQ950hX9VvPWO7OlRNMc4bdTRADa5WyXntprcr853ouSaCGYgBxlFWLW4MTIJZBTxv1VZ2haFFGkmkJaq3ye4JHgFfwb8aOrATacWA2pGhf4pRm3IUymjZRGhc6jabErnvUDl3l+aVAJ1PMY49Mf9nv/mzwIL7rMMHrYOBWt8GfWiSA3kKpvajcIXMLlE4T+x6/QwjdKE5LYgRh1zpNEmUEVrMRYC2JroK91F00OktLHfOc5uukzd0N0DSmiv95nerd7f+daNzgU8LE379STrfGt882httVDBBl8fsMRPuTJwUQwYuuUlmROuawiKicwab7QSlbYAQZuuuBeftXySQghebYnR//UU5oLRAmgHbXBUtVSyFSN0lsijmONfEUyhjht2MN6L4+Ev/y9p1LaEwLoBXcvjp/NGrgtENISEloHnmLcHDmejNlvb50QN0k7FT+yQUAXhGzWfDWDr1WXFNgfWvHWwqVXZzHVcMovk7W0vV6lcRyYIFNr6u7ho4ttIKAYL48WqVh/52gisMGzm0u8p/TDHLxCMGZ+icX/2T2xxaaL+8uOodkWjyUDmG1gFqDeMPE02Yw49IZOswHokPNiX9UmCv90w/LHURQYoX9f2bE2Drq4lANY7XLrHF5DlGqOhVjHNzZw71f90T/YhZQhHKRIUdiQxyJCKxuFvdNdrwApf+/ef+CHmbqhHUVUJbya76eSv+/YyiugmHMAamFXzNTvYEnCFiIv/UIl7lXws2r9PRR0ElCKD3jrFLAdrDDMKFKwyxbUtXRzCELs6er5wKJYG4JmdYRm/8Tc/4WuJZOOm0pKwepomopRC0sfog2H+r00Ru2yWBmDuxruzTQPi1J3xxLJBNfbmE/OHv6ijm8jNi4+o/vndIrbhNcTn4II9wZ2g6u74co5bo1f1EjKIBRRF7tgr26iHOjg7GTeRlV0JJsoc7ZFg4UL+Uu1ZmuICQlUm6eOId6fItdhEXpvquoo3VTdT4dywLy4Wzsw+0MGJBdin23S/AG4okYi74RTysKG0UBQlyR9LCG3NR9F9JUD46O+GQ44Li6DCLQsNjMwOflGHuSDk8zwX6vmqZ0fkdszqxs2xAICTxsriLIfK7x79whg/zyJk4MITA/B+fJZTPj3C4rZxd3fadEuxwBNbE0fqKdeX/SskEtg11neD3glXvgM/fj04dKKOr4B+O/mUqqKDMszuC2/QQAENcTovPCXAZJtqIayicv5df2W69xVQ8UotRKvhLisQ5TYi73aAyDJu9yBCg/VjctvQ0nyUO5dUwJ6CbAXEkj/4ovk6bJwij0UFHpwXhlYa2Aw0z25GvHSPszhBtRnA9869LgD0/8FRgWOXr7aoXWYbfe1tfkPvAUXDG2lWrkW3i/cu4/PB8XypmV19z6wrN1r8eeCoGiDaUXytoFtGqImYOLSUzBqQMcxgB7fgh5IYOfSm7h98TsH54U4yuZnIWy8s9WjLAw3uMaP8KDU56c6/4m/uaybG/JwSsg4yFydOdhmWj01CVrLZZ3XoLQW9H3ZdAFJR+FqYw2FFxVBQaAN8ptL/zD3au6U03OjJCqq2TMuAbzDZh9S6KUlBbCQBUfJt0dQ0KXjIu00wIKTtSuwLqUQyMqQ81yQ5gt90F4iEJj7mjbBE4X2hbo+/m/+kLHkhzr2010LGzFrwVmRw+FmDt050Ge3hINWl5LmDkt6LwS8OqcuTukXVMTvqRNy193/7nHyk4TeJ3wGqxtveJ9GFEK1UYw9s5eRx+zPd0LFSFbDMuYoqQljCx/itiFvQz7t+836GSIUp5Bp5IBjubtE0f6pFbWvWVi3zQb9FIXkMAQ0aMjRNYeFlxaVRVvA/u9bguRB8AE+al6eYe/jaZMMZh6uxZeGoqs8EqLk/DAnpPGS0wFXhxnRiskLM8rNgjaKOOK0NEPtJBhfkTt+CauEm4hueFOvCoRrqnt4Bfnm4Os/j3H9Jcn1cEqMOSm2jixw7LCvXVls24bmjCqYYohRoIFNJeQkRBz0bM7dMXs3SBmg8TI0zpCo2wRxF6ct0sGtosfA4E+oV6Dds5S+38gMe2KePk2tDzQ36x3kBKj8hNDbtxQiXrMwIrv2bQQGITWlJTdQrRaw4m3JnemhH1oa8ve5Bown6u9SKhBn+RcVHVLguwvtAq6NC4tjoMvDGT5RbCz+QBSQhIolQETBphO4VM9u5Y3VTVxFsz7d+qSdEgdIpP6tr5KQ7l85LrREVIJzKLisMSMRxYx8NjnMtkA6gQF37bAtWyOo540B3lCjgDdjm7N+eRETdY4aaYMnfZT6tKBB3cLwjgQKuySineUnsRnafH/ev5BTwfk6AvwU85aYULI2btxFEviVhxF5OUy3w3Ckf0tc60f31E34h31DdCyqzQkPFDO7KBuDK4C1c6+MUM8eLr86xFSTqEh2hLx1T1xCY8WJNj1+Lc/2C4b+0lUM4dGR4woylgvn4cMcxEeTNGozq55qBJrPb2A6OoqhziA4ty1opPj5WH/Wjjn4pX7kg6fq1xarAc/N7Lm2SbGBCXzQrRu8Y/N6AiEtJ6P5/LyTAoCl7Go22Nv1/wHJNIGut194Im6ke6N5YVidhc0OCdmaBHKDB5nnShIh+ciGuMgOpgg3jnRWa34E7PlZwUAYGb4xapA5LDTEDzsWQ3NFaEK5XPmWlK0uETXWKW4PZE1STuauj6FwNdIogbq3o7d42d/ZeW2irgV7bojakY3uBOrIXC/p5k5TqNL3mbQExGVOIIjNxY9Gtk1EcdRoH37NEfaIYNC9l0N4l5NZbZh8+nNsAgdk2dH16D4xBsrsp/xB2Bs1qWA55ki4OTqfQwWVwLzrtbK2mlxgvb7jeambxCK+xIexdLfo5GbJBCrqb43aEBkzVakMtlAXOlEpiDAMYccuMeCpCGczGxEv0zEA1mrljGc6jTQvUdgKQI3dVGWFYA0MjP9oYLDR2LvS0JFGEIe+R5wbyFC6/4qJRSPV2u9J/LVEd1bIY6Bd9jBDukqG+cnpmZUMZOtXyUBcJn4ayKA3g9oeZPGCoJY4H+on9vEDivMATk125OqliYWX12Ftg0ZGbl1nQaAjNsm8c2a4UBd4kD3NL0dbCQW2BPKASkH2Jv6Y+LT7WiNdFeGR1rqHb9SjzMomAnTn6CwZidQGB8GPkSc0PUaKlJ+d2H4dWye3AI3ohqSANkfvfg0Y8wZT6xdQ4MfeudVzjNDP6ekR1PwWme6RQUqcAPnXmRT3KcZugHKQd9CJlMXuRayWPspMSbB4rCrkEDwko920+S2+yVhAzp+LQ3OMEOt3H7m8YzgYGw/e7+1ZC1uwqRv+qN4e+lFGwdWB2I6ecFk+NtP82uWZQOpbKXL/IuNgi4hxTJEHZssmBNGFN7eThSEWWxJnbBrk8ssJbJOWmcTuuwdO6LLLS2HvisAkYyRxfrN9VaGEJKvyGVg8DeP+vY4PFzhPEvOXb0h88BRLmi/ZgOJBxrZGj/6VHa4B0LbeY0qujpOPhNZ1CkQlMsQz6J+inQ4+KxOQ0X8IEH7RM3h5J2O/UUbgTxj6ZX65tNydnjYi5a81F1I3Ct5j+SBr+YytaaEh6aUMueeiZtBEH016X1FsgID28p0YGRSQ7qZ6JofQuy2x/vhtTosKJ0PUyjeN4Rk4y7c1NSfWSG8vZ0/w0jqjRLNiO9zeh+zP7giFUjXac1Lw2gtqtg/p/fxu0wOY7lx8SoKfRHhnwxSA2tovbZR87DG6USlS3sKMrL1hZ19Af32v9cCNQkLI9/uuHQmSIRvbSgMC37nkYn56poZx+cXuhOcbhw4RiVTFle33NPK5bA7SlnfQ5WThbHynyn7iDEg0mWnZrONHwQ8xn9O8xEzblmSkSnpD+e1KESRilWVyaHsIxuKWx3VgkmHaPoSNnd6CM6ynY1ADNqkAFkY3PUITY5rZW5o6EIOS7nkVAg6pcRNjClHTY5yJvVtEfCdexktgZrB+vJ5jOraEbkPGC9fbRFDp+A2b/Zz3LpoNIH8T7ggzd7Ckk9dluzNkyps+UnD5vdMNMBWP6m7riWWaKYOKjFkRhCuKsUuX0/yzWvxEWlF53bNxs90Ne1zHV+pch9C7Ll6SmCJn0y0tXUqHg6zl+0e1cD8uF2hCn/lhWh8J6D8r34kGyi2x21u7PzUD9j2K5moud/bp81tLdZNLUuSXXCUfdegvTkfNIS3vvJ4X9wOZesXpLc88Za2BOJEYSiKO19GrtXZLx1DAGyoOH9hx2Y7NCi3HVzmjVgKN15EtB1frmYUdId22XKYFlIVNvw5Bok71p7vYxE+8s+AGlW1S+hH0cCWO1OvJao1b27dQ/fYZPEqWF0YMd9bm+xXGn0MXCLxMXTW0FTNMWEO7h/6PYcH+1QKw20WdWOGTuFwnWxGMpAiiu8nT++7UiSK+7kT8S2bxb4y+F+f8QwsJZyRcg2Zu2Xy7iZLAB9xYQ4xrq1pFGJANLDNEND31tfGtj06GApcDTBmsgpPAxsLXX4+vMR5jZWUNaVbmbGrAsV0cX93bVGOVR0Ewgmf78Z0fIdsC3sDsBj0vo7Egk/S/ipb7B8Kmc3IbbK9X/2StwSv27Wd6H5WoDTwJ2enNKYjcmxKRKO5ZwEjISBTzgfNgMANZrv/sXUAP6XTMwsxidO4fUwcxsvLxDhxOR3o+zYYRYf7v5Uw/9KlZG2MjxPQoK9WS2BrlBVR4jyjNAjatZwyX7PP3kt96jEMy0pIjffjIGMwh0nc/PeAm5S/LB0s9TJDypah+0ipPWFL57vEwfCmZfAb1M2YkQNTuGVnEAK560Dba0Nd0xB0eTBCTExKO3FOt8l4Vy+DmqSjPSQLfMA1P2CpUunL4qmV3HR6SBjJsk/S89HadcubWXz2kIZBtMeB8MBv6pBCyaKs+cf7yCKAqpu9BmjWuheORmRCOF8eW5JZgRqKMWRCHlNIh2fcy+z0GP4z86ifPmx8DgnPTzyz8SFvd+lMpPu63YjHEIPrNFzK9dTC3n1DT27Pj3R2N1djU58RweFmZqYl9c93F3ld5FY82NXQ0ryWlvFhznKKnZ+yx7HHX8XnVeDhY/YDFgcQxUS/nS9YTqzlQ28ECsmVS0nkzprXvLPKrw0cWaBbFigIwFOImSj3228gVZh1qlRYuy6mGO/LNngkz9lvG/hHrORAm0aGOTxK+z9gkcCXYPYHCxXNH62r1SvdZ8C6eK2o2EqmbBCOiWqpFYH8T8kpz+WcfIgoHbgi9WbmHl8zrfoOipR6PE13Rn+ip90CDQWIUxqkKkGS5atRmUVJBFn145BqD0hSxKjbdVLc5RMoChXjtuEzz7tTFyzklWaGwJX6YRbHh3sOM0qqcjer8YmkUPa2lTOZJfKQd7YJRuvZztuTWVzD0NfCYaacDd+9NNCt+QbxfI86G57R1sUw7M5ygV5dWaGNh8zCKSKDwwKRu4BgIcKb32ccToCA7+WOdUdNQpDS0ErEJYRMvE5jgDLpEqAeCFr4mdG4QuVQnhPGBwZwbJE+KgxFG6JXTTVW6minINDFsEBqehjiMwBdeOLJNq3Yiucf91RHpgKxn20wdRlH3mLL/e6+PfA00y106A87LV/PC9jKvzdezEHCKbR1o6HBH5rc7PYARzljrP5X3XgXxu0JFaMZ6ScB1qsepmbQ5UhkJQoI9kW+YoIKk+Uc5BkaGmWa93lU4gACJEtlXkOvA5HapeyCkJAuL4F2bfPqConL1B8lpWY/FJ5xo0sdZfvskKQMH4Qa8bwinvEIokv2j6qbnbKrKG0cQUcm5xhJOvk8LzRMu/kusuZBb3GmNW7iyHGsQYHQ6LEtgiGREwWS9J9mqoK+oSMZ9V4opDoPDWeqwyRQlxNAUqcRjbI2WRqnJqLSzrkNoL679xvIjqMaeStA2iPWVPRLVoRbgTzajnasxngUK/jlvtEV5oG7wZ/EgaVF61ZKjQpas4wV5SBKx5eRDZYSE1HrnsUaZa7Nekgwd5xQ32UmngeCIWI38yR6U6uVjdyHYFMW8NpcbHM05eceB2U06LTrYFu9mYUJ4FHGSSfs8p3fTQX+jdQNhn9HBg/QvHqLKeGQY5WHz5CknHw6uXKCB6pSasMRIbcoCwFLgH3q+FXi0R1a38P5o2NguZbjFEOerjnBR4nr6rwgJk55zqwpdhEoNboQA+QHlmS8gGKXK+Y87DQegHyYW9ce4rbwmrD/UmyRZN8kfnNnuWN34xfadAjLYpPkr9jEWFTzcoariRr/lGdF80bJM1ODQstyU4eRYPQ6aPr5EsrcJRosHJr3FiPQKvFGAKDvmP8P8dGNCMmN77TW7pgvz/W/RXEIZV+5g742Xl3paz/nOJXxa9RUHMaUIlV3/lHRaKYRtlaL1XxccV4J5hQaDBU24OdXRo5x0b3ITkz+ITefFH3e5x4Fn4+52CZBrC71Y0pEg9Bf+Yz09ei//rgPx8IT2bVWRZzID8RyThU6lbtaPFmLs/zMfp/OSn0MFJDmZMoMS6VviJGI9kr5ZGi6mhsTX2qR9oPf00TuuwV6ToRE9hNHdeasjcFadJrop1HGb4Z7Z+pSdAtw4E2yrpKd59IlAsko6g5Doz35T2U8bftnMO9Ug4hRlgTkvf4ohZPUiykNSLFlmOmac/7WA3VKBkkYW+FVMUegQpNCge9U1HbCnRDc6H4uU1taNxgTGnBIUuihcbWlTNx+W6xRlihUlD9y41vSJ0SQVEwU777CUnrvr7+X1C6fRkFM7HKolptns68RuUXO7GOd/b38IgX/GN62Uzbs86d3CSZn/iwd4vqjmnNGs4J5EAr5suWLdvbmqJswhRp+DauqZCPJxQ39e/iPg9dTsUpus7g6iY4O7mp7Af9ZalV4Di5ujqRfGzGMh1YKUVGbeZ2OF/NiuYRYc3lo4+BBFCOjhpBbJ5el4luyz8xIu2B3y/BzF9+I85y9C+/Ur4JT36KdKo4kKYiEIUmd3UCsBydfY+h+q6JnUfC0MrwjfgmgpA/ohPh8NZpzj6WFc4MCflSghjgx2fc2YpqIoiN8hvcISPoXSVep7ajN8pxqNDAJLsRueMkCgKTrbg1r32nYDq3xMP/zBD3G330YTgAjBuL8+egtPHNUdmoxDorkbT06TZkW0Yj/BaaJapgMUqsbK22R0JbE7sos3dk8jdsDZEVGzTwtEtwjZxsED2D9a57esR/fjGL7esjr0zvBpImNoaFOmAsRppTWJPamB8VhIpiNwqVq8LZDowHPvPNASBrcvEJDWoa0JiQUXQl/jicNYRWaFGuCbWkN2JTQ+1Zo/r7srBt9u0lpUpWQ9qFQ9Kmkt7nBw/BsFDSDXUUXeaOEeAaFXPEpd/9Jih0c2/Y3OANCA4vN1twlxQGkYxxGUboeQ/zwE99qGHJl1UcODUu2QSvy4XVaL8ESzVs/cSZyVsCr4d4DgwkrkQhUzaBOvdJg+KWsErWPr0YqKMJfrpOQPoFk1n5/t4wvCfXN/7YPwqcY2bEgRbLPViyFUuq4u+PHW8DSLv+iuGifDEUpA56iAo50HFFlx3wSdFQN+LDBKgEYfC2zIWJo0BzF4s9cyeByO27HVt8CeIX92nZUss54pNaNqApDfvSan4cUrNEaOeOSVL4RIg1iLy/sFkDEsOZX7Ru2zkOU6uoHGGbC/xaMcCVFOq77O59ZtovWw8zCCGk18ZkQVM/mRBmpe4s+SLxvXzwSAuevziOq1T0Z3UQ47LJXLQszW1ZiY4tSD4Qx0+WM02c9rvb4Z/WdwwvttOPvEreAlfA/B9hRG3UvHZ617ILUH1tBiapTvX8gyiQWxieh2DWrAO71mMVpvESu3h1HoIVXIuWT8/IUIXz38QBMT+N6Lf/ifD3z6e4QWubn17/k+6c98AyMvsucoxjD7cfBJUpJ21HdUcWZZq27XE5h/hICq9h09dRqjb4KsnQYlFauLoVdVCgJpXzX1VBA5pi3FyoVnzqOVH05aDxAABzbPevdsCKX6wT3VZumXTbIHXdbjNYWRTPCFx/G/qUWylHtnK9YI96m5D0qlquv5fLEDeC8n2xi8XbTOYWTDoTGOmS+gqoq6Z7bMGBPXYp9HdRRH0VlDr3Z57QW36duOf4y1AdD6J7BZboB4/Dv4ox0chBRkj965FLVw68CBknhUTqtSWnknEHrr/c4ArJd8bhsA90ChlMN1rKfyzK1Bex5uNGJ4rOFqU6I2stlcm45H3xBi6ejxa/cx9YmrznXp1G+3pA4FPlkYcEWaKFn7ZfRjCy4wE+yYPkqmzWfcNKrZn2Q58eLFJNlrGqFgdRIvb7nSqajdWUizmAKjTN1InXtzniXDmk7qku/r4bb73dBtZ9705y2KI8/ww3aqvNUY0GKkDoBcr5MZJwQi2FDLsmBWH/fE1t+AYHljfWgtOabZyXwKz9BzqtolFmU/a3b15N0UBb9x8a1gQhmIkXaAIPUxqGCp/HNjeq7WVz4+fV0DmLcdDPStGYOTA9xalkAw0Cma2ypgtWcnIANEue9hXGXbnZbBQVLAdx/5WMhDk2F9SFPiypc+nDrUTWuqCUi+Jy8tO+OR5jo/BETycfSieIar4g3/B2o0vAaugXeZj9oFD8XGrLiw1M9d92yZRlWggCohYXsPxQcAJ3W9WWig20tJH0r2I7HaQskzpGSsJeT2rCmiL6ydD20JxiP3RvG13pAanUoBFoMpBWGk4cZCWEJji3D+EWRiFNJE85EnIWd6Tyv8QqAu+ZOA8zL4TdKHTJmpEmXCZNoWE/gR/2QFKSy02iW/n6NuSKAOm7qu71Cg8K1jSriXxhkBCjs8/Coav6hKZ1jyJhhP/wKyfjVXXGXwqZmgDvuuzZEmj8W1KjiJQUYJghXC57hHC0WLP7xU/beKAA1hSLKk9Fk+e8ZvClFVVLb6ZL4+BvJeQf1tWDCC88ZY3h7WvcyONTdC7rmCuzRVnC5+Kw5nJl0mZWPdwQtPLd3EgXI/obkvjzMW2CgmLhsBi36Pm2UvGkOND9GMPv44s9iGhWZv/Rz5VNxrESNSFbCqTLgKpnzT8DEe8mvCnvdqNzvE69QzbXNcNH8Ssw5NFdEtc1+K7VeZ6Q5W2Icwv9PGAT0etm10mj3Sp4T4ESxEd67TqAMMfoPU/lOYtps4b0okXtj4ocG1ffHzICXZYFBAjQSRcOQ3OVeuCIO6Utj8scbDEr5kOSo72JwagYtRumenuzdlFrNCQ7YAo49Mz6Dvsov/khpgOkwTy3tl4mPij+gvqaP0t3fZVlhexv4R5bSUiIWyHnQJ7J3T/KO0iAFeRlcZ1ErFJ3Cee0lDyy9mPiSGJfC1NUrFZBx7laZUlZMJmWkaO0f4e7Fza6TWUMMtFzK0DseRz2Nxi12VQZykTA30ev8u3F0BX+N6OCxYqbJ9/St/FCM50XwZf/a97eGe/JOTJjwvQn7399ETOMf4bSFN4RiTx/7Z5rAsRdQThK3wMz1T+0D/gfrIE1v/11MAUeOEybdVMfmbd2Zx2AUxM3aJhCXtkhEFgWVC5JeBO1EXFR3Xif+rb2wNE1kD9pOvzNzRsNhh2wg/BpgLQmwUha+iieXVgs+ywW0S6qRsyt5iQ7a12s0gNvOw+oYPWZkwf59+xrNCtmJvztZm/b/kDx1jqd3p+t/JQDzxQgUK9FR1sedE5k60IjmpvmHmy9wF910ePsxTn2HifoEx4K8TNBAoUOXSgz4/3Kif24vj7Rj7yfjtkUXIj2N3iWx0Xx8AJtNRoNhz6GTmTbFAokHZxFG9ERI5MJijWXC/m01A9Wh4t9XME42Q+DdXM6nYWeWHZrhjxXbPffmKK6bH8ZPixlf2raVitTZ+nmo2k43SzAfqHz7RUBUg9njC3lc+vymfMZNxB5fNMQwGSnWCOaFpCwH3nSpGHW/D2n0zoAA1liyB8q3hnG1mhAlHd+yYacdrbKtwIoQgoeaIKnLLmIffWR/QLY+kmYrHJkA7u9ilLwOjX980c2OKsVM1TbGaPouORBshGjQyUvBzo+8NC12hAA1z/8RLYeJcUhBZ0RJ5gyrnwk+LGP/vnKrk9i2QCS1v3i+FOwAOycNAgCxYugxK54AsU7fvnJwg/Bw1qdcuQuq0VV8JDBhat4GW72xOdo4OnuRi2B+Wptnl/uar8HzBXEZtHjgQFa5dhsdxZ5wT5DPjskH14nrOqi7jhEl3JabB3SlWgvqYQn+2FmO/8llMinMOX8H5mOGUgSw7r4gNnof/7RIlDfn57Wzzl2GLzXOOG8qrvbW4/qmF3+dNqL5qOZNLsjGcDehTU1ToVeKR3OmC/nGOn1t/KIv8PkWRxc6CiOtm/ubR6U3f/Hp1PJroHpNyq70bNwobeZ7md1May5L0D6J/l7GTSnQZl6rvpWH23lSQJb/qzTfL04m2LOGt7wmEz/Iv1TXoElXLJDtR2Fzul2BWr9E9zr+WU3ilbHjut4wb3ykzA9MNOW3wBEwAi9HPa2tVzcRmywEC6gE+weREjiPDk4ArY4vdmhGg+XVpafNRo4ELdh7TGVQtxbA9YhV2utCCy30BKVeUEQxjlZL00rJydIczYXKV7yqMzmCeqsMtc8vxrezftHfnDSjIsPeyfAU2BO75wwfIeOkgflVX9OUtTH1/Ql5nM8Am45q76Fn8ilxEqEd01AuTlEEZnHHhDn2BcySq+keW73Xq7D9SoPfkwP8dtlrMX7x452SF7VA9P8jIWuwMrbKrTPzM6HhNC6lv+fhSYbloe0CvIA4sK8Hy10IRl3JX08vV1Qs8JqxYcqyNC8SCFDKplJyEqmXGu4gavs1thya+3Kn+V7XAHehVsVdoIv9nO181uM41VD3n1MpNiX30pB7V+wT7JPf602OwGPt8r+OnTa3ehTBkGgspfrcpgZC5Qlhi9oz+XaFnMh6BTuEzNNWsVviqq5WChnTBPYQxzns6tzI8U4vAhCDHqaET6pVBAfyFMIY2ysGKmQwNU+87cfDNy7ziWvWBqUSeRUOOCySsseYejD/P8oOymxVp1jAId1N6ImVFKyjwixUzehJ5EUNUJQyCmneske1/zyUxc3BK5MbLGGOAxjc22/K0oA7tMn5TZZbqVdQaSQjSKmMQ8PKN43uW6w22t3tK2ByitQ3+34b2GlUxqSCifHUV+Nn29eg6aq2Z8HABOSY1HzkgEsng5OCo22EHZTUPcf6iSp66QcmF9O3XinJAwHDjwguXXhIgg3m9Wa/u1E5Ixw5UMuescxGuMNbfD9GBUFpbm1bNxVlDfCvK8Rw1gEJKJ/2FMfTP5pMpnXUy1frF2UmV5zAOfe0D86Gp+6aXrapnyCkvgMjobkjxBNPhmCJSkAmqlBNON7t6ImulbkIlEHOhxdI8kUO/qGMGyLuqdKd30Nxz9weckCdyQgbOZr4HphwA/lnDeCx5gAnmujrUHWOXmMTDvw8ZyFLGLmhvmH7rEZin5qlcJH8JPNDT92aff3u5T4mSff1t/RrEi9WTFstDY8jQC4302eAwEATaRuflZf3X3elAti5rCH2Ki0zPVzxHurbH/c9yeakhn2lOgIntoBXzRJeyS62ADRY7nkNEwflM+JO9trL2c6yEk9lIyffMDvcc4xcwmMILT6X3asW+5HND8YbrdtfUUa2281ZVnr95EaXsfr5rVYn18xENkptUnCtGB7BhmyumMDvJTgBT0HG/+dKxGf1CbNaQ4BadRt83kt6mrQ/6Nkb89NcCnz8fmNixW2DZVuWBCd2fsGqE6Hp09XHm3PG04UsvD/J88aqtQy3zneA7LYNm5cBQDmrYAv5npDHxiQelkN7uAwCI/IFikhRZD3NpxueDEM1EmRttnka3QOcTtmNCtjCN32K2rBkuibyX/eiR5W/x1VP+oAYi7lAt2A6HTMjIAaZTWiAWjUFxs6/dKxW9RrUpVdLDJGMoG6dBJqeIR/hFHKTN8UePMS0UBb5bFyFQSmIZHKuetRZH/+KDodUGNCUXJUaEjVxc45//T1IFT+CA8vm+BX5De8mtq4WnWT5W4GxB6EODm7qZdNgj7HMrLquUudMuy1cYQrWYwOjLna2a1QsVC6gJS8hZaQ8VR+/Yba6GK+uYu7ypvTcxbIQ3bVl6irCoQl0yaD7Vyp/irGoIHClMuHZ6tScuAEkpWB6PycG37DsmxdjtQnwezHCb7lVIdRuzqYVcih+ygbiuSzoagdTLAKMUQrw3AR3haN9SHQss7T7MUERZ4NngIXExPD1M9VdtmaQz+9CkGtVYK46JAEUVjo9UaVcRqGND7gCQaAqmnR71s8D9Swv3cwS4rWVpzjeGpgFv6mHZpXCEmjc48WdrSun3mUoKApGY3DXeRNPIrB1MKjY0DjKfd3tcmm8lvlz86gTaEzllDz5uLhtZjG3usUe7MHdAqnfooEPSf3zrWFGv1KOefiwStVPIO7WFuXy34FoMVVjS3gyUUEydDX3JQsr+ehAgeRQLnmAvbdjL5dhxnOO/UQGuhvi84XHlAlz2NhRHY7H5Vhs2utHc7ihixPv5PcxyhyloQIlllJgVklyrNayoZhOBwbc/YZKKvJlVOf0qPh9YmL9FGRvrAnGpGzP0YN1dnjP6pBIAAgGBV6zk7suJGhO+3MkfhTt5wulT/mCI/knxlDgc9zgD20nUNtw3INHIPZpgvLbmLfAwo0aD/d1vQk3vAh0Vp2OQQ/oR/enVyCS9u93aA1Sd7q9kgSLJtEXgbMWBzyKtY835orS6QKfUmIRAYRq3z/Saz3d3y2hFnDsiDJtaw0oXG6IrqNEiq1avlnJ5wgHQMTOr+/1Aj4/7ohE/mOQgnrxn92wlO6MYKhSP4SvqIPJEqxv9kvVFOANPLeU7S7wetkmqmyBF/sOP4RnTVBQDMusEojSRzGJHHka2YkVUNpHAIq/gSY/TViGAD8xi93xwugQkUg3pfMn/3LkN068OvakLsnpxcpIeT3p1B3QcVzlTMC07hjqP9f2r91h5SiXPfphejqbAa3GmhxN6s6X9X41PMIYRxg+Siw+sc155xct1ofQ0M7z0/MhuSYEUpR9jTShLru4UipAeDyxjq21FHEmP8cs355IrmEjayO5sRAe2WJSMcImn1ZhzpAM3v2NzJfIDXV8+vV9M0iRnkIZRTraMkbKlMBDTwpZ4ZPNuv0LTfkhzzhfnQlV7UHl105qjEpLuRZgF1Dx+8w1rJ5UbNiTfMTPSrzJjstJRBMKL/QXmN/HhnymyyHd7q90igRW0oQCgkvtG1NZcQNCd6k7twwziAvE6H2mIiDCvPXwJUzHzMqz5Scw9O5C/lQ/1Bk2udWZz41ipfq5bSTdB6Cqkk7OQOW4LK3rEO/33kceQwxeS/9Qdih/5Q2rD7YvmW81ae/LY0TIp95I49/NjuqRQJUgnpPXk2dCM47NsesptQjRLYo2IFiANZsp4CPdYDKJ5itzaV7zng1YKrmGgK4abhyWzfguFN+OdZk5LxGwWVcNBepaRaxpEQe4MFngXw4YeZtra+AgedqhyttT24fmsq388I835OQmF3i5K3qATeVjFmv9h9c+ZlPfbHEbHzLJDatAsQnFAXIgYrzAdQMuygPJsm/gNpNkKLkdUTO8wwysRj/GHbBpIx2uUI9OiCLojHyW4qk43UcrdpgzJ/RYHZq4jAqhI2u5zs1PU4Jv4Bta43PqAt2v8ltHyE0acX/U72j9a/OwNK9E6ztQmpjT46PkA6NMQFOoq0M0dp0uu1qni03L9X5UDJu8pyqcsPEvVJOY1R/bo6xYHnEXemmUtktxWhVaEQ6/QbunyPg10TqSxjK7QpTC0JejMtxMiNcOr6qFIp39bTZ6OiXL613eL6ZXw4qKkFCm7qHBLtYijbWyu0AGoTQ4sElfdHO/hIHY7w+kZ39qgTChurT/GUVGbUKJEHyRU1lbt5OOInPGpEHcUnZrkl1oOggIYnfxcI3NUmfhE5vWckW1VcWlOl3LyBoz5KzBKcvPpCWVxCNJpiuE9xjG6kJptlqrsW3T7lPM8zAt3LvACC1Ca9LRCPvetZ9qlj3QeYQ6w+M+CngfjByaqZzYXWAwZxe51oNrBvXa2OBeusYAQJ2YoDC7uV214jy2jP3FZ2tRtzphA75wUK85/qQXONtY/Hv95uJfCUzq17Jr153LNY810/EMYJ/UBOg8wFYpWZU8BhVTJ3O3DF9A4vQIkvK+ImMdeJb/hSZB0Zca2HCIet02HIwEKXkaLt7fvVHNsjDlBHGBaPU/GVztb6DVCj6mjvlMVVu5R+10Y611+iibze1wk5ahUCe8I/QPcs81eQRB1W/ZxUzM/GkE+vmpusLHOHXK6S32fugDC56kXdIFporU5VPBrQIjhdzEL2vkrqm/hP6+2u5Av5WyDytfUqC7EhrK3LD8+vX8PPrz3NsoY+/XviJfe3xIN55eH73Mwfkjdo7dKVJXbzfM3InVQXxxAUTg+qt7pCnvquT0hDrpcmH7eYx6ywb6UxXAYmpMj+h6bisrW/4WB6qOpH3u35goMYx1M8+8K0X+WowmncnhMRf0ryOWu3BnIXpMOjfvkUH4PTo8cmRJqedWbUWix6KkneXuDBbgISJVgRu0P3TrJqkwfiDQe7KHLSpu0HFLY4H4qOb/YbOohJWEitsjur1ios5DzrytPoJdyQzpFZ2oFhxX0iQuIclK9Bg3iZh5sNlxDq6C7UmBpWML8cist0DLtooSEdhqzJLeNGvbRPe+W+ZpyoLMCIfQycRNkmDEOrUH3Op5Hb4M3KFHgnVSasXxU33uzlf3VS9Z879tLApVZjcNJy6uD1EhAkQfG7ILnrBprwalgCxTpRjtS/Umd0VA703dZde/esAjgL3446Ho5gpm4DHq1q/rQmTUdjPIL/NcNvW7+EWZvERkdk5wlXc8JHDvjQ8syxpbDTiPoWFb/7MyoUo/Tk8EpWDHtnIgdMqoUiIoYjQYiNWy4MEoMfEyROcAUFD4j7HAKXvWwg3XO+8s1rIAOHzVVPOnxDDw7FBHnYFWzeATTDAz3Igt65fPsnyAUgql6J05gt4kGOTHyFO3hh+PPRT6XdF/ZahA6mSf91eYpu/X8fDJZTNbpr2HNVqvE1bdiTWVQCWE4j16BMbB11dTfMgQbDzM6MLTuuysbDsN6Z6NrxBG9ZiRFLJWSDoFjYMpFjcq+WwoxyKUhuq8+nehbYCUpfOEYt0EscNW6tGzIUOU17v04kcfork7GKRY8y46jgeFClQ0sii7s0TNTYZi9ijVLBwUBIr8Up35j0J+qRkt1iD1cKDlm0reYxemFHT9SNwbDn+/T78Yz5qwavmiEg40sYS+kWzj5xcjhD3K/g57CQkp4yzbQD401ufCLjSzJEfjS7R3JpYjn1uidSNfWOZHZFaE3QbuSiUo0N9AqwwSft7fZw3ryml0kM9LNWqotupWZfxGd0RrxCEGVA4uokfQx9E05V/Vsub1Zq5hIj9sb6m1wF7G7vzY1pSCj1DXsM/n+B/OaHiF839d82MbgcCrIuPNRO0SaVgtXmSusfhHUnIM1oWfp0FHNmhggpiGiRfhA6OVolt8XDJb0YmP5hygY73VvtJrd7qxdMT3wIh1kXZ2kcwtAWjMm0xrrU0ZGfHXZyG1TxB1xqVrL+d3BelzGHQF44QT0XwVCjE/AJ0O32ohdGmM9ohrvTXbYNFqMDtjMF7zkF0m9Mw2r/XSJDEYWuG0TQF0FuSobXTn0+7JzTQZGFzXXv9qCEWPGOvXacvbmM8UPrCXRn5zkvHRPMYk0zVxMqNuWExmRYWohft2F6wYrhEtdVE6EcRJYvY5ksM6lB/9E4K51Zd77xphrMlxJTTeKG+FH8P2kZJDylATmndARbCus3ppFzgFceLMzKVUJHaQEQ0dNOdxos7+enwggq29hdP0hYcOxoMinhozS5pHcbJlXWwgO2UKvfuiED24iwB0IaWmT6oNWtIT+EvmENXdr4qGDmPq33V4tdrBEp184SAyRdAJ7EB4/EQZ3PzIlAB9NWMF1PwhNaj+MXjtFDGEVY/xby1d0RRFtrYriJccKa2yqSmZ2DcjLEhC8OEVWzIQeNaCkNKaqpAmabMwNb/A+GQyhltrhM2sKWK/lJZtFEBWpmO/5+5DMlUuf6O9kTAPsqyYjtVrFkWez5aNnb8OWl0J8xKN9z17F73CPVvX0xyxd8ZyoYTTO/ycB3taPP3EtZGheeUxyaUXOKEoMZmbedBdK8riMeAvHlaQI7JA4vXwzY78p6USvI9w/TJ7oSEJO31r5p4t3QvP9vFYNfoVf6CR2QboVqb2ykbNRpwGqhS5TqWrJyjcrJ0Y/6pWx3SRk4fl14EJ09nVIzfO6ibVe+WO2qg6I7Pf3z9StOpI21Cdkj2tDZnwe0z1Nti/nX6hy5X97BWv/bywCIZMwkME97Xzu4xXqaQVP3y2kUBEiD9qFXIIk5LXL44g0GSgxZls1gdSSyaS7ZFUwQkRLfv7zzTG91jdoiuLW9QpxtGMCfkiTaENHvbiPseJwGZ2ei5DYIJnQCEpxp43zyldfIaItjdrD8D4NKv5nusuDtb08DKM+7hF5qnN2Ti0ZIDkG6zVMqRnSZsMcVuMQlajFFISD0hBvkWetYZ6caurLFgs5chcDTI/6DiheRXk1RDGuSmkTF0bUq2TEe0b7e2+lf14ap4cTRew2m6SvaXTmKqi2rVnZZIfrPx1B9rNu9n//Az3W1nj0uZos8PonbtMMyorv0u+J4/yZZp+trKnlNS+I5EzK0bBwzBh7QarpSx1n3bSvqXZtaFsrBudoiStVTn1AwRuv6YXJ+DaDdwXl7m+daCryB4Vyb+1Frcj+feXXIVDUv50r5j196hFq2Q/v5lv7ONtUhBtV5rQhfcfJMhkAXL5ZDPk8OZjFvSs9Uo7/JD8Mz0Ns/u54M29sKsOJh1IjAdkJ1A+GwCIoglKk+ijug1oQrfMBxUrKUZiS7vtWPjCeyd9YmOmtT+QjF3eH9p6VYFgqLId0zS3pFsVqfK3bcQvLjVtGS8bfR+Cm/qPuVEP75Reak/2O1kV2ASIC0owg9FMphadYU+pUT8MUeWdYrCCYUADQQLfPQVAfXAa/Zhur6A9eDbkFe10w1ME0koxX2IuGwfrEXjWqTbhDo8soQd9dXRPcGUU9PmEgxrG3kd0OMX+JxoldQjXcZAsr+l4VnQS3NrB6gpXu/9nZD11A/VESsS7964eB6ronI/7YWVTZRg+jjbyeZ4w2PT2wN0cJU7N/2BHIZjCPdg8WZS8ksHfLOwIZgwf01lYl5YD7wEKx2ERYrn7Ai5ELaMFYrgvKAurgqFjVq+0LkSW1AWtxCSuTU1iQrF8B1DRROCyoAWpy+wMCNfsKQbKeG9afhH9J3RU+3AHr8Nnl/MZSmANda22rm0j+ZrLmlrYmKRFyynFk0bRm3Nvp6kkg/Y5X9Te2LEVrLwuBV8Oj3hOjySWL7FCCRhYX+Xy9xLRjBb2QN1FMIq4Ai0/kENBlxgwR6b4D0fSnmMAFhZwhcd+RuyvXgAq3amVEGZIHlF1hGa6CVfW4/k75JVTKa+O4CDKWn1CypbY4XmDvDYLiXxaEL9piEfnIonI0fdKsRfeLJjcan1iAaU1OArqTJNAQlL16EzneV4jE5o8QhDX4fyFBvjcR6SKyeFgNV2npNqGLWDiyvThM1f3PXUV1QO000qPOs2z+u0ntE36UHu1eTsKh4aQ2O0FOdTllxItZ/vD5Jx5glXYVzvZU+fidqhLyOdrB+d8KSkWuJoWy1EYteSmLpmXq4gCgvFmHU3xNwst1WXUw5Q5eJulOMS+6fuA6IfGaweu6KW1h5qy8BjijIGj65gWfxw5Fiqfu2xIIhEgRZKKrS+VtlESebMdk8FvfbZo5F5qldF3xVh89nnt66/7641vb2xOXGFKZ38oXW2oVOwD/IHAshX5ZqpsZn8Rr8bmJ5LdrXdbKOQOlTL/3qctgG5cKE+dqpSZ4Hc75AV50RaK4y7DzX82TXxpJY23t7CrEmAKUVNPUtVz2VwvHceJdwseBwRvi/A8W4EQIpq+i6m3i9ZtZl075B5xD2CDDT/nwFoVal1Mx0sT2HAWhVZR2gzxoxnJFgzEeDUnBGeCxHiBWWG9M+EBCjejmOl+3ua+MoodYjQ0n/HBtf5oJRMNmrxxQnIiz9H/isvRke4bRRhL9jTzjLAw4Wx/dwjGJTuKK5w2Ryk+734NjZYfGV22MwAM53hIZR4aircPZMxxw2g7AhlL7oJ369tOHlz0bDsEPkGazblx8OFHtOKbA/bF+BgZgymZ6SACTBRpXWZh4HhpwThQTgNl6kMbRZBiWAzQXhj7zyakB1E69xP7KnKrkoTtanw8xiBBh+CgBE4QOHJ5dlrbnjH8PxA0S6RuG5h+Gemmi7YWL5iuU5b+PVaCPs7nlor+OD1NhHGffo636QH3LtmeLpcjH/sEu6N4AdtC7fZKec7nmwlNk9t4dLq/OUtby9bN34KYTq5ywxtjnwlfFT9PceRv1dTodcLbrxttq68GYl7PMriqGVjT/XL0CPMPcSH60Z7r55L9d9rxV0aRQwMbpmuPZvovd8mmMxJZnimrmZccp1g2PRxD5llCHQJnm3LjDYXqwei28c31uZwZXhTkOe/rJ0GjwbkyaulH/st7ADKWalMOF+ImhLDPoVaIcIWig4JMggMRIYG/onqChkcWfeE9nt4jyJ0pqDcBxXufvTxGcaYoMsD0l6bcyHGnJSQ/ceDLxP0t9PrApPfgt83eq0R3LpKVoDw8pf6hudUYlNQ1RoWElXYfVPwNcRo9WXD7jP/Tsrgtg4rKReCZuT664QNHelm5h/6uZNFG33Rx6kY5ws79a9n8fYyH2E92IEREA+D24MnEO1d4321aRtSDbmj6CeB4bC+Eoip7kRf1oRmdVWPhk361bQWL71QgdS4GyC8hjRIHZVeb2hvP2dNgMCjeMX7vbijzTwGRlNsXXDPfC08I5/avQyriugPOIG3jJvHI4y1ymNZeoJPdlBVmd8TI8t0PaMZqimaLERLAHqE99jFERguqshzoMOT7QlQ2xgqgMso58EiS2z9NwiEZRtp0UiEdg9jXnIJL6fwW1CGPESGB/eoWrT8wVSrNrPlNJ0qIJ0CZt8O5Z7QbHp6KAiSAcEKQ6JcJ0OxI0+n6MQs72CZGLajl3GfIoLxl1ekxF3ov1aiUR+X59vHnkDtornEBv4YXHxcJsupN4qdzHYGgSxBslu+bsoGxa1wO3hZcAY1QR72g9OLBgm4KiH1KMrCDxkR/i1T6Mtg+bUUhRrEgXkyCQ2HqSvZc1B9U+Jqv7ds5ZJbL6hOIuUXCxrZ1IlJEMbeBZuziv6Q5NH4eyGelhZJIbp66moVpJhallaS5+4bV9/vNDrEQ9VSKF6Nbj9UQce3rvexn6UkHEs0iX/VU9PaGNzwo70XTXZeY96bBGlaQwhJA7T7bDt5iAw5mibuogf0E2965fhCK5nvjv7QFhnAF+uB7ar2gMXr6ew9vsCl3NP+LOj4mNu20FfzyR6ifek7RpcCALhSTUJ1BTRqZ0lgeojMgFlb3rh/RBlzJyJflB5lqP7bYCd/SjWQ0FMGAOc6hXoR1xtV6MWIOhPoXS8xYA5WzwL+JbZwVZt+DOUV/tkma1UpGY4kLCexx4AY/aFOD89Fhms4J/GGoWzLduroZmjSAM/fNiOmwMU181HPuAjbuX83XnA8ad5df12QzZlWF8znjzBFFuKKYk7gFGg3HVLItFaILiFdEbmLV/QiJqCgsCOWF330TPhDnR4kFrXRFGJgPSgdfX01nyHW5DgPWTAc3KIVgv/xCebwJ/LxG9uxYVlz1iFqSpnwO2c4EwJG6wIr7sgQxCcpaUQJozt5S7GIi4FwJZGjLu+Jcb00DudKIbcjMldQDKFahrlMEEPugeFI9AoKrkxuHRMiyWnGNWY5nQiMJXdOahFHkepe0MPY0yiL6D/fPpRTt5MaAPiX8Yds2uxAoIKGTDO+TgdErwLLIYTtKaXh/i4m9Zx/pAkVtgxy1CrSZkhJ46JRTcCdND2GGg40HxV5wwZQhfZb3kWpLRiI8uB+wWJZN/8UYkKlp9755o/qkroaDkzDiv5wuwsdVfFNXuytHLTktCXN6d9E5IqJO1szUplTdzgrT5gZUGs1599iasq4eWYF9k4Xkr6l6rOebxINqSMepqm+MmG6kFZxb5833J++CGCzs/LUryPZscqB3PGtT9WJlGxLpQfMTACSgRbJFRByLWU5I5rQB4b5X+e3dQ0Vc+xTdiQtMHyTI3f5kPsjfG0zb9Q7tjnDu8+OICO0E/zFYy7MY2WSJOuJKmOHlGEHhRp+DqRfvgYp9n6qp3k+JgusoEogJkAhN5p48Ddye7Wa4a47yy5RbA/pO4IeSTaje5ZLFqmwMp/b4xb04Z5KkBY9wmehPmfbM6G0FjzD+pRxWwBC2cFAoybqRpqZXdBIgeWnS26f3pX9I64yh64dnWTeZdfQQtGcOtEHkidDxeSJUSSC35/nWeA+2HOFJf5mx5L78nfFVjo2FRBRW/cWNoeephm28uVo3s6jWQpZhV8xG0pdt7nc2CjQ8mfbr4rurktJPs/sU45jrW+RP5XqujK/sx8f7edo8f7YM9CwcCOL9qJsSDvX8lK+x+KXxCs2iWmip8sp9BRf5uUtF2WJ0fsXUgmDfH44qTh88j8sWBk/Vv9Hjmd42s4+V8C/F6ji9V2nwUV5alggPLxF/4c1cZxzKtQ04x1FiYkw1BtjyQF0aEHY3/8QbR80vu6J5Sr74709s55gV0Tt7hholUTBDJrW/emd+yqIiVwQ3mVGavX7t4C7hW756K6v7sXJsYj3s3OMMIKKW/7QWxtoJsJcu8zeBq1MbJcqWqjm5QGTVaR4hzIDlyJ7OCxLfBY2dDpI40QoMpS5frsbTAJRgaYdKc6wUnfU058qULzzWYC4yzZpJAwv3EUzGNnYMLwDRdeQ996JVbfskCHFX1c1/bwOfov7ybqDU3wwbLfTMog8/AkSBX/lmWHBvcfETBLXZfLE/l5UOKs0Ufxc7OU6rJ/wbrT+pIBUrgRYHy9FDztE0MuzTPhRBPFG9lwx64hp3T/flWVgg4RIVr5im+ImjlUbMbAtea2ABsMGojZ17hXym0kivTQaDHwsh/r829fJRcXOWefO17sZKKTV53oQhDKuI7L4bnbEXzLNPEjYf4yKwKCvzaKRiboco32kDGXd9ZJm6ZeWZvPMB7wfMbaY1mkl5kZMU3N0iCuO2M8v8Xg4nId8Vi4O8Plk0MaaPjq6ftIZl2xuAnro8QobYxPcrW/XSpAU06CBQC3o4St38rYmDonCixg1oiCAXsvbKUpaGpY/hBClww0bt9hk20JNqgqM1Jc3KkHbQTaorhqmF1WHID51+27CFkhT0cHGMfovrVOdemeLJ8F47fNxyreuCrkS4Vfx0p5iH+Rfqirv/jb60zR/YabMMx+1kFN35zufvAhlWK310CRJiEZLyqMAnTxqFY55dLRYDUiljp+As1PrBjfrJ8dO+rtjjdQ7RzRYEZvla4NlzsXKSasdoCgy8RuwtJwtJXhm2D/7ZXj489b2HSBW7WAhsrYgtlC+3cjSOKpoZG3nmsEn1EB7TNcNJTAbYkzPPcgOowN4nXPmIXUUyheutkmSMW7RUhVRzw4q+Z2r7E9HX7i6YAICdiRRH0/6f9ez8859vjpwJQdJfe07uGx3nYYoIc+VLS8exzEh9esPNrnFnz27vQmMn+Z1OA4GdUNZCGfArWXYg2D0w3u8uevc9Yfo6JpgLpWCCKDPtQHjr/UNwR2jN/NmOzIDYphSDw1ABN1/I2Ul5KdwKME9X7aew5xS6ndh8HAcwApSO4w2d82gOtPVo8OabH4AMSWh23jwyPMPh9PrgTZbJxP3G6xbDe+UixeSzBJ8YiaoPSTGGHFtpD+Sv7Zg+hcsAjqcivpo1cwSK6DWDF2TuQFAGseg7ik4DOQvQqFCjgn9073/lXwQMEfPDUM/yFhdnDgkjVy4uavwbOXQt/Njoz4O1D4eIwonsorK3c2XbaCM53vUHXtDrf4bX1KnXR7idAIOnAO6EWEc6oho8HHppzFuu4Vqyg/58wO4leYfZ2M+Zz8h71krqEvHTPQqvW//On0g1RxGSwDoT8Yjvqj9eGADnPiaglOANz0IpkUs45QoKd03ZAUeWtt6x+MO8INslgR9IvNXSrEPUyQHXQeegk4x088PWqaThGp8KIgFFZCVTrls6lDYeHPcoNInmUIIXZUlIJ4p2QZIH5/Zb1S5+NEPtHfw0XmH6l3EtxarsiJPkrIQufWeKrxFaeC9yi2r10yHg/3rkEb8vBQClvTG7xHaINHhf0tP+GqhMrU4/tRAgkd753g4UmmgucK0mgsMHS30P7jD7zbcDET700DqrrZZN7QPm1oXRC/hbMVJQ9LGzR83595ZiHvPKwzWaW+4prAO5X9oaX0UcjR2Gb7AcikdwVw3FlSdRShc/d5IYBI7q03Y3hsnmZO2XBedd/56yg7JpvgT+OrK7ajTDWociIC0Bul7aVXQK99RxiV0EJRWlYru2daWJxUXJv0PywkqcB+2uGXdT1cis7N95PJjTFsXX70lxVZfAErQ2FQ1kd+tr+EtnDDfzVGUXfQu1GcRGqB8iwEGBN2Yfhvl7tjRf+/daBdgQHZ5S5BpB1Eh/fJXNFYnSRXSjroi+desTvgi1f3vn8MOFdW3jXlAoqFuaC1ug57XItny+EZ2vWLwupX2YvkqDxoruJmAeYjjYp7Ej2wknH0GAPvu6mqAWJfztXGQHAVzuagfgumt4QOxP5ElFgp0TGoJIl3K3OSKLy6BmHAVO6Z7nUu8ZCk1rpDQt+kLNstqBVBrIpyvsLxD1tVrHPlloPYZSsNQ8yxYcQ3/fyybRSXH0CwDV+LvasLRSAE7gpvHKdYUFKsCHFoUbhZ4q6DBzafreZ5i/zJjSu33ooVQQU/hRy3LqYJcRLRKHXBi4TNQUA5VYFKe43Va08L98p9PdUbyLIkdp5M/w9I8/d+XaL7rpkcms3SVYMbw7pJU5xvi9qo6RBpgJkxkhpnRN08xGMhrHCm8emg/FwE8SQv6mic7GpxVCB7j8r9FYvM2ZI+ZAy8uROu/Ka59XybWowwMb/UaVZW+wY+upbJC99sFxAz13dOk7G4nctXoSheJzmMH7b0pak+bzr2M3IMoNoDMbZxJsIZUFhvgmYb2IeNxsIUkMw8ReVhPv/Z0IEr8HmjC1nPFlnQ/Mc/huGRpSdl/Xxn6pqxrmQ817fP9Ls3eD3A1KpKTRXTpiYIHkR1SGCuccbB8TpAe5kE7SUjX5/KJBEWbrMhFcKEo1rhhg/2J+WNP0/rqhJ1lnty2Y+ik3J7U/6k0i4n3mXIZLafegnsHJZshtpWZJGwfFuvY/o46020UGhfFyUAHWkA0Qzpoz+X4zWoNx93fFk23/LSZoUEKt1IndNtTlrBsN5AyCHpysSnecxoRmr2Z6ubhqB/xVuudTM0Pg2ey14/p6PwVuqz1ZwmfXYoIIxB8FxkH04MKXsyDXuleo+mlMazjxSe7LoKKSny8wG+85GJIEkN8tE4YTL+7GafuSnAZd7TyyFOQN7WFEFbshag5b1tYlTBDyANUdbvOQ6EIRtvUWw6Eljcjmlw9rgRCP5mS1hxVkbfbCtUQt4H8sx8iC6QQfvXF+gVObY3VwA82Pdd7fpoAKHTzBw+pBOlO1v93jx3RNayJ8rQJA3dh64cpyclagCHCCz92ZerR9Si/rCs/LMCNmrj4/xM/sKg/nxhpdWoxU+JO+NKtQneMhBGtQw6bh5dQlk73jyVvyUUSuICnjGByM32ev34oj71tyWVjh/RrMKXemrH2SDvPR98TXlRcfG85knLn9P5SH4rp2WPMf8kaUIMDMGKf2Laj2xMWhrgUVzK+r+B5zGlQQbv2T+1xfcXpHR/vvV/Jbt9BbIZpagoWEDodjQMCEKHk6/peZo7VVrocxtU6xETzncJvHx3KrNecccbE35cOhU42MJbk7SqTWWHAerEbQCP9Szzp593lK5Z6fgUUqXg5D+wfy3waR3EmiQf/kUl4J/qcVWgC9TsoEnGQt2nuVIQQzJD7aI4BshHU3tIj76USqiHYrseeRdHOJ9O05nBih20z6k5wXMS56cKWc8IVIZwBVUSetKpn2zCq0OQe5SxOzTKWQCUjmz14UM0VhEUOc8rNeh5WoRoQ9Viht5aewMsspmAcL0PVJwYIp6iQvhHbzshk43PjN2BD8oe1I2Z5/1GkvQ0M7dyWEflwFLbe2knhRQAhV/nRckVCtWI04a0b+Yn85CQ0BblcY3TJerCSB0V/OdToE10gDH6/+JSggWQyYOW0twjFDUnKRA0Y08/6NXRErgKSL19FpHU+WatW464/mr6ei4kMaz1RCCQcd8Ts+YI4qcldODfpa8rDc06Zk5A8lLUFbugfYltd8KIPI8wdepAwjltt2yxbGwMIpRPn/raEczLmfOYfYujgo2PvOx+bLopg67Gc4LpMBGNv5uzpis5uSqU8mjw28itYy/+jDCWYNVXHGiHL6r5rS31zGxjCYZFdnn8EOS69jLwr72v8EsafB7/K91lCwa0JVIy55P2S3fcg3+WQcEJk3Gil145S+ZbtLF8RRBG6JYZ0U/VOKHunN8ZpCwNdVU/iH2SCOt9hKH4trOnKZtdA1ix2vlZvetvvYlqOPap/eb3bJMuF5mtP+JbYIrqbI5hFIfp8aHc7/NwzuMxX8AUq5h9wAV/QCYq7/GuhZCZjlmcL1y7+LHYTPwwfvVjpe83WFh0K4UmCn1Vu6XG6DeZv4HV4zBLZ0B7bEVU2CpyCPkL+OMhBQXFYhCWE8CF91dws7BH3JYwAR/fcwCUH3CXhzMjXvAdTrMvx+088Zc/IM9Jk+9rcYKdJUL8LEZeTCz9uxP4ecMq6BuIy07Z87utEkvhxsuvJrIp8IIhGSYLnA0WM2tj/EC2eoFlwFNJIVUPG1ipQef4WxmYAfDmAYx2tEIBVLRns4zvsUcWsKFJmv4/mkXUGuLYZCfbwBDy/uzb/RRVF/mfri5/ft9mQlV2ET0Ma3/H3O1TOLfKe7dhBjKbkG97hIHw7QcwhMEpJrLGci/59fhZGW/D8FZ2S1HejRENlYEwNclKvPClNbGZvR1zFDYnzcE89l/iEk15vRXi+HIeBBt9fED8Btmf+CBiZxE/1kghdh/i/PNCZhANne4peZkmZwvcVSZJAFXRZ+hxeyNYFb1CxVvYExYhBqUZGhNk3Mo9PcXpx3vjsdEFcjCcak7Ge3PvmjVciQfkrGiOOcuMlMsSAYNMLzhjOx38A4wM+Msd9BCo12HmlN7CiysInmc7puYyFOa5BDqnzpJDDlcbAyVh5ct4cabMrlxNsBpxYG9a0I9Li9qp79RD7nKZ/hOCaiBGirI7ixdHayUxYre6HjWqkamwC0/SKh5maFv2Gx0PUhK/as6Go6wnIhNy+QlcWzWD7hhC5Wryps3tsEgOmOERN+ph5+SUhKeXnmAc8GJDbEXAgWlRC5XUz/kjKRtk3M0SwPlfjhXyaDZtbIhtvCy6jvNwQTyL/k//qkdfLoXQx0NLaJ+gVeWhE5MsOVBQBHOduOuTmQyP496R4zgdLxwHMY/6ZHX6gaV/3/7tadLCzT/nGOY6h1ZFd7Z/uG7fNpZ0LdySDvuCQ3f1H9meG4eDIeXaOctlaru1cXXmKY3txtjC+69G6pgL74tV/QARcyOIdQIiNX59oTyd5CfRoqtgrt+f/s9QG/tghPn4IiNoiQ3wOT7L58nx1xAg/KwMozHUgmZY5gYeN6jzmKFAXxZs8Rq9A7AnA8bVnfh69aY9vrOdI6Ko3dsUklAKsbv1GqzQ3kvMvHzUCp2ZrY72IR3VSVbk9fJqAbcTip7OZSENDog2Px/yI9wEsFRo0pGlNejKDA9W5dHOo4hjKvpqMqXsqoEDYteZN6OCsoipwis8gyBSOKtV1wZoObCByrIzvOHFej6uZtcR7Dgey0Fo0P+mE4VoZuRKmEtWsbYeQZ4Idh+jBGktBOT8cCnPycKaQ2jJb/nMah7+8G8oal7pFGqZz2eD8TKXELMehaYHW/Wh0tTUa+G6WH5lrLEH/lAdnkJsjhmXNCOkCeQJVXLdezQALTub/ATHg1oyv4ZlUgF2SkMvoyJZX7xeHbuhwQvDWZpOEr3eiNoxkHnF3WmZH80AWrxRxKJP5dWA91HAPTTwGhh+fgkiwNnx405cb78k670X9qvUG2VT+haAnI2pqdgYKsifm2yqjmgGDK8OXh+51cSCS+NfKKqAAo84EZhXMW2vFKKgc143P3MTQ35BwUStVN6x/wixlMASoP+KnKD7D0Sg5T7F+TD2sDLixk8vtgcl6Pbw7U78yTdiBIIiujCqbenpqN2zxVdBNBfiaVipL30oZAUW61EQBF0WLbFXDd1vwMVaDLCtBysYRiY78VaPWuJ3qQic79RGKNrCUH5uHJUb3uS7KgycgNbDJAvXI4PeroxkRbZsBWC22+ed/LcFDOb4Br11Ndbhk/+ZvPFw6AIWKVYxKo0pl/8auJb4u0UI9F7gb1cg3npir5VUMeft9daUfwK9SySbMHzePmYdA0tm/yEscfTRmWeKDQbQemVH9/YdfZmBLy6Ub3ZK8K1R6El9R5sk6ntAp+tUiB56FCOyoYIRZlQ1k1j8DiahZMOCoeBdd7Hk8sGLgFRUo5vp+q7NPWGt3ltpEO8EyTQM/jFWQSUCvV/wzgCdNZj/aJ8jEkgRIYR5X+tCTXEN02EbG7elPwoS/iotxbXn3qmCuIwYV1jRQASmRZ10nzRhaPCeRupo3M8ce+fHwcTlfBNUw5inRFqyLv1JqfouNNQZI9hRKJYaZTRfvrFe90vkz6Ot12DSIe5nA+ZolMu6Kwsul0u22mY7oM1HbHGSZAnWdWBvdgIQPxQ24dWrU2iflAJ+qxAqBZOGhfEPm+NM+a1kh2hgcUrxcwNxCS6Bo32OVd3J7uF6ayy2Tx/q65ProDp6d1GNwoqOQm6OJfv9BxxPLSO//dMGkQV2CcLsOfnrQnv6yOV+VSoMw2qH7EuJvbzmdMRNfQvlGKKzMXmc/7K5bKGoFPdWC2blGr+QEwnu7XOZ7HUS9ZGJ82/aIGn7iM/9tDuD6g/V1mld8EYaPYFeE9cJ6ru2d95FIBuWCoRMUt31DpbctsssRFt7Oa4cUlH64E7pJWk05rZhiMTB+Ji8p0zjjp1iBbyDw/Y6M++RwtWzJw8NrpjVPjP92bWvGLkMBY/p3AaCPFtcTj/45GRz3yozCjRbyTYLh0qcnekg1xxbDZpSH0zPH6PHQ3hIzQyTqYcZPWczUNdsGRCgAEsN+MLkXbmRuJfvlMUG/Zup5+QByKheSg+NTHWfg3CyQjN8PFS0hKZLgqyg4jSEncbG6SdNJyKDDPMpkyTMyjPiPSX465W2W8nGowPqkUTOf/ed9vBawtf3SqQWO3j9wGgSa1A4ybd1iNL368OHCjgs9sD/c2wT007fKbFYZXEton8G+vFBU1Ob2QNYTEQUyFjCF5U46/63LhOQ9esdfTFDBJxKVvdV6I15l5TLG9qZ5K55N52510THMxi7r2ljIybWA1I/McginR1/9wNDnoEHWvU0nKQ9s52ALsmYnUDKhwvddRC8Xd4SIuIhZ+Ki8noYeAZy0I+vmiXiP1xYw2VkMKNvNvL67I8rw1QkfmFcOvenJ5cv4GNXZ2Dv6//6BVqy9cCv371Dh7zUsscd3n+ZPX8fa0cEW3Xvij6CcmmT8DlRjy7n24DPyffDnwX3JWfeNZd65zkIj6GNfcOeuElgcIc8Mqo5wFRg5jnYNX/OdGzhgqk9jC/O5Du2W/3fcQT43DwXYacyM0vpqsqYbA39TlN26F8gjeJRAY/biI5snXIf5xQJASgSYOgp427u05x3b5Y74VCpk5R/JYATHVkQTbAa0hOhuQFWHomUKv2RT8oXHwkgb+acD48JyHQNpagee2HxfA6/4+meuAf0PHcIDWU15W73t857t1xDU7oaxb12unX2jOMoePLFR+zncv/TqilQTkcCTCJsVhdgZ8vG6XHcdV0pxfnVtwewG6XdX/xs4uvQ68pRd6zZMk7f+xkxVcPnQ19TZwRL11blaOs2xse364Uqt/tg+Snxqp5kcDg3tLR15frw6hAd0AN6Xod4ncUMCB3bgsYFgUIARVF3g/aTi1/Sfy3RlYfBvyiytlEBYrPlnErP1amx1fjjYmFZqfKralZh+m3bYzGvaCVqSaYsnaQoKpeNPcCYV0xqygv6iRZwEpa9nYwuZQv02ZzJ+bv4v+ICEVYPxb7IvX3DJNypQoyQqh8vOzzPU1i0p69GvCt2JkJA5C8W3eQyQqs5OOCUYdidYeGP/EM5TzRh9QMX2sQ9lh9fJ//Rp5RSDdhn3IYSRWcwm+cxZr08HvDKvkR32CEGcdMl+WVjue08oiNETi4ndKPE0SkJUtdp67AmwSzpbLS0H+Q9GV9uPSKqQ7lPRPN6RqbGjIbizuku0dCoFqQt+czL49WMV1S7tULixBtqoz0Hh6BBpJeg+rzVPcsNs5Y/FtCakOCcMWtwyqygTCLMZhAzF5dSkbUwrNaTdWr2o21/DrwDf2S1h8+VHqAy5Tp/liMrqIPAjlkQNByiwqzj3v4oR0NeMQ9E7COmClBuFv9umaxoa4j9YAjrRUPh2uW9K75F1Wfspns5mXFYK9/29bbBHtJkkJvnh4+zPi5UyJ/nUG2+iST/d0EIXPe9REvQl9RP76IOdKzMpZ7VIcLD6IUWGL0dxTEDPYLbV9S/JoJinohOuzq1xU4EFPEfl3DFEE8Ds7lctz6Kx2DHqDa3KiKY9ZcUMejV4n6eh1gC//cs5tmGF7Bq1CG6G488K8A23p7dl37VsfPgotxD6PuLbfFlgFKolVjjMWMYPagceVTFkGHgdrWX8zUGGi2wiE75xzI34CVe5f8USdeIZMEGRu2lxb+hY6/p5Y/4nUlhvMEyNI3pGCH3TYXsgmXE6V6lW+UMROnZkYt/BMotNwVapxFVhai6iyw6LQGiT3PFRaflO30XW89BZXIArPMhYds55lSSGoGKfXHTeDEO11BxWMyS0oBFxho+AL2Gyv6moS0QAM6ZHx28EPQGcC7rhWD7/+RZY0KiUqeICYfLIIx7yfrmUgoUGjGrjVkukQ4wIkHM37HDkiJZtXAkSS/+wuwAsYk42Ci3LTKZW7Bx4ihxIk0ZMPmlY64t4CSzMKJMGMiP5mjhbNTWjxKO3Zor0h6qaeV8ppCiwuL+VL/okoL3VnVF7i9Y6dwcZEyBUZbEPBUlZrPjuGO8d67/kgfS/H4x58PeKeZZdvzGwQtnU4woF/VY1TF74AwBbrcPcm0yEkShIW1YEJrFgT3snKrW9jJf47b34DCTxlmcyQQsutqi0mSkpS2R95k21LaHC3AJfQG5xnJ4YUDUVmju//9eUSrtcRjFmJNJ9b+pr54WL6oxytnnWXRAALGk25WBxGrr9J6jiXn8HjqpUM2/oyVLLzkPYVaUk8nMUfhyps2a5hTKExRvd+xXRysrIJrVMgqTIy1zf8nusaIOtpIjIt/kHQYgtfYyH47NhOVvv6+mWaw0hkGGp+kqGTSyoY77mo4xkcCKTngUocTn97zuctSBjftzrelLFyU6lANXrnr/RlbDSMW+h9wcxsm1EEmr5hFeAey4YK656l8d+WgsqvGqs2YsCl/AnukfDacyosq82/ZjCAB4r/SCvCsg+f5PRrVMZ8eLSisWtyICKY6rL4Wrp7RdgJGJXBIcsDSZZX/DYFmPgkyRf/WkYIgOADp1gDSeNt3YZf8xu1FNxprBzxa4nqdOCj8zs76aHvtr2H5hP5/ff3tSUDeBqU4n1FxDGudyKK6PmRfcbJpE4AyaS6XCxhOcdh/dq7WUvEgtdz0WeQOMxpZvJaCzmgCr80jXTegj/h8I25vSGoybgrvUW5v2BrQtKXRJeMgq6d9zIhhaHG3d0PD+H2a/hV0d359j881yOwXRocFPY1Crf7XmHxd1RZkCpbufOJKp+kl5qcXXk/Z9+yNikOa7smRPfLqVA3wUAXbRzPri3aVIlbyTHnS1zjysPy8+hJaiEFemrNc/YNioh6quSNuplSxsxNRmN9rjHPj2PUQX2J8dkSLeWgx7U4c698UIULoKcl3KcqpytY8XOJggg3efxfoBDC+aoBCVaEes0rm+Ibf0PL555x2vqEX435sC0OwQwQ00yYMXbDsLXl4iqNPiEhz2xP47bDfj4dV+UGDVFFibVsOD6GESl1zfcTBxEoThzwbgO/ltMlEWqwC0Xa/PTr3qaHRJ2oi7Woi5Xv0z22KD1D2GL+v2pIRBseiievldKEhX01/sLPcp7YEx1gaZPtLOiqI4HDqbU1bQxrRx7cppz8gj1JPLSic4WJSq0t5D0Ol1bCslB5j6oH6E67136QQyLdjRqL7tUlV1fujf6eO6En1eiMG5UsrzOd/7XqAJ1Z2MsNMx3N2NlLT1a3wxwHcozOWjYKXAF8nqsd/o0XwAqJ90OUwdZC0ZNeSHjgVMQ5lC/ktdpaiV9vhnet3vYuk8lWpn0rk2wNfQgzAZR650xpttWRZgzQCZq3wzLUU5xH/9JNrmcHfL/KXyDpjOKRVhPdxogG5bdlCl4OAOFZgJ7cRKUnl91AUSA57ci2+elkDePLg8vPMoGXs3EooMwwqK+LlqNuWvMlxxCfMpK8DJSVc+FkXszC2nc+w3it3dLnRWVrX1OJ7vD/GQqT/BZCJxxpvikdxBCm21smSBMdshPhD4sJCkbUqVftSpCkaXjCj7qPm5ybRIdJz8900WbLY3BHtdbyZ3pE/CVub5ktROdI1X/ThqtZrYPLdm1xIDowjGrP2QLoIzILQP2GkPiBzo698jVtZDlHLmfAkynkBzPNGGAVf3+aq/AwwT+MoYSdwfo6ZYCSKde24SjKPmUHj1usXqeyv1CbK//8xFvdeJHZP0AmDxZpSBRXi73kUoRFTUxsvIzetD5zVyWaPCuYWglEDpuEYmcFxly1d7+4DgRGnPN9FkGHukBjCi1N3mA+U1vNIwkIfvFJSUoj7jSti6OHkga5IEGuNUdJg8GMFJxJAIYUOzXWn5SSPiJBqyvdIywKsLfp6xQgTY37016axPPC3k/qCFaZeF/BaS/eETVC4PJnptFavIjXEGweGwujndJAvGXWA9nXYGDWd1ejxIWabpfB/fQYz363qJ9ITWt87CpPWLVLCbl/NuvCd4D26ckp2g1/PssKH/T0LrQQdVzhSLG7L1erRktmSJzGEcJCzrS0WSBuO2XZUwuHnSoRAJ4RCI+w+rjUnKFHK5yb8eqyhVs9UuQeFvDAMP9hloV2JYmQ1oQwJWQxgDH6fD+VkbOams3HEAiZPA6kgKrYs3j60KhprWqgJwqHZ22JZJnSSUitZKCntj2I77PGRI+J8RPzWWpIaWlmNI2bEm4XXEy4+dmejM9hv0OH2vhVu08MYyJYsY3mIAATPEj5aLJ5pyoNil9CQ/FEyY2K7LtwgehboxMnNnJ8GD1b8BBHNzWBcHlVUDmT6NodJG65Or3gvS0s9WQtJYsuTr569dD3PPrDOObQq+afzH8FEQmzAL1Vg+vsYdHiFWxhxJeK5tk+KbJRDAEAOoAU/eOkaT6NAuMqOBB3U8onSQAXEX7RKh7RInhB2nb8lNUHW4NAyXqLWgFf5QtlYbbVMay8jNF7aSfZ/E6HossPeYbRNVdhuZxiNvK9EvRvm641sLYAN/zScVMj2IxaL6oq3j9YYhSwDpBeOTgktlmsPmvwntE71NJoCuB4EQhv7VbauZrN06xi5WIFXbs14X26MYZxr01yJut0he3AAXBFiUL2L5PxIfa+wTYcDD4Z9Q4YsMVbr/4J7LmaKefOcBaiGtPXPT7wv5SLBRBFZcB54X4Q2maFEgySH0ZiYGgAaBD5iZmPpNa8XVpU8ofB6JxhVlrBgHqWUbMyM2jiGaKpI889I6lo6WY/9jbu+h403CtNP9V3ksXlBrXr28DTuemU4zIBj6i+LLUuhMbwwcuC5QTBVXZ3OwICA/NUAKglBnl5Y8E3F0vOTkZ8j/GUjMb+x2aExbzzlIdNmvsx8Uv3RFIARReMBfhDZjKi/t6ngqafxum3G4/oMC14fDNuD8Bu80EJtuJAz6kU8quHywspYz62PyUprGMzglNCQ6KM73TErSSoODJpGnnFUyqIDGjcwLQ4DABpq83PQFSfwDDfVTfcU2yy5crVpY7qWCbSSGHQmh+IWKM/VlWYeU2qfVKNtxIwdIERGZvSJyPGFh7jp33V5oftH5Mt1iCFWUSDws+IRV0IHEqj/HsCjBWFm0ei0AjKGfLWSutb4GrhO5V0c17GTCrLn+lKNiWCnVzCcY+8GsExiRx7sFgYk7hgwphNFN9HG3+UoMjC3e9CzW29KBZYHkNAIYWUlufRb73RzbNGLdTPgMzsCqQW4V/cnhGy+SW6Cqf/SmyKdtQHn/uN6fC3J3it+L6oZsbn0sWONBl6PBubiibHmd1a1fCJ5EHxVe3OXTRLAhaqh6QbaQtGXkrbo04DV1xhAw+uYbjCdRW1vCcZXrlm5u/hcP4z6A0njvhFjwebbdPI1B8QzCdc/o1d4m0KyfhHnJmJ5pptJqPVWdSo5x97A82/8wHnbceVIWmjk0IxEtGC/ycHwgXSvkN8Zpv24p9mLnJdhF82/Dv6uSvEt+VRfZ3NjrG4OcJRZS9w9KWnOu1IR0hyjbzzHCGpTDJ5n83oPyOGJ2yL/G//3K8/kDtTjPNivdMVSHMgJ4fzh37rxRyaQRG0vdUzdhkj6MsdaVU/C9PTgPprqmOKU2X7gctjokfosjz0nRJk6+HN7fhfybHH4C3xM+2s3P2RTq+0HBVB4BqjffJDJLXIDVJ1LH0bCO1GYtEwkZTuKdTOPBFAbAJs6F2nbucCBsVhQXtzXinIt503Urs3DOD+9uRNF7WGvB/tcfgZ80vkNpzgq8HfRtM+1fD3wnqx2F8um0u4KvqXMjS/rLpgcurso1gmib5wyFf3O7drOzUXVjubaAQU0TK5/0FLvFFIHrF7HgkkBP2REgke11wM1XD6Bb2nAhBsLHqXQNQZMfWMk8B3j+gsxIFsJlZXc7hZ2rIdB2TXJZD0HEpj8b2j1RGlxng7YBuXw6noEF/YclKlVZEnjtq7tJqNBfg61FZ6Cu1FqSW4WiUCH9yY9TQ2lJfekR070kG4FCMP6W2/ZaQXYU5xp/Wtko0jhO5pGS4E6hRErJ9by5eyJpUlhBEk7Da81Kr/VWC4s58Xqkx/G+Ec3vkwKxothJmq++re3+0DXzaNrVPtsBMju3M5i2BdUVXPHTYLZb7o6SibyNAuDXnjhO+4yKNnrfKpB93hfcaI3qygsUM2DVBO8+PD1ogVJ+PKcNRTeS50hTU9UbcK+7jt6H5qVmVEhMEdAsUO/rU4rrn+FuPeiyVmHhVnvqW5FGInKpDhOT8o62pNGLxapYYbyEZc16OAxJZM60gMqbk4zDu9oRpOP3Yzb3lDHnhRsh4ZDf5FxkAw6ZN8C9+lYgaQKDWtv+AY0Ld//RB3jS/yLcnaqBH8TTlpf1/e1qJOILeh/77i3+Evib6fvWeWbBgUwNHNx5PE6TNqoU0GrbhVe6zrs1z3NU6STA+clvPQSioFNvIgNaTSLZBsXX/+m3jdNPcliB53xNnhSMv0XV99QS78eUfbh5KRlarQXpcgEECuirFwCy1+TGYDVRLlwDtZIFCir0KsRQi9ygg+nAflEHQduowi0rT0sPzItDwkGItNkmzBt2p6iw1gtEn5RM5EoQJfm4Ea3NiCxxtURNgpnpPfQWqBVUv5W89TVSwLcO4kcxAufnS6Z0fY0ylnQzeeg0lXZsd5g/U82RKRwGnF0ZCUT4Fskml5e9y3xvvpz7GZyFxH1sknc9fe85TO8bblSpP7Ss0LXNE8BirtdI+5CYkiWk2V2LjkVDlb3f3uVotkFB+9BVtoJj9iw9gbOA4nIvYUwE+2IuxdYehJSnNKjrPUqtv6enfFuGah7pD1/KkBrvUOmsIYATWZaQ1aZx/LqSJvPZbPBLFX/Cm3oEWTuaZf10hDM0DaAhRkBEJPpbBPhSIEai4Qz5nCKkGn2VkJlkmEGqICjxKr6rwoEQVJKyHyOe0nQgpN9ca7pMvmBsCF6qscMGye36hr0YxfS58mBjUbwOEP7csZgzpt7rgRrG7CPSM/Brm8vf645/FTVtQ5WSOM/35y58NvLRjsk6RsTSwFRiYU5Gc47CDPNTCDiR9KP8i3FN0vahYcCv0hAW+O7gBjj0uixK6l/mwBD5LSy+d8V1ZNcxsOrdLN3mHv4CquftjcvnSxqWLlHLR1zpqZHBPuYxUQ7odLCAZGqwQ+B6BqB16tFD8TCqgS7n7lRmvbGtySTESKL3js8rrgDCciVofRDc07ihEELqzdUlFrxaiBn1HRXuUIwY7DXjd4qAtQMTT6/3londvf/0eHJHGdVLlsoLQPIx6nuZHshJvv28cgbk4pRqtfJfxBDY2DKmLCruSVwVBN0qZJAyaR/FOK0NAFncUnJmNNlUf0R6EMNus4WqkZ8ltt6zgSCyYZhTP8UcKewHYfmefFezB3lJwdtebBxv9MvDtJl2TlSvCqAhDdjP6inn/0YDziX5lgwnr9oDxb9CbD+L0YEntplbz7Lq9HKxIH7PbwDxg+z0kjRR09j34n2XLmr/yTV3iT4YS6toFR0SQ79juQnNRBHlrFZRuQ4vUDRiBww/OZg4popKVO+0sx2PvXgna9D8tSIr7mvsyDZ+f8BL2t1AxgWg7N7RtDgJH6BWogwXhIXCIVvcOAjcB+PLczZ7PDMxW2CH/6iybKPIa/s2O4UVy2XsN/zakKV4+n73z3TAXw8YDcYYl7FLgzmAZXHopYisYNWH24ZztVEH2DiZwy+Ks9ZUSScBKrJBWWpViTcQiSkbyvQRmRcyxh4jO1rAg/1mC0ri7z/gxzXKUryUipZ7tCG6mgzt3B7SPRhSpyvcMZS1f7qYx0WlT5I3EeVotUd6vor/1vsLYbxnLGf14nAcN4LgaDcrEhQSGhkZmvme7xb185O8xHPOSyjnu1R2TlRH2WqDe4rVJ0Y3cNvTZATWJrKThOKJ02dArJZjuQTVi1FNc9ACcHwLiLoC6jSVDZwEFlYflQp9aijzIHEmBsxiaMaMmjSQyA4q23IyKkvGltxlc/BdrC6cyfZythqsErSO/ZaoknHaTTj1Jdmxzl5Z+xqzqJw2boIL6CiqLrQw8BFRv96eIb091ku+I7gF8WP/BIbFx1XRgOdykGXDdSfGTSUgmIBpbJhoWCnCF1Piys6qBLsEvlx8qI0Z46YczuwMAmSD+UX4VEVIqWibu6KBU6jZNyI6SoYZpQAFlj738Jem2pEcQGf8YyyQyWlY0CVyDrCvlkVqlrrHLkphhvnHc1T5vjb8GytvkfDBSxEU3iwNBE/E5DJfJuO68QHdbGtcD2SpWHZj6r+rZ13I5chROzOELC/TUwh+H4KzziKrwzM75M8uf5CQbJV5RYLSpBINZqTwbxofkXqrK5YNY6ImTOK2RBLvpB1+JEhk8UkvgvKAzDlmJTyoTj3UZItfn75d9T3JQ9WkBakXFvXj1WebF1Px9noOByasF4xkH3X+E6bZZqw3tVhxQhLJY+GUS3L+axJeOEF8LxjEP68/CN3iRgc+cupjNE5lxOz3h55II9tE74F2i44aFCMCqgfFLcmvDmFc+7kvPBLo4EH0QFACqlnh1OikKI7Q5vyvXgYyxG7RvIcRsAAiypRvTpQKXJbcgATwcdq1AsocWMBT7oAUsiMYOZ1ixaKxiqfnt/OTl/ey+VAerFXm/NBUDD0eQjQeExDVAqozvFRKPcL2bhFYgR00E5RHa62Q8jgDYVxcrA7uw+f1klb2aE41unJ1xwuGbkb/DnSAbTIGpJ7joVFeet/RXv1XVYKD7Rfzw1+pHrRGEhrZF3ecdiDquOWy6qRtsSmFhegkcCZKwSb9rCZu9eMs7zGAg2QcIphkz5+Jd5iIGQYiP9zuz2aXeBlUMFa6Qc0rOEy4sUrISErgzK1WGX6WneXnc+PXoKVesk8Qae3z93jwZnesCSVwGtyJ8BXhZ8WTUbjVI6VfFvlmjYDvU4A5uWPZaxjqKBOzC13RzVKNHPGIypHZPfxmQlo783USl+upqBtjKtcMT1lLjHAtref2KDUAoiYwgb8ttpJrTnVdhb8IhcmNtaACibJn0CDX/kvcBAQCkzSYpEYMNAl+gbLBe2E9LA6jh8mPLFV3PmvQjB+zDtNnRckxxfyZiFR+kNqhCJKSmFgB6rPV4azSEatSBrDHjsbp5nsoR/9ljZ0RNMDu2/6CowfOHbswyHPeFFs0l/lLrJbQSTlG+lJ25Tmcl5l4KlHpUhVH2lQuJV7aibej2Gwb7pw8BpEknJye8oUtaqYClJkgKzeeWZwmT26LJ/HMa8nQTC5qagc3V5NuZhS4lFL2aIsOoS07MT183iJjUPkPel0PqKuzvpzu1f1no4AWXIh95rn3gtF0SiQc5qP7tvTDPZhdMHQXyZULG9NjAbGQ0828RGCSdNhV1lG+3H2qD6pHoNer/N7ihF5mJVERmobKbaqGco/Tl8kJQFWaSC/J2B2klrx59G3eyJZVq3OfjOylvi/ew7q9ZMZXfJmASRdqqysuOYULLONlbcLYsAkLXzKrXbghKJf7UAMH1+D0lmXHrJvF1LVcgsZ+gZEGh5dG6PV+Dl4Gr+3KQtTBtakzuVOfg4gj6jbLv/FqOn6lQ1guowmsnI/s6PlQ/wT55LZV/getP+gxP669cdYxSTtGfQc8XTiNgpAuXZDGWfpOtHOyyZVWijqwnAY0A3LgZAvgCNsMHuQIOzLP5AwuUF9ntuX+zDmytPrqESBm61VzjbHGRcglCeqVZbMmFuX82wDw3wfXFh2M0vmV1HTk1kVizNckO6QJrfp5FjkZDslk/XTwCAK5iolsahkgPoqqoKPesjDJlQ6UG5GVnfygl2uv9eLuGX2zsy2EySxGkUPonKbzDz5nKJXhXL6Sf50oMePGmMw+Sq/5wXUzhExwoe3OeaPxt6Y30LrWxLZfXKyCu2vGStKIKUs3cGhv7oEkssjKOk52EtIo9BCYd+fZW7nST3l+Vs7uYOsBQUsi+kojo/saeaJD5J7QegH0MZHlnvC8X99kVjsjlChoMAPXeTuynM23Juwr/LxIXnoQCBHLLYPVRXNNErozcHJy/vsBM5dIM29CM5GCQNc/pyBwsFt2p5GVHFJhRPah0MhpizPoydN6wVIFHoO3VOfvmP/4O7MLcBy9TVgVOAYFkrvBAXWH5ELhPTuRdA7QplyqSyI1B+Gmn1mTTxnL2y7SwTqIkNOg46APosPf4iepXpwn7Pgfmi8g6TkCwqWdl9pnDb56wHvLy7tANyXzYCarIFEiIlWr+TLdXdGmmhSoDrga4GPUjVpM2YhsRCbBttMD584xHa7gIcIRvw7KMxu8xZ0rgOrTJOmpDNiHUVDE80udc93t62Jhus8CsDSz8n4+DOEKkoI+qrwft4GRoyNNODQWlQ7gJQ4c5aXGuqmgJZk6Gmu/vUmtOmff8TAL/eiKMjb11wUQef9CUhacX+/TRVFZwMJ8TnmekeX2zkP9pUb3XZ1A01cdIL6ys0+jJnwjJP1CljAFqerUZKG7qRVP9AdYVn2wkpmmrkvVE9ABqTuFrgErzAhaFdMsLZszn5FAG8yMr/mrjJjhtVW/Hyn5Gn7a3z6cgyWwBOOUwTUPRdF/U3Fomg5nhakJRUixL3D/iJxyM3WPyLEXg6BlRdqR3Ti7YP8jXA++hpuleY0ZT8Kr77T7pJnjwwgg3OZIxDRkwPgEiy8ae94ERgCOpGCQeFjbbjQFbC6Yo8crkrFfuoHEsuYWpRZrIDvWCzBlkZCvRMqn5UFW8vyDSCMGjB3Zi5IUO13BAyCQxqrT3B51b+I7k+zrhACgxMw/OM7xGYRHCMWGSWTBb+t90c8gBFrc/uoJRBq5Py0gAUUcbC65fjTMG4k7VOmZkRJEdBuYLFps7MIn+MAWKnOwpMmbUPYZtN6ViBWwm91PnRq+cWGj3QKbAcSy6Jak1UmBcgCMxZb0so2fc6fAJoBlptiX7jcyQGuU9y/4jiAw/GbMmMUVRfopR/4VZFlT3jw1X5d2i2dV+Mp7Chn+Apq9liGxmF+WLP4EwuGabw9llHHgwXLrPdO4falh5kw65HoIwdZUGpf73L7uuVd3Drd4iWKHgktHVP8HIfZAL/RXF7jPYhi19outnvwVq8gheYzNKuP58Q/KJeE2Llc7fP0BzMVspi9/sqTjfSWeu5kbxKsvr9Tco02RsQ3eu6JFrpXnRn2PmW8luV64vFlEuwvNZPpH1SsCwkqUDw8dvMOhSxXluy3sMB+/SXUoB0L0S796sris5YLR9lIebOwLhRyj6YcACIArHDszTNey/+XSKIgz3gpuFZs0RqohTmx1NH0gcPE5yXDIWfa7z/NXIEWPElB4zUwsYn8luixI/3E5qhYzQR8SC3/1VatpUEGshaVSTD5dzAcKqxzBOK49WfWEpeQz2EgsbU9rD05qKziH2HG6/3Bf7enpGIWQV6x1239wqTMmOsLEvqeaT7oUDlhddCDksbjuoTu9EcEKOgDjLdNkHUfiSU8JMw8+st5iimJZf+MYsOk3/plc5VkG5ks7ZuUh6Kd3ioORfJtmWfT4m2ucylXFxVJKR3hKDQjy5iKpJh1pFt7VD6W1fw9Smx5Lc4TsnE8PS1PFo/Tk8ayBl3818L8nb/EzLSyupftUnEm9TMtdmZx4/5d5l28hT5SQVIZYjmkjB4TACePFh4akf/hB/YOqw1ILkxAVAxWi1elqzqTbSYea30T0KpPrJ3iXxbjS7yOXvz+w4nb1gQip7TjrFX+a5HJLzYsOKJ22cEgvkW7Vzz9GOze/HHBNCseA3AsoXZSbnWuXr06ISF6jYc+lDQlxaV6MU4NfD1S1LJ/ztQzd5Pc7LICknVdHFsYE/JrXh24qntly57H1nDt6Twfze+0fr6pExfxTmgRC3E08VthmGQLY4/38hurJQfh1z+Z4mjNo/HnCoTX3gcD6qcEEKIRE9gK7Uo3trwB0l4DhEWkTJLNDfvkzoiGA4vmZ4HTTJDrobgMJcX0O4fbixI4ksYF/LWubPnqn5oDQGnl8gnryCIuzqwWywCqJerS33HLYQewjTdu3JZTncJ6AwsuA9TO9F/Q7Jlhxb5tNkKR3IXndk8ssyRiOcKHyDi6NwZqzzJyjWHxpQUeLk3L2NZe6OhLBnJwu22zwiy+RSdSRNjtaBQOdL2MTvtQcfBj+UtzsgTS0g9jrnWP3j1Zrhd90ILDkCvS3UAjjyZjrI90Y2bw5A7LJR80D0fp8Dx+vfP5aQHvEb4D9eKmEgyrQz3IJ5X6Oh+mcyt2c0YcTQwv7KB+Apqnxvn3WYYj623uY3WlgPFMQFg3WQcCZ5qIkoOd7v76OxNXjHoxzw07WrjSSjTLSPUhoMtatRZSAfNPsG83+sMeOtEqVkI4hl8kDYVzUyk/cXgC80p4AVM0A3qAc9L/Z8fiJjAAB6YPu8IUQRpBTnRhO3oC8tJ8H4yTpwAZb4rHe/6k1csrjopCjX8Sy8oOp7UtV+TD49NloXx44JtH7s3P7VhMYtz5g68g53uzg8QoM7t/DpLNgzmektnzvgtRrxmFJg4CE1rmLLmkVy50Oor3Pv1lA0SXC0RFn145ye7gWxBVG4lHe0CNsIsFhvoY2vFklBSr22IMyfoxeISsOpPckBL5trWGc/Wn0oAAhBODVfftZKkhvykIa9M9woWcrXsJvtQ22u5xr1To95OOnsj26IGZqbwGMPe89dmv3SG2Amo8EgFCRPfI+AZxHJ843bBFfWZ1gxfCkTlNdckbE0xKugDPM8JPhFIWciS3TomNnlJbrmcSBbIVV0IgSwApeOB41F4VkWcGIGaDYuN0t7CXgbk7afEv2J3dsK9q3+Hg9fEwZnSwpjLxNhqA2UaJs3sEn1KAnBFfWsbN3OUhL0ECMkpFMFnhWBfvZFw+7s74gl4a6C1QELUw9RRGqA0YUjjki8BM7CRrBNqaVWaxAAgzieI65PHsWgXRsngQFBKI9iyhvQ7IacOGkJbwFwHN+JURgt6pSubCRipsxRlf4LtqMFPHZpiobgstHgnsNxOK5AwUcEf7BCKZ6xiBe0KKBTUuiA41f3M2vT/tsTPsv2wwizPM6QDEiVBcD5a7tq91pj75SPfiP0BCRHImWETqQ+12GKWdJ2zugnvSAvX/bCuos4HEobJ8E/V7HZxzJChMKiBT2/+iYStyarB/b28FuCi3js21i85wdDAf1BdVhulP2qdXmisnff3yraev45GDmsJNsVLHMDBURy6fX1TSZEi1TwiHIsUMuMCH3KM7TfMeS+vB8ak+GgwlXA+HRC0ziRbT+4FoCHIPxVDu4F3TjGYwzk2aExOhGD4pB7mFKgxMRkh4yaSeBaBO4T2OTgAJ2QHW8nBJvdgiBEilX/IGvHs/lXwfj3CBopOHQi0j/+Ypf8rD6JPX+eSH7it55r7wEarCFrfuEhXZZkjGzVLstGVd0fCpqu+HH0YuYNh4VA28j1o6jk//y+03aT6L4Vw5UN6Qth30pPMdj+ilQnTX2b4ks18kblAAiYuBFQDpqBJsCx9KOWwsM8X9M8X4XX3PXFfCfiyo9BkcgqKYjVVAb6HpuebTnkst77c4Ef9zXlCF9GvIsdygRGszlwYNjirnYWcKHEeq/vhkx2WdAhkWO+fWyj/ekTxcY5lind8qo30haScL/9KK8S8GglnQBEboeG1O/JKLHSgP+LOWwSKBkLDqq+Y0gzhNqoiCUCnMzfkc6nx47Jk3PYl1S/aXNy+je+Xx4axWL1cdW1UmR0vAFDzDrmTmZHGixvS6QIwy06ZhxYWVuCx1xRRrbk2IZfS8mlh1qghR7/ociHTABSs2v+V4M1UrjfuHMisJjwNJygT9IOGSBM9HU0S1qYyC0ks3fNiAV5WgKs9JQW8TPrt1iKjO9mu4iyBLfrcvuDpUVgsuM5Lm5oULUPw1klGvM+FW4daLDo5ZXHC/eYL2jBA6dgv5Q28ussq1cC6lKTUORv9Xda0qnU+Q5J3ClENYbjr6N/6TIKN8eLdno6izf6/6wowThf4Sx8xM6saNvV78ZEW5BwA296bwbaVxgJN7Xx/1Y+TknqE8rE8aeZNwDuYnhK7Qim9vVLecUuSa2PNtv4aXevLlCJtTZee7mwk9okROgojv9QYKKNcXGXImnFunQLQ4Xp2YKnZtew8KxYtppa94+CuJ5qnLCbUqtFpUV5Bu792g0zH1siSDgjNqGZ9BhRsHL66zPiH0WApjQCZyDIKa4t4IePwelZTkmtCTWDL9k3waadPcbO4+sy1W13CFn6SmLjtsVL8I0mcwN9g1ISnD3V/rkn17roAFbfgsEYKTQexcr7yaGIbd17G/5n3J1G6+YYNMPhIs+32GytCDSDkhXpqXOtsu6HBUClIA3OGb+mx3ttJNvU4hBwtWU9BFV6EVOMf4okyhm7GMTezMBesX/Ik2rGENEi6MNrjyvIGaHsUhMBuTPLOEP0HS2MmtbY60ouZOGq4M6xZPjXep8kC/5XktQG7qgBHER/FpR+LaVkrY2RiWxw4C9g08mIBsOFrGlaITYWSiK+uEQXtbUC85bS9WTNfIKL3p2eHqxDIZ0geK0abBwVy8jJcLhn53zbWEIz5/C703QG/BS+HxNWfXR04yNF2vcQbglKjrCxIEb7B1Rr9IHWrx5s1tEOdpnljt6+Hq0w6CySRzjUSM4Iho6tujd1nmj3ussa/J+iTCit5Hq9+mu8FAhAB0lHuXMEWjAg0aCN5+QIrv+F6CKqj3Bm8Ep++/daXpRg19IfU4UJJOgHvlEoGE2mIs0axDmO0/UCRAMQW0nKKJ9RRgRG4nHYRnYDl8ZIW2YcHCr58IRvNNGMyiQprDWXAl1lkAV53EYvCMY967SoNDL/JJlySRnPoejONOSOVYZBlQwvApu0ZpDCjJ9dkiL1LVjjBbZCmlRJkZalIf2nfXdv0dKfG+d1a+fo2wybuwsmWIcv7iEQhuplVUILe3GW0ee8IRDWx6oCsfUbbO6pdfPm+Kef6G6VkOJTs1YVGAPkAqkXsssl65w8EIg97RiME/nRtuHLaRIGtTUv/fiwwN9BG1JMZN0FA1KimZ0oiBYNFSQqTSueFx/j3Vj+QFb11i9bvPDD0LyBMcnYVEU43gFHHr7+Qv25oMah12kikC/gpjJGn0j4WxtSko+fwSc18SghMlwbixATQr8IzclAbTkUJwDkyETgW4YzTmTwHGrNggzm5T+oGVFTfaOV2CdKFonxXDsu7wZP08bE1DUQY58SfqcXBmSyyyYkL0LjyFbVF6Ls+RuippZKcEsaJc8ycIr7enDgq++IXuR9fwRj3UdSSg1OrDU3fbR9vVYt0eiUj5LnGoqP6Z/5VzIQnK1EeNSTN908xuc1qHi4kLX0ZSEMLEBRhrMbxhUqt1o3cf546cCYkGkGjWsJdm35XHYfEomViBpZEZHGAlBfw75oRsxTuLrxGPakeWCAiElbdSI7kVYIn/cgAyZZtSWRHXb4Mea8zo3B3OsSdUf/WQP3DilV2ErLW3HkJAIqHJJACpy3glSjP8qDzW5ap7sg67sN6jNThpzj9my6w9Uuipxw58fJytpiEU/E/9gzFxk6xC2ZvBrdhhAvgMDIP6uhZohq9cA3hjZbtrWFkqY7AbLlAVwQlNhMfuNocAl6ToqfQYW/I0fLRSXtlDJiAkk0oDLyZSTVIkFYvu24riZMrsIYBHIdGaxIjhGAWWQJNlaIO12lVbzPxzoraLbu5F47VwDp5MmD3bzoyViq5z6INgmbaWBYK5fZm90vVNTROfxOs1QF3jg5pvOJNR8kP+y4q46/jvyaKWRfpgtbk5GbB2dbUPPACm0qe+CrCxOQUjlw6Xygdxflo/9tsnL1hvNDTv7EZc0ocdDQu1LG35IfYvNbzToMMVhM3LZIGT+vSvcmK2Un7rAO3rEAkzmsPC1uqymJelG6fMAbllpZJcTDkb2mmIQAZkZ0oBGWX/Br6v5khYDs6o0mszDrVzI4TGjgaq1Vfs/KaGp/1cF0I4494DrCbJ7E7PlFwCGT6Mjsj6yBHAT3tbr5wnV7/hwx/Cq+sTLSgvFnfwRKPNLpelm50Ma4WS+dIfT3BWaBUX48rPS4rfmmEYNqemnic6AfSOMwHGdq/EmmkEGal+b98mzvrDIE3SiQasOlGQWg/AarAtzjUl+KtUmX5fuMu0m4cL6kGiFOyH4xVpRZ3DhHxPiW7UaxOq0TCAFOdM/6eA8D/2kDra6+u4mSHh9lvbKGWXngUzm8ADArUQJEGNpRLx48op/xERJS0o8ZFHhobGAds2sC9cFf1ZPODEmeGMTJWGleJUWAIG4QcHeqaO7fjCFALaoIgyhk0PhlbuksJzlUD6fBfEfSOd5r8xo3HlmcSutw4w+rzo7NqDBUVCBBspVaptxLTA0eTfxLCukoKk486xxOai5+KBMDl12pXryO3aWDpOZyKcJfjGvpVoLaRlUAzIxAjD2uARkK1T8ahBCgJ5gEFhyeuk7rk4SWhlYML+CFjHx5eBg7+o5H4vPS5fad+IxubR2Uxr+do+R+Qq0v/oQhiouCDnF+a+/mpE8Iw53vfzH2jhn1PhUaYj22hb9TXO+TdrBM0F1MbgZDygPj2e85RHvH2jvOh4ujwyB58Fu4LtLaSNpPTmREh3CI9996ZzCGjYrpMq37kPZcnAEpLnxBLi1a5/IoR3r5w6+JxEnzteCzKSbAC2wdzmNXx78RDMP7OIz/LWiiWcDL/yq/jWhLd/AJN5UGqkWZbibppQaX5wCrub8FLdyy1oxXF/eVALzjjqqieo1hgiFTTKv8O6dNUkT/q30X5ggFVNEhbDmdL4FMiCONUGn/n5xl/ahJud6HQ6TPYt3fqFjDVWpc6rXxvE6Pygs1ZSBcZIg3FwBtFCV4EOKKJJuxi6kRyefcwy1TbvazDeYlEwl7d7xJwBFjf3foCRRnpctK0PDsVBBTSfVNSxA6Di+8LVPUW512k/kccFfVHCrEkN2JCLyfEuos4hp40CWnA9zAfeRx7La+6qPhwrHU41OlpaDybKJkQd8e7jLX7DLlLUORie5/Cg2vdcZJC2LtzFw+imYP1UdrQnVdJWJZFNDq5iWavwhffsISA7xBExo7C1m4dljPSN9jBwcluYJ/pNbmF+7+nJTx8s3DVebz2ZV8lDP+xV5+82A0R7lQTxQ7/YBhKlK10qwvPa/QOy8xP55spPXFmna+8KeXoRrDnv/NoEXXRTOcwm6hf06s6Yo3Vjv25gHqm28lxRhHaxlgWHV3f8abUISUuOGcRQZXUJAGwXKRTCk9gwU2RP6iWiscMEz72NDqSJUR0toNEV/F9xyeHP7uxtMGSOFKtREyylR8ED8RSYRO7atbD9IvLXJjT7nziB6OAv9U9iSxdKON/b2PzwVk6zM+tvRq3IqPdMIOovToNyfeVWyM3HayU7i0ucPStVT5f33r5HGEnHbTsRt5vWTJj/IwuQ+n6xj0js9Y/c6pnAA92uY9z5wgmQnezUUM9o7V1Rlm/aojrjlGg+jnr73YkCfMqPPBnDtwWgClKDvJJZRNAPHye4BlCDSasIIPDFIJ9VXmpNnMFHTt0xS9Lx5C9RATjmCCz/wkI+n3bHUBe0U8YfkoCKai3+XV6DXBKFVJD69PLI60BA1kEoTFYQS/9MyuXkG4epzUlalFV9zUxdrRqGIWMPBy7h47W6HLZtvdUT/Cl1eB8GqpHa4pmuYuuoyBb8fN7H/gHQIAXR2CyGgYVIrlwCs+QhMz+0BCRdnCRNKjUyW+fCL+5SG1OszYQ4m6GkWQRwjFxkxA6hjZ/Zy7NZ0h3SLzpJEAOs1oYBPQCT4eUEMPDSJksskMWf0Wt7WhCOiVmZcn52yvRzOAIPAKpchpEsPGMdcUv0m98nl2zrJYxN5Syj9U8EVBMqB4PzTXihd1hkfXxPn71WK1N4scQFpnr+DDUq6HpacEcSRHepOA69WMKt/r61dYlvhAZKhZICg6YIR5wEY7XmOBzuyL7BXaUPoffckRnP76XQHGXtRDuSg2umWRbJiYIw/m/UsZZLRqdB+VeTh9d4QMBACL+0N9x+kGoIAthdrV86eMDLzOO9/MQFiq5i8QXEOoKt2bRn4SRRzWzWO6NcVKZzg16NC4Nf5Q7jS0r+v9Y8acG/Y+grJdEvroMx8ahTQUsT9LODhcps/wUGF9Yn5WsLcIn8JVphOWlzcmgEOUMbAq6FMXPi4faRu5wZxUxdAuHJSII+E9xkpoaZXzPli1s+8+o69Dh/8Hnr1/KNy9tuREXC2jvDp2gu0pzAiKVbFx9HebyzFrQ4BrRQTAEm/aEJmkKS0hO8khH3jkl1+i6xkyFNiGzk78hy4Xiz8lTEvXyRE2LnCI75RWvZM0MwK18Fn+rhN3eBsJSeI/qNH+sry8+93LupaVcwMOFgF/lfCAUaXVphRf+GHmv7xVpxUvV8anTHP0ffzmV8fdtQJAYl5w191stX8sWpQEZI0GlwnYglBthAaoleVl2eRynf58UsdxWViZbEBQV6RNyvhTKARZ5shRlxRACs8eu1JWZOEQijFGTNz7DHt7bPMyTQ/bLCSWDm+VpDJnz6vfVDJKhftzXIY2laxl/zplT6qRi/2mhzSzW0lTeRvwaJ6gEny8j5LYEASIUUGmxr111qzGafDXWPGVKUuD8YnMUiB7Grw0d5IrjK7iE6CgjhXHX+OGevYBwTJ3Y2/38YKeUJJsgsRGTz2IG44o4agTHzjlNnkq6S6gqQLerpdOi5A4oZt+SJAJ2P0jgjkgZyzQFxCQdQDCgWiLX7s0fEGCssPRRIG+Q68nPMeAhZcEHSguT2Qd1y3aGEVFWPlb/QShWQRA9nIofE45cJr+xTilth/3WgjupIljKdkVdXeCjlUTkh8XAEMNw4sESTPAxrm6HfLhk/cRxky9YccCHSlkiEjHQU6SFJs1uxopsCv02mcSA01CoV533HR/DoDRPWB9nwJ+e5SKmkuDBPUWgM2TvQOlEg4+hjgCtKeWfn92zEPHarmpt2RqZTeow5gBe9ossF4fGCr7ld/ZIDWfZN02p39fdpwLaIBvCt54BD12sHItdUYIuRefvDI4MxoYtcEdGgPjVNF9qiIfi7vHgC+cwNi3yF8vSlw8ZnVlnFU1A41oNzT/b8FlF1p3AEHBGOt6A1EotCDbA4YKAvqcqnRYpbvq/lr/Egl+L32YAdnLcqAyNIPmeDqczOd9Vqx/spJraXHRGiJp9avyx6Oonm/r8uz/1yBsH/yCET1jMUEPWvMA+k0CooG3UJXu+2sHXIb8RI2zpVhx0Dr4SSUZiGy1jyCyLQZw5pLUMdU7Q1pC8aqJ3kFJ4D62BPVvrorl/QrtD/ojXeNwmQlOkds9tQb1trWnlK+qW7zoODy7n0M91jDtfH1te+fhujrH2IOSoE+M05kztcosom2wS9U5Ql5HXKTZSMuktfgYgOxwQJosq2OfjAIYFEUf7IP0qGA52bpCaFz7d2nDrs9/+FOzRu8lGxl2lBe7/xslwUXhU8g1B9UD7f0jj+g2ZZKnWU3IfmkAbQyfiBOr+QZB+hlx6DPDa8RW/Jb2/o+abQiEezCgXW0PyCuFcq2YaqYGb/YRP86f4Q86F4ykeh2QuXBxM/Tu00xeDLZqa/IRk3HujCe5LlRudq0mg6jVhNXtm9ZdyAim//6/9JFfx8Sz23VTUCHHDYql5l/OyPfuSg8IUmOyjK7kZiBGvOBMsVLNGLFysXXogWTis3QXPND2lKFBrBt92twQ2W8aadWchZrDfRr0PNgLFzOsA+LbD8cFBIfJxuS0zTj05Uq9qw+4fRCpagloy81NvSSB9lTp6LW3DWwACtE0/SYzj2Z+Lbp3coRzDMxpS2D08FJZjqCnbhaja69XmYnNcxtzHXh6zyka4Ib6+pLlBNa47kbIJXu82Vah1X7NIyZkVcYMdwgvwUxQf3cE1JAHa9cyRHE4yuunjc09vZnY+/8uN/6/AW+UubkK4jrdsXr+6YqSnHlH0zLyS6PdMNebzJenO8esj6TwlCPpaW4Jdr3aBPDkH3jmhgW+ybEn31WVOxosj2pdMWi8afa2G31rqGQYuiDNz81N2Jpy6VwOY9nx2zsUxDFlr/euRTCfIlbQXLGjFcXnE8J+mCcfMMaI1/QKbBFALL4HXxhoOqTacF8Hkl9u/Y4nbe7/N4kJf8ZeH5ywOZfXSQr2lRggwfRS5mIp/+1UGv+ldUzPLlM3r+k2FGJgRCRdh69lXKkC8NHXLDlLjR7MkCzEoAZ+SAF59fktdNkFAssbcjnj/otv1DfK8lW9ouy8dHoVKnz3xmE+oUlgYjVRmeMxHDUSSmElZh2NDMqN79s5vDOQmmkO4Zf7WGJlRUmKD5A/IrxW59FkuNIKDlonM24j8NHlC6ndq82FrgECVWpf8erV35tjGpF94LeRTrMigW/y1lltQJ2zHODEve0sev0use+iRU4kKgzqtMa9I0+UzFCgZ4eYLEQ13alcB4JacX+VPR/C9kftIGGVYPU7qpAN01UZQvwr4Biofwxh4e07e0wReG9C/eKg0Asqs+3kyJXrFiUnuVdOKDxDV6qiiHo9L1ZNqtmoDX0k77BgcYsmOWRGKlFMsHs/rBBlECeMQ09mTH9463xeu6oQwHRel6GAuEKz0xhBW/BG/tP+tw5wCsKA3Z60KeQhGqTQmm2uQ3DEM1+ASMSjAQVhbkAJyKJumWSSJ5unoPTWX+nz814A4mBOcje7464YpGPf5jvDVfO3k0deuCaH/VkZqGB7eZCKezfKQNaDWiNCpdcwtsQL51zIMw4a7RZ+X9XuSGZ4IxOU9heOGiM+psiLnfnx+vwWiQL0djNvrCVJCPgl5cW3CmtkPGL5z30YzmGRSLmeQttg9L4m3W6X7Na6FUJpDhNGmlB8BhgGIaa/VJ9uSGtQMG5grkHYefy5fSAbEnJ2GFOH2Ld4KGxgOv3/a2+IrM4Ojvd1cGLALSH5fqDTUFab6Hsf7r85oXG8QNrXVOmC4zKoiPBqmhrgU7BVP6W8gondnH7rxWRaDb+AUlkmJeq64AwOU+pBIbQsosdPW7OqpikdW7Ik3ss34mcGLA60NS5hbFvSs2QXJpsvMLloATjJsUaym61bR2T22CYEiMj3QHqlDjLtWSdAK8CZBfYSLoKn52QT8aJpBt741MjFyl0I8j7iFO4LPvy+507rW/hy1+SkVeSmBpZehBzDkTG1AZqayt8qZNNcG5UpKuZemEB0Ruxa7Ng0lq/5KMrHXwYNWs19D7MTU9iJIG7EcwaAcDZG/PcV56GM7u4lCRFuszKNSBYhB0Yd7FKj1tAemooYU92UbxZrrkOZe7dvxkPGk/D3WYiaUU4SjngfnwM9Drv5ONtx0sknpirAHPzW4y/yboj2mYc15e+SBR3up/Ul368Vyn8plG/DHu9aUCWlsD3d0gZHbdRR/bKmD83opw7B2d5OLk1lpiqUehOvi/enSnshYG+EX/4WOhAh7FJ+Yk8lAPObpbkpp1/36MnhBv0thdOXEE6Fu0Hq9u07mOqqKdF/e5NWlb7YAyYojYZZqUsQNys6rjS8EnnppwLkKwbOtu7hX7fn8Dtj6VPPqHswEh7A4enj2GyD/WWjnhVYpJMjomnBmjPmynzkG7zhk7MSpsWY5xkvEOmkSitytYnMCbqvczuvhNtUFL69/1FgyeSef4wdpDl37Ie16MRML5zNnAe5SASEcIycr/RL5hiqnQDBW51OA9aWNZz0UIDcXoklgPLltCpQeqTXY3dtcGuqqmGlfHHB6WNIA2oWVzqyKNfsVrwNTnfBg7MPYdMI8LsBH6DCdIIuKwTwJf0dDF4jQ+ETSeB1TNQtEOwBp1kH7Rqad0DeOO1KiCsJAwdKx6t2DboO+2CdiT06hLMWRcRBOWAYt0kV+LcY85+ctbayoTN86tMvcKt9+Yu59DW71oPdWTNSs/k7FVIZUplbTBPL1wXic43RBsPr8Bx1WlKK+mwl2ubMd1lrlosGflCFDCQWIwVQh5rk6lN3/7HdxeZzAVVCTbBHyhUCTAui4OQl07xM/NTJW45zNOkH+5QSeW4SWxXyw9qIuIdp3Wg655R44VN0o0o5Bz7TOX0JeSGCmdTqrj83R+ZbPSFqpQywUI3V0Gm3713HpGOSTIigIE+WnP+SZiXhwcodh7tLyULUgXTfYsI+XHRWQftGQMYMnPErkKHIkJcH42jPUT5M3Op+aUnI5hhhd2cmGx98RWCmeeuZhpKdTl1tB02PwUJYnygd5e2wwL7HNsAdNBWkZm9BBps3E+lQ7iutiTkXpe+xVKG8zgyLF8OmS0YGA/HO5I+qL4suH5+Bv3lddQ/qCDlJPE5q4dND8G8iOHC6i0+msE8HX+fTe84LoONv5LxuLx+o06v+fUUULHZs6ZQlGaeQp3w2nd+dm99+03gtj+pmnah3wpVj1veuWNjKRbZyujeSm0eAmqAh0jM2Yw/AzWYpJuCBvKu6k8oMQnd8GdL6zV2jxGCuo9sn94irk0GS3UiyGNP52M5+P4EUGoD6dFpFRyT3FIpA6WJ6i+zyNCH2pJbM40QI9meGbGUoUJeXfAiSkMvtVXjq3pY4wlsEMS6gS5Hdl/WTP2doZ8SU+ESIK86IuwEXKXQ+PDZcCDGALgfP55eiUaWM5DM2QToRwpU1rDLXlG0Epg2+koyj1JqOCjW0bVZe6Fha563jGQ29dS/0mcDDl3tzfulx0baWQ7ObUlBs/KBvxsCv6M5qfPzlyx2VSMVzYNim6fteZkGoeI2JU4mGZ2bRmF2DDDLyyZGXQ19EAzVTpP6O/rO+cGYUThSjgZapCULN3K1SZlf3w99BNnbnUXo0UlKSx206E3fLKiRZBzalPdevsVrYJIpjDsMn9VYbnsWWj1iwIAuZyl0yBLMxZC4ZgtiNRrItx/MyAHRClkaKLbi6liglSXG6ILknkmyndQ+3XV0U0q6c2rrNbl4biDDHCcp5651zVNj9eDemIlkMH114sRgkjVlAKi1OXDpZiO2RViQFbtQWcFGO6DoA98fOTa9jci94mILEPwIqZUX9Pl+w7tr75UNxGla85ZZafvEwpOUfxaS0BVUeZIR1k+NTBAM2VDImzGktz+ood9HJ8eyCR57lXLhTM9p/WPE7mS0akm4fT5DDCkYKn2Jf+MW8PHdGEVOX+eZb9M9e6vFVLGIvCoX2NyNtHwtDfVWGuVZjvtODYjc4yvf2CcpdoheoolFHBWUOOemB6wFrstaiyO5OaaV8PrgfSw+xnCDiATNzS85bMYNowdYqk2Cd24uGlbcrlJRl7jeLtwOSkE83bPhwBUKil/fmt6L3OP/PTTdwfZCNppLcHFBNhWiN7nbmeNr+HUoVoyjMmMP4g0apNGWQ15uMs9so5p1u5zleYuDGVUiIEbiMtlL+Tb06atPCnk1944cx+ar4W9uagLvu8Vl8dfaufaGWewO+RupfgOu5oIaPOr4KKXrwpxmfY1lQu93In8dSJWkLX3ARd8FRDxs1Rjx9dq3vvDQmsKZNU8ahKU7UNRy8SlPdMPejd+e6NGSCcSRPMYU+SoE75O5kzRo7jsjthUPvS9oZ2Hn3geVvH6wtd+eEbalFTG3//mgxV5U8AcBCUbjLfmeWgaLwfen9yTXC7OaxDKmAO1QYVsSxJLVrkfx2ySX3Jb4U2uATLG1LX329sw48Ehz6DQwfaSLDBujaWwtA5+yGFYez4Iq/8DwfIJa2RFiceqI+XAvrKjYWifT4ZKU2Hj6Vwhb4OkfB+dfe9bvw3olOsb/0diJIvcZO06kV22Abs260KqVg1tcjQzmiuuGAgcPRnXr28DKmXh9EhAptA/+8U9R/4FhekkRG9bd4c5g+IKP0eXWb8Cp7varePjL9g6ZpqtY51IkDUb4kBblhs869QSThXsC+GPNnTb0zyT2KZxv/oI1dtOEIaq8/li8xPpGdiiPvLQJihbBoXluKFu3L/RGrT3a6isZaVFdi8mUeYyKvP5/WrIVjL6jOliVB3UCGUJtQiTt14sJoIDyLtHeJ2g0xlHeaHztX4m5zthHpRxWan0tyy9ZLqOTZmH/WSmi/CG+b0giZ+psX7SAmWjpcyC9+LQOQFSj16lQUOYrsJRnG/yCFiJVgH2QJQKUSPJoxAfgZOPi95i3CL8qyW+phsQklB4H6Dz1QigJtzZdwWBgfP7LilfbFg7fGIK/kKU8vqg+9K8PKKqudrCh1UHVSgGOgjR0f7Qj55UvzNPCtKI+4iJVexpvhzFIM7S+hAilTcJd0SjIluoMBDRW60fphD5Fr+1RQulGQCP8aZUJuZaWMiJ6YOOhC47TY0tZic8Q9eOHqFqQ1FGz6bLf7xpLLQa9E0bTLhlPK1z8cZ5DyWC8L+XbF2T1p9aXr2Ht5gDlxKcShH7sqFq7vRgZ47dYZoNHZZZfoWotu30CzQ5LayjxzWkbWGFHj5ewLKe5OgPKafU6gVMIQ2Ia1rZiPMm2wAZCHFogW1SAUvDw7Bovmg2HqRWkmUIeeHHzdVV5wz9lkPtngtObChSN2cIEY/NCelPixEwbXw6/I7+c9SIvFZZBI17+jckufxBrrml/5yWs8tmyRf7BT7sAcCixS/+hXwDnBpjJ5VUwtlJMESOJnsd5pCk2/ebKNa/BGtlbzPffR4Oc6BMxMKZ8qpxC3pQN/mpgKEBhDuVtGzKR6SOo1hzUvp8D5QGwjz38+qtw3rW11Lxc7hBifZfINMdF4ClmIlpEkSjY6yFK11L9AYCHJ9Xrp5NYLIBLBRIFHxRV44HDE2NhXHGsSlglATx5q9WpEhhJVr2pqTGQKFfV7nts+Ze+2UfiahH+amcYu86SaaaL+w2noq6LpVl/885uM+ztt2cdYKCNUY2UNJpm8MbV6oGMYuu2cidAz0xMX5oOKiiAx4I4sDC45TobBGX/9fsbQUfjvoeUhOMy1JxRyAHZEZJJADaQjU7K/HtteosU7pTdoo9WlrEnAniebrgdQRShiwY+e3bwFeKxXI25tsdAJRDIckfzYF+iDwRNdP1eRTzCK2eRaAUbQetPSK4IUKI2UHH5GwvBj7F0X6MMq4i74iXuMRvHg0vzOUAn6i3XqVbD7E9QFf8/VIqipFaIlLm/ZMPkPXVd3h3KPoD5UhZPACR84IJuSefNLa8y0HcdYGM6Mwm/G+fpvYVmb0PFk0Vdwao1YMfqLJUJTGP0MPZ07+p/8z8ivxPN2fSYebat8MjQpbAzSXpcNe0pjRt7+Q1XL2W0pdv88lOaqOsiUYUnIaaBqaj3/CoMRMLrXMtbpThoYImvO9OG5dRzzcSN8rjmstuYaT62B0CMecsNcwm9SeSiA7t0ZLeFk7uoOPmqC4+z2F+0xA+cbHUrak/WuhcmZLzoHU0ADBpV79mlfNMwcEnmDpp7Vcojg3veMBm9Tb8NuRRcSGyZkK+VwlZ+DUzv3p3W9Y3Y5N6Kmehyw4BVjJDJvXh2ZxtQrnQWxeH5+dL8V/0defq3bZYz1lNIKTwNR/2M34m38mPy8LlzyyEHR2Ucfbf6c9FLdGoo0sdrAN27EOyWyVnN1wZOnBgKYGFwrvzbnUM4TNoopNbgw9nPlehdcwheOdBCp83ypTekINPTfuTjzi4BQS+ydTB8z0UVPRD6hpl7oYgF2byk8U+NyQTbU0s5IH7ITJ+89rAXmusgi9/i926S6+UfOb6Jo5RVzhN0/azOOUG0Dll7UyUQRYuKIiHbStbbqyZOaMsmNQeFg5hhY+ppsnmVVB8Tyi7OHjOEFC4ERBvA2DTKHwc037gjl1UdKm5FGdu48F8b/EtJ5vF5R2QGchNIL4+ujUNIjc1AKffVTcMf4m4W5JsTl/4zjfj1I2oqZu2NFnYQN9ZL8f2JlNuBEB5IzWiVO2spLmp5lAbi4rNkHl7fOKuZjoYehsvB3TNjEXEJdQ8gCNNuU51SI0fiSNBBRS7r0mLJ2K4chm2M2JMnPD8bbHvQ7+pYdZkQyR5S6//MFuM6uJEfBq3UIhrE4YW/09CoA+1n37pbZqsIplZmfmzIge2R4qnLo0bTqk/DZYjnDtJjbFuVPpnhUD7b0CpW9Wf3lRxku/bItNt6V/FSP0FgDp+m4n717pFSeiT9xbTTTLSzl3u1VSuj4cxo+yri/ozNLEeODOf/w/6ZDbs+4Q75lJJxNZGyTv9JvmCDBWKUHiNBjDqtQTTzYoRmrkW2lgxoKQNGenfxUGlePszCw1l7/MgFiI4dcVoBwt5bQXTTlkgmGIAx+uwNl4Pdv/b+k5VNvv1RR+2Vp+GdeWIxiYb386/X4JLzzGyj7Y3irHu0HgjJpBL004K0soESm466e6RMMswG1q1zB5NvPykmDs2wZV9YDMCwk2dyakOdm8/Arz+5CvwJ7/D6upQk8WBXrdegOxCkjdZILsZay1XRb0uSIU6EI2mPxaG/6sNMBMJSGlXVI1vQEdIzyf0nXMYD3oJ8OZyDMNM965gmGKKACr0IHEKOAlWcTMHciwWeCnLFLc7zHaho2/2LzkXk34HhZpdQdKL4IQQdE9mqSzBBTJA4FxaYD79+//tJ4t8ma78MVPDmqBQlSzFbWTwWejmJ4jMWNvtKALsyrVxL6feqvFOgQub9AZ4Hj1pIl10Jp51G8A4Uv1qYMmkIK1XbOFxjCZTwGW/2Rs7Z6ziu8omZJwXBW8tiD5SnMtNHAwDohK3u4x/1E4G37Cifw35qhvE/zXC1S+oZ4xnCgHTJG+jOKe9YnPgOiiJWOhPlmNp1iqpE8zEW8eGWZ5GSM3fjBfDL1JZYpVhPg9zqLroF8HIzDTQwOzclCIDaOTSH2ueOPsODjyd8LPgx7b5RklysnYNwJHaM7EcTaQ2D9+P+Kl1XP8iDZ+ia4tknJ2lF5W39ERuLCUusMc/EhDjnP7MKobH5++laRyM36TR6nj3VyOGbr1dfn2agdyFk0qPzRBmeERc565YFrSfUaVCt4lY27P3hs0mHHHjQwT5pS+Hl6OnR+Py+C2iEXCkU3i0sRGpBPlqJJWRI0UPggOXtyRD5pWVa2/JTuSUQmPVFjfhfUpZ/u9JzHM2aP92kDBU+GB/9FDhbOMKpReoP/ZuXnDij94S8GJ67i0R4Y3Lio+zjFjYG0paXoUz+R1npnGEgKKuWX/zH/uEkw/j+ShZX6BW+jSrS+/wpwDSl4SD8d4Y+G4+uCsiWat4D4m6e1OMbddLXRgP/hhgO5ehRC8yRuwGTL/VIHM5ebz29+lVqkVXePdI14Ymu40pSCuyYfx4Fg2ud8GLmXSHNoHWMKTmgTb+GpJKFsLFOaiMYBM+NlWTjFmjV/1J055Al2tjXM/A/sxUZyw47cwFwRrmwt6zIMKAtd/JGTh+ptTxRQ9DP0eexIuEZV2y0ihxP9eaD7CdlDr/3tPTiaw+Dc11OSxErebOUOd25CR1mQOJpITuaus8/BSaowlXdlH1pn2FtlGLuOI5d4894TtYi8vkL7DYhRd848AbBpVIQe8ZK/YbAXQYRTdC7TbjVNXur0JzmQ9V69Re6IhM1PgoCsRBABsouj3jC1yboWp4ImzB1T4wC9WI+N+k4WvZ2jL9564dNomzQUxWttP/g9VIVWNz4Fq+WfrMN8pkkgh2agn6HhbROBtORgW2j1nFSZbyD2oRR+rI6DLcfdmq2KNBkKG4eJpZCcbjQsFvdCkeYcz+gK/WPghH3T9wszUYoglDgDrFJ+gM1z3tdunfRBn19HhaOSrYOl3R1F8KgTJB1FpX9zEvI4nUtRgS3j2H1ukXyo1caoU7eTgwL1RcNPUi7HqrZCoZzSYm1IaT/fPwX2O9QoufbADbfjLYQaxSRH/CltUwUkuPrjS99+mrJ0uUR+Zt2rBdTG0PDdKxb2vWtq26l68BR5p+KkoXC4ykr10lwAh3FIMHsfL4j5FRKgFH3sfVoT0Z9wdcbzfMactlzC+dYjVnfmqpPQli6rWjV/yrmw+KgD0fhrWXn/A6piXSoOCqx7rACGUFJW30ai4Y0bnDv1WNaARQo+7NdwyefKxf2UDuB6aFP4bqQix2PEKX1Qv8Lyzh9NBDXfcIjJNSj74YLgzA5kxDMQukiQ5oaYboxfePVk7MUCz7KGKPlHlTIQQeU2S9el+bN1vaVc4hWYGtbnTLxEp5gTqL5I5eIXWbMIfAKXsQmZKLpln/x0ccCN+Ld2dlv/nurFaG/3nAGaWaGrVWP5OjeCnJFwwtU5aWcP85DPhPZVglH6/EPAulRH2RuyFoNnPsXrnhFgY46DtF4hyOmrKzu5CF0RhbAPLdjMJ/n48TiIctRN5WAeq9k292GhLLBf7lQ2GyKCvecEtpC8uyzB1Ivm4KCrB3s1fZuuIJWiEQC8AQPoGDT+AxBYLHLCiYdGbXvGg0h7T+3gDwPxYgX/gwN1QLL5BQ3z22nCqC5Xty8ezk84Cts0cvGgiXO6E2fRkyPEVyeUgIohQO7xB/+opitPr8lefrm6dxqAJ7cQC2+qXVNurc3hvwshEKJJZ9FAn0A2rVpXNSw170cMbFfkN8APz7bnAANTAwZWo/boPBdCoRi/GlmT89LBNcGuI13+Ma3NCL6zVn02y248Or1YOS9syhTFydM9ePuszluOvBL6YComIXzjyYnI0IjNxhkpM6M8+vxehE41v+8zXVR0JVKqzMYTfTO+PSP7JoFLCWZ9SdjTguVdI4PZySGIoWulC5yB6C7i5t6XcfM093hYvQT0SNFOAedU5lkWR0lUT26UsIOIKVsl2AADWdfpqOG5FawkwLKEARu11ytk1MmvGBEqbJ33cxX4gdaYv/mFCmlpDwFbdkN4cfF3E5w/sfcnFY/d3ElAjppIH6/njo45xReipCUZYzOYEKPuATO0YSXR5cFH3fAUbHBjbDTifBexWGquBHkRvITXwxO/qZGbwH+RdtqpYxFZcZLRtag16eAinSmkYtWiVeWjBnO3U9Bfjl8u0HWxmEOgGpuYw7AtTJGU6Nh1TEuiV660uG3U0RLxJA3QdedJWFzrHhgJmgsEQhdEolbdXNZbFenJRX8+hs5xeOzniVjE8U4odJDhP9XE1IzYT7d8/5CPWf1011Otv7xaIUThm3oSqMsc4ZVStEpRmrLJ5TbljGDkVw7zEAqTgFMvCog5uz4CMvei+cwBIbNrqc2INBAH8C5wmjkpYBe4cSoNY8egpiGtzJDuWrB2c3cGC6Tq0qAWaVlGtBsdl74PirzndXJPqVpR9rX8+EhzG7NJLcaGhcqGaSIHuUTkRhNKdCDufBWjjmI5GcQkiYnW9UCo7gREAitP5bU1w3foF8HsAbkgQb++r3utfLueWrNGTg71wuQLfFtA6tBwdIsGFYOTtZb2nrdpQqOrs7rlLNr35RvrXg9ToaaKVlBz4YgrbcAjKAhcbp1VSt4/fAz9ujZJI1jdrEbfKiBYAIp/eHlR59E31CyG8xHxHk3XKctfepEIEHA8eyUdFMRlZx7B9BK9fcFj1m92FgQoirsGk6+GPrHWi9BhDFoBu6YULcUxbcNgimfM4OtKedBk4uqzZXujIxDBXF0pb86CTMslefYdjW9RKPaRyNipTU1NfxaBy25oiJoDoKb1yWSprFREW2YutaGOgaigyqjhsArSwymcigXSshIpJy4zN1Stj6cRuU+Z21uEE4jL6qo76fmkm6KFKrqBMUVi4fOGgTHaF0AakvhZ+aDHGwYEVX3XibZp1gXeSPVfgqC27y/H3PHUjUhLx9VU6x2vZtMq5EnIWa1oZh7VPRbw2ihFMOveJaznsO0RtN24f6AFB6aIn3uTkullIVyCHLMc3Zfm6mPxgd6t9PTJgT1GPgEOXEO4XHqXFkMF6fKbbOA43lG5mJAgtwIVNLW6xLYb/m5conC97iV+dloY8gDnrQiR+keyl5o8wmSd4agDwmaWB62nILdu/trQg8NgGyua8JrJP4AmdF9jjbNhIB9J2m99B2sbU4MGksAWwBqCEXnKh9Zi5txZdWyZ4nnLvHdx9SZjTcPua+fzuwtjH4h7iFKF5uYIxKY3loNoiLzpSdRAQ/zFS2tYesYJZ90jeGUQ2UlxhoEsWunG6k6gqLOeSA0mEutdpgB8dSa5L5rP38GhnCZvanYioI9cDmUpR7AG5/gNgTzoSloLT28fInzaFG9IHoSYLJZmhqImZjSdQFxgEs0CggTj7DKO3o/bWKy4jPPEi9z+w52uOgO0m4Oj1mgF/IXG1YfG6MCBZTcH9e591rF5c7EXQMuIT6GtH31RwFW3LRpIcsJJpdLzk2/xPp2T8OvIpgBKJM/BW2yu0qXUzoXEYvzeHUo73qvt2BsICSdlhEDgVaBPYLpKTJybnykm8B6u+BOPcLazVM1QPS4a8P7uNJJwn+qfRJ3KDSg1nB9YxMBpUsoPof05/9h9p0NDUv2pm56woZxh6SjSPQ5Eoz3Ylp4IdDF90i/x/LJ6WbvkcQja5dMTY9eBs6dktJztsu5d5UeAIC0JUoODlsAbZ6+j9xKkubZXXiwDF95NXwE7uXalL52wzOdLsGMyPsHGUEvEXJ8TUryxJJQWTe3syMB5Bc/pZkwamRBjacFhrj+RPaiMY1BZOVgowEqgfu2WnT1to5Y2lBJyjeIUV8zbX0gG/c8ftgxIi9uwByBicyghoABt448zsnxGsZW3d4e74fWhQSpn5s+R3xCC/7e7arQLRJHXdm+Rg3H/3+yxbAKWLJyUlbcQAUJfmZ8YEfWkXmhHhWd0hhYNR0sCui6PqpedhT6Y0AcEO1DlCY6PlSBmyTgX8ut8tVqIlpnbqAAB1PCBq+AvcNVyNJoyE5jvwGz+5KfwIA/BLq7t0fJ41PBZZQMR/prxKOAU8HmpeHtS2fwmL7bD9f2skTAwFPlafNMYQ1KnRCq5O1fsiVnjxgMa8Kg3tPMGnKRzhQaHKm+yd3DYS6KnK9itDomJn0IEIkl43CYYFoLRm3TaG9VJmveZJgz+KMk3euP3MAnpkd74YNWXdV/9XUP0PJZrAu+idysraDInCAK5eDO4MyPnzPugS/9MGAOrApk8VuzhJPPWDrRe56AK9tIRPnOUkVtDZibAHnpMHY851WjI8C0iy8hiP7DhjUnbxxxfRwuyB4i53BC9RIM5/ErHijhTzA0Dsyw7FKCS5esXFyPSrHDtXGrDHCKrrpsKFd24pHDoVFAzk/nuuOA5D0E8wbjLjs4XxeA0TQTI9wFnG/JW5zN3tshpJWPrrSqgA32/wMEIXb4h29NR4/FUAOvIAI9duLGBVTd7u3v83wSfM0DpNqAr1WzkknX9Yu7xYzDjpAJ8JMML+TY2RZcQyqS9Tm3Y9KLDSjZ57lSM2/GPT/y6IGElEAtOOWe2ylzxx/n5kDwsnZ7+wkAEDvOEeTbWyfulRUOVPh9ksv7/aAm/v3wRyOHwKmq64+LvJelZATfcRLQhce66Vxh0yBJJpfVXElFmDgR0mshBuUJIO9YY8rguZ7nPyO8UQQFxF+T6GgUknGL8Kz3HyAJ/ozXeKNZ73//V4H+DEw9IsyYbuX2T44SLRf0borGC4osXmgnE6X3zUXghVpY+/UAk7ZcStc9UwFOpQ857qeJ8xL+VhGiu49fGn8SQTsrHT1DUeog55Kqg/Rw9you8nscAjdjqRidNpFs+Illyk5IwVVpnPQEDSmM6zM22ApGWPm0kfDY+Ib7DcdwEW1zNStuZ+sZLL68ekuXJReyAVyUNC6zhTOQ/BqylB8EQQmAOdDahhkdTaIcSUJSPNtUDILfg3B6Iu9WJmo1iudOY+h/hp78m6Z+/F03m/+vDHhB31A6UZa+wbPMUfcKdzgei/R8uaFPMHRdEwNWcNnEOuRH06r+QUjsPHJUsUQe1ImlAFLZm583MA7IAlhm1vGRQH03PFj/8wpUaYEZd0wdoGPmpG8MOcSG0gyGsoSakDlSJubt0k2YREoRUgumkAj7TdBwmUB9zu32Ysa6e/0EFmvYAMSEned/AxrWhMRFH3v9shSUFbAAup2c/Hmiat1qmYYg3MqDZQC2dQAkFlzVdmRzwAnQafhYyvV8pU872Ao0vgpVH7j6jRenO1ZBDGeI/ho2Ux3uoGo+CWoMr4MYEnbEVTCK5b5z2ughT+Ujua7MdANqTORaK+V4WY/vD3GccgcY5wweQJKACkQFCQIt34Up7uLAk91EjN8uAE0f7zRPWX1Mv2VE3Qy/80ABSoEbfUNVKwkTgjxW+dgKFai7iJpduaNPZvh3Vk7BQJsPed3hNjDQ2qYrN8eSyON+7ZVBK3mCk7yKZBeZG81zNXsg5Z0xJOIqjb+LhyxviAuJHQ+HgkkJE0wVrLwFHxIPzDWsUBoYabVhfWnuBq/ZjV7NCAn8BRRp0sEG5FNScuwcG5OaD1KC2GLWh01J4nAu2GELKJmBew9aX5H0qtDAxomAvOM9IrLwTDZVjdgHDGO1wPKQrQXnWvmmSCAEd4b+37UDyGOSzlarajtN45BZRxd/xW3umPsC8AstVXiOdDD1B+Jc8kq9NDBbJtaE3jgx8Y0iOgkqfpdrDndIn2aM7WbBrAnM8cgvqaT9omvL6+3YR7ifOTJyKW8rFpm8Bq36dt6DyjK0KWeEB25Q3tgwIHiCg5uYoNL8gXMCOQov/wp7HIbtgmq7ArNTmkW9Nbm6TmOMm8vs52/OF7IIJ3rAgm3GYJKyv51phGnFGlvJ/kDeuivISqi4T661J00938rdSEKiefEzTC0h/rijbtYxc5BnZJhfz+mLYZNyEvSm7Ydj9ErLq9PJj3MpsGaj1wVaMxPn3wBASo6OmiKQKds6OI76ZSKCVBR/333XNxV+1MsDPWkzZM0l0JRJCEOyiAcv85a1DSEDj0K0llGddlyU+LN+W6VZt5otHWOuW2F/OT3X43OkHkD8tiJc6DXot22VyThQqOvANhrHMKhxI3O5RCuE8FaDL9Va79jz02yTYu4y8SAxTfVUEtbUsCTrPnEKAntyeDzPjKsaxUQlIIwbgYfIY4zTGTin0btBp3LWq9osMnmXXDP4qjb+JHxPlJ8WN7ytv6lNn5AoOj6yYHVw9hpaVZywbfoh4F73HvF3HhwgJPqP7DwDt9nqcEZ+F1Mojacn8OeBR1SWjWZBwS5kqhS3UpTfOk5l0vvLxzQiOT/pZzRDklsMfjubYt1RiVdHNMje3es78coyPpF+h6ayiq5Otxg9zUmyADYTY/pPIwH84MERwxmZzbNCqO9+V/sa1d3fbzbup3NLjd/n3MrNObbsKCBSIZyga4FEG6eCTBPwB2xFX4OngvE7WmxCm1FGQhh1pKjUrfhYny7YlDraPe2FV5fnQXiWa5smr3wgJ/wVpGIFuo2w3Cu8mh+WJkfYiOnmtElOgOybta2lZAbHwDw2UnF5AA2mcb1ayLosaipLJOzbeMFYABvxNSOU4ef7i4LlQndR4op/QPCzghpM/IUSHGr3o2nQNFknAGm4k42+XR9EAZSDeYm6QdvMG9aIdApvq0wOsZToOwDYm5SDNyXog/Ap98wkAuY71YLACdFeunaJUClRXw1qnXBlwt7XRE3oaE/ce6CoFW74cr9v9iG2HmTj4n5nub5WfqpfOevWpIfd5gi9j2oWxM+aZjetPpRWiw8eHJPLVO80QBfIHofqrEfa7hOg6UHaL+WEzzQ5o+TDIkVXwrTnWc8wM74Xvd3+8FpGoSooADpx641tp24E1veZ6q0AcbLRAQGOtc3bLjLzkh2PBUlctt2k0GYfeIwYYOkwcInmq/uyCc7sXxbXcq/Qoacf1z42Nji/irqQiwB2o9oKiaqk0/u7tZPqhyTV9Pp91J8x0hrOXgoorTLkEBlRFJoGHVOm4KDc0RhxFGkV0yBrOzvTRFB51Da+pSf64QiPIE2d+kGoWFraCZDcZ1R2xSElDyMiq2zU+Qq4l8l94ip63272JNxsj1iN4+JD1XH1nKwXSnyO4+VnZMw0XJAvQ52TXMa7FkxjwI3i57blMEmkOsgeO1NJ2bdFjsnZmc50UJXM48ufJwHp1wu2hPch5g3TjwDB0AZn4eQ55ehX7oSCYGQPZH8W39RY1V2r0nriVcebYR+Sux037H7rwRBQ+UBgrwT8+n3Zp6eFXtLW0QR1WaxCnGeIVhttotGkX+YAjDn3aHEhlPIcJOD3BOGyYTekEcbUYYu85nEFIsOyQaaR4+kWj2mgu0ExJi82qZfhBBgaJHi4gMJYcZ06WYgGRWFUmG3813hmqo6s8KHKJxeik7WjTlRPahCNIokmf3vOERLHDqupsBIpbknMIK/s1JmQZzFWM8201xX+OxDZNpG46jnhC+lxqcaUBXEePFKW/+Qoqk6wDNNeNDNnL26drHOm/PFb5zqY26d4a6YqJEjois9i+9kOJbiI7AevU0m2wuPhcMXyBpRqsGdCZyvWAyuv210PE6h6fnEfiBdVYelrH2a9fsAMLhmeOhawrZ7qJss1Muc81H6oN/Ol4Y34oWzaPqqH/ne7bCA79hboW8icP5VJeyHzc+FCD/WkjJR3uvNd3DiHf6xiQmI6Mk5gq6Uv/RqbSGe0GWONBY5KjEMFNqGYQ6lzlJivReQ9qe+WKATPLMq9qDmjmP+R6sc5ltiA8QFrZRNmOag8bRIFG2DpmJjuRV/G+RJy03+1ZFIWgMAqwr98IE/UDtAmGk6Rj2iUv3OwNUuFJiZlbFFosGDCIV+5sI5BPCAg4h+iUBeHrsPRBQdFYeTPvIqJ3vaHYw9w4t5l+waA3qWhZLJ8nZ9AimCjgXeuOQbuPL7ysY4b4co8en2eDZxFc8TXXW/MaIDqjTxR2v6uUcSg7tm0QFWeqhI9ijHsMgLfWdFFFhptljobd9RQOZRYHC7+5ksy3/3nWG+tqwGnkpH9l0GNxnmwPWSgMvaM1GCUzskO3TVOL4RIsCG6vK298wDxMy+cwPUIPO1C9xU25dtFMZ7vI81XZfiu9AKgQZx0vWZV++ZYc/i0bUGJEq9gCbp7sEMvGMeEVLqeN6Ydz1emscmgIqYBP65E4aZhR5b/j0lBu5+AaBvYGx/5r3CUyEoQKZ3J2PT10T24fRH/t+5CKJ0FYQASmv+pSy8n476Bx/nGIdWDloaNEpJOb52sFXF1q+2WtNMtkpkKgpF71+W2gPobZbIvFankZdTkaTm+Sxk0X/YJ/0R1ZHclTqHhwQvWGERF/cWEt71WNj1OFqkV4dp62/fHoUDWxp5W+7cjPq9ptxCuKZF0Szbv6mhDxeGcW00jmE5ojaydekPp9VIwD9P2k08iYp/aWF2gmiS/rs3hB8xUcHc/gmBNAEnN6BnjMG84ecL43nEeUDP0sSE3cKW5AiG69VHaVCK2HthIOkfGYbv/3Tz8nH7PiZaFcroaxG/81Mry08eeQ/5UjTLpARaIHcK4/Fdj8xWqUqOa4pHqhIWJngKv/wy0IR0vtR4MUq5BKhGNRzqnGw5NPr/WsDgoHn89bq7LEwOWbFmQwxhpWBPxF5+mYXz9lzmxDrBz8Yo5zkyovgFmRmr4OTV1Vy3kveObGn5nEDWbZq8Zg311x5AI+L6UF6A2YJI4aqZgy9qI0CtHWQqk+y56eT3A15hAATYNugVQCa6UhEiwsmm40yhwDFvPcUMqcGRNrIBrmDZxwLkTZaXlrhXEDvvGNsBWIL3BmPD/4vVrYn2sjEuMOo792pesdtjiddIN1WZUtlSDkroed2eVtSfOxUyYT3UKjfcfOuM1pEWRnlC803iyb03hHoZ2grK0n+8PpQ3N44Qt2/Z7GKsjwPQc/o3FoG41CZbMSkBPKmyCil6yDQ0dtY0+nDkYZrYaJqojpxX83cnXejWaxsN10fR56X/ZuzHJo6ddud/80wG0yrTY1c2RAJzTuzv0J6a5JJSVJ8FX3gAfltpKIIDYyfsK7lSBv87x0gmvGKGkckMxvcPiARlYpT5sHrHUkQFhyD6QB16RmZJq2mtYMxjtN/gHXqIfWMXhrvyQiU1sEKbrA/3Tt/YKFi9eO2TQG7V8qQyCFRbH+aT7Nq08Tcc4o9iY4wNlqGVcP9VI0Org995KuB+xkoPjrJRn+dzD4RxKK4VsXgMGYoQZJ52NZBO014K69MtzNRXXQ6dYpboBjW4E+a4opj3u85j85Q2KqVEbHxV7btXQY5Yyat54zKzfT0IMS8q1aKK/KiAOAVW283i3BbRoXEYQ4MwoiBgSmv9KCULrshjnEqfpfTWw24+C8CulTUI8GZxWIRx89AjbaSHkchqgVpCTGuKttEuDJ/5XpDZRWOfc/qjDCcdGNYsCKtdnaunEjyiIl8uzZaXSm+YcArMgXPN6bPAPAAl2ldU36wiU1DbsjsIij3idVSzsGpl12zICJQLcOhgKSwEy3De0afK3+kJL+mFm6IJNkFeCIjMqxskTU0a/jdV29bbu6rVpYmYkGiUPjIy53HE0DaFhRhzXnRLLz4ZrYobSyCw21oED8gADBQ+qugwimkeIdnSPiZdeCCmgk8+Bb51old8xexPk6UXWnf1MOJsocqIiEU3uiT6qBVuWhgdH6vWrlkqvgBRKBEbL6UnUzJNJhuYUM0NDvlWotL5wM7o054pqOJyb/wf0KKcDz6pSzZNMuuVOCSI/+OLKBYwKn0pCJ8MlH2wEbAHS9LNQp/5ihwBauq4unh+Hskvjpx1enujn8MlYZtRUD452lfLhWgicviucMwpb/yw7a5kU/ztixrMDqi1unH+0yKJCYjMsvW4lrClYGByY/lys8fJEpSAOZ7HsFtArRFuY1gtM/z0O2OYUTf9jFswOi3RfrHKjqOLlI5uK6xruR8qLPHNejFQ6FjDup5r4fBqQvikAqpV0huNr/cDs2mxFwROY+abG347t3545rLsCuR/6rkwHVvPPeAIc0mhl47jq+LAlXGVyoPqS90bCzrTu/DMbC0Yhvl1X/wpc7yj61jRvc5YAhSPoS0YDp5DqXspMd/db+WoNKIt4WGa+kUufxwLmYQgeieX1M/a/58kRXitTRPcU52RL9ZKO53xuTdTQx4SDnbgJwXyNvfiZlp2GwCynxfvqfbKAuOjwvDYP+BczmQoVw+3D6Z98WmSrV17hPNjkqG/2MDopmFd+Ti6CyEpvo17QhP8ZQy0cSxHI2A/ZMHp/CWBduozQj09mCTd3KSEdPxpVbWPkEqtEPL052FkDWVEHjgUrA/pWXz7fcLNQLgoqmOBRKt0w+CB8tEzimgD1E+hiVX4v9fZVRtw6dFHdGdJKPD6O8SUbPuwOZPKMg3SfCELurM3qYpKgddK/YKXC0zL1YHMJqvLhM5AluYPGpApyN1gWGRgkTq4mlMkoVkCTo4YFNtsRo1/CZrHOSOrCKcV3xzt3sbmuqRscbiZRX+SF+ryy6aDzgNv3WeukrDxmuAQCei+fhCYgR8etZstQ4HnzlXgKmDg5fvKZClit0CDRtj9LSQsDtHpa9Cu8MMaysRGgjndpgbPshKZgxtnf/GTbv8AjDly/gMxC66E4HQSfEk7ZU6Mhdt+1+XzzVrZdfs4Tdpz4ex6B0GaZOUjYZKb+c/42hWixuefNJ6nz01rQKHKaM7WN9QD5vutENw9oWN30+EA+Y0JHStfhsFWB7CDnooNrBdmMgeLKHYdR1iunj5URQQTRIBFLR66exO0ifq5crNR2mOUadgE0HzAhVIYoct9D9WTxi/iDrUMi9u6p2rT6KjEQTMyhQqggqEhZwbiMbncCSlDJxY2dF67yhRWNaqVRjxvbNcL6/zUxsPidamdhAqLIVzYWBzkPCQgq4We2y1G9OTlTL8FX3IHqmpPbEFsr6hGTDYdN6H+mVjkq0uNfnRYnFEAW5QyVCbgDLKCAEMLVLOT/U6/k/wAFDu5KEWNnpbvzBFb0mdkJXlPlR+06m102BhCXQCrEPyH9ar2+rNvcXuo/hKLoRu/VZ8CBWycczE97cTINg/B/JQYjx2X2xBlFa/HTbCkUxLmKNxJXkbItB7PGfdZA2yIlRVmZyQBNB0KSCnUTGz6OFX2wGfaY/HgAR26KIRjMMv47TCWnNndLpSmSG14JLy3tUdjpKQ4Jb8NBP5S6xhMBG0bpS5otRgr+9VPyDzdiM4e3WEdZewLSJUYU3ovG6l5ZDZ5I8ZobRXNroCtkc1liatcWLmPu1YOl6+PEc9sicnTvIhZFHmMSJX5WK5faLodHH/j13FvHuiH+vmILoO2lATT9AqsCRK1wS39GZEBZNTN/F0Aa7p4qR4zfamcKkisE9z9OtZA/RFu/f/mtPdQ3whAQrfu7753tGO9NLwJgp59yHNDpjLUtSJbvyFKH1DynIgs7yEXpCORvL/vmRnVlE6ppeMq0vZ5awEBbspaJFYnJMtKWYJi+Z/OFo+oLL3fGWpH7TH1qPXEh36xxAyUTrKt5KKJFAbsAwQpsevM4yhnUaPH9ODYERQ+8M50uRkfZHYbXhtRjESqLguztzplYDE/3qVuG8H9LGk3LH6aYEj1ykNzCwTmjk7Ev16OsM/OdR03rD4LZjb8wUwhfLnXDBUS34/J7sLw1wcl0b2jOlKnwiaiWl2/X3KPUwsf0pzf4QbzziGZ3kjfTZbWFh5OwAG92C8GXF37aG65XhM4o8lhgNU+JYnBmbV0kCn/GB5LfbmFfTgD6dpt8vNWFNYPrI3jrHrBBCWmGjaaM78KhZoMumrRW7v7nV0WIwIp2K76asCw5qKwf5KSzUvpcIDefiejS1Inz5YHWEzd5FXe4nMz82wvIWbSnEYuD9vQUIAEKiIPNQ2fWo/251Ryzxe2b41JiQPdYCCILb7SZZNx5blipZhOos7lkoXDLEKuC9aka95hAZxOGTqRDpj/CQxYW/JEc/vDz1V5RS6tRgJgvEOYV+SQZz0sqJ/PGaAE3t1WujDZT0DLlZ/1REQCpIANg3z2r8a9/QvJYRgGKQA/dlDhkdqCgKuiBUVC2wQrSStCBzOLhx1BUniUM3HFgdmNXNvPIGcAyMe80Ub1EVPn/jkpDbo8GbrkFbwV8KNrPJ07aWgt+kmMAcQnB0mDa+JX61EWsILM+xPF13t8ldG9p4OmzoK+uijz8xVDfbPMnZbYt6dDClBlOojQc0VJ29lFh33OYcpVDe/5V+Cv7w2m5ZY4qKJsbZRBB5NI/+tWdLOe8FeGyFXdVW+O6zS9kbVJEwrz7FYRGLITJAhESV+5Eqzak7CmfVpCH3Yr5lPnvGrjOtj62Bg8Gj7VLABXFHthmwQFszaQKRV749977QDvDQd9tG3ItzowbEgaGZJxGF4MxUFer/y8KWub9E1rR69jV8kWqRMaLLn5Wm1usvb2CmAqOemwt+u2AUD5uGyYvNPqUQR5h8i1i+PWX2Fw6BO9UsXi3QlueXSJBzG001dzN9XafrUlHSzHsjhW3oLaQg3+L6B2hqFExHskumWaTNVpWRILzJpO6iGgicWehloPBQgbbPIyWPsRRHMpap++x7kVQjpIHdKOHTNMGPG/1F++I2tPXOILxxxqSVVnfgP158Wl6lTYvku3GL+mbW3OTIj63OG/jsvTLuRn3+Rmv50pVeODx+Rq9WkArrNOHEDLhklehEUxzKdcfEjnUtBqsSe0GNss8/bZMFP0fLfUPqRFJ1GKKl7teyzjjGYaQ4howYFMIfGyksiDWBDZM0u9ztWZI8mpja7nbguZf5bw+TGOU2xdxAkcxQA8PzH2MoenTcegXEeeaR408lGzf3AvfVBNQWzA/AKvO+MXDkO8motXwKBsshqZiyhUydFt/zAYcaxRMH8fCYCmJHAbO1ikcKFkW0qMKd4ANHS9cZOtDfXKNvui5O9o59F/iFXmujkw2i651fFJRD23J1QEF/qLx1KEA5h/jBotQ5Yy2Cd42NlgfksIV7QSQa9tIX36fUr71g9zsbxC91oG4W2xDJo1j5IiseP06+aGPt8fh0JyyjPXNdy6KrK7V98IlfV6pgAVDKKVUBZxV8OJQl5EiYJREMg1ZvtCexk6Z2EEop2UWTePtJEm6YBgvcMz5eIirP/9RK7GTkzvUAIJf00+YURrzhEndpfAZJIvqqy/QOf2266RqBoGVrzZ/oZl3pNOfuf3JKiQj9AyRW0m9vGo/a8mbfTQ7eqf5YygSlvPr52p1sN4207aQPaTOEQ4bTV6ZX/SiplrOeiwnS4y+cKkxhrOJnP0uwXpXWqX61dGgQaz+QgoprbBUZ1v/ymHWS5/fSKwI0j2EXbZaLs86Lstp8N99D2N1+Vf7+6xd8r63wIINmLJ2pJWovhbv0EHydn0Nyi9B+3Y1gkToc1oC3XfApy7ToKZOGsLKSjSSs9bZDHzb2i69SOFnCAZxmQ06erdUCeLEZJ4e1ACOMK3FaVfVHKgmFeCsxiHm7sh1Ai6S2NfjiMINsgY3QTWyrLZoKyQR9KGbozHFwQ6hl0Y5IO6bHJZMtR7U8wpqN0fkdNWNakmjj6ofn3+706YOExAYRBmYu1Q30lqTvnsJ0kN33aw1vzBjPdM9LfICdCb7CnJzzurLXh2QGkNX5X3R/H6g8qByTPF4gPDKoDTL8O0d9ES/E9TFoMHoB6TRicUlA5OtDZ+u22bNK8uQOxZ8RH0W/ooyaEpGrftW7D6DpPcEeMSwBTA0/hwfuq4RbhOQ4hczkhGoW+GnSmjIVV25REBYot6SC8+n5cV62iKhZv0WBs2lXFpQ/ypSRydp0t/qHa0rWblPMNqkqjuLo1WtKjGTG0zemYChWsVfJHBcj6wEk8FLhO2RRQGPWLis/PzGS8DZP8QdQLBvmF3VSlJi3ehg5wiTaHubiIxl3PZcekABsE1SkHZquWkb6sMbVswsEO3PeentFiALvDOUZhcTcV36K9K4BaPE+JuDRnLMHrhpmkG3nG5OCcUQu2XJctOyxcT4ecJiAIicJ3UXRVjay+ZH3zRI8f/bNODdhd+Mj9zjJdJbc+IZrjclU3jUOlqBDF8u2n1FkUGLpODPMAlbV1k3LWIJk0Hp39nzdbu47sdJmrtMhpU8BuLJo8rakrwyDM2tG99tELEqZeo1z/CAE98LqbsYzUA682L5NdiyG1bNhT4p83VNxVxbwTSxyKZ+/A6Xj1XRUy18V0uxMG8i4ggoBZTnhn3KGDs6tRMOH8tdIEzRsB0QQU63mNTHdYbf3KMlRK1qb6cOW9rGWViCQ8PVw725xlDYrZhlU51CJyJD+2ItooUmF6fYTO4zxB0dRRxPKvWTCWgPm/R1ryS6SW73uyi2vcY2fa+HfApom0f77J8OLqt3R53J+xBlbZjpjkApXo0TSMeSHyUON4NiVu0clNGvLyyRfkFjptClsFm+6JyYCVtCc7BWx/KilQsg283grJo7tjOw8VTVcCmnysWc9oYRkMkyeRyeUw/w48UuTPyv/itZG1X3hWzZ2KlJH1xcAKW1BnwKw8+ZOD5IioTe89fCxzOl7w+wJrF0y4z3W91aD0VoNwZgmZ7FMBq5iPobHS9uuJzRtxSFOivAn1bB92gXcJqddYSG7HAmjqQ7qNbQ4ALE48VhivwFQUFayDvB2YR3qypC17Em2Ix/G2ggj+60StC3pZAg8AGTGZVN2m0hpBPH4N+sxl2WPPjdfhY1hn+P+97vvx++PE7gPiiIGaReoskBU6gIDEfKQ+A9P9U0/LhwFqUKotc3jp1c9fIJlcszvYj2hbeYllpOxEzky05EY7x88GrRrr9RMhe/bIhFmT9HdBagNaIsF71XAY1ccT1MeLk31H4ILqN7OUjQGWNAvjkpSjg3eqarwX7F8nyFvx723zxFilNhcYGY1hDdxxFkJ6apqJDAUTZHynG8NGP5UAqGZeN1a8JloE4h9lrDA4RDJH2SLLoLBAeUV4UNWB3kQIoBzvIUuSVsX48HhbGKXgTagh79Xt/Vz6FC6WmH4hSqOeF5EeFXun3f6/s+9WT7IKeiNbitbwYu5cteEc7AfnfdrQjjcphOk04npDm1wYmKXoSnFHVxTAWDtLhFLBScuQ86Il8vZM+EANZMC8VDUJRRMzKVlPIuVq/shbrj880dDFQVIUIqo8FbwE6C05kl81XIMcHvVLQRRrLhsSqPNI4AxdUsKAO5CEGnWII1RZNqHbsFD5aZ3YVIOyQSy+4iZVf61VLCeGJue6d08TtrjtKfdNQ9foJUmGgYWBDDYEekSsu6qqg8eH9RtO9it17mi04MPaik4EWank1Me2S3dK25Wc9q09nwsEf8ANOunDGw3OybC/NzVsXK2Q0NxP5QHkGgl3AWCayzcIimuKcug7lhgGdEg3zkLEdx340zxKtbuN3aUQKDMkYJyd5A4fI7W21HaU0IJeaneFLBfgpyTGh68I/KaUiKo+3wdU5HaYIsgfaOPphKpCB5uNjSsCWcvRt/P2/MR/t6n8gD/hoXF5buWCVMmvJ5C6DxgZWEKCh5PWyQg16CxQKsLy4eytCmVbgDMvVcbZtxnYwgsgMZPS3sdP2B+f4L9Ezj48NWW5Be0M+5AzVKKFl2MNoEcMlO6a/OlULTfCztc6oWVJQywZ2RGFJ3RwI5mF2vUY3WnIiQU6r+djUpbwOcQs6M3Ae99ojC3+dSO+Q8OOHTVbKYOHYro175YfmlcBJdMJCE3x7wzfetarxv2sZuoePdlZdhxSg0R+oIGFa8YQ6+Ud+xC7zR0WvjX4OBmXmqCwnyQ1Eu3WEduxLd/ssHlxgnuNJxLQJH6jkEiaPyrT+ySuu6I8w+h91R1vxfpjnsNgpOhRW2cI7sYhgOrqXBc6sD4dPVW7c+hJPxr//9+dFMg1YodnBfT+1TN2NQzPQw2H/sUoOdZfIwWjr+/a+rJ0wh7uPjSi5owerOIkleXIwAssd8Ab20NeIb4uw2v20C39KwzsQ+BRtKmhsmHJjrJErFhidROX3jk/0wyAk0AMdbwmcMvU5N3VeypcLwP/f206jjkAYMFjAMJhDPNay7UMb3cEYiNQGYPFldUcUScKRqQEArFDKRSZ6F5zNcBrxhSlIN19LgfPGno3TjFaEFsRZknUIrZBTzyfFegZ+2P9AXq2GqwJ+m3aGbcRkL/ca3mpOXNXIsuJExTxdQvZvQMOMSHx0IvYTj8XTC2T+c/nkScTeAS87hTL1aI5gAHeBRReqA1orwG3AAAVyed8JfPeBj9KMjDAzrJYU7HT9EgIn6rnq0qAj90XElEoqSUQiwAYluc++OcgtPtVk30ps1d6llc17bgFCMkcWuom/j9SeQ4f0R/9qHdnUQNRCXRMZRyeCZrbCaYbjo4sCrpGGDALgTZaAi5+q2yG4LmhPlaHATExBM1Xz13rwCbJJ8Ky8IKjMMUWCdSafjsSYDVjOELRKV9imOe4rkDjNBJuteExCo0ZUlJHdkx70xWVX5nOCBjbnvrniUGLx3R/7jXhXTOgl7By0HFSgEVa2mlBUUtQigRkraGr/trLl7PpXFy+ZuU3WVTscd8Zu8l7JflVwLSetejhklSh8q4iJaOc6rGVAmdfa3V9SmoTGuK3pAw4xY+Bv3OqNw/YcPGIvNekJZZFi88Vof3drLTZVCATFbQhhR7IGFhxgtUKtUBdXnYdbr/cfgzdpWdHRCD2cySEiHWR3q4eB7rLrajGKk5Ess9yRU2sDP0Gghxs9QfGO0o9MK3lx6PoVUdlhxpT+9W6uOVDVjNGaWL7sbn55Y3wowHI41CeAzKeKNoxeBqtOi3vWsRSUKuiLtXWHhDToCYbhBHUDd4GQCde+/sIrtUi8BK1RLUrrMVe9PemmMRUHEijwKQQvnDeEgRoPhPFVT5g3aDe2iQeFR9B99CP5kI9rsxXhYgWAym32WTAPsNtNKGjdUvaBdYiU5ir46SDjhwtFMdDurrkfU3hnebym93kFDZ0oR6iWw8mbQPDFJbnyuvAMC9BiDZNGuEQ9ReAXTsEJyXWjXKnUOy+glIKPf1VIOHX+WqVhB7HGh4IMI+plpJjhbkhg+yyThmfqnk7iSY6GBhnm3Vbi4Kn6c6DBdq1obV8BlejqffxvrxxXxFOqMiS/Xa24ll3dSYk1pgiQaGoUvLL79DYnTvGk1pK2Nvw989u0c/3rwffbWizN0FbEdVjAfzTNHS3ZBwgWTfswzQQo6wW+WwafAR+2LG6Na6bl6CNH5Z/Cn9KupxMufbm7XANpbCdNRdXVSocAB/pljC8C3b/cgs+V7Ug2VV7ZtzzDZ5QIRvVzxSr2ElaVMpTqO/xFS1tK5G+pkfIwLmlXp4A1wlNGttRpPVihSv7ypV2KkjAY+nWfy1Lsb2E7hp4dUzpHHy/GL8lZYqgnBdxKpz/CtKH9l6T+Fz57ec9j20MLGcO6SDgDTIhscLGCrWv0cwFfjkKKXi0sZiUcrux7LJhpdJHzdxxeR7YIZ9PP/HOktLPp9rasUz7NaP1rQMYU70/cxtEa6qbgqQ76pxXp0hfkmHEuUN3WP141i2p45V/MKjiwPhFPjubCW+Ivs062ZuT/EUMLpVKDhDhWP7huDEkz+BDuFspiWS2ZJDdRC2QIpY7NWBOfektBF2Rxb8Kr+HrJ4rmm7tcIkKSBUsbNQdmBn7WjdEDqXteuEyg6I3ngXeWlWrzYNbI4xs6mfQdYM9qGclep3wWQ3NvxGaA3wHEAhr7SVQ61d0/s3hG65RWZwtwbUnlQ/xgVIhDImZ+qOiHTEj8cA+SDznbd/f9g+l/ts3RaKAXPI/TPDmzE/hmjk0nQPIXezwvCbWwqQiqglWF0v/wRro8+20Obe4KezLE4y+mTBfazu2tujC2BY2wnsE9s/BdMk2ZjfVA53bbSUHRZop3lyWT01uQ5ifLH29JnyoZCec7MlErH5lYpy/LIYGudQ/oDAwM8Am/i9TIYEEdKIugKiP4EPiaQ/gci62Mo9mkm3xOhBBvq5JVgAsh3CZTPUAAxT/pkFbmNKm8TqB97olYsMYG0GL8C+/Cms96iUk+iqRA9091yFKTywhnX79VeJkO1MjlFdcxgBNHmx9b9bRZiJocJmrn9cp5maetQqCdiHBNplmF2NCjboCAVASFC4TrNqJHuhZIcz3sxNvXXK/H0MPtMqYjO3Hk6q+/1x1ldqUwwRcICX1dWd9QGUv7w5VLTuSjGhXOFE5qOyClAYK2rpfuDEX46Ws7cg+HWE4WGDSDVEkQEzAH67WMioFiqUGuxU2QODJ4Ue0kvdte0LGP0rDHI1zdTuwBZdjEH/IJwIpjefZYoeavO8+vfziypaWUIIc6z1Qrh9qZ8s6/Qe7OY+5tnGL2gq87k3pMmf+ksbjtYTyumOnDqhkiHT9wtaVnzAX1IgrTrLzrOfBLOwi0fb9gH2UuEjGb/pkM25pkR4AEPzS7/wVGCbbVhWZWWCTosxzRjhH9Sgw0MObUd8sOPJdymTebVmUfp+79pmTxJgYpwWHFceDWeF+FGP/l2CpK64XR/pci6rhQAPyossTPgxrIBqY9jmLtiecUO9JJAwWqIZQ0XjRf+rHgbID/pKQ2b0zzF9HHd9FGgFin9gxCem2qsx+CX01UeX7VMFhEqfXzCcyjEutBYP/eyEbQtbuTU/jrCJ9h0pPP0tQMGv5MwgxG69egDqXFUD9SIhNLvfxyZ/+s6sQw0T/cCcBt4NWybJxkQk5V03u/cDghjoIFgIRTYZ3AyYvniVGtgYaTSomQuPrC+vQQ9rD1UFeeLjGSm9DhbARwNnfzQ+J2KoT773iYsGNeSIzAwRa3oSfXaEREK7tIIuL+/GgHtswZy5VMZyz2fqP50N+0t1q5zzrzYWoDiErIJ4VVxPhWE7F/78CYlA4enUZLHhKglUUtCClsQuNHlxrwapKDKtDXx9qtxu5WaePB+36UEnvLl1MrKGScNbOPtPMyKJMm4vMMzTZ1iG+YaT0LbhahKoeMLjUjBMleXROGPyFWgZMCH8R0x5ZRqEMUHv0Uz/mz8aj30ZAMMuHZhvjEEtFMgsjsYNfDZCluo07EWVBGw/0QP6LUDm7QppoEf2kmRcg727HjxrCmqWOS5j3CIa9zxzuClSwnZdLiuyIDj1hiiXu9o0LSAlPne/jJa+rQPiA5r3ZP6eQmtWciioURa7KYhHi/rtpJPGQ5/mC1zPA2yezpEeHBZALfQKS+k6bvBK+8pKuLQdKhqCvlblqCQWcamkug0yERv/5IEUsgCOiIxhEvgPJd5m7l8kOj0PGfmJQhpZHSJiy+JpfnADvjIP5lvS4CYm191NgL0uFPZ06Dh02esQIGX+FksTRmMOFRxMKdZmEkq1WwZY8kkBMGTFRrsmTwYSFhLxwXK0m43pA6gUrEoWnouy/cTRquoJMWFNVQafrlBz8CuusTJXgFT00sz4wAZWKnT1Lbc2RScR60Dx2BO6ku1FMSKNyD/cnMk79GStSIX7/TNZGBD55hKHQaZHkwJ8OJ1ROPw5e0HthH01UKZpaRgDtuGw3Viky1kQltMrUd5vCPrgZpH3WIPOTlcbDxAWL5GtGPrC17QADI3KFROZ5EZtguKm4t6v5s0qEbH4BXkM3XOxR+pgCMwGKCBXYRA0cdAhZ9ZXgUqIhQhnHU7nRtGNhWferLdiOyZNtg0gBEbt6ASEl+AdvE/HAIHafELgcU+XojTbgr9DrrMBiWTrFJVxmye0BlV+k2o+svwyHnRBN89KmgkHkgMLkNCUFrdRNCMGAllp6D02og9CS5OMREqIKjiOlTY8GxPTvZ9u/CrbBkO/q5ZqlcQv7xCRfIaDAyKNxeieDS7XuvqFJMYEhSRwIc+AAg6gACB60OOMJ9MlOgXCYrbSmgOF2xqTqJrwEcr2GAdmPY4MAg4OCQID/1f1VkPe2iuqCxGIfme9yQa5LHhr4sJHWsRdgBhY7Hv7FVGoUHHW97fe0PRo5+8Kfb0EiNlfNC+mLL/oMdFP5bVlBrxSysZ7NhThRRs2XJODsocGUK0RTIaAND1JGxAoSgSQlesMn4HiRjLhuiykmQw31BK2kyTEcbAWJBdBmhO/sPNIKOYvaZtNfuQtVag8879Tqex5xS/EE5WOpilwoYngBH6vJLDMZzX14HInsCX+RrmibvJ2+CNlt4PO4yjmRALcvrCJHpV/cDxOrSerYx1R9nA/Q5+ngzsZMOra9ITB+Mb950793VziiyQYWUXwNTEXxpDnh5BRZ3DTPNwxaSeUNhkWpvlA2iJdNhAmFF49AA2CH6V323ERgKGjYxMdsFbaW+qeY1yugB1OLcAKU4BYighZ/VuUwDn0CusvCAp4dflVI19sFohvF7O/nTOWkj4L62+di1oEGH/qYemxiBQiUQf7EEtM6EsCOZ8tVtcCV91Q5zeZPSHB4ABP2AAAAA==';
  gl.activeTexture(gl.TEXTURE0);
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
  if(orbitActive){orbitSpeed+=(ORBIT_RADIANS_PER_SECOND-orbitSpeed)*(1-Math.exp(-P.GESTURE.settleSpeed*dt));orbitPhase=(orbitPhase+orbitSpeed*dt)%(Math.PI*200);}else orbitSpeed=0;
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
    // Gratitude's large approach mesh was growing faster than the original
    // smoothstep camera pan, clipping its limb before focus reached the world.
    // Move that existing camera target earlier; no change at orbit or arrival.
    const gratitudeFocusLead=selected===4?Math.min(1,flight/.32):0;
    const focusEase=selected===4?gratitudeFocusLead*gratitudeFocusLead*(3-2*gratitudeFocusLead):smooth;
    targetOffset=[focus[0]*focusEase-.18*smooth,focus[1]*focusEase,focus[2]*focusEase];
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
  if(false&&selected===0&&flight>.55){
    joyOverlay.classList.add('is-visible');joyOverlay.setAttribute('aria-hidden',flightStage==='encounter'?'false':'true');
    joyOverlay.style.opacity=String(Math.max(0,Math.min(1,(flight-.55)/.36)));
    joyOverlay.style.pointerEvents=flightStage==='encounter'?'auto':'none';
    drawJoyWorld(reduced?0:universeClock);
  }else if(selected===0&&flight<=.55){joyOverlay.style.opacity='0';joyOverlay.style.pointerEvents='none';}
  if(false&&selected===0&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';joyOverlay.classList.add('is-visible');joyOverlay.setAttribute('aria-hidden','false');joyOverlay.style.opacity='1';joyOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-joy');
    $('#scene-note').textContent='Gratitude → Joy · The Dawn Archipelago';status.textContent='Arrived at the world of Joy.';joyHud.focus({preventScroll:true});
  }
  if(selected===3&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';emberOverlay.classList.add('is-visible');emberOverlay.setAttribute('aria-hidden','false');emberOverlay.style.opacity='1';emberOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-ember');
    $('#scene-note').textContent='Accountability → Character · The Ember Canyons';status.textContent='Arrived at Summit IV, Accountability.';emberHud.focus({preventScroll:true});
  }
  if(selected===2&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';stabilityOverlay.classList.add('is-visible');stabilityOverlay.setAttribute('aria-hidden','false');stabilityOverlay.style.opacity='1';stabilityOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-stability');
    $('#scene-note').textContent='Dependability → Stability · The Great Basalt Terraces';status.textContent='Arrived at Summit III, Dependability.';stabilityHud.focus({preventScroll:true});
  }
  if(selected===1&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';loveOverlay.classList.add('is-visible');loveOverlay.setAttribute('aria-hidden','false');loveOverlay.style.opacity='1';loveOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-love');
    $('#scene-note').textContent='Generosity → Love · The Living Constellation';status.textContent='Arrived at Summit II, Generosity.';loveHud.focus({preventScroll:true});
  }
  if(selected===8&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';opalOverlay.classList.add('is-visible');opalOverlay.setAttribute('aria-hidden','false');opalOverlay.style.opacity='1';opalOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-opal');
    $('#scene-note').textContent='Purity → Free Will · The Opal Passage';status.textContent='Arrived at Summit IX, Purity.';opalHud.focus({preventScroll:true});
  }
  if(selected===7&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';highlandsOverlay.classList.add('is-visible');highlandsOverlay.setAttribute('aria-hidden','false');highlandsOverlay.style.opacity='1';highlandsOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-highlands');
    $('#scene-note').textContent='Humility → Dignity · The Quiet Highlands';status.textContent='Arrived at Summit V, Humility.';highlandsHud.focus({preventScroll:true});
  }
  if(selected===6&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';canopyOverlay.classList.add('is-visible');canopyOverlay.setAttribute('aria-hidden','false');canopyOverlay.style.opacity='1';canopyOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-canopy');
    $('#scene-note').textContent='Patience → Structure · The Ancient Canopy';status.textContent='Arrived at Summit VIII, Patience.';canopyHud.focus({preventScroll:true});
  }
  if(selected===5&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';balanceOverlay.classList.add('is-visible');balanceOverlay.setAttribute('aria-hidden','false');balanceOverlay.style.opacity='1';balanceOverlay.style.pointerEvents='auto';document.documentElement.classList.add('universe-balance');
    $('#scene-note').textContent='Self-Control → Balance · The Twin Equilibrium';status.textContent='Arrived at Summit VII, Self-Control.';balanceHud.focus({preventScroll:true});
  }
  if(selected===4&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';peaceOverlay.classList.add('is-visible');peaceOverlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('universe-encounter','universe-peace');peaceOverlay.style.opacity='1';peaceOverlay.style.pointerEvents='auto';
    $('#scene-note').textContent='Summit I — Gratitude · The Golden Lagoon';status.textContent='Arrived at Summit I, Gratitude.';
    // The new encounter precedes the path list in DOM order: move focus to its readable landmark.
    peaceHud.focus({preventScroll:true});
  }
  if((selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)&&flight===0&&flightStage==='return'){
    const wasOpal=selected===8,wasJoy=selected===0,wasLove=selected===1,wasStability=selected===2,wasEmber=selected===3,wasBalance=selected===5,wasCanopy=selected===6,wasHighlands=selected===7;
    selected=-1;close=false;flightStage='arrival';targetZoom=1;targetOffset=[0,0,0];
    scene.dataset.stage='arrival';panel.hidden=true;returnButton.hidden=true;document.documentElement.classList.remove('universe-approaching','universe-encounter','universe-peace','universe-balance','universe-canopy','universe-highlands','universe-opal');peaceOverlay.classList.remove('is-visible');peaceOverlay.style.opacity='0';peaceOverlay.style.pointerEvents='none';balanceOverlay.classList.remove('is-visible');balanceOverlay.style.opacity='0';balanceOverlay.style.pointerEvents='none';canopyOverlay.classList.remove('is-visible');canopyOverlay.style.opacity='0';canopyOverlay.style.pointerEvents='none';highlandsOverlay.classList.remove('is-visible');highlandsOverlay.style.opacity='0';highlandsOverlay.style.pointerEvents='none';opalOverlay.classList.remove('is-visible');opalOverlay.style.opacity='0';opalOverlay.style.pointerEvents='none';joyOverlay.classList.remove('is-visible');joyOverlay.style.opacity='0';loveOverlay.classList.remove('is-visible');loveOverlay.style.opacity='0';stabilityOverlay.classList.remove('is-visible');stabilityOverlay.style.opacity='0';emberOverlay.classList.remove('is-visible');emberOverlay.style.opacity='0';
    labels.forEach(el=>el.setAttribute('aria-pressed','false'));
    $('#scene-note').textContent='Begin with Gratitude · or turn the universe and explore all nine';
    status.textContent='Returned to the universe.';updateMotionControl();
    const saved=wasOpal?opalFocusReturn:wasJoy?joyFocusReturn:wasLove?loveFocusReturn:wasStability?stabilityFocusReturn:wasEmber?emberFocusReturn:wasBalance?balanceFocusReturn:wasCanopy?canopyFocusReturn:wasHighlands?highlandsFocusReturn:peaceFocusReturn;const restore=saved?.isConnected?saved:(labels[wasOpal?8:wasJoy?0:wasLove?1:wasStability?2:wasEmber?3:wasBalance?5:wasCanopy?6:wasHighlands?7:4]||document.querySelector(`[data-summit="${wasOpal?8:wasJoy?0:wasLove?1:wasStability?2:wasEmber?3:wasBalance?5:wasCanopy?6:wasHighlands?7:4}"]`));
    peaceFocusReturn=null;joyFocusReturn=null;loveFocusReturn=null;stabilityFocusReturn=null;emberFocusReturn=null;balanceFocusReturn=null;canopyFocusReturn=null;highlandsFocusReturn=null;opalFocusReturn=null;restore?.focus({preventScroll:true});
  }
  zoom+=(targetZoom-zoom)*settle;offset=offset.map((v,i)=>v+(targetOffset[i]-v)*settle);
  const moving=Math.abs(zoom-targetZoom)>.0001||offset.some((v,i)=>Math.abs(v-targetOffset[i])>.0001);
  if(!moving){zoom=targetZoom;offset=targetOffset.slice();}
  gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);drawStars();gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,gratitudeAtlasTexture);
  gl.uniform1i(loc.uGratitudeAtlas,1);gl.uniform1f(loc.uGratitudeAtlasReady,gratitudeAtlasLoaded?1:0);
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform2f(loc.uView,viewWidth,viewHeight);gl.uniform3fv(loc.uOffset,offset);gl.uniform1f(loc.uZoom,zoom);gl.uniform1f(loc.uCameraZ,cameraZ);gl.uniform1f(loc.uTime,reduced?0:universeClock);
  centers=summits.map((_,i)=>P.quaternionRotateVector(quaternion,basePosition(i)));
  // As Gratitude becomes the visual focus, the central heart retreats as one
  // object; keep its full original location/scale at orbit and for all other worlds.
  const heartDeparture=selected===4?Math.max(0,Math.min(1,(flight-.04)/.27)):0;
  const heartRetreat=heartDeparture*heartDeparture*(3-2*heartDeparture);
  const heartPosition=[(width<600?-.35:.38)-.95*heartRetreat,
                       (width<600?-.37:-.14)+.24*heartRetreat,.40];
  draw(meshes[0],heartPosition,(width<600?1.90:1.72)*(1-.38*smooth)*(1-.62*heartRetreat),[.76,.9,.96],true,false);
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
  // First-layer Gratitude planet: its own thin atmosphere, visible in orbit.
  // The existing selected-world atmosphere pass takes over during approach.
  if(!(selected===4&&flight>.08)){
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    const gratitudeAtmosphereScale=selected===4?1+3.1*smooth:1;
    draw(meshes[5],centers[4],radius(4)*gratitudeAtmosphereScale*1.018,
         color(summits[4][2]),false,selected===4,4,true);
    gl.depthMask(true);gl.disable(gl.BLEND);
  }
  if(flight>.08&&(selected===4||selected===0||selected===1||selected===2||selected===3||selected===5||selected===6||selected===7||selected===8)){
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    const k=selected;draw(meshes[k+1],centers[k],radius(k)*(1+3.1*smooth)*(k===4?1.018:1.095),color(summits[k][2]),false,true,k,true);
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
function fallback(error){cancelPointer();stopInertia();if(raf)cancelAnimationFrame(raf);raf=0;$('#planet-labels').hidden=true;canvas.hidden=true;$('.heart-glow').hidden=true;ready=false;updateMotionControl();receipt={...receipt,status:'fallback',error:String(error.message||error)};scene.classList.remove('ready');$('.loading').textContent='The nine summits are available below.';$('#path-list').open=true;status.textContent='Explore the summit teachings below, or continue to the book.';$('#reset-view').disabled=true;console.error('Universe startup failed: '+String(error?.stack||error?.message||error));}
async function init(){
  P=globalThis.DGB_COMPASS_ORBIT_PHYSICS;if(!P)throw Error('Shared Compass physics unavailable');
  const K=await import('../../showroom/globe/h-earth/render/geometry-kernel.js');
  peaceKernelFacade=K;
  setupGL();meshes=buildGeometry(K);
  summits.forEach(([summit,opposing],i)=>{const el=document.createElement('button');el.type='button';el.className='planet-label';el.dataset.planet=i;el.setAttribute('aria-label',`Summit ${BOOK_ORDINAL_BY_SLOT[i]} ${summit}; opposing pull ${opposing}`);el.setAttribute('aria-pressed','false');el.innerHTML=`<strong>${summit}</strong><span>${opposing}</span>`;el.addEventListener('click',event=>{if(event.detail===0)choose(i);});$('#planet-labels').append(el);labels.push(el);});
  // The prior procedural Joy renderer is unqualified and must not initialize for any public summit.
  ready=true;scene.dataset.stage='arrival';updateMotionControl();scene.classList.add('ready');resize();bindInput();new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;orbitSpeed=0;lastTime=0;if(!sceneVisible&&raf){cancelAnimationFrame(raf);raf=0;}if(sceneVisible)requestFrame();}).observe(scene);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;fallback(Error('Graphics context interrupted'));});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  globalThis.DGB_UNIVERSE=Object.freeze({readback:()=>({...receipt,bookSummitOrder:BOOK_ORDER_SLOTS.map(i=>summits[i][0]),bookPairOrder:BOOK_ORDER_SLOTS.map(i=>BOOK_PAIR_BY_SLOT[i]),selectedBookOrdinal:selected>=0?BOOK_ORDINAL_BY_SLOT[selected]:null,selectedSummit:selected>=0?summits[selected][0]:null,approvedTropicalSlot:4,planetIdentityLayer:{slot:4,summit:'Gratitude',planet:'GOLDEN_LAGOON_ARCHIPELAGO_PLANET_V1',environment:'GOLDEN_LAGOON_ENTERED_GEN3034_UNCHANGED',contrast:'ENTITLEMENT_FUTURE_ONLY'},gratitudeCameraContract:'FIXED_PANORAMA_1_08_ALL_FLIGHT',proceduralJoyAvailable:false,quaternion:quaternion.slice(),selected,close,flight,flightStage,cameraZ,orbitPhase,orbitSpeed,motionPaused,orbitActive:orbitCanMove(),sceneVisible,reducedMotion:reduced,inertiaActive:Boolean(inertia),pointerActive:Boolean(pointer),zoom,canvasSize:[canvas.width,canvas.height],glError:gl?.getError(),world02WebGL:Boolean(loveGL),world02GLError:loveGL?.getError()??null,world03WebGL:Boolean(stabilityGL),world03GLError:stabilityGL?.getError()??null,world04WebGL:Boolean(emberGL),world04GLError:emberGL?.getError()??null,world05WebGL:Boolean(peaceGL),world05GLError:peaceGL?.getError()??null,world06WebGL:Boolean(balanceGL),world06GLError:balanceGL?.getError()??null,world07WebGL:Boolean(canopyGL),world07GLError:canopyGL?.getError()??null,world08WebGL:Boolean(highlandsGL),world08GLError:highlandsGL?.getError()??null,world09WebGL:Boolean(opalGL),world09GLError:opalGL?.getError()??null})});
}
init().catch(fallback);
