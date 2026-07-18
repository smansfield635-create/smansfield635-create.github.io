from pathlib import Path

path = Path('showroom/globe/h-earth/index.html')
text = path.read_text(encoding='utf-8')

old_block = """                    sourceObjectIds:
                      Object.freeze([
                        previewResult
                          .sourceObjectId
                      ]),"""
new_block = """                    sourceObjectIds:
                      Object.freeze([
                        ...previewResult
                          .sourceObjectIds
                      ]),"""

if old_block in text:
    text = text.replace(old_block, new_block, 1)
elif new_block not in text:
    raise SystemExit(
        'route aggregate source-object metadata block is neither old nor repaired'
    )

path.write_text(text, encoding='utf-8')
print('Shoreline route aggregate source-object metadata repaired')
