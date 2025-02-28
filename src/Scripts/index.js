// Scripts/index.js
window.addEventListener('DOMContentLoaded', () => {
  // Динамическая шапка
  const userMenu = document.getElementById('userMenu');
  const userData = localStorage.getItem('loggedInUser');

  if (userMenu) {
    if (userData) {
      const user = JSON.parse(userData);
      userMenu.innerHTML = `
        <span>Вы вошли как ${user.username}</span>
        <button id="logoutBtn">Выйти</button>
      `;
      document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.reload();
      });
    } else {
      userMenu.innerHTML = `
        <a href="./login.html"><h2>Вход</h2></a>
        <a href="./registration.html"><h2>Регистрация</h2></a>
      `;
    }
  }

  // Если элемент для популярных книг существует (на index.html), заполняем его
  const popularContainer = document.getElementById('popularBooksContainer');
  if (popularContainer) {
    const popularBooks = [
      {
        title: "1984",
        author: "Джордж Оруэлл",
        publishYear: "1949",
        coverUrl: "./Art/1984.jpg",
        description: "Антиутопический роман о тоталитарном режиме и контроле общества."
      },
      {
        title: "Мастер и Маргарита",
        author: "Михаил Булгаков",
        publishYear: "1966",
        coverUrl: "./Art/master_and_margarita.jpg",
        description: "Фантастический роман, сочетающий сатиру, мистику и философию."
      },
      {
        title: "Убийство в Восточном экспрессе",
        author: "Агата Кристи",
        publishYear: "1934",
        coverUrl: "./Art/murder_on_orient_express.jpg",
        description: "Классический детектив о загадочном убийстве в роскошном поезде."
      }
      // Добавьте другие книги по желанию
    ];

    let html = "";
    popularBooks.forEach(book => {
      html += `
        <div class="book-card">
          <h3>${book.title}</h3>
          <p><strong>Автор:</strong> ${book.author}</p>
          <p><strong>Год издания:</strong> ${book.publishYear}</p>
          <img src="${book.coverUrl}" alt="Обложка книги">
          <p class="description">${book.description}</p>
        </div>
      `;
    });
    popularContainer.innerHTML = html;
  }
});
