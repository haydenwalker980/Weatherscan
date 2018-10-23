let image = {width: 1440, height: 1080};

document.addEventListener('DOMContentLoaded', updateScale);
window.addEventListener('resize', updateScale);

function updateScale() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  // Get largest dimension increase
  let xScale = windowWidth / image.width;
  let yScale = windowHeight / image.height;
  let scale;

  if (xScale < yScale) {
    // The image fits perfectly in x axis, stretched in y
    scale = xScale;
  } else {
    // The image fits perfectly in y axis, stretched in x
    scale = yScale;
  }

  document.getElementById("main").style.transform = `scale(${scale})`;
}