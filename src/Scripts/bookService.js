// Scripts/bookService.js
async function fetchBookData(keyword) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(keyword)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.docs && data.docs.length > 0) {
        // Выбираем первый результат
        const book = data.docs[0];

        // Получаем URL обложки (если есть)
        const coverId = book.cover_i;
        const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';

        return {
            title: book.title || 'Нет названия',
            author: book.author_name ? book.author_name.join(', ') : 'Неизвестен',
            publishYear: book.first_publish_year || 'Неизвестен',
            coverUrl,
            subjects: book.subject ? book.subject.slice(0, 5) : [],
            description: book.first_sentence || 'Описание недоступно'
        };
    } else {
        throw new Error('Книга не найдена');
    }
}

// Экспортируем функцию через CommonJS:
module.exports = { fetchBookData };
