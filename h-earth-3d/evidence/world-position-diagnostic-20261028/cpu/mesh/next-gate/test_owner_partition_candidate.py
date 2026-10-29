import unittest
import numpy as np
from shapely.geometry import Polygon
from owner_partition_candidate import clip,affine_integral,must

class TestOwnerPartition(unittest.TestCase):
    def setUp(self):
        self.near={1:Polygon([(0,0),(2,0),(2,2),(0,2)])}
        self.far={2:Polygon([(1,0),(3,0),(3,2),(1,2)])}
    def test_retain_near_clip_far(self):
        p,s=clip(self.near,self.far)
        self.assertTrue(p[1].equals(self.near[1]))
        self.assertAlmostEqual(p[2].area,2.)
        self.assertAlmostEqual(s['uniqueUnionXZ'],6.)
        self.assertEqual(s['maxResidualCrossOwnerXZ'],0)
    def test_raw_overlap_not_discarded(self):
        p,s=clip(self.near,self.far)
        self.assertAlmostEqual(s['sourceOverlapXZ'],2.)
        self.assertGreater(s['sourceOverlapXZ'],1e-12)
    def test_missing_overlap_fails(self):
        with self.assertRaisesRegex(ValueError,'POSITIVE_SOURCE_OVERLAP_NOT_PRESERVED'):
            clip(self.near,{2:Polygon([(3,0),(4,0),(4,1),(3,1)])})
    def test_near_self_overlap_fails(self):
        with self.assertRaisesRegex(ValueError,'INTRA_NEAR_OVERLAP'):
            clip({1:self.near[1],3:self.near[1]},self.far)
    def test_far_self_overlap_fails(self):
        with self.assertRaisesRegex(ValueError,'INTRA_FAR_OVERLAP'):
            clip(self.near,{2:self.far[2],3:self.far[2]})
    def test_degenerate_affine_fails(self):
        with self.assertRaisesRegex(ValueError,'DEGENERATE_XZ_SOURCE_FACE'):
            affine_integral(self.near[1],np.array([[0,0,0],[1,0,0],[2,0,0]]),np.ones((3,4)))
    def test_3d_affine_color_area(self):
        xyz=np.array([[0,0,0],[2,2,0],[0,0,2.]],float)
        p=Polygon([(0,0),(2,0),(0,2)])
        ar,c=affine_integral(p,xyz,np.tile([0.2,0.4,0.6,1.],(3,1)))
        self.assertAlmostEqual(ar,2*np.sqrt(2))
        np.testing.assert_allclose(c,ar*np.array([0.2,0.4,0.6,1.]),rtol=1e-13)
    def test_witness_mismatch_fails(self):
        with self.assertRaisesRegex(ValueError,'WITNESS_DRIFT'):
            must(2483==2484,'WITNESS_DRIFT')

if __name__=='__main__':unittest.main()
