/*global $, THREE, requestAnimationFrame */

$(function() {

  // Set the scene size
  var WIDTH = 400,
      HEIGHT = 300;

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


  // Create the sphere's material
  // var sphereMaterial = new THREE.MeshLambertMaterial({
  var sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xCC0000
  });

  // Set up the sphere vars
  var radius = 50,
      segments = 16,
      rings = 16;

  // Create a new mesh with sphere geometry
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius,
      segments,
      rings
    ),
    sphereMaterial
  );

  // Add the sphere to the scene
  scene.add(sphere);


  // Create a point light
  var pointLight = new THREE.PointLight(0xFFFFFF);

  // Set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // Add the light to the scene
  scene.add(pointLight);


  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

});
