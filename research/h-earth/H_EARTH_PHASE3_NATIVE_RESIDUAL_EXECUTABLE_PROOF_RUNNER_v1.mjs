import {runHEarthPhase3NativeResidualProof} from '../../h-earth-3d/terrain/h-earth.phase3-native-residual-field.proof.js';
const receipt=runHEarthPhase3NativeResidualProof();
console.log(JSON.stringify(receipt,null,2));
if(receipt.pass!==true)process.exitCode=1;
