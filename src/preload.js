const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  get: (url, params, config) => ipcRenderer.invoke("default", { type: "net:get", url, params, config }),
  post: (url, params) => ipcRenderer.invoke("default", { type: "net:post", url, params }),
  exec: (type, data) => ipcRenderer.invoke("default", { type, data }),
});

contextBridge.exposeInMainWorld("application", {
  close: () => ipcRenderer.invoke("default", { type: "app:close" }),
  minimize: () => ipcRenderer.invoke("default", { type: "app:minimize" }),
  maximize: () => ipcRenderer.invoke("default", { type: "app:maximize" }),
  unmaximize: () => ipcRenderer.invoke("default", { type: "app:unmaximize" }),
  isMaximized: () => ipcRenderer.invoke("default", { type: "app:isMaximized" }),

  onError: callback => ipcRenderer.on("error", (_event, value) => callback(value)),
});

contextBridge.exposeInMainWorld("electronLocal", {
  getLocalMusicList: data => ipcRenderer.invoke("default", { type: "local:getLocalMusicList", data }),
  playMusic: data => ipcRenderer.invoke("default", { type: "local:playMusic", data }),
  openDir: () => ipcRenderer.invoke("default", { type: "local:openDir" }),
});
