<template>
  <section>
    <aside>
      <div class="top">
        <div :class="{ active: curTab === 1 }" @click="curTab = 1">全部 ({{ store.musicList.length }})</div>
        <div :class="{ active: curTab === 2 }" @click="curTab = 2">当前播放</div>
      </div>
      <div class="sub-top">
        <div v-show="curTab === 1" class="btn" @click="playAll"><PlaySvg height="16" class="icon-play" />播放全部</div>
        <div v-show="curTab === 2" class="btn" @click="clean"><CleanSvg height="16" />清空</div>
      </div>
      <div class="bottom">
        <MusicItem v-for="(item, index) in showMusicList" :info="item" :key="index" :index="index" @click="store.playMusic(item)" />
      </div>
    </aside>
    <main>
      <Lyric />
    </main>
  </section>
  <footer>
    <MusicCoverSvg height="60" />
    <div class="music-info flex-1">
      <div class="top">{{ store.playingMusic?.showName || "-" }}</div>
      <div class="bottom">无</div>
    </div>
    <div class="controlls">
      <audio-panel :class="{ disabled: store.curMusicList.length === 0 }" />
    </div>
    <div class="pink flex-1 right">
      <el-popover placement="top" trigger="click" :width="0" :show-arrow="false" popper-style="min-width:0;width:fit-content;padding:10px 0;">
        <template #reference>
          <VolumnSvg class="volumn margin-right-large" height="20" />
        </template>
        <el-slider vertical height="80px" v-model="volumn" :show-tooltip="false" @change="volumnChange" />
        <div class="volumn-label">{{ volumn }}</div>
      </el-popover>
      <PlayCycleSvg v-show="playMode === 'cycle'" height="20" @click="onPlayModeChange" />
      <PlayRandomSvg v-show="playMode === 'random'" height="20" @click="onPlayModeChange" />
      <PlayOnceSvg v-show="playMode === 'once'" height="20" @click="onPlayModeChange" />
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from "vue";
import MusicItem from "./components/MusicItem.vue";
import AudioPanel from "./components/AudioPanel.vue";
import Lyric from "./components/Lyric.vue";
import { useStore } from "@renderer/utils/store";

import MusicCoverSvg from "@renderer/assets/imgs/music-cover.svg";
import PlaySvg from "@renderer/assets/imgs/play.svg";
import PlayCycleSvg from "@renderer/assets/imgs/play-cycle.svg";
import PlayRandomSvg from "@renderer/assets/imgs/play-random.svg";
import PlayOnceSvg from "@renderer/assets/imgs/play-once.svg";
import VolumnSvg from "@renderer/assets/imgs/volumn.svg";
import CleanSvg from "@renderer/assets/imgs/clean.svg";

const store = useStore();
const playMode = ref(localStorage.getItem("playMode") || "cycle"); // 循环播放，单个播放
const volumn = ref(Number(localStorage.getItem("volumn") || 1) * 100); // 音量
const curTab = ref(1);

// 初始化音频对象
store.audioInit();

const showMusicList = computed(() => {
  if (curTab.value === 1) return store.musicList;
  else if (curTab.value === 2) return store.curMusicList;
});

const onPlayModeChange = () => {
  switch (playMode.value) {
    case "cycle":
      playMode.value = "random";
      break;
    case "random":
      playMode.value = "once";
      break;
    case "once":
      playMode.value = "cycle";
      break;
  }
  localStorage.setItem("playMode", playMode.value);
};

// 播放全部
const playAll = () => {
  store.curMusicList = [...store.musicList];
  store.playMusic(store.curMusicList[0]);
  curTab.value = 2;
};
// 清空
const clean = () => {
  store.audio.src = "";
  store.curMusicList = [];
};
// 播放下一首
const playNext = () => {
  switch (playMode.value) {
    case "cycle":
      playMode.value = "random";
      break;
    case "random":
      playMode.value = "once";
      break;
    case "once":
      playMode.value = "cycle";
      break;
  }
};
// 音量改变
const volumnChange = value => {
  localStorage.setItem("volumn", value / 100);
  store.changeVolumn(value / 100);
};
</script>

<style lang="less" scoped>
@import "@renderer/style/color";
section {
  display: flex;
  height: calc(100% - 120px);
  box-sizing: border-box;

  aside {
    display: flex;
    flex-direction: column;
    width: 300px;
    background-color: @gray-1;

    .top {
      background-color: @gray-3;
      padding: 8px 10px 0;
      font-family: monospace;

      > div {
        display: inline-block;
        padding: 8px 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;
        font-weight: bold;

        &.active {
          background-color: @gray-1;
          color: @pink;
        }
      }
    }

    .sub-top {
      height: 40px;
      padding: 0 10px;
      font-size: small;
      color: white;
      line-height: 40px;

      .icon {
        margin-right: 4px;
        vertical-align: text-bottom;
      }

      .icon-play {
        padding: 0 8px 2px 7px;
        background-color: @pink;
        vertical-align: middle;
        border-radius: 10px;
        color: white;
      }
    }

    .bottom {
      flex: 1;
      overflow-y: auto;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }

  main {
    flex: 6;
    background-color: @gray-2;
  }
}

footer {
  display: flex;
  height: 80px;
  padding: 0 20px;
  align-items: center;
  box-shadow: @box-shadow;

  .music-info {
    margin-left: 8px;
    line-height: 1;
    .top {
      margin-bottom: 8px;
      font-weight: bold;
    }

    .bottom {
      font-size: 12px;
    }
  }

  .controlls {
    .disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  .volumn {
    outline: none;
  }

  .right {
    text-align: right;
  }
}

.pink {
  color: @pink;
}

.volumn-label {
  margin-top: 8px;
  text-align: center;
}
</style>
