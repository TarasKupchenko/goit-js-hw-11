import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  width: '300px',
  position: 'right-bottom',
  fontSize: '16px',
  distance: '10px',
  borderRadius: '5px',
  timeout: 3000,
});

const gallery = document.getElementById('gallery');
const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more');
let page = 1;
let totalHits = 0;
let perPage = 40;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const searchQuery = form.searchQuery.value.trim();
  
  if (searchQuery !== '') {
    try {
      const { images, currentTotalHits } = await performSearch(searchQuery, page);
      totalHits = currentTotalHits;
      displayImages(images);
    } catch (error) {
      console.error('Error during search:', error);
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  const searchQuery = form.searchQuery.value.trim();
  
  try {
    const { images, currentTotalHits } = await performSearch(searchQuery, page);
    totalHits = currentTotalHits;
    displayImages(images);
  } catch (error) {
    console.error('Error during "Load more":', error);
    Notiflix.Notify.failure('An error occurred while loading more images. Please try again.');
  }
});

async function performSearch(query, currentPage) {
  try {
    const apiKey = '40756450-2b62d5efbb9c5d98f0ec642a2'; 
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: perPage,
      },
    });

    const currentTotalHits = response.data.totalHits || 0;
    const images = response.data.hits;

    return { images, currentTotalHits };
  } catch (error) {
    throw error;
  }
}

function displayImages(images) {
  images.forEach((image) => {
    const card = createPhotoCard(image);
    gallery.appendChild(card);
  });

  const totalPages = Math.ceil(totalHits / perPage);

  if (page >= totalPages) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = 'block';
  }

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();

  const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function createPhotoCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const anchor = document.createElement('a');
  anchor.href = image.largeImageURL;
  anchor.setAttribute('data-lightbox', 'gallery');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  anchor.appendChild(img);

  const info = document.createElement('div');
  info.classList.add('info');

  const infoItems = [
    { label: 'Likes', value: image.likes },
    { label: 'Views', value: image.views },
    { label: 'Comments', value: image.comments },
    { label: 'Downloads', value: image.downloads },
  ];

  infoItems.forEach((item) => {
    const p = document.createElement('p');
    p.classList.add('info-item');
    p.innerHTML = `<b>${item.label}</b>: ${item.value}`;
    info.appendChild(p);
  });

  card.appendChild(anchor);
  card.appendChild(info);

  return card;
}
