const fetch = require('node-fetch');

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
            title: book.title ? (book.title.length > 20 ? book.title.substring(0, 30) : book.title) : "Без названия",
            author: book.authors ? book.authors.join(', ') : "Неизвестен",
            publishYear: book.publishedDate ? book.publishedDate.substring(0, 4) : "Неизвестен",
            coverUrl: book.imageLinks ? book.imageLinks.thumbnail : "",
            subjects: book.categories || [],
            description: book.description ? (book.description.length > 200 ? book.description.substring(0, 200) + "...": book.description) : "Описание отсутствует"
        };

    } catch (error) {
        console.error("Ошибка при выполнении запроса к Google Books API:", error);
        return null;
    }
}

module.exports = { fetchBookData };
