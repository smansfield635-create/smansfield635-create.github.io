// /products/index.js
const productsGrid = document.getElementById("productsGrid");
const productsEmptyState = document.getElementById("productsEmptyState");
const filterButtons = [...document.querySelectorAll("#cardinalFilters [data-filter]")];

const CARDINALS = {
  north: {
    label: "North",
    color: "var(--north)",
    glow: "rgba(223,233,255,.72)",
    role: "Framekeeping · threshold · classification",
    summary: "North holds line clarity, threshold logic, and admissible structure."
  },
  south: {
    label: "South",
    color: "var(--south)",
    glow: "rgba(142,227,172,.72)",
    role: "Continuity · care · restoration",
    summary: "South holds continuity, pacing, resilience, and restorative stability."
  },
  east: {
    label: "East",
    color: "var(--east)",
    glow: "rgba(142,197,255,.72)",
    role: "Signal · build-line · formation",
    summary: "East carries emergence, patterned growth, motion, and clean construction."
  },
  west: {
    label: "West",
    color: "var(--west)",
    glow: "rgba(255,213,138,.72)",
    role: "Pressure-test · audit · contradiction",
    summary: "West applies stress, contradiction, audit, and failure-surface exposure."
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

const CARDINAL_BY_PAIR_INDEX = (index) => {
  if (index < 4) return "north";
  if (index < 8) return "east";
  if (index < 12) return "west";
  return "south";
};

function buildProducts() {
  const cardinalCounts = { north: 0, south: 0, east: 0, west: 0 };
  const products = [];

  PAIR_LAYOUT.forEach((pair, pairIndex) => {
    const cardinal = CARDINAL_BY_PAIR_INDEX(pairIndex);
    const cardMeta = CARDINALS[cardinal];
    const sides = [
      { side: "left", x: 50 - pair.offset },
      { side: "right", x: 50 + pair.offset }
    ];

    sides.forEach((entry) => {
      cardinalCounts[cardinal] += 1;
      const sequence = cardinalCounts[cardinal];
      const title = TITLES[cardinal][sequence - 1];
      const id = `${cardinal}-${String(sequence).padStart(2, "0")}`;
      const short = `${cardMeta.label[0]}${String(sequence).padStart(2, "0")}`;

      products.push({
        id,
        short,
        cardinal,
        color: cardMeta.color,
        glow: cardMeta.glow,
        label: `${cardMeta.label} ${String(sequence).padStart(2, "0")}`,
        title,
        side: entry.side,
        x: entry.x,
        y: pair.y,
        role: cardMeta.role,
        description:
          `${title} is a ${cardMeta.label.toLowerCase()}-lane point in the 32-point field. ` +
          `It belongs to the symmetric door topology and expresses ${cardMeta.role.toLowerCase()}.`
      });
    });
  });

  return products;
}

const PRODUCTS = buildProducts();

const state = {
  filter: "all",
  activeId: PRODUCTS[0]?.id ?? null
};

function getVisibleProducts() {
  return state.filter === "all"
    ? PRODUCTS
    : PRODUCTS.filter((item) => item.cardinal === state.filter);
}

function getActiveProduct(visibleProducts) {
  const explicit = PRODUCTS.find((item) => item.id === state.activeId);
  if (explicit && visibleProducts.some((item) => item.id === explicit.id)) return explicit;
  return visibleProducts[0] ?? null;
}

function renderFilters() {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

function renderDetail(activeProduct, visibleProducts) {
  if (!activeProduct) {
    return `
      <aside class="detail-panel">
        <div class="detail-kicker">
          <span class="badge">0</span>
          <span>No active point</span>
        </div>
        <h2>Nothing selected</h2>
        <p>Select a point in the symmetric door to view its details.</p>
      </aside>
    `;
  }

  const cardMeta = CARDINALS[activeProduct.cardinal];
  const visibleCount = visibleProducts.length;
  const totalForCardinal = PRODUCTS.filter((item) => item.cardinal === activeProduct.cardinal).length;

  return `
    <aside class="detail-panel">
      <div class="detail-kicker">
        <span class="badge" style="border-color:${cardMeta.glow};color:${cardMeta.color};">${activeProduct.short}</span>
        <span>${cardMeta.label} · ${activeProduct.side}</span>
      </div>

      <h2>${activeProduct.title}</h2>
      <p>${activeProduct.description}</p>

      <div class="detail-stats">
        <div class="stat">
          <span class="stat-label">Cardinal</span>
          <span class="stat-value">${cardMeta.label}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Visible Points</span>
          <span class="stat-value">${visibleCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Lane Count</span>
          <span class="stat-value">${totalForCardinal}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Topology</span>
          <span class="stat-value">Symmetric Door</span>
        </div>
      </div>

      <div class="legend">
        ${Object.entries(CARDINALS).map(([key, value]) => `
          <div class="legend-item">
            <span class="legend-dot" style="color:${value.color};background:${value.color};"></span>
            <span>${value.label} · ${PRODUCTS.filter((item) => item.cardinal === key).length}</span>
          </div>
        `).join("")}
      </div>

      <p class="subtle">
        ${cardMeta.summary}
      </p>
    </aside>
  `;
}

function renderDoor(activeProduct) {
  const nodes = PRODUCTS.map((item) => {
    const isVisible = state.filter === "all" || item.cardinal === state.filter;
    const isActive = activeProduct && item.id === activeProduct.id;
    const classes = [
      "door-node",
      isActive ? "is-active" : "",
      !isVisible ? "is-muted" : ""
    ].filter(Boolean).join(" ");

    return `
      <button
        type="button"
        class="${classes}"
        data-point-id="${item.id}"
        data-cardinal="${item.cardinal}"
        data-short="${item.short}"
        style="--x:${item.x}%;--y:${item.y}%;--color:${item.color};--glow:${item.glow};"
        aria-label="${item.label}: ${item.title}"
        title="${item.label}: ${item.title}"
      ></button>
    `;
  }).join("");

  return `
    <div class="door-panel">
      <div class="section-header">
        <h2 class="section-title">Door field</h2>
        <div class="section-meta">32 points · balanced symmetry</div>
      </div>

      <div class="door-stage">
        <div class="door-frame">
          <div class="door-arch"></div>
          <div class="door-seam" aria-hidden="true"></div>
          <div class="door-points">
            ${nodes}
          </div>
        </div>

        <div class="door-footer">
          <strong>32-point door</strong> · select any point
        </div>
      </div>
    </div>
  `;
}

function render() {
  const visibleProducts = getVisibleProducts();
  const activeProduct = getActiveProduct(visibleProducts);

  if (activeProduct) state.activeId = activeProduct.id;

  productsGrid.innerHTML = `
    <section class="products-shell">
      ${renderDoor(activeProduct)}
      ${renderDetail(activeProduct, visibleProducts)}
    </section>
  `;

  productsEmptyState.style.display = visibleProducts.length ? "none" : "block";

  const pointButtons = [...productsGrid.querySelectorAll("[data-point-id]")];
  pointButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeId = button.dataset.pointId;
      render();
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.activeId = button.dataset.pointId;
        render();
      }
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    renderFilters();
    render();
  });
});

renderFilters();
render();
