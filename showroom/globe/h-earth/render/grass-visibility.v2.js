/** Conservative submission only. Population, root bytes and GPU residency never change.
 * 2.2m exceeds .003 ground offset + 1.65m blade + .495m bend + .016m width.
 * Bounds include both lobes at every detail weight and arbitrary radial up vectors. */
export const GRASS_BLADE_BOUND_METERS=2.2;
export const GRASS_FRUSTUM_MARGIN_METERS=.01;
export function boundGrassTiles(tiles){
 return Object.freeze(tiles.map(tile=>{
  if(!(tile.packed instanceof Float32Array)||tile.packed.length!==tile.count*4||!Number.isInteger(tile.first)||tile.first<0||tile.count<1)throw Error('GRASS_VISIBILITY_TILE_INVALID');
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(let i=0;i<tile.packed.length;i+=4)for(let axis=0;axis<3;axis++){
   const v=tile.packed[i+axis];if(!Number.isFinite(v))throw Error('GRASS_VISIBILITY_ROOT_NONFINITE');
   min[axis]=Math.min(min[axis],v);max[axis]=Math.max(max[axis],v);
  }
  return Object.freeze({tile,min:Object.freeze(min.map(v=>v-GRASS_BLADE_BOUND_METERS)),max:Object.freeze(max.map(v=>v+GRASS_BLADE_BOUND_METERS))});
 }));
}
export function grassFrustumPlanes(viewProjection){
 if(viewProjection?.length!==16)throw Error('GRASS_VISIBILITY_MATRIX_INVALID');
 const m=new Float32Array(viewProjection);if(!m.every(Number.isFinite))throw Error('GRASS_VISIBILITY_MATRIX_INVALID');
 const planes=[];
 for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){
  const p=[m[3]+sign*m[axis],m[7]+sign*m[4+axis],m[11]+sign*m[8+axis],m[15]+sign*m[12+axis]];
  const length=Math.hypot(p[0],p[1],p[2]);
  // A degenerate plane cannot safely reject geometry.
  if(length>0)planes.push(p.map(v=>v/length));
 }
 return {matrix:m,planes};
}
export function selectVisibleGrassTiles(bounds,planes){
 return bounds.filter(b=>!planes.some(p=>p[0]*(p[0]>=0?b.max[0]:b.min[0])+p[1]*(p[1]>=0?b.max[1]:b.min[1])+p[2]*(p[2]>=0?b.max[2]:b.min[2])+p[3]<-GRASS_FRUSTUM_MARGIN_METERS)).map(b=>b.tile);
}
export function mergeGrassRanges(tiles){
 const ranges=[];let previousEnd=-1;
 for(const tile of tiles){
  if(tile.first<previousEnd)throw Error('GRASS_VISIBILITY_RANGE_ORDER');
  const last=ranges.at(-1);if(last&&last.first+last.count===tile.first)last.count+=tile.count;else ranges.push({first:tile.first,count:tile.count});
  previousEnd=tile.first+tile.count;
 }
 return ranges;
}
