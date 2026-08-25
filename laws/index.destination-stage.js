/*
 * LAWS_DESTINATION_STAGE_v1
 * Dedicated second-stage presentation for the existing Laws destination records.
 * Owns only stage composition and group selection. It does not own routes, records,
 * evidence, Compass state, controller state, or destination content.
 */
(() => {
  "use strict";

  const CONTRACT = "LAWS_DESTINATION_STAGE_TABBED_v2";
  const ROOT = "[data-laws-root-rolodex-section]";
  const FIELD = ".laws-rolodex-field[data-rolodex-id]";
  let mounted = false;

  function installStyles() {
    if (document.querySelector("link[data-laws-destination-stage-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/laws/index.destination-stage.css?v=LAWS_DESTINATION_STAGE_V1_20260816A";
    link.dataset.lawsDestinationStageCss = "true";
    document.head.append(link);
  }

  function copyFor(field, index) {
    return {
      eyebrow: field.querySelector(".laws-rolodex-field__heading > p")?.textContent?.trim() || `Destination family ${index + 1}`,
      title: field.querySelector(".laws-rolodex-field__heading h3")?.textContent?.trim() || "Choose a destination."
    };
  }

  function setInteractive(field, active) {
    field.dataset.destinationStageState = active ? "active" : "inactive";
    field.setAttribute("aria-hidden", String(!active));
    if ("inert" in field) field.inert = !active;
    else if (active) field.removeAttribute("inert");
    else field.setAttribute("inert", "");
  }

  function mount() {
    const section = document.querySelector(ROOT);
    if (!section || mounted) return false;
    const fields = Array.from(section.querySelectorAll(FIELD));
    if (fields.length !== 3) return false;

    installStyles();
    mounted = true;
    document.documentElement.dataset.lawsDestinationStage = "active";
    section.dataset.lawsDestinationStage = "active";
    section.dataset.lawsExperienceStage = "destination-carousel";
    section.setAttribute("aria-labelledby", "laws-destination-stage-title");

    section.querySelector(".laws-rolodex-group-switcher")?.remove();
    section.querySelector(".laws-rolodex-group-summary")?.remove();
    section.querySelector(".laws-rolodex-intro")?.remove();

    const stage = document.createElement("div");
    stage.className = "laws-destination-stage__inner";

    const header = document.createElement("header");
    header.className = "laws-destination-stage__header";
    header.innerHTML = `
      <div class="laws-destination-stage__kicker"><span>02</span><span>Destination Chamber</span></div>
      <div class="laws-destination-stage__heading-row">
        <div>
          <p class="laws-destination-stage__eyebrow">Continue through the chamber</p>
          <h2 id="laws-destination-stage-title">Choose where the inquiry goes next.</h2>
        </div>
        <p class="laws-destination-stage__lede">Three routes. One active record at a time. Rotate the chamber, inspect a destination, then enter its complete record when you are ready.</p>
      </div>`;

    const tabs = document.createElement("div");
    tabs.className = "laws-destination-stage__tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Choose a Laws destination family");

    const familyContext = document.createElement("div");
    familyContext.className = "laws-destination-stage__context";
    familyContext.setAttribute("aria-live", "polite");
    familyContext.innerHTML = `<p data-laws-destination-stage-family></p><h3 data-laws-destination-stage-family-title></h3>`;

    const fieldStage = document.createElement("div");
    fieldStage.className = "laws-destination-stage__field";
    fieldStage.dataset.lawsDestinationFieldStage = "true";

    stage.append(header, tabs, familyContext, fieldStage);
    section.append(stage);

    const originalStage = section.querySelector(":scope > .laws-rolodex-group-stage");
    fields.forEach(field => fieldStage.append(field));
    originalStage?.remove();

    const familyLabel = stage.querySelector("[data-laws-destination-stage-family]");
    const familyTitle = stage.querySelector("[data-laws-destination-stage-family-title]");
    let activeIndex = 2;

    const buttons = fields.map((field, index) => {
      const copy = copyFor(field, index);
      const button = document.createElement("button");
      button.type = "button";
      button.role = "tab";
      button.className = "laws-destination-stage__tab";
      button.dataset.destinationFamilyIndex = String(index);
      const ordinal = document.createElement("span");
      ordinal.className = "laws-destination-stage__tab-ordinal";
      ordinal.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("span");
      label.className = "laws-destination-stage__tab-label";
      label.textContent = copy.eyebrow;
      button.append(ordinal, label);
      button.setAttribute("aria-controls", field.id || (field.id = `laws-destination-family-${field.dataset.rolodexId || index + 1}`));
      tabs.append(button);
      return button;
    });

    function activate(index, reason = "activate", focus = false) {
      activeIndex = ((index % fields.length) + fields.length) % fields.length;
      fields.forEach((field, i) => setInteractive(field, i === activeIndex));
      buttons.forEach((button, i) => {
        const active = i === activeIndex;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      const copy = copyFor(fields[activeIndex], activeIndex);
      familyLabel.textContent = copy.eyebrow;
      familyTitle.textContent = copy.title;
      section.dataset.destinationFamily = fields[activeIndex].dataset.rolodexId || "";
      if (focus) buttons[activeIndex].focus({ preventScroll: true });
      globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_STAGE_CHANGED", {
        detail: Object.freeze({
          contract: CONTRACT,
          reason,
          index: activeIndex,
          rolodexId: fields[activeIndex].dataset.rolodexId || "",
          navigationAuthority: false,
          contentAuthority: false,
          routeAuthority: false,
          evidenceAuthority: false
        })
      }));
    }

    tabs.addEventListener("click", event => {
      const button = event.target.closest("[data-destination-family-index]");
      if (!button) return;
      activate(Number(button.dataset.destinationFamilyIndex), "tab-click");
    });

    tabs.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") activate(0, "tab-home", true);
      else if (event.key === "End") activate(fields.length - 1, "tab-end", true);
      else activate(activeIndex + (event.key === "ArrowRight" ? 1 : -1), "tab-arrow", true);
    });

    section.dataset.destinationFamilyTabCount = String(buttons.length);
    activate(activeIndex, "mount");

    globalThis.DGB_LAWS_DESTINATION_STAGE = Object.freeze({
      contract: CONTRACT,
      mounted: true,
      getActiveIndex: () => activeIndex,
      activate: index => activate(index, "public-api"),
      navigationAuthority: false,
      contentAuthority: false,
      routeAuthority: false,
      evidenceAuthority: false
    });

    globalThis.dispatchEvent(new CustomEvent("LAWS_DESTINATION_STAGE_READY", {
      detail: Object.freeze({ contract: CONTRACT, fieldCount: fields.length, activeIndex })
    }));
    return true;
  }

  function initialize() {
    if (mount()) return;
    const tryMount = () => requestAnimationFrame(mount);
    globalThis.addEventListener("LAWS_ROOT_ROLODEX_READY", tryMount);
    globalThis.addEventListener("LAWS_ROLODEX_PLACEMENT_READY", tryMount);
    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();
