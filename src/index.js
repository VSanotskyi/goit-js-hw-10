import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 500;
let userQuery = '';
let item = [];

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function render() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function onInput(event) {
  userQuery = event.target.value.trim();
  if (userQuery === '') {
    render();
    return;
  }

  fetchCountries(userQuery)
    .then(data => {
      item = data;
      render();

      if (!item[0].flags) {
        throw new Error();
      }

      if (item.length > 10) {
        return Notiflix.Report.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (item.length === 1) {
        createInfo();
      } else if (item.length >= 1 && item.length <= 10) {
        createList();
      }
    })
    .catch(ifError);
}

function getInfoCountry({ name, population, capital, flags }) {
  const lang = Object.values(item[0].languages).join(', ');
  return `<div><img src=${flags.svg} alt="flag"/><h2>Population: ${population}</h2><h2>Capital: ${capital}</h2><h2>Languages: ${lang}</h2></div>`;
}

function createList() {
  const markup = item.map(getInfoCountry);
  render();
  countryList.insertAdjacentHTML('beforeend', markup.join(''));
}

function createInfo() {
  const markup = item.map(getInfoCountry);
  render();
  countryInfo.insertAdjacentHTML('beforeend', markup.join(''));
}

function ifError() {
  render();
  Notiflix.Notify.failure('Oops, there is no country with that name.');
}
