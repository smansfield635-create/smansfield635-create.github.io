// /assets/hearth/hearth.hydrology.js
// HEARTH_HYDROLOGY_PARENT_AUTHORITY_TNT_v1
// New file.
// Parent hydrology authority only.
// Owns inland lakes, rivers, streams, brooks, marshes, swamps, wet basins, fjord water pressure.
// Does not own route, canvas, composition, terrain mass placement, or vegetation topology.
// No generated image. No GraphicBox. No visual-pass claim.

(() => {
  "use strict";

  const CONTRACT = "HEARTH_HYDROLOGY_PARENT_AUTHORITY_TNT_v1";
  const RECEIPT = "HEARTH_HYDROLOGY_PARENT_AUTHORITY_RECEIPT_v1";
  const VERSION = "2026-05-10.hearth-hydrology-parent-authority-v1";

  const DEG = Math.PI / 180;

  const LAKES = Object.freeze([
    { key: "great-lake-a", lat: 43 * DEG, lon: -91 * DEG, rx: 7.4 * DEG, ry: 2.2 * DEG, angle: 8 * DEG, type: "great-lake" },
    { key: "great-lake-b", lat: 47 * DEG, lon: -80 * DEG, rx: 6.2 * DEG, ry: 2.0 * DEG, angle: -18 * DEG, type: "great-lake" },
    { key: "great-lake-c", lat: 39 * DEG, lon: -73 * DEG, rx: 5.2 * DEG, ry: 1.8 * DEG, angle: 18 * DEG, type: "great-lake" },
    { key: "summit-basin-lake", lat: 7 * DEG, lon: -16 * DEG, rx: 5.4 * DEG, ry: 1.7 * DEG, angle: -28 * DEG, type: "inland-lake" },
    { key: "marsh-basin-lake", lat: -18 * DEG, lon: 72 * DEG, rx: 6.0 * DEG, ry: 2.3 * DEG, angle: 14 * DEG, type: "marsh-lake" },
    { key: "glacial-lake-north", lat: 68 * DEG, lon: -13 * DEG, rx: 3.6 * DEG, ry: 1.2 * DEG, angle: -11 * DEG, type: "glacial-lake" },
    { key: "glacial-lake-south", lat: -62 * DEG, lon: 32 * DEG, rx: 4.3 * DEG, ry: 1.3 * DEG, angle: 18 * DEG, type: "glacial-lake" }
  ]);

  const CHANNELS = Object.freeze([
    {
      key: "northwest-great-lakes-river",
      type: "river",
      width: 0.0065,
      points: [[58 * DEG, -118 * DEG], [51 * DEG, -105 * DEG], [45 * DEG, -91 * DEG], [39 * DEG, -78 * DEG], [33 * DEG, -63 * DEG]]
    },
    {
      key: "equatorial-main-river",
      type: "river",
      width: 0.007,
      points: [[19 * DEG, -44 * DEG], [13 * DEG, -31 * DEG], [7 * DEG, -15 * DEG], [2 * DEG, 3 * DEG], [-4 * DEG, 19 * DEG], [-9 * DEG, 36 * DEG]]
    },
    {
      key: "marsh-basin-river",
      type: "river",
      width: 0.006,
      points: [[-3 * DEG, 53 * DEG], [-10 * DEG, 62 * DEG], [-18 * DEG, 72 * DEG], [-25 * DEG, 83 * DEG], [-31 * DEG, 96 * DEG]]
    },
    {
      key: "southwest-ridge-stream",
      type: "stream",
      width: 0.0042,
      points: [[-22 * DEG, -134 * DEG], [-30 * DEG, -127 * DEG], [-38 * DEG, -121 * DEG], [-46 * DEG, -111 * DEG], [-52 * DEG, -98 * DEG]]
    },
    {
      key: "north-crown-glacial-brook",
      type: "brook",
      width: 0.0028,
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
    let best = { value: 0, type: "", key: "" };

    for (const lake of LAKES) {
      const e = ellipseField(lon, lat, lake);
      const rag = (noise(u + lake.rx, v + lake.ry, 38, 60000) - 0.5) * 0.06;
      const value = smoothstep(0.06, 0.22, 1 - e.dist + rag);

      if (value > best.value) {
        best = { value, type: lake.type, key: lake.key };
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

  function channelField(lon, lat) {
    let river = 0;
    let stream = 0;
    let brook = 0;

    for (const channel of CHANNELS) {
      const d = riverDistance(lon, lat, channel.points);
      const value = 1 - smoothstep(channel.width * 0.35, channel.width, d);

      if (channel.type === "river") river = Math.max(river, value);
      if (channel.type === "stream") stream = Math.max(stream, value);
      if (channel.type === "brook") brook = Math.max(brook, value);
    }

    return { river, stream, brook };
  }

  function sampleHydrology(u, v, context = {}) {
    const lon = Number.isFinite(context.lon) ? context.lon : (u - 0.5) * Math.PI * 2;
    const lat = Number.isFinite(context.lat) ? context.lat : (0.5 - v) * Math.PI;
    const isLand = context.isLand === true;
    const basin = clamp(context.basin || 0, 0, 1);
    const coast = clamp(context.coast || 0, 0, 1);
    const lake = isLand ? lakeField(lon, lat, u, v) : { value: 0, type: "", key: "" };
    const channels = isLand ? channelField(lon, lat) : { river: 0, stream: 0, brook: 0 };
    const lowland = smoothstep(0.48, 0.88, noise(u - 0.21, v + 0.17, 34, 61000) + basin * 0.3);
    const channelWet = Math.max(channels.river * 0.72, channels.stream * 0.55, channels.brook * 0.4);

    const marsh = isLand ? clamp((basin * 0.44 + lowland * 0.34 + channelWet * 0.32 + lake.value * 0.24) * smoothstep(0.08, 0.7, context.field || 0.25), 0, 1) : 0;
    const swamp = isLand ? clamp(marsh * smoothstep(0.58, 0.92, lowland + basin * 0.25), 0, 1) : 0;

    return Object.freeze({
      contract: CONTRACT,
      receipt: RECEIPT,
      inlandWater: lake.value,
      lakeType: lake.type,
      lakeKey: lake.key,
      river: channels.river,
      stream: channels.stream,
      brook: channels.brook,
      marsh,
      swamp,
      wetGround: clamp(Math.max(marsh, swamp, channelWet), 0, 1),
      visibleWaterCore: Math.max(lake.value, channels.river, channels.stream * 0.78, channels.brook * 0.55),
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
      version: VERSION,
      authority: "hydrology-parent",
      inlandLakes: true,
      riversStreamsBrooks: true,
      marshSwampWetGround: true,
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
    version: VERSION,
    sampleHydrology,
    getStatus
  });

  window.HEARTH_HYDROLOGY_RECEIPT = getStatus();

  document.documentElement.dataset.hearthHydrologyLoaded = "true";
  document.documentElement.dataset.hearthHydrologyContract = CONTRACT;
  document.documentElement.dataset.hearthHydrologyReceipt = RECEIPT;
  document.documentElement.dataset.hearthHydrologyParentAuthority = "true";
  document.documentElement.dataset.generatedImage = "false";
  document.documentElement.dataset.graphicBox = "false";
  document.documentElement.dataset.visualPassClaimed = "false";
})();
