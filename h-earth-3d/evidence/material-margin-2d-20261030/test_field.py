"""Reproduce rejection evidence. Passing this suite does NOT qualify a repair."""
import unittest
import numpy as np
from field import reconstruct_field
class RejectionRegressions(unittest.TestCase):
 def test_invalid_payload_counterexample_still_detected(self):
  axis=np.arange(-24,24.01,.5);z,x=np.meshgrid(axis,axis,indexing="ij")
  c=np.zeros(x.shape+(4,));c[...,0]=.3;c[...,1:]=[.08,.06,.04];c[...,1:]+=(x+z>10)[...,None]*[.1,.07,.035]
  valid=np.ones(x.shape,bool);valid[(abs(x)<.01)&(abs(z)<.01)]=False
  a=c.copy();b=c.copy();a[~valid,1:]=0;b[~valid,1:]=100
  va,_,_=reconstruct_field(a,.5,valid);vb,_,_=reconstruct_field(b,.5,valid)
  self.assertGreater(abs(va[valid]-vb[valid]).max(),1e-5)
 def test_harmonic_fixed_cores_do_not_preserve_circle(self):
  half_radius=np.sqrt(14.*26.)
  self.assertLess(half_radius,20.)
  self.assertAlmostEqual(1-half_radius**2/20**2,.09)
if __name__=="__main__":unittest.main()
