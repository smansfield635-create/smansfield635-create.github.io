(() => {
  const RUNTIME_ID = "products-runtime-seasonal-floating-molecule-v1";
  const STYLE_ID = "products-runtime-seasonal-floating-molecule-style";
  const RECEIPT_FLAG = "productsRuntimeMounted";

  const CARDINALS = {
    north: {
      label: "North",
      seasonLabel: "Winter",
      colorLabel: "White",
      pairKey: "winter-spring",
      color: "var(--north)",
      glow: "rgba(223,233,255,.78)",
      role: "Framekeeping · threshold · classification",
      href: "/laws/",
      phaseBase: Math.PI * 1.25
    },
    south: {
      label: "South",
      seasonLabel: "Spring",
      colorLabel: "Green",
      pairKey: "winter-spring",
      color: "var(--south)",
      glow: "rgba(142,227,172,.78)",
      role: "Continuity · growth · restoration",
      href: "/gauges/",
      phaseBase: Math.PI * 0.25
    },
    west: {
      label: "West",
      seasonLabel: "Fall",
      colorLabel: "Yellow",
      pairKey: "fall-summer",
      color: "var(--west)",
      glow: "rgba(255,213,138,.78)",
      role: "Harvest · audit · refinement",
      href: "/about/",
      phaseBase: Math.PI * 0.75
    },
    east: {
      label: "East",
      seasonLabel: "Summer",
      colorLabel: "Blue",
      pairKey: "fall-summer",
      color: "var(--east)",
      glow: "rgba(142,197,255,.78)",
      role: "Signal · expansion · formation",
      href: "/products/",
      phaseBase: Math.PI * 1.75
    }
  };

  const PAIRS = {
    "winter-spring": {
      label: "Winter · Spring",
      description: "Winter and Spring form one diagonal figure-eight through the shared center throat.",
      angle: 45
    },
    "fall-summer": {
      label: "Fall · Summer",
      description: "Fall and Summer form the opposing diagonal figure-eight through the same center throat.",
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

      [data-products-runtime-root] .window-panel { padding: 16px; }
      [data-products-runtime-root] .detail-panel { padding: 22px; }

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
        height: 680px;
        width: 100%;
        max-width: 100%;
        border: 1px solid rgba(113,141,224,.14);
        border-radius: 28px;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 50%, rgba(135,164,255,.13), transparent 24%),
          linear-gradient(180deg, rgba(4,10,22,.94), rgba(2,8,18,.98));
        isolation: isolate;
      }

      [data-products-runtime-root] .flower-stage::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 50% 50%, rgba(255,255,255,.04), transparent 20%),
          linear-gradient(135deg, rgba(255,255,255,.04), transparent 38%),
          linear-gradient(225deg, rgba(255,255,255,.03), transparent 34%);
        opacity: .85;
        z-index: 1;
      }

      [data-products-runtime-root] .window-title {
        position: absolute;
        left: 50%;
        top: 14px;
        transform: translateX(-50%);
        padding: 8px 14px;
        border-radius: 999px;
        border: 1px solid rgba(140,168,240,.22);
        background: rgba(6,14,28,.86);
        color: #dbe5ff;
        font-size: .72rem;
        letter-spacing: .14em;
        text-transform: uppercase;
        z-index: 18;
        max-width: calc(100% - 32px);
        white-space: normal;
        text-align: center;
        line-height: 1.35;
      }

      [data-products-runtime-root] .glass-window {
        position: absolute;
        inset: 52px 18px 82px;
        border-radius: 28px;
        overflow: hidden;
        z-index: 2;
        border: 1px solid rgba(255,255,255,.12);
        box-shadow:
          inset 0 0 32px rgba(255,255,255,.05),
          inset 0 -18px 42px rgba(0,0,0,.20),
          0 22px 60px rgba(0,0,0,.28);
        background: rgba(5,12,24,.58);
      }

      [data-products-runtime-root] .glass-window::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 24% 24%, rgba(245,248,255,.16), transparent 20%),
          radial-gradient(circle at 76% 24%, rgba(120,200,255,.16), transparent 22%),
          radial-gradient(circle at 24% 76%, rgba(255,205,110,.14), transparent 22%),
          radial-gradient(circle at 76% 76%, rgba(110,230,165,.14), transparent 22%);
        z-index: 2;
      }

      [data-products-runtime-root] .glass-pane {
        position: absolute;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.075);
        box-shadow:
          inset 0 0 34px rgba(255,255,255,.06),
          inset 0 -20px 38px rgba(0,0,0,.18);
      }

      [data-products-runtime-root] .glass-pane::before,
      [data-products-runtime-root] .glass-pane::after {
        content: "";
        position: absolute;
        inset: -20%;
        border-radius: 50%;
        border: 2px solid rgba(5,10,22,.58);
        box-shadow:
          0 0 0 1px rgba(255,255,255,.035),
          inset 0 0 18px rgba(255,255,255,.035);
        transform: rotate(var(--arc-rotation));
        opacity: .78;
      }

      [data-products-runtime-root] .glass-pane::after {
        inset: 14%;
        transform: rotate(calc(var(--arc-rotation) * -1));
        opacity: .48;
      }

      [data-products-runtime-root] .glass-pane.winter {
        left: 0;
        top: 0;
        width: 50%;
        height: 50%;
        border-radius: 24px 0 0 0;
        --arc-rotation: -24deg;
        background:
          radial-gradient(circle at 58% 50%, rgba(245,248,255,.24), transparent 48%),
          linear-gradient(135deg, rgba(232,238,255,.24), rgba(108,126,190,.12));
      }

      [data-products-runtime-root] .glass-pane.summer {
        right: 0;
        top: 0;
        width: 50%;
        height: 50%;
        border-radius: 0 24px 0 0;
        --arc-rotation: 28deg;
        background:
          radial-gradient(circle at 40% 50%, rgba(175,222,255,.24), transparent 48%),
          linear-gradient(135deg, rgba(90,180,255,.22), rgba(22,74,140,.16));
      }

      [data-products-runtime-root] .glass-pane.fall {
        left: 0;
        bottom: 0;
        width: 50%;
        height: 50%;
        border-radius: 0 0 0 24px;
        --arc-rotation: 28deg;
        background:
          radial-gradient(circle at 58% 46%, rgba(255,225,150,.24), transparent 48%),
          linear-gradient(135deg, rgba(255,205,84,.22), rgba(130,82,18,.18));
      }

      [data-products-runtime-root] .glass-pane.spring {
        right: 0;
        bottom: 0;
        width: 50%;
        height: 50%;
        border-radius: 0 0 24px 0;
        --arc-rotation: -26deg;
        background:
          radial-gradient(circle at 40% 46%, rgba(150,255,188,.24), transparent 48%),
          linear-gradient(135deg, rgba(78,220,135,.22), rgba(24,96,58,.18));
      }

      [data-products-runtime-root] .leadline {
        position: absolute;
        pointer-events: none;
        z-index: 5;
        background: linear-gradient(180deg, rgba(9,13,26,.72), rgba(0,0,0,.56));
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.12),
          0 0 14px rgba(0,0,0,.28);
      }

      [data-products-runtime-root] .leadline.vertical {
        left: 50%;
        top: 0;
        bottom: 0;
        width: 3px;
        transform: translateX(-50%);
      }

      [data-products-runtime-root] .leadline.horizontal {
        top: 50%;
        left: 0;
        right: 0;
        height: 3px;
        transform: translateY(-50%);
      }

      [data-products-runtime-root] .leadline.arc {
        background: transparent;
        border: 3px solid rgba(4,8,18,.64);
        box-shadow:
          inset 0 0 10px rgba(255,255,255,.04),
          0 0 12px rgba(0,0,0,.26);
        border-radius: 50%;
        opacity: .66;
      }

      [data-products-runtime-root] .leadline.arc.one {
        left: 6%;
        top: 5%;
        width: 48%;
        height: 44%;
        transform: rotate(-24deg);
      }

      [data-products-runtime-root] .leadline.arc.two {
        right: 6%;
        top: 5%;
        width: 48%;
        height: 44%;
        transform: rotate(24deg);
      }

      [data-products-runtime-root] .leadline.arc.three {
        left: 6%;
        bottom: 5%;
        width: 48%;
        height: 44%;
        transform: rotate(24deg);
      }

      [data-products-runtime-root] .leadline.arc.four {
        right: 6%;
        bottom: 5%;
        width: 48%;
        height: 44%;
        transform: rotate(-24deg);
      }

      [data-products-runtime-root] .molecule-layer {
        position: absolute;
        inset: 52px 18px 82px;
        z-index: 12;
        pointer-events: none;
      }

      [data-products-runtime-root] .molecule-layer::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 118px;
        height: 118px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background:
          radial-gradient(circle, rgba(255,255,255,.96) 0 4%, rgba(210,228,255,.42) 12%, rgba(140,178,255,.16) 34%, transparent 68%);
        filter: blur(.2px);
        box-shadow:
          0 0 22px rgba(255,255,255,.44),
          0 0 50px rgba(130,170,255,.24);
        opacity: .92;
        z-index: 2;
      }

      [data-products-runtime-root] .molecule-trail {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        z-index: 3;
        pointer-events: none;
      }

      [data-products-runtime-root] .molecule-trail path {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 5.5;
        opacity: .46;
      }

      [data-products-runtime-root] .trail-winter-spring {
        stroke: rgba(176, 245, 205, .38);
        filter: drop-shadow(0 0 10px rgba(142,227,172,.20));
      }

      [data-products-runtime-root] .trail-fall-summer {
        stroke: rgba(185, 217, 255, .34);
        filter: drop-shadow(0 0 10px rgba(142,197,255,.20));
      }

      [data-products-runtime-root] .petal-label {
        position: absolute;
        transform: translate(-50%, -50%);
        min-width: 86px;
        height: 30px;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(6,14,28,.76);
        color: #f7fbff;
        font-size: .62rem;
        font-weight: 800;
        letter-spacing: .13em;
        text-transform: uppercase;
        z-index: 10;
        pointer-events: none;
        box-shadow: 0 12px 32px rgba(0,0,0,.28);
      }

      [data-products-runtime-root] .petal-label.winter { left: 25%; top: 28%; }
      [data-products-runtime-root] .petal-label.summer { left: 75%; top: 28%; }
      [data-products-runtime-root] .petal-label.fall { left: 25%; top: 72%; }
      [data-products-runtime-root] .petal-label.spring { left: 75%; top: 72%; }

      [data-products-runtime-root] .node-layer {
        position: absolute;
        inset: 0;
        z-index: 16;
        pointer-events: none;
      }

      [data-products-runtime-root] .node {
        position: absolute;
        left: var(--x);
        top: var(--y);
        width: 15px;
        height: 15px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,.84);
        background: var(--color);
        box-shadow:
          0 0 0 5px rgba(255,255,255,.05),
          0 0 18px var(--glow),
          0 0 38px var(--glow);
        cursor: pointer;
        transition: transform .16s ease, opacity .16s ease, box-shadow .16s ease, filter .16s ease;
        z-index: 9;
        pointer-events: auto;
      }

      [data-products-runtime-root] .node::after {
        content: "";
        display: none;
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
        opacity: .12;
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
        background: rgba(6,14,28,.82);
        text-align: center;
        text-transform: uppercase;
        letter-spacing: .14em;
        font-size: .72rem;
        color: #dbe5ff;
        box-shadow: 0 12px 32px rgba(0,0,0,.28);
        z-index: 18;
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
          height: 600px;
        }

        [data-products-runtime-root] .glass-window,
        [data-products-runtime-root] .molecule-layer {
          inset: 54px 6px 76px;
        }

        [data-products-runtime-root] .window-title {
          font-size: .60rem;
        }

        [data-products-runtime-root] .leadline.arc {
          border-width: 2px;
        }

        [data-products-runtime-root] .molecule-layer::before {
          width: 82px;
          height: 82px;
        }

        [data-products-runtime-root] .molecule-trail path {
          stroke-width: 4.2;
          opacity: .38;
        }

        [data-products-runtime-root] .petal-label {
          min-width: 62px;
          height: 26px;
          padding: 0 8px;
          font-size: .50rem;
          letter-spacing: .10em;
        }

        [data-products-runtime-root] .petal-label.winter { left: 24%; top: 24%; }
        [data-products-runtime-root] .petal-label.summer { left: 76%; top: 24%; }
        [data-products-runtime-root] .petal-label.fall { left: 24%; top: 76%; }
        [data-products-runtime-root] .petal-label.spring { left: 76%; top: 76%; }

        [data-products-runtime-root] .node {
          width: 12px;
          height: 12px;
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
          seasonLabel: cardinal.seasonLabel,
          colorLabel: cardinal.colorLabel,
          color: cardinal.color,
          glow: cardinal.glow,
          role: cardinal.role,
          href: cardinal.href,
          description:
            `${title} is a ${cardinal.seasonLabel.toLowerCase()} point floating in front of the stained-glass window. ` +
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
            <h2>Stained-glass seasonal flower</h2>
            <div class="window-meta">2 figure-eights · 4 seasons · 32 points</div>
          </div>

          <div class="flower-stage">
            <div class="window-title">floating seasonal molecule · leaded stained glass</div>

            <div class="glass-window" aria-hidden="true">
              <div class="glass-pane winter"></div>
              <div class="glass-pane summer"></div>
              <div class="glass-pane fall"></div>
              <div class="glass-pane spring"></div>

              <div class="leadline vertical"></div>
              <div class="leadline horizontal"></div>
              <div class="leadline arc one"></div>
              <div class="leadline arc two"></div>
              <div class="leadline arc three"></div>
              <div class="leadline arc four"></div>
            </div>

            <div class="molecule-layer">
              <svg class="molecule-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path class="trail-winter-spring" d="M50 50 C17 7, 4 32, 50 50 C96 68, 83 93, 50 50" />
                <path class="trail-fall-summer" d="M50 50 C7 83, 32 96, 50 50 C68 4, 93 17, 50 50" />
              </svg>

              <div class="petal-label winter">Winter</div>
              <div class="petal-label summer">Summer</div>
              <div class="petal-label fall">Fall</div>
              <div class="petal-label spring">Spring</div>

              <div class="node-layer" data-node-layer></div>
            </div>

            <div class="flower-copy">
              <strong>Floating seasonal molecule</strong> · stained glass behind it, motion in front
            </div>
          </div>
        </div>

        <aside class="detail-panel">
          <div class="detail-kicker">
            <span class="badge" data-detail-code>N01</span>
            <span data-detail-family>Winter · Winter/Spring loop</span>
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
              <span class="stat-label">Season pair</span>
              <span class="stat-value" data-detail-count>Winter · Spring</span>
            </div>
            <div class="stat">
              <span class="stat-label">Motion read</span>
              <span class="stat-value" data-detail-route>Floating seasonal molecule</span>
            </div>
          </div>

          <div class="motion-readout" data-motion-readout>
            <strong>Motion:</strong> the seasonal molecule floats in front of the stained-glass window.
          </div>

          <div class="hero-actions">
            <a class="button primary" data-detail-href href="/laws/">Open Winter body</a>
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
            aria-label="${item.seasonLabel} ${item.code}: ${item.title}"
            title="${item.seasonLabel} ${item.code}: ${item.title}"
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
      detailFamily.textContent = `${active.seasonLabel} · ${pair.label} loop`;
      detailTitle.textContent = active.title;
      detailCopy.textContent = active.description;
      detailCardinal.textContent = active.cardinalLabel;
      detailVisible.textContent = String(list.length);
      detailCount.textContent = pair.label;
      detailRoute.textContent = active.role;
      detailHref.href = active.href;
      detailHref.textContent = `Open ${active.seasonLabel} body`;
      motionReadout.innerHTML = `<strong>Motion:</strong> ${pair.description}`;
    }

    function animate() {
      const now = performance.now();
      const elapsed = (now - state.startedAt) / 1000;
      const speed = 0.42;
      const isMobile = window.matchMedia("(max-width: 720px)").matches;
      const scaleX = isMobile ? 34 : 36;
      const scaleY = isMobile ? 25 : 27;

      qsa(nodeLayer, "[data-id]").forEach((button) => {
        const item = PRODUCTS.find((entry) => entry.id === button.dataset.id);
        if (!item) return;

        const pair = PAIRS[item.pairKey];
        const point = lemniscatePoint(elapsed * speed + item.phase, pair.angle, scaleX, scaleY);

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
