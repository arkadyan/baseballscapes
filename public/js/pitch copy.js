/*global THREE */

var Pitch = function(_size) {
  this.size = _size;

  this.geometry = new THREE.CubeGeometry(this.size, this.size, this.size);
  this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

  this.mesh = new THREE.Mesh(this.geometry, this.material);
};

Pitch.prototype._draw = function() {
  this.geometry.width = this.size;
  this.geometry.height = this.size;
  this.geometry.depth = this.size;

  this.mesh.rotation.x += 0.01;
  this.mesh.rotation.y += 0.02;
};

Pitch.prototype.add = function(scene) {
  this._draw();
  scene.add(this.mesh);
};