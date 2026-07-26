from pathlib import Path
import re

CACHE='SHOWROOM_COMPASS_SPATIAL_COSMOS_20260726J'

def one(text, old, new, label):
    n=text.count(old)
    if n!=1: raise SystemExit(f'{label}: expected 1 found {n}')
    return text.replace(old,new)

def sub(text, pattern, repl, label, flags=re.S):
    text,n=re.subn(pattern,repl,text,count=1,flags=flags)
    if n!=1: raise SystemExit(f'{label}: expected 1 found {n}')
    return text

cp=Path('showroom/index.crystals.js')
csp=Path('showroom/index.crystals.source.js')
hp=Path('showroom/index.html')
co=Path('showroom/index.cosmos.js')
retired=Path('showroom/index.cosmos.source.js')

c=cp.read_text()
if 'SHOWROOM_CANONICAL_CRYSTAL_SPATIAL_INTEGRATION_v2' not in c:
    c=sub(c,r'/\* /showroom/index\.crystals\.js.*?\*/\n/\* TNT FULL-FILE REPLACEMENT \*/','''/* /showroom/index.crystals.js
   Showroom canonical crystal corridor with viewport-safe spatial integration.

   The accepted Main crystal mesh, facet-color construction, normals, shader,
   autonomous facet motion, and Showroom semantic identity remain intact.
   This round corrects only Showroom-owned target spacing, scale hierarchy,
   surface closure, and the detached full-mesh halo pass. The luminous response
   remains inside the ordinary crystal shader and the canonical Cosmos field.
*/
/* TNT FULL-FILE REPLACEMENT */''','crystal header')
    c=one(c,'SHOWROOM_CANONICAL_MAIN_CRYSTAL_CORRIDOR_CLONE_v1','SHOWROOM_CANONICAL_CRYSTAL_SPATIAL_INTEGRATION_v2','crystal contract')
    c=sub(c,r'  Visual-sizing renewal:.*?rendered crystal size\.','''  Spatial-integration renewal:
  - cardinal and room crystals use bounded viewport-safe scales;
  - cardinal anchors preserve clear globe and label separation;
  - room-cluster anchors use a larger Showroom-specific spherical envelope;
  - the ordinary crystal surface is opaque with depth writes enabled;
  - the detached additive full-mesh halo draw is retired;
  - compositor hit radii continue to scale with rendered crystal size.''','crystal description')
    c=sub(c,r'  const QUALITY = Object\.freeze\(\{.*?\n\}\);','''  const QUALITY = Object.freeze({
  maximumDeltaSeconds: 0.05,
  interpolationSpeed: 8.2,
  reducedMotionInterpolationSpeed: 26,
  ambientFrameIntervalMs: 1000 / 30,
  cardinalHitRadius: 76,
  roomHitRadius: 48,
  visibleOpacityThreshold: 0.025,
  haloPassEnabled: false,
  cardinalDepthRadius: 1.16,
  roomDepthRadius: 1.04
});''','quality')
    c=sub(c,r'  const CARDINAL_BASE_POSITIONS = Object\.freeze\(\{.*?\n\}\);','''  const CARDINAL_BASE_POSITIONS = Object.freeze({
  north: Object.freeze([0, 1.58, 0]),
  east: Object.freeze([1.64, 0, 0]),
  south: Object.freeze([0, -1.58, 0]),
  west: Object.freeze([-1.64, 0, 0])
});''','cardinals')
    c=sub(c,r'const ROOM_BASE_POSITIONS = Object\.freeze\(\{.*?\n\}\);','''const ROOM_BASE_POSITIONS = Object.freeze({
  1: Object.freeze([0, 0.6781044462968384, -0.9340074437527643]),
  2: Object.freeze([1.5996947133694057, 0.4682798483199145, 0]),
  3: Object.freeze([0, -0.8163844035631221, 0.902855311794644]),
  4: Object.freeze([-1.640152968399066, -0.2058989384512462, 0])
});''','rooms')
    c=sub(c,r'  const MATERIALS = Object\.freeze\(\{.*?\n\}\);','''  const MATERIALS = Object.freeze({
  CARDINAL_IDLE: Object.freeze({ scale: 0.78, specular: 1.12, rim: 0.94, emissive: 0.18, alpha: 1.00, sparkle: 0.24, halo: 0.30, contrast: 1.14 }),
  CARDINAL_FOCUSED: Object.freeze({ scale: 0.90, specular: 1.30, rim: 1.08, emissive: 0.23, alpha: 1.00, sparkle: 0.31, halo: 0.40, contrast: 1.20 }),
  ROOM_IDLE: Object.freeze({ scale: 0.68, specular: 1.02, rim: 0.86, emissive: 0.16, alpha: 1.00, sparkle: 0.20, halo: 0.24, contrast: 1.10 }),
  ROOM_PRIMARY: Object.freeze({ scale: 0.78, specular: 1.18, rim: 0.98, emissive: 0.20, alpha: 1.00, sparkle: 0.27, halo: 0.32, contrast: 1.16 })
});''','materials')
    c=c.replace('? 1.16\n        : 1.04;','? QUALITY.cardinalDepthRadius\n        : QUALITY.roomDepthRadius;').replace('? 1.16\n      : 1.04;','? QUALITY.cardinalDepthRadius\n      : QUALITY.roomDepthRadius;')
    c=sub(c,r'    node\.target\.float =\n      state\.reducedMotion.*?: 0\.004 \+ depth \* 0\.005;','    node.target.float = 0;','float')
    c=sub(c,r'    const haloEnabled =\n      finiteNumber\(.*?QUALITY\.haloDisableWidth;','    const haloEnabled =\n      QUALITY.haloPassEnabled === true;','halo')
    c=c.replace('cardinalScaleIncrease:','cardinalMaximumScale:').replace('roomScaleIncrease:','roomMaximumScale:').replace('cardinalScaleMultiplier:','cardinalMaximumScale:').replace('roomScaleMultiplier:','roomMaximumScale:')
    c=c.replace('''cardinalMaximumScale:
          1.5,''','''cardinalMaximumScale:
          MATERIALS.CARDINAL_FOCUSED.scale,''').replace('''roomMaximumScale:
          1.5,''','''roomMaximumScale:
          MATERIALS.ROOM_PRIMARY.scale,''')
    cp.write_text(c); csp.write_text(c)

if 'SHOWROOM_COSMOS_ARCHCOIN_SCENE_FIELD_v1' not in co.read_text() or 'XMLHttpRequest' in co.read_text():
    s=Path('laws/index.cosmos.js').read_text()
    s=sub(s,r'/\* /laws/index\.cosmos\.js.*?\*/','''/* /showroom/index.cosmos.js
   Showroom scene-contained ARCHCOIN Fibonacci starfield clone.

   Preserves Showroom identity and decorative-only authority while duplicating
   the accepted Laws/ARCHCOIN static-base and burst-only sparkle corridor inside
   the Showroom orbit scene. This is the one canonical Showroom Cosmos authority.
*/''','cosmos header')
    for a,b in [('DGB_LAWS','SHOWROOM'),('LAWS','SHOWROOM'),('Laws','Showroom'),('laws','showroom'),('ownsLawContent','ownsShowroomContent'),('law-content','showroom-content'),('0x4c415753','0x53484f57'),('SHOWROOM_COSMOS_ARCHCOIN_SCENE_FIELD_v5','SHOWROOM_COSMOS_ARCHCOIN_SCENE_FIELD_v1')]: s=s.replace(a,b)
    s=s.replace('opacity: .93;','opacity: .84;',1).replace('opacity: .86;','opacity: .82;',1).replace('opacity: .78;','opacity: .76;',1)
    s=one(s,'      sceneContained: true,\n      fullViewportLayer: false,','      sceneContained: true,\n      singleCosmosAuthority: true,\n      wrapperSourceFetchUsed: false,\n      synchronousNetworkRequestUsed: false,\n      fullViewportLayer: false,','cosmos receipt')
    co.write_text(s)

h=hp.read_text()
if 'SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_10_SPATIAL_COSMOS_CONTINUITY' not in h:
    h=h.replace('SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_9_1_COHERENCE_CONTEXT_ROUTE_CONTRACT_RESTORATION','SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_10_SPATIAL_COSMOS_CONTINUITY')
    h=one(h,'data-version="SHOWROOM-MIRRORLAND-IMMERSIVE-MISSION-CONTEXT-17.9.1"','data-version="SHOWROOM-MIRRORLAND-IMMERSIVE-MISSION-CONTEXT-17.10"','html version')
    h=one(h,'data-showroom-cosmos-contract="SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_WRAPPER_v1"','data-showroom-cosmos-contract="SHOWROOM_COSMOS_ARCHCOIN_SCENE_FIELD_v1"','html cosmos contract')
    h=one(h,'data-showroom-cosmos-static-fallback="css-atmosphere"','''data-showroom-cosmos-static-fallback="scene-contained-static-base-starfield"
  data-showroom-cosmos-authority-count="1"
  data-showroom-cosmos-secondary-source="false"
  data-showroom-cosmos-synchronous-fetch="false"
  data-showroom-crystals-contract="SHOWROOM_CANONICAL_CRYSTAL_SPATIAL_INTEGRATION_v2"
  data-showroom-detached-crystal-halo="false"''','html metadata')
    h=h.replace('SHOWROOM_MIRRORLAND_NARRATIVE_ATLAS_CSS_TNT_v13_10_CENTER_COMPASS_HIT_SURFACE_RESTORATION','SHOWROOM_MIRRORLAND_NARRATIVE_ATLAS_CSS_TNT_v14_0_COSMOS_COMPLEMENTARY_STAGE_RENEWAL')
    h=one(h,'/showroom/index.crystals.js?v=SHOWROOM_CANONICAL_MAIN_CRYSTAL_CLONE_20260726H',f'/showroom/index.crystals.js?v={CACHE}','crystal cache')
    marker='''  const orbitScripts = [
    {
      src:
        "/showroom/index.compositor.js?v=SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v6",'''
    insertion=f'''  const orbitScripts = [
    {{
      src:
        "/showroom/index.cosmos.js?v={CACHE}",
      attributes: {{
        "data-showroom-child": "cosmos",
        "data-showroom-staged-group": "orbit"
      }}
    }},
    {{
      src:
        "/showroom/index.compositor.js?v=SHOWROOM_CONSTELLATION_SINGLE_FRAME_COMPOSITOR_TNT_v6",'''
    h=one(h,marker,insertion,'cosmos orbit insertion')
    h=sub(h,r'    \{\n      src:\n        "/showroom/index\.cosmos\.js\?v=SHOWROOM_COSMOS_LUMINOUS_CONTINUITY_20260726G",\n      attributes: \{.*?\n    \},\n','', 'idle cosmos removal')
    start=h.find('\n<!--\nSHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_RECEIPT')
    if start<0: raise SystemExit('receipt start absent')
    h=h[:start]+f'''\n<!--
SHOWROOM_SPATIAL_COSMOS_CONTINUITY_RECEIPT_v1
TARGET: /showroom/
HTML_CONTRACT: SHOWROOM_MIRRORLAND_IMMERSIVE_MISSION_CONTEXT_HTML_TNT_v17_10_SPATIAL_COSMOS_CONTINUITY
COSMOS_CONTRACT: SHOWROOM_COSMOS_ARCHCOIN_SCENE_FIELD_v1
CRYSTAL_CONTRACT: SHOWROOM_CANONICAL_CRYSTAL_SPATIAL_INTEGRATION_v2
CACHE_IDENTITY: {CACHE}
RUNTIME_CHAIN: controller direct; orbit visibility loads Cosmos, compositor, Audralia geometry, planet, crystals; interaction, Diamond/Window and idle support groups remain separately triggered.
RETIRED: Cosmos wrapper/source split, synchronous source request, dynamic preserved-source injection, detached additive full-mesh crystal halo.
PROTECTED: controller, compositor, interactions, planet, Diamond, Window, routes, labels, narrative content, CSS bytes.
RUNTIME_VISUAL_SUCCESS_CLAIMED: FALSE
USER_VISUAL_ACCEPTANCE: PENDING
-->
'''
    hp.write_text(h)

if retired.exists(): retired.unlink()
