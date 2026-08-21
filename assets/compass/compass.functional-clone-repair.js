(()=>{
'use strict';
const CONTRACT='DGB_COMPASS_FUNCTIONAL_CLONE_STAGE1_REPAIR_v3';
const H_EARTH='https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/0c6069f30e494be2f84d2653f40e374178251c77/showroom/globe/h-earth/index.html';
const CARDINAL_COPY=Object.freeze({north:['Orientation','North Star'],east:['Worlds','East Star'],south:['Instruments','South Star'],west:['Frontier','West Star']});
function init(){
  const root=document.querySelector('[data-compass-root]');
  const scene=document.querySelector('[data-compass-scene]');
  const originalDoor=document.querySelector('[data-compass-object="mirrorland"]');
  if(!root||!scene)return;

  document.querySelectorAll('[data-compass-room][data-label="H-Earth"]').forEach(el=>{el.dataset.route=H_EARTH;el.setAttribute('href',H_EARTH)});

  if(originalDoor){originalDoor.style.setProperty('pointer-events','none','important');originalDoor.style.setProperty('opacity','0','important');originalDoor.style.setProperty('font-size','0','important');originalDoor.setAttribute('aria-hidden','true');originalDoor.tabIndex=-1}
  const mirrorHit=document.createElement('button');
  mirrorHit.type='button';mirrorHit.dataset.functionalCloneMirrorlandHit='true';mirrorHit.setAttribute('aria-label','Open Mirrorland');
  Object.assign(mirrorHit.style,{position:'absolute',left:'50%',top:'50%',width:'clamp(104px,18vw,164px)',height:'clamp(164px,29vw,250px)',transform:'translate(-50%,-50%)',zIndex:'2147483000',pointerEvents:'auto',visibility:'visible',touchAction:'manipulation',border:'0',padding:'0',margin:'0',background:'transparent',color:'transparent',fontSize:'0',cursor:'pointer',borderRadius:'48% 48% 18% 18% / 28% 28% 12% 12%',WebkitTapHighlightColor:'transparent'});
  scene.append(mirrorHit);
  const reveal=event=>{if(event.type==='pointerup'&&event.button!=null&&event.button!==0)return;const controller=globalThis.DGB_COMPASS_CONTROLLER;if(!controller?.requestMirrorlandReveal)return;const frame=controller.getFrameState?.();const mode=frame?.state||root.dataset.compassMode||'';if(!['CONSTELLATION','CLUSTER_OPEN','ROOM_SELECTED'].includes(mode))return;event.preventDefault();event.stopImmediatePropagation();controller.requestMirrorlandReveal()};
  mirrorHit.addEventListener('pointerup',reveal,true);mirrorHit.addEventListener('click',reveal,true);

  // Exactly one cardinal label. It occupies the renderer-owned foreground star center.
  const label=document.createElement('div');
  label.dataset.functionalCloneCardinalLabel='true';label.setAttribute('aria-hidden','true');
  Object.assign(label.style,{position:'absolute',zIndex:'12',pointerEvents:'none',transform:'translate(-50%,-50%)',minWidth:'6rem',maxWidth:'8.4rem',padding:'.31rem .46rem',border:'1px solid rgba(243,217,139,.58)',borderRadius:'999px',background:'rgba(3,9,16,.72)',boxShadow:'0 4px 18px rgba(0,0,0,.34)',color:'rgba(255,248,224,.98)',textAlign:'center',font:'850 .62rem/1.05 Inter,ui-sans-serif,system-ui,sans-serif',letterSpacing:'.05em',textTransform:'uppercase',textShadow:'0 1px 5px rgba(0,0,0,.95)',backdropFilter:'blur(4px)'});
  scene.append(label);

  function lockedId(){
    const primary=scene.querySelector('[data-compass-cardinal][data-primary="true"]');
    return String(primary?.dataset.cardinalId||root.dataset.readableCardinal||root.dataset.renderedForegroundCardinal||'').toLowerCase();
  }
  function syncLabel(){
    if(String(root.dataset.compassMode||'')!=='CONSTELLATION'){label.hidden=true;return}
    const id=lockedId();const copy=CARDINAL_COPY[id];
    const el=id?scene.querySelector(`[data-compass-cardinal][data-cardinal-id="${CSS.escape(id)}"]`):null;
    if(!copy||!el){label.hidden=true;return}
    const x=Number.parseFloat(el.style.left),y=Number.parseFloat(el.style.top);
    if(!Number.isFinite(x)||!Number.isFinite(y)){label.hidden=true;return}
    label.innerHTML=`<strong style="display:block">${copy[0]}</strong><span style="display:block;margin-top:.08rem;font-size:.52rem;opacity:.72">${copy[1]}</span>`;
    label.style.left=`${x}px`;label.style.top=`${y}px`;label.hidden=false;
  }

  const audit=document.createElement('output');audit.dataset.functionalCloneAudit='true';
  Object.assign(audit.style,{position:'absolute',right:'12px',top:'12px',zIndex:'2147483001',padding:'7px 9px',borderRadius:'999px',border:'1px solid rgba(150,224,188,.32)',background:'rgba(3,10,14,.78)',color:'rgba(190,242,211,.92)',font:'700 .58rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace',letterSpacing:'.035em',pointerEvents:'none'});scene.append(audit);
  function syncAudit(){const cardinals=document.querySelectorAll('[data-compass-cardinal][data-cardinal-id]').length;const rooms=document.querySelectorAll('[data-compass-room-declarations] [data-compass-room][data-room-id]').length;const hEarth=document.querySelector('[data-compass-room][data-label="H-Earth"]');const controller=Boolean(globalThis.DGB_COMPASS_CONTROLLER?.requestMirrorlandReveal);const pass=cardinals===4&&rooms===19&&label.isConnected&&mirrorHit.isConnected&&controller&&hEarth?.dataset.route===H_EARTH;audit.textContent=pass?'CLONE CORE AUDIT · 4/4 · 19/19 · ONE FRONT LABEL · MIRROR HIT · H-EARTH':'CLONE CORE AUDIT · CHECKING';audit.dataset.pass=String(pass);root.dataset.functionalCloneAudit=pass?'PASS_MOUNTED':'PENDING'}

  const observer=new MutationObserver(()=>queueMicrotask(()=>{syncLabel();syncAudit()}));
  observer.observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-readable-cardinal','data-rendered-foreground-cardinal','data-orbit-focus','data-orbit-preview-focus']});
  document.querySelectorAll('[data-compass-cardinal]').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['data-primary','style']}));
  let frames=0;const tick=()=>{syncLabel();if(frames<180){syncAudit();frames++}requestAnimationFrame(tick)};requestAnimationFrame(tick);
  globalThis.DGB_COMPASS_FUNCTIONAL_CLONE_REPAIR=Object.freeze({contract:CONTRACT,oneForegroundCardinalLabel:true,labelOnStar:true,mirrorlandHit:true,hEarth23949:true,productionUntouched:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
