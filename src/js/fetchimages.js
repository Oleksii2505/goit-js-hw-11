import axios from 'axios';
export async function fetchImages(name, page, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '34346639 - e8efe2ce21a3e54ecceb798ec';
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}
