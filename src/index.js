import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallerySelector = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');

let searchQueryResult = '';
let q = '';
let pageN = 1;

let gallery = new SimpleLightbox('.gallery a', {
  enableKeyboard: true,
});

const pixabayAPI = {
  baseUrl: 'https://pixabay.com/api/',
  key: '34346639-e8efe2ce21a3e54ecceb798ec',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: '1',
  per_page: '40',
};

const markupData = {
  markup: '',
  htmlCode: '',
};

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const {
    elements: { searchQuery },
  } = e.target;
  searchQueryResult = searchQuery.value;

  if (searchQueryResult === '') {
    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (searchQueryResult !== q) {
    pageN = 1;
    pixabayAPI.page = `${pageN}`;
    gallerySelector.innerHTML = '';
    btnLoadMore.classList.remove('is-visible');
  } else {
    pageN += 1;
    pixabayAPI.page = `${pageN}`;
    btnLoadMore.classList.remove('is-visible');
  }

  q = searchQueryResult;

  try {
    const results = await fetchPhotos(searchQueryResult);
    markupData.htmlCode = renderGallery(results);
    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    gallery.refresh();

    const {
      baseUrl,
      key,
      image_type,
      orientation,
      safesearch,

      page,
      per_page,
    } = pixabayAPI;
    const { total, totalHits, hits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page >= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }
    Notiflix.Notify.success(`'Hooray! We found ${results.totalHits} images.'`);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});

btnLoadMore.addEventListener('click', async () => {
  pageN += 1;
  pixabayAPI.page = `${pageN}`;

  try {
    const results = await fetchImages(searchQueryResult);
    markupData.htmlCode = renderGallery(results);

    gallerySelector.insertAdjacentHTML('beforeend', markupData.htmlCode);
    btnLoadMore.classList.add('is-visible');

    gallery.refresh();

    const {
      baseUrl,
      key,
      image_type,
      orientation,
      safesearch,

      page,
      per_page,
    } = pixabayAPI;
    const { total, totalHits, hits } = results;
    const totalPages = Math.ceil(totalHits / per_page);

    if (page >= totalPages) {
      btnLoadMore.classList.remove('is-visible');
    }
  } catch (error) {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
});

async function fetchImages(searchQueryResult) {
  const {
    baseUrl,
    key,
    image_type,
    orientation,
    safesearch,

    page,
    per_page,
  } = pixabayAPI;

  pixabayAPI.page = `${pageN}`;

  const response = await axios.get(
    `${baseUrl}?key=${key}&q=${q}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&page=${page}&per_page=${per_page}`
  );
  const results = response.data;
  const { total, totalHits, hits } = results;
  const totalPages = Math.ceil(totalHits / per_page);

  if (total === 0) {
    throw new Error();
  }
  if (page >= totalPages) {
    btnLoadMore.classList.remove('is-visible');
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return results;
  }
}

async function renderGallery(results) {
  const { hits } = results;
  markupData.markup = hits
    .map(
      hit =>
        `<a href="${hit.largeImageURL}"><div class="photo-card">
      <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy"
        class="img-item" />
      <div class="info">
  <p class="info-item">
    <b>Likes:</b>${hit.likes}
  </p>
  <p class="info-item">
    <b>Views:</b>${hit.views}
  </p>
  <p class="info-item">
    <b>Comments:</b>${hit.comments}
  </p>
  <p class="info-item">
    <b>Downloads:</b>${hit.downloads}
  </p>
</div>
</div></a>`
    )
    .join('');
  return markupData.markup;
}
