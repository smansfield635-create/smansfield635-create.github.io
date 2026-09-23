import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root=process.argv[2]||'.',imp=p=>import(pathToFileURL(root+'/'+p).href+'?q='+Date.now());
const M=await imp('showroom/globe/h-earth/render/geometry-successor-terrain.run8b.js');
const T=M.constructHEarthRun8BSuccessorTerrainAndMountain();assert.equal(T.ok,true);
const g=T.primitive.geometry,verts=g.vertices,idx=g.indices;
const edge=new Map(),coord=new Map(verts.map((v,i)=>[`${v.x}:${v.z}`,i]));
const ek=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;let windingSign=0,degenerate=0;
for(let i=0;i<idx.length;i+=3){const ids=idx.slice(i,i+3),p=ids.map(j=>verts[j]);const s=(p[1].x-p[0].x)*(p[2].z-p[0].z)-(p[1].z-p[0].z)*(p[2].x-p[0].x);if(Math.abs(s)<1e-9)degenerate++;else{const sg=Math.sign(s);if(!windingSign)windingSign=sg;else if(sg!==windingSign)windingSign=99;}for(const [a,b] of [[ids[0],ids[1]],[ids[1],ids[2]],[ids[2],ids[0]]])edge.set(ek(a,b),(edge.get(ek(a,b))||0)+1);}
const invalidEdges=[...edge.entries()].filter(([,n])=>n>2);
const interiorBad=[...edge.entries()].filter(([k,n])=>{if(n!==1)return false;const [a,b]=k.split(':').map(Number),u=verts[a],v=verts[b];const domainBoundary=[u.x,v.x].every(x=>x===-384||x===384)||[u.z,v.z].every(z=>z===-736||z===128);return !domainBoundary;});
let tJunctions=0;for(const [k] of edge){const [a,b]=k.split(':').map(Number),u=verts[a],v=verts[b];for(let j=0;j<verts.length;j++){if(j===a||j===b)continue;const p=verts[j];const cross=(p.x-u.x)*(v.z-u.z)-(p.z-u.z)*(v.x-u.x);if(Math.abs(cross)>1e-9)continue;const dot=(p.x-u.x)*(v.x-u.x)+(p.z-u.z)*(v.z-u.z),len=(v.x-u.x)**2+(v.z-u.z)**2;if(dot>1e-9&&dot<len-1e-9){tJunctions++;break;}}}
const near=verts.filter(v=>Math.abs(v.x)<=96&&Math.abs(v.z)<=96),outer=verts.filter(v=>Math.abs(v.x)>96||Math.abs(v.z)>96);
const spacing=(vs,axis)=>{const vals=[...new Set(vs.map(v=>v[axis]))].sort((a,b)=>a-b);return [...new Set(vals.slice(1).map((v,i)=>v-vals[i]))].sort((a,b)=>a-b)};
const receipt={receiptType:'H_EARTH_ADAPTIVE_C_TOPOLOGY_QUALIFICATION_v1',eligible:degenerate===0&&windingSign!==99&&invalidEdges.length===0&&interiorBad.length===0&&tJunctions===0,vertexCount:verts.length,indexCount:idx.length,triangleCount:idx.length/3,degenerateTriangles:degenerate,consistentWinding:windingSign!==99,edgesOverTwo:invalidEdges.length,unexpectedBoundaryEdges:interiorBad.length,tJunctions,nearVertexCount:near.length,outerVertexCount:outer.length,nearXSpacing:spacing(near,'x'),nearZSpacing:spacing(near,'z'),outerXSpacing:spacing(outer,'x'),outerZSpacing:spacing(outer,'z'),transitionLaw:T.primitive.metadata?.providerContractId,issues:[]};
if(!receipt.eligible)receipt.issues.push('ADAPTIVE_C_TOPOLOGY_GATE_FAILED');console.log(JSON.stringify(receipt,null,2));if(!receipt.eligible)process.exitCode=1;
