"""Offline attribution; weights inferred from final RGB, never claimed measured."""
import json, hashlib, itertools
from pathlib import Path
import numpy as np
from PIL import Image

def decode(x): return (x/255.)**2.2/1.12
def interval(x): return decode(np.maximum(0,x-1)),decode(np.minimum(255,x+1))
def add(a,b): return a[0]+b[0],a[1]+b[1]
def sub(a,b): return a[0]-b[1],a[1]-b[0]
def scale(a,k): return a[0]*k,a[1]*k
def mul(a,b):
 v=np.stack([x*y for x in a for y in b]); return v.min(0),v.max(0)
def bounds(a):
 lo,hi=a;return [float(np.where((lo<=0)&(hi>=0),0,np.minimum(abs(lo),abs(hi))).sum()),float(np.maximum(abs(lo),abs(hi)).sum())]
def img(path): return np.asarray(Image.open(path).convert('RGBA'),dtype=float)
manifest=[]
for folder in ['ledger-capture','diagnostic','recovered']:
 r=json.loads(Path(folder+'/receipt.json').read_text())
 for v in r['views']:
  p=Path(folder)/v['image']
  assert hashlib.sha256(p.read_bytes()).hexdigest()==v['imageSha256']
  manifest.append({'path':str(p),'sha256':v['imageSha256']})

rows=[];groups=[];custody=[]
for pose,lo,hi in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 oldP=img(f'ledger-capture/candidate-{pose}-before-groundcover-unlit.png')
 P=img(f'diagnostic/candidate-{pose}-identity-result-color.png')
 T=img(f'ledger-capture/candidate-{pose}-groundcover-tone-color.png')
 Q=img(f'recovered/baseline-{pose}-after-groundcover-unlit.png')
 custody.append({'pose':pose,'incomingExactRGBA':bool(np.array_equal(oldP,P)),'incomingDifferingPixels':int(np.any(oldP!=P,axis=2).sum())})
 for xc in [132,264,396]:
  y,x=np.meshgrid(np.arange(lo,hi+1),np.arange(xc-4,xc+5),indexing='ij')
  pb,tb,qb=[a[y,x,:3] for a in [P,T,Q]]
  assert all(np.all(a[y,x,3]==255) for a in [P,T,Q])
  assert all(np.all((a>0)&(a<255)) for a in [pb,tb,qb])
  pi,ti,qi=map(interval,[pb,tb,qb]);p,t,q=map(decode,[pb,tb,qb])
  assert np.all(pi[0]>ti[1]), 'Nonseparable color interval'
  ratios=np.stack([(pp-qq)/(pp-tt) for pp,qq,tt in itertools.product(pi,qi,ti)])
  wl=np.maximum(0,ratios.min(0).max(2,keepdims=True));wh=np.minimum(.88,ratios.max(0).min(2,keepdims=True))
  assert np.all(wl<=wh),'No common RGB-consistent blend weight'
  wi=(wl,wh)
  w=np.clip(np.sum((p-q)*(p-t),axis=2,keepdims=True)/np.sum((p-t)**2,axis=2,keepdims=True),wl,wh)
  for lag in [1,16]:
   n=hi-lo+1-lag
   sl=lambda a,back=False:a[lag:] if back else a[:-lag]
   pair=lambda a,back=False:tuple(sl(z,back) for z in a)
   mw=scale(add(pair(wi),pair(wi,True)),.5)
   dp=sub(pair(pi,True),pair(pi));dt=sub(pair(ti,True),pair(ti));dw=sub(pair(wi,True),pair(wi))
   mt=scale(add(pair(ti),pair(ti,True)),.5);mp=scale(add(pair(pi),pair(pi,True)),.5)
   ints=[mul((1-mw[1],1-mw[0]),dp),mul(mw,dt),mul(dw,sub(mt,mp))]
   wn=(w[:-lag]+w[lag:])/2
   terms=[(1-wn)*(p[lag:]-p[:-lag]),wn*(t[lag:]-t[:-lag]),(w[lag:]-w[:-lag])*(t[:-lag]+t[lag:]-p[:-lag]-p[lag:])/2]
   obs=(q[lag:]-q[:-lag]).mean(1)
   start=len(rows)
   for i in range(n):
    entry={'pose':pose,'xCenter':xc,'rows':[lo+i,lo+i+lag],'lag':lag,'observedDeltaRGB':obs[i].tolist()}
    for name,it,term in zip(['incoming','target','weight'],ints,terms):
     av=tuple(z[i].mean(0) for z in it)
     entry[name]={'signedRGB':term[i].mean(0).tolist(),'intervalRGB':[z.tolist() for z in av],'l1Bounds':bounds(av)}
    entry['weightDominanceMargin']=entry['weight']['l1Bounds'][0]-entry['incoming']['l1Bounds'][1]-entry['target']['l1Bounds'][1]
    entry['weightDominant']=entry['weightDominanceMargin']>0
    rows.append(entry)
   selected=rows[start:]
   groups.append({'pose':pose,'xCenter':xc,'lag':lag,'pairs':n,'weightDominantPairs':sum(z['weightDominant'] for z in selected),'weightRange':[float(wl.min()),float(wh.max())],'maxWeightIntervalWidth':float((wh-wl).max()),'strongestPosthocWitness':max(selected,key=lambda z:z['weightDominanceMargin'])})
result={'schema':'H_EARTH_ARCHIVED_TARGET_INFERRED_WEIGHT_ATTRIBUTION_v1','result':'BOUNDED_BASELINE_ATTRIBUTION_COMPLETE','baseline':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','custody':custody,'groups':groups,'rows':rows,'imageManifest':manifest,'limitations':['Baseline only, not rejected fertile candidate.','Weights inferred from final RGB using source-equivalent archived target; not directly captured baseline weights.','No independent final reconstruction claim: final RGB supplies inferred weights.','Intervals condition on +/-1 output code; interval arithmetic deliberately ignores correlations conservatively.','Windows reused from spatial audit; strongest witnesses posthoc, not acceptance thresholds.','Linear RGB L1 is not perceptual distance; no global prevalence or visual repair claim.']}
Path('groundcover-attribution.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'custody':custody,'groups':[{k:v for k,v in g.items() if k!='strongestPosthocWitness'} for g in groups],'farCenterWitness':next(z for z in rows if z['pose']=='inland-seam-far' and z['xCenter']==264 and z['rows']==[481,497])},indent=2))
