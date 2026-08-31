export const WORLD_ID='AUDRALIA_CANONICAL_WORLD_REFERENCE';
export const WORLD_RADIUS=1;
export const CANONICAL_BOUNDS=Object.freeze({uMin:-1760,uMax:1536,vMin:-1952,vMax:320});
export const MAP_WINDOW=Object.freeze({latMin:-41,latMax:14,lonMin:104,lonMax:166});
export const GRATITUDE=Object.freeze({u:0,v:84.68668013135158});

// Read-only canonical coastline evidence, precomputed from the accepted shared-world boundary.
export const COAST=Object.freeze([
[-1710,-270],[-1540,-20],[-1280,150],[-1010,170],[-770,95],[-590,235],[-430,145],[-384,93.1368],[-320,91.68294],[-256,78.09284],[-192,71.18371],[-96,73.08951],[0,84.68668],[96,52.99068],[192,85.87229],[256,80.2522],[320,75.52839],[384,73.8205],[500,190],[690,105],[860,15],[1030,-105],[1180,-280],[1510,-390],[1490,-565],[1290,-680],[1430,-885],[1180,-965],[930,-1115],[1180,-1270],[990,-1460],[690,-1545],[470,-1830],[165,-1995],[-120,-1845],[-350,-1575],[-635,-1675],[-920,-1810],[-1190,-1595],[-1050,-1360],[-1405,-1235],[-1535,-965],[-1280,-825],[-1605,-705],[-1700,-505]
].map(p=>Object.freeze(p)));

export const SANDBARS=Object.freeze([
Object.freeze({id:'WEST_SANDBAR',u:-132,v:130,rx:48,rv:10,rotation:-.12}),
Object.freeze({id:'CENTRAL_SANDBAR',u:-12,v:138,rx:58,rv:12,rotation:.07}),
Object.freeze({id:'BAY_MOUTH_SANDBAR',u:126,v:123,rx:46,rv:9,rotation:-.16})
]);

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,t)=>a+(b-a)*t;
const smooth=x=>x*x*(3-2*x);

export function mapToLatLon(u,v){
  const x=(u-CANONICAL_BOUNDS.uMin)/(CANONICAL_BOUNDS.uMax-CANONICAL_BOUNDS.uMin);
  const y=(v-CANONICAL_BOUNDS.vMin)/(CANONICAL_BOUNDS.vMax-CANONICAL_BOUNDS.vMin);
  return Object.freeze({lat:mix(MAP_WINDOW.latMin,MAP_WINDOW.latMax,y),lon:mix(MAP_WINDOW.lonMin,MAP_WINDOW.lonMax,x)});
}
export function latLonToMap(lat,lon){
  const x=(lon-MAP_WINDOW.lonMin)/(MAP_WINDOW.lonMax-MAP_WINDOW.lonMin);
  const y=(lat-MAP_WINDOW.latMin)/(MAP_WINDOW.latMax-MAP_WINDOW.latMin);
  return Object.freeze({u:mix(CANONICAL_BOUNDS.uMin,CANONICAL_BOUNDS.uMax,x),v:mix(CANONICAL_BOUNDS.vMin,CANONICAL_BOUNDS.vMax,y)});
}
export function insideLoop(u,v){
  let inside=false;
  for(let i=0,j=COAST.length-1;i<COAST.length;j=i++){
    const a=COAST[i],b=COAST[j];
    const hit=((a[1]>v)!==(b[1]>v))&&(u<(b[0]-a[0])*(v-a[1])/((b[1]-a[1])||1e-9)+a[0]);
    if(hit) inside=!inside;
  }
  return inside;
}
function insideBar(u,v,bar){
  const c=Math.cos(bar.rotation),s=Math.sin(bar.rotation),du=u-bar.u,dv=v-bar.v;
  const x=du*c+dv*s,z=-du*s+dv*c;
  return (x*x)/(bar.rx*bar.rx)+(z*z)/(bar.rv*bar.rv)<=1;
}
export function isLand(u,v){return insideLoop(u,v)||SANDBARS.some(bar=>insideBar(u,v,bar));}
export function coastDistance(u,v){
  let best=Infinity;
  for(let i=0;i<COAST.length;i++){
    const a=COAST[i],b=COAST[(i+1)%COAST.length],dx=b[0]-a[0],dz=b[1]-a[1],d=dx*dx+dz*dz||1,t=clamp(((u-a[0])*dx+(v-a[1])*dz)/d,0,1),x=a[0]+dx*t,z=a[1]+dz*t;
    best=Math.min(best,Math.hypot(u-x,v-z));
  }
  return best;
}
function representationRelief(u,v){
  // Presentation-only band-limited relief; it does not mint inland place identity.
  const a=.5+.5*Math.sin(u*.0047+Math.cos(v*.0031)*1.2);
  const b=.5+.5*Math.cos(v*.0053-u*.0017);
  const c=.5+.5*Math.sin((u+v)*.0026+1.7);
  return (.42*a+.34*b+.24*c);
}
export function terrainHeight(u,v){
  if(!isLand(u,v)) return 0;
  const d=coastDistance(u,v);
  const inland=smooth(clamp(d/330,0,1));
  const bar=SANDBARS.some(x=>insideBar(u,v,x));
  if(bar) return .0016;
  return .0025+inland*(.010+.024*representationRelief(u,v));
}
export function scaleName(altitude){
  if(altitude>1.45)return'planetary';
  if(altitude>.62)return'continental';
  if(altitude>.2)return'regional';
  return'local';
}
