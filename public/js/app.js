/*global window, $, THREE, Pitch, requestAnimationFrame, dat */

$(function() {

  var pitch = new Pitch();

  // var gui = new dat.GUI({
  //     height : 5 * 32 - 1   // nline * 32 - 1
  // });

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
  var renderer = new THREE.WebGLRenderer();
  var camera = new THREE.PerspectiveCamera(
                      VIEW_ANGLE,
                      ASPECT,
                      NEAR,
                      FAR
                   );

  var scene = new THREE.Scene();


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




  function animate() {
    requestAnimationFrame(animate);

    // Add all elements to the scene
    pitch.add(scene);

    // Add the light to the scene
    scene.add(pointLight);

    renderer.render(scene, camera);
  }
  animate();

});
