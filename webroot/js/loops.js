var severemode
function Loops(bindDataManager) {
	var //dataManager,
		obsData,
		foreDataDaily,
		foreDataHourly;

	obsData = bindDataManager.observations;
	foreDataDaily = bindDataManager.forecasts('daily');
	foreDataHourly = bindDataManager.forecasts('hourly');


	// init the display loops
	displayAtmospheric(0);
	displayForecast(0);

	function displayAtmospheric(idx) {

		var displays = {
			conditions() {
				return (obsData(0).wxPhraseLong).toLowerCase();
			},

				wind(){ return 'wind ' + ((obsData(0).windDirectionCardinal == "CALM") ? 'calm' :  obsData(0).windDirectionCardinal) + ' ' + ((obsData(0).windSpeed === 0) ? '' : obsData(0).windSpeed); },

				gusts(){
					if ( obsData(1)!=undefined ) {
						return obsData(1).windGust.value!=null ? 'gusts ' +  obsData(1).windGust.value : '';
					}
				},

				humidity(){ return 'humidity ' + obsData(0).relativeHumidity + '%'; },

				dewpoint(){ return 'dew point ' + obsData(0).temperatureDewPoint + '&deg;'; },

				heatindex_windchill(){
					var windchill =	Math.round(35.74 + 0.6215 * parseInt(obsData(0).temperature) - 35.75 * Math.pow(parseInt(obsData(0).windSpeed),0.16) + 0.4275 * parseInt(obsData(0).temperature) * Math.pow(parseInt(obsData(0).windSpeed),0.16) -1);
					if (parseInt(obsData(0).temperature)<80 && windchill < parseInt(obsData(0).temperature)) {

						return 'wind chill ' + windchill + '&deg;';
					} else if (parseInt(obsData(0).temperature)>=80 && parseInt(obsData(0).relativeHumidity)>=40 ){
						return 'heat index ' + heatIndex(obsData(0).temperature, obsData(0).relativeHumidity) + '&deg;';
					}
					else return '';
				},

				pressure(){ return 'pressure ' + obsData(0).pressureAltimeter },
//+ ['S','R','F'][obsData(0).current.rising];
				visibility() { return 'visibility ' + obsData(0).visibility + ' mile' + (obsData(0).visibility != 1 ? 's' : ''); },

				uvindex() { return 'UV index ' + obsData(0).uvDescription; },

		},
		keys = Object.keys(displays),
		text = displays[ keys[idx] ]();

		// increment the pointer
		if (severemode == true) {
			var si = 0;
			function resetInfo() {
				if (si == 0) {
					stext = (obsData(0).wxPhraseLong).toLowerCase() + '<br><br>' + 'wind ' + ((obsData(0).windDirectionCardinal == "CALM") ? 'calm' :  obsData(0).windDirectionCardinal) + ' ' + ((obsData(0).windSpeed === 0) ? '' : obsData(0).windSpeed) + '<br>' + 'humidity ' + obsData(0).relativeHumidity + '%' + '<br>' + 'dew point ' + obsData(0).temperatureDewPoint + '&deg;'
					$('#current-info').html(stext);
					si = 1;
				} else {
				$('#current-info').html((obsData(0).wxPhraseLong).toLowerCase() + '<br><br>' + 'pressure ' + obsData(0).pressureAltimeter + '<br>' + 'visibility ' + obsData(0).visibility + ((obsData(0).visibility != 1 ) ? 'miles' : 'mile') + '<br>' + 'ceiling' + ((obsData(0).cloudCeiling != null) ? ((obsData(0).cloudCeiling).toString() + 'ft') : ''));
				si = 0;
			}
				setTimeout(function(){resetInfo()}, 6000);
			}
			resetInfo()
		} else {
		idx = (++idx===keys.length ? 0 : idx);

		if (text) {
			$('#current-info').html(text);
			setTimeout(function(){ displayAtmospheric(idx) }, 6000); // 6 second increment loop
		} else {
			// nothing to display - skip to the next one
			setTimeout(function(){ displayAtmospheric(idx) }, 0);
		}
	}
	}  // end function


	function displayForecast(idx) {

		var displays = {

				text1() {
					if (foreDataDaily.daypart[0].daypartName[0] != null) {
					$('#forecast-title').text(foreDataDaily.daypart[0].daypartName[0] + "'S" + " FORECAST");
					resizeText(foreDataDaily.daypart[0].narrative[0] + ((foreDataDaily.daypart[0].qualifierPhrase[0] != null && foreDataDaily.daypart[0].narrative[0].includes(foreDataDaily.daypart[0].qualifierPhrase[0]) === false) ? foreDataDaily.daypart[0].qualifierPhrase[0] : '') + ((foreDataDaily.daypart[0].windPhrase[0] != null && foreDataDaily.daypart[0].narrative[0].includes(foreDataDaily.daypart[0].windPhrase[0]) === false) ? foreDataDaily.daypart[0].windPhrase[0] : ''));
				} else {
					$('#forecast-title').text(foreDataDaily.daypart[0].daypartName[1] + "'S" + " FORECAST");
					resizeText(foreDataDaily.daypart[0].narrative[1] + ((foreDataDaily.daypart[0].qualifierPhrase[1] != null && foreDataDaily.daypart[0].narrative[1].includes(foreDataDaily.daypart[0].qualifierPhrase[1]) === false) ? foreDataDaily.daypart[0].qualifierPhrase[1] : '') + ((foreDataDaily.daypart[0].windPhrase[1] != null && foreDataDaily.daypart[0].narrative[1].includes(foreDataDaily.daypart[0].windPhrase[1]) === false) ? foreDataDaily.daypart[0].windPhrase[1] : ''));
				}
				},
				text2() {
					if (foreDataDaily.daypart[0].daypartName[0] != null) {
					$('#forecast-title').text( foreDataDaily.daypart[0].daypartName[1] + "'S" + " FORECAST" );
					resizeText(foreDataDaily.daypart[0].narrative[1] + ((foreDataDaily.daypart[0].qualifierPhrase[1] != null && foreDataDaily.daypart[0].narrative[1].includes(foreDataDaily.daypart[0].qualifierPhrase[1]) === false) ? foreDataDaily.daypart[0].qualifierPhrase[1] : '') + ((foreDataDaily.daypart[0].windPhrase[1] != null && foreDataDaily.daypart[0].narrative[1].includes(foreDataDaily.daypart[0].windPhrase[1]) === false) ? foreDataDaily.daypart[0].windPhrase[1] : ''));
				} else {
					$('#forecast-title').text(foreDataDaily.dayOfWeek[1] + "'S" + " FORECAST");
					resizeText(foreDataDaily.daypart[0].narrative[2] + ((foreDataDaily.daypart[0].qualifierPhrase[2] != null && foreDataDaily.daypart[0].narrative[2].includes(foreDataDaily.daypart[0].qualifierPhrase[2]) === false) ? foreDataDaily.daypart[0].qualifierPhrase[2] : '') + ((foreDataDaily.daypart[0].windPhrase[2] != null && foreDataDaily.daypart[0].narrative[2].includes(foreDataDaily.daypart[0].windPhrase[2]) === false) ? foreDataDaily.daypart[0].windPhrase[2] : ''));
				}
				},

			    fiveday() {
					var newtile, weekend, icons,
						startidx = (foreDataDaily.daypart[0].daypartName[0] != null ? 0 : 2);

					$('#forecast-title').text("5 DAY FORECAST");
					$('#forecast-tiles').empty();

					for (var i=startidx; i<=(startidx + 8); i+=2 ) {

						weekend = ( dateFns.isWeekend(foreDataDaily.validTimeLocal[i/2]) ? ' weekend' : '');
						newtile = $("<div class='forecast-tile daily" + weekend + "'></div>");

						$("<div class='header'></div>") .appendTo(newtile) .text((foreDataDaily.dayOfWeek[i/2]).substring(0,3));

						icons = getCCicon(+foreDataDaily.daypart[0].iconCode[i], foreDataDaily.daypart[0].windSpeed[i]);

							$("<img class='icon' src=''/>") .appendTo(newtile) .attr('src', icons);


						$("<div class='high'></div>") .appendTo(newtile) .text(foreDataDaily.temperatureMax[i/2]);
						$("<div class='low'></div>")  .appendTo(newtile) .text(foreDataDaily.temperatureMin[i/2]);

						$('#forecast-tiles').append(newtile);
					}

					$('#forecast-tiles').css('display','flex');
				},

			    hourly() {
					var newtile, icons, sizer, highbar,
					    indexes = calcHourlyReport(foreDataHourly),
						data, label, temps=[];

					$('#forecast-title').text( buildHourlyHeaderTitle(foreDataHourly.validTimeLocal[indexes[0]]) );
					$('#forecast-tiles').empty();

					for (var i of indexes) {
						data = foreDataHourly;

						newtile = $("<div class='forecast-tile hourly'></div>");
						sizer   = $("<div class='width-sizer'></div>").appendTo(newtile);

						icons = getCCicon(data.iconCode[i], data.windSpeed[i]);

							$("<img class='icon' src=''/>") .appendTo(sizer) .attr('src', icons);


						$("<div class='footer'></div>") .appendTo(newtile) .text(buildHourlyTimeTitle(data.validTimeLocal[i]));

						highbar = $("<div class='hourly-high'></div>") .appendTo(sizer);

						$("<div class='high'></div>") .appendTo(highbar) .text(data.temperature[i]);
						temps.push(data.temperature[i]);

						$("<div class='temp-bar'></div>") .appendTo(highbar);

						$('#forecast-tiles').append(newtile);
					}

					$('#forecast-tiles').css('display','flex');

					// animate grow and show temp
					var min = Math.min(...temps),  // 54
						max = Math.max(...temps),  // 73
						range = (max-min),
						prange = (95-78), // percent range for bar height
						temp, value;
					$('.forecast-tile').each(function(){
						temp = $(this).find('.high').first().text();
						value = ((temp-min)/range) * prange + 78;  // find percentage of range and translate to percent and add that to the starting css % height number
						$(this).find('.hourly-high').animate({height:value+"%"}, 1500,function(){
							$(this).find('.high').fadeTo('slow', 1);
						});
					})
				},

				dummy(){}

			},
			keys = Object.keys(displays);

		displays[ keys[idx] ]();

		// increment the pointer
		idx = (++idx===keys.length ? 0 : idx);

		setTimeout(function(){ displayForecast(idx) }, 15000); // 15 second increment loop

	}

	function resizeText(text){
		var s = 38,
		$test = $('<div style="position:absolute;top:100%;"></div>') .appendTo('#forecast-text') .css('font-size', s + 'px') .html(text);
		$test.width($('#forecast-text').width() );
		//setTimeout(function() {
			while ($test.outerHeight(true) >= ($('#forecast-text').height()) ) {
				s -= 1;
				$test.css('font-size', s + 'px');
			}
			$('#forecast-text div') .text(text) .css('font-size', s + 'px');
			$test.remove();
			$('#forecast-tiles').hide();
		//},100);  // delay is a workaround for Interstate font not updating display
	}




} // end Loops class


function buildHourlyHeaderTitle(time) {
	var today = new Date(),
		tomorrow = dateFns.addDays(today, 1),
		sforecast = "'s Forecast";

	// title based on the first hour reported
	switch (dateFns.getHours(time)) {

	case 6: // 6 - Nextday's Forecast / Today's Forecast
		// if 6am today
		if (dateFns.isToday(time)) {
			return dateFns.format(today, 'dddd') + sforecast;
		}
	case 0: // 0 - Nextday's Forecast
		return dateFns.format(tomorrow, 'dddd') + sforecast;

	case 12:
		return 'This Afternoon';

	case 15:
		return "Today's Forecast";

	case 17:
		return "Tonight's Forecast";

	case 20:
		return dateFns.format(today, 'ddd') + ' Night/' + dateFns.format(tomorrow, 'ddd');

	}

}


function buildHourlyTimeTitle(time){
	var hour=dateFns.getHours(time);

	if (hour===0) {
		return 'midnight';
	} else if (hour===12){
		return 'noon';
	}

	return dateFns.format(time,'h a');
}


// finds the intervals to report on the hourly forecast
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
		case (current < 15):
			start = 17; break;
		case (current < 17):
			start = 20; break;
		case (current < 20):
			start = 0; break;
		default:
			start = 6;
	}

	while(ret.length<4){

		// hour must be equal or greater than current
		hour = dateFns.getHours( data.validTimeLocal[i] );
		if ( dateFns.isAfter(data.validTimeLocal[i], now) && (hour==start || ret.length>0) )  {

			if ( targets.indexOf(hour)>=0 ) { // it is in our target list so record its index
				ret.push(i);
			}

		}
		i++;
	}
	return ret;
}

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

			// some icons are 2 layered
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

/*

wind E 14
gusts 17 mph
humidity 58%
dew point 72(degree symbol)
heat index 95(degree symbol) / wind chill
pressure 30.02 S
visibility 10 miles
uv index High
partly cloudy

*/

// sample data
/*

https://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid=2402292

"units":{
   "distance":"mi",
   "pressure":"in",
   "speed":"mph",
   "temperature":"F"
},
"title":"Yahoo! Weather - Fargo, ND, US",
"link":"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2402292/",
"description":"Yahoo! Weather for Fargo, ND, US",
"language":"en-us",
"lastBuildDate":"Thu, 12 Oct 2017 10:10 PM CDT",
"ttl":"60",
"location":{
   "city":"Fargo",
   "country":"United States",
   "region":" ND"
},
"wind":{
   "chill":"52",
   "direction":"295",
   "speed":"18"
},
"atmosphere":{
   "humidity":"54",
   "pressure":"978.0",
   "rising":"0",
   "visibility":"16.1"
},
"astronomy":{
   "sunrise":"7:41 am",
   "sunset":"6:46 pm"
},
"image":{
   "title":"Yahoo! Weather",
   "width":"142",
   "height":"18",
   "link":"http://weather.yahoo.com",
   "url":"http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif"
},
"item":{
   "title":"Conditions for Fargo, ND, US at 09:00 PM CDT",
   "lat":"46.865089",
   "long":"-96.829224",
   "link":"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2402292/",
   "pubDate":"Thu, 12 Oct 2017 09:00 PM CDT",
   "condition":{
	  "code":"27",
	  "date":"Thu, 12 Oct 2017 09:00 PM CDT",
	  "temp":"55",
	  "text":"Mostly Cloudy"
   },
   "forecast":[
	  {
		 "code":"30",
		 "date":"12 Oct 2017",
		 "day":"Thu",
		 "high":"70",
		 "low":"48",
		 "text":"Partly Cloudy"
	  },
	  {
		 "code":"32",
		 "date":"13 Oct 2017",
		 "day":"Fri",
		 "high":"58",
		 "low":"37",
		 "text":"Sunny"
	  },
	  {
		 "code":"39",
		 "date":"14 Oct 2017",
		 "day":"Sat",
		 "high":"49",
		 "low":"38",
		 "text":"Scattered Showers"
	  },
	  {
		 "code":"34",
		 "date":"15 Oct 2017",
		 "day":"Sun",
		 "high":"56",
		 "low":"31",
		 "text":"Mostly Sunny"
	  },
	  {
		 "code":"34",
		 "date":"16 Oct 2017",
		 "day":"Mon",
		 "high":"65",
		 "low":"35",
		 "text":"Mostly Sunny"
	  },
	  {
		 "code":"34",
		 "date":"17 Oct 2017",
		 "day":"Tue",
		 "high":"65",
		 "low":"39",
		 "text":"Mostly Sunny"
	  },
	  {
		 "code":"30",
		 "date":"18 Oct 2017",
		 "day":"Wed",
		 "high":"64",
		 "low":"48",
		 "text":"Partly Cloudy"
	  },
	  {
		 "code":"30",
		 "date":"19 Oct 2017",
		 "day":"Thu",
		 "high":"65",
		 "low":"44",
		 "text":"Partly Cloudy"
	  },
	  {
		 "code":"30",
		 "date":"20 Oct 2017",
		 "day":"Fri",
		 "high":"66",
		 "low":"49",
		 "text":"Partly Cloudy"
	  },
	  {
		 "code":"28",
		 "date":"21 Oct 2017",
		 "day":"Sat",
		 "high":"61",
		 "low":"49",
		 "text":"Mostly Cloudy"
	  }
   ],
   "description":"<![CDATA[<img src=\"http://l.yimg.com/a/i/us/we/52/27.gif\"/>\n<BR />\n<b>Current Conditions:</b>\n<BR />Mostly Cloudy\n<BR />\n<BR />\n<b>Forecast:</b>\n<BR /> Thu - Partly Cloudy. High: 70Low: 48\n<BR /> Fri - Sunny. High: 58Low: 37\n<BR /> Sat - Scattered Showers. High: 49Low: 38\n<BR /> Sun - Mostly Sunny. High: 56Low: 31\n<BR /> Mon - Mostly Sunny. High: 65Low: 35\n<BR />\n<BR />\n<a href=\"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2402292/\">Full Forecast at Yahoo! Weather</a>\n<BR />\n<BR />\n<BR />\n]]>",
   "guid":{
	  "isPermaLink":"false"
   }

}


Current Conditions:</b>\n<BR />Mostly Cloudy\n<BR />\n<BR />\n<b>
Forecast:</b>\n<BR /> Thu - Partly Cloudy. High: 70Low: 48\n<BR /> Fri - Sunny. High: 58Low: 37\n<BR /> Sat - Scattered Showers. High: 49Low: 38\n<BR /> Sun - Mostly Sunny. High: 56Low: 31\n<BR />
Mon - Mostly Sunny. High: 65Low: 35\n<BR />\n<BR />\n<a href=\"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2402292/\">Full Forecast at Yahoo! Weather</a>\n<BR />\n<BR />\n<BR />\n]]>",
   "guid":{

*/
