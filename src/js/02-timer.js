// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
//Бібліотека очікує, що її ініціалізують на елементі input[type="text"], тому ми додали до HTML документу поле input#datetime-picker

//посилання на html елементи
const refs = {
  input: document.querySelector('input#datetime-picker'),
  button: document.querySelector('button[data-start]'),
  countDownTimer: document.querySelector('.timer'),
  paragraph: document.querySelector('p'),
  fields: document.querySelectorAll('.field'),
  //посилання на поля таймера
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-data-seconds]'),
}
refs.button.disabled = true; //кнопка недоступна поки невибрали валідну дату (в майбутньому)
let delta;  //число в мілісекундах  між 2-ма датами для обрахунку таймера

//Другим аргументом функції flatpickr(selector, options) можна передати необов'язковий об'єкт параметрів.
//Розберися, за що відповідає кожна властивість в документації «Options», і використовуй його у своєму коді.
const options = {
  enableTime: true, //Boolean	Enables time picker
  time_24hr: true, //Displays time picker in 24 hour mode without AM/PM selection when enabled.
  defaultDate: new Date(), //String	Sets the initial selected date(s).
  minuteIncrement: 1, //nteger	5	Adjusts the step for the minute input (incl. scrolling)
  onClose(selectedDates) {  //Function(s) to trigger on every time the calendar is closed
      //console.log(selectedDates[0]); //selectedDates - an array of Date objects selected by the user. When there are no dates selected, the array is empty.
      checkedSelectedDateMs(selectedDates[0]);
    },
};

//привязую календар до input#datetime-picker
flatpickr(refs.input, options);
//додаю стилі щоб поставити timer в центр
refs.countDownTimer.style.cssText = 'padding-top:10px;display:flex;gap:10px;justify-content:center;font-size:25px;';
refs.input.style.cssText = 'display:inline-block;text-align:center;';
//обгортаю input+button в div щоб поставити в центр
function wrap(el1, el2, wrapper) {
  el1.parentNode.insertBefore(wrapper, el1);
  wrapper.appendChild(el1);
  el2.parentNode.insertBefore(wrapper, el2);
  wrapper.appendChild(el2);
}
wrap(refs.input, refs.button, document.createElement('form'));
refForm = document.querySelector('form');
refForm.style.cssText = 'display:flex;gap:5px;justify-content:center;';

Array.from(refs.fields).map(item => {
  item.style.cssText = 'display:flex;flex-direction:column;align-items: center;';
  item.style.border = '2px dotted grey';
  item.style.padding = '2px 6px';
});
//check date selectedDates[0] 
const checkedSelectedDateMs =(selectedDate) =>{
    let currentDataMS = new Date().getTime(); //ms від текучої дати до 01/01/1970 //= date.now()
  //  console.log("currentDataMS ", currentDataMS);
    const selectedDateMS = selectedDate.getTime(); //переводимо в число мс від 01/01/1970
  //  console.log('selectedDateMS ', selectedDateMS);
    delta = selectedDateMS - currentDataMS;
    console.log('delta counted ', delta);
    if (delta < 990) { //чи дата в майбутньому?
        return alert("Please choose a date in the future");
    }
    refs.button.disabled = false; //клавіша start доступна
    return selectedDateMS;
}
//на button start вішаємо слухача щоб запускати timer
refs.button.addEventListener('click', start);

let i = 0;
let idTimer = null;
function start() {
    //перерахунок delta бо похибка між моментом вибору дати і натисненням start
    currentDataMS = new Date().getTime();
    delta = checkedSelectedDateMs - currentDataMS;
   // refs.button.disabled = true;
    if (!idTimer) { //захист від створення купи таймерів
        countdown(delta);//щоб відразу спрацьовувало
        idTimer = setInterval(countdown, 1000,delta);
    }
}
function countdown(ms) {
//   const result = convertMs(ms); // повертає обєкт {days: 0, hours: 0, minutes: 0, seconds: 2}
//   const paddedResult = addLeadingZero(result);
//     render(paddedResult);  
    render(addLeadingZero(convertMs(ms)));
    
    if (delta < 1000) {
        clearInterval(idTimer);
        //тут функція reset timer на нулі
        render({days: 0, hours: 00, minutes: 00, seconds: 00});
    }
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
   // console.log({ days.value, hours.value, minutes.value, seconds.value  });
  return { days, hours, minutes, seconds };
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function addLeadingZero({ days, hours, minutes, seconds }) {     //з padStart повертає {days: 0, hours: 00, minutes: 00, seconds: 02}
 //Напиши функцію addLeadingZero(result) з padStart повертає {days: 0, hours: 00, minutes: 00, seconds: 02}
    //Кількість днів може складатися з більше, ніж двох цифр.
    return { days, hours, minutes, seconds };
};
function render({ days, hours, minutes, seconds }) {
 //тут render(paddedRresult)функція яка перемальовує html:
    // в (refs.days/refs.hours/refs.minutes/refs.seсonds) розкидує 
    //{ days.value, hours.value, minutes.value, seconds.value } )
   
}