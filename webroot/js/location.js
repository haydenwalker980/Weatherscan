function Location() { // onReady, onRefresh, onAllComplete

	var that = this,
		$this = $(this),
		_forecastmgr,
		_observations=[];

	this.temperature = function() {
		if (_observations[1]!=null && _observations[1].temperature.value) {
			return C2F(_observations[1].temperature.value);
		} else {
			return Math.round( _observations[0].temperature );
		}
	}

	this.observations = function(i) {
		return _observations[i];
	};

	this.forecasts=function(type){return _forecastmgr.forecast(type)};

	this.init = function(searchString){
		checkRefresh(searchString);
	};

	this.initForecasts = function() {
		// start the forecast data pull
		if (_observations[0] != undefined){
		_forecastmgr = new ForecastManager(_observations[0].latitude, _observations[0].longitude, function() {
			$this.trigger('ready');
		});
	}
	};



	// check to see if data needs to be refreshed
    function checkRefresh(location) {

		// check the expiration
		if ( _observations[0]!=undefined && dateFns.isFuture( _observations[0].xdate ) ) {
			setTimeout(checkRefresh, getRandom(5000, 10000));
			return;
		}

		// woeid is the id for the location to pull data for
		console.log(location);
		if (location != undefined) {
		var loclat = location.split(",")[0]
		var loclong = location.split(",")[1]
		//old var url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + loclat + '&lon=' + loclong + '&appid=0cb279a98124446dd16dba02fbfb60ee&units=imperial'
		https://api.weather.com/v3/aggcommon/v3-wx-observations-current;v3-location-point?geocode=33.74,-84.39&language=en-US&units=e&format=json&apiKey=yourApiKey

		var url = 'https://api.weather.com/v3/aggcommon/v3-wx-observations-current;v3-location-point?geocode=' + loclat + ',' + loclong + '&language=en-US&units=e&format=json&apiKey=' + api_key

		// ajax the latest observation
		$.getJSON(url, function(data) {
			if (data['v3-location-point'] != null) {
			_observations[0] = json = data['v3-wx-observations-current'];
			_observations[0].latitude = loclat;
			_observations[0].longitude = loclong;
			_observations[0].cityname = data['v3-location-point'].location.displayName;
			$this.trigger('refresh');

			 // the following block only runs on init
			if (that.woeid===undefined) {

			that.woeid = loclat;

			that.lat = loclat;
			that.long = loclong;

			that.city = data['v3-location-point'].location.displayName;


			$this.trigger('init');
			}
			// set the expiration date/time
			_observations[0].xdate = dateFns.addMinutes(json.lastBuildDate, json.ttl);

			setTimeout(function() {checkRefresh(loclat + "," + loclong)}, 100000);
		} else {
			$this.trigger('init');
		}
		});

}

}

	// pull observations from the location observation station





function ForecastManager (latitude, longitude, readyCallback) {
	var _forecasts = {},
		keys =['alert','daily','hourly','almanac','pollen','achesindex','breathindex','airquality','forecastuvindex', 'uvindex'],
		key,
		readycount = 0;

	for(key of keys) {
		_forecasts[key] = new Forecast(key, latitude, longitude, count);
	}


	function count() {
		// count up completed forecast pulls
		readycount++;
		if (readycount===keys.length) {
			readyCallback();
		}
	}

	this.forecast = function(type) {
		try{
		return _forecasts[type].data;
		} catch(err){}
	}

}

function Forecast(type, lat, lon, readyCallback) {

	var that = this;
	var url;
		if (type == 'hourly') {
			url = 'https://api.weather.com/v3/wx/forecast/hourly/2day?geocode=' + lat + ',' + lon + "&format=json&units=e&language=en-US&apiKey=" + api_key
		} else if (type == 'daily') {
			url = 'https://api.weather.com/v3/wx/forecast/daily/5day?geocode=' + lat + ',' + lon + "&format=json&units=e&language=en-US&apiKey=" + api_key
		} else if (type == 'alert') {
			url = 'https://api.weather.com/v3/alerts/headlines?geocode=' + lat + ',' + lon + "&format=json&language=en-US&apiKey=" + api_key
		} else if (type == 'almanac') {
			url = 'https://api.weather.com/v3/wx/almanac/daily/1day?geocode=' + lat + ',' + lon + "&format=json&units=e" + "&day=" + dateFns.format(new Date(), "D") + "&month=" + dateFns.format(new Date(),"M") + "&apiKey=" + api_key
		} else if (type == 'pollen') {
			url = 'https://api.weather.com/v1/geocode/'+ lat + '/' + lon + '/observations/pollen.json?language=en-US&apiKey=' + api_key
		} else if (type == 'achesindex') {
			url = 'https://api.weather.com/v2/indices/achePain/daypart/3day?geocode=' + lat + ',' + lon + "&language=en-US&format=json&apiKey=" + api_key
		} else if (type == 'breathindex') {
			url = 'https://api.weather.com/v2/indices/breathing/daypart/3day?geocode=' + lat + ',' + lon + "&language=en-US&format=json&apiKey=" + api_key
		} else if (type == 'airquality') {
			url = 'https://api.weather.com/v3/wx/globalAirQuality?geocode=' + lat + ',' + lon + "&language=en-US&scale=EPA&format=json&apiKey=" + api_key
		} else if (type == 'forecastuvindex') {
			url = 'https://api.weather.com/v2/indices/uv/hourly/48hour?geocode=' + lat + ',' + lon + "&language=en-US&format=json&apiKey=" + api_key
		}else if (type == 'uvindex') {
			url = 'https://api.weather.com/v2/indices/uv/current?geocode=' + lat + ',' + lon + "&language=en-US&format=json&apiKey=" + api_key
		}

	this.data = {};

	checkRefresh();

    function checkRefresh() {

		// check the expiration
		if ( that.data!={} && dateFns.isFuture( that.data.xdate ) ) {
			setTimeout(function() {checkRefresh}, 100000);
			return;
		}

		// ajax the forecast
		$.getJSON(url, function(data) {

			that.data = data

			// trigger ready callback on first data pull

			// set the expiration date/time
		})
		.always(function() {
			if (readyCallback){
				readyCallback();
			}
		 });
    }

}
}
