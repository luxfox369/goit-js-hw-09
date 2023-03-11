
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
const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener("submit", onSubmit);

function onSubmit(event) {
  event.preventDefault() ;
  //console.dir(e.currentTarget); //ref форма
  //console.log(e.target); //ref button
  const { elements: { delay, step, amount} } = event.currentTarget;
    
  //console.log('elements ', elements);
  
  let delta = 0;
  for (let i = 1; i <= amount.value; i += 1) {
    if (i > 1) delta = step.value ;
    
    const promise = createPromise(i, delay + delta);
    promise
      .then(value => { console.log(value); })
      .catch(error => { console.log(error);})
  }
}
