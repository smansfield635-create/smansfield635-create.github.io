from __future__ import annotations
from pathlib import Path
import json, subprocess, sys, unittest
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'python'))
from lineage_receipt_protocol_v1 import create_receipt, verify_receipt  # noqa:E402

class CrossLanguage(unittest.TestCase):
    def node(self,op,value):
        p=subprocess.run(['node',str(ROOT/'javascript/lrpv1_cli.mjs'),op],input=json.dumps(value,ensure_ascii=False),text=True,capture_output=True,check=True)
        return json.loads(p.stdout)
    def test_python_to_javascript(self):
        r=create_receipt({'consumer':'python','unicode':{'😀':'ok','€':'euro'},'state':[1,True,None,'stable']})
        v=self.node('verify',r); self.assertEqual(v['state'],'VALID'); self.assertEqual(v['computed_digest'],r['lineage_digest'])
    def test_javascript_to_python(self):
        r=self.node('create',{'consumer':'javascript','config':{'attempt':7,'mode':'test'},'result':'PASS'})
        v=verify_receipt(r); self.assertEqual(v['state'],'VALID'); self.assertEqual(v['computed_digest'],r['lineage_digest'])

if __name__=='__main__': unittest.main()
