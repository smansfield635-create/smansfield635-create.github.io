export function createProjector() {
  function projectPoint(point, camera, view) {
    const translatedX = point.x - camera.centerX;
    const translatedY = point.y - camera.centerY;

    const cos = Math.cos(camera.yaw);
    const sin = Math.sin(camera.yaw);

    const rotX = translatedX * cos - translatedY * sin;
    const rotY = translatedX * sin + translatedY * cos;

    const isoX = (rotX - rotY) * camera.scale;
    const isoY = (rotX + rotY) * camera.scale * camera.pitch;

    return {
      x: view.centerX + isoX,
      y: view.centerY + isoY
    };
  }

  function projectPolyline(points, camera, view) {
    return points.map((point) => projectPoint(point, camera, view));
  }

  function projectWorld({ world, camera, width, height, centerX, centerY }) {
    const view = { width, height, centerX, centerY };

    return {
      waters: world.waters.map((water) => ({
        ...water,
        projected: projectPolyline(water.polygon, camera, view)
      })),
      regions: world.regions.map((region) => ({
        ...region,
        projected: projectPolyline(region.polygon, camera, view)
      })),
      gridLines: world.gridLines.map((line) => ({
        a: projectPoint(line.a, camera, view),
        b: projectPoint(line.b, camera, view)
      })),
      paths: world.paths.map((path) => ({
        ...path,
        projected: projectPolyline(path.points, camera, view)
      })),
      markers: world.markers.map((marker) => ({
        ...marker,
        projected: projectPoint(marker, camera, view)
      })),
      stars: world.stars.map((star) => ({
        ...star,
        projected: projectPoint(star, camera, view)
      }))
    };
  }

  return { projectWorld };
}
