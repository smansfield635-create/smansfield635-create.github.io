#!/usr/bin/env python3
"""Reconstruct Gen2957's predeclared contribution ledger without rendering.
Requires Python 3, numpy, Pillow and node. Output-code intervals are conditional
on the plan's +/-1 combined rounding/dither assumption, not measured GPU errors.
"""
import argparse
import gzip
import hashlib
import itertools
import json
from pathlib import Path
import subprocess
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
TOOLING_HEAD = '59af7c4ab16743704c6427ad5acd518f1f84434c'
ARCHIVE_SHA256 = '6c3ffd91d89e8309e5f486844804935834753670162f68bdd860d7014a4d3a74'

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def decode(b):
    return (np.asarray(b, dtype=float) / 255.0) ** 2.2 / 1.12

def interval(b, raw=False):
    lo, hi = np.maximum(0., b-1.), np.minimum(255., b+1.)
    return (lo/255., hi/255.) if raw else (decode(lo), decode(hi))

def add(a, b): return a[0]+b[0], a[1]+b[1]
def sub(a, b): return a[0]-b[1], a[1]-b[0]
def scale(a, k): return a[0]*k, a[1]*k
def mul(a, b):
    v = np.stack([x*y for x in a for y in b])
    return v.min(axis=0), v.max(axis=0)

def l1bounds(a):
    lo, hi = a
    mn = np.where((lo <= 0) & (hi >= 0), 0., np.minimum(abs(lo), abs(hi)))
    return float(mn.sum()), float(np.maximum(abs(lo), abs(hi)).sum())

def array(a): return np.asarray(a).tolist()

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--capture', required=True, type=Path)
    ap.add_argument('--archive', type=Path, help='Optional original ZIP; require its published digest when supplied')
    ap.add_argument('--output', required=True, type=Path)
    args = ap.parse_args()
    plan = json.loads((HERE/'analysis-plan.json').read_text())
    receipt_path = args.capture/'receipt.json'
    if receipt_path.exists():
        receipt_bytes = receipt_path.read_bytes()
    else:
        receipt_path = args.capture/'receipt.json.gz'
        receipt_bytes = gzip.decompress(receipt_path.read_bytes())
    r = json.loads(receipt_bytes)
    assert r['result'] == 'CONTRIBUTION_LEDGER_CAPTURE_COMPLETE_ANALYSIS_PENDING'
    assert not r['errors'] and not r['productDiskMutation']
    assert r['sceneIdentity']['sourceHead'] == plan['frozenSceneHead']
    assert r['sceneIdentity']['rendererSha256'] == plan['rendererSha256']
    assert r['sceneIdentity']['toolingHead'] == TOOLING_HEAD
    assert len(r['views']) == plan['frames'] == 8
    assert len(r['runs']) == 1 and not r['runs'][0]['errors']
    if args.archive: assert sha(args.archive) == ARCHIVE_SHA256, 'ZIP digest mismatch'
    tooling_hashes = {}
    for relative in ['tools/h-earth-ground-material-comparison.v1.mjs',
                     'tools/h-earth-groundcover-factor-overlay.mjs']:
        frozen = subprocess.check_output(['git', 'show', TOOLING_HEAD+':'+relative], cwd=REPO)
        assert (REPO/relative).read_bytes() == frozen, 'Admitted validator tooling changed: '+relative
        tooling_hashes[relative] = hashlib.sha256(frozen).hexdigest()
    # Reuse the exact admitted capture validator for pose, mode, frame and
    # asset/vegetation signature readback. This import does not run the renderer.
    module = (REPO/'tools/h-earth-ground-material-comparison.v1.mjs').as_uri()
    js = ('import fs from "node:fs"; import {validateContributionSet} from '+json.dumps(module)+'; '
          'const r=JSON.parse(fs.readFileSync(0,"utf8")); '
          'if(validateContributionSet(r.views)!==true)throw Error("capture invalid");')
    subprocess.run(['node','--input-type=module','-e',js],input=receipt_bytes,check=True)
    manifest=[]
    for v in r['views']:
        p=args.capture/v['image']
        assert p.parent.resolve()==args.capture.resolve(), 'Unexpected image path'
        assert sha(p)==v['imageSha256'] and p.stat().st_size==v['imageBytes']
        with Image.open(p) as im: assert list(im.size)==plan['imageDimensions'] and im.mode=='RGBA'
        manifest.append({'file':v['image'],'sha256':sha(p),'bytes':p.stat().st_size})
    rows=[]; summaries=[]; recon=[]
    modes=plan['modes']; tr=plan['transects']; lag=tr['verticalLagPixels']; hw=tr['halfWidth']
    for pose in ['inland-seam-near','inland-seam-far']:
        imgs=[np.asarray(Image.open(args.capture/f'candidate-{pose}-{m}.png'),dtype=float) for m in modes]
        pb,tb,wb,cb=[a[:,:,:3] for a in imgs]
        p,t,c=map(decode,[pb,tb,cb]); w=wb[:,:,:1]/255.
        pi,ti,ci=map(interval,[pb,tb,cb]); wi=interval(wb[:,:,:1],True)
        alpha=np.logical_and.reduce([a[:,:,3]==255 for a in imgs])
        gray=(wb[:,:,0]==wb[:,:,1])&(wb[:,:,0]==wb[:,:,2])
        censored=np.logical_or.reduce([((a==0)|(a==255)).any(axis=2) for a in [pb,tb,cb]])
        eligible=alpha & gray & ~censored
        pred=(1-w)*p+w*t
        # Exact corners for blend range; avoid introducing dependency excess
        # from independently bounding w and (1-w).
        corners=np.stack([(1-ww)*pp+ww*tt for ww,pp,tt in itertools.product(wi,pi,ti)])
        pred_i=(corners.min(axis=0),corners.max(axis=0))
        outside=((pred_i[1]<ci[0]-1e-7)|(pred_i[0]>ci[1]+1e-7)).any(axis=2)
        residual=pred-c
        ys,ye=tr[pose]['yStart'],tr[pose]['yEnd']
        for xc in tr['xCenters']:
            xs=slice(xc-hw,xc+hw+1); roi=(slice(ys,ye+1),xs)
            e=eligible[roi]; rr=residual[roi][e]
            recon.append({'pose':pose,'xCenter':xc,'yStart':ys,'yEndInclusive':ye,
                'sampledPixels':int(e.size),'eligiblePixels':int(e.sum()),
                'censoredPixels':int(censored[roi].sum()),'alphaFailures':int((~alpha[roi]).sum()),
                'weightGrayFailures':int((~gray[roi]).sum()),
                'outsideIntervalPixels':int((outside[roi]&e).sum()),
                'outsideFractionEligible':float((outside[roi]&e).sum()/e.sum()) if e.any() else None,
                'maxAbsResidualLinear':float(abs(rr).max()) if rr.size else None,
                'meanAbsResidualLinear':float(abs(rr).mean()) if rr.size else None})
            transect_rows=[]
            for y in range(ys,ye-lag+1):
                a=(y,xs); b=(y+lag,xs)
                valid=eligible[a]&eligible[b]
                row={'pose':pose,'xCenter':xc,'y':y,'y2':y+lag,'eligiblePairs':int(valid.sum()),
                     'totalPairs':2*hw+1,'censoredPairs':int((censored[a]|censored[b]).sum()),
                     'reconstructionOutsidePairs':int(((outside[a]|outside[b])&valid).sum())}
                if valid.any():
                    mw=(w[a]+w[b])/2; dp=p[b]-p[a]; dt=t[b]-t[a]; dw=w[b]-w[a]
                    terms=[(1-mw)*dp,mw*dt,dw*((t[a]+t[b]-p[a]-p[b])/2)]
                    mwi=scale(add(tuple(z[a] for z in wi),tuple(z[b] for z in wi)),.5)
                    dpi=sub(tuple(z[b] for z in pi),tuple(z[a] for z in pi))
                    dti=sub(tuple(z[b] for z in ti),tuple(z[a] for z in ti))
                    dwi=sub(tuple(z[b] for z in wi),tuple(z[a] for z in wi))
                    mt=scale(add(tuple(z[a] for z in ti),tuple(z[b] for z in ti)),.5)
                    mp=scale(add(tuple(z[a] for z in pi),tuple(z[b] for z in pi)),.5)
                    ints=[mul((1-mwi[1],1-mwi[0]),dpi),mul(mwi,dti),mul(dwi,sub(mt,mp))]
                    averages=[z[valid].mean(axis=0) for z in terms]
                    bounds=[tuple(z[valid].mean(axis=0) for z in q) for q in ints]
                    for name,av,bd in zip(['soil','target','coverage'],averages,bounds):
                        row[name]={'signedRGB':array(av),'l1':float(abs(av).sum()),'signedRGBInterval':[array(z) for z in bd],'l1Interval':list(l1bounds(bd))}
                    observed=(c[b]-c[a])[valid].mean(axis=0)
                    predicted=(pred[b]-pred[a])[valid].mean(axis=0)
                    summed=sum(averages)
                    assert np.max(abs(summed-predicted))<1e-12
                    row.update({'observedDeltaRGB':array(observed),'predictedDeltaRGB':array(predicted),
                        'identityResidualMax':float(np.max(abs(summed-predicted))),
                        'observedDeltaResidualMax':float(np.max(abs(summed-observed))),
                        'cancellationL1':float(sum(abs(z).sum() for z in averages)-abs(summed).sum())})
                    margin=row['coverage']['l1Interval'][0]-row['soil']['l1Interval'][1]-row['target']['l1Interval'][1]
                    row['coverageDominanceMargin']=margin
                    row['coverageDominatesCombinedWithinAssumedBounds']=bool(valid.all() and row['reconstructionOutsidePairs']==0 and margin>0)
                else: row['coverageDominatesCombinedWithinAssumedBounds']=False
                rows.append(row); transect_rows.append(row)
            robust=[z for z in transect_rows if z['coverageDominatesCombinedWithinAssumedBounds']]
            runs=[]
            for z in robust:
                if runs and runs[-1][1]+1==z['y']: runs[-1][1]=z['y']
                else: runs.append([z['y'],z['y']])
            summaries.append({'pose':pose,'xCenter':xc,'rows':len(transect_rows),
                'fullyEligibleRows':sum(z['eligiblePairs']==2*hw+1 for z in transect_rows),
                'robustCoverageDominantRows':len(robust),'robustStartYIntervalsInclusive':runs,
                'strongestPosthocWitness':max(robust,key=lambda z:z['coverageDominanceMargin']) if robust else None})
    mismatch=sum(z['outsideIntervalPixels'] for z in recon)
    result={'schema':'H_EARTH_GROUNDCOVER_CONTRIBUTION_LEDGER_v1','operationId':plan['operationId'],'generation':plan['generation'],
        'result':'RECONSTRUCTION_INTERVAL_MISMATCH_NO_CAUSAL_INFERENCE' if mismatch else 'BOUNDED_TRANSECT_ANALYSIS_COMPLETE',
        'planSha256':sha(HERE/'analysis-plan.json'),'scriptSha256':sha(__file__),
        'custody':{'receiptSha256':hashlib.sha256(receipt_bytes).hexdigest(),'receiptStoredFile':receipt_path.name,
            'receiptStoredSha256':sha(receipt_path),'zipSha256Verified':sha(args.archive) if args.archive else None,
            'toolingHead':TOOLING_HEAD,'toolingSha256':tooling_hashes,'sceneIdentity':r['sceneIdentity'],'captureValidator':'validateContributionSet from admitted tooling', 'images':manifest},
        'reconstruction':recon,'transects':summaries,'rowsFile':'analysis-rows.json','totalRows':len(rows),
        'limits':['Intervals condition on at most one output code of combined quantization/dither error; not proved GPU float equivalence.',
        'Interval endpoints are averaged directly, without independence or square-root sample-size uncertainty reduction.',
        'L1 is sum of absolute linear RGB components, not a perceptual color metric.',
        'Witness selection is posthoc maximum dominance margin within predeclared transects; all rows retained.',
        'Only two frozen diagnostic views of the rejected resident-field scene; no map-wide, physical-device, temporal-aliasing or repair acceptance claim.',
        'Any unresolved reconstruction interval mismatch blocks causal inference.'],
        'repairProven':False,'releaseAuthorized':False}
    args.output.mkdir(parents=True,exist_ok=True)
    (args.output/'analysis-rows.json').write_text(json.dumps(rows,indent=2)+'\n')
    result['rowsSha256']=sha(args.output/'analysis-rows.json')
    (args.output/'analysis.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({'result':result['result'],'totalRows':len(rows),'outsidePixels':mismatch,
        'transects':[{k:z[k] for k in ['pose','xCenter','rows','fullyEligibleRows','robustCoverageDominantRows','robustStartYIntervalsInclusive']} for z in summaries]},indent=2))
    if mismatch: raise SystemExit(2)

if __name__=='__main__': main()
