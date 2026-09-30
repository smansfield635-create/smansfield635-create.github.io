import {createHash} from 'node:crypto';

const hash=()=>createHash('sha256');
const digest=value=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const indexOf=(r,c,cols)=>r*cols+c;
const percentile=(values,p)=>{if(!values.length)return 0;const a=[...values].sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.floor((a.length-1)*p))]};
const codedError=(code,detail=null)=>{const e=new Error(detail?`${code}:${detail}`:code);e.code=code;e.detail=detail;return e};

class UnionFind{
  constructor(n){this.p=Int32Array.from({length:n},(_,i)=>i);this.s=new Uint32Array(n);this.s.fill(1)}
  find(x){let p=x;while(this.p[p]!==p)p=this.p[p];while(this.p[x]!==x){const q=this.p[x];this.p[x]=p;x=q}return p}
  union(a,b){a=this.find(a);b=this.find(b);if(a===b)return;if(this.s[a]<this.s[b])[a,b]=[b,a];this.p[b]=a;this.s[a]+=this.s[b]}
}

function classify({elevation,slopeDegrees,tpiSmall,tpiMedium,planCurvature}){
  if(elevation<=0)return 'WATER';
  if(slopeDegrees>=38)return 'CLIFF';
  if(tpiMedium>4&&tpiSmall>1)return 'SUMMIT';
  if(tpiMedium>1.5&&planCurvature<0)return 'RIDGE';
  if(tpiSmall>0.5)return 'SHOULDER';
  if(tpiMedium<-4&&tpiSmall<-1)return 'VALLEY';
  if(tpiMedium<-1.5&&planCurvature>0)return 'HOLLOW';
  if(tpiSmall<-0.5)return 'FOOTSLOPE';
  if(slopeDegrees<3)return 'FLAT';
  return 'SLOPE';
}

function compatible(a,b){
  if(a.waterMembership!==b.waterMembership)return false;
  if(a.protectedOverlayIds.join('|')!==b.protectedOverlayIds.join('|'))return false;
  if(Math.abs(a.aspect-b.aspect)>30&&Math.abs(Math.abs(a.aspect-b.aspect)-360)>30)return false;
  if(Math.abs(a.slopeDegrees-b.slopeDegrees)>6)return false;
  const groups=[new Set(['SUMMIT','RIDGE','SHOULDER']),new Set(['SLOPE','FOOTSLOPE','FLAT']),new Set(['VALLEY','HOLLOW','FOOTSLOPE']),new Set(['WATER'])];
  return groups.some(g=>g.has(a.landformClass)&&g.has(b.landformClass));
}

export function validateProductionPartitionReceipt(receipt,{allowSynthetic=false}={}){
  if(!receipt||typeof receipt!=='object')throw codedError('MICROGRAPH_COVERAGE_GAP','PARTITION_RECEIPT_MISSING');
  if(receipt.synthetic===true&&!allowSynthetic)throw codedError('SYNTHETIC_DOMAIN_PRODUCTION_USE');
  if(receipt.rearMountainNodeCount<=0)throw codedError('REAR_MOUNTAIN_BAND_MISSING');
  if(receipt.rows!==256||receipt.columns!==256||receipt.nodeCount!==65536)throw codedError('MICROGRAPH_COVERAGE_GAP');
  if(receipt.fourNeighborEdgeCount!==130560||receipt.eightNeighborEdgeCount!==260610)throw codedError('REAL_ADJACENCY_EDGE_MISSING');
  return Object.freeze({result:'PASS',nodeCount:receipt.nodeCount,fourNeighborEdgeCount:receipt.fourNeighborEdgeCount,eightNeighborEdgeCount:receipt.eightNeighborEdgeCount,rearMountainNodeCount:receipt.rearMountainNodeCount});
}

export function buildRealTerrainPartition({sampleElevation,requirements,mode='CURRENT_MAIN_BASELINE',rows=null,columns=null,synthetic=false}){
  const d=requirements.terrainDomain;
  const R=rows??d.rows,C=columns??d.columns;
  if(!synthetic&&(R!==256||C!==256))throw codedError('SYNTHETIC_DOMAIN_PRODUCTION_USE');
  const xStep=(d.xMaximum-d.xMinimum)/(C-1),zStep=(d.zMaximum-d.zMinimum)/(R-1),n=R*C;
  const elev=new Float64Array(n);
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){
    const x=d.xMinimum+c*xStep,z=d.zMinimum+r*zStep,y=sampleElevation(x,z);
    if(!Number.isFinite(y))throw codedError('UNRESOLVED_TERRAIN_SAMPLE',`${r}:${c}`);
    elev[indexOf(r,c,C)]=y;
  }
  const at=(r,c)=>elev[indexOf(clamp(r,0,R-1),clamp(c,0,C-1),C)];
  const nodes=new Array(n),nodeHash=hash();
  let rearMountainNodeCount=0;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){
    const id=indexOf(r,c,C),x=d.xMinimum+c*xStep,z=d.zMinimum+r*zStep,y=elev[id];
    const gx=(at(r,c+1)-at(r,c-1))/(2*xStep),gz=(at(r+1,c)-at(r-1,c))/(2*zStep);
    const slope=Math.atan(Math.hypot(gx,gz))*180/Math.PI,normLen=Math.hypot(-gx,1,-gz);
    const lapX=(at(r,c+1)-2*y+at(r,c-1))/(xStep*xStep),lapZ=(at(r+1,c)-2*y+at(r-1,c))/(zStep*zStep);
    const profile=lapX+lapZ,plan=lapX-lapZ;
    const avg=radius=>{let sum=0,count=0;for(const[dr,dc]of[[-radius,0],[radius,0],[0,-radius],[0,radius],[-radius,-radius],[-radius,radius],[radius,-radius],[radius,radius]]){sum+=at(r+dr,c+dc);count++}return sum/count};
    const t1=y-avg(1),t4=y-avg(Math.min(4,R-1,C-1)),t16=y-avg(Math.min(16,R-1,C-1));
    const aspect=(Math.atan2(gz,-gx)*180/Math.PI+360)%360;
    const b=requirements.r06c10PreservationBounds;
    const inHalo=x>=b.verificationHalo.xMinimum&&x<=b.verificationHalo.xMaximum&&z>=b.verificationHalo.zMinimum&&z<=b.verificationHalo.zMaximum;
    const formationIds=[];
    if(x>=-224&&x<=32&&z>=-292&&z<=-236){formationIds.push('H_EARTH_REAR_MOUNTAIN_CORE');rearMountainNodeCount++}
    if(x>=64&&x<=176&&z>=-240&&z<=-148)formationIds.push('H_EARTH_INTER_HILL_ESTATE_RELATION');
    const water=y<=0;
    const node={nodeId:id,row:r,column:c,worldX:x,worldZ:z,elevation:y,gradientX:gx,gradientZ:gz,slopeDegrees:slope,normal:{x:-gx/normLen,y:1/normLen,z:-gz/normLen},profileCurvature:profile,planCurvature:plan,tpiSmall:t1,tpiMedium:t4,tpiLarge:t16,aspect,ridgeValleyDistance:Math.abs(t4),landformClass:null,formationIds,semanticAddressProjection:`H_EARTH_GROUND_CELL_001:R${String(Math.floor(r/16)+1).padStart(2,'0')}:C${String(Math.floor(c/16)+1).padStart(2,'0')}`,waterMembership:water,traversableClass:water?'WATER':slope<=25?'TRAVERSABLE':slope<=38?'SCENIC_ONLY':'BARRIER',protectedOverlayIds:inHalo?['R06_C10_ZERO_MUTATION_PRESERVATION']:[]};
    node.landformClass=classify(node);nodes[id]=node;
    nodeHash.update(`${id}|${x.toFixed(9)}|${z.toFixed(9)}|${y.toFixed(9)}|${slope.toFixed(6)}|${node.landformClass}\n`);
  }
  const fourHash=hash(),eightHash=hash();let four=0,eight=0;const uf=new UnionFind(n);
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){
    const a=indexOf(r,c,C);
    for(const[dr,dc]of[[0,1],[1,0]]){
      const rr=r+dr,cc=c+dc;
      if(rr<R&&cc<C){const b=indexOf(rr,cc,C);four++;fourHash.update(`${a}:${b}\n`);if(compatible(nodes[a],nodes[b]))uf.union(a,b)}
    }
    for(const[dr,dc]of[[0,1],[1,-1],[1,0],[1,1]]){
      const rr=r+dr,cc=c+dc;
      if(rr<R&&cc>=0&&cc<C){const b=indexOf(rr,cc,C);eight++;eightHash.update(`${a}:${b}\n`)}
    }
  }
  const groups=new Map();
  for(let i=0;i<n;i++){const p=uf.find(i);if(!groups.has(p))groups.set(p,[]);groups.get(p).push(i)}
  const macrozones=[...groups.values()].map((ids,i)=>({macrozoneId:i,nodeIds:ids,nodeCount:ids.length,dominantLandform:nodes[ids[0]].landformClass}));
  const receipt={mode,synthetic,rows:R,columns:C,nodeCount:n,rearMountainNodeCount,xSampleInterval:xStep,zSampleInterval:zStep,nodes,macrozones,fourNeighborEdgeCount:four,eightNeighborEdgeCount:eight,partitionDigest:nodeHash.digest('hex'),adjacencyDigest:digest({four:fourHash.digest('hex'),eight:eightHash.digest('hex')}),landformCounts:Object.fromEntries([...new Set(nodes.map(x=>x.landformClass))].sort().map(k=>[k,nodes.filter(x=>x.landformClass===k).length])),slopeStatistics:{p50:percentile(nodes.map(x=>x.slopeDegrees),.5),p95:percentile(nodes.map(x=>x.slopeDegrees),.95),max:Math.max(...nodes.map(x=>x.slopeDegrees))}};
  if(!synthetic)validateProductionPartitionReceipt(receipt);
  return receipt;
}
