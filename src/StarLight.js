
THREE.SolarSystem.StarLight = function (star) {
	
	this.star = star;
	
	this.textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare0.png" );
	this.textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare2.png" );
	this.textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare3.png" );

	

	this.addLight( 0.55, 0.9, 0.5, 5000, 0, -1000 );
	this.addLight( 0.08, 0.8, 0.5,    0, 0, -1000 );
	this.addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );
	
};

THREE.SolarSystem.StarLight.prototype = {

	lensFlareUpdateCallback: function ( object ) {

		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;


		for( f = 0; f < fl; f++ ) {

			   flare = object.lensFlares[ f ];

			   flare.x = object.positionScreen.x + vecX * flare.distance;
			   flare.y = object.positionScreen.y + vecY * flare.distance;

			   flare.rotation = 0;

		}

		object.lensFlares[ 2 ].y += 0.025;
		object.lensFlares[ 3 ].rotation = object.positionScreen.x / 0.5 + THREE.Math.degToRad( 45 );

	},
	
	addLight: function ( h, s, l, x, y, z ) {

		var light = new THREE.PointLight( 0xffffff, 0.5, 4500 );
		light.color.setHSL( h, s, l );
		light.position.set( 0,0,0 );
		this.star.add( light );

		var flareColor = new THREE.Color( 0xffffff );
		flareColor.setHSL( h, s, l );

		var lensFlare = new THREE.LensFlare( this.textureFlare0, 100, 0.0, THREE.AdditiveBlending, flareColor );

		lensFlare.add( this.textureFlare2, 256, 0.0, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare2, 128, 0.0, THREE.AdditiveBlending );
		lensFlare.add( this.textureFlare2, 512, 0.0, THREE.AdditiveBlending );

		// lensFlare.add( this.textureFlare3, 60, 0.6, THREE.AdditiveBlending );
		// lensFlare.add( this.textureFlare3, 70, 0.7, THREE.AdditiveBlending );
		// lensFlare.add( this.textureFlare3, 120, 0.9, THREE.AdditiveBlending );
		// lensFlare.add( this.textureFlare3, 70, 1.0, THREE.AdditiveBlending );

		lensFlare.customUpdateCallback = this.lensFlareUpdateCallback.bind(this);
		lensFlare.position = this.star.position;

		this.star.add( lensFlare );

	}
	
};