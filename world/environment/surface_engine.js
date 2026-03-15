function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function normalizeLonDeg(lonDeg) {
  let value = lonDeg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function fract(value) {
  return value - Math.floor(value);
}

function hash2(x, y) {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function valueNoise(x, y) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const sx = x - x0;
  const sy = y - y0;

  const n00 = hash2(x0, y0);
  const n10 = hash2(x1, y0);
  const n01 = hash2(x0, y1);
  const n11 = hash2(x1, y1);

  const ix0 = lerp(n00, n10, sx);
  const ix1 = lerp(n01, n11, sx);
  return lerp(ix0, ix1, sy);
}

function fbm(x, y) {
  let total = 0;
  let amplitude = 0.5;
  let frequency = 1.0;
  let amplitudeSum = 0;

  for (let i = 0; i < 4; i += 1) {
    total += valueNoise(x * frequency, y * frequency) * amplitude;
    amplitudeSum += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }

  return amplitudeSum > 0 ? total / amplitudeSum : 0;
}

function rgba(r, g, b, a) {
  return `rgba(${r},${g},${b},${clamp(a, 0, 1).toFixed(3)})`;
}

const SEA_LEVEL = 0.06;
const SHORELINE_HALF_BAND = 0.07;

const CONTINENTS = Object.freeze([
  Object.freeze({
    id: "harbor",
    centerLat: 0,
    centerLon: 0,
    radiusDeg: 45,
    fill: "#8fcb63",
    edge: "#dff3b3",
    highlight: "rgba(255,255,255,0.10)",
    roughness: 9.5,
    elongationX: 1.18,
    elongationY: 0.90,
    mass: 1.0
  }),
  Object.freeze({
    id: "gratitude",
    centerLat: 35,
    centerLon: 60,
    radiusDeg: 28,
    fill: "#81c35e",
    edge: "#d7ebb0",
    highlight: "rgba(255,255,255,0.09)",
    roughness: 7.0,
    elongationX: 1.05,
    elongationY: 0.94,
    mass: 0.78
  }),
  Object.freeze({
    id: "generosity",
    centerLat: 35,
    centerLon: -60,
    radiusDeg: 28,
    fill: "#87ca68",
    edge: "#dcf1b6",
    highlight: "rgba(255,255,255,0.09)",
    roughness: 7.0,
    elongationX: 1.08,
    elongationY: 0.92,
    mass: 0.78
  }),
  Object.freeze({
    id: "northland",
    centerLat: 60,
    centerLon: 120,
    radiusDeg: 25,
    fill: "#96d170",
    edge: "#e2f3be",
    highlight: "rgba(255,255,255,0.08)",
    roughness: 6.2,
    elongationX: 0.96,
    elongationY: 1.08,
    mass: 0.72
  }),
  Object.freeze({
    id: "eastreach",
    centerLat: 10,
    centerLon: 150,
    radiusDeg: 22,
    fill: "#7abd58",
    edge: "#d3e8aa",
    highlight: "rgba(255,255,255,0.08)",
    roughness: 5.8,
    elongationX: 1.12,
    elongationY: 0.88,
    mass: 0.68
  }),
  Object.freeze({
    id: "southfields",
    centerLat: -45,
    centerLon: -90,
    radiusDeg: 24,
    fill: "#81c661",
    edge: "#d8edb2",
    highlight: "rgba(255,255,255,0.08)",
    roughness: 6.0,
    elongationX: 1.0,
    elongationY: 0.98,
    mass: 0.7
  }),
  Object.freeze({
    id: "westwilds",
    centerLat: -10,
    centerLon: -150,
    radiusDeg: 24,
    fill: "#8bce69",
    edge: "#def2b7",
    highlight: "rgba(255,255,255,0.08)",
    roughness: 6.4,
    elongationX: 1.06,
    elongationY: 0.93,
    mass: 0.7
  })
]);

function getContinentById(id) {
  return CONTINENTS.find((continent) => continent.id === id) ?? null;
}

function getLandColor(continentId) {
  return getContinentById(continentId)?.fill ?? "#8fcb63";
}

function getLandEdgeColor(continentId) {
  return getContinentById(continentId)?.edge ?? "#dff3b3";
}

function getLandHighlight(continentId) {
  return getContinentById(continentId)?.highlight ?? "rgba(255,255,255,0.08)";
}

function getContinentInfluence(continent, latDeg, lonDeg) {
  const normalizedLon = normalizeLonDeg(lonDeg);
  const dLat = latDeg - continent.centerLat;
  const dLonRaw = normalizeLonDeg(normalizedLon - continent.centerLon);

  const dLatScaled = dLat / continent.elongationY;
  const dLonScaled = dLonRaw / continent.elongationX;
  const baseDistance = Math.sqrt(dLatScaled * dLatScaled + dLonScaled * dLonScaled);

  const n1 = fbm(
    (latDeg + 90 + continent.centerLat * 0.7) * 0.08,
    (normalizedLon + 180 + continent.centerLon * 0.7) * 0.08
  );
  const n2 = fbm(
    (latDeg + 90 + continent.centerLat * 1.1) * 0.17,
    (normalizedLon + 180 + continent.centerLon * 1.1) * 0.17
  );
  const n3 = valueNoise(
    (latDeg + 90 + continent.centerLat * 0.4) * 0.32,
    (normalizedLon + 180 + continent.centerLon * 0.4) * 0.32
  );

  const coastlineOffset =
    (n1 - 0.5) * continent.roughness +
    (n2 - 0.5) * (continent.roughness * 0.46) +
    (n3 - 0.5) * (continent.roughness * 0.22);

  const inletBias =
    Math.sin(toRad(dLonRaw * 2.3)) *
    Math.cos(toRad(dLat * 1.7)) *
    1.4;

  const effectiveRadius = continent.radiusDeg + coastlineOffset + inletBias;
  const signedDistance = effectiveRadius - baseDistance;
  const normalizedMass = clamp(
    signedDistance / Math.max(6, continent.radiusDeg * 0.18),
    -1,
    1
  );

  return Object.freeze({
    signedDistance,
    effectiveRadius,
    baseDistance,
    normalizedMass
  });
}

function getElevationAndContinent(latDeg, lonDeg) {
  const normalizedLon = normalizeLonDeg(lonDeg);

  let winningContinent = null;
  let winningInfluence = null;
  let winningDistance = -Infinity;

  for (const continent of CONTINENTS) {
    const influence = getContinentInfluence(continent, latDeg, normalizedLon);

    if (influence.signedDistance > winningDistance) {
      winningContinent = continent;
      winningInfluence = influence;
      winningDistance = influence.signedDistance;
    }
  }

  const broadNoise = fbm(
    (latDeg + 90 + 41.0) * 0.06,
    (normalizedLon + 180 + 17.0) * 0.06
  );
  const mediumNoise = fbm(
    (latDeg + 90 + 13.0) * 0.15,
    (normalizedLon + 180 + 29.0) * 0.15
  );
  const fineNoise = valueNoise(
    (latDeg + 90 + 7.0) * 0.34,
    (normalizedLon + 180 + 11.0) * 0.34
  );

  const oceanBase =
    -0.34 +
    (broadNoise - 0.5) * 0.08 +
    (mediumNoise - 0.5) * 0.05;

  let elevation = oceanBase;
  let continentId = null;

  if (winningContinent && winningInfluence) {
    const crust =
      winningInfluence.normalizedMass * 0.26 * winningContinent.mass +
      Math.max(0, winningInfluence.signedDistance) * 0.012 * winningContinent.mass;

    const relief =
      (mediumNoise - 0.5) * 0.08 +
      (fineNoise - 0.5) * 0.04;

    elevation = oceanBase + crust + relief;
    continentId = winningContinent.id;
  }

  const terrain = elevation >= SEA_LEVEL ? "LAND" : "OCEAN";
  const shoreline = 1 - smoothstep(0, SHORELINE_HALF_BAND, Math.abs(elevation - SEA_LEVEL));

  return Object.freeze({
    elevation,
    seaLevel: SEA_LEVEL,
    terrain,
    shoreline,
    continentId
  });
}

function getLandRadiusOffsetPx(baseRadius, sample) {
  const emergentHeight = clamp((sample.elevation - sample.seaLevel) / 0.24, 0, 1);
  return baseRadius * (0.008 + emergentHeight * 0.02);
}

function buildTopologyLookup(topologyField) {
  if (!topologyField || !Array.isArray(topologyField.samples)) {
    return new Map();
  }

  const map = new Map();

  for (const sample of topologyField.samples) {
    const latDeg = Number.isFinite(sample?.latDeg) ? sample.latDeg : null;
    const lonDeg = Number.isFinite(sample?.lonDeg) ? normalizeLonDeg(sample.lonDeg) : null;

    if (latDeg === null || lonDeg === null) continue;
    map.set(`${latDeg}:${lonDeg}`, sample);
  }

  return map;
}

function getTopologySample(topologyLookup, terrainSample) {
  if (!topologyLookup || !terrainSample) return null;
  return topologyLookup.get(`${terrainSample.latDeg}:${normalizeLonDeg(terrainSample.lonDeg)}`) ?? null;
}

function getTerrainPalette(sample, topologySample) {
  const shoreline = clamp(sample?.shoreline ?? 0, 0, 1);
  const terrainClass = topologySample?.terrainClass ?? "plain";
  const continentId = sample?.continentId ?? null;
  const baseColor = getLandColor(continentId);
  const edgeColor = getLandEdgeColor(continentId);
  const highlightColor = getLandHighlight(continentId);

  let fill = baseColor;
  let shadowRGB = Object.freeze([0, 0, 0]);
  let ridgeRGB = Object.freeze([255, 255, 255]);
  let canyonRGB = Object.freeze([84, 58, 34]);
  let line = edgeColor;

  switch (terrainClass) {
    case "peak":
      fill = "#cdd0c7";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([120, 102, 86]);
      line = rgba(240, 242, 236, 0.30);
      break;
    case "mountain":
      fill = "#9dad78";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([92, 72, 48]);
      line = rgba(226, 238, 204, 0.22);
      break;
    case "plateau":
      fill = "#99b26e";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([90, 72, 48]);
      line = rgba(220, 236, 196, 0.18);
      break;
    case "cliff":
      fill = "#8ea567";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([84, 62, 38]);
      line = rgba(214, 230, 186, 0.16);
      break;
    case "canyon":
      fill = "#88a160";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([80, 52, 28]);
      line = rgba(204, 224, 176, 0.14);
      break;
    case "valley":
      fill = "#83b25e";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([90, 68, 40]);
      line = rgba(216, 236, 188, 0.16);
      break;
    case "basin":
      fill = "#79aa57";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([84, 64, 36]);
      line = rgba(206, 226, 178, 0.15);
      break;
    case "ridge":
      fill = "#92b868";
      shadowRGB = Object.freeze([0, 0, 0]);
      ridgeRGB = Object.freeze([255, 255, 255]);
      canyonRGB = Object.freeze([88, 66, 40]);
      line = rgba(220, 236, 192, 0.18);
      break;
    default:
      break;
  }

  if (shoreline > 0.14) {
    line = rgba(225, 245, 200, 0.08 + shoreline * 0.16);
  }

  return Object.freeze({
    fill,
    shadowRGB,
    ridgeRGB,
    canyonRGB,
    line,
    highlightColor
  });
}

function getTerrainShape(sample, topologySample, radius) {
  const emergentHeight = clamp((sample.elevation - sample.seaLevel) / 0.24, 0, 1);
  const slope = clamp(topologySample?.slope ?? 0, 0, 1);
  const ridgeStrength = clamp(topologySample?.ridgeStrength ?? 0, 0, 1);
  const basinStrength = clamp(topologySample?.basinStrength ?? 0, 0, 1);
  const mountainMask = clamp(topologySample?.mountainMask ?? 0, 0, 1);
  const cliffMask = clamp(topologySample?.cliffMask ?? 0, 0, 1);
  const valleyMask = clamp(topologySample?.valleyMask ?? 0, 0, 1);
  const canyonMask = clamp(topologySample?.canyonMask ?? 0, 0, 1);
  const plateauMask = clamp(topologySample?.plateauMask ?? 0, 0, 1);

  const bodyRadius =
    radius *
    (
      0.014 +
      emergentHeight * 0.016 +
      mountainMask * 0.010 +
      plateauMask * 0.004 -
      basinStrength * 0.003
    );

  const stretchX =
    1.06 +
    ridgeStrength * 0.22 +
    plateauMask * 0.10 -
    canyonMask * 0.06;

  const stretchY =
    0.94 +
    mountainMask * 0.18 +
    cliffMask * 0.10 +
    valleyMask * 0.06;

  const shadowAlpha = clamp(
    0.06 +
      slope * 0.11 +
      cliffMask * 0.08 +
      canyonMask * 0.06,
    0,
    0.30
  );

  const highlightAlpha = clamp(
    0.04 +
      ridgeStrength * 0.10 +
      mountainMask * 0.14 +
      plateauMask * 0.06,
    0,
    0.28
  );

  const lowlandAlpha = clamp(
    basinStrength * 0.10 + valleyMask * 0.06,
    0,
    0.20
  );

  return Object.freeze({
    bodyRadius,
    stretchX,
    stretchY,
    shadowAlpha,
    highlightAlpha,
    lowlandAlpha,
    cliffMask,
    canyonMask,
    valleyMask,
    ridgeStrength,
    plateauMask
  });
}

export function createSurfaceEngine() {
  function continentMask(latDeg, lonDeg) {
    return getElevationAndContinent(latDeg, lonDeg).continentId;
  }

  function buildTerrainField(projector) {
    const samples = [];
    const latStep = 3;
    const lonStep = 3;

    for (let latDeg = -84; latDeg <= 84; latDeg += latStep) {
      for (let lonDeg = -180; lonDeg < 180; lonDeg += lonStep) {
        const normalizedLon = normalizeLonDeg(lonDeg);
        const terrainResult = getElevationAndContinent(latDeg, normalizedLon);

        let radialOffsetPx = 0;
        if (terrainResult.terrain === "LAND") {
          radialOffsetPx = getLandRadiusOffsetPx(projector.state.radius, terrainResult);
        }

        const projected = projector.projectSphereWithOffset(
          toRad(normalizedLon),
          toRad(latDeg),
          radialOffsetPx
        );

        samples.push(
          Object.freeze({
            latDeg,
            lonDeg: normalizedLon,
            continentId: terrainResult.continentId,
            terrain: terrainResult.terrain,
            shoreline: terrainResult.shoreline,
            elevation: terrainResult.elevation,
            seaLevel: terrainResult.seaLevel,
            radialOffsetPx,
            x: projected.x,
            y: projected.y,
            z: projected.z,
            visible: projected.visible
          })
        );
      }
    }

    return Object.freeze({
      samples: Object.freeze(samples),
      classify(latDeg, lonDeg) {
        return getElevationAndContinent(latDeg, lonDeg).terrain;
      },
      continentAt(latDeg, lonDeg) {
        return getElevationAndContinent(latDeg, lonDeg).continentId;
      },
      elevationAt(latDeg, lonDeg) {
        return getElevationAndContinent(latDeg, lonDeg).elevation;
      },
      seaLevel: SEA_LEVEL
    });
  }

  function drawLatitudeBands(ctx, projector) {
    ctx.strokeStyle = "rgba(255,255,255,0.026)";
    ctx.lineWidth = 1;

    for (let latDeg = -60; latDeg <= 60; latDeg += 20) {
      let first = true;
      ctx.beginPath();

      for (let lonDeg = 0; lonDeg <= 360; lonDeg += 8) {
        const point = projector.projectSphere((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);

        if (!point.visible) {
          first = true;
          continue;
        }

        if (first) {
          ctx.moveTo(point.x, point.y);
          first = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.stroke();
    }
  }

  function drawLongitudeBands(ctx, projector) {
    ctx.strokeStyle = "rgba(190,220,255,0.020)";
    ctx.lineWidth = 1;

    for (let lonDeg = 0; lonDeg < 360; lonDeg += 20) {
      let first = true;
      ctx.beginPath();

      for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
        const point = projector.projectSphere((lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);

        if (!point.visible) {
          first = true;
          continue;
        }

        if (first) {
          ctx.moveTo(point.x, point.y);
          first = false;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.stroke();
    }
  }

  function drawLandBodies(ctx, projector, terrainField, topologyField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) return;

    const radius = projector.state.radius;
    const topologyLookup = buildTopologyLookup(topologyField);

    ctx.save();
    ctx.beginPath();
    ctx.arc(projector.state.centerX, projector.state.centerY, radius * 1.04, 0, Math.PI * 2);
    ctx.clip();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "LAND") continue;

      const topologySample = getTopologySample(topologyLookup, sample);
      const palette = getTerrainPalette(sample, topologySample);
      const shape = getTerrainShape(sample, topologySample, radius);

      ctx.save();
      ctx.translate(sample.x, sample.y);
      ctx.scale(shape.stretchX, shape.stretchY);

      const shadow = ctx.createRadialGradient(
        shape.bodyRadius * 0.18,
        shape.bodyRadius * 0.20,
        shape.bodyRadius * 0.08,
        0,
        0,
        shape.bodyRadius * 1.22
      );
      shadow.addColorStop(0, rgba(0, 0, 0, shape.shadowAlpha * 0.10));
      shadow.addColorStop(0.74, rgba(
        palette.shadowRGB[0],
        palette.shadowRGB[1],
        palette.shadowRGB[2],
        shape.shadowAlpha
      ));
      shadow.addColorStop(1, rgba(0, 0, 0, 0));

      ctx.beginPath();
      ctx.arc(0, 0, shape.bodyRadius * 1.06, 0, Math.PI * 2);
      ctx.fillStyle = shadow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, shape.bodyRadius, 0, Math.PI * 2);
      ctx.fillStyle = palette.fill;
      ctx.fill();

      if (shape.lowlandAlpha > 0.01) {
        ctx.beginPath();
        ctx.arc(0, shape.bodyRadius * 0.08, shape.bodyRadius * 0.92, 0, Math.PI * 2);
        ctx.fillStyle = rgba(58, 84, 40, shape.lowlandAlpha);
        ctx.fill();
      }

      const crest = ctx.createRadialGradient(
        -shape.bodyRadius * 0.28,
        -shape.bodyRadius * 0.30,
        shape.bodyRadius * 0.04,
        -shape.bodyRadius * 0.08,
        -shape.bodyRadius * 0.10,
        shape.bodyRadius * 0.70
      );
      crest.addColorStop(0, rgba(255, 255, 255, shape.highlightAlpha));
      crest.addColorStop(0.42, rgba(
        palette.ridgeRGB[0],
        palette.ridgeRGB[1],
        palette.ridgeRGB[2],
        Math.max(shape.highlightAlpha * 0.55, 0.04)
      ));
      crest.addColorStop(1, rgba(255, 255, 255, 0));

      ctx.beginPath();
      ctx.arc(0, 0, shape.bodyRadius * 0.96, 0, Math.PI * 2);
      ctx.fillStyle = crest;
      ctx.fill();

      if (shape.cliffMask > 0.06 || shape.canyonMask > 0.06) {
        const relief = ctx.createLinearGradient(
          -shape.bodyRadius * 0.92,
          -shape.bodyRadius * 0.34,
          shape.bodyRadius * 0.90,
          shape.bodyRadius * 0.72
        );
        relief.addColorStop(0, rgba(255, 255, 255, shape.cliffMask * 0.10 + shape.plateauMask * 0.06));
        relief.addColorStop(0.48, rgba(0, 0, 0, shape.valleyMask * 0.08));
        relief.addColorStop(1, rgba(
          palette.canyonRGB[0],
          palette.canyonRGB[1],
          palette.canyonRGB[2],
          0.10 + shape.canyonMask * 0.20
        ));

        ctx.beginPath();
        ctx.arc(0, 0, shape.bodyRadius * 0.98, 0, Math.PI * 2);
        ctx.fillStyle = relief;
        ctx.fill();
      }

      if ((sample.shoreline ?? 0) > 0.04) {
        ctx.beginPath();
        ctx.arc(0, 0, shape.bodyRadius * 1.04, 0, Math.PI * 2);
        ctx.strokeStyle = palette.line;
        ctx.lineWidth = 0.60;
        ctx.stroke();
      }

      if (topologySample?.terrainClass === "cliff" || topologySample?.terrainClass === "peak") {
        ctx.beginPath();
        ctx.arc(0, 0, shape.bodyRadius * 0.96, Math.PI * 0.14, Math.PI * 0.82);
        ctx.strokeStyle = rgba(100, 78, 46, 0.12 + shape.cliffMask * 0.24);
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      if (topologySample?.terrainClass === "canyon") {
        ctx.beginPath();
        ctx.arc(0, 0, shape.bodyRadius * 0.52, Math.PI * 1.06, Math.PI * 1.88);
        ctx.strokeStyle = rgba(76, 48, 28, 0.16 + shape.canyonMask * 0.24);
        ctx.lineWidth = 0.78;
        ctx.stroke();
      }

      if (topologySample?.terrainClass === "peak") {
        ctx.beginPath();
        ctx.arc(-shape.bodyRadius * 0.08, -shape.bodyRadius * 0.14, shape.bodyRadius * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = rgba(255, 255, 255, 0.20);
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  function renderBase(ctx, projector, runtime, state, terrainField, topologyField) {
    drawLandBodies(ctx, projector, terrainField, topologyField);
    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);
  }

  function renderOverlay(ctx, projector, runtime, state, topologyField) {
    if (!state.gridBound) return;

    const { centerX, centerY, radius } = projector.state;
    const row = state.localSelection.row;
    const col = state.localSelection.col;
    const cellWidth = (radius * 1.08) / 4;
    const cellHeight = (radius * 1.08) / 4;
    const x = centerX - radius * 0.54 + col * cellWidth;
    const y = centerY - radius * 0.54 + row * cellHeight;

    ctx.save();
    ctx.fillStyle = "rgba(121,169,255,0.05)";
    ctx.strokeStyle = "rgba(121,169,255,0.18)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.rect(x, y, cellWidth, cellHeight);
    ctx.fill();
    ctx.stroke();

    if (topologyField && Array.isArray(topologyField.samples)) {
      const summary = topologyField.summary ?? {};
      ctx.fillStyle = "rgba(255,255,255,0.60)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`Topo ${topologyField.samples.length}`, x + cellWidth - 6, y + cellHeight - 18);
      ctx.fillText(`M ${summary.mountainCount ?? 0}`, x + cellWidth - 6, y + cellHeight - 6);
    }

    ctx.restore();
  }

  return Object.freeze({
    continentMask,
    buildTerrainField,
    renderBase,
    renderOverlay
  });
}
