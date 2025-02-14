const axios = require('axios');

async function fetchBookData(query) {
    try {
        // Формируем URL для запроса. Если у вас есть API ключ, его можно добавить через &key=ВАШ_API_KEY
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        
        if (response.data.totalItems > 0) {
            // Берём первую книгу из результатов
            const book = response.data.items[0].volumeInfo;

            console.log(url)

            return {
                title: book.title || 'Без названия',
                author: book.authors ? book.authors.join(', ') : 'Неизвестный автор',
                publishYear: book.publishedDate ? book.publishedDate.substring(0, 4) : 'Неизвестен',
                coverUrl: book.imageLinks ? book.imageLinks.thumbnail : '',
                subjects: book.categories || [],
                description: book.description || 'Нет описания'
            };
        } else {
            throw new Error('Книги не найдены');
        }
    } catch (error) {
        throw new Error('Ошибка при получении данных книги: ' + error.message);
    }
}

module.exports = { fetchBookData };
