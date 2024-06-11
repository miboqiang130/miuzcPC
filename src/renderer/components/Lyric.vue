<template>
  <div id="lyric">
    <div v-show="!store.lyric" class="no-lyric">无歌词</div>
    <div v-show="store.lyric" class="lyric-container" ref="lyricContainer" :style="{ top: topPosition }">
      <section v-for="(item, index) in lyric" :key="index" :class="{ active: index === nowIndex }">{{ item.text }}</section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "@renderer/utils/store";

const store = useStore();

const lyricContainer = ref(null);
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
  const index = lyric.value.findIndex(i => i.timeStamp > store.progress);
  return (index > 0 ? index : lyric.value.length) - 1;
});

// 距离顶部
const topPosition = computed(() => {
  const curNode = lyricContainer.value?.childNodes[nowIndex.value + 1] || { offsetTop: 0, offsetHeight: 0 };
  return `calc(50% - ${curNode.offsetTop + curNode.offsetHeight / 2}px)`;
});
</script>

<style lang="less" scoped>
@import "@renderer/style/color";

#lyric {
  position: relative;
  height: 100%;
  overflow-y: hidden;
  text-align: center;
  user-select: none;

  .no-lyric {
    position: absolute;
    top: calc(50% - 1em);
    width: 100%;
    text-align: center;
    color: @front-dark;
  }

  .lyric-container {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    transition: 400ms;

    section {
      height: 2.5rem;
      line-height: 2.5rem;
      transition: 200ms;

      &.active {
        font-size: large;
        font-weight: bold;
        color: @pink;
      }
    }

    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
