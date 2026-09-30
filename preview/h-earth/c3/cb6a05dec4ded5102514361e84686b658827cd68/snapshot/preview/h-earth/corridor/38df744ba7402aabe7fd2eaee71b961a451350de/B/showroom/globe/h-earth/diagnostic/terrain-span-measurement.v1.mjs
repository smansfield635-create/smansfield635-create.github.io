import { getHEarthOW01CanonicalLiveRenderPackageOccurrence } from '../render/live-render-package.run8e-r2.canonical.js';

const pkg=getHEarthOW01CanonicalLiveRenderPackageOccurrence();
if(pkg?.eligible!==true) throw new Error('PACKAGE_NOT_ELIGIBLE');
const spans=(pkg.primitiveSpans??[]).filter(s=>String(s.role??'').toUpperCase()==='TERRAIN'||String(s.primitiveId??'').includes('TERRAIN'));
if(spans.length!==1) throw new Error('TERRAIN_SPAN_NOT_UNIQUE:'+spans.length);
const span=spans[0], pos=pkg.buffers.positions, idx=pkg.buffers.indices, normals=pkg.buffers.normals;
const edges=[],areas=[],elev=[],normalDelta=[];
const P=i=>[pos[i*3],pos[i*3+1],pos[i*3+2]], N=i=>[normals[i*3],normals[i*3+1],normals[i*3+2]];
const len=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const start=span.indexStart,end=start+span.indexCount;
for(let i=span.vertexStart;i<span.vertexStart+span.vertexCount;i++)elev.push(pos[i*3+1]);
for(let k=start;k<end;k+=3){const ia=idx[k],ib=idx[k+1],ic=idx[k+2],a=P(ia),b=P(ib),c=P(ic);for(const [u,v] of [[a,b],[b,c],[c,a]])edges.push(len(u,v));const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ac=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];const cr=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];areas.push(.5*Math.hypot(...cr));for(const [u,v] of [[ia,ib],[ib,ic],[ic,ia]])normalDelta.push(Math.acos(Math.max(-1,Math.min(1,dot(N(u),N(v)))))*180/Math.PI);}
const q=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor((s.length-1)*p))]};
const verts=[];for(let i=span.vertexStart;i<span.vertexStart+span.vertexCount;i++)verts.push(P(i));
const axis=n=>verts.map(v=>v[n]);
const receipt={schema:'H_EARTH_TERRAIN_SPAN_MEASUREMENT_v1',packageIdentity:pkg.packageIdentity,contentDigest:pkg.contentDigest,primitiveId:span.primitiveId,vertexCount:span.vertexCount,triangleCount:span.indexCount/3,indexCount:span.indexCount,bounds:{x:[Math.min(...axis(0)),Math.max(...axis(0))],y:[Math.min(...axis(1)),Math.max(...axis(1))],z:[Math.min(...axis(2)),Math.max(...axis(2))]},edgeLength:{median:q(edges,.5),p95:q(edges,.95),max:Math.max(...edges)},triangleArea:{median:q(areas,.5),p95:q(areas,.95),max:Math.max(...areas)},elevation:{min:Math.min(...elev),median:q(elev,.5),p95:q(elev,.95),max:Math.max(...elev)},adjacentNormalAngleDegrees:{median:q(normalDelta,.5),p95:q(normalDelta,.95),max:Math.max(...normalDelta)},sourcePackageMutated:false};
console.log(JSON.stringify(receipt,null,2));
