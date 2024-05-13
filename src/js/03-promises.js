import Notiflix from "notiflix";
let arrPromises = [];
let markUp = '<h3>Created promises:</h3>';


const refs = {
  form: document.querySelector(".form"),
  submit: document.querySelector(".submit"),
  buttons: document.querySelector(".buttons"),
  all: document.querySelector(".all"),
  race: document.querySelector(".race"),
  any: document.querySelector(".any"),
  allSet: document.querySelector(".allSettled"),
  reset: document.querySelector(".reset"),
  promises: document.querySelector(".promises")
}
 //вішаємо прослуховувач  на кнопки
  refs.all.addEventListener("click", allPromise);
  refs.race.addEventListener("click", racePromise);
  refs.any.addEventListener("click", anyPromise);
  refs.allSet.addEventListener("click", allSet);
  refs.form.addEventListener("submit", onSubmit);
  refs.reset.addEventListener("click", onReset);
 // кнопки функцій недоступні крім створення промісів
disabledButtons();
//стилі
refs.form.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px;padding:5px';
refs.submit.style.cssText = 'width:100px;height:50px;padding:5px';
refs.buttons.style.cssText = 'display:flex;gap:10px;justify-content:center;height:50px;font-size:30px;padding:5px';


//створення промісів

function onSubmit(e) {
  e.preventDefault();
  //ловимо всі input форми  по name 
  const { elements: { delay, step, amount } } = e.currentTarget;
  //вони символьні тому перетворюємо на числа
  let nDelay = Number(delay.value);
  const nStep = Number(step.value);
  const nAmount = Number(amount.value);
  
  for (i = 1; i <= nAmount; i += 1) {
    Notiflix.Loading.standard('Creating promises...');
    if (i > 1) {
      nDelay += nStep;
    }
    let promise = createPromise(i, nDelay);
   
    promise
      .then(data => {Notiflix.Notify.success(data);markUp   += `<p style="font-size:12px"> ${data}</p>` }) // 
      .catch(error => {Notiflix.Notify.failure(error);markUp += `<p style="font-size:12px"> ${error}</p>` }) //
      
    //формуємо масив отриманих промісів для подальших функцій
    arrPromises.push(promise);
    //намалюємо отримані проміси на сторінці через markUp
  
  }
  setTimeout(() => {
    //console.log(markUp);
    refs.promises.innerHTML = markUp;
    Notiflix.Loading.remove(1000); //забираємо колесо через 1с
    enabledButtons(); //кнопки функцій доступні
     }, nDelay+nStep*nAmount); //малювати/відкривати кнопки через затримку коли всі промісі сетлед
  
  refs.reset.addEventListener("click", onReset); 
  
}
//створення проміса
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.5;
    setTimeout(() => {
      if (shouldResolve) {
        resolve( `✅ Fulfilled promise ${position} in ${delay}ms` );
             } else {
        reject(`❌ Rejected promise ${position} in ${delay}ms`);
      }
    }, delay);
  });
}
 
 //кнопки функцій недоступні
 function disabledButtons() {
  refs.all.disabled = true;
  refs.race.disabled = true;
  refs.any.disabled = true;
   refs.allSet.disabled = true;
   refs.reset.disabled = true;
   refs.submit.disabled = false;
}


// кнопки функцій доступні
function enabledButtons() {
  refs.all.disabled = false;
  refs.race.disabled = false;
  refs.any.disabled = false;
  refs.allSet.disabled = false;
  refs.reset.disabled = false;
  refs.submit.disabled = true;
}
//функції над масивом промісів
function allPromise (){
  const promiseAll = Promise.all(arrPromises)
    .then(value => Notiflix.Notify.success(value)) // when all of the promises fulfill;  
    .catch(error => Notiflix.Notify.failure(error));// rejects when any of the promises rejects and return the first rejected
}
function racePromise() {
    const promiseRace = Promise.race(arrPromises)
      .then(value => Notiflix.Notify.success(value)) //RACE Settles = fulfills when first of the promises fulfills 
      .catch(error => Notiflix.Notify.failure(error));//rejects when first of the promises rejects.
}
function anyPromise() {
  const promiseAny = Promise.any(arrPromises)
    .then(value => Notiflix.Notify.success(value)) //ANY поверне Fulfills when any of the promises fulfills; 
    .catch(error => Notiflix.Notify.failure(error));// rejects when all of the promises reject. and returns aggregateEror якщо всі rejected  
}
function allSet() {
  const promiseAllSettled = Promise.allSettled(arrPromises)
    .then(value => Notiflix.Notify.success(value)) //AllSettled поверне  масив всіх промісів як resolve/reject коли всі проміси завершені(settled)
    .catch(error => Notiflix.Notify.failure(error));
}


function onReset() {
  refs.form.reset();
  refs.promises.innerHTML = "";
  arrPromises = [];
  markUp = '<h3>Created promises:</h3>';
  disabledButtons();
  /*refs.all.removeEventListener("click", allPromise);
  refs.race.removeEventListener("click", racePromise);
  refs.any.removeEventListener("click", anyPromise);
  refs.allSet.removeEventListener("click", allSet);
  refs.reset.removeEventListener("click", onReset);*/
}


 