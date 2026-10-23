"""Fixed world-coordinate diagnostic views; not a rendered-world acceptance image."""
import json,gzip,subprocess
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path(__file__).resolve().parents[3];out=Path(__file__).resolve().parent
asset='showroom/globe/h-earth/render/assets/precomputed-grass.v1.'
base='c64e78d5a05711f0b2ec7e98fb400c65d8e430df'
old=json.loads(subprocess.check_output(['git','show',base+':'+asset+'json'],cwd=root));new=json.loads((root/(asset+'json')).read_text())
data=[gzip.decompress(subprocess.check_output(['git','show',base+':'+asset+'bin.gz'],cwd=root)),gzip.decompress((root/(asset+'bin.gz')).read_bytes())]
dtype=np.dtype({'names':['x','z'],'formats':['<f8','<f8'],'offsets':[0,16],'itemsize':52})
bounds=[-136,249,-253,-101];xb=np.arange(-136,251,2);zb=np.arange(-253,-99,2)
f,axes=plt.subplots(2,1,figsize=(14,10),constrained_layout=True)
for ax,b,m,title in zip(axes,data,[old,new],['Before: released planting','Candidate: connected hillside infill']):
 a=np.frombuffer(b,dtype=dtype,count=m['rootCount']);hist=np.histogram2d(a['z'],a['x'],bins=[zb,xb])[0]/4
 im=ax.imshow(hist,extent=[xb[0],xb[-1],zb[-1],zb[0]],vmin=0,vmax=24,cmap='YlGn',interpolation='nearest',aspect='equal');ax.set_title(title);ax.set_xlabel('World x (m)');ax.set_ylabel('World z (m)');f.colorbar(im,ax=ax,label='Grass roots / square metre')
 for label,x,z in [('Woodland edge',-125,-200),('Inlet bank',15,-190),('Central ridge',86,-235),('Eastern hill',148,-224)]:ax.annotate(label,(x,z),(x,z-10),fontsize=9,arrowprops={'arrowstyle':'-','color':'black'})
f.suptitle('Same coordinate extent and density scale · diagnostic census, not GPU imagery')
f.savefig(out/'coverage-comparison.png',dpi=130)
