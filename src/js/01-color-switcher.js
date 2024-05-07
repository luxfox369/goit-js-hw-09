function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }
const refs = {
 body:document.body,   
 butStart : document.querySelector("button[data-start]"),
 butStop : document.querySelector("button[data-stop]"),
}
refs.butStart.disabled = false;
refs.butStop.disabled = true;

refs.butStart.addEventListener("click", onStart);
refs.butStop.addEventListener("click", onStop);
let timerID = null;

function onStart() {
    setColor();
    butTons();
    timerID = setInterval(setColor, 1000);
    console.log(timerID);
}
function onStop() {
    clearInterval(timerID)
    console.log(timerID);
    butTons();
   }
function setColor() {
   refs.body.style.backgroundColor= getRandomHexColor();
}
function butTons() {
    if (refs.butStart.disabled ){
        refs.butStart.disabled = false;
    }
    else {
        refs.butStart.disabled = true;
    }
    
    if (refs.butStop.disabled) {
        refs.butStop.disabled = false;
    } 
    else {
        refs.butStop.disabled = true;
    }
}
