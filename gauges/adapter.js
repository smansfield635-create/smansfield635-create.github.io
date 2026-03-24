const RECEIPT_KEY="__AUTHORITY_RECEIPT__";
const STORAGE_KEY="cte_runtime_v4";

function safe(obj, path){
  let cur = obj;
  for(const k of path){
    if(!cur || typeof cur !== "object") return undefined;
    cur = cur[k];
  }
  return cur;
}

export function readReceipt(){
  const win = window[RECEIPT_KEY];
  if(win && typeof win === "object") return win;

  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  }catch{
    return null;
  }
}

export function read(path, receipt){
  return safe(receipt, path);
}

export function text(v){
  if(v === null || v === undefined || v === "") return "—";
  return String(v);
}

export function bool(v){
  return v === true ? "true" : v === false ? "false" : "—";
}
