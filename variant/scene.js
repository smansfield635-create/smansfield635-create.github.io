(function(){
  "use strict";

  const ENGINE_ID = "RD12_HOME_SCENE_V2";

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

  function rotateX(p, a){
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x:p.x, y:p.y*c - p.z*s, z:p.y*s + p.z*c };
  }

  function rotateY(p, a){
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x:p.x*c + p.z*s, y:p.y, z:-p.x*s + p.z*c };
  }

  function rotateZ(p, a){
    const c = Math.cos(a);
    const s = Math.sin(a);
    return { x:p.x*c - p.y*s, y:p.x*s + p.y*c, z:p.z };
  }

  function project(p, camera, cx, cy, scale){
    const depth = camera / (camera - p.z);
    return {
      x: cx + p.x * depth * scale,
      y: cy + p.y * depth * scale,
      z: p.z,
      depth
    };
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

  function makeOrbitNodes(seed){
    const random = rng(seed ^ 0x9e3779b9);
    const list = [];
    for(let i = 0; i < 12; i++){
      list.push({
        orbit: 0.56 + random() * 0.26,
        angle: random() * Math.PI * 2,
        speed: 0.00018 + random() * 0.00034,
        radius: 1.8 + random() * 1.8,
        alpha: 0.42 + random() * 0.34,
        band: i
      });
    }
    return list;
  }

  function makeField(seed){
    const random = rng(seed ^ 0x85ebca6b);
    const list = [];
    for(let i = 0; i < 40; i++){
      list.push({
        x: random(),
        y: random(),
        z: 0.2 + random() * 0.8,
        phase: random() * Math.PI * 2
      });
    }
    return list;
  }

  function drawBackground(ctx, w, h){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"rgba(5,7,12,0.82)");
    g.addColorStop(.45,"rgba(5,7,12,0.58)");
    g.addColorStop(1,"rgba(5,7,12,0.92)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const rg = ctx.createRadialGradient(w*0.5,h*0.42,0,w*0.5,h*0.42,Math.max(w,h)*0.68);
    rg.addColorStop(0,"rgba(255,255,255,0.08)");
    rg.addColorStop(.3,"rgba(255,255,255,0.025)");
    rg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0,0,w,h);
  }

  function drawField(ctx, field, t, w, h){
    for(const item of field){
      const x = item.x * w + Math.cos(item.phase + t * 0.00008) * 10;
      const y = item.y * h + Math.sin(item.phase + t * 0.0001) * 10;
      const r = item.z * 1.35;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + (0.06 + item.z * 0.12) + ")";
      ctx.fill();
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
      const alpha = Math.max(0.07, 0.12 + item.avg * 0.017);
      ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1.05;
      ctx.stroke();
    }
  }

  function drawEdges(ctx, projected, edges){
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1;
    for(const [a,b] of edges){
      ctx.beginPath();
      ctx.moveTo(projected[a].x, projected[a].y);
      ctx.lineTo(projected[b].x, projected[b].y);
      ctx.stroke();
    }
  }

  function drawNodes(ctx, nodes, t, cx, cy, rx, ry){
    for(const n of nodes){
      const angle = n.angle + t * n.speed;
      const x = cx + Math.cos(angle) * rx * n.orbit;
      const y = cy + Math.sin(angle) * ry * n.orbit;
      const pulse = 0.76 + Math.sin(t * 0.0014 + n.band) * 0.18;
      const r = n.radius * pulse;

      ctx.beginPath();
      ctx.arc(x, y, r * 2.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + n.alpha + ")";
      ctx.fill();
    }
  }

  function drawLinks(ctx, nodes, t, cx, cy, rx, ry){
    ctx.strokeStyle = "rgba(255,255,255,0.075)";
    ctx.lineWidth = 1;
    for(let i = 0; i < nodes.length; i++){
      const a = nodes[i];
      const b = nodes[(i + 3) % nodes.length];

      const aa = a.angle + t * a.speed;
      const ba = b.angle + t * b.speed;

      const ax = cx + Math.cos(aa) * rx * a.orbit;
      const ay = cy + Math.sin(aa) * ry * a.orbit;
      const bx = cx + Math.cos(ba) * rx * b.orbit;
      const by = cy + Math.sin(ba) * ry * b.orbit;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  }

  function frame(ts){
    if(!active) return;

    const view = resize(active.canvas);
    const ctx = active.ctx;

    ctx.setTransform(view.ratio,0,0,view.ratio,0,0);
    ctx.clearRect(0,0,view.width,view.height);

    drawBackground(ctx, view.width, view.height);
    drawField(ctx, active.field, ts, view.width, view.height);

    const cx = view.width * 0.5;
    const cy = view.height * 0.43;
    const scale = Math.min(view.width, view.height) * 0.12;

    const projected = active.vertices.map(v => {
      let p = rotateY(v, ts * 0.00028 + active.rot.y);
      p = rotateX(p, 0.54 + Math.sin(ts * 0.00016 + active.rot.x) * 0.34);
      p = rotateZ(p, ts * 0.0001 + active.rot.z);
      return project(p, 7, cx, cy, scale);
    });

    drawFaces(ctx, projected, active.faces);
    drawEdges(ctx, projected, active.edges);

    const rx = Math.min(view.width, view.height) * 0.24;
    const ry = rx * 0.68;

    drawLinks(ctx, active.nodes, ts, cx, cy, rx, ry);
    drawNodes(ctx, active.nodes, ts, cx, cy, rx, ry);

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
      nodes: makeOrbitNodes(seed),
      field: makeField(seed),
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

  window.RD12_SCENE = {
    start,
    stop
  };
})();
