const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
require('dotenv/config');
const connectDB = require('./db'); // Наш модуль подключения к базе
// Если потребуется, подключай и сервисы/модели:
const User = require('./schemas/user');
const Book = require('./schemas/book');
const Author = require('./schemas/author')
const Category = require('./schemas/categories')

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Seriy gey',
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools();
}

const menu = [{
    label: 'File',
    submenu: [
        {
            label: 'Quit',
            click: () => {
                app.quit();
            },
            accelerator: 'CmdOrCtrl+W'
        }
    ],
    label: 'Dev',
    submenu: [
        {
            label: 'Enable DevTools',
            click: () => {
                mainWindow.webContents.openDevTools();
            },
            accelerator: 'CmdOrCtrl+Shift+I'
        }
    ]
}];

app.whenReady().then(async () => {
    try {
        createMainWindow();

        // Подключаемся к MongoDB через Mongoose
        await connectDB();

        const mainMenu = Menu.buildFromTemplate(menu);
        Menu.setApplicationMenu(mainMenu);

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createMainWindow();
            }
        });
    } catch (error) {
        console.error(error);
        app.quit();
    }
});
