import assert from 'node:assert/strict';

// Geometry-only proof for a 2:1 fine-to-coarse transition strip.
// Fine boundary samples: x = 0,4,8. Coarse boundary samples: x = 0,8.
// The midpoint is consumed by a three-triangle fan, preserving the two
// coarse parent vertices exactly while closing the strip without T-junctions.
export function buildTwoToOneTransitionCell({x0=0,zFine=0,zCoarse=8,sample}={}){
  if(typeof sample!=='function') throw new TypeError('SAMPLE_REQUIRED');
  const coords=[[x0,zFine],[x0+4,zFine],[x0+8,zFine],[x0,zCoarse],[x0+8,zCoarse]];
  const vertices=coords.map(([x,z])=>({x,y:sample(x,z),z}));
  // F0,F1,F2 along fine edge; C0,C2 along coarse edge.
  const indices=[0,3,1, 1,3,4, 1,4,2];
  return {vertices,indices};
}
const edgeKey=(a,b)=>a<b?`${a}:${b}`:`${b}:${a}`;
export function proveTwoToOneTransition(mesh){
  const edgeCounts=new Map(),signedAreas=[];
  for(let i=0;i<mesh.indices.length;i+=3){
    const ids=mesh.indices.slice(i,i+3),p=ids.map(j=>mesh.vertices[j]);
    const signed=(p[1].x-p[0].x)*(p[2].z-p[0].z)-(p[1].z-p[0].z)*(p[2].x-p[0].x);
    signedAreas.push(signed);
    for(const [a,b] of [[ids[0],ids[1]],[ids[1],ids[2]],[ids[2],ids[0]]]){const k=edgeKey(a,b);edgeCounts.set(k,(edgeCounts.get(k)||0)+1);}
  }
  const boundary=[...edgeCounts.entries()].filter(([,n])=>n===1);
  const interior=[...edgeCounts.entries()].filter(([,n])=>n===2);
  const invalid=[...edgeCounts.entries()].filter(([,n])=>n<1||n>2);
  return {triangleCount:mesh.indices.length/3,boundaryEdgeCount:boundary.length,interiorEdgeCount:interior.length,invalidEdgeCount:invalid.length,consistentWinding:signedAreas.every(a=>a>0)||signedAreas.every(a=>a<0),nondegenerate:signedAreas.every(a=>Math.abs(a)>1e-9),edgeCounts:Object.fromEntries(edgeCounts)};
}
const sample=(x,z)=>0.01*x+0.02*z;
const m=buildTwoToOneTransitionCell({sample});
const proof=proveTwoToOneTransition(m);
assert.equal(proof.triangleCount,3);
assert.equal(proof.invalidEdgeCount,0);
assert.equal(proof.consistentWinding,true);
assert.equal(proof.nondegenerate,true);
assert.equal(m.vertices[0].y,sample(0,0));
assert.equal(m.vertices[2].y,sample(8,0));
assert.equal(m.vertices[3].y,sample(0,8));
assert.equal(m.vertices[4].y,sample(8,8));
console.log(JSON.stringify({receiptType:'H_EARTH_ADAPTIVE_2_TO_1_TRANSITION_TOPOLOGY_PROOF_v1',eligible:true,law:'FINE_4U_TO_COARSE_8U_THREE_TRIANGLE_FAN',mesh:m,proof,productMutation:false},null,2));
