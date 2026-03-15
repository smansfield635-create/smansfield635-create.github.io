function wrapAngle(value) {
  return Math.atan2(Math.sin(value), Math.cos(value));
}

function normalizeRuntimeState(runtime) {
  const orientation = runtime?.orientation ?? {};
  const cardinals = runtime?.cardinals ?? {};
  const resolvedState = runtime?.resolvedState ?? {};
  const harbor = resolvedState?.branches?.harbor ?? {};
  const localSelection = resolvedState?.localSelection ?? {};
  const auditLabels = resolvedState?.auditLabels ?? {};

  return Object.freeze({
    yaw: typeof orientation.yaw === "number" ? orientation.yaw : 0,
    heading: cardinals.heading ?? "N",
    harborLabel: harbor?.corePremise?.premise ?? harbor?.corePremise?.label ?? "harbor",
    recombination:
      harbor?.nodeConclusion?.exchangePremise ??
      harbor?.corePremise?.premise ??
      "—",
    branch: auditLabels.branch ?? "external.harbor",
    depth: resolvedState.activeDepthLabel ?? resolvedState.activeDepth ?? "—",
    zone: localSelection.zone ?? "—",
    row: Number.isInteger(localSelection.row) ? String(localSelection.row) : "—",
    col: Number.isInteger(localSelection.col) ? String(localSelection.col) : "—",
    cellId: localSelection.cellId ?? "—",
    activeScale: resolvedState.activeScale ?? "—"
  });
}

function drawCardinalRing(ctx, cx, cy, radius) {
  ctx.strokeStyle = "rgba(120, 169, 255, 0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCenterMarker(ctx, cx, cy) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy);
  ctx.lineTo(cx + 7, cy);
  ctx.moveTo(cx, cy - 7);
  ctx.lineTo(cx, cy + 7);
  ctx.stroke();
  ctx.restore();
}

function drawAxisGuides(ctx, cx, cy, radius) {
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx, cy + radius);
  ctx.moveTo(cx - radius, cy);
  ctx.lineTo(cx + radius, cy);
  ctx.stroke();
}

function drawLabels(ctx, cx, cy, radius) {
  ctx.fillStyle = "#e8eefc";
  ctx.font = "600 13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("N", cx, cy - radius - 8);
  ctx.fillText("S", cx, cy + radius + 16);
  ctx.fillText("E", cx + radius + 12, cy + 4);
  ctx.fillText("W", cx - radius - 12, cy + 4);
}

function drawHeadingNeedle(ctx, cx, cy, radius, yaw) {
  const angle = wrapAngle(yaw);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.fillStyle = "#79a9ff";
  ctx.beginPath();
  ctx.moveTo(0, -radius + 12);
  ctx.lineTo(8, -radius + 28);
  ctx.lineTo(-8, -radius + 28);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawOrientationText(ctx, cx, cy, state) {
  ctx.fillStyle = "rgba(232,238,252,0.82)";
  ctx.font = "500 11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(state.heading, cx, cy + 4);
}

function drawHarborReadout(ctx, cx, cy, radius, state) {
  ctx.font = "500 10px system-ui, sans-serif";
  ctx.fillStyle = "rgba(157,176,208,0.92)";
  ctx.textAlign = "center";
  ctx.fillText(state.harborLabel, cx, cy + radius + 34);
}

function drawBranchIndicator(ctx, cx, cy, radius, state) {
  ctx.font = "500 9px system-ui, sans-serif";
  ctx.fillStyle = "rgba(121,169,255,0.88)";
  ctx.textAlign = "center";
  ctx.fillText(state.branch, cx, cy - radius - 22);
}

function drawRecombinationReadout(ctx, cx, cy, radius, state) {
  ctx.font = "500 9px system-ui, sans-serif";
  ctx.fillStyle = "rgba(200,220,255,0.72)";
  ctx.textAlign = "center";
  ctx.fillText(state.recombination, cx, cy + radius + 48);
}

function drawAuditOverlay(ctx, cx, cy, radius, state) {
  ctx.save();
  ctx.font = "500 8px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.textAlign = "left";
  const left = cx - radius;
  const top = cy - radius - 40;
  ctx.fillText(`depth: ${state.depth}`, left, top);
  ctx.fillText(`zone: ${state.zone}`, left, top + 11);
  ctx.fillText(`cell: ${state.cellId}`, left, top + 22);
  ctx.fillText(`r:${state.row} c:${state.col}`, left, top + 33);
  ctx.restore();
}

export function createCompassRenderer() {
  function render(ctx, runtime) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) * 0.34;
    const state = normalizeRuntimeState(runtime);

    ctx.clearRect(0, 0, width, height);

    drawCardinalRing(ctx, cx, cy, radius);
    drawAxisGuides(ctx, cx, cy, radius);
    drawCenterMarker(ctx, cx, cy);
    drawLabels(ctx, cx, cy, radius);
    drawHeadingNeedle(ctx, cx, cy, radius, state.yaw);
    drawOrientationText(ctx, cx, cy, state);
    drawBranchIndicator(ctx, cx, cy, radius, state);
    drawHarborReadout(ctx, cx, cy, radius, state);
    drawRecombinationReadout(ctx, cx, cy, radius, state);
    drawAuditOverlay(ctx, cx, cy, radius, state);

    return Object.freeze({
      heading: state.heading,
      depth: state.depth,
      cellId: state.cellId
    });
  }

  return Object.freeze({
    render
  });
}
