const {app, BrowserWindow} = require('electron')
const ipc = require('electron').ipcMain

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




ipc.on('update-notify-value',function(event,arg){
    win.webContents.send('targetPriceVal',arg)
})
