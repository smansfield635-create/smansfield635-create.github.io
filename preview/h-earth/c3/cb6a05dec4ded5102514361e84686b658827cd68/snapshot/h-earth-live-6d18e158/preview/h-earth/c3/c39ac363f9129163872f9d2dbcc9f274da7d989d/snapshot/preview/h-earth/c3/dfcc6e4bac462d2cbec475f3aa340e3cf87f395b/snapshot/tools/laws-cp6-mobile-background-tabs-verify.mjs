import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const mode = process.argv[2] || "static";
const evidenceDirectory = path.resolve(root, process.env.EVIDENCE_DIR || "cp6-mobile-background-tabs-evidence");

function assert(condition, message, details = null) {
  if (condition) return;
  const error = new Error(message);
  error.details = details;
  throw error;
}

async function read(relativePath) {
  return fs.readFile(path.resolve(root, relativePath), "utf8");
}

async function writeJson(name, value) {
  await fs.mkdir(evidenceDirectory, { recursive: true });
  await fs.writeFile(path.join(evidenceDirectory, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function verifyStatic() {
  const [html, spacecraft, tabs, css] = await Promise.all([
    read("laws/index.html"),
    read("laws/index.spacecraft.background.js"),
    read("laws/index.mobile-background-tabs.js"),
    read("laws/index.mobile-background-tabs.css")
  ]);

  const backgroundSource = "/laws/index.spacecraft.background.js?v=LAWS_CP6_TRUE_3D_SPACECRAFT_BACKGROUND_20260801A";
  const tabsSource = "/laws/index.mobile-background-tabs.js?v=LAWS_CP6_MOBILE_BACKGROUND_TABS_20260801A";
  const cssSource = "/laws/index.mobile-background-tabs.css?v=LAWS_CP6_MOBILE_BACKGROUND_TABS_20260801A";

  assert(html.includes(backgroundSource), "The page-level spacecraft module is not loaded.");
  assert(!html.includes('/laws/index.spacecraft.js?v=LAWS_CP6_TRUE_3D_SPACECRAFT_20260801A'), "The Compass-contained spacecraft module remains active.");
  assert(html.includes(tabsSource), "The visitor-path tab correction is not loaded.");
  assert(html.includes(cssSource), "The mobile/background correction stylesheet is not loaded.");
  assert(spacecraft.includes('HOST_ID = "laws-spacecraft-background-host"'), "Page-level spacecraft host identity is missing.");
  assert(spacecraft.includes('document.body.prepend(host)'), "Spacecraft does not have a page-background fallback host.");
  assert(spacecraft.includes('layer: "PAGE_BACKGROUND"'), "Spacecraft impact receipt does not identify the page background.");
  assert(spacecraft.includes("buildLawsSpacecraftGeometry"), "Admitted spacecraft geometry is not reused.");
  assert(spacecraft.includes("destructive: false"), "The non-destructive impact boundary is missing.");
  assert(spacecraft.includes("pointerdown"), "Page-level touch interception is missing.");
  assert(spacecraft.includes("prefers-reduced-motion: reduce") || css.includes("prefers-reduced-motion: reduce"), "Reduced-motion handling is missing.");
  assert(tabs.includes("controllerPanel.after(paths)"), "Visitor paths are not placed after the Compass response.");
  assert(tabs.includes('setAttribute("role", "tablist")'), "Visitor path tablist semantics are missing.");
  assert(tabs.includes("panels.length !== 3"), "The three-path invariant is not enforced.");
  assert(css.includes("#laws-spacecraft-background-host"), "Background spacecraft CSS host is missing.");
  assert(css.includes(".laws-visitor-paths__tablist"), "Visitor path tab presentation is missing.");
  assert(css.includes("font-size: clamp(2.75rem, 11.7vw, 3.55rem)"), "Phone headline correction is missing.");
  assert(css.includes("min-height: clamp(25rem, 108vw, 31rem)"), "Phone Compass height correction is missing.");

  const output = {
    contract: "LAWS_CP6_MOBILE_BACKGROUND_TABS_STATIC_VERIFY_v1",
    result: "PASS",
    loader: { backgroundSource, tabsSource, cssSource },
    boundaries: {
      compassChildSpacecraft: false,
      pageBackgroundHost: true,
      visitorPathCount: 3,
      navigationAuthority: false,
      controllerAuthority: false,
      routeAuthority: false,
      recordAuthority: false,
      evidenceAuthority: false,
      claimAuthority: false,
      visualPassClaimed: false
    }
  };

  await writeJson("static.json", output);
  console.log(JSON.stringify(output, null, 2));
}

async function inspectViewport(browser, baseUrl, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.deviceScaleFactor || 1,
    isMobile: Boolean(profile.isMobile),
    hasTouch: Boolean(profile.hasTouch)
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(`${baseUrl}/laws/?lawsSpacecraftTest=1`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => globalThis.DGB_LAWS_SPACECRAFT?.snapshot, null, { timeout: 20000 });
  await page.waitForFunction(() => globalThis.DGB_LAWS_SPACECRAFT_RECEIPT?.backgroundHost === true, null, { timeout: 20000 });
  await page.waitForFunction(() => globalThis.DGB_LAWS_VISITOR_PATH_TABS?.panelCount === 3, null, { timeout: 20000 });
  await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT.verificationSetProgress(0.46));
  await page.waitForTimeout(450);

  const metrics = await page.evaluate(() => {
    const rect = element => {
      const value = element?.getBoundingClientRect();
      return value ? {
        x: value.x,
        y: value.y,
        top: value.top,
        left: value.left,
        right: value.right,
        bottom: value.bottom,
        width: value.width,
        height: value.height
      } : null;
    };

    const host = document.getElementById("laws-spacecraft-background-host");
    const canvas = document.getElementById("laws-spacecraft-background-canvas");
    const compassPrimary = document.querySelector("[data-laws-compass-primary]");
    const controller = compassPrimary?.querySelector("[data-laws-panel]");
    const paths = document.querySelector(".laws-visitor-paths[data-laws-tabs-mounted='true']");
    const tabs = Array.from(document.querySelectorAll(".laws-visitor-paths__tab"));
    const field = document.querySelector("[data-laws-scene-field]");
    const heading = document.querySelector("#research-comes-first-title");
    const snapshot = globalThis.DGB_LAWS_SPACECRAFT.snapshot();

    return {
      route: location.pathname,
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      viewport: { width: innerWidth, height: innerHeight },
      receipt: snapshot.receipt,
      craft: snapshot.craft,
      host: {
        rect: rect(host),
        position: host ? getComputedStyle(host).position : "",
        zIndex: host ? getComputedStyle(host).zIndex : "",
        pointerEvents: host ? getComputedStyle(host).pointerEvents : ""
      },
      canvas: {
        rect: rect(canvas),
        width: canvas?.width || 0,
        height: canvas?.height || 0,
        parentId: canvas?.parentElement?.id || ""
      },
      compassChildSpacecraftCanvasCount: document.querySelectorAll("[data-laws-scene-field] canvas[data-laws-spacecraft-background-layer], [data-laws-scene-field] canvas[data-laws-spacecraft-layer]").length,
      heading: rect(heading),
      field: rect(field),
      controller: rect(controller),
      paths: rect(paths),
      pathsParentIsCompassPrimary: paths?.parentElement === compassPrimary,
      pathsImmediatelyAfterController: controller?.nextElementSibling === paths,
      tabs: tabs.map(tab => ({
        text: tab.textContent.trim(),
        selected: tab.getAttribute("aria-selected"),
        rect: rect(tab),
        display: getComputedStyle(tab).display
      })),
      activePanelCount: document.querySelectorAll(".laws-orientation-panel[data-laws-tab-active='true']").length,
      pageErrors: []
    };
  });

  metrics.pageErrors = errors;
  assert(metrics.route === "/laws/", `${profile.name}: route changed.`, metrics.route);
  assert(metrics.overflow <= 2, `${profile.name}: horizontal overflow introduced.`, metrics.overflow);
  assert(metrics.host.position === "fixed", `${profile.name}: spacecraft host is not fixed.`, metrics.host);
  assert(metrics.host.pointerEvents === "none", `${profile.name}: spacecraft host intercepts pointer events.`, metrics.host);
  assert(metrics.canvas.parentId === "laws-spacecraft-background-host", `${profile.name}: spacecraft canvas has the wrong host.`, metrics.canvas);
  assert(metrics.canvas.width > 0 && metrics.canvas.height > 0, `${profile.name}: spacecraft canvas has zero dimensions.`, metrics.canvas);
  assert(metrics.compassChildSpacecraftCanvasCount === 0, `${profile.name}: spacecraft canvas remains inside the Compass.`, metrics.compassChildSpacecraftCanvasCount);
  assert(metrics.receipt.kernelFrameAdmitted === true, `${profile.name}: admitted geometry was not received.`, metrics.receipt);
  assert(metrics.receipt.backgroundHost === true, `${profile.name}: page-background host receipt is false.`, metrics.receipt);
  assert(metrics.receipt.compassChildCanvasCount === 0, `${profile.name}: runtime reports a Compass child canvas.`, metrics.receipt);
  assert(metrics.receipt.webGlAvailable === true, `${profile.name}: WebGL is unavailable.`, metrics.receipt);
  assert(metrics.craft?.visible === true && metrics.craft?.projected?.radius > 0, `${profile.name}: controlled craft is not visible.`, metrics.craft);
  assert(metrics.pathsParentIsCompassPrimary === true, `${profile.name}: visitor paths are not Compass-adjacent.`, metrics);
  assert(metrics.pathsImmediatelyAfterController === true, `${profile.name}: visitor paths do not immediately follow the Compass response.`, metrics);
  assert(metrics.tabs.length === 3, `${profile.name}: three visitor-path tabs were not created.`, metrics.tabs);
  assert(metrics.tabs.every(tab => tab.rect?.width > 0 && tab.rect?.height > 0 && tab.display !== "none"), `${profile.name}: a visitor-path tab is not visible.`, metrics.tabs);
  assert(metrics.tabs.filter(tab => tab.selected === "true").length === 1, `${profile.name}: exactly one visitor-path tab must be active.`, metrics.tabs);
  assert(metrics.activePanelCount === 1, `${profile.name}: exactly one visitor-path panel must be active.`, metrics.activePanelCount);
  assert(errors.length === 0, `${profile.name}: browser errors were produced.`, errors);

  if (profile.name === "phone-portrait") {
    assert(metrics.heading?.height < 230, "Phone portrait headline remains oversized.", metrics.heading);
    assert(metrics.field?.height >= 380 && metrics.field?.height <= 510, "Phone portrait Compass field height is outside the corrected envelope.", metrics.field);
  }

  const tabs = page.locator(".laws-visitor-paths__tab");
  await tabs.nth(1).click();
  await page.waitForTimeout(80);
  const selectedAfterClick = await tabs.nth(1).getAttribute("aria-selected");
  assert(selectedAfterClick === "true", `${profile.name}: Evidence tab did not activate.`);

  const hitResult = await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT.verificationHit());
  assert(hitResult === true, `${profile.name}: controlled spacecraft impact did not register.`);
  await page.waitForTimeout(180);
  const afterImpact = await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT.snapshot());
  assert(afterImpact.receipt.hitCount >= 1, `${profile.name}: hit count did not advance.`, afterImpact);
  assert(afterImpact.particleCount > 0, `${profile.name}: impact produced no particles.`, afterImpact);
  assert(afterImpact.craft?.visible === true, `${profile.name}: impact removed the craft.`, afterImpact);

  await page.screenshot({ path: path.join(evidenceDirectory, `${profile.name}.png`), fullPage: true });
  await context.close();
  return { metrics, afterImpact };
}

async function verifyBrowser() {
  const { chromium } = await import("playwright");
  const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
  await fs.mkdir(evidenceDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const profiles = [
    { name: "phone-portrait", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    { name: "phone-landscape", viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
    { name: "tablet-portrait", viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true },
    { name: "tablet-landscape", viewport: { width: 1180, height: 820 }, isMobile: true, hasTouch: true },
    { name: "desktop", viewport: { width: 1440, height: 1000 } }
  ];
  const results = {};

  try {
    for (const profile of profiles) {
      results[profile.name] = await inspectViewport(browser, baseUrl, profile);
    }

    const reducedContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      isMobile: true,
      hasTouch: true
    });
    const reducedPage = await reducedContext.newPage();
    const reducedErrors = [];
    reducedPage.on("pageerror", error => reducedErrors.push(error.message));
    await reducedPage.goto(`${baseUrl}/laws/?lawsSpacecraftTest=1`, { waitUntil: "networkidle" });
    await reducedPage.waitForFunction(() => globalThis.DGB_LAWS_SPACECRAFT?.snapshot, null, { timeout: 20000 });
    await reducedPage.waitForFunction(() => globalThis.DGB_LAWS_VISITOR_PATH_TABS?.panelCount === 3, null, { timeout: 20000 });
    const reduced = await reducedPage.evaluate(() => {
      const snapshot = globalThis.DGB_LAWS_SPACECRAFT.snapshot();
      const canvas = document.getElementById("laws-spacecraft-background-canvas");
      return {
        snapshot,
        canvasHidden: Boolean(canvas?.hidden),
        canvasDisplay: canvas ? getComputedStyle(canvas).display : "",
        tabCount: document.querySelectorAll(".laws-visitor-paths__tab").length,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
      };
    });
    assert(reduced.snapshot.receipt.reducedMotion === true, "Reduced-motion state was not detected.", reduced);
    assert(reduced.snapshot.receipt.running === false, "Reduced-motion spacecraft remains animated.", reduced);
    assert(reduced.canvasHidden || reduced.canvasDisplay === "none", "Reduced-motion spacecraft canvas remains visible.", reduced);
    assert(reduced.tabCount === 3, "Reduced motion removed visitor-path tabs.", reduced);
    assert(reduced.overflow <= 2, "Reduced-motion layout introduced overflow.", reduced);
    assert(reducedErrors.length === 0, "Reduced-motion run produced errors.", reducedErrors);
    await reducedPage.screenshot({ path: path.join(evidenceDirectory, "phone-reduced-motion.png"), fullPage: true });
    results.reducedMotion = { ...reduced, pageErrors: reducedErrors };
    await reducedContext.close();

    const staticContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(`${baseUrl}/laws/`, { waitUntil: "load" });
    const staticResult = await staticPage.evaluate(() => ({
      spacecraftCanvasCount: document.querySelectorAll("#laws-spacecraft-background-canvas").length,
      originalPathPanelCount: document.querySelectorAll("details.laws-orientation-panel").length,
      compassPresent: Boolean(document.querySelector("#laws-orbit")),
      heading: document.querySelector("h1")?.textContent?.trim() || "",
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
    }));
    assert(staticResult.spacecraftCanvasCount === 0, "JavaScript-disabled fallback contains a runtime spacecraft canvas.", staticResult);
    assert(staticResult.originalPathPanelCount === 3, "JavaScript-disabled fallback lost the three visitor paths.", staticResult);
    assert(staticResult.compassPresent === true, "JavaScript-disabled fallback lost the Compass.", staticResult);
    assert(staticResult.heading.includes("Research comes"), "JavaScript-disabled fallback lost the headline.", staticResult);
    assert(staticResult.overflow <= 2, "JavaScript-disabled fallback introduced overflow.", staticResult);
    await staticPage.screenshot({ path: path.join(evidenceDirectory, "phone-static.png"), fullPage: true });
    results.staticFallback = staticResult;
    await staticContext.close();
  } finally {
    await browser.close();
  }

  const output = {
    contract: "LAWS_CP6_MOBILE_BACKGROUND_TABS_BROWSER_VERIFY_v1",
    result: "PASS",
    profiles: profiles.map(profile => profile.name),
    results,
    boundaries: {
      spacecraftHost: "PAGE_BACKGROUND",
      compassChildSpacecraftCanvasCount: 0,
      visitorPathTabs: 3,
      phonePortraitChecked: true,
      phoneLandscapeChecked: true,
      tabletPortraitChecked: true,
      tabletLandscapeChecked: true,
      desktopChecked: true,
      destructiveImpact: false,
      navigationAuthority: false,
      controllerAuthority: false,
      evidenceAuthority: false,
      claimAuthority: false,
      visualPassClaimed: false
    }
  };

  await writeJson("browser.json", output);
  console.log(JSON.stringify(output, null, 2));
}

if (mode === "static") await verifyStatic();
else if (mode === "browser") await verifyBrowser();
else throw new Error(`Unknown verification mode: ${mode}`);
