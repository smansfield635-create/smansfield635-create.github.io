"""Bounded FAR full-coefficient margin prototype. No renderer/visual acceptance.
Freeze baseline-defined spatial cores before constructing any correction.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from scipy.ndimage import gaussian_filter,distance_transform_edt,convolve1d,minimum_filter,label
ROOT=Path('/workspace/scratch/a96b8ab32ba2/boundary-reconciliation');OUT=Path(__file__).parent
SOURCE=ROOT/'dense-source-far.npz';STEP=.5;BAND=6.;INNER=3.;FADE_END=5.5
P=np.array([.106451957,.072878853,.034164603])
def smooth(t):
 t=np.clip(t,0,1);return t**3*(10-15*t+6*t*t)
def display(q):return np.maximum(q*1.12,0)**(1/2.2)*255
def safe_vertices(corners):
 cells=corners[:-1,:-1]&corners[1:,:-1]&corners[:-1,1:]&corners[1:,1:]
 v=np.zeros_like(corners);v[1:-1,1:-1]=cells[:-1,:-1]&cells[1:,:-1]&cells[:-1,1:]&cells[1:,1:]
 return v,cells

def main():
 d=np.load(SOURCE);C=d['coefficients'];valid=d['supported'];assert valid.all(), 'This fixed specimen requires complete valid source; no invalid-payload inference'
 Q=C[...,:1]*P+C[...,1:];rgb=display(Q);lum=rgb@np.array([.2126,.7152,.0722])
 # Detection-only one-metre Gaussian; coefficients and P are not used from it.
 macro=gaussian_filter(lum,sigma=1./STEP,mode='reflect');threshold=float(np.median(macro[valid]));dark=macro<threshold
 distance=(distance_transform_edt(dark)-distance_transform_edt(~dark))*STEP
 # Preserve any entire small component unable to hold a six-metre interior.
 skipped=np.zeros_like(valid);small=[]
 for which,mask in [('dark',dark),('light',~dark)]:
  components,n=label(mask)
  for k in range(1,n+1):
   take=components==k
   if np.max(abs(distance[take]))<BAND:skipped|=take;small.append({'class':which,'cells':int(take.sum())})
 core=(abs(distance)>=BAND)|skipped
 edge=distance_transform_edt(np.pad(valid,1))[1:-1,1:-1]*STEP
 domain=(edge>6.5)&valid
 # The SAME baseline inequalities define continuous protected areas.
 # All four corners positive => entire bilinear cell positive; all four
 # incident cells safe => nonzero vertex basis cannot touch protected area.
 allowed=(BAND-distance>0)&(BAND+distance>0)&~skipped&domain
 safe,cells=safe_vertices(allowed)
 weight=(1-smooth((abs(distance)-INNER)/(FADE_END-INNER)))*smooth((edge-6.5)/3)*safe
 axis=np.arange(-12,13)*STEP;kernel=np.maximum(0,1-(axis/6)**2)**3;kernel/=kernel.sum()
 # Positive tensor-product support: square +/-6m, not a six-metre disk.
 support_valid=minimum_filter(valid.astype('u1'),size=25,mode='constant')>0
 weight*=support_valid
 filtered=convolve1d(convolve1d(C,kernel,axis=0,mode='nearest'),kernel,axis=1,mode='nearest')
 delta=weight[...,None]*(filtered-C)
 maximum=float(abs(delta).max());scale=1024
 while maximum*scale>127:scale//=2
 assert scale>=128, 'UNEXPECTED_COEFFICIENT_RANGE'
 encoded=np.clip(np.floor(delta*scale+.5)+128,0,255).astype('u1');decoded=(encoded.astype(float)-128)/scale;candidate=C+decoded
 # Structural continuous-domain support audit AFTER actual RGBA8 encoding.
 changed=np.any(decoded!=0,axis=-1);changed_cells=changed[:-1,:-1]|changed[1:,:-1]|changed[:-1,1:]|changed[1:,1:]
 assert not np.any(changed_cells&~cells)
 assert np.array_equal(candidate[core],C[core]);assert np.array_equal(candidate[~safe],C[~safe])
 assert not changed[0].any() and not changed[-1].any() and not changed[:,0].any() and not changed[:,-1].any()
 def gradients(v):
  gz,gx=np.gradient(v,STEP,axis=(0,1));return np.sqrt(gz*gz+gx*gx).max(-1)
 out=display(candidate[...,:1]*P+candidate[...,1:]);g0,g1=gradients(rgb),gradients(out);active=weight>0
 # Multiple P probes verify the full affine correction; no texture samples averaged.
 probes=[]
 for p in [P,np.array([.2,.18,.12]),np.zeros(3),np.ones(3)]:
  q0=C[...,:1]*p+C[...,1:];q1=candidate[...,:1]*p+candidate[...,1:]
  assert np.array_equal(q0[core],q1[core]);assert np.max(abs(q1-(q0+decoded[...,:1]*p+decoded[...,1:])))<1e-14
  probes.append({'P':p.tolist(),'maxDisplayChange':float(abs(display(q1)-display(q0)).max()),'minLinearQ':float(q1.min()),'maxLinearQ':float(q1.max())})
 j=int(np.argmin(abs(d['x']+189)));sample_rows=[int(np.argmin(abs(d['z']-v))) for v in [-741,-739,-737,-735,-733,-731,-729,-727,-725]]
 profile=[{'z':float(d['z'][i]),'beforeLuminance':float(lum[i,j]),'afterLuminance':float((out@np.array([.2126,.7152,.0722]))[i,j]),'weight':float(weight[i,j]),'core':bool(core[i,j])} for i in sample_rows]
 # Alternative runtime storage: signed RGBA16F, decoded before qualification.
 half=np.asarray(delta,dtype='<f2');decoded16=half.astype(float);candidate16=C+decoded16
 changed16=np.any(decoded16!=0,axis=-1)
 cells16=changed16[:-1,:-1]|changed16[1:,:-1]|changed16[:-1,1:]|changed16[1:,1:]
 assert not np.any(cells16&~cells);assert np.array_equal(candidate16[core],C[core])
 out16=display(candidate16[...,:1]*P+candidate16[...,1:]);g16=gradients(out16)
 half_report={'format':'RGBA16F','uploadType':'HALF_FLOAT','zeroRepresentation':0,'filterRequired':'LINEAR_LEVEL0_NO_MIPMAP','byteLength':half.nbytes,'changedVertices':int(changed16.sum()),'unsafeChangedBilinearCells':int((cells16&~cells).sum()),'coresExact':bool(np.array_equal(candidate16[core],C[core])),'maxQuantizationError':float(abs(decoded16-delta).max()),'maxDisplayChangeDecoded':float(abs(out16-rgb).max()),'activeMaxGradientAfterDecoded':float(g16[active].max()),'globalMaxGradientAfterDecoded':float(g16.max())}
 np.savez_compressed(OUT/'far-spatial-margin-f16.npz',x=d['x'],z=d['z'],baseline=C,candidate=candidate16,deltaFloat=delta,delta=decoded16,halfFloatBits=half.view('<u2'),sourceDarkClass=dark,signedDistance=distance,cores=core,skipped=skipped,safeVertices=safe,safeCells=cells,weight=weight,referenceP=P)
 (OUT/'far-spatial-margin.rgba16f').write_bytes(half.tobytes())
 np.savez_compressed(OUT/'far-spatial-margin.npz',x=d['x'],z=d['z'],baseline=C,candidate=candidate,deltaFloat=delta,delta=decoded,rgba8=encoded,sourceDarkClass=dark,sourceMacroLuminance=macro,signedDistance=distance,cores=core,skipped=skipped,safeVertices=safe,safeCells=cells,weight=weight,referenceP=P,sourceSupported=valid)
 (OUT/'far-spatial-margin.rgba8').write_bytes(encoded.tobytes())
 report={'schema':'H_EARTH_FAR_FULL_COEFFICIENT_SPATIAL_MARGIN_PROTOTYPE_v1','sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'builderSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'bounds':[float(d['x'][0]),float(d['z'][0]),float(d['x'][-1]),float(d['z'][-1])],'stepMeters':STEP,'referenceP':P.tolist(),'maskDefinition':{'detectorGaussianSigmaMeters':1,'fixedBaselineMedianLuminance':threshold,'spatialCoreDistanceMeters':BAND,'fullWeightInsideMeters':INNER,'fadeEndsMeters':FADE_END,'smallComponentsFrozenWhole':small},'kernel':'POSITIVE_SEPARABLE_COMPACT_POLYNOMIAL_SQUARE_PLUS_MINUS6M','encoding':{'format':'RGBA8_SIGNED128','scale':scale,'zeroByte':128,'textureFilterRequired':'LINEAR_LEVEL0_NO_MIPMAP','maxQuantizationError':float(abs(decoded-delta).max())},'darkCoreCells':int((core&dark).sum()),'lightCoreCells':int((core&~dark).sum()),'coresExact':bool(np.array_equal(candidate[core],C[core])),'changedVertices':int(changed.sum()),'activeBeforeQuantization':int(active.sum()),'unsafeChangedBilinearCells':int((changed_cells&~cells).sum()),'maxDisplayChangeDecoded':float(abs(out-rgb).max()),'activeMaxGradientBefore':float(g0[active].max()),'activeMaxGradientAfterDecoded':float(g1[active].max()),'globalMaxGradientBefore':float(g0.max()),'globalMaxGradientAfterDecoded':float(g1.max()),'maxCoefficientCorrectionFloat':maximum,'PProbeResults':probes,'centerProfileX':float(d['x'][j]),'centerProfile':profile,'disposition':'BUILT_REQUIRES_INDEPENDENT_SOURCE_AND_ORIGINAL_ATLAS_PARTITION_REVIEW','builderSelfApproval':False,'runtimeIntegrated':False,'visualAcceptance':False,'limits':['These are source-luminance-defined bounded spatial cores, not universal biome semantics.','Pose-bound dense source coefficients retain existing sampler limitations, including micro-normal derivatives and omitted later layers.','Gradient numbers use decoded correction on sampled full source; original atlas/interpolation partition check is still required.','Exact sampled-coefficient cores and bilinear correction support are preserved; no exact baseline contour claim.','Detection smoothing is not applied to P; material texture contrast can change through DeltaA inside margins.']}
 report['halfFloatAlternative']=half_report
 (OUT/'far-spatial-margin-report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
