import { parseFile } from "music-metadata";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import exJson from "@main/config/otherMusicType.json";
import crypto from "crypto";
import { dialog } from "electron";
import store from "@main/data/store";
import auth from "@main/data/auth";
import axios from "@main/config/axios";

export default {
  "local:getLocalMusicList": async data => {
    const { data: MusicPath } = data;
    const list = fs.readdirSync(MusicPath).filter(i => {
      const mm = mime.lookup(i);
      let flag = fs.statSync(path.join(MusicPath, i)).isFile() && mm && mm.startsWith("audio"); // || new RegExp(`(${exJson.join("|")})$`).test(i);
      return flag;
    });

    const rt = [];
    for (let value of list) {
      const fullpath = path.join(MusicPath, value);
      const info = await parseFile(fullpath);
      rt.push({
        name: value,
        fullpath,
        isLocal: true,
        info,
      });
    }
    return rt;
  },
  "local:playMusic": ({ data: d }) => {
    return new Promise(res => {
      fs.readFile(d.fullpath, (err, data) => {
        if (err) return;
        res(data);
      });
    });
  },
  "local:openDir"(_, mainWindow) {
    return dialog.showOpenDialogSync(mainWindow, { properties: ["openDirectory"] });
  },
  "local:getSetting": () => store.get("setting"),
  "local:setSetting": ({ data }) => {
    store.set("setting", data);
    axios.defaults.baseURL = data.cloud;
    return auth.login();
  },
};
