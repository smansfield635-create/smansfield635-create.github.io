#!/usr/bin/env python3
"""Reproduce archived far-view visual reference from ONE immutable Actions ZIP.

No browser, camera search, material solver, GPU, product write, or admission.
This is a historic DIFFERENT-source visual specimen, not present-day repair proof.

Usage:
python3 verify_archived_visual_target.py /path/to/gen2956-artifact.zip \
  visual-target-priority-review.json
"""
import hashlib
import json
import sys
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile
import numpy as np
from PIL import Image

NAMES = {
    "baselineUnlit": "baseline-inland-seam-far-after-groundcover-unlit.png",
    "baselineLit": "baseline-inland-seam-far-reference-lit.png",
    "rejectedUnlit": "candidate-inland-seam-far-after-groundcover-unlit.png",
    "rejectedLit": "candidate-inland-seam-far-reference-lit.png",
}
WEIGHTS = np.array([.2126, .7152, .0722], dtype=float)

def check(zip_path, report_path):
    data = json.loads(Path(report_path).read_text())
    assert data["schema"] == "H_EARTH_GEN3000_VISUAL_TARGET_TRIAGE_v1"
    h = data["historicalReference"]
    archive = Path(zip_path).read_bytes()
    assert hashlib.sha256(archive).hexdigest() == h["zipSHA256"], "ZIP_IDENTITY_DRIFT"
    assert h["sourceRun"] == 40734434775 and h["artifactId"] == 12837402038
    assert h["baselineHead"] == "cb57c275b95d0d48883bc4da4dcfcf17cbec5060"
    assert h["rejectedCandidateHead"] == "7882a91c4ff8ed1652df8453ce3772a863a7e109"
    assert h["exactTopLeftPixelPair"] == [[392,496],[392,497]]
    result={}
    with ZipFile(BytesIO(archive)) as z:
        assert z.testzip() is None, "ZIP_CRC_DRIFT"
        for key, filename in NAMES.items():
            raw = z.read(filename)
            assert hashlib.sha256(raw).hexdigest() == h["verifiedSha"][key], "PNG_SHA_DRIFT:"+key
            image = np.asarray(Image.open(BytesIO(raw)).convert("RGB"), dtype=np.uint8)
            assert image.shape == (980,529,3), "SOURCE_VIEWPORT_DRIFT"
            a,b=(image[y,x].astype(int) for x,y in h["exactTopLeftPixelPair"])
            assert [a.tolist(),b.tolist()] == h["rgb"][key], "EDGE_COLOR_DRIFT:"+key
            delta=float((b-a)@WEIGHTS)
            assert abs(delta-h["measuredDisplayLumaSecondMinusFirst"][key]) < 1e-9
            roi = h["exploratoryROI"]
            x0,x1=roi["xHalfOpen"]
            u0,u1=roi["upperYHalfOpen"]
            l0,l1=roi["lowerYHalfOpen"]
            top=float(np.median(image[u0:u1,x0:x1].astype(float)@WEIGHTS))
            lower=float(np.median(image[l0:l1,x0:x1].astype(float)@WEIGHTS))
            assert abs(top-lower-roi["medianUpperMinusLower"][key])<1e-9, "ROI_DRIFT:"+key
            result[key]={"edgeDisplayDelta":delta,"upperMinusLowerMedianDisplay":top-lower,
                "adjacentRGBFirst":a.tolist(),"adjacentRGBSecond":b.tolist()}
    assert max(abs(v) for v in [result["baselineUnlit"]["edgeDisplayDelta"],
                                result["rejectedUnlit"]["edgeDisplayDelta"]])>4.5
    assert h["historicalDisposition"].startswith("Gen2956 independent visual review REJECT")
    assert data["noNewGPU"] and data["noProductMutation"]
    return {"result":"PASS_ARCHIVED_VISUAL_REFERENCE_ONLY","artifactId":h["artifactId"],
            "archiveSha256":h["zipSHA256"],"verifiedImages":len(NAMES),
            "historicBaseline":h["baselineHead"],"historicRejectedCandidate":h["rejectedCandidateHead"],
            "sourceFirstRegion":"inland-seam-far","pixels":result,
            "notCurrentProductVisualAcceptance":True,"newGPU":False}

if __name__=="__main__":
    if len(sys.argv)!=3:raise SystemExit("USAGE ZIP REPORT")
    print(json.dumps(check(sys.argv[1],sys.argv[2]),indent=2))
