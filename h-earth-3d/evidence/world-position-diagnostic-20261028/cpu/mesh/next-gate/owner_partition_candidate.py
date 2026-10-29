#!/usr/bin/env python3
"""Gen2969 immutable-source owner PARTITION CANDIDATE; not renderer code.

Clips only FAR continuation against existing NEAR land in the overlap cluster.
Outputs exact 2D and source-affine 3D numerical witnesses, NEVER a product pass.
"""
import argparse, hashlib, json, zipfile
from pathlib import Path
import numpy as np
from shapely.geometry import Polygon
from shapely.ops import unary_union

ARTIFACT_SHA='e1eb8a2fdbaacce663783440e2189b17e487eacb6c13fd50907d07cdb640bc4a'
WORLD_SHA='48f754ca1b11b8fe7eeb0e8d4573f6b6cb544cf438322a115eb52c44d3b29d5a'
POS_SHA='342a2a788009410bf48a6b5889a55cad4afd97552ff02b72f98b1308f7f84b83'
IDX_SHA='483f7693f29225e52fa90700837015741e78edb291de9adb785a8db3a74d616c'
NEAR='H_EARTH_RUN_8B_SUCCESSOR_TERRAIN_MOUNTAIN_NEUTRAL_PRIMITIVE_001'
FAR='H_EARTH_WORLD_MANIFOLD:FAR_LAND_CONTINUATION'
POLICY='NEAR_LOCAL_SOURCE_OVER_FAR_CONTINUATION_DRAFT_v1'

def must(test,why):
    if not test: raise ValueError('FAIL_CLOSED:'+why)

def digest(data):return hashlib.sha256(data).hexdigest()

def clip(near,far):
    # The local NEAR surface is left intact. FAR is retained only outside NEAR.
    must(all(p.is_valid and p.area>0 for p in near.values()),'NEAR_FOOTPRINT_INVALID')
    must(all(p.is_valid and p.area>0 for p in far.values()),'FAR_FOOTPRINT_INVALID')
    n=unary_union(list(near.values()));f=unary_union(list(far.values()))
    must(abs(sum(p.area for p in near.values())-n.area)<1e-9,'INTRA_NEAR_OVERLAP')
    must(abs(sum(p.area for p in far.values())-f.area)<1e-9,'INTRA_FAR_OVERLAP')
    raw=n.intersection(f).area
    must(raw>1e-12,'POSITIVE_SOURCE_OVERLAP_NOT_PRESERVED')
    retained={**near,**{k:p.difference(n) for k,p in far.items()}}
    output_area=sum(p.area for p in retained.values())
    target=n.union(f).area
    must(abs(output_area-target)<1e-9,'AREA_CONSERVATION')
    max_duplicate=max((a.intersection(b).area for a in near.values() for b in list(retained.values())[len(near):]),default=0.)
    must(max_duplicate<1e-12,'CROSS_OWNER_DUPLICATION')
    return retained,{'sourceOverlapXZ':raw,'uniqueUnionXZ':target,'clippedAreaXZ':output_area,'areaErrorXZ':output_area-target,'maxResidualCrossOwnerXZ':max_duplicate}

def affine_integral(poly,xyz,colors):
    # Integral of affine triangle RGB over the precise source-clipped surface.
    if poly.is_empty:return 0.,np.zeros(4)
    basis=np.column_stack((xyz[:,[0,2]],np.ones(3)))
    must(abs(np.linalg.det(basis))>1e-12,'DEGENERATE_XZ_SOURCE_FACE')
    h=np.linalg.solve(basis,xyz[:,1]);c=np.linalg.solve(basis,colors)
    area3=poly.area*np.sqrt(1+h[0]**2+h[1]**2)
    center=poly.centroid
    return area3,area3*np.array([center.x,center.y,1.])@c

def audit(archive_path):
    raw=Path(archive_path).read_bytes();must(digest(raw)==ARTIFACT_SHA,'ARTIFACT_SHA_DRIFT')
    with zipfile.ZipFile(archive_path) as z:
        must(z.testzip() is None,'ZIP_CRC_FAILURE')
        root='original-mesh/mesh/'
        must(digest(z.read('original-mesh/world.gz'))==WORLD_SHA,'ORIGINAL_WORLD_DRIFT')
        pb=z.read(root+'upload-positions.bin');ib=z.read(root+'upload-indices.bin')
        must(digest(pb)==POS_SHA and digest(ib)==IDX_SHA,'UPLOAD_DRIFT')
        xyz=np.frombuffer(pb,dtype='<f4').reshape(-1,3).astype(float)
        indices=np.frombuffer(ib,dtype='<u4')
        package=json.loads(z.read(root+'package.json'))
        report=json.loads(z.read(root+'mesh-gate.json'))
        samples=json.loads(z.read(root+'surface-samples.json'))
        must(len(xyz)==141373 and len(indices)==366666,'UPLOAD_DIMENSION_DRIFT')
        must(len(samples)==2484 and sum(len(s['candidateOffsets']) for s in samples)==2575,'WITNESS_DRIFT')
        must(report['supportRadiusMeters']==48. and report['influenceRadiusMeters']==40.,'BOUNDARY_THRESHOLD_DRIFT')
        must(report['boundaryDistance']['artificialCutClearanceQualified'] and not report['closureQualified'],'GATE_DISPOSITION_DRIFT')
        must(report['boundaryDistance']['minimumArtificialCutWitnessDistanceMeters']>=40.,'ARTIFICIAL_CUT_UNQUALIFIED')
        must(len(report['partialSourceSeamEdges'])==2,'SOURCE_SEAMS_ERASED')
        overlaps=report['sourceProjectedNearFarOverlaps'];must(len(overlaps)==18,'RAW_OVERLAPS_ERASED')
        spans={s['primitiveId']:s for s in package['primitiveSpans']}
        must(NEAR in spans and FAR in spans,'SOURCE_SPANS_MISSING')
        def in_span(off,s):return s['indexStart']<=off<s['indexStart']+s['indexCount'] and (off-s['indexStart'])%3==0
        def triangle(off):return xyz[indices[off:off+3]]
        def polygon(off):return Polygon(triangle(off)[:,[0,2]])
        near_ids=sorted({v['a'] for v in overlaps});far_ids=sorted({v['b'] for v in overlaps})
        must(len(near_ids)==4 and len(far_ids)==18,'SOURCE_PAIR_CENSUS_DRIFT')
        must(all(in_span(i,spans[NEAR]) for i in near_ids) and all(in_span(i,spans[FAR]) for i in far_ids),'SOURCE_PRIMITIVE_OWNERSHIP_DRIFT')
        near={i:polygon(i) for i in near_ids};far={i:polygon(i) for i in far_ids}
        for v in overlaps:
            actual=near[v['a']].intersection(far[v['b']]).area
            must(actual>1e-12 and abs(actual-v['areaXZ'])<5e-11,'RAW_SOURCE_OVERLAP_DRIFT')
        pieces,stats=clip(near,far)
        color=np.asarray(package['buffers']['baseColorsLinear'],float).reshape(-1,4)
        before_far=sum(far[i].area for i in far_ids)
        after_far=sum(pieces[i].area for i in far_ids)
        must(after_far<before_far and all(pieces[i].equals(near[i]) for i in near_ids),'LOCAL_NEAR_PRESERVATION_FAILURE')
        area3=0.;rgba=np.zeros(4)
        for off,p in pieces.items():
            a,c=affine_integral(p,triangle(off),color[indices[off:off+3]])
            area3+=a;rgba+=c
        must(all(np.isfinite(rgba)) and np.isfinite(area3) and area3>0,'MATERIAL_INTEGRAL_INVALID')
        # Double-owned original triangles are not a conserved physical domain.
        # Account explicitly for removed duplicate FAR mass/color, rather than
        # misreporting the 2D union as original 3D material conservation.
        orig_area=0.;orig_rgba=np.zeros(4)
        for off,p in {**near,**far}.items():
            a,c=affine_integral(p,triangle(off),color[indices[off:off+3]])
            orig_area+=a;orig_rgba+=c
        removed_area=orig_area-area3;removed_color=orig_rgba-rgba
        must(removed_area>0 and np.all(np.isfinite(removed_color)),'DUPLICATE_3D_MASS_ACCOUNTING_INVALID')
        must(abs(float(removed_color[3])-removed_area)<1e-9,'RGBA_ALPHA_AREA_MASS_MISMATCH')
        # Independent counterfactual: FAR kept while only NEAR overlap is
        # clipped. Material integrals MUST remain distinguishable and HELD.
        far_union=unary_union(list(far.values()))
        counter={**{i:p.difference(far_union) for i,p in near.items()},**far}
        far_area=0.;far_rgba=np.zeros(4)
        for off,p in counter.items():
            a,c=affine_integral(p,triangle(off),color[indices[off:off+3]])
            far_area+=a;far_rgba+=c
        stats.update(sourceArea3D=area3,sourceWeightedBaseColorRGBA=rgba.tolist(),farClippedAreaXZ=before_far-after_far,
            originalDoubleCountedSourceArea3D=orig_area,
            originalDoubleCountedSourceWeightedRGBA=orig_rgba.tolist(),
            removedDuplicateFarSourceArea3D=removed_area,
            removedDuplicateFarWeightedRGBA=removed_color.tolist(),
            farPriorityCounterfactualArea3D=far_area,
            farPriorityCounterfactualWeightedRGBA=far_rgba.tolist(),
            nearVsFarMaximumWeightedColorDifference=float(np.max(np.abs(rgba[:3]-far_rgba[:3]))),
            originalSourceMassConservationClaimed=False,
            sourceSingleOwnerMaterialConservationQualified=False)
        return {'schema':'H_EARTH_GEN2969_SOURCE_OWNER_CANDIDATE_v1','result':'NEAR_PRIORITY_CLIPPED_SOURCE_CANDIDATE_REVIEW_REQUIRED',
          'candidatePolicy':POLICY,'policyAccepted':False,'materialOwnerPromoted':False,'scientificClosure':False,
          'firstUnresolvedAssertion':'SOURCE_MATERIAL_OWNER_PRECEDENCE_NOT_AUTHORIZED',
          'materialOwnerInvariance':False,'sourceMaterialConservation':'HELD_UNTIL_OWNER_AUTHORITY_AND_PHYSICAL_FLUX',
          'originalAssetVerified':True,'sourceFaces':len(near_ids)+len(far_ids),'rawPositivePairs':len(overlaps),
          'archivedWitnesses':len(samples),'memberships':sum(len(s['candidateOffsets']) for s in samples),
          'artificialCutClearanceMeters':report['boundaryDistance']['minimumArtificialCutWitnessDistanceMeters'],
          'originalBoundaryReviewRequired':report['boundaryDistance']['originalBoundaryRequiresIndependentQualification'],
          'partialSeamCount':len(report['partialSourceSeamEdges']), 'statistics':stats,
          'prohibitedConclusions':['NO_AUTOMATIC_SHORELINE_LAND_FILL','NO_PRODUCT_PIXEL_PROOF','NO_FULL_SOURCE_MASS_FLUX_ACCEPTANCE','NO_MATERIAL_INTEGRAL_INVARIANCE','NO_RELEASE']}

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--artifact',required=True);ap.add_argument('--report',required=True)
    a=ap.parse_args()
    try:out=audit(a.artifact)
    except Exception as e:out={'schema':'H_EARTH_GEN2969_SOURCE_OWNER_CANDIDATE_v1','result':'FAIL_CLOSED','error':str(e),'scientificClosure':False}
    Path(a.report).write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({'result':out['result'],'scientificClosure':False}))
    if out['result']=='FAIL_CLOSED':raise SystemExit(2)
