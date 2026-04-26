/*
  Diamond Gate Bridge — Gauges Health Runtime
  File: /gauges/gauges_health_runtime.js
  Generation: 1
  Baseline: 4
  Purpose: Convert the Gauges page into a website health instrument panel.
*/

(function () {
  "use strict";

  const RUNTIME_NAME = "DGBGaugesHealthRuntime";
  const VERSION = "1.0.0";

  const ROUTES = Object.freeze([
    {
      id: "home",
      label: "Home",
      path: "/",
      expectedTerms: ["Diamond", "Bridge"],
      expectedLinks: ["/products/", "/laws/", "/gauges/"]
    },
    {
      id: "products",
      label: "Products",
      path: "/products/",
      expectedTerms: ["Products"],
      expectedLinks: ["/", "/gauges/"]
    },
    {
      id: "laws",
      label: "Laws",
      path: "/laws/",
      expectedTerms: ["Law", "Laws"],
      expectedLinks: ["/", "/gauges/"]
    },
    {
      id: "governance",
      label: "Governance",
      path: "/governance/",
      expectedTerms: ["Governance"],
      expectedLinks: ["/", "/gauges/"]
    },
    {
      id: "gauges",
      label: "Gauges",
      path: "/gauges/",
      expectedTerms: ["Website Health", "Gauges"],
      expectedLinks: ["/", "/products/", "/laws/"],
      expectedScripts: ["/gauges/gauges_health_runtime.js"]
    }
  ]);

  const RUNTIMES = Object.freeze([
    {
      id: "gaugesHealthRuntime",
      label: "Gauges health runtime",
      path: "/gauges/gauges_health_runtime.js",
      required: true
    },
    {
      id: "gaugesVisualRuntime",
      label: "Gauges visual runtime",
      path: "/gauges/gauges_runtime.js",
      required: false
    }
  ]);

  const state = {
    name: RUNTIME_NAME,
    version: VERSION,
    status: "idle",
    startedAt: null,
    finishedAt: null,
    routes: [],
    runtimes: [],
    scores: {
      overall: 0,
      structure: 0,
      runtime: 0,
      content: 0,
      driftRisk: 100
    },
    working: [],
    issues: [],
    actions: []
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function round(value) {
    return Math.round(Number(value) || 0);
  }

  function normalizeText(html) {
    return String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasTerm(text, terms) {
    const haystack = String(text || "").toLowerCase();
    return terms.some(function (term) {
      return haystack.includes(String(term).toLowerCase());
    });
  }

  function countMatches(text, values) {
    const haystack = String(text || "").toLowerCase();

    return values.reduce(function (count, value) {
      const needle = String(value).toLowerCase();
      return haystack.includes(needle) ? count + 1 : count;
    }, 0);
  }

  function statusFromScore(score) {
    if (score >= 82) return "strong";
    if (score >= 68) return "stable";
    if (score >= 50) return "watch";
    return "fail";
  }

  async function fetchText(path) {
    const controller = new AbortController();
    const timeout = window.setTimeout(function () {
      controller.abort();
    }, 6500);

    try {
      const response = await window.fetch(path, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        signal: controller.signal
      });

      const text = await response.text();

      return {
        ok: response.ok,
        status: response.status,
        url: path,
        text: text
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        url: path,
        text: "",
        error: error && error.name ? error.name : "FETCH_FAILED"
      };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function checkRoute(route) {
    const result = await fetchText(route.path);
    const visibleText = normalizeText(result.text);
    const textLength = visibleText.length;

    const hasExpectedTerm = hasTerm(visibleText, route.expectedTerms || []);
    const linkMatches = countMatches(result.text, route.expectedLinks || []);
    const scriptMatches = countMatches(result.text, route.expectedScripts || []);

    const linkTotal = route.expectedLinks && route.expectedLinks.length ? route.expectedLinks.length : 0;
    const scriptTotal = route.expectedScripts && route.expectedScripts.length ? route.expectedScripts.length : 0;

    const presentScore = result.ok ? 25 : 0;
    const contentScore = clamp((textLength / 420) * 25, 0, 25);
    const termScore = hasExpectedTerm ? 25 : 0;
    const linkScore = linkTotal ? (linkMatches / linkTotal) * 15 : 15;
    const scriptScore = scriptTotal ? (scriptMatches / scriptTotal) * 10 : 10;

    const score = round(presentScore + contentScore + termScore + linkScore + scriptScore);

    return {
      id: route.id,
      label: route.label,
      path: route.path,
      ok: result.ok,
      httpStatus: result.status,
      score: clamp(score, 0, 100),
      status: statusFromScore(score),
      visibleTextLength: textLength,
      expectedTermFound: hasExpectedTerm,
      expectedLinkMatches: linkMatches,
      expectedLinkTotal: linkTotal,
      expectedScriptMatches: scriptMatches,
      expectedScriptTotal: scriptTotal,
      problem: deriveRouteProblem(result, textLength, hasExpectedTerm, linkMatches, linkTotal, scriptMatches, scriptTotal)
    };
  }

  async function checkRuntime(runtime) {
    const result = await fetchText(runtime.path);
    const appearsToBeScript =
      result.text.includes("function") ||
      result.text.includes("const ") ||
      result.text.includes("window.") ||
      result.text.includes(RUNTIME_NAME);

    let score = 0;
    if (result.ok) score += 55;
    if (appearsToBeScript) score += 35;
    if (!runtime.required && !result.ok) score = 58;

    return {
      id: runtime.id,
      label: runtime.label,
      path: runtime.path,
      required: runtime.required,
      ok: result.ok,
      httpStatus: result.status,
      scriptShape: appearsToBeScript,
      score: clamp(score, 0, 100),
      status: statusFromScore(score),
      problem: deriveRuntimeProblem(runtime, result, appearsToBeScript)
    };
  }

  function deriveRouteProblem(result, textLength, hasExpectedTerm, linkMatches, linkTotal, scriptMatches, scriptTotal) {
    if (!result.ok) return "Route did not return a successful response.";
    if (textLength < 120) return "Route returned too little visible text.";
    if (!hasExpectedTerm) return "Route content does not match expected page identity.";
    if (linkTotal && linkMatches < linkTotal) return "Route is missing one or more expected navigation links.";
    if (scriptTotal && scriptMatches < scriptTotal) return "Route is missing one or more expected runtime scripts.";
    return "No current route problem detected.";
  }

  function deriveRuntimeProblem(runtime, result, appearsToBeScript) {
    if (!result.ok && runtime.required) return "Required runtime file is not reachable.";
    if (!result.ok && !runtime.required) return "Optional runtime file is not reachable.";
    if (!appearsToBeScript) return "Runtime file loaded but does not look like an active script.";
    return "Runtime file is reachable.";
  }

  function average(values) {
    if (!values.length) return 0;
    return values.reduce(function (sum, value) {
      return sum + value;
    }, 0) / values.length;
  }

  function computeScores(routes, runtimes) {
    const routeScores = routes.map(function (route) {
      return route.score;
    });

    const requiredRuntimeScores = runtimes
      .filter(function (runtime) {
        return runtime.required;
      })
      .map(function (runtime) {
        return runtime.score;
      });

    const allRuntimeScores = runtimes.map(function (runtime) {
      return runtime.score;
    });

    const contentSignals = routes.map(function (route) {
      let score = 0;
      if (route.visibleTextLength >= 420) score += 45;
      else score += clamp((route.visibleTextLength / 420) * 45, 0, 45);

      if (route.expectedTermFound) score += 35;
      if (route.status !== "fail") score += 20;

      return clamp(score, 0, 100);
    });

    const hardIssues = routes.filter(function (route) {
      return route.status === "fail";
    }).length;

    const watchIssues = routes.filter(function (route) {
      return route.status === "watch";
    }).length;

    const requiredRuntimeFailures = runtimes.filter(function (runtime) {
      return runtime.required && !runtime.ok;
    }).length;

    const structure = round(average(routeScores));
    const runtime = round(average(requiredRuntimeScores.length ? requiredRuntimeScores : allRuntimeScores));
    const content = round(average(contentSignals));
    const driftRisk = clamp(round(100 - average([structure, runtime, content]) + hardIssues * 8 + watchIssues * 4 + requiredRuntimeFailures * 12), 0, 100);
    const overall = clamp(round(average([structure, runtime, content, 100 - driftRisk])), 0, 100);

    return {
      overall: overall,
      structure: structure,
      runtime: runtime,
      content: content,
      driftRisk: driftRisk
    };
  }

  function buildWorking(routes, runtimes, scores) {
    const working = [];

    if (scores.structure >= 60) working.push("Core route structure is measurable from the gauges page.");
    if (scores.content >= 60) working.push("Visible page content is present across the measured route set.");
    if (scores.runtime >= 50) working.push("Required gauges health runtime is reachable and active.");
    if (document.getElementById("page-root")) working.push("Gauges page hard-render protection is present.");
    if (document.querySelector(".scene-3d")) working.push("Generation 1 Baseline 2/3 3D object anchor is preserved.");
    if (runtimes.some(function (runtime) { return runtime.id === "gaugesHealthRuntime" && runtime.ok; })) {
      working.push("The health dashboard has moved from static known-state read to browser-measured route checks.");
    }

    return working.length ? working : ["No confirmed working items were measured yet."];
  }

  function buildIssues(routes, runtimes, scores) {
    const issues = [];

    routes.forEach(function (route) {
      if (route.status === "fail" || route.status === "watch") {
        issues.push(route.label + ": " + route.problem);
      }
    });

    runtimes.forEach(function (runtime) {
      if (runtime.required && !runtime.ok) {
        issues.push(runtime.label + ": " + runtime.problem);
      }

      if (!runtime.required && !runtime.ok) {
        issues.push(runtime.label + ": optional enhancement is missing or not served.");
      }
    });

    if (scores.driftRisk >= 45) {
      issues.push("Drift risk is elevated because one or more routes or runtimes are not fully contracted.");
    }

    if (!document.querySelector("[data-route-ledger]")) {
      issues.push("Route ledger mount is missing from the gauges page.");
    }

    return issues.length ? issues : ["No active issue detected by the current client-side health model."];
  }

  function buildActions(routes, runtimes, scores) {
    const actions = [];

    routes.forEach(function (route) {
      if (!route.ok) {
        actions.push("Restore or create route: " + route.path);
      } else if (!route.expectedTermFound) {
        actions.push("Renew page identity content for " + route.label + ".");
      } else if (route.expectedLinkTotal && route.expectedLinkMatches < route.expectedLinkTotal) {
        actions.push("Repair navigation coverage on " + route.label + ".");
      }
    });

    runtimes.forEach(function (runtime) {
      if (runtime.required && !runtime.ok) {
        actions.push("Serve required runtime file: " + runtime.path);
      }
    });

    if (scores.runtime < 75) {
      actions.push("Bind page/runtime authority split so gauges page owns visuals and health runtime owns diagnostics.");
    }

    if (scores.structure < 80) {
      actions.push("Create a formal route manifest and make the gauges runtime read from that manifest.");
    }

    if (scores.content < 80) {
      actions.push("Renew lower-scoring pages into the active Generation 1 baseline standard.");
    }

    actions.push("After this baseline is stable, attach deeper checks for assets, scripts, page-specific runtimes, and blank-state failures.");

    return Array.from(new Set(actions));
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function setGauge(name, value, suffix) {
    const display = suffix ? value + suffix : String(value);
    setText('[data-gauge-value="' + name + '"]', display);

    const fill = document.querySelector('[data-gauge-fill="' + name + '"]');
    if (fill) fill.style.width = clamp(value, 0, 100) + "%";

    const score = document.querySelector('[data-gauge-score="' + name + '"]');
    if (score) score.textContent = value + " / 100";
  }

  function setList(selector, items) {
    const node = document.querySelector(selector);
    if (!node) return;

    node.innerHTML = "";

    items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      node.appendChild(li);
    });
  }

  function renderRouteLedger(routes) {
    const tbody = document.querySelector("[data-route-ledger]");
    if (!tbody) return;

    tbody.innerHTML = "";

    routes.forEach(function (route) {
      const tr = document.createElement("tr");

      const page = document.createElement("td");
      page.textContent = route.label;

      const path = document.createElement("td");
      path.textContent = route.path;

      const status = document.createElement("td");
      status.textContent = route.status.toUpperCase();
      status.setAttribute("data-status", route.status);

      const score = document.createElement("td");
      score.textContent = route.score + "/100";

      const problem = document.createElement("td");
      problem.textContent = route.problem;

      tr.appendChild(page);
      tr.appendChild(path);
      tr.appendChild(status);
      tr.appendChild(score);
      tr.appendChild(problem);

      tbody.appendChild(tr);
    });
  }

  function renderRuntimeLedger(runtimes) {
    const tbody = document.querySelector("[data-runtime-ledger]");
    if (!tbody) return;

    tbody.innerHTML = "";

    runtimes.forEach(function (runtime) {
      const tr = document.createElement("tr");

      const name = document.createElement("td");
      name.textContent = runtime.label;

      const path = document.createElement("td");
      path.textContent = runtime.path;

      const status = document.createElement("td");
      status.textContent = runtime.status.toUpperCase();
      status.setAttribute("data-status", runtime.status);

      const score = document.createElement("td");
      score.textContent = runtime.score + "/100";

      const problem = document.createElement("td");
      problem.textContent = runtime.problem;

      tr.appendChild(name);
      tr.appendChild(path);
      tr.appendChild(status);
      tr.appendChild(score);
      tr.appendChild(problem);

      tbody.appendChild(tr);
    });
  }

  function render() {
    setText("[data-health-runtime-status]", state.status.toUpperCase());
    setText("[data-health-overall]", state.scores.overall + "%");

    setGauge("structure", state.scores.structure);
    setGauge("runtime", state.scores.runtime);
    setGauge("content", state.scores.content);
    setGauge("drift", state.scores.driftRisk);

    setList("[data-working-list]", state.working);
    setList("[data-issues-list]", state.issues);
    setList("[data-actions-list]", state.actions);

    renderRouteLedger(state.routes);
    renderRuntimeLedger(state.runtimes);

    const stamp = state.finishedAt ? new Date(state.finishedAt).toLocaleTimeString() : "Pending";
    setText("[data-health-updated]", stamp);
  }

  async function run() {
    state.status = "measuring";
    state.startedAt = Date.now();
    state.finishedAt = null;
    render();

    const routeResults = await Promise.all(ROUTES.map(checkRoute));
    const runtimeResults = await Promise.all(RUNTIMES.map(checkRuntime));

    state.routes = routeResults;
    state.runtimes = runtimeResults;
    state.scores = computeScores(routeResults, runtimeResults);
    state.working = buildWorking(routeResults, runtimeResults, state.scores);
    state.issues = buildIssues(routeResults, runtimeResults, state.scores);
    state.actions = buildActions(routeResults, runtimeResults, state.scores);
    state.status = "complete";
    state.finishedAt = Date.now();

    render();

    return getState();
  }

  function getState() {
    return JSON.parse(JSON.stringify(state));
  }

  function validate() {
    return {
      ok: state.status === "complete" && state.routes.length > 0 && state.runtimes.length > 0,
      runtime: RUNTIME_NAME,
      version: VERSION,
      status: state.status,
      scores: JSON.parse(JSON.stringify(state.scores))
    };
  }

  const api = Object.freeze({
    name: RUNTIME_NAME,
    version: VERSION,
    run: run,
    getState: getState,
    validate: validate
  });

  window[RUNTIME_NAME] = api;

  function start() {
    run();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
