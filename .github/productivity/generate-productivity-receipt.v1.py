#!/usr/bin/env python3
import json,re,subprocess
from datetime import datetime,timedelta,timezone
from pathlib import Path
P={"product":r"earth|audralia|hearth|auren|education|compass|governance.bridge|model|presentation|character|world|product|showroom","qualification":r"qualif|test|proof|verify|validation|browser|exact.head|evidence","repair":r"repair|fix|restore|correct|reconcile|rollback|recover|regression","governance":r"governance|control.plane|admission|authority|router|routing|dispatch|receipt|ledger|lock","publication":r"publish|deploy|release|register|adopt|closure|close|merge|live","reuse":r"reuse|shared|portable|extract|consume|existing|common|library|capability"}
def git(*a): return subprocess.check_output(["git",*a],text=True).strip()
now=datetime.now(timezone.utc).replace(microsecond=0); start=now-timedelta(days=7); fmt="%Y-%m-%dT%H:%M:%SZ"
raw=git("log","main","--since="+start.strftime(fmt),"--until="+now.strftime(fmt),"--pretty=%H%x09%s")
rows=[x.split("\t",1) for x in raw.splitlines() if x]
auto=sum(bool(re.search(r"analytics|snapshot|heartbeat|automated|bot",m,re.I)) for _,m in rows); meaningful=max(0,len(rows)-auto)
signals={k:sum(bool(re.search(v,m,re.I)) for _,m in rows) for k,v in P.items()}; d=meaningful or 1
receipt={"schema":"DGB_PRODUCTIVITY_RECEIPT_v1","generatedAt":now.strftime(fmt),"window":{"start":start.strftime(fmt),"end":now.strftime(fmt)},"source":{"repository":"smansfield635-create/smansfield635-create.github.io","ref":"main","headSha":git("rev-parse","main"),"historicalBaseline":"project-records/dgb-longitudinal-productivity-audit-2026-09-29.md"},"activity":{"mainlineCommits":len(rows),"automationCommits":auto,"meaningfulCommits":meaningful},"signals":signals,"derived":{"productShare":round(signals["product"]/d,4),"qualificationDensity":round(signals["qualification"]/d,4),"repairBurden":round(signals["repair"]/d,4),"governanceCost":round(signals["governance"]/d,4),"closureSignal":round(signals["publication"]/d,4),"reuseSignal":round(signals["reuse"]/d,4)},"interpretationBoundary":"Signal classifications may overlap. Commit counts are repository activity, not equivalent human labor. Human execution burden and abstraction level require separate evidence and are not inferred from commit volume."}
Path("productivity-receipts").mkdir(exist_ok=True); Path("productivity-receipts/latest.json").write_text(json.dumps(receipt,indent=2)+"\n"); print(json.dumps(receipt,indent=2))
