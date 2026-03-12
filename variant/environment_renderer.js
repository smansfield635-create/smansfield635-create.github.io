function polygon(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function centroid(points) {
  let x = 0;
  let y = 0;
  for (const [px, py] of points) {
    x += px;
    y += py;
  }
  return [x / points.length, y / points.length];
}

function fillPolygon(ctx, points, fillStyle) {
  polygon(ctx, points);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokePolygon(ctx, points, strokeStyle, lineWidth = 1) {
  polygon(ctx, points);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function boundsOf(points) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const xi = points[i][0];
    const yi = points[i][1];
    const xj = points[j][0];
    const yj = points[j][1];

    const intersects = ((yi > y) !== (yj > y))
      && (x < (((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9)) + xi);

    if (intersects) inside = !inside;
  }
  return inside;
}

function distanceSquared(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return (dx * dx) + (dy * dy);
}

function distance(ax, ay, bx, by) {
  return Math.sqrt(distanceSquared(ax, ay, bx, by));
}

function distancePointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const ab2 = (abx * abx) + (aby * aby);

  if (ab2 <= 1e-9) {
    return Math.sqrt(distanceSquared(px, py, ax, ay));
  }

  let t = ((apx * abx) + (apy * aby)) / ab2;
  if (t < 0) t = 0;
  if (t > 1) t = 1;

  const qx = ax + (abx * t);
  const qy = ay + (aby * t);
  return Math.sqrt(distanceSquared(px, py, qx, qy));
}

function distancePointToPolygonEdge(px, py, points) {
  let best = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const d = distancePointToSegment(px, py, a[0], a[1], b[0], b[1]);
    if (d < best) best = d;
  }
  return best;
}

function signedPolygonArea(points) {
  let area = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    area += (points[j][0] * points[i][1]) - (points[i][0] * points[j][1]);
  }
  return area * 0.5;
}

function normalize(vx, vy) {
  const len = Math.sqrt((vx * vx) + (vy * vy)) || 1;
  return [vx / len, vy / len];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + ((b - a) * t);
}

function insetPolygon(points, inset) {
  if (!points?.length || inset <= 0) return points ? points.slice() : [];
  if (points.length < 3) return points.slice();

  const area = signedPolygonArea(points);
  const sign = area >= 0 ? 1 : -1;
  const out = [];

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[(i - 1 + points.length) % points.length];
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    const [e1x, e1y] = normalize(curr[0] - prev[0], curr[1] - prev[1]);
    const [e2x, e2y] = normalize(next[0] - curr[0], next[1] - curr[1]);

    const n1x = sign * -e1y;
    const n1y = sign * e1x;
    const n2x = sign * -e2y;
    const n2y = sign * e2x;

    const nx = n1x + n2x;
    const ny = n1y + n2y;
    const [unx, uny] = normalize(nx, ny);

    out.push([
      curr[0] + (unx * inset),
      curr[1] + (uny * inset)
    ]);
  }

  return out;
}

function hashString(input) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createSeededRandom(seed) {
  let s = seed >>> 0;
  return function random() {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function collectMapValues(candidate) {
  if (!candidate) return [];
  if (candidate instanceof Map) return [...candidate.values()];
  if (Array.isArray(candidate)) return candidate;
  if (typeof candidate === "object") return Object.values(candidate);
  return [];
}

function classifyVegetationProfile(zone) {
  const label = [
    zone.id,
    zone.name,
    zone.kind,
    zone.regionClass,
    zone.terrainType
  ].join(" ").toLowerCase();

  if (label.includes("market")) {
    return {
      shrubs: 5,
      grass: 1,
      trees: 0,
      inset: 18,
      perimeterWeight: 0.95,
      coreRadius: 0.40,
      edgeBand: 24,
      neutralChance: 0.06
    };
  }

  if (label.includes("summit") || label.includes("plaza") || label.includes("gate")) {
    return {
      shrubs: 2,
      grass: 1,
      trees: 0,
      inset: 20,
      perimeterWeight: 0.92,
      coreRadius: 0.44,
      edgeBand: 22,
      neutralChance: 0.04
    };
  }

  if (label.includes("harbor") || label.includes("village")) {
    return {
      shrubs: 12,
      grass: 4,
      trees: 2,
      inset: 20,
      perimeterWeight: 0.78,
      coreRadius: 0.30,
      edgeBand: 30,
      neutralChance: 0.18
    };
  }

  if (label.includes("basin")) {
    return {
      shrubs: 16,
      grass: 10,
      trees: 1,
      inset: 16,
      perimeterWeight: 0.84,
      coreRadius: 0.22,
      edgeBand: 34,
      neutralChance: 0.22
    };
  }

  if (label.includes("coast") || label.includes("shore")) {
    return {
      shrubs: 15,
      grass: 10,
      trees: 2,
      inset: 14,
      perimeterWeight: 0.88,
      coreRadius: 0.20,
      edgeBand: 34,
      neutralChance: 0.18
    };
  }

  return {
    shrubs: 9,
    grass: 5,
    trees: 1,
    inset: 16,
    perimeterWeight: 0.72,
    coreRadius: 0.26,
    edgeBand: 28,
    neutralChance: 0.16
  };
}

function collectVegetationZones(kernel) {
  const zones = [];
  const seen = new Set();

  const explicitTerrain = [
    ...collectMapValues(kernel?.terrainPolygonsById),
    ...collectMapValues(kernel?.generatedTerrainPolygonsById)
  ];

  for (const row of explicitTerrain) {
    if (!row?.polygon?.length) continue;

    const id = firstString(row.terrainId, row.regionId, `terrain_${zones.length}`);
    if (seen.has(id)) continue;
    seen.add(id);

    zones.push({
      id,
      name: firstString(row.terrainId, row.regionId),
      kind: "terrain",
      regionClass: firstString(row.regionId),
      terrainType: firstString(row.terrainClass),
      polygon: row.polygon
    });
  }

  const regionLookup = kernel?.regionsById instanceof Map ? kernel.regionsById : null;
  for (const row of collectMapValues(kernel?.regionBoundariesById)) {
    if (!row?.polygon?.length) continue;

    const region = regionLookup?.get(row.regionId) ?? null;
    const regionLabel = firstString(
      region?.displayName,
      region?.name,
      row.regionId
    );

    const id = `boundary_${row.regionId}`;
    if (seen.has(id)) continue;
    seen.add(id);

    zones.push({
      id,
      name: regionLabel,
      kind: "boundary",
      regionClass: firstString(region?.regionClass, region?.templateId, row.regionId),
      terrainType: firstString(region?.templateId, row.regionId),
      polygon: row.polygon
    });
  }

  return zones;
}

function collectNodeCenters(kernel) {
  const nodes = [];
  const seen = new Set();

  for (const row of collectMapValues(kernel?.harborNavigationGraph?.navigationNodesById)) {
    if (!row) continue;
    const point = Array.isArray(row.centerPoint) ? row.centerPoint : null;
    if (!point || point.length < 2) continue;

    const x = point[0];
    const y = point[1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    const id = firstString(row.navNodeId, `${x}:${y}`);
    if (seen.has(id)) continue;
    seen.add(id);

    const radius = row.nodeClass === "transfer" || row.nodeClass === "mooring" ? 56 : 46;
    nodes.push({ x, y, r: radius });
  }

  for (const row of collectMapValues(kernel?.maritimeNetwork?.seaNodesById)) {
    if (!row) continue;
    const point = Array.isArray(row.centerPoint) ? row.centerPoint : null;
    if (!point || point.length < 2) continue;

    const x = point[0];
    const y = point[1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

    const id = firstString(row.seaNodeId, `${x}:${y}`);
    if (seen.has(id)) continue;
    seen.add(id);

    nodes.push({ x, y, r: 42 });
  }

  return nodes;
}

function collectRouteSegments(kernel) {
  const segments = [];
  const seen = new Set();

  for (const row of collectMapValues(kernel?.harborNavigationGraph?.navigationEdgesById)) {
    const pts = Array.isArray(row?.centerline) ? row.centerline : null;
    if (!pts || pts.length < 2) continue;

    for (let i = 1; i < pts.length; i += 1) {
      const a = pts[i - 1];
      const b = pts[i];
      const key = `${a[0]},${a[1]}:${b[0]},${b[1]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      segments.push({
        ax: a[0],
        ay: a[1],
        bx: b[0],
        by: b[1],
        r: Math.max(16, Number.isFinite(row.nominalWidth) ? (row.nominalWidth * 1.0) : 18)
      });
    }
  }

  for (const row of collectMapValues(kernel?.maritimeNetwork?.seaRoutesById)) {
    const pts = Array.isArray(row?.centerline) ? row.centerline : null;
    if (!pts || pts.length < 2) continue;

    for (let i = 1; i < pts.length; i += 1) {
      const a = pts[i - 1];
      const b = pts[i];
      const key = `sea:${a[0]},${a[1]}:${b[0]},${b[1]}`;
      if (seen.has(key)) continue;
      seen.add(key);
      segments.push({
        ax: a[0],
        ay: a[1],
        bx: b[0],
        by: b[1],
        r: Math.max(12, Number.isFinite(row.nominalWidth) ? (row.nominalWidth * 0.75) : 16)
      });
    }
  }

  const channel = kernel?.coastlineModel?.harborChannel;
  if (Array.isArray(channel) && channel.length >= 2) {
    for (let i = 1; i < channel.length; i += 1) {
      const a = channel[i - 1];
      const b = channel[i];
      segments.push({ ax: a[0], ay: a[1], bx: b[0], by: b[1], r: 16 });
    }
  }

  return segments;
}

function pointBlocked(x, y, exclusions) {
  for (const node of exclusions.nodes) {
    if (distanceSquared(x, y, node.x, node.y) <= (node.r * node.r)) return true;
  }

  for (const seg of exclusions.segments) {
    if (distancePointToSegment(x, y, seg.ax, seg.ay, seg.bx, seg.by) <= seg.r) return true;
  }

  return false;
}

function candidatePlacementAllowed(x, y, zone, profile, polygonPoints, bounds, rng) {
  const [cx, cy] = centroid(polygonPoints);
  const minSpan = Math.max(24, Math.min(bounds.width, bounds.height));
  const edgeDistance = distancePointToPolygonEdge(x, y, polygonPoints);
  const centerDistance = distance(x, y, cx, cy);

  const edgeBand = Math.max(16, Math.min(profile.edgeBand, minSpan * 0.42));
  const edgeAffinity = 1 - clamp(edgeDistance / edgeBand, 0, 1);

  const coreRadiusPx = Math.max(20, minSpan * profile.coreRadius);
  const corePenalty = centerDistance < coreRadiusPx
    ? 1 - clamp(centerDistance / coreRadiusPx, 0, 1)
    : 0;

  const perimeterScore = edgeAffinity * profile.perimeterWeight;
  const neutralScore = profile.neutralChance * (1 - profile.perimeterWeight);
  const score = clamp(0.02 + perimeterScore + neutralScore - (corePenalty * 0.95), 0, 1);

  return rng() < score;
}

function scatterInstances(points, count, seed, exclusions, scaleMin, scaleMax, zone, profile) {
  const rng = createSeededRandom(seed);
  const inset = insetPolygon(points, 10);
  const target = inset.length >= 3 ? inset : points;
  const bounds = boundsOf(target);
  const instances = [];
  const attemptsMax = Math.max(72, count * 64);

  for (let attempt = 0; attempt < attemptsMax && instances.length < count; attempt += 1) {
    const x = bounds.minX + (rng() * bounds.width);
    const y = bounds.minY + (rng() * bounds.height);

    if (!pointInPolygon(x, y, target)) continue;
    if (pointBlocked(x, y, exclusions)) continue;
    if (!candidatePlacementAllowed(x, y, zone, profile, target, bounds, rng)) continue;

    let tooClose = false;
    for (const placed of instances) {
      if (distanceSquared(x, y, placed.x, placed.y) < ((placed.spacing + 14) * (placed.spacing + 14))) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;

    const scale = scaleMin + (rng() * (scaleMax - scaleMin));
    instances.push({
      x,
      y,
      scale,
      rotation: (rng() - 0.5) * 0.35,
      variant: Math.floor(rng() * 3),
      spacing: 9 + (scale * 10)
    });
  }

  return instances;
}

function buildVegetationLayout(zone, exclusions) {
  const profile = classifyVegetationProfile(zone);
  const zonePolygon = insetPolygon(zone.polygon, profile.inset);
  const safePolygon = zonePolygon.length >= 3 ? zonePolygon : zone.polygon;

  const areaBounds = boundsOf(safePolygon);
  const area = Math.max(1, areaBounds.width * areaBounds.height);
  const densityScale = Math.max(0.45, Math.min(1.15, area / 52000));
  const seedBase = hashString(zone.id || zone.name || "zone");

  return {
    shrubs: scatterInstances(
      safePolygon,
      Math.max(1, Math.round(profile.shrubs * densityScale)),
      seedBase ^ 0x91E10DA5,
      exclusions,
      0.62,
      0.96,
      zone,
      profile
    ),
    grasses: scatterInstances(
      safePolygon,
      Math.max(0, Math.round(profile.grass * densityScale)),
      seedBase ^ 0x7F4A7C15,
      exclusions,
      0.68,
      0.94,
      zone,
      profile
    ),
    trees: scatterInstances(
      safePolygon,
      Math.max(0, Math.round(profile.trees * densityScale)),
      seedBase ^ 0x3C6EF372,
      exclusions,
      0.78,
      1.02,
      zone,
      profile
    )
  };
}

function drawGrassCluster(ctx, x, y, scale, variant) {
  const height = 9 * scale;
  const width = 10 * scale;

  ctx.save();
  ctx.translate(x, y);

  ctx.strokeStyle = variant === 0 ? "rgba(124,170,104,0.62)" : "rgba(108,154,92,0.62)";
  ctx.lineWidth = 1.2 * scale;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-width * 0.34, 0);
  ctx.lineTo(-width * 0.18, -height * 0.9);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -height);
  ctx.moveTo(width * 0.34, 0);
  ctx.lineTo(width * 0.18, -height * 0.84);
  ctx.moveTo(-width * 0.08, 0);
  ctx.lineTo(-width * 0.26, -height * 0.56);
  ctx.moveTo(width * 0.08, 0);
  ctx.lineTo(width * 0.26, -height * 0.58);
  ctx.stroke();

  ctx.restore();
}

function drawShrub(ctx, x, y, scale, variant) {
  const radius = 5.4 * scale;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "rgba(30,46,34,0.10)";
  ctx.beginPath();
  ctx.ellipse(0, 3 * scale, 7.2 * scale, 2.8 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = variant === 0 ? "rgba(112,154,102,0.86)" : variant === 1
    ? "rgba(96,142,88,0.86)"
    : "rgba(124,164,110,0.86)";
  ctx.beginPath();
  ctx.arc(-radius * 0.72, 0.2 * scale, radius * 0.76, 0, Math.PI * 2);
  ctx.arc(0, -radius * 0.18, radius * 0.94, 0, Math.PI * 2);
  ctx.arc(radius * 0.78, 0.1 * scale, radius * 0.72, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(202,228,182,0.12)";
  ctx.beginPath();
  ctx.arc(-radius * 0.18, -radius * 0.34, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawTree(ctx, x, y, scale, variant) {
  const trunkH = 7 * scale;
  const canopyR = 7 * scale;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = "rgba(34,44,30,0.12)";
  ctx.beginPath();
  ctx.ellipse(0, 4 * scale, 9 * scale, 3 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = variant === 2 ? "rgba(108,154,100,0.88)" : "rgba(96,144,92,0.88)";
  ctx.beginPath();
  ctx.arc(0, -trunkH, canopyR, 0, Math.PI * 2);
  ctx.arc(-canopyR * 0.7, -trunkH * 0.72, canopyR * 0.68, 0, Math.PI * 2);
  ctx.arc(canopyR * 0.7, -trunkH * 0.72, canopyR * 0.64, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(112,84,60,0.88)";
  ctx.fillRect(-1 * scale, -trunkH * 0.28, 2 * scale, trunkH + (3 * scale));

  ctx.restore();
}

function drawVegetationInstances(ctx, instances, drawFn) {
  for (const item of instances) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation);
    drawFn(ctx, 0, 0, item.scale, item.variant);
    ctx.restore();
  }
}

function getPhaseLabel(runtime) {
  return runtime?.phase?.globalPhase ?? "CALM";
}

function getSkyPhaseStrength(phaseLabel) {
  if (phaseLabel === "LOCKDOWN") return 1.0;
  if (phaseLabel === "SEVERE") return 0.78;
  if (phaseLabel === "UNSTABLE") return 0.56;
  if (phaseLabel === "BUILDING") return 0.34;
  if (phaseLabel === "RECOVERY") return 0.20;
  if (phaseLabel === "CLEAR_WINDOW") return 0.08;
  return 0.14;
}

function getVegetationSuppression(phaseLabel) {
  if (phaseLabel === "LOCKDOWN") return 0.56;
  if (phaseLabel === "SEVERE") return 0.34;
  if (phaseLabel === "UNSTABLE") return 0.18;
  return 0;
}

function drawVegetationLayer(ctx, kernel, vegetationCache, phaseLabel) {
  const zones = collectVegetationZones(kernel);
  if (!zones.length) return;

  const exclusions = {
    nodes: collectNodeCenters(kernel),
    segments: collectRouteSegments(kernel)
  };

  const allTrees = [];
  const allShrubs = [];
  const allGrasses = [];

  for (const zone of zones) {
    const cacheKey = [
      zone.id,
      zone.name,
      zone.polygon.length,
      hashString(JSON.stringify(zone.polygon))
    ].join("|");

    let layout = vegetationCache.get(cacheKey);
    if (!layout) {
      layout = buildVegetationLayout(zone, exclusions);
      vegetationCache.set(cacheKey, layout);
    }

    allTrees.push(...layout.trees);
    allShrubs.push(...layout.shrubs);
    allGrasses.push(...layout.grasses);
  }

  allTrees.sort((a, b) => a.y - b.y);
  allShrubs.sort((a, b) => a.y - b.y);
  allGrasses.sort((a, b) => a.y - b.y);

  const suppression = getVegetationSuppression(phaseLabel);

  ctx.save();
  if (suppression > 0) {
    ctx.globalAlpha = 1 - suppression;
  }
  drawVegetationInstances(ctx, allGrasses, drawGrassCluster);
  drawVegetationInstances(ctx, allShrubs, drawShrub);
  drawVegetationInstances(ctx, allTrees, drawTree);
  ctx.restore();
}

function drawGlobalSkyWash(ctx, phaseLabel) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 1240);

  if (phaseLabel === "CLEAR_WINDOW") {
    gradient.addColorStop(0, "rgba(255,252,244,0.16)");
    gradient.addColorStop(0.28, "rgba(210,238,255,0.09)");
    gradient.addColorStop(0.68, "rgba(116,180,232,0.04)");
    gradient.addColorStop(1, "rgba(20,42,72,0.00)");
  } else if (phaseLabel === "LOCKDOWN") {
    gradient.addColorStop(0, "rgba(206,214,228,0.08)");
    gradient.addColorStop(0.34, "rgba(132,154,188,0.10)");
    gradient.addColorStop(0.72, "rgba(70,96,134,0.08)");
    gradient.addColorStop(1, "rgba(20,32,54,0.04)");
  } else if (phaseLabel === "SEVERE") {
    gradient.addColorStop(0, "rgba(226,228,234,0.08)");
    gradient.addColorStop(0.34, "rgba(154,182,212,0.08)");
    gradient.addColorStop(0.72, "rgba(82,132,184,0.05)");
    gradient.addColorStop(1, "rgba(20,42,72,0.02)");
  } else {
    gradient.addColorStop(0, "rgba(246,244,236,0.10)");
    gradient.addColorStop(0.34, "rgba(182,220,244,0.05)");
    gradient.addColorStop(0.72, "rgba(88,150,204,0.03)");
    gradient.addColorStop(1, "rgba(20,42,72,0.00)");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawOpenSeaLightField(ctx, phaseLabel) {
  if (phaseLabel === "LOCKDOWN") return;

  const intensity = phaseLabel === "CLEAR_WINDOW" ? 1.25 : phaseLabel === "SEVERE" ? 0.72 : 1.0;

  const glowA = ctx.createRadialGradient(784, 468, 20, 784, 468, 520);
  glowA.addColorStop(0, `rgba(186,238,255,${0.18 * intensity})`);
  glowA.addColorStop(0.35, `rgba(124,196,236,${0.08 * intensity})`);
  glowA.addColorStop(1, "rgba(36,88,140,0.00)");
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, 1180, 1240);

  const glowB = ctx.createRadialGradient(284, 820, 30, 284, 820, 360);
  glowB.addColorStop(0, `rgba(174,224,248,${0.08 * intensity})`);
  glowB.addColorStop(1, "rgba(50,110,166,0.00)");
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawWaterBodyAtmosphere(ctx, points, tick, waterClass, phaseLabel) {
  if (!points?.length) return;

  const [cx, cy] = centroid(points);
  const pulse = 0.5 + (0.5 * Math.sin(tick * 0.035));

  polygon(ctx, points);

  const radius = waterClass === "harbor" ? 240 : 140;
  const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, radius);

  if (phaseLabel === "LOCKDOWN") {
    gradient.addColorStop(0, `rgba(210,230,255,${0.06 + (pulse * 0.02)})`);
    gradient.addColorStop(0.45, "rgba(132,164,212,0.05)");
    gradient.addColorStop(1, "rgba(40,66,108,0.02)");
  } else if (phaseLabel === "SEVERE" || phaseLabel === "UNSTABLE") {
    if (waterClass === "harbor") {
      gradient.addColorStop(0, `rgba(224,246,255,${0.10 + (pulse * 0.04)})`);
      gradient.addColorStop(0.45, "rgba(134,206,244,0.07)");
      gradient.addColorStop(1, "rgba(38,88,142,0.00)");
    } else {
      gradient.addColorStop(0, `rgba(204,236,255,${0.08 + (pulse * 0.03)})`);
      gradient.addColorStop(0.5, "rgba(126,184,220,0.05)");
      gradient.addColorStop(1, "rgba(36,74,116,0.00)");
    }
  } else if (phaseLabel === "CLEAR_WINDOW") {
    if (waterClass === "harbor") {
      gradient.addColorStop(0, `rgba(236,250,255,${0.12 + (pulse * 0.04)})`);
      gradient.addColorStop(0.45, "rgba(156,220,250,0.07)");
      gradient.addColorStop(1, "rgba(30,78,132,0.00)");
    } else {
      gradient.addColorStop(0, `rgba(214,246,255,${0.10 + (pulse * 0.03)})`);
      gradient.addColorStop(0.5, "rgba(138,196,224,0.05)");
      gradient.addColorStop(1, "rgba(34,74,110,0.00)");
    }
  } else {
    if (waterClass === "harbor") {
      gradient.addColorStop(0, `rgba(210,246,255,${0.08 + (pulse * 0.03)})`);
      gradient.addColorStop(0.45, "rgba(124,196,232,0.05)");
      gradient.addColorStop(1, "rgba(30,78,132,0.00)");
    } else {
      gradient.addColorStop(0, `rgba(196,236,248,${0.06 + (pulse * 0.02)})`);
      gradient.addColorStop(0.5, "rgba(126,178,204,0.04)");
      gradient.addColorStop(1, "rgba(34,74,110,0.00)");
    }
  }

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawWaterBodyShimmer(ctx, points, tick, waterClass, phaseLabel) {
  if (!points?.length) return;
  if (phaseLabel === "LOCKDOWN") return;

  const [cx, cy] = centroid(points);
  const pulse = 0.5 + (0.5 * Math.sin((tick * 0.06) + (cx * 0.01)));

  const alphaScale = phaseLabel === "CLEAR_WINDOW"
    ? 1.28
    : phaseLabel === "SEVERE"
      ? 0.88
      : phaseLabel === "UNSTABLE"
        ? 1.02
        : 1.0;

  ctx.save();
  polygon(ctx, points);
  ctx.clip();

  const shimmerBands = waterClass === "harbor"
    ? [
        { x: cx - 150, y: cy - 30, w: 180, h: 18, a: (0.05 + (pulse * 0.03)) * alphaScale },
        { x: cx - 40, y: cy + 8, w: 140, h: 16, a: (0.04 + (pulse * 0.025)) * alphaScale },
        { x: cx + 40, y: cy - 56, w: 120, h: 14, a: (0.035 + (pulse * 0.02)) * alphaScale }
      ]
    : [
        { x: cx - 74, y: cy - 14, w: 92, h: 12, a: (0.04 + (pulse * 0.02)) * alphaScale },
        { x: cx - 14, y: cy + 10, w: 80, h: 10, a: (0.03 + (pulse * 0.016)) * alphaScale }
      ];

  for (const band of shimmerBands) {
    const gradient = ctx.createLinearGradient(band.x, band.y, band.x + band.w, band.y + band.h);
    gradient.addColorStop(0, `rgba(244,252,255,${band.a})`);
    gradient.addColorStop(0.5, `rgba(196,234,248,${band.a * 0.65})`);
    gradient.addColorStop(1, "rgba(244,252,255,0.00)");
    ctx.fillStyle = gradient;
    ctx.fillRect(band.x, band.y, band.w, band.h);
  }

  ctx.restore();
}

function drawHarborMist(ctx, kernel, phaseLabel) {
  const harborBasin = kernel?.coastlineModel?.harborBasin;
  if (!harborBasin?.length) return;

  const [cx, cy] = centroid(harborBasin);

  ctx.save();
  polygon(ctx, harborBasin);
  ctx.clip();

  const mist = ctx.createRadialGradient(cx, cy - 60, 20, cx, cy - 60, 280);

  if (phaseLabel === "CLEAR_WINDOW") {
    mist.addColorStop(0, "rgba(238,248,255,0.05)");
    mist.addColorStop(0.4, "rgba(198,228,246,0.02)");
    mist.addColorStop(1, "rgba(188,222,244,0.00)");
  } else if (phaseLabel === "LOCKDOWN" || phaseLabel === "SEVERE") {
    mist.addColorStop(0, "rgba(236,244,255,0.14)");
    mist.addColorStop(0.4, "rgba(194,220,246,0.08)");
    mist.addColorStop(1, "rgba(188,222,244,0.00)");
  } else {
    mist.addColorStop(0, "rgba(232,244,255,0.08)");
    mist.addColorStop(0.4, "rgba(188,222,244,0.04)");
    mist.addColorStop(1, "rgba(188,222,244,0.00)");
  }

  ctx.fillStyle = mist;
  ctx.fillRect(cx - 320, cy - 300, 640, 520);

  ctx.restore();
}

function drawSeaHazardAtmosphere(ctx, kernel, phaseLabel) {
  const seaHazardsById = kernel?.maritimeNetwork?.seaHazardsById;
  if (!seaHazardsById) return;

  const multiplier = phaseLabel === "SEVERE" || phaseLabel === "LOCKDOWN"
    ? 1.35
    : phaseLabel === "UNSTABLE"
      ? 1.15
      : phaseLabel === "CLEAR_WINDOW"
        ? 0.72
        : 1.0;

  for (const hazard of seaHazardsById.values()) {
    if (!hazard?.polygon?.length) continue;

    const [cx, cy] = centroid(hazard.polygon);
    polygon(ctx, hazard.polygon);

    const radius = hazard.hazardClass === "reef" ? 110 : 180;
    const gradient = ctx.createRadialGradient(cx, cy, 16, cx, cy, radius);

    if (hazard.hazardClass === "reef") {
      gradient.addColorStop(0, `rgba(166,236,214,${0.08 * multiplier})`);
      gradient.addColorStop(0.5, `rgba(110,182,168,${0.04 * multiplier})`);
      gradient.addColorStop(1, "rgba(110,182,168,0.00)");
    } else {
      gradient.addColorStop(0, `rgba(176,214,255,${0.08 * multiplier})`);
      gradient.addColorStop(0.55, `rgba(116,156,220,${0.04 * multiplier})`);
      gradient.addColorStop(1, "rgba(116,156,220,0.00)");
    }

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

function drawPhaseRadiationVeil(ctx, phaseLabel, tick) {
  const strength = getSkyPhaseStrength(phaseLabel);
  if (strength <= 0.12 && phaseLabel !== "CLEAR_WINDOW") return;

  if (phaseLabel === "CLEAR_WINDOW") {
    const glow = ctx.createRadialGradient(590, 250, 60, 590, 250, 760);
    glow.addColorStop(0, "rgba(255,250,236,0.12)");
    glow.addColorStop(0.32, "rgba(214,238,255,0.07)");
    glow.addColorStop(1, "rgba(180,220,255,0.00)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1180, 1240);
    return;
  }

  const pulse = 0.5 + (0.5 * Math.sin(tick * 0.045));
  const alphaA = (0.035 + (pulse * 0.02)) * strength;
  const alphaB = (0.03 + (pulse * 0.016)) * strength;

  const veilA = ctx.createLinearGradient(0, 0, 1180, 1240);
  veilA.addColorStop(0, `rgba(198,222,255,${alphaA})`);
  veilA.addColorStop(0.42, `rgba(132,170,228,${alphaB})`);
  veilA.addColorStop(1, "rgba(52,92,152,0.00)");
  ctx.fillStyle = veilA;
  ctx.fillRect(0, 0, 1180, 1240);

  if (phaseLabel === "SEVERE" || phaseLabel === "LOCKDOWN") {
    const veilB = ctx.createLinearGradient(0, 0, 0, 1240);
    veilB.addColorStop(0, `rgba(228,236,255,${0.03 + (strength * 0.04)})`);
    veilB.addColorStop(0.65, `rgba(126,152,204,${0.03 + (strength * 0.03)})`);
    veilB.addColorStop(1, "rgba(36,58,92,0.00)");
    ctx.fillStyle = veilB;
    ctx.fillRect(0, 0, 1180, 1240);
  }
}

function drawChargedCloudBands(ctx, phaseLabel, tick) {
  if (
    phaseLabel !== "BUILDING" &&
    phaseLabel !== "UNSTABLE" &&
    phaseLabel !== "SEVERE" &&
    phaseLabel !== "LOCKDOWN"
  ) {
    return;
  }

  const phaseStrength = getSkyPhaseStrength(phaseLabel);
  const drift = Math.sin(tick * 0.01) * 18;

  const bands = [
    { x: 110 + drift, y: 114, w: 280, h: 54, a: 0.032 + (phaseStrength * 0.028) },
    { x: 386 - (drift * 0.4), y: 170, w: 360, h: 62, a: 0.028 + (phaseStrength * 0.026) },
    { x: 728 + (drift * 0.7), y: 128, w: 270, h: 58, a: 0.03 + (phaseStrength * 0.03) },
    { x: 218 - (drift * 0.6), y: 246, w: 430, h: 72, a: 0.022 + (phaseStrength * 0.024) }
  ];

  ctx.save();
  for (const band of bands) {
    const gradient = ctx.createLinearGradient(band.x, band.y, band.x + band.w, band.y + band.h);
    gradient.addColorStop(0, `rgba(234,240,248,${band.a})`);
    gradient.addColorStop(0.5, `rgba(162,186,220,${band.a * 1.1})`);
    gradient.addColorStop(1, "rgba(98,128,170,0.00)");
    ctx.fillStyle = gradient;
    ctx.fillRect(band.x, band.y, band.w, band.h);
  }
  ctx.restore();
}

function drawStormChargeFlashes(ctx, phaseLabel, tick) {
  if (phaseLabel !== "SEVERE" && phaseLabel !== "LOCKDOWN") return;

  const pulseA = 0.5 + (0.5 * Math.sin((tick * 0.13) + 0.7));
  const pulseB = 0.5 + (0.5 * Math.sin((tick * 0.17) + 2.2));

  if (pulseA > 0.90) {
    ctx.fillStyle = `rgba(228,242,255,${(pulseA - 0.90) * 0.24})`;
    ctx.fillRect(0, 0, 1180, 1240);
  }

  if (pulseB > 0.94) {
    const gradient = ctx.createRadialGradient(820, 210, 20, 820, 210, 340);
    gradient.addColorStop(0, `rgba(244,250,255,${(pulseB - 0.94) * 1.6})`);
    gradient.addColorStop(0.3, `rgba(210,232,255,${(pulseB - 0.94) * 0.8})`);
    gradient.addColorStop(1, "rgba(210,232,255,0.00)");
    ctx.fillStyle = gradient;
    ctx.fillRect(520, 0, 520, 500);
  }
}

function drawDistanceVeil(ctx, phaseLabel) {
  const topVeil = ctx.createLinearGradient(0, 0, 0, 420);
  if (phaseLabel === "CLEAR_WINDOW") {
    topVeil.addColorStop(0, "rgba(255,255,255,0.03)");
    topVeil.addColorStop(1, "rgba(255,255,255,0.00)");
  } else if (phaseLabel === "LOCKDOWN" || phaseLabel === "SEVERE") {
    topVeil.addColorStop(0, "rgba(248,250,255,0.12)");
    topVeil.addColorStop(1, "rgba(255,255,255,0.00)");
  } else {
    topVeil.addColorStop(0, "rgba(255,255,255,0.06)");
    topVeil.addColorStop(1, "rgba(255,255,255,0.00)");
  }
  ctx.fillStyle = topVeil;
  ctx.fillRect(0, 0, 1180, 420);

  const lowerVeil = ctx.createLinearGradient(0, 700, 0, 1240);
  if (phaseLabel === "LOCKDOWN") {
    lowerVeil.addColorStop(0, "rgba(36,60,96,0.04)");
    lowerVeil.addColorStop(1, "rgba(12,20,34,0.18)");
  } else if (phaseLabel === "SEVERE") {
    lowerVeil.addColorStop(0, "rgba(34,66,106,0.03)");
    lowerVeil.addColorStop(1, "rgba(12,24,40,0.12)");
  } else {
    lowerVeil.addColorStop(0, "rgba(28,58,94,0.00)");
    lowerVeil.addColorStop(1, "rgba(14,28,46,0.08)");
  }
  ctx.fillStyle = lowerVeil;
  ctx.fillRect(0, 700, 1180, 540);
}

function drawVignette(ctx, phaseLabel) {
  const radius = phaseLabel === "CLEAR_WINDOW" ? 920 : 860;
  const alpha = phaseLabel === "LOCKDOWN"
    ? 0.16
    : phaseLabel === "SEVERE"
      ? 0.13
      : phaseLabel === "CLEAR_WINDOW"
        ? 0.06
        : 0.10;

  const gradient = ctx.createRadialGradient(590, 620, 220, 590, 620, radius);
  gradient.addColorStop(0, "rgba(0,0,0,0.00)");
  gradient.addColorStop(1, `rgba(10,18,28,${alpha})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1180, 1240);
}

function drawHarborChannelGuidanceGlow(ctx, kernel, tick, phaseLabel) {
  const channel = kernel?.coastlineModel?.harborChannel;
  if (!channel?.length) return;

  const pulse = 0.5 + (0.5 * Math.sin(tick * 0.05));
  const intensity = phaseLabel === "CLEAR_WINDOW"
    ? 1.2
    : phaseLabel === "LOCKDOWN"
      ? 0.7
      : phaseLabel === "SEVERE"
        ? 0.85
        : 1.0;

  strokePolygon(ctx, channel, `rgba(210,244,255,${(0.04 + (pulse * 0.03)) * intensity})`, 8);
  strokePolygon(ctx, channel, `rgba(160,214,246,${(0.03 + (pulse * 0.02)) * intensity})`, 14);
}

export function createEnvironmentRenderer() {
  const vegetationCache = new Map();

  function draw(ctx, runtime) {
    const { viewportOffset, kernel, tick = 0 } = runtime;
    const phaseLabel = getPhaseLabel(runtime);

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawGlobalSkyWash(ctx, phaseLabel);
    drawOpenSeaLightField(ctx, phaseLabel);
    drawPhaseRadiationVeil(ctx, phaseLabel, tick);
    drawChargedCloudBands(ctx, phaseLabel, tick);

    const waters = kernel?.watersById ? [...kernel.watersById.values()] : [];
    for (const row of waters) {
      if (!row?.polygon) continue;
      drawWaterBodyAtmosphere(ctx, row.polygon, tick, row.waterClass, phaseLabel);
      drawWaterBodyShimmer(ctx, row.polygon, tick, row.waterClass, phaseLabel);
    }

    drawHarborMist(ctx, kernel, phaseLabel);
    drawSeaHazardAtmosphere(ctx, kernel, phaseLabel);
    drawVegetationLayer(ctx, kernel, vegetationCache, phaseLabel);
    drawHarborChannelGuidanceGlow(ctx, kernel, tick, phaseLabel);
    drawStormChargeFlashes(ctx, phaseLabel, tick);
    drawDistanceVeil(ctx, phaseLabel);
    drawVignette(ctx, phaseLabel);

    ctx.restore();
  }

  return Object.freeze({ draw });
}
