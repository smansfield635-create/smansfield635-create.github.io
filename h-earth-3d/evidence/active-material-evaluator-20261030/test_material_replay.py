"""Replay exact material fixtures and reject missing resident texture operands."""
from pathlib import Path
import copy,json,unittest
import numpy as np
from material_stages import evaluate_material
HERE=Path(__file__).resolve().parent
class ReplayTests(unittest.TestCase):
    def test_all_committed_records_replay_exactly(self):
        report=json.loads((HERE/'ordered-material.json').read_text())
        self.assertEqual(report['status'],'CONDITIONAL_CPU_COEFFICIENTS_ONLY')
        self.assertEqual(report['capturedPixelCount'],15)
        self.assertEqual(report['syntheticProbeCount'],3)
        for record in report['records']:
            reads=iter(record['textureReads']);count=0
            def sample(name,uv):
                nonlocal count
                r=next(reads);count+=1
                self.assertEqual(r['name'],name)
                np.testing.assert_array_equal(r['uv'],uv)
                return r['value']
            actual=evaluate_material(record['inputs'],sample)
            self.assertEqual(actual,record['result'])
            self.assertEqual(count,len(record['textureReads']))
            self.assertEqual(actual['substrate'],'PRE_IDENTITY_MATERIAL_MARGIN_SUBSTRATE')
            self.assertNotIn('finalRGB',actual)

    def test_nonzero_resident_fields_are_not_implicitly_zero(self):
        report=json.loads((HERE/'ordered-material.json').read_text())
        active=[r for r in report['records'] if r['textureReads']]
        self.assertEqual({r['surface'] for r in active},{'ERODED_TERRAIN','MOUNTAIN_OVERBURDEN'})
        for r in active:
            with self.assertRaisesRegex(ValueError,'TEXTURE_SAMPLER_REQUIRED'):
                evaluate_material(r['inputs'],None)
            zero=evaluate_material(r['inputs'],lambda *_:0.)
            self.assertFalse(np.array_equal(zero['coefficients']['B'],r['result']['coefficients']['B']))

    def test_captured_pixels_use_matching_quad_lane(self):
        report=json.loads((HERE/'ordered-material.json').read_text())
        count=0
        for r in report['records']:
            if r['kind']!='CAPTURED_PIXEL':continue
            count+=1;i=r['inputs'];lane=r['evaluatedPixelLane']
            np.testing.assert_array_equal(i['world'],i['quadWorld'][lane])
            self.assertGreater(np.linalg.norm(np.array(i['world'])-r['requestedWorld']),0.)
            self.assertIn(r['surface'],['original-near','original-far'])
            outside=min(r['selectedLaneBarycentricWeights']) < -1e-8
            self.assertEqual(outside,r['selectedLaneOutsideParent'])
            if outside:self.assertEqual(r['supportStatus'],'EXTRAPOLATED_PARENT_PLANE')
        self.assertEqual(count,15)
        self.assertEqual(report['capturedSelectedLanesOutsideParent'],1)

    def test_complete_order_is_preserved(self):
        expected=['environmental-identity','groundcover','corrected-atlas','material-margin','manor-stone','manor-contact','manor-terrace','manor-additive','site-b','steep-bank','sand','shoreline-root-soil','woodland-litter','habitat','bank-gravel']
        for r in json.loads((HERE/'ordered-material.json').read_text())['records']:
            self.assertEqual([s['id'] for s in r['result']['stages']],expected)
if __name__=='__main__':unittest.main()
