// /showroom/globe/h-earth/index.js
// H_EARTH_LAYERED_CINEMATIC_GROUND_PREBUILD_v1
// Not final TNT yet. This is the renderer structure for the next full-file replacement.

const CONTRACT = "H_EARTH_LAYERED_CINEMATIC_GROUND_PREBUILD_v1";

const RenderLayers = Object.freeze({
  SKY: "sky",
  CLOUDS: "clouds",
  FAR_ISLANDS: "far-islands",
  OCEAN: "ocean",
  SHORELINE: "shoreline",
  TERRAIN: "terrain",
  MANOR: "manor",
  VEGETATION: "vegetation",
  WILDLIFE: "wildlife",
  ATMOSPHERE: "atmosphere"
});

const state = {
  canvas: null,
  ctx: null,
  buffers: new Map(),
  startedAt: performance.now(),
  raf: 0,
  parentRouteLocked: true,
  route: "/showroom/globe/h-earth/",
  parentRoute: "/showroom/globe/"
};

function createLayerBuffer(name, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: true });
  state.buffers.set(name, { canvas, ctx });

  return { canvas, ctx };
}

function ensureBuffers(width, height) {
  for (const layer of Object.values(RenderLayers)) {
    const existing = state.buffers.get(layer);

    if (!existing || existing.canvas.width !== width || existing.canvas.height !== height) {
      createLayerBuffer(layer, width, height);
    }
  }
}

function drawSkyLayer(ctx, width, height, time) {
  // Gradient sky, warm sun scatter, horizon haze.
}

function drawCloudLayer(ctx, width, height, time) {
  // Soft drifting cloud banks. No cartoon bubbles.
}

function drawFarIslandsLayer(ctx, width, height, time) {
  // Irregular rocky silhouettes with atmospheric depth.
}

function drawOceanLayer(ctx, width, height, time) {
  // Deep water gradient, shimmer lanes, wave bands, light reflection.
}

function drawShorelineLayer(ctx, width, height, time) {
  // Beach edge, foam, wet sand, depth transition into shelf.
}

function drawTerrainLayer(ctx, width, height, time) {
  // Rocky grassland, descending path, uneven ground, non-flat texture.
}

function drawManorLayer(ctx, width, height, time) {
  // Smaller midground Manor, dimensional massing, roof planes, windows, cast shadow.
}

function drawVegetationLayer(ctx, width, height, time) {
  // Wind-reactive grasses, scrub clusters, foreground depth.
}

function drawWildlifeLayer(ctx, width, height, time) {
  // Birds, small distant movement, subtle living-world cues.
}

function drawAtmosphereLayer(ctx, width, height, time) {
  // Golden haze, vignette, depth fog, light bloom.
}

function compositeLayers(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);

  for (const layer of Object.values(RenderLayers)) {
    const buffer = state.buffers.get(layer);
    if (buffer?.canvas) ctx.drawImage(buffer.canvas, 0, 0);
  }
}

function renderFrame(now = performance.now()) {
  const time = (now - state.startedAt) / 1000;
  const width = state.canvas.width;
  const height = state.canvas.height;

  ensureBuffers(width, height);

  drawSkyLayer(state.buffers.get(RenderLayers.SKY).ctx, width, height, time);
  drawCloudLayer(state.buffers.get(RenderLayers.CLOUDS).ctx, width, height, time);
  drawFarIslandsLayer(state.buffers.get(RenderLayers.FAR_ISLANDS).ctx, width, height, time);
  drawOceanLayer(state.buffers.get(RenderLayers.OCEAN).ctx, width, height, time);
  drawShorelineLayer(state.buffers.get(RenderLayers.SHORELINE).ctx, width, height, time);
  drawTerrainLayer(state.buffers.get(RenderLayers.TERRAIN).ctx, width, height, time);
  drawManorLayer(state.buffers.get(RenderLayers.MANOR).ctx, width, height, time);
  drawVegetationLayer(state.buffers.get(RenderLayers.VEGETATION).ctx, width, height, time);
  drawWildlifeLayer(state.buffers.get(RenderLayers.WILDLIFE).ctx, width, height, time);
  drawAtmosphereLayer(state.buffers.get(RenderLayers.ATMOSPHERE).ctx, width, height, time);

  compositeLayers(state.ctx, width, height);

  window.DGBHEarthGroundReceipt = Object.freeze({
    contract: CONTRACT,
    route: "/showroom/globe/h-earth/",
    parentRoute: "/showroom/globe/",
    parentMutation: false,
    layeredCinematic: true,
    staticImageSource: false,
    waterBehindManor: true,
    rendered: true
  });

  state.raf = requestAnimationFrame(renderFrame);
}
