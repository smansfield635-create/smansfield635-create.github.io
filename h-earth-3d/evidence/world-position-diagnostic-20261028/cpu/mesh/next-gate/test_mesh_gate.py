#!/usr/bin/env python3
"""Independent deterministic boundary, seam, triangle and RGB mass tests.

Synthetic fixtures test the implementation, NOT the real H-Earth uploaded geometry.
"""
import unittest
import numpy as np
from mesh_domain_gate import topo,continuous_source_seam,no_duplicate_projected_area,transport,require,source_protected,protected_faces

class MeshGate(unittest.TestCase):
 def fixture(self):
  # Near one 10m boundary, FAR two collinear 5m T-junction neighbors.
  # All original coordinates are 3D and all faces have positive area.
  v=np.array([[0,0,0],[10,0,0],[0,0,10],
              [0,0,0],[5,0,0],[0,0,-10],
              [5,0,0],[10,0,0],[10,0,-10]],float)
  i=np.arange(9,dtype=np.uint32);g={0:'NEAR',3:'FAR',6:'FAR'}
  return v,i,g
 def test_exact_junction_no_area_overlap(self):
  v,i,g=self.fixture();o,vid,verts,area,n,b=topo(v,i,g)
  self.assertEqual(len(b),9)
  links,partial=continuous_source_seam(v,b,g,o,n,require_complete=True)
  self.assertEqual(len(links),2)
  self.assertEqual(len(partial),0)
  self.assertAlmostEqual(sum(x[2] for x in links),10)
  self.assertEqual(len(no_duplicate_projected_area(verts,o,g,{0,1,2})),0)
  self.assertAlmostEqual(area.sum(),100.)
 def test_exposed_partial_seam_fails(self):
  v,i,g=self.fixture();v[7,0]=9.0
  o,vid,verts,area,n,b=topo(v,i,g)
  with self.assertRaisesRegex(ValueError,'PARTIAL_NEAR_FAR_SEAM'):
   continuous_source_seam(v,b,g,o,n,require_complete=True)
 def test_overlapping_near_far_fails(self):
  v,i,g=self.fixture();v[5,2]=2.0
  o,vid,verts,area,n,b=topo(v,i,g)
  self.assertTrue(no_duplicate_projected_area(verts,o,g,{0,1,2}))
 def test_source_protection_regions(self):
  x=np.array([[-139.40268,-210.74617],[0.,-169.],[40.,-180.],[-200.,-800.]],float)
  np.testing.assert_array_equal(source_protected(x),[True,True,True,False])
 def test_zero_area_fails(self):
  v,i,g=self.fixture();v[2]=v[0]
  with self.assertRaisesRegex(ValueError,'DEGENERATE_SOURCE_TRIANGLE'):
   topo(v,i,g)
 def test_nonmanifold_same_primitive_fails(self):
  v=np.array([[0,0,0],[2,0,0],[0,0,2],[0,0,-2],[0,2,0]],float)
  i=np.array([0,1,2,0,1,3,0,1,4],np.uint32)
  with self.assertRaisesRegex(ValueError,'NONMANIFOLD'):
   topo(v,i,{0:'NEAR',3:'NEAR',6:'NEAR'})
 def test_mass_exact_and_protection(self):
  rng=np.random.default_rng(101);N=40
  for k in range(200):
   area=rng.uniform(.2,5,N);P=rng.uniform(.1,.9,(N,3));L=rng.uniform(-.3,.3,(N,3))
   protect=rng.random(N)<.2;edge=[(i,i+1,rng.uniform(.1,9)) for i in range(N-1)]
   Q,L1,m=transport(P,L,area,edge,protect)
   self.assertLess(m['massError'],1e-11)
   self.assertLess(m['protectedChange'],1e-13)
   self.assertGreaterEqual(Q.min(),-1e-13);self.assertLessEqual(Q.max(),1+1e-13)
   self.assertTrue(np.allclose((Q-P),(L1-L),atol=1e-13))
 def test_zero_flux_orientation(self):
  q=np.array([[0,.35,.8],[.8,.34,.1],[.4,.5,.3]]);L=np.array([[.1,1,0],[.5,1,0],[0,1,0]]);a=np.array([1,2,3]);prot=np.zeros(3,bool)
  a1,l1,_=transport(q,L,a,[(0,1,2.),(1,2,3.)],prot)
  a2,l2,_=transport(q,L,a,[(1,0,2.),(2,1,3.)],prot)
  np.testing.assert_allclose(a1,a2,rtol=0,atol=1e-14)
  np.testing.assert_allclose(l1,l2,rtol=0,atol=1e-14)

if __name__=='__main__':unittest.main(verbosity=2)