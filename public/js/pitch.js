/*global THREE, scale */

var Pitch = function(_x, _y, _z, _size, _data) {
  this.x = _x;
  this.y = _y;
  this.z = _z;
  this.size = _size;
  this.data = _data;

  var redComponent = scale(70, 100, 0, 1, this.data.end_speed);

  this.geometry = new THREE.CubeGeometry(this.size, this.size, this.size);
  this.material = new THREE.MeshBasicMaterial();
  this.material.color.setRGB(redComponent, 0, 0);

  this.mesh = new THREE.Mesh(this.geometry, this.material);
};

Pitch.prototype._draw = function() {
  this.geometry.width = this.size;
  this.geometry.height = this.size;
  this.geometry.depth = this.size;

  this.mesh.position.x = this.x;
  this.mesh.position.y = this.y;
  this.mesh.position.z = this.z;

  // this.mesh.rotation.x += 0.01;
  // this.mesh.rotation.y += 0.02;
};

Pitch.prototype.add = function(scene) {
  this._draw();
  scene.add(this.mesh);
};
