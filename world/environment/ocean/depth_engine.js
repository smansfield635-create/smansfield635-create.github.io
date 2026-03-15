export function createDepthEngine() {
  const GRID_SIZE = 16;
  const CELL_COUNT = GRID_SIZE * GRID_SIZE;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
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
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1.0;
    let totalAmplitude = 0;

    for (let i = 0; i < 4; i += 1) {
      value += valueNoise(x * frequency, y * frequency) * amplitude;
      totalAmplitude += amplitude;
      amplitude *= 0.5;
      frequency *= 2.0;
    }

    return totalAmplitude > 0 ? value / totalAmplitude : 0;
  }

  function hexToRgb(hex) {
    const normalized = hex.replace("#", "");
    const bigint = Number.parseInt(normalized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }

  function mixColor(a, b, t) {
    return {
      r: Math.round(lerp(a.r, b.r, t)),
      g: Math.round(lerp(a.g, b.g, t)),
      b: Math.round(lerp(a.b, b.b, t))
    };
  }

  function colorToString(color, alpha = 1) {
    return `rgba(${color.r},${color.g},${color.b},${alpha})`;
  }

  function getPalette() {
    return Object.freeze({
      shelfGlow: hexToRgb("#74f3e6"),
      shelf: hexToRgb("#34d9d0"),
      shallow: hexToRgb("#1fbecf"),
      mid: hexToRgb("#178fcb"),
      deep: hexToRgb("#0c5aa8"),
      abyss: hexToRgb("#062c6e"),
      trench: hexToRgb("#02153f")
    });
  }

  function getDepthSample(nx, ny) {
    const continentMaskA = fbm(nx * 2.2 + 3.1, ny * 2.2 + 7.4);
    const continentMaskB = fbm(nx * 4.1 + 11.8, ny * 4.1 + 2.9);
    const basinNoise = fbm(nx * 6.0 + 17.0, ny * 6.0 + 23.0);
    const trenchNoise = fbm(nx * 12.0 + 31.0, ny * 12.0 + 41.0);

    const continentalShelf = smoothstep(0.50, 0.80, continentMaskA * 0.68 + continentMaskB * 0.32);
    const basinBias = smoothstep(0.18, 0.88, basinNoise);
    const trenchBias = smoothstep(0.72, 0.95, trenchNoise);

    const radialDistance = Math.sqrt(nx * nx + ny * ny);
    const polarBias = smoothstep(0.10, 1.0, Math.abs(ny));
    const equatorialBias = 1.0 - polarBias;
    const edgeDeepening = smoothstep(0.55, 1.0, radialDistance);

    let depth =
      0.18 +
      basinBias * 0.36 +
      edgeDeepening * 0.18 +
      equatorialBias * 0.05 -
      continentalShelf * 0.32;

    depth += trenchBias * 0.22;
    depth = clamp(depth, 0, 1);

    return Object.freeze({
      depth,
      shelf: continentalShelf,
      basin: basinBias,
      trench: trenchBias,
      edge: edgeDeepening,
      polar: polarBias
    });
  }

  function getDepthColor(sample, palette) {
    const { depth, shelf, trench } = sample;

    let color;
    if (depth < 0.18) {
      const t = smoothstep(0.00, 0.18, depth);
      color = mixColor(palette.shelfGlow, palette.shelf, t);
    } else if (depth < 0.36) {
      const t = smoothstep(0.18, 0.36, depth);
      color = mixColor(palette.shelf, palette.shallow, t);
    } else if (depth < 0.56) {
      const t = smoothstep(0.36, 0.56, depth);
      color = mixColor(palette.shallow, palette.mid, t);
    } else if (depth < 0.76) {
      const t = smoothstep(0.56, 0.76, depth);
      color = mixColor(palette.mid, palette.deep, t);
    } else if (depth < 0.90) {
      const t = smoothstep(0.76, 0.90, depth);
      color = mixColor(palette.deep, palette.abyss, t);
    } else {
      const t = smoothstep(0.90, 1.00, depth);
      color = mixColor(palette.abyss, palette.trench, t);
    }

    if (shelf > 0.64) {
      color = mixColor(color, palette.shelfGlow, smoothstep(0.64, 1.0, shelf) * 0.24);
    }

    if (trench > 0.82) {
      color = mixColor(color, palette.trench, smoothstep(0.82, 1.0, trench) * 0.34);
    }

    return color;
  }

  function buildDepthGrid() {
    const palette = getPalette();
    const cells = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        const nx = (col / (GRID_SIZE - 1)) * 2 - 1;
        const ny = (row / (GRID_SIZE - 1)) * 2 - 1;
        const sample = getDepthSample(nx, ny);
        const color = getDepthColor(sample, palette);

        cells.push(
          Object.freeze({
            row,
            col,
            nx,
            ny,
            ...sample,
            color
          })
        );
      }
    }

    return Object.freeze(cells);
  }

  function drawBaseOceanBody(ctx, centerX, centerY, radius) {
    const baseGradient = ctx.createRadialGradient(
      centerX - radius * 0.26,
      centerY - radius * 0.24,
      radius * 0.04,
      centerX + radius * 0.10,
      centerY + radius * 0.10,
      radius * 1.02
    );

    baseGradient.addColorStop(0.00, "#74f3e6");
    baseGradient.addColorStop(0.10, "#35d9d1");
    baseGradient.addColorStop(0.22, "#1ebfd0");
    baseGradient.addColorStop(0.40, "#178ecb");
    baseGradient.addColorStop(0.60, "#0c5aa8");
    baseGradient.addColorStop(0.82, "#062c6e");
    baseGradient.addColorStop(1.00, "#02153f");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = baseGradient;
    ctx.fill();
  }

  function drawDepthCells(ctx, centerX, centerY, radius, cells) {
    const cellWidth = (radius * 2) / GRID_SIZE;
    const cellHeight = (radius * 2) / GRID_SIZE;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    for (let i = 0; i < CELL_COUNT; i += 1) {
      const cell = cells[i];
      const x = centerX - radius + cell.col * cellWidth;
      const y = centerY - radius + cell.row * cellHeight;
      const cellCenterX = x + cellWidth * 0.5;
      const cellCenterY = y + cellHeight * 0.5;

      const dx = (cellCenterX - centerX) / radius;
      const dy = (cellCenterY - centerY) / radius;
      const circleFit = dx * dx + dy * dy;

      if (circleFit > 1.0) continue;

      const alpha =
        0.26 +
        (1 - cell.depth) * 0.12 +
        cell.shelf * 0.10 +
        cell.trench * 0.06;

      ctx.fillStyle = colorToString(cell.color, clamp(alpha, 0.18, 0.42));
      ctx.fillRect(x, y, cellWidth + 0.5, cellHeight + 0.5);
    }

    ctx.restore();
  }

  function drawShelfGlow(ctx, centerX, centerY, radius) {
    const glow = ctx.createRadialGradient(
      centerX - radius * 0.18,
      centerY - radius * 0.14,
      radius * 0.05,
      centerX,
      centerY,
      radius
    );

    glow.addColorStop(0.00, "rgba(170,255,244,0.12)");
    glow.addColorStop(0.18, "rgba(110,245,232,0.08)");
    glow.addColorStop(0.45, "rgba(58,213,209,0.04)");
    glow.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  function drawNightVignette(ctx, centerX, centerY, radius) {
    const night = ctx.createLinearGradient(
      centerX - radius,
      centerY - radius * 0.12,
      centerX + radius * 0.94,
      centerY + radius * 0.16
    );

    night.addColorStop(0.00, "rgba(0,0,0,0.26)");
    night.addColorStop(0.28, "rgba(0,0,0,0.16)");
    night.addColorStop(0.58, "rgba(0,0,0,0.05)");
    night.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
    ctx.fillStyle = night;
    ctx.fill();
  }

  function drawSpecularWaterSheen(ctx, centerX, centerY, radius) {
    const sheen = ctx.createRadialGradient(
      centerX - radius * 0.32,
      centerY - radius * 0.28,
      radius * 0.02,
      centerX - radius * 0.18,
      centerY - radius * 0.16,
      radius * 0.58
    );

    sheen.addColorStop(0.00, "rgba(255,255,255,0.13)");
    sheen.addColorStop(0.20, "rgba(210,255,250,0.08)");
    sheen.addColorStop(0.42, "rgba(120,245,235,0.04)");
    sheen.addColorStop(1.00, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.99, 0, Math.PI * 2);
    ctx.fillStyle = sheen;
    ctx.fill();
  }

  function drawSubtleDepthBands(ctx, centerX, centerY, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.992, 0, Math.PI * 2);
    ctx.clip();

    ctx.strokeStyle = "rgba(120,250,236,0.045)";
    ctx.lineWidth = 1.4;

    for (let i = 0; i < 5; i += 1) {
      const bandRadius = radius * (0.30 + i * 0.11);
      ctx.beginPath();
      ctx.arc(
        centerX + radius * 0.04,
        centerY + radius * (i - 2) * 0.02,
        bandRadius,
        0.18 * Math.PI,
        0.82 * Math.PI
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function render(ctx, projector) {
    const { centerX, centerY, radius } = projector.state;
    const cells = buildDepthGrid();

    drawBaseOceanBody(ctx, centerX, centerY, radius);
    drawDepthCells(ctx, centerX, centerY, radius, cells);
    drawShelfGlow(ctx, centerX, centerY, radius);
    drawNightVignette(ctx, centerX, centerY, radius);
    drawSpecularWaterSheen(ctx, centerX, centerY, radius);
    drawSubtleDepthBands(ctx, centerX, centerY, radius);

    return Object.freeze({
      gridSize: GRID_SIZE,
      cellCount: CELL_COUNT
    });
  }

  return Object.freeze({
    render
  });
}
