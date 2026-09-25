/** H_EARTH_PHASE3_NATIVE_RESIDUAL_FIELD_PROOF_v1
 * Pure read-only numerical proof helper. No renderer/runtime authority.
 */
import { sampleHEarthRun8BSuccessorTerrainField,deriveHEarthGen311RegionalArticulation } from './h-earth.successor-terrain-field.run8b.js';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const mask=(x,z)=>clamp(smoothstep(-92,-176,z)*(1-smoothstep(-470,-620,z))*(1-smoothstep(225,365,Math.abs(x))),0,1);
const visible=(x,z)=>{const t=sampleHEarthRun8BSuccessorTerrainField(x,z),a=deriveHEarthGen311RegionalArticulation(x,z);if(t?.valid!==true||a?.valid!==true)return NaN;const d=mask(x,z)*(a.ridgeSignal*24+a.watershedSignal*9+a.foothillSignal*13-a.valleySignal*14-a.passSignal*7+Math.max(0,t.elevation)*.22);return t.elevation+d};
const witnesses=Object.freeze({coast:[0,-100],slope_hill:[72,-172],ridge:[86,-235],valley:[2,-198],foothill:[-52,-180],mountain:[148,-224]});
const ceiling={coast:.75,slope_hill:3.25,ridge:5.5,valley:3.5,foothill:1.75,mountain:5.5};
const median=a=>{const s=[...a].sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor((s.length-1)*p))]};
const rms=a=>Math.sqrt(a.reduce((q,v)=>q+v*v,0)/Math.max(1,a.length));
const predict=(x,z)=>{const x0=Math.floor(x/8)*8,z0=Math.floor(z/8)*8,tx=(x-x0)/8,tz=(z-z0)/8,a=visible(x0,z0),b=visible(x0+8,z0),c=visible(x0,z0+8),d=visible(x0+8,z0+8);return (a*(1-tx)+b*tx)*(1-tz)+(c*(1-tx)+d*tx)*tz};
function digest(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
function proofRegion(name,[cx,cz]){
 const xs=[],zs=[];for(let x=Math.floor((cx-32)/8)*8;x<=Math.ceil((cx+32)/8)*8;x+=4)xs.push(x);for(let z=Math.floor((cz-32)/8)*8;z<=Math.ceil((cz+32)/8)*8;z+=4)zs.push(z);
 const rows=zs.length,cols=xs.length,raw=Array.from({length:rows},()=>Array(cols).fill(0)),parent=Array.from({length:rows},()=>Array(cols).fill(false));
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=xs[c],z=zs[r];parent[r][c]=x%8===0&&z%8===0;raw[r][c]=parent[r][c]?0:visible(x,z)-predict(x,z)}
 const admitted=raw.map(row=>[...row]);let clipped=0;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(parent[r][c]||r===0||c===0||r===rows-1||c===cols-1){admitted[r][c]=0;continue}const hood=[];for(let rr=Math.max(0,r-1);rr<=Math.min(rows-1,r+1);rr++)for(let cc=Math.max(0,c-1);cc<=Math.min(cols-1,c+1);cc++)if(!parent[rr][cc])hood.push(Math.abs(raw[rr][cc]));const robust=3*median(hood)+.35,bound=Math.min(ceiling[name],robust);const v=clamp(raw[r][c],-bound,bound);if(Math.abs(v-raw[r][c])>1e-12)clipped++;admitted[r][c]=v}
 const smooth=admitted.map(row=>[...row]);for(let r=1;r<rows-1;r++)for(let c=1;c<cols-1;c++){if(parent[r][c]){smooth[r][c]=0;continue}smooth[r][c]=(admitted[r][c-1]+2*admitted[r][c]+admitted[r][c+1]+admitted[r-1][c]+2*admitted[r][c]+admitted[r+1][c])/8;smooth[r][c]=clamp(smooth[r][c],-ceiling[name],ceiling[name])}
 for(let r=0;r<rows;r++){smooth[r][0]=smooth[r][cols-1]=0}for(let c=0;c<cols;c++){smooth[0][c]=smooth[rows-1][c]=0}for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(parent[r][c])smooth[r][c]=0;
 const rv=[],av=[],rd=[],ad=[];let parentMax=0,perimMax=0,maxA=0;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){if(!parent[r][c]){rv.push(raw[r][c]);av.push(smooth[r][c])}else parentMax=Math.max(parentMax,Math.abs(smooth[r][c]));if(r===0||c===0||r===rows-1||c===cols-1)perimMax=Math.max(perimMax,Math.abs(smooth[r][c]));maxA=Math.max(maxA,Math.abs(smooth[r][c]));if(c+1<cols){rd.push(Math.abs(raw[r][c+1]-raw[r][c]));ad.push(Math.abs(smooth[r][c+1]-smooth[r][c]))}if(r+1<rows){rd.push(Math.abs(raw[r+1][c]-raw[r][c]));ad.push(Math.abs(smooth[r+1][c]-smooth[r][c]))}}
 return {name,parentMaximumDelta:parentMax,perimeterMaximumResidual:perimMax,raw:{rms:rms(rv),p95:pct(rv.map(Math.abs),.95),max:Math.max(...rv.map(Math.abs))},admitted:{rms:rms(av),p95:pct(av.map(Math.abs),.95),max:maxA},firstDifferenceP95:{raw:pct(rd,.95),admitted:pct(ad,.95)},clippedSampleCount:clipped,ceiling:ceiling[name],pass:parentMax===0&&perimMax===0&&maxA<=ceiling[name]+1e-12};
}
export function runHEarthPhase3NativeResidualProof(){const regions=Object.entries(witnesses).map(([n,p])=>proofRegion(n,p));const signal=Object.fromEntries(regions.map(r=>[r.name,r]));const pass=regions.every(r=>r.pass)&&signal.ridge.admitted.rms>=.5&&signal.ridge.admitted.p95>=1&&signal.mountain.admitted.rms>=.5&&signal.mountain.admitted.p95>=1;const body={contractId:'H_EARTH_PHASE3_NATIVE_RESIDUAL_FIELD_PROOF_v1',pass,regions};return Object.freeze({...body,digest:'fnv1a32:'+digest(JSON.stringify(body))})}
export default runHEarthPhase3NativeResidualProof;
