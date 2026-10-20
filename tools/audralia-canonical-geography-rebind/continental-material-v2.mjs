// Audralia Gratitude Gen2826. Pure, build-time, material-only model.
// Ecological donor Git blob 7bb01259f2dc4b614a77c5f9c1626ffe55115b08.
// All centers in original rev5 authoring coordinates; never use GCR2 kilometres.
export const MODEL_ID='GRATITUDE_MACRO_MATERIAL_V2';
const donor=[
['ANCIENT_WESTERN_SHIELD',-1080,-1080,690,520],
['GRATITUDE_OROGEN',80,-520,690,240],
['WESTERN_RIFT_COAST',-1420,-760,420,700],
['GREAT_INTERIOR_BASIN',-80,-1240,920,620],
['EASTERN_GLACIAL_HIGHLANDS',900,-850,520,500],
['SOUTHERN_DELTA_LOWLANDS',240,-1700,720,370],
['RAIN_SHADOW_STEPPE',760,-1260,560,520],
['FORESTED_WINDWARD_FOOTHILLS',-120,-720,520,390]];
const palette={grass:[.32,.37,.24],woodland:[.23,.34,.23],forest:[.14,.28,.19],steppe:[.43,.40,.29],wetland:[.19,.34,.28],rock:[.43,.41,.37],alpine:[.47,.48,.44]};
const C=x=>Math.max(0,Math.min(1,x));
const S=(a,b,x)=>{const t=C((x-a)/(b-a));return t*t*(3-2*t)};
const M=(a,b,t)=>a.map((q,i)=>q+(b[i]-q)*t);
export function provinceTable(regions){
  if(!Array.isArray(regions)||regions.length!==8)throw Error('REGION_COUNT_INVALID');
  const byId=new Map(regions.map(r=>[r.id,r]));
  if(byId.size!==8)throw Error('REGION_IDS_NOT_UNIQUE');
  const k=Math.sqrt(.70);
  return donor.map(([id,x,z,rx,rz])=>{
    const r=byId.get(id);
    if(!r||r.center?.[0]!==x||r.center?.[1]!==z)throw Error('REGION_ID_OR_CENTER_MISMATCH:'+id);
    return {id,cx:x*k,cz:-128+(z+128)*k,rx:rx*k,rz:rz*k};
  });
}
function noise(u,v,period){
  const x=u/period,z=v/period,i=Math.floor(x),j=Math.floor(z);
  const hash=(a,b)=>{let h=2166136261;for(const c of 'GRATITUDE_MACRO_MATERIAL_V2:'+a+':'+b){h=Math.imul(h^c.charCodeAt(0),16777619)>>>0}return 2*h/4294967295-1};
  const t=S(0,1,x-i),w=S(0,1,z-j);
  return (1-w)*((1-t)*hash(i,j)+t*hash(i+1,j))+w*((1-t)*hash(i,j+1)+t*hash(i+1,j+1));
}
export function createContinentalMaterialColor(regions,seaLevel){
  if(!Number.isFinite(seaLevel))throw Error('SEA_LEVEL_INVALID');
  const table=provinceTable(regions);
  return (u,v,elevation,coast)=>{
    if(![u,v,elevation,coast?.distance].every(Number.isFinite))throw Error('MATERIAL_INPUT_NONFINITE');
    const p={};for(const a of table){const x=(u-a.cx)/a.rx,z=(v-a.cz)/a.rz;p[a.id]=Math.exp(-1.55*(x*x+z*z))}
    const elev=C((elevation-seaLevel)/96),marine=Math.exp(-Math.max(0,coast.distance)/480);
    const moisture=C(.22+.45*marine+.26*p.FORESTED_WINDWARD_FOOTHILLS+.16*p.GREAT_INTERIOR_BASIN+.12*p.SOUTHERN_DELTA_LOWLANDS-.30*p.RAIN_SHADOW_STEPPE-.10*elev);
    const dry=C(.13+.48*(1-marine)+.36*p.RAIN_SHADOW_STEPPE-.20*moisture),rock=S(.48,.86,elev);
    const alpine=S(.74,.98,elev)*Math.max(p.GRATITUDE_OROGEN,p.EASTERN_GLACIAL_HIGHLANDS);
    const wetland=C(.62*p.SOUTHERN_DELTA_LOWLANDS+.38*p.GREAT_INTERIOR_BASIN)*S(.34,.72,moisture)*(1-rock);
    const woodland=S(.26,.57,moisture)*(1-rock),forest=S(.49,.79,moisture)*(1-rock),steppe=S(.35,.72,dry)*(1-rock);
    let color=[...palette.grass];
    for(const [name,t] of [['woodland',woodland*.75],['forest',forest*.80],['steppe',steppe*.75],['wetland',wetland*.72],['rock',rock*.76],['alpine',alpine*.86]])color=M(color,palette[name],t);
    const variation=(.025*noise(u,v,90)+.012*noise(u,v,270))*S(72,144,coast.distance);
    return color.map(x=>C(x+variation));
  };
}
