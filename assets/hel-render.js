/* TNT — /assets/hel-render.js
   BUILD: HEL_RENDER_BASE_LOCKED_v1
   PURPOSE: LOCKED body render + calls DRAGON_CORE + DRAGON_SKIN.
   RULE: Never put dragon art here; this is stable wiring + safety fallback.
*/
(function(){
"use strict";
window.HEL_RENDER = {
  version:"HEL_RENDER_BASE_LOCKED_v1",
  drawDragon(ctx, frame, style){
    if(!ctx||!frame) return;

    const DC = window.DRAGON_CORE;
    const DS = window.DRAGON_SKIN;

    const fill = (DC && DC.palette && DC.palette[style.lane]) ? DC.palette[style.lane].body : "rgba(255,255,255,0.85)";

    // BODY (locked)
    const L=frame.L, R=frame.R;
    ctx.beginPath();
    ctx.moveTo(L[0].x,L[0].y);
    for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x,L[i].y);
    for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x,R[i].y);
    ctx.closePath();
    ctx.fillStyle=fill;
    ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,0.28)";
    ctx.lineWidth=2*frame.meta.DPR;
    ctx.lineJoin="round";
    ctx.lineCap="round";
    ctx.stroke();

    // DRAGON (locked+unlocked split; never black-screen)
    try{
      if(DC && typeof DC.drawLocked === "function") DC.drawLocked(ctx, frame, style);
      if(DS && typeof DS.draw === "function") DS.draw(ctx, frame, style);
    }catch(e){
      ctx.save();
      ctx.fillStyle="rgba(255,255,255,0.30)";
      ctx.font=(14*frame.meta.DPR)+"px system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
      ctx.fillText("DRAGON_SKIN ERROR", 12*frame.meta.DPR, frame.meta.H-14*frame.meta.DPR);
      ctx.restore();
      try{ console.error(e); }catch(_){}
    }
  }
};
})();
