/* TNT — /assets/hel-render.js
   HEL RENDER (REWASH/REWRITE)
   PURPOSE: draw silhouette hull + wedge head + tail fin (no simulation)
   BUILD: HEL_RENDER_L2_FIX_FILLRULE

   FIX:
   - Use EVENODD fill-rule to prevent self-intersection artifacts (the “black triangles”)
   - Add stroke caps for mobile join stability
   - Guard style defaults
*/
(function(){
"use strict";

window.HEL_RENDER = {
  version:"HEL_RENDER_L2_FIX_FILLRULE",

  drawDragon(ctx, frame, style){
    if(!ctx || !frame) return;

    style = style || {};
    const fill = style.fill || "rgba(255,255,255,0.9)";
    const strokeW = Number.isFinite(style.strokeW) ? style.strokeW : 2;

    const L = frame.L, R = frame.R;
    if(!L || !R || L.length < 3 || R.length < 3) return;

    ctx.save();

    /* ===== BODY HULL ===== */
    ctx.beginPath();
    ctx.moveTo(L[0].x, L[0].y);
    for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x, L[i].y);
    for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x, R[i].y);
    ctx.closePath();

    /* Under-shadow (evenodd prevents weird wedges on self-cross) */
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }

    /* Main fill */
    ctx.fillStyle = fill;
    try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }

    /* Stroke */
    ctx.strokeStyle = "rgba(0,0,0,0.72)";
    ctx.lineWidth = strokeW;
    ctx.lineJoin = "round";
    ctx.lineCap  = "round";
    ctx.stroke();

    /* ===== HEAD WEDGE ===== */
    const h = frame.head;
    if(h){
      ctx.beginPath();
      ctx.moveTo(h.tip.x,h.tip.y);
      ctx.lineTo(h.left.x,h.left.y);
      ctx.lineTo(h.right.x,h.right.y);
      ctx.closePath();

      ctx.fillStyle = "rgba(0,0,0,0.38)";
      try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }

      /* head cap */
      ctx.fillStyle = "rgba(0,0,0,0.32)";
      ctx.beginPath();
      ctx.ellipse(h.cap.x,h.cap.y,h.cap.rx,h.cap.ry,0,0,Math.PI*2);
      ctx.fill();
    }

    /* ===== TAIL FIN ===== */
    const tf = frame.tailFin;
    if(tf){
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.beginPath();
      ctx.moveTo(tf.a.x,tf.a.y);
      ctx.lineTo(tf.b.x,tf.b.y);
      ctx.lineTo(tf.c.x,tf.c.y);
      ctx.closePath();
      try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }
    }

    ctx.restore();
  }
};

})();
