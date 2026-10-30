from pathlib import Path
import json,hashlib
import numpy as np
from scipy.ndimage import label
from field import reconstruct_anchored_field,display
root=Path(__file__).resolve().parent.parent;records=[]
for side in ['near','far']:
 a=np.load(root/f'dense-source-{side}.npz');c=a['coefficients'];P=a['referenceP'];valid=a['supported'];v,m,r=reconstruct_anchored_field(c,.5,valid)
 q0=display(c[...,:1]*P+c[...,1:]);q1=display(v[...,:1]*P+v[...,1:]);lum0=q0@np.array([.2126,.7152,.0722]);lum1=q1@np.array([.2126,.7152,.0722])
 center=np.zeros(valid.shape,bool);center[24:-24,24:-24]=True;center&=valid
 rec={'side':side,'model':'Current coefficient fixed-reference color; not GPU/actual per-fragment texture','solverResidual':r['equationResidualMax'],'centralSupportedCells':int(center.sum()),'centralMobileCells':int((center&(m['weight']>0)&~m['anchors']).sum()),'centralAnchors':int((center&m['anchors']).sum()),'outsideSupportExact':bool(np.array_equal(v[m['weight']==0],c[m['weight']==0])),'originalAnchorsExact':bool(np.array_equal(v[m['anchors']],c[m['anchors']])),'thresholds':[]}
 for percentile,direction in [(10,'dark'),(20,'dark'),(80,'light'),(90,'light')]:
  t=float(np.percentile(lum0[center],percentile));b=((lum0<=t) if direction=='dark' else (lum0>=t))&center;n=((lum1<=t) if direction=='dark' else (lum1>=t))&center
  def components(mask):
   lab,count=label(mask);areas=np.bincount(lab.ravel())[1:];return {'count':int(count),'largestCells':int(areas.max()) if len(areas) else 0}
  rec['thresholds'].append({'baselinePercentile':percentile,'direction':direction,'fixedBaselineDisplayLuminance':t,'baselineCells':int(b.sum()),'candidateCells':int(n.sum()),'retainedBaselineCells':int((b&n).sum()),'baselineComponents':components(b),'candidateComponents':components(n)})
 rec['centralRange']={'baseline':[float(lum0[center].min()),float(lum0[center].max())],'candidate':[float(lum1[center].min()),float(lum1[center].max())]}
 records.append(rec)
report={'sourceSha256':hashlib.sha256(Path(__file__).with_name('field.py').read_bytes()).hexdigest(),'records':records,'interpretation':'Fixed threshold area is descriptive, not a visual acceptance threshold. Exact extrema retention does not establish preservation of whole patch interiors; inspect these reductions before runtime qualification.'}
Path(__file__).with_suffix('.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
