// /world/render/terrain/cut_render_engine.js
// MODE: RENDER EXTENSION CONTRACT
// STATUS: CUT FACTOR AUTHORITY v2
// ROLE:
// - incision / edge emphasis
// - overlay only

function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function isFiniteNumber(v){return typeof v==="number"&&Number.isFinite(v);}
function toNumber(v,f=0){return isFiniteNumber(v)?v:f;}

/* =========================
   CLASS
========================= */

function classifyCut(sample){
  const slope = clamp(toNumber(sample?.slope),0,1);
  const canyon = clamp(toNumber(sample?.canyonStrength),0,1);

  if(slope>0.65) return "CLIFF";
  if(slope>0.48) return "ESCARPMENT";
  if(canyon>0.30) return "CANYON";
  if(slope>0.12) return "SLOPE";

  return "NONE";
}

/* =========================
   METRICS
========================= */

function computeWeight(sample){
  const slope = clamp(toNumber(sample?.slope),0,1);
  const canyon = clamp(toNumber(sample?.canyonStrength),0,1);
  const curvature = clamp(Math.abs(toNumber(sample?.curvature)),0,1);

  return clamp(
    slope*0.45 +
    canyon*0.30 +
    curvature*0.25,
    0,1
  );
}

/* =========================
   PACKETS
========================= */

function buildPacket(type, baseSize, w){
  const scale =
    type==="CLIFF"?1.18:
    type==="ESCARPMENT"?1.10:
    type==="CANYON"?1.06:
    type==="SLOPE"?1.02:1;

  const alpha =
    type==="CLIFF"?0.95:
    type==="ESCARPMENT"?0.90:
    type==="CANYON"?0.88:
    type==="SLOPE"?0.82:0;

  const color =
    type==="CLIFF"?"rgba(155,145,120,0.95)":
    type==="ESCARPMENT"?"rgba(145,135,110,0.92)":
    type==="CANYON"?"rgba(125,115,95,0.90)":
    "rgba(110,100,85,0.88)";

  return {
    layer:"cut",
    category:"CUT",
    subCategory:type,
    color,
    radiusPx: baseSize*scale*(1 + w*0.18),
    alpha: clamp(alpha + w*0.08,0,1),
    overlayOnly:true
  };
}

/* =========================
   ENTRY
========================= */

export function resolveCutPacket({sample,pointSizePx}){
  if(!sample||sample.landMask!==1) return null;

  const type = classifyCut(sample);
  if(type==="NONE") return null;

  const w = computeWeight(sample);
  const base = isFiniteNumber(pointSizePx)?pointSizePx:1;

  return Object.freeze(buildPacket(type, base, w));
}

export default Object.freeze({
  resolveCutPacket
});
