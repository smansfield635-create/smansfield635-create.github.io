import re,json,numpy as np,hashlib,sys
from pathlib import Path
from PIL import Image
ROOT=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else Path(__file__).resolve().parent.parent;r=ROOT/'repo/showroom/globe/h-earth/render';t=(r/'persistent-live-renderer.run8e-r3c.cp2-additive-bandlimited-relief-v2.js').read_text();m=json.loads(re.search(r'const CORRECTED_MANIFEST=(\{.*?\});',t).group(1));charts={c['sourceOffset']:c for c in m['charts']};aa=[np.asarray(Image.open(r/'corrected-material-v1'/a['file']),dtype=float) for a in m['atlases']];ss=json.loads((ROOT/'recovered/paired/input/mesh-cpu/surface-samples.json').read_text());world={(s['pose'],*s['pixel']):s['world'] for s in ss}
def sample(c,x,z):
 a=aa[c['atlasIndex']];u=(x-c['originXZ'][0])/.25+c['atlasX'];v=(z-c['originXZ'][1])/.25+c['atlasY'];i,j=int(np.floor(u)),int(np.floor(v));fx,fz=u-i,v-j
 n=lambda x,z:a[max(0,min(a.shape[0]-1,z)),max(0,min(a.shape[1]-1,x))]
 return ((n(i,j)*(1-fx)+n(i+1,j)*fx)*(1-fz)+(n(i,j+1)*(1-fx)+n(i+1,j+1)*fx)*fz-128)/1024
report={'scope':'Read-only native Q plus current production atlas sampled at archived XZ; excludes later overlays, actual live draw ownership, lighting and GPU numerical parity. Not current final-pixel truth.','poses':[]}
for side in ['near','far']:
 pose='inland-seam-'+side;a=np.load(ROOT/f'recovered/paired/results/native-{pose}.npz');d=np.array([sample(charts[int(o)],world[(pose,*xy)][0],world[(pose,*xy)][2]) for xy,o in zip(a['pixels'],a['offsets'])]);q=a['Q'].astype(float);qc=q+d;np.savez(ROOT/f'boundary-reconciliation/current-atlas-{side}.npz',pixels=a['pixels'],offsets=a['offsets'],delta=d);lookup={}
 for i,xy in enumerate(a['pixels']):lookup.setdefault(tuple(xy),[]).append(i)
 pairs=[];maxerr=0
 for xy,ii in lookup.items():
  for dx,dy in [(1,0),(0,1)]:
   for i in ii:
    for j in lookup.get((xy[0]+dx,xy[1]+dy),[]):
     A=lambda k:(a[k][i].astype(float)+a[k][j].astype(float))/2
     D=lambda k:a[k][j].astype(float)-a[k][i].astype(float)
     dq=(1-A('wG'))*((1-A('wI'))*D('P')+A('wI')*D('TI')+(A('TI')-A('P'))*D('wI'))+A('wG')*D('TG')+(A('TG')-A('I'))*D('wG')
     maxerr=max(maxerr,float(abs(dq-D('Q')).max()))
     if a['offsets'][i]!=a['offsets'][j]:continue
     display=lambda x:np.clip(x*1.12,0,1)**(1/2.2)*255
     pairs.append({'pixels':[a['pixels'][i].tolist(),a['pixels'][j].tolist()],'offset':int(a['offsets'][i]),'distanceMeters':float(np.linalg.norm(np.array(world[(pose,*a['pixels'][i])])-world[(pose,*a['pixels'][j])])),'nativeDisplayDelta':float(abs(display(q[j])-display(q[i])).max()),'atlasAdjustedDisplayDelta':float(abs(display(qc[j])-display(qc[i])).max()),'atlasDeltaDifference':(d[j]-d[i]).tolist()})
 p={'pose':pose,'samples':sum(s['pose']==pose for s in ss),'memberships':len(d),'coveredMemberships':len(d),'exactNeutralMemberships':int(np.all(abs(d)<1e-12,axis=1).sum()),'maxAtlasLinearDelta':float(abs(d).max()),'sameTrianglePairs':len(pairs),'independentMixClosureMax':maxerr,'nativePercentiles':np.percentile([p['nativeDisplayDelta'] for p in pairs],[50,90,99,100]).tolist(),'atlasAdjustedPercentiles':np.percentile([p['atlasAdjustedDisplayDelta'] for p in pairs],[50,90,99,100]).tolist(),'topNative':sorted(pairs,key=lambda p:p['nativeDisplayDelta'],reverse=True)[:3],'topAdjusted':sorted(pairs,key=lambda p:p['atlasAdjustedDisplayDelta'],reverse=True)[:3]};report['poses'].append(p)
# Adjacent chart/native source edge neutrality using exact uploaded mesh.
pos=np.fromfile(ROOT/'recovered/paired/input/mesh-cpu/upload-positions.bin',dtype='<f4').reshape(-1,3);idx=np.fromfile(ROOT/'recovered/paired/input/mesh-cpu/upload-indices.bin',dtype='<u4');edges={}
for o in range(0,len(idx),3):
 v=idx[o:o+3]
 for k in range(3):
  key=tuple(sorted((int(v[k]),int(v[(k+1)%3]))));edges.setdefault(key,[]).append(o)
checks=[]
for (i,j),owners in edges.items():
 selected=[o for o in owners if o in charts];native=[o for o in owners if o not in charts]
 if not selected or not native:continue
 for o in selected:
  for f in [0,.25,.5,.75,1]:
   p=pos[i]*(1-f)+pos[j]*f;delta=sample(charts[o],float(p[0]),float(p[2]));checks.append(float(abs(delta).max()))
report['chartNativeBoundaryProbe']={'sharedSourceEdges':len(checks)//5,'samples':len(checks),'maxAbsLinearDelta':max(checks,default=None),'nonNeutralSamples':sum(x>1e-10 for x in checks),'note':'Same indexed-edge topology only, five points per selected chart edge; does not cover geometric T-junctions or draw-retired faces.'}
(ROOT/'boundary-reconciliation/atlas-coverage-check.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
