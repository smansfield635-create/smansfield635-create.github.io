const filterButtons = [...document.querySelectorAll("#cardinalFilters [data-filter]")];
const nodeLayer = document.getElementById("nodeLayer");
const detailCode = document.getElementById("detailCode");
const detailFamily = document.getElementById("detailFamily");
const detailTitle = document.getElementById("detailTitle");
const detailCopy = document.getElementById("detailCopy");
const detailCardinal = document.getElementById("detailCardinal");
const detailVisible = document.getElementById("detailVisible");
const detailCount = document.getElementById("detailCount");
const detailRoute = document.getElementById("detailRoute");
const detailHref = document.getElementById("detailHref");

const bondNorth = document.getElementById("bondNorth");
const bondSouth = document.getElementById("bondSouth");
const bondEast = document.getElementById("bondEast");
const bondWest = document.getElementById("bondWest");

const CARDINALS = {
  north: {
    label: "North",
    color: "var(--north)",
    glow: "rgba(223,233,255,.72)",
    role: "Framekeeping · threshold · classification",
    summary: "North stabilizes frame, threshold, and admissible classification inside the confined compound window.",
    href: "/laws/",
    atomX: 34,
    atomY: 34
  },
  east: {
    label: "East",
    color: "var(--east)",
    glow: "rgba(142,197,255,.72)",
    role: "Signal · build-line · formation",
    summary: "East carries emergence, build-line motion, and lawful formation inside the confined compound window.",
    href: "/products/",
    atomX: 66,
    atomY: 34
  },
  west: {
    label: "West",
    color: "var(--west)",
    glow: "rgba(255,213,138,.72)",
    role: "Pressure-test · audit · contradiction",
    summary: "West provides stress test, audit, and contradiction pressure inside the confined compound window.",
    href: "/about/",
    atomX: 34,
    atomY: 66
  },
  south: {
    label: "South",
    color: "var(--south)",
    glow: "rgba(142,227,172,.72)",
    role: "Continuity · care · restoration",
    summary: "South stabilizes continuity, care, and restoration inside the confined compound window.",
    href: "/gauges/",
    atomX: 66,
    atomY: 66
  }
};

const TITLES = {
  north: ["Threshold", "Keystone", "Vector", "Atlas", "Compass", "Gate", "Apex", "Frame"],
  east: ["Signal", "Pattern", "Forge", "Bloom", "Spark", "Loom", "Meridian", "Rise"],
  west: ["Audit", "Fracture", "Mirror", "Proof", "Fault", "Cipher", "Tension", "Sentinel"],
  south: ["Harbor", "Root", "Hearth", "Current", "Shelter", "Orchard", "Rhythm", "Restore"]
};

// Twisted orbital offsets around each atom.
// Read as mini torsion around a larger figure-eight.
const ORBITS = [
  { dx: 0, dy: -8.5 },
  { dx: 6, dy: -5.5 },
  { dx: 8.5, dy: -0.5 },
  { dx: 5.5, dy: 6 },
  { dx: 0, dy: 8.5 },
  { dx: -6, dy: 5.5 },
  { dx: -8.5, dy: 0.5 },
  { dx: -5.5, dy: -6 }
];

function buildProducts() {
  const items = [];

  Object.keys(CARDINALS).forEach((cardinalKey) => {
    const cardinal = CARDINALS[cardinalKey];

    ORBITS.forEach((orbit, index) => {
      const n = index + 1;
      const title = TITLES[cardinalKey][index];
      const code = `${cardinal.label[0]}${String(n).padStart(2, "0")}`;

      items.push({
        id: `${cardinalKey}-${String(n).padStart(2, "0")}`,
        code,
        title,
        cardinalKey,
        cardinalLabel: cardinal.label,
        color: cardinal.color,
        glow: cardinal.glow,
        role: cardinal.role,
        summary: cardinal.summary,
        href: cardinal.href,
        x: cardinal.atomX + orbit.dx,
        y: cardinal.atomY + orbit.dy,
        description:
          `${title} is a ${cardinal.label.toLowerCase()} atomic point inside the confined products window. ` +
          `It belongs to the ${cardinal.label.toLowerCase()} body of eight and participates in the twisted figure-eight compound as ${cardinal.role.toLowerCase()}.`
      });
    });
  });

  return items;
}

const PRODUCTS = buildProducts();

const state = {
  filter: "all",
  activeId: PRODUCTS[0]?.id ?? null
};

function visibleProducts() {
  return state.filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((item) => item.cardinalKey === state.filter);
}

function currentActive(list) {
  const explicit = PRODUCTS.find((item) => item.id === state.activeId);
  if (explicit && list.some((item) => item.id === explicit.id)) return explicit;
  return list[0] ?? null;
}

function renderFilters() {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

function setBond(el, x2, y2) {
  const x1 = 50;
  const y1 = 50;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);

  el.style.height = `${distance}%`;
  el.style.left = `${x1}%`;
  el.style.top = `${y1}%`;
  el.style.transform = `translate(-50%, -50%) rotate(${Math.atan2(dy, dx) * 180 / Math.PI + 90}deg)`;
}

function renderBonds() {
  setBond(bondNorth, CARDINALS.north.atomX, CARDINALS.north.atomY);
  setBond(bondSouth, CARDINALS.south.atomX, CARDINALS.south.atomY);
  setBond(bondEast, CARDINALS.east.atomX, CARDINALS.east.atomY);
  setBond(bondWest, CARDINALS.west.atomX, CARDINALS.west.atomY);
}

function renderNodes() {
  const active = currentActive(visibleProducts());

  nodeLayer.innerHTML = PRODUCTS.map((item) => {
    const isVisible = state.filter === "all" || item.cardinalKey === state.filter;
    const isActive = active && active.id === item.id;

    const classes = [
      "node",
      isActive ? "is-active" : "",
      !isVisible ? "is-muted" : ""
    ].filter(Boolean).join(" ");

    return `
      <button
        type="button"
        class="${classes}"
        data-id="${item.id}"
        data-short="${item.code}"
        style="--x:${item.x}%;--y:${item.y}%;--color:${item.color};--glow:${item.glow};"
        aria-label="${item.cardinalLabel} ${item.code}: ${item.title}"
        title="${item.cardinalLabel} ${item.code}: ${item.title}"
      ></button>
    `;
  }).join("");

  nodeLayer.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeId = button.dataset.id;
      render();
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.activeId = button.dataset.id;
        render();
      }
    });
  });
}

function renderDetail() {
  const list = visibleProducts();
  const active = currentActive(list);

  if (!active) return;

  const familyCount = PRODUCTS.filter((item) => item.cardinalKey === active.cardinalKey).length;

  detailCode.textContent = active.code;
  detailFamily.textContent = `${active.cardinalLabel} · atom`;
  detailTitle.textContent = active.title;
  detailCopy.textContent = active.description;
  detailCardinal.textContent = active.cardinalLabel;
  detailVisible.textContent = String(list.length);
  detailCount.textContent = String(familyCount);
  detailRoute.textContent = active.role;
  detailHref.href = active.href;
  detailHref.textContent = `Open ${active.cardinalLabel} body`;
}

function render() {
  renderFilters();
  renderBonds();
  renderNodes();
  renderDetail();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    render();
  });
});

render();
