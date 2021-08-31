var foreMarqueeDay = ""
function GroupDataManager() {
	var locationx = {};
	var locations =
		[
			{name:'Chicago', n2:'IL'},
			{name:'Minneapolis', n2:'MN'},
			{name:'Tempe', n2:'AZ'},
			{name:'Fargo', n2:'ND'},
			{name:'North Hollywood', n2:'CA'},
			{name:'Los Angeles', n2:'CA'},
			{name:'Huntington Beach'},
			{name:'Las Vegas', n2:'NV'},
			{name:'Honolulu', n2:'HI'},
			{name:'Orlando', n2:'FL'},
			{name:'New York', n2:'NY'},
			{name:'Napa', n2:'CA'},
			{name:'Montego Bay', n2:''},
			{name:'Kona', n2:'HI'},
			{name:'Kalipaki Beach', n2:''},
			{name:'Ixtapa', n2:'MX'}
		]
	;

	checkRefresh();
	setInterval(checkRefresh, 300000);


	// check to see if data needs to be refreshed
  function checkRefresh() {



			// check the expiration
			var url = 'https://api.weather.com/v3/aggcommon/v3-wx-forecast-daily-5day;v3-wx-observations-current;v3-location-point?geocodes='
			woeid = location.hasOwnProperty('woeid') ? location.woeid : '';
			$.getJSON("https://examples.opendatasoft.com/api/records/1.0/search/?dataset=largest-us-cities&q=&sort=population&facet=city&facet=state&refine.state=" + mainstate, function(data) {
				if (data !== undefined && data.records.length != 0) {
				data.records.forEach((city, i) => {
					url += (city.fields.coordinates).replace(';',',');
					url += ';'
				});

				 url += '&language=en-US&units=e&format=json&apiKey='+ api_key
			 } else {
				 url = 'https://api.weather.com/v3/aggcommon/v3-wx-forecast-daily-5day;v3-wx-observations-current;v3-location-point?geocodes=41.881832,-87.623177;44.986656,-93.258133;33.427204,-111.939896;46.877186,-96.789803;34.187042,-118.381256;33.660057,-117.998970;36.114647,-115.172813;21.315603,-157.858093;28.538336,-81.379234;43.0,-75.0;&language=en-US&units=e&format=json&apiKey='+ api_key
			 }
				pullData(url);
			});

    }

	function pullData(url) {
		var $span;

		// ajax the latest observation
		$.getJSON(url, function(data) {
					data.forEach((locationdata, i) => {
						locationx.data = locationdata;

						if ( !location.hasOwnProperty('woeid') ) {
							locationx.woeid = locationx.data.id;
							$span = $("<span class=marquee-now id='" + locationx.woeid + "'></span>").appendTo('#marquee-now');
							$spanfor = $("<span class=marquee-fore id='" + locationx.woeid + "'></span>").appendTo('#marquee-now');
						} else {
							$span = $('#marquee-now>span#' + locationx.woeid);
						}
						var marqueeidx = 1;
						if (locationx.data['v3-wx-forecast-daily-5day'].daypart[0].daypartName[0] == undefined) {marqueeidx = 2;};
						if (locationx.data['v3-wx-forecast-daily-5day'].daypart[0].daypartName[marqueeidx] == "Tonight") {foreMarqueeDay = 'tonight';} else {foreMarqueeDay = (locationx.data['v3-wx-forecast-daily-5day'].dayOfWeek[1].substring(0,3)).toLowerCase()};
						// display the current info
						$span.text(locationx.data['v3-location-point'].location.displayName + ': ' + Math.round(parseInt(locationx.data['v3-wx-observations-current'].temperature)) + ' ' + (locationx.data['v3-wx-observations-current'].wxPhraseLong).toLowerCase());
						$spanfor.css('display','none')
						$spanfor.text(locationx.data['v3-location-point'].location.displayName + ': ' + Math.round(parseInt(locationx.data['v3-wx-forecast-daily-5day'].daypart[0].temperature[marqueeidx])) + ' ' + (locationx.data['v3-wx-forecast-daily-5day'].daypart[0].wxPhraseLong[marqueeidx]).toLowerCase());


						// set the expiration date/time
						//location.xdate = dateFns.addMinutes(location.data.lastBuildDate, location.data.ttl);

					});

				});
			};




}
