import sys,importlib.util,json,numpy as np
from pathlib import Path
from scipy.ndimage import map_coordinates
root=Path('/workspace/scratch/a96b8ab32ba2/boundary-reconciliation');spec=importlib.util.spec_from_file_location('dense',root/'dense_source_coefficients.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
a=np.load('/tmp/full-material-repair/far-spatial-margin-f16.npz');x=np.arange(-213,-165+.01,.25);z=np.arange(-759,-711+.01,.25);xx,zz=np.meshgrid(x,z);xz=np.c_[xx.ravel(),zz.ravel()];counts,offsets,_=m.owners(xz);valid=counts==1
p,n,coast=m.point_attributes(xz[valid],offsets[valid]);c,meta=m.coefficients(p,n,coast,offsets[valid],'inland-seam-far')
C=np.full((len(xz),4),np.nan);C[valid]=c;C=C.reshape(*xx.shape,4)
delta=np.stack([map_coordinates(a['delta'][...,k],[(zz+759)/.5,(xx+213)/.5],order=1,mode='nearest') for k in range(4)],-1)
P=a['referenceP'];disp=lambda q:np.maximum(q*1.12,0)**(1/2.2)*255
q0=disp(C[...,:1]*P+C[...,1:]);q1=disp((C+delta)[...,:1]*P+(C+delta)[...,1:]);mask=valid.reshape(xx.shape);active=np.any(delta!=0,axis=-1)
def grad(q):
 dz,dx=np.gradient(q,.25,axis=(0,1));return np.sqrt(dx*dx+dz*dz).max(-1)
g0,g1=grad(q0),grad(q1)
report={'sampleStepMeters':.25,'actualSourceReevaluated':True,'originalAtlasSampled':True,'uniqueOwnerPoints':int(valid.sum()),'ambiguousPoints':int((counts>1).sum()),'activeMaxGradientBefore':float(np.nanmax(g0[active])),'activeMaxGradientAfter':float(np.nanmax(g1[active])),'globalMaxGradientBefore':float(np.nanmax(g0)),'globalMaxGradientAfter':float(np.nanmax(g1)),'maxDisplayChange':float(np.nanmax(abs(q1-q0))),'limits':'Finite differences on quarter-metre original-source grid, not continuous derivative certificate or GPU equivalence.'}
Path('/tmp/full-material-repair/independent-source-check.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
