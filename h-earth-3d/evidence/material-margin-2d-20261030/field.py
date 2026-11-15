"""Continuous sampled 2-D material-coefficient margin reconstruction.
The substrate texture is never an input to the filtering operator.
Coefficients are [A, B_current.r, B_current.g, B_current.b], Q=A*P+B_current.
This module does not assert source model or visual qualification.
"""
import numpy as np
from scipy.ndimage import convolve1d, map_coordinates, distance_transform_edt, binary_dilation

def smooth5(t):
    t=np.clip(t,0.,1.)
    return t*t*t*(10+t*(-15+6*t))

def display(v):return np.clip(v*1.12,0,1)**(1/2.2)*255

def _sample(a,xx,zz):
    if a.ndim==2:return map_coordinates(a,[zz,xx],order=1,mode='nearest')
    return np.stack([map_coordinates(a[...,k],[zz,xx],order=1,mode='nearest') for k in range(a.shape[-1])],-1)

def reconstruct_field(coefficients, step, valid=None, reference=(.106451957,.072878853,.034164603), radius=6., threshold=1.):
    c=np.asarray(coefficients,dtype=np.float64)
    if c.ndim!=3 or c.shape[-1]!=4 or not np.isfinite(c).all() or step<=0:raise ValueError('INVALID_FIELD')
    h,w,_=c.shape
    valid=np.ones((h,w),bool) if valid is None else np.asarray(valid,bool)
    if valid.shape!=(h,w):raise ValueError('INVALID_SUPPORT')
    # Outside world-grid bounds counts as unsupported, not replicated terrain.
    distance=distance_transform_edt(np.pad(valid,1,constant_values=False))[1:-1,1:-1]*step
    supported=valid&(distance>radius+step)
    material=display(c[...,:1]*np.asarray(reference)+c[...,1:])
    dz,dx=np.gradient(material,step,axis=(0,1))
    # Largest eigenvector of the RGB spatial structure tensor: a color-sensitive normal.
    xx=(dx*dx).sum(-1);zz=(dz*dz).sum(-1);xz=(dx*dz).sum(-1)
    angle=.5*np.arctan2(2*xz,xx-zz)
    nx,nz=np.cos(angle),np.sin(angle)
    direction=dx*nx[...,None]+dz*nz[...,None]
    strength=np.linalg.norm(direction,axis=-1)
    unit=direction/np.maximum(strength[...,None],1e-20)
    yy,xxgrid=np.mgrid[:h,:w]
    stride=max(1.,step)
    ahead=_sample(strength,xxgrid+nx*stride/step,yy+nz*stride/step)
    behind=_sample(strength,xxgrid-nx*stride/step,yy-nz*stride/step)
    # Concentration excludes constant and gradual linear fields. Symmetric predicate.
    ridge=(strength>=threshold)&(strength>=ahead)&(strength>=behind)&(strength>1.05*.5*(ahead+behind))&supported
    # Full color direction detects reversals even for equal-luminance color patches.
    has_positive=np.zeros((h,w),bool);has_negative=np.zeros((h,w),bool)
    for offset in np.arange(-radius,radius+step*.5,max(step,1.)):
        px=xxgrid+nx*offset/step;pz=yy+nz*offset/step
        sx=_sample(dx,px,pz);sz=_sample(dz,px,pz)
        signed=((sx*nx[...,None]+sz*nz[...,None])*unit).sum(-1)
        has_positive|=signed>.25*strength
        has_negative|=signed<-.25*strength
    opposite=ridge&has_positive&has_negative
    accepted=ridge&~opposite
    # One union support, one correction; overlapping ridges never double-apply.
    to_ridge=distance_transform_edt(~accepted)*step if accepted.any() else np.full((h,w),np.inf)
    weight=1-smooth5((to_ridge-radius*.5)/(radius*.5))
    # Opposing boundaries protect their entire local patch, with continuous shoulders.
    if opposite.any():
        to_opposite=distance_transform_edt(~opposite)*step
        weight*=smooth5((to_opposite-radius)/(radius*.5))
    # Full kernel support is required even when its zero-weight endpoint is off-grid.
    weight*=smooth5((distance-radius-step)/(radius*.5))
    weight[~valid]=0
    extent=int(np.ceil(radius/step))
    axis=np.arange(-extent,extent+1)*step
    # Positive compact C2 kernel; constants and affine coefficient ramps preserved inside.
    kernel=np.maximum(0,1-(axis/radius)**2)**3;kernel/=kernel.sum()
    filtered=convolve1d(convolve1d(c,kernel,axis=0,mode='nearest'),kernel,axis=1,mode='nearest')
    result=c.copy();active=weight>0
    result[active]+=weight[active,None]*(filtered[active]-c[active])
    assert np.array_equal(result[~active],c[~active])
    assert np.isfinite(result).all()
    # Convex weights preserve coefficient extrema of original source support.
    assert np.all(result>=c.min((0,1))-1e-12) and np.all(result<=c.max((0,1))+1e-12)
    return result,{'weight':weight,'ridges':ridge,'acceptedRidges':accepted,'oppositeRidges':opposite,'strength':strength,'valid':valid}, {'ridgeCells':int(ridge.sum()),'acceptedRidgeCells':int(accepted.sum()),'oppositeRidgeCells':int(opposite.sum()),'changedCells':int(np.any(result!=c,axis=-1).sum()),'activeCells':int(active.sum()),'outsideExact':True,'coefficientEnvelopePass':True,'radiusMeters':radius,'stepMeters':step,'locatorThresholdCodesPerMeter':threshold}

def reconstruct_anchored_field(coefficients, step, valid=None, protected=None, reference=(.106451957,.072878853,.034164603), radius=6., threshold=1., iterations=400):
    """Reconstruct a connected 2-D margin while fixing original color interiors.
    Unlike blanket opposite-edge veto, pin each resolved local dark/light interior.
    This allows a narrow patch's margins to change without deleting its interior.
    Positive-neighbor harmonic iteration obeys the coefficient maximum principle.
    """
    from scipy.ndimage import minimum_filter, maximum_filter, convolve
    c=np.asarray(coefficients,dtype=float)
    if c.ndim!=3 or c.shape[-1]!=4 or not np.isfinite(c).all() or step<=0:raise ValueError('INVALID_FIELD')
    h,w,_=c.shape
    valid=np.ones((h,w),bool) if valid is None else np.asarray(valid,bool)
    protected=np.zeros((h,w),bool) if protected is None else np.asarray(protected,bool)
    if valid.shape!=(h,w) or protected.shape!=(h,w):raise ValueError('INVALID_SUPPORT')
    # Invalid payloads cannot affect either the detector or reconstruction.
    work=c.copy();work[~valid]=0
    distance=distance_transform_edt(np.pad(valid,1,constant_values=False))[1:-1,1:-1]*step
    material=display(work[...,:1]*np.asarray(reference)+work[...,1:])
    dz,dx=np.gradient(material,step,axis=(0,1));strength=np.sqrt((dx*dx+dz*dz).sum(-1))
    span=int(np.ceil(radius/step))*2+1
    average=convolve(strength,np.ones((3,3))/9,mode='nearest')
    # Detector is only trusted beyond its actual one-cell derivative halo.
    ridges=(strength>=threshold)&(strength>1.05*average)&(distance>radius+2*step)&~protected
    to_ridge=distance_transform_edt(~ridges)*step if ridges.any() else np.full((h,w),np.inf)
    weight=1-smooth5((to_ridge-radius*.5)/(radius*.5))
    weight*=smooth5((distance-radius-2*step)/(radius*.5))
    weight[~valid|protected]=0
    active=weight>0
    anchors=np.zeros((h,w),bool)
    # Each distinct channel extrema class supplies interior representatives.
    # Flat, unvarying channels cannot make every cell an anchor.
    for k in range(3):
        v=material[...,k];lo=minimum_filter(v,size=span,mode='nearest');hi=maximum_filter(v,size=span,mode='nearest')
        varying=(hi-lo)>1e-7
        for extremum in [lo,hi]:
            area=(abs(v-extremum)<1e-9)&varying&valid
            depth=distance_transform_edt(area)*step
            # A local center of each flat extremum retains its original color.
            center=area&(depth>=maximum_filter(depth,size=3,mode='constant'))&(depth>0)
            anchors|=center
    anchors|=protected
    mobile=active&~anchors
    from scipy.sparse import coo_matrix
    from scipy.sparse.linalg import spsolve
    current=work.copy();locations=np.argwhere(mobile);n=len(locations)
    mapping=np.full((h,w),-1,int);mapping[mobile]=np.arange(n)
    residual=0.
    if n:
        rows=list(range(n));cols=list(range(n));values=[4.]*n;rhs=np.zeros((n,4))
        for i,(z,x) in enumerate(locations):
            for dz,dx in [(0,1),(0,-1),(1,0),(-1,0)]:
                nz,nx=z+dz,x+dx
                if not (0<=nz<h and 0<=nx<w) or not valid[nz,nx]:raise ValueError('UNSUPPORTED_HARMONIC_NEIGHBOR')
                j=mapping[nz,nx]
                if j>=0:rows.append(i);cols.append(j);values.append(-1.)
                else:rhs[i]+=work[nz,nx]
        matrix=coo_matrix((values,(rows,cols)),shape=(n,n)).tocsr()
        solution=spsolve(matrix,rhs);residual=float(abs(matrix@solution-rhs).max())
        if not np.isfinite(solution).all() or residual>1e-10:raise ValueError('HARMONIC_SOLVE_FAILED')
        current[mobile]=solution
    out=c.copy();out[mobile]+=weight[mobile,None]*(current[mobile]-c[mobile])
    assert np.array_equal(out[~mobile],c[~mobile])
    assert np.array_equal(out[anchors],c[anchors])
    assert np.all(out[valid]>=c[valid].min(axis=0)-1e-12) and np.all(out[valid]<=c[valid].max(axis=0)+1e-12)
    return out,{'weight':weight,'ridges':ridges,'anchors':anchors,'valid':valid,'strength':strength}, {'operator':'ANCHORED_2D_MARGIN','radiusMeters':radius,'stepMeters':step,'ridgeCells':int(ridges.sum()),'anchorCells':int((anchors&active).sum()),'changedCells':int(np.any(out!=c,axis=-1).sum()),'solver':'SPARSE_DIRICHLET_DIRECT','equationResidualMax':residual,'outsideExact':True,'anchorsExact':True,'coefficientEnvelopePass':True}
