/* /campaigns/index.tabs.js
   DGB_COMMUNITY_CAMPAIGN_SHARED_TABS_v1
   Shared accessible tab behavior only. Content, routes, and visual styling remain in HTML/CSS.
*/
(() => {
  "use strict";

  const CONTRACT = "DGB_COMMUNITY_CAMPAIGN_SHARED_TABS_v1";
  const roots = [...document.querySelectorAll("[data-campaign-tabs]")];
  const observations = [];

  const activate = (root, tab, focus = false) => {
    const tabs = [...root.querySelectorAll('[role="tab"][data-tab-target]')];
    const panels = [...root.querySelectorAll('[role="tabpanel"][data-tab-panel]')];
    const targetId = tab?.dataset.tabTarget || "";
    if (!targetId) return false;

    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute("aria-selected", active ? "true" : "false");
      item.setAttribute("tabindex", active ? "0" : "-1");
      item.dataset.active = active ? "true" : "false";
    });

    panels.forEach(panel => {
      const active = panel.id === targetId;
      panel.hidden = !active;
      panel.setAttribute("aria-hidden", active ? "false" : "true");
    });

    root.dataset.activeTab = targetId;
    if (focus) tab.focus();
    return true;
  };

  roots.forEach((root, rootIndex) => {
    const tabs = [...root.querySelectorAll('[role="tab"][data-tab-target]')];
    const panels = [...root.querySelectorAll('[role="tabpanel"][data-tab-panel]')];

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(root, tab));
      tab.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        const next = tabs[nextIndex];
        if (next) activate(root, next, true);
      });
    });

    const hashId = location.hash ? location.hash.slice(1) : "";
    const hashTab = tabs.find(tab => tab.dataset.tabTarget === hashId);
    const initial = hashTab || tabs.find(tab => tab.getAttribute("aria-selected") === "true") || tabs[0];
    if (initial) activate(root, initial);

    observations.push(Object.freeze({
      rootIndex,
      tabCount: tabs.length,
      panelCount: panels.length,
      initialPanel: root.dataset.activeTab || ""
    }));
  });

  const receipt = Object.freeze({
    contract: CONTRACT,
    initialized: true,
    tabsetCount: roots.length,
    observations: Object.freeze(observations)
  });

  globalThis.DGB_CAMPAIGN_TABS_RECEIPT = receipt;
  document.documentElement.dataset.campaignTabsStatus = "ready";
})();
