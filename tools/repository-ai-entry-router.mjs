#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const GEN3096_OPERATION_ID = 'H_EARTH_SPATIAL_FRAME_SELECTION_20261104_001';

const LEGACY_RELATIVE = 'tools/repository-ai-entry-router.v3-legacy.mjs';
const STATIC_VERIFIER = 'tools/static-editorial-micro-verifier.v1.mjs';
const STATIC_CONTENT_EXTENSIONS = new Set(['.html', '.htm', '.md', '.txt']);
const STATIC_PRESENTATION_EXTENSIONS = new Set(['.css']);
const EXECUTABLE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.wasm', '.py', '.rb', '.php', '.sh', '.bash', '.zsh', '.ps1']);
const AUTHORITY_PREFIXES = ['.github/', 'tools/', 'control-plane/', 'governance/', 'evidence/'];
const STATIC_TASK_TOKENS = ['COPY', 'TEXT', 'EDITORIAL', 'WORDING', 'LABEL', 'INSTRUCTION', 'INSTRUCTIONS', 'TYPO', 'PUNCTUATION', 'CONTENT', 'HEADLINE', 'DESCRIPTION'];
const PRESENTATION_TASK_TOKENS = ['STATIC', 'PRESENTATION', 'ORDER', 'SPACING', 'TYPOGRAPHY', 'COLOR', 'MARGIN', 'PADDING', 'LAYOUT', 'VISUAL'];
const RUNTIME_TASK_TOKENS = ['RUNTIME', 'BEHAVIOR', 'BEHAVIOUR', 'NAVIGATION', 'STATE MACHINE', 'STATE-MACHINE', 'EVENT', 'HANDLER', 'GESTURE', 'ROUTING', 'ROUTE', 'CONTROLLER', 'RENDERER', 'AUTHORITY', 'DOM REPARENT', 'REPARENT', 'POINTER', 'HIT TARGET', 'HIT-TARGET', 'KEYBOARD', 'FOCUS'];
const CSS_RUNTIME_TOKENS = ['POINTER-EVENTS', 'DISPLAY', 'VISIBILITY', 'Z-INDEX', 'POSITION:FIXED', 'POSITION: FIXED', 'TOUCH-ACTION', 'USER-SELECT'];

const CINEMATIC_TASK_TOKENS = ['CINEMATIC', 'FILM', 'VIDEO', 'PLAYBACK'];
const NON_INTERACTIVE_TASK_TOKENS = ['NON-INTERACTIVE', 'NONINTERACTIVE', 'PRESENTATION-ONLY', 'PRESENTATION ONLY'];
const WEBSITE_AUTHORITY_TASK_TOKENS = [
  'NAVIGATION', 'ROUTING', 'ROUTE', 'CONTROLLER', 'AUTHORITY',
  'DOM REPARENT', 'REPARENT', 'GESTURE', 'POINTER', 'HIT TARGET', 'HIT-TARGET',
  'KEYBOARD', 'FOCUS', 'ANALYTICS', 'APPLICATION STATE', 'SHARED STATE', 'GLOBAL STATE'
];
const WEBSITE_AUTHORITY_PATH_TOKENS = [
  'controller.', '/navigation/', 'navigation.', '/router/', 'router.',
  '/analytics/', 'analytics.', 'readiness-context', 'capability-carousel',
  'mirrorland-window', 'compass.crystals'
];

function die(message, code = 1) { process.stderr.write(`${message}\n`); process.exit(code); }
function discoverRoot(start) { let current = path.resolve(start); while (true) { if (fs.existsSync(path.join(current, 'AI_ENTRYPOINT.json'))) return current; const parent = path.dirname(current); if (parent === current) die('REPOSITORY_ENTRYPOINT_NOT_FOUND:AI_ENTRYPOINT.json'); current = parent; } }
function consumeValue(argv, index, token) { const value = argv[index + 1]; if (typeof value !== 'string' || value === '' || value.startsWith('--')) die(`MISSING_ARGUMENT_VALUE:${token}`); return value; }
function parseArgs(argv) { const parsed = { paths: [], pathsFile: null, task: '', mutationIntent: false, output: null, selfTest: false }; for (let i = 0; i < argv.length; i += 1) { const token = argv[i]; if (token === '--path') { parsed.paths.push(consumeValue(argv, i, token)); i += 1; } else if (token === '--paths-file') { parsed.pathsFile = consumeValue(argv, i, token); i += 1; } else if (token === '--task') { parsed.task = consumeValue(argv, i, token); i += 1; } else if (token === '--mutation-intent') parsed.mutationIntent = true; else if (token === '--output') { parsed.output = consumeValue(argv, i, token); i += 1; } else if (token === '--self-test') parsed.selfTest = true; else if (token === '--intake-availability-receipt') i += 1; else die(`UNKNOWN_ARGUMENT:${token}`); } return parsed; }
function normalizeRepositoryPath(value) { const slash = String(value ?? '').trim().replaceAll('\\', '/').replace(/^\.\/+/, ''); if (!slash || slash.startsWith('/') || slash === '..' || slash.startsWith('../') || slash.includes('/../')) die(`INVALID_REPOSITORY_PATH:${value}`); return slash.replace(/\/+/g, '/'); }
function collectPaths(root, parsed) { const paths = [...parsed.paths]; if (parsed.pathsFile) { const text = fs.readFileSync(path.resolve(root, parsed.pathsFile), 'utf8'); paths.push(...text.split(/\r?\n/).filter(Boolean)); } return [...new Set(paths.map(normalizeRepositoryPath))].sort(); }
function containsAny(text, tokens) { return tokens.some((token) => text.includes(token)); }
function isCinematicScopedPath(filePath) {
  const lower = filePath.toLowerCase();
  return lower.includes('cinematic') || lower.includes('/orientation-cinematic/');
}
function isBoundedCinematicPathSet(normalizedPaths, extensions, upperTask) {
  if (!containsAny(upperTask, CINEMATIC_TASK_TOKENS)) return false;
  if (!containsAny(upperTask, NON_INTERACTIVE_TASK_TOKENS)) return false;
  if (containsAny(upperTask, WEBSITE_AUTHORITY_TASK_TOKENS)) return false;
  if (normalizedPaths.some((filePath) => AUTHORITY_PREFIXES.some((prefix) => filePath.startsWith(prefix)))) return false;
  if (normalizedPaths.some((filePath) => containsAny(filePath.toLowerCase(), WEBSITE_AUTHORITY_PATH_TOKENS))) return false;
  let cinematicScoped = false;
  for (let i = 0; i < normalizedPaths.length; i += 1) {
    const filePath = normalizedPaths[i];
    const extension = extensions[i];
    const scoped = isCinematicScopedPath(filePath);
    if (scoped) cinematicScoped = true;
    if (EXECUTABLE_EXTENSIONS.has(extension) && !scoped) return false;
    if (!EXECUTABLE_EXTENSIONS.has(extension)
      && !STATIC_CONTENT_EXTENSIONS.has(extension)
      && !STATIC_PRESENTATION_EXTENSIONS.has(extension)
      && !scoped) return false;
  }
  return cinematicScoped;
}
function classifyPageMutation(paths, task = '') {
  const normalizedPaths = [...new Set(paths.map(normalizeRepositoryPath))].sort();
  const upperTask = String(task || '').toUpperCase();
  const extensions = normalizedPaths.map((filePath) => path.extname(filePath).toLowerCase());
  const governed = (reasonCode) => ({ mutationClass: 'RUNTIME_OR_AUTHORITY', reasonCode, canonicalAdmissionRequired: true, pageExcellenceRequired: true });
  if (normalizedPaths.length === 0) return governed('NO_DECLARED_PATHS_FAIL_CLOSED');
  if (normalizedPaths.some((filePath) => AUTHORITY_PREFIXES.some((prefix) => filePath.startsWith(prefix)))) return governed('CONTROL_OR_AUTHORITY_SURFACE');
  if (isBoundedCinematicPathSet(normalizedPaths, extensions, upperTask)) return {
    mutationClass: 'BOUNDED_PAGE_RELEASE',
    reasonCode: 'BOUNDED_NON_INTERACTIVE_CINEMATIC_PRESENTATION',
    canonicalAdmissionRequired: false,
    pageExcellenceRequired: false,
    requiredProofs: [
      'EXACT_HEAD',
      'DECLARED_PATHS_ONLY',
      'NO_NAVIGATION_DELTA',
      'NO_APPLICATION_STATE_AUTHORITY_DELTA',
      'NO_SHARED_DOM_AUTHORITY_DELTA',
      'NO_ANALYTICS_DELTA',
      'IDEMPOTENT_PRESENTATION_RESTORATION',
      'NO_UNRELATED_DIFF'
    ]
  };
  if (extensions.some((extension) => EXECUTABLE_EXTENSIONS.has(extension))) return governed('EXECUTABLE_SURFACE_PRESENT');
  if (containsAny(upperTask, RUNTIME_TASK_TOKENS)) return governed('RUNTIME_SEMANTICS_DECLARED');
  const contentOnly = extensions.every((extension) => STATIC_CONTENT_EXTENSIONS.has(extension));
  const staticPresentationOnly = extensions.every((extension) => STATIC_CONTENT_EXTENSIONS.has(extension) || STATIC_PRESENTATION_EXTENSIONS.has(extension));
  const hasCss = extensions.some((extension) => STATIC_PRESENTATION_EXTENSIONS.has(extension));
  if (contentOnly && containsAny(upperTask, STATIC_TASK_TOKENS)) return { mutationClass: 'STATIC_EDITORIAL_MICRO', reasonCode: 'STATIC_CONTENT_ONLY_WITH_EDITORIAL_INTENT', canonicalAdmissionRequired: false, pageExcellenceRequired: false, verifier: STATIC_VERIFIER, requiredProofs: ['EXACT_HEAD', 'DECLARED_PATHS_ONLY', 'NO_EXECUTABLE_RUNTIME_DELTA', 'NO_UNRELATED_DIFF'] };
  if (staticPresentationOnly && hasCss && containsAny(upperTask, PRESENTATION_TASK_TOKENS) && !containsAny(upperTask, CSS_RUNTIME_TOKENS)) return { mutationClass: 'STATIC_EDITORIAL_MICRO', reasonCode: 'BOUNDED_STATIC_PRESENTATION_INTENT', canonicalAdmissionRequired: false, pageExcellenceRequired: false, verifier: STATIC_VERIFIER, requiredProofs: ['EXACT_HEAD', 'DECLARED_PATHS_ONLY', 'NO_EXECUTABLE_RUNTIME_DELTA', 'NO_UNRELATED_DIFF', 'STATIC_PRESENTATION_ONLY'] };
  return governed('AMBIGUOUS_MUTATION_FAIL_CLOSED');
}
function buildWholeEstateExecutionDecision(classification, normalizedPaths, task = '', routeReceipt = null) {
  const mutationClass = classification.mutationClass;
  const readOnly = mutationClass === 'READ_ONLY';
  const authoritySurface = normalizedPaths.some((filePath) => AUTHORITY_PREFIXES.some((prefix) => filePath.startsWith(prefix)));
  const agentMode = readOnly || mutationClass === 'STATIC_EDITORIAL_MICRO' || mutationClass === 'BOUNDED_PAGE_RELEASE'
    ? 'NOT_REQUIRED'
    : authoritySurface ? 'REQUIRED' : 'PROPORTIONAL_BY_PROJECT_RISK';
  const selectedGateClasses = readOnly
    ? ['PROJECT_ROUTE_READBACK']
    : mutationClass === 'STATIC_EDITORIAL_MICRO'
      ? ['PROJECT_ROUTE', 'EXACT_DIFF', 'STATIC_EDITORIAL_VERIFIER']
      : mutationClass === 'BOUNDED_PAGE_RELEASE'
        ? ['PROJECT_ROUTE', 'EXACT_DIFF', 'BOUNDED_RELEASE_PROOFS', 'EXACT_HEAD_PUBLICATION_SEQUENCE_WHEN_RELEASE_REQUESTED']
        : ['CANONICAL_INTAKE', 'PROJECT_ROUTE', 'DIRECT_DEPENDENCY_QUALIFICATION', 'PRODUCT_OR_AUTHORITY_SPECIFIC_VERIFIER'];
  return {
    schema: 'WHOLE_ESTATE_EXECUTION_DECISION_v1',
    status: 'AUTHORITATIVE_FOR_BLOCKING_GATE_SELECTION',
    mutationClass,
    classificationReason: classification.reasonCode ?? (readOnly ? 'READ_ONLY_ROUTE' : null),
    declaredPaths: normalizedPaths,
    task: task || null,
    canonicalAdmissionRequired: classification.canonicalAdmissionRequired === true,
    agentMode,
    selectedGateClasses,
    gatePolicy: {
      onlySelectedGatesMayBlock: true,
      blockingRequiresChangedByteDirectDependencyOrExplicitSemanticDependency: true,
      filesystemDirectoryPrefixAloneMayBlock: false,
      unselectedWorkflowFailureDisposition: 'ADVISORY_NON_BLOCKING_EVIDENCE'
    },
    precedentReuse: {
      default: 'REUSE_ACCEPTED_PRECEDENT_BEFORE_NEW_CONSTRUCTION',
      unchangedQualifiedBehaviorMayInheritEvidence: true,
      inheritanceRequiresAcceptedIdentityAndExplicitUnchangedContract: true,
      qualifyOnlyDeclaredDeltaAndDirectlyAffectedDependencies: true,
      authorityOrClaimUpgradeByInheritanceAllowed: false
    },
    candidateScopeRecognition: {
      exactDeclaredCandidatePathsRecognizedForOperation: true,
      candidateCreatedPathNeedsSeparatePersistentRegistrationSolelyBecauseNew: false,
      persistentRegistrationRequiredOnlyForDurableAuthorityBoundary: true,
      mayExpandDeclaredScope: false
    },
    continuity: {
      mainMovementAloneForcesStrictSuccessor: false,
      disjointMovementDefault: 'DIFFERENTIAL_CONTINUITY_THEN_CARRY_FORWARD',
      strictSuccessorOnlyForRelevantScopeDependencyAuthorityScientificChangeOrIncompleteEvidence: true
    },
    invariants: {
      readOnlyMayEscalateToMutationSemantics: false,
      controlPlaneDefectMayManufactureProductPrerequisite: false,
      exactHeadCustodyPreserved: true,
      boundedMutationScopePreserved: true,
      scientificAndEmpiricalFailClosedBoundariesPreserved: true,
      mergeDeploymentPublicationSeparationPreserved: true
    },
    blockerTaxonomy: ['PRODUCT_DEFECT', 'QUALIFICATION_HARNESS_DEFECT', 'CONTROL_PLANE_DEFECT', 'EXECUTION_SUBSTRATE_DEFECT', 'AUTHORITY_DEFECT', 'PUBLICATION_DEFECT', 'SCIENTIFIC_OR_EMPIRICAL_DEFECT'],
    routeDisposition: routeReceipt?.disposition ?? null,
    authorityEffect: 'NONE'
  };
}
function stripMutationOnlyArgs(argv) { const stripped = []; for (let i = 0; i < argv.length; i += 1) { const token = argv[i]; if (token === '--mutation-intent') continue; if (token === '--intake-availability-receipt') { i += 1; continue; } if (token === '--output') { i += 1; continue; } stripped.push(token); } return stripped; }
function stripOutputArg(argv) { const stripped = []; for (let i = 0; i < argv.length; i += 1) { const token = argv[i]; if (token === '--output') { i += 1; continue; } stripped.push(token); } return stripped; }
function runLegacy(root, argv) { return spawnSync(process.execPath, [path.join(root, LEGACY_RELATIVE), ...argv], { cwd: root, encoding: 'utf8' }); }
function parseLegacyReceipt(legacy) { let receipt = null; try { receipt = JSON.parse(legacy.stdout || '{}'); } catch { die(`LEGACY_ROUTE_RECEIPT_INVALID:${legacy.stderr || legacy.stdout}`); } return receipt; }
function writeReceipt(output, receipt) { const text = `${JSON.stringify(receipt, null, 2)}\n`; if (output) { const absolute = path.resolve(output); fs.mkdirSync(path.dirname(absolute), { recursive: true }); fs.writeFileSync(absolute, text); } process.stdout.write(text); }

/* Existing router: Gen3264's exact admitted candidate-created Sculpt Lab scope.
 * This is a read-only, operation-specific use of the existing candidate
 * recognition policy. It never edits a registry, ledger or product. */
const M163_OPERATION_ID = 'DGB_GRAPHICS_SCULPT_LAB_M163_GEOMETRY_SAFETY_20261114_001';
const M163_REPO = 'smansfield635-create/smansfield635-create.github.io';
const M163_PROJECT = 'DIAMOND_GATE_GRAPHICS_ENGINE';
const M163_GOVERNING_HEAD = 'c36e05af0160f0707dca0e7ee8c5334bc3e5fb52';
const M163_OWNER_COMMENT = 6869244993;
const M163_PATHS = Object.freeze([
  'assets/engine/dgb.native-sculpt-session.v1.mjs',
  'assets/engine/dgb.native-sculpt-session.v1.test.mjs'
]);
const M163_CANDIDATE = 'd920485facd7a6231f3a31a99fb47b0243d5dbb0';
const m163Stable = value => Array.isArray(value) ? value.map(m163Stable) :
  value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key,m163Stable(value[key])]))
    : value;
const m163Hash = value => createHash('sha256').update(value).digest('hex');
const m163Equal = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const m163Fail = code => Object.freeze({eligible:false,code,authorityEffect:'NONE'});
function verifyM163CandidateEvidence({source,ledger,lockRefHead,paths,task,mutationIntent}={}) {
  try {
    if(task!==M163_OPERATION_ID || mutationIntent!==true ||
       !m163Equal([...new Set(paths)].sort(),[...M163_PATHS].sort()) ||
       paths.length!==M163_PATHS.length) return m163Fail('M163_EXACT_OPERATION_AND_PATHS_REQUIRED');
    if(!/^[a-f0-9]{40}$/.test(lockRefHead??'')) return m163Fail('LOCK_REF_INVALID');
    if(source?.id!==M163_OWNER_COMMENT || source.user?.login!=='smansfield635-create' ||
       source.author_association!=='OWNER' ||
       !String(source.issue_url).endsWith('/7108') ||
       !source.body?.startsWith('CANONICAL_OPERATION_INTAKE_REQUEST_V1\n'))
       return m163Fail('OWNER_COMMENT_PROVENANCE_INVALID');
    const packet=JSON.parse(source.body.slice(source.body.indexOf('\n')+1));
    const r=packet.operationRequest,p=packet.constructionProcedure;
    if(packet.schema!=='CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1' ||
       !m163Equal(Object.keys(packet).sort(),['constructionProcedure','operationRequest','schema']) ||
       r?.operationId!==M163_OPERATION_ID || r?.projectId!==M163_PROJECT ||
       r?.exactGoverningHead!==M163_GOVERNING_HEAD ||
       p?.exactGoverningHead!==M163_GOVERNING_HEAD ||
       !m163Equal(r?.allowedPaths,M163_PATHS) ||
       !m163Equal(p?.exactAllowedRepositoryPaths,M163_PATHS) ||
       r.fingerprintDomain?.retainedCandidate!==M163_CANDIDATE ||
       r.fingerprintDomain?.candidateSessionBlob!=='08efe3dec0db416b6b6d0f7356f0de908ef15794' ||
       r.fingerprintDomain?.candidateSessionTestBlob!=='75040ebf2774573f74efb3d0c08ea5741536d724')
       return m163Fail('ORIGINAL_M163_ADMISSION_SCOPE_MISMATCH');
    const matches=Object.values(ledger?.activeScopes??{}).filter(lock=>lock?.operationId===M163_OPERATION_ID);
    if(matches.length!==1) return m163Fail('ACTIVE_OPERATION_LOCK_NOT_UNIQUE');
    const lock=matches[0],inv=lock.authorityProvenance?.invocation;
    if(lock.lockGeneration!==3264 || lock.governingHead!==M163_GOVERNING_HEAD ||
       !['ADMITTED_LOCKED','EXECUTING'].includes(lock.state) || lock.released!==false ||
       lock.scopeHash!==m163Hash(lock.lockScope.trim().toUpperCase()) ||
       lock.requestDigest!==m163Hash(JSON.stringify(m163Stable(r))) ||
       lock.procedureLocatorDigest!==m163Hash(JSON.stringify(m163Stable(p))) ||
       inv?.commentId!==M163_OWNER_COMMENT ||
       inv?.repository!==M163_REPO ||
       inv?.commentBodySha256!==m163Hash(source.body) ||
       inv?.commentAuthorLogin!=='smansfield635-create' ||
       inv?.commentAuthorAssociation!=='OWNER')
       return m163Fail('CANONICAL_LOCK_PROVENANCE_MISMATCH');
    return Object.freeze({eligible:true,operationId:M163_OPERATION_ID,
      lockGeneration:3264,governingHead:M163_GOVERNING_HEAD,
      projectId:M163_PROJECT,allowedPaths:M163_PATHS,sourceCommentId:M163_OWNER_COMMENT,
      lockRefHead,scopeHash:lock.scopeHash,authorityEffect:'NONE_PATH_RECOGNITION_ONLY'});
  } catch {return m163Fail('INVALID_ADMISSION_EVIDENCE');}
}
function promoteM163Routes(raw,registry,proof) {
  if(proof?.eligible!==true) throw new Error('M163_SCOPE_PROOF_NOT_VALID');
  const projects=(registry?.projects??[]).filter(p=>p.projectId===M163_PROJECT && p.status==='ACTIVE_REGISTERED_PROJECT');
  if(projects.length!==1) throw new Error('M163_REGISTERED_PROJECT_NOT_UNIQUE_ACTIVE');
  if(raw?.disposition!=='BLOCK'||!Array.isArray(raw.routes)||
     raw.routes.length!==M163_PATHS.length ||
     !m163Equal(raw.routes.map(r=>r.path).sort(),[...M163_PATHS].sort()))
     throw new Error('M163_RAW_ROUTES_SCOPE_MISMATCH');
  const routes=raw.routes.map(route=>{
    if(route.routeClass!=='UNREGISTERED'||route.disposition!=='BLOCK'||route.projectId!=null)
      throw new Error('M163_RAW_ROUTE_NOT_UNREGISTERED');
    return {...route,routeClass:'AUTHENTIC_GEN3264_ADMITTED_CANDIDATE_PATH',
      projectId:M163_PROJECT,disposition:'PASS'};
  });
  return {...raw,routes,disposition:'PASS',legacyDisposition:raw.disposition,
    admittedCandidateScopeRecognition:'GEN3264_EXACT_TWO_PATHS_ONLY'};
}
async function fetchM163Json(url) {
  const token=process.env.GITHUB_TOKEN??process.env.GH_TOKEN??null;
  const headers={'Accept':'application/vnd.github+json',...(token?{'Authorization':'Bearer '+token}:{})};
  const res=await fetch(url,{headers});
  if(!res.ok) throw new Error('M163_PROVENANCE_FETCH_FAILED_'+res.status);
  return res.json();
}
async function verifyM163LiveAdmission(paths,task,mutationIntent) {
  if(task!==M163_OPERATION_ID||mutationIntent!==true ||
     paths.length!==M163_PATHS.length ||
     !m163Equal([...new Set(paths)].sort(),[...M163_PATHS].sort()))
    throw new Error('M163_EXACT_PATH_SET_REQUIRED');
  const api='https://api.github.com/repos/'+M163_REPO;
  const [source,ref]=await Promise.all([
    fetchM163Json(api+'/issues/comments/'+M163_OWNER_COMMENT),
    fetchM163Json(api+'/git/ref/heads/operation-locks/repository-operation-intake-v1')
  ]);
  const head=ref?.object?.sha;
  if(!/^[a-f0-9]{40}$/.test(head??'')) throw new Error('M163_LEDGER_REF_INVALID');
  const doc=await fetchM163Json(api+'/contents/.github/operation-intake/active-operation-ledger.v1.json?ref='+head);
  if(!/^[a-f0-9]{40}$/.test(doc?.sha??'')) throw new Error('M163_LEDGER_OBJECT_INVALID');
  const blob=doc.encoding==='base64'&&typeof doc.content==='string'&&doc.content.trim()
    ? doc : await fetchM163Json(api+'/git/blobs/'+doc.sha);
  if(blob?.encoding!=='base64'||typeof blob.content!=='string')
    throw new Error('M163_LEDGER_CONTENT_INVALID');
  const ledger=JSON.parse(Buffer.from(blob.content.replace(/\s/g,''),'base64').toString('utf8'));
  const proof=verifyM163CandidateEvidence({source,ledger,lockRefHead:head,paths,task,mutationIntent});
  if(!proof.eligible) throw new Error('M163_PROVENANCE_INVALID:'+proof.code);
  return proof;
}
function m163ScopeSelfTest() {
  const paths=[...M163_PATHS],task=M163_OPERATION_ID;
  const r={operationId:task,projectId:M163_PROJECT,exactGoverningHead:M163_GOVERNING_HEAD,
    allowedPaths:paths,fingerprintDomain:{retainedCandidate:M163_CANDIDATE,
    candidateSessionBlob:'08efe3dec0db416b6b6d0f7356f0de908ef15794',
    candidateSessionTestBlob:'75040ebf2774573f74efb3d0c08ea5741536d724'}};
  const p={exactGoverningHead:M163_GOVERNING_HEAD,exactAllowedRepositoryPaths:paths};
  const source={id:M163_OWNER_COMMENT,user:{login:'smansfield635-create'},
    author_association:'OWNER',issue_url:'https://api.github.com/repos/'+M163_REPO+'/issues/7108',
    body:'CANONICAL_OPERATION_INTAKE_REQUEST_V1\n'+JSON.stringify({
      schema:'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1',operationRequest:r,constructionProcedure:p})+'\n'};
  const lockScope='DIAMOND_GATE_GRAPHICS_ENGINE:SCULPT_LAB:M163_GEOMETRY_SAFETY:20261114';
  const invocation={commentId:M163_OWNER_COMMENT,repository:M163_REPO,
    commentBodySha256:m163Hash(source.body),commentAuthorLogin:'smansfield635-create',
    commentAuthorAssociation:'OWNER'};
  const lock={operationId:task,lockGeneration:3264,governingHead:M163_GOVERNING_HEAD,
    state:'ADMITTED_LOCKED',released:false,lockScope,scopeHash:m163Hash(lockScope),
    requestDigest:m163Hash(JSON.stringify(m163Stable(r))),
    procedureLocatorDigest:m163Hash(JSON.stringify(m163Stable(p))),
    authorityProvenance:{invocation}};
  const ledger={activeScopes:{sample:lock}},head='a'.repeat(40);
  const arg={source,ledger,lockRefHead:head,paths,task,mutationIntent:true};
  const valid=verifyM163CandidateEvidence(arg);
  const raw={disposition:'BLOCK',routes:paths.map(path=>({path,routeClass:'UNREGISTERED',projectId:null,disposition:'BLOCK'}))};
  const registry={projects:[{projectId:M163_PROJECT,status:'ACTIVE_REGISTERED_PROJECT'}]};
  let mapped=null;try{mapped=promoteM163Routes(raw,registry,valid)}catch{}
  let additionalRejected=false;try{promoteM163Routes({...raw,routes:[...raw.routes,{...raw.routes[0],path:'assets/engine/unadmitted.mjs'}]},registry,valid)}catch{additionalRejected=true}
  let conflictRejected=false;try{promoteM163Routes({...raw,routes:[{...raw.routes[0],projectId:'H_EARTH',routeClass:'REGISTERED_PROJECT'},raw.routes[1]]},registry,valid)}catch{conflictRejected=true}
  const cases=[
    valid.eligible===true,
    mapped?.disposition==='PASS'&&mapped.routes.every(route=>route.projectId===M163_PROJECT),
    additionalRejected,conflictRejected,
    verifyM163CandidateEvidence({...arg,paths:[...paths,'unadmitted/file.js']}).eligible===false,
    verifyM163CandidateEvidence({...arg,task:'OTHER_OPERATION'}).eligible===false,
    verifyM163CandidateEvidence({...arg,source:{...source,author_association:'COLLABORATOR'}}).eligible===false,
    verifyM163CandidateEvidence({...arg,source:{...source,id:0}}).eligible===false,
    verifyM163CandidateEvidence({...arg,ledger:{activeScopes:{sample:{...lock,released:true}}}}).eligible===false,
    verifyM163CandidateEvidence({...arg,ledger:{activeScopes:{sample:{...lock,requestDigest:'0'.repeat(64)}}}}).eligible===false,
    verifyM163CandidateEvidence({...arg,ledger:{activeScopes:{sample:{...lock,governingHead:'0'.repeat(40)}}}}).eligible===false,
    verifyM163CandidateEvidence({...arg,ledger:{activeScopes:{sample:lock,second:lock}}}).eligible===false,
    verifyM163CandidateEvidence({...arg,source:{...source,body:source.body.replace('"projectId":"'+M163_PROJECT+'"','"projectId":"H_EARTH"')}}).eligible===false
  ];
  return {result:cases.every(Boolean)?'PASS':'FAIL',passed:cases.filter(Boolean).length,total:cases.length};
}

function selfTest(root) {
  const cases = [
    ['HTML_INSTRUCTION_COPY_IS_MICRO',['index.html'],'add approved instructions copy','STATIC_EDITORIAL_MICRO'],
    ['HTML_TYPO_IS_MICRO',['laws/index.html'],'fix typo in page text','STATIC_EDITORIAL_MICRO'],
    ['CSS_ORDER_IS_MICRO',['assets/compass/compass.capability-carousel.css'],'static presentation order change','STATIC_EDITORIAL_MICRO'],
    ['BOUNDED_CINEMATIC_JS_IS_PAGE_RELEASE',['index.html','assets/compass/compass.orientation-cinematic.js','assets/compass/compass.orientation-cinematic.css','assets/compass/compass.orientation-cinematic.render.js','assets/compass/compass.orientation-cinematic.media.js','scripts/verify-compass-orientation-cinematic.mjs'],'bounded non-interactive cinematic presentation playback','BOUNDED_PAGE_RELEASE'],
    ['CINEMATIC_CONTROLLER_MIX_REMAINS_RUNTIME',['index.html','assets/compass/compass.orientation-cinematic.js','assets/compass/compass.controller.js'],'bounded non-interactive cinematic presentation playback','RUNTIME_OR_AUTHORITY'],
    ['CINEMATIC_NAVIGATION_DECLARATION_REMAINS_RUNTIME',['index.html','assets/compass/compass.orientation-cinematic.js'],'non-interactive cinematic presentation with navigation change','RUNTIME_OR_AUTHORITY'],
    ['GENERIC_JS_REMAINS_RUNTIME',['assets/compass/example.js'],'bounded non-interactive cinematic presentation playback','RUNTIME_OR_AUTHORITY'],
    ['JS_CHANGE_IS_RUNTIME',['assets/compass/compass.controller.js'],'change guidance behavior','RUNTIME_OR_AUTHORITY'],
    ['HTML_NAVIGATION_CHANGE_IS_RUNTIME',['index.html'],'change navigation routing behavior','RUNTIME_OR_AUTHORITY'],
    ['AMBIGUOUS_HTML_FAILS_CLOSED',['index.html'],'update page','RUNTIME_OR_AUTHORITY'],
    ['CONTROL_PLANE_ALWAYS_GOVERNED',['.github/workflows/test.yml'],'edit copy','RUNTIME_OR_AUTHORITY']
  ].map(([id,paths,task,expected]) => {
    const actual = classifyPageMutation(paths,task);
    return {id,expected,actual:actual.mutationClass,pass:actual.mutationClass===expected};
  });
  const decisionFixtures = [
    buildWholeEstateExecutionDecision({mutationClass:'READ_ONLY',canonicalAdmissionRequired:false},['README.md'],'read status'),
    buildWholeEstateExecutionDecision(classifyPageMutation(['index.html'],'fix typo in page text'),['index.html'],'fix typo in page text'),
    buildWholeEstateExecutionDecision(classifyPageMutation(['.github/ai-router/router.v1.json'],'control plane repair'),['.github/ai-router/router.v1.json'],'control plane repair')
  ];
  const decisionChecks = [
    decisionFixtures[0].agentMode === 'NOT_REQUIRED' && decisionFixtures[0].invariants.readOnlyMayEscalateToMutationSemantics === false,
    decisionFixtures[1].gatePolicy.onlySelectedGatesMayBlock === true && decisionFixtures[1].candidateScopeRecognition.candidateCreatedPathNeedsSeparatePersistentRegistrationSolelyBecauseNew === false,
    decisionFixtures[1].precedentReuse.qualifyOnlyDeclaredDeltaAndDirectlyAffectedDependencies === true,
    decisionFixtures[2].agentMode === 'REQUIRED' && decisionFixtures[2].canonicalAdmissionRequired === true,
    decisionFixtures.every((decision) => decision.gatePolicy.filesystemDirectoryPrefixAloneMayBlock === false),
    decisionFixtures.every((decision) => decision.invariants.controlPlaneDefectMayManufactureProductPrerequisite === false),
    decisionFixtures.every((decision) => decision.continuity.mainMovementAloneForcesStrictSuccessor === false)
  ];
  const legacy = runLegacy(root,['--self-test']);
  let legacyReceipt=null;
  try { legacyReceipt=JSON.parse(legacy.stdout||'{}'); } catch {}
  const legacyPass=legacy.status===0&&legacyReceipt?.result==='PASS';
  const m163CandidateScope=m163ScopeSelfTest();
  return { schema:'PAGE_MUTATION_CLASSIFICATION_INSTRUMENT_SELF_TEST_v1', instrumentId:'PAGE_MUTATION_CLASSIFICATION_INSTRUMENT_v1', result:cases.every((c)=>c.pass)&&decisionChecks.every(Boolean)&&legacyPass&&m163CandidateScope.result==='PASS'?'PASS':'FAIL', scenarios:cases, wholeEstateExecutionDecisionChecks:decisionChecks, legacyRouterSelfTest:legacyPass?'PASS':'FAIL', m163CandidateScope };
}
const root = discoverRoot(process.cwd());
const argv = process.argv.slice(2);
const parsed = parseArgs(argv);
if (parsed.selfTest) { const receipt=selfTest(root); writeReceipt(parsed.output,receipt); process.exit(receipt.result==='PASS'?0:1); }
const paths=collectPaths(root,parsed);
if (!parsed.mutationIntent) {
  const legacy=runLegacy(root,stripOutputArg(argv));
  const routeReceipt=parseLegacyReceipt(legacy);
  const classification={mutationClass:'READ_ONLY',reasonCode:'READ_ONLY_ROUTE',canonicalAdmissionRequired:false,pageExcellenceRequired:false};
  const receipt={...routeReceipt,schema:'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v3',mutationIntent:false,wholeEstateExecutionDecision:buildWholeEstateExecutionDecision(classification,paths,parsed.task,routeReceipt)};
  writeReceipt(parsed.output,receipt);
  process.exit(legacy.status??1);
}
const classification=classifyPageMutation(paths,parsed.task);
const proportionalBypass = classification.mutationClass==='STATIC_EDITORIAL_MICRO' || classification.mutationClass==='BOUNDED_PAGE_RELEASE';
const legacy=runLegacy(root,proportionalBypass?stripMutationOnlyArgs(argv):stripOutputArg(argv));
const rawRouteReceipt=parseLegacyReceipt(legacy);
let routeReceipt=rawRouteReceipt;
let gen3096ScopeProof=null;
let gen3096ProofFailure=null;
// Legacy routing owns no general tools/ prefix. Only an authenticated active
// Gen3096 lock may recognize the three exact test paths for this operation.
if(parsed.task===GEN3096_OPERATION_ID && parsed.mutationIntent) {
  try {
    const { GEN3096_SCOPED_TEST_PATHS, verifyGen3096LiveAdmission } = await import('../h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.gen3096-admitted-candidate-scope.js');
    const proof=await verifyGen3096LiveAdmission(paths,parsed.task,parsed.mutationIntent);
    const exactTests=new Set(GEN3096_SCOPED_TEST_PATHS.map(p=>p.slice(1)));
    let promoted=0;
    const routes=rawRouteReceipt.routes.map(route=>{
      if(!exactTests.has(route.path)){
        if(route.projectId!=='H_EARTH'||route.disposition!=='PASS')
          throw new Error('GEN3096_NONTEST_ROUTE_NOT_H_EARTH_PASS');
        return route;
      }
      if(route.routeClass!=='UNREGISTERED'||route.disposition!=='BLOCK')
        throw new Error('GEN3096_LEGACY_TEST_ROUTE_CHANGED');
      promoted+=1;
      return {...route,routeClass:'AUTHENTIC_GEN3096_ADMITTED_TEST_PATH',
        projectId:'H_EARTH',disposition:'PASS'};
    });
    if(routes.length!==8||promoted!==3)
      throw new Error('GEN3096_EIGHT_PATH_ROUTER_COUNT_MISMATCH');
    gen3096ScopeProof=proof;
    routeReceipt={...rawRouteReceipt,routes,disposition:'PASS',
      legacyDisposition:rawRouteReceipt.disposition,
      admittedCandidateScopeRecognition:'GEN3096_EXACT_EIGHT_PATHS_ONLY'};
  }catch(error){
    gen3096ProofFailure=String(error.code??error.message??'GEN3096_PROVENANCE_INVALID');
  }
}
let m163ScopeProof=null;
let m163ScopeFailure=null;
if(parsed.task===M163_OPERATION_ID && parsed.mutationIntent){
  try {
    const proof=await verifyM163LiveAdmission(paths,parsed.task,parsed.mutationIntent);
    const registry=JSON.parse(fs.readFileSync(path.join(root,'.github/ai-router/router.v1.json'),'utf8'));
    routeReceipt=promoteM163Routes(rawRouteReceipt,registry,proof);
    m163ScopeProof=proof;
  }catch(error){
    m163ScopeFailure=String(error.code??error.message??'M163_ADMISSION_INVALID');
  }
}
const blocked=(legacy.status!==0&&!gen3096ScopeProof&&!m163ScopeProof)||routeReceipt.disposition!=='PASS';
const isStatic = classification.mutationClass==='STATIC_EDITORIAL_MICRO';
const passResult = isStatic ? 'PASS_STATIC_EDITORIAL_MICRO' : 'PASS_BOUNDED_PAGE_RELEASE';
const executionResult = isStatic ? 'NOT_REQUIRED_STATIC_EDITORIAL_MICRO' : 'NOT_REQUIRED_BOUNDED_PAGE_RELEASE';
const reasonCode = isStatic ? 'STATIC_EDITORIAL_MICRO_BYPASS_BY_DETERMINISTIC_CLASSIFIER' : 'BOUNDED_PAGE_RELEASE_BYPASS_BY_DETERMINISTIC_CLASSIFIER';
const successReason = isStatic ? 'STATIC_EDITORIAL_MICRO_CLASSIFIED_NO_CANONICAL_INTAKE_REQUIRED' : 'BOUNDED_PAGE_RELEASE_CLASSIFIED_NO_CANONICAL_INTAKE_REQUIRED';
const blockedReason = isStatic ? 'STATIC_EDITORIAL_ROUTE_NOT_PASS' : 'BOUNDED_PAGE_RELEASE_ROUTE_NOT_PASS';
const receipt={
  ...routeReceipt,
  schema:'REPOSITORY_AI_ENTRY_ROUTER_RECEIPT_v3',
  mutationIntent:true,
  ...(gen3096ScopeProof ? {gen3096AdmissionProvenance:gen3096ScopeProof} : {}),
  ...(gen3096ProofFailure ? {gen3096ProvenanceFailure:gen3096ProofFailure} : {}),
  ...(m163ScopeProof ? {gen3264AdmissionProvenance:m163ScopeProof} : {}),
  ...(m163ScopeFailure ? {gen3264ProvenanceFailure:m163ScopeFailure} : {}),
  pageMutationClassification:{
    schema:'PAGE_MUTATION_CLASSIFICATION_RECEIPT_v1',
    instrumentId:'PAGE_MUTATION_CLASSIFICATION_INSTRUMENT_v1',
    result:blocked?'BLOCK':(proportionalBypass?passResult:'PASS_GOVERNED_RUNTIME_OR_AUTHORITY'),
    ...classification,
    declaredPaths:paths,
    task:parsed.task||null,
    ambiguityPolicy:'RUNTIME_OR_AUTHORITY'
  },
  wholeEstateExecutionDecision:buildWholeEstateExecutionDecision(classification,paths,parsed.task,routeReceipt),
  ...(proportionalBypass?{operationIntakeExecution:blocked?null:{
    schema:'REPOSITORY_AI_EXECUTION_ROUTE_RESOLUTION_RECEIPT_v1',
    result:executionResult,
    backendId:null,
    canonicalAdmissionRequired:false,
    reasonCode
  }}:{}),
  disposition:proportionalBypass?(blocked?routeReceipt.disposition:'PASS'):routeReceipt.disposition,
  reasonCodes:[...new Set([...(routeReceipt.reasonCodes??[]),proportionalBypass?(blocked?blockedReason:successReason):'WHOLE_ESTATE_EXECUTION_DECISION_BOUND'])]
};
writeReceipt(parsed.output,receipt);
process.exit(blocked?1:0);
