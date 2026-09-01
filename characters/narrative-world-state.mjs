const DESTINATION_IDS=Object.freeze(['crossing','dextrion','alaric','tarian','manor','elara','soren','auren','jeeves','clock','remote']);

const EMPTY_DESTINATION=Object.freeze({
  physicalExpression:'latent',
  arrivalExpression:'signal',
  worldEffects:Object.freeze([]),
  reveals:Object.freeze([]),
  sensoryState:'quiet'
});

const PROOF_RULES=Object.freeze({
  crossing:Object.freeze({
    physicalExpression:'crossing-scar',
    arrivalExpression:'shore-memory',
    worldEffects:Object.freeze(['route-geometry-revealed']),
    reveals:Object.freeze(['manor']),
    sensoryState:'shoreline-tension'
  }),
  manor:Object.freeze({
    physicalExpression:'manor-mass',
    arrivalExpression:'architecture-emerges',
    worldEffects:Object.freeze(['manor-horizon-legible']),
    reveals:Object.freeze(['auren','jeeves']),
    sensoryState:'window-glow'
  }),
  clock:Object.freeze({
    physicalExpression:'temporal-anomaly',
    arrivalExpression:'phase-shift',
    worldEffects:Object.freeze(['night-phase-deepens']),
    reveals:Object.freeze([]),
    sensoryState:'temporal-pulse'
  })
});

const CONNECTIONS=Object.freeze({
  crossing:Object.freeze(['dextrion','manor','clock']),
  dextrion:Object.freeze(['crossing','manor','clock']),
  alaric:Object.freeze(['tarian','soren','crossing']),
  tarian:Object.freeze(['alaric','manor','soren']),
  manor:Object.freeze(['tarian','elara','auren','jeeves','clock']),
  elara:Object.freeze(['manor','soren','clock']),
  soren:Object.freeze(['alaric','tarian','elara','clock']),
  auren:Object.freeze(['manor','jeeves','clock']),
  jeeves:Object.freeze(['manor','auren','clock']),
  clock:Object.freeze(['crossing','dextrion','manor','elara','soren']),
  remote:Object.freeze(['manor','tarian','clock'])
});

function normalizeVisited(visited){
  const source=visited instanceof Set?visited:new Set(visited||[]);
  return new Set([...source].filter(id=>DESTINATION_IDS.includes(id)));
}

export function deriveNarrativeWorldState(visitedInput,activeId=null){
  const visited=normalizeVisited(visitedInput);
  const revealed=new Set(DESTINATION_IDS);
  for(const id of visited){for(const target of PROOF_RULES[id]?.reveals||[])revealed.add(target);}

  const destinations={};
  for(const id of DESTINATION_IDS){
    const seen=visited.has(id);
    const rule=seen&&PROOF_RULES[id]?PROOF_RULES[id]:EMPTY_DESTINATION;
    let signalState='AVAILABLE';
    if(!revealed.has(id))signalState='UNSEEN';
    else if(id===activeId)signalState='ACTIVE';
    else if(seen)signalState='VISITED';
    else if([...visited].some(source=>(CONNECTIONS[source]||[]).includes(id)))signalState='REVEALED_RELATED';
    destinations[id]=Object.freeze({id,visited:seen,signalState,...rule});
  }

  const constellationEdges=[];
  for(const source of visited){
    for(const target of CONNECTIONS[source]||[]){
      if(!revealed.has(target))continue;
      constellationEdges.push(Object.freeze({source,target,kind:'state-derived-relationship'}));
    }
  }

  const clockResolved=visited.has('clock');
  return Object.freeze({
    version:'NARRATIVE_WORLD_STATE_v1',
    visited:Object.freeze([...visited]),
    activeId,
    environment:Object.freeze({
      phase:clockResolved?'deep-night':'moonlit-night',
      lunarIntensity:clockResolved?0.82:0.68,
      horizonHaze:clockResolved?0.48:0.36,
      waterMoonResponse:clockResolved?1.0:0.82
    }),
    destinations:Object.freeze(destinations),
    constellationEdges:Object.freeze(constellationEdges)
  });
}

export const NARRATIVE_WORLD_STATE_DESTINATION_IDS=DESTINATION_IDS;
