import { parseFile } from "music-metadata";
import path from "path";
import fs from "fs";
import { dialog } from "electron";
import store from "@main/data/store";
import axios from "@main/config/axios";
import formats from "@renderer/assets/ffmpegwasm/formats.json";

export default {
  "local:getLocalMusicList": async data => {
    const { data: MusicPath } = data;
    const list = fs.readdirSync(MusicPath);

    const rt = [];
    for (let value of list) {
      const [filename, name, ext] = /(.*)\.(.*?)$/.exec(value);
      const isFile = fs.statSync(path.join(MusicPath, value)).isFile();
      const fullpath = path.join(MusicPath, value);
      const info = await parseFile(fullpath);
      const isChromeSupport = formats["chromeSupportFormats"].includes(ext);

      if (isFile && (isChromeSupport || formats["ffmpegSupportDecodeFormats"].includes(ext)))
        rt.push({
          name,
          filename,
          ext,
          fullpath,
          isLocal: true,
          info,
          isChromeSupport,
        });
    }
    return rt;
  },
  "local:getMusic": ({ data: fullpath }) => {
    return new Promise(res => {
      fs.readFile(fullpath, (err, data) => {
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
  },
};
