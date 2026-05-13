// /assets/world/environment/scene.js
// TNT FULL-FILE REPLACEMENT
// REUSABLE_PLANETARY_GROUND_SCENE_HEXFIELD_TNT_v2
// Owns: scene compositing, layer order, camera, receipts, and final visible integration.

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

export const ENVIRONMENT_SCENE_VERSION = "reusable-planetary-ground-scene-hexfield-v2";

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
    receipt: null
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
      hexfield
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
    drawStructureLayer(ctx, profile, cell, frame);
    drawFoliageLayer(ctx, profile, cell, frame);
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
        "foliage",
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
