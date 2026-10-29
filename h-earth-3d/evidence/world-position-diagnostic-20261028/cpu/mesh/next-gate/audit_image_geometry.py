#!/usr/bin/env python3
"""H-Earth image-derived 2D mesh NON-qualification audit.

Checks that quantized captured positions cannot safely replace the exact indexed
Float32 source mesh for area conservation. No candidate material correction.
"""
import hashlib, io, json, argparse, zipfile
from pathlib import Path
import numpy as np
from PIL import Image

WORLD_SHA='36bda9bb3fe0d3711fe1ef557c07505c2e93316de4a39f1321b50e8ab4cce4a3'
SOURCE='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
RENDERER='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec'
HALF=np.array([.0390625,.000152587890625,.0390625])

def load(path):
    raw=Path(path).read_bytes();assert hashlib.sha256(raw).hexdigest()==WORLD_SHA,'ARCHIVE_SHA256'
    imgs={}
    with zipfile.ZipFile(io.BytesIO(raw)) as z:
        assert z.testzip() is None,'ARCHIVE_CRC'
        r=json.loads(z.read('receipt.json'))
        assert r['sceneIdentity']['sourceHead']==SOURCE,'HEAD'
        assert r['sourceProductSha256']==RENDERER,'RENDERER'
        for v in r['views']:
            assert v['sourceHead']==SOURCE and v['rendererHash']==RENDERER,'VIEW_SOURCE'
            b=z.read(v['image']);assert hashlib.sha256(b).hexdigest()==v['imageSha256'],'FRAME_SHA256'
            a=np.array(Image.open(io.BytesIO(b)).convert('RGBA'))
            assert a.shape==(980,529,4),'SHAPE'
            imgs[v['pose']['name'],v['mode']]=a
    assert len(imgs)==8,'FRAME_COUNT'
    return imgs

def xyz(a,coord):
    a=a[...,:3].astype(np.int64);v=a[...,0]*65536+a[...,1]*256+a[...,2]
    return -128+(v-1)/4096. if coord=='y' else -32768+(v-1)/16.

def audit(imgs):
    records=[]
    delta=2*np.linalg.norm(HALF)
    for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
        xs={coord:xyz(imgs[pose,'world-'+coord],coord) for coord in 'xyz'}
        for start in (128,260,392):
            rows=slice(y0,y1+1);cols=slice(start,start+9)
            for coord in 'xyz':
                assert np.all(imgs[pose,'world-'+coord][rows,cols,3]==255), 'SAMPLE_TRANSPARENCY'
            a=np.stack([xs[c][rows,cols] for c in 'xyz'],-1)
            # Two source-independent pseudo-triangles per raster quad. These are
            # NOT uploaded indexed triangles, only a falsification experiment.
            A=np.concatenate([a[:-1,:-1].reshape(-1,3),a[1:,1:].reshape(-1,3)])
            B=np.concatenate([a[:-1,1:].reshape(-1,3),a[1:,:-1].reshape(-1,3)])
            C=np.concatenate([a[1:,:-1].reshape(-1,3),a[:-1,1:].reshape(-1,3)])
            e1=B-A;e2=C-A
            area=.5*np.linalg.norm(np.cross(e1,e2),axis=1)
            error=.5*delta*(np.linalg.norm(e1,axis=-1)+np.linalg.norm(e2,axis=-1))+.5*delta**2
            certifiedLower=np.maximum(0,area-error)
            records.append({'pose':pose,'pixelColumnStart':start,'observedVertices':int(a.shape[0]*a.shape[1]),
                'pseudoFaces':len(area),'nominalAreaSumMetersSquared':float(area.sum()),
                'nominalZeroAreaFaces':int(np.sum(area<=1e-12)),
                'nonpositiveConservativeLowerBoundFaces':int(np.sum(certifiedLower<=1e-12)),
                'conservativeUncertainAreaFraction':float(np.mean(certifiedLower<=1e-12)),
                'sumMaxAllowableAreaMetersSquared':float((area+error).sum()),
                'minimumObservedWithinRowEdgeMeters':float(np.min(np.linalg.norm(np.diff(a,axis=1),axis=-1))),
                'sourceImageNotExactMesh':True})
    result={'schema':'H_EARTH_POSITION_IMAGE_TRIANGLE_AREA_NONQUALIFICATION_V1',
        'result':'IMAGE_DERIVED_MESH_REJECTED_FOR_SOURCE_AREA',
        'sourceHead':SOURCE,'rendererSha256':RENDERER,'worldArchiveSha256':WORLD_SHA,
        'positionHalfWidthMetersXYZ':HALF.tolist(),'observedPixelComponents':len(records),
        'totalPseudoFaces':sum(x['pseudoFaces'] for x in records),
        'nominalZeroFaces':sum(x['nominalZeroAreaFaces'] for x in records),
        'facesWithNonpositiveConservativeLowerAreaBound':sum(x['nonpositiveConservativeLowerBoundFaces'] for x in records),
        'records':records,
        'interpretation':['Exact source triangle areas must be taken from approved uploaded Float32 positions and index buffers.',
            'The per-channel captured coordinate cells are too wide relative to many lateral sample spacings; pseudo-mesh area can collapse to zero.',
            'The error interval is a safe conservative bound obtained from two uncertain 3D edges and their cross-product. It is not a measured hardware error distribution.',
            'Failing this pseudo-geometry does not invalidate the calibrated captures or the qualified 47 source triangle membership evidence.',
            'No real geometry modified, GPU executed or material repair accepted.']}
    return result

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--archive',required=True);p.add_argument('--report',required=True)
    a=p.parse_args();r=audit(load(a.archive));Path(a.report).write_text(json.dumps(r,indent=2)+'\n')
    print(json.dumps({k:r[k] for k in ['result','observedPixelComponents','totalPseudoFaces','nominalZeroFaces','facesWithNonpositiveConservativeLowerAreaBound']},indent=2))