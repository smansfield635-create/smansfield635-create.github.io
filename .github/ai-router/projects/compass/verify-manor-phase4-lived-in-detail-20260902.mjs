import assert from 'node:assert/strict';
import { auditPhase4, buildPhase4DetailMesh, CONTRACT, RULES } from '../../../assets/manor-blueprint/manor.estate.gothic-detail-phase4.mjs';

const audit=auditPhase4();
const mesh=buildPhase4DetailMesh();

assert.equal(CONTRACT,'MIRROR_MANOR_GOTHIC_ARCHITECTURAL_DETAIL_PHASE4_LIVED_IN_v1');
assert.equal(audit.phase3Static,true,'Phase 3 parent must remain statically valid');
assert.equal(audit.windowRevealCount,14,'All 14 owned surround bays must receive recessed window depth');
assert.equal(audit.interiorLightCount,7,'Exactly seven owned windows must receive warm interior-light planes');
assert.ok(audit.portalRevealCount>0,'Owned portals must receive recessed depth geometry');
assert.equal(audit.bounded,true,'Phase 4 additions must remain bounded to owned apertures');
assert.equal(audit.selective,true,'Interior illumination must remain selective rather than lighting every window');
assert.equal(audit.preserved,true,'27-unit principal span and canonical 94-unit environment camera must remain preserved');
assert.equal(audit.passStatic,true,'Phase 4 static audit must pass');
assert.equal(RULES.preserveSilhouette,true);
assert.equal(RULES.preserveRoofMasses,true);
assert.equal(RULES.noNewBuildings,true);
assert.equal(RULES.noSculpture,true);
assert.equal(RULES.noGargoyles,true);
assert.ok(mesh.livedIn.every(m=>['recessed-window-reveal','interior-window-light','recessed-portal-reveal'].includes(m.role)),'No unowned Phase 4 geometry may be introduced');

console.log(JSON.stringify({contract:CONTRACT,audit,phase4GeometryCount:mesh.livedIn.length},null,2));
