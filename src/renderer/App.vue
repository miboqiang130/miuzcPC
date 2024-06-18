<template>
  <header>
    <strong class="logo">MIUZC</strong>

    <KeyboardSvg height="20" class="opt" @click="shortcut = true" />
    <SettingSvg height="16" class="opt" @click="router.push('/Setting')" />
    <el-divider direction="vertical" />
    <MinimizeSvg class="opt" @click="minimize" />
    <UnmaximizeSvg v-if="isMax" class="opt" @click="maximize" />
    <MaximizeSvg v-else class="opt" @click="maximize" />
    <CloseSvg class="opt" @click="close" />
  </header>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <el-dialog v-model="shortcut" width="300" title="快捷键" shortcut-dialog class="shortcut-dialog" modal-class="shortcut-modal" :show-close="false" :draggable="true">
    <table>
      <tbody>
        <tr>
          <td>↑</td>
          <td>音量+10</td>
        </tr>
        <tr>
          <td>↓</td>
          <td>音量-10</td>
        </tr>
        <tr>
          <td>←</td>
          <td>上一首</td>
        </tr>
        <tr>
          <td>→</td>
          <td>下一首</td>
        </tr>
        <tr>
          <td>空格</td>
          <td>暂停/播放</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@renderer/utils/store";
import { useRouter } from "vue-router";
import MinimizeSvg from "@renderer/assets/imgs/minimize.svg?component";
import UnmaximizeSvg from "@renderer/assets/imgs/unmaximize.svg";
import MaximizeSvg from "@renderer/assets/imgs/maximize.svg";
import CloseSvg from "@renderer/assets/imgs/close.svg";
import SettingSvg from "@renderer/assets/imgs/setting.svg";
import KeyboardSvg from "@renderer/assets/imgs/keyboard.svg";

const shortcut = ref(false);
const isMax = ref(false); // 窗口是否最大化
const store = useStore();
const router = useRouter();

// 初始化音频对象
store.audioInit();

electron.exec("local:getSetting").then(rsp => {
  store.setting = rsp || {};
  if (store.setting.local) {
    router.push("/Music");
    store.getCloud();
    store.getLocal();
  } else router.push("/Setting");
});

// 最小化
const minimize = window.application.minimize;

// 最大化/去最大化
const maximize = async () => {
  const isM = await window.application.isMaximized();
  if (isM) window.application.unmaximize();
  else window.application.maximize();
  isMax.value = !isM;
};

// 关闭
const close = window.application.close;
</script>

<style scoped lang="less">
@import "@renderer/style/color";
header {
  display: flex;
  height: 40px;
  padding: 0 10px 0 20px;
  -webkit-app-region: drag;
  align-items: center;

  .logo {
    margin-right: auto;
    font-size: 20px;
    line-height: 40px;
    color: @pink;
  }

  .opt {
    margin: 0 4px;
    -webkit-app-region: none;
    cursor: pointer;
    color: gray;

    &:hover {
      color: white;
    }
  }
}
</style>
