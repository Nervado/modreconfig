const {app, BrowserWindow} = require('electron')

function createWindow(){
    // create the window
    let win = new BrowserWindow({
        width: 660,
        height:550,
        webPreferences :{
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')}

app.on('ready',createWindow)





