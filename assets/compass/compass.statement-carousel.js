(()=>{
  'use strict';
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const mod=(value,base)=>((value%base)+base)%base;
  function arrive(item){
    item.classList.remove('is-arriving');void item.offsetWidth;item.classList.add('is-arriving');
    setTimeout(()=>item.classList.remove('is-arriving'),reduce.matches?160:560);
  }
  function mountStatements(){
    const header=document.querySelector('.compass-estate__header');
    if(!header||header.querySelector('[data-statement-orbit]'))return;
    const items=[header.querySelector('.compass-estate__sentence'),header.querySelector('.compass-estate__epigraph')];
    if(items.some(item=>!item))return;
    const stage=document.createElement('section');
    stage.className='compass-statement-orbit';stage.dataset.statementOrbit='true';stage.tabIndex=0;
    stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carousel');stage.setAttribute('aria-label','Opening thoughts');
    const guidance=document.createElement('p');guidance.className='compass-statement-guidance';guidance.textContent='Swipe the thought above.';
    const status=document.createElement('p');status.className='compass-orbit-status';status.setAttribute('aria-live','polite');
    let index=0,busy=false;
    items.forEach((item,i)=>{item.classList.add('compass-statement-object');item.dataset.slot=i?'rear':'front';stage.append(item)});
    stage.append(guidance,status);header.insertBefore(stage,header.querySelector('.compass-introduction'));
    const render=arrival=>{
      items.forEach((item,i)=>{const front=i===index;item.dataset.slot=front?'front':'rear';item.toggleAttribute('inert',!front);item.setAttribute('aria-hidden',front?'false':'true');item.setAttribute('aria-current',front?'true':'false')});
      status.textContent=`Thought ${index+1} of ${items.length}`;if(arrival)arrive(items[index]);
    };
    const rotate=direction=>{if(busy)return;busy=true;index=mod(index+direction,items.length);render(true);setTimeout(()=>busy=false,reduce.matches?120:340)};
    window.CompassOrbitInput?.claimSwipe(stage,rotate);
    stage.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();rotate(event.key==='ArrowRight'?1:-1)}});
    render(true);
  }
  function installAwardStyle(){
    if(document.querySelector('[data-compass-award-presentation-style]'))return;
    const style=document.createElement('style');
    style.dataset.compassAwardPresentationStyle='true';
    style.textContent=`
      [data-compass-root][data-award-narrative="identity-experience-purpose-system-readiness-evidence"] .compass-introduction.compass-purpose-stage{display:block;max-width:72rem;margin:clamp(44px,7vw,82px) auto 0;padding:clamp(1rem,2.8vw,1.55rem);border:1px solid rgba(213,225,226,.16);border-radius:1.35rem;background:linear-gradient(145deg,rgba(8,19,28,.64),rgba(7,14,22,.38));box-shadow:0 24px 62px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.05)}
      .compass-purpose-stage>summary{cursor:pointer;color:rgba(247,235,196,.96);font:780 clamp(1rem,2vw,1.18rem)/1.25 Inter,sans-serif;letter-spacing:.04em}
      .compass-purpose-stage[open]>summary{margin-bottom:.8rem}
      .compass-purpose-stage .compass-introduction__body{margin:.4rem 0 0}
      .compass-readiness-stage{position:relative;isolation:isolate}
      .compass-readiness-stage::after{content:"TRL measures the maturity claim. TRA is the evidence review used to test that claim.";display:block;max-width:62ch;margin:1rem auto 0;color:rgba(202,219,222,.68);font:650 .78rem/1.5 Inter,sans-serif;text-align:center;letter-spacing:.025em}
      .compass-tra-boundary{margin:.9rem 0 0;padding:.78rem .9rem;border:1px solid rgba(104,200,218,.18);border-radius:.85rem;background:rgba(6,18,26,.42);color:rgba(222,232,231,.78);font:620 .82rem/1.52 Inter,sans-serif}
      .compass-tra-boundary strong{display:block;margin-bottom:.25rem;color:rgba(246,232,190,.94);font:760 .86rem/1.3 Inter,sans-serif;letter-spacing:.04em}
      .compass-evidence-exit{display:inline-flex;align-items:center;justify-content:center;min-height:46px;margin:clamp(18px,3vw,28px) auto 0;padding:.72rem 1rem;border:1px solid rgba(244,214,128,.34);border-radius:999px;color:rgba(255,244,211,.96);background:linear-gradient(145deg,rgba(244,214,128,.10),rgba(73,183,205,.06));font:800 .84rem/1.2 Inter,sans-serif;letter-spacing:.03em;text-decoration:none;box-shadow:0 16px 42px rgba(0,0,0,.22)}
      .compass-evidence-exit:hover,.compass-evidence-exit:focus-visible{border-color:rgba(244,214,128,.68);outline:none;box-shadow:0 0 0 3px rgba(244,214,128,.10),0 16px 42px rgba(0,0,0,.24)}
      @media(max-width:620px){.compass-purpose-stage{margin-top:34px!important;padding:.8rem!important}.compass-tra-boundary{font-size:.78rem}.compass-evidence-exit{width:100%;max-width:22rem}}
      @media(prefers-reduced-motion:reduce){.compass-evidence-exit{transition:none!important}}
    `;
    document.head.append(style);
  }
  function composeAwardNarrative(){
    const root=document.querySelector('[data-compass-root]');
    const header=document.querySelector('.compass-estate__header');
    const instrument=document.querySelector('.compass-instrument');
    const purpose=header?.querySelector('.compass-introduction');
    const capabilities=document.querySelector('[data-compass-capability-switcher], [data-capability-orbit]');
    const readiness=document.querySelector('.compass-built');
    if(!root||!header||!instrument||!purpose||!readiness)return;
    installAwardStyle();
    root.dataset.awardNarrative='identity-experience-purpose-system-readiness-evidence';
    root.dataset.readinessModel='TRL7_PLUS_TRA_ASSESSMENT_NO_SCORE';
    root.dataset.spacecraftPresentationAuthority='LAWS_SPACECRAFT_ONLY';
    purpose.classList.add('compass-purpose-stage');
    purpose.open=true;
    instrument.insertAdjacentElement('afterend',purpose);
    if(capabilities&&purpose.nextElementSibling!==capabilities)purpose.insertAdjacentElement('afterend',capabilities);
    readiness.classList.add('compass-readiness-stage');
    readiness.dataset.readinessStage='trl-tra';
    const kicker=readiness.querySelector(':scope > .compass-estate__kicker');
    if(kicker)kicker.textContent='Readiness · maturity and assessment';
    const title=readiness.querySelector(':scope > h2');
    if(title)title.textContent='Readiness, with the boundary visible.';
    const lead=readiness.querySelector('.compass-built__lead');
    if(lead)lead.textContent='Diamond Gate separates what the software has demonstrated from how that readiness is assessed. The maturity claim stays bounded; the evidence remains inspectable.';
    const trl=readiness.querySelector('[data-proof-card="trl7"]');
    if(trl&&!trl.querySelector('.compass-tra-boundary')){
      const boundary=document.createElement('div');
      boundary.className='compass-tra-boundary';
      boundary.dataset.traBoundary='assessment-not-level';
      boundary.innerHTML='<strong>Technology Readiness Assessment (TRA)</strong><span>The TRA is the evidence-review process used to examine readiness against stated criteria. It is not a second maturity score, does not raise Software TRL 7, and creates no external certification or endorsement.</span>';
      const rail=trl.querySelector('.compass-trl-rail');
      rail?.insertAdjacentElement('afterend',boundary);
    }
    if(!readiness.querySelector('.compass-evidence-exit')){
      const evidence=document.createElement('a');
      evidence.className='compass-evidence-exit';
      evidence.dataset.evidenceRegistryExit='true';
      evidence.href='/evidence/';
      evidence.textContent='Open the Evidence Registry →';
      readiness.append(evidence);
    }
  }
  function boot(){mountStatements();composeAwardNarrative()}
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',boot,{once:true}):boot();
  window.CompassStatementCarousel=Object.freeze({
    version:'statement-award-presentation-v1',
    worldInteraction:'delegated-to-laws-spacecraft',
    spacecraftSurface:'LAWS_SPACECRAFT_ONLY',
    narrativeOrder:'IDENTITY_EXPERIENCE_PURPOSE_SYSTEM_READINESS_EVIDENCE',
    readinessBoundary:'TRL7_PLUS_TRA_ASSESSMENT_NO_SCORE'
  });
})();
