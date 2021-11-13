/*

headings:
RADAR < MAIN CITY < CITY 1 < CITY 2
*/

	// load slide data
	function Slides(dataMan) {
		severemode = false;
		var radarSlideDuration = 60000,
			slideDelay = 10000;
						// for later
		var selectval = 0;
		var ret = [];
		//severe weather mode / marquee management
		var foreDataAlert = dataMan.locations[0].forecasts('alert');
		if (foreDataAlert !== undefined){
			ret = []
			sret = []
			var ai=0;
			//info
			//get only weather alers
			for (ai=0; ai<=foreDataAlert.alerts.length - 1; ai++) {
				warning = foreDataAlert.alerts[ai].categories[0].category;
				if (warning == "Met")  {
					ret.push(ai)
					if (foreDataAlert.alerts[ai].eventDescription == "Severe Thunderstorm Warning" || foreDataAlert.alerts[ai].eventDescription == "Flash Flood Warning" || foreDataAlert.alerts[ai].eventDescription == "Tornado Warning") {
						sret.push(ai)
					}
				}
			};
			if (ret.length != 0) {
				ret.sort(function(a, b){
					if (foreDataAlert.alerts[a].eventDescription < foreDataAlert.alerts[b].eventDescription) {
				    return -1;
				  }
				  if (foreDataAlert.alerts[a].eventDescription > foreDataAlert.alerts[b].eventDescription) {
				    return 1;
				  }
  				return 0
				});
			if (sret.length != 0) {
				severemode = true;
				$('#marqueeSevere').css("background","linear-gradient(to right, #510d08 0, #b41a08 100%)")
				$('.marqueeheadersevere').css("background","linear-gradient(to right, #d51e08 0, #b41a08 100%)")
				$('.marqueeheadersevere').css("color","#fff")
				$('.marqueeheadersevere').css("text-shadow","2px 2px 4px #000")
				var severeidx = 0;
				function switchSevereMarquee() {
				$.getJSON('https://api.weather.com/v3/alerts/detail?alertId='+ foreDataAlert.alerts[sret[severeidx]].detailKey +'&format=json&language=en-US&apiKey=' + api_key, function(data) {
					$('.marqueeheadersevere').text((foreDataAlert.alerts[sret[severeidx]].eventDescription + ((foreDataAlert.alerts[sret[severeidx]].messageType == " Update") ? 'UPDATE' : (foreDataAlert.alerts[sret[severeidx]].messageType == "Cancel") ? " CANCELLATION" : "")).toUpperCase());
					$('#arrow-img').fadeOut(0)
					$('#marqueeSevere').fadeIn(0)
					$('.marqueeheadersevere').fadeIn(0) //#868686
					$('#marqueeSevere').text(data.alertDetail.texts[0].description)
					$('#marqueeSevere')
						.marquee('destroy')
						.marquee({speed: 170, delayBeforeStart: 1000, pauseOnHover: true, pauseOnCycle: true})
						.on('finished', function(){
							switchSevereMarquee()
						});
						weatherAudio.playwarningbeep()
				});
			}
			switchSevereMarquee()
			} else {
			var warningdata;
				$.getJSON('https://api.weather.com/v3/alerts/detail?alertId='+ foreDataAlert.alerts[ret[0]].detailKey +'&format=json&language=en-US&apiKey=' + api_key, function(data) {
					$('.marqueeheadersevere').text((foreDataAlert.alerts[ret[0]].eventDescription + ((foreDataAlert.alerts[ret[0]].messageType == " Update") ? 'UPDATE' : (foreDataAlert.alerts[ret[0]].messageType == "Cancel") ? " CANCELLATION" : "")).toUpperCase());
					if (foreDataAlert.alerts[ret[0]].significance == "Y" || foreDataAlert.alerts[ret[0]].significance == "S") {
						$('#marqueeSevere').css('background','linear-gradient(to right, #853302 0, #a84503 100%)')
						$('.marqueeheadersevere').css("background","linear-gradient(to right, #e86d08 0, #a84403 100%)")
						$('.marqueeheadersevere').css("color","#000")
						$('.marqueeheadersevere').css("text-shadow", "0px 0px 0px #000")
					} else if (foreDataAlert.alerts[ret[0]].significance == "A") {
						$('#marqueeSevere').css("background", "linear-gradient(to right, #846811 0, #9b7d0e 100%)");
						$('.marqueeheadersevere').css('background', 'linear-gradient(to right, #e5dd20 0, #9b7d0e 100%)');
						$('.marqueeheadersevere').css("color", "#000");
						$('.marqueeheadersevere').css("text-shadow", "0px 0px 0px #000");
					}	else if (foreDataAlert.alerts[ret[0]].significance == "W") {
						$('#marqueeSevere').css("background","linear-gradient(to right, #510d08 0, #b41a08 100%)")
						$('.marqueeheadersevere').css("background","linear-gradient(to right, #d51e08 0, #b41a08 100%)")
						$('.marqueeheadersevere').css("color","#fff")
						$('.marqueeheadersevere').css("text-shadow","2px 2px 4px #000")
					}
					$('#arrow-img').fadeOut(0)
					$('#marqueeSevere').fadeIn(0)
					$('.marqueeheadersevere').fadeIn(0) //#868686
					$('#marqueeSevere').text(data.alertDetail.texts[0].description)
					$('#marqueeSevere')
						.marquee({speed: 170, delayBeforeStart: 1000, pauseOnHover: true, pauseOnCycle: true})
				});
			}
			}
		}
		buildHeader();
		//if (dataMan.location[0].observations[0].alerts != undefined) {

		//}
		setTimeout(function() {
			$('.radar-content').fadeOut(500);
			$('.radar-color-legend').fadeOut(500, function() {
				$('.radar-slide').fadeOut(0);
				nextCity()
			});
		}, 5500);
		// loop cities
		function nextCity(){
			//severe weather mode
			if (severemode == true) {

				$('#minimap-cover').fadeIn(0)
				$('.city-slide-intro .segment').text(location.city);
				$('#info-slides-header .hscroller').empty();
				$('#info-slides-header .hscroller').append("<span class='severe'>SEVERE WEATHER UPDATE</span>");

				$('.radar-slide .info-subheader').css('background', 'linear-gradient(to top, #868686 0, #868686 100%)')
				showBulletin();
				function showRadarS(lat, long, zoom, time) {


						// fade out info, fade in radar
						weatherAudio.playLocalRadar();
						$('.radar-slide').fadeIn(0);
						$('.radar-content').fadeIn(500);
						weatherMan.mainMap = Radar("radar-1", 3, zoom, lat, long, false);
						$('.radar-color-legend').fadeIn(500);
						setTimeout(function() {
							$('.radar-content').fadeOut(500);
							$('.radar-color-legend').fadeOut(500, function() {
								$('.radar-slide').fadeOut(0);
								if (severemode == true) {
									showBulletin()
								} else {
									$('#info-slides-header .hscroller').empty();
									$('#marqueeSevere').fadeOut(0)
									$('.marqueeheadersevere').fadeOut(0)
									$('#arrow-img').fadeIn(0)
									$('.radar-slide .infosubheader').css('background','linear-gradient(to top, #fffe21 0, #db5a14 100%);')
									buildHeader();
									nextCity();
								}
							});
						}, 60500);


				}
				function showBulletin() {
					var foreDataAlert = dataMan.locations[0].forecasts('alert');
					var pages = [""];
					if (foreDataAlert !== undefined){
						$('.bulletin .frost-pane .warnings').empty()
						var displayday;
						//info
						//get only weather alers


						if (ret.length != 0) {

						for (i of ret) {
							getexpiredate = function(expiretime) {
								dateFns.format(new Date(expiretime), "h:mm");
								if (dateFns.isToday(expiretime) != true) {
									var numday = dateFns.getDay(expiretime);
									displayday = {"0":"SUN","1":"MON","2":"TUE","3":"WED","4":"THU","5":"FRI","6":"SAT"}[numday] + ".";
								} else {
									displayday = "Today."
								}
								return dateFns.format(new Date(expiretime), "h:mm A ") + displayday
							}
							if (i != ret.length - 1) {
								$('.bulletin .frost-pane .warnings').append(foreDataAlert.alerts[i].eventDescription + " in effect until " + getexpiredate(foreDataAlert.alerts[ret[i]].expireTimeLocal) + "\n \n")
							} else {
								$('.bulletin .frost-pane .warnings').append(foreDataAlert.alerts[i].eventDescription + " in effect until " + getexpiredate(foreDataAlert.alerts[ret[i]].expireTimeLocal) + "\n \n")
							}
						}
						function splitLines() {

							 var warningsplitstr = $('.bulletin .frost-pane .warnings').text().split(/(?![^\n]{1,45}$)([^\n]{1,45})\s/g)
							 warningsplitstr.pop()
							 warningsplitstr.pop()
							 var warningpageidx = 0;
							 var warninglineidx = 0;
							 console.log(pages)
							 console.log(warningsplitstr)
							 warningsplitstr.forEach(warningline => {
								if (warningline != "") {
									if (warninglineidx == 0) {
										pages[warningpageidx] = ""
									}
								 console.log(warningline)
							 	pages[warningpageidx] += (warningline + '<br>')
								warninglineidx += 1;
								if (warninglineidx == 7) {
									warningpageidx += 1
									warninglineidx = 0
								}
							}
						});
							//$('.bulletin .frost-pane .warnings').text($('.bulletin .frost-pane .warnings').text().replace(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g, '$1\n'))
							 //console.log($('.bulletin .frost-pane .warnings').html())
							 makewarningPage(0)
						}
						splitLines()

						$('.bulletin').fadeIn(0);
						$('.bulletin .frost-pane').fadeIn(500);
						$('#subhead-noaa').fadeIn(500);
						function makewarningPage(warningpagenum) {
							if (warningpagenum > 0) {
								$('.bulletin .frost-pane').fadeOut(500, function() {
									$('.bulletin .frost-pane .warnings').html(pages[warningpagenum])
									$('.bulletin .frost-pane').fadeIn(500);
								});
							} else {
								$('.bulletin .frost-pane .warnings').html(pages[warningpagenum])
								$('.bulletin .frost-pane').fadeIn(500);
							}
							setTimeout(function() {
								if (warningpagenum < (pages.length - 1)) {
									makewarningPage(warningpagenum + 1)
								} else {
									$('.bulletin').fadeIn(0);
									$('.bulletin .frost-pane').fadeOut(500);
										$('#subhead-noaa').fadeOut(500, function() {
											$('.bulletin').fadeOut(0);
											if (severemode == true) {
												showRadarS(dataMan.locations[0].lat, dataMan.locations[0].long, 8, 60000)
											} else {
												$('#minimap-cover').fadeOut(0)
												$('#info-slides-header .hscroller').empty();
												$('#marqueeSevere').fadeOut(0)
												$('.marqueeheadersevere').fadeOut(0)
												$('#arrow-img').fadeIn(0)
												$('.radar-slide .infosubheader').css('background','linear-gradient(to top, #fffe21 0, #db5a14 100%);')
												buildHeader();
												nextCity();
											}
										});
								}
							}, slideDelay);
						}
					} else {
						if (severemode == true) {
							showRadarS(dataMan.locations[0].lat, dataMan.locations[0].long, 8, 60000)
						} else {
							$('#info-slides-header .hscroller').empty();
							$('#marqueeSevere').fadeOut(0)
							$('.marqueeheadersevere').fadeOut(0)
							$('#arrow-img').fadeIn(0)
							$('.radar-slide .infosubheader').css('background','linear-gradient(to top, #fffe21 0, #db5a14 100%);')
							buildHeader();
							nextCity();
						}
					}
				} else {
					if (severemode == true) {
						showRadarS(dataMan.locations[0].lat, dataMan.locations[0].long, 8, 60000)
					} else {
						$('#info-slides-header .hscroller').empty();
						$('#marqueeSevere').fadeOut(0)
						$('.marqueeheadersevere').fadeOut(0)
						$('#arrow-img').fadeIn(0)
						$('.radar-slide .infosubheader').css('background','linear-gradient(to top, #fffe21 0, #db5a14 100%);')
						buildHeader();
						nextCity();
					}
				}
				}

			} else {
				//non severe
			advanceHeader();

			var city = $('#info-slides-header .city.current');

			// is radar or city?
			if (city[0].dataset.woeid) {
				// show slide deck for the current city
				showCitySlides( dataMan.location(city[0].dataset.woeid), 0 );

			} else {
				if (city[0].classList.contains("radar")) {
					showRadar(dataMan.locations[0].lat, dataMan.locations[0].long, 8, 60000, false);
					setTimeout(nextCity, 60500);
				} else if (city[0].classList.contains("airport")) {
					showAirport(0);
				} else if (city[0].classList.contains("healthh")) {
					showHealth(0);
				}
				// radar
				//showRadar(dataMan.locations[0].lat, dataMan.locations[0].long, 8);

				//setTimeout(function() { weatherAudio.playLocalRadar() }, 2000 );

				// show for how long?
				//setTimeout(nextCity, 60000);

			}
		}
		}



		function showRadar(lat, long, zoom, time, withsat) {

				// fade out info, fade in radar
				weatherAudio.playLocalRadar();
				$('.radar-slide').fadeIn(0);
				$('.radar-content').fadeIn(500);
				weatherMan.mainMap = Radar("radar-1", 3, zoom, lat, long, withsat);
				$('.radar-color-legend').fadeIn(500);
				setTimeout(function() {
					$('.radar-content').fadeOut(500);
					$('.radar-color-legend').fadeOut(500, function() {
						$('.radar-slide').fadeOut(0);
					});
				}, time);


		}
		function showAirport(idx) {
			var currentDisplay,
				displays = {
					intro() {
							$('.airport-slide-intro').fadeIn(0);
							$('.airport-slide-intro .accent').fadeIn(500);
							$('.airport-slide-intro .weatherscanmarquee').fadeIn(500);
							$('.airport-slide-intro .weatherscanmarquee').css('animation', 'marqueeweatherscan 5.5s linear normal forwards')
							setTimeout(function() {
								$('.airport-slide-intro .segment').fadeIn(500);
							}, 1000);
							setTimeout(function() {
								$('.airport-slide-intro .segment').fadeOut(500)
								$('.airport-slide-intro .accent').fadeOut(500);
								$('.airport-slide-intro .weatherscanmarquee').fadeOut(500, function() {
									$('.airport-slide-intro').fadeOut(0);
									wait(0);
								});
							}, 5000);
						}
				,airportconditions() {
					$('.airport-slide').fadeIn(0);
					$('.airportpanel').fadeIn(500);
					setTimeout(function() {
						$('.airportpanel').fadeOut(500, function(){
							$('.airport-slide').fadeOut(0);
							wait(0);
						});
					}, slideDelay);
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
						showAirport(++idx);
					}, duration);
				}
		}
		function showHealth(idx) {
			var currentDisplay,
				displays = {
					intro() {
							$('.health-slide-intro').fadeIn(0);
							$('.health-slide-intro .accent').fadeIn(500);
							$('.health-slide-intro .weatherscanmarquee').fadeIn(500);
							$('.health-slide-intro .weatherscanmarquee').css('animation', 'marqueeweatherscan 5.5s linear normal forwards')
							setTimeout(function() {
								$('.health-slide-intro .segment').fadeIn(500);
							}, 1000);
							setTimeout(function() {
								$('.health-slide-intro .segment').fadeOut(500)
								$('.health-slide-intro .accent').fadeOut(500);
								$('.health-slide-intro .weatherscanmarquee').fadeOut(500, function() {
									$('.health-slide-intro').fadeOut(0);
									wait(0);
								});
							}, 5000);
						}
				,healthforecast() {
					var healthforecastdata = dataMan.locations[0].forecasts("daily")
					var starthidx = 0;
					var starthidxdayonly = 0;
					if (healthforecastdata.daypart[0].daypartName[0] == undefined) {
						starthidx = 2;
						starthidxdayonly = 1;
					}
					if (starthidx == 0 && dateFns.getHours(new Date()) >= 4) {
						$('.info-slide-content.health-forecast .mainforecast .hightext').css("right","85px");
						$('.info-slide-content.health-forecast .mainforecast .hightext').css("top","220px");
						$('.info-slide-content.health-forecast .mainforecast .high').css("left","91px");
						$('.info-slide-content.health-forecast .mainforecast .high').css("top","265px");
						$('.info-slide-content.health-forecast .mainforecast .lowtext').fadeOut(0)
						$('.info-slide-content.health-forecast .mainforecast .low').fadeOut(0)
					}
					$('.info-slide-content.health-forecast .thing').text("Forecast for " + healthforecastdata.dayOfWeek[starthidxdayonly])
					$('.info-slide-content.health-forecast .mainforecast .hightext').text(healthforecastdata.temperatureMax[starthidxdayonly])
					$('.info-slide-content.health-forecast .mainforecast .lowtext').text(healthforecastdata.temperatureMin[starthidxdayonly])
					$('.info-slide-content.health-forecast .forecastdetails .chancepreciptext').text(healthforecastdata.daypart[0].precipChance[starthidx] + '%')
					$('.info-slide-content.health-forecast .forecastdetails .humidtext').text(healthforecastdata.daypart[0].relativeHumidity[starthidx] + '%')
					$('.info-slide-content.health-forecast .forecastdetails .windtext').text(((healthforecastdata.daypart[0].windDirectionCardinal[starthidx] == "CALM") ? 'calm' :  healthforecastdata.daypart[0].windDirectionCardinal[starthidx]) + ' ' + ((healthforecastdata.daypart[0].windSpeed[starthidx] === 0) ? '' : healthforecastdata.daypart[0].windSpeed[starthidx]))
					$('.info-slide-content.health-forecast .mainforecast .icon').css('background-image', 'url("' + getCCicon(+healthforecastdata.daypart[0].iconCode[starthidx], healthforecastdata.daypart[0].windSpeed[starthidx]) + '")');
					$('.info-slide.health #subhead-title').text('Outdoor Activity');
					$('.info-slide.health #subhead-city').text(dataMan.locations[0].city);
					$('.info-slide.health').fadeIn(0);
					$('.info-slide-content.health-forecast').fadeIn(500);
					setTimeout(function() {
						$('.info-slide-content.health-forecast').fadeOut(500, function(){
							wait(0);
						});
					}, slideDelay);
				}
				,pollen() {
					var pollendata = dataMan.locations[0].forecasts("pollen");
					if (pollendata.pollenobservations !== undefined) {
					if (pollendata.pollenobservations[0].stn_cmnt != "No Report" && pollendata.pollenobservations[0].stn_cmnt != "Equipment Failure" && pollendata.pollenobservations[0].stn_cmnt != "Reports only during weed pollen season" && pollendata.pollenobservations[0].stn_cmnt != "Does not report year round" && pollendata.pollenobservations[0].stn_cmnt != "Reports Suspended") {
					if (pollendata.pollenobservations[0].total_pollen_cnt <= 9) {
						$('.info-slide-content.allergy .totalpollen .desc').text('Low')
					} else if (pollendata.pollenobservations[0].total_pollen_cnt >= 10 && pollendata.pollenobservations[0].total_pollen_cnt <= 49) {
						$('.info-slide-content.allergy .totalpollen .desc').text('Moderate')
					} else if (pollendata.pollenobservations[0].total_pollen_cnt >= 50 && pollendata.pollenobservations[0].total_pollen_cnt <= 499) {
						$('.info-slide-content.allergy .totalpollen .desc').text('High')
					} else if (pollendata.pollenobservations[0].total_pollen_cnt >= 500) {
						$('.info-slide-content.allergy .totalpollen .desc').text('Very High')
					};
					$('.info-slide-content.allergy .pollen .pollenbar.tree .type').html('Tree Pollen <br>' + ((pollendata.pollenobservations[0].treenames[0].tree_nm != "No Report") ? pollendata.pollenobservations[0].treenames[0].tree_nm : ""))
					$('.info-slide-content.allergy .pollen .thing').text("As of " + dateFns.format(new Date(pollendata.pollenobservations[0].rpt_dt), "MMMM D"))
					$('.info-slide-content.allergy .totalpollen .cat').text(pollendata.pollenobservations[0].total_pollen_cnt)
					$('.info-slide.health #subhead-title').text('Allergy Report');
					$('.info-slide-content.allergy').fadeIn(500);
					setTimeout(function () {
						i = 0
						var pollentypes = ['tree', 'grass', 'weed', 'mold'];
						pollentypes.forEach(pollentype => {
							var plength = {"0":"-10", "1":"55", "2":"115", "3":"175", "4":"235", "5":"295", "9":"-10"}[pollendata.pollenobservations[0].pollenobservation[i].pollen_idx]
							var ptime = {"0":0, "1":500, "2":1000, "3":1500, "4":2000, "5":2500, "9":0}[pollendata.pollenobservations[0].pollenobservation[i].pollen_idx]
							$('.info-slide-content.allergy .pollen .pollenbar.' + pollentype + ' .bar .bararrow').animate({left: plength + "px"}, ptime)
						});
					}, 500)
					setTimeout(function() {
						$('.info-slide-content.allergy').fadeOut(500, function(){
							wait(0);
						});
					}, slideDelay);
				} else {wait(0)}
			} else {wait(0)}
				}
				,achesbreath() {
					achesindexdata = dataMan.locations[0].forecasts("achesindex");
					breathindexdata = dataMan.locations[0].forecasts("breathindex");
					var startidx = 0;
					if (achesindexdata.achesPainsIndex12hour.dayInd[0] == 'N') {
						startidx = 1;
					}
					var alength = {"0":"-10", "1":"22", "2":"55", "3":"88", "4":"121", "5":"154", "6":"187", "7":"220", "8":"253", "9":"286", "10":"-300"}[achesindexdata.achesPainsIndex12hour.achesPainsIndex[startidx]]
					var atime = {"0":0, "1":250, "2":500, "3":750, "4":1000, "5":1250, "6":1500, "7":1750, "8":2000, "9":2250, "10":2500}[achesindexdata.achesPainsIndex12hour.achesPainsIndex[startidx]]
					var blength = {"10":"-10", "9":"22", "8":"55", "7":"88", "6":"121", "5":"154", "5":"187", "4":"220", "3":"253", "2":"286", "1":"-300"}[breathindexdata.breathingIndex12hour.breathingIndex[startidx]]
					var btime = {"10":0, "9":250, "8":500, "7":750, "6":1000, "5":1250, "4":1500, "3":1750, "2":2000, "1":2250, "10":2500}[breathindexdata.breathingIndex12hour.breathingIndex[startidx]]
					$('.info-slide-content.Aches-Breath .thing').text(dateFns.format(new Date(achesindexdata.achesPainsIndex12hour.fcstValidLocal[0]), "dddd"))
					$('.info-slide.health #subhead-title').text('Health Forecast');
					$('.info-slide-content.Aches-Breath').fadeIn(500);
					setTimeout(function () {
						$('.info-slide-content.Aches-Breath .aches .bar .bararrow').animate({left: alength + "px"}, atime, 'linear', function() {
							$('.info-slide-content.Aches-Breath .aches .bar .bararrow .bararrowtext').text(achesindexdata.achesPainsIndex12hour.achesPainsCategory[startidx]);
							$('.info-slide-content.Aches-Breath .aches .bar .bararrow .bararrowtext').fadeIn(500);

						})
						$('.info-slide-content.Aches-Breath .breath .bar .bararrow').animate({left: blength + "px"}, btime, 'linear' ,function() {
							$('.info-slide-content.Aches-Breath .breath .bar .bararrow .bararrowtext').text(breathindexdata.breathingIndex12hour.breathingCategory[0]);
							$('.info-slide-content.Aches-Breath .breath .bar .bararrow .bararrowtext').fadeIn(500);

						})
					}, 500);
					setTimeout(function() {
						$('.info-slide-content.Aches-Breath').fadeOut(500, function(){
							wait(0);
						});
					}, slideDelay);
				}
				,airquality() {
					var foreDataAlert = dataMan.locations[0].forecasts('alert');
					var airqualitydata = dataMan.locations[0].forecasts('airquality');
					var ozone = false;

					if (foreDataAlert !== undefined){
						for (var i=0; i<foreDataAlert.alerts.length; i += 1) {
							warning = foreDataAlert.alerts[i].eventDescription;
							if (warning == "Ozone Action Day")  {
								ozone = true;
							}
						};
						if (ozone == true) {
							$('.info-slide-content.airquality .primarypolute .ozoneaction').fadeIn(0)
						}
					}
					var aqlength = {1:"35", 2:"107.5", 3:"185", 4:"260", 5:"340"}[airqualitydata.globalairquality.airQualityCategoryIndex]
					var aqcat = {1:"green", 2:"yellow", 3:"orange", 4:"deep orange", 5:"red"}[airqualitydata.globalairquality.airQualityCategoryIndex]
					var aqtime = {1:0, 2:500, 3:1000, 4:1500, 5:2000}[airqualitydata.globalairquality.airQualityCategoryIndex]
					if (airqualitydata.globalairquality.primaryPollutant == "PM2.5" || airqualitydata.globalairquality.primaryPollutant == "PM10") {
						$('.info-slide-content.airquality .primarypolute .pollutant').text('Fine Particulate')
					} else {$('.info-slide-content.airquality .primarypolute .pollutant').text(airqualitydata.globalairquality.primaryPollutant)};

					$('.info-slide.health #subhead-title').text('Air Quality Forecast');
					$('.info-slide-content.airquality .airforecast .thing').text(dateFns.format(new Date(airqualitydata.globalairquality.expireTimeGmt * 1000), "dddd"))

					$('.info-slide-content.airquality').fadeIn(500);
					setTimeout(function() {
					$('.info-slide-content.airquality .airforecast .bar .arrow').animate({bottom: aqlength + "px"}, aqtime, 'linear', function() {
						$('.info-slide-content.airquality .airforecast .bar .' + aqcat + ' .forecast').fadeIn(500)
					})
					}, 500);
					setTimeout(function() {
						$('.info-slide-content.airquality').fadeOut(500, function(){
							wait(0);
						});
					}, slideDelay);
				}
				,uvindex() {
					var foreUvData = dataMan.locations[0].forecasts('forecastuvindex');
					var uvData = dataMan.locations[0].forecasts('uvindex');
					var indexes = calcHourlyReport(foreUvData.uvIndex1hour);
					var i;
					$('.info-slide-content.uvindex .uvtime.i .uvtime').text(buildHourlyTimeTitle(foreUvData.uvIndex1hour.fcstValidLocal[indexes[0]]));
					$('.info-slide-content.uvindex .uvtime.ii .uvtime').text(buildHourlyTimeTitle(foreUvData.uvIndex1hour.fcstValidLocal[indexes[1]]));
					$('.info-slide-content.uvindex .uvtime.iii .uvtime').text(buildHourlyTimeTitle(foreUvData.uvIndex1hour.fcstValidLocal[indexes[2]]));
					$('.info-slide-content.uvindex .uvtime.i .uvday').text(dateFns.format(new Date(foreUvData.uvIndex1hour.fcstValidLocal[indexes[0]]), 'ddd'));
					$('.info-slide-content.uvindex .uvtime.ii .uvday').text(dateFns.format(new Date(foreUvData.uvIndex1hour.fcstValidLocal[indexes[1]]), 'ddd'));
					$('.info-slide-content.uvindex .uvtime.iii .uvday').text(dateFns.format(new Date(foreUvData.uvIndex1hour.fcstValidLocal[indexes[2]]), 'ddd'));
					$('.info-slide.health #subhead-title').text('Ultraviolet Index');
					$('.info-slide-content.uvindex').fadeIn(500);
					//get reporting hours: 6am, 12pm, 3pm
					function buildHourlyTimeTitle(time){
						var hour=dateFns.getHours(time);
						return (dateFns.format(time,'h a')).replace(" ", "");
					}
					function calcHourlyReport(data) {
						var hret = [],
							targets = [9, 12, 15],   // hours that we report
							current = dateFns.getHours(new Date()),
							now = new Date(),
							//firsthour = targets[ getNextHighestIndex(targets, current) ],
							start,
							hour, i=0;

						switch (true) {
							case (current < 6):
								start = 9;
							case (current < 9):
								start = 12; break;
							case (current < 12):
								start = 15; break;
							case (current < 13):
								start = 9; break;
							default:
								start = 9;
						}
						while(hret.length<3){

							// hour must be equal or greater than current
							hour = dateFns.getHours(data.fcstValidLocal[i] );
							if ( dateFns.isAfter(data.fcstValidLocal[i], now) && (hour==start || hret.length>0) )  {

								if ( targets.indexOf(hour)>=0 ) { // it is in our target list so record its index
									hret.push(i);
								}

							}
							i++;
						}
						return hret;
					}
						var hourlable = ['i', 'ii', 'iii'],
						uvi, value, i = 0;
						var ulength = {"-2":"25", "-1":"25", 0:"25", 1:"25", 2:"40", 3:"55", 4:"70", 5:"85", 6:"100", 7:"115", 8:"130", 9:"145", 10:"160", 11:"175"}[uvData.uvIndexCurrent.uvIndex]
						var utime = {"-2":0, "-1":0, 0:0, 1:125, 2:250, 3:375, 4:500, 5:625, 6:750, 7:1000, 8:1250, 9:1325, 10:1500, 11:1625}[uvData.uvIndexCurrent.uvIndex]
						$('.info-slide-content.uvindex .currentuv .bar .cat').text(uvData.uvIndexCurrent.uvDesc)
						$('.info-slide-content.uvindex .currentuv .bar .num').text(uvData.uvIndexCurrent.uvIndex)
						if (uvData.uvIndexCurrent.uvIndex == "0" || uvData.uvIndexCurrent.uvIndex == "-1" || uvData.uvIndexCurrent.uvIndex == "-2") {
							$('.info-slide-content.uvindex .currentuv .bar').css("background", "rgba(0,0,0,0)")
						}
						$('.info-slide-content.uvindex .currentuv .bar').animate({height:ulength+"px"}, utime,function(){
							$('.info-slide-content.uvindex .currentuv .bar .cat').fadeTo('slow', 1);
							$('.info-slide-content.uvindex .currentuv .bar .num').fadeTo('slow', 1);
						});
					$('.info-slide-content.uvindex .forecastuv .bar').each(function(){
						var ulength = {"-2":0, "-1":0, 0:"25", 1:"25", 2:"40", 3:"55", 4:"70", 5:"85", 6:"100", 7:"115", 8:"130", 9:"145", 10:"160", 11:"175"}[foreUvData.uvIndex1hour.uvIndex[indexes[i]]]
						var utime = {"-2":0, "-1":0, 0:0, 1:125, 2:250, 3:375, 4:500, 5:625, 6:750, 7:1000, 8:1250, 9:1325, 10:1500, 11:1625}[foreUvData.uvIndex1hour.uvIndex[indexes[i]]]
						$('.info-slide-content.uvindex .forecastuv .bar.' + hourlable[i] + ' .cat').text(foreUvData.uvIndex1hour.uvDesc[indexes[i]])
						$('.info-slide-content.uvindex .forecastuv .bar.' + hourlable[i] + ' .num').text(foreUvData.uvIndex1hour.uvIndex[indexes[i]])
						if (foreUvData.uvIndex1hour.uvIndex[indexes[i]] == "0" || foreUvData.uvIndex1hour.uvIndex[indexes[i]] == "-1" || foreUvData.uvIndex1hour.uvIndex[indexes[i]] == "-2") {
							$('.info-slide-content.uvindex .currentuv .bar.' + hourlable[i]).css("background", "rgba(0,0,0,0)")
						}
						$('.info-slide-content.uvindex .forecastuv .bar.' + hourlable[i]).animate({height:ulength+"px"}, utime,function(){
							$('.info-slide-content.uvindex .forecastuv .bar .cat').fadeTo('slow', 1);
							$('.info-slide-content.uvindex .forecastuv .bar .num').fadeTo('slow', 1);
						});
						i = i + 1
					})
					setTimeout(function() {
						$('.info-slide-content.uvindex').fadeOut(500, function(){
							wait(0);
						});
					}, slideDelay);
				}
				,healthtip() {
					$('.info-slide.health #subhead-title').text('Weather Safety Tips');
					$('.info-slide-content.healthtip').fadeIn(500);
					setTimeout(function() {
						$('.info-slide-content.healthtip').fadeOut(500, function(){
							wait(0);
						});
					}, slideDelay);
				}
				,moreinfoimage() {
					$('.info-slide.health #subhead-title').text('');
					$('.info-slide-content.moreinfoimage').fadeIn(500);
					setTimeout(function() {
						$('.info-slide-content.moreinfoimage').fadeOut(500, function(){
							$('.info-slide.health').fadeOut(0);
							wait(0);
						});
					}, slideDelay);
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
						showHealth(++idx);
					}, duration);
				}
		}


		// show the set of slides for one city
		function showCitySlides(location, idx) {

			var currentDisplay,
				displays = {
					intro() {
						$('.city-slide-intro .segment').text(location.city);
						$('.city-slide-intro').fadeIn(0);
						$('.city-slide-intro .weatherscancopyright').fadeIn(500);
						$('.city-slide-intro .cityaccent').fadeIn(500);
						$('.city-slide-intro .cityweatherscanmarquee').fadeIn(500);
						setTimeout(function() {
							$('.city-slide-intro .segment').fadeIn(500);
						}, 1000);
						setTimeout(function() {
							$('.city-slide-intro .weatherscancopyright .copyrighttext').fadeOut(500, function(){
								$('.city-slide-intro .weatherscancopyright .copyrighttext').css('font-size','10px')
								$('.city-slide-intro .weatherscancopyright .copyrighttext').text("© 2021 Weather Group Television LLC All Rights Reserved")
							});
							$('.city-slide-intro .weatherscancopyright .copyrighttext').fadeIn(500);
						}, 5000);
						setTimeout(function() {
							$('.city-slide-intro .segment').fadeOut(500)
							$('.city-slide-intro .weatherscancopyright').fadeOut(500);
							$('.city-slide-intro .accent').fadeOut(500);
							$('.city-slide-intro .cityweatherscanmarquee').fadeOut(500, function() {
								$('.city-slide-intro').fadeOut(0);
								$('.city-slide-intro .weatherscancopyright .copyrighttext').css('font-size','28px')
								$('.city-slide-intro .weatherscancopyright .copyrighttext').text("Weatherscan is brought to you by The Weather Channel® and MIDCO")
								wait(0);
							});
						}, 10000);
				}
				,showBulletin() {

					var pages = [""];
					if (foreDataAlert !== undefined){
						$('.bulletin .frost-pane .warnings').empty()
						var displayday;
						//info
						//get only weather alers


						if (ret.length != 0) {

						for (i of ret) {
							getexpiredate = function(expiretime) {
								dateFns.format(new Date(expiretime), "h:mm");
								if (dateFns.isToday(expiretime) != true) {
									var numday = dateFns.getDay(expiretime);
									displayday = {"0":"SUN","1":"MON","2":"TUE","3":"WED","4":"THU","5":"FRI","6":"SAT"}[numday] + ".";
								} else {
									displayday = "Today."
								}
								return dateFns.format(new Date(expiretime), "h:mm A ") + displayday
							}
							if (i != ret.length - 1) {
								$('.bulletin .frost-pane .warnings').append(foreDataAlert.alerts[i].eventDescription + " in effect until " + getexpiredate(foreDataAlert.alerts[ret[i]].expireTimeLocal) + "\n \n")
							} else {
								$('.bulletin .frost-pane .warnings').append(foreDataAlert.alerts[i].eventDescription + " in effect until " + getexpiredate(foreDataAlert.alerts[ret[i]].expireTimeLocal) + "\n \n")
							}

						}

						function splitLines() {

							 var warningsplitstr = $('.bulletin .frost-pane .warnings').text().split(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g)
							 warningsplitstr.pop()
							 warningsplitstr.pop()
							 var warningpageidx = 0;
							 var warninglineidx = 0;
							 console.log(pages)
							 console.log(warningsplitstr)
							 warningsplitstr.forEach(warningline => {
								if (warningline != "") {
									if (warninglineidx == 0) {
										pages[warningpageidx] = ""
									}
								 console.log(warningline)
								pages[warningpageidx] += (warningline + '<br>')
								warninglineidx += 1;
								if (warninglineidx == 7) {
									warningpageidx += 1
									warninglineidx = 0
								}
							}
						});
							//$('.bulletin .frost-pane .warnings').text($('.bulletin .frost-pane .warnings').text().replace(/(?![^\n]{1,40}$)([^\n]{1,40})\s/g, '$1\n'))
							 //console.log($('.bulletin .frost-pane .warnings').html())
							 makewarningPage(0)
						}
						splitLines()
						$('.bulletin .frost-pane .cityname').text(location.city + " Area");
						//fade in
						$('.bulletin').fadeIn(0);
						$('.bulletin .frost-pane').fadeIn(500);

						$('#subhead-noaa').fadeIn(500);
						function makewarningPage(warningpagenum) {
							if (warningpagenum > 0) {
								$('.bulletin .frost-pane').fadeOut(500, function() {
									$('.bulletin .frost-pane .warnings').html(pages[warningpagenum])
									$('.bulletin .frost-pane').fadeIn(500);
								});
							} else {
								$('.bulletin .frost-pane .warnings').html(pages[warningpagenum])
								$('.bulletin .frost-pane').fadeIn(500);
							}
							setTimeout(function() {
								if (warningpagenum < (pages.length - 1)) {
									makewarningPage(warningpagenum + 1)
								} else {
									$('.bulletin').fadeIn(0);
									$('.bulletin .frost-pane').fadeOut(500);
									$('#subhead-noaa').fadeOut(500, function() {
										$('.bulletin').fadeOut(0);
										wait(0)
									});
								}
							}, slideDelay);
						}
					} else {wait(0)}
				} else {wait(0)};
				}

				// Currently (10 sec)
				,currentConditions() {
					$('.city-info-slide #subhead-title').text('Currently');
					$('.city-info-slide #subhead-city').text(location.city);
					var obsData = location.observations,
						strLabels =	'Humidity<br>Dew Point<br>Pressure<Br>Wind<br>',
						strData = obsData(0).relativeHumidity + '%<br>' + obsData(0).temperatureDewPoint + '<br>' + obsData(0).pressureAltimeter + ((obsData(0).pressureTendencyCode === 1 || obsData(0).pressureTendencyCode === 3) ? '↑' : (obsData(0).pressureTendencyCode === 2 || obsData(0).pressureTendencyCode === 4) ? '↓' : ' S') + '<br>' + ((obsData(0).windDirectionCardinal == "CALM") ? 'calm' :  obsData(0).windDirectionCardinal) + ' ' + ((obsData(0).windSpeed === 0) ? '' : obsData(0).windSpeed) + '<br>';
					if (obsData(0).windGust!=undefined) {
						strLabels+='Gusts<Br>';
						strData+=obsData(0).windGust +	'<br>';
					} else {
						strLabels+='Gusts<Br>';
						strData+='none<br>';
					}
					if (parseInt(obsData(0).temperature)<70 && parseInt(obsData(0).windSpeed)>=3) {
						var windchill =	Math.round(35.74 + 0.6215 * parseInt(obsData(0).temperature) - 35.75 * Math.pow(parseInt(obsData(0).windSpeed),0.16) + 0.4275 * parseInt(obsData(0).temperature) * Math.pow(parseInt(obsData(0).windSpeed),0.16) -1)
						strLabels+='Wind Chill';
						strData+= windchill;
					} else if (parseInt(obsData(0).temperature)>=80 && parseInt(obsData(0).relativeHumidity)>=40 ){

						strLabels+='Heat Index';
						var heatindexx = heatIndex(obsData(0).temperature, obsData(0).relativeHumidity) + '&deg;';
						strData+=heatindexx
					};

					$('.city-info .frost-pane .labels').html(strLabels);
					$('.city-info .frost-pane .data').html(strData);

					// right pane
					$('.city-info .icon').css('background-image', 'url("' + getCCicon(+obsData(0).iconCode, obsData(0).windSpeed) + '")');
					//$('.info-slide-content.airport .frost-pane.right .icon').css('background-image', 'url("' + getCCicon(+obsData(0).iconCode, obsData(0).current.wind_speed) + '")');
					$('.city-info .conditions').text(obsData(0).wxPhraseLong);
					$('.city-info .temp').text( Math.round(parseInt(obsData(0).temperature)) );
					weatherAudio.playCurrentConditions();

					//fadein
					$('.city-info-slide').fadeIn(0);
					$('.city-info').fadeIn(500);
					//fadeout and switch
					setTimeout(function() {
						$('.city-info').fadeOut(500, function(){
							$('.city-info-slide').fadeOut(0);
							wait(0);
					});
					}, slideDelay);

				}
				// Local Doppler Radar or Radar/Satellite (15 sec, zoomed out with cloud cover)
				,localDoppler(){
					var showsat = Math.random()
					if (showsat <=  .5) {
						showRadar(location.lat, location.long, 6, slideDelay, true);
					} else {
						showRadar(location.lat, location.long, 8, slideDelay, false);
					}
					wait(slideDelay + 500);
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
						$('.info-slide-content.daypart .hour.i .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly.validTimeLocal[indexes[0]]));
						$('.info-slide-content.daypart .hour.ii .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly.validTimeLocal[indexes[1]]));
						$('.info-slide-content.daypart .hour.iii .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly.validTimeLocal[indexes[2]]));
						$('.info-slide-content.daypart .hour.iv .thing .thingtext').text(buildHourlyTimeTitle(foreDataHourly.validTimeLocal[indexes[3]]));
						for (var i of indexes) {
							temps.push(foreDataHourly.temperature[i]);
						}

						$('.info-slide-content.daypart .hour.i .tempbar .temp').text(foreDataHourly.temperature[indexes[0]]);
						$('.info-slide-content.daypart .hour.ii .tempbar .temp').text(foreDataHourly.temperature[indexes[1]]);
						$('.info-slide-content.daypart .hour.iii .tempbar .temp').text(foreDataHourly.temperature[indexes[2]]);
						$('.info-slide-content.daypart .hour.iv .tempbar .temp').text(foreDataHourly.temperature[indexes[3]]);

						$('.info-slide-content.daypart .hour.i .tempbar .wind').text(foreDataHourly.windDirectionCardinal[indexes[0]] + ' ' + foreDataHourly.windSpeed[indexes[0]]);
						$('.info-slide-content.daypart .hour.ii .tempbar .wind').text(foreDataHourly.windDirectionCardinal[indexes[1]] + ' ' + foreDataHourly.windSpeed[indexes[1]]);
						$('.info-slide-content.daypart .hour.iii .tempbar .wind').text(foreDataHourly.windDirectionCardinal[indexes[2]] + ' ' + foreDataHourly.windSpeed[indexes[2]]);
						$('.info-slide-content.daypart .hour.iv .tempbar .wind').text(foreDataHourly.windDirectionCardinal[indexes[3]] + ' ' + foreDataHourly.windSpeed[indexes[3]]);

						$('.info-slide-content.daypart .hour.i .condition').text((foreDataHourly.wxPhraseShort[indexes[0]]).replace('M ', 'Mostly ').replace('P ','Partly '));
						$('.info-slide-content.daypart .hour.ii .condition').text((foreDataHourly.wxPhraseShort[indexes[1]]).replace('M ', 'Mostly ').replace('P ','Partly '));
						$('.info-slide-content.daypart .hour.iii .condition').text((foreDataHourly.wxPhraseShort[indexes[2]]).replace('M ', 'Mostly ').replace('P ','Partly '));
						$('.info-slide-content.daypart .hour.iv .condition').text((foreDataHourly.wxPhraseShort[indexes[3]]).replace('M ', 'Mostly ').replace('P ','Partly '));

						$('.info-slide-content.daypart .hour.i .icon').css('background-image', 'url("' + getCCicon(+foreDataHourly.iconCode[indexes[0]], foreDataHourly.windSpeed[indexes[0]]) + '")');
						$('.info-slide-content.daypart .hour.ii .icon').css('background-image', 'url("' + getCCicon(+foreDataHourly.iconCode[indexes[1]], foreDataHourly.windSpeed[indexes[1]]) + '")');
						$('.info-slide-content.daypart .hour.iii .icon').css('background-image', 'url("' + getCCicon(+foreDataHourly.iconCode[indexes[2]], foreDataHourly.windSpeed[indexes[2]]) + '")');
						$('.info-slide-content.daypart .hour.iv .icon').css('background-image', 'url("' + getCCicon(+foreDataHourly.iconCode[indexes[3]], foreDataHourly.windSpeed[indexes[3]]) + '")');

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
								hour = dateFns.getHours(data.validTimeLocal[i] );
								if ( dateFns.isAfter(data.validTimeLocal[i], now) && (hour==start || ret.length>0) )  {

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
						$('.city-info-slide #subhead-title').text(buildHourlyHeaderTitle(foreDataHourly.validTimeLocal[indexes[0]]));
						var min = Math.min(...temps),  // 54
							max = Math.max(...temps),  // 73
							range = (max-min),
							prange = (100-78), // percent range for bar height
							hourlable = ['i', 'ii', 'iii', 'iv'],
							temp, value, i = 0;
						$('.info-slide-content.daypart .hour').each(function(){
							temp = foreDataHourly.temperature[indexes[i]]
							value = ((temp-min)/range) * prange + 78; // find percentage of range and translate to percent and add that to the starting css % height number
							valueii = (value/100) * 165 // multiply percentage by max height
							$('.info-slide-content.daypart .hour.' + hourlable[i] + ' .tempbar').animate({height:valueii+"px"}, 1500,function(){
								$('.info-slide-content.daypart .hour .tempbar .temp').fadeTo('slow', 1);
								$('.info-slide-content.daypart .hour .tempbar .wind').fadeTo('slow', 1);
							});
							i = i + 1
						})
						//play narration
						weatherAudio.playLocalforecastii();
						//fade in
						$('.city-info-slide').fadeIn(0);
						$('.info-slide-content.daypart').fadeIn(500);
						//for calculating when to show daypart
						selectval = selectval + 1
						//fadeout
						setTimeout(function() {
							$('.info-slide-content.daypart').fadeOut(500, function() {
								wait(0)
							});
						}, slideDelay);

					} else {
						// Local Forecast -Today (10 sec)
							var div = '.info-slide-content.forecast ',
								forecasts = dataMan.locations[0].forecasts('daily');
								var correct = 0;

							function fillinfo() {

								fidx = (fidx===undefined ? 0 : fidx);

								if (forecasts.daypart[0].daypartName[0] == null) {
									correct = 1;
									fidx = (fidx===0 ? 1 : fidx);
								}

								$('.city-info-slide #subhead-title').text('Local Forecast');
								//replace tomorrow

								$(div + '.title').text(forecasts.daypart[0].daypartName[fidx].replace('Tomorrow', forecasts.dayOfWeek[1]));

								// content
								resizeText(forecasts.daypart[0].narrative[fidx] + ((forecasts.daypart[0].qualifierPhrase[fidx] != null && forecasts.daypart[0].narrative[fidx].includes(forecasts.daypart[0].qualifierPhrase[fidx]) === false) ? forecasts.daypart[0].qualifierPhrase[fidx] : '') + ((forecasts.daypart[0].windPhrase[fidx] != null && forecasts.daypart[0].narrative[fidx].includes(forecasts.daypart[0].windPhrase[fidx]) === false) ? forecasts.daypart[0].windPhrase[fidx] : ''));
								$(div + '.content').text(forecasts.daypart[0].narrative[fidx] + ((forecasts.daypart[0].qualifierPhrase[fidx] != null && forecasts.daypart[0].narrative[fidx].includes(forecasts.daypart[0].qualifierPhrase[fidx]) === false) ? forecasts.daypart[0].qualifierPhrase[fidx] : '') + ((forecasts.daypart[0].windPhrase[fidx] != null && forecasts.daypart[0].narrative[fidx].includes(forecasts.daypart[0].windPhrase[fidx]) === false) ? forecasts.daypart[0].windPhrase[fidx] : ''));

							}
						if (fidx === 0) {
							weatherAudio.playLocalforecasti();
						}

						$('.city-info-slide').fadeIn(0);
						fillinfo();
						$('.info-slide-content.forecast').fadeIn(500);

							setTimeout( function() {

								if (fidx<3 + correct) {
									$('.info-slide-content.forecast').fadeOut(500, function() {
										currentDisplay(fidx+1);
										fillinfo();
									});
								} else {
									$('.info-slide-content.forecast').fadeOut(500, function() {
										selectval = selectval + 1
										if (selectval === 4) {selectval = 0}
										wait(0);
									});
								}

							}, slideDelay)
					}
				}



				// Extended Forecast(5 day columns)
				,extendedForecast() {
					$('.city-info-slide #subhead-title').text('Extended Forecast');

					var foreDataDaily = dataMan.locations[0].forecasts('daily');
					var icons, weekend,
					startidx = 0,
					startidxdayonly = 0;
					if (foreDataDaily.daypart[0].daypartName[0] == null) {
						startidx = 2;
						startidxdayonly = 1;
					}

					//days
					$('.info-slide-content.extended-forecast .frost-pane.iw .thing').text(foreDataDaily.dayOfWeek[startidxdayonly].substring(0,3))
					$('.info-slide-content.extended-forecast .frost-pane.iiw .thing').text(foreDataDaily.dayOfWeek[startidxdayonly + 1].substring(0,3))
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .thing').text(foreDataDaily.dayOfWeek[startidxdayonly + 2].substring(0,3))
					$('.info-slide-content.extended-forecast .frost-pane.ivw .thing').text(foreDataDaily.dayOfWeek[startidxdayonly + 3].substring(0,3))
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .thing .thingtext').text(foreDataDaily.dayOfWeek[startidxdayonly + 4].substring(0,3))

					//icons
					$('.info-slide-content.extended-forecast .frost-pane.iw .icon').css('background-image', 'url("' + getCCicon(+foreDataDaily.daypart[0].iconCode[startidx], foreDataDaily.daypart[0].windSpeed[startidx]) + '")');
					$('.info-slide-content.extended-forecast .frost-pane.iiw .icon').css('background-image', 'url("' + getCCicon(+foreDataDaily.daypart[0].iconCode[startidx + 2], foreDataDaily.daypart[0].windSpeed[startidx + 2]) + '")');
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .icon').css('background-image', 'url("' + getCCicon(+foreDataDaily.daypart[0].iconCode[startidx + 4], foreDataDaily.daypart[0].windSpeed[startidx + 4]) + '")');
					$('.info-slide-content.extended-forecast .frost-pane.ivw .icon').css('background-image', 'url("' + getCCicon(+foreDataDaily.daypart[0].iconCode[startidx + 6], foreDataDaily.daypart[0].windSpeed[startidx + 6]) + '")');
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .icon').css('background-image', 'url("' + getCCicon(+foreDataDaily.daypart[0].iconCode[startidx + 8], foreDataDaily.daypart[0].windSpeed[startidx + 8]) + '")');

					//conditions
					$('.info-slide-content.extended-forecast .frost-pane.iw .conditions').text((foreDataDaily.daypart[0].wxPhraseShort[startidx]).replace('M ', 'Mostly ').replace('P ','Partly '));
					$('.info-slide-content.extended-forecast .frost-pane.iiw .conditions').text((foreDataDaily.daypart[0].wxPhraseShort[startidx + 2]).replace('M ', 'Mostly ').replace('P ','Partly '));
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .conditions').text((foreDataDaily.daypart[0].wxPhraseShort[startidx + 4]).replace('M ', 'Mostly ').replace('P ','Partly '));
					$('.info-slide-content.extended-forecast .frost-pane.ivw .conditions').text((foreDataDaily.daypart[0].wxPhraseShort[startidx + 6]).replace('M ', 'Mostly ').replace('P ','Partly '));
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .conditions').text((foreDataDaily.daypart[0].wxPhraseShort[startidx + 8]).replace('M ', 'Mostly ').replace('P ','Partly '));

					//high
					$('.info-slide-content.extended-forecast .frost-pane.iw .temphigh').text(foreDataDaily.temperatureMax[startidxdayonly])
					$('.info-slide-content.extended-forecast .frost-pane.iiw .temphigh').text(foreDataDaily.temperatureMax[startidxdayonly + 1])
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .temphigh').text(foreDataDaily.temperatureMax[startidxdayonly + 2])
					$('.info-slide-content.extended-forecast .frost-pane.ivw .temphigh').text(foreDataDaily.temperatureMax[startidxdayonly + 3])
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .temphigh .temphightext').text(foreDataDaily.temperatureMax[startidxdayonly + 4])

					//low
					$('.info-slide-content.extended-forecast .frost-pane.iw .templow').text(foreDataDaily.temperatureMin[startidxdayonly])
					$('.info-slide-content.extended-forecast .frost-pane.iiw .templow').text(foreDataDaily.temperatureMin[startidxdayonly + 1])
					$('.info-slide-content.extended-forecast .frost-pane.iiiw .templow').text(foreDataDaily.temperatureMin[startidxdayonly + 2])
					$('.info-slide-content.extended-forecast .frost-pane.ivw .templow').text(foreDataDaily.temperatureMin[startidxdayonly + 3])
					$('.info-slide-content.extended-forecast .lfrost-pane.vw .templow').text(foreDataDaily.temperatureMin[startidxdayonly + 4])



					$('.info-slide-content.extended-forecast').fadeIn(500);
					//buildailycalculating when to show daypart
					//fadeout
					setTimeout(function() {
						$('.info-slide-content.extended-forecast').fadeOut(500, function() {
								$('.city-info-slide').fadeOut(0);
							wait(0)
						});
					}, slideDelay);
				}
				,almanac() {
					var obsData = location.observations;
					if (selectval === 1) {
						var foreDataAlmanac = dataMan.locations[0].forecasts('almanac');
						$('.info-slide-content.almanac .frost-pane.half .thing').text(dateFns.format(new Date(),"MMMM D"));
						$('.info-slide-content.almanac .frost-pane.half .ahightext').text(foreDataAlmanac.temperatureAverageMax[0]);
						$('.info-slide-content.almanac .frost-pane.half .alowtext').text(foreDataAlmanac.temperatureAverageMin[0]);
						$('.info-slide-content.almanac .frost-pane.half .rhightext').text(foreDataAlmanac.temperatureRecordMax[0]);
						$('.info-slide-content.almanac .frost-pane.half .rlowtext').text(foreDataAlmanac.temperatureRecordMin[0]);
						$('.info-slide-content.almanac .frost-pane.half .rhighyear').text(foreDataAlmanac.almanacRecordYearMax[0]);
						$('.info-slide-content.almanac .frost-pane.half .rlowyear').text(foreDataAlmanac.almanacRecordYearMin[0]);
						$('.info-slide-content.almanac .frost-pane.purple .sunrisetext').text(dateFns.format(new Date(obsData(0).sunriseTimeLocal),"h:m a"));
						$('.info-slide-content.almanac .frost-pane.purple .sunsettext').text(dateFns.format(new Date(obsData(0).sunsetTimeLocal),"h:m a"));
						$('.city-info-slide #subhead-title').text('Almanac');
						$('.city-info-slide').fadeIn(0);
						$('.info-slide-content.almanac').fadeIn(500);
						setTimeout(function() {
							$('.info-slide-content.almanac').fadeOut(500, function() {
									$('.city-info-slide').fadeOut(0);
								wait(0)
							});
						}, slideDelay);
					} else {
						wait(0)
					};
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
			var s = 52,
				$container = $('.info-slide-content.forecast .content'),
				$test = $('<div style="position:absolute;top:100%;"></div>') .appendTo($container) .css('font-size', s + 'px') .css('line-height', '125%') .html(text);

			// have to display parent so we can get measurements
			$container.closest('.info-slide-content').show();

			$test.width($container.width() );
			while ($test.outerHeight(true) >= (400) ) {
				s -= 1;
				$test.css('font-size', s + 'px');
			}
			$container.closest('.info-slide-content').hide();
			$container .text(text) .css('font-size', s + 'px');
			$test.remove();

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


		function fadeToContent(to, callfirst) {
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
			arrow='<span class="divider-arrow" style="font-family: ZemestroStd ">&lt;</span>',
			radar='<span class="city radar">LOCAL RADAR</span>',
			golf='<span class="city golf">GOLF</span>',
			beach='<span class="city beach">BOAT AND BEACH</span>',
			health='<span class="city healthh">HEALTH</span>',
			airport='<span class="city airport">AIRPORTS</span>';

		for (var location of dataMan.locations) {
		if (location.city !== undefined) {
			city = location.city;
			cities += arrow+'<span class="city" data-woeid="' + location.woeid + '">' + city + '</span>';
		}
		}

		$('#info-slides-header .hscroller').append(cities + arrow + (radar + arrow + airport + arrow + health + cities + arrow).repeat(4));
	}




}  // end function
