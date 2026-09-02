import { buildMirrorlandCinematicOpening } from './cinematic-intro.mjs';

const opening = buildMirrorlandCinematicOpening();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const world = document.querySelector('.world');
const canvas = document.querySelector('#scene');
const mast = document.querySelector('.mast');
const hint = document.querySelector('.hint');
const status = document.querySelector('.status');
if (!world || !canvas || !status) throw new Error('STEP9_CINEMATIC_PRIMER_HOST_MISSING');

const style = document.createElement('style');
style.textContent = `
.step9-primer{position:absolute;inset:0;z-index:30;display:grid;place-items:end start;padding:clamp(18px,5vw,72px);background:linear-gradient(90deg,rgba(1,5,13,.91) 0%,rgba(1,5,13,.64) 39%,rgba(1,5,13,.08) 70%),linear-gradient(0deg,rgba(1,5,13,.66),transparent 46%);transition:opacity .65s ease;overflow:hidden}.step9-primer[hidden]{display:none}.step9-primer.resolving{opacity:0;pointer-events:none}.step9-primer-panel{position:relative;width:min(620px,92vw);padding:clamp(18px,3vw,30px);border:1px solid rgba(255,255,255,.17);border-radius:1.4rem;background:rgba(3,10,20,.58);backdrop-filter:blur(16px);box-shadow:0 24px 90px rgba(0,0,0,.34);text-shadow:0 2px 18px rgba(0,0,0,.55)}.step9-primer-kicker{margin:0 0 .55rem;font-size:.68rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#f3dfaa}.step9-primer-step{margin:0 0 .85rem;font-size:.72rem;opacity:.68}.step9-primer h2{margin:0 0 .7rem;font-size:clamp(2rem,5vw,4.6rem);line-height:.92;letter-spacing:-.055em}.step9-primer-copy{margin:0;max-width:42rem;font-size:clamp(.9rem,1.55vw,1.05rem);line-height:1.5;color:rgba(255,255,255,.82)}.step9-primer-actions{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:1.15rem}.step9-primer button,.step9-replay{border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:.68rem .92rem;font-weight:900;cursor:pointer;background:rgba(255,255,255,.10);color:#fff}.step9-primer .primary{background:#f3dfaa;color:#102027;border-color:#f3dfaa}.step9-primer-progress{height:2px;margin-top:1.1rem;background:rgba(255,255,255,.12);overflow:hidden}.step9-primer-progress span{display:block;width:0;height:100%;background:#f3dfaa;transition:width .18s linear}.step9-replay{margin-left:.15rem;background:rgba(255,255,255,.08);font-size:.76rem;padding:.55rem .8rem}.step9-primer-active .signal-layer,.step9-primer-active .constellation-layer,.step9-primer-active .proof-layer,.step9-primer-active .story,.step9-primer-active .coast-map,.step9-primer-active .status{pointer-events:none}.step9-primer-active .signal-layer,.step9-primer-active .constellation-layer,.step9-primer-active .proof-layer,.step9-primer-active .mast,.step9-primer-active .hint,.step9-primer-active .status{opacity:0!important}.step9-primer-active canvas{transform-origin:50% 55%;transition:transform 3.6s cubic-bezier(.2,.75,.2,1),filter 2.4s ease}.step9-primer-active[data-primer-beat="AUDRALIA_GLOBE"] canvas{transform:scale(.82);filter:saturate(.82) brightness(.8)}.step9-primer-active[data-primer-beat="DESCENT_TO_GRATITUDE_COAST"] canvas{transform:scale(1.10) translateY(-1.5%)}.step9-primer-active[data-primer-beat="MIRROR_MANOR_AND_CLOCK"] canvas{transform:scale(1.23) translate(-4%,3%)}.step9-primer-active[data-primer-beat="FOUR_CHARACTER_ENVIRONMENT_FLASHES"] canvas{transform:scale(1.13) translate(3%,-1%);filter:contrast(1.06)}.step9-primer-active[data-primer-beat="SETTLE_TO_SURVEY_HUB"] canvas{transform:none;filter:none}@media(max-width:720px){.step9-primer{padding:16px;place-items:end stretch}.step9-primer-panel{width:100%;padding:18px}.step9-primer h2{font-size:clamp(2rem,10vw,3.15rem)}.hint{display:none!important}.status{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.42rem!important;border-radius:1.15rem!important;padding:.55rem!important}.status span{grid-column:1/-1;text-align:center;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.25}.status button{width:100%;min-width:0;margin:0!important}.status .return.show{grid-column:1/-1}}@media(prefers-reduced-motion:reduce){.step9-primer,.step9-primer-active canvas,.step9-primer-progress span{transition:none!important}}
`;
document.head.appendChild(style);

const layer = document.createElement('section');
layer.className = 'step9-primer';
layer.id = 'step9-primer';
layer.setAttribute('role','dialog');
layer.setAttribute('aria-modal','true');
layer.setAttribute('aria-labelledby','step9-primer-heading');
layer.innerHTML = `<div class="step9-primer-panel"><p class="step9-primer-kicker" id="step9-primer-kicker">Mirrorland · cinematic primer</p><p class="step9-primer-step" id="step9-primer-step">28 seconds · silent</p><h2 id="step9-primer-heading">Cross into Audralia.</h2><p class="step9-primer-copy" id="step9-primer-copy">One autonomous film introduces Audralia, Gratitude Harbor, Mirror Manor, the Clock, and the four character localities before the regional survey begins.</p><div class="step9-primer-actions"><button class="primary" id="intro-continue" type="button">Play primer</button><button id="intro-skip" type="button">Skip to survey</button></div><div class="step9-primer-progress" aria-hidden="true"><span id="step9-primer-progress-bar"></span></div></div>`;
world.appendChild(layer);

const replay = document.createElement('button');
replay.type = 'button';
replay.className = 'step9-replay';
replay.id = 'replay-primer';
replay.textContent = 'Replay primer';
replay.hidden = true;
status.appendChild(replay);

const kicker = layer.querySelector('#step9-primer-kicker');
const step = layer.querySelector('#step9-primer-step');
const heading = layer.querySelector('#step9-primer-heading');
const copy = layer.querySelector('#step9-primer-copy');
const play = layer.querySelector('#intro-continue');
const skip = layer.querySelector('#intro-skip');
const progress = layer.querySelector('#step9-primer-progress-bar');
let running = false;
let raf = 0;
let started = 0;
let priorBeat = '';

function renderBeat(frame, elapsed){
  if (!frame) return;
  world.dataset.primerBeat = frame.beatId;
  kicker.textContent = frame.copy.eyebrow;
  heading.textContent = frame.copy.heading;
  copy.textContent = frame.copy.body;
  step.textContent = `${Math.min(28,Math.floor(elapsed/1000)+1)} of 28 seconds · silent`;
  progress.style.width = `${Math.min(100,(elapsed/opening.runtimeMs)*100)}%`;
  priorBeat = frame.beatId;
}
function finish(mode='COMPLETE'){
  running = false;
  cancelAnimationFrame(raf);
  world.classList.remove('step9-primer-active');
  delete world.dataset.primerBeat;
  canvas.style.transform=''; canvas.style.filter='';
  layer.classList.add('resolving');
  window.setTimeout(()=>{layer.hidden=true;layer.classList.remove('resolving');replay.hidden=false;mast?.removeAttribute('aria-hidden');hint?.removeAttribute('aria-hidden');}, reduced?0:620);
  document.querySelector('#status').textContent = mode==='SKIPPED' ? 'Orbit · survey the coast' : 'Orbit · primer complete · survey the coast';
}
function tick(now){
  if(!running)return;
  const elapsed=Math.min(opening.runtimeMs,now-started);
  const frame=opening.frames.find(f=>elapsed>=f.startMs&&elapsed<f.endMs) || opening.frames.at(-1);
  if(frame.beatId!==priorBeat) renderBeat(frame,elapsed); else progress.style.width=`${Math.min(100,(elapsed/opening.runtimeMs)*100)}%`;
  if(elapsed>=opening.runtimeMs){finish('COMPLETE');return;}
  raf=requestAnimationFrame(tick);
}
function playPrimer(){
  layer.hidden=false; layer.classList.remove('resolving'); replay.hidden=true;
  if(reduced){
    world.dataset.primerBeat='SETTLE_TO_SURVEY_HUB';
    kicker.textContent='Mirrorland · Audralia · Gratitude Harbor';
    heading.textContent='One world. One harbor. Four localities.';
    copy.textContent='The one-way crossing, Audralia, Gratitude Harbor, Mirror Manor, the Clock, and four character localities are preserved in the same semantic order. Motion is omitted by preference.';
    step.textContent='Reduced motion · complete semantic summary'; progress.style.width='100%';
    window.setTimeout(()=>finish('COMPLETE'),650); return;
  }
  running=true; priorBeat=''; started=performance.now(); world.classList.add('step9-primer-active'); renderBeat(opening.frames[0],0); raf=requestAnimationFrame(tick);
}
function ready(){
  running=false; cancelAnimationFrame(raf); priorBeat='';
  layer.hidden=false; layer.classList.remove('resolving'); replay.hidden=true;
  world.classList.add('step9-primer-active'); world.dataset.primerBeat='READY';
  kicker.textContent='Mirrorland · cinematic primer'; step.textContent='28 seconds · silent'; heading.textContent='Cross into Audralia.';
  copy.textContent='One autonomous film introduces Audralia, Gratitude Harbor, Mirror Manor, the Clock, and the four character localities before the regional survey begins.';
  progress.style.width='0%'; play.focus();
}
play.addEventListener('click',playPrimer);
skip.addEventListener('click',()=>finish('SKIPPED'));
replay.addEventListener('click',ready);
ready();
