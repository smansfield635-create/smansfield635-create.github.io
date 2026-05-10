// /assets/hearth/hearth.hydrology.js
// HEARTH_NATURAL_HYDROLOGY_PARENT_REFINEMENT_TNT_v2
// Full-file replacement.
// Parent hydrology authority only.
// Purpose:
// - Keep inland lakes, rivers, streams, brooks, marshes, swamps, wet basins, fjord water pressure.
// - Stop rendering rivers/streams/brooks as obvious blue guide-lines.
// - Rivers, streams, and brooks now primarily shape wet-ground corridors, erosion pressure, marsh edges, and basin moisture.
// - Only lakes and strong pooled water return visible water authority.
// No trees. No bushes. No forest canopy. No animal/life topology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_NATURAL_HYDROLOGY_PARENT_REFINEMENT_TNT_v2";
  const RECEIPT = "HEARTH_NATURAL_HYDROLOGY_PARENT_REFINEMENT_RECEIPT_v2";
  const PREVIOUS_CONTRACT = "HEARTH_HYDROLOGY_PARENT_AUTHORITY_TNT_v1";
  const VERSION = "2026-05-10.hearth-natural-hydrology-parent-refinement-v2";

  const DEG = Math.PI / 180;
  const TAU = Math.PI * 2;

  const LAKES = Object.freeze([
    { key: "great-lake-a", lat: 43 * DEG, lon: -91 * DEG, rx: 6.7 * DEG, ry: 1.9 * DEG, angle: 8 * DEG, type: "great-lake", seed: 9101 },
    { key: "great-lake-b", lat: 47 * DEG, lon: -80 * DEG, rx: 5.6 * DEG, ry: 1.75 * DEG, angle: -18 * DEG, type: "great-lake", seed: 9102 },
    { key: "great-lake-c", lat: 39 * DEG, lon: -73 * DEG, rx: 4.8 * DEG, ry: 1.55 * DEG, angle: 18 * DEG, type: "great-lake", seed: 9103 },
    { key: "summit-basin-lake", lat: 7 * DEG, lon: -16 * DEG, rx: 4.5 * DEG, ry: 1.35 * DEG, angle: -28 * DEG, type: "inland-lake", seed: 9104 },
    { key: "marsh-basin-lake", lat: -18 * DEG, lon: 72 * DEG, rx: 5.2 * DEG, ry: 2.0 * DEG, angle: 14 * DEG, type: "marsh-lake", seed: 9105 },
    { key: "glacial-lake-north", lat: 68 * DEG, lon: -13 * DEG, rx: 3.1 * DEG, ry: 1.0 * DEG, angle: -11 * DEG, type: "glacial-lake", seed: 9106 },
    { key: "glacial-lake-south", lat: -62 * DEG, lon: 32 * DEG, rx: 3.8 * DEG, ry: 1.1 * DEG, angle: 18 * DEG, type: "glacial-lake", seed: 9107 }
  ]);

  const CHANNELS = Object.freeze([
    {
      key: "northwest-great-lakes-river",
      type: "river",
      width: 0.0045,
      wetWidth: 0.018,
      points: [[58 * DEG, -118 * DEG], [51 * DEG, -105 * DEG], [45 * DEG, -91 * DEG], [39 * DEG, -78 * DEG], [33 * DEG, -63 * DEG]]
    },
    {
      key: "equatorial-main-river",
      type: "river",
      width: 0.0048,
      wetWidth: 0.019,
      points: [[19 * DEG, -44 * DEG], [13 * DEG, -31 * DEG], [7 * DEG, -15 * DEG], [2 * DEG, 3 * DEG], [-4 * DEG, 19 * DEG], [-9 * DEG, 36 * DEG]]
    },
    {
      key: "marsh-basin-river",
      type: "river",
      width: 0.0042,
      wetWidth: 0.021,
      points: [[-3 * DEG, 53 * DEG], [-10 * DEG, 62 * DEG], [-18 * DEG, 72 * DEG], [-25 * DEG, 83 * DEG], [-31 * DEG, 96 * DEG]]
    },
    {
      key: "southwest-ridge-stream",
      type: "stream",
      width: 0.0028,
      wetWidth: 0.014,
      points: [[-22 * DEG, -134 * DEG], [-30 * DEG, -127 * DEG], [-38 * DEG, -121 * DEG], [-46 * DEG, -111 * DEG], [-52 * DEG, -98 * DEG]]
    },
    {
      key: "southeast-warm-stream",
      type: "stream",
      width: 0.0026,
      wetWidth: 0.013,
      points: [[-8 * DEG, 134 * DEG], [-16 * DEG, 141 * DEG], [-23 * DEG, 149 * DEG], [-31 * DEG, 158 * DEG]]
    },
    {
      key: "north-crown-glacial-brook",
      type: "brook",
      width: 0.0018,
      wetWidth: 0.009,
      points: [[77 * DEG, -32 * DEG], [72 * DEG, -24 * DEG], [68 * DEG, -13 * DEG], [65 * DEG, 1 * DEG]]
    }
  ]);

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * clamp(t, 0, 1);
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function wrap01(value) {
    return ((value % 1) + 1) % 1;
  }

  function wrapPi(value) {
    return Math.atan2(Math.sin(value), Math.cos(value));
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
    const s = Math.max(1, Math.floor(scale));
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

    return lerp(
      lerp(hash(((x0 % s) + s) % s, y0, seed), hash(((x1 % s) + s) % s, y0, seed), sx),
      lerp(hash(((x0 % s) + s) % s, y1, seed), hash(((x1 % s) + s) % s, y1, seed), sx),
      sy
    );
  }

  function fbm(u, v, seed, octaves = 4) {
    let total = 0;
    let norm = 0;
    let amp = 0.58;
    let scale = 3.5;

    for (let i = 0; i < octaves; i += 1) {
      total += noise(u, v, scale, seed + i * 131) * amp;
      norm += amp;
      amp *= 0.52;
      scale *= 2;
    }

    return total / Math.max(0.000001, norm);
  }

  function ellipseField(lon, lat, item) {
    const dx = wrapPi(lon - item.lon) * Math.cos(item.lat);
    const dy = lat - item.lat;
    const ca = Math.cos(item.angle);
    const sa = Math.sin(item.angle);
    const x = dx * ca - dy * sa;
    const y = dx * sa + dy * ca;
    const nx = x / item.rx;
    const ny = y / item.ry;
    const theta = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny);
    return { theta, dist };
  }

  function lakeField(lon, lat, u, v) {
    let best = { value: 0, type: "", key: "", shore: 0 };

    for (const lake of LAKES) {
      const e = ellipseField(lon, lat, lake);
      const ragged = (noise(u + lake.seed * 0.0007, v - lake.seed * 0.0005, 44, lake.seed) - 0.5) * 0.055;
      const raw = 1 - e.dist + ragged;
      const value = smoothstep(0.055, 0.2, raw);
      const shore = 1 - smoothstep(0.0, 0.105, Math.abs(raw));

      if (value > best.value) {
        best = { value, type: lake.type, key: lake.key, shore: clamp(shore, 0, 1) };
      }
    }

    return best;
  }

  function riverDistance(lon, lat, points) {
    let best = 999;

    for (let i = 0; i < points.length - 1; i += 1) {
      const aLat = points[i][0];
      const aLon = points[i][1];
      const bLat = points[i + 1][0];
      const bLon = points[i + 1][1];

      const px = wrapPi(lon - aLon) * Math.cos((lat + aLat) * 0.5);
      const py = lat - aLat;
      const bx = wrapPi(bLon - aLon) * Math.cos((aLat + bLat) * 0.5);
      const by = bLat - aLat;
      const denom = bx * bx + by * by;
      const t = denom > 0 ? clamp((px * bx + py * by) / denom, 0, 1) : 0;
      const dx = px - bx * t;
      const dy = py - by * t;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < best) best = d;
    }

    return best;
  }

  function channelField(lon, lat, u, v) {
    let river = 0;
    let stream = 0;
    let brook = 0;
    let corridor = 0;
    let erosion = 0;

    for (const channel of CHANNELS) {
      const d = riverDistance(lon, lat, channel.points);
      const meanderNoise = 0.86 + noise(u + channel.width * 17, v - channel.wetWidth * 11, 48, 71000) * 0.28;
      const core = 1 - smoothstep(channel.width * 0.16, channel.width * meanderNoise, d);
      const wet = 1 - smoothstep(channel.width, channel.wetWidth * meanderNoise, d);
      const trough = 1 - smoothstep(channel.width * 0.55, channel.wetWidth * 0.7, d);

      if (channel.type === "river") river = Math.max(river, core);
      if (channel.type === "stream") stream = Math.max(stream, core);
      if (channel.type === "brook") brook = Math.max(brook, core);

      corridor = Math.max(corridor, wet);
      erosion = Math.max(erosion, trough);
    }

    return {
      river: clamp(river, 0, 1),
      stream: clamp(stream, 0, 1),
      brook: clamp(brook, 0, 1),
      corridor: clamp(corridor, 0, 1),
      erosion: clamp(erosion, 0, 1)
    };
  }

  function sampleHydrology(u, v, context = {}) {
    const lon = Number.isFinite(context.lon) ? context.lon : (u - 0.5) * TAU;
    const lat = Number.isFinite(context.lat) ? context.lat : (0.5 - v) * Math.PI;
    const isLand = context.isLand === true;

    if (!isLand) {
      return Object.freeze({
        contract: CONTRACT,
        receipt: RECEIPT,
        inlandWater: 0,
        lakeType: "",
        lakeKey: "",
        lakeShore: 0,
        river: 0,
        stream: 0,
        brook: 0,
        channelCorridor: 0,
        erosionCorridor: 0,
        marsh: 0,
        swamp: 0,
        wetGround: 0,
        visibleWaterCore: 0,
        visibleBlueLineSuppressed: true,
        ownsRoute: false,
        ownsCanvas: false,
        ownsComposition: false,
        ownsVegetation: false,
        generatedImage: false,
        graphicBox: false,
        visualPassClaimed: false
      });
    }

    const field = clamp(context.field || 0, 0, 1);
    const basin = clamp(context.basin || 0, 0, 1);
    const coast = clamp(context.coast || 0, 0, 1);
    const mountain = clamp(context.mountain || 0, 0, 1);

    const lake = lakeField(lon, lat, u, v);
    const channels = channelField(lon, lat, u, v);

    const lowland = smoothstep(
      0.45,
      0.88,
      noise(u - 0.21, v + 0.17, 34, 61000) * 0.7 +
        noise(u + 0.19, v - 0.23, 18, 61100) * 0.3 +
        basin * 0.32 -
        mountain * 0.15
    );

    const shoreWetness = lake.shore * 0.28 + coast * 0.08;
    const channelWetness = channels.corridor * 0.34 + channels.erosion * 0.22;
    const pooledWater = lake.value;

    const marsh = clamp(
      (basin * 0.38 + lowland * 0.3 + channelWetness + shoreWetness + pooledWater * 0.24) *
        smoothstep(0.05, 0.62, field),
      0,
      1
    );

    const swamp = clamp(
      marsh *
        smoothstep(0.58, 0.94, lowland + basin * 0.28 + pooledWater * 0.18) *
        smoothstep(0.0, 0.8, 1 - mountain),
      0,
      1
    );

    const visibleWaterCore = clamp(
      lake.value * 0.98 +
        Math.max(channels.river * 0.18, channels.stream * 0.1, channels.brook * 0.05),
      0,
      1
    );

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      inlandWater: lake.value,
      lakeType: lake.type,
      lakeKey: lake.key,
      lakeShore: lake.shore,
      river: channels.river,
      stream: channels.stream,
      brook: channels.brook,
      channelCorridor: channels.corridor,
      erosionCorridor: channels.erosion,
      marsh,
      swamp,
      wetGround: clamp(Math.max(marsh, swamp, channelWetness, shoreWetness), 0, 1),
      visibleWaterCore,
      visibleBlueLineSuppressed: true,
      ownsRoute: false,
      ownsCanvas: false,
      ownsComposition: false,
      ownsVegetation: false,
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
      authority: "hydrology-parent",
      inlandLakes: true,
      riversStreamsBrooks: true,
      marshSwampWetGround: true,
      visibleBlueLineSuppressed: true,
      riversShapeWetGroundNotGuideLines: true,
      ownsRoute: false,
      ownsCanvas: false,
      ownsComposition: false,
      ownsVegetation: false,
      generatedImage: false,
      graphicBox: false,
      visualPassClaimed: false
    });
  }

  window.HEARTH_HYDROLOGY = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    sampleHydrology,
    getStatus
  });

  window.HEARTH_HYDROLOGY_RECEIPT = getStatus();

  document.documentElement.dataset.hearthHydrologyLoaded = "true";
  document.documentElement.dataset.hearthHydrologyContract = CONTRACT;
  document.documentElement.dataset.hearthHydrologyReceipt = RECEIPT;
  document.documentElement.dataset.hearthHydrologyParentAuthority = "true";
  document.documentElement.dataset.hearthVisibleBlueLineSuppressed = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
