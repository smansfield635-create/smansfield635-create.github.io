(()=>{
  'use strict';
  const DATA=window.R8_DATA, S=window.R8_STATE;
  if(!DATA||!S)throw new Error('R8_PROTOTYPE_BOOTSTRAP_MISSING');
  let state=S.create(DATA), pointerStart=null;
  const spatial=document.getElementById('spatialView'),text=document.getElementById('textView'),stack=document.getElementById('cardStack'),live=document.getElementById('live'),back=document.getElementById('backButton'),reset=document.getElementById('resetButton'),modeSpatial=document.getElementById('modeSpatial'),modeText=document.getElementById('modeText');
  const esc=s=>String(s).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const claimById=id=>DATA.claims.find(c=>c.id===id);
  const relationById=id=>DATA.claims.find(c=>c.relationId===id);
  function badge(direction){return direction?`<span class="badge" data-direction="${esc(direction)}">${esc(direction)}</span>`:''}
  function statusMarkup(frame){
    if(frame.type==='CLAIM'){const c=claimById(frame.payload.claimId);return `<div class="status-line"><span class="badge">${esc(c.status)}</span><span class="badge">Ceiling · ${esc(c.ceiling)}</span></div>`;}
    if(frame.type==='RELATION'){const c=relationById(frame.payload.relationId);return `<div class="status-line">${badge(c.relation.direction)}<span class="badge">${esc(c.relation.standing)}</span><span class="badge">${esc(c.relation.type)}</span></div>`;}
    if(frame.type==='STUDY')return `<div class="status-line"><span class="badge">${esc(DATA.study.standing)}</span><span class="badge">${DATA.study.evaluationCycles.toLocaleString()} held-out cycles</span></div>`;
    return '';
  }
  function evidenceMarkup(frame){
    if(frame.type!=='STUDY')return '';
    return `<div class="evidence-grid" aria-label="Context-local declared relations">${DATA.claims.map(c=>`<article class="evidence-card" data-direction="${esc(c.relation.direction)}"><strong>${esc(c.label)} · ${esc(c.relation.direction)}</strong><span>${esc(c.relation.summary)}</span><span>Ceiling: ${esc(c.ceiling)}</span></article>`).join('')}</div>`;
  }
  function traceMarkup(frame){const payload=esc(JSON.stringify(frame.payload));return `<details class="trace-box"><summary>Traceability</summary><code>Scientific ${esc(DATA.scientificStateDigest)}<br>Relation ${esc(DATA.relationGraphDigest)}<br>Projection ${esc(DATA.projectionGraphDigest)}<br>Context ${esc(frame.type)} · depth ${frame.depth}<br>Payload ${payload}</code></details>`}
  function actionMarkup(control){const direction=control.direction?badge(control.direction):'';return `<button class="action" type="button" data-op="${esc(control.op)}" data-id="${esc(control.id||'')}"><span><strong>${esc(control.label)}</strong>${direction?`<span class="meta">${direction}</span>`:''}</span><span class="arrow" aria-hidden="true">→</span></button>`}
  function descriptorFor(frame){const temp=Object.freeze({...state,current:frame});return S.descriptor(temp)}
  function cardMarkup(frame,index,total){const d=descriptorFor(frame),distance=total-1-index,current=distance===0;return `<article class="context-card" style="--distance:${distance}" data-current="${current}" data-background="${!current}" aria-hidden="${!current}"><div class="card-body"><p class="eyebrow">${esc(d.eyebrow)}</p><h${current?'1':'2'} tabindex="${current?'-1':'-1'}" data-current-heading="${current?'true':'false'}">${esc(d.title)}</h${current?'1':'2'}><p class="summary">${esc(d.summary)}</p>${statusMarkup(frame)}${current?evidenceMarkup(frame):''}${current?`<div class="actions">${S.controls(state).map(actionMarkup).join('')}</div>`:''}${current?traceMarkup(frame):''}</div></article>`}
  function renderSpatial(){const frames=[...state.history,state.current].slice(-5);stack.innerHTML=frames.map((f,i)=>cardMarkup(f,i,frames.length)).join('');wireActions(stack);}
  function textControlMarkup(c){return `<button class="action" type="button" data-op="${esc(c.op)}" data-id="${esc(c.id||'')}"><span><strong>${esc(c.label)}</strong>${c.direction?`<span class="meta">Relation direction: ${esc(c.direction)}</span>`:''}</span><span class="arrow" aria-hidden="true">→</span></button>`}
  function renderText(){const d=S.descriptor(state),trail=S.trail(state);text.innerHTML=`<p class="eyebrow">Text-first equivalent · ${esc(d.eyebrow)}</p><h1 tabindex="-1" data-current-heading="true">${esc(d.title)}</h1><p class="summary">${esc(d.summary)}</p>${statusMarkup(state.current)}${evidenceMarkup(state.current)}<div class="text-trail" aria-label="Return path">${trail.map(t=>`<span class="crumb">${esc(t.type)}</span>`).join('')}</div><div class="actions">${S.controls(state).map(textControlMarkup).join('')}</div>${traceMarkup(state.current)}`;wireActions(text);}
  function wireActions(root){root.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>operate(btn.dataset.op,btn.dataset.id)));}
  function operate(op,id){try{
    if(op==='ENTER')state=S.enter(state);
    else if(op==='CLAIM')state=S.openClaim(state,id);
    else if(op==='RELATION')state=S.openRelation(state,id);
    else if(op==='STUDY')state=S.openStudy(state);
    else throw new Error('UNKNOWN_OPERATION');
    render(true);
  }catch(err){live.textContent=`Operation rejected: ${err.message}`;}}
  function setMode(mode){state=S.setMode(state,mode);render(false);}
  function goBack(){const before=state;state=S.back(state);if(before!==state)render(true);}
  function doReset(){state=S.reset(state);render(true);}
  function render(announce){S.assertInvariant(state);const spatialMode=state.mode==='SPATIAL';spatial.classList.toggle('hidden',!spatialMode);text.setAttribute('aria-hidden',String(spatialMode));modeSpatial.setAttribute('aria-pressed',String(spatialMode));modeText.setAttribute('aria-pressed',String(!spatialMode));back.disabled=state.history.length===0;renderSpatial();renderText();if(announce){const d=S.descriptor(state);live.textContent=`${d.eyebrow}. ${d.title}. Depth ${state.current.depth}. Orientation METHODS_AND_MODELS retained.`;requestAnimationFrame(()=>{const h=(spatialMode?stack:text).querySelector('[data-current-heading=true]');h?.focus({preventScroll:true});});}}
  modeSpatial.addEventListener('click',()=>setMode('SPATIAL'));
  modeText.addEventListener('click',()=>setMode('TEXT'));
  back.addEventListener('click',goBack);reset.addEventListener('click',doReset);
  document.addEventListener('keydown',e=>{const editable=e.target&&(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)||e.target.isContentEditable);if(e.key==='Escape'||(e.altKey&&e.key==='ArrowLeft')||(e.key==='Backspace'&&!editable)){e.preventDefault();goBack();}});
  spatial.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY,id:e.pointerId};});
  spatial.addEventListener('pointerup',e=>{if(!pointerStart||pointerStart.id!==e.pointerId)return;const dx=e.clientX-pointerStart.x,dy=Math.abs(e.clientY-pointerStart.y);pointerStart=null;if(dx>72&&dy<80)goBack();});
  spatial.addEventListener('pointercancel',()=>{pointerStart=null;});
  render(false);
})();
