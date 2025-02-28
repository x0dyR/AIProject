// Scripts/register.js
const { ipcRenderer } = require('electron');

document.getElementById('registrationForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Вызываем IPC 'register-user'
    const result = await ipcRenderer.invoke('register-user', { username, email, password });
    const messageDiv = document.getElementById('message');

    if (result.success) {
      messageDiv.textContent = result.message;
      // Можно автоматически перейти на страницу логина:
      // window.location.href = "./login.html";
    } else {
      messageDiv.textContent = 'Ошибка регистрации: ' + result.message;
    }
  } catch (error) {
    console.error('Ошибка при отправке запроса:', error);
  }
});
