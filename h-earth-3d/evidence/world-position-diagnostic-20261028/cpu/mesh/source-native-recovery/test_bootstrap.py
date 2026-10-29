#!/usr/bin/env python3
"""Static and fail-closed CLI tests; not a full source-replay qualification."""
from pathlib import Path
import subprocess, tempfile, unittest
ROOT=Path(__file__).resolve().parent
SCRIPT=ROOT/'recover-original-mesh.sh'
class Bootstrap(unittest.TestCase):
    def test_shell_syntax(self):
        p=subprocess.run(['bash','-n',str(SCRIPT)],capture_output=True,text=True)
        self.assertEqual(p.returncode,0,p.stderr)
    def test_requires_mode(self):
        with tempfile.TemporaryDirectory() as d:
            p=subprocess.run(['bash',str(SCRIPT),'--unknown',d+'/out'],capture_output=True,text=True)
            self.assertEqual(p.returncode,64)
            self.assertIn('Usage',p.stderr)
    def test_no_overwrite(self):
        with tempfile.TemporaryDirectory() as d:
            p=subprocess.run(['bash',str(SCRIPT),'--asset',d],capture_output=True,text=True)
            self.assertEqual(p.returncode,64)
            self.assertIn('never overwrite',p.stderr)
    def test_refuses_non_repository(self):
        with tempfile.TemporaryDirectory() as d:
            p=subprocess.run(['bash',str(SCRIPT),'--asset',d+'/out'],cwd=d,capture_output=True,text=True)
            self.assertEqual(p.returncode,2)
            self.assertIn('NOT_A_REPOSITORY',p.stderr)
    def test_no_product_write_or_bypass(self):
        s=SCRIPT.read_text()
        for forbidden in ['git push','git reset','git checkout -f','git commit','gh api','curl ','wget ','git apply ','git merge ']:
            self.assertNotIn(forbidden,s)
        for required in ['sha256sum -c','git -C "$REPO" show',"--regen-proof",'source-paths.txt','mesh_domain_gate.py','SOURCE_EVIDENCE_BLOB_DRIFT','ORIGINAL_UPLOAD_POSITION_DIGEST','ORIGINAL_UPLOAD_INDEX_DIGEST']:
            self.assertIn(required,s)
if __name__=='__main__': unittest.main(verbosity=2)