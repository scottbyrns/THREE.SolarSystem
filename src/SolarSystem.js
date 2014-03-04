THREE.SolarSystem = function (data, scene) {

	this.data = data;
	
	this.star = this.buildStar();
	
	// this.starLight = new THREE.SolarSystem.StarLight(this.star);
	
	
	this.drawPlanetOrbits();

		
	this.planets = this.buildPlanets();
	
	this.scene = scene;
	this.scene.add(this.star);

};

THREE.SolarSystem.prototype = {
	
	getActivePlanet: function () {
		var renderedPlanets = this.planets;
		for (var planet in renderedPlanets) {
			if (renderedPlanets.hasOwnProperty(planet)) {
				if (renderedPlanets[planet].isActive) {
					return renderedPlanets[planet];
				}
			}
		}
	},
	
	setActivePlanet: function (planetName) {

		for (var planet in this.planets) {
			this.planets[planet].isActive = false;
		}

		this.planets[planetName].isActive = "true";
		

		
		var cameraPosition = {
			x: this.planets[planetName].mesh.position.x + (this.planets[planetName].mesh.radius * 4),
			y: this.planets[planetName].mesh.position.y,
			z: this.planets[planetName].mesh.position.z + (this.planets[planetName].mesh.radius * 4)
		}
		
		return cameraPosition;

	},
	
	// Update the position of the planets and the rotation of the star.
	update: function () {
	
	
		// this.sunShader.uniforms[ 'time' ].value = .00025 * ( new Date() );
						
		var planetIsActive = false;
		var renderedPlanets = this.planets;
		for (var planet in renderedPlanets) {
			if (renderedPlanets.hasOwnProperty(planet)) {
				if (renderedPlanets[planet].isActive) {
				
					planetIsActive = true;
					renderedPlanets[planet].update();
				}
			}
		}
				
				
		for (var planet in renderedPlanets) {
		
			if (renderedPlanets.hasOwnProperty(planet)) {
			
				if (!planetIsActive) {
				
					renderedPlanets[planet].updatePosition();

				}
			}
		
		}
	
		// this.star.rotation.y += 0.001;
	
	},
	// Build the main star.
	buildStar: function () {
		
		var texture = THREE.ImageUtils.loadTexture(this.data.sun.representation.texture);
		// var shaderMaterial = new THREE.ShaderMaterial( {
		//  
		//     uniforms: { 
		//         surface: { // texture in slot 0, loaded with ImageUtils
		//             type: "t", 
		//             // value: 0, 
		//             value: texture
		//         },
		//         time: { // float initialized to 0
		//             type: "f", 
		//             value: 0.0 
		//         }
		//     },
		//     vertexShader: document.getElementById( 'sunSurfaceVertexShader' ).textContent,
		//     fragmentShader: document.getElementById( 'sunSurfaceFragmentShader' ).textContent
		//      
		// } );
		// 
		// this.sunShader = shaderMaterial;
		// 
		
		var sun = THREE.SolarSystem.PlanetBuilder.build({
			radius: this.data.sun.radius * 10,
			resolution: 128,
			mapImage: texture,
		});
		
		// sun.material = shaderMaterial;
		return sun;
			
	},
	// Build the varied planets of the solar system.
	buildPlanets: function () {
		
		// Local planet cache to return from this method.
		var planets = {};
		
		for (var i = 0, len = this.data.planets.length; i < len; i += 1) {
		
			var planetData = this.data.planets[i];
			var texture;
			if (planetData.representation.texture.indexOf(".dds") > -1) {
				texture = THREE.ImageUtils.loadCompressedTexture(planetData.representation.texture, undefined, function () {})
			}
			else {
				texture = THREE.ImageUtils.loadTexture(planetData.representation.texture, undefined, function () {})
			}

			var buildConfiguration = {
				radius: planetData.radius * 300,
				resolution: 128,
				mapImage: texture,
			};
			
			
			
		
			if (planetData.representation.bumpMap) {
				buildConfiguration.bumpMap = THREE.ImageUtils.loadTexture(planetData.representation.bumpMap, undefined, function () {});
			}
			else {
				buildConfiguration.bumpMap = buildConfiguration.mapImage;
			}
		
			if (planetData.representation.textureOffset) {
				buildConfiguration.mapOffset = planetData.representation.textureOffset;
			}
			
			if (planetData.representation.depth) {
				
				var img = document.createElement(img);
				img.src = planetData.representation.depth.low;
				img.onload = function () {
					
					
					
				}.bind(this);
				
			}
			
		
			var planet = THREE.SolarSystem.PlanetBuilder.build(buildConfiguration);
		
			// planet.position.set(planetData.distance, 0, 0);
		
			planet.coordinates = {
				phi: planetData.coordinates.phi,
				lambda: planetData.coordinates.lambda,
				radius: planetData.coordinates.radius
			};
		
			this.star.addGeoSymbol(planet);

			
			planets[planetData.name] = new THREE.SolarSystem.Planet({
				mesh: planet,
				data: planetData,
				isActive: false
			});
		
			planetData.orbitLine.lookAt(planet.position);
			
			
		}
		
		return planets;
		
	},

	// Draw the planets orbits
	//
	// TODO account for ecliptic plane orientation
	drawPlanetOrbits: function (star) {
		for (var i = 0, len = this.data.planets.length; i < len; i += 1) {
			// if (i == len-1) {
			// 
			// 		
			// }
			(function (planet) {
		
				var resolution = 1000;
				var amplitude = planet.coordinates.radius;
				var size = 360 / resolution;

				var geometry = new THREE.Geometry();
				var material = new THREE.LineBasicMaterial( { color: 0x0099FF, opacity: 0.2, depthTest: true, blending:THREE.AdditiveBlending, transparent:true} );
				for(var i = 0; i <= resolution; i++) {
				    var segment = ( i * size ) * Math.PI / 180;
				    geometry.vertices.push( new THREE.Vector3( Math.cos( segment ) * amplitude, 0, Math.sin( segment ) * amplitude ) );         
				}

				var line = new THREE.Line( geometry, material );
				// if (planet.name == "Earth" || planet.name == "Venus" || planet.name == "Mercury" || planet.name == "Mars") {
				// 	return;
				// }
				this.scene.add(line);
				planet.orbitLine = line;
		
			}(this.data.planets[i]))
		}		
	}
	
}


