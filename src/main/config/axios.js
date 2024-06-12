import axios from "axios";
import auth from "@main/data/auth";
import ErrText from "@main/config/errText";
import { BrowserWindow } from "electron";

const instance = axios.create({
  headers: { "X-User-Agent": "MIUZC", "content-type": "application/x-www-form-urlencoded" },
});

// 添加请求拦截器
instance.interceptors.request.use(
  async function (config) {
    if (!config.url.startsWith("/pub")) config.headers["token"] = await auth.getToken();
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数
    return { status: response.status, data: response.data };
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数
    console.log(error.code);
    const mainWindow = BrowserWindow.fromId(1);
    if (error.response) return { status: response.status, data: response.data };
    else mainWindow.webContents.send("error", ErrText[error.code] || "未知错误");
  }
);

export default instance;
