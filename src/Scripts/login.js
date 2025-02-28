// Scripts/login.js
const { ipcRenderer } = require('electron');

document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const identifier = document.getElementById('identifier').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('message');

  try {
    const result = await ipcRenderer.invoke('login-user', { identifier, password });
    if (result.success) {
      // Сохраняем данные о пользователе
      localStorage.setItem('loggedInUser', JSON.stringify(result.user));
      messageDiv.textContent = `Вы вошли как ${result.user.username}`;

      // Перенаправляем на главную через 1.5 секунды
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1500);
    } else {
      messageDiv.textContent = 'Ошибка входа: ' + result.message;
    }
  } catch (error) {
    console.error('Ошибка при логине:', error);
  }
});
