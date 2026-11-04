/**
 * Gen3096 candidate scope: exact-path, read-only registry recognition.
 * Gen3101 separately authorizes this control-plane amendment. It does not
 * authorize source, renderer, terrain, merge or publication mutations.
 */
import crypto from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';
import baseFacade from './h-earth.repository-registry.mountain-traversal-20261006-path-recognition.js';

const REPO = 'smansfield635-create/smansfield635-create.github.io';
const OP = 'H_EARTH_SPATIAL_FRAME_SELECTION_20261104_001';
const MAIN = 'a508c32482b67410aaa15b5111e87a0fa5dae906';
const COMMENT = 6637365749;
const GENERATION = 3096;
const STORE = new AsyncLocalStorage();
const ORIGINAL = Object.freeze([
  'showroom/globe/h-earth/vegetation-prototype/route.js',
  'showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js',
  'showroom/globe/h-earth/vegetation-prototype/spatial-evidence.v1.js',
  'showroom/globe/h-earth/vegetation-prototype/spatial-selection-ui.v1.js',
  'tools/h-earth-loading-report.test.mjs',
  'tools/h-earth-spatial-evidence.test.mjs',
  'tools/h-earth-spatial-selection-ui.test.mjs',
  'h-earth-3d/evidence/spatial-diagnostics-v1/**'
]);
const TOOLS = new Set(ORIGINAL.filter(p => p.startsWith('tools/')).map(p => '/' + p));
const ROOTED = Object.freeze(ORIGINAL.filter(p => !p.startsWith('tools/')).map(p => '/' + p));
const TARGETS = new Set(ORIGINAL.map(p => '/' + p));
const BLOBS = Object.freeze({
  '/showroom/globe/h-earth/vegetation-prototype/route.js':'8e8df594b8968f6bb17f32dc4ed7025bd2488bd0',
  '/showroom/globe/h-earth/vegetation-prototype/loading-screen.v1.js':'04f1c76202e121f2f9ab77e41913b12a727d664b',
  '/tools/h-earth-loading-report.test.mjs':'9b2701ee27ee5bc7a87e44cdeb85e2fea83d73d8'
});
const stable = v => Array.isArray(v) ? v.map(stable) : v && typeof v === 'object' ?
  Object.fromEntries(Object.keys(v).sort().map(k => [k, stable(v[k])])) : v;
const digest = s => crypto.createHash('sha256').update(s).digest('hex');
const normalize = s => typeof s !== 'string' ? null :
  ('/' + s.trim().replaceAll('\\', '/').replace(/^\/+/, '')).replace(/\/+/g, '/');
const equal = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const error = code => { const e = new Error(code); e.code = code; throw e; };
const scoped = () => STORE.getStore()?.operationId === OP;

export const GEN3096_ORIGINAL_ALLOWED_PATHS = ORIGINAL;
export const GEN3096_SCOPED_TEST_PATHS = Object.freeze([...TOOLS]);
export const GEN3096_ROOTED_PATHS = ROOTED;
export const GEN3096_SUBJECT_HEAD = MAIN;
export const GEN3096_OPERATION_ID = OP;

function occurrence(path) {
  const present = Object.hasOwn(BLOBS, path);
  return Object.freeze({
    repository: REPO, refType: 'COMMIT', refName: MAIN, commitSha: MAIN,
    path, gitBlobSha: present ? BLOBS[path] : null,
    contentSha256: null, byteCount: null,
    existenceStatus: present ? 'PRESENT' : 'ABSENT',
    fetchbackStatus: present ? 'VERIFIED_PRESENT_AT_GOVERNING_MAIN' :
      'NO_BLOB_AT_GOVERNING_MAIN',
    occurrenceClass: path.endsWith('/**') ?
      'AUTHORIZED_LITERAL_GLOB_NOT_MATERIALIZED_FILE' :
      'AUTHORIZED_CONSTRUCTION_CANDIDATE_PATH'
  });
}
const runtimeOccurrences = Object.freeze(ROOTED.map(occurrence));
const testOccurrences = Object.freeze([...TOOLS].map(occurrence));
function node(id, paths, occurrences, subtype) {
  return Object.freeze({
    nodeId:id, nodeType:'BOUNDARY_PACKET', nodeSubtype:subtype,
    displayName:'Gen3096 exact admitted candidate paths',
    description:'Read-only operation-specific path recognition; not an implementation or acceptance claim',
    repositoryPaths:paths, repositoryOccurrences:occurrences,
    evidenceClass:'CANONICAL_OWNER_ADMISSION_AND_NATIVE_STOP',
    evidenceReferences:[], lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',
    authorityClass:'AUDIT_ONLY', authorityPosture:'PATH_RESOLUTION_ONLY',
    registrationEffect:'PATH_RESOLUTION_ONLY',
    authoritySource:['GEN3096_CANONICAL_INTAKE','ISSUE_6911_COMMENT_6640810528'],
    authorityScope:['EXACT_PATH_RESOLUTION','READ_ONLY_PREFLIGHT_RESOLUTION'],
    authorityLimitations:['NO_PRODUCT_OR_RUNTIME_MUTATION_AUTHORITY','NO_PREFIX_WIDE_REGISTRATION',
      'NO_PREFLIGHT_WAIVER','NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION_AUTHORITY'],
    parentRelations:[],childRelations:[],peerRelations:[],
    upstreamBoundaries:[],downstreamBoundaries:[],dependencyRelations:[],
    cardinalRole:'NONE',cardinalStatus:'NONE',cardinalCompleteness:'NOT_APPLICABLE',
    orderingRules:[],allowedMutationScope:'NONE_PATH_RECOGNITION_ONLY',
    prohibitedMutations:[],requiredValidations:[],stoppingBoundaries:[],
    currentIdentityReferences:['GOVERNING_MAIN='+MAIN,'GENERATION=3096'],
    unresolvedFields:[]
  });
}
const RUNTIME_NODE=node('H_EARTH_GEN3096_SPATIAL_ROOTED_CANDIDATE_PATHS',
  ROOTED,runtimeOccurrences,'EXACT_ROOTED_CANDIDATE_PATHS');
const TEST_NODE=node('H_EARTH_GEN3096_SPATIAL_SCOPED_TEST_PATHS',
  Object.freeze([...TOOLS]),testOccurrences,'ADMISSION_ONLY_EXACT_TEST_PATHS');
const baseInstance = baseFacade.getHEarthRepositoryRegistryInstance();
const runtimeInstance = Object.freeze({...baseInstance,
  nodes:Object.freeze([...baseInstance.nodes,RUNTIME_NODE])});
const scopedInstance = Object.freeze({...runtimeInstance,
  nodes:Object.freeze([...runtimeInstance.nodes,TEST_NODE])});

export function gen3096TestPathAuthorized(path) {
  return scoped() && TOOLS.has(normalize(path));
}
export function getHEarthRepositoryRegistryInstance() {
  return scoped() ? scopedInstance : runtimeInstance;
}
export function getHEarthRepositoryRegistryNode(nodeId) {
  if(nodeId===RUNTIME_NODE.nodeId)return RUNTIME_NODE;
  if(nodeId===TEST_NODE.nodeId)return scoped()?TEST_NODE:null;
  return baseFacade.getHEarthRepositoryRegistryNode(nodeId);
}
export function getHEarthRepositoryRegistryEvidence(evidenceId) {
  return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);
}
export function resolveHEarthRepositoryRegistryPath(path) {
  const p=normalize(path);
  const allowed=ROOTED.includes(p)||(scoped()&&TOOLS.has(p));
  const base=baseFacade.resolveHEarthRepositoryRegistryPath(p??path);
  if(!allowed)return base;
  const n=TOOLS.has(p)?TEST_NODE:RUNTIME_NODE;
  const o=occurrence(p);
  return Object.freeze({...base,repositoryPath:p,resolved:true,unresolved:false,
    nodes:Object.freeze([...(base.nodes??[]),n]),
    occurrences:Object.freeze([...(base.occurrences??[]),o])});
}
export function resolveHEarthRepositoryRegistryOccurrence(query={}) {
  const p=normalize(query.path);
  const candidate=(ROOTED.includes(p)||(scoped()&&TOOLS.has(p)))?occurrence(p):null;
  const match=candidate &&
    (query.refType==null||query.refType===candidate.refType) &&
    (query.refName==null||query.refName===candidate.refName) &&
    (query.commitSha==null||query.commitSha===candidate.commitSha) &&
    (query.existenceStatus==null||query.existenceStatus===candidate.existenceStatus);
  const base=baseFacade.resolveHEarthRepositoryRegistryOccurrence({...query,path:p??query.path});
  return Object.freeze({...base,matches:Object.freeze([...(base.matches??[]),
    ...(match?[{nodeId:TOOLS.has(p)?TEST_NODE.nodeId:RUNTIME_NODE.nodeId,
      node:TOOLS.has(p)?TEST_NODE:RUNTIME_NODE,occurrence:candidate}]:[])]),
    resolved:base.resolved===true||Boolean(match)});
}
export function findHEarthRepositoryRegistryNodes(criteria={}) {
  const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const filter=n=>(criteria.nodeId==null||criteria.nodeId===n.nodeId)&&
    (criteria.repositoryPath==null||n.repositoryPaths.includes(normalize(criteria.repositoryPath)))&&
    (criteria.nodeType==null||criteria.nodeType===n.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===n.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===n.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===n.lifecycleStatus);
  return Object.freeze([...base,...[RUNTIME_NODE,...(scoped()?[TEST_NODE]:[])].filter(filter)]);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH') {
  if(nodeId===RUNTIME_NODE.nodeId||nodeId===TEST_NODE.nodeId)return Object.freeze([]);
  return baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);
}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId) {
  const n=getHEarthRepositoryRegistryNode(nodeId);
  if(n&&(nodeId===RUNTIME_NODE.nodeId||nodeId===TEST_NODE.nodeId))return Object.freeze({
    nodeId,nodes:[n],relations:[],resolved:true});
  return baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);
}
export function getHEarthRepositoryRegistryDiscoveryDescriptor() {
  return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();
}

/** Pure verifier, never an authority/activation API. Inputs must be authentic GitHub API data. */
export function verifyGen3096AdmissionEvidence({source,ledger,lockRefHead}={}) {
  const failure=reason=>Object.freeze({eligible:false,reason,authorityEffect:'NONE'});
  try {
    if(!/^[a-f0-9]{40}$/.test(lockRefHead??''))return failure('LOCK_REF_INVALID');
    if(source?.id!==COMMENT||source.user?.login!=='smansfield635-create'||
      source.author_association!=='OWNER'||!String(source.issue_url).endsWith('/6911'))
      return failure('OWNER_COMMENT_UNVERIFIED');
    if(!source.body?.startsWith('CANONICAL_OPERATION_INTAKE_REQUEST_V1\n'))
      return failure('OWNER_COMMENT_MARKER_INVALID');
    const packet=JSON.parse(source.body.slice(source.body.indexOf('\n')+1));
    const r=packet.operationRequest,p=packet.constructionProcedure;
    if(packet.schema!=='CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1'||
      r?.operationId!==OP||r?.projectId!=='H_EARTH'||
      r?.exactGoverningHead!==MAIN||p?.exactGoverningHead!==MAIN||
      !equal(r?.allowedPaths,ORIGINAL)||!equal(p?.exactAllowedRepositoryPaths,ORIGINAL))
      return failure('ORIGINAL_EIGHT_PATH_ADMISSION_MISMATCH');
    const locks=Object.values(ledger?.activeScopes??{}).filter(x=>x?.operationId===OP);
    if(locks.length!==1)return failure('CANONICAL_LOCK_NOT_UNIQUE');
    const lock=locks[0],inv=lock.authorityProvenance?.invocation;
    if(lock.lockGeneration!==GENERATION||lock.governingHead!==MAIN||
      !['ADMITTED_LOCKED','EXECUTING'].includes(lock.state)||lock.released!==false||
      lock.scopeHash!==digest(lock.lockScope.trim().toUpperCase())||
      lock.requestDigest!==digest(JSON.stringify(stable(r)))||
      lock.procedureLocatorDigest!==digest(JSON.stringify(stable(p)))||
      inv?.commentId!==COMMENT||inv?.repository!==REPO||
      inv?.commentBodySha256!==digest(source.body)||
      inv?.commentAuthorLogin!=='smansfield635-create'||
      inv?.commentAuthorAssociation!=='OWNER')
      return failure('CANONICAL_LOCK_PROVENANCE_MISMATCH');
    return Object.freeze({eligible:true,operationId:OP,lockGeneration:GENERATION,
      governingHead:MAIN,scopeHash:lock.scopeHash,sourceCommentId:COMMENT,
      lockRefHead,allowedPaths:ORIGINAL,authorityEffect:'NONE_PATH_RECOGNITION_ONLY'});
  }catch{return failure('ADMISSION_EVIDENCE_INVALID');}
}
async function fetchJson(url) {
  const token=process.env.GITHUB_TOKEN??process.env.GH_TOKEN??null;
  const headers={'Accept':'application/vnd.github+json',
    ...(token?{'Authorization':'Bearer '+token}:{})};
  const res=await fetch(url,{headers});
  if(!res.ok)error('GITHUB_PROVENANCE_FETCH_FAILED_'+res.status);
  return res.json();
}
/** Fails closed offline, on stale/invalid lock, or on any unadmitted path. */
export async function verifyGen3096LiveAdmission(paths,taskText,mutationIntent) {
  const given=[...new Set(paths.map(p=>normalize(p)?.slice(1)))].sort();
  if(taskText!==OP||mutationIntent!==true||!equal(given,[...ORIGINAL].sort()))
    error('GEN3096_EXACT_EIGHT_INPUTS_REQUIRED');
  const root='https://api.github.com/repos/'+REPO;
  const [source,ref]=await Promise.all([
    fetchJson(root+'/issues/comments/'+COMMENT),
    fetchJson(root+'/git/ref/heads/operation-locks/repository-operation-intake-v1')
  ]);
  const head=ref?.object?.sha;
  if(!/^[a-f0-9]{40}$/.test(head??''))error('GEN3096_LEDGER_HEAD_INVALID');
  const doc=await fetchJson(root+'/contents/.github/operation-intake/active-operation-ledger.v1.json?ref='+head);
  if(!/^[a-f0-9]{40}$/.test(doc?.sha??''))error('GEN3096_LEDGER_BLOB_ID_INVALID');
  // The canonical ledger exceeds GitHub Contents API's 1 MB inline limit.
  // Reuse the existing owner-connector intake's immutable Git Blob fallback.
  const blob=doc.encoding==='base64'&&typeof doc.content==='string'&&doc.content.trim()
    ? doc
    : await fetchJson(root+'/git/blobs/'+doc.sha);
  if(blob?.encoding!=='base64'||typeof blob.content!=='string')
    error('GEN3096_LEDGER_BLOB_INVALID');
  const ledger=JSON.parse(Buffer.from(blob.content.replace(/\s/g,''),'base64').toString('utf8'));
  const proof=verifyGen3096AdmissionEvidence({source,ledger,lockRefHead:head});
  if(!proof.eligible)error('GEN3096_ADMISSION_AUTHENTICATION_FAILED:'+proof.reason);
  return proof;
}
export async function withGen3096VerifiedScope(paths,taskText,mutationIntent,callback) {
  const proof=await verifyGen3096LiveAdmission(paths,taskText,mutationIntent);
  return STORE.run({operationId:OP,proof},()=>({proof,receipt:callback()}));
}
export default Object.freeze({...baseFacade,
  getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,
  getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,
  resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,
  getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure,
  getHEarthRepositoryRegistryDiscoveryDescriptor});
