const { } = require(`dotenv/config`)
const { Ollama } = require(`ollama`)
const { RequestBookText } = require(`./HandleButton.js`)

const ollama = new Ollama();

const bookText = RequestBookText();

const response = await ollama.chat({
    model: "mistral",
    messages: [
        { role: "system", content: "Ты помощник, который может предложить книги" },
        { role: "user", content:  "Порекомендуй мне книги про галактику"},
    ],
});
console.log(response.message.content)


document.getElementsByClassName("responseText")[0].innerText = response.message.content;