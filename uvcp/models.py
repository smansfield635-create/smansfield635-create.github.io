from pydantic import BaseModel
from typing import Optional, Dict, Any, Literal
import uuid, time

AdapterName = Literal["kvm", "hyperv"]

class OperationRequest(BaseModel):
    adapter: AdapterName = "kvm"
    op: Literal["start", "stop", "reboot"]
    target: str
    params: Optional[Dict[str, Any]] = None

class Receipt:
    @staticmethod
    def ok(req: OperationRequest, detail: dict, verified: bool):
        return {
            "receipt_id": str(uuid.uuid4()),
            "adapter": req.adapter,
            "op": req.op,
            "target": req.target,
            "ts": int(time.time()),
            "status": "ok" if verified else "degraded",
            "detail": detail,
        }

    @staticmethod
    def fail(req: OperationRequest, reason: str, detail: dict = None):
        return {
            "receipt_id": str(uuid.uuid4()),
            "adapter": req.adapter,
            "op": req.op,
            "target": req.target,
            "ts": int(time.time()),
            "status": "fail",
            "detail": {"reason": reason, **(detail or {})},
        }
