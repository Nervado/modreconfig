const path = require('path');
const getData = require(path.join(__dirname,'src/modules/testeCriaFc'));
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
        // mainWindow.webContent.send()
        if(msg === 'lf'){
            let painel = 02;
            console.log(msg,'vou fazer as paradas entao..');
            getData.fetchFiles(painel);
        }          
        console.log(getData.getData())        
        //win.close()// Todo ... stuff    
    })
}

app.on('ready',createWindow)

// Catch item: add

