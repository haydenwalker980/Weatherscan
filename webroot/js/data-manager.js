function DataManager(pointSearch){
	var $this = $(this),
		that = this,
		excludeRadiusMiles=10;
		includeRadiusMiles=30;

	var _locations = [];

	this.locations = _locations;

	this.location = function(woeid) {
		return _locations.find(x => x.woeid === woeid);
	}

	this.init = function (searchString) {
		_locations[0] = new Location();

		$(_locations[0])

			.on('refresh', function(){ $this.trigger('refresh') })
			.on('ready',   function(){
				$this.trigger('ready:main');
			})
			.on('init', initLocations);
		_locations[0].first = true;
		_locations[0].init(searchString);

	};

	// kicks off after main location is returned.
	// create the list of neighboring cities
	function initLocations(){

		// find reporting stations
		var observationData = _locations[0].observations(0),
			lat = observationData.latitude,
			lon = observationData.longitude,
			locList = [];

		// begin the forcast pull
		_locations[0].initForecasts();

		// get a list of observation stations info //https://api.weather.com/v3/location/near?geocode=33.74,-84.39&product=observation&format=json&apiKey=yourApiKey
		$.getJSON('https://api.weather.com/v3/location/near?geocode=' + lat + ',' + lon + '&product=observation&format=json&apiKey=' + api_key, function(data) {

			var feature, geo, station, dist;
			for (var i=0; i < data.location.stationName.length || i <= 3; i++) {
				feature = data.location;
				latgeo = feature.latitude[i];
				longeo = feature.longitude[i];
				dist = feature.distanceMi[i];

				if (dist < includeRadiusMiles && dist > excludeRadiusMiles) {
					locList.push({lat: latgeo, long:longeo, distance:dist, stationUrl:feature.stationId[i]});
				}
			}
			if (locList.length===0) {
				$this.trigger('allinit');
				return
			}

			// sort list by distance
			locList.sort(function(a, b) {
				return parseInt(a.distance) - parseInt(b.distance);
			});

			// set the station for location 0
			_locations[0].stationUrl = locList[0].stationUrl

			// create location objects, get inital pull
			for(var loc of locList) {
				loc.location = new Location();
				$(loc.location).on('init',onLocationInit);
				loc.location.init(loc.lat+','+loc.long, loc.location.stationName);
				loc.location.stationUrl = loc.stationUrl;
			}

		});

		var initCount=0;
		function onLocationInit() {
			initCount++;
			if (initCount===locList.length) {
				allLocationsInit();
			}
		}




		function allLocationsInit() {

			var location, cities=[], city;

			// add locations removing any duplicate cities by name
			for(var loc of locList) {

				if (_locations.filter(e => e.city == loc.location.city).length === 0) {
				    _locations.push(loc.location);
					//loc.location.initForecasts();
				}

			}

			$this.trigger('allinit');

		}

	}

}
