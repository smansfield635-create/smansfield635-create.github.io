import unittest
import numpy as np
from shapely.geometry import Polygon
from owner_partition_candidate import clip,affine_integral,must,local_source_flux,float32_source_tolerance

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
    def test_original_double_owned_area_not_conserved_by_clip(self):
        p,_=clip(self.near,self.far)
        self.assertGreater(sum(q.area for q in {**self.near,**self.far}.values()),sum(q.area for q in p.values()))
    def test_competing_owner_materials_are_not_equal(self):
        p,_=clip(self.near,self.far)
        shape_near=np.array([[0.,0.,0.],[2.,0.,0.],[2.,0.,2.]])
        shape_far=np.array([[1.,0.,0.],[3.,0.,0.],[3.,0.,2.]])
        col_near=np.tile([0.2,0.4,0.6,1.],(3,1))
        col_far=np.tile([0.8,0.1,0.1,1.],(3,1))
        _,n=affine_integral(p[1],shape_near,col_near)
        _,f=affine_integral(p[2],shape_far,col_far)
        self.assertNotAlmostEqual(n[0]/p[1].area,f[0]/p[2].area)
    def test_alpha_integral_tracks_physical_area(self):
        xyz=np.array([[0.,0.,0.],[2.,1.,0.],[0.,0.,2.]])
        ar,col=affine_integral(Polygon([(0,0),(2,0),(0,2)]),xyz,np.tile([0.1,0.2,0.3,1.],(3,1)))
        self.assertAlmostEqual(ar,col[3])
    def flux_fixture(self,zoffset=0, rgb_a=.2,rgb_b=.8,coord_offset=(0.,0.)):
        x,z=coord_offset
        a=np.array([[x,0,z],[x+1,0,z],[x,0,z+1]],float)
        b=np.array([[x+1,zoffset,z],[x+1,zoffset,z+1],[x,zoffset,z+1]],float)
        p={1:Polygon(a[:,[0,2]]),2:Polygon(b[:,[0,2]])}
        c={1:np.tile([rgb_a,.3,.4,1.],(3,1)),2:np.tile([rgb_b,.3,.4,1.],(3,1))}
        return p,{1:a,2:b},c
    def test_local_shared_source_flux_mass_and_gamut(self):
        p,t,c=self.flux_fixture()
        r=local_source_flux(p,t,c,near_source_ids={1})
        self.assertEqual(r['connectedInternalEdges'],1)
        self.assertEqual(r['crossPrimitiveInternalEdges'],1)
        self.assertEqual(r['appliedTransportEdges'],1)
        self.assertLess(r['maxRGBMassConservationError'],1e-11)
        self.assertFalse(r['globalPhysicalClosure'])
    def test_local_flux_rejects_disconnected_height(self):
        p,t,c=self.flux_fixture(zoffset=1.)
        with self.assertRaisesRegex(ValueError,'DISCONNECTED_3D_SOURCE_CONTACT'):
            local_source_flux(p,t,c,near_source_ids={1})
    def test_vertex_contact_is_not_flux_edge(self):
        p,t,c=self.flux_fixture()
        t[2]+=np.array([1.,0.,1.])
        p[2]=Polygon(t[2][:,[0,2]])
        with self.assertRaisesRegex(ValueError,'NO_PHYSICAL_SOURCE_LINKS'):
            local_source_flux(p,t,c)
    def test_protected_source_blocks_flux(self):
        p,t,c=self.flux_fixture(coord_offset=(-139.,-210.))
        r=local_source_flux(p,t,c,near_source_ids={1})
        self.assertEqual(r['protectedSourceFaces'],2)
        self.assertEqual(r['appliedTransportEdges'],0)
        self.assertEqual(r['maxRGBMassConservationError'],0)
    def test_reject_out_of_gamut_source_color(self):
        p,t,c=self.flux_fixture(rgb_b=1.1)
        with self.assertRaisesRegex(ValueError,'SOURCE_RGB_OUTSIDE_GAMUT'):
            local_source_flux(p,t,c)
    def test_original_protected_face_centroid_guard(self):
        # None of the individual vertices enters the grove, but the original
        # mesh gate protects the triangle because its source centroid does.
        a=np.array([[-220.,0.,-270.],[-60.,0.,-270.],[-139.,0.,-140.]])
        from mesh_domain_gate import source_protected
        self.assertFalse(np.any(source_protected(a[:,[0,2]])))
        self.assertTrue(source_protected(a.mean(axis=0)[None,[0,2]])[0])
        b=a+np.array([0.,0.,0.])
        b[1]=a[0];b[0]=a[1];b[2]=np.array([-140.,0.,-360.])
        p={1:Polygon(a[:,[0,2]]),2:Polygon(b[:,[0,2]])}
        # A and B share the original physical edge from a[0] to a[1].
        c={1:np.tile([.2,.3,.4,1.],(3,1)),2:np.tile([.8,.4,.2,1.],(3,1))}
        r=local_source_flux(p,{1:a,2:b},c,near_source_ids={1})
        self.assertGreaterEqual(r['protectedSourceFaces'],1)
        self.assertEqual(r['appliedTransportEdges'],0)
    def test_existing_float32_seam_tolerance(self):
        a=np.array([[0.,0.,-736.],[1.,0.,-736.],[0.,0.,-735.]],float)
        self.assertAlmostEqual(float32_source_tolerance(a,a),2*736.*2**-23)
    def test_witness_mismatch_fails(self):
        with self.assertRaisesRegex(ValueError,'WITNESS_DRIFT'):
            must(2483==2484,'WITNESS_DRIFT')

if __name__=='__main__':unittest.main()
