import fs from 'node:fs';

const VERSION='compass-awards-trl-brain-successor-v1';
const files={
  input:'assets/compass/compass.orbit-input.js',statement:'assets/compass/compass.statement-carousel.js',statementCss:'assets/compass/compass.statement-carousel.css',brain:'assets/compass/compass.brain-scene.js',capability:'assets/compass/compass.capability-carousel.js',capabilityCss:'assets/compass/compass.capability-carousel.css',index:'index.html'
};
const budgets={input:4096,statement:6144,statementCss:4096,brain:16384,capability:16384,capabilityCss:16384};
const text=Object.fromEntries(Object.entries(files).map(([key,file])=>[key,fs.readFileSync(file,'utf8')]));
const bytes=Object.fromEntries(Object.keys(budgets).map(key=>[key,Buffer.byteLength(text[key])]));
const checks=[];const check=(id,pass,evidence)=>checks.push({id,pass:Boolean(pass),evidence});
for(const [key,max] of Object.entries(budgets))check(`BUDGET_${key.toUpperCase()}`,bytes[key]<=max,{bytes:bytes[key],max});
check('SIX_ASSET_AGGREGATE_UNDER_48_KIB',Object.values(bytes).reduce((a,b)=>a+b,0)<=49152,{bytes:Object.values(bytes).reduce((a,b)=>a+b,0),baselineBytes:22294,max:49152,justification:'parametric anatomy plus Awards and proof carousels'});
check('LEGACY_BUNDLE_NOT_LOADED',!text.index.includes('compass.carousel.js')&&!text.index.includes('compass.carousel.css'),'legacy monolith absent');
const expectedRefs=['compass.statement-carousel.css','compass.capability-carousel.css','compass.orbit-input.js','compass.statement-carousel.js','compass.brain-scene.js','compass.capability-carousel.js'].map(name=>`/assets/compass/${name}?v=${VERSION}`);
check('EXACT_SIX_CACHE_BUSTED_REFERENCES',expectedRefs.every(ref=>text.index.includes(ref))&&(text.index.match(new RegExp(VERSION,'g'))||[]).length===6,{version:VERSION,refs:expectedRefs});
check('RUNTIME_IDENTITY_BOUND',text.capability.includes("version:'awards-trl-brain-successor-v1'"),'awards-trl-brain-successor-v1');

const capabilityOrder=[...text.capability.matchAll(/dataset\.capability='([^']+)'/g)].map(match=>match[1]).slice(0,3);
check('CAPABILITY_ORDER_EXACT',JSON.stringify(capabilityOrder)===JSON.stringify(['diagnostic','awards','house']),capabilityOrder);
check('THREE_POSITION_DEPTH',text.capability.includes("'rear-next':'rear-prev'")&&text.capability.includes('cards.length')&&text.capabilityCss.includes('[data-slot="rear-next"]')&&text.capabilityCss.includes('[data-slot="rear-prev"]'),'front + two rear canonical slots');
const awardsCopy=['Awards &amp; Recognition','One body of work. Five reasons to look closer.','Interactive worlds. Original characters. Browser-native 3D. A growing software platform. Governed construction that keeps the whole estate coherent as it evolves.','Experience','Native Craft','Governed Construction','Continuity &amp; Recovery','Integrated Platform','Explore the Awards Layer','/showroom/globe/h-earth/awards/','Built in 2026 · Entering the 2027 award season'];
check('AWARDS_FROZEN_COPY',awardsCopy.every(value=>text.capability.includes(value)),awardsCopy);
check('AWARDS_EXACTLY_FIVE_FACETS',(text.capability.match(/<li>(?:Experience|Native Craft|Governed Construction|Continuity &amp; Recovery|Integrated Platform)<\/li>/g)||[]).length===5,5);
check('AWARDS_FINITE_ACTIVATION',text.capability.includes("awards.classList.add('is-illuminating')")&&text.capability.includes("awards.classList.remove('is-illuminating')")&&text.capability.includes('setTimeout')&&!/compass-facet-arrival[^}]*infinite/.test(text.capabilityCss),'one finite five-facet arrival');
check('AWARDS_NO_RECEIVED_RECOGNITION_CLAIM',!/(award[- ]winning|award winner|has won|received an award)/i.test(text.capability),'bounded award-season language');
const houseRoutes=[['jeeves','/showroom/globe/hearth/jeeves/'],['elara','/elara/'],['auren','/products/auren/']];
for(const [id,route] of houseRoutes)check(`HOUSE_${id.toUpperCase()}_ROUTE`,text.capability.includes(`id:'${id}'`)&&text.capability.includes(`href:'${route}'`),route);
check('HOUSE_STATE_ISOLATED',text.capability.includes("mode='house'")&&text.capability.includes("mode='orbit'")&&text.capability.includes("mode!=='orbit'")&&text.capability.includes("mode!=='house'"),'nested state owned separately');
check('HOUSE_RETURN_RESTORES_PARENT',text.capability.includes('function renderCards')&&text.capability.includes("focus(house.querySelector('[data-enter-house]'))"),'House card and focus restored');

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

const failures=checks.filter(check=>!check.pass);const receipt={schema:'COMPASS_AWARDS_TRL_BRAIN_SUCCESSOR_STATIC_v1',productIdentity:VERSION,result:failures.length?'FAIL_CLOSED':'PASS_CLOSED',assetBytes:bytes,aggregateBytes:Object.values(bytes).reduce((a,b)=>a+b,0),checks,failures:failures.map(check=>check.id)};
console.log(JSON.stringify(receipt,null,2));if(failures.length)process.exit(1);
