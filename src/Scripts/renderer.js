const { Ollama } = require('ollama');
const { fetchBookData } = require('./Scripts/bookService');

const ollama = new Ollama();

async function generateKeywords(wishes) {
    const response = await ollama.chat({
        model: "llama3.2",
        messages: [
            {
                role: "system",
                content: "You are an intellectual book recommendation assistant. Provide exactly 5 exact book titles separated by commas, without any additional explanation. If you cannot find suitable books, simply respond with an empty string."
            },
            { role: "user", content: wishes }
        ]
    });
    return response.message.content;
}

document.addEventListener('DOMContentLoaded', () => {

    const oldTableCell = document.querySelector('#oldTable td');
    if (oldTableCell) {
        oldTableCell.innerHTML = '';
    }

    const container = document.getElementById('newTableContainer');
    const button = document.querySelector('.SendRequest');
    const input = document.querySelector('.BookRequestText');

    button.addEventListener('click', async () => {
        const wishes = input.value.trim();
        if (!wishes) {
            if (container) {
                container.innerText = 'Пожалуйста, введите свои пожелания.';
            }
            return;
        }

        try {
            const keywordsText = await generateKeywords(wishes);
            const keywords = keywordsText.split(',').map(k => k.trim()).filter(Boolean);
            const selectedKeywords = keywords.slice(0, 5);

            if (container) {
                container.innerHTML = `Ключевые слова: ${selectedKeywords.join(', ')}<br>Поиск книг по запросам...`;
            }

            // Получаем данные для каждой книги
            const bookPromises = selectedKeywords.map(keyword => fetchBookData(keyword));
            const booksData = await Promise.all(bookPromises);
            const validBooks = booksData.filter(book => book !== null);

            if (validBooks.length === 0) {
                container.innerHTML = "Ни одна из книг не найдена.";
                return;
            }

            // Создаём таблицу
            const newTable = document.createElement('table');
            const newTbody = document.createElement('tbody');
            const newTr = document.createElement('tr');

            validBooks.forEach(bookData => {
                const newTd = document.createElement('td');
                const bookInfoHTML = `
                    <h2>${bookData.title}</h2>
                    <p><strong>Автор:</strong> ${bookData.author}</p>
                    <p><strong>Год издания:</strong> ${bookData.publishYear}</p>
                    ${bookData.coverUrl ? `<img src="${bookData.coverUrl}" alt="Обложка книги">` : ''}
                    ${bookData.subjects && bookData.subjects.length > 0 ? `<p><strong>Темы:</strong> ${bookData.subjects.join(', ')}</p>` : ''}
                    <p><strong>Описание:</strong> ${bookData.description}</p>
                `;
                newTd.innerHTML = bookInfoHTML;
                newTr.appendChild(newTd);
            });

            newTbody.appendChild(newTr);
            newTable.appendChild(newTbody);
            container.innerHTML = '';
            container.appendChild(newTable);

        } catch (error) {
            console.error("Ошибка:", error);
            if (container) {
                container.innerText = "Произошла ошибка: " + error.message;
            }
        }
    });
});
