/*

headings:
RADAR < MAIN CITY < CITY 1 < CITY 2
*/

	// load slide data
	function Slides(dataMan) {
		var radarSlideDuration = 60000,
			slideDelay = 10000;
			// for later
		var selectval = 0;
		buildHeader();

		setTimeout(nextCity, 5000);


		// loop cities
		function nextCity(){

			advanceHeader();

			var city = $('#info-slides-header .city.current');

			// is radar or city?
			if (city[0].dataset.woeid) {
				// show slide deck for the current city
				showCitySlides( dataMan.location(city[0].dataset.woeid), 0 );

			} else {


				// radar
				showRadar(dataMan.locations[0].lat, dataMan.locations[0].long, 8);

				//setTimeout(function() { weatherAudio.playLocalRadar() }, 2000 );

				// show for how long?
				setTimeout(nextCity, 60000);

			}

		}



		function showRadar(lat, long, zoom) {

			weatherMan.mainMap.setView(lat, long, zoom);

			setTimeout(function() {

				// fade out info, fade in radar
				$('.info-slide-content:visible').fadeOut(250, function(){
					$('.info-slide').fadeOut(250, function() {
						$('.radar-slide').fadeIn(500);
					});
				});

			}, 1500); // give it time to load

		}


		// show the set of slides for one city
		function showCitySlides(location, idx) {

			var currentDisplay,
				displays = {

				// Currently (10 sec)
				currentConditions() {
					$('.city-info-slide #subhead-title').text('Currently');
					$('.city-info-slide #subhead-city').text(location.city);
					var obsData = location.observations,
						strLabels =	'Humidity<br>Dew Point<br>Pressure<Br>Wind<br>',
						strData =
							obsData(0).current.humidity + '%<br>' + dewPoint(parseInt(obsData(0).current.temp), parseInt(obsData(0).current.humidity)) + '<br>' + (obsData(0).current.pressure*0.0295301).toFixed(2)  + '<br>' + degToCompass(obsData(0).current.wind_deg) + ' ' + Math.round(parseInt(obsData(0).current.wind_speed)) + '<br>';
					if (obsData(0).current.wind_gust!=undefined) {
						strLabels+='Gusts<Br>';
						strData+=obsData(0).current.wind_gust +	'<br>';
					} else {
						strLabels+='Gusts<Br>';
						strData+='none<br>';
					}
					var windchill =	35.74 + (0.6215 * parseInt(obsData(0).current.temp)) + (0.4275 * parseInt(obsData(0).current.temp) - 35.75)  *  parseInt(obsData(0).current.wind_speed) ^ 0.16;
					if (windchill < parseInt(obsData(0).current.temp)) {
						strLabels+='Wind Chill';
						strData+= windchill;
					} else if (parseInt(obsData(0).current.temp)>=80 && parseInt(obsData(0).current.humidity)>=40 ){
						strLabels+='Heat Index';
						return 'heat index ' + heatIndex(obsData(0).current.temp, obsData(0).current.humidity) + '&deg;';
					};

					$('.city-info .frost-pane .labels').html(strLabels);
					$('.city-info .frost-pane .data').html(strData);

					// right pane
					$('.city-info .icon').css('background-image', 'url("' + getCCicon(+obsData(0).current.weather[0].id + obsData(0).current.weather[0].icon, obsData(0).current.wind_speed) + '")');
					$('.city-info .conditions').text(getCC(obsData(0).current.weather[0].id + obsData(0).current.weather[0].icon, obsData(0).current.wind_speed));
					$('.city-info .temp').text( Math.round(parseInt(obsData(0).current.temp)) );

					fadeToContent('.city-info');
					wait(slideDelay);

				}

				// Local Doppler Radar or Radar/Satellite (15 sec, zoomed out with cloud cover)
				,localDoppler(){
					showRadar(location.lat, location.long, 8);
					wait(slideDelay + 1500);
				}

				// daypart / hourly
				,forecast(fidx) {
					//pick between day part or local forecast
					if (selectval === 0 || selectval === 1) {
						var foreDataHourly = dataMan.locations[0].forecasts('hourly');
						var indexes = calcHourlyReport(foreDataHourly);
						var i;
						var temps=[];
						// reset tempbar animation
						$('.info-slide-content.daypart .hour').each(function(){
								$('.info-slide-content.daypart .hour .tempbar').css("height", "0px")
								$('.info-slide-content.daypart .hour .tempbar .temp').css("opacity", "0%");
								$('.info-slide-content.daypart .hour .tempbar .wind').css("opacity", "0%");
							i = i + 1
						});
						//hour title
						$('.info-slide-content.daypart .hour.i .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly[indexes[0]].startTime));
						$('.info-slide-content.daypart .hour.ii .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly[indexes[1]].startTime));
						$('.info-slide-content.daypart .hour.iii .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly[indexes[2]].startTime));
						$('.info-slide-content.daypart .hour.iv .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly[indexes[3]].startTime));
						for (var i of indexes) {
							var data = foreDataHourly[i];
							temps.push(data.temperature);
						}

						$('.info-slide-content.daypart .hour.i .tempbar .temp').text(foreDataHourly[indexes[0]].temperature);
						$('.info-slide-content.daypart .hour.ii .tempbar .temp').text(foreDataHourly[indexes[1]].temperature);
						$('.info-slide-content.daypart .hour.iii .tempbar .temp').text(foreDataHourly[indexes[2]].temperature);
						$('.info-slide-content.daypart .hour.iv .tempbar .temp').text(foreDataHourly[indexes[3]].temperature);

						$('.info-slide-content.daypart .hour.i .tempbar .wind').text(foreDataHourly[indexes[0]].windDirection + ' ' + (foreDataHourly[indexes[0]].windSpeed).replace(" mph", ""));
						$('.info-slide-content.daypart .hour.ii .tempbar .wind').text(foreDataHourly[indexes[1]].windDirection + ' ' + (foreDataHourly[indexes[1]].windSpeed).replace(" mph", ""));
						$('.info-slide-content.daypart .hour.iii .tempbar .wind').text(foreDataHourly[indexes[2]].windDirection + ' ' + (foreDataHourly[indexes[2]].windSpeed).replace(" mph", ""));
						$('.info-slide-content.daypart .hour.iv .tempbar .wind').text(foreDataHourly[indexes[3]].windDirection + ' ' + (foreDataHourly[indexes[3]].windSpeed).replace(" mph", ""));

						$('.info-slide-content.daypart .hour.i .condition').text(buildConditions(foreDataHourly[indexes[0]].shortForecast));
						$('.info-slide-content.daypart .hour.ii .condition').text(buildConditions(foreDataHourly[indexes[1]].shortForecast));
						$('.info-slide-content.daypart .hour.iii .condition').text(buildConditions(foreDataHourly[indexes[2]].shortForecast));
						$('.info-slide-content.daypart .hour.iv .condition').text(buildConditions(foreDataHourly[indexes[3]].shortForecast));

						$('.info-slide-content.daypart .hour.i .icon').css('background-image', 'url("' + mapNWSicons(foreDataHourly[indexes[0]].icon) + '")');
						$('.info-slide-content.daypart .hour.ii .icon').css('background-image', 'url("' + mapNWSicons(foreDataHourly[indexes[1]].icon) + '")');
						$('.info-slide-content.daypart .hour.iii .icon').css('background-image', 'url("' + mapNWSicons(foreDataHourly[indexes[2]].icon) + '")');
						$('.info-slide-content.daypart .hour.iv .icon').css('background-image', 'url("' + mapNWSicons(foreDataHourly[indexes[3]].icon) + '")');

						function buildConditions(forecasttext) {
							if (forecasttext.includes("Thunderstorms") === true) {
								return forecasttext.replace(/Slight Chance/g,"Isolated").replace(/Chance/g,"Sct'd").replace(/Thunderstorms/g,"T'storms").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Showers and Thunderstorms/g,"T'Storms")
							} else {
								return forecasttext.replace(/Slight Chance/g,"Few").replace(/Chance/g,"").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Isolated/g,"Few")
							}
						}
						function buildHourlyTimeTitle(time){
							var hour=dateFns.getHours(time);

							if (hour===0) {
								return 'Midnight';
							} else if (hour===12){
								return 'Noon';
							}
							return (dateFns.format(time,'h a')).replace(" ", "");
						}
						//get reporting hours: 12am, 6am, 12pm, 3pm, 5pm, 8pm...
						function calcHourlyReport(data) {
							var ret = [],
								targets = [0, 6, 12, 15, 17, 20],   // hours that we report
								current = dateFns.getHours(new Date()),
								now = new Date(),
								//firsthour = targets[ getNextHighestIndex(targets, current) ],
								start,
								hour, i=0;

							switch (true) {
								case (current < 3):
									start = 6;
								case (current < 9):
									start = 12; break;
								case (current < 12):
									start = 15; break;
								case (current < 14):
									start = 17; break;
								case (current < 17):
									start = 6; break;
								case (current < 20):
										start = 6; break;
								default:
									start = 6;
							}
							while(ret.length<4){

								// hour must be equal or greater than current
								hour = dateFns.getHours( data[i].startTime );
								if ( dateFns.isAfter(data[i].startTime, now) && (hour==start || ret.length>0) )  {

									if ( targets.indexOf(hour)>=0 ) { // it is in our target list so record its index
										ret.push(i);
									}

								}
								i++;
							}
							return ret;
						}
						function buildHourlyHeaderTitle(time) {
							var today = new Date(),
								tomorrow = dateFns.addDays(today, 1);

							// title based on the first hour reported
							switch (dateFns.getHours(time)) {

							case 6: // 6 - Nextday's Forecast / Today's Forecast
								// if 6am today
								if (dateFns.isToday(time)) {
									return "Today's Forecast";
								}
							case 0: // 0 - Nextday's Forecast
								return "Tomorrow's Forecast";

							case 12:
								return "Today's Forecast";

							case 15:
								return "Today's Forecast";

							case 17:
								return "Tonight's Forecast";

							case 20:
								return "Tonight's Forecast"

							}

						}
						// calculate height of tempbars
						$('.city-info-slide #subhead-title').text(buildHourlyHeaderTitle(foreDataHourly[indexes[0]].startTime));
						fadeToContent('.info-slide-content.daypart')
						var min = Math.min(...temps),  // 54
							max = Math.max(...temps),  // 73
							range = (max-min),
							prange = (100-78), // percent range for bar height
							hourlable = ['i', 'ii', 'iii', 'iv'],
							temp, value, i = 0;
						$('.info-slide-content.daypart .hour').each(function(){
							temp = foreDataHourly[indexes[i]].temperature
							value = ((temp-min)/range) * prange + 78; // find percentage of range and translate to percent and add that to the starting css % height number
							valueii = (value/100) * 165 // multiply percentage by max height
							$('.info-slide-content.daypart .hour.' + hourlable[i] + ' .tempbar').animate({height:valueii+"px"}, 1500,function(){
								$('.info-slide-content.daypart .hour .tempbar .temp').fadeTo('slow', 1);
								$('.info-slide-content.daypart .hour .tempbar .wind').fadeTo('slow', 1);
							});
							i = i + 1
						})
						wait(slideDelay)
					} else {
						// Local Forecast -Today (10 sec)
							var div = '.info-slide-content.forecast ',
								forecasts = location.forecasts('daily');

							function fillinfo() {

								fidx = (fidx===undefined ? 0 : fidx);

								$('.city-info-slide #subhead-title').text('Local Forecast');

								// title
								$(div + '.title').text( forecasts[fidx].name );

								// content
								resizeText( forecasts[fidx].detailedForecast );
								$(div + '.content').text( forecasts[fidx].detailedForecast );

							}

							fadeToContent(div, fillinfo)

							setTimeout( function() {

								if (fidx<3) {
									currentDisplay(++fidx);
								} else {
									wait(0);
								}

							}, slideDelay)
					}
					selectval = selectval + 1
				if (selectval === 4) {selectval = 1}
				}



				// Extended Forecast(5 day columns)
				,extendedForecast() {
					$('.city-info-slide #subhead-title').text('Extended Forecast');

					var foreDataDaily = dataMan.locations[0].forecasts('daily');
					var icons, weekend
					startidx = (foreDataDaily[0].name==='Tonight' ? 1 : 2),
					days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
					//days
					$('.info-slide-content.extended-forecast .frost-pane.iw .thing').text(days[ dateFns.getDay(foreDataDaily[startidx].startTime) ])
					$('.info-slide-content.extended-forecast .frost-pane.iiw .thing').text(days[ dateFns.getDay(foreDataDaily[startidx+2].startTime) ])
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .thing').text(days[ dateFns.getDay(foreDataDaily[startidx+4].startTime) ])
					$('.info-slide-content.extended-forecast .frost-pane.ivw .thing').text(days[ dateFns.getDay(foreDataDaily[startidx+6].startTime) ])
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .thing .thingtext').text(days[ dateFns.getDay(foreDataDaily[startidx+8].startTime) ])

					//icons
					$('.info-slide-content.extended-forecast .frost-pane.iw .icon').css('background-image', 'url("' + mapNWSicons(foreDataDaily[startidx].icon)[0] + '")');
					$('.info-slide-content.extended-forecast .frost-pane.iiw .icon').css('background-image', 'url("' + mapNWSicons(foreDataDaily[startidx+2].icon) + '")');
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .icon').css('background-image', 'url("' + mapNWSicons(foreDataDaily[startidx+4].icon) + '")');
					$('.info-slide-content.extended-forecast .frost-pane.ivw .icon').css('background-image', 'url("' + mapNWSicons(foreDataDaily[startidx+6].icon) + '")');
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .icon').css('background-image', 'url("' + mapNWSicons(foreDataDaily[startidx+8].icon) + '")');

					//conditions
					$('.info-slide-content.extended-forecast .frost-pane.iw .conditions').text(builddailyconditions(foreDataDaily[startidx].shortForecast));
					$('.info-slide-content.extended-forecast .frost-pane.iiw .conditions').text(builddailyconditions(foreDataDaily[startidx+2].shortForecast));
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .conditions').text(builddailyconditions(foreDataDaily[startidx+4].shortForecast));
					$('.info-slide-content.extended-forecast .frost-pane.ivw .conditions').text(builddailyconditions(foreDataDaily[startidx+6].shortForecast));
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .conditions').text(builddailyconditions(foreDataDaily[startidx+8].shortForecast));

					//high
					$('.info-slide-content.extended-forecast .frost-pane.iw .temphigh').text(foreDataDaily[startidx].temperature)
					$('.info-slide-content.extended-forecast .frost-pane.iiw .temphigh').text(foreDataDaily[startidx+2].temperature)
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .temphigh').text(foreDataDaily[startidx+4].temperature)
					$('.info-slide-content.extended-forecast .frost-pane.ivw .temphigh').text(foreDataDaily[startidx+6].temperature)
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .temphigh .temphightext').text(foreDataDaily[startidx+8].temperature)

					//low
					$('.info-slide-content.extended-forecast .frost-pane.iw .templow').text(foreDataDaily[startidx+1].temperature)
					$('.info-slide-content.extended-forecast .frost-pane.iiw .templow').text(foreDataDaily[startidx+3].temperature)
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .templow').text(foreDataDaily[startidx+5].temperature)
					$('.info-slide-content.extended-forecast .frost-pane.ivw .templow').text(foreDataDaily[startidx+7].temperature)
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .templow').text(foreDataDaily[startidx+9].temperature)

					function builddailyconditions(dailyconditiontext) {
						if (dailyconditiontext.includes("then") === true){
							var splitdc = dailyconditiontext.split("then")
							if (dailyconditiontext.includes("Thunderstorms") === true) {
							splitdc[0] = splitdc[0].replace(/Slight Chance/g,"Isolated").replace(/Chance/g,"Sct'd").replace(/Thunderstorms/g,"T'storms").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Showers and Thunderstorms/g,"T'Storms").replace(/Patchy/g,"").replace(/Cloudy/g,"Clouds").replace(/Sunny/g,"Sun")
							splitdc[1] = splitdc[1].replace(/Slight Chance/g,"Isolated").replace(/Chance/g,"Sct'd").replace(/Thunderstorms/g,"T'storms").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Showers and Thunderstorms/g,"T'Storms").replace(/Patchy/g,"").replace(/Cloudy/g,"Clouds").replace(/Sunny/g,"Sun")
							return "AM" + splitdc[0] +  ", PM" + splitdc[1]
						} else {
							splitdc[0] = splitdc[0].replace(/Slight Chance/g,"Few").replace(/Chance/g,"").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Isolated/g,"Few").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Showers and Thunderstorms/g,"T'Storms").replace(/Patchy/g,"").replace(/Cloudy/g,"Clouds").replace(/Sunny/g,"Sun")
							splitdc[1] = splitdc[1].replace(/Slight Chance/g,"Few").replace(/Chance/g,"").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Isolated/g,"Few").replace(/Patchy/g,"").replace(/Cloudy/g,"Clouds").replace(/Sunny/g,"Sun")
							return "AM" + splitdc[0] +  ", PM" + splitdc[1]
						}
					} else {
						if (dailyconditiontext.includes("Thunderstorms") === true) {return dailyconditiontext.replace(/Slight Chance/g,"Isolated").replace(/Chance/g,"Sct'd").replace(/Thunderstorms/g,"T'storms").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Showers and Thunderstorms/g,"T'Storms").replace(/Patchy/g,"")} else {return dailyconditiontext.replace(/Slight Chance/g,"Few").replace(/Chance/g,"").replace(/Partly Sunny/g,"Partly Cloudy").replace(/Isolated/g,"Few").replace(/Patchy/g,"")}
					}

					}
					fadeToContent('.info-slide-content.extended-forecast')
					wait(slideDelay)
				}

		},
		keys = Object.keys(displays);

		var daypart;
		if (idx<keys.length) {
			currentDisplay = displays[keys[idx]];
			currentDisplay();
		} else { // done - exit
			nextCity();
		}
		return;

		function wait(duration){
			setTimeout(function() {
				showCitySlides(location, ++idx);
			}, duration);
		}



		function resizeText(text){
			var s = 50,
				$container = $('.info-slide-content.forecast .content'),
				$test = $('<div style="position:absolute;top:100%;"></div>') .appendTo($container) .css('font-size', s + 'px') .html(text);

			// have to display parent so we can get measurements
			$container.closest('.info-slide-content').show();

			$test.width($container.width() );
			while ($test.outerHeight(true) >= ($container.height()) ) {
				s -= 1;
				$test.css('font-size', s + 'px');
			}
			$container.closest('.info-slide-content').hide();
			$container .text(text) .css('font-size', s + 'px');
			$test.remove();

		}


		function fadeToContent(to, callfirst) {
			var $to = $(to),
				$parent = $to.closest('.info-slide');

			if ( $parent.is(":hidden") ) {
				// hide other visible slide then show the parent
				$to.hide();
				$('.info-slide:visible').fadeOut(250, function() {
					//$to.hide();
					$parent.fadeIn(250, showMe);
				});
			} else {
				hideOldShowMe();
			}

			function hideOldShowMe() {
				if ($('.info-slide-content:visible')) {
					$('.info-slide-content:visible').fadeOut(500, showMe);
				} else {
					showMe();
				}
			}

			function showMe() {
				if (callfirst) { callfirst() };
				$to.fadeIn(500);
			}

		}

		//doDisplay = displays[ keys[idx] ]();

			// increment the pointer
			//idx = (++idx===keys.length ? 0 : idx);

			//if (text) {
			//	$('#current-info').html(text);
			//	setTimeout(function(){ displayAtmospheric(idx) }, 6000); // 6 second increment loop
			//} else {
				// nothing to display - skip to the next one
			//	setTimeout(function(){ displayAtmospheric(idx) }, 0);
			//}

			/*
			(Main City)
			Currently (10 sec)
			Local Doppler Radar or Radar/Satellite (15 sec, zoomed out with cloud cover)

			Local Forecast
			-Today (10	 sec)
			-Tonight (10 sec)
			-Tomorrow (name day) (10 sec)
			-Tomorrow (name day) Night (10 sec)

			or

			Daypart

			Extended Forecast(5 day columns)
			Almanac (to be made)

			(Per City)
			Local Doppler Radar (center on city)
			Currently
			Local Doppler Radar
			Today's Forecast
			Extended Forecast(5 day columns)
			*/



			//idx++;
			//if (idx<=0){
				setTimeout(cityLoop, 3000);  // change to 60000 for production
			//} else {

			//}

		}



		function advanceHeader() {

			// swap current
			var $cities = $('#info-slides-header .city'),
				$scroller = $('#info-slides-header .hscroller'),
				left;

			$($cities[0]).removeClass('current');
			$($cities[1]).addClass('current');

			// animate move left
			left = $scroller.position().left - $($cities[1]).position().left;
			$scroller.animate({ 'left':	left+'px' }, 700,
			function(){
				// on completion, move the old one to the end
				$scroller.css('left','');
				$($cities[0]).appendTo($scroller);
				$('#info-slides-header span').first().appendTo($scroller);
			})


		}

	function buildHeader(){
		var city, first, woeid,
			cities='',
			arrow='<span class="divider-arrow">&lt;</span>',
			radar='<span class="city radar">LOCAL RADAR</span>';

		for (var location of dataMan.locations) {
			city = location.city;
			cities += arrow+'<span class="city" data-woeid="' + location.woeid + '">' + city + '</span>';
		}

		$('#info-slides-header .hscroller').append(cities + arrow + (radar + cities + arrow).repeat(4));
	}




}  // end function
function mapNWSicons(url){
	var map = {
			skc:[26,25],
			few:[28,27],
			sct:[24,23],
			bkn:[22,21],
			ovc:[20,20],
			wind_skc:[26,25,47],
			wind_few:[28,27,47],
			wind_sct:[24,23,47],
			wind_bkn:[22,21,47],
			wind_ovc:[20,20,47],
			snow:[10,10],
			rain_snow:[2,2],
			rain_sleet:[38,38],
			snow_sleet:[3,3],
			fzra:[6,6],
			rain_fzra:[6,6],
			snow_fzra:[44,44],
			sleet:[13,13],
			rain:[8,8],
			rain_showers:[7,7],
			rain_showers_hi:[5,5],
			tsra:[1,1],
			tsra_sct:[29,37],
			tsra_hi:[29,37],
			tornado:[46,46],
			hurr_warn:[45,45],
			hurr_watch:[45,45],
			ts_warn:[45,45],
			ts_watch:[45,45],
			ts_hurr_warn:[45,45],
			dust:[14,14],
			smoke:[16,16],
			haze:[16,16],
			hot:[16,16],
			cold:[42,42],
			blizzard:[11,11],
			fog:[15,15]
	},
	matches = url.match(/icons\/land\/(day|night)\/([a-z_]*)\/?([a-z_]*)/),  // day or night followed by one or more condition codes
	idx = {day:0, night:1}[matches[1]],
	ret=[], match;

	for (i=2; i<matches.length; i++){

		if (matches[i]) {
			match = map[ matches[i] ];

			ret.push( match[idx] );

			//some icons are 2 layered but don't want it
			if (match.length>2) {
				ret.push( match[2] );
			}
		}
	}

	// place word icons last so they render on top
	if (ret.length>1 && [15,47,41,42, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 20, 31, 33, 34, 38, 39, 40, 44].indexOf( ret[1] )>-1) {
		ret.swap(0,1);
	}

	return ret.map(function(num){
		return 'images/icons/' + ('0'+num).slice(-2) + '.png';
	});

}
