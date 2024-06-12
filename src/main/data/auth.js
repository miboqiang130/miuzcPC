import axios from "@main/config/axios";
import NodeRSA from "node-rsa";
import store from "@main/data/store";
const auth = {
  token: "",
  tokenInfo: {},
};

export default {
  // 获取token
  async getToken() {
    // 无token或token过期时登录
    if (!(auth.token && auth.tokenInfo.preload?.exp > Date.now() / 1000)) {
      await this.login();
    }
    return auth.token;
  },

  // 登录
  async login() {
    let code;
    try {
      const setting = store.get("setting");

      // 获取公钥
      const rsp1 = await axios.get("/pubmiuzcfinospubkey");
      if (rsp1?.status !== 200) throw new Error("fail to get public key");

      // 加密密码
      const key = new NodeRSA(rsp1.data, "pkcs1-public-pem", { encryptionScheme: "pkcs1", signingScheme: "pkcs1-sha256" });
      const encryptStr = key.encrypt(setting["cloudPw"], "base64");

      // 登录获取token
      const params = new URLSearchParams();
      params.append("pw", encryptStr);
      const rsp2 = await axios.post("/pubmiuzculogin", params);
      if (rsp2?.status !== 200) throw new Error("fail to login");

      const tokenArr = rsp2.data.split(".");

      //验证token是否被篡改
      if ((key.verify(tokenArr[0] + "." + tokenArr[1], tokenArr[2]), "base64")) {
        console.log("login success");
        code = 0;
        auth.token = rsp2.data;
        auth.tokenInfo = {
          header: JSON.parse(atob(tokenArr[0])),
          preload: JSON.parse(atob(tokenArr[1])),
        };
      } else throw new Error("validation failure");
    } catch (e) {
      console.error(e);
      code = -1;
    } finally {
      return code;
    }
  },

  // 退出
  logout() {
    auth.token = "";
    auth.tokenInfo = {};
  },
};
