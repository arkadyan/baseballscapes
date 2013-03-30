/*global THREE */

var Pitch = function() {
  var geometry = new THREE.CubeGeometry(200, 200, 200),
      material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

  this.mesh = new THREE.Mesh(geometry, material);
};

Pitch.prototype.add = function(scene) {
  scene.add(this.mesh);
};