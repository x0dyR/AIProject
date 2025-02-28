// Scripts/loginHandler.js
const User = require('../schemas/user');

async function loginUser({ identifier, password }) {
  try {
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    // Пытаемся найти пользователя по email
    let user = await User.findOne({ email: trimmedIdentifier });
    if (!user) {
      // Если не нашли, ищем по username
      user = await User.findOne({ username: trimmedIdentifier });
    }
    if (!user) {
      return { success: false, message: 'Пользователь не найден.' };
    }

    // Сравниваем пароли
    if (user.password !== trimmedPassword) {
      return { success: false, message: 'Неверный пароль.' };
    }

    return {
      success: true,
      message: 'Вход выполнен успешно!',
      user: {
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return { success: false, message: error.message };
  }
}

module.exports = loginUser;
