/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE v1.3 (MOON SPIN FIX)
   FIX:
   - Moon “spinning” was caused by re-drawing + re-randomizing crater/shadow details every frame.
   - This version PRE-RENDERS the moon (phase + craters) ONCE per page load to an offscreen canvas,
     then BLITS it each frame. Result: stable moon, no rotation/spin, no flicker.
   KEEP:
   - Single moon only
   - Random phase each page load (no storage)
   - Cinematic glow + crater detail
   - Moon reflection
   - Subtle water ripple clipped to compass face circle
   CONSTRAINTS:
   - Canvas-only, pointer-events none
   - No gd_* keys, no storage
   - 30fps + DPR cap
*/

(function(){
  "use strict";

  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  function mulberry32(seed){
    var t = seed >>> 0;
    return function(){
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Canvas ----------
  var canvas = document.createElement("canvas");
  canvas.id = "gd_bg_canvas";
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.userSelect = "none";
  document.body.prepend(canvas);

  var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });

  // ---------- Budget ----------
  var DPR_CAP = 1.6;
  var FPS = 30;
  var FRAME_MS = 1000 / FPS;

  var W=0,H=0,DPR=1;

  // ---------- Moon (random per load; STABLE render) ----------
  var moonPhase = Math.random(); // 0=new, 0.5=full
  var craterSeed = ((Date.now() ^ ((Math.random()*1e9)|0)) >>> 0);
  var rnd = mulberry32(craterSeed);

  // Precomputed normalized crater map (stable)
  var cratersN = [];
  function seedCratersNormalized(){
    cratersN = [];
    var count = 18;
    for(var i=0;i<count;i++){
      var ang = rnd()*Math.PI*2;
      var rad = Math.pow(rnd(), 0.62) * 0.78;
      var u = Math.cos(ang)*rad;
      var v = Math.sin(ang)*rad;
      var rr = lerp(0.05, 0.16, rnd());
      var a  = lerp(0.10, 0.28, rnd());
      cratersN.push({u:u,v:v,rr:rr,a:a});
    }
  }
  seedCratersNormalized();

  // Offscreen moon cache (rebuilt on resize only)
  var moonCache = document.createElement("canvas");
  var moonCtx = moonCache.getContext("2d", { alpha:true });

  // Moon placement and size
  function moonParams(){
    var mx = W*0.78;
    var my = H*0.18;
    var mr = Math.min(W,H) * 0.062; // larger, clearer
    return {mx:mx,my:my,mr:mr};
  }

  function rebuildMoonCache(){
    var p = moonParams();
    var pad = p.mr * 3.2; // include glow
    var size = Math.ceil(pad*2);
    moonCache.width = size;
    moonCache.height = size;

    var mc = moonCtx;
    mc.clearRect(0,0,size,size);

    var cx = size/2;
    var cy = size/2;
    var r = p.mr;

    // Glow halo
    var halo = mc.createRadialGradient(cx, cy, r*0.2, cx, cy, r*2.8);
    halo.addColorStop(0, "rgba(255,248,230,0.24)");
    halo.addColorStop(0.35, "rgba(255,225,170,0.14)");
    halo.addColorStop(1, "rgba(255,225,170,0)");
    mc.fillStyle = halo;
    mc.beginPath();
    mc.arc(cx, cy, r*2.8, 0, Math.PI*2);
    mc.fill();

    // Base disc
    mc.shadowColor = "rgba(255,245,225,0.48)";
    mc.shadowBlur = 28*DPR;
    mc.fillStyle = "rgba(255,246,232,0.98)";
    mc.beginPath();
    mc.arc(cx, cy, r, 0, Math.PI*2);
    mc.fill();
    mc.shadowBlur = 0;

    // Phase shadow INSIDE SAME disc (no double moon)
    var k = Math.cos(moonPhase * Math.PI * 2); // -1..1
    var shift = k * r * 0.58;

    mc.save();
    mc.beginPath();
    mc.arc(cx, cy, r, 0, Math.PI*2);
    mc.clip();
    mc.fillStyle = "rgba(0,0,0,0.62)";
    mc.beginPath();
    mc.arc(cx + shift, cy, r, 0, Math.PI*2);
    mc.fill();
    mc.restore();

    // Crater detail (stable)
    mc.save();
    mc.beginPath();
    mc.arc(cx, cy, r, 0, Math.PI*2);
    mc.clip();

    // Rim shading for depth
    var rim = mc.createRadialGradient(cx - r*0.25, cy - r*0.25, r*0.15, cx, cy, r);
    rim.addColorStop(0, "rgba(0,0,0,0.00)");
    rim.addColorStop(1, "rgba(0,0,0,0.18)");
    mc.fillStyle = rim;
    mc.fillRect(cx-r, cy-r, r*2, r*2);

    for(var i=0;i<cratersN.length;i++){
      var cN = cratersN[i];
      var x = cx + cN.u * r;
      var y = cy + cN.v * r;
      var rr = cN.rr * r;

      mc.fillStyle = "rgba(0,0,0,"+cN.a+")";
      mc.beginPath();
      mc.arc(x, y, rr, 0, Math.PI*2);
      mc.fill();

      mc.fillStyle = "rgba(255,255,255,0.09)";
      mc.beginPath();
      mc.arc(x - rr*0.18, y - rr*0.18, rr*0.55, 0, Math.PI*2);
      mc.fill();
    }

    mc.restore();
  }

  // ---------- Resize ----------
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
    rebuildMoonCache(); // only rebuild on resize (NOT per frame)
  }
  resize();
  window.addEventListener("resize", resize, {passive:true});

  // ---------- Sky ----------
  function drawSky(){
    // target: red, dark, red, dark feeling
    var g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0.00, "rgba(210,70,40,0.22)");
    g.addColorStop(0.28, "rgba(120,20,20,0.16)");
    g.addColorStop(0.58, "rgba(180,55,30,0.14)");
    g.addColorStop(1.00, "rgba(0,0,0,0.18)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);
  }

  // ---------- Moon (blit cached) ----------
  function drawMoon(){
    var p = moonParams();
    var pad = p.mr * 3.2;
    var x = p.mx - pad;
    var y = p.my - pad;
    ctx.drawImage(moonCache, x, y);
    drawMoonReflection(p.mx, p.mr);
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

  // ---------- Water Dial Ripple ----------
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
    drawSky();
    drawMoon();
    drawWaterDial(ts);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

})();
