// /assets/audralia/audralia.assets.js
// AUDRALIA_G2_3_ASSET_RELIEF_FIELD_AND_SHELF_ATTENUATION_TNT_v1
// Full-file replacement.
// Real delta from prior baseline:
// - Consumes G2.3 terrain through cache-keyed terrain import.
// - Uses reliefField, ringCrest, basinFloor, shelfAttenuation, and shelfBanding.
// - Reduces uniform cyan halo through attenuated shelf material.
// - Separates mountain ring, basin, cliffs, shelf, beach, and mineral fields.
// Runtime remains motion-only.
// Controls remain input-only.
// Canvas remains draw/consume only.
// No GraphicBox. No generated image. No visual-pass claim.

import {
  classifyAudraliaTerrain,
  sampleAudraliaTerrain,
  getAudraliaTerrainFingerStatus
} from "./audralia.terrain.fingers.js?v=audralia-g2-3-source-alignment-relief-delta-renewal";

const CONTRACT = "AUDRALIA_G2_3_ASSET_RELIEF_FIELD_AND_SHELF_ATTENUATION_TNT_v1";
const RECEIPT = "AUDRALIA_G2_3_ASSET_RELIEF_FIELD_AND_SHELF_ATTENUATION_RECEIPT";
const PREVIOUS_CONTRACT = "AUDRALIA_G2_ASSET_MATERIAL_DEFINITION_AND_NATURAL_READABILITY_TNT_v1";
const VERSION = "2026-05-09.audralia-g2-3-asset-relief-field-shelf-attenuation";

const MATERIAL = Object.freeze({
  abyss: [2, 14, 34],
  deepOcean: [3, 19, 47],
  ocean: [6, 55, 103],
  openOcean: [7, 72, 120],
  shelf: [22, 122, 150],
  shelfSoft: [38, 142, 158],
  coastFoam: [96, 166, 166],
  wetBeach: [188, 171, 118],
  beach: [198, 176, 116],
  dryBeach: [172, 146, 92],
  lowland: [111, 136, 82],
  basinGreen: [72, 112, 70],
  upland: [98, 116, 76],
  ridge: [88, 94, 88],
  cliff: [64, 70, 78],
  slate: [52, 66, 80],
  granite: [120, 112, 101],
  marble: [178, 172, 158],
  copper: [162, 92, 58],
  gold: [208, 164, 62],
  opal: [156, 194, 190],
  plasma: [76, 154, 190]
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
    let color = mixColor(
      MATERIAL.abyss,
      MATERIAL.deepOcean,
      clamp(0.24 + t.micro * 0.42, 0, 1)
    );

    color = mixColor(color, MATERIAL.ocean, smoothstep(0.18, 0.70, 1 - t.deepOcean) * 0.42);
    color = mixColor(color, MATERIAL.openOcean, smoothstep(0.24, 0.88, t.shelfBanding) * 0.16);

    const shelfStrength = clamp(t.shelfWater * t.shelfAttenuation, 0, 0.56);
    const coastalSoftness = clamp(t.coastline * shelfStrength, 0, 0.36);

    color = mixColor(color, MATERIAL.shelf, shelfStrength * 0.72);
    color = mixColor(color, MATERIAL.shelfSoft, coastalSoftness * 0.30);
    color = mixColor(color, MATERIAL.coastFoam, coastalSoftness * 0.10);

    const depthShade = -9 * t.deepOcean;
    const currentLift = (t.micro - 0.5) * 5;
    const bayLift = t.peninsulasBaysIslands * t.shelfWater * 2.8;

    color = addColor(color, depthShade + currentLift + bayLift);

    return {
      color,
      channels: {
        deepOcean: t.deepOcean,
        shelfWater: t.shelfWater,
        shelfAttenuation: t.shelfAttenuation,
        coastline: t.coastline,
        landBody: 0,
        mountainsRanges: 0,
        valleysBasins: 0,
        cliffsEscarpments: 0,
        beachesCoastalShelves: 0,
        peninsulasBaysIslandsInlets: t.peninsulasBaysIslands * 0.42,
        mineralSeams: 0,
        reliefField: 0,
        plasma: 0.18
      }
    };
  }

  let color = mixColor(
    MATERIAL.lowland,
    MATERIAL.upland,
    smoothstep(0.20, 0.68, t.elevation)
  );

  color = mixColor(color, MATERIAL.basinGreen, f.valleysBasins * 0.68);
  color = mixColor(color, MATERIAL.wetBeach, f.beachesCoastalShelves * 0.36);
  color = mixColor(color, MATERIAL.beach, f.beachesCoastalShelves * 0.30);
  color = mixColor(color, MATERIAL.dryBeach, f.beachesCoastalShelves * t.ridgeNoise * 0.12);

  color = mixColor(color, MATERIAL.ridge, f.mountainsRanges * 0.50);
  color = mixColor(color, MATERIAL.slate, f.mountainsRanges * t.ridgeNoise * 0.44);
  color = mixColor(color, MATERIAL.granite, f.mountainsRanges * smoothstep(0.50, 0.92, t.ridgeNoise) * 0.38);
  color = mixColor(color, MATERIAL.marble, t.ringCrest * smoothstep(0.70, 0.98, t.ridgeNoise) * 0.30);
  color = mixColor(color, MATERIAL.cliff, f.cliffsEscarpments * 0.60);

  const copper = t.mineralSeam * smoothstep(0.32, 0.70, t.ridgeNoise);
  const gold = t.mineralSeam * smoothstep(0.72, 0.98, t.ridgeNoise);
  const opal = t.mineralSeam * smoothstep(0.62, 0.95, t.broad);

  color = mixColor(color, MATERIAL.copper, copper * 0.14);
  color = mixColor(color, MATERIAL.gold, gold * 0.20);
  color = mixColor(color, MATERIAL.opal, opal * 0.11);

  const ringHighlight = t.ringCrest * 12;
  const basinDepth = -t.basinFloor * 9;
  const basinFloorLift = t.basinFloor * 2;
  const cliffShadow = -f.cliffsEscarpments * 6;
  const coastLift = t.coastline * 1.8;
  const articulationLift = f.peninsulasBaysIslandsInlets * 4;
  const spiralLift = t.spiralRanges * 8;
  const reliefLift = t.reliefField * 7;
  const naturalNoise = (t.micro - 0.5) * 6.5;

  color = addColor(
    color,
    ringHighlight +
      basinDepth +
      basinFloorLift +
      cliffShadow +
      coastLift +
      articulationLift +
      spiralLift +
      reliefLift +
      naturalNoise
  );

  return {
    color,
    channels: {
      deepOcean: 0,
      shelfWater: 0,
      shelfAttenuation: 0,
      coastline: t.coastline,
      landBody: 1,
      mountainsRanges: f.mountainsRanges,
      valleysBasins: f.valleysBasins,
      cliffsEscarpments: f.cliffsEscarpments,
      beachesCoastalShelves: f.beachesCoastalShelves,
      peninsulasBaysIslandsInlets: f.peninsulasBaysIslandsInlets,
      mineralSeams: t.mineralSeam,
      reliefField: t.reliefField,
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
  canvas.dataset.audraliaGeneration = "G2.3";
  canvas.dataset.audraliaTerrainFingers = "true";
  canvas.dataset.audraliaReliefField = "true";
  canvas.dataset.audraliaShelfAttenuation = "true";
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
    generation: "G2.3",
    authority: "asset-relief-field-shelf-attenuation",
    terrainFingers: getAudraliaTerrainFingerStatus(),
    absorbsAuthority: false,
    runtimeTouched: false,
    controlsTouched: false,
    canvasTouched: false,
    routeTouched: false,
    htmlTouched: false,
    verbs: ["bind", "separate", "define", "carry", "express"],
    renewedDeltas: [
      "cache-keyed-terrain-import",
      "relief-field-consumption",
      "ring-crest-material-separation",
      "basin-floor-darkening",
      "shelf-attenuation",
      "shelf-banding",
      "reduced-uniform-cyan-halo"
    ],
    channels: [
      "deepOcean",
      "shelfWater",
      "shelfAttenuation",
      "coastline",
      "landBody",
      "mountainsRanges",
      "valleysBasins",
      "cliffsEscarpments",
      "beachesCoastalShelves",
      "peninsulasBaysIslandsInlets",
      "mineralSeams",
      "reliefField",
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
  document.documentElement.dataset.audraliaGeneration = "G2.3";
  document.documentElement.dataset.audraliaTerrainFingers = "true";
  document.documentElement.dataset.audraliaReliefField = "true";
  document.documentElement.dataset.audraliaShelfAttenuation = "true";
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
