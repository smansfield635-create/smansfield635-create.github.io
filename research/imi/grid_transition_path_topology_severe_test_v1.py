#!/usr/bin/env python3
import importlib.util, json, math
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.optimize import linprog
from scipy.stats import spearmanr

ROOT = Path(__file__).resolve().parent
TARGET = ROOT / 'grid_stressed_maneuverability_replication_v1.py'
spec = importlib.util.spec_from_file_location('gridbase', TARGET)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

SEED = 20260825
RNG = np.random.default_rng(SEED)
PERM_RNG = np.random.default_rng(SEED + 99)
N_STATES = 160
K_SWITCH = 12
PRE_RAMP = 0.10
REC_RAMP = 0.20
EMERGENCY_RATE = 1.20
mod.SEED = SEED
mod.RNG = RNG


def balanced_seed(m):
    gen = m['gen']
    on = np.where(gen[:, mod.GEN_STATUS] > 0)[0]
    q = gen[:, mod.PG].copy()
    q[on] = np.minimum(np.maximum(q[on], gen[on, mod.PMIN]), gen[on, mod.PMAX])
    target = float(m['bus'][:, mod.PD].sum())
    delta = target - float(q[on].sum())
    if delta > 0:
        for gi in on:
            take = min(delta, max(0.0, float(gen[gi, mod.PMAX] - q[gi])))
            q[gi] += take
            delta -= take
            if delta <= 1e-9:
                break
    elif delta < 0:
        need = -delta
        for gi in on:
            take = min(need, max(0.0, float(q[gi] - gen[gi, mod.PMIN])))
            q[gi] -= take
            need -= take
            if need <= 1e-9:
                break
        delta = -need
    if abs(delta) > 1e-6:
        raise RuntimeError(f'cannot balance published load within generator bounds: residual={delta}')
    return mod.repair_feasible(m, q)


def make_states(m, n):
    base = balanced_seed(m)
    states = [base.copy()]
    attempts = 0
    while len(states) < n and attempts < 60000:
        attempts += 1
        q = states[int(RNG.integers(len(states)))].copy()
        on = np.where(m['gen'][:, mod.GEN_STATUS] > 0)[0]
        for _ in range(int(RNG.integers(2, 10))):
            i, j = RNG.choice(len(on), 2, replace=False)
            lim, _ = mod.pair_step(m, q, int(i), int(j))
            if lim > 1e-5:
                step = float(lim * RNG.uniform(0.08, 0.95))
                q[on[i]] += step
                q[on[j]] -= step
        if mod.feasible(m, q) and all(np.linalg.norm(q - s) > 0.05 for s in states):
            states.append(q)
    if len(states) < n:
        raise RuntimeError(f'only generated {len(states)} states')
    return states


def corrective(m, pg, mask, ramp_frac, rate_scale=1.0):
    if not mod.connected(m, mask):
        return None
    out = mod.flows_sens(m, pg, mask)
    if out[0] is None:
        return None
    idx, f, S, on = out
    rate = mod.rates(m, idx) * rate_scale
    g = m['gen'][on]
    p = pg[on]
    ramp = ramp_frac * np.maximum(0.0, g[:, mod.PMAX] - g[:, mod.PMIN])
    lo = np.maximum(g[:, mod.PMIN] - p, -ramp)
    hi = np.minimum(g[:, mod.PMAX] - p, ramp)
    A = np.vstack([S, -S])
    b = np.concatenate([rate - f, rate + f])
    res = linprog(np.zeros(len(on)), A_ub=A, b_ub=b,
                  A_eq=np.ones((1, len(on))), b_eq=[0.0],
                  bounds=list(zip(lo, hi)), method='highs')
    if not res.success:
        return None
    q = pg.copy()
    q[on] += res.x
    return q


def frozen_switch_candidates(m, base_pg):
    active = m['branch'][:, mod.BR_STATUS] > 0
    idx, f, _, _ = mod.flows_sens(m, base_pg)
    fmap = {int(k): float(v) for k, v in zip(idx, f)}
    scored = []
    for k, row in enumerate(m['branch']):
        if not active[k]:
            continue
        mask = active.copy()
        mask[k] = False
        if not mod.connected(m, mask):
            continue
        rate = float(row[mod.RATE_A]) if row[mod.RATE_A] > 1e-6 else 1e9
        util = abs(fmap.get(k, 0.0)) / rate
        scored.append((util, k))
    scored.sort(reverse=True)
    out = [k for _, k in scored[:K_SWITCH]]
    if len(out) != K_SWITCH:
        raise RuntimeError(f'only {len(out)} non-islanding candidate switches')
    return out


def path_score(m, pg, candidates):
    active = m['branch'][:, mod.BR_STATUS] > 0
    n1 = 0
    n2 = 0
    for c in candidates:
        mask1 = active.copy()
        mask1[c] = False
        q1 = corrective(m, pg, mask1, PRE_RAMP, 1.0)
        if q1 is None:
            continue
        n1 += 1
        for d in candidates:
            if d == c:
                continue
            mask2 = mask1.copy()
            mask2[d] = False
            q2 = corrective(m, q1, mask2, PRE_RAMP, 1.0)
            if q2 is not None:
                n2 += 1
    f1 = n1 / len(candidates)
    f2 = n2 / (len(candidates) * (len(candidates) - 1))
    P = 0.5 * (f1 + f2)
    return float(P), int(n1), int(n2), float(f1), float(f2)


def recover(m, pg, outage, candidates):
    active = m['branch'][:, mod.BR_STATUS] > 0
    mask0 = active.copy()
    mask0[outage] = False
    if not mod.connected(m, mask0):
        return 0, -1

    q0 = corrective(m, pg, mask0, REC_RAMP, 1.0)
    if q0 is not None:
        return 1, 0

    for c in candidates:
        if c == outage or not mask0[c]:
            continue
        mask1 = mask0.copy()
        mask1[c] = False
        if not mod.connected(m, mask1):
            continue
        q1 = corrective(m, pg, mask1, REC_RAMP, 1.0)
        if q1 is not None:
            return 1, 1

    # Depth 2: first transition may use the preregistered 120% emergency rating,
    # but the second must restore normal published ratings.
    for c in candidates:
        if c == outage or not mask0[c]:
            continue
        mask1 = mask0.copy()
        mask1[c] = False
        if not mod.connected(m, mask1):
            continue
        q1e = corrective(m, pg, mask1, REC_RAMP, EMERGENCY_RATE)
        if q1e is None:
            continue
        for d in candidates:
            if d == outage or d == c or not mask1[d]:
                continue
            mask2 = mask1.copy()
            mask2[d] = False
            if not mod.connected(m, mask2):
                continue
            q2 = corrective(m, q1e, mask2, REC_RAMP, 1.0)
            if q2 is not None:
                return 1, 2
    return 0, -1


def permutation_p(vals, groups, observed, nperm=10000):
    vals = np.asarray(vals, float)
    n_top, n_bottom = groups
    count = 0
    for _ in range(nperm):
        p = PERM_RNG.permutation(vals)
        d = float(np.mean(p[:n_top]) - np.mean(p[n_top:n_top+n_bottom]))
        if abs(d) >= abs(observed) - 1e-15:
            count += 1
    return (count + 1) / (nperm + 1)


def main():
    raw, source_sha = mod.load_case()
    m = mod.internalize(raw)
    base_pg = balanced_seed(m)
    candidates = frozen_switch_candidates(m, base_pg)
    states = make_states(m, N_STATES)
    rows = []
    srows = []

    for sid, pg in enumerate(states):
        P, n1, n2, f1, f2 = path_score(m, pg, candidates)
        sf = mod.state_features(m, pg)
        ys = []
        depths = []
        for k, cf in mod.contingencies(m, pg):
            y, depth = recover(m, pg, int(k), candidates)
            ys.append(y)
            depths.append(depth)
            rows.append({'state': sid, 'fold': sid % 5, 'P': P, 'y': y,
                         'recovery_depth': depth, 'branch': int(k), **sf, **cf})
        surv = float(np.mean(ys))
        srows.append({'state': sid, 'fold': sid % 5, 'P': P, 'survival': surv,
                      'n_cont': len(ys), 'path_n1': n1, 'path_n2': n2,
                      'path_f1': f1, 'path_f2': f2,
                      'recovered_depth0': int(sum(d == 0 for d in depths)),
                      'recovered_depth1': int(sum(d == 1 for d in depths)),
                      'recovered_depth2': int(sum(d == 2 for d in depths)), **sf})
        if sid % 10 == 0:
            print('PATH_STATE', sid, 'P', P, 'SURV', surv, 'N1', n1, 'N2', n2, flush=True)

    df = pd.DataFrame(rows)
    sd = pd.DataFrame(srows)
    failure_rate = float(1.0 - df.y.mean())
    p_distinct = int(sd.P.round(12).nunique())
    s_distinct = int(sd.survival.round(12).nunique())
    evaluable = bool(p_distinct >= 20 and 0.05 <= failure_rate <= 0.95 and s_distinct >= 20)

    ordered = sd.sort_values('P').reset_index(drop=True)
    q = len(ordered) // 4
    bottom = float(ordered.iloc[:q].survival.mean())
    top = float(ordered.iloc[-q:].survival.mean())
    qdiff = top - bottom
    perm_p = permutation_p(sd.survival.to_numpy(), (q, q), qdiff)
    rho, rho_p = spearmanr(sd.P, sd.survival)

    preds = []
    folds = []
    if evaluable:
        for fold in range(5):
            tr = df.fold != fold
            te = df.fold == fold
            y = df.loc[te, 'y'].to_numpy()
            a = mod.mdl()
            b = mod.mdl()
            a.set_params(random_state=SEED)
            b.set_params(random_state=SEED)
            a.fit(df.loc[tr, mod.XCOLS], df.loc[tr, 'y'])
            b.fit(df.loc[tr, mod.XCOLS + ['P']], df.loc[tr, 'y'])
            p0 = a.predict_proba(df.loc[te, mod.XCOLS])[:, 1]
            p1 = b.predict_proba(df.loc[te, mod.XCOLS + ['P']])[:, 1]
            m0 = mod.metrics(y, p0)
            m1 = mod.metrics(y, p1)
            rel = (m0['brier'] - m1['brier']) / m0['brier']
            folds.append({'fold': fold, 'n': len(y), 'failures': int((1-y).sum()),
                          'base': m0, 'aug': m1, 'brier_rel_improve': float(rel)})
            z = df.loc[te, ['state', 'fold', 'P', 'y', 'branch', 'recovery_depth']].copy()
            z['p_base'] = p0
            z['p_aug'] = p1
            preds.append(z)
        pred = pd.concat(preds, ignore_index=True)
        pool0 = mod.metrics(pred.y, pred.p_base)
        pool1 = mod.metrics(pred.y, pred.p_aug)
        pooled_rel = (pool0['brier'] - pool1['brier']) / pool0['brier']
        auc_delta = pool1['auroc'] - pool0['auroc']
        wins = sum(x['aug']['brier'] < x['base']['brier'] for x in folds)
        criteria = {
            'brier_rel_improve_ge_5pct': bool(pooled_rel >= 0.05),
            'auroc_delta_nonnegative': bool(auc_delta >= 0.0),
            'brier_wins_ge_4_of_5': bool(wins >= 4),
            'spearman_positive_p_lt_0_01': bool(np.isfinite(rho) and rho > 0 and rho_p < 0.01),
            'top_quartile_higher_perm_p_lt_0_01': bool(qdiff > 0 and perm_p < 0.01),
        }
        verdict = 'PASS' if all(criteria.values()) else 'FAIL'
    else:
        pred = pd.DataFrame()
        pool0 = {}
        pool1 = {}
        pooled_rel = None
        auc_delta = None
        wins = 0
        criteria = {}
        verdict = 'UNEVALUABLE'

    findings = {
        'verdict': verdict,
        'source_url': mod.SOURCE_URL,
        'source_commit': mod.SOURCE_COMMIT,
        'source_sha256': source_sha,
        'seed': SEED,
        'n_states': int(len(sd)),
        'n_rows': int(len(df)),
        'switch_candidates': [int(x) for x in candidates],
        'failure_rate': failure_rate,
        'P_min': float(sd.P.min()),
        'P_max': float(sd.P.max()),
        'P_distinct': p_distinct,
        'survival_distinct': s_distinct,
        'spearman_rho': None if not np.isfinite(rho) else float(rho),
        'spearman_p': None if not np.isfinite(rho_p) else float(rho_p),
        'bottom_P_quartile_survival': bottom,
        'top_P_quartile_survival': top,
        'quartile_survival_diff': qdiff,
        'quartile_permutation_p': perm_p,
        'pooled_base': pool0,
        'pooled_aug': pool1,
        'pooled_brier_rel_improve': pooled_rel,
        'pooled_auroc_delta': auc_delta,
        'fold_brier_wins': wins,
        'folds': folds,
        'criteria': criteria,
        'recovery_depth_counts': {str(k): int((df.recovery_depth == k).sum()) for k in [-1, 0, 1, 2]},
    }

    Path('grid_transition_path_topology_findings_v1.json').write_text(json.dumps(findings, indent=2))
    df.to_csv('grid_transition_path_topology_rows_v1.csv', index=False)
    sd.to_csv('grid_transition_path_topology_states_v1.csv', index=False)
    if len(pred):
        pred.to_csv('grid_transition_path_topology_predictions_v1.csv', index=False)
    Path('GRID_TRANSITION_PATH_TOPOLOGY_VERDICT_v1.txt').write_text(verdict + '\n' + json.dumps(findings, indent=2))
    print(json.dumps(findings, indent=2), flush=True)


if __name__ == '__main__':
    main()
