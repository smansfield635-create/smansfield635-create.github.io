import {buildFAP1GPUWeatherPacket} from './fap1-gpu-weather-descriptors.mjs';
import {buildFAP1SpatialWeatherObjects} from './fap1-spatial-lod.gb.mjs';
import {evaluateMacroLocalContinuity,verifyMacroLocalContinuity} from './fap1-w5-overlap-continuity.gb.mjs';
const packet=buildFAP1GPUWeatherPacket({canonicalTimeHours:0});
const objects=buildFAP1SpatialWeatherObjects({canonicalTimeHours:0,packet});
const receipts=objects.map(object=>{const receipt=evaluateMacroLocalContinuity(object,{canonicalTimeHours:0});const verification=verifyMacroLocalContinuity(receipt);return{weatherId:object.ID_i,weatherClass:object.weatherClass,genus:object.W_i.genus,receipt,verification};});
const summary={schema:'FAP1_W5_OVERLAP_CONTINUITY_EXECUTION_v2',candidateHead:'254fdec4a5d42aad4d959ea33a778786604a6f87',canonicalTimeHours:0,systemCount:receipts.length,pass:receipts.every(x=>x.receipt.pass&&x.verification.pass),eligibleCount:receipts.filter(x=>x.receipt.pass&&x.verification.pass).length,heldCount:receipts.filter(x=>!(x.receipt.pass&&x.verification.pass)).length,receipts};
console.log(JSON.stringify(summary,null,2));
if(!summary.pass)process.exitCode=2;
