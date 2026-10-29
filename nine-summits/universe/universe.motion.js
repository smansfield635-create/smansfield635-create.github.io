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
let flight=0,flightTarget=0,cameraZ=9,flightStage='arrival',universeClock=0,peaceFocusReturn=null,joyFocusReturn=null;
const $=s=>document.querySelector(s);
const peaceOverlay=$('#peace-encounter');
const joyOverlay=$('#joy-world'), joyHud=$('#joy-world-hud');
const color=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
function requestFrame(){if(!raf && ready && !disposed && !document.hidden && sceneVisible && pageActive)raf=requestAnimationFrame(render);}
function orbitCanMove(){return !reduced&&!motionPaused&&!pointer&&!inertia&&selected<0&&flight<.001&&sceneVisible&&windowFocused&&pageActive&&!document.hidden;}
function updateMotionControl(){const button=$('#toggle-motion');button.disabled=reduced||!ready;button.textContent=reduced?'Reduced motion':motionPaused?'Resume motion':(selected===4||selected===0)?'World in focus':'Pause motion';button.setAttribute('aria-pressed',String(motionPaused));}
$('#toggle-motion').addEventListener('click',()=>{motionPaused=!motionPaused;orbitSpeed=0;lastTime=0;updateMotionControl();requestFrame();});
function stopInertia(){if(inertia){quaternion=P.constellationReleaseQuaternionAt(inertia,Math.min(inertia.durationMs,performance.now()-inertia.startedAt));inertia=null;}}
function choose(index,scroll=true){
  if(pointer?.dragging || performance.now()<suppressUntil)return;
  stopInertia();
  // Switching from the exemplar must not leave its camera zoom, hidden labels or overlay behind.
  if(index!==selected&&(selected===4||selected===0)&&(flight>.002||flightTarget>0)){
    flight=0;flightTarget=0;cameraZ=9;flightStage='arrival';
    peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');
    joyOverlay.classList.remove('is-visible');joyOverlay.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('universe-joy');joyFocusReturn=null;
    scene.dataset.stage='arrival';document.documentElement.classList.remove('universe-encounter','universe-approaching');
    peaceFocusReturn=null;
  }
  if((index===4||index===0)&&ready){
    const active=document.activeElement;
    const stored=active&&active!==document.body&&typeof active.focus==='function'
      ?active:labels[index]||document.querySelector(`[data-summit="${index}"]`);
    if(index===4)peaceFocusReturn=stored;else joyFocusReturn=stored;
  }
  teachingRevealVersion++;$('#scene-note').textContent='Drag to turn the universe · Choose a planet to explore'; selected=index; close=false; targetZoom=1;targetOffset=[0,0,0];panel.style.setProperty('--world-accent',summits[index][2]);scene.style.setProperty('--world-accent',summits[index][2]);
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
  requestFrame();
  if(scroll){panel.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});panel.focus({preventScroll:true});}
}
function returnToAll(){
  if((selected===4||selected===0)&&(flight>.002||flightTarget>0)){flightTarget=0;flightStage='return';peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');joyOverlay.classList.remove('is-visible');joyOverlay.setAttribute('aria-hidden','true');scene.dataset.stage='return';document.documentElement.classList.remove('universe-encounter','universe-joy');updateMotionControl();requestFrame();return;}
  stopInertia();teachingRevealVersion++;$('#scene-note').textContent='Drag to turn the universe · Choose a planet to explore'; const prior=selected; selected=-1;close=false;targetZoom=1;targetOffset=[0,0,0];panel.style.removeProperty('--world-accent');scene.style.removeProperty('--world-accent');
  panel.hidden=true;returnButton.hidden=true;status.textContent='All nine summits. One path. Your orientation is preserved.';
  $('#summit-teaching').hidden=true;approach.setAttribute('aria-expanded','false');
  labels.forEach(el=>el.setAttribute('aria-pressed','false'));requestFrame();
  if(prior>=0){const target=ready?labels[prior]:$(`[data-summit="${prior}"]`);target?.focus({preventScroll:true});scene.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'});}
}

function startPeaceFlight(){
  // Initiating from an on-page list moves to the actual scene, not away from it.
  panel.hidden=true;close=true;flightTarget=1;flightStage='approach';
  scene.dataset.stage='approach';scene.scrollIntoView({behavior:'instant',block:'start'});
  peaceOverlay.classList.remove('is-visible');peaceOverlay.setAttribute('aria-hidden','true');
  $('#scene-note').textContent='Approaching Forgiveness — Peace';
  status.textContent='Traveling toward the world of Peace.';
  updateMotionControl();requestFrame();
}
$('#explore-worlds').addEventListener('click',()=>{
 const list=$('#path-list');list.open=true;
 list.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 list.querySelector('summary')?.focus({preventScroll:true});
});
$('#peace-return').addEventListener('click',returnToAll);
$('#joy-return').addEventListener('click',returnToAll);
function startJoyFlight(){panel.hidden=true;close=true;flight=0;flightTarget=1;flightStage='approach';scene.dataset.stage='approach';document.documentElement.classList.add('universe-approaching');scene.scrollIntoView({behavior:'instant',block:'start'});$('#scene-note').textContent='Approaching Gratitude — Joy';status.textContent='Traveling toward the Dawn Archipelago.';updateMotionControl();requestFrame();}

document.querySelectorAll('[data-summit]').forEach(el=>el.addEventListener('click',()=>choose(Number(el.dataset.summit))));
returnButton.addEventListener('click',returnToAll);
$('#return-from-teaching').addEventListener('click',returnToAll);
approach.addEventListener('click',()=>{
  if(selected<0)return;if(selected===4){startPeaceFlight();return;}if(selected===0){startJoyFlight();return;}stopInertia();close=true;
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
   } else if(uWorld<1.5) { // Generosity: broad rose-violet atmospheric volumes
     float cloud=fbm(p*3.1+vec3(a*.8,b*.6,0.));
     material=mix(uColor*.52,vec3(.83,.45,.70),smoothstep(.3,.8,cloud));
     material+=vec3(.13,.08,.20)*smoothstep(.63,.81,a);rough=.37;
   } else if(uWorld<2.5) { // Dependability: blue-slate tectonic landmasses
     float plate=smoothstep(.42,.57,a+b*.12);
     material=mix(vec3(.09,.18,.23),uColor*1.18,plate);
     material*=.84+.23*b;rough=.84;
   } else if(uWorld<3.5) { // Accountability: fractured copper basalt
     float fault=abs(a-.51)+abs(b-.5)*.24;
     material=mix(vec3(.16,.09,.075),vec3(.79,.40,.22),smoothstep(.10,.35,fault));
     material*=.76+.38*c;rough=.81;metal=.13;
   } else if(uWorld<4.5) { // Forgiveness: sea glass and soft tidal layers
     float coast=fbm(p*7.8+vec3(a*.35,0.,b*.38));
     float deep=smoothstep(.32,.67,coast*.75+a*.32);
     float cap=smoothstep(.58,.76,fbm(p*16.0+vec3(0.,uTime*.02,0.)));
     material=mix(vec3(.025,.13,.19),vec3(.12,.61,.62),deep);
     material=mix(material,vec3(.72,.92,.82),cap*.73);
     rough=.27;glow=.055;
   } else if(uWorld<5.5) { // Self-control: disciplined blue-violet polar facets
     vec3 tile=floor(p*8.5+vec3(a*.8));
     grain=hash3(tile);
     material=mix(vec3(.14,.14,.30),uColor*1.32,grain*.70+a*.22);
     metal=.24;rough=.32;
   } else if(uWorld<6.5) { // Patience: organic old-growth geography
     float growth=fbm(p*2.5+vec3(b*.38,a*.24,0.));
     material=mix(vec3(.14,.21,.10),vec3(.60,.69,.34),smoothstep(.29,.75,growth));
     material*=.85+.27*c;rough=.79;
   } else if(uWorld<7.5) { // Humility: quiet, eroded rose-stone
     float weather=smoothstep(.27,.75,a*.60+b*.36);
     material=mix(vec3(.23,.16,.23),vec3(.73,.56,.62),weather);
     rough=.9;
   } else { // Purity: luminous opaline ice/mineral mosaic
     vec3 crystal=floor(p*10.2+vec3(a*.35));
     float facets=hash3(crystal);
     material=mix(vec3(.44,.58,.66),vec3(.90,.97,1.),clamp(facets*.63+a*.46,0.,1.));
     metal=.24;rough=.24;glow=.075;
   }
 }
 float halfLambert=.22+.83*diffuse;
 float spec=pow(max(0.,dot(reflect(-light,n),vec3(0.,0.,1.))),mix(8.,44.,1.-rough));
 vec3 shaded=material*halfLambert;
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
 [2.05,-1.42,2.35],[-1.26,-1.19,-2.1],[-2.1,-.78,-3.3],[-2.20,.07,-3.9],[-.81,1.12,-3.7]
]);
function basePosition(i){
 const b=ARRIVAL_CONSTELLATION[i];
 // Perspective-correct signed depth: nearer bodies are monumental, not equal-size orbit markers.
 const a=orbitPhase*(.22 + .05*(i%4));
 return [b[0]*Math.cos(a)-b[2]*Math.sin(a)*.06,b[1]+Math.sin(orbitPhase*.6+i*.95)*.033,b[2]+Math.sin(a)*b[0]*.045];
}
function project(center){const s=cameraZ/Math.max(.48,cameraZ-center[2]+offset[2]);return {x:width/2+(center[0]-offset[0])/viewWidth*zoom*s*width/2,y:height/2-(center[1]-offset[1])/viewHeight*zoom*s*height/2,scale:s*zoom*width/(2*viewWidth)};}
function radius(i){return [.26,.44,.34,.28,1.30,.27,.31,.22,.23][i];}
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
  if(selected===0){if(reduced)flight=flightTarget;else{const delta=flightTarget-flight;flight=Math.abs(delta)<.00001?flightTarget:Math.max(0,Math.min(1,flight+Math.sign(delta)*Math.min(Math.abs(delta),dt/3.4)));}}
  else flight+=(flightTarget-flight)*flightStep;
  if(Math.abs(flight-flightTarget)<.0006)flight=flightTarget;
  const smooth=flight*flight*(3-2*flight);
  cameraZ=9-4.6*smooth;
  if(!reduced&&sceneVisible)universeClock+=dt;
  if((selected===4||selected===0)&&flight>.01){
    const focus=P.quaternionRotateVector(quaternion,basePosition(selected));
    targetOffset=[focus[0]*smooth-.18*smooth,focus[1]*smooth,focus[2]*smooth];
    targetZoom=1+2.6*smooth;
  }
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
  if(selected===4&&flight===1&&flightStage==='approach'){
    flightStage='encounter';scene.dataset.stage='encounter';peaceOverlay.classList.add('is-visible');peaceOverlay.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('universe-encounter');
    $('#scene-note').textContent='Forgiveness → Peace · A world to explore';status.textContent='Arrived at the world of Peace.';
    // The new encounter precedes the path list in DOM order: move focus to its readable landmark.
    peaceOverlay.focus({preventScroll:true});
  }
  if((selected===4||selected===0)&&flight===0&&flightStage==='return'){
    const wasJoy=selected===0;
    selected=-1;close=false;flightStage='arrival';targetZoom=1;targetOffset=[0,0,0];
    scene.dataset.stage='arrival';panel.hidden=true;returnButton.hidden=true;document.documentElement.classList.remove('universe-approaching');joyOverlay.classList.remove('is-visible');joyOverlay.style.opacity='0';
    labels.forEach(el=>el.setAttribute('aria-pressed','false'));
    $('#scene-note').textContent='Drag to turn the universe · Choose a planet to explore';
    status.textContent='Returned to the universe.';updateMotionControl();
    const saved=wasJoy?joyFocusReturn:peaceFocusReturn;const restore=saved?.isConnected?saved:(labels[wasJoy?0:4]||document.querySelector(`[data-summit="${wasJoy?0:4}"]`));
    peaceFocusReturn=null;joyFocusReturn=null;restore?.focus({preventScroll:true});
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
    draw(meshes[i+1],center,radius(i)*((i===4||i===0&&selected===0)?1+3.1*smooth:1),color(summits[i][2]),false,i===selected,i);
    const p=project(center),label=labels[i];
    const obscured=center[2]<-.1&&Math.hypot(center[0],center[1])<.75;
    const hidden=flight>.16||close&&i!==selected||obscured;
    label.style.visibility=hidden?'hidden':'visible';label.tabIndex=hidden?-1:0;
    label.style.opacity=String(Math.max(.68,Math.min(1,.86+center[2]*.1)));label.style.zIndex=String(Math.round(center[2]*10)+40);
    return {...p,radius:Math.max(22,radius(i)*p.scale),hidden};
  });
  placeLabels();
  if(flight>.08&&(selected===4||selected===0)){
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    const k=selected;draw(meshes[k+1],centers[k],radius(k)*(1+3.1*smooth)*1.095,color(summits[k][2]),false,true,k,true);
    gl.depthMask(true);gl.disable(gl.BLEND);
  }
  // The Joy landscape is drawn during its cross-atmosphere transition above.
  const heart=project(heartPosition), glow=$('.heart-glow');glow.style.left=heart.x+'px';glow.style.top=heart.y+'px';glow.style.transform=`translate(-50%,-50%) scale(${zoom})`;
  if(inertia||moving||orbitActive||flight!==flightTarget||((selected===4||selected===0)&&flight>.02&&!reduced&&windowFocused&&pageActive&&sceneVisible))requestFrame();else lastTime=0;
}
function resize(){if(!gl)return;const b=scene.getBoundingClientRect();width=b.width;height=b.height;labelSizes=labels.map(el=>({width:el.offsetWidth||96,height:el.offsetHeight||44}));const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);viewWidth=width<600?2.85:Math.max(3.9,width/height*2.5);viewHeight=viewWidth*height/width;if(close&&selected>=0&&selected!==4)targetOffset=P.quaternionRotateVector(quaternion,basePosition(selected));requestFrame();}
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
    if(event.target.closest('#peace-encounter,#joy-world'))return;
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
  setupGL();meshes=buildGeometry(K);
  summits.forEach(([begin,summit],i)=>{const el=document.createElement('button');el.type='button';el.className='planet-label';el.dataset.planet=i;el.setAttribute('aria-label',`${begin} leads to ${summit}`);el.setAttribute('aria-pressed','false');el.innerHTML=`<strong>${begin}</strong><span>${summit}</span>`;el.addEventListener('click',event=>{if(event.detail===0)choose(i);});$('#planet-labels').append(el);labels.push(el);});
  try{setupJoyWorld();}catch(error){console.error('Gratitude world:',error);}
  ready=true;scene.dataset.stage='arrival';updateMotionControl();scene.classList.add('ready');resize();bindInput();new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;orbitSpeed=0;lastTime=0;if(!sceneVisible&&raf){cancelAnimationFrame(raf);raf=0;}if(sceneVisible)requestFrame();}).observe(scene);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;fallback(Error('Graphics context interrupted'));});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  globalThis.DGB_UNIVERSE=Object.freeze({readback:()=>({...receipt,quaternion:quaternion.slice(),selected,close,flight,flightStage,cameraZ,orbitPhase,orbitSpeed,motionPaused,orbitActive:orbitCanMove(),sceneVisible,reducedMotion:reduced,inertiaActive:Boolean(inertia),pointerActive:Boolean(pointer),zoom,canvasSize:[canvas.width,canvas.height],glError:gl?.getError()})});
}
init().catch(fallback);
