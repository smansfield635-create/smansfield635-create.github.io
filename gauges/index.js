// /gauges/index.js
const SOURCE_TARGETS = Object.freeze({
  parentHtml: "/showroom/globe/",
  parentJs: "/showroom/globe/index.js",
  earthHtml: "/showroom/globe/earth/",
  earthJs: "/showroom/globe/earth/index.js",
  audraliaHtml: "/showroom/globe/audralia/",
  audraliaJs: "/showroom/globe/audralia/index.js",
  earthAuthority: "/assets/earth/earth_canvas.js",
  audraliaAuthority: "/assets/audralia/audralia.planet.render.js"
});

const RAW_RECEIPT_PATTERNS = Object.freeze([
  /\bSHOWROOM_GLOBE_[A-Z0-9_]+/g,
  /\bROUTE_CONTROLLER_EXECUTED=/g,
  /\bIMPORT_ATTEMPTED=/g,
  /\bAUTHORITY_IMPORTED=/g,
  /\bMOUNT_EXISTS=/g,
  /\bSTATUS_SUMMARY=/g,
  /\bVISUAL_PASS=HELD/g,
  /\bGENERATION_CLAIMED=/g,
  /\bGROUND_ZERO_PARENT_ONLY=/g,
  /\bBODY_ADOPTION_BLOCKED=/g,
  /\bNO_CROSS_BODY_FALLBACK=/g,
  /\bACTIVE_DOWNSTREAM_CHILDREN=/g
]);

const REQUIRED_PARENT_LINKS = Object.freeze([
  "/showroom/globe/earth/",
  "/showroom/globe/audralia/"
]);

const EARTH_ONLY_PATTERNS = Object.freeze([
  "earthRenderMount",
  "/assets/earth/earth_canvas.js",
  "Earth"
]);

const AUDRALIA_ONLY_PATTERNS = Object.freeze([
  "audraliaRenderMount",
  "/assets/audralia/audralia.planet.render.js",
  "Audralia"
]);

const dom = {
  runButton: document.getElementById("runAuditButton"),
  timestamp: document.getElementById("auditTimestamp"),
  total: document.getElementById("totalCount"),
  pass: document.getElementById("passCount"),
  fail: document.getElementById("failCount"),
  held: document.getElementById("heldCount"),
  score: document.getElementById("boundaryScore"),
  output: document.getElementById("auditOutput"),
  parentSource: document.getElementById("parentSourceStatus"),
  earthSource: document.getElementById("earthSourceStatus"),
  audraliaSource: document.getElementById("audraliaSourceStatus")
};

function cacheBust(url) {
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}_gauges_boundary_audit=${Date.now()}`;
}

async function readSource(label, url) {
  try {
    const response = await fetch(cacheBust(url), {
      cache: "no-store",
      credentials: "same-origin"
    });

    const text = await response.text();

    return {
      label,
      url,
      ok: response.ok,
      status: response.status,
      text,
      bytes: text.length
    };
  } catch (error) {
    return {
      label,
      url,
      ok: false,
      status: 0,
      text: "",
      bytes: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function includesAll(text, patterns) {
  return patterns.every(pattern => text.includes(pattern));
}

function includesNone(text, patterns) {
  return patterns.every(pattern => !text.includes(pattern));
}

function countRawReceiptMatches(text) {
  let count = 0;

  for (const pattern of RAW_RECEIPT_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) count += matches.length;
  }

  return count;
}

function check(section, title, state, detail) {
  return {
    section,
    title,
    state,
    detail
  };
}

function pass(section, title, detail) {
  return check(section, title, "pass", detail);
}

function fail(section, title, detail) {
  return check(section, title, "fail", detail);
}

function held(section, title, detail) {
  return check(section, title, "held", detail);
}

function requireSource(source, section, title) {
  if (source.ok) return null;

  return fail(
    section,
    title,
    `${source.label} could not be read. Status=${source.status}. URL=${source.url}`
  );
}

function evaluateParentBoundary(sources) {
  const section = "Parent Selector Boundary";
  const checks = [];
  const html = sources.parentHtml;
  const js = sources.parentJs;

  const htmlFailure = requireSource(html, section, "Parent selector route is reachable");
  checks.push(htmlFailure || pass(section, "Parent selector route is reachable", `${html.url} returned ${html.status}.`));

  const jsFailure = requireSource(js, section, "Parent selector script is reachable");
  checks.push(jsFailure || pass(section, "Parent selector script is reachable", `${js.url} returned ${js.status}.`));

  if (!html.ok) {
    checks.push(held(section, "Parent selector carries both child route links", "Held because parent HTML could not be read."));
    checks.push(held(section, "Parent selector does not mount Earth directly", "Held because parent HTML could not be read."));
    checks.push(held(section, "Parent selector does not mount Audralia directly", "Held because parent HTML could not be read."));
    checks.push(held(section, "Parent selector hides raw receipts", "Held because parent HTML could not be read."));
  } else {
    checks.push(
      includesAll(html.text, REQUIRED_PARENT_LINKS)
        ? pass(section, "Parent selector carries both child route links", "Earth and Audralia child route links are present.")
        : fail(section, "Parent selector carries both child route links", "Parent route must link to both /showroom/globe/earth/ and /showroom/globe/audralia/.")
    );

    checks.push(
      !html.text.includes("earthRenderMount")
        ? pass(section, "Parent selector does not mount Earth directly", "Parent page does not contain #earthRenderMount.")
        : fail(section, "Parent selector does not mount Earth directly", "Parent selector still contains #earthRenderMount.")
    );

    checks.push(
      !html.text.includes("audraliaRenderMount")
        ? pass(section, "Parent selector does not mount Audralia directly", "Parent page does not contain #audraliaRenderMount.")
        : fail(section, "Parent selector does not mount Audralia directly", "Parent selector still contains #audraliaRenderMount.")
    );

    const rawCount = countRawReceiptMatches(html.text);
    checks.push(
      rawCount === 0
        ? pass(section, "Parent selector hides raw receipts", "No raw runtime receipt patterns are visible in parent HTML source.")
        : fail(section, "Parent selector hides raw receipts", `${rawCount} raw receipt pattern(s) found in parent HTML.`)
    );
  }

  if (!js.ok) {
    checks.push(held(section, "Parent script avoids render-body imports", "Held because parent JS could not be read."));
    checks.push(held(section, "Parent script declares selector role", "Held because parent JS could not be read."));
  } else {
    const importsRenderBodies =
      js.text.includes("/assets/earth/earth_canvas.js") ||
      js.text.includes("/assets/audralia/audralia.planet.render.js") ||
      js.text.includes("earthRenderMount") ||
      js.text.includes("audraliaRenderMount");

    checks.push(
      !importsRenderBodies
        ? pass(section, "Parent script avoids render-body imports", "Parent JS does not import Earth or Audralia render authorities.")
        : fail(section, "Parent script avoids render-body imports", "Parent JS still references render authority or render mounts.")
    );

    checks.push(
      js.text.includes('role: "selector"') || js.text.includes("role:'selector'") || js.text.includes("globeRoute = \"selector\"")
        ? pass(section, "Parent script declares selector role", "Selector route state is present.")
        : fail(section, "Parent script declares selector role", "Parent JS should declare selector-only route state.")
    );
  }

  return checks;
}

function evaluateEarthBoundary(sources) {
  const section = "Earth Independent Boundary";
  const checks = [];
  const html = sources.earthHtml;
  const js = sources.earthJs;
  const authority = sources.earthAuthority;

  const htmlFailure = requireSource(html, section, "Earth route is reachable");
  checks.push(htmlFailure || pass(section, "Earth route is reachable", `${html.url} returned ${html.status}.`));

  const jsFailure = requireSource(js, section, "Earth route script is reachable");
  checks.push(jsFailure || pass(section, "Earth route script is reachable", `${js.url} returned ${js.status}.`));

  const authorityFailure = requireSource(authority, section, "Earth authority file is reachable");
  checks.push(authorityFailure || pass(section, "Earth authority file is reachable", `${authority.url} returned ${authority.status}.`));

  if (!html.ok) {
    checks.push(held(section, "Earth route owns Earth mount", "Held because Earth HTML could not be read."));
    checks.push(held(section, "Earth route excludes Audralia mount", "Held because Earth HTML could not be read."));
    checks.push(held(section, "Earth route hides raw receipts", "Held because Earth HTML could not be read."));
  } else {
    checks.push(
      html.text.includes("earthRenderMount")
        ? pass(section, "Earth route owns Earth mount", "Earth route contains #earthRenderMount.")
        : fail(section, "Earth route owns Earth mount", "Earth route must contain #earthRenderMount.")
    );

    checks.push(
      !html.text.includes("audraliaRenderMount")
        ? pass(section, "Earth route excludes Audralia mount", "Earth route does not contain #audraliaRenderMount.")
        : fail(section, "Earth route excludes Audralia mount", "Earth route still contains #audraliaRenderMount.")
    );

    const rawCount = countRawReceiptMatches(html.text);
    checks.push(
      rawCount === 0
        ? pass(section, "Earth route hides raw receipts", "No raw runtime receipt patterns are visible in Earth HTML source.")
        : fail(section, "Earth route hides raw receipts", `${rawCount} raw receipt pattern(s) found in Earth HTML.`)
    );
  }

  if (!js.ok) {
    checks.push(held(section, "Earth route imports Earth authority only", "Held because Earth JS could not be read."));
    checks.push(held(section, "Earth route blocks Audralia adoption", "Held because Earth JS could not be read."));
    checks.push(held(section, "Earth route declares hidden public receipts", "Held because Earth JS could not be read."));
  } else {
    checks.push(
      js.text.includes("/assets/earth/earth_canvas.js")
        ? pass(section, "Earth route imports Earth authority", "Earth JS references /assets/earth/earth_canvas.js.")
        : fail(section, "Earth route imports Earth authority", "Earth JS must reference /assets/earth/earth_canvas.js.")
    );

    checks.push(
      !js.text.includes("/assets/audralia/") && !js.text.includes("audraliaRenderMount")
        ? pass(section, "Earth route blocks Audralia adoption", "Earth JS contains no Audralia authority or Audralia mount reference.")
        : fail(section, "Earth route blocks Audralia adoption", "Earth JS references Audralia authority or Audralia mount.")
    );

    checks.push(
      js.text.includes("publicReceiptRendering: false") || js.text.includes('publicReceipts = "hidden"')
        ? pass(section, "Earth route declares hidden public receipts", "Earth route state prevents public receipt rendering.")
        : fail(section, "Earth route declares hidden public receipts", "Earth JS should declare public receipt rendering as false/hidden.")
    );
  }

  return checks;
}

function evaluateAudraliaBoundary(sources) {
  const section = "Audralia Independent Boundary";
  const checks = [];
  const html = sources.audraliaHtml;
  const js = sources.audraliaJs;
  const authority = sources.audraliaAuthority;

  const htmlFailure = requireSource(html, section, "Audralia route is reachable");
  checks.push(htmlFailure || pass(section, "Audralia route is reachable", `${html.url} returned ${html.status}.`));

  const jsFailure = requireSource(js, section, "Audralia route script is reachable");
  checks.push(jsFailure || pass(section, "Audralia route script is reachable", `${js.url} returned ${js.status}.`));

  const authorityFailure = requireSource(authority, section, "Audralia authority file is reachable");
  checks.push(authorityFailure || pass(section, "Audralia authority file is reachable", `${authority.url} returned ${authority.status}.`));

  if (!html.ok) {
    checks.push(held(section, "Audralia route owns Audralia mount", "Held because Audralia HTML could not be read."));
    checks.push(held(section, "Audralia route excludes Earth mount", "Held because Audralia HTML could not be read."));
    checks.push(held(section, "Audralia route hides raw receipts", "Held because Audralia HTML could not be read."));
  } else {
    checks.push(
      html.text.includes("audraliaRenderMount")
        ? pass(section, "Audralia route owns Audralia mount", "Audralia route contains #audraliaRenderMount.")
        : fail(section, "Audralia route owns Audralia mount", "Audralia route must contain #audraliaRenderMount.")
    );

    checks.push(
      !html.text.includes("earthRenderMount")
        ? pass(section, "Audralia route excludes Earth mount", "Audralia route does not contain #earthRenderMount.")
        : fail(section, "Audralia route excludes Earth mount", "Audralia route still contains #earthRenderMount.")
    );

    const rawCount = countRawReceiptMatches(html.text);
    checks.push(
      rawCount === 0
        ? pass(section, "Audralia route hides raw receipts", "No raw runtime receipt patterns are visible in Audralia HTML source.")
        : fail(section, "Audralia route hides raw receipts", `${rawCount} raw receipt pattern(s) found in Audralia HTML.`)
    );
  }

  if (!js.ok) {
    checks.push(held(section, "Audralia route imports Audralia authority only", "Held because Audralia JS could not be read."));
    checks.push(held(section, "Audralia route blocks Earth adoption", "Held because Audralia JS could not be read."));
    checks.push(held(section, "Audralia route declares hidden public receipts", "Held because Audralia JS could not be read."));
  } else {
    checks.push(
      js.text.includes("/assets/audralia/audralia.planet.render.js")
        ? pass(section, "Audralia route imports Audralia authority", "Audralia JS references /assets/audralia/audralia.planet.render.js.")
        : fail(section, "Audralia route imports Audralia authority", "Audralia JS must reference /assets/audralia/audralia.planet.render.js.")
    );

    checks.push(
      !js.text.includes("/assets/earth/earth_canvas.js") && !js.text.includes("earthRenderMount")
        ? pass(section, "Audralia route blocks Earth adoption", "Audralia JS contains no Earth authority or Earth mount reference.")
        : fail(section, "Audralia route blocks Earth adoption", "Audralia JS references Earth authority or Earth mount.")
    );

    checks.push(
      js.text.includes("publicReceiptRendering: false") || js.text.includes('publicReceipts = "hidden"')
        ? pass(section, "Audralia route declares hidden public receipts", "Audralia route state prevents public receipt rendering.")
        : fail(section, "Audralia route declares hidden public receipts", "Audralia JS should declare public receipt rendering as false/hidden.")
    );
  }

  return checks;
}

function evaluateDependentBoundaries(sources) {
  const section = "Dependent Boundary Chain";
  const checks = [];

  const parentReady = sources.parentHtml.ok;
  const earthReady = sources.earthHtml.ok;
  const audraliaReady = sources.audraliaHtml.ok;

  if (!parentReady || !earthReady || !audraliaReady) {
    checks.push(
      held(
        section,
        "Three-route dependency chain can be evaluated",
        "Held until parent selector, Earth route, and Audralia route are all readable."
      )
    );
  } else {
    const parentLinksChildren =
      includesAll(sources.parentHtml.text, REQUIRED_PARENT_LINKS);

    const earthLinksBack =
      sources.earthHtml.text.includes("/showroom/globe/") &&
      sources.earthHtml.text.includes("/showroom/globe/audralia/");

    const audraliaLinksBack =
      sources.audraliaHtml.text.includes("/showroom/globe/") &&
      sources.audraliaHtml.text.includes("/showroom/globe/earth/");

    checks.push(
      parentLinksChildren && earthLinksBack && audraliaLinksBack
        ? pass(section, "Three-route dependency chain is connected", "Parent links to both children; each child can return and cross-inspect.")
        : fail(section, "Three-route dependency chain is connected", "One or more route links are missing from the selector/child route chain.")
    );
  }

  if (!sources.parentJs.ok || !sources.earthJs.ok || !sources.audraliaJs.ok) {
    checks.push(
      held(
        section,
        "Route scripts preserve separate authority",
        "Held until parent JS, Earth JS, and Audralia JS are all readable."
      )
    );
  } else {
    const parentNoImport =
      !sources.parentJs.text.includes("/assets/earth/earth_canvas.js") &&
      !sources.parentJs.text.includes("/assets/audralia/audralia.planet.render.js");

    const earthOnly =
      sources.earthJs.text.includes("/assets/earth/earth_canvas.js") &&
      !sources.earthJs.text.includes("/assets/audralia/");

    const audraliaOnly =
      sources.audraliaJs.text.includes("/assets/audralia/audralia.planet.render.js") &&
      !sources.audraliaJs.text.includes("/assets/earth/earth_canvas.js");

    checks.push(
      parentNoImport && earthOnly && audraliaOnly
        ? pass(section, "Route scripts preserve separate authority", "Selector imports no body renderers; Earth and Audralia scripts import only their own body authority.")
        : fail(section, "Route scripts preserve separate authority", "A route script crosses authority or the selector imports a body renderer.")
    );
  }

  const allHtmlReadable = parentReady && earthReady && audraliaReady;

  if (!allHtmlReadable) {
    checks.push(
      held(
        section,
        "No public receipt dump across the split",
        "Held until all three route HTML sources are readable."
      )
    );
  } else {
    const totalRawReceipts =
      countRawReceiptMatches(sources.parentHtml.text) +
      countRawReceiptMatches(sources.earthHtml.text) +
      countRawReceiptMatches(sources.audraliaHtml.text);

    checks.push(
      totalRawReceipts === 0
        ? pass(section, "No public receipt dump across the split", "Parent, Earth, and Audralia HTML sources avoid raw runtime receipt dumps.")
        : fail(section, "No public receipt dump across the split", `${totalRawReceipts} raw receipt pattern(s) found across public route HTML.`)
    );
  }

  if (!allHtmlReadable) {
    checks.push(
      held(
        section,
        "Mount appropriation is independent and dependent",
        "Held until all three route HTML sources are readable."
      )
    );
  } else {
    const parentHasNoMount =
      !sources.parentHtml.text.includes("earthRenderMount") &&
      !sources.parentHtml.text.includes("audraliaRenderMount");

    const earthHasOnlyEarthMount =
      sources.earthHtml.text.includes("earthRenderMount") &&
      !sources.earthHtml.text.includes("audraliaRenderMount");

    const audraliaHasOnlyAudraliaMount =
      sources.audraliaHtml.text.includes("audraliaRenderMount") &&
      !sources.audraliaHtml.text.includes("earthRenderMount");

    checks.push(
      parentHasNoMount && earthHasOnlyEarthMount && audraliaHasOnlyAudraliaMount
        ? pass(section, "Mount appropriation is independent and dependent", "Parent owns no body mount; each child owns exactly its own body mount.")
        : fail(section, "Mount appropriation is independent and dependent", "Mount ownership is crossed, duplicated, or still present on the selector.")
    );
  }

  if (!sources.earthAuthority.ok || !sources.audraliaAuthority.ok) {
    checks.push(
      held(
        section,
        "Both body authorities remain reachable",
        "Held until both body authority files are readable."
      )
    );
  } else {
    checks.push(
      pass(
        section,
        "Both body authorities remain reachable",
        "Earth and Audralia authority assets are reachable without this Gauges page mutating them."
      )
    );
  }

  return checks;
}

function groupChecks(checks) {
  return checks.reduce((groups, item) => {
    if (!groups.has(item.section)) groups.set(item.section, []);
    groups.get(item.section).push(item);
    return groups;
  }, new Map());
}

function renderSummary(checks) {
  const total = checks.length;
  const passCount = checks.filter(item => item.state === "pass").length;
  const failCount = checks.filter(item => item.state === "fail").length;
  const heldCount = checks.filter(item => item.state === "held").length;
  const score = total > 0 ? Math.round((passCount / total) * 100) : 0;

  dom.total.textContent = String(total);
  dom.pass.textContent = String(passCount);
  dom.fail.textContent = String(failCount);
  dom.held.textContent = String(heldCount);
  dom.score.textContent = `${score}%`;
}

function renderSourceLedger(sources) {
  dom.parentSource.textContent =
    `HTML ${sources.parentHtml.status || "ERR"} · JS ${sources.parentJs.status || "ERR"}`;

  dom.earthSource.textContent =
    `HTML ${sources.earthHtml.status || "ERR"} · JS ${sources.earthJs.status || "ERR"} · Authority ${sources.earthAuthority.status || "ERR"}`;

  dom.audraliaSource.textContent =
    `HTML ${sources.audraliaHtml.status || "ERR"} · JS ${sources.audraliaJs.status || "ERR"} · Authority ${sources.audraliaAuthority.status || "ERR"}`;
}

function renderChecks(checks) {
  const groups = groupChecks(checks);
  dom.output.innerHTML = "";

  for (const [sectionName, sectionChecks] of groups.entries()) {
    const section = document.createElement("section");
    section.className = "audit-section";

    const passCount = sectionChecks.filter(item => item.state === "pass").length;
    const failCount = sectionChecks.filter(item => item.state === "fail").length;
    const heldCount = sectionChecks.filter(item => item.state === "held").length;

    const head = document.createElement("div");
    head.className = "section-head";
    head.innerHTML = `
      <span>
        <h2>${escapeHtml(sectionName)}</h2>
        <p>${sectionDescription(sectionName)}</p>
      </span>
      <span class="section-count">${passCount} pass · ${failCount} fail · ${heldCount} held</span>
    `;

    const list = document.createElement("div");
    list.className = "check-list";

    for (const item of sectionChecks) {
      const checkNode = document.createElement("article");
      checkNode.className = "check";
      checkNode.innerHTML = `
        <span class="badge ${item.state}">${item.state}</span>
        <span>
          <p class="check-title">${escapeHtml(item.title)}</p>
          <p class="check-detail">${escapeHtml(item.detail)}</p>
        </span>
      `;
      list.appendChild(checkNode);
    }

    section.appendChild(head);
    section.appendChild(list);
    dom.output.appendChild(section);
  }
}

function sectionDescription(sectionName) {
  const descriptions = {
    "Parent Selector Boundary":
      "Confirms that /showroom/globe/ is a selector only and does not carry body render authority.",
    "Earth Independent Boundary":
      "Confirms Earth has its own route, mount, script, and Earth authority without Audralia adoption.",
    "Audralia Independent Boundary":
      "Confirms Audralia has its own route, mount, script, and Audralia authority without Earth adoption.",
    "Dependent Boundary Chain":
      "Confirms the routes connect correctly while keeping authority split and public receipts contained."
  };

  return descriptions[sectionName] || "Boundary section.";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function runAudit() {
  dom.runButton.disabled = true;
  dom.runButton.textContent = "Running Audit";
  dom.timestamp.textContent = "Reading route boundaries.";

  const entries = await Promise.all(
    Object.entries(SOURCE_TARGETS).map(async ([key, url]) => {
      const source = await readSource(key, url);
      return [key, source];
    })
  );

  const sources = Object.fromEntries(entries);

  const checks = [
    ...evaluateParentBoundary(sources),
    ...evaluateEarthBoundary(sources),
    ...evaluateAudraliaBoundary(sources),
    ...evaluateDependentBoundaries(sources)
  ];

  renderSourceLedger(sources);
  renderSummary(checks);
  renderChecks(checks);

  dom.timestamp.textContent = `Last audit: ${new Date().toLocaleString()}`;
  dom.runButton.disabled = false;
  dom.runButton.textContent = "Run Boundary Audit";

  window.GaugesBoundaryAudit = {
    generatedAt: new Date().toISOString(),
    sources: Object.fromEntries(
      Object.entries(sources).map(([key, value]) => [
        key,
        {
          label: value.label,
          url: value.url,
          ok: value.ok,
          status: value.status,
          bytes: value.bytes
        }
      ])
    ),
    checks
  };
}

dom.runButton.addEventListener("click", runAudit);
runAudit();
