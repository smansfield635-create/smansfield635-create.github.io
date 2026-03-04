/* TNT — /assets/dragon-engine.js
   GEODIAMETRICS DRAGON ENGINE v2 (SLOW SLITHER + ONE-PIECE BODY)
   GOALS:
     - Slow, natural slither (no vibration)
     - Continuous body (not segmented beads)
     - Subtle scale texture (gold hint)
     - Two dragons: top + bottom, right→left, full traverse then reset
     - New quote each pass (per dragon)
   CONSTRAINTS:
     - Canvas only, pointer-events none
     - No gd_* keys
     - English only
*/
(function(){
  "use strict";

  // ---------- Canvas ----------
  var c = document.getElementById("gd_dragon_canvas");
  if(!c){
    c = document.createElement("canvas");
    c.id = "gd_dragon_canvas";
    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.pointerEvents = "none";
    // Layering: above bg/water, below gems/buttons (most pages put gems ~10+)
    c.style.zIndex = "6";
    c.style.userSelect = "none";
    (document.body || document.documentElement).appendChild(c);
  }
  var ctx = c.getContext("2d", { alpha:true, desynchronized:true });

  // ---------- Perf budget ----------
  var FPS = 30;
  var FRAME_MS = 1000 / FPS;
  var DPR_CAP = 1.6;

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

  // ---------- Quotes (English only, rotate per pass) ----------
  var QUOTES = [
    "THE RIVER FLOWS. TIME PASSES.",
    "MEASURE THEN MOVE.",
    "BOUND THEN SCALE.",
    "RECEIPTS > ARGUMENTS.",
    "CONTAIN FIRST."
  ];

  // ---------- Dragon model ----------
  function makeDragon(yFrac, dir){
    var segs = 64; // enough for smooth body
    var spacing = 18 * DPR;
    var pts = [];
    for(var i=0;i<segs;i++){
      pts.push({ x: (W*0.8) + i*spacing, y: H*yFrac });
    }
    return {
      pts: pts,
      dir: dir,                 // -1 right->left
      y0: H*yFrac,
      t0: Math.random()*1000,
      speed: 60 * DPR,          // px/sec (SLOW)
      waveAmp: 14 * DPR,        // subtle
      waveFreq: 1.15,           // low frequency (no vibration)
      thickness: 22 * DPR,      // girth
      margin: 0.35 * W,         // off-screen margin
      quoteIndex: (Math.random()*QUOTES.length)|0,
      quote: "",
      quoteX: 0,
      quoteY: 0
    };
  }

  var topDragon = makeDragon(0.28, -1);
  var botDragon = makeDragon(0.72, -1);

  function pickNextQuote(d){
    d.quoteIndex = (d.quoteIndex + 1) % QUOTES.length;
    d.quote = QUOTES[d.quoteIndex];
  }
  pickNextQuote(topDragon);
  pickNextQuote(botDragon);

  // ---------- Helpers ----------
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  // Build a smooth “ribbon” body from spine points
  function drawRibbon(d, now){
    var pts = d.pts;

    // Colors: onyx-green + reddish belly hint + gold edge
    var edge = "rgba(212,175,55,0.32)";
    var body = "rgba(5,30,18,0.78)";          // onyx-green
    var belly = "rgba(120,0,22,0.14)";        // subtle crimson belly glow

    // Shadow pass (depth)
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Outer shadow
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = d.thickness + 10*DPR;
    ctx.beginPath();
    for(var i=0;i<pts.length;i++){
      var p = pts[i];
      if(i===0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // Main body stroke
    ctx.strokeStyle = body;
    ctx.lineWidth = d.thickness;
    ctx.beginPath();
    for(var j=0;j<pts.length;j++){
      var p2 = pts[j];
      if(j===0) ctx.moveTo(p2.x, p2.y);
      else ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();

    // Belly highlight (inner)
    ctx.strokeStyle = belly;
    ctx.lineWidth = Math.max(1, d.thickness*0.55);
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    for(var k=0;k<pts.length;k++){
      var p3 = pts[k];
      // small offset for “belly”
      if(k===0) ctx.moveTo(p3.x, p3.y + d.thickness*0.18);
      else ctx.lineTo(p3.x, p3.y + d.thickness*0.18);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Gold edge (thin)
    ctx.strokeStyle = edge;
    ctx.lineWidth = 1.6*DPR;
    ctx.beginPath();
    for(var m=0;m<pts.length;m++){
      var p4 = pts[m];
      if(m===0) ctx.moveTo(p4.x, p4.y - d.thickness*0.28);
      else ctx.lineTo(p4.x, p4.y - d.thickness*0.28);
    }
    ctx.stroke();

    // Scale texture (subtle arcs)
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1.1*DPR;
    for(var s=4;s<pts.length-2;s+=3){
      var a = pts[s];
      var b = pts[s+1];
      var ang = Math.atan2(b.y-a.y, b.x-a.x);
      var rr = d.thickness*0.55;
      ctx.beginPath();
      ctx.arc(a.x, a.y, rr, ang+0.75, ang+1.95);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawHead(d){
    // Head sits at pts[0], facing along tangent to pts[1]
    var p0 = d.pts[0];
    var p1 = d.pts[1];
    var ang = Math.atan2(p1.y-p0.y, p1.x-p0.x);

    var hx = p0.x;
    var hy = p0.y;
    var r = d.thickness*0.65;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.rotate(ang);

    // Head shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(-r*0.05, r*0.05, r*1.15, r*0.85, 0, 0, Math.PI*2);
    ctx.fill();

    // Skull
    ctx.fillStyle = "rgba(6,32,20,0.92)";
    ctx.beginPath();
    ctx.ellipse(0, 0, r*1.10, r*0.80, 0, 0, Math.PI*2);
    ctx.fill();

    // Snout
    ctx.fillStyle = "rgba(6,28,18,0.92)";
    ctx.beginPath();
    ctx.ellipse(r*0.85, r*0.10, r*0.85, r*0.55, 0, 0, Math.PI*2);
    ctx.fill();

    // Jaw line
    ctx.strokeStyle = "rgba(212,175,55,0.28)";
    ctx.lineWidth = 1.6*DPR;
    ctx.beginPath();
    ctx.moveTo(r*0.25, r*0.35);
    ctx.lineTo(r*1.35, r*0.30);
    ctx.stroke();

    // Eye
    ctx.fillStyle = "rgba(212,175,55,0.85)";
    ctx.beginPath();
    ctx.arc(r*0.35, -r*0.10, r*0.12, 0, Math.PI*2);
    ctx.fill();

    // Horns/whiskers (gold)
    ctx.strokeStyle = "rgba(212,175,55,0.45)";
    ctx.lineWidth = 1.3*DPR;
    ctx.beginPath();
    ctx.moveTo(-r*0.10, -r*0.55);
    ctx.lineTo(-r*0.65, -r*1.20);
    ctx.moveTo(r*0.15, -r*0.55);
    ctx.lineTo(-r*0.15, -r*1.35);
    ctx.moveTo(r*1.10, r*0.15);
    ctx.lineTo(r*1.90, -r*0.25);
    ctx.stroke();

    ctx.restore();
  }

  function drawQuote(d){
    // Quote follows near head, but never in the exact CORE center region
    if(!d.quote) return;

    var p0 = d.pts[0];
    var p1 = d.pts[1];
    var ang = Math.atan2(p1.y-p0.y, p1.x-p0.x);

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(212,175,55,0.78)";
    ctx.shadowColor = "rgba(212,175,55,0.35)";
    ctx.shadowBlur = 10*DPR;
    ctx.font = (12*DPR) + "px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

    ctx.translate(p0.x, p0.y);
    ctx.rotate(ang);

    // offset above body
    ctx.fillText(d.quote, -ctx.measureText(d.quote).width*0.10, -d.thickness*1.15);

    ctx.restore();
  }

  // ---------- Motion update ----------
  function updateDragon(d, dt, t){
    var pts = d.pts;
    var head = pts[0];

    // Natural slither: slow phase + low-frequency curve
    var vy = Math.sin((t*0.0007) + d.t0) * d.waveAmp;
    var yTarget = d.y0 + vy;

    // Head x target moves steadily; y is smoothed
    head.x += d.dir * d.speed * dt;
    head.y = lerp(head.y, yTarget, 0.065);

    // Follow chain with springy distance constraint
    var targetDist = 18*DPR;
    for(var i=1;i<pts.length;i++){
      var prev = pts[i-1];
      var cur = pts[i];

      var dx = prev.x - cur.x;
      var dy = prev.y - cur.y;
      var dist = Math.sqrt(dx*dx + dy*dy) || 1;

      var nx = dx / dist;
      var ny = dy / dist;

      var desiredX = prev.x - nx*targetDist;
      var desiredY = prev.y - ny*targetDist;

      // Smooth correction (prevents jitter)
      cur.x = lerp(cur.x, desiredX, 0.28);
      cur.y = lerp(cur.y, desiredY, 0.28);
    }

    // Reset only when FULLY off-screen (so you get a complete traverse)
    if(d.dir < 0 && head.x < -d.margin){
      head.x = W + d.margin;
      // keep y continuous but re-center slightly
      head.y = d.y0 + Math.sin((t*0.0007) + d.t0) * d.waveAmp;
      pickNextQuote(d);
    }
  }

  // ---------- Loop ----------
  var last = 0;
  var acc = 0;

  function frame(ts){
    if(!last) last = ts;
    var dtMs = ts - last;
    last = ts;

    acc += dtMs;
    if(acc < FRAME_MS){
      requestAnimationFrame(frame);
      return;
    }
    // drop lag to avoid spiral-of-death
    acc = 0;

    var dt = clamp(dtMs/1000, 0, 0.05);

    ctx.clearRect(0,0,W,H);

    // Update + render order: body -> head -> quote
    updateDragon(topDragon, dt, ts);
    updateDragon(botDragon, dt, ts);

    drawRibbon(topDragon, ts);
    drawRibbon(botDragon, ts);

    drawHead(topDragon);
    drawHead(botDragon);

    drawQuote(topDragon);
    drawQuote(botDragon);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

})();
