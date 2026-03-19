import { WORLD_KERNEL } from "./world_kernel.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function rgb(r, g, b) {
  return { r, g, b };
}

function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t
  };
}

function addRgb(a, dr, dg, db) {
  return {
    r: a.r + dr,
    g: a.g + dg,
    b: a.b + db
  };
}

function terrainClass(sample) {
  return typeof sample?.terrainClass === "string" ? sample.terrainClass : "WATER";
}

function isLandSample(sample) {
  if (sample?.landMask === 1) return true;
  if (sample?.waterMask === 1) return false;

  const tc = terrainClass(sample);
  return tc !== "WATER" && tc !== "SHELF";
}

function isShoreline(sample) {
  const tc = terrainClass(sample);
  return tc === "SHORELINE" || tc === "BEACH" || sample?.shoreline === true || sample?.shorelineBand === true;
}

function hashNoise(a, b, c = 0) {
  const v = Math.sin((a * 127.1) + (b * 311.7) + (c * 74.7)) * 43758.5453123;
  return v - Math.floor(v);
}

function signedNoise(a, b, c = 0) {
  return (hashNoise(a, b, c) * 2) - 1;
}

function quantize(value, steps = 64) {
  if (!isFiniteNumber(value) || steps <= 0) return 0;
  return Math.round(value * steps) / steps;
}

function reliefDetail(sample, topology = null) {
  const lat = isFiniteNumber(sample?.latDeg) ? sample.latDeg : 0;
  const lon = isFiniteNumber(sample?.lonDeg) ? sample.lonDeg : 0;
  const land = isLandSample(sample);

  const rawN1 = signedNoise(lat / 7.5, lon / 9.5, 1);
  const rawN2 = signedNoise(lat / 15.0, lon / 19.0, 2);
  const rawN3 = signedNoise(lat / 3.25, lon / 4.1, 3);

  const n1 = land ? quantize(rawN1, 64) : rawN1;
  const n2 = land ? quantize(rawN2, 64) : rawN2;
  const n3 = land ? quantize(rawN3, 64) : rawN3;

  const ridge = clamp(topology?.ridgeAmplified ?? 0, 0, 1);
  const basin = clamp(topology?.basinAmplified ?? 0, 0, 1);
  const summit = clamp(topology?.summitAmplified ?? 0, 0, 1);
  const canyon = clamp(topology?.canyonAmplified ?? 0, 0, 1);
  const coast = clamp(topology?.coastAmplified ?? 0, 0, 1);
  const relief = clamp(topology?.reliefComposite ?? 0, 0, 1);
  const squareMask = clamp(topology?.squareMaskStrength ?? 0, 0, 1);

  const macroRaw = (n1 * 0.5) + (n2 * 0.34);
  const microRaw = n3 * 0.16;

  const macro = land ? quantize(macroRaw, 64) : macroRaw;
  const micro = land ? quantize(microRaw, 64) : microRaw;

  return Object.freeze({
    macro,
    micro,
    ridge,
    basin,
    summit,
    canyon,
    coast,
    relief,
    squareMask
  });
}

function resolveBaseWaterColor(sample) {
  const depth = Math.abs(clamp(sample?.oceanDepthField ?? -0.2, -1, 0));
  let color = rgb(12, 42, 98);

  if (terrainClass(sample) === "SHELF") {
    color = rgb(34, 88, 136);
  } else if (depth > 0.3) {
    color = rgb(4, 18, 46);
  } else if (depth > 0.12) {
    color = rgb(8, 30, 76);
  }

  return isShoreline(sample)
    ? mixRgb(color, rgb(60, 118, 152), 0.18)
    : color;
}

function resolveBaseLandColor(sample) {
  const tc = terrainClass(sample);
  const biome = typeof sample?.biomeType === "string" ? sample.biomeType : "NONE";
  const surface = typeof sample?.surfaceMaterial === "string" ? sample.surfaceMaterial : "NONE";

  let color = rgb(118, 154, 92);

  if (biome === "TROPICAL_RAINFOREST") color = rgb(24, 74, 40);
  else if (biome === "TROPICAL_GRASSLAND") color = rgb(126, 132, 72);
  else if (biome === "TEMPERATE_FOREST") color = rgb(48, 80, 54);
  else if (biome === "TEMPERATE_GRASSLAND") color = rgb(130, 134, 88);
  else if (biome === "DESERT") color = rgb(154, 124, 80);
  else if (biome === "TUNDRA") color = rgb(116, 118, 112);
  else if (biome === "WETLAND") color = rgb(60, 82, 68);
  else if (biome === "BOREAL_FOREST") color = rgb(52, 70, 58);
  else if (biome === "GLACIER") color = rgb(214, 222, 230);

  if (surface === "BEDROCK") color = mixRgb(color, rgb(118, 114, 112), 0.42);
  else if (surface === "GRAVEL") color = mixRgb(color, rgb(134, 126, 112), 0.28);
  else if (surface === "SAND") color = mixRgb(color, rgb(182, 160, 114), 0.34);
  else if (surface === "SILT") color = mixRgb(color, rgb(144, 130, 110), 0.26);
  else if (surface === "CLAY") color = mixRgb(color, rgb(140, 100, 82), 0.32);
  else if (surface === "SOIL") color = mixRgb(color, rgb(92, 74, 56), 0.18);
  else if (surface === "ICE") color = rgb(222, 228, 234);
  else if (surface === "SNOW") color = rgb(244, 246, 250);

  if (tc === "BEACH") color = rgb(188, 166, 118);
  else if (tc === "SHORELINE") color = mixRgb(color, rgb(166, 150, 108), 0.26);
  else if (tc === "BASIN") color = mixRgb(color, rgb(72, 88, 68), 0.38);
  else if (tc === "CANYON") color = mixRgb(color, rgb(144, 88, 68), 0.46);
  else if (tc === "RIDGE") color = mixRgb(color, rgb(112, 106, 98), 0.3);
  else if (tc === "PLATEAU") color = mixRgb(color, rgb(132, 118, 94), 0.28);
  else if (tc === "MOUNTAIN") color = mixRgb(color, rgb(136, 132, 128), 0.52);
  else if (tc === "SUMMIT") color = mixRgb(color, rgb(188, 186, 188), 0.62);
  else if (tc === "GLACIAL_HIGHLAND" || tc === "POLAR_ICE") color = rgb(208, 218, 230);

  return color;
}

function applyTopologyBreakup(color, detail, sample) {
  let out = color;

  if (isLandSample(sample)) {
    out = addRgb(
      out,
      detail.macro * 10 + detail.micro * 6,
      detail.macro * 8 + detail.micro * 4,
      detail.macro * 6 + detail.micro * 3
    );

    if (detail.ridge > 0.04 || detail.summit > 0.04) {
      out = addRgb(
        out,
        (detail.ridge * 18) + (detail.summit * 26),
        (detail.ridge * 15) + (detail.summit * 20),
        (detail.ridge * 12) + (detail.summit * 16)
      );
    }

    if (detail.basin > 0.04 || detail.canyon > 0.04) {
      out = addRgb(
        out,
        -((detail.basin * 26) + (detail.canyon * 16)),
        -((detail.basin * 20) + (detail.canyon * 12)),
        -((detail.basin * 14) + (detail.canyon * 8))
      );
    }

    if (detail.coast > 0.04) {
      out = mixRgb(out, rgb(198, 188, 148), detail.coast * 0.22);
    }

    if (detail.squareMask > 0.05) {
      out = mixRgb(out, rgb(118, 122, 108), detail.squareMask * 0.03);
    }

    if (detail.relief > 0.05) {
      out = mixRgb(out, rgb(154, 148, 138), detail.relief * 0.12);
    }
  } else {
    out = addRgb(
      out,
      detail.macro * 5,
      detail.macro * 7,
      detail.macro * 11
    );
  }

  return out;
}

function applyFacing(color, point, detail) {
  const factor = clamp(
    0.62 +
      point.z * 0.3 +
      detail.relief * 0.16 +
      detail.ridge * 0.12 +
      detail.summit * 0.14 -
      detail.basin * 0.09 -
      detail.canyon * 0.05 +
      detail.macro * 0.07,
    0.44,
    1.34
  );

  return rgb(color.r * factor, color.g * factor, color.b * factor);
}

function resolveFillAlpha(sample, detail) {
  const tc = terrainClass(sample);

  if (!isLandSample(sample)) return tc === "SHELF" ? 0.72 : 0.66;
  if (tc === "SUMMIT" || tc === "MOUNTAIN" || tc === "GLACIAL_HIGHLAND") return clamp(0.88 + detail.relief * 0.08, 0.88, 0.98);
  if (tc === "RIDGE" || tc === "CANYON" || tc === "BASIN") return clamp(0.84 + detail.relief * 0.08, 0.84, 0.94);
  if (tc === "BEACH" || tc === "SHORELINE") return clamp(0.78 + detail.squareMask * 0.08, 0.78, 0.88);
  return clamp(0.74 + detail.relief * 0.1 + detail.squareMask * 0.06, 0.74, 0.92);
}

function resolveFillColor(sample, point, topology = null) {
  const detail = reliefDetail(sample, topology);
  const base = isLandSample(sample)
    ? resolveBaseLandColor(sample)
    : resolveBaseWaterColor(sample);

  const broken = applyTopologyBreakup(base, detail, sample);
  return applyFacing(broken, point, detail);
}

function rgbStringFromResolved(color) {
  return `rgb(${Math.round(clamp(color.r, 0, 255))}, ${Math.round(clamp(color.g, 0, 255))}, ${Math.round(clamp(color.b, 0, 255))})`;
}

export function createTerrainAppearanceEngine() {
  function describeSurface(sample, point, topology = null) {
    const detail = reliefDetail(sample, topology);
    const fillColor = resolveFillColor(sample, point, topology);
    const fillAlpha = resolveFillAlpha(sample, detail);

    return Object.freeze({
      fillColor,
      fillColorString: rgbStringFromResolved(fillColor),
      fillAlpha,
      detail,
      family: isLandSample(sample) ? "LAND" : "WATER",
      terrainClass: terrainClass(sample)
    });
  }

  return Object.freeze({
    describeSurface
  });
}

const DEFAULT_TERRAIN_APPEARANCE_ENGINE = createTerrainAppearanceEngine();

export function describeSurface(sample, point, topology = null) {
  return DEFAULT_TERRAIN_APPEARANCE_ENGINE.describeSurface(sample, point, topology);
}

export {
  terrainClass,
  isLandSample,
  isShoreline,
  reliefDetail,
  resolveBaseLandColor,
  resolveBaseWaterColor
};
