//import axios from 'axios';
//import Notiflix from 'notiflix';

//Notiflix.Notify.Init({
//   width: '300px',
//   position: 'right-bottom',
//   fontSize: '16px',
//   distance: '10px',
//   borderRadius: '5px',
//   timeout: 3000,
// });

//document.addEventListener('DOMContentLoaded', () => {
//  const form = document.getElementById('search-form');
//  const gallery = document.getElementById('gallery');
//  const loadMoreBtn = document.getElementById('load-more');
//  let page = 1; // Початкова сторінка

//  form.addEventListener('submit', async (event) => {
//    event.preventDefault();

//    // Очистка галереї перед новим пошуком
//    gallery.innerHTML = '';
//    page = 1; // Скидання сторінки при новому пошуку

//    const searchQuery = form.searchQuery.value;
//    if (searchQuery.trim() !== '') {
//      // Виклик функції для виконання HTTP-запиту
//      await performSearch(searchQuery, page);
//      // Показ кнопки "Load more"
//      loadMoreBtn.style.display = 'block';
//    }
//  });

//  loadMoreBtn.addEventListener('click', async () => {
//    page++; // Збільшення сторінки при натисканні кнопки "Load more"
//    const searchQuery = form.searchQuery.value;
//    await performSearch(searchQuery, page);
//  });

//  async function performSearch(query, currentPage) {
//    try {
//      const apiKey = '40756450-2b62d5efbb9c5d98f0ec642a2'; // Замініть на свій API-ключ Pixabay
//      const perPage = 40; // Кількість зображень на сторінці

//      const response = await axios.get('https://pixabay.com/api/', {
//        params: {
//          key: apiKey,
//          q: query,
//          image_type: 'photo',
//          orientation: 'horizontal',
//          safesearch: true,
//          page: currentPage,
//          per_page: perPage,
//        },
//      });

//      const images = response.data.hits;
//      if (images.length === 0) {
//        // Вивід повідомлення, якщо результатів не знайдено
//        alert('Sorry, there are no images matching your search query. Please try again.');
//      } else {
//        // Додавання зображень до галереї
//        images.forEach((image) => {
//          const card = createPhotoCard(image);
//          gallery.appendChild(card);
//        });

//        // Перевірка на кінець колекції
//        const totalHits = response.data.totalHits || 0;
//        const totalPages = Math.ceil(totalHits / perPage);
//        if (currentPage >= totalPages) {
//          loadMoreBtn.style.display = 'none';
//          alert("We're sorry, but you've reached the end of search results.");
//        }
//      }
//    } catch (error) {
//      console.error('Error fetching images:', error);
//      alert('An error occurred while fetching images. Please try again.');
//    }
//  }

//  function createPhotoCard(image) {
//    const card = document.createElement('div');
//    card.className = 'photo-card';

//    const img = document.createElement('img');
//    img.src = image.webformatURL;
//    img.alt = image.tags;
//    img.loading = 'lazy';

//    const info = document.createElement('div');
//    info.className = 'info';

//    const likes = document.createElement('p');
//    likes.className = 'info-item';
//    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

//    const views = document.createElement('p');
//    views.className = 'info-item';
//    views.innerHTML = `<b>Views:</b> ${image.views}`;

//    const comments = document.createElement('p');
//    comments.className = 'info-item';
//    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

//    const downloads = document.createElement('p');
//    downloads.className = 'info-item';
//    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

//    info.appendChild(likes);
//    info.appendChild(views);
//    info.appendChild(comments);
//    info.appendChild(downloads);

//    card.appendChild(img);
//    card.appendChild(info);

//    return card;
//  }
//});

import axios from 'axios';
import Notiflix from 'notiflix';

Notiflix.Notify.Init({
  width: '300px',
  position: 'right-bottom',
  fontSize: '16px',
  distance: '10px',
  borderRadius: '5px',
  timeout: 3000,
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const gallery = document.getElementById('gallery');
  const loadMoreBtn = document.getElementById('load-more');
  let page = 1; // Початкова сторінка

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Очистка галереї перед новим пошуком
    gallery.innerHTML = '';
    page = 1; // Скидання сторінки при новому пошуку

    const searchQuery = form.searchQuery.value;
    if (searchQuery.trim() !== '') {
      try {
        const images = await performSearch(searchQuery, page);

        if (images.length === 0) {
          // Вивід повідомлення, якщо результатів не знайдено
          Notiflix.Notify.Info('Sorry, there are no images matching your search query. Please try again.');
        } else {
          // Додавання зображень до галереї
          images.forEach((image) => {
            const card = createPhotoCard(image);
            gallery.appendChild(card);
          });

          // Показ кнопки "Load more"
          loadMoreBtn.style.display = 'block';

          // Перевірка на кінець колекції
          const totalHits = images.totalHits || 0;
          const totalPages = Math.ceil(totalHits / images.per_page);
          if (page >= totalPages) {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.Warning("We're sorry, but you've reached the end of search results.");
          }
        }
      } catch (error) {
        console.error('Error during search:', error);
        Notiflix.Notify.Failure('An error occurred during the search. Please try again.');
      }
    }
  });

  loadMoreBtn.addEventListener('click', async () => {
    page++; // Збільшення сторінки при натисканні кнопки "Завантажити ще"
    const searchQuery = form.searchQuery.value;
    try {
      const images = await performSearch(searchQuery, page);
      // Додавання зображень до галереї
      images.forEach((image) => {
        const card = createPhotoCard(image);
        gallery.appendChild(card);
      });

      // Перевірка на кінець колекції
      const totalHits = images.totalHits || 0;
      const totalPages = Math.ceil(totalHits / images.per_page);
      if (page >= totalPages) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.Warning("We're sorry, but you've reached the end of search results.");
      }
    } catch (error) {
      console.error('Error during "Load more":', error);
      Notiflix.Notify.Failure('An error occurred while loading more images. Please try again.');
    }
  });

  async function performSearch(query, currentPage) {
    try {
      const apiKey = 'YOUR_PIXABAY_API_KEY'; // Замініть на свій ключ Pixabay API
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

      return response.data;
    } catch (error) {
      throw error; // Rethrow the error for better handling in the calling function
    }
  }

  function createPhotoCard(image) {
    // ... (unchanged)
  }
});
