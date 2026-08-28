const POLICY_ID='AUDRALIA_HOOK5_OWNER_VISIBLE_CONTINUITY_v1';
const nativeShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let cloudPatched=0;
let celestialPatched=0;
let poleCrossings=0;

function replaceOnce(source,from,to,label){
  const first=source.indexOf(from);
  if(first<0)throw new Error(`HOOK5_REQUIRED_MUTATION_MISSING:${label}`);
  if(source.indexOf(from,first+from.length)>=0)throw new Error(`HOOK5_REQUIRED_MUTATION_AMBIGUOUS:${label}`);
  return source.slice(0,first)+to+source.slice(first+from.length);
}

function patchFinalCloud(source){
  if(typeof source!=='string'||!source.includes('AUDRALIA_FINAL_CLOUD_SHADER_COMPOSITION_v1')||!source.includes('vec3 fap1OrganizedWeather('))return source;
  let next=source;

  // Preserve the existing systems, coordinates, altitude bands and one-pass lineage.
  // Hook 5 changes effective occupancy/material survival only.
  next=replaceOnce(next,
    'float polarMass=polarLow+polarMid+polarHigh+polarDeep;',
    'float polarMass=(polarLow+polarMid+polarHigh+polarDeep)*1.38;/*HOOK5_POLAR_WEATHER_REALIZATION*/',
    'POLAR_WEATHER_REALIZATION');

  next=replaceOnce(next,
    'float tradeStreet=smoothstep(.68,.90,tradeRows)*smoothstep(.49,.73,tradeCells);',
    'float tradeStreet=smoothstep(.48,.78,tradeRows)*mix(.38,1.0,smoothstep(.38,.68,tradeCells));/*HOOK5_TRADE_STREET_SURVIVAL*/',
    'TRADE_STREET_SURVIVAL');
  next=replaceOnce(next,
    'float tradeCumulus=tradeEnvelope*fap1Band(h,30.0,57.0)*tradeStreet*.72;',
    'float tradeCumulus=tradeEnvelope*fap1Band(h,30.0,57.0)*tradeStreet*.88;',
    'TRADE_CUMULUS_MASS');

  next=replaceOnce(next,
    'float commaMid=commaShape*fap1Band(h,46.0,84.0)*commaBreak*.60;',
    'float commaMid=commaShape*fap1Band(h,46.0,84.0)*commaBreak*.84;/*HOOK5_COMMA_MATERIAL_SURVIVAL*/',
    'COMMA_MID_MASS');
  next=replaceOnce(next,
    'float commaIce=max(commaHead,commaWrap)*fap1Band(h,73.0,104.0)*mix(.22,1.0,fap1CloudBreak(radial,t,20.0,.35,.70))*.38;',
    'float commaIce=max(commaHead,commaWrap)*fap1Band(h,73.0,104.0)*mix(.30,1.0,fap1CloudBreak(radial,t,20.0,.35,.70))*.54;',
    'COMMA_ICE_MASS');

  next=replaceOnce(next,
    'float mccTower=mccCore*fap1Band(h,30.0,105.0)*mccBreak*.90;',
    'float mccTower=mccCore*fap1Band(h,30.0,105.0)*mccBreak*1.06;/*HOOK5_MCC_MATERIAL_SURVIVAL*/',
    'MCC_TOWER_MASS');
  next=replaceOnce(next,
    'float mccAnvil=fap1Ellipse(xq,vec2(.025,.075),vec2(.32,.19),-.08)*fap1Band(h,78.0,108.0)*mix(.30,1.0,fap1CloudBreak(radial,t,18.0,.33,.69))*.60;',
    'float mccAnvil=fap1Ellipse(xq,vec2(.025,.075),vec2(.38,.24),-.08)*fap1Band(h,78.0,108.0)*mix(.38,1.0,fap1CloudBreak(radial,t,18.0,.33,.69))*.78;',
    'MCC_ANVIL_MASS');

  next=replaceOnce(next,
    'float jetEnvelope=fap1Ellipse(iq,vec2(0.0),vec2(.54,.105),.24);',
    'float jetEnvelope=fap1Ellipse(iq,vec2(0.0),vec2(.62,.15),.24);/*HOOK5_JET_PLUME_FOOTPRINT*/',
    'JET_PLUME_FOOTPRINT');
  next=replaceOnce(next,
    'float jetTexture=.18+.42*smoothstep(.42,.76,jetRipple*.48+jetBreak*.52);',
    'float jetTexture=.30+.58*smoothstep(.38,.72,jetRipple*.48+jetBreak*.52);',
    'JET_PLUME_TEXTURE');
  next=replaceOnce(next,
    'float cirrusPlume=jetEnvelope*fap1Band(h,81.0,108.0)*jetTexture*.46;',
    'float cirrusPlume=jetEnvelope*fap1Band(h,81.0,108.0)*jetTexture*.68;',
    'JET_PLUME_MASS');

  // The historical support blanket can numerically dominate weak organized identities.
  // Retain direct-density support, but restore headroom/clear-air separation around systems.
  next=replaceOnce(next,
    'return clamp(climate*broken*clearSlot*regionalVariance*.940,0.0,.840);/*AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1*/',
    'return clamp(climate*broken*clearSlot*regionalVariance*.720,0.0,.660);/*AUDRALIA_FINAL_DIRECT_DENSITY_SUPPORT_v1*//*HOOK5_CLEAR_AIR_HEADROOM*/',
    'DIRECT_SUPPORT_HEADROOM');

  cloudPatched++;
  return next;
}

function patchCelestial(source){
  if(typeof source!=='string'||!source.includes('uniform vec3 uMoonA;')||!source.includes('uniform vec3 uMoonB;')||!source.includes('if(planetT>0.0)'))return source;
  let next=source;
  const from=`    vec3 nightColor=mix(vec3(0.020,0.030,0.060),vec3(0.003,0.008,0.021),deepNight);\n    vec3 twilightColor=vec3(0.19,0.065,0.035);\n    vec3 color=mix(nightColor,twilightColor,twilight*0.28);\n    float alpha=clamp(night*0.79+twilight*0.09,0.0,0.82);`;
  const to=`    vec3 moonA=normalize(uMoonA),moonB=normalize(uMoonB);\n    float moonKey=max(pow(max(dot(n,moonA),0.0),1.35),pow(max(dot(n,moonB),0.0),1.35));\n    float moonRim=max(pow(max(dot(n,moonA),0.0),4.0),pow(max(dot(n,moonB),0.0),4.0));\n    vec3 nightColor=mix(vec3(0.020,0.030,0.060),vec3(0.003,0.008,0.021),deepNight);\n    vec3 moonColor=vec3(0.085,0.115,0.165)*(moonKey*.62+moonRim*.24)*deepNight;\n    vec3 twilightColor=vec3(0.19,0.065,0.035);\n    vec3 color=mix(nightColor+moonColor,twilightColor,twilight*0.28);\n    float alpha=clamp(night*(0.76-moonKey*.12)+twilight*0.09,0.0,0.82);/*HOOK5_EPHEMERAL_MOON_GLOW*/`;
  next=replaceOnce(next,from,to,'EPHEMERAL_MOON_GLOW');
  celestialPatched++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  let next=source;
  next=patchFinalCloud(next);
  next=patchCelestial(next);
  return nativeShaderSource.call(this,shader,next);
};

function installPolarContinuity(){
  const receipt=window.__AUDRALIA_WEATHER_PRESENTATION_RECONCILIATION__;
  const canvas=document.querySelector('[data-h-earth-map-wide-canvas]');
  if(!receipt?.renderer?.state||typeof receipt.setCameraStateForTest!=='function'||!(canvas instanceof HTMLCanvasElement))return false;
  const state=receipt.renderer.state;
  const pointers=new Map();
  let lastSingle=null;

  canvas.addEventListener('pointerdown',event=>{
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    lastSingle=pointers.size===1?{x:event.clientX,y:event.clientY}:null;
  },{capture:true,passive:true});

  canvas.addEventListener('pointermove',event=>{
    if(!pointers.has(event.pointerId))return;
    const next={x:event.clientX,y:event.clientY};
    pointers.set(event.pointerId,next);
    if(pointers.size!==1||!lastSingle){lastSingle=next;return;}
    const dy=Math.max(-64,Math.min(64,next.y-lastSingle.y));
    const proposed=state.pitch+dy*.0032;
    const upper=1.49,lower=.46;
    let crossed=false;
    let pitch=state.pitch,yaw=state.yaw;
    if(proposed>upper){
      pitch=Math.max(lower,upper-(proposed-upper));
      yaw=Math.atan2(Math.sin(yaw+Math.PI),Math.cos(yaw+Math.PI));
      crossed=true;
    }else if(proposed<lower){
      pitch=Math.min(upper,lower+(lower-proposed));
      yaw=Math.atan2(Math.sin(yaw+Math.PI),Math.cos(yaw+Math.PI));
      crossed=true;
    }
    if(crossed){
      event.preventDefault();
      event.stopImmediatePropagation();
      poleCrossings++;
      receipt.setCameraStateForTest({pitch,yaw});
    }
    lastSingle=next;
  },{capture:true,passive:false});

  const clear=event=>{
    pointers.delete(event.pointerId);
    lastSingle=pointers.size===1?[...pointers.values()][0]:null;
  };
  canvas.addEventListener('pointerup',clear,{capture:true,passive:true});
  canvas.addEventListener('pointercancel',clear,{capture:true,passive:true});
  canvas.addEventListener('lostpointercapture',clear,{capture:true,passive:true});
  return true;
}

let continuityInstalled=false;
const installTimer=setInterval(()=>{
  if(continuityInstalled)return;
  continuityInstalled=installPolarContinuity();
  if(continuityInstalled)clearInterval(installTimer);
},40);
setTimeout(()=>clearInterval(installTimer),15000);

Object.defineProperty(globalThis,'__AUDRALIA_HOOK5_OWNER_VISIBLE_CONTINUITY__',{value:Object.freeze({
  policyId:POLICY_ID,
  architecture:'SAME_FINAL_SHADER_PLUS_EXISTING_RENDERER_STATE',
  protectedSnapshotMutated:false,
  secondRenderer:false,
  secondCloudLayer:false,
  getEvidence:()=>Object.freeze({cloudPatched,celestialPatched,poleCrossings,continuityInstalled})
})});
