import {createApprovedJacarandaOverlay} from './geometry-jacaranda.v1.js';
import {inverseHEarthGroundCoverPoint} from './landscape-groundcover.global-v1.js';

// Exact owner-approved source bytes; no geometry regeneration.
export const TREE_ASSETS=Object.freeze([
  {
    "id": "wild-syringa",
    "url": "../assets/tree-collection/Tree-Small-02-Candidate.glb",
    "bytes": 18496516,
    "sha256": "236b81e864c2079dabe4c119c89c7315f0fbc4a00c96f02600e7e875342c6dc6",
    "vertices": 288516,
    "triangles": 244717,
    "materials": 3,
    "images": 9,
    "textures": 9,
    "trunkMaterial": 2,
    "alphaCutoffs": [
      0,
      0.45,
      0
    ],
    "license": "CC0"
  },
  {
    "id": "coastal-01",
    "url": "../assets/tree-collection/Coastal-Tree-01-v2-Candidate.glb",
    "bytes": 24660600,
    "sha256": "b74dd63e6ee121a6ae913719a08cb8b29e28fb3d6a4c97d2d986c92a79f23bc7",
    "vertices": 450856,
    "triangles": 363451,
    "materials": 3,
    "images": 9,
    "textures": 9,
    "trunkMaterial": 0,
    "alphaCutoffs": [
      0,
      0.45,
      0
    ],
    "license": "CC0"
  },
  {
    "id": "coastal-02",
    "url": "../assets/tree-collection/Coastal-Tree-02-Candidate.glb",
    "bytes": 19468500,
    "sha256": "6a1497c91d4a66ed26c1b56c92cdf30b5b934e00dab123bdf990930bf2aad0c2",
    "vertices": 331181,
    "triangles": 261708,
    "materials": 3,
    "images": 9,
    "textures": 9,
    "trunkMaterial": 0,
    "alphaCutoffs": [
      0,
      0.45,
      0
    ],
    "license": "CC0"
  },
  {
    "id": "coastal-03",
    "url": "../assets/tree-collection/Coastal-Tree-03-Candidate.glb",
    "bytes": 31795372,
    "sha256": "02aad9751e876d2ac2512324b13d81525048d71c6795740ab372cf8e4d27515c",
    "vertices": 637048,
    "triangles": 486878,
    "materials": 3,
    "images": 9,
    "textures": 9,
    "trunkMaterial": 0,
    "alphaCutoffs": [
      0,
      0.45,
      0
    ],
    "license": "CC0"
  },
  {
    "id": "maple-large",
    "url": "../assets/tree-collection/Maple-Large-A-Candidate.glb",
    "bytes": 10271048,
    "sha256": "56462cb37f7a9ecca707c7095b630af9fa617de4f228c5db0ee0798de6cf87d5",
    "vertices": 20918,
    "triangles": 22490,
    "materials": 2,
    "images": 6,
    "textures": 6,
    "trunkMaterial": 0,
    "alphaCutoffs": [
      0,
      0.45
    ],
    "license": "CC-BY-4.0"
  },
  {
    "id": "maple-medium",
    "url": "../assets/tree-collection/Maple-Medium-A-Candidate.glb",
    "bytes": 9899652,
    "sha256": "28a52894e3f08e060ab9eedc7908174f9d98eabc9832ef5a0a999100de7b64fa",
    "vertices": 12766,
    "triangles": 14577,
    "materials": 2,
    "images": 6,
    "textures": 6,
    "trunkMaterial": 0,
    "alphaCutoffs": [
      0,
      0.45
    ],
    "license": "CC-BY-4.0"
  },
  {
    "id": "searsia",
    "runtimeTextureSize": 1024,
    "url": "../assets/tree-collection/Searsia-Lucida-A-Candidate.glb",
    "bytes": 23471852,
    "sha256": "4fbb63bff910b2875cf2353c83eef94d7b04c6987c949a91e7635315076070f0",
    "vertices": 136311,
    "triangles": 113405,
    "materials": 3,
    "images": 5,
    "textures": 9,
    "trunkMaterial": 0,
    "alphaCutoffs": [
      0,
      0.45,
      0.45
    ],
    "license": "CC0"
  },
  {
    "id": "jacaranda",
    "url": "../assets/jacaranda/Gratitude-Jacaranda-Candidate.glb",
    "bytes": 33184612,
    "sha256": "46b65326f75c29b1f076fdd161213a226bae3f519c92a3ac9d9a1972398b7189",
    "vertices": 651794,
    "triangles": 454746,
    "materials": 3,
    "images": 9,
    "textures": 9,
    "trunkMaterial": 1,
    "alphaCutoffs": [
      0,
      0,
      0.45
    ],
    "license": "CC0"
  }
].map(Object.freeze));

export const TREE_PLACEMENTS=Object.freeze([
  {id:'COLLECTION_COASTAL_01',assetId:'coastal-01',group:'oasis',x:43,z:-315,scale:1,rotation:.35,replaces:'PROPOSED_OASIS_02'},
  {id:'COLLECTION_COASTAL_02',assetId:'coastal-02',group:'oasis',x:75,z:-294,scale:1,rotation:-.6,replaces:'PROPOSED_OASIS_03'},
  {id:'COLLECTION_COASTAL_03',assetId:'coastal-03',group:'oasis',x:61,z:-297,scale:1,rotation:.8,replaces:'PROPOSED_OASIS_04'},
  {id:'COLLECTION_MAPLE_LARGE',assetId:'maple-large',group:'woodland',x:-155,z:-228,scale:.8,rotation:.3,replaces:'P2_TREE_A_03'},
  {id:'COLLECTION_MAPLE_MEDIUM',assetId:'maple-medium',group:'woodland',x:-132,z:-224,scale:.95,rotation:-.55,replaces:'P2_TREE_A_06'},
  {id:'COLLECTION_JACARANDA_02',assetId:'jacaranda',group:'woodland',x:-144,z:-202,scale:.61,rotation:1.5,replaces:'P2_TREE_A_08'},
  {id:'COLLECTION_WILD_SYRINGA',assetId:'wild-syringa',group:'woodland',x:-123,z:-205,scale:1.1,rotation:.8,replaces:'P2_TREE_A_11'},
  {id:'COLLECTION_SEARSIA',assetId:'searsia',group:'oasis',x:78,z:-300,scale:1,rotation:-.3,replaces:null}
].map(Object.freeze));
const requireTree=(condition,code)=>{if(!condition)throw Error('TREE_COLLECTION_'+code);};

/** Subtract exact primitive spans without assuming draw-range boundaries. */
export function retainedIndexRanges(indexStart,indexCount,excludedSpans){
  requireTree(Number.isSafeInteger(indexStart)&&indexStart>=0&&Number.isSafeInteger(indexCount)&&indexCount>=0&&indexStart%3===0&&indexCount%3===0,'INDEX_RANGE');
  const end=indexStart+indexCount,ranges=[];let cursor=indexStart;
  for(const span of [...excludedSpans].sort((a,b)=>a.indexStart-b.indexStart)){
    requireTree(Number.isSafeInteger(span.indexStart)&&Number.isSafeInteger(span.indexCount)&&span.indexStart>=0&&span.indexCount>=0&&span.indexStart%3===0&&span.indexCount%3===0,'EXCLUSION_RANGE');
    const lo=Math.max(indexStart,span.indexStart),hi=Math.min(end,span.indexStart+span.indexCount);
    if(hi<=cursor||lo>=end)continue;
    if(lo>cursor)ranges.push({indexStart:cursor,indexCount:lo-cursor});
    cursor=Math.max(cursor,hi);
  }
  if(cursor<end)ranges.push({indexStart:cursor,indexCount:end-cursor});return ranges;
}

export function planTreePlacement(decoded,p,sampleGround,sampleWater=()=>null){
  requireTree([p.x,p.z,p.scale,p.rotation??0].every(Number.isFinite)&&p.scale>0&&p.scale<=1.2,'PLACEMENT_TRANSFORM');
  const ground=sampleGround(p.x,p.z);requireTree(Number.isFinite(ground?.y),'GROUND_MISSING');
  const witnesses=[];
  for(const [dx,dz] of [[0,0],[-.5,0],[.5,0],[0,-.5],[0,.5]]){
    const soil=sampleGround(p.x+dx,p.z+dz),water=sampleWater(p.x+dx,p.z+dz);
    requireTree(Number.isFinite(soil?.y),'ROOT_SUPPORT_MISSING');
    requireTree(!water||!Number.isFinite(water.y)||water.y<soil.y-.03,'ROOT_IN_WATER');
    requireTree(Math.abs(soil.y-ground.y)<.55,'ROOT_SLOPE');witnesses.push({x:p.x+dx,z:p.z+dz,y:soil.y});
  }
  const c=Math.cos(p.rotation??0),s=Math.sin(p.rotation??0),corners=[];
  for(const x of [decoded.bounds.min[0],decoded.bounds.max[0]])for(const z of [decoded.bounds.min[2],decoded.bounds.max[2]])corners.push([p.x+(c*x+s*z)*p.scale,p.z+(-s*x+c*z)*p.scale]);
  return {id:p.id,anchor:{x:p.x,y:ground.y-.06,z:p.z},scale:p.scale,rotation:p.rotation??0,sourceBaseY:decoded.trunkMinY,
    heightMeters:(decoded.bounds.max[1]-decoded.trunkMinY)*p.scale,
    canopy:{minX:Math.min(...corners.map(p=>p[0])),maxX:Math.max(...corners.map(p=>p[0])),minZ:Math.min(...corners.map(p=>p[1])),maxZ:Math.max(...corners.map(p=>p[1]))},
    grounding:'ACTUAL_RENDERED_TERRAIN_FIVE_POINT_WITNESS',groundWitnesses:witnesses};
}

/** Terrain interpolation uses existing hydrated triangles, in region coordinates. */
export function createCollectionGroundSampler(raw,geology){
  const triangles=[],p=raw.buffers.positions,idx=raw.buffers.indices;
  for(const span of raw.primitiveSpans.filter(s=>s.role==='TERRAIN'))for(let j=span.indexStart;j<span.indexStart+span.indexCount;j+=3){
    const v=[0,1,2].map(k=>{const i=idx[j+k]*3,q=inverseHEarthGroundCoverPoint(p[i],p[i+1],p[i+2]);return [q.x,q.elevation,q.z];});
    if(Math.max(...v.map(q=>q[0]))< -180||Math.min(...v.map(q=>q[0]))> -100||Math.max(...v.map(q=>q[2]))< -250||Math.min(...v.map(q=>q[2]))> -180)continue;
    const [a,b,c]=v,d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2]);if(Math.abs(d)>1e-12)triangles.push({v,d});
  }
  return (x,z)=>{
    const local=geology.sampleOutdoorAt(x,z);if(Number.isFinite(local?.y))return local;
    for(const {v:[a,b,c],d} of triangles){const u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d,v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d,w=1-u-v;if(Math.min(u,v,w)>=-1e-7)return {y:u*a[1]+v*b[1]+w*c[1]};}
    return null;
  };
}

// Completion requests one presentation; that frame selects the next eligible
// asset using the latest camera. No polling, concurrent loads, or idle loop.
export function createCollectionLoadQueue(entries,{blocked=()=>false,onSettled=()=>{}}={}){
  let busy=false,dead=false,settledCount=0;const attempted=new Set(),failures=new Map();
  const notify=()=>{if(!dead)onSettled();};
  return {
    get loading(){return busy;},
    request(camera){
      if(dead||busy||blocked()||!Number.isFinite(camera?.x)||!Number.isFinite(camera?.z))return false;
      const next=entries.filter(e=>!attempted.has(e)&&e.overlay.getReceipt().state==='IDLE'&&Math.hypot(camera.x-e.p.x,camera.z-e.p.z)<180)
        .sort((a,b)=>Math.hypot(camera.x-a.p.x,camera.z-a.p.z)-Math.hypot(camera.x-b.p.x,camera.z-b.p.z))[0];
      if(!next)return false;attempted.add(next);busy=true;
      const settle=()=>{busy=false;settledCount++;notify();};
      Promise.resolve().then(()=>dead?false:next.overlay.start()).then(settle,error=>{failures.set(next.p.id,String(error?.message??error));settle();});
      return true;
    },
    getReceipt(){return {attemptedCount:attempted.size,settledCount,loading:busy,disposed:dead,failures:Object.fromEntries(failures),completionDrivenPresentation:true};},
    dispose(){dead=true;}
  };
}

export function createTreeCollection(gl,{model,raw,projectWorld,sunDirection,originalJacaranda,onAssetSettled=()=>{}}){
  const sampleGround=createCollectionGroundSampler(raw,model),entries=[];
  for(const p of TREE_PLACEMENTS){
    const asset=TREE_ASSETS.find(a=>a.id===p.assetId);
    const planner=decoded=>planTreePlacement(decoded,p,sampleGround,model.sampleWaterAt);
    const overlay=p.assetId==='jacaranda'&&originalJacaranda?.createInstance?originalJacaranda.createInstance(p.id,planner):createApprovedJacarandaOverlay(gl,{model,projectWorld,sunDirection,companions:[],approvedAsset:asset,
      assetURL:new URL(asset.url,import.meta.url).href,target:p,focusId:p.id,
      planPlacement:planner});
    entries.push({p,overlay});
  }
  const queue=createCollectionLoadQueue(entries,{blocked:()=>originalJacaranda?.getReceipt().state==='LOADING',onSettled:onAssetSettled});
  const groupReady=group=>entries.filter(e=>e.p.group===group&&e.p.replaces).every(e=>e.overlay.ready);
  return {
    get loading(){return queue.loading;},
    requestIfNear:camera=>queue.request(camera),
    isReplaced(id){const e=entries.find(e=>e.p.replaces===id);return !!e;},
    woodlandReady(){return groupReady('woodland');},
    draw(packet){for(const e of entries)if(e.overlay.ready)e.overlay.draw(packet);},
    shadowKey(){return entries.map(e=>e.overlay.ready?'1':'0').join('');},
    drawShadows(packet,matrix,group){for(const e of entries)if(e.p.group===group&&e.overlay.ready)e.overlay.drawShadow(packet,matrix);},
    getReceipt(){return {queue:queue.getReceipt(),schema:'H_EARTH_APPROVED_TREE_COLLECTION_RUNTIME_v1',replacementCount:7,additionalShrubCount:1,woodlandReady:groupReady('woodland'),
      entries:entries.map(e=>({...e.p,...e.overlay.getReceipt(),legacySuppressed:!!e.p.replaces,replacementActive:!!e.p.replaces&&e.overlay.ready})),
      preservedOriginalJacaranda:true,parkedAssetsIncluded:false,sequentialLoading:true,legacyTreesVisible:false,prefetchDistance:180};},
    dispose(){queue.dispose();for(const e of entries)e.overlay.dispose();}
  };
}
