import unittest,itertools,copy
import numpy as np
from classify_material import STAGES,coefficient_bound,decompose,trace_arrays,differential_quad,rank_edges,ranking_eligible

def build_trace(ops):
 a=np.ones(3);b=np.zeros(3);rows=[]
 for name,(g,v) in zip(STAGES,ops):
  g=np.asarray(g,float);v=np.asarray(v,float)
  if name=='material-margin':a=a+g;b=b+v;row=dict(id=name,addA=g.tolist(),addB=v.tolist())
  else:a=g*a;b=g*b+v;row=dict(id=name,gain=g.tolist(),bias=v.tolist())
  row.update(A=a.tolist(),B=b.tolist());rows.append(row)
 return rows

def identity_ops():return [(np.zeros(3) if n=='material-margin' else np.ones(3),np.zeros(3)) for n in STAGES]

class ClassificationTests(unittest.TestCase):
 def test_bound_matches_cube_corners(self):
  rng=np.random.default_rng(30001);corners=np.array(list(itertools.product([0,1],repeat=3)))
  for _ in range(500):
   a,b=rng.normal(size=(2,3));self.assertAlmostEqual(coefficient_bound(a,b),abs(corners*a+b).max(),places=14)
  with self.assertRaises(ValueError):coefficient_bound([0,0,np.nan],[0,0,0])
 def test_attribution_conservation_and_orientation(self):
  rng=np.random.default_rng(30002)
  for _ in range(250):
   L=build_trace([(rng.uniform(0,1.2,3),rng.uniform(-.2,.2,3)) for _ in STAGES]);R=build_trace([(rng.uniform(0,1.2,3),rng.uniform(-.2,.2,3)) for _ in STAGES])
   terms=decompose(L,R);delta=np.array([R[-1]['A'],R[-1]['B']])-np.array([L[-1]['A'],L[-1]['B']])
   np.testing.assert_allclose(terms.sum(0),delta,atol=1e-12);np.testing.assert_allclose(decompose(R,L),-terms,atol=1e-12)
 def test_constant_late_layer_attenuates_without_own_contribution(self):
  lo=identity_ops();ro=identity_ops();ro[0]=([.5]*3,[.2]*3);lo[-2]=ro[-2]=([.25]*3,[.1]*3)
  parts=decompose(build_trace(lo),build_trace(ro));np.testing.assert_array_equal(parts[-2],np.zeros((2,3)));np.testing.assert_allclose(parts[0],[[-.125]*3,[.05]*3])
 def test_signed_cancellation(self):
  lo=identity_ops();ro=identity_ops();ro[0]=([1]*3,[.2]*3);ro[1]=([1]*3,[-.2]*3)
  parts=decompose(build_trace(lo),build_trace(ro));self.assertGreater(sum(coefficient_bound(*p) for p in parts),.39);self.assertEqual(coefficient_bound(*parts.sum(0)),0)
 def test_bad_order_nonfinite_and_forged_stage_rejected(self):
  rows=build_trace(identity_ops());bad=copy.deepcopy(rows);bad[0],bad[1]=bad[1],bad[0]
  with self.assertRaises(ValueError):decompose(rows,bad)
  bad=copy.deepcopy(rows);bad[0]['A'][0]=np.nan
  with self.assertRaises(ValueError):decompose(rows,bad)
  bad=copy.deepcopy(rows);bad[0]['B'][0]=.3
  with self.assertRaises(ValueError):decompose(rows,bad)
 def test_parent_quad_selected_lane_and_extrapolation(self):
  tri=np.array([[0,0,0],[1,.2,0],[0,.4,1]],float);p=np.array([.45,.27,.45])
  for lane in range(4):
   q,w,outside=differential_quad(p,tri,lane);np.testing.assert_array_equal(q[lane],p);self.assertEqual(outside,int((w.min(axis=1)<-1e-8).sum()))
  self.assertGreater(differential_quad(p,tri,0)[2],0)
 def test_unsupported_centers_never_enter_rank(self):
  good=dict(single_owner=True,nonsoil_support=False,helper_count=0,parent_options=1,model_uncertainty=False)
  self.assertTrue(ranking_eligible(**good))
  for k,v in [('single_owner',False),('nonsoil_support',True),('helper_count',1),('parent_options',2),('model_uncertainty',True)]:
   bad=dict(good);bad[k]=v;self.assertFalse(ranking_eligible(**bad))
 def test_adjacency_ties_and_eligibility(self):
  n=512;coords=np.array([[i%256,i//256] for i in range(n)],float);world=np.c_[coords[:,0],np.zeros(n),coords[:,1]]
  c,d,o=[np.repeat(a[None],n,axis=0) for a in trace_arrays({'stages':build_trace(identity_ops())})];eligible=np.ones(n,bool);owners=['a']*n
  rows,counts,_=rank_edges(coords,world,c,d,o,eligible,owners,top=1000);edges=[tuple(r['gridIndices']) for r in rows]
  self.assertNotIn((255,256),edges);self.assertIn((0,256),edges);self.assertEqual(counts['allGridNeighborEdges'],766);self.assertEqual(edges,sorted(edges))
  eligible[0]=False;owners[1]='b';rows,counts,_=rank_edges(coords,world,c,d,o,eligible,owners,top=1000)
  self.assertFalse(any(0 in r['gridIndices'] or 1 in r['gridIndices'] for r in rows));self.assertGreater(counts['excludedEndpointSupport'],0);self.assertGreater(counts['excludedDifferentSurfaceOwners'],0)
if __name__=='__main__':unittest.main()
