// MODE: TERRAIN FACTOR AUTHORITY v7 (RENEWAL)
// STATUS: COMPOSITION-AWARE SUBSTRATE EXPRESSION
// ROLE:
// - preserve existing authority
// - expand to 256-scope land expression
// - express composition + substrate + surface continuity
// - no ownership drift

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function isFiniteNumber(v){return typeof v==="number"&&Number.isFinite(v);}
function toNumber(v,f=0){return isFiniteNumber(v)?v:f;}
function normalizeString(v,f="NONE"){return typeof v==="string"&&v.length>0?v:f;}
function normalizeColor(v,f){return typeof v==="string"&&v.length>0?v:f;}

/* =========================
   COMPOSITION FIELD (EXPANDED)
========================= */

function readComposition(sample){
  return {
    compositionWeight: clamp(toNumber(sample?.compositionWeight),0,1),
    preciousWeight: clamp(toNumber(sample?.preciousWeight),0,1),
    baseWeight: clamp(toNumber(sample?.baseWeight),0,1),

    diamondDensity: clamp(toNumber(sample?.diamondDensity),0,1),
    opalDensity: clamp(toNumber(sample?.opalDensity),0,1),
    graniteDensity: clamp(toNumber(sample?.graniteDensity),0,1),
    marbleDensity: clamp(toNumber(sample?.marbleDensity),0,1),
    metalDensity: clamp(toNumber(sample?.metalDensity),0,1),

    sedimentLoad: clamp(toNumber(sample?.sedimentLoad),0,1),
    transportPotential: clamp(toNumber(sample?.transportPotential),0,1),
    depositionPotential: clamp(toNumber(sample?.depositionPotential),0,1),

    regionalPurity: clamp(toNumber(sample?.regionalPurityWeight),0,1),
    reflectance: clamp(toNumber(sample?.mineralReflectanceWeight),0,1),
    tint: clamp(toNumber(sample?.sedimentTintWeight),0,1)
  };
}

/* =========================
   SURFACE CLASS (RENEWED)
========================= */

function classifySurface(sample, c){
  const slope = clamp(toNumber(sample?.slope),0,1);
  const ridge = clamp(toNumber(sample?.ridgeStrength),0,1);
  const basin = clamp(toNumber(sample?.basinStrength),0,1);
  const rainfall = clamp(toNumber(sample?.rainfall),0,1);

  const exposure = slope*0.4 + ridge*0.3;
  const retention = basin*0.4 + rainfall*0.3;

  if(c.preciousWeight > 0.7 && exposure > 0.35) return "CRYSTAL";
  if(c.baseWeight > 0.7 && retention < 0.3) return "DENSE";
  if(retention > 0.55) return "FERTILE";
  if(exposure > 0.6) return "EXPOSED";

  return "MIXED";
}

/* =========================
   WEIGHTS (EXPANDED)
========================= */

function computeWeights(sample, c){
  const continuity = clamp(
    toNumber(sample?.basinAccumulation)*0.4 +
    toNumber(sample?.rainfall)*0.3 +
    c.depositionPotential*0.3,
    0,1
  );

  const exposure = clamp(
    toNumber(sample?.slope)*0.4 +
    toNumber(sample?.ridgeStrength)*0.3 +
    c.transportPotential*0.3,
    0,1
  );

  const variation = clamp(
    toNumber(sample?.curvature)*0.4 +
    toNumber(sample?.canyonStrength)*0.3 +
    c.tint*0.3,
    0,1
  );

  const compositionSignal = clamp(
    c.compositionWeight*0.3 +
    c.preciousWeight*0.3 +
    c.regionalPurity*0.2 +
    c.reflectance*0.2,
    0,1
  );

  return {continuity, exposure, variation, compositionSignal};
}

/* =========================
   COLOR (RENEWED — COMPOSITION DRIVEN)
========================= */

function tint(base, c){
  const match=/rgba\((\d+),(\d+),(\d+),([^)]+)\)/.exec(base);
  if(!match) return base;

  const r = clamp(+match[1] + c.preciousWeight*40 - c.baseWeight*25,0,255);
  const g = clamp(+match[2] + c.compositionWeight*30 - c.preciousWeight*10,0,255);
  const b = clamp(+match[3] + c.preciousWeight*60 - c.baseWeight*35,0,255);

  return `rgba(${r|0},${g|0},${b|0},${match[4]})`;
}

/* =========================
   PACKET BUILD (RENEWED)
========================= */

function buildPacket(type, size, w, c){
  const scale =
    type==="CRYSTAL"?1.12:
    type==="DENSE"?1.06:
    type==="FERTILE"?1.03:
    type==="EXPOSED"?1.08:1;

  const baseColor =
    type==="CRYSTAL"?"rgba(150,165,200,0.92)":
    type==="DENSE"?"rgba(130,125,110,0.94)":
    type==="FERTILE"?"rgba(120,155,100,0.90)":
    type==="EXPOSED"?"rgba(150,140,110,0.92)":
    "rgba(126,138,104,0.92)";

  return {
    layer:"terrain",
    category:"TERRAIN",
    subCategory:type,

    color:tint(baseColor,c),

    radiusPx:size*scale*(1 + w.variation*0.18 + w.compositionSignal*0.12),

    alpha:clamp(
      0.82 +
      w.continuity*0.10 -
      w.exposure*0.05 +
      w.compositionSignal*0.08,
      0,1
    ),

    overlayOnly:false,

    continuityWeight:w.continuity,
    exposureWeight:w.exposure,
    variationWeight:w.variation,
    compositionSignal:w.compositionSignal
  };
}

/* =========================
   ENTRY (UNCHANGED CONTRACT)
========================= */

export function resolveTerrainPacket({sample,pointSizePx}){
  if(!sample||sample.landMask!==1) return null;

  const c = readComposition(sample);
  const type = classifySurface(sample, c);
  const weights = computeWeights(sample, c);

  const base = isFiniteNumber(pointSizePx)?pointSizePx:1;

  return Object.freeze(buildPacket(type, base, weights, c));
}

export default Object.freeze({resolveTerrainPacket});
