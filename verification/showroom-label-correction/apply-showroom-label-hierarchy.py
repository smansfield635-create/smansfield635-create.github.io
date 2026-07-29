from pathlib import Path
import textwrap

MARKER = "SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A"
ROOT = Path(".")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected exactly one match, observed {count}")
    return text.replace(old, new, 1)


# -----------------------------------------------------------------------------
# Production source: Showroom interaction-owned projected labels.
# -----------------------------------------------------------------------------
interactions_path = ROOT / "showroom/index.interactions.js"
interactions = interactions_path.read_text(encoding="utf-8")
if MARKER not in interactions:
    interactions = replace_once(
        interactions,
        "/* SHOWROOM_LABEL_CONTAINMENT_20260726B */\n",
        "/* SHOWROOM_LABEL_CONTAINMENT_20260726B */\n"
        f"/* {MARKER} */\n",
        "interaction marker",
    )

    old_labels = '''  const CARDINAL_DISPLAY_LABELS = Object.freeze({
    north: "N · Story",
    east: "E · Characters",
    south: "S · Wonders",
    west: "W · Mysteries"
  });
'''
    new_labels = '''  const CARDINAL_DISPLAY_LABELS = Object.freeze({
    north: "Story",
    east: "Characters",
    south: "Wonders",
    west: "Mysteries"
  });

  const CARDINAL_DISPLAY_LETTERS = Object.freeze({
    north: "N",
    east: "E",
    south: "S",
    west: "W"
  });
'''
    interactions = replace_once(
        interactions,
        old_labels,
        new_labels,
        "cardinal display labels",
    )

    start_marker = "  function syncProjectedLabels() {\n"
    end_marker = "  function scheduleProjectedLabels() {\n"
    start = interactions.find(start_marker)
    end = interactions.find(end_marker, start)
    if start < 0 or end < 0:
        raise RuntimeError("projected label synchronization boundary missing")

    replacement = r'''  function syncProjectedLabelContent(
    element,
    kind,
    identity,
    label
  ) {
    if (kind === SEMANTIC_KINDS.CARDINAL) {
      let letter =
        element.querySelector(
          "[data-showroom-projected-cardinal-letter]"
        );
      let word =
        element.querySelector(
          "[data-showroom-projected-cardinal-word]"
        );

      if (!letter || !word) {
        element.replaceChildren();

        letter = document.createElement("span");
        letter.className =
          "showroom-projected-label__cardinal-letter";
        letter.dataset.showroomProjectedCardinalLetter = identity;
        letter.setAttribute("aria-hidden", "true");

        word = document.createElement("span");
        word.className =
          "showroom-projected-label__cardinal-word";
        word.dataset.showroomProjectedCardinalWord = identity;

        element.append(letter, word);
      }

      letter.textContent =
        CARDINAL_DISPLAY_LETTERS[identity] || "";
      word.textContent = label;
      element.dataset.showroomProjectedContentModel =
        "compass-family-letter-word";
      return;
    }

    if (
      element.dataset.showroomProjectedContentModel !==
      "cluster-primary-only"
    ) {
      element.replaceChildren();
    }

    element.textContent = label;
    element.dataset.showroomProjectedContentModel =
      "cluster-primary-only";
  }

  function syncProjectedLabels() {
    state.projectedLabelFrame = 0;

    const layer = ensureProjectedLabelLayer();
    const controller =
      state.controller ||
      resolveController();

    if (
      !layer ||
      !controller ||
      typeof controller.getSemanticProjection !== "function" ||
      typeof controller.getFrameState !== "function"
    ) {
      return false;
    }

    let records = [];
    let frame = null;

    try {
      records = Array.from(
        controller.getSemanticProjection() || []
      );
      frame = controller.getFrameState();
    } catch {
      records = [];
      frame = null;
    }

    const mode = presentationMode(frame);
    const activeIdentities = new Set();
    const rect = state.orbitField.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const constellationPrimary = normalizeWing(
      frame && frame.orbitGestureActive
        ? frame.orbitPreviewFocus
        : frame && frame.orbitFocus
    );
    const clusterPrimary = normalizeRoomId(
      frame && frame.cluster
        ? frame.cluster.gestureActive
          ? frame.cluster.previewPrimaryRoom
          : frame.cluster.primaryRoom
        : ""
    );

    layer.dataset.showroomProjectedLabelMode =
      normalizeLower(mode);
    layer.dataset.showroomProjectedClusterModel =
      "primary-only";

    for (const record of records) {
      if (!record || record.visible === false) {
        continue;
      }

      const kind = semanticKindFromHit(record);
      const identity = semanticIdentityFromHit(record, kind);
      const label = projectedLabelText(kind, identity);

      if (!identity || !label) {
        continue;
      }

      if (
        mode === PRESENTATION_MODES.CONSTELLATION &&
        kind !== SEMANTIC_KINDS.CARDINAL
      ) {
        continue;
      }

      if (
        mode === PRESENTATION_MODES.CLUSTER &&
        (
          kind !== SEMANTIC_KINDS.ROOM ||
          identity !== clusterPrimary
        )
      ) {
        continue;
      }

      if (mode === PRESENTATION_MODES.HELD) {
        continue;
      }

      activeIdentities.add(identity);

      let element = state.projectedLabels.get(identity);

      if (!element) {
        element = document.createElement("span");
        element.className = "showroom-projected-label";
        element.dataset.showroomProjectedLabel = identity;
        layer.appendChild(element);
        state.projectedLabels.set(identity, element);
      }

      syncProjectedLabelContent(
        element,
        kind,
        identity,
        label
      );

      const x = Number(record.x);
      const y = Number(record.y);
      const radius = Math.max(0, Number(record.radiusPx) || 0);
      const dx = x - centerX;
      const dy = y - centerY;
      const magnitude = Math.hypot(dx, dy) || 1;
      const roomOffset =
        Math.min(30, Math.max(17, radius * 0.24 + 8));
      const candidateLeft =
        kind === SEMANTIC_KINDS.CARDINAL
          ? x
          : x - (dx / magnitude) * roomOffset;
      const candidateTop =
        kind === SEMANTIC_KINDS.CARDINAL
          ? y
          : y - (dy / magnitude) * roomOffset;
      const depth = normalizeLower(record.depthLayer) || "unknown";
      const primary =
        kind === SEMANTIC_KINDS.CARDINAL
          ? identity === constellationPrimary
          : identity === clusterPrimary;

      element.hidden = false;
      element.dataset.showroomProjectedKind = kind;
      element.dataset.showroomProjectedDepth = depth;
      element.dataset.showroomProjectedPrimary = primary ? "true" : "false";
      element.dataset.showroomProjectedPlacement =
        kind === SEMANTIC_KINDS.CARDINAL
          ? "star-center-protected-letter-word"
          : "inward-edge-primary-only";
      element.style.visibility = "hidden";
      element.style.left = "0px";
      element.style.top = "0px";

      const labelRect = element.getBoundingClientRect();
      const labelWidth = Math.max(
        1,
        labelRect.width || element.offsetWidth || 1
      );
      const labelHeight = Math.max(
        1,
        labelRect.height || element.offsetHeight || 1
      );
      const safeInset = kind === SEMANTIC_KINDS.CARDINAL ? 10 : 8;
      const minLeft = safeInset + labelWidth / 2;
      const maxLeft = Math.max(
        minLeft,
        rect.width - safeInset - labelWidth / 2
      );
      const minTop = safeInset + labelHeight / 2;
      const maxTop = Math.max(
        minTop,
        rect.height - safeInset - labelHeight / 2
      );
      const left = Math.min(
        maxLeft,
        Math.max(minLeft, candidateLeft)
      );
      const top = Math.min(
        maxTop,
        Math.max(minTop, candidateTop)
      );
      const clamped =
        Math.abs(left - candidateLeft) > 0.5 ||
        Math.abs(top - candidateTop) > 0.5;

      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.zIndex = depth === "front" ? "28" : "8";
      element.style.visibility = "visible";
      element.dataset.showroomProjectedClamped = clamped ? "true" : "false";
    }

    for (const [identity, element] of state.projectedLabels) {
      if (!activeIdentities.has(identity)) {
        element.hidden = true;
      }
    }

    return true;
  }

'''
    interactions = interactions[:start] + replacement + interactions[end:]
    interactions_path.write_text(interactions, encoding="utf-8")


# -----------------------------------------------------------------------------
# Production source: Showroom label visual hierarchy and contrast.
# -----------------------------------------------------------------------------
css_path = ROOT / "showroom/index.css"
css = css_path.read_text(encoding="utf-8")
section_marker = "/* ================================================================\n   23. BOUNDED PROJECTED STAR LABELS AND CENTER HIT CORRECTION\n   ================================================================ */\n"
section_start = css.find(section_marker)
if section_start < 0:
    raise RuntimeError("Showroom projected-label CSS section missing")

new_css_section = r'''/* ================================================================
   23. COMPASS-FAMILY LABEL HIERARCHY AND PRIMARY-ONLY CLUSTER LABEL
   SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A
   ================================================================ */

.showroom-projected-label-layer {
  position: absolute;
  z-index: 26;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

.showroom-projected-label {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.showroom-projected-label[data-showroom-projected-kind="cardinal"] {
  width: clamp(5rem, 12vw, 6.4rem);
  height: clamp(4rem, 9.6vw, 5.2rem);
  padding: 0;
  color: rgba(255, 248, 224, 0.96);
  background: transparent;
  box-shadow: none;
  text-shadow: none;
}

.showroom-projected-label__cardinal-letter {
  position: absolute;
  top: 39%;
  left: 50%;
  display: grid;
  width: 1.68rem;
  height: 1.68rem;
  place-items: center;
  border: 1px solid rgba(255, 248, 224, 0.38);
  border-radius: 50%;
  color: #140f07;
  background:
    radial-gradient(
      circle at 35% 28%,
      #fff4c8,
      #d7ae5c 66%,
      #705121
    );
  box-shadow:
    0 0 0.9rem rgba(243, 217, 139, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
  font-size: 0.82rem;
  font-weight: 950;
  letter-spacing: 0.04em;
  line-height: 1;
  transform: translate(-50%, -50%);
}

.showroom-projected-label__cardinal-word {
  position: absolute;
  top: 69%;
  left: 50%;
  display: block;
  min-width: 4.15rem;
  padding: 0.24rem 0.44rem;
  border: 1px solid rgba(225, 218, 198, 0.22);
  border-radius: 999px;
  color: rgba(255, 248, 224, 0.97);
  background:
    linear-gradient(
      135deg,
      rgba(4, 8, 16, 0.9),
      rgba(20, 31, 43, 0.84)
    );
  box-shadow:
    0 0.35rem 1rem rgba(0, 0, 0, 0.44),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  font-size: clamp(0.54rem, 1.12vw, 0.7rem);
  font-weight: 900;
  letter-spacing: 0.075em;
  line-height: 1.05;
  text-align: center;
  text-shadow:
    0 0.1rem 0.18rem rgba(0, 0, 0, 0.98),
    0 0 0.55rem rgba(0, 0, 0, 0.98);
  text-transform: uppercase;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(3px);
}

.showroom-projected-label[data-showroom-projected-kind="room"] {
  max-width: min(10rem, 44vw);
  padding: 0.28rem 0.48rem;
  border: 1px solid rgba(225, 218, 198, 0.22);
  border-radius: 999px;
  color: rgba(246, 238, 223, 0.97);
  background:
    linear-gradient(
      135deg,
      rgba(3, 6, 13, 0.9),
      rgba(22, 31, 42, 0.82)
    );
  box-shadow:
    0 0.35rem 1rem rgba(0, 0, 0, 0.48),
    0 0 0.72rem rgba(117, 233, 255, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  font-size: clamp(0.58rem, 1.2vw, 0.74rem);
  font-weight: 900;
  letter-spacing: 0.075em;
  line-height: 1.05;
  text-align: center;
  text-shadow:
    0 0.1rem 0.18rem rgba(0, 0, 0, 0.98),
    0 0 0.55rem rgba(0, 0, 0, 0.98);
  text-transform: uppercase;
  white-space: nowrap;
  backdrop-filter: blur(3px);
}

.showroom-projected-label[data-showroom-projected-depth="rear"] {
  opacity: 0.46;
  filter: saturate(0.72) brightness(0.74);
}

.showroom-projected-label[data-showroom-projected-primary="true"] {
  opacity: 1;
  filter:
    brightness(1.14)
    drop-shadow(0 0 0.52rem rgba(245, 213, 130, 0.34));
}

.showroom-projected-label[data-showroom-projected-kind="room"]
[data-showroom-projected-primary="true"] {
  color: #fff3be;
}

@media (max-width: 520px) {
  .showroom-projected-label[data-showroom-projected-kind="cardinal"] {
    width: 5rem;
    height: 4.15rem;
  }

  .showroom-projected-label__cardinal-letter {
    width: 1.52rem;
    height: 1.52rem;
    font-size: 0.74rem;
  }

  .showroom-projected-label__cardinal-word {
    min-width: 3.75rem;
    padding: 0.21rem 0.38rem;
    font-size: 0.54rem;
  }

  .showroom-projected-label[data-showroom-projected-kind="room"] {
    max-width: 7.4rem;
    padding: 0.25rem 0.42rem;
    font-size: 0.56rem;
  }
}
'''
css = css[:section_start] + new_css_section
css_path.write_text(css, encoding="utf-8")


# -----------------------------------------------------------------------------
# Production source: truthful page/cache identity for the bounded correction.
# -----------------------------------------------------------------------------
html_path = ROOT / "showroom/index.html"
html = html_path.read_text(encoding="utf-8")
replacements = [
    (
        "<!-- SHOWROOM_LABEL_CONTAINMENT_20260726B -->",
        f"<!-- {MARKER} -->",
        "html marker",
    ),
    (
        "SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_15_LABEL_CONTAINMENT",
        "SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_16_LABEL_HIERARCHY_PRIMARY_ONLY",
        "html contract",
    ),
    (
        "SHOWROOM-MIRRORLAND-IMMERSIVE-MISSION-CONTEXT-17.12",
        "SHOWROOM-MIRRORLAND-IMMERSIVE-MISSION-CONTEXT-17.13",
        "html version",
    ),
    (
        'data-showroom-projected-label-model="four-cardinal-and-four-active-room-labels-inward-edge-constrained"',
        'data-showroom-projected-label-model="four-cardinal-compass-family-and-one-active-room-label"',
        "projected label model",
    ),
    (
        "/showroom/index.css?v=SHOWROOM_CENTER_HIT_PROJECTED_LABELS_20260726A",
        f"/showroom/index.css?v={MARKER}",
        "css cache identity",
    ),
    (
        'data-showroom-page-css-contract="SHOWROOM_CENTER_HIT_PROJECTED_LABELS_20260726A"',
        f'data-showroom-page-css-contract="{MARKER}"',
        "css contract identity",
    ),
    (
        "/showroom/index.interactions.js?v=SHOWROOM_LABEL_CONTAINMENT_20260726B",
        f"/showroom/index.interactions.js?v={MARKER}",
        "interaction cache identity",
    ),
]
for old, new, label in replacements:
    if old not in html:
        raise RuntimeError(f"{label}: source token missing")
    html = html.replace(old, new)
html_path.write_text(html, encoding="utf-8")


# -----------------------------------------------------------------------------
# Dedicated exact-head browser benchmark.
# -----------------------------------------------------------------------------
benchmark_path = ROOT / "verification/benchmark-tools/four-compass-benchmark-v1/showroom-label-conformance-benchmark.mjs"
benchmark_path.parent.mkdir(parents=True, exist_ok=True)
benchmark_path.write_text(textwrap.dedent(r'''\
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
  controller: fs.readFileSync("showroom/index.controller.js", "utf8")
};
const sourceCardinalControls = (source.html.match(/data-showroom-cardinal-control/g) || []).length;
const sourceRoomControls = (source.html.match(/data-showroom-child-control/g) || []).length;
assert(source.html.includes('data-showroom-projected-label-model="four-cardinal-compass-family-and-one-active-room-label"'), "LABEL_MODEL_SOURCE_MISSING");
assert(source.interactions.includes("SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A"), "INTERACTION_BUILD_MARKER_MISSING");
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

  const clusterAccepted = await page.evaluate(() => globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER.requestCardinalSelection("east"));
  assert(clusterAccepted !== false, "EAST_CLUSTER_SELECTION_REJECTED", clusterAccepted, profile.id);
  await page.waitForFunction(() => document.querySelector("[data-showroom-root]")?.dataset.showroomControllerState === "CLUSTER_OPEN", { timeout: 15000 });
  await waitForVisibleCounts(0, 1);
  await sleep(180);
  const cluster = await inspect("CLUSTER_OPEN");
  assert(cluster.cardinalVisibleCount === 0, "CARDINAL_LABEL_VISIBLE_IN_CLUSTER", cluster, profile.id);
  assert(cluster.roomVisibleCount === 1 && cluster.roomPrimaryCount === 1, "CLUSTER_SINGLE_LABEL_INVALID", cluster, profile.id);
  assert(cluster.visibleRoomLabels[0]?.id === "east-1" && cluster.visibleRoomLabels[0]?.text === "Jeeves", "INITIAL_CLUSTER_PRIMARY_LABEL_INVALID", cluster.visibleRoomLabels, profile.id);
  assert(cluster.visibleRoomLabels.every(item => item.placement === "inward-edge-primary-only" && item.contained), "CLUSTER_LABEL_PLACEMENT_INVALID", cluster.visibleRoomLabels, profile.id);
  assert(cluster.horizontalOverflow <= 1, "CLUSTER_LAYOUT_OVERFLOW", cluster, profile.id);
  await shot("cluster");

  const previewAccepted = await page.evaluate(() => {
    const controller = globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER;
    controller.beginClusterGesture("east");
    return controller.requestClusterPreview("east", {
      quaternion: [0, 0, 0, 1],
      primaryId: "east-2"
    });
  });
  assert(previewAccepted !== false, "CLUSTER_PREVIEW_REJECTED", previewAccepted, profile.id);
  await page.waitForFunction(() => {
    const root = document.querySelector("[data-showroom-root]");
    const visibleLabels = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')].filter(element => {
      if (element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.01 && rect.width > 0 && rect.height > 0;
    });
    return root?.dataset.showroomClusterGestureActive === "true" && root?.dataset.showroomClusterPreviewPrimaryRoom === "east-2" && visibleLabels.length === 1 && visibleLabels[0].dataset.showroomProjectedLabel === "east-2";
  }, { timeout: 15000 });
  await sleep(180);
  const preview = await inspect("CLUSTER_GESTURE_PREVIEW");
  assert(preview.roomVisibleCount === 1 && preview.roomPrimaryCount === 1, "PREVIEW_SINGLE_LABEL_INVALID", preview, profile.id);
  assert(preview.visibleRoomLabels[0]?.id === "east-2" && preview.visibleRoomLabels[0]?.text === "Elara", "PREVIEW_PRIMARY_LABEL_INVALID", preview.visibleRoomLabels, profile.id);
  await shot("preview");

  const commitAccepted = await page.evaluate(() => globalThis.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER.requestClusterCommit("east"));
  assert(commitAccepted !== false, "CLUSTER_COMMIT_REJECTED", commitAccepted, profile.id);
  await page.waitForFunction(() => {
    const root = document.querySelector("[data-showroom-root]");
    return root?.dataset.showroomClusterGestureActive === "false" && root?.dataset.showroomClusterPrimaryRoom === "east-2";
  }, { timeout: 15000 });
  await waitForVisibleCounts(0, 1);
  await sleep(180);
  const committed = await inspect("CLUSTER_GESTURE_COMMITTED");
  assert(committed.roomVisibleCount === 1 && committed.roomPrimaryCount === 1, "COMMITTED_SINGLE_LABEL_INVALID", committed, profile.id);
  assert(committed.visibleRoomLabels[0]?.id === "east-2" && committed.visibleRoomLabels[0]?.text === "Elara", "COMMITTED_PRIMARY_LABEL_INVALID", committed.visibleRoomLabels, profile.id);
  assert(committed.horizontalOverflow <= 1, "COMMITTED_LAYOUT_OVERFLOW", committed, profile.id);
  await shot("committed");

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
  checkpoint: "SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A",
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
    clusterLabelModel: "primary-only",
    previewAuthority: "cluster.previewPrimaryRoom",
    committedAuthority: "cluster.primaryRoom"
  },
  observations,
  screenshotManifest,
  failures,
  pass: failures.length === 0,
  stoppingBoundary: {
    proves: ["EXACT_HEAD_BROWSER_EXECUTION", "FOUR_CARDINAL_LABEL_HIERARCHY", "SINGLE_CLUSTER_LABEL", "PREVIEW_AND_COMMIT_PRIMARY_TRACKING", "LABEL_CONTAINMENT"],
    doesNotProve: ["PHYSICAL_SAMSUNG_ACCEPTANCE", "UNIVERSAL_VISUAL_CORRECTNESS", "SCIENTIFIC_VALIDATION"]
  }
};
fs.writeFileSync(OUT, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ pass: receipt.pass, failures: failures.length, observations: observations.length, screenshots: screenshotManifest.length }, null, 2));
if (failures.length) process.exitCode = 1;
'''), encoding="utf-8")


# -----------------------------------------------------------------------------
# Permanent exact-head workflows.
# -----------------------------------------------------------------------------
dedicated_workflow = textwrap.dedent(r'''\
name: Showroom Label Conformance Benchmark

on:
  pull_request:
    branches:
      - main
    paths:
      - "showroom/**"
      - "verification/benchmark-tools/four-compass-benchmark-v1/showroom-label-conformance-benchmark.mjs"
      - ".github/workflows/showroom-label-conformance-benchmark.yml"
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: showroom-label-conformance-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

env:
  EXECUTION_BRANCH: ${{ github.event.pull_request.head.ref || github.ref_name }}
  EXECUTION_COMMIT: ${{ github.event.pull_request.head.sha || github.sha }}
  SHOWROOM_LABEL_ORIGIN: http://127.0.0.1:4173

jobs:
  showroom-label-conformance:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Checkout exact execution head
        uses: actions/checkout@v4
        with:
          ref: ${{ env.EXECUTION_COMMIT }}

      - name: Verify exact checkout identity
        run: test "$(git rev-parse HEAD)" = "$EXECUTION_COMMIT"

      - uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Set up Chrome
        id: chrome
        uses: browser-actions/setup-chrome@v1
        with:
          chrome-version: stable

      - name: Install pinned browser driver
        run: npm install --no-save --no-package-lock puppeteer-core@24.15.0

      - name: Validate source syntax
        run: |
          node --check showroom/index.interactions.js
          node --check showroom/index.controller.js
          node --check verification/benchmark-tools/four-compass-benchmark-v1/showroom-label-conformance-benchmark.mjs

      - name: Start exact-head static server
        shell: bash
        run: |
          python3 -m http.server 4173 --bind 127.0.0.1 > /tmp/showroom-label-server.log 2>&1 &
          for attempt in $(seq 1 40); do
            if curl -fsS http://127.0.0.1:4173/showroom/ >/dev/null; then
              exit 0
            fi
            sleep 0.25
          done
          cat /tmp/showroom-label-server.log
          exit 1

      - name: Execute Showroom label browser benchmark
        id: benchmark
        continue-on-error: true
        env:
          CHROME_PATH: ${{ steps.chrome.outputs.chrome-path }}
        run: node verification/benchmark-tools/four-compass-benchmark-v1/showroom-label-conformance-benchmark.mjs

      - name: Report and validate receipt
        if: always()
        run: |
          node <<'NODE'
          const fs = require('node:fs');
          const file = 'showroom-label-conformance-benchmark-v1.json';
          if (!fs.existsSync(file)) throw new Error('SHOWROOM_LABEL_RECEIPT_MISSING');
          const receipt = JSON.parse(fs.readFileSync(file, 'utf8'));
          console.log(JSON.stringify({ pass: receipt.pass, failures: receipt.failures, observations: receipt.observations.length, screenshots: receipt.screenshotManifest.length }, null, 2));
          const failures = [];
          if (receipt.pass !== true || receipt.failures.length !== 0) failures.push('receipt');
          if (receipt.execution.commit !== process.env.EXECUTION_COMMIT) failures.push('commit');
          if (receipt.invariant.cardinalCount !== 4 || receipt.invariant.roomCount !== 16) failures.push('membership');
          if (receipt.invariant.constellationVisibleLabelCount !== 4 || receipt.invariant.clusterVisibleLabelCount !== 1) failures.push('label_count');
          if (receipt.invariant.cardinalLabelModel !== 'compass-family-letter-word' || receipt.invariant.clusterLabelModel !== 'primary-only') failures.push('label_model');
          if (receipt.observations.length !== 2 || receipt.screenshotManifest.length !== 10) failures.push('evidence_count');
          if (failures.length) throw new Error(`SHOWROOM_LABEL_RECEIPT_INVALID:${failures.join(',')}`);
          NODE

      - name: Upload exact-head evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: showroom-label-conformance-benchmark-v1-evidence
          path: |
            showroom-label-conformance-benchmark-v1.json
            showroom-label-conformance-benchmark-v1-screenshots/**
            /tmp/showroom-label-server.log
          if-no-files-found: error
          retention-days: 30
''')

family_workflow = textwrap.dedent(r'''\
name: Showroom Four-Compass Exact-Head Regression

on:
  pull_request:
    branches:
      - main
    paths:
      - "showroom/**"
      - "verification/benchmark-tools/four-compass-benchmark-v1/four-compass-benchmark.config.mjs"
      - "verification/benchmark-tools/four-compass-benchmark-v1/four-compass-browser-baseline.mjs"
      - ".github/workflows/showroom-four-compass-exact-head-regression.yml"
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: showroom-four-compass-regression-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

env:
  EXECUTION_BRANCH: ${{ github.event.pull_request.head.ref || github.ref_name }}
  EXECUTION_COMMIT: ${{ github.event.pull_request.head.sha || github.sha }}
  FOUR_COMPASS_ORIGIN: http://127.0.0.1:4173

jobs:
  four-compass-regression:
    runs-on: ubuntu-latest
    timeout-minutes: 35
    steps:
      - name: Checkout exact execution head
        uses: actions/checkout@v4
        with:
          ref: ${{ env.EXECUTION_COMMIT }}

      - name: Verify exact checkout identity
        run: test "$(git rev-parse HEAD)" = "$EXECUTION_COMMIT"

      - uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Set up Chrome
        id: chrome
        uses: browser-actions/setup-chrome@v1
        with:
          chrome-version: stable

      - name: Install pinned browser driver
        run: npm install --no-save --no-package-lock puppeteer-core@24.15.0

      - name: Validate family benchmark source
        run: |
          node --check verification/benchmark-tools/four-compass-benchmark-v1/four-compass-benchmark.config.mjs
          node --check verification/benchmark-tools/four-compass-benchmark-v1/four-compass-browser-baseline.mjs

      - name: Start exact-head static server
        shell: bash
        run: |
          python3 -m http.server 4173 --bind 127.0.0.1 > /tmp/showroom-four-compass-server.log 2>&1 &
          for attempt in $(seq 1 40); do
            if curl -fsS http://127.0.0.1:4173/showroom/ >/dev/null; then
              exit 0
            fi
            sleep 0.25
          done
          cat /tmp/showroom-four-compass-server.log
          exit 1

      - name: Execute exact-head Four-Compass regression
        env:
          CHROME_PATH: ${{ steps.chrome.outputs.chrome-path }}
        run: node verification/benchmark-tools/four-compass-benchmark-v1/four-compass-browser-baseline.mjs

      - name: Validate family and Showroom execution
        run: |
          node <<'NODE'
          const fs = require('node:fs');
          const compass = JSON.parse(fs.readFileSync('four-compass-benchmark-tool-baseline.json', 'utf8'));
          const auxiliary = JSON.parse(fs.readFileSync('website-home-receiver-control-baseline.json', 'utf8'));
          const failures = [];
          if (compass.status !== 'PASS_BOUNDED_LANE_BASELINE' || compass.summaries.length !== 4) failures.push('compass_lane');
          if (auxiliary.status !== 'PASS_BOUNDED_LANE_BASELINE' || auxiliary.summaries.length !== 1) failures.push('auxiliary_lane');
          if (compass.execution.commit !== process.env.EXECUTION_COMMIT) failures.push('commit');
          const showroom = compass.summaries.find(item => item.authorityId === 'SHOWROOM_COMPASS');
          if (!showroom || showroom.posture !== 'POSITIVE_REFERENCE' || showroom.executedProfileCount !== 2 || showroom.captureCount !== 12) failures.push('showroom_summary');
          const records = compass.records.filter(item => item.authorityId === 'SHOWROOM_COMPASS');
          if (records.length !== 2 || records.some(item => item.status !== 'EXECUTED' || item.captures.length !== 6)) failures.push('showroom_records');
          const blockingIds = new Set(['HORIZONTAL_OVERFLOW', 'IMPORTANT_ELEMENT_ABSENT', 'IMPORTANT_ELEMENT_ZERO_OR_HIDDEN']);
          const blocking = compass.findings.filter(item => item.authorityId === 'SHOWROOM_COMPASS' && blockingIds.has(item.id));
          if (blocking.length) failures.push(`showroom_blocking:${blocking.map(item => item.id).join('|')}`);
          if (failures.length) throw new Error(`SHOWROOM_FOUR_COMPASS_REGRESSION_FAILED:${failures.join(',')}`);
          NODE

      - name: Upload exact-head regression evidence
        uses: actions/upload-artifact@v4
        with:
          name: showroom-four-compass-exact-head-regression-evidence
          path: |
            four-compass-benchmark-tool-baseline.json
            website-home-receiver-control-baseline.json
            four-compass-benchmark-tool-screenshots/**
            website-home-receiver-control-screenshots/**
            /tmp/showroom-four-compass-server.log
          if-no-files-found: error
          retention-days: 30
''')

workflow_dir = ROOT / ".github/workflows"
workflow_dir.mkdir(parents=True, exist_ok=True)
(workflow_dir / "showroom-label-conformance-benchmark.yml").write_text(dedicated_workflow, encoding="utf-8")
(workflow_dir / "showroom-four-compass-exact-head-regression.yml").write_text(family_workflow, encoding="utf-8")


# Temporary applicator infrastructure must not remain in the final candidate.
Path(".github/workflows/showroom-label-hierarchy-applicator.yml").unlink(missing_ok=True)
Path("verification/showroom-label-correction/apply-showroom-label-hierarchy.py").unlink(missing_ok=True)
try:
    Path("verification/showroom-label-correction").rmdir()
except OSError:
    pass

print(MARKER)
