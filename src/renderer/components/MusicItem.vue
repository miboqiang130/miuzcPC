<template>
  <div class="music-item" :class="{ active: info.name === store.playingMusic?.name }">
    <div class="index">{{ index + 1 }}</div>
    <div class="flex-1">
      <div>
        {{ info.showName || info.name }}
      </div>
      <div></div>
    </div>
    <div class="music-item-opts"></div>
  </div>
</template>

<script setup>
import { useStore } from "@renderer/utils/store";

const store = useStore();
const { info, index } = defineProps(["info", "index"]);
</script>

<style lang="less" scoped>
@import "@renderer/style/color";
.music-item {
  display: flex;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #ffffff08;
  }

  &.active {
    background: #ffffff18;
    color: @pink;
    font-weight: bold;
  }

  .index {
    min-width: 26px;
    font-size: small;
    font-weight: bold;
  }

  .music-item-opts {
    margin-left: 6px;
  }
}
</style>
