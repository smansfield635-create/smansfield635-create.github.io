import fs from 'node:fs';
import path from 'node:path';

export const AUDRALIA_GESTURE_RESPONSE_ADAPTER_SCHEMA='AUDRALIA_GESTURE_RESPONSE_ADAPTER_v1';

const read=(root,relative)=>fs.readFileSync(path.join(root,relative),'utf8');
const has=(text,fragment)=>text.includes(fragment);

export function evaluateAudraliaConstruction(root=process.cwd()){
  const rendererPath='showroom/globe/audralia/renderer-continuous-travel-v1.mjs';
  const appPath='showroom/globe/audralia/weather-presentation-reconciliation/app.mjs';
  const indexPath='showroom/globe/audralia/index.html';
  const renderer=read(root,rendererPath);
  const app=read(root,appPath);
  const index=read(root,indexPath);

  const checks={
    rendererSuccessorPresent:has(renderer,"AUDRALIA_CONTINUOUS_TRAVEL_RENDERER_v1"),
    immutable24057BaselineBound:has(renderer,"/inspection/audralia-24057-exact/snapshot/showroom/globe/h-earth/terrain-estate-construction-v1/renderer.mjs?cb=EXACT_24057"),
    obsoleteCapUsedOnlyAsIdentityInput:has(renderer,"const TARGET_CAP = 'const MAX_TARGET_ARC=PLANET_RADIUS*Math.PI*.9;';")&&has(renderer,"if (source.includes('MAX_TARGET_ARC')) throw new Error('AUDRALIA_CONTINUOUS_TRAVEL_HARD_CAP_SURVIVED_TRANSFORM')"),
    periodicTargetNormalizationPresent:has(renderer,"const TARGET_PERIOD = 'const TARGET_PERIOD=PLANET_RADIUS*Math.PI*2;';")&&has(renderer,'radius%TARGET_PERIOD'),
    infiniteCapNotUsed:!has(renderer,'Number.POSITIVE_INFINITY'),
    singleRendererPassDeclared:has(renderer,'rendererCount: 1')&&has(renderer,'renderPassCount: 1'),
    localAppUsesSuccessor:has(app,"../renderer-continuous-travel-v1.mjs"),
    localAppNoHEarthRendererImport:!has(app,"../../h-earth/terrain-estate-construction-v1/renderer.mjs"),
    liveIndexUsesLocalApp:has(index,'./weather-presentation-reconciliation/app.mjs?cb=AUDRALIA_CONTINUOUS_TRAVEL_v1'),
    liveIndexPreloadsSuccessor:has(index,'./renderer-continuous-travel-v1.mjs?cb=AUDRALIA_CONTINUOUS_TRAVEL_v1'),
    focusPrimary:has(index,'audralia-live-action-primary')&&has(index,'data-fit-world>focus Gratitude</button>'),
    soundtrackUtilityPresent:has(index,'data-audralia-soundtrack-toggle'),
    returnToCompassSingle:((index.match(/data-return-to-compass/g)||[]).length===1)&&has(index,'>Return to Compass</a>'),
    hEarthTopNavRemoved:!has(index,'>H-Earth · Play</a>'),
    mirrorlandTopNavRemoved:!has(index,'>Mirrorland</a>'),
    oneFingerLookPreserved:has(app,"if(pointers.size===1){renderer.orbit"),
    twoFingerTravelPreserved:has(app,"gesture.mode='TRAVEL'")&&has(app,'renderer.panScreen'),
    pinchSpreadPreserved:has(app,"gesture.mode='ZOOM'")&&has(app,'renderer.zoomByFactor')
  };
  const failures=Object.entries(checks).filter(([,pass])=>!pass).map(([id])=>id);
  return Object.freeze({schema:AUDRALIA_GESTURE_RESPONSE_ADAPTER_SCHEMA,pass:failures.length===0,checks:Object.freeze(checks),failures:Object.freeze(failures)});
}

export function evaluateContinuousTravelModel({planetRadius=6200,steps=160,stepDistance=180}={}){
  let u=0,v=0;
  const positions=[];
  for(let i=0;i<steps;i++){
    v+=stepDistance;
    const radius=Math.hypot(u,v);
    const circumference=planetRadius*Math.PI*2;
    if(radius>circumference){const wrapped=radius%circumference,scale=wrapped/(radius||1);u*=scale;v*=scale;}
    positions.push(Math.hypot(u,v));
  }
  const oldCap=planetRadius*Math.PI*.9;
  const antipode=planetRadius*Math.PI;
  const crossedOldCap=positions.some(r=>r>oldCap+stepDistance*.25);
  const crossedAntipode=positions.some(r=>r>antipode+stepDistance*.25);
  const postAntipode=positions.filter(r=>r>antipode+stepDistance*.25);
  const postAntipodeMotion=postAntipode.length>=8&&postAntipode.slice(1,8).every((r,i)=>Math.abs(r-postAntipode[i])>1e-6);
  return Object.freeze({pass:crossedOldCap&&crossedAntipode&&postAntipodeMotion,crossedOldCap,crossedAntipode,postAntipodeMotion,oldCap,antipode,finalRadius:positions.at(-1)});
}
