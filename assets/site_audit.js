/* ==========================================================================
   Diamond Gate Bridge · Live Site Audit Engine
   SITE_AUDIT_ENGINE_B1
   PATH: /assets/site_audit.js

   PURPOSE:
   - Client-side live audit for static site.
   - Fetches canonical same-origin pages.
   - Scores route health, backlink health, render stability, product connectivity,
     ARCHCOIN vault health, showroom health, Upper Room event clarity, and system stability.
   - No DOM mutation. Gauges page consumes this module.
========================================================================== */

const AUDIT_VERSION = "SITE_AUDIT_ENGINE_B1";

const ROUTES = Object.freeze([
  {
    key: "compass",
    label: "Compass",
    path: "/",
    required: ["Diamond", "Gate", "Bridge"],
    backlinks: ["/products/", "/gauges/"]
  },
  {
    key: "door",
    label: "Door",
    path: "/door/",
    required: ["Door"],
    backlinks: ["/", "/products/"]
  },
  {
    key: "products",
    label: "Products",
    path: "/products/",
    required: ["Products", "ARCHCOIN", "On Your Side", "Education", "Nutrition"],
    backlinks: ["/products/archcoin/", "/products/on-your-side-ai/", "/products/education/", "/products/nutrition/"]
  },
  {
    key: "archcoin",
    label: "ARCHCOIN",
    path: "/products/archcoin/",
    required: ["ARCHCOIN", "Vault Chamber", "North Coin", "East Coin", "South Coin", "West Coin"],
    backlinks: ["#north-coin", "#east-coin", "#south-coin", "#west-coin", "#archcoin-collective-utility", "/products/"]
  },
  {
    key: "onYourSideAI",
    label: "On Your Side AI",
    path: "/products/on-your-side-ai/",
    required: ["AI", "On Your Side"],
    backlinks: ["/products/", "/products/archcoin/"]
  },
  {
    key: "education",
    label: "ESL Traversal Learning",
    path: "/products/education/",
    required: ["ESL", "Traversal", "Learning"],
    backlinks: ["/products/"]
  },
  {
    key: "nutrition",
    label: "Baseline Nutrition Systems",
    path: "/products/nutrition/",
    required: ["Nutrition", "Baseline"],
    backlinks: ["/products/"]
  },
  {
    key: "showroom",
    label: "Showroom",
    path: "/showroom/",
    required: ["Showroom"],
    backlinks: ["/", "/products/", "/gauges/"]
  },
  {
    key: "upperRoom",
    label: "Upper Room",
    path: "/big-laugh/upper-room/",
    required: ["Upper Room", "raffle"],
    backlinks: ["/", "/products/", "/gauges/"]
  },
  {
    key: "gauges",
    label: "Gauges",
    path: "/gauges/",
    required: ["Gauges", "Telemetry"],
    backlinks: ["/", "/products/", "/products/archcoin/"]
  }
]);

const SCORE_LABELS = Object.freeze({
  optimal: { min: 96, label: "Optimal", state: "active" },
  healthy: { min: 90, label: "Healthy", state: "healthy" },
  proof: { min: 84, label: "Proof", state: "proof" },
  watch: { min: 78, label: "Watch", state: "watch" },
  complex: { min: 70, label: "Complex", state: "complex" },
  break: { min: 0, label: "Break", state: "break" }
});

function nowISO() {
  return new Date().toISOString();
}

function clampScore(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values) {
  const safe = values.filter(Number.isFinite);
  if (!safe.length) return 0;
  return safe.reduce((sum, value) => sum + value, 0) / safe.length;
}

function includesText(html, needle) {
  return String(html || "").toLowerCase().includes(String(needle || "").toLowerCase());
}

function countMatches(html, list) {
  return list.reduce((count, item) => count + (includesText(html, item) ? 1 : 0), 0);
}

function markerScore(html, markers) {
  if (!markers.length) return 100;
  return clampScore((countMatches(html, markers) / markers.length) * 100);
}

function looksLikeRawJavaScript(html) {
  const text = String(html || "").trim();
  if (!text) return false;
  if (text.startsWith("/*") && text.includes("TNT RENEWAL")) return true;
  if (text.startsWith("(() =>")) return true;
  if (text.startsWith("const ") && text.includes("document.")) return true;
  return false;
}

function hasBasicHTMLShape(html) {
  const text = String(html || "");
  return includesText(text, "<html") || includesText(text, "<body") || includesText(text, "<main");
}

function classify(score) {
  const entries = Object.values(SCORE_LABELS);
  return entries.find((entry) => score >= entry.min) || SCORE_LABELS.break;
}

async function fetchRoute(route, timeoutMs = 9000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  const cacheBust = route.path.includes("?") ? "&" : "?";
  const url = route.path + cacheBust + "audit=" + Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal
    });

    const html = await response.text();

    return {
      key: route.key,
      label: route.label,
      path: route.path,
      ok: response.ok,
      status: response.status,
      html,
      length: html.length,
      error: null
    };
  } catch (error) {
    return {
      key: route.key,
      label: route.label,
      path: route.path,
      ok: false,
      status: 0,
      html: "",
      length: 0,
      error: error && error.message ? error.message : "Fetch failed"
    };
  } finally {
    window.clearTimeout(timeout);
  }
}

function scoreRoute(route, result) {
  const shape = hasBasicHTMLShape(result.html);
  const rawJs = looksLikeRawJavaScript(result.html);
  const requiredScore = markerScore(result.html, route.required);
  const backlinkScore = markerScore(result.html, route.backlinks);

  let renderScore = 0;
  if (result.ok) renderScore += 45;
  if (shape) renderScore += 35;
  if (result.length > 1800) renderScore += 10;
  if (!rawJs) renderScore += 10;

  renderScore = clampScore(renderScore);

  const total = clampScore(
    average([
      result.ok ? 100 : 0,
      renderScore,
      requiredScore,
      route.backlinks.length ? backlinkScore : 100
    ])
  );

  return {
    key: route.key,
    label: route.label,
    path: route.path,
    status: result.status,
    ok: result.ok,
    length: result.length,
    rawJs,
    requiredScore,
    backlinkScore,
    renderScore,
    score: total,
    missingRequired: route.required.filter((item) => !includesText(result.html, item)),
    missingBacklinks: route.backlinks.filter((item) => !includesText(result.html, item)),
    error: result.error
  };
}

function scoreARCHCOIN(routeScores) {
  const arch = routeScores.archcoin;
  if (!arch) return 0;

  const html = arch.html || "";
  const markers = [
    "ARCHCOIN",
    "Vault Chamber",
    "North Coin",
    "East Coin",
    "South Coin",
    "West Coin",
    "Contract Authority",
    "Inbound Value",
    "Outbound Obligation",
    "Growth / Allocation",
    "north-coin",
    "east-coin",
    "south-coin",
    "west-coin"
  ];

  const collectiveMarkers = [
    "Collective Utility",
    "Four coins",
    "One transaction map",
    "archcoin-collective-utility"
  ];

  const base = arch.ok ? 25 : 0;
  const shape = arch.renderScore * 0.20;
  const marker = markerScore(html, markers) * 0.40;
  const collective = markerScore(html, collectiveMarkers) * 0.15;

  return clampScore(base + shape + marker + collective);
}

function scoreUpperRoom(routeScores) {
  const upper = routeScores.upperRoom;
  if (!upper) return 0;

  const html = upper.html || "";
  const eventMarkers = [
    "Upper Room",
    "raffle",
    "Sunday",
    "Thursday",
    "four weeks",
    "eight shows",
    "drink",
    "comedy"
  ];

  const base = upper.ok ? 35 : 0;
  const marker = markerScore(html, eventMarkers) * 0.45;
  const render = upper.renderScore * 0.20;

  return clampScore(base + marker + render);
}

function scoreProducts(routeScores) {
  const keys = ["products", "archcoin", "onYourSideAI", "education", "nutrition"];
  return clampScore(average(keys.map((key) => routeScores[key] ? routeScores[key].score : 0)));
}

function scoreBacklinks(routeScores) {
  return clampScore(average(Object.values(routeScores).map((route) => route.backlinkScore)));
}

function scoreRoutes(routeScores) {
  return clampScore(average(Object.values(routeScores).map((route) => route.ok ? 100 : 0)));
}

function scoreRender(routeScores) {
  return clampScore(average(Object.values(routeScores).map((route) => route.renderScore)));
}

function scoreShowroom(routeScores) {
  const showroom = routeScores.showroom;
  if (!showroom) return 0;

  const html = showroom.html || "";
  const markers = ["Showroom", "Earth", "canvas", "Products", "Compass"];
  const base = showroom.ok ? 35 : 0;
  const marker = markerScore(html, markers) * 0.40;
  const render = showroom.renderScore * 0.25;

  return clampScore(base + marker + render);
}

function makeGauge(id, key, title, value, meaning, receiptExtra = "") {
  const score = clampScore(value);
  const classified = classify(score);

  return {
    id,
    key,
    title,
    value: score,
    state: classified.state,
    label: classified.label,
    meaning,
    receipt: [
      `${key.toUpperCase()}=${score}${receiptExtra ? " | " + receiptExtra : ""}`
    ]
  };
}

function buildGaugeReadings(routeScores, rawScores) {
  return [
    makeGauge(
      "G01",
      "routeIntegrity",
      "Route Integrity",
      rawScores.routeIntegrity,
      "Primary route movement is calculated from current same-origin route responses.",
      "LIVE_SCAN=TRUE"
    ),
    makeGauge(
      "G02",
      "backlinkIntegrity",
      "Backlink Integrity",
      rawScores.backlinkIntegrity,
      "Canonical backlink health is calculated from current page anchors and route references.",
      "RULE=ONE_DESTINATION"
    ),
    makeGauge(
      "G03",
      "renderStability",
      "Render Stability",
      rawScores.renderStability,
      "Render stability is based on HTML shape, length, status, and raw-JS exposure checks.",
      "RAW_JS_GUARD=ACTIVE"
    ),
    makeGauge(
      "G04",
      "productConnectivity",
      "Product Connectivity",
      rawScores.productConnectivity,
      "Product health is calculated from Products plus the active product destination pages.",
      "ROOM=SOURCE_CHAMBER"
    ),
    makeGauge(
      "G05",
      "vaultArchcoin",
      "Vault / ARCHCOIN",
      rawScores.archcoinHealth,
      "ARCHCOIN health is calculated from live Vault, four-coin, and utility-anchor evidence.",
      "ANCHOR_SCAN=ACTIVE"
    ),
    makeGauge(
      "G06",
      "showroomHealth",
      "Showroom Health",
      rawScores.showroomHealth,
      "Showroom health is calculated from current page evidence and proof-window markers.",
      "ROLE=PROOF_WINDOW"
    ),
    makeGauge(
      "G07",
      "upperRoomEvents",
      "Upper Room Events",
      rawScores.upperRoomEvents,
      "Upper Room health is calculated from event-path, raffle, and public clarity markers.",
      "INTERPRETATION_SCAN=ACTIVE"
    ),
    makeGauge(
      "G08",
      "systemStability",
      "System Stability",
      rawScores.systemStability,
      "System stability is the weighted live average of route, render, product, vault, showroom, and event health.",
      "STATE=LIVE_CALCULATED"
    )
  ];
}

function buildReceipts(routeScores) {
  return Object.values(routeScores).map((route) => ({
    label: route.label,
    path: route.path,
    score: route.score,
    status: route.status,
    ok: route.ok,
    rawJs: route.rawJs,
    missingRequired: route.missingRequired,
    missingBacklinks: route.missingBacklinks,
    error: route.error
  }));
}

export async function runSiteAudit() {
  const startedAt = nowISO();
  const results = await Promise.all(ROUTES.map((route) => fetchRoute(route)));

  const routeScores = {};
  for (const route of ROUTES) {
    const result = results.find((item) => item.key === route.key);
    const scored = scoreRoute(route, result);
    scored.html = result.html;
    routeScores[route.key] = scored;
  }

  const rawScores = {
    routeIntegrity: scoreRoutes(routeScores),
    backlinkIntegrity: scoreBacklinks(routeScores),
    renderStability: scoreRender(routeScores),
    productConnectivity: scoreProducts(routeScores),
    archcoinHealth: scoreARCHCOIN(routeScores),
    showroomHealth: scoreShowroom(routeScores),
    upperRoomEvents: scoreUpperRoom(routeScores)
  };

  rawScores.systemStability = clampScore(
    rawScores.routeIntegrity * 0.14 +
    rawScores.backlinkIntegrity * 0.14 +
    rawScores.renderStability * 0.14 +
    rawScores.productConnectivity * 0.16 +
    rawScores.archcoinHealth * 0.16 +
    rawScores.showroomHealth * 0.10 +
    rawScores.upperRoomEvents * 0.10 +
    6
  );

  const completedAt = nowISO();

  return {
    version: AUDIT_VERSION,
    startedAt,
    completedAt,
    routes: buildReceipts(routeScores),
    scores: rawScores,
    readings: buildGaugeReadings(routeScores, rawScores),
    summary:
      `SITE_AUDIT=${AUDIT_VERSION} | SYSTEM_STABILITY=${rawScores.systemStability} | ARCHCOIN=${rawScores.archcoinHealth} | UPPER_ROOM=${rawScores.upperRoomEvents} | COMPLETED_AT=${completedAt}`
  };
}

export { ROUTES };
