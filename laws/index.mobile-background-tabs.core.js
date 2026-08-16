/*
 * Laws root Rolodex responsive presentation continuity.
 * Presentation only. Preserves the accepted Compass, routes, content custody,
 * tablet depth axis, and desktop flow while enforcing local orbit custody.
 */

(() => {
  "use strict";

  const CONTRACT = "LAWS_ROOT_ROLODEX_RESPONSIVE_CONTINUITY_v5";
  const COMPASS_ORBIT = "O1";
  const DESTINATION_ORBIT = "O2";
  const TABLET_MEDIA = "(min-width: 781px) and (max-width: 1200px)";
  const MOBILE_MEDIA = "(max-width: 780px)";

  const ACTION_COPY = Object.freeze({
    "laws-governing-relationships": Object.freeze({ preview: "Preview laws", route: "Enter laws and relationships" }),
    "methods-models": Object.freeze({ preview: "Preview methods", route: "Enter methods and models" }),
    "scientific-law": Object.freeze({ preview: "Preview scientific law", route: "Enter scientific law" }),
    "evidence-sources": Object.freeze({ preview: "Preview evidence", route: "Enter evidence and sources" }),
    "applied-investigations": Object.freeze({ preview: "Preview investigations", route: "Enter applied investigations" }),
    "findings-boundaries": Object.freeze({ preview: "Preview findings", route: "Enter findings and boundaries" }),
    "admission-baseline": Object.freeze({ preview: "Preview baseline", route: "Enter admission and baseline" }),
    "forward-construction": Object.freeze({ preview: "Preview construction", route: "Enter forward construction" }),
    "reverse-audit": Object.freeze({ preview: "Preview reverse audit", route: "Enter reverse audit" }),
    "results-records": Object.freeze({ preview: "Preview results", route: "Enter results and records" })
  });

  let originSnapshot = null;
  let tabletMedia = null;
  let mobileMedia = null;
  let groupStage = null;
  let groupSwitcher = null;
  let groupSummary = null;
  let groupSummaryEyebrow = null;
  let groupSummaryTitle = null;
  let groupFields = [];
  let groupButtons = [];
  let activeGroupIndex = 0;
  let entryUserAction = false;
  let entryGuardActive = !globalThis.location.hash;

  function markEntryUserAction() {
    entryUserAction = true;
    entryGuardActive = false;
    document.documentElement.dataset.lawsPageEntryCustody = "user";
  }

  for (const type of ["pointerdown", "touchstart", "wheel"]) {
    globalThis.addEventListener(type, markEntryUserAction, { capture: true, passive: true, once: true });
  }
  globalThis.addEventListener("keydown", event => {
    if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) markEntryUserAction();
  }, { capture: true });

  function orbitSection() {
    return document.querySelector("[data-laws-root-rolodex-section]");
  }

  function markOrbitIdentity() {
    const hero = document.querySelector("[data-laws-experience-stage='hero']");
    const section = orbitSection();
    if (hero) hero.dataset.lawsOrbitId = COMPASS_ORBIT;
    if (section) section.dataset.lawsOrbitId = DESTINATION_ORBIT;
    document.documentElement.dataset.lawsDefaultEntryOrbit = COMPASS_ORBIT;
  }

  function enforceCompassEntry(reason = "entry") {
    if (!entryGuardActive || entryUserAction || globalThis.location.hash) return false;
    const hero = document.querySelector("[data-laws-experience-stage='hero']");
    if (!hero) return false;
    globalThis.scrollTo({ left: 0, top: 0, behavior: "instant" });
    document.documentElement.dataset.lawsPageEntryOrbit = COMPASS_ORBIT;
    document.documentElement.dataset.lawsPageEntryCustody = reason;
    return true;
  }

  function activeOrbitField(destinationId = "") {
    const section = orbitSection();
    if (!section) return null;
    if (destinationId) {
      const card = Array.from(section.querySelectorAll(".laws-rolodex-card[data-destination-id]")).find(node => node.dataset.destinationId === destinationId);
      if (card) return card.closest(".laws-rolodex-field[data-rolodex-id]");
    }
    return section.querySelector(".laws-rolodex-field[data-destination-stage-state='active']")
      || groupFields[activeGroupIndex]
      || section.querySelector(".laws-rolodex-field[data-rolodex-id]");
  }

  function captureOrigin(event) {
    const section = orbitSection();
    const destinationId = event?.detail?.destinationId || "";
    const field = activeOrbitField(destinationId);
    if (!section || !field) return;
    const rect = section.getBoundingClientRect();
    const carousel = globalThis.DGB_LAWS_DESTINATION_CAROUSEL;
    const carouselState = carousel?.getState?.(field.dataset.rolodexId || "") || null;
    const groupIndex = Math.max(0, groupFields.indexOf(field));
    const viewport = field.querySelector(".laws-rolodex-viewport");

    originSnapshot = Object.freeze({
      orbitId: DESTINATION_ORBIT,
      rolodexId: field.dataset.rolodexId || "",
      groupIndex,
      destinationId: carouselState?.destinationId || destinationId,
      carouselIndex: Number.isInteger(carouselState?.index)
        ? carouselState.index
        : Number(field.dataset.carouselIndex || 0),
      orbitViewportOffset: globalThis.scrollY - (globalThis.scrollY + rect.top),
      scrollX: globalThis.scrollX,
      viewportScrollLeft: viewport?.scrollLeft || 0
    });

    document.documentElement.dataset.lawsExhibitOriginOrbit = DESTINATION_ORBIT;
    document.documentElement.dataset.lawsExhibitOriginRolodex = originSnapshot.rolodexId;
    document.documentElement.dataset.lawsExhibitOriginDestination = originSnapshot.destinationId;
  }

  function restoreOrigin() {
    if (!originSnapshot || originSnapshot.orbitId !== DESTINATION_ORBIT) return;
    const snapshot = originSnapshot;
    originSnapshot = null;

    activateGroup(snapshot.groupIndex, "orbit-return", false);
    globalThis.DGB_LAWS_DESTINATION_CAROUSEL?.restoreOrbitState?.({
      rolodexId: snapshot.rolodexId,
      index: snapshot.carouselIndex,
      destinationId: snapshot.destinationId
    });

    requestAnimationFrame(() => {
      const section = orbitSection();
      const field = activeOrbitField(snapshot.destinationId);
      if (!section || !field) return;
      const viewport = field.querySelector(".laws-rolodex-viewport");
      if (viewport) viewport.scrollLeft = snapshot.viewportScrollLeft;
      const orbitTop = globalThis.scrollY + section.getBoundingClientRect().top;
      const targetY = orbitTop + snapshot.orbitViewportOffset;
      globalThis.scrollTo({ left: snapshot.scrollX, top: targetY, behavior: "instant" });
      document.documentElement.dataset.lawsLastReturnOrbit = DESTINATION_ORBIT;
      document.documentElement.dataset.lawsLastReturnRolodex = snapshot.rolodexId;
      document.documentElement.dataset.lawsLastReturnDestination = snapshot.destinationId;
      globalThis.dispatchEvent(new CustomEvent("LAWS_ORBIT_CUSTODY_RESTORED", {
        detail: Object.freeze({
          contract: CONTRACT,
          orbitId: DESTINATION_ORBIT,
          rolodexId: snapshot.rolodexId,
          destinationId: snapshot.destinationId,
          carouselIndex: snapshot.carouselIndex,
          navigationAuthority: false,
          contentAuthority: false
        })
      }));
    });
  }

  function installPresentationStyles() {
    if (document.querySelector("link[data-laws-responsive-rolodex]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/laws/index.rolodex-responsive.css?v=LAWS_ROOT_MOBILE_ROLODEX_20260803A";
    link.dataset.lawsResponsiveRolodex = "true";
    document.head.append(link);
  }

  function tabletActive() {
    return Boolean(tabletMedia && tabletMedia.matches);
  }

  function mobileActive() {
    return Boolean(mobileMedia && mobileMedia.matches);
  }

  function groupCopy(field, index) {
    return {
      eyebrow: field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim()
        || `Destination group ${index + 1}`,
      title: field.querySelector(".laws-rolodex-field__heading h3")?.textContent?.trim()
        || "Choose a destination."
    };
  }

  function normalizeIndex(index) {
    const count = groupFields.length;
    return count ? ((index % count) + count) % count : 0;
  }

  function setFieldInteractive(field, interactive) {
    if (interactive) {
      field.removeAttribute("aria-hidden");
      if ("inert" in field) field.inert = false;
      else field.removeAttribute("inert");
      return;
    }
    field.setAttribute("aria-hidden", "true");
    if ("inert" in field) field.inert = true;
    else field.setAttribute("inert", "");
  }

  function updateSummary(active) {
    if (!groupSummary || !groupSummaryEyebrow || !groupSummaryTitle) return;
    groupSummary.setAttribute("aria-hidden", String(!active));
    if (!active || !groupFields.length) return;
    const copy = groupCopy(groupFields[activeGroupIndex], activeGroupIndex);
    groupSummaryEyebrow.textContent = copy.eyebrow;
    groupSummaryTitle.textContent = copy.title;
  }

  function publishState(source) {
    const detail = Object.freeze({
      contract: CONTRACT,
      source,
      tabletDepthActive: tabletActive(),
      mobileRolodexActive: mobileActive(),
      activeIndex: activeGroupIndex,
      activeRolodexId: groupFields[activeGroupIndex]?.dataset.rolodexId || "",
      groupCount: groupFields.length,
      headingBandActive: Boolean((tabletActive() || mobileActive()) && groupSummary),
      defaultEntryOrbit: COMPASS_ORBIT,
      destinationOrbit: DESTINATION_ORBIT,
      navigationAuthority: false,
      contentAuthority: false
    });
    globalThis.dispatchEvent(new CustomEvent("LAWS_ROLODEX_GROUP_CHANGED", { detail }));
    globalThis.dispatchEvent(new CustomEvent("LAWS_TABLET_ROLODEX_DEPTH_CHANGED", { detail }));
  }

  function applyGroupState(source = "selection", focusTab = false) {
    const tablet = tabletActive();
    const mobile = mobileActive();
    const grouped = tablet || mobile;
    const section = orbitSection();
    if (!section || !groupFields.length) return;

    section.dataset.lawsTabletDepthAxis = tablet ? "active" : "inactive";
    section.dataset.lawsMobileRolodex = mobile ? "active" : "inactive";
    document.documentElement.dataset.lawsTabletRolodexDepthAxis = tablet ? "active" : "inactive";
    document.documentElement.dataset.lawsMobileRolodex = mobile ? "active" : "inactive";

    groupFields.forEach((field, index) => {
      field.removeAttribute("data-laws-group-state");
      field.removeAttribute("data-laws-mobile-state");
      if (tablet) {
        const relative = (index - activeGroupIndex + groupFields.length) % groupFields.length;
        const state = relative === 0 ? "active" : relative === 1 ? "next" : "previous";
        field.dataset.lawsGroupState = state;
        setFieldInteractive(field, state === "active");
      } else if (mobile) {
        const active = index === activeGroupIndex;
        field.dataset.lawsMobileState = active ? "active" : "inactive";
        setFieldInteractive(field, active);
      } else {
        setFieldInteractive(field, true);
      }
    });

    groupButtons.forEach((button, index) => {
      const selected = grouped && index === activeGroupIndex;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected || !grouped ? 0 : -1;
    });

    updateSummary(grouped);
    if (focusTab && grouped) groupButtons[activeGroupIndex]?.focus({ preventScroll: true });
    publishState(source);
  }

  function activateGroup(index, source = "control", focusTab = false) {
    if (!groupFields.length) return;
    activeGroupIndex = normalizeIndex(index);
    applyGroupState(source, focusTab);
  }

  function buildSwitcher(section) {
    if (groupSwitcher) return;
    groupSwitcher = document.createElement("div");
    groupSwitcher.className = "laws-rolodex-group-switcher";
    groupSwitcher.setAttribute("role", "tablist");
    groupSwitcher.setAttribute("aria-label", "Choose a Laws destination group");

    groupButtons = groupFields.map((field, index) => {
      field.id ||= `laws-rolodex-group-${field.dataset.rolodexId || index + 1}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "laws-rolodex-group-tab";
      button.id = `laws-rolodex-group-tab-${index + 1}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", field.id);
      button.textContent = groupCopy(field, index).eyebrow;
      button.addEventListener("click", () => activateGroup(index, "tab-click"));
      button.addEventListener("keydown", event => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          activateGroup(activeGroupIndex + 1, "tab-arrow-next", true);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          activateGroup(activeGroupIndex - 1, "tab-arrow-previous", true);
        } else if (event.key === "Home") {
          event.preventDefault();
          activateGroup(0, "tab-home", true);
        } else if (event.key === "End") {
          event.preventDefault();
          activateGroup(groupFields.length - 1, "tab-end", true);
        }
      });
      groupSwitcher.append(button);
      return button;
    });
    section.insertBefore(groupSwitcher, groupStage);
  }

  function buildSummary(section) {
    if (groupSummary) return;
    groupSummary = document.createElement("header");
    groupSummary.className = "laws-rolodex-group-summary";
    groupSummary.dataset.lawsRolodexGroupSummary = "true";
    groupSummary.setAttribute("aria-live", "polite");
    groupSummary.setAttribute("aria-atomic", "true");
    groupSummary.setAttribute("aria-hidden", "true");
    groupSummaryEyebrow = document.createElement("p");
    groupSummaryEyebrow.className = "laws-rolodex-group-summary__eyebrow";
    groupSummaryTitle = document.createElement("h3");
    groupSummaryTitle.className = "laws-rolodex-group-summary__title";
    groupSummary.append(groupSummaryEyebrow, groupSummaryTitle);
    section.insertBefore(groupSummary, groupStage);
  }

  function mountGroupedRolodex() {
    const section = orbitSection();
    if (!section) return false;

    const existingStage = section.querySelector(":scope > .laws-rolodex-group-stage, :scope > .laws-rolodex-depth-stage");
    if (existingStage) {
      groupStage = existingStage;
      groupStage.className = "laws-rolodex-group-stage";
      groupFields = Array.from(groupStage.querySelectorAll(":scope > .laws-rolodex-field"));
    } else {
      const fields = Array.from(section.querySelectorAll(":scope > .laws-rolodex-field"));
      if (fields.length !== 3) return false;
      groupStage = document.createElement("div");
      groupStage.className = "laws-rolodex-group-stage";
      groupStage.dataset.lawsRolodexGroupStage = "true";
      section.insertBefore(groupStage, fields[0]);
      fields.forEach(field => groupStage.append(field));
      groupFields = fields;
    }

    buildSwitcher(section);
    buildSummary(section);

    if (!tabletMedia && typeof matchMedia === "function") {
      tabletMedia = matchMedia(TABLET_MEDIA);
      const onTabletChange = () => applyGroupState("tablet-viewport-change");
      if (typeof tabletMedia.addEventListener === "function") tabletMedia.addEventListener("change", onTabletChange);
      else if (typeof tabletMedia.addListener === "function") tabletMedia.addListener(onTabletChange);
    }

    if (!mobileMedia && typeof matchMedia === "function") {
      mobileMedia = matchMedia(MOBILE_MEDIA);
      const onMobileChange = () => applyGroupState("mobile-viewport-change");
      if (typeof mobileMedia.addEventListener === "function") mobileMedia.addEventListener("change", onMobileChange);
      else if (typeof mobileMedia.addListener === "function") mobileMedia.addListener(onMobileChange);
    }

    applyGroupState("mount");
    return true;
  }

  function applyActionCopy() {
    document.querySelectorAll(".laws-rolodex-card[data-destination-id]").forEach(card => {
      const id = card.dataset.destinationId;
      const copy = ACTION_COPY[id];
      const button = card.querySelector(".laws-rolodex-enter");
      if (!copy || !button) return;
      button.textContent = copy.preview;
      button.setAttribute("aria-label", `${copy.preview}: ${card.querySelector("h4")?.textContent?.trim() || id}`);
    });
  }

  function applyExhibitRouteCopy(destinationId) {
    const copy = ACTION_COPY[destinationId];
    if (!copy) return;
    requestAnimationFrame(() => {
      const route = document.querySelector(".laws-exhibit-route");
      if (route) route.textContent = copy.route;
    });
  }

  function placeRolodex() {
    const section = orbitSection();
    if (!section) return false;

    installPresentationStyles();
    markOrbitIdentity();

    const useStage = document.querySelector(".laws-use-stage[data-laws-experience-stage='use']");
    if (useStage) {
      useStage.replaceWith(section);
    } else {
      const hero = document.querySelector("[data-laws-experience-stage='hero']");
      if (hero?.parentElement && section.previousElementSibling !== hero) hero.after(section);
    }

    section.dataset.lawsExperienceVisible = "true";
    document.querySelector(".laws-accessibility-note")?.remove();

    const footerDescription = document.querySelector(".laws-footer > div > span");
    if (footerDescription) footerDescription.textContent = "Choose a direction in the Compass or continue to a destination.";

    mountGroupedRolodex();
    applyActionCopy();
    markOrbitIdentity();

    document.documentElement.dataset.lawsRolodexPlacement = "full-width-root-flow";
    requestAnimationFrame(() => enforceCompassEntry("rolodex-placement"));
    globalThis.dispatchEvent(new CustomEvent("LAWS_ROLODEX_PLACEMENT_READY", {
      detail: Object.freeze({
        contract: CONTRACT,
        fullWidthRootFlow: true,
        redundantUseStageVisible: false,
        runtimeCustodyNoteVisible: false,
        viewportContained: true,
        defaultEntryOrbit: COMPASS_ORBIT,
        destinationOrbit: DESTINATION_ORBIT,
        tabletDepthAxisAvailable: Boolean(groupStage && groupFields.length === 3),
        tabletDepthAxisActive: tabletActive(),
        mobileGroupedRolodexAvailable: Boolean(groupStage && groupFields.length === 3),
        mobileGroupedRolodexActive: mobileActive(),
        headingBandAvailable: Boolean(groupSummary),
        navigationAuthority: false,
        contentAuthority: false
      })
    }));
    return true;
  }

  function publishCustodyRuntime() {
    globalThis.DGB_LAWS_ORBIT_CUSTODY = Object.freeze({
      contract: CONTRACT,
      defaultEntryOrbit: COMPASS_ORBIT,
      destinationOrbit: DESTINATION_ORBIT,
      getOrigin: () => originSnapshot,
      enforceCompassEntry,
      navigationAuthority: false,
      contentAuthority: false
    });
  }

  function initialize() {
    publishCustodyRuntime();
    placeRolodex();
    globalThis.addEventListener("LAWS_ROOT_ROLODEX_READY", placeRolodex);
    globalThis.addEventListener("LAWS_DESTINATION_STAGE_READY", () => requestAnimationFrame(() => enforceCompassEntry("destination-stage-ready")));
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_OPENED", event => {
      captureOrigin(event);
      applyExhibitRouteCopy(event.detail?.destinationId || "");
    });
    globalThis.addEventListener("LAWS_ROLODEX_EXHIBIT_CLOSED", restoreOrigin);
    globalThis.addEventListener("load", () => requestAnimationFrame(() => {
      enforceCompassEntry("window-load");
      entryGuardActive = false;
    }), { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
