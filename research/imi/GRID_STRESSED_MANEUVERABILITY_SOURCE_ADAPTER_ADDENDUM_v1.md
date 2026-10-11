# Grid Stressed Maneuverability Replication — Pre-Outcome Source Adapter Addendum v1

**Timing:** frozen after execution attempt `32611645878` terminated before any state or contingency outcome was generated.

The pinned PowerAgentBench MATPOWER export stores the stressed active-power setpoints with the slack generator unresolved. Directly assigning the entire active-power mismatch to the slack generator would require 1204.18 MW, above its published Pmax. The first attempt therefore stopped before constructing any state and before opening any outcome.

To map the published AC-style export into the frozen balanced DC realization without using outcomes, the initial dispatch adapter is amended as follows:

1. clip every online generator's published Pg to its published Pmin/Pmax;
2. compute the remaining deterministic system MW imbalance against the unchanged published load vector;
3. fill positive imbalance from available upward headroom in fixed generator-table order (or remove negative imbalance from downward headroom in the same fixed order) until exact balance is reached;
4. apply the already-frozen intact-network feasibility LP using only generator and branch constraints, with zero-sum redispatch, to obtain an intact-feasible starting dispatch;
5. from that starting point, execute the original frozen state-generation, maneuverability, contingency, challenger, matching, evaluability and success rules unchanged.

This is a source-representation repair, not an outcome-responsive scientific adjustment. No outcome existed when it was frozen.