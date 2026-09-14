from pathlib import Path
import hashlib

cap_path=Path('assets/compass/compass.capability-carousel.js')
ori_path=Path('assets/compass/compass.orientation-cinematic.js')
idx_path=Path('index.html')

cap=cap_path.read_text(encoding='utf-8')
start="function installFirstEntryHiddenSyncGate(){"
end="installFirstEntryHiddenSyncGate();\n"
assert cap.count(start)==1, 'hidden-sync gate start count mismatch'
assert cap.count(end)==1, 'hidden-sync gate end count mismatch'
i=cap.index(start)
j=cap.index(end,i)+len(end)
cap=cap[:i]+cap[j:]
assert 'installFirstEntryHiddenSyncGate' not in cap
cap_path.write_text(cap,encoding='utf-8')

ori=ori_path.read_text(encoding='utf-8')
ambient_block_old="""  const ambientVideo=document.createElement('video');
  ambientVideo.className='compass-prerendered-player__ambient-video';
  ambientVideo.playsInline=true;
  ambientVideo.preload='auto';
  ambientVideo.controls=false;
  ambientVideo.muted=true;
  ambientVideo.disablePictureInPicture=true;
  ambientVideo.setAttribute('aria-hidden','true');
  ambientVideo.poster=CONTRACT.posterPath;
  ambientVideo.src=CONTRACT.mediaPath;
"""
ambient_block_new="""  const ambientVideo=document.createElement('video');
  ambientVideo.className='compass-prerendered-player__ambient-video';
  ambientVideo.playsInline=true;
  ambientVideo.preload='none';
  ambientVideo.controls=false;
  ambientVideo.muted=true;
  ambientVideo.disablePictureInPicture=true;
  ambientVideo.setAttribute('aria-hidden','true');
  ambientVideo.poster=CONTRACT.posterPath;
"""
video_block_old="""  const video=document.createElement('video');
  video.className='compass-prerendered-player__video';
  video.playsInline=true;
  video.preload='auto';
  video.controls=false;
  video.disablePictureInPicture=true;
  video.setAttribute('aria-label','Diamond Gate Bridge orientation film');
  video.setAttribute('data-main-orientation-video','');
  video.poster=CONTRACT.posterPath;
  video.src=CONTRACT.mediaPath;
"""
video_block_new="""  const video=document.createElement('video');
  video.className='compass-prerendered-player__video';
  video.playsInline=true;
  video.preload='none';
  video.controls=false;
  video.disablePictureInPicture=true;
  video.setAttribute('aria-label','Diamond Gate Bridge orientation film');
  video.setAttribute('data-main-orientation-video','');
  video.poster=CONTRACT.posterPath;
"""
assert ori.count(ambient_block_old)==1, 'ambient cinematic block mismatch'
assert ori.count(video_block_old)==1, 'foreground cinematic block mismatch'
ori=ori.replace(ambient_block_old,ambient_block_new,1)
ori=ori.replace(video_block_old,video_block_new,1)

anchor="function currentNavigationType(){"
assert ori.count(anchor)==1
helper="""function activateCinematicMedia(){
  const activate=media=>{
    if(!media||media.dataset.mediaActivated==='true')return;
    media.dataset.mediaActivated='true';
    media.preload='auto';
    media.src=CONTRACT.mediaPath;
    media.load();
  };
  activate(session.ambientVideo);
  activate(session.video);
}

"""
ori=ori.replace(anchor,helper+anchor,1)

play_anchor="""function play(){
  if(session.state!==STATE.ARMED||session.playRequested)return;
  if(reduced()){settle('reduced-motion-complete');return;}
  session.playRequested=true;
"""
play_replacement="""function play(){
  if(session.state!==STATE.ARMED||session.playRequested)return;
  if(reduced()){settle('reduced-motion-complete');return;}
  activateCinematicMedia();
  session.playRequested=true;
"""
assert ori.count(play_anchor)==1, 'play anchor mismatch'
ori=ori.replace(play_anchor,play_replacement,1)
assert "ambientVideo.src=CONTRACT.mediaPath" not in ori
assert "video.src=CONTRACT.mediaPath" not in ori
assert ori.count('activateCinematicMedia();')==1
ori_path.write_text(ori,encoding='utf-8')

idx=idx_path.read_text(encoding='utf-8')
chapter_old='<video controls preload="metadata" playsinline aria-label="Diamond Gate Bridge — Chapter One"><source src="/showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4" type="video/mp4"></video>'
chapter_new='<video controls preload="none" playsinline aria-label="Diamond Gate Bridge — Chapter One" data-compass-chapter-one-video><source data-src="/showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4" type="video/mp4"></video>'
assert idx.count(chapter_old)==1, 'Chapter One media anchor mismatch'
idx=idx.replace(chapter_old,chapter_new,1)

audio_old='<audio data-compass-ambient-audio autoplay loop playsinline preload="auto" aria-hidden="true" style="display:none"><source src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg" type="audio/ogg"></audio>'
audio_new='<audio data-compass-ambient-audio loop playsinline preload="none" aria-hidden="true" style="display:none"><source data-src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg" type="audio/ogg"></audio>'
assert idx.count(audio_old)==1, 'ambient audio anchor mismatch'
idx=idx.replace(audio_old,audio_new,1)

chapter_js_old="""    select(0);
  }
  const motivation=document.querySelector('[data-compass-motivation]');
"""
chapter_js_new="""    select(0);
    const activateChapterFilm=()=>{if(!chapter.open)return;const video=chapter.querySelector('[data-compass-chapter-one-video]');const source=video?.querySelector('source[data-src]');if(source&&!source.getAttribute('src')){video.preload='metadata';source.setAttribute('src',source.dataset.src||'');video.load();}};
    chapter.addEventListener('toggle',activateChapterFilm);
  }
  const motivation=document.querySelector('[data-compass-motivation]');
"""
assert idx.count(chapter_js_old)==1, 'Chapter One activation JS anchor mismatch'
idx=idx.replace(chapter_js_old,chapter_js_new,1)

ambient_js_old="""  if(ambient){ambient.volume=.24;const tryAmbient=()=>{if(!ambient.paused)return;const q=ambient.play();if(q&&q.catch)q.catch(()=>{})};tryAmbient();['pointerdown','pointerup','touchstart','touchend','click','keydown','wheel'].forEach(type=>document.addEventListener(type,tryAmbient,{passive:type!=='keydown'}));}
"""
ambient_js_new="""  if(ambient){ambient.volume=.24;const activateAmbient=()=>{if(ambient.dataset.mediaActivated==='true')return;const source=ambient.querySelector('source[data-src]');if(source&&!source.getAttribute('src')){source.setAttribute('src',source.dataset.src||'');ambient.load();}ambient.dataset.mediaActivated='true';};const tryAmbient=()=>{activateAmbient();if(!ambient.paused)return;const q=ambient.play();if(q&&q.catch)q.catch(()=>{})};['pointerdown','pointerup','touchstart','touchend','click','keydown','wheel'].forEach(type=>document.addEventListener(type,tryAmbient,{passive:type!=='keydown'}));}
"""
assert idx.count(ambient_js_old)==1, 'ambient activation JS anchor mismatch'
idx=idx.replace(ambient_js_old,ambient_js_new,1)

cap_cb=hashlib.sha256(cap_path.read_bytes()).hexdigest()[:16]
ori_cb=hashlib.sha256(ori_path.read_bytes()).hexdigest()[:16]
old_cap='compass.capability-carousel.js?v=compass-bounded-viewport-scheduling-001&cb=3bde95175e339ef8'
new_cap=f'compass.capability-carousel.js?v=compass-cold-media-gating-v1&cb={cap_cb}'
old_ori='compass.orientation-cinematic.js?v=audralia-immersive-title-v1&cb=6c8c39913ba3fa26'
new_ori=f'compass.orientation-cinematic.js?v=compass-cold-media-gating-v1&cb={ori_cb}'
assert idx.count(old_cap)==1, 'capability request identity anchor mismatch'
assert idx.count(old_ori)==1, 'orientation request identity anchor mismatch'
idx=idx.replace(old_cap,new_cap,1).replace(old_ori,new_ori,1)

assert 'source src="/showroom/globe/h-earth/awards/media/diamond-gate-compass-mirrorland-36s.mp4"' not in idx
assert 'source src="https://upload.wikimedia.org/wikipedia/commons/c/c2/Saint-Saens_-_The_Carnival_of_the_Animals_-_07_Aquarium.ogg"' not in idx
assert 'data-compass-ambient-audio autoplay' not in idx
assert 'data-compass-chapter-one-video' in idx
idx_path.write_text(idx,encoding='utf-8')

print('COLD_MEDIA_GATING_PATCH_PASS')
print('capability_cb='+cap_cb)
print('orientation_cb='+ori_cb)
