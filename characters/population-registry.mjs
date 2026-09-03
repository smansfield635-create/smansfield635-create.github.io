const freeze=(value,seen=new WeakSet())=>{if(value===null||typeof value!=='object'||Object.isFrozen(value)||seen.has(value))return value;seen.add(value);for(const nested of Object.values(value))freeze(nested,seen);return Object.freeze(value);};

const held=freeze({name:'HELD',biography:'HELD',voice:'HELD',hierarchy:'HELD',commandRelationship:'HELD',sceneHistory:'HELD'});

export const MIRRORLAND_POPULATION=freeze({
  AUREN_VALE:{id:'AUREN_VALE',class:'CHARACTER',publicId:'auren',sourceStatus:'DOSSIER_PROTECTED'},
  DEXTRION:{id:'DEXTRION',class:'CHARACTER',publicId:'dextrion',sourceStatus:'DOSSIER_PROTECTED'},
  ALARIC_AXION:{id:'ALARIC_AXION',class:'CHARACTER',publicId:'alaric',sourceStatus:'OWNER_ORIGINATING_CARDINAL_SOURCE'},
  TARIAN_MERROW:{id:'TARIAN_MERROW',class:'CHARACTER',publicId:'tarian',sourceStatus:'OWNER_ORIGINATING_CARDINAL_SOURCE'},
  ELARA_SYLENE:{id:'ELARA_SYLENE',class:'CHARACTER',publicId:'elara',sourceStatus:'OWNER_ORIGINATING_CARDINAL_SOURCE'},
  SOREN_SEVRIN:{id:'SOREN_SEVRIN',class:'CHARACTER',publicId:'soren',sourceStatus:'OWNER_ORIGINATING_CARDINAL_SOURCE'},
  JEEVES:{id:'JEEVES',class:'CHARACTER',publicId:'jeeves',sourceStatus:'DOSSIER_PROTECTED'},
  REMOTE_TEAM:{
    id:'REMOTE_TEAM',
    class:'ENSEMBLE',
    publicId:'remote-team',
    sourceStatus:'DOSSIER_BACKED_COLLECTIVE_SOURCE_ENRICHMENT_PENDING',
    individuallyAddressableMembersSupported:true,
    memberCanonPolicy:'UNSOURCED_FIELDS_HELD',
    members:freeze([]),
    memberTemplate:freeze({class:'ENSEMBLE_MEMBER',sourceStatus:'HELD_UNTIL_SEPARATELY_SOURCED',...held})
  }
});

export function registerSourcedEnsembleMember(member){
  if(!member||member.class!=='ENSEMBLE_MEMBER'||member.sourceStatus!=='SEPARATELY_SOURCED')throw new Error('UNSOURCED_CHARACTER_CANON_INVENTION');
  if(!member.id||!member.name)throw new Error('ENSEMBLE_MEMBER_SOURCE_INCOMPLETE');
  return freeze({...member});
}

export const PROTECTED_PUBLIC_DOSSIER_ORDER=freeze(['auren','dextrion','alaric','tarian','elara','soren','jeeves','remote-team']);
