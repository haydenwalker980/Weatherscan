var noreportmode = false;
var marqueeforecasttype = 'forecast'
//do audio thing and second marquee
$(function(){
	weatherAudio.playCallback = function(tags) {
		$('.track-info').text('playing "' + tags.title + '" by ' + tags.artist);
	}
	$('#marquee2').text(weatherInfo.ad)
	$('#marquee2').marquee({
		speed: 170, pauseOnHover: true
	});
});
function MarqueeMan() {
	function switchToWarningMarquee(sidx) {
		if (weatherInfo.bulletin.severewarnings.length != 0) {
			$('#marqueeSevere').css("background","linear-gradient(to right, #510d08 0, #b41a08 100%)")
			$('.marqueeheadersevere').css("background","linear-gradient(to right, #d51e08 0, #b41a08 100%)")
			$('.marqueeheadersevere').css("color","#fff")
			$('.marqueeheadersevere').css("text-shadow","2px 2px 4px #000")

			$('.marqueeheadersevere').text((weatherInfo.bulletin.severewarnings[sidx].name).toUpperCase() + ' ' + weatherInfo.bulletin.severewarnings[sidx].status);
			$('#arrow-img').fadeOut(0)
			$('#marqueeSevere').fadeIn(0)
			$('.marqueeheadersevere').fadeIn(0) //#868686
			$('#marqueeSevere').text(weatherInfo.bulletin.severewarnings[sidx].desc)
			$('#marqueeSevere')
				.marquee('destroy')
				.marquee({speed: 170, delayBeforeStart: 1000, pauseOnHover: true, pauseOnCycle: true})
				.on('finished', function(){
					switchSevereMarquee((sidx < weatherInfo.bulletin.severewarnings.length) ? sdix + 1 : 0)
				});
				weatherAudio.playwarningbeep()
		} else if (weatherInfo.bulletin.marqueewarnings.length != 0){
			if (weatherInfo.bulletin.marqueewarnings[0].significance == "Y" ||weatherInfo.bulletin.marqueewarnings[0].significance == "S") {
				$('#marqueeSevere').css('background','linear-gradient(to right, #853302 0, #a84503 100%)')
				$('.marqueeheadersevere').css("background","linear-gradient(to right, #e86d08 0, #a84403 100%)")
				$('.marqueeheadersevere').css("color","#000")
				$('.marqueeheadersevere').css("text-shadow", "0px 0px 0px #000")
			} else if (weatherInfo.bulletin.marqueewarnings[0].significance == "A") {
				$('#marqueeSevere').css("background", "linear-gradient(to right, #846811 0, #9b7d0e 100%)");
				$('.marqueeheadersevere').css('background', 'linear-gradient(to right, #e5dd20 0, #9b7d0e 100%)');
				$('.marqueeheadersevere').css("color", "#000");
				$('.marqueeheadersevere').css("text-shadow", "0px 0px 0px #000");
			}	else if (weatherInfo.bulletin.marqueewarnings[0].significance == "W") {
				$('#marqueeSevere').css("background","linear-gradient(to right, #510d08 0, #b41a08 100%)")
				$('.marqueeheadersevere').css("background","linear-gradient(to right, #d51e08 0, #b41a08 100%)")
				$('.marqueeheadersevere').css("color","#fff")
				$('.marqueeheadersevere').css("text-shadow","2px 2px 4px #000")
			}
			$('.marqueeheadersevere').text((weatherInfo.bulletin.marqueewarnings[0].name).toUpperCase() + ' ' + weatherInfo.bulletin.marqueewarnings[0].status)
			$('#arrow-img').fadeOut(0)
			$('#marqueeSevere').fadeIn(0)
			$('.marqueeheadersevere').fadeIn(0)
			$('#marqueeSevere').text(weatherInfo.bulletin.marqueewarnings[0].desc)
			$('#marqueeSevere')
				.marquee({speed: 170, delayBeforeStart: 1000, pauseOnHover: true, pauseOnCycle: true})
		} else {
			$('#marqueeSevere')
				.marquee('destroy')
			$('#marqueeSevere').fadeOut(0)
			$('.marqueeheadersevere').fadeOut(0)
			$('#arrow-img').fadeIn(0)
		}

	}
		// for ccticker
		function displayCCTickerData() {
			var $span,$spanfor;
			// ajax the latest observation
			$(".marquee-current").remove()
			$(".marquee-fore").remove()
			if (weatherInfo.ccticker.noReport == true) {
				noreportmode = true
				$('#arrow-img').attr("src",'/images/arrow.png');
			} else {noreportmode == false}
			weatherInfo.ccticker.ccLocs.forEach((ccLoc, i) => {
				$span = $("<span class=marquee-current id='" + "cclocation" + i + "'></span>").appendTo('#marquee-now');
				$spanfor = $("<span class=marquee-fore id='" + "cclocation" + i + "'></span>").appendTo('#marquee-now');
				$span.text(ccLoc.displayname + ((noreportmode == true) ? "" : ccLoc.currentCond.temp + ' ' + ccLoc.currentCond.cond));
				$spanfor.css('display','none')
				$spanfor.text(ccLoc.displayname + ((noreportmode == true) ? "" : ccLoc.forecast.temp  + ' ' + ccLoc.forecast.cond));
			});
		};

		function refreshMarquee () {
				if (marqueeforecasttype == 'now') {
					marqueeforecasttype = 'forecast'
					if (noreportmode == false) {
						$('#arrow-img').attr("src",'/images/' + weatherInfo.ccticker.arrow + 'arrow.png');
					}
					$('.marquee-fore').each(function(i, item) {
						item.style.display = ''
					});$('.marquee-current').each(function(i, item) {
						item.style.display = 'none'
					});
				} else {
					marqueeforecasttype = 'now'
					if (noreportmode == false) {
						$('#arrow-img').attr("src",'/images/now.png');
					}
					$('.marquee-fore').each(function(i, item) {
						item.style.display = 'none'
					});
					$('.marquee-current').each(function(i, item) {
						item.style.display = ''
					});
				}
				$('#marquee-container')
					.marquee('destroy')
					.marquee({speed: 200, pauseOnHover:true, delayBeforeStart:3000})
					.on('finished', refreshMarquee);
		}
		//init and loop the things
		refreshMarquee();
		switchToWarningMarquee();
		displayCCTickerData();
		setInterval(function(){
			displayCCTickerData();
			switchToWarningMarquee();
		}, 300000)
}
