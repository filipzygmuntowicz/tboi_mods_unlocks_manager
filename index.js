const { app, BrowserWindow, ipcMain  } = require('electron')

fs = require('fs')
function handleSaveJson (event, characters) {
    fs.writeFileSync(`${__dirname}/characters.json`, JSON.stringify(characters, null, 2)); 
}

async function handleGetJson() {
    const charactersJson = require(`${__dirname}/characters.json`)
    return charactersJson
}
const createWindow = () => {
    const config = require(`${__dirname}/app_config.json`)
    const win = new BrowserWindow({
      width: config.window.width,
      height: config.window.height,
      webPreferences: {
        preload: `${__dirname}/preload.js`,
        zoomFactor: config.window.zoom
      }
    })
    
    win.loadFile('index.html')

    //win.webContents.on('did-finish-load', () => {
    //  win.webContents.zoomFactor = 1
    //});

    win.on('resize', () => {
      const { width, height } = win.getBounds();
      let maxWidth = 1280
      //let maxHeight = 720
      let defaultZoom = 1.72
      let newZoomFactor = Math.round((width)/(maxWidth) * 100)/100
      win.webContents.zoomFactor = defaultZoom * newZoomFactor
    });
    win.on('close', () => {
      const config = require(`${__dirname}/app_config.json`)
      const { width, height } = win.getBounds();
      config.window.width = width
      config.window.height = height
      config.window.zoom = win.webContents.zoomFactor
      fs.writeFileSync(`${__dirname}/app_config.json`, JSON.stringify(config, null, 2)); 
    })
  }
  app.whenReady().then(() => {
    ipcMain.on('save-json', handleSaveJson)
    ipcMain.handle('dialog:get-json', handleGetJson)
    createWindow()
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
