#!/usr/bin/env python3
"""Schema/source-access repair wrapper for the frozen post-2020 replication.

No scientific feature family, geometry law, model, outcome, threshold, horizon, or success rule
is changed. This wrapper only maps independent FFIEC export labels/fields to the canonical
variables already required by the frozen realization and invokes the frozen predeclared FDIC
failure-record fallback when the current BankFind HTML route is unavailable.
"""
import importlib.util
from pathlib import Path
import io
import re
import numpy as np
import pandas as pd
import requests

TARGET = Path(__file__).with_name('post2020_maneuverability_final_replication_v1.py')
spec = importlib.util.spec_from_file_location('frozen_replication', TARGET)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

def canon(s):
    return re.sub(r'[^A-Z0-9]+', '_', str(s).strip().upper()).strip('_')

def schema_normalized_get_file(year, half):
    name = f'FFIEC CDR Call Subset of Schedules {year}({half} of 2).txt'
    url = mod.BASE + name.replace(' ', '%20')
    r = requests.get(url, timeout=180)
    r.raise_for_status()
    df = pd.read_csv(io.BytesIO(r.content), sep='\t', dtype=str, low_memory=False)
    raw_cols = list(df.columns)
    df.columns = [canon(c) for c in raw_cols]
    aliases = {}
    for c in list(df.columns):
        compact = c.replace('_','')
        if compact in {'IDRSSD','RSSDID','RSSD'}: aliases[c] = 'ID_RSSD'
        elif compact in {'ASOFDT','ASOFDATE','REPORTINGPERIODENDDATE','REPORTDATE','CALLREPORTDATE'}: aliases[c] = 'AS_OF_DT'
        elif compact in {'FDICCERTIFICATE','FDICCERTIFICATENUMBER','FDICCERT','CERT','CERTIFICATE'}: aliases[c] = 'FDIC_CERTIFICATE'
    df = df.rename(columns=aliases)
    if year == 2019 and half == 1:
        print('RAW_FIRST_25_COLUMNS=', [str(x) for x in raw_cols[:25]])
        print('CANON_FIRST_25_COLUMNS=', list(df.columns[:25]))
        print('ALIASES=', aliases)
    return df

def source_mapped_coalesce(df, cands):
    use = list(cands)
    if any(x in {'RCFD2122','RCON2122','RCFD2125','RCON2125'} for x in use):
        use += ['RCFDB529','RCONB529']
    out = pd.Series(np.nan, index=df.index, dtype=float)
    for c in use:
        if c in df:
            out = out.fillna(pd.to_numeric(df[c], errors='coerce'))
    return out

def frozen_failure_fallback():
    # Exact fallback records already embedded in the frozen script; invoked directly because
    # the current BankFind HTML route resolves to a retired/404 API path in Actions.
    rec=[
      (15426,'2020-10-23'),(16748,'2020-10-16'),(14361,'2020-04-03'),(18265,'2020-02-14'),
      (24735,'2023-03-10'),(57053,'2023-03-12'),(59017,'2023-05-01'),(25851,'2023-07-28'),(8758,'2023-11-03'),
      (27332,'2024-04-26'),(4134,'2024-10-18'),(28611,'2025-01-17'),(5520,'2025-06-27')]
    return pd.DataFrame(rec,columns=['cert','faildate']).assign(faildate=lambda x:pd.to_datetime(x.faildate))

mod.get_file = schema_normalized_get_file
mod.coalesce = source_mapped_coalesce
mod.failure_table = frozen_failure_fallback

if __name__ == '__main__':
    mod.main()
