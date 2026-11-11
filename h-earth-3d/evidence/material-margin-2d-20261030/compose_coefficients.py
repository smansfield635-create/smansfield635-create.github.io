"""Exact affine composition of the existing habitat stage, not GPU/lighting proof."""
import numpy as np

def compose(incoming, habitat_color, coverage):
 c=np.asarray(incoming,float);h=np.asarray(habitat_color,float);t=.68*np.asarray(coverage,float)[...,None]
 return np.concatenate([(1-t)*c[...,:1],(1-t)*c[...,1:]+t*h],axis=-1)

def protection(x,z):
 def sm(a,b,t):
  t=np.clip((t-a)/(b-a),0,1);return t*t*(3-2*t)
 grove=1-sm(22,42,np.hypot(x+139.40268,z+210.74617))
 ox=np.maximum(np.maximum(-18-x,0),x-34);oz=np.maximum(np.maximum(-204-z,0),z+131)
 ex=np.maximum(np.maximum(18-x,0),x-132);ez=np.maximum(np.maximum(-210-z,0),z+125)
 rt=np.clip((z-x+192)/96,0,1);rd=np.hypot(x-(48-48*rt),z-(-144+48*rt))
 return sm(0,12,np.hypot(ox,oz))*sm(0,10,np.hypot(ex,ez))*sm(4,9,rd)*(1-grove)

def verify():
 rng=np.random.default_rng(2992);n=10000
 incoming=rng.uniform(0,.3,(n,4));incoming[:,0]=rng.uniform(0,1,n)
 # B includes an independently varied signed atlas term before this stage.
 atlas=rng.uniform(-.03,.03,(n,3));incoming[:,1:]+=atlas
 P=rng.uniform(0,1,(n,3));H=rng.uniform(0,.5,(n,3));native=rng.uniform(0,1,n)
 old=rng.uniform(0,1,n);new=rng.uniform(0,1,n);g=rng.uniform(0,1,n)
 co=np.clip(native+g*(old-native),0,1);cn=np.clip(native+g*(new-native),0,1)
 a=compose(incoming,H,co);b=compose(incoming,H,cn)
 q=incoming[:,:1]*P+incoming[:,1:]
 expected=(1-.68*cn[:,None])*q+.68*cn[:,None]*H
 actual=b[:,:1]*P+b[:,1:]
 assert np.max(abs(expected-actual))<1e-15
 # Outside the candidate support or where the protection is zero, full result is identical.
 unchanged=compose(incoming,H,co)
 assert np.array_equal(a,unchanged)
 dc=.68*(cn-co)[:,None]
 assert np.max(abs((actual-(a[:,:1]*P+a[:,1:]))-dc*(H-q)))<1e-15
 return {'randomCases':n,'maxAlgebraError':float(np.max(abs(expected-actual))),'atlasCarriedThroughIncomingB':True,'sameOldBaselineSubtracted':True,'PResampledOrBlurred':False,'PContrastPreserved':False,'note':'Coverage changes P multiplier only within admitted band. Algebra for arbitrary incoming coefficients is exact; this is not final-lit or mobile acceptance.'}
if __name__=='__main__':
 import json
 print(json.dumps(verify(),indent=2))
