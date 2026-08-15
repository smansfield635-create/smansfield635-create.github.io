import { clamp, wrap } from './math.mjs';

export class NavigationController {
  constructor(canvas, api) {
    this.canvas=canvas; this.api=api; this.pointers=new Map(); this.samples=[];
    this.lastCentroid=null; this.lastDistance=0; this.dragDistance=0; this.downAt=0;
    this.bind();
  }
  bind(){
    this.onDown=e=>{
      e.preventDefault();
      this.canvas.setPointerCapture?.(e.pointerId);
      this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()});
      this.samples=[]; this.dragDistance=0; this.downAt=performance.now();
      this.resetBaselines(); this.api.inputMode(e.pointerType||'pointer');
    };
    this.onMove=e=>{
      if(!this.pointers.has(e.pointerId))return;
      e.preventDefault();
      this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()});
      this.move();
    };
    this.onUp=e=>{
      if(!this.pointers.has(e.pointerId))return;
      e.preventDefault();
      const wasCount=this.pointers.size;
      this.pointers.delete(e.pointerId);
      if(this.pointers.size===0)this.release(e,wasCount);
      this.resetBaselines();
    };
    this.onWheel=e=>{e.preventDefault();this.api.inputMode('wheel');this.api.zoom(clamp(e.deltaY*.008,-1.2,1.2));};
    this.onKey=e=>{
      if(e.target.matches('button,[tabindex]')&&e.key==='Enter')return;
      this.api.inputMode('keyboard');
      if(e.key==='ArrowLeft'){e.preventDefault();this.api.stepModel(-1);}
      else if(e.key==='ArrowRight'){e.preventDefault();this.api.stepModel(1);}
      else if(e.key==='ArrowUp'&&e.shiftKey){e.preventDefault();this.api.travelStage(1);}
      else if(e.key==='ArrowDown'&&e.shiftKey){e.preventDefault();this.api.travelStage(-1);}
      else if(e.key==='Enter'){e.preventDefault();this.api.focus();}
      else if(e.key==='Escape'){e.preventDefault();this.api.restore();}
      else if(['1','2','3'].includes(e.key)){e.preventDefault();this.api.emphasize(['practical','engineering','evidence'][Number(e.key)-1]);}
    };
    this.canvas.addEventListener('pointerdown',this.onDown);
    this.canvas.addEventListener('pointermove',this.onMove,{passive:false});
    this.canvas.addEventListener('pointerup',this.onUp);
    this.canvas.addEventListener('pointercancel',this.onUp);
    this.canvas.addEventListener('wheel',this.onWheel,{passive:false});
    document.addEventListener('keydown',this.onKey);
  }
  resetBaselines(){
    const pointers=[...this.pointers.values()];
    if(pointers.length)this.lastCentroid={x:pointers.reduce((sum,p)=>sum+p.x,0)/pointers.length,y:pointers.reduce((sum,p)=>sum+p.y,0)/pointers.length};
    if(pointers.length>=2)this.lastDistance=Math.hypot(pointers[1].x-pointers[0].x,pointers[1].y-pointers[0].y);
  }
  move(){
    const pointers=[...this.pointers.values()];
    const now=performance.now();
    const centroid={x:pointers.reduce((sum,p)=>sum+p.x,0)/pointers.length,y:pointers.reduce((sum,p)=>sum+p.y,0)/pointers.length};
    if(!this.lastCentroid){this.lastCentroid=centroid;return;}
    const dx=centroid.x-this.lastCentroid.x;
    const dy=centroid.y-this.lastCentroid.y;
    this.dragDistance+=Math.hypot(dx,dy);
    if(pointers.length===1){
      this.api.orbit(-dx*.008,-dy*.006);
      this.samples.push({dx,dy,t:now});
      this.samples=this.samples.filter(sample=>now-sample.t<140);
    } else {
      const distance=Math.hypot(pointers[1].x-pointers[0].x,pointers[1].y-pointers[0].y);
      const pinch=distance-this.lastDistance;
      if(Math.abs(pinch)>Math.abs(dy)*.6)this.api.zoom(-pinch*.012);
      else if(Math.abs(dy)>8)this.api.previewTravel(-dy*.006);
      this.lastDistance=distance;
    }
    this.lastCentroid=centroid;
  }
  release(event,wasCount){
    const elapsed=performance.now()-this.downAt;
    if(wasCount>=2){this.api.commitTravel();return;}
    if(this.dragDistance<10&&elapsed<420){
      const picked=this.api.pick(event.clientX,event.clientY);
      if(picked)this.api.selectOrFocus(picked.index);
      else this.api.focus();
      return;
    }
    const recent=this.samples.slice(-5);
    const sx=recent.reduce((sum,sample)=>sum+sample.dx,0);
    const dt=Math.max(1,(recent.at(-1)?.t||0)-(recent[0]?.t||0));
    const velocity=sx/dt;
    if(Math.abs(velocity)>.35&&this.dragDistance>42)this.api.flick(velocity>0?-1:1,Math.min(2.4,Math.abs(velocity)*2));
    else this.api.settleNearest();
  }
  destroy(){
    this.canvas.removeEventListener('pointerdown',this.onDown);
    this.canvas.removeEventListener('pointermove',this.onMove);
    this.canvas.removeEventListener('pointerup',this.onUp);
    this.canvas.removeEventListener('pointercancel',this.onUp);
    this.canvas.removeEventListener('wheel',this.onWheel);
    document.removeEventListener('keydown',this.onKey);
  }
}

export const normalizedModelIndex = (value,length)=>wrap(Math.round(value),length);
