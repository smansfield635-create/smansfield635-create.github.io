#!/usr/bin/env python3
"""Independent deterministic boundary, seam, triangle and RGB mass tests.

Synthetic fixtures test the implementation, NOT the real H-Earth uploaded geometry.
"""
import unittest
import numpy as np
from mesh_domain_gate import topo,continuous_source_seam,no_duplicate_projected_area,transport,require,source_protected,protected_faces,select_support

class MeshGate(unittest.TestCase):
 def fixture(self):
  # Near one 10m boundary, FAR two collinear 5m T-junction neighbors.
  # All original coordinates are 3D and all faces have positive area.
  v=np.array([[0,0,0],[10,0,0],[0,0,10],
              [0,0,0],[5,0,0],[0,0,-10],
              [5,0,0],[10,0,0],[10,0,-10]],float)
  i=np.arange(9,dtype=np.uint32);g={0:'NEAR',3:'FAR',6:'FAR'}
  return v,i,g
 def test_large_source_polygon_support_retains_original_seed(self):
  # A 300m-long FAR face covers the source witness despite a distant centroid.
  verts=np.array([[[0.,0.,0.],[300.,0.,0.],[0.,0.,10.]],
                  [[900.,0.,0.],[910.,0.,0.],[900.,0.,10.]]])
  offsets=np.array([0,3],dtype=np.int64)
  sample={'world':[.1,0.,.1],'candidateOffsets':[0]}
  samples=[dict(sample) for _ in range(2484)]
  self.assertGreater(np.linalg.norm(verts[0].mean(axis=0)[[0,2]]-[.1,.1]),48.)
  active,seeds=select_support(verts,offsets,samples)
  self.assertEqual(active,{0})
  self.assertEqual(seeds,{0})
 def test_exact_polygon_support_still_rejects_uncovered_membership(self):
  verts=np.array([[[0.,0.,0.],[300.,0.,0.],[0.,0.,10.]],
                  [[900.,0.,0.],[910.,0.,0.],[900.,0.,10.]]])
  samples=[{'world':[.1,0.,.1],'candidateOffsets':[3]} for _ in range(2484)]
  with self.assertRaisesRegex(ValueError,'SOURCE_SEED_OUTSIDE_SUPPORT'):
   select_support(verts,np.array([0,3],np.int64),samples)
 def test_fail_closed_report_on_missing_exact_upload(self):
  import tempfile,subprocess,json,sys
  from pathlib import Path
  with tempfile.TemporaryDirectory() as root:
   report=Path(root)/'gate.json'
   file=Path(__file__).with_name('mesh_domain_gate.py')
   action=subprocess.run([sys.executable,str(file),'--mesh-dir',root,'--report',str(report)],
                         capture_output=True,text=True)
   self.assertEqual(action.returncode,2,action.stdout+action.stderr)
   result=json.loads(report.read_text())
   self.assertEqual(result['result'],'FAIL_CLOSED')
   self.assertFalse(result['closureQualified'])
   self.assertIn('MISSING_ORIGINAL_UPLOAD_POSITIONS',result['error'])
 def test_exact_junction_no_area_overlap(self):
  v,i,g=self.fixture();o,vid,verts,area,n,b=topo(v,i,g)
  self.assertEqual(len(b),9)
  links,partial,sealed=continuous_source_seam(v,b,g,o,n,require_complete=True)
  self.assertEqual(len(links),2)
  self.assertEqual(len(partial),0)
  self.assertEqual(len(sealed),3)
  self.assertAlmostEqual(sum(x[2] for x in links),10)
  self.assertEqual(len(no_duplicate_projected_area(verts,o,g,{0,1,2})),0)
  self.assertAlmostEqual(area.sum(),100.)
 def test_exposed_partial_seam_fails(self):
  v,i,g=self.fixture();v[7,0]=9.0
  o,vid,verts,area,n,b=topo(v,i,g)
  with self.assertRaisesRegex(ValueError,'PARTIAL_NEAR_FAR_SEAM'):
   continuous_source_seam(v,b,g,o,n,require_complete=True)
 def test_far_partial_seam_rejected(self):
  v,i,g=self.fixture();v[1,0]=9.0
  o,vid,verts,area,n,b=topo(v,i,g)
  with self.assertRaisesRegex(ValueError,'PARTIAL_NEAR_FAR_SEAM'):
   continuous_source_seam(v,b,g,o,n,require_complete=True)
 def test_sealed_edge_not_counted_as_open_cut(self):
  from mesh_domain_gate import boundary_distance
  v,i,g=self.fixture();o,vid,verts,area,n,b=topo(v,i,g)
  links,partial,sealed=continuous_source_seam(v,b,g,o,n,require_complete=True)
  a=boundary_distance(v,o,vid,b,{0,1,2},{0,1},n,verts,sealed,[{'world':[2.,0.,2.]}])
  b2=boundary_distance(v,o,vid,b,{0,1,2},{0,1},n,verts,set(),[{'world':[2.,0.,2.]}])
  self.assertEqual(b2['cutEdges']-a['cutEdges'],3)
 def test_exact_indexed_cut_counts_only_shared_edge(self):
  # Two original indexed NEAR faces share only one crossing edge.
  # Historical overcount added all three edges of the selected face.
  from mesh_domain_gate import boundary_distance
  v=np.array([[0.,0.,0.],[10.,0.,0.],[0.,0.,10.],[10.,0.,10.]])
  i=np.array([0,1,2,1,3,2],np.uint32)
  o,vid,verts,area,n,b=topo(v,i,{0:'NEAR',3:'NEAR'})
  report=boundary_distance(v,o,vid,b,{0},{0},n,verts,set(),
                           [{'world':[5.,0.,5.]}])
  self.assertEqual(report['artificialIndexedCutEdges'],1)
  self.assertEqual(report['originalSourceBoundaryEdges'],2)
  self.assertEqual(report['cutEdges'],3)
  self.assertEqual(report['witnessCount'],1)
  self.assertAlmostEqual(report['minimumActualWitnessToCutMeters'],0.)
  self.assertLess(report['minimumActualWitnessToCutMeters'],40.)
  self.assertEqual(report['unresolvedCrossPrimitiveCuts'],0)
 def test_missing_real_witnesses_fails_closed(self):
  from mesh_domain_gate import boundary_distance
  v,i,g=self.fixture();o,vid,verts,area,n,b=topo(v,i,g)
  with self.assertRaisesRegex(ValueError,'MISSING_ACTUAL_CUT_WITNESSES'):
   boundary_distance(v,o,vid,b,{0},{0},n,verts,set(),[])

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
 def test_gross_flux_adversarial_regression(self):
  # The historical net-budget limiter failed gamut at random seed 1/trial 1.
  rng=np.random.default_rng(1)
  for trial in range(2):
   n=6;area=rng.uniform(.1,2,n);Q=rng.beta(.2,.2,(n,3));L=rng.uniform(-15,15,(n,3))
   edges=[(i,j,float(rng.uniform(.1,10))) for i in range(n) for j in range(i+1,n) if rng.random()<.8]
  changed,coarse,meta=transport(Q,L,area,edges,np.zeros(n,bool))
  self.assertGreaterEqual(changed.min(),-1e-13)
  self.assertLessEqual(changed.max(),1+1e-13)
  self.assertLess(meta['massError'],1e-11)
  np.testing.assert_allclose(changed-Q,coarse-L,rtol=0,atol=1e-13)
 def test_dense_adversarial_gamut_mass_10000(self):
  rng=np.random.default_rng(107)
  for trial in range(10000):
   n=6;area=rng.uniform(.1,2,n);Q=rng.beta(.2,.2,(n,3));L=rng.uniform(-15,15,(n,3));protected=rng.random(n)<.2
   edges=[(i,j,float(rng.uniform(.1,10))) for i in range(n) for j in range(i+1,n) if rng.random()<.8]
   c,k,m=transport(Q,L,area,edges,protected)
   self.assertGreaterEqual(c.min(),-1e-12)
   self.assertLessEqual(c.max(),1+1e-12)
   self.assertLess(m['massError'],5e-12)
   self.assertLess(m['protectedChange'],1e-12)
   np.testing.assert_allclose(c-Q,k-L,rtol=0,atol=1e-12)
 def test_zero_flux_orientation(self):
  q=np.array([[0,.35,.8],[.8,.34,.1],[.4,.5,.3]]);L=np.array([[.1,1,0],[.5,1,0],[0,1,0]]);a=np.array([1,2,3]);prot=np.zeros(3,bool)
  a1,l1,_=transport(q,L,a,[(0,1,2.),(1,2,3.)],prot)
  a2,l2,_=transport(q,L,a,[(1,0,2.),(2,1,3.)],prot)
  np.testing.assert_allclose(a1,a2,rtol=0,atol=1e-14)
  np.testing.assert_allclose(l1,l2,rtol=0,atol=1e-14)

if __name__=='__main__':unittest.main(verbosity=2)