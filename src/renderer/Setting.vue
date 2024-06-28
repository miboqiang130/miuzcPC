<template>
  <div id="setting">
    <el-form label-width="auto" label-position="top" ref="formRef" :model="formData" :rules="{ local: [{ required: true, message: '请选择本地音乐目录' }] }">
      <h3>本地</h3>
      <el-form-item label="本地目录" prop="local">
        <el-input readonly placeholder="请选择本地目录" :model-value="formData.local" :prefix-icon="FolderSvg" @click="onFileInput" />
      </el-form-item>

      <el-divider />
      <h3>云服务</h3>
      <el-alert type="info" show-icon class="margin-bottom-20" :closable="false">
        <p>请先自行搭建相关云服务</p>
      </el-alert>
      <el-form-item label="云服务地址">
        <el-input v-model="formData.cloud" placeholder="请输入云服务地址，例如：http://192.168.0.1:5000" clearable :prefix-icon="CloudSvg" :readonly="false" />
      </el-form-item>
      <el-form-item label="云服务密码"> <el-input v-model="formData.cloudPw" placeholder="请输入云服务密码" clearable type="password" :prefix-icon="PasswordSvg" :readonly="false" /></el-form-item>
    </el-form>
    <div class="btns">
      <el-button v-show="store.setting.local" text bg @click="back"> 返回 </el-button>
      <el-button type="primary" text bg @click="save"> 保存 </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@renderer/utils/store";
import { setCurrentTime, pause } from "@renderer/utils/MiuzcAudio";
import FolderSvg from "@renderer/assets/imgs/folder.svg";
import CloudSvg from "@renderer/assets/imgs/cloud.svg";
import PasswordSvg from "@renderer/assets/imgs/password.svg";
import Notify from "@renderer/utils/notify";

const store = useStore();
const router = useRouter();

const formData = ref({});
const formRef = ref(null);

// 选择本地音乐目录
const onFileInput = async () => {
  const dirs = await electronLocal.openDir();
  if (dirs) formData.value.local = dirs[0];
};

const back = () => {
  router.push("/Music");
};

// 保存数据
const save = async () => {
  if (!(await formRef.value.validate())) return;
  const oldSetting = { ...store.setting };
  const newSetting = { ...formData.value };
  pause();
  setCurrentTime(0);
  store.curMusicList = [];
  store.playingMusic = null;
  store.lyric = "";

  if (newSetting.cloud && newSetting.cloudPw) {
    // 保存新设置，并尝试登录云端
    await electron.exec("local:setSetting", newSetting);
    const loading = Notify.loading("连接云端中");
    // 尝试登录
    const code = await electron.exec("net:login");

    loading.close();
    if (code === 0) {
      // 登录成功
      store.setting = newSetting;
      store.getLocal();
      store.getCloud();
      router.push("/Music");
    } else {
      Notify.err("登录失败！");
      electron.exec("local:setSetting", oldSetting);
    }
  } else if (newSetting.cloud || newSetting.cloudPw) {
    Notify.err("云服务地址或密码为空！");
  } else {
    await electron.exec("local:setSetting", newSetting);
    // 只设置本地链接时
    store.setting = newSetting;
    store.getLocal();
    store.getCloud();
    router.push("/Music");
  }
};

onActivated(() => {
  formData.value = { ...store.setting };
});
</script>

<style lang="less" scoped>
@import "@renderer/style/color";
#setting {
  height: calc(100% - 40px);
  padding: 30px 25% 0 25%;
  align-items: center;
  background-color: @gray-2;

  h3 {
    color: #505050;
  }

  .margin-bottom-20 {
    margin-bottom: 20px;
  }

  :deep(.el-input) {
    background-color: #202020;
  }

  .btns {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
