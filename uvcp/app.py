from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import OperationRequest
from engine.executor import execute, get_adapter
from store.db import init_db, get_receipts, get_state

app = FastAPI(title="UVCP v0")

# Allow website calls (tighten later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/state")
def state():
    return get_state()

@app.get("/receipts")
def receipts(limit: int = 50):
    return get_receipts(limit=limit)

@app.get("/inventory/targets")
def inventory_targets(adapter: str = "kvm"):
    a = get_adapter(adapter)
    return {"adapter": adapter, "targets": a.list_targets()}

@app.post("/operate")
def operate(req: OperationRequest):
    return execute(req)
