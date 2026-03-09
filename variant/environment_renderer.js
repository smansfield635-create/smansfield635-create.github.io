function polygon(ctx, points) {
  if (!points || !points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
}

function centroid(points){
  let x=0,y=0;
  for(const [px,py] of points){
    x+=px; y+=py;
  }
  return [x/points.length,y/points.length];
}

function expandPolygon(points,scale){
  const [cx,cy]=centroid(points);
  return points.map(([x,y])=>[
    cx+(x-cx)*scale,
    cy+(y-cy)*scale
  ]);
}

function drawBand(ctx,poly,color){
  polygon(ctx,poly);
  ctx.fillStyle=color;
  ctx.fill();
}

export function createEnvironmentRenderer(){

  function draw(ctx,runtime){

    const {viewportOffset,kernel}=runtime;

    ctx.save();
    ctx.translate(viewportOffset.x,viewportOffset.y);

    const waters = kernel?.watersById
      ? [...kernel.watersById.values()]
      : [];

    for(const row of waters){

      const poly=row?.polygon;
      if(!poly||poly.length<3) continue;

      const deep = poly;
      const shallow = expandPolygon(poly,1.08);
      const wet = expandPolygon(poly,1.16);
      const dry = expandPolygon(poly,1.22);

      /* deep ocean */
      drawBand(
        ctx,
        deep,
        "rgba(22,92,140,0.95)"
      );

      /* shallow turquoise shelf */
      drawBand(
        ctx,
        shallow,
        "rgba(40,170,190,0.65)"
      );

      /* wet sand */
      drawBand(
        ctx,
        wet,
        "rgba(230,210,160,0.55)"
      );

      /* dry sand beach */
      drawBand(
        ctx,
        dry,
        "rgba(245,225,170,0.65)"
      );

      /* soft shoreline glow */
      polygon(ctx,shallow);
      ctx.strokeStyle="rgba(255,255,255,0.25)";
      ctx.lineWidth=2;
      ctx.stroke();
    }

    ctx.restore();
  }

  return Object.freeze({draw});
}
