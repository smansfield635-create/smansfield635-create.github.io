"""Independent archived tone reconstruction and one-witness mask bound. No capture."""
import json,importlib.util,hashlib,itertools
from pathlib import Path
import numpy as np
from PIL import Image
sp=importlib.util.spec_from_file_location('a','analyze-capture.py');a=importlib.util.module_from_spec(sp);sp.loader.exec_module(a)
r=json.load(open('diagnostic/receipt.json'));images={}
for v in r['views']:
 p=Path('diagnostic')/v['image'];assert hashlib.sha256(p.read_bytes()).hexdigest()==v['imageSha256']
 images[v['pose']['name'],v['mode']]=np.array(Image.open(p).convert('RGBA'))
l=json.load(open('ledger-capture/receipt.json'))
for v in l['views']:
 assert hashlib.sha256((Path('ledger-capture')/v['image']).read_bytes()).hexdigest()==v['imageSha256']
def inv(v):
 lo=np.zeros_like(v);hi=np.ones_like(v)
 for _ in range(60):
  mid=(lo+hi)/2;q=mid*mid*(3-2*mid);lo=np.where(q<v,mid,lo);hi=np.where(q>=v,mid,hi)
 return (lo+hi)/2
checks=[]
for pose,y0,y1 in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 yy=np.repeat(np.arange(y0,y1+1),27);xx=np.tile(np.r_[np.arange(128,137),np.arange(260,269),np.arange(392,401)],y1-y0+1)
 v=a.values_at(images,pose,xx,yy);f=v['fi'];h=f['heightDry'];assert np.all(h.lo>0)&np.all(h.hi<1)
 elevation=a.smoothstep(-1,34,a.Interval(8+22*inv(h.lo),8+22*inv(h.hi)))
 wet=a.clamp((1-elevation)*.12+f['macro']*.06,0,.18)
 m=a.clamp(.20+.55*f['moist']+.25*wet,0,1)
 d=a.clamp((1-m)*(.18+.28*f['meso'])+.20*f['slopeResponse'],0,.65)
 A=a.Interval(np.array([.110,.118,.075]));B=a.Interval(np.array([.075,.090,.055]));D=a.Interval(np.array([.175,.150,.095]))
 T=A+(B-A)*a.rgb(m);T=(T+(D-T)*a.rgb(d))*a.rgb(.88+.24*f['variation'])
 cap=np.array(Image.open(f'ledger-capture/candidate-{pose}-groundcover-tone-color.png').convert('RGB'))[yy,xx]
 C=a.color_interval(cap);bad=np.any((T.lo>C.hi+2e-7)|(T.hi<C.lo-2e-7),axis=1)
 checks.append({'pose':pose,'samples':len(xx),'failures':int(bad.sum()),'wetnessBounds':[float(wet.lo.min()),float(wet.hi.max())],'maxToneIntervalWidth':np.max(T.hi-T.lo,axis=0).tolist()})
def amplitude(p):return .88*p*(1-.25*a.smoothstep(.30,.85,p))
mask=[];pose='inland-seam-far';weights=np.array(Image.open(f'ledger-capture/candidate-{pose}-groundcover-weight-raw.png').convert('RGB'))
for yy in [481,497]:
 xs=np.arange(260,269);ys=np.full(9,yy);v=a.values_at(images,pose,xs,ys);f=v['fi']
 p=a.smoothstep(.20,.66,.78*f['meso']+.22*f['detail']);wi=a.raw_interval(weights[ys,xs,0]);hl=amplitude(p.lo);hh=amplitude(p.hi)
 assert np.all(hl>0)
 ml=np.maximum(0,wi.lo/hh);mh=np.minimum(1,wi.hi/hl);assert np.all(ml<=mh)
 mask.append({'row':yy,'x':xs.tolist(),'maskLower':ml.tolist(),'maskUpper':mh.tolist(),'residentPatchBounds':[p.lo.tolist(),p.hi.tolist()]})
report={'schema':'H_EARTH_INDEPENDENT_TONE_MASK_REVIEW_v1','toneChecks':checks,'maskWitness':mask,'methods':{'tone':'Invert captured interior heightDry=smoothstep(8,30,y), calculate elevationMix=smoothstep(-1,34,y), then terrainWetness and exact tone from captured moist, meso, slopeResponse and variation with +/-1-code intervals.','mask':'Resident W divided by .88*p*(1-.25*smoothstep(.3,.85,p)), resident p=smoothstep(.2,.66,.78*meso+.22*detail). This amplitude is monotone on [0,1]; endpoints bound it. All denominators strictly positive at this witness.'},'limits':['Baseline source-equivalent tone only; resident W is not baseline W.','Shared mask assumes only organic/patch differ between resident and approved source; all other source and scene dependencies match.','Mask=1 consistent but not proven exactly; quantization permits small variation.','No GPU, product change, visual acceptance or repair sufficiency established.']}
xs=np.arange(260,269);ys=np.array([481,497])[:,None]
paths=['diagnostic/candidate-inland-seam-far-identity-result-color.png','ledger-capture/candidate-inland-seam-far-groundcover-tone-color.png','recovered/baseline-inland-seam-far-after-groundcover-unlit.png']
pi,ti,qi=[a.color_interval(np.array(Image.open(p).convert('RGB'))[ys,xs]) for p in paths]
assert np.all(pi.lo>ti.hi)
rr=np.stack([(pp-qq)/(pp-tt) for pp,qq,tt in itertools.product([pi.lo,pi.hi],[qi.lo,qi.hi],[ti.lo,ti.hi])])
wl=np.maximum(0,rr.min(0).max(2));wh=np.minimum(.88,rr.max(0).min(2));assert np.all(wl<=wh)
delta_lower=wl[1]-wh[0]
# A constant patch amplitude is at most .88 (loose but safe upper bound).
mask_only_upper=.88*(np.array(mask[1]['maskUpper'])-np.array(mask[0]['maskLower']))
report['maskOnlyExclusion']={'rows':[481,497],'x':xs.tolist(),'baselineInferredDeltaWeightLower':delta_lower.tolist(),'constantPatchMaskOnlyDeltaWeightUpper':mask_only_upper.tolist(),'margin':(delta_lower-mask_only_upper).tolist(),'allMarginsPositive':bool(np.all(delta_lower>mask_only_upper)),'meaning':'Shared suitability/protection variation alone with constant patch cannot explain the inferred baseline weight increase at these nine pixels. Patch-amplitude change is required, conditional on source-equivalent archived P/T and interval conventions; this is not repair sufficiency.'}
Path('review-tone-mask.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
