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

/// this sortof works (you have to call render twice? tho)
var Sparkle = {
  draw: function(x,y,z,multiplier,color) {
    var particleTexture = THREE.ImageUtils.loadTexture( '/images/spark.png' );

    particleGroup = new THREE.Object3D();
    particleAttributes = { startSize: [], startPosition: [], randomness: [] };
    var totalParticles = 100*multiplier;
    var radiusRange = 25*multiplier;
    for( var i = 0; i < totalParticles; i++ ) {
      var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, useScreenCoordinates: false, color: 0x000000 } );

      var sprite = new THREE.Sprite( spriteMaterial );
      sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
      sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
      // for a cube:
      // sprite.position.multiplyScalar( radiusRange );
      // for a solid sphere:
      // sprite.position.setLength( radiusRange * Math.random() );
      // for a spherical shell:
      sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );

      // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() );
      sprite.material.color.setHSL( color, color, Math.random() );

      // sprite.opacity = 0.80; // translucent particles
      sprite.material.blending = THREE.NormalBlending; // "glowing" particles

      particleGroup.add( sprite );
      // add variable qualities to arrays, if they need to be accessed later
      particleAttributes.startPosition.push( sprite.position.clone() );
      particleAttributes.randomness.push( Math.random() );
    }
    particleGroup.position.x = x;
    particleGroup.position.y = y;
    particleGroup.position.z = z;
    scene.add( particleGroup );
    this.update();
  },

  update: function() {
    var time = 4 * 1900;//clock.getElapsedTime();
    for ( var c = 0; c < particleGroup.children.length; c ++ )
    {
      var sprite = particleGroup.children[ c ];

  		// pulse away/towards center
  		// individual rates of movement
      var a = particleAttributes.randomness[c] + 1;
      var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
      sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor;
      sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor;
      sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor;
    }

    particleGroup.rotation.y = time * 0.75;
  }
};

