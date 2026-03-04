/* TNT — /assets/dragon-anatomy-engine.js
   GEODIAMETRICS DRAGON ANATOMY ENGINE v2.0 (ENGLISH ONLY)
   GOAL (THIS PASS):
     - FIX "vine" look: true head + segmented anatomy + hex scale plates
     - FIX motion: slow SLITHER (traveling wave), NOT violent wiggle
     - FIX seams: continuous ribbon body first, scales on top (no vibrating gaps)
     - TWO dragons: top + bottom (kept far apart)
   CONSTRAINTS:
     - Canvas only, pointer-events none
     - No new gd_* keys
     - No text (we add banners/quotes later in behavior layer)
     - 30fps throttle + DPR cap for stability
*/
(function(){
  "use strict";

  // ---------------------------
  // CONFIG (tune here)
  // ---------------------------
  var DPR_CAP = 1.6;
  var TARGET_FPS = 30;
  var FRAME_MS = 1000 / TARGET_FPS;

  // Dragon motion (slow + smooth)
  var SPEED_PX_PER_MS = 0.022;        // slower than before
  var WAVE_SPEED = 0.00105;           // phase advance per ms
  var WAVE_AMP = 18;                  // px at DPR=1
  var WAVE_FREQ = 2.35;               // spatial frequency (lower = smoother)

  // Anatomy
  var SEGMENTS = 64;
  var SEG_SPACING = 18;               // target distance between segments
  var BASE_THICK = 16;                // base body half-thickness
  var TAPER = 0.78;                   // tail taper factor
  var SCALE_STEP = 2;                 // every Nth segment draws scale plate
  var SCALE_DENSITY = 0.82;           // 0..1 (visual density)
  var HEAD_SCALE = 1.35;              // head size multiplier

  // Colors (onyx green-black + subtle red belly)
  var BODY_FILL = "rgba(10,46,28,0.92)";
  var BODY_EDGE = "rgba(0,0,0,0.42)";
  var BELLY = "rgba(140,20,20,0.20)";
  var GOLD = "rgba(212,175,55,0.30)";

  // Layout
  function topY(H){ return H * 0.30; }
  function botY(H){ return H * 0.74; }

  // ---------------------------
  // Canvas
  // ---------------------------
  var c = document.getElementById("gd_dragon_canvas");
  if(c){ try{ c.remove(); }catch(e){} }

  c = document.createElement("canvas");
  c.id = "gd_dragon_canvas";
  c.style.position = "fixed";
  c.style.inset = "0";
  c.style.width = "100%";
  c.style.height = "100%";
  c.style.pointerEvents = "none";
  c.style.userSelect = "none";
  c.style.zIndex = "9"; // above bg/moon, below gems (your page nodes should be >9)
  document.body.appendChild(c);

  var ctx = c.getContext("2d", { alpha:true, desynchronized:true });

  var W=0,H=0,DPR=1;
  function resize(){
    var ww = Math.max(1, window.innerWidth || 1);
    var hh = Math.max(1, window.innerHeight || 1);
    var dpr = 1;
    try{ dpr = window.devicePixelRatio || 1; }catch(e){}
    DPR = Math.min(DPR_CAP, Math.max(1, dpr));
    W = Math.floor(ww * DPR);
    H = Math.floor(hh * DPR);
    c.width = W;
    c.height = H;
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  // ---------------------------
  // Dragon data structure
  // ---------------------------
  function makeDragon(yNorm, dir){
    // dir: -1 right->left, +1 left->right
    var arr = [];
    for(var i=0;i<SEGMENTS;i++){
      arr.push({ x: (dir<0 ? (W + i*SEG_SPACING*DPR) : (-i*SEG_SPACING*DPR)), y: yNorm });
    }
    return {
      dir: dir,
      yBase: yNorm,
      pts: arr,
      phase: Math.random()*Math.PI*2,
      // head offset used for restart logic
      headX: (dir<0 ? (W + SEG_SPACING*DPR*2) : (-SEG_SPACING*DPR*2))
    };
  }

  var dTop = makeDragon(topY(H), -1);
  var dBot = makeDragon(botY(H), -1);

  // ---------------------------
  // Math helpers
  // ---------------------------
  function hypot(dx,dy){ return Math.sqrt(dx*dx + dy*dy); }

  function unitFrom(a,b){
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var h = hypot(dx,dy);
    if(h < 1e-6) return {x:1,y:0};
    return {x:dx/h, y:dy/h};
  }

  // Build a normal vector from tangent
  function normalFrom(tan){
    return {x: -tan.y, y: tan.x};
  }

  // ---------------------------
  // Motion update
  // ---------------------------
  function updateDragon(d, tMs, dtMs){
    // Advance head across screen (slow)
    var vx = d.dir * SPEED_PX_PER_MS * dtMs * DPR;
    d.headX += vx;

    // restart after fully exiting screen (IMPORTANT)
    var margin = W*0.28;
    if(d.dir < 0 && d.headX < -margin){
      d.headX = W + margin;
      d.phase = Math.random()*Math.PI*2;
    }
    if(d.dir > 0 && d.headX > W + margin){
      d.headX = -margin;
      d.phase = Math.random()*Math.PI*2;
    }

    // smooth slither: traveling wave along body
    var y0 = d.yBase;
    var head = d.pts[0];
    head.x = d.headX;

    // the wave is driven by time + segment index for traveling motion
    head.y = y0 + Math.sin(d.phase + tMs*WAVE_SPEED) * (WAVE_AMP*DPR*0.55);

    // Follow chain with fixed spacing (stable)
    for(var i=1;i<d.pts.length;i++){
      var prev = d.pts[i-1];
      var cur  = d.pts[i];

      // target point behind prev along direction to cur
      var dx = prev.x - cur.x;
      var dy = prev.y - cur.y;
      var dist = hypot(dx,dy);

      // if degenerate, nudge
      if(dist < 1e-6){
        cur.x = prev.x - SEG_SPACING*DPR;
        cur.y = prev.y;
        continue;
      }

      var target = SEG_SPACING*DPR;
      var k = target / dist;
      cur.x = prev.x - dx * k;
      cur.y = prev.y - dy * k;

      // add traveling wave progressively (tail has less amplitude)
      var s = i / (d.pts.length-1);
      var amp = (WAVE_AMP*DPR) * (1.0 - s*0.55);
      var w = Math.sin(d.phase + (tMs*WAVE_SPEED) - s*WAVE_FREQ*6.283) * amp;
      cur.y += w * 0.06; // very subtle so it reads as slither not wiggle
    }
  }

  // ---------------------------
  // Drawing: continuous ribbon body + hex scales
  // ---------------------------
  function drawRibbon(d){
    var pts = d.pts;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.lineJoin = "round";
    ctx.lineCap  = "round";

    // Outer edge shadow (gives thickness)
    ctx.strokeStyle = BODY_EDGE;
    ctx.lineWidth = (BASE_THICK*2 + 10) * DPR;
    ctx.beginPath();
    for(var i=0;i<pts.length;i++){
      var p = pts[i];
      if(i===0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // Main body
    ctx.strokeStyle = BODY_FILL;
    ctx.lineWidth = (BASE_THICK*2) * DPR;
    ctx.beginPath();
    for(var j=0;j<pts.length;j++){
      var p2 = pts[j];
      if(j===0) ctx.moveTo(p2.x, p2.y);
      else ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();

    // Belly hint (subtle red underside)
    ctx.strokeStyle = BELLY;
    ctx.lineWidth = (BASE_THICK*1.2) * DPR;
    ctx.beginPath();
    for(var k=0;k<pts.length;k++){
      var p3 = pts[k];
      if(k===0) ctx.moveTo(p3.x, p3.y + BASE_THICK*0.35*DPR);
      else ctx.lineTo(p3.x, p3.y + BASE_THICK*0.35*DPR);
    }
    ctx.stroke();

    ctx.restore();
  }

  function drawHexScale(x,y,r,ang,alpha){
    // simple 6-sided plate
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(ang);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for(var i=0;i<6;i++){
      var a = (Math.PI/3)*i;
      var px = Math.cos(a)*r;
      var py = Math.sin(a)*r*0.86;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawScales(d){
    var pts = d.pts;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 1.0*DPR;

    for(var i=2;i<pts.length-3;i+=SCALE_STEP){
      var p = pts[i];
      var pN = pts[i+1];

      var tan = unitFrom(p, pN);
      var nrm = normalFrom(tan);

      // taper: bigger plates closer to head
      var s = i/(pts.length-1);
      var taper = (1.0 - s*(1.0-TAPER));
      var rr = (BASE_THICK*0.72*DPR) * taper * lerp(0.85, 1.05, SCALE_DENSITY);

      // place on "upper" side so it reads as scales
      var sx = p.x + nrm.x * (BASE_THICK*0.45*DPR);
      var sy = p.y + nrm.y * (BASE_THICK*0.45*DPR);

      // rotate plate along tangent
      var ang = Math.atan2(tan.y, tan.x);

      // fade toward tail
      var a = lerp(0.22, 0.06, s);
      drawHexScale(sx, sy, rr, ang, a);
    }

    ctx.restore();
  }

  // ---------------------------
  // Head: actual dragon head (not circles)
  // ---------------------------
  function drawHead(d){
    var head = d.pts[0];
    var neck = d.pts[2] || d.pts[1];
    var tan = unitFrom(neck, head);
    var ang = Math.atan2(tan.y, tan.x);

    var hs = BASE_THICK * HEAD_SCALE * DPR;

    ctx.save();
    ctx.translate(head.x, head.y);
    ctx.rotate(ang);

    // Skull
    ctx.fillStyle = "rgba(8,54,30,0.98)";
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 2*DPR;

    ctx.beginPath();
    ctx.moveTo(-hs*0.65, -hs*0.20);
    ctx.quadraticCurveTo(0, -hs*0.85, hs*0.92, -hs*0.18);
    ctx.quadraticCurveTo(hs*1.12, 0, hs*0.90, hs*0.26);
    ctx.quadraticCurveTo(0, hs*0.90, -hs*0.65, hs*0.30);
    ctx.quadraticCurveTo(-hs*0.90, 0, -hs*0.65, -hs*0.20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jaw
    ctx.fillStyle = "rgba(6,40,22,0.98)";
    ctx.beginPath();
    ctx.moveTo(hs*0.10, hs*0.18);
    ctx.quadraticCurveTo(hs*0.55, hs*0.50, hs*1.05, hs*0.22);
    ctx.quadraticCurveTo(hs*0.55, hs*0.78, hs*0.10, hs*0.56);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = "rgba(255,212,74,0.95)";
    ctx.beginPath();
    ctx.ellipse(hs*0.28, -hs*0.10, hs*0.12, hs*0.08, 0, 0, Math.PI*2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.beginPath();
    ctx.ellipse(hs*0.30, -hs*0.10, hs*0.04, hs*0.06, 0, 0, Math.PI*2);
    ctx.fill();

    // Horns
    ctx.strokeStyle = "rgba(212,175,55,0.55)";
    ctx.lineWidth = 2*DPR;
    ctx.beginPath();
    ctx.moveTo(-hs*0.10, -hs*0.70);
    ctx.lineTo(-hs*0.45, -hs*1.20);
    ctx.moveTo(hs*0.18, -hs*0.72);
    ctx.lineTo(hs*0.02, -hs*1.26);
    ctx.stroke();

    // Whiskers
    ctx.strokeStyle = "rgba(212,175,55,0.40)";
    ctx.lineWidth = 1.4*DPR;
    ctx.beginPath();
    ctx.moveTo(hs*0.78, hs*0.08);
    ctx.lineTo(hs*1.45, -hs*0.25);
    ctx.moveTo(hs*0.74, hs*0.18);
    ctx.lineTo(hs*1.40, hs*0.20);
    ctx.stroke();

    ctx.restore();
  }

  // ---------------------------
  // Loop
  // ---------------------------
  var last = 0;
  var acc = 0;

  function frame(ts){
    if(!last) last = ts;
    var dt = ts - last;
    last = ts;

    acc += dt;
    if(acc < FRAME_MS){
      requestAnimationFrame(frame);
      return;
    }
    acc = 0;

    // Clear
    ctx.clearRect(0,0,W,H);

    // Update
    updateDragon(dTop, ts, dt);
    updateDragon(dBot, ts, dt);

    // Draw order: ribbon → scales → head (so head stays crisp)
    drawRibbon(dTop);
    drawScales(dTop);
    drawHead(dTop);

    drawRibbon(dBot);
    drawScales(dBot);
    drawHead(dBot);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

})();
