const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    saveJson: (characters) => ipcRenderer.send('save-json', characters),
    getJson: () => ipcRenderer.invoke('dialog:get-json')
})