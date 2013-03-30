/*global THREE */


var InningSphere = {
  draw: function() {
    var sphereGeom =  new THREE.SphereGeometry( 250, 32, 16 );
    var biggerSphereGeom =  new THREE.SphereGeometry( 250, 32, 16 );

    var i_width = WIDTH*4;
    var i_height = HEIGHT*4;
    for (var i=0; i < 30; i++) {
      $.each([awayTeam.color, homeTeam.color],function(i, color) {
        var darkMaterial = new THREE.MeshPhongMaterial( { color: color, ambient: 0xff0000, transparent: true, blending: THREE.AdditiveBlending } );
        var sphere = new THREE.Mesh( sphereGeom.clone(), darkMaterial );
        sphere.position.set(rand(i_width)-(i_width/2), rand(i_height)-(i_height/2), -500-rand(2000));
        scene.add( sphere );


        var darkMaterial = new THREE.MeshPhongMaterial( { color: color, ambient: 0xff0000, transparent: true, blending: THREE.AdditiveBlending } );
        var sphere = new THREE.Mesh( biggerSphereGeom.clone(), darkMaterial );
        sphere.position.set(rand(i_width)-(i_width/2), rand(i_height)-(i_height/2), -2500-rand(100));
        scene.add( sphere );

      });
    };
  }
}


