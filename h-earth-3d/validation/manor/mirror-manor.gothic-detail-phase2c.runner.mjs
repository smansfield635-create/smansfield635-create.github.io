import { auditPhase2C } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase2c.mjs';
const a=auditPhase2C();
if(!a.passStatic){console.error(JSON.stringify(a,null,2));process.exit(1);}console.log(JSON.stringify(a,null,2));
