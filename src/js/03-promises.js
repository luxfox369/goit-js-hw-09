import Notiflix from 'notiflix';

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve(`✅ Fulfilled promise ${position} in  ${delay} ms`);
      } else {
        reject(`❌ Rejected promise ${position} in  ${delay} ms`);
      }
    }, delay);
  });
}
const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener("submit", onSubmit);

function onSubmit(event) {
  event.preventDefault() ;
  //ловимо всі поля вводу на формі 
  const { elements: {delay, step, amount} } = event.currentTarget;
 
  let countedDelay = Number(delay.value);
  let arrayPromises = [];
  for (let i = 1; i <= Number(amount.value); i += 1) {
    if (i > 1) { countedDelay += Number(step.value); }
    Notiflix.Loading.standard('Creating promises...');
    const promise = createPromise(i, countedDelay);
    promise
      .then(value => { Notiflix.Notify.success(value) })
      .catch(error => { Notiflix.Notify.failure(error); })
    arrayPromises.push(promise);
  }
  
  Notiflix.Loading.remove(3000);

  const promiseAll = Promise.all(arrayPromises)    //викликається на класі,на екземплярах нема бо метод статичний
  .then(value => Notiflix.Notify.success(value)) //якщо всі resolve ,то поверне масив рядків resolves []
  .catch(error => Notiflix.Notify.failure(error));// поверне 1й reject
  const promiseRace =Promise.race(arrayPromises)    //викликається на класі бо метод статичний
  .then(value => Notiflix.Notify.success(value)) //поверне результат resolve найскорше  виконаного промісу
  .catch(error => Notiflix.Notify.failure(error));
const promiseAny = Promise.any(arrayPromises)    //викликається на класі бо метод статичний
  .then(value => Notiflix.Notify.success(value)) //поверне результат resolve  найскорше  виконаного resolve промісу 
  .catch(error => Notiflix.Notify.failure(error));// поверне  результат reject або  aggregateEror якщо всі rejected  
const promiseAllSettled = Promise.allSettled(arrayPromises)    //викликається на класі бо метод статичний
  .then(value => Notiflix.Notify.success(value)) //поверне результат масив всіх промісів як resolve/reject коли всі проміси завершені(settled)
    .catch(error => Notiflix.Notify.failure(error)); 
  event.currentTarget.reset();
}

