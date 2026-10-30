"""Coastal-only source halfcoverage contour / fixed whole core prototype.
Not production. Existing sigma2 is the baseline. Only an explicit world band moves.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from scipy.ndimage import map_coordinates,label
from scipy.spatial import cKDTree
import contourpy
ROOT=Path(__file__).resolve().parent.parent;INPUT=ROOT/'habitat-core-input';OUT=Path(__file__).resolve().parent
STEP=.5;BAND=6.;ENDPOINT=6.25;TAPER=6.

def smooth(t):
 t=np.clip(t,0,1);return t*t*t*(10+t*(-15+6*t))
h=json.loads((INPUT/'manifest-habitat.json').read_text());bounds=np.array(h['coastal']['bounds'],float);dx,dz=(bounds[2:]-bounds[:2])/192
native=np.fromfile(INPUT/'native-atlas.bin',dtype='u1').reshape(192,576)[:,384:].astype(float)/255
baseline=np.fromfile(INPUT/'sigma2-atlas.bin',dtype='u1').reshape(192,576)[:,384:].astype(float)/255

def sample(a,p):
 p=np.asarray(p);shape=p.shape[:-1];q=p.reshape(-1,2);coords=np.array([(q[:,1]-bounds[1])/dz-.5,(q[:,0]-bounds[0])/dx-.5]);return map_coordinates(a,coords,order=1,mode='nearest',prefilter=False).reshape(shape)
x=np.arange(bounds[0],bounds[2]+STEP/2,STEP);z=np.arange(bounds[1],bounds[3]+STEP/2,STEP);xx,zz=np.meshgrid(x,z);world=np.stack([xx,zz],-1);N=sample(native,world);G=sample(baseline,world)
curves=contourpy.contour_generator(x=x,y=z,z=N,line_type='Separate').lines(.5)
vertices=[];vertex_normals=[];curve_ranges=[];segments=[]
for curve in curves:
 curve=curve[np.r_[True,np.linalg.norm(np.diff(curve,axis=0),axis=1)>1e-10]]
 if len(curve)<3:continue
 closed=np.linalg.norm(curve[0]-curve[-1])<1e-8
 if closed:curve=curve[:-1]
 if len(curve)<3:continue
 prev=np.roll(curve,1,axis=0);nxt=np.roll(curve,-1,axis=0)
 if not closed:prev[0]=curve[0];nxt[-1]=curve[-1]
 tangent=nxt-prev;tangent/=np.maximum(np.linalg.norm(tangent,axis=1,keepdims=True),1e-20);normal=np.column_stack([-tangent[:,1],tangent[:,0]])
 direction=sample(native,curve+.25*normal)-sample(native,curve-.25*normal);normal[direction<0]*=-1
 start=len(vertices);vertices.extend(curve);vertex_normals.extend(normal);curve_ranges.append((start,len(curve),closed))
 segments.extend((start+i,start+(i+1)%len(curve)) for i in range(len(curve) if closed else len(curve)-1))
V=np.array(vertices);VN=np.array(vertex_normals);S=np.array(segments);SA=V[S[:,0]];SB=V[S[:,1]];SD=SB-SA;L2=np.sum(SD*SD,1);tree=cKDTree((SA+SB)/2)

def nearest(p):
 q=np.asarray(p).reshape(-1,2);distance=np.empty(len(q));idx=np.empty(len(q),int);fraction=np.empty(len(q))
 for start in range(0,len(q),20000):
  p=q[start:start+20000];_,choices=tree.query(p,k=min(12,len(S)));choices=np.asarray(choices).reshape(len(p),-1);a=SA[choices];v=SD[choices];t=np.clip(np.sum((p[:,None,:]-a)*v,-1)/L2[choices],0,1);d2=np.sum((p[:,None,:]-a-t[:,:,None]*v)**2,-1);which=np.argmin(d2,1);row=np.arange(len(p));distance[start:start+len(p)]=np.sqrt(d2[row,which]);idx[start:start+len(p)]=choices[row,which];fraction[start:start+len(p)]=t[row,which]
 return distance,idx,fraction
plus=V+ENDPOINT*VN;minus=V-ENDPOINT*VN;dp,_,_=nearest(plus);dm,_,_=nearest(minus)
inside=lambda p:np.all((p>=bounds[:2])&(p<=bounds[2:]),1)
HP=sample(baseline,plus);LP=sample(baseline,minus)
# Both sides must reach a WHOLE existing core, not an isolated point anchor.
# If another boundary intercepts the normal, distance<6 detects a thin feature.
qualified=(dp>=BAND)&(dm>=BAND)&inside(plus)&inside(minus)&(sample(native,plus)>.5)&(sample(native,minus)<.5)&(HP>=.5)&(LP<=.5)
# Continuous vertex weights avoid an abrupt changed/unchanged contour seam.
if (~qualified).any():distance_to_rejected=cKDTree(V[~qualified]).query(V)[0]
else:distance_to_rejected=np.full(len(V),TAPER)
W=smooth(distance_to_rejected/TAPER);W[~qualified]=0
D,SI,T=nearest(world);D=D.reshape(N.shape);SI=SI.reshape(N.shape);T=T.reshape(N.shape)
signed=np.where(N>=.5,D,-D)
interp=lambda a:a[S[SI,0]]*(1-T)+a[S[SI,1]]*T
alpha=interp(W);high=interp(HP);low=interp(LP)
# Exclude every possible ravine/woodland overlap and panel-edge fringe.
panel_edge=np.minimum.reduce([xx-bounds[0],bounds[2]-xx,zz-bounds[1],bounds[3]-zz])
domain=smooth((xx-94)/6)*smooth((panel_edge-7)/5)
alpha*=domain
end=np.where(signed>=0,high,low)
target=.5+(end-.5)*smooth(D/BAND)
# Outer shoulder returns exactly to current baseline with zero derivative.
shoulder=1-smooth((D-4)/2);weight=alpha*shoulder;active=(D<BAND)&(weight>0)
C=G.copy();C[active]+=weight[active]*(target[active]-G[active])
assert np.array_equal(C[~active],G[~active]);assert np.isfinite(C).all() and C.min()>=0 and C.max()<=1
core=D>=BAND;assert np.array_equal(C[core],G[core])
# Count source and baseline halfcoverage regions and holes without hiding changes.
def topology(a):
 _,high_count=label(a>=.5);low,low_count=label(a<.5);border=set(np.r_[low[0],low[-1],low[:,0],low[:,-1]]);holes=sum(i not in border for i in range(1,low_count+1));return {'highComponents':int(high_count),'lowComponents':int(low_count),'enclosedLowHoles':int(holes),'highCells':int((a>=.5).sum())}
# Precisely bracket the previously investigated coastal edge by its source XZ.
profile_z=np.arange(-285.,-250.+.025,.05);profile_world=np.column_stack([np.full(len(profile_z),165.6666666667),profile_z]);profile_native=sample(native,profile_world);profile_base=sample(baseline,profile_world)
def sample_grid(a,p):return map_coordinates(a,np.array([(p[:,1]-z[0])/STEP,(p[:,0]-x[0])/STEP]),order=1,mode='nearest',prefilter=False)
profile_candidate=sample_grid(C,profile_world)
def crossings(v,level):
 ids=np.flatnonzero((v[:-1]-level)*(v[1:]-level)<0);return [float(profile_z[i]+(level-v[i])/(v[i+1]-v[i])*.05) for i in ids]
def width(v):
 mid=crossings(v,.5);center=min(mid,key=lambda q:abs(q+270.1354166667)) if mid else None
 if center is None:return {'center':None,'width10to90':None}
 c10=crossings(v,.1);c90=crossings(v,.9);a=min(c10,key=lambda q:abs(q-center)) if c10 else None;b=min(c90,key=lambda q:abs(q-center)) if c90 else None
 return {'center':center,'width10to90':abs(b-a) if a is not None and b is not None else None}
prof={'x':165.6666666667,'native':width(profile_native),'baseline':width(profile_base),'candidate':width(profile_candidate),'maxGradientPerMeterBaseline':float(abs(np.diff(profile_base)).max()/.05),'maxGradientPerMeterCandidate':float(abs(np.diff(profile_candidate)).max()/.05),'maxAdjacentHalfMeterBaseline':float(abs(profile_base[10:]-profile_base[:-10]).max()),'maxAdjacentHalfMeterCandidate':float(abs(profile_candidate[10:]-profile_candidate[:-10]).max())}
# Bake to the EXISTING192x192 R8 coastal panel; all other panel bytes untouched.
tx=bounds[0]+(np.arange(192)+.5)*dx;tz=bounds[1]+(np.arange(192)+.5)*dz;txx,tzz=np.meshgrid(tx,tz);tw=np.column_stack([txx.ravel(),tzz.ravel()]);td,_,_=nearest(tw);ta=sample_grid(alpha,tw);tbase=baseline.ravel();tc=sample_grid(C,tw);texel_active=(td<BAND)&(ta>0)
packed=np.floor(np.clip(tc,0,1)*255+.5).astype('u1');original=np.floor(tbase*255+.5).astype('u1');packed[~texel_active]=original[~texel_active];R8=sample(packed.reshape(192,192).astype(float)/255,world);profile_r8=sample(packed.reshape(192,192).astype(float)/255,profile_world)
r8_changed=abs(R8-G)>1e-12;outside_error=abs(R8[core]-G[core]);r8_metrics={'changedTexels':int(np.count_nonzero(packed!=original)),'originalTexelCoresAndOutsideExact':bool(np.array_equal(packed[~texel_active],original[~texel_active])),'denseWholeCoreMaxErrorAfterBilinear':float(outside_error.max()),'denseChangedBeyond6m':int((r8_changed&core).sum()),'maxChangedDistanceMeters':float(D[r8_changed].max()) if r8_changed.any() else 0,'topology':topology(R8),'selectedEdge':width(profile_r8),'selectedMaxGradientPerMeter':float(abs(np.diff(profile_r8)).max()/.05),'selectedMaxHalfMeterStep':float(abs(profile_r8[10:]-profile_r8[:-10]).max())}
(OUT/'signed-distance-coastal-r8.bin').write_bytes(packed.tobytes())

# Final material-stage algebra: incoming includes ALL preceding stages/atlas D.
# This is an exact affine identity, not a measurement of current final RGB pixels.
rng=np.random.default_rng(782);incoming=rng.random((1000,3));soil=rng.random((1000,3));g=rng.random(1000);c=rng.random(1000);old=(1-.68*g[:,None])*incoming+.68*g[:,None]*soil;new=(1-.68*c[:,None])*incoming+.68*c[:,None]*soil;error=float(abs((new-old)-.68*(c-g)[:,None]*(soil-incoming)).max());assert error<1e-15
report={'schema':'H_EARTH_COASTAL_SIGNED_DISTANCE_CORE_PROTOTYPE_v1','parameters':{'stepMeters':STEP,'halfBandMeters':BAND,'endpointDistanceMeters':ENDPOINT,'rejectedSpanTaperMeters':TAPER,'outerShoulderMeters':[4,6]},'source':'Authenticated final coastal habitat panel; baseline exact current sigma2 output','gridShape':list(N.shape),'contours':len(curves),'vertices':len(V),'qualifiedVertices':int(qualified.sum()),'rejectedThinUnsupportedVertices':int((~qualified).sum()),'changedCells':int(np.count_nonzero(C!=G)),'wholeCoreExact':bool(np.array_equal(C[core],G[core])),'outsideSupportExact':bool(np.array_equal(C[~active],G[~active])),'maxChangedSourceBoundaryDistance':float(D[C!=G].max()) if (C!=G).any() else 0,'nativeTopology':topology(N),'baselineTopology':topology(G),'candidateTopology':topology(C),'selectedEdgeProfile':prof,'affineStageIdentityError':error,'r8Roundtrip':r8_metrics,'disposition':'REJECT_SELECTED_EDGE_UNCHANGED_AND_R8_CORE_LEAK_IF_NONZERO','limits':['Only coastal panel. Woodland/ravine and inland coefficient mechanism unchanged/open.','Subtexel contour is extracted from the .5m bilinear field; not exact analytic bilinear-isocurve geometry.','Nearest-segment query uses12 nearest midpoints; source contour segments are <=.7072m.','Local two-sided normal endpoint reach protects narrow features conservatively; no claim that all morphological topology cases are solved.','Partial taper regions retain baseline/native mixture and do not promise exact native halfcoverage contour.','Final shader applies geographic protections and max-panel overlap. This prototype has not executed those final composed masks or GPU lighting.','No product source edit, publication or visual qualification.'],'inputHashes':{str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in [Path(__file__),INPUT/'native-atlas.bin',INPUT/'sigma2-atlas.bin',INPUT/'manifest-habitat.json']}}
np.savez_compressed(OUT/'signed-distance-habitat.npz',x=x,z=z,native=N,baseline=G,candidate=C,distance=signed,core=core,active=active,alpha=alpha,contourVertices=V,contourSegments=S,contourQualified=qualified,contourWeights=W,profileZ=profile_z,profileNative=profile_native,profileBaseline=profile_base,profileCandidate=profile_candidate,r8Candidate=R8,coastalR8=packed.reshape(192,192),profileR8=profile_r8,domain=domain)
(OUT/'signed-distance-habitat.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['inputHashes','limits']},indent=2))
