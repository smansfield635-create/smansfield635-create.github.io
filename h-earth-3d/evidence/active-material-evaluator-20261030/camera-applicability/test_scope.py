import unittest,os
from pathlib import Path
import source_camera_gate as s
G={'NEAR':{'count':314,'x':[-264.75,-135.5],'z':[-736.75,-639.5]},'FAR':{'count':44,'x':[-429.25,-101.25],'z':[-1111.,-735.5]}}
M={'x':[-213.,-165.],'z':[-759.,-711.]}
class Tests(unittest.TestCase):
 def test_true_historical_support(self):
  x=s.evaluate_groups(G,M);self.assertTrue(x['historic_far_left']['materialMarginSupport']);self.assertTrue(x['historic_far_right']['materialMarginSupport'])
 def test_mountain_outside_atlas(self):
  x=s.evaluate_groups(G,M);self.assertTrue(x['high_foothill_ridge_tie']['atlasDefinitelyOutsideWithOneMetreGuard'])
 def test_mountain_outside_margin(self):
  x=s.evaluate_groups(G,M);self.assertTrue(x['high_foothill_ridge_tie']['materialMarginZeroBySourceLaw'])
 def test_observer_origin_outside_margin(self):
  self.assertFalse(s.within((88,-260),M))
 def test_meadow_coast_control_outside_margin(self):
  for xy in [(-52,-208),(0,-110)]:self.assertFalse(s.within(xy,M))
 def test_reject_expansion_into_mountain(self):
  bad={**M,'x':[-213,150],'z':[-759,-200]};self.assertRaisesRegex(ValueError,'MOUNTAIN_GEOGRAPHY_NOT_OUTSIDE',s.evaluate_groups,G,bad)
 def test_reject_historical_exclusion(self):
  bad={**M,'x':[-100,-80]};self.assertRaisesRegex(ValueError,'HISTORIC_GEOGRAPHY',s.evaluate_groups,G,bad)
 def test_margin_source_guard(self):
  src='vec2 q=(world-vec2(-213.0,-759.0))/vec2(48.0);\nif(any(lessThan(q,vec2(0.0)))||any(greaterThan(q,vec2(1.0))))return vec4(0.0);'
  self.assertEqual(s.margin_bounds(src),M)
  with self.assertRaisesRegex(ValueError,'NOT_PROVEN'):
   s.margin_bounds(src.replace('return vec4(0.0)','return vec4(1.0)'))
 def test_group_extent(self):
  m={'stepMeters':.25,'charts':[{'group':'NEAR','originXZ':[-264.75,-736.75],'width':38,'height':38} for _ in range(314)]+[{'group':'FAR','originXZ':[-429.25,-1111],'width':38,'height':38} for _ in range(44)]}
  self.assertEqual(s.atlas_groups(m)['NEAR']['count'],314)
 @unittest.skipUnless(Path(os.environ.get('HEARTH_HISTORIC_FAR_ZIP','/mnt/data/hearth-12837402038.zip')).exists(),'optional archived GPU ZIP not provided')
 def test_known_historic_archive(self):
  self.assertEqual(s.verify_archive(os.environ.get('HEARTH_HISTORIC_FAR_ZIP','/mnt/data/hearth-12837402038.zip'),'historic_far')['canvas'],[529,980])
 @unittest.skipUnless(Path(os.environ.get('HEARTH_MOUNTAIN_ZIP','/mnt/data/hearth-12783843240.zip')).exists(),'optional archived GPU ZIP not provided')
 def test_known_mountain_archive(self):
  self.assertEqual(s.verify_archive(os.environ.get('HEARTH_MOUNTAIN_ZIP','/mnt/data/hearth-12783843240.zip'),'mountain')['camera']['yaw'],118)
 @unittest.skipUnless(Path(os.environ.get('HEARTH_CURRENT_3POSES_ZIP','/mnt/data/hearth-12991506650.zip')).exists(),'optional archived GPU ZIP not provided')
 def test_known_current_archive(self):
  self.assertEqual(len(s.verify_archive(os.environ.get('HEARTH_CURRENT_3POSES_ZIP','/mnt/data/hearth-12991506650.zip'),'current_3poses')['cameraNames']),3)
if __name__=='__main__':unittest.main()
