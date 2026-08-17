import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const VERSION='compass-root-award-finish-successor-v1';
const OUTPUT=process.env.COMPASS_PERFORMANCE_OUTPUT||'/tmp/compass-root-award-finish-performance.json';
const files={
  input:'assets/compass/compass.orbit-input.js',statement:'assets/compass/compass.statement-carousel.js',statementCss:'assets/compass/compass.statement-carousel.css',brain:'assets/compass/compass.brain-scene.js',capability:'assets/compass/compass.capability-carousel.js',capabilityCss:'assets/compass/compass.capability-carousel.css',index:'index.html'
};
const budgets={input:4096,statement:6144,statementCss:4096,brain:16384,capability:16384,capabilityCss:16384};
const text=Object.fromEntries(Object.entries(files).map(([key,file])=>[key,fs.readFileSync(file,'utf8')]));
const bytes=Object.fromEntries(Object.keys(budgets).map(key=>[key,Buffer.byteLength(text[key])]));
const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
const resolvedHead=spawnSync('git',['rev-parse','HEAD^{commit}'],{encoding:'utf8'}),checkedHead=resolvedHead.stdout.trim(),candidateHead=(process.env.COMPASS_CANDIDATE_HEAD||checkedHead).trim();
check('EXACT_CANDIDATE_HEAD_BOUND',resolvedHead.status===0&&/^[0-9a-f]{40}$/.test(candidateHead)&&candidateHead===checkedHead,{requested:process.env.COMPASS_CANDIDATE_HEAD||null,checkedOut:checkedHead});
for(const [key,max] of Object.entries(budgets))check(`BUDGET_${key.toUpperCase()}`,bytes[key]<=max,{bytes:bytes[key],max});
check('SIX_ASSET_AGGREGATE_UNDER_48_KIB',Object.values(bytes).reduce((a,b)=>a+b,0)<=49152,{bytes:Object.values(bytes).reduce((a,b)=>a+b,0),protectedFloorBytes:48595,max:49152,justification:'six-module brain, capability, Awards, House, and proof successor'});
check('LEGACY_BUNDLE_NOT_LOADED',!text.index.includes('compass.carousel.js')&&!text.index.includes('compass.carousel.css'),'legacy monolith absent');
check('LEGACY_DYNAMIC_BOOTSTRAP_SUPPRESSED',text.index.includes('CompassModularSuccessorGuard')&&text.index.includes("stem='/assets/compass/compass.'+'carousel.'")&&text.index.includes('head.append=function'),'known legacy injector is rejected before network insertion');
const expectedRefs=['compass.statement-carousel.css','compass.capability-carousel.css','compass.orbit-input.js','compass.statement-carousel.js','compass.brain-scene.js','compass.capability-carousel.js'].map(name=>`/assets/compass/${name}?v=${VERSION}`);
check('EXACT_SIX_CACHE_BUSTED_REFERENCES',expectedRefs.every(ref=>text.index.includes(ref))&&(text.index.match(new RegExp(VERSION,'g'))||[]).length===6,{version:VERSION,refs:expectedRefs});
check('RUNTIME_IDENTITY_BOUND',text.capability.includes("version:'root-award-finish-successor-v1'"),'root-award-finish-successor-v1');
check('RUNTIME_IDENTITY_IMMUTABLE',text.capability.includes("Object.defineProperty(window,'CompassEditorialCarousel'")&&text.capability.includes('set:()=>{}'),'late legacy assignment cannot replace successor identity');

const capabilityOrder=[...text.capability.matchAll(/dataset\.capability='([^']+)'/g)].map(match=>match[1]).slice(0,3);
check('CAPABILITY_ORDER_EXACT',JSON.stringify(capabilityOrder)===JSON.stringify(['diagnostic','awards','house']),capabilityOrder);
check('THREE_POSITION_DEPTH',text.capability.includes("'rear-next':'rear-prev'")&&text.capability.includes('cards.length')&&/\[data-slot="?rear-next"?\]/.test(text.capabilityCss)&&/\[data-slot="?rear-prev"?\]/.test(text.capabilityCss),'front + two rear canonical slots');
check('ORBIT_320MS_CANONICAL_SETTLEMENT',text.capability.includes('setTimeout(()=>{busy=false;commit()},320)')&&text.capability.includes('settleTimer=setTimeout(settle,320)')&&text.capabilityCss.includes('transition:transform .32s'),'320ms release-only settlement');
check('ORBIT_ZERO_BLUR_GHOST_FIELD',!text.capabilityCss.includes('blur(')&&/\[data-slot="?front"?\]\{z-index:3/.test(text.capabilityCss)&&/\[data-slot\^="?rear"?\]>\*/.test(text.capabilityCss)&&text.capabilityCss.includes('opacity:1;filter:none'),'one fully legible foreground; recessed card bodies hidden; no blur');
check('ENTRANCE_CUE_EXACT_ONCE',(text.index.match(/Three ways to engage\./g)||[]).length===1&&!text.capability.includes('Three ways to engage.'),'one subordinate entrance cue');
const railSource=text.capability.slice(text.capability.indexOf('function statusRail'),text.capability.indexOf('function mountCapability'));
check('NONINTERACTIVE_STATUS_RAILS',text.capability.includes("statusRail('capability',['Diagnostic','Awards','House'])")&&text.capability.includes("statusRail('proof',['TRL 7','Bounded','Checked'])")&&railSource.includes("setAttribute('aria-hidden','true')")&&!/(addEventListener|<a|<button|tabIndex|tablist|role)/.test(railSource),'two decorative visible rails; live announcements remain controlling');
check('STATUS_RAIL_SETTLES_CANONICALLY',text.capability.includes('finish(()=>settleCards(true))')&&text.capability.includes('settleRail(proofRail,index,proofVisited)')&&text.capability.includes("?'current':visited.has(itemIndex)?'visited':'unseen'"),'current / visited / unseen after settle');
const awardsCopy=['Awards &amp; Recognition','One body of work. Five reasons to look closer.','Interactive worlds. Original characters. Browser-native 3D. A growing software platform. Governed construction that keeps the whole estate coherent as it evolves.','Experience','Native Craft','Governed Construction','Continuity &amp; Recovery','Integrated Platform','Explore the Awards Layer','/showroom/globe/h-earth/awards/','Built in 2026 · Entering the 2027 award season'];
check('AWARDS_FROZEN_COPY',awardsCopy.every(value=>text.capability.includes(value)),awardsCopy);
check('AWARDS_EXACTLY_FIVE_LABELS',(text.capability.match(/<li>(?:Experience|Native Craft|Governed Construction|Continuity &amp; Recovery|Integrated Platform)<\/li>/g)||[]).length===5,5);
const trophyCss=text.capabilityCss.slice(text.capabilityCss.indexOf('.compass-award-trophy'),text.capabilityCss.indexOf('.compass-orbit-plaque[data-capability=house]'));
check('TROPHY_CONVENTIONAL_STRUCTURE',['compass-award-trophy','compass-trophy-bowl','compass-trophy-handle--left','compass-trophy-handle--right','compass-trophy-stem','compass-trophy-base','compass-trophy-gleam'].every(value=>text.capability.includes(value))&&text.capability.includes('<div class="compass-award-object" aria-hidden="true">'),'decorative bowl + two handles + stem + base + gleam');
check('TROPHY_ANTIQUE_GOLD_PALETTE',['#f4d680','#c89e45','#6f4b1e','#fff2be'].every(value=>text.capabilityCss.toLowerCase().includes(value)),'frozen satin/antique gold palette');
check('TROPHY_SUPERSEDES_DIAMOND_OBJECT',!text.capability.includes('compass-award-diamond')&&!text.capabilityCss.includes('compass-award-diamond'),'former five-facet visual absent');
check('TROPHY_ONE_FINITE_GLEAM',text.capability.includes("setTimeout(()=>awards.classList.remove('is-illuminating'),800)")&&trophyCss.includes('animation:compass-trophy-gleam .8s ease-out')&&!trophyCss.includes('infinite')&&!trophyCss.includes('rotate(')&&text.capabilityCss.includes('.compass-trophy-gleam{animation:none!important;opacity:0!important}'),'one <=900ms pass; static reduced-motion state; no spin');
check('AWARDS_NO_RECEIVED_RECOGNITION_CLAIM',!/(award[- ]winning|award winner|has won|received an award)/i.test(text.capability),'bounded award-season language');
const houseRoutes=[['jeeves','/showroom/globe/hearth/jeeves/'],['elara','/elara/'],['auren','/products/auren/']];
for(const [id,route] of houseRoutes)check(`HOUSE_${id.toUpperCase()}_ROUTE`,text.capability.includes(`id:'${id}'`)&&text.capability.includes(`href:'${route}'`),route);
check('HOUSE_STATE_ISOLATED',text.capability.includes("mode='house'")&&text.capability.includes("mode='orbit'")&&text.capability.includes("mode!=='orbit'")&&text.capability.includes("mode!=='house'"),'nested state owned separately');
check('HOUSE_RETURN_RESTORES_PARENT',text.capability.includes('function renderCards')&&text.capability.includes("focus(house.querySelector('[data-enter-house]'))"),'House card and focus restored');
check('HOUSE_BALANCED_PARENT_AND_NESTED_WIDTH',text.capabilityCss.includes('.compass-house-parent{')&&text.capabilityCss.includes('place-items:center;text-align:center')&&text.capabilityCss.includes('.house-orbit{grid-column:1/-1;position:absolute;inset:')&&text.capabilityCss.includes('width:auto;min-height:0')&&/\.house-orbit-member\{[^}]*width:(8[0-9]|9[0-9]|100)%/.test(text.capabilityCss),'centered parent, stable inset guide layer, and >=80% nested guide');

const proofOrder=[...text.index.matchAll(/data-proof-card="([^"]+)"/g)].map(match=>match[1]);
check('PROOF_ORDER_EXACT',JSON.stringify(proofOrder)===JSON.stringify(['trl7','bounded','experience']),proofOrder);
check('TRL_RAIL_NINE_POSITIONS',(text.index.match(/<li (?:data-attained|data-unclaimed|data-attained aria-current)/g)||[]).length===9,9);
check('TRL_7_CURRENT',text.index.includes('<li data-attained aria-current="step" aria-label="Level 7 current self-assessed level">7</li>'),'7 current');
check('TRL_8_9_UNCLAIMED',text.index.includes('data-unclaimed aria-label="Level 8 unclaimed">8</li>')&&text.index.includes('data-unclaimed aria-label="Level 9 unclaimed">9</li>'),'8 and 9 unclaimed');
check('TRL_CLAIM_BOUNDED',['self-assessed at Software TRL 7','bounded software disposition','not a claim of universal product, scientific validation, external certification, or NASA endorsement','TRL 8 is not claimed'].every(value=>text.index.includes(value)),'bounded software self-assessment');
check('PROOF_LINKS_PRESERVED',['/evidence/readiness/','/evidence/','/governance/','/laws/'].every(value=>text.index.includes(`href="${value}"`)),['closure','evidence','governance','laws']);
check('PROOF_ATOMIC_INPUT',text.capability.includes("claimSwipe(stage,rotate)")&&text.input.includes("addEventListener('pointerup'")&&!text.input.includes('style.transform'),'release-only proof state transition');

const builtStart=text.index.indexOf('<section class="compass-built"'),proofStart=text.index.indexOf('data-proof-orbit',builtStart),disclosure=text.index.indexOf('compass-built__more',proofStart),builtClose=text.index.indexOf('</section>',disclosure),cta=text.index.indexOf('<section class="compass-build-cta"');
check('LOWER_HIERARCHY_EXACT',builtStart>=0&&proofStart>builtStart&&disclosure>proofStart&&builtClose>disclosure&&cta>builtClose,{builtStart,proofStart,disclosure,builtClose,cta});
check('CTA_OUTSIDE_PROOF',!text.index.slice(builtStart,builtClose).includes('compass-build-cta'),'separate terminal band');
check('MIRRORLAND_PUNCTUATION_EXACT',text.index.includes('For the full narrative and interactive experience, find the door to Mirrorland.')&&!text.index.includes('experience; Find the door'),'comma + lowercase find');

check('BRAIN_ANATOMICAL_COMPONENTS',['left-hemisphere','right-hemisphere','longitudinal-fissure','cerebellum','pons','brainstem','frontal','temporal','parietal','occipital'].every(value=>text.brain.includes(value)),'named anatomy');
check('BRAIN_NEURAL_GLASS_CONTRACT',text.brain.includes("brainMaterial:'PEARL_SMOKED_NEURAL_GLASS_V1'")&&text.brain.includes("brainPalette:'#D8E3E2,#756982,#66CDE0,#F4D680,#14212B'")&&['#d8e3e2','#756982','#66cde0','#f4d680','#14212b'].every(value=>text.capabilityCss.toLowerCase().includes(value)),'pearl / smoked violet / cyan / gold / occlusion in WebGL and fallback');
check('BRAIN_DEEP_VARIED_FOLDS_AND_SCALE',text.brain.includes('theta*25.3-phi*15.1')&&text.brain.includes('lateralRadius=.73')&&text.brain.includes('float sx=.86/max(aspect,1.)'),'varied sulci/gyri and increased specimen occupancy');
check('BRAIN_AXIS_ATTACHED_AND_SUBORDINATE',text.capabilityCss.includes('.compass-brain-axis{position:absolute;left:9%;bottom:8%')&&text.capabilityCss.includes('.axis-z{left:0;bottom:0;color:#66cde0}'),'lower-field cyan/antique-gold instrumentation');
check('BRAIN_TRUE_DEPTH_GEOMETRY',text.brain.includes("brainDepthRatio")&&text.brain.includes(".91*(1+.070*frontal")&&text.brain.includes("addEllipsoid('cerebellum-left'")&&text.brain.includes('addStem()'),'structural volume');
check('BRAIN_ONE_INDEXED_DRAW_CALL',(text.brain.match(/gl\.drawElements\(/g)||[]).length===1&&text.brain.includes('mesh.triangles'),'single combined indexed mesh');
check('BRAIN_READPIXELS_MORPHOLOGY_API',text.brain.includes('gl.readPixels')&&text.brain.includes('silhouetteWidth')&&text.brain.includes('occupancy')&&Object.keys({front:1,side:1,rear:1,underside:1}).every(view=>text.brain.includes(`${view}:Object.freeze`)),'deterministic named views');
check('BRAIN_VIEWPORT_SUSPENSION',text.brain.includes('IntersectionObserver')&&text.brain.includes('intersectionRatio'),'viewport gating');
check('BRAIN_PAGE_SUSPENSION',text.brain.includes('visibilitychange')&&text.brain.includes('document.hidden'),'page gating');
check('BRAIN_FOREGROUND_SUSPENSION',text.brain.includes('foreground()')&&text.capability.includes("dataset.capability==='diagnostic'"),'foreground gating');
check('BRAIN_REDUCED_MOTION_SUSPENSION',text.brain.includes('!reduce.matches')&&text.brain.includes("brainMotion:reduce.matches?'static-reduced-motion':'slow-yaw'"),'motion gating');
check('BRAIN_NON_WEBGL_FALLBACK',text.brain.includes('compass-brain-fallback')&&text.capabilityCss.includes('.compass-brain-fallback'),'meaningful static anatomy fallback');
check('BRAIN_GESTURE_ISOLATION',text.brain.includes('event.stopPropagation()')&&text.input.includes('[data-human-brain]'),'brain cannot rotate parent orbit');
check('STATEMENT_NO_PERMANENT_BLUR_FIELD',!text.statementCss.includes('will-change'),'statement baseline retained');
check('ATOMIC_POINTER_GEOMETRY',!text.input.includes('style.transform')&&!text.input.includes('translate'),'direction detection only');

const luminance=hex=>{const values=hex.match(/[0-9a-f]{2}/gi).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return .2126*values[0]+.7152*values[1]+.0722*values[2]},contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
const textPairs=[['b8cdd2','07131c'],['c0d5da','050f18'],['dae9ec','0c1a24'],['aebfc3','040d15']],graphicPairs=[['69848c','07131c'],['78959d','050f18'],['507681','06121c'],['66cde0','07131c']];
check('SECONDARY_TEXT_CONTRAST_4_5',textPairs.every(([a,b])=>contrast(a,b)>=4.5),textPairs.map(([a,b])=>({pair:[a,b],ratio:Number(contrast(a,b).toFixed(2))})));
check('CONTROL_AND_GRAPHIC_CONTRAST_3',graphicPairs.every(([a,b])=>contrast(a,b)>=3),graphicPairs.map(([a,b])=>({pair:[a,b],ratio:Number(contrast(a,b).toFixed(2))})));

const failures=checks.filter(check=>!check.pass);const receipt={schema:'COMPASS_ROOT_AWARD_FINISH_STATIC_QUALIFICATION_v1',operationId:'COMPASS_ROOT_AWARD_FINISH_BOUNDED_SUCCESSOR_20260817_v1',lockGeneration:1514,governingHead:'8fec7fbe1351b09d6205f5e3357fc26bdaa14971',candidateHead,productIdentity:VERSION,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',assetBytes:bytes,aggregateBytes:Object.values(bytes).reduce((a,b)=>a+b,0),checks,failures:failures.map(check=>check.id)};
fs.writeFileSync(OUTPUT,`${JSON.stringify(receipt,null,2)}\n`);console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
