/* ==========================================================================
   Assets Branch · Generation 2 Runtime
   TARGET=/assets/assets.js
   PURPOSE=inspect, mark, and receipt the shared Assets Branch instruments
   ========================================================================== */

(() => {
  "use strict";

  const STATE = {
    page: "assets",
    generation: "second-generation-renewal",
    runtime: "assets-branch-runtime",
    cssAuthority: "/assets/ui.css",
    universeAuthority: "/assets/universe_ui.js",
    mounted: false
  };

  const STYLE_ID = "assets-branch-runtime-style";
  const RECEIPT_ID = "assets-branch-runtime-receipt";
  const PANEL_SELECTOR = '[data-page="assets"] .panel, [data-page="assets"] .globe-demo';
  const CARD_SELECTOR = [
    '[data-page="assets"] .instrument-card',
    '[data-page="assets"] .contract-card',
    '[data-page="assets"] .receipt-card',
    '[data-page="assets"] .route-card'
  ].join(",");

  const runtimeCSS = `
    [data-page="assets"] {
      --assets-runtime-state: active;
    }

    [data-page="assets"] [data-assets-runtime-badge] {
      display:inline-flex;
      width:fit-content;
      align-items:center;
      min-height:28px;
      padding:5px 9px;
      border:1px solid rgba(147,239,189,.26);
      border-radius:999px;
      background:rgba(147,239,189,.06);
      color:#c9ffdf;
      font-size:.62rem;
      font-weight:900;
      letter-spacing:.12em;
      text-transform:uppercase;
    }

    [data-page="assets"] [data-assets-instrument="active"] {
      position:relative;
    }

    [data-page="assets"] [data-assets-instrument="active"]::after {
      content:"";
      position:absolute;
      right:12px;
      top:12px;
      width:8px;
      height:8px;
      border-radius:50%;
      background:#93efbd;
      box-shadow:0 0 16px rgba(147,239,189,.55);
      opacity:.86;
      pointer-events:none;
    }

    [data-page="assets"] [data-assets-contract="consumption"] code {
      border-color:rgba(239,210,154,.20);
    }

    [data-page="assets"] .assets-runtime-strip {
      display:grid;
      gap:8px;
      padding:14px;
      border:1px solid rgba(142,197,255,.18);
      border-radius:18px;
      background:rgba(255,255,255,.035);
      color:#dfe8ff;
    }

    [data-page="assets"] .assets-runtime-strip code {
      white-space:pre-wrap;
      word-break:break-word;
      color:#dfe8ff;
      font-size:.80rem;
      line-height:1.55;
    }

    [data-page="assets"] .route-card,
    [data-page="assets"] .nav a {
      transform-style:preserve-3d;
    }

    @media (prefers-reduced-motion:reduce) {
      [data-page="assets"] *,
      [data-page="assets"] *::before,
      [data-page="assets"] *::after {
        animation:none !important;
        transition:none !important;
      }
    }
  `;

  function getRoot() {
    return document.querySelector('[data-page="assets"]');
  }

  function installRuntimeStyle() {
    let style = document.getElementById(STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    style.textContent = runtimeCSS;
  }

  function ensureScriptLoaded(src) {
    return Boolean(document.querySelector(`script[src="${src}"]`));
  }

  function ensureStylesheetLoaded(href) {
    return Boolean(document.querySelector(`link[rel="stylesheet"][href="${href}"]`));
  }

  function markPanels() {
    document.querySelectorAll(PANEL_SELECTOR).forEach((panel, index) => {
      panel.dataset.assetsPanel = "active";
      panel.dataset.assetsPanelIndex = String(index + 1);
    });
  }

  function markCards() {
    document.querySelectorAll(CARD_SELECTOR).forEach((card, index) => {
      card.dataset.assetsInstrument = "active";
      card.dataset.assetsInstrumentIndex = String(index + 1);

      if (card.matches(".contract-card")) {
        card.dataset.assetsContract = "consumption";
      }

      if (card.matches(".route-card")) {
        card.dataset.assetsRouteControl = "diamond";
      }
    });
  }

  function ensureRuntimeBadge() {
    const root = getRoot();
    const heroCopy = root?.querySelector(".hero-copy");

    if (!heroCopy || heroCopy.querySelector("[data-assets-runtime-badge]")) return;

    const badge = document.createElement("span");
    badge.dataset.assetsRuntimeBadge = "active";
    badge.textContent = "Assets runtime active";

    const firstPill = heroCopy.querySelector(".pill");
    if (firstPill) {
      firstPill.after(badge);
    } else {
      heroCopy.prepend(badge);
    }
  }

  function ensureRuntimeStrip() {
    const root = getRoot();
    if (!root) return;

    let strip = root.querySelector(".assets-runtime-strip");

    if (!strip) {
      const receiptPanel = root.querySelector('[aria-labelledby="receiptTitle"]');
      strip = document.createElement("div");
      strip.className = "assets-runtime-strip";
      strip.innerHTML = "<code></code>";

      if (receiptPanel) {
        receiptPanel.append(strip);
      } else {
        root.append(strip);
      }
    }

    const code = strip.querySelector("code");
    if (!code) return;

    code.textContent = [
      "ASSETS_BRANCH_RUNTIME=ACTIVE",
      `GENERATION=${STATE.generation}`,
      `CSS_AUTHORITY=${STATE.cssAuthority}`,
      `CSS_LOADED=${ensureStylesheetLoaded(STATE.cssAuthority) ? "TRUE" : "UNKNOWN_OR_INLINE"}`,
      `UNIVERSE_RUNTIME=${STATE.universeAuthority}`,
      `UNIVERSE_RUNTIME_LOADED=${ensureScriptLoaded(STATE.universeAuthority) ? "TRUE" : "UNKNOWN_OR_DEFERRED"}`,
      "GLOBE_CONTRACT=data-dgb-globe",
      "DIAMOND_CONTRACT=.route-card + shared UI CSS",
      "LOCAL_REBUILD_RULE=CONSUME_SHARED_ASSETS_FIRST",
      "GRAPHICS_BOX=FORBIDDEN_UNLESS_EXPLICITLY_REQUESTED"
    ].join("\n");
  }

  function writeReceipt() {
    let receipt = document.getElementById(RECEIPT_ID);

    if (!receipt) {
      receipt = document.createElement("script");
      receipt.id = RECEIPT_ID;
      receipt.type = "application/json";
      document.body.append(receipt);
    }

    const globeCount = document.querySelectorAll('[data-page="assets"] [data-dgb-globe="earth"]').length;
    const routeCardCount = document.querySelectorAll('[data-page="assets"] .route-card').length;
    const contractCardCount = document.querySelectorAll('[data-page="assets"] .contract-card').length;
    const instrumentCardCount = document.querySelectorAll('[data-page="assets"] .instrument-card').length;

    receipt.textContent = JSON.stringify(
      {
        ASSETS_BRANCH_STATUS: "GENERATION_2_ACTIVE",
        PAGE: STATE.page,
        GENERATION: STATE.generation,
        RUNTIME: STATE.runtime,
        CSS_AUTHORITY: STATE.cssAuthority,
        UNIVERSE_AUTHORITY: STATE.universeAuthority,
        CSS_AUTHORITY_LOADED: ensureStylesheetLoaded(STATE.cssAuthority),
        UNIVERSE_AUTHORITY_LOADED: ensureScriptLoaded(STATE.universeAuthority),
        GLOBE_CONTRACT: "data-dgb-globe=earth",
        GLOBE_COUNT: globeCount,
        ROUTE_CARD_COUNT: routeCardCount,
        CONTRACT_CARD_COUNT: contractCardCount,
        INSTRUMENT_CARD_COUNT: instrumentCardCount,
        DIAMOND_CONTROLS: "SHARED_ASSET_LAYER",
        LOCAL_REBUILD_RULE: "CONSUME_SHARED_ASSETS_FIRST",
        GRAPHICS_BOX: "FORBIDDEN_UNLESS_EXPLICITLY_REQUESTED",
        UPDATED_AT: new Date().toISOString()
      },
      null,
      2
    );
  }

  function markPageState() {
    const root = getRoot();
    if (!root) return;

    root.dataset.assetsBranchRuntime = "active";
    root.dataset.assetsCssAuthority = STATE.cssAuthority;
    root.dataset.assetsUniverseAuthority = STATE.universeAuthority;
    root.dataset.assetsGeneration = STATE.generation;

    document.documentElement.dataset.assetsBranchRuntime = "active";
    document.documentElement.dataset.assetsGeneration = STATE.generation;
  }

  function mount() {
    installRuntimeStyle();
    markPanels();
    markCards();
    ensureRuntimeBadge();
    ensureRuntimeStrip();
    writeReceipt();
    markPageState();

    STATE.mounted = true;
  }

  function observe() {
    const root = getRoot();
    if (!root) return;

    const observer = new MutationObserver(() => {
      markPanels();
      markCards();
      ensureRuntimeBadge();
      ensureRuntimeStrip();
      writeReceipt();
      markPageState();
    });

    observer.observe(root, {
      childList:true,
      subtree:true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        mount();
        observe();
      },
      { once:true }
    );
  } else {
    mount();
    observe();
  }
})();
