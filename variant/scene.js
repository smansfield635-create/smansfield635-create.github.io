(function(){
  "use strict";

  const canvas = document.getElementById("scene");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });

  const state = {
    tick: 0
  };

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawSky(w,h){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, "#260b0b");
    g.addColorStop(0.30, "#7d1d15");
    g.addColorStop(0.68, "#d34e24");
    g.addColorStop(1, "#41130e");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const rg = ctx.createRadialGradient(w*0.5, h*0.34, 0, w*0.5, h*0.34, Math.max(w,h)*0.72);
    rg.addColorStop(0, "rgba(255,228,180,0.18)");
    rg.addColorStop(0.30, "rgba(255,195,120,0.07)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0,0,w,h);
  }

  function drawMoon(w,h){
    const x = w * 0.76;
    const y = h * 0.18;
    const r = Math.max(24, Math.min(w,h) * 0.036);

    const glow = ctx.createRadialGradient(x,y,0,x,y,r*2.4);
    glow.addColorStop(0, "rgba(255,245,215,.42)");
    glow.addColorStop(0.45, "rgba(255,228,170,.18)");
    glow.addColorStop(1, "rgba(255,220,170,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x,y,r*2.4,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "rgba(220,220,205,.95)";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }

  function drawCompass(w,h,t){
    const cx = w * 0.50;
    const cy = h * 0.56;
    const r = Math.min(w,h) * 0.305;

    const dome = ctx.createRadialGradient(cx, cy-r*0.30, 0, cx, cy, r*1.18);
    dome.addColorStop(0, "rgba(255,245,230,.12)");
    dome.addColorStop(0.32, "rgba(255,205,150,.07)");
    dome.addColorStop(0.76, "rgba(82,22,16,.18)");
    dome.addColorStop(1, "rgba(18,8,10,.36)");
    ctx.fillStyle = dome;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fill();

    for(let i=0;i<52;i++){
      const a = -Math.PI/2 + (i/52) * Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a)*r*0.98, cy + Math.sin(a)*r*0.98);
      ctx.strokeStyle = "rgba(255,245,230,0.08)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    for(let i=1;i<=5;i++){
      ctx.beginPath();
      ctx.arc(cx, cy, r*(i/5), 0, Math.PI*2);
      ctx.strokeStyle = "rgba(255,245,230," + (0.035 + i*0.01) + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for(let i=0;i<80;i++){
      const frac = i / 79;
      const a = frac * Math.PI*2;
      const wav = Math.sin(frac*14 - t*1.8) * 8 + Math.sin(frac*7 - t*1.1) * 5;
      const rr = r * (0.08 + frac*0.88) + wav;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, a, a + Math.PI/2.85);
      ctx.strokeStyle = "rgba(255,232,195," + (0.028 + frac*0.05) + ")";
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = "rgba(255,248,235,.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(235,199,120,.95)";
    ctx.font = "800 14px system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", cx, cy-r-18);
    ctx.fillText("E", cx+r+18, cy);
    ctx.fillText("S", cx, cy+r+18);
    ctx.fillText("W", cx-r-18, cy);
  }

  function drawWater(w,h,t){
    const y0 = h * 0.72;
    const g = ctx.createLinearGradient(0,y0,0,h);
    g.addColorStop(0, "rgba(255,225,185,.08)");
    g.addColorStop(0.5, "rgba(230,175,128,.14)");
    g.addColorStop(1, "rgba(90,30,18,.28)");
    ctx.fillStyle = g;
    ctx.fillRect(0,y0,w,h-y0);

    for(let row=0; row<5; row++){
      const yy = y0 + row*22;
      ctx.beginPath();
      for(let x=0; x<=w; x+=12){
        const y = yy + Math.sin(x*0.014 + t*1.0 + row*0.5) * (5 + row*2.2);
        if(x===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }
      ctx.strokeStyle = "rgba(255,235,210," + (0.055 + row*0.022) + ")";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  function dragonBody(dir, offsetY, offsetPhase){
    const w = window.innerWidth;
    const h = window.innerHeight;
    const progress = ((state.tick * 0.00062) + offsetPhase) % 1;
    const headStart = dir > 0 ? -w * 0.32 : w * 1.32;
    const headEnd = dir > 0 ? w * 1.32 : -w * 0.32;
    const headX = headStart + (headEnd - headStart) * progress;
    const baseY = h * 0.31 + offsetY;
    const segs = 34;
    const spacing = 18;
    const pts = [];

    for(let i=0;i<segs;i++){
      const x = headX - dir * i * spacing;
      const y = baseY
        + Math.sin((progress*6.0 + i*0.13 + state.tick*0.028) * Math.PI) * 24
        + Math.sin((progress*14.0 + i*0.22 + state.tick*0.013) * Math.PI) * 8;
      const size = Math.max(5, 18 - i*0.34);
      pts.push({ x, y, size });
    }
    return pts;
  }

  function drawDragon(pts, palette, dir){
    const upper = [];
    const lower = [];

    for(let i=0;i<pts.length;i++){
      const p = pts[i];
      const prev = pts[Math.max(0, i-1)];
      const next = pts[Math.min(pts.length-1, i+1)];
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;

      upper.push({ x: p.x + nx * p.size, y: p.y + ny * p.size });
      lower.push({ x: p.x - nx * p.size, y: p.y - ny * p.size });
    }

    ctx.beginPath();
    ctx.moveTo(upper[0].x, upper[0].y);
    for(let i=1;i<upper.length;i++) ctx.lineTo(upper[i].x, upper[i].y);
    for(let i=lower.length-1;i>=0;i--) ctx.lineTo(lower[i].x, lower[i].y);
    ctx.closePath();

    const grad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[pts.length-1].x, pts[pts.length-1].y);
    grad.addColorStop(0, palette[0]);
    grad.addColorStop(0.55, palette[1]);
    grad.addColorStop(1, palette[2]);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(12,12,12,.92)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const head = pts[0];
    ctx.beginPath();
    ctx.arc(head.x, head.y, head.size*0.9, 0, Math.PI*2);
    ctx.fillStyle = palette[1];
    ctx.fill();
    ctx.strokeStyle = "rgba(12,12,12,.94)";
    ctx.lineWidth = 2.3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x + dir*head.size*0.40, head.y);
    ctx.lineTo(head.x + dir*head.size*1.40, head.y - head.size*0.22);
    ctx.lineTo(head.x + dir*head.size*1.12, head.y + head.size*0.20);
    ctx.closePath();
    ctx.fillStyle = palette[1];
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x - dir*head.size*0.10, head.y - head.size*0.14);
    ctx.lineTo(head.x + dir*head.size*0.58, head.y - head.size*1.05);
    ctx.lineTo(head.x + dir*head.size*0.16, head.y - head.size*1.30);
    ctx.strokeStyle = "rgba(240,220,150,.76)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawReflections(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    const y0 = h * 0.74;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y0, w, h-y0);
    ctx.clip();
    ctx.globalAlpha = 0.15;
    ctx.translate(0, h*1.48);
    ctx.scale(1, -0.34);

    const wise = dragonBody(1, -28, 0.00);
    const fear = dragonBody(-1, 44, 0.22);

    drawDragon(wise, ["rgba(70,150,105,.18)","rgba(28,110,64,.24)","rgba(14,52,30,.20)"], 1);
    drawDragon(fear, ["rgba(150,40,32,.18)","rgba(110,10,12,.24)","rgba(52,8,10,.20)"], -1);

    ctx.restore();
  }

  function frame(){
    state.tick += 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0,0,w,h);
    drawSky(w,h);
    drawMoon(w,h);
    drawWater(w,h, state.tick * 0.012);
    drawCompass(w,h, state.tick * 0.012);

    const wise = dragonBody(1, -28, 0.00);
    const fear = dragonBody(-1, 44, 0.22);

    drawDragon(wise, ["rgba(55,160,90,.95)","rgba(26,122,54,.98)","rgba(12,70,30,.98)"], 1);
    drawDragon(fear, ["rgba(178,32,30,.96)","rgba(142,10,12,.98)","rgba(84,8,10,.98)"], -1);

    drawReflections();
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  frame();
})();
