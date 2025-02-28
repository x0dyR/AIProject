// main.js
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
require('dotenv/config');

// Подключение к базе MongoDB
const connectDB = require('./db');

// Импорт обработчиков регистрации и логина
const registerUser = require('./Scripts/registrationHandler');
const loginUser = require('./Scripts/loginHandler');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // Для упрощения, чтобы использовать require в рендерере
      contextIsolation: false
    }
  });
  // Загружаем главную страницу (например, index.html с популярными книгами)
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

const menuTemplate = [
  {
    label: 'User',
    submenu: [
      {
        label: 'Login',
        click: () => { mainWindow.loadFile('./src/login.html'); }
      },
      {
        label: 'Sign Up',
        click: () => { mainWindow.loadFile('./src/registration.html'); }
      },
      {
        label: 'Search Recommendations',
        click: () => { mainWindow.loadFile('./src/search.html'); }
      },
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          if (focusedWindow) {
            focusedWindow.reload();
          }
        }
      },
      {
        label: 'DevTools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => {
          const focusedWindow = BrowserWindow.getFocusedWindow();
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        }
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      }
    ]
  }
];

// IPC-обработчики для регистрации и логина
ipcMain.handle('register-user', async (event, userData) => {
  return await registerUser(userData);
});

ipcMain.handle('login-user', async (event, credentials) => {
  return await loginUser(credentials);
});

app.whenReady().then(async () => {
  try {
    await connectDB();
    createMainWindow();

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  } catch (error) {
    console.error('Ошибка при запуске приложения:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
