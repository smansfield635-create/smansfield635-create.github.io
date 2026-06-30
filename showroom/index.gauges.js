/* TARGET FILE: /showroom/index.gauges.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v3 */

(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v3",
    version: "3.0.0",
    scope: "/showroom/",
    ownership: Object.freeze({
      owns: Object.freeze([
        "gauge selection",
        "gauge detail visibility",
        "information tab selection",
        "information panel visibility",
        "supporting-front presentation",
        "gauge accessibility state",
        "gauge receipts"
      ]),
      excludes: Object.freeze([
        "constellation rendering",
        "constellation navigation decisions",
        "Compass navigation",
        "Diamond rendering",
        "Diamond camera",
        "Diamond interaction",
        "Window rendering",
        "secondary-object rendering",
        "stage visibility"
      ])
    })
  });

  const SELECTORS = Object.freeze({
    root: "[data-showroom-root]",
    dashboard: "[data-showroom-gauge-dashboard]",
    gauge: "[data-showroom-gauge]",
    detail: "[data-showroom-gauge-detail]",
    detailHost: "[data-showroom-gauge-details]",
    informationTabs: "[data-showroom-information-tabs]",
    informationTablist: "[data-showroom-information-tablist]",
    informationTab: "[data-showroom-information-tab]",
    informationPanel: "[data-showroom-information-panel]",
    frontHost: "[data-showroom-front-host]",
    front: "[data-showroom-front]",
    receipt: "[data-showroom-gauges-receipt]",
    validation: "[data-showroom-controller-validation]",
    windowThreshold: "[data-showroom-window-state]",
    windowGauge: '[data-gauge-id="window-state"]'
  });

  const STAGE_IDS = Object.freeze([
    "showroom-orbit",
    "showroom-diamond-reveal",
    "showroom-secondary-object"
  ]);

  const state = {
    initialized: false,
    dashboards: new Map(),
    informationGroups: new Map(),
    activeFrontId: "",
    mutationObserver: null,
    rootObserver: null,
    receiptSequence: 0
  };

  function query(selector, context = document) {
    return context.querySelector(selector);
  }

  function queryAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  function normalize(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function escapeIdentifier(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }

    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function setHidden(element, hidden) {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    element.hidden = Boolean(hidden);
    element.setAttribute("aria-hidden", hidden ? "true" : "false");
  }

  function setPressed(element, active) {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    element.setAttribute("aria-expanded", active ? "true" : "false");

    if (active) {
      element.setAttribute("data-active", "");
    } else {
      element.removeAttribute("data-active");
    }
  }

  function getRoot() {
    return query(SELECTORS.root);
  }

  function getReceiptOutput() {
    return query(SELECTORS.receipt);
  }

  function isProtectedStage(element) {
    return (
      element instanceof HTMLElement &&
      STAGE_IDS.includes(element.id)
    );
  }

  function publishReceipt(type, payload = {}) {
    const output = getReceiptOutput();
    const receipt = Object.freeze({
      contract: CONTRACT.id,
      version: CONTRACT.version,
      sequence: ++state.receiptSequence,
      type,
      timestamp: new Date().toISOString(),
      payload
    });

    if (output) {
      output.value = JSON.stringify(receipt);
      output.textContent = JSON.stringify(receipt);
      output.dataset.showroomGaugesReceiptState = type;
    }

    document.dispatchEvent(
      new CustomEvent("showroom:gauges-receipt", {
        detail: receipt
      })
    );

    return receipt;
  }

  function validateStageBoundaries() {
    const violations = [];

    for (const stageId of STAGE_IDS) {
      const stage = document.getElementById(stageId);

      if (!stage) {
        violations.push({
          code: "MISSING_STAGE",
          stageId
        });
        continue;
      }

      if (stage.hasAttribute("data-showroom-gauge-dashboard")) {
        violations.push({
          code: "STAGE_OWNS_GAUGE_DASHBOARD",
          stageId
        });
      }

      if (stage.closest(SELECTORS.frontHost)) {
        violations.push({
          code: "STAGE_INSIDE_FRONT_HOST",
          stageId
        });
      }
    }

    return violations;
  }

  function validateDashboard(dashboard) {
    const dashboardId =
      normalize(dashboard.dataset.gaugeDashboardId) ||
      normalize(dashboard.id) ||
      "anonymous-dashboard";

    const gauges = queryAll(SELECTORS.gauge, dashboard);
    const details = queryAll(SELECTORS.detail, dashboard);
    const detailIds = new Set(
      details
        .map((detail) => normalize(detail.dataset.gaugeDetailId))
        .filter(Boolean)
    );

    const violations = [];

    if (!gauges.length) {
      violations.push({
        code: "NO_GAUGES",
        dashboardId
      });
    }

    if (!details.length) {
      violations.push({
        code: "NO_DETAILS",
        dashboardId
      });
    }

    for (const gauge of gauges) {
      const gaugeId = normalize(gauge.dataset.gaugeId);

      if (!gaugeId) {
        violations.push({
          code: "GAUGE_ID_MISSING",
          dashboardId
        });
        continue;
      }

      if (!detailIds.has(gaugeId)) {
        violations.push({
          code: "DETAIL_MISSING",
          dashboardId,
          gaugeId
        });
      }

      const controls = normalize(gauge.getAttribute("aria-controls"));

      if (!controls) {
        violations.push({
          code: "ARIA_CONTROLS_MISSING",
          dashboardId,
          gaugeId
        });
      } else if (!document.getElementById(controls)) {
        violations.push({
          code: "ARIA_CONTROLS_TARGET_MISSING",
          dashboardId,
          gaugeId,
          controls
        });
      }
    }

    return violations;
  }

  function validateInformationGroup(group) {
    const groupId =
      normalize(group.dataset.informationTabsId) ||
      normalize(group.id) ||
      "anonymous-information-group";

    const tabs = queryAll(SELECTORS.informationTab, group);
    const panels = queryAll(SELECTORS.informationPanel, group);
    const panelIds = new Set(
      panels
        .map((panel) => normalize(panel.dataset.informationPanelId))
        .filter(Boolean)
    );

    const violations = [];

    if (!tabs.length) {
      violations.push({
        code: "NO_INFORMATION_TABS",
        groupId
      });
    }

    if (!panels.length) {
      violations.push({
        code: "NO_INFORMATION_PANELS",
        groupId
      });
    }

    for (const tab of tabs) {
      const tabId = normalize(tab.dataset.informationTabId);

      if (!tabId) {
        violations.push({
          code: "INFORMATION_TAB_ID_MISSING",
          groupId
        });
        continue;
      }

      if (!panelIds.has(tabId)) {
        violations.push({
          code: "INFORMATION_PANEL_MISSING",
          groupId,
          tabId
        });
      }

      const controls = normalize(tab.getAttribute("aria-controls"));

      if (!controls || !document.getElementById(controls)) {
        violations.push({
          code: "INFORMATION_ARIA_CONTROLS_INVALID",
          groupId,
          tabId,
          controls
        });
      }
    }

    return violations;
  }

  function publishValidation() {
    const dashboardViolations = queryAll(SELECTORS.dashboard)
      .flatMap(validateDashboard);

    const informationViolations = queryAll(SELECTORS.informationTabs)
      .flatMap(validateInformationGroup);

    const violations = [
      ...validateStageBoundaries(),
      ...dashboardViolations,
      ...informationViolations
    ];

    const result = Object.freeze({
      contract: CONTRACT.id,
      valid: violations.length === 0,
      dashboardCount: queryAll(SELECTORS.dashboard).length,
      informationGroupCount: queryAll(SELECTORS.informationTabs).length,
      protectedStages: STAGE_IDS.slice(),
      violations
    });

    const output = query(SELECTORS.validation);

    if (output) {
      output.dataset.showroomGaugesValidation = result.valid
        ? "PASS"
        : "FAIL";

      output.value = JSON.stringify(result);
      output.textContent = JSON.stringify(result);
    }

    publishReceipt("validation", result);

    return result;
  }

  function getDashboardId(dashboard) {
    return (
      normalize(dashboard.dataset.gaugeDashboardId) ||
      normalize(dashboard.id)
    );
  }

  function findGaugeDetail(dashboard, gaugeId) {
    return query(
      `${SELECTORS.detail}[data-gauge-detail-id="${escapeIdentifier(gaugeId)}"]`,
      dashboard
    );
  }

  function updateDashboardState(dashboard, gaugeId, options = {}) {
    const {
      focus = false,
      publish = true,
      source = "programmatic"
    } = options;

    if (!(dashboard instanceof HTMLElement)) {
      return false;
    }

    const gauges = queryAll(SELECTORS.gauge, dashboard);
    const details = queryAll(SELECTORS.detail, dashboard);

    if (!gauges.length || !details.length) {
      return false;
    }

    const requestedGauge = gauges.find(
      (gauge) => normalize(gauge.dataset.gaugeId) === gaugeId
    );

    if (!requestedGauge) {
      return false;
    }

    const requestedDetail = findGaugeDetail(dashboard, gaugeId);

    if (!requestedDetail) {
      return false;
    }

    for (const gauge of gauges) {
      const active = gauge === requestedGauge;
      setPressed(gauge, active);

      if (active) {
        gauge.tabIndex = 0;
      } else {
        gauge.tabIndex = -1;
      }
    }

    for (const detail of details) {
      const active = detail === requestedDetail;
      setHidden(detail, !active);

      if (active) {
        detail.setAttribute("data-active", "");
      } else {
        detail.removeAttribute("data-active");
      }
    }

    dashboard.dataset.gaugeDashboardState = "interactive";
    dashboard.dataset.activeGaugeId = gaugeId;

    const dashboardId = getDashboardId(dashboard);

    state.dashboards.set(dashboardId, {
      dashboard,
      activeGaugeId: gaugeId
    });

    if (focus) {
      requestedGauge.focus({ preventScroll: true });
    }

    if (publish) {
      publishReceipt("gauge-selection", {
        dashboardId,
        gaugeId,
        source
      });
    }

    document.dispatchEvent(
      new CustomEvent("showroom:gauge-selection", {
        detail: {
          dashboardId,
          gaugeId,
          source
        }
      })
    );

    return true;
  }

  function initializeDashboard(dashboard) {
    const gauges = queryAll(SELECTORS.gauge, dashboard);

    if (!gauges.length) {
      return;
    }

    const initialGauge =
      gauges.find(
        (gauge) => gauge.getAttribute("aria-expanded") === "true"
      ) ||
      gauges.find((gauge) => gauge.hasAttribute("data-active")) ||
      gauges[0];

    const initialGaugeId = normalize(initialGauge.dataset.gaugeId);

    if (!initialGaugeId) {
      return;
    }

    for (const gauge of gauges) {
      if (gauge.dataset.showroomGaugeBound === "true") {
        continue;
      }

      gauge.dataset.showroomGaugeBound = "true";

      gauge.addEventListener("click", () => {
        updateDashboardState(
          dashboard,
          normalize(gauge.dataset.gaugeId),
          {
            source: "pointer"
          }
        );
      });

      gauge.addEventListener("keydown", (event) => {
        const currentIndex = gauges.indexOf(gauge);
        let nextIndex = currentIndex;

        switch (event.key) {
          case "ArrowRight":
          case "ArrowDown":
            nextIndex = (currentIndex + 1) % gauges.length;
            break;

          case "ArrowLeft":
          case "ArrowUp":
            nextIndex =
              (currentIndex - 1 + gauges.length) % gauges.length;
            break;

          case "Home":
            nextIndex = 0;
            break;

          case "End":
            nextIndex = gauges.length - 1;
            break;

          default:
            return;
        }

        event.preventDefault();

        const nextGauge = gauges[nextIndex];
        const nextGaugeId = normalize(nextGauge.dataset.gaugeId);

        updateDashboardState(dashboard, nextGaugeId, {
          focus: true,
          source: "keyboard"
        });
      });
    }

    updateDashboardState(dashboard, initialGaugeId, {
      publish: false,
      source: "initialization"
    });
  }

  function getInformationGroupId(group) {
    return (
      normalize(group.dataset.informationTabsId) ||
      normalize(group.id)
    );
  }

  function findInformationPanel(group, panelId) {
    return query(
      `${SELECTORS.informationPanel}[data-information-panel-id="${escapeIdentifier(panelId)}"]`,
      group
    );
  }

  function updateInformationState(group, panelId, options = {}) {
    const {
      focus = false,
      publish = true,
      source = "programmatic"
    } = options;

    if (!(group instanceof HTMLElement)) {
      return false;
    }

    const tabs = queryAll(SELECTORS.informationTab, group);
    const panels = queryAll(SELECTORS.informationPanel, group);

    const requestedTab = tabs.find(
      (tab) => normalize(tab.dataset.informationTabId) === panelId
    );

    const requestedPanel = findInformationPanel(group, panelId);

    if (!requestedTab || !requestedPanel) {
      return false;
    }

    for (const tab of tabs) {
      const active = tab === requestedTab;

      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;

      if (active) {
        tab.setAttribute("data-active", "");
      } else {
        tab.removeAttribute("data-active");
      }
    }

    for (const panel of panels) {
      const active = panel === requestedPanel;
      setHidden(panel, !active);

      if (active) {
        panel.setAttribute("data-active", "");
      } else {
        panel.removeAttribute("data-active");
      }
    }

    group.dataset.showroomInformationState = "interactive";
    group.dataset.activeInformationPanel = panelId;

    const root = getRoot();

    if (root) {
      root.dataset.showroomActiveInformationTab = panelId;
    }

    const groupId = getInformationGroupId(group);

    state.informationGroups.set(groupId, {
      group,
      activePanelId: panelId
    });

    if (focus) {
      requestedTab.focus({ preventScroll: true });
    }

    if (publish) {
      publishReceipt("information-selection", {
        groupId,
        panelId,
        source
      });
    }

    document.dispatchEvent(
      new CustomEvent("showroom:information-selection", {
        detail: {
          groupId,
          panelId,
          source
        }
      })
    );

    return true;
  }

  function initializeInformationGroup(group) {
    const tabs = queryAll(SELECTORS.informationTab, group);

    if (!tabs.length) {
      return;
    }

    const initialTab =
      tabs.find(
        (tab) => tab.getAttribute("aria-selected") === "true"
      ) ||
      tabs.find(
        (tab) =>
          normalize(tab.dataset.informationTabId) === "platform"
      ) ||
      tabs[0];

    const initialPanelId = normalize(
      initialTab.dataset.informationTabId
    );

    if (!initialPanelId) {
      return;
    }

    for (const tab of tabs) {
      if (tab.dataset.showroomInformationTabBound === "true") {
        continue;
      }

      tab.dataset.showroomInformationTabBound = "true";

      tab.addEventListener("click", () => {
        updateInformationState(
          group,
          normalize(tab.dataset.informationTabId),
          {
            source: "pointer"
          }
        );
      });

      tab.addEventListener("keydown", (event) => {
        const currentIndex = tabs.indexOf(tab);
        let nextIndex = currentIndex;

        switch (event.key) {
          case "ArrowRight":
          case "ArrowDown":
            nextIndex = (currentIndex + 1) % tabs.length;
            break;

          case "ArrowLeft":
          case "ArrowUp":
            nextIndex =
              (currentIndex - 1 + tabs.length) % tabs.length;
            break;

          case "Home":
            nextIndex = 0;
            break;

          case "End":
            nextIndex = tabs.length - 1;
            break;

          default:
            return;
        }

        event.preventDefault();

        const nextTab = tabs[nextIndex];
        const nextPanelId = normalize(
          nextTab.dataset.informationTabId
        );

        updateInformationState(group, nextPanelId, {
          focus: true,
          source: "keyboard"
        });
      });
    }

    updateInformationState(group, initialPanelId, {
      publish: false,
      source: "initialization"
    });
  }

  function getFrontId(front) {
    return (
      normalize(front.dataset.showroomGaugeSet) ||
      normalize(front.id)
    );
  }

  function findFront(frontId) {
    if (!frontId) {
      return null;
    }

    return (
      document.getElementById(frontId) ||
      query(
        `${SELECTORS.front}[data-showroom-gauge-set="${escapeIdentifier(frontId)}"]`
      )
    );
  }

  function setSupportingFront(frontId, options = {}) {
    const {
      scroll = false,
      focus = false,
      publish = true,
      source = "programmatic"
    } = options;

    const root = getRoot();
    const frontHost = query(SELECTORS.frontHost);
    const target = findFront(frontId);

    if (!target || isProtectedStage(target)) {
      return false;
    }

    if (frontHost && frontHost.contains(target)) {
      const fronts = queryAll(SELECTORS.front, frontHost);

      for (const front of fronts) {
        const active = front === target;

        front.dataset.showroomFrontState = active
          ? "active"
          : "inactive";

        setHidden(front, !active);
      }
    } else {
      target.dataset.showroomFrontState = "active";
      target.hidden = false;
      target.setAttribute("aria-hidden", "false");
    }

    const normalizedFrontId = getFrontId(target) || frontId;

    state.activeFrontId = normalizedFrontId;

    if (root) {
      root.dataset.showroomActiveFront = normalizedFrontId;
      root.dataset.showroomActiveGaugeSet = normalizedFrontId;
    }

    if (scroll) {
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });
    }

    if (focus) {
      const heading = query("h2, h3", target);

      if (heading) {
        const previousTabIndex = heading.getAttribute("tabindex");
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });

        if (previousTabIndex === null) {
          heading.addEventListener(
            "blur",
            () => heading.removeAttribute("tabindex"),
            { once: true }
          );
        }
      }
    }

    if (publish) {
      publishReceipt("front-selection", {
        frontId: normalizedFrontId,
        source
      });
    }

    document.dispatchEvent(
      new CustomEvent("showroom:front-selection", {
        detail: {
          frontId: normalizedFrontId,
          source
        }
      })
    );

    return true;
  }

  function revealAllSupportingFronts(options = {}) {
    const {
      publish = true,
      source = "programmatic"
    } = options;

    const frontHost = query(SELECTORS.frontHost);

    if (frontHost) {
      for (const front of queryAll(SELECTORS.front, frontHost)) {
        front.hidden = false;
        front.setAttribute("aria-hidden", "false");
        front.dataset.showroomFrontState = "fallback";
      }
    }

    const root = getRoot();

    if (root) {
      root.dataset.showroomActiveFront = "";
      root.dataset.showroomActiveGaugeSet = "";
    }

    state.activeFrontId = "";

    if (publish) {
      publishReceipt("front-reset", {
        source
      });
    }
  }

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function synchronizeFrontFromRoot() {
    const root = getRoot();

    if (!root) {
      return;
    }

    const requested =
      normalize(root.dataset.showroomActiveFront) ||
      normalize(root.dataset.showroomActiveGaugeSet);

    if (!requested) {
      return;
    }

    if (requested === state.activeFrontId) {
      return;
    }

    setSupportingFront(requested, {
      source: "root-attribute",
      publish: false
    });
  }

  function updateWindowGaugeState() {
    const gauge = query(SELECTORS.windowGauge);

    if (!gauge) {
      return;
    }

    const root = getRoot();
    const threshold = document.getElementById(
      "showroom-window-threshold"
    );

    const windowState =
      normalize(root?.dataset.showroomWindowState) ||
      normalize(threshold?.dataset.showroomWindowState) ||
      "closed";

    const normalizedState =
      windowState.toLowerCase() === "open" ? "open" : "closed";

    gauge.dataset.gaugeState = normalizedState;

    const value = query("strong", gauge);

    if (value) {
      value.textContent =
        normalizedState === "open" ? "Open" : "Closed";
    }

    const detail = document.getElementById(
      normalize(gauge.getAttribute("aria-controls"))
    );

    if (detail) {
      detail.dataset.windowState = normalizedState;
    }
  }

  function initializeObservers() {
    const root = getRoot();

    if (root && !state.rootObserver) {
      state.rootObserver = new MutationObserver((records) => {
        for (const record of records) {
          if (record.type !== "attributes") {
            continue;
          }

          if (
            record.attributeName === "data-showroom-active-front" ||
            record.attributeName ===
              "data-showroom-active-gauge-set"
          ) {
            synchronizeFrontFromRoot();
          }

          if (
            record.attributeName === "data-showroom-window-state"
          ) {
            updateWindowGaugeState();
          }
        }
      });

      state.rootObserver.observe(root, {
        attributes: true,
        attributeFilter: [
          "data-showroom-active-front",
          "data-showroom-active-gauge-set",
          "data-showroom-window-state"
        ]
      });
    }

    const threshold = document.getElementById(
      "showroom-window-threshold"
    );

    if (threshold && !state.mutationObserver) {
      state.mutationObserver = new MutationObserver(
        updateWindowGaugeState
      );

      state.mutationObserver.observe(threshold, {
        attributes: true,
        attributeFilter: ["data-showroom-window-state"]
      });
    }
  }

  function bindIntegrationEvents() {
    document.addEventListener("showroom:front-request", (event) => {
      const frontId = normalize(event.detail?.frontId);

      if (!frontId) {
        return;
      }

      setSupportingFront(frontId, {
        scroll: Boolean(event.detail?.scroll),
        focus: Boolean(event.detail?.focus),
        source: "front-request-event"
      });
    });

    document.addEventListener(
      "showroom:gauge-set-request",
      (event) => {
        const gaugeSet = normalize(
          event.detail?.gaugeSet ||
          event.detail?.frontId
        );

        if (!gaugeSet) {
          return;
        }

        setSupportingFront(gaugeSet, {
          scroll: Boolean(event.detail?.scroll),
          focus: Boolean(event.detail?.focus),
          source: "gauge-set-request-event"
        });
      }
    );

    document.addEventListener("showroom:front-reset-request", () => {
      revealAllSupportingFronts({
        source: "front-reset-request-event"
      });
    });

    document.addEventListener(
      "showroom:window-state-change",
      updateWindowGaugeState
    );
  }

  function initialize() {
    if (state.initialized) {
      return;
    }

    const root = getRoot();

    if (!root) {
      return;
    }

    state.initialized = true;

    for (const dashboard of queryAll(SELECTORS.dashboard)) {
      initializeDashboard(dashboard);
    }

    for (const group of queryAll(SELECTORS.informationTabs)) {
      initializeInformationGroup(group);
    }

    initializeObservers();
    bindIntegrationEvents();
    updateWindowGaugeState();
    synchronizeFrontFromRoot();

    root.dataset.showroomGaugesState = "interactive";
    root.dataset.showroomGaugesReady = "true";

    const validation = publishValidation();

    publishReceipt("initialized", {
      valid: validation.valid,
      dashboardCount: queryAll(SELECTORS.dashboard).length,
      gaugeCount: queryAll(SELECTORS.gauge).length,
      informationTabCount: queryAll(
        SELECTORS.informationTab
      ).length,
      protectedStages: STAGE_IDS.slice()
    });

    document.dispatchEvent(
      new CustomEvent("showroom:gauges-ready", {
        detail: {
          contract: CONTRACT.id,
          version: CONTRACT.version,
          valid: validation.valid
        }
      })
    );
  }

  const API = Object.freeze({
    contract: CONTRACT,
    initialize,
    validate: publishValidation,
    selectGauge(dashboardId, gaugeId, options = {}) {
      const dashboard =
        query(
          `${SELECTORS.dashboard}[data-gauge-dashboard-id="${escapeIdentifier(dashboardId)}"]`
        ) ||
        document.getElementById(dashboardId);

      return updateDashboardState(
        dashboard,
        normalize(gaugeId),
        options
      );
    },
    selectInformation(groupId, panelId, options = {}) {
      const group =
        query(
          `${SELECTORS.informationTabs}[data-information-tabs-id="${escapeIdentifier(groupId)}"]`
        ) ||
        document.getElementById(groupId);

      return updateInformationState(
        group,
        normalize(panelId),
        options
      );
    },
    selectFront(frontId, options = {}) {
      return setSupportingFront(
        normalize(frontId),
        options
      );
    },
    revealAllFronts(options = {}) {
      revealAllSupportingFronts(options);
    },
    getState() {
      return Object.freeze({
        initialized: state.initialized,
        activeFrontId: state.activeFrontId,
        dashboards: Array.from(
          state.dashboards.entries()
        ).map(([dashboardId, value]) => ({
          dashboardId,
          activeGaugeId: value.activeGaugeId
        })),
        informationGroups: Array.from(
          state.informationGroups.entries()
        ).map(([groupId, value]) => ({
          groupId,
          activePanelId: value.activePanelId
        }))
      });
    }
  });

  Object.defineProperty(
    window,
    "DGBShowroomGauges",
    {
      value: API,
      configurable: false,
      enumerable: false,
      writable: false
    }
  );

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
