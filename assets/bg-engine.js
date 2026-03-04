/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE v1.3 (MOON FIX + NO-SPIN)
   RULES:
   - Single canvas only: id="gd_bg_canvas" (reuse if exists)
   - Moon is STATIC per page load (random phase once; NO animation)
   - No transforms on moon (no rotate/translate accumulation)
   - 30fps budget + DPR cap for mobile
   - Pointer-events none
*/

(function(){
  "use strict";

  // ---------- helpers ----------
  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  // stable RNG (for crater layout, clouds)
  function mulberry32(seed){
    var t = seed >>> 0;
    return function(){
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- canvas (single instance) ----------
  function getOrCreateCanvas(){
    var c = document.getElementById("gd_bg_canvas");
    if(c) return c;

    c = document.createElement("canvas");
    c.id = "gd_bg_canvas";
    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.zIndex = "0";
    c.style.pointerEvents = "none";
    c.style.userSelect = "none";
    c.style.opacity = "1";
    (document.body || document.documentElement).prepend(c);
    return c;
  }

  var canvas = getOrCreateCanvas();
  var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });
  if(!ctx) return;

  // ---------- budget ----------
  var DPR_CAP = 1.6;
  var TARGET_FPS = 30;
  var FRAME_MS = 1000 / TARGET_FPS;

  var W=0,H=0,DPR=1;

  function resize(){
    var ww = Math.max(1, window.innerWidth || 1);
    var hh = Math.max(1, window.innerHeight || 1);
    var dpr = 1;
    try{ dpr = window.devicePixelRatio || 1; }catch(e){}
    DPR = clamp(dpr, 1, DPR_CAP);
    W = Math.floor(ww * DPR);
    H = Math.floor(hh * DPR);
    canvas.width = W;
    canvas.height = H;
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  // ---------- STATIC MOON (drawn to sprite ONCE) ----------
  // Random phase once per page load. No storage.
  var moonPhase = Math.random(); // 0=new, 0.5=full
  var moonSeed  = ((Date.now() ^ ((Math.random()*1e9)|0)) >>> 0);
  var rnd = mulberry32(moonSeed);

  // crater layout (normalized in [-1,1])
  var craters = [];
  (function seedCraters(){
    var count = 18;
    for(var i=0;i<count;i++){
      var ang = rnd()*Math.PI*2;
      var rad = Math.pow(rnd(), 0.62) * 0.78;
      craters.push({
        u: Math.cos(ang)*rad,
        v: Math.sin(ang)*rad,
        rr: lerp(0.05, 0.16, rnd()),
        a:  lerp(0.10, 0.28, rnd())
      });
    }
  })();

  // Offscreen sprite so moon never “spins”
  var moonSprite = document.createElement("canvas");
  var mctx = moonSprite.getContext("2d");

  function buildMoonSprite(){
    // size in device pixels for sharpness
    var mr = Math.min(W,H) * 0.062;          // radius
    var pad = mr * 3.2;                      // halo padding
    var S = Math.ceil((mr*2) + pad*2);

    moonSprite.width = S;
    moonSprite.height = S;

    var cx = S/2, cy = S/2;

    mctx.clearRect(0,0,S,S);
    mctx.save();

    // halo
    var halo = mctx.createRadialGradient(cx, cy, mr*0.2, cx, cy, mr*2.8);
    halo.addColorStop(0, "rgba(255,248,230,0.24)");
    halo.addColorStop(0.35, "rgba(255,225,170,0.14)");
    halo.addColorStop(1, "rgba(255,225,170,0)");
    mctx.fillStyle = halo;
    mctx.beginPath();
    mctx.arc(cx, cy, mr*2.8, 0, Math.PI*2);
    mctx.fill();

    // base disc
    mctx.shadowColor = "rgba(255,245,225,0.48)";
    mctx.shadowBlur = 28*DPR;
    mctx.fillStyle = "rgba(255,246,232,0.98)";
    mctx.beginPath();
    mctx.arc(cx, cy, mr, 0, Math.PI*2);
    mctx.fill();
    mctx.shadowBlur = 0;

    // phase shading INSIDE SAME DISC (no double moon)
    var k = Math.cos(moonPhase * Math.PI * 2); // -1..1
    var shift = k * mr * 0.58;

    mctx.save();
    mctx.beginPath();
    mctx.arc(cx, cy, mr, 0, Math.PI*2);
    mctx.clip();
    mctx.fillStyle = "rgba(0,0,0,0.62)";
    mctx.beginPath();
    mctx.arc(cx + shift, cy, mr, 0, Math.PI*2);
    mctx.fill();
    mctx.restore();

    // crater detail (stable)
    mctx.save();
    mctx.beginPath();
    mctx.arc(cx, cy, mr, 0, Math.PI*2);
    mctx.clip();

    // rim shading for depth
    var rim = mctx.createRadialGradient(cx - mr*0.25, cy - mr*0.25, mr*0.15, cx, cy, mr);
    rim.addColorStop(0, "rgba(0,0,0,0.00)");
    rim.addColorStop(1, "rgba(0,0,0,0.18)");
    mctx.fillStyle = rim;
    mctx.fillRect(cx-mr, cy-mr, mr*2, mr*2);

    for(var i=0;i<craters.length;i++){
      var c = craters[i];
      var px = cx + c.u * mr;
      var py = cy + c.v * mr;
      var pr = c.rr * mr;

      // crater body
      mctx.fillStyle = "rgba(0,0,0,"+c.a+")";
      mctx.beginPath();
      mctx.arc(px, py, pr, 0, Math.PI*2);
      mctx.fill();

      // inner highlight lip
      mctx.fillStyle = "rgba(255,255,255,0.09)";
      mctx.beginPath();
      mctx.arc(px - pr*0.18, py - pr*0.18, pr*0.55, 0, Math.PI*2);
      mctx.fill();
    }

    mctx.restore();
    mctx.restore();
  }

  buildMoonSprite();

  // Rebuild sprite on resize to keep sharpness (still static)
  window.addEventListener("resize", function(){
    // resize() already updated W/H/DPR; rebuild sprite once
    buildMoonSprite();
  }, {passive:true});

  // ---------- clouds (reflection plane) ----------
  var cloudSeed = ((moonSeed ^ 0xA5A5A5A5) >>> 0);
  var crnd = mulberry32(cloudSeed);
  var blobs = [];
  var blobCount = 36;
  function seedClouds(){
    blobs = [];
    for(var i=0;i<blobCount;i++){
      blobs.push({
        x: crnd()*W,
        y: crnd()*H,
        r: lerp(60, 220, crnd()) * DPR,
        a: lerp(0.02, 0.07, crnd()),
        sx: lerp(10, 32, crnd()) * DPR, // px/sec (slow)
        hue: (crnd()<0.7) ? "warm" : "opal"
      });
    }
  }
  seedClouds();
  window.addEventListener("resize", seedClouds, {passive:true});

  // ---------- draw sky ----------
  function drawSky(){
    // Target: red, dark, red, dark (not red-dark-dark-dark)
    var g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0.00, "rgba(210,70,40,0.22)");
    g.addColorStop(0.30, "rgba(70,10,20,0.20)");
    g.addColorStop(0.62, "rgba(180,55,30,0.16)");
    g.addColorStop(1.00, "rgba(0,0,0,0.18)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
  }

  // ---------- draw clouds (soft, with depth) ----------
  function drawClouds(t){
    var yMin = H*0.45; // reflection plane
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for(var i=0;i<blobs.length;i++){
      var b = blobs[i];
      var x = (b.x + (t*0.001)*b.sx) % (W + b.r*2) - b.r;
      var y = clamp(b.y, yMin, H);

      // depth: layered radial gradient (core + outer)
      var col = (b.hue==="opal") ? "rgba(160,120,255,1)" : "rgba(255,200,140,1)";
      ctx.globalAlpha = b.a;

      var g1 = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      g1.addColorStop(0, col);
      g1.addColorStop(0.55, "rgba(255,255,255,0.10)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI*2);
      ctx.fill();

      // subtle shadow underlayer (adds form)
      ctx.globalAlpha = b.a*0.65;
      var g2 = ctx.createRadialGradient(x, y + b.r*0.15, 0, x, y + b.r*0.15, b.r*0.9);
      g2.addColorStop(0, "rgba(0,0,0,0.14)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x, y + b.r*0.15, b.r*0.9, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------- draw moon (static sprite blit) ----------
  function drawMoon(){
    var mx = W*0.78;
    var my = H*0.18;
    var S = moonSprite.width;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(moonSprite, mx - S/2, my - S/2);
    ctx.restore();
  }

  // ---------- moon reflection ----------
  function drawMoonReflection(){
    var mx = W*0.78;
    var mr = Math.min(W,H) * 0.062;
    var y0 = H*0.62;
    var w = mr*2.8;
    var h = mr*4.0;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.56;

    var g = ctx.createLinearGradient(mx, y0, mx, y0+h);
    g.addColorStop(0, "rgba(255,235,190,0.18)");
    g.addColorStop(0.35, "rgba(255,200,150,0.10)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(mx, y0 + h*0.22, w*0.40, h*0.44, 0, 0, Math.PI*2);
    ctx.fill();

    // gentle ripple breakup
    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1*DPR;
    for(var i=0;i<7;i++){
      var yy = y0 + i*(h/7);
      ctx.beginPath();
      ctx.ellipse(mx, yy, w*(0.22 + i*0.10), 6*DPR, 0, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ---------- water dial ripple (slow, outward feel) ----------
  function drawWaterDial(t){
    var cx = W*0.5, cy = H*0.50;
    var r = Math.min(W,H)*0.32;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.clip();

    // base tint
    var grd = ctx.createRadialGradient(cx, cy-r*0.2, r*0.2, cx, cy, r);
    grd.addColorStop(0, "rgba(255,220,180,0.08)");
    grd.addColorStop(0.55, "rgba(255,160,120,0.05)");
    grd.addColorStop(1, "rgba(0,0,0,0.00)");
    ctx.fillStyle = grd;
    ctx.fillRect(cx-r, cy-r, r*2, r*2);

    // outward motion (slow)
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1*DPR;
    var base = (t*0.00022) % 1; // MUCH slower than before
    for(var i=0;i<8;i++){
      var rr = r * (0.18 + (i*0.105) + base*0.105);
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ---------- loop ----------
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

    ctx.clearRect(0,0,W,H);

    // ORDER: sky → moon (static) → reflection → clouds → dial ripples
    drawSky();
    drawMoon();
    drawMoonReflection();
    drawClouds(ts);
    drawWaterDial(ts);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

})();
