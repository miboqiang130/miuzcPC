import action from "@main/action";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import auth from "@main/data/auth";
import store from "@main/data/store";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    id: 1,
    width: 900,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // 窗口最小大小
  mainWindow.setMinimumSize(900, 600);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  mainWindow.webContents.openDevTools();

  ipcMain.handle("default", (event, params) => action[params.type](params, mainWindow, event));

  // 请求拦截，添加请求头
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders({ urls: ["*://*/*"], types: ["media"] }, async (detail, cb) => {
    const token = await auth.getToken();
    cb({ cancel: false, requestHeaders: { ...detail.requestHeaders, "X-User-Agent": "MIUZC", token } });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  store.load();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  // 关闭时保存用户数据
  store.save();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
