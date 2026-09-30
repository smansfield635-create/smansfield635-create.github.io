import {runCountOnlyPreflight} from './eligible-seed-preflight.v1.mjs';
import {planExecution,validateExecutionPlan} from './deterministic-shard-wave-planner.v1.mjs';
import {reduceExecution} from './deterministic-reducer.v1.mjs';
import {compareDeterministicRerun} from './deterministic-rerun-comparator.v1.mjs';
import {SOURCE_MODES,assert,sha256} from './causal-evidence-adapter.v1.mjs';
export const ROLE_3_AUTHORITIES=Object.freeze({repair:false,merge:false,releaseLock:false,substituteMissingEvidence:false});
export function independentlyReproduceCountAndPlan(){const manifests=SOURCE_MODES.map(sourceMode=>runCountOnlyPreflight({sourceMode})),plan=planExecution(manifests);validateExecutionPlan(plan);return {manifests,plan,digest:sha256({manifests,plan})}}
export function verifyRepresentativeShards({plan,recompute}){assert(typeof recompute==='function','ROLE_3_RECOMPUTE_FUNCTION_REQUIRED');const selected=[];for(const mode of plan.modes){if(!mode.shards.length)continue;for(const index of [...new Set([0,Math.floor((mode.shards.length-1)/2),mode.shards.length-1])])selected.push(recompute(mode.shards[index]))}return selected}
export function independentlyReduceAndCompare({plan,epochAReceipts,epochBReceipts}){const a=reduceExecution({plan,shardReceipts:epochAReceipts,epoch:'A'}),b=reduceExecution({plan,shardReceipts:epochBReceipts,epoch:'B'}),comparison=compareDeterministicRerun({left:a,right:b});return {a,b,comparison}}
