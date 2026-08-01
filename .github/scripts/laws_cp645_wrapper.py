from pathlib import Path
import textwrap

SOURCE_WORKFLOW = Path('.github/workflows/laws-cp6-4-5-first-consolidation.yml')
source_text = SOURCE_WORKFLOW.read_text(encoding='utf-8')
start_marker = "cat > /tmp/laws_cp645.py <<'PY'\n"
start = source_text.index(start_marker) + len(start_marker)
end = source_text.index("\n          PY\n          python3 /tmp/laws_cp645.py", start)
source = textwrap.dedent(source_text[start:end])

source = source.replace(
    "BRANCH = 'agent/laws-cp6-4-first-theme-and-page-consolidation-001'",
    "BRANCH = 'agent/laws-cp6-4-first-theme-and-page-consolidation-002'",
    1,
)

payload_needle = "\nassert set(expected_payloads) == {row['id'] for row in migrated_rows}\n"
assert source.count(payload_needle) == 1
route_normalization = r'''

def normalize_absent_source_route(fragment):
    parsed = BeautifulSoup(fragment, 'html.parser')
    link = parsed.find('a', href=True)
    assert link is not None
    href = link['href']
    replacement = parsed.new_tag('article')
    replacement['class'] = list(link.get('class', [])) + ['source-route-record']
    for child in list(link.contents):
        replacement.append(child.extract())
    declaration = parsed.new_tag('p')
    declaration['class'] = ['declared-source-route']
    declaration.string = f'Declared source route retained without broken navigation: {href}'
    replacement.append(declaration)
    link.replace_with(replacement)
    return str(parsed)

for number in (88, 90):
    expected_payloads[cid(number)] = normalize_absent_source_route(expected_payloads[cid(number)])
'''
source = source.replace(payload_needle, textwrap.dedent(route_normalization) + payload_needle, 1)

boundary_needle = "assert 'not itself validation' in canonical_text(expected_payloads[cid(80)]).lower()"
boundary_replacement = "assert 'not itself validation' in norm(canonical_text(expected_payloads[cid(80)])).lower()"
assert source.count(boundary_needle) == 1
source = source.replace(boundary_needle, boundary_replacement, 1)

source = source.replace(
    "/laws/research/applied-investigations/#route-maturity-and-infrastructure-pathways",
    "/laws/research/applied-investigations/",
)

status_needle = "status_lines = run('git','status','--porcelain').splitlines()"
status_replacement = "status_lines = run('git','status','--porcelain','--untracked-files=all').splitlines()"
assert source.count(status_needle) == 1
source = source.replace(status_needle, status_replacement, 1)

paths_needle = "changed_paths = sorted(line[3:] for line in status_lines if line)"
paths_replacement = """carrier_paths = {
    '.github/workflows/laws-cp6-4-5-first-consolidation.yml',
    '.github/workflows/laws-cp6-4-5-execution-carrier.yml',
    '.github/scripts/laws_cp645_wrapper.py',
}
def porcelain_path(line):
    path = line[3:]
    if path.startswith('github/'):
        path = '.' + path
    return path
status_paths = [porcelain_path(line) for line in status_lines if line]
changed_paths = sorted(path for path in status_paths if path not in carrier_paths)"""
assert source.count(paths_needle) == 1
source = source.replace(paths_needle, paths_replacement, 1)

Path('/tmp/laws_cp645.py').write_text(source, encoding='utf-8')
