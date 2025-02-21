const mongoose = require('mongoose');

const password = encodeURIComponent(process.env.MONGO_PASSWD);
const uri = `mongodb+srv://xody:${password}@aiproject.ncjxz.mongodb.net/AIProject?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Подключение к MongoDB через Mongoose успешно!');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  }
};

module.exports = connectDB;
