WxData.init();

// Default to Atlanta
let mainLoc = window.location.hash ? window.location.hash : 'USGA0028:1:US';

WxData.observations(mainLoc).then(data => {
  document.getElementById('city').innerText = data.obs_name;
  document.getElementById('current-temp').innerText = data.temp;
  document.getElementById('current-info').innerText = data.wx_phrase;
  document.getElementById('conditions-icon').src = '/images/watt-icons/icon' + data.wx_icon + '.png';
});