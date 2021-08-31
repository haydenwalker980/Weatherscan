var mainstate
function WeatherManager() {

	var mainloc;
	var mainMap, miniMap, slides,
		dataMan, loops, //weatherAudio,
		that = this;
var marqueeforecasttype = 'now';
	$(function(){

		// init marquees

		function refreshMarquee () {
			if (marqueeforecasttype == 'now') {
				marqueeforecasttype = 'forecast'
				$('#arrow-img').attr("src",'/images/' + foreMarqueeDay + 'arrow.png');
				$('.marquee-fore').each(function(i, item) {
					item.style.display = ''
				});$('.marquee-now').each(function(i, item) {
					item.style.display = 'none'
				});
			} else {
				marqueeforecasttype = 'now'
				$('#arrow-img').attr("src",'/images/now.png');
				$('.marquee-fore').each(function(i, item) {
					item.style.display = 'none'
				});
				$('.marquee-now').each(function(i, item) {
					item.style.display = ''
				});
			}
			$('#marquee-container')
				.marquee('destroy')
				.marquee({speed: 200, pauseOnHover:true, delayBeforeStart:3000})
				.on('finished', refreshMarquee);
		}
		refreshMarquee();


		$('#marquee2').marquee({
			speed: 170, pauseOnHover: true
		});


		weatherAudio.playCallback = function(tags) {
			$('.track-info').text('playing "' + tags.title + '" by ' + tags.artist);
		}

		// this little guy runs the date and time
		setInterval(
			function () {
				var today = new Date();

				$('#date').text( today.toString().slice(4,10).trimRight() );
				$('#time').text( today.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric', second: 'numeric' }).replace(/ /g,'') );
			}
		, 1000);

		initDataPull();

	});



	function initDataPull() {
		// get the main location data
		// on initialization ready, init local forecast loop
		// on return of fully ready, begin display loops

		// check the url for a specific location
		var queryString = window.location.search;

		if (queryString) {
			$.getJSON("https://api.weather.com/v3/location/search?query="+queryString.split("?")[1]+"&language=en-US&format=json&apiKey=" + api_key, function(data) {
				dataMan = createDataManager( data.location.latitude[0]+','+data.location.longitude[0] );
				mainloc = data.location.city[0]
				mainstate = data.location.adminDistrict[0]
				groupDataManager = new GroupDataManager;
			});
		} else {

			// get lat lon from user's ip
			$.getJSON("http://ip-api.com/json/?callback=?", function(data) {
				dataMan = createDataManager( data.lat+','+data.lon );
				mainloc = data.city
				mainstate = data.regionName
				groupDataManager = new GroupDataManager;
			});

		}

		function initDisplayLoops(){
			loops  = new Loops(dataMan.locations[0]);
		}
		function initSlidesLoop() {
			slides = new Slides(dataMan);
		}
		function createDataManager(searchString) {
			var dataManager = new DataManager();

			$(dataManager)
			.on('refresh',    refreshObservationDisplay)
			.on('ready:main', initDisplayLoops)
			.on('allinit',    initSlidesLoop);

			dataManager.init(searchString);

			return dataManager;

		}

	}


	function refreshObservationDisplay() {
		var data = dataMan.locations[0].observations(0),
			cond = data.wxPhraseLong;

		if (mainMap===undefined) {
			miniMap = new Radar("minimap", 3, 6, data.latitude, data.longitude);
			mainMap = that.mainMap = new Radar("radar-1", 3, 8, data.latitude, data.longitude, true);
		}

		$('#city').text(mainloc);
		$('#forecast-city').text(mainloc + ':');
		$('#current-temp').text( dataMan.locations[0].temperature() ) ;
		$('#conditions-icon').css('background-image', 'url("' + getCCicon(+data.iconCode, data.windSpeed) + '")');

	}

}
var weatherMan = new WeatherManager();
