const path = require('path');
const url = require('url');
const {app, BrowserWindow} = require('electron');

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 650,
        icon: __dirname + "/images/arts/favicon.png"
    })

    window.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: 'file:',
        slashes: true
    }))

    window.on('closed', () => {
        window = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
})