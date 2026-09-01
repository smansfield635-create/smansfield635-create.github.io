const DESTINATION_IDS=Object.freeze(['crossing','dextrion','alaric','tarian','manor','elara','soren','auren','jeeves','clock','remote']);
const BASE_AVAILABLE=Object.freeze(['crossing','dextrion','alaric','tarian','elara','soren','clock','remote']);

const EMPTY_DESTINATION=Object.freeze({
  physicalExpression:'latent',
  arrivalExpression:'signal',
  worldEffects:Object.freeze([]),
  reveals:Object.freeze([]),
  sensoryState:'quiet'
});

const DESTINATION_RULES=Object.freeze({
  crossing:Object.freeze({
    physicalExpression:'crossing-scar',
    arrivalExpression:'shore-memory',
    worldEffects:Object.freeze(['route-geometry-revealed']),
    reveals:Object.freeze(['manor']),
    sensoryState:'shoreline-tension'
  }),
  dextrion:Object.freeze({
    physicalExpression:'earth-transmission',
    arrivalExpression:'signal-lock',
    worldEffects:Object.freeze(['earthward-beacon-stabilizes']),
    reveals:Object.freeze(['manor']),
    sensoryState:'distant-transmission'
  }),
  alaric:Object.freeze({
    physicalExpression:'watchfire-overlook',
    arrivalExpression:'warning-holds',
    worldEffects:Object.freeze(['route-warning-legible']),
    reveals:Object.freeze([]),
    sensoryState:'high-wind-watch'
  }),
  tarian:Object.freeze({
    physicalExpression:'waterline-station',
    arrivalExpression:'shoreline-measure',
    worldEffects:Object.freeze(['waterline-change-legible']),
    reveals:Object.freeze(['manor']),
    sensoryState:'water-pressure'
  }),
  manor:Object.freeze({
    physicalExpression:'manor-mass',
    arrivalExpression:'architecture-emerges',
    worldEffects:Object.freeze(['manor-horizon-legible']),
    reveals:Object.freeze(['auren','jeeves']),
    sensoryState:'window-glow'
  }),
  elara:Object.freeze({
    physicalExpression:'signal-lantern',
    arrivalExpression:'possibility-visible',
    worldEffects:Object.freeze(['future-signal-strengthens']),
    reveals:Object.freeze([]),
    sensoryState:'luminous-air'
  }),
  soren:Object.freeze({
    physicalExpression:'restoration-boundary',
    arrivalExpression:'damage-revealed',
    worldEffects:Object.freeze(['restoration-boundary-legible']),
    reveals:Object.freeze([]),
    sensoryState:'ground-resonance'
  }),
  auren:Object.freeze({
    physicalExpression:'shelter-path',
    arrivalExpression:'protective-route',
    worldEffects:Object.freeze(['manor-protection-route-visible']),
    reveals:Object.freeze(['jeeves']),
    sensoryState:'sheltered-wind'
  }),
  jeeves:Object.freeze({
    physicalExpression:'threshold-light',
    arrivalExpression:'threshold-opens',
    worldEffects:Object.freeze(['manor-threshold-responsive']),
    reveals:Object.freeze(['auren']),
    sensoryState:'interior-hush'
  }),
  clock:Object.freeze({
    physicalExpression:'temporal-anomaly',
    arrivalExpression:'phase-shift',
    worldEffects:Object.freeze(['night-phase-deepens']),
    reveals:Object.freeze([]),
    sensoryState:'temporal-pulse'
  }),
  remote:Object.freeze({
    physicalExpression:'distant-settlement',
    arrivalExpression:'lights-propagate',
    worldEffects:Object.freeze(['distributed-lights-visible']),
    reveals:Object.freeze(['manor']),
    sensoryState:'far-field-hum'
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
  const revealed=new Set(BASE_AVAILABLE);
  for(const id of visited){
    revealed.add(id);
    for(const target of DESTINATION_RULES[id]?.reveals||[])revealed.add(target);
  }

  const destinations={};
  for(const id of DESTINATION_IDS){
    const seen=visited.has(id);
    const rule=seen&&DESTINATION_RULES[id]?DESTINATION_RULES[id]:EMPTY_DESTINATION;
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
    revealed:Object.freeze([...revealed]),
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
