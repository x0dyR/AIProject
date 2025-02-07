// renderer.js
const { Ollama } = require('ollama');
const { fetchBookData } = require('./Scripts/bookService');

const ollama = new Ollama();

/**
 * Функция, которая по пожеланиям пользователя генерирует ключевые слова для поиска книги.
 * Система должна вернуть строку с одним или двумя ключевыми словами, разделёнными запятой.
 */
async function generateKeywords(wishes) {
    const response = await ollama.chat({
        model: "mistral", // или другой модельный идентификатор, если требуется
        messages: [
            { 
                role: "system", 
                content: "Ты помощник, который извлекает ключевые слова для поиска книги. " +
                         "Отвечай только на русском языке. Из полученных пожеланий выбери одно или два наиболее релевантных ключевых слова, разделённые запятой, без дополнительных пояснений." 
            },
            { role: "user", content: wishes }
        ]
    });
    // Предполагаем, что ответ выглядит примерно так: "роман, мистика"
    return response.message.content;
}

document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.SendRequest');
    const responseElement = document.querySelector('.responseText');
    const input = document.querySelector('.BookRequestText');

    button.addEventListener('click', async () => {
        const wishes = input.value.trim();
        if (!wishes) {
            responseElement.innerText = 'Пожалуйста, введите свои пожелания.';
            return;
        }

        //responseElement.innerHTML = 'Генерация ключевых слов...';

        try {
            // Генерируем ключевые слова из пожеланий пользователя
            const keywordsText = await generateKeywords(wishes);
            // Разбиваем по запятой и убираем лишние пробелы
            const keywords = keywordsText.split(',').map(k => k.trim()).filter(Boolean);

            // Для простоты возьмём первый ключевой запрос
            const searchQuery = keywords[0];

            //responseElement.innerHTML = `Ключевые слова: ${keywords.join(', ')}<br>Поиск книги по запросу: "${searchQuery}"...`;

            // Запрашиваем данные книги из онлайн-библиотеки по сгенерированному ключевому слову
            const bookData = await fetchBookData(searchQuery);

            // Формируем HTML для отображения данных книги
            const bookInfoHTML = `
                <h2>${bookData.title}</h2>
                <p><strong>Автор:</strong> ${bookData.author}</p>
                <p><strong>Год издания:</strong> ${bookData.publishYear}</p>
                ${bookData.coverUrl ? `<img src="${bookData.coverUrl}" alt="Обложка книги">` : ''}
                ${bookData.subjects.length > 0 ? `<p><strong>Темы:</strong> ${bookData.subjects.join(', ')}</p>` : ''}
                <p><strong>Описание:</strong> ${bookData.description}</p>
            `;

            responseElement.innerHTML += `<hr>${bookInfoHTML}`;
        } catch (error) {
            console.error("Ошибка:", error);
            responseElement.innerText = "Произошла ошибка: " + error.message;
        }
    });
});
