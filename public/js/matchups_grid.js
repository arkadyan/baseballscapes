/*global THREE */

var MatchupsGrid = function(_data) {
  this.data = _data;
  this.lines = [];
};

MatchupsGrid.prototype._draw = function() {
  var i, j,
      xOffset, yOffset, matchup,
      pitcherGeometry, batterGeometry;

  var numIterations = 75,
      boxSize = 10;

  var material = new THREE.LineBasicMaterial({
    color: 0x999999
  });

  var dataItr = 0;
  for (i=0; i < numIterations; i++) {
    for (j=0; j < numIterations; j++) {
      xOffset = (i - 0.5 * numIterations) * boxSize;
      yOffset = (j - 0.5 * numIterations) * boxSize;
      matchup = this.data[dataItr];

      pitcherGeometry = new THREE.Geometry();
      batterGeometry = new THREE.Geometry();

      if (matchup.pitcher === 'L') {
        pitcherGeometry.vertices.push(new THREE.Vector3(xOffset + 0, yOffset + 0, 0));
        pitcherGeometry.vertices.push(new THREE.Vector3(xOffset + 0.7 * boxSize, yOffset + boxSize, 0));
      } else {
        pitcherGeometry.vertices.push(new THREE.Vector3(xOffset + 0.7 * boxSize, yOffset + 0, 0));
        pitcherGeometry.vertices.push(new THREE.Vector3(xOffset + 0, yOffset + boxSize, 0));
      }
      if (matchup.batter === 'L') {
        batterGeometry.vertices.push(new THREE.Vector3(xOffset + 0.3 * boxSize, yOffset + 0, 0));
        batterGeometry.vertices.push(new THREE.Vector3(xOffset + boxSize, yOffset + boxSize, 0));
      } else {
        batterGeometry.vertices.push(new THREE.Vector3(xOffset + boxSize, yOffset + 0, 0));
        batterGeometry.vertices.push(new THREE.Vector3(xOffset + 0.3 * boxSize, yOffset + boxSize, 0));
      }

      this.lines.push(
        new THREE.Line(pitcherGeometry, material)
      );
      this.lines.push(
        new THREE.Line(batterGeometry, material)
      );

      dataItr++;
      if (dataItr === this.data.length) {
        dataItr = 0;
      }
    }
  }
};

MatchupsGrid.prototype.add = function(scene) {
  this._draw();

  for (var i=0; i < this.lines.length; i++) {
    scene.add(this.lines[i]);
  }
};
