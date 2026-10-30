"""Local algebra/geometry regressions for bounded sand trace."""
import unittest
import numpy as np
from trace_sand import clip_triangle,slope_upper,clustered,factors

class SandTraceTests(unittest.TestCase):
    def test_segment_clip_crossing_reverse_tangent_miss(self):
        tri=np.array([[0,0,0],[2,0,0],[0,0,2]],float)
        np.testing.assert_allclose(clip_triangle([-1,.5],[3,.5],tri),[.25,.625])
        np.testing.assert_allclose(clip_triangle([3,.5],[-1,.5],tri),[.375,.75])
        np.testing.assert_allclose(clip_triangle([-1,2],[1,2],tri),[.5,.5])
        self.assertIsNone(clip_triangle([-1,3],[3,3],tri))
    def test_conservative_slope_bound(self):
        normals=np.array([[.08,.99,.02],[-.03,.98,.07]])
        samples=np.array([normals[0]*(1-t)+normals[1]*t for t in np.linspace(0,1,101)])
        actual=1-samples[:,1]/np.linalg.norm(samples,axis=1)
        self.assertGreaterEqual(slope_upper(normals),actual.max())
        self.assertEqual(slope_upper([[0,-1,0],[0,1,0]]),1)
    def test_join_clustering(self):
        self.assertEqual(clustered([0,.5,.5+1e-16,1]),[0,.5,1])
    def test_sand_reduction_and_nonreduction(self):
        inp=dict(contactDistance=-.5,coastDistance=12,world=[-165,0,-128])
        f=factors(inp,.003)
        self.assertEqual(f['coverage'],.5)
        self.assertLess(factors(inp,.1)['coverage'],.5)
        inp['contactDistance']=-1
        self.assertEqual(factors(inp,.003)['coverage'],0)

if __name__=='__main__':unittest.main()
