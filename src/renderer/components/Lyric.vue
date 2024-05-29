<template>
  <div id="lyric-container">
    <div v-if="!store.lyric" class="no-lyric">无歌词</div>
    <section v-else v-for="(item, index) in lyric" :id="'lyric-row-' + index" :key="index" :class="{ active: index === nowIndex }">{{ item.text }}</section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "@renderer/utils/store";

const store = useStore();
// 歌词格式化
const lyric = computed(() => {
  const rt = [];
  const reg = /^\[(\d{2}):(\d{2})\.(\d{2})\](.+)$/;
  store.lyric.split("\\n").forEach(i => {
    if (reg.test(i)) {
      const r = reg.exec(i);
      const second = Number(r[1]) * 60 + Number(r[2]);
      rt.push({
        timeStamp: `${second}.${r[3]}`,
        text: r[4],
      });
    }
  });
  return rt;
});
// 当前是哪句歌词
const nowIndex = computed(() => {
  const rt = lyric.value.findIndex(i => i.timeStamp > store.progress) - 1;
  return rt;
});
</script>

<style lang="less" scoped>
@import "@renderer/style/color";

#lyric-container {
  position: relative;
  height: 100%;
  padding: 20px 0;
  overflow-y: scroll;
  text-align: center;
  box-sizing: border-box;
  user-select: none;

  &::before,
  &::after {
    content: "";
    display: block;
    height: 50%;
  }

  > section {
    margin: 8px 0;

    &.active {
      font-size: large;
      font-weight: bold;
      color: @pink;
    }
  }

  .no-lyric {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    color: @front-dark;
  }

  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
