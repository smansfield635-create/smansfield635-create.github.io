(()=>{
'use strict';
function install(){
  const canvas=document.querySelector('[data-award-trophy] canvas');
  const field=canvas?.closest('[data-award-trophy]')||canvas?.parentElement;
  if(!field||field.querySelector('[data-compass-trophy-visible-plaque]'))return;
  if(getComputedStyle(field).position==='static')field.style.position='relative';
  const plaque=document.createElement('div');
  plaque.dataset.compassTrophyVisiblePlaque='true';
  plaque.setAttribute('aria-label','Diamond Gate Bridge question mark');
  Object.assign(plaque.style,{
    position:'absolute',
    left:'50%',
    bottom:'10.5%',
    transform:'translateX(-50%)',
    zIndex:'20',
    width:'clamp(132px, 28%, 220px)',
    minHeight:'42px',
    boxSizing:'border-box',
    padding:'6px 12px 5px',
    border:'2px solid rgba(255,220,120,.98)',
    borderRadius:'3px',
    background:'linear-gradient(180deg,rgba(216,158,42,.98),rgba(126,72,13,.98))',
    boxShadow:'0 2px 0 rgba(54,28,4,.95), inset 0 1px 0 rgba(255,245,190,.72), 0 0 14px rgba(218,155,44,.28)',
    color:'#211306',
    fontFamily:'Georgia, Times New Roman, serif',
    fontWeight:'800',
    textAlign:'center',
    letterSpacing:'.08em',
    lineHeight:'1.05',
    pointerEvents:'none',
    userSelect:'none'
  });
  plaque.innerHTML='<span style="display:block;font-size:clamp(10px,1.05vw,14px)">DIAMOND GATE</span><span style="display:block;margin-top:3px;font-size:clamp(10px,1.05vw,14px)">BRIDGE ?</span>';
  field.append(plaque);
  canvas.dataset.trophyVisiblePlaque='DIAMOND GATE / BRIDGE ?';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();
