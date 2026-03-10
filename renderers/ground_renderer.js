function drawHarborNavigationGraph(ctx, kernel) {
  const nav = kernel?.harborNavigationGraph;
  if (!nav) return;

  for (const edge of nav.navigationEdgesById.values()) {
    polyline(ctx, edge.centerline);

    ctx.lineWidth = Math.max(2, edge.nominalWidth * 0.08);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = "rgba(150,210,240,0.45)";
    ctx.stroke();
  }

  for (const node of nav.navigationNodesById.values()) {
    const [x, y] = node.centerPoint;

    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(190,240,255,0.95)";
    ctx.fill();
  }
}
