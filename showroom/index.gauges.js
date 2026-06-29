/* TARGET FILE: /showroom/index.gauges.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2 */
/*
  Controlling markup:
  - /showroom/index.html
  - SHOWROOM_MIRRORLAND_OFFICIAL_GATE_COMPACT_INSTRUCTIONS_AND_GAUGES_HTML_TNT_v5

  Scope:
  - Discover and initialize compact Showroom gauge dashboards.
  - Maintain exactly one selected gauge inside each dashboard.
  - Coordinate compact metric, capability, and status selectors with one
    shared detail panel per dashboard.
  - Preserve aria-expanded correspondence without allowing a selected gauge
    to collapse its shared detail panel.
  - Maintain Diamond composition-region selection.
  - Update the shared Diamond composition detail fields.
  - Maintain Platform / Engineering / Evidence tab selection.
  - Preserve keyboard navigation with preventScroll focus behavior.
  - Preserve bounded numeric roll-up for direct compact metric values.
  - Pause decorative dashboard motion while a front is inactive.
  - Respect reduced-motion preferences.
  - Preserve readiness, state, failure, disposal, and public API receipts.
  - Avoid scrollIntoView, location-hash mutation, automatic document scrolling,
    and focus behavior that moves the viewport.

  Does not own:
  - page-level front selection;
  - star activation;
  - route decisions or hard navigation;
  - cluster expansion;
  - Return to Orbit;
  - Compass state or navigation;
  - Mirrorland Window state;
  - Diamond motion, zoom, controls, camera, or lifecycle;
  - compositor camera, projection, or depth classification;
  - crystal geometry, motion, or drawing;
  - disclosure opening or closing outside the gauge system.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2";

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-gauges-receipt]",

    front:
      "[data-showroom-front]",

    dashboard:
      "[data-showroom-gauge-dashboard]",

    gauge:
      "[data-showroom-gauge]",

    detail:
      "[data-showroom-gauge-detail]",

    sharedDetails:
      "[data-showroom-gauge-details]",

    compositionGauge:
      "[data-showroom-composition-gauge]",

    compositionRegion:
      "[data-showroom-composition-region]",

    compositionDetail:
      "[data-showroom-composition-detail]",

    compositionDetailIndex:
      "[data-showroom-composition-detail-index]",

    compositionDetailTitle:
      "[data-showroom-composition-detail-title]",

    compositionDetailDescription:
      "[data-showroom-composition-detail-description]",

    informationTabs:
      "[data-showroom-information-tabs]",

    informationTab:
      "[data-showroom-information-tab]",

    informationPanel:
      "[data-showroom-information-panel]"
  });

  const ATTRIBUTES = Object.freeze({
    ready:
      "data-showroom-gauges-ready",

    state:
      "data-showroom-gauges-state",

    motion:
      "data-showroom-gauge-motion",

    dashboardState:
      "data-gauge-dashboard-state",

    entered:
      "data-gauge-dashboard-entered",

    selectedGauge:
      "data-selected-gauge",

    selectedRegion:
      "data-selected-region",

    activeInformationTab:
      "data-active-information-tab",

    frontState:
      "data-showroom-front-state"
  });

  const STATE = {
    root: null,
    receipt: null,

    reducedMotionQuery: null,
    reducedMotion: false,

    dashboards: new Map(),
    compositionGauges: new Map(),
    informationGroups: new Map(),

    listeners: [],
    observers: [],
    animationFrames: new Set(),

    initialized: false,
    disposed: false,
    fatalError: null
  };

  function toArray(value) {
    return Array.from(value || []);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeText(value) {
    return String(value || "").trim();
  }

  function setBooleanAttribute(
    element,
    name,
    value
  ) {
    if (!element) {
      return;
    }

    element.setAttribute(
      name,
      value ? "true" : "false"
    );
  }

  function isElementVisible(element) {
    if (
      !element ||
      !element.isConnected ||
      element.hidden
    ) {
      return false;
    }

    const front =
      element.closest(SELECTORS.front);

    if (
      front &&
      (
        front.hidden ||
        front.getAttribute(
          ATTRIBUTES.frontState
        ) === "inactive"
      )
    ) {
      return false;
    }

    const style =
      window.getComputedStyle(element);

    return (
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }

  function addListener(
    target,
    type,
    handler,
    options
  ) {
    if (
      !target ||
      typeof target.addEventListener !== "function"
    ) {
      return;
    }

    target.addEventListener(
      type,
      handler,
      options
    );

    STATE.listeners.push(() => {
      target.removeEventListener(
        type,
        handler,
        options
      );
    });
  }

  function addObserver(observer) {
    if (observer) {
      STATE.observers.push(observer);
    }
  }

  function requestTrackedFrame(callback) {
    const frameId =
      window.requestAnimationFrame(
        (timestamp) => {
          STATE.animationFrames.delete(
            frameId
          );

          callback(timestamp);
        }
      );

    STATE.animationFrames.add(frameId);

    return frameId;
  }

  function cancelTrackedFrames() {
    for (
      const frameId
      of STATE.animationFrames
    ) {
      window.cancelAnimationFrame(
        frameId
      );
    }

    STATE.animationFrames.clear();
  }

  function createReceiptPayload(
    eventName,
    extra = {}
  ) {
    return Object.freeze({
      contract:
        CONTRACT,

      event:
        eventName,

      timestamp:
        nowIso(),

      ready:
        STATE.initialized &&
        !STATE.disposed,

      disposed:
        STATE.disposed,

      reducedMotion:
        STATE.reducedMotion,

      dashboards:
        STATE.dashboards.size,

      compositionGauges:
        STATE.compositionGauges.size,

      informationGroups:
        STATE.informationGroups.size,

      fatalError:
        STATE.fatalError
          ? {
              name:
                STATE.fatalError.name,

              message:
                STATE.fatalError.message
            }
          : null,

      ...extra
    });
  }

  function publishReceipt(
    eventName,
    extra = {}
  ) {
    const payload =
      createReceiptPayload(
        eventName,
        extra
      );

    if (STATE.receipt) {
      const serialized =
        JSON.stringify(payload);

      STATE.receipt.value =
        JSON.stringify(
          payload,
          null,
          2
        );

      STATE.receipt.textContent =
        serialized;
    }

    window.dispatchEvent(
      new CustomEvent(
        "showroom:gauges-receipt",
        {
          detail:
            payload
        }
      )
    );

    return payload;
  }

  function reportRecoverableError(
    scope,
    error,
    extra = {}
  ) {
    publishReceipt(
      "recoverable-error",
      {
        scope,

        error: {
          name:
            error instanceof Error
              ? error.name
              : "Error",

          message:
            error instanceof Error
              ? error.message
              : String(error)
        },

        ...extra
      }
    );
  }

  function reportFatalError(error) {
    STATE.fatalError =
      error instanceof Error
        ? error
        : new Error(
            String(error)
          );

    if (STATE.root) {
      STATE.root.setAttribute(
        ATTRIBUTES.state,
        "failed"
      );

      STATE.root.setAttribute(
        ATTRIBUTES.ready,
        "false"
      );
    }

    publishReceipt(
      "fatal-error"
    );
  }

  function resolveControlledElement(
    source,
    attributeName
  ) {
    if (!source) {
      return null;
    }

    const id =
      normalizeText(
        source.getAttribute(
          attributeName
        )
      );

    if (!id) {
      return null;
    }

    return document.getElementById(id);
  }

  function validateGaugePair(
    gauge,
    detail
  ) {
    const gaugeId =
      normalizeText(
        gauge.getAttribute(
          "data-gauge-id"
        )
      ) || "unknown";

    if (!detail) {
      throw new Error(
        `Gauge "${gaugeId}" has no matching detail panel.`
      );
    }

    const detailId =
      normalizeText(
        detail.getAttribute(
          "data-gauge-detail-id"
        )
      );

    if (
      detailId &&
      gaugeId !== "unknown" &&
      gaugeId !== detailId
    ) {
      throw new Error(
        `Gauge/detail mismatch: "${gaugeId}" does not match "${detailId}".`
      );
    }
  }

  function getDashboardRecordFromGauge(
    gauge
  ) {
    const dashboard =
      gauge.closest(
        SELECTORS.dashboard
      );

    if (!dashboard) {
      return null;
    }

    return (
      STATE.dashboards.get(
        dashboard
      ) || null
    );
  }

  function focusWithoutScroll(element) {
    if (
      !element ||
      typeof element.focus !== "function"
    ) {
      return;
    }

    try {
      element.focus({
        preventScroll: true
      });
    } catch {
      element.focus();
    }
  }

  function getGaugeId(gauge) {
    return normalizeText(
      gauge &&
      gauge.getAttribute(
        "data-gauge-id"
      )
    );
  }

  function selectGauge(
    record,
    gauge,
    options = {}
  ) {
    if (
      !record ||
      !gauge ||
      record.disposed
    ) {
      return false;
    }

    const {
      focus = false,
      announce = true
    } = options;

    const detail =
      record.detailByGauge.get(
        gauge
      );

    if (!detail) {
      return false;
    }

    for (
      const candidate
      of record.gauges
    ) {
      const selected =
        candidate === gauge;

      setBooleanAttribute(
        candidate,
        "aria-expanded",
        selected
      );

      candidate.toggleAttribute(
        "data-gauge-selected",
        selected
      );

      const candidateDetail =
        record.detailByGauge.get(
          candidate
        );

      if (candidateDetail) {
        candidateDetail.hidden =
          !selected;

        setBooleanAttribute(
          candidateDetail,
          "aria-hidden",
          !selected
        );
      }
    }

    record.selectedGauge =
      gauge;

    const gaugeId =
      getGaugeId(gauge);

    record.dashboard.setAttribute(
      ATTRIBUTES.selectedGauge,
      gaugeId
    );

    if (record.sharedDetails) {
      record.sharedDetails.setAttribute(
        "data-active-gauge-detail",
        gaugeId
      );
    }

    if (focus) {
      focusWithoutScroll(gauge);
    }

    if (announce) {
      publishReceipt(
        "gauge-selected",
        {
          dashboardId:
            record.id,

          gaugeId
        }
      );
    }

    return true;
  }

  function selectAdjacentGauge(
    record,
    currentGauge,
    direction
  ) {
    const currentIndex =
      record.gauges.indexOf(
        currentGauge
      );

    if (currentIndex < 0) {
      return false;
    }

    const nextIndex =
      (
        currentIndex +
        direction +
        record.gauges.length
      ) % record.gauges.length;

    return selectGauge(
      record,
      record.gauges[nextIndex],
      {
        focus: true
      }
    );
  }

  function handleGaugeKeydown(event) {
    const gauge =
      event.currentTarget;

    const record =
      getDashboardRecordFromGauge(
        gauge
      );

    if (!record) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();

        selectAdjacentGauge(
          record,
          gauge,
          1
        );
        break;

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();

        selectAdjacentGauge(
          record,
          gauge,
          -1
        );
        break;

      case "Home":
        event.preventDefault();

        selectGauge(
          record,
          record.gauges[0],
          {
            focus: true
          }
        );
        break;

      case "End":
        event.preventDefault();

        selectGauge(
          record,
          record.gauges[
            record.gauges.length - 1
          ],
          {
            focus: true
          }
        );
        break;

      default:
        break;
    }
  }

  function getNumericDisplayTarget(gauge) {
    if (!gauge) {
      return null;
    }

    return (
      gauge.querySelector(
        ".showroom-gauge__value"
      ) ||
      gauge.querySelector(
        ":scope > strong"
      )
    );
  }

  function isIntegerDisplayText(value) {
    return /^[+-]?\d+$/.test(value);
  }

  function formatAnimatedValue(
    value,
    finalText
  ) {
    if (
      isIntegerDisplayText(
        finalText
      )
    ) {
      return String(
        Math.round(value)
      );
    }

    return finalText;
  }

  function setGaugeFinalValue(gauge) {
    const rawValue =
      normalizeText(
        gauge.getAttribute(
          "data-gauge-value"
        )
      );

    const finalText =
      normalizeText(
        gauge.getAttribute(
          "data-gauge-display-value"
        )
      ) || rawValue;

    const numericValue =
      Number(rawValue);

    const valueElement =
      getNumericDisplayTarget(
        gauge
      );

    if (
      !valueElement ||
      !Number.isFinite(
        numericValue
      )
    ) {
      return false;
    }

    valueElement.textContent =
      finalText;

    gauge.removeAttribute(
      "data-gauge-counting"
    );

    gauge.setAttribute(
      "data-gauge-counted",
      "true"
    );

    return true;
  }

  function animateNumericGauge(
    record,
    gauge
  ) {
    const rawValue =
      normalizeText(
        gauge.getAttribute(
          "data-gauge-value"
        )
      );

    const finalText =
      normalizeText(
        gauge.getAttribute(
          "data-gauge-display-value"
        )
      ) || rawValue;

    const numericValue =
      Number(rawValue);

    const valueElement =
      getNumericDisplayTarget(
        gauge
      );

    if (
      !valueElement ||
      !Number.isFinite(
        numericValue
      )
    ) {
      return;
    }

    if (
      STATE.reducedMotion ||
      gauge.getAttribute(
        "data-gauge-counted"
      ) === "true"
    ) {
      setGaugeFinalValue(
        gauge
      );

      return;
    }

    const duration =
      620;

    const startedAt =
      performance.now();

    gauge.setAttribute(
      "data-gauge-counting",
      "true"
    );

    const step = (timestamp) => {
      if (
        STATE.disposed ||
        record.disposed
      ) {
        return;
      }

      const elapsed =
        timestamp - startedAt;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const eased =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      valueElement.textContent =
        formatAnimatedValue(
          numericValue * eased,
          finalText
        );

      if (progress < 1) {
        requestTrackedFrame(step);

        return;
      }

      setGaugeFinalValue(
        gauge
      );
    };

    requestTrackedFrame(step);
  }

  function triggerDashboardEntrance(
    record
  ) {
    if (
      !record ||
      record.disposed ||
      !isElementVisible(
        record.dashboard
      )
    ) {
      return;
    }

    record.dashboard.setAttribute(
      ATTRIBUTES.motion,
      STATE.reducedMotion
        ? "reduced"
        : "active"
    );

    if (
      record.dashboard.getAttribute(
        ATTRIBUTES.entered
      ) !== "true"
    ) {
      record.dashboard.setAttribute(
        ATTRIBUTES.entered,
        "true"
      );

      record.dashboard.setAttribute(
        ATTRIBUTES.dashboardState,
        "entering"
      );

      requestTrackedFrame(() => {
        if (
          STATE.disposed ||
          record.disposed
        ) {
          return;
        }

        record.dashboard.setAttribute(
          ATTRIBUTES.dashboardState,
          "active"
        );
      });
    } else {
      record.dashboard.setAttribute(
        ATTRIBUTES.dashboardState,
        "active"
      );
    }

    for (
      const gauge
      of record.gauges
    ) {
      animateNumericGauge(
        record,
        gauge
      );
    }
  }

  function pauseDashboard(record) {
    if (
      !record ||
      record.disposed
    ) {
      return;
    }

    record.dashboard.setAttribute(
      ATTRIBUTES.motion,
      "paused"
    );

    record.dashboard.setAttribute(
      ATTRIBUTES.dashboardState,
      "inactive"
    );
  }

  function refreshDashboardActivity() {
    for (
      const record
      of STATE.dashboards.values()
    ) {
      if (
        isElementVisible(
          record.dashboard
        )
      ) {
        triggerDashboardEntrance(
          record
        );
      } else {
        pauseDashboard(
          record
        );
      }
    }
  }

  function initializeDashboard(
    dashboard,
    index
  ) {
    const id =
      normalizeText(
        dashboard.getAttribute(
          "data-gauge-dashboard-id"
        )
      ) ||
      `dashboard-${index + 1}`;

    const gauges =
      toArray(
        dashboard.querySelectorAll(
          SELECTORS.gauge
        )
      );

    if (
      gauges.length === 0
    ) {
      throw new Error(
        `Gauge dashboard "${id}" contains no gauges.`
      );
    }

    const sharedDetails =
      dashboard.querySelector(
        SELECTORS.sharedDetails
      );

    const record = {
      id,
      dashboard,
      sharedDetails,
      gauges,

      detailByGauge:
        new Map(),

      selectedGauge:
        null,

      disposed:
        false
    };

    for (
      const gauge
      of gauges
    ) {
      const detail =
        resolveControlledElement(
          gauge,
          "aria-controls"
        );

      validateGaugePair(
        gauge,
        detail
      );

      record.detailByGauge.set(
        gauge,
        detail
      );

      addListener(
        gauge,
        "click",
        () => {
          /*
            Re-selecting the active gauge keeps its shared detail open.
            Compact dashboards always retain exactly one active detail.
          */
          selectGauge(
            record,
            gauge
          );
        }
      );

      addListener(
        gauge,
        "keydown",
        handleGaugeKeydown
      );
    }

    const initiallyExpanded =
      gauges.find(
        (gauge) =>
          gauge.getAttribute(
            "aria-expanded"
          ) === "true"
      ) ||
      gauges[0];

    selectGauge(
      record,
      initiallyExpanded,
      {
        announce: false
      }
    );

    STATE.dashboards.set(
      dashboard,
      record
    );

    return record;
  }

  function readCompositionRegionData(
    region
  ) {
    const children =
      toArray(region.children);

    const index =
      normalizeText(
        region.getAttribute(
          "data-region-index"
        )
      ) ||
      normalizeText(
        children[0] &&
        children[0].textContent
      );

    const title =
      normalizeText(
        region.getAttribute(
          "data-region-title"
        )
      ) ||
      normalizeText(
        region.querySelector(
          "strong"
        )?.textContent
      );

    const description =
      normalizeText(
        region.getAttribute(
          "data-region-description"
        )
      ) ||
      normalizeText(
        region.querySelector(
          "small"
        )?.textContent
      );

    return Object.freeze({
      index,
      title,
      description
    });
  }

  function updateCompositionDetail(
    record,
    region
  ) {
    if (
      !record ||
      !region
    ) {
      return;
    }

    const data =
      readCompositionRegionData(
        region
      );

    if (
      record.detailIndex &&
      data.index
    ) {
      record.detailIndex.textContent =
        data.index;
    }

    if (
      record.detailTitle &&
      data.title
    ) {
      record.detailTitle.textContent =
        data.title;
    }

    if (
      record.detailDescription &&
      data.description
    ) {
      record.detailDescription.textContent =
        data.description;
    }

    if (record.detail) {
      record.detail.setAttribute(
        "data-active-composition-region",
        normalizeText(
          region.getAttribute(
            "data-region-id"
          )
        )
      );
    }
  }

  function selectCompositionRegion(
    record,
    region,
    options = {}
  ) {
    if (
      !record ||
      !region ||
      record.disposed
    ) {
      return false;
    }

    for (
      const candidate
      of record.regions
    ) {
      const selected =
        candidate === region;

      setBooleanAttribute(
        candidate,
        "aria-pressed",
        selected
      );

      candidate.toggleAttribute(
        "data-region-selected",
        selected
      );

      candidate.tabIndex =
        selected ? 0 : -1;
    }

    record.selectedRegion =
      region;

    const regionId =
      normalizeText(
        region.getAttribute(
          "data-region-id"
        )
      );

    record.container.setAttribute(
      ATTRIBUTES.selectedRegion,
      regionId
    );

    updateCompositionDetail(
      record,
      region
    );

    if (options.focus) {
      focusWithoutScroll(
        region
      );
    }

    if (
      options.announce !== false
    ) {
      publishReceipt(
        "composition-region-selected",
        {
          compositionId:
            record.id,

          regionId
        }
      );
    }

    return true;
  }

  function selectAdjacentRegion(
    record,
    current,
    direction
  ) {
    const currentIndex =
      record.regions.indexOf(
        current
      );

    if (currentIndex < 0) {
      return false;
    }

    const nextIndex =
      (
        currentIndex +
        direction +
        record.regions.length
      ) % record.regions.length;

    return selectCompositionRegion(
      record,
      record.regions[nextIndex],
      {
        focus: true
      }
    );
  }

  function initializeCompositionGauge(
    container,
    index
  ) {
    const id =
      normalizeText(
        container.getAttribute(
          "data-composition-id"
        )
      ) ||
      `composition-${index + 1}`;

    const regions =
      toArray(
        container.querySelectorAll(
          SELECTORS.compositionRegion
        )
      );

    if (
      regions.length === 0
    ) {
      throw new Error(
        `Composition gauge "${id}" contains no regions.`
      );
    }

    const detail =
      container.querySelector(
        SELECTORS.compositionDetail
      );

    const record = {
      id,
      container,
      regions,

      detail,

      detailIndex:
        detail
          ? detail.querySelector(
              SELECTORS.compositionDetailIndex
            )
          : null,

      detailTitle:
        detail
          ? detail.querySelector(
              SELECTORS.compositionDetailTitle
            )
          : null,

      detailDescription:
        detail
          ? detail.querySelector(
              SELECTORS.compositionDetailDescription
            )
          : null,

      selectedRegion:
        null,

      disposed:
        false
    };

    for (
      const region
      of regions
    ) {
      addListener(
        region,
        "click",
        () => {
          selectCompositionRegion(
            record,
            region
          );
        }
      );

      addListener(
        region,
        "keydown",
        (event) => {
          switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
              event.preventDefault();

              selectAdjacentRegion(
                record,
                region,
                1
              );
              break;

            case "ArrowLeft":
            case "ArrowUp":
              event.preventDefault();

              selectAdjacentRegion(
                record,
                region,
                -1
              );
              break;

            case "Home":
              event.preventDefault();

              selectCompositionRegion(
                record,
                regions[0],
                {
                  focus: true
                }
              );
              break;

            case "End":
              event.preventDefault();

              selectCompositionRegion(
                record,
                regions[
                  regions.length - 1
                ],
                {
                  focus: true
                }
              );
              break;

            default:
              break;
          }
        }
      );
    }

    const initialRegion =
      regions.find(
        (region) =>
          region.getAttribute(
            "aria-pressed"
          ) === "true"
      ) ||
      regions[0];

    selectCompositionRegion(
      record,
      initialRegion,
      {
        announce: false
      }
    );

    STATE.compositionGauges.set(
      container,
      record
    );

    return record;
  }

  function selectInformationTab(
    record,
    tab,
    options = {}
  ) {
    if (
      !record ||
      !tab ||
      record.disposed
    ) {
      return false;
    }

    const panel =
      record.panelByTab.get(
        tab
      );

    if (!panel) {
      return false;
    }

    for (
      const candidate
      of record.tabs
    ) {
      const selected =
        candidate === tab;

      setBooleanAttribute(
        candidate,
        "aria-selected",
        selected
      );

      candidate.tabIndex =
        selected ? 0 : -1;

      candidate.toggleAttribute(
        "data-information-tab-selected",
        selected
      );

      const candidatePanel =
        record.panelByTab.get(
          candidate
        );

      if (candidatePanel) {
        candidatePanel.hidden =
          !selected;

        setBooleanAttribute(
          candidatePanel,
          "aria-hidden",
          !selected
        );
      }
    }

    record.selectedTab =
      tab;

    const tabId =
      normalizeText(
        tab.getAttribute(
          "data-information-tab-id"
        )
      );

    record.container.setAttribute(
      ATTRIBUTES.activeInformationTab,
      tabId
    );

    if (STATE.root) {
      STATE.root.setAttribute(
        "data-showroom-active-information-tab",
        tabId
      );
    }

    if (options.focus) {
      focusWithoutScroll(
        tab
      );
    }

    if (
      options.announce !== false
    ) {
      publishReceipt(
        "information-tab-selected",
        {
          informationGroupId:
            record.id,

          tabId
        }
      );
    }

    refreshDashboardActivity();

    return true;
  }

  function selectAdjacentInformationTab(
    record,
    currentTab,
    direction
  ) {
    const currentIndex =
      record.tabs.indexOf(
        currentTab
      );

    if (currentIndex < 0) {
      return false;
    }

    const nextIndex =
      (
        currentIndex +
        direction +
        record.tabs.length
      ) % record.tabs.length;

    return selectInformationTab(
      record,
      record.tabs[nextIndex],
      {
        focus: true
      }
    );
  }

  function initializeInformationTabs(
    container,
    index
  ) {
    const id =
      normalizeText(
        container.getAttribute(
          "data-information-tabs-id"
        )
      ) ||
      `information-tabs-${index + 1}`;

    const tabs =
      toArray(
        container.querySelectorAll(
          SELECTORS.informationTab
        )
      );

    const panels =
      toArray(
        container.querySelectorAll(
          SELECTORS.informationPanel
        )
      );

    if (
      tabs.length === 0
    ) {
      throw new Error(
        `Information group "${id}" contains no tabs.`
      );
    }

    const record = {
      id,
      container,
      tabs,
      panels,

      panelByTab:
        new Map(),

      selectedTab:
        null,

      disposed:
        false
    };

    for (
      const tab
      of tabs
    ) {
      const panel =
        resolveControlledElement(
          tab,
          "aria-controls"
        );

      if (!panel) {
        throw new Error(
          `Information tab "${normalizeText(
            tab.getAttribute(
              "data-information-tab-id"
            )
          ) || "unknown"}" has no matching panel.`
        );
      }

      record.panelByTab.set(
        tab,
        panel
      );

      addListener(
        tab,
        "click",
        () => {
          selectInformationTab(
            record,
            tab
          );
        }
      );

      addListener(
        tab,
        "keydown",
        (event) => {
          switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
              event.preventDefault();

              selectAdjacentInformationTab(
                record,
                tab,
                1
              );
              break;

            case "ArrowLeft":
            case "ArrowUp":
              event.preventDefault();

              selectAdjacentInformationTab(
                record,
                tab,
                -1
              );
              break;

            case "Home":
              event.preventDefault();

              selectInformationTab(
                record,
                tabs[0],
                {
                  focus: true
                }
              );
              break;

            case "End":
              event.preventDefault();

              selectInformationTab(
                record,
                tabs[
                  tabs.length - 1
                ],
                {
                  focus: true
                }
              );
              break;

            default:
              break;
          }
        }
      );
    }

    const initialTab =
      tabs.find(
        (tab) =>
          tab.getAttribute(
            "aria-selected"
          ) === "true"
      ) ||
      tabs[0];

    selectInformationTab(
      record,
      initialTab,
      {
        announce: false
      }
    );

    STATE.informationGroups.set(
      container,
      record
    );

    return record;
  }

  function applyReducedMotionState() {
    STATE.reducedMotion =
      Boolean(
        STATE.reducedMotionQuery &&
        STATE.reducedMotionQuery.matches
      );

    if (STATE.root) {
      STATE.root.setAttribute(
        "data-showroom-gauges-reduced-motion",
        STATE.reducedMotion
          ? "true"
          : "false"
      );
    }

    for (
      const record
      of STATE.dashboards.values()
    ) {
      record.dashboard.setAttribute(
        ATTRIBUTES.motion,
        STATE.reducedMotion
          ? "reduced"
          : isElementVisible(
              record.dashboard
            )
            ? "active"
            : "paused"
      );

      if (STATE.reducedMotion) {
        for (
          const gauge
          of record.gauges
        ) {
          setGaugeFinalValue(
            gauge
          );
        }
      }
    }

    publishReceipt(
      "reduced-motion-changed"
    );
  }

  function initializeReducedMotion() {
    STATE.reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    STATE.reducedMotion =
      STATE.reducedMotionQuery.matches;

    const handler =
      applyReducedMotionState;

    if (
      typeof STATE.reducedMotionQuery
        .addEventListener === "function"
    ) {
      addListener(
        STATE.reducedMotionQuery,
        "change",
        handler
      );
    } else if (
      typeof STATE.reducedMotionQuery
        .addListener === "function"
    ) {
      STATE.reducedMotionQuery.addListener(
        handler
      );

      STATE.listeners.push(() => {
        STATE.reducedMotionQuery.removeListener(
          handler
        );
      });
    }
  }

  function initializeVisibilityObservers() {
    const fronts =
      toArray(
        document.querySelectorAll(
          SELECTORS.front
        )
      );

    if (
      "IntersectionObserver" in window
    ) {
      const intersectionObserver =
        new IntersectionObserver(
          () => {
            refreshDashboardActivity();
          },
          {
            root: null,

            threshold: [
              0,
              0.05,
              0.25
            ]
          }
        );

      for (
        const front
        of fronts
      ) {
        intersectionObserver.observe(
          front
        );
      }

      addObserver(
        intersectionObserver
      );
    }

    const mutationTargets =
      new Set([
        STATE.root,
        ...fronts
      ]);

    const mutationObserver =
      new MutationObserver(
        () => {
          refreshDashboardActivity();
        }
      );

    for (
      const target
      of mutationTargets
    ) {
      if (!target) {
        continue;
      }

      mutationObserver.observe(
        target,
        {
          attributes:
            true,

          attributeFilter: [
            "hidden",
            "inert",
            ATTRIBUTES.frontState,
            "data-showroom-state",
            "data-showroom-active-front"
          ]
        }
      );
    }

    addObserver(
      mutationObserver
    );

    addListener(
      window,
      "showroom:front-changed",
      refreshDashboardActivity
    );

    addListener(
      window,
      "pageshow",
      refreshDashboardActivity
    );
  }

  function exposePublicApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        getState() {
          return createReceiptPayload(
            "state-requested",
            {
              selectedGauges:
                toArray(
                  STATE.dashboards.values()
                ).map(
                  (record) => ({
                    dashboardId:
                      record.id,

                    gaugeId:
                      record.selectedGauge
                        ? getGaugeId(
                            record.selectedGauge
                          )
                        : null
                  })
                ),

              selectedRegions:
                toArray(
                  STATE.compositionGauges.values()
                ).map(
                  (record) => ({
                    compositionId:
                      record.id,

                    regionId:
                      record.selectedRegion
                        ? normalizeText(
                            record.selectedRegion.getAttribute(
                              "data-region-id"
                            )
                          )
                        : null
                  })
                ),

              selectedInformationTabs:
                toArray(
                  STATE.informationGroups.values()
                ).map(
                  (record) => ({
                    informationGroupId:
                      record.id,

                    tabId:
                      record.selectedTab
                        ? normalizeText(
                            record.selectedTab.getAttribute(
                              "data-information-tab-id"
                            )
                          )
                        : null
                  })
                )
            }
          );
        },

        refresh() {
          refreshDashboardActivity();

          return publishReceipt(
            "manual-refresh"
          );
        },

        selectGauge(
          dashboardId,
          gaugeId,
          options = {}
        ) {
          const record =
            toArray(
              STATE.dashboards.values()
            ).find(
              (candidate) =>
                candidate.id ===
                dashboardId
            );

          if (!record) {
            return false;
          }

          const gauge =
            record.gauges.find(
              (candidate) =>
                getGaugeId(
                  candidate
                ) === gaugeId
            );

          return selectGauge(
            record,
            gauge,
            options
          );
        },

        selectCompositionRegion(
          compositionId,
          regionId,
          options = {}
        ) {
          const record =
            toArray(
              STATE.compositionGauges.values()
            ).find(
              (candidate) =>
                candidate.id ===
                compositionId
            );

          if (!record) {
            return false;
          }

          const region =
            record.regions.find(
              (candidate) =>
                normalizeText(
                  candidate.getAttribute(
                    "data-region-id"
                  )
                ) === regionId
            );

          return selectCompositionRegion(
            record,
            region,
            options
          );
        },

        selectInformationTab(
          tabId,
          options = {}
        ) {
          for (
            const record
            of STATE.informationGroups.values()
          ) {
            const tab =
              record.tabs.find(
                (candidate) =>
                  normalizeText(
                    candidate.getAttribute(
                      "data-information-tab-id"
                    )
                  ) === tabId
              );

            if (tab) {
              return selectInformationTab(
                record,
                tab,
                options
              );
            }
          }

          return false;
        },

        dispose
      });

    Object.defineProperty(
      window,
      "SHOWROOM_GAUGES",
      {
        configurable:
          true,

        enumerable:
          false,

        writable:
          false,

        value:
          api
      }
    );
  }

  function initialize() {
    if (
      STATE.initialized ||
      STATE.disposed
    ) {
      return;
    }

    try {
      STATE.root =
        document.querySelector(
          SELECTORS.root
        );

      STATE.receipt =
        document.querySelector(
          SELECTORS.receipt
        );

      if (!STATE.root) {
        throw new Error(
          "Showroom root was not found."
        );
      }

      initializeReducedMotion();

      const dashboards =
        toArray(
          document.querySelectorAll(
            SELECTORS.dashboard
          )
        );

      const compositionGauges =
        toArray(
          document.querySelectorAll(
            SELECTORS.compositionGauge
          )
        );

      const informationGroups =
        toArray(
          document.querySelectorAll(
            SELECTORS.informationTabs
          )
        );

      dashboards.forEach(
        (dashboard, index) => {
          try {
            initializeDashboard(
              dashboard,
              index
            );
          } catch (error) {
            reportRecoverableError(
              "dashboard-initialization",
              error,
              {
                dashboardId:
                  normalizeText(
                    dashboard.getAttribute(
                      "data-gauge-dashboard-id"
                    )
                  ) || null
              }
            );
          }
        }
      );

      compositionGauges.forEach(
        (container, index) => {
          try {
            initializeCompositionGauge(
              container,
              index
            );
          } catch (error) {
            reportRecoverableError(
              "composition-initialization",
              error,
              {
                compositionId:
                  normalizeText(
                    container.getAttribute(
                      "data-composition-id"
                    )
                  ) || null
              }
            );
          }
        }
      );

      informationGroups.forEach(
        (container, index) => {
          try {
            initializeInformationTabs(
              container,
              index
            );
          } catch (error) {
            reportRecoverableError(
              "information-tabs-initialization",
              error,
              {
                informationGroupId:
                  normalizeText(
                    container.getAttribute(
                      "data-information-tabs-id"
                    )
                  ) || null
              }
            );
          }
        }
      );

      initializeVisibilityObservers();
      exposePublicApi();

      STATE.initialized =
        true;

      STATE.root.setAttribute(
        ATTRIBUTES.ready,
        "true"
      );

      STATE.root.setAttribute(
        ATTRIBUTES.state,
        "ready"
      );

      STATE.root.setAttribute(
        "data-showroom-gauges-reduced-motion",
        STATE.reducedMotion
          ? "true"
          : "false"
      );

      refreshDashboardActivity();

      publishReceipt(
        "ready",
        {
          dashboardIds:
            toArray(
              STATE.dashboards.values()
            ).map(
              (record) =>
                record.id
            ),

          compositionIds:
            toArray(
              STATE.compositionGauges.values()
            ).map(
              (record) =>
                record.id
            ),

          informationTabIds:
            toArray(
              STATE.informationGroups.values()
            ).flatMap(
              (record) =>
                record.tabs.map(
                  (tab) =>
                    normalizeText(
                      tab.getAttribute(
                        "data-information-tab-id"
                      )
                    )
                )
            )
        }
      );

      window.dispatchEvent(
        new CustomEvent(
          "showroom:gauges-ready",
          {
            detail: {
              contract:
                CONTRACT
            }
          }
        )
      );
    } catch (error) {
      reportFatalError(
        error
      );
    }
  }

  function dispose() {
    if (STATE.disposed) {
      return;
    }

    STATE.disposed =
      true;

    cancelTrackedFrames();

    for (
      const removeListener
      of STATE.listeners.splice(0)
    ) {
      try {
        removeListener();
      } catch {
        /* Disposal remains best-effort. */
      }
    }

    for (
      const observer
      of STATE.observers.splice(0)
    ) {
      try {
        observer.disconnect();
      } catch {
        /* Disposal remains best-effort. */
      }
    }

    for (
      const record
      of STATE.dashboards.values()
    ) {
      record.disposed =
        true;

      record.dashboard.setAttribute(
        ATTRIBUTES.motion,
        "paused"
      );
    }

    for (
      const record
      of STATE.compositionGauges.values()
    ) {
      record.disposed =
        true;
    }

    for (
      const record
      of STATE.informationGroups.values()
    ) {
      record.disposed =
        true;
    }

    if (STATE.root) {
      STATE.root.setAttribute(
        ATTRIBUTES.ready,
        "false"
      );

      STATE.root.setAttribute(
        ATTRIBUTES.state,
        "disposed"
      );
    }

    publishReceipt(
      "disposed"
    );

    try {
      delete window.SHOWROOM_GAUGES;
    } catch {
      /* Noncritical cleanup. */
    }
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      {
        once: true
      }
    );
  } else {
    initialize();
  }

  window.addEventListener(
    "pagehide",
    dispose,
    {
      once: true
    }
  );
})();
