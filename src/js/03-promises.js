import Notiflix from "notiflix";

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve(`✅ Fulfilled promise ${position} in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise ${position} in ${delay}ms`);
      }
    }, delay);
  });
}
let arrPromises = [];
const refs = {
  form: document.querySelector(".form"),
  input: document.querySelector("input"),
  submit:document.querySelector(".submit"),
  buttons: document.querySelector(".buttons"),
  all: document.querySelector(".all"),
  race: document.querySelector(".race"),
  any: document.querySelector(".any"),
  allSet: document.querySelector(".allSettled"),
  
}
refs.all.disabled = true;
refs.race.disabled = true;
refs.any.disabled = true;
refs.allSet.disabled = true;

//refs.input.style.cssText = 'display:inline-block;width:50px';
refs.form.style.cssText = 'display:flex;flex-direction:column;gap:20px;padding:10px';
refs.submit.style.cssText = 'width:150px;height:50px;padding:10px';
refs.buttons.style.cssText = 'display:flex;gap:10px;height:50px;font-size:50px;padding:10px';

refs.form.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();
  //ловимо всі input форми  по name 
  const { elements: { delay, step, amount } } = e.currentTarget;
  //вони символьні тому перетворюємо на числа
  let nDelay = Number(delay.value);
  let nStep = Number(step.value);
  let nAmount = Number(amount.value);
  //console.log(nDelay,"/", nStep,"/", nAmount);
  
  for (i = 1; i <= nAmount; i += 1) {
    Notiflix.Loading.standard('Creating promises...');
    if (i > 1) {
      nDelay += nStep;
    }
    let promise = createPromise(i, nDelay);
    promise
      .then(data => { Notiflix.Notify.success(data) })
      .catch(error => { Notiflix.Notify.failure(error) });

    arrPromises.push(promise);
  }
  Notiflix.Loading.remove(3000);
  refs.all.addEventListener("click", allPromise);
  refs.race.addEventListener("click", racePromise);
  refs.any.addEventListener("click", anyPromise);
  refs.allSet.addEventListener("click", allSet);
  
//e.currentTarget.reset();
}
  //кнопки функцій доступні
  refs.all.disabled = false;
  refs.race.disabled = false;
  refs.any.disabled = false;
  refs.allSet.disabled = false;

function allPromise (){
  const promiseAll = Promise.all(arrPromises)
    .then(value => Notiflix.Notify.success(value)) // when all of the promises fulfill;  
    .catch(error => Notiflix.Notify.failure(error));// rejects when any of the promises rejects and return the first rejected
}
//Notiflix.Notify.success(value)
  //Notiflix.Notify.failure(error)
  function racePromise() {
    const promiseRace = Promise.race(arrPromises)
      .then(value => Notiflix.Notify.success(value)) //RACE Settles = fulfills when first of the promises fulfills 
      .catch(error => Notiflix.Notify.failure(error));//rejects when any of the promises rejects.
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

//refs.all.removeEventListener("click", allPromise);
//refs.race.removeEventListener("click", racePromise);
//refs.any.removeEventListener("click", anyPromise);
//refs.allSet.removeEventListener("click", allSet);



 