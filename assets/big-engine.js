/* TNT — /assets/bg-engine.js
   GEODIAMETRICS BACKGROUND ENGINE v1.2 (PERF + CLARITY PASS)
   PURPOSE:
     - Canvas-only animated atmosphere (NO DOM animation, NO pointer capture)
     - Mid-autumn evening sky (brighter) + SINGLE moon (craters + glow) + moon reflection
     - Clouds (left→right) rendered as multi-lobe “cloud puffs” (NOT ovals-only)
     - Water ripple confined to compass face (circular clip), flowing OUTWARD only
     - Two dragons (right→left) ABOVE compass face but BELOW buttons (via 2-canvas stack)
       - Top dragon: (OPTIONAL) classic Chinese phrases (disabled by default; enable_cn:true)
       - Bottom dragon: English phrases (default)
     - Each dragon completes full traverse before restarting; quote changes per pass
   CONSTRAINTS:
     - No new gd_* keys
     - No persistent state keys (moon phase derived from time; no storage)
     - 30fps target + DPR cap for mobile stability
     - Two fixed canvases:
         bg canvas (sky+clouds+moon+water) z=0
         mid canvas (dragons+lanterns)     z=8
     - pointer-events none
*/
(function(){
  "use strict";

  // ---------- utils ----------
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return ""; } }

  // deterministic PRNG (for stable craters + stable cloud shapes)
  function hash32(str){
    var h=2166136261>>>0;
    for(var i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h>>>0;
  }
  function rng(seed){
    var s = seed>>>0;
    return function(){
      // xorshift32
      s ^= s << 13; s >>>= 0;
      s ^= s >> 17; s >>>= 0;
      s ^= s << 5;  s >>>= 0;
      return (s>>>0) / 4294967296;
    };
  }

  // ---- Moon phase (deterministic from time; no storage) ----
  // Synodic month ~29.530588853 days.
  function moonPhase01(timeMs){
    var days = timeMs / 86400000;
    var syn = 29.530588853;
    var frac = (days / syn) % 1;
    if(frac < 0) frac += 1;
    return frac; // 0=new, 0.5=full
  }

  function createCanvas(id, z){
    var c = document.createElement("canvas");
    c.id = id;
    c.style.position = "fixed";
    c.style.inset = "0";
    c.style.width = "100%";
    c.style.height = "100%";
    c.style.zIndex = String(z);
    c.style.pointerEvents = "none";
    c.style.userSelect = "none";
    c.style.opacity = "1";
    return c;
  }

  // ---------- engine ----------
  function mount(opts){
    opts = opts || {};
    var reduce = false;
    try{ reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){}

    // already mounted? update opts + return
    var existingBG  = document.getElementById("gd_bg_canvas");
    var existingMID = document.getElementById("gd_mid_canvas");
    if(existingBG && existingMID){
      existingBG.__GD_OPTS = opts;
      existingMID.__GD_OPTS = opts;
      return {bg:existingBG, mid:existingMID};
    }

    // canvases
    var bg  = createCanvas("gd_bg_canvas", 0);
    var mid = createCanvas("gd_mid_canvas", 8);

    bg.__GD_OPTS = opts;
    mid.__GD_OPTS = opts;

    // insert first so pages overlay them
    (document.body || document.documentElement).prepend(mid);
    (document.body || document.documentElement).prepend(bg);

    var bgc = bg.getContext("2d",  {alpha:true, desynchronized:true});
    var mdc = mid.getContext("2d", {alpha:true, desynchronized:true});
    if(!bgc || !mdc) return {bg:bg, mid:mid};

    // ---- budget ----
    var DPR_CAP   = (opts.dpr_cap != null) ? opts.dpr_cap : 1.6;
    var TARGET_FPS= (opts.fps != null) ? opts.fps : 30;
    var FRAME_MS  = 1000 / TARGET_FPS;

    var W=0,H=0,DPR=1;
    function resize(){
      var ww = Math.max(1, window.innerWidth  || 1);
      var hh = Math.max(1, window.innerHeight || 1);
      var dpr = 1;
      try{ dpr = window.devicePixelRatio || 1; }catch(e){}
      DPR = Math.min(DPR_CAP, Math.max(1, dpr));
      W = Math.floor(ww * DPR);
      H = Math.floor(hh * DPR);
      bg.width  = W; bg.height  = H;
      mid.width = W; mid.height = H;
    }
    resize();
    window.addEventListener("resize", resize, {passive:true});

    // ---------- clouds (multi-lobe puffs; stable shapes) ----------
    var cloudCount = opts.cloud_count || 18;
    var clouds = [];
    function seedClouds(){
      clouds = [];
      var R = rng(hash32("gd_clouds_v1"));
      for(var i=0;i<cloudCount;i++){
        var baseR = lerp(90, 220, R()) * DPR;
        var puffN = 5 + ((R()*5)|0); // 5..9 puffs
        var puffs = [];
        for(var k=0;k<puffN;k++){
          puffs.push({
            ox: (R()*2-1)*baseR*0.35,
            oy: (R()*2-1)*baseR*0.16,
            r:  lerp(0.40, 0.90, R())*baseR*0.50
          });
        }
        clouds.push({
          x: R()*W,
          y: lerp(H*0.48, H*0.92, R()),
          r: baseR,
          a: lerp(0.03, 0.08, R()),
          v: lerp(0.010, 0.030, R()) * DPR,      // px/ms (slow)
          hue: (R()<0.78) ? "warm" : "opal",
          puffs: puffs
        });
      }
    }
    seedClouds();

    // ---------- lanterns (upward drift; embers/lanterns) ----------
    var lanternN = opts.lantern_count || 22;
    var lanterns = [];
    function seedLanterns(){
      lanterns = [];
      var R = rng(hash32("gd_lanterns_v1"));
      for(var i=0;i<lanternN;i++){
        lanterns.push({
          x: R()*W,
          y: H + R()*H*0.35,
          s: lerp(0.016, 0.040, R()) * DPR,     // px/ms
          r: lerp(2.2, 5.0, R()) * DPR,
          w: lerp(0.7, 1.5, R()) * DPR,         // horizontal sway
          ph: R()*1000
        });
      }
    }
    seedLanterns();

    // ---------- dragons (true pass-based traverse; slower slither) ----------
    function makeDragon(yFrac, seedTag){
      return {
        yFrac: yFrac,
        pass: 0,
        seedTag: seedTag,
        // each pass uses a stable quote index
        quoteIdx: 0,
        // phase offsets
        ph: Math.random()*1000
      };
    }
    var dragons = [
      makeDragon(0.28, "top"),
      makeDragon(0.76, "bottom")
    ];

    // phrases (EN ONLY DEFAULT; CN optional later)
    var CN_CLASSIC = [
      "少说多做",
      "己所不欲 无施于人",
      "道生一 一生二 二生三 三生万物",
      "道可道 非常道",
      "逝者如斯夫",
      "一失足成千古恨"
    ];
    var EN_PHRASES = [
      "SAY LESS, DO MORE",
      "BOUND THEN SCALE",
      "RECEIPTS > ARGUMENTS",
      "CONTAIN FIRST",
      "MEASURE THEN MOVE",
      "THE RIVER FLOWS, TIME PASSES"
    ];
    var ES_PHRASES = [
      "DI MENOS, HAZ MÁS",
      "ACOTAR Y ESCALAR",
      "RECIBOS > DISCUSIÓN",
      "CONTENER PRIMERO",
      "MEDIR Y ACTUAR"
    ];

    function currentLang(){
      // prefer explicit opts.lang, else pull from localStorage gd_lang if present
      var L = opts.lang;
      if(!L){
        try{ L = localStorage.getItem("gd_lang") || "en"; }catch(e){ L="en"; }
      }
      L = String(L||"en").toLowerCase();
      if(L!=="en" && L!=="zh" && L!=="es") L="en";
      return L;
    }

    function dragonLabels(isTop){
      // English-only default until you re-enable CN
      var L = currentLang();
      if(isTop && opts.enable_cn === true) return CN_CLASSIC;
      if(L==="es") return ES_PHRASES;
      if(L==="zh") return EN_PHRASES; // EN-only mode even if zh selected (per your current rule)
      return EN_PHRASES;
    }

    function pickQuote(d, labels){
      // change quote per full traverse (pass)
      var idx = (d.pass + (labels.length*3)) % labels.length;
      d.quoteIdx = idx;
      return labels[idx];
    }

    // ---------- moon craters (stable per date slice) ----------
    var craterCache = null;
    function buildCraters(seedKey, mr){
      var R = rng(hash32(seedKey));
      var out = [];
      var n = 14;
      for(var i=0;i<n;i++){
        out.push({
          x: (R()*2-1)*mr*0.58,
          y: (R()*2-1)*mr*0.58,
          r: mr * lerp(0.05, 0.16, R()),
          a: lerp(0.10, 0.26, R())
        });
      }
      return out;
    }

    // ---------- draw: background sky + moon ----------
    function drawSky(t){
      // brighter evening sky (avoid “too dark”)
      var g = bgc.createLinearGradient(0,0,0,H);
      g.addColorStop(0,   "rgba(210,70,40,0.22)");
      g.addColorStop(0.25,"rgba(160,40,55,0.18)");
      g.addColorStop(0.60,"rgba(90,14,30,0.14)");
      g.addColorStop(1,   "rgba(0,0,0,0.16)");
      bgc.fillStyle = g;
      bgc.fillRect(0,0,W,H);

      // moon (single)
      var phase = moonPhase01(Date.now());
      var mx = W*0.76, my = H*0.18;
      var mr = Math.min(W,H)*0.065; // slightly larger

      // cache craters per day (stable)
      var dayKey = (new Date()).toISOString().slice(0,10); // YYYY-MM-DD
      if(!craterCache || craterCache.key !== dayKey || craterCache.mr !== mr){
        craterCache = {key: dayKey, mr: mr, list: buildCraters("gd_moon_"+dayKey, mr)};
      }

      // glow
      bgc.save();
      bgc.globalAlpha = 0.95;
      bgc.fillStyle = "rgba(255,245,220,0.22)";
      bgc.beginPath(); bgc.arc(mx,my,mr*2.5,0,Math.PI*2); bgc.fill();

      // lit disk
      bgc.shadowColor = "rgba(255,240,220,0.45)";
      bgc.shadowBlur  = 26*DPR;
      bgc.fillStyle   = "rgba(255,240,220,0.94)";
      bgc.beginPath(); bgc.arc(mx,my,mr,0,Math.PI*2); bgc.fill();
      bgc.shadowBlur = 0;

      // phase shadow (single overlay)
      var k = Math.cos(phase * Math.PI * 2); // -1..1
      bgc.globalCompositeOperation = "source-atop";
      bgc.fillStyle = "rgba(0,0,0,0.62)";
      bgc.beginPath();
      bgc.ellipse(mx + (k*mr*0.58), my, mr, mr, 0, 0, Math.PI*2);
      bgc.fill();
      bgc.globalCompositeOperation = "source-over";

      // craters (stable positions)
      for(var i=0;i<craterCache.list.length;i++){
        var c = craterCache.list[i];
        bgc.globalAlpha = c.a;
        bgc.fillStyle = "rgba(0,0,0,0.55)";
        bgc.beginPath();
        bgc.arc(mx + c.x, my + c.y, c.r, 0, Math.PI*2);
        bgc.fill();
      }
      bgc.restore();

      // moon reflection (water reflection zone)
      var ry0 = H*0.62;
      var refl = bgc.createRadialGradient(mx, ry0, mr*0.2, mx, ry0, mr*3.6);
      refl.addColorStop(0,   "rgba(255,240,220,0.12)");
      refl.addColorStop(0.30,"rgba(255,220,190,0.07)");
      refl.addColorStop(1,   "rgba(0,0,0,0)");
      bgc.fillStyle = refl;
      bgc.fillRect(mx-mr*5, ry0-mr*5, mr*10, mr*10);
    }

    // ---------- draw: stars (cheap) ----------
    function drawStars(){
      bgc.save();
      bgc.globalAlpha = 0.26;
      bgc.fillStyle = "rgba(212,175,55,0.90)";
      for(var i=0;i<16;i++){
        var x = (W*0.10) + (i%8)*W*0.105;
        var y = (H*0.06) + (i<8?0:1)*H*0.06;
        bgc.beginPath();
        bgc.arc(x,y,1.2*DPR,0,Math.PI*2);
        bgc.fill();
      }
      bgc.restore();
    }

    // ---------- draw: clouds (multi-puff, in reflection plane only) ----------
    function drawClouds(t){
      var yMin = H*0.46;
      bgc.save();
      bgc.globalCompositeOperation = "screen";
      for(var i=0;i<clouds.length;i++){
        var c = clouds[i];
        var x = (c.x + t*c.v) % (W + c.r*2) - c.r;
        var y = clamp(c.y, yMin, H);
        bgc.globalAlpha = c.a;

        // warm/or opal tint
        var col = (c.hue==="opal") ? "rgba(170,130,255,1)" : "rgba(255,200,140,1)";
        // multi-puff via gradients
        for(var k=0;k<c.puffs.length;k++){
          var p = c.puffs[k];
          var px = x + p.ox;
          var py = y + p.oy;
          var pr = p.r;

          var g = bgc.createRadialGradient(px,py,0,px,py,pr);
          g.addColorStop(0, col);
          g.addColorStop(1, "rgba(0,0,0,0)");
          bgc.fillStyle = g;
          bgc.beginPath();
          bgc.arc(px,py,pr,0,Math.PI*2);
          bgc.fill();
        }
      }
      bgc.restore();
    }

    // ---------- draw: water dial ripple (OUTWARD only) ----------
    function drawWaterDial(t){
      var cx = W*0.5, cy = H*0.50;
      var r  = Math.min(W,H)*0.32;

      bgc.save();
      bgc.beginPath();
      bgc.arc(cx,cy,r,0,Math.PI*2);
      bgc.clip();

      // base tint
      var grd = bgc.createRadialGradient(cx, cy-r*0.25, r*0.18, cx, cy, r);
      grd.addColorStop(0, "rgba(255,210,170,0.10)");
      grd.addColorStop(0.55,"rgba(255,140,120,0.06)");
      grd.addColorStop(1, "rgba(0,0,0,0.00)");
      bgc.fillStyle = grd;
      bgc.fillRect(cx-r, cy-r, r*2, r*2);

      // outward rings (never reverse)
      bgc.globalAlpha = 0.95;
      bgc.strokeStyle = "rgba(255,255,255,0.05)";
      bgc.lineWidth = 1.0*DPR;

      var base = (t*0.00035) % 1; // slow outward progression
      for(var i=0;i<8;i++){
        var rr = r * (0.18 + i*0.095 + base*0.095);
        bgc.beginPath();
        bgc.arc(cx,cy,rr,0,Math.PI*2);
        bgc.stroke();
      }

      // gold arc highlight (slow drift)
      bgc.globalAlpha = 0.70;
      bgc.strokeStyle = "rgba(212,175,55,0.06)";
      bgc.lineWidth = 2.2*DPR;
      var a = t*0.00022;
      bgc.beginPath();
      bgc.arc(cx,cy,r*0.78,a,a+1.25);
      bgc.stroke();

      bgc.restore();
    }

    // ---------- draw: lanterns (on mid canvas; above water/compass, below buttons) ----------
    function drawLanterns(t){
      mdc.save();
      mdc.globalCompositeOperation = "screen";
      for(var i=0;i<lanterns.length;i++){
        var L = lanterns[i];
        // drift upward with mild sway
        var sx = Math.sin((t*0.0006) + L.ph) * L.w;
        var x = L.x + sx;
        var y = L.y - t*L.s;

        // wrap
        if(y < -40*DPR){
          L.y = H + (Math.random()*H*0.25);
          L.x = Math.random()*W;
          L.ph = Math.random()*1000;
        }

        // lantern body + glow
        var r = L.r;
        mdc.globalAlpha = 0.18;
        mdc.fillStyle = "rgba(255,190,120,1)";
        mdc.beginPath();
        mdc.arc(x,y,r*2.2,0,Math.PI*2);
        mdc.fill();

        mdc.globalAlpha = 0.28;
        mdc.fillStyle = "rgba(255,150,90,1)";
        mdc.beginPath();
        mdc.arc(x,y,r,0,Math.PI*2);
        mdc.fill();
      }
      mdc.restore();
    }

    // ---------- draw: dragon (slither, segmented body, improved head silhouette) ----------
    function drawDragon(d, t, isTop){
      var yMid = H * d.yFrac;

      // slower, readable
      var speed = (opts.dragon_speed != null ? opts.dragon_speed : 0.020) * DPR; // px/ms
      var margin = W*0.38;
      var travel = W + margin*2;
      var u = (t*speed) % travel;
      var headX = (W + margin - u); // right -> left always

      // pass detection: when u wraps
      var passNow = Math.floor((t*speed)/travel);
      if(passNow !== d.pass){
        d.pass = passNow;
      }

      var labels = dragonLabels(isTop);
      var phrase = pickQuote(d, labels);

      var len   = W*0.92;
      var segs  = 34;
      var amp   = (opts.dragon_amp != null ? opts.dragon_amp : 18) * DPR; // slither, not wiggle
      var thick = (opts.dragon_thickness != null ? opts.dragon_thickness : 16) * DPR;

      // color: onyx green-black with subtle red belly
      var bodyColor = isTop ? "rgba(0,42,28,0.92)" : "rgba(0,36,24,0.92)";
      var bellyColor= "rgba(120,0,22,0.28)";
      var edgeColor = "rgba(0,0,0,0.40)";

      mdc.save();
      mdc.globalCompositeOperation = "source-over";
      mdc.lineCap = "round";
      mdc.lineJoin = "round";

      // spine points
      var pts = [];
      for(var i=0;i<=segs;i++){
        var s = i/segs;
        var x = headX + len*s;
        var y = yMid + Math.sin((s*6.0) + t*0.0011 + (isTop?0.4:1.3))*amp;
        pts.push({x:x, y:y});
      }

      // shadow edge
      mdc.strokeStyle = edgeColor;
      mdc.lineWidth = thick + 7*DPR;
      mdc.beginPath();
      for(var i=0;i<pts.length;i++){
        var p=pts[i];
        if(i===0) mdc.moveTo(p.x,p.y); else mdc.lineTo(p.x,p.y);
      }
      mdc.stroke();

      // belly (subtle, slightly offset)
      mdc.strokeStyle = bellyColor;
      mdc.lineWidth = Math.max(2*DPR, thick*0.55);
      mdc.beginPath();
      for(var i=0;i<pts.length;i++){
        var p=pts[i];
        if(i===0) mdc.moveTo(p.x,p.y+thick*0.30);
        else mdc.lineTo(p.x,p.y+thick*0.30);
      }
      mdc.stroke();

      // main body
      mdc.strokeStyle = bodyColor;
      mdc.lineWidth = thick;
      mdc.beginPath();
      for(var i=0;i<pts.length;i++){
        var p=pts[i];
        if(i===0) mdc.moveTo(p.x,p.y); else mdc.lineTo(p.x,p.y);
      }
      mdc.stroke();

      // scale hint (small “plates”)
      mdc.strokeStyle = "rgba(255,255,255,0.07)";
      mdc.lineWidth = 1.25*DPR;
      for(var k=3;k<pts.length-3;k+=2){
        var pA=pts[k], pB=pts[k+1];
        var ang = Math.atan2(pB.y-pA.y, pB.x-pA.x);
        var rr = thick*0.60;
        mdc.beginPath();
        mdc.arc(pA.x, pA.y, rr, ang+0.55, ang+1.85);
        mdc.stroke();
      }

      // head (stronger silhouette): snout + jaw + horn
      var hd = pts[0];
      mdc.save();
      mdc.translate(hd.x, hd.y);

      // face direction: left
      mdc.rotate(Math.atan2(pts[1].y-pts[0].y, pts[1].x-pts[0].x) + Math.PI);

      // head mass
      mdc.fillStyle = "rgba(0,50,32,0.98)";
      mdc.beginPath();
      mdc.ellipse(0,0, thick*1.05, thick*0.78, 0, 0, Math.PI*2);
      mdc.fill();

      // snout
      mdc.beginPath();
      mdc.moveTo(-thick*0.35, -thick*0.20);
      mdc.lineTo(-thick*1.30, 0);
      mdc.lineTo(-thick*0.35,  thick*0.20);
      mdc.closePath();
      mdc.fill();

      // eye
      mdc.fillStyle = "rgba(212,175,55,0.65)";
      mdc.beginPath();
      mdc.arc(thick*0.22, -thick*0.10, 1.6*DPR, 0, Math.PI*2);
      mdc.fill();

      // horn + whisker
      mdc.strokeStyle = "rgba(212,175,55,0.32)";
      mdc.lineWidth = 1.6*DPR;
      mdc.beginPath();
      mdc.moveTo(thick*0.10, -thick*0.35);
      mdc.lineTo(thick*0.55, -thick*0.95);
      mdc.moveTo(thick*0.10,  thick*0.35);
      mdc.lineTo(thick*0.55,  thick*0.95);
      mdc.stroke();

      mdc.restore();

      // glowing tattoo text blocks (gold), spaced & readable
      mdc.save();
      mdc.globalAlpha = 0.92;
      mdc.fillStyle = "rgba(212,175,55,0.72)";
      mdc.shadowColor = "rgba(212,175,55,0.38)";
      mdc.shadowBlur = 10*DPR;
      mdc.font = (12*DPR) + "px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

      // 5 placements along body (more readable than many)
      for(var m=6;m<pts.length-6;m+=7){
        var pA = pts[m], pB = pts[m+1];
        var ang2 = Math.atan2(pB.y-pA.y, pB.x-pA.x);
        mdc.save();
        mdc.translate(pA.x, pA.y);
        mdc.rotate(ang2 + Math.PI); // face left along motion
        mdc.fillText(phrase, -mdc.measureText(phrase).width*0.15, -thick*0.92);
        mdc.restore();
      }
      mdc.restore();

      mdc.restore();
    }

    // ---------- main loop ----------
    var last=0, acc=0;
    function frame(ts){
      if(!last) last = ts;
      var dt = ts - last;
      last = ts;

      if(reduce){
        bgc.clearRect(0,0,W,H);
        mdc.clearRect(0,0,W,H);
        drawSky(ts);
        drawStars();
        drawClouds(ts);
        drawWaterDial(ts);
        drawLanterns(ts);
        drawDragon(dragons[0], ts, true);
        drawDragon(dragons[1], ts, false);
        return;
      }

      acc += dt;
      if(acc < FRAME_MS){
        requestAnimationFrame(frame);
        return;
      }
      acc = 0;

      // bg pass
      bgc.clearRect(0,0,W,H);
      drawSky(ts);
      drawStars();
      drawClouds(ts);
      drawWaterDial(ts);

      // mid pass
      mdc.clearRect(0,0,W,H);
      drawLanterns(ts);
      drawDragon(dragons[0], ts, true);
      drawDragon(dragons[1], ts, false);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return {bg:bg, mid:mid};
  }

  // Public API
  window.GD_BG = { mount: mount };
})();
