from models import OperationRequest, Receipt
from adapters.kvm import KVMAdapter
from adapters.hyperv import HyperVAdapter
from store.db import write_receipt, update_state

def get_adapter(name: str):
    n = (name or "").lower()
    if n == "kvm":
        return KVMAdapter()
    if n in ("hyperv", "hyper-v"):
        return HyperVAdapter()
    raise RuntimeError(f"Unknown adapter: {name}")

def execute(req: OperationRequest):
    try:
        adapter = get_adapter(req.adapter)

        # Selection
        target = adapter.select(req.target)

        # Resolution
        if not adapter.admissible(req.op, target):
            r = Receipt.fail(req, "constraint_violation")
            write_receipt(r)
            return r

        # Commitment
        detail = adapter.commit(req.op, target)

        # Continuation
        verified = adapter.verify(req.op, target)
        snap = adapter.snapshot(target)

        r = Receipt.ok(req, detail=detail, verified=verified)
        write_receipt(r)
        update_state(req.adapter, req.target, snap)
        return r

    except Exception as e:
        r = Receipt.fail(req, "exception", {"error": str(e)})
        write_receipt(r)
        return r
