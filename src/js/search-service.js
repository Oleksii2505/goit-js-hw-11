import axios from 'axios';

export default class SearchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImages() {
    return await axios
      .get(
        `https://pixabay.com/api/?key=32660028-03ca1b6b6beafd561d722c8e2&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
      )
      .then(data => {
        return data;
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

// 34346639-e8efe2ce21a3e54ecceb798ec
