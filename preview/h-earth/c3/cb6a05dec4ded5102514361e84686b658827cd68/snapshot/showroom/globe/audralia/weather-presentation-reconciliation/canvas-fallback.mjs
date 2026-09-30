const clamp=(value,minimum,maximum)=>Math.min(maximum,Math.max(minimum,value));
const freeze=value=>Object.freeze(value);

export function createAudraliaCanvasFallback({canvas,focusButton}={}){
  if(!(canvas instanceof HTMLCanvasElement))throw new Error('AUDRALIA_CANVAS_FALLBACK_MISSING_CANVAS');
  const context=canvas.getContext('2d',{alpha:false});
  if(!context)throw new Error('AUDRALIA_CANVAS_FALLBACK_UNAVAILABLE');

  const state={yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4,renderedFrames:0};
  const scale=()=>state.distance<900?'LOCAL':state.distance<2200?'REGION':state.distance<4200?'CONTINENT':'PLANETARY';
  const parent=canvas.parentElement;
  if(parent instanceof HTMLElement&&getComputedStyle(parent).position==='static')parent.style.position='relative';

  const badge=document.createElement('p');
  badge.textContent='Audralia · reduced graphics map';
  badge.dataset.audraliaGraphicsFallback='true';
  Object.assign(badge.style,{position:'absolute',left:'1rem',bottom:'1rem',zIndex:'5',margin:'0',padding:'.42rem .62rem',border:'1px solid rgba(191,228,255,.32)',borderRadius:'.5rem',background:'rgba(3,16,36,.68)',color:'#d9f1ff',font:'600 12px/1.2 system-ui,sans-serif',letterSpacing:'.04em',pointerEvents:'none'});
  parent?.appendChild(badge);

  const polygon=(points,cx,cy,radius,offsetX,offsetY,fill,stroke)=>{
    context.beginPath();
    points.forEach((point,index)=>{
      const x=cx+(point[0]+offsetX)*radius;
      const y=cy+(point[1]+offsetY)*radius;
      if(index===0)context.moveTo(x,y);else context.lineTo(x,y);
    });
    context.closePath();
    context.fillStyle=fill;
    context.fill();
    context.strokeStyle=stroke;
    context.lineWidth=Math.max(1,radius*.008);
    context.stroke();
  };

  function resize(){
    const rect=canvas.getBoundingClientRect();
    const dpr=Math.min(2,window.devicePixelRatio||1);
    const width=Math.max(1,Math.round(rect.width*dpr));
    const height=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    return {width,height};
  }

  function render(){
    state.pitch=clamp(state.pitch,.46,1.49);
    state.distance=clamp(state.distance,95,5600);
    const {width,height}=resize(),cx=width*.5,cy=height*.52;
    const radius=Math.min(width,height)*(.27+(5600-state.distance)/5505*.115);
    const dx=Math.sin(state.yaw)*.12,dy=Math.sin(state.pitch-.88)*.08;

    const sky=context.createLinearGradient(0,0,0,height);
    sky.addColorStop(0,'#071c3b');sky.addColorStop(.5,'#0a4974');sky.addColorStop(1,'#05132b');
    context.fillStyle=sky;context.fillRect(0,0,width,height);
    for(let index=0;index<36;index++){
      const x=(Math.sin(index*97.31+state.yaw*3)*.5+.5)*width;
      const y=(Math.cos(index*41.73+state.pitch*2)*.5+.5)*height*.72;
      context.fillStyle='rgba(220,241,255,'+(.14+(index%5)*.035).toFixed(3)+')';
      context.fillRect(x,y,Math.max(1,width/900),Math.max(1,width/900));
    }

    context.save();context.beginPath();context.arc(cx,cy,radius,0,Math.PI*2);context.clip();
    const ocean=context.createRadialGradient(cx-radius*.25,cy-radius*.35,radius*.12,cx,cy,radius*1.08);
    ocean.addColorStop(0,'#278dc1');ocean.addColorStop(.58,'#0d4e83');ocean.addColorStop(1,'#062b59');
    context.fillStyle=ocean;context.fillRect(cx-radius,cy-radius,radius*2,radius*2);
    polygon([[-.76,-.06],[-.64,-.27],[-.46,-.34],[-.31,-.22],[-.35,-.06],[-.48,.03],[-.60,.15],[-.73,.10]],cx,cy,radius,dx-.07,dy,'#557b57','rgba(199,228,190,.34)');
    polygon([[-.24,-.08],[-.17,-.18],[-.04,-.20],[.11,-.13],[.18,-.03],[.13,.10],[.03,.17],[-.09,.15],[-.20,.06]],cx,cy,radius,dx+.03,dy,'#a58551','rgba(255,234,179,.55)');
    polygon([[.43,-.39],[.51,-.43],[.59,-.36],[.54,-.27],[.45,-.29]],cx,cy,radius,dx-.02,dy,'#719463','rgba(216,239,203,.38)');
    context.globalAlpha=.28;context.strokeStyle='#d9f4ff';context.lineWidth=Math.max(1,radius*.012);
    for(let index=0;index<4;index++){context.beginPath();context.ellipse(cx,cy+(index-1.5)*radius*.26,radius*.98,Math.max(3,radius*(.28-Math.abs(index-1.5)*.045)),0,0,Math.PI*2);context.stroke();}
    context.globalAlpha=1;
    const markerX=cx+(dx+.03)*radius,markerY=cy+(dy-.025)*radius;
    context.beginPath();context.arc(markerX,markerY,Math.max(4,radius*.035),0,Math.PI*2);context.fillStyle='#fff6bf';context.fill();context.strokeStyle='rgba(255,255,255,.9)';context.stroke();
    context.font=Math.max(12,radius*.085)+'px system-ui,sans-serif';context.fillStyle='#fff5d0';context.fillText('Gratitude',markerX+radius*.07,markerY-radius*.06);
    context.font=Math.max(11,radius*.06)+'px system-ui,sans-serif';context.fillStyle='rgba(235,247,255,.9)';context.fillText('Australia',cx+(dx-.03)*radius,cy+(dy+.31)*radius);
    context.restore();

    const rim=context.createRadialGradient(cx-radius*.2,cy-radius*.35,radius*.65,cx,cy,radius*1.12);
    rim.addColorStop(.78,'rgba(157,225,255,0)');rim.addColorStop(1,'rgba(166,226,255,.65)');
    context.fillStyle=rim;context.beginPath();context.arc(cx,cy,radius,0,Math.PI*2);context.fill();
    context.fillStyle='rgba(225,244,255,.92)';context.font='600 '+Math.max(13,Math.round(width*.014))+'px system-ui,sans-serif';context.fillText('AUSTRALIA · AUDRALIA ENTRY',Math.max(18,width*.04),Math.max(28,height*.07));
    context.fillStyle='rgba(202,230,245,.75)';context.font='500 '+Math.max(11,Math.round(width*.0105))+'px system-ui,sans-serif';context.fillText('Drag to look · wheel or pinch to travel · reduced graphics',Math.max(18,width*.04),Math.max(47,height*.07+19));
    state.renderedFrames++;
  }

  const orbit=(x,y)=>{state.yaw+=clamp(Number(x)||0,-80,80)*.006;state.pitch+=clamp(Number(y)||0,-80,80)*.004;render();};
  const zoom=value=>{state.distance*=Math.exp(clamp(Number(value)||0,-900,900)*.00115);render();};
  const panScreen=(x,y)=>{state.targetU=clamp(state.targetU+(Number(x)||0)*4,-2180,2130);state.targetV=clamp(state.targetV+(Number(y)||0)*4,-2310,320);state.yaw+=(Number(x)||0)*.0016;render();};
  const focusGratitude=()=>{Object.assign(state,{yaw:-.62,pitch:.88,distance:720,targetU:0,targetV:-4});render();};

  const pointers=new Map();
  canvas.tabIndex=0;canvas.dataset.audraliaGraphicsFallback='true';
  canvas.addEventListener('pointerdown',event=>{canvas.setPointerCapture?.(event.pointerId);pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});});
  canvas.addEventListener('pointermove',event=>{const prior=pointers.get(event.pointerId);if(!prior)return;const next={x:event.clientX,y:event.clientY};pointers.set(event.pointerId,next);if(pointers.size===1)orbit(next.x-prior.x,next.y-prior.y);});
  const release=event=>pointers.delete(event.pointerId);
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('wheel',event=>{event.preventDefault();zoom(event.deltaY);},{passive:false});
  canvas.addEventListener('dblclick',focusGratitude);focusButton?.addEventListener('click',focusGratitude);
  window.addEventListener('keydown',event=>{const key=event.key.toLowerCase();if(['w','arrowup'].includes(key))panScreen(0,-12);else if(['s','arrowdown'].includes(key))panScreen(0,12);else if(['a','arrowleft'].includes(key))panScreen(12,0);else if(['d','arrowright'].includes(key))panScreen(-12,0);else return;event.preventDefault();});
  window.addEventListener('resize',render,{passive:true});

  render();
  return freeze({mode:'CANVAS_2D_FALLBACK',state,render,orbit,zoom,zoomByFactor:factor=>{state.distance/=clamp(Number(factor)||1,.72,1.38);render();},panScreen,focusGratitude,fitWorld:focusGratitude,getViewScale:scale,getSnapshot:()=>freeze({...state,viewScale:scale(),fallbackActive:true}),getCameraSafety:()=>freeze({distanceSafe:state.distance>=95&&state.distance<=5600,continuousScaleRecognized:true,fallbackActive:true})});
}
