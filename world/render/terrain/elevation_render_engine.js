// /world/render/terrain/elevation_render_engine.js
// MODE: RENDER EXTENSION CONTRACT
// STATUS: ELEVATION FACTOR AUTHORITY v2
// ROLE:
// - upward emphasis only
// - overlay only (no baseline ownership)

function clamp(v, a, b){return Math.max(a,Math.min(b,v));}
function isFiniteNumber(v){return typeof v==="number"&&Number.isFinite(v);}
function toNumber(v,f=0){return isFiniteNumber(v)?v:f;}
function normalizeString(v,f="NONE"){return typeof v==="string"&&v.length>0?v:f;}

/* =========================
   CLASS
========================= */

function classifyElevation(sample){
  const e = clamp(toNumber(sample?.elevation),0,1);
  const ridge = clamp(toNumber(sample?.ridgeStrength),0,1);
  const summit = clamp(toNumber(sample?.strongestSummitScore),0,1);

  if(e>0.72||summit>0.28) return "SUMMIT";
  if(e>0.55||ridge>0.32) return "MOUNTAIN";
  if(ridge>0.18) return "RIDGE";
  if(e>0.18) return "HILL";

  return "NONE";
}

/* =========================
   METRICS
========================= */

function computeWeight(sample){
  const e = clamp(toNumber(sample?.elevation),0,1);
  const ridge = clamp(toNumber(sample?.ridgeStrength),0,1);
  const summit = clamp(toNumber(sample?.strongestSummitScore),0,1);

  return clamp(
    e*0.45 +
    ridge*0.30 +
    summit*0.25,
    0,1
  );
}

/* =========================
   PACKETS
========================= */

function buildPacket(type, baseSize, w){
  const scale =
    type==="SUMMIT"?1.22:
    type==="MOUNTAIN"?1.15:
    type==="RIDGE"?1.08:
    type==="HILL"?1.02:1;

  const alpha =
    type==="SUMMIT"?0.95:
    type==="MOUNTAIN"?0.90:
    type==="RIDGE"?0.85:
    type==="HILL"?0.80:0;

  const color =
    type==="SUMMIT"?"rgba(235,235,225,0.95)":
    type==="MOUNTAIN"?"rgba(190,185,165,0.92)":
    type==="RIDGE"?"rgba(150,170,120,0.90)":
    "rgba(130,160,110,0.88)";

  return {
    layer:"elevation",
    category:"ELEVATION",
    subCategory:type,
    color,
    radiusPx: baseSize*scale*(1 + w*0.2),
    alpha: clamp(alpha + w*0.1,0,1),
    overlayOnly:true
  };
}

/* =========================
   ENTRY
========================= */

export function resolveElevationPacket({sample,pointSizePx}){
  if(!sample||sample.landMask!==1) return null;

  const type = classifyElevation(sample);
  if(type==="NONE") return null;

  const w = computeWeight(sample);
  const base = isFiniteNumber(pointSizePx)?pointSizePx:1;

  return Object.freeze(buildPacket(type, base, w));
}

export default Object.freeze({
  resolveElevationPacket
});
