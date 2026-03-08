(function () {
  "use strict";

  const TAU = Math.PI * 2;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function polyCenter(poly) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < poly.length; i++) {
      x += poly[i].x;
      y += poly[i].y;
    }
    return { x: x / poly.length, y: y / poly.length };
  }

  function insetPoly(poly, amount) {
    const c = polyCenter(poly);
    return poly.map((p) => ({
      x: lerp(p.x, c.x, amount),
      y: lerp(p.y, c.y, amount),
    }));
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  function spherify(x, y, z, blend) {
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const sx = x / len;
    const sy = y / len;
    const sz = z / len;
    return {
      x: lerp(x, sx, blend),
      y: lerp(y, sy, blend),
      z: lerp(z, sz, blend),
    };
  }

  function rotateVertex(x, y, z, rotY, rotX) {
    const cy = Math.cos(rotY);
    const sy = Math.sin(rotY);
    const cx = Math.cos(rotX);
    const sx = Math.sin(rotX);

    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    const y2 = y * cx - z1 * sx;
    const z2 = y * sx + z1 * cx;

    return { x: x1, y: y2, z: z2 };
  }

  function project(width, height, preset, cameraRequested, x, y, z) {
    const perspective = 420 / (420 + z + preset.perspectiveBias);
    const travelBias = cameraRequested === "travel_projection" ? 0.03 : 0;
    const aerialBias =
      cameraRequested === "aerial_one" ? 0.06 : cameraRequested === "aerial_two" ? 0.12 : 0;

    return {
      x: width * 0.5 + x * perspective,
      y: height * (preset.cubeYOffset + 0.26 + aerialBias) + y * perspective - z * (travelBias + aerialBias),
      scale: perspective,
    };
  }

  function getCubeGeometry(options) {
    const width = options.width;
    const height = options.height;
    const preset = options.preset;
    const rotX = options.rotX;
    const rotY = options.rotY;
    const morphPulse = options.morphPulse || 0;

    const size = Math.min(width, height) * preset.cubeScale;
    const pulse = 1 + morphPulse * 0.03;
    const soften = 0.42;

    const vertsRaw = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];

    const faces3D = {
      M: [0, 1, 2, 3],
      C: [4, 5, 6, 7],
      W: [0, 3, 7, 4],
      E: [1, 2, 6, 5],
      N: [3, 2, 6, 7],
      S: [0, 1, 5, 4],
    };

    const rotated = [];
    const pts = [];

    for (let i = 0; i < vertsRaw.length; i++) {
      const v = vertsRaw[i];
      const sv = spherify(v[0], v[1], v[2], soften);
      const p = rotateVertex(sv.x * size * pulse, sv.y * size * pulse, sv.z * size * pulse, rotY, rotX);
      rotated.push(p);
      pts.push(project(width, height, preset, options.cameraRequested, p.x, p.y, p.z));
    }

    const faces2D = {
      M: [pts[0], pts[1], pts[2], pts[3]],
      C: [pts[4], pts[5], pts[6], pts[7]],
      W: [pts[0], pts[3], pts[7], pts[4]],
      E: [pts[1], pts[2], pts[6], pts[5]],
      N: [pts[3], pts[2], pts[6], pts[7]],
      S: [pts[0], pts[1], pts[5], pts[4]],
    };

    const renderFaces = Object.entries(faces3D)
      .map(([key, idxs]) => {
        const avgZ = (rotated[idxs[0]].z + rotated[idxs[1]].z + rotated[idxs[2]].z + rotated[idxs[3]].z) / 4;
        return { key, idxs, avgZ };
      })
      .sort((a, b) => a.avgZ - b.avgZ);

    const faceCenters = {};
    Object.keys(faces2D).forEach((k) => {
      faceCenters[k] = polyCenter(faces2D[k]);
    });

    const centerX = (pts[4].x + pts[5].x + pts[6].x + pts[7].x) / 4;
    const centerY = (pts[4].y + pts[5].y + pts[6].y + pts[7].y) / 4;

    return {
      pts,
      rotated,
      edges,
      faces: faces2D,
      renderFaces,
      faceCenters,
      centerX,
      centerY,
      size,
    };
  }

  function faceBaseFill(key) {
    if (key === "C") return "rgba(139,0,0,0.14)";
    if (key === "N") return "rgba(176,24,24,0.12)";
    if (key === "E" || key === "W") return "rgba(120,0,0,0.10)";
    if (key === "S") return "rgba(35,0,0,0.08)";
    return "rgba(70,0,0,0.06)";
  }

  function getSafeMeta(meta, key) {
    if (meta && typeof meta.short === "string" && meta.short.length) return meta;
    if (key === "C") return { short: "CORE" };
    if (key === "M") return { short: "M" };
    return { short: key };
  }

  function drawCompassPlate(ctx, poly, key, meta, hoverFace) {
    const safeMeta = getSafeMeta(meta, key);
    const c = polyCenter(poly);

    if (key === "C" || key === "M") {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(255,244,224,0.96)";
      ctx.font = `700 ${key === "C" || key === "M" ? "8" : "10"}px system-ui,Segoe UI,Roboto,sans-serif`;
      ctx.fillText(safeMeta.short, c.x, c.y + 1.5);
      ctx.restore();
      return;
    }

    let edgeMid;
    if (key === "N") edgeMid = { x: (poly[0].x + poly[1].x) * 0.5, y: (poly[0].y + poly[1].y) * 0.5 };
    else if (key === "E") edgeMid = { x: (poly[1].x + poly[2].x) * 0.5, y: (poly[1].y + poly[2].y) * 0.5 };
    else if (key === "S") edgeMid = { x: (poly[2].x + poly[3].x) * 0.5, y: (poly[2].y + poly[3].y) * 0.5 };
    else edgeMid = { x: (poly[3].x + poly[0].x) * 0.5, y: (poly[3].y + poly[0].y) * 0.5 };

    const px = lerp(c.x, edgeMid.x, 0.56);
    const py = lerp(c.y, edgeMid.y, 0.56);
    const w = 22;
    const h = 14;

    ctx.save();
    roundedRectPath(ctx, px - w * 0.5, py - h * 0.5, w, h, 4.5);
    ctx.fillStyle = hoverFace === key ? "rgba(28,20,16,0.86)" : "rgba(10,10,12,0.72)";
    ctx.fill();
    ctx.lineWidth = 1.0;
    ctx.strokeStyle = hoverFace === key ? "rgba(255,230,176,0.94)" : "rgba(212,175,88,0.78)";
    ctx.stroke();
    ctx.fillStyle = "rgba(255,238,190,0.96)";
    ctx.font = 'italic 700 10px "Georgia","Times New Roman",serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(safeMeta.short, px, py + 0.5);
    ctx.restore();
  }

  function drawBeveledFace(ctx, poly, key, meta, hoverFace) {
    const inner = insetPoly(poly, 0.18);
    const deep = insetPoly(poly, 0.33);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
    ctx.closePath();
    ctx.fillStyle = faceBaseFill(key);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(inner[0].x, inner[0].y);
    for (let i = 1; i < inner.length; i++) ctx.lineTo(inner[i].x, inner[i].y);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(deep[0].x, deep[0].y);
    for (let i = 1; i < deep.length; i++) ctx.lineTo(deep[i].x, deep[i].y);
    ctx.closePath();
    ctx.lineWidth = 0.9;
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.stroke();
    ctx.restore();

    drawCompassPlate(ctx, inner, key, meta, hoverFace);
  }

  function drawCompassHalo(ctx, geo, tick) {
    const r = geo.size * 2.3;

    ctx.save();
    ctx.translate(geo.centerX, geo.centerY);
    ctx.rotate(tick * 0.0012);
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = "rgba(220,185,102,0.72)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.4, 0, 0, TAU);
    ctx.stroke();

    const marks = ["N", "E", "S", "W"];
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i / 4) * TAU;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r * 0.4;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = "rgba(255,226,170,0.72)";
      ctx.font = 'italic 700 11px "Georgia","Times New Roman",serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(marks[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawCube(ctx, geo, tick, faceMetaResolver, hoverFace) {
    drawCompassHalo(ctx, geo, tick);

    for (let i = 0; i < geo.renderFaces.length; i++) {
      const face = geo.renderFaces[i];
      const poly = face.idxs.map((idx) => geo.pts[idx]);
      const meta = typeof faceMetaResolver === "function" ? faceMetaResolver(face.key) : null;
      drawBeveledFace(ctx, poly, face.key, meta, hoverFace);
    }

    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = "rgba(255,215,0,0.16)";

    for (let i = 0; i < geo.edges.length; i++) {
      const e = geo.edges[i];
      const a = geo.rotated[e[0]].z + geo.rotated[e[1]].z;
      ctx.beginPath();
      ctx.moveTo(geo.pts[e[0]].x, geo.pts[e[0]].y);
      ctx.lineTo(geo.pts[e[1]].x, geo.pts[e[1]].y);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = a < 0 ? "rgba(255,215,0,0.24)" : "rgba(255,215,0,0.56)";
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawNavigationStick(ctx, geo) {
    const cx = geo.centerX;
    const cy = geo.centerY;
    const stickH = geo.size * 3.2;

    ctx.save();
    ctx.globalAlpha = 0.92;
    roundedRectPath(ctx, cx - 16, cy - stickH * 0.52, 32, stickH, 16);
    ctx.fillStyle = "rgba(18,12,18,0.78)";
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(212,175,88,0.74)";
    ctx.stroke();

    const labels = ["N", "E", "S", "W", "C", "M"];
    for (let i = 0; i < labels.length; i++) {
      const ly = cy - stickH * 0.4 + i * (stickH / 5.2);
      roundedRectPath(ctx, cx - 12, ly - 9, 24, 18, 9);
      ctx.fillStyle = "rgba(10,10,12,0.68)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,220,160,0.26)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255,242,210,0.92)";
      ctx.font = "700 9px system-ui,Segoe UI,Roboto,sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i], cx, ly + 0.5);
    }

    ctx.restore();
  }

  window.OPENWORLD_COMPASS_RENDERER = Object.freeze({
    version: "OPENWORLD_COMPASS_RENDERER_v2",
    getCubeGeometry,
    drawCube,
    drawNavigationStick,
  });
})();
