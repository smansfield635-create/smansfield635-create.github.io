// /gauges/index.js
// TNT FULL-FILE REPLACEMENT
// GAUGES_TRUTH_SUMMARY_ROLE_RENEWAL_HTML_JS_TNT_v1
// Role:
// - Summarize served truth.
// - Verify current route/status signals.
// - Do not act as progress engine.
// - Do not frame Gauges as the primary proof path.
// - Laws remains proof/truth/scientific backing.
// - Gauges remains measurement/audit/route-status verification.

const GAUGES_TRUTH_SUMMARY_CONTRACT = Object.freeze({
  contract: "GAUGES_TRUTH_SUMMARY_ROLE_RENEWAL_HTML_JS_TNT_v1",
  previousContract: "TRIPLE_G_EXIT_RELEASE_FALSE_POSITIVE_REPAIR_TNT_v1",
  route: "/gauges/",
  proofPath: "/laws/",
  proofAuthority: "Laws",
  gaugesRole: "measurement-audit-route-status-summary",
  progressEngine: false,
  generatedImage: false,
  graphicBox: false,
  streaming: false,
  visualPassClaimed: false
});

const ROUTES = Object.freeze({
  parent: "/showroom/globe/",
  hEarth: "/showroom/globe/h-earth/",
  hEarthRuntime: "/showroom/globe/h-earth/index.js",
  laws: "/laws/",
  gauges: "/gauges/"
});

const state = {
  logs: [],
  lanes: [],
  confirmed: 0,
  held: 0,
  review: 0
};

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });
}

function log(message) {
  state.logs.push(`[${nowStamp()}] ${message}`);
  const node = document.getElementById("auditLog");
  if (node) node.textContent = state.logs.join("\n");
}

function textIncludes(text, token) {
  return String(text || "").includes(token);
}

function countMatches(text, expression) {
  const matches = String(text || "").match(expression);
  return matches ? matches.length : 0;
}

function getAttr(text, attrName) {
  const pattern = new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`, "i");
  const match = String(text || "").match(pattern);
  return match ? match[1] : null;
}

async function fetchText(path) {
  const response = await fetch(`${path}?truth-summary=${Date.now()}`, {
    cache: "no-store",
    credentials: "same-origin"
  });

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  return response.text();
}

function makeLane(status, title, subtitle, checks) {
  return { status, title, subtitle, checks };
}

function statusClass(status) {
  if (status === "Confirmed") return "confirmed";
  if (status === "Held") return "held";
  return "review";
}

function renderLanes() {
  const stack = document.getElementById("laneStack");
  if (!stack) return;

  stack.innerHTML = "";

  state.lanes.forEach((lane) => {
    const article = document.createElement("article");
    article.className = "lane-card";

    const head = document.createElement("div");
    head.className = "lane-head";

    const titleWrap = document.createElement("div");
    titleWrap.className = "lane-title";

    const eyebrow = document.createElement("b");
    eyebrow.textContent = lane.status;

    const title = document.createElement("h3");
    title.textContent = lane.title;

    titleWrap.append(eyebrow, title);

    const status = document.createElement("span");
    status.className = `status ${statusClass(lane.status)}`;
    status.textContent = lane.status;

    head.append(titleWrap, status);

    const subtitle = document.createElement("span");
    subtitle.textContent = lane.subtitle;

    const list = document.createElement("ul");
    list.className = "checks";

    lane.checks.forEach((check) => {
      const li = document.createElement("li");
      li.textContent = check;
      list.appendChild(li);
    });

    article.append(head, subtitle, list);
    stack.appendChild(article);
  });
}

function renderTotals() {
  state.confirmed = state.lanes.filter((lane) => lane.status === "Confirmed").length;
  state.held = state.lanes.filter((lane) => lane.status === "Held").length;
  state.review = state.lanes.filter((lane) => lane.status === "Needs Review").length;

  const confirmedNode = document.getElementById("confirmedCount");
  const heldNode = document.getElementById("heldCount");
  const reviewNode = document.getElementById("reviewCount");
  const overallStatus = document.getElementById("overallStatus");
  const overallText = document.getElementById("overallText");

  if (confirmedNode) confirmedNode.textContent = String(state.confirmed);
  if (heldNode) heldNode.textContent = String(state.held);
  if (reviewNode) reviewNode.textContent = String(state.review);

  if (overallStatus && overallText) {
    if (state.review > 0) {
      overallStatus.textContent = "Needs Review";
      overallText.textContent = "One or more served-state checks need human review. This is a truth summary, not a progress command.";
    } else if (state.held > 0) {
      overallStatus.textContent = "Confirmed with Holds";
      overallText.textContent = "The served state is mostly confirmed, with known holds preserved as holds.";
    } else {
      overallStatus.textContent = "Confirmed";
      overallText.textContent = "The current served-state summary contains no review items.";
    }
  }
}

function renderTruthSummary() {
  const wins = document.getElementById("winsText");
  const hold = document.getElementById("holdText");
  const review = document.getElementById("reviewText");

  if (wins) {
    wins.textContent = state.confirmed
      ? `${state.confirmed} summary lane(s) are confirmed from served route signals.`
      : "No lanes confirmed yet.";
  }

  if (hold) {
    hold.textContent = state.held
      ? `${state.held} lane(s) are held. Holds identify known gaps without treating them as failed architecture.`
      : "No holds detected in this run.";
  }

  if (review) {
    review.textContent = state.review
      ? `${state.review} lane(s) need review. Review means inspect the served state; it does not automatically authorize a rebuild.`
      : "No review target detected in this run.";
  }
}

function summarizeParent(parentHtml) {
  const hasCanvas = /<canvas[\s>]/i.test(parentHtml);
  const childLinks = [
    textIncludes(parentHtml, "/showroom/globe/earth/"),
    textIncludes(parentHtml, "/showroom/globe/h-earth/"),
    textIncludes(parentHtml, "/showroom/globe/audralia/")
  ];

  const selectorSignals = [
    textIncludes(parentHtml, "selector"),
    textIncludes(parentHtml, "Globe"),
    textIncludes(parentHtml, "Interactive Narrative"),
    childLinks.every(Boolean)
  ];

  const importsMaterialRuntime =
    textIncludes(parentHtml, "h-earth.canvas") ||
    textIncludes(parentHtml, "h-earth.surface") ||
    textIncludes(parentHtml, "material.renderer") ||
    textIncludes(parentHtml, "planet-one");

  if (childLinks.every(Boolean) && !hasCanvas && !importsMaterialRuntime) {
    return makeLane(
      "Confirmed",
      "Parent Selector Summary",
      "The parent route appears to act as a selector rather than the H-Earth render owner.",
      [
        `Parent child links present=${childLinks.join(",")}`,
        `Parent canvas count=${countMatches(parentHtml, /<canvas[\s>]/gi)}`,
        `Material-renderer import signal=${importsMaterialRuntime}`,
        "Summary: parent selection role is confirmed from served HTML."
      ]
    );
  }

  return makeLane(
    "Needs Review",
    "Parent Selector Summary",
    "The parent selector route needs human review before interpretation.",
    [
      `Parent child links present=${childLinks.join(",")}`,
      `Parent canvas count=${countMatches(parentHtml, /<canvas[\s>]/gi)}`,
      `Material-renderer import signal=${importsMaterialRuntime}`,
      "Review: confirm the parent route is not owning child render authority."
    ]
  );
}

function summarizeChildPlacement(childHtml) {
  const dataRoute = getAttr(childHtml, "data-route");
  const hasConditionStage =
    textIncludes(childHtml, "condition-stage") ||
    textIncludes(childHtml, "condition stage") ||
    textIncludes(childHtml, "earth-water-air-condition-stack");

  const hasCanvas = /<canvas[\s>]/i.test(childHtml);
  const childPlacement =
    textIncludes(childHtml, "/showroom/globe/h-earth/") ||
    dataRoute === "/showroom/globe/h-earth/";

  if (childPlacement && hasConditionStage) {
    return makeLane(
      "Confirmed",
      "H-Earth Child Route Summary",
      "The H-Earth route still presents as the child route for the Earth · Water · Air condition stack.",
      [
        `data-route=${dataRoute || "not declared"}`,
        `condition-stage signal=${hasConditionStage}`,
        `canvas element present=${hasCanvas}`,
        "Summary: H-Earth placement remains child-route oriented."
      ]
    );
  }

  return makeLane(
    "Needs Review",
    "H-Earth Child Route Summary",
    "The child-route placement signals need review.",
    [
      `data-route=${dataRoute || "not declared"}`,
      `condition-stage signal=${hasConditionStage}`,
      `canvas element present=${hasCanvas}`,
      "Review: confirm H-Earth still owns the child scene route."
    ]
  );
}

function summarizeClassicBoot(childHtml, runtimeText) {
  const hasRuntimeScript =
    textIncludes(childHtml, "index.js") ||
    textIncludes(childHtml, "classic") ||
    textIncludes(childHtml, "runtimeBoot");

  const hasCanvasCreation =
    /createElement\(["']canvas["']\)/i.test(runtimeText) ||
    /querySelector\([^)]*canvas/i.test(runtimeText) ||
    /getContext\(["']2d["']\)/i.test(runtimeText);

  const hasDraw =
    textIncludes(runtimeText, "fillRect") ||
    textIncludes(runtimeText, "stroke") ||
    textIncludes(runtimeText, "renderedOnce") ||
    textIncludes(runtimeText, "draw");

  if (hasRuntimeScript && hasCanvasCreation && hasDraw) {
    return makeLane(
      "Confirmed",
      "Classic Canvas Summary",
      "The served H-Earth runtime still contains canvas and drawing signals.",
      [
        `runtime script signal in HTML=${hasRuntimeScript}`,
        `canvas/context signal in runtime=${hasCanvasCreation}`,
        `draw/render signal=${hasDraw}`,
        "Summary: classic canvas paint capability is present from source signals."
      ]
    );
  }

  return makeLane(
    "Needs Review",
    "Classic Canvas Summary",
    "Canvas paint signals need review from the served runtime.",
    [
      `runtime script signal in HTML=${hasRuntimeScript}`,
      `canvas/context signal in runtime=${hasCanvasCreation}`,
      `draw/render signal=${hasDraw}`,
      "Review: confirm the child canvas still boots and paints."
    ]
  );
}

function summarizeConditionStack(childHtml, runtimeText) {
  const combined = `${childHtml}\n${runtimeText}`;
  const hasEarth = /earth|ground|soil|terrain/i.test(combined);
  const hasWater = /water|ocean|sea|blue/i.test(combined);
  const hasAir = /air|sky|atmosphere|haze/i.test(combined);
  const hasConditionModel = textIncludes(combined, "earth-water-air-condition-stack");

  if ((hasEarth && hasWater && hasAir) || hasConditionModel) {
    return makeLane(
      "Confirmed",
      "Condition Stack Summary",
      "Earth, Water, and Air remain represented by the served route/runtime signals.",
      [
        `earth signal=${hasEarth}`,
        `water signal=${hasWater}`,
        `air signal=${hasAir}`,
        `condition model signal=${hasConditionModel}`,
        "Summary: condition-stack visibility remains represented."
      ]
    );
  }

  return makeLane(
    "Needs Review",
    "Condition Stack Summary",
    "The condition stack needs review because one or more material names were not found.",
    [
      `earth signal=${hasEarth}`,
      `water signal=${hasWater}`,
      `air signal=${hasAir}`,
      `condition model signal=${hasConditionModel}`,
      "Review: confirm the visible stack still expresses Earth, Water, and Air."
    ]
  );
}

function summarizeRuntimeCleanup(runtimeText) {
  const hasPagehide = textIncludes(runtimeText, "pagehide");
  const hasVisibility = textIncludes(runtimeText, "visibilitychange");
  const hasCancel = textIncludes(runtimeText, "cancelAnimationFrame");
  const hasStop = /\bstop\s*\(/i.test(runtimeText) || textIncludes(runtimeText, "cleanup");

  if (hasPagehide && hasVisibility && hasCancel) {
    return makeLane(
      "Confirmed",
      "Runtime Cleanup Summary",
      "The runtime still contains exit-release and cleanup signals.",
      [
        `pagehide cleanup signal=${hasPagehide}`,
        `visibilitychange cleanup signal=${hasVisibility}`,
        `cancelAnimationFrame signal=${hasCancel}`,
        `stop/cleanup signal=${hasStop}`,
        "Summary: cleanup posture remains present."
      ]
    );
  }

  return makeLane(
    "Held",
    "Runtime Cleanup Summary",
    "Cleanup signals are partially present or unavailable from served source scan.",
    [
      `pagehide cleanup signal=${hasPagehide}`,
      `visibilitychange cleanup signal=${hasVisibility}`,
      `cancelAnimationFrame signal=${hasCancel}`,
      `stop/cleanup signal=${hasStop}`,
      "Hold: review source before treating cleanup posture as broken."
    ]
  );
}

function summarizeBaselinePurity(childHtml, runtimeText) {
  const combined = `${childHtml}\n${runtimeText}`;
  const generatedFlag = getAttr(childHtml, "data-generated-image");
  const graphicFlag = getAttr(childHtml, "data-graphic-box");
  const mediaCount = countMatches(childHtml, /<(img|video|picture)\b/gi);
  const crossPlanetSwitcher =
    textIncludes(runtimeText, "audralia") ||
    textIncludes(runtimeText, "zionts") ||
    textIncludes(runtimeText, "planet switcher");

  if (generatedFlag === "false" && graphicFlag === "false" && mediaCount === 0 && !crossPlanetSwitcher) {
    return makeLane(
      "Confirmed",
      "Baseline Purity Summary",
      "No generated-image, GraphicBox, media, or cross-planet switcher signal is visible in the H-Earth scan.",
      [
        `data-generated-image=${generatedFlag}`,
        `data-graphic-box=${graphicFlag}`,
        `image/video/picture count=${mediaCount}`,
        `cross-planet switcher signal=${crossPlanetSwitcher}`,
        "Summary: baseline purity remains confirmed from served source."
      ]
    );
  }

  return makeLane(
    "Needs Review",
    "Baseline Purity Summary",
    "Baseline purity needs review before interpretation.",
    [
      `data-generated-image=${generatedFlag}`,
      `data-graphic-box=${graphicFlag}`,
      `image/video/picture count=${mediaCount}`,
      `cross-planet switcher signal=${crossPlanetSwitcher}`,
      "Review: confirm no unauthorized objects have entered the child scene."
    ]
  );
}

function summarizeMaterialExpression(childHtml, runtimeText) {
  const combined = `${childHtml}\n${runtimeText}`;
  const hasMaterialContract =
    textIncludes(combined, "MATERIAL_EXPRESSION") ||
    textIncludes(combined, "material-expression") ||
    textIncludes(combined, "atmospheric-depth") ||
    textIncludes(combined, "reflection") ||
    textIncludes(combined, "shoreline");

  if (hasMaterialContract) {
    return makeLane(
      "Confirmed",
      "Material Expression Summary",
      "Material-expression signals are present in the served source.",
      [
        `material-expression signal=${hasMaterialContract}`,
        "Summary: material expression appears to be active or staged in source."
      ]
    );
  }

  return makeLane(
    "Held",
    "Material Expression Summary",
    "The scene may be functional while material expression remains primitive or unstaged.",
    [
      `material-expression signal=${hasMaterialContract}`,
      "Hold: air, water, and earth may need future physical readability review.",
      "Suggested review target: material expression, if the visual goal requires it."
    ]
  );
}

async function runTruthSummary() {
  state.logs = [];
  state.lanes = [];
  log(`Starting ${GAUGES_TRUTH_SUMMARY_CONTRACT.contract}.`);
  log("Frame: Gauges summarizes truth. Laws carries proof. Gauges is not the progress engine.");

  try {
    log(`Fetching parent selector route: ${ROUTES.parent}`);
    const parentHtml = await fetchText(ROUTES.parent);

    log(`Fetching H-Earth child route: ${ROUTES.hEarth}`);
    const childHtml = await fetchText(ROUTES.hEarth);

    log(`Fetching H-Earth child runtime source: ${ROUTES.hEarthRuntime}`);
    let runtimeText = "";
    try {
      runtimeText = await fetchText(ROUTES.hEarthRuntime);
    } catch (error) {
      log(`Runtime source unavailable for source scan: ${error.message}`);
      runtimeText = "";
    }

    state.lanes.push(summarizeParent(parentHtml));
    state.lanes.push(summarizeChildPlacement(childHtml));
    state.lanes.push(summarizeClassicBoot(childHtml, runtimeText));
    state.lanes.push(summarizeConditionStack(childHtml, runtimeText));
    state.lanes.push(summarizeRuntimeCleanup(runtimeText));
    state.lanes.push(summarizeBaselinePurity(childHtml, runtimeText));
    state.lanes.push(summarizeMaterialExpression(childHtml, runtimeText));

    renderLanes();
    renderTotals();
    renderTruthSummary();

    log("Truth summary complete.");
    log(`Confirmed=${state.confirmed}; Held=${state.held}; Needs Review=${state.review}.`);
  } catch (error) {
    state.lanes = [
      makeLane(
        "Needs Review",
        "Truth Summary Fetch",
        "One or more served routes could not be fetched.",
        [
          error.message || "Unknown fetch error",
          "Review: verify deployed routes and same-origin fetch availability."
        ]
      )
    ];

    renderLanes();
    renderTotals();
    renderTruthSummary();
    log(`Truth summary stopped for review: ${error.message || error}`);
  }
}

function boot() {
  window.DGBTripleGTruthSummary = Object.freeze({
    ...GAUGES_TRUTH_SUMMARY_CONTRACT,
    run: runTruthSummary,
    status() {
      return Object.freeze({
        contract: GAUGES_TRUTH_SUMMARY_CONTRACT.contract,
        proofAuthority: GAUGES_TRUTH_SUMMARY_CONTRACT.proofAuthority,
        gaugesRole: GAUGES_TRUTH_SUMMARY_CONTRACT.gaugesRole,
        progressEngine: false,
        confirmed: state.confirmed,
        held: state.held,
        review: state.review,
        lanes: state.lanes.map((lane) => ({ status: lane.status, title: lane.title }))
      });
    }
  });

  document.documentElement.dataset.gaugesContract = GAUGES_TRUTH_SUMMARY_CONTRACT.contract;
  document.documentElement.dataset.gaugesRole = "truth-summary";
  document.documentElement.dataset.proofPath = "/laws/";
  document.documentElement.dataset.progressEngine = "false";

  const runButton = document.getElementById("runTripleG");
  if (runButton) runButton.addEventListener("click", runTruthSummary);

  log("Triple G truth-summary role renewal booted.");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
