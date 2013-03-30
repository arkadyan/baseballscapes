/*global window, $, THREE, data, Pitch, requestAnimationFrame, dat */

var scene, renderer, camera, WIDTH, HEIGHT;

$(function() {
  var i, j, k;

  var pitches = [],
      matchups = [];

  for (i=0; i < data.length; i++) {
    var inning = data[i],
        startingX = random(-150, -50),
        startingY = i * 10 + -50,
        inningPitchCount = 0;
    for (j=0; j < inning.at_bats.length; j++) {
      var atBat = inning.at_bats[j];

      matchups.push({
        pitcher: atBat.attributes.p_throws,
        batter: atBat.attributes.stand
      });

      for (k=0; k < atBat.pitches.length; k++) {
        var pitch = atBat.pitches[k],
            pitchSize = 5,
            gap = 1;
        inningPitchCount++;
        pitches.push(
          new Pitch(inningPitchCount*(pitchSize + gap)+startingX, startingY, 0, pitchSize, pitch.attributes)
        );
      }
    }
  }


  // GUI controls
  // var gui = new dat.GUI();
  // gui.add(pitch, 'size', 5, 100);


  // Set the scene size
  WIDTH = window.innerWidth;
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

  for (i=0; i < pitches.length; i++) {
    pitches[i].add(scene);
  }
  InningSphere.draw();
  Batting.drawAll();

  // Add the light to the scene
  scene.add(pointLight);

  $("body").css('background-color', homeTeam.color);

  // very sorry
  setTimeout(function(){renderer.render(scene, camera);}, 200);
});


// util
function rand(max) {
  return Math.random()*max;
}

function random(a, b) {
  var min = Math.min(a, b),
      max = Math.max(a, b);
  return Math.random() * (max - min) + min;
}
