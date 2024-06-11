import fs from "node:fs";
import path from "node:path";
import axios from "@main/config/axios";
import { app, safeStorage } from "electron";

const userDataPath = path.resolve(app.getPath("userData"), "store");
let store;

export default {
  get(key) {
    return store[key];
  },
  set(key, obj) {
    store[key] = obj;
  },
  load() {
    // 读取用户数据
    try {
      const data = Buffer.from(fs.readFileSync(userDataPath, "utf-8"), "base64");
      store = JSON.parse(safeStorage.decryptString(data));
      axios.defaults.baseURL = store.setting.cloud;
    } catch (e) {
      console.error(e);
      store = {};
    }
  },
  save() {
    try {
      const buffer = safeStorage.encryptString(JSON.stringify(store || {}));
      fs.writeFileSync(userDataPath, buffer.toString("base64"), "utf-8");
    } catch (e) {
      console.log(e);
    }
  },
};
