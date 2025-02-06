// renderer.js
const { Ollama } = require('ollama');
const { fetchBookData } = require('./Scripts/bookService.js');

// Пример использования:
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.SendRequest');
    const responseElement = document.querySelector('.responseText');

    button.addEventListener('click', async () => {
        const keyword = document.querySelector('.BookRequestText').value.trim();
        if (!keyword) {
            responseElement.innerText = 'Введите ключевое слово для поиска книги.';
            return;
        }
        responseElement.innerHTML = 'Загрузка...';
        try {
            const bookData = await fetchBookData(keyword);
            // Вывод данных на страницу:
            responseElement.innerHTML = `
                <h2>${bookData.title}</h2>
                <p><strong>Автор:</strong> ${bookData.author}</p>
                <p><strong>Год издания:</strong> ${bookData.publishYear}</p>
                ${bookData.coverUrl ? `<img src="${bookData.coverUrl}" alt="Обложка книги">` : ''}
                ${bookData.subjects.length > 0 ? `<p><strong>Темы:</strong> ${bookData.subjects.join(', ')}</p>` : ''}
                <p><strong>Описание:</strong> ${bookData.description}</p>
            `;
        } catch (error) {
            console.error("Ошибка:", error);
            responseElement.innerText = "Произошла ошибка: " + error.message;
        }
    });
});


// Функция для получения текста из поля ввода
function bookText() {
    const inputElement = document.querySelector(".BookRequestText");
    return inputElement.value;
}

// Функция для вызова Ollama (рекомендации)
async function RequestBookText() {
    const response = await ollama.chat({
        model: "mistral",
        messages: [
            { 
                role: "system", 
                content: "Отвечай только и исключительно на русском языке. " +
                         "Ты помощник, который рекомендует книги. " +
                         "Если пользователь вводит ключевое слово, выбери книгу, " +
                         "в которой упоминается это слово в названии или описании."
            },
            { role: "user", content: bookText() },
        ],
    });
    return response;
}