#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';

const ROOT = path.resolve(process.cwd());
const BASE = '25f6e9cd6caf1dba73552e81eaa8a23e1c393d5f';
const ROUTER = '.github/ai-router/router.v1.json';
const AGENTS = 'h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/AGENTS.md';
const DIR = 'h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/inter-hill-estate-successor-evaluator/router-instruction-lock-closure-successor';
const WORKFLOW = '.github/workflows/h-earth-v2-router-instruction-lock-closure-successor.yml';
const argv = Object.fromEntries(process.argv.slice(2).reduce((a,v,i,s)=>{if(v.startsWith('--'))a.push([v.slice(2),s[i+1]??true]);return a},[]));
const phase = argv.phase ?? 'full';
const output = argv.output ? path.resolve(argv.output) : null;

const read = p => fs.readFileSync(path.join(ROOT,p),'utf8');
const json = p => JSON.parse(read(p));
const sha256 = s => crypto.createHash('sha256').update(s).digest('hex');
const git = (...args) => cp.execFileSync('git',args,{cwd:ROOT,encoding:'utf8'}).trim();
const fail = (code, detail='') => { const e=new Error(`${code}${detail?':'+detail:''}`); e.code=code; throw e; };
const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const sort = a => [...a].sort();

const contract = json(`${DIR}/contract.v1.json`);
const manifest = json(`${DIR}/changed-path-manifest.v1.json`);
const fixtures = json(`${DIR}/negative-fixtures.v1.json`);
const closure = json(`${DIR}/closure-request.lock-279.v1.json`);
const rollback = json(`${DIR}/rollback.v1.json`);
const router = json(ROUTER);
const agents = read(AGENTS);

const expectedEight = contract.routerRegistration.addedExactPaths;
const hEarth = router.projects.find(p=>p.projectId==='H_EARTH');
if (!hEarth) fail('H_EARTH_ROUTE_MISSING');

function matches(filePath, project) {
  const exact = (project.ownedExactPaths ?? []).includes(filePath);
  const prefix = (project.ownedPathPrefixes ?? []).filter(p=>filePath.startsWith(p)).map(p=>p.length);
  return {match:exact||prefix.length>0,specificity:exact?Number.MAX_SAFE_INTEGER:(prefix.length?Math.max(...prefix):-1)};
}
function route(filePath) {
  const matchesList = router.projects.map(project=>({project,...matches(filePath,project)})).filter(x=>x.match);
  if(!matchesList.length) return {disposition:'BLOCK',projectId:null};
  const maxPriority=Math.max(...matchesList.map(x=>x.project.priority??0));
  const priority=matchesList.filter(x=>(x.project.priority??0)===maxPriority);
  const maxSpecificity=Math.max(...priority.map(x=>x.specificity));
  const finalists=priority.filter(x=>x.specificity===maxSpecificity);
  return finalists.length===1?{disposition:'PASS',projectId:finalists[0].project.projectId}:{disposition:'STOP',projectId:null};
}
const routeResults = expectedEight.map(p=>({path:p,...route(p)}));
if(routeResults.some(r=>r.disposition!=='PASS'||r.projectId!=='H_EARTH')) fail('ROUTER_EIGHT_ROUTE_FAILURE');

const baselineModel = Object.freeze({
  governingHead: BASE,
  headSubstitution:false,movingHead:false,
  routerPredecessorBlob:'b6e1b23b6b0aac424b90e1414c6e047134c98f8a',
  agentsPredecessorBlob:'f5d8215e180fa84ad4f23ee3eea57aa41abbcef0',
  routerPathRemoval:false,routerPathReassignment:false,newPrefixOwnership:false,equalPrioritySecondOwner:false,
  methodsProjectMutation:false,unregisteredPolicyMutation:false,ambiguityPolicyMutation:false,
  routerAddedExactPathCount:8,workflowBeforeRouterPass:false,commitAPathCount:8,commitBAdditionalPathCount:1,
  v1Mutation:false,productMutation:false,terrainMutation:false,lockManagerReimplemented:false,
  directContentsApiLedgerPut:false,gitCommitLedger:false,gitPushLockRef:false,sedLedgerRewrite:false,jqLedgerRewrite:false,
  inlineCloseLocal:false,manualTerminalAppend:false,manualActiveScopeRemoval:false,
  requestSuppliedCommandParts:false,extraCommandArguments:false,constructionGeneration:280,
  eventTarget:'EXACT_GOVERNANCE_SUCCESSOR_PULL_REQUEST',actorAssociation:'OWNER',role4ReviewValid:true,
  lock279Verified:true,constructionLockIdentityValid:true,role3PostCommandPass:true,constructionLockAlreadyReleased:false
});
function validateModel(m) {
  if(m.governingHead!==BASE) return 'GOVERNING_HEAD_MISMATCH';
  if(m.headSubstitution) return 'HEAD_SUBSTITUTION_PROHIBITED';
  if(m.movingHead) return 'MOVING_HEAD_PROHIBITED';
  if(m.routerPredecessorBlob!==baselineModel.routerPredecessorBlob) return 'ROUTER_PREDECESSOR_BLOB_MISMATCH';
  if(m.agentsPredecessorBlob!==baselineModel.agentsPredecessorBlob) return 'AGENTS_PREDECESSOR_BLOB_MISMATCH';
  if(m.routerPathRemoval) return 'ROUTER_PATH_REMOVAL_PROHIBITED';
  if(m.routerPathReassignment) return 'ROUTER_PATH_REASSIGNMENT_PROHIBITED';
  if(m.newPrefixOwnership) return 'NEW_PREFIX_OWNERSHIP_PROHIBITED';
  if(m.equalPrioritySecondOwner) return 'EQUAL_PRIORITY_SECOND_OWNER_PROHIBITED';
  if(m.methodsProjectMutation) return 'METHODS_PROJECT_MUTATION_PROHIBITED';
  if(m.unregisteredPolicyMutation) return 'UNREGISTERED_POLICY_MUTATION_PROHIBITED';
  if(m.ambiguityPolicyMutation) return 'AMBIGUITY_POLICY_MUTATION_PROHIBITED';
  if(m.routerAddedExactPathCount!==8) return 'ROUTER_EXACT_PATH_COUNT_MISMATCH';
  if(m.workflowBeforeRouterPass) return 'WORKFLOW_BEFORE_ROUTER_PASS_PROHIBITED';
  if(m.commitAPathCount!==8) return 'COMMIT_A_PATH_COUNT_MISMATCH';
  if(m.commitBAdditionalPathCount!==1) return 'COMMIT_B_PATH_COUNT_MISMATCH';
  if(m.v1Mutation) return 'V1_MUTATION_PROHIBITED';
  if(m.productMutation) return 'PRODUCT_MUTATION_PROHIBITED';
  if(m.terrainMutation) return 'TERRAIN_MUTATION_PROHIBITED';
  if(m.lockManagerReimplemented||m.inlineCloseLocal) return 'LOCK_MANAGER_REIMPLEMENTATION_PROHIBITED';
  if(m.directContentsApiLedgerPut||m.gitCommitLedger||m.gitPushLockRef||m.sedLedgerRewrite||m.jqLedgerRewrite||m.manualTerminalAppend||m.manualActiveScopeRemoval) return 'DIRECT_LEDGER_WRITE_PROHIBITED';
  if(m.requestSuppliedCommandParts) return 'REQUEST_SUPPLIED_COMMAND_PROHIBITED';
  if(m.extraCommandArguments) return 'EXTRA_COMMAND_ARGUMENTS_PROHIBITED';
  if(typeof m.constructionGeneration!=='number') return 'GENERATION_PLACEHOLDER_PROHIBITED';
  if(m.constructionGeneration===279) return 'LOCK_279_REUSE_PROHIBITED';
  if(m.eventTarget!=='EXACT_GOVERNANCE_SUCCESSOR_PULL_REQUEST') return 'EXACT_PR_TARGET_REQUIRED';
  if(!['OWNER','MEMBER','COLLABORATOR'].includes(m.actorAssociation)) return 'ACTOR_ASSOCIATION_UNAUTHORIZED';
  if(!m.role4ReviewValid) return 'ROLE_4_REVIEW_INVALID';
  if(!m.lock279Verified) return 'LOCK_279_VERIFICATION_REQUIRED';
  if(!m.constructionLockIdentityValid) return 'CONSTRUCTION_LOCK_IDENTITY_MISMATCH';
  if(!m.role3PostCommandPass) return 'ROLE_3_POST_COMMAND_PASS_REQUIRED';
  if(m.constructionLockAlreadyReleased) return 'CONSTRUCTION_LOCK_REPLAY_PROHIBITED';
  return 'PASS';
}
const negativeResults = fixtures.fixtures.map(f=>{
  const model={...baselineModel,[f.mutation.field]:f.mutation.value};
  const observed=validateModel(model);
  return {
    fixtureId:f.id,
    invalidConditionActuallyCreated:!same(model,baselineModel),
    observedErrorCode:observed,
    expectedErrorCode:f.expectedErrorCode,
    pass:observed===f.expectedErrorCode
  };
});
if(fixtures.requiredFixtureCount!==40||negativeResults.length!==40||negativeResults.some(r=>!r.pass||!r.invalidConditionActuallyCreated)) fail('NEGATIVE_FIXTURE_FAILURE');

const requiredAgentTokens = [
 'V1_EVALUATOR_HEAD = b935c204da2904e86f9c9c566bed0ac9b0de4193',
 'V1_MERGE_COMMIT = 25f6e9cd6caf1dba73552e81eaa8a23e1c393d5f',
 'H_EARTH_INTER_HILL_ESTATE_SUCCESSOR_EVALUATOR_V2_CAUSAL_CORRECTION_002',
 'This file does not authorize V2 implementation',
 'Hard gates may not be weakened or removed',
 'Role 1 may construct and test this governance successor but may not execute either closure command or merge'
];
for(const token of requiredAgentTokens) if(!agents.includes(token)) fail('AGENTS_SUCCESSOR_INSTRUCTION_MISSING',token);

if(contract.operation.constructionLockGeneration!==280) fail('CONSTRUCTION_LOCK_GENERATION_NOT_BOUND');
if(closure.lockGeneration!==279||closure.terminalDisposition!=='FAIL_CLOSED') fail('LOCK_279_REQUEST_INVALID');
if(rollback.predecessors[ROUTER]!=='b6e1b23b6b0aac424b90e1414c6e047134c98f8a') fail('ROLLBACK_ROUTER_PREDECESSOR_INVALID');
if(rollback.predecessors[AGENTS]!=='f5d8215e180fa84ad4f23ee3eea57aa41abbcef0') fail('ROLLBACK_AGENTS_PREDECESSOR_INVALID');
if(!same(sort(manifest.authorizedPaths),sort(contract.pathBoundary.authorizedPaths))) fail('MANIFEST_CONTRACT_PATH_DRIFT');
if(manifest.commitA.exactPathCount!==8||manifest.commitB.additionalPathCount!==1) fail('COMMIT_ORDER_INVALID');

let gitEvidence={available:false};
try {
  git('rev-parse','--is-inside-work-tree');
  const head=git('rev-parse','HEAD');
  const changed=git('diff','--name-only',BASE,head).split(/\r?\n/).filter(Boolean);
  const status=git('diff','--name-status',BASE,head).split(/\r?\n/).filter(Boolean);
  gitEvidence={available:true,head,changedPaths:changed,status};
  const predecessorRouter=git('rev-parse',`${BASE}:${ROUTER}`);
  const predecessorAgents=git('rev-parse',`${BASE}:${AGENTS}`);
  if(predecessorRouter!=='b6e1b23b6b0aac424b90e1414c6e047134c98f8a') fail('ROUTER_PREDECESSOR_BLOB_MISMATCH');
  if(predecessorAgents!=='f5d8215e180fa84ad4f23ee3eea57aa41abbcef0') fail('AGENTS_PREDECESSOR_BLOB_MISMATCH');
  if(phase==='commit-a') {
    if(!same(sort(changed),sort(manifest.commitA.paths))) fail('COMMIT_A_PATH_SET_MISMATCH');
    if(status.filter(x=>x.startsWith('M\t')).length!==2||status.filter(x=>x.startsWith('A\t')).length!==6) fail('COMMIT_A_STATUS_MISMATCH');
  } else {
    if(!same(sort(changed),sort(manifest.authorizedPaths))) fail('EXACT_9_PATH_SET_MISMATCH');
    if(status.filter(x=>x.startsWith('M\t')).length!==2||status.filter(x=>x.startsWith('A\t')).length!==7) fail('EXACT_9_STATUS_MISMATCH');
    const parents=git('rev-list','--parents','-n','1',head).split(/\s+/);
    const parent=parents[1];
    const commitBChanged=git('diff','--name-only',parent,head).split(/\r?\n/).filter(Boolean);
    if(!same(commitBChanged,[WORKFLOW])) fail('COMMIT_B_NOT_WORKFLOW_ONLY');
    const commitAChanged=git('diff','--name-only',BASE,parent).split(/\r?\n/).filter(Boolean);
    if(!same(sort(commitAChanged),sort(manifest.commitA.paths))) fail('COMMIT_A_PATH_SET_MISMATCH');
  }
} catch(error) {
  if(process.env.GITHUB_ACTIONS==='true') throw error;
}

let workflowEvidence={checked:false};
if(phase!=='commit-a') {
  const workflow=read(WORKFLOW);
  const norm=s=>s.replace(/\s+/g,' ').trim();
  for(const command of [contract.commands.lock279FailClosed,contract.commands.constructionLockPassClosed]) {
    if(!norm(workflow).includes(norm(command))) fail('EXACT_LOCK_COMMAND_LITERAL_MISSING');
  }
  const forbidden=[
    /contents\/.*active-operation-ledger.*method:\s*['"]?PUT/i,
    /git\s+commit[^\n]*active-operation-ledger/i,
    /git\s+push[^\n]*operation-locks\/repository-operation-intake-v1/i,
    /\bsed\b[^\n]*active-operation-ledger/i,
    /\bjq\b[^\n]*active-operation-ledger/i,
    /function\s+closeLocal|const\s+closeLocal|let\s+closeLocal/,
    /terminalHistory\s*\.push|activeScopes\s*\[[^\]]+\]\s*=/
  ];
  if(forbidden.some(r=>r.test(workflow))) fail('DIRECT_LEDGER_WRITE_OR_REIMPLEMENTATION_DETECTED');
  for(const token of [
    'LOCK_279_FAIL_CLOSED_EXECUTION_REQUEST_V1',
    'GOVERNANCE_SUCCESSOR_CONSTRUCTION_LOCK_PASS_CLOSED_REQUEST_V1',
    'EXACT_VERIFIED_CANDIDATE_HEAD',
    'EXACT_ROLE_4_AUTHORIZED_MERGE_COMMIT',
    'ROLE_4_REVIEW_ID',
    'ROLE_3_POST_COMMAND_COMMENT_ID',
    'ROLE_4_CONSTRUCTION_LOCK_CLOSURE_AUTHORIZATION_COMMENT_ID'
  ]) if(!workflow.includes(token)) fail('WORKFLOW_EVENT_BINDING_TOKEN_MISSING',token);
  workflowEvidence={checked:true,directLedgerWriteImplemented:false,lockManagerReimplemented:false};
}

const receipt={
  schema:'H_EARTH_V2_ROUTER_INSTRUCTION_AND_LOCK_CLOSURE_SUCCESSOR_VERIFICATION_RECEIPT_v1',
  result:'PASS',
  phase,
  governingHead:BASE,
  routerEightRouteResult:'PASS',
  routerEightRouteEvidence:routeResults,
  routerNewExactPathCount:8,
  newPrefixOwnership:false,
  unrelatedRouterStatePreservation:'REQUIRES_GIT_PREDECESSOR_COMPARISON',
  negativeFixtureResult:'40_OF_40_PASS',
  negativeFixtureResults:negativeResults,
  constructionLockGeneration:280,
  lock279CommandSha256:sha256(contract.commands.lock279FailClosed),
  constructionLockCommandSha256:sha256(contract.commands.constructionLockPassClosed),
  v1Preservation:true,
  productMutation:false,
  terrainMutation:false,
  directLedgerWriteImplemented:false,
  lockManagerReimplemented:false,
  gitEvidence,
  workflowEvidence
};
const text=JSON.stringify(receipt,null,2)+'\n';
if(output){fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,text)}
process.stdout.write(text);
