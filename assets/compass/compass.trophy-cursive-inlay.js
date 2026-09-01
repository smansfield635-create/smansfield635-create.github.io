(()=>{
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function mount(){
  const field=document.querySelector('[data-award-trophy]');
  const trophy=field?.querySelector('canvas');
  if(!field||!trophy||field.querySelector('[data-trophy-cursive-inlay]'))return;
  const cs=getComputedStyle(field);if(cs.position==='static')field.style.position='relative';
  trophy.style.transformOrigin='50% 56%';
  trophy.style.transform='scale(1.08)';
  const overlay=document.createElement('canvas');
  overlay.setAttribute('data-trophy-cursive-inlay','true');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'3',transform:'scale(1.08)',transformOrigin:'50% 56%'});
  field.append(overlay);
  const ctx=overlay.getContext('2d');
  let w=0,h=0,dpr=1,raf=0;
  const resize=()=>{const r=field.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=Math.max(1,Math.round(r.width));h=Math.max(1,Math.round(r.height));overlay.width=Math.round(w*dpr);overlay.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
  const draw=t=>{
    ctx.clearRect(0,0,w,h);
    const pulse=reduce.matches?0:(Math.sin(t*.0032)+1)*.5;
    const alpha=.82+pulse*.18;
    const glow=4+pulse*6;
    const fontSize=Math.max(13,Math.min(23,w*.055));
    ctx.save();
    ctx.translate(w*.5,h*.786);
    ctx.scale(1+pulse*.018,1+pulse*.018);
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font=`600 ${fontSize}px "Brush Script MT","Segoe Script","Snell Roundhand",cursive`;
    ctx.lineWidth=Math.max(1,fontSize*.07);
    ctx.strokeStyle=`rgba(82,45,5,${.68*alpha})`;
    ctx.shadowColor=`rgba(255,193,74,${.72*alpha})`;
    ctx.shadowBlur=glow;
    ctx.fillStyle=`rgba(255,206,105,${alpha})`;
    ctx.strokeText('Diamond Gate Bridge?',0,0,w*.46);
    ctx.fillText('Diamond Gate Bridge?',0,0,w*.46);
    ctx.restore();
    if(!reduce.matches)raf=requestAnimationFrame(draw);
  };
  const ro=new ResizeObserver(resize);ro.observe(field);resize();draw(performance.now());
  globalThis.DGB_TROPHY_CURSIVE_INLAY=Object.freeze({mounted:true,text:'Diamond Gate Bridge?',scale:1.08,pulse:!reduce.matches,dispose(){cancelAnimationFrame(raf);ro.disconnect();overlay.remove();trophy.style.removeProperty('transform');trophy.style.removeProperty('transform-origin')}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();