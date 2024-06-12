import axios from "@main/config/axios";
import fs from "fs";
import path from "path";
import store from "@main/data/store";
import FormData from "form-data";

export default {
  // get请求
  "net:get": async ({ url, params, config }) => {
    try {
      return await axios.get(url, { params, ...config });
    } catch (e) {
      console.error(e);
      return { status: -1, data: e };
    }
  },

  // post请求
  "net:post": async ({ url, params }) => {
    try {
      return axios.post(url, params);
    } catch (e) {
      console.error(e);
      return { status: -1, data: e };
    }
  },

  // 音乐下载
  "net:download": ({ data: filename }) => {
    const setting = store.get("setting");
    return axios({
      method: "get",
      url: "/music/" + filename,
      responseType: "stream",
    }).then(response => {
      // 创建一个可写流来写入文件
      const writer = fs.createWriteStream(path.resolve(setting.local, filename));

      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
        let error = null;
        writer.on("error", err => {
          error = err;
          writer.close();
          reject(err);
        });
        writer.on("close", () => {
          if (!error) {
            resolve(true);
          }
        });
      });
    });
  },

  // 音乐上传
  "net:upload": ({ data: filename }) => {
    const setting = store.get("setting");
    const formData = new FormData();
    const reader = fs.createReadStream(path.resolve(setting.local, filename));
    formData.append(filename, reader);

    return axios({
      method: "POST",
      url: "/upload/music",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      data: formData,
    });
  },
};
