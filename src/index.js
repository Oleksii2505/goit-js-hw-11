import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchApiService from './js/search-service.js';

const searchForm = document.querySelector('.search-form');
const galleryItems = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('.js-search-btn');

const picturesApiService = new SearchApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 500,
});

async function onSearch(e) {
  e.preventDefault();

  picturesApiService.query = e.target.elements.searchQuery.value;
  searchBtn.disabled = true;

  picturesApiService.resetPage();

  try {
    const pictures = await picturesApiService.fetchImages();
    pictures(response => {
      const responseHits = response.data.hits;
      const totalHits = response.data.totalHits;

      if (!responseHits.length) {
        Notiflix.Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        e.target.reset();
        galleryItems.innerHTML = '';
        buttonHidden();
        return;
      }

      if (!picturesApiService.query) {
        clearAll();
        buttonHidden();
        Notiflix.Notify.info('You cannot search by empty field, try again.');
        return;
      } else {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        clearPicturesContainer();

        galleryItems.innerHTML = renderImageCards(responseHits);
        simpleLightbox.refresh();
        smoothScroll();

        if (totalHits <= responseHits.length) {
          buttonHidden();
          console.log(totalHits);
          setTimeout(() => {
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }, 5000);
          return;
        } else {
          buttonShow();
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}
// searchBtn.disabled = false;

function onLoadMore() {
  picturesApiService.page += 1;

  picturesApiService.fetchImages().then(response => {
    const responseHits = response.data.hits;

    galleryItems.insertAdjacentHTML(
      'beforeend',
      renderImageCards(responseHits)
    );
    simpleLightbox.refresh();
  });

  if (totalHits <= responseHits.length) {
    setTimeout(() => {
      buttonHidden();
      Notiflix.Report.info(
        "We're sorry, but you've reached the end of search results."
      );
    }, 5000);
  }

  smoothScroll();
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
    // isBtnVisible = false;
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
