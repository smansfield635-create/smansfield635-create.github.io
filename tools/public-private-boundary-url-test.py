"""Exercise the workflow's actual inline checker in disposable Git repositories."""
import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest

WORKFLOW = Path(__file__).resolve().parents[1] / '.github/workflows/public-private-boundary-gate.yml'
SOURCE = textwrap.dedent(WORKFLOW.read_text().split("python3 - <<'PYTHON'\n", 1)[1].split('          PYTHON', 1)[0])
# Assemble synthetic paths so fixtures cannot be mistaken for real private metadata.
ROUTER = '.github/' + 'ai-router/'
PUBLIC = ROUTER + 'projects/example/entrypoint.v1.json'
HOST = 'https://github.com/'
REPO = 'smansfield635-create/smansfield635-create.github.io'
URL = HOST + REPO + '/blob/main/' + PUBLIC


class BoundaryURLTests(unittest.TestCase):
    def check(self, text, expected=True, extra=None, base_ref=None):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            def git(*args):
                return subprocess.run(['git', *args], cwd=root, check=True,
                                      capture_output=True, text=True).stdout.strip()
            git('init', '-q')
            git('config', 'user.name', 'Synthetic test')
            git('config', 'user.email', 'test@example.invalid')
            target = root / PUBLIC
            target.parent.mkdir(parents=True)
            target.write_text('{"schema":"REPOSITORY_AI_PROJECT_ENTRYPOINT_v1"}')
            (target.parent / 'alias.json').symlink_to('entrypoint.v1.json')
            git('add', '.')
            git('commit', '-qm', 'Public baseline')
            base = git('rev-parse', 'HEAD')
            (root / 'added.txt').write_text(text)
            if extra:
                for path, content in extra.items():
                    dest = root / path
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    dest.write_text(content)
            git('add', '.')
            git('commit', '-qm', 'Synthetic candidate')
            env = {**os.environ, 'BASE_SHA': base_ref or base, 'HEAD_SHA': git('rev-parse', 'HEAD')}
            run = subprocess.run(['python3', '-c', SOURCE], cwd=root, env=env,
                                 capture_output=True, text=True)
            self.assertEqual(run.returncode == 0, expected, (text, run.stdout, run.stderr))
            if expected:
                self.assertIn('PUBLIC_PRIVATE_BOUNDARY_PASS', run.stdout)

    def test_existing_public_references(self):
        for text in [PUBLIC, URL, URL.replace('/main/', '/' + 'a' * 40 + '/'),
                     '[' + PUBLIC + '](' + URL + '?utm_source=chatgpt.com)',
                     URL + '#L12', 'Build quote: ' + URL + '\n' + PUBLIC]:
            with self.subTest(text=text):
                self.check(text)

    def test_untrusted_url_variants(self):
        for text in [URL.replace('https:', 'http:'), URL.replace('https:', ''),
                     URL.replace('github.com', 'github.com.evil.invalid'),
                     URL.replace('github.com', 'evil.invalid/github.com'),
                     URL.replace('github.com', 'user@github.com'),
                     URL.replace('github.com', 'github.com:443'),
                     URL.replace(REPO, 'other/public'),
                     URL.replace(REPO, 'smansfield635-create/' + 'geodiametrics' + '1'),
                     URL.replace('/blob/', '/tree/'),
                     URL.replace('/main/', '/main/../'),
                     URL.replace('/main/', '/main/%2e%2e/'),
                     URL.replace('/projects/', '/projects//'),
                     URL.replace('.github/', '%2egithub/'),
                     URL.replace('/projects/', '/projects%2f'),
                     URL.replace('/projects/', '/projects\\'),
                     URL + '?hidden=' + ROUTER + 'private.json',
                     URL + '#' + ROUTER + 'private.json']:
            with self.subTest(text=text):
                self.check(text, False)

    def test_missing_directory_symlink_and_new_url_targets(self):
        for path in [ROUTER + 'private.json', ROUTER + 'projects/example',
                     ROUTER + 'projects/example/alias.json']:
            self.check(HOST + REPO + '/blob/main/' + path, False)
        new = ROUTER + 'projects/new/entrypoint.v1.json'
        data = '{"schema":"REPOSITORY_AI_PROJECT_ENTRYPOINT_v1"}'
        self.check(new, True, {new: data})
        self.check(HOST + REPO + '/blob/main/' + new, False, {new: data})

    def test_legacy_rejections_and_git_failure_remain(self):
        for text in ['/' + PUBLIC, '../' + PUBLIC, ROUTER + 'private.json',
                     'canonical' + 'Source: secret', URL + '\n' + ROUTER + 'missing.json',
                     'tools/' + 'operation-intake/missing.mjs']:
            self.check(text, False)
        self.check('ordinary public prose', False, base_ref='does-not-exist')


if __name__ == '__main__':
    unittest.main()
