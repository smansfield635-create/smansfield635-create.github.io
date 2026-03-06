(function(){
  "use strict";

  const ENGINE_ID = "DRAGON_COMPASS_HOME_V2";

  let raf = 0;
  let active = null;

  function hashString(input){
    let h = 2166136261;
    for(let i = 0; i < input.length; i++){
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function rng(seed){
    let x = seed || 1;
    return function(){
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return ((x >>> 0) / 4294967295);
    };
  }

  function seedFromState(state){
    return hashString([
      ENGINE_ID,
      state.lang || "en",
      state.style || "formal",
      state.time || "now",
      state.depth || "explore"
    ].join("|"));
  }

  function resize(canvas){
    const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const width = Math.max(window.innerWidth, 320);
    const height = Math.max(window.innerHeight, 560);

    if(canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)){
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }

    return { width, height, ratio };
  }

  function rotateX(p, a){
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x:p.x, y:p.y * c - p.z * s, z:p.y * s + p.z * c };
  }

  function rotateY(p, a){
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x:p.x * c + p.z * s, y:p.y, z:-p.x * s + p.z * c };
  }

  function rotateZ(p, a){
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x:p.x * c - p.y * s, y:p.x * s + p.y * c, z:p.z };
  }

  function project(p, camera, cx, cy, scale){
    const d = camera / (camera - p.z);
    return {
      x: cx + p.x * d * scale,
      y: cy + p.y * d * scale,
      z: p.z,
      depth: d
    };
  }

  function buildVertices(){
    return [
      {x:  2,y:  0,z:  0},
      {x: -2,y:  0,z:  0},
      {x:  0,y:  2,z:  0},
      {x:  0,y: -2,z:  0},
      {x:  0,y:  0,z:  2},
      {x:  0,y:  0,z: -2},
      {x:  1,y:  1,z:  1},
      {x:  1,y:  1,z: -1},
      {x:  1,y: -1,z:  1},
      {x:  1,y: -1,z: -1},
      {x: -1,y:  1,z:  1},
      {x: -1,y:  1,z: -1},
      {x: -1,y: -1,z:  1},
      {x: -1,y: -1,z: -1}
    ];
  }

  function buildFaces(){
    return [
      [0,6,2,8],
      [0,8,3,9],
      [0,9,5,7],
      [0,7,2,6],
      [1,10,2,11],
      [1,13,3,12],
      [1,11,5,13],
      [1,12,4,10],
      [4,6,0,8],
      [4,10,1,12],
      [4,8,3,12],
      [4,6,2,10]
    ];
  }

  function buildEdges(faces){
    const out = [];
    const seen = new Set();

    for(const face of faces){
      for(let i = 0; i < face.length; i++){
        const a = face[i];
        const b = face[(i + 1) % face.length];
        const key = a < b ? a + ":" + b : b + ":" + a;
        if(!seen.has(key)){
          seen.add(key);
          out.push([a,b]);
        }
      }
    }

    return out;
  }

  function makeStars(seed){
    const random = rng(seed ^ 0x85ebca6b);
    const list = [];
    for(let i = 0; i < 36; i++){
      list.push({
        x: random(),
        y: random(),
        z: 0.2 + random() * 0.8,
        phase: random() * Math.PI * 2
      });
    }
    return list;
  }

  function makeDragon(seed, salt){
    const random = rng(seed ^ salt);
    const segments = [];
    for(let i = 0; i < 24; i++){
      segments.push({
        size: 11 - i * 0.22 + random() * 0.25,
        phase: random() * Math.PI * 2
      });
    }

    return {
      orbit: 0.78 + random() * 0.1,
      speed: 0.00012 + random() * 0.0001,
      wave: 0.18 + random() * 0.08,
      lift: 0.14 + random() * 0.06,
      tilt: random() * Math.PI * 2,
      headGlow: 0.2 + random() * 0.08,
      bodyGlow: 0.13 + random() * 0.05,
      alpha: 0.16 + random() * 0.06,
      segments
    };
  }

  function drawBackground(ctx, w, h){
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(4,7,13,0.94)");
    g.addColorStop(0.45, "rgba(6,10,18,0.74)");
    g.addColorStop(1, "rgba(4,7,13,0.98)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const rg = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.7);
    rg.addColorStop(0, "rgba(255,255,255,0.06)");
    rg.addColorStop(0.3, "rgba(255,255,255,0.018)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStars(ctx, stars, t, w, h){
    for(const s of stars){
      const x = s.x * w + Math.cos(s.phase + t * 0.00008) * 8;
      const y = s.y * h + Math.sin(s.phase + t * 0.0001) * 8;
      const r = s.z * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.03 + s.z * 0.08) + ")";
      ctx.fill();
    }
  }

  function drawWater(ctx, t, w, h){
    const horizon = h * 0.67;

    const g = ctx.createLinearGradient(0, horizon, 0, h);
    g.addColorStop(0, "rgba(36,66,102,0.04)");
    g.addColorStop(0.45, "rgba(25,49,82,0.14)");
    g.addColorStop(1, "rgba(16,30,50,0.26)");
    ctx.fillStyle = g;
    ctx.fillRect(0, horizon, w, h - horizon);

    for(let layer = 0; layer < 4; layer++){
      const yBase = horizon + layer * 18;
      ctx.beginPath();
      for(let x = 0; x <= w; x += 10){
        const y = yBase + Math.sin(x * 0.014 + t * (0.001 + layer * 0.00018)) * (5 + layer * 2.4);
        if(x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(170,205,255," + (0.05 + layer * 0.028) + ")";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  function drawCompass(ctx, cx, cy, radius){
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "700 13px system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(234,201,124,0.9)";

    ctx.fillText("N", cx, cy - radius * 1.07);
    ctx.fillText("E", cx + radius * 1.07, cy);
    ctx.fillText("S", cx, cy + radius * 1.07);
    ctx.fillText("W", cx - radius * 1.07, cy);
  }

  function drawFaces(ctx, projected, faces){
    const ordered = faces.map(face => {
      const avg = face.reduce((sum, idx) => sum + projected[idx].z, 0) / face.length;
      return { face, avg };
    }).sort((a, b) => a.avg - b.avg);

    for(const item of ordered){
      const face = item.face;
      ctx.beginPath();
      ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
      for(let i = 1; i < face.length; i++){
        ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
      }
      ctx.closePath();
      const alpha = Math.max(0.04, 0.075 + item.avg * 0.01);
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.11)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawEdges(ctx, projected, edges){
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1;
    for(const edge of edges){
      ctx.beginPath();
      ctx.moveTo(projected[edge[0]].x, projected[edge[0]].y);
      ctx.lineTo(projected[edge[1]].x, projected[edge[1]].y);
      ctx.stroke();
    }
  }

  function buildDragonPath(dragon, t, cx, cy, rx, ry, mirrored){
    const path = [];
    const dir = mirrored ? -1 : 1;
    const base = t * dragon.speed * dir + dragon.tilt;

    for(let i = 0; i < dragon.segments.length; i++){
      const seg = dragon.segments[i];
      const lag = i * 0.19;
      const ang = base - lag * dir;
      const ripple = Math.sin(t * 0.0013 + seg.phase + i * 0.36) * dragon.wave;
      const x = cx + Math.cos(ang) * rx * dragon.orbit + Math.cos(ang * 2.2) * 16 * ripple;
      const y = cy + Math.sin(ang) * ry * dragon.orbit * (0.78 + dragon.lift) + Math.sin(ang * 1.7) * 8 * ripple;
      path.push({ x, y, r: seg.size });
    }

    return path;
  }

  function drawDragonTrail(ctx, path, alpha){
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for(let i = 1; i < path.length; i++){
      const p = path[i];
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "rgba(220,236,255," + alpha + ")";
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  function drawDragonBody(ctx, dragon, path, mirrored){
    drawDragonTrail(ctx, path, dragon.alpha * 0.65);

    for(let i = path.length - 1; i >= 0; i--){
      const p = path[i];

      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
      glow.addColorStop(0, "rgba(255,255,255," + (dragon.bodyGlow + 0.04) + ")");
      glow.addColorStop(0.55, "rgba(180,220,255," + (dragon.alpha * 0.5) + ")");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245,250,255," + (0.12 + dragon.alpha) + ")";
      ctx.fill();
    }

    const head = path[0];

    ctx.beginPath();
    ctx.arc(head.x, head.y, head.r * 1.06, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + (dragon.headGlow + 0.08) + ")";
    ctx.fill();

    const dir = mirrored ? -1 : 1;

    ctx.beginPath();
    ctx.moveTo(head.x, head.y - head.r * 0.25);
    ctx.lineTo(head.x + dir * head.r * 0.9, head.y - head.r * 1.1);
    ctx.lineTo(head.x + dir * head.r * 0.2, head.y - head.r * 1.45);
    ctx.strokeStyle = "rgba(255,255,255,0.26)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x, head.y + head.r * 0.15);
    ctx.lineTo(head.x + dir * head.r * 1.22, head.y + head.r * 0.1);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  function drawReflection(ctx, dragons, t, w, h){
    const waterTop = h * 0.71;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, waterTop, w, h - waterTop);
    ctx.clip();

    ctx.translate(0, h * 1.44);
    ctx.scale(1, -0.34);
    ctx.globalAlpha = 0.12;

    const cx = w * 0.5;
    const cy = h * 0.42;
    const rx = Math.min(w, h) * 0.34;
    const ry = rx * 0.42;

    for(let i = 0; i < dragons.length; i++){
      const path = buildDragonPath(dragons[i], t + 1200, cx, cy, rx, ry, i === 1);
      drawDragonBody(ctx, dragons[i], path, i === 1);
    }

    ctx.restore();
  }

  function frame(ts){
    if(!active) return;

    const view = resize(active.canvas);
    const ctx = active.ctx;
    ctx.setTransform(view.ratio, 0, 0, view.ratio, 0, 0);
    ctx.clearRect(0, 0, view.width, view.height);

    drawBackground(ctx, view.width, view.height);
    drawStars(ctx, active.stars, ts, view.width, view.height);

    const cx = view.width * 0.5;
    const cy = view.height * 0.42;
    const scale = Math.min(view.width, view.height) * 0.11;

    const projected = active.vertices.map(v => {
      let p = rotateY(v, ts * 0.00016 + active.rot.y);
      p = rotateX(p, 0.56 + Math.sin(ts * 0.00011 + active.rot.x) * 0.24);
      p = rotateZ(p, ts * 0.00006 + active.rot.z);
      return project(p, 7, cx, cy, scale);
    });

    drawCompass(ctx, cx, cy, Math.min(view.width, view.height) * 0.18);
    drawFaces(ctx, projected, active.faces);
    drawEdges(ctx, projected, active.edges);

    const rx = Math.min(view.width, view.height) * 0.34;
    const ry = rx * 0.42;

    for(let i = 0; i < active.dragons.length; i++){
      const mirrored = i === 1;
      const path = buildDragonPath(active.dragons[i], ts, cx, cy, rx, ry, mirrored);
      drawDragonBody(ctx, active.dragons[i], path, mirrored);
    }

    drawWater(ctx, ts, view.width, view.height);
    drawReflection(ctx, active.dragons, ts, view.width, view.height);

    raf = requestAnimationFrame(frame);
  }

  function stop(){
    if(raf){
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if(active && active._resize){
      window.removeEventListener("resize", active._resize);
    }
    active = null;
  }

  function start(canvas, config){
    stop();

    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const seed = seedFromState(config.state || {});
    const random = rng(seed);

    active = {
      canvas,
      ctx,
      vertices: buildVertices(),
      faces: buildFaces(),
      edges: buildEdges(buildFaces()),
      stars: makeStars(seed),
      dragons: [
        makeDragon(seed, 0x9e3779b9),
        makeDragon(seed, 0x7f4a7c15)
      ],
      rot: {
        x: random() * Math.PI * 2,
        y: random() * Math.PI * 2,
        z: random() * Math.PI * 2
      }
    };

    active._resize = function(){ resize(canvas); };
    window.addEventListener("resize", active._resize);
    resize(canvas);
    raf = requestAnimationFrame(frame);
  }

  window.DRAGON_COMPASS_SCENE = {
    start,
    stop
  };
})();
