from pathlib import Path
import re

root = Path(__file__).resolve().parents[2]
benchmark = root / "verification/benchmark-tools/four-compass-benchmark-v1/showroom-label-conformance-benchmark.mjs"

text = benchmark.read_text(encoding="utf-8")
pattern = re.compile(r'''  const dragStarted = await page\.evaluate\(async \(\) => \{.*?  assert\(dragStarted, "TOUCH_DRAG_START_FAILED", dragStarted, profile\.id\);''', re.S)
replacement = '''  const fieldRectForInput = await page.$eval("[data-showroom-orbit-field]", element => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
  });
  const startX = Math.round(fieldRectForInput.left + fieldRectForInput.width * 0.72);
  const startY = Math.round(fieldRectForInput.top + fieldRectForInput.height * 0.78);
  const endX = Math.round(startX - fieldRectForInput.width * 0.32);
  const endY = startY;
  let releaseActualPointer;

  if (profile.mobile) {
    const cdp = await page.createCDPSession();
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: startX, y: startY, id: 41, radiusX: 1, radiusY: 1, force: 0.5 }]
    });
    for (let step = 1; step <= 12; step += 1) {
      const progress = step / 12;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{
          x: Math.round(startX + (endX - startX) * progress),
          y: endY,
          id: 41,
          radiusX: 1,
          radiusY: 1,
          force: 0.5
        }]
      });
      await sleep(36);
    }
    releaseActualPointer = () => cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: []
    });
  } else {
    await page.mouse.move(startX, startY);
    await page.mouse.down({ button: "left" });
    for (let step = 1; step <= 12; step += 1) {
      const progress = step / 12;
      await page.mouse.move(
        Math.round(startX + (endX - startX) * progress),
        endY,
        { steps: 1 }
      );
      await sleep(36);
    }
    releaseActualPointer = () => page.mouse.up({ button: "left" });
  }

  assert(typeof releaseActualPointer === "function", "ACTUAL_POINTER_INPUT_START_FAILED", null, profile.id);'''
text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f"ACTUAL_INPUT_START_BLOCK_MATCH_COUNT:{count}")

pattern = re.compile(r'''  const pointerReleased = await page\.evaluate\(\(\) => \{.*?  assert\(pointerReleased, "TOUCH_DRAG_RELEASE_FAILED", pointerReleased, profile\.id\);''', re.S)
replacement = '''  await releaseActualPointer();'''
text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f"ACTUAL_INPUT_RELEASE_BLOCK_MATCH_COUNT:{count}")

benchmark.write_text(text, encoding="utf-8")
Path(__file__).unlink()
print("SHOWROOM_ACTUAL_POINTER_BENCHMARK_PATCH_20260729C")
