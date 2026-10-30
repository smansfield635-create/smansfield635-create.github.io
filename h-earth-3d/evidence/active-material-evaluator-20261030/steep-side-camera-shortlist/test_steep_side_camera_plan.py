import json, pathlib, unittest
from steep_side_camera_plan import CAMERAS, Terrain, camera, produce, ARCHIVE_SHA, sha

ARCHIVE=pathlib.Path('/mnt/data/h_earth_native_inputs/H-Earth-corrected-material-application-20261029.zip')
class TestNativeCameraPlan(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.terrain=Terrain(ARCHIVE)
  cls.poses=[camera(cls.terrain,*q) for q in CAMERAS]
 def test_authenticated_mesh(self):
  self.assertEqual(sha(ARCHIVE.read_bytes()),ARCHIVE_SHA)
  self.assertEqual(self.terrain.indices.shape,(20736,3))
 def test_source_endpoints_outside_site_b_geometry_rectangle(self):
  for p in self.poses:
   self.assertGreater(p['cameraXZ'][0],100)
   self.assertGreater(p['targetXZ'][0],100)
 def test_all_three_have_observable_terrain_clearance(self):
  for p in self.poses:self.assertGreater(p['sampledRayMinTerrainClearance'],1.5)
 def test_two_source_geographic_targets(self):
  self.assertEqual(len({tuple(p['targetXZ']) for p in self.poses}),2)
  self.assertGreater(min(p['targetSourceSlope'] for p in self.poses),0.25)
 def test_distinct_observer_headings_and_pitch(self):
  yaws=[p['yawDegrees'] for p in self.poses]
  self.assertEqual(len({round(y) for y in yaws}),3)
  self.assertGreater(max(yaws)-min(yaws),40)
  self.assertTrue(all(-42 <= p['pitchDegrees'] <=32 for p in self.poses))
 def test_same_original_surface_sample_is_reproducible(self):
  for p in self.poses:
   t=self.terrain.sample(*p['targetXZ'])
   self.assertAlmostEqual(t['xyz'][1],p['targetSurfaceXYZ'][1],places=9)
   self.assertEqual(t['sourceTriangle'],p['targetSourceTriangle'])
 def test_ridge_negative_camera_not_recaptured(self):
  self.assertTrue(all(tuple(p['cameraXZ'])!=(88,-260) for p in self.poses))
 def test_no_owner_photo_match_conferred(self):
  self.assertTrue(all(p['ownerPhotoMatch'] is False and p['candidateCurrentSceneRecheckRequired'] for p in self.poses))
if __name__=='__main__':unittest.main()