// /assets/world/environment/hexfield.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_HEXFIELD_SUBSTRATE_TNT_v1
// Owns: live 256×256 hex-addressable substrate for reusable planetary ground environments.

import { clamp, hash01 } from "/assets/world/environment/profile.js";

export const ENVIRONMENT_HEXFIELD_VERSION = "reusable-planetary-hexfield-substrate-v1";
export const DEFAULT_HEX_SCALE = 256;

export function createHexField(profile, cell = {}, options = {}) {
  const scale = profile?.system?.coordinateScale || options.scale || DEFAULT_HEX_SCALE;
  const seed = profile?.planet?.seed || cell?.seed || 1;
  const camera = profile.camera || {};
  const terrain = profile.terrain || {};
  const water = profile.water || {};
  const foliage = profile.foliage || {};
  const climate = profile.climate || {};
  const structure = profile.structure || {};

  const horizon = camera.horizon ?? 0.35;
  const shoreline = camera.shoreline ?? 0.588;
  const groundStart = camera.groundStart ?? 0.558;

  function address(nx, ny) {
    const x = clamp(Math.round(nx * (scale - 1)), 0, scale - 1);
    const y = clamp(Math.round(ny * (scale - 1)), 0, scale - 1);

    return Object.freeze({
      x,
      y,
      q: x - Math.floor(y / 2),
      r: y,
      parity: y & 1,
      id: `${x}:${y}`
    });
  }

  function hexNoise(addr, salt = 0) {
    const coarse = hash01(Math.floor(addr.x / 4), Math.floor(addr.y / 4), salt, seed);
    const medium = hash01(Math.floor(addr.x / 2), Math.floor(addr.y / 2), salt + 17, seed);
    const fine = hash01(addr.x, addr.y, salt + 31, seed);

    return coarse * 0.48 + medium * 0.34 + fine * 0.18;
  }

  function sample(nx, ny, time = 0) {
    const x = clamp(nx, 0, 1);
    const y = clamp(ny, 0, 1);
    const addr = address(x, y);

    const macro = hexNoise(addr, 1);
    const grain = hexNoise(addr, 2);
    const fracture = hexNoise(addr, 3);
    const moistureNoise = hexNoise(addr, 4);
    const lifeNoise = hexNoise(addr, 5);
    const rockNoise = hexNoise(addr, 6);
    const pathNoise = hexNoise(addr, 7);
    const cloudNoise = hexNoise(addr, 8);
    const shimmerNoise = hexNoise(addr, 9);

    const waterBand = clamp((y - horizon) / Math.max(0.001, shoreline - horizon), 0, 1);
    const isWaterZone = y >= horizon && y <= shoreline + 0.018;
    const distanceToShore = Math.abs(y - shoreline);

    const shorePressure = clamp(1 - distanceToShore / 0.055, 0, 1);
    const waterPressure = isWaterZone ? clamp(1 - Math.abs(waterBand - 0.52) * 1.18, 0, 1) : 0;
    const waterDepth = isWaterZone ? clamp(waterBand * (water.depth ?? 0.8) + macro * 0.18, 0, 1) : 0;

    const groundPressure = clamp((y - groundStart) / Math.max(0.001, 1 - groundStart), 0, 1);
    const elevation = clamp(0.30 + groundPressure * 0.52 + (terrain.shelf ?? 0.8) * 0.18 + macro * 0.10, 0, 1);

    const pathCenter =
      0.50 +
      Math.sin((y - 0.64) * 5.2) * 0.020 -
      clamp((y - 0.70) * 0.42, 0, 0.20);

    const pathWidth = 0.040 + groundPressure * 0.145;
    const pathPressure = groundPressure * clamp(1 - Math.abs(x - pathCenter) / pathWidth, 0, 1) * (terrain.pathStrength ?? 0.72);

    const rockPressure =
      groundPressure *
      clamp((terrain.rockDensity ?? 0.66) * (0.35 + rockNoise * 0.86) - pathPressure * 0.18, 0, 1);

    const foliagePressure =
      groundPressure *
      clamp((foliage.density ?? 0.72) * (0.40 + lifeNoise * 0.78) - pathPressure * 0.42 + shorePressure * 0.08, 0, 1);

    const flowerPressure =
      foliagePressure *
      clamp((foliage.wildflowers ?? 0.5) * (lifeNoise * 0.85 + grain * 0.30), 0, 1);

    const structureDx = Math.abs(x - (structure.x ?? 0.5));
    const structureDy = Math.abs(y - (structure.baseY ?? 0.615));
    const structurePressure = clamp(
      1 - Math.max(structureDx / Math.max(0.001, (structure.width ?? 0.405) * 0.54), structureDy / Math.max(0.001, (structure.height ?? 0.205) * 0.46)),
      0,
      1
    );

    const windPhase = Math.sin(time * 0.75 + addr.q * 0.19 + addr.r * 0.09);
    const wavePhase = Math.sin(time * 0.84 + addr.q * 0.23 + addr.r * 0.11);
    const tidePhase = Math.sin(time * 0.18 + macro * Math.PI * 2);
    const shimmerPulse = Math.max(0, Math.sin(time * 1.25 + shimmerNoise * Math.PI * 2));

    return Object.freeze({
      nx: x,
      ny: y,
      address: addr,
      macro,
      grain,
      fracture,
      moistureNoise,
      lifeNoise,
      rockNoise,
      pathNoise,
      cloudNoise,
      shimmerNoise,
      horizon,
      shoreline,
      groundStart,
      waterBand,
      waterPressure,
      waterDepth,
      shorePressure,
      groundPressure,
      elevation,
      pathCenter,
      pathWidth,
      pathPressure,
      rockPressure,
      foliagePressure,
      flowerPressure,
      structurePressure,
      wind: windPhase * (climate.wind ?? 0.58),
      wave: wavePhase * (water.waveStrength ?? 0.62),
      tide: tidePhase * (water.tide ?? 0.42),
      shimmer: waterPressure * (water.shimmer ?? 0.88) * (0.25 + shimmerPulse * 0.75)
    });
  }

  function lineSamples(y, count, time = 0) {
    return Array.from({ length: count }, (_, i) => sample(i / Math.max(1, count - 1), y, time));
  }

  return Object.freeze({
    version: ENVIRONMENT_HEXFIELD_VERSION,
    scale,
    seed,
    address,
    sample,
    lineSamples,
    status() {
      return Object.freeze({
        version: ENVIRONMENT_HEXFIELD_VERSION,
        scale,
        seed,
        coordinate: cell.coordinate || profile.region?.activeCell || { x: 128, y: 128 },
        live: true
      });
    }
  });
}
