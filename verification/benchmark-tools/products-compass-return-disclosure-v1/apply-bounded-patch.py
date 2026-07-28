from pathlib import Path
import hashlib
import json

ROOT = Path.cwd()
CONTROLLER = ROOT / "products/index.controller.js"
CRYSTALS = ROOT / "products/index.crystals.js"

EXPECTED_CONTROLLER_BLOB = "3bf31e29f6743a8660b12a30c5fb56d087ca3199"
EXPECTED_CRYSTALS_BLOB = "db6889500dccab53365a564feb1aa96f34b4200d"


def git_blob_sha(text: str) -> str:
    data = text.encode("utf-8")
    return hashlib.sha1(f"blob {len(data)}\0".encode("utf-8") + data).hexdigest()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}:EXPECTED_ONE_ANCHOR:OBSERVED_{count}")
    return text.replace(old, new, 1)


controller = CONTROLLER.read_text(encoding="utf-8")
crystals = CRYSTALS.read_text(encoding="utf-8")
controller_before = git_blob_sha(controller)
crystals_before = git_blob_sha(crystals)

controller_markers = [
    'setCenterDisclosure(false);\n\n    const transaction = beginAtomicTransition({\n      state: STATES.PRODUCT_SELECTED',
    'setCenterDisclosure(false);\n\n    const transaction = beginAtomicTransition({\n      state: STATES.CLUSTER_OPEN',
]
crystals_marker = '"[data-products-center-control]",\n      "[data-products-enter]"'

already_patched = all(marker in controller for marker in controller_markers) and crystals_marker in crystals

if not already_patched:
    if controller_before != EXPECTED_CONTROLLER_BLOB:
        raise RuntimeError(
            f"CONTROLLER_BLOB_DRIFT:EXPECTED_{EXPECTED_CONTROLLER_BLOB}:OBSERVED_{controller_before}"
        )
    if crystals_before != EXPECTED_CRYSTALS_BLOB:
        raise RuntimeError(
            f"CRYSTALS_BLOB_DRIFT:EXPECTED_{EXPECTED_CRYSTALS_BLOB}:OBSERVED_{crystals_before}"
        )

    controller = replace_once(
        controller,
        '''  function requestProductSelection(productId) {
    const product = getProductById(productId);

    if (!product) {''',
        '''  function requestProductSelection(productId) {
    const product = getProductById(productId);

    if (!product) {''',
        "CONTROLLER_PRODUCT_SELECTION_FUNCTION",
    )

    controller = replace_once(
        controller,
        '''    clearViewportSchedules();

    const transaction = beginAtomicTransition({
      state: STATES.PRODUCT_SELECTED,''',
        '''    clearViewportSchedules();
    setCenterDisclosure(false);

    const transaction = beginAtomicTransition({
      state: STATES.PRODUCT_SELECTED,''',
        "CONTROLLER_PRODUCT_SELECTION_DISCLOSURE_CLOSE",
    )

    controller = replace_once(
        controller,
        '''  function requestReturnToOrbit() {
    if (state.current !== STATES.PRODUCT_SELECTED) {
      return false;
    }

    clearViewportSchedules();

    const transaction = beginAtomicTransition({
      state: STATES.CLUSTER_OPEN,''',
        '''  function requestReturnToOrbit() {
    if (state.current !== STATES.PRODUCT_SELECTED) {
      return false;
    }

    clearViewportSchedules();
    setCenterDisclosure(false);

    const transaction = beginAtomicTransition({
      state: STATES.CLUSTER_OPEN,''',
        "CONTROLLER_RETURN_TO_ORBIT_DISCLOSURE_CLOSE",
    )

    crystals = replace_once(
        crystals,
        '''    return target.closest([
      "[data-products-enter]",''',
        '''    return target.closest([
      "[data-products-center-control]",
      "[data-products-enter]",''',
        "CRYSTALS_CENTER_CONTROL_POINTER_PRIORITY",
    )

    CONTROLLER.write_text(controller, encoding="utf-8")
    CRYSTALS.write_text(crystals, encoding="utf-8")

controller_after = git_blob_sha(CONTROLLER.read_text(encoding="utf-8"))
crystals_after = git_blob_sha(CRYSTALS.read_text(encoding="utf-8"))

receipt = {
    "tool": "PRODUCTS_COMPASS_RETURN_DISCLOSURE_PATCH_v1",
    "status": "ALREADY_PATCHED" if already_patched else "PATCH_APPLIED",
    "controller": {
        "before": controller_before,
        "after": controller_after,
        "productSelectionClosesDisclosure": True,
        "returnToOrbitClosesDisclosure": True,
    },
    "crystals": {
        "before": crystals_before,
        "after": crystals_after,
        "centerControlPointerPriority": True,
    },
    "prohibitedChanges": {
        "css": False,
        "compositor": False,
        "planet": False,
        "geometry": False,
        "routes": False,
    },
}
print(json.dumps(receipt, indent=2))
