-- A3D-E / PCR Empirical Validation Schema v1.0.0
-- Target: PostgreSQL 14+
--
-- Purpose:
-- Preserve the relational evidence structure for the A3D-E / PCR empirical validation track.
--
-- Scientific standing:
-- This schema supports reproducible empirical testing.
-- It does not, by itself, prove a universal law.

BEGIN;

-- ============================================================
-- 1. DOMAIN REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS domain_registry (
    domain_id VARCHAR(64) PRIMARY KEY,
    domain_name VARCHAR(255) NOT NULL,
    sampling_frequency VARCHAR(64) NOT NULL,
    outcome_type VARCHAR(128) NOT NULL,
    validation_status VARCHAR(64) NOT NULL
);

-- ============================================================
-- 2. METRIC REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS metric_registry (
    metric_id VARCHAR(64) PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    raw_metric_name VARCHAR(255) NOT NULL,
    operational_role VARCHAR(64) NOT NULL,
    min_value NUMERIC(20, 6) NOT NULL,
    max_value NUMERIC(20, 6) NOT NULL,
    normalization_method VARCHAR(128) NOT NULL,
    source_url TEXT,
    version VARCHAR(64) NOT NULL,

    CONSTRAINT fk_metric_domain
        FOREIGN KEY (domain_id)
        REFERENCES domain_registry(domain_id),

    CONSTRAINT chk_operational_role
        CHECK (operational_role IN ('PRESSURE', 'CAPACITY', 'CAPACITY_DAMAGE')),

    CONSTRAINT chk_metric_bounds
        CHECK (max_value > min_value)
);

CREATE INDEX IF NOT EXISTS idx_metric_domain
ON metric_registry(domain_id);

-- ============================================================
-- 3. VALIDATION CONFIGURATION
-- ============================================================

CREATE TABLE IF NOT EXISTS validation_config_table (
    config_id VARCHAR(64) PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    forward_window INTERVAL NOT NULL,
    baseline_model_name VARCHAR(128) NOT NULL,
    epsilon_k NUMERIC(20, 6) NOT NULL DEFAULT 0.001000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_validation_domain
        FOREIGN KEY (domain_id)
        REFERENCES domain_registry(domain_id),

    CONSTRAINT chk_epsilon_positive
        CHECK (epsilon_k > 0)
);

CREATE INDEX IF NOT EXISTS idx_validation_domain_active
ON validation_config_table(domain_id, is_active);

-- ============================================================
-- 4. RAW OBSERVATION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS observation_table (
    observation_id BIGSERIAL PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metric_id VARCHAR(64) NOT NULL,
    raw_value NUMERIC(20, 6) NOT NULL,
    data_quality_flag VARCHAR(64) NOT NULL DEFAULT 'VALID',

    CONSTRAINT fk_observation_domain
        FOREIGN KEY (domain_id)
        REFERENCES domain_registry(domain_id),

    CONSTRAINT fk_observation_metric
        FOREIGN KEY (metric_id)
        REFERENCES metric_registry(metric_id)
);

CREATE INDEX IF NOT EXISTS idx_observation_domain_time
ON observation_table(domain_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_observation_metric_time
ON observation_table(metric_id, timestamp);

-- ============================================================
-- 5. STATE RESOLUTION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS state_resolution_table (
    state_id BIGSERIAL PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    pi_value NUMERIC(20, 10) NOT NULL,
    k_value NUMERIC(20, 10) NOT NULL,
    k_used NUMERIC(20, 10) NOT NULL,
    pcr_value NUMERIC(20, 10) NOT NULL,
    s_star NUMERIC(20, 10) NOT NULL,
    h_star NUMERIC(20, 10) NOT NULL,
    safe_mode BOOLEAN NOT NULL,
    classification VARCHAR(64) NOT NULL,

    CONSTRAINT fk_state_domain
        FOREIGN KEY (domain_id)
        REFERENCES domain_registry(domain_id),

    CONSTRAINT chk_state_classification
        CHECK (
            classification IN (
                'LOW_PRESSURE_PASS_CANDIDATE',
                'STABILITY_DOMINANT',
                'CRITICAL_BOUNDARY',
                'COLLAPSE_PRESSURE',
                'BLOCK',
                'STANDARD_RUN'
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_state_domain_time
ON state_resolution_table(domain_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_state_classification
ON state_resolution_table(domain_id, classification);

-- ============================================================
-- 6. OUTCOME VALIDATION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS outcome_validation_table (
    outcome_id BIGSERIAL PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    observed_outcome TEXT,
    failure_flag BOOLEAN NOT NULL,
    recovery_flag BOOLEAN NOT NULL DEFAULT FALSE,
    severity_score NUMERIC(20, 6) NOT NULL DEFAULT 0.000000,
    baseline_score NUMERIC(20, 6) NOT NULL DEFAULT 0.000000,
    validation_notes TEXT,
    linked_state_id BIGINT NULL,

    CONSTRAINT fk_outcome_domain
        FOREIGN KEY (domain_id)
        REFERENCES domain_registry(domain_id),

    CONSTRAINT fk_outcome_state
        FOREIGN KEY (linked_state_id)
        REFERENCES state_resolution_table(state_id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_outcome_domain_time
ON outcome_validation_table(domain_id, timestamp);

CREATE INDEX IF NOT EXISTS idx_outcome_linked_state
ON outcome_validation_table(linked_state_id);

-- ============================================================
-- 7. AUDIT RECEIPT TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_receipt_table (
    receipt_id BIGSERIAL PRIMARY KEY,
    state_id BIGINT NOT NULL,
    epsilon_k_version VARCHAR(64) NOT NULL,
    threshold_version VARCHAR(64) NOT NULL,
    mapping_version VARCHAR(64) NOT NULL,
    classification_rule_version VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_audit_state
        FOREIGN KEY (state_id)
        REFERENCES state_resolution_table(state_id)
        ON DELETE CASCADE
);

-- ============================================================
-- 8. FINANCE MARKET DAILY RAW TAPE
-- ============================================================

CREATE TABLE IF NOT EXISTS finance_market_daily (
    market_date DATE PRIMARY KEY,
    sp500_close NUMERIC(20, 6) NULL,
    vix_close NUMERIC(20, 6) NULL,
    data_quality_flag VARCHAR(32) NOT NULL DEFAULT 'VALID'
);

CREATE INDEX IF NOT EXISTS idx_mkt_tape_timeline
ON finance_market_daily(market_date);

-- ============================================================
-- 9. TIMELINE PARTITION REGISTRY
-- ============================================================

CREATE TABLE IF NOT EXISTS timeline_partition_registry (
    partition_id VARCHAR(64) PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    segment_name VARCHAR(64) NOT NULL,
    start_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    end_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_partition_domain
        FOREIGN KEY (domain_id)
        REFERENCES domain_registry(domain_id),

    CONSTRAINT chk_segment
        CHECK (segment_name IN ('TRAIN_CALIBRATION', 'HOLDOUT')),

    CONSTRAINT chk_chronology
        CHECK (end_timestamp > start_timestamp)
);

CREATE INDEX IF NOT EXISTS idx_partition_bounds
ON timeline_partition_registry(domain_id, start_timestamp, end_timestamp);

COMMIT;

-- ============================================================
-- 10. FINANCE DAILY FEATURE VIEW
-- ============================================================

CREATE OR REPLACE VIEW v_finance_daily_features AS
WITH market_tape_intersection AS (
    SELECT
        market_date,
        sp500_close,
        vix_close
    FROM finance_market_daily
    WHERE sp500_close IS NOT NULL
      AND vix_close IS NOT NULL
      AND data_quality_flag = 'VALID'
),
return_stream AS (
    SELECT
        market_date,
        sp500_close,
        vix_close,
        (sp500_close / LAG(sp500_close) OVER (ORDER BY market_date)) - 1.000000 AS daily_return
    FROM market_tape_intersection
),
rolling_metrics AS (
    SELECT
        market_date,
        sp500_close,
        vix_close,
        daily_return,

        STDDEV_SAMP(daily_return) OVER (
            ORDER BY market_date
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) AS realized_vol_30d,

        1.000000 - (
            sp500_close / MAX(sp500_close) OVER (
                ORDER BY market_date
                ROWS BETWEEN 251 PRECEDING AND CURRENT ROW
            )
        ) AS trailing_drawdown_252d

    FROM return_stream
)
SELECT
    market_date,
    sp500_close,
    vix_close,
    daily_return,
    realized_vol_30d,
    trailing_drawdown_252d
FROM rolling_metrics
WHERE realized_vol_30d IS NOT NULL
  AND trailing_drawdown_252d IS NOT NULL;

-- ============================================================
-- 11. STATE RESOLUTION ENGINE
-- ============================================================

CREATE OR REPLACE VIEW v1_state_resolution_engine AS
WITH normalized_observations AS (
    SELECT
        o.domain_id,
        o.timestamp,
        o.metric_id,
        m.operational_role,

        CASE
            WHEN m.operational_role = 'PRESSURE' THEN
                LEAST(
                    1.000000,
                    GREATEST(
                        0.000000,
                        (o.raw_value - m.min_value) / NULLIF((m.max_value - m.min_value), 0)
                    )
                )

            WHEN m.operational_role = 'CAPACITY' THEN
                LEAST(
                    1.000000,
                    GREATEST(
                        0.000000,
                        (o.raw_value - m.min_value) / NULLIF((m.max_value - m.min_value), 0)
                    )
                )

            WHEN m.operational_role = 'CAPACITY_DAMAGE' THEN
                1.000000 - LEAST(
                    1.000000,
                    GREATEST(
                        0.000000,
                        (o.raw_value - m.min_value) / NULLIF((m.max_value - m.min_value), 0)
                    )
                )

            ELSE NULL
        END AS normalized_value

    FROM observation_table o
    JOIN metric_registry m
      ON o.metric_id = m.metric_id
     AND o.domain_id = m.domain_id
    WHERE o.data_quality_flag = 'VALID'
),
pressure_capacity_products AS (
    SELECT
        domain_id,
        timestamp,

        COALESCE(
            EXP(SUM(LN(NULLIF(normalized_value, 0)))
                FILTER (WHERE operational_role = 'PRESSURE')),
            0.000000
        ) AS pi_value,

        COALESCE(
            EXP(SUM(LN(NULLIF(normalized_value, 0)))
                FILTER (WHERE operational_role IN ('CAPACITY', 'CAPACITY_DAMAGE'))),
            1.000000
        ) AS k_value

    FROM normalized_observations
    GROUP BY domain_id, timestamp
),
resolved AS (
    SELECT
        p.domain_id,
        p.timestamp,
        p.pi_value,
        p.k_value,
        GREATEST(p.k_value, c.epsilon_k) AS k_used,
        p.pi_value / GREATEST(p.k_value, c.epsilon_k) AS pcr_value,
        c.epsilon_k
    FROM pressure_capacity_products p
    JOIN validation_config_table c
      ON p.domain_id = c.domain_id
     AND c.is_active = TRUE
)
SELECT
    domain_id,
    timestamp,
    pi_value,
    k_value,
    k_used,
    pcr_value,

    1.000000 / (1.000000 + pcr_value) AS s_star,
    pcr_value / (1.000000 + pcr_value) AS h_star,

    CASE
        WHEN k_value <= epsilon_k THEN TRUE
        ELSE FALSE
    END AS safe_mode,

    CASE
        WHEN k_value <= epsilon_k THEN 'BLOCK'
        WHEN pi_value = 0 THEN 'LOW_PRESSURE_PASS_CANDIDATE'
        WHEN pcr_value < 0.200000 THEN 'STABILITY_DOMINANT'
        WHEN ABS(pcr_value - 1.000000) <= 0.100000 THEN 'CRITICAL_BOUNDARY'
        WHEN pi_value > k_used THEN 'COLLAPSE_PRESSURE'
        ELSE 'STANDARD_RUN'
    END AS classification

FROM resolved;

-- ============================================================
-- 12. FORWARD OUTCOME DISCOVERY VIEW
-- ============================================================

CREATE OR REPLACE VIEW v_finance_forward_outcomes AS
WITH forward_returns_raw AS (
    SELECT
        market_date,
        sp500_close,
        (sp500_close / LAG(sp500_close) OVER (ORDER BY market_date)) - 1.000000 AS daily_return
    FROM finance_market_daily
    WHERE sp500_close IS NOT NULL
),
windowed_outcomes_calculated AS (
    SELECT
        f.market_date AS eval_date,
        MIN(f2.sp500_close / f.sp500_close - 1.000000) AS forward_30d_worst_return,
        STDDEV_SAMP(f2.daily_return) AS forward_30d_realized_vol
    FROM finance_market_daily f
    JOIN forward_returns_raw f2
      ON f2.market_date > f.market_date
     AND f2.market_date <= f.market_date + INTERVAL '30 days'
    WHERE f.sp500_close IS NOT NULL
    GROUP BY f.market_date, f.sp500_close
)
SELECT
    eval_date,
    forward_30d_worst_return,
    forward_30d_realized_vol,
    CASE
        WHEN forward_30d_worst_return <= -0.100000 THEN TRUE
        ELSE FALSE
    END AS crash_flag_30d
FROM windowed_outcomes_calculated
WHERE forward_30d_realized_vol IS NOT NULL;

-- ============================================================
-- 13. RESOLVED FORWARD OUTCOMES
-- ============================================================

CREATE OR REPLACE VIEW v2_state_forward_outcomes AS
SELECT
    s.state_id,
    s.domain_id,
    s.timestamp AS eval_time,
    c.forward_window,
    s.h_star,
    s.classification,

    COALESCE(MAX(CASE WHEN o.failure_flag = TRUE THEN 1 ELSE 0 END), 0) AS actual_failure,
    COALESCE(MAX(o.severity_score), 0.0000) AS max_observed_severity,
    COALESCE(MAX(o.baseline_score), 0.000000) AS baseline_prediction

FROM state_resolution_table s
JOIN validation_config_table c
  ON s.domain_id = c.domain_id
 AND c.is_active = TRUE
LEFT JOIN outcome_validation_table o
  ON o.domain_id = s.domain_id
 AND o.timestamp > s.timestamp
 AND o.timestamp <= (s.timestamp + c.forward_window)

GROUP BY
    s.state_id,
    s.domain_id,
    s.timestamp,
    c.forward_window,
    s.h_star,
    s.classification;

-- ============================================================
-- 14. REAL-WORLD PERFORMANCE MATRIX
-- ============================================================

CREATE OR REPLACE VIEW v2_real_world_performance_matrix AS
WITH classification_residuals AS (
    SELECT
        domain_id,
        eval_time,
        h_star,
        actual_failure,
        baseline_prediction,

        CASE WHEN h_star >= 0.500000 THEN 1 ELSE 0 END AS model_predicted_failure,
        CASE WHEN baseline_prediction >= 0.500000 THEN 1 ELSE 0 END AS baseline_predicted_failure,

        POWER((h_star - actual_failure), 2) AS brier_residual_model,
        POWER((baseline_prediction - actual_failure), 2) AS brier_residual_baseline

    FROM v2_state_forward_outcomes
),
statistical_aggregates AS (
    SELECT
        domain_id,
        COUNT(*) AS total_sample_count,

        AVG(brier_residual_model) AS brier_score_model,
        AVG(brier_residual_baseline) AS brier_score_baseline,

        SUM(CASE WHEN model_predicted_failure = 1 AND actual_failure = 1 THEN 1 ELSE 0 END) AS tp_model,
        SUM(CASE WHEN model_predicted_failure = 1 AND actual_failure = 0 THEN 1 ELSE 0 END) AS fp_model,
        SUM(CASE WHEN model_predicted_failure = 0 AND actual_failure = 1 THEN 1 ELSE 0 END) AS fn_model,

        SUM(CASE WHEN baseline_predicted_failure = 1 AND actual_failure = 1 THEN 1 ELSE 0 END) AS tp_baseline,
        SUM(CASE WHEN baseline_predicted_failure = 1 AND actual_failure = 0 THEN 1 ELSE 0 END) AS fp_baseline,
        SUM(CASE WHEN baseline_predicted_failure = 0 AND actual_failure = 1 THEN 1 ELSE 0 END) AS fn_baseline

    FROM classification_residuals
    GROUP BY domain_id
)
SELECT
    domain_id,
    total_sample_count,

    ROUND(brier_score_model, 6) AS brier_score_model,

    CASE
        WHEN (tp_model + fp_model) = 0 THEN 0.00
        ELSE ROUND((tp_model::NUMERIC / (tp_model + fp_model)), 4)
    END AS precision_model,

    CASE
        WHEN (tp_model + fn_model) = 0 THEN 0.00
        ELSE ROUND((tp_model::NUMERIC / (tp_model + fn_model)), 4)
    END AS recall_model,

    ROUND(brier_score_baseline, 6) AS brier_score_baseline,

    CASE
        WHEN (tp_baseline + fp_baseline) = 0 THEN 0.00
        ELSE ROUND((tp_baseline::NUMERIC / (tp_baseline + fp_baseline)), 4)
    END AS precision_baseline,

    CASE
        WHEN (tp_baseline + fn_baseline) = 0 THEN 0.00
        ELSE ROUND((tp_baseline::NUMERIC / (tp_baseline + fn_baseline)), 4)
    END AS recall_baseline,

    ROUND((brier_score_baseline - brier_score_model), 6) AS predictive_brier_lift

FROM statistical_aggregates;

-- ============================================================
-- 15. DOMAIN-LEVEL AUC MATRIX
-- ============================================================

CREATE OR REPLACE VIEW v2_real_world_auc_matrix AS
WITH positive_cases AS (
    SELECT *
    FROM v2_state_forward_outcomes
    WHERE actual_failure = 1
),
negative_cases AS (
    SELECT *
    FROM v2_state_forward_outcomes
    WHERE actual_failure = 0
),
pairwise_comparisons AS (
    SELECT
        p.domain_id,

        CASE
            WHEN p.h_star > n.h_star THEN 1.000000
            WHEN p.h_star = n.h_star THEN 0.500000
            ELSE 0.000000
        END AS model_pair_score,

        CASE
            WHEN p.baseline_prediction > n.baseline_prediction THEN 1.000000
            WHEN p.baseline_prediction = n.baseline_prediction THEN 0.500000
            ELSE 0.000000
        END AS baseline_pair_score

    FROM positive_cases p
    JOIN negative_cases n
      ON p.domain_id = n.domain_id
)
SELECT
    domain_id,
    COUNT(*) AS pair_count,
    ROUND(AVG(model_pair_score), 6) AS auc_model,
    ROUND(AVG(baseline_pair_score), 6) AS auc_baseline,
    ROUND(AVG(model_pair_score) - AVG(baseline_pair_score), 6) AS auc_lift
FROM pairwise_comparisons
GROUP BY domain_id;

-- ============================================================
-- 16. SEGMENTED VALIDATION SUMMARY
-- ============================================================

CREATE OR REPLACE VIEW v2_segmented_validation_summary AS
WITH partition_assigned_states AS (
    SELECT
        f.*,
        p.segment_name,

        POWER((f.h_star - f.actual_failure), 2) AS brier_res_model,
        POWER((f.baseline_prediction - f.actual_failure), 2) AS brier_res_baseline,

        CASE WHEN f.h_star >= 0.500000 THEN 1 ELSE 0 END AS model_predicted_failure,
        CASE WHEN f.baseline_prediction >= 0.500000 THEN 1 ELSE 0 END AS baseline_predicted_failure

    FROM v2_state_forward_outcomes f
    JOIN timeline_partition_registry p
      ON f.domain_id = p.domain_id
     AND f.eval_time >= p.start_timestamp
     AND f.eval_time <= p.end_timestamp
),
partition_aggregates AS (
    SELECT
        domain_id,
        segment_name,
        COUNT(*) AS sample_count,

        AVG(brier_res_model) AS brier_model,
        AVG(brier_res_baseline) AS brier_baseline,

        SUM(CASE WHEN model_predicted_failure = 1 AND actual_failure = 1 THEN 1 ELSE 0 END) AS tp_m,
        SUM(CASE WHEN model_predicted_failure = 1 AND actual_failure = 0 THEN 1 ELSE 0 END) AS fp_m,
        SUM(CASE WHEN model_predicted_failure = 0 AND actual_failure = 1 THEN 1 ELSE 0 END) AS fn_m,

        SUM(CASE WHEN baseline_predicted_failure = 1 AND actual_failure = 1 THEN 1 ELSE 0 END) AS tp_b,
        SUM(CASE WHEN baseline_predicted_failure = 1 AND actual_failure = 0 THEN 1 ELSE 0 END) AS fp_b,
        SUM(CASE WHEN baseline_predicted_failure = 0 AND actual_failure = 1 THEN 1 ELSE 0 END) AS fn_b

    FROM partition_assigned_states
    GROUP BY domain_id, segment_name
)
SELECT
    domain_id,
    segment_name,
    sample_count,

    ROUND(brier_model, 6) AS brier_model,
    ROUND(brier_baseline, 6) AS brier_baseline,
    ROUND((brier_baseline - brier_model), 6) AS brier_lift,

    CASE
        WHEN (tp_m + fp_m) = 0 THEN 0.00
        ELSE ROUND((tp_m::NUMERIC / (tp_m + fp_m)), 4)
    END AS precision_model,

    CASE
        WHEN (tp_m + fn_m) = 0 THEN 0.00
        ELSE ROUND((tp_m::NUMERIC / (tp_m + fn_m)), 4)
    END AS recall_model,

    CASE
        WHEN (tp_b + fp_b) = 0 THEN 0.00
        ELSE ROUND((tp_b::NUMERIC / (tp_b + fp_b)), 4)
    END AS precision_baseline,

    CASE
        WHEN (tp_b + fn_b) = 0 THEN 0.00
        ELSE ROUND((tp_b::NUMERIC / (tp_b + fn_b)), 4)
    END AS recall_baseline

FROM partition_aggregates;

-- ============================================================
-- 17. SEGMENTED AUC MATRIX
-- ============================================================

CREATE OR REPLACE VIEW v2_segmented_auc_matrix AS
WITH partitioned_rows AS (
    SELECT
        f.domain_id,
        f.state_id,
        f.eval_time,
        f.h_star AS model_score,
        f.baseline_prediction,
        f.actual_failure,
        p.segment_name

    FROM v2_state_forward_outcomes f
    JOIN timeline_partition_registry p
      ON f.domain_id = p.domain_id
     AND f.eval_time >= p.start_timestamp
     AND f.eval_time <= p.end_timestamp
),
positive_cases AS (
    SELECT *
    FROM partitioned_rows
    WHERE actual_failure = 1
),
negative_cases AS (
    SELECT *
    FROM partitioned_rows
    WHERE actual_failure = 0
),
pairwise_comparisons AS (
    SELECT
        p.domain_id,
        p.segment_name,

        CASE
            WHEN p.model_score > n.model_score THEN 1.000000
            WHEN p.model_score = n.model_score THEN 0.500000
            ELSE 0.000000
        END AS model_pair_score,

        CASE
            WHEN p.baseline_prediction > n.baseline_prediction THEN 1.000000
            WHEN p.baseline_prediction = n.baseline_prediction THEN 0.500000
            ELSE 0.000000
        END AS baseline_pair_score

    FROM positive_cases p
    JOIN negative_cases n
      ON p.domain_id = n.domain_id
     AND p.segment_name = n.segment_name
)
SELECT
    domain_id,
    segment_name,
    COUNT(*) AS pair_count,
    ROUND(AVG(model_pair_score), 6) AS auc_model,
    ROUND(AVG(baseline_pair_score), 6) AS auc_baseline,
    ROUND(AVG(model_pair_score) - AVG(baseline_pair_score), 6) AS auc_lift
FROM pairwise_comparisons
GROUP BY domain_id, segment_name;

-- ============================================================
-- 18. DECILE LIFT ANALYSIS
-- ============================================================

CREATE OR REPLACE VIEW v2_decile_lift_analysis AS
WITH scored AS (
    SELECT
        f.*,
        p.segment_name,

        NTILE(10) OVER (
            PARTITION BY f.domain_id, p.segment_name
            ORDER BY f.h_star
        ) AS h_star_decile

    FROM v2_state_forward_outcomes f
    JOIN timeline_partition_registry p
      ON f.domain_id = p.domain_id
     AND f.eval_time >= p.start_timestamp
     AND f.eval_time <= p.end_timestamp
),
decile_stats AS (
    SELECT
        domain_id,
        segment_name,
        h_star_decile,
        COUNT(*) AS sample_count,
        AVG(h_star) AS avg_h_star,
        AVG(actual_failure::NUMERIC) AS failure_rate,
        AVG(max_observed_severity) AS avg_severity

    FROM scored
    GROUP BY domain_id, segment_name, h_star_decile
),
base_rates AS (
    SELECT
        domain_id,
        segment_name,
        AVG(actual_failure::NUMERIC) AS base_failure_rate

    FROM scored
    GROUP BY domain_id, segment_name
)
SELECT
    d.domain_id,
    d.segment_name,
    d.h_star_decile,
    d.sample_count,

    ROUND(d.avg_h_star, 6) AS avg_h_star,
    ROUND(d.failure_rate, 6) AS failure_rate,
    ROUND(b.base_failure_rate, 6) AS base_failure_rate,

    CASE
        WHEN b.base_failure_rate = 0 THEN NULL
        ELSE ROUND(d.failure_rate / b.base_failure_rate, 6)
    END AS lift_vs_base,

    ROUND(d.avg_severity, 6) AS avg_severity

FROM decile_stats d
JOIN base_rates b
  ON d.domain_id = b.domain_id
 AND d.segment_name = b.segment_name
ORDER BY d.domain_id, d.segment_name, d.h_star_decile;

-- ============================================================
-- 19. FINANCE DOMAIN REGISTRATION TEMPLATE
-- ============================================================

INSERT INTO domain_registry (
    domain_id,
    domain_name,
    sampling_frequency,
    outcome_type,
    validation_status
)
VALUES (
    'DOM_FIN_REAL',
    'FINANCIAL_MARKET_EQUITY_LANE',
    'DAILY',
    'MARKET_CRASH_30D_DRAWDOWN',
    'PROTOTYPE'
)
ON CONFLICT (domain_id) DO NOTHING;

INSERT INTO validation_config_table (
    config_id,
    domain_id,
    forward_window,
    baseline_model_name,
    epsilon_k,
    is_active
)
VALUES (
    'CFG_FIN_REAL',
    'DOM_FIN_REAL',
    INTERVAL '30 days',
    'VIX_RAW_THRESHOLD',
    0.001000,
    TRUE
)
ON CONFLICT (config_id) DO NOTHING;

INSERT INTO metric_registry (
    metric_id,
    domain_id,
    raw_metric_name,
    operational_role,
    min_value,
    max_value,
    normalization_method,
    source_url,
    version
)
VALUES
(
    'M_FI_VIX',
    'DOM_FIN_REAL',
    'CBOE_VOLATILITY_INDEX',
    'PRESSURE',
    9.000000,
    85.000000,
    'LINEAR_PRESSURE',
    'https://fred.stlouisfed.org/series/VIXCLS',
    'v1.0'
),
(
    'M_FI_DRAW',
    'DOM_FIN_REAL',
    'TRAILING_252D_DRAWDOWN',
    'PRESSURE',
    0.000000,
    0.550000,
    'LINEAR_PRESSURE',
    NULL,
    'v1.0'
),
(
    'M_FI_CAP_BASE',
    'DOM_FIN_REAL',
    'NEUTRAL_CAPACITY_BASELINE',
    'CAPACITY',
    0.000000,
    1.000000,
    'LINEAR_CAPACITY',
    NULL,
    'v1.0'
)
ON CONFLICT (metric_id) DO NOTHING;

-- ============================================================
-- 20. EXECUTION NOTES
-- ============================================================

-- After inserting rows into finance_market_daily:
--
-- 1. Flush prior observations:
-- DELETE FROM observation_table WHERE domain_id = 'DOM_FIN_REAL';
--
-- 2. Insert VIX pressure rows:
-- INSERT INTO observation_table (domain_id, timestamp, metric_id, raw_value, data_quality_flag)
-- SELECT 'DOM_FIN_REAL', market_date::TIMESTAMP WITH TIME ZONE, 'M_FI_VIX', vix_close, 'VALID'
-- FROM v_finance_daily_features;
--
-- 3. Insert trailing drawdown pressure rows:
-- INSERT INTO observation_table (domain_id, timestamp, metric_id, raw_value, data_quality_flag)
-- SELECT 'DOM_FIN_REAL', market_date::TIMESTAMP WITH TIME ZONE, 'M_FI_DRAW', trailing_drawdown_252d, 'VALID'
-- FROM v_finance_daily_features;
--
-- 4. Insert neutral capacity baseline rows:
-- INSERT INTO observation_table (domain_id, timestamp, metric_id, raw_value, data_quality_flag)
-- SELECT 'DOM_FIN_REAL', market_date::TIMESTAMP WITH TIME ZONE, 'M_FI_CAP_BASE', 1.000000, 'VALID'
-- FROM v_finance_daily_features;
--
-- 5. Compile state rows:
-- DELETE FROM state_resolution_table WHERE domain_id = 'DOM_FIN_REAL';
--
-- INSERT INTO state_resolution_table (
--     domain_id,
--     timestamp,
--     pi_value,
--     k_value,
--     k_used,
--     pcr_value,
--     s_star,
--     h_star,
--     safe_mode,
--     classification
-- )
-- SELECT
--     domain_id,
--     timestamp,
--     pi_value,
--     k_value,
--     k_used,
--     pcr_value,
--     s_star,
--     h_star,
--     safe_mode,
--     classification
-- FROM v1_state_resolution_engine
-- WHERE domain_id = 'DOM_FIN_REAL';
--
-- 6. Derive dynamic 70/30 partitions:
-- DELETE FROM timeline_partition_registry WHERE domain_id = 'DOM_FIN_REAL';
--
-- WITH ordered_states AS (
--     SELECT
--         state_id,
--         domain_id,
--         timestamp,
--         NTILE(10) OVER (ORDER BY timestamp) AS decile_bucket
--     FROM state_resolution_table
--     WHERE domain_id = 'DOM_FIN_REAL'
-- ),
-- bounds AS (
--     SELECT
--         domain_id,
--         MIN(timestamp) FILTER (WHERE decile_bucket <= 7) AS train_start,
--         MAX(timestamp) FILTER (WHERE decile_bucket <= 7) AS train_end,
--         MIN(timestamp) FILTER (WHERE decile_bucket >= 8) AS holdout_start,
--         MAX(timestamp) FILTER (WHERE decile_bucket >= 8) AS holdout_end
--     FROM ordered_states
--     GROUP BY domain_id
-- )
-- INSERT INTO timeline_partition_registry (
--     partition_id,
--     domain_id,
--     segment_name,
--     start_timestamp,
--     end_timestamp
-- )
-- SELECT
--     'PART_FIN_TRAIN_DYNAMIC',
--     domain_id,
--     'TRAIN_CALIBRATION',
--     train_start,
--     train_end
-- FROM bounds
--
-- UNION ALL
--
-- SELECT
--     'PART_FIN_HOLD_DYNAMIC',
--     domain_id,
--     'HOLDOUT',
--     holdout_start,
--     holdout_end
-- FROM bounds;
--
-- 7. Validation queries:
--
-- SELECT *
-- FROM v2_segmented_validation_summary
-- WHERE domain_id = 'DOM_FIN_REAL'
-- ORDER BY segment_name;
--
-- SELECT *
-- FROM v2_segmented_auc_matrix
-- WHERE domain_id = 'DOM_FIN_REAL'
-- ORDER BY segment_name;
--
-- SELECT *
-- FROM v2_decile_lift_analysis
-- WHERE domain_id = 'DOM_FIN_REAL'
-- ORDER BY segment_name, h_star_decile;
