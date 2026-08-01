#!/usr/bin/env python3
import hashlib
import json
import os
import re
import shutil
import subprocess
from pathlib import Path, PurePosixPath

WORKSPACE = Path(os.environ["GITHUB_WORKSPACE"])
SOURCE_ROOT = WORKSPACE / "source"
PUBLICATION_ROOT = WORKSPACE / "publication"
PREVIEW_REL = PurePosixPath(os.environ["PREVIEW_ROOT"])
OUT_ROOT = PUBLICATION_ROOT / Path(str(PREVIEW_REL))
PUBLIC_PREFIX = "/" + str(PREVIEW_REL).strip("/") + "/"
SOURCE_HEAD = os.environ["SOURCE_HEAD"]
ENTRY = PurePosixPath(
    "h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/index.html"
)
TEXT_EXTENSIONS = {".js", ".mjs", ".html", ".json", ".css", ".txt", ".svg"}
SPEC_RE = re.compile(
    r"(?:from\s+|import\s*\(\s*|import\s+|fetch\s*\(\s*)['\"]([^'\"]+)['\"]"
)
HTML_RE = re.compile(r"(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", re.I)
ABSOLUTE_RE = re.compile(r"(['\"])(/[^'\"`\s]+)\1")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def normalized(owner: PurePosixPath, spec: str):
    if spec.startswith(("http://", "https://", "data:", "blob:", "#")):
        return None
    spec = spec.split("#", 1)[0].split("?", 1)[0]
    if not spec:
        return None
    if spec.startswith("/"):
        candidate = PurePosixPath(spec.lstrip("/"))
    elif spec.startswith("."):
        candidate = owner.parent.joinpath(spec)
    else:
        return None
    return PurePosixPath(os.path.normpath(str(candidate)).replace("\\", "/"))


def existing_file(owner: PurePosixPath, spec: str, strict: bool = False):
    candidate = normalized(owner, spec)
    if candidate is None:
        return None
    path = SOURCE_ROOT / Path(str(candidate))
    if path.is_file():
        return candidate
    if strict:
        raise FileNotFoundError(
            f"UNRESOLVED_RUNTIME_DEPENDENCY:{owner}:{spec}:{candidate}"
        )
    return None


def discover_closure():
    queue = [ENTRY]
    seen = set()
    while queue:
        item = queue.pop(0)
        if item in seen:
            continue
        path = SOURCE_ROOT / Path(str(item))
        if not path.is_file():
            raise FileNotFoundError(f"SOURCE_FILE_MISSING:{item}")
        seen.add(item)
        if path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        text = path.read_text(encoding="utf-8")

        # JavaScript imports and fetches are executable dependencies and remain strict.
        for spec in [match.group(1) for match in SPEC_RE.finditer(text)]:
            dependency = existing_file(item, spec, strict=True)
            if dependency is not None and dependency not in seen:
                queue.append(dependency)

        # HTML/SVG href values can be navigation destinations or directories. Include
        # only values that identify exact files in the source tree.
        if path.suffix.lower() in {".html", ".svg"}:
            for spec in [match.group(1) for match in HTML_RE.finditer(text)]:
                dependency = existing_file(item, spec, strict=False)
                if dependency is not None and dependency not in seen:
                    queue.append(dependency)

        # Runtime constants expressed as quoted absolute paths are copied only when
        # the referenced source file actually exists.
        for match in ABSOLUTE_RE.finditer(text):
            dependency = existing_file(item, match.group(2), strict=False)
            if dependency is not None and dependency not in seen:
                queue.append(dependency)
    return seen


def rebase_existing_absolute_paths(owner: PurePosixPath, text: str) -> str:
    def replace(match):
        spec = match.group(2)
        dependency = existing_file(owner, spec, strict=False)
        if dependency is None:
            return match.group(0)
        return match.group(1) + PUBLIC_PREFIX + "_source/" + str(dependency) + match.group(1)

    return ABSOLUTE_RE.sub(replace, text)


def write_preview(closure):
    if OUT_ROOT.exists():
        shutil.rmtree(OUT_ROOT)
    OUT_ROOT.mkdir(parents=True)
    source_entries = []

    for item in sorted(closure, key=str):
        source_path = SOURCE_ROOT / Path(str(item))
        source_bytes = source_path.read_bytes()
        source_blob = subprocess.check_output(
            ["git", "-C", str(SOURCE_ROOT), "rev-parse", f"{SOURCE_HEAD}:{item}"],
            text=True,
        ).strip()
        transform = "NONE"

        if item == ENTRY:
            text = source_bytes.decode("utf-8")
            if '<meta name="robots"' not in text:
                text = text.replace(
                    "</title>",
                    '</title>\n  <meta name="robots" content="noindex,nofollow,noarchive">',
                    1,
                )
            text = text.replace(
                '<html lang="en"',
                '<html lang="en" data-preview-class="IMMUTABLE_UNLINKED_NONPRODUCTION_REVIEW" data-source-head="a699c5a64e2bf54d950a69c839c3d9ee41b6514f"',
                1,
            )
            text = text.replace(
                "<header>",
                '<header><div class="badge" style="border-color:#f4c86a;color:#ffe9a8;background:#5a430f66">Nonproduction immutable review · exact verified head a699c5a</div>',
                1,
            )
            text = text.replace(
                '<script type="module" src="./complete-world.js"></script>',
                '<script type="module" src="./_source/h-earth-3d/control-plane/coastal-morphology/c2-r1/review/complete-world/complete-world.js"></script>\n  <script type="module" src="./preview-correspondence-verifier.js"></script>',
                1,
            )
            text = text.replace(
                "</footer>",
                '<p><strong>Byte correspondence:</strong> <output id="preview-correspondence-status">Verifying immutable preview files…</output></p></footer>',
                1,
            )
            output_relative = PurePosixPath("index.html")
            output_bytes = text.encode("utf-8")
            transform = "ENTRY_REBASED_LABEL_AND_NOINDEX"
        else:
            output_relative = PurePosixPath("_source") / item
            if source_path.suffix.lower() in TEXT_EXTENSIONS:
                original = source_bytes.decode("utf-8")
                changed = rebase_existing_absolute_paths(item, original)
                output_bytes = changed.encode("utf-8")
                if changed != original:
                    transform = "ABSOLUTE_EXISTING_FILE_PATHS_REBASED"
            else:
                output_bytes = source_bytes

        output_path = OUT_ROOT / Path(str(output_relative))
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(output_bytes)
        source_entries.append(
            {
                "sourceFile": str(item),
                "sourceCommit": SOURCE_HEAD,
                "sourceBlob": source_blob,
                "sourceSha256": sha256(source_bytes),
                "previewFile": str(output_relative),
                "previewSha256": sha256(output_bytes),
                "transform": transform,
            }
        )

    verifier = """const node=document.getElementById('preview-correspondence-status');
const hex=b=>[...new Uint8Array(b)].map(v=>v.toString(16).padStart(2,'0')).join('');
const dig=async b=>hex(await crypto.subtle.digest('SHA-256',b));
const base=new URL('./',import.meta.url);
try{const mr=await fetch(new URL('byte-manifest.json',base),{cache:'no-store'}),dr=await fetch(new URL('byte-manifest.sha256',base),{cache:'no-store'});if(!mr.ok||!dr.ok)throw new Error(`MANIFEST_HTTP_FAILURE:${mr.status}:${dr.status}`);const mb=await mr.arrayBuffer(),expected=(await dr.text()).trim().split(/\\s+/)[0],actual=await dig(mb);if(actual!==expected)throw new Error('MANIFEST_DIGEST_MISMATCH');const m=JSON.parse(new TextDecoder().decode(mb)),all=[...m.sourceEntries,...m.generatedFiles],results=[];for(const row of all){const r=await fetch(new URL(row.previewFile,base),{cache:'no-store'});if(!r.ok)throw new Error(`PREVIEW_FILE_HTTP_FAILURE:${row.previewFile}:${r.status}`);const a=await dig(await r.arrayBuffer());results.push({previewFile:row.previewFile,expected:row.previewSha256,actual:a,match:a===row.previewSha256});if(a!==row.previewSha256)throw new Error(`PREVIEW_FILE_DIGEST_MISMATCH:${row.previewFile}`)}window.H_EARTH_C2_R1_PREVIEW_CORRESPONDENCE=Object.freeze({status:'PASS',sourceHead:m.sourceHead,fileCount:all.length,manifestDigest:actual,results});if(node)node.textContent=`PASS · ${all.length} files bound to ${m.sourceHead.slice(0,12)}`;}catch(e){window.H_EARTH_C2_R1_PREVIEW_CORRESPONDENCE=Object.freeze({status:'FAIL',error:{name:e.name,message:e.message}});if(node)node.textContent=`FAIL · ${e.message}`;console.error('H_EARTH_C2_R1_PREVIEW_CORRESPONDENCE_FAILURE',e)}
"""
    verifier_path = OUT_ROOT / "preview-correspondence-verifier.js"
    verifier_path.write_text(verifier, encoding="utf-8")
    generated_files = [
        {
            "previewFile": "preview-correspondence-verifier.js",
            "previewSha256": sha256(verifier_path.read_bytes()),
            "generationAuthority": "H_EARTH_C2_R1_COMPLETE_WORLD_IMMUTABLE_PREVIEW_PUBLICATION_001",
        }
    ]

    manifest = {
        "manifestType": "H_EARTH_C2_R1_IMMUTABLE_PREVIEW_SOURCE_TO_PREVIEW_BYTE_MANIFEST_v4",
        "operationId": "H_EARTH_C2_R1_COMPLETE_WORLD_IMMUTABLE_PREVIEW_PUBLICATION_001",
        "sourceHead": SOURCE_HEAD,
        "previewPath": str(PREVIEW_REL) + "/",
        "expectedPublicEntry": "https://diamondgatebridge.com/"
        + str(PREVIEW_REL)
        + "/index.html",
        "packageIdentity": "H_EARTH_C2_R1_COMPLETE_WORLD_PACKAGE_218F37AE",
        "packageContentDigest": "fnv1a32:218f37ae",
        "sourceDependencyClosureCount": len(source_entries),
        "generatedFileCount": len(generated_files),
        "sourceEntries": source_entries,
        "generatedFiles": generated_files,
        "manifestSelfBinding": "byte-manifest.sha256",
        "boundaries": {
            "unlinkedFromPublicNavigation": True,
            "publicDefaultRouteMutated": False,
            "productCandidateMerged": False,
            "sourceBehaviorChanged": False,
            "cloudflareUsed": False,
        },
    }
    manifest_path = OUT_ROOT / "byte-manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    manifest_digest = sha256(manifest_path.read_bytes())
    (OUT_ROOT / "byte-manifest.sha256").write_text(
        f"{manifest_digest}  byte-manifest.json\n", encoding="utf-8"
    )
    preview_file_count = len(source_entries) + len(generated_files) + 3
    (OUT_ROOT / "publication-receipt.json").write_text(
        json.dumps(
            {
                "operationId": "H_EARTH_C2_R1_COMPLETE_WORLD_IMMUTABLE_PREVIEW_PUBLICATION_001",
                "status": "MATERIALIZED_PENDING_LOCAL_BROWSER_PROOF",
                "sourceHead": SOURCE_HEAD,
                "previewFileCount": preview_file_count,
                "dependencyClosureResult": "PASS",
                "byteManifestResult": "PASS",
                "manifestDigest": "sha256:" + manifest_digest,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    return manifest, preview_file_count, manifest_digest


def verify_manifest(manifest):
    expected_digest = (OUT_ROOT / "byte-manifest.sha256").read_text().split()[0]
    actual_digest = sha256((OUT_ROOT / "byte-manifest.json").read_bytes())
    assert actual_digest == expected_digest
    accounted = {"byte-manifest.json", "byte-manifest.sha256", "publication-receipt.json"}
    for row in manifest["sourceEntries"]:
        source_path = SOURCE_ROOT / row["sourceFile"]
        preview_path = OUT_ROOT / row["previewFile"]
        assert source_path.is_file() and preview_path.is_file()
        actual_blob = subprocess.check_output(
            [
                "git",
                "-C",
                str(SOURCE_ROOT),
                "rev-parse",
                f"{SOURCE_HEAD}:{row['sourceFile']}",
            ],
            text=True,
        ).strip()
        assert actual_blob == row["sourceBlob"]
        assert sha256(source_path.read_bytes()) == row["sourceSha256"]
        assert sha256(preview_path.read_bytes()) == row["previewSha256"]
        accounted.add(row["previewFile"])
    for row in manifest["generatedFiles"]:
        preview_path = OUT_ROOT / row["previewFile"]
        assert preview_path.is_file()
        assert sha256(preview_path.read_bytes()) == row["previewSha256"]
        accounted.add(row["previewFile"])
    actual_files = {
        str(path.relative_to(OUT_ROOT)) for path in OUT_ROOT.rglob("*") if path.is_file()
    }
    assert actual_files == accounted, (
        sorted(actual_files - accounted),
        sorted(accounted - actual_files),
    )
    return len(actual_files)


closure = discover_closure()
manifest, expected_file_count, manifest_digest = write_preview(closure)
actual_file_count = verify_manifest(manifest)
assert actual_file_count == expected_file_count
print(
    json.dumps(
        {
            "dependencyClosureResult": "PASS",
            "byteManifestResult": "PASS",
            "sourceDependencyClosureCount": len(closure),
            "previewFileCount": actual_file_count,
            "manifestDigest": "sha256:" + manifest_digest,
        }
    )
)
