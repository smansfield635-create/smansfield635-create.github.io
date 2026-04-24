(() => {
  const RUNTIME_ID = "products-runtime-dual-figure-eight-stained-glass-v1";
  const STYLE_ID = "products-runtime-dual-figure-eight-style";

  const CARDINALS = {
    north: {
      label: "North",
      pair: "white-green",
      color: "var(--north)",
      glow: "rgba(223,233,255,.72)",
      role: "Framekeeping · threshold · classification",
      href: "/laws/",
      atomLabel: "WHITE",
      atomX: 36,
      atomY: 34
    },
    south: {
      label: "South",
      pair: "white-green",
      color: "var(--south)",
      glow: "rgba(142,227,172,.72)",
      role: "Continuity · care · restoration",
      href: "/gauges/",
      atomLabel: "GREEN",
      atomX: 64,
      atomY: 66
    },
    west: {
      label: "West",
      pair: "yellow-blue",
      color: "var(--west)",
      glow: "rgba(255,213,138,.72)",
      role: "Pressure-test · audit · contradiction",
      href: "/about/",
      atomLabel: "YELLOW",
      atomX: 36,
      atomY: 66
    },
    east: {
      label: "East",
      pair: "yellow-blue",
      color: "var(--east)",
      glow: "rgba(142,197,255,.72)",
      role: "Signal · build-line · formation",
      href: "/products/",
      atomLabel: "BLUE",
      atomX: 64,
      atomY: 34
    }
  };

  const TITLES = {
    north: ["Threshold", "Keystone", "Vector", "Atlas", "Compass", "Gate", "Apex", "Frame"],
    south: ["Harbor", "Root", "Hearth", "Current", "Shelter", "Orchard", "Rhythm", "Restore"],
    west: ["Audit", "Fracture", "Mirror", "Proof", "Fault", "Cipher", "Tension", "Sentinel"],
    east: ["Signal", "Pattern", "Forge", "Bloom", "Spark", "Loom", "Meridian", "Rise"]
  };

  const PAIRS = {
    "white-green": {
      label: "White · Green loop",
      axis: "North/South",
      pathClass: "loop-white-green",
      angle: 54,
      phase: 0,
      description: "White and green move as one interlocked figure-eight loop through the shared center throat."
    },
    "yellow-blue": {
      label: "Yellow · Blue loop",
      axis: "West/East",
      pathClass: "loop-yellow-blue",
      angle: -54,
      phase: Math.PI,
      description: "Yellow and blue move as the second figure-eight loop, crossing the same throat from the opposite torsion."
    }
  };

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      [data-products-runtime-root] {
        display: block;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }

      [data-products-runtime-root] .runtime-loop-track {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 72%;
        height: 44%;
        transform: translate(-50%, -50%) rotate(var(--loop-angle));
        border-radius: 50%;
        border: 1px solid rgba(214,226,255,.16);
        opacity: .34;
        z-index: 2;
        pointer-events: none;
      }

      [data-products-runtime-root] .runtime-loop-track::before,
      [data-products-runtime-root] .runtime-loop-track::after {
        content: "";
        position: absolute;
        top: 8%;
        width: 48%;
        height: 84%;
        border-radius: 50%;
        border: 1px solid currentColor;
        opacity: .62;
        box-shadow: 0 0 22px currentColor;
      }

      [data-products-runtime-root] .runtime-loop-track::before {
        left: 4%;
      }

      [data-products-runtime-root] .runtime-loop-track::after {
        right: 4%;
      }

      [data-products-runtime-root] .loop-white-green {
        color: rgba(190, 245, 215, .22);
      }

      [data-products-runtime-root] .loop-yellow-blue {
        color: rgba(180, 214, 255, .20);
      }

      [data-products-runtime-root] .runtime-throat-pulse {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 104px;
        height: 104px;
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 18px;
        border: 1px solid rgba(214,226,255,.18);
        background:
          radial-gradient(circle, rgba(247,250,255,.58) 0%, rgba(149,188,255,.20) 34%, rgba(92,130,216,.06) 68%, transparent 82%);
        box-shadow:
          0 0 24px rgba(144,182,255,.14),
          inset 0 0 22px rgba(255,255,255,.05);
        z-index: 4;
        pointer-events: none;
        animation: runtimeThroatPulse 4.8s ease-in-out infinite;
      }

      @keyframes runtimeThroatPulse {
        0%, 100% { opacity: .52; transform: translate(-50%, -50%) rotate(45deg) scale(.96); }
        50% { opacity: .84; transform: translate(-50%, -50%) rotate(45deg) scale(1.06); }
      }

      [data-products-runtime-root] .atom {
        transition: opacity .2s ease, filter .2s ease, transform .2s ease;
      }

      [data-products-runtime-root] .atom.is-muted {
        opacity: .18;
        filter: saturate(.35);
      }

      [data-products-runtime-root] .atom-label {
        min-width: 88px;
      }

      [data-products-runtime-root] .node {
        will-change: left, top, transform, opacity;
      }

      [data-products-runtime-root] .node[data-pair="white-green"] {
        animation: whiteGreenPulse 3.8s ease-in-out infinite;
      }

      [data-products-runtime-root] .node[data-pair="yellow-blue"] {
        animation: yellowBluePulse 3.8s ease-in-out infinite;
      }

      @keyframes whiteGreenPulse {
        0%,100% { filter: saturate(1) brightness(1); }
        50% { filter: saturate(1.16) brightness(1.1); }
      }

      @keyframes yellowBluePulse {
        0%,100% { filter: saturate(1) brightness(1); }
        50% { filter: saturate(1.12) brightness(1.08); }
      }

      [data-products-runtime-root] .motion-readout {
        margin-top: 14px;
        padding: 12px 14px;
        border: 1px solid rgba(164,188,255,.18);
        border-radius: 16px;
        background: rgba(255,255,255,.025);
        color: var(--muted);
        line-height: 1.55;
        font-size: .92rem;
      }

      [data-products-runtime-root] .motion-readout strong {
        color: var(--text);
      }

      @media (max-width: 720px) {
        [data-products-runtime-root] .runtime-loop-track {
          width: 84%;
          height: 42%;
        }

        [data-products-runtime-root] .runtime-throat-pulse {
          width: 70px;
          height: 70px;
          border-radius: 14px;
        }

        [data-products-runtime-root] .atom-label {
          min-width: 66px;
        }

        [data-products-runtime-root] .motion-readout {
          font-size: .84rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

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

  function lemniscatePoint(t, angleDeg, scaleX = 28, scaleY = 20) {
    const x = scaleX * Math.sin(t);
    const y = scaleY * Math.sin(t) * Math.cos(t);
    const angle = angleDeg * Math.PI / 180;
    const rx = x * Math.cos(angle) - y * Math.sin(angle);
    const ry = x * Math.sin(angle) + y * Math.cos(angle);

    return {
      x: 50 + rx,
      y: 50 + ry
    };
  }

  function buildProducts() {
    const items = [];
    const order = ["north", "south", "west", "east"];

    order.forEach((cardinalKey) => {
      const cardinal = CARDINALS[cardinalKey];
      const pair = PAIRS[cardinal.pair];

      TITLES[cardinalKey].forEach((title, index) => {
        const n = index + 1;
        const code = `${cardinal.label[0]}${String(n).padStart(2, "0")}`;
        const basePhase = (Math.PI * 2 / 8) * index;
        const sideShift = cardinalKey === "north" || cardinalKey === "west" ? 0 : Math.PI;

        items.push({
          id: `${cardinalKey}-${String(n).padStart(2, "0")}`,
          code,
          title,
          index,
          phase: basePhase + sideShift + pair.phase,
          pairKey: cardinal.pair,
          pairLabel: pair.label,
          cardinalKey,
          cardinalLabel: cardinal.label,
          atomLabel: cardinal.atomLabel,
          color: cardinal.color,
          glow: cardinal.glow,
          role: cardinal.role,
          href: cardinal.href,
          x: cardinal.atomX,
          y: cardinal.atomY,
          description:
            `${title} is a ${cardinal.label.toLowerCase()} atomic point inside the stained-glass molecule. ` +
            `It belongs to the ${cardinal.atomLabel.toLowerCase()} body and moves on the ${pair.label.toLowerCase()}, crossing the shared throat as ${cardinal.role.toLowerCase()}.`
        });
      });
    });

    return items;
  }

  const PRODUCTS = buildProducts();

  const state = {
    filter: "all",
    activeId: PRODUCTS[0]?.id ?? null,
    animationFrame: null,
    startedAt: performance.now()
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

  function renderTemplate() {
    return `
      <section class="section" data-products-runtime-root="${RUNTIME_ID}" aria-live="polite">
        <div class="section-head">
          <div>
            <div class="section-kicker">Contained molecular field</div>
            <h2>Choose a bonded point inside the stained-glass window</h2>
          </div>
          <div class="section-note">
            White and green now form one figure-eight. Yellow and blue form the second. Both overlap through one shared center.
          </div>
        </div>

        <div class="shell">
          <div class="window-panel">
            <div class="window-head">
              <h2>Stained-glass window</h2>
              <div class="window-meta">2 figure-eights · 4 atoms · 32 points</div>
            </div>

            <div class="window-stage">
              <div class="window-title">dual-loop stained-glass viewport</div>

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
                <div class="runtime-loop-track loop-white-green" style="--loop-angle:54deg;"></div>
                <div class="runtime-loop-track loop-yellow-blue" style="--loop-angle:-54deg;"></div>
                <div class="runtime-throat-pulse"></div>

                <div class="bond" data-bond="north"></div>
                <div class="bond" data-bond="south"></div>
                <div class="bond" data-bond="east"></div>
                <div class="bond" data-bond="west"></div>

                <div class="atom" data-atom="north" style="--x:36%;--y:34%;">
                  <div class="atom-label">White</div>
                </div>
                <div class="atom" data-atom="east" style="--x:64%;--y:34%;">
                  <div class="atom-label">Blue</div>
                </div>
                <div class="atom" data-atom="west" style="--x:36%;--y:66%;">
                  <div class="atom-label">Yellow</div>
                </div>
                <div class="atom" data-atom="south" style="--x:64%;--y:66%;">
                  <div class="atom-label">Green</div>
                </div>

                <div class="node-layer" data-node-layer></div>
              </div>

              <div class="window-copy">
                <strong>Dual figure-eight molecular chamber</strong> · white/green and yellow/blue overlap through one throat
              </div>
            </div>
          </div>

          <aside class="detail-panel">
            <div class="detail-kicker">
              <span class="badge" data-detail-code>N01</span>
              <span data-detail-family>White · atom</span>
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
                <span class="stat-label">Loop pair</span>
                <span class="stat-value" data-detail-count>White · Green</span>
              </div>
              <div class="stat">
                <span class="stat-label">Motion read</span>
                <span class="stat-value" data-detail-route>Dual-loop torsion</span>
              </div>
            </div>

            <div class="motion-readout" data-motion-readout>
              <strong>Motion:</strong> white and green share one figure-eight; yellow and blue share the second figure-eight.
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

  function setBond(el, x2, y2) {
    if (!el) return;

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
    const filterButtons = qsa(document, "#cardinalFilters [data-filter]");
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
    const motionReadout = qs(root, "[data-motion-readout]");

    const bonds = {
      north: qs(root, '[data-bond="north"]'),
      south: qs(root, '[data-bond="south"]'),
      east: qs(root, '[data-bond="east"]'),
      west: qs(root, '[data-bond="west"]')
    };

    const atoms = {
      north: qs(root, '[data-atom="north"]'),
      south: qs(root, '[data-atom="south"]'),
      east: qs(root, '[data-atom="east"]'),
      west: qs(root, '[data-atom="west"]')
    };

    function renderFilters() {
      filterButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.filter === state.filter);
      });
    }

    function renderBonds() {
      setBond(bonds.north, CARDINALS.north.atomX, CARDINALS.north.atomY);
      setBond(bonds.south, CARDINALS.south.atomX, CARDINALS.south.atomY);
      setBond(bonds.east, CARDINALS.east.atomX, CARDINALS.east.atomY);
      setBond(bonds.west, CARDINALS.west.atomX, CARDINALS.west.atomY);
    }

    function renderAtomFilters() {
      Object.keys(atoms).forEach((key) => {
        if (!atoms[key]) return;
        const muted = state.filter !== "all" && state.filter !== key;
        atoms[key].classList.toggle("is-muted", muted);
      });
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
            data-cardinal="${item.cardinalKey}"
            data-pair="${item.pairKey}"
            data-phase="${item.phase}"
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
          renderDetail();
          renderNodes();
        });

        button.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            state.activeId = button.dataset.id;
            renderDetail();
            renderNodes();
          }
        });
      });
    }

    function renderDetail() {
      const list = visibleProducts();
      const active = currentActive(list);
      if (!active) return;

      const pair = PAIRS[active.pairKey];

      detailCode.textContent = active.code;
      detailFamily.textContent = `${active.atomLabel} · ${active.pairLabel}`;
      detailTitle.textContent = active.title;
      detailCopy.textContent = active.description;
      detailCardinal.textContent = active.cardinalLabel;
      detailVisible.textContent = String(list.length);
      detailCount.textContent = pair.label.replace(" loop", "");
      detailRoute.textContent = active.role;
      detailHref.href = active.href;
      detailHref.textContent = `Open ${active.atomLabel} body`;

      motionReadout.innerHTML =
        `<strong>Motion:</strong> ${pair.description}`;
    }

    function animate() {
      const now = performance.now();
      const elapsed = (now - state.startedAt) / 1000;
      const speed = 0.62;

      qsa(nodeLayer, "[data-id]").forEach((button) => {
        const item = PRODUCTS.find((entry) => entry.id === button.dataset.id);
        if (!item) return;

        const pair = PAIRS[item.pairKey];
        const t = elapsed * speed + item.phase;
        const point = lemniscatePoint(t, pair.angle, 28, 20);

        button.style.left = `${point.x}%`;
        button.style.top = `${point.y}%`;
      });

      state.animationFrame = requestAnimationFrame(animate);
    }

    function render() {
      renderFilters();
      renderBonds();
      renderAtomFilters();
      renderNodes();
      renderDetail();

      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
      }

      animate();
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
    injectStyle();

    const target = ensureMountTarget();
    clearPriorRuntime(target);

    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-products-runtime-shell", RUNTIME_ID);
    wrapper.innerHTML = renderTemplate();

    target.appendChild(wrapper.firstElementChild);

    const root = qs(target, `[data-products-runtime-root="${RUNTIME_ID}"]`);
    if (root) bind(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
