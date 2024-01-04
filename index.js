const { app, BrowserWindow, ipcMain, dialog  } = require('electron')
let applier = require('./applier');
path = require("path")
fs = require('fs')

let dir;
if (__dirname.includes("app.asar")) {
  dir = __dirname.replace("\app.asar", "")
} else {
  dir = __dirname + "/"
}
function handleSaveJson (event, characters) {
    fs.writeFileSync(`${dir}characters.json`, JSON.stringify(characters, null, 2)); 
}

async function handleGetJson() {
    const charactersJson = require(`${dir}characters.json`)
    return charactersJson
}

function applyToMod(event, characters) {
  
  try {
    applier.apply(characters)
  }
  catch(err) {
    dialog.showErrorBox('Error', path.join(__dirname, '..', '..', '..', 'repentanceplus_clean_3056942881', 'content'))
    if (err.code === "ENOENT") {
      dialog.showErrorBox('Error', 'Repentance Plus files not found. Make sure the manager folder is placed in:\n steamapps/common/The Binding of Isaac Rebirth/mods')
    }
    else {
      dialog.showErrorBox('Error', err)
    }
  }
}
const createWindow = () => {
    const config = require(`${dir}app_config.json`)
    const win = new BrowserWindow({
      name: "tboi",
      width: config.window.width,
      height: config.window.height,
      minWidth: 800,
      minHeight: 740,
      webPreferences: {
        preload: `${__dirname}/preload.js`,
        zoomFactor: config.window.zoom
      }
    })
    
    win.loadFile('index.html')

    //win.webContents.on('did-finish-load', () => {
    //  win.webContents.zoomFactor = 1
    //});
    win.on('maximize', () => {
      win.unmaximize()
    });
    win.on('resize', () => {
      let { width, height } = win.getBounds();
      let maxWidth = 1280
      //let maxHeight = 720
      let defaultZoom = 1.72
      let newZoomFactor
      newZoomFactor = Math.round((width)/(maxWidth) * 100)/100
      win.webContents.zoomFactor = defaultZoom * newZoomFactor
    });
    win.on('close', () => {
      const config = require(`${dir}app_config.json`)
      const { width, height } = win.getBounds();
      config.window.width = width
      config.window.height = height
      config.window.zoom = win.webContents.zoomFactor
      fs.writeFileSync(`${dir}app_config.json`, JSON.stringify(config, null, 2)); 
    })
  }
  app.whenReady().then(() => {
    ipcMain.on('apply-to-mod', applyToMod)
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
