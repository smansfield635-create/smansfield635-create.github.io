/* TNT — /assets/dragon-engine.js
   GEODIAMETRICS DRAGON ENGINE v1.0 (SLOW + SCALES)
   FIXES:
   - Dragons were too fast → slowed by default (readable)
   - “No scales” → adds interlocking scale band (scalloped hex-arc look)
   - One-piece feel → draws a continuous body ribbon + scale overlay (not bead circles)
   CONSTRAINTS:
   - Canvas-only, pointer-events none
   - English-only (no i18n here)
   - No gd_* keys
   - 30fps cap + DPR cap for mobile
*/

(function(){
  "use strict";

  // ---------- Config ----------
  var DPR_CAP = 1.6;
  var FPS = 30;
  var FRAME_MS = 1000 / FPS;

  // speed: pixels per second (SLOW + readable)
  var SPEED_PX_S = 110;        // was effectively ~800+; this is readable
  var BODY_THICK = 26;         // girth
  var SCALE_STEP = 14;         // spacing between scales
  var WAVE_AMP = 18;
  var WAVE_FREQ = 0.0085;

  // Colors (onyx-green)
  var BODY_FILL = "rgba(0,55,35,0.78)";
  var BODY_EDGE = "rgba(0,0,0,0.38)";
  var BELLY_GLOW = "rgba(160,40,30,0.16)";

  var SCALE_EDGE = "rgba(212,175,55,0.22)";
  var SCALE_FILL = "rgba(255,255,255,0.06)";

  // ---------- Canvas ----------
  var c = document.createElement("canvas");
  c.id = "gd_dragon_canvas";
  c.style.position = "fixed";
  c.style.inset = "0";
  c.style.width = "100%";
  c.style.height = "100%";
  c.style.pointerEvents = "none";
  c.style.userSelect = "none";
  c.style.zIndex = "9"; // above bg/water, below gems/buttons (your page sets gems higher)
  document.body.appendChild(c);

  var ctx = c.getContext("2d", { alpha:true, desynchronized:true });

  var W=0,H=0,DPR=1;

  function resize(){
    var ww = Math.max(1, window.innerWidth||1);
    var hh = Math.max(1, window.innerHeight||1);
    var dpr = 1;
    try{ dpr = window.devicePixelRatio || 1; }catch(e){}
    DPR = Math.min(DPR_CAP, Math.max(1, dpr));
    W = Math.floor(ww * DPR);
    H = Math.floor(hh * DPR);
    c.width = W; c.height = H;
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  // ---------- Helpers ----------
  function lerp(a,b,t){ return a+(b-a)*t; }
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

  // Build a dragon path (top + bottom)
  function makeDragon(yFrac, phase){
    return {
      yFrac: yFrac,
      phase: phase,
      // quote changes only when fully restarted (exit left -> re-enter right)
      quoteIdx: 0,
      // offset for full traverse
      offset: 0
    };
  }

  var dragons = [
    makeDragon(0.26, 0.3),
    makeDragon(0.74, 1.1)
  ];

  // Simple phrase set (kept short so readable)
  var PHRASES = [
    "SAY LESS. DO MORE.",
    "THE RIVER FLOWS. TIME PASSES.",
    "BOUND THEN SCALE.",
    "RECEIPTS > ARGUMENTS.",
    "MEASURE THEN MOVE."
  ];

  function nextQuote(d){
    d.quoteIdx = (d.quoteIdx + 1) % PHRASES.length;
  }

  // ---------- Dragon drawing ----------
  function sampleSpine(d, t){
    // returns points from head→tail
    var pts = [];
    var yMid = H * d.yFrac;

    var segCount = 34;
    var len = W * 0.95;
    var amp = WAVE_AMP * DPR;
    var thick = BODY_THICK * DPR;

    // Travel from right→left with full exit and restart
    var margin = W * 0.35;
    var travel = W + margin * 2;

    // offset grows with time; wrap when fully offscreen
    var u = (t * (SPEED_PX_S * DPR / 1000) + d.offset) % travel;
    var headX = (W + margin) - u;

    // When dragon completes a wrap (near reset), advance quote
    // Detect wrap by checking if u is very small (frame-local)
    if(u < (SPEED_PX_S * DPR / 1000) * 2){
      // only once per wrap: jitter-safe latch
      if(!d._wrapped){
        d._wrapped = true;
        nextQuote(d);
      }
    }else{
      d._wrapped = false;
    }

    for(var i=0;i<=segCount;i++){
      var s = i/segCount;
      var x = headX + (len * s); // tail trails to the right (but head moves left)
      var y = yMid + Math.sin((x * WAVE_FREQ) + (t*0.0012) + d.phase) * amp;
      // taper tail slightly
      var w = thick * lerp(1.0, 0.55, s);
      pts.push({x:x, y:y, w:w});
    }
    return pts;
  }

  function drawBodyRibbon(pts){
    // Draw thick ribbon by stroking a centerline with variable thickness.
    // Shadow edge
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = BODY_EDGE;
    ctx.lineWidth = (BODY_THICK*DPR) + (10*DPR);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for(var i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    // Main body
    ctx.strokeStyle = BODY_FILL;
    ctx.lineWidth = (BODY_THICK*DPR);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for(var j=1;j<pts.length;j++) ctx.lineTo(pts[j].x, pts[j].y);
    ctx.stroke();

    // Belly glow (subtle red belly)
    ctx.strokeStyle = BELLY_GLOW;
    ctx.lineWidth = (BODY_THICK*DPR) * 0.55;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y + (BODY_THICK*DPR)*0.22);
    for(var k=1;k<pts.length;k++){
      ctx.lineTo(pts[k].x, pts[k].y + (BODY_THICK*DPR)*0.22);
    }
    ctx.stroke();
  }

  function drawScaleBand(pts){
    // Scales: scalloped arcs along body, alternating rows.
    // Looks like interlocking “hex-ish” scales without heavy compute.
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    var step = SCALE_STEP * DPR;
    var baseR = (BODY_THICK*DPR) * 0.42;

    for(var i=2;i<pts.length-2;i++){
      var p = pts[i];
      var p2 = pts[i+1];

      // distance-based skip so scale spacing is stable
      if((i*step) % (step*2) !== 0) continue;

      var ang = Math.atan2(p2.y - p.y, p2.x - p.x);
      var r = clamp(baseR * (p.w / (BODY_THICK*DPR)), baseR*0.65, baseR);

      // edge
      ctx.strokeStyle = SCALE_EDGE;
      ctx.lineWidth = 1.2*DPR;

      // fill
      ctx.fillStyle = SCALE_FILL;

      // upper row arc
      ctx.beginPath();
      ctx.arc(p.x, p.y - r*0.55, r, ang + 0.4, ang + 2.2);
      ctx.stroke();

      // lower row arc (offset)
      ctx.beginPath();
      ctx.arc(p.x, p.y + r*0.55, r*0.92, ang + 0.9, ang + 2.7);
      ctx.stroke();

      // tiny fill highlights to give scale “plate” feel
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(p.x - Math.cos(ang)*r*0.25, p.y - r*0.55, r*0.28, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function drawHead(pts){
    // More than “two circles”: add snout, jaw, horn, whiskers, eye.
    var hd = pts[0];
    var nx = pts[1].x - hd.x;
    var ny = pts[1].y - hd.y;
    var ang = Math.atan2(ny, nx);

    var r = (BODY_THICK*DPR) * 0.70;

    ctx.save();
    ctx.translate(hd.x, hd.y);
    ctx.rotate(ang);

    // skull
    ctx.fillStyle = "rgba(0,70,40,0.92)";
    ctx.beginPath();
    ctx.ellipse(0, 0, r*1.1, r*0.85, 0, 0, Math.PI*2);
    ctx.fill();

    // snout
    ctx.fillStyle = "rgba(0,62,36,0.92)";
    ctx.beginPath();
    ctx.ellipse(-r*0.95, r*0.05, r*0.95, r*0.55, 0, 0, Math.PI*2);
    ctx.fill();

    // jaw
    ctx.fillStyle = "rgba(0,50,30,0.92)";
    ctx.beginPath();
    ctx.ellipse(-r*0.85, r*0.42, r*0.88, r*0.40, 0.12, 0, Math.PI*2);
    ctx.fill();

    // eye
    ctx.fillStyle = "rgba(212,175,55,0.85)";
    ctx.beginPath();
    ctx.arc(-r*0.25, -r*0.18, r*0.14, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.arc(-r*0.23, -r*0.18, r*0.06, 0, Math.PI*2);
    ctx.fill();

    // horn
    ctx.strokeStyle = "rgba(212,175,55,0.55)";
    ctx.lineWidth = 2*DPR;
    ctx.beginPath();
    ctx.moveTo(r*0.10, -r*0.65);
    ctx.lineTo(r*0.55, -r*1.45);
    ctx.stroke();

    // whiskers
    ctx.strokeStyle = "rgba(212,175,55,0.35)";
    ctx.lineWidth = 1.3*DPR;
    ctx.beginPath();
    ctx.moveTo(-r*1.55, r*0.05);
    ctx.lineTo(-r*2.45, -r*0.55);
    ctx.moveTo(-r*1.55, r*0.18);
    ctx.lineTo(-r*2.35, r*0.70);
    ctx.stroke();

    ctx.restore();
  }

  function drawQuote(d, pts){
    // Quote travels with the body (near head but offset)
    var text = PHRASES[d.quoteIdx];
    var p = pts[4];
    var p2 = pts[5];
    var ang = Math.atan2(p2.y-p.y, p2.x-p.x);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang);
    ctx.font = (14*DPR) + "px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "rgba(212,175,55,0.70)";
    ctx.shadowColor = "rgba(212,175,55,0.35)";
    ctx.shadowBlur = 10*DPR;
    ctx.fillText(text, -ctx.measureText(text).width*0.05, -(BODY_THICK*DPR)*1.35);
    ctx.restore();
  }

  function drawDragon(d, t){
    var pts = sampleSpine(d, t);
    drawBodyRibbon(pts);
    drawScaleBand(pts);
    drawHead(pts);
    drawQuote(d, pts);
  }

  // ---------- Loop ----------
  var last=0, acc=0;
  function frame(ts){
    if(!last) last = ts;
    var dt = ts - last; last = ts;
    acc += dt;

    if(acc < FRAME_MS){
      requestAnimationFrame(frame);
      return;
    }
    acc = 0;

    ctx.clearRect(0,0,W,H);

    // Two dragons: top + bottom (kept far from CORE by yFrac)
    drawDragon(dragons[0], ts);
    drawDragon(dragons[1], ts + 9000); // phase offset

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

})();
