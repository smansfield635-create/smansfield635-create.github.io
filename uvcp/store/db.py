import sqlite3, time, json

DB = "uvcp.db"

def init_db():
    c = sqlite3.connect(DB)
    cur = c.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS receipts (id TEXT, ts INT, data TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS state (k TEXT PRIMARY KEY, v TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS inventory (k TEXT PRIMARY KEY, v TEXT)")
    c.commit()
    c.close()

def write_receipt(r: dict):
    c = sqlite3.connect(DB)
    cur = c.cursor()
    cur.execute("INSERT INTO receipts VALUES (?,?,?)", (r["receipt_id"], r["ts"], json.dumps(r)))
    c.commit()
    c.close()

def update_state(adapter: str, target: str, snapshot: dict):
    c = sqlite3.connect(DB)
    cur = c.cursor()
    cur.execute("INSERT OR REPLACE INTO state VALUES (?,?)", ("last_adapter", adapter))
    cur.execute("INSERT OR REPLACE INTO state VALUES (?,?)", ("last_target", target))
    cur.execute("INSERT OR REPLACE INTO state VALUES (?,?)", ("updated", str(int(time.time()))))
    cur.execute("INSERT OR REPLACE INTO state VALUES (?,?)", ("snapshot", json.dumps(snapshot)))
    c.commit()
    c.close()

def set_inventory(key: str, payload: dict):
    c = sqlite3.connect(DB)
    cur = c.cursor()
    cur.execute("INSERT OR REPLACE INTO inventory VALUES (?,?)", (key, json.dumps(payload)))
    c.commit()
    c.close()

def get_receipts(limit: int = 50):
    c = sqlite3.connect(DB)
    cur = c.cursor()
    rows = cur.execute("SELECT data FROM receipts ORDER BY ts DESC LIMIT ?", (limit,)).fetchall()
    c.close()
    return [json.loads(r[0]) for r in rows]

def get_state():
    c = sqlite3.connect(DB)
    cur = c.cursor()
    rows = cur.execute("SELECT k,v FROM state").fetchall()
    c.close()
    out = {k:v for k,v in rows}
    if "snapshot" in out:
        try: out["snapshot"] = json.loads(out["snapshot"])
        except: pass
    return out

def get_inventory():
    c = sqlite3.connect(DB)
    cur = c.cursor()
    rows = cur.execute("SELECT k,v FROM inventory").fetchall()
    c.close()
    out = {}
    for k,v in rows:
        try: out[k] = json.loads(v)
        except: out[k] = v
    return out
