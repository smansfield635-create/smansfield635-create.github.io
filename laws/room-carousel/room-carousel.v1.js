(() => {
  "use strict";

  const CONTRACT = "LAWS_METHODS_REFERENCE_FAMILY_ARCHITECTURE_v4";
  const REFERENCE = "METHODS_AND_MODELS_PROGRESSIVE_CARD_ARCHITECTURE_BYTE_FROZEN";
  const CLASSIFY_PX = 8;
  const COMMIT_PX = 24;
  const AXIS_RATIO = 1.12;
  const DEPTHS = Object.freeze([["practical", "Reading"], ["engineering", "Engineering"], ["empirical", "Evidence"]]);
  const scriptSource = document.currentScript?.src || "/laws/room-carousel/room-carousel.v1.js";
  const mapUrl = new URL("./route-card-map.v2.json", scriptSource).href;

  document.documentElement.classList.add("lr-js");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = (value, count) => ((value % count) + count) % count;
  const slug = value => String(value || "subject").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "subject";
  const textOf = node => node?.textContent?.replace(/\s+/g, " ").trim() || "";
  const escapeHtml = value => String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const sentences = value => String(value || "").trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(part => part.trim()).filter(Boolean) || [];
  const withoutTerminal = value => String(value || "").replace(/[.?!]+$/, "").trim();

  function installReferenceStyles() {
    if (document.getElementById("lrc-methods-reference-styles")) return;
    const style = document.createElement("style");
    style.id = "lrc-methods-reference-styles";
    style.textContent = `
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-inspection] { width:min(100%,64rem); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-inspection-head { margin-bottom:1.25rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-information-grid] { grid-template-columns:minmax(13rem,16.5rem) minmax(0,1fr); grid-template-areas:"stories cells"; gap:1rem 1.35rem; align-items:start; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-inner-tabs] { position:absolute !important; width:1px !important; height:1px !important; margin:-1px !important; padding:0 !important; overflow:hidden !important; clip:rect(0 0 0 0) !important; white-space:nowrap !important; border:0 !important; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-rail] { grid-area:stories; top:4.2rem; border-right:1px solid rgba(255,255,255,.09); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] { grid-template-columns:1fr; gap:.18rem; min-height:4.25rem; padding:.72rem .85rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > span { font-size:.58rem; letter-spacing:.13em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > strong { color:inherit; font-size:.86rem; line-height:1.2; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > small { color:#65727c; font-size:.62rem; font-weight:600; line-height:1.28; letter-spacing:.02em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab][aria-selected="true"] > small { color:color-mix(in srgb,var(--lrc-family-accent) 72%,#8a949d); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-grid-cells] { grid-area:cells; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-grid-cell] { min-height:0; padding:0; border:0; background:transparent; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-progressive-detail { display:grid; gap:1rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first { padding:clamp(1rem,2.4vw,1.45rem); border:1px solid color-mix(in srgb,var(--lrc-family-accent) 22%,transparent); border-radius:1rem; background:radial-gradient(circle at 88% 12%,var(--lrc-family-soft),transparent 13rem),rgba(255,255,255,.025); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-depth-label { margin:0 0 .42rem; color:var(--lrc-family-accent); font-size:.64rem; font-weight:800; letter-spacing:.15em; text-transform:uppercase; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first h3 { margin:0; max-width:20ch; color:#f0eee9; font-family:Georgia,"Times New Roman",serif; font-size:clamp(1.85rem,3vw,2.8rem); font-weight:500; line-height:1.02; letter-spacing:-.035em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-lead { margin:.8rem 0 0; max-width:60ch; color:#d9e0e6; font-size:clamp(1rem,1.5vw,1.12rem); line-height:1.62; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-why { margin-top:1rem; padding-top:.9rem; border-top:1px solid rgba(255,255,255,.08); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-why strong,
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid strong { display:block; margin-bottom:.3rem; color:#9ba7b1; font-size:.64rem; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-why p { margin:0; color:#acb8c1; line-height:1.58; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth { border:1px solid rgba(255,255,255,.09); border-radius:1rem; background:rgba(3,6,9,.36); overflow:clip; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:.25rem 1rem; align-items:center; padding:1rem 1.1rem; cursor:pointer; list-style:none; color:#d7dde2; font-weight:780; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary::-webkit-details-marker { display:none; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary::after { content:"+"; grid-column:2; grid-row:1 / span 2; color:var(--lrc-family-accent); font-size:1.25rem; font-weight:400; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth[open] > summary::after { content:"−"; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-depth > summary small { grid-column:1; color:#6f7b85; font-size:.68rem; font-weight:620; line-height:1.35; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-body { display:grid; gap:1rem; padding:0 1.1rem 1.15rem; border-top:1px solid rgba(255,255,255,.065); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-identity { padding-top:1rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-identity h4 { margin:.05rem 0 .6rem; color:#f1eee8; font-family:Georgia,"Times New Roman",serif; font-size:clamp(1.4rem,2.4vw,2.05rem); font-weight:500; line-height:1.05; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-statement { margin:0; color:#b7c1c9; font-size:.94rem; line-height:1.58; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.7rem; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid section { padding:.78rem; border:1px solid rgba(255,255,255,.07); border-radius:.72rem; background:rgba(255,255,255,.018); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid p { margin:0; color:#99a6af; font-size:.81rem; line-height:1.52; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-grid-cell][data-depth-focus="empirical"] .lrc-engineering-grid section:first-child { border-color:color-mix(in srgb,var(--lrc-family-accent) 38%,transparent); background:var(--lrc-family-soft); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-summary-stories] { display:grid; gap:.35rem; width:100%; margin:.95rem 0 0; padding-top:.8rem; border-top:1px solid rgba(255,255,255,.07); }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-summary-stories] span { display:flex; gap:.55rem; align-items:baseline; color:#82909b; font-size:.7rem; line-height:1.25; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-summary-stories] b { color:var(--lrc-family-accent); font-size:.58rem; letter-spacing:.12em; }
      html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-inspect] { margin-top:auto; }
      @media (max-width:780px) {
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-information-grid] { grid-template-columns:minmax(8rem,34%) minmax(0,1fr); grid-template-areas:"stories cells"; gap:.65rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-rail] { top:3.8rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] { min-height:3.8rem; padding:.58rem .55rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > strong { font-size:.74rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-tab] > small { font-size:.56rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first { padding:1rem; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-reader-first h3 { font-size:clamp(1.65rem,6vw,2.3rem); }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] .lrc-engineering-grid { grid-template-columns:1fr; }
      }
      @media (max-width:480px) {
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-information-grid] { grid-template-columns:1fr; grid-template-areas:"stories" "cells"; }
        html.lr-js [data-laws-room-carousel][data-lrc-mounted="true"] [data-lrc-story-rail] { position:relative; top:auto; grid-template-columns:repeat(2,minmax(0,1fr)); border-right:0; }
      }
      @media (prefers-reduced-motion:reduce) {
        html.lr-js [data-laws-room-carousel] .lrc-engineering-depth,
        html.lr-js [data-laws-room-carousel] .lrc-engineering-depth > summary { scroll-behavior:auto !important; transition:none !important; }
      }
    `;
    document.head.append(style);
  }

  function routeOf(root) {
    const declared = root.dataset.lrcRoute || document.documentElement.dataset.route;
    if (declared) return declared;
    return location.pathname.endsWith(".html") || location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
  }

  function directSourceNodes(root) {
    return Array.from(root.children).filter(node => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.matches("details.lr-audit,.lr-story-nav,[data-lrc-tabs],[data-lrc-viewport],[data-lrc-runtime],[data-lrc-static]")) return false;
      return node.matches("section,article,aside,nav,div");
    });
  }

  function routeContext(root) {
    const lens = kind => textOf(root.querySelector(`[id*="panel-${kind}"],.lr-panel[data-tab-kind="${kind}"],[data-tab-kind="${kind}"].section-tab-panel`));
    const relationship = root.querySelector("#relationship-title,#reverse-title");
    const relation = textOf(relationship?.closest("section")?.querySelector(".lr-section__head p:last-child"));
    const boundaryNode = root.querySelector(".lr-boundary,aside[aria-label*='boundary' i]");
    const noStudy = /no current admitted study/i.test(textOf(root))
      ? "No current admitted study. This subject remains conceptual or procedural until a separate source is admitted."
      : "";
    return {
      relation,
      practical: lens("practical"),
      engineering: lens("engineering"),
      empirical: lens("empirical"),
      boundary: textOf(boundaryNode?.querySelector("p:last-child")) || textOf(boundaryNode),
      noStudy
    };
  }

  function sourceMaterial(root, definition, context) {
    const source = definition.sourceSelector ? root.querySelector(definition.sourceSelector) : null;
    const sourceSummary = textOf(source?.querySelector("summary p"));
    const stories = Array.isArray(definition.stories) ? definition.stories.filter(story => {
      if (!story || !story.id || !story.label || !story.readings) return false;
      return DEPTHS.every(([kind]) => typeof story.readings[kind] === "string" && story.readings[kind].trim());
    }) : [];
    const authoredStorySummary = String(stories[0]?.readings?.practical || "").trim();
    return {
      label: definition.label || definition.id,
      summary: definition.summary || sourceSummary || authoredStorySummary || definition.practical || context.relation || "Open this subject for its complete contextual reading.",
      boundary: definition.boundary || context.boundary,
      href: definition.href || "",
      stories
    };
  }

  function storyArchitecture(story, material, context) {
    const practicalParts = sentences(story.readings.practical);
    const question = [...practicalParts].reverse().find(part => /\?$/.test(part));
    const readerTitle = story.readerTitle || question || story.label;
    const leadParts = question ? practicalParts.filter(part => part !== question) : practicalParts;
    const lead = leadParts[0] || story.readings.practical;
    const why = story.why || leadParts.slice(1).join(" ") || material.summary;
    const engineeringParts = sentences(story.readings.engineering);
    const formalTitle = story.formalTitle || story.engineeringTitle || story.label;
    const formalCaption = story.formalCaption || withoutTerminal(engineeringParts[0] || story.label);
    const empirical = String(story.readings.empirical || "").trim();
    const failureMatch = empirical.match(/(?:Failure mode|Failure behavior)\s*:\s*([^]+)$/i);
    const evidence = (failureMatch ? empirical.slice(0, failureMatch.index) : empirical).trim() || empirical;
    const failure = story.failure || failureMatch?.[1]?.trim() || `The ${story.label.toLowerCase()} reading fails when its required distinction cannot be supported by the named record or state.`;
    const limits = story.limits || story.boundary || story.relationship?.stops || material.boundary || context.noStudy || `Keep this reading bounded to ${material.label}; it does not by itself establish cause, universality, or authority outside the page's stated evidence.`;
    return { readerTitle, lead, why, formalTitle, formalCaption, engineering: story.readings.engineering, evidence, failure, limits };
  }

  function storyPanel(cardId, story, storyIndex, material, context) {
    const a = storyArchitecture(story, material, context);
    return `<article id="${escapeHtml(cardId)}-${escapeHtml(story.id)}" role="tabpanel" data-lrc-grid-cell data-lrc-story-index="${storyIndex}" data-lrc-story-id="${escapeHtml(story.id)}">
      <div class="lrc-progressive-detail">
        <section class="lrc-reader-first">
          <p class="lrc-depth-label">Plain-language reading</p>
          <h3>${escapeHtml(a.readerTitle)}</h3>
          <p class="lrc-reader-lead">${escapeHtml(a.lead)}</p>
          <div class="lrc-reader-why"><strong>Why it matters</strong><p>${escapeHtml(a.why)}</p></div>
        </section>
        <details class="lrc-engineering-depth" data-lrc-engineering-depth>
          <summary><span>Engineering detail</span><small>${escapeHtml(a.formalCaption)}</small></summary>
          <div class="lrc-engineering-body">
            <div class="lrc-engineering-identity">
              <p class="lrc-depth-label">Formal / technical reading</p>
              <h4>${escapeHtml(a.formalTitle)}</h4>
              <p class="lrc-engineering-statement">${escapeHtml(a.engineering)}</p>
            </div>
            <div class="lrc-engineering-grid">
              <section><strong>Evidence standing</strong><p>${escapeHtml(a.evidence)}</p></section>
              <section><strong>Failure behavior</strong><p>${escapeHtml(a.failure)}</p></section>
              <section><strong>Limits</strong><p>${escapeHtml(a.limits)}</p></section>
            </div>
          </div>
        </details>
      </div>
    </article>`;
  }

  function makeCard(root, route, family, definition, index, count, context) {
    const material = sourceMaterial(root, definition, context);
    const id = slug(definition.id || material.label);
    const card = document.createElement("section");
    card.dataset.lrcCard = "";
    card.dataset.lrcRuntime = "true";
    card.dataset.lrcId = id;
    card.dataset.lrcLabel = material.label;
    card.dataset.lrcFamily = family;
    card.id = `lrc-${slug(route)}-${id}`;
    card.setAttribute("role", "tabpanel");
    card.setAttribute("aria-label", `${material.label}, ${index + 1} of ${count}`);

    const summary = document.createElement("div");
    summary.dataset.lrcSummary = "";
    summary.innerHTML = `
      <p data-lrc-summary-count>${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}</p>
      <p data-lrc-summary-kicker>${escapeHtml(family)} subject</p>
      <h2 data-lrc-summary-title>${escapeHtml(material.label)}</h2>
      <p data-lrc-summary-copy>${escapeHtml(material.summary)}</p>
      <div data-lrc-summary-stories aria-hidden="true">${material.stories.slice(0,3).map((story, i) => `<span><b>${String(i + 1).padStart(2,"0")}</b>${escapeHtml(storyArchitecture(story, material, context).readerTitle)}</span>`).join("")}</div>
      <button type="button" data-lrc-inspect aria-controls="${escapeHtml(card.id)}">Explore meaning &amp; method</button>`;

    const inspection = document.createElement("div");
    inspection.dataset.lrcInspection = "";
    inspection.hidden = true;
    const stories = material.stories;
    if (stories.length < 4 || stories.length > 5) card.dataset.lrcGridFailure = "story-count";
    inspection.innerHTML = `
      <button type="button" data-lrc-return>↶ Return to Orbit</button>
      <header class="lrc-inspection-head"><p>${escapeHtml(family)} · contextual inspection</p><h2>${escapeHtml(material.label)}</h2><span>${escapeHtml(material.summary)}</span></header>
      <div data-lrc-information-grid>
        <div data-lrc-inner-tabs aria-hidden="true">${DEPTHS.map(([kind,label],i) => `<button type="button" tabindex="-1" data-lrc-inner-tab="${kind}" data-lrc-layer-index="${i}">${label}</button>`).join("")}</div>
        <div data-lrc-story-rail role="tablist" aria-orientation="vertical" aria-label="${escapeHtml(material.label)} readings">
          ${stories.map((story, storyIndex) => { const a = storyArchitecture(story, material, context); return `<button type="button" role="tab" data-lrc-story-tab="${escapeHtml(story.id)}" data-lrc-story-index="${storyIndex}"><span>${String(storyIndex + 1).padStart(2,"0")} / ${String(stories.length).padStart(2,"0")}</span><strong>${escapeHtml(a.readerTitle)}</strong><small>${escapeHtml(a.formalCaption)}</small></button>`; }).join("")}
        </div>
        <div data-lrc-grid-cells>${stories.map((story, storyIndex) => storyPanel(card.id, story, storyIndex, material, context)).join("")}</div>
      </div>
      ${material.href ? `<p class="lrc-deep-route"><a href="${escapeHtml(material.href)}">Continue to ${escapeHtml(material.label)}</a></p>` : ""}`;
    card.append(summary, inspection);
    return card;
  }

  function createOuterTabs(root, viewport, cards) {
    const tabs = document.createElement("div");
    tabs.dataset.lrcTabs = "";
    tabs.dataset.lrcRuntime = "true";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Choose a page-specific Laws subject");
    tabs.style.setProperty("--lrc-count", String(cards.length));
    const buttons = cards.map((card, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lrcTab = "";
      button.dataset.lrcTabIndex = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", card.id);
      button.innerHTML = `<span data-lrc-tab-number>${String(index + 1).padStart(2,"0")}</span><span data-lrc-tab-label>${escapeHtml(card.dataset.lrcLabel)}</span>`;
      tabs.append(button);
      return button;
    });
    root.insertBefore(tabs, viewport);
    return { tabs, buttons };
  }

  function mount(root, map) {
    if (root.dataset.lrcMounted === "true") return;
    const route = routeOf(root);
    const routeMap = map.routes?.[route];
    if (!routeMap?.cards?.length) { root.dataset.lrcFailure = "route-map-missing"; return; }
    const declaredIds = (root.dataset.lrcCards || "").split(/\s+/).filter(Boolean);
    const mappedIds = routeMap.cards.map(card => card.id);
    if (declaredIds.length && declaredIds.join("|") !== mappedIds.join("|")) { root.dataset.lrcFailure = "route-declaration-mismatch"; return; }

    installReferenceStyles();
    root.dataset.lrcRoute = route;
    root.dataset.lrcFamily = routeMap.family;
    root.dataset.lrcOuterCards = mappedIds.join(" ");
    root.dataset.lrcInternalTabs = "reading engineering evidence";
    root.dataset.lrcReferenceArchitecture = "methods-and-models";
    root.dataset.lrcCustody = "collapsed-subordinate";
    root.dataset.lrcGreaterNavigation = root.querySelector(":scope > .lr-story-nav") ? "bottom" : "not-declared";

    const storyNav = root.querySelector(":scope > .lr-story-nav");
    const audit = root.querySelector(":scope > details.lr-audit");
    if (audit) { audit.open = false; audit.dataset.lrcRole = "custody"; }
    if (storyNav) storyNav.dataset.lrcRole = "greater-laws-navigation";
    const context = routeContext(root);
    directSourceNodes(root).forEach(node => { node.dataset.lrcContextSource = ""; node.dataset.lrcOriginallyHidden = String(node.hidden); node.hidden = true; });

    const viewport = document.createElement("section");
    viewport.dataset.lrcViewport = "";
    viewport.dataset.lrcRuntime = "true";
    viewport.tabIndex = 0;
    viewport.setAttribute("role", "region");
    viewport.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-label", `${textOf(root.querySelector("h1")) || "Laws"} subjects`);
    const track = document.createElement("div");
    track.dataset.lrcTrack = "";
    const cards = routeMap.cards.map((definition,index) => makeCard(root,route,routeMap.family,definition,index,routeMap.cards.length,context));
    cards.forEach(card => track.append(card));
    const live = document.createElement("p");
    live.dataset.lrcLive = "";
    live.setAttribute("aria-live","polite");
    live.setAttribute("aria-atomic","true");
    viewport.append(track,live);
    root.insertBefore(viewport,root.firstChild);
    const { tabs, buttons } = createOuterTabs(root,viewport,cards);

    const state = { index:clamp(Number(root.dataset.lrcInitial || 0) || 0,0,cards.length - 1), inspecting:false, layers:cards.map(() => 0), stories:cards.map(() => 0), pointerId:null, startX:0, startY:0, travel:0, classification:"none", direction:0, dragging:false };

    function deltaFor(index) {
      let delta = index - state.index;
      const half = cards.length / 2;
      if (delta > half) delta -= cards.length;
      if (delta < -half) delta += cards.length;
      return delta;
    }

    function publish(reason) {
      const active = cards[state.index];
      const layer = DEPTHS[state.layers[state.index]]?.[0] || "practical";
      const story = routeMap.cards[state.index]?.stories?.[state.stories[state.index]] || null;
      root.dataset.lrcIndex = String(state.index);
      root.dataset.lrcId = active.dataset.lrcId;
      root.dataset.lrcLayer = state.inspecting ? layer : "orbit";
      root.dataset.lrcStory = state.inspecting && story ? story.id : "orbit";
      root.dataset.lrcGestureState = state.dragging ? state.classification : "idle";
      live.textContent = `${active.dataset.lrcLabel} · ${state.index + 1} of ${cards.length}`;
      globalThis.dispatchEvent(new CustomEvent("LAWS_ROOM_CAROUSEL_CHANGED", { detail:Object.freeze({ contract:CONTRACT, referenceContract:REFERENCE, reason, route, family:routeMap.family, count:cards.length, index:state.index, subjectId:active.dataset.lrcId, inspecting:state.inspecting, internalLayer:state.inspecting ? layer : null, internalStoryId:state.inspecting && story ? story.id : null, methodsReferenceArchitecture:true, sameObjectContinuity:true, bottomStoryNavigationPreserved:Boolean(storyNav), sourceCompletenessClaimed:false, scientificValidationClaimed:false, productAcceptanceGranted:false }) }));
    }

    function render(reason = "render") {
      cards.forEach((card,index) => {
        const delta = deltaFor(index);
        const abs = Math.abs(delta);
        const active = delta === 0;
        const adjacent = abs === 1;
        const inspecting = active && state.inspecting;
        card.style.setProperty("--lrc-offset",String(delta));
        card.style.setProperty("--lrc-depth-factor",active ? "1" : adjacent ? ".2" : "0");
        card.style.setProperty("--lrc-scale",active ? "1" : adjacent ? ".91" : ".82");
        card.style.setProperty("--lrc-opacity",active ? "1" : adjacent ? ".5" : "0");
        card.dataset.active = String(active);
        card.dataset.adjacent = String(adjacent);
        card.dataset.distant = String(abs > 1);
        card.dataset.inspecting = String(inspecting);
        card.setAttribute("aria-current",active ? "true" : "false");
        card.setAttribute("aria-hidden",active ? "false" : "true");
        if ("inert" in card) card.inert = !active;
        card.querySelector(":scope > [data-lrc-summary]").hidden = inspecting;
        card.querySelector(":scope > [data-lrc-inspection]").hidden = !inspecting;
        const activeLayer = state.layers[index];
        const activeStory = state.stories[index];
        card.querySelectorAll("[data-lrc-inner-tab]").forEach((button,layerIndex) => button.setAttribute("aria-selected",String(layerIndex === activeLayer)));
        card.querySelectorAll("[data-lrc-story-tab]").forEach((button,storyIndex) => { const selected = storyIndex === activeStory; button.setAttribute("aria-selected",String(selected)); button.tabIndex = selected ? 0 : -1; });
        card.querySelectorAll("[data-lrc-grid-cell]").forEach(panel => {
          const selected = Number(panel.dataset.lrcStoryIndex) === activeStory;
          panel.hidden = !selected;
          panel.dataset.depthFocus = DEPTHS[activeLayer]?.[0] || "practical";
          const details = panel.querySelector("[data-lrc-engineering-depth]");
          if (details) details.open = selected && activeLayer > 0;
        });
      });
      buttons.forEach((button,index) => { const active = index === state.index; button.setAttribute("aria-selected",String(active)); button.tabIndex = active ? 0 : -1; });
      tabs.dataset.lrcActiveIndex = String(state.index);
      viewport.dataset.lrcInspecting = String(state.inspecting);
      publish(reason);
    }

    function closeInspection(reason = "inspection-close", focus = true) {
      if (!state.inspecting) return;
      const button = cards[state.index].querySelector("[data-lrc-inspect]");
      state.inspecting = false;
      delete root.dataset.lrcInspecting;
      delete document.documentElement.dataset.lrcInspectionOpen;
      render(reason);
      if (focus) button?.focus({ preventScroll:true });
    }

    function openInspection(reason = "inspection-open") {
      if (state.inspecting) return;
      state.layers[state.index] = 0;
      state.stories[state.index] = 0;
      state.inspecting = true;
      root.dataset.lrcInspecting = "true";
      document.documentElement.dataset.lrcInspectionOpen = "true";
      render(reason);
      requestAnimationFrame(() => cards[state.index].querySelector("[data-lrc-return]")?.focus({ preventScroll:true }));
    }

    function select(next,reason,focus = false) {
      if (state.inspecting) closeInspection("inspection-close-before-selection",false);
      state.index = wrap(next,cards.length);
      render(reason);
      if (focus) buttons[state.index]?.focus({ preventScroll:true });
    }

    function selectLayer(cardIndex,next,reason = "depth-select") {
      if (!state.inspecting || cardIndex !== state.index) return;
      state.layers[cardIndex] = wrap(next,DEPTHS.length);
      render(reason);
    }

    function selectStory(cardIndex,next,reason = "story-tab-select",focus = false) {
      if (!state.inspecting || cardIndex !== state.index) return;
      const storyCount = routeMap.cards[cardIndex]?.stories?.length || 0;
      if (!storyCount) return;
      state.stories[cardIndex] = wrap(next,storyCount);
      state.layers[cardIndex] = 0;
      render(reason);
      if (focus) cards[cardIndex].querySelectorAll("[data-lrc-story-tab]")[state.stories[cardIndex]]?.focus({ preventScroll:true });
    }

    tabs.addEventListener("click",event => { const button = event.target.closest("[data-lrc-tab]"); if (button) select(Number(button.dataset.lrcTabIndex),"outer-tab-direct-select"); });
    tabs.addEventListener("keydown",event => {
      if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") select(0,"outer-tab-home",true);
      else if (event.key === "End") select(cards.length - 1,"outer-tab-end",true);
      else select(state.index + (event.key === "ArrowRight" ? 1 : -1),"outer-tab-arrow",true);
    });

    root.addEventListener("click",event => {
      if (event.target.closest("[data-lrc-inspect]")) return openInspection();
      if (event.target.closest("[data-lrc-return]")) return closeInspection();
      const inner = event.target.closest("[data-lrc-inner-tab]");
      if (inner) { event.stopPropagation(); selectLayer(state.index,Number(inner.dataset.lrcLayerIndex)); return; }
      const story = event.target.closest("[data-lrc-story-tab]");
      if (story) { event.stopPropagation(); selectStory(state.index,Number(story.dataset.lrcStoryIndex)); }
    });
    root.addEventListener("keydown",event => {
      const story = event.target.closest("[data-lrc-story-tab]");
      if (!story || !["ArrowUp","ArrowDown","Home","End"].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      const storyCount = routeMap.cards[state.index]?.stories?.length || 0;
      const current = Number(story.dataset.lrcStoryIndex);
      const next = event.key === "Home" ? 0 : event.key === "End" ? storyCount - 1 : current + (event.key === "ArrowDown" ? 1 : -1);
      selectStory(state.index,next,"story-tab-keyboard",true);
    });

    viewport.addEventListener("keydown",event => {
      if (event.key === "Escape" && state.inspecting) { event.preventDefault(); closeInspection(); return; }
      if (state.inspecting || event.target.closest("input,textarea,select")) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); select(state.index - 1,"keyboard-left",true); }
      else if (event.key === "ArrowRight") { event.preventDefault(); select(state.index + 1,"keyboard-right",true); }
      else if (event.key === "Home") { event.preventDefault(); select(0,"keyboard-home",true); }
      else if (event.key === "End") { event.preventDefault(); select(cards.length - 1,"keyboard-end",true); }
    });

    viewport.addEventListener("pointerdown",event => {
      if (state.inspecting || event.target.closest("a,button,input,textarea,select,summary") || (event.pointerType === "mouse" && event.button !== 0)) return;
      state.pointerId = event.pointerId; state.startX = event.clientX; state.startY = event.clientY; state.travel = 0; state.classification = "none"; state.direction = 0; state.dragging = true; viewport.dataset.dragging = "true"; viewport.setPointerCapture?.(event.pointerId);
    });
    viewport.addEventListener("pointermove",event => {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const totalX = event.clientX - state.startX;
      const totalY = event.clientY - state.startY;
      if (state.classification === "none" && Math.max(Math.abs(totalX),Math.abs(totalY)) >= CLASSIFY_PX) state.classification = Math.abs(totalX) >= Math.abs(totalY) * AXIS_RATIO ? "horizontal" : "vertical";
      if (state.classification === "horizontal") { state.travel = Math.abs(totalX); state.direction = totalX < 0 ? 1 : -1; event.preventDefault(); }
      root.dataset.lrcGestureState = state.classification;
    },{ passive:false });
    function release(event,cancelled = false) {
      if (!state.dragging || event.pointerId !== state.pointerId) return;
      const direction = !cancelled && state.classification === "horizontal" && state.travel >= COMMIT_PX ? state.direction : 0;
      state.dragging = false; viewport.dataset.dragging = "false"; try { viewport.releasePointerCapture?.(event.pointerId); } catch {} state.pointerId = null; state.classification = "none"; state.travel = 0; state.direction = 0;
      if (direction) select(state.index + direction,"pointer-one-step"); else render(cancelled ? "pointer-cancel-noop" : "pointer-unclassified-noop");
    }
    viewport.addEventListener("pointerup",event => release(event,false));
    viewport.addEventListener("pointercancel",event => release(event,true));

    root.querySelectorAll("[data-lrc-controls],[data-lrc-prev],[data-lrc-next]").forEach(node => node.remove());
    root.dataset.lrcMounted = "true";
    root.dataset.lrcContract = CONTRACT;
    root.dataset.lrcReferenceContract = REFERENCE;
    root.dataset.lrcTabCount = String(cards.length);
    render("init");
  }

  fetch(mapUrl,{ credentials:"same-origin" })
    .then(response => { if (!response.ok) throw new Error(`route-card-map:${response.status}`); return response.json(); })
    .then(map => document.querySelectorAll("[data-laws-room-carousel]").forEach(root => mount(root,map)))
    .catch(error => document.documentElement.dataset.lrcMapFailure = error?.message || "route-card-map-unavailable");
})();
