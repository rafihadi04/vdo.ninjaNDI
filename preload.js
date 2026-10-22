const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getNdiSources: () => ipcRenderer.invoke('get-ndi-sources'),
  startStream: (config) => ipcRenderer.send('start-stream', config),
  stopStream: () => ipcRenderer.send('stop-stream')
});
