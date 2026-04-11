import { createWorldKernel } from "/world/world_kernel.js";
import { getRuntimeReceipt } from "/world/runtime.js";
import { getPlanetEngineReceipt, getPlanetProjection } from "/world/planet_engine.js";
import { render } from "/world/render.js";
import { getControlReceipt } from "/world/control.js";
import { createScene } from "/runtime/scene.js";

const BUILD = "INDEX_G1_EXTERNAL_EXPRESSION";
const KERNEL = createWorldKernel();

function setText(id, text, className = null) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  if (className) el.className = className;
}

function row(k, v) {
  return '<div class="row"><div class="rk">' + escapeHtml(k) + '</div><div class="rv">' + escapeHtml(v) + '</div></div>';
}

function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function showBootFail(message) {
  const node = document.getElementById("bootFail");
  if (!node) return;
  node.textContent = message;
  node.classList.add("is-visible");
}

function hideBootFail() {
  const node = document.getElementById("bootFail");
  if (!node) return;
  node.textContent = "";
  node.classList.remove("is-visible");
}

function classifyMetaverseLine(hostRead, renderPacket, controlReceipt) {
  if (!hostRead || !renderPacket || !controlReceipt) {
    return {
      label: "Pending Classification",
      chip: "Metaverse Pending",
      className: "statValue warn"
    };
  }

  const motionVisible = (((renderPacket.visible || {}).motionOutput || {}).visible) === true;
  const houseFirst = (((controlReceipt.publicTraversal || {}).houseFirst) === true);
  const metaverseRequired = (((controlReceipt.publicTraversal || {}).metaverseRequired) === true);

  if (houseFirst && !metaverseRequired && motionVisible) {
    return {
      label: "Observation Active",
      chip: "Metaverse Emerging",
      className: "statValue good"
    };
  }

  return {
    label: "Pending Classification",
    chip: "Metaverse Pending",
    className: "statValue warn"
  };
}

function buildRoomList(rooms) {
  return rooms.map((room) => {
    return '<div class="roomRow"><span>' +
      escapeHtml(room.label) +
      '</span><span>' +
      (room.visibleFromHouse ? "Visible / Programmable" : "Restricted") +
      "</span></div>";
  }).join("");
}

async function boot() {
  const sceneMount = document.getElementById("sceneMount");
  const footer = document.getElementById("footer");

  if (!sceneMount || !footer) {
    throw new Error("INDEX_REQUIRED_NODES_MISSING");
  }

  const scene = createScene({ sessionId: "INDEX_SCENE_RUNTIME" });
  scene.mount(sceneMount).start();

  const timestamp = Date.now();
  const frameState = { elapsedSeconds: performance.now() / 1000 };

  const hostRead = KERNEL.getHostRead();
  const runtimeReceipt = getRuntimeReceipt({ frameState, timestamp });
  const planetReceipt = getPlanetEngineReceipt({ timestamp });
  const projection = getPlanetProjection({ scale: 1 });
  const renderPacket = render({ frameState, timestamp });
  const controlReceipt = getControlReceipt({ frameState, timestamp });

  const metaverseLine = classifyMetaverseLine(hostRead, renderPacket, controlReceipt);

  setText("k-kernel", "Online", "statValue good");
  setText("k-render", "Online", "statValue good");
  setText("k-control", "Online", "statValue good");
  setText("k-metaverse", metaverseLine.label, metaverseLine.className);

  const metaverseChip = document.getElementById("heroMetaverseChip");
  if (metaverseChip) {
    metaverseChip.textContent = metaverseLine.chip;
    metaverseChip.className = "chip" + (metaverseLine.label === "Observation Active" ? " strong" : "");
  }

  const roomList = document.getElementById("roomList");
  if (roomList) {
    roomList.innerHTML = buildRoomList(projection.rooms || []);
  }

  const layerRows = document.getElementById("layerRows");
  if (layerRows) {
    layerRows.innerHTML = (hostRead.layers || []).map((layer) => {
      return row(layer.label, layer.public ? "Public / Active" : "Hidden");
    }).join("");
  }

  const entryRows = document.getElementById("entryRows");
  if (entryRows) {
    entryRows.innerHTML =
      row("Entry", hostRead.publicEntry || "—") +
      row("Rooms Visible", "true") +
      row("Programmable", "true") +
      row("Host Priority", "house-first");
  }

  const runtimeRows = document.getElementById("runtimeRows");
  if (runtimeRows) {
    runtimeRows.innerHTML =
      row("Phase", runtimeReceipt.phase || "—") +
      row("Boundary", ((runtimeReceipt.boundary || {}).classification) || "—") +
      row("Region", ((runtimeReceipt.region || {}).label) || "—") +
      row("Node", ((runtimeReceipt.node || {}).label) || "—");
  }

  const descendantRows = document.getElementById("descendantRows");
  if (descendantRows) {
    const order = controlReceipt.descendantOrder || [];
    descendantRows.innerHTML =
      row("1", order[0] || "—") +
      row("2", order[1] || "—") +
      row("3", order[2] || "—") +
      row("4", order[3] || "—") +
      row("5", order[4] || "—");
  }

  footer.textContent =
    "BUILD=" + BUILD +
    " | ENTRY=" + (hostRead.publicEntry || "—") +
    " | ROOMS=" + (hostRead.roomCount ?? "—") +
    " | PLANET=" + ((planetReceipt.projection || {}).kind || "—") +
    " | PHASE=" + (runtimeReceipt.phase || "—") +
    " | BOUNDARY=" + (((runtimeReceipt.boundary || {}).classification) || "—") +
    " | METAVERSE=" + metaverseLine.label;

  hideBootFail();
}

boot().catch((error) => {
  console.error("[INDEX_BOOT_ERROR]", error);
  showBootFail(
    "INDEX BOOT FAILED\n" +
    (error instanceof Error ? (error.stack || error.message) : String(error))
  );
});
