"""Offline algebra specimen, not a product shader or rendered repair.
Inputs L and R require source qualification; this only tests transport invariants.
"""
import numpy as np,json

def transport(P,L,R,area,edges,conductance,protected):
    Q=P+L+R
    assert np.all(area>0) and np.all((Q>=0)&(Q<=1))
    i,j=edges.T
    s=np.where(protected[i]|protected[j],0.,conductance)
    degree=np.bincount(i,weights=s,minlength=len(area))+np.bincount(j,weights=s,minlength=len(area))
    tau=.5*np.min(area[degree>0]/degree[degree>0]) if np.any(degree>0) else 0.
    flux=tau*s[:,None]*(L[j]-L[i])
    plus=np.zeros_like(Q);minus=np.zeros_like(Q)
    for ids,fs in [(i,flux),(j,-flux)]:
        np.add.at(plus,ids,np.maximum(fs,0));np.add.at(minus,ids,np.maximum(-fs,0))
    rp=np.minimum(1,np.divide(area[:,None]*(1-Q),plus,out=np.ones_like(Q),where=plus>0))
    rn=np.minimum(1,np.divide(area[:,None]*Q,minus,out=np.ones_like(Q),where=minus>0))
    cap=np.where(flux>=0,np.minimum(rp[i],rn[j]),np.minimum(rn[i],rp[j]))
    cap=np.where(flux==0,1.,cap)
    alpha=cap.min(axis=1)
    accepted=flux*alpha[:,None]
    change=np.zeros_like(Q);np.add.at(change,i,accepted);np.add.at(change,j,-accepted)
    Ln=L+change/area[:,None]
    return P+Ln+R,Ln,{'tau':float(tau),'limitedEdges':int((alpha<1).sum())}

if __name__=='__main__':
    rng=np.random.default_rng(2964);checks=[];maxerr=0.;limited=0
    for trial in range(100):
        n=31;Q=rng.uniform(.00001,.99999,(n,3));P=rng.uniform(.02,.4,(n,3));L=rng.uniform(-.8,.8,(n,3));R=Q-P-L
        area=rng.uniform(.02,4,n);edges=np.array([(i,(i+1)%n) for i in range(n)]+[(i,i+4) for i in range(n-4)])
        s=rng.uniform(.01,2,len(edges));protected=np.arange(n)%11==0
        Qn,Ln,stats=transport(P,L,R,area,edges,s,protected)
        err=np.max(abs(np.sum(area[:,None]*(Qn-Q),axis=0)));maxerr=max(maxerr,err);limited+=stats['limitedEdges']
        assert err<1e-12
        assert Qn.min()>-1e-12 and Qn.max()<1+1e-12
        assert np.max(abs(Qn[protected]-Q[protected]))<1e-12
        assert np.max(abs((Qn-P-Ln)-R))<1e-12
        perm=rng.permutation(len(edges));Qp,_,_=transport(P,L,R,area,edges[perm,::-1],s[perm],protected)
        assert np.max(abs(Qp-Qn))<1e-12
    out={'schema':'H_EARTH_OFFLINE_CONSERVATIVE_TRANSPORT_ALGEBRA_v1','result':'ALGEBRA_INVARIANTS_PASS_NOT_SCENE_QUALIFICATION','trials':100,'nodesPerTrial':31,'invariants':['RGB area integral conserved','RGB gamut retained without final clamping','Protected nodes unchanged','Defined full paired residual unchanged','Edge reversal and permutation equivalent within1e-12'],'maximumRGBIntegralError':maxerr,'limitedEdgesAcrossTrials':limited,'sourceSceneEvaluated':False,'visualImprovementEstablished':False,'limits':['Synthetic arithmetic specimens only; these are not terrain samples.','Source-qualified P,L,R,area and graph remain required.','Gamut limiter can prevent sufficient smoothing; no visual success follows from conservation.']}
    print(json.dumps(out,indent=2));open('/tmp/world-offline/algebra-result.json','w').write(json.dumps(out,indent=2)+'\n')
