/* =====================================================
   GEODIAMETRICS ATMOSPHERE ENGINE — LAYER 6
   PURPOSE:
   - Single moon (no double-moon) + phase advances on each load/return
   - Smooth cloud drift (slither-smooth, not jitter)
   - Lanterns drifting upward
   - Runs as one fixed canvas layer (no DOM clutter)
   CONSTRAINTS:
   - No gd_* keys added
   - No timers as gates (animation via requestAnimationFrame only)
===================================================== */

(function(){
  "use strict";

  /* ---------- Canvas mount ---------- */
  const fx = document.createElement("canvas");
  fx.id = "gd_atmo_layer";
  fx.style.position = "fixed";
  fx.style.top = "0";
  fx.style.left = "0";
  fx.style.width = "100%";
  fx.style.height = "100%";
  fx.style.pointerEvents = "none";

  /* Layering:
     - below gems (usually z=10+)
     - above dial/face (usually z=1–3)
     Adjust if needed: */
  fx.style.zIndex = "6";

  document.body.appendChild(fx);

  const ctx = fx.getContext("2d", { alpha: true });

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    fx.width  = Math.floor(window.innerWidth * dpr);
    fx.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener("resize", resize, { passive:true });

  /* ---------- Moon phase (single moon; advances per page load) ---------- */
  // 0..7 : new → waxing → full → waning
  const PHASES = 8;
  const PHASE_KEY = "gd_moon_phase_idx_v1"; // NOT gd_* (allowed)
  let phaseIdx = 0;

  try{
    const prev = parseInt(sessionStorage.getItem(PHASE_KEY) || "0", 10);
    phaseIdx = (isFinite(prev) ? (prev + 1) : 0) % PHASES;
    sessionStorage.setItem(PHASE_KEY, String(phaseIdx));
  }catch(e){
    // fallback deterministic
    phaseIdx = (Math.floor(Date.now()/1000) % PHASES);
  }

  function drawMoon(x,y,r){
    // craters
    ctx.save();
    ctx.translate(x,y);

    // glow
    ctx.globalAlpha = 0.9;
    const g = ctx.createRadialGradient(0,0, r*0.3, 0,0, r*2.3);
    g.addColorStop(0, "rgba(255,245,220,0.22)");
    g.addColorStop(0.25, "rgba(255,235,200,0.14)");
    g.addColorStop(1, "rgba(255,235,200,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0,0,r*2.3,0,Math.PI*2); ctx.fill();

    // base disk
    ctx.globalAlpha = 0.95;
    const m = ctx.createRadialGradient(-r*0.25,-r*0.25, r*0.2, 0,0, r*1.05);
    m.addColorStop(0, "rgba(255,250,235,0.98)");
    m.addColorStop(0.55, "rgba(245,235,215,0.96)");
    m.addColorStop(1, "rgba(220,205,185,0.94)");
    ctx.fillStyle = m;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();

    // craters (subtle)
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "rgba(120,100,90,1)";
    const cr = [
      {x:-0.28,y:0.10,s:0.18},
      {x:0.22,y:-0.06,s:0.14},
      {x:0.08,y:0.24,s:0.10},
      {x:-0.06,y:-0.26,s:0.08}
    ];
    for(const c of cr){
      ctx.beginPath();
      ctx.ellipse(c.x*r, c.y*r, c.s*r, c.s*r*0.78, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // phase mask (SINGLE moon, not double disk)
    // k in [-1..1]: -1=new, 0=half, 1=full
    const k = (phaseIdx / (PHASES-1)) * 2 - 1;
    // waxing (k>0) show right; waning (k<0) show left
    ctx.globalCompositeOperation = "destination-in";
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(0,0,r,0,Math.PI*2);
    ctx.clip();

    // shadow overlay
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "rgba(0,0,0,0.62)";
    ctx.beginPath();
    const offset = (-k) * r; // move shadow circle across
    ctx.arc(offset, 0, r, 0, Math.PI*2);
    ctx.fill();

    // restore normal drawing
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }

  function drawMoonReflection(x,y,r,waterY){
    // reflection is vertically flipped with blur-like alpha falloff
    const dy = (waterY - y);
    const ry = waterY + dy; // mirror across water line

    ctx.save();
    ctx.translate(x, ry);
    ctx.scale(1, -1);

    // fade with distance from water line
    const fade = Math.max(0, Math.min(1, 1 - (dy / (window.innerHeight*0.9))));
    ctx.globalAlpha = 0.18 * fade;

    // smudge streaks
    const grad = ctx.createRadialGradient(0,0, r*0.2, 0,0, r*2.4);
    grad.addColorStop(0, "rgba(255,240,210,0.20)");
    grad.addColorStop(1, "rgba(255,240,210,0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(0,0,r*2.4,0,Math.PI*2); ctx.fill();

    // main reflected moon (simpler)
    ctx.globalAlpha = 0.22 * fade;
    ctx.fillStyle = "rgba(245,235,215,0.95)";
    ctx.beginPath(); ctx.arc(0,0,r*0.98,0,Math.PI*2); ctx.fill();

    ctx.restore();
  }

  /* ---------- Clouds (smooth drift) ---------- */
  const clouds = [];
  const CLOUDS = 10;

  function spawnCloud(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.random()*w,
      y: Math.random()*(h*0.55),
      vx: 0.12 + Math.random()*0.18,
      a: 0.035 + Math.random()*0.02,
      sx: 220 + Math.random()*320,
      sy: 50 + Math.random()*90,
      t: Math.random()*1000
    };
  }
  for(let i=0;i<CLOUDS;i++) clouds.push(spawnCloud());

  function drawCloudField(t){
    for(const c of clouds){
      c.t += 0.002;
      c.x += c.vx;

      // gentle vertical drift (not wiggle)
      const yy = c.y + Math.sin(c.t)*6;

      if(c.x > window.innerWidth + c.sx) {
        c.x = -c.sx;
        c.y = Math.random()*(window.innerHeight*0.55);
      }

      ctx.globalAlpha = c.a;
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.beginPath();
      ctx.ellipse(c.x, yy, c.sx, c.sy, 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- Lanterns (drift upward) ---------- */
  const lanterns = [];
  const LANTERNS = 18;

  function spawnLantern(resetTop){
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.random()*w,
      y: resetTop ? (-50 - Math.random()*400) : (h + Math.random()*500),
      vy: 0.14 + Math.random()*0.26,
      sway: 0.35 + Math.random()*0.45,
      s: 4 + Math.random()*5,
      t: Math.random()*1000
    };
  }
  for(let i=0;i<LANTERNS;i++) lanterns.push(spawnLantern(false));

  function drawLanterns(t){
    for(const L of lanterns){
      L.t += 0.004;
      L.y -= L.vy;
      L.x += Math.sin(L.t)*L.sway;

      if(L.y < -120){
        // recycle at bottom
        const nw = spawnLantern(false);
        L.x=nw.x; L.y=nw.y; L.vy=nw.vy; L.sway=nw.sway; L.s=nw.s; L.t=nw.t;
      }

      // glow orb
      const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.s*7);
      g.addColorStop(0, "rgba(255,210,140,0.18)");
      g.addColorStop(0.25, "rgba(255,170,90,0.12)");
      g.addColorStop(1, "rgba(255,170,90,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(L.x, L.y, L.s*7, 0, Math.PI*2);
      ctx.fill();

      // core
      ctx.fillStyle = "rgba(255,210,140,0.22)";
      ctx.beginPath();
      ctx.arc(L.x, L.y, L.s, 0, Math.PI*2);
      ctx.fill();
    }
  }

  /* ---------- Waterline + subtle ripple field (cyclic, stronger) ---------- */
  function drawRipples(t, waterY){
    // ripple band near center + slight across screen
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.save();
    ctx.globalAlpha = 0.10;

    // wide horizontal shimmer (reflection)
    const band = ctx.createLinearGradient(0, waterY-120, 0, waterY+220);
    band.addColorStop(0, "rgba(255,220,170,0.00)");
    band.addColorStop(0.35, "rgba(255,220,170,0.08)");
    band.addColorStop(0.7, "rgba(255,220,170,0.05)");
    band.addColorStop(1, "rgba(255,220,170,0.00)");
    ctx.fillStyle = band;
    ctx.fillRect(0, waterY-140, w, 420);

    // ripple lines (sinusoidal)
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "rgba(255,235,200,0.55)";
    ctx.lineWidth = 1;

    const lines = 10;
    for(let i=0;i<lines;i++){
      const yy = waterY - 90 + i*26;
      const amp = 4 + i*0.6;
      const freq = 0.010 + i*0.0008;
      const speed = 0.0016 + i*0.0002;

      ctx.beginPath();
      for(let x=0;x<=w;x+=14){
        const y = yy + Math.sin(x*freq + t*speed + i)*amp;
        if(x===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ---------- Main loop ---------- */
  function frame(){
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0,0,w,h);

    const t = performance.now();

    // waterline fixed (compass sits roughly above center)
    const waterY = Math.floor(h*0.56);

    // clouds first (behind)
    drawCloudField(t);

    // ripples + reflection base
    drawRipples(t, waterY);

    // moon (single) + reflection
    // place moon outside compass area (upper right-ish)
    const mx = Math.floor(w*0.78);
    const my = Math.floor(h*0.18);
    const mr = Math.floor(Math.min(w,h)*0.06);

    drawMoon(mx,my,mr);
    drawMoonReflection(mx,my,mr,waterY);

    // lanterns last (above water/glow, still under gems)
    drawLanterns(t);

    requestAnimationFrame(frame);
  }

  frame();

})();
