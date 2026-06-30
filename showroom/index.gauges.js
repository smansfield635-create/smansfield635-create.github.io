/* TARGET FILE: /showroom/index.gauges.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2 */
/*
  Controlling markup:
  - /showroom/index.html
  - SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_STATIC_HTML_TNT_v8

  Historical filename:
  - /showroom/index.gauges.js

  Internal runtime role:
  - compact_selector_surface_coordinator

  Owned selector families:
  1. Gauge dashboard selectors.
  2. Diamond composition-region selectors.
  3. Information Front tabs.

  Shared selector behavior:
  - preserve exactly one active choice per valid selector group;
  - synchronize ARIA state and existing hidden panels;
  - maintain roving keyboard focus;
  - reflect bounded active identifiers;
  - normalize malformed initial selection state;
  - preserve focus without moving the document viewport;
  - isolate failures to the affected selector surface;
  - publish bounded readiness, issue, state, restoration, and disposal receipts.

  Transactional initialization order:
  1. Validate the surface.
  2. Construct the local record.
  3. Normalize the initial selection.
  4. Apply the initial selection state.
  5. Commit the record to its STATE map.
  6. Bind listeners.
  7. Increment the initialized count.

  Composition compatibility contract:
  - HTML authors all five composition records;
  - each record is read only from direct authored control children;
  - one existing shared composition-detail surface is preserved;
  - only its designated index, title, and description text nodes may change;
  - assignments use textContent only;
  - no markup is interpreted, created, replaced, relocated, or removed;
  - the entire composition surface is held when any required record,
    identifier, target, count, or uniqueness condition fails.

  Does not own:
  - page-level front selection;
  - page navigation or hard navigation;
  - constellation stars, clusters, crystals, compositor, or gestures;
  - Compass state or navigation;
  - Mirrorland Window state;
  - Diamond rendering, camera, controls, or lifecycle;
  - gauge values, gauge labels, or gauge descriptions;
  - Information Front content;
  - general page text mutation;
  - numeric roll-up;
  - decorative animation lifecycle;
  - front visibility observation;
  - runtime reduced-motion handling;
  - disclosure state outside these selector surfaces;
  - markup construction or missing-surface repair.
*/

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2";

  const PAGE_CONTRACT =
    "SHOWROOM_MIRRORLAND_NARRATIVE_CONSTELLATION_STATIC_HTML_TNT_v8";

  const ROLE =
    "compact_selector_surface_coordinator";

  const PUBLIC_API_NAME =
    "SHOWROOM_GAUGES";

  const PRIVATE_CONTROLLER_NAME =
    "__SHOWROOM_GAUGES_CONTROLLER__";

  const ISSUE_LIMIT =
    24;

  const EXPECTED_COMPOSITION_REGION_COUNT =
    5;

  const EVENTS = Object.freeze({
    receipt:
      "showroom:gauges-receipt",

    ready:
      "showroom:gauges-ready",

    restored:
      "showroom:gauges-restored",

    disposed:
      "showroom:gauges-disposed"
  });

  const SELECTORS = Object.freeze({
    root:
      "[data-showroom-root]",

    receipt:
      "[data-showroom-gauges-receipt]",

    dashboard:
      "[data-showroom-gauge-dashboard]",

    gauge:
      "[data-showroom-gauge]",

    sharedGaugeDetails:
      "[data-showroom-gauge-details]",

    gaugeDetail:
      "[data-showroom-gauge-detail]",

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

    selectedGauge:
      "data-selected-gauge",

    activeGaugeDetail:
      "data-active-gauge-detail",

    selectedRegion:
      "data-selected-region",

    activeCompositionRegion:
      "data-active-composition-region",

    compositionState:
      "data-showroom-composition-state",

    activeInformationTab:
      "data-active-information-tab",

    rootActiveInformationTab:
      "data-showroom-active-information-tab",

    gaugeSelected:
      "data-gauge-selected",

    regionSelected:
      "data-region-selected",

    informationTabSelected:
      "data-information-tab-selected"
  });

  const ISSUE_CODES = Object.freeze({
    initializationFailure:
      "INITIALIZATION_FAILURE",

    surfaceInitializationFailure:
      "SURFACE_INITIALIZATION_FAILURE",

    initialStateNormalized:
      "INITIAL_STATE_NORMALIZED",

    focusRestorationFailure:
      "FOCUS_RESTORATION_FAILURE",

    duplicateInstallation:
      "DUPLICATE_INSTALLATION"
  });

  const STATE = {
    root: null,
    receipt: null,

    dashboards: new Map(),
    compositionGroups: new Map(),
    informationGroups: new Map(),

    listeners: [],

    issues: [],
    issueCount: 0,
    droppedIssueCount: 0,

    discovered: {
      dashboards: 0,
      compositionGroups: 0,
      informationGroups: 0
    },

    initializedCounts: {
      dashboards: 0,
      compositionGroups: 0,
      informationGroups: 0
    },

    heldCounts: {
      dashboards: 0,
      compositionGroups: 0,
      informationGroups: 0
    },

    publicApi: null,
    privateController: null,

    initialized: false,
    disposed: false,
    fatalError: null,
    lastReceipt: null
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

  function isControlAvailable(control) {
    return Boolean(
      control &&
      control.isConnected &&
      !control.hidden &&
      !control.disabled &&
      control.getAttribute("aria-disabled") !== "true"
    );
  }

  function getLocallyOwnedControls(
    container,
    controlSelector,
    ownerSelector
  ) {
    return toArray(
      container.querySelectorAll(
        controlSelector
      )
    ).filter(
      (control) =>
        control.closest(
          ownerSelector
        ) === container
    );
  }

  function getLocallyOwnedElements(
    container,
    elementSelector,
    ownerSelector
  ) {
    return toArray(
      container.querySelectorAll(
        elementSelector
      )
    ).filter(
      (element) =>
        element.closest(
          ownerSelector
        ) === container
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

  function serializeError(error) {
    return Object.freeze({
      name:
        error instanceof Error
          ? error.name
          : "Error",

      message:
        error instanceof Error
          ? error.message
          : String(error)
    });
  }

  function addIssue(
    code,
    scope,
    surfaceId,
    message
  ) {
    const issue = Object.freeze({
      code:
        normalizeText(code) ||
        ISSUE_CODES.surfaceInitializationFailure,

      scope:
        normalizeText(scope) ||
        "unknown",

      surfaceId:
        normalizeText(surfaceId) ||
        null,

      message:
        normalizeText(message) ||
        "Unspecified issue."
    });

    STATE.issueCount += 1;

    if (
      STATE.issues.length <
      ISSUE_LIMIT
    ) {
      STATE.issues.push(issue);
    } else {
      STATE.droppedIssueCount += 1;
    }

    return issue;
  }

  function recordErrorIssue(
    code,
    scope,
    surfaceId,
    error
  ) {
    const serialized =
      serializeError(error);

    return addIssue(
      code,
      scope,
      surfaceId,
      serialized.message
    );
  }

  function getRuntimeState() {
    if (STATE.disposed) {
      return "disposed";
    }

    if (STATE.fatalError) {
      return "failed";
    }

    const initializedTotal =
      STATE.initializedCounts.dashboards +
      STATE.initializedCounts.compositionGroups +
      STATE.initializedCounts.informationGroups;

    const heldTotal =
      STATE.heldCounts.dashboards +
      STATE.heldCounts.compositionGroups +
      STATE.heldCounts.informationGroups;

    if (
      initializedTotal === 0 &&
      heldTotal > 0
    ) {
      return "held";
    }

    if (
      STATE.issueCount > 0
    ) {
      return "ready-with-issues";
    }

    return "ready";
  }

  function setRootRuntimeState() {
    if (!STATE.root) {
      return;
    }

    const runtimeState =
      getRuntimeState();

    STATE.root.setAttribute(
      ATTRIBUTES.state,
      runtimeState
    );

    STATE.root.setAttribute(
      ATTRIBUTES.ready,
      (
        runtimeState === "ready" ||
        runtimeState === "ready-with-issues"
      )
        ? "true"
        : "false"
    );
  }

  function getGaugeId(gauge) {
    return normalizeText(
      gauge &&
      gauge.getAttribute(
        "data-gauge-id"
      )
    );
  }

  function getRegionId(region) {
    return normalizeText(
      region &&
      region.getAttribute(
        "data-region-id"
      )
    );
  }

  function getInformationTabId(tab) {
    return normalizeText(
      tab &&
      tab.getAttribute(
        "data-information-tab-id"
      )
    );
  }

  function getActiveGaugeIds() {
    return toArray(
      STATE.dashboards.values()
    ).map((record) => Object.freeze({
      dashboardId:
        record.id,

      gaugeId:
        record.selectedGauge
          ? getGaugeId(
              record.selectedGauge
            )
          : null
    }));
  }

  function getActiveCompositionRegionIds() {
    return toArray(
      STATE.compositionGroups.values()
    ).map((record) => Object.freeze({
      compositionId:
        record.id,

      regionId:
        record.selectedRegion
          ? getRegionId(
              record.selectedRegion
            )
          : null
    }));
  }

  function getActiveInformationTabIds() {
    return toArray(
      STATE.informationGroups.values()
    ).map((record) => Object.freeze({
      informationGroupId:
        record.id,

      tabId:
        record.selectedTab
          ? getInformationTabId(
              record.selectedTab
            )
          : null
    }));
  }

  function createReceipt(
    event,
    context = {}
  ) {
    return Object.freeze({
      contract:
        CONTRACT,

      pageContract:
        PAGE_CONTRACT,

      role:
        ROLE,

      event:
        normalizeText(event) ||
        "unspecified",

      timestamp:
        nowIso(),

      runtimeState:
        getRuntimeState(),

      initialized:
        STATE.initialized,

      disposed:
        STATE.disposed,

      discovered:
        Object.freeze({
          ...STATE.discovered
        }),

      initializedSurfaces:
        Object.freeze({
          ...STATE.initializedCounts
        }),

      heldSurfaces:
        Object.freeze({
          ...STATE.heldCounts
        }),

      activeGaugeIds:
        Object.freeze(
          getActiveGaugeIds()
        ),

      activeCompositionRegionIds:
        Object.freeze(
          getActiveCompositionRegionIds()
        ),

      activeInformationTabIds:
        Object.freeze(
          getActiveInformationTabIds()
        ),

      issueCount:
        STATE.issueCount,

      retainedIssueCount:
        STATE.issues.length,

      droppedIssueCount:
        STATE.droppedIssueCount,

      issueLimit:
        ISSUE_LIMIT,

      issues:
        Object.freeze(
          STATE.issues.slice()
        ),

      fatalError:
        STATE.fatalError
          ? serializeError(
              STATE.fatalError
            )
          : null,

      context:
        Object.freeze({
          ...context
        })
    });
  }

  function dispatch(
    eventName,
    detail
  ) {
    window.dispatchEvent(
      new CustomEvent(
        eventName,
        {
          detail
        }
      )
    );
  }

  function publishReceipt(
    event,
    context = {}
  ) {
    setRootRuntimeState();

    const payload =
      createReceipt(
        event,
        context
      );

    STATE.lastReceipt =
      payload;

    if (STATE.receipt) {
      const serialized =
        JSON.stringify(payload);

      STATE.receipt.value =
        serialized;

      STATE.receipt.textContent =
        serialized;
    }

    dispatch(
      EVENTS.receipt,
      payload
    );

    return payload;
  }

  function getScrollableAncestors(element) {
    const records = [];

    let current =
      element
        ? element.parentElement
        : null;

    while (current) {
      const style =
        window.getComputedStyle(current);

      const overflowX =
        style.overflowX;

      const overflowY =
        style.overflowY;

      const scrollableX =
        (
          overflowX === "auto" ||
          overflowX === "scroll"
        ) &&
        current.scrollWidth >
        current.clientWidth;

      const scrollableY =
        (
          overflowY === "auto" ||
          overflowY === "scroll"
        ) &&
        current.scrollHeight >
        current.clientHeight;

      if (
        scrollableX ||
        scrollableY
      ) {
        records.push({
          element:
            current,

          left:
            current.scrollLeft,

          top:
            current.scrollTop
        });
      }

      current =
        current.parentElement;
    }

    return records;
  }

  function restoreScrollPositions(
    windowX,
    windowY,
    ancestorRecords
  ) {
    for (
      const record
      of ancestorRecords
    ) {
      record.element.scrollLeft =
        record.left;

      record.element.scrollTop =
        record.top;
    }

    window.scrollTo(
      windowX,
      windowY
    );
  }

  function focusWithoutScroll(element) {
    if (
      !element ||
      typeof element.focus !== "function"
    ) {
      return false;
    }

    const windowX =
      window.scrollX;

    const windowY =
      window.scrollY;

    const ancestorRecords =
      getScrollableAncestors(
        element
      );

    try {
      element.focus({
        preventScroll: true
      });
    } catch {
      try {
        element.focus();
      } catch (error) {
        recordErrorIssue(
          ISSUE_CODES.focusRestorationFailure,
          "focus",
          element.id || null,
          error
        );

        return false;
      }
    }

    restoreScrollPositions(
      windowX,
      windowY,
      ancestorRecords
    );

    window.requestAnimationFrame(() => {
      restoreScrollPositions(
        windowX,
        windowY,
        ancestorRecords
      );
    });

    return true;
  }

  function resolveControlledElement(
    control,
    attributeName = "aria-controls"
  ) {
    if (!control) {
      return null;
    }

    const id =
      normalizeText(
        control.getAttribute(
          attributeName
        )
      );

    if (!id) {
      return null;
    }

    return document.getElementById(
      id
    );
  }

  function findAvailableIndex(
    controls,
    startIndex,
    direction
  ) {
    if (
      controls.length === 0
    ) {
      return -1;
    }

    for (
      let step = 1;
      step <= controls.length;
      step += 1
    ) {
      const index =
        (
          startIndex +
          direction * step +
          controls.length
        ) %
        controls.length;

      if (
        isControlAvailable(
          controls[index]
        )
      ) {
        return index;
      }
    }

    return -1;
  }

  function firstAvailableControl(controls) {
    return (
      controls.find(
        isControlAvailable
      ) || null
    );
  }

  function normalizeInitialSelection(
    controls,
    isSelected,
    scope,
    surfaceId
  ) {
    const available =
      controls.filter(
        isControlAvailable
      );

    if (
      available.length === 0
    ) {
      throw new Error(
        `Selector surface "${surfaceId}" contains no available controls.`
      );
    }

    const selected =
      available.filter(
        isSelected
      );

    if (
      selected.length === 1
    ) {
      return selected[0];
    }

    const normalized =
      selected[0] ||
      available[0];

    addIssue(
      ISSUE_CODES.initialStateNormalized,
      scope,
      surfaceId,
      selected.length === 0
        ? "No valid initial selection was present; the first available control was selected."
        : "Multiple initial selections were present; the first valid selected control was retained."
    );

    return normalized;
  }

  function ensureUniqueIdentifier(
    identifier,
    usedIdentifiers,
    typeLabel,
    surfaceId
  ) {
    if (!identifier) {
      throw new Error(
        `${typeLabel} in "${surfaceId}" is missing its required identifier.`
      );
    }

    if (
      usedIdentifiers.has(
        identifier
      )
    ) {
      throw new Error(
        `${typeLabel} identifier "${identifier}" is duplicated in "${surfaceId}".`
      );
    }

    usedIdentifiers.add(
      identifier
    );
  }

  function getDashboardRecordFromGauge(
    gauge
  ) {
    const dashboard =
      gauge
        ? gauge.closest(
            SELECTORS.dashboard
          )
        : null;

    return dashboard
      ? STATE.dashboards.get(
          dashboard
        ) || null
      : null;
  }

  function selectGauge(
    record,
    gauge,
    options = {}
  ) {
    if (
      !record ||
      record.disposed ||
      record.held ||
      !isControlAvailable(gauge)
    ) {
      return false;
    }

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

      candidate.tabIndex =
        selected ? 0 : -1;

      candidate.toggleAttribute(
        ATTRIBUTES.gaugeSelected,
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
      getGaugeId(
        gauge
      );

    record.dashboard.setAttribute(
      ATTRIBUTES.selectedGauge,
      gaugeId
    );

    record.sharedDetails.setAttribute(
      ATTRIBUTES.activeGaugeDetail,
      gaugeId
    );

    if (options.focus) {
      focusWithoutScroll(
        gauge
      );
    }

    if (
      options.announce !== false
    ) {
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

    if (
      currentIndex < 0
    ) {
      return false;
    }

    const nextIndex =
      findAvailableIndex(
        record.gauges,
        currentIndex,
        direction
      );

    if (
      nextIndex < 0
    ) {
      return false;
    }

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

    if (
      !record ||
      record.held
    ) {
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

      case "Home": {
        const first =
          firstAvailableControl(
            record.gauges
          );

        if (first) {
          event.preventDefault();

          selectGauge(
            record,
            first,
            {
              focus: true
            }
          );
        }

        break;
      }

      case "End": {
        const last =
          firstAvailableControl(
            record.gauges
              .slice()
              .reverse()
          );

        if (last) {
          event.preventDefault();

          selectGauge(
            record,
            last,
            {
              focus: true
            }
          );
        }

        break;
      }

      default:
        break;
    }
  }

  function validateGaugeDashboard(
    dashboard,
    id
  ) {
    const gauges =
      getLocallyOwnedControls(
        dashboard,
        SELECTORS.gauge,
        SELECTORS.dashboard
      );

    if (
      gauges.length === 0
    ) {
      throw new Error(
        `Gauge dashboard "${id}" contains no locally owned gauges.`
      );
    }

    const sharedDetailSurfaces =
      getLocallyOwnedElements(
        dashboard,
        SELECTORS.sharedGaugeDetails,
        SELECTORS.dashboard
      );

    if (
      sharedDetailSurfaces.length !== 1
    ) {
      throw new Error(
        `Gauge dashboard "${id}" requires exactly one local shared-detail surface; ${sharedDetailSurfaces.length} were found.`
      );
    }

    const sharedDetails =
      sharedDetailSurfaces[0];

    const detailByGauge =
      new Map();

    const usedGaugeIds =
      new Set();

    const usedDetails =
      new Set();

    for (
      const gauge
      of gauges
    ) {
      const gaugeId =
        getGaugeId(
          gauge
        );

      ensureUniqueIdentifier(
        gaugeId,
        usedGaugeIds,
        "Gauge",
        id
      );

      const detail =
        resolveControlledElement(
          gauge
        );

      if (!detail) {
        throw new Error(
          `Gauge "${gaugeId}" in "${id}" has no valid aria-controls target.`
        );
      }

      if (
        !detail.matches(
          SELECTORS.gaugeDetail
        )
      ) {
        throw new Error(
          `Gauge "${gaugeId}" in "${id}" controls an element that is not a gauge detail.`
        );
      }

      if (
        detail.closest(
          SELECTORS.dashboard
        ) !== dashboard
      ) {
        throw new Error(
          `Gauge "${gaugeId}" in "${id}" controls a detail owned by another dashboard.`
        );
      }

      if (
        !sharedDetails.contains(
          detail
        )
      ) {
        throw new Error(
          `Gauge "${gaugeId}" in "${id}" controls a detail outside its local shared-detail surface.`
        );
      }

      if (
        usedDetails.has(
          detail
        )
      ) {
        throw new Error(
          `Gauge dashboard "${id}" assigns the same detail panel to more than one gauge.`
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
        detailId !== gaugeId
      ) {
        throw new Error(
          `Gauge "${gaugeId}" does not match detail identifier "${detailId}" in "${id}".`
        );
      }

      usedDetails.add(
        detail
      );

      detailByGauge.set(
        gauge,
        detail
      );
    }

    return Object.freeze({
      gauges,
      sharedDetails,
      detailByGauge
    });
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

    const validated =
      validateGaugeDashboard(
        dashboard,
        id
      );

    const record = {
      id,
      dashboard,

      gauges:
        validated.gauges,

      sharedDetails:
        validated.sharedDetails,

      detailByGauge:
        validated.detailByGauge,

      selectedGauge:
        null,

      held:
        false,

      disposed:
        false
    };

    const initialGauge =
      normalizeInitialSelection(
        record.gauges,
        (gauge) =>
          gauge.getAttribute(
            "aria-expanded"
          ) === "true",
        "gauge-dashboard",
        id
      );

    selectGauge(
      record,
      initialGauge,
      {
        announce: false
      }
    );

    STATE.dashboards.set(
      dashboard,
      record
    );

    for (
      const gauge
      of record.gauges
    ) {
      addListener(
        gauge,
        "click",
        () => {
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

    STATE.initializedCounts.dashboards +=
      1;

    return record;
  }

  function readDirectCompositionChild(
    region,
    selector
  ) {
    const child =
      region.querySelector(
        selector
      );

    if (
      !child ||
      child.parentElement !== region
    ) {
      return "";
    }

    return normalizeText(
      child.textContent
    );
  }

  function readCompositionRecord(region) {
    const regionId =
      getRegionId(
        region
      );

    const index =
      readDirectCompositionChild(
        region,
        ":scope > span"
      );

    const title =
      readDirectCompositionChild(
        region,
        ":scope > strong"
      );

    const description =
      readDirectCompositionChild(
        region,
        ":scope > small"
      );

    if (
      !regionId ||
      !index ||
      !title ||
      !description
    ) {
      throw new Error(
        `Composition region "${regionId || "unknown"}" is missing a required authored identifier, index, title, or description.`
      );
    }

    return Object.freeze({
      regionId,
      index,
      title,
      description
    });
  }

  function synchronizeCompositionDetail(
    surface,
    record
  ) {
    surface.index.textContent =
      record.index;

    surface.title.textContent =
      record.title;

    surface.description.textContent =
      record.description;
  }

  function selectCompositionRegion(
    record,
    region,
    options = {}
  ) {
    if (
      !record ||
      record.disposed ||
      record.held ||
      !isControlAvailable(region)
    ) {
      return false;
    }

    const compositionRecord =
      record.recordByRegion.get(
        region
      );

    if (!compositionRecord) {
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

      candidate.tabIndex =
        selected ? 0 : -1;

      candidate.toggleAttribute(
        ATTRIBUTES.regionSelected,
        selected
      );
    }

    record.selectedRegion =
      region;

    record.container.setAttribute(
      ATTRIBUTES.selectedRegion,
      compositionRecord.regionId
    );

    record.detail.element.setAttribute(
      ATTRIBUTES.activeCompositionRegion,
      compositionRecord.regionId
    );

    synchronizeCompositionDetail(
      record.detail,
      compositionRecord
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

          regionId:
            compositionRecord.regionId
        }
      );
    }

    return true;
  }

  function selectAdjacentCompositionRegion(
    record,
    currentRegion,
    direction
  ) {
    const currentIndex =
      record.regions.indexOf(
        currentRegion
      );

    if (
      currentIndex < 0
    ) {
      return false;
    }

    const nextIndex =
      findAvailableIndex(
        record.regions,
        currentIndex,
        direction
      );

    if (
      nextIndex < 0
    ) {
      return false;
    }

    return selectCompositionRegion(
      record,
      record.regions[nextIndex],
      {
        focus: true
      }
    );
  }

  function handleCompositionKeydown(
    event,
    record,
    region
  ) {
    if (
      !record ||
      record.held
    ) {
      return;
    }

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();

        selectAdjacentCompositionRegion(
          record,
          region,
          1
        );
        break;

      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();

        selectAdjacentCompositionRegion(
          record,
          region,
          -1
        );
        break;

      case "Home": {
        const first =
          firstAvailableControl(
            record.regions
          );

        if (first) {
          event.preventDefault();

          selectCompositionRegion(
            record,
            first,
            {
              focus: true
            }
          );
        }

        break;
      }

      case "End": {
        const last =
          firstAvailableControl(
            record.regions
              .slice()
              .reverse()
          );

        if (last) {
          event.preventDefault();

          selectCompositionRegion(
            record,
            last,
            {
              focus: true
            }
          );
        }

        break;
      }

      default:
        break;
    }
  }

  function validateCompositionGroup(
    container,
    id
  ) {
    const regions =
      getLocallyOwnedControls(
        container,
        SELECTORS.compositionRegion,
        SELECTORS.compositionGauge
      );

    if (
      regions.length !==
      EXPECTED_COMPOSITION_REGION_COUNT
    ) {
      throw new Error(
        `Composition surface "${id}" requires exactly ${EXPECTED_COMPOSITION_REGION_COUNT} locally owned controls; ${regions.length} were found.`
      );
    }

    const detailElements =
      getLocallyOwnedElements(
        container,
        SELECTORS.compositionDetail,
        SELECTORS.compositionGauge
      );

    if (
      detailElements.length !== 1
    ) {
      throw new Error(
        `Composition surface "${id}" requires exactly one local shared detail surface; ${detailElements.length} were found.`
      );
    }

    const detailElement =
      detailElements[0];

    const indexTargets =
      toArray(
        detailElement.querySelectorAll(
          SELECTORS.compositionDetailIndex
        )
      );

    const titleTargets =
      toArray(
        detailElement.querySelectorAll(
          SELECTORS.compositionDetailTitle
        )
      );

    const descriptionTargets =
      toArray(
        detailElement.querySelectorAll(
          SELECTORS.compositionDetailDescription
        )
      );

    if (
      indexTargets.length !== 1 ||
      titleTargets.length !== 1 ||
      descriptionTargets.length !== 1
    ) {
      throw new Error(
        `Composition surface "${id}" requires exactly one index, title, and description projection target.`
      );
    }

    const usedRegionIds =
      new Set();

    const recordByRegion =
      new Map();

    for (
      const region
      of regions
    ) {
      const compositionRecord =
        readCompositionRecord(
          region
        );

      ensureUniqueIdentifier(
        compositionRecord.regionId,
        usedRegionIds,
        "Composition region",
        id
      );

      recordByRegion.set(
        region,
        compositionRecord
      );
    }

    return Object.freeze({
      regions,

      recordByRegion,

      detail:
        Object.freeze({
          element:
            detailElement,

          index:
            indexTargets[0],

          title:
            titleTargets[0],

          description:
            descriptionTargets[0]
        })
    });
  }

  function initializeCompositionGroup(
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

    const validated =
      validateCompositionGroup(
        container,
        id
      );

    const record = {
      id,
      container,

      regions:
        validated.regions,

      recordByRegion:
        validated.recordByRegion,

      detail:
        validated.detail,

      selectedRegion:
        null,

      held:
        false,

      disposed:
        false
    };

    const initialRegion =
      normalizeInitialSelection(
        record.regions,
        (region) =>
          region.getAttribute(
            "aria-pressed"
          ) === "true",
        "composition-group",
        id
      );

    selectCompositionRegion(
      record,
      initialRegion,
      {
        announce: false
      }
    );

    STATE.compositionGroups.set(
      container,
      record
    );

    for (
      const region
      of record.regions
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
          handleCompositionKeydown(
            event,
            record,
            region
          );
        }
      );
    }

    container.setAttribute(
      ATTRIBUTES.compositionState,
      "ready"
    );

    STATE.initializedCounts.compositionGroups +=
      1;

    return record;
  }

  function selectInformationTab(
    record,
    tab,
    options = {}
  ) {
    if (
      !record ||
      record.disposed ||
      record.held ||
      !isControlAvailable(tab)
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
        ATTRIBUTES.informationTabSelected,
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
      getInformationTabId(
        tab
      );

    record.container.setAttribute(
      ATTRIBUTES.activeInformationTab,
      tabId
    );

    if (STATE.root) {
      STATE.root.setAttribute(
        ATTRIBUTES.rootActiveInformationTab,
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

    if (
      currentIndex < 0
    ) {
      return false;
    }

    const nextIndex =
      findAvailableIndex(
        record.tabs,
        currentIndex,
        direction
      );

    if (
      nextIndex < 0
    ) {
      return false;
    }

    return selectInformationTab(
      record,
      record.tabs[nextIndex],
      {
        focus: true
      }
    );
  }

  function handleInformationKeydown(
    event,
    record,
    tab
  ) {
    if (
      !record ||
      record.held
    ) {
      return;
    }

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

      case "Home": {
        const first =
          firstAvailableControl(
            record.tabs
          );

        if (first) {
          event.preventDefault();

          selectInformationTab(
            record,
            first,
            {
              focus: true
            }
          );
        }

        break;
      }

      case "End": {
        const last =
          firstAvailableControl(
            record.tabs
              .slice()
              .reverse()
          );

        if (last) {
          event.preventDefault();

          selectInformationTab(
            record,
            last,
            {
              focus: true
            }
          );
        }

        break;
      }

      default:
        break;
    }
  }

  function validateInformationGroup(
    container,
    id
  ) {
    const tabs =
      getLocallyOwnedControls(
        container,
        SELECTORS.informationTab,
        SELECTORS.informationTabs
      );

    if (
      tabs.length === 0
    ) {
      throw new Error(
        `Information group "${id}" contains no locally owned tabs.`
      );
    }

    const panelByTab =
      new Map();

    const usedTabIds =
      new Set();

    const usedPanels =
      new Set();

    for (
      const tab
      of tabs
    ) {
      const tabId =
        getInformationTabId(
          tab
        );

      ensureUniqueIdentifier(
        tabId,
        usedTabIds,
        "Information tab",
        id
      );

      const panel =
        resolveControlledElement(
          tab
        );

      if (!panel) {
        throw new Error(
          `Information tab "${tabId}" in "${id}" has no valid aria-controls target.`
        );
      }

      if (
        !panel.matches(
          SELECTORS.informationPanel
        )
      ) {
        throw new Error(
          `Information tab "${tabId}" in "${id}" controls an element that is not an information panel.`
        );
      }

      if (
        panel.closest(
          SELECTORS.informationTabs
        ) !== container
      ) {
        throw new Error(
          `Information tab "${tabId}" in "${id}" controls a panel owned by another information group.`
        );
      }

      if (
        usedPanels.has(
          panel
        )
      ) {
        throw new Error(
          `Information group "${id}" assigns one panel to more than one tab.`
        );
      }

      const panelId =
        normalizeText(
          panel.getAttribute(
            "data-information-panel-id"
          )
        );

      if (
        panelId &&
        panelId !== tabId
      ) {
        throw new Error(
          `Information tab "${tabId}" does not match panel identifier "${panelId}" in "${id}".`
        );
      }

      usedPanels.add(
        panel
      );

      panelByTab.set(
        tab,
        panel
      );
    }

    return Object.freeze({
      tabs,
      panelByTab
    });
  }

  function initializeInformationGroup(
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

    const validated =
      validateInformationGroup(
        container,
        id
      );

    const record = {
      id,
      container,

      tabs:
        validated.tabs,

      panelByTab:
        validated.panelByTab,

      selectedTab:
        null,

      held:
        false,

      disposed:
        false
    };

    const initialTab =
      normalizeInitialSelection(
        record.tabs,
        (tab) =>
          tab.getAttribute(
            "aria-selected"
          ) === "true",
        "information-group",
        id
      );

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

    for (
      const tab
      of record.tabs
    ) {
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
          handleInformationKeydown(
            event,
            record,
            tab
          );
        }
      );
    }

    STATE.initializedCounts.informationGroups +=
      1;

    return record;
  }

  function synchronizeDashboardRecord(record) {
    if (
      !record ||
      record.disposed ||
      record.held
    ) {
      return false;
    }

    const selected =
      record.selectedGauge &&
      isControlAvailable(
        record.selectedGauge
      )
        ? record.selectedGauge
        : firstAvailableControl(
            record.gauges
          );

    return selected
      ? selectGauge(
          record,
          selected,
          {
            announce: false
          }
        )
      : false;
  }

  function synchronizeCompositionRecord(record) {
    if (
      !record ||
      record.disposed ||
      record.held
    ) {
      return false;
    }

    const selected =
      record.selectedRegion &&
      isControlAvailable(
        record.selectedRegion
      )
        ? record.selectedRegion
        : firstAvailableControl(
            record.regions
          );

    return selected
      ? selectCompositionRegion(
          record,
          selected,
          {
            announce: false
          }
        )
      : false;
  }

  function synchronizeInformationRecord(record) {
    if (
      !record ||
      record.disposed ||
      record.held
    ) {
      return false;
    }

    const selected =
      record.selectedTab &&
      isControlAvailable(
        record.selectedTab
      )
        ? record.selectedTab
        : firstAvailableControl(
            record.tabs
          );

    return selected
      ? selectInformationTab(
          record,
          selected,
          {
            announce: false
          }
        )
      : false;
  }

  function refreshAll() {
    for (
      const record
      of STATE.dashboards.values()
    ) {
      synchronizeDashboardRecord(
        record
      );
    }

    for (
      const record
      of STATE.compositionGroups.values()
    ) {
      synchronizeCompositionRecord(
        record
      );
    }

    for (
      const record
      of STATE.informationGroups.values()
    ) {
      synchronizeInformationRecord(
        record
      );
    }

    return publishReceipt(
      "manual-refresh"
    );
  }

  function findDashboardById(
    dashboardId
  ) {
    return toArray(
      STATE.dashboards.values()
    ).find(
      (record) =>
        record.id === dashboardId
    ) || null;
  }

  function findCompositionGroupById(
    compositionId
  ) {
    return toArray(
      STATE.compositionGroups.values()
    ).find(
      (record) =>
        record.id === compositionId
    ) || null;
  }

  function findInformationGroupById(
    informationGroupId
  ) {
    return toArray(
      STATE.informationGroups.values()
    ).find(
      (record) =>
        record.id === informationGroupId
    ) || null;
  }

  function findUniqueInformationTabMatch(
    tabId
  ) {
    const matches = [];

    for (
      const record
      of STATE.informationGroups.values()
    ) {
      const tab =
        record.tabs.find(
          (candidate) =>
            getInformationTabId(
              candidate
            ) === tabId
        );

      if (tab) {
        matches.push({
          record,
          tab
        });
      }
    }

    return matches.length === 1
      ? matches[0]
      : null;
  }

  function exposePublicApi() {
    const api =
      Object.freeze({
        contract:
          CONTRACT,

        pageContract:
          PAGE_CONTRACT,

        role:
          ROLE,

        status() {
          return getRuntimeState();
        },

        getReceipt() {
          return (
            STATE.lastReceipt ||
            createReceipt(
              "receipt-requested"
            )
          );
        },

        refresh:
          refreshAll,

        selectGauge(
          dashboardId,
          gaugeId,
          options = {}
        ) {
          const record =
            findDashboardById(
              normalizeText(
                dashboardId
              )
            );

          if (!record) {
            return false;
          }

          const gauge =
            record.gauges.find(
              (candidate) =>
                getGaugeId(
                  candidate
                ) ===
                normalizeText(
                  gaugeId
                )
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
            findCompositionGroupById(
              normalizeText(
                compositionId
              )
            );

          if (!record) {
            return false;
          }

          const region =
            record.regions.find(
              (candidate) =>
                getRegionId(
                  candidate
                ) ===
                normalizeText(
                  regionId
                )
            );

          return selectCompositionRegion(
            record,
            region,
            options
          );
        },

        selectInformationTab(
          informationGroupId,
          tabId,
          options = {}
        ) {
          /*
            Preferred signature:
            selectInformationTab(groupId, tabId, options)

            Compatibility overload:
            selectInformationTab(tabId, options)

            The compatibility overload succeeds only when exactly one
            initialized information group contains the requested tab ID.
          */

          if (
            typeof tabId === "object" &&
            tabId !== null
          ) {
            const compatibilityTabId =
              normalizeText(
                informationGroupId
              );

            const match =
              findUniqueInformationTabMatch(
                compatibilityTabId
              );

            return match
              ? selectInformationTab(
                  match.record,
                  match.tab,
                  tabId
                )
              : false;
          }

          if (
            typeof tabId === "undefined"
          ) {
            const compatibilityTabId =
              normalizeText(
                informationGroupId
              );

            const match =
              findUniqueInformationTabMatch(
                compatibilityTabId
              );

            return match
              ? selectInformationTab(
                  match.record,
                  match.tab,
                  {}
                )
              : false;
          }

          const record =
            findInformationGroupById(
              normalizeText(
                informationGroupId
              )
            );

          if (!record) {
            return false;
          }

          const normalizedTabId =
            normalizeText(
              tabId
            );

          const tab =
            record.tabs.find(
              (candidate) =>
                getInformationTabId(
                  candidate
                ) ===
                normalizedTabId
            );

          return selectInformationTab(
            record,
            tab,
            options
          );
        },

        dispose
      });

    const privateController =
      Object.freeze({
        contract:
          CONTRACT,

        role:
          ROLE,

        dispose
      });

    STATE.publicApi =
      api;

    STATE.privateController =
      privateController;

    Object.defineProperty(
      window,
      PUBLIC_API_NAME,
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

    Object.defineProperty(
      window,
      PRIVATE_CONTROLLER_NAME,
      {
        configurable:
          true,

        enumerable:
          false,

        writable:
          false,

        value:
          privateController
      }
    );
  }

  function disposePreviousInstallation() {
    const previous =
      window[
        PRIVATE_CONTROLLER_NAME
      ];

    if (
      previous &&
      typeof previous.dispose === "function"
    ) {
      try {
        previous.dispose();
      } catch (error) {
        recordErrorIssue(
          ISSUE_CODES.duplicateInstallation,
          "installation",
          null,
          error
        );
      }
    }
  }

  function initializeSurfaceCollection(
    elements,
    initializer,
    scope,
    idAttribute,
    heldCounterName
  ) {
    elements.forEach(
      (element, index) => {
        try {
          initializer(
            element,
            index
          );
        } catch (error) {
          STATE.heldCounts[
            heldCounterName
          ] += 1;

          const surfaceId =
            normalizeText(
              element.getAttribute(
                idAttribute
              )
            ) || null;

          if (
            scope === "composition-group"
          ) {
            element.setAttribute(
              ATTRIBUTES.compositionState,
              "held"
            );
          }

          recordErrorIssue(
            ISSUE_CODES.surfaceInitializationFailure,
            scope,
            surfaceId,
            error
          );
        }
      }
    );
  }

  function handlePageShow(event) {
    if (
      !event.persisted ||
      STATE.disposed
    ) {
      return;
    }

    for (
      const record
      of STATE.dashboards.values()
    ) {
      synchronizeDashboardRecord(
        record
      );
    }

    for (
      const record
      of STATE.compositionGroups.values()
    ) {
      synchronizeCompositionRecord(
        record
      );
    }

    for (
      const record
      of STATE.informationGroups.values()
    ) {
      synchronizeInformationRecord(
        record
      );
    }

    const payload =
      publishReceipt(
        "restored"
      );

    dispatch(
      EVENTS.restored,
      payload
    );
  }

  function handlePageHide(event) {
    if (!event.persisted) {
      dispose();
    }
  }

  function initialize() {
    if (
      STATE.initialized ||
      STATE.disposed
    ) {
      return;
    }

    try {
      disposePreviousInstallation();

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

      const dashboards =
        toArray(
          document.querySelectorAll(
            SELECTORS.dashboard
          )
        );

      const compositionGroups =
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

      STATE.discovered.dashboards =
        dashboards.length;

      STATE.discovered.compositionGroups =
        compositionGroups.length;

      STATE.discovered.informationGroups =
        informationGroups.length;

      initializeSurfaceCollection(
        dashboards,
        initializeDashboard,
        "gauge-dashboard",
        "data-gauge-dashboard-id",
        "dashboards"
      );

      initializeSurfaceCollection(
        compositionGroups,
        initializeCompositionGroup,
        "composition-group",
        "data-composition-id",
        "compositionGroups"
      );

      initializeSurfaceCollection(
        informationGroups,
        initializeInformationGroup,
        "information-group",
        "data-information-tabs-id",
        "informationGroups"
      );

      exposePublicApi();

      addListener(
        window,
        "pageshow",
        handlePageShow
      );

      addListener(
        window,
        "pagehide",
        handlePageHide
      );

      STATE.initialized =
        true;

      setRootRuntimeState();

      const runtimeState =
        getRuntimeState();

      const initializationEvent =
        runtimeState === "ready"
          ? "ready"
          : runtimeState === "ready-with-issues"
            ? "ready-with-issues"
            : runtimeState;

      const payload =
        publishReceipt(
          initializationEvent
        );

      if (
        runtimeState === "ready" ||
        runtimeState === "ready-with-issues"
      ) {
        dispatch(
          EVENTS.ready,
          payload
        );
      }
    } catch (error) {
      STATE.fatalError =
        error instanceof Error
          ? error
          : new Error(
              String(error)
            );

      addIssue(
        ISSUE_CODES.initializationFailure,
        "initialization",
        null,
        STATE.fatalError.message
      );

      setRootRuntimeState();

      publishReceipt(
        "failed"
      );
    }
  }

  function dispose() {
    if (STATE.disposed) {
      return;
    }

    STATE.disposed =
      true;

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
      const record
      of STATE.dashboards.values()
    ) {
      record.disposed =
        true;
    }

    for (
      const record
      of STATE.compositionGroups.values()
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

    setRootRuntimeState();

    const payload =
      publishReceipt(
        "disposed"
      );

    dispatch(
      EVENTS.disposed,
      payload
    );

    if (
      window[
        PUBLIC_API_NAME
      ] === STATE.publicApi
    ) {
      try {
        delete window[
          PUBLIC_API_NAME
        ];
      } catch {
        /* Noncritical compatibility cleanup. */
      }
    }

    if (
      window[
        PRIVATE_CONTROLLER_NAME
      ] === STATE.privateController
    ) {
      try {
        delete window[
          PRIVATE_CONTROLLER_NAME
        ];
      } catch {
        /* Noncritical private-surface cleanup. */
      }
    }
  }

  if (
    document.readyState === "loading"
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
})();
