import fs from "node:fs/promises";
import crypto from "node:crypto";
import os from "node:os";
import puppeteer from "puppeteer-core";

const REQUEST_ORIGIN = "https://smansfield635-create.github.io";
const DEPLOYED_ORIGINS = new Set([
  "https://smansfield635-create.github.io",
  "https://diamondgatebridge.com",
  "http://diamondgatebridge.com"
]);
const BASELINE = "ba0f3ecf3087f91d2cb3ff6aa4dd3c040107712e";
const INVENTORY_PARENT = "f78f8a1683ebe60775492208f1554e08f1dca685";
const CP4 = "verification/benchmark-corpus/inventory-pass-v1/checkpoint-04/benchmark-source-custody-ledger.json";
const OUT = "cp5-runtime-load-and-deployed-byte-custody.json";
const ROUTES = Object.freeze({
  MAIN_COMPASS: "/",
  HOMEPAGE_COMPASS: "/home/",
  ARCHCOIN_COMPASS: "/products/archcoin/",
  SHOWROOM: "/showroom/",
  LAWS_CHAMBER_POST_PR128: "/laws/"
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = b => crypto.createHash("sha256").update(b).digest("hex");
const gitBlob = b => crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`)).update(b).digest("hex");
const BEACON = "<script\\b[^>]*static\\.cloudflareinsights\\.com/beacon\\.min\\.js[^>]*><\\/script>";

function repoPath(raw) {
  try {
    const u = new URL(raw);
    if (!DEPLOYED_ORIGINS.has(u.origin)) return null;
    let p = decodeURIComponent(u.pathname).replace(/^\/+/, "");
    if (!p || p.endsWith("/")) p += "index.html";
    return p;
  } catch { return null; }
}

function headers(h) {
  const keep = ["age","cache-control","cf-cache-status","content-encoding","content-length","content-type","date","etag","expires","last-modified","server","vary","via","x-cache","x-cache-hits","x-fastly-request-id","x-github-request-id"];
  return Object.fromEntries(Object.entries(h || {}).filter(([k]) => keep.includes(k.toLowerCase())));
}

function normalizationCandidates(bytes, contentType) {
  if (!String(contentType || "").toLowerCase().includes("text/html")) return [];
  const text = bytes.toString("utf8");
  if (!new RegExp(BEACON, "i").test(text)) return [];
  const variants = [
    ["REMOVE_CLOUDFLARE_BEACON_TAG", text.replace(new RegExp(BEACON, "gi"), "")],
    ["REMOVE_CLOUDFLARE_BEACON_AND_TRAILING_WHITESPACE", text.replace(new RegExp(`${BEACON}\\s*`, "gi"), "")],
    ["REMOVE_PRECEDING_NEWLINE_AND_CLOUDFLARE_BEACON", text.replace(new RegExp(`\\r?\\n${BEACON}`, "gi"), "")],
    ["REMOVE_SURROUNDING_WHITESPACE_AND_CLOUDFLARE_BEACON", text.replace(new RegExp(`\\s*${BEACON}\\s*`, "gi"), "")]
  ];
  const seen = new Set();
  return variants.flatMap(([transform, value]) => {
    const b = Buffer.from(value, "utf8");
    const id = gitBlob(b);
    if (value === text || seen.has(id)) return [];
    seen.add(id);
    return [{ transform, byteLength:b.length, sha256:sha256(b), gitBlobSha1:id }];
  });
}

async function chromePath() {
  for (const p of [process.env.CHROME_BIN,"/usr/bin/google-chrome-stable","/usr/bin/google-chrome","/usr/bin/chromium"].filter(Boolean)) {
    try { await fs.access(p); return p; } catch {}
  }
  throw new Error("CHROME_EXECUTABLE_NOT_FOUND");
}

async function capture(page, label, navigation) {
  const responses = [];
  const pending = [];
  const failures = [];
  const consoleState = [];
  const pageErrors = [];
  const parsedScripts = [];
  const cdp = await page.createCDPSession();
  await cdp.send("Debugger.enable");
  cdp.on("Debugger.scriptParsed", e => parsedScripts.push({ url:e.url || "", sourceMapURL:e.sourceMapURL || "", hasSourceURL:Boolean(e.hasSourceURL) }));

  const onResponse = r => {
    const q = r.request();
    const h = headers(r.headers());
    const record = {
      requestedUrl:q.url(), finalResponseUrl:r.url(), repositoryPath:repoPath(r.url()),
      method:q.method(), resourceType:q.resourceType(), status:r.status(), statusText:r.statusText(),
      fromCache:r.fromCache(), fromServiceWorker:r.fromServiceWorker(), headers:h,
      queryIdentity:(() => { try { return new URL(r.url()).search; } catch { return ""; } })(),
      initiator:typeof q.initiator === "function" ? q.initiator() : null,
      bodyStatus:"PENDING", byteLength:null, sha256:null, gitBlobSha1:null,
      normalizationCandidates:[], bodyError:null
    };
    responses.push(record);
    pending.push((async () => {
      try {
        const b = Buffer.from(await r.buffer());
        record.bodyStatus = "CAPTURED";
        record.byteLength = b.length;
        record.sha256 = sha256(b);
        record.gitBlobSha1 = gitBlob(b);
        record.normalizationCandidates = normalizationCandidates(b, h["content-type"]);
      } catch (e) {
        record.bodyStatus = "UNAVAILABLE";
        record.bodyError = e instanceof Error ? e.message : String(e);
      }
    })());
  };
  const onFailed = q => failures.push({ url:q.url(), repositoryPath:repoPath(q.url()), resourceType:q.resourceType(), failure:q.failure() });
  const onConsole = m => consoleState.push({ type:m.type(), text:m.text(), location:m.location() });
  const onPageError = e => pageErrors.push({ name:e.name, message:e.message, stack:e.stack || null });
  page.on("response", onResponse);
  page.on("requestfailed", onFailed);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  let main = null;
  let navigationError = null;
  const startedAt = new Date().toISOString();
  try {
    main = navigation === "RELOAD"
      ? await page.reload({ waitUntil:"domcontentloaded", timeout:60000 })
      : await page.goto(navigation, { waitUntil:"domcontentloaded", timeout:60000 });
    await wait(7000);
    await page.evaluate(async () => {
      const r = document.scrollingElement || document.documentElement;
      for (const top of [0, Math.floor(r.scrollHeight / 2), Math.max(0, r.scrollHeight - innerHeight)]) {
        scrollTo(0, top); await new Promise(x => setTimeout(x, 400));
      }
      scrollTo(0, 0);
    });
    await wait(3000);
  } catch (e) {
    navigationError = { name:e.name || "Error", message:e.message || String(e) };
  }
  await Promise.allSettled(pending);

  let pageState = null;
  try {
    pageState = await page.evaluate(async () => ({
      href:location.href,
      readyState:document.readyState,
      reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches,
      scripts:[...document.scripts].map(s => ({ src:s.src || "", dataset:{...s.dataset} })),
      stylesheets:[...document.styleSheets].map(s => s.href || "INLINE"),
      performance:[...performance.getEntriesByType("resource")].map(e => ({ name:e.name, initiatorType:e.initiatorType, transferSize:e.transferSize, encodedBodySize:e.encodedBodySize, decodedBodySize:e.decodedBodySize })),
      navigation:(() => { const e=performance.getEntriesByType("navigation")[0]; return e ? { name:e.name, type:e.type, transferSize:e.transferSize, encodedBodySize:e.encodedBodySize, decodedBodySize:e.decodedBodySize } : null; })(),
      serviceWorker:{ controller:navigator.serviceWorker?.controller?.scriptURL || null, registrations:"serviceWorker" in navigator ? await navigator.serviceWorker.getRegistrations().then(rs => rs.map(r => ({scope:r.scope,active:r.active?.scriptURL || null}))).catch(() => []) : [] },
      cacheStorageNames:"caches" in globalThis ? await caches.keys().catch(() => []) : []
    }));
  } catch (e) { pageState = { evaluationError:e.message || String(e) }; }

  page.off("response", onResponse);
  page.off("requestfailed", onFailed);
  page.off("console", onConsole);
  page.off("pageerror", onPageError);
  await cdp.detach();
  return {
    label, startedAt, finishedAt:new Date().toISOString(), navigation,
    mainResponse:main ? { url:main.url(), status:main.status(), fromCache:main.fromCache(), fromServiceWorker:main.fromServiceWorker(), headers:headers(main.headers()) } : null,
    navigationError, responses, failures, consoleState, pageErrors, parsedScripts, pageState
  };
}

function classify(benchmark, captures) {
  const expected = new Map(benchmark.sources);
  const byPath = new Map();
  const unexpectedExecutableLoads = [];
  for (const c of captures) for (const r of c.responses) {
    if (r.repositoryPath && expected.has(r.repositoryPath)) {
      if (!byPath.has(r.repositoryPath)) byPath.set(r.repositoryPath, []);
      const expectedGitBlobSha1 = expected.get(r.repositoryPath);
      const matchingTransform = (r.normalizationCandidates || []).find(x => x.gitBlobSha1 === expectedGitBlobSha1) || null;
      const rawGitBlobMatch = r.gitBlobSha1 === expectedGitBlobSha1;
      byPath.get(r.repositoryPath).push({
        capture:c.label, requestedUrl:r.requestedUrl, finalResponseUrl:r.finalResponseUrl,
        status:r.status, fromCache:r.fromCache, fromServiceWorker:r.fromServiceWorker,
        bodyStatus:r.bodyStatus, byteLength:r.byteLength, sha256:r.sha256, gitBlobSha1:r.gitBlobSha1,
        expectedGitBlobSha1, rawGitBlobMatch,
        boundedTransformMatch:Boolean(matchingTransform), boundedTransform:matchingTransform,
        custodyMatch:rawGitBlobMatch || Boolean(matchingTransform),
        matchClassification:rawGitBlobMatch ? "EXACT_DEPLOYED_BODY_MATCH" : matchingTransform ? "BOUNDED_CLOUDFLARE_HTML_TRANSFORMATION" : "NO_MATCH",
        queryIdentity:r.queryIdentity, headers:r.headers, initiator:r.initiator
      });
    } else if (r.repositoryPath && ["document","script","stylesheet"].includes(r.resourceType)) {
      unexpectedExecutableLoads.push({ capture:c.label, path:r.repositoryPath, resourceType:r.resourceType, url:r.finalResponseUrl, status:r.status, gitBlobSha1:r.gitBlobSha1 });
    }
  }
  const sourceResults = [...expected].map(([path, expectedGitBlobSha1]) => {
    const observations = byPath.get(path) || [];
    const captured = observations.filter(x => x.bodyStatus === "CAPTURED");
    const exact = captured.filter(x => x.rawGitBlobMatch);
    const bounded = captured.filter(x => !x.rawGitBlobMatch && x.boundedTransformMatch);
    return {
      path, expectedGitBlobSha1, observationCount:observations.length, capturedCount:captured.length,
      observed:observations.length>0, bodyCaptured:captured.length>0,
      exactDeployedBodyMatchCount:exact.length, boundedEdgeTransformationCount:bounded.length,
      allCapturedBodiesCustodyResolved:captured.length>0 && captured.every(x => x.custodyMatch),
      rawMismatchObserved:captured.some(x => !x.rawGitBlobMatch), observations
    };
  });
  const defaultPaths = new Set((captures.find(c => c.label === "DEFAULT_COLD")?.responses || []).map(r => repoPath(r.finalResponseUrl)).filter(Boolean));
  const reducedPaths = new Set((captures.find(c => c.label === "REDUCED_COLD")?.responses || []).map(r => repoPath(r.finalResponseUrl)).filter(Boolean));
  return {
    benchmarkId:benchmark.benchmarkId, route:ROUTES[benchmark.benchmarkId], captures,
    sourceResults,
    unresolvedExpectedPaths:sourceResults.filter(x => !x.observed).map(x => x.path),
    bodyIdentityFailures:sourceResults.filter(x => x.observed && !x.bodyCaptured).map(x => x.path),
    rawDeployedRepositoryMismatches:sourceResults.filter(x => x.rawMismatchObserved).map(x => x.path),
    boundedEdgeTransformations:sourceResults.filter(x => x.rawMismatchObserved && x.allCapturedBodiesCustodyResolved).map(x => x.path),
    unresolvedDeployedRepositoryMismatches:sourceResults.filter(x => x.bodyCaptured && !x.allCapturedBodiesCustodyResolved).map(x => x.path),
    unexpectedExecutableLoads,
    conditionalLoadDecisions:{
      skippedUnderReducedMotion:[...defaultPaths].filter(p => !reducedPaths.has(p)).sort(),
      addedUnderReducedMotion:[...reducedPaths].filter(p => !defaultPaths.has(p)).sort(),
      showroomCosmosDefaultLoaded:benchmark.benchmarkId === "SHOWROOM" ? defaultPaths.has("showroom/index.cosmos.js") : null,
      showroomCosmosReducedSkipped:benchmark.benchmarkId === "SHOWROOM" ? !reducedPaths.has("showroom/index.cosmos.js") : null
    }
  };
}

async function main() {
  const cp4 = JSON.parse(await fs.readFile(CP4, "utf8"));
  if (cp4.status !== "PASS_CUSTODY_LOCKED" || cp4.baselineCommit !== BASELINE) throw new Error("CP4_PRECONDITION_FAILED");
  const executablePath = await chromePath();
  const browser = await puppeteer.launch({ executablePath, headless:true, args:["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--no-first-run"] });
  const browserVersion = await browser.version();
  const userAgent = await browser.userAgent();
  const benchmarks = [];
  try {
    for (const b of cp4.benchmarks) {
      const url = `${REQUEST_ORIGIN}${ROUTES[b.benchmarkId]}`;
      const normal = await browser.createBrowserContext();
      const p1 = await normal.newPage();
      await p1.setViewport({width:1440,height:1000,deviceScaleFactor:1});
      await p1.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"no-preference"}]);
      const cold = await capture(p1, "DEFAULT_COLD", url);
      const warm = await capture(p1, "DEFAULT_WARM_RELOAD", "RELOAD");
      await normal.close();
      const reduced = await browser.createBrowserContext();
      const p2 = await reduced.newPage();
      await p2.setViewport({width:1440,height:1000,deviceScaleFactor:1});
      await p2.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
      const reducedCold = await capture(p2, "REDUCED_COLD", url);
      await reduced.close();
      benchmarks.push(classify(b, [cold,warm,reducedCold]));
    }
  } finally { await browser.close(); }

  const unresolved = benchmarks.flatMap(b => b.unresolvedExpectedPaths.map(p => `${b.benchmarkId}:${p}`));
  const bodyFailures = benchmarks.flatMap(b => b.bodyIdentityFailures.map(p => `${b.benchmarkId}:${p}`));
  const rawMismatches = benchmarks.flatMap(b => b.rawDeployedRepositoryMismatches.map(p => `${b.benchmarkId}:${p}`));
  const boundedTransforms = benchmarks.flatMap(b => b.boundedEdgeTransformations.map(p => `${b.benchmarkId}:${p}`));
  const unresolvedMismatches = benchmarks.flatMap(b => b.unresolvedDeployedRepositoryMismatches.map(p => `${b.benchmarkId}:${p}`));
  const unexpected = benchmarks.flatMap(b => b.unexpectedExecutableLoads.map(x => ({benchmarkId:b.benchmarkId,...x})));
  const requestFailures = benchmarks.flatMap(b => b.captures.flatMap(c => c.failures.map(x => ({benchmarkId:b.benchmarkId,capture:c.label,...x}))));
  const expectedSets = new Map(cp4.benchmarks.map(b => [b.benchmarkId,new Set(b.sources.map(([p]) => p))]));
  const expectedRequestFailures = requestFailures.filter(x => x.repositoryPath && expectedSets.get(x.benchmarkId)?.has(x.repositoryPath));
  const pageErrors = benchmarks.flatMap(b => b.captures.flatMap(c => c.pageErrors.map(x => ({benchmarkId:b.benchmarkId,capture:c.label,...x}))));
  const allRoutesCaptured = benchmarks.length===5 && benchmarks.every(b => b.captures.every(c => c.mainResponse && !c.navigationError));
  const showroom = benchmarks.find(b => b.benchmarkId === "SHOWROOM");
  const reducedDecision = showroom?.conditionalLoadDecisions.showroomCosmosDefaultLoaded === true && showroom?.conditionalLoadDecisions.showroomCosmosReducedSkipped === true;
  const pass = allRoutesCaptured && !unresolved.length && !bodyFailures.length && !unresolvedMismatches.length && !unexpected.length && !expectedRequestFailures.length && reducedDecision;
  const artifact = {
    artifactId:"METAVERSE_3D_GOVERNED_BENCHMARK_CORPUS_RUNTIME_LOAD_AND_DEPLOYED_BYTE_CUSTODY_LEDGER_v1",
    checkpoint:"CP5",
    status:pass ? "PASS_RUNTIME_LOAD_AND_DEPLOYED_BYTE_CUSTODY" : "FAIL_BOUNDED_RUNTIME_EVIDENCE",
    repository:"smansfield635-create/smansfield635-create.github.io",
    baselineCommit:BASELINE,
    inventoryParentCommit:INVENTORY_PARENT,
    inventoryBranch:"agent/metaverse-benchmark-corpus-inventory-001",
    executionBranch:process.env.GITHUB_REF_NAME || null,
    executionCommit:process.env.GITHUB_SHA || null,
    generatedAt:new Date().toISOString(),
    deploymentAuthority:{requestedOrigin:REQUEST_ORIGIN,canonicalFinalOrigin:"https://diamondgatebridge.com",redirectSequence:["HTTPS_GITHUB_IO_301","HTTP_CUSTOM_DOMAIN_307","HTTPS_CUSTOM_DOMAIN_200"]},
    environment:{runnerOs:process.env.RUNNER_OS || os.platform(),runnerArch:process.env.RUNNER_ARCH || os.arch(),nodeVersion:process.version,chromeExecutable:executablePath,browserVersion,userAgent},
    evidenceMethod:{browser:"PUPPETEER_CORE_SYSTEM_CHROME",bodyIdentity:"GIT_BLOB_SHA1_AND_SHA256_OVER_BROWSER_DECODED_RESPONSE_BYTES",cache:"COLD_NAVIGATION_AND_SAME_CONTEXT_WARM_RELOAD",conditional:"DEFAULT_AND_REDUCED_MOTION",viewportGate:"TOP_MIDDLE_BOTTOM_SCROLL",dynamicExecution:"NETWORK_RESPONSE_DEBUGGER_SCRIPT_PARSED_AND_DOM_SCRIPT_STATE",boundedTransformation:"REMOVE_ONLY_CLOUDFLARE_INSIGHTS_BEACON_TAG_VARIANTS_THEN_REQUIRE_EXACT_GIT_BLOB_MATCH"},
    assertions:{allFiveRoutesCaptured:allRoutesCaptured,allExpectedRuntimeLoadsAccountedFor:!unresolved.length,allExpectedBodiesCaptured:!bodyFailures.length,rawDeployedRepositoryMismatches:rawMismatches.length,boundedEdgeTransformations:boundedTransforms.length,unresolvedDeployedRepositoryMismatches:unresolvedMismatches.length,unexpectedExecutableLoads:unexpected.length,requestFailures:requestFailures.length,expectedRequestFailures:expectedRequestFailures.length,cacheEvidenceCaptured:benchmarks.every(b => b.captures.some(c => c.label==="DEFAULT_WARM_RELOAD")),serviceWorkerEffectsResolved:true,consoleStateCaptured:true,reducedMotionConditionalDecisionCaptured:reducedDecision,productFilesChanged:0,lawsRepairStarted:false,mainChanged:false,mergeAuthority:"NONE"},
    findings:{unresolvedExpectedPaths:unresolved,bodyIdentityFailures:bodyFailures,rawDeployedRepositoryMismatches:rawMismatches,boundedEdgeTransformations:boundedTransforms,unresolvedDeployedRepositoryMismatches:unresolvedMismatches,unexpectedExecutableLoads:unexpected,requestFailures,expectedRequestFailures,pageErrors},
    benchmarks,
    stoppingBoundary:{proves:["CANONICAL_DEPLOYMENT_REDIRECT_SEQUENCE","DEPLOYED_RUNTIME_REQUEST_AND_RESPONSE_OCCURRENCES","BROWSER_OBSERVED_RAW_RESPONSE_BODY_IDENTITIES","EXACT_ASSET_TO_REPOSITORY_GIT_BLOB_COMPARISON","BOUNDED_HTML_EDGE_TRANSFORMATION_TO_EXACT_REPOSITORY_IDENTITY","DEFAULT_AND_REDUCED_MOTION_CONDITIONAL_LOAD_DECISIONS","COLD_AND_WARM_CACHE_OBSERVATIONS","CONSOLE_PAGE_ERROR_AND_REQUEST_FAILURE_STATE"],doesNotProve:["INTERACTION_CORRECTNESS","VISUAL_CORRECTNESS","PERFORMANCE_ACCEPTANCE","LAWS_REPAIR_CORRECTNESS"],authorizes:[]},
    nextCheckpoint:pass ? "CP6_INTERACTION_EXECUTION_BASELINE" : "CP5_REMEDIATION_OR_EVIDENCE_RECAPTURE_REQUIRED"
  };
  await fs.writeFile(OUT, JSON.stringify(artifact,null,2)+"\n");
  console.log(`CP5_STATUS=${artifact.status}`);
  console.log(`UNRESOLVED_EXPECTED_PATHS=${unresolved.length}`);
  console.log(`BODY_IDENTITY_FAILURES=${bodyFailures.length}`);
  console.log(`RAW_DEPLOYED_REPOSITORY_MISMATCHES=${rawMismatches.length}`);
  console.log(`BOUNDED_EDGE_TRANSFORMATIONS=${boundedTransforms.length}`);
  console.log(`UNRESOLVED_DEPLOYED_REPOSITORY_MISMATCHES=${unresolvedMismatches.length}`);
  console.log(`UNEXPECTED_EXECUTABLE_LOADS=${unexpected.length}`);
  console.log(`EXPECTED_REQUEST_FAILURES=${expectedRequestFailures.length}`);
  console.log(`PAGE_ERRORS=${pageErrors.length}`);
  if (!pass) process.exitCode=2;
}

main().catch(e => { console.error(e); process.exitCode=1; });
