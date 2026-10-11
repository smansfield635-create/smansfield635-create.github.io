import fs from 'node:fs';
import crypto from 'node:crypto';
import {buildForestRepresentationDiagnosticData,TREE_ARCHETYPES,TREE_VARIANTS,LOD_BANDS,WIND_GRAMMAR} from '../../../characters/forest-representation-diagnostic.mjs';

const issues=[];const check=(id,pass)=>{if(!pass)issues.push(id)};
const contract=JSON.parse(fs.readFileSync('control-plane/whole-estate/characters-reconstruction-v1/forest-representation-contract.v1.json','utf8'));
const html=fs.readFileSync('characters/forest-representation-diagnostic.html','utf8');
const source=fs.readFileSync('characters/forest-representation-diagnostic.mjs','utf8');
const dataA=buildForestRepresentationDiagnosticData();const dataB=buildForestRepresentationDiagnosticData();
const ids=Object.keys(TREE_ARCHETYPES);const silhouettes=ids.map(id=>TREE_ARCHETYPES[id].silhouette);

check('CONTRACT_SCHEMA',contract.schema==='MIRRORLAND_FOREST_REPRESENTATION_CONTRACT_v1');
check('SIX_ARCHETYPES_PRESENT',ids.length===6&&contract.archetypes?.length===6);
check('THREE_VARIANTS_PER_ARCHETYPE',ids.every(id=>TREE_VARIANTS[id]?.length>=3));
check('DETERMINISTIC_VARIATION',JSON.stringify(dataA)===JSON.stringify(dataB));
check('VARIATION_PARAMETER_SET',Array.isArray(contract.variationParameters)&&contract.variationParameters.length>=10);
check('SILHOUETTE_PARAMETERS_DISTINCT',new Set(silhouettes).size===ids.length);
check('NO_STACKED_CONE_ARCHETYPE',contract.treeConstructionLaw?.stackedConeAllowed===false&&dataA.stackedConePrimitiveUsed===false);
check('NO_SINGLE_MESH_FOREST',contract.treeConstructionLaw?.singleMeshForestAllowed===false);
check('NO_UNIFORM_RANDOM_SCATTER',contract.placementGrammar?.uniformRandomScatterAllowed===false&&dataA.uniformRandomScatterUsed===false);
check('NEAR_MID_FAR_LOD_DECLARED',['NEAR','MID','FAR'].every(id=>LOD_BANDS[id]?.rootStable===true));
check('MOBILE_LOD_DECLARED',LOD_BANDS.MOBILE?.rootStable===true&&Boolean(contract.lod?.mobile));
check('NO_ROOT_SHIFT_ACROSS_LOD',contract.lod?.rootPositionChangesAcrossLod===false);
check('NO_PER_LEAF_CPU_ANIMATION',WIND_GRAMMAR.perLeafCpuAnimation===false&&contract.wind?.perLeafCpuAnimationAllowed===false);
check('WORLD_PLANTING_ABSENT',dataA.worldPlantingPerformed===false&&contract.worldPlantingAllowed===false);
check('UPSTREAM_GEOGRAPHY_UNCHANGED',dataA.geographyMutationPerformed===false&&contract.geographyMutationAllowed===false);
check('DIAGNOSTIC_ALL_ARCHETYPES',ids.every(id=>html.includes(`data-archetype="${id}"`)));
check('DIAGNOSTIC_NEAR_MID_FAR',['NEAR','MID','FAR'].every(id=>html.includes(`data-lod="${id}"`)));
check('DIAGNOSTIC_MONOCHROME_MODE',html.includes('data-monochrome')&&html.includes('Monochrome silhouette'));
check('NO_EXTERNAL_TREE_ASSET_DEPENDENCY',!source.includes('/assets/')&&!html.includes('<img'));
check('NO_RUNTIME_WORLD_IMPORTS',!source.includes('night-renderer')&&!source.includes('gratitude-geography')&&!source.includes('h-earth-3d'));

const receipt={schema:'MIRRORLAND_FOREST_REPRESENTATION_2A_RECEIPT_v1',operationId:'MIRRORLAND_FOREST_REPRESENTATION_2A_20260903_004',result:issues.length?'FAIL_CLOSED':'PASS_CLOSED',archetypeCount:ids.length,variantCount:Object.values(TREE_VARIANTS).reduce((n,v)=>n+v.length,0),silhouetteCount:new Set(silhouettes).size,lodBands:Object.keys(LOD_BANDS),worldPlantingPerformed:false,geographyMutationPerformed:false,issues};
receipt.diagnosticDataSha256=crypto.createHash('sha256').update(JSON.stringify(dataA)).digest('hex');
receipt.receiptSha256=crypto.createHash('sha256').update(JSON.stringify(receipt)).digest('hex');
fs.writeFileSync('forest-representation-2a-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));if(issues.length)process.exit(1);
