"""One offline algebraic repair hypothesis; no runtime/GPU or acceptance claim."""
import json,hashlib,importlib.util,itertools
from pathlib import Path
import numpy as np
from PIL import Image
s=importlib.util.spec_from_file_location('a','analyze-capture.py');a=importlib.util.module_from_spec(s);s.loader.exec_module(a)
L=np.array([.2126,.7152,.0722])
def Y(v):return np.sum(v*L,axis=-1,keepdims=True)
def blend(p,t,w):return p+w*(t*Y(p)/np.maximum(Y(t),1e-6)-p)
def image(p):return np.array(Image.open(p).convert('RGBA'))
ims={};hashes=[]
for folder in ['diagnostic','ledger-capture','recovered']:
 r=json.loads(Path(folder+'/receipt.json').read_text())
 for v in r['views']:
  p=Path(folder)/v['image'];assert hashlib.sha256(p.read_bytes()).hexdigest()==v['imageSha256'];hashes.append({'path':str(p),'sha256':v['imageSha256']})
  if folder=='diagnostic':ims[v['pose']['name'],v['mode']]=image(p)
groups=[];rows=[]
for pose,lo,hi in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 for xc in [132,264,396]:
  yy=np.repeat(np.arange(lo,hi+1),9);xx=np.tile(np.arange(xc-4,xc+5),hi-lo+1)
  v=a.values_at(ims,pose,xx,yy);assert np.all(v['eligible']&~v['censored'])
  p,c,t=v['P'],v['C'],v['T'];iw=v['f']['W'][:,None]
  gt=a.decode_color(image(f'ledger-capture/candidate-{pose}-groundcover-tone-color.png')[yy,xx,:3])
  q=a.decode_color(image(f'recovered/baseline-{pose}-after-groundcover-unlit.png')[yy,xx,:3])
  # Least-squares nominal inferred baseline W. It is an estimate, not a capture.
  gw=np.clip(np.sum((c-q)*(c-gt),axis=1,keepdims=True)/np.sum((c-gt)**2,axis=1,keepdims=True),0,.88)
  ci=blend(p,t,iw);cq=blend(ci,gt,gw)
  assert np.max(abs(Y(cq)-Y(p)))<1e-12
  shapes=lambda z:z.reshape((-1,9,3))
  p,c,q,ci,cq=map(shapes,[p,c,q,ci,cq])
  for lag in [1,16]:
   bd=(q[lag:]-q[:-lag]).mean(1);nd=(cq[lag:]-cq[:-lag]).mean(1);pd=(p[lag:]-p[:-lag]).mean(1)
   ratios=np.sum(abs(nd),axis=1)/np.maximum(np.sum(abs(bd),axis=1),1e-9)
   for i in range(len(bd)):
    rows.append({'pose':pose,'xCenter':xc,'rows':[lo+i,lo+i+lag],'lag':lag,'baselineRGBDelta':bd[i].tolist(),'candidateRGBDelta':nd[i].tolist(),'incomingRGBDelta':pd[i].tolist(),'candidateToBaselineL1Ratio':float(ratios[i])})
   groups.append({'pose':pose,'xCenter':xc,'lag':lag,'pairs':len(bd),'nominalReducedPairs':int((ratios<1).sum()),'baselineMeanAbsoluteRGBDelta':abs(bd).mean(0).tolist(),'candidateMeanAbsoluteRGBDelta':abs(nd).mean(0).tolist(),'candidateToBaselineSummedAbsoluteRatio':float(abs(nd).sum()/abs(bd).sum()),'maxCandidateLinearRGB':float(cq.max()),'minCandidateLinearRGB':float(cq.min()),'meanLuminanceRatio':float(Y(cq).mean()/Y(q).mean())})
report={'schema':'H_EARTH_COORDINATED_LUMINANCE_PRESERVING_BLEND_OFFLINE_v1','hypothesis':'Normalize each identity/groundcover target to incoming linear Rec709 luminance, then retain original weights. No parameter search.','formula':'B(P,T,w)=P+w*(T*Y(P)/max(Y(T),1e-6)-P)','baseline':'cb57c275b95d0d48883bc4da4dcfcf17cbec5060','groups':groups,'rows':rows,'inputImages':hashes,'limits':['Nominal CPU reconstruction from quantized archived colors and inferred groundcover weight, not GPU output.','Only sampled near/far baseline bands; healthy controls and full-scene appearance untested.','Preserving incoming luminance deliberately removes identity/groundcover luminance design; ecological color may brighten strongly.','No new acceptance threshold or automatic candidate approval.','This candidate retains chroma boundaries; absence of brightness change does not mean absence of visible seams.']}
Path('coordinated-blend-offline.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'groups':groups,'farWitness':next(x for x in rows if x['pose']=='inland-seam-far' and x['xCenter']==264 and x['rows']==[481,497])},indent=2))
