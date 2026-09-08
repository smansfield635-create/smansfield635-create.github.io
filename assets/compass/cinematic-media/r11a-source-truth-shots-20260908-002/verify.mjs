#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
const args=process.argv.slice(2); const mi=args.indexOf('--manifest');
if(mi<0||!args[mi+1]) throw new Error('MANIFEST_REQUIRED');
const path=args[mi+1], raw=fs.readFileSync(path,'utf8'), m=JSON.parse(raw);
const fail=(c)=>{throw new Error(c)};
const gitBlob=(bytes)=>crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
if(m.schema!=='R11A_SOURCE_TRUTH_SHOT_MANIFEST_v1')fail('SCHEMA');
if(m.governingHead!=='691339e6becbaf724e4ac28bd4cd9c1834254d83')fail('GOVERNING_HEAD');
if(m.operationId!=='COMPASS_R11A_SOURCE_TRUTH_SHOT_CONSTRUCTION_20260908_002'||m.lockGeneration!==2005)fail('AUTHORITY');
if(m.shot!=='S00'||m.transformationGrammarSegment!=='SURFACE_TO_MATTER')fail('SHOT_GRAMMAR');
const expected=['INTACT_ENTRY_SURFACE','PROPAGATING_FRAGMENTATION_ACROSS_COMPLETE_SURFACE','MATERIALLY_COMPLETE_DISINTEGRATION','SUCCESSOR_CINEMATIC_MATTER'];
if(JSON.stringify(m.approvedMorphology)!==JSON.stringify(expected))fail('MORPHOLOGY');
if(m.proofStates?.length!==4||m.proofStates.map(x=>x.progress).join(',')!=='0,0.28,0.78,1')fail('PROOF_STATES');
const acceptedS00={
  head:'aefb46cf1e3b3a77b302d5176c53b5a67ad364fd',
  proof:['56f9a6fcf4b0ca2e79c6e1e67082ceb7381199f53c6213dd844f2d9b25242339','5c720504e1ea520313b9ef219266b095aea09cbb22d17c6c337e013522422620','346af67d006dfd8d85b2d04090f5bc94b62c539916fded26dee2ef2ccc542986','f0e090c88e57062f0c19f71ef8bcc1ace400dfe431402653f93524c1dad6918f'],
  contact:'95ea56f1bbfd1d804930427df7d9bfa9648e80870d76368a714033dd5a8c9061'
};
if(m.acceptedPredecessor?.head!==acceptedS00.head||m.acceptedPredecessor?.ownerAcceptance!=='ACCEPTED')fail('S00_ACCEPTED_PREDECESSOR');
if(JSON.stringify(m.proofStates.map(x=>x.sha256))!==JSON.stringify(acceptedS00.proof)||m.contactSheetSha256!==acceptedS00.contact)fail('S00_PROOF_IDENTITY_MUTATED');
if(!m.acceptance?.fragmentationMustPropagateThroughEntireSurface||!m.acceptance?.buttonOnlyFragmentationForbidden||!m.acceptance?.headerOnlyFadeForbidden)fail('PROPAGATION_LAW');
if(!m.acceptance?.exitMustRemainEntryDerivedMatter||!m.acceptance?.exitMustSupportS00ToS01CausalHandoff)fail('EXIT_LAW');
if(m.fullMasterAuthorized!==false||m.liveMutationAuthorized!==false)fail('AUTHORITY_WIDENING');
const stagePath=new URL('./stage.html',import.meta.url);const stage=fs.readFileSync(stagePath,'utf8');
for(const token of ['data-entry-surface','surface.getBoundingClientRect()','play.getBoundingClientRect()','setRaster','ENTRY_SURFACE_MATTER_READY_FOR_ORIENTATION_FIELD']) if(!stage.includes(token)) fail('STAGE_TOKEN_'+token);
if(stage.includes('buildEntryTessellation(button)'))fail('BUTTON_ONLY_PREDECESSOR_REINTRODUCED');
const s=m.successorShot;
if(s?.schema!=='R11A_S01_SOURCE_TRUTH_SHOT_v1'||s.shot!=='S01')fail('S01_SCHEMA');
if(s.operationId!=='COMPASS_R11A_S01_CONTINUITY_CONSTRUCTION_20260908_003'||s.lockGeneration!==2009||s.authorityState!=='ADMITTED_LOCKED')fail('S01_AUTHORITY');
if(s.dramaticInputState!=='S00_SUCCESSOR_CINEMATIC_MATTER'||s.dramaticOutputState!=='APPROVED_FOUR_CARDINAL_COMPASS_WITH_ORIENTATION_FOREGROUND')fail('S00_S01_HANDOFF');
if(s.inputFrameProofSha256!==acceptedS00.proof[3]||!s.inputFrameRule?.startsWith('S01_PROGRESS_ZERO_RECONSTRUCTS_ACCEPTED_S00_SUCCESSOR_MATTER'))fail('S00_S01_PIXEL_HANDOFF');
const ids=['COMPASS_STAR_ORIENTATION','COMPASS_STAR_TRANSFERABILITY','COMPASS_STAR_CONVERGENCE','COMPASS_STAR_INTEGRITY'];
if(JSON.stringify(s.persistentObjects?.map(x=>x.objectId))!==JSON.stringify(ids)||new Set(s.persistentObjects?.map(x=>x.objectId)).size!==4)fail('PERSISTENT_IDENTITIES');
if(s.objectCreationCount!==4||s.objectReplacementCount!==0)fail('OBJECT_REPLACEMENT');
if(s.terminalForeground!=='ORIENTATION'||s.otherCanonicalStarsVisible!==true)fail('TERMINAL_COMPOSITION');
if(s.genuineManipulation?.required!==true||s.genuineManipulation?.staticCompassForbidden!==true)fail('MANIPULATION_LAW');
if(s.genuineManipulation?.mechanism!=='TIMELINE_ROTATES_THE_SAME_FOUR_OBJECT_VECTORS_IN_RIGHT_HANDED_3D_SPACE_AND_SETTLES_ORIENTATION_FOREGROUND')fail('TIMELINE_MANIPULATION_MECHANISM');
if(JSON.stringify(s.genuineManipulation?.frameInterval)!==JSON.stringify([271,323])||JSON.stringify(s.genuineManipulation?.timelineProgressInterval)!==JSON.stringify([0.59,0.83]))fail('TIMELINE_MANIPULATION_WINDOW');
if(JSON.stringify(s.frameInterval)!==JSON.stringify([144,360])||JSON.stringify(s.secondsInterval)!==JSON.stringify([4.8,12])||s.proof?.ownerPreviewDurationSeconds!==7.2)fail('S01_RETIMING');
if(s.brandDescriptor!=='Independent Interactive Experience & Research Studio'||JSON.stringify(s.introPresentationOrder)!==JSON.stringify(['BRAND_IDENTITY_WITH_DESCRIPTOR','FOLLOWING_CONTEXT_BEAT']))fail('S01_BRAND_PRESENTATION');
if(s.genuineManipulation?.userInputRequired!==false||s.genuineManipulation?.interactiveSubsystemCreated!==false)fail('AUDIENCE_INTERACTION_REINTRODUCED');
if(s.proof?.ownerVisibleBrowserProofRequired!==true||s.proof?.ownerAcceptance!=='PENDING')fail('OWNER_GATE');
if(JSON.stringify(s.proof?.requiredProgress)!==JSON.stringify([0,0.18,0.46,0.72,1]))fail('S01_PROOF_STATES');
const sourceFiles={
  'assets/compass/compass.crystals.js':new URL('../../compass.crystals.js',import.meta.url),
  'assets/compass/compass.cosmos.js':new URL('../../compass.cosmos.js',import.meta.url),
  'assets/compass/compass.controller.js':new URL('../../compass.controller.js',import.meta.url)
};
for(const [name,url] of Object.entries(sourceFiles)){const bytes=fs.readFileSync(url);if(gitBlob(bytes)!==s.canonicalSourceAuthority?.[name])fail(`CANONICAL_SOURCE_BLOB:${name}`)}
for(const token of [
  'R11A_S01_SOURCE_TRUTH_STAGE_v1','S00_SUCCESSOR_CINEMATIC_MATTER','objectReplacementCount:0',
  'RIGHT_HANDED_EUCLIDEAN_XYZ','S00_PALETTE','S01Stage','authoredOrientation','smooth(.59,.83,p)','mix(-.82,0,q)','mix(.20,0,q)','timelineDrivenManipulation:true','userInputRequired:false','INDEPENDENT INTERACTIVE EXPERIENCE & RESEARCH STUDIO',
  ...ids,'SAME_STARS_FRAME_DGB_INTRO','SAME_STARS_CONVERGING','APPROVED_FOUR_CARDINAL_COMPASS'
]) if(!stage.includes(token))fail('S01_STAGE_TOKEN_'+token);
for(const interactiveToken of ['function manipulate(','pointerdown','pointermove','setPointerCapture','DRAG TO REORIENT','THE COMPASS REORIENTS','Discover the estate.'])if(stage.includes(interactiveToken))fail('INTERACTIVE_OR_UNFROZEN_PRESENTATION_TOKEN_'+interactiveToken);
for(const forbidden of ['<script src="../../compass.controller.js','<script src="../../compass.crystals.js','<script src="../../compass.cosmos.js'])if(stage.includes(forbidden))fail('PROTECTED_RUNTIME_LOADED_FOR_MUTATION');
const digest=crypto.createHash('sha256').update(raw).digest('hex');
process.stdout.write(JSON.stringify({schema:'R11A_SOURCE_TRUTH_SHOT_VERIFICATION_RECEIPT_v1',result:'PASS_AT_SOURCE_AND_PROOF_CONTRACT_LEVEL',shots:['S00','S01'],manifestSha256:digest,acceptedS00Preserved:true,persistentObjectIds:ids,objectReplacementCount:0,genuineManipulation:'TIMELINE_DRIVEN_3D_REORIENTATION',manipulationFrameInterval:[271,323],ownerPreviewDurationSeconds:7.2,brandDescriptor:s.brandDescriptor,introContextPresentation:'FOLLOWING_SEPARATE_BEAT',audienceInteractionRequired:false,interactiveSubsystemCreated:false,terminalForeground:'ORIENTATION',ownerAcceptance:'PENDING',fullMasterAuthorized:false,liveMutationAuthorized:false},null,2)+'\n');
