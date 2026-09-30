const loader=document.querySelector('[data-audralia-loader]');
const stage=document.querySelector('[data-audralia-loader-stage]');
const track=document.querySelector('[data-audralia-loader-track]');
const fill=document.querySelector('[data-audralia-loader-fill]');
const progress=document.querySelector('[data-audralia-loader-progress]');
const elapsed=document.querySelector('[data-audralia-loader-elapsed]');
const note=document.querySelector('.audralia-loading-note');
const systemNodes=Object.freeze(Object.fromEntries(['surface','clouds','regional','local'].map(key=>[key,document.querySelector(`[data-loader-system="${key}"]`)])));
const startedAt=performance.now();
let failed=false;
let ready=false;
let ticker=0;

function paint(value,label){
  if(failed||ready)return;
  const bounded=Math.max(0,Math.min(100,Number(value)||0));
  if(stage)stage.textContent=label;
  if(fill){fill.style.animation='none';fill.style.left='0';fill.style.width=`${bounded}%`;fill.style.transition='width .24s cubic-bezier(.2,.8,.2,1)';}
  if(progress)progress.textContent=`${Math.floor(bounded)}% · ${label.toLowerCase()}`;
  if(track){track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(Math.floor(bounded)));}
  if(loader)loader.dataset.progress=String(Math.floor(bounded));
}
function mark(key,text){
  const node=systemNodes[key];
  if(!node)return;
  const value=node.querySelector('b');
  if(value)value.textContent=text;
}
function begin(){
  if(ticker)return;
  ticker=setInterval(()=>{if(elapsed)elapsed.textContent=`${((performance.now()-startedAt)/1000).toFixed(1)}s`;},250);
  paint(4,'Preparing tablet runtime');
}
function meshStart(){mark('surface','loading geometry');paint(10,'Loading local planetary geometry');}
function meshChunk(index,total){const ratio=Math.max(0,Math.min(1,(index+1)/Math.max(1,total)));paint(10+Math.round(ratio*24),`Loading local geometry ${index+1}/${total}`);}
function worldStart(){mark('surface','building');paint(38,'Constructing primary world');}
function worldPresented(){mark('surface','ready');paint(54,'Primary world presented');}
function cloudsStart(){mark('clouds','building');paint(62,'Building global cloud morphology');}
function cloudsReady(){mark('clouds','ready');mark('regional','ready');paint(82,'Global cloud morphology ready');}
function celestialStart(){mark('local','building');paint(90,'Adding atmosphere and celestial layers');}
function complete(){
  if(failed)return;
  ready=true;
  clearInterval(ticker);
  mark('surface','ready');mark('clouds','ready');mark('regional','ready');mark('local','ready');
  if(stage)stage.textContent='Audralia ready';
  if(progress)progress.textContent='100% · ready';
  if(fill)fill.style.width='100%';
  if(track)track.setAttribute('aria-valuenow','100');
  if(note)note.textContent='One continuous world is ready · single-context tablet rendering is active.';
  if(loader){loader.hidden=false;loader.classList.add('is-ready');setTimeout(()=>{loader.hidden=true;},420);}
}
function fail(label,error){
  if(failed||ready)return;
  failed=true;clearInterval(ticker);
  const message=error instanceof Error?error.message:String(error||'unknown startup error');
  if(stage)stage.textContent=label;
  if(progress)progress.textContent='startup stopped';
  if(loader){loader.hidden=false;loader.classList.remove('is-ready');loader.classList.add('is-error');}
  if(note){
    note.textContent=`${label}: ${message}`;
    const retry=document.createElement('button');retry.type='button';retry.textContent='Retry Audralia';retry.style.cssText='margin-top:14px;padding:10px 16px;border:1px solid rgba(225,239,219,.28);border-radius:999px;background:rgba(225,239,219,.08);color:inherit;font:inherit';retry.addEventListener('click',()=>location.reload());note.after(retry);
  }
  window.__AUDRALIA_STARTUP_FAILURE__=Object.freeze({label,message});
}

const controller=Object.freeze({begin,meshStart,meshChunk,worldStart,worldPresented,cloudsStart,cloudsReady,celestialStart,complete,fail});
Object.defineProperty(window,'__AUDRALIA_TABLET_LOADER_CONTROLLER__',{value:controller,writable:false,configurable:false});
begin();
export default controller;
