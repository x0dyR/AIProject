const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js', // путь к вашему входному файлу
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    // Плагин dotenv-webpack загрузит переменные из файла .env и заменит process.env.XXX в коде
    new Dotenv()
  ],
  module: {
    rules: [
      // Здесь могут быть настройки для babel, css-loader и т.д.
    ]
  }
};
