// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { fetchImages } from './js/fetchimages';

const searchQuery = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');

let perPage = 40;
let page = 0;
let name = searchQuery.value;

async function eventHundler() {}
searchForm.addEventListener('submit', eventHundler);
function renderGallery() {}
