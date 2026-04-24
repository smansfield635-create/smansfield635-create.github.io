const CARDINALS = [
  {
    key: "north",
    label: "North",
    short: "N",
    color: "#d6e8ff",
    vector: "Frame / threshold",
    route: "Primary gateway",
    description:
      "Northern points govern frame, threshold, boundary, and admissibility. They keep the products field legible and lawful from the first read."
  },
  {
    key: "east",
    label: "East",
    short: "E",
    color: "#8ec5ff",
    vector: "Signal / build",
    route: "Formation route",
    description:
      "Eastern points govern signal, build motion, formation, and emergence. They carry constructive direction and clean outward momentum."
  },
  {
    key: "south",
    label: "South",
    short: "S",
    color: "#9fe6b1",
    vector: "Continuity / restoration",
    route: "Stability route",
    description:
      "Southern points govern continuity, recovery, pacing, and regulation. They keep the field livable when pressure accumulates."
  },
  {
    key: "west",
    label: "West",
    short: "W",
    color: "#ffd28a",
    vector: "Pressure / contradiction",
    route: "Stress-test route",
    description:
      "Western points govern contradiction, pressure, fracture-testing, and false-closure rejection. They expose weak joins before they spread."
  }
];

const POINTS_PER_CARDINAL = 8;
const TOTAL_POINTS = CARDINALS.length * POINTS_PER_CARDINAL;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const ROUTES = {
  north: ["/products/", "/laws/", "/about/"],
  east: ["/products/", "/products/", "/gauges/"],
  south: ["/products/", "/gauges/", "/contact/"],
  west: ["/products/", "/laws/", "/products/"]
};

const stage = document.getElementById("productsStage");
const detailFamily = document.getElementById("detailFamily");
const detailTitle = document.getElementById("detailTitle");
const detailCode = document.getElementById("detailCode");
const detailBody = document.getElementById("detailBody");
const detailLink = document.getElementById("detailLink");
const metricFamily = document.getElementById("metricFamily");
const metricVector = document.getElementById("metricVector");
const metricRank = document.getElementById("metricRank");
const metricRoute = document.getElementById("metricRoute");
const receiptSelection = document.getElementById("receiptSelection");
const fieldReadout = document.getElementById("fieldReadout");
const linkedRoutes = document.getElementById("linkedRoutes");

const debugPanel = document.getElementById("debugPanel");
const debugToggleBtn = document.getElementById("debugToggleBtn");
const debugCloseBtn = document.getElementById("debugCloseBtn");
const debugViewport = document.getElementById("debugViewport");
const debugSelected = document.getElementById("debugSelected");
const debugGeometry = document.getElementById("debugGeometry");
const debugNodeCount = document.getElementById("debugNodeCount");

const nextPointBtn = document.getElementById("nextPointBtn");

let selectedIndex = 0;
let points = [];
let nodeRefs = [];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createPointData() {
  const items = [];
  let order = 0;

  for (const cardinal of CARDINALS) {
    for (let i = 0; i < POINTS_PER_CARDINAL; i += 1) {
      order += 1;
      const localIndex = i + 1;
      const radialT = (order - 0.35) / TOTAL_POINTS;
      const spiralRadius = Math.sqrt(radialT);
      const angle = order * GOLDEN_ANGLE;

      const baseX = Math.cos(angle) * spiralRadius;
      const baseY = Math.sin(angle) * spiralRadius;

      // Diamond geometry transform: rotate 45 degrees into a rhombus-relative field.
      const diamondX = (baseX - baseY) * 0.92;
      const diamondY = (baseX + baseY) * 0.58;

      const stageX = 600 + diamondX * 355;
      const stageY = 455 + diamondY * 255;

      const emphasis = i === 0 ? "Anchor" : i < 3 ? "Primary" : "Support";
      const radius = i === 0 ? 16 : i < 3 ? 12 : 9;

      items.push({
        index: order - 1,
        order,
        family: cardinal.label,
        familyKey: cardinal.key,
        familyShort: cardinal.short,
        color: cardinal.color,
        code: `${cardinal.short}-${String(localIndex).padStart(2, "0")}`,
        title: `${capitalize(cardinal.vector.split("/")[0].trim())} ${String(localIndex).padStart(2, "0")}`,
        vector: cardinal.vector,
        routeClass: cardinal.route,
        description:
          `${cardinal.description} Point ${String(localIndex).padStart(2, "0")} sits at topographic rank ${String(order).padStart(2, "0")} and belongs to the ${emphasis.toLowerCase()} band for ${cardinal.label}.`,
        href: pickRoute(cardinal.key, localIndex),
        stageX,
        stageY,
        radius,
        emphasis,
        localIndex
      });
    }
  }

  return items;
}

function pickRoute(key, localIndex) {
  const bucket = ROUTES[key] || ["/products/"];
  return bucket[(localIndex - 1) % bucket.length];
}

function capitalize(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function polarLabelPosition(point) {
  const angle = point.order * GOLDEN_ANGLE;
  const dx = Math.cos(angle) * 26;
  const dy = Math.sin(angle) * 20;
  return {
    x: point.stageX + dx,
    y: point.stageY + dy
  };
}

function buildStage() {
  points = createPointData();
  nodeRefs = [];
  stage.innerHTML = "";

  const ns = "http://www.w3.org/2000/svg";

  const defs = document.createElementNS(ns, "defs");

  const glow = document.createElementNS(ns, "filter");
  glow.setAttribute("id", "nodeGlow");
  glow.setAttribute("x", "-50%");
  glow.setAttribute("y", "-50%");
  glow.setAttribute("width", "200%");
  glow.setAttribute("height", "200%");
  const blur = document.createElementNS(ns, "feGaussianBlur");
  blur.setAttribute("stdDeviation", "7");
  blur.setAttribute("result", "blur");
  glow.appendChild(blur);
  defs.appendChild(glow);

  const gridGrad = document.createElementNS(ns, "linearGradient");
  gridGrad.setAttribute("id", "axisGrad");
  gridGrad.setAttribute("x1", "0%");
  gridGrad.setAttribute("y1", "0%");
  gridGrad.setAttribute("x2", "100%");
  gridGrad.setAttribute("y2", "100%");
  const stopA = document.createElementNS(ns, "stop");
  stopA.setAttribute("offset", "0%");
  stopA.setAttribute("stop-color", "rgba(142,197,255,0.12)");
  const stopB = document.createElementNS(ns, "stop");
  stopB.setAttribute("offset", "100%");
  stopB.setAttribute("stop-color", "rgba(212,231,255,0.04)");
  gridGrad.appendChild(stopA);
  gridGrad.appendChild(stopB);
  defs.appendChild(gridGrad);

  stage.appendChild(defs);

  drawDiamondAxes(ns);
  drawFamilyContours(ns);
  drawFamilyLinks(ns);
  drawNodes(ns);

  selectPoint(0);
}

function drawDiamondAxes(ns) {
  const axesGroup = document.createElementNS(ns, "g");
  axesGroup.setAttribute("opacity", "0.82");

  const rings = [
    { w: 740, h: 470, opacity: 0.16 },
    { w: 560, h: 360, opacity: 0.14 },
    { w: 390, h: 250, opacity: 0.12 }
  ];

  for (const ring of rings) {
    const path = document.createElementNS(ns, "path");
    const x = 600;
    const y = 450;
    const w = ring.w / 2;
    const h = ring.h / 2;
    path.setAttribute(
      "d",
      `M ${x} ${y - h} L ${x + w} ${y} L ${x} ${y + h} L ${x - w} ${y} Z`
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(161,196,255,0.18)");
    path.setAttribute("stroke-width", "1.2");
    path.setAttribute("opacity", String(ring.opacity));
    axesGroup.appendChild(path);
  }

  const lines = [
    { x1: 600, y1: 126, x2: 600, y2: 774 },
    { x1: 220, y1: 450, x2: 980, y2: 450 },
    { x1: 328, y1: 214, x2: 872, y2: 686 },
    { x1: 328, y1: 686, x2: 872, y2: 214 }
  ];

  for (const line of lines) {
    const axis = document.createElementNS(ns, "line");
    axis.setAttribute("x1", String(line.x1));
    axis.setAttribute("y1", String(line.y1));
    axis.setAttribute("x2", String(line.x2));
    axis.setAttribute("y2", String(line.y2));
    axis.setAttribute("stroke", "rgba(161,196,255,0.16)");
    axis.setAttribute("stroke-width", "1.1");
    axis.setAttribute("stroke-linecap", "round");
    axesGroup.appendChild(axis);
  }

  stage.appendChild(axesGroup);
}

function drawFamilyContours(ns) {
  const contourGroup = document.createElementNS(ns, "g");
  contourGroup.setAttribute("opacity", "0.78");

  CARDINALS.forEach((cardinal) => {
    const familyPoints = points.filter((p) => p.familyKey === cardinal.key);
    const sorted = [...familyPoints].sort((a, b) => a.order - b.order);

    const contour = document.createElementNS(ns, "path");
    const coords = sorted.map((point) => `${point.stageX},${point.stageY}`).join(" ");
    contour.setAttribute("d", `M ${coords}`);
    contour.setAttribute("fill", "none");
    contour.setAttribute("stroke", cardinal.color);
    contour.setAttribute("stroke-width", "1.4");
    contour.setAttribute("stroke-opacity", "0.22");
    contour.setAttribute("stroke-linecap", "round");
    contour.setAttribute("stroke-linejoin", "round");
    contourGroup.appendChild(contour);
  });

  stage.appendChild(contourGroup);
}

function drawFamilyLinks(ns) {
  const linesGroup = document.createElementNS(ns, "g");

  points.forEach((point) => {
    const link = document.createElementNS(ns, "line");
    link.setAttribute("x1", "600");
    link.setAttribute("y1", "450");
    link.setAttribute("x2", String(point.stageX));
    link.setAttribute("y2", String(point.stageY));
    link.setAttribute("stroke", point.color);
    link.setAttribute("stroke-opacity", point.emphasis === "Anchor" ? "0.24" : "0.12");
    link.setAttribute("stroke-width", point.emphasis === "Anchor" ? "1.5" : "1");
    link.setAttribute("stroke-linecap", "round");
    linesGroup.appendChild(link);
  });

  stage.appendChild(linesGroup);
}

function drawNodes(ns) {
  const nodesGroup = document.createElementNS(ns, "g");
  const labelsGroup = document.createElementNS(ns, "g");

  points.forEach((point, index) => {
    const group = document.createElementNS(ns, "g");
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `${point.family} point ${point.code}`);
    group.style.cursor = "pointer";

    const halo = document.createElementNS(ns, "circle");
    halo.setAttribute("cx", String(point.stageX));
    halo.setAttribute("cy", String(point.stageY));
    halo.setAttribute("r", String(point.radius * 2.2));
    halo.setAttribute("fill", point.color);
    halo.setAttribute("opacity", point.emphasis === "Anchor" ? "0.12" : "0.08");
    halo.setAttribute("filter", "url(#nodeGlow)");
    group.appendChild(halo);

    const node = document.createElementNS(ns, "circle");
    node.setAttribute("cx", String(point.stageX));
    node.setAttribute("cy", String(point.stageY));
    node.setAttribute("r", String(point.radius));
    node.setAttribute("fill", point.color);
    node.setAttribute("stroke", "rgba(5, 9, 18, 0.8)");
    node.setAttribute("stroke-width", point.emphasis === "Anchor" ? "2.4" : "1.8");
    group.appendChild(node);

    const inner = document.createElementNS(ns, "circle");
    inner.setAttribute("cx", String(point.stageX));
    inner.setAttribute("cy", String(point.stageY));
    inner.setAttribute("r", String(Math.max(3, point.radius * 0.34)));
    inner.setAttribute("fill", "rgba(4,8,16,0.82)");
    inner.setAttribute("opacity", "0.82");
    group.appendChild(inner);

    group.addEventListener("click", () => selectPoint(index));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPoint(index);
      }
    });

    nodeRefs.push({ group, node, halo, point });
    nodesGroup.appendChild(group);

    const labelPos = polarLabelPosition(point);
    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", String(labelPos.x));
    label.setAttribute("y", String(labelPos.y));
    label.setAttribute("fill", "rgba(238,244,255,0.84)");
    label.setAttribute("font-size", point.emphasis === "Anchor" ? "13" : "11");
    label.setAttribute("font-weight", point.emphasis === "Anchor" ? "700" : "600");
    label.setAttribute("letter-spacing", "0.06em");
    label.textContent = point.code;
    labelsGroup.appendChild(label);
  });

  stage.appendChild(nodesGroup);
  stage.appendChild(labelsGroup);
}

function renderLinkedRoutes(point) {
  linkedRoutes.innerHTML = "";

  const items = [
    {
      title: `${point.family} family`,
      copy: `Open the ${point.family.toLowerCase()} route family from the main products surface.`,
      href: point.href
    },
    {
      title: "Products home",
      copy: "Return to the parent products field and traverse the full thirty-two point surface.",
      href: "/products/"
    },
    {
      title: "Gauges",
      copy: "Read correlated gauge surfaces that summarize state and movement.",
      href: "/gauges/"
    },
    {
      title: "Laws",
      copy: "Inspect the rule layer that governs the larger system architecture.",
      href: "/laws/"
    }
  ];

  items.forEach((item) => {
    const card = document.createElement("a");
    card.className = "nav-card";
    card.href = item.href;

    const title = document.createElement("span");
    title.className = "nav-title";
    title.textContent = item.title;

    const copy = document.createElement("span");
    copy.className = "nav-copy";
    copy.textContent = item.copy;

    card.append(title, copy);
    linkedRoutes.appendChild(card);
  });
}

function selectPoint(index) {
  selectedIndex = clamp(index, 0, points.length - 1);
  const point = points[selectedIndex];

  nodeRefs.forEach((ref, currentIndex) => {
    const active = currentIndex === selectedIndex;
    ref.group.setAttribute("aria-pressed", String(active));
    ref.node.setAttribute("stroke", active ? "#f6fbff" : "rgba(5, 9, 18, 0.8)");
    ref.node.setAttribute("stroke-width", active ? "3.2" : (ref.point.emphasis === "Anchor" ? "2.4" : "1.8"));
    ref.halo.setAttribute("opacity", active ? "0.24" : (ref.point.emphasis === "Anchor" ? "0.12" : "0.08"));
    ref.group.style.transformOrigin = `${ref.point.stageX}px ${ref.point.stageY}px`;
    ref.group.style.transform = active ? "scale(1.08)" : "scale(1)";
  });

  detailFamily.textContent = `${point.family} family`;
  detailTitle.textContent = point.title;
  detailCode.textContent = point.code;
  detailBody.textContent = point.description;
  detailLink.href = point.href;
  detailLink.textContent = `Open ${point.family} route`;

  metricFamily.textContent = point.family;
  metricVector.textContent = point.vector;
  metricRank.textContent = `${String(point.order).padStart(2, "0")} / ${TOTAL_POINTS}`;
  metricRoute.textContent = `${point.routeClass} · ${point.emphasis}`;

  receiptSelection.textContent = `${point.family} / ${point.title}`;
  fieldReadout.textContent = `${point.code} · ${point.family} · ${point.vector}`;
  debugSelected.textContent = point.code;

  renderLinkedRoutes(point);
}

function toggleDebug(force) {
  const shouldOpen = typeof force === "boolean"
    ? force
    : !debugPanel.classList.contains("is-open");

  debugPanel.classList.toggle("is-open", shouldOpen);
}

function hydrateDiagnostics() {
  const viewport = `${window.innerWidth} × ${window.innerHeight}`;
  debugViewport.textContent = viewport;
  debugGeometry.textContent = "diamond-fibonacci-32";
  debugNodeCount.textContent = String(TOTAL_POINTS);
}

function wireEvents() {
  nextPointBtn.addEventListener("click", () => {
    const nextIndex = (selectedIndex + 1) % points.length;
    selectPoint(nextIndex);
  });

  debugToggleBtn.addEventListener("click", (event) => {
    event.preventDefault();
    toggleDebug();
  });

  debugCloseBtn.addEventListener("click", () => toggleDebug(false));

  window.addEventListener("resize", hydrateDiagnostics, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "d") {
      toggleDebug();
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectPoint((selectedIndex + 1) % points.length);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectPoint((selectedIndex - 1 + points.length) % points.length);
    }
  });
}

function boot() {
  buildStage();
  hydrateDiagnostics();
  wireEvents();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
