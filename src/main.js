import { PREP_TIME } from './js/menu';

const form = document.querySelector('.form');
const log = document.querySelector('.order-log');

const makeOrder = (delay, shouldResolve) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
};

const addOrderRow = drink => {
  const li = document.createElement('li');
  li.classList.add('row-pending');
  li.textContent = `⏳ ${drink} · у роботі...`;
  log.append(li);
  return li;
};

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(form);
  const drink = formData.get('drink');
  const state = formData.get('state');

  const delay = PREP_TIME[drink];
  const shouldResolve = state === 'fulfilled';
  const row = addOrderRow(drink);
  makeOrder(delay, shouldResolve)
    .then(value => {
      row.classList.remove('row-pending');
      row.classList.add('row-ok');
      row.textContent = `✅ ${drink} · готове · ${value} ms`;
    })
    .catch(error => {
      row.classList.remove('row-pending');
      row.classList.add('row-err');
      row.textContent = `❌ ${drink} · скасовано · ${error} ms`;
    })
    .finally(() => {
      row.append(` · ${new Date().toLocaleTimeString('uk-UA')}`);
    });
});
