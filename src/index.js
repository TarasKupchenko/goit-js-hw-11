
import axios from 'axios';
import Notiflix from 'notiflix';

// Решта вашого коду...
const axios = require('axios');
const Notiflix = require('notiflix');

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = 'ВАШ_API_КЛЮЧ';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;

form.addEventListener('submit', handleSearch);

loadMoreBtn.addEventListener('click', loadMore);

async function handleSearch(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  loadMoreBtn.style.display = 'none';

  const searchQuery = event.target.searchQuery.value;
  if (searchQuery.trim() === '') {
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
      },
    });

    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      renderGallery(images);
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function renderGallery(images) {
  const galleryMarkup = images.map((image) => `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>`).join('');

  gallery.insertAdjacentHTML('beforeend', galleryMarkup);
}

async function loadMore() {
  page += 1;
  const searchQuery = form.searchQuery.value;
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
      },
    });

    const images = response.data.hits;
    if (images.length === 0) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      renderGallery(images);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
