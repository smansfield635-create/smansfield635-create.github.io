/* TARGET FILE: /showroom/index.gauges.js */
/* TNT FULL-FILE REPLACEMENT */
/* SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2 */

(() => {
  "use strict";

  const CONTRACT =
    "SHOWROOM_MIRRORLAND_COMPACT_GAUGE_DASHBOARD_TNT_v2";

  const VERSION =
    "2.0.0";

  const EXPECTED = Object.freeze({
    dashboards: 4,
    compositions: 1,
    informationGroups: 1
  });

  const ROOT_STATES = Object.freeze({
    STATIC: "static",
    READY: "ready",
    READY_WITH_ISSUES: "ready-with-issues",
    HELD: "held",
    FAILED: "failed",
    DISPOSED: "disposed"
  });

  const LOCAL_STATES = Object.freeze({
    STATIC: "static",
    READY: "ready",
    HELD: "held",
    DISPOSED: "disposed"
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

    gaugeDetail:
      "[data-showroom-gauge-detail]",

    composition:
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

    information:
      "[data-showroom-information-tabs]",

    informationTab:
      "[data-showroom-information-tab]",

    informationPanel:
      "[data-showroom-information-panel]"
  });

  const ATTRIBUTES = Object.freeze({
    rootState:
      "data-showroom-gauges-state",

    rootReady:
      "data-showroom-gauges-ready",

    rootActiveInformationTab:
      "data-showroom-active-information-tab",

    dashboardId:
      "data-gauge-dashboard-id",

    dashboardState:
      "data-gauge-dashboard-state",

    gaugeId:
      "data-gauge-id",

    gaugeDetailId:
      "data-gauge-detail-id",

    compositionId:
      "data-composition-id",

    compositionState:
      "data-showroom-composition-state",

    regionId:
      "data-region-id",

    informationId:
      "data-information-tabs-id",

    informationState:
      "data-showroom-information-state",

    informationTabId:
      "data-information-tab-id",

    informationPanelId:
      "data-information-panel-id"
  });

  const runtime = {
    initialized: false,
    disposed: false,
    held: false,
    root: null,
    receipt: null,
    rootSnapshot: null,
    dashboards: [],
    compositions: [],
    informationGroups: [],
    lifecycleListeners: [],
    issues: [],
    receiptSequence: 0,
    api: null
  };

  function toArray(value) {
    return Array.prototype.slice.call(value || []);
  }

  function isElement(value) {
    return value instanceof Element;
  }

  function normalizeText(value) {
    return String(value == null ? "" : value)
      .replace(/\s+/g, " ")
      .trim();
  }

  function readRequiredAttribute(element, attributeName, label) {
    if (!isElement(element)) {
      throw new TypeError(`${label} is not an Element.`);
    }

    const value = normalizeText(element.getAttribute(attributeName));

    if (!value) {
      throw new Error(
        `${label} is missing required attribute ${attributeName}.`
      );
    }

    return value;
  }

  function captureAttribute(element, attributeName) {
    return Object.freeze({
      element,
      attributeName,
      present: element.hasAttribute(attributeName),
      value: element.getAttribute(attributeName)
    });
  }

  function restoreAttribute(snapshot) {
    if (!snapshot || !isElement(snapshot.element)) {
      return;
    }

    if (snapshot.present) {
      snapshot.element.setAttribute(
        snapshot.attributeName,
        snapshot.value == null ? "" : snapshot.value
      );
    } else {
      snapshot.element.removeAttribute(snapshot.attributeName);
    }
  }

  function captureHidden(element) {
    return Object.freeze({
      element,
      hidden: Boolean(element.hidden)
    });
  }

  function restoreHidden(snapshot) {
    if (!snapshot || !isElement(snapshot.element)) {
      return;
    }

    snapshot.element.hidden = snapshot.hidden;
  }

  function captureText(element) {
    return Object.freeze({
      element,
      textContent: element.textContent
    });
  }

  function restoreText(snapshot) {
    if (!snapshot || !isElement(snapshot.element)) {
      return;
    }

    snapshot.element.textContent = snapshot.textContent;
  }

  function addListener(record, target, type, listener, options) {
    target.addEventListener(type, listener, options);

    record.listeners.push({
      target,
      type,
      listener,
      options
    });
  }

  function removeListeners(record) {
    if (!record || !Array.isArray(record.listeners)) {
      return;
    }

    for (const entry of record.listeners.splice(0)) {
      try {
        entry.target.removeEventListener(
          entry.type,
          entry.listener,
          entry.options
        );
      } catch {
        /* Listener removal must remain best-effort. */
      }
    }
  }

  function addLifecycleListener(target, type, listener, options) {
    target.addEventListener(type, listener, options);

    runtime.lifecycleListeners.push({
      target,
      type,
      listener,
      options
    });
  }

  function removeLifecycleListeners() {
    for (const entry of runtime.lifecycleListeners.splice(0)) {
      try {
        entry.target.removeEventListener(
          entry.type,
          entry.listener,
          entry.options
        );
      } catch {
        /* Lifecycle cleanup must remain best-effort. */
      }
    }
  }

  function createIssue(scope, identity, message) {
    const issue = Object.freeze({
      scope,
      identity: identity || "",
      message: normalizeText(message)
    });

    runtime.issues.push(issue);

    return issue;
  }

  function publishReceipt(event, detail = {}) {
    if (!runtime.receipt) {
      return;
    }

    runtime.receiptSequence += 1;

    const payload = {
      contract: CONTRACT,
      version: VERSION,
      sequence: runtime.receiptSequence,
      event,
      rootState:
        runtime.root?.getAttribute(ATTRIBUTES.rootState) || "",
      ready:
        runtime.root?.getAttribute(ATTRIBUTES.rootReady) === "true",
      dashboards: {
        discovered: runtime.dashboards.length,
        committed: runtime.dashboards.filter(
          (record) => record.committed
        ).length,
        held: runtime.dashboards.filter(
          (record) => record.held
        ).length
      },
      compositions: {
        discovered: runtime.compositions.length,
        committed: runtime.compositions.filter(
          (record) => record.committed
        ).length,
        held: runtime.compositions.filter(
          (record) => record.held
        ).length
      },
      informationGroups: {
        discovered: runtime.informationGroups.length,
        committed: runtime.informationGroups.filter(
          (record) => record.committed
        ).length,
        held: runtime.informationGroups.filter(
          (record) => record.held
        ).length
      },
      issueCount: runtime.issues.length,
      detail
    };

    runtime.receipt.textContent = JSON.stringify(payload);
  }

  function captureRootSnapshot(root) {
    return Object.freeze({
      rootState:
        captureAttribute(root, ATTRIBUTES.rootState),

      rootReady:
        captureAttribute(root, ATTRIBUTES.rootReady),

      activeInformationTab:
        captureAttribute(
          root,
          ATTRIBUTES.rootActiveInformationTab
        )
    });
  }

  function restoreRootSnapshot() {
    if (!runtime.rootSnapshot) {
      return;
    }

    restoreAttribute(runtime.rootSnapshot.rootState);
    restoreAttribute(runtime.rootSnapshot.rootReady);
    restoreAttribute(runtime.rootSnapshot.activeInformationTab);
  }

  function setRootState(state) {
    if (!runtime.root) {
      return;
    }

    runtime.root.setAttribute(
      ATTRIBUTES.rootState,
      state
    );

    runtime.root.setAttribute(
      ATTRIBUTES.rootReady,
      state === ROOT_STATES.READY ||
      state === ROOT_STATES.READY_WITH_ISSUES
        ? "true"
        : "false"
    );
  }

  function getAllRecords() {
    return [
      ...runtime.dashboards,
      ...runtime.compositions,
      ...runtime.informationGroups
    ];
  }

  function reflectRootState() {
    if (!runtime.root || runtime.disposed) {
      return;
    }

    if (runtime.held) {
      setRootState(ROOT_STATES.HELD);
      return;
    }

    const allRecords = getAllRecords();
    const committed = allRecords.filter(
      (record) => record.committed
    );
    const held = allRecords.filter(
      (record) => record.held
    );

    const discoveredCounts = {
      dashboards: runtime.dashboards.length,
      compositions: runtime.compositions.length,
      informationGroups: runtime.informationGroups.length
    };

    const exactCounts =
      discoveredCounts.dashboards === EXPECTED.dashboards &&
      discoveredCounts.compositions === EXPECTED.compositions &&
      discoveredCounts.informationGroups ===
        EXPECTED.informationGroups;

    const zeroDiscovery =
      discoveredCounts.dashboards === 0 &&
      discoveredCounts.compositions === 0 &&
      discoveredCounts.informationGroups === 0;

    if (zeroDiscovery || committed.length === 0) {
      setRootState(ROOT_STATES.HELD);
      return;
    }

    if (
      held.length > 0 ||
      runtime.issues.length > 0 ||
      !exactCounts ||
      committed.length !== allRecords.length
    ) {
      setRootState(ROOT_STATES.READY_WITH_ISSUES);
      return;
    }

    setRootState(ROOT_STATES.READY);
  }

  function assertUniqueValues(values, label) {
    const seen = new Set();

    for (const value of values) {
      if (seen.has(value)) {
        throw new Error(
          `${label} contains duplicate value "${value}".`
        );
      }

      seen.add(value);
    }
  }

  function findInitialIndex(
    elements,
    predicate,
    fallbackIndex = 0
  ) {
    const index = elements.findIndex(predicate);

    return index >= 0
      ? index
      : fallbackIndex;
  }

  function focusElement(element) {
    try {
      element.focus({
        preventScroll: true
      });
    } catch {
      element.focus();
    }
  }

  function nextIndexForKey(key, currentIndex, length) {
    if (length <= 0) {
      return currentIndex;
    }

    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        return (currentIndex + 1) % length;

      case "ArrowLeft":
      case "ArrowUp":
        return (currentIndex - 1 + length) % length;

      case "Home":
        return 0;

      case "End":
        return length - 1;

      default:
        return currentIndex;
    }
  }

  function isNavigationKey(key) {
    return (
      key === "ArrowRight" ||
      key === "ArrowDown" ||
      key === "ArrowLeft" ||
      key === "ArrowUp" ||
      key === "Home" ||
      key === "End"
    );
  }

  function createDashboardRecord(container) {
    const id = readRequiredAttribute(
      container,
      ATTRIBUTES.dashboardId,
      "Gauge dashboard"
    );

    const controls = toArray(
      container.querySelectorAll(SELECTORS.gauge)
    );

    const details = toArray(
      container.querySelectorAll(SELECTORS.gaugeDetail)
    );

    if (controls.length === 0) {
      throw new Error(
        `Gauge dashboard "${id}" has no controls.`
      );
    }

    if (details.length === 0) {
      throw new Error(
        `Gauge dashboard "${id}" has no detail articles.`
      );
    }

    const controlIds = controls.map((control) =>
      readRequiredAttribute(
        control,
        ATTRIBUTES.gaugeId,
        `Gauge control in dashboard "${id}"`
      )
    );

    const detailIds = details.map((detail) =>
      readRequiredAttribute(
        detail,
        ATTRIBUTES.gaugeDetailId,
        `Gauge detail in dashboard "${id}"`
      )
    );

    assertUniqueValues(
      controlIds,
      `Gauge dashboard "${id}" control IDs`
    );

    assertUniqueValues(
      detailIds,
      `Gauge dashboard "${id}" detail IDs`
    );

    const detailById = new Map(
      details.map((detail, index) => [
        detailIds[index],
        detail
      ])
    );

    for (let index = 0; index < controls.length; index += 1) {
      const control = controls[index];
      const controlId = controlIds[index];
      const controlledId = normalizeText(
        control.getAttribute("aria-controls")
      );

      if (!controlledId) {
        throw new Error(
          `Gauge "${controlId}" in dashboard "${id}" ` +
          "has no aria-controls target."
        );
      }

      const detail = detailById.get(controlId);

      if (!detail) {
        throw new Error(
          `Gauge "${controlId}" in dashboard "${id}" ` +
          "has no matching detail article."
        );
      }

      if (detail.id !== controlledId) {
        throw new Error(
          `Gauge "${controlId}" in dashboard "${id}" ` +
          `controls "${controlledId}" but its matching detail ID is ` +
          `"${detail.id}".`
        );
      }
    }

    if (controls.length !== details.length) {
      throw new Error(
        `Gauge dashboard "${id}" has ${controls.length} controls ` +
        `and ${details.length} details.`
      );
    }

    const selectedIndex = findInitialIndex(
      controls,
      (control) =>
        control.getAttribute("aria-expanded") === "true"
    );

    return {
      kind: "dashboard",
      id,
      container,
      controls,
      details,
      controlIds,
      detailIds,
      detailById,
      selectedIndex,
      listeners: [],
      committed: false,
      held: false,
      disposed: false,
      snapshot: {
        containerState:
          captureAttribute(
            container,
            ATTRIBUTES.dashboardState
          ),

        controls: controls.map((control) => ({
          ariaExpanded:
            captureAttribute(control, "aria-expanded"),

          tabindex:
            captureAttribute(control, "tabindex")
        })),

        details: details.map((detail) => ({
          hidden:
            captureHidden(detail),

          ariaHidden:
            captureAttribute(detail, "aria-hidden")
        }))
      }
    };
  }

  function restoreDashboard(record) {
    removeListeners(record);

    restoreAttribute(
      record.snapshot.containerState
    );

    record.snapshot.controls.forEach((snapshot) => {
      restoreAttribute(snapshot.ariaExpanded);
      restoreAttribute(snapshot.tabindex);
    });

    record.snapshot.details.forEach((snapshot) => {
      restoreHidden(snapshot.hidden);
      restoreAttribute(snapshot.ariaHidden);
    });

    record.committed = false;
  }

  function applyDashboardSelection(
    record,
    nextIndex,
    options = {}
  ) {
    if (
      record.disposed ||
      record.held ||
      nextIndex < 0 ||
      nextIndex >= record.controls.length
    ) {
      return false;
    }

    record.selectedIndex = nextIndex;

    record.controls.forEach((control, index) => {
      const selected =
        index === nextIndex;

      control.setAttribute(
        "aria-expanded",
        selected ? "true" : "false"
      );

      control.setAttribute(
        "tabindex",
        selected ? "0" : "-1"
      );

      const detail =
        record.detailById.get(record.controlIds[index]);

      if (detail) {
        detail.hidden = !selected;

        detail.setAttribute(
          "aria-hidden",
          selected ? "false" : "true"
        );
      }
    });

    if (options.focus) {
      focusElement(
        record.controls[nextIndex]
      );
    }

    if (options.receipt !== false) {
      publishReceipt("dashboard-selection", {
        dashboardId: record.id,
        gaugeId: record.controlIds[nextIndex]
      });
    }

    return true;
  }

  function bindDashboard(record) {
    record.controls.forEach((control, index) => {
      addListener(
        record,
        control,
        "click",
        () => {
          applyDashboardSelection(
            record,
            index,
            {
              focus: false
            }
          );
        }
      );

      addListener(
        record,
        control,
        "keydown",
        (event) => {
          if (!isNavigationKey(event.key)) {
            return;
          }

          event.preventDefault();

          const nextIndex =
            nextIndexForKey(
              event.key,
              record.selectedIndex,
              record.controls.length
            );

          applyDashboardSelection(
            record,
            nextIndex,
            {
              focus: true
            }
          );
        }
      );
    });
  }

  function commitDashboard(record) {
    applyDashboardSelection(
      record,
      record.selectedIndex,
      {
        focus: false,
        receipt: false
      }
    );

    bindDashboard(record);

    record.container.setAttribute(
      ATTRIBUTES.dashboardState,
      LOCAL_STATES.READY
    );

    record.committed = true;
    record.held = false;
  }

  function holdDashboard(record) {
    if (record.disposed) {
      return;
    }

    record.held = true;

    record.container.setAttribute(
      ATTRIBUTES.dashboardState,
      LOCAL_STATES.HELD
    );
  }

  function resumeDashboard(record) {
    if (
      record.disposed ||
      !record.committed
    ) {
      return;
    }

    record.held = false;

    record.container.setAttribute(
      ATTRIBUTES.dashboardState,
      LOCAL_STATES.READY
    );

    applyDashboardSelection(
      record,
      record.selectedIndex,
      {
        focus: false,
        receipt: false
      }
    );
  }

  function createCompositionRecord(container) {
    const id = readRequiredAttribute(
      container,
      ATTRIBUTES.compositionId,
      "Composition group"
    );

    const regions = toArray(
      container.querySelectorAll(
        SELECTORS.compositionRegion
      )
    );

    if (regions.length === 0) {
      throw new Error(
        `Composition group "${id}" has no regions.`
      );
    }

    const regionIds = regions.map((region) =>
      readRequiredAttribute(
        region,
        ATTRIBUTES.regionId,
        `Composition region in "${id}"`
      )
    );

    assertUniqueValues(
      regionIds,
      `Composition group "${id}" region IDs`
    );

    const sources = regions.map((region, index) => {
      const directChildren =
        toArray(region.children);

      const indexNode =
        directChildren.find(
          (child) =>
            child.tagName.toLowerCase() === "span"
        );

      const titleNode =
        directChildren.find(
          (child) =>
            child.tagName.toLowerCase() === "strong"
        );

      const descriptionNode =
        directChildren.find(
          (child) =>
            child.tagName.toLowerCase() === "small"
        );

      if (
        !indexNode ||
        !titleNode ||
        !descriptionNode
      ) {
        throw new Error(
          `Composition region "${regionIds[index]}" in "${id}" ` +
          "must contain direct span, strong, and small children."
        );
      }

      const source = Object.freeze({
        index:
          normalizeText(indexNode.textContent),

        title:
          normalizeText(titleNode.textContent),

        description:
          normalizeText(descriptionNode.textContent)
      });

      if (
        !source.index ||
        !source.title ||
        !source.description
      ) {
        throw new Error(
          `Composition region "${regionIds[index]}" in "${id}" ` +
          "contains incomplete authored content."
        );
      }

      return source;
    });

    const detail =
      container.querySelector(
        SELECTORS.compositionDetail
      );

    const detailIndex =
      container.querySelector(
        SELECTORS.compositionDetailIndex
      );

    const detailTitle =
      container.querySelector(
        SELECTORS.compositionDetailTitle
      );

    const detailDescription =
      container.querySelector(
        SELECTORS.compositionDetailDescription
      );

    if (
      !detail ||
      !detailIndex ||
      !detailTitle ||
      !detailDescription
    ) {
      throw new Error(
        `Composition group "${id}" is missing its shared detail surface.`
      );
    }

    const selectedIndex = findInitialIndex(
      regions,
      (region) =>
        region.getAttribute("aria-pressed") === "true"
    );

    return {
      kind: "composition",
      id,
      container,
      regions,
      regionIds,
      sources,
      detail,
      detailIndex,
      detailTitle,
      detailDescription,
      selectedIndex,
      listeners: [],
      committed: false,
      held: false,
      disposed: false,
      snapshot: {
        containerState:
          captureAttribute(
            container,
            ATTRIBUTES.compositionState
          ),

        regions: regions.map((region) => ({
          ariaPressed:
            captureAttribute(region, "aria-pressed"),

          tabindex:
            captureAttribute(region, "tabindex")
        })),

        detailIndex:
          captureText(detailIndex),

        detailTitle:
          captureText(detailTitle),

        detailDescription:
          captureText(detailDescription)
      }
    };
  }

  function restoreComposition(record) {
    removeListeners(record);

    restoreAttribute(
      record.snapshot.containerState
    );

    record.snapshot.regions.forEach((snapshot) => {
      restoreAttribute(snapshot.ariaPressed);
      restoreAttribute(snapshot.tabindex);
    });

    restoreText(record.snapshot.detailIndex);
    restoreText(record.snapshot.detailTitle);
    restoreText(record.snapshot.detailDescription);

    record.committed = false;
  }

  function applyCompositionSelection(
    record,
    nextIndex,
    options = {}
  ) {
    if (
      record.disposed ||
      record.held ||
      nextIndex < 0 ||
      nextIndex >= record.regions.length
    ) {
      return false;
    }

    record.selectedIndex = nextIndex;

    record.regions.forEach((region, index) => {
      const selected =
        index === nextIndex;

      region.setAttribute(
        "aria-pressed",
        selected ? "true" : "false"
      );

      region.setAttribute(
        "tabindex",
        selected ? "0" : "-1"
      );
    });

    const source =
      record.sources[nextIndex];

    record.detailIndex.textContent =
      source.index;

    record.detailTitle.textContent =
      source.title;

    record.detailDescription.textContent =
      source.description;

    if (options.focus) {
      focusElement(
        record.regions[nextIndex]
      );
    }

    if (options.receipt !== false) {
      publishReceipt("composition-selection", {
        compositionId: record.id,
        regionId: record.regionIds[nextIndex]
      });
    }

    return true;
  }

  function bindComposition(record) {
    record.regions.forEach((region, index) => {
      addListener(
        record,
        region,
        "click",
        () => {
          applyCompositionSelection(
            record,
            index,
            {
              focus: false
            }
          );
        }
      );

      addListener(
        record,
        region,
        "keydown",
        (event) => {
          if (!isNavigationKey(event.key)) {
            return;
          }

          event.preventDefault();

          const nextIndex =
            nextIndexForKey(
              event.key,
              record.selectedIndex,
              record.regions.length
            );

          applyCompositionSelection(
            record,
            nextIndex,
            {
              focus: true
            }
          );
        }
      );
    });
  }

  function commitComposition(record) {
    applyCompositionSelection(
      record,
      record.selectedIndex,
      {
        focus: false,
        receipt: false
      }
    );

    bindComposition(record);

    record.container.setAttribute(
      ATTRIBUTES.compositionState,
      LOCAL_STATES.READY
    );

    record.committed = true;
    record.held = false;
  }

  function holdComposition(record) {
    if (record.disposed) {
      return;
    }

    record.held = true;

    record.container.setAttribute(
      ATTRIBUTES.compositionState,
      LOCAL_STATES.HELD
    );
  }

  function resumeComposition(record) {
    if (
      record.disposed ||
      !record.committed
    ) {
      return;
    }

    record.held = false;

    record.container.setAttribute(
      ATTRIBUTES.compositionState,
      LOCAL_STATES.READY
    );

    applyCompositionSelection(
      record,
      record.selectedIndex,
      {
        focus: false,
        receipt: false
      }
    );
  }

  function createInformationRecord(container) {
    const id = readRequiredAttribute(
      container,
      ATTRIBUTES.informationId,
      "Information group"
    );

    const tabs = toArray(
      container.querySelectorAll(
        SELECTORS.informationTab
      )
    );

    const panels = toArray(
      container.querySelectorAll(
        SELECTORS.informationPanel
      )
    );

    if (tabs.length === 0) {
      throw new Error(
        `Information group "${id}" has no tabs.`
      );
    }

    if (panels.length === 0) {
      throw new Error(
        `Information group "${id}" has no panels.`
      );
    }

    if (tabs.length !== panels.length) {
      throw new Error(
        `Information group "${id}" has ${tabs.length} tabs ` +
        `and ${panels.length} panels.`
      );
    }

    const tabIds = tabs.map((tab) =>
      readRequiredAttribute(
        tab,
        ATTRIBUTES.informationTabId,
        `Information tab in "${id}"`
      )
    );

    const panelIds = panels.map((panel) =>
      readRequiredAttribute(
        panel,
        ATTRIBUTES.informationPanelId,
        `Information panel in "${id}"`
      )
    );

    assertUniqueValues(
      tabIds,
      `Information group "${id}" tab IDs`
    );

    assertUniqueValues(
      panelIds,
      `Information group "${id}" panel IDs`
    );

    const panelById = new Map(
      panels.map((panel, index) => [
        panelIds[index],
        panel
      ])
    );

    tabs.forEach((tab, index) => {
      const tabId =
        tabIds[index];

      const controlledId =
        normalizeText(
          tab.getAttribute("aria-controls")
        );

      if (!controlledId) {
        throw new Error(
          `Information tab "${tabId}" in "${id}" ` +
          "has no aria-controls target."
        );
      }

      const panel =
        panelById.get(tabId);

      if (!panel) {
        throw new Error(
          `Information tab "${tabId}" in "${id}" ` +
          "has no matching panel."
        );
      }

      if (panel.id !== controlledId) {
        throw new Error(
          `Information tab "${tabId}" in "${id}" ` +
          `controls "${controlledId}" but its matching panel ID is ` +
          `"${panel.id}".`
        );
      }

      if (
        normalizeText(
          panel.getAttribute("aria-labelledby")
        ) !== tab.id
      ) {
        throw new Error(
          `Information panel "${panel.id}" in "${id}" ` +
          `is not labelled by tab "${tab.id}".`
        );
      }
    });

    const selectedIndex = findInitialIndex(
      tabs,
      (tab) =>
        tab.getAttribute("aria-selected") === "true"
    );

    return {
      kind: "information",
      id,
      container,
      tabs,
      panels,
      tabIds,
      panelIds,
      panelById,
      selectedIndex,
      listeners: [],
      committed: false,
      held: false,
      disposed: false,
      snapshot: {
        containerState:
          captureAttribute(
            container,
            ATTRIBUTES.informationState
          ),

        activeInformationTab:
          captureAttribute(
            runtime.root,
            ATTRIBUTES.rootActiveInformationTab
          ),

        tabs: tabs.map((tab) => ({
          ariaSelected:
            captureAttribute(tab, "aria-selected"),

          tabindex:
            captureAttribute(tab, "tabindex")
        })),

        panels: panels.map((panel) => ({
          hidden:
            captureHidden(panel),

          ariaHidden:
            captureAttribute(panel, "aria-hidden")
        }))
      }
    };
  }

  function restoreInformation(record) {
    removeListeners(record);

    restoreAttribute(
      record.snapshot.containerState
    );

    restoreAttribute(
      record.snapshot.activeInformationTab
    );

    record.snapshot.tabs.forEach((snapshot) => {
      restoreAttribute(snapshot.ariaSelected);
      restoreAttribute(snapshot.tabindex);
    });

    record.snapshot.panels.forEach((snapshot) => {
      restoreHidden(snapshot.hidden);
      restoreAttribute(snapshot.ariaHidden);
    });

    record.committed = false;
  }

  function applyInformationSelection(
    record,
    nextIndex,
    options = {}
  ) {
    if (
      record.disposed ||
      record.held ||
      nextIndex < 0 ||
      nextIndex >= record.tabs.length
    ) {
      return false;
    }

    record.selectedIndex = nextIndex;

    record.tabs.forEach((tab, index) => {
      const selected =
        index === nextIndex;

      tab.setAttribute(
        "aria-selected",
        selected ? "true" : "false"
      );

      tab.setAttribute(
        "tabindex",
        selected ? "0" : "-1"
      );

      const panel =
        record.panelById.get(record.tabIds[index]);

      if (panel) {
        panel.hidden = !selected;

        panel.setAttribute(
          "aria-hidden",
          selected ? "false" : "true"
        );
      }
    });

    runtime.root.setAttribute(
      ATTRIBUTES.rootActiveInformationTab,
      record.tabIds[nextIndex]
    );

    if (options.focus) {
      focusElement(
        record.tabs[nextIndex]
      );
    }

    if (options.receipt !== false) {
      publishReceipt("information-selection", {
        informationGroupId: record.id,
        tabId: record.tabIds[nextIndex]
      });
    }

    return true;
  }

  function bindInformation(record) {
    record.tabs.forEach((tab, index) => {
      addListener(
        record,
        tab,
        "click",
        () => {
          applyInformationSelection(
            record,
            index,
            {
              focus: false
            }
          );
        }
      );

      addListener(
        record,
        tab,
        "keydown",
        (event) => {
          if (!isNavigationKey(event.key)) {
            return;
          }

          event.preventDefault();

          const nextIndex =
            nextIndexForKey(
              event.key,
              record.selectedIndex,
              record.tabs.length
            );

          applyInformationSelection(
            record,
            nextIndex,
            {
              focus: true
            }
          );
        }
      );
    });
  }

  function commitInformation(record) {
    applyInformationSelection(
      record,
      record.selectedIndex,
      {
        focus: false,
        receipt: false
      }
    );

    bindInformation(record);

    record.container.setAttribute(
      ATTRIBUTES.informationState,
      LOCAL_STATES.READY
    );

    record.committed = true;
    record.held = false;
  }

  function holdInformation(record) {
    if (record.disposed) {
      return;
    }

    record.held = true;

    record.container.setAttribute(
      ATTRIBUTES.informationState,
      LOCAL_STATES.HELD
    );
  }

  function resumeInformation(record) {
    if (
      record.disposed ||
      !record.committed
    ) {
      return;
    }

    record.held = false;

    record.container.setAttribute(
      ATTRIBUTES.informationState,
      LOCAL_STATES.READY
    );

    applyInformationSelection(
      record,
      record.selectedIndex,
      {
        focus: false,
        receipt: false
      }
    );
  }

  function initializeDashboard(container) {
    let record = null;

    try {
      record =
        createDashboardRecord(container);

      runtime.dashboards.push(record);

      commitDashboard(record);

      publishReceipt("dashboard-ready", {
        dashboardId: record.id,
        controlCount: record.controls.length
      });
    } catch (error) {
      const identity =
        normalizeText(
          container.getAttribute(
            ATTRIBUTES.dashboardId
          )
        ) || "unknown";

      if (record) {
        restoreDashboard(record);
        record.held = true;

        record.container.setAttribute(
          ATTRIBUTES.dashboardState,
          LOCAL_STATES.HELD
        );
      } else {
        container.setAttribute(
          ATTRIBUTES.dashboardState,
          LOCAL_STATES.HELD
        );
      }

      createIssue(
        "dashboard",
        identity,
        error instanceof Error
          ? error.message
          : String(error)
      );

      publishReceipt("dashboard-held", {
        dashboardId: identity,
        reason:
          error instanceof Error
            ? error.message
            : String(error)
      });
    }
  }

  function initializeComposition(container) {
    let record = null;

    try {
      record =
        createCompositionRecord(container);

      runtime.compositions.push(record);

      commitComposition(record);

      publishReceipt("composition-ready", {
        compositionId: record.id,
        regionCount: record.regions.length
      });
    } catch (error) {
      const identity =
        normalizeText(
          container.getAttribute(
            ATTRIBUTES.compositionId
          )
        ) || "unknown";

      if (record) {
        restoreComposition(record);
        record.held = true;

        record.container.setAttribute(
          ATTRIBUTES.compositionState,
          LOCAL_STATES.HELD
        );
      } else {
        container.setAttribute(
          ATTRIBUTES.compositionState,
          LOCAL_STATES.HELD
        );
      }

      createIssue(
        "composition",
        identity,
        error instanceof Error
          ? error.message
          : String(error)
      );

      publishReceipt("composition-held", {
        compositionId: identity,
        reason:
          error instanceof Error
            ? error.message
            : String(error)
      });
    }
  }

  function initializeInformation(container) {
    let record = null;

    try {
      record =
        createInformationRecord(container);

      runtime.informationGroups.push(record);

      commitInformation(record);

      publishReceipt("information-ready", {
        informationGroupId: record.id,
        tabCount: record.tabs.length
      });
    } catch (error) {
      const identity =
        normalizeText(
          container.getAttribute(
            ATTRIBUTES.informationId
          )
        ) || "unknown";

      if (record) {
        restoreInformation(record);
        record.held = true;

        record.container.setAttribute(
          ATTRIBUTES.informationState,
          LOCAL_STATES.HELD
        );
      } else {
        container.setAttribute(
          ATTRIBUTES.informationState,
          LOCAL_STATES.HELD
        );
      }

      createIssue(
        "information",
        identity,
        error instanceof Error
          ? error.message
          : String(error)
      );

      publishReceipt("information-held", {
        informationGroupId: identity,
        reason:
          error instanceof Error
            ? error.message
            : String(error)
      });
    }
  }

  function validateExpectedCounts() {
    const counts = {
      dashboards: runtime.dashboards.length,
      compositions: runtime.compositions.length,
      informationGroups: runtime.informationGroups.length
    };

    if (counts.dashboards !== EXPECTED.dashboards) {
      createIssue(
        "cardinality",
        "dashboards",
        `Expected ${EXPECTED.dashboards} dashboards; ` +
        `discovered ${counts.dashboards}.`
      );
    }

    if (counts.compositions !== EXPECTED.compositions) {
      createIssue(
        "cardinality",
        "compositions",
        `Expected ${EXPECTED.compositions} composition group; ` +
        `discovered ${counts.compositions}.`
      );
    }

    if (
      counts.informationGroups !==
      EXPECTED.informationGroups
    ) {
      createIssue(
        "cardinality",
        "information-groups",
        `Expected ${EXPECTED.informationGroups} information group; ` +
        `discovered ${counts.informationGroups}.`
      );
    }
  }

  function holdRuntime(reason) {
    if (
      runtime.disposed ||
      runtime.held
    ) {
      return;
    }

    runtime.held = true;

    runtime.dashboards.forEach(
      holdDashboard
    );

    runtime.compositions.forEach(
      holdComposition
    );

    runtime.informationGroups.forEach(
      holdInformation
    );

    reflectRootState();

    publishReceipt("runtime-held", {
      reason:
        normalizeText(reason) || "unspecified"
    });
  }

  function resumeRuntime(reason) {
    if (
      runtime.disposed ||
      !runtime.held
    ) {
      return;
    }

    runtime.held = false;

    runtime.dashboards.forEach(
      resumeDashboard
    );

    runtime.compositions.forEach(
      resumeComposition
    );

    runtime.informationGroups.forEach(
      resumeInformation
    );

    reflectRootState();

    publishReceipt("runtime-resumed", {
      reason:
        normalizeText(reason) || "unspecified"
    });
  }

  function disposeRecord(record) {
    if (
      !record ||
      record.disposed
    ) {
      return;
    }

    try {
      switch (record.kind) {
        case "dashboard":
          restoreDashboard(record);

          record.container.setAttribute(
            ATTRIBUTES.dashboardState,
            LOCAL_STATES.DISPOSED
          );
          break;

        case "composition":
          restoreComposition(record);

          record.container.setAttribute(
            ATTRIBUTES.compositionState,
            LOCAL_STATES.DISPOSED
          );
          break;

        case "information":
          restoreInformation(record);

          record.container.setAttribute(
            ATTRIBUTES.informationState,
            LOCAL_STATES.DISPOSED
          );
          break;

        default:
          removeListeners(record);
      }
    } finally {
      record.held = false;
      record.committed = false;
      record.disposed = true;
    }
  }

  function disposeRuntime(reason = "manual") {
    if (runtime.disposed) {
      return;
    }

    const receiptTarget =
      runtime.receipt;

    for (const record of getAllRecords()) {
      disposeRecord(record);
    }

    removeLifecycleListeners();

    restoreRootSnapshot();

    if (runtime.root) {
      runtime.root.setAttribute(
        ATTRIBUTES.rootState,
        ROOT_STATES.DISPOSED
      );

      runtime.root.setAttribute(
        ATTRIBUTES.rootReady,
        "false"
      );
    }

    runtime.disposed = true;
    runtime.held = false;

    if (
      runtime.api &&
      window.ShowroomGauges === runtime.api
    ) {
      try {
        delete window.ShowroomGauges;
      } catch {
        window.ShowroomGauges = undefined;
      }
    }

    if (receiptTarget) {
      runtime.receipt = receiptTarget;

      publishReceipt("runtime-disposed", {
        reason:
          normalizeText(reason) || "manual"
      });
    }
  }

  function fatalRollback(error) {
    for (const record of getAllRecords()) {
      try {
        switch (record.kind) {
          case "dashboard":
            restoreDashboard(record);
            break;

          case "composition":
            restoreComposition(record);
            break;

          case "information":
            restoreInformation(record);
            break;

          default:
            removeListeners(record);
        }
      } catch {
        /* Continue restoring neighboring surfaces. */
      }
    }

    removeLifecycleListeners();
    restoreRootSnapshot();

    if (runtime.root) {
      setRootState(ROOT_STATES.FAILED);
    }

    createIssue(
      "runtime",
      CONTRACT,
      error instanceof Error
        ? error.message
        : String(error)
    );

    publishReceipt("runtime-failed", {
      reason:
        error instanceof Error
          ? error.message
          : String(error)
    });
  }

  function findDashboardRecord(dashboardId) {
    return runtime.dashboards.find(
      (record) =>
        record.id === dashboardId
    ) || null;
  }

  function findCompositionRecord(compositionId) {
    return runtime.compositions.find(
      (record) =>
        record.id === compositionId
    ) || null;
  }

  function findInformationRecord(informationId) {
    return runtime.informationGroups.find(
      (record) =>
        record.id === informationId
    ) || null;
  }

  function createPublicApi() {
    const api = Object.freeze({
      contract: CONTRACT,
      version: VERSION,

      getState() {
        return Object.freeze({
          rootState:
            runtime.root?.getAttribute(
              ATTRIBUTES.rootState
            ) || "",

          ready:
            runtime.root?.getAttribute(
              ATTRIBUTES.rootReady
            ) === "true",

          held:
            runtime.held,

          disposed:
            runtime.disposed,

          dashboards:
            runtime.dashboards.map(
              (record) =>
                Object.freeze({
                  id: record.id,
                  state:
                    record.container.getAttribute(
                      ATTRIBUTES.dashboardState
                    ) || "",
                  selectedGaugeId:
                    record.controlIds[
                      record.selectedIndex
                    ] || ""
                })
            ),

          compositions:
            runtime.compositions.map(
              (record) =>
                Object.freeze({
                  id: record.id,
                  state:
                    record.container.getAttribute(
                      ATTRIBUTES.compositionState
                    ) || "",
                  selectedRegionId:
                    record.regionIds[
                      record.selectedIndex
                    ] || ""
                })
            ),

          informationGroups:
            runtime.informationGroups.map(
              (record) =>
                Object.freeze({
                  id: record.id,
                  state:
                    record.container.getAttribute(
                      ATTRIBUTES.informationState
                    ) || "",
                  selectedTabId:
                    record.tabIds[
                      record.selectedIndex
                    ] || ""
                })
            ),

          issues:
            runtime.issues.slice()
        });
      },

      selectGauge(dashboardId, gaugeId, options = {}) {
        const record =
          findDashboardRecord(
            normalizeText(dashboardId)
          );

        if (!record) {
          return false;
        }

        const index =
          record.controlIds.indexOf(
            normalizeText(gaugeId)
          );

        if (index < 0) {
          return false;
        }

        return applyDashboardSelection(
          record,
          index,
          {
            focus:
              Boolean(options.focus)
          }
        );
      },

      selectComposition(
        compositionId,
        regionId,
        options = {}
      ) {
        const record =
          findCompositionRecord(
            normalizeText(compositionId)
          );

        if (!record) {
          return false;
        }

        const index =
          record.regionIds.indexOf(
            normalizeText(regionId)
          );

        if (index < 0) {
          return false;
        }

        return applyCompositionSelection(
          record,
          index,
          {
            focus:
              Boolean(options.focus)
          }
        );
      },

      selectInformation(
        informationId,
        tabId,
        options = {}
      ) {
        const record =
          findInformationRecord(
            normalizeText(informationId)
          );

        if (!record) {
          return false;
        }

        const index =
          record.tabIds.indexOf(
            normalizeText(tabId)
          );

        if (index < 0) {
          return false;
        }

        return applyInformationSelection(
          record,
          index,
          {
            focus:
              Boolean(options.focus)
          }
        );
      },

      hold(reason = "api") {
        holdRuntime(reason);
      },

      resume(reason = "api") {
        resumeRuntime(reason);
      },

      dispose(reason = "api") {
        disposeRuntime(reason);
      }
    });

    runtime.api = api;

    return api;
  }

  function bindLifecycle() {
    addLifecycleListener(
      window,
      "pagehide",
      (event) => {
        if (event.persisted) {
          holdRuntime("pagehide-bfcache");
          return;
        }

        disposeRuntime("pagehide");
      }
    );

    addLifecycleListener(
      window,
      "pageshow",
      (event) => {
        if (
          event.persisted &&
          !runtime.disposed
        ) {
          resumeRuntime("pageshow-bfcache");
        }
      }
    );
  }

  function initialize() {
    if (
      runtime.initialized ||
      runtime.disposed
    ) {
      return;
    }

    runtime.initialized = true;

    try {
      runtime.root =
        document.querySelector(
          SELECTORS.root
        );

      if (!runtime.root) {
        throw new Error(
          "Showroom gauge root was not found."
        );
      }

      runtime.receipt =
        document.querySelector(
          SELECTORS.receipt
        );

      runtime.rootSnapshot =
        captureRootSnapshot(
          runtime.root
        );

      setRootState(ROOT_STATES.STATIC);

      const dashboardContainers =
        toArray(
          document.querySelectorAll(
            SELECTORS.dashboard
          )
        );

      const compositionContainers =
        toArray(
          document.querySelectorAll(
            SELECTORS.composition
          )
        );

      const informationContainers =
        toArray(
          document.querySelectorAll(
            SELECTORS.information
          )
        );

      dashboardContainers.forEach(
        initializeDashboard
      );

      compositionContainers.forEach(
        initializeComposition
      );

      informationContainers.forEach(
        initializeInformation
      );

      validateExpectedCounts();
      reflectRootState();
      bindLifecycle();

      window.ShowroomGauges =
        createPublicApi();

      publishReceipt("runtime-ready", {
        expected: EXPECTED,
        discovered: {
          dashboards:
            runtime.dashboards.length,

          compositions:
            runtime.compositions.length,

          informationGroups:
            runtime.informationGroups.length
        }
      });
    } catch (error) {
      fatalRollback(error);
    }
  }

  if (document.readyState === "loading") {
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
