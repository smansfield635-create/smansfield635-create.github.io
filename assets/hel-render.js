/* TNT — /assets/hel-render.js
   HEL_RENDER_BASE_v1
   PURPOSE: stable body renderer + call-out hook to DRAGON_UI (only place you iterate)
   RULE: BODY DRAW STAYS STABLE. ONLY DRAGON_UI MODULE SHOULD CHANGE.
*/
(function(){
"use strict";

function evenoddFill(ctx){
  try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }
}

window.HEL_RENDER = {
  version:"HEL_RENDER_BASE_v1",

  drawDragon(ctx, frame, style){
    if(!ctx || !frame) return;

    style = style || {};
    const fill = style.fill || "rgba(255,255,255,0.9)";
    const strokeW = Number.isFinite(style.strokeW) ? style.strokeW : 2;

    const L=frame.L, R=frame.R;
    if(!L || !R || L.length<3 || R.length<3) return;

    ctx.save();

    /* BODY HULL */
    ctx.beginPath();
    ctx.moveTo(L[0].x, L[0].y);
    for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x, L[i].y);
    for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x, R[i].y);
    ctx.closePath();

    ctx.fillStyle="rgba(0,0,0,0.22)";
    evenoddFill(ctx);

    ctx.fillStyle=fill;
    evenoddFill(ctx);

    ctx.strokeStyle="rgba(0,0,0,0.72)";
    ctx.lineWidth=strokeW;
    ctx.lineJoin="round";
    ctx.lineCap="round";
    ctx.stroke();

    /* DRAGON UI MODULE (ONLY ITERATION TARGET) */
    if(window.DRAGON_UI && typeof window.DRAGON_UI.draw === "function"){
      window.DRAGON_UI.draw(ctx, frame, {strokeW:strokeW});
    }

    ctx.restore();
  }
};

})();
