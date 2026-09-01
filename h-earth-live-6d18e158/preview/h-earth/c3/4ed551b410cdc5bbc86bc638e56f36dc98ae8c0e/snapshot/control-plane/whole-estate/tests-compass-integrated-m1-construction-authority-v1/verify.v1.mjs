#!/usr/bin/env node
import fs from 'node:fs';
import cp from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,'../../..');
const readLocal=n=>JSON.parse(fs.readFileSync(path.join(here,n),'utf8'));
const readRepo=p=>JSON.parse(fs.readFileSync(path.join(repoRoot,p),'utf8'));
const contract=readLocal('authority-contract.v1.json');
const ledger=readLocal('source-authority-ledger.v1.json');
const binding=readRepo('control-plane/whole-estate/compass-tests-architecture-binding-v1/binding-contract.v1.json');
const donorMap=readRepo('control-plane/whole-estate/compass-tests-architecture-binding-v1/donor-capability-map.v1.json');
const donorLedger=readRepo('control-plane/whole-estate/compass-tests-architecture-binding-v1/donor-noninheritance-ledger.v1.json');
const m1=readRepo('control-plane/whole-estate/tests-l0-l1-bounded-manifestation-m1-v1/candidate-manifest.v1.json');
const testsAuthority=readRepo('control-plane/whole-estate/tests-l0-l1-navigation-shell-authority-v1/authority-contract.v1.json');

let n=0;
const ok=(x,m)=>{n++;if(!x)throw Error(`ASSERT_${n}:${m}`)};
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

ok(contract.schema==='TESTS_COMPASS_INTEGRATED_M1_CONSTRUCTION_AUTHORITY_v1','schema');
ok(contract.operation==='TESTS_COMPASS_INTEGRATED_M1_CONSTRUCTION_AUTHORITY_v1','operation');
ok(contract.status==='FROZEN_CONSTRUCTION_AUTHORITY_CANDIDATE','status');
ok(contract.constructionBaseMain==='5dc56c1b73743706078afeb07cfe2dc144b72c90','base main');
ok(contract.target==='M1_COMPASS_INTEGRATED','target');
ok(contract.governingAuthorities.compassTestsBinding.promotionMerge==='5dc56c1b73743706078afeb07cfe2dc144b72c90','binding merge');
ok(contract.governingAuthorities.compassTestsBinding.approvedSubjectHead==='0995a07ebd5ed7b88480739059c950e8f1265d94','approved binding head');
ok(contract.governingAuthorities.compassTestsBinding.terminalReview==='4889462676','terminal review');
ok(contract.governingAuthorities.compassTestsBinding.approvalReceiptComment==='5227668355','approval receipt');
ok(contract.governingAuthorities.acceptedM1.candidateHead==='9370bba7841b8a831f7f1c034d0b74fb83dab2e0','m1 head');
ok(contract.governingAuthorities.acceptedM1.promotionMerge==='391c3543fd048bac90493232f04973911468d3eb','m1 merge');
ok(contract.governingAuthorities.m1r2.preservedEvidenceHead==='6840cf0b99914263628e937453497e5af3f16166','m1r2 head');
ok(contract.governingAuthorities.m1r2.rewriteAuthorized===false,'m1r2 no rewrite');
ok(contract.governingAuthorities.m1r2.entryAuthorized===false,'m1r2 no entry');
ok(contract.governingAuthorities.research.role==='AUTHORITATIVE_EVIDENCE_DOMAIN','research authority');
ok(contract.governingAuthorities.tests.role==='HIGHER_ORDER_OPERATIONAL_TESTS_ENVIRONMENT','tests environment');

ok(contract.differentialConstraint.O_integrated_equals_O_isolated===true,'O fixed');
ok(contract.differentialConstraint.R_integrated_equals_R_isolated===true,'R fixed');
ok(contract.differentialConstraint.A_integrated_equals_A_isolated===true,'A fixed');
ok(contract.differentialConstraint.N_integrated_must_differ_from_N_isolated===true,'N changes');
ok(contract.fixedScientificSubject.objectCount===3,'three objects');
ok(contract.fixedScientificSubject.relationCount===2,'two relations');
ok(contract.fixedScientificSubject.mutationAuthorized===false,'subject immutable');
ok(eq(contract.fixedScientificSubject.objects,m1.objects),'objects exact M1');
ok(eq(contract.fixedScientificSubject.relations,m1.relations),'relations exact M1');
ok(m1.projection.id==='METHODS'&&m1.projection.objectCount===3&&m1.projection.relationCount===2,'M1 projection exact');
ok(m1.interactionBoundary.implementedOperations.length===1&&m1.interactionBoundary.implementedOperations[0]==='FOCUS','M1 focus only');
ok(m1.deepEntryBoundary.m1r2MutationAuthorized===false&&m1.deepEntryBoundary.enterControlPresent===false,'M1R2 preserved');

ok(eq(contract.authorizedNavigationScope.layers,['L_MINUS_1_ORIENTATION','L0','L1']),'authorized layers');
ok(eq(contract.authorizedNavigationScope.operations,['FOCUS']),'focus only');
ok(eq(contract.authorizedNavigationScope.capabilities,['C01','C02','C03','C04','C05','C06','C07','C08','C09']),'nine capabilities');
ok(contract.authorizedNavigationScope.capabilityDispositionRequired==='ADMIT_WITH_ADAPTER','adapter-only disposition');
ok(donorMap.records.length===9,'donor map nine records');
for(const r of donorMap.records){
  ok(r.disposition==='ADMIT_WITH_ADAPTER',`${r.capabilityId} admitted with adapter`);
  ok(Boolean(r.requiredAdapter),`${r.capabilityId} adapter named`);
  ok(r.destinationBinding.scientificStateMutationPermitted===false,`${r.capabilityId} no scientific mutation`);
}
ok(donorLedger.donors.length===4,'four admitted donor ledgers');
for(const d of donorLedger.donors){
  ok(d.mechanicsOnly===true,`${d.donorId} mechanics only`);
  ok(d.prohibitedInheritance.length>=10,`${d.donorId} exclusions present`);
}
for(const id of contract.excludedDonors)ok(donorMap.withheldAlternatives.some(x=>x.donorId===id&&x.disposition==='WITHHOLD'),`${id} withheld`);
ok(contract.donorReopeningRule==='NO_DONOR_SELECTION_REOPENING_DURING_CONSTRUCTION_WITHOUT_NEW_AUTHORITY_DECISION','donor map frozen');

for(const w of ['L2_INSPECT','L3_FOLLOW','L3_PROVENANCE_TRAVERSAL','L4_ENTER','M1R2_ENTRY','BROADER_METHODS_POPULATION','MODELS_POPULATION','EXPERIMENTS_POPULATION','EVIDENCE_POPULATION','PUBLIC_PROMOTION'])ok(contract.withheldScope.includes(w),`withheld ${w}`);
for(const p of ['CHANGE_M1_SCIENTIFIC_SUBJECT','REDESIGN_OR_REWRITE_M1R2','DUPLICATE_RESEARCH_CONTENT_IN_TESTS','REDEFINE_LAWS_TEST','INHERIT_DONOR_SEMANTICS','INTRODUCE_UNAPPROVED_COMPASS_DONORS','ALTER_PUBLIC_OR_LIVE_ROUTE','MAKE_NEW_SCIENTIFIC_CLAIMS'])ok(contract.constructionProhibitions.includes(p),`prohibition ${p}`);
ok(contract.researchBoundary.researchEvidenceLocalAuthorityInTests===false,'research custody preserved');
ok(eq(contract.researchBoundary.allowedProjection,['REFERENCE','STANDING','ROUTE']),'research projection bounded');
ok(contract.researchBoundary.copyResearchContent===false,'no research copy');
ok(contract.lawsBoundary.lawsTestEqualsOperationalTests===false,'laws test distinct');
ok(contract.lawsBoundary.lawsMethodsModelsEqualsTestsMethodsModels===false,'laws methods distinct');
ok(contract.lawsBoundary.lawsResultsRecordsEqualsTestsEvidence===false,'laws results distinct');
ok(contract.lawsBoundary.lawsRouteMutationAuthorized===false,'laws route immutable');
ok(testsAuthority.controllingArchitecture.researchRole.includes('INDEPENDENT_AUTHORITATIVE_DOMAIN'),'Tests authority research custody');
ok(testsAuthority.controllingArchitecture.testsRole.includes('OPERATIONAL_ENVIRONMENT'),'Tests authority operating environment');
ok(eq(testsAuthority.controllingArchitecture.eResearchRule,['REFERENCE','STANDING','ROUTE']),'Tests authority research projection');

for(const req of ['ALL_NINE_CAPABILITIES_ENTER_ONLY_THROUGH_APPROVED_ADAPTERS','DONOR_SEMANTIC_EXCLUSION_AUDIT','M1_IDENTITY_AND_BEHAVIOR_REGRESSION','RESEARCH_REFERENCE_NOT_COPY_AUDIT','EXCLUDED_DONOR_ABSENCE','NO_PUBLIC_ROUTE_CHANGE','RUNTIME_AND_PERCEPTUAL_REVIEW','EXACT_HEAD_TERMINAL_CERTIFICATION'])ok(contract.requiredVerification.includes(req),`verification ${req}`);
ok(contract.promotionBoundary.constructionCandidateMayBeBuilt===true,'construction candidate authorized after promotion');
ok(contract.promotionBoundary.constructionCandidateMayBecomeAcceptedTestsBaselineWithoutSeparatePromotion===false,'separate promotion required');
ok(contract.promotionBoundary.publicPromotionAuthorized===false,'no public promotion');
ok(contract.promotionBoundary.scientificClaimUpgradeAuthorized===false,'no claim upgrade');

ok(binding.binding==='C(D,R,N)->P','binding equation preserved');
ok(binding.construction.integratedManifestationConstructionAuthorized===false,'binding itself did not construct');
ok(binding.construction.separateIntegratedM1ConstructionAuthorizationRequired===true,'separate authority required');
ok(binding.isolatedM1FixedScientificSubject.candidate==='9370bba7841b8a831f7f1c034d0b74fb83dab2e0','binding M1 baseline');

ok(ledger.operation===contract.operation,'ledger operation');
ok(ledger.constructionBaseMain===contract.constructionBaseMain,'ledger base');
ok(ledger.sources.length===13,'source count');
ok(ledger.sourceRules.threadMemoryIsAuthority===false,'thread nonauthority');
ok(ledger.sourceRules.labelSimilarityIsAuthority===false,'label nonauthority');
ok(ledger.sourceRules.prototypeExistenceIsAuthority===false,'prototype nonauthority');
ok(ledger.sourceRules.unresolvedSourceMayBeInherited===false,'fail closed');
ok(ledger.sourceRules.researchContentMayBeCopiedIntoTests===false,'no research duplication');
ok(ledger.sourceRules.donorMechanicsMayCarryDonorSemantics===false,'semantic stripping');

if(fs.existsSync(path.join(repoRoot,'.git'))){
  for(const s of ledger.sources.filter(x=>x.path&&x.blob)){
    const got=cp.execFileSync('git',['-C',repoRoot,'hash-object',s.path],{encoding:'utf8'}).trim();
    ok(got===s.blob,`blob ${s.id}`);
  }
}

console.log(JSON.stringify({
  result:'PASS_TESTS_COMPASS_INTEGRATED_M1_CONSTRUCTION_AUTHORITY_v1',
  assertions:n,
  target:contract.target,
  requiredCapabilities:9,
  allCapabilitiesRequireAdapters:true,
  scientificSubjectMutationAuthorized:false,
  m1r2RewriteAuthorized:false,
  publicMutationAuthorized:false,
  scientificClaimUpgradeAuthorized:false,
  constructionCandidateAuthorizedAfterPromotion:true,
  separateCandidatePromotionRequired:true
},null,2));
