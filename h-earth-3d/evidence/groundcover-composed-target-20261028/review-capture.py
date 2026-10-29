"""Verify captured image custody and report paired pixel changes; no visual verdict inferred."""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

root = Path(sys.argv[1])
receipt = json.loads((root / "receipt.json").read_text())
views = receipt["views"]
assert len(views) == 16
for view in views:
    data = (root / view["image"]).read_bytes()
    assert hashlib.sha256(data).hexdigest() == view["imageSha256"]
    assert Image.open(root / view["image"]).size == (529, 980)

pairs = []
for baseline in [v for v in views if v["label"] == "baseline"]:
    candidate = next(v for v in views if v["label"] == "candidate"
                     and v["pose"]["name"] == baseline["pose"]["name"]
                     and v["mode"] == baseline["mode"])
    a = np.asarray(Image.open(root / baseline["image"]).convert("RGB")).astype(float)
    b = np.asarray(Image.open(root / candidate["image"]).convert("RGB")).astype(float)
    delta = abs(a - b)
    pairs.append({"pose": baseline["pose"]["name"], "mode": baseline["mode"],
                  "changedPixels": int(np.any(delta > 0, axis=2).sum()),
                  "pixelsOver3": int(np.any(delta > 3, axis=2).sum()),
                  "maxChannelDelta": int(delta.max()),
                  "meanAbsoluteChannelDelta": float(delta.mean()),
                  "baselineImage": baseline["image"], "candidateImage": candidate["image"]})

print(json.dumps({"sourceHeads": receipt["heads"], "rawResult": receipt["result"],
                  "verifiedImageCount": len(views), "pairs": pairs,
                  "visualAcceptanceInferred": False, "ownerAcceptance": False}, indent=2))
