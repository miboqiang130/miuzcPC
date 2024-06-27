import { ElNotification } from "element-plus";
import LoadingSvg from "@renderer/assets/imgs/loading.svg";

export default {
  suc(title) {
    ElNotification.success({ title, showClose: false, position: "bottom-right", customClass: "notify", offset: 80 });
  },
  err(title) {
    ElNotification.error({ title, showClose: false, position: "bottom-right", customClass: "notify", offset: 80 });
  },
  info(title) {
    ElNotification.info({ title, showClose: false, position: "bottom-right", customClass: "notify", offset: 80 });
  },
  loading(title, duration = 0) {
    return ElNotification({ title, showClose: false, position: "bottom-right", customClass: "notify", offset: 80, icon: LoadingSvg, duration });
  },
};
