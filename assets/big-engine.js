/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE v1
   PURPOSE:
     - Canvas-only animated atmosphere (NO DOM animation, NO pointer capture)
     - Mid-autumn sky + moon (craters + glow) + moon reflection
     - Clouds drift (left→right) in reflection plane
     - Two dragons (right→left) BETWEEN compass layer and buttons (drawn above “water face”)
       - Top dragon: classical Chinese phrases (gold glow)
       - Bottom dragon: language-dependent phrases (gold glow)
     - Subtle water ripple over compass face region (circular clip)
   CONSTRAINTS:
     - No new gd_* keys
     - No persistent state keys (moon phase derived from time; no storage)
     - 30fps target + DPR cap for mobile stability
     - Single canvas fixed layer; pointer-events none
*/
(function(){
  "use strict";

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function nowMs(){ return (typeof performance!=="undefined" && performance.now) ? performance.now() : Date.now(); }

  // ---- Moon phase (deterministic from time; no storage) ----
  // Synodic month ~29.53 days. We approximate phase by days since a fixed epoch.
  function moonPhase01(timeMs){
    var days = timeMs / 86400000;
    var syn = 29.530588853;
    var frac = (days / syn) % 1;
    if(frac < 0) frac += 1;
    return frac; // 0=new, 0.5=full
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

    // Insert as first child so page content overlays it.
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

    // ---- Precomputed cloud “bokeh” blobs (cheap) ----
    var blobs = [];
    var blobCount = opts.cloud_blobs || 44;
    function seedBlobs(){
      blobs = [];
      for(var i=0;i<blobCount;i++){
        blobs.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r: lerp(60, 220, Math.random()) * DPR,
          a: lerp(0.02, 0.08, Math.random()),
          sx: lerp(0.15, 0.55, Math.random()) * DPR, // px/ms-ish scaled later
          hue: (Math.random()<0.7) ? "warm" : "opal"
        });
      }
    }
    seedBlobs();

    // ---- Dragon path helpers ----
    function drawDragon(yMid, t, dir, labelSet, isTop){
      // dir: -1 means right->left, +1 left->right
      // segmented spine with “scales” hint + head/whiskers
      var speed = (opts.dragon_speed || 0.045) * DPR; // px/ms
      var baseX = (dir<0) ? (W + (t*speed)% (W*1.6)) : (-W*0.6 + (t*speed)% (W*1.6));
      var x0 = (dir<0) ? (W - baseX) : baseX; // normalize
      // We want them to traverse across the full width and restart after fully exiting:
      // Construct an offset that moves from +margin to -margin.
      var margin = W*0.35;
      var travel = W + margin*2;
      var u = (t*speed) % travel;
      var headX = (dir<0) ? (W + margin - u) : (-margin + u);

      var len = W*0.9;
      var segs = 28;
      var amp = (opts.dragon_amp || 26) * DPR;
      var thick = (opts.dragon_thickness || 14) * DPR;
      var bodyColor = isTop ? "rgba(0,70,40,0.78)" : "rgba(0,55,35,0.78)"; // dark green
      var edgeColor = "rgba(0,0,0,0.35)";

      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Body stroke (shadow edge)
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = thick + 6*DPR;
      ctx.beginPath();
      for(var i=0;i<=segs;i++){
        var s = i/segs;
        var x = headX - dir*len*s;
        var y = yMid + Math.sin((s*6.2) + t*0.0014 + (isTop?0.3:1.1))*amp;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();

      // Main body
      ctx.strokeStyle = bodyColor;
      ctx.lineWidth = thick;
      ctx.beginPath();
      var pts = [];
      for(var j=0;j<=segs;j++){
        var s2 = j/segs;
        var x2 = headX - dir*len*s2;
        var y2 = yMid + Math.sin((s2*6.2) + t*0.0014 + (isTop?0.3:1.1))*amp;
        pts.push({x:x2,y:y2});
        if(j===0) ctx.moveTo(x2,y2); else ctx.lineTo(x2,y2);
      }
      ctx.stroke();

      // Scale hint: small arcs along spine
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1.2*DPR;
      for(var k=2;k<pts.length-2;k+=2){
        var p = pts[k];
        var p2 = pts[k+1];
        var ang = Math.atan2(p2.y-p.y, p2.x-p.x);
        var rr = thick*0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr, ang+0.6, ang+1.8);
        ctx.stroke();
      }

      // Head (simple) at pts[0]
      var hd = pts[0];
      ctx.fillStyle = "rgba(0,80,48,0.92)";
      ctx.beginPath();
      ctx.ellipse(hd.x, hd.y, thick*0.95, thick*0.70, 0, 0, Math.PI*2);
      ctx.fill();
      // Horns/whiskers
      ctx.strokeStyle = "rgba(201,162,74,0.35)";
      ctx.lineWidth = 1.5*DPR;
      ctx.beginPath();
      ctx.moveTo(hd.x, hd.y);
      ctx.lineTo(hd.x + dir*thick*1.2, hd.y - thick*1.1);
      ctx.moveTo(hd.x, hd.y);
      ctx.lineTo(hd.x + dir*thick*1.1, hd.y + thick*1.0);
      ctx.stroke();

      // Glowing “tattoo” text blocks along body (gold)
      // Keep it cheap: repeated short phrases, spaced.
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = "rgba(212,175,55,0.70)";
      ctx.shadowColor = "rgba(212,175,55,0.35)";
      ctx.shadowBlur = 10*DPR;
      ctx.font = (12*DPR) + "px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

      var phrases = labelSet;
      var idx = Math.floor((t*0.0002) % phrases.length);
      var phrase = phrases[idx];
      // Place text at 6 points along body
      for(var m=5;m<pts.length-5;m+=6){
        var pA = pts[m];
        var pB = pts[m+1];
        var ang2 = Math.atan2(pB.y-pA.y, pB.x-pA.x);
        ctx.save();
        ctx.translate(pA.x, pA.y);
        ctx.rotate(ang2);
        ctx.fillText(phrase, -ctx.measureText(phrase).width*0.15, -thick*0.85);
        ctx.restore();
      }
      ctx.restore();

      ctx.restore();
    }

    // ---- Dial “water face” ripple (subtle) ----
    function drawWaterDial(t){
      // Clip a circle roughly centered; user’s compass face sits “in water”
      var cx = W*0.5, cy = H*0.50;
      var r = Math.min(W,H)*0.32;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.clip();

      // base light water tint (kept subtle so it doesn't compete)
      var grd = ctx.createRadialGradient(cx, cy-r*0.2, r*0.2, cx, cy, r);
      grd.addColorStop(0, "rgba(255,220,180,0.10)");
      grd.addColorStop(0.55, "rgba(255,160,120,0.06)");
      grd.addColorStop(1, "rgba(0,0,0,0.00)");
      ctx.fillStyle = grd;
      ctx.fillRect(cx-r, cy-r, r*2, r*2);

      // ripple rings
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1*DPR;
      var base = (t*0.0012) % 1;
      for(var i=0;i<7;i++){
        var rr = r * (0.22 + (i*0.11) + base*0.11);
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI*2);
        ctx.stroke();
      }

      // slight moving highlight
      ctx.globalAlpha = 0.75;
      ctx.strokeStyle = "rgba(212,175,55,0.06)";
      ctx.lineWidth = 2*DPR;
      var a = t*0.0006;
      ctx.beginPath();
      ctx.arc(cx, cy, r*0.78, a, a+1.2);
      ctx.stroke();

      ctx.restore();
    }

    // ---- Sky + moon + reflection ----
    function drawSky(t){
      // Evening sky gradient (brighter than obsidian)
      var g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, "rgba(120,20,20,0.20)");
      g.addColorStop(0.25, "rgba(180,55,30,0.22)");
      g.addColorStop(0.55, "rgba(110,20,35,0.18)");
      g.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // Moon
      var phase = moonPhase01(Date.now());
      var mx = W*0.75, my = H*0.20;
      var mr = Math.min(W,H)*0.055;
      // glow
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "rgba(255,245,220,0.18)";
      ctx.beginPath();
      ctx.arc(mx, my, mr*2.3, 0, Math.PI*2);
      ctx.fill();

      // lit disk
      ctx.shadowColor = "rgba(255,240,220,0.35)";
      ctx.shadowBlur = 22*DPR;
      ctx.fillStyle = "rgba(255,240,220,0.92)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // phase shadow (one moon; dark overlay)
      // phase 0=new (mostly dark), 0.5=full (no dark)
      var k = Math.cos(phase * Math.PI * 2); // -1..1
      // terminator shift
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgba(0,0,0,0.62)";
      ctx.beginPath();
      ctx.ellipse(mx + (k*mr*0.55), my, mr, mr, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // craters
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = "rgba(0,0,0,0.40)";
      for(var i=0;i<8;i++){
        var rx = mx + (Math.random()*2-1)*mr*0.55;
        var ry = my + (Math.random()*2-1)*mr*0.55;
        var rr = mr * lerp(0.06, 0.16, Math.random());
        ctx.beginPath();
        ctx.arc(rx, ry, rr, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();

      // Moon reflection (subtle on lower area)
      var ry0 = H*0.62;
      var refl = ctx.createRadialGradient(mx, ry0, mr*0.2, mx, ry0, mr*3.2);
      refl.addColorStop(0, "rgba(255,240,220,0.10)");
      refl.addColorStop(0.25, "rgba(255,220,190,0.06)");
      refl.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = refl;
      ctx.fillRect(mx-mr*4, ry0-mr*4, mr*8, mr*8);
    }

    function drawClouds(t){
      // reflection plane: lower half
      var yMin = H*0.45;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for(var i=0;i<blobs.length;i++){
        var b = blobs[i];
        // drift left->right
        var x = (b.x + t*b.sx*0.06) % (W + b.r*2) - b.r;
        var y = clamp(b.y, yMin, H);
        ctx.globalAlpha = b.a;
        var col = (b.hue==="opal") ? "rgba(160,120,255,1)" : "rgba(255,200,140,1)";
        var g = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        g.addColorStop(0, col);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawStars(t){
      // Very light: 16 “stars” as small points; keep cheap
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = "rgba(212,175,55,0.85)";
      for(var i=0;i<16;i++){
        var x = (W*0.12) + (i%8)*W*0.10;
        var y = (H*0.08) + (i<8?0:1)*H*0.06;
        var r = 1.1*DPR;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }

    // ---- Phrases ----
    var CN_CLASSIC = [
      "道生一",
      "一生二",
      "二生三",
      "三生万物",
      "道可道",
      "非常道"
    ];
    var EN_PHRASES = [
      "TRUTH BEATS NOISE",
      "BOUND THEN SCALE",
      "RECEIPTS > ARGUMENTS",
      "CONTAIN FIRST",
      "MEASURE THEN MOVE"
    ];
    var ES_PHRASES = [
      "VERDAD > RUIDO",
      "ACOTAR Y ESCALAR",
      "RECIBOS > DISCUSIÓN",
      "CONTENER PRIMERO",
      "MEDIR Y ACTUAR"
    ];
    var ZH_PHRASES = [
      "先定边界",
      "收据优先",
      "先测再动",
      "隔离优先",
      "一致性先于规模"
    ];

    // ---- Main loop (30fps) ----
    var last = 0;
    var acc = 0;
    function frame(ts){
      if(!last) last = ts;
      var dt = ts - last;
      last = ts;

      if(reduce){
        // Render once, then stop.
        ctx.clearRect(0,0,W,H);
        drawSky(ts);
        drawStars(ts);
        drawClouds(ts);
        drawWaterDial(ts);
        // dragons as stills
        var bottomLabels = (opts.lang==="zh")?ZH_PHRASES:(opts.lang==="es")?ES_PHRASES:EN_PHRASES;
        drawDragon(H*0.30, ts, -1, CN_CLASSIC, true);
        drawDragon(H*0.70, ts, -1, bottomLabels, false);
        return;
      }

      acc += dt;
      if(acc < FRAME_MS){
        requestAnimationFrame(frame);
        return;
      }
      // If we fall behind, drop accumulated time to avoid spiral of death.
      acc = 0;

      ctx.clearRect(0,0,W,H);

      // paint order:
      // 1) evening sky (behind everything)
      // 2) stars
      // 3) clouds (reflection plane)
      // 4) water dial ripples (center region)
      // 5) dragons (above compass/water, below gems)
      drawSky(ts);
      drawStars(ts);
      drawClouds(ts);
      drawWaterDial(ts);

      var bottomLabels = (opts.lang==="zh")?ZH_PHRASES:(opts.lang==="es")?ES_PHRASES:EN_PHRASES;
      // Dragons: further apart; top + bottom, right->left
      drawDragon(H*0.26, ts, -1, CN_CLASSIC, true);
      drawDragon(H*0.74, ts, -1, bottomLabels, false);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return canvas;
  }

  // Public API (window.GD_BG)
  window.GD_BG = {
    mount: mount
  };
})();
