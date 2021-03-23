//  Fisher-Yates shuffle
function shuffle (array) {
	var i = 0,
	    j = 0,
	    temp = null;

	for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}


function getNextHighestIndex(arr, value) {
    var i = arr.length;
    while (arr[--i] > value);
    return ++i;
}


function getUrlParameter(e) {
	return decodeURI((new RegExp(e + "=(.+?)(&|$)").exec(location.search) || [, null])[1])
}



// convert celsius to farenheight
function C2F(c){
	return Math.round( c * 9 / 5 + 32 );
}


// meters per second to mph
function mps2mph(meters) {
	return Math.round(  parseFloat(meters) * 2.23694 );
}


// array swap
Array.prototype.swap = function(a,b){ var tmp=this[a];this[a]=this[b];this[b]=tmp;};


function degToCompass(deg){
    val = Math.round((deg/22.5)+.5);
    arr=["N","NE","E","SE","S","SW","W","NW"];
    return arr[(val % 8)];
}



function distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180,
		radlat2 = Math.PI * lat2/180,
		theta = lon1-lon2,
		radtheta = Math.PI * theta/180,
		dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	return dist;
}


function dewPoint(tem, r){
    tem = -1.0*(tem-32)*5/9	;
    es = 6.112*Math.exp(-1.0*17.67*tem/(243.5 - tem));
    ed = r/100.0*es;
    eln = Math.log(ed/6.112);
    td = -243.5*eln/(eln - 17.67 );
    return Math.round( (td*9/5)+32 );
}

function heatIndex(T, R) { // T = temp, R = relative humidity
	var T2 = T*T, R2= R*R,
		c1 = -42.379, c2 = 2.04901523, c3 = 10.14333127,
		c4 = -0.22475541, c5 = -6.83783*Math.pow(10,-3), c6 = -5.481717*Math.pow(10,-2),
		c7 = 1.22874*Math.pow(10,-3), c8 = 8.5282*Math.pow(10,-4), c9 = -1.99*Math.pow(10,-6);

	return Math.round(c1 + c2*T + c3 *R + c4*T*R + c5*T2 + c6*R2 + c7*T2*R + c8*T*R2 + c9*T2*R2);
}


// maps current condition code to icon
function getCCicon(ccCode){
	return "images/icons/" + ( "0" +  {"20011d":1,"20011n":1,"20111d":1,"20111n":1,"20211d":1,"20211n":1,"21011d":1,"21011n":1,"21111d":1,"21111n":1,"21211d":1,"21211n":1,"22111d":1,"22111n":1,"23011d":1,"23011n":1,"23111d":1,"23111n":1,"23211d":1,"23211n":1,"30009d":5,"30009n":5,"30109d":5,"30109n":5,"30209d":5,"30209n":5,"31009d":5,"31009n":5,"31109d":5,"31109n":5,"31209d":5,"31209n":5,"31309d":5,"31309n":5,"31409d":5,"31409n":5,"32109d":5,"32109n":5,"50010d":7,"50010n":7,"50110d":8,"50110n":8,"50210d":31,"50210n":31,"50310d":31,"50310n":31,"50410d":31,"50410d":31,"51110d":6,"51110n":6,"52010d":7,"52010n":7,"52110d":8,"52110n":8,"52210d":31,"52210n":31,"53110d":29,"53110n":37,"60013d":10,"60013n":10,"60113d":12,"60113n":12,"60213d":33,"60213n":33,"61113d":13,"61113n":13,"61213d":13,"61213n":13,"61313d":13,"61313n":13,"61513d":2,"61513n":2,"61613d":2,"61613n":2,"62013d":10,"62013n":10,"62113d":12,"62113n":12,"62213d":33,"62213n":33,"70150d":15,"70150n":15,"71150d":14,"71150n":14,"72150d":16,"72150n":16,"73150d":16,"73150n":16,"74150d":15,"74150n":15,"75150d":16,"75150n":16,"76150d":14,"76150n":14,"76250d":14,"76250n":14,"77150d":18,"77150n":18,"78150d":1,"78150n":1,"80001d":26,"80001n":25,"80102d":28,"80102n":27,"80203d":22,"80203n":21,"80304d":24,"80304n":23,"80405d":20,"80405n":20}[ccCode]).slice(-2) + ".png";
}
function getCCtext(ccCode) {
    return {
        "20011d": "Thunderstorm",
        "20011n": 1,
        "20111d": 1,
        "20111n": 1,
        "20211d": 1,
        "20211n": 1,
        "21011d": 1,
        "21011n": 1,
        "21111d": 1,
        "21111n": 1,
        "21211d": 1,
        "21211n": 1,
        "22111d": 1,
        "22111n": 1,
        "23011d": 1,
        "23011n": 1,
        "23111d": 1,
        "23111n": 1,
        "23211d": 1,
        "23211n": 1,
        "30009d": 5,
        "30009n": 5,
        "30109d": 5,
        "30109n": 5,
        "30209d": 5,
        "30209n": 5,
        "31009d": 5,
        "31009n": 5,
        "31109d": 5,
        "31109n": 5,
        "31209d": 5,
        "31209n": 5,
        "31309d": 5,
        "31309n": 5,
        "31409d": 5,
        "31409n": 5,
        "32109d": 5,
        "32109n": 5,
        "50010d": 7,
        "50010n": 7,
        "50110d": 8,
        "50110n": 8,
        "50210d": 31,
        "50210n": 31,
        "50310d": 31,
        "50310n": 31,
        "50410d": 31,
        "50410d": 31,
        "51110d": 6,
        "51110n": 6,
        "52010d": 7,
        "52010n": 7,
        "52110d": 8,
        "52110n": 8,
        "52210d": 31,
        "52210n": 31,
        "53110d": 29,
        "53110n": 37,
        "60013d": 10,
        "60013n": 10,
        "60113d": 12,
        "60113n": 12,
        "60213d": 33,
        "60213n": 33,
        "61113d": 13,
        "61113n": 13,
        "61213d": 13,
        "61213n": 13,
        "61313d": 13,
        "61313n": 13,
        "61513d": 2,
        "61513n": 2,
        "61613d": 2,
        "61613n": 2,
        "62013d": 10,
        "62013n": 10,
        "62113d": 12,
        "62113n": 12,
        "62213d": 33,
        "62213n": 33,
        "70150d": 15,
        "70150n": 15,
        "71150d": 14,
        "71150n": 14,
        "72150d": 16,
        "72150n": 16,
        "73150d": 16,
        "73150n": 16,
        "74150d": 15,
        "74150n": 15,
        "75150d": 16,
        "75150n": 16,
        "76150d": 14,
        "76150n": 14,
        "76250d": 14,
        "76250n": 14,
        "77150d": 18,
        "77150n": 18,
        "78150d": 1,
        "78150n": 1,
        "80001d": 26,
        "80001n": 25,
        "80102d": 28,
        "80102n": 27,
        "80203d": 22,
        "80203n": 21,
        "80304d": 24,
        "80304n": 23,
        "80405d": 20,
        "80405n": 20
    }[ccCode]).slice(-2) + ".png";
}


// https://date-fns.org/docs/Getting-Started
