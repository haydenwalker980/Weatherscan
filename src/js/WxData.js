let WxData = {

  // Taken from https://digital.wsi.com/products/v3.1/developer_widgets.php?auth=public&country=US&language=en
  API_BASE: "https://api.weather.com/v1",
  API_KEY: "089ed4e892fb0dfdf34eb81e6f2521aa",

  /**
   * Data is saved in the form of data[location][record]
   */
  _data: {},

  /**
   *
   * @param location
   * @returns {Promise}
   */
  observations: function (location) {

    if (this._data[location] && this._data[location]['observations']) {
      return new Promise(resolve => resolve(this._data[location]['observations']));
    }

    return this._loadCurrentConditions(location);

  },

  _apiRequest: function (endpoint, callback) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.open('GET', self.API_BASE + endpoint + '?apiKey=' + self.API_KEY + '&language=en-US&units=e');
      xhr.send();
    });
  },

  /**
   *
   * @returns {Promise}
   * @private
   */
  _loadCurrentConditions: function (location) {
    let self = this;
    return this._apiRequest('/location/' + location + '/observations.json').then(result => {
      try {
        let response = JSON.parse(result);
        return self.saveRecord(location, 'observations', response.observation);
      } catch (e) {
        console.error('Error parsing current conditions');
        return null;
      }
    });

  },

  saveRecord: function (location, type, data) {

    if (typeof this._data !== 'object') {
      this._data = {};
    }

    if (!this._data[location]) {
      this._data[location] = {};
    }

    this._data[location][type] = data;
    console.log('Saved ' + type + ' for ' + location);
    this.saveCache();

    return data;
  },

  init: function () {
    this.loadCache();
  },

  /**
   * Load data from localStorage
   */
  loadCache: function () {
    try {
      if (localStorage['wx_data']) {
        this._data = JSON.parse(localStorage['wx_data']);
        console.log('Data retrieved from cache');
      }
    } catch (e) {
      console.error('Error parsing data from localStorage');
    }
  },

  /**
   * Save data to localStorage
   */
  saveCache: function () {
    localStorage['wx_data'] = JSON.stringify(this._data);
    console.log('Data saved in cache');
  },

};