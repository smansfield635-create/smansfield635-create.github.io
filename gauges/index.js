(function () {
  "use strict";

  var VERSION = "GAUGES_INDEX_JS_PHYSICS_UNIVERSE_RUNTIME_G1_CELESTIAL_DETAIL_v3";

  var DAY_MS = 86400000;
  var LABEL_MIN_GAP = 18;

  var ZOOM_STATES = {
    earth: {
      label: "Earth emphasis · detailed body layer · compressed solar projection",
      orbitMin: 148,
      orbitMax: 430,
      sunPx: 360,
      sceneScale: 1.16,
      showOuterLabels: false,
      showMinorBodies: false
    },
    solar: {
      label: "Solar view · left-edge Sun · detailed celestial bodies",
      orbitMin: 124,
      orbitMax: 520,
      sunPx: 430,
      sceneScale: 1,
      showOuterLabels: true,
      showMinorBodies: false
    },
    system: {
      label: "System view · wide solar sweep · detailed planetary order",
      orbitMin: 92,
      orbitMax: 610,
      sunPx: 390,
      sceneScale: 0.86,
      showOuterLabels: true,
      showMinorBodies: true
    },
    universe: {
      label: "Universe view · larger field · same physics relation",
      orbitMin: 72,
      orbitMax: 680,
      sunPx: 350,
      sceneScale: 0.76,
      showOuterLabels: true,
      showMinorBodies: true
    }
  };

  var BODIES = [
    { key: "sun", name: "Sun", type: "star", radiusKm: 696340, distanceAU: 0, orbitalDays: 0, rotationDays: 27, axialTiltDeg: 7.25, className: "sun" },
    { key: "mercury", name: "Mercury", type: "terrestrial", radiusKm: 2439.7, distanceAU: 0.387, orbitalDays: 87.969, rotationDays: 58.646, axialTiltDeg: 0.03, className: "mercury", phaseOffset: 0.02 },
    { key: "venus", name: "Venus", type: "terrestrial", radiusKm: 6051.8, distanceAU: 0.723, orbitalDays: 224.701, rotationDays: -243.025, axialTiltDeg: 177.36, className: "venus", phaseOffset: 0.18 },
    { key: "earth", name: "Earth", type: "terrestrial", radiusKm: 6371, distanceAU: 1, orbitalDays: 365.256, rotationDays: 0.997, axialTiltDeg: 23.44, className: "earth", phaseOffset: 0.37, moon: { name: "Moon", radiusKm: 1737.4, distanceKm: 384400, orbitalDays: 27.3217 } },
    { key: "mars", name: "Mars", type: "terrestrial", radiusKm: 3389.5, distanceAU: 1.524, orbitalDays: 686.98, rotationDays: 1.026, axialTiltDeg: 25.19, className: "mars", phaseOffset: 0.53 },
    { key: "jupiter", name: "Jupiter", type: "gas-giant", radiusKm: 69911, distanceAU: 5.203, orbitalDays: 4332.59, rotationDays: 0.414, axialTiltDeg: 3.13, className: "jupiter", phaseOffset: 0.68 },
    { key: "saturn", name: "Saturn", type: "gas-giant", radiusKm: 58232, distanceAU: 9.537, orbitalDays: 10759.22, rotationDays: 0.444, axialTiltDeg: 26.73, className: "saturn", phaseOffset: 0.75, rings: true },
    { key: "uranus", name: "Uranus", type: "ice-giant", radiusKm: 25362, distanceAU: 19.191, orbitalDays: 30688.5, rotationDays: -0.718, axialTiltDeg: 97.77, className: "uranus", phaseOffset: 0.84 },
    { key: "neptune", name: "Neptune", type: "ice-giant", radiusKm: 24622, distanceAU: 30.07, orbitalDays: 60182, rotationDays: 0.671, axialTiltDeg: 28.32, className: "neptune", phaseOffset: 0.92 }
  ];

  var ASTEROID_BELT = {
    key: "asteroid-belt",
    name: "Asteroid Belt",
    innerAU: 2.06,
    outerAU: 3.27
  };

  var state = {
    zoom: "solar",
    selectedKey: "sun",
    paused: false,
    lastRender: 0
  };

  var scene = null;
  var caption = null;
  var controls = null;
  var info = null;
  var timer = null;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function injectStyles() {
    var oldStyles = [
      "gauges-index-js-universe-runtime-style",
      "gauges-index-js-cinematic-solar-runtime-style",
      "gauges-index-js-celestial-detail-runtime-style"
    ];

    oldStyles.forEach(function (id) {
      var old = document.getElementById(id);
      if (old) old.remove();
    });

    var style = document.createElement("style");
    style.id = "gauges-index-js-celestial-detail-runtime-style";
    style.textContent = [
      ".universe-panel{position:relative;isolation:isolate;overflow:hidden;background:radial-gradient(circle at 0% 42%,rgba(255,118,25,.20),transparent 28%),radial-gradient(circle at 72% 38%,rgba(142,197,255,.11),transparent 34%),linear-gradient(180deg,rgba(3,8,19,.98),rgba(1,4,12,.99))!important;}",
      ".universe-panel:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.52;background:radial-gradient(circle at 13% 26%,rgba(255,255,255,.72) 0 1px,transparent 1.5px),radial-gradient(circle at 78% 18%,rgba(255,255,255,.56) 0 1px,transparent 1.5px),radial-gradient(circle at 86% 76%,rgba(255,255,255,.46) 0 1px,transparent 1.5px),radial-gradient(circle at 32% 82%,rgba(255,255,255,.54) 0 1px,transparent 1.5px),radial-gradient(circle at 52% 36%,rgba(255,255,255,.42) 0 1px,transparent 1.5px);background-size:280px 280px,330px 330px,310px 310px,360px 360px,300px 300px;z-index:0;}",
      ".universe-panel:after{content:'';position:absolute;left:-22%;top:-12%;width:70%;height:120%;pointer-events:none;background:radial-gradient(ellipse at 0% 50%,rgba(255,95,18,.34),transparent 56%),linear-gradient(90deg,rgba(255,88,18,.18),transparent 64%);filter:blur(8px);z-index:1;}",
      ".universe-scene{position:relative;width:min(96vw,880px);aspect-ratio:1.62/1;border-radius:28px;isolation:isolate;overflow:visible;z-index:2;transform-origin:24% 50%;transition:transform 520ms ease;}",
      ".universe-scene[data-zoom='earth']{transform:scale(1.16);}",
      ".universe-scene[data-zoom='solar']{transform:scale(1);}",
      ".universe-scene[data-zoom='system']{transform:scale(.86);}",
      ".universe-scene[data-zoom='universe']{transform:scale(.76);}",
      ".orbit{position:absolute;left:var(--sun-x,7%);top:var(--sun-y,50%);border-radius:50%;border:2px solid rgba(220,232,255,.24);transform:translate(-50%,-50%) rotate(-13deg);pointer-events:none;box-shadow:0 0 10px rgba(142,197,255,.055),inset 0 0 24px rgba(142,197,255,.035);}",
      ".orbit.is-selected{border-color:rgba(239,210,154,.62);box-shadow:0 0 22px rgba(239,210,154,.18),inset 0 0 22px rgba(239,210,154,.08);}",
      ".orbit-belt{position:absolute;left:var(--sun-x,7%);top:var(--sun-y,50%);border-radius:50%;transform:translate(-50%,-50%) rotate(-13deg);pointer-events:none;border:1px dashed rgba(170,198,255,.20);box-shadow:inset 0 0 24px rgba(170,198,255,.055),0 0 18px rgba(170,198,255,.04);}",
      ".body{position:absolute;border-radius:50%;transform:translate(-50%,-50%);isolation:isolate;overflow:hidden;cursor:pointer;border:1px solid rgba(255,255,255,.18);transition:transform 260ms ease,filter 260ms ease,box-shadow 260ms ease;}",
      ".body:focus-visible{outline:2px solid rgba(239,210,154,.7);outline-offset:4px;}",
      ".body:hover{transform:translate(-50%,-50%) scale(1.08);filter:brightness(1.14);}",
      ".body.is-selected{box-shadow:0 0 0 2px rgba(239,210,154,.62),0 0 24px rgba(239,210,154,.32)!important;}",

      ".body.sun{overflow:visible;background:radial-gradient(circle at 62% 36%,#fffbd2 0 5%,#ffe98c 10%,#ffc33c 27%,#fa7b17 55%,#9d2108 100%);box-shadow:0 0 30px rgba(255,231,132,.96),0 0 92px rgba(255,112,24,.76),0 0 190px rgba(255,64,14,.42);z-index:8;animation:sunPulse 5.8s ease-in-out infinite;}",
      ".body.sun:before{content:'';position:absolute;inset:-26%;border-radius:50%;background:radial-gradient(circle at 58% 50%,rgba(255,235,140,.42),transparent 50%),radial-gradient(circle at 52% 50%,rgba(255,120,32,.30),transparent 68%);z-index:-1;filter:blur(9px);}",
      ".body.sun:after{content:'';position:absolute;inset:0;border-radius:50%;background:repeating-radial-gradient(circle at 48% 48%,rgba(255,255,255,.10) 0 2px,transparent 2px 11px),radial-gradient(circle at 38% 36%,rgba(255,255,255,.24),transparent 10%),linear-gradient(90deg,rgba(255,255,255,.20),transparent 30%,rgba(0,0,0,.18));mix-blend-mode:screen;opacity:.52;pointer-events:none;}",

      ".body.planet{background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.24),transparent 18%),radial-gradient(circle at 34% 30%,var(--body-hi,#8ec5ff),var(--body-mid,#0b4b8c) 48%,var(--body-low,#031236) 72%,rgba(0,0,0,1) 100%);box-shadow:inset -10px -4px 18px rgba(0,0,0,.64),inset 7px 5px 16px rgba(255,255,255,.14),0 0 24px var(--body-glow,rgba(142,197,255,.22));z-index:10;}",
      ".body.planet:before{content:'';position:absolute;inset:-2%;border-radius:50%;pointer-events:none;z-index:2;opacity:.84;background:var(--surface-detail,radial-gradient(circle at 50% 50%,transparent,transparent));mix-blend-mode:normal;}",
      ".body.planet:after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 24%,rgba(255,255,255,.20),transparent 16%),linear-gradient(110deg,rgba(255,255,255,.09),transparent 34%,rgba(0,0,0,.50) 76%,rgba(0,0,0,.80));pointer-events:none;z-index:5;}",

      ".body.mercury{--body-hi:#d6c6a9;--body-mid:#8c826f;--body-low:#2d2a25;--body-glow:rgba(220,210,188,.18);--surface-detail:radial-gradient(circle at 32% 38%,rgba(0,0,0,.32) 0 8%,transparent 9%),radial-gradient(circle at 62% 55%,rgba(255,255,255,.10) 0 6%,transparent 7%),radial-gradient(circle at 48% 72%,rgba(0,0,0,.22) 0 5%,transparent 6%);}",
      ".body.venus{--body-hi:#ffe4a3;--body-mid:#c88435;--body-low:#42210d;--body-glow:rgba(239,210,154,.22);--surface-detail:linear-gradient(18deg,rgba(255,255,255,.18),transparent 18%,rgba(150,72,24,.22) 36%,transparent 54%,rgba(255,230,160,.14) 72%,transparent),radial-gradient(circle at 38% 42%,rgba(255,255,255,.12),transparent 34%);}",
      ".body.earth{--body-hi:#d9fbff;--body-mid:#187bc2;--body-low:#041738;--body-glow:rgba(142,197,255,.42);--surface-detail:radial-gradient(ellipse at 34% 52%,rgba(52,130,58,.78) 0 12%,transparent 13%),radial-gradient(ellipse at 62% 34%,rgba(58,150,72,.58) 0 10%,transparent 11%),radial-gradient(ellipse at 48% 72%,rgba(184,141,70,.46) 0 8%,transparent 9%),radial-gradient(ellipse at 52% 45%,rgba(255,255,255,.60) 0 6%,transparent 7%),radial-gradient(ellipse at 42% 30%,rgba(255,255,255,.42) 0 5%,transparent 6%),linear-gradient(20deg,transparent 0 38%,rgba(255,255,255,.20) 42%,transparent 50%);}",
      ".body.mars{--body-hi:#ffb083;--body-mid:#b94b28;--body-low:#36120d;--body-glow:rgba(255,98,98,.22);--surface-detail:radial-gradient(ellipse at 38% 42%,rgba(91,35,22,.36) 0 12%,transparent 13%),radial-gradient(ellipse at 58% 62%,rgba(255,210,150,.14) 0 9%,transparent 10%),linear-gradient(160deg,transparent,rgba(85,22,16,.26),transparent);}",
      ".body.jupiter{--body-hi:#fff0c8;--body-mid:#b88758;--body-low:#422819;--body-glow:rgba(239,210,154,.30);--surface-detail:repeating-linear-gradient(0deg,rgba(255,245,210,.34) 0 9%,rgba(158,92,48,.36) 9% 18%,rgba(238,204,158,.28) 18% 27%,rgba(86,45,28,.28) 27% 36%),radial-gradient(ellipse at 70% 58%,rgba(170,68,40,.54) 0 9%,transparent 10%);}",
      ".body.jupiter:before{opacity:.92;}",
      ".body.saturn{--body-hi:#fff0bd;--body-mid:#b99b61;--body-low:#3c2f1a;--body-glow:rgba(239,210,154,.28);--surface-detail:repeating-linear-gradient(0deg,rgba(255,244,194,.28) 0 12%,rgba(153,120,70,.24) 12% 24%,rgba(235,210,150,.20) 24% 36%);}",
      ".body.uranus{--body-hi:#d6ffff;--body-mid:#62b8c5;--body-low:#103848;--body-glow:rgba(142,197,255,.26);--surface-detail:linear-gradient(140deg,rgba(255,255,255,.14),transparent 38%,rgba(0,80,100,.20)),radial-gradient(circle at 36% 32%,rgba(255,255,255,.15),transparent 26%);}",
      ".body.neptune{--body-hi:#b7ceff;--body-mid:#3b5fd0;--body-low:#101a4c;--body-glow:rgba(142,197,255,.24);--surface-detail:linear-gradient(150deg,rgba(255,255,255,.13),transparent 32%,rgba(0,20,90,.28)),radial-gradient(ellipse at 60% 58%,rgba(10,20,80,.40) 0 12%,transparent 13%);}",

      ".ring-system{position:absolute;left:50%;top:50%;width:230%;height:78%;border:2px solid rgba(239,210,154,.48);border-left-color:rgba(239,210,154,.20);border-right-color:rgba(239,210,154,.20);border-radius:50%;transform:translate(-50%,-50%) rotate(-18deg);pointer-events:none;z-index:3;box-shadow:0 0 14px rgba(239,210,154,.20),inset 0 0 12px rgba(255,255,255,.10);overflow:hidden;}",
      ".ring-system:after{content:'';position:absolute;inset:18%;border-radius:50%;border:1px solid rgba(239,210,154,.28);}",
      ".moon{position:absolute;border-radius:50%;background:radial-gradient(circle at 34% 28%,#fff,#aeb8c8 42%,#394354 100%);box-shadow:inset -3px -2px 5px rgba(0,0,0,.55),0 0 8px rgba(210,232,255,.26);z-index:12;pointer-events:none;}",
      ".body-label{position:absolute;transform:translate(-50%,-50%);color:rgba(232,240,255,.95);font-size:.70rem;font-weight:950;letter-spacing:.08em;text-transform:uppercase;pointer-events:none;text-shadow:0 1px 0 rgba(0,0,0,.9),0 0 12px rgba(0,0,0,.9);z-index:20;white-space:nowrap;}",
      ".physics-info{position:relative;z-index:3;width:min(760px,94%);display:grid;gap:8px;border:1px solid rgba(170,198,255,.14);border-radius:18px;padding:12px 14px;background:rgba(255,255,255,.025);}",
      ".physics-info strong{color:#fff;font-size:.9rem;}",
      ".physics-info span{color:#aab8d8;line-height:1.45;font-size:.84rem;}",
      ".control-row{position:relative;z-index:3;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;width:min(760px,94%);}",
      ".control-row button{appearance:none;border:1px solid rgba(170,198,255,.18);border-radius:999px;padding:9px 12px;color:#dce8ff;background:rgba(255,255,255,.035);font-weight:900;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;}",
      ".control-row button[aria-pressed='true']{color:#fff8ea;border-color:rgba(239,210,154,.46);background:radial-gradient(circle at 50% 120%,rgba(239,210,154,.22),transparent 62%),rgba(239,210,154,.08);}",
      ".runtime-pause{border-color:rgba(147,239,189,.36)!important;}",
      ".scene-caption{position:relative;z-index:3;width:min(760px,94%);text-align:center;color:#dce8ff;font-weight:850;font-size:.86rem;letter-spacing:.10em;text-transform:uppercase;opacity:.86;}",
      ".cinematic-lens{position:absolute;inset:0;pointer-events:none;z-index:4;background:radial-gradient(circle at 20% 36%,rgba(255,255,255,.12),transparent 6%),radial-gradient(circle at 42% 66%,rgba(142,197,255,.12),transparent 8%),radial-gradient(circle at 70% 20%,rgba(142,197,255,.10),transparent 10%),linear-gradient(90deg,rgba(255,85,18,.08),transparent 42%,rgba(142,197,255,.04));mix-blend-mode:screen;opacity:.72;}",
      "@keyframes sunPulse{0%,100%{filter:brightness(1);transform:translate(-50%,-50%) scale(1)}50%{filter:brightness(1.12);transform:translate(-50%,-50%) scale(1.025)}}",
      "@media(max-width:640px){.universe-scene{width:min(100vw,760px);aspect-ratio:1.16/1;transform-origin:10% 50%;}.body-label{font-size:.56rem}.physics-info{font-size:.8rem}.universe-panel{min-height:620px!important;}}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function ensureMounts() {
    scene = document.getElementById("universeScene");

    if (!scene) {
      var panel = document.querySelector(".universe-panel") || document.querySelector(".earth-panel") || document.querySelector(".hero");
      if (!panel) return false;

      scene = document.createElement("div");
      scene.id = "universeScene";
      scene.className = "universe-scene";
      scene.setAttribute("data-zoom", "solar");
      panel.appendChild(scene);
    }

    scene.classList.add("runtime-mounted");
    scene.style.setProperty("--sun-x", "7%");
    scene.style.setProperty("--sun-y", "50%");

    caption = document.getElementById("sceneCaption");

    if (!caption) {
      caption = document.createElement("div");
      caption.id = "sceneCaption";
      caption.className = "scene-caption";
      scene.insertAdjacentElement("afterend", caption);
    }

    controls = document.querySelector(".control-row");

    if (!controls) {
      controls = document.createElement("div");
      controls.className = "control-row";
      caption.insertAdjacentElement("afterend", controls);
    }

    ensureControls();
    ensureInfo();

    return true;
  }

  function ensureControls() {
    if (!controls.querySelector("[data-zoom]")) {
      ["earth", "solar", "system", "universe"].forEach(function (zoom) {
        var button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-zoom", zoom);
        button.setAttribute("aria-pressed", zoom === state.zoom ? "true" : "false");
        button.textContent = zoom;
        controls.appendChild(button);
      });
    }

    if (!controls.querySelector(".runtime-pause")) {
      var pause = document.createElement("button");
      pause.type = "button";
      pause.className = "runtime-pause";
      pause.textContent = "Pause";
      pause.setAttribute("aria-pressed", "false");

      pause.addEventListener("click", function () {
        state.paused = !state.paused;
        pause.setAttribute("aria-pressed", state.paused ? "true" : "false");
        pause.textContent = state.paused ? "Resume" : "Pause";
        render();
      });

      controls.appendChild(pause);
    }

    Array.prototype.slice.call(controls.querySelectorAll("[data-zoom]")).forEach(function (button) {
      button.addEventListener("click", function () {
        setZoom(button.getAttribute("data-zoom"));
      });
    });
  }

  function ensureInfo() {
    info = document.getElementById("physicsInfo");
    if (info) return;

    info = document.createElement("div");
    info.id = "physicsInfo";
    info.className = "physics-info";
    info.setAttribute("aria-live", "polite");

    controls.insertAdjacentElement("afterend", info);
  }

  function getBody(key) {
    for (var i = 0; i < BODIES.length; i += 1) {
      if (BODIES[i].key === key) return BODIES[i];
    }

    return null;
  }

  function compressedDistanceAU(au, zoomKey) {
    if (au === 0) return 0;

    var zoom = ZOOM_STATES[zoomKey] || ZOOM_STATES.solar;
    var maxAU = 30.07;
    var normalized = Math.log(1 + au) / Math.log(1 + maxAU);

    return zoom.orbitMin + (zoom.orbitMax - zoom.orbitMin) * normalized;
  }

  function protectedRadiusPx(body, zoomKey) {
    var zoom = ZOOM_STATES[zoomKey] || ZOOM_STATES.solar;

    if (body.key === "sun") return zoom.sunPx;

    var min = zoomKey === "earth" ? 16 : 13;
    var max = zoomKey === "earth" ? 64 : 60;
    var maxRadius = 69911;
    var normalized = Math.sqrt(body.radiusKm / maxRadius);

    return Math.max(min, Math.min(max, min + (max - min) * normalized));
  }

  function orbitalAngle(body) {
    if (!body.orbitalDays) return 0;

    if (state.paused) {
      return (body.phaseOffset || 0) * Math.PI * 2;
    }

    var nowDays = Date.now() / DAY_MS;
    var base = (nowDays % body.orbitalDays) / body.orbitalDays;
    var offset = body.phaseOffset || 0;

    return (base + offset) * Math.PI * 2;
  }

  function positionFor(body, zoomKey) {
    if (body.key === "sun") {
      return {
        left: "7%",
        top: "50%",
        x: 0,
        y: 0,
        distance: 0
      };
    }

    var distance = compressedDistanceAU(body.distanceAU, zoomKey);
    var angle = orbitalAngle(body);
    var rawX = Math.cos(angle) * distance;
    var rawY = Math.sin(angle) * distance * 0.44;

    var tilt = -13 * Math.PI / 180;
    var x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
    var y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

    return {
      left: "calc(7% + " + x.toFixed(2) + "px)",
      top: "calc(50% + " + y.toFixed(2) + "px)",
      x: x,
      y: y,
      distance: distance
    };
  }

  function clearScene() {
    while (scene.firstChild) {
      scene.removeChild(scene.firstChild);
    }
  }

  function addOrbit(body, zoomKey) {
    if (body.key === "sun") return;

    var distance = compressedDistanceAU(body.distanceAU, zoomKey);
    var orbit = document.createElement("div");

    orbit.className = "orbit";
    if (body.key === state.selectedKey) orbit.classList.add("is-selected");

    orbit.style.width = (distance * 2) + "px";
    orbit.style.height = (distance * 2 * 0.44) + "px";
    orbit.setAttribute("aria-hidden", "true");

    scene.appendChild(orbit);
  }

  function addAsteroidBelt(zoomKey) {
    var zoom = ZOOM_STATES[zoomKey] || ZOOM_STATES.solar;
    if (!zoom.showMinorBodies) return;

    var inner = compressedDistanceAU(ASTEROID_BELT.innerAU, zoomKey);
    var outer = compressedDistanceAU(ASTEROID_BELT.outerAU, zoomKey);
    var mid = (inner + outer) / 2;

    var belt = document.createElement("div");
    belt.className = "orbit-belt";
    belt.style.width = (mid * 2) + "px";
    belt.style.height = (mid * 2 * 0.44) + "px";
    belt.setAttribute("aria-hidden", "true");

    scene.appendChild(belt);
  }

  function addBody(body, zoomKey, labelPositions) {
    var pos = positionFor(body, zoomKey);
    var size = protectedRadiusPx(body, zoomKey);

    var el = document.createElement("button");
    el.type = "button";
    el.className = "body " + (body.key === "sun" ? "sun" : "planet " + body.className);
    if (body.key === state.selectedKey) el.classList.add("is-selected");

    el.style.left = pos.left;
    el.style.top = pos.top;
    el.style.width = size + "px";
    el.style.height = size + "px";

    el.setAttribute(
      "aria-label",
      body.name + " · " + body.type + " · distance " + formatAU(body.distanceAU) + " AU"
    );

    el.addEventListener("click", function () {
      state.selectedKey = body.key;
      if (body.key === "earth") state.zoom = "earth";
      if (body.key === "sun" && state.zoom === "earth") state.zoom = "solar";
      render();
    });

    if (body.rings) {
      var ring = document.createElement("span");
      ring.className = "ring-system";
      ring.setAttribute("aria-hidden", "true");
      el.appendChild(ring);
    }

    if (body.moon && (state.zoom === "earth" || state.selectedKey === "earth")) {
      addMoon(el, body, size);
    }

    scene.appendChild(el);
    addLabel(body, pos, size, labelPositions);
  }

  function addMoon(parent, body, size) {
    var moon = document.createElement("span");
    var moonSize = Math.max(5, size * 0.28);
    var moonDistance = Math.max(18, size * 1.08);

    var moonAngle = state.paused
      ? 0.72 * Math.PI * 2
      : ((Date.now() / DAY_MS) % body.moon.orbitalDays) / body.moon.orbitalDays * Math.PI * 2;

    moon.className = "moon";
    moon.style.width = moonSize + "px";
    moon.style.height = moonSize + "px";
    moon.style.left = "calc(50% + " + (Math.cos(moonAngle) * moonDistance).toFixed(1) + "px)";
    moon.style.top = "calc(50% + " + (Math.sin(moonAngle) * moonDistance * 0.72).toFixed(1) + "px)";
    moon.setAttribute("aria-hidden", "true");

    parent.appendChild(moon);
  }

  function addLabel(body, pos, size, labelPositions) {
    var zoom = ZOOM_STATES[state.zoom] || ZOOM_STATES.solar;

    if (body.key === "sun") return;
    if (state.zoom === "earth" && body.key !== "earth") return;
    if (!zoom.showOuterLabels && body.distanceAU > 1.7) return;

    var label = document.createElement("div");
    label.className = "body-label";
    label.textContent = body.name;

    var labelX = pos.x;
    var labelY = pos.y + Math.max(18, size * 0.95);

    var adjusted = avoidCollision(labelX, labelY, labelPositions);

    label.style.left = "calc(7% + " + adjusted.x.toFixed(2) + "px)";
    label.style.top = "calc(50% + " + adjusted.y.toFixed(2) + "px)";

    scene.appendChild(label);
  }

  function avoidCollision(x, y, used) {
    var nextY = y;
    var attempt = 0;

    while (
      attempt < 8 &&
      used.some(function (point) {
        return Math.abs(point.x - x) < 58 && Math.abs(point.y - nextY) < LABEL_MIN_GAP;
      })
    ) {
      nextY += LABEL_MIN_GAP;
      attempt += 1;
    }

    used.push({ x: x, y: nextY });

    return { x: x, y: nextY };
  }

  function addCinematicLens() {
    var lens = document.createElement("div");
    lens.className = "cinematic-lens";
    lens.setAttribute("aria-hidden", "true");
    scene.appendChild(lens);
  }

  function updateInfo() {
    var selected = getBody(state.selectedKey) || getBody("sun");

    if (!info || !selected) return;

    info.innerHTML = [
      "<strong>" + selected.name + " · " + selected.type + "</strong>",
      "<span>Radius: " + formatKm(selected.radiusKm) + " km · Orbit: " + formatAU(selected.distanceAU) + " AU · Orbital period: " + formatDays(selected.orbitalDays) + " · Axial tilt: " + formatDeg(selected.axialTiltDeg) + "</span>",
      "<span>Detail layer: coded surface bands, cloud/land cues, rim shading, atmospheric glow, and body-specific texture logic. No GraphicBox. No generated image.</span>"
    ].join("");
  }

  function formatKm(value) {
    return Math.round(value).toLocaleString("en-US");
  }

  function formatAU(value) {
    if (!value) return "0";
    return value.toFixed(value < 2 ? 3 : 2);
  }

  function formatDays(value) {
    if (!value) return "—";
    if (value < 1000) return value.toFixed(1) + " days";
    return (value / 365.256).toFixed(1) + " years";
  }

  function formatDeg(value) {
    if (value === undefined || value === null) return "—";
    return value.toFixed(2) + "°";
  }

  function setZoom(zoomKey) {
    if (!ZOOM_STATES[zoomKey]) zoomKey = "solar";
    state.zoom = zoomKey;
    render();
  }

  function updateControls() {
    Array.prototype.slice.call(document.querySelectorAll("[data-zoom]")).forEach(function (button) {
      button.setAttribute(
        "aria-pressed",
        button.getAttribute("data-zoom") === state.zoom ? "true" : "false"
      );
    });
  }

  function render() {
    if (!scene) return;

    scene.setAttribute("data-zoom", state.zoom);
    clearScene();

    var labelPositions = [];

    BODIES.forEach(function (body) {
      addOrbit(body, state.zoom);
    });

    addAsteroidBelt(state.zoom);

    BODIES.forEach(function (body) {
      addBody(body, state.zoom, labelPositions);
    });

    addCinematicLens();

    if (caption) {
      caption.textContent = ZOOM_STATES[state.zoom].label + " · physics-derived / display-compressed";
    }

    updateControls();
    updateInfo();
  }

  function animationTick(now) {
    if (!state.paused && now - state.lastRender > 6500) {
      state.lastRender = now;
      render();
    }

    timer = window.requestAnimationFrame(animationTick);
  }

  function init() {
    injectStyles();

    if (!ensureMounts()) return;

    var currentZoom = scene.getAttribute("data-zoom");
    if (currentZoom && ZOOM_STATES[currentZoom]) {
      state.zoom = currentZoom;
    }

    render();

    if (timer) window.cancelAnimationFrame(timer);
    timer = window.requestAnimationFrame(animationTick);

    window.DGBGaugesUniverseRuntime = Object.freeze({
      version: VERSION,
      bodies: BODIES.slice(),
      zoomStates: Object.assign({}, ZOOM_STATES),
      getState: function () {
        return Object.assign({}, state);
      },
      setZoom: setZoom,
      selectBody: function (key) {
        if (getBody(key)) {
          state.selectedKey = key;
          render();
        }
      },
      render: render,
      rule: "Physics determines relationships. Website determines cinematic projection. Celestial detail is code-rendered."
    });
  }

  onReady(init);
})();
