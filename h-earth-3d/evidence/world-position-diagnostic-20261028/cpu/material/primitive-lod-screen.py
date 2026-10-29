"""Apply the same source-primitive derivative model to every retained sample candidate."""
from pathlib import Path
import json,numpy as np
root=Path(__file__).resolve().parent
mesh=Path('/tmp/mesh-cpu')
samples=json.load(open(mesh/'surface-samples.json'))
receipt=json.load(open('/tmp/diagnostic/receipt.json'))
positions=np.fromfile(mesh/'upload-positions.bin',np.float32).reshape(-1,3).astype(float)
indices=np.fromfile(mesh/'upload-indices.bin',np.uint32)
def localuv(q):
 h=np.linalg.norm(q[...,[0,2]],axis=-1);k=420000*np.arctan2(h,q[...,1]+420000)/h
 return q[...,[0,2]]*k[...,None]*.28
lods={}
for pose in ['inland-seam-near','inland-seam-far']:
 view=next(v for v in receipt['views'] if v['pose']['name']==pose)
 inv=np.linalg.inv(np.array(view['worldActualPacket']['camera']['viewProjectionMatrix'],np.float32).astype(float).reshape(4,4).T)
 for s in samples:
  if s['pose']!=pose:continue
  x,y=s['pixel'];xx,yy=np.meshgrid([x//2*2,x//2*2+1],[y//2*2,y//2*2+1]);rays=[]
  for depth in [0,1]:
   q=np.stack([2*(xx+.5)/529-1,1-2*(yy+.5)/980,np.full_like(xx,depth),np.ones_like(xx)],-1)@inv.T;rays.append(q[...,:3]/q[...,3,None])
  a,b=rays;d=b-a;ls=[]
  for offset in s['candidateOffsets']:
   tri=positions[indices[offset:offset+3]];n=np.cross(tri[1]-tri[0],tri[2]-tri[0]);p=a+d*(np.sum((tri[0]-a)*n,-1)/np.sum(d*n,-1))[...,None];u=localuv(p)
   du=u[y%2,1]-u[y%2,0];dv=u[1,x%2]-u[0,x%2];lod=float(np.clip(np.log2(max(np.linalg.norm(du),np.linalg.norm(dv))*256),0,8));ls.append((offset,lod))
  lods[pose,x,y]=ls
driver=(root/'replay-v2.py').read_text();prefix=driver[:driver.index("scope={'__file__'")];scope={'__file__':str(root/'replay-v2.py')};exec(compile(prefix,str(root/'replay-v2.py'),'exec'),scope);code=scope['code']
injection='''
 candidateReport=[]
 for j,(x,y) in enumerate(zip(xx,yy)):
  choices=[]
  for offset,source_lod in candidate_lods[pose,int(x),int(y)]:
   lo=int(np.floor(source_lod));hi=min(lo+1,8);frac=source_lod-lo
   tex=mix(texlevel(uv[y,x],MIPS[lo]),texlevel(uv[y,x],MIPS[hi]),frac)
   actual=(tex**F(2.2)*F(.75))*tint[y,x]*mix(F(.91),F(1.09),region[y,x])
   pred=mix(pal[y,x],mix(pal[y,x],actual,F(.98)),coverage[y,x])
   display=clamp(pred*F(1.12))**F(1/2.2)*F(255)
   choices.append({'triangleOffset':offset,'lod':source_lod,'predicted':display.tolist(),'absoluteError':abs(display-obs[j]).tolist()})
  candidateReport.append({'pixel':[int(x),int(y)],'choices':choices})
 allCandidateReports.append({'pose':pose,'samples':candidateReport})
'''
needle=' factors={}'
assert code.count(needle)==1;code=code.replace(needle,injection+needle)
scope={'__file__':str(root/'full-p-screen.py'),'candidate_lods':lods,'allCandidateReports':[]};exec(compile(code,str(root/'full-p-screen.py'),'exec'),scope)
groups=[]
for g in scope['allCandidateReports']:
 badAny=[];badAll=[];maxerr=np.zeros(3)
 for s in g['samples']:
  e=np.array([v['absoluteError'] for v in s['choices']]);maxerr=np.maximum(maxerr,e.max(0));bad=np.any(e>1,axis=1)
  if bad.any():badAny.append(s)
  if bad.all():badAll.append(s)
 groups.append({'pose':g['pose'],'samples':len(g['samples']),'anyCandidateBeyondOneCode':len(badAny),'allCandidatesBeyondOneCode':len(badAll),'maximumErrorAcrossAllCandidates':maxerr.tolist(),'exceptions':badAny})
out={'schema':'H_EARTH_SOURCE_PRIMITIVE_LOD_SCREEN_v1','result':'CONDITIONAL_SOURCE_MODEL_SCREEN_NOT_GPU_EQUIVALENCE','groups':groups,'method':'Uniform rule for all2484 samples and every retained source-triangle membership: extrapolate that source triangle to all four quad lanes with immutable uploaded projection, compute inverse-planet UV at each lane, then source-primitive finite derivatives and model LOD. Keep measured center UV, original source palette and round-even mips. No exception-specific stencil and no arbitrary selection among86 ambiguous memberships.','limits':['Absolute nominal ray coordinates previously failed measured-box compatibility; this derivative-only use is an explicit approximation, not certified hardware interpolation.','Round-even mip bytes and implicit LOD algorithm are model assumptions, not hardware readback.','Other procedural normal derivatives remain nominal visible-neighbor approximations.','Passing this descriptive one-code screen does not qualify fine-reference split, conservative integration, product appearance or GPU equivalence.','No GPU/product mutation.']}
(root/'primitive-lod-result.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
