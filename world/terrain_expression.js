function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function applyFacing(color, point) {
  const factor = clamp(0.72 + point.z * 0.24, 0.56, 1.08);
  return rgb(color.r * factor, color.g * factor, color.b * factor);
}

function biomeBase(sample) {
  switch (sample?.biomeType) {
    case "TROPICAL_RAINFOREST": return rgb(32, 84, 48);
    case "TROPICAL_GRASSLAND": return rgb(124, 134, 74);
    case "TEMPERATE_FOREST": return rgb(58, 86, 60);
    case "TEMPERATE_GRASSLAND": return rgb(136, 140, 92);
    case "DESERT": return rgb(156, 126, 86);
    case "TUNDRA": return rgb(118, 120, 114);
    case "BOREAL_FOREST": return rgb(56, 72, 60);
    case "GLACIER": return rgb(214, 222, 232);
    default: return rgb(112, 118, 88);
  }
}

function surfaceTint(sample, color) {
  switch (sample?.surfaceMaterial) {
    case "BEDROCK": return mixRgb(color, rgb(122, 118, 116), 0.44);
    case "GRAVEL": return mixRgb(color, rgb(136, 128, 114), 0.30);
    case "SAND": return mixRgb(color, rgb(188, 166, 116), 0.36);
    case "SILT": return mixRgb(color, rgb(150, 134, 112), 0.26);
    case "CLAY": return mixRgb(color, rgb(144, 104, 84), 0.34);
    case "SOIL": return mixRgb(color, rgb(96, 78, 58), 0.18);
    case "ICE": return rgb(224, 230, 236);
    case "SNOW": return rgb(242, 246, 250);
    default: return color;
  }
}

function seasonalTint(sample, color) {
  const season = sample?.hemisphereSeason;
  const freeze = clamp(sample?.freezePotential ?? 0, 0, 1);
  const rainfall = clamp(sample?.rainfall ?? 0, 0, 1);
  const continentality = clamp(sample?.continentality ?? 0, 0, 1);

  if (season === "SUMMER") {
    color = mixRgb(color, rgb(170, 154, 88), continentality * 0.10);
    color = mixRgb(color, rgb(76, 112, 64), rainfall * 0.10);
  } else if (season === "SPRING") {
    color = mixRgb(color, rgb(112, 142, 84), rainfall * 0.08);
  } else if (season === "AUTUMN") {
    color = mixRgb(color, rgb(164, 112, 70), 0.10 + continentality * 0.08);
  } else if (season === "WINTER") {
    color = mixRgb(color, rgb(204, 210, 220), freeze * 0.24);
  }

  return color;
}

function oceanColor(sample, resolved) {
  const depth = Math.abs(clamp(sample?.oceanDepthField ?? 0, -1, 0));
  let color = rgb(12, 42, 98);

  if (sample?.terrainClass === "SHELF") {
    color = rgb(36, 92, 138);
  } else if (depth > 0.52) {
    color = rgb(3, 14, 36);
  } else if (depth > 0.24) {
    color = rgb(7, 26, 68);
  }

  if (sample?.climateBandField === "POLAR" || sample?.climateBandField === "SUBPOLAR") {
    color = mixRgb(color, rgb(134, 170, 198), clamp(sample?.freezePotential ?? 0, 0, 1) * 0.30);
  }

  if (resolved.shoreline) {
    color = mixRgb(color, rgb(62, 120, 154), resolved.coastEmphasis * 0.32);
  }

  return color;
}

function landColor(sample, resolved) {
  const profile = resolved.profile;
  let color = biomeBase(sample);

  color = surfaceTint(sample, color);
  color = seasonalTint(sample, color);

  const tierDryness = clamp(profile.traversalDifficulty * 0.10, 0, 0.10);
  const tierStone = clamp(profile.reliefAmp * 0.22 + resolved.ridgeEmphasis * 0.18, 0, 0.36);
  const tierWorn = clamp(profile.erosionStrength * 0.20, 0, 0.20);

  color = mixRgb(color, rgb(170, 146, 110), tierDryness);
  color = mixRgb(color, rgb(132, 126, 122), tierStone);
  color = mixRgb(color, rgb(118, 124, 106), tierWorn);

  if (resolved.terrainBand === "COAST") {
    color = mixRgb(color, rgb(190, 168, 118), resolved.coastEmphasis * 0.70);
  } else if (resolved.terrainBand === "BASIN") {
    color = mixRgb(color, rgb(78, 90, 72), resolved.basinEmphasis * 0.55);
  } else if (resolved.terrainBand === "UPLAND") {
    color = mixRgb(color, rgb(122, 118, 112), resolved.ridgeEmphasis * 0.32);
  } else if (resolved.terrainBand === "PEAK") {
    color = mixRgb(color, rgb(188, 188, 192), 0.44 + resolved.ridgeEmphasis * 0.28);
  }

  color = mixRgb(color, rgb(196, 214, 232), clamp(sample?.tectonicMemory ?? 0, 0, 1) * 0.08);

  return color;
}

export function resolveElevationOffsetPx(sample, resolved) {
  const elevation = clamp(sample?.elevation ?? 0, -1, 1);
  const scale = resolved?.elevationOffsetScale ?? 0.32;
  return elevation * 11 * scale;
}

export function resolveFillColor(sample, resolved, point) {
  const base = resolved.kind === "WATER"
    ? oceanColor(sample, resolved)
    : landColor(sample, resolved);

  return applyFacing(base, point);
}

export function resolveFillAlpha(sample, resolved) {
  if (resolved.kind === "WATER") {
    return sample?.terrainClass === "SHELF" ? 0.70 : 0.64;
  }

  const base = resolved.opacityWeight ?? 0.76;
  const activationLift = resolved.activationWeight * 0.05;
  const cryoLift = resolved.cryosphere ? 0.04 : 0;

  return clamp(base + activationLift + cryoLift, 0.68, 0.92);
}

export function rgbString(color) {
  return `rgb(${Math.round(clamp(color.r, 0, 255))}, ${Math.round(clamp(color.g, 0, 255))}, ${Math.round(clamp(color.b, 0, 255))})`;
}
