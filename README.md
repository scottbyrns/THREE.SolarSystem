THREE.js-Solar-System
=====================

A library for generating solar systems with THREE.js


### Dependencies

#### THREE.GEO
https://github.com/scottbyrns/THREE.GEO-Geospatial-Mapping


### Ussage

```javascript

var solarSystemData = {
    "sun": {
        "radius": 6.955,
        "representation": {
            "texture": "textures/sun.gif"
        }
    },
    "planets": [{
        "name": "Mercury",
        "representation": {
            "texture": "textures/Planets/mercurymap.jpg",
            "bumpMap": "textures/Planets/mercurybump.jpg",
            "textureOffset": -180.806168
        },
        "distance": 579.1,
        "radius": 0.0244,
        "rotationPeriod": {
            "years": 0,
            "days": 58,
            "hours": 15,
            "minutes": 30
        },
        "orbitalPeriod": {
            "years": 0,
            "days": 88,
            "hours": 0,
            "minutes": 0
        },
        "mass": 3.285e+23,
        "coordinates": {
            "phi": 212.7696388888889,
            "lambda": 1.9079166666666665,
            "radius": 648.928187987607
        }
    }
};

	ourSolarSystem = new THREE.SolarSystem(solarSystemData, scene);
		
	function render() {

		ourSolarSystem.update();
		
		camera.lookAt( ourSolarSystem.star.position );
		renderer.render( scene, camera );

	}

```
