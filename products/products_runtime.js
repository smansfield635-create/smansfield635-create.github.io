(() => {
  const RUNTIME_ID = "products-runtime-four-lobed-direct-root-v1";
  const STYLE_ID = "products-runtime-four-lobed-direct-root-style";
  const RECEIPT_FLAG = "productsRuntimeMounted";

  const CARDINALS = {
    north: {
      label: "North",
      atomLabel: "White",
      pairKey: "white-green",
      color: "var(--north)",
      glow: "rgba(223,233,255,.72)",
      role: "Framekeeping · threshold · classification",
      href: "/laws/",
      phaseBase: Math.PI * 1.25
    },
    south: {
      label: "South",
      atomLabel: "Green",
      pairKey: "white-green",
      color: "var(--south)",
      glow: "rgba(142,227,172,.72)",
      role: "Continuity · care · restoration",
      href: "/gauges/",
      phaseBase: Math.PI * 0.25
    },
    west: {
      label: "West",
      atomLabel: "Yellow",
      pairKey: "yellow-blue",
      color: "var(--west)",
      glow: "rgba(255,213,138,.72)",
      role: "Pressure-test · audit · contradiction",
      href: "/about/",
      phaseBase: Math.PI * 0.75
    },
    east: {
      label: "East",
      atomLabel: "Blue",
      pairKey: "yellow-blue",
      color: "var(--east)",
      glow: "rgba(142,197,255,.72)",
      role: "Signal · build-line · formation",
      href: "/products/",
      phaseBase: Math.PI * 1.75
    }
  };

  const PAIRS = {
    "white-green": {
      label: "White · Green",
      description: "White and green form one diagonal figure-eight through the shared center throat.",
      angle: 45
    },
    "yellow-blue": {
      label: "Yellow · Blue",
      description: "Yellow and blue form the opposing diagonal figure-eight through the same center throat.",
      angle: -45
    }
  };

  const TITLES = {
    north: ["Threshold", "Keystone", "Vector", "Atlas", "Compass", "Gate", "Apex", "Frame"],
    south: ["Harbor", "Root", "Hearth", "Current", "Shelter", "Orchard", "Rhythm", "Restore"],
    west: ["Audit", "Fracture", "Mirror", "Proof", "Fault", "Cipher", "Tension", "Sentinel"],
    east: ["Signal", "Pattern", "Forge", "Bloom", "Spark", "Loom", "Meridian", "Rise"]
  };

  const state = {
    filter: "all",
    activeId: null,
    animationFrame: null,
    startedAt: performance.now()
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

      [data-products-runtime-root] .runtime-shell {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(320px, .8fr);
        gap: 18px;
        align-items: start;
        min-width: 0;
      }

      [data-products-runtime-root] .window-panel,
      [data-products-runtime-root] .detail-panel {
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
        background: linear-gradient(180deg, rgba(9,17,33,.88), rgba(6,12,24,.82));
        border-radius: 24px;
        min-width: 0;
        overflow: hidden;
      }

      [data-products-runtime-root] .window-panel {
        padding: 16px;
      }

      [data-products-runtime-root] .detail-panel {
        padding: 22px;
      }

      [data-products-runtime-root] .window-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 14px;
        padding: 4px 6px 2px;
      }

      [data-products-runtime-root] .window-head h2 {
        margin: 0;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: .16em;
        color: #d7e2ff;
      }

      [data-products-runtime-root] .window-meta {
        color: var(--muted);
        font-size: .82rem;
        letter-spacing: .12em;
        text-transform: uppercase;
        white-space: normal;
        text-align: right;
        max-width: 52%;
        line-height: 1.35;
      }

      [data-products-runtime-root] .flower-stage {
        position: relative;
        height: 620px;
        width: 100%;
        max-width: 100%;
        border: 1px solid rgba(113,141,224,.14);
        border-radius: 28px;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 50%, rgba(135,164,255,.13), transparent 22%),
          linear-gradient(180deg, rgba(4,10,22,.92), rgba(2,8,18,.98));
        isolation: isolate;
      }

      [data-products-runtime-root] .flower-stage::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(135deg, rgba(255,255,255,.04), transparent 38%),
          linear-gradient(225deg, rgba(255,255,255,.03), transparent 34%);
        opacity: .8;
      }

      [data-products-runtime-root] .window-title {
        position: absolute;
        left: 50%;
        top: 14px;
        transform: translateX(-50%);
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(140,168,240,.22);
        background: rgba(6,14,28,.78);
        color: #dbe5ff;
        font-size: .72rem;
        letter-spacing: .14em;
        text-transform: uppercase;
        z-index: 12;
        max-width: calc(100% - 32px);
        white-space: normal;
        text-align: center;
        line-height: 1.35;
      }

      [data-products-runtime-root] .glass-panel {
        position: absolute;
        inset: 12px;
        border-radius: 22px;
        overflow: hidden;
        z-index: 1;
      }

      [data-products-runtime-root] .glass-pane {
        position: absolute;
        border: 1px solid rgba(255,255,255,.08);
        box-shadow:
          inset 0 0 22px rgba(255,255,255,.04),
          inset 0 -10px 24px rgba(0,0,0,.16);
        backdrop-filter: blur(1px);
      }

      [data-products-runtime-root] .glass-pane.white {
        left: 8%;
        top: 8%;
        width: 38%;
        height: 34%;
        border-radius: 36px 24px 52px 28px;
        background:
          radial-gradient(circle at 62% 40%, rgba(240,246,255,.22), transparent 40%),
          linear-gradient(135deg, rgba(221,232,255,.18), rgba(123,146,214,.12));
      }

      [data-products-runtime-root] .glass-pane.blue {
        right: 8%;
        top: 8%;
        width: 38%;
        height: 34%;
        border-radius: 24px 36px 28px 52px;
        background:
          radial-gradient(circle at 36% 40%, rgba(188,224,255,.20), transparent 42%),
          linear-gradient(135deg, rgba(143,201,255,.18), rgba(67,111,190,.12));
      }

      [data-products-runtime-root] .glass-pane.yellow {
        left: 8%;
        bottom: 8%;
        width: 38%;
        height: 34%;
        border-radius: 28px 52px 24px 36px;
        background:
          radial-gradient(circle at 60% 44%, rgba(255,222,170,.18), transparent 42%),
          linear-gradient(135deg, rgba(255,213,143,.18), rgba(147,107,46,.12));
      }

      [data-products-runtime-root] .glass-pane.green {
        right: 8%;
        bottom: 8%;
        width: 38%;
        height: 34%;
        border-radius: 52px 28px 36px 24px;
        background:
          radial-gradient(circle at 40% 44%, rgba(177,245,196,.18), transparent 42%),
          linear-gradient(135deg, rgba(151,230,180,.18), rgba(47,113,74,.12));
      }

      [data-products-runtime-root] .lead-came {
        position: absolute;
        background: linear-gradient(180deg, rgba(226,231,241,.56), rgba(86,96,120,.72));
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.22),
          inset 0 -1px 0 rgba(0,0,0,.24),
          0 0 10px rgba(0,0,0,.12);
        z-index: 3;
        pointer-events: none;
      }

      [data-products-runtime-root] .lead-came.v {
        width: 10px;
        top: 0;
        bottom: 0;
        border-radius: 999px;
      }

      [data-products-runtime-root] .lead-came.h {
        height: 10px;
        left: 0;
        right: 0;
        border-radius: 999px;
      }

      [data-products-runtime-root] .lead-came.diag {
        width: 10px;
        height: 260px;
        left: 50%;
        top: 50%;
        transform-origin: center center;
        border-radius: 999px;
      }

      [data-products-runtime-root] .flower-window {
        position: absolute;
        inset: 28px 18px 74px;
        border-radius: 26px;
        overflow: hidden;
        z-index: 5;
      }

      [data-products-runtime-root] .flower-path {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        z-index: 2;
        pointer-events: none;
      }

      [data-products-runtime-root] .flower-path path {
        fill: none;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
        opacity: .52;
      }

      [data-products-runtime-root] .path-white-green {
        stroke: rgba(194,245,214,.46);
        filter: drop-shadow(0 0 10px rgba(142,227,172,.16));
      }

      [data-products-runtime-root] .path-yellow-blue {
        stroke: rgba(185,217,255,.42);
        filter: drop-shadow(0 0 10px rgba(142,197,255,.16));
      }

      [data-products-runtime-root] .flower-center {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 92px;
        height: 92px;
        transform: translate(-50%, -50%) rotate(45deg);
        border-radius: 18px;
        border: 1px solid rgba(214,226,255,.20);
        background:
          radial-gradient(circle, rgba(247,250,255,.64) 0%, rgba(149,188,255,.20) 36%, rgba(92,130,216,.06) 70%, transparent 84%);
        box-shadow:
          0 0 30px rgba(144,182,255,.18),
          inset 0 0 22px rgba(255,255,255,.06);
        z-index: 4;
        pointer-events: none;
        animation: flowerCenterPulse 4.8s ease-in-out infinite;
      }

      @keyframes flowerCenterPulse {
        0%, 100% {
          opacity: .62;
          transform: translate(-50%, -50%) rotate(45deg) scale(.96);
        }
        50% {
          opacity: .88;
          transform: translate(-50%, -50%) rotate(45deg) scale(1.06);
        }
      }

      [data-products-runtime-root] .petal-label {
        position: absolute;
        transform: translate(-50%, -50%);
        min-width: 84px;
        height: 32px;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(6,14,28,.66);
        color: #f7fbff;
        font-size: .68rem;
        font-weight: 800;
        letter-spacing: .14em;
        text-transform: uppercase;
        z-index: 7;
        pointer-events: none;
      }

      [data-products-runtime-root] .petal-label.white { left: 31%; top: 31%; }
      [data-products-runtime-root] .petal-label.blue { left: 69%; top: 31%; }
      [data-products-runtime-root] .petal-label.yellow { left: 31%; top: 69%; }
      [data-products-runtime-root] .petal-label.green { left: 69%; top: 69%; }

      [data-products-runtime-root] .node-layer {
        position: absolute;
        inset: 0;
        z-index: 8;
      }

      [data-products-runtime-root] .node {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 16px;
        height: 16px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.76);
        background: var(--color);
        box-shadow:
          0 0 0 5px rgba(255,255,255,.04),
          0 0 18px var(--glow),
          0 0 36px var(--glow);
        cursor: pointer;
        transition: transform .16s ease, opacity .16s ease, box-shadow .16s ease, filter .16s ease;
        z-index: 9;
      }

      [data-products-runtime-root] .node::after {
        content: attr(data-short);
        position: absolute;
        top: calc(100% + 7px);
        left: 50%;
        transform: translateX(-50%);
        font-size: .54rem;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: #d9e5ff;
        white-space: nowrap;
        opacity: .82;
        pointer-events: none;
      }

      [data-products-runtime-root] .node:hover,
      [data-products-runtime-root] .node:focus-visible {
        transform: translate(-50%, -50%) scale(1.18);
        outline: none;
      }

      [data-products-runtime-root] .node.is-active {
        transform: translate(-50%, -50%) scale(1.26);
      }

      [data-products-runtime-root] .node.is-muted {
        opacity: .14;
        filter: saturate(.28);
      }

      [data-products-runtime-root] .flower-copy {
        position: absolute;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        width: calc(100% - 32px);
        max-width: 620px;
        padding: 12px 16px;
        border-radius: 999px;
        border: 1px solid rgba(140,168,240,.24);
        background: rgba(6,14,28,.76);
        text-align: center;
        text-transform: uppercase;
        letter-spacing: .14em;
        font-size: .72rem;
        color: #dbe5ff;
        box-shadow: 0 12px 32px rgba(0,0,0,.28);
        z-index: 10;
        white-space: normal;
        line-height: 1.35;
      }

      [data-products-runtime-root] .flower-copy strong {
        color: #fff;
      }

      [data-products-runtime-root] .detail-kicker {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        color: #d7e3ff;
        letter-spacing: .14em;
        text-transform: uppercase;
        font-size: .74rem;
        flex-wrap: wrap;
      }

      [data-products-runtime-root] .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 38px;
        height: 24px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.04);
        color: #fff;
      }

      [data-products-runtime-root] .detail-title {
        margin: 0 0 10px;
        font-size: 1.5rem;
        line-height: 1.08;
        letter-spacing: -.02em;
      }

      [data-products-runtime-root] .detail-copy {
        color: var(--muted);
        line-height: 1.58;
      }

      [data-products-runtime-root] .detail-stats {
        display: grid;
        grid-template-columns: repeat(2,minmax(0,1fr));
        gap: 10px;
        margin-top: 16px;
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

      @media (max-width: 980px) {
        [data-products-runtime-root] .runtime-shell {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 720px) {
        [data-products-runtime-root] .window-panel,
        [data-products-runtime-root] .detail-panel {
          padding: 18px 16px;
        }

        [data-products-runtime-root] .window-head {
          display: grid;
          gap: 8px;
        }

        [data-products-runtime-root] .window-meta {
          max-width: none;
          text-align: left;
          font-size: .68rem;
        }

        [data-products-runtime-root] .flower-stage {
          height: 520px;
        }

        [data-products-runtime-root] .flower-window {
          inset: 24px 10px 72px;
        }

        [data-products-runtime-root] .lead-came.v {
          width: 8px;
        }

        [data-products-runtime-root] .lead-came.h {
          height: 8px;
        }

        [data-products-runtime-root] .lead-came.diag {
          width: 8px;
          height: 200px;
        }

        [data-products-runtime-root] .flower-center {
          width: 66px;
          height: 66px;
          border-radius: 14px;
        }

        [data-products-runtime-root] .petal-label {
          min-width: 62px;
          height: 27px;
          padding: 0 8px;
          font-size: .54rem;
          letter-spacing: .11em;
        }

        [data-products-runtime-root] .node {
          width: 13px;
          height: 13px;
        }

        [data-products-runtime-root] .node::after {
          font-size: .44rem;
          top: calc(100% + 5px);
        }

        [data-products-runtime-root] .flower-copy {
          width: calc(100% - 24px);
          max-width: none;
          font-size: .54rem;
          line-height: 1.35;
          letter-spacing: .10em;
          border-radius: 22px;
          padding: 10px 12px;
        }

        [data-products-runtime-root] .detail-stats {
          grid-template-columns: 1fr;
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
    return Array.from(root.querySelectorAll(selector));
  }

  function getMountTarget() {
    return (
      document.getElementById("productsRuntimeMount") ||
      document.querySelector("[data-products-runtime-mount]")
    );
  }

  function rotatePoint(x, y, angleDeg) {
    const angle = angleDeg * Math.PI / 180;
    return {
      x: x * Math.cos(angle) - y * Math.sin(angle),
      y: x * Math.sin(angle) + y * Math.cos(angle)
    };
  }

  function lemniscatePoint(t, angleDeg, scaleX, scaleY) {
    const x = scaleX * Math.sin(t);
    const y = scaleY * Math.sin(t) * Math.cos(t);
    const rotated = rotatePoint(x, y, angleDeg);
    return {
      x: 50 + rotated.x,
      y: 50 + rotated.y
    };
  }

  function buildProducts() {
    const items = [];
    const order = ["north", "south", "west", "east"];

    order.forEach((cardinalKey) => {
      const cardinal = CARDINALS[cardinalKey];
      const pair = PAIRS[cardinal.pairKey];

      TITLES[cardinalKey].forEach((title, index) => {
        const number = index + 1;
        const code = `${cardinal.label.charAt(0)}${String(number).padStart(2, "0")}`;
        const phase = cardinal.phaseBase + (Math.PI * 2 / 8) * index;

        items.push({
          id: `${cardinalKey}-${String(number).padStart(2, "0")}`,
          code,
          title,
          index,
          phase,
          pairKey: cardinal.pairKey,
          pairLabel: pair.label,
          cardinalKey,
          cardinalLabel: cardinal.label,
          atomLabel: cardinal.atomLabel,
          color: cardinal.color,
          glow: cardinal.glow,
          role: cardinal.role,
          href: cardinal.href,
          description:
            `${title} is a ${cardinal.atomLabel.toLowerCase()} point on the four-lobed molecular flower. ` +
            `${pair.description} It participates as ${cardinal.role.toLowerCase()}.`
        });
      });
    });

    return items;
  }

  const PRODUCTS = buildProducts();
  state.activeId = PRODUCTS[0]?.id || null;

  function visibleProducts() {
    if (state.filter === "all") return PRODUCTS;
    return PRODUCTS.filter((item) => item.cardinalKey === state.filter);
  }

  function currentActive(list) {
    const explicit = PRODUCTS.find((item) => item.id === state.activeId);
    if (explicit && list.some((item) => item.id === explicit.id)) return explicit;
    return list[0] || PRODUCTS[0];
  }

  function renderTemplate() {
    return `
      <div class="runtime-shell">
        <div class="window-panel">
          <div class="window-head">
            <h2>Stained-glass molecular flower</h2>
            <div class="window-meta">2 figure-eights · 4 lobes · 32 points</div>
          </div>

          <div class="flower-stage">
            <div class="window-title">shared-center stained-glass viewport</div>

            <div class="glass-panel">
              <div class="glass-pane white"></div>
              <div class="glass-pane blue"></div>
              <div class="glass-pane yellow"></div>
              <div class="glass-pane green"></div>
            </div>

            <div class="lead-came h" style="top:12px;"></div>
            <div class="lead-came h" style="bottom:12px;"></div>
            <div class="lead-came v" style="left:12px;"></div>
            <div class="lead-came v" style="right:12px;"></div>
            <div class="lead-came v" style="left:50%;transform:translateX(-50%);top:14%;bottom:14%;"></div>
            <div class="lead-came h" style="top:50%;transform:translateY(-50%);left:14%;right:14%;"></div>
            <div class="lead-came diag" style="transform:translate(-50%,-50%) rotate(45deg);"></div>
            <div class="lead-came diag" style="transform:translate(-50%,-50%) rotate(-45deg);"></div>

            <div class="flower-window">
              <svg class="flower-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path class="path-white-green" d="M50 50 C20 9, 8 34, 50 50 C92 66, 80 91, 50 50" />
                <path class="path-yellow-blue" d="M50 50 C9 80, 34 92, 50 50 C66 8, 91 20, 50 50" />
              </svg>

              <div class="flower-center"></div>

              <div class="petal-label white">White</div>
              <div class="petal-label blue">Blue</div>
              <div class="petal-label yellow">Yellow</div>
              <div class="petal-label green">Green</div>

              <div class="node-layer" data-node-layer></div>
            </div>

            <div class="flower-copy">
              <strong>Four-lobed molecular flower</strong> · two figure-eights crossing one shared throat
            </div>
          </div>
        </div>

        <aside class="detail-panel">
          <div class="detail-kicker">
            <span class="badge" data-detail-code>N01</span>
            <span data-detail-family>White · White/Green loop</span>
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
              <span class="stat-value" data-detail-route>Shared-center torsion</span>
            </div>
          </div>

          <div class="motion-readout" data-motion-readout>
            <strong>Motion:</strong> two figure-eights overlap into one four-lobed compound.
          </div>

          <div class="hero-actions">
            <a class="button primary" data-detail-href href="/laws/">Open White body</a>
            <a class="button" href="/gauges/">Read gauges</a>
          </div>
        </aside>
      </div>
    `;
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

    if (!nodeLayer) {
      throw new Error("Products runtime mount failed: node layer missing.");
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
            style="--x:50%;--y:50%;--color:${item.color};--glow:${item.glow};"
            aria-label="${item.atomLabel} ${item.code}: ${item.title}"
            title="${item.atomLabel} ${item.code}: ${item.title}"
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
      detailFamily.textContent = `${active.atomLabel} · ${pair.label} loop`;
      detailTitle.textContent = active.title;
      detailCopy.textContent = active.description;
      detailCardinal.textContent = active.cardinalLabel;
      detailVisible.textContent = String(list.length);
      detailCount.textContent = pair.label;
      detailRoute.textContent = active.role;
      detailHref.href = active.href;
      detailHref.textContent = `Open ${active.atomLabel} body`;
      motionReadout.innerHTML = `<strong>Motion:</strong> ${pair.description}`;
    }

    function animate() {
      const now = performance.now();
      const elapsed = (now - state.startedAt) / 1000;
      const speed = 0.52;

      qsa(nodeLayer, "[data-id]").forEach((button) => {
        const item = PRODUCTS.find((entry) => entry.id === button.dataset.id);
        if (!item) return;

        const pair = PAIRS[item.pairKey];
        const point = lemniscatePoint(elapsed * speed + item.phase, pair.angle, 26, 20);

        button.style.left = `${point.x}%`;
        button.style.top = `${point.y}%`;
      });

      state.animationFrame = requestAnimationFrame(animate);
    }

    function render() {
      renderFilters();
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

    const mountTarget = getMountTarget();

    if (!mountTarget) {
      throw new Error("Products runtime mount failed: #productsRuntimeMount not found.");
    }

    if (state.animationFrame) {
      cancelAnimationFrame(state.animationFrame);
      state.animationFrame = null;
    }

    mountTarget.innerHTML = "";

    const root = document.createElement("section");
    root.className = "section";
    root.setAttribute("data-products-runtime-root", RUNTIME_ID);
    root.setAttribute("aria-live", "polite");
    root.innerHTML = renderTemplate();

    mountTarget.appendChild(root);
    window[RECEIPT_FLAG] = true;
    mountTarget.dataset.runtimeStatus = "mounted";

    bind(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
