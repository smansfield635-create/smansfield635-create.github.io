import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';

const renderer=readFileSync(new URL('../../showroom/globe/h-earth/render/persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js',import.meta.url),'utf8');
// Execute the actual scalar GLSL helper with only declaration/literal syntax
// translated. No independent eligibility predicate is maintained in the test.
const body=renderer.match(/float authoredTreeMaterialWeight\([^)]*\)\{([\s\S]*?)\n\}/)?.[1];
assert.ok(body,'shader material helper exists');
const weight=new Function('model','role','parameters','enabled','edge',body.replace(/\bbool\b/g,'const').replace(/\b(\d+)u\b/g,'$1'));
const clearingTypeExpression=renderer.match(/float clearingType=([^;]+);/)[1].replace(/\b(\d+)u\b/g,'$1');
const initialType=new Function('vMaterialModelCode','vMaterialParameters',`return ${clearingTypeExpression}`);
const reset=renderer.match(/if\((clearingType>0\.5&&[^)]*)\)clearingType=0\.0;/)[1];
const resetType=new Function('clearingType','treeMaterialWeight',`if(${reset})clearingType=0;return clearingType;`);
const typeAt=(model,role,parameters,enabled,edge)=>resetType(initialType(model,parameters),weight(model,role,parameters,enabled,edge));
const roleForType=z=>roles[z===1?'LAND_SURFACE':'VEGETATION'];
const tags=z=>({x:.3,y:.7,z,w:2});

// Fixed Gen2800 sites from the accepted planting packet. Four original-region
// witnesses are sampled controls, not a claim of the four original root centers.
const added=[[55.5,-307.5],[47.5,-317.5],[71.5,-291.5],[63.5,-301.5]];
const original=[[-150,-220],[-145,-215],[-140,-210],[-130,-200]];
const bounds=[-155.40267987050615,-226.74616902099837,-123.40267987050615,-194.74616902099837];
const edgeAt=([x,z])=>{const d=Math.min(x-bounds[0],z-bounds[1],bounds[2]-x,bounds[3]-z);const t=Math.max(0,Math.min(1,d/1.5));return t*t*(3-2*t);};

test('all four added sites retain authored bark and leaves outside the clearing',()=>{
  for(const site of added){assert.equal(edgeAt(site),0);for(const z of [1,2]){assert.equal(weight(0,roleForType(z),tags(z),1,0),1);assert.equal(typeAt(0,roleForType(z),tags(z),1,0),z);}}
});
test('reference interior and fractional edge treatment are numerically unchanged',()=>{
  for(const edge of [...original.map(edgeAt),0.0001,.1,.5,.99,1])for(const z of [1,2,3]){
    assert.equal(weight(0,roleForType(z),tags(z),1,edge),edge);
    assert.equal(typeAt(0,roleForType(z),tags(z),1,edge),z);
  }
});
test('outside negative controls cannot gain tree material eligibility',()=>{
  for(const role of [0,1,2,4])for(const z of [1,2])assert.equal(typeAt(0,role,tags(z),1,0),0);
  assert.equal(typeAt(0,5,tags(2),1,0),0,'crossed bark role with leaf tag');
  for(const z of [0,3,4,1.1,1.9])assert.equal(typeAt(0,roleForType(z),tags(z),1,0),0);
  for(const z of [1,2])for(const w of [0,1,1.9,3])assert.equal(typeAt(0,roleForType(z),{...tags(z),w},1,0),0);
  for(const z of [1,2])assert.equal(typeAt(1,roleForType(z),tags(z),1,0),0);
  for(const z of [1,2])assert.equal(typeAt(0,roleForType(z),tags(z),0,0),0);
});
test('actual shader leaf alpha cutout applies at added sites and preserves threshold',()=>{
  const clause=renderer.match(/if\((clearingType>1\.5&&clearingType<2\.5)\)\{clearingTexel=texture\(uClearingLeaf,vMaterialParameters.xy\);if\((clearingTexel.a<[^)]+)\)discard;\}/);
  assert.ok(clause,'authored leaf texture and alpha branch');
  const discards=new Function('clearingType','clearingTexel',`return (${clause[1]})&&(${clause[2]});`);
  for(const site of added){const type=typeAt(0,3,tags(2),1,edgeAt(site));for(const a of [0,.1,.4499])assert.equal(discards(type,{a}),true);for(const a of [.45,.8,1])assert.equal(discards(type,{a}),false);}
  assert.equal(discards(typeAt(0,roleForType(1),tags(1),1,0),{a:0}),false);
});
test('soil/shadow bounds, shadow construction, resource setup and fog are preserved',()=>{
  const digest=s=>createHash('sha256').update(s).digest('hex');
  const spatial=renderer.slice(renderer.indexOf('  // At this clearing radius'),renderer.indexOf('  float treeMaterialWeight='));
  assert.equal(digest(spatial),'d896f65fc443cc592d03b2b191d952b1bb54715e89bd5a10fea42d9690056973');
  // All resource creation and draw code lies after the fragment shader.
  assert.equal(digest(renderer.slice(renderer.indexOf('const WOODLAND_FINE_GRASS_FS='))),'fcb2510dd3923a489ea6c255047103251f36fe71edf547d7a750dfda6f2c1109');
  assert.match(renderer,/if\(clearingEdge>0\.0\)\{\s*clearingShadowFactor=mix\(1\.0,clearingVisibility\(vWorldPosition\),clearingEdge\);/);
  assert.match(renderer,/fog=min\(uMaximumFogFactor,fog\+clearingEdge\*clamp\(distanceToCamera\/2400\.0,0\.0,0\.035\)\);/);
  assert.match(renderer,/base\*=mix\(vec3\(1\.0\),detail,treeMaterialWeight\*0\.78\);/);
  assert.match(renderer,/if\(treeMaterialWeight!=1\.0\)/);
});

// Read production functions without importing the full terrain/grass census.
// A flat synthetic support anchor is used only for tree placement. Material
// arrays come from the actual tree generator; no published-mesh equivalence claim.
const sourceDir=process.env.H_EARTH_MATERIAL_SOURCE_DIR;
const source=name=>readFileSync(sourceDir?`${sourceDir}/${name}`:new URL(`../../showroom/globe/h-earth/render/${name}`,import.meta.url),'utf8');
const producer=source('live-render-package.run8e-r2.js'),gpu=source('gpu-upload-views.run8e-r2d.js');
const sector=source('geometry-landscape-sector.p2.js'),treeSource=source('geometry-woodland-tree-trial.js'),clearingSource=source('woodland-clearing-trial.js');
const between=(s,a,b)=>{const start=s.indexOf(a),end=s.indexOf(b,start);assert.ok(start>=0&&end>start,`${a} source boundary`);return s.slice(start,end);};
const withoutModules=s=>s.replace(/^import .*;\n/gm,'').replace(/\bexport /g,'');
const clearingApi=new Function(`${withoutModules(clearingSource).replaceAll('import.meta.url',JSON.stringify('file:///test-only-clearing.js'))};return {H_EARTH_WOODLAND_CLEARING_TREE_IDS,clearingLeafAtlasUV};`)();
const appendTree=new Function(...Object.keys(clearingApi),`${withoutModules(treeSource)};return appendHEarthWoodlandTreeTrial;`)(...Object.values(clearingApi));
const sectorApi=new Function(`${withoutModules(sector.slice(0,sector.indexOf('export function buildHEarthLandscapeSector')))};return {mesh,hash,openWoodlandTree};`)();
const candidateCode=between(sector,' const candidates=[];',' if(reverseGenerationOrder)');
const candidates=new Function('hash',`${candidateCode};return candidates;`)(sectorApi.hash);
const roles=new Function('freezeRecord',`return ${producer.match(/export const H_EARTH_RUN_8E_R2_ROLE_CODE = (freezeRecord\([\s\S]*?\));/)[1]};`)(Object.freeze);
const roleFor=new Function(`${between(producer,'function roleForPrimitive','function vegetationRgba')};return roleForPrimitive;`)();
const projectRoles=new Function('freezeRecord',`${between(gpu,'function projectGpuRoleCodes','function invertSphericalPresentationPoint')};return projectGpuRoleCodes;`)(Object.freeze);
const modelExpression=producer.match(/const materialModelCode = (role === 'TERRAIN'[\s\S]*?);/)[1];
const models=new Function('freezeRecord',`return ${producer.match(/export const H_EARTH_RUN_8E_R2_MATERIAL_MODEL = (freezeRecord\([\s\S]*?\));/)[1]};`)(Object.freeze);
const modelFor=new Function('role','H_EARTH_RUN_8E_R2_MATERIAL_MODEL',`return ${modelExpression};`);
const parameterStatement=producer.match(/materialParameters.push\(0, 0, 0, primitive.metadata\?\.landscapeSectorKind \? 2 : 0\);/)[0];
const paramsFor=new Function('primitive',`const materialParameters=[];${parameterStatement};return materialParameters;`);
const plantingSource=source('verified-planting-packet.v1.js');
const plantingTrees=JSON.parse(plantingSource.match(/H_EARTH_VERIFIED_PLANTING_TREES = Object.freeze\((\[[^\n]+\])\.map/)[1]);
const bark=sectorApi.mesh(),foliage=sectorApi.mesh(),templates=[];
const treeConstruction=between(sector,' const originalBark=mesh(),originalFoliage=mesh();',' }else if(id.startsWith');
const construct=new Function('mesh','openWoodlandTree','appendHEarthWoodlandTreeTrial','bark','foliage','p','height','leanX','leanZ',`let scaffold;const barkVertexStart=bark.vertices.length;${treeConstruction}`);
for(const t of plantingTrees){
  const p={...candidates.find(p=>p.id===t.templateId),radius:2.4+sectorApi.hash(t.templateId,'crown')*2,anchor:{y:0}};
  const height=8+sectorApi.hash(p.id,'height')*8,leanX=(sectorApi.hash(p.id,'leanX')-.5)*1.1,leanZ=(sectorApi.hash(p.id,'leanZ')-.5)*1.1;
  construct(sectorApi.mesh,sectorApi.openWoodlandTree,appendTree,bark,foliage,p,height,leanX,leanZ);
  templates.push({...p,crownRadius:p.radius,trunkRadius:.32+height*.018});
}
const strides={positions:3,normals:3,baseColorsLinear:4,materialParameters:4,materialModelCodes:1,surfaceClassCodes:1,primitiveIndices:1,roleCodes:1};
const raw={buffers:Object.fromEntries([...Object.keys(strides),'indices'].map(k=>[k,[]])),clearingAttributes:[],primitiveSpans:[]};
for(const [name,mesh] of [['BARK',bark],['CANOPY',foliage]]){
  const primitive={primitiveId:`H_EARTH_LANDSCAPE_P2_${name}`,metadata:{landscapeSectorKind:'TREE'}};
  const role=roleFor(primitive,'TERRAIN'),model=modelFor(role,models),parameters=paramsFor(primitive),start=raw.buffers.positions.length/3,indexStart=raw.buffers.indices.length;
  for(let i=0;i<mesh.vertices.length;i++){
    const v=mesh.vertices[i];raw.buffers.positions.push(v.x,v.y,v.z);raw.buffers.normals.push(0,1,0);raw.buffers.baseColorsLinear.push(1,1,1,1);
    raw.buffers.materialParameters.push(...parameters);raw.buffers.materialModelCodes.push(model);raw.buffers.surfaceClassCodes.push(255);raw.buffers.primitiveIndices.push(raw.primitiveSpans.length);raw.buffers.roleCodes.push(roles[role]);raw.clearingAttributes.push(...mesh.clearingAttributes[i]);
  }
  raw.buffers.indices.push(...mesh.indices.map(i=>i+start));
  raw.primitiveSpans.push({...primitive,role,vertexStart:start,vertexCount:mesh.vertices.length,indexStart,indexCount:mesh.indices.length,triangleCount:mesh.indices.length/3,normalSource:'TEST_ONLY_SYNTHETIC_NORMAL'});
}
// Execute the production planting loop, including all attribute copies and all
// four real packet records. Ancillary terrain/hash qualification is out of scope.
const buffers=structuredClone(raw.buffers),clearing=[...raw.clearingAttributes],spans=[...raw.primitiveSpans],ranges=[],floor=[...templates],cover=[];
const copyCode=between(producer,'  for(let ti=0;ti<4;ti++){','  const sectorTriangles=');
const merge=new Function(`${between(producer,'function mergeDrawRange','function freezeDrawRanges')};return mergeDrawRange;`)();
new Function('raw','H_EARTH_VERIFIED_PLANTING_TREES','templates','anchors','buffers','clearing','spans','ranges','roles','normals','floor','cover','number','freezeRecord','mergeDrawRange',copyCode)(raw,plantingTrees,templates,[0,0,0,0],buffers,clearing,spans,ranges,{LAND_SURFACE:1,VEGETATION:1},{},floor,cover,v=>v,Object.freeze,merge);
const canonicalMaterialParameters={view:new Float32Array(buffers.materialParameters)};
const clearingProjection=between(gpu,'  let clearingProjectedVertexCount=0;','  const projectedRoleCodes =');
new Function('packageRecord','rawViews','canonicalMaterialParameters','options',clearingProjection)({clearingAttributes:clearing,clearingContentDigest:'TEST_GENERATED_ATTRIBUTES'},buffers,canonicalMaterialParameters,{enableWoodlandClearing:true});
const gpuRoles=projectRoles(buffers.roleCodes).view;
const actualVertices=[];
for(const span of spans.filter(s=>s.plantingTreeId))for(let i=span.vertexStart;i<span.vertexStart+span.vertexCount;i++){
  const [x,y,z,w]=canonicalMaterialParameters.view.slice(i*4,i*4+4);
  actualVertices.push({tree:span.plantingTreeId,kind:span.primitiveId.endsWith('_BARK')?'BARK':'CANOPY',model:buffers.materialModelCodes[i],role:gpuRoles[i],parameters:{x,y,z,w}});
}
test('real generator → producer → four-tree planting copy → GPU projection → shader',()=>{
  assert.equal(actualVertices.length,4*(608+7168));
  assert.equal(new Set(actualVertices.map(v=>v.tree)).size,4);
  for(const v of actualVertices){
    assert.equal(v.role,v.kind==='BARK'?5:3);assert.equal(v.parameters.z,v.kind==='BARK'?1:2);assert.equal(v.parameters.w,2);
    assert.equal(weight(v.model,v.role,v.parameters,1,0),1,`${v.tree} ${v.kind}: actual GPU role ${v.role} must retain authored material`);
    assert.equal(typeAt(v.model,v.role,v.parameters,1,0),v.parameters.z);
  }
});

// Authored understory stems genuinely use vegetation role/type1. Preserve the
// pre-existing behavior; the repair adds bark5/type1 without removing grass.
test('real understory stem material remains eligible; bark-role leaf does not',()=>{
  const stem=clearingSource.match(/stem.push\(vertex\(grass,\[r\[0\][^\n]+?,\[94,75,43,255\],(1),\[n\/4,k\]\)\)/);
  assert.ok(stem,'actual authored understory stem tag');
  const primitive={primitiveId:'H_EARTH_LANDSCAPE_P2_GRASS',metadata:{landscapeSectorKind:'GRASS'}};
  const role=projectRoles([roles[roleFor(primitive,'TERRAIN')]]).view[0],parameters={...tags(Number(stem[1])),w:paramsFor(primitive)[3]};
  assert.equal(weight(modelFor(roleFor(primitive,'TERRAIN'),models),role,parameters,1,0),1);
  assert.equal(weight(0,5,tags(2),1,0),0);
});
