// /assets/audralia/audralia.assets.js
// AUDRALIA_G2_ASSET_MATERIAL_DEFINITION_AND_NATURAL_READABILITY_TNT_v1
// Full-file replacement.
// Assets bind, separate, define, carry, and express.
// Assets do not absorb authority.
// Assets consume five-finger terrain expression and preserve visible boundaries.
// Runtime remains motion-only.
// Controls remain input-only.
// No GraphicBox. No generated image. No visual-pass claim.

import {
  classifyAudraliaTerrain,
  sampleAudraliaTerrain,
  getAudraliaTerrainFingerStatus
} from "./audralia.terrain.fingers.js";

const CONTRACT = "AUDRALIA_G2_ASSET_MATERIAL_DEFINITION_AND_NATURAL_READABILITY_TNT_v1";
const RECEIPT = "AUDRALIA_G2_ASSET_MATERIAL_DEFINITION_AND_NATURAL_READABILITY_RECEIPT";
const PREVIOUS_CONTRACT = "AUDRALIA_V18_ASSET_BOUNDARY_FIVE_FINGER_EXPRESSION_AUTHORITY_TNT_v2";
const VERSION = "2026-05-09.audralia-g2-asset-material-definition-natural-readability";

const MATERIAL = Object.freeze({
  deepOcean: [3, 20, 48],
  ocean: [7, 66, 120],
  shelf: [24, 153, 184],
  shelfGlow: [54, 184, 196],
  coastFoam: [124, 209, 204],
  beach: [200, 178, 116],
  dryBeach: [181, 154, 96],
  lowland: [119, 136, 84],
  basinGreen: [87, 125, 76],
  upland: [105, 121, 77],
  ridge: [91, 96, 88],
  cliff: [72, 78, 84],
  slate: [58, 72, 86],
  granite: [126, 119, 105],
  marble: [184, 178, 160],
  copper: [170, 99, 60],
  gold: [220, 176, 68],
  opal: [171, 216, 205],
  plasma: [88, 176, 208]
});

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(0.000001, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function mixColor(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
  ];
}

function addColor(color, amount) {
  return [
    clamp(Math.round(color[0] + amount), 0, 255),
    clamp(Math.round(color[1] + amount), 0, 255),
    clamp(Math.round(color[2] + amount), 0, 255)
  ];
}

function sampleAudraliaAsset(u, v) {
  const terrainSample = sampleAudraliaTerrain(u, v);
  const t = terrainSample.terrain;
  const f = terrainSample.fingers;

  if (!t.isLand) {
    let color = mixColor(MATERIAL.deepOcean, MATERIAL.ocean, clamp(0.28 + t.micro * 0.56, 0, 1));

    color = mixColor(color, MATERIAL.shelf, t.shelfWater * 0.94);
    color = mixColor(color, MATERIAL.shelfGlow, t.shelfWater * t.coastline * 0.40);
    color = mixColor(color, MATERIAL.coastFoam, t.coastline * t.shelfWater * 0.36);

    const depthShade = -6 * t.deepOcean;
    const currentLift = (t.micro - 0.5) * 8;
    const bayLift = t.peninsulasBaysIslands * t.shelfWater * 6;

    color = addColor(color, depthShade + currentLift + bayLift);

    return {
      color,
      channels: {
        deepOcean: t.deepOcean,
        shelfWater: t.shelfWater,
        coastline: t.coastline,
        landBody: 0,
        mountainsRanges: 0,
        valleysBasins: 0,
        cliffsEscarpments: 0,
        beachesCoastalShelves: 0,
        peninsulasBaysIslandsInlets: t.peninsulasBaysIslands * 0.42,
        mineralSeams: 0,
        plasma: 0.18
      }
    };
  }

  let color = mixColor(MATERIAL.lowland, MATERIAL.upland, smoothstep(0.22, 0.68, t.elevation));

  color = mixColor(color, MATERIAL.basinGreen, f.valleysBasins * 0.52);
  color = mixColor(color, MATERIAL.beach, f.beachesCoastalShelves * 0.72);
  color = mixColor(color, MATERIAL.dryBeach, f.beachesCoastalShelves * t.ridgeNoise * 0.20);

  color = mixColor(color, MATERIAL.ridge, f.mountainsRanges * 0.40);
  color = mixColor(color, MATERIAL.slate, f.mountainsRanges * t.ridgeNoise * 0.36);
  color = mixColor(color, MATERIAL.granite, f.mountainsRanges * smoothstep(0.52, 0.92, t.ridgeNoise) * 0.31);
  color = mixColor(color, MATERIAL.marble, t.primaryRing * smoothstep(0.72, 0.98, t.ridgeNoise) * 0.24);
  color = mixColor(color, MATERIAL.cliff, f.cliffsEscarpments * 0.52);

  const copper = t.mineralSeam * smoothstep(0.32, 0.70, t.ridgeNoise);
  const gold = t.mineralSeam * smoothstep(0.72, 0.98, t.ridgeNoise);
  const opal = t.mineralSeam * smoothstep(0.62, 0.95, t.broad);

  color = mixColor(color, MATERIAL.copper, copper * 0.18);
  color = mixColor(color, MATERIAL.gold, gold * 0.25);
  color = mixColor(color, MATERIAL.opal, opal * 0.16);

  const ringHighlight = t.primaryRing * 8;
  const basinLift = t.primaryBasin * 6;
  const coastLift = t.coastline * 5;
  const articulationLift = f.peninsulasBaysIslandsInlets * 5;
  const naturalNoise = (t.micro - 0.5) * 9;

  color = addColor(color, ringHighlight + basinLift + coastLift + articulationLift + naturalNoise);

  return {
    color,
    channels: {
      deepOcean: 0,
      shelfWater: 0,
      coastline: t.coastline,
      landBody: 1,
      mountainsRanges: f.mountainsRanges,
      valleysBasins: f.valleysBasins,
      cliffsEscarpments: f.cliffsEscarpments,
      beachesCoastalShelves: f.beachesCoastalShelves,
      peninsulasBaysIslandsInlets: f.peninsulasBaysIslandsInlets,
      mineralSeams: t.mineralSeam,
      plasma: 0.20
    }
  };
}

function createAudraliaAssetTexture(options = {}) {
  const mobile = window.innerWidth <= 760 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  const width = options.width || (mobile ? 1024 : 2048);
  const height = options.height || Math.round(width / 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });
  const image = ctx.createImageData(width, height);
  const data = image.data;

  for (let y = 0; y < height; y += 1) {
    const v = y / Math.max(1, height - 1);

    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const result = sampleAudraliaAsset(u, v);
      const i = (y * width + x) * 4;

      data[i] = result.color[0];
      data[i + 1] = result.color[1];
      data[i + 2] = result.color[2];
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  canvas.dataset.audraliaAssetsContract = CONTRACT;
  canvas.dataset.audraliaAssetsReceipt = RECEIPT;
  canvas.dataset.audraliaGeneration = "G2";
  canvas.dataset.audraliaTerrainFingers = "true";
  canvas.dataset.audraliaMaterialDefinition = "true";
  canvas.dataset.audraliaNaturalReadability = "true";
  canvas.dataset.audraliaAssetsBoundaryExpression = "true";
  canvas.dataset.audraliaAssetsAbsorbAuthority = "false";
  canvas.dataset.generatedImage = "false";
  canvas.dataset.graphicBox = "false";
  canvas.dataset.visualPassClaimed = "false";

  return canvas;
}

function getAudraliaAssetsStatus() {
  return Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    version: VERSION,
    generation: "G2",
    authority: "asset-material-definition-natural-readability",
    terrainFingers: getAudraliaTerrainFingerStatus(),
    absorbsAuthority: false,
    runtimeTouched: false,
    controlsTouched: false,
    verbs: ["bind", "separate", "define", "carry", "express"],
    channels: [
      "deepOcean",
      "shelfWater",
      "coastline",
      "landBody",
      "mountainsRanges",
      "valleysBasins",
      "cliffsEscarpments",
      "beachesCoastalShelves",
      "peninsulasBaysIslandsInlets",
      "mineralSeams",
      "plasma"
    ],
    generatedImage: false,
    graphicBox: false,
    visualPassClaimed: false
  });
}

const AUDRALIA_ASSETS_STATUS = getAudraliaAssetsStatus();
const AUDRALIA_ASSETS_RECEIPT_VALUE = RECEIPT;

if (typeof window !== "undefined") {
  window.AUDRALIA_ASSETS = Object.freeze({
    contract: CONTRACT,
    receipt: RECEIPT,
    previousContract: PREVIOUS_CONTRACT,
    material: MATERIAL,
    classify: classifyAudraliaTerrain,
    sample: sampleAudraliaAsset,
    createTextureCanvas: createAudraliaAssetTexture,
    createAudraliaAssetTexture,
    getStatus: getAudraliaAssetsStatus
  });

  window.__AUDRALIA_ASSETS_STATUS__ = AUDRALIA_ASSETS_STATUS;

  document.documentElement.dataset.audraliaAssetsLoaded = "true";
  document.documentElement.dataset.audraliaAssetsContract = CONTRACT;
  document.documentElement.dataset.audraliaAssetsReceipt = RECEIPT;
  document.documentElement.dataset.audraliaGeneration = "G2";
  document.documentElement.dataset.audraliaTerrainFingers = "true";
  document.documentElement.dataset.audraliaMaterialDefinition = "true";
  document.documentElement.dataset.audraliaNaturalReadability = "true";
  document.documentElement.dataset.audraliaAssetsBoundaryExpression = "true";
  document.documentElement.dataset.audraliaAssetsAbsorbAuthority = "false";
  document.documentElement.dataset.audraliaRuntimeTouched = "false";
  document.documentElement.dataset.audraliaControlsTouched = "false";
}

export {
  CONTRACT,
  RECEIPT,
  VERSION,
  MATERIAL,
  AUDRALIA_ASSETS_STATUS,
  AUDRALIA_ASSETS_RECEIPT_VALUE,
  classifyAudraliaTerrain,
  sampleAudraliaAsset,
  createAudraliaAssetTexture,
  getAudraliaAssetsStatus
};

export default Object.freeze({
  contract: CONTRACT,
  receipt: RECEIPT,
  previousContract: PREVIOUS_CONTRACT,
  material: MATERIAL,
  classify: classifyAudraliaTerrain,
  sample: sampleAudraliaAsset,
  createTextureCanvas: createAudraliaAssetTexture,
  createAudraliaAssetTexture,
  getStatus: getAudraliaAssetsStatus
});
