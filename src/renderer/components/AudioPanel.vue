<template>
  <div id="audio-panel">
    <div class="top">
      <PreviousSvg height="22" @click="() => store.playNext(-1)" />
      <PlaySvg v-show="['pause', 'none'].includes(audioAttr.status)" height="30" @click="() => play()" />
      <PauseSvg v-show="audioAttr.status === 'playing' || audioAttr.status === 'waiting'" height="30" @click="pause" />
      <NextSvg height="22" @click="() => store.playNext(1)" />
    </div>
    <div class="bottom">
      <span>{{ formatTime(audioAttr.currentTime) }}</span>
      <el-slider class="progress-bar" :modelValue="audioAttr.currentTime" :max="audioAttr.duration || 1" :format-tooltip="formatTime" @input="onInput" @change="onChange" />
      <span>{{ formatTime(audioAttr.duration) }}</span>
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
import { audioAttr, play, pause, setCurrentTime } from "@renderer/utils/MiuzcAudio";

let tempTime = 0;

const onInput = value => (tempTime = value);
const onChange = () => {
  setCurrentTime(tempTime);
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
