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

function start() {
    refs.btnStart.disabled = true; //після запуска кнопка start недоступна //або refs.btnStart.removeEventListener('click', start);
    setColor(); //щоб перша зміна відбулась відразу
   idTimer = setInterval(setColor, 1000);//заплановано що 1с запускати setColor до бескінечності
};
function stop() {
    clearInterval(idTimer); //по id таймера setInterval відміняємо що 1с запускати setColor
    refs.btnStart.disabled = false; //кнопка start знову доступна //або refs.btnStart.addEventListener('click', start);
};
//зміна кольору body 
function setColor() {
    let bgColor = getRandomHexColor(); //генеруємо колір
    console.log('bgColor ', bgColor);
    refs.body.style.backgroundColor = bgColor; //змінюємо колір body
};


