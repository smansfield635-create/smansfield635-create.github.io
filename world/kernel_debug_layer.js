export function createKernelDebugLayer() {

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeNumber(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
  }

  function safeSize(mapLike) {
    if (!mapLike) return 0;
    if (typeof mapLike.size === "number") return mapLike.size;
    if (Array.isArray(mapLike)) return mapLike.length;
    if (typeof mapLike.values === "function") return [...mapLike.values()].length;
    return 0;
  }

  function getWorldMeta(runtime) {
    return runtime?.kernel?.worldMeta ?? null;
  }

  function getKernel(runtime) {
    return runtime?.kernel ?? null;
  }

  function getProjection(runtime) {
    return runtime?.projection ?? null;
  }

  function getRegion(runtime) {
    return runtime?.region ?? null;
  }

  function getEncoding(runtime) {
    return runtime?.encoding ?? null;
  }

  function getPlayer(runtime) {
    return runtime?.player ?? { x: 0, y: 0, speed: 0 };
  }

  function getPhase(runtime) {
    return runtime?.phase ?? { globalPhase: "UNKNOWN", intensity: 0 };
  }

  function getViewport(runtime) {
    return {
      width: normalizeNumber(runtime?.width, 1180),
      height: normalizeNumber(runtime?.height, 1240)
    };
  }

  function getWorldBounds(runtime) {
    return {
      width: normalizeNumber(runtime?.worldBounds?.width, 1180),
      height: normalizeNumber(runtime?.worldBounds?.height, 1240)
    };
  }

  function getProjector(runtime) {
    return runtime?.surfaceProjector ?? null;
  }

  function getPlanetBody(runtime) {
    return getProjector(runtime)?.body ?? null;
  }

  function formatNumber(value, digits = 2) {
    return Number.isFinite(value) ? value.toFixed(digits) : "—";
  }

  function formatInteger(value) {
    return Number.isFinite(value) ? String(Math.round(value)) : "—";
  }

  function formatText(value) {
    return typeof value === "string" && value.length > 0 ? value : "—";
  }

  function formatBoolean(value) {
    return value ? "YES" : "NO";
  }

  function collectNorthDiagnostics(runtime) {
    const kernel = getKernel(runtime);
    const worldMeta = getWorldMeta(runtime);
    const phase = getPhase(runtime);

    return {
      title: "NORTH · KERNEL",
      lines: [
        `WORLD ${formatText(worldMeta?.worldId)}`,
        `ENCODING_FAMILY ${formatText(worldMeta?.encodingFamilyVersion)}`,
        `PHASE ${formatText(phase?.globalPhase)}`,
        `STRESS ${formatNumber(phase?.intensity, 3)}`,
        `REGIONS ${formatInteger(safeSize(kernel?.regionsById))}`,
        `PATHS ${formatInteger(safeSize(kernel?.pathsById))}`,
        `HAZARDS ${formatInteger(safeSize(kernel?.hazardsById))}`,
        `WATERS ${formatInteger(safeSize(kernel?.watersById))}`,
        `ENCODINGS ${formatInteger(safeSize(kernel?.encodingsById))}`,
        `CELLS ${formatInteger(safeSize(kernel?.diamondCellsById))}`,
        `HARBOR_NODES ${formatInteger(safeSize(kernel?.harborNavigationGraph?.navigationNodesById))}`,
        `SEA_NODES ${formatInteger(safeSize(kernel?.maritimeNetwork?.seaNodesById))}`
      ]
    };
  }

  function collectSouthDiagnostics(runtime) {
    const viewport = getViewport(runtime);
    const worldBounds = getWorldBounds(runtime);
    const player = getPlayer(runtime);
    const projection = getProjection(runtime);
    const projector = getProjector(runtime);
    const body = getPlanetBody(runtime);

    const projectedPlayer = projector
      ? projector.point(player.x, player.y)
      : null;

    return {
      title: "SOUTH · PROJECTION",
      lines: [
        `VIEW ${formatInteger(viewport.width)} × ${formatInteger(viewport.height)}`,
        `WORLD ${formatInteger(worldBounds.width)} × ${formatInteger(worldBounds.height)}`,
        `PLAYER_X ${formatNumber(player.x, 2)}`,
        `PLAYER_Y ${formatNumber(player.y, 2)}`,
        `SCREEN_X ${formatNumber(projectedPlayer?.x, 2)}`,
        `SCREEN_Y ${formatNumber(projectedPlayer?.y, 2)}`,
        `SCALE ${formatNumber(projectedPlayer?.scale, 3)}`,
        `PLANET_CX ${formatNumber(body?.centerX, 2)}`,
        `PLANET_CY ${formatNumber(body?.centerY, 2)}`,
        `PLANET_R ${formatNumber(body?.radius, 2)}`,
        `HORIZON_Y ${formatNumber(body?.horizonY, 2)}`,
        `PROJECTION_OK ${formatBoolean(Boolean(projection))}`
      ]
    };
  }

  function collectEastDiagnostics(runtime) {
    const projection = getProjection(runtime);
    const region = getRegion(runtime);
    const encoding = getEncoding(runtime);
    const player = getPlayer(runtime);

    return {
      title: "EAST · RUNTIME",
      lines: [
        `REGION ${formatText(region?.displayName ?? region?.regionId)}`,
        `CELL ${formatText(projection?.cellId)}`,
        `SECTOR ${formatText(projection?.sector)}`,
        `BAND ${projection?.bandIndex ?? "—"}`,
        `ENCODING ${formatText(encoding?.displayName ?? encoding?.encodingId)}`,
        `BYTE ${formatText(projection?.stateByte)}`,
        `MODE ${formatText(runtime?.traversalMode ?? "foot").toUpperCase()}`,
        `TICK ${formatInteger(runtime?.tick)}`,
        `PLAYER_SPEED ${formatNumber(player?.speed, 2)}`,
        `HAS_DEST ${formatBoolean(Boolean(runtime?.destination))}`,
        `HAS_SELECT ${formatBoolean(Boolean(runtime?.selection))}`,
        `RENDER_MODE ${formatText(runtime?.renderMode ?? "styled").toUpperCase()}`
      ]
    };
  }

  function collectWestDiagnostics(runtime) {
    const kernel = getKernel(runtime);

    return {
      title: "WEST · DATASETS",
      lines: [
        `BOUNDARIES ${formatInteger(safeSize(kernel?.regionBoundariesById))}`,
        `TERRAIN_ACTIVE ${formatInteger(safeSize(kernel?.terrainPolygonsById))}`,
        `SUBSTRATE_ACTIVE ${formatInteger(safeSize(kernel?.substratePolygonsById))}`,
        `TERRAIN_LEGACY ${formatInteger(safeSize(kernel?.legacyTerrainPolygonsById))}`,
        `SUBSTRATE_LEGACY ${formatInteger(safeSize(kernel?.legacySubstratePolygonsById))}`,
        `TERRAIN_GEN ${formatInteger(safeSize(kernel?.generatedTerrainPolygonsById))}`,
        `SUBSTRATE_GEN ${formatInteger(safeSize(kernel?.generatedSubstratePolygonsById))}`,
        `COASTAL_DOMAINS ${formatInteger(safeSize(kernel?.coastalBlueprint?.coastalDomainsById))}`,
        `TERRAIN_TEMPLATES ${formatInteger(safeSize(kernel?.templateRegistry?.terrainTemplatesById))}`,
        `SUBSTRATE_TEMPLATES ${formatInteger(safeSize(kernel?.templateRegistry?.substrateTemplatesById))}`,
        `REGION_TEMPLATES ${formatInteger(safeSize(kernel?.templateRegistry?.regionTemplatesById))}`,
        `COASTAL_REGION_IDS ${formatInteger(kernel?.coastalGeneration?.coastalRegionIds?.size)}`
      ]
    };
  }

  function collectDiagnostics(runtime) {
    return {
      north: collectNorthDiagnostics(runtime),
      south: collectSouthDiagnostics(runtime),
      east: collectEastDiagnostics(runtime),
      west: collectWestDiagnostics(runtime)
    };
  }

  function drawPanel(ctx, x, y, width, lines, title) {
    const lineHeight = 14;
    const pad = 10;
    const titleGap = 18;
    const height = pad + titleGap + (lines.length * lineHeight) + pad;

    ctx.save();

    ctx.fillStyle = "rgba(8,12,18,0.72)";
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = "rgba(124,210,255,0.36)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillStyle = "rgba(170,238,255,0.96)";
    ctx.fillText(title, x + pad, y + pad);

    ctx.fillStyle = "rgba(214,244,255,0.92)";
    for (let i = 0; i < lines.length; i += 1) {
      ctx.fillText(lines[i], x + pad, y + pad + titleGap + (i * lineHeight));
    }

    ctx.restore();
  }

  function drawCrosshair(ctx, runtime) {
    const projector = getProjector(runtime);
    const player = getPlayer(runtime);
    if (!projector) return;

    const p = projector.point(player.x, player.y);

    ctx.save();
    ctx.strokeStyle = "rgba(255,210,120,0.92)";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(p.x - 10, p.y);
    ctx.lineTo(p.x + 10, p.y);
    ctx.moveTo(p.x, p.y - 10);
    ctx.lineTo(p.x, p.y + 10);
    ctx.stroke();

    ctx.restore();
  }

  function drawPlanetGuides(ctx, runtime) {
    const body = getPlanetBody(runtime);
    if (!body) return;

    ctx.save();

    ctx.strokeStyle = "rgba(124,210,255,0.24)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(body.centerX, body.centerY, body.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, body.horizonY);
    ctx.lineTo(getViewport(runtime).width, body.horizonY);
    ctx.stroke();

    ctx.restore();
  }

  function draw(ctx, runtime) {
    if (!runtime?.debug?.enabled) return;

    const viewport = getViewport(runtime);
    const diagnostics = collectDiagnostics(runtime);

    const panelWidth = clamp(Math.round(viewport.width * 0.28), 250, 360);
    const topY = 12;
    const bottomY = viewport.height - 210;
    const leftX = 12;
    const rightX = viewport.width - panelWidth - 12;
    const centerX = Math.round((viewport.width - panelWidth) * 0.5);

    drawPlanetGuides(ctx, runtime);
    drawCrosshair(ctx, runtime);

    drawPanel(ctx, centerX, topY, panelWidth, diagnostics.north.lines, diagnostics.north.title);
    drawPanel(ctx, centerX, bottomY, panelWidth, diagnostics.south.lines, diagnostics.south.title);
    drawPanel(ctx, rightX, Math.round((viewport.height - 206) * 0.5), panelWidth, diagnostics.east.lines, diagnostics.east.title);
    drawPanel(ctx, leftX, Math.round((viewport.height - 206) * 0.5), panelWidth, diagnostics.west.lines, diagnostics.west.title);
  }

  return Object.freeze({
    draw
  });
}
