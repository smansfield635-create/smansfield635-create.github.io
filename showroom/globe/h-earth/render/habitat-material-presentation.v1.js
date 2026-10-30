/** Presentation-only convolution of the finalized installed habitat. Never used for roots. */
export const HABITAT_MATERIAL_FILTER=Object.freeze({sigmaMeters:2,supportMeters:6});
function axisKernel(step){
 const radius=Math.floor(HABITAT_MATERIAL_FILTER.supportMeters/step),weights=[];
 let sum=0;
 for(let i=-radius;i<=radius;i++){const w=Math.exp(-.5*(i*step/2)**2);weights.push(w);sum+=w;}
 return {radius,weights:weights.map(w=>w/sum)};
}
export function buildHabitatMaterialPresentation(habitat){
 const {size,width,height,pixels}=habitat??{};
 const bounds=[habitat?.bounds,habitat?.ravine?.bounds,habitat?.coastal?.bounds];
 if(!Number.isInteger(size)||size<2||width!==3*size||height!==size||!(pixels instanceof Uint8Array)||pixels.length!==width*height)throw Error('HABITAT_PRESENTATION_LAYOUT');
 const output=new Uint8Array(pixels.length),temporary=new Float64Array(size*size),panels=[];
 for(let panel=0;panel<3;panel++){
  const b=bounds[panel];
  if(!Array.isArray(b)||b.length!==4||!b.every(Number.isFinite)||b[2]<=b[0]||b[3]<=b[1])throw Error('HABITAT_PRESENTATION_BOUNDS');
  const dx=(b[2]-b[0])/size,dz=(b[3]-b[1])/size,kx=axisKernel(dx),kz=axisKernel(dz);
  if(kx.radius>size*8||kz.radius>size*8)throw Error('HABITAT_PRESENTATION_KERNEL_BUDGET');
  const clamp=i=>Math.max(0,Math.min(size-1,i));
  // CLAMP_TO_EDGE independently within each panel; no atlas-column leakage.
  for(let z=0;z<size;z++)for(let x=0;x<size;x++){
   let value=0;
   for(let d=-kx.radius;d<=kx.radius;d++)value+=pixels[z*width+panel*size+clamp(x+d)]*kx.weights[d+kx.radius];
   temporary[z*size+x]=value;
  }
  let changedTexels=0;
  for(let z=0;z<size;z++)for(let x=0;x<size;x++){
   let value=0;
   for(let d=-kz.radius;d<=kz.radius;d++)value+=temporary[clamp(z+d)*size+x]*kz.weights[d+kz.radius];
   const index=z*width+panel*size+x;output[index]=Math.round(value);if(output[index]!==pixels[index])changedTexels++;
  }
  panels.push({bounds:[...b],stepMeters:[dx,dz],kernelRadiiTexels:[kx.radius,kz.radius],changedTexels});
 }
 return {pixels:output,width,height,receipt:{schema:'H_EARTH_HABITAT_MATERIAL_PRESENTATION_v1',...HABITAT_MATERIAL_FILTER,filter:'SEPARABLE_GAUSSIAN_PANEL_LOCAL_CLAMP_TO_EDGE_R8',panels,source:'FINAL_INSTALLED_HABITAT_AFTER_ENTRANCE_ADDITIONS',rootAdmissionChanged:false,nativeRoughnessChanged:false,uploadPolicy:'ONCE_BEFORE_READY',byteLength:output.byteLength}};
}
// Same accepted grove, oasis, estate and approach envelopes as broad groundcover.
export const HABITAT_MATERIAL_PROTECTION_GLSL=`
float habitatMaterialProtection(vec2 world){
 float grove=1.0-smoothstep(22.0,42.0,distance(world,vec2(-139.40268,-210.74617)));
 float oasisX=max(max(-18.0-world.x,0.0),world.x-34.0);
 float oasisZ=max(max(-204.0-world.y,0.0),world.y+131.0);
 float estateX=max(max(18.0-world.x,0.0),world.x-132.0);
 float estateZ=max(max(-210.0-world.y,0.0),world.y+125.0);
 float routeT=clamp((world.y-world.x+192.0)/96.0,0.0,1.0);
 float routeDistance=distance(world,vec2(48.0-48.0*routeT,-144.0+48.0*routeT));
 return smoothstep(0.0,12.0,length(vec2(oasisX,oasisZ)))*
  smoothstep(0.0,10.0,length(vec2(estateX,estateZ)))*
  smoothstep(4.0,9.0,routeDistance)*(1.0-grove);
}
`;
