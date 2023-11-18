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
let page = 1; // Початкова сторінка

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const searchQuery = form.searchQuery.value.trim();
  
  if (searchQuery !== '') {
    try {
      const { images, totalHits } = await performSearch(searchQuery, page);
      displayImages(images);

      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

      loadMoreBtn.style.display = 'block';
    } catch (error) {
      //console.error('Error during search:', error);
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  const searchQuery = form.searchQuery.value.trim();
  
  try {
    const { images } = await performSearch(searchQuery, page);
    displayImages(images);
  } catch (error) {
    console.error('Error during "Load more":', error);
    Notiflix.Notify.failure('An error occurred while loading more images. Please try again.');
  }
});

async function performSearch(query, currentPage) {
  try {
    const apiKey = '40756450-2b62d5efbb9c5d98f0ec642a2'; 
    const perPage = 40;

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

    const totalHits = response.data.totalHits || 0;
    const images = response.data.hits;

    return { images, totalHits };
  } catch (error) {
    throw error;
  }
}

function displayImages(images) {
  images.forEach((image) => {
    const card = createPhotoCard(image);
    gallery.appendChild(card);
  });

  // Перевірка на кінець колекції
  const totalHits = images.totalHits || 0;
  const totalPages = Math.ceil(totalHits / images.per_page);
  if (page >= totalPages) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }

  // Виклик методу refresh() бібліотеки SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();

   // Плавне прокручування сторінки
   const cardHeight = gallery.firstElementChild.getBoundingClientRect().height;
   window.scrollBy({
     top: cardHeight * 2,
     behavior: 'smooth',
   });
}

function createPhotoCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  // Create an anchor element to wrap the image
  const anchor = document.createElement('a');
  anchor.href = image.largeImageURL; // Set the larger image URL as the anchor's href
  anchor.setAttribute('data-lightbox', 'gallery'); // Set data-lightbox attribute for SimpleLightbox

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  // Append the image to the anchor
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

  card.appendChild(anchor); // Append the anchor to the card
  card.appendChild(info);

  return card;
}
