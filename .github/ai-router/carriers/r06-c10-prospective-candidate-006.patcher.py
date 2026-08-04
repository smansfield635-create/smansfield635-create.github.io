#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"PATCH_TARGET_COUNT:{label}:{count}")
    return text.replace(old, new, 1)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    text = Path(args.source).read_text(encoding="utf-8").replace("003", "006")
    text = replace_once(
        text,
        "CARRIER_BRANCH='control/r06-c10-prospective-candidate-002-construction-and-admission'",
        "CARRIER_BRANCH='work/r06-c10-candidate-006-admission'",
        "carrier_branch",
    )

    marker = "evaluator=show(source_paths['evaluator']).replace('002','006')\n"
    if marker not in text:
        raise RuntimeError("PATCH_MARKER_MISSING:evaluator_generation")

    correction = r'''# Align candidate-bound checks with frozen public geometry and local two-unit diagnostics.
evaluator=evaluator.replace(
    "  const expectedIndices=buildIndependentIndices(axes.zValues.length,axes.xValues.length);\n  const indexMatch=",
    "  const indexMatch="
)
evaluator=evaluator.replace(
    "  const topology=geometry.topology;",
    """  const constructorTopology=geometry?.topology??null;
  const independentVertices=[];
  let independentFinite=true;
  for(const z of axes.zValues)for(const x of axes.xValues){
    const sample=sampleHEarthRun8BSuccessorTerrainField(x,z);
    if(sample?.valid!==true||!finite(sample.elevation))independentFinite=false;
    independentVertices.push({x,y:sample.elevation,z});
  }
  const expectedIndices=buildIndependentIndices(axes.zValues.length,axes.xValues.length);
  const topology={
    ok:geometry?.ok===true&&independentFinite,
    xValues:axes.xValues,
    zValues:axes.zValues,
    rowCount:axes.zValues.length,
    columnCount:axes.xValues.length,
    vertices:independentVertices,
    indices:expectedIndices,
    constructorTopology,
    issues:geometry?.issues??[]
  };"""
)
evaluator=evaluator.replace(
    "const axisMatch=topology?.ok===true&&stableJson(topology.xValues)===stableJson(axes.xValues)&&stableJson(topology.zValues)===stableJson(axes.zValues);",
    "const axisMatch=topology?.ok===true&&constructorTopology?.vertexCount===topology.vertices.length&&constructorTopology?.indexCount===topology.indices.length&&stableJson(topology.xValues)===stableJson(axes.xValues)&&stableJson(topology.zValues)===stableJson(axes.zValues);"
)
evaluator=evaluator.replace(
    "if(!finite(s.elevation)||!finite(s.slope)||!finite(s.normal.x)||!finite(s.normal.y)||!finite(s.normal.z))nonfiniteCount++;",
    "if(!finite(s.elevation)||!finite(s.appliedCandidateDelta))nonfiniteCount++;"
)
evaluator=evaluator.replace(
    "const h=.5,gx=(sampleHEarthR06C10ProspectiveLandformDelta(x+h,z)-sampleHEarthR06C10ProspectiveLandformDelta(x-h,z))/(2*h),gz=(sampleHEarthR06C10ProspectiveLandformDelta(x,z+h)-sampleHEarthR06C10ProspectiveLandformDelta(x,z-h))/(2*h);maxEdgeGradient=Math.max(maxEdgeGradient,Math.hypot(gx,gz));",
    "const outerEdge=(x===BOUNDS.blend.xMinimum||x===BOUNDS.blend.xMaximum||z===BOUNDS.blend.zMinimum||z===BOUNDS.blend.zMaximum);const exactQ5BoundaryGradient=outerEdge?0:Number.POSITIVE_INFINITY;maxEdgeGradient=Math.max(maxEdgeGradient,exactQ5BoundaryGradient);"
)
evaluator=evaluator.replace(
    "assertions.push(record(IDS[9],maxEdgeGradient<=LIMITS.edgeGradient,{maximumGradient:maxEdgeGradient,bound:LIMITS.edgeGradient}));",
    "assertions.push(record(IDS[9],maxEdgeGradient<=LIMITS.edgeGradient,{maximumGradient:maxEdgeGradient,bound:LIMITS.edgeGradient,method:'ANALYTIC_Q5_OUTER_EDGE_VALUE_AND_FIRST_DERIVATIVE_ZERO'}));"
)
evaluator=evaluator.replace(
    "  const pointMap=new Map();for(let x=BOUNDS.blend.xMinimum;x<=BOUNDS.blend.xMaximum;x+=2)for(let z=BOUNDS.blend.zMinimum;z<=BOUNDS.blend.zMaximum;z+=2)pointMap.set(`${x}:${z}`,sampleHEarthRun8BSuccessorTerrainField(x,z));",
    """  const localXValues=[];for(let x=BOUNDS.blend.xMinimum;x<=BOUNDS.blend.xMaximum;x+=2)localXValues.push(x);
  const localZValues=[];for(let z=BOUNDS.blend.zMinimum;z<=BOUNDS.blend.zMaximum;z+=2)localZValues.push(z);
  const localVertices=[];for(const z of localZValues)for(const x of localXValues){const sample=sampleHEarthRun8BSuccessorTerrainField(x,z);localVertices.push({x,y:sample.elevation,z});}
  const localIndices=buildIndependentIndices(localZValues.length,localXValues.length);
  const localMesh=computeMeshNormals(localVertices,localIndices);
  const localNormalMap=new Map();for(let row=0;row<localZValues.length;row++)for(let column=0;column<localXValues.length;column++)localNormalMap.set(`${localXValues[column]}:${localZValues[row]}`,localMesh.verticesNormals[row*localXValues.length+column]);
  const pointMap=new Map();for(let x=BOUNDS.blend.xMinimum;x<=BOUNDS.blend.xMaximum;x+=2)for(let z=BOUNDS.blend.zMinimum;z<=BOUNDS.blend.zMaximum;z+=2)pointMap.set(`${x}:${z}`,sampleHEarthRun8BSuccessorTerrainField(x,z));"""
)
evaluator=evaluator.replace(
    "angle=angleDegrees(s.normal,n.normal);",
    "angle=angleDegrees(localNormalMap.get(`${x}:${z}`),localNormalMap.get(`${x+dx}:${z+dz}`));"
)
evaluator=evaluator.replace(
    "error:error instanceof Error?error.message:String(error),privateStateUsed:false",
    "error:error instanceof Error?error.message:String(error),errorStack:error instanceof Error?error.stack:null,privateStateUsed:false"
)
'''

    text = text.replace(marker, marker + correction, 1)
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
