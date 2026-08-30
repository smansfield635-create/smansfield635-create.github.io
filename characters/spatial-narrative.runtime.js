(()=>{
'use strict';
const select=document.querySelector('#select');
const carousel=document.querySelector('[data-character-carousel]');
const cards=[...document.querySelectorAll('[data-character-card]')];
const stage=document.querySelector('#dossier-depth');
if(!select||!carousel||cards.length!==8||!stage)return;
const style=document.createElement('style');
style.textContent=`
#select.spatial-field{position:relative;isolation:isolate;overflow:hidden;min-height:680px;padding:clamp(1rem,4vw,2.4rem);background:linear-gradient(180deg,rgba(2,7,12,.18),rgba(2,7,12,.66) 68%,rgba(2,7,12,.94));perspective:1200px}
.spatial-environment{position:absolute;inset:0;z-index:-3;overflow:hidden;background:radial-gradient(circle at 50% 18%,rgba(90,175,255,.18),transparent 42%),linear-gradient(180deg,#06101b,#02050a)}
.spatial-environment iframe{position:absolute;inset:-9%;width:118%;height:118%;border:0;pointer-events:none;filter:saturate(.92) contrast(1.04) brightness(.72);transform:scale(1.02)}
.spatial-environment:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,5,10,.18),rgba(2,5,10,.34) 48%,rgba(2,5,10,.9)),radial-gradient(ellipse at 50% 72%,transparent 0 34%,rgba(2,5,10,.58) 78%)}
.spatial-field .carousel-head{position:relative;z-index:3;text-shadow:0 2px 18px rgba(0,0,0,.7)}
.spatial-context{position:relative;z-index:3;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(230px,.65fr);gap:1rem;align-items:end;margin:1rem 0 1.35rem;padding:1rem 1.1rem;border:1px solid rgba(255,255,255,.16);border-radius:1.35rem;background:linear-gradient(135deg,rgba(5,12,23,.74),rgba(8,18,31,.46));backdrop-filter:blur(10px)}
.spatial-context h3{margin:.18rem 0;font-size:clamp(1.8rem,4vw,3.4rem);line-height:.92;letter-spacing:-.055em}.spatial-context p{margin:.3rem 0;color:var(--muted)}.spatial-context .state{color:var(--gold);font-size:.72rem;font-weight:950;letter-spacing:.12em;text-transform:uppercase}
.spatial-field .character-carousel{position:relative;z-index:2;align-items:end;min-height:390px;padding:2.5rem max(.2rem,calc((100% - min(34rem,72vw))/2)) 2rem;scroll-padding-inline:calc((100% - min(34rem,72vw))/2);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
.spatial-field .character-card{grid-auto-columns:auto;min-height:23rem;transform:translateY(38px) scale(.88);opacity:.72;background:linear-gradient(180deg,rgba(12,21,34,.76),rgba(4,9,18,.9));backdrop-filter:blur(8px);box-shadow:0 28px 80px rgba(0,0,0,.34);transition:transform .32s ease,opacity .32s ease,border-color .32s ease,box-shadow .32s ease}
.spatial-field .character-card[aria-current="true"]{transform:translateY(0) scale(1);opacity:1;border-color:rgba(243,200,111,.7);box-shadow:0 38px 100px rgba(0,0,0,.55),0 0 0 1px rgba(243,200,111,.14)}
.spatial-field .character-card:hover,.spatial-field .character-card:focus-visible{transform:translateY(-4px) scale(.96);opacity:1}
.spatial-field .character-card[aria-current="true"]:hover,.spatial-field .character-card[aria-current="true"]:focus-visible{transform:translateY(-6px) scale(1.01)}
.stage.spatial-depth{border-color:rgba(243,200,111,.28);box-shadow:0 36px 110px rgba(0,0,0,.56)}.stage.spatial-depth .stage-head{background:linear-gradient(90deg,rgba(8,18,31,.96),rgba(18,27,42,.86))}.stage-head [data-active-dossier]{display:block;color:var(--gold);font-size:.78rem;font-weight:900;margin-top:.25rem}
@media(max-width:900px){.spatial-context{grid-template-columns:1fr}.spatial-field .character-carousel{scroll-padding-inline:15%;padding-inline:15%}.spatial-field .character-card{min-height:22rem}}
@media(max-width:560px){#select.spatial-field{min-height:620px}.spatial-field .character-carousel{scroll-padding-inline:6%;padding-inline:6%;mask-image:none}.spatial-context{padding:.85rem}.spatial-field .character-card{transform:translateY(20px) scale(.94)}.spatial-field .character-card[aria-current="true"]{transform:none}}
@media(prefers-reduced-motion:reduce){.spatial-field .character-card{transition:none!important;transform:none!important}.spatial-environment iframe{display:none}.spatial-environment{background:radial-gradient(circle at 50% 18%,rgba(90,175,255,.2),transparent 42%),linear-gradient(180deg,#06101b,#02050a)}}`;
document.head.append(style);
select.classList.add('spatial-field');stage.classList.add('spatial-depth');
const env=document.createElement('div');env.className='spatial-environment';env.setAttribute('aria-hidden','true');
const world=document.createElement('iframe');world.src='/showroom/globe/h-earth/';world.tabIndex=-1;world.loading='eager';world.title='';env.append(world);select.prepend(env);
const context=document.createElement('div');context.className='spatial-context';context.setAttribute('aria-live','polite');
context.innerHTML='<div><span class="state">Active perspective</span><h3 data-spatial-name>Auren Vale</h3><p data-spatial-pressure>He keeps the manor from becoming a beautiful cage. Every protected life makes the manor harder to hide.</p></div><div><span class="state">Field continuity</span><p data-spatial-role>Sanctuary Builder · dossier, relationships, chronology and P12 remain anchored to this perspective.</p></div>';
carousel.before(context);
const stageHead=stage.querySelector('.stage-head>div');const active=document.createElement('span');active.dataset.activeDossier='';active.textContent='Active dossier · Auren Vale';stageHead?.append(active);
const roleOf=card=>card.querySelector('b')?.textContent.trim()||'';const nameOf=card=>card.querySelector('strong')?.textContent.trim()||'';const pressureOf=card=>card.querySelector('p')?.textContent.trim()||'';
function activate(card,{scroll=false}={}){cards.forEach(c=>c.setAttribute('aria-current',c===card?'true':'false'));const name=nameOf(card);context.querySelector('[data-spatial-name]').textContent=name;context.querySelector('[data-spatial-pressure]').textContent=pressureOf(card);context.querySelector('[data-spatial-role]').textContent=`${roleOf(card)} · dossier, relationships, chronology and P12 remain anchored to this perspective.`;active.textContent=`Active dossier · ${name}`;select.dataset.activeCharacter=card.dataset.characterCard;if(scroll)card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'center'});}
cards.forEach(card=>{card.addEventListener('focus',()=>activate(card));card.addEventListener('pointerenter',()=>activate(card));card.addEventListener('click',()=>activate(card,{scroll:true}));});
carousel.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;const current=cards.findIndex(c=>c.getAttribute('aria-current')==='true');const next=e.key==='ArrowRight'?Math.min(cards.length-1,current+1):Math.max(0,current-1);if(next!==current){e.preventDefault();activate(cards[next],{scroll:true});cards[next].focus({preventScroll:true});}});
activate(cards[0]);
})();