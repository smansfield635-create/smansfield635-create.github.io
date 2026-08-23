#!/usr/bin/env python3
"""IMI v3 — lawful pre-2019 history extension for the frozen post-2020 replication.

Scientific contract:
- Keep the 2022-2023 held-out evaluation years unchanged.
- Keep the six maneuverability geometry features unchanged.
- Keep the exact 103-feature conventional-history challenger unchanged.
- Keep the learner, 8-quarter horizon, and success thresholds unchanged.
- Add only pre-2019 FFIEC history needed to create leakage-purged mature training rows.
- Replace the unavailable BankFind endpoint with the official FDIC failed-bank listing, parsed without performance-contingent filtering.

2019-2023 remains byte/source-compatible with the already-qualified independent Call Report mirror.
2014-2018 is fetched directly from the FFIEC CDR four-period tab-delimited bulk product.
"""
import importlib.util
from pathlib import Path
import io
import json
import re
import zipfile
import numpy as np
import pandas as pd
import requests

from ffiec_data_collector import FFIECDownloader, Product, FileFormat

ROOT = Path(__file__).resolve().parent
TARGET = ROOT / 'post2020_maneuverability_final_replication_v1.py'
spec = importlib.util.spec_from_file_location('frozen_replication', TARGET)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# Frozen model/evaluation protocol is inherited from TARGET. Only the history window expands.
mod.YEARS = list(range(2014, 2024))

MIRROR_BASE = mod.BASE
_HIST_CACHE = {}
_DL = FFIECDownloader()


def canon(s):
    return re.sub(r'[^A-Z0-9]+', '_', str(s).strip().upper()).strip('_')


def normalize_columns(df):
    raw_cols = list(df.columns)
    df = df.copy()
    df.columns = [canon(c) for c in raw_cols]
    aliases = {}
    for c in list(df.columns):
        compact = c.replace('_', '')
        if compact in {'IDRSSD','RSSDID','RSSD'}:
            aliases[c] = 'ID_RSSD'
        elif compact in {'ASOFDT','ASOFDATE','REPORTINGPERIODENDDATE','REPORTDATE','CALLREPORTDATE'}:
            aliases[c] = 'AS_OF_DT'
        elif compact in {'FDICCERTIFICATE','FDICCERTIFICATENUMBER','FDICCERT','CERT','CERTIFICATE'}:
            aliases[c] = 'FDIC_CERTIFICATE'
    return df.rename(columns=aliases)


def mirror_get_file(year, half):
    name = f'FFIEC CDR Call Subset of Schedules {year}({half} of 2).txt'
    url = MIRROR_BASE + name.replace(' ', '%20')
    r = requests.get(url, timeout=180)
    r.raise_for_status()
    return normalize_columns(pd.read_csv(io.BytesIO(r.content), sep='\t', dtype=str, low_memory=False))


def _download_historical_year(year):
    if year in _HIST_CACHE:
        return _HIST_CACHE[year]
    periods = _DL.select_product(Product.CALL_FOUR_PERIODS)
    matches = [p for p in periods if str(year) in str(p.date_str)]
    if not matches:
        raise RuntimeError(f'FFIEC four-period product has no reporting option for {year}; sample={[p.date_str for p in periods[:12]]}')
    # Prefer a year-end/12-31 option when the interface exposes quarter dates.
    matches = sorted(matches, key=lambda p: ('12/31' not in str(p.date_str), str(p.date_str)))
    content = _DL.download(Product.CALL_FOUR_PERIODS, matches[0], FileFormat.TSV, save_to_disk=False)
    if not hasattr(content, 'read'):
        raise RuntimeError(f'FFIEC download failed for {year}: {content}')
    content.seek(0)
    with zipfile.ZipFile(content) as zf:
        names = [n for n in zf.namelist() if n.lower().endswith('.txt')]
        picked = {}
        for half in (1, 2):
            exact = [n for n in names if str(year) in n and f'({half} of 2)' in n and 'subset' in n.lower()]
            if not exact:
                exact = [n for n in names if str(year) in n and f'{half} of 2' in n.lower()]
            if not exact:
                raise RuntimeError(f'Could not identify {year} half {half} in FFIEC archive; names={names[:40]}')
            with zf.open(exact[0]) as fh:
                picked[half] = normalize_columns(pd.read_csv(fh, sep='\t', dtype=str, low_memory=False))
    _HIST_CACHE[year] = picked
    print(f'FFIEC_HISTORY_YEAR={year} HALF1_ROWS={len(picked[1])} HALF2_ROWS={len(picked[2])}')
    return picked


def extended_get_file(year, half):
    if year >= 2019:
        return mirror_get_file(year, half)
    return _download_historical_year(year)[half].copy()


def source_mapped_coalesce(df, cands):
    use = list(cands)
    if any(x in {'RCFD2122','RCON2122','RCFD2125','RCON2125'} for x in use):
        # B529 is loans and leases net of unearned income and allowance in the qualified subset realization.
        use += ['RCFDB529','RCONB529']
    out = pd.Series(np.nan, index=df.index, dtype=float)
    for c in use:
        if c in df:
            out = out.fillna(pd.to_numeric(df[c], errors='coerce'))
    return out


def official_failure_table():
    url = 'https://www.fdic.gov/bank-failures/failed-bank-list?combine=&items_per_page=All&order=field_date_only&sort=asc'
    r = requests.get(url, timeout=120, headers={'User-Agent':'Mozilla/5.0'})
    r.raise_for_status()
    tabs = pd.read_html(io.StringIO(r.text))
    chosen = None
    for t in tabs:
        cols = [str(c).strip().upper() for c in t.columns]
        if any(c == 'CERT' or 'CERT' in c for c in cols) and any('CLOSING DATE' in c or c == 'DATE' for c in cols):
            chosen = t
            break
    if chosen is None:
        raise RuntimeError(f'Official FDIC failed-bank table not found; tables={len(tabs)}')
    certc = [c for c in chosen.columns if 'CERT' in str(c).upper()][0]
    date_candidates = [c for c in chosen.columns if 'CLOSING DATE' in str(c).upper()]
    if not date_candidates:
        date_candidates = [c for c in chosen.columns if 'DATE' in str(c).upper()]
    datec = date_candidates[0]
    q = pd.DataFrame({
        'cert': pd.to_numeric(chosen[certc], errors='coerce'),
        'faildate': pd.to_datetime(chosen[datec], errors='coerce')
    }).dropna()
    q = q[(q.faildate >= pd.Timestamp('2014-01-01')) & (q.faildate <= pd.Timestamp('2025-12-31'))]
    q['cert'] = q['cert'].astype(int)
    q = q.drop_duplicates(['cert','faildate']).sort_values('faildate').reset_index(drop=True)
    if len(q) < 20:
        raise RuntimeError(f'Implausibly small official FDIC failure table after 2014 filter: {len(q)}')
    print('FDIC_FAILURE_RECORDS_2014_2025=', len(q))
    print(q.tail(20).to_string(index=False))
    return q


mod.get_file = extended_get_file
mod.coalesce = source_mapped_coalesce
mod.failure_table = official_failure_table

# Durable execution declaration separate from the frozen protocol file written by TARGET.
EXTENSION = {
    'execution':'IMI_v3_POST2020_PRE2019_HISTORY_EXTENSION_v1',
    'historical_input_years':[2014,2015,2016,2017,2018],
    'heldout_source_years':[2019,2020,2021,2022,2023],
    'heldout_evaluation_years':[2022,2023],
    'historical_source':'FFIEC CDR official Call Reports -- Balance Sheet, Income Statement, Past Due -- Four Periods, TSV',
    'heldout_source':'qualified independent FFIEC Call Report mirror used in the prior post-2020 execution',
    'outcome_source':'official FDIC failed-bank listing',
    'scientific_changes':'NONE; source-history extension and official outcome retrieval only',
    'frozen_success_rule':mod.SUCCESS,
}
Path('post2020_history_extension_protocol.json').write_text(json.dumps(EXTENSION, indent=2))

if __name__ == '__main__':
    mod.main()
