/* TNT — /variant/scene.js
   PHASE 2 RENDER ENGINE
   FULL ATOMIC REPLACEMENT
   Adds:
   - Layer 1 cube navigator
   - Layer 2 12-face navigator
   - improved aerial dragon motion
   - preserves sky / water / compass
   Owns render only
*/

(function(){
  "use strict";

  const PAGE = document.body.dataset.page || "index";
  const canvas = document.getElementById("scene") || document.getElementById("bgCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const state = {
    tick: 0,
    layer: 1,
    spinning: true,
    selected: null,
    rotX: -16,
    rotY: 0,
    targetRotX: -16,
    targetRotY: 0,
    lang: (new URLSearchParams(location.search).get("lang") || localStorage.getItem("gd_lang") || "en")
  };

  const FACE_DEFS = {
    layer1: [
      { key:"N", code:"N", route:"/governance/", label:{en:"Governance", zh:"治理", es:"Gobernanza"}, rx:0, ry:0 },
      { key:"E", code:"E", route:"/finance/", label:{en:"Finance", zh:"金融", es:"Finanzas"}, rx:0, ry:90 },
      { key:"S", code:"S", route:"/energy/", label:{en:"Energy", zh:"能源", es:"Energía"}, rx:0, ry:180 },
      { key:"W", code:"W", route:"/medical/", label:{en:"Medical", zh:"医疗", es:"Médico"}, rx:0, ry:-90 }
    ],
    layer2: [
      { key:"N", code:"N", route:"/governance/", label:{en:"Governance", zh:"治理", es:"Gobernanza"}, rx:56, ry:0 },
      { key:"E", code:"E", route:"/finance/", label:{en:"Finance", zh:"金融", es:"Finanzas"}, rx:0, ry:90 },
      { key:"S", code:"S", route:"/energy/", label:{en:"Energy", zh:"能源", es:"Energía"}, rx:-56, ry:0 },
      { key:"W", code:"W", route:"/medical/", label:{en:"Medical", zh:"医疗", es:"Médico"}, rx:0, ry:-90 },

      { key:"NSTAR", code:"N★", route:"/verification/", label:{en:"Verification", zh:"核验", es:"Verificación"}, rx:56, ry:90 },
      { key:"ESTAR", code:"E★", route:"/software/", label:{en:"Software", zh:"软件", es:"Software"}, rx:0, ry:35 },
      { key:"SSTAR", code:"S★", route:"/education/", label:{en:"Education", zh:"教育", es:"Educación"}, rx:-56, ry:-90 },
      { key:"WSTAR", code:"W★", route:"/gauges/", label:{en:"Gauges", zh:"量规", es:"Medidores"}, rx:0, ry:-145 },

      { key:"NE", code:"NE", route:"/governance-finance/", label:{en:"Gov × Fin", zh:"治理×金融", es:"Gob × Fin"}, rx:28, ry:45 },
      { key:"NW", code:"NW", route:"/governance-medical/", label:{en:"Gov × Med", zh:"治理×医疗", es:"Gob × Med"}, rx:28, ry:-45 },
      { key:"SE", code:"SE", route:"/finance-energy/", label:{en:"Fin × Energy", zh:"金融×能源", es:"Fin × Energía"}, rx:-28, ry:135 },
      { key:"SW", code:"SW", route:"/energy-medical/", label:{en:"Energy × Med", zh:"能源×医疗", es:"Energía × Méd"}, rx:-28, ry:-135 }
    ]
  };

  let polyObject = null;
  let faceMap = new Map();

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function labelFor(face){
    return (face.label && (face.label[state.lang] || face.label.en)) || face.code || face.key;
  }

  function drawSky(w,h){
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0, "#240a0a");
    g.addColorStop(0.30, "#7a1b14");
    g.addColorStop(0.68, "#d74c22");
    g.addColorStop(1, "#1a0606");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const rg = ctx.createRadialGradient(w*0.52, h*0.34, 0, w*0.52, h*0.34, Math.max(w,h)*0.72);
    rg.addColorStop(0, "rgba(255,228,180,0.18)");
    rg.addColorStop(0.30, "rgba(255,195,120,0.07)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0,0,w,h);
  }

  function drawMoon(w,h){
    const x = w * 0.80;
    const y = h * 0.18;
    const r = Math.max(22, Math.min(w,h) * 0.034);

    const glow = ctx.createRadialGradient(x,y,0,x,y,r*2.6);
    glow.addColorStop(0, "rgba(255,245,215,.42)");
    glow.addColorStop(0.45, "rgba(255,228,170,.18)");
    glow.addColorStop(1, "rgba(255,220,170,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x,y,r*2.6,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "rgba(220,220,205,.95)";
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }

  function drawWater(w,h,t){
    const y0 = h * 0.74;

    const deep = ctx.createLinearGradient(0,y0,0,h);
    deep.addColorStop(0, "rgba(255,225,185,.06)");
    deep.addColorStop(0.50, "rgba(230,175,128,.12)");
    deep.addColorStop(1, "rgba(90,30,18,.24)");
    ctx.fillStyle = deep;
    ctx.fillRect(0,y0,w,h-y0);

    for(let row=0; row<6; row++){
      const yy = y0 + row * 18;
      ctx.beginPath();

      for(let x=0; x<=w; x+=10){
        const wave =
          Math.sin(x*0.015 + t*0.90 + row*0.45) * (5 + row*1.8) +
          Math.sin(x*0.032 + t*0.42) * 2.2;

        const y = yy + wave;
        if(x===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
      }

      ctx.strokeStyle = "rgba(255,235,210," + (0.05 + row*0.02) + ")";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  function drawCompass(w,h,t){
    const cx = w * 0.50;
    const cy = h * 0.56;
    const r = Math.min(w,h) * 0.29;

    const dome = ctx.createRadialGradient(cx, cy-r*0.30, 0, cx, cy, r*1.16);
    dome.addColorStop(0, "rgba(255,245,230,.12)");
    dome.addColorStop(0.32, "rgba(255,205,150,.07)");
    dome.addColorStop(0.76, "rgba(82,22,16,.18)");
    dome.addColorStop(1, "rgba(18,8,10,.36)");
    ctx.fillStyle = dome;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fill();

    for(let i=0;i<56;i++){
      const a = -Math.PI/2 + (i/56) * Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a)*r*0.98, cy + Math.sin(a)*r*0.98);
      ctx.strokeStyle = "rgba(255,245,230,0.06)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    for(let i=1;i<=5;i++){
      ctx.beginPath();
      ctx.arc(cx, cy, r*(i/5), 0, Math.PI*2);
      ctx.strokeStyle = "rgba(255,245,230," + (0.03 + i*0.01) + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for(let i=0;i<72;i++){
      const frac = i / 71;
      const a = frac * Math.PI*2;
      const wav = Math.sin(frac*14 - t*1.8) * 8 + Math.sin(frac*7 - t*1.1) * 4;
      const rr = r * (0.10 + frac*0.85) + wav;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, a, a + Math.PI/2.8);
      ctx.strokeStyle = "rgba(255,232,195," + (0.02 + frac*0.05) + ")";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = "rgba(255,248,235,.12)";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawCompassGlow(cx, cy, r, t);
  }

  function drawCompassGlow(cx, cy, r, t){
    for(let i=0;i<14;i++){
      const a = t*0.40 + i*(Math.PI*2/14);
      const len = r*0.55 + Math.sin(t + i)*10;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a)*len, cy + Math.sin(a)*len);
      ctx.strokeStyle = "rgba(255,225,170,0.035)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function buildDragon(dir, offsetY, phase){
    const segments = 44;
    const spacing = 18;

    const start = dir > 0 ? -window.innerWidth * 0.38 : window.innerWidth * 1.38;
    const end   = dir > 0 ?  window.innerWidth * 1.38 : -window.innerWidth * 0.38;
    const progress = (state.tick * 0.00058 + phase) % 1;

    const headX = start + (end - start) * progress;
    const baseY = window.innerHeight * 0.31 + offsetY;
    const pts = [];

    for(let i=0;i<segments;i++){
      const x = headX - dir * i * spacing;
      const y =
        baseY +
        Math.sin(progress * 8.0 + i * 0.34) * 20 +
        Math.sin(progress * 3.2 + i * 0.22) * 14 +
        Math.sin(progress * 11.0 + i * 0.14) * 4;

      const t = i / (segments - 1);
      const size = Math.max(1.2, 16 * Math.pow(1 - t, 1.45));
      pts.push({ x, y, size, t });
    }

    return pts;
  }

  function drawDragon(points, colors, dir){
    const up = [];
    const down = [];

    for(let i=0;i<points.length;i++){
      const p = points[i];
      const prev = points[Math.max(0, i-1)];
      const next = points[Math.min(points.length-1, i+1)];
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;

      up.push({ x: p.x + nx*p.size, y: p.y + ny*p.size });
      down.push({ x: p.x - nx*p.size, y: p.y - ny*p.size });
    }

    ctx.beginPath();
    ctx.moveTo(up[0].x, up[0].y);
    for(let i=1;i<up.length;i++) ctx.lineTo(up[i].x, up[i].y);
    for(let i=down.length-1;i>=0;i--) ctx.lineTo(down[i].x, down[i].y);
    ctx.closePath();

    const grad = ctx.createLinearGradient(points[0].x, points[0].y, points[points.length-1].x, points[points.length-1].y);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.55, colors[1]);
    grad.addColorStop(1, colors[2]);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,.80)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const head = points[0];
    ctx.beginPath();
    ctx.arc(head.x, head.y, head.size*0.9, 0, Math.PI*2);
    ctx.fillStyle = colors[1];
    ctx.fill();
    ctx.strokeStyle = "rgba(12,12,12,.92)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x + dir*head.size*0.40, head.y);
    ctx.lineTo(head.x + dir*head.size*1.40, head.y - head.size*0.22);
    ctx.lineTo(head.x + dir*head.size*1.12, head.y + head.size*0.20);
    ctx.closePath();
    ctx.fillStyle = colors[1];
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x - dir*head.size*0.08, head.y - head.size*0.12);
    ctx.lineTo(head.x + dir*head.size*0.58, head.y - head.size*1.02);
    ctx.lineTo(head.x + dir*head.size*0.18, head.y - head.size*1.30);
    ctx.strokeStyle = "rgba(240,220,150,.76)";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawWhiskers(head, dir);
  }

  function drawWhiskers(head, dir){
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.quadraticCurveTo(head.x + dir*18, head.y - 8, head.x + dir*34, head.y - 18);
    ctx.strokeStyle = "rgba(255,238,210,.50)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.quadraticCurveTo(head.x + dir*18, head.y + 8, head.x + dir*34, head.y + 18);
    ctx.strokeStyle = "rgba(255,238,210,.42)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  function currentFaceDefs(){
    return state.layer === 1 ? FACE_DEFS.layer1 : FACE_DEFS.layer2;
  }

  function polyMount(){
    if (PAGE !== "index") return null;
    return document.getElementById("polyObject");
  }

  function faceTransform(face){
    const z = state.layer === 1 ? 128 : 142;
    return "translate(-50%,-50%) rotateY(" + face.ry + "deg) rotateX(" + face.rx + "deg) translateZ(" + z + "px)";
  }

  function buildNavigator(){
    const mount = polyMount();
    if (!mount) return;

    polyObject = mount;
    polyObject.innerHTML = "";
    faceMap.clear();

    currentFaceDefs().forEach(function(face){
      const el = document.createElement("button");
      el.type = "button";
      el.className = "face";
      el.dataset.key = face.key;
      el.style.transform = faceTransform(face);
      el.innerHTML =
        '<div class="face-shell"></div>' +
        '<div class="face-label">' +
          '<div class="face-word"></div>' +
          '<div class="face-code">' + face.code + '</div>' +
        '</div>';

      el.querySelector(".face-word").textContent = labelFor(face);

      el.addEventListener("click", function(){
        if (state.selected === face.key){
          window.dispatchEvent(new CustomEvent("dgb:face-enter", { detail:{ face:{
            key: face.key,
            code: face.code,
            label: labelFor(face),
            route: face.route,
            layer: state.layer
          }}}));
          return;
        }

        state.selected = face.key;
        state.spinning = false;
        state.targetRotX = -face.rx;
        state.targetRotY = -face.ry;

        faceMap.forEach(function(v){
          v.el.classList.toggle("active", v.data.key === face.key);
        });

        window.dispatchEvent(new CustomEvent("dgb:face-focus", { detail:{ face:{
          key: face.key,
          code: face.code,
          label: labelFor(face),
          route: face.route,
          layer: state.layer
        }}}));
      });

      polyObject.appendChild(el);
      faceMap.set(face.key, { el: el, data: face });
    });
  }

  function updateFaceLabels(){
    faceMap.forEach(function(v){
      const word = v.el.querySelector(".face-word");
      if (word) word.textContent = labelFor(v.data);
    });
  }

  function drawLayer1Guide(){
    if (!polyObject || state.layer !== 1) return;
    const size = 250;
    const half = size / 2;
    const cx = 0;
    const cy = 0;

    const overlay = document.getElementById("cube-guide");
    if (overlay) overlay.remove();

    const guide = document.createElement("div");
    guide.id = "cube-guide";
    guide.style.position = "absolute";
    guide.style.left = "50%";
    guide.style.top = "50%";
    guide.style.width = size + "px";
    guide.style.height = size + "px";
    guide.style.marginLeft = (-half) + "px";
    guide.style.marginTop = (-half) + "px";
    guide.style.pointerEvents = "none";
    guide.style.border = "2px solid rgba(255,245,230,0.32)";
    guide.style.boxShadow = "0 0 24px rgba(255,225,170,0.10), inset 0 0 18px rgba(255,225,170,0.08)";
    guide.style.transform = "rotate(0deg)";
    guide.style.borderRadius = "8px";
    polyObject.appendChild(guide);
  }

  function stepNavigator(){
    if (!polyObject) return;

    if (state.spinning){
      state.rotY += state.layer === 1 ? 0.14 : 0.18;
      state.rotX = -16 + Math.sin(state.tick * 0.008) * 6;
      state.targetRotX = state.rotX;
      state.targetRotY = state.rotY;
    }else{
      state.rotX += (state.targetRotX - state.rotX) * 0.10;
      state.rotY += (state.targetRotY - state.rotY) * 0.10;
    }

    polyObject.style.transform = "rotateX(" + state.rotX + "deg) rotateY(" + state.rotY + "deg)";
    drawLayer1Guide();
  }

  function setLayer(n){
    const next = Number(n) === 2 ? 2 : 1;
    if (next === state.layer) return;
    state.layer = next;
    state.selected = null;
    state.spinning = true;
    buildNavigator();
  }

  function resume(){
    state.selected = null;
    state.spinning = true;
    faceMap.forEach(function(v){
      v.el.classList.remove("active");
    });
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

    const wise = buildDragon(1, -28, 0.00);
    const fear = buildDragon(-1, 42, 0.23);

    drawDragon(wise, ["rgba(55,160,90,.95)", "rgba(26,122,54,.98)", "rgba(12,70,30,.98)"], 1);
    drawDragon(fear, ["rgba(178,32,30,.96)", "rgba(142,10,12,.98)", "rgba(84,8,10,.98)"], -1);

    stepNavigator();
    requestAnimationFrame(frame);
  }

  window.__DGB_RENDER__ = {
    setLayer: setLayer,
    resume: resume
  };

  window.navigatorLayer = function(n){
    setLayer(n);
  };

  window.addEventListener("resize", resize);

  window.addEventListener("dgb:update-face-labels", function(e){
    state.lang = (e.detail && e.detail.lang) || state.lang;
    updateFaceLabels();

    if (state.selected && faceMap.has(state.selected)){
      const face = faceMap.get(state.selected).data;
      window.dispatchEvent(new CustomEvent("dgb:face-focus", { detail:{ face:{
        key: face.key,
        code: face.code,
        label: labelFor(face),
        route: face.route,
        layer: state.layer
      }}}));
    }
  });

  resize();
  buildNavigator();
  frame();

})();
