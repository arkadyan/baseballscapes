/*global window, $, THREE, data, Pitch, requestAnimationFrame, dat */

var scene, renderer, camera;

$(function() {

  var pitches = [];
  for (var i=0; i < data.length; i++) {
    var inning = data[i];
    for (var j=0; j < inning.at_bats.length; j++) {
      var atBat = inning.at_bats[j];
      for (var k=0; k < atBat.pitches.length; k++) {
        var pitch = atBat.pitches[k];
        pitches.push(
          new Pitch(pitches.length*5-200, 0, 0, 5, pitch.attributes)
        );
      }
    }
  }

  // GUI controls
  // var gui = new dat.GUI();
  // gui.add(pitch, 'size', 5, 100);


  // Set the scene size
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  // Set some camera attributes
  var VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000;

  // Get the DOM element to attach to using jQuery
  var $container = $('#container');

  // Create a WebGL renderer, camera and a scene
  renderer = new THREE.WebGLRenderer();
  camera = new THREE.PerspectiveCamera(
                      VIEW_ANGLE,
                      ASPECT,
                      NEAR,
                      FAR
                   );

  scene = new THREE.Scene();


  // Add a camera to the scene
  scene.add(camera);

  // The camera starts at 0,0,0 so pull it back
  camera.position.z = 300;

  // Start the renderer
  renderer.setSize(WIDTH, HEIGHT);

  // Attach the render-supplied DOM element
  $container.append(renderer.domElement);


  // Create a point light
  var pointLight = new THREE.PointLight(0xFFFFFF);

  // Set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  for (var i=0; i < pitches.length; i++) {
    pitches[i].add(scene);
  }
  InningSphere.draw();

  // Add the light to the scene
  scene.add(pointLight);

  renderer.render(scene, camera);
});


// util
function rand(max) {
  return Math.random()*max;
}

