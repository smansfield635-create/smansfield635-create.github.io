"""Source-derived Float32 ordinary-soil Q0 prototype; no GPU/product mutation.
Reference f0 matches preserved paired evaluator. Local-plane kernel is an
engineering material approximation, not terrain transport/conservation proof.
"""
from pathlib import Path
import importlib.util,json
import numpy as np
from PIL import Image
ROOT=Path('/workspace/scratch/6d7712c11371/source-evidence/paired')
spec=importlib.util.spec_from_file_location('source_fields',ROOT/'input/material-cpu/source-fields.py');f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
spec=importlib.util.spec_from_file_location('ecology',ROOT/'ecological.py');eco=importlib.util.module_from_spec(spec);spec.loader.exec_module(eco)
F=np.float32
clamp=lambda x,a=0,b=1:np.clip(x,a,b)
def sm(a,b,x):
 t=clamp((x-F(a))/F(b-a));return t*t*(F(3)-F(2)*t)
def mix(a,b,t):return a*(1-t)+b*t
def norm(v):return v/np.maximum(np.linalg.norm(v,axis=-1,keepdims=True),F(1e-30))
def noise(xz,scale,off=(0,0)):return f.noise32(xz*F(scale)+np.array(off,dtype=F))
REFERENCE_MEAN=np.array(json.loads((ROOT/'results/report.json').read_text())['textureLinearReferenceMean'],dtype=F)
# Keep exact source arithmetic from the already reviewed CPU transcription.
source=(ROOT/'input/material-cpu/full-p-screen.py').read_text()
body=source[source.index(' broad=noise'):source.index(' yy=np.repeat')]
body=body.replace('grain=noise(world,.55,(-31,23))','grain=np.full_like(broad,F(.5))').replace('detail=noise(world,.29,(29,-17))','detail=np.full_like(broad,F(.5))').replace('nearDetail=1-sm(72,250,dist)','nearDetail=np.zeros_like(slope)')
a=body.index(' hc=');b=body.index(' low=');body=body[:a]+' sn=norm(n)\n'+body[b:]
a=body.index(' tf=f.noise32');b=body.index(' near=');body=body[:a]+' tf=np.full_like(slope,F(.5));tm=np.full_like(slope,F(.5))\n'+body[b:]
body=body.replace('near=1-sm(55,220,dist)','near=np.zeros_like(slope)')
a=body.index(' # All selected');b=body.index(' reference=');body=body[:a]+body[b:]
body=body.replace('reference=tex**F(2.2)*F(.75)','reference=np.broadcast_to(REFERENCE_MEAN,p.shape)')
body=body.replace('P=mix(pal,mix(pal,actual,F(.98)),coverage[...,None])','coverage=coverage*sm(2,29,coast);authority=mix(F(.14),F(.98),sm(18,78,np.maximum(F(0),coast)));P=mix(pal,mix(pal,actual,authority[...,None]),np.where(coverage>F(.001),coverage,F(0))[...,None])')
program='def reference_fields(p,n,coast):\n p=np.asarray(p,dtype=F);n=np.asarray(n,dtype=F);coast=np.broadcast_to(np.asarray(coast,dtype=F),p.shape[:-1]);world=p[...,[0,2]];slope=1-clamp(n[...,1]);slopeR=sm(.025,.58,slope)\n'+body+' fields=locals().copy();fields["f"]=f;out=eco.ecological(fields,coast);out["P"]=P;out["slope"]=slope;out["rock"]=rock;return out\n'
exec(compile(program,'<source-derived-reference>','exec'),globals())
def reference(p,n,coast):return reference_fields(p,n,coast)['Q']
def kernel(p,n,coast,radius=12):
 p=np.asarray(p,dtype=F);n=np.asarray(n,dtype=F);center=reference_fields(p,n,coast);total=np.zeros_like(center['Q'])
 for ix,iz,weight in [(0,0,.5),(-1,0,.125),(1,0,.125),(0,-1,.125),(0,1,.125)]:
  d=np.array([ix*radius,iz*radius],dtype=F);q=p.copy();q[...,0]+=d[0];q[...,2]+=d[1];q[...,1]-=(n[...,0]*d[0]+n[...,2]*d[1])/np.maximum(n[...,1],F(.1))
  total+=reference(q,n,coast)*F(weight)
 protection=center['protection']*sm(112,144,coast)*(1-sm(.12,.42,center['slope']))*(1-sm(.18,.58,center['rock']))
 delta=(total-center['Q'])*protection[...,None]
 return dict(center=center['Q'],filtered=total,delta=delta,protection=protection)
def captured(pose,pixels):
 def read(mode):return np.asarray(Image.open(ROOT/'input/diagnostic'/('candidate-'+pose+'-'+mode+'.png')).convert('RGB')).astype(np.int64)
 vals=[];x,y=pixels.T
 for mode in ['world-x','world-y','world-z','coast-distance']:
  a=read(mode)[y,x];code=a[:,0]*65536+a[:,1]*256+a[:,2];vals.append(((-128 if mode=='world-y' else -32768)+(code-1)*(1/4096 if mode=='world-y' else 1/16)).astype(F))
 p=np.stack(vals[:3],-1);n=np.load(ROOT/'input/mesh-cpu'/(pose+'-nominal-normals.npy'))[y,x].astype(F);n=np.where(np.isnan(n),np.array([0,1,0],dtype=F),n);return p,n,vals[3]
def main():
 output=[]
 for pose in ['inland-seam-near','inland-seam-far']:
  a=np.load(ROOT/'results'/('reference-'+pose+'.npz'));native=np.load(ROOT/'results'/('native-'+pose+'.npz'));p,n,coast=captured(pose,a['pixels']);r=reference_fields(p,n,coast);k=kernel(p,n,coast);candidate=native['Q']+k['delta'];old=native['Q'];linear_range=[float(candidate.min()),float(candidate.max())]
  # Adjacent same-row sampled pixel edges, with each membership represented once.
  px={tuple(v):i for i,v in reversed(list(enumerate(a['pixels'])))};edges=[(i,px[x+1,y]) for (x,y),i in px.items() if (x+1,y) in px];i,j=np.array(edges).T
  d=np.linalg.norm(p[j]-p[i],axis=-1);valid=d>1e-6;i=i[valid];j=j[valid];d=d[valid]
  bgrad=np.linalg.norm(k['center'][j]-k['center'][i],axis=-1)/d;cgrad=np.linalg.norm((k['center']+k['delta'])[j]-(k['center']+k['delta'])[i],axis=-1)/d
  row={'pose':pose,'memberships':len(p),'centerPMaxDifference':float(abs(r['P']-a['P']).max()),'centerQMaxDifference':float(abs(r['Q']-a['Q']).max()),'nonzeroDeltaMemberships':int(np.any(abs(k['delta'])>1e-7,axis=1).sum()),'maxLinearDelta':float(abs(k['delta']).max()),'candidateLinearRange':linear_range,'candidateOutsideLinearUnitRange':int(np.any((candidate<0)|(candidate>1),axis=1).sum()),'broadGradientEdges':len(i),'broadGradientMeanBefore':float(bgrad.mean()),'broadGradientMeanAfter':float(cgrad.mean()),'broadGradientMaxBefore':float(bgrad.max()),'broadGradientMaxAfter':float(cgrad.max()),'nativeDetailCarryMaxError':float(abs((candidate-(k['center']+k['delta']))-(old-k['center'])).max())};output.append(row)
  np.savez_compressed(Path(__file__).parent/(pose+'-kernel.npz'),pixels=a['pixels'],position=p,normal=n,coast=coast,Q0=k['center'],kernelQ0=k['filtered'],delta=k['delta'],nativeQ=old,candidateQ=candidate,protection=k['protection'])
 report={'schema':'H_EARTH_COMPLETE_REFERENCE_KERNEL_CPU_PROTOTYPE_v1','radiusMeters':12,'kernel':'5tap 0.5 center + 0.125 four cardinals','source':'Exact existing Float32 source transcription with qualified f0 substitutions','groups':output,'limits':['Existing source normal/sampler assumptions retained.','Neighbors use center tangent plane and constant normal/coast; no geometry reconstruction or physical conservation.','Gradient stats cover archived sampled adjacent image pixels only, not full world.','No actual-image acceptance or GPU execution.']};(Path(__file__).parent/'report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
