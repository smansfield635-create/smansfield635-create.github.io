#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(here,n),'utf8'));
const map=read('donor-capability-map.v1.json');
const ledger=read('donor-noninheritance-ledger.v1.json');
const contract=read('binding-contract.v1.json');
let n=0;const ok=(x,m)=>{n++;if(!x)throw Error(`ASSERT_${n}:${m}`)};
ok(map.operation==='COMPASS_TESTS_ARCHITECTURE_BINDING_v1','operation');
ok(map.status==='FROZEN_ADMISSION_BINDING_CANDIDATE','status');
ok(map.records.length===9,'nine capabilities');
ok(JSON.stringify(map.records.map(x=>x.capabilityId))===JSON.stringify(['C01','C02','C03','C04','C05','C06','C07','C08','C09']),'capability ids');
for(const r of map.records){
 ok(['ADMIT_DIRECT','ADMIT_WITH_ADAPTER','WITHHOLD','UNRESOLVED'].includes(r.disposition),`${r.capabilityId} enum`);
 ok(['ADMIT_DIRECT','ADMIT_WITH_ADAPTER'].includes(r.disposition),`${r.capabilityId} admission gate`);
 ok(r.disposition==='ADMIT_WITH_ADAPTER',`${r.capabilityId} adapter required v1`);
 ok(r.requiredAdapter&&r.requiredAdapter!=='NONE',`${r.capabilityId} adapter named`);
 ok(r.destinationBinding.scientificStateMutationPermitted===false,`${r.capabilityId} no scientific mutation`);
 ok(Array.isArray(r.exactTransferUnit)&&r.exactTransferUnit.length>0,`${r.capabilityId} transfer unit`);
 ok(!r.exactTransferUnit.some(x=>/entire page|whole page|entire subsystem|whole subsystem|entire environment|whole environment/i.test(x)),`${r.capabilityId} bounded unit`);
 ok(Array.isArray(r.doNotInheritFromThisDonor)&&r.doNotInheritFromThisDonor.length>=10,`${r.capabilityId} semantic stripping`);
 ok(r.currentnessProof.currentnessDoesNotAuthorizeTransfer===true,`${r.capabilityId} currentness separation`);
}
ok(map.admissionGate.passes===true,'donor admission complete');
ok(map.admissionGate.constructionAuthorizedByPass===false,'admission does not construct');
const uw=map.withheldAlternatives.find(x=>x.donorId==='UNIVERSAL_COMPASS_PROTOTYPE');
ok(uw?.disposition==='WITHHOLD'&&uw?.role==='HISTORICAL_REFERENCE_ONLY','universal withheld');
for(const id of ['SHOWROOM_COMPASS','ARCHCOIN_COMPASS','H_EARTH_WORLD_NAVIGATION'])ok(map.withheldAlternatives.find(x=>x.donorId===id)?.disposition==='WITHHOLD',`${id} withheld`);
ok(ledger.donors.length===4,'four transferred donor ledgers');
for(const d of ledger.donors){ok(d.mechanicsOnly===true,`${d.donorId} mechanics only`);ok(d.prohibitedInheritance.length>=10,`${d.donorId} exclusions`)}
ok(contract.binding==='C(D,R,N)->P','binding equation');
for(const inv of ['DELTA_N_DOES_NOT_MUTATE_D','DELTA_N_DOES_NOT_MUTATE_R','DELTA_P_DOES_NOT_MUTATE_SCIENTIFIC_AUTHORITY','PRESENTATION_GEOMETRY_CANNOT_MANUFACTURE_SEMANTIC_STRUCTURE','DESTINATION_NOT_DONOR_DETERMINES_FOCUS_MEANING'])ok(contract.invariants.includes(inv),inv);
ok(JSON.stringify(contract.authorizedScope.layers)===JSON.stringify(['L_MINUS_1_ORIENTATION','L0','L1']),'authorized layers');
ok(JSON.stringify(contract.authorizedScope.operations)===JSON.stringify(['FOCUS']),'focus only');
for(const w of ['L2_INSPECT','L3_FOLLOW','L3_PROVENANCE_TRAVERSAL','L4_ENTER','M1R2_ENTRY','BROADER_METHODS_POPULATION','MODELS_POPULATION','EXPERIMENTS_POPULATION','EVIDENCE_POPULATION','PUBLIC_PROMOTION'])ok(contract.withheldScope.includes(w),`withheld ${w}`);
ok(contract.foundationalAttachment.currentLawsTestRoute==='/laws/test/','laws test route');
ok(contract.foundationalAttachment.currentLawsTestRole==='EPISTEMIC_LAW','laws test role');
ok(contract.foundationalAttachment.testsEnvironmentRole==='OPERATIONAL_TESTS_ENVIRONMENT','tests role');
ok(contract.foundationalAttachment.lawsTestEqualsTestsEnvironment===false,'laws test != tests');
ok(contract.foundationalAttachment.sameObjectByLabelSimilarity===false,'no label inheritance');
ok(contract.foundationalAttachment.lawsResearchMethodsModelsEqualsTestsMethodsModels===false,'methods label split');
ok(contract.foundationalAttachment.lawsResearchResultsRecordsEqualsTestsEvidence===false,'results evidence split');
ok(contract.foundationalAttachment.automaticPublicRouteAttachmentAuthorized===false,'no public route auto attach');
ok(contract.isolatedM1FixedScientificSubject.objectCount===3,'m1 object count');
ok(contract.isolatedM1FixedScientificSubject.relationCount===2,'m1 relation count');
ok(contract.isolatedM1FixedScientificSubject.authorizedOperation==='FOCUS','m1 focus');
const ex=contract.isolatedM1FixedScientificSubject.integratedExperimentFutureConstraint;
ok(ex.O_integrated_equals_O_isolated&&ex.R_integrated_equals_R_isolated&&ex.A_integrated_equals_A_isolated&&ex.N_integrated_must_differ_from_N_isolated,'future differential constraint');
ok(contract.construction.integratedManifestationConstructionAuthorized===false,'construction false');
ok(contract.construction.separateIntegratedM1ConstructionAuthorizationRequired===true,'separate construction authority');
ok(contract.publicMutation===false&&contract.scientificClaimUpgrade===false,'no public/scientific upgrade');
const expected=new Map([
 ['control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/authority-and-ownership-matrix.v1.json','c24c86b89d0650dd597988d4b3148bec41304b4a'],
 ['verification/benchmark-tools/four-compass-benchmark-v1/four-compass-benchmark.config.mjs','e3c378403ccee3a4fd6572cfa491cb9f0810fdb7'],
 ['control-plane/whole-estate/tests-l0-l1-navigation-shell-authority-v1/authority-contract.v1.json','0bfab791c005ca71cee771a5d14d27f8dfab3177'],
 ['control-plane/whole-estate/tests-l0-l1-navigation-shell-authority-v1/source-authority-ledger.v1.json','fe37b67fe3faf0d62b969ec3860c2d083e2e8185'],
 ['control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/candidate-manifest.v1.json','e18c382c7f82bd3335f69bcf752198c0c10e66a9'],
 ['control-plane/whole-estate/whole-estate-narrative-and-constitutive-baseline-freeze-v1/route-and-room-inventory.v1.json','d7d085881efd33576857f8cb4fa551e845f2bc84'],
 ['assets/compass/compass.controller.js','83ff2b714c9c36a9c096cf5ab2fd7b3875fe3e46'],
 ['assets/compass/compass.crystals.js','3d6427cbdb961576468d4aab05c0e4987549cea3'],
 ['assets/compass/upstream-compass.renderer.js','965376dd8a92686bc7008d1fea4846b5f8300872'],
 ['laws/index.controller.js','e6eef54a8d808c12ea0e5db85539bc521f29f3b2'],
 ['laws/index.html','df2fc6b74da5791cedf07f0d01449ccf72243c36'],
 ['prototypes/universal-compass/index.controller.js','103ab8c2e0fc0920e72524f3a2075fcc3b8d9b91']
]);
if(fs.existsSync(path.resolve(here,'../../../..','.git'))||fs.existsSync('.git')){
 for(const [p,b] of expected){const got=cp.execFileSync('git',['hash-object',p],{encoding:'utf8'}).trim();ok(got===b,`blob ${p}`)}
}
console.log(JSON.stringify({result:'PASS_COMPASS_TESTS_ARCHITECTURE_BINDING_v1',assertions:n,requiredCapabilities:9,admittedWithAdapter:9,constructionAuthorized:false},null,2));
