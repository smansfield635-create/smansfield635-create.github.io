/* TNT — /assets/hel-render.js
   HEL RENDER (REWASH/REWRITE)
   PURPOSE: draw silhouette hull + wedge head + tail fin (no simulation)
   BUILD: HEL_RENDER_L1_REWASH
*/
(function(){
"use strict";
window.HEL_RENDER = {
  version:"HEL_RENDER_L1_REWASH",
  drawDragon(ctx, frame, style){
    const L=frame.L, R=frame.R;
    if(!L || !R || L.length<3 || R.length<3) return;

    // body hull
    ctx.beginPath();
    ctx.moveTo(L[0].x, L[0].y);
    for(let i=1;i<L.length;i++) ctx.lineTo(L[i].x, L[i].y);
    for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i].x, R[i].y);
    ctx.closePath();

    ctx.fillStyle="rgba(0,0,0,0.32)";
    ctx.fill();

    ctx.fillStyle=style.fill;
    ctx.fill();

    ctx.strokeStyle="rgba(0,0,0,0.72)";
    ctx.lineWidth=style.strokeW;
    ctx.lineJoin="round";
    ctx.stroke();

    // head wedge
    const h=frame.head;
    if(h){
      ctx.fillStyle="rgba(0,0,0,0.62)";
      ctx.beginPath();
      ctx.moveTo(h.tip.x,h.tip.y);
      ctx.lineTo(h.left.x,h.left.y);
      ctx.lineTo(h.right.x,h.right.y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle="rgba(0,0,0,0.55)";
      ctx.beginPath();
      ctx.ellipse(h.cap.x,h.cap.y,h.cap.rx,h.cap.ry,0,0,Math.PI*2);
      ctx.fill();
    }

    // tail fin
    const tf=frame.tailFin;
    if(tf){
      ctx.fillStyle="rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.moveTo(tf.a.x,tf.a.y);
      ctx.lineTo(tf.b.x,tf.b.y);
      ctx.lineTo(tf.c.x,tf.c.y);
      ctx.closePath();
      ctx.fill();
    }
  }
};
})();
