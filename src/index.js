import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchApiService from './js/search-service';

const searchForm = document.querySelector('.search-form');
const galleryItems = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
// const searchBtn = document.querySelector('.js-search-btn');

const picturesApiService = new SearchApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSearch(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value.trim();
  if (!searchQuery) {
    return Notiflix.Notify.info(
      'Your search query contains invalid characters. Please try again without spaces.'
    );
  }

  picturesApiService.query = searchQuery;
  // searchBtn.disabled = true;

  picturesApiService.resetPage();

  try {
    const response = await picturesApiService.fetchImages();
    const totalHits = response.data.totalHits;
    const responseHits = response.data.hits;
    if (!responseHits.length) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      e.target.reset();
      galleryItems.innerHTML = '';

      return;
    }

    if (!picturesApiService.query) {
      clearPicturesContainer();

      Notiflix.Notify.info('You cannot search by empty field, try again.');
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      clearPicturesContainer();

      galleryItems.innerHTML = renderImageCards(responseHits);
      simpleLightbox.refresh();
      if (Math.ceil(totalHits / 40) === picturesApiService.page) {
        console.log(totalHits);
        setTimeout(() => {
          Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
        }, 2000);
        return;
      } else {
        buttonShow();
      }
    }
  } catch (error) {
    console.error(error);
  }
  // searchBtn.disabled = false;
}

async function onLoadMore() {
  picturesApiService.page += 1;

  try {
    const response = await picturesApiService.fetchImages();
    const responseHits = response.data.hits;
    const totalHits = response.data.totalHits;
    galleryItems.insertAdjacentHTML(
      'beforeend',
      renderImageCards(responseHits)
    );
    simpleLightbox.refresh();
    smoothScroll();
    if (Math.ceil(totalHits / 40) === picturesApiService.page) {
      setTimeout(() => {
        buttonHidden();
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 2000);
    }
  } catch (error) {
    console.error(error);
  }
}

function renderImageCards(responseHits) {
  const markup = responseHits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
                <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> <span class="info-item-api"> ${likes} </span>
                    </p>
                    <p class="info-item">
                        <b>Views</b> <span class="info-item-api">${views}</span>  
                    </p>
                    <p class="info-item">
                        <b>Comments</b> <span class="info-item-api">${comments}</span>  
                    </p>
                    <p class="info-item">
                        <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
                    </p>
                </div>
                </div>`;
      }
    )
    .join('');
  return markup;
}

function clearPicturesContainer() {
  galleryItems.innerHTML = '';
}

function buttonHidden() {
  loadMoreBtn.classList.add('visually-hidden');
}

function buttonShow() {
  setTimeout(() => {
    loadMoreBtn.classList.remove('visually-hidden');
  }, 3000);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.photo-card')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
