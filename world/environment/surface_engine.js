function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function normalizeLonDeg(lonDeg) {
  let value = lonDeg;
  while (value > 180) value -= 360;
  while (value < -180) value += 360;
  return value;
}

function angularDistanceDeg(latA, lonA, latB, lonB) {
  const latARad = toRad(latA);
  const lonARad = toRad(lonA);
  const latBRad = toRad(latB);
  const lonBRad = toRad(lonB);

  const cosine =
    Math.sin(latARad) * Math.sin(latBRad) +
    Math.cos(latARad) * Math.cos(latBRad) * Math.cos(lonARad - lonBRad);

  const clamped = Math.max(-1, Math.min(1, cosine));
  return (Math.acos(clamped) * 180) / Math.PI;
}

const CONTINENTS = Object.freeze([
  Object.freeze({
    id: "harbor",
    centerLat: 0,
    centerLon: 0,
    radiusDeg: 45,
    fill: "#97dc6d",
    edge: "#dff7b5",
    highlight: "rgba(255,255,255,0.10)"
  }),
  Object.freeze({
    id: "gratitude",
    centerLat: 35,
    centerLon: 60,
    radiusDeg: 28,
    fill: "#88d567",
    edge: "#d8f0af",
    highlight: "rgba(255,255,255,0.09)"
  }),
  Object.freeze({
    id: "generosity",
    centerLat: 35,
    centerLon: -60,
    radiusDeg: 28,
    fill: "#8eda72",
    edge: "#dff4b8",
    highlight: "rgba(255,255,255,0.09)"
  }),
  Object.freeze({
    id: "northland",
    centerLat: 60,
    centerLon: 120,
    radiusDeg: 25,
    fill: "#9ad978",
    edge: "#e0f5ba",
    highlight: "rgba(255,255,255,0.08)"
  }),
  Object.freeze({
    id: "eastreach",
    centerLat: 10,
    centerLon: 150,
    radiusDeg: 22,
    fill: "#86cf62",
    edge: "#d4edaa",
    highlight: "rgba(255,255,255,0.08)"
  }),
  Object.freeze({
    id: "southfields",
    centerLat: -45,
    centerLon: -90,
    radiusDeg: 24,
    fill: "#8ad26a",
    edge: "#d7efb0",
    highlight: "rgba(255,255,255,0.08)"
  }),
  Object.freeze({
    id: "westwilds",
    centerLat: -10,
    centerLon: -150,
    radiusDeg: 24,
    fill: "#93d872",
    edge: "#ddf4b6",
    highlight: "rgba(255,255,255,0.08)"
  })
]);

function getContinentById(id) {
  return CONTINENTS.find((continent) => continent.id === id) ?? null;
}

function getLandColor(continentId) {
  const continent = getContinentById(continentId);
  return continent?.fill ?? "#90d46c";
}

function getLandEdgeColor(continentId) {
  const continent = getContinentById(continentId);
  return continent?.edge ?? "#dcf3b7";
}

function getLandHighlight(continentId) {
  const continent = getContinentById(continentId);
  return continent?.highlight ?? "rgba(255,255,255,0.08)";
}

export function createSurfaceEngine() {
  function continentMask(latDeg, lonDeg) {
    const normalizedLon = normalizeLonDeg(lonDeg);

    for (const continent of CONTINENTS) {
      const distance = angularDistanceDeg(
        latDeg,
        normalizedLon,
        continent.centerLat,
        continent.centerLon
      );

      if (distance <= continent.radiusDeg) {
        return continent.id;
      }
    }

    return null;
  }

  function buildTerrainField(projector) {
    const samples = [];
    const latStep = 6;
    const lonStep = 6;

    for (let latDeg = -84; latDeg <= 84; latDeg += latStep) {
      for (let lonDeg = -180; lonDeg < 180; lonDeg += lonStep) {
        const normalizedLon = normalizeLonDeg(lonDeg);
        const continentId = continentMask(latDeg, normalizedLon);
        const projected = projector.projectSphere(toRad(normalizedLon), toRad(latDeg));

        samples.push(
          Object.freeze({
            latDeg,
            lonDeg: normalizedLon,
            continentId,
            terrain: continentId ? "LAND" : "OCEAN",
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
        return continentMask(latDeg, lonDeg) ? "LAND" : "OCEAN";
      },
      continentAt(latDeg, lonDeg) {
        return continentMask(latDeg, lonDeg);
      }
    });
  }

  function drawLatitudeBands(ctx, projector) {
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;

    for (let latDeg = -60; latDeg <= 60; latDeg += 20) {
      let first = true;
      ctx.beginPath();

      for (let lonDeg = 0; lonDeg <= 360; lonDeg += 8) {
        const point = projector.projectSphere(
          (lonDeg * Math.PI) / 180,
          (latDeg * Math.PI) / 180
        );

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
    ctx.strokeStyle = "rgba(190,220,255,0.03)";
    ctx.lineWidth = 1;

    for (let lonDeg = 0; lonDeg < 360; lonDeg += 20) {
      let first = true;
      ctx.beginPath();

      for (let latDeg = -90; latDeg <= 90; latDeg += 5) {
        const point = projector.projectSphere(
          (lonDeg * Math.PI) / 180,
          (latDeg * Math.PI) / 180
        );

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
    ctx.arc(projector.state.centerX, projector.state.centerY, radius * 0.995, 0, Math.PI * 2);
    ctx.clip();

    for (const sample of terrainField.samples) {
      if (!sample.visible) continue;
      if (sample.terrain !== "LAND") continue;

      const sampleRadius = radius * 0.030;

      ctx.beginPath();
      ctx.arc(sample.x, sample.y, sampleRadius, 0, Math.PI * 2);
      ctx.fillStyle = getLandColor(sample.continentId);
      ctx.fill();

      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = getLandEdgeColor(sample.continentId);
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.restore();

      const highlight = ctx.createRadialGradient(
        sample.x - sampleRadius * 0.35,
        sample.y - sampleRadius * 0.35,
        sampleRadius * 0.10,
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
    }

    ctx.restore();
  }

  function renderBase(ctx, projector, runtime, state, terrainField) {
    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);
    drawLandSamples(ctx, projector, terrainField);
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
