const { } = require(`dotenv`).config();
const { OpenAI } = require(`openai`)

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const completion = openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
        { "role": "user", "content": "write a haiku about ai" },
    ],
});

completion.then((result) => console.log(result.choices[0].message));
// const { OpenAI } = require(`openai`)

// const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// function SendRequest() {
//     document.getElementsByClassName(`SendRequest`)[0].addEventListener(`click`, async () => {
//         try {
//             await TestRequest();

//         } catch (error) {
//             console.log(error)
//         }
//     })
// }

// async function TestRequest() {
//     const stream = await openai.chat.completions.create({
//         model: `chatgpt-4o-latest`,
//         messages: [{ role: `user`, content: `Say this is test` }],
//         store: true,
//         stream: true,
//     });

//     for await (const chunk of stream) {
//         process.stdout.write(chunk.choices[0]?.delta?.content || ``);
//     }
// }

function RequestBookText() {
    var inputValue = document.getElementsByClassName("BookRequestText")[0];
    var text = inputValue.value;
    console.log(text)
}