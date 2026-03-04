/* =====================================================
   GEODIAMETRICS DRAGON ANATOMY ENGINE — CANONICAL
   FILE: /assets/dragon-anatomy.js
   TNT: FULL FILE REPLACEMENT

   FIXES:
   - SINGLETON GUARD (prevents duplicate dragon loops)
   - CONFIGURABLE SPEED/GIRTH/SEGMENTS (via GD_DRAGON.mount)
   - ONSCREEN DEBUG STAMP (proves which file/version is running)
   - TIME-BASED MOTION (speed actually changes)

   ENGLISH-ONLY VISUAL PASS
   NO NEW gd_* KEYS
===================================================== */
(function(){
  "use strict";

  var VERSION = "DRAGON_ANATOMY v1.0";

  // ---- Singleton guard ----
  if (window.__GD_DRAGON_RUNNING__) {
    // If a second copy loads, do nothing.
    return;
  }
  window.__GD_DRAGON_RUNNING__ = true;

  // ---- Canvas ----
  var canvas = document.getElementById("gd_dragon_canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "gd_dragon_canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    // Between compass plate and gems. Keep below gems; above bg.
    canvas.style.zIndex = "9";
    document.body.appendChild(canvas);
  }

  var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });
  if (!ctx) return;

  var W=0, H=0, DPR=1;
  function resize(){
    var ww = Math.max(1, window.innerWidth || 1);
    var hh = Math.max(1, window.innerHeight || 1);
    var dpr = 1;
    try { dpr = window.devicePixelRatio || 1; } catch(e){}
    DPR = Math.min(1.6, Math.max(1, dpr));
    W = Math.floor(ww * DPR);
    H = Math.floor(hh * DPR);
    canvas.width = W;
    canvas.height = H;
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  // ---- Debug stamp (visible proof) ----
  var debugEl = document.getElementById("gd_dragon_debug");
  if (!debugEl) {
    debugEl = document.createElement("div");
    debugEl.id = "gd_dragon_debug";
    debugEl.style.position = "fixed";
    debugEl.style.left = "10px";
    debugEl.style.bottom = "10px";
    debugEl.style.zIndex = "9999";
    debugEl.style.pointerEvents = "none";
    debugEl.style.font = "12px ui-monospace, Menlo, Consolas, monospace";
    debugEl.style.color = "rgba(255,255,255,0.75)";
    debugEl.style.textShadow = "0 2px 8px rgba(0,0,0,0.75)";
    debugEl.style.background = "rgba(0,0,0,0.25)";
    debugEl.style.border = "1px solid rgba(255,255,255,0.12)";
    debugEl.style.borderRadius = "10px";
    debugEl.style.padding = "6px 10px";
    document.body.appendChild(debugEl);
    // Auto-hide after 8s (still enough to screenshot)
    setTimeout(function(){
      if (debugEl) debugEl.style.display = "none";
    }, 8000);
  }

  // ---- Config (defaults are SLOW) ----
  var CFG = {
    speed_px_per_s: 70,      // SLOW by default
    girth: 2.4,              // thickness multiplier
    segments: 90,            // more segments = smoother
    lane_y: 0.30,            // 0..1 vertical band
    amplitude: 18,           // vertical slither amplitude (px)
    wavelength: 0.012,       // smaller = longer waves
    color_body: "rgba(0,55,35,0.88)",
    color_edge: "rgba(0,0,0,0.30)",
    color_gold: "rgba(212,175,55,0.35)"
  };

  function applyCfg(next){
    if (!next) return;
    if (typeof next.speed === "number") CFG.speed_px_per_s = Math.max(10, Math.min(220, next.speed));
    if (typeof next.girth === "number") CFG.girth = Math.max(1.2, Math.min(6.0, next.girth));
    if (typeof next.segments === "number") CFG.segments = Math.max(40, Math.min(160, next.segments));
    if (typeof next.lane_y === "number") CFG.lane_y = Math.max(0.10, Math.min(0.90, next.lane_y));
  }

  // Public API so the page can set speed/girth reliably
  window.GD_DRAGON = {
    mount: function(opts){
      applyCfg(opts);
      return true;
    },
    version: VERSION
  };

  // Apply any pre-set config (if index sets window.__GD_DRAGON_CFG__)
  try { applyCfg(window.__GD_DRAGON_CFG__); } catch(e){}

  // ---- Spine init ----
  var spine = [];
  function initSpine(){
    spine = [];
    var seg = CFG.segments;
    for (var i=0;i<seg;i++){
      spine.push({x: -i*18*DPR, y: H*CFG.lane_y});
    }
  }
  initSpine();

  // ---- Draw head (simple but directional) ----
  function drawHead(p, dir){
    var x=p.x, y=p.y;
    var s = 18 * CFG.girth * DPR;

    // Skull
    ctx.fillStyle = "rgba(0,75,45,0.95)";
    ctx.beginPath();
    ctx.ellipse(x, y, s*1.05, s*0.85, 0, 0, Math.PI*2);
    ctx.fill();

    // Snout
    ctx.fillStyle = "rgba(0,60,38,0.95)";
    ctx.beginPath();
    ctx.ellipse(x + dir*s*0.95, y + s*0.10, s*0.95, s*0.55, 0, 0, Math.PI*2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "rgba(212,175,55,0.95)";
    ctx.beginPath();
    ctx.arc(x + dir*s*0.35, y - s*0.18, s*0.14, 0, Math.PI*2);
    ctx.fill();

    // Horns / whiskers
    ctx.strokeStyle = CFG.color_gold;
    ctx.lineWidth = 2*DPR;
    ctx.beginPath();
    ctx.moveTo(x - dir*s*0.15, y - s*0.55);
    ctx.lineTo(x - dir*s*0.55, y - s*1.25);
    ctx.moveTo(x + dir*s*0.25, y - s*0.55);
    ctx.lineTo(x + dir*s*0.05, y - s*1.35);
    ctx.stroke();

    ctx.lineWidth = 1.5*DPR;
    ctx.beginPath();
    ctx.moveTo(x + dir*s*1.55, y + s*0.10);
    ctx.lineTo(x + dir*s*2.40, y - s*0.40);
    ctx.moveTo(x + dir*s*1.55, y + s*0.18);
    ctx.lineTo(x + dir*s*2.30, y + s*0.55);
    ctx.stroke();
  }

  // ---- Draw body (thick, with subtle scale arcs) ----
  function drawBody(){
    var seg = spine.length;
    if (seg < 10) return;

    // Build path
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    var thick = 10 * CFG.girth * DPR;

    // Shadow edge
    ctx.strokeStyle = CFG.color_edge;
    ctx.lineWidth = thick + 7*DPR;
    ctx.beginPath();
    for (var i=0;i<seg;i++){
      var p = spine[i];
      if (i===0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    // Main body
    ctx.strokeStyle = CFG.color_body;
    ctx.lineWidth = thick;
    ctx.beginPath();
    for (var j=0;j<seg;j++){
      var q = spine[j];
      if (j===0) ctx.moveTo(q.x, q.y);
      else ctx.lineTo(q.x, q.y);
    }
    ctx.stroke();

    // Scale hint arcs (cheap)
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1.2*DPR;
    for (var k=6;k<seg-6;k+=3){
      var a = spine[k];
      var b = spine[k+1];
      var ang = Math.atan2(b.y-a.y, b.x-a.x);
      var rr = thick*0.55;
      ctx.beginPath();
      ctx.arc(a.x, a.y, rr, ang+0.7, ang+2.0);
      ctx.stroke();
    }
  }

  // ---- Motion (time-based) ----
  var lastT = 0;
  var phase = Math.random()*1000;
  var dir = -1; // right->left feel by moving head leftwards? We'll keep left->right for now and flip text later if needed.

  function step(t){
    if (!lastT) lastT = t;
    var dt = (t - lastT) / 1000; // seconds
    lastT = t;

    // Update config debug
    debugEl.textContent = VERSION + " | speed=" + Math.round(CFG.speed_px_per_s) + "px/s | girth=" + CFG.girth.toFixed(1) + " | seg=" + CFG.segments;

    // Ensure spine matches segment count if changed
    if (spine.length !== CFG.segments) initSpine();

    // Move head
    phase += dt;
    var head = spine[0];
    head.x += (CFG.speed_px_per_s * DPR) * dt;
    head.y = H*CFG.lane_y + Math.sin(phase*2.0) * (CFG.amplitude*DPR);

    // Wrap after full exit
    if (head.x > W + 260*DPR){
      head.x = -260*DPR;
    }

    // Follow chain with fixed spacing
    var target = 16*DPR;
    for (var i=1;i<spine.length;i++){
      var prev = spine[i-1];
      var cur = spine[i];
      var dx = prev.x - cur.x;
      var dy = prev.y - cur.y;
      var dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;
      cur.x = prev.x - (dx/dist) * target;
      cur.y = prev.y - (dy/dist) * target;
    }
  }

  function render(t){
    ctx.clearRect(0,0,W,H);
    step(t);
    drawBody();
    drawHead(spine[0], 1);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

})();
