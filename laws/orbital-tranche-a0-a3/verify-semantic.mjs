import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const assert=(v,m)=>{if(!v)throw new Error(m)};
const manifest=JSON.parse(read('laws/orbital-tranche-a0-a3/manifest.v1.json'));

assert(manifest.surface.semanticType==='NARRATIVE_SEQUENCE','canonical sequence type');
assert(manifest.surface.wrapPolicy==='BOUNDED','canonical sequence bounded');
assert(manifest.stories.length===24,'24 canonical positions');
assert(manifest.stories.every((s,i)=>s.position===i+1),'canonical positions preserved');
assert(manifest.navigationTopology.model==='SIMPLIFIED_MULTI_GRAPH_V1','simplified navigation graph declared');
assert(manifest.navigationTopology.sequence.semanticType==='NARRATIVE_SEQUENCE','sequence graph preserved');
assert(manifest.navigationTopology.category.semanticType==='CATEGORY_CONSTELLATION','category graph distinct');
assert(manifest.navigationTopology.persistentEnvironment.semanticType==='PERSISTENT_STAGE','persistent stage distinct');
assert(manifest.navigationTopology.localStoryboard.status==='NOT_RECOVERED','local storyboard not manufactured');
assert(manifest.navigationTopology.localStoryboard.presentation==='OMITTED_UNTIL_AUTHORIZED','unrecovered storyboard omitted');
assert(manifest.navigationTopology.category.membershipCardinality==='PLURAL_ALLOWED','category membership can be plural');

const familyIds=new Set(manifest.navigationTopology.category.families.map(f=>f.id));
assert(familyIds.size===6,'six distinct family identities');
for(const story of manifest.stories){
  assert(story.routeViewType==='CANONICAL_POSITION_VIEW','route/view identity preserved');
  for(const family of story.categoryMembership)assert(familyIds.has(family),`unknown family ${family}`);
}
assert(manifest.methods.internalSemanticType==='MULTI_AXIS_INSTRUMENT','Methods remains specialized instrument');
assert(manifest.methods.genericSingleRingBinding==='PROHIBITED','Methods flattening remains prohibited');
assert(manifest.ordinaryReadingSurface.semanticType==='PARALLEL_LENS','ordinary readings remain parallel lenses');
assert(manifest.ordinaryReadingSurface.scientificSequence===false,'parallel lenses do not acquire sequence');

const trancheFiles=['laws/orbital-tranche-a0-a3/manifest.v1.json','laws/orbital-tranche-a0-a3/orientation.js'].map(read).join('\n');
assert(!/CANONICAL_LAWS_TEST_RUN_RECOVERED|CURRENT_TESTS_ENVIRONMENT_PROJECTION\s*=\s*(?!NONE)/.test(trancheFiles),'forbidden lineage/projection upgrade');

console.log(JSON.stringify({
  status:'PASS',
  canonicalSequencePreserved:true,
  categoryTopologyDistinct:true,
  persistentStageDistinct:true,
  localStoryboardManufactured:false,
  methodsSpecializationPreserved:true,
  parallelLensScientificSequence:false
},null,2));
