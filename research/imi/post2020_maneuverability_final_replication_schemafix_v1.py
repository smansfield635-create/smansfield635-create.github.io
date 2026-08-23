#!/usr/bin/env python3
"""Schema-only repair wrapper for the frozen post-2020 maneuverability replication.

No scientific feature, geometry, model, outcome, threshold, horizon, or success rule is changed.
Only raw FFIEC CDR identifier/date column labels are normalized to the canonical names expected
by the frozen implementation.
"""
import importlib.util
from pathlib import Path
import io
import re
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
        elif compact in {'FDICCERTIFICATE','FDICCERT','CERT','CERTIFICATE'}: aliases[c] = 'FDIC_CERTIFICATE'
    df = df.rename(columns=aliases)
    if year == 2019 and half == 1:
        print('RAW_FIRST_25_COLUMNS=', [str(x) for x in raw_cols[:25]])
        print('CANON_FIRST_25_COLUMNS=', list(df.columns[:25]))
        print('ALIASES=', aliases)
    return df

mod.get_file = schema_normalized_get_file

if __name__ == '__main__':
    mod.main()
