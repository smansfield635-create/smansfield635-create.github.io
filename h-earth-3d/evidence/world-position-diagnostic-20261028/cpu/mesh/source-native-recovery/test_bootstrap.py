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
    def test_frozen_archive_absent_root_package(self):
        # Regression for run 40885973120: the frozen commit lacks package.json.
        # Reproduce Git archive's exact missing-path failure with a fresh toy tree.
        import io
        import tarfile
        with tempfile.TemporaryDirectory() as d:
            root=Path(d)
            asset='showroom/globe/h-earth/render/assets/h-earth-canonical-base-world.v1.json.gz'
            (root/asset).parent.mkdir(parents=True)
            (root/asset).write_bytes(b'known-gzip-test-placeholder')
            (root/'h-earth-3d').mkdir()
            (root/'h-earth-3d/replay.mjs').write_text('export const world = true;\\n')
            for cmd in (['git','init','-q'],['git','add','.'],
                        ['git','-c','user.name=CI','-c','user.email=ci@example.com','commit','-qm','fixture']):
                subprocess.run(cmd,cwd=root,check=True,capture_output=True)
            old=subprocess.run(['git','archive','--format=tar','HEAD',
                                'h-earth-3d/replay.mjs','package.json',asset],
                               cwd=root,capture_output=True)
            self.assertNotEqual(old.returncode,0)
            self.assertIn("pathspec 'package.json' did not match",old.stderr.decode())
            new=subprocess.run(['git','archive','--format=tar','HEAD',
                                'h-earth-3d/replay.mjs',asset],
                               cwd=root,capture_output=True)
            self.assertEqual(new.returncode,0,new.stderr.decode())
            with tarfile.open(fileobj=io.BytesIO(new.stdout),mode='r:') as archive:
                names=archive.getnames()
                self.assertIn(asset,names)
                self.assertIn('h-earth-3d/replay.mjs',names)
            source=SCRIPT.read_text()
            self.assertIn('paths+=("$ASSET")',source)
            self.assertNotIn('paths+=(package.json "$ASSET")',source)
    def test_no_product_write_or_bypass(self):
        s=SCRIPT.read_text()
        for forbidden in ['git push','git reset','git checkout -f','git commit','gh api','curl ','wget ','git apply ','git merge ']:
            self.assertNotIn(forbidden,s)
        for required in ['sha256sum -c','git -C "$REPO" show',"--regen-proof",'source-paths.txt','mesh_domain_gate.py','SOURCE_EVIDENCE_BLOB_DRIFT','ORIGINAL_UPLOAD_POSITION_DIGEST','ORIGINAL_UPLOAD_INDEX_DIGEST']:
            self.assertIn(required,s)
if __name__=='__main__': unittest.main(verbosity=2)