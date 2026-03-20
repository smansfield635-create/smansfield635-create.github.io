function drawSurfaceMesh(ctx, grid, topologyGrid, projectPoint) {
  if (!grid.length || !grid[0].length) return;

  const rowCount = grid.length;
  const colCount = grid[0].length;

  // 🔥 HARD DOWNSAMPLE (adaptive)
  const rowStep = rowCount > 80 ? 4 : 2;
  const colStep = colCount > 160 ? 4 : 2;

  ctx.save();

  for (let y = 0; y < rowCount - rowStep; y += rowStep) {
    const row = grid[y];
    const nextRow = grid[y + rowStep];

    for (let x = 0; x < colCount; x += colStep) {
      const nextX = (x + colStep) % colCount;

      const s00 = row[x];
      const s10 = row[nextX];
      const s01 = nextRow[x];
      const s11 = nextRow[nextX];

      const p00 = projectPoint(s00.latDeg, s00.lonDeg);
      const p10 = projectPoint(s10.latDeg, s10.lonDeg);
      const p01 = projectPoint(s01.latDeg, s01.lonDeg);
      const p11 = projectPoint(s11.latDeg, s11.lonDeg);

      if (!(p00.visible || p10.visible || p11.visible || p01.visible)) continue;

      // 🔥 SINGLE SAMPLE COLOR (no blending, no interpolation)
      const appearance = describeSurface(s00, p00, null);

      ctx.globalAlpha = appearance.fillAlpha;
      ctx.fillStyle = `rgb(${appearance.fillColor.r|0},${appearance.fillColor.g|0},${appearance.fillColor.b|0})`;

      ctx.beginPath();
      ctx.moveTo(p00.x, p00.y);
      ctx.lineTo(p10.x, p10.y);
      ctx.lineTo(p11.x, p11.y);
      ctx.lineTo(p01.x, p01.y);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}
