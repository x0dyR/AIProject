// db.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI; // Строка подключения в .env
    await mongoose.connect(uri, {
      // Если драйвер 4.x, useNewUrlParser и useUnifiedTopology больше не нужны
    });
    console.log('Подключение к MongoDB успешно!');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
    throw error;
  }
}

module.exports = connectDB;
