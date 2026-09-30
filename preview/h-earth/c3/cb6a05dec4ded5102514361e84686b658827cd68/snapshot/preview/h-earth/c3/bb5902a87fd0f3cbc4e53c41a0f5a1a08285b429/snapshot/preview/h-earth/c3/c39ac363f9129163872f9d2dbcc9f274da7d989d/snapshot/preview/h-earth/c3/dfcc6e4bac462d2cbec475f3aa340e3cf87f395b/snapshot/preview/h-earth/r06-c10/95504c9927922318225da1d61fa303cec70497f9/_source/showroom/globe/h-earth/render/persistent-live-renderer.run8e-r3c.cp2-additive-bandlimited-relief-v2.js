/** H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1 */
import { getHEarthRun8ER2CanonicalLiveRenderPackage } from './live-render-package.run8e-r2.canonical.js';
import { createHEarthRun8ER2DCanonicalGPUUploadViews } from './gpu-upload-views.run8e-r2d.js';
import { getHEarthRun8ER3ALiveRendererInterface } from './live-renderer-contract.run8e-r3a.js';

export const H_EARTH_RUN_8E_R3C_RENDERER_ID =
  'H_EARTH_RUN_8E_R3C_PERSISTENT_WEBGL2_LIVE_RENDERER_v1';
export const H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID =
  'H_EARTH_CURRENT_LIVE_BAND_LIMITED_TERRAIN_RELIEF_PRESENTATION_PROFILE_v2';

const LOGICAL_ID = 'H_EARTH_RUN_8E_R2_LIVE_RENDER_PACKAGE_07F2FA1F';
const RUNTIME_ID = LOGICAL_ID;
const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const color3 = (value) => {
  const array = Array.isArray(value) ? value : [0, 0, 0];
  const scale = array.some((entry) => entry > 1) ? 255 : 1;
  return array.slice(0, 3).map((entry) =>
    Math.min(1, Math.max(0, Number(entry) / scale)));
};
const hash = (bytes) => {
  let value = 0x811c9dc5;
  for (const byte of bytes) {
    value ^= byte;
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return `fnv1a32:${value.toString(16).padStart(8, '0')}`;
};
const summarize = (bytes, clear) => {
  let nonClearPixelCount = 0;
  let luminanceSum = 0;
  let luminanceSquareSum = 0;
  const buckets = new Set();
  const pixelCount = bytes.length / 4;
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const red = bytes[offset];
    const green = bytes[offset + 1];
    const blue = bytes[offset + 2];
    if (
      Math.abs(red - clear[0]) +
      Math.abs(green - clear[1]) +
      Math.abs(blue - clear[2]) > 9
    ) nonClearPixelCount += 1;
    const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    luminanceSum += luminance;
    luminanceSquareSum += luminance * luminance;
    buckets.add(`${red >> 4}:${green >> 4}:${blue >> 4}`);
  }
  const meanLuminance = luminanceSum / Math.max(1, pixelCount);
  return {
    pixelCount,
    nonClearPixelCount,
    uniqueColorBucketCount: buckets.size,
    meanLuminance,
    luminanceStandardDeviation: Math.sqrt(Math.max(
      0,
      luminanceSquareSum / Math.max(1, pixelCount) - meanLuminance * meanLuminance
    )),
    byteHash: hash(bytes)
  };
};

const VS = `#version 300 es
precision highp float;
precision highp int;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec4 aBaseColorLinear;
layout(location=3) in vec4 aMaterialParameters;
layout(location=4) in uint aMaterialModelCode;
layout(location=5) in uint aSurfaceClassCode;
layout(location=6) in uint aPrimitiveIndex;
layout(location=7) in uint aRoleCode;
uniform mat4 uViewProjection;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec4 vBaseColor;
out vec4 vMaterialParameters;
flat out uint vMaterialModelCode;
flat out uint vSurfaceClassCode;
flat out uint vPrimitiveIndex;
flat out uint vRoleCode;
void main(){
  vWorldPosition=aPosition;
  vNormal=aNormal;
  vBaseColor=aBaseColorLinear;
  vMaterialParameters=aMaterialParameters;
  vMaterialModelCode=aMaterialModelCode;
  vSurfaceClassCode=aSurfaceClassCode;
  vPrimitiveIndex=aPrimitiveIndex;
  vRoleCode=aRoleCode;
  gl_Position=uViewProjection*vec4(aPosition,1.0);
}`;

const FS = `#version 300 es
precision highp float;
precision highp int;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec4 vBaseColor;
in vec4 vMaterialParameters;
flat in uint vMaterialModelCode;
flat in uint vSurfaceClassCode;
flat in uint vPrimitiveIndex;
flat in uint vRoleCode;
uniform vec3 uCameraPosition;
uniform vec3 uSunDirection;
uniform float uSunIntensity;
uniform vec3 uSunColor;
uniform vec3 uSkyZenithColor;
uniform vec3 uSkyHorizonColor;
uniform vec3 uGroundHazeColor;
uniform float uFogStartDistance;
uniform float uFogFalloff;
uniform float uMaximumFogFactor;
uniform float uDistanceDesaturationStrength;
out vec4 outColor;

float hash21(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
float noise2(vec2 p){
  vec2 i=floor(p),f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash21(i),hash21(i+vec2(1.0,0.0)),f.x),
             mix(hash21(i+vec2(0.0,1.0)),hash21(i+vec2(1.0,1.0)),f.x),f.y);
}
float stableWave(float phase){
  float footprint=max(fwidth(phase),0.00001);
  float retained=1.0-smoothstep(0.72,1.65,footprint);
  return mix(0.5,0.5+0.5*sin(phase),retained);
}
float transitionBand(float signal,float halfWidth){
  float distanceToCenter=abs(signal-0.5);
  float antialiasWidth=max(fwidth(signal)*1.5,0.012);
  return 1.0-smoothstep(halfWidth-antialiasWidth,halfWidth+antialiasWidth,distanceToCenter);
}
float contour(float elevation){
  float interval=2.5;
  float centered=abs(fract(elevation/interval)-0.5);
  float width=max(fwidth(elevation/interval)*1.65,0.026);
  return smoothstep(0.47-width,0.49,centered);
}
float radial(vec2 point,vec2 center,float innerRadius,float outerRadius){
  return 1.0-smoothstep(innerRadius,outerRadius,distance(point,center));
}
float ring(vec2 point,vec2 center,float innerRadius,float outerRadius,float feather){
  float radius=distance(point,center);
  float inner=smoothstep(innerRadius-feather,innerRadius+feather,radius);
  float outer=1.0-smoothstep(outerRadius-feather,outerRadius+feather,radius);
  return clamp(inner*outer,0.0,1.0);
}
vec3 perturbTerrainNormal(
  vec3 geometricNormal,
  vec3 worldPosition,
  float reliefHeight
){
  vec3 positionDx = dFdx(worldPosition);
  vec3 positionDy = dFdy(worldPosition);
  float reliefDx = dFdx(reliefHeight);
  float reliefDy = dFdy(reliefHeight);
  vec3 surfaceGradient =
    reliefDx * cross(positionDy, geometricNormal) +
    reliefDy * cross(geometricNormal, positionDx);
  float determinant =
    dot(positionDx, cross(positionDy, geometricNormal));
  float orientation =
    determinant < 0.0 ? -1.0 : 1.0;
  return normalize(
    abs(determinant) * geometricNormal -
    orientation * surfaceGradient
  );
}
vec3 limitTerrainNormalDeviation(
  vec3 geometricNormal,
  vec3 candidateNormal
){
  const float COSINE_22_DEGREES = 0.9271838545667874;
  const float SINE_22_DEGREES = 0.3746065934159120;
  float correspondence = clamp(
    dot(geometricNormal, candidateNormal),
    -1.0,
    1.0
  );
  if(correspondence >= COSINE_22_DEGREES){
    return candidateNormal;
  }
  vec3 tangent =
    candidateNormal -
    geometricNormal * correspondence;
  float tangentLength = length(tangent);
  if(tangentLength < 0.00001){
    return geometricNormal;
  }
  return normalize(
    geometricNormal * COSINE_22_DEGREES +
    tangent / tangentLength * SINE_22_DEGREES
  );
}
void main(){
  vec3 geometricNormal=normalize(vNormal);
  vec3 shadingNormal=geometricNormal;
  vec3 lightDirection=normalize(-uSunDirection);
  vec3 viewDirection=normalize(uCameraPosition-vWorldPosition);
  vec3 halfDirection=normalize(lightDirection+viewDirection);
  float slope=1.0-clamp(geometricNormal.y,0.0,1.0);
  float specularScale=1.0;
  float terrainReliefEnvelope=0.0;
  float materialSignal=clamp(vMaterialParameters.x+vMaterialParameters.y*0.5,0.0,1.0);
  float identitySignal=float((vMaterialModelCode+vSurfaceClassCode+vPrimitiveIndex)%7u)/7.0;
  float distanceToCamera=length(vWorldPosition-uCameraPosition);
  float presentationContact=0.0;
  float presentationHighlight=0.0;
  vec3 base=max(vBaseColor.rgb,vec3(0.004));
  float outputAlpha=clamp(vBaseColor.a,0.18,1.0);

  if(vRoleCode==1u){
    vec2 world=vWorldPosition.xz;
    float broad=noise2(world*0.035);
    float medium=noise2(world*0.13+vec2(17.0,-9.0));
    float grain=noise2(world*0.55+vec2(-31.0,23.0));
    float macroField=noise2(world*0.018+vec2(5.0,-11.0));
    float mesoField=noise2(world*0.082+vec2(-13.0,7.0));
    float detailField=noise2(world*0.29+vec2(29.0,-17.0));
    float elevationMix=smoothstep(-1.0,34.0,vWorldPosition.y);
    float slopeResponse=smoothstep(0.025,0.58,slope);
    float curvatureResponse=clamp(length(fwidth(geometricNormal))*3.25,0.0,1.0);
    float nearDetail=1.0-smoothstep(72.0,250.0,distanceToCamera);

    const vec3 MICRO_DIRECTION_A=vec3(
      0.8164965809277260,
      0.4082482904638630,
      0.4082482904638630
    );
    const vec3 MICRO_DIRECTION_B=vec3(
      -0.4082482904638630,
      0.8164965809277260,
      0.4082482904638630
    );
    const vec3 MICRO_DIRECTION_C=vec3(
      0.4082482904638630,
      -0.4082482904638630,
      0.8164965809277260
    );

    float microPhaseA=
      dot(vWorldPosition,MICRO_DIRECTION_A)*
      3.306939635357677+
      0.3700000000000000;
    float microPhaseB=
      dot(vWorldPosition,MICRO_DIRECTION_B)*
      2.7318196987737333+
      2.1700000000000000;
    float microPhaseC=
      dot(vWorldPosition,MICRO_DIRECTION_C)*
      2.243994752564138+
      4.1100000000000000;

    float microPhaseFootprintA=max(fwidth(microPhaseA),0.00001);
    float microPhaseFootprintB=max(fwidth(microPhaseB),0.00001);
    float microPhaseFootprintC=max(fwidth(microPhaseC),0.00001);
    float maximumMicroPhaseFootprint=max(
      microPhaseFootprintA,
      max(microPhaseFootprintB,microPhaseFootprintC)
    );

    float microAntialiasEnvelope=
      1.0-smoothstep(
        0.45,
        0.95,
        maximumMicroPhaseFootprint
      );

    float microReliefSignal=
      sin(microPhaseA)*0.50+
      sin(microPhaseB)*0.30+
      sin(microPhaseC)*0.20;

    float microReliefHeight=
      microReliefSignal*0.22;

    float microDistanceEnvelope=
      1.0-smoothstep(
        120.0,
        300.0,
        distanceToCamera
      );

    float microSlopeEnvelope=mix(
      0.82,
      1.0,
      smoothstep(
        0.05,
        0.55,
        slope
      )
    );

    terrainReliefEnvelope=clamp(
      microDistanceEnvelope*
      microSlopeEnvelope*
      microAntialiasEnvelope,
      0.0,
      1.0
    );

    vec3 rawMicroreliefNormal=
      perturbTerrainNormal(
        geometricNormal,
        vWorldPosition,
        microReliefHeight
      );

    vec3 boundedMicroreliefNormal=
      limitTerrainNormalDeviation(
        geometricNormal,
        rawMicroreliefNormal
      );

    shadingNormal=normalize(
      mix(
        geometricNormal,
        boundedMicroreliefNormal,
        terrainReliefEnvelope
      )
    );

    vec3 lowland=vec3(0.29,0.27,0.19);
    vec3 upland=vec3(0.34,0.36,0.31);
    vec3 rock=vec3(0.25,0.27,0.26);
    vec3 palette=mix(lowland,upland,elevationMix);
    palette=mix(palette,rock,clamp(slope*1.35,0.0,0.72));

    float strata=stableWave(world.x*0.47+world.y*0.33+vWorldPosition.y*0.79+medium*3.2);
    float crossGrain=stableWave(world.x*0.83-world.y*0.61+broad*4.8);
    float faceBandA=stableWave(world.x*0.61+world.y*0.39+vWorldPosition.y*0.57+mesoField*4.1);
    float faceBandB=stableWave(world.x*1.07-world.y*0.73+vWorldPosition.y*0.31+macroField*5.3);
    float faceBandC=stableWave(world.x*1.71+world.y*1.23+vWorldPosition.y*0.18+detailField*2.7);
    float crestSignal=stableWave(world.x*0.22-world.y*0.16+vWorldPosition.y*0.88+macroField*2.1);
    float terraceSignal=stableWave(world.x*0.13+world.y*0.19+vWorldPosition.y*1.18+mesoField*1.6);
    float crestContact=transitionBand(crestSignal,0.075);
    float terraceContact=transitionBand(terraceSignal,0.070);
    float sharedFaceContact=clamp(
      max(crestContact,terraceContact)*(0.32+0.68*mix(0.45,1.0,slopeResponse)),
      0.0,
      1.0
    );
    float faceBreak=clamp(
      macroField*0.22+
      mesoField*0.25+
      detailField*0.15+
      faceBandA*0.18+
      faceBandB*0.13+
      faceBandC*0.07,
      0.0,
      1.0
    );
    float directionalBreak=mix(faceBandA,faceBandB,0.35+0.45*slopeResponse);
    float fineBreak=mix(0.5,faceBandC,nearDetail);

    palette*=0.62+0.46*broad+0.24*medium+0.14*grain;
    palette*=mix(0.70,1.30,strata*0.68+crossGrain*0.32);
    palette*=mix(0.71,1.34,faceBreak);
    palette*=mix(0.86,1.15,directionalBreak);
    palette*=mix(0.93,1.08,fineBreak);
    palette*=mix(1.0,0.72,sharedFaceContact*(0.30+0.24*nearDetail));
    palette+=vec3(0.026,0.021,0.014)*(faceBandA-faceBandB);
    palette+=vec3(0.030,0.023,0.014)*(crestSignal-terraceSignal)*(0.30+0.45*slopeResponse);
    palette=mix(palette,palette*vec3(0.79,0.85,0.88),curvatureResponse*(0.18+0.26*slopeResponse));
    palette=mix(palette,base,0.27);
    presentationContact=max(presentationContact,sharedFaceContact*0.24);
    presentationHighlight=max(presentationHighlight,(1.0-sharedFaceContact)*abs(crestSignal-terraceSignal)*0.16);

    float contourLine=contour(vWorldPosition.y);
    palette*=mix(1.0,0.56,contourLine*(0.30+0.47*slopeResponse));
    float slopeRake=stableWave(vWorldPosition.x*0.31+vWorldPosition.z*0.22+vWorldPosition.y*0.58);
    palette*=mix(0.84,1.16,slopeRake*(0.26+0.74*slopeResponse));
    palette+=vec3(0.020,0.018,0.014)*curvatureResponse*(0.35+0.65*slopeResponse);

    vec2 manorCenter=vec2(80.0,-172.0);
    float manorRadius=distance(world,manorCenter);
    float manorEnvelope=radial(world,manorCenter,7.0,30.0);
    float manorEdge=ring(world,manorCenter,10.5,21.0,2.2);
    float manorOuterContact=ring(world,manorCenter,21.5,31.5,2.4);
    float manorInnerContact=ring(world,manorCenter,4.5,13.5,1.8);
    float manorPattern=stableWave(manorRadius*0.83+vWorldPosition.y*0.46+noise2(world*0.19)*4.0);
    float manorGranularity=noise2(world*0.34+vec2(41.0,-23.0));
    float manorTerraceSignal=stableWave(manorRadius*0.44+vWorldPosition.y*0.72+manorGranularity*2.2);
    float manorTerraceContact=transitionBand(manorTerraceSignal,0.080)*manorEnvelope;
    float manorChromatic=stableWave(manorRadius*0.29+world.x*0.12-world.y*0.09+vWorldPosition.y*0.37+manorGranularity*1.4);
    float manorContact=max(
      manorEdge,
      max(manorOuterContact*0.90,max(manorInnerContact*0.75,manorTerraceContact*0.70))
    );
    vec3 manorStone=mix(vec3(0.35,0.21,0.055),vec3(0.72,0.51,0.17),manorPattern*0.72+manorGranularity*0.28);
    palette=mix(palette,manorStone,manorEnvelope*(0.42+0.22*manorPattern));
    palette*=mix(1.0,0.54,manorContact*(0.36+0.42*manorPattern));
    palette*=mix(0.88,1.12,manorTerraceSignal*manorEnvelope*0.34);
    palette+=vec3(0.205,0.125,0.020)*manorContact*(0.42+0.58*manorGranularity);
    palette+=vec3(0.062,0.016,-0.022)*(manorChromatic-0.5)*manorEnvelope;
    presentationContact=max(presentationContact,manorContact*0.72);
    presentationHighlight=max(presentationHighlight,manorOuterContact*0.44+manorTerraceContact*0.24);

    vec2 cavernCenter=vec2(40.0,-284.0);
    float cavernRadius=distance(world,cavernCenter);
    float cavernRelation=radial(world,cavernCenter,5.0,28.0);
    float cavernApproach=radial(world,vec2(48.0,-284.0),10.0,44.0);
    float cavernContact=ring(world,cavernCenter,8.0,24.0,2.8);
    float cavernOuterContact=ring(world,cavernCenter,23.0,39.0,3.6);
    float cavernStrata=stableWave(cavernRadius*0.71+vWorldPosition.y*0.92+noise2(world*0.15)*4.6);
    float cavernFracture=stableWave(world.x*0.93-world.y*0.67+vWorldPosition.y*0.44);
    float cavernRelationSignal=stableWave(cavernRadius*0.43+(world.y+284.0)*0.31+vWorldPosition.y*0.83+noise2(world*0.12)*2.0);
    float cavernRelationContact=transitionBand(cavernRelationSignal,0.082)*cavernApproach;
    float cavernGroundContact=max(
      cavernContact,
      max(cavernOuterContact*0.82,cavernRelationContact*0.72)
    );
    vec3 cavernStone=mix(vec3(0.028,0.052,0.060),vec3(0.27,0.39,0.42),cavernStrata*0.70+cavernFracture*0.30);
    palette=mix(palette,cavernStone,cavernRelation*(0.68+0.20*cavernStrata));
    palette*=mix(1.0,0.50,cavernGroundContact*(0.36+0.48*cavernFracture));
    palette*=mix(0.90,1.10,cavernRelationSignal*cavernApproach*0.30);
    palette=mix(palette,palette*vec3(0.60,0.84,0.96),cavernApproach*0.32);
    palette+=vec3(0.032,0.060,0.070)*cavernGroundContact*(0.35+0.65*cavernStrata);
    presentationContact=max(presentationContact,cavernGroundContact*0.82);
    presentationHighlight=max(presentationHighlight,cavernOuterContact*0.34+cavernRelationContact*0.26);

    float ravineAxis=exp(-pow((vWorldPosition.x-40.0)/18.0,2.0));
    float ravineShoulder=ring(world,vec2(40.0,-252.0),18.0,46.0,5.0);
    float ravineDepth=1.0-smoothstep(-292.0,-210.0,vWorldPosition.z);
    float routePulse=stableWave(vWorldPosition.z*0.56+vWorldPosition.y*0.31+mesoField*3.0);
    float ravineWallSignal=stableWave(abs(vWorldPosition.x-40.0)*0.32+(-vWorldPosition.z-210.0)*0.09+vWorldPosition.y*0.51);
    float ravineWallContact=transitionBand(ravineWallSignal,0.080)*ravineDepth;
    float routeSignal=ravineAxis*ravineDepth*(0.36+0.64*slopeResponse);
    palette=mix(palette,vec3(0.060,0.125,0.14),routeSignal*(0.42+0.40*routePulse));
    palette*=mix(1.0,0.70,max(ravineShoulder*ravineDepth*(0.18+0.32*slopeResponse),ravineWallContact*0.62));
    palette+=vec3(0.026,0.050,0.058)*(routeSignal*routePulse+ravineWallContact*0.45);
    presentationContact=max(presentationContact,ravineWallContact*0.52+routeSignal*0.20);
    base=palette;
  }else if(vRoleCode==2u){
    float wave=0.5+0.5*sin(vWorldPosition.x*0.34+vWorldPosition.z*0.19);
    float foam=pow(clamp(1.0-geometricNormal.y,0.0,1.0),1.7);
    base=mix(vec3(0.035,0.19,0.28),vec3(0.10,0.43,0.53),wave*0.45+0.25);
    base+=vec3(0.26,0.34,0.31)*foam;
    specularScale=1.8;
  }else{
    float vegetationVariation=noise2(vWorldPosition.xz*0.42+identitySignal*19.0);
    base=mix(base*vec3(0.56,0.83,0.58),base*vec3(0.92,1.28,0.82),vegetationVariation);
    base*=0.78+0.34*clamp(geometricNormal.y,0.0,1.0);
  }

  float geometricDiffuse=max(dot(geometricNormal,lightDirection),0.0);
  float reliefDiffuse=max(dot(shadingNormal,lightDirection),0.0);
  float diffuse=geometricDiffuse;
  if(vRoleCode==1u){
    diffuse=mix(
      geometricDiffuse,
      reliefDiffuse,
      0.95*terrainReliefEnvelope
    );
    diffuse=clamp(
      diffuse,
      max(0.0,geometricDiffuse-0.28),
      min(1.0,geometricDiffuse+0.28)
    );
  }

  float geometricRim=pow(
    1.0-max(dot(geometricNormal,viewDirection),0.0),
    2.2
  );
  float reliefRim=pow(
    1.0-max(dot(shadingNormal,viewDirection),0.0),
    2.2
  );
  float rim=vRoleCode==1u
    ?mix(
      geometricRim,
      reliefRim,
      0.85*terrainReliefEnvelope
    )
    :geometricRim;

  float specularExponent=vRoleCode==1u?18.0:24.0;
  float specular=pow(
    max(dot(shadingNormal,halfDirection),0.0),
    specularExponent
  )*specularScale;

  float specularLightingGain=vRoleCode==1u
    ?mix(0.07,0.14,terrainReliefEnvelope)
    :(vRoleCode==2u?0.36:0.07);

  float ambient=
    0.26+
    0.16*clamp(geometricNormal.y,0.0,1.0)+
    0.05*materialSignal;
  float directional=
    diffuse*
    uSunIntensity*
    (vRoleCode==1u?0.90:(vRoleCode==2u?0.74:0.82));
  vec3 lit=base*(ambient+directional)*uSunColor;
  lit+=base*rim*(vRoleCode==1u?0.18:0.10);
  lit+=uSunColor*specular*specularLightingGain;

  float rawFog=clamp((distanceToCamera-uFogStartDistance)*max(uFogFalloff,0.00001),0.0,uMaximumFogFactor);
  float fog=rawFog*(vRoleCode==1u?0.54:0.68);
  float luminance=dot(lit,vec3(0.2126,0.7152,0.0722));
  lit=mix(lit,vec3(luminance),clamp(fog*uDistanceDesaturationStrength*0.48,0.0,0.58));
  vec3 atmosphere=mix(uSkyHorizonColor,uSkyZenithColor,clamp(geometricNormal.y*0.5+0.5,0.0,1.0));
  vec3 haze=mix(uGroundHazeColor,atmosphere,0.44);
  lit=mix(lit,haze,fog*0.48);
  if(vRoleCode==1u){
    lit*=mix(1.0,0.76,clamp(presentationContact,0.0,1.0));
    lit+=base*clamp(presentationHighlight,0.0,1.0)*0.038;
  }
  lit=pow(clamp(lit*1.12,0.0,1.0),vec3(1.0/2.2));
  outColor=vec4(lit,outputAlpha);
}`;

const DVS = `#version 300 es
precision highp float;
const vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));
out vec2 vUv;
void main(){vec2 q=p[gl_VertexID];vUv=q*.5+.5;gl_Position=vec4(q,0.,1.);}`;
const DFS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uDepth;
out vec4 outColor;
void main(){float d=texture(uDepth,vUv).r,v=clamp((1.-d)*28.,0.,1.);outColor=vec4(vec3(v),1.);}`;

export function createHEarthRun8ER3CPersistentRenderer({ canvas, width = 640, height = 360 } = {}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('R3C_CANVAS_REQUIRED');
  canvas.width = width;
  canvas.height = height;
  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: true, stencil: false,
    preserveDrawingBuffer: true, powerPreference: 'high-performance'
  });
  if (!gl) throw new Error('R3C_WEBGL2_CONTEXT_UNAVAILABLE');
  let initialized = false;
  const counters = {
    contextCreationCount: 1, shaderCreateCount: 0, shaderCompileCount: 0,
    programCreateCount: 0, programLinkCount: 0, vertexArrayCreateCount: 0,
    bufferCreateCount: 0, bufferUploadCount: 0, uploadedByteLength: 0,
    textureCreateCount: 0, framebufferCreateCount: 0,
    postInitializationResourceCreationCount: 0, postInitializationBufferUploadCount: 0,
    frameCount: 0, visiblePresentationCount: 0, colorReadbackCount: 0,
    depthReadbackCount: 0, pngEncodingCount: 0, gpuFinishCount: 0,
    cameraUniformUpdateCount: 0, staticUniformUpdateCount: 0,
    geometryDrawCallCount: 0, totalDrawnIndexCount: 0,
    depthVisualizationDrawCallCount: 0
  };
  const resources = {};
  const markPostInitializationCreation = () => {
    if (initialized) counters.postInitializationResourceCreationCount += 1;
  };
  const createShader = (type, source, label) => {
    markPostInitializationCreation(); counters.shaderCreateCount += 1;
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`R3C_SHADER_CREATE_FAILED:${label}`);
    gl.shaderSource(shader, source); gl.compileShader(shader); counters.shaderCompileCount += 1;
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`R3C_SHADER_COMPILE_FAILED:${label}:${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  };
  const createProgram = (vertexShader, fragmentShader, label) => {
    markPostInitializationCreation(); counters.programCreateCount += 1;
    const program = gl.createProgram();
    if (!program) throw new Error(`R3C_PROGRAM_CREATE_FAILED:${label}`);
    gl.attachShader(program, vertexShader); gl.attachShader(program, fragmentShader);
    gl.linkProgram(program); counters.programLinkCount += 1;
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`R3C_PROGRAM_LINK_FAILED:${label}:${gl.getProgramInfoLog(program)}`);
    }
    return program;
  };
  const createBuffer = () => {
    markPostInitializationCreation(); counters.bufferCreateCount += 1;
    const buffer = gl.createBuffer(); if (!buffer) throw new Error('R3C_BUFFER_CREATE_FAILED');
    return buffer;
  };
  const upload = (target, data) => {
    if (initialized) counters.postInitializationBufferUploadCount += 1;
    counters.bufferUploadCount += 1; counters.uploadedByteLength += data.byteLength;
    gl.bufferData(target, data, gl.STATIC_DRAW);
  };
  const createTexture = () => {
    markPostInitializationCreation(); counters.textureCreateCount += 1;
    const texture = gl.createTexture(); if (!texture) throw new Error('R3C_TEXTURE_CREATE_FAILED');
    return texture;
  };
  const createFramebuffer = () => {
    markPostInitializationCreation(); counters.framebufferCreateCount += 1;
    const framebuffer = gl.createFramebuffer(); if (!framebuffer) throw new Error('R3C_FRAMEBUFFER_CREATE_FAILED');
    return framebuffer;
  };
  const uniform = (program, name) => {
    const location = gl.getUniformLocation(program, name);
    if (location === null) throw new Error(`R3C_UNIFORM_MISSING:${name}`);
    return location;
  };
  const requireCompleteFramebuffer = (label) => {
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) throw new Error(`R3C_FRAMEBUFFER_INCOMPLETE:${label}:${status}`);
  };
  const renderPackage = getHEarthRun8ER2CanonicalLiveRenderPackage();
  const uploadViews = createHEarthRun8ER2DCanonicalGPUUploadViews(renderPackage);
  const rendererInterface = getHEarthRun8ER3ALiveRendererInterface();
  if (renderPackage.packageIdentity !== RUNTIME_ID) throw new Error(`R3C_RUNTIME_PACKAGE_IDENTITY_MISMATCH:${renderPackage.packageIdentity}`);
  if (uploadViews.deterministicTransportEncoding !== true) throw new Error('R3C_CANONICAL_GPU_TRANSPORT_MISSING');

  function initialize(packet) {
    if (initialized) throw new Error('R3C_RENDERER_ALREADY_INITIALIZED');
    if (packet.packageIdentity !== renderPackage.packageIdentity || packet.packageContentDigest !== renderPackage.contentDigest) {
      throw new Error('R3C_INITIAL_PACKET_PACKAGE_MISMATCH');
    }
    resources.geometryVertexShader = createShader(gl.VERTEX_SHADER, VS, 'GV');
    resources.geometryFragmentShader = createShader(gl.FRAGMENT_SHADER, FS, 'GF');
    resources.geometryProgram = createProgram(resources.geometryVertexShader, resources.geometryFragmentShader, 'GP');
    resources.depthVertexShader = createShader(gl.VERTEX_SHADER, DVS, 'DV');
    resources.depthFragmentShader = createShader(gl.FRAGMENT_SHADER, DFS, 'DF');
    resources.depthProgram = createProgram(resources.depthVertexShader, resources.depthFragmentShader, 'DP');
    markPostInitializationCreation(); counters.vertexArrayCreateCount += 1;
    resources.vertexArray = gl.createVertexArray();
    if (!resources.vertexArray) throw new Error('R3C_VERTEX_ARRAY_CREATE_FAILED');
    gl.bindVertexArray(resources.vertexArray);
    const specifications = [
      ['positions', uploadViews.positions, 0, 3, gl.FLOAT, false],
      ['normals', uploadViews.normals, 1, 3, gl.FLOAT, false],
      ['baseColorsLinear', uploadViews.baseColorsLinear, 2, 4, gl.FLOAT, false],
      ['materialParameters', uploadViews.materialParameters, 3, 4, gl.FLOAT, false],
      ['materialModelCodes', uploadViews.materialModelCodes, 4, 1, gl.UNSIGNED_BYTE, true],
      ['surfaceClassCodes', uploadViews.surfaceClassCodes, 5, 1, gl.UNSIGNED_BYTE, true],
      ['primitiveIndices', uploadViews.primitiveIndices, 6, 1, gl.UNSIGNED_SHORT, true],
      ['roleCodes', uploadViews.roleCodes, 7, 1, gl.UNSIGNED_BYTE, true]
    ];
    resources.buffers = [];
    for (const [name, data, location, size, type, integer] of specifications) {
      const buffer = createBuffer(); resources.buffers.push({ name, buffer, byteLength: data.byteLength });
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer); upload(gl.ARRAY_BUFFER, data); gl.enableVertexAttribArray(location);
      if (integer) gl.vertexAttribIPointer(location, size, type, 0, 0);
      else gl.vertexAttribPointer(location, size, type, false, 0, 0);
    }
    resources.indexBuffer = createBuffer();
    resources.buffers.push({ name: 'indices', buffer: resources.indexBuffer, byteLength: uploadViews.indices.byteLength });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resources.indexBuffer); upload(gl.ELEMENT_ARRAY_BUFFER, uploadViews.indices);
    resources.colorTexture = createTexture(); resources.depthTexture = createTexture(); resources.geometryFramebuffer = createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, resources.colorTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, resources.depthTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.NONE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resources.colorTexture, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, resources.depthTexture, 0);
    requireCompleteFramebuffer('GEOMETRY');
    resources.depthColorTexture = createTexture(); resources.depthFramebuffer = createFramebuffer();
    gl.bindTexture(gl.TEXTURE_2D, resources.depthColorTexture); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.depthFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, resources.depthColorTexture, 0);
    requireCompleteFramebuffer('DEPTH');
    resources.uniforms = {
      viewProjection: uniform(resources.geometryProgram, 'uViewProjection'), cameraPosition: uniform(resources.geometryProgram, 'uCameraPosition'),
      sunDirection: uniform(resources.geometryProgram, 'uSunDirection'), sunIntensity: uniform(resources.geometryProgram, 'uSunIntensity'),
      sunColor: uniform(resources.geometryProgram, 'uSunColor'), skyZenithColor: uniform(resources.geometryProgram, 'uSkyZenithColor'),
      skyHorizonColor: uniform(resources.geometryProgram, 'uSkyHorizonColor'), groundHazeColor: uniform(resources.geometryProgram, 'uGroundHazeColor'),
      fogStartDistance: uniform(resources.geometryProgram, 'uFogStartDistance'), fogFalloff: uniform(resources.geometryProgram, 'uFogFalloff'),
      maximumFogFactor: uniform(resources.geometryProgram, 'uMaximumFogFactor'),
      distanceDesaturationStrength: uniform(resources.geometryProgram, 'uDistanceDesaturationStrength'), depth: uniform(resources.depthProgram, 'uDepth')
    };
    const environment = packet.environmentUniforms;
    resources.skyColor = color3(environment.skyHorizonColor).map((value, index) => Math.min(1, value * (index === 2 ? 0.92 : 0.88)));
    resources.clearColorBytes = resources.skyColor.map((entry) => Math.round(entry * 255));
    gl.useProgram(resources.geometryProgram);
    gl.uniform3f(resources.uniforms.sunDirection, environment.sunDirection.x, environment.sunDirection.y, environment.sunDirection.z);
    gl.uniform1f(resources.uniforms.sunIntensity, environment.sunIntensity); gl.uniform3fv(resources.uniforms.sunColor, color3(environment.sunColor));
    gl.uniform3fv(resources.uniforms.skyZenithColor, color3(environment.skyZenithColor)); gl.uniform3fv(resources.uniforms.skyHorizonColor, resources.skyColor);
    gl.uniform3fv(resources.uniforms.groundHazeColor, color3(environment.groundHazeColor)); gl.uniform1f(resources.uniforms.fogStartDistance, environment.fogStartDistance);
    gl.uniform1f(resources.uniforms.fogFalloff, environment.fogFalloff); gl.uniform1f(resources.uniforms.maximumFogFactor, environment.maximumFogFactor);
    gl.uniform1f(resources.uniforms.distanceDesaturationStrength, environment.distanceDesaturationStrength);
    counters.staticUniformUpdateCount = 10; initialized = true; return getResourceReceipt();
  }

  function renderFrame(packet) {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    if (packet.packageIdentity !== renderPackage.packageIdentity || packet.packageContentDigest !== renderPackage.contentDigest) throw new Error('R3C_FRAME_PACKET_PACKAGE_MISMATCH');
    if (!Array.isArray(packet.camera.viewProjectionMatrix) || packet.camera.viewProjectionMatrix.length !== 16 || packet.camera.viewProjectionMatrix.some((value) => !finite(value))) throw new Error('R3C_VIEW_PROJECTION_INVALID');
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer); gl.viewport(0, 0, width, height);
    gl.clearColor(...resources.skyColor, 1); gl.clearDepth(1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE); gl.useProgram(resources.geometryProgram); gl.bindVertexArray(resources.vertexArray);
    gl.uniformMatrix4fv(resources.uniforms.viewProjection, false, new Float32Array(packet.camera.viewProjectionMatrix));
    gl.uniform3f(resources.uniforms.cameraPosition, packet.camera.position.x, packet.camera.position.y, packet.camera.position.z);
    counters.cameraUniformUpdateCount += 2;
    for (const range of packet.drawRanges) {
      if (range.transparencyClass === 'TRANSLUCENT') {
        gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
      } else { gl.disable(gl.BLEND); gl.depthMask(true); }
      gl.drawElements(gl.TRIANGLES, range.indexCount, gl.UNSIGNED_INT, range.indexStart * 4);
      counters.geometryDrawCallCount += 1; counters.totalDrawnIndexCount += range.indexCount;
    }
    gl.depthMask(true); gl.disable(gl.BLEND);
    const error = gl.getError(); if (error !== gl.NO_ERROR) throw new Error(`R3C_DRAW_ERROR:${error}`);
    counters.frameCount += 1;
  }
  function presentColorFrame() {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, resources.geometryFramebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.COLOR_BUFFER_BIT,gl.NEAREST); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    counters.visiblePresentationCount += 1; return Object.freeze({ frameNumber: counters.frameCount, width, height });
  }
  function captureColorFrame(label, { includePng = true } = {}) {
    if (!initialized) throw new Error('R3C_RENDERER_NOT_INITIALIZED');
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.geometryFramebuffer); gl.finish(); counters.gpuFinishCount += 1;
    const pixels = new Uint8Array(width * height * 4); gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels); counters.colorReadbackCount += 1;
    const summary = summarize(pixels, resources.clearColorBytes);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, resources.geometryFramebuffer); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0,0,width,height,0,0,width,height,gl.COLOR_BUFFER_BIT,gl.NEAREST); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const pngDataUrl = includePng ? canvas.toDataURL('image/png') : null; if (includePng) counters.pngEncodingCount += 1;
    return Object.freeze({ label, frameNumber: counters.frameCount, width, height, summary, pngDataUrl });
  }
  function captureDepthSummary() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, resources.depthFramebuffer); gl.viewport(0,0,width,height); gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.useProgram(resources.depthProgram); gl.bindVertexArray(null); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, resources.depthTexture);
    gl.uniform1i(resources.uniforms.depth,0); gl.drawArrays(gl.TRIANGLES,0,3); counters.depthVisualizationDrawCallCount += 1; gl.finish(); counters.gpuFinishCount += 1;
    const pixels = new Uint8Array(width*height*4); gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels); counters.depthReadbackCount += 1;
    return summarize(pixels,[0,0,0]);
  }
  function getResourceReceipt() {
    const debugRenderer = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
      presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID,
      presentationProfile: {
        terrainScaleCues: true, slopeReadability: true, routeContainment: true,
        manorSiteDifferentiation: true, cavernExteriorRelationDifferentiation: true,
        sharedMacroFrequencyCorrection: true,
        lawfulSlopeCurvatureModulation: true,
        boundedContactDepthReinforcement: true,
        temporallyStableWorldSpaceVariation: true,
        regressionColorDiversityRestoration: true,
        cavernNearThresholdReinforcement: true,
        geometryMutation: false, terrainMutation: false, placementMutation: false,
        cameraMutation: false, touchMutation: false
      },
      initialized, dimensions: { width, height },
      context: {
        created: true, lost: gl.isContextLost(), vendor: gl.getParameter(gl.VENDOR), renderer: gl.getParameter(gl.RENDERER),
        unmaskedVendor: debugRenderer ? gl.getParameter(debugRenderer.UNMASKED_VENDOR_WEBGL) : null,
        unmaskedRenderer: debugRenderer ? gl.getParameter(debugRenderer.UNMASKED_RENDERER_WEBGL) : null,
        version: gl.getParameter(gl.VERSION), shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      },
      package: {
        logicalPromotedIdentity: LOGICAL_ID, runtimeIdentity: renderPackage.packageIdentity, runtimeContentDigest: renderPackage.contentDigest,
        primitiveCount: renderPackage.primitiveCount, vertexCount: renderPackage.vertexCount, triangleCount: renderPackage.triangleCount,
        indexCount: renderPackage.indexCount, drawRangeCount: renderPackage.drawRanges.length,
        canonicalGpuTransport: uploadViews.deterministicTransportEncoding === true
      },
      rendererInterface: {
        contractId: rendererInterface.contractId, attributeCount: rendererInterface.attributeLayout.length,
        uniformCount: rendererInterface.frameUniformNames.length, drawRangeCount: rendererInterface.drawRanges.length
      },
      counters: { ...counters },
      persistentObjectCounts: { contexts: 1, programs: 2, shaders: 4, vertexArrays: 1, gpuBuffers: resources.buffers?.length ?? 0, textures: 3, framebuffers: 2 },
      resourceIdentityStable: initialized && resources.buffers?.length === 9 && Boolean(resources.geometryProgram && resources.depthProgram && resources.vertexArray && resources.geometryFramebuffer && resources.depthFramebuffer),
      packageUploadedOnce: counters.bufferUploadCount === 9 && counters.postInitializationBufferUploadCount === 0,
      noPostInitializationResourceCreation: counters.postInitializationResourceCreationCount === 0,
      noPostInitializationBufferUpload: counters.postInitializationBufferUploadCount === 0
    };
  }
  return Object.freeze({
    rendererId: H_EARTH_RUN_8E_R3C_RENDERER_ID,
    presentationProfileId: H_EARTH_GRATITUDE_REGION_CP2_PRESENTATION_PROFILE_ID,
    initialize, renderFrame, presentColorFrame, captureColorFrame, captureDepthSummary, getResourceReceipt
  });
}
export default createHEarthRun8ER3CPersistentRenderer;
