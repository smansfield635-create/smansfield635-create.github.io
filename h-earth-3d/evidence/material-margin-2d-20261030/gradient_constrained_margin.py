"""Offline minimax slope construction on the predeclared safe correction basis.
Fixed interiors and baseline half-coverage contour equalities; no palette change.
"""
from pathlib import Path
import json,time
import numpy as np
from scipy.sparse import coo_matrix
from scipy.optimize import linprog
import contourpy
from basis_safe_margin import supported_vertices,encode_rg8
R=Path(__file__).parent;p=np.load(R/'adaptive-habitat.npz');base=p['baseline'];h,w=base.shape
safe,cells=supported_vertices(p['distance'],p['insideBand'],p['outsideBand'],p['alpha']);n=int(safe.sum());ids=np.full((h,w),-1,int);ids[safe]=np.arange(n)
rows=[];cols=[];data=[];rhs=[];row=0
# Axial and diagonal secants bound slope without selecting a preferred direction.
for oz,ox in [(0,1),(1,0),(1,1),(1,-1)]:
 z0=max(0,-oz);z1=min(h,h-oz);x0=max(0,-ox);x1=min(w,w-ox)
 a=ids[z0:z1,x0:x1].ravel();b=ids[z0+oz:z1+oz,x0+ox:x1+ox].ravel();delta=(base[z0:z1,x0:x1]-base[z0+oz:z1+oz,x0+ox:x1+ox]).ravel();keep=(a>=0)|(b>=0);a,b,delta=a[keep],b[keep],delta[keep];length=.5*np.hypot(oz,ox)
 for ai,bi,d in zip(a,b,delta):
  for sign in [1.,-1.]:
   if ai>=0:rows.append(row);cols.append(ai);data.append(sign)
   if bi>=0:rows.append(row);cols.append(bi);data.append(-sign)
   rows.append(row);cols.append(n);data.append(-length);rhs.append(-sign*d);row+=1
# Bound the same central-gradient metric used by qualification, in16 directions.
for zz in range(1,h-1):
 for xx in range(1,w-1):
  locations=[(zz,xx+1),(zz,xx-1),(zz+1,xx),(zz-1,xx)]
  if not any(ids[z0,x0]>=0 for z0,x0 in locations):continue
  for theta in np.arange(8)*np.pi/8:
   coeff=[np.cos(theta),-np.cos(theta),np.sin(theta),-np.sin(theta)]
   fixed=sum(a*base[z0,x0] for a,(z0,x0) in zip(coeff,locations))
   for sign in [1.,-1.]:
    for a,(z0,x0) in zip(coeff,locations):
     if ids[z0,x0]>=0:rows.append(row);cols.append(ids[z0,x0]);data.append(sign*a)
    rows.append(row);cols.append(n);data.append(-1.);rhs.append(-sign*fixed);row+=1
A=coo_matrix((data,(rows,cols)),shape=(row,n+1)).tocsr()
# Baseline interface remains fixed at its bilinear positions. This constrains
# interpolation rather than freezing all adjacent texels and retaining a step.
er=[];ec=[];ev=[];count=0
curves=contourpy.contour_generator(x=p['x'],y=p['z'],z=base,line_type='Separate').lines(.5)
for curve in curves:
 for X,Z in curve:
  fx=(X-p['x'][0])/.5;fz=(Z-p['z'][0])/.5;ix=min(w-2,int(np.floor(fx)));iz=min(h-2,int(np.floor(fz)));u=fx-ix;v=fz-iz
  terms=[(ids[iz,ix],(1-u)*(1-v)),(ids[iz,ix+1],u*(1-v)),(ids[iz+1,ix],(1-u)*v),(ids[iz+1,ix+1],u*v)]
  terms=[(i,a) for i,a in terms if i>=0 and a>1e-12]
  if terms:
   for i,a in terms:er.append(count);ec.append(i);ev.append(a)
   count+=1
E=coo_matrix((ev,(er,ec)),shape=(count,n+1)).tocsr()
# Retain half-coverage membership at original grid vertices as well as contours.
G=base[safe];lower=np.where(G>=.5,.5-G,-G);upper=np.where(G<.5,.5-G,1-G)
bounds=list(zip(np.maximum(lower,-255/1024),np.minimum(upper,255/1024)))+[(0,None)]
objective=np.zeros(n+1);objective[-1]=1
start=time.monotonic();sol=linprog(objective,A_ub=A,b_ub=rhs,A_eq=E,b_eq=np.zeros(count),bounds=bounds,method='highs',options={'time_limit':45})
report={'solver':'SCIPY_HIGHS_MINIMAX_AXIAL_DIAGONAL_SLOPES','variables':n,'inequalities':row,'contourEqualities':count,'success':bool(sol.success),'message':sol.message,'seconds':time.monotonic()-start,'runtimeIntegrated':False}
if sol.success:
 from scipy.sparse import hstack,vstack,eye,csr_matrix
 optimum=sol.x[-1]
 # Lexicographic second phase: retain optimal slope, minimize total alteration.
 # This removes arbitrary large changes in underdetermined LP solutions.
 I=eye(n,format='csr');zero=csr_matrix((n,1));B=hstack([I,zero,-I],format='csr')
 Bneg=hstack([-I,zero,-I],format='csr')
 AA=vstack([hstack([A,csr_matrix((A.shape[0],n))]),B,Bneg],format='csr')
 EE=hstack([E,csr_matrix((E.shape[0],n))],format='csr')
 obj=np.r_[np.zeros(n+1),np.ones(n)]
 second=linprog(obj,A_ub=AA,b_ub=np.r_[rhs,np.zeros(2*n)],A_eq=EE,b_eq=np.zeros(count),bounds=bounds[:-1]+[(0,optimum+1e-9)]+[(0,None)]*n,method='highs',options={'time_limit':45})
 report['minimumChangePhaseSuccess']=bool(second.success)
 if not second.success:raise RuntimeError(second.message)
 sol.x=second.x[:n+1]
 c=np.zeros_like(base);c[safe]=sol.x[:-1];rg=encode_rg8(c);q=(rg[...,0].astype(float)-rg[...,1].astype(float))/1024
 grad=lambda a:np.hypot(*np.gradient(a,.5));g0=grad(base);g1=grad(base+q);active=p['active'];report.update(minimaxSlope=float(sol.x[-1]),activeGradientMaxBaseline=float(g0[active].max()),activeGradientMaxCandidate=float(g1[active].max()),maxCorrection=float(abs(q).max()),changedVertices=int((q!=0).sum()),prequantizedContourResidual=float(abs(E@sol.x).max(initial=0)),quantizationMaxError=float(abs(q-c).max()))
 np.savez_compressed(R/'gradient-constrained-margin.npz',correction=q,floatCorrection=c,rg8=rg,safeVertices=safe)
(R/'gradient-constrained-margin.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
