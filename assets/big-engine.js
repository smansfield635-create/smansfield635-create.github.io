/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE v1.2 (MOON FIX FIRST)
   PURPOSE (THIS PASS):
     - SINGLE MOON ONLY (no “double moon” artifact)
     - RANDOM PHASE EACH PAGE LOAD (no storage)
     - CINEMATIC GLOW + REAL CRATER DETAIL (stable, not flickering)
     - MOON REFLECTION ON WATER PLANE
   KEEP (FROM v1):
     - Canvas-only (no DOM animation, no pointer capture)
     - No new gd_* keys
     - 30fps target + DPR cap
     - One fixed canvas, pointer-events none
*/
(function(){
  "use strict";

  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  // -------- deterministic-ish rand (stable craters) --------
  function mulberry32(seed){
    var t = seed >>> 0;
    return function(){
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function createCanvas(){
    var c = document.createElement("canvas");
    c.id = "gd_bg_canvas";
    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.zIndex = "0";
    c.style.pointerEvents = "none";
    c.style.userSelect = "none";
    c.style.opacity = "1";
    return c;
  }

  function mount(opts){
    opts = opts || {};

    var reduce = false;
    try{
      reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }catch(e){}

    // If already mounted, just update settings.
    var existing = document.getElementById("gd_bg_canvas");
    if(existing){
      existing.__GD_OPTS = opts;
      return existing;
    }

    var canvas = createCanvas();
    canvas.__GD_OPTS = opts;

    (document.body || document.documentElement).prepend(canvas);

    var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });
    if(!ctx) return canvas;

    // ---- Render budget ----
    var DPR_CAP = opts.dpr_cap || 1.6;
    var TARGET_FPS = opts.fps || 30;
    var FRAME_MS = 1000 / TARGET_FPS;

    var W=0,H=0,DPR=1;
    function resize(){
      var ww = Math.max(1, window.innerWidth || 1);
      var hh = Math.max(1, window.innerHeight || 1);
      var dpr = 1;
      try{ dpr = window.devicePixelRatio || 1; }catch(e){}
      DPR = Math.min(DPR_CAP, Math.max(1, dpr));
      W = Math.floor(ww * DPR);
      H = Math.floor(hh * DPR);
      canvas.width = W;
      canvas.height = H;
    }
    resize();
    window.addEventListener("resize", resize, {passive:true});

    // =========================================================
    // MOON (SINGLE, RANDOM PHASE PER LOAD, STABLE CRATERS)
    // =========================================================
    // Phase: 0=new, 0.5=full, 1=wrap
    var moonPhase = Math.random();

    // Fixed seed for crater placement this load
    var craterSeed = ((Date.now() ^ (Math.random()*1e9)) >>> 0);
    var rnd = mulberry32(craterSeed);

    var craters = [];
    function seedCraters(mx,my,mr){
      craters = [];
      var count = 12;
      for(var i=0;i<count;i++){
        // keep within disc (bias toward mid)
        var ang = rnd()*Math.PI*2;
        var rad = Math.pow(rnd(), 0.65) * mr * 0.78;
        var x = mx + Math.cos(ang)*rad;
        var y = my + Math.sin(ang)*rad;
        var r = mr * lerp(0.05, 0.16, rnd());
        var a = lerp(0.10, 0.28, rnd());
        craters.push({x:x,y:y,r:r,a:a});
      }
    }

    function drawMoon(t){
      var mx = W*0.78;
      var my = H*0.18;
      var mr = Math.min(W,H) * (opts.moon_radius || 0.060); // slightly larger than before
      if(craters.length === 0) seedCraters(mx,my,mr);

      // glow halo
      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      var halo = ctx.createRadialGradient(mx, my, mr*0.2, mx, my, mr*2.6);
      halo.addColorStop(0, "rgba(255,248,230,0.22)");
      halo.addColorStop(0.35, "rgba(255,225,170,0.12)");
      halo.addColorStop(1, "rgba(255,225,170,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(mx, my, mr*2.6, 0, Math.PI*2);
      ctx.fill();

      // base disc
      ctx.shadowColor = "rgba(255,245,225,0.40)";
      ctx.shadowBlur = 26*DPR;
      ctx.fillStyle = "rgba(255,246,232,0.96)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // phase shading (SINGLE-MOON METHOD)
      // Use a dark disc shifted by terminator parameter, but CLIPPED to the moon.
      // This avoids the “double moon” / eclipse look.
      var k = Math.cos(moonPhase * Math.PI * 2); // -1..1
      var shift = k * mr * 0.55;

      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.clip();
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      ctx.beginPath();
      ctx.arc(mx + shift, my, mr, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      // crater shading (stable; no flicker)
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.clip();

      // subtle terminator-side darkening for depth
      var rim = ctx.createRadialGradient(mx - mr*0.2, my - mr*0.2, mr*0.2, mx, my, mr);
      rim.addColorStop(0, "rgba(0,0,0,0.00)");
      rim.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = rim;
      ctx.fillRect(mx-mr, my-mr, mr*2, mr*2);

      for(var i=0;i<craters.length;i++){
        var c = craters[i];
        // crater ring
        ctx.fillStyle = "rgba(0,0,0,"+c.a+")";
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
        ctx.fill();
        // inner highlight (gives crater lip)
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.arc(c.x - c.r*0.18, c.y - c.r*0.18, c.r*0.55, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();

      ctx.restore();

      drawMoonReflection(mx, my, mr);
    }

    function drawMoonReflection(mx, my, mr){
      // reflection lives in water plane (lower half)
      var y0 = H*0.62;
      var w = mr*2.6;
      var h = mr*3.8;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.55;

      // soft column
      var g = ctx.createLinearGradient(mx, y0, mx, y0+h);
      g.addColorStop(0, "rgba(255,235,190,0.16)");
      g.addColorStop(0.35, "rgba(255,200,150,0.09)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(mx, y0 + h*0.22, w*0.38, h*0.42, 0, 0, Math.PI*2);
      ctx.fill();

      // slight ripple breakup
      ctx.globalAlpha = 0.42;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1*DPR;
      for(var i=0;i<6;i++){
        var yy = y0 + i*(h/6);
        ctx.beginPath();
        ctx.ellipse(mx, yy, w*(0.20 + i*0.10), 6*DPR, 0, 0, Math.PI*2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // =========================================================
    // SKY (brighter evening gradient; no competition with compass)
    // =========================================================
    function drawSky(t){
      // “red, dark, red, dark” feeling: red sky, darker mid, red haze, dark base
      var g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0.00, "rgba(210,70,40,0.20)");
      g.addColorStop(0.28, "rgba(120,20,20,0.16)");
      g.addColorStop(0.58, "rgba(180,55,30,0.14)");
      g.addColorStop(1.00, "rgba(0,0,0,0.18)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    }

    // =========================================================
    // Minimal placeholders for later layers (kept, but “safe”)
    // =========================================================
    function drawWaterDial(t){
      // Subtle center ripple (kept)
      var cx = W*0.5, cy = H*0.50;
      var r = Math.min(W,H)*0.32;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.clip();

      var grd = ctx.createRadialGradient(cx, cy-r*0.2, r*0.2, cx, cy, r);
      grd.addColorStop(0, "rgba(255,220,180,0.08)");
      grd.addColorStop(0.55, "rgba(255,160,120,0.05)");
      grd.addColorStop(1, "rgba(0,0,0,0.00)");
      ctx.fillStyle = grd;
      ctx.fillRect(cx-r, cy-r, r*2, r*2);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1*DPR;
      var base = (t*0.0012) % 1;
      for(var i=0;i<7;i++){
        var rr = r * (0.22 + (i*0.11) + base*0.11);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI*2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // =========================================================
    // LOOP
    // =========================================================
    var last = 0;
    var acc = 0;
    function frame(ts){
      if(!last) last = ts;
      var dt = ts - last;
      last = ts;

      if(reduce){
        ctx.clearRect(0,0,W,H);
        drawSky(ts);
        drawMoon(ts);
        drawWaterDial(ts);
        return;
      }

      acc += dt;
      if(acc < FRAME_MS){
        requestAnimationFrame(frame);
        return;
      }
      acc = 0;

      ctx.clearRect(0,0,W,H);

      // Order: sky → moon(+reflection) → water dial
      drawSky(ts);
      drawMoon(ts);
      drawWaterDial(ts);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return canvas;
  }

  // Public API
  window.GD_BG = { mount: mount };

})();
