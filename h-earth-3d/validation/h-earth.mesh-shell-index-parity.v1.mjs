/** Independent parity verifier for the shell edge index.
 * Frozen scan-based oracle copied from candidate 3e343c8a8db53e358ab2cfb6c1f407cb53b4f626.
 * H_EARTH_SHELL_BASELINE optionally selects that full original module instead.
 * No timing threshold: performance measurements are evidence, parity is acceptance.
 */
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';
import {
 analyzeHEarthMeshShells, extractHEarthIndexedTopology,
 calculateHEarthMeshSignedVolume, H_EARTH_3D_GEOMETRY_EAST_ENUMS
} from '../../showroom/globe/h-earth/render/geometry-kernel.east.js';
import {
 createHEarthGeometryIssue, sortHEarthGeometryIssues, hasHEarthBlockingIssues,
 isHEarthFiniteNumber, isHEarthVector3, isHEarthGeometryToleranceContext,
 deriveHEarthGeometryToleranceContext
} from '../../showroom/globe/h-earth/render/geometry-kernel.north.js';
function deepFreeze(value) {
 if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
 for (const nested of Object.values(value)) deepFreeze(nested);
 return Object.freeze(value);
}
function isPlainObject(value) {
 if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
 const prototype = Object.getPrototypeOf(value);
 return prototype === Object.prototype || prototype === null;
}
function createEastIssue(code, severity, message, details=null, blocking=null, context={}) {
 return createHEarthGeometryIssue(code,severity,message,details,blocking,
  {...context,sourceModule:'geometry-kernel.east.js'});
}
function resolveToleranceContext(value) {
 return value === undefined ? deriveHEarthGeometryToleranceContext()
 : isHEarthGeometryToleranceContext(value) ? value : null;
}
function collectComponentEdges(
topology,
triangleSet
) {
return topology.edges.filter(
(edge) =>
edge.uses.some(
(use) =>
triangleSet.has(
use.triangleIndex
)
)
);
}

function collectComponentDirectedConflicts(
topology,
triangleSet
) {
return topology
.directedConflicts
.filter(
(conflict) =>
conflict
.triangleIndices
.some(
(triangleIndex) =>
triangleSet.has(
triangleIndex
)
)
);
}

function baselineAnalyze(
vertices,
triangleIndices,
topology,
toleranceContext
) {
const resolvedToleranceContext =
resolveToleranceContext(
toleranceContext
);

if (
!Array.isArray(vertices) ||
!vertices.every(
isHEarthVector3
) ||
!Array.isArray(
triangleIndices
) ||
!isPlainObject(topology) ||
!Array.isArray(
topology
.triangleConnectedComponents
) ||
!Array.isArray(
topology
.directedConflicts
) ||
!isHEarthGeometryToleranceContext(
resolvedToleranceContext
)
) {
return deepFreeze({
valid:
false,

shellOrientationRecords:  
    deepFreeze([]),  

  shellCount:  
    0,  

  outwardShellCount:  
    0,  

  inwardShellCount:  
    0,  

  degenerateShellCount:  
    0,  

  openShellCount:  
    0,  

  nonmanifoldShellCount:  
    0,  

  windingInconsistentShellCount:  
    0,  

  issues:  
    deepFreeze([  
      createEastIssue(  
        'SHELL_ANALYSIS_INPUT_INVALID',  
        'ERROR',  
        'Shell analysis requires valid indexed topology and tolerance context.'  
      )  
    ])  
});

}

const shellOrientationRecords = [];

const issues = [];

let outwardShellCount = 0;

let inwardShellCount = 0;

let degenerateShellCount = 0;

let openShellCount = 0;

let nonmanifoldShellCount = 0;

let windingInconsistentShellCount = 0;

for (
let componentIndex = 0;
componentIndex <
topology
.triangleConnectedComponents
.length;
componentIndex += 1
) {
const component =
topology
.triangleConnectedComponents[
componentIndex
];

const triangleSet =  
  new Set(  
    component  
  );  

const componentEdges =  
  collectComponentEdges(  
    topology,  
    triangleSet  
  );  

const componentDirectedConflicts =  
  collectComponentDirectedConflicts(  
    topology,  
    triangleSet  
  );  

const boundaryEdgeCount =  
  componentEdges.filter(  
    (edge) =>  
      edge.uses.filter(  
        (use) =>  
          triangleSet.has(  
            use.triangleIndex  
          )  
      ).length ===  
      1  
  ).length;  

const nonmanifoldEdgeCount =  
  componentEdges.filter(  
    (edge) =>  
      edge.uses.filter(  
        (use) =>  
          triangleSet.has(  
            use.triangleIndex  
          )  
      ).length >  
      2  
  ).length;  

const directedConflictCount =  
  componentDirectedConflicts.length;  

const componentIndices = [];  

for (  
  const triangleIndex of  
  component  
) {  
  const offset =  
    triangleIndex *  
    3;  

  componentIndices.push(  
    triangleIndices[  
      offset  
    ],  

    triangleIndices[  
      offset + 1  
    ],  

    triangleIndices[  
      offset + 2  
    ]  
  );  
}  

let orientation;  

let signedVolume = null;  

if (  
  nonmanifoldEdgeCount >  
  0  
) {  
  orientation =  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .shellOrientation  
      .NONMANIFOLD;  

  nonmanifoldShellCount +=  
    1;  
} else if (  
  boundaryEdgeCount >  
  0  
) {  
  orientation =  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .shellOrientation.OPEN;  

  openShellCount +=  
    1;  
} else if (  
  directedConflictCount >  
  0  
) {  
  orientation =  
    H_EARTH_3D_GEOMETRY_EAST_ENUMS  
      .shellOrientation  
      .WINDING_INCONSISTENT;  

  windingInconsistentShellCount +=  
    1;  
} else {  
  signedVolume =  
    calculateHEarthMeshSignedVolume(  
      vertices,  
      componentIndices  
    );  

  if (  
    !isHEarthFiniteNumber(  
      signedVolume  
    ) ||  
    Math.abs(  
      signedVolume  
    ) <=  
      resolvedToleranceContext  
        .volumeTolerance  
  ) {  
    orientation =  
      H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .shellOrientation  
        .DEGENERATE;  

    degenerateShellCount +=  
      1;  
  } else if (  
    signedVolume >  
    0  
  ) {  
    orientation =  
      H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .shellOrientation  
        .OUTWARD;  

    outwardShellCount +=  
      1;  
  } else {  
    orientation =  
      H_EARTH_3D_GEOMETRY_EAST_ENUMS  
        .shellOrientation  
        .INWARD;  

    inwardShellCount +=  
      1;  
  }  
}  

shellOrientationRecords.push(  
  deepFreeze({  
    shellIndex:  
      componentIndex,  

    triangleIndices:  
      deepFreeze(  
        component.slice()  
      ),  

    triangleCount:  
      component.length,  

    boundaryEdgeCount,  

    nonmanifoldEdgeCount,  

    directedConflictCount,  

    signedVolume,  

    orientation  
  })  
);

}

if (
inwardShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_INWARD_ORIENTED_SHELL_PRESENT',
'ERROR',
'One or more closed shells are inward-oriented.',
{
inwardShellCount
}
)
);
}

if (
degenerateShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_DEGENERATE_SHELL_PRESENT',
'ERROR',
'One or more closed shells have degenerate signed volume.',
{
degenerateShellCount
}
)
);
}

if (
nonmanifoldShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_NONMANIFOLD_SHELL_PRESENT',
'ERROR',
'One or more components contain nonmanifold edges.',
{
nonmanifoldShellCount
}
)
);
}

if (
windingInconsistentShellCount >
0
) {
issues.push(
createEastIssue(
'MESH_WINDING_INCONSISTENT_SHELL_PRESENT',
'ERROR',
'One or more closed components contain directed-edge conflicts.',
{
windingInconsistentShellCount
}
)
);
}

return deepFreeze({
valid:
!hasHEarthBlockingIssues(
issues
),

shellOrientationRecords:  
  deepFreeze(  
    shellOrientationRecords  
  ),  

shellCount:  
  shellOrientationRecords.length,  

outwardShellCount,  

inwardShellCount,  

degenerateShellCount,  

openShellCount,  

nonmanifoldShellCount,  

windingInconsistentShellCount,  

issues:  
  sortHEarthGeometryIssues(  
    issues  
  )

});
}

/* ==========================================================================

21 · COMPLETE INDEXED-MESH ANALYSIS

========================================================================== */


const baselineModule = process.env.H_EARTH_SHELL_BASELINE ? await import(pathToFileURL(process.env.H_EARTH_SHELL_BASELINE)) : null;
const oracle = baselineModule?.analyzeHEarthMeshShells ?? baselineAnalyze;
const cases = [];
const v = (x,y,z) => ({x,y,z});
const tetraVertices = [v(0,0,0),v(1,0,0),v(0,1,0),v(0,0,1)];
const tetraIndices = [0,2,1,0,1,3,0,3,2,1,2,3];
function mesh(name, vertices, indices, expected) {
 const topology=extractHEarthIndexedTopology(vertices,indices);
 const baselineTopology=baselineModule ? baselineModule.extractHEarthIndexedTopology(vertices,indices) : structuredClone(topology);
 assert.deepStrictEqual(topology,baselineTopology,`${name}: independent topology extraction parity`);
 cases.push({name,args:[vertices,indices,topology],oracleArgs:[vertices,indices,baselineTopology],expected});
}
mesh('empty',[],[],'empty');
mesh('open triangle',tetraVertices.slice(0,3),[0,1,2],'OPEN');
mesh('outward tetra',tetraVertices,tetraIndices,'OUTWARD');
mesh('inward tetra',tetraVertices,tetraIndices.flatMap((_,i,a) => i%3===0 ? [a[i],a[i+2],a[i+1]] : []),'INWARD');
mesh('coplanar closed',tetraVertices.map((p)=>({...p,z:0})),tetraIndices,'DEGENERATE');
mesh('reversed face',tetraVertices,[0,1,2,...tetraIndices.slice(3)],'WINDING_INCONSISTENT');
mesh('nonmanifold with boundaries',[...tetraVertices,v(0,0,-1)],[0,1,2,1,0,3,0,1,4],'NONMANIFOLD');
mesh('duplicate faces',tetraVertices,[...tetraIndices,0,2,1]);
mesh('repeated vertex',tetraVertices,[0,0,1]);
mesh('invalid vertex index',tetraVertices,[0,1,99]);
mesh('disconnected mixed',[...tetraVertices,...tetraVertices.map(p=>v(p.x+4,p.y,p.z)),v(8,0,0),v(9,0,0),v(8,1,0)],
 [...tetraIndices,...tetraIndices.map(n=>n+4),8,9,10]);
const edge = (...triangleIndices) => ({uses:triangleIndices.map(triangleIndex=>({triangleIndex})),multiplicity:999});
const conflict = (...triangleIndices) => ({triangleIndices});
function hand(name, components, edges, conflicts=[], extra={}) {
 cases.push({name,args:[tetraVertices,tetraIndices,{triangleConnectedComponents:components,edges,directedConflicts:conflicts,...extra}]});
}
hand('overlapping memberships',[[0],[0,1],[1]],[edge(0,1)],[conflict(0,1)]);
hand('duplicate component entries',[[0,0,1]],[edge(0,0,1)], [conflict(0,0,1)]);
hand('duplicate edge records',[[0]],[edge(0),edge(0)], [conflict(0),conflict(0)]);
hand('nonmanifold precedence',[[0,1]],[edge(0,0,1),edge(0)],[conflict(0)]);
hand('open precedence',[[0,1]],[edge(0)],[conflict(0)]);
hand('winding precedence',[[0,1]],[edge(0,1)],[conflict(0)]);
hand('component output order',[[3,1,0,2],[0],[3,2,1,0]],[edge(0,1),edge(2,3)],[conflict(3,0),conflict(1)]);
hand('outside memberships',[[-1],[1.5],['0'],[NaN],[null],[99]],[edge(-1),edge(1.5),edge('0'),edge(NaN),edge(null),edge(99)]);
hand('empty components',[[],[0],[]],[edge(0)]);
hand('null component',[null],[edge(0)]);
hand('missing edges',[[0]],undefined);
hand('null edge',[[0]],[null]);
hand('missing uses',[[0]],[{}]);
hand('null use',[[0]],[{uses:[null]}]);
hand('missing conflict indices',[[0]],[edge(0)],[{}]);
hand('null conflict',[[0]],[edge(0)],[null]);
hand('sparse edges',[[0]],Array(2));
hand('sparse uses',[[0]],[{uses:Array(2)}]);
hand('sparse components',Array(2),[edge(0)]);
hand('sparse memberships',[[,0]],[edge(0)]);
hand('sparse conflicts',[[0]],[edge(0)],Array(2));
cases.push({name:'invalid vertices early return',args:[null,[],{triangleConnectedComponents:[null],directedConflicts:[]} ]});
cases.push({name:'invalid topology early return',args:[[],[],null]});
cases.push({name:'invalid tolerance early return',args:[[],[],{triangleConnectedComponents:[],edges:[],directedConflicts:[]},{}]});
const manyVertices=[],manyIndices=[];
for(let i=0;i<600;i++) { const n=manyVertices.length; manyVertices.push(v(i*2,0,0),v(i*2+1,0,0),v(i*2,1,0));manyIndices.push(n,n+1,n+2); }
mesh('600 disconnected triangles',manyVertices,manyIndices);
// Reproducible adversarial memberships: shared triangles, repeated uses and
// conflicts, shuffled component order, and empty components.
let seed=0x2618;
const random = (limit) => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed%limit; };
for(let trial=0;trial<100;trial++) {
 const components=Array.from({length:random(8)},()=>Array.from({length:random(9)},()=>random(4)));
 const edges=Array.from({length:random(12)},()=>edge(...Array.from({length:random(7)},()=>random(4))));
 const conflicts=Array.from({length:random(8)},()=>conflict(...Array.from({length:random(6)},()=>random(4))));
 hand(`seeded overlap ${trial}`,components,edges,conflicts);
}
function outcome(fn,args) {
 try { return {value:fn(...args)}; }
 catch(error) { return {exception:{name:error.name,message:error.message}}; }
}
function assertDeepFrozen(value) {
 if(value === null || typeof value !== 'object') return;
 assert.ok(Object.isFrozen(value),'result must be deeply frozen');
 for(const child of Object.values(value)) assertDeepFrozen(child);
}
let referenceMs=0,candidateMs=0;
for (const test of cases) {
 const before=structuredClone(test.args);
 let start=performance.now(); const expected=outcome(oracle,test.oracleArgs ?? test.args); referenceMs+=performance.now()-start;
 assert.deepStrictEqual(test.args,before,`${test.name}: oracle input mutation`);
 start=performance.now(); const actual=outcome(analyzeHEarthMeshShells,test.args); candidateMs+=performance.now()-start;
 assert.deepStrictEqual(actual,expected,`${test.name}: exact output/exception parity`);
 assert.deepStrictEqual(test.args,before,`${test.name}: candidate input mutation`);
 if('value' in actual) assertDeepFrozen(actual.value);
 if(test.expected) {
  if(test.expected==='empty') assert.equal(actual.value.shellCount,0);
  else assert.equal(actual.value.shellOrientationRecords[0].orientation,test.expected,`${test.name}: independent orientation expectation`);
 }
}
console.log(JSON.stringify({passed:true,cases:cases.length,referenceMs,candidateMs,oracle:process.env.H_EARTH_SHELL_BASELINE?'external baseline':'frozen scan oracle'},null,2));

// Custom records use independent factories so getter / Proxy observations are
// compared too; snapshots would themselves invoke custom behavior.
const customCases = [
 {name:'proxy edges empty components',factory(log) {
  const edges=new Proxy([], {getOwnPropertyDescriptor(){ throw Error('unexpected reflection'); }, ownKeys(){throw Error('unexpected reflection');}, get(target,key,receiver){log.push(`edge.get:${String(key)}`);return Reflect.get(target,key,receiver);}});
  return [tetraVertices,tetraIndices,{triangleConnectedComponents:[],edges,directedConflicts:[]}];
 }},
 {name:'proxy uses nonempty component',factory(log) {
  const use=new Proxy({triangleIndex:0},{get(target,key,receiver){log.push(`use.get:${String(key)}`);return Reflect.get(target,key,receiver);},getOwnPropertyDescriptor(){throw Error('unexpected reflection');}});
  return [tetraVertices,tetraIndices,{triangleConnectedComponents:[[0]],edges:[{uses:[use]}],directedConflicts:[]}];
 }},
 {name:'getter record',factory(log) {
  const record={get uses(){log.push('uses getter');return [{get triangleIndex(){log.push('triangleIndex getter');return 0;}}];}};
  return [tetraVertices,tetraIndices,{triangleConnectedComponents:[[0]],edges:[record],directedConflicts:[]}];
 }},
 {name:'array subclass',factory(log) {
  class CustomArray extends Array { filter(...args){log.push('custom filter');return super.filter(...args);} }
  const edges=new CustomArray({uses:[{triangleIndex:0}]});
  return [tetraVertices,tetraIndices,{triangleConnectedComponents:[[0]],edges,directedConflicts:[]}];
 }}
];
for(const test of customCases) {
 const oracleLog=[],candidateLog=[];
 const expected=outcome(oracle,test.factory(oracleLog));
 const actual=outcome(analyzeHEarthMeshShells,test.factory(candidateLog));
 assert.deepStrictEqual(actual,expected,`${test.name}: custom output parity`);
 assert.deepStrictEqual(candidateLog,oracleLog,`${test.name}: traversal observation parity`);
 if('value' in actual) assertDeepFrozen(actual.value);
}
console.log(JSON.stringify({customPassed:true,customCases:customCases.length,totalCases:cases.length+customCases.length}));
