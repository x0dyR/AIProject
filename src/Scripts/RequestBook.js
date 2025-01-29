import "dotenv/config"
import { Ollama } from "ollama-node";

const ollama = new Ollama();
await ollama.setModel("llama2");

// callback to print each word 
const print = (word) => {
    process.stdout.write(word);
}
await ollama.streamingGenerate("why is the sky blue", print);
// const { OpenAI } = require(`openai`)

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_KEY,
//     dangerouslyAllowBrowser:true,
// });

// const completion = openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     store: true,
//     messages: [
//         { "role": "user", "content": "write a haiku about ai" },
//     ],
// });

// completion.then((result) => console.log(result.choices[0].message));

function RequestBookText() {
    var inputValue = document.getElementsByClassName("BookRequestText")[0];
    var text = inputValue.value;
    console.log(text)
}