
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
  
  for (let i = 1; i <= Number(amount.value); i += 1) {
    if (i > 1) { countedDelay += Number(step.value); }
    const promise = createPromise(i, countedDelay);
    promise
      .then(value => { console.log(value); })
      .catch(error => { console.log(error);})
  }
}

