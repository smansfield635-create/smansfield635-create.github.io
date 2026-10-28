import importlib.util,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
spec=importlib.util.spec_from_file_location('a','analyze-capture.py');a=importlib.util.module_from_spec(spec);spec.loader.exec_module(a)
r=json.load(open('diagnostic/receipt.json'));images={}
for v in r['views']:
 p=Path('diagnostic')/v['image'];assert hashlib.sha256(p.read_bytes()).hexdigest()==v['imageSha256'];images[v['pose']['name'],v['mode']]=np.array(Image.open(p).convert('RGBA'))
profiles=[]
for pose,lo,hi in [('inland-seam-near',260,300),('inland-seam-far',470,520)]:
 for x in [132,264,396]:
  for lag in [1,16]:
   ys=np.repeat(np.arange(lo,hi-lag+1),9);xs=np.tile(np.arange(x-4,x+5),hi-lo-lag+1)
   p=a.values_at(images,pose,xs,ys);q=a.values_at(images,pose,xs,ys+lag)
   assert np.all(p['eligible']&q['eligible']&~p['censored']&~q['censored'])
   roots,delta=a.decompose(p['P'],q['P'],p['f'],q['f'])
   average=lambda v:v.reshape((-1,9,3)).mean(axis=1)
   obs=average(q['C']-p['C']); terms={k:average(v) for k,v in roots.items()}
   final=np.array(Image.open(f'recovered/baseline-{pose}-after-groundcover-unlit.png'))[:,:,:3]
   actual=a.decode_color(final[ys+lag,xs])-a.decode_color(final[ys,xs]);actual=average(actual)
   summary={'pose':pose,'x':x,'lag':lag,'rows':list(range(lo,hi-lag+1)),'identityObserved':obs.tolist(),'finalBaselineObserved':actual.tolist(),'rootProfiles':{k:v.tolist() for k,v in terms.items()},'fieldsRange':{k:[float(v.min()),float(v.max())] for k,v in p['f'].items()}}
   peaks=np.argsort(np.mean(np.abs(actual),axis=1))[-3:][::-1]
   summary['strongestFinalPairs']=[{'rows':[int(lo+i),int(lo+i+lag)],'finalRGB':actual[i].tolist(),'identityRGB':obs[i].tolist(),'rankedRootRGB':[{'root':k,'rgb':v[i].tolist()} for k,v in sorted(terms.items(),key=lambda kv:np.abs(kv[1][i]).sum(),reverse=True)[:4]]} for i in peaks]
   summary['identityFinalCorrelation']=[float(np.corrcoef(obs[:,c],actual[:,c])[0,1]) for c in range(3)]
   profiles.append(summary)
   if lag==16: print(pose,x,'near range',summary['fieldsRange']['near'],'slope',summary['fieldsRange']['slopeResponse'],'corr',np.round(summary['identityFinalCorrelation'],3).tolist(),'peak',summary['strongestFinalPairs'][0])
Path('spatial-audit.json').write_text(json.dumps({'kind':'EXPLORATORY_SPATIALLY_ALIGNED_BASELINE_AUDIT','limitations':['Post-hoc extrema are localization only, not new acceptance gates','Root profiles are reconstructed baseline identity contributions, not candidate or final-stage attribution','Same image pixels do not establish same-world-point correspondence between near and far poses','RGB8 quantization intervals retained in prior analyzer; point estimates here do not replace them'],'profiles':profiles},indent=2)+'\n')
