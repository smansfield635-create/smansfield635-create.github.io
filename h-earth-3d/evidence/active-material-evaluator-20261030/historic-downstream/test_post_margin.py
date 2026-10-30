import unittest,sys,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent))
from prove_later import run,source_guards
class TestSourceGates(unittest.TestCase):
 def test_original_contact_source_result(self):
  r=run(); self.assertEqual(r['contactReplayStats']['contactSegments'],434)
 def test_contact_saturation(self):
  r=run();self.assertEqual(r['contactReplayStats']['saturationMeters'],64)
 def test_no_manor(self):
  self.assertTrue(source_guards(-188.875,14.75,-736.0625,64)['stageInactivity']['manorFourOps'])
 def test_no_site_b(self):
  self.assertTrue(source_guards(-188.875,14.75,-736.0625,64)['stageInactivity']['siteB'])
 def test_no_hillside_and_sand(self):
  r=source_guards(-189.0625,14.73,-734.5625,64);self.assertTrue(r['stageInactivity']['steepBank'] and r['stageInactivity']['sand'])
 def test_no_shoreline_litter(self):
  r=source_guards(-189.0625,14.73,-734.5625,64);self.assertTrue(r['stageInactivity']['shorelineRootSoil'] and r['stageInactivity']['woodlandLitter'])
 def test_no_habitat_and_gravel(self):
  r=source_guards(-189.0625,14.73,-734.5625,64);self.assertTrue(r['stageInactivity']['habitat'] and r['stageInactivity']['bankGravel'])
 def test_near_far_both(self):
  r=run();self.assertEqual([c['sourceOffsets'] for c in r['cases']],[[144,144],[73902,144]])
 def test_fail_open_contact(self):
  self.assertFalse(source_guards(-189.0625,14.73,-734.5625,20)['stageInactivity']['sand'])
 def test_active_domain_is_not_universally_zero(self):
  self.assertFalse(source_guards(-70,20,-210,64)['stageInactivity']['steepBank'])
if __name__=='__main__':unittest.main()