// Scripts/bookService.js
const fetch = require('node-fetch');

const genreTranslations = {
  "Fiction": "Художественная литература",
  "Science": "Наука",
  "History": "История",
  "Biography": "Биография",
  "Fantasy": "Фэнтези",
  "Thriller": "Триллер",
  "Philosophy": "Философия",
  "Self-Help": "Саморазвитие",
  "Computers": "Компьютеры",
  "Business & Economics": "Бизнес и экономика",
  "Art": "Искусство",
  "Biography & Autobiography": "Биография и автобиография",
  "Poetry": "Поэзия",
  "Political Science": "Политология",
  "Juvenile Nonfiction": "Детская нехудожественная литература",
  "Mystery": "Детектив",
  "Horror": "Ужасы",
  "Romance": "Роман",
  "Science Fiction": "Научная фантастика",
  "Nonfiction": "Нехудожественная литература",
  "Adventure": "Приключения",
  "Health": "Здоровье",
  "Travel": "Путешествия",
  "Comics": "Комиксы",
  "Drama": "Драма",
  "Educational": "Образовательная литература",
  "Cooking": "Кулинария",
  "Religion": "Религия",
  "Sports": "Спорт",
  "Music": "Музыка",
  "Photography": "Фотография"
};

function translateGenres(genres) {
  return genres.map(genre => genreTranslations[genre] || genre);
}

async function fetchBookData(query) {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q="${encodeURIComponent(query)}"`;
    console.log('Запрос к Google Books API:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      console.error("Книги не найдены для запроса:", query);
      return null;
    }

    const book = data.items[0].volumeInfo;
    return {
      title: book.title
        ? (book.title.length > 20
            ? book.title.substring(0, 20) + "..."
            : book.title)
        : "Без названия",
      author: book.authors
        ? (book.authors.join(', ').length > 20
            ? book.authors.join(', ').substring(0, 20) + "..."
            : book.authors.join(', '))
        : "Неизвестен",
      publishYear: book.publishedDate
        ? book.publishedDate.substring(0, 4)
        : "Неизвестен",
      coverUrl: (book.imageLinks && book.imageLinks.thumbnail)
        ? book.imageLinks.thumbnail
        : './Art/DefaultBook.jpg',
      subjects: book.categories
        ? translateGenres(book.categories)
        : [],
      description: book.description
        ? (book.description.length > 200
            ? book.description.substring(0, 100) + "..."
            : book.description)
        : "Описание отсутствует"
    };
  } catch (error) {
    console.error("Ошибка при выполнении запроса к Google Books API:", error);
    return null;
  }
}

module.exports = { fetchBookData };
