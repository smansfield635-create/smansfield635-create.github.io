#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUEST_SCHEMA = 'PROGRESSIVE_SYSTEM_CONTINUITY_ASSESSMENT_REQUEST_v1';
export const RECEIPT_SCHEMA = 'PROGRESSIVE_SYSTEM_CONTINUITY_ASSESSMENT_RECEIPT_v1';
export const REGISTRY_SCHEMA = 'PROGRESSIVE_SYSTEM_CONTINUITY_GAP_REGISTRY_v1';
export const DEFAULT_REGISTRY = '.github/ai-router/system-continuity/gap-registry.v1.json';
export const CLOSURES = new Set(['OPEN','LOCAL_CAPABILITY_CLOSED','INTERFACE_CONTINUITY_CLOSED','SYSTEM_GAP_CLOSED']);
const HEX40 = /^[0-9a-f]{40}$/;
const PROOF_KEYS = ['localCorrectness','interfaceCompatibility','transitionSimulation','remoteInvocation','postMergeContinuity'];
const PRODUCER_POLICIES = new Set(['STABLE_OPERATION_ID','FRESH_SUCCESSOR_OPERATION_ID_REQUIRED','ANY_EXPLICIT_OPERATION_ID']);
const CONSUMER_POLICIES = new Set(['EXACT_REGISTERED_OPERATION_ID','SUCCESSOR_LINEAGE_OPERATION_ID_ACCEPTED','ANY_EXPLICIT_OPERATION_ID']);

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]))
    : value;

class ContinuityError extends Error {
  constructor(code, detail = null) { super(detail ? `${code}:${detail}` : code); this.code = code; this.detail = detail; }
}
const fail = (code, detail = null) => { throw new ContinuityError(code, detail); };
const obj = (v, code) => { if (!v || typeof v !== 'object' || Array.isArray(v)) fail(code); return v; };
const arr = (v, code) => { if (!Array.isArray(v)) fail(code); return v; };
const str = (v, code) => { if (typeof v !== 'string' || !v.trim()) fail(code); return v; };
const uniqueStrings = (v, code) => {
  arr(v, code); v.forEach(x => str(x, code));
  if (new Set(v).size !== v.length) fail(code, 'DUPLICATE');
  return v;
};

function normalizePath(value) {
  const p = str(value, 'PATH_INVALID').trim().replaceAll('\\', '/').replace(/^\.\/+/, '');
  if (p.startsWith('/') || p === '..' || p.startsWith('../') || p.includes('/../') || p.includes('//')) fail('PATH_INVALID', value);
  return p;
}

export function validateRegistry(raw) {
  const registry = obj(raw, 'GAP_REGISTRY_INVALID');
  if (registry.schema !== REGISTRY_SCHEMA || registry.status !== 'ACTIVE_FAIL_CLOSED') fail('GAP_REGISTRY_INVALID');
  const records = arr(registry.records, 'GAP_REGISTRY_RECORDS_INVALID');
  const ids = new Set();
  for (const record of records) {
    obj(record, 'GAP_RECORD_INVALID');
    str(record.gapId, 'GAP_ID_INVALID');
    if (ids.has(record.gapId)) fail('DUPLICATE_GAP_ID', record.gapId); ids.add(record.gapId);
    if (!['OPEN','CLOSED_BOUNDED','SUPERSEDED'].includes(record.status)) fail('GAP_STATUS_INVALID', record.gapId);
    uniqueStrings(record.interfaceKeys ?? [], 'GAP_INTERFACE_KEYS_INVALID');
    uniqueStrings(record.pathScopes ?? [], 'GAP_PATH_SCOPES_INVALID');
    uniqueStrings(record.evidenceRefs ?? [], 'GAP_EVIDENCE_REFS_INVALID');
    uniqueStrings(record.closureRequirements ?? [], 'GAP_CLOSURE_REQUIREMENTS_INVALID');
    if (record.authorityCreated !== false) fail('GAP_RECORD_AUTHORITY_INFLATION', record.gapId);
  }
  return stable(registry);
}

function validateProof(proof, key) {
  obj(proof, `PROOF_INVALID:${key}`);
  if (!['PASS','FAIL','NOT_PROVEN'].includes(proof.status)) fail('PROOF_STATUS_INVALID', key);
  const refs = uniqueStrings(proof.refs ?? [], `PROOF_REFS_INVALID:${key}`);
  if (proof.status === 'PASS' && refs.length === 0) fail('PASS_PROOF_REQUIRES_REFERENCE', key);
  return stable({status: proof.status, refs});
}

function validateProducer(raw) {
  const p = obj(raw, 'PRODUCER_CONTRACT_INVALID');
  str(p.contractId, 'PRODUCER_CONTRACT_ID_INVALID');
  if (!PRODUCER_POLICIES.has(p.operationIdPolicy)) fail('PRODUCER_OPERATION_ID_POLICY_INVALID', p.contractId);
  const outputReceiptSchemas = uniqueStrings(p.outputReceiptSchemas, 'PRODUCER_RECEIPT_SCHEMAS_INVALID');
  const interfaceKeys = uniqueStrings(p.interfaceKeys ?? [], 'PRODUCER_INTERFACE_KEYS_INVALID');
  return stable({contractId:p.contractId, operationIdPolicy:p.operationIdPolicy, outputReceiptSchemas, interfaceKeys});
}

function validateConsumer(raw) {
  const c = obj(raw, 'CONSUMER_CONTRACT_INVALID');
  str(c.contractId, 'CONSUMER_CONTRACT_ID_INVALID');
  if (!CONSUMER_POLICIES.has(c.operationIdPolicy)) fail('CONSUMER_OPERATION_ID_POLICY_INVALID', c.contractId);
  const acceptedReceiptSchemas = uniqueStrings(c.acceptedReceiptSchemas, 'CONSUMER_RECEIPT_SCHEMAS_INVALID');
  const interfaceKeys = uniqueStrings(c.interfaceKeys ?? [], 'CONSUMER_INTERFACE_KEYS_INVALID');
  return stable({contractId:c.contractId, operationIdPolicy:c.operationIdPolicy, acceptedReceiptSchemas, interfaceKeys});
}

function validateAdapter(raw) {
  const a = obj(raw, 'ADAPTER_INVALID');
  str(a.adapterId, 'ADAPTER_ID_INVALID');
  if (a.status !== 'PROVEN') fail('ADAPTER_NOT_PROVEN', a.adapterId);
  if (!PRODUCER_POLICIES.has(a.fromOperationIdPolicy)) fail('ADAPTER_FROM_OPERATION_POLICY_INVALID', a.adapterId);
  if (!CONSUMER_POLICIES.has(a.toOperationIdPolicy)) fail('ADAPTER_TO_OPERATION_POLICY_INVALID', a.adapterId);
  str(a.fromReceiptSchema, 'ADAPTER_FROM_RECEIPT_INVALID');
  str(a.toReceiptSchema, 'ADAPTER_TO_RECEIPT_INVALID');
  const refs = uniqueStrings(a.evidenceRefs, 'ADAPTER_EVIDENCE_INVALID');
  if (!refs.length) fail('ADAPTER_EVIDENCE_INVALID', a.adapterId);
  return stable({...a, evidenceRefs: refs});
}

function validateEdge(raw, producerIds, consumerIds) {
  const edge = obj(raw, 'EDGE_INVALID');
  str(edge.edgeId, 'EDGE_ID_INVALID');
  if (!producerIds.has(edge.producerContractId)) fail('EDGE_PRODUCER_NOT_FOUND', edge.edgeId);
  if (!consumerIds.has(edge.consumerContractId)) fail('EDGE_CONSUMER_NOT_FOUND', edge.edgeId);
  str(edge.producerReceiptSchema, 'EDGE_PRODUCER_RECEIPT_INVALID');
  return stable({edgeId:edge.edgeId, producerContractId:edge.producerContractId, consumerContractId:edge.consumerContractId, producerReceiptSchema:edge.producerReceiptSchema, adapterId:edge.adapterId ?? null});
}

export function validateRequest(raw) {
  const r = obj(raw, 'ASSESSMENT_REQUEST_INVALID');
  if (r.schema !== REQUEST_SCHEMA) fail('ASSESSMENT_REQUEST_SCHEMA_MISMATCH');
  for (const key of ['assessmentId','subjectHead','systemId','changedPaths','interfaceKeys','relatedGapIds','producerContracts','consumerContracts','edges','adapters','proofs','requestedClosure']) {
    if (!Object.hasOwn(r, key)) fail('ASSESSMENT_REQUEST_FIELD_MISSING', key);
  }
  str(r.assessmentId, 'ASSESSMENT_ID_INVALID');
  if (!HEX40.test(r.subjectHead)) fail('SUBJECT_HEAD_INVALID');
  str(r.systemId, 'SYSTEM_ID_INVALID');
  const changedPaths = uniqueStrings(r.changedPaths, 'CHANGED_PATHS_INVALID').map(normalizePath);
  const interfaceKeys = uniqueStrings(r.interfaceKeys, 'INTERFACE_KEYS_INVALID');
  const relatedGapIds = uniqueStrings(r.relatedGapIds, 'RELATED_GAP_IDS_INVALID');
  if (!CLOSURES.has(r.requestedClosure)) fail('REQUESTED_CLOSURE_INVALID');
  const producerContracts = arr(r.producerContracts, 'PRODUCER_CONTRACTS_INVALID').map(validateProducer);
  const consumerContracts = arr(r.consumerContracts, 'CONSUMER_CONTRACTS_INVALID').map(validateConsumer);
  if (!producerContracts.length || !consumerContracts.length) fail('PRODUCER_AND_CONSUMER_REQUIRED');
  const producerIds = new Set(producerContracts.map(x => x.contractId));
  const consumerIds = new Set(consumerContracts.map(x => x.contractId));
  if (producerIds.size !== producerContracts.length || consumerIds.size !== consumerContracts.length) fail('DUPLICATE_CONTRACT_ID');
  const adapters = arr(r.adapters, 'ADAPTERS_INVALID').map(validateAdapter);
  if (new Set(adapters.map(x => x.adapterId)).size !== adapters.length) fail('DUPLICATE_ADAPTER_ID');
  const edges = arr(r.edges, 'EDGES_INVALID').map(x => validateEdge(x, producerIds, consumerIds));
  if (!edges.length || new Set(edges.map(x => x.edgeId)).size !== edges.length) fail('EDGES_INVALID');
  const proofsRaw = obj(r.proofs, 'PROOFS_INVALID');
  const proofs = Object.fromEntries(PROOF_KEYS.map(key => [key, validateProof(proofsRaw[key], key)]));
  return stable({schema:r.schema,assessmentId:r.assessmentId,subjectHead:r.subjectHead,systemId:r.systemId,changedPaths,interfaceKeys,relatedGapIds,producerContracts,consumerContracts,edges,adapters,proofs,requestedClosure:r.requestedClosure});
}

function pathsOverlap(changed, scope) {
  return changed === scope || changed.startsWith(scope.endsWith('/') ? scope : `${scope}/`) || scope.startsWith(changed.endsWith('/') ? changed : `${changed}/`);
}

function adapterFor(edge, adapters, producer, consumer) {
  if (!edge.adapterId) return null;
  const adapter = adapters.find(a => a.adapterId === edge.adapterId);
  if (!adapter) return null;
  if (adapter.fromOperationIdPolicy !== producer.operationIdPolicy || adapter.toOperationIdPolicy !== consumer.operationIdPolicy) return null;
  if (adapter.fromReceiptSchema !== edge.producerReceiptSchema) return null;
  if (!consumer.acceptedReceiptSchemas.includes(adapter.toReceiptSchema)) return null;
  return adapter;
}

function operationPolicyCompatible(producer, consumer) {
  if (consumer.operationIdPolicy === 'ANY_EXPLICIT_OPERATION_ID') return true;
  if (producer.operationIdPolicy === 'ANY_EXPLICIT_OPERATION_ID') return consumer.operationIdPolicy !== 'EXACT_REGISTERED_OPERATION_ID';
  if (producer.operationIdPolicy === 'STABLE_OPERATION_ID') return consumer.operationIdPolicy === 'EXACT_REGISTERED_OPERATION_ID' || consumer.operationIdPolicy === 'SUCCESSOR_LINEAGE_OPERATION_ID_ACCEPTED';
  if (producer.operationIdPolicy === 'FRESH_SUCCESSOR_OPERATION_ID_REQUIRED') return consumer.operationIdPolicy === 'SUCCESSOR_LINEAGE_OPERATION_ID_ACCEPTED';
  return false;
}

function evaluateInterfaces(request) {
  const producers = new Map(request.producerContracts.map(x => [x.contractId, x]));
  const consumers = new Map(request.consumerContracts.map(x => [x.contractId, x]));
  const results = request.edges.map(edge => {
    const producer = producers.get(edge.producerContractId);
    const consumer = consumers.get(edge.consumerContractId);
    const adapter = adapterFor(edge, request.adapters, producer, consumer);
    const receiptDirect = consumer.acceptedReceiptSchemas.includes(edge.producerReceiptSchema);
    const operationDirect = operationPolicyCompatible(producer, consumer);
    const receiptCompatible = receiptDirect || !!adapter;
    const operationIdCompatible = operationDirect || !!adapter;
    const compatible = receiptCompatible && operationIdCompatible;
    const reasons = [];
    if (!receiptCompatible) reasons.push('RECEIPT_SCHEMA_MISMATCH');
    if (!operationIdCompatible) reasons.push('OPERATION_ID_POLICY_MISMATCH');
    return stable({edgeId:edge.edgeId,compatible,receiptCompatible,operationIdCompatible,adapterId:adapter?.adapterId ?? null,reasons});
  });
  return {pass: results.every(x => x.compatible), results};
}

function relatedOpenGaps(request, registry) {
  const open = registry.records.filter(g => g.status === 'OPEN');
  return open.filter(g => {
    const interfaceHit = g.interfaceKeys.some(k => request.interfaceKeys.includes(k));
    const pathHit = g.pathScopes.some(scope => request.changedPaths.some(changed => pathsOverlap(changed, scope)));
    return interfaceHit || pathHit;
  }).map(g => stable({gapId:g.gapId,declared:request.relatedGapIds.includes(g.gapId),interfaceKeys:g.interfaceKeys,pathScopes:g.pathScopes}));
}

function authorityBoundary() {
  return {
    repositoryWritesAuthorized:false,
    lifecycleAuthorityGranted:false,
    terminalClosureAuthorityGranted:false,
    successorAuthorityGranted:false,
    mergeAuthorityGranted:false,
    deploymentAuthorityGranted:false,
    productMutationAuthorityGranted:false,
    semanticAuthorityGranted:false,
    scientificClaimAuthorityGranted:false,
    genericCommandAuthority:false
  };
}

function blocked(request, code, detail, extra = {}) {
  return stable({schema:RECEIPT_SCHEMA,result:'BLOCK',assessmentId:request?.assessmentId ?? null,subjectHead:request?.subjectHead ?? null,systemId:request?.systemId ?? null,errorCode:code,detail,classification:'OPEN',systemClosureGranted:false,...authorityBoundary(),...extra});
}

export function assess(rawRequest, rawRegistry) {
  let request;
  let registry;
  try {
    request = validateRequest(rawRequest);
    registry = validateRegistry(rawRegistry);
  } catch (error) {
    return blocked(rawRequest, error.code ?? 'ASSESSMENT_VALIDATION_FAILURE', error.detail ?? error.message);
  }

  const gapHits = relatedOpenGaps(request, registry);
  const undeclared = gapHits.filter(g => !g.declared);
  if (undeclared.length) return blocked(request, 'ACTIVE_GAP_RECONCILIATION_REQUIRED', undeclared.map(g => g.gapId).join(','), {gapHits});

  const interfaces = evaluateInterfaces(request);
  if (!interfaces.pass) return blocked(request, 'PRODUCER_CONSUMER_INTERFACE_MISMATCH', interfaces.results.filter(x=>!x.compatible).map(x=>`${x.edgeId}:${x.reasons.join('+')}`).join(','), {interfaceResults:interfaces.results,gapHits});

  if (request.proofs.interfaceCompatibility.status !== 'PASS') {
    return blocked(request, 'INTERFACE_COMPATIBILITY_PROOF_MISSING', request.proofs.interfaceCompatibility.status, {interfaceResults:interfaces.results,gapHits});
  }

  if (request.requestedClosure === 'OPEN') {
    return stable({schema:RECEIPT_SCHEMA,result:'PASS',assessmentId:request.assessmentId,subjectHead:request.subjectHead,systemId:request.systemId,errorCode:null,classification:'OPEN',systemClosureGranted:false,interfaceResults:interfaces.results,gapHits,proofs:request.proofs,...authorityBoundary()});
  }

  if (request.proofs.localCorrectness.status !== 'PASS') return blocked(request, 'LOCAL_CORRECTNESS_PROOF_MISSING', request.proofs.localCorrectness.status, {interfaceResults:interfaces.results,gapHits});

  if (request.requestedClosure === 'LOCAL_CAPABILITY_CLOSED') {
    return stable({schema:RECEIPT_SCHEMA,result:'PASS',assessmentId:request.assessmentId,subjectHead:request.subjectHead,systemId:request.systemId,errorCode:null,classification:'LOCAL_CAPABILITY_CLOSED',systemClosureGranted:false,interfaceResults:interfaces.results,gapHits,proofs:request.proofs,...authorityBoundary()});
  }

  if (request.proofs.transitionSimulation.status !== 'PASS') return blocked(request, 'TRANSITION_PROOF_MISSING', request.proofs.transitionSimulation.status, {interfaceResults:interfaces.results,gapHits});

  if (request.requestedClosure === 'INTERFACE_CONTINUITY_CLOSED') {
    return stable({schema:RECEIPT_SCHEMA,result:'PASS',assessmentId:request.assessmentId,subjectHead:request.subjectHead,systemId:request.systemId,errorCode:null,classification:'INTERFACE_CONTINUITY_CLOSED',systemClosureGranted:false,interfaceResults:interfaces.results,gapHits,proofs:request.proofs,...authorityBoundary()});
  }

  if (gapHits.length) return blocked(request, 'RELATED_OPEN_GAP_PREVENTS_SYSTEM_CLOSURE', gapHits.map(g => g.gapId).join(','), {interfaceResults:interfaces.results,gapHits});
  if (request.proofs.remoteInvocation.status !== 'PASS') return blocked(request, 'REMOTE_INVOCATION_PROOF_MISSING', request.proofs.remoteInvocation.status, {interfaceResults:interfaces.results,gapHits});
  if (request.proofs.postMergeContinuity.status !== 'PASS') return blocked(request, 'POST_MERGE_CONTINUITY_PROOF_MISSING', request.proofs.postMergeContinuity.status, {interfaceResults:interfaces.results,gapHits});

  return stable({schema:RECEIPT_SCHEMA,result:'PASS',assessmentId:request.assessmentId,subjectHead:request.subjectHead,systemId:request.systemId,errorCode:null,classification:'SYSTEM_GAP_CLOSED',systemClosureGranted:true,interfaceResults:interfaces.results,gapHits,proofs:request.proofs,...authorityBoundary()});
}

function parseArgs(argv) {
  const out = {input:null,registry:DEFAULT_REGISTRY,output:null};
  for (let i=0;i<argv.length;i+=1) {
    const t=argv[i];
    if (t==='--input') out.input=argv[++i] ?? null;
    else if (t==='--registry') out.registry=argv[++i] ?? null;
    else if (t==='--output') out.output=argv[++i] ?? null;
    else if (t==='--help') { process.stdout.write('Usage: node progressive-system-continuity-gate.v1.mjs --input <request.json> [--registry <gap-registry.json>] --output <receipt.json>\n'); process.exit(0); }
    else fail('UNKNOWN_ARGUMENT', t);
  }
  if (!out.input || !out.output) fail('CLI_ARGUMENT_MISSING');
  return out;
}

function discoverRoot(start) {
  let current=path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(current,'AI_ENTRYPOINT.json'))) return current;
    const parent=path.dirname(current); if (parent===current) return process.cwd(); current=parent;
  }
}

function main() {
  const args=parseArgs(process.argv.slice(2));
  const root=discoverRoot(path.dirname(fileURLToPath(import.meta.url)));
  const request=JSON.parse(fs.readFileSync(path.resolve(args.input),'utf8'));
  const registryPath=path.isAbsolute(args.registry) ? args.registry : path.join(root,args.registry);
  const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
  const receipt=assess(request,registry);
  fs.mkdirSync(path.dirname(path.resolve(args.output)),{recursive:true});
  fs.writeFileSync(path.resolve(args.output),`${JSON.stringify(receipt,null,2)}\n`);
  process.stdout.write(`${JSON.stringify(receipt,null,2)}\n`);
  if (receipt.result!=='PASS') process.exitCode=2;
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try { main(); }
  catch (error) {
    const receipt=blocked(null,error.code ?? 'UNEXPECTED_CONTINUITY_GATE_FAILURE',error.detail ?? error.message);
    try { const args=parseArgs(process.argv.slice(2)); fs.mkdirSync(path.dirname(path.resolve(args.output)),{recursive:true}); fs.writeFileSync(path.resolve(args.output),`${JSON.stringify(receipt,null,2)}\n`); } catch {}
    process.stderr.write(`${JSON.stringify(receipt,null,2)}\n`); process.exitCode=1;
  }
}
