<template>
  <section>
    <aside>
      <div class="top">
        <div :class="{ active: curTab === 1 }" @click="curTab = 1">全部 ({{ store.musicList.length }})</div>
        <div :class="{ active: curTab === 2 }" @click="curTab = 2">当前播放</div>
      </div>
      <div class="sub-top">
        <template v-if="curTab === 1">
          <el-button size="small" text bg :icon="PlaySvg" @click="playAll"> 播放全部 </el-button>
          <el-button
            size="small"
            text
            bg
            :icon="RefreshSvg"
            @click="
              store.getCloud();
              store.getLocal();
            ">
            刷新
          </el-button>
        </template>
        <el-button v-if="curTab === 2" size="small" text bg :icon="CleanSvg" @click="clean"> 清空 </el-button>
      </div>
      <div class="bottom">
        <div :class="{ curTab: curTab === 1 }">
          <MusicItem v-for="(item, index) in store.musicList" :info="item" :key="item.name" :index="index" :curTab="curTab" />
        </div>
        <div :class="{ curTab: curTab === 2 }">
          <MusicItem v-for="(item, index) in store.curMusicList" :info="item" :key="item.name" :index="index" :curTab="curTab" />
        </div>
      </div>
    </aside>

    <main>
      <Lyric />
    </main>
  </section>

  <footer>
    <img height="60" :src="store.cover" />

    <div class="music-info flex-1">
      <div class="top">{{ store.playingMusic?.showName || "-" }}</div>
      <div class="bottom">{{ store.playingMusic?.info?.common?.artist || "" }}</div>
    </div>

    <div class="controlls">
      <audio-panel :class="{ disabled: store.curMusicList.length === 0 }" />
    </div>

    <div class="pink flex-1 right">
      <el-popover placement="top" trigger="click" :width="0" :show-arrow="false" popper-style="min-width:0;width:fit-content;padding:10px 0;">
        <template #reference>
          <VolumnSvg class="volumn margin-right-large" height="20" />
        </template>
        <el-slider vertical height="80px" :model-value="store.volume" :max="1" :step="0.01" :show-tooltip="false" @input="volumnChange" />
        <div class="volumn-label">{{ (store.volume * 100).toFixed(0) }}</div>
      </el-popover>
      <PlayCycleSvg v-show="store.playMode === 'cycle'" height="20" @click="onPlayModeChange" />
      <PlayRandomSvg v-show="store.playMode === 'random'" height="20" @click="onPlayModeChange" />
      <PlayOnceSvg v-show="store.playMode === 'once'" height="20" @click="onPlayModeChange" />
    </div>
  </footer>
</template>

<script setup>
import { ref, nextTick } from "vue";
import MusicItem from "./components/MusicItem.vue";
import AudioPanel from "./components/AudioPanel.vue";
import Lyric from "./components/Lyric.vue";
import { useStore } from "@renderer/utils/store";

import PlaySvg from "@renderer/assets/imgs/play.svg";
import PlayCycleSvg from "@renderer/assets/imgs/play-cycle.svg";
import PlayRandomSvg from "@renderer/assets/imgs/play-random.svg";
import PlayOnceSvg from "@renderer/assets/imgs/play-once.svg";
import VolumnSvg from "@renderer/assets/imgs/volumn.svg";
import CleanSvg from "@renderer/assets/imgs/clean.svg";
import RefreshSvg from "@renderer/assets/imgs/refresh.svg";

const store = useStore();
const curTab = ref(1);

// 播放全部
const playAll = () => {
  store.curMusicList = [...store.musicList];
  store.playNext();
  curTab.value = 2;
};

// 清空
const clean = () => {
  store.audio.src = "";
  store.curMusicList = [];
  store.playingMusic = null;
  store.lyric = "";
  nextTick(() => {
    store.progress = 0;
  });
};

// 音量改变
const volumnChange = value => {
  store.audio.volume = value;
};

// 播放模式改变时
const onPlayModeChange = () => {
  store.playMode = { cycle: "random", random: "once", once: "cycle" }[store.playMode];
  localStorage.setItem("playMode", store.playMode);
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
      background-color: @gray-3-5;
      padding: 8px 10px 0;
      font-family: jet;

      > div {
        display: inline-block;
        padding: 8px 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        cursor: pointer;
        font-weight: bold;

        &.active {
          background-color: @gray-3;
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
      background-color: @gray-3;
    }

    .bottom {
      position: relative;
      flex: 1;
      overflow: hidden;

      > div {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow-y: auto;
        background-color: @gray-1;
      }

      .curTab {
        z-index: 10;
      }
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
      color: lightslategray;
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
