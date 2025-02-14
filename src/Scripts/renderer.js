const { Ollama } = require('ollama');
const { fetchBookData } = require('./Scripts/bookService');

const ollama = new Ollama();

async function generateKeywords(wishes) {
    const response = await ollama.chat({
        model: "mistral",
        messages: [
            {
                role: "system",
                content: "Ты — интеллектуальный ассистент по подбору книг. " +
                    "На основе запроса пользователя выбери и предложи книгу, которая могла бы ему понравиться. " +
                    "Ответь исключительно на русском языке, без использования других языков."
            },
            { role: "user", content: wishes }
        ]
    });
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

        try {
            const keywordsText = await generateKeywords(wishes);
            const keywords = keywordsText.split(',').map(k => k.trim()).filter(Boolean);

            const searchQuery = keywords[0];

            //responseElement.innerHTML = `Ключевые слова: ${keywords.join(', ')}<br>Поиск книги по запросу: "${searchQuery}"...`;
            const bookData = await fetchBookData(searchQuery);
            
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
