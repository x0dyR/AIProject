// Scripts/popular.js
const { fetchBookData } = require('./Scripts/bookService');

document.addEventListener('DOMContentLoaded', async () => {
  const popularContainer = document.getElementById('popularBooksContainer');
  if (!popularContainer) return;

  // Предположим, что это «популярные» книги
  const popularTitles = [
    "Война и мир",
    "Преступление и наказание",
    "Мастер и Маргарита"
  ];

  // Заголовок/прелоадер
  popularContainer.textContent = 'Загрузка популярных книг...';

  try {
    // Запрашиваем данные для каждой популярной книги
    const bookPromises = popularTitles.map(title => fetchBookData(title));
    const booksData = await Promise.all(bookPromises);
    const validBooks = booksData.filter(b => b);

    if (validBooks.length === 0) {
      popularContainer.textContent = 'Популярные книги не найдены.';
      return;
    }

    // Создаём контейнер для карточек
    const booksContainer = document.createElement('div');
    booksContainer.classList.add('books-container');

    validBooks.forEach(bookData => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('book-card');
      cardDiv.innerHTML = `
        <h2>${bookData.title}</h2>
        <p><strong>Автор:</strong> ${bookData.author}</p>
        <p><strong>Год издания:</strong> ${bookData.publishYear}</p>
        ${
          bookData.coverUrl
            ? `<img src="${bookData.coverUrl}" alt="Обложка книги" class="book-cover" onerror="this.src='./Art/DefaultBook.jpg';">`
            : `<img src="./Art/DefaultBook.jpg" alt="Обложка книги" class="book-cover">`
        }
        <p class="description"><strong>Описание:</strong> ${bookData.description}</p>
      `;
      booksContainer.appendChild(cardDiv);
    });

    // Очищаем контейнер и вставляем список книг
    popularContainer.innerHTML = '';
    popularContainer.appendChild(booksContainer);

  } catch (error) {
    console.error('Ошибка при загрузке популярных книг:', error);
    popularContainer.textContent = 'Ошибка при загрузке популярных книг.';
  }
});
