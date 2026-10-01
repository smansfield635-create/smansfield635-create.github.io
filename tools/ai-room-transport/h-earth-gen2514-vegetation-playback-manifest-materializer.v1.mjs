#!/usr/bin/env node
import fs from 'node:fs';import cp from 'node:child_process';import path from 'node:path';import crypto from 'node:crypto';
const SOURCE='5b5d07d2b1320b4e235de0aee0f526a0c206e63b',PLACEMENT='28bc466fe029b449ce4edd27843c0457bfa3349d';
const P='preview/h-earth/corridor/38df744ba7402aabe7fd2eaee71b961a451350de/B/showroom/globe/h-earth/render/geometry-grounded-vegetation.run8d.js';
const args=process.argv.slice(2),get=n=>{const i=args.indexOf(n);return i<0?null:args[i+1]};
if(args.includes('--self-test')){if(SOURCE.length!==40||PLACEMENT.length!==40)throw Error('SELF_TEST_AUTHORITY_INVALID');process.stdout.write('PASS\n');process.exit(0);}
const manifestOut=get('--manifest-output'),receiptOut=get('--receipt-output'),holder=get('--execution-holder');
if(!manifestOut||!receiptOut||!holder)throw Error('REQUIRED_ARGUMENT_MISSING');
const run=(a,o={})=>cp.spawnSync('git',a,{encoding:'utf8',maxBuffer:268435456,...o});
let r=run(['cat-file','-e',SOURCE+'^{commit}']);if(r.status){r=run(['fetch','--no-tags','origin',SOURCE]);if(r.status)throw Error('SOURCE_FETCH_FAILED');}
const tmp=fs.mkdtempSync('/tmp/h-earth-gen2514-manifest-');r=run(['worktree','add','--detach',tmp,SOURCE]);if(r.status)throw Error('WORKTREE_FAILED');
const stable=v=>JSON.stringify(v);
const digest=v=>crypto.createHash('sha256').update(typeof v==='string'?v:stable(v)).digest('hex');
try{
 const m=await import('file://'+path.join(tmp,P));
 const plan=m.planHEarthGen2514GroundedVegetation();
 if(plan?.eligible!==true)throw Error('SOURCE_PLAN_NOT_ELIGIBLE');
 if(plan.instanceCount!==27585)throw Error('INSTANCE_COUNT_MISMATCH');
 if(plan.batches?.length!==108)throw Error('BATCH_COVERAGE_MISMATCH');
 if(plan.performancePolicy?.maxInstancesPerMaterializationBatch!==256)throw Error('BATCH_SIZE_MISMATCH');
 if(plan.coordinatesReplanned!==false)throw Error('COORDINATES_REPLANNED');
 const records=plan.instances.map(x=>({placementId:x.placementId,archetypeId:x.archetypeId,worldAnchor:x.worldAnchor,successorTerrainNormal:x.successorTerrainNormal,yawRadians:x.yawRadians,uniformScale:x.uniformScale}));
 if(new Set(records.map(x=>x.placementId)).size!==27585)throw Error('PLACEMENT_ID_MISMATCH');
 for(let i=1;i<records.length;i++)if(records[i-1].placementId.localeCompare(records[i].placementId)>0)throw Error('CANONICAL_ORDER_MISMATCH');
 const batches=plan.batches.map(b=>({batchId:b.batchId,start:b.start,count:b.count}));
 if(batches.reduce((n,b)=>n+b.count,0)!==27585)throw Error('BATCH_COVERAGE_MISMATCH');
 for(let i=0;i<records.length;i++){const a=records[i],s=plan.instances[i];if(a.placementId!==s.placementId||a.archetypeId!==s.archetypeId||stable(a.worldAnchor)!==stable(s.worldAnchor)||stable(a.successorTerrainNormal)!==stable(s.successorTerrainNormal)||a.yawRadians!==s.yawRadians||a.uniformScale!==s.uniformScale)throw Error('RECORD_IDENTITY_MISMATCH:'+i);}
 const manifest={schema:'H_EARTH_GEN2514_CANONICAL_VEGETATION_PLAYBACK_MANIFEST_v1',placementAuthority:PLACEMENT,geometryAuthority:SOURCE,instanceCount:27585,batchSize:256,batchCount:108,ordering:'CANONICAL_PLACEMENT_ID',coordinatesReplanned:false,records,batches};
 const manifestText=JSON.stringify(manifest,null,2)+'\n',manifestSha256=digest(manifestText);
 fs.writeFileSync(manifestOut,manifestText);
 fs.writeFileSync(receiptOut,JSON.stringify({schema:'H_EARTH_GEN2514_CANONICAL_VEGETATION_PLAYBACK_MANIFEST_QUALIFICATION_RECEIPT_v1',result:'PASS_CLOSED',executionHolder:holder,placementAuthority:PLACEMENT,geometryAuthority:SOURCE,instanceCount:records.length,uniquePlacementIdCount:new Set(records.map(x=>x.placementId)).size,batchCount:batches.length,batchCoverage:batches.reduce((n,b)=>n+b.count,0),batchSizeMaximum:Math.max(...batches.map(b=>b.count)),coordinatesReplanned:false,recordIdentityCompared:records.length,recordIdentityMismatchCount:0,manifestSha256,sourceMutationPerformed:false,productMutationPerformed:false,mergePerformed:false,deploymentPerformed:false,publicationPerformed:false},null,2)+'\n');
}finally{run(['worktree','remove','--force',tmp]);}
