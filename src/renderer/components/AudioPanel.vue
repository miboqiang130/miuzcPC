<template>
  <div id="audio-panel">
    <div class="top">
      <PreviousSvg height="22" @click="() => store.playNext(-1)" />
      <PlaySvg v-show="store.audio.paused" height="30" @click="() => store.audio.play()" />
      <PauseSvg v-show="!store.audio.paused" height="30" @click="() => store.audio.pause()" />
      <NextSvg height="22" @click="() => store.playNext(1)" />
    </div>
    <div class="bottom">
      <span>{{ formatTime(store.progress) }}</span>
      <el-slider class="progress-bar" :modelValue="store.progress" :max="store.audio.duration || 1" :format-tooltip="formatTime" @input="onInput" @change="onChange" />
      <span>{{ formatTime(store.audio.duration) }}</span>
    </div>
  </div>
</template>

<script setup>
import PreviousSvg from "@renderer/assets/imgs/previous.svg";
import PlaySvg from "@renderer/assets/imgs/play.svg";
import PauseSvg from "@renderer/assets/imgs/pause.svg";
import NextSvg from "@renderer/assets/imgs/next.svg";
import { useStore } from "@renderer/utils/store";
import { formatTime } from "@renderer/utils/util";

let tempTime = 0;

const onInput = value => (tempTime = value);
const onChange = () => {
  store.audio.currentTime = tempTime;
};
const store = useStore();
</script>

<style lang="less" scoped>
@import "@renderer/style/color";
#audio-panel {
  width: 500px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    color: @pink;

    > * {
      margin: 0 8px;
      cursor: pointer;
    }
  }

  .bottom {
    display: flex;
    align-items: center;

    .progress-bar {
      margin: 0 20px;
    }
  }
}
</style>
