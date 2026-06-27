/* ==========================================================================
   /products/archcoin/index.controller.js

   ARCHCOIN
   TRANSACTION ORBIT CONTROLLER
   PRODUCT-LOCAL STATE AUTHORITY

   Contract:
   - Own durable page state for the anchored ARCHCOIN HTML.
   - Keep four-coin orbit focus distinct from selected information node.
   - Open a per-coin information cluster without requiring HTML renewal.
   - Support semantic fallback controls even before the motion runtime loads.
   - Expose bounded request APIs for the later geometry/runtime layer.
   - Preserve non-financial-offer posture and fail-soft behavior.

   Owns:
   - orbit state
   - focused coin
   - selected coin
   - selected information node
   - return-to-orbit behavior
   - semantic fallback cluster controls
   - controller receipts

   Does not own:
   - specialized geometry rendering
   - per-frame motion
   - drag/flick sampling
   - canvas/WebGL drawing
   - remote data authority
   - legal/financial authority
========================================================================== */

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "ARCHCOIN_TRANSACTION_ORBIT_CONTROLLER_REBUILD_v1",
    previousId: "ARCHCOIN_TRANSACTION_TEMPLATE_AND_BOND_LAYER_REBUILD_v2_HTML_ANCHOR",
    file: "/products/archcoin/index.controller.js",
    releaseId: "archcoin-transaction-orbit-controller-v1",
    visualPassClaimed: false,
    productionAuthorized: false,
    deploymentAuthorized: false
  });

  const STATES = Object.freeze({
    ORBIT: "ARCHCOIN_TRANSACTION_ORBIT",
    CLUSTER_OPEN: "FOUR_COIN_POSITION_SELECTED",
    NODE_SELECTED: "TRANSACTION_LAYER_DESCENDED",
    RETURNING: "RETURNING_TO_TRANSACTION_ORBIT",
    HELD: "HELD"
  });

  const COINS = Object.freeze(["contract", "receivable", "payable", "allocation"]);

  const NODE_TYPES = Object.freeze({
    ENGINEERING: "engineering",
    PLATFORM: "platform",
    ACCOUNTABILITY: "accountability",
    GUARDRAILS: "guardrails"
  });

  const RECEIPT = {
    contractId: CONTRACT.id,
    previousContractId: CONTRACT.previousId,
    status: "pending",
    state: STATES.ORBIT,
    orbitFocus: "contract",
    selectedCoinPosition: "",
    selectedNodeId: "",
    selectedNodeType: "",
    selectedSectionId: "",
    panelDescended: false,
    lifecycleVisible: true,
    runtimePresent: false,
    lastAction: "",
    lastFailure: null,
    visualPassClaimed: false
  };

  const COIN_CONFIG = Object.freeze({
    contract: Object.freeze({
      id: "contract",
      label: "Contract",
      short: "Authority binds movement",
      panelTitle: "Contract Authority",
      panelBody:
        "This position governs permissions, signatures, scope, terms, and the authorization frame that allows value to move inside a readable transaction structure.",
      sectionId: "four-coins-title",
      nodes: Object.freeze([
        Object.freeze({
          id: "contract-engineering",
          type: NODE_TYPES.ENGINEERING,
          label: "Engineering",
          title: "Contract authority as system entry logic.",
          body:
            "The contract position is the first gate. It defines which movement is authorized, who can initiate it, and what rule frame governs the rest of the transaction orbit.",
          sectionId: "four-coins-title"
        }),
        Object.freeze({
          id: "contract-platform",
          type: NODE_TYPES.PLATFORM,
          label: "Platform",
          title: "Contract becomes the transaction frame.",
          body:
            "In platform terms, this position acts like the declared ruleset for the movement. It is not the value itself. It is the permissioned frame that makes downstream movement interpretable.",
          sectionId: "transaction-orbit"
        }),
        Object.freeze({
          id: "contract-accountability",
          type: NODE_TYPES.ACCOUNTABILITY,
          label: "Accountability",
          title: "Authority must stay inspectable.",
          body:
            "If the contract frame is vague, the rest of the transaction becomes vague. Accountability begins by making authority readable before value, obligation, and allocation claims spread outward.",
          sectionId: "interoperability-title"
        }),
        Object.freeze({
          id: "contract-guardrails",
          type: NODE_TYPES.GUARDRAILS,
          label: "Guardrails",
          title: "Authority is not automatic legal finality.",
          body:
            "This page can describe authority structure, but it does not itself create legal enforceability, custody, settlement finality, or live financial execution.",
          sectionId: "guardrails"
        })
      ])
    }),

    receivable: Object.freeze({
      id: "receivable",
      label: "Receivable",
      short: "Inbound value arrives",
      panelTitle: "Inbound Value / Receivable",
      panelBody:
        "This position names what entered, from where, for what purpose, and through which route. Inbound value must be visible before larger system claims are trusted.",
      sectionId: "four-coins-title",
      nodes: Object.freeze([
        Object.freeze({
          id: "receivable-engineering",
          type: NODE_TYPES.ENGINEERING,
          label: "Engineering",
          title: "Inbound value needs a named arrival surface.",
          body:
            "A receivable is not just 'money showed up.' It is a declared arrival event: source, amount class, route, timing, and intended support all need a readable frame.",
          sectionId: "four-coins-title"
        }),
        Object.freeze({
          id: "receivable-platform",
          type: NODE_TYPES.PLATFORM,
          label: "Platform",
          title: "Receivable creates the inbound ledger edge.",
          body:
            "Inside the ARCHCOIN template, receivable is the inbound side of the bond map. It identifies the incoming side of the transaction before obligation and allocation are interpreted.",
          sectionId: "value-lifecycle"
        }),
        Object.freeze({
          id: "receivable-accountability",
          type: NODE_TYPES.ACCOUNTABILITY,
          label: "Accountability",
          title: "Inbound movement should be checkable.",
          body:
            "The receivable position increases trust when the source and purpose of incoming value can be checked rather than inferred from hype or vague public claims.",
          sectionId: "use-cases-title"
        }),
        Object.freeze({
          id: "receivable-guardrails",
          type: NODE_TYPES.GUARDRAILS,
          label: "Guardrails",
          title: "Receivable visibility is not a live custody claim.",
          body:
            "Making inbound value visible does not mean this page controls a wallet, exchange, bridge, or custody layer. Visibility is not execution authority.",
          sectionId: "guardrails"
        })
      ])
    }),

    payable: Object.freeze({
      id: "payable",
      label: "Payable",
      short: "Obligation must settle",
      panelTitle: "Outbound Obligation / Payable",
      panelBody:
        "Every transaction carries responsibility. The payable position names the pressure owed, what must be settled, and where outbound duty remains active.",
      sectionId: "four-coins-title",
      nodes: Object.freeze([
        Object.freeze({
          id: "payable-engineering",
          type: NODE_TYPES.ENGINEERING,
          label: "Engineering",
          title: "Outbound duty belongs in the architecture.",
          body:
            "A system that tracks inflow but hides obligation is incomplete. Payable keeps settlement pressure visible so the transaction can be read as a whole instead of as one optimistic half.",
          sectionId: "four-coins-title"
        }),
        Object.freeze({
          id: "payable-platform",
          type: NODE_TYPES.PLATFORM,
          label: "Platform",
          title: "Payable names what the system owes outward.",
          body:
            "In platform terms, payable is the outbound commitment surface. It is where duty, settlement, and responsibility stay attached to the movement rather than being left outside the model.",
          sectionId: "transaction-orbit"
        }),
        Object.freeze({
          id: "payable-accountability",
          type: NODE_TYPES.ACCOUNTABILITY,
          label: "Accountability",
          title: "Responsibility is part of trust.",
          body:
            "Trust does not come only from recording what came in. It also comes from naming what is owed, what pressure remains, and what must still be settled inside the bond frame.",
          sectionId: "interoperability-title"
        }),
        Object.freeze({
          id: "payable-guardrails",
          type: NODE_TYPES.GUARDRAILS,
          label: "Guardrails",
          title: "Obligation visibility is not settlement execution.",
          body:
            "This controller can describe payable logic, but it does not execute settlement, guarantee finality, or claim operational control over a live financial payment network.",
          sectionId: "guardrails"
        })
      ])
    }),

    allocation: Object.freeze({
      id: "allocation",
      label: "Allocation",
      short: "Growth stays governed",
      panelTitle: "Allocation / Growth",
      panelBody:
        "Allocation governs distribution, reinvestment, expansion pressure, and growth movement without pretending that value can expand safely outside a declared bond frame.",
      sectionId: "four-coins-title",
      nodes: Object.freeze([
        Object.freeze({
          id: "allocation-engineering",
          type: NODE_TYPES.ENGINEERING,
          label: "Engineering",
          title: "Allocation is the governed expansion path.",
          body:
            "This position prevents growth language from floating free of transaction structure. It names where value is directed, what rule set governs that direction, and how expansion stays bounded.",
          sectionId: "four-coins-title"
        }),
        Object.freeze({
          id: "allocation-platform",
          type: NODE_TYPES.PLATFORM,
          label: "Platform",
          title: "Allocation is not an afterthought bucket.",
          body:
            "Inside the ARCHCOIN model, allocation is a primary coin position. It belongs in the transaction template from the beginning, not as an informal decision after value already moved.",
          sectionId: "adapter-layer"
        }),
        Object.freeze({
          id: "allocation-accountability",
          type: NODE_TYPES.ACCOUNTABILITY,
          label: "Accountability",
          title: "Growth should remain readable.",
          body:
            "Allocation becomes more trustworthy when downstream distribution, reinvestment, or expansion pressure can be inspected as part of the same bond-layer transaction model.",
          sectionId: "use-cases-title"
        }),
        Object.freeze({
          id: "allocation-guardrails",
          type: NODE_TYPES.GUARDRAILS,
          label: "Guardrails",
          title: "Allocation framing is not a profit promise.",
          body:
            "Naming allocation or growth does not promise yield, return, appreciation, tradability, or live investment performance. Growth structure is not a financial promise.",
          sectionId: "guardrails"
        })
      ])
    })
  });

  const state = {
    root: null,
    orbitStage: null,
    geometryMount: null,
    receiptOutput: null,
    coinButtons: [],
    lifecycleNodes: [],
    adapterCards: [],
    generatedPanel: null,
    generatedEyebrow: null,
    generatedTitle: null,
    generatedBody: null,
    generatedNodeBar: null,
    generatedNodeDetails: null,
    generatedReturnButton: null,
    generatedScrollButton: null,

    current: STATES.ORBIT,
    orbitFocus: "contract",
    selectedCoinPosition: "",
    selectedNodeId: "",
    panelDescended: false,
    lifecycleVisible: true,
    initialized: false
  };

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function normalizeCoin(value) {
    const coin = String(value || "").trim().toLowerCase();
    return COINS.includes(coin) ? coin : "";
  }

  function findCoinConfig(coin) {
    const normalized = normalizeCoin(coin);
    return normalized ? COIN_CONFIG[normalized] || null : null;
  }

  function findNodeById(coin, nodeId) {
    const config = findCoinConfig(coin);
    if (!config) return null;
    return config.nodes.find((node) => node.id === String(nodeId || "").trim()) || null;
  }

  function emitReceipt(extra = {}) {
    const runtimePresent = Boolean(globalThis.ARCHCOIN_ORBIT_RUNTIME);
    const selectedNode = findNodeById(state.selectedCoinPosition, state.selectedNodeId);

    Object.assign(
      RECEIPT,
      {
        status: state.current === STATES.HELD ? "held" : "available",
        state: state.current,
        orbitFocus: state.orbitFocus,
        selectedCoinPosition: state.selectedCoinPosition,
        selectedNodeId: state.selectedNodeId,
        selectedNodeType: selectedNode ? selectedNode.type : "",
        selectedSectionId: selectedNode ? selectedNode.sectionId : "",
        panelDescended: state.panelDescended,
        lifecycleVisible: state.lifecycleVisible,
        runtimePresent,
        visualPassClaimed: false
      },
      extra
    );

    const serialized = JSON.stringify(RECEIPT);

    if (state.root) {
      state.root.dataset.archcoinControllerReceipt = serialized;
      state.root.dataset.archcoinControllerStatus = RECEIPT.status;
      state.root.dataset.archcoinState = state.current;
      state.root.dataset.archcoinOrbitFocus = state.orbitFocus;
      state.root.dataset.archcoinSelectedCoinPosition = state.selectedCoinPosition;
      state.root.dataset.archcoinSelectedNodeId = state.selectedNodeId;
      state.root.dataset.archcoinPanelDescended = state.panelDescended ? "true" : "false";
      state.root.dataset.visualPassClaimed = "false";
    }

    if (state.receiptOutput) {
      state.receiptOutput.value = serialized;
      state.receiptOutput.textContent = serialized;
      state.receiptOutput.dataset.visualPassClaimed = "false";
    }

    globalThis.ARCHCOIN_ORBIT_CONTROLLER_RECEIPT = Object.freeze({
      ...RECEIPT
    });
  }

  function setState(nextState, action) {
    state.current = nextState;
    syncPresentation();
    emitReceipt({
      lastAction: action || `state:${nextState}`,
      lastFailure: null
    });
    return true;
  }

  function createGeneratedPanel() {
    const panel = document.createElement("section");
    panel.className = "panel section";
    panel.id = "archcoin-controller-panel";
    panel.setAttribute("aria-labelledby", "archcoin-controller-title");
    panel.dataset.archcoinControllerPanel = "true";

    panel.innerHTML = `
      <div class="kicker">Transaction orbit controller</div>
      <h2 id="archcoin-controller-title">Select a coin to inspect its information cluster.</h2>
      <div class="transaction-summary" data-archcoin-controller-summary="true">
        <strong data-archcoin-controller-eyebrow="true">ARCHCOIN Orbit</strong>
        <p data-archcoin-controller-body="true">
          The four outer positions behave as the primary transaction orbit. Selecting a coin opens its information cluster. Selecting a cluster item takes you to the relevant page section. Return to Orbit closes the descended state.
        </p>
      </div>
      <div class="actions" data-archcoin-controller-nodebar="true"></div>
      <div class="card" data-archcoin-controller-details="true" aria-live="polite">
        <b>Cluster node</b>
        <strong data-archcoin-controller-node-title="true">No node selected yet.</strong>
        <span data-archcoin-controller-node-body="true">
          Choose a node after opening a coin cluster.
        </span>
      </div>
      <div class="actions">
        <button class="button gold" type="button" data-archcoin-return-orbit="true" hidden>Return to Orbit</button>
        <button class="button" type="button" data-archcoin-scroll-target="true" hidden>Open related section</button>
      </div>
    `;

    const transactionSection = qs("#transaction-orbit", state.root);
    if (!transactionSection || !transactionSection.parentNode) {
      throw new Error("ARCHCOIN_TRANSACTION_SECTION_NOT_FOUND");
    }

    transactionSection.insertAdjacentElement("afterend", panel);

    state.generatedPanel = panel;
    state.generatedEyebrow = qs("[data-archcoin-controller-eyebrow]", panel);
    state.generatedTitle = qs("#archcoin-controller-title", panel);
    state.generatedBody = qs("[data-archcoin-controller-body]", panel);
    state.generatedNodeBar = qs("[data-archcoin-controller-nodebar]", panel);
    state.generatedNodeDetails = {
      title: qs("[data-archcoin-controller-node-title]", panel),
      body: qs("[data-archcoin-controller-node-body]", panel)
    };
    state.generatedReturnButton = qs("[data-archcoin-return-orbit]", panel);
    state.generatedScrollButton = qs("[data-archcoin-scroll-target]", panel);
  }

  function scrollToSection(sectionId) {
    const target =
      qs(`#${CSS.escape(sectionId)}`, state.root) ||
      qs(`#${CSS.escape(sectionId)}`, document);

    if (!target) return false;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
      inline: "nearest"
    });

    return true;
  }

  function clearNodeBar() {
    if (!state.generatedNodeBar) return;
    state.generatedNodeBar.replaceChildren();
  }

  function rebuildNodeBar(coin) {
    clearNodeBar();

    const config = findCoinConfig(coin);
    if (!config || !state.generatedNodeBar) return;

    config.nodes.forEach((node) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button";
      button.dataset.archcoinClusterNode = node.id;
      button.dataset.archcoinClusterCoin = config.id;
      button.textContent = node.label;
      button.setAttribute("aria-pressed", node.id === state.selectedNodeId ? "true" : "false");
      state.generatedNodeBar.appendChild(button);
    });
  }

  function updateControllerPanelForOrbit() {
    if (!state.generatedPanel) return;

    if (state.generatedTitle) {
      state.generatedTitle.textContent = "Select a coin to inspect its information cluster.";
    }

    if (state.generatedEyebrow) {
      state.generatedEyebrow.textContent = "ARCHCOIN Orbit";
    }

    if (state.generatedBody) {
      state.generatedBody.textContent =
        "The four outer positions behave as the primary transaction orbit. Selecting a coin opens its information cluster. Selecting a cluster item takes you to the relevant page section. Return to Orbit closes the descended state.";
    }

    if (state.generatedNodeDetails.title) {
      state.generatedNodeDetails.title.textContent = "No node selected yet.";
    }

    if (state.generatedNodeDetails.body) {
      state.generatedNodeDetails.body.textContent =
        "Choose a coin first, then inspect one of its cluster nodes.";
    }

    clearNodeBar();

    if (state.generatedReturnButton) {
      state.generatedReturnButton.hidden = true;
      state.generatedReturnButton.disabled = true;
    }

    if (state.generatedScrollButton) {
      state.generatedScrollButton.hidden = true;
      state.generatedScrollButton.disabled = true;
      delete state.generatedScrollButton.dataset.sectionId;
    }
  }

  function updateControllerPanelForCoin(coin) {
    const config = findCoinConfig(coin);
    if (!config || !state.generatedPanel) return;

    if (state.generatedTitle) {
      state.generatedTitle.textContent = `${config.panelTitle} cluster is open.`;
    }

    if (state.generatedEyebrow) {
      state.generatedEyebrow.textContent = config.label;
    }

    if (state.generatedBody) {
      state.generatedBody.textContent = config.panelBody;
    }

    if (state.generatedNodeDetails.title) {
      state.generatedNodeDetails.title.textContent = `${config.label} cluster`;
    }

    if (state.generatedNodeDetails.body) {
      state.generatedNodeDetails.body.textContent =
        "Select one of the cluster nodes below to descend into the related information surface on this page.";
    }

    rebuildNodeBar(coin);

    if (state.generatedReturnButton) {
      state.generatedReturnButton.hidden = false;
      state.generatedReturnButton.disabled = false;
    }

    if (state.generatedScrollButton) {
      state.generatedScrollButton.hidden = false;
      state.generatedScrollButton.disabled = false;
      state.generatedScrollButton.textContent = "Open related section";
      state.generatedScrollButton.dataset.sectionId = config.sectionId;
    }
  }

  function updateControllerPanelForNode(coin, nodeId) {
    const config = findCoinConfig(coin);
    const node = findNodeById(coin, nodeId);

    if (!config || !node || !state.generatedPanel) return;

    if (state.generatedTitle) {
      state.generatedTitle.textContent = `${config.panelTitle} · ${node.label}`;
    }

    if (state.generatedEyebrow) {
      state.generatedEyebrow.textContent = `${config.label} · ${node.label}`;
    }

    if (state.generatedBody) {
      state.generatedBody.textContent = config.panelBody;
    }

    if (state.generatedNodeDetails.title) {
      state.generatedNodeDetails.title.textContent = node.title;
    }

    if (state.generatedNodeDetails.body) {
      state.generatedNodeDetails.body.textContent = node.body;
    }

    rebuildNodeBar(coin);

    qsa("[data-archcoin-cluster-node]", state.generatedPanel).forEach((button) => {
      const selected = button.dataset.archcoinClusterNode === node.id;
      button.setAttribute("aria-pressed", selected ? "true" : "false");
      button.classList.toggle("green", selected);
    });

    if (state.generatedReturnButton) {
      state.generatedReturnButton.hidden = false;
      state.generatedReturnButton.disabled = false;
    }

    if (state.generatedScrollButton) {
      state.generatedScrollButton.hidden = false;
      state.generatedScrollButton.disabled = false;
      state.generatedScrollButton.textContent = "Open related section";
      state.generatedScrollButton.dataset.sectionId = node.sectionId;
    }
  }

  function syncCoinButtons() {
    state.coinButtons.forEach((button) => {
      const coin = normalizeCoin(button.dataset.archcoinCoinPosition);
      const focused = coin === state.orbitFocus;
      const selected = coin === state.selectedCoinPosition;

      button.dataset.archcoinFocused = focused ? "true" : "false";
      button.dataset.archcoinSelected = selected ? "true" : "false";
      button.setAttribute("aria-pressed", selected ? "true" : "false");

      if (focused || selected) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  function syncLifecycleNodes() {
    const visible = state.lifecycleVisible ? "true" : "false";
    state.lifecycleNodes.forEach((node) => {
      node.dataset.archcoinLifecycleVisible = visible;
      node.style.opacity = state.lifecycleVisible ? "" : "0.4";
    });
  }

  function syncAdapterCards() {
    state.adapterCards.forEach((card) => {
      card.dataset.archcoinOrbitState = state.current;
      card.dataset.archcoinSelectedCoinPosition = state.selectedCoinPosition;
    });
  }

  function syncPresentation() {
    syncCoinButtons();
    syncLifecycleNodes();
    syncAdapterCards();

    if (state.current === STATES.ORBIT) {
      updateControllerPanelForOrbit();
      return;
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      updateControllerPanelForCoin(state.selectedCoinPosition);
      return;
    }

    if (state.current === STATES.NODE_SELECTED) {
      updateControllerPanelForNode(state.selectedCoinPosition, state.selectedNodeId);
      return;
    }

    if (state.current === STATES.RETURNING) {
      updateControllerPanelForOrbit();
      return;
    }

    if (state.current === STATES.HELD && state.generatedTitle) {
      state.generatedTitle.textContent = "ARCHCOIN controller is held.";
      if (state.generatedBody) {
        state.generatedBody.textContent =
          "The page remains readable, but one controller subsystem is temporarily unavailable.";
      }
    }
  }

  function requestCoinFocus(coin, options = {}) {
    const config = findCoinConfig(coin);
    if (!config) {
      emitReceipt({
        lastAction: "coin-focus-rejected",
        lastFailure: `INVALID_COIN:${String(coin || "")}`
      });
      return false;
    }

    state.orbitFocus = config.id;

    if (options.commit !== false) {
      syncPresentation();
      emitReceipt({
        lastAction: `coin-focused:${config.id}`,
        lastFailure: null
      });
    }

    return true;
  }

  function requestCoinSelection(coin, options = {}) {
    const config = findCoinConfig(coin);
    if (!config) {
      emitReceipt({
        lastAction: "coin-selection-rejected",
        lastFailure: `INVALID_COIN:${String(coin || "")}`
      });
      return false;
    }

    state.orbitFocus = config.id;
    state.selectedCoinPosition = config.id;
    state.selectedNodeId = "";
    state.panelDescended = false;
    state.lifecycleVisible = true;

    const committed = setState(STATES.CLUSTER_OPEN, `coin-selected:${config.id}`);
    if (!committed) return false;

    if (options.scrollToPanel !== false && state.generatedPanel) {
      state.generatedPanel.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    return true;
  }

  function requestNodeSelection(coin, nodeId, options = {}) {
    const config = findCoinConfig(coin);
    const node = findNodeById(coin, nodeId);

    if (!config || !node) {
      emitReceipt({
        lastAction: "node-selection-rejected",
        lastFailure: `INVALID_NODE:${String(nodeId || "")}`
      });
      return false;
    }

    state.orbitFocus = config.id;
    state.selectedCoinPosition = config.id;
    state.selectedNodeId = node.id;
    state.panelDescended = true;
    state.lifecycleVisible = true;

    const committed = setState(STATES.NODE_SELECTED, `node-selected:${node.id}`);
    if (!committed) return false;

    if (options.scrollToSection !== false) {
      scrollToSection(node.sectionId);
    }

    return true;
  }

  function requestReturnToOrbit(options = {}) {
    const fallbackCoin = state.selectedCoinPosition || state.orbitFocus || "contract";

    state.current = STATES.RETURNING;
    state.selectedNodeId = "";
    state.selectedCoinPosition = "";
    state.panelDescended = false;
    state.lifecycleVisible = true;
    state.orbitFocus = normalizeCoin(fallbackCoin) || "contract";

    syncPresentation();

    emitReceipt({
      lastAction: `returned-to-orbit:${state.orbitFocus}`,
      lastFailure: null
    });

    state.current = STATES.ORBIT;
    syncPresentation();

    if (options.scrollToOrbit !== false && state.orbitStage) {
      state.orbitStage.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    emitReceipt({
      lastAction: `orbit-restored:${state.orbitFocus}`,
      lastFailure: null
    });

    return true;
  }

  function requestOpenCurrentSection() {
    if (state.current === STATES.NODE_SELECTED) {
      const node = findNodeById(state.selectedCoinPosition, state.selectedNodeId);
      if (!node) return false;
      return scrollToSection(node.sectionId);
    }

    if (state.current === STATES.CLUSTER_OPEN) {
      const config = findCoinConfig(state.selectedCoinPosition);
      if (!config) return false;
      return scrollToSection(config.sectionId);
    }

    return false;
  }

  function buildSemanticFallbackControls() {
    if (!state.generatedPanel) return;

    state.generatedNodeBar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-archcoin-cluster-node]");
      if (!button) return;

      const coin = button.dataset.archcoinClusterCoin;
      const nodeId = button.dataset.archcoinClusterNode;
      requestNodeSelection(coin, nodeId, { scrollToSection: true });
    });

    if (state.generatedReturnButton) {
      state.generatedReturnButton.addEventListener("click", () => {
        requestReturnToOrbit({ scrollToOrbit: true });
      });
    }

    if (state.generatedScrollButton) {
      state.generatedScrollButton.addEventListener("click", () => {
        requestOpenCurrentSection();
      });
    }
  }

  function bindCoinButtons() {
    state.coinButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const coin = button.dataset.archcoinCoinPosition;
        requestCoinSelection(coin, { scrollToPanel: true });
      });
    });
  }

  function bindFallbackLinks() {
    const transactionButton = qsa(".actions a.button", state.root).find(
      (link) => link.getAttribute("href") === "#transaction-orbit"
    );

    if (transactionButton) {
      transactionButton.addEventListener("click", () => {
        requestReturnToOrbit({ scrollToOrbit: true });
      });
    }
  }

  function getFrameState() {
    const selectedNode = findNodeById(state.selectedCoinPosition, state.selectedNodeId);

    return Object.freeze({
      state: state.current,
      orbitFocus: state.orbitFocus,
      selectedCoinPosition: state.selectedCoinPosition,
      selectedNodeId: state.selectedNodeId,
      selectedNodeType: selectedNode ? selectedNode.type : "",
      selectedSectionId: selectedNode ? selectedNode.sectionId : "",
      panelDescended: state.panelDescended,
      lifecycleVisible: state.lifecycleVisible
    });
  }

  function resolveDom() {
    state.root = qs("[data-archcoin-product='true']");
    if (!state.root) {
      throw new Error("ARCHCOIN_ROOT_NOT_FOUND");
    }

    state.orbitStage = qs("#archcoin-orbit-stage", state.root);
    if (!state.orbitStage) {
      throw new Error("ARCHCOIN_ORBIT_STAGE_NOT_FOUND");
    }

    state.geometryMount = qs("#archcoin-geometry-mount", state.root);
    if (!state.geometryMount) {
      throw new Error("ARCHCOIN_GEOMETRY_MOUNT_NOT_FOUND");
    }

    state.receiptOutput = qs("#archcoin-receipt-output", state.root);
    if (!state.receiptOutput) {
      throw new Error("ARCHCOIN_RECEIPT_OUTPUT_NOT_FOUND");
    }

    state.coinButtons = qsa("[data-archcoin-coin-position]", state.root).filter(
      (button) => normalizeCoin(button.dataset.archcoinCoinPosition)
    );

    if (state.coinButtons.length !== 4) {
      throw new Error(`ARCHCOIN_PRIMARY_COIN_COUNT_INVALID:${state.coinButtons.length}`);
    }

    state.lifecycleNodes = qsa("[data-archcoin-value-lifecycle-node]", state.root);
    state.adapterCards = qsa("[data-archcoin-adapter-slot]", state.root);
  }

  function exposeApi() {
    globalThis.ARCHCOIN_ORBIT_CONTROLLER = Object.freeze({
      contract: CONTRACT,
      states: STATES,
      receipt: () =>
        Object.freeze({
          ...RECEIPT
        }),
      getFrameState,
      requestCoinFocus,
      requestCoinSelection,
      requestNodeSelection,
      requestReturnToOrbit,
      requestOpenCurrentSection
    });
  }

  function init() {
    try {
      resolveDom();
      createGeneratedPanel();
      bindCoinButtons();
      buildSemanticFallbackControls();
      bindFallbackLinks();
      exposeApi();

      state.current = STATES.ORBIT;
      state.orbitFocus = "contract";
      state.selectedCoinPosition = "";
      state.selectedNodeId = "";
      state.panelDescended = false;
      state.lifecycleVisible = true;
      state.initialized = true;

      syncPresentation();

      emitReceipt({
        status: "available",
        lastAction: "archcoin-controller-initialized",
        lastFailure: null
      });
    } catch (error) {
      state.current = STATES.HELD;
      syncPresentation();
      emitReceipt({
        status: "held",
        lastAction: "archcoin-controller-init-failed",
        lastFailure: error && error.message ? error.message : String(error)
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
