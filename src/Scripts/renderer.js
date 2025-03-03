// Scripts/renderer.js
if (!localStorage.getItem('loggedInUser')) {
    alert("Для подбора книг необходимо войти в систему");
    window.location.href = "./login.html";
  } else {
    const { Ollama } = require('ollama');
    const { fetchBookData } = require('./Scripts/bookService'); // ОТНОСИТЕЛЬНЫЙ путь, так как оба файла находятся в папке Scripts
  
    const ollama = new Ollama();
  
    async function generateKeywords(wishes) {
      // Получаем данные онбординга из localStorage
      const onboardingData = localStorage.getItem('onboardingData');
      if (!onboardingData) {
        // Если онбординг не заполнен, перенаправляем на страницу онбординга
        window.location.href = "./onboarding.html";
        return;
      }
      const { favoriteGenres, favoriteAuthors, readingGoals } = JSON.parse(onboardingData);
      const onboardingPrompt = `Предпочтительные жанры: ${favoriteGenres}. Любимые авторы: ${favoriteAuthors}. Цель чтения: ${readingGoals}. `;
      
      const fullPrompt = `${onboardingPrompt} На основе этих данных и запроса "${wishes}", предложи 5 названий книг через запятую. Без лишних пояснений. Ответ на русском языке.`;
  
      const response = await ollama.chat({
        model: "llama3.2",
        messages: [
          {
            role: "system",
            content: "Ты интеллектуальный ассистент по подбору книг. Используй предоставленные предпочтения для более точного подбора."
          },
          { role: "user", content: fullPrompt }
        ]
      });
      return response.message.content;
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('newTableContainer');
      const button = document.querySelector('.SendRequest');
      const input = document.querySelector('.BookRequestText');
  
      // Если данные онбординга есть, заполним поле ввода любимыми жанрами
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const { favoriteGenres } = JSON.parse(onboardingData);
        if (favoriteGenres && favoriteGenres.trim().length >= 5) {
          input.value = favoriteGenres;
          // Автоматически запускаем поиск через небольшую задержку
          setTimeout(() => {
            button.click();
          }, 300);
        }
      }
  
      button.addEventListener('click', async () => {
        const wishes = input.value.trim();
        if (!wishes) {
          container.innerText = 'Пожалуйста, введите свои пожелания.';
          return;
        }
  
        try {
          container.innerHTML = 'Генерируем ключевые слова...';
          const keywordsText = await generateKeywords(wishes);
  
          // Если generateKeywords вернул undefined (например, из-за редиректа), прекращаем выполнение
          if (!keywordsText) return;
  
          // Разбиваем строку на массив, убираем лишние пробелы
          const keywords = keywordsText.split(',')
            .map(k => k.trim())
            .filter(Boolean);
  
          const uniqueKeywords = [...new Set(keywords)];
          const selectedKeywords = uniqueKeywords.slice(0, 5);
  
          container.innerHTML = `Ключевые слова: ${selectedKeywords.join(', ')}<br>Поиск книг по запросам...`;
  
          // Запрашиваем данные из Google Books API по каждому ключевому слову
          const bookPromises = selectedKeywords.map(keyword => fetchBookData(keyword));
          const booksData = await Promise.all(bookPromises);
          const validBooks = booksData.filter(book => book !== null);
  
          if (validBooks.length === 0) {
            container.innerHTML = "Ни одна из книг не найдена.";
            return;
          }
  
          // Создаем контейнер для карточек
          const booksContainer = document.createElement('div');
          booksContainer.classList.add('books-container');
  
          validBooks.forEach(bookData => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('book-card');
            cardDiv.innerHTML = `
              <h2>${bookData.title}</h2>
              <p><strong>Автор:</strong> ${bookData.author}</p>
              <p><strong>Год издания:</strong> ${bookData.publishYear}</p>
              ${
                bookData.coverUrl
                  ? `<img src="${bookData.coverUrl}" alt="Обложка книги" class="book-cover" onerror="this.src='../Art/DefaultBook.jpg';">`
                  : `<img src="../Art/DefaultBook.jpg" alt="Обложка книги" class="book-cover">`
              }
              ${
                bookData.subjects && bookData.subjects.length > 0
                  ? `<p><strong>Темы:</strong> ${bookData.subjects.join(', ')}</p>`
                  : ''
              }
              <p class="description"><strong>Описание:</strong> ${bookData.description}</p>
            `;
            booksContainer.appendChild(cardDiv);
          });
  
          container.innerHTML = '';
          container.appendChild(booksContainer);
  
        } catch (error) {
          console.error("Ошибка:", error);
          container.innerText = "Произошла ошибка: " + error.message;
        }
      });
    });
  }
  