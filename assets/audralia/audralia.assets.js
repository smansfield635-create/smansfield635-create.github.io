// /assets/audralia/audralia.assets.js
// AUDRALIA_G2_4_ASSET_FORMATION_MATERIAL_DELTA_TNT_v1
// Full-file replacement.
// Clean alignment with existing G2.4 terrain.
// Real delta:
// - Consumes G2.4 terrain formation fields.
// - Expresses formationField, shelfBreak, coastalTerrace, continentalShoulder.
// - Separates ring crest, basin floor, cliff, beach, shelf, and deep ocean.
// - Reduces uniform halo by turning shelf into attenuated bands and coastal terraces.
// - Runtime remains motion-only.
// - Controls remain input-only.
// - Canvas remains draw/consume only.
// No GraphicBox. No generated image. No visual-pass claim.

import {
  classifyAudraliaTerrain,
  sampleAudraliaTerrain,
  getAudraliaTerrainFingerStatus
} from "./audralia.terrain.fingers.js?v=audralia-g2-4-asset-route-expectation-alignment-v1";

const CONTRACT = "AUDRALIA_G2_4_ASSET_FORMATION_MATERIAL_DELTA_TNT_v1";
const RECEIPT = "AUDRALIA_G2_4_ASSET_FORMATION_MATERIAL_DELTA_RECEIPT";
const PREVIOUS_CONTRACT = "AUDRALIA_G2_3_ASSET_RELIEF_FIELD_AND_SHELF_ATTENUATION_TNT_v1";
const VERSION = "2026-05-10.audralia-g2-4-asset-formation-material-alignment";

const MATERIAL = Object.freeze({
  abyss: [2, 13, 32],
  deepOcean: [3, 18, 44],
  ocean: [6, 54, 100],
  openOcean: [8, 70, 116],
  shelf: [20, 116, 142],
  shelfTerrace: [36, 136, 150],
  shelfSoft: [48, 150, 158],
  coastFoam: [92, 160, 160],
  wetBeach: [184, 166, 112],
  beach: [198, 176, 116],
  dryBeach: [170, 144, 92],
  lowland: [108, 134, 82],
  shoulderGreen: [100, 128, 78],
  basinGreen: [70, 108, 68],
  upland: [96, 114, 76],
  ridge: [86, 92, 86],
  cliff: [62, 68, 76],
  slate: [50, 64, 78],
  granite: [118, 110, 100],
  marble: [176, 170, 156],
  copper: [160, 90, 56],
  gold: [206, 162, 62],
  opal: [154, 190, 188],
  plasma: [72, 148, 184]
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

function readTerrain(u, v) {
  const sample = sampleAudraliaTerrain(u, v);
  const t = sample.terrain || {};
  const f = sample.fingers || {};

  return {
    sample,
    t,
    f,
    formationField: t.formationField || 0,
    shelfBreak: t.shelfBreak || 0,
    coastalTerrace: t.coastalTerrace || 0,
    continentalShoulder: t.continentalShoulder || 0,
    ringCrest: t.ringCrest || t.primaryRing || 0,
    basinFloor: t.basinFloor || t.primaryBasin || 0,
    secondarySpiralPressure: t.secondarySpiralPressure || t.spiralRanges || 0
  };
}

function sampleAudraliaAsset(u, v) {
  const read = readTerrain(u, v);
  const t = read.t;
  const f = read.f;

  const formationField = read.formationField;
  const shelfBreak = read.shelfBreak;
  const coastalTerrace = read.coastalTerrace;
  const continentalShoulder = read.continentalShoulder;
  const ringCrest = read.ringCrest;
  const basinFloor = read.basinFloor;
  const secondarySpiralPressure = read.secondarySpiralPressure;

  if (!t.isLand) {
    let color = mixColor(
      MATERIAL.abyss,
      MATERIAL.deepOcean,
      clamp(0.24 + (t.micro || 0) * 0.42, 0, 1)
    );

    color = mixColor(color, MATERIAL.ocean, smoothstep(0.18, 0.70, 1 - (t.deepOcean || 0)) * 0.40);
    color = mixColor(color, MATERIAL.openOcean, smoothstep(0.24, 0.88, t.shelfBanding || 0) * 0.14);

    const shelfStrength = clamp((t.shelfWater || 0) * (t.shelfAttenuation || 0), 0, 0.52);
    const breakStrength = clamp(shelfBreak * (t.shelfWater || 0), 0, 0.38);
    const terrace = clamp(coastalTerrace * (t.shelfWater || 0), 0, 0.32);
    const coastalSoftness = clamp((t.coastline || 0) * shelfStrength, 0, 0.30);

    color = mixColor(color, MATERIAL.shelf, shelfStrength * 0.62);
    color = mixColor(color, MATERIAL.shelfTerrace, terrace * 0.34);
    color = mixColor(color, MATERIAL.shelfSoft, coastalSoftness * 0.24);
    color = mixColor(color, MATERIAL.coastFoam, coastalSoftness * 0.08);

    const depthShade = -9 * (t.deepOcean || 0);
    const currentLift = ((t.micro || 0) - 0.5) * 4.5;
    const bayLift = (t.peninsulasBaysIslands || 0) * (t.shelfWater || 0) * 2.6;

    color = addColor(color, depthShade + currentLift + bayLift);

    return {
      color,
      channels: {
        deepOcean: t.deepOcean || 0,
        shelfWater: t.shelfWater || 0,
        shelfAttenuation: t.shelfAttenuation || 0,
        shelfBreak,
        coastalTerrace,
        coastline: t.coastline || 0,
        landBody: 0,
        mountainsRanges: 0,
        valleysBasins: 0,
        cliffsEscarpments: 0,
        beachesCoastalShelves: 0,
        peninsulasBaysIslandsInlets: (t.peninsulasBaysIslands || 0) * 0.42,
        mineralSeams: 0,
        reliefField: 0,
        formationField,
        plasma: 0.18
      }
    };
  }

  let color = mixColor(
    MATERIAL.lowland,
    MATERIAL.upland,
    smoothstep(0.20, 0.68, t.elevation || 0)
  );

  color = mixColor(color, MATERIAL.shoulderGreen, continentalShoulder * 0.30);
  color = mixColor(color, MATERIAL.basinGreen, (f.valleysBasins || 0) * 0.72);
  color = mixColor(color, MATERIAL.wetBeach, (f.beachesCoastalShelves || 0) * 0.34);
  color = mixColor(color, MATERIAL.beach, (f.beachesCoastalShelves || 0) * 0.28);
  color = mixColor(color, MATERIAL.dryBeach, (f.beachesCoastalShelves || 0) * (t.ridgeNoise || 0) * 0.10);

  color = mixColor(color, MATERIAL.ridge, (f.mountainsRanges || 0) * 0.52);
  color = mixColor(color, MATERIAL.slate, (f.mountainsRanges || 0) * (t.ridgeNoise || 0) * 0.46);
  color = mixColor(color, MATERIAL.granite, (f.mountainsRanges || 0) * smoothstep(0.50, 0.92, t.ridgeNoise || 0) * 0.40);
  color = mixColor(color, MATERIAL.marble, ringCrest * smoothstep(0.70, 0.98, t.ridgeNoise || 0) * 0.32);
  color = mixColor(color, MATERIAL.cliff, (f.cliffsEscarpments || 0) * 0.62);

  const copper = (t.mineralSeam || 0) * smoothstep(0.32, 0.70, t.ridgeNoise || 0);
  const gold = (t.mineralSeam || 0) * smoothstep(0.72, 0.98, t.ridgeNoise || 0);
  const opal = (t.mineralSeam || 0) * smoothstep(0.62, 0.95, t.broad || 0);

  color = mixColor(color, MATERIAL.copper, copper * 0.14);
  color = mixColor(color, MATERIAL.gold, gold * 0.20);
  color = mixColor(color, MATERIAL.opal, opal * 0.10);

  const ringHighlight = ringCrest * 12;
  const basinDepth = -basinFloor * 10;
  const basinFloorLift = basinFloor * 2;
  const cliffShadow = -(f.cliffsEscarpments || 0) * 7;
  const terraceLift = coastalTerrace * 3;
  const coastLift = (t.coastline || 0) * 1.5;
  const articulationLift = (f.peninsulasBaysIslandsInlets || 0) * 4;
  const spiralLift = secondarySpiralPressure * 9;
  const reliefLift = (t.reliefField || 0) * 8;
  const formationLift = formationField * 4;
  const naturalNoise = ((t.micro || 0) - 0.5) * 6;

  color = addColor(
    color,
    ringHighlight +
      basinDepth +
      basinFloorLift +
      cliffShadow +
      terraceLift +
      coastLift +
      articulationLift +
      spiralLift +
      reliefLift +
      formationLift +
      naturalNoise
  );

  return {
    color,
    channels: {
      deepOcean: 0,
      shelfWater: 0,
      shelfAttenuation: 0,
      shelfBreak: 0,
      coastalTerrace,
      coastline: t.coastline || 0,
      landBody: 1,
      mountainsRanges: f.mountainsRanges || 0,
      valleysBasins: f.valleysBasins || 0,
      cliffsEscarpments: f.cliffsEscarpments || 0,
      beachesCoastalShelves: f.beachesCoastalShelves || 0,
      peninsulasBaysIslandsInlets: f.peninsulasBaysIslandsInlets || 0,
      mineralSeams: t.mineralSeam || 0,
      reliefField: t.reliefField || 0,
      formationField,
      plasma: 0.20
    }
  };
}

function createAudraliaAssetTexture(options = {}) {
  const mobile =
    typeof window !== "undefined" &&
    (window.innerWidth <= 760 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches));

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
  canvas.dataset.audraliaGeneration = "G2.4";
  canvas.dataset.audraliaTerrainFingers = "true";
  canvas.dataset.audraliaFormationField = "true";
  canvas.dataset.audraliaShelfBreak = "true";
  canvas.dataset.audraliaCoastalTerrace = "true";
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
    generation: "G2.4",
    authority: "asset-formation-material-delta",
    terrainFingers: getAudraliaTerrainFingerStatus(),
    absorbsAuthority: false,
    runtimeTouched: false,
    controlsTouched: false,
    canvasTouched: false,
    routeTouched: false,
    htmlTouched: false,
    verbs: ["bind", "separate", "define", "carry", "express"],
    renewedDeltas: [
      "clean-g2-4-terrain-import",
      "formation-field-consumption",
      "shelf-break-expression",
      "coastal-terrace-expression",
      "continental-shoulder-material",
      "ring-crest-material-separation",
      "basin-floor-darkening",
      "attenuated-shelf-bands",
      "material-formation-alignment"
    ],
    channels: [
      "deepOcean",
      "shelfWater",
      "shelfAttenuation",
      "shelfBreak",
      "coastalTerrace",
      "coastline",
      "landBody",
      "mountainsRanges",
      "valleysBasins",
      "cliffsEscarpments",
      "beachesCoastalShelves",
      "peninsulasBaysIslandsInlets",
      "mineralSeams",
      "reliefField",
      "formationField",
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
  document.documentElement.dataset.audraliaGeneration = "G2.4";
  document.documentElement.dataset.audraliaTerrainFingers = "true";
  document.documentElement.dataset.audraliaFormationField = "true";
  document.documentElement.dataset.audraliaShelfBreak = "true";
  document.documentElement.dataset.audraliaCoastalTerrace = "true";
  document.documentElement.dataset.audraliaMaterialDefinition = "true";
  document.documentElement.dataset.audraliaNaturalReadability = "true";
  document.documentElement.dataset.audraliaAssetsBoundaryExpression = "true";
  document.documentElement.dataset.audraliaAssetsAbsorbAuthority = "false";
  document.documentElement.dataset.audraliaRuntimeTouched = "false";
  document.documentElement.dataset.audraliaControlsTouched = "false";
  document.documentElement.dataset.audraliaCanvasTouched = "false";
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
