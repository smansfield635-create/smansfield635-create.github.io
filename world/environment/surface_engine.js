function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
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
  return toDeg(Math.acos(clamped));
}

function destinationPointDeg(latDeg, lonDeg, angularDistanceDegValue, bearingDeg) {
  const lat1 = toRad(latDeg);
  const lon1 = toRad(lonDeg);
  const distance = toRad(angularDistanceDegValue);
  const bearing = toRad(bearingDeg);

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinDistance = Math.sin(distance);
  const cosDistance = Math.cos(distance);

  const lat2 = Math.asin(
    sinLat1 * cosDistance + cosLat1 * sinDistance * Math.cos(bearing)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * sinDistance * cosLat1,
      cosDistance - sinLat1 * Math.sin(lat2)
    );

  return Object.freeze({
    latDeg: toDeg(lat2),
    lonDeg: normalizeLonDeg(toDeg(lon2))
  });
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

export function createSurfaceEngine() {
  function continentMask(latDeg, lonDeg) {
    for (const continent of CONTINENTS) {
      const distance = angularDistanceDeg(
        latDeg,
        lonDeg,
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
    const latStep = 10;
    const lonStep = 10;

    for (let latDeg = -80; latDeg <= 80; latDeg += latStep) {
      for (let lonDeg = -180; lonDeg <= 180; lonDeg += lonStep) {
        const continentId = continentMask(latDeg, lonDeg);
        const projected = projector.projectSphere(toRad(lonDeg), toRad(latDeg));

        samples.push(
          Object.freeze({
            latDeg,
            lonDeg,
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
      }
    });
  }

  function drawContinent(ctx, projector, continent) {
    const points = [];
    const stepDeg = 8;

    for (let bearingDeg = 0; bearingDeg <= 360; bearingDeg += stepDeg) {
      const point = destinationPointDeg(
        continent.centerLat,
        continent.centerLon,
        continent.radiusDeg,
        bearingDeg
      );

      const projected = projector.projectSphere(
        toRad(point.lonDeg),
        toRad(point.latDeg)
      );

      if (projected.visible) {
        points.push(projected);
      }
    }

    if (points.length < 6) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = continent.fill;
    ctx.fill();

    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = continent.edge;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();

    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const gradient = ctx.createLinearGradient(
      Math.min(...xs),
      Math.min(...ys),
      Math.max(...xs),
      Math.max(...ys)
    );

    gradient.addColorStop(0, continent.highlight);
    gradient.addColorStop(0.55, "rgba(255,255,255,0.00)");
    gradient.addColorStop(1, "rgba(0,0,0,0.04)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
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

  function renderBase(ctx, projector, runtime, state, terrainField) {
    drawLatitudeBands(ctx, projector);
    drawLongitudeBands(ctx, projector);

    for (const continent of CONTINENTS) {
      drawContinent(ctx, projector, continent);
    }
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
