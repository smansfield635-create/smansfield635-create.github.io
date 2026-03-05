/* TNT — /assets/hel-render.js
   HEL RENDER — CHINESE DRAGON MORPHOLOGY ENFORCED
   BUILD: HEL_RENDER_DRAGON_MORPH_v1
   ENFORCES:
   - head>=1.4×neck
   - 2 horns >=0.8×headW
   - whiskers >=2, len>=1.0×headW
   - 4 legs, len>=0.9×localR
   - ridge >=5 spikes over 40% body
   - tail taper implied by rad profile + fin
*/
(function(){
"use strict";

function evenoddFill(ctx){
  try{ ctx.fill("evenodd"); }catch(e){ ctx.fill(); }
}

function polyFill(ctx, pts){
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  evenoddFill(ctx);
}

function line(ctx,a,b,w){
  ctx.lineWidth=w;
  ctx.beginPath();
  ctx.moveTo(a.x,a.y);
  ctx.lineTo(b.x,b.y);
  ctx.stroke();
}

function quad(ctx,a,b,c,d){
  ctx.beginPath();
  ctx.moveTo(a.x,a.y);
  ctx.lineTo(b.x,b.y);
  ctx.lineTo(c.x,c.y);
  ctx.lineTo(d.x,d.y);
  ctx.closePath();
  evenoddFill(ctx);
}

window.HEL_RENDER = {
  version:"HEL_RENDER_DRAGON_MORPH_v1",

  drawDragon(ctx, frame, style){
    if(!ctx || !frame) return;
    style = style || {};
    const fill = style.fill || "rgba(255,255,255,0.9)";
    const strokeW = Number.isFinite(style.strokeW) ? style.strokeW : 2;

    const L=frame.L, R=frame.R;
    if(!L || !R || L.length<3 || R.length<3) return;

    const A=frame.anchors||{};
    const spine=frame.spine||[];
    const tArr=frame.t||[];
    const nArr=frame.n||[];
    const rad=frame.rad||[];

    /* ===== BODY HULL ===== */
    ctx.save();
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

    /* ===== MORPHOLOGY THRESHOLDS ===== */
    const ih=A.head||0;
    const inck=A.neck||Math.min(8, spine.length-1);

    const headW = Math.max(6, (frame.head && frame.head.cap) ? (frame.head.cap.rx*2) : (rad[ih]*2));
    const neckW = Math.max(4, (rad[inck]||rad[ih]||8)*2);

    /* enforce head>=1.4×neck by adding crown pad if needed */
    const needHeadW = 1.4*neckW;
    const headPad = Math.max(0, (needHeadW - headW)/2);

    /* local frame at head */
    const P=spine[ih] || {x:L[0].x,y:L[0].y};
    const t=tArr[ih] || {x:1,y:0};
    const n=nArr[ih] || {x:0,y:-1};
    const rH = Math.max(6, rad[ih]||8);

    /* ===== HEAD (wedge + crown) ===== */
    if(frame.head){
      const h=frame.head;

      ctx.fillStyle="rgba(0,0,0,0.38)";
      polyFill(ctx,[h.tip,h.left,h.right]);

      ctx.fillStyle="rgba(0,0,0,0.32)";
      ctx.beginPath();
      ctx.ellipse(h.cap.x,h.cap.y,h.cap.rx+headPad,h.cap.ry+headPad*0.6,0,0,Math.PI*2);
      ctx.fill();
    }

    /* ===== HORNS (2) ===== */
    const hornLen = Math.max(0.8*headW, 1.6*rH);
    const hornSide = 0.35*headW;

    const hornBaseF = 0.1*rH;
    const hornBaseB = 0.6*rH;

    const HbL = {x:P.x - t.x*hornBaseB + n.x*(0.85*rH), y:P.y - t.y*hornBaseB + n.y*(0.85*rH)};
    const HbR = {x:P.x - t.x*hornBaseB - n.x*(0.85*rH), y:P.y - t.y*hornBaseB - n.y*(0.85*rH)};

    const HtL = {x:HbL.x + t.x*hornLen + n.x*(0.25*hornSide), y:HbL.y + t.y*hornLen + n.y*(0.25*hornSide)};
    const HtR = {x:HbR.x + t.x*hornLen - n.x*(0.25*hornSide), y:HbR.y + t.y*hornLen - n.y*(0.25*hornSide)};

    ctx.fillStyle="rgba(0,0,0,0.40)";
    polyFill(ctx,[HbL, {x:HbL.x + t.x*hornBaseF + n.x*(0.35*hornSide), y:HbL.y + t.y*hornBaseF + n.y*(0.35*hornSide)}, HtL]);
    polyFill(ctx,[HbR, {x:HbR.x + t.x*hornBaseF - n.x*(0.35*hornSide), y:HbR.y + t.y*hornBaseF - n.y*(0.35*hornSide)}, HtR]);

    /* ===== WHISKERS (>=2, here 4) ===== */
    const wLen = Math.max(1.0*headW, 2.0*rH);
    const wRootF = 0.9*rH;

    function whisker(side, lift){
      const s = side; // +1 left, -1 right
      const root = {x:P.x + t.x*wRootF + n.x*(s*0.75*rH), y:P.y + t.y*wRootF + n.y*(s*0.75*rH)};
      const dir  = {x: (0.65*t.x + s*0.75*n.x), y:(0.65*t.y + s*0.75*n.y)};
      const d = Math.hypot(dir.x,dir.y)||1;
      dir.x/=d; dir.y/=d;
      const mid = {x:root.x + dir.x*(0.55*wLen) + n.x*(s*lift*0.20*wLen), y:root.y + dir.y*(0.55*wLen) + n.y*(s*lift*0.20*wLen)};
      const tip = {x:root.x + dir.x*wLen + n.x*(s*lift*0.35*wLen), y:root.y + dir.y*wLen + n.y*(s*lift*0.35*wLen)};
      ctx.strokeStyle="rgba(0,0,0,0.55)";
      ctx.lineWidth=Math.max(1, strokeW*0.55);
      ctx.lineCap="round";
      ctx.beginPath();
      ctx.moveTo(root.x,root.y);
      ctx.quadraticCurveTo(mid.x,mid.y,tip.x,tip.y);
      ctx.stroke();
    }
    whisker(+1, +1); whisker(+1, -1);
    whisker(-1, +1); whisker(-1, -1);

    /* ===== DORSAL RIDGE (>=5 spikes across >=40% length) ===== */
    const i0=A.ridge0||Math.round(L.length*0.10);
    const i1=A.ridge1||Math.round(L.length*0.80);
    const span = Math.max(1, i1-i0);
    const count = Math.max(5, Math.floor(span/6));
    for(let k=0;k<count;k++){
      const i = Math.round(i0 + (k/(count-1))*span);
      const Pi = spine[i]; if(!Pi) continue;
      const ni = nArr[i] || {x:0,y:-1};
      const ri = Math.max(4, rad[i]||6);
      const root = {x:Pi.x + ni.x*(ri*0.95), y:Pi.y + ni.y*(ri*0.95)};
      const tip  = {x:root.x + ni.x*(ri*0.70), y:root.y + ni.y*(ri*0.70)};
      ctx.strokeStyle="rgba(0,0,0,0.55)";
      ctx.lineWidth=Math.max(1, strokeW*0.45);
      line(ctx, root, tip, ctx.lineWidth);
    }

    /* ===== LEGS (4) ===== */
    function leg(i){
      const Pi=spine[i]; if(!Pi) return;
      const ti=tArr[i]||{x:1,y:0};
      const ni=nArr[i]||{x:0,y:-1};
      const ri=Math.max(6, rad[i]||8);

      const len=Math.max(0.9*ri, 1.1*ri);
      const w  = 0.55*ri;

      const root = {x:Pi.x - ni.x*(ri*0.95), y:Pi.y - ni.y*(ri*0.95)}; /* underside */
      const hipL = {x:root.x - ti.x*(0.25*ri) + (-ni.x)*w, y:root.y - ti.y*(0.25*ri) + (-ni.y)*w};
      const hipR = {x:root.x + ti.x*(0.25*ri) + (-ni.x)*w, y:root.y + ti.y*(0.25*ri) + (-ni.y)*w};
      const footL= {x:hipL.x + (-ni.x)*len, y:hipL.y + (-ni.y)*len};
      const footR= {x:hipR.x + (-ni.x)*len, y:hipR.y + (-ni.y)*len};

      ctx.fillStyle="rgba(0,0,0,0.28)";
      quad(ctx, hipL, hipR, footR, footL);
    }
    leg(A.leg1||Math.round(spine.length*0.25));
    leg(A.leg2||Math.round(spine.length*0.40));
    leg(A.leg3||Math.round(spine.length*0.55));
    leg(A.leg4||Math.round(spine.length*0.70));

    /* ===== TAIL FIN ===== */
    const tf=frame.tailFin;
    if(tf){
      ctx.fillStyle="rgba(0,0,0,0.14)";
      polyFill(ctx,[tf.a,tf.b,tf.c]);
    }

    ctx.restore();
  }
};

})();
