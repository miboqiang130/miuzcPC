import { app } from "electron";
import net from "./net";
import local from "./local";

export default {
  "app:close": () => app.quit(),
  "app:minimize": (params, mainWindow) => mainWindow.minimize(),
  "app:maximize": (params, mainWindow) => mainWindow.maximize(),
  "app:unmaximize": (params, mainWindow) => mainWindow.unmaximize(),
  "app:isMaximized": (params, mainWindow) => mainWindow.isMaximized(),

  ...net,
  ...local,
};
