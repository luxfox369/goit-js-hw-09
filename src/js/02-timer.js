
import flatpickr from "flatpickr";
import Notiflix from "notiflix";
//Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

const options = {
  enableTime: true, //Enables time picker
  time_24hr: true, //Displays time picker in 24 hour mode without AM/PM selection when enabled.
  defaultDate: new Date(),//String	null	
   // the initial selected date(s).
  //If you're using mode: "multiple" or a range calendar supply an Array of Date objects
  // or an Array of date strings which follow your dateFormat.
  minuteIncrement: 1, //Integer	5	Adjusts the step for the minute input (incl. scrolling)
  onClose(selectedDates) { //null	Function(s) to trigger on every time the calendar is closed
    // console.log(selectedDates[0]);
    Timer.checkDate(selectedDates[0]);
    //Метод onClose() з об'єкта параметрів викликається щоразу під час закриття елемента інтерфейсу,
    // який створює flatpickr.Саме у ньому варто обробляти дату, обрану користувачем.
    //Параметр selectedDates - це масив обраних дат, тому ми беремо перший елемент.
  },
};
let selectedDate = 0;
let delta = 0;

//*******   створюю клас таймера ****************
class Timer {
  #idTimer = null;
  #days = 0;
  #hours = 0;
  #minutes = 0;
  #seconds = 0;
  #onChangeCallback = () => {}; //люба функція зізовні яка буде щось робити з даними цього класа
  constructor({ onChange } = {}) {
    if (onChange) {
      this.#onChangeCallback = onChange;
    }
  }
  start(selectedDate) {
    delta = new Date(selectedDate) - Date.now();
    setFormToStopMode();
    this.#calculateData(delta);
    this.#idTimer = setInterval(() => {
      this.#calculateData(delta);
    }, 1000);
  }
  stop() {
    setFormToStartMode();
    clearInterval(this.#idTimer);
  }
  #calculateData() {
    delta = selectedDate - Date.now(); //перераховуємо delta бо  Date.now() змінилось між вибором дати і натисненням кнопки
    if (delta > 990) {
      this.#updateInstance(Timer.convertMs(delta)); //повертає обєкт {days: 0, hours: 0, minutes: 0, seconds: 0}
    }
    else {
      this.resetData();
      setFormToStartMode();
    }
  }
  static convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    // Remaining days,hours,minutes,seconds
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
    console.log(" з convertMs(ms) ", { days, hours, minutes, seconds });
    return { days, hours, minutes, seconds };
  }
  static addLeadingZero({ days, hours, minutes, seconds }) {
    const  pDays = days.toString().padStart(2, '0');
    const  pHours = hours.toString().padStart(2, '0');
    const  pMinutes = minutes.toString().padStart(2, '0');
    const  pSeconds = seconds.toString().padStart(2, '0');
    return { pDays, pHours, pMinutes, pSeconds }; // повертає{days: 00, hours: 00, minutes: 00, seconds: 00}
  }
  #updateInstance({ days = 0, hours = 0, minutes = 0, seconds = 0 } = {}) {
    this.#days = days;
    this.#hours = hours;
    this.#minutes = minutes;
    this.#seconds = seconds;

    this.#onChangeData();
  }
  #onChangeData() {
    const dataForRendering =
       Timer.addLeadingZero({
          days: countDown.#days,
          hours: countDown.#hours,
          minutes: countDown.#minutes,
          seconds: countDown.#seconds
        });
    this.#onChangeCallback( dataForRendering);
  }

   static checkDate(date) {
     let delta = new Date(date) - Date.now();
    if (delta < 990) {
   // return alert('Please choose a date in the future');
      return Notiflix.Notify.failure('Please choose a date in the future');

    }
    selectedDate = date;
    refs.button.disabled = false;
    return selectedDate;
  } 
  resetData() {
    this.#updateInstance({ days : 0, hours : 0, minutes : 0, seconds : 0 });
  }
}



const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('button[data-start]'),
  countDownTimer : document.querySelector('.timer'),
  fields: document.querySelectorAll('.field'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]')
};

flatpickr(refs.input, options); //очікуємо selectedDate
//refs.button.disabled = true;
//глобальні константи
const ACTION = {
  START: 'start',
  STOP: 'stop',
};

//Додаю стилі щоб поставити timer в центр
refs.countDownTimer.style.cssText = 'display:flex;gap:10px; justify-content:center;font-size:25px;padding:10px';
refs.input.style.cssText = 'display:inline-block;height:50px;font-size:25px;padding-left:50px;color:blue;';
//обгортаю input+button в form щоб поставити в центр
function wrap(el1, el2, wrapper) {
  el1.parentNode.insertBefore(wrapper, el1);
  wrapper.appendChild(el1);
  el2.parentNode.insertBefore(wrapper, el2);
  wrapper.appendChild(el2);
}
wrap(refs.input, refs.button, document.createElement('form'));
const refForm = document.querySelector('form');
refForm.setAttribute('data-action', 'start');
refForm.style.cssText = 'display:flex;gap:5px;justify-content:center;';

Array.from(refs.fields).map(item => {
  item.style.cssText =
    'width:100px;display:flex;flex-direction:column;align-items: center;';
  item.style.border = '2px dotted grey';
  item.style.padding = '2px 6px';
});
//кінець налаштування стилів
//створюю екземпляр
const countDown = new Timer({ onChange: render });
//на input вішаємо слухача щоб при спробі змінити дату кнопка таймера стала недоступною ,знімаємо таймер,і обнулюємо поля екземпляра і розмітку
refs.input.addEventListener('input', () => {
  refs.button.disabled = true;
  countDown.stop();
  countDown.resetData();
});

//  на формі вішаємо слухача щоб при натисненні submit(start) запускати timer
refForm.addEventListener('submit', e => {
  e.preventDefault();
  if (e.currentTarget.dataset.action === ACTION.START) { //якщо на формі атрибут data-action === 'start'
    countDown.start(selectedDate); //на створеному екземплярі класу Timer запускаємо метод start з датою після виходу з flatpcr = options.onClose()
    setFormToStopMode()            //змінюємо data-action = 'stop,змінюємо напис на кнопці на stop/поле вводу недоступне  
  } else {                         //якщо на формі атрибут  НЕ data-action !== 'start'
    countDown.stop();             //запускаємо метод stop на екземплярі
    setFormToStartMode();         //змінюємо data-action = 'start,змінюємо напис на кнопці на start/поле вводу доступне 
  }
});

function setFormToStartMode() {
  refForm.dataset.action = ACTION.START;
  refs.button.textContent = ACTION.START;
  refs.input.disabled = false;
}

function setFormToStopMode() {
  refForm.dataset.action = ACTION.STOP;
  refs.button.textContent = ACTION.STOP;
  refs.input.disabled = true;
}
//onChangeCallback який вказаний у властивості onChange і переданий при створенні екземпляра
function render({ pDays, pHours, pMinutes, pSeconds }) {
  refs.days.textContent =  pDays;
  refs.hours.textContent = pHours;
  refs.minutes.textContent =  pMinutes;
  refs.seconds.textContent = pSeconds;
}
