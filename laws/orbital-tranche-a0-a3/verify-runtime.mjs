import fs from 'node:fs';
const assert=(v,m)=>{if(!v)throw new Error(m)};
const read=p=>fs.readFileSync(p,'utf8');
const manifest=JSON.parse(read('laws/orbital-tranche-a0-a3/manifest.v1.json'));
const runtime=read('laws/orbital-tranche-a0-a3/orientation.js');

assert(manifest.navigationTopology?.model==='SIMPLIFIED_MULTI_GRAPH_V1','simplified multi-graph model');
assert(manifest.navigationTopology?.persistentEnvironment?.semanticType==='PERSISTENT_STAGE','persistent stage');
assert(manifest.navigationTopology?.category?.semanticType==='CATEGORY_CONSTELLATION','category constellation');
assert(manifest.navigationTopology?.sequence?.presentation==='SEPARATE_CONTEXT_CONTROL','sequence is separate control');
assert(manifest.navigationTopology?.localStoryboard?.status==='NOT_RECOVERED','local storyboard remains unrecovered');
assert(manifest.navigationTopology?.localStoryboard?.navigationAuthority===false,'no invented local storyboard authority');
assert(manifest.stories.length===24,'24 canonical positions');
assert(manifest.stories.every((s,i)=>s.position===i+1),'canonical order unchanged');

const families=manifest.navigationTopology.category.families;
assert(families.length===6,'six major families');
const covered=families.flatMap(f=>f.members).slice().sort((a,b)=>a-b);
assert(covered.length===24&&covered.every((p,i)=>p===i+1),'families cover each canonical position exactly once in simplified projection');
assert(manifest.stories.every(s=>Array.isArray(s.categoryMembership)&&s.categoryMembership.length>=1),'category membership represented as plural-capable relation');

assert(runtime.includes("shell.className='laws-spatial-environment'"),'persistent Laws shell constructed');
assert(runtime.includes("shell.dataset.semanticType='PERSISTENT_STAGE'"),'persistent stage semantic type');
assert(runtime.includes('laws-category-orbit'),'category orbit exists');
assert(runtime.includes('laws-family-members'),'family-member semantic traversal exists');
assert(runtime.includes('laws-sequence-context'),'canonical sequence context exists separately');
assert(runtime.includes('fetchStory'),'canonical views mount into stage');
assert(runtime.includes('stageContent.replaceChildren'),'stage content replaces inside persistent shell');
assert(runtime.includes('history.pushState'),'story selection updates history without document destruction');
assert(runtime.includes("u.searchParams.set('story'"),'persistent route state stored on Laws shell');
assert(runtime.includes("sourceCandidates"),'canonical view source fallback exists');
assert(runtime.includes("pointermove"),'gesture navigation exists');
assert(runtime.includes("category-swipe"),'semantic traversal can commit from swipe');
assert(!runtime.includes('location.assign('),'persistent Laws shell does not use full-document navigation for canonical position changes');

console.log(JSON.stringify({
  status:'PASS',
  persistentEnvironment:true,
  canonicalPositions:24,
  categoryFamilies:6,
  localStoryboardAuthority:'NOT_RECOVERED',
  categoryGesture:true,
  relatedPositionSwipe:true,
  canonicalSequenceSeparate:true,
  documentDestructionForPositionChange:false
},null,2));
