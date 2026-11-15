/** Image-conditioned geometry seed. Geometric silhouette inflation ONLY, not a trained photo-to-3D model.
 * The hidden depth is an explicit heuristic prior and is not recovered from the input image.
 */
import {meshField} from './dgb.native-volume.v1.mjs';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function silhouetteField({width,height,mask}, {maxDepth=.6,minimumDepth=.045}={}){
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<8||height<8||width>64||height>64||!Array.isArray(mask)&&!(mask instanceof Uint8Array)||mask.length!==width*height||Array.from(mask).some(x=>x!==0&&x!==1))throw new TypeError('SILHOUETTE_INVALID');
  if(!Number.isFinite(maxDepth)||maxDepth<=0||!Number.isFinite(minimumDepth)||minimumDepth<=0||minimumDepth>maxDepth)throw new TypeError('DEPTH_PRIOR_INVALID');
  const boundary=[];
  const pixel=(x,y)=>x<0||x>=width||y<0||y>=height?0:mask[x+y*width];
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)if([[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy])=>pixel(x,y)!==pixel(x+dx,y+dy)))boundary.push([x,y]);
  if(!boundary.length)throw new TypeError('MASK_NO_BOUNDARY');
  // Exact per-pixel nearest-boundary squared distances; constrained to <= 64² and cached.
  const signed=new Float32Array(width*height);const scale=2/Math.max(width,height);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
    let best=Infinity;for(const [bx,by] of boundary){const d=(x-bx)**2+(y-by)**2;if(d<best)best=d;}
    signed[x+y*width]=(mask[x+y*width]?-1:1)*(Math.sqrt(best)+.5)*scale;
  }
  function sampleSigned(x,y){const u=clamp((x+1)*.5*(width-1),0,width-1),v=clamp((1-y)*.5*(height-1),0,height-1),i=Math.floor(u),j=Math.floor(v),a=u-i,b=v-j;
    const f=(x,y)=>signed[clamp(y,0,height-1)*width+clamp(x,0,width-1)];
    return (f(i,j)*(1-a)+f(i+1,j)*a)*(1-b)+(f(i,j+1)*(1-a)+f(i+1,j+1)*a)*b;
  }
  return p=>{const [x,y,z]=p;const outside=Math.max(Math.abs(x)-1,Math.abs(y)-1),sd=sampleSigned(x,y),depth=Math.min(maxDepth,minimumDepth+Math.sqrt(Math.max(0,-sd))*maxDepth);return Math.max(sd,outside,Math.abs(z)-depth);};
}
export function seedMeshFromSilhouette(image,{resolution=28,maxDepth=.6}={}){
  const f=silhouetteField(image,{maxDepth});return meshField(f,{resolution,min:[-1.12,-1.12,-.9],max:[1.12,1.12,.9]});
}
