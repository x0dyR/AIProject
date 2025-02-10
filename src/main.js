const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
require('dotenv/config');
const { fetchBookData } = require('./Scripts/bookService');
const MongoClient = require('mongodb').MongoClient;

const password = encodeURIComponent(process.env.MONGO_PASSWD);
const uri = `mongodb+srv://xody:${password}@aiproject.ncjxz.mongodb.net/?retryWrites=true&w=majority&appName=AIProject`;
const client = new MongoClient(uri);

var mainWindow;

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
                client.close();
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
            accelerator: 'CmdOrCtrl+Shift+I',
            label: 'asd',
            accelerator: 'CmdOrCtrl+W',
            
        }
    ]
}];

app.whenReady().then(async () => {
    try {
        createMainWindow();

        await client.connect();
        const db = client.db("AIProject");

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
