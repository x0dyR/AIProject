// Scripts/registrationHandler.js
const User = require('../schemas/user');

async function registerUser({ username, email, password }) {
  try {
    // Проверяем, не существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'Пользователь с таким email уже существует.' };
    }

    // Создаём нового пользователя
    const newUser = new User({
      username: username.trim(),
      email: email.trim(),
      password: password.trim()
    });

    await newUser.save();
    return { success: true, message: 'Регистрация прошла успешно!' };
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return { success: false, message: error.message };
  }
}

module.exports = registerUser;
