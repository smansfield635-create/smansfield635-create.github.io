function drawShorelineSediment(ctx) {

  const SEDIMENT_WEST = [
    [520,1080],[500,1000],[498,920],[508,840],[530,760],
    [560,690],[596,620],[636,560],[670,500],[692,430],
    [702,360],[690,290],[662,220],[620,170]
  ];

  const SEDIMENT_EAST = [
    [548,1080],[580,1000],[620,920],[670,850],[730,780],
    [790,710],[850,640],[912,560],[972,480],[1030,420],
    [1086,370]
  ];

  function sedimentBand(points){

    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);

    for(let i=1;i<points.length;i++){
      ctx.lineTo(points[i][0],points[i][1]);
    }

    for(let i=points.length-1;i>=0;i--){
      ctx.lineTo(points[i][0]-18,points[i][1]);
    }

    ctx.closePath();

    const g = ctx.createLinearGradient(0,0,0,1200);
    g.addColorStop(0,"rgba(156,132,96,0.35)");
    g.addColorStop(1,"rgba(120,104,78,0.25)");

    ctx.fillStyle = g;
    ctx.fill();
  }

  sedimentBand(SEDIMENT_WEST);
  sedimentBand(SEDIMENT_EAST);

}
