(function(){
  "use strict";

  const ENGINE_KEY = "RD12_SCENE_V1";

  let raf = 0;
  let runtime = null;

  function hashString(input){
    let h = 2166136261;
    for(let i = 0; i < input.length; i++){
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRandom(seed){
    let x = seed || 1;
    return function(){
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      return ((x >>> 0) / 4294967295);
    };
  }

  function makeSeed(state){
    return hashString([
      ENGINE_KEY,
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

  function rotateX(p, angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
  }

  function rotateY(p, angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
  }

  function rotateZ(p, angle){
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
  }

  function project(p, camera, centerX, centerY, scale){
    const depth = camera / (camera - p.z);
    return {
      x: centerX + p.x * depth * scale,
      y: centerY + p.y * depth * scale,
      z: p.z,
      depth
    };
  }

  function buildVertices(){
    return [
      { x:  2, y:  0, z:  0 },
      { x: -2, y:  0, z:  0 },
      { x:  0, y:  2, z:  0 },
      { x:  0, y: -2, z:  0 },
      { x:  0, y:  0, z:  2 },
      { x:  0, y:  0, z: -2 },

      { x:  1, y:  1, z:  1 },
      { x:  1, y:  1, z: -1 },
      { x:  1, y: -1, z:  1 },
      { x:  1, y: -1, z: -1 },
      { x: -1, y:  1, z:  1 },
      { x: -1, y:  1, z: -1 },
      { x: -1, y: -1, z:  1 },
      { x: -1, y: -1, z: -1 }
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
    const map = new Map();
    for(const face of faces){
      for(let i = 0; i < face.length; i++){
        const a = face[i];
        const b = face[(i + 1) % face.length];
        const key = a < b ? a + ":" + b : b + ":" + a;
        if(!map.has(key)){
          map.set(key, [a, b]);
        }
      }
    }
    return Array.from(map.values());
  }

  function makeNodes(seed){
    const random = makeRandom(seed ^ 0x9e3779b9);
    const nodes = [];
    for(let i = 0; i < 12; i++){
      nodes.push({
        orbit: 0.58 + random() * 0.26,
        angle: random() * Math.PI * 2,
        speed: 0.00022 + random() * 0.00036,
        radius: 1.8 + random() * 1.8,
        alpha: 0.42 + random() * 0.42,
        band: i
      });
    }
    return nodes;
  }

  function makeField(seed){
    const random = makeRandom(seed ^ 0x85ebca6b);
    const field = [];
    for(let i = 0; i < 44; i++){
      field.push({
        x: random(),
        y: random(),
        z: 0.25 + random() * 0.75,
        drift: random() * Math.PI * 2
      });
    }
    return field;
  }

  function drawBackground(ctx, w, h){
    const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.7);
    g.addColorStop(0, "rgba(255,255,255,0.08)");
    g.addColorStop(0.3, "rgba(255,255,255,0.03)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawField(ctx, field, t, w, h){
    for(const f of field){
      const x = f.x * w + Math.cos(t * 0.0001 + f.drift) * 8;
      const y = f.y * h + Math.sin(t * 0.00012 + f.drift) * 8;
      const r = f.z * 1.25;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.08 + f.z * 0.12) + ")";
      ctx.fill();
    }
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

      const glow = Math.max(0.08, 0.14 + item.avg * 0.018);
      ctx.fillStyle = "rgba(255,255,255," + glow + ")";
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  function drawEdges(ctx, projected, edges){
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1;
    for(const [a, b] of edges){
      ctx.beginPath();
      ctx.moveTo(projected[a].x, projected[a].y);
      ctx.lineTo(projected[b].x, projected[b].y);
      ctx.stroke();
    }
  }

  function drawNodes(ctx, nodes, t, centerX, centerY, radiusX, radiusY){
    for(const n of nodes){
      const angle = n.angle + t * n.speed;
      const x = centerX + Math.cos(angle) * radiusX * n.orbit;
      const y = centerY + Math.sin(angle) * radiusY * n.orbit;
      const pulse = 0.72 + Math.sin(t * 0.0016 + n.band) * 0.18;
      const r = n.radius * pulse;

      ctx.beginPath();
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + n.alpha + ")";
      ctx.fill();
    }
  }

  function drawCrossLinks(ctx, nodes, t, centerX, centerY, radiusX, radiusY){
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    for(let i = 0; i < nodes.length; i++){
      const a = nodes[i];
      const b = nodes[(i + 3) % nodes.length];

      const aa = a.angle + t * a.speed;
      const ba = b.angle + t * b.speed;

      const ax = centerX + Math.cos(aa) * radiusX * a.orbit;
      const ay = centerY + Math.sin(aa) * radiusY * a.orbit;
      const bx = centerX + Math.cos(ba) * radiusX * b.orbit;
      const by = centerY + Math.sin(ba) * radiusY * b.orbit;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }

  function frame(ts){
    if(!runtime) return;

    const view = resize(runtime.canvas);
    const ctx = runtime.ctx;
    const scale = view.ratio;

    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, view.width, view.height);

    drawBackground(ctx, view.width, view.height);
    drawField(ctx, runtime.field, ts, view.width, view.height);

    const centerX = view.width * 0.5;
    const centerY = view.height * 0.44;
    const objectScale = Math.min(view.width, view.height) * 0.12;

    const projected = runtime.vertices.map(v => {
      let p = rotateY(v, ts * 0.00032 + runtime.seedRotation.y);
      p = rotateX(p, Math.sin(ts * 0.00018 + runtime.seedRotation.x) * 0.42 + 0.52);
      p = rotateZ(p, ts * 0.00012 + runtime.seedRotation.z);
      return project(p, 7, centerX, centerY, objectScale);
    });

    drawFaces(ctx, projected, runtime.faces);
    drawEdges(ctx, projected, runtime.edges);

    const radiusX = Math.min(view.width, view.height) * 0.24;
    const radiusY = radiusX * 0.68;

    drawCrossLinks(ctx, runtime.nodes, ts, centerX, centerY, radiusX, radiusY);
    drawNodes(ctx, runtime.nodes, ts, centerX, centerY, radiusX, radiusY);

    raf = requestAnimationFrame(frame);
  }

  function stop(){
    if(raf){
      cancelAnimationFrame(raf);
      raf = 0;
    }
    if(runtime && runtime._onResize){
      window.removeEventListener("resize", runtime._onResize);
    }
    runtime = null;
  }

  function start(canvas, config){
    stop();

    const ctx = canvas.getContext("2d");
    if(!ctx) return;

    const seed = makeSeed(config.state || {});
    const random = makeRandom(seed);

    runtime = {
      canvas,
      ctx,
      seed,
      vertices: buildVertices(),
      faces: buildFaces(),
      edges: buildEdges(buildFaces()),
      nodes: makeNodes(seed),
      field: makeField(seed),
      seedRotation: {
        x: random() * Math.PI * 2,
        y: random() * Math.PI * 2,
        z: random() * Math.PI * 2
      }
    };

    runtime._onResize = function(){
      resize(canvas);
    };

    window.addEventListener("resize", runtime._onResize);
    resize(canvas);
    raf = requestAnimationFrame(frame);
  }

  window.RD12_SCENE = {
    start,
    stop
  };
})();
