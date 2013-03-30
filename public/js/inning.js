/*global THREE */


var InningSphere = {
  draw: function() {
    var sphereGeom =  new THREE.SphereGeometry( 200, 32, 16 );

    for (var i=0; i < 9; i++) {
      var darkMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff, ambient: 0xff0000, transparent: true, blending: THREE.AdditiveBlending } );
      var sphere = new THREE.Mesh( sphereGeom.clone(), darkMaterial );
      sphere.position.set(300-rand(600), 300-rand(600), -200-rand(600));
      scene.add( sphere );
    };
  }
}


