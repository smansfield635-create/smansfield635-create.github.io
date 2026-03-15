import { WORLD_KERNEL } from "./world_kernel.js";

function normalizeObject(v){
  return v && typeof v==="object" && !Array.isArray(v) ? v : {};
}

function isLegalDepthTransition(from,to){
  const order = WORLD_KERNEL.depthOrder;
  const a = order.indexOf(from);
  const b = order.indexOf(to);
  if(a===-1 || b===-1) return false;
  return Math.abs(a-b)<=1;
}

export function createCosmicEngineSpine(){

  function getNextLegalDepth(current){
    const order = WORLD_KERNEL.depthOrder;
    const idx = order.indexOf(current);
    if(idx===-1) return current;
    return order[Math.min(idx+1,order.length-1)];
  }

  function resolveWorldState(input={}){
    const data = normalizeObject(input);

    const currentDepth = data.currentDepth || "galaxy";
    const activeDepth = data.activeDepth || "harbor";

    return Object.freeze({
      activeScale: WORLD_KERNEL.naming.activeScale,
      activeDepth,
      transition: Object.freeze({
        from: currentDepth,
        to: activeDepth,
        legal: isLegalDepthTransition(currentDepth,activeDepth)
      }),
      branches: Object.freeze({
        harbor: Object.freeze({
          gratitude: WORLD_KERNEL.branches.harbor.gratitude,
          generosity: WORLD_KERNEL.branches.harbor.generosity,
          corePremise: Object.freeze({
            label:"harbor_exchange_state",
            premise:WORLD_KERNEL.branches.harbor.recombination
          })
        })
      }),
      localSelection: Object.freeze({
        zone:"local_zone_alpha",
        row:1,
        col:1,
        cellIndex:5,
        cellId:"R1C1"
      })
    });
  }

  function evaluateExecutionGate(canon,input={}){
    const req = normalizeObject(input);

    const current = req.currentDepth || "galaxy";
    const requested = req.requestedDepth || "harbor";

    const legal = isLegalDepthTransition(current,requested);

    return Object.freeze({
      allow: legal,
      mode:"runtime_execution",
      blocked_by: legal ? [] : ["SCALE_TRANSITION_GATE"],
      reasons: legal ? [] : ["illegal_depth_jump"],
      canon_verdict: canon,
      next_authorized_action: legal ? "continue_execution":"correct_canonical_structure"
    });
  }

  return Object.freeze({
    resolveWorldState,
    evaluateExecutionGate,
    getNextLegalDepth
  });
}
