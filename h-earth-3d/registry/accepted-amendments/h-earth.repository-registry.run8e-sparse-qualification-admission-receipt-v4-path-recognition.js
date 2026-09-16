/** H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_EXACT_PATH_RECOGNITION_v1 */
import baseFacade from './h-earth.repository-registry.audralia-tablet-single-context-runtime-path-recognition.js';

const GOVERNING_HEAD='f6bcb230ba66c7747d4e95744c95490e62272eb0';
const NODE_ID='H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_EXACT_PATH_RECOGNITION_SCOPE';
const TARGET='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/admission-receipt.v4.json';
const INVENTED_SIBLING='/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/admission-receipt.v4.sibling.json';
const PREVIOUSLY_VALID_PATH='/showroom/globe/h-earth/terrain-estate-construction-v1/audralia-tablet-single-context-clouds-runtime.mjs';

function deepFreeze(value,seen=new WeakSet()){if(value===null||typeof value!=='object'||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))deepFreeze(nested,seen);return Object.isFrozen(value)?value:Object.freeze(value);}
function normalizePath(value){if(typeof value!=='string')return null;let result=value.trim().replaceAll('\\\\','/');if(result.startsWith('./'))result=result.slice(2);if(!result.startsWith('/'))result=`/${result}`;result=result.replace(/\/{2,}/g,'/');return result.length>1&&result.endsWith('/')?result.slice(0,-1):result;}

export const H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE=deepFreeze({
  nodeId:NODE_ID,
  nodeType:'BOUNDARY_PACKET',
  nodeSubtype:'H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_EXACT_PATH_RECOGNITION_SCOPE',
  displayName:'H-Earth Run8e Sparse Qualification Admission Receipt v4 Exact-Path Recognition',
  description:'Read-only exact-path recognition for the legitimate run8e sparse-qualification admission receipt required by automatic H-Earth preflight.',
  repositoryPaths:[TARGET],
  repositoryOccurrences:[],
  lifecycleStatus:'CANDIDATE_PATH_RECOGNITION',
  authorityClass:'AUDIT_ONLY',
  authorityPosture:'READ_ONLY_PATH_RESOLUTION',
  registrationEffect:'PATH_RESOLUTION_ONLY',
  authoritySource:[
    'ISSUE_3561',
    'CANONICAL_OPERATION_INTAKE_RETURN_V1:5702351945',
    'CANONICAL_LOCK_GENERATION_2335',
    'CANONICAL_WORKFLOW_RUN_35133298281',
    `EXACT_GOVERNING_HEAD=${GOVERNING_HEAD}`,
    'CANONICAL_REQUEST_DIGEST=1fc23b685fbd0f231b1543f033052386828b6d4885d03d91db2953dd58b80bf6'
  ],
  authorityScope:[
    'READ_ONLY_PATH_RESOLUTION',
    'AUTOMATIC_H_EARTH_PREFLIGHT'
  ],
  authorityLimitations:[
    'NO_PRODUCT_AUTHORITY',
    'NO_RENDER_AUTHORITY',
    'NO_RUNTIME_AUTHORITY',
    'NO_CANDIDATE_MUTATION',
    'NO_PREFIX_WIDE_REGISTRATION',
    'NO_PREFLIGHT_WAIVER',
    'NO_DEPLOYMENT',
    'NO_PUBLICATION'
  ],
  parentRelations:[],
  childRelations:[],
  peerRelations:[],
  upstreamBoundaries:[],
  downstreamBoundaries:[],
  dependencyRelations:[],
  cardinalRole:'NONE',
  cardinalStatus:'NONE',
  cardinalCompleteness:'NOT_APPLICABLE',
  allowedMutationScope:'NONE_REGISTRATION_IS_READ_ONLY_PATH_RESOLUTION',
  unresolvedFields:[]
});

const baseInstance=baseFacade.getHEarthRepositoryRegistryInstance();
const registryInstance=deepFreeze({...baseInstance,nodes:[
  ...baseInstance.nodes.filter(node=>node.nodeId!==NODE_ID),
  H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE
]});

export function getHEarthRepositoryRegistryInstance(){return registryInstance;}
export function getHEarthRepositoryRegistryNode(nodeId){return nodeId===NODE_ID?H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE:baseFacade.getHEarthRepositoryRegistryNode(nodeId);}
export function getHEarthRepositoryRegistryEvidence(evidenceId){return baseFacade.getHEarthRepositoryRegistryEvidence(evidenceId);}
export function resolveHEarthRepositoryRegistryPath(repositoryPath){
  const normalized=normalizePath(repositoryPath);
  if(normalized!==TARGET)return baseFacade.resolveHEarthRepositoryRegistryPath(normalized??repositoryPath);
  const base=baseFacade.resolveHEarthRepositoryRegistryPath(normalized);
  return deepFreeze({...base,repositoryPath:normalized,resolved:true,unresolved:false,
    nodes:[...(base.nodes??[]),H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE]});
}
export function resolveHEarthRepositoryRegistryOccurrence(input={}){return baseFacade.resolveHEarthRepositoryRegistryOccurrence(input);}
export function findHEarthRepositoryRegistryNodes(criteria={}){
  const base=baseFacade.findHEarthRepositoryRegistryNodes(criteria);
  const normalized=criteria.repositoryPath==null?null:normalizePath(criteria.repositoryPath);
  const node=H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE;
  const match=(criteria.nodeId==null||criteria.nodeId===NODE_ID)&&
    (normalized==null||normalized===TARGET)&&
    (criteria.nodeType==null||criteria.nodeType===node.nodeType)&&
    (criteria.nodeSubtype==null||criteria.nodeSubtype===node.nodeSubtype)&&
    (criteria.authorityClass==null||criteria.authorityClass===node.authorityClass)&&
    (criteria.lifecycleStatus==null||criteria.lifecycleStatus===node.lifecycleStatus);
  return deepFreeze(match?[...base,node]:base);
}
export function getHEarthRepositoryRegistryRelationsForNode(nodeId,direction='BOTH'){return nodeId===NODE_ID?Object.freeze([]):baseFacade.getHEarthRepositoryRegistryRelationsForNode(nodeId,direction);}
export function getHEarthRepositoryRegistryDependencyClosure(nodeId){return nodeId===NODE_ID?deepFreeze({nodeId,nodes:[H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE],relations:[],resolved:true}):baseFacade.getHEarthRepositoryRegistryDependencyClosure(nodeId);}
export function getHEarthRepositoryRegistryDiscoveryDescriptor(){return baseFacade.getHEarthRepositoryRegistryDiscoveryDescriptor();}

export function verifyHEarthRun8eSparseQualificationAdmissionReceiptV4PathRecognition(){
  const resolution=resolveHEarthRepositoryRegistryPath(TARGET);
  const siblingResolution=resolveHEarthRepositoryRegistryPath(INVENTED_SIBLING);
  const prefixResolution=resolveHEarthRepositoryRegistryPath('/h-earth-3d/control-plane/run8e-sparse-qualification/execution-authority/');
  const previousResolution=resolveHEarthRepositoryRegistryPath(PREVIOUSLY_VALID_PATH);
  const node=H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_NODE;
  const checks=deepFreeze({
    exactTargetPathCount:node.repositoryPaths.length===1,
    targetPathResolves:resolution.resolved===true&&(resolution.nodes??[]).some(item=>item.nodeId===NODE_ID),
    neighboringInventedSiblingDoesNotResolve:siblingResolution.resolved!==true&&!(siblingResolution.nodes??[]).some(item=>item.nodeId===NODE_ID),
    previouslyValidPathRemainsValid:previousResolution.resolved===true,
    exactPathOnly:node.repositoryPaths.every(path=>path===TARGET),
    noPrefixRegistration:!(prefixResolution.nodes??[]).some(item=>item.nodeId===NODE_ID),
    auditOnly:node.authorityClass==='AUDIT_ONLY',
    readOnlyPathResolution:node.authorityPosture==='READ_ONLY_PATH_RESOLUTION'&&node.registrationEffect==='PATH_RESOLUTION_ONLY',
    automaticHEarthPreflight:node.authorityScope.includes('AUTOMATIC_H_EARTH_PREFLIGHT'),
    noProductAuthority:node.authorityLimitations.includes('NO_PRODUCT_AUTHORITY'),
    noRenderAuthority:node.authorityLimitations.includes('NO_RENDER_AUTHORITY'),
    noRuntimeAuthority:node.authorityLimitations.includes('NO_RUNTIME_AUTHORITY'),
    noCandidateMutation:node.authorityLimitations.includes('NO_CANDIDATE_MUTATION'),
    noPrefixWideRegistration:node.authorityLimitations.includes('NO_PREFIX_WIDE_REGISTRATION'),
    noPreflightWaiver:node.authorityLimitations.includes('NO_PREFLIGHT_WAIVER'),
    noDeployment:node.authorityLimitations.includes('NO_DEPLOYMENT'),
    noPublication:node.authorityLimitations.includes('NO_PUBLICATION')
  });
  const eligible=Object.values(checks).every(Boolean);
  return deepFreeze({
    eligible,
    status:eligible?'H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_PASS':'H_EARTH_RUN8E_SPARSE_QUALIFICATION_ADMISSION_RECEIPT_V4_PATH_RECOGNITION_FAIL',
    governingHead:GOVERNING_HEAD,
    targetPath:TARGET,
    inventedSibling:INVENTED_SIBLING,
    previouslyValidPath:PREVIOUSLY_VALID_PATH,
    checks
  });
}

export default Object.freeze({...baseFacade,getHEarthRepositoryRegistryInstance,getHEarthRepositoryRegistryNode,getHEarthRepositoryRegistryEvidence,resolveHEarthRepositoryRegistryPath,resolveHEarthRepositoryRegistryOccurrence,findHEarthRepositoryRegistryNodes,getHEarthRepositoryRegistryRelationsForNode,getHEarthRepositoryRegistryDependencyClosure,getHEarthRepositoryRegistryDiscoveryDescriptor});
