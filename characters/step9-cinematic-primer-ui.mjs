import { buildMirrorlandCinematicOpening } from './cinematic-intro.mjs';

const opening = buildMirrorlandCinematicOpening();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const world = document.querySelector('.world');
const canvas = document.querySelector('#scene');
const mast = document.querySelector('.mast');
const hint = document.querySelector('.hint');
const status = document.querySelector('.status');
const statusText = document.querySelector('#status');
if (!world || !canvas || !status || !statusText) throw new Error('MIRRORLAND_CINEMATIC_INTRO_HOST_MISSING');

const SOUNDTRACK = 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg';
const style = document.createElement('style');
style.textContent = `
.mirrorland-intro{position:fixed;inset:0;z-index:30;display:grid;place-items:center;overflow:hidden;background:#020610;isolation:isolate}.mirrorland-intro.playing{background:transparent}.mirrorland-intro[hidden]{display:none}.mirrorland-intro.resolving{opacity:0;pointer-events:none;transition:opacity .8s ease}.mirrorland-intro::before{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.38),transparent 24%,transparent 68%,rgba(0,0,0,.62)),repeating-linear-gradient(180deg,rgba(255,255,255,.012) 0 1px,transparent 1px 5px)}
.mirrorland-film-gate{position:absolute;inset:0;z-index:8;display:grid;place-items:center;padding:1.25rem;background:radial-gradient(circle at 50% 34%,rgba(115,180,232,.16),transparent 35%),linear-gradient(180deg,rgba(2,6,16,.74),rgba(2,6,16,.94));backdrop-filter:blur(10px)}.mirrorland-film-gate[hidden]{display:none}.mirrorland-film-card{width:min(92vw,650px);display:grid;justify-items:center;gap:1rem;padding:clamp(1.5rem,4vw,2.7rem);border:1px solid rgba(184,210,255,.24);border-radius:1.45rem;background:linear-gradient(145deg,rgba(8,18,35,.93),rgba(3,9,19,.97));box-shadow:0 34px 110px rgba(0,0,0,.56);text-align:center}.mirrorland-film-card small{color:#f3dfaa;font:850 .62rem/1 ui-monospace,monospace;letter-spacing:.17em;text-transform:uppercase}.mirrorland-film-card h2{margin:0;font:700 clamp(2.7rem,7vw,5.7rem)/.9 Georgia,serif;letter-spacing:-.055em}.mirrorland-film-card p{margin:0;max-width:48ch;color:#c3cee2;line-height:1.55}.mirrorland-film-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:.65rem}.mirrorland-film-actions button,.mirrorland-film-skip,.mirrorland-replay{min-height:46px;padding:.7rem 1rem;border:1px solid rgba(180,207,255,.24);border-radius:999px;background:rgba(5,14,28,.78);color:#eef4ff;cursor:pointer;font-size:.7rem;font-weight:850;letter-spacing:.07em;text-transform:uppercase}.mirrorland-film-actions .primary{border-color:rgba(243,223,170,.64);color:#fff1c7;background:rgba(243,223,170,.10)}.mirrorland-film-actions button:hover,.mirrorland-film-actions button:focus-visible,.mirrorland-film-skip:hover,.mirrorland-film-skip:focus-visible,.mirrorland-replay:hover,.mirrorland-replay:focus-visible{outline:none;border-color:rgba(243,223,170,.78);background:rgba(243,223,170,.12)}
.mirrorland-film-skip{position:fixed;right:clamp(.75rem,2vw,1.4rem);top:clamp(.75rem,2vw,1.4rem);z-index:41;display:none;background:rgba(2,8,18,.68);backdrop-filter:blur(16px)}.mirrorland-intro.playing .mirrorland-film-skip{display:inline-flex;align-items:center}.mirrorland-shot{position:absolute;inset:0;z-index:5;display:grid;place-items:end start;padding:clamp(1.4rem,6vw,5.4rem);opacity:0;pointer-events:none;transition:opacity 1s ease}.mirrorland-intro.playing .mirrorland-shot{opacity:1}.mirrorland-shot-copy{position:relative;z-index:6;width:min(880px,88vw);display:grid;gap:.75rem;text-shadow:0 3px 28px rgba(0,0,0,.72)}.mirrorland-shot-kicker{color:#f3dfaa;font:850 .66rem/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase}.mirrorland-shot h2{margin:0;max-width:11ch;font:700 clamp(3rem,9vw,8rem)/.88 Georgia,"Times New Roman",serif;letter-spacing:-.06em}.mirrorland-shot p{margin:0;max-width:58ch;color:#d0d8e8;font-size:clamp(.95rem,1.65vw,1.18rem);line-height:1.5}.mirrorland-progress{position:fixed;left:0;right:0;bottom:0;z-index:42;height:2px;background:rgba(255,255,255,.08)}.mirrorland-progress span{display:block;width:0;height:100%;background:#f3dfaa;transition:width .12s linear}.mirrorland-intro:not(.playing) .mirrorland-progress{display:none}
.step9-replay{margin-left:.15rem;background:rgba(255,255,255,.08);font-size:.76rem;padding:.55rem .8rem}.mirrorland-route-dock{position:absolute;right:clamp(14px,3vw,42px);top:clamp(14px,3vw,34px);z-index:9;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.4rem;max-width:min(620px,72vw)}.mirrorland-route-dock[hidden]{display:none}.mirrorland-route-dock a{display:inline-flex;align-items:center;min-height:40px;padding:.52rem .7rem;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(3,10,19,.58);backdrop-filter:blur(12px);color:#eef4ff;text-decoration:none;font-size:.65rem;font-weight:850;letter-spacing:.055em;text-transform:uppercase}.mirrorland-route-dock a:hover,.mirrorland-route-dock a:focus-visible{outline:none;border-color:rgba(243,223,170,.64);color:#fff1c7;background:rgba(243,223,170,.08)}
.step9-primer-active .signal-layer,.step9-primer-active .constellation-layer,.step9-primer-active .proof-layer,.step9-primer-active .story,.step9-primer-active .coast-map,.step9-primer-active .status,.step9-primer-active .mirrorland-route-dock{pointer-events:none}.step9-primer-active .signal-layer,.step9-primer-active .constellation-layer,.step9-primer-active .proof-layer,.step9-primer-active .mast,.step9-primer-active .hint,.step9-primer-active .status,.step9-primer-active .mirrorland-route-dock{opacity:0!important}.step9-primer-active canvas{transform-origin:50% 55%;transition:transform 3.6s cubic-bezier(.2,.75,.2,1),filter 2.4s ease}.step9-primer-active[data-primer-beat="READY"] canvas{transform:scale(1.04);filter:brightness(.54) saturate(.78)}.step9-primer-active[data-primer-beat="ONE_WAY_CROSSING"] canvas{transform:scale(1.18) translate(-5%,3%);filter:brightness(.66) saturate(.88)}.step9-primer-active[data-primer-beat="AUDRALIA_GLOBE"] canvas{transform:scale(.82);filter:saturate(.82) brightness(.72)}.step9-primer-active[data-primer-beat="DESCENT_TO_GRATITUDE_COAST"] canvas{transform:scale(1.10) translateY(-1.5%);filter:brightness(.84)}.step9-primer-active[data-primer-beat="MIRROR_MANOR_AND_CLOCK"] canvas{transform:scale(1.23) translate(-4%,3%);filter:contrast(1.05)}.step9-primer-active[data-primer-beat="FOUR_CHARACTER_ENVIRONMENT_FLASHES"] canvas{transform:scale(1.13) translate(3%,-1%);filter:contrast(1.08) saturate(1.06)}.step9-primer-active[data-primer-beat="SETTLE_TO_SURVEY_HUB"] canvas{transform:none;filter:none}
@media(max-width:720px){.mirrorland-shot{padding:18px}.mirrorland-shot h2{font-size:clamp(2.7rem,14vw,4.8rem)}.mirrorland-film-card{padding:1.4rem}.mirrorland-route-dock{left:12px;right:12px;top:12px;max-width:none;justify-content:center}.mirrorland-route-dock a{font-size:.58rem;min-height:38px;padding:.48rem .58rem}.hint{display:none!important}.status{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.42rem!important;border-radius:1.15rem!important;padding:.55rem!important}.status span{grid-column:1/-1;text-align:center;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.25}.status button{width:100%;min-width:0;margin:0!important}.status .return.show{grid-column:1/-1}}@media(prefers-reduced-motion:reduce){.mirrorland-intro,.mirrorland-shot,.step9-primer-active canvas,.mirrorland-progress span{transition:none!important}}
`;
document.head.appendChild(style);

const layer = document.createElement('section');
layer.className = 'mirrorland-intro step9-primer';
layer.id = 'step9-primer';
layer.setAttribute('role','dialog');
layer.setAttribute('aria-modal','true');
layer.setAttribute('aria-labelledby','step9-primer-heading');
layer.innerHTML = `<div class="mirrorland-film-gate" data-film-gate><div class="mirrorland-film-card"><small>Mirrorland · cinematic introduction</small><h2 id="step9-primer-heading">Enter Mirrorland.</h2><p>The crossing has already happened. Begin with a 28-second introduction to Audralia, Gratitude Coast, Mirror Manor, the Clock, and the people waiting beyond the shoreline.</p><div class="mirrorland-film-actions"><button class="primary" id="intro-continue" type="button">Play introduction</button><button id="intro-skip" type="button">Skip to the coast</button></div></div></div><button class="mirrorland-film-skip" type="button" data-film-skip>Skip film</button><div class="mirrorland-shot" aria-live="polite"><div class="mirrorland-shot-copy"><span class="mirrorland-shot-kicker" id="step9-primer-kicker">Mirrorland</span><h2 id="mirrorland-shot-heading">The crossing already happened.</h2><p id="step9-primer-copy">They cannot go back. What happens here will eventually happen there.</p></div></div><p id="step9-primer-step" hidden>28 seconds · music</p><div class="mirrorland-progress" aria-hidden="true"><span id="step9-primer-progress-bar"></span></div>`;
world.appendChild(layer);

const soundtrack = document.createElement('audio');
soundtrack.preload = 'auto';
soundtrack.playsInline = true;
soundtrack.setAttribute('aria-hidden','true');
soundtrack.dataset.mirrorlandFilmAudio = 'true';
soundtrack.src = SOUNDTRACK;
soundtrack.style.display = 'none';
world.appendChild(soundtrack);

const routes = document.createElement('nav');
routes.className = 'mirrorland-route-dock';
routes.setAttribute('aria-label','Mirrorland connected experiences');
routes.innerHTML = `<a href="/showroom/" data-world-route="showroom">Showroom</a><a href="/showroom/globe/h-earth/" data-world-route="h-earth">Enter H-Earth</a><a href="/showroom/globe/audralia/" data-world-route="audralia">View Audralia</a><a href="/" data-world-route="compass">Compass</a>`;
routes.hidden = true;
world.appendChild(routes);

const replay = document.createElement('button');
replay.type = 'button';
replay.className = 'mirrorland-replay step9-replay';
replay.id = 'replay-primer';
replay.textContent = 'Replay introduction';
replay.hidden = true;
status.appendChild(replay);

const gate = layer.querySelector('[data-film-gate]');
const kicker = layer.querySelector('#step9-primer-kicker');
const heading = layer.querySelector('#mirrorland-shot-heading');
const copy = layer.querySelector('#step9-primer-copy');
const play = layer.querySelector('#intro-continue');
const skip = layer.querySelector('#intro-skip');
const filmSkip = layer.querySelector('[data-film-skip]');
const progress = layer.querySelector('#step9-primer-progress-bar');
let running = false;
let raf = 0;
let started = 0;
let priorBeat = '';

function stopSoundtrack(){
  soundtrack.pause();
  try{soundtrack.currentTime=0;}catch(_){ }
}
function renderBeat(frame, elapsed){
  if (!frame) return;
  world.dataset.primerBeat = frame.beatId;
  kicker.textContent = frame.copy.eyebrow;
  heading.textContent = frame.copy.heading;
  copy.textContent = frame.copy.body;
  progress.style.width = `${Math.min(100,(elapsed/opening.runtimeMs)*100)}%`;
  priorBeat = frame.beatId;
}
function finish(mode='COMPLETE'){
  running = false;
  cancelAnimationFrame(raf);
  stopSoundtrack();
  layer.classList.remove('playing');
  world.classList.remove('step9-primer-active');
  delete world.dataset.primerBeat;
  canvas.style.transform='';
  canvas.style.filter='';
  layer.classList.add('resolving');
  window.setTimeout(()=>{
    layer.hidden=true;
    layer.classList.remove('resolving');
    replay.hidden=false;
    routes.hidden=false;
    mast?.removeAttribute('aria-hidden');
    hint?.removeAttribute('aria-hidden');
  }, reduced?0:760);
  statusText.textContent = mode==='SKIPPED' ? 'Orbit · survey the coast' : 'Orbit · introduction complete · survey the coast';
}
function tick(now){
  if(!running)return;
  const elapsed=Math.min(opening.runtimeMs,now-started);
  const frame=opening.frames.find(f=>elapsed>=f.startMs&&elapsed<f.endMs) || opening.frames.at(-1);
  if(frame.beatId!==priorBeat) renderBeat(frame,elapsed); else progress.style.width=`${Math.min(100,(elapsed/opening.runtimeMs)*100)}%`;
  if(elapsed>=opening.runtimeMs){finish('COMPLETE');return;}
  raf=requestAnimationFrame(tick);
}
function playIntroduction(){
  layer.hidden=false;
  layer.classList.remove('resolving');
  replay.hidden=true;
  routes.hidden=true;
  if(reduced){
    world.dataset.primerBeat='SETTLE_TO_SURVEY_HUB';
    kicker.textContent='Mirrorland · Audralia · Gratitude Coast';
    heading.textContent='One world. One coast. Many lives.';
    copy.textContent='Audralia, Gratitude Coast, Mirror Manor, the Clock, and the people connected to this region remain available without animated travel.';
    progress.style.width='100%';
    window.setTimeout(()=>finish('COMPLETE'),450);
    return;
  }
  gate.hidden=true;
  layer.classList.add('playing');
  world.classList.add('step9-primer-active');
  running=true;
  priorBeat='';
  started=performance.now();
  try{soundtrack.currentTime=0;}catch(_){ }
  const attempt=soundtrack.play();
  if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{soundtrack.dataset.audioBlocked='true';});
  renderBeat(opening.frames[0],0);
  raf=requestAnimationFrame(tick);
}
function ready(){
  running=false;
  cancelAnimationFrame(raf);
  stopSoundtrack();
  priorBeat='';
  layer.hidden=false;
  layer.classList.remove('resolving','playing');
  replay.hidden=true;
  routes.hidden=true;
  gate.hidden=false;
  world.classList.add('step9-primer-active');
  world.dataset.primerBeat='READY';
  kicker.textContent='Mirrorland';
  heading.textContent='The crossing already happened.';
  copy.textContent='They cannot go back. What happens here will eventually happen there.';
  progress.style.width='0%';
  play.focus();
}
play.addEventListener('click',playIntroduction);
skip.addEventListener('click',()=>finish('SKIPPED'));
filmSkip.addEventListener('click',()=>finish('SKIPPED'));
replay.addEventListener('click',ready);
addEventListener('keydown',event=>{if(event.key==='Escape'&&running)finish('SKIPPED');});
ready();
