(()=>{
  'use strict';

  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const mod=(value,base)=>((value%base)+base)%base;
  const TAU=Math.PI*2;
  const FOCUSABLE='a,button,input,select,textarea,[tabindex]';
  const BRAIN_SNAPSHOT_POSES=Object.freeze({
    front:Object.freeze({yaw:0,pitch:0}),
    side:Object.freeze({yaw:Math.PI/2,pitch:0}),
    rear:Object.freeze({yaw:Math.PI,pitch:0}),
    underside:Object.freeze({yaw:.58,pitch:-.48})
  });
  let brainSnapshotController=null;

  function claimSwipe(stage,onResolve,{disabled=()=>false}={}){
    let active=false,captured=false,startX=0,startY=0,pointerId=null;
    stage.style.touchAction='pan-y';
    stage.addEventListener('pointerdown',event=>{
      if(disabled()||event.button>0||event.target.closest('a,button,input,select,textarea,[role="button"],[data-human-brain]'))return;
      active=true;
      captured=false;
      pointerId=event.pointerId;
      startX=event.clientX;
      startY=event.clientY;
    });
    stage.addEventListener('pointermove',event=>{
      if(!active||captured||event.pointerId!==pointerId)return;
      const dx=event.clientX-startX;
      const dy=event.clientY-startY;
      if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.25)return;
      captured=true;
      stage.setPointerCapture?.(pointerId);
    });
    stage.addEventListener('pointerup',event=>{
      if(!active||event.pointerId!==pointerId)return;
      const dx=event.clientX-startX;
      const dy=event.clientY-startY;
      const width=Math.max(1,stage.getBoundingClientRect().width);
      active=false;
      if(captured&&stage.hasPointerCapture?.(pointerId))stage.releasePointerCapture?.(pointerId);
      captured=false;
      if(Math.abs(dx)<36&&Math.abs(dx)<width*.08)return;
      if(Math.abs(dx)<Math.abs(dy)*1.25)return;
      event.preventDefault();
      onResolve(dx<0?1:-1);
    });
    stage.addEventListener('pointercancel',event=>{
      active=false;
      if(captured&&stage.hasPointerCapture?.(event.pointerId))stage.releasePointerCapture?.(event.pointerId);
      captured=false;
    });
  }

  function sparkle(sentence){
    sentence.closest('[data-statement-orbit]')?.querySelectorAll('.compass-statement-sparkles').forEach(field=>field.remove());
    if(reduce.matches){
      sentence.classList.remove('is-arriving');
      void sentence.offsetWidth;
      sentence.classList.add('is-arriving');
      setTimeout(()=>sentence.classList.remove('is-arriving'),260);
      return;
    }
    sentence.classList.remove('is-arriving');
    void sentence.offsetWidth;
    sentence.classList.add('is-arriving');
    const field=document.createElement('span');
    field.className='compass-statement-sparkles';
    field.setAttribute('aria-hidden','true');
    const count=10;
    for(let index=0;index<count;index+=1){
      const star=document.createElement('i');
      const angle=(index/count)*TAU+(index%2)*.23;
      const radius=38+(index%4)*11;
      star.style.setProperty('--sx',`${50+Math.cos(angle)*radius}%`);
      star.style.setProperty('--sy',`${50+Math.sin(angle)*radius*.42}%`);
      star.style.setProperty('--delay',`${index*26}ms`);
      field.append(star);
    }
    sentence.append(field);
    setTimeout(()=>{
      field.remove();
      sentence.classList.remove('is-arriving');
    },680);
  }

  function setInteractive(container,interactive){
    container.inert=!interactive;
    container.toggleAttribute('inert',!interactive);
    container.querySelectorAll(FOCUSABLE).forEach(control=>{
      if(interactive){
        if(!control.hasAttribute('data-orbit-prior-tabindex'))return;
        const prior=control.dataset.orbitPriorTabindex;
        if(prior==='__none__')control.removeAttribute('tabindex');
        else control.setAttribute('tabindex',prior);
        delete control.dataset.orbitPriorTabindex;
        return;
      }
      if(!control.hasAttribute('data-orbit-prior-tabindex')){
        control.dataset.orbitPriorTabindex=control.hasAttribute('tabindex')?control.getAttribute('tabindex'):'__none__';
      }
      control.tabIndex=-1;
    });
  }

  function focusWithoutScroll(element){
    if(!element)return;
    try{element.focus({preventScroll:true});}catch{element.focus();}
  }

  function statementOrbit(){
    const header=document.querySelector('.compass-estate__header');
    if(!header||header.querySelector('[data-statement-orbit]'))return;
    const opening=header.querySelector('.compass-estate__sentence');
    const reflection=header.querySelector('.compass-estate__epigraph');
    if(!opening||!reflection)return;

    const stage=document.createElement('div');
    stage.className='compass-statement-orbit';
    stage.dataset.statementOrbit='true';
    stage.setAttribute('role','region');
    stage.setAttribute('aria-roledescription','carousel');
    stage.setAttribute('aria-label','Opening statements');
    stage.setAttribute('aria-describedby','compass-statement-guidance');

    const guidance=document.createElement('p');
    guidance.id='compass-statement-guidance';
    guidance.className='compass-statement-guidance';
    guidance.dataset.statementGuidance='true';
    guidance.textContent='Not everything is as it first appears. Swipe the thought above.';

    const status=document.createElement('p');
    status.className='compass-orbit-status';
    status.setAttribute('aria-live','polite');
    status.setAttribute('aria-atomic','true');

    const items=[opening,reflection];
    let activeIndex=0;
    let busy=false;
    items.forEach((element,index)=>{
      element.classList.add('compass-statement-object');
      element.removeAttribute('aria-hidden');
      element.setAttribute('aria-posinset',String(index+1));
      element.setAttribute('aria-setsize',String(items.length));
      element.dataset.slot=index===0?'front':'rear';
      stage.append(element);
    });
    stage.append(guidance,status);
    const introduction=header.querySelector('.compass-introduction');
    header.insertBefore(stage,introduction);

    function render(arrival=false){
      items.forEach((element,index)=>{
        const front=index===activeIndex;
        element.dataset.slot=front?'front':'rear';
        element.setAttribute('aria-current',front?'true':'false');
        element.setAttribute('aria-hidden',front?'false':'true');
        element.inert=!front;
      });
      status.textContent=`Statement ${activeIndex+1} of ${items.length}: ${items[activeIndex].textContent.trim()}`;
      if(arrival)sparkle(items[activeIndex]);
    }

    function rotate(direction){
      if(busy)return;
      busy=true;
      activeIndex=mod(activeIndex+direction,items.length);
      stage.dataset.rotate=direction>0?'next':'prev';
      render(false);
      setTimeout(()=>{
        stage.dataset.rotate='';
        sparkle(items[activeIndex]);
        busy=false;
      },reduce.matches?110:440);
    }

    claimSwipe(stage,rotate);
    stage.addEventListener('keydown',event=>{
      if(event.key==='ArrowRight'){
        event.preventDefault();
        rotate(1);
      }else if(event.key==='ArrowLeft'){
        event.preventDefault();
        rotate(-1);
      }
    });
    stage.tabIndex=0;
    render(true);
  }

  function normalise(vector){
    const length=Math.hypot(...vector)||1;
    return vector.map(value=>value/length);
  }

  function hemispherePoint(side,phi,theta){
    const vertical=Math.sin(phi);
    const ring=Math.cos(phi);
    const depth=Math.sin(theta);
    const outward=Math.max(0,Math.cos(theta));
    const frontal=Math.exp(-Math.pow((theta-.76)/.54,2))*Math.exp(-Math.pow((phi-.04)/.92,2));
    const parietal=Math.exp(-Math.pow((theta+.02)/.68,2))*Math.exp(-Math.pow((phi-.40)/.50,2));
    const occipital=Math.exp(-Math.pow((theta+.90)/.46,2))*Math.exp(-Math.pow((phi-.02)/.78,2));
    const temporal=Math.exp(-Math.pow((theta-.02)/.82,2))*Math.exp(-Math.pow((phi+.56)/.30,2));
    const fold=.62*Math.sin(theta*7.2+phi*4.7)+.31*Math.sin(theta*12.5-phi*7.3)+.17*Math.sin(theta*18.2+phi*10.4);
    const lobeRelief=1+.060*frontal+.035*parietal+.030*occipital+.075*temporal;
    const lateralRadius=.70*(.92+.10*temporal+.025*parietal);
    const x=side*(.018+lateralRadius*ring*outward*lobeRelief*(1+.038*fold));
    const y=.075+.70*vertical*(1+.022*frontal+.018*parietal)+.018*parietal-.042*temporal+.012*fold*ring;
    const depthRadius=.91*(1+.070*frontal+.035*occipital+.030*temporal);
    const z=.015+depthRadius*ring*depth+.038*frontal*ring+.018*fold*ring;
    const normal=normalise([side*ring*outward,vertical*.76,ring*depth]);
    return {position:[x,y,z],normal};
  }

  function regionFor(phi,theta){
    if(phi<-.27)return 'temporal';
    if(theta>.38)return 'frontal';
    if(theta<-.48)return 'occipital';
    return 'parietal';
  }

  function makeMesh(){
    const parts=[];

    function addHemisphere(side){
      const sideName=side<0?'left':'right';
      const segmentsPhi=22;
      const segmentsTheta=34;
      const vertices=[];
      const faces=[];
      const stride=segmentsTheta+1;
      for(let row=0;row<=segmentsPhi;row+=1){
        const phi=-Math.PI/2+(row/segmentsPhi)*Math.PI;
        for(let column=0;column<=segmentsTheta;column+=1){
          const theta=-Math.PI/2+(column/segmentsTheta)*Math.PI;
          vertices.push(hemispherePoint(side,phi,theta).position);
        }
      }
      for(let row=0;row<segmentsPhi;row+=1){
        for(let column=0;column<segmentsTheta;column+=1){
          const a=row*stride+column;
          const b=a+1;
          const d=(row+1)*stride+column;
          const c=d+1;
          const phi=-Math.PI/2+((row+.5)/segmentsPhi)*Math.PI;
          const theta=-Math.PI/2+((column+.5)/segmentsTheta)*Math.PI;
          const region=regionFor(phi,theta);
          faces.push([a,d,c,`${sideName}-${region}`],[a,c,b,`${sideName}-${region}`]);
        }
      }

      const boundary=[];
      for(let row=0;row<=segmentsPhi;row+=1)boundary.push(row*stride);
      for(let row=segmentsPhi;row>=0;row-=1)boundary.push(row*stride+segmentsTheta);
      const centre=vertices.push([side*.018,.075,.015])-1;
      for(let index=0;index<boundary.length;index+=1){
        const next=(index+1)%boundary.length;
        faces.push([centre,boundary[index],boundary[next],`${sideName}-medial`]);
      }
      parts.push({label:`${sideName}-hemisphere`,vertices,faces});
    }

    function addEllipsoid(label,cx,cy,cz,rx,ry,rz,segmentsU=20,segmentsV=12,warp=.025){
      const vertices=[];
      const faces=[];
      for(let row=0;row<=segmentsV;row+=1){
        const phi=-Math.PI/2+(row/segmentsV)*Math.PI;
        for(let column=0;column<segmentsU;column+=1){
          const theta=(column/segmentsU)*TAU;
          const relief=1+warp*(Math.sin(theta*6+phi*5)+.4*Math.sin(theta*11-phi*7));
          vertices.push([
            cx+rx*Math.cos(phi)*Math.cos(theta)*relief,
            cy+ry*Math.sin(phi)*relief,
            cz+rz*Math.cos(phi)*Math.sin(theta)*relief
          ]);
        }
      }
      for(let row=0;row<segmentsV;row+=1){
        for(let column=0;column<segmentsU;column+=1){
          const next=(column+1)%segmentsU;
          const a=row*segmentsU+column;
          const b=row*segmentsU+next;
          const c=(row+1)*segmentsU+next;
          const d=(row+1)*segmentsU+column;
          faces.push([a,b,c,label],[a,c,d,label]);
        }
      }
      parts.push({label,vertices,faces});
    }

    function addTaperedStem(){
      const label='brainstem';
      const segments=18;
      const rings=[
        {y:-.57,r:.16,z:-.05},
        {y:-.72,r:.145,z:-.06},
        {y:-.89,r:.115,z:-.08},
        {y:-1.05,r:.085,z:-.10}
      ];
      const vertices=[];
      const faces=[];
      rings.forEach(ring=>{
        for(let index=0;index<segments;index+=1){
          const theta=(index/segments)*TAU;
          vertices.push([ring.r*Math.cos(theta),ring.y,ring.z+ring.r*.72*Math.sin(theta)]);
        }
      });
      for(let ring=0;ring<rings.length-1;ring+=1){
        for(let index=0;index<segments;index+=1){
          const next=(index+1)%segments;
          const a=ring*segments+index;
          const b=ring*segments+next;
          const c=(ring+1)*segments+next;
          const d=(ring+1)*segments+index;
          faces.push([a,b,c,label],[a,c,d,label]);
        }
      }
      parts.push({label,vertices,faces});
    }

    addHemisphere(-1);
    addHemisphere(1);
    addEllipsoid('cerebellum-left',-.25,-.54,-.58,.27,.27,.34,20,12,.045);
    addEllipsoid('cerebellum-right',.25,-.54,-.58,.27,.27,.34,20,12,.045);
    addEllipsoid('pons',0,-.57,-.04,.22,.17,.20,18,10,.015);
    addTaperedStem();
    return parts;
  }

  function makeSulci(){
    const curves=[];
    const thetaCurve=(side,{start,end,phi,amplitude=.055,frequency=3,phase=0,slope=0,steps=28})=>{
      const points=[];
      for(let index=0;index<=steps;index+=1){
        const progress=index/steps;
        const theta=start+(end-start)*progress;
        const curvedPhi=phi+slope*(progress-.5)+amplitude*Math.sin(progress*Math.PI*frequency+phase)+.018*Math.sin(progress*Math.PI*7+phase*.7);
        points.push(hemispherePoint(side,curvedPhi,theta));
      }
      curves.push(points);
    };
    const phiCurve=(side,{start,end,theta,amplitude=.065,frequency=2.4,phase=0,slope=0,steps=24})=>{
      const points=[];
      for(let index=0;index<=steps;index+=1){
        const progress=index/steps;
        const phi=start+(end-start)*progress;
        const curvedTheta=theta+slope*(progress-.5)+amplitude*Math.sin(progress*Math.PI*frequency+phase)+.016*Math.sin(progress*Math.PI*6.5+phase);
        points.push(hemispherePoint(side,phi,curvedTheta));
      }
      curves.push(points);
    };
    for(const side of[-1,1]){
      thetaCurve(side,{start:-1.22,end:.92,phi:.49,amplitude:.060,frequency:3.1,phase:.4,slope:-.05});
      thetaCurve(side,{start:-.95,end:.92,phi:.25,amplitude:.075,frequency:3.4,phase:1.2,slope:.09});
      thetaCurve(side,{start:-.80,end:.22,phi:.06,amplitude:.070,frequency:2.7,phase:2.1,slope:-.12,steps:20});
      thetaCurve(side,{start:.18,end:1.28,phi:.02,amplitude:.080,frequency:2.5,phase:.7,slope:.10,steps:20});
      thetaCurve(side,{start:-1.24,end:-.38,phi:-.18,amplitude:.060,frequency:2.2,phase:1.8,slope:.10,steps:18});
      thetaCurve(side,{start:-.46,end:1.26,phi:-.35,amplitude:.075,frequency:3.1,phase:2.6,slope:-.13,steps:26});
      thetaCurve(side,{start:-.72,end:.32,phi:-.53,amplitude:.052,frequency:2.8,phase:.3,slope:.08,steps:18});
      thetaCurve(side,{start:.38,end:1.24,phi:-.57,amplitude:.055,frequency:2.2,phase:1.5,slope:.15,steps:17});
      phiCurve(side,{start:-.34,end:.67,theta:.08,amplitude:.080,frequency:2.6,phase:.6,slope:-.08});
      phiCurve(side,{start:-.25,end:.58,theta:.38,amplitude:.070,frequency:2.2,phase:1.7,slope:.12,steps:20});
      phiCurve(side,{start:-.16,end:.55,theta:-.25,amplitude:.068,frequency:2.5,phase:2.4,slope:-.10,steps:19});
      phiCurve(side,{start:-.48,end:.12,theta:.78,amplitude:.060,frequency:2.2,phase:.9,slope:.08,steps:17});
    }
    return curves;
  }

  function makeCerebellarFolia(){
    const curves=[];
    for(const side of[-1,1]){
      const cx=side*.25;
      for(const [index,phi] of[-.58,-.38,-.18,.03,.23,.42,.57].entries()){
        const points=[];
        for(let sample=0;sample<=30;sample+=1){
          const theta=-Math.PI+(sample/30)*TAU;
          const ripple=1+.028*Math.sin(theta*7+index*.8);
          const cosinePhi=Math.cos(phi);
          points.push({
            position:[cx+.27*cosinePhi*Math.cos(theta)*ripple,-.54+.27*Math.sin(phi),-.58+.34*cosinePhi*Math.sin(theta)*ripple],
            normal:normalise([Math.cos(phi)*Math.cos(theta),Math.sin(phi),Math.cos(phi)*Math.sin(theta)])
          });
        }
        curves.push(points);
      }
    }
    return curves;
  }

  const BRAIN_MESH=makeMesh();
  const BRAIN_SULCI=makeSulci();
  const BRAIN_FOLIA=makeCerebellarFolia();

  function mountBrain(root){
    if(!root||root.dataset.brainMounted)return;
    root.dataset.brainMounted='true';
    root.dataset.brainContract='COMPASS_ANATOMICAL_BRAIN_XYZ_v1';
    root.dataset.brainView='eye-level-parallel';
    root.dataset.brainAxes='x,y,z';
    root.dataset.brainAxisLabels='X,Y,Z';
    root.dataset.brainAxisPurpose='spatial-orientation-only';
    root.dataset.brainComponents='left-hemisphere,right-hemisphere,longitudinal-fissure,cerebellum,pons,brainstem';
    root.dataset.brainRegions='frontal,temporal,parietal,occipital';
    root.dataset.brainSnapshotViews=Object.keys(BRAIN_SNAPSHOT_POSES).join(',');
    root.dataset.brainSnapshotApi='CompassEditorialCarousel.brainSnapshots.capture';

    const canvas=document.createElement('canvas');
    canvas.className='compass-brain-human';
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label','Eye-level rotating three-dimensional human brain showing left and right hemispheres, their longitudinal fissure, frontal, temporal, parietal and occipital regions, cerebellum, pons, and brainstem. X, Y and Z are spatial orientation axes only.');
    canvas.dataset.brainRenderer='anatomical-parametric-v2';
    canvas.dataset.brainView='eye-level-parallel';
    canvas.dataset.brainAxes='x,y,z';
    canvas.dataset.brainAxisLabels='X,Y,Z';
    canvas.dataset.brainAxisPurpose='spatial-orientation-only';
    canvas.dataset.brainRegions='frontal,temporal,parietal,occipital';
    canvas.dataset.brainMotion=reduce.matches?'static-reduced-motion':'slow-yaw';
    canvas.dataset.brainSnapshotViews=Object.keys(BRAIN_SNAPSHOT_POSES).join(',');
    root.append(canvas);

    const context=canvas.getContext('2d',{alpha:true});
    let yaw=.58;
    let targetYaw=.58;
    let pitch=0;
    let targetPitch=0;
    let dragging=false;
    let lastPointerX=0;
    let lastTime=performance.now();
    let animationFrame=0;
    let snapshotMode=false;
    let snapshotRestorePose=null;

    function rotate3(point,yawAngle=yaw,pitchAngle=pitch){
      const yawCosine=Math.cos(yawAngle);
      const yawSine=Math.sin(yawAngle);
      const yawed=[point[0]*yawCosine+point[2]*yawSine,point[1],-point[0]*yawSine+point[2]*yawCosine];
      const pitchCosine=Math.cos(pitchAngle);
      const pitchSine=Math.sin(pitchAngle);
      return [yawed[0],yawed[1]*pitchCosine-yawed[2]*pitchSine,yawed[1]*pitchSine+yawed[2]*pitchCosine];
    }

    function project(point,width,height,scale){
      const perspective=1/(3.5-point[2]*.36);
      return [width*.52+point[0]*scale*perspective,height*.48-point[1]*scale*perspective,point[2]];
    }

    function faceNormal(a,b,c){
      const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];
      const v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];
      return normalise([
        u[1]*v[2]-u[2]*v[1],
        u[2]*v[0]-u[0]*v[2],
        u[0]*v[1]-u[1]*v[0]
      ]);
    }

    function tissueColor(label,light,depth){
      const region=label.split('-').at(-1);
      const palette={
        frontal:[210,132,145],
        temporal:[186,105,132],
        parietal:[201,123,148],
        occipital:[178,109,141],
        medial:[157,92,119],
        left:[200,121,143],
        right:[194,116,147],
        pons:[170,102,119],
        brainstem:[151,88,111]
      };
      let base=palette[region]||palette[label]||[187,112,137];
      if(label.startsWith('cerebellum'))base=label.endsWith('left')?[172,102,125]:[164,99,129];
      const intensity=.53+.43*clamp(light,0,1)+.055*clamp(depth+1,0,2);
      return `rgb(${base.map(value=>Math.round(clamp(value*intensity,0,255))).join(',')})`;
    }

    function drawAxes(width,height){
      const origin=[Math.max(22,width*.09),height-Math.max(22,height*.10)];
      const length=clamp(Math.min(width,height)*.17,22,38);
      const axes=[
        {label:'X',vector:[1,0,0],color:'rgba(244,214,128,.78)'},
        {label:'Y',vector:[0,1,0],color:'rgba(103,211,232,.78)'},
        {label:'Z',vector:[0,0,1],color:'rgba(187,164,242,.78)'}
      ];
      context.save();
      context.lineWidth=1.15;
      context.font='700 10px Inter, ui-sans-serif, system-ui, sans-serif';
      context.textAlign='center';
      context.textBaseline='middle';
      for(const axis of axes){
        const rotated=rotate3(axis.vector,yaw);
        const end=[
          origin[0]+(rotated[0]+rotated[2]*.34)*length,
          origin[1]+(-rotated[1]+rotated[2]*.22)*length
        ];
        context.strokeStyle=axis.color;
        context.fillStyle=axis.color;
        context.beginPath();
        context.moveTo(origin[0],origin[1]);
        context.lineTo(end[0],end[1]);
        context.stroke();
        context.beginPath();
        context.arc(end[0],end[1],1.8,0,TAU);
        context.fill();
        context.fillText(axis.label,end[0]+(end[0]-origin[0])*.16,end[1]+(end[1]-origin[1])*.16);
      }
      context.fillStyle='rgba(225,239,242,.42)';
      context.beginPath();
      context.arc(origin[0],origin[1],2,0,TAU);
      context.fill();
      context.restore();
    }

    function strokeCurves(curves,width,height,scale,strokeStyle,lineWidth){
      context.save();
      context.lineCap='round';
      context.lineJoin='round';
      context.strokeStyle=strokeStyle;
      context.lineWidth=lineWidth;
      for(const curve of curves){
        let drawing=false;
        context.beginPath();
        for(const sample of curve){
          const normal=rotate3(sample.normal,yaw);
          if(normal[2]<.055){
            drawing=false;
            continue;
          }
          const point=project(rotate3(sample.position,yaw),width,height,scale);
          if(!drawing){
            context.moveTo(point[0],point[1]);
            drawing=true;
          }else context.lineTo(point[0],point[1]);
        }
        context.stroke();
      }
      context.restore();
    }

    function drawSulci(width,height,scale){
      strokeCurves(BRAIN_SULCI,width,height,scale,'rgba(55,22,43,.67)',1.75);
      strokeCurves(BRAIN_SULCI,width,height,scale,'rgba(242,164,185,.17)',.46);
    }

    function drawCerebellarFolia(width,height,scale){
      strokeCurves(BRAIN_FOLIA,width,height,scale,'rgba(58,24,43,.62)',1.25);
      strokeCurves(BRAIN_FOLIA,width,height,scale,'rgba(239,165,181,.14)',.38);
    }

    function drawFissure(width,height,scale){
      const frontNormal=rotate3([0,0,1],yaw);
      if(frontNormal[2]<.08)return;
      context.save();
      context.lineCap='round';
      context.strokeStyle='rgba(54,22,43,.72)';
      context.lineWidth=2.2;
      context.beginPath();
      for(let index=0;index<=28;index+=1){
        const y=.80-(index/28)*1.17;
        const vertical=(y-.08)/.80;
        const z=.72*Math.sqrt(Math.max(0,1-vertical*vertical));
        const point=project(rotate3([0,y,z],yaw),width,height,scale);
        if(index===0)context.moveTo(point[0],point[1]);
        else context.lineTo(point[0],point[1]);
      }
      context.stroke();
      context.restore();
    }

    function resize(){
      const bounds=root.getBoundingClientRect();
      const density=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.max(1,Math.round(bounds.width*density));
      canvas.height=Math.max(1,Math.round(bounds.height*density));
      context.setTransform(density,0,0,density,0,0);
      if(reduce.matches)requestAnimationFrame(draw);
    }

    function draw(now){
      const elapsed=Math.min(50,Math.max(0,now-lastTime));
      lastTime=now;
      if(!snapshotMode&&!dragging&&!reduce.matches)targetYaw+=elapsed*(6*Math.PI/180/1000);
      yaw+=(targetYaw-yaw)*(reduce.matches?1:.075);
      pitch+=(targetPitch-pitch)*(reduce.matches?1:.11);
      canvas.dataset.brainYawDegrees=(mod(yaw,TAU)*180/Math.PI).toFixed(1);
      canvas.dataset.brainPitchDegrees=(pitch*180/Math.PI).toFixed(1);

      const width=canvas.clientWidth;
      const height=canvas.clientHeight;
      const scale=Math.min(width,height)*1.48;
      context.clearRect(0,0,width,height);

      const glow=context.createRadialGradient(width*.52,height*.46,8,width*.52,height*.46,Math.min(width,height)*.52);
      glow.addColorStop(0,'rgba(113,211,231,.115)');
      glow.addColorStop(.58,'rgba(132,109,191,.045)');
      glow.addColorStop(1,'rgba(113,211,231,0)');
      context.fillStyle=glow;
      context.fillRect(0,0,width,height);
      drawAxes(width,height);

      const triangles=[];
      for(const part of BRAIN_MESH){
        const rotatedVertices=part.vertices.map(point=>rotate3(point,yaw));
        for(const face of part.faces){
          const a=rotatedVertices[face[0]];
          const b=rotatedVertices[face[1]];
          const c=rotatedVertices[face[2]];
          const normal=faceNormal(a,b,c);
          triangles.push({a,b,c,normal,label:face[3],depth:(a[2]+b[2]+c[2])/3});
        }
      }
      triangles.sort((a,b)=>a.depth-b.depth);
      for(const triangle of triangles){
        const a=project(triangle.a,width,height,scale);
        const b=project(triangle.b,width,height,scale);
        const c=project(triangle.c,width,height,scale);
        const light=clamp(triangle.normal[0]*-.18+triangle.normal[1]*.42+triangle.normal[2]*.82,0,1);
        context.beginPath();
        context.moveTo(a[0],a[1]);
        context.lineTo(b[0],b[1]);
        context.lineTo(c[0],c[1]);
        context.closePath();
        context.fillStyle=tissueColor(triangle.label,light,triangle.depth);
        context.fill();
        context.strokeStyle='rgba(73,31,52,.018)';
        context.lineWidth=.18;
        context.stroke();
      }
      drawCerebellarFolia(width,height,scale);
      drawSulci(width,height,scale);
      drawFissure(width,height,scale);

      if(!reduce.matches&&!snapshotMode)animationFrame=requestAnimationFrame(draw);
      else animationFrame=0;
    }

    const resizeObserver=new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    canvas.addEventListener('pointerdown',event=>{
      event.stopPropagation();
      dragging=true;
      lastPointerX=event.clientX;
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener('pointermove',event=>{
      if(!dragging)return;
      event.stopPropagation();
      targetYaw+=(event.clientX-lastPointerX)*.012;
      lastPointerX=event.clientX;
      if(reduce.matches)requestAnimationFrame(draw);
    });
    const release=event=>{
      event.stopPropagation();
      dragging=false;
      canvas.releasePointerCapture?.(event.pointerId);
    };
    canvas.addEventListener('pointerup',release);
    canvas.addEventListener('pointercancel',release);

    brainSnapshotController={
      names:Object.freeze(Object.keys(BRAIN_SNAPSHOT_POSES)),
      capture(name){
        const pose=BRAIN_SNAPSHOT_POSES[name];
        if(!pose)return null;
        if(!snapshotRestorePose)snapshotRestorePose={yaw,targetYaw,pitch,targetPitch};
        snapshotMode=true;
        cancelAnimationFrame(animationFrame);
        animationFrame=0;
        yaw=targetYaw=pose.yaw;
        pitch=targetPitch=pose.pitch;
        lastTime=performance.now();
        draw(lastTime);
        canvas.dataset.brainSnapshotView=name;
        return {
          name,
          yawDegrees:Number((mod(yaw,TAU)*180/Math.PI).toFixed(1)),
          pitchDegrees:Number((pitch*180/Math.PI).toFixed(1)),
          renderer:canvas.dataset.brainRenderer,
          width:canvas.width,
          height:canvas.height
        };
      },
      restore(){
        if(!snapshotRestorePose)return false;
        ({yaw,targetYaw,pitch,targetPitch}=snapshotRestorePose);
        snapshotRestorePose=null;
        snapshotMode=false;
        delete canvas.dataset.brainSnapshotView;
        lastTime=performance.now();
        draw(lastTime);
        return true;
      }
    };

    animationFrame=requestAnimationFrame(draw);
    root._brainDestroy=()=>{
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }

  function capabilityOrbit(){
    const previous=document.querySelector('[data-compass-capability-switcher]');
    if(!previous||document.querySelector('[data-capability-orbit]'))return;

    const stage=document.createElement('section');
    stage.className='compass-capability-orbit';
    stage.dataset.capabilityOrbit='true';
    stage.dataset.capabilityMode='orbit';
    stage.setAttribute('role','region');
    stage.setAttribute('aria-roledescription','carousel');
    stage.setAttribute('aria-label','Signature Diamond Gate capabilities');
    stage.setAttribute('aria-describedby','compass-capability-guidance');
    stage.tabIndex=0;

    const guidance=document.createElement('p');
    guidance.id='compass-capability-guidance';
    guidance.className='compass-capability-guidance';
    guidance.dataset.capabilityGuidance='true';
    guidance.dataset.guidanceMode='orbit';
    guidance.setAttribute('aria-live','polite');
    guidance.textContent='Swipe to rotate the orbit. Tap the clear card to enter.';

    const status=document.createElement('p');
    status.className='compass-orbit-status';
    status.setAttribute('aria-live','polite');
    status.setAttribute('aria-atomic','true');

    const coherence=document.createElement('article');
    coherence.className='compass-orbit-plaque';
    coherence.dataset.capability='coherence';
    coherence.innerHTML=`<div class="compass-plaque-copy"><p class="compass-estate__kicker">Diagnostic</p><h2 id="compass-capability-coherence-title">Coherence Diagnostic</h2><p>Compare what matters to you with how you are actually living and deciding. See areas of alignment, tension, and repeated mismatch.</p><div class="compass-plaque-actions compass-plaque-actions--single"><a class="compass-orbit-action" href="/coherence-diagnostic/" data-capability-function="coherence">RUN THE DIAGNOSTIC</a></div></div><div class="compass-brain-shell" data-human-brain></div>`;

    const house=document.createElement('article');
    house.className='compass-orbit-plaque';
    house.dataset.capability='house';
    house.innerHTML=`<div class="compass-house-parent" data-house-parent><div class="compass-plaque-copy"><p class="compass-estate__kicker">Ask for directions</p><h2 id="compass-capability-house-title">Talk to the House</h2><p>Ask the House where to begin, which room fits your question, or what part of the estate can help.</p><div class="compass-plaque-actions compass-plaque-actions--single"><button class="compass-orbit-action" type="button" data-enter-house>OPEN HOUSE GUIDES</button></div></div></div><div class="house-orbit" data-house-orbit hidden role="region" aria-roledescription="carousel" aria-label="House guides"></div>`;

    stage.append(coherence,house,guidance,status);
    previous.replaceWith(stage);
    mountBrain(coherence.querySelector('[data-human-brain]'));

    const cards=[coherence,house];
    let activeIndex=0;
    let parentBusy=false;
    let mode='ORBIT';
    let memberIndex=0;
    let memberBusy=false;

    const houseParent=house.querySelector('[data-house-parent]');
    const houseOrbit=house.querySelector('[data-house-orbit]');
    const enterHouseButton=house.querySelector('[data-enter-house]');
    const memberDefinitions=[
      {
        id:'jeeves',
        name:'Talk to Jeeves',
        status:'Whole House',
        body:'Meet the House interface and receive guidance through the estate and Hearth.',
        href:'/showroom/globe/hearth/jeeves/'
      },
      {
        id:'elara',
        name:'Talk to Elara',
        status:'Signal Bearer',
        body:'Enter Elara’s conversation surface and follow the signal toward the next meaningful room.',
        href:'/elara/'
      },
      {
        id:'auren',
        name:'Talk to Auren',
        status:'Product Floor',
        body:'Enter Auren’s product-facing room for practical systems and useful next steps.',
        href:'/products/auren/'
      }
    ];

    const members=memberDefinitions.map(definition=>{
      const member=document.createElement('article');
      member.className='house-orbit-member';
      member.dataset.member=definition.id;
      member.setAttribute('role','group');
      member.setAttribute('aria-labelledby',`compass-house-${definition.id}-title`);
      member.innerHTML=`<span class="house-member-status">${definition.status}</span><h3 id="compass-house-${definition.id}-title">${definition.name}</h3><p>${definition.body}</p><div class="compass-plaque-actions"><a class="compass-orbit-action" href="${definition.href}" data-house-function="${definition.id}">${definition.name}</a><button class="compass-orbit-action compass-orbit-action--secondary" type="button" data-return-house>RETURN TO ORBIT</button></div>`;
      houseOrbit.append(member);
      return member;
    });

    function renderParent(){
      cards.forEach((card,index)=>{
        const front=index===activeIndex;
        card.dataset.slot=front?'front':'rear';
        card.setAttribute('aria-posinset',String(index+1));
        card.setAttribute('aria-setsize',String(cards.length));
        card.setAttribute('aria-current',front?'true':'false');
        card.setAttribute('aria-hidden',front?'false':'true');
        card.tabIndex=front?0:-1;
        setInteractive(card,front);
      });
      const active=cards[activeIndex];
      const title=active.querySelector('h2')?.textContent.trim()||'Capability';
      const action=active.querySelector('[data-capability-function],[data-enter-house]')?.textContent.trim()||'';
      status.textContent=`Capability ${activeIndex+1} of ${cards.length}: ${title}. ${action}`;
    }

    function rotateParent(direction){
      if(parentBusy||mode==='HOUSE_MEMBERS')return;
      const focusedInside=cards[activeIndex].contains(document.activeElement);
      parentBusy=true;
      activeIndex=mod(activeIndex+direction,cards.length);
      stage.dataset.rotate=direction>0?'next':'prev';
      renderParent();
      if(focusedInside)focusWithoutScroll(stage);
      setTimeout(()=>{
        stage.dataset.rotate='';
        parentBusy=false;
      },reduce.matches?110:440);
    }

    function renderMembers(){
      members.forEach((member,index)=>{
        const distance=mod(index-memberIndex,members.length);
        const front=distance===0;
        member.dataset.slot=front?'front':distance===1?'rear-right':'rear-left';
        member.setAttribute('aria-posinset',String(index+1));
        member.setAttribute('aria-setsize',String(members.length));
        member.setAttribute('aria-current',front?'true':'false');
        member.setAttribute('aria-hidden',front?'false':'true');
        member.tabIndex=front?0:-1;
        setInteractive(member,front);
      });
      if(mode==='HOUSE_MEMBERS'){
        const definition=memberDefinitions[memberIndex];
        status.textContent=`House guide ${memberIndex+1} of ${members.length}: ${definition.name}.`;
      }
    }

    function activeMemberAction(){
      return members[memberIndex]?.querySelector('[data-house-function]');
    }

    function rotateMember(direction){
      if(memberBusy||mode!=='HOUSE_MEMBERS')return;
      const focusedInside=houseOrbit.contains(document.activeElement)&&document.activeElement!==houseOrbit;
      memberBusy=true;
      memberIndex=mod(memberIndex+direction,members.length);
      houseOrbit.dataset.rotate=direction>0?'next':'prev';
      renderMembers();
      if(focusedInside)requestAnimationFrame(()=>focusWithoutScroll(activeMemberAction()));
      setTimeout(()=>{
        houseOrbit.dataset.rotate='';
        memberBusy=false;
      },reduce.matches?110:440);
    }

    function enterHouse(){
      if(activeIndex!==1||mode==='HOUSE_MEMBERS')return;
      mode='HOUSE_MEMBERS';
      stage.dataset.capabilityMode='house-members';
      guidance.dataset.guidanceMode='house-members';
      guidance.textContent='Swipe to choose a House guide. Tap the clear card to talk. Return to Orbit restores the capability orbit.';
      house.classList.add('is-house-members');
      houseParent.hidden=true;
      houseParent.setAttribute('aria-hidden','true');
      houseOrbit.hidden=false;
      houseOrbit.removeAttribute('hidden');
      houseOrbit.setAttribute('aria-hidden','false');
      renderMembers();
      requestAnimationFrame(()=>focusWithoutScroll(activeMemberAction()));
    }

    function leaveHouse(){
      if(mode!=='HOUSE_MEMBERS')return;
      mode='ORBIT';
      memberBusy=false;
      houseOrbit.dataset.rotate='';
      stage.dataset.capabilityMode='orbit';
      guidance.dataset.guidanceMode='orbit';
      guidance.textContent='Swipe to rotate the orbit. Tap the clear card to enter.';
      house.classList.remove('is-house-members');
      houseOrbit.hidden=true;
      houseOrbit.setAttribute('hidden','');
      houseOrbit.setAttribute('aria-hidden','true');
      houseParent.hidden=false;
      houseParent.removeAttribute('aria-hidden');
      renderParent();
      requestAnimationFrame(()=>focusWithoutScroll(enterHouseButton));
    }

    cards.forEach(card=>{
      card.setAttribute('role','group');
      card.setAttribute('aria-labelledby',card===house?'compass-capability-house-title':'compass-capability-coherence-title');
      const invoke=()=>{
        if(mode!=='ORBIT'||card.dataset.slot!=='front')return;
        if(card===house)enterHouse();
        else card.querySelector('[data-capability-function]')?.click();
      };
      card.addEventListener('click',event=>{
        if(event.target.closest('a,button,input,select,textarea,[data-human-brain]'))return;
        invoke();
      });
      card.addEventListener('keydown',event=>{
        if(event.target!==card||(event.key!=='Enter'&&event.key!==' '))return;
        event.preventDefault();
        invoke();
      });
    });

    members.forEach(member=>{
      const invoke=()=>{
        if(mode!=='HOUSE_MEMBERS'||member.dataset.slot!=='front')return;
        member.querySelector('[data-house-function]')?.click();
      };
      member.addEventListener('click',event=>{
        if(event.target.closest('a,button,input,select,textarea'))return;
        invoke();
      });
      member.addEventListener('keydown',event=>{
        if(event.target!==member||(event.key!=='Enter'&&event.key!==' '))return;
        event.preventDefault();
        invoke();
      });
    });

    enterHouseButton.addEventListener('click',event=>{
      event.stopPropagation();
      enterHouse();
    });
    houseOrbit.addEventListener('click',event=>{
      const returnButton=event.target.closest('[data-return-house]');
      if(!returnButton)return;
      event.stopPropagation();
      leaveHouse();
    });
    claimSwipe(stage,rotateParent,{disabled:()=>mode==='HOUSE_MEMBERS'});
    claimSwipe(houseOrbit,rotateMember,{disabled:()=>mode!=='HOUSE_MEMBERS'});
    stage.addEventListener('keydown',event=>{
      if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
      event.preventDefault();
      const direction=event.key==='ArrowRight'?1:-1;
      if(mode==='HOUSE_MEMBERS')rotateMember(direction);
      else rotateParent(direction);
    });

    renderParent();
    renderMembers();
  }

  function boot(){
    statementOrbit();
    capabilityOrbit();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  window.CompassEditorialCarousel={
    boot,
    version:'successor-v5',
    brainContract:'COMPASS_ANATOMICAL_BRAIN_XYZ_v1',
    brainSnapshots:Object.freeze({
      names:Object.freeze(Object.keys(BRAIN_SNAPSHOT_POSES)),
      capture:name=>brainSnapshotController?.capture(name)||null,
      restore:()=>brainSnapshotController?.restore()||false
    })
  };
})();
