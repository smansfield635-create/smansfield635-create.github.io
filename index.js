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

const CARDINALS = {
  north: {
    label: "North",
    color: "var(--north)",
    glow: "rgba(223,233,255,.72)",
    role: "Framekeeping · threshold · classification",
    summary: "North holds line clarity, threshold logic, and admissible structure.",
    href: "/laws/"
  },
  south: {
    label: "South",
    color: "var(--south)",
    glow: "rgba(142,227,172,.72)",
    role: "Continuity · care · restoration",
    summary: "South holds continuity, pacing, resilience, and restorative stability.",
    href: "/gauges/"
  },
  east: {
    label: "East",
    color: "var(--east)",
    glow: "rgba(142,197,255,.72)",
    role: "Signal · build-line · formation",
    summary: "East carries emergence, patterned growth, motion, and clean construction.",
    href: "/products/"
  },
  west: {
    label: "West",
    color: "var(--west)",
    glow: "rgba(255,213,138,.72)",
    role: "Pressure-test · audit · contradiction",
    summary: "West applies stress, contradiction, audit, and failure-surface exposure.",
    href: "/about/"
  }
};

const TITLES = {
  north: ["Threshold", "Keystone", "Vector", "Atlas", "Compass", "Gate", "Apex", "Frame"],
  east: ["Signal", "Pattern", "Forge", "Bloom", "Spark", "Loom", "Meridian", "Rise"],
  west: ["Audit", "Fracture", "Mirror", "Proof", "Fault", "Cipher", "Tension", "Sentinel"],
  south: ["Harbor", "Root", "Hearth", "Current", "Shelter", "Orchard", "Rhythm", "Restore"]
};

const PAIR_LAYOUT = [
  { y: 12, offset: 9 },
  { y: 17, offset: 13 },
  { y: 22, offset: 16 },
  { y: 28, offset: 19 },
  { y: 35, offset: 22 },
  { y: 43, offset: 24 },
  { y: 51, offset: 25 },
  { y: 59, offset: 25 },
  { y: 67, offset: 24 },
  { y: 74, offset: 22 },
  { y: 80, offset: 19 },
  { y: 85, offset: 16 },
  { y: 89, offset: 13 },
  { y: 92, offset: 11 },
  { y: 94, offset: 10 },
  { y: 96, offset: 9 }
];

function cardinalForPair(index) {
  if (index < 4) return "north";
  if (index < 8) return "east";
  if (index < 12) return "west";
  return "south";
}

function buildProducts() {
  const counts = { north: 0, south: 0, east: 0, west: 0 };
  const items = [];

  PAIR_LAYOUT.forEach((pair, pairIndex) => {
    const cardinalKey = cardinalForPair(pairIndex);
    const cardinal = CARDINALS[cardinalKey];
    const sides = [
      { side: "left", x: 50 - pair.offset },
      { side: "right", x: 50 + pair.offset }
    ];

    sides.forEach((sideConfig) => {
      counts[cardinalKey] += 1;
      const n = counts[cardinalKey];
      const title = TITLES[cardinalKey][n - 1];
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
        side: sideConfig.side,
        x: sideConfig.x,
        y: pair.y,
        description:
          `${title} is a ${cardinal.label.toLowerCase()}-lane point in the Generation 1 products chamber. ` +
          `It lives on the ${sideConfig.side} leaf of the symmetric field and expresses ${cardinal.role.toLowerCase()}.`
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

function renderNodes() {
  const active = currentActive(visibleProducts());
  nodeLayer.innerHTML = PRODUCTS.map((item) => {
    const isVisible = state.filter === "all" || item.cardinalKey === state.filter;
    const isActive = active && active.id === item.id;
    const classes = [
      "door-node",
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
  detailFamily.textContent = `${active.cardinalLabel} · ${active.side}`;
  detailTitle.textContent = active.title;
  detailCopy.textContent = active.description;
  detailCardinal.textContent = active.cardinalLabel;
  detailVisible.textContent = String(list.length);
  detailCount.textContent = String(familyCount);
  detailRoute.textContent = active.role;
  detailHref.href = active.href;
  detailHref.textContent = `Open ${active.cardinalLabel} lane`;
}

function render() {
  renderFilters();
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
