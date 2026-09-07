import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
process.chdir(ROOT);
const CONTRACT_PATH='control-plane/whole-estate/characters-reconstruction-v1/gen1980-environment-material-successor-contract.v1.json';
const contract=JSON.parse(fs.readFileSync(CONTRACT_PATH,'utf8'));
const outputIndex=process.argv.indexOf('--output');
const outputPath=outputIndex>=0?process.argv[outputIndex+1]:null;
const checks=[];
const failures=[];
const check=(id,pass,details={})=>{const row={id,pass:Boolean(pass),details};checks.push(row);if(!row.pass)failures.push(row);return row.pass;};
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const median=values=>{const xs=values.filter(finite).sort((a,b)=>a-b);if(!xs.length)return Infinity;const m=Math.floor(xs.length/2);return xs.length%2?xs[m]:(xs[m-1]+xs[m])/2;};
const currentBlob=file=>git('hash-object',file);
const substrateBlob=file=>git('rev-parse',`${contract.productSubstrate}:${file}`);

const exactHead=git('rev-parse','HEAD^{commit}');
let substrateAncestor=false;
try{execFileSync('git',['merge-base','--is-ancestor',contract.productSubstrate,exactHead],{stdio:'ignore'});substrateAncestor=true;}catch{}
check('EXACT_PRODUCT_SUBSTRATE_LINEAGE',substrateAncestor,{productSubstrate:contract.productSubstrate,exactHead});
const changed=git('diff','--name-only',`${contract.productSubstrate}...${exactHead}`).split('\n').filter(Boolean);
const allowed=new Set(contract.allowedPaths);
const outOfScope=changed.filter(file=>!allowed.has(file));
check('EXACT_ALLOWED_DIFF_ONLY',outOfScope.length===0,{changed,outOfScope});
for(const required of contract.allowedPaths)check(`REQUIRED_PATH_PRESENT:${required}`,fs.existsSync(required),{});

const v5Blob=currentBlob('characters/vegetation-representation.mjs');
check('V5_BLOB_BYTE_IDENTICAL',v5Blob===contract.frozenV5Blob,{expected:contract.frozenV5Blob,actual:v5Blob});
for(const file of contract.protectedByteIdentityPaths){const expected=substrateBlob(file),actual=currentBlob(file);check(`PROTECTED_BYTE_IDENTITY:${file}`,actual===expected,{expected,actual});}
for(const file of ['characters/vegetation-population.mjs','characters/vegetation-understory.mjs','characters/app.mjs']){const r=spawnSync(process.execPath,['--check',file],{cwd:ROOT,encoding:'utf8'});check(`NODE_SYNTAX:${file}`,r.status===0,{status:r.status,stderr:r.stderr?.trim()});}

const appSource=fs.readFileSync('characters/app.mjs','utf8');
const appDiff=git('diff','--unified=0',contract.productSubstrate,'HEAD','--','characters/app.mjs');
for(const token of contract.surfaceContainment.requiredSourceTokens)check(`APP_CONTAINMENT_TOKEN:${token}`,appSource.includes(token),{});
const changedAppLines=appDiff.split('\n').filter(line=>/^[+-]/.test(line)&&!/^[-+]{3}/.test(line));
const disallowedAppLines=changedAppLines.filter(line=>!contract.surfaceContainment.permittedChangedLineTokens.some(token=>line.includes(token)));
check('APP_DIFF_CONTAINMENT_ONLY',disallowedAppLines.length===0,{disallowedAppLines:disallowedAppLines.slice(0,20)});
const pair=name=>{const m=appSource.match(new RegExp(`${name}:compact\\?([-.0-9]+):([-.0-9]+)`));return m?{compact:Number(m[1]),desktop:Number(m[2])}:{compact:NaN,desktop:NaN};};
for(const [name,minCompact,minDesktop] of [
  ['padX',contract.surfaceContainment.minimumCompactPadX,contract.surfaceContainment.minimumDesktopPadX],
  ['padNearZ',contract.surfaceContainment.minimumCompactPadNearZ,contract.surfaceContainment.minimumDesktopPadNearZ],
  ['waterMarginX',contract.surfaceContainment.minimumCompactWaterMarginX,contract.surfaceContainment.minimumDesktopWaterMarginX],
  ['waterFarZ',contract.surfaceContainment.minimumCompactWaterFarZ,contract.surfaceContainment.minimumDesktopWaterFarZ]
]){const value=pair(name);check(`APP_${name.toUpperCase()}_COMPACT`,value.compact>=minCompact,{actual:value.compact,minimum:minCompact});check(`APP_${name.toUpperCase()}_DESKTOP`,value.desktop>=minDesktop,{actual:value.desktop,minimum:minDesktop});}

const [populationMod,understoryMod,representationMod,compositionMod,edgeMod,step9Mod]=await Promise.all([
  import('../../../characters/vegetation-population.mjs'),
  import('../../../characters/vegetation-understory.mjs'),
  import('../../../characters/vegetation-representation.mjs'),
  import('../../../characters/vegetation-composition.mjs'),
  import('../../../characters/vegetation-edge-ecology.mjs'),
  import('../../../characters/step9-regional-geography.mjs')
]);

const population=populationMod.getCanonicalVegetationPopulation();
const grid=populationMod.CANONICAL_VEGETATION_POPULATION_CONTRACT?.grid;
check('CANOPY_COUNT_EXACTLY_818',population.instanceCount===contract.population.exactCanopyCount,{instanceCount:population.instanceCount});
check('POPULATION_LATTICE_FLOOR',grid?.columns>=contract.population.minimumLatticeColumns&&grid?.rows>=contract.population.minimumLatticeRows,{grid});
check('POPULATION_CONTIGUITY_LAW',String(population.diagnostics?.selectionLaw||'').includes(contract.population.requiredSelectionLawToken),{selectionLaw:population.diagnostics?.selectionLaw});
check('POPULATION_DEVICE_CAMERA_INVARIANT',populationMod.getCanonicalVegetationPopulation({deviceClass:'desktop',camera:{eye:{x:0,y:0,z:0}}})===populationMod.getCanonicalVegetationPopulation({deviceClass:'mobile',camera:{eye:{x:999,y:999,z:999}}}),{});
const freshScript=`import crypto from 'node:crypto';const {getCanonicalVegetationPopulation}=await import('./characters/vegetation-population.mjs');const p=getCanonicalVegetationPopulation();process.stdout.write(crypto.createHash('sha256').update(JSON.stringify(p.instances.map(x=>[x.id,x.world.x,x.world.y,x.world.z,x.standId,x.spatialZone]))).digest('hex'));`;
const fresh=spawnSync(process.execPath,['--input-type=module','-e',freshScript],{cwd:ROOT,encoding:'utf8'});
const localDigest=digest(population.instances.map(x=>[x.id,x.world.x,x.world.y,x.world.z,x.standId,x.spatialZone]));
check('POPULATION_FRESH_PROCESS_DETERMINISTIC',fresh.status===0&&fresh.stdout.trim()===localDigest,{status:fresh.status,expected:localDigest,actual:fresh.stdout?.trim(),stderr:fresh.stderr?.trim()});
const hardOpenCanopy=population.instances.filter(x=>x.spatialZone==='OPENING'||compositionMod.resolveCompositionAt(x.world.x,x.world.z).hardOpen===true);
check('HARD_OPEN_CORES_PRESERVED',hardOpenCanopy.length===0,{count:hardOpenCanopy.length});
const interior=population.instances.filter(x=>x.spatialZone==='INTERIOR');
const nearest=[];
for(let i=0;i<interior.length;i++){let best=Infinity;for(let j=0;j<interior.length;j++)if(i!==j){const dx=interior[i].world.x-interior[j].world.x,dz=interior[i].world.z-interior[j].world.z;best=Math.min(best,Math.hypot(dx,dz));}if(finite(best))nearest.push(best);}
const interiorMedianNearest=median(nearest);
check('INTERIOR_CANOPY_CONTIGUITY_DISTANCE',interiorMedianNearest<=contract.population.maximumInteriorMedianNearestNeighborDistance,{interiorCount:interior.length,medianNearestNeighborDistance:interiorMedianNearest,maximum:contract.population.maximumInteriorMedianNearestNeighborDistance});

const aurenBinding=step9Mod.STEP9_DESTINATION_BINDINGS?.auren;
const manorBinding=step9Mod.STEP9_DESTINATION_BINDINGS?.manor;
const aurenSite=aurenBinding?step9Mod.resolveStep9Site(aurenBinding.siteId):null;
const aurenCamera=aurenBinding?step9Mod.resolveStep9Camera(aurenBinding.siteId):null;
const manorCamera=manorBinding?step9Mod.resolveStep9Camera(manorBinding.siteId):null;
const aurenEnv=aurenSite?edgeMod.resolveVegetationEnvironment(aurenSite.world.x,aurenSite.world.z):null;
const localAuren=aurenSite?population.instances.filter(x=>x.spatialZone==='INTERIOR'&&Math.hypot(x.world.x-aurenSite.world.x,x.world.z-aurenSite.world.z)<=contract.population.aurenLocalRadius):[];
check('AUREN_NORMAL_DESTINATION_CAMERA',Boolean(aurenBinding&&aurenCamera&&aurenBinding.siteId===contract.mandatoryIndependentWitness.destinationId.toUpperCase()+'_LOCAL'),{siteId:aurenBinding?.siteId});
check('AUREN_INTERIOR_ZONE',aurenEnv?.spatialZone===contract.mandatoryIndependentWitness.requiredSpatialZone,{spatialZone:aurenEnv?.spatialZone});
check('AUREN_PERMITTED_STAND_CLASS',contract.mandatoryIndependentWitness.permittedStandClasses.includes(aurenEnv?.standClass),{standClass:aurenEnv?.standClass});
check('AUREN_LOCAL_INTERIOR_CANOPY_COUNT',localAuren.length>=contract.population.minimumAurenLocalInteriorCanopyCount,{count:localAuren.length,minimum:contract.population.minimumAurenLocalInteriorCanopyCount,radius:contract.population.aurenLocalRadius});
check('AUREN_CAMERA_DISTINCT_FROM_MANOR',Boolean(aurenCamera&&manorCamera&&digest(aurenCamera)!==digest(manorCamera)),{});

const understory=understoryMod.getCanonicalUnderstoryPopulation();
check('UNDERSTORY_DEVICE_CAMERA_INVARIANT',understory===understoryMod.getCanonicalUnderstoryPopulation({deviceClass:'mobile',camera:{eye:{x:5,y:5,z:5}}}),{});
check('UNDERSTORY_INSTANCE_FLOOR',understory.instanceCount>=contract.understory.minimumInstanceCount,{actual:understory.instanceCount,minimum:contract.understory.minimumInstanceCount});
check('UNDERSTORY_COMPACT_PRESENTATION_FLOOR',understoryMod.V4_UNDERSTORY_CONTRACT.compactPresentationSampling>=contract.understory.minimumCompactPresentationSampling,{actual:understoryMod.V4_UNDERSTORY_CONTRACT.compactPresentationSampling,minimum:contract.understory.minimumCompactPresentationSampling});
const openingYoung=understory.instances.filter(x=>x.spatialZone==='OPENING'&&['LOW_SHRUB','SAPLING_YOUNG_GROWTH'].includes(x.type));
check('OPENING_SIGHTLINE_GROWTH_SUPPRESSED',openingYoung.length===0,{count:openingYoung.length});
const allReeds=understory.instances.filter(x=>x.type===contract.understory.requiredHydrologyClass);
const hydrologyQualifiedReeds=allReeds.filter(x=>x.drainageClass==='LAND'&&x.shorelineDistance>=2&&Math.max(Number(x.riverWeight)||0,Number(x.lakeWeight)||0)>=contract.understory.minimumHydrologyWeightForReed);
check('HYDROLOGY_CAUSED_WET_MARGIN_REEDS',hydrologyQualifiedReeds.length>=contract.understory.minimumHydrologyQualifiedReedCount,{qualifiedCount:hydrologyQualifiedReeds.length,totalReeds:allReeds.length,minimum:contract.understory.minimumHydrologyQualifiedReedCount});
const interiorFloor=understory.instances.filter(x=>x.type==='FOREST_FLOOR_CLUSTER'&&x.spatialZone==='INTERIOR');
check('INTERIOR_FOREST_FLOOR_FLOOR',interiorFloor.length>=contract.understory.minimumInteriorForestFloorCount,{actual:interiorFloor.length,minimum:contract.understory.minimumInteriorForestFloorCount});
check('UNDERSTORY_COVERAGE_PROBABILITY_EXPLICIT',understory.instances.length>0&&understory.instances.every(x=>finite(x.coverageProbability)&&x.coverageProbability>0),{instanceCount:understory.instanceCount});

const frame=representationMod.buildVegetationRepresentationFrame({camera:{eye:{x:0,y:365,z:590},look:{x:70,y:24,z:-660}},previousFrame:null});
check('V5_REPRESENTATION_COUNT_PRESERVED',frame.canonicalPopulationCount===818&&frame.representationCount===818,{canonicalPopulationCount:frame.canonicalPopulationCount,representationCount:frame.representationCount});
check('V5_REPRESENTATION_AUTHORITY_PRESERVED',frame.lodAuthority==='CAMERA_DISTANCE'&&frame.hysteresisApplied===true,{lodAuthority:frame.lodAuthority,hysteresisApplied:frame.hysteresisApplied});
check('EXPERIENCE_LAYER_MUTATION_NOT_AUTHORIZED',contract.integratedExperienceMutationAuthorized===false,{});
check('MATERIAL_DISPOSITION_UNASSIGNED',contract.materialDisposition==='UNASSIGNED'&&contract.materialDispositionAuthority===false,{materialDisposition:contract.materialDisposition,materialDispositionAuthority:contract.materialDispositionAuthority});
check('SPARSE_CHECKOUT_LAW_FROZEN',contract.checkoutLaw==='EXACT_REF_BLOB_FILTERED_CONE_SPARSE_INDEX_ONLY',{checkoutLaw:contract.checkoutLaw});

const result=failures.length?'FAIL_CLOSED':'PASS_CLOSED';
const receipt={schema:'MIRRORLAND_GEN1980_ENVIRONMENT_MATERIAL_SUCCESSOR_QUALIFICATION_RECEIPT_v1',operationId:contract.operationId,lockGeneration:contract.lockGeneration,exactHead,productSubstrate:contract.productSubstrate,governingMain:contract.governingMain,result,boundary:result==='PASS_CLOSED'?contract.targetBoundary:'ENVIRONMENT_SUCCESSOR_MECHANICAL_FAIL_CLOSED',materialDisposition:'UNASSIGNED',materialDispositionAuthority:false,canopyCount:population.instanceCount,understoryCount:understory.instanceCount,aurenLocalInteriorCanopyCount:localAuren.length,interiorMedianNearestNeighborDistance:interiorMedianNearest,hydrologyQualifiedReedCount:hydrologyQualifiedReeds.length,totalReedCount:allReeds.length,interiorForestFloorCount:interiorFloor.length,v5RepresentationBlob:v5Blob,v5RepresentationPreserved:v5Blob===contract.frozenV5Blob,changedPaths:changed,passCount:checks.filter(x=>x.pass).length,failCount:failures.length,checks};
if(outputPath){fs.mkdirSync(path.dirname(path.resolve(outputPath)),{recursive:true});fs.writeFileSync(path.resolve(outputPath),JSON.stringify(receipt,null,2)+'\n');}
process.stdout.write(JSON.stringify(receipt,null,2)+'\n');
process.exitCode=result==='PASS_CLOSED'?0:1;
