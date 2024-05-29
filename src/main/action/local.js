import { parseFile } from "music-metadata";
import path from "path";
import fs from "fs";
import mime from "mime-types";
import exJson from "@main/constant/otherMusicType.json";
import crypto from "crypto";

export default {
  "local:getLocalMusicList": async () => {
    const MusicPath = "C:\\Users\\10257\\Music";
    const list = fs.readdirSync(MusicPath).filter(i => {
      const mm = mime.lookup(i);
      let flag = fs.statSync(path.join(MusicPath, i)).isFile() && mm && mm.startsWith("audio"); // || new RegExp(`(${exJson.join("|")})$`).test(i);
      return flag;
    });

    const rt = [];
    for (let value of list) {
      const fullpath = path.join(MusicPath, value);
      const info = await parseFile(fullpath);
      const fileData = await fs.readFileSync(fullpath);
      rt.push({
        name: value,
        fullpath,
        isLocal: true,
        info,
        md5: crypto.createHash("md5").update(fileData).digest("hex"),
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
};
