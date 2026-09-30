const POLICY_ID='AUDRALIA_ATMOSPHERIC_CLOUD_FIDELITY_ACF1_v3';
const nativeShaderSource=WebGL2RenderingContext.prototype.shaderSource;
let patchedCloudFragmentShaders=0;
let rejectedShaderMutations=0;

function patchCloudFragmentShader(source){
  if(typeof source!=='string'||!source.includes('globalCloudSupport')||!source.includes('morphology(')||!source.includes('densityAt(')||!source.includes('uSysA[8]'))return source;
  let next=source;

  next=next.replace(
    /float r=length\(xy\);\s*float edge=1\.0-smoothstep\(\.74,1\.10,r\);/,
    `float angle=atan(xy.y,xy.x);\n  float boundary=1.0\n    +.16*sin(angle*3.0+seed*17.0)\n    +.09*sin(angle*5.0-seed*29.0)\n    +.055*sin(angle*9.0+seed*41.0);\n  float r=length(xy)/max(boundary,.70);\n  float edge=1.0-smoothstep(.60,1.035,r);`
  );

  next=next.replace(
    /float clearSlot=\.64\+\.36\*\(1\.0-smoothstep\(\.72,\.93,clearWave\)\);\s*float climate=([^;]+);\s*return clamp\(climate\*broken\*clearSlot\*\.38,0\.0,\.34\);/,
    `float synoptic=.5+.5*sin(lon*.71+lat*1.83-t*.13+sin(lon*1.7-lat*.9)*.82);\n  float clearSlot=.13+.87*(1.0-smoothstep(.52,.81,clearWave));\n  clearSlot*=.24+.76*(1.0-smoothstep(.63,.91,synoptic));\n  float climate=$1;\n  float organized=smoothstep(.46,.74,broad*.70+detail*.30);\n  float secondary=smoothstep(.43,.67,broad*.58+detail*.42);\n  float field=max(broken*.86,max(organized*.70,secondary*.48));\n  return clamp(climate*field*clearSlot*.27,0.0,.26);`
  );

  next=next.replace(
    /if\(length\(xy\)>1\.38\)continue;/,
    `float systemAngle=atan(xy.y,xy.x);\n    float systemWarp=1.0\n      +.18*sin(systemAngle*3.0+c.y*19.0)\n      +.10*sin(systemAngle*7.0-c.y*31.0)\n      +.10*(fbm(vec3(xy*3.6,c.y*23.0+uTimeHours*.004))-.5);\n    if(length(xy)>1.34*max(systemWarp,.70))continue;`
  );

  next=next.replace(
    'float den=shape*c.x;',
    'float organizedBoost=1.28+.34*c.w+.14*c.z; float den=shape*c.x*organizedBoost;'
  );

  next=next.replace(
    'vec3 dark=vec3(.40,.43,.48);',
    'vec3 dark=vec3(.26,.30,.36);'
  );
  next=next.replace(
    'col=mix(col,vec3(.84,.90,.98),cloudSample.y*.10);',
    'col=mix(col,vec3(.96,.985,1.0),cloudSample.y*.21);'
  );
  next=next.replace(
    'col+=vec3(1.0,.94,.82)*forward*.08;',
    'col+=vec3(1.0,.96,.86)*forward*.18; col*=1.0-.25*cloudSample.z;'
  );
  next=next.replace(
    'float a=1.0-exp(-den*stepLen*.021);',
    'float extinction=mix(.020,.032,smoothstep(.12,.74,den)); float a=1.0-exp(-den*stepLen*extinction);'
  );

  const changed=next!==source;
  if(changed)patchedCloudFragmentShaders++;
  else rejectedShaderMutations++;
  return next;
}

WebGL2RenderingContext.prototype.shaderSource=function(shader,source){
  return nativeShaderSource.call(this,shader,patchCloudFragmentShader(source));
};

Object.defineProperty(window,'__AUDRALIA_ACF1_PRESENTATION__',{value:Object.freeze({
  policyId:POLICY_ID,
  architecture:'PRESERVE_EXISTING_CLOUD_ENGINE_REVISE_PRESENTATION',
  landMutation:false,
  oceanMutation:false,
  cameraMutation:false,
  weatherAuthorityMutation:false,
  goals:Object.freeze({
    strongerClearAirGaps:true,
    irregularSystemBoundaries:true,
    restoredPlanetaryCloudOccupancy:true,
    brokenSecondaryCloudFields:true,
    reducedUniformBackgroundSupport:true,
    strongerOrganizedWeatherBodies:true,
    orbitalCloudLegibility:true,
    differentiatedCloudLighting:true,
    precipitationCoreDarkening:true,
    clearSkyDistinctFromCloudInterior:true
  }),
  getRuntimeEvidence:()=>Object.freeze({patchedCloudFragmentShaders,rejectedShaderMutations})
}),writable:false,configurable:false});
