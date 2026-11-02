import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyOwnerPrBridgeProof,MARKER,REPO,OWNER,REQUEST_PATH,BRIDGE_WORKFLOW,INTAKE_WORKFLOW,RECEIPT_RESULT,CAPABILITY} from './owner-pr-bridge-proof.v1.mjs';
const HEAD='a'.repeat(40), COMMIT='b'.repeat(40), operation='H_EARTH_TEST';
const body=MARKER+'\n'+JSON.stringify({schema:'CANONICAL_OPERATION_INTAKE_TRANSPORT_REQUEST_v1',operationRequest:{operationId:operation,exactGoverningHead:HEAD},constructionProcedure:{exactGoverningHead:HEAD}})+'\n';
function fixture(){
 const inputs={request_json:body,router_callback_issue:'6911',router_callback_repository:REPO};
 const receipt={schema:'AI_ENTRY_WORKFLOW_DISPATCH_RECEIPT_v1',result:RECEIPT_RESULT,capabilityId:CAPABILITY,repository:REPO,requestId:'req',workflow:INTAKE_WORKFLOW.replace('.github/workflows/',''),ref:'main',requestParentWasCurrent:true,currentMainSha:HEAD,requestCommitParent:HEAD,transportPullRequest:7120,bridgeRunId:400,dispatchedRunId:500,requestCommit:COMMIT,requestBranch:'ai-dispatch-request-test',inputs};
 return {body,operation,receipt,pr:{number:7120,user:{login:OWNER},head:{ref:receipt.requestBranch,sha:COMMIT,repo:{full_name:REPO}},base:{ref:'main',repo:{full_name:REPO}},merged:false},requestFile:{ref:COMMIT,path:REQUEST_PATH,content:JSON.stringify({schema:'AI_ENTRY_WORKFLOW_DISPATCH_REQUEST_v1',requestId:'req',capabilityId:CAPABILITY,inputs})},requestCommit:{sha:COMMIT,parents:[{sha:HEAD}]},changedFiles:[{filename:REQUEST_PATH,status:'modified'}],bridgeRun:{id:400,event:'pull_request',path:BRIDGE_WORKFLOW,head_sha:COMMIT,conclusion:'success',actor:{login:OWNER}},intakeRun:{id:500,event:'workflow_dispatch',path:INTAKE_WORKFLOW,head_sha:HEAD,actor:{login:'github-actions[bot]'}},callbackIssue:'6911',expectedCurrentMain:HEAD};
}
test('owner-PR proof accepted with all exact bindings',()=>assert.equal(verifyOwnerPrBridgeProof(fixture()).result,'AUTHENTICATED'));
for(const [name,mutate] of [
 ['not owner',v=>v.pr.user.login='collaborator'],
 ['wrong PR number',v=>v.pr.number=999],
 ['forked PR',v=>v.pr.head.repo.full_name='other/repo'],
 ['merged PR',v=>v.pr.merged=true],
 ['stale main',v=>v.receipt.currentMainSha='c'.repeat(40)],
 ['replayed bridge run',v=>v.receipt.bridgeRunId=401],
 ['unverified bridge run',v=>v.bridgeRun.conclusion='failure'],
 ['bridge actor not owner',v=>v.bridgeRun.actor.login='attacker'],
 ['intake actor wrong',v=>v.intakeRun.actor.login='attacker'],
 ['wrong intake run',v=>v.receipt.dispatchedRunId=501],
 ['wrong input body',v=>v.receipt.inputs.request_json='different'],
 ['mutated PR request file',v=>v.requestFile.content=v.requestFile.content.replace('req','bad')],
 ['path expansion',v=>v.changedFiles.push({filename:'tools/evil.mjs',status:'added'})],
 ['parent mismatch',v=>v.requestCommit.parents[0].sha='c'.repeat(40)],
 ['wrong callback',v=>v.receipt.inputs.router_callback_issue='9999'],
 ['disallowed capability',v=>v.receipt.capabilityId='PAGES_EXACT_HEAD_DEPLOY'],
 ['missing marker',v=>v.body='INVALID\n'+v.body]
])test('fail closed: '+name,()=>{const v=fixture();mutate(v);assert.throws(()=>verifyOwnerPrBridgeProof(v));});
