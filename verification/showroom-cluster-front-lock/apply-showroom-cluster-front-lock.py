from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    (ROOT / path).write_text(text, encoding="utf-8")


def replace_once(path: str, old: str, new: str) -> None:
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{path}: expected one exact match, found {count}: {old[:80]!r}")
    write(path, text.replace(old, new, 1))


def regex_once(path: str, pattern: str, replacement: str) -> None:
    text = read(path)
    next_text, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise RuntimeError(f"{path}: expected one regex match, found {count}: {pattern[:100]!r}")
    write(path, next_text)


MARKER = "SHOWROOM_CLUSTER_CAMERA_FRONT_LOCK_AND_COMPASS_FIT_20260729B"

# -----------------------------------------------------------------------------
# Gesture authority: align room positions with the actual crystal geometry,
# score against the camera-facing +Z axis, and preserve a bounded lock margin.
# -----------------------------------------------------------------------------
replace_once(
    "showroom/index.interaction.gestures.js",
    "/* SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1 */",
    "/* SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1 */\n"
    f"/* {MARKER} */",
)

replace_once(
    "showroom/index.interaction.gestures.js",
    '''  const ROOM_BASE_POSITIONS = Object.freeze({
    1: Object.freeze([-0.92, 0.82, -0.46]),
    2: Object.freeze([0.92, 0.82, 0.50]),
    3: Object.freeze([0.92, -0.82, -0.42]),
    4: Object.freeze([-0.92, -0.82, 0.46])
  });''',
    '''  const ROOM_BASE_POSITIONS = Object.freeze({
    1: Object.freeze([0, 0.42155918243834756, -0.9713677415028749]),
    2: Object.freeze([1.3178909481432288, 0.29135821915396054, 0]),
    3: Object.freeze([0, -0.5073345276802548, 0.9389695242664297]),
    4: Object.freeze([-1.351990798995593, -0.12787386777498447, 0])
  });''',
)

replace_once(
    "showroom/index.interaction.gestures.js",
    '''  const PRIMARY_ANCHORS = Object.freeze({
    orbit: Object.freeze([0, 1, 0.08]),
    cluster: Object.freeze([0, 1, 0.16])
  });''',
    '''  const PRIMARY_ANCHORS = Object.freeze({
    orbit: Object.freeze([0, 1, 0.08]),
    cluster: Object.freeze([0, 0, 1])
  });

  const ROOM_PRIMARY_HYSTERESIS = 0.075;''',
)

regex_once(
    "showroom/index.interaction.gestures.js",
    r'''  function primaryRoomForQuaternion\(roomIds, quaternion\) \{.*?\n  \}\n\n  function appendSample''',
    '''  function primaryRoomForQuaternion(
    roomIds,
    quaternion,
    previousRoomId = "",
    hysteresis = ROOM_PRIMARY_HYSTERESIS
  ) {
    const anchor = normalizeVector(PRIMARY_ANCHORS.cluster);
    const normalizedQuaternion = quaternionNormalize(quaternion);

    const candidates =
      Array.isArray(roomIds)
        ? roomIds
            .map(roomId => String(roomId == null ? "" : roomId).trim())
            .filter(roomId => roomOrdinal(roomId) > 0)
        : [];

    if (!candidates.length) {
      return "";
    }

    const scores = new Map();
    let bestRoom = candidates[0];
    let bestScore = -Infinity;

    for (const roomId of candidates) {
      const ordinal = roomOrdinal(roomId);
      const rotated = quaternionRotateVector(
        normalizedQuaternion,
        ROOM_BASE_POSITIONS[ordinal]
      );
      const score = dot(rotated, anchor);

      scores.set(roomId, score);

      if (score > bestScore) {
        bestScore = score;
        bestRoom = roomId;
      }
    }

    const previous = String(
      previousRoomId == null ? "" : previousRoomId
    ).trim();
    const margin = Math.max(
      0,
      finiteNumber(hysteresis, ROOM_PRIMARY_HYSTERESIS)
    );

    if (
      previous &&
      previous !== bestRoom &&
      scores.has(previous)
    ) {
      const previousScore = scores.get(previous);

      if (bestScore < previousScore + margin) {
        return previous;
      }
    }

    return bestRoom;
  }

  function appendSample''',
)

# -----------------------------------------------------------------------------
# Interaction/presentation authority: derive the displayed room label from the
# current cluster quaternion, and pass the previous label into the gesture lock.
# -----------------------------------------------------------------------------
replace_once(
    "showroom/index.interactions.js",
    "/* SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A */",
    "/* SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A */\n"
    f"/* {MARKER} */",
)

replace_once(
    "showroom/index.interactions.js",
    '''    const controller =
      state.controller ||
      resolveController();

    if (
      !layer ||''',
    '''    const controller =
      state.controller ||
      resolveController();

    const gestures =
      state.gestures ||
      resolveGestures();

    if (
      !layer ||''',
)

replace_once(
    "showroom/index.interactions.js",
    '''    const clusterPrimary = normalizeRoomId(
      frame && frame.cluster
        ? frame.cluster.gestureActive
          ? frame.cluster.previewPrimaryRoom
          : frame.cluster.primaryRoom
        : ""
    );''',
    '''    const controllerClusterPrimary = normalizeRoomId(
      frame && frame.cluster
        ? frame.cluster.gestureActive
          ? frame.cluster.previewPrimaryRoom
          : frame.cluster.primaryRoom
        : ""
    );
    const clusterPrimary = normalizeRoomId(
      frame &&
      frame.cluster &&
      gestures &&
      typeof gestures.primaryRoomForQuaternion === "function" &&
      typeof gestures.orientationQuaternion === "function"
        ? gestures.primaryRoomForQuaternion(
            frame.cluster.roomIds,
            gestures.orientationQuaternion(
              frame.cluster.orientation
            ),
            controllerClusterPrimary
          )
        : controllerClusterPrimary
    );''',
)

replace_once(
    "showroom/index.interactions.js",
    '''        const primaryId =
          gestures.primaryRoomForQuaternion(
            pointer.clusterRoomIds,
            pointer.currentQuaternion
          );''',
    '''        const previousPrimaryId =
          pointer.previewPrimaryId ||
          normalizeRoomId(
            frame && frame.cluster
              ? frame.cluster.previewPrimaryRoom ||
                frame.cluster.primaryRoom
              : ""
          );
        const primaryId =
          gestures.primaryRoomForQuaternion(
            pointer.clusterRoomIds,
            pointer.currentQuaternion,
            previousPrimaryId
          );''',
)

# -----------------------------------------------------------------------------
# CSS: compact only the visible Main Compass capsule. The surrounding semantic
# control and interaction hit authority remain untouched.
# -----------------------------------------------------------------------------
replace_once(
    "showroom/index.css",
    "   SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A",
    "   SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A\n"
    f"   {MARKER}",
)

replace_once(
    "showroom/index.css",
    '''  right: 18%;
  bottom: 17%;
  left: 18%;
  min-height: 2.35rem;''',
    '''  right: auto;
  bottom: 17%;
  left: 50%;
  width: clamp(7rem, 49%, 8.4rem);
  min-height: 2.15rem;
  transform: translateX(-50%);''',
)

replace_once(
    "showroom/index.css",
    '''  min-width: 64%;
  padding: 0.42rem 0.78rem 0.12rem;''',
    '''  min-width: 0;
  width: max-content;
  max-width: 8.1rem;
  padding: 0.34rem 0.58rem 0.08rem;''',
)

replace_once(
    "showroom/index.css",
    '''  min-width: 64%;
  padding: 0.12rem 0.78rem 0.42rem;''',
    '''  min-width: 0;
  width: max-content;
  max-width: 8.1rem;
  padding: 0.08rem 0.58rem 0.34rem;''',
)

replace_once(
    "showroom/index.css",
    '''    right: 15%;
    bottom: 15%;
    left: 15%;
    min-height: 2.05rem;''',
    '''    right: auto;
    bottom: 15%;
    left: 50%;
    width: clamp(6.7rem, 54%, 7.8rem);
    min-height: 2rem;
    transform: translateX(-50%);''',
)

# -----------------------------------------------------------------------------
# HTML: truthful contract/cache identities only.
# -----------------------------------------------------------------------------
html_path = "showroom/index.html"
html = read(html_path)
html = html.replace(
    "<!-- SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A -->",
    "<!-- SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A -->\n"
    f"<!-- {MARKER} -->",
    1,
)
html = html.replace(
    "SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_16_LABEL_HIERARCHY_PRIMARY_ONLY",
    "SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_17_CLUSTER_CAMERA_FRONT_LOCK_COMPASS_FIT",
)
html = html.replace(
    'data-showroom-projected-label-model="four-cardinal-compass-family-and-one-active-room-label"',
    'data-showroom-projected-label-model="four-cardinal-compass-family-and-one-camera-front-room-label"',
    1,
)
html = html.replace(
    "/showroom/index.interaction.gestures.js?v=SHOWROOM_INTERACTION_GESTURE_SUPPORT_TNT_v1",
    f"/showroom/index.interaction.gestures.js?v={MARKER}",
    1,
)
html = html.replace(
    "/showroom/index.interactions.js?v=SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A",
    f"/showroom/index.interactions.js?v={MARKER}",
    1,
)
html = html.replace(
    "/showroom/index.css?v=SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A",
    f"/showroom/index.css?v={MARKER}",
    1,
)
write(html_path, html)

# -----------------------------------------------------------------------------
# Dedicated exact-head browser benchmark: replace controller-substitution with
# the actual pointer/touch gesture path and assert the compact visible capsule.
# -----------------------------------------------------------------------------
bench_path = "verification/benchmark-tools/four-compass-benchmark-v1/showroom-label-conformance-benchmark.mjs"
replace_once(
    bench_path,
    '''  interactions: fs.readFileSync("showroom/index.interactions.js", "utf8"),
  controller: fs.readFileSync("showroom/index.controller.js", "utf8")''',
    '''  interactions: fs.readFileSync("showroom/index.interactions.js", "utf8"),
  gestures: fs.readFileSync("showroom/index.interaction.gestures.js", "utf8"),
  controller: fs.readFileSync("showroom/index.controller.js", "utf8")''',
)

replace_once(
    bench_path,
    '''assert(source.html.includes('data-showroom-projected-label-model="four-cardinal-compass-family-and-one-active-room-label"'), "LABEL_MODEL_SOURCE_MISSING");
assert(source.interactions.includes("SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A"), "INTERACTION_BUILD_MARKER_MISSING");''',
    f'''assert(source.html.includes('data-showroom-projected-label-model="four-cardinal-compass-family-and-one-camera-front-room-label"'), "LABEL_MODEL_SOURCE_MISSING");
assert(source.interactions.includes("{MARKER}"), "INTERACTION_BUILD_MARKER_MISSING");
assert(source.gestures.includes("{MARKER}"), "GESTURE_BUILD_MARKER_MISSING");
assert(source.gestures.includes("cluster: Object.freeze([0, 0, 1])"), "CAMERA_FRONT_ANCHOR_MISSING");
assert(source.gestures.includes("ROOM_PRIMARY_HYSTERESIS"), "ROOM_PRIMARY_HYSTERESIS_MISSING");''',
)

replace_once(
    bench_path,
    '''    const cardinalLabels = [...document.querySelectorAll('[data-showroom-projected-kind="cardinal"]')];
    const roomLabels = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')];''',
    '''    const cardinalLabels = [...document.querySelectorAll('[data-showroom-projected-kind="cardinal"]')];
    const roomLabels = [...document.querySelectorAll('[data-showroom-projected-kind="room"]')];
    const compassControl = document.querySelector("[data-showroom-compass-control]");
    const compassLabel = compassControl?.querySelector(".showroom-compass-control__label");
    const compassInstruction = compassControl?.querySelector(".showroom-compass-control__instruction");
    const compassRect = compassControl?.getBoundingClientRect();
    const compassLabelRect = compassLabel?.getBoundingClientRect();
    const compassInstructionRect = compassInstruction?.getBoundingClientRect();
    const compassBefore = compassControl ? getComputedStyle(compassControl, "::before") : null;
    const compassVisualWidth = Number.parseFloat(compassBefore?.width || "0");
    const compassContentWidth = Math.max(compassLabelRect?.width || 0, compassInstructionRect?.width || 0);''',
)

replace_once(
    bench_path,
    '''      visibleRoomLabels: roomLabels.filter(isVisible).map(describe),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,''',
    '''      visibleRoomLabels: roomLabels.filter(isVisible).map(describe),
      compassHitWidth: compassRect?.width || 0,
      compassVisualWidth,
      compassContentWidth,
      compassVisualToHitRatio: compassRect?.width ? compassVisualWidth / compassRect.width : 0,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,''',
)

pattern = r'''  const clusterAccepted = await page\.evaluate\(\(\) => globalThis\.SHOWROOM_MIRRORLAND_CONSTELLATION_CONTROLLER\.requestCardinalSelection\("east"\)\);.*?  observations\.push\(\{ profile: profile\.id, initial, cluster, preview, committed, returned, telemetry \}\);'''
replacement = '''  assert(
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

  const dragStarted = await page.evaluate(async () => {
    const field = document.querySelector("[data-showroom-orbit-field]");
    if (!field) return false;
    const rect = field.getBoundingClientRect();
    const pointerId = 41;
    const startX = rect.left + rect.width * 0.72;
    const startY = rect.top + rect.height * 0.78;
    const endX = startX - rect.width * 0.32;
    const endY = startY;
    const dispatch = (type, x, y, buttons, pressure) => field.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId,
      pointerType: "touch",
      isPrimary: true,
      clientX: x,
      clientY: y,
      button: type === "pointerdown" ? 0 : -1,
      buttons,
      pressure
    }));
    dispatch("pointerdown", startX, startY, 1, 0.5);
    for (let step = 1; step <= 12; step += 1) {
      const progress = step / 12;
      dispatch("pointermove", startX + (endX - startX) * progress, endY, 1, 0.5);
      await new Promise(resolve => setTimeout(resolve, 36));
    }
    globalThis.__SHOWROOM_LABEL_TEST_POINTER__ = { pointerId, endX, endY };
    return true;
  });
  assert(dragStarted, "TOUCH_DRAG_START_FAILED", dragStarted, profile.id);

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

  const pointerReleased = await page.evaluate(() => {
    const field = document.querySelector("[data-showroom-orbit-field]");
    const pointer = globalThis.__SHOWROOM_LABEL_TEST_POINTER__;
    if (!field || !pointer) return false;
    field.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      composed: true,
      pointerId: pointer.pointerId,
      pointerType: "touch",
      isPrimary: true,
      clientX: pointer.endX,
      clientY: pointer.endY,
      button: 0,
      buttons: 0,
      pressure: 0
    }));
    return true;
  });
  assert(pointerReleased, "TOUCH_DRAG_RELEASE_FAILED", pointerReleased, profile.id);
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

  observations.push({ profile: profile.id, initial, cluster, preview, committed, returned, telemetry });'''
regex_once(bench_path, pattern, replacement)

replace_once(
    bench_path,
    'checkpoint: "SHOWROOM_LABEL_HIERARCHY_PRIMARY_ONLY_20260729A",',
    f'checkpoint: "{MARKER}",',
)
replace_once(
    bench_path,
    '''    clusterLabelModel: "primary-only",
    previewAuthority: "cluster.previewPrimaryRoom",
    committedAuthority: "cluster.primaryRoom"''',
    '''    clusterLabelModel: "camera-front-primary-only",
    initialClusterFrontRoom: "south-3",
    touchGestureFrontRoom: "south-2",
    primarySelectionAuthority: "actual-touch-quaternion-camera-front-lock",
    visualCompassCapsule: "content-fit-with-larger-semantic-control"''',
)
replace_once(
    bench_path,
    '''    proves: ["EXACT_HEAD_BROWSER_EXECUTION", "FOUR_CARDINAL_LABEL_HIERARCHY", "SINGLE_CLUSTER_LABEL", "PREVIEW_AND_COMMIT_PRIMARY_TRACKING", "LABEL_CONTAINMENT"],''',
    '''    proves: ["EXACT_HEAD_BROWSER_EXECUTION", "FOUR_CARDINAL_LABEL_HIERARCHY", "SINGLE_CLUSTER_LABEL", "ACTUAL_TOUCH_GESTURE_FRONT_LOCK", "CAMERA_FRONT_INITIAL_LABEL", "COMPACT_VISIBLE_COMPASS_CAPSULE", "LABEL_CONTAINMENT"],''',
)

# Temporary applicator infrastructure must not remain in the candidate delta.
(ROOT / "verification/showroom-cluster-front-lock/apply-showroom-cluster-front-lock.py").unlink()

print(MARKER)
