const loader=document.querySelector('[data-audralia-loader]');
const stage=document.querySelector('[data-audralia-loader-stage]');
const track=document.querySelector('[data-audralia-loader-track]');
const fill=document.querySelector('[data-audralia-loader-fill]');
const progress=document.querySelector('[data-audralia-loader-progress]');
const elapsed=document.querySelector('[data-audralia-loader-elapsed]');
const started=performance.now();
const TOTAL=5;
let completed=-1;
let lastAdvance=started;
let delayed=false;
const rows={
  surface:document.querySelector('[data-loader-system="surface"]'),
  clouds:document.querySelector('[data-loader-system="clouds"]'),
  regional:document.querySelector('[data-loader-system="regional"]'),
  local:document.querySelector('[data-loader-system="local"]')
};

function setRow(name,state){
  const row=rows[name];
  if(!row)return;
  row.dataset.state=state;
  const out=row.querySelector('b');
  if(out)out.textContent=state==='ready'?'ready':'waiting';
}

function commit(next,label){
  if(next<=completed)return;
  completed=next;
  lastAdvance=performance.now();
  delayed=false;
  if(loader)delete loader.dataset.delayed;
  const bounded=Math.max(0,Math.min(TOTAL,next));
  const ratio=bounded/TOTAL;
  if(stage)stage.textContent=label;
  if(progress)progress.textContent=`${Math.round(ratio*100)}% · ${bounded} of ${TOTAL} stages`;
  if(track){track.setAttribute('aria-valuenow',String(bounded));track.dataset.completed=String(bounded);}
  if(fill)fill.style.width=`${Math.round(ratio*100)}%`;
  if(loader)loader.dataset.progress=String(bounded);
}

function markDelayed(now){
  if(delayed||completed>=TOTAL||now-lastAdvance<15000)return;
  delayed=true;
  if(loader)loader.dataset.delayed='true';
  if(stage)stage.textContent=`Renderer still working at stage ${Math.max(0,completed)} · continuing exact startup`;
}

function markError(error){
  if(!error||loader?.classList.contains('is-error'))return false;
  if(loader)loader.classList.add('is-error');
  if(stage)stage.textContent='Audralia startup stopped · renderer initialization failed';
  if(progress)progress.textContent=`${Math.max(0,completed)*20}% · startup error recorded`;
  return true;
}

function observe(){
  const now=performance.now();
  if(elapsed)elapsed.textContent=`${((now-started)/1000).toFixed(1)}s`;
  if(loader?.classList.contains('is-error'))return;

  const reconciliationError=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION_ERROR__;
  if(markError(reconciliationError))return;

  if(document.querySelector('[data-audralia-clear-atmosphere="true"]')){
    setRow('surface','ready');
    commit(1,'Surface and atmosphere resolved');
  }
  if(globalThis.__AUDRALIA_FAP1_ORBITAL_SUPPORT_TUNING__){
    setRow('clouds','ready');
    commit(2,'Planetary cloud field online');
  }
  if(document.querySelector('[data-audralia-exterior-weather="true"]')){
    setRow('regional','ready');
    commit(3,'Regional weather online');
  }
  if(document.querySelector('[data-canonical-weather-projection="true"]')){
    setRow('local','ready');
    commit(4,'Local weather continuity online');
  }
  if(window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__?.getRuntime?.()?.invariants?.pass===true){
    commit(5,'Audralia ready');
    return;
  }

  markDelayed(now);
  requestAnimationFrame(observe);
}

commit(0,'Preparing terrain, atmosphere, and camera…');
requestAnimationFrame(observe);
