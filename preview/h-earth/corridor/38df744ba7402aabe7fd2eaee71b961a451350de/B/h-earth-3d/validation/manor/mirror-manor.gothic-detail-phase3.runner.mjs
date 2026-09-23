import { auditPhase3 } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase3.mjs';
const a=auditPhase3();
const required=['phase2cStatic','surroundsOwned','setbacksOwned','archivoltsOwned','bounded','preserved','noForbidden','passStatic'];
const failed=required.filter(k=>a[k]!==true);
console.log(JSON.stringify(a,null,2));
if(failed.length){console.error(`PHASE3_FAIL: ${failed.join(', ')}`);process.exit(1);}
console.log('PHASE3_PASS: controlled higher-order Gothic enrichment remains owned and bounded');
