const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const remoteMain = require('@electron/remote/main');
remoteMain.initialize();

if(isDev)
    require('electron-reload')(__dirname);

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800, height: 600, autoHideMenuBar: true, frame: false,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.ts')
        }
    });

    remoteMain.enable(mainWindow.webContents);

    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools({
            mode: 'detach'
        });
    }

    ipcMain.on('hide-application', () => {
        mainWindow.minimize();
    });
}

ipcMain.on('close-application', () => {
    app.quit()
});

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});