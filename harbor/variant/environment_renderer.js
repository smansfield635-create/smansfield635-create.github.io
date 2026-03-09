function polygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function polyline(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
}

const SEDIMENT_WEST = [
  [520, 1080], [500, 1000], [498, 920], [508, 840], [530, 760],
  [560, 690], [596, 620], [636, 560], [670, 500], [692, 430],
  [702, 360], [690, 290], [662, 220], [620, 170]
];

const SEDIMENT_EAST = [
  [548, 1080], [580, 1000], [620, 920], [670, 850], [730, 780],
  [790, 710], [850, 640], [912, 560], [972, 480], [1030, 420], [1086, 370]
];

const HARBOR_WATER_CORE = [
  [448, 648],
  [458, 610],
  [488, 584],
  [540, 572],
  [594, 580],
  [624, 604],
  [634, 648]
];

const HARBOR_WATER_SHELL = [
  [430, 668],
  [438, 616],
  [472, 574],
  [530, 554],
  [598, 562],
  [640, 592],
  [656, 648],
  [642, 688],
  [592, 706],
  [522, 706],
  [462, 692]
];

const HARBOR_REFLECT_LINE = [
  [468, 606],
  [500, 590],
  [544, 584],
  [590, 590],
  [620, 606]
];

const BASIN_WATER_CORE = [
  [454, 328],
  [478, 286],
  [522, 256],
  [576, 248],
  [626, 258],
  [664, 284],
  [684, 322],
  [676, 358],
  [642, 386],
  [590, 400],
  [534, 396],
  [486, 378]
];

const BASIN_WATER_SHELL = [
  [438, 346],
  [462, 292],
  [510, 248],
  [572, 232],
  [638, 244],
  [686, 278],
  [710, 330],
  [700, 378],
  [656, 414],
  [594, 430],
  [524, 426],
  [468, 402]
];

const BASIN_REFLECT_LINE = [
  [470, 370],
  [514, 390],
  [566, 396],
  [618, 390],
  [660, 370]
];

function drawSoftEnvelope(ctx, points, gradientFactory, shadowColor, shadowBlur) {
  ctx.save();
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  polygon(ctx, points);
  ctx.fillStyle = gradientFactory();
  ctx.fill();
  ctx.restore();
}

function drawCoreWater(ctx, points, gradientFactory, rimColor, rimWidth = 1.2) {
  polygon(ctx, points);
  ctx.fillStyle = gradientFactory();
  ctx.fill();

  polygon(ctx, points);
  ctx.lineWidth = rimWidth;
  ctx.strokeStyle = rimColor;
  ctx.stroke();
}

function drawReflectLine(ctx, points, color, width) {
  polyline(ctx, points);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function createEnvironmentRenderer() {
  function draw(ctx, runtime) {
    const { viewportOffset, tick } = runtime;

    ctx.save();
    ctx.translate(viewportOffset.x, viewportOffset.y);

    drawCoastTransition(ctx);
    drawBasinWater(ctx, tick);
    drawHarborWater(ctx, tick);

    ctx.restore();
  }

  function drawCoastTransition(ctx) {
    sedimentBand(ctx, SEDIMENT_WEST, 18, 0.12, 0.07);
    sedimentBand(ctx, SEDIMENT_EAST, 14, 0.08, 0.05);
  }

  function sedimentBand(ctx, points, inset, alphaTop, alphaBottom) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    for (let i = points.length - 1; i >= 0; i -= 1) {
      ctx.lineTo(points[i][0] - inset, points[i][1]);
    }
    ctx.closePath();

    const g = ctx.createLinearGradient(0, 0, 0, 1200);
    g.addColorStop(0, `rgba(170,144,104,${alphaTop})`);
    g.addColorStop(1, `rgba(126,110,82,${alphaBottom})`);
    ctx.fillStyle = g;
    ctx.fill();
  }

  function drawHarborWater(ctx, tick) {
    const phase = tick * 0.010;
    const driftX = Math.sin(phase) * 12;
    const driftY = Math.cos(phase * 0.86) * 8;

    drawSoftEnvelope(
      ctx,
      HARBOR_WATER_SHELL,
      () => {
        const g = ctx.createRadialGradient(
          544 + (driftX * 0.35),
          614 + (driftY * 0.25),
          10,
          548,
          636,
          132
        );
        g.addColorStop(0, "rgba(214,248,236,0.34)");
        g.addColorStop(0.44, "rgba(144,228,218,0.24)");
        g.addColorStop(0.78, "rgba(94,194,198,0.12)");
        g.addColorStop(1, "rgba(94,194,198,0)");
        return g;
      },
      "rgba(110,220,214,0.16)",
      26
    );

    drawCoreWater(
      ctx,
      HARBOR_WATER_CORE,
      () => {
        const g = ctx.createLinearGradient(
          454 + driftX,
          578 + driftY,
          636 - driftX,
          652 - driftY
        );
        g.addColorStop(0, "rgba(182,236,226,0.98)");
        g.addColorStop(0.26, "rgba(132,214,210,0.97)");
        g.addColorStop(0.56, "rgba(78,168,186,0.97)");
        g.addColorStop(1, "rgba(42,102,130,0.98)");
        return g;
      },
      "rgba(238,250,246,0.12)",
      1.0
    );

    drawSoftEnvelope(
      ctx,
      HARBOR_WATER_CORE,
      () => {
        const g = ctx.createRadialGradient(
          516 + (driftX * 0.5),
          596 + (driftY * 0.3),
          4,
          532,
          606,
          94
        );
        g.addColorStop(0, "rgba(250,255,252,0.16)");
        g.addColorStop(0.45, "rgba(236,252,246,0.06)");
        g.addColorStop(1, "rgba(236,252,246,0)");
        return g;
      },
      "rgba(0,0,0,0)",
      0
    );

    drawReflectLine(
      ctx,
      HARBOR_REFLECT_LINE,
      "rgba(244,252,248,0.18)",
      2.2
    );
  }

  function drawBasinWater(ctx, tick) {
    const phase = tick * 0.0075;
    const driftX = Math.sin(phase) * 8;
    const driftY = Math.cos(phase * 0.78) * 6;

    drawSoftEnvelope(
      ctx,
      BASIN_WATER_SHELL,
      () => {
        const g = ctx.createRadialGradient(
          568 + (driftX * 0.28),
          322 + (driftY * 0.22),
          12,
          574,
          334,
          146
        );
        g.addColorStop(0, "rgba(188,226,226,0.22)");
        g.addColorStop(0.48, "rgba(122,186,198,0.16)");
        g.addColorStop(0.82, "rgba(82,148,170,0.08)");
        g.addColorStop(1, "rgba(82,148,170,0)");
        return g;
      },
      "rgba(94,170,190,0.10)",
      20
    );

    drawCoreWater(
      ctx,
      BASIN_WATER_CORE,
      () => {
        const g = ctx.createLinearGradient(
          464 + driftX,
          252 + driftY,
          684 - driftX,
          398 - driftY
        );
        g.addColorStop(0, "rgba(138,198,206,0.96)");
        g.addColorStop(0.34, "rgba(94,154,176,0.96)");
        g.addColorStop(0.72, "rgba(56,116,146,0.97)");
        g.addColorStop(1, "rgba(34,88,122,0.98)");
        return g;
      },
      "rgba(238,246,248,0.08)",
      1.0
    );

    drawSoftEnvelope(
      ctx,
      BASIN_WATER_CORE,
      () => {
        const g = ctx.createRadialGradient(
          530 + (driftX * 0.45),
          292 + (driftY * 0.3),
          4,
          548,
          304,
          86
        );
        g.addColorStop(0, "rgba(242,250,250,0.10)");
        g.addColorStop(0.52, "rgba(228,244,246,0.04)");
        g.addColorStop(1, "rgba(228,244,246,0)");
        return g;
      },
      "rgba(0,0,0,0)",
      0
    );

    drawReflectLine(
      ctx,
      BASIN_REFLECT_LINE,
      "rgba(236,246,250,0.12)",
      1.8
    );
  }

  return Object.freeze({ draw });
}
