const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    applyToMod: (characters) => ipcRenderer.send('apply-to-mod', characters),
    saveJson: (characters) => ipcRenderer.send('save-json', characters),
    getJson: () => ipcRenderer.invoke('dialog:get-json')
})