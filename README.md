# Weatherscan Simulator
Weatherscan simulation in HTML/JS/CSS
Remade with Openweathermaps api

## Running locally
1. Create OpenWeatherMaps (https://openweathermap.org/api) and Mapbox (https://mapbox.com) API keys.
2. Go to `webroot/js/groupull.js`, search for and replace `putapikeyhere` with your OpenWeatherMaps API key.
3. Go to `webroot/js/radar.js`, search for and replace `putapikeyhere` with your Mapbox API key.
4. Download & Install [node.js LTS](https://nodejs.org/en/)
5. In terminal, run `npm install --production` in the root folder of this project. This will install any dependencies.
6. In terminal, run `npm start` in the root folder of this project. This will start a local web server.
7. Follow the link in the console output.

## Development
This project uses gulp to compile SASS to CSS.
1. Download & Install [node.js LTS](https://nodejs.org/en/)
2. Run `npm install gulp-cli -g`
2. Run `npm install` in the root folder of this project.
3. Run `gulp` or `gulp watch` in the root directory to compile.
