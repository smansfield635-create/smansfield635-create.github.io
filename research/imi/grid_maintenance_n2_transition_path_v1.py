#!/usr/bin/env python3
import importlib.util, json, math
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import entropy

ROOT = Path(__file__).resolve().parent
TARGET = ROOT / 'grid_transition_path_topology_severe_test_v1.py'
spec = importlib.util.spec_from_file_location('pathv1', TARGET)
pathv1 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pathv1)
mod = pathv1.mod

SEED = 20260826
RNG = np.random.default_rng(SEED)
N_PER_TOPOLOGY = 28
N_MAINT = 4
PRE_RAMP = 0.10
REC_RAMP = 0.20
mod.SEED = SEED
mod.RNG = RNG

TOPO_FEATURES = ['active_branch_count', 'maintenance_intact_util']
PATH_FEATURES = ['f1', 'f2', 'branch_entropy', 'min_child_frac', 'max_child_frac']
XCOLS = mod.XCOLS + TOPO_FEATURES


def active_mask(m, opened=()):
    mask = m['branch'][:, mod.BR_STATUS] > 0
    for k in opened:
        mask[int(k)] = False
    return mask


def feasible_mask(m, pg, mask):
    if not mod.connected(m, mask):
        return False
    out = mod.flows_sens(m, pg, mask)
    if out[0] is None:
        return False
    idx, f, _, _ = out
    return bool(np.all(np.abs(f) <= mod.rates(m, idx) + 1e-7))


def pair_step_mask(m, pg, mask, i, j):
    idx, f, S, on = mod.flows_sens(m, pg, mask)
    if idx is None:
        return 0.0
    gen = m['gen']
    gi, gj = on[i], on[j]
    glim = max(0.0, min(float(gen[gi, mod.PMAX] - pg[gi]), float(pg[gj] - gen[gj, mod.PMIN])))
    if glim <= 0:
        return 0.0
    rate = mod.rates(m, idx)
    d = S[:, i] - S[:, j]
    lim = glim
    pos = d > 1e-10
    neg = d < -1e-10
    if np.any(pos):
        lim = min(lim, float(np.min((rate[pos] - f[pos]) / d[pos])))
    if np.any(neg):
        lim = min(lim, float(np.min((-rate[neg] - f[neg]) / d[neg])))
    return max(0.0, lim)


def make_states_for_topology(m, mask, seed_pg, n):
    states = [seed_pg.copy()]
    attempts = 0
    on = np.where(m['gen'][:, mod.GEN_STATUS] > 0)[0]
    while len(states) < n and attempts < 80000:
        attempts += 1
        q = states[int(RNG.integers(len(states)))].copy()
        for _ in range(int(RNG.integers(2, 9))):
            i, j = RNG.choice(len(on), 2, replace=False)
            lim = pair_step_mask(m, q, mask, int(i), int(j))
            if lim > 1e-5:
                step = float(lim * RNG.uniform(0.08, 0.90))
                q[on[i]] += step
                q[on[j]] -= step
        if feasible_mask(m, q, mask) and all(np.linalg.norm(q - s) > 0.05 for s in states):
            states.append(q)
    if len(states) < n:
        raise RuntimeError(f'only generated {len(states)} states for maintenance topology')
    return states


def choose_maintenance_topologies(m, base_pg, global_candidates):
    chosen = []
    seeds = {}
    for k in global_candidates:
        mask = active_mask(m, [k])
        if not mod.connected(m, mask):
            continue
        q = pathv1.corrective(m, base_pg, mask, 1.0, 1.0)
        if q is not None:
            chosen.append(int(k))
            seeds[int(k)] = q
    if len(chosen) != N_MAINT:
        raise RuntimeError(f'pre-outcome feasibility audit expected {N_MAINT} maintenance topologies, found {len(chosen)}')
    return chosen, seeds


def intact_util_of_line(m, pg, line):
    idx, f, _, _ = mod.flows_sens(m, pg)
    fmap = {int(k): float(v) for k, v in zip(idx, f)}
    row = m['branch'][line]
    rate = float(row[mod.RATE_A]) if row[mod.RATE_A] > 1e-6 else 1e9
    return abs(fmap.get(int(line), 0.0)) / rate


def graph_features(m, pg, base_mask, global_candidates):
    eligible = [int(k) for k in global_candidates if base_mask[int(k)]]
    children = []
    n1 = 0
    n2 = 0
    for c in eligible:
        mask1 = base_mask.copy(); mask1[c] = False
        q1 = pathv1.corrective(m, pg, mask1, PRE_RAMP, 1.0)
        if q1 is None:
            continue
        n1 += 1
        cc = 0
        for d in eligible:
            if d == c:
                continue
            mask2 = mask1.copy(); mask2[d] = False
            q2 = pathv1.corrective(m, q1, mask2, PRE_RAMP, 1.0)
            if q2 is not None:
                cc += 1; n2 += 1
        children.append(cc)
    ne = len(eligible)
    f1 = n1 / ne if ne else 0.0
    f2 = n2 / (ne * (ne - 1)) if ne > 1 else 0.0
    if len(children) > 1 and sum(children) > 0:
        p = np.asarray(children, float) / sum(children)
        bent = float(entropy(p) / math.log(len(children)))
    else:
        bent = 0.0
    if children and ne > 1:
        fr = np.asarray(children, float) / (ne - 1)
        mn = float(fr.min()); mx = float(fr.max())
    else:
        mn = mx = 0.0
    return {'f1': float(f1), 'f2': float(f2), 'branch_entropy': bent,
            'min_child_frac': mn, 'max_child_frac': mx,
            'path_n1': int(n1), 'path_n2': int(n2)}


def contingency_rows(m, pg, base_mask):
    idx, f, _, _ = mod.flows_sens(m, pg, base_mask)
    fmap = {int(k): float(v) for k, v in zip(idx, f)}
    nb = len(m['bus']); deg = np.zeros(nb, int)
    for k, row in enumerate(m['branch']):
        if base_mask[k]:
            deg[int(row[mod.F_BUS])] += 1; deg[int(row[mod.T_BUS])] += 1
    out = []
    for k, row in enumerate(m['branch']):
        if not base_mask[k]:
            continue
        mask2 = base_mask.copy(); mask2[k] = False
        if not mod.connected(m, mask2):
            continue
        rt = float(row[mod.RATE_A]) if row[mod.RATE_A] > 1e-6 else 1e9
        cf = {'outage_util': abs(fmap.get(int(k), 0.0)) / rt,
              'outage_rate': min(rt, 1e8), 'outage_x': abs(float(row[mod.BR_X])),
              'deg_from': int(deg[int(row[mod.F_BUS])]), 'deg_to': int(deg[int(row[mod.T_BUS])])}
        out.append((int(k), cf))
    return out


def recover_n2(m, pg, base_mask, outage, global_candidates):
    mask2 = base_mask.copy(); mask2[outage] = False
    q = pathv1.corrective(m, pg, mask2, REC_RAMP, 1.0)
    if q is not None:
        return 1, 0
    for c in global_candidates:
        c = int(c)
        if c == outage or not mask2[c]:
            continue
        mask3 = mask2.copy(); mask3[c] = False
        if not mod.connected(m, mask3):
            continue
        q3 = pathv1.corrective(m, pg, mask3, REC_RAMP, 1.0)
        if q3 is not None:
            return 1, 1
    return 0, -1


def state_features_mask(m, pg, mask):
    idx, f, _, on = mod.flows_sens(m, pg, mask)
    rate = mod.rates(m, idx); util = np.abs(f) / rate
    g = m['gen'][on]; p = pg[on]
    up = np.maximum(0, g[:, mod.PMAX] - p); dn = np.maximum(0, p - g[:, mod.PMIN])
    span = np.maximum(1e-9, g[:, mod.PMAX] - g[:, mod.PMIN]); load = float(m['bus'][:, mod.PD].sum())
    return {'max_util': float(util.max()), 'mean_util': float(util.mean()), 'std_util': float(util.std()),
            'p95_util': float(np.quantile(util, .95)), 'up_headroom_ratio': float(up.sum()/load),
            'down_headroom_ratio': float(dn.sum()/load), 'min_up_frac': float(np.min(up/span)),
            'min_down_frac': float(np.min(dn/span)), 'dispatch_hhi': mod.hhi(p),
            'headroom_hhi': mod.hhi(up+dn)}


def main():
    raw, source_sha = mod.load_case(); m = mod.internalize(raw)
    base_pg = pathv1.balanced_seed(m)
    global_candidates = pathv1.frozen_switch_candidates(m, base_pg)
    maint_lines, maint_seed = choose_maintenance_topologies(m, base_pg, global_candidates)

    rows = []; states_out = []; sid = 0
    for topo_id, maint in enumerate(maint_lines):
        base_mask = active_mask(m, [maint])
        states = make_states_for_topology(m, base_mask, maint_seed[maint], N_PER_TOPOLOGY)
        for pg in states:
            gf = graph_features(m, pg, base_mask, global_candidates)
            sf = state_features_mask(m, pg, base_mask)
            topo = {'active_branch_count': int(base_mask.sum()),
                    'maintenance_intact_util': float(intact_util_of_line(m, pg, maint))}
            ys = []; depths = []
            for outage, cf in contingency_rows(m, pg, base_mask):
                y, depth = recover_n2(m, pg, base_mask, outage, global_candidates)
                ys.append(y); depths.append(depth)
                rows.append({'state': sid, 'topology_fold': topo_id, 'maintenance_line': maint,
                             'second_outage': outage, 'y': y, 'recovery_depth': depth,
                             **sf, **topo, **{k:gf[k] for k in PATH_FEATURES}, **cf})
            states_out.append({'state': sid, 'topology_fold': topo_id, 'maintenance_line': maint,
                               'survival': float(np.mean(ys)), 'n_cont': len(ys),
                               'recovered_direct': int(sum(d == 0 for d in depths)),
                               'recovered_switch': int(sum(d == 1 for d in depths)),
                               **sf, **topo, **gf})
            if sid % 10 == 0:
                print('MAINT_STATE', sid, 'TOPO', topo_id, 'LINE', maint,
                      'SURV', float(np.mean(ys)), 'F1', gf['f1'], 'F2', gf['f2'], flush=True)
            sid += 1

    df = pd.DataFrame(rows); sd = pd.DataFrame(states_out)
    failure_rate = float(1 - df.y.mean())
    signatures = int(sd[PATH_FEATURES].round(10).drop_duplicates().shape[0])
    survival_distinct = int(sd.survival.round(10).nunique())
    evaluable = bool(signatures >= 20 and 0.05 <= failure_rate <= 0.95 and survival_distinct >= 8)

    folds = []; preds = []
    if evaluable:
        for fold in range(N_MAINT):
            tr = df.topology_fold != fold; te = df.topology_fold == fold; y = df.loc[te, 'y'].to_numpy()
            a = mod.mdl(); b = mod.mdl(); a.set_params(random_state=SEED); b.set_params(random_state=SEED)
            a.fit(df.loc[tr, XCOLS], df.loc[tr, 'y'])
            b.fit(df.loc[tr, XCOLS + PATH_FEATURES], df.loc[tr, 'y'])
            p0 = a.predict_proba(df.loc[te, XCOLS])[:,1]; p1 = b.predict_proba(df.loc[te, XCOLS + PATH_FEATURES])[:,1]
            m0 = mod.metrics(y, p0); m1 = mod.metrics(y, p1)
            rel = (m0['brier'] - m1['brier']) / m0['brier']
            z = df.loc[te, ['state','topology_fold','maintenance_line','second_outage','y']].copy()
            z['p_base'] = p0; z['p_aug'] = p1; preds.append(z)
            st = z.groupby('state').agg(y=('y','mean'), p_base=('p_base','mean'), p_aug=('p_aug','mean'))
            mae0 = float(np.mean(np.abs(st.y-st.p_base))); mae1 = float(np.mean(np.abs(st.y-st.p_aug)))
            folds.append({'fold': fold, 'maintenance_line': int(maint_lines[fold]), 'n': int(len(y)),
                          'failures': int((1-y).sum()), 'base': m0, 'aug': m1,
                          'brier_rel_improve': float(rel), 'state_cal_mae_base': mae0,
                          'state_cal_mae_aug': mae1})
        pred = pd.concat(preds, ignore_index=True)
        pool0 = mod.metrics(pred.y, pred.p_base); pool1 = mod.metrics(pred.y, pred.p_aug)
        pooled_rel = (pool0['brier'] - pool1['brier']) / pool0['brier']
        auc_delta = pool1['auroc'] - pool0['auroc']
        brier_wins = sum(x['aug']['brier'] < x['base']['brier'] for x in folds)
        cal_wins = sum(x['state_cal_mae_aug'] < x['state_cal_mae_base'] for x in folds)
        criteria = {'brier_rel_improve_ge_5pct': bool(pooled_rel >= .05),
                    'auroc_delta_nonnegative': bool(auc_delta >= 0),
                    'brier_wins_ge_3_of_4': bool(brier_wins >= 3),
                    'state_calibration_wins_ge_3_of_4': bool(cal_wins >= 3)}
        verdict = 'PASS' if all(criteria.values()) else 'FAIL'
    else:
        pred = pd.DataFrame(); pool0 = {}; pool1 = {}; pooled_rel = None; auc_delta = None
        brier_wins = 0; cal_wins = 0; folds = []; criteria = {}; verdict = 'UNEVALUABLE'

    findings = {'verdict': verdict, 'source_commit': mod.SOURCE_COMMIT, 'source_sha256': source_sha,
                'seed': SEED, 'maintenance_lines': [int(x) for x in maint_lines],
                'global_switch_candidates': [int(x) for x in global_candidates],
                'n_states': int(len(sd)), 'n_rows': int(len(df)), 'failure_rate': failure_rate,
                'path_signature_count': signatures, 'survival_distinct': survival_distinct,
                'survival_min': float(sd.survival.min()), 'survival_max': float(sd.survival.max()),
                'pooled_base': pool0, 'pooled_aug': pool1, 'pooled_brier_rel_improve': pooled_rel,
                'pooled_auroc_delta': auc_delta, 'brier_fold_wins': brier_wins,
                'state_calibration_fold_wins': cal_wins, 'folds': folds, 'criteria': criteria,
                'recovery_depth_counts': {str(k): int((df.recovery_depth == k).sum()) for k in [-1,0,1]}}
    Path('grid_maintenance_n2_transition_path_findings_v1.json').write_text(json.dumps(findings, indent=2))
    df.to_csv('grid_maintenance_n2_transition_path_rows_v1.csv', index=False)
    sd.to_csv('grid_maintenance_n2_transition_path_states_v1.csv', index=False)
    if len(pred): pred.to_csv('grid_maintenance_n2_transition_path_predictions_v1.csv', index=False)
    Path('GRID_MAINTENANCE_N2_TRANSITION_PATH_VERDICT_v1.txt').write_text(verdict+'\n'+json.dumps(findings, indent=2))
    print(json.dumps(findings, indent=2), flush=True)


if __name__ == '__main__':
    main()
