/* TARGET FILE: /showroom/globe/audralia/index.js */
/*
  AUDRALIA_ROUTEFINDER_PROJECTION_SPACE_LANDMASK_TNT_v1
  Full-file replacement.
  Purpose:
  - Restore the full executable renderer body expected by the live HTML.
  - Mount a visible Audralia globe inside #audraliaCanvasMount.
  - Paint land/ocean/shelf/beach directly in projection space.
  - Consume AUDRALIA_LANDMAP v2 when it is served and executable.
  - Fall back to internal projection-space landmask if the upstream landmap body is missing or stale.
  Preserves:
  - boxed containment
  - touch scope
  - Audralia spelling
  - no generated image
  - no GraphicBox
  - no visual-pass claim
*/

(() => {
  "use strict";

  const CONTRACT = "AUDRALIA_ROUTEFINDER_PROJECTION_SPACE_LANDMASK_TNT_v1";
  const RECEIPT = "AUDRALIA_ROUTEFINDER_PROJECTION_SPACE_LANDMASK_RECEIPT_v1";
  const PREVIOUS_CONTRACT = "AUDRALIA_ROUTEFINDER_VISIBLE_TEXTURE_GUARD_CACHE_KEY_PAIR_HTML_TNT_v1";
  const ROUTE = "/showroom/globe/audralia/";
  const WORLD = "Audralia";
  const REQUIRED_LANDMAP = "AUDRALIA_LANDMAP_CONTINENT_BREAKUP_AND_OCEAN_CUT_AUTHORITY_TNT_v2";

  const TAU = Math.PI * 2;
  const PHI = 1.618033988749895;

  const COLORS = Object.freeze({
    deepOcean: [2, 18, 58],
    ocean: [8, 82, 136],
    shelf: [42, 156, 170],
    lagoon: [126, 214, 186],
    lake: [32, 126, 142],
    beach: [222, 198, 126],
    wetBeach: [168, 154, 100],
    lowland: [108, 154, 80],
    forest: [50, 126, 78],
    wetland: [60, 124, 102],
    highland: [144, 128, 82],
    mountain: [146, 140, 118],
    stone: [106, 111, 103],
    snow: [224, 235, 228],
    cloud: [234, 242, 235],
    atmosphere: [92, 174, 210],
    rim: [152, 230, 214]
  });

  const LAND_BODIES = Object.freeze([
    { id: "western-mainland", lon: -2.04, lat: 0.10, rx: 0.55, ry: 0.42, tilt: -0.22, weight: 1.10 },
    { id: "northwest-lobe", lon: -2.55, lat: 0.52, rx: 0.36, ry: 0.25, tilt: 0.24, weight: 0.74 },
    { id: "southwest-lobe", lon: -2.36, lat: -0.46, rx: 0.35, ry: 0.25, tilt: -0.35, weight: 0.68 },
    { id: "central-mainland", lon: -0.46, lat: 0.07, rx: 0.68, ry: 0.44, tilt: 0.16, weight: 1.16 },
    { id: "central-south", lon: -0.15, lat: -0.52, rx: 0.45, ry: 0.25, tilt: -0.18, weight: 0.78 },
    { id: "central-north", lon: -0.78, lat: 0.60, rx: 0.38, ry: 0.25, tilt: 0.22, weight: 0.68 },
    { id: "eastern-subcontinent", lon: 1.22, lat: -0.06, rx: 0.55, ry: 0.40, tilt: -0.16, weight: 1.00 },
    { id: "northeast-lobe", lon: 1.88, lat: 0.38, rx: 0.38, ry: 0.27, tilt: 0.18, weight: 0.74 },
    { id: "southeast-lobe", lon: 1.76, lat: -0.63, rx: 0.34, ry: 0.22, tilt: -0.28, weight: 0.64 },
    { id: "far-east-island-continent", lon: 2.66, lat: -0.20, rx: 0.38, ry: 0.30, tilt: 0.10, weight: 0.70 },
    { id: "southern-landmass", lon: 0.28, lat: -0.98, rx: 0.64, ry: 0.18, tilt: 0.04, weight: 0.56 }
  ]);

  const OCEAN_CUTS = Object.freeze([
    { id: "great-western-seaway", lon: -1.35, lat: 0.04, rx: 0.23, ry: 0.88, tilt: -0.04, weight: 1.10 },
    { id: "central-blue-seaway", lon: 0.50, lat: 0.16, rx: 0.22, ry: 0.84, tilt: 0.12, weight: 1.04 },
    { id: "eastern-sunrise-channel", lon: 2.30, lat: 0.06, rx: 0.28, ry: 0.72, tilt: -0.18, weight: 0.88 },
    { id: "northern-inner-sea", lon: -0.18, lat: 0.68, rx: 0.40, ry: 0.27, tilt: -0.18, weight: 0.72 },
    { id: "south-central-basin", lon: -0.95, lat: -0.86, rx: 0.58, ry: 0.30, tilt: 0.08, weight: 0.76 },
    { id: "free-will-strait", lon: -0.03, lat: -0.08, rx: 0.16, ry: 0.76, tilt: -0.28, weight: 0.86 }
  ]);

  const ISLANDS = Object.freeze([
    { lon: -2.90, lat: -0.78, rx: 0.15, ry: 0.08, tilt: 0.20, weight: 0.80 },
    { lon: -1.72, lat: -0.92, rx: 0.13, ry: 0.07, tilt: -0.16, weight: 0.70 },
    { lon: -0.08, lat: 0.96, rx: 0.14, ry: 0.08, tilt: -0.12, weight: 0.72 },
    { lon: 0.98, lat: -0.92, rx: 0.16, ry: 0.08, tilt: -0.24, weight: 0.80 },
    { lon: 2.18, lat: 0.86, rx: 0.14, ry: 0.08, tilt: 0.18, weight: 0.76 }
  ]);

  const LAKES = Object.freeze([
    { lon: -0.85, lat: 0.16, rx: 0.075, ry: 0.045, tilt: -0.12 },
    { lon: -0.28, lat: -0.10, rx: 0.095, ry: 0.054, tilt: 0.15 },
    { lon: 1.18, lat: -0.12, rx: 0.082, ry: 0.050, tilt: -0.18 },
    { lon: -2.28, lat: 0.26, rx: 0.064, ry: 0.040, tilt: 0.30 }
  ]);

  const mount =
    document.getElementById("audraliaCanvasMount") ||
    document.querySelector("[data-audralia-canvas-mount='true']") ||
    document.querySelector("[data-audralia-globe-mount='true']");

  const stage =
    document.getElementById("audralia-stage") ||
    document.querySelector("[data-audralia-stage='true']") ||
    (mount ? mount.closest(".stage") : null);

  const proof = Object.freeze({
    html: document.querySelector("[data-audralia-proof-html]"),
    script: document.querySelector("[data-audralia-proof-script]"),
    js: document.querySelector("[data-audralia-proof-js]"),
    mount: document.querySelector("[data-audralia-proof-mount]"),
    notice: document.getElementById("audraliaRouteLoaderNotice") || document.querySelector("[data-audralia-route-loader-notice='true']"),
    status: document.getElementById("audraliaRouteStatus") || document.querySelector("[data-audralia-route-status='true']")
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, value) {
    const t = clamp((value - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapPi(value) {
    let out = value;
    while (out < -Math.PI) out += TAU;
    while (out > Math.PI) out -= TAU;
    return out;
  }

  function mix(a, b, t) {
    const k = clamp(t, 0, 1);
    return [
      Math.round(lerp(a[0], b[0], k)),
      Math.round(lerp(a[1], b[1], k)),
      Math.round(lerp(a[2], b[2], k))
    ];
  }

  function shade(color, amount) {
    return [
      clamp(Math.round(color[0] + amount), 0, 255),
      clamp(Math.round(color[1] + amount), 0, 255),
      clamp(Math.round(color[2] + amount), 0, 255)
    ];
  }

  function contrast(color, factor, pivot = 118) {
    return [
      clamp(Math.round((color[0] - pivot) * factor + pivot), 0, 255),
      clamp(Math.round((color[1] - pivot) * factor + pivot), 0, 255),
      clamp(Math.round((color[2] - pivot) * factor + pivot), 0, 255)
    ];
  }

  function hash(x, y, seed) {
    let h = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
    h ^= Math.imul(y ^ seed ^ 0xc2b2ae35, 0x27d4eb2f);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967295;
  }

  function noise(u, v, scale, seed) {
    const s = Math.max(2, Math.floor(scale));
    const x = wrap01(u) * s;
    const y = clamp(v, 0, 1) * s;

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = x0 + 1;
    const y1 = y0 + 1;
    const xf = x - x0;
    const yf = y - y0;
    const sx = xf * xf * (3 - 2 * xf);
    const sy = yf * yf * (3 - 2 * yf);

    const a = hash(((x0 % s) + s) % s, y0, seed);
    const b = hash(((x1 % s) + s) % s, y0, seed);
    const c = hash(((x0 % s) + s) % s, y1, seed);
    const d = hash(((x1 % s) + s) % s, y1, seed);

    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  }

  function fbm(u, v, seed, octaves = 5) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function ridgeNoise(u, v, seed, octaves = 4) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 4.0;

    for (let i = 0; i < octaves; i += 1) {
      const n = noise(u, v, scale, seed + i * 197);
      total += (1 - Math.abs(n * 2 - 1)) * amp;
      norm += amp;
      amp *= 0.50;
      scale *= PHI;
    }

    return total / Math.max(0.000001, norm);
  }

  function normalize3(x, y, z) {
    const length = Math.hypot(x, y, z) || 1;
    return [x / length, y / length, z / length];
  }

  function rotatedEllipse(lon, lat, item) {
    const dx = wrapPi(lon - item.lon);
    const dy = lat - item.lat;
    const c = Math.cos(item.tilt || 0);
    const s = Math.sin(item.tilt || 0);
    const x = (dx * c + dy * s) / item.rx;
    const y = (-dx * s + dy * c) / item.ry;
    return 1 - x * x - y * y;
  }

  function landmapReady() {
    return Boolean(
      window.AUDRALIA_LANDMAP &&
      window.AUDRALIA_LANDMAP.contract === REQUIRED_LANDMAP &&
      typeof window.AUDRALIA_LANDMAP.sampleLandmap === "function"
    );
  }

  function surfaceFromLandmap(lon, lat) {
    const u = wrap01((wrapPi(lon) + Math.PI) / TAU);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);

    try {
      const map = window.AUDRALIA_LANDMAP.sampleLandmap(u, v);
      if (!map || typeof map !== "object") return null;

      return Object.freeze({
        source: "served-landmap-v2",
        u,
        v,
        lon,
        lat,
        landScore: Number(map.landScore || 0),
        shelf: Number(map.shelf || 0),
        beachEdge: Number(map.beachEdge || map.coastline || 0),
        lakeScore: 0,
        bodyName: String(map.landmassId || map.landmassLabel || "served-landmap"),
        isLake: false,
        isBeach: Boolean(map.isBeach),
        isShelf: Boolean(map.isShelf),
        isOcean: Boolean(map.isOcean),
        isLand: Boolean(map.isLand && !map.isOcean && !map.isShelf && !map.isBeach),
        isPolarIce: Boolean(map.isPolarIce),
        ridge: clamp(Number(map.elevationScore || map.nodalRidge || 0.35), 0, 1),
        detailRidge: clamp(Number(map.nodalRidge || 0.35), 0, 1),
        basin: clamp(Number(map.nodalBasin || 0.35), 0, 1),
        wet: clamp(Number(map.nodalGreenBelt || 0.46), 0, 1)
      });
    } catch (error) {
      document.documentElement.dataset.audraliaRoutefinderLandmapSampleFailed = error instanceof Error ? error.message : String(error);
      return null;
    }
  }

  function fallbackSurface(lonInput, latInput) {
    const lon = wrapPi(lonInput);
    const lat = clamp(latInput, -Math.PI / 2, Math.PI / 2);
    const u = wrap01((lon + Math.PI) / TAU);
    const v = clamp(0.5 - lat / Math.PI, 0, 1);

    const warpedLon = wrapPi(
      lon +
      (fbm(u * 1.1 + 0.07, v * 1.35 - 0.11, 4101, 5) - 0.5) * 0.20 +
      Math.sin(lat * 2.6) * 0.04
    );

    const warpedLat = clamp(
      lat + (fbm(u * 2.05 - 0.19, v * 2.25 + 0.13, 4102, 5) - 0.5) * 0.115,
      -Math.PI / 2,
      Math.PI / 2
    );

    let landScore = -0.42;
    let bodyName = "open-ocean";

    for (const body of LAND_BODIES) {
      const e = rotatedEllipse(warpedLon, warpedLat, body);
      if (e > -0.68) {
        const edgeNoise =
          (fbm(u * 3.2 + body.lon * 0.15, v * 3.6 + body.lat * 0.15, 4201, 5) - 0.5) * 0.46 +
          (fbm(u * 8.6 - body.lat * 0.11, v * 7.8 + body.lon * 0.11, 4202, 4) - 0.5) * 0.18;
        const score = e * body.weight + edgeNoise;
        if (score > landScore) {
          landScore = score;
          bodyName = body.id;
        }
      }
    }

    for (const island of ISLANDS) {
      const e = rotatedEllipse(warpedLon, warpedLat, island);
      if (e > -0.28) {
        const score = e * island.weight + (fbm(u * 9.0 + 0.23, v * 8.5 - 0.31, 4203, 3) - 0.5) * 0.30 - 0.05;
        if (score > landScore) {
          landScore = score;
          bodyName = "island-chain";
        }
      }
    }

    let cutScore = 0;
    for (const cut of OCEAN_CUTS) {
      const e = rotatedEllipse(warpedLon, warpedLat, cut);
      if (e > 0) cutScore = Math.max(cutScore, smoothstep(0, 0.92, e) * cut.weight);
    }

    const riverCorridor =
      Math.abs(Math.sin(warpedLon * 3.55 + Math.sin(warpedLat * 5.1) * 0.86)) < 0.118 &&
      Math.abs(warpedLat) < 0.67
        ? 0.18
        : 0;

    landScore -= cutScore * 0.96;
    landScore -= riverCorridor * smoothstep(-0.14, 0.36, landScore);

    let lakeScore = 0;
    for (const lake of LAKES) {
      const e = rotatedEllipse(warpedLon, warpedLat, lake);
      if (e > 0.12 && landScore > 0.04) lakeScore = Math.max(lakeScore, e);
    }

    const shelf = smoothstep(-0.34, 0.03, landScore);
    const beachEdge = clamp(1 - Math.abs(landScore) / 0.17, 0, 1);
    const isLake = lakeScore > 0.14;
    const isBeach = landScore > 0.018 && landScore <= 0.085 && !isLake;
    const isShelf = landScore <= 0.018 && landScore > -0.34;
    const isOcean = landScore <= -0.34;
    const isLand = landScore > 0.085 && !isLake;
    const isPolarIce = Math.abs(lat * 180 / Math.PI) > 72 && (isLand || isBeach);
    const ridge = ridgeNoise(u * 6.8 + 0.21, v * 4.1 - 0.18, 4301, 5);
    const detailRidge = ridgeNoise(u * 18.0 - 0.27, v * 13.2 + 0.36, 4302, 3);
    const basin = 1 - ridgeNoise(u * 2.4 - 0.11, v * 2.0 + 0.22, 4303, 4);
    const wet = fbm(u * 4.0 + 0.35, v * 3.6 - 0.21, 4304, 4);

    return Object.freeze({
      source: "internal-projection-landmask",
      u,
      v,
      lon,
      lat,
      bodyName,
      landScore,
      shelf,
      beachEdge,
      lakeScore,
      isLake,
      isBeach,
      isShelf,
      isOcean,
      isLand,
      isPolarIce,
      ridge,
      detailRidge,
      basin,
      wet
    });
  }

  function sampleSurface(lon, lat) {
    if (landmapReady()) {
      const served = surfaceFromLandmap(lon, lat);
      if (served) return served;
    }

    return fallbackSurface(lon, lat);
  }

  function colorSurface(surface, now) {
    const u = surface.u;
    const v = surface.v;
    const grain = (fbm(u * 24.0 + 0.05, v * 18.0 - 0.12, 5101, 3) - 0.5) * 18;

    if (surface.isOcean || surface.isShelf || surface.isLake) {
      const depth = fbm(u * 1.25 + 0.27, v * 1.08 - 0.16, 5102, 5);
      const shimmer = Math.sin(u * TAU * 34 + v * 17 + now * 0.0012) * 0.5 + 0.5;

      let color = mix(COLORS.deepOcean, COLORS.ocean, smoothstep(0.18, 0.86, depth));
      if (surface.isShelf) color = mix(color, COLORS.shelf, smoothstep(0.08, 0.88, surface.shelf) * 0.90);
      if (surface.beachEdge > 0.20) color = mix(color, COLORS.lagoon, surface.beachEdge * 0.58);
      if (surface.isLake) color = mix(COLORS.lake, COLORS.lagoon, smoothstep(0.15, 0.88, surface.lakeScore) * 0.52);

      color = shade(color, (fbm(u * 18.0, v * 12.0, 5103, 3) - 0.5) * 12 + shimmer * 5);
      return contrast(color, 1.18, 102);
    }

    if (surface.isBeach) {
      const color = mix(COLORS.beach, COLORS.wetBeach, surface.beachEdge * 0.40);
      return contrast(shade(color, grain * 0.42 + 10), 1.12, 128);
    }

    let color = mix(COLORS.lowland, COLORS.forest, surface.wet * 0.62);
    color = mix(color, COLORS.highland, smoothstep(0.34, 0.82, surface.ridge) * 0.54);

    if (surface.basin > 0.68) color = mix(color, COLORS.wetland, 0.46);
    if (surface.ridge > 0.72) color = mix(color, COLORS.mountain, clamp(surface.ridge * 0.64, 0, 0.68));
    if (surface.detailRidge > 0.82) color = mix(color, COLORS.stone, 0.34);
    if (surface.isPolarIce) color = mix(color, COLORS.snow, 0.78);

    const relief = smoothstep(0.60, 0.96, surface.ridge) * 18 - smoothstep(0.62, 0.96, surface.basin) * 7;
    return contrast(shade(color, grain + relief), 1.22, 116);
  }

  function setText(node, value) {
    if (node) node.textContent = value;
  }

  function loadLandmapIfAvailable() {
    return new Promise((resolve) => {
      if (landmapReady()) {
        resolve(true);
        return;
      }

      const prior = document.querySelector("script[data-audralia-routefinder-landmap-loader='true']");
      if (prior) {
        prior.addEventListener("load", () => resolve(landmapReady()), { once: true });
        prior.addEventListener("error", () => resolve(false), { once: true });
        window.setTimeout(() => resolve(landmapReady()), 900);
        return;
      }

      const script = document.createElement("script");
      script.src = `/assets/audralia/audralia.landmap.js?v=${encodeURIComponent(REQUIRED_LANDMAP)}`;
      script.defer = true;
      script.dataset.audraliaRoutefinderLandmapLoader = "true";
      script.onload = () => resolve(landmapReady());
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
      window.setTimeout(() => resolve(landmapReady()), 1200);
    });
  }

  function publishStatus(phase, centerSurface) {
    const root = document.documentElement;
    root.dataset.audraliaRoutefinderJsExecuted = "true";
    root.dataset.audraliaRoutefinderJsContract = CONTRACT;
    root.dataset.audraliaRoutefinderJsReceipt = RECEIPT;
    root.dataset.audraliaRoutefinderPreviousContract = PREVIOUS_CONTRACT;
    root.dataset.audraliaProjectionSpaceLandmask = "true";
    root.dataset.audraliaTextureSamplingOnly = "false";
    root.dataset.audraliaLandOceanMaskPaintedInProjection = "true";
    root.dataset.audraliaAtmosphereLast = "true";
    root.dataset.audraliaAtmosphereOpacity = "reduced";
    root.dataset.audraliaLandmapV2Consumed = String(landmapReady());
    root.dataset.audraliaFallbackProjectionLandmaskActive = String(!landmapReady());
    root.dataset.audraliaRoutefinderPhase = phase;
    root.dataset.audraliaCenterSurfaceSource = centerSurface.source;
    root.dataset.audraliaCenterSurfaceClass = centerSurface.isLand ? "land" : centerSurface.isBeach ? "beach" : centerSurface.isShelf ? "shelf" : centerSurface.isLake ? "lake" : "ocean";
    root.dataset.audraliaCenterLandScore = String(centerSurface.landScore.toFixed(4));
    root.dataset.generatedImage = "false";
    root.dataset.graphicBox = "false";
    root.dataset.visualPassClaimed = "false";

    setText(proof.html, "HTML loaded · projection landmask lane");
    setText(proof.script, "script loaded · projection landmask cache lane");
    setText(proof.js, `index.js executed · ${landmapReady() ? "landmap-v2-consumer" : "projection-fallback"}`);
    setText(proof.mount, "mount found · canvas mounted");
    setText(proof.notice, "PROJECTION SPACE LANDMASK ACTIVE");
    setText(
      proof.status,
      landmapReady()
        ? "ROUTEFINDER LANDMAP V2 CONSUMED · SURFACE VISIBLE"
        : "ROUTEFINDER PROJECTION FALLBACK ACTIVE · LANDMAP V2 NOT SERVED"
    );
  }

  function appendReceipt(centerSurface) {
    const prior = document.getElementById("audralia-routefinder-projection-space-landmask-receipt");
    if (prior) prior.remove();

    const receipt = document.createElement("template");
    receipt.id = "audralia-routefinder-projection-space-landmask-receipt";
    receipt.setAttribute("data-route-receipt", "");
    receipt.innerHTML = `
${CONTRACT}
receipt=${RECEIPT}
previous=${PREVIOUS_CONTRACT}
route=${ROUTE}
world=${WORLD}
target_file=/showroom/globe/audralia/index.js
mount=#audraliaCanvasMount
executable_body_restored=true
canvas_created=true
draw_loop_created=true
projection_space_landmask=true
texture_sampling_only=false
land_ocean_mask_painted_in_projection=true
served_landmap_contract_required=${REQUIRED_LANDMAP}
landmap_v2_consumed=${landmapReady()}
fallback_projection_landmask_active=${!landmapReady()}
center_surface_source=${centerSurface.source}
center_surface_class=${centerSurface.isLand ? "land" : centerSurface.isBeach ? "beach" : centerSurface.isShelf ? "shelf" : centerSurface.isLake ? "lake" : "ocean"}
center_land_score=${centerSurface.landScore.toFixed(4)}
surface_painted_first=true
lighting_second=true
atmosphere_last=true
atmosphere_opacity=reduced
touch_scope=box_only
generated_image=false
graphic_box=false
visual_pass_claimed=false
`;
    document.body.appendChild(receipt);
  }

  if (!mount) {
    setText(proof.notice, "PROJECTION SPACE LANDMASK HELD · MOUNT MISSING");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  mount.textContent = "";
  mount.dataset.audraliaProjectionSpaceLandmask = CONTRACT;
  mount.dataset.audraliaContract = CONTRACT;
  mount.dataset.generatedImage = "false";
  mount.dataset.graphicBox = "false";
  mount.dataset.visualPassClaimed = "false";

  Object.assign(mount.style, {
    position: "absolute",
    inset: "0",
    overflow: "hidden",
    touchAction: "none",
    userSelect: "none"
  });

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Audralia projection-space land and ocean globe");
  canvas.dataset.audraliaVisibleCanvas = "true";
  canvas.dataset.audraliaGlobe = "projection-space-landmask";
  canvas.dataset.audraliaContract = CONTRACT;
  canvas.dataset.audraliaReceipt = RECEIPT;
  canvas.dataset.generatedImage = "false";
  canvas.dataset.graphicBox = "false";
  canvas.dataset.visualPassClaimed = "false";

  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
    touchAction: "none",
    userSelect: "none",
    cursor: "grab"
  });

  mount.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const sphere = document.createElement("canvas");
  const sphereCtx = sphere.getContext("2d", { alpha: true, willReadFrequently: true });

  if (!ctx || !sphereCtx) {
    setText(proof.notice, "PROJECTION SPACE LANDMASK HELD · CANVAS CONTEXT FAILED");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
    return;
  }

  const state = {
    dpr: 1,
    width: 1,
    height: 1,
    radius: 180,
    cx: 0,
    cy: 0,
    size: 360,
    rotation: -0.86,
    targetRotation: -0.86,
    tilt: -0.08,
    targetTilt: -0.08,
    dragging: false,
    startX: 0,
    startY: 0,
    startRotation: -0.86,
    startTilt: -0.08,
    lastTime: performance.now(),
    lastRender: 0,
    visible: true,
    reducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function resize() {
    const rect = mount.getBoundingClientRect();
    const stageRect = stage ? stage.getBoundingClientRect() : null;
    const width = Math.max(320, Math.floor(rect.width || (stageRect && stageRect.width) || window.innerWidth || 320));
    const height = Math.max(260, Math.floor(rect.height || (stageRect && stageRect.height) || 260));
    const dpr = Math.min(window.devicePixelRatio || 1, 1.45);

    state.dpr = dpr;
    state.width = width;
    state.height = height;

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    state.radius = Math.min(canvas.width, canvas.height) * 0.392;
    state.cx = canvas.width * 0.50;
    state.cy = canvas.height * 0.50;
    state.size = Math.min(560, Math.max(320, Math.floor(state.radius * 2)));

    sphere.width = state.size;
    sphere.height = state.size;
  }

  function drawBackground(now) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createRadialGradient(w * 0.50, h * 0.45, w * 0.05, w * 0.50, h * 0.52, w * 0.78);
    bg.addColorStop(0, "rgba(19,52,66,.96)");
    bg.addColorStop(0.38, "rgba(7,19,36,.98)");
    bg.addColorStop(1, "rgba(1,4,13,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.30;
    for (let i = 0; i < 54; i += 1) {
      const x = hash(i + 17, 3, 7001) * w;
      const y = hash(i + 31, 5, 7002) * h;
      const r = (0.55 + hash(i + 9, 8, 7003) * 1.15) * state.dpr;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fillStyle = "rgba(210,248,230,.13)";
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = "rgba(158,240,191,.24)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.001);
    for (let i = 0; i < 6; i += 1) {
      const y = h * (0.22 + i * 0.09) + Math.sin(now * 0.0002 + i) * 4 * state.dpr;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, y);
      ctx.bezierCurveTo(w * 0.30, y - 18 * state.dpr, w * 0.66, y + 14 * state.dpr, w * 0.92, y - 5 * state.dpr);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSphere(now) {
    const size = state.size;
    const radius = size * 0.5;
    const image = sphereCtx.createImageData(size, size);
    const out = image.data;
    const sinTilt = Math.sin(state.tilt);
    const cosTilt = Math.cos(state.tilt);
    const light = normalize3(-0.34, 0.26, 0.90);

    for (let y = 0; y < size; y += 1) {
      const ny = (y - radius) / radius;

      for (let x = 0; x < size; x += 1) {
        const nx = (x - radius) / radius;
        const d2 = nx * nx + ny * ny;
        const i = (y * size + x) * 4;

        if (d2 > 1) {
          out[i + 3] = 0;
          continue;
        }

        const z = Math.sqrt(1 - d2);
        const y3 = -ny * cosTilt - z * sinTilt;
        const z3 = -ny * sinTilt + z * cosTilt;
        const x3 = nx;

        const lat = Math.asin(clamp(y3, -1, 1));
        const lon = Math.atan2(x3, z3) + state.rotation;
        const normal = normalize3(x3, y3, z3);
        const lightDot = clamp(normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2], -1, 1);
        const surface = sampleSurface(lon, lat);

        let color = colorSurface(surface, now);

        const daylight = 0.78 + Math.max(0, lightDot) * 0.32;
        const terminator = smoothstep(-0.58, 0.02, lightDot);
        const limb = Math.pow(1 - z, 1.95);
        const rim = Math.pow(1 - z, 3.35);

        const cloud =
          smoothstep(0.76, 0.92, fbm(surface.u * 1.6 + now * 0.000018, surface.v * 1.9 - now * 0.000014, 6101, 5)) *
          smoothstep(-0.60, 0.62, lightDot) *
          0.030;

        let r = color[0] * daylight;
        let g = color[1] * daylight;
        let b = color[2] * daylight;

        r = lerp(r * 0.66, r, terminator);
        g = lerp(g * 0.70, g, terminator);
        b = lerp(b * 0.82, b, terminator);

        r = lerp(r, COLORS.cloud[0], cloud);
        g = lerp(g, COLORS.cloud[1], cloud);
        b = lerp(b, COLORS.cloud[2], cloud);

        r = lerp(r, COLORS.atmosphere[0], limb * 0.060);
        g = lerp(g, COLORS.atmosphere[1], limb * 0.052);
        b = lerp(b, COLORS.atmosphere[2], limb * 0.070);

        r = lerp(r, COLORS.rim[0], rim * 0.20);
        g = lerp(g, COLORS.rim[1], rim * 0.16);
        b = lerp(b, COLORS.rim[2], rim * 0.18);

        out[i] = clamp(Math.round(r), 0, 255);
        out[i + 1] = clamp(Math.round(g), 0, 255);
        out[i + 2] = clamp(Math.round(b), 0, 255);
        out[i + 3] = clamp(Math.round(255 * smoothstep(1.005, 0.985, d2)), 0, 255);
      }
    }

    sphereCtx.putImageData(image, 0, 0);
  }

  function drawStageLabel() {
    const dpr = state.dpr;
    const text = landmapReady()
      ? "LANDMAP V2 CONSUMED"
      : "PROJECTION LANDMASK FALLBACK";

    const w = canvas.width;
    const h = canvas.height;
    const boxW = Math.min(w * 0.78, 365 * dpr);
    const boxH = 35 * dpr;
    const x = (w - boxW) * 0.5;
    const y = h - boxH - 18 * dpr;
    const r = boxH * 0.5;

    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.fillStyle = "rgba(5,18,22,.66)";
    ctx.strokeStyle = "rgba(158,240,191,.34)";
    ctx.lineWidth = Math.max(1, dpr);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + boxW, y, x + boxW, y + boxH, r);
    ctx.arcTo(x + boxW, y + boxH, x, y + boxH, r);
    ctx.arcTo(x, y + boxH, x, y, r);
    ctx.arcTo(x, y, x + boxW, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(206,255,228,.94)";
    ctx.font = `900 ${Math.max(10, 11.5 * dpr)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + boxW * 0.5, y + boxH * 0.52, boxW - 34 * dpr);
    ctx.restore();
  }

  function draw(now = performance.now()) {
    drawBackground(now);

    const glow = ctx.createRadialGradient(state.cx, state.cy, state.radius * 0.52, state.cx, state.cy, state.radius * 1.22);
    glow.addColorStop(0, "rgba(158,240,191,.02)");
    glow.addColorStop(0.56, "rgba(141,216,255,.050)");
    glow.addColorStop(0.82, "rgba(158,240,191,.064)");
    glow.addColorStop(1, "rgba(158,240,191,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.22, 0, TAU);
    ctx.fill();

    drawSphere(now);

    const diameter = state.radius * 2;
    ctx.drawImage(sphere, state.cx - state.radius, state.cy - state.radius, diameter, diameter);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.075;
    const spec = ctx.createRadialGradient(
      state.cx - state.radius * 0.25,
      state.cy - state.radius * 0.38,
      0,
      state.cx - state.radius * 0.25,
      state.cy - state.radius * 0.38,
      state.radius * 0.62
    );
    spec.addColorStop(0, "rgba(255,255,255,.42)");
    spec.addColorStop(0.22, "rgba(214,255,235,.10)");
    spec.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.20;
    ctx.strokeStyle = "rgba(158,240,191,.24)";
    ctx.lineWidth = Math.max(1, state.dpr);
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.radius * 1.012, 0, TAU);
    ctx.stroke();
    ctx.restore();

    drawStageLabel();
  }

  function pointerDown(event) {
    state.dragging = true;
    state.startX = event.clientX;
    state.startY = event.clientY;
    state.startRotation = state.targetRotation;
    state.startTilt = state.targetTilt;
    canvas.style.cursor = "grabbing";
    if (event.cancelable) event.preventDefault();
    try { canvas.setPointerCapture(event.pointerId); } catch {}
  }

  function pointerMove(event) {
    if (!state.dragging) return;
    if (event.cancelable) event.preventDefault();

    state.targetRotation = state.startRotation + (event.clientX - state.startX) * 0.010;
    state.targetTilt = clamp(state.startTilt + (event.clientY - state.startY) * 0.004, -0.56, 0.46);
  }

  function pointerUp(event) {
    state.dragging = false;
    canvas.style.cursor = "grab";
    try { canvas.releasePointerCapture(event.pointerId); } catch {}
  }

  function tick(now) {
    const dt = Math.min(64, now - state.lastTime);
    state.lastTime = now;

    if (!state.reducedMotion && !state.dragging) {
      state.targetRotation += dt * 0.000030;
    }

    state.rotation += (state.targetRotation - state.rotation) * 0.16;
    state.tilt += (state.targetTilt - state.tilt) * 0.14;

    if (state.visible && now - state.lastRender > 44) {
      draw(now);
      state.lastRender = now;
    }

    requestAnimationFrame(tick);
  }

  function boot() {
    if (stage) {
      stage.setAttribute("data-loader-state", "mounted");
      stage.dataset.audraliaProjectionSpaceLandmask = CONTRACT;
    }

    const centerSurface = sampleSurface(state.rotation, 0);

    canvas.dataset.audraliaCenterSurfaceClass =
      centerSurface.isLand ? "land" :
      centerSurface.isBeach ? "beach" :
      centerSurface.isShelf ? "shelf" :
      centerSurface.isLake ? "lake" :
      "ocean";

    canvas.dataset.audraliaCenterLandScore = String(centerSurface.landScore.toFixed(4));
    canvas.dataset.audraliaCenterSurfaceSource = centerSurface.source;
    canvas.dataset.audraliaProjectionSpaceLandmask = "true";
    canvas.dataset.audraliaTextureSamplingOnly = "false";

    window.AUDRALIA_ROUTEFINDER = Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      previousContract: PREVIOUS_CONTRACT,
      route: ROUTE,
      world: WORLD,
      getStatus: () => Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        previousContract: PREVIOUS_CONTRACT,
        mounted: true,
        executableBodyRestored: true,
        projectionSpaceLandmask: true,
        textureSamplingOnly: false,
        landOceanMaskPaintedInProjection: true,
        landmapV2Consumed: landmapReady(),
        fallbackProjectionLandmaskActive: !landmapReady(),
        requiredLandmap: REQUIRED_LANDMAP,
        centerSurface,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      })
    });

    window.AUDRALIA_ROUTEFINDER_RECEIPT = window.AUDRALIA_ROUTEFINDER.getStatus();

    publishStatus("projection-space-landmask-ready", centerSurface);
    appendReceipt(centerSurface);
    draw();
    requestAnimationFrame(tick);
  }

  canvas.addEventListener("pointerdown", pointerDown, { passive: false });
  canvas.addEventListener("pointermove", pointerMove, { passive: false });
  canvas.addEventListener("pointerup", pointerUp, { passive: true });
  canvas.addEventListener("pointercancel", pointerUp, { passive: true });
  canvas.addEventListener("lostpointercapture", pointerUp, { passive: true });

  window.addEventListener("resize", () => {
    resize();
    draw();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(canvas);
  }

  try {
    resize();
    draw();
    loadLandmapIfAvailable().then(() => {
      boot();
    });
  } catch (error) {
    document.documentElement.dataset.audraliaProjectionSpaceLandmaskBootError =
      error instanceof Error ? error.message : String(error);
    setText(proof.notice, "PROJECTION SPACE LANDMASK BOOT ERROR");
    if (stage) stage.setAttribute("data-loader-state", "fallback");
  }
})();
