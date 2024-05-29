<template>
  <header>
    <strong class="logo">MIUZC</strong>
    <div class="opts" @click="minimize">
      <MinimizeSvg />
    </div>
    <div v-if="isMax" class="opts" @click="maximize">
      <UnmaximizeSvg />
    </div>
    <div v-else class="opts" @click="maximize">
      <MaximizeSvg />
    </div>
    <div class="opts close" @click="close">
      <CloseSvg />
    </div>
  </header>
  <RouterView />
</template>

<script setup>
import { ref } from "vue";
import MinimizeSvg from "@renderer/assets/imgs/minimize.svg?component";
import UnmaximizeSvg from "@renderer/assets/imgs/unmaximize.svg";
import MaximizeSvg from "@renderer/assets/imgs/maximize.svg";
import CloseSvg from "@renderer/assets/imgs/close.svg";

const isMax = ref(false); // 窗口是否最大化

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
  -webkit-app-region: drag;
  align-items: center;

  .logo {
    margin-right: auto;
    margin-left: 20px;
    font-size: 20px;
    line-height: 40px;
    color: @pink;
  }

  .opts {
    margin-right: 10px;
    -webkit-app-region: none;
    cursor: pointer;
    color: white;
  }
}
</style>
