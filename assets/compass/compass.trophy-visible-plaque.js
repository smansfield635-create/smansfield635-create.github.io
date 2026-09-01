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
    bottom:'10.9%',
    transform:'translateX(-50%)',
    zIndex:'20',
    width:'clamp(100px, 20%, 150px)',
    minHeight:'30px',
    boxSizing:'border-box',
    padding:'4px 8px 3px',
    border:'1px solid rgba(154,111,42,.92)',
    borderRadius:'2px',
    background:'linear-gradient(180deg,rgba(128,84,26,.96),rgba(72,42,12,.98))',
    boxShadow:'0 1px 0 rgba(34,19,6,.92), inset 0 1px 0 rgba(218,169,70,.32)',
    color:'#24170a',
    fontFamily:'Georgia, Times New Roman, serif',
    fontWeight:'700',
    textAlign:'center',
    letterSpacing:'.09em',
    lineHeight:'1',
    textShadow:'0 1px 0 rgba(214,163,66,.22)',
    pointerEvents:'none',
    userSelect:'none'
  });
  plaque.innerHTML='<span style="display:block;font-size:clamp(8px,.78vw,10px)">DIAMOND GATE</span><span style="display:block;margin-top:2px;font-size:clamp(8px,.78vw,10px)">BRIDGE ?</span>';
  field.append(plaque);
  canvas.dataset.trophyVisiblePlaque='DIAMOND GATE / BRIDGE ?';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();
