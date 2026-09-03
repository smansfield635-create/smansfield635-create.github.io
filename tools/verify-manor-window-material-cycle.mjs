import assert from 'node:assert/strict';
import fs from 'node:fs';
import { auditStainedGlassWindowRefinement, CONTRACT, RULES } from '../assets/manor-blueprint/manor.estate.window-stained-glass-v1.mjs';

const house=fs.readFileSync('assets/compass/compass.house-scene.js','utf8');
const audit=auditStainedGlassWindowRefinement();

assert.equal(CONTRACT,'MIRROR_MANOR_PHASE3_STAINED_GLASS_WINDOW_REFINEMENT_v1');
assert.equal(audit.phase3Static,true,'Phase 3 baseline must remain valid');
assert.equal(audit.windowCount,14,'All 14 owned windows must receive the unified glass treatment');
assert.equal(audit.litWindowCount,3,'Exactly three feature windows may carry restrained interior light');
assert.equal(audit.allOwned,true);
assert.equal(audit.selective,true);
assert.equal(audit.onlyWindowRoles,true);
assert.equal(audit.passStatic,true);
assert.equal(RULES.preservePhase3Geometry,true);
assert.equal(RULES.preserveSilhouette,true);
assert.equal(RULES.preserveRoofMasses,true);
assert.equal(RULES.preserveFacadeMaterials,true);
assert.equal(RULES.windowSubsystemOnly,true);
assert.equal(RULES.noPortalMutation,true);
assert.ok(house.includes("MIRROR_MANOR_PHASE3_STAINED_GLASS_WINDOW_REFINEMENT_v1"));
assert.ok(house.includes("import('/assets/manor-blueprint/manor.estate.window-stained-glass-v1.mjs')"));
assert.ok(!house.includes("import('/assets/manor-blueprint/manor.estate.gothic-detail-phase4.mjs')"),'Phase 4 dark reveal geometry must not remain in the candidate renderer');
assert.ok(house.includes("brightness(1.24) saturate(.96) contrast(1.12)"),'Phase 3 display material baseline must be restored');
assert.ok(house.includes("vLight=.54+.40*key+.10*side"),'Phase 3 facade lighting baseline must be restored');
assert.ok(house.includes("[.15,.16,.19]"),'Phase 3 roof material baseline must be restored');
assert.ok(house.includes("[.43,.42,.41]"),'Phase 3 facade material baseline must be restored');
assert.ok(house.includes('const CAROUSEL_DISTANCE=44;'));
assert.ok(house.includes('const CAROUSEL_TARGET=Object.freeze([0,8.4,1]);'));

const receipt={schema:'MIRROR_MANOR_BOUNDED_WINDOW_MATERIAL_CYCLE_STATIC_RECEIPT_v1',baseline:'a198ac146882d54d23a2f1e9916d5eaf515805bb',contract:CONTRACT,audit,result:'PASS_CLOSED'};
console.log(JSON.stringify(receipt,null,2));
