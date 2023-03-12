import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryDiv = document.querySelector('.country-info');

searchCountry.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

let inputSearchCountryName = '';

function onSearchCountry() {
    clear();
    inputSearchCountryName = searchCountry.value.trim();
    if (inputSearchCountryName === '') {
        return;
    } else
        fetchCountries(inputSearchCountryName)
            .then(arrCountryNames => {
                if (arrCountryNames.length === 1) {
                    renderCountryCard(arrCountryNames);
                    Notiflix.Notify.success('This is what you were looking for.');
                    return;
                }
                if (arrCountryNames.length > 1 && arrCountryNames.length < 10) {
                    renderCountryList(arrCountryNames);
                    Notiflix.Notify.success('This is what you were looking for.');
                    return;
                }
                {
                    Notiflix.Notify.info(
                        'Too many matches found. Please enter a more specific name.'
                    );
                }
            })
            .catch(() => {
                Notiflix.Notify.failure('Oops, there is no country with that name');
            });
}

function renderCountryList(arrCountry) {
    clear();
    console.log(arrCountry);
    const markupList = arrCountry
        .map(
            el =>
                `<li class="country-list--item">
            <img src="${el.flags.svg}" alt="Flag" width="50">
            <span class="country-list--span">${el.name}</span>
        </li>`
        )
        .join('');
    countryList.insertAdjacentHTML('afterbegin', markupList);
}

function renderCountryCard(arrCountry) {
    clear();
    console.log(arrCountry);
    const el = arrCountry[0];
    console.log(el);
    const langs = el.languages.map(({ name }) => name).join(', ');
    const markupCard = `<div class="country-card">
        <div class="country-card--box">
            <img src="${el.flags.svg}" alt="Flag" width="60", height="30">
            <h2 class="country-card--title"> ${el.name}</h2>
        </div>
            <p class="country-card--text">Capital: ${el.capital}</p>
            <p class="country-card--text">Population: ${el.population}</p>
            <p class="country-card--text">Languages: ${langs}</p>
        </div>`;
    countryDiv.insertAdjacentHTML('afterbegin', markupCard);
}
function clear() {
    countryList.innerHTML = '';
    countryDiv.innerHTML = '';
}
searchCountry.addEventListener('blur', () => (searchCountry.value = ''));
