const path = require(`path`)
const { app, BrowserWindow, Menu } = require(`electron`)

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: `Seriy gey`,
        width: 1920,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"))
}

app.whenReady().then(() => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on(`activate`, () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

const menu = [{
    label: `File`,
    submenu: [
        {
            lable: `Quit`,
            click: () => app.quit(),
            accelerator: `CmdOrCtrl+W`
        }
    ]
}];
