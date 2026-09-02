import crypto from 'node:crypto';
import {
  AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,
  AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER,
  resolveAudraliaGratitudeShorelineZ,
  sampleAudraliaGratitudeTerrain
} from '../../../h-earth-3d/integration/audralia.gratitude-geographic-transfer.v1.js';
import {
  GRATITUDE_DEVELOPMENT_FRAME,
  resolveSiteAnchor,
  worldToMap
} from '../../../characters/gratitude-geography.adapter.mjs';
import {
  STEP9_DESTINATION_BINDINGS,
  resolveStep9Site,
  step9MapPosition,
  step9ShorelineZ
} from '../../../characters/step9-regional-geography.mjs';

const near=(a,b,t=1e-9)=>Math.abs(a-b)<=t;
const issues=[];
const landmarks=[];
for(const [destinationId,binding] of Object.entries(STEP9_DESTINATION_BINDINGS)){
  const characters=resolveStep9Site(binding.siteId);
  const shared=resolveSiteAnchor(binding.siteId);
  const map=step9MapPosition(binding.siteId);
  const sharedMap=worldToMap(shared.world,{clampToFrame:true});
  const terrain=sampleAudraliaGratitudeTerrain(shared.world.x,shared.world.z);
  const exact=near(characters.world.x,shared.world.x)&&near(characters.world.y,shared.world.y)&&near(characters.world.z,shared.world.z)&&near(map.leftPercent,sharedMap.u*100)&&near(map.topPercent,sharedMap.v*100)&&terrain.valid===true&&terrain.geographyAuthority===AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID;
  if(!exact)issues.push(`LANDMARK_DIVERGENCE:${destinationId}:${binding.siteId}`);
  landmarks.push({destinationId,siteId:binding.siteId,role:binding.role,charactersWorld:characters.world,hEarthWorld:shared.world,audraliaTransferWorld:terrain.world,map:{characters:{leftPercent:map.leftPercent,topPercent:map.topPercent},shared:{leftPercent:sharedMap.u*100,topPercent:sharedMap.v*100}},exact});
}
const shorelineXs=[-1050,-768,-512,-256,0,256,512,768,1050];
const shoreline=shorelineXs.map(x=>{const characters=step9ShorelineZ(x),shared=resolveAudraliaGratitudeShorelineZ(x),exact=near(characters,shared);if(!exact)issues.push(`SHORELINE_DIVERGENCE:${x}`);return{x,characters,hEarthAudralia:shared,exact};});
if(AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.contractId!==AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID)issues.push('TRANSFER_CONTRACT_ID_DRIFT');
if(AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.worldLaw!=='ONE_WORLD_ONE_GEOGRAPHY_MULTIPLE_SCALES_OF_ACCESS')issues.push('WORLD_LAW_DRIFT');
const receipt={schema:'CHARACTERS_STEP10_CROSS_ENVIRONMENT_GEOGRAPHY_RECEIPT_v1',result:issues.length?'FAIL':'PASS',geographyAuthority:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER_CONTRACT_ID,worldIdentity:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.worldIdentity,continentIdentity:AUDRALIA_GRATITUDE_GEOGRAPHIC_TRANSFER.continentIdentity,scaleContract:{audralia:'PLANETARY',characters:'REGIONAL_DISCOVERY',hEarth:'GROUND_TRAVERSAL'},regionalFrame:GRATITUDE_DEVELOPMENT_FRAME.frameId,landmarkCount:landmarks.length,landmarks,shoreline,issues};
receipt.receiptSha256=crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
console.log(JSON.stringify(receipt,null,2));
if(issues.length)process.exit(1);
