/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE v1.2 (MOON FIX FIRST)
   PURPOSE (THIS PASS):
     - SINGLE MOON ONLY (no “double moon” artifact)
     - RANDOM PHASE EACH PAGE LOAD (no storage)
     - CINEMATIC GLOW + REAL CRATER DETAIL (stable, not flickering)
     - MOON REFLECTION ON WATER PLANE
     - KEEP: subtle water ripple over compass face region (circular clip)
     - KEEP: evening sky gradient (brighter, no competition)
   CONSTRAINTS:
     - Canvas-only (no DOM animation, no pointer capture)
     - No new gd_* keys
     - 30fps target + DPR cap
     - One fixed canvas, pointer-events none
*/
(function(){
  "use strict";

  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  // -------- deterministic rand (stable craters) --------
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
    var DPR_CAP = (opts.dpr_cap != null) ? opts.dpr_cap : 1.6;
    var TARGET_FPS = (opts.fps != null) ? opts.fps : 30;
    var FRAME_MS = 1000 / TARGET_FPS;

    var W=0,H=0,DPR=1;

    // ---- moon params (random per load; no storage) ----
    var moonPhase = Math.random(); // 0=new, 0.5=full
    var craterSeed = ((Date.now() ^ (Math.random()*1e9)) >>> 0);
    var rnd = mulberry32(craterSeed);

    // Store craters in normalized coords so resize does NOT change pattern
    var cratersN = [];

    function seedCratersNormalized(){
      cratersN = [];
      var count = (opts.crater_count != null) ? opts.crater_count : 16;
      for(var i=0;i<count;i++){
        var ang = rnd()*Math.PI*2;
        var rad = Math.pow(rnd(), 0.62) * 0.78;  // bias inward
        var u = Math.cos(ang)*rad;
        var v = Math.sin(ang)*rad;
        var rr = lerp(0.05, 0.16, rnd());
        var a  = lerp(0.10, 0.28, rnd());
        cratersN.push({u:u,v:v,rr:rr,a:a});
      }
    }
    seedCratersNormalized();

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
    // SKY — brighter evening gradient (no competition)
    // =========================================================
    function drawSky(){
      var g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0.00, "rgba(210,70,40,0.22)");
      g.addColorStop(0.28, "rgba(120,20,20,0.16)");
      g.addColorStop(0.58, "rgba(180,55,30,0.14)");
      g.addColorStop(1.00, "rgba(0,0,0,0.18)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);
    }

    // =========================================================
    // MOON — single disc + clipped phase shadow (no double moon)
    // =========================================================
    function drawMoon(){
      var mx = W*0.78;
      var my = H*0.18;

      var mr = Math.min(W,H) * ((opts.moon_radius != null) ? opts.moon_radius : 0.062);

      // glow halo
      ctx.save();
      ctx.globalCompositeOperation = "source-over";

      var halo = ctx.createRadialGradient(mx, my, mr*0.2, mx, my, mr*2.8);
      halo.addColorStop(0, "rgba(255,248,230,0.24)");
      halo.addColorStop(0.35, "rgba(255,225,170,0.14)");
      halo.addColorStop(1, "rgba(255,225,170,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(mx, my, mr*2.8, 0, Math.PI*2);
      ctx.fill();

      // base disc
      ctx.shadowColor = "rgba(255,245,225,0.48)";
      ctx.shadowBlur = 28*DPR;
      ctx.fillStyle = "rgba(255,246,232,0.98)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // phase shading: clipped inside the SAME moon circle
      var k = Math.cos(moonPhase * Math.PI * 2); // -1..1
      var shift = k * mr * 0.58;

      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.clip();
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      ctx.beginPath();
      ctx.arc(mx + shift, my, mr, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      // crater detail (stable; no flicker)
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.clip();

      // subtle rim shading for depth
      var rim = ctx.createRadialGradient(mx - mr*0.25, my - mr*0.25, mr*0.15, mx, my, mr);
      rim.addColorStop(0, "rgba(0,0,0,0.00)");
      rim.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = rim;
      ctx.fillRect(mx-mr, my-mr, mr*2, mr*2);

      for(var i=0;i<cratersN.length;i++){
        var c = cratersN[i];

        var cx = mx + c.u * mr;
        var cy = my + c.v * mr;
        var cr = c.rr * mr;

        // crater body
        ctx.fillStyle = "rgba(0,0,0,"+c.a+")";
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI*2);
        ctx.fill();

        // inner highlight (lip)
        ctx.fillStyle = "rgba(255,255,255,0.09)";
        ctx.beginPath();
        ctx.arc(cx - cr*0.18, cy - cr*0.18, cr*0.55, 0, Math.PI*2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();

      drawMoonReflection(mx, mr);
    }

    function drawMoonReflection(mx, mr){
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

      // gentle ripple breakup (cheap)
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

    // =========================================================
    // WATER DIAL RIPPLE — subtle center clip (kept)
    // =========================================================
    function drawWaterDial(t){
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
    // LOOP (30fps)
    // =========================================================
    var last = 0;
    var acc = 0;

    function frame(ts){
      if(!last) last = ts;
      var dt = ts - last;
      last = ts;

      if(reduce){
        ctx.clearRect(0,0,W,H);
        drawSky();
        drawMoon();
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
      drawSky();
      drawMoon();
      drawWaterDial(ts);

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    return canvas;
  }

  // Public API
  window.GD_BG = { mount: mount };

})();
