(function(){
  "use strict";

  const PAGE = document.body.getAttribute("data-page") || "index";
  const canvas = document.getElementById("scene");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const STATE = {
    tick: 0,
    layer: 1,
    lane: "platform",
    lang: "en"
  };

  const ROUTES = {
    door: "/door/",
    home: "/home/",
    index: "/index.html",
    products: "/products/",
    explore: "/explore/",
    laws: "/laws/",
    gauges: "/gauges/",
    governance: "/governance/",
    finance: "/finance/",
    energy: "/energy/",
    medical: "/medical/",
    verification: "/verification/",
    software: "/software/",
    education: "/education/",
    govfin: "/governance-finance/",
    govmed: "/governance-medical/",
    finenergy: "/finance-energy/",
    energymed: "/energy-medical/"
  };

  const INDEX_LABELS = {
    platform: {
      core: "Core",
      N: "Governance",
      E: "Finance",
      S: "Energy",
      W: "Medical",
      Ns: "Verification",
      Es: "Software",
      Ss: "Education",
      Ws: "Gauges",
      NE: "Gov × Fin",
      NW: "Gov × Med",
      SE: "Fin × Energy",
      SW: "Energy × Med"
    },
    engineering: {
      core: "Core Index",
      N: "Laws",
      E: "Finance",
      S: "Energy",
      W: "Medical",
      Ns: "Verify",
      Es: "Software",
      Ss: "Education",
      Ws: "Gauges",
      NE: "Route NE",
      NW: "Route NW",
      SE: "Route SE",
      SW: "Route SW"
    }
  };

  const HOME_COPY = {
    en: {
      kicker: "Home",
      title: "Where do you want to go next?",
      tag: "Home is the fast lane. It does not teach taxonomy. It routes you to the next surface with one clean choice.",
      rule: "Rule: open one block, read one paragraph, then jump. If you want the big table first, go to Door.",
      band: "Surfaces (open one)",
      cards: [
        {
          q: "Start at the big table?",
          s: "Door is the intro hub: it tells you what this is and where to enter.",
          p: "Use Door when you want the intro posture: what the system is, what it refuses to claim, and how to enter without getting lost.",
          label: "Open: Door",
          href: ROUTES.door
        },
        {
          q: "Need direction right now?",
          s: "Compass is fast traversal: pick a direction and go.",
          p: "Use Compass when you want to traverse without reading: it is designed for movement, not explanation.",
          label: "Open: Compass",
          href: ROUTES.index
        },
        {
          q: "Want deployable things?",
          s: "Products is the catalog: signatures, streams, and jumps.",
          p: "Use Products when you want what can be used and direct entry to product pages.",
          label: "Open: Products",
          href: ROUTES.products
        },
        {
          q: "Want boundaries before belief?",
          s: "Laws is doctrine: definitions, invariants, and bounds.",
          p: "Use Laws when you want the system constraints and what is allowed to be claimed.",
          label: "Open: Laws",
          href: ROUTES.laws
        },
        {
          q: "Want signals, not speeches?",
          s: "Gauges is measurement only.",
          p: "Use Gauges when you want numbers, deltas, and trend direction. Take the result to Laws if you need a boundary.",
          label: "Open: Gauges",
          href: ROUTES.gauges
        },
        {
          q: "Want frontier ideas safely labeled?",
          s: "Explore is organized shells: ambition with prerequisites.",
          p: "Use Explore when you want direction with controlled claims.",
          label: "Open: Explore",
          href: ROUTES.explore
        }
      ]
    },
    zh: {
      kicker: "主页",
      title: "你下一步想去哪？",
      tag: "主页是快车道：不教分类，只把你路由到下一入口（一次只做一个选择）。",
      rule: "规则：打开一个块，读一段，然后跳转。想先看总桌面就去 Door。",
      band: "入口（打开一个）",
      cards: [
        {
          q: "从总桌面开始？",
          s: "Door 是入门枢纽：告诉你这是什么、怎么进入。",
          p: "想要入门姿态就用 Door：系统是什么、拒绝什么主张、如何不迷路进入。",
          label: "打开：Door",
          href: ROUTES.door
        },
        {
          q: "现在就要方向？",
          s: "Compass 是快速遍历：选方向就走。",
          p: "想直接走就用 Compass：它为移动而生，不是为解释。",
          label: "打开：Compass",
          href: ROUTES.index
        },
        {
          q: "想看可落地的东西？",
          s: "Products 是目录：签名系统、部署流、跳转。",
          p: "想要我能用什么与直接进入页面，就用 Products。",
          label: "打开：Products",
          href: ROUTES.products
        },
        {
          q: "先看边界再相信？",
          s: "Laws 是教义：定义、不变量、边界。",
          p: "想看系统约束与允许主张范围，就用 Laws。",
          label: "打开：Laws",
          href: ROUTES.laws
        },
        {
          q: "想看信号而不是讲话？",
          s: "Gauges 只做测量。",
          p: "想要数字、差分与趋势方向就用 Gauges；需要边界就把结果带去 Laws。",
          label: "打开：Gauges",
          href: ROUTES.gauges
        },
        {
          q: "想看前沿但要标注就绪度？",
          s: "Explore 是有序壳：雄心加前置条件。",
          p: "想要方向但不夸口就用 Explore。",
          label: "打开：Explore",
          href: ROUTES.explore
        }
      ]
    },
    es: {
      kicker: "Inicio",
      title: "¿A dónde quieres ir ahora?",
      tag: "Home es el carril rápido: no enseña taxonomía. Te enruta con una sola elección limpia.",
      rule: "Regla: abre un bloque, lee un párrafo y salta. Si quieres la mesa grande primero, ve a Door.",
      band: "Superficies (abre una)",
      cards: [
        {
          q: "¿Empezar por la mesa grande?",
          s: "Door es el hub de intro: qué es y cómo entrar.",
          p: "Usa Door para postura de inicio: qué es, qué no afirma y cómo entrar sin perderte.",
          label: "Abrir: Door",
          href: ROUTES.door
        },
        {
          q: "¿Necesitas dirección ya?",
          s: "Compass es recorrido rápido: eliges dirección y vas.",
          p: "Usa Compass para moverte sin leer: está hecha para movimiento, no explicación.",
          label: "Abrir: Compass",
          href: ROUTES.index
        },
        {
          q: "¿Quieres cosas desplegables?",
          s: "Products es catálogo: firmas, streams y saltos.",
          p: "Usa Products para qué puedo usar y acceso directo.",
          label: "Abrir: Products",
          href: ROUTES.products
        },
        {
          q: "¿Límites antes de creer?",
          s: "Laws es doctrina: definiciones, invariantes y límites.",
          p: "Usa Laws para restricciones y qué se permite afirmar.",
          label: "Abrir: Laws",
          href: ROUTES.laws
        },
        {
          q: "¿Señales, no discursos?",
          s: "Gauges es medición solamente.",
          p: "Usa Gauges para números, deltas y tendencia.",
          label: "Abrir: Gauges",
          href: ROUTES.gauges
        },
        {
          q: "¿Ideas frontera con postura clara?",
          s: "Explore es caparazón organizado: ambición con prerrequisitos.",
          p: "Usa Explore para dirección sin sobreprometer.",
          label: "Abrir: Explore",
          href: ROUTES.explore
        }
      ]
    }
  };

  function resize(){
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function routeWithState(path){
    const params = new URLSearchParams();
    params.set("lang", STATE.lang);
    return path + "?" + params.toString();
  }

  function applyHomeCopy(){
    if (PAGE !== "home") return;
    const pack = HOME_COPY[STATE.lang] || HOME_COPY.en;

    document.getElementById("homeKicker").textContent = pack.kicker;
    document.getElementById("homeTitle").textContent = pack.title;
    document.getElementById("homeTag").textContent = pack.tag;
    document.getElementById("homeRule").textContent = pack.rule;
    document.getElementById("bandLabel").textContent = pack.band;

    const stack = document.getElementById("stack");
    stack.innerHTML = "";

    pack.cards.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = [
        '<button class="cardHead" type="button" aria-expanded="', idx === 0 ? 'true' : 'false', '">',
        '<span class="cardMark"></span>',
        '<span class="cardText">',
        '<span class="cardQ">', item.q, '</span>',
        '<span class="cardS">', item.s, '</span>',
        '</span>',
        '<span class="cardChev">▸</span>',
        '</button>',
        '<div class="cardBody', idx === 0 ? ' open' : '', '">',
        '<p>', item.p, '</p>',
        '<div class="cardActions"><a class="dockBtn actionBtn" href="', routeWithState(item.href), '">', item.label, '</a></div>',
        '</div>'
      ].join("");

      const head = card.querySelector(".cardHead");
      const body = card.querySelector(".cardBody");
      const chev = card.querySelector(".cardChev");

      function toggleCard(){
        const open = body.classList.contains("open");
        stack.querySelectorAll(".cardBody").forEach(el => el.classList.remove("open"));
        stack.querySelectorAll(".cardHead").forEach(el => el.setAttribute("aria-expanded", "false"));
        stack.querySelectorAll(".cardChev").forEach(el => { el.textContent = "▸"; });

        if (!open){
          body.classList.add("open");
          head.setAttribute("aria-expanded", "true");
          chev.textContent = "▾";
        }
      }

      head.addEventListener("click", toggleCard);
      stack.appendChild(card);

      if (idx === 0) chev.textContent = "▾";
    });

    document.getElementById("dockCompass").href = routeWithState(ROUTES.index);
    document.getElementById("dockProducts").href = routeWithState(ROUTES.products);
    document.getElementById("dockExplore").href = routeWithState(ROUTES.explore);
    document.getElementById("dockLaws").href = routeWithState(ROUTES.laws);
    document.getElementById("dockGauges").href = routeWithState(ROUTES.gauges);
  }

  function setIndexButtons(){
    if (PAGE !== "index") return;

    document.getElementById("btnLayer1").classList.toggle("on", STATE.layer === 1);
    document.getElementById("btnLayer2").classList.toggle("on", STATE.layer === 2);
    document.getElementById("btnLayer1").setAttribute("aria-pressed", String(STATE.layer === 1));
    document.getElementById("btnLayer2").setAttribute("aria-pressed", String(STATE.layer === 2));

    document.getElementById("btnPlatform").classList.toggle("on", STATE.lane === "platform");
    document.getElementById("btnEngineering").classList.toggle("on", STATE.lane === "engineering");
    document.getElementById("btnPlatform").setAttribute("aria-pressed", String(STATE.lane === "platform"));
    document.getElementById("btnEngineering").setAttribute("aria-pressed", String(STATE.lane === "engineering"));
  }

  function perspective(x, y, z){
    const camera = 560;
    return {
      x,
      y,
      scale: camera / (camera + z)
    };
  }

  function currentIndexLabels(){
    return INDEX_LABELS[STATE.lane] || INDEX_LABELS.platform;
  }

  function indexGemSpecs(){
    const L = currentIndexLabels();

    if (STATE.layer === 1){
      return [
        { code:"N", word:L.N, href:ROUTES.governance, x:0, y:-162, z:84, band:"front" },
        { code:"E", word:L.E, href:ROUTES.finance, x:182, y:-10, z:118, band:"mid" },
        { code:"S", word:L.S, href:ROUTES.energy, x:0, y:168, z:150, band:"back" },
        { code:"W", word:L.W, href:ROUTES.medical, x:-182, y:-10, z:118, band:"mid" },
        { code:"CORE", word:L.core, href:ROUTES.index, x:0, y:0, z:-70, band:"core" }
      ];
    }

    return [
      { code:"N★", word:L.Ns, href:ROUTES.verification, x:0, y:-214, z:116, band:"mid" },
      { code:"E★", word:L.Es, href:ROUTES.software, x:220, y:0, z:162, band:"back" },
      { code:"S★", word:L.Ss, href:ROUTES.education, x:0, y:214, z:194, band:"back" },
      { code:"W★", word:L.Ws, href:ROUTES.gauges, x:-220, y:0, z:162, band:"back" },
      { code:"NE", word:L.NE, href:ROUTES.govfin, x:154, y:-154, z:138, band:"mid" },
      { code:"NW", word:L.NW, href:ROUTES.govmed, x:-154, y:-154, z:138, band:"mid" },
      { code:"SE", word:L.SE, href:ROUTES.finenergy, x:154, y:154, z:176, band:"back" },
      { code:"SW", word:L.SW, href:ROUTES.energymed, x:-154, y:154, z:176, band:"back" },
      { code:"CORE", word:L.core, href:ROUTES.index, x:0, y:0, z:-70, band:"core" }
    ];
  }

  function renderIndexGems(){
    if (PAGE !== "index") return;
    const layer = document.getElementById("gemLayer");
    const rect = stage.getBoundingClientRect();
    const cx = rect.width * 0.5;
    const cy = rect.height * 0.54;

    layer.innerHTML = "";

    indexGemSpecs().forEach(spec => {
      const p = perspective(cx + spec.x, cy + spec.y, spec.z);
      const el = document.createElement("button");
      el.type = "button";
      el.className = "gem " + spec.band;
      el.style.left = p.x + "px";
      el.style.top = p.y + "px";
      el.style.transform = "translate(-50%,-50%) rotate(45deg) scale(" + p.scale.toFixed(4) + ")";
      el.setAttribute("aria-label", spec.word);

      el.innerHTML = [
        '<div class="gemInner">',
        '<div class="gWord">', spec.word, '</div>',
        '<div class="gCode">', spec.code, '</div>',
        '</div>'
      ].join("");

      el.addEventListener("click", function(){
        window.location.href = routeWithState(spec.href);
      });

      layer.appendChild(el);
    });
  }

  function drawSky(w,h){
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#260b0b");
    g.addColorStop(0.30, "#7d1d15");
    g.addColorStop(0.68, "#d34e24");
    g.addColorStop(1, "#41130e");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    const rg = ctx.createRadialGradient(w*0.50, h*0.34, 0, w*0.50, h*0.34, Math.max(w,h)*0.72);
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

  function dragonProgress(speed, offset){
    return (STATE.tick * speed + offset) % 1;
  }

  function dragonBody(dir, offsetY, speed, offsetX){
    const w = window.innerWidth;
    const h = window.innerHeight;
    const progress = dragonProgress(speed, offsetX);

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
        + Math.sin((progress*6.0 + i*0.13 + STATE.tick*0.028) * Math.PI) * 24
        + Math.sin((progress*14.0 + i*0.22 + STATE.tick*0.013) * Math.PI) * 8;

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

    for(let i=3;i<pts.length-2;i+=3){
      const p = pts[i];
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.size*0.65);
      ctx.lineTo(p.x + dir*8, p.y - p.size*1.15);
      ctx.strokeStyle = "rgba(235,199,120,.46)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

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

    ctx.beginPath();
    ctx.moveTo(head.x - dir*head.size*0.04, head.y - head.size*0.05);
    ctx.lineTo(head.x + dir*head.size*1.10, head.y - head.size*0.10);
    ctx.strokeStyle = "rgba(255,238,210,.55)";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(head.x - dir*head.size*0.04, head.y + head.size*0.04);
    ctx.lineTo(head.x + dir*head.size*1.12, head.y + head.size*0.52);
    ctx.strokeStyle = "rgba(255,238,210,.42)";
    ctx.lineWidth = 1.2;
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

    const wise = dragonBody(1, -28, 0.00062, 0.00);
    const fear = dragonBody(-1, 44, 0.00062, 0.22);

    drawDragon(wise, [
      "rgba(70,150,105,.18)",
      "rgba(28,110,64,.24)",
      "rgba(14,52,30,.20)"
    ], 1);

    drawDragon(fear, [
      "rgba(150,40,32,.18)",
      "rgba(110,10,12,.24)",
      "rgba(52,8,10,.20)"
    ], -1);

    ctx.restore();
  }

  function bindIndexEvents(){
    if (PAGE !== "index") return;

    document.getElementById("btnLayer1").addEventListener("click", function(){
      STATE.layer = 1;
      setIndexButtons();
      renderIndexGems();
    });

    document.getElementById("btnLayer2").addEventListener("click", function(){
      STATE.layer = 2;
      setIndexButtons();
      renderIndexGems();
    });

    document.getElementById("btnPlatform").addEventListener("click", function(){
      STATE.lane = "platform";
      setIndexButtons();
      renderIndexGems();
    });

    document.getElementById("btnEngineering").addEventListener("click", function(){
      STATE.lane = "engineering";
      setIndexButtons();
      renderIndexGems();
    });

    document.getElementById("btnDoor").addEventListener("click", function(){
      window.location.href = routeWithState(ROUTES.door);
    });

    document.getElementById("btnHome").addEventListener("click", function(){
      window.location.href = routeWithState(ROUTES.home);
    });
  }

  function bindHomeEvents(){
    if (PAGE !== "home") return;

    document.getElementById("btnEN").addEventListener("click", function(){
      STATE.lang = "en";
      updateHomeLangButtons();
      applyHomeCopy();
    });

    document.getElementById("btnZH").addEventListener("click", function(){
      STATE.lang = "zh";
      updateHomeLangButtons();
      applyHomeCopy();
    });

    document.getElementById("btnES").addEventListener("click", function(){
      STATE.lang = "es";
      updateHomeLangButtons();
      applyHomeCopy();
    });
  }

  function updateHomeLangButtons(){
    if (PAGE !== "home") return;
    document.getElementById("btnEN").classList.toggle("on", STATE.lang === "en");
    document.getElementById("btnZH").classList.toggle("on", STATE.lang === "zh");
    document.getElementById("btnES").classList.toggle("on", STATE.lang === "es");
  }

  function frame(){
    STATE.tick += 1;

    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0,0,w,h);
    drawSky(w,h);
    drawMoon(w,h);
    drawWater(w,h, STATE.tick * 0.012);
    drawCompass(w,h, STATE.tick * 0.012);

    const wise = dragonBody(1, -28, 0.00062, 0.00);
    const fear = dragonBody(-1, 44, 0.00062, 0.22);

    drawDragon(wise, [
      "rgba(55,160,90,.95)",
      "rgba(26,122,54,.98)",
      "rgba(12,70,30,.98)"
    ], 1);

    drawDragon(fear, [
      "rgba(178,32,30,.96)",
      "rgba(142,10,12,.98)",
      "rgba(84,8,10,.98)"
    ], -1);

    drawReflections();

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", function(){
    resize();
    if (PAGE === "index") renderIndexGems();
  });

  resize();
  bindIndexEvents();
  bindHomeEvents();
  setIndexButtons();
  updateHomeLangButtons();
  renderIndexGems();
  applyHomeCopy();
  frame();
})();
