"""Source-width asymmetric habitat margins; independent successor to rejected6m bridge.
Current sigma2 outside supported bands remains exact. No product renderer edits.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from scipy.ndimage import map_coordinates,label
from scipy.spatial import cKDTree
ROOT=Path(__file__).resolve().parent.parent;INPUT=ROOT/'habitat-core-input';OUT=Path(__file__).resolve().parent
STEP=.5;MAX_BAND=6.;CORE_FRACTION=.5;MIN_THICKNESS=4.;TAPER=3.;CENTER_SLOPE_FACTOR=.85
old=np.load(OUT/'signed-distance-habitat.npz');x=old['x'];z=old['z'];N=old['native'];G=old['baseline'];V=old['contourVertices'];S=old['contourSegments'];xx,zz=np.meshgrid(x,z);world=np.stack([xx,zz],-1);bounds=np.array([x[0],z[0],x[-1],z[-1]])
h=json.loads((INPUT/'manifest-habitat.json').read_text());dx,dz=(bounds[2:]-bounds[:2])/192
native=np.fromfile(INPUT/'native-atlas.bin',dtype='u1').reshape(192,576)[:,384:].astype(float)/255
baseline=np.fromfile(INPUT/'sigma2-atlas.bin',dtype='u1').reshape(192,576)[:,384:].astype(float)/255

def sample(a,p):
 p=np.asarray(p);q=p.reshape(-1,2);co=np.array([(q[:,1]-bounds[1])/dz-.5,(q[:,0]-bounds[0])/dx-.5]);return map_coordinates(a,co,order=1,mode='nearest',prefilter=False).reshape(p.shape[:-1])
def smooth(t):t=np.clip(t,0,1);return t*t*t*(10+t*(-15+6*t))
SA=V[S[:,0]];SB=V[S[:,1]];SD=SB-SA;L2=np.sum(SD*SD,1);tree=cKDTree((SA+SB)/2)
def nearest(p):
 q=np.asarray(p).reshape(-1,2);distance=np.empty(len(q));idx=np.empty(len(q),int);fraction=np.empty(len(q))
 for start in range(0,len(q),20000):
  p=q[start:start+20000];_,choices=tree.query(p,k=min(12,len(S)));a=SA[choices];v=SD[choices];t=np.clip(np.sum((p[:,None,:]-a)*v,-1)/L2[choices],0,1);d2=np.sum((p[:,None,:]-a-t[:,:,None]*v)**2,-1);which=np.argmin(d2,1);row=np.arange(len(p));distance[start:start+len(p)]=np.sqrt(d2[row,which]);idx[start:start+len(p)]=choices[row,which];fraction[start:start+len(p)]=t[row,which]
 return distance,idx,fraction
# Continuous normals at polygon vertices; orient toward native highcoverage.
tangent=np.zeros_like(V)
for a,b in S:
 d=V[b]-V[a];d/=np.linalg.norm(d);tangent[a]+=d;tangent[b]+=d
tangent/=np.maximum(np.linalg.norm(tangent,axis=1,keepdims=True),1e-20);VN=np.column_stack([-tangent[:,1],tangent[:,0]]);VN[sample(native,V+.2*VN)<sample(native,V-.2*VN)]*=-1
rays=np.arange(.25,24.001,.25)
def thickness(direction,high):
 p=V[:,None,:]+direction*VN[:,None,:]*rays[None,:,None];value=sample(native,p);outside=np.any((p<bounds[:2])|(p>bounds[2:]),2);opposite=(value<.5) if high else(value>=.5);hit=opposite|outside;first=np.argmax(hit,1);found=hit.any(1);width=np.where(found,rays[first],24.)
 # The bracket is explicit0.25m; conservatively use its lower limit.
 width=np.maximum(0,width-.25);return width,found
high_width,high_found=thickness(1,True);low_width,low_found=thickness(-1,False)
# Quarterwidth on each side preserves the central half of a local stripe.
bh=np.minimum(MAX_BAND,.25*high_width);bl=np.minimum(MAX_BAND,.25*low_width)
plus=V+bh[:,None]*VN;minus=V-bl[:,None]*VN
H=sample(baseline,plus);L=sample(baseline,minus)
step=.125
slope=lambda p:(sample(baseline,p+step*VN)-sample(baseline,p-step*VN))/(2*step)
mh=slope(plus);ml=slope(minus);mcenter=slope(V)
dh=(H-.5)/np.maximum(bh,1e-20);dl=(.5-L)/np.maximum(bl,1e-20)
qualified=(high_width>=MIN_THICKNESS)&(low_width>=MIN_THICKNESS)&(H>.5)&(L<.5)&(mh>=0)&(ml>=0)&(mh<=3*dh)&(ml<=3*dl)
# Shared NONZERO derivative at the interface; monotone-Hermite sufficient bound.
m0=np.maximum(0,np.minimum(CENTER_SLOPE_FACTOR*mcenter,1.5*np.minimum(dl,dh)))
m0=np.minimum(m0,np.sqrt(np.maximum(0,9*dl*dl-ml*ml)));m0=np.minimum(m0,np.sqrt(np.maximum(0,9*dh*dh-mh*mh)))
qualified&=m0>0
bad_distance=cKDTree(V[~qualified]).query(V)[0] if (~qualified).any() else np.full(len(V),TAPER)
W=smooth(bad_distance/TAPER);W[~qualified]=0
D,SI,T=nearest(world);D=D.reshape(N.shape);SI=SI.reshape(N.shape);T=T.reshape(N.shape);signed=np.where(N>=.5,D,-D)
interp=lambda a:a[S[SI,0]]*(1-T)+a[S[SI,1]]*T
BHI=interp(bh);BLO=interp(bl);HH=interp(H);LL=interp(L);MH=interp(mh);ML=interp(ml);M0=interp(m0)
alpha=interp(W);panel_edge=np.minimum.reduce([xx-bounds[0],bounds[2]-xx,zz-bounds[1],bounds[3]-zz]);domain=smooth((xx-94)/6)*smooth((panel_edge-7)/5);alpha*=domain

def hermite(t,a,b,ma,mb,length):
 t=np.clip(t,0,1);return(2*t**3-3*t*t+1)*a+(t**3-2*t*t+t)*length*ma+(-2*t**3+3*t*t)*b+(t**3-t*t)*length*mb
high_target=hermite(D/np.maximum(BHI,1e-20),.5,HH,M0,MH,BHI)
low_target=hermite(1-D/np.maximum(BLO,1e-20),LL,.5,ML,M0,BLO)
endwidth=np.where(signed>=0,BHI,BLO);target=np.where(signed>=0,high_target,low_target)
# Smoothly kill residual due interpolation of curved endpoint data; the source
# endpoint slopes are matched before this compact numerical support correction.
shoulder=1-smooth((D/endwidth-.75)/.25);weight=alpha*shoulder;active=(D<endwidth)&(weight>0)
C=G.copy();C[active]+=weight[active]*(target[active]-G[active]);correction=C-G
assert np.array_equal(C[~active],G[~active]);assert np.isfinite(C).all();assert C.min()>=0 and C.max()<=1
# This signed correction is a .5m grid. Its actual bilinear support includes
# neighboring cells. Certify unchanged *whole areas* after that support halo.
from scipy.ndimage import maximum_filter
basis_support=maximum_filter((correction!=0).astype('u1'),size=3,mode='constant')>0
frozen_continuous=~basis_support
# Dense0.25m sampling verifies actual correction texture reconstruction.
xf=np.arange(x[0],x[-1]+.125,.25);zf=np.arange(z[0],z[-1]+.125,.25)
# At this refinement exact zeros outside bilinear support are structural; retain
# support mask and test all coarse cell centers/midpoints in chunks.
max_outside=0.;qchanged=0
for i in range(0,len(zf),64):
 X,Z=np.meshgrid(xf,zf[i:i+64]);co=np.array([(Z.ravel()-z[0])/STEP,(X.ravel()-x[0])/STEP]);delta=map_coordinates(correction,co,order=1,mode='nearest',prefilter=False);mask=map_coordinates(basis_support.astype(float),co,order=0,mode='nearest',prefilter=False)>0;max_outside=max(max_outside,float(abs(delta[~mask]).max(initial=0)));qchanged+=int((abs(delta)>1e-14).sum())
# Recorded selectededge profile and local source-width/core measurements.
pz=np.arange(-282.,-252.+.025,.05);pw=np.column_stack([np.full(len(pz),165.6666666667),pz]);pb=sample(baseline,pw);pn=sample(native,pw)
def grid_sample(a,p):return map_coordinates(a,np.array([(p[:,1]-z[0])/STEP,(p[:,0]-x[0])/STEP]),order=1,mode='nearest',prefilter=False)
pc=pb+grid_sample(correction,pw)
local=(pz>=-276)&(pz<=-263);gradient=lambda v:float((abs(np.diff(v))/np.diff(pz))[local[:-1]&local[1:]].max())
selected=np.argmin(np.linalg.norm(V-[165.6666666667,-270.113],axis=1));j=np.argmin(abs(x-165.6666666667))
# Preserve named interior whole rectangle, based on source thickness at selected
# contour; discover certified frozen spans in this local stripe, not a maxpixel.
stripe=(z>-270.2)&(z<-264.0);column_frozen=(~basis_support[:,j])&stripe;ids=np.flatnonzero(column_frozen);spans=[]
for group in np.split(ids,np.flatnonzero(np.diff(ids)>1)+1):
 if len(group):spans.append([float(z[group[0]]),float(z[group[-1]])])
def topo(a):
 _,high=label(a>=.5);low,n=label(a<.5);border=set(np.r_[low[0],low[-1],low[:,0],low[:,-1]]);return {'highComponents':int(high),'lowHoles':sum(i not in border for i in range(1,n+1)),'highCells':int((a>=.5).sum())}
profile={'x':165.6666666667,'nearestContourPoint':V[selected].tolist(),'highThicknessLowerBoundMeters':float(high_width[selected]),'lowThicknessLowerBoundMeters':float(low_width[selected]),'insideBandMeters':float(bh[selected]),'outsideBandMeters':float(bl[selected]),'endpointCoverage':[float(L[selected]),float(H[selected])],'endpointSlopes':[float(ml[selected]),float(mh[selected])],'interfaceSlope':float(m0[selected]),'qualified':bool(qualified[selected]),'taperWeight':float(W[selected]),'baselineMaxGradientPerMeter':gradient(pb),'candidateMaxGradientPerMeter':gradient(pc),'baselineDarkPeak':float(pb[local].max()),'candidateDarkPeak':float(pc[local].max()),'frozenDarkColumnSpansAfterBilinearSupport':spans}
report={'schema':'H_EARTH_ADAPTIVE_ASYMMETRIC_HABITAT_MARGIN_v1','parameters':{'gridStepMeters':STEP,'maxBandMeters':MAX_BAND,'localThicknessRayStepMeters':.25,'sourceCoreFraction':CORE_FRACTION,'minLocalThicknessMeters':MIN_THICKNESS,'rejectedContourTaperMeters':TAPER,'centerSlopeFactor':CENTER_SLOPE_FACTOR},'source':'Final coastal panel and exact current sigma2 baseline','qualifiedContourVertices':int(qualified.sum()),'changedGridCells':int((correction!=0).sum()),'changedQuarterMeterWitnesses':qchanged,'frozenContinuousGridCells':int(frozen_continuous.sum()),'maxOutsideCertifiedBilinearSupportDelta':max_outside,'selectedEdge':profile,'baselineTopology':topo(G),'candidateTopology':topo(C),'disposition':'NUMERICAL_PROTOTYPE_REVIEW_REQUIRED','limits':['Adaptive geometric quarterwidth fixes original central-half regions before texture support. Actual continuous frozen cores include one .5m cell halo and are separately certified.','Normal-ray width is a conservative0.25m bracket, not a whole-world medial-axis guarantee.','Neighboring contour interpolation and compact endpoint residual taper require independent gradient review.','Actual final geographic protection/maxpanel composition not applied; only coastal x>94 and panelmargin>7 eligible.','Signed Float64 correction texture prototype, not uploaded R8 or production GPU format.','P samples are untouched, but final blend coefficient and therefore texture contrast can change inside margins.','No whole-landscape completion or final-light visual acceptance.'],'inputHashes':{str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__),OUT/'signed-distance-habitat.npz',INPUT/'native-atlas.bin',INPUT/'sigma2-atlas.bin']}}
np.savez_compressed(OUT/'adaptive-habitat.npz',x=x,z=z,native=N,baseline=G,candidate=C,correction=correction,active=active,basisSupport=basis_support,frozenContinuous=frozen_continuous,distance=signed,insideBand=BHI,outsideBand=BLO,alpha=alpha,contourVertices=V,contourQualified=qualified,highWidth=high_width,lowWidth=low_width,profileZ=pz,profileNative=pn,profileBaseline=pb,profileCandidate=pc)
(OUT/'adaptive-habitat.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['limits','inputHashes']},indent=2))
