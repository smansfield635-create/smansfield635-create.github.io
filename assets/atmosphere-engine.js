/* TNT — /assets/atmosphere-engine.js
   GEODIAMETRICS ATMOSPHERE ENGINE v1.0 (EN ONLY)
   PURPOSE:
     - Canvas-only atmosphere (NO DOM animation, NO pointer capture)
     - Layered clouds (depth + shape; NOT ovals-only)
     - Lantern balloons drifting upward (with glow) + ember specks
     - Clouds drift LEFT→RIGHT (background reflection plane)
     - Lanterns drift UP (can pass over most of scene) BUT:
         - NEVER draw over CORE exclusion zone (center “gravitational well”)
     - Performance: 30fps target + DPR cap; single fixed canvas; pointer-events none
   CONSTRAINTS:
     - No new gd_* keys
     - No persistent state keys
*/

(function(){
  "use strict";

  function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }

  // deterministic rand helper (stable shapes per load, no storage)
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
    c.id = "gd_atmo_canvas";
    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.pointerEvents = "none";
    c.style.userSelect = "none";
    // Above bg (z=0) and moon (z≈3), below gems/buttons (page content typically >10)
    // You can raise/lower per-page by passing opts.z
    c.style.zIndex = "6";
    return c;
  }

  function mount(opts){
    opts = opts || {};

    var reduce = false;
    try{
      reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }catch(e){}

    // update if exists
    var existing = document.getElementById("gd_atmo_canvas");
    if(existing){
      existing.__GD_OPTS = opts;
      if(typeof opts.z === "number") existing.style.zIndex = String(opts.z|0);
      return existing;
    }

    var canvas = createCanvas();
    canvas.__GD_OPTS = opts;
    if(typeof opts.z === "number") canvas.style.zIndex = String(opts.z|0);

    (document.body || document.documentElement).appendChild(canvas);

    var ctx = canvas.getContext("2d", { alpha:true, desynchronized:true });
    if(!ctx) return canvas;

    // budget
    var DPR_CAP = (opts.dpr_cap != null) ? opts.dpr_cap : 1.5;
    var TARGET_FPS = (opts.fps != null) ? opts.fps : 30;
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

    // CORE exclusion zone (never draw lanterns inside)
    function coreZone(){
      var cx = W*0.5, cy = H*0.50;
      // tuned to avoid core diamond + immediate halo; adjust via opts.core_r
      var r = (opts.core_r != null) ? (opts.core_r * DPR) : (Math.min(W,H)*0.13);
      return {cx:cx, cy:cy, r:r};
    }

    // seeded shapes
    var seed = ((Date.now() ^ (Math.random()*1e9)) >>> 0);
    var rnd = mulberry32(seed);

    // CLOUDS: layered “puffs” grouped into formations (depth)
    var cloudBands = [];
    var bandCount = (opts.cloud_bands != null) ? opts.cloud_bands : 3; // 3 depth layers
    var cloudsPerBand = (opts.clouds_per_band != null) ? opts.clouds_per_band : 6;

    function makeCloudShape(scale){
      // cloud composed of multiple puffs with offsets
      var puffs = [];
      var puffCount = 6 + ((rnd()*5)|0);
      for(var i=0;i<puffCount;i++){
        puffs.push({
          ox: (rnd()*2-1) * 120 * scale * DPR,
          oy: (rnd()*2-1) * 30  * scale * DPR,
          r:  lerp(60, 140, rnd()) * scale * DPR
        });
      }
      return puffs;
    }

    function seedClouds(){
      cloudBands = [];
      for(var b=0;b<bandCount;b++){
        var depth = lerp(0.55, 1.0, b/(bandCount-1 || 1)); // near bands more opaque
        var speed = lerp(0.012, 0.040, b/(bandCount-1 || 1)) * DPR; // px/ms
        var scale = lerp(0.65, 1.10, b/(bandCount-1 || 1));
        var arr = [];
        for(var i=0;i<cloudsPerBand;i++){
          arr.push({
            x: rnd()*W,
            y: lerp(H*0.46, H*0.78, rnd()), // reflection plane
            speed: speed * lerp(0.7, 1.3, rnd()),
            alpha: lerp(0.05, 0.14, rnd()) * depth,
            scale: scale * lerp(0.75, 1.20, rnd()),
            puffs: makeCloudShape(scale * lerp(0.75,1.20,rnd())),
            hue: (rnd()<0.72) ? "warm" : "opal"
          });
        }
        cloudBands.push(arr);
      }
    }
    seedClouds();

    // LANTERNS: upward drift with sway
    var lanterns = [];
    var lanternCount = (opts.lanterns != null) ? opts.lanterns : 18;
    function seedLanterns(){
      lanterns = [];
      for(var i=0;i<lanternCount;i++){
        lanterns.push({
          x: rnd()*W,
          y: H + rnd()*H*0.35,
          vy: lerp(0.028, 0.070, rnd()) * DPR,  // px/ms
          sx: lerp(0.010, 0.030, rnd()) * DPR,  // sway speed
          amp: lerp(10, 30, rnd()) * DPR,
          r:  lerp(6, 11, rnd()) * DPR,
          glow: lerp(0.18, 0.32, rnd()),
          warm: (rnd()<0.85),
          phase: rnd()*Math.PI*2
        });
      }
    }
    seedLanterns();

    // EMBERS: tiny specks rising (adds depth)
    var embers = [];
    var emberCount = (opts.embers != null) ? opts.embers : 30;
    function seedEmbers(){
      embers = [];
      for(var i=0;i<emberCount;i++){
        embers.push({
          x: rnd()*W,
          y: H + rnd()*H*0.25,
          vy: lerp(0.06, 0.16, rnd()) * DPR,
          r:  lerp(0.7, 1.8, rnd()) * DPR,
          a:  lerp(0.10, 0.28, rnd()),
          sway: lerp(0.010, 0.030, rnd()) * DPR,
          phase: rnd()*Math.PI*2
        });
      }
    }
    seedEmbers();

    // draw helpers
    function drawCloud(cl){
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = cl.alpha;

      var base = (cl.hue==="opal") ? "rgba(160,120,255,1)" : "rgba(255,200,140,1)";
      // subtle depth shading: darker underbelly
      var shade = "rgba(0,0,0,0.18)";

      // main cloud fill via layered radial gradients
      for(var i=0;i<cl.puffs.length;i++){
        var p = cl.puffs[i];
        var x = cl.x + p.ox;
        var y = cl.y + p.oy;
        var r = p.r;

        // puff light
        var g1 = ctx.createRadialGradient(x, y, 0, x, y, r);
        g1.addColorStop(0, base);
        g1.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fill();

        // puff underbelly (adds 3D)
        ctx.globalAlpha = cl.alpha * 0.55;
        var g2 = ctx.createRadialGradient(x, y + r*0.25, 0, x, y + r*0.25, r);
        g2.addColorStop(0, shade);
        g2.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x, y + r*0.25, r, 0, Math.PI*2);
        ctx.fill();
        ctx.globalAlpha = cl.alpha;
      }

      ctx.restore();
    }

    function drawLantern(l, t){
      // Skip if inside core exclusion zone
      var cz = coreZone();
      var dx = l.x - cz.cx;
      var dy = l.y - cz.cy;
      if((dx*dx + dy*dy) < (cz.r*cz.r)) return;

      var sway = Math.sin(t*l.sx + l.phase) * l.amp;
      var x = l.x + sway;
      var y = l.y;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      // glow
      var g = ctx.createRadialGradient(x, y, l.r*0.2, x, y, l.r*6.0);
      g.addColorStop(0, "rgba(255,230,170,"+(0.35*l.glow)+")");
      g.addColorStop(0.4, "rgba(255,170,110,"+(0.20*l.glow)+")");
      g.addColorStop(1, "rgba(255,170,110,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, l.r*6.0, 0, Math.PI*2);
      ctx.fill();

      // lantern body (tiny capsule)
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = l.warm ? "rgba(255,190,120,0.55)" : "rgba(255,220,180,0.50)";
      ctx.beginPath();
      ctx.ellipse(x, y, l.r*0.85, l.r*1.15, 0, 0, Math.PI*2);
      ctx.fill();

      // inner bright core
      ctx.globalAlpha = 0.80;
      ctx.fillStyle = "rgba(255,245,225,0.65)";
      ctx.beginPath();
      ctx.arc(x, y - l.r*0.10, l.r*0.35, 0, Math.PI*2);
      ctx.fill();

      ctx.restore();
    }

    function drawEmber(e, t){
      var sway = Math.sin(t*e.sway + e.phase) * 12*DPR;
      var x = e.x + sway;
      var y = e.y;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = e.a;

      var g = ctx.createRadialGradient(x,y,0,x,y,e.r*7);
      g.addColorStop(0, "rgba(255,220,160,0.55)");
      g.addColorStop(0.4, "rgba(255,140,90,0.20)");
      g.addColorStop(1, "rgba(255,140,90,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, e.r*7, 0, Math.PI*2);
      ctx.fill();

      ctx.restore();
    }

    // motion updates
    function updateClouds(dt){
      for(var b=0;b<cloudBands.length;b++){
        var band = cloudBands[b];
        for(var i=0;i<band.length;i++){
          var cl = band[i];
          cl.x += cl.speed * dt;
          // wrap
          var wrap = W + 500*DPR;
          if(cl.x > wrap) cl.x = -500*DPR;
        }
      }
    }

    function updateLanterns(dt, t){
      for(var i=0;i<lanterns.length;i++){
        var l = lanterns[i];
        l.y -= l.vy * dt;
        if(l.y < -120*DPR){
          l.y = H + 140*DPR + rnd()*H*0.15;
          l.x = rnd()*W;
          l.phase = rnd()*Math.PI*2;
        }
        // slight horizontal drift
        l.x += Math.sin(t*0.00035 + l.phase) * 0.10*DPR * dt;
        if(l.x < -80*DPR) l.x = W + 80*DPR;
        if(l.x > W + 80*DPR) l.x = -80*DPR;
      }
    }

    function updateEmbers(dt, t){
      for(var i=0;i<embers.length;i++){
        var e = embers[i];
        e.y -= e.vy * dt;
        if(e.y < -40*DPR){
          e.y = H + 40*DPR + rnd()*H*0.10;
          e.x = rnd()*W;
          e.phase = rnd()*Math.PI*2;
        }
        e.x += Math.sin(t*0.00045 + e.phase) * 0.06*DPR * dt;
      }
    }

    // loop
    var last = 0;
    var acc = 0;

    function frame(ts){
      if(!last) last = ts;
      var dt = ts - last;
      last = ts;

      if(reduce){
        ctx.clearRect(0,0,W,H);
        // clouds only + a few lanterns
        for(var b=0;b<cloudBands.length;b++){
          for(var i=0;i<cloudBands[b].length;i++){
            drawCloud(cloudBands[b][i]);
          }
        }
        for(var j=0;j<Math.min(8,lanterns.length);j++){
          drawLantern(lanterns[j], ts*0.001);
        }
        return;
      }

      acc += dt;
      if(acc < FRAME_MS){
        requestAnimationFrame(frame);
        return;
      }
      acc = 0;

      // clear
      ctx.clearRect(0,0,W,H);

      // update
      updateClouds(dt);
      updateLanterns(dt, ts);
      updateEmbers(dt, ts);

      // draw order:
      // 1) clouds (behind most things)
      // 2) embers (light)
      // 3) lanterns (foreground-ish, but core excluded)
      for(var b=0;b<cloudBands.length;b++){
        var band = cloudBands[b];
        for(var i=0;i<band.length;i++){
          drawCloud(band[i]);
        }
      }

      for(var k=0;k<embers.length;k++){
        drawEmber(embers[k], ts);
      }

      for(var m=0;m<lanterns.length;m++){
        drawLantern(lanterns[m], ts*0.001);
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    return canvas;
  }

  window.GD_ATMO = { mount: mount };

})();
