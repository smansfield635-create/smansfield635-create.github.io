// Characters cloud presentation adapter.
// Visible cloud rendering is intentionally disabled by owner direction (2026-09-09).
// Cloud traversal/state authority remains external and intact; this module preserves the
// existing public API so the Characters runtime does not need broader mutation.

export const AUDRALIA_WEATHER_PRESENTATION_SOURCE=Object.freeze({
  pr:780,
  exactHead:'65aedb63832c4774f4a7326297fadbfb14552955',
  sourcePath:'showroom/globe/audralia/weather-presentation-reconciliation/exterior-weather.mjs',
  spatialLodPrecedent:779,
  inheritanceLaw:'OLD_EXTERIOR_APPEARANCE_MAY_BE_INHERITED_NOT_OLD_OCCLUSION_BEHAVIOR'
});

// Retained for compatibility with existing evidence/readers. No geometry is submitted.
export const AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL='PR780_DENSITY_SAMPLED_VOLUME_CELLS';

export const CLOUD_PRESENTATION_BY_STATE=Object.freeze({
  ORBIT:Object.freeze({opacity:.21,opticalDepth:.15,veil:0,drift:1}),
  ASCENT:Object.freeze({opacity:.29,opticalDepth:.27,veil:.06,drift:1.05}),
  CLOUD_ENTRY:Object.freeze({opacity:.44,opticalDepth:.50,veil:.24,drift:1.08}),
  CLOUD_TRANSIT:Object.freeze({opacity:.58,opticalDepth:.80,veil:.62,drift:1.10}),
  DESCENT:Object.freeze({opacity:.36,opticalDepth:.36,veil:.14,drift:.85}),
  ARRIVAL:Object.freeze({opacity:.18,opticalDepth:.12,veil:0,drift:.55})
});

const DESKTOP_BANKS=[
  [-430,118,-720,1.15,0.12],[-245,96,-930,.92,.42],[-55,132,-610,1.28,.75],[155,108,-820,1.04,1.18],
  [360,124,-560,1.18,1.61],[-335,146,-1160,.90,2.03],[80,158,-1110,1.14,2.48],[455,138,-1010,.98,2.91]
];
const MOBILE_BANKS=[DESKTOP_BANKS[0],DESKTOP_BANKS[2],DESKTOP_BANKS[3],DESKTOP_BANKS[5],DESKTOP_BANKS[7]];
const PUFF_PATTERN=[[-54,-8,-6,.82],[-28,5,7,1.04],[0,10,0,1.20],[31,4,-5,1.00],[56,-5,9,.76],[-10,-9,19,.86],[18,-7,-18,.72]];
const AUDRALIA_GENUS_SEQUENCE=['Sc','Cu','Ac','Ns','As','Cs','Ci','St'];

export function buildCloudBankLayout({compact=false}={}){
  const seeds=compact?MOBILE_BANKS:DESKTOP_BANKS;
  return seeds.map(([x,y,z,scale,phase],bankIndex)=>({
    bankIndex,x,y,z,scale,phase,genus:AUDRALIA_GENUS_SEQUENCE[bankIndex%AUDRALIA_GENUS_SEQUENCE.length],
    puffs:PUFF_PATTERN.map(([dx,dy,dz,s],puffIndex)=>({
      puffIndex,
      x:x+dx*scale,
      y:y+dy*scale,
      z:z+dz*scale,
      radius:(32+((bankIndex*17+puffIndex*11)%19))*scale*s,
      flatten:.52+((bankIndex+puffIndex)%4)*.06
    }))
  }));
}

export function resolveCloudPresentation(state='ORBIT',{reducedMotion=false,compact=false}={}){
  const base=CLOUD_PRESENTATION_BY_STATE[state]||CLOUD_PRESENTATION_BY_STATE.ORBIT;
  return {...base,drift:reducedMotion?0:base.drift,compact};
}

export function createCloudSystem({gl,compact=false,reducedMotion=false}={}){
  if(!gl)throw new Error('CLOUD_SYSTEM_WEBGL2_REQUIRED');
  const layout=buildCloudBankLayout({compact});
  let last={state:'ORBIT',...resolveCloudPresentation('ORBIT',{reducedMotion,compact})};
  const puffCount=layout.reduce((n,b)=>n+b.puffs.length,0);

  // Deliberate no-op. The former cloud point field and traversal veil are not allocated,
  // compiled, uploaded, or drawn. This removes the visible clouds without changing the
  // caller contract or the separate traversal/state machinery.
  function draw({state}={}){
    const liveState=state||globalThis.document?.documentElement?.dataset?.cloudTravel||'ORBIT';
    last={state:liveState,...resolveCloudPresentation(liveState,{reducedMotion,compact})};
  }

  function snapshot(){
    return {
      schema:'MIRRORLAND_CLOUD_SYSTEM_RUNTIME_v1',
      state:last.state,
      bankCount:layout.length,
      puffCount,
      cellCount:0,
      geometryModel:AUDRALIA_VOLUMETRIC_GEOMETRY_MODEL,
      opacity:last.opacity,
      opticalDepth:last.opticalDepth,
      veil:last.veil,
      drift:last.drift,
      reducedMotion,
      compact,
      renderingEnabled:false,
      audraliaWeatherSource:AUDRALIA_WEATHER_PRESENTATION_SOURCE
    };
  }

  const api={draw,snapshot,layout};
  if(typeof globalThis!=='undefined')globalThis.__MIRRORLAND_CLOUD_SYSTEM__=api;
  return api;
}
