#!/usr/bin/env python3
"""Read-only: reuse original material ZIP and past captures, never run GPU/census.

usage: python3 reconcile_historic_far_current.py PAIRED_ZIP HISTORIC_VISUAL_ZIP CURRENT_VISUAL_ZIP [OUTPUT_JSON]
The caller must obtain original immutable Library/Actions artifacts and
verify that they match the exact names and SHA256 identities below.
"""
import io, zipfile, json, hashlib, sys
import numpy as np
from PIL import Image
from pathlib import Path

PAIRED='08b0c3ae8e1cc3c318b7fa1ada6d01e75370f5423745f2250db6354805b3fdef'
HISTORIC='aee6311ffaf9de2c3191bbd416331e7c59735b6e4ab2316640e24933ae59141c'
CURRENT='c1ae9fd42efba75bcda13c49caac13539bbb3aed41f812e05a0d6f59f3eb1756'
TARGETS=[[392,496],[392,497]]
WORLD=[[-188.875,14.75439453125,-736.0625],[-189.0625,14.73388671875,-734.5625]]
HIST_PNG={
'baseline-inland-seam-far-after-groundcover-unlit.png':'309416fd0e6dba1ea1b82e1d6b06258392c58c45a5835e45b537d4e1b2162c2a',
'baseline-inland-seam-far-reference-lit.png':'cbff8d7e3212b6c09594d10d5ddd4a16d32d74f565101a31e3ba2c6faa0e41bc',
'candidate-inland-seam-far-after-groundcover-unlit.png':'08e33723c27bcf2e4c4941f6fa538c88cb3a14b5629de4675f0476c0233f8aac',
'candidate-inland-seam-far-reference-lit.png':'f456cc21dd254c2550b390952c26f6b4fda23bd411f30d12ad01cd1c4185f85b'}

def opened(path, expected):
    raw=Path(path).read_bytes()
    if hashlib.sha256(raw).hexdigest()!=expected: raise ValueError('ORIGINAL_ARCHIVE_HASH_DRIFT')
    z=zipfile.ZipFile(io.BytesIO(raw))
    if z.testzip() is not None: raise ValueError('ORIGINAL_ARCHIVE_CRC_FAIL')
    return z

def decompose(arr):
    p=arr['pixels'];off=arr['offsets']
    points=[np.flatnonzero(np.all(p==xy,axis=1)) for xy in TARGETS]
    if [[int(off[i]) for i in ids] for ids in points]!=[[144,73902],[144]]:
        raise ValueError('SOURCE_MEMBERSHIPS_CHANGED')
    results=[]
    for i in points[0]:
        for j in points[1]:
            d=lambda k: arr[k][j].astype(float)-arr[k][i].astype(float)
            av=lambda k: (arr[k][j].astype(float)+arr[k][i].astype(float))*.5
            wi,wg=av('wI'),av('wG')
            terms={
              'incomingSoil':(1-wg)*(1-wi)*d('P'),
              'identityTarget':(1-wg)*wi*d('TI'),
              'identityWeight':(1-wg)*(av('TI')-av('P'))*d('wI'),
              'groundcoverTarget':wg*d('TG'),
              'groundcoverWeight':(av('TG')-av('I'))*d('wG')}
            delta=d('Q')
            err=float(np.max(abs(sum(terms.values())-delta)))
            if err>=1e-7:raise ValueError('STAGE_DECOMPOSITION_NOT_CLOSED')
            results.append({'offsets':[int(off[i]),int(off[j])],
              'sameOriginalTriangle':bool(off[i]==off[j]),'deltaQ':delta.tolist(),
              'deltaP':d('P').tolist(),
              'signedTerms':{k:v.tolist() for k,v in terms.items()},
              'identityWeights':[float(arr['wI'][i]),float(arr['wI'][j])],
              'groundcoverWeights':[float(arr['wG'][i]),float(arr['wG'][j])],
              'maxAlgebraResidual':err})
    return results

def current_projection(z):
    receipt=json.loads(z.read('candidate/receipt.json'))
    if receipt['sceneHead']!='3ea149e5b56e8cc0d5aac192bce0cdd47da7e626':
        raise ValueError('FROZEN_CURRENT_SCENE_IDENTITY_DRIFT')
    if len(receipt['views'])!=3:raise ValueError('CURRENT_CAPTURE_POSE_DRIFT')
    rows=[]
    for view in receipt['views']:
        M=np.asarray(view['worldPacket']['camera']['viewProjectionMatrix'],float)
        if M.shape!=(16,):raise ValueError('INVALID_CAMERA_MATRIX')
        M=M.reshape(4,4).T
        points=[]
        for xyz in WORLD:
            q=M@np.asarray([*xyz,1.],float)
            if q[3]<=0: raise ValueError('INVALID_CAMERA_CLIP_W')
            ndc=q[:3]/q[3]
            points.append({'NDC':ndc.tolist(),
              'screenTopLeft':[(float(ndc[0])+1)*192,(1-float(ndc[1]))*344],
              'inVisibleClip':bool(np.all(abs(ndc)<=1))})
        rows.append({'pose':view['pose']['name'],'points':points})
    if any(point['inVisibleClip'] for v in rows for point in v['points']):
        raise ValueError('HISTORIC_WITNESS_NOW_IN_SAVED_VIEW_REINSPECT')
    return rows

def inspect(paired,archive,current):
    with opened(paired,PAIRED) as z:
        with np.load(io.BytesIO(z.read('results/native-inland-seam-far.npz')),allow_pickle=False) as a:
            if len(a['offsets'])!=1461:raise ValueError('NATIVE_MEMBERSHIP_COUNT_DRIFT')
            source=decompose(a)
    rgb={}
    with opened(archive,HISTORIC) as z:
        for name,sha in HIST_PNG.items():
            raw=z.read(name)
            if hashlib.sha256(raw).hexdigest()!=sha:raise ValueError('HISTORIC_PNG_SHA_DRIFT')
            img=np.asarray(Image.open(io.BytesIO(raw)).convert('RGB'))
            if img.shape!=(980,529,3):raise ValueError('HISTORIC_FRAME_DIMENSION_DRIFT')
            rgb[name]=[img[y,x].tolist() for x,y in TARGETS]
    with opened(current,CURRENT) as z: frames=current_projection(z)
    return dict(schema='H_EARTH_GEN3000_REUSED_HISTORIC_FAR_SOURCE_RECONCILIATION_v1',
      result='SOURCE_ALGEBRA_PASS__ALL_CURRENT_ARCHIVED_CAMERAS_EXCLUDE_WITNESS',
      historicSourceArchiveSha256=PAIRED,historicVisualZipSha256=HISTORIC,currentVisualZipSha256=CURRENT,
      historicalWorldWitness=WORLD,archivedHistoricalRGB8=rgb,
      allRetainedSourceAlternatives=source,currentCameraProjection=frames,
      qualification='CONDITIONAL_CPU_NATIVE_ECOLOGICAL_STAGES_ONLY',
      laterCorrectedAtlasValuesAtExactWorldPointsQualified=False,
      laterMaterialMarginValuesAtExactWorldPointsQualified=False,
      currentVisibleGPUFragmentOwnerKnown=False,
      currentProductAppearanceOfHistoricWitnessKnown=False,
      nextAction='Reuse exact source atlas/97x97 margin field to finish numerical current composition, then qualify any new camera only if material cause warrants it',
      noNewGPU=True,noProductMutation=True,noNewCensus=True)

if __name__=='__main__':
    if len(sys.argv) not in (4,5):raise SystemExit('USAGE PAIRED_ZIP HIST_VIS_ZIP CURRENT_VIS_ZIP [REPORT]')
    out=inspect(*sys.argv[1:4])
    if len(sys.argv)==5:Path(sys.argv[4]).write_text(json.dumps(out,indent=2)+'\n')
    print(json.dumps({'result':out['result'],
      'sourceAlternatives':[r['offsets'] for r in out['allRetainedSourceAlternatives']],
      'maxSourceAlgebraError':max(r['maxAlgebraResidual'] for r in out['allRetainedSourceAlternatives']),
      'archiveViewsExcluded':[r['pose'] for r in out['currentCameraProjection']]}))
