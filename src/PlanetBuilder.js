
THREE.SolarSystem.PlanetBuilder = {
	build: function (config) {
		
		config.resolution = config.resolution || 100;
		

		var maskGeometry = new THREE.SphereGeometry(config.radius, config.resolution, config.resolution);
		var maskMaterial = new THREE.MeshPhongMaterial({  depthTest: true });		

		maskMaterial.depthTest = true;
		maskMaterial.map = config.mapImage;

		if (config.bumpMap) {
			
			maskMaterial.bumpMap = config.bumpMap;

			maskMaterial.bumpScale = 1.5
			
		}
		else {
			
			maskMaterial.bumpMap = config.mapImage;

			maskMaterial.bumpScale = 1.5
		}
		
		maskMaterial.transparent = false;

		var planet = new THREE.GEO.SpatialMap(maskGeometry, maskMaterial);

		planet.setRadius(config.radius);
		

		if (config.atmosphereMaterial) {

			var mesh = new THREE.Mesh( maskGeometry.clone(), config.atmosphereMaterial );
			mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.0;

			planet.add(mesh);
		
			var mesh = new THREE.Mesh( maskGeometry.clone(), new THREE.MeshPhongMaterial( { color: 0x330000, opacity:0.01, transparent:true} ) );
			mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.0;
			mesh.receiveShadow = true;

			planet.add(mesh);
				
		}
		
		if (config.mapOffset) {
			planet.setTexturesEdgeLongitude(config.mapOffset);
		}


		return planet;
	},
	
	buildMoon: function (config) {
		
	}
};

