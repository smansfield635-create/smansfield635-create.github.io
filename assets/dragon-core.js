/* TNT — /assets/dragon-core.js
   BUILD: DRAGON_CORE_LOCKED_v1
   PURPOSE: LOCKED dragon layer (things that should not change every round).
   RULE: Only add stable/permanent learnings here. No iteration tweaks.
*/
(function(){
"use strict";
if(window.DRAGON_CORE) return;

function evenoddFill(ctx){ try{ctx.fill("evenodd");}catch(e){ctx.fill();} }
function clipToBody(ctx,L,R){
  ctx.beginPath();
  ctx.moveTo(L[0].x,L[0].y);
  for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
  for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
  ctx.closePath();
  ctx.clip();
}
function drawHexOutline(ctx,cx,cy,r,rotRad){
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a=rotRad+(Math.PI/3)*i;
    const x=cx+Math.cos(a)*r;
    const y=cy+Math.sin(a)*r;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  ctx.stroke();
}

window.DRAGON_CORE = {
  version:"DRAGON_CORE_LOCKED_v1",

  palette:{
    0:{ body:"rgba(46,213,115,0.92)", rimRGB:"0,0,0", head:"rgba(20,120,70,0.92)", skull:"rgba(0,0,0,0.30)" },
    1:{ body:"rgba(255,59,59,0.90)",  rimRGB:"0,0,0", head:"rgba(160,30,30,0.90)", skull:"rgba(0,0,0,0.30)" }
  },

  lattice:{
    headExcludeU:0.14,
    rimRadius:7.0,
    rimStroke:1.25,
    rimAlpha:0.22,
    rimRotDeg:9,
    stepU:2,
    bands:3,
    bandFracs:[0.35,0.57,0.79]
  },

  drawLocked(ctx, frame, style){
    const L=frame.L, R=frame.R;
    const spine=frame.spine, nArr=frame.n, rad=frame.rad;

    // CLIPPED hollow hex rims (locked concept)
    const lat=this.lattice;
    const headCut = Math.max(0, Math.floor(lat.headExcludeU*(spine.length-1)));

    const rimR = lat.rimRadius*frame.meta.DPR;
    const rimW = lat.rimStroke*frame.meta.DPR;
    const rot  = (lat.rimRotDeg*Math.PI/180);

    ctx.save();
    clipToBody(ctx,L,R);

    ctx.strokeStyle = `rgba(${this.palette[style.lane].rimRGB},${lat.rimAlpha})`;
    ctx.lineWidth = Math.max(1,rimW);
    ctx.lineJoin="round";

    for(let i=headCut+3;i<spine.length-4;i+=lat.stepU){
      const p=spine[i];
      const n=nArr[i];
      const r=rad[i];
      for(let b=0;b<lat.bands;b++){
        const frac=lat.bandFracs[b];
        for(const side of [+1,-1]){
          const cx=p.x + n.x*r*frac*side;
          const cy=p.y + n.y*r*frac*side;
          drawHexOutline(ctx,cx,cy,rimR,rot);
        }
      }
    }

    ctx.restore();
  }
};

})();
