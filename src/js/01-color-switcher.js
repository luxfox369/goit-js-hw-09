function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  
}
//посилання 
const refs = {
    body: document.body,
    btnStart: document.querySelector("button[data-start]"),
    btnStop: document.querySelector("button[data-stop]"),
}
//слухачі подій
refs.btnStart.addEventListener('click', start);
refs.btnStop.addEventListener('click', stop);

let idTimer = null;//оголошуємо idTimer в глобальній зоні видимості
setToStart();
console.log("idTimer", idTimer);
function start() {
    setToStop();
    setColor(); //щоб перша зміна відбулась відразу
    idTimer = setInterval(setColor, 1000);//заплановано що 1с запускати setColor до бескінечності
    console.log("idTimer", idTimer);
};
function stop() {
    setToStart();
    clearInterval(idTimer); //по id таймера setInterval відміняємо що 1с запускати setColor
    console.log("idTimer", idTimer);
    
};
//зміна кольору body 
function setColor() {
    let bgColor = getRandomHexColor(); //генеруємо колір
    refs.body.style.backgroundColor = bgColor; //змінюємо колір body
}
function setToStart() {
   refs.btnStart.disabled = false; //кнопка start  доступна 
    refs.btnStop.disabled = true;  //кнопка stop НЕ  доступна 
}
function setToStop() {
   refs.btnStart.disabled = true; //кнопка start НЕ  доступна 
    refs.btnStop.disabled = false; //кнопка stop  доступна 
}




