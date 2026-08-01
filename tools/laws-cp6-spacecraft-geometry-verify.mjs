import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const mode = process.argv[2] || "static";
const evidenceDirectory = path.resolve(root, process.env.EVIDENCE_DIR || "cp6-spacecraft-evidence");

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
  await fs.writeFile(
    path.join(evidenceDirectory, name),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

async function importGeometryModule() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "laws-spacecraft-geometry-"));
  const files = [
    "laws/index.spacecraft.geometry.js",
    "showroom/globe/h-earth/render/geometry-kernel.js",
    "showroom/globe/h-earth/render/geometry-kernel.north.js",
    "showroom/globe/h-earth/render/geometry-kernel.east.js",
    "showroom/globe/h-earth/render/geometry-kernel.south.js",
    "showroom/globe/h-earth/render/geometry-kernel.west.js"
  ];

  await fs.writeFile(
    path.join(temporaryRoot, "package.json"),
    '{"type":"module"}\n',
    "utf8"
  );

  for (const relativePath of files) {
    const destination = path.join(temporaryRoot, relativePath);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.copyFile(path.join(root, relativePath), destination);
  }

  return import(`${pathToFileURL(path.join(temporaryRoot, "laws/index.spacecraft.geometry.js")).href}?t=${Date.now()}`);
}

async function verifyStatic() {
  const [html, geometrySource, runtimeSource] = await Promise.all([
    read("laws/index.html"),
    read("laws/index.spacecraft.geometry.js"),
    read("laws/index.spacecraft.js")
  ]);

  const geometryModule = await importGeometryModule();
  const result = geometryModule.buildLawsSpacecraftGeometry();
  const receipt = result.receipt;
  const mesh = result.mesh;
  const frame = result.frame;

  assert(receipt.contractId === "LAWS_CP6_SPACECRAFT_GEOMETRY_KERNEL_ADMITTED_v1", "Geometry contract identity changed.", receipt);
  assert(receipt.westAdmitted === true, "West admission was not established.", receipt);
  assert(receipt.aggregateFrameValid === true, "Aggregate frame is invalid.", receipt);
  assert(receipt.primitiveCount === 8, "The first slice must contain exactly eight admitted primitives.", receipt);
  assert(receipt.vertexCount > 100, "The admitted spacecraft mesh is unexpectedly small.", receipt);
  assert(receipt.triangleCount > 150, "The admitted spacecraft triangle count is unexpectedly small.", receipt);
  assert(receipt.blockingIssueCount === 0, "Blocking geometry issues remain.", receipt);
  assert(frame.admissionAuthority === "WEST", "Aggregate admission authority is not West.", frame.admissionAuthority);
  assert(frame.visualApproval === false, "Geometry admission silently claimed visual approval.", frame.visualApproval);
  assert(frame.productionAuthority === false, "Geometry admission silently claimed production authority.", frame.productionAuthority);
  assert(frame.publicReleaseAuthority === false, "Geometry admission silently claimed public-release authority.", frame.publicReleaseAuthority);
  assert(mesh.positions.length === mesh.normals.length, "Position and normal buffers are not correspondent.");
  assert(mesh.positions.length === mesh.colors.length, "Position and color buffers are not correspondent.");
  assert(mesh.emissive.length === mesh.positions.length / 3, "Emissive values do not match the vertex count.");
  assert(mesh.indices.length % 3 === 0, "Index buffer is not triangular.");
  assert(mesh.indices.every(value => Number.isSafeInteger(value) && value >= 0 && value < receipt.vertexCount), "Index buffer contains an invalid vertex reference.");
  assert(Number.isFinite(mesh.boundingRadius) && mesh.boundingRadius > 0.6 && mesh.boundingRadius < 1.5, "Bounding radius is outside the bounded scoutcraft envelope.", mesh.boundingRadius);

  const primitiveIds = new Set(frame.primitiveIds);
  for (const id of [
    "spacecraft-hull",
    "spacecraft-nose",
    "spacecraft-canopy",
    "spacecraft-engine-collar",
    "spacecraft-stabilizer-north",
    "spacecraft-stabilizer-south",
    "spacecraft-stabilizer-east",
    "spacecraft-stabilizer-west"
  ]) {
    assert(primitiveIds.has(id), `Required admitted primitive is missing: ${id}`);
  }

  const cardinalRoles = new Set(mesh.components.map(component => component.cardinalRole));
  for (const role of ["NORTH", "SOUTH", "EAST", "WEST"]) {
    assert(cardinalRoles.has(role), `Directional geometry role is missing: ${role}`);
  }

  assert(html.includes('/laws/index.spacecraft.js?v=LAWS_CP6_TRUE_3D_SPACECRAFT_20260801A'), "The staged Laws loader does not declare the spacecraft module.");
  assert(html.includes('"type": "module"'), "The staged spacecraft loader entry is not an ES module.");
  assert(runtimeSource.includes("state.compositor.classifyDepth"), "Runtime does not consume compositor depth classification.");
  assert(runtimeSource.includes("state.compositor.projectWorldPoint"), "Runtime does not consume compositor world projection.");
  assert(runtimeSource.includes("LAWS_SPACECRAFT_IMPACT"), "Bounded impact event is missing.");
  assert(runtimeSource.includes("travel > 12"), "Tap-versus-drag travel boundary is missing.");
  assert(runtimeSource.includes("duration > 420"), "Tap duration boundary is missing.");
  assert(runtimeSource.includes("prefers-reduced-motion: reduce"), "Reduced-motion support is missing.");
  assert(runtimeSource.includes("destructive: false"), "Non-destructive impact receipt is missing.");
  assert(runtimeSource.includes("ownsNavigation: false"), "Navigation non-ownership is missing.");
  assert(runtimeSource.includes("ownsControllerState: false"), "Controller non-ownership is missing.");
  assert(runtimeSource.includes("ownsEvidence: false"), "Evidence non-ownership is missing.");
  assert(runtimeSource.includes("ownsClaims: false"), "Claim non-ownership is missing.");
  assert(geometrySource.includes("admitHEarthPrimitiveBatch"), "Geometry source bypasses West aggregate admission.");
  assert(geometrySource.includes("constructHEarthSuperellipsoidMesh"), "Kernel superellipsoid hull construction is missing.");
  assert(geometrySource.includes("constructHEarthConvexExtrusionMesh"), "Kernel directional extrusion construction is missing.");

  const output = {
    contract: "LAWS_CP6_SPACECRAFT_GEOMETRY_STATIC_VERIFY_v1",
    result: "PASS",
    geometry: receipt,
    frame: {
      frameId: frame.frameId,
      admissionAuthority: frame.admissionAuthority,
      primitiveIds: frame.primitiveIds,
      visualApproval: frame.visualApproval,
      productionAuthority: frame.productionAuthority,
      publicReleaseAuthority: frame.publicReleaseAuthority
    },
    buffers: {
      positionValues: mesh.positions.length,
      normalValues: mesh.normals.length,
      colorValues: mesh.colors.length,
      indexValues: mesh.indices.length,
      boundingRadius: mesh.boundingRadius
    },
    boundaries: {
      navigationAuthority: false,
      controllerAuthority: false,
      routeAuthority: false,
      evidenceAuthority: false,
      recordAuthority: false,
      claimAuthority: false,
      visualPassClaimed: false,
      productionAuthorized: false,
      deploymentAuthorized: false
    }
  };

  await writeJson("static.json", output);
  console.log(JSON.stringify(output, null, 2));
}

async function verifyBrowser() {
  const { chromium } = await import("playwright");
  const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
  await fs.mkdir(evidenceDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = {};

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(`${baseUrl}/laws/?lawsSpacecraftTest=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => globalThis.DGB_LAWS_SPACECRAFT?.snapshot, null, { timeout: 20000 });
    await page.waitForFunction(() => globalThis.DGB_LAWS_SPACECRAFT_RECEIPT?.kernelFrameAdmitted === true, null, { timeout: 20000 });
    await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT.verificationSetProgress(0.36));
    await page.waitForTimeout(500);

    const beforeImpact = await page.evaluate(() => {
      const snapshot = globalThis.DGB_LAWS_SPACECRAFT.snapshot();
      const root = document.querySelector("[data-laws-root]");
      const canvases = Array.from(document.querySelectorAll("canvas[data-laws-spacecraft-layer]"));
      return {
        snapshot,
        route: location.pathname,
        overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
        rootAuthority: {
          contract: root?.dataset.lawsSpacecraftContract || "",
          visualPassClaimed: root?.dataset.lawsSpacecraftVisualPassClaimed || ""
        },
        layers: canvases.map(canvas => ({
          name: canvas.dataset.lawsSpacecraftLayer,
          width: canvas.width,
          height: canvas.height,
          display: getComputedStyle(canvas).display,
          pointerEvents: getComputedStyle(canvas).pointerEvents
        }))
      };
    });

    assert(beforeImpact.route === "/laws/", "Spacecraft runtime changed the route.", beforeImpact.route);
    assert(beforeImpact.overflow <= 2, "Spacecraft runtime introduced horizontal overflow.", beforeImpact.overflow);
    assert(beforeImpact.layers.length === 2, "Rear/front spacecraft layers were not created.", beforeImpact.layers);
    assert(beforeImpact.layers.some(layer => layer.name === "rear"), "Rear spacecraft layer is missing.");
    assert(beforeImpact.layers.some(layer => layer.name === "front"), "Front spacecraft layer is missing.");
    assert(beforeImpact.layers.every(layer => layer.width > 0 && layer.height > 0), "A spacecraft WebGL layer has zero dimensions.", beforeImpact.layers);
    assert(beforeImpact.layers.every(layer => layer.pointerEvents === "none"), "A spacecraft canvas intercepted pointer events.", beforeImpact.layers);
    assert(beforeImpact.snapshot.receipt.rearWebGlAvailable === true, "Rear WebGL participant is unavailable.", beforeImpact.snapshot.receipt);
    assert(beforeImpact.snapshot.receipt.frontWebGlAvailable === true, "Front WebGL participant is unavailable.", beforeImpact.snapshot.receipt);
    assert(beforeImpact.snapshot.receipt.kernelFrameAdmitted === true, "Browser runtime did not receive the admitted kernel frame.", beforeImpact.snapshot.receipt);
    assert(beforeImpact.snapshot.craft?.visible === true, "Craft is not visible at the controlled verification position.", beforeImpact.snapshot.craft);
    assert(beforeImpact.snapshot.craft?.projected?.radius > 0, "Craft does not have a valid projected hit radius.", beforeImpact.snapshot.craft);
    assert(beforeImpact.rootAuthority.visualPassClaimed === "false", "Runtime silently claimed a visual pass.", beforeImpact.rootAuthority);

    const hitResult = await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT.verificationHit());
    assert(hitResult === true, "Controlled browser impact did not register.");
    await page.waitForTimeout(180);

    const afterImpact = await page.evaluate(() => globalThis.DGB_LAWS_SPACECRAFT.snapshot());
    assert(afterImpact.receipt.hitCount >= 1, "Impact count did not advance.", afterImpact);
    assert(afterImpact.craft?.phase === "IMPACT" || afterImpact.craft?.phase === "RECOVERY", "Craft did not enter bounded impact/recovery.", afterImpact.craft);
    assert(afterImpact.particleCount > 0, "Impact did not produce transient particles.", afterImpact);
    assert(afterImpact.craft?.visible === true, "Impact destroyed or removed the craft.", afterImpact.craft);

    await page.screenshot({ path: path.join(evidenceDirectory, "desktop-impact.png"), fullPage: true });
    results.desktop = { beforeImpact, afterImpact, pageErrors: errors };
    assert(errors.length === 0, "Desktop spacecraft run produced browser errors.", errors);
    await context.close();

    const reducedContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce"
    });
    const reducedPage = await reducedContext.newPage();
    const reducedErrors = [];
    reducedPage.on("pageerror", error => reducedErrors.push(error.message));
    await reducedPage.goto(`${baseUrl}/laws/?lawsSpacecraftTest=1`, { waitUntil: "networkidle" });
    await reducedPage.waitForFunction(() => globalThis.DGB_LAWS_SPACECRAFT?.snapshot, null, { timeout: 20000 });
    await reducedPage.waitForTimeout(250);
    const reduced = await reducedPage.evaluate(() => ({
      snapshot: globalThis.DGB_LAWS_SPACECRAFT.snapshot(),
      layers: Array.from(document.querySelectorAll("canvas[data-laws-spacecraft-layer]")).map(canvas => ({
        hidden: canvas.hidden,
        display: getComputedStyle(canvas).display
      })),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
    }));
    assert(reduced.snapshot.receipt.reducedMotion === true, "Reduced-motion state was not detected.", reduced.snapshot.receipt);
    assert(reduced.snapshot.receipt.running === false, "Reduced-motion runtime remained animated.", reduced.snapshot.receipt);
    assert(reduced.layers.length === 2 && reduced.layers.every(layer => layer.hidden || layer.display === "none"), "Reduced-motion spacecraft layers remain visible.", reduced.layers);
    assert(reduced.overflow <= 2, "Reduced-motion page introduced overflow.", reduced.overflow);
    assert(reducedErrors.length === 0, "Reduced-motion browser run produced errors.", reducedErrors);
    await reducedPage.screenshot({ path: path.join(evidenceDirectory, "phone-reduced-motion.png"), fullPage: true });
    results.reducedMotion = { ...reduced, pageErrors: reducedErrors };
    await reducedContext.close();

    const staticContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: false
    });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(`${baseUrl}/laws/`, { waitUntil: "load" });
    const staticResult = await staticPage.evaluate(() => ({
      spacecraftLayerCount: document.querySelectorAll("canvas[data-laws-spacecraft-layer]").length,
      compassPresent: Boolean(document.querySelector("#laws-orbit")),
      heading: document.querySelector("h1")?.textContent?.trim() || "",
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth
    }));
    assert(staticResult.spacecraftLayerCount === 0, "JavaScript-disabled fallback contains runtime spacecraft layers.", staticResult);
    assert(staticResult.compassPresent === true, "JavaScript-disabled fallback lost the Laws Compass.", staticResult);
    assert(staticResult.heading.includes("Research comes"), "JavaScript-disabled fallback lost the primary heading.", staticResult.heading);
    assert(staticResult.overflow <= 2, "JavaScript-disabled fallback introduced overflow.", staticResult.overflow);
    await staticPage.screenshot({ path: path.join(evidenceDirectory, "phone-static.png"), fullPage: true });
    results.staticFallback = staticResult;
    await staticContext.close();
  } finally {
    await browser.close();
  }

  const output = {
    contract: "LAWS_CP6_SPACECRAFT_GEOMETRY_BROWSER_VERIFY_v1",
    result: "PASS",
    results,
    boundaries: {
      oneCraftFirstSlice: true,
      destructiveImpact: false,
      reducedMotionAnimated: false,
      staticRuntimeLayers: 0,
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

if (mode === "static") {
  await verifyStatic();
} else if (mode === "browser") {
  await verifyBrowser();
} else {
  throw new Error(`Unknown verification mode: ${mode}`);
}
