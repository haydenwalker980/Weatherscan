
function Radar(divIDin, intervalHoursIn, zoomIn, latitudeIn, longitudeIn, withSat) {

	var map,
	divID = divIDin,
	intervalHours = intervalHoursIn,
	zoom = zoomIn,
	latitude  = latitudeIn,
	longitude = longitudeIn,
	timeLayers = [];

	this.setView = function(lat, long, zoomLevel){
		map.setView(L.latLng(lat, long), zoomLevel)
	};


	startAnimation();

	// snap date to 5 minute intervals
	function roundDate(date) {
		date.setUTCMinutes( Math.round(date.getUTCMinutes() / 5) * 5);
		date.setUTCSeconds(0);
		return date;
	}

	function startAnimation () {

		var endDate = roundDate(new Date()),
			player;

		map = L.map(divID, {
			zoom: zoom,
			fullscreenControl: false,
			center: [latitude, longitude]
			 // 31.205482,-82.4331197 test coordinates
		});


		// basemap
		// streets cj9fqw1e88aag2rs2al6m3ko2
		// satellite streets cj8p1qym6976p2rqut8oo6vxr
		// weatherscan green cj8owq50n926g2smvagdxg9t8
		// mapbox://styles/goldbblazez/ckgc7fwvr4qmn19pevtvhyabl
	//	https://api.mapbox.com/styles/v1/goldbblazez/ckgc8lzdz4lzh19qt7q9wbbr9.html?fresh=true&title=copy&access_token=pk.eyJ1IjoiZ29sZGJibGF6ZXoiLCJhIjoiY2tiZTRnb2Q2MGkxajJwbzV2bWd5dXI5MyJ9.jU-2DqGCBI14K-acyN9RCw
		L.tileLayer('https://api.mapbox.com/styles/v1/goldbblazez/ckgc8lzdz4lzh19qt7q9wbbr9/tiles/{z}/{x}/{y}?access_token=' + process.env.MAP_API_KEY, {
			tileSize: 512,
			zoomOffset: -1
		}).addTo(map);

		$.getJSON("https://api.weather.com/v3/TileServer/series/productSet/PPAcore?filter=radar&apiKey=" + process.env.API_KEY, function(data) {
			for (var i = 0; i < data.seriesInfo.radar.series.length; i++) {
				timeLayers.push(
					L.tileLayer("https://api.weather.com/v3/TileServer/tile/radar?ts="+ data.seriesInfo.radar.series[i].ts +"&xyz={x}:{y}:{z}&apiKey=" + process.env.API_KEY, {
						opacity: 0
				}))
			}
			timeLayers.forEach(timeLayers => {

          timeLayers.addTo(map);
        });
		});

		const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

		async function animationLoop() {
		  for (let i = timeLayers.length; i > 0; i--) {
				timeLayers[i - 1].setOpacity(1)
		    await sleepNow(100)
				timeLayers[i - 1].setOpacity(0)
		    if (i === 1) {
				timeLayers[i - 1].setOpacity(1)
				await	sleepNow(1750)
				timeLayers[i - 1].setOpacity(0)
					animationLoop()
				}
		  }
		}
		setTimeout(function() {
				animationLoop()
		}, 1000);

		if (withSat) {

			var goes_visible_sat = L.nonTiledLayer.wms('https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WMSServer', {
				layers: '9',  // 9 for visible sat
				format: 'image/png',
				transparent: true,
				opacity:0.7,
				useCanvas:true
			}),
			    satellitetimeLayer = L.timeDimension.layer.wms(goes_visible_sat, {
				proxy: proxy,
				updateTimeDimension: false,
				cache:1
			});

			satellitetimeLayer.addTo(map).on('timeload',function(t) {
				var canvas, ctx,
					imageData, data,
					i,
					layers = t.target._layers,
					keys = Object.keys(layers);

				for (var key of keys) {
					canvas = layers[key]._bufferCanvas;

					if (canvas.dataset.isAlpha){continue}

					ctx = canvas.getContext('2d');

					imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

					var pixels = imageData.data,
						brighten = 0,
						contrast = 10;
					for(var i = 0; i < pixels.length; i+=4){//loop through all data

						pixels[i] += brighten;
						pixels[i+1] += brighten;
						pixels[i+2] += brighten;

						var brightness = (pixels[i]+pixels[i+1]+pixels[i+2])/3; //get the brightness

						pixels[i]   += brightness > 127 ? contrast : -contrast;
						pixels[i+1] += brightness > 127 ? contrast : -contrast;
						pixels[i+2] += brightness > 127 ? contrast : -contrast;

						var rgb = pixels[i] + pixels[i+1] + pixels[i+2];
						pixels[i] = pixels[i+1] = pixels[i+2] = 255;
						pixels[i+3] = rgb / 3;
					}
					imageData.data = pixels;

					// overwrite original image
					ctx.putImageData(imageData, 0, 0);

					canvas.dataset.isAlpha = true;

				}

			});
		}


	}
}





/*
 * Workaround for 1px lines appearing in some browsers due to fractional transforms
 * and resulting anti-aliasing.
 * https://github.com/Leaflet/Leaflet/issues/3575
 */

(function(){
	//return;
    var originalInitTile = L.GridLayer.prototype._initTile
    L.GridLayer.include({
        _initTile: function (tile) {
            originalInitTile.call(this, tile);

            var tileSize = this.getTileSize();

            tile.style.width = tileSize.x + 1 + 'px';
            tile.style.height = tileSize.y + 1 + 'px';
        }
    });
})()
