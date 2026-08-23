#!/usr/bin/env python3
"""Schema-only/source-field mapping repair wrapper for the frozen post-2020 replication.

No scientific feature family, geometry law, model, outcome, threshold, horizon, or success rule
is changed. This wrapper only maps the independent FFIEC export's metadata labels and the
Schedule RC net-loan balance field to the canonical variables already required by the frozen
banking realization.
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
    # The independent CDR subset does not include 2122, but it does include Schedule RC item
    # B529: loans and leases held for investment, net of allowance. FDIC's standardized
    # LNLSNET concept is net loans/leases; use B529 only for the already-frozen loan variable.
    use = list(cands)
    if any(x in {'RCFD2122','RCON2122','RCFD2125','RCON2125'} for x in use):
        use += ['RCFDB529','RCONB529']
    out = pd.Series(np.nan, index=df.index, dtype=float)
    for c in use:
        if c in df:
            out = out.fillna(pd.to_numeric(df[c], errors='coerce'))
    return out

mod.get_file = schema_normalized_get_file
mod.coalesce = source_mapped_coalesce

if __name__ == '__main__':
    mod.main()
