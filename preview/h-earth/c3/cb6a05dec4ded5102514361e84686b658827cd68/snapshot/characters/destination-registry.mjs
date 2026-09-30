const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))freeze(nested,seen);return Object.freeze(value);};

export const DESTINATION_CLASS=freeze({PLACE:'PLACE',CHARACTER:'CHARACTER',ENSEMBLE:'ENSEMBLE',ENSEMBLE_MEMBER:'ENSEMBLE_MEMBER',ORIENTATION_INSTRUMENT:'ORIENTATION_INSTRUMENT',CONNECTED_WORLD:'CONNECTED_WORLD'});

export const MIRRORLAND_DESTINATIONS=freeze({
  crossing:{id:'crossing',class:'PLACE',anchorId:'CROSSING',title:'The Crossing',enterable:true,sceneRoute:'/characters/?scene=crossing&entry=fade'},
  dextrion:{id:'dextrion',class:'CHARACTER',anchorId:'DEXTRION_TRANSMISSION',title:'Dextrion',enterable:true,sceneRoute:'/characters/?scene=dextrion&entry=fade'},
  alaric:{id:'alaric',class:'CHARACTER',anchorId:'WATCHFIRE_OVERLOOK',title:'Alaric',enterable:true,sceneRoute:'/characters/?scene=alaric&entry=fade'},
  tarian:{id:'tarian',class:'CHARACTER',anchorId:'WATERLINE_STATION',title:'Tarian',enterable:true,sceneRoute:'/characters/?scene=tarian&entry=fade'},
  manor:{id:'manor',class:'PLACE',anchorId:'MIRROR_MANOR',title:'Mirror Manor',enterable:true,sceneRoute:'/characters/?scene=manor&entry=fade'},
  elara:{id:'elara',class:'CHARACTER',anchorId:'SIGNAL_LANTERN_FIELD',title:'Elara',enterable:true,sceneRoute:'/characters/?scene=elara&entry=fade'},
  soren:{id:'soren',class:'CHARACTER',anchorId:'RESTORATION_BOUNDARY',title:'Soren',enterable:true,sceneRoute:'/characters/?scene=soren&entry=fade'},
  auren:{id:'auren',class:'CHARACTER',anchorId:'AUREN_LOCAL',title:'Auren Vale',enterable:true,sceneRoute:'/characters/?scene=auren&entry=fade',placementAuthority:'LOCAL_DERIVED'},
  jeeves:{id:'jeeves',class:'CHARACTER',anchorId:'JEEVES_LOCAL',title:'Jeeves',enterable:true,sceneRoute:'/characters/?scene=jeeves&entry=fade',placementAuthority:'LOCAL_DERIVED'},
  remote:{id:'remote',class:'ENSEMBLE',anchorId:'BEYOND_MANOR',title:'Beyond the Manor',enterable:true,sceneRoute:'/characters/?scene=remote&entry=fade',placementAuthority:'LOCAL_DERIVED'}
});

export const CONNECTED_WORLDS=freeze({
  COMPASS:{id:'COMPASS',class:'CONNECTED_WORLD',title:'Compass',route:'/'},
  SHOWROOM:{id:'SHOWROOM',class:'CONNECTED_WORLD',title:'Showroom',route:'/showroom/'},
  H_EARTH:{id:'H_EARTH',class:'CONNECTED_WORLD',title:'H-Earth',route:'/h-earth-3d/'},
  AUDRALIA:{id:'AUDRALIA',class:'CONNECTED_WORLD',title:'Audralia',route:'/showroom/globe/audralia/'}
});

export const ORIENTATION_INSTRUMENTS=freeze({
  STORY:{id:'STORY',class:'ORIENTATION_INSTRUMENT',title:'Story',geographic:false,reopenable:true},
  CLOCK:{id:'CLOCK',class:'ORIENTATION_INSTRUMENT',title:'Clock',geographic:false,reopenable:true}
});

export function getDestination(id){return MIRRORLAND_DESTINATIONS[id]||null;}
export function resolveSceneRoute(id){const destination=getDestination(id);return destination?.enterable?destination.sceneRoute:null;}
export function isGeographicDestination(id){return Boolean(MIRRORLAND_DESTINATIONS[id]);}
