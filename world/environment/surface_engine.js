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
    mass: 1.00
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
    elongationX: 1.00,
    elongationY: 0.98,
    mass: 0.70
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
    mass: 0.70
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
  return baseRadius * (0.008 + emergentHeight * 0.020);
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
    ctx.strokeStyle = "rgba(255,255,255,0.040)";
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
    ctx.strokeStyle = "rgba(190,220,255,0.028)";
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

  function drawLandSamples(ctx, projector, terrainField) {
    if (!terrainField || !Array.isArray(terrainField.samples)) return;

    const radius = projector.state.radius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(projector.state.centerX, projector.state.centerY, radius * 1.03, 0, Math.PI * 2);
    ctx.clip();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "LAND") continue;

      const emergentHeight = clamp((sample.elevation - sample.seaLevel) / 0.24, 0, 1);
      const sampleRadius = radius * (0.011 + emergentHeight * 0.010);

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, sampleRadius, 0, Math.PI * 2);
      ctx.fillStyle = getLandColor(sample.continentId);
      ctx.fill();

      if (sample.shoreline > 0.05) {
        ctx.beginPath();
        ctx.arc(sample.x, sample.y, sampleRadius * 1.07, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(225,245,200,${0.06 + sample.shoreline * 0.12})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      const highlight = ctx.createRadialGradient(
        sample.x - sampleRadius * 0.30,
        sample.y - sampleRadius * 0.30,
        sampleRadius * 0.08,
        sample.x,
        sample.y,
        sampleRadius
      );

      highlight.addColorStop(0, getLandHighlight(sample.continentId));
      highlight.addColorStop(0.6, "rgba(255,255,255,0.00)");
      highlight.addColorStop(1, "rgba(0,0,0,0.04)");

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, sampleRadius, 0, Math.PI * 2);
      ctx.fillStyle = highlight;
      ctx.fill();

      if (emergentHeight > 0.55) {
        ctx.beginPath();
        ctx.arc(sample.x, sample.y, sampleRadius * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function renderBase(ctx, projector, runtime, state, terrainField) {
    drawLandSamples(ctx, projector, terrainField);
    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);
  }

  function renderOverlay(ctx, projector, runtime, state) {
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
    ctx.restore();
  }

  return Object.freeze({
    continentMask,
    buildTerrainField,
    renderBase,
    renderOverlay
  });
}
