/* TNT — /assets/hel-render.js
   PUBLIC RENDER TERMINAL (NO IP)
   VERSION: HEL_RENDER_v1
*/
(function(){
"use strict";
window.HEL_RENDER = {
  version: "HEL_RENDER_v1",
  drawFrame: function(ctx, frame, palette){
    // body
    const L = frame.hull.L, R = frame.hull.R;
    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    for(let i=1;i<L.length;i++) ctx.lineTo(L[i][0], L[i][1]);
    for(let i=R.length-1;i>=0;i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath();

    ctx.fillStyle = palette.fill;
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 2.8;
    ctx.lineJoin="round";
    ctx.lineCap="round";
    ctx.stroke();

    // ridge
    ctx.save();
    ctx.globalCompositeOperation="screen";
    ctx.strokeStyle = palette.ridge;
    ctx.lineWidth = 2.0;
    for(let i=0;i<frame.ridge.length-1;i++){
      const a=frame.ridge[i], b=frame.ridge[i+1];
      ctx.beginPath();
      ctx.moveTo(a[0],a[1]);
      ctx.lineTo(b[0],b[1]);
      ctx.stroke();
    }
    ctx.restore();

    // belly plates
    ctx.save();
    ctx.globalCompositeOperation="screen";
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1.2;
    for(let i=0;i<frame.belly.length;i++){
      const a=frame.belly[i];
      ctx.beginPath();
      ctx.ellipse(a.x,a.y,a.rx,a.ry,0,0.12,Math.PI-0.12);
      ctx.stroke();
    }
    ctx.restore();

    // scale hints (capped instances)
    ctx.save();
    ctx.globalCompositeOperation="screen";
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.0;
    for(let i=0;i<frame.scales.length;i++){
      const s=frame.scales[i];
      ctx.beginPath();
      ctx.arc(s.x,s.y,2.2,0,Math.PI*2);
      ctx.stroke();
    }
    ctx.restore();

    // head cap
    const hp = frame.headPose;
    ctx.fillStyle="rgba(0,0,0,0.70)";
    ctx.beginPath();
    ctx.ellipse(hp.x,hp.y,13,9,0,0,Math.PI*2);
    ctx.fill();
  }
};
})();
