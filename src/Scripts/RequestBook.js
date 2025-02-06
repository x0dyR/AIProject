const { Ollama } = require(`ollama`)

const ollama = new Ollama();

const bookText = () => {
    const inputElement = document.getElementsByClassName("BookRequestText")[0];
    const text = inputElement.value;
    console.log(text);
    return text;
}

async function RequestBookText() {
    const response = await ollama.chat({
        model: "mistral",
        messages: [
            { 
                role: "system", 
                content: "Отвечай только и исключительно на русском языке. " +
                         "Ты помощник, который рекомендует книги. " +
                         "Если пользователь вводит ключевое слово, выбери книгу, " +
                         "в которой упоминается это слово в названии или описании. "
            },
            { role: "user", content: bookText() },
        ],
    });
    return response;
}


document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.SendRequest');
    const responseElement = document.querySelector('.responseText');

    button.addEventListener('click', async () => {
        try {
            const response = await RequestBookText();
            console.log(response.message.content);
            responseElement.innerText = response.message.content;
        } catch (error) {
            console.error("Ошибка при запросе книги:", error);
            responseElement.innerText = "Произошла ошибка!";
        }
    });
});

