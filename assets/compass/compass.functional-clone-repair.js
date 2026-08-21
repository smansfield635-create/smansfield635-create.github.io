(()=>{
'use strict';
const CONTRACT='DGB_COMPASS_FUNCTIONAL_CLONE_STAGE1_REPAIR_v1';
function init(){
  const root=document.querySelector('[data-compass-root]');
  const scene=document.querySelector('[data-compass-scene]');
  const door=document.querySelector('[data-compass-object="mirrorland"]');
  if(!root||!scene)return;

  // Foreground-cardinal label: renderer remains the position authority.
  const label=document.createElement('div');
  label.dataset.compassProjectedCardinalLabel='true';
  label.setAttribute('aria-hidden','true');
  Object.assign(label.style,{
    position:'absolute',zIndex:'9',pointerEvents:'none',transform:'translate(-50%,0)',
    minWidth:'7.2rem',maxWidth:'10rem',padding:'.36rem .58rem',border:'1px solid rgba(243,217,139,.44)',
    borderRadius:'999px',background:'linear-gradient(135deg,rgba(24,32,48,.94),rgba(58,47,25,.90))',
    boxShadow:'0 8px 26px rgba(0,0,0,.42),0 0 22px rgba(243,217,139,.11)',
    color:'rgba(255,248,224,.98)',font:'850 .68rem/1.12 Inter,ui-sans-serif,system-ui,sans-serif',
    letterSpacing:'.055em',textAlign:'center',textTransform:'uppercase',textShadow:'0 1px 5px rgba(0,0,0,.95)'
  });
  scene.append(label);

  function primaryCardinal(){
    return scene.querySelector('[data-compass-cardinal][data-primary="true"]') ||
      scene.querySelector(`[data-compass-cardinal][data-cardinal-id="${CSS.escape(root.dataset.renderedForegroundCardinal||root.dataset.readableCardinal||'north')}"]`) ||
      scene.querySelector('[data-compass-cardinal]');
  }
  function syncCardinalLabel(){
    const mode=String(root.dataset.compassMode||'');
    if(mode!=='CONSTELLATION'){label.hidden=true;return;}
    const el=primaryCardinal();
    if(!el){label.hidden=true;return;}
    const sceneRect=scene.getBoundingClientRect();
    const rect=el.getBoundingClientRect();
    const x=Number.parseFloat(el.style.left);
    const y=Number.parseFloat(el.style.top);
    const id=String(el.dataset.cardinalId||'').toLowerCase();
    const title=el.dataset.coordinateLabel||el.dataset.panelTitle||id;
    const direction=id?`${id.charAt(0).toUpperCase()+id.slice(1)} star`:'';
    label.innerHTML=`<span style="display:block">${title}</span><span style="display:block;margin-top:.12rem;opacity:.66;font-size:.58rem">${direction}</span>`;
    if(Number.isFinite(x)&&Number.isFinite(y)){
      label.style.left=`${x}px`;
      label.style.top=`${y+Math.max(34,rect.height*.56)}px`;
      label.hidden=false;
      return;
    }
    if(rect.width>0&&rect.height>0){
      label.style.left=`${rect.left-sceneRect.left+rect.width/2}px`;
      label.style.top=`${rect.bottom-sceneRect.top+5}px`;
      label.hidden=false;
    }else label.hidden=true;
  }

  // Mirrorland: visual renderer owns the glass; this semantic target owns only the hit.
  if(door){
    const reveal=event=>{
      if(event.type==='pointerup'&&event.button!=null&&event.button!==0)return;
      const controller=globalThis.DGB_COMPASS_CONTROLLER;
      if(!controller?.requestMirrorlandReveal)return;
      const frame=controller.getFrameState?.();
      const mode=frame?.state||root.dataset.compassMode||'';
      if(!['CONSTELLATION','CLUSTER_OPEN','ROOM_SELECTED'].includes(mode))return;
      event.preventDefault();
      event.stopPropagation();
      controller.requestMirrorlandReveal();
    };
    Object.assign(door.style,{
      position:'absolute',left:'50%',top:'50%',width:'clamp(92px,18vw,156px)',height:'clamp(150px,29vw,246px)',
      transform:'translate(-50%,-50%)',zIndex:'2147483000',pointerEvents:'auto',visibility:'visible',touchAction:'manipulation',
      border:'0',background:'transparent',color:'transparent',fontSize:'0',overflow:'hidden',borderRadius:'48% 48% 18% 18% / 28% 28% 12% 12%'
    });
    door.setAttribute('aria-label','Open Mirrorland');
    door.dataset.functionalCloneMirrorlandHit='true';
    door.addEventListener('pointerup',reveal,true);
    door.addEventListener('click',reveal,true);
  }

  const observer=new MutationObserver(()=>queueMicrotask(syncCardinalLabel));
  observer.observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-readable-cardinal','data-rendered-foreground-cardinal','data-orbit-focus','data-orbit-preview-focus']});
  scene.querySelectorAll('[data-compass-cardinal]').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['data-primary','style']}));
  const tick=()=>{syncCardinalLabel();requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
  globalThis.DGB_COMPASS_FUNCTIONAL_CLONE_REPAIR=Object.freeze({contract:CONTRACT,cardinalLabel:true,mirrorlandHit:true,productionUntouched:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
