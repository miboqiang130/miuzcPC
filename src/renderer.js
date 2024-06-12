import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@renderer/style/default.less";
import App from "@renderer/App.vue";
import router from "@renderer/utils/router";
import Notify from "@renderer/utils/notify";

const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount("#app");

// 当收到主进程的错误，展示出来
window.application.onError(err => {
  Notify.err(err);
});
