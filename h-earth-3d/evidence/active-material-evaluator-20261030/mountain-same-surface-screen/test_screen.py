import json,unittest
from pathlib import Path
R=json.loads((Path(__file__).parent/'portable_report.json').read_text())
class SourceTriageTests(unittest.TestCase):
 def test_custody(self):
  self.assertEqual(R['sourceHead'],'cb57c275b95d0d48883bc4da4dcfcf17cbec5060')
  self.assertEqual(R['sha256']['mesh'],'5bfce62703c70fd5b68e894fca8634e5206c1ca681d7a127c192312a8e06aa3c')
 def test_historical_scope(self):
  self.assertIn('old published Gen2928',' '.join(R['limitations']))
 def test_counts(self):
  n=R['overview'];self.assertEqual([n[k] for k in ['candidatesConsidered','preliminaryContinuous','continuousUnderPointOneMetres','continuousPointOneToOneMetre','continuousOneToFiveMetres','preliminaryContinuousHighPostworldsoilContrastAtMeaningfulSpan']],[354,305,273,0,32,0])
 def test_close_texture_not_macro_cut(self):
  q=next(s for s in R['screenPairs'] if s['pair']==[[344,968],[350,968]])
  self.assertLess(q['worldSeparationMeters'],.02)
  self.assertGreater(q['stages']['post-worldsoil-unlit']['magnitude'],39)
 def test_grazing_source_triangle(self):
  q=next(s for s in R['screenPairs'] if s['pair']==[[259,144],[265,144]])
  self.assertEqual(q['surfaceHits'][0]['triangleOffset'],q['surfaceHits'][1]['triangleOffset'])
  self.assertGreater(q['worldSeparationMeters'],3)
  self.assertLess(q['stages']['post-worldsoil-unlit']['magnitude'],20)
if __name__=='__main__':unittest.main()