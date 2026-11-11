"""Exact-partition derivative check: original atlas bilinear + correction bilinear."""
from pathlib import Path
import numpy as np,json,sys
STEM=sys.argv[1] if len(sys.argv)>1 else 'local-gradient-margin'
R=Path(__file__).parent;p=np.load(R/'adaptive-habitat.npz');q=np.load(R/(STEM+'.npz'))['correction'];raw=np.fromfile(R.parent/'habitat-core-input/sigma2-atlas.bin',dtype='u1').reshape(192,576)[:,384:]/255
x,z=p['x'],p['z'];dx=(x[-1]-x[0])/192;dz=(z[-1]-z[0])/192;nx=x[0]+(np.arange(192)+.5)*dx;nz=z[0]+(np.arange(192)+.5)*dz
X=np.unique(np.r_[x[(x>=144)&(x<=188)],nx[(nx>=144)&(nx<=188)]]);Z=np.unique(np.r_[z[(z>=-282)&(z<=-250)],nz[(nz>=-282)&(nz<=-250)]])
def deriv(a,X,Z,ox,oz,sx,sz):
 fx=(X-ox)/sx;fz=(Z-oz)/sz;i=np.floor(fx).astype(int);j=np.floor(fz).astype(int);u=fx-i;v=fz-j
 a00=a[j,i];a10=a[j,i+1];a01=a[j+1,i];a11=a[j+1,i+1]
 return ((a10-a00)*(1-v)+(a11-a01)*v)/sx,((a01-a00)*(1-u)+(a11-a10)*u)/sz
bmax=cmax=0.;witness=None
for ix in [0,1]:
 for iz in [0,1]:
  # Both one-sided derivatives at every intersection of the two grid partitions.
  xs=X[:-1]+1e-8 if ix==0 else X[1:]-1e-8;zs=Z[:-1]+1e-8 if iz==0 else Z[1:]-1e-8
  xx,zz=np.meshgrid(xs,zs);bx,bz=deriv(raw,xx,zz,nx[0],nz[0],dx,dz);cx,cz=deriv(q,xx,zz,x[0],z[0],.5,.5)
  bg=np.hypot(bx,bz);cg=np.hypot(bx+cx,bz+cz);bmax=max(bmax,float(bg.max()))
  if cg.max()>cmax:
   k=np.argmax(cg);cmax=float(cg.flat[k]);witness={'x':float(xx.flat[k]),'z':float(zz.flat[k]),'baselineGradient':float(bg.flat[k]),'correctionGradient':[float(cx.flat[k]),float(cz.flat[k])]}
r={'baselineOriginalAtlasMaxGradientInLocalWindow':bmax,'candidateOriginalAtlasPlusCorrectionMaxGradient':cmax,'maxCandidateWitness':witness,'overlayCells':int((len(X)-1)*(len(Z)-1)),'method':'All4one-sidedcorners of originalatlas/correction overlaypartition; epsilon1e-8 insidecells','runtimeQualified':False}
(R/('independent-original-grid-'+STEM+'-review.json')).write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
