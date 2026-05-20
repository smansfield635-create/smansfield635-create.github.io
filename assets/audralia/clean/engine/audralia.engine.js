// /assets/audralia/clean/audralia.engine.js
// AUDRALIA_G2_5_PARENT_ENGINE_AUDRALIA_NESTED_CHILD_PATH_ALIGNMENT_TNT_v1
// Full-file replacement.
// Purpose: renew the parent Audralia engine contract to match the current nested child architecture:
//
// Parent:
//   /assets/audralia/clean/audralia.engine.js
//
// Children:
//   /assets/audralia/clean/audralia/engine/continents.js
//   /assets/audralia/clean/audralia/engine/motion.js
//   /assets/audralia/clean/audralia/engine/sky.js
//
// Children remain unchanged.
// Parent owns: mount, child loading, canvas creation, pixel composition, route-bridge compatibility, FORM_VISIBLE.
// Parent does not own: continent law, motion law, sky/weather law, route HTML, route bridge JS, parent Globe, Characters, Gauges, Showroom, or navigation.

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_G2_5_PARENT_ENGINE_AUDRALIA_NESTED_CHILD_PATH_ALIGNMENT_TNT_v1";
  const RECEIPT = "AUDRALIA_G2_5_PARENT_ENGINE_AUDRALIA_NESTED_CHILD_PATH_ALIGNMENT_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_G2_5_PARENT_ENGINE_CHILD_CONTRACT_ALIGNMENT_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const VERSION = "2026-05-20.audralia-g2-5-parent-engine-audralia-nested-child-path-alignment-v1";

  const CHILDREN = Object.freeze({
    continents: Object.freeze({
      path: "/assets/audralia/clean/audralia/engine/continents.js",
      globalName: "AUDRALIA_CONTINENTS_ENGINE",
      requiredContract: "AUDRALIA_G2_5_CONTINENTS_CHILD_ENGINE_TNT_v1"
    }),
    motion: Object.freeze({
      path: "/assets/audralia/clean/audralia/engine/motion.js",
      globalName: "AUDRALIA_MOTION_ENGINE",
      requiredContract: "AUDRALIA_G2_5_MOTION_CHILD_ENGINE_TNT_v1"
    }),
    sky: Object.freeze({
      path: "/assets/audralia/clean/audralia/engine/sky.js",
      globalName: "AUDRALIA_SKY_ENGINE",
      requiredContract: "AUDRALIA_G2_5_SKY_CHILD_ENGINE_TNT_v1"
    })
  });

  const PLANET = Object.freeze({
    seed: 25645161,
    nodeCount: 256,
    sectorCount: 16,
    regionCount: 4,
    summitCount: 9,
    continentCount: 5,
    mainContinents: 4,
    northPolarContinent: true,
    southPoleIceOnly: true,
    seaLevel: 0.735,
    axisTiltDegrees: 23.5,
    childStack: true,
    childArchitecture: "/assets/audralia/clean/audralia/engine/",
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });

  const state = {
    mounted: false,
    mountedAt: null,
    mountCount: 0,
    lastCanvas: null,
    lastRoot: null,
    lastMount: null,
    lastReceipt: null,
    lastSize: 0,
    lastRatios: null,
    children: {
      continents: null,
      motion: null,
      sky: null
    },
    childStatus: {
      continents: "not-loaded",
      motion: "not-loaded",
      sky: "not-loaded"
    },
    childContracts: {
      continents: null,
      motion: null,
      sky: null
    },
    childErrors: {
      continents: null,
      motion: null,
      sky: null
    },
    fallbacksUsed: [],
    motionState: null,
    drawPending: false,
    drawCount: 0,
    lastDrawAt: null,
    lastError: null
  };

  function win() {
    return typeof window !== "undefined" ? window : {};
  }

  function doc(context) {
    return context?.document || (typeof document !== "undefined" ? document : null);
  }

  function now() {
    return new Date().toISOString();
  }

  function isElement(value) {
    const ElementCtor = win().Element;
    return Boolean(ElementCtor && value instanceof ElementCtor);
  }

  function resolveCallContext(input, selfRef) {
    if (input && typeof input === "object" && Object.keys(input).length) return input;
    if (selfRef && typeof selfRef === "object") return selfRef;
    return input || {};
  }

  function resolveMount(input) {
    if (isElement(input)) return input;
    if (isElement(input?.mount)) return input.mount;
    if (isElement(input?.mountTarget)) return input.mountTarget;
    if (isElement(input?.target)) return input.target;

    const documentRef = doc(input);

    return (
      documentRef?.getElementById?.("audralia-clean-canvas-mount") ||
      documentRef?.querySelector?.("[data-audralia-clean-canvas-mount]") ||
      null
    );
  }

  function makeEl(documentRef, tag, className, attrs = {}) {
    const el = documentRef.createElement(tag);
    if (className) el.className = className;

    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value));
    }

    return el;
  }

  function styleRoot(root) {
    root.style.cssText = `
      width:100%;
      min-height:27rem;
      display:grid;
      place-items:center;
      position:relative;
      isolation:isolate;
      overflow:hidden;
      border-radius:1.25rem;
      background:
        radial-gradient(circle at 50% 34%,rgba(143,240,195,.14),transparent 16rem),
        radial-gradient(circle at 50% 58%,rgba(36,120,255,.15),transparent 24rem),
        radial-gradient(circle at 50% 80%,rgba(243,200,111,.045),transparent 26rem),
        linear-gradient(180deg,rgba(1,7,16,.30),rgba(1,4,12,.78));
    `;
  }

  function styleCanvas(canvas) {
    canvas.style.cssText = `
      width:min(82vw,31rem);
      height:min(82vw,31rem);
      max-width:100%;
      display:block;
      border-radius:50%;
      filter:
        drop-shadow(0 0 2.9rem rgba(143,240,195,.23))
        drop-shadow(0 0 1.5rem rgba(141,216,255,.13))
        drop-shadow(0 2rem 2.6rem rgba(0,0,0,.48));
      touch-action:none;
      cursor:grab;
      user-select:none;
    `;
  }

  function styleLabel(label) {
    label.style.cssText = `
      position:absolute;
      left:50%;
      bottom:7%;
      transform:translateX(-50%);
      width:min(92%,28rem);
      padding:.78rem .9rem;
      border:1px solid rgba(143,240,195,.28);
      border-radius:1rem;
      background:rgba(1,7,16,.78);
      color:rgba(255,244,216,.94);
      font:850 .72rem/1.35 ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      letter-spacing:.075em;
      text-align:center;
      text-transform:uppercase;
      backdrop-filter:blur(8px);
      z-index:5;
      pointer-events:none;
    `;
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp01((x - edge0) / Math.max(0.00001, edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function normalize3(v) {
    const x = Number(v?.x || 0);
    const y = Number(v?.y || 0);
    const z = Number(v?.z || 0);
    const m = Math.hypot(x, y, z) || 1;
    return { x: x / m, y: y / m, z: z / m };
  }

  function dot3(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function mixColor(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
      lerp(a[3] ?? 1, b[3] ?? 1, t)
    ];
  }

  async function importAsModule(path, globalName) {
    try {
      await import(`${path}?v=${encodeURIComponent(VERSION)}`);
      return win()[globalName] || null;
    } catch (error) {
      return { error };
    }
  }

  function loadAsClassicScript(path, globalName) {
    return new Promise((resolve) => {
      const global = win();

      if (global[globalName]) {
        resolve(global[globalName]);
        return;
      }

      const documentRef = doc();
      if (!documentRef?.head) {
        resolve(null);
        return;
      }

      const existing = Array.from(documentRef.querySelectorAll("script[src]")).find((script) => {
        const src = String(script.getAttribute("src") || "");
        return src.startsWith(path);
      });

      if (existing) {
        setTimeout(() => resolve(global[globalName] || null), 50);
        return;
      }

      const script = documentRef.createElement("script");
      script.src = `${path}?v=${encodeURIComponent(VERSION)}`;
      script.async = true;
      script.dataset.audraliaChildEngine = globalName;
      script.onload = () => resolve(global[globalName] || null);
      script.onerror = () => resolve(null);
      documentRef.head.appendChild(script);
    });
  }

  async function loadChild(name, fallbackFactory) {
    const child = CHILDREN[name];
    const global = win();

    let loaded = global[child.globalName] || null;

    if (!loaded) {
      const moduleResult = await importAsModule(child.path, child.globalName);

      if (moduleResult && !moduleResult.error) {
        loaded = moduleResult;
      } else if (moduleResult?.error) {
        state.childErrors[name] = `module:${moduleResult.error?.message || String(moduleResult.error)}`;
      }
    }

    if (!loaded) {
      loaded = await loadAsClassicScript(child.path, child.globalName);

      if (!loaded && !state.childErrors[name]) {
        state.childErrors[name] = "classic-script-load-failed";
      }
    }

    if (!loaded) {
      loaded = fallbackFactory();
      state.childStatus[name] = "fallback";
      state.fallbacksUsed.push(name);
    } else {
      state.childStatus[name] = loaded.contract === child.requiredContract ? "loaded-matching" : "loaded-contract-mismatch";
    }

    state.children[name] = loaded;
    state.childContracts[name] = loaded?.contract || "missing";

    return loaded;
  }

  async function loadChildren() {
    const continents = await loadChild("continents", fallbackContinentsEngine);
    const motion = await loadChild("motion", fallbackMotionEngine);
    const sky = await loadChild("sky", fallbackSkyEngine);

    return { continents, motion, sky };
  }

  function fallbackContinentsEngine() {
    const FALLBACK_CONTRACT = "AUDRALIA_G2_5_FALLBACK_CONTINENTS_CHILD";

    function classifySurface(worldNormal) {
      const n = normalize3(worldNormal);
      const lon = Math.atan2(n.x, n.z);
      const lat = Math.asin(Math.max(-1, Math.min(1, n.y)));
      const u = lon / Math.PI;
      const v = lat / (Math.PI / 2);

      const mainA = Math.exp(-Math.pow((u + 0.42) / 0.30, 2) - Math.pow((v + 0.10) / 0.22, 2));
      const mainB = Math.exp(-Math.pow((u + 0.12) / 0.25, 2) - Math.pow((v - 0.31) / 0.19, 2));
      const mainC = Math.exp(-Math.pow((u - 0.26) / 0.31, 2) - Math.pow((v - 0.02) / 0.23, 2));
      const mainD = Math.exp(-Math.pow((u - 0.18) / 0.24, 2) - Math.pow((v + 0.42) / 0.17, 2));
      const north = Math.exp(-Math.pow((u - 0.02) / 0.42, 2) - Math.pow((v - 0.77) / 0.16, 2));

      const terrainCandidate = clamp01(Math.max(mainA, mainB, mainC, mainD, north));
      const summit = clamp01(Math.pow(Math.max(0, dot3(n, normalize3({ x: 0.08, y: 0.38, z: 0.92 }))), 32));
      const elevation = clamp01(terrainCandidate * 0.66 + summit * 0.22);
      const seaLevel = PLANET.seaLevel;

      const southPole = v < -0.68;
      const southIce = southPole ? 0.86 : 0;
      const northIce = v > 0.78 ? 0.46 : 0;
      const polarIce = Math.max(southIce, northIce);

      const exposedLand = !southPole && terrainCandidate > 0.44 && elevation > seaLevel;
      const drownedContinent = !exposedLand && terrainCandidate > 0.47;
      const nearSeaShelf = !exposedLand && terrainCandidate > 0.33 && !drownedContinent;
      const deepOcean = !exposedLand && !drownedContinent && !nearSeaShelf;

      return Object.freeze({
        contract: FALLBACK_CONTRACT,
        normal: n,
        lon,
        lat,
        u,
        v,
        continent: {
          id: north > 0.35 ? "NORTH_POLAR" : terrainCandidate > 0.35 ? "MAIN" : "OCEAN",
          kind: north > 0.35 ? "north-polar" : terrainCandidate > 0.35 ? "main" : "ocean",
          strength: terrainCandidate,
          northPolar: north > 0.35,
          main: terrainCandidate > 0.35 && north <= 0.35
        },
        terrainCandidate,
        elevation,
        seaLevel,
        exposureDistance: elevation - seaLevel,
        exposedLand,
        nearSeaShelf,
        drownedContinent,
        deepOcean,
        summit,
        mountain: exposedLand ? summit : 0,
        basin: 0,
        ridge: 0,
        ridgeNoise: 0.5,
        grain: 0.5,
        polarIce,
        southPole,
        southIce,
        northIce,
        coastLine: exposedLand ? 0.25 : 0,
        classification: exposedLand
          ? "exposed-land"
          : southPole
            ? "south-pole-ice-water"
            : drownedContinent
              ? "drowned-continent"
              : nearSeaShelf
                ? "near-sea-shelf"
                : "deep-ocean"
      });
    }

    function getStatus() {
      return Object.freeze({ contract: FALLBACK_CONTRACT, fallback: true });
    }

    return Object.freeze({
      contract: FALLBACK_CONTRACT,
      classifySurface,
      getStatus,
      getContinentStatus: getStatus
    });
  }

  function fallbackMotionEngine() {
    const FALLBACK_CONTRACT = "AUDRALIA_G2_5_FALLBACK_MOTION_CHILD";

    function rotateX(v, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c };
    }

    function rotateY(v, angle) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c };
    }

    function createMotionState(canvas, redraw) {
      const motionState = {
        contract: FALLBACK_CONTRACT,
        rotationLon: 0,
        viewPitch: 0.10,
        axisTiltDegrees: PLANET.axisTiltDegrees,
        dragging: false,
        projectViewToWorld(viewNormal) {
          let v = normalize3(viewNormal);
          v = rotateX(v, motionState.viewPitch);
          v = rotateX(v, (motionState.axisTiltDegrees * Math.PI) / 180);
          v = rotateY(v, motionState.rotationLon);
          return normalize3(v);
        },
        getStatus() {
          return {
            contract: FALLBACK_CONTRACT,
            fallback: true,
            rotationLon: motionState.rotationLon,
            viewPitch: motionState.viewPitch
          };
        }
      };

      if (canvas) {
        canvas.dataset.audraliaMotionEngine = FALLBACK_CONTRACT;
        canvas.style.cursor = "grab";

        let down = false;
        let lastX = 0;
        let lastY = 0;

        canvas.addEventListener("pointerdown", (event) => {
          down = true;
          motionState.dragging = true;
          lastX = event.clientX || 0;
          lastY = event.clientY || 0;
          canvas.style.cursor = "grabbing";
          canvas.setPointerCapture?.(event.pointerId);
          event.preventDefault?.();
        }, { passive: false });

        canvas.addEventListener("pointermove", (event) => {
          if (!down) return;

          const x = event.clientX || 0;
          const y = event.clientY || 0;

          motionState.rotationLon += (x - lastX) * 0.0085;
          motionState.viewPitch = Math.max(-0.62, Math.min(0.62, motionState.viewPitch + (y - lastY) * 0.0045));

          lastX = x;
          lastY = y;

          if (typeof redraw === "function") redraw(motionState);
          event.preventDefault?.();
        }, { passive: false });

        const release = (event) => {
          down = false;
          motionState.dragging = false;
          canvas.style.cursor = "grab";
          canvas.releasePointerCapture?.(event.pointerId);
          event.preventDefault?.();
        };

        canvas.addEventListener("pointerup", release, { passive: false });
        canvas.addEventListener("pointercancel", release, { passive: false });

        const loop = () => {
          if (!down) {
            motionState.rotationLon += 0.018;
            if (typeof redraw === "function") redraw(motionState);
          }

          win().requestAnimationFrame?.(loop);
        };

        win().requestAnimationFrame?.(loop);
      }

      return motionState;
    }

    return Object.freeze({
      contract: FALLBACK_CONTRACT,
      createMotionState,
      projectViewToWorld(viewNormal, motionState) {
        return motionState?.projectViewToWorld ? motionState.projectViewToWorld(viewNormal) : normalize3(viewNormal);
      },
      getStatus() {
        return { contract: FALLBACK_CONTRACT, fallback: true };
      },
      getMotionStatus() {
        return { contract: FALLBACK_CONTRACT, fallback: true };
      }
    });
  }

  function fallbackSkyEngine() {
    const FALLBACK_CONTRACT = "AUDRALIA_G2_5_FALLBACK_SKY_CHILD";

    function applySkyColor(color, surface = {}, lighting = null, context = {}) {
      const rr = clamp01(Number(context.radiusRatio || 0));
      const n = normalize3(surface.normal || { x: 0, y: 0, z: 1 });
      const light = normalize3(context.light || { x: -0.64, y: -0.46, z: 0.62 });
      const lit = clamp01(dot3(n, light) * 0.74 + 0.44);
      let out = mixColor([1, 7, 17, 1], color, lit);
      out = mixColor(out, [126, 232, 202, 1], Math.pow(rr, 3.4) * 0.025);
      return out;
    }

    function drawAtmosphere(ctx, geometry = {}) {
      const cx = Number(geometry.cx || 0);
      const cy = Number(geometry.cy || 0);
      const r = Number(geometry.r || 0);
      const size = Number(geometry.size || Math.max(r * 2, 1));

      if (!ctx || !r) return false;

      const rim = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r * 1.13);
      rim.addColorStop(0, "rgba(143,240,195,0)");
      rim.addColorStop(0.88, "rgba(141,216,255,0.18)");
      rim.addColorStop(1, "rgba(143,240,195,0)");

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.13, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.004, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(208,255,236,0.22)";
      ctx.lineWidth = Math.max(1, size * 0.0032);
      ctx.stroke();
      ctx.restore();

      return true;
    }

    function drawWeatherVeil() {
      return false;
    }

    function getStatus() {
      return Object.freeze({ contract: FALLBACK_CONTRACT, fallback: true });
    }

    return Object.freeze({
      contract: FALLBACK_CONTRACT,
      applySkyColor,
      drawAtmosphere,
      drawWeatherVeil,
      getStatus,
      getSkyStatus: getStatus
    });
  }

  function baseSurfaceColor(surface) {
    const oceanDeep = [1, 13, 32, 1];
    const oceanMid = [5, 59, 91, 1];
    const oceanShelf = [21, 122, 145, 1];
    const drownedBlue = [18, 104, 128, 1];
    const shallowReef = [62, 174, 166, 1];

    const coastSand = [170, 154, 104, 1];
    const landLow = [78, 125, 80, 1];
    const landMid = [96, 139, 88, 1];
    const highland = [133, 132, 98, 1];
    const summitColor = [218, 213, 176, 1];
    const iceColor = [224, 248, 243, 1];

    let color;

    if (surface.exposedLand) {
      const relief = clamp01((surface.elevation || 0) * 0.68 + (surface.mountain || 0) * 0.36);
      const coastBlend = smoothstep(0.022, 0.115, surface.exposureDistance || 0);

      color = mixColor(coastSand, landLow, coastBlend);
      color = mixColor(color, landMid, clamp01(relief * 0.56));
      color = mixColor(color, highland, clamp01((surface.mountain || 0) * 0.50));
      color = mixColor(color, summitColor, clamp01((surface.mountain || 0) * 0.42 + (surface.polarIce || 0) * 0.22));

      if (surface.continent?.northPolar) {
        color = mixColor(color, iceColor, clamp01((surface.polarIce || 0) * 0.48 + 0.12));
      }

      color = mixColor(color, coastSand, clamp01((surface.coastLine || 0) * 0.38));
    } else if (surface.drownedContinent) {
      const underwaterRelief = clamp01((surface.terrainCandidate || 0) * 0.55 + (surface.elevation || 0) * 0.28);
      color = mixColor(oceanMid, drownedBlue, underwaterRelief);
      color = mixColor(color, oceanShelf, clamp01(underwaterRelief * 0.42));
      color = mixColor(color, shallowReef, clamp01(((surface.elevation || 0) - ((surface.seaLevel || PLANET.seaLevel) - 0.10)) * 1.7));
    } else if (surface.nearSeaShelf) {
      const shelfLift = clamp01((surface.terrainCandidate || 0) * 0.55 + (surface.elevation || 0) * 0.22);
      color = mixColor(oceanMid, oceanShelf, shelfLift);
      color = mixColor(color, shallowReef, clamp01(shelfLift * 0.24));
    } else {
      const depth = clamp01((0.56 - (surface.terrainCandidate || 0)) * 2.8 + ((surface.seaLevel || PLANET.seaLevel) - (surface.elevation || 0)) * 0.74);
      color = mixColor(oceanShelf, oceanMid, depth);
      color = mixColor(color, oceanDeep, clamp01(depth * 0.88));
    }

    if (surface.southPole) {
      color = mixColor(color, iceColor, clamp01((surface.southIce || 0) * 0.72));
    } else if ((surface.polarIce || 0) > 0.40) {
      color = mixColor(color, iceColor, clamp01(((surface.polarIce || 0) - 0.22) * 0.42));
    }

    return color;
  }

  function drawAxisOverlay(ctx, cx, cy, r, size) {
    const motion = state.motionState || {};
    const tilt = -((Number(motion.axisTiltDegrees || PLANET.axisTiltDegrees) * Math.PI) / 180) + Number(motion.viewPitch || 0) * 0.30;
    const length = r * 1.18;
    const dx = Math.sin(tilt) * length;
    const dy = Math.cos(tilt) * length;

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(cx - dx, cy + dy);
    ctx.lineTo(cx + dx, cy - dy);
    ctx.strokeStyle = "rgba(208,255,236,0.105)";
    ctx.lineWidth = Math.max(1, size * 0.0017);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + dx, cy - dy, r * 0.017, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(224,248,243,0.16)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - dx, cy + dy, r * 0.013, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(141,216,255,0.10)";
    ctx.fill();

    ctx.restore();
  }

  function drawSubtleOrbitReceipt(ctx, cx, cy, r, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.18);

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.30, r * 0.36, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(143,240,195,0.070)";
    ctx.lineWidth = Math.max(1, size * 0.002);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.18, r * 0.29, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(243,200,111,0.040)";
    ctx.lineWidth = Math.max(1, size * 0.0015);
    ctx.stroke();

    ctx.restore();
  }

  function drawPlanetPixels(canvas) {
    if (!canvas) return false;

    const rect = canvas.getBoundingClientRect();
    const cssSize = Math.max(300, Math.min(rect.width || 460, 560));
    const dpr = Math.max(1, Math.min(1.35, win().devicePixelRatio || 1));
    const size = Math.round(cssSize * dpr);

    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
      state.lastSize = size;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return false;

    ctx.clearRect(0, 0, size, size);

    const continents = state.children.continents || fallbackContinentsEngine();
    const sky = state.children.sky || fallbackSkyEngine();
    const motionState = state.motionState;

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.432;

    const image = ctx.createImageData(size, size);
    const data = image.data;

    const stats = {
      total: 0,
      exposedLand: 0,
      shelf: 0,
      drownedContinent: 0,
      deepOcean: 0,
      ice: 0
    };

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = (x + 0.5 - cx) / r;
        const dy = (y + 0.5 - cy) / r;
        const rr = dx * dx + dy * dy;
        const idx = (y * size + x) * 4;

        if (rr > 1) {
          data[idx + 3] = 0;
          continue;
        }

        stats.total += 1;

        const z = Math.sqrt(Math.max(0, 1 - rr));
        const viewNormal = { x: dx, y: -dy, z };
        const worldNormal = motionState?.projectViewToWorld
          ? motionState.projectViewToWorld(viewNormal)
          : normalize3(viewNormal);

        const surface = continents.classifySurface(worldNormal, {
          seaLevel: PLANET.seaLevel,
          parentContract: CONTRACT
        });

        if (surface.exposedLand) stats.exposedLand += 1;
        if (surface.nearSeaShelf) stats.shelf += 1;
        if (surface.drownedContinent) stats.drownedContinent += 1;
        if (surface.deepOcean) stats.deepOcean += 1;
        if (surface.southPole || surface.polarIce > 0.40) stats.ice += 1;

        let color = baseSurfaceColor(surface);

        if (sky.applySkyColor) {
          color = sky.applySkyColor(
            color,
            {
              ...surface,
              normal: worldNormal,
              viewNormal
            },
            null,
            {
              viewNormal,
              screenNormal: viewNormal,
              radiusRatio: rr,
              light: { x: -0.64, y: -0.46, z: 0.62 },
              rotationLon: Number(motionState?.rotationLon || 0)
            }
          );
        }

        data[idx] = color[0];
        data[idx + 1] = color[1];
        data[idx + 2] = color[2];
        data[idx + 3] = Math.round(255 * clamp01(color[3] ?? 1));
      }
    }

    state.lastRatios = Object.freeze({
      total: stats.total,
      exposedLandRatio: stats.total ? Number((stats.exposedLand / stats.total).toFixed(4)) : 0,
      shelfRatio: stats.total ? Number((stats.shelf / stats.total).toFixed(4)) : 0,
      drownedContinentRatio: stats.total ? Number((stats.drownedContinent / stats.total).toFixed(4)) : 0,
      deepOceanRatio: stats.total ? Number((stats.deepOcean / stats.total).toFixed(4)) : 0,
      iceRatio: stats.total ? Number((stats.ice / stats.total).toFixed(4)) : 0
    });

    ctx.putImageData(image, 0, 0);

    if (sky.drawAtmosphere) {
      sky.drawAtmosphere(ctx, { cx, cy, r, size }, {
        rotationLon: Number(motionState?.rotationLon || 0)
      });
    }

    if (sky.drawWeatherVeil) {
      sky.drawWeatherVeil(ctx, { cx, cy, r, size }, {
        rotationLon: Number(motionState?.rotationLon || 0)
      });
    }

    drawAxisOverlay(ctx, cx, cy, r, size);
    drawSubtleOrbitReceipt(ctx, cx, cy, r, size);

    state.drawCount += 1;
    state.lastDrawAt = now();

    return true;
  }

  function updateLabel() {
    const label = state.lastRoot?.querySelector?.("[data-audralia-engine-label]");
    if (!label) return;

    const motion = state.motionState;
    const lon = Number(motion?.rotationLon || 0).toFixed(2);
    const land = state.lastRatios?.exposedLandRatio ?? "n/a";
    const ocean = state.lastRatios?.deepOceanRatio ?? "n/a";
    const c = state.childStatus.continents;
    const m = state.childStatus.motion;
    const s = state.childStatus.sky;

    label.textContent = `Audralia G2.5 · nested child stack active · lon ${lon} · land ${land} · ocean ${ocean} · ${c}/${m}/${s}`;
  }

  function requestDraw(canvas, immediate = false) {
    if (!canvas) return;

    if (immediate) {
      state.drawPending = false;
      drawPlanetPixels(canvas);
      updateLabel();
      return;
    }

    if (state.drawPending) return;

    state.drawPending = true;

    const draw = () => {
      state.drawPending = false;
      drawPlanetPixels(canvas);
      updateLabel();
    };

    if (typeof win().requestAnimationFrame === "function") {
      win().requestAnimationFrame(draw);
    } else {
      setTimeout(draw, 0);
    }
  }

  function installResizeRedraw(root, canvas) {
    if (!root || !canvas) return;

    if (typeof win().ResizeObserver === "function") {
      const observer = new (win().ResizeObserver)(() => requestDraw(canvas));
      observer.observe(root);
      return;
    }

    win().addEventListener?.("resize", () => requestDraw(canvas), { passive: true });
  }

  function createRender(context) {
    const documentRef = doc(context);
    if (!documentRef) throw new Error("Document unavailable for Audralia G2.5 nested child parent engine render.");

    const root = makeEl(documentRef, "section", "audralia-engine-root", {
      "data-audralia-engine-render": "true",
      "data-audralia-clean-canvas-render": "true",
      "data-audralia-g2-5-nested-child-stack": "true",
      "data-contract": CONTRACT,
      "data-previous-contract": PREVIOUS_CONTRACT
    });

    styleRoot(root);

    const canvas = makeEl(documentRef, "canvas", "audralia-engine-canvas", {
      "data-audralia-form": "g2-5-nested-child-stack-engine-canvas",
      "aria-label": "Audralia G2.5 nested child-stack planet form. Drag to rotate."
    });

    styleCanvas(canvas);

    const label = makeEl(documentRef, "div", "audralia-engine-label", {
      "data-audralia-engine-label": "true"
    });

    styleLabel(label);
    label.textContent = "Audralia G2.5 · nested child engine stack loading";

    root.appendChild(canvas);
    root.appendChild(label);

    return { root, canvas, label };
  }

  async function mount(input = {}) {
    const context = resolveCallContext(input, this);
    const mountTarget = resolveMount(context);
    const documentRef = doc(context);

    if (!mountTarget) throw new Error("Audralia G2.5 nested child parent engine mount target missing.");
    if (!documentRef) throw new Error("Audralia G2.5 nested child parent engine document missing.");

    const render = createRender(context);
    mountTarget.replaceChildren(render.root);

    await loadChildren();

    const redraw = () => requestDraw(render.canvas, true);

    if (state.children.motion?.createMotionState) {
      state.motionState = state.children.motion.createMotionState(render.canvas, redraw, {
        axisTiltDegrees: PLANET.axisTiltDegrees,
        autoRotationEnabled: true,
        initialViewPitch: 0.10
      });
    } else {
      state.motionState = fallbackMotionEngine().createMotionState(render.canvas, redraw);
    }

    installResizeRedraw(render.root, render.canvas);

    state.mounted = true;
    state.mountedAt = now();
    state.mountCount += 1;
    state.lastCanvas = render.canvas;
    state.lastRoot = render.root;
    state.lastMount = mountTarget;

    mountTarget.dataset.audraliaFormVisible = "true";
    mountTarget.dataset.audraliaEngineMounted = "true";
    mountTarget.dataset.audraliaEngineContract = CONTRACT;
    mountTarget.dataset.audraliaG25NestedChildStack = "true";
    mountTarget.dataset.audraliaChildArchitecture = PLANET.childArchitecture;
    mountTarget.dataset.audraliaChildContinents = state.childStatus.continents;
    mountTarget.dataset.audraliaChildMotion = state.childStatus.motion;
    mountTarget.dataset.audraliaChildSky = state.childStatus.sky;

    const statusTarget = context?.statusTarget;
    if (isElement(statusTarget)) {
      statusTarget.textContent = "FORM_VISIBLE · Audralia G2.5 nested child-stack parent engine mounted.";
      statusTarget.dataset.state = "pass";
    }

    requestDraw(render.canvas, true);
    state.lastReceipt = buildReceipt(true);

    return {
      element: render.root,
      canvas: render.canvas,
      contract: CONTRACT,
      receipt: state.lastReceipt
    };
  }

  function buildReceipt(valid) {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      valid,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      parentRole: "mount-composition-engine",
      childStack: true,
      childArchitecture: PLANET.childArchitecture,
      childPaths: Object.freeze({
        continents: CHILDREN.continents.path,
        motion: CHILDREN.motion.path,
        sky: CHILDREN.sky.path
      }),
      childrenLoaded: Object.freeze({ ...state.childStatus }),
      childrenFallbackUsed: Object.freeze([...state.fallbacksUsed]),
      childContracts: Object.freeze({ ...state.childContracts }),
      childErrors: Object.freeze({ ...state.childErrors }),
      continentEngineContract: state.childContracts.continents,
      motionEngineContract: state.childContracts.motion,
      skyEngineContract: state.childContracts.sky,
      ratios: state.lastRatios,
      planetStandard: "G2.5 nested Audralia child-engine split planet form",
      continentCount: PLANET.continentCount,
      mainContinents: PLANET.mainContinents,
      northPolarContinent: PLANET.northPolarContinent,
      southPoleIceOnly: PLANET.southPoleIceOnly,
      axisRotation: true,
      fingerDrag: true,
      skyLayer: true,
      nodeCount: PLANET.nodeCount,
      sectorCount: PLANET.sectorCount,
      regionCount: PLANET.regionCount,
      summitCount: PLANET.summitCount,
      ownsVisibleFormHandoff: true,
      ownsParentGlobeRoute: false,
      ownsRouteBridgeHtml: false,
      ownsRouteBridgeJs: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  function getStatus() {
    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      version: VERSION,
      route: ROUTE,
      mounted: state.mounted,
      mountedAt: state.mountedAt,
      mountCount: state.mountCount,
      lastReceipt: state.lastReceipt,
      lastSize: state.lastSize,
      drawCount: state.drawCount,
      lastDrawAt: state.lastDrawAt,
      ratios: state.lastRatios,
      childrenLoaded: Object.freeze({ ...state.childStatus }),
      childrenFallbackUsed: Object.freeze([...state.fallbacksUsed]),
      childContracts: Object.freeze({ ...state.childContracts }),
      childErrors: Object.freeze({ ...state.childErrors }),
      childArchitecture: PLANET.childArchitecture,
      motion: state.motionState?.getStatus ? state.motionState.getStatus() : null,
      planet: PLANET,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  const AUDRALIA_ENGINE = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    route: ROUTE,
    planet: PLANET,
    mount,
    render: mount,
    start: mount,
    boot: mount,
    init: mount,
    create: mount,
    getStatus
  });

  const global = win();

  global.AUDRALIA_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_ENGINE = AUDRALIA_ENGINE;
  global.AUDRALIA_CLEAN_CANVAS_AUTHORITY = AUDRALIA_ENGINE;
  global.AudraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.audraliaCleanCanvasEngine = AUDRALIA_ENGINE;
  global.mountAudraliaCleanCanvas = mount;
  global.renderAudraliaCleanCanvas = mount;
  global.mountAudralia = mount;
  global.renderAudralia = mount;
})();
