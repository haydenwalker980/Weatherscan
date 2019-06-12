setInterval(updateClock, 1000);
document.addEventListener('DOMContentLoaded', updateClock);

let $clock = document.getElementById("clock");

function updateClock() {

  let time = moment();

  $clock.innerHTML = time.format('MMM D[<br/>]h:m:ssa');

}