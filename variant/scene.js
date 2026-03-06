(function(){
  "use strict";

  const ENGINE_ID = "DRAGON_COMPASS_HOME_V1";

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
    const out = [];
    for(let i = 0; i < 44; i++){
      out.push({
        x: random(),
        y: random(),
        z: 0.2 + random() * 0.8,
        phase: random() * Math.PI * 2
      });
    }
    return out;
  }

  function makeDragon(seed, offset){
    const random = rng(seed ^ offset);
    const segments = [];
    for(let i = 0; i < 18; i++){
      segments.push({
        radius: 9 - i * 0.28 + random() * 0.2,
        phase: random() * Math.PI * 2
      });
    }
    return {
      baseAngle: random() * Math.PI * 2,
      speed: 0.00018 + random() * 0.00016,
      orbit: 0.72 + random() * 0.1,
      wave: 0.18 + random() * 0.08,
      lift: 0.16 + random() * 0.08,
      alpha: 0.15 + random() * 0.06,
      glow: 0.22 + random() * 0.08,
      segments
    };
  }

  function drawBackground(ctx, w, h){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"rgba(4,7,13,0.88)");
    g.addColorStop(.45,"rgba(6,10,18,0.64)");
    g.addColorStop(1,"rgba(4,7,13,0.94)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const rg = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, Math.max(w,h) * 0.68);
    rg.addColorStop(0,"rgba(255,255,255,0.07)");
    rg.addColorStop(.3,"rgba(255,255,255,0.02)");
    rg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0,0,w,h);
  }

  function drawStars(ctx, stars, t, w, h){
    for(const s of stars){
      const x = s.x * w + Math.cos(s.phase + t * 0.00008) * 10;
      const y = s.y * h + Math.sin(s.phase + t * 0.0001) * 10;
      const r = s.z * 1.35;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.05 + s.z * 0.11) + ")";
      ctx.fill();
    }
  }

  function drawWater(ctx, t, w, h){
    const top = h * 0.68;

    const g = ctx.createLinearGradient(0, top, 0, h);
    g.addColorStop(0,"rgba(40,70,105,0.08)");
    g.addColorStop(.45,"rgba(30,58,92,0.16)");
    g.addColorStop(1,"rgba(18,32,56,0.28)");
    ctx.fillStyle = g;
    ctx.fillRect(0, top, w, h - top);

    for(let layer = 0; layer < 3; layer++){
      const yBase = top + layer * 20;
      ctx.beginPath();
      for(let x = 0; x <= w; x += 12){
        const y = yBase + Math.sin(x * 0.016 + t * (0.0012 + layer * 0.0002)) * (6 + layer * 2);
        if(x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(180,210,255," + (0.07 + layer * 0.03) + ")";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function drawCompass(ctx, cx, cy, radius){
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const dirs = [
      { label:"N", x:0, y:-1 },
      { label:"E", x:1, y:0 },
      { label:"S", x:0, y:1 },
      { label:"W", x:-1, y:0 }
    ];

    ctx.font = "700 13px system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(234,201,124,0.9)";

    for(const d of dirs){
      const x = cx + d.x * radius * 1.08;
      const y = cy + d.y * radius * 1.08;
      ctx.fillText(d.label, x, y);
    }
  }

  function drawFaces(ctx, projected, faces){
    const ordered = faces.map(face => {
      const avg = face.reduce((sum, idx) => sum + projected[idx].z, 0) / face.length;
      return { face, avg };
    }).sort((a,b) => a.avg - b.avg);

    for(const item of ordered){
      const face = item.face;
      ctx.beginPath();
      ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
      for(let i = 1; i < face.length; i++){
        ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
      }
      ctx.closePath();
      const alpha = Math.max(0.05, 0.09 + item.avg * 0.013);
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawEdges(ctx, projected, edges){
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    for(const [a,b] of edges){
      ctx.beginPath();
      ctx.moveTo(projected[a].x, projected[a].y);
      ctx.lineTo(projected[b].x, projected[b].y);
      ctx.stroke();
    }
  }

  function drawDragon(ctx, dragon, t, cx, cy, rx, ry, mirrored){
    const pts = [];
    const dir = mirrored ? -1 : 1;
    const base = dragon.baseAngle + t * dragon.speed * dir;

    for(let i = 0; i < dragon.segments.length; i++){
      const s = dragon.segments[i];
      const lag = i * 0.22;
      const angle = base - lag * dir;
      const ripple = Math.sin(t * 0.0016 + s.phase + i * 0.32) * dragon.wave;
      const x = cx + Math.cos(angle) * rx * dragon.orbit + Math.cos(angle * 2.1) * 14 * ripple;
      const y = cy + Math.sin(angle) * ry * dragon.orbit * (0.74 + dragon.lift) + Math.sin(angle * 1.7) * 10 * ripple;
      pts.push({ x, y, r: s.radius });
    }

    for(let i = pts.length - 1; i >= 0; i--){
      const p = pts[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.9, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (dragon.alpha * 0.12) + ")";
      ctx.fill();
    }

    for(let i = pts.length - 1; i >= 0; i--){
      const p = pts[i];
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 1.8);
      grad.addColorStop(0,"rgba(255,255,255," + (dragon.glow) + ")");
      grad.addColorStop(0.45,"rgba(210,232,255," + (dragon.alpha + 0.1) + ")");
      grad.addColorStop(1,"rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    for(let i = pts.length - 1; i >= 0; i--){
      const p = pts[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(248,252,255," + (0.18 + dragon.alpha) + ")";
      ctx.fill();
    }

    const head = pts[0];
    ctx.beginPath();
    ctx.arc(head.x, head.y, head.r * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255," + (0.28 + dragon.alpha) + ")";
    ctx.fill();

    const hornA = {
      x: head.x + (mirrored ? -1 : 1) * head.r * 1.1,
      y: head.y - head.r * 1.15
    };
    const hornB = {
      x: head.x + (mirrored ? -1 : 1) * head.r * 0.2,
      y: head.y - head.r * 1.55
    };

    ctx.beginPath();
    ctx.moveTo(head.x, head.y - head.r * 0.3);
    ctx.lineTo(hornA.x, hornA.y);
    ctx.lineTo(hornB.x, hornB.y);
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  function drawReflection(ctx, dragons, t, w, h){
    const top = h * 0.73;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, top, w, h - top);
    ctx.clip();
    ctx.translate(0, h * 1.46);
    ctx.scale(1, -0.38);
    ctx.globalAlpha = 0.14;
    for(let i = 0; i < dragons.length; i++){
      const drag = dragons[i];
      drawDragon(ctx, drag, t + 2000, w * 0.5, h * 0.38, Math.min(w,h) * 0.36, Math.min(w,h) * 0.16, i === 1);
    }
    ctx.restore();
  }

  function frame(ts){
    if(!active) return;

    const view = resize(active.canvas);
    const ctx = active.ctx;
    ctx.setTransform(view.ratio,0,0,view.ratio,0,0);
    ctx.clearRect(0,0,view.width,view.height);

    drawBackground(ctx, view.width, view.height);
    drawStars(ctx, active.stars, ts, view.width, view.height);

    const cx = view.width * 0.5;
    const cy = view.height * 0.42;
    const scale = Math.min(view.width, view.height) * 0.115;

    const projected = active.vertices.map(v => {
      let p = rotateY(v, ts * 0.00022 + active.rot.y);
      p = rotateX(p, 0.58 + Math.sin(ts * 0.00014 + active.rot.x) * 0.28);
      p = rotateZ(p, ts * 0.00008 + active.rot.z);
      return project(p, 7, cx, cy, scale);
    });

    drawCompass(ctx, cx, cy, Math.min(view.width, view.height) * 0.18);
    drawFaces(ctx, projected, active.faces);
    drawEdges(ctx, projected, active.edges);

    const rx = Math.min(view.width, view.height) * 0.34;
    const ry = rx * 0.46;

    drawDragon(ctx, active.dragons[0], ts, cx, cy, rx, ry, false);
    drawDragon(ctx, active.dragons[1], ts, cx, cy, rx, ry, true);

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
