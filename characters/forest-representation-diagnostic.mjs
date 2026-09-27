const deepFreeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))deepFreeze(nested,seen);return Object.freeze(value)};
const hash32=(text)=>{let h=2166136261;for(let i=0;i<text.length;i+=1){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const unit=(seed,slot)=>hash32(`${seed}:${slot}`)/4294967295;
const span=(seed,slot,min,max)=>min+(max-min)*unit(seed,slot);
const pick=(seed,slot,values)=>values[Math.min(values.length-1,Math.floor(unit(seed,slot)*values.length))];

export const FOREST_REPRESENTATION_DIAGNOSTIC_ID='MIRRORLAND_FOREST_REPRESENTATION_DIAGNOSTIC_v1';
export const FOREST_REPRESENTATION_OPERATION='MIRRORLAND_FOREST_REPRESENTATION_2A_20260903_004';

export const TREE_ARCHETYPES=deepFreeze({
  BROAD_DECIDUOUS:{label:'Broad deciduous',height:[18,32],trunkRadius:[0.55,1.05],lean:[-0.08,0.08],firstBranch:[0.28,0.43],branchAngles:['OPEN_FORK','IRREGULAR_FAN'],crownWidth:[0.72,1.05],crownHeight:[0.48,0.68],asymmetry:[-0.14,0.14],foliage:[0.72,0.94],stems:1,branchCount:[6,9],crownLobes:[7,11],silhouette:'SPREADING_IRREGULAR'},
  COLUMNAR_EVERGREEN:{label:'Columnar evergreen',height:[24,39],trunkRadius:[0.48,0.82],lean:[-0.035,0.035],firstBranch:[0.16,0.28],branchAngles:['LAYERED_WHORL','BROKEN_WHORL'],crownWidth:[0.34,0.52],crownHeight:[0.76,0.91],asymmetry:[-0.07,0.07],foliage:[0.68,0.9],stems:1,branchCount:[9,13],crownLobes:[8,13],silhouette:'NARROW_LAYERED_NOT_CONE'},
  COASTAL_WIND_SHAPED:{label:'Coastal wind-shaped',height:[13,25],trunkRadius:[0.5,0.9],lean:[0.12,0.28],firstBranch:[0.22,0.38],branchAngles:['LEEWARD_FLAG','LOW_SWEEP'],crownWidth:[0.75,1.18],crownHeight:[0.38,0.58],asymmetry:[0.2,0.42],foliage:[0.48,0.73],stems:1,branchCount:[5,8],crownLobes:[5,8],silhouette:'ASYMMETRIC_FLAGGED'},
  ANCIENT_SPREADING:{label:'Ancient spreading',height:[20,31],trunkRadius:[1.05,1.65],lean:[-0.05,0.08],firstBranch:[0.16,0.27],branchAngles:['LOW_HEAVY_FORK','WIDE_PRIMARY'],crownWidth:[1.12,1.48],crownHeight:[0.5,0.7],asymmetry:[-0.16,0.18],foliage:[0.58,0.82],stems:1,branchCount:[7,10],crownLobes:[8,12],silhouette:'LOW_WIDE_HEAVY'},
  YOUNG_UNDERSTORY:{label:'Young understory',height:[6,13],trunkRadius:[0.16,0.34],lean:[-0.12,0.12],firstBranch:[0.2,0.36],branchAngles:['EARLY_FORK','FINE_FAN'],crownWidth:[0.55,0.82],crownHeight:[0.58,0.78],asymmetry:[-0.12,0.12],foliage:[0.7,0.94],stems:3,branchCount:[4,7],crownLobes:[5,8],silhouette:'SMALL_MULTI_STEM'},
  DEAD_OR_SPARSE:{label:'Dead or sparse',height:[14,27],trunkRadius:[0.42,0.82],lean:[-0.14,0.16],firstBranch:[0.24,0.4],branchAngles:['BROKEN_SKELETON','IRREGULAR_SNAG'],crownWidth:[0.45,0.72],crownHeight:[0.48,0.7],asymmetry:[-0.22,0.22],foliage:[0.03,0.24],stems:1,branchCount:[5,9],crownLobes:[1,4],silhouette:'BROKEN_SKELETAL'}
});

const makeVariant=(archetypeId,variantIndex)=>{const a=TREE_ARCHETYPES[archetypeId];const seed=`${archetypeId}:VARIANT:${variantIndex}`;return deepFreeze({
  id:`${archetypeId}_V${variantIndex+1}`,archetypeId,seed,
  height:span(seed,'height',...a.height),trunkRadius:span(seed,'trunkRadius',...a.trunkRadius),trunkLean:span(seed,'lean',...a.lean),
  firstBranchHeight:span(seed,'firstBranch',...a.firstBranch),branchAngleFamily:pick(seed,'branchFamily',a.branchAngles),
  crownWidth:span(seed,'crownWidth',...a.crownWidth),crownHeight:span(seed,'crownHeight',...a.crownHeight),crownAsymmetry:span(seed,'asymmetry',...a.asymmetry),
  foliageDensity:span(seed,'foliage',...a.foliage),rotation:span(seed,'rotation',0,Math.PI*2),stemCount:a.stems,
  branchCount:Math.round(span(seed,'branchCount',...a.branchCount)),crownLobeCount:Math.round(span(seed,'crownLobes',...a.crownLobes)),silhouette:a.silhouette
})};

export const TREE_VARIANTS=deepFreeze(Object.fromEntries(Object.keys(TREE_ARCHETYPES).map(id=>[id,[0,1,2].map(i=>makeVariant(id,i))])));

export const LOD_BANDS=deepFreeze({
  NEAR:{branchDepth:2,crownDetail:'FULL_MULTI_LOBE',foliageRepresentation:'CLUSTERS_INSIDE_CROWN',rootStable:true},
  MID:{branchDepth:1,crownDetail:'REDUCED_MULTI_LOBE',foliageRepresentation:'BATCHED_CLUSTER_CARDS',rootStable:true},
  FAR:{branchDepth:0,crownDetail:'ARCHETYPE_SILHOUETTE',foliageRepresentation:'SIMPLIFIED_CROWN_OR_IMPOSTOR',rootStable:true},
  MOBILE:{near:'PRIMARY_BRANCHES_REDUCED_CROWN',mid:'CLUSTER_LOD',far:'ARCHETYPE_PRESERVING_IMPOSTOR_OR_CROWN_MASS',rootStable:true}
});
export const WIND_GRAMMAR=deepFreeze({execution:'BATCHED_OR_SHADER_SPACE',trunk:'LOW_FREQUENCY',branch:'MID_FREQUENCY',foliage:'HIGH_FREQUENCY',perLeafCpuAnimation:false,reducedMotion:'COMPRESS_MOTION_PRESERVE_FOREST'});

export function buildForestRepresentationDiagnosticData(){
  const archetypes=Object.entries(TREE_ARCHETYPES).map(([id,a])=>({id,label:a.label,silhouette:a.silhouette,variants:TREE_VARIANTS[id]}));
  return deepFreeze({schema:'MIRRORLAND_FOREST_REPRESENTATION_DIAGNOSTIC_DATA_v1',diagnosticId:FOREST_REPRESENTATION_DIAGNOSTIC_ID,operationId:FOREST_REPRESENTATION_OPERATION,archetypes,lod:LOD_BANDS,wind:WIND_GRAMMAR,worldPlantingPerformed:false,geographyMutationPerformed:false,stackedConePrimitiveUsed:false,uniformRandomScatterUsed:false,minimumVariantsPerArchetype:3});
}
