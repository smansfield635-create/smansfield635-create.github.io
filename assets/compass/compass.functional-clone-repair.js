(()=>{
'use strict';
const CONTRACT='DGB_COMPASS_FUNCTIONAL_CLONE_STAGE1_REPAIR_v2';
const H_EARTH='https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/0c6069f30e494be2f84d2653f40e374178251c77/showroom/globe/h-earth/index.html';
const CARDINAL_COPY=Object.freeze({
  north:['Orientation','North Star'],
  east:['Worlds','East Star'],
  south:['Instruments','South Star'],
  west:['Frontier','West Star']
});
function init(){
  const root=document.querySelector('[data-compass-root]');
  const scene=document.querySelector('[data-compass-scene]');
  const originalDoor=document.querySelector('[data-compass-object="mirrorland"]');
  if(!root||!scene)return;
  document.querySelectorAll('[data-compass-room][data-label="H-Earth"]').forEach(el=>{
    el.dataset.route=H_EARTH;
    el.setAttribute('href',H_EARTH);
  });
  if(originalDoor){
    originalDoor.style.setProperty('pointer-events','none','important');
    originalDoor.style.setProperty('opacity','0','important');
    originalDoor.style.setProperty('font-size','0','important');
    originalDoor.setAttribute('aria-hidden','true');
    originalDoor.tabIndex=-1;
  }
  const mirrorHit=document.createElement('button');
  mirrorHit.type='button';
  mirrorHit.dataset.functionalCloneMirrorlandHit='true';
  mirrorHit.setAttribute('aria-label','Open Mirrorland');
  Object.assign(mirrorHit.style,{
    position:'absolute',left:'50%',top:'50%',width:'clamp(104px,18vw,164px)',height:'clamp(164px,29vw,250px)',
    transform:'translate(-50%,-50%)',zIndex:'2147483000',pointerEvents:'auto',visibility:'visible',touchAction:'manipulation',
    border:'0',padding:'0',margin:'0',background:'transparent',color:'transparent',fontSize:'0',cursor:'pointer',
    borderRadius:'48% 48% 18% 18% / 28% 28% 12% 12%',WebkitTapHighlightColor:'transparent'
  });
  scene.append(mirrorHit);
  const reveal=event=>{
    if(event.type==='pointerup'&&event.button!=null&&event.button!==0)return;
    const controller=globalThis.DGB_COMPASS_CONTROLLER;
    if(!controller?.requestMirrorlandReveal)return;
    const frame=controller.getFrameState?.();
    const mode=frame?.state||root.dataset.compassMode||'';
    if(!['CONSTELLATION','CLUSTER_OPEN','ROOM_SELECTED'].includes(mode))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    controller.requestMirrorlandReveal();
  };
  mirrorHit.addEventListener('pointerup',reveal,true);
  mirrorHit.addEventListener('click',reveal,true);
  const labelLayer=document.createElement('div');
  labelLayer.dataset.functionalCloneCardinalLabels='true';
  Object.assign(labelLayer.style,{position:'absolute',inset:'0',zIndex:'12',pointerEvents:'none',overflow:'hidden'});
  scene.append(labelLayer);
  const labels=new Map();
  Object.entries(CARDINAL_COPY).forEach(([id,[title,direction]])=>{
    const node=document.createElement('div');
    node.dataset.cardinalLabel=id;
    node.setAttribute('aria-hidden','true');
    node.innerHTML=`<strong>${title}</strong><span>${direction}</span>`;
    Object.assign(node.style,{
      position:'absolute',transform:'translate(-50%,0)',minWidth:'6.4rem',maxWidth:'9rem',padding:'.34rem .52rem',
      border:'1px solid rgba(225,232,238,.28)',borderRadius:'999px',background:'rgba(4,10,18,.84)',
      boxShadow:'0 8px 24px rgba(0,0,0,.38)',color:'rgba(239,244,247,.78)',textAlign:'center',
      font:'750 .64rem/1.08 Inter,ui-sans-serif,system-ui,sans-serif',letterSpacing:'.045em',textTransform:'uppercase',
      textShadow:'0 1px 5px rgba(0,0,0,.92)',transition:'opacity .16s ease,filter .16s ease,border-color .16s ease',opacity:'.64'
    });
    node.querySelector('strong').style.display='block';
    Object.assign(node.querySelector('span').style,{display:'block',marginTop:'.12rem',fontSize:'.55rem',opacity:'.68'});
    labelLayer.append(node);labels.set(id,node);
  });
  function syncLabels(){
    const mode=String(root.dataset.compassMode||'');
    labelLayer.hidden=mode!=='CONSTELLATION';
    if(labelLayer.hidden)return;
    const sceneRect=scene.getBoundingClientRect();
    document.querySelectorAll('[data-compass-cardinal][data-cardinal-id]').forEach(el=>{
      const id=String(el.dataset.cardinalId||'').toLowerCase();
      const node=labels.get(id);if(!node)return;
      const rect=el.getBoundingClientRect();
      if(rect.width<=0||rect.height<=0){node.hidden=true;return;}
      node.hidden=false;
      node.style.left=`${rect.left-sceneRect.left+rect.width/2}px`;
      node.style.top=`${rect.bottom-sceneRect.top+4}px`;
      const primary=el.dataset.primary==='true'||root.dataset.renderedForegroundCardinal===id||root.dataset.readableCardinal===id;
      node.style.opacity=primary?'1':'.58';
      node.style.filter=primary?'brightness(1.14) saturate(1.08)':'brightness(.88)';
      node.style.borderColor=primary?'rgba(243,217,139,.62)':'rgba(225,232,238,.24)';
      node.style.color=primary?'rgba(255,248,224,.98)':'rgba(239,244,247,.72)';
    });
  }
  const audit=document.createElement('output');
  audit.dataset.functionalCloneAudit='true';
  Object.assign(audit.style,{position:'absolute',right:'12px',top:'12px',zIndex:'2147483001',padding:'7px 9px',borderRadius:'999px',
    border:'1px solid rgba(150,224,188,.32)',background:'rgba(3,10,14,.78)',color:'rgba(190,242,211,.92)',
    font:'700 .58rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace',letterSpacing:'.035em',pointerEvents:'none'});
  scene.append(audit);
  function syncAudit(){
    const cardinals=document.querySelectorAll('[data-compass-cardinal][data-cardinal-id]').length;
    const rooms=document.querySelectorAll('[data-compass-room-declarations] [data-compass-room][data-room-id]').length;
    const hEarth=document.querySelector('[data-compass-room][data-label="H-Earth"]');
    const controller=Boolean(globalThis.DGB_COMPASS_CONTROLLER?.requestMirrorlandReveal);
    const pass=cardinals===4&&rooms===19&&labels.size===4&&mirrorHit.isConnected&&controller&&hEarth?.dataset.route===H_EARTH;
    audit.textContent=pass?'CLONE CORE AUDIT · 4/4 · 19/19 · MIRROR HIT · H-EARTH':'CLONE CORE AUDIT · CHECKING';
    audit.dataset.pass=String(pass);
    root.dataset.functionalCloneAudit=pass?'PASS_MOUNTED':'PENDING';
  }
  const observer=new MutationObserver(()=>queueMicrotask(()=>{syncLabels();syncAudit();}));
  observer.observe(root,{attributes:true,attributeFilter:['data-compass-mode','data-readable-cardinal','data-rendered-foreground-cardinal','data-orbit-focus','data-orbit-preview-focus']});
  document.querySelectorAll('[data-compass-cardinal]').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['data-primary','style']}));
  let frames=0;
  const tick=()=>{syncLabels();if(frames<180){syncAudit();frames++;}requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
  globalThis.DGB_COMPASS_FUNCTIONAL_CLONE_REPAIR=Object.freeze({contract:CONTRACT,cardinalLabels:4,mirrorlandHit:true,hEarth23949:true,productionUntouched:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
