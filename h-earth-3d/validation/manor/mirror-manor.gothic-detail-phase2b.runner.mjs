import { auditPhase2B, DORMER_SEATING } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase2b.mjs';
const a=auditPhase2B();
if(!a.passStatic) throw new Error(`Phase 2B static gate failed: ${JSON.stringify(a)}`);
if(a.dormerCount!==2||a.curbMeshCount!==8||!a.edgeHeightsValid||!a.levelWallPlate) throw new Error('Phase 2B dormer seating contract incomplete');
for(const d of DORMER_SEATING){if(!(d.rearBase>d.frontBase&&d.topY>d.rearBase))throw new Error(`Invalid dormer seating ${d.id}`);}
console.log(JSON.stringify({verdict:'PASS_PHASE2B_STATIC_DORMER_ROOF_SEATING',...a},null,2));
