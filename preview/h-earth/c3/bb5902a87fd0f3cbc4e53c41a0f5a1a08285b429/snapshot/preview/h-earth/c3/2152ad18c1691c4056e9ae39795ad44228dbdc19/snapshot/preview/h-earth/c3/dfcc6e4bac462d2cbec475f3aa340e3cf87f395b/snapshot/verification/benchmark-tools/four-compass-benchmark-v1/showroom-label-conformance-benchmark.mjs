import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";

const ORIGIN = process.env.SHOWROOM_LABEL_ORIGIN || "http://127.0.0.1:4173";
const CHROME_PATH = process.env.CHROME_PATH || process.env.CHROME_BIN || "/usr/bin/google-chrome";
const OUT = "showroom-label-conformance-benchmark-v1.json";
const SHOTS = "showroom-label-conformance-benchmark-v1-screenshots";
const failures = [];
const observations = [];
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const assert = (condition, id, observed = null, profile = "source") => {
  if (!condition) failures.push({ profile, id, observed });
};
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const visible = element => {
  if (!element || element.hidden) return false;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
};

const profiles = [
  { id: "SAMSUNG_REFERENCE_430x932", width: 430, height: 932, mobile: true },
  { id: "DESKTOP_1280x900", width: 1280, height: 900, mobile: false }
];

const source = {
  html: fs.readFileSync("showroom/index.html", "utf8"),
  css: fs.readFileSync("showroom/index.css", "utf8"),
  interactions: fs.readFileSync("showroom/index.interactions.js", "utf8"),
  gestures: fs.readFileSync("showroom/index.interaction.gestures.js", "utf8"),
  controller: fs.readFileSync("showroom/index.controller.js", "utf8")
};
const sourceCardinalControls = (source.html.match(/data-showroom-cardinal-control/g) || []).length;
const sourceRoomControls = (source.html.match(/data-showroom-child-control/g) || []).length;
assert(source.html.includes('data-showroom-projected-label-model="four-cardinal-compass-family-and-one-camera-front-room-label"'), "LABEL_MODEL_SOURCE_MISSING");
assert(source.interactions.includes("SHOWROOM_CLUSTER_CAMERA_FRONT_LOCK_AND_COMPASS_FIT_20260729B"), "INTERACTION_BUILD_MARKER_MISSING");
assert(source.gestures.includes("SHOWROOM_CLUSTER_CAMERA_FRONT_LOCK_AND_COMPASS_FIT_20260729B"), "GESTURE_BUILD_MARKER_MISSING");
assert(source.gestures.includes("cluster: Object.freeze([0, 0, 1])"), "CAMERA_FRONT_ANCHOR_MISSING");
assert(source.gestures.includes("ROOM_PRIMARY_HYSTERESIS"), "ROOM_PRIMARY_HYSTERESIS_MISSING");
assert(source.interactions.includes('"cluster-primary-only"'), "PRIMARY_ONLY_CONTENT_MODEL_MISSING");
assert(source.interactions.includes("previewPrimaryRoom") && source.interactions.includes("orbitPreviewFocus"), "PREVIEW_PRIMARY_AUTHORITY_MISSING");
assert(source.interactions.includes("showroomProjectedCardinalLetter") && source.interactions.includes("showroomProjectedCardinalWord"), "CARDINAL_LABEL_PARTS_MISSING");
assert(source.interactions.includes('identity !== clusterPrimary'), "PRIMARY_ONLY_VISIBILITY_GATE_MISSING");
assert(source.css.includes("SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A"), "LABEL_STYLE_MARKER_MISSING");
assert(sourceCardinalControls >= 4, "CARDINAL_CONTROL_SOURCE_COUNT_INVALID", sourceCardinalControls);
assert(sourceRoomControls >= 16, "ROOM_CONTROL_SOURCE_COUNT_INVALID", sourceRoomControls);
assert(source.controller.includes("requestClusterPreview") && source.controller.includes("requestClusterCommit"), "CONTROLLER_GESTURE_AUTHORITY_MISSING");

fs.rmSync(SHOTS, { recursive: true, force: true });
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader"
  ]
});

for (const profile of profiles) {
  const page = await browser.newPage();
  await page.setViewport({
    width: profile.width,
    height: profile.height,
    deviceScaleFactor: 1,
    isMobile: profile.mobile,
    hasTouch: profile.mobile
  });
  const telemetry = { pageErrors: [], requestFailures: [], consoleErrors: [] };
  page.on("pageerror", error => telemetry.pageErrors.push(String(error?.message || error)));
  page.on("requestfailed", request => telemetry.requestFailures.push({ url: request.url(), error: request.failure()?.errorText || "" }));
  page.on("console", message => { if (message.type() === "error") telemetry.consoleErrors.push(message.text()); });

  const response = await page.goto(`${ORIGIN}/showroom/`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => Boolean(
    document.querySelector("[data-showroom-root]") &&
    globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER &&
    document.querySelectorAll('[data-showroom-projected-kind="cardinal"]').length === 4
  ), { timeout: 45000 });
  await page.$eval("[data-showroom-orbit-field]", element => element.scrollIntoView({ block: "center", inline: "center" }));
  await sleep(800);

  const inspect = async stateLabel => page.evaluate((label, visibleSource) => {
    const isVisible = eval(`(${visibleSource})`);
    const root = document.querySelector("[data-showroom-root]");
    const field = document.querySelector("[data-showroom-orbit-field]");
    const fieldRect = field?.getBoundingClientRect();
    const cardinalLabels = [...document.querySelectorAll('[data-showroom-projected-kind="cardinal"]')];
    const roomLabels = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')];
    const compassControl = document.querySelector("[data-showroom-compass-control]");
    const compassLabel = compassControl?.querySelector(".showroom-compass-control__label");
    const compassInstruction = compassControl?.querySelector(".showroom-compass-control__instruction");
    const compassRect = compassControl?.getBoundingClientRect();
    const compassLabelRect = compassLabel?.getBoundingClientRect();
    const compassInstructionRect = compassInstruction?.getBoundingClientRect();
    const compassBefore = compassControl ? getComputedStyle(compassControl, "::before") : null;
    const compassVisualWidth = Number.parseFloat(compassBefore?.width || "0");
    const compassContentWidth = Math.max(compassLabelRect?.width || 0, compassInstructionRect?.width || 0);
    const describe = element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        id: element.dataset.showroomProjectedLabel || "",
        text: element.textContent.replace(/\s+/g, " ").trim(),
        placement: element.dataset.showroomProjectedPlacement || "",
        primary: element.dataset.showroomProjectedPrimary === "true",
        depth: element.dataset.showroomProjectedDepth || "",
        visible: isVisible(element),
        contained: Boolean(fieldRect) && rect.left >= fieldRect.left - 1 && rect.top >= fieldRect.top - 1 && rect.right <= fieldRect.right + 1 && rect.bottom <= fieldRect.bottom + 1,
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height },
        background: style.backgroundImage || style.backgroundColor,
        borderTopWidth: style.borderTopWidth
      };
    };
    return {
      stateLabel: label,
      controllerState: root?.dataset.showroomControllerState || "",
      presentationMode: root?.dataset.showroomPresentationMode || "",
      orbitFocus: root?.dataset.showroomOrbitFocus || "",
      orbitPreviewFocus: root?.dataset.showroomOrbitPreviewFocus || "",
      clusterPrimaryRoom: root?.dataset.showroomClusterPrimaryRoom || "",
      clusterPreviewPrimaryRoom: root?.dataset.showroomClusterPreviewPrimaryRoom || "",
      clusterGestureActive: root?.dataset.showroomClusterGestureActive || "",
      cardinalVisibleCount: cardinalLabels.filter(isVisible).length,
      cardinalPrimaryCount: cardinalLabels.filter(element => isVisible(element) && element.dataset.showroomProjectedPrimary === "true").length,
      cardinalLetterCount: cardinalLabels.filter(element => element.querySelector("[data-showroom-projected-cardinal-letter]")).length,
      cardinalWordCount: cardinalLabels.filter(element => element.querySelector("[data-showroom-projected-cardinal-word]")).length,
      cardinalLabels: cardinalLabels.map(describe),
      roomVisibleCount: roomLabels.filter(isVisible).length,
      roomPrimaryCount: roomLabels.filter(element => isVisible(element) && element.dataset.showroomProjectedPrimary === "true").length,
      visibleRoomLabels: roomLabels.filter(isVisible).map(describe),
      compassHitWidth: compassRect?.width || 0,
      compassVisualWidth,
      compassContentWidth,
      compassVisualToHitRatio: compassRect?.width ? compassVisualWidth / compassRect.width : 0,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1Count: document.querySelectorAll("h1").length
    };
  }, stateLabel, visible.toString());

  const waitForVisibleCounts = (cardinals, rooms) => page.waitForFunction((visibleSource, expectedCardinals, expectedRooms) => {
    const isVisible = eval(`(${visibleSource})`);
    const cardinalLabels = [...document.querySelectorAll('[data-showroom-projected-kind="cardinal"]')];
    const roomLabels = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')];
    return cardinalLabels.filter(isVisible).length === expectedCardinals && roomLabels.filter(isVisible).length === expectedRooms;
  }, { timeout: 15000 }, visible.toString(), cardinals, rooms);

  const shot = async name => {
    await page.screenshot({ path: path.join(SHOTS, `${profile.id.toLowerCase()}-${name}.png`), fullPage: true });
  };

  const initial = await inspect("INITIAL_CONSTELLATION");
  assert([200, 304].includes(response?.status()), "SHOWROOM_ROUTE_STATUS_INVALID", response?.status(), profile.id);
  assert(initial.controllerState === "CONSTELLATION", "INITIAL_CONTROLLER_STATE_INVALID", initial, profile.id);
  assert(initial.cardinalVisibleCount === 4 && initial.cardinalPrimaryCount === 1, "CONSTELLATION_LABEL_COUNT_INVALID", initial, profile.id);
  assert(initial.cardinalLetterCount === 4 && initial.cardinalWordCount === 4, "CONSTELLATION_LABEL_STRUCTURE_INVALID", initial, profile.id);
  assert(initial.cardinalLabels.every(item => item.placement === "star-center-protected-letter-word" && item.contained), "CONSTELLATION_LABEL_PLACEMENT_INVALID", initial.cardinalLabels, profile.id);
  assert(initial.roomVisibleCount === 0, "ROOM_LABEL_VISIBLE_IN_CONSTELLATION", initial, profile.id);
  assert(initial.horizontalOverflow <= 1 && initial.h1Count === 1, "INITIAL_LAYOUT_REGRESSION", initial, profile.id);
  await shot("initial");

  assert(
    initial.compassVisualWidth > 0 &&
    initial.compassHitWidth > initial.compassVisualWidth + 20 &&
    initial.compassVisualToHitRatio < 0.72 &&
    initial.compassVisualWidth <= initial.compassContentWidth + 48,
    "MAIN_COMPASS_VISUAL_CAPSULE_NOT_COMPACT",
    initial,
    profile.id
  );

  const clusterAccepted = await page.evaluate(() => globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER.requestCardinalSelection("south"));
  assert(clusterAccepted !== false, "SOUTH_CLUSTER_SELECTION_REJECTED", clusterAccepted, profile.id);
  await page.waitForFunction(() => document.querySelector("[data-showroom-root]")?.dataset.showroomControllerState === "CLUSTER_OPEN", { timeout: 15000 });
  await waitForVisibleCounts(0, 1);
  await page.waitForFunction(() => {
    const label = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')].find(element => !element.hidden && getComputedStyle(element).visibility !== "hidden");
    return label?.dataset.showroomProjectedLabel === "south-3";
  }, { timeout: 15000 });
  await sleep(180);
  const cluster = await inspect("CLUSTER_OPEN_CAMERA_FRONT");
  assert(cluster.cardinalVisibleCount === 0, "CARDINAL_LABEL_VISIBLE_IN_CLUSTER", cluster, profile.id);
  assert(cluster.roomVisibleCount === 1 && cluster.roomPrimaryCount === 1, "CLUSTER_SINGLE_LABEL_INVALID", cluster, profile.id);
  assert(cluster.visibleRoomLabels[0]?.id === "south-3" && cluster.visibleRoomLabels[0]?.text === "Stars", "INITIAL_CAMERA_FRONT_LABEL_INVALID", cluster.visibleRoomLabels, profile.id);
  assert(cluster.visibleRoomLabels.every(item => item.placement === "inward-edge-primary-only" && item.contained), "CLUSTER_LABEL_PLACEMENT_INVALID", cluster.visibleRoomLabels, profile.id);
  assert(cluster.horizontalOverflow <= 1, "CLUSTER_LAYOUT_OVERFLOW", cluster, profile.id);
  await shot("cluster-camera-front");

  const fieldRectForInput = await page.$eval("[data-showroom-orbit-field]", element => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  });
  const startX = Math.round(fieldRectForInput.left + fieldRectForInput.width * 0.72);
  const startY = Math.round(fieldRectForInput.top + fieldRectForInput.height * 0.78);
  const endX = Math.round(startX - fieldRectForInput.width * 0.32);
  const endY = startY;
  let releaseActualPointer;

  if (profile.mobile) {
    const cdp = await page.createCDPSession();
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: startX, y: startY, id: 41, radiusX: 1, radiusY: 1, force: 0.5 }]
    });
    for (let step = 1; step <= 12; step += 1) {
      const progress = step / 12;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{
          x: Math.round(startX + (endX - startX) * progress),
          y: endY,
          id: 41,
          radiusX: 1,
          radiusY: 1,
          force: 0.5
        }]
      });
      await sleep(36);
    }
    releaseActualPointer = () => cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: []
    });
  } else {
    await page.mouse.move(startX, startY);
    await page.mouse.down({ button: "left" });
    for (let step = 1; step <= 12; step += 1) {
      const progress = step / 12;
      await page.mouse.move(
        Math.round(startX + (endX - startX) * progress),
        endY,
        { steps: 1 }
      );
      await sleep(36);
    }
    releaseActualPointer = () => page.mouse.up({ button: "left" });
  }

  assert(typeof releaseActualPointer === "function", "ACTUAL_POINTER_INPUT_START_FAILED", null, profile.id);

  await page.waitForFunction(() => {
    const root = document.querySelector("[data-showroom-root]");
    const label = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')].find(element => !element.hidden && getComputedStyle(element).visibility !== "hidden");
    return root?.dataset.showroomClusterGestureActive === "true" && label?.dataset.showroomProjectedLabel === "south-2";
  }, { timeout: 15000 });
  await sleep(120);
  const preview = await inspect("ACTUAL_TOUCH_GESTURE_PREVIEW");
  assert(preview.roomVisibleCount === 1 && preview.roomPrimaryCount === 1, "PREVIEW_SINGLE_LABEL_INVALID", preview, profile.id);
  assert(preview.visibleRoomLabels[0]?.id === "south-2" && preview.visibleRoomLabels[0]?.text === "Diamond", "ACTUAL_TOUCH_FRONT_LOCK_INVALID", preview.visibleRoomLabels, profile.id);
  await shot("touch-preview-diamond");

  await releaseActualPointer();
  await page.waitForFunction(() => {
    const root = document.querySelector("[data-showroom-root]");
    const label = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')].find(element => !element.hidden && getComputedStyle(element).visibility !== "hidden");
    return root?.dataset.showroomClusterGestureActive === "false" && root?.dataset.showroomClusterPrimaryRoom === "south-2" && label?.dataset.showroomProjectedLabel === "south-2";
  }, { timeout: 15000 });
  await waitForVisibleCounts(0, 1);
  await sleep(180);
  const committed = await inspect("ACTUAL_TOUCH_GESTURE_COMMITTED");
  assert(committed.roomVisibleCount === 1 && committed.roomPrimaryCount === 1, "COMMITTED_SINGLE_LABEL_INVALID", committed, profile.id);
  assert(committed.visibleRoomLabels[0]?.id === "south-2" && committed.visibleRoomLabels[0]?.text === "Diamond", "COMMITTED_FRONT_LOCK_INVALID", committed.visibleRoomLabels, profile.id);
  assert(committed.horizontalOverflow <= 1, "COMMITTED_LAYOUT_OVERFLOW", committed, profile.id);
  await shot("touch-committed-diamond");

  const returnAccepted = await page.evaluate(() => globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER.requestReturnToConstellation());
  assert(returnAccepted !== false, "RETURN_TO_CONSTELLATION_REJECTED", returnAccepted, profile.id);
  await page.waitForFunction(() => document.querySelector("[data-showroom-root]")?.dataset.showroomControllerState === "CONSTELLATION", { timeout: 15000 });
  await waitForVisibleCounts(4, 0);
  await sleep(180);
  const returned = await inspect("RETURNED_CONSTELLATION");
  assert(returned.cardinalVisibleCount === 4 && returned.cardinalPrimaryCount === 1 && returned.roomVisibleCount === 0, "RETURNED_LABEL_MODEL_INVALID", returned, profile.id);
  assert(returned.cardinalLabels.every(item => item.contained), "RETURNED_LABEL_CONTAINMENT_INVALID", returned.cardinalLabels, profile.id);
  assert(telemetry.pageErrors.length === 0 && telemetry.requestFailures.length === 0, "RUNTIME_TELEMETRY_FAILURE", telemetry, profile.id);
  await shot("returned");

  observations.push({ profile: profile.id, initial, cluster, preview, committed, returned, telemetry });
  await page.close();
}

await browser.close();
const screenshotManifest = fs.readdirSync(SHOTS).sort().map(file => {
  const filePath = path.join(SHOTS, file);
  return { file, bytes: fs.statSync(filePath).size, sha256: digest(filePath) };
});
const receipt = {
  tool: "SHOWROOM_LABEL_CONFORMANCE_BENCHMARK_v1",
  checkpoint: "SHOWROOM_CLUSTER_CAMERA_FRONT_LOCK_AND_COMPASS_FIT_20260729B",
  execution: {
    repository: process.env.GITHUB_REPOSITORY || "smansfield635-create/smansfield635-create.github.io",
    branch: process.env.EXECUTION_BRANCH || process.env.GITHUB_REF_NAME || "",
    commit: process.env.EXECUTION_COMMIT || process.env.GITHUB_SHA || "",
    workflowRunId: process.env.GITHUB_RUN_ID || ""
  },
  invariant: {
    cardinalCount: 4,
    roomCount: 16,
    constellationVisibleLabelCount: 4,
    clusterVisibleLabelCount: 1,
    cardinalLabelModel: "compass-family-letter-word",
    clusterLabelModel: "camera-front-primary-only",
    initialClusterFrontRoom: "south-3",
    touchGestureFrontRoom: "south-2",
    primarySelectionAuthority: "actual-touch-quaternion-camera-front-lock",
    visualCompassCapsule: "content-fit-with-larger-semantic-control"
  },
  observations,
  screenshotManifest,
  failures,
  pass: failures.length === 0,
  stoppingBoundary: {
    proves: ["EXACT_HEAD_BROWSER_EXECUTION", "FOUR_CARDINAL_LABEL_HIERARCHY", "SINGLE_CLUSTER_LABEL", "ACTUAL_TOUCH_GESTURE_FRONT_LOCK", "CAMERA_FRONT_INITIAL_LABEL", "COMPACT_VISIBLE_COMPASS_CAPSULE", "LABEL_CONTAINMENT"],
    doesNotProve: ["PHYSICAL_SAMSUNG_ACCEPTANCE", "UNIVERSAL_VISUAL_CORRECTNESS", "SCIENTIFIC_VALIDATION"]
  }
};
fs.writeFileSync(OUT, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ pass: receipt.pass, failures: failures.length, observations: observations.length, screenshots: screenshotManifest.length }, null, 2));
if (failures.length) process.exitCode = 1;
