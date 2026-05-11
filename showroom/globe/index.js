// /showroom/globe/index.js
// SHOWROOM_GLOBE_TV_SET_PRIVATE_INSPECT_NAVIGATION_ROUTE_TNT_v13A
// Full-file replacement.
// Showroom projection consumer only.
//
// Purpose:
// - Preserve the Showroom TV set.
// - Keep H-Earth projected by default.
// - Keep mini planet previews spinning.
// - Separate Project behavior from Inspect behavior.
// - Project = change central showroom screen.
// - Inspect = navigate to the planet private route.
// - Prevent card click handlers from hijacking Inspect links.
// - Keep parent mutation forbidden.
// - Keep card transform forbidden.
// - Keep visual pass claim false.

const CONTRACT = "SHOWROOM_GLOBE_TV_SET_PRIVATE_INSPECT_NAVIGATION_ROUTE_TNT_v13A";
const PREVIOUS_CONTRACT = "SHOWROOM_GLOBE_TV_SET_PLANET_PROJECTION_ROUTE_TNT_v13";
const HTML_CONTRACT = "SHOWROOM_GLOBE_TV_SET_PLANET_PROJECTION_HTML_TNT_v13";
const PAIR_CONTRACT = "SHOWROOM_GLOBE_TV_SET_PLANET_PROJECTION_PAIR_TNT_v13";

const SHOWROOM_MODE = "planet-projection-tv-set";
const DEFAULT_CHANNEL = "h-earth";
const LATTICE_GEOMETRY = "4x64=256";
const CARD_TRANSFORM = "forbidden";
const PRIVATE_INSPECT_NAVIGATION = "enabled";
const PLANET_MUTATION_AUTHORIZED = false;
const VISUAL_PASS_CLAIM = false;

const CHANNELS = Object.freeze([
  {
    key: "earth",
    index: 0,
    name: "Earth",
    route: "/showroom/globe/earth/",
    role: "protected-reference-body",
    status: "reference-route-only",
    receipt: "EARTH_REFERENCE_BODY_PROTECTED_ROUTE",
    tone: "reference",
    palette: {
      ocean: "#0d4f86",
      land: "#4f7d4b",
      coast: "#c7ad74",
      relief: "#8b8878",
      ice: "#e2f2f6",
      glow: "#8ebeff"
    }
  },
  {
    key: "h-earth",
    index: 1,
    name: "H-Earth",
    route: "/showroom/globe/h-earth/",
    role: "active-hybrid-earth-build-planet",
    status: "orbital-aerial-build-surface",
    receipt: "H_EARTH_G1_ORBITAL_BUILD_SURFACE_CANVAS_TNT_v13A",
    tone: "active-build",
    palette: {
      ocean: "#0b315f",
      land: "#6f9854",
      coast: "#d2b77b",
      relief: "#908866",
      ice: "#d8edf4",
      glow: "#8ff0c3"
    }
  },
  {
    key: "hearth",
    index: 2,
    name: "Hearth",
    route: "/showroom/globe/hearth/",
    role: "separate-regression-terrain-lane",
    status: "regression-route",
    receipt: "HEARTH_PARENT_CHAIN_REGRESSION_LANE",
    tone: "warm-terrain",
    palette: {
      ocean: "#173c56",
      land: "#8f7144",
      coast: "#d0a66e",
      relief: "#a35f45",
      ice: "#d6e6e9",
      glow: "#f4bf60"
    }
  },
  {
    key: "audralia",
    index: 3,
    name: "Audralia",
    route: "/showroom/globe/audralia/",
    role: "constructed-world-parent-chain-lane",
    status: "constructed-world-route",
    receipt: "AUDRALIA_G1_PARENT_CHAIN_REGRESSION_LANE",
    tone: "constructed-world",
    palette: {
      ocean: "#0f456f",
      land: "#7fa05a",
      coast: "#c9aa6e",
      relief: "#8f6d54",
      ice: "#cfe8ee",
      glow: "#b8a6ff"
    }
  }
]);

const state = {
  contract: CONTRACT,
  previousContract: PREVIOUS_CONTRACT,
  htmlContract: HTML_CONTRACT,
  pairContract: PAIR_CONTRACT,
  showroomMode: SHOWROOM_MODE,
  defaultChannel: DEFAULT_CHANNEL,
  activeChannel: DEFAULT_CHANNEL,
  latticeGeometry: LATTICE_GEOMETRY,
  totalProjectionSeats: 256,
  channelStates: {},
  frame: 0,
  startedAt: new Date().toISOString(),
  visualPassClaim: false,
  parentMutationAuthorized: false,
  cardTransform: "forbidden",
  privateInspectNavigation: PRIVATE_INSPECT_NAVIGATION,
  animationId: null,
  reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
};

const nodes = {
  projectionCanvas: null,
  projectionCtx: null,
  projectionStatus: null,
  previewCanvases: new Map(),
  cards: new Map(),
  receiptPanel: null
};

function byId(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function channelByKey(key) {
  return CHANNELS.find((channel) => channel.key === key) || CHANNELS.find((channel) => channel.key === DEFAULT_CHANNEL);
}

function codeLine(text) {
  const code = document.createElement("code");
  code.textContent = text;
  return code;
}

function buildChannelStates(channel) {
  const states = [];

  for (let i = 0; i < 64; i += 1) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const globalIndex = channel.index * 64 + i;
    const latitude = 72 - row * (144 / 7);
    const longitude = -180 + col * 45;

    let kind = "land";
    let candidate = "preview";

    if (channel.key === "earth") {
      if (row < 1 || row > 6) kind = "ice";
      else if ((col + row) % 5 === 0) kind = "land";
      else if ((col * 2 + row) % 7 === 0) kind = "coast";
      else kind = "ocean";
      candidate = kind === "land" || kind === "coast" ? "reference-surface" : "reference-water";
    }

    if (channel.key === "h-earth") {
      if (row < 1 || row > 6) kind = "ice";
      else if ((i + channel.index) % 11 === 0) kind = "relief";
      else if ((col + row * 2) % 6 === 0) kind = "coast";
      else if ((col * 3 + row) % 5 === 0) kind = "land";
      else kind = "ocean";
      candidate = kind === "land" || kind === "coast"
        ? "orbital-build-candidate"
        : kind === "relief"
          ? "held-relief"
          : "unavailable-or-held";
    }

    if (channel.key === "hearth") {
      if ((row + col) % 6 === 0) kind = "relief";
      else if ((row * 2 + col) % 5 === 0) kind = "coast";
      else if (row < 1 || row > 6) kind = "ice";
      else if ((row + col) % 3 === 0) kind = "land";
      else kind = "ocean";
      candidate = "separate-regression-preview";
    }

    if (channel.key === "audralia") {
      if (row < 1 || row > 6) kind = "ice";
      else if ((row + col * 2) % 7 === 0) kind = "relief";
      else if ((row + col) % 4 === 0) kind = "land";
      else if ((row * 3 + col) % 6 === 0) kind = "coast";
      else kind = "ocean";
      candidate = "constructed-world-preview";
    }

    states.push({
      channel: channel.key,
      channelIndex: channel.index,
      localIndex: i,
      globalIndex,
      row,
      col,
      latitude,
      longitude,
      kind,
      candidate
    });
  }

  return states;
}

function buildAllStates() {
  for (const channel of CHANNELS) {
    state.channelStates[channel.key] = buildChannelStates(channel);
  }
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function rgbToString(rgb) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

function shade(hex, light) {
  const rgb = hexToRgb(hex);
  return rgbToString({
    r: clamp(Math.round(rgb.r * light + 10 * (1 - light)), 0, 255),
    g: clamp(Math.round(rgb.g * light + 10 * (1 - light)), 0, 255),
    b: clamp(Math.round(rgb.b * light + 10 * (1 - light)), 0, 255)
  });
}

function colorForState(channel, projectionState) {
  if (projectionState.kind === "ocean") return channel.palette.ocean;
  if (projectionState.kind === "coast") return channel.palette.coast;
  if (projectionState.kind === "relief") return channel.palette.relief;
  if (projectionState.kind === "ice") return channel.palette.ice;
  return channel.palette.land;
}

function setupCanvas(canvas) {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const cssWidth = Math.max(220, Math.floor(rect.width || canvas.clientWidth || 600));
  const cssHeight = Math.max(220, Math.floor(rect.height || canvas.clientHeight || cssWidth));
  const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

  const nextWidth = Math.floor(cssWidth * dpr);
  const nextHeight = Math.floor(cssHeight * dpr);

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  canvas.style.transform = "none";
  canvas.dataset.cardTransform = "forbidden";

  return ctx;
}

function collectNodes() {
  nodes.projectionCanvas = byId("showroomProjectionCanvas");
  nodes.projectionCtx = setupCanvas(nodes.projectionCanvas);
  nodes.projectionStatus = byId("projectionStatus");
  nodes.receiptPanel = byId("globeReceiptPanel");

  nodes.previewCanvases.clear();
  document.querySelectorAll("[data-preview-canvas]").forEach((canvas) => {
    const key = canvas.getAttribute("data-preview-canvas");
    nodes.previewCanvases.set(key, {
      canvas,
      ctx: setupCanvas(canvas)
    });
  });

  nodes.cards.clear();
  document.querySelectorAll("[data-channel-card]").forEach((card) => {
    const key = card.getAttribute("data-channel-card");
    nodes.cards.set(key, card);
    card.dataset.cardTransform = "forbidden";
    card.style.transform = "none";
  });
}

function clearScene(ctx, width, height, channel, isMain) {
  const gradient = ctx.createRadialGradient(
    width * 0.5,
    height * 0.42,
    width * 0.05,
    width * 0.5,
    height * 0.5,
    width * 0.78
  );

  gradient.addColorStop(0, isMain ? `${channel.palette.glow}33` : `${channel.palette.glow}22`);
  gradient.addColorStop(0.44, "#071229");
  gradient.addColorStop(1, "#01030a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStars(ctx, width, height, count) {
  ctx.save();
  ctx.globalAlpha = 0.58;

  for (let i = 0; i < count; i += 1) {
    const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 49.61) * 0.5 + 0.5) * height;
    const r = 0.45 + ((i * 7) % 11) / 18;

    ctx.beginPath();
    ctx.fillStyle = i % 11 === 0 ? "rgba(246,211,123,.72)" : "rgba(225,238,255,.58)";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function projectCell(projectionState, radius, centerX, centerY, rotation, pitch) {
  const lat = (Number(projectionState.latitude) * Math.PI) / 180;
  const lon = ((Number(projectionState.longitude) + rotation) * Math.PI) / 180;
  const pitchRad = (pitch * Math.PI) / 180;

  const baseX = Math.cos(lat) * Math.sin(lon);
  const baseY = Math.sin(lat);
  const baseZ = Math.cos(lat) * Math.cos(lon);

  const rotatedY = baseY * Math.cos(pitchRad) - baseZ * Math.sin(pitchRad);
  const rotatedZ = baseY * Math.sin(pitchRad) + baseZ * Math.cos(pitchRad);
  const rotatedX = baseX;

  if (rotatedZ < -0.08) return null;

  return {
    x: centerX + rotatedX * radius,
    y: centerY - rotatedY * radius * 0.98,
    z: rotatedZ,
    light: Math.max(0.2, Math.min(1, 0.52 + rotatedZ * 0.42 + rotatedY * 0.1 - rotatedX * 0.06))
  };
}

function drawGlobeBase(ctx, radius, centerX, centerY, channel) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  const ocean = ctx.createRadialGradient(
    centerX - radius * 0.36,
    centerY - radius * 0.34,
    radius * 0.08,
    centerX,
    centerY,
    radius * 1.14
  );

  ocean.addColorStop(0, shade(channel.palette.ocean, 1.38));
  ocean.addColorStop(0.42, shade(channel.palette.ocean, 0.88));
  ocean.addColorStop(0.78, shade(channel.palette.ocean, 0.44));
  ocean.addColorStop(1, "#020b1c");

  ctx.fillStyle = ocean;
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `${channel.palette.glow}66`;
  ctx.lineWidth = Math.max(1.4, radius * 0.01);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1.012, 0, Math.PI * 2);
  ctx.strokeStyle = `${channel.palette.glow}33`;
  ctx.lineWidth = Math.max(8, radius * 0.032);
  ctx.stroke();

  ctx.restore();
}

function drawCells(ctx, channel, cells, radius, centerX, centerY, rotation, pitch) {
  const projected = [];

  for (const cell of cells) {
    const point = projectCell(cell, radius, centerX, centerY, rotation, pitch);
    if (point) projected.push({ cell, point });
  }

  projected.sort((a, b) => a.point.z - b.point.z);

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 0.998, 0, Math.PI * 2);
  ctx.clip();

  for (const { cell, point } of projected) {
    const baseColor = colorForState(channel, cell);
    const color = shade(baseColor, point.light);
    const reliefBoost = cell.kind === "relief" ? 0.02 : 0;
    const size = radius * (0.075 + reliefBoost) * (0.72 + point.z * 0.38);

    ctx.beginPath();

    if (cell.kind === "ocean") {
      ctx.globalAlpha = 0.42 + point.z * 0.25;
      ctx.ellipse(point.x, point.y, size * 0.72, size * 0.52, 0, 0, Math.PI * 2);
    } else if (cell.kind === "relief") {
      ctx.globalAlpha = 0.94;
      ctx.moveTo(point.x, point.y - size * 0.68);
      ctx.lineTo(point.x + size * 0.66, point.y - size * 0.1);
      ctx.lineTo(point.x + size * 0.42, point.y + size * 0.56);
      ctx.lineTo(point.x - size * 0.46, point.y + size * 0.44);
      ctx.lineTo(point.x - size * 0.66, point.y - size * 0.08);
      ctx.closePath();
    } else if (cell.kind === "ice") {
      ctx.globalAlpha = 0.95;
      ctx.ellipse(point.x, point.y, size * 0.60, size * 0.44, 0, 0, Math.PI * 2);
    } else {
      ctx.globalAlpha = 0.88;
      ctx.ellipse(point.x, point.y, size * 0.74, size * 0.52, 0, 0, Math.PI * 2);
    }

    ctx.fillStyle = color;
    ctx.fill();

    if (cell.kind !== "ocean") {
      ctx.globalAlpha = channel.key === "h-earth" && cell.candidate === "orbital-build-candidate" ? 0.32 : 0.16;
      ctx.strokeStyle = channel.key === "h-earth" ? "rgba(246,211,123,.56)" : "rgba(210,218,226,.30)";
      ctx.lineWidth = Math.max(0.7, radius * 0.0024);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawLight(ctx, radius, centerX, centerY, channel) {
  ctx.save();

  const highlight = ctx.createRadialGradient(
    centerX - radius * 0.34,
    centerY - radius * 0.36,
    radius * 0.08,
    centerX,
    centerY,
    radius * 1.08
  );

  highlight.addColorStop(0, "rgba(255,238,184,.20)");
  highlight.addColorStop(0.34, `${channel.palette.glow}16`);
  highlight.addColorStop(0.72, "rgba(0,0,0,.02)");
  highlight.addColorStop(1, "rgba(0,0,0,.52)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = highlight;
  ctx.fill();

  const terminator = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  terminator.addColorStop(0, "rgba(255,235,175,.05)");
  terminator.addColorStop(0.48, "rgba(0,0,0,0)");
  terminator.addColorStop(0.78, "rgba(0,0,0,.30)");
  terminator.addColorStop(1, "rgba(0,0,0,.62)");

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = terminator;
  ctx.fill();

  ctx.restore();
}

function drawMainLabels(ctx, width, height, channel) {
  ctx.save();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(246,211,123,.96)";
  ctx.font = `${Math.max(22, width * 0.031)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(channel.name, width / 2, height * 0.075);

  ctx.fillStyle = "rgba(243,227,189,.74)";
  ctx.font = `${Math.max(13, width * 0.016)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(channel.role, width / 2, height * 0.107);

  ctx.fillStyle = "rgba(143,240,195,.76)";
  ctx.font = `${Math.max(12, width * 0.014)}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText(`Projection seats: ${channel.index * 64 + 1}–${channel.index * 64 + 64} of 256`, width / 2, height * 0.134);

  ctx.restore();
}

function drawPlanet(canvas, ctx, channel, frame, isMain) {
  if (!canvas || !ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const min = Math.min(width, height);
  const radius = min * (isMain ? 0.34 : 0.37);
  const centerX = width * 0.5;
  const centerY = height * (isMain ? 0.51 : 0.5);
  const speed = state.reducedMotion ? 0.012 : 0.055;
  const rotation = frame * speed * (channel.index % 2 === 0 ? 1 : -1) + channel.index * 18;
  const pitch = channel.key === "h-earth" ? 14 : channel.key === "earth" ? 8 : channel.key === "hearth" ? -10 : 11;
  const cells = state.channelStates[channel.key] || [];

  clearScene(ctx, width, height, channel, isMain);
  drawStars(ctx, width, height, isMain ? 160 : 36);
  drawGlobeBase(ctx, radius, centerX, centerY, channel);
  drawCells(ctx, channel, cells, radius, centerX, centerY, rotation, pitch);
  drawLight(ctx, radius, centerX, centerY, channel);

  if (isMain) drawMainLabels(ctx, width, height, channel);
}

function renderProjectionStatus(channel) {
  if (!nodes.projectionStatus) return;

  nodes.projectionStatus.replaceChildren();

  const values = [
    ["Channel", channel.name],
    ["Status", channel.status],
    ["Lattice", `${channel.index * 64 + 1}–${channel.index * 64 + 64} / 256`],
    ["Receipt", channel.receipt],
    ["Mutation", "forbidden"],
    ["Visual pass", "false"]
  ];

  for (const [label, value] of values) {
    const span = document.createElement("span");
    const strong = document.createElement("strong");
    const em = document.createElement("em");

    strong.textContent = label;
    em.textContent = value;

    span.appendChild(strong);
    span.appendChild(em);
    nodes.projectionStatus.appendChild(span);
  }
}

function renderReceipts(channel) {
  if (!nodes.receiptPanel) return;

  nodes.receiptPanel.dataset.routeReceipt = CONTRACT;
  nodes.receiptPanel.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  nodes.receiptPanel.dataset.privateInspectNavigation = PRIVATE_INSPECT_NAVIGATION;
  nodes.receiptPanel.dataset.activeChannel = channel.key;
  nodes.receiptPanel.dataset.showroomMode = SHOWROOM_MODE;
  nodes.receiptPanel.dataset.latticeGeometry = LATTICE_GEOMETRY;
  nodes.receiptPanel.dataset.cardTransform = CARD_TRANSFORM;
  nodes.receiptPanel.dataset.parentMutationAuthorized = "false";
  nodes.receiptPanel.dataset.visualPassClaim = "false";

  nodes.receiptPanel.replaceChildren(
    codeLine(`PAIR_RECEIPT: ${PAIR_CONTRACT}`),
    codeLine(`HTML_RECEIPT: ${HTML_CONTRACT}`),
    codeLine(`ROUTE_RECEIPT: ${CONTRACT}`),
    codeLine(`PREVIOUS_ROUTE_RECEIPT: ${PREVIOUS_CONTRACT}`),
    codeLine(`SHOWROOM_MODE: ${SHOWROOM_MODE}`),
    codeLine(`DEFAULT_CHANNEL: ${DEFAULT_CHANNEL}`),
    codeLine(`ACTIVE_CHANNEL: ${channel.key}`),
    codeLine(`ACTIVE_CHANNEL_NAME: ${channel.name}`),
    codeLine(`ACTIVE_CHANNEL_ROUTE: ${channel.route}`),
    codeLine(`ACTIVE_CHANNEL_RECEIPT: ${channel.receipt}`),
    codeLine(`PRIVATE_INSPECT_NAVIGATION: ${PRIVATE_INSPECT_NAVIGATION}`),
    codeLine(`PROJECT_ACTION: showroom-screen-only`),
    codeLine(`INSPECT_ACTION: private-route-navigation`),
    codeLine(`EARTH_PRIVATE_ROUTE: /showroom/globe/earth/`),
    codeLine(`H_EARTH_PRIVATE_ROUTE: /showroom/globe/h-earth/`),
    codeLine(`HEARTH_PRIVATE_ROUTE: /showroom/globe/hearth/`),
    codeLine(`AUDRALIA_PRIVATE_ROUTE: /showroom/globe/audralia/`),
    codeLine(`LATTICE_GEOMETRY: ${LATTICE_GEOMETRY}`),
    codeLine(`TOTAL_PROJECTION_SEATS: 256`),
    codeLine(`CENTRAL_PROJECTION_CANVAS: active`),
    codeLine(`MINI_PREVIEW_CANVASES: earth,h-earth,hearth,audralia`),
    codeLine(`CARD_TRANSFORM: forbidden`),
    codeLine(`PARENT_MUTATION_AUTHORIZED: false`),
    codeLine(`EARTH_MUTATION_AUTHORIZED: false`),
    codeLine(`H_EARTH_MUTATION_AUTHORIZED: false`),
    codeLine(`HEARTH_MUTATION_AUTHORIZED: false`),
    codeLine(`AUDRALIA_MUTATION_AUTHORIZED: false`),
    codeLine(`VISUAL_PASS_CLAIM: false`),
    codeLine(`GRAPHIC_BOX: false`),
    codeLine(`GENERATED_IMAGE: false`)
  );
}

function stampDocument(channel) {
  const root = document.documentElement;

  root.dataset.routeReceipt = CONTRACT;
  root.dataset.previousRouteReceipt = PREVIOUS_CONTRACT;
  root.dataset.htmlReceipt = HTML_CONTRACT;
  root.dataset.pairReceipt = PAIR_CONTRACT;
  root.dataset.showroomMode = SHOWROOM_MODE;
  root.dataset.defaultChannel = DEFAULT_CHANNEL;
  root.dataset.activeChannel = channel.key;
  root.dataset.activeChannelName = channel.name;
  root.dataset.activeChannelRoute = channel.route;
  root.dataset.activeChannelReceipt = channel.receipt;
  root.dataset.privateInspectNavigation = PRIVATE_INSPECT_NAVIGATION;
  root.dataset.projectAction = "showroom-screen-only";
  root.dataset.inspectAction = "private-route-navigation";
  root.dataset.latticeGeometry = LATTICE_GEOMETRY;
  root.dataset.totalProjectionSeats = "256";
  root.dataset.cardTransform = CARD_TRANSFORM;
  root.dataset.parentMutationAuthorized = "false";
  root.dataset.earthMutationAuthorized = "false";
  root.dataset.hEarthMutationAuthorized = "false";
  root.dataset.hearthMutationAuthorized = "false";
  root.dataset.audraliaMutationAuthorized = "false";
  root.dataset.visualPassClaim = "false";
  root.dataset.graphicBox = "false";
  root.dataset.generatedImage = "false";
}

function updateCards(channel) {
  for (const [key, card] of nodes.cards.entries()) {
    const selected = key === channel.key;
    card.setAttribute("aria-selected", String(selected));
    card.dataset.activeProjection = String(selected);
    card.dataset.cardTransform = "forbidden";
    card.style.transform = "none";
  }
}

function selectChannel(key) {
  const channel = channelByKey(key);
  state.activeChannel = channel.key;

  stampDocument(channel);
  updateCards(channel);
  renderProjectionStatus(channel);
  renderReceipts(channel);

  drawPlanet(nodes.projectionCanvas, nodes.projectionCtx, channel, state.frame, true);
}

function navigateToPrivateRoute(key) {
  const channel = channelByKey(key);
  window.location.assign(channel.route);
}

function isPrivateInspectTarget(eventTarget) {
  return Boolean(eventTarget.closest("[data-inspect-route], a[href]"));
}

function wireEvents() {
  document.querySelectorAll("[data-inspect-route]").forEach((anchor) => {
    const routeKey = anchor.getAttribute("data-inspect-route");
    const channel = channelByKey(routeKey);

    anchor.setAttribute("href", channel.route);
    anchor.dataset.privateInspectNavigation = "enabled";
    anchor.dataset.inspectAction = "private-route-navigation";

    anchor.addEventListener("click", (event) => {
      event.stopPropagation();

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
        return;
      }

      event.preventDefault();
      navigateToPrivateRoute(routeKey);
    }, { capture: true });
  });

  document.querySelectorAll("[data-select-channel]").forEach((button) => {
    button.dataset.projectAction = "showroom-screen-only";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectChannel(button.getAttribute("data-select-channel"));
    });
  });

  document.querySelectorAll("[data-channel-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (isPrivateInspectTarget(event.target)) return;
      selectChannel(card.getAttribute("data-channel-card"));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (isPrivateInspectTarget(event.target)) return;
      event.preventDefault();
      selectChannel(card.getAttribute("data-channel-card"));
    });
  });

  window.addEventListener("resize", () => {
    collectNodes();
    selectChannel(state.activeChannel);
  });
}

function drawFrame() {
  state.frame += 1;

  const active = channelByKey(state.activeChannel);
  drawPlanet(nodes.projectionCanvas, nodes.projectionCtx, active, state.frame, true);

  for (const channel of CHANNELS) {
    const preview = nodes.previewCanvases.get(channel.key);
    if (!preview) continue;
    drawPlanet(preview.canvas, preview.ctx, channel, state.frame + channel.index * 20, false);
  }

  if (!state.reducedMotion) {
    state.animationId = window.requestAnimationFrame(drawFrame);
  }
}

function getShowroomGlobeProjectionStatus() {
  const channel = channelByKey(state.activeChannel);

  return {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    showroomMode: SHOWROOM_MODE,
    defaultChannel: DEFAULT_CHANNEL,
    activeChannel: channel.key,
    activeChannelName: channel.name,
    activeChannelRoute: channel.route,
    activeChannelReceipt: channel.receipt,
    privateInspectNavigation: PRIVATE_INSPECT_NAVIGATION,
    projectAction: "showroom-screen-only",
    inspectAction: "private-route-navigation",
    latticeGeometry: LATTICE_GEOMETRY,
    totalProjectionSeats: 256,
    channelCount: CHANNELS.length,
    statesPerChannel: 64,
    centralProjectionCanvas: Boolean(nodes.projectionCanvas),
    previewCanvases: Array.from(nodes.previewCanvases.keys()),
    cardTransform: CARD_TRANSFORM,
    parentMutationAuthorized: PLANET_MUTATION_AUTHORIZED,
    earthMutationAuthorized: false,
    hEarthMutationAuthorized: false,
    hearthMutationAuthorized: false,
    audraliaMutationAuthorized: false,
    visualPassClaim: VISUAL_PASS_CLAIM,
    graphicBox: false,
    generatedImage: false,
    startedAt: state.startedAt
  };
}

function exposeApi() {
  const api = {
    contract: CONTRACT,
    receipt: CONTRACT,
    previousContract: PREVIOUS_CONTRACT,
    htmlContract: HTML_CONTRACT,
    pairContract: PAIR_CONTRACT,
    showroomMode: SHOWROOM_MODE,
    defaultChannel: DEFAULT_CHANNEL,
    latticeGeometry: LATTICE_GEOMETRY,
    privateInspectNavigation: PRIVATE_INSPECT_NAVIGATION,
    channels: CHANNELS.map((channel) => ({ ...channel })),
    getStatus: getShowroomGlobeProjectionStatus,
    status: getShowroomGlobeProjectionStatus,
    getShowroomGlobeProjectionStatus,
    selectChannel,
    project: selectChannel,
    inspect: navigateToPrivateRoute,
    navigateToPrivateRoute
  };

  window.DGBShowroomGlobeProjection = api;
  window.ShowroomGlobeProjection = api;
  window.SHOWROOM_GLOBE_TV_SET = api;
  window.SHOWROOM_GLOBE_TV_SET_RECEIPT = CONTRACT;
}

function boot() {
  buildAllStates();
  collectNodes();
  wireEvents();

  const channel = channelByKey(DEFAULT_CHANNEL);
  stampDocument(channel);
  updateCards(channel);
  renderProjectionStatus(channel);
  renderReceipts(channel);
  exposeApi();

  drawFrame();

  if (state.reducedMotion) {
    drawFrame();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

export {
  CONTRACT,
  PREVIOUS_CONTRACT,
  HTML_CONTRACT,
  PAIR_CONTRACT,
  SHOWROOM_MODE,
  DEFAULT_CHANNEL,
  LATTICE_GEOMETRY,
  PRIVATE_INSPECT_NAVIGATION,
  CHANNELS,
  getShowroomGlobeProjectionStatus
};
