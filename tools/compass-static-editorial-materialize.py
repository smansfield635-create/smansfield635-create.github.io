from pathlib import Path
import hashlib
import re

HTML = Path('index.html')
CRYSTALS = Path('assets/compass/compass.crystals.js')
s = HTML.read_text()
crystals = CRYSTALS.read_text()

assert 'compass.track-b.js' not in s
assert 'compass.track-b.css' not in s
assert 'positionCapability' not in s
assert s.count('<header class="compass-estate__header">') == 1
assert s.count('data-compass-capability-switcher') == 1
assert s.count('<section class="compass-built"') == 1
assert s.count('<section class="compass-build-cta"') == 1
assert 'COMPASS_STATIC_EDITORIAL_SUCCESSOR_v1' not in s
assert 'COMPASS_CRYSTAL_CONTINUOUS_NORMAL_MOTION_v1' not in crystals


def balanced_element(source, marker, tag):
    start = source.find(marker)
    assert start >= 0, f'MARKER_NOT_FOUND:{marker}'
    token = re.compile(rf'<{tag}(?:\s|>)|</{tag}>', re.I)
    depth = 0
    for match in token.finditer(source, start):
        if match.group(0).lower().startswith(f'<{tag}'):
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return start, match.end(), source[start:match.end()]
    raise AssertionError(f'UNBALANCED_{tag.upper()}:{marker}')


css = r'''
/* COMPASS_STATIC_EDITORIAL_SUCCESSOR_v1 — static presentation only. */
.compass-editorial-brand{margin:0 auto .7rem;text-align:center;font:800 clamp(.72rem,1.3vw,.88rem)/1.2 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.18em;color:rgba(244,214,128,.92)}
.compass-estate__header{max-width:76rem!important;margin-left:auto!important;margin-right:auto!important;padding-bottom:clamp(.4rem,1.2vw,.9rem)!important}
.compass-estate__header h1{font-size:clamp(3.8rem,10vw,8.8rem)!important;line-height:.84!important;letter-spacing:-.035em!important;margin:.1rem 0 .45rem!important;text-align:center}
.compass-estate__header .compass-estate__descriptor,.compass-estate__header p{max-width:66rem;margin-left:auto!important;margin-right:auto!important;text-align:center}
.compass-editorial-intro{max-width:72rem;margin:clamp(.7rem,1.7vw,1.15rem) auto clamp(1rem,2.4vw,1.6rem);border:1px solid rgba(220,226,223,.2);border-radius:1.2rem;background:linear-gradient(145deg,rgba(8,18,26,.86),rgba(12,27,36,.72));box-shadow:0 20px 54px rgba(0,0,0,.26),inset 0 1px 0 rgba(255,255,255,.07);overflow:hidden}
.compass-editorial-intro>summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem 1.2rem;color:rgba(255,247,220,.97);font:780 clamp(1rem,2vw,1.18rem)/1.25 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.015em}
.compass-editorial-intro>summary::-webkit-details-marker,.compass-editorial-about>summary::-webkit-details-marker{display:none}.compass-editorial-intro>summary::after{content:'+';font-size:1.45rem;font-weight:400;color:rgba(102,196,215,.9)}.compass-editorial-intro[open]>summary::after{content:'−'}
.compass-editorial-intro__body{display:grid;gap:1rem;padding:0 1rem 1rem}
.compass-editorial-film{position:relative;aspect-ratio:16/9;border-radius:.9rem;overflow:hidden;background:#03070b;box-shadow:0 18px 50px rgba(0,0,0,.35)}
.compass-editorial-film video{display:block;width:100%;height:100%;object-fit:contain;background:#000}
.compass-editorial-about{border-top:1px solid rgba(244,214,128,.2);padding:.35rem 0 0}.compass-editorial-about>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:1rem .35rem;color:rgba(255,247,220,.97);font:800 clamp(1.05rem,2vw,1.22rem)/1.25 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em}.compass-editorial-about>summary::after{content:'+';font-size:1.3rem;color:rgba(244,214,128,.9)}.compass-editorial-about[open]>summary::after{content:'−'}
.compass-editorial-about-copy{display:grid;gap:0;margin:.15rem 0 0;padding:clamp(1rem,2.5vw,1.5rem);border:1px solid rgba(219,226,221,.16);border-radius:.95rem;background:linear-gradient(145deg,rgba(7,15,22,.9),rgba(12,25,33,.82));box-shadow:inset 0 1px 0 rgba(255,255,255,.06);font-size:clamp(.98rem,1.7vw,1.1rem);line-height:1.68;color:rgba(244,241,230,.91)}
.compass-editorial-about-copy p{margin:0 0 1rem;max-width:72ch}.compass-editorial-about-copy p:nth-of-type(3),.compass-editorial-about-copy p:nth-of-type(4){padding:1rem 1.05rem;border-left:3px solid rgba(244,214,128,.58);border-radius:0 .75rem .75rem 0;background:linear-gradient(90deg,rgba(244,214,128,.075),rgba(10,23,31,.18));color:rgba(255,247,220,.98);font-weight:700}.compass-editorial-about-copy p:nth-of-type(5){padding:.95rem 1.05rem;border-left:3px solid rgba(102,196,215,.58);background:linear-gradient(90deg,rgba(70,177,199,.09),transparent);color:rgba(248,245,231,.96)}.compass-editorial-about-copy p:last-child{margin-bottom:0}
.compass-guidance{border-top:1px solid rgba(244,214,128,.2)!important;border-bottom:1px solid rgba(102,196,215,.2)!important;background:linear-gradient(90deg,rgba(244,214,128,.035),rgba(102,196,215,.035))!important;color:rgba(244,241,230,.94)!important}
.compass-built{margin-top:clamp(2rem,5vw,4rem)!important}.compass-capability-cue{margin-top:clamp(2rem,4vw,3.2rem)!important}.compass-capability-orbit{margin-top:clamp(.7rem,2vw,1.2rem)!important}.compass-build-cta{margin-top:clamp(2.5rem,6vw,5rem)!important;padding-top:clamp(1.6rem,3vw,2.4rem)!important;border-top:1px solid rgba(244,214,128,.18)}
.compass-accessibility-routes{max-width:72rem;margin:1rem auto 0;border-top:1px solid rgba(220,226,223,.14);padding-top:.7rem}.compass-accessibility-routes>summary{cursor:pointer;width:max-content;max-width:100%;padding:.55rem .75rem;border-radius:.7rem;color:rgba(229,232,225,.74);font-size:.82rem}.compass-accessibility-routes nav{display:flex;flex-wrap:wrap;gap:.45rem .8rem;padding:.7rem .25rem}.compass-accessibility-routes a{min-height:44px;display:inline-flex;align-items:center}
.compass-accessibility-note{font-size:.78rem!important;line-height:1.45!important;color:rgba(229,232,225,.64)!important;max-width:72rem!important;margin:.6rem auto 0!important;text-align:left!important}
@media(max-width:760px){.compass-estate__header h1{font-size:clamp(3.15rem,17vw,5.4rem)!important}.compass-editorial-brand{letter-spacing:.12em}.compass-editorial-intro{margin-left:.65rem;margin-right:.65rem}.compass-editorial-about-copy{padding:1rem}}
@media(max-width:480px){.compass-editorial-intro__body{padding:0 .65rem .75rem}.compass-editorial-intro>summary{padding:.9rem 1rem}.compass-editorial-about-copy p:nth-of-type(3),.compass-editorial-about-copy p:nth-of-type(4),.compass-editorial-about-copy p:nth-of-type(5){padding:.85rem .9rem}}
'''.strip()
s = s.replace('</style>', css + '\n</style>', 1)

header = '''<header class="compass-estate__header"><div class="compass-editorial-brand">DiamondGateBridge.com</div><p class="compass-estate__kicker">Diamond Gate Bridge · Find Your Way</p><h1 id="compass-title">The Compass</h1><p class="compass-estate__sentence">Discovery begins when the boundaries between what we know start to disappear.</p><p class="compass-estate__epigraph">“When you learn to live a life without expectations, you experience a life without limitations.”</p></header>
<details class="compass-editorial-intro" data-compass-static-introduction><summary>New here? Open the introduction.</summary><div class="compass-editorial-intro__body"><div class="compass-editorial-film"><video controls preload="metadata" playsinline aria-label="Diamond Gate Bridge — Chapter One"><source src="/showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4" type="video/mp4"></video></div><details class="compass-editorial-about"><summary>What is Diamond Gate Bridge?</summary><div class="compass-editorial-about-copy" data-compass-static-about-copy><p>Diamond Gate exists because useful ideas are often separated by the boundaries between disciplines, products, institutions, and stories. The estate gives those different kinds of work one place to meet without pretending they are all the same thing.</p><p>It connects research, software, worlds, evidence, governance, construction, and human questions so you can move between them while keeping their differences visible.</p><p>For thousands of years, people have searched for better ways to understand themselves, each other, and the systems they inhabit. Philosophers questioned first principles. Each discipline illuminated part of the landscape.</p><p>Perhaps the next step is not abandoning what came before, but making those pieces easier to see together. The Earth did not become round when we discovered it. What if the next frontier is not outside the box, but outside the cube? Diamond Gate Bridge begins with that question.</p><p>The Compass is how you orient yourself inside that larger purpose. North gives context. East opens worlds. South measures and governs. West builds and tests.</p><p>Bring a question. Move through the estate until the right kind of room becomes clear.</p></div></details></div></details>'''
s, n = re.subn(r'<header class="compass-estate__header">.*?</header>', header, s, count=1, flags=re.S)
assert n == 1

cap_start = s.find('<p class="compass-capability-cue">')
assert cap_start >= 0
_, cap_end, _ = balanced_element(s, '<section class="compass-monuments"', 'section')
cap = s[cap_start:cap_end]
built_start, built_end, built = balanced_element(s, '<section class="compass-built"', 'section')
cta_start, cta_end, cta = balanced_element(s, '<section class="compass-build-cta"', 'section')
assert cap_start < built_start < cta_start
s = s[:cap_start] + built + '\n' + cap + '\n' + cta + s[cta_end:]

nav_start, nav_end, nav = balanced_element(s, '<nav class="compass-selective-routes"', 'nav')
note_match = re.search(r'<p class="compass-accessibility-note">.*?</p>', s, flags=re.S)
assert note_match and note_match.start() >= nav_end
accessibility = '<details class="compass-accessibility-routes"><summary>All destinations</summary>' + nav + '</details>\n' + note_match.group(0)
s = s[:nav_start] + accessibility + s[nav_end:note_match.start()] + s[note_match.end():]
s = s.replace('class="compass-selective-routes"', 'class="compass-selective-routes" data-editorial-fallback="true"', 1)

plan = 'data-compass-plan="COMPASS_INFORMATION_DELIVERY_20260814"'
assert s.count(plan) == 1
s = s.replace(plan, plan + ' data-compass-static-editorial-successor="v1"', 1)

liveness_old = '''    for (let index = 0; index < 3; index += 1) {
      if (scalarNeedsSettlement(state.camera.eye[index], state.camera.nextEye[index]) || scalarNeedsSettlement(state.camera.target[index], state.camera.nextTarget[index])) return true;
    }
    return false;
  }

  function requestRender() {'''
liveness_new = '''    for (let index = 0; index < 3; index += 1) {
      if (scalarNeedsSettlement(state.camera.eye[index], state.camera.nextEye[index]) || scalarNeedsSettlement(state.camera.target[index], state.camera.nextTarget[index])) return true;
    }
    // COMPASS_CRYSTAL_CONTINUOUS_NORMAL_MOTION_v1
    // Time-dependent star rotation, float, twinkle, and shader motion require a live frame clock.
    // Reduced-motion users retain the existing settle-and-idle behavior.
    if (!state.reducedMotion) return true;
    return false;
  }

  function requestRender() {'''
assert crystals.count(liveness_old) == 1, 'CRYSTAL_LIVENESS_INSERTION_POINT_DRIFTED'
crystals = crystals.replace(liveness_old, liveness_new, 1)

crystal_bytes = crystals.encode('utf-8')
git_blob = hashlib.sha1(f'blob {len(crystal_bytes)}\0'.encode('ascii') + crystal_bytes).hexdigest()
cache_id = git_blob[:16]
crystal_script = re.compile(r'(/assets/compass/compass\.crystals\.js\?[^"\']*?&cb=)[0-9a-f]+')
s, cache_count = crystal_script.subn(r'\g<1>' + cache_id, s, count=1)
assert cache_count == 1, 'CRYSTAL_CACHE_BINDING_NOT_FOUND'

assert 'DiamondGateBridge.com' in s
assert 'New here? Open the introduction.' in s
assert 'What is Diamond Gate Bridge?' in s
assert 'diamond-gate-compass-mirrorland-36s.mp4' in s
assert '<summary>Why Diamond Gate exists</summary>' not in s
assert 'compass.track-b.js' not in s
assert 'compass.track-b.css' not in s
assert 'positionCapability' not in s
assert s.index('<section class="compass-built"') < s.index('data-compass-capability-switcher') < s.index('<section class="compass-build-cta"')
assert s.count('data-compass-capability-switcher') == 1
assert s.count('data-compass-room-declarations') == 1
assert s.count('data-editorial-fallback="true"') == 1
assert 'COMPASS_CRYSTAL_CONTINUOUS_NORMAL_MOTION_v1' in crystals
assert f'compass.crystals.js?v=gen1532-live-binding-v1&cb={cache_id}' in s

HTML.write_text(s)
CRYSTALS.write_text(crystals)
print(f'STATIC_EDITORIAL_AND_CRYSTAL_LIVENESS_MATERIALIZED:{cache_id}')
