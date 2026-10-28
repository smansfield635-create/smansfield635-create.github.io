#!/usr/bin/env python3
"""Source-bound identity-blend analysis. No repair/acceptance claim is emitted."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

SCENE='cb57c275b95d0d48883bc4da4dcfcf17cbec5060'
RENDERER='fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec'
CONTRACT='b0a7b3b01e30fbf38e65a89c7e1b58f976b47a74a27ec7eec15c15bd506acc4b'
MODES=['identity-incoming-color','identity-result-color','identity-target-color','identity-palette-factors-raw','identity-mix-factors-raw','identity-brightness-factors-raw','identity-noise-factors-raw','identity-landform-factors-raw','identity-protection-factors-raw','identity-footprint-raw']
FIELDS=[['coastal','fertile','moist'],['dry','mineral','W'],['variation','tri','near'],['macro','meso','detail'],['basin','slopeResponse','rock'],['inland','grove','heightDry']]
COLORS=np.array([[.390,.248,.148],[.520,.440,.270],[.300,.235,.155],[.235,.188,.130],[.480,.315,.140],[.355,.333,.305]])
STAGES=[('coastal',.74),('fertile',.83),('moist',.88),('dry',.82),('mineral',.92)]

class Interval:
    """Closed, conservative floating point intervals (roundoff padded at gates)."""
    __array_priority__=10000
    def __init__(self,lo,hi=None):
        self.lo=np.asarray(lo,dtype=float); self.hi=np.asarray(lo if hi is None else hi,dtype=float)
        if np.any(self.lo>self.hi): raise ValueError('REVERSED_INTERVAL')
    @staticmethod
    def cast(x): return x if isinstance(x,Interval) else Interval(x)
    def __add__(self,b):
        b=self.cast(b); return Interval(self.lo+b.lo,self.hi+b.hi)
    __radd__=__add__
    def __neg__(self): return Interval(-self.hi,-self.lo)
    def __sub__(self,b): return self+-self.cast(b)
    def __rsub__(self,b): return self.cast(b)+-self
    def __mul__(self,b):
        b=self.cast(b); a=np.stack(np.broadcast_arrays(self.lo*b.lo,self.lo*b.hi,self.hi*b.lo,self.hi*b.hi)); return Interval(a.min(axis=0),a.max(axis=0))
    __rmul__=__mul__
    def __truediv__(self,b):
        b=self.cast(b)
        if np.any((b.lo<=0)&(b.hi>=0)): raise ValueError('INTERVAL_DIVISION_THROUGH_ZERO')
        return self*Interval(1/b.hi,1/b.lo)
    def __getitem__(self,i): return Interval(self.lo[i],self.hi[i])
    def mean(self,axis=0): return Interval(self.lo.mean(axis=axis),self.hi.mean(axis=axis))
    def absolute(self): return Interval(np.where((self.lo<=0)&(self.hi>=0),0,np.minimum(abs(self.lo),abs(self.hi))),np.maximum(abs(self.lo),abs(self.hi)))
    def clamp(self,a=0,b=1): return Interval(np.clip(self.lo,a,b),np.clip(self.hi,a,b))
    def center(self): return (self.lo+self.hi)/2

def raw_interval(code):
    c=np.asarray(code,dtype=float); return Interval(np.maximum(0,c-1)/255,np.minimum(255,c+1)/255)
def color_interval(code):
    i=raw_interval(code); return Interval(i.lo**2.2/1.12,i.hi**2.2/1.12)
def decode_color(code): return (np.asarray(code,dtype=float)/255)**2.2/1.12
def footprint_interval(code):
    e=raw_interval(code)
    with np.errstate(divide='ignore'): return Interval(e.lo/(1-e.lo),e.hi/(1-e.hi))
def clamp(x,a=0,b=1): return x.clamp(a,b) if isinstance(x,Interval) else np.clip(x,a,b)
def absolute(x): return x.absolute() if isinstance(x,Interval) else np.abs(x)
def smoothstep(a,b,x):
    t=clamp((x-a)/(b-a))
    if isinstance(t,Interval): return Interval(t.lo*t.lo*(3-2*t.lo),t.hi*t.hi*(3-2*t.hi))
    return t*t*(3-2*t)
def rgb(x): return x[...,None]
def mean(a,b): return (a+b)*.5

def source_model(f):
    """Faithful identity reconstruction; captured fertile/mineral remain measured roots."""
    m=dict(f)
    m['moistInput']=.70*f['basin']+.43*(1-f['slopeResponse'])*f['fertile']
    m['moist']=clamp(m['moistInput'])
    m['dry']=f['heightDry']*(1-.74*m['moist'])
    k=COLORS[0]; states=[k]
    for (name,scale),target in zip(STAGES,COLORS[1:]):
        a=rgb(m[name]*scale); k=(1-a)*k+a*target; states.append(k)
    m['states']=states; m['B']=k
    m['F']=.86+.22*f['variation']+.06*f['tri']*f['near']
    m['T']=k*rgb(m['F'])
    # Clamp is mathematically inactive: .48 + .2*abs(x-.5) + .08*y <= .66.
    m['contrast']=.48+.20*absolute(f['fertile']-.5)+.08*f['mineral']
    m['U']=f['inland']*(1-f['grove']);m['W']=m['U']*m['contrast']
    return m

def clamp_secant(a,b):
    if isinstance(a,Interval):
        low=np.minimum(a.lo,b.lo); high=np.maximum(a.hi,b.hi)
        inside=(low>=0)&(high<=1); outside=(high<=0)|(low>=1)
        return Interval(np.where(inside,1,0),np.where(outside,0,1))
    delta=b-a
    return np.divide(clamp(b)-clamp(a),delta,out=((mean(a,b)>0)&(mean(a,b)<1)).astype(float),where=delta!=0)

def decompose(p0,p1,f0,f1,details=False):
    """Exact midpoint finite differences, with shared fertile paths collected once."""
    m0=source_model(f0);m1=source_model(f1)
    d=lambda name:f1[name]-f0[name]
    av=lambda name:mean(f0[name],f1[name])
    moist_coeff={
        'basin':.70,
        'slopeResponse':-.43*av('fertile'),
        'fertile':.43*(1-av('slopeResponse'))}
    sec=clamp_secant(m0['moistInput'],m1['moistInput'])
    moist_coeff={k:v*sec for k,v in moist_coeff.items()}
    dry_coeff={k:-.74*av('heightDry')*v for k,v in moist_coeff.items()}
    dry_coeff['heightDry']=1-.74*mean(m0['moist'],m1['moist'])
    field_coeff={'coastal':{'coastal':1},'fertile':{'fertile':1},'moist':moist_coeff,'dry':dry_coeff,'mineral':{'mineral':1}}
    contributions={};pathways={}
    for j,((name,scale),target) in enumerate(zip(STAGES,COLORS[1:])):
        attenuation=1-rgb(scale*mean(m0[name],m1[name]))
        contributions={k:v*attenuation for k,v in contributions.items()}
        pathways={k:v*attenuation for k,v in pathways.items()}
        coeff=scale*(target-mean(m0['states'][j],m1['states'][j]))
        for root,sensitivity in field_coeff[name].items():
            term=coeff*rgb(sensitivity*d(root))
            contributions[root]=contributions.get(root,0)+term
            pathways['palette_'+name+'__'+root]=term
    bmean=mean(m0['B'],m1['B']); fmean=mean(m0['F'],m1['F'])
    contributions={k:v*rgb(fmean) for k,v in contributions.items()}
    pathways={k:v*rgb(fmean) for k,v in pathways.items()}
    contributions['variation']=bmean*rgb(.22*d('variation'))
    contributions['tri']=bmean*rgb(.06*av('near')*d('tri'))
    contributions['near']=bmean*rgb(.06*av('tri')*d('near'))
    for k in ['variation','tri','near']:pathways['brightness__'+k]=contributions[k]
    wmean=mean(m0['W'],m1['W']); targetmean=mean(m0['T'],m1['T']); pmean=mean(p0,p1)
    contributions={k:v*rgb(wmean) for k,v in contributions.items()}
    pathways={k:v*rgb(wmean) for k,v in pathways.items()}
    contributions['incoming_soil']=(1-rgb(wmean))*(p1-p0)
    pathways['incoming_soil']=contributions['incoming_soil']
    weight_factor=targetmean-pmean
    # Recursive U*contrast: actual endpoint meanU preserves third-order cross term.
    wterms={
        'inland':mean(m0['contrast'],m1['contrast'])*(1-av('grove'))*d('inland'),
        'grove':-mean(m0['contrast'],m1['contrast'])*av('inland')*d('grove'),
        'fertile':mean(m0['U'],m1['U'])*.20*(absolute(f1['fertile']-.5)-absolute(f0['fertile']-.5)),
        'mineral':mean(m0['U'],m1['U'])*.08*d('mineral')}
    for k,v in wterms.items():
        term=weight_factor*rgb(v);contributions[k]=contributions.get(k,0)+term;pathways['weight__'+k]=term
    c0=(1-rgb(m0['W']))*p0+rgb(m0['W'])*m0['T']
    c1=(1-rgb(m1['W']))*p1+rgb(m1['W'])*m1['T']
    return (contributions,c1-c0,pathways) if details else (contributions,c1-c0)

def outer(p0,p1,t0,t1,w0,w1):
    return {'incoming_soil':(1-rgb(mean(w0,w1)))*(p1-p0),'target_color':rgb(mean(w0,w1))*(t1-t0),'blend_weight':rgb(w1-w0)*(mean(t0,t1)-mean(p0,p1))}

def consistency(a,b):
    diff=Interval.cast(a)-Interval.cast(b)
    bad=np.any((diff.lo>2e-7)|(diff.hi < -2e-7),axis=-1) if diff.lo.ndim>1 else (diff.lo>2e-7)|(diff.hi < -2e-7)
    return bad

def verify_capture(capture,archive,contract):
    receipt=json.loads((capture/'receipt.json').read_text())
    if receipt.get('errors') or any(r.get('errors') for r in receipt.get('runs',[])):raise ValueError('CAPTURE_REPORTED_ERRORS')
    if receipt.get('result')!='IDENTITY_CAPTURE_COMPLETE_ANALYSIS_PENDING':raise ValueError('CAPTURE_NOT_COMPLETE')
    if receipt.get('sourceProductSha256')!=RENDERER or receipt.get('sceneIdentity',{}).get('sourceHead')!=SCENE:raise ValueError('RECEIPT_SOURCE_IDENTITY')
    if receipt.get('profile')!='IDENTITY_BLEND_DIAGNOSTIC_V1':raise ValueError('WRONG_PROFILE')
    views=receipt.get('views',[])
    if len(views)!=20:raise ValueError('FRAME_COUNT')
    images={}; records={}
    poses={p['name']:p for p in contract['poses']}
    for v in views:
        key=(v['pose']['name'],v['mode'])
        if key in images or key[0] not in poses or key[1] not in MODES:raise ValueError('FRAME_IDENTITY')
        if v['sourceHead']!=SCENE or v['rendererHash']!=RENDERER:raise ValueError('SOURCE_IDENTITY')
        if v['pose']!=poses[key[0]]:raise ValueError('POSE_MISMATCH')
        if v.get('diagnosticApplied')!=MODES.index(v['mode']) or v.get('modeId')!=MODES.index(v['mode']):raise ValueError('MODE_NOT_APPLIED')
        state=v.get('state',{});pose=poses[key[0]]
        if state.get('position')!={k:pose[k] for k in ['x','y','z']} or state.get('yawDegrees')!=pose['yaw'] or state.get('pitchDegrees')!=pose['pitch'] or state.get('verticalFovDegrees')!=56 or state.get('diagnosticObserver') is not True:raise ValueError('ACTUAL_POSE_MISMATCH')
        if v.get('captureMethod')!='PRESERVED_WEBGL_CANVAS_PNG':raise ValueError('CAPTURE_METHOD')
        if len(v.get('cpuSubmitMilliseconds',[]))!=1 or len(v.get('softwareGpuFinishMilliseconds',[]))!=1:raise ValueError('TIMING_SUBMISSION_COUNT')
        if v.get('grassHidden') is not True:raise ValueError('VEGETATION_VISIBILITY')
        if v.get('imageWidth')!=529 or v.get('imageHeight')!=980:raise ValueError('IMAGE_SIZE_RECEIPT')
        if v.get('label')!='candidate':raise ValueError('FRAME_LABEL')
        f=capture/v['image']
        if f.resolve().parent!=capture.resolve():raise ValueError('IMAGE_PATH')
        data=f.read_bytes()
        if hashlib.sha256(data).hexdigest()!=v['imageSha256']:raise ValueError('IMAGE_HASH')
        im=np.array(Image.open(f).convert('RGBA'))
        if im.shape!=(980,529,4):raise ValueError('IMAGE_SIZE')
        images[key]=im;records[key]=v
    for pose in poses:
        vv=[records[pose,m] for m in MODES];ref=vv[0]
        for v in vv:
            if any(v.get(k)!=ref.get(k) for k in ['assetSignature','canvas','expectedCameraPosition']):raise ValueError('FRAME_CUSTODY')
            if v['lastFrame']['cameraPosition']!=ref['lastFrame']['cameraPosition']:raise ValueError('ACTUAL_CAMERA_MISMATCH')
            if any(abs(v['lastFrame']['cameraPosition'][k]-v['expectedCameraPosition'][k])>1e-8 for k in ['x','y','z']):raise ValueError('EXPECTED_CAMERA_MISMATCH')
            if v['lastFrame']['navigationSequence']!=v['state']['sequence']:raise ValueError('FRAME_SEQUENCE')
        if ref['canvas']!={'width':529,'height':980,'cssWidth':540,'cssHeight':1000}:raise ValueError('CANVAS_MISMATCH')
    for ref,mode in zip(contract['archiveCustody']['referenceFrames'],MODES[:2]):
        file=archive/ref['image'];data=file.read_bytes()
        if hashlib.sha256(data).hexdigest()!=ref['imageSha256']:raise ValueError('ARCHIVE_HASH')
        old=np.array(Image.open(file).convert('RGBA'))
        if not np.array_equal(old,images['inland-seam-near',mode]):raise ValueError('ARCHIVED_BOUNDARY_PIXEL_MISMATCH:'+mode)
        v=records['inland-seam-near',mode]
        if v['expectedCameraPosition']!=ref['expectedCameraPosition'] or v['canvas']!=ref['canvas']:raise ValueError('ARCHIVE_CAMERA_MISMATCH')
        if v['assetSignature'].split('|',1)[0]!=ref['assetSignature']:raise ValueError('ARCHIVE_ASSET_MISMATCH')
    return receipt,images

def values_at(images,pose,x,y):
    pixels=[images[pose,m][y,x,:3] for m in MODES]
    p,c,t=[decode_color(a) for a in pixels[:3]]
    pi,ci,ti=[color_interval(a) for a in pixels[:3]]
    f={};fi={}
    for names,a in zip(FIELDS,pixels[3:9]):
        for j,name in enumerate(names):f[name]=a[:,j].astype(float)/255;fi[name]=raw_interval(a[:,j])
    eligible=pixels[9][:,2]==255
    censored=np.any(np.stack([(a==0)|(a==255) for a in pixels[:3]]),axis=(0,2))
    return dict(P=p,C=c,T=t,Pi=pi,Ci=ci,Ti=ti,f=f,fi=fi,eligible=eligible,censored=censored,footprint=pixels[9][:,:2])

def reconstruction_checks(v):
    m=source_model(v['fi']);f=v['fi']
    checks={
        'fertile_from_noise':(smoothstep(.42,.68,.47*f['macro']+.38*f['meso']+.15*f['detail']),f['fertile']),
        'moist_from_fields':(m['moist'],f['moist']),
        'dry_from_fields':(m['dry'],f['dry']),
        'target_from_factors':(m['T'],v['Ti']),
        'weight_from_factors':(m['W'],f['W']),
        'result_from_measured_boundary':((1-rgb(f['W']))*v['Pi']+rgb(f['W'])*v['Ti'],v['Ci']),
        'result_from_source_reconstruction':((1-rgb(m['W']))*v['Pi']+rgb(m['W'])*m['T'],v['Ci'])}
    valid=v['eligible']&~v['censored']
    return {k:int(np.count_nonzero(consistency(a,b)&valid)) for k,(a,b) in checks.items()}

def stats(point,interval):
    point=np.asarray(point);i=Interval.cast(interval)
    return {'signedMeanRGB':point.mean(axis=0).tolist(),'signedMeanRGBInterval':{'lo':i.lo.mean(axis=0).tolist(),'hi':i.hi.mean(axis=0).tolist()},'meanAbsoluteRGB':np.abs(point).mean(axis=0).tolist()}

def group_result(images,pose,xcenter,y0,y1,lag,label):
    yy=np.repeat(np.arange(y0,y1-lag+1),9);xx=np.tile(np.arange(xcenter-4,xcenter+5),y1-y0-lag+1)
    a=values_at(images,pose,xx,yy);b=values_at(images,pose,xx,yy+lag)
    ca,cb=reconstruction_checks(a),reconstruction_checks(b)
    failures={k:ca[k]+cb[k] for k in ca}
    if any(failures.values()):raise ValueError('RECONSTRUCTION_INTERVAL_FAILURE:'+json.dumps({'group':label,'failures':failures}))
    mask=a['eligible']&b['eligible']&~a['censored']&~b['censored']
    out={'label':label,'pose':pose,'xCenter':xcenter,'yInclusive':[y0,y1],'lag':lag,'pairs':len(mask),'eligiblePairs':int(np.count_nonzero(a['eligible']&b['eligible'])),'censoredColorPairs':int(np.count_nonzero(a['censored']|b['censored'])),'validPairs':int(mask.sum()),'reconstructionFailures':failures}
    if not mask.any():out['result']='INCONCLUSIVE_NO_VALID_PAIRS';return out
    def select(v):
        return {k:({n:q[mask] for n,q in val.items()} if k in ['f','fi'] else val[mask]) for k,val in v.items()}
    a,b=select(a),select(b)
    pts,delta,paths=decompose(a['P'],b['P'],a['f'],b['f'],details=True)
    intervals,di,path_i=decompose(a['Pi'],b['Pi'],a['fi'],b['fi'],details=True)
    if np.max(np.abs(sum(pts.values())-delta))>1e-12:raise ValueError('FINITE_DIFFERENCE_IDENTITY_FAILED')
    measured=outer(a['P'],b['P'],a['T'],b['T'],a['f']['W'],b['f']['W'])
    measured_i=outer(a['Pi'],b['Pi'],a['Ti'],b['Ti'],a['fi']['W'],b['fi']['W'])
    observed=b['C']-a['C'];observed_i=b['Ci']-a['Ci']
    out['observedDelta']=stats(observed,observed_i)
    out['outerMeasuredTerms']={k:stats(v,measured_i[k]) for k,v in measured.items()}
    out['sourceRootTerms']={k:stats(v,intervals[k]) for k,v in pts.items()}
    out['sourcePathways']={k:stats(v,path_i[k]) for k,v in paths.items()}
    out['sourceModelDelta']=stats(delta,di)
    out['sourceModelMinusObserved']=stats(delta-observed,di-observed_i)
    out['outerTermsMinusObserved']=stats(sum(measured.values())-observed,sum(measured_i.values())-observed_i)
    # Conservative claim: unique per-channel signed mean absolute contribution only
    # when lower magnitude exceeds every other upper, with no opposite-signed term.
    winners=[]
    for ch in range(3):
        bounds={k:(v.mean().lo[ch],v.mean().hi[ch]) for k,v in intervals.items()}
        magnitudes={k:(0 if lo<=0<=hi else min(abs(lo),abs(hi)),max(abs(lo),abs(hi))) for k,(lo,hi) in bounds.items()}
        candidates=[k for k,(lo,hi) in magnitudes.items() if lo>max(u for j,(_,u) in magnitudes.items() if j!=k)]
        winner=candidates[0] if len(candidates)==1 else None
        if winner:
            lo,hi=bounds[winner];sign=1 if lo>0 else -1
            if any((l<0 if sign>0 else h>0) for k,(l,h) in bounds.items() if k!=winner):winner=None
        winners.append(winner)
    out['channelDominance']=winners
    out['result']='UNIQUE_SIGN_CONSISTENT_MEAN_TERM' if winners[0] is not None and len(set(winners))==1 else 'MIXED_OR_INCONCLUSIVE'
    out['footprint']={}
    for n,col in [('worldUnitsPerPixel',0),('maxTriplanarWorldUnitsPerPixel',1)]:
        codes=np.concatenate([a['footprint'][:,col],b['footprint'][:,col]]);q=footprint_interval(codes)
        out['footprint'][n]={'minimumLower':float(q.lo.min()),'maximumUpper':None if np.isinf(q.hi.max()) else float(q.hi.max()),'unboundedUpperCount':int(np.isinf(q.hi).sum())}
    return out

def analyze(capture,archive,output,contract_path):
    raw=contract_path.read_bytes()
    if hashlib.sha256(raw).hexdigest()!=CONTRACT:raise ValueError('CONTRACT_HASH')
    contract=json.loads(raw);receipt,images=verify_capture(capture,archive,contract)
    groups=[]
    for pose,span in [('inland-seam-near',[260,940]),('inland-seam-far',[470,940])]:
        for x in [132,264,396]:
            for lag in [1,16]:groups.append(group_result(images,pose,x,*span,lag,f'{pose}-x{x}-lag{lag}'))
    for w in contract['analysis']['nearWitnesses']:
        groups.append(group_result(images,'inland-seam-near',w['x'],*w['rows'],1,f"known-witness-x{w['x']}"))
    report={'schema':'H_EARTH_IDENTITY_BLEND_ATTRIBUTION_v1','result':'CAPTURE_AND_NUMERIC_GATES_PASSED_ATTRIBUTION_RECORDED','sceneHead':SCENE,'rendererSha256':RENDERER,'contractSha256':CONTRACT,'receiptSha256':hashlib.sha256((capture/'receipt.json').read_bytes()).hexdigest(),'archiveBoundaryParity':'EXACT_RGBA_MATCH','groups':groups,'interpretation':{'outerMeasuredTerms':'Uses separately quantized captured P/T/W. Its residual against C is retained.','sourceRootTerms':'Reconstructs moisture/dry from measured roots and groups shared fertile palette/moisture/dry/weight paths. Mineral remains the measured mineralExposure root; no unseen raw slope attribution.','sourceModelMinusObserved':'Contains quantization and reconstruction residual; not a hidden attribution term.','dominance':'Conservative per-channel signed-mean bounds, not visual significance. Cancellation or overlapping intervals => MIXED_OR_INCONCLUSIVE.','footprints':'Resolution proxies only; no aliasing proof.','acceptance':'No repair, visual success, device acceptance, or publication claim.'}}
    output.mkdir(parents=True,exist_ok=True);(output/'analysis.json').write_text(json.dumps(report,indent=2,allow_nan=False)+'\n');return report

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--capture-dir',required=True,type=Path);parser.add_argument('--archive-dir',required=True,type=Path);parser.add_argument('--output',required=True,type=Path);parser.add_argument('--contract',type=Path,default=Path(__file__).with_name('diagnostic-contract.json'));args=parser.parse_args()
    try:
        r=analyze(args.capture_dir,args.archive_dir,args.output,args.contract);print(json.dumps({'result':r['result'],'groups':len(r['groups'])}))
    except Exception as e:
        args.output.mkdir(parents=True,exist_ok=True);(args.output/'analysis-failure.json').write_text(json.dumps({'result':'FAIL_CLOSED_NO_CAUSAL_CLAIM','error':str(e)},indent=2)+'\n');raise
