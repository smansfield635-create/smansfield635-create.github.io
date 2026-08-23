#!/usr/bin/env python3
"""Schema-only repair wrapper for the frozen post-2020 maneuverability replication.

This changes no scientific feature, geometry, model, outcome, threshold, horizon, or success rule.
It only normalizes raw FFIEC CDR column labels to uppercase/trimmed form so the frozen
implementation can resolve ID_RSSD / AS_OF_DT and MDRM names consistently.
"""
import importlib.util
from pathlib import Path
import io
import pandas as pd
import requests

TARGET = Path(__file__).with_name('post2020_maneuverability_final_replication_v1.py')
spec = importlib.util.spec_from_file_location('frozen_replication', TARGET)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

def schema_normalized_get_file(year, half):
    name = f'FFIEC CDR Call Subset of Schedules {year}({half} of 2).txt'
    url = mod.BASE + name.replace(' ', '%20')
    r = requests.get(url, timeout=180)
    r.raise_for_status()
    df = pd.read_csv(io.BytesIO(r.content), sep='\t', dtype=str, low_memory=False)
    df.columns = [str(c).strip().upper() for c in df.columns]
    return df

mod.get_file = schema_normalized_get_file

if __name__ == '__main__':
    mod.main()
