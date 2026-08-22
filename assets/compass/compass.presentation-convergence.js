(()=>{
'use strict';
const GLOBAL='DGB_COMPASS_PRESENTATION_RETIREMENT_V2';
if(globalThis[GLOBAL]?.mounted)return;
const state={root:null,backdrop:null,lastRoom:'',panelTimer:0,observer:null,readiness:null};
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];
const escapeId=value=>globalThis.CSS?.escape?CSS.escape(String(value||'')):String(value||'').replace(/["\\]/g,'\\$&');

function retireLegacyPresentation(){
  const root=state.root||q('[data-compass-root]');
  if(!root)return;
  document.querySelectorAll('link[data-compass-identity-style]').forEach(node=>node.remove());
  root.querySelectorAll('[data-compass-identity-bounded],.compass-identity-3d').forEach(node=>node.remove());
  const title=q('#compass-title',root);
  if(title){title.hidden=false;title.removeAttribute('aria-hidden');}
  delete root.dataset.studioIdentity;
  root.dataset.compassIdentityPolicy='canonical-static-title';
}

function installStyle(){
  ['compass-presentation-convergence-style-v4','compass-presentation-convergence-style-v5','compass-presentation-convergence-style-v6'].forEach(id=>document.getElementById(id)?.remove());
  const style=document.createElement('style');
  style.id='compass-presentation-convergence-style-v6';
  style.textContent=`
html,body{max-width:100%;overflow-x:clip!important}
[data-compass-root],.compass-estate,.compass-estate main,.compass-built,.compass-monuments{max-width:100%!important;box-sizing:border-box!important}
.compass-estate__header{min-height:0!important;height:auto!important;padding-top:clamp(1rem,3vw,2rem)!important;padding-bottom:clamp(.65rem,1.6vw,1.1rem)!important}
.compass-statement-orbit{min-height:6.2rem!important;margin:clamp(.75rem,2vw,1.35rem) auto .35rem!important}
.compass-editorial-intro{margin-top:clamp(.45rem,1.2vw,.8rem)!important;margin-bottom:clamp(.75rem,1.8vw,1.15rem)!important}
.compass-instrument{width:min(100%,72rem)!important;margin-inline:auto!important;padding:clamp(.8rem,2.2vw,1.35rem)!important;border:1px solid rgba(124,220,255,.16)!important;border-radius:clamp(1.25rem,2.6vw,2rem)!important;background:linear-gradient(145deg,rgba(4,12,19,.64),rgba(5,11,18,.38))!important;box-shadow:0 22px 64px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.045)!important;overflow:hidden!important}
.compass-orbit-intro{width:min(100%,900px)!important;margin:0 auto clamp(.75rem,1.8vw,1.1rem)!important;padding:clamp(.95rem,2.3vw,1.35rem)!important;border:1px solid rgba(216,184,106,.15)!important;border-radius:1rem!important;background:linear-gradient(135deg,rgba(216,184,106,.045),rgba(102,205,224,.035))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04)!important;overflow:hidden!important}
[data-compass-scene],.compass-scene,.compass-stage,.compass-compass-stage,[data-compass-render-host],[data-compass-crystal-stage]{margin-left:auto!important;margin-right:auto!important;inset-inline:auto!important;transform-origin:50% 50%!important;max-width:100%!important}
.compass-object--wing,.compass-projected-room-label,[data-compass-room-proxy],[data-compass-panel]{transition:opacity .18s ease,visibility .18s ease,filter .2s ease,transform .24s cubic-bezier(.2,.78,.18,1)!important}
[data-compass-root][data-compass-mode="CLUSTER_OPEN"] .compass-object--wing>span,[data-compass-root][data-compass-mode="ROOM_SELECTED"] .compass-object--wing>span{opacity:0!important;visibility:hidden!important}
button[data-compass-room-proxy]::before,button[data-compass-room-proxy]::after{content:none!important;display:none!important}
[data-compass-root][data-compass-mode="CONSTELLATION"] .compass-projected-room-label{display:none!important}
.compass-projected-room-label:not([data-gen1587-current="true"]){display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}
.compass-projected-room-label[data-gen1587-current="true"]{display:grid!important;opacity:1!important;visibility:visible!important}
[data-compass-panel].is-gen1587-transitioning{opacity:0!important;transform:translateY(4px)!important}

/* Mirrorland: one readable inline/focused fork; no blurred competing copy layer. */
.compass-mirrorland-focus-backdrop{position:fixed;inset:0;z-index:2147482500;background:rgba(2,5,10,.78);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .22s ease,visibility .22s ease}
.compass-mirrorland-focus-backdrop.is-active{opacity:1;visibility:visible;pointer-events:auto}
.compass-mirrorland-routes.compass-mirrorland-threshold-routes{width:100%;margin:.85rem 0 0;padding:.85rem;border:1px solid rgba(244,214,128,.24);border-radius:1rem;background:linear-gradient(145deg,rgba(4,10,18,.96),rgba(5,17,25,.94));box-shadow:inset 0 1px 0 rgba(255,255,255,.055);text-align:left;pointer-events:auto}
.compass-mirrorland-routes.compass-mirrorland-threshold-routes[hidden]{display:none!important}
.compass-mirrorland-routes.is-gen1587-fork{position:fixed!important;left:50%!important;top:50%!important;z-index:2147483000!important;width:min(calc(100vw - 28px),720px)!important;max-height:calc(100vh - 40px)!important;margin:0!important;padding:clamp(1rem,3vw,1.4rem)!important;overflow:auto!important;transform:translate(-50%,-50%)!important;border:1px solid rgba(255,225,143,.58)!important;border-radius:1.35rem!important;background:linear-gradient(145deg,rgba(5,13,23,.995),rgba(3,9,17,.995))!important;box-shadow:0 0 0 1px rgba(255,255,255,.035),0 28px 90px rgba(0,0,0,.68)!important;text-align:center!important}
.compass-mirrorland-routes.is-gen1587-fork>.compass-estate__kicker{margin:0 0 .35rem!important;color:rgba(147,226,241,.82)!important;letter-spacing:.16em!important}
.compass-mirrorland-routes.is-gen1587-fork>h3{margin:0 0 1rem!important;color:rgba(255,247,222,.98)!important;font-family:var(--font-display,Georgia,serif)!important;font-size:clamp(1.55rem,4vw,2.35rem)!important;line-height:1.04!important}
.compass-mirrorland-threshold-routes nav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:.7rem!important;align-items:stretch!important}
.compass-mirrorland-threshold-routes a{position:relative!important;display:grid!important;align-content:end!important;min-height:6.6rem!important;padding:1rem .85rem!important;border:1px solid rgba(248,222,147,.28)!important;border-radius:1rem!important;color:rgba(255,249,230,.98)!important;background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(8,20,29,.72))!important;text-decoration:none!important;font:850 clamp(.72rem,1.5vw,.88rem)/1.22 Inter,ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.05em!important;text-transform:uppercase!important;overflow:hidden!important}
.compass-mirrorland-threshold-routes a::before{content:attr(data-threshold-kicker);position:absolute;left:.85rem;top:.72rem;color:rgba(151,224,239,.80);font-size:.6rem;letter-spacing:.13em;text-transform:uppercase}
.compass-mirrorland-threshold-routes a:hover,.compass-mirrorland-threshold-routes a:focus-visible{transform:translateY(-2px)!important;border-color:rgba(248,222,147,.82)!important;box-shadow:0 0 24px rgba(244,214,128,.16)!important;outline:none!important}
.compass-mirrorland-threshold-routes a[data-threshold-return]{grid-column:1/-1!important;min-height:auto!important;padding:.72rem .85rem!important;background:rgba(3,10,16,.55)!important;color:rgba(218,232,234,.8)!important;font-size:.68rem!important}
.compass-mirrorland-threshold-routes a[data-threshold-return]::before{content:none!important}

/* Capability continuity: one stage, tab-like selectors, one active content owner. */
.compass-monuments{display:grid!important;grid-template-columns:1fr!important;gap:.85rem!important;overflow:hidden!important}
.compass-capability-choices{display:flex!important;flex-wrap:wrap!important;gap:.45rem!important;align-items:center!important;justify-content:center!important}
.compass-capability-choices .compass-monument{min-height:44px!important;width:auto!important;flex:0 1 auto!important;padding:.68rem .9rem!important;border-radius:999px!important}
.compass-capability-choices .compass-monument p{display:none!important}
.compass-capability-choices .compass-monument h2{font:850 .76rem/1.1 Inter,ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.08em!important;text-transform:uppercase!important;white-space:nowrap!important}
.compass-capability-choices .compass-monument[aria-selected="true"]{border-color:rgba(244,214,128,.72)!important;background:rgba(244,214,128,.12)!important;box-shadow:0 0 22px rgba(244,214,128,.12)!important}
.compass-monument-detail{position:relative!important;display:grid!important;align-content:center!important;gap:.8rem!important;min-height:15rem!important;overflow:hidden!important;padding:clamp(1.1rem,3vw,1.7rem)!important}
.compass-monument-detail>*{position:relative!important;inset:auto!important;transform:none!important;margin-top:0!important;margin-bottom:0!important;max-width:100%!important}
.compass-monument-detail p{line-height:1.55!important}
.compass-monument-detail a{margin-top:.25rem!important;justify-self:start!important}
.compass-capability-orbit .compass-orbit-plaque:not([data-active="true"]){opacity:0!important;visibility:hidden!important;pointer-events:none!important;display:none!important}
.compass-capability-orbit .compass-orbit-plaque[data-active="true"]{opacity:1!important;visibility:visible!important;display:grid!important;z-index:12!important}
.compass-capability-orbit .compass-orbit-plaque:not([data-active="true"]) canvas{display:none!important}

/* Shared site carousel grammar: one stage + tabs + one active card + swipe/keyboard. */
.compass-built{overflow:hidden!important}
.compass-proof-orbit[data-proof-orbit]{display:none!important}
.compass-readiness-stage{width:min(100%,72rem);margin:1.35rem auto 0;overflow:hidden}
.compass-readiness-tabs{display:flex;justify-content:center;gap:.5rem;margin:0 0 .75rem;padding:.25rem;flex-wrap:wrap}
.compass-readiness-tab{min-width:5.2rem;min-height:44px;padding:.68rem 1rem;border:1px solid rgba(211,225,233,.2);border-radius:999px;background:rgba(8,18,27,.72);color:rgba(224,234,235,.8);font:850 .76rem/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase;cursor:pointer}
.compass-readiness-tab[aria-selected="true"]{border-color:rgba(244,214,128,.68);background:rgba(244,214,128,.11);color:rgba(255,246,216,.98);box-shadow:0 0 20px rgba(244,214,128,.12)}
.compass-readiness-family[hidden]{display:none!important}
.compass-readiness-family{position:relative;overflow:hidden;padding:clamp(1rem,2.6vw,1.45rem);border:1px solid rgba(211,225,233,.18);border-radius:1.35rem;background:radial-gradient(circle at 50% 20%,rgba(244,214,128,.055),transparent 46%),linear-gradient(150deg,rgba(15,29,40,.78),rgba(6,15,23,.68));box-shadow:0 28px 72px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.07);outline:0}
.compass-readiness-family[data-readiness-family="tra"]{border-color:rgba(104,209,229,.25)}
.compass-readiness-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:.8rem;margin-bottom:.65rem;position:relative;z-index:20;min-height:4rem}
.compass-readiness-head p{margin:0!important;color:rgba(244,214,128,.88)!important;font:800 .66rem/1.2 Inter,ui-sans-serif,system-ui,sans-serif!important;letter-spacing:.16em!important;text-transform:uppercase!important}
[data-readiness-family="tra"] .compass-readiness-head p{color:rgba(154,225,240,.86)!important}
.compass-readiness-head h3{margin:.22rem 0 0!important;max-width:24ch!important;font-family:var(--font-display,Georgia,serif)!important;font-size:clamp(1.45rem,3.2vw,2.35rem)!important;line-height:1.04!important;color:rgba(255,248,229,.98)!important;overflow-wrap:anywhere!important}
.compass-readiness-status{align-self:start;padding:.35rem .55rem;border:1px solid rgba(244,214,128,.24);border-radius:999px;background:rgba(244,214,128,.055);color:rgba(255,244,210,.88);font:800 .62rem/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;white-space:nowrap}
.compass-readiness-viewport{position:relative;display:grid;place-items:center;min-height:22rem;isolation:isolate;touch-action:pan-y;overflow:hidden}
.compass-readiness-slide{position:absolute;inset:auto;width:min(100%,720px);min-height:17rem;padding:clamp(1rem,3vw,1.55rem);display:none;align-content:center;gap:.78rem;border:1px solid rgba(211,225,233,.13);border-radius:1.25rem;background:linear-gradient(145deg,rgba(18,34,46,.96),rgba(5,15,24,.94));box-shadow:0 20px 52px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.07);opacity:0;pointer-events:none}
.compass-readiness-slide[data-active="true"]{display:grid;position:relative;opacity:1;pointer-events:auto}
.compass-readiness-slide p{margin:0!important;max-width:58ch!important;color:rgba(226,234,232,.86)!important;font-size:clamp(.86rem,1.55vw,.98rem)!important;line-height:1.55!important}
.compass-readiness-provocation{padding:.72rem .84rem;border-left:2px solid rgba(244,214,128,.52);border-radius:.15rem .75rem .75rem .15rem;background:linear-gradient(90deg,rgba(244,214,128,.07),transparent);color:rgba(255,244,211,.96)!important;font-weight:760!important}
[data-readiness-family="tra"] .compass-readiness-provocation{border-left-color:rgba(104,209,229,.58);background:linear-gradient(90deg,rgba(104,209,229,.07),transparent)}
.compass-readiness-slide a{display:inline-flex;width:fit-content;margin-top:.1rem;padding:.58rem .76rem;border:1px solid rgba(145,219,235,.22);border-radius:.72rem;color:rgba(223,246,250,.94);text-decoration:none;font-weight:850}
.compass-readiness-dots{display:flex;justify-content:center;gap:.42rem;margin-top:.65rem}
.compass-readiness-dots span{width:9px;height:9px;border-radius:50%;background:rgba(211,225,233,.24)}
.compass-readiness-dots span[aria-current="true"]{background:rgba(244,214,128,.92);box-shadow:0 0 14px rgba(244,214,128,.24)}
[data-readiness-family="tra"] .compass-readiness-dots span[aria-current="true"]{background:rgba(120,218,237,.92)}
.compass-readiness-rail{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:.22rem;margin:.2rem 0 .35rem;padding:0;list-style:none}
.compass-readiness-rail li{display:grid;place-items:center;min-height:1.65rem;border:1px solid rgba(211,225,233,.14);border-radius:.42rem;color:rgba(215,226,224,.58);font:850 .64rem/1 Inter,ui-sans-serif,system-ui,sans-serif}
.compass-readiness-rail li[data-attained]{border-color:rgba(244,214,128,.22);color:rgba(245,226,169,.78);background:rgba(244,214,128,.035)}
.compass-readiness-rail li[aria-current="step"]{border-color:rgba(244,214,128,.72);background:rgba(244,214,128,.13);color:rgba(255,243,203,.98)}
@media(max-width:820px){.compass-instrument{padding:.65rem!important}.compass-mirrorland-threshold-routes nav{grid-template-columns:1fr!important}.compass-mirrorland-threshold-routes a[data-threshold-return]{grid-column:auto!important}.compass-readiness-head{grid-template-columns:1fr}.compass-readiness-status{justify-self:start}.compass-readiness-viewport{min-height:20rem}}
@media(max-width:560px){.compass-readiness-family{padding:.85rem!important}.compass-readiness-head h3{font-size:1.45rem!important}.compass-readiness-viewport{min-height:19rem}.compass-readiness-slide{min-height:16rem;padding:1rem}.compass-capability-choices{justify-content:flex-start!important;overflow-x:auto!important;flex-wrap:nowrap!important;padding-bottom:.25rem!important}.compass-capability-choices .compass-monument{flex:0 0 auto!important}}
@media(prefers-reduced-motion:reduce){.compass-object--wing,.compass-projected-room-label,[data-compass-room-proxy],[data-compass-panel],.compass-mirrorland-focus-backdrop{transition:none!important}}
`;
  document.head.append(style);
}

function integrateMirrorlandFork(){
  const routes=q('[data-compass-mirrorland-routes]',state.root);
  if(!routes)return false;
  routes.classList.add('compass-mirrorland-threshold-routes');
  routes.setAttribute('data-presentation-owner','compass-presentation-convergence-v6');
  let primaryIndex=0;
  qa('a',routes).forEach(link=>{
    if(link.hasAttribute('data-compass-mirrorland-inline-back')){
      link.setAttribute('data-threshold-return','true');
      link.removeAttribute('data-threshold-kicker');
    }else{
      link.removeAttribute('data-threshold-return');
      link.setAttribute('data-threshold-kicker',['Narrative','Demo','World map'][primaryIndex]||'Enter');
      primaryIndex+=1;
    }
  });
  state.backdrop?.remove();
  state.backdrop=document.createElement('div');
  state.backdrop.className='compass-mirrorland-focus-backdrop';
  state.backdrop.setAttribute('aria-hidden','true');
  state.backdrop.addEventListener('click',()=>q('[data-compass-mirrorland-inline-back]',routes)?.click());
  document.body.append(state.backdrop);
  return true;
}

function syncMirrorlandFork(){
  const routes=q('[data-compass-mirrorland-routes]',state.root);if(!routes)return;
  const focused=state.root.dataset.compassMode==='MIRRORLAND_FOCUSED';
  routes.classList.toggle('is-gen1587-fork',focused);
  state.backdrop?.classList.toggle('is-active',focused);
  document.documentElement.toggleAttribute('data-mirrorland-focus',focused);
}
function roomDeclaration(roomId){
  if(!roomId)return null;
  return q(`[data-compass-room-declarations] [data-compass-room][data-room-id="${escapeId(roomId)}"]`,state.root)||q(`[data-compass-room][data-room-id="${escapeId(roomId)}"]`,state.root);
}
function currentForegroundRoom(){
  const mode=state.root.dataset.compassMode||'';
  if(mode!=='CLUSTER_OPEN'&&mode!=='ROOM_SELECTED')return '';
  const preview=state.root.dataset.clusterPreviewPrimaryRoom||'';
  const primary=state.root.dataset.clusterPrimaryRoom||'';
  const selected=state.root.dataset.selectedRoom||'';
  const gesture=state.root.dataset.clusterGestureActive==='true'||state.root.dataset.clusterPhase==='PREVIEW';
  return gesture?(preview||primary||selected):(primary||preview||selected);
}
function panelForRoom(room){
  return {eyebrow:room?.dataset.localCoordinate||'Selected path',title:room?.dataset.label||room?.textContent?.trim()||'Selected path',purpose:room?.dataset.preview||room?.dataset.localFunction||'',relationship:room?.dataset.whyEnter||'Inspect this path, then enter when ready.'};
}
function transitionPanel(roomId){
  const room=roomDeclaration(roomId),panel=q('[data-compass-panel]',state.root);if(!room||!panel)return;
  const next=panelForRoom(room);clearTimeout(state.panelTimer);panel.classList.add('is-gen1587-transitioning');
  state.panelTimer=setTimeout(()=>{
    const eyebrow=q('[data-compass-panel-eyebrow]',state.root),title=q('[data-compass-panel-title]',state.root),purpose=q('[data-compass-panel-purpose]',state.root),relationship=q('[data-compass-panel-relationship]',state.root);
    if(eyebrow)eyebrow.textContent=next.eyebrow;if(title)title.textContent=next.title;if(purpose)purpose.textContent=next.purpose;if(relationship)relationship.textContent=next.relationship;
    panel.dataset.foregroundRoom=roomId;requestAnimationFrame(()=>panel.classList.remove('is-gen1587-transitioning'));
  },60);
}
function syncSingleLabel(roomId){
  const room=roomDeclaration(roomId),labelText=room?.dataset.label||room?.textContent?.trim()||'';
  const labels=qa('.compass-projected-room-label',state.root);
  labels.forEach((node,index)=>{
    const current=index===0&&Boolean(roomId);node.dataset.gen1587Current=current?'true':'false';node.hidden=!current;node.setAttribute('aria-hidden',current?'false':'true');if(current&&labelText)node.textContent=labelText;
  });
}
function syncClusterState(){
  const roomId=currentForegroundRoom();if(!roomId){state.lastRoom='';syncSingleLabel('');return;}
  syncSingleLabel(roomId);if(roomId!==state.lastRoom){state.lastRoom=roomId;transitionPanel(roomId);}
}

function createSlide({title,body,provocation,href,label,rail}){
  const article=document.createElement('article');article.className='compass-readiness-slide';article.dataset.readinessTitle=title;
  if(provocation){const p=document.createElement('p');p.className='compass-readiness-provocation';p.textContent=provocation;article.append(p);}
  if(body){const p=document.createElement('p');p.textContent=body;article.append(p);}
  if(rail){const ol=document.createElement('ol');ol.className='compass-readiness-rail';ol.setAttribute('aria-label','Software technology readiness levels 1 through 9');for(let i=1;i<=9;i++){const li=document.createElement('li');li.textContent=String(i);if(i<8)li.dataset.attained='';if(i===7)li.setAttribute('aria-current','step');if(i>7)li.dataset.unclaimed='';ol.append(li);}article.append(ol);}
  if(href&&label){const a=document.createElement('a');a.href=href;a.textContent=label;article.append(a);}
  return article;
}
function buildCarousel(type,status,slides){
  const section=document.createElement('section');section.className='compass-readiness-family';section.dataset.readinessFamily=type;section.setAttribute('aria-roledescription','carousel');section.tabIndex=0;
  const head=document.createElement('header');head.className='compass-readiness-head';head.innerHTML=`<div><p>${type==='trl'?'Technology Readiness Level':'Technology Readiness Assessment'}</p><h3></h3></div><span class="compass-readiness-status">${status}</span>`;section.append(head);
  const title=q('h3',head),viewport=document.createElement('div');viewport.className='compass-readiness-viewport';slides.forEach(slide=>viewport.append(slide));section.append(viewport);
  const dots=document.createElement('div');dots.className='compass-readiness-dots';dots.setAttribute('aria-hidden','true');slides.forEach(()=>dots.append(document.createElement('span')));section.append(dots);
  let index=0,startX=null;
  const render=()=>{slides.forEach((node,i)=>{const active=i===index;node.dataset.active=active?'true':'false';node.hidden=!active;node.setAttribute('aria-hidden',active?'false':'true');});[...dots.children].forEach((node,i)=>node.setAttribute('aria-current',i===index?'true':'false'));title.textContent=slides[index].dataset.readinessTitle||'';section.dataset.slide=String(index+1);section.setAttribute('aria-label',`${type.toUpperCase()}: ${title.textContent}`);};
  const go=delta=>{index=(index+delta+slides.length)%slides.length;render();};
  section.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();go(-1);}else if(event.key==='ArrowRight'){event.preventDefault();go(1);}});
  viewport.addEventListener('pointerdown',event=>{if(event.target.closest('a,button'))return;startX=event.clientX;},{passive:true});
  viewport.addEventListener('pointerup',event=>{if(startX===null)return;const dx=event.clientX-startX;startX=null;if(Math.abs(dx)>42)go(dx<0?1:-1);},{passive:true});
  render();return {section,render};
}
function installReadinessStage(){
  const built=q('.compass-built',state.root),orbit=built?.querySelector('[data-proof-orbit]');if(!built||!orbit)return false;
  built.querySelector('.compass-readiness-pair')?.remove();built.querySelector('.compass-readiness-stage')?.remove();
  const trlSlides=[
    createSlide({title:'Software TRL 7',provocation:'This is not a prototype claim. It is a bounded claim that the software has been demonstrated in an operationally relevant environment.',body:'Diamond Gate self-assesses the governed software-construction platform at Software TRL 7 against NASA’s published criteria. TRL 8 and 9 remain explicitly unclaimed.',href:'/evidence/readiness/',label:'Inspect the TRL 7 closure matrix →',rail:true}),
    createSlide({title:'Where the claim stops',provocation:'A mature system is easier to trust when it tells you exactly what it has not proven.',body:'No NASA endorsement. No universal scientific validation. No claim that every page or experiment has reached the same maturity. The boundary is part of the evidence.',href:'/governance/',label:'Inspect the governing boundary →'}),
    createSlide({title:'What would justify TRL 8?',provocation:'The next level is not awarded by optimism. It requires stronger completion evidence.',body:'The open question is whether the full operational system can close its remaining qualification boundaries repeatedly enough to justify a higher readiness disposition.',href:'/evidence/',label:'Follow the evidence trail →'})
  ];
  const traSlides=[
    createSlide({title:'Can the readiness claim survive inspection?',provocation:'TRA is the adversarial companion to TRL: not “what level do we want?” but “what evidence would make that level defensible?”',body:'The assessment separates source claims, rendered behavior, exact-head publication, and live verification so a maturity label cannot outrun the evidence.',href:'/evidence/',label:'Enter the evidence room →'}),
    createSlide({title:'Candidate is not release',provocation:'Qualification, merge, deployment, and live verification are four different events.',body:'Diamond Gate keeps those transitions separate so a successful build cannot quietly masquerade as a verified public result.',href:'/governance/',label:'Inspect governance →'}),
    createSlide({title:'The contrary evidence matters',provocation:'A failed browser run is not noise. It is evidence against the current claim until the exact defect is resolved.',body:'Assessment records are most useful when they preserve failure boundaries, stale assumptions, and the conditions under which a result should be rejected.',href:'/laws/',label:'Read the governing standards →'}),
    createSlide({title:'From assessment to instrument',provocation:'The point is not to admire a score. The point is to know what can lawfully happen next.',body:'Gauges, laws, governance, and evidence development turn assessment into bounded operational decisions instead of decorative maturity language.',href:'/gauges/',label:'Open the instruments →'})
  ];
  const stage=document.createElement('div');stage.className='compass-readiness-stage';stage.dataset.compassReadinessStage='continuity-v3';
  const tabs=document.createElement('div');tabs.className='compass-readiness-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Readiness family');
  const trlTab=document.createElement('button'),traTab=document.createElement('button');
  [trlTab,traTab].forEach(tab=>{tab.type='button';tab.className='compass-readiness-tab';tab.setAttribute('role','tab');});trlTab.textContent='TRL';traTab.textContent='TRA';tabs.append(trlTab,traTab);stage.append(tabs);
  const trl=buildCarousel('trl','Level 7',trlSlides),tra=buildCarousel('tra','Inspectable',traSlides);stage.append(trl.section,tra.section);orbit.insertAdjacentElement('afterend',stage);
  const setFamily=family=>{const isTrl=family==='trl';trlTab.setAttribute('aria-selected',isTrl?'true':'false');traTab.setAttribute('aria-selected',isTrl?'false':'true');trlTab.tabIndex=isTrl?0:-1;traTab.tabIndex=isTrl?-1:0;trl.section.hidden=!isTrl;tra.section.hidden=isTrl;trl.section.toggleAttribute('inert',!isTrl);tra.section.toggleAttribute('inert',isTrl);stage.dataset.activeFamily=family;};
  trlTab.addEventListener('click',()=>setFamily('trl'));traTab.addEventListener('click',()=>setFamily('tra'));
  tabs.addEventListener('keydown',event=>{if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;event.preventDefault();const next=stage.dataset.activeFamily==='trl'?'tra':'trl';setFamily(next);(next==='trl'?trlTab:traTab).focus();});
  setFamily('trl');state.readiness={stage,setFamily};return true;
}
function normalizeCapabilitySemantics(){
  const choices=q('.compass-capability-choices',state.root);if(!choices)return false;
  choices.setAttribute('role','tablist');choices.setAttribute('aria-label','Capabilities');
  qa('.compass-monument',choices).forEach((item,index)=>{item.setAttribute('role','tab');item.tabIndex=item.getAttribute('aria-selected')==='true'?0:-1;if(!item.id)item.id=`compass-capability-tab-${index+1}`;});
  return true;
}
function unifyLowerEstate(){q('.compass-monuments',state.root)?.setAttribute('data-estate-surface','entrances');q('.compass-build-cta',state.root)?.setAttribute('data-estate-surface','construction');}
function installObserver(){
  state.observer?.disconnect();state.observer=new MutationObserver(()=>queueMicrotask(()=>{syncMirrorlandFork();syncClusterState();normalizeCapabilitySemantics();}));
  state.observer.observe(state.root,{attributes:true,subtree:true,attributeFilter:['data-compass-mode','data-cluster-primary-room','data-cluster-preview-primary-room','data-cluster-phase','data-cluster-gesture-active','data-selected-room','data-mirrorland-window-state','aria-selected','data-active']});
}
function mount(){
  state.root=q('[data-compass-root]');if(!state.root)return;
  retireLegacyPresentation();installStyle();const mirrorlandIntegrated=integrateMirrorlandFork();const readinessIntegrated=installReadinessStage();const capabilityIntegrated=normalizeCapabilitySemantics();unifyLowerEstate();installObserver();syncMirrorlandFork();syncClusterState();
  globalThis[GLOBAL]=Object.freeze({mounted:true,version:'presentation-convergence-v6',mirrorlandInteractionOwner:'DGB_COMPASS_CONTROLLER',mirrorlandPresentationOwner:'DGB_COMPASS_PRESENTATION_CONVERGENCE_V6',readinessPresentationOwner:'DGB_COMPASS_PRESENTATION_CONVERGENCE_V6',clusterStateOwner:'DGB_COMPASS_CONTROLLER',clusterPresentationOwner:'DGB_COMPASS_PRESENTATION_CONVERGENCE_V6',roomPanelSource:'CONTROLLER_DATASETS',labelPolicy:'ONE_FOREGROUND_ROOM_ONE_VISIBLE_LABEL',carouselPolicy:'SITE_CONTINUITY_V3_ONE_STAGE_TABS_SWIPE_KEYBOARD',readinessPolicy:'TRL_TRA_MUTUALLY_EXCLUSIVE',mirrorlandFocusPolicy:'FOUR_WAY_FORK',mirrorlandIntegrated,readinessIntegrated,capabilityIntegrated,broadPresentationOwnership:false});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount,{once:true}):mount();
})();