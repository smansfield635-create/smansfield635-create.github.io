// /assets/world/environment/scene.js
// TNT FULL-FILE REPLACEMENT
// H_EARTH_STRUCTURE_VISIBILITY_AND_CAMERA_COMPOSITION_SCENE_RENEWAL_v1
// Owns: scene compositing, live hex substrate, layer order, structure visibility receipt, and final integration.

import {
  createEnvironmentProfile,
  resolveEnvironmentCell
} from "/assets/world/environment/profile.js";

import { createHexField } from "/assets/world/environment/hexfield.js";

import {
  drawClimateLayer,
  drawBirdsAndAir,
  drawAtmosphereComposite
} from "/assets/world/environment/climate.js";

import {
  drawWaterLayer,
  drawFoamAndTideEdge
} from "/assets/world/environment/water.js";

import {
  drawDistantTerrainLayer,
  drawShorelineTerrainLayer,
  drawGroundTerrainLayer
} from "/assets/world/environment/terrain.js";

import { drawFoliageLayer } from "/assets/world/environment/foliage.js";
import { drawStructureLayer } from "/assets/world/environment/structure.js";

export const ENVIRONMENT_SCENE_VERSION =
  "h-earth-structure-visibility-and-camera-composition-scene-renewal-v1";

export function createGroundEnvironmentScene(canvas, inputProfile, options = {}) {
  const profile = createEnvironmentProfile(inputProfile);
  const cell = resolveEnvironmentCell(profile, options.cell || profile.region.activeCell);
  const hexfield = createHexField(profile, cell, options);
  const ctx = canvas.getContext("2d", { alpha: false });

  const state = {
    running: false,
    raf: 0,
    startedAt: performance.now(),
    lastFrame: 0,
    targetFrameMs: options.targetFrameMs || 50,
    receipt: null,
    structureDrawn: false
  };

  function resizeCanvas() {
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.75);
    const width = Math.max(options.minWidth || 960, Math.floor((box.width || 980) * dpr));
    const height = Math.max(options.minHeight || 1180, Math.floor((box.height || 1200) * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return { width, height, dpr };
  }

  function draw(time = performance.now()) {
    if (!state.running) return;

    if (time - state.lastFrame < state.targetFrameMs) {
      state.raf = requestAnimationFrame(draw);
      return;
    }

    state.lastFrame = time;

    const size = resizeCanvas();
    const frame = {
      width: size.width,
      height: size.height,
      dpr: size.dpr,
      time: (time - state.startedAt) / 1000,
      now: time,
      hexfield,
      composition: {
        anchor: "manor-midground",
        waterBehindStructure: true,
        camera: "inland-shelf-to-western-waterline",
        expression: "live-hex-substrate"
      }
    };

    ctx.clearRect(0, 0, size.width, size.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    drawClimateLayer(ctx, profile, cell, frame);
    drawDistantTerrainLayer(ctx, profile, cell, frame);
    drawWaterLayer(ctx, profile, cell, frame);
    drawShorelineTerrainLayer(ctx, profile, cell, frame);
    drawFoamAndTideEdge(ctx, profile, cell, frame);
    drawGroundTerrainLayer(ctx, profile, cell, frame);

    state.structureDrawn = Boolean(drawStructureLayer(ctx, profile, cell, frame));

    drawProtectedStructureAtmosphere(ctx, profile, cell, frame, state.structureDrawn);
    drawFoliageLayer(ctx, profile, cell, frame);
    drawStructureForegroundClearance(ctx, profile, frame);
    drawBirdsAndAir(ctx, profile, cell, frame);
    drawAtmosphereComposite(ctx, profile, cell, frame);

    state.receipt = Object.freeze({
      sceneVersion: ENVIRONMENT_SCENE_VERSION,
      hexfieldVersion: hexfield.version,
      planet: profile.planet.key,
      region: profile.region.key,
      cell: cell.coordinate,
      reusableEngine: true,
      staticImageSource: false,
      parentMutation: false,
      rendered: true,
      compositionAnchor: "manor-midground",
      waterBehindStructure: true,
      structureDrawn: state.structureDrawn,
      manorVisible: state.structureDrawn,
      hexSubstrate: {
        live: true,
        scale: hexfield.scale,
        seed: hexfield.seed
      },
      water: {
        waves: true,
        foam: true,
        shimmer: true,
        tide: true,
        reflection: true
      },
      layers: [
        "climate",
        "distant-terrain",
        "water",
        "shoreline",
        "foam-tide",
        "ground-terrain",
        "structure",
        "protected-structure-atmosphere",
        "foliage",
        "structure-foreground-clearance",
        "wildlife",
        "atmosphere"
      ]
    });

    state.raf = requestAnimationFrame(draw);
  }

  return Object.freeze({
    start() {
      if (!ctx) throw new Error("Canvas 2D context unavailable.");
      if (!state.running) {
        state.running = true;
        state.raf = requestAnimationFrame(draw);
      }
      return this;
    },
    stop() {
      state.running = false;
      cancelAnimationFrame(state.raf);
    },
    status() {
      return Object.freeze({
        version: ENVIRONMENT_SCENE_VERSION,
        running: state.running,
        profile,
        cell,
        hexfield: hexfield.status(),
        receipt: state.receipt
      });
    }
  });
}

function drawProtectedStructureAtmosphere(ctx, profile, cell, frame, structureDrawn) {
  if (!structureDrawn) return;

  const { width: w, height: h } = frame;
  const cx = w * (profile.structure.x ?? 0.50);
  const baseY = h * 0.615;
  const manorW = w * 0.285;
  const manorH = h * 0.145;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const glow = ctx.createRadialGradient(
    cx,
    baseY - manorH * 0.34,
    0,
    cx,
    baseY - manorH * 0.22,
    manorW * 0.66
  );

  glow.addColorStop(0, "rgba(255,224,154,.080)");
  glow.addColorStop(0.42, "rgba(255,224,154,.026)");
  glow.addColorStop(1, "rgba(255,224,154,0)");

  ctx.fillStyle = glow;
  ctx.fillRect(cx - manorW * 0.70, baseY - manorH * 1.25, manorW * 1.40, manorH * 1.55);

  ctx.restore();
}

function drawStructureForegroundClearance(ctx, profile, frame) {
  const { width: w, height: h } = frame;
  const cx = w * (profile.structure.x ?? 0.50);
  const baseY = h * 0.615;
  const manorW = w * 0.285;

  ctx.save();

  const clearance = ctx.createRadialGradient(
    cx,
    baseY + h * 0.085,
    0,
    cx,
    baseY + h * 0.085,
    manorW * 0.96
  );

  clearance.addColorStop(0, "rgba(0,0,0,.10)");
  clearance.addColorStop(0.55, "rgba(0,0,0,.035)");
  clearance.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = clearance;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + h * 0.070, manorW * 0.86, h * 0.070, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
