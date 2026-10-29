#!/usr/bin/env python3
"""Read-only original indexed-mesh physical-support audit; never substitutes screen triangles."""
import argparse, hashlib, json, zipfile
import numpy as np
from scipy.spatial import cKDTree
from shapely.geometry import Point, Polygon
from shapely.strtree import STRtree

EXPECTED={
    "original-mesh/world.gz":"48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a",
    "original-mesh/mesh/upload-positions.bin":"342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83",
    "original-mesh/mesh/upload-indices.bin":"483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c",
}
def inspect(archive):
    with zipfile.ZipFile(archive) as z:
        for name,digest in EXPECTED.items():
            assert hashlib.sha256(z.read(name)).hexdigest()==digest,"SOURCE_SHA256:"+name
        package=json.loads(z.read("original-mesh/mesh/package.json"))
        samples=json.loads(z.read("original-mesh/mesh/surface-samples.json"))
        positions=np.frombuffer(z.read("original-mesh/mesh/upload-positions.bin"),np.float32).reshape(-1,3).astype(np.float64)
        indices=np.frombuffer(z.read("original-mesh/mesh/upload-indices.bin"),np.uint32)
    assert len(samples)==2484 and sum(len(x["candidateOffsets"]) for x in samples)==2575
    groups={}
    for span in package["primitiveSpans"]:
        if span.get("role")=="TERRAIN": group="NEAR"
        elif span.get("primitiveId")=="H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION":group="FAR"
        else:continue
        for off in range(span["indexStart"],span["indexStart"]+span["indexCount"],3):
            assert off not in groups
            groups[off]=group
    offsets=np.array(sorted(groups),dtype=np.int64)
    verts=positions[indices[offsets[:,None]+np.arange(3)]]
    centers=verts.mean(axis=1)[:,[0,2]]
    anchors=np.array([x["world"] for x in samples])[:,[0,2]]
    tree=cKDTree(anchors)
    distance,_=tree.query(centers)
    radius=np.linalg.norm(verts[:,:,[0,2]]-centers[:,None,:],axis=2).max(axis=1)
    mapoffs={int(o):i for i,o in enumerate(offsets)}
    seeds={mapoffs[int(o)] for x in samples for o in x["candidateOffsets"]}
    centroid_active=set(np.where(distance<=48.)[0].tolist())
    physical_active=set()
    for i in np.where(distance<=radius+48.)[0]:
        polygon=Polygon(verts[i][:,[0,2]])
        assert polygon.is_valid and polygon.area>0,"PROJECTED_DEGENERATE_SOURCE_FACE"
        for j in tree.query_ball_point(centers[i],r=radius[i]+48.):
            if polygon.distance(Point(anchors[j]))<=48.:
                physical_active.add(int(i));break
    assert seeds.issubset(physical_active),"SOURCE_SEED_OUTSIDE_PHYSICAL_SUPPORT"
    witness_distance=[]
    for sample in samples:
        pt=Point(sample["world"][0],sample["world"][2])
        for off in sample["candidateOffsets"]:
            witness_distance.append(Polygon(verts[mapoffs[int(off)]][:,[0,2]]).distance(pt))
    active=sorted(physical_active)
    polygons=[Polygon(verts[i][:,[0,2]]) for i in active]
    tree=STRtree(polygons)
    overlaps=[]
    for i,poly in enumerate(polygons):
        for j in tree.query(poly):
            j=int(j)
            if j<=i or groups[int(offsets[active[i]])]==groups[int(offsets[active[j]])]:continue
            area=float(poly.intersection(polygons[j]).area)
            if area>1e-12:
                overlaps.append({"a":int(offsets[active[i]]),"b":int(offsets[active[j]]),"areaXZ":area})
    gap=[]
    for o in overlaps:
        a,b=o["a"],o["b"]
        u=positions[indices[a:a+3]]
        v=positions[indices[b:b+3]]
        shape=Polygon(u[:,[0,2]]).intersection(Polygon(v[:,[0,2]]))
        center=shape.centroid
        def height(face):
            aa,bb,cc=face
            coeff=np.linalg.solve(
                np.array([[aa[0]-cc[0],bb[0]-cc[0]],[aa[2]-cc[2],bb[2]-cc[2]]]),
                np.array([center.x-cc[0],center.y-cc[2]]))
            return float(coeff[0]*aa[1]+coeff[1]*bb[1]+(1-coeff.sum())*cc[1])
        gap.append({"a":a,"b":b,"abs3DHeightDifferenceMeters":abs(height(u)-height(v)),
                    "overlapCenterXZ":[center.x,center.y],"areaXZ":o["areaXZ"]})
    return {
        "schema":"H_EARTH_ORIGINAL_INDEXED_MESH_PHYSICAL_SUPPORT_AUDIT_v1",
        "result":"SOURCE_SUPPORT_RECONCILED_NOT_CLOSURE_QUALIFIED",
        "sourceCommit":"cb57c275b95d0d48883bc4da4dcfcf17cbec5060",
        "originalWorldAssetSHA256":EXPECTED["original-mesh/world.gz"],
        "sourcePositionsSHA256":EXPECTED["original-mesh/mesh/upload-positions.bin"],
        "sourceIndicesSHA256":EXPECTED["original-mesh/mesh/upload-indices.bin"],
        "sampleCount":len(samples),"candidateMemberships":sum(len(x["candidateOffsets"]) for x in samples),
        "sourceFaces":len(offsets),"uniqueSeedFaces":len(seeds),
        "oldCentroidSupportFaces":len(centroid_active),
        "oldCentroidOmittedSeedFaces":len(seeds-centroid_active),
        "sourcePolygonDistance48mSupportFaces":len(physical_active),
        "allSeedFacesRetained":seeds.issubset(physical_active),
        "addedPhysicalFacesOverCentroid":len(physical_active-centroid_active),
        "maxWitnessSourceFaceDistanceMeters":max(witness_distance),
        "crossNearFarProjectedOverlapPairs":len(overlaps),
        "totalOverlapXZSquareMeters":sum(o["areaXZ"] for o in overlaps),
        "maxOverlapXZSquareMeters":max((o["areaXZ"] for o in overlaps),default=0),
        "overlaps":overlaps,
        "overlapHeightWitnesses":gap,
        "maximumSourceOverlapHeightGapMeters":max((x["abs3DHeightDifferenceMeters"] for x in gap),default=0),
        "sourceOverlapCenterZRange":[min((x["overlapCenterXZ"][1] for x in gap),default=None),
                                     max((x["overlapCenterXZ"][1] for x in gap),default=None)],
        "noSourceGeometryChanged":True,"noGPURun":True,
        "limits":["Exact 48m source-polygon support is an independently evaluated selector, not an accepted replacement yet.","Cross primitive projected overlaps and 40m source-cut influence remain independent fail-closed conditions.","This does not qualify P(c,f0), D(c,f0), or physical 1m/2m color conservation."]
    }
def main():
    p=argparse.ArgumentParser();p.add_argument("--artifact-zip",required=True);p.add_argument("--output",required=True)
    a=p.parse_args();report=inspect(a.artifact_zip)
    with open(a.output,"w") as f:json.dump(report,f,indent=2);f.write("\n")
    print(json.dumps({k:v for k,v in report.items() if k!="overlaps"},indent=2))
if __name__=="__main__":main()
