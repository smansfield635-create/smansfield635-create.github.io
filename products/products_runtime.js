(() => {
  const RUNTIME_ID = "products-runtime-stained-glass-window-v1";

  const CARDINALS = {
    north: {
      label: "North",
      color: "var(--north)",
      glow: "rgba(223,233,255,.72)",
      role: "Framekeeping · threshold · classification",
      summary: "North stabilizes frame, threshold, and admissible classification inside the stained-glass molecular chamber.",
      href: "/laws/",
      atomX: 34,
      atomY: 34
    },
    east: {
      label: "East",
      color: "var(--east)",
      glow: "rgba(142,197,255,.72)",
      role: "Signal · build-line · formation",
      summary: "East carries emergence, build-line motion, and lawful formation inside the stained-glass molecular chamber.",
      href: "/products/",
      atomX: 66,
      atomY: 34
    },
    west: {
      label: "West",
      color: "var(--west)",
      glow: "rgba(255,213,138,.72)",
      role: "Pressure-test · audit · contradiction",
      summary: "West provides stress test, audit, and contradiction pressure inside the stained-glass molecular chamber.",
      href: "/about/",
      atomX: 34,
      atomY: 66
    },
    south: {
      label: "South",
      color: "var(--south)",
      glow: "rgba(142,227,172,.72)",
      role: "Continuity · care · restoration",
      summary: "South stabilizes continuity, care, and restoration inside the stained-glass molecular chamber.",
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
            `${title} is a ${cardinal.label.toLowerCase()} atomic point inside the stained-glass products window. ` +
            `It belongs to the ${cardinal.label.toLowerCase()} body of eight and participates in the twisted figure-eight chamber as ${cardinal.role.toLowerCase()}.`
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

  function qs(root, selector) {
    return root.querySelector(selector);
  }

  function qsa(root, selector) {
    return [...root.querySelectorAll(selector)];
  }

  function ensureMountTarget() {
    return (
      document.getElementById("productsRuntimeMount") ||
      document.getElementById("productsGrid") ||
      document.querySelector("[data-products-runtime-mount]") ||
      document.body
    );
  }

  function clearPriorRuntime(target) {
    qsa(target, `[data-products-runtime-root]`).forEach((node) => node.remove());
  }

  function renderTemplate() {
    return `
      <section class="section" data-products-runtime-root="${RUNTIME_ID}" aria-live="polite">
        <div class="section-head">
          <div>
            <div class="section-kicker">Contained molecular field</div>
            <h2>Choose a bonded point inside the stained-glass window</h2>
          </div>
          <div class="section-note">
            The molecule is seated inside one stained-glass chamber viewport and the runtime now emits only this contract.
          </div>
        </div>

        <div class="shell">
          <div class="window-panel">
            <div class="window-head">
              <h2>Stained-glass window</h2>
              <div class="window-meta">4 atoms · 32 points · windowed molecule</div>
            </div>

            <div class="window-stage">
              <div class="window-title">owned stained-glass viewport</div>

              <div class="glass-panel">
                <div class="glass-pane north"></div>
                <div class="glass-pane east"></div>
                <div class="glass-pane west"></div>
                <div class="glass-pane south"></div>
                <div class="glass-pane center"></div>
              </div>

              <div class="lead-came h" style="top:12px;"></div>
              <div class="lead-came h" style="bottom:12px;"></div>
              <div class="lead-came v" style="left:12px;"></div>
              <div class="lead-came v" style="right:12px;"></div>

              <div class="lead-came v" style="left:50%;transform:translateX(-50%);top:14%;bottom:14%;"></div>
              <div class="lead-came h" style="top:50%;transform:translateY(-50%);left:14%;right:14%;"></div>
              <div class="lead-came diag" style="transform:translate(-50%,-50%) rotate(35deg);"></div>
              <div class="lead-came diag" style="transform:translate(-50%,-50%) rotate(-35deg);"></div>

              <div class="window-frame">
                <div class="eight-track">
                  <div class="eight-loop left"></div>
                  <div class="eight-loop right"></div>
                </div>

                <div class="throat"></div>

                <div class="bond" data-bond="north"></div>
                <div class="bond" data-bond="south"></div>
                <div class="bond" data-bond="east"></div>
                <div class="bond" data-bond="west"></div>

                <div class="atom" style="--x:34%;--y:34%;"><div class="atom-label">North</div></div>
                <div class="atom" style="--x:66%;--y:34%;"><div class="atom-label">East</div></div>
                <div class="atom" style="--x:34%;--y:66%;"><div class="atom-label">West</div></div>
                <div class="atom" style="--x:66%;--y:66%;"><div class="atom-label">South</div></div>

                <div class="node-layer" data-node-layer></div>
              </div>

              <div class="window-copy"><strong>Stained-glass molecular chamber</strong> · bonded inside one window</div>
            </div>
          </div>

          <aside class="detail-panel">
            <div class="detail-kicker">
              <span class="badge" data-detail-code>N01</span>
              <span data-detail-family>North · atom</span>
            </div>

            <h3 class="detail-title" data-detail-title>Threshold</h3>
            <p class="detail-copy" data-detail-copy>Product detail surface.</p>

            <div class="detail-stats">
              <div class="stat">
                <span class="stat-label">Cardinal</span>
                <span class="stat-value" data-detail-cardinal>North</span>
              </div>
              <div class="stat">
                <span class="stat-label">Visible points</span>
                <span class="stat-value" data-detail-visible>32</span>
              </div>
              <div class="stat">
                <span class="stat-label">Atomic count</span>
                <span class="stat-value" data-detail-count>8</span>
              </div>
              <div class="stat">
                <span class="stat-label">Compound read</span>
                <span class="stat-value" data-detail-route>Windowed route</span>
              </div>
            </div>

            <div class="hero-actions">
              <a class="button primary" data-detail-href href="/laws/">Open North body</a>
              <a class="button" href="/gauges/">Read gauges</a>
            </div>
          </aside>
        </div>
      </section>
    `;
  }

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

  function bind(root) {
    const nodeLayer = qs(root, "[data-node-layer]");
    const detailCode = qs(root, "[data-detail-code]");
    const detailFamily = qs(root, "[data-detail-family]");
    const detailTitle = qs(root, "[data-detail-title]");
    const detailCopy = qs(root, "[data-detail-copy]");
    const detailCardinal = qs(root, "[data-detail-cardinal]");
    const detailVisible = qs(root, "[data-detail-visible]");
    const detailCount = qs(root, "[data-detail-count]");
    const detailRoute = qs(root, "[data-detail-route]");
    const detailHref = qs(root, "[data-detail-href]");

    const bonds = {
      north: qs(root, '[data-bond="north"]'),
      south: qs(root, '[data-bond="south"]'),
      east: qs(root, '[data-bond="east"]'),
      west: qs(root, '[data-bond="west"]')
    };

    function renderBonds() {
      setBond(bonds.north, CARDINALS.north.atomX, CARDINALS.north.atomY);
      setBond(bonds.south, CARDINALS.south.atomX, CARDINALS.south.atomY);
      setBond(bonds.east, CARDINALS.east.atomX, CARDINALS.east.atomY);
      setBond(bonds.west, CARDINALS.west.atomX, CARDINALS.west.atomY);
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

      qsa(nodeLayer, "[data-id]").forEach((button) => {
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

    function renderFilters() {
      filterButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.filter === state.filter);
      });
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
  }

  function mount() {
    const target = ensureMountTarget();
    clearPriorRuntime(target);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-products-runtime-root", RUNTIME_ID);
    wrapper.innerHTML = renderTemplate();

    target.appendChild(wrapper.firstElementChild);
    bind(qs(target, `[data-products-runtime-root="${RUNTIME_ID}"]`));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
