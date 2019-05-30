//const electron = require('electron');
//const url = require('url');
//const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');


function createWindow(){
    // create the window
    let win = new BrowserWindow({
        width: 660,
        height:550,
        webPreferences :{
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    ipcMain.on('msg', function(e, msg){
        // Envia a parada para o conteudo da janela principal 
        //mainWindow.webContent.send()
        console.log(msg)
        const getData = require('/Users/adm/Desktop/DEV/modreconfig/src/modules/testeCriaFc')
        console.log(getData.getData())        
        //win.close()// Todo ... stuff    
    })  


}

app.on('ready',createWindow)

// Catch item: add

