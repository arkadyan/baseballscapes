/*global THREE */


var InningSphere = {
  draw: function() {
    var sphereGeom =  new THREE.SphereGeometry( 250, 32, 16 );
    var biggerSphereGeom =  new THREE.SphereGeometry( 250, 32, 16 );

    var i_width = WIDTH*4;
    var i_height = HEIGHT*4;

    var totalRuns = parseFloat(boxScore.batting[0].r)+parseFloat(boxScore.batting[1].r);
    var homeTeamData = {
      color: homeTeam.color,
      spheres: 60.0/(totalRuns) * parseFloat(boxScore.batting[0].r)
      // divisor: totalRuns/parseFloat(boxScore.batting[0].r)+
    };
    var awayTeamData = {
      color: homeTeam.color,
      spheres: 60.0/(totalRuns) * parseFloat(boxScore.batting[0].r)
    };
    console.log("eee" + " : " + homeTeamData.spheres + " : " + awayTeamData.spheres);

    $.each([homeTeamData, awayTeamData], function(i, data) {
      for (var i=0; i < data.spheres; i++) {
        $.each([awayTeam.color, homeTeam.color],function(i, color) {
          var darkMaterial = new THREE.MeshPhongMaterial( { color: color, ambient: 0xff0000, transparent: true, blending: THREE.NormalBlending } );
          var sphere = new THREE.Mesh( biggerSphereGeom.clone(), darkMaterial );
          sphere.position.set(rand(i_width)-(i_width/2), rand(i_height)-(i_height/2), -2500-rand(100));
          scene.add( sphere );

          var darkMaterial = new THREE.MeshPhongMaterial( { color: color, ambient: 0xff0000, transparent: true, blending: THREE.AdditiveBlending } );
          var sphere = new THREE.Mesh( sphereGeom.clone(), darkMaterial );
          sphere.position.set(rand(i_width)-(i_width/2), rand(i_height)-(i_height/2), -500-rand(2000));
          scene.add( sphere );
        });
      }
    });

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

//
// ab: "31"
// avg: ".262"
// batter: Array[16]
// bb: "5"
// d: "2"
// da: "14"
// h: "8"
// hr: "2"
// lob: "15"
// note: "↵         <pinch_hitters>a-Intentionally walked for Jones, An in the 8th. b-Grounded into a forceout for Nix, J in the 8th. </pinch_hitters>↵         <pinch_runners>1-Ran for Swisher in the 8th. </pinch_runners>"
// po: "27"
// r: "6"
// rbi: "6"
// so: "7"
// t: "1"


// Using wireframe materials to illustrate shape details.
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );

var Batting = {
  drawAll: function() {
    $.each(boxScore.batting, function(i, team) {
      $.each(['hr', 'bb', 'h', 'r', 'rbi', 'so'], function(i, thing) {
        Batting[thing](team[thing], team['team_flag']);
      });
    });
  },
  hr: function(count, team){
    var m = (team == 'home') ? -1 : 1;


    for (var i=0; i < count; i++) {
      var w = (WIDTH/count);
      if( Math.abs(w) > WIDTH/2) {w = WIDTH/2 - 100}
      console.log('draw a hr' + " : " + w);
      Sparkle.draw(m*w,0,-300, count*(count), 0.5 + (0.5*m));
    }
  },

  bb: function(count, team){
    console.log("bb count" + " : " + count + " : " + team);

  },
  h: function(count, team){

  },
  r: function(count, team){
    var dir = (team == 'home' ? 1 : -1);
    var darkMaterial, wireframeMaterial;
    if(team == 'home') {
      darkMaterial = new THREE.MeshBasicMaterial( { color: 0xCCCCCC } );
      wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x333333, wireframe: true, transparent: true } );
    } else {
      darkMaterial = new THREE.MeshBasicMaterial( { color: 0x333333 } );
      wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0xCCCCCC, wireframe: true, transparent: true } );
    }

    console.log("r count" + " : " + count + " : " + team);
    for (var i=0; i < count; i++) {
      console.log('draw a r');
      var shape = THREE.SceneUtils.createMultiMaterialObject(
      	// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
          new THREE.CylinderGeometry( 0, 20*(i+1), 30, 20, count*count ),
          [darkMaterial, wireframeMaterial] );
          // var x = 10;
          shape.position.set(rand(WIDTH*0.7)-WIDTH/2, (HEIGHT/rand(10)), -50);
          shape.rotation.x += 1.57;
          scene.add( shape );
    };
  },
  rbi: function(count, team){

  },
  so: function(count, team){
    console.log("so count" + " : " + count + " : " + team);

  }
};


