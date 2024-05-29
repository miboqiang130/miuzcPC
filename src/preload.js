const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  get: (url, params, config) => ipcRenderer.invoke("default", { type: "net:get", url, params, config }),
  post: (url, params) => ipcRenderer.invoke("default", { type: "net:post", url, params }),
});

contextBridge.exposeInMainWorld("application", {
  close: () => ipcRenderer.invoke("default", { type: "app:close" }),
  minimize: () => ipcRenderer.invoke("default", { type: "app:minimize" }),
  maximize: () => ipcRenderer.invoke("default", { type: "app:maximize" }),
  unmaximize: () => ipcRenderer.invoke("default", { type: "app:unmaximize" }),
  isMaximized: () => ipcRenderer.invoke("default", { type: "app:isMaximized" }),
  init: value => ipcRenderer.send("init", value),
});

contextBridge.exposeInMainWorld("electronLocal", {
  getLocalMusicList: () => ipcRenderer.invoke("default", { type: "local:getLocalMusicList" }),
  playMusic: data => ipcRenderer.invoke("default", { type: "local:playMusic", data }),
});
