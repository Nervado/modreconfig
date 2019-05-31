const path = require('path');
const getData = require(path.resolve('src/modules','testeCriaFc'));

//C:\Users\adm\Desktop\DEV\modreconfig\modreconfigApp-win32-x64\resources\app\src\modules
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
        
        if (msg.comando === 'lf'){
            console.log(msg)

            getData.fetchFiles(msg)
            //const getData = require(path.resolve('src/modules','testeCriaFc'));
            e.reply('asynchronous-reply','Acabou')
        }
        // Envia a parada para o conteudo da janela principal 
        // mainWindow.webContent.send()
        //if(msg === 'lf'){
        //    let painel = '02';
        //    console.log(msg,'vou fazer as paradas entao..');
        //    getData.fetchFiles(painel);
        //}          
        //console.log(getData.getData())        
        //win.close()// Todo ... stuff    
    })
}

app.on('ready',createWindow)

// Catch item: add

