<template>
  <div class="music-item" :class="{ active: info.name === store.playingMusic?.name }" @click="onClick">
    <div class="index">{{ index + 1 }}</div>
    <div class="flex-1">
      <div class="text-hidden">
        {{ info.name || info.name }}
      </div>
      <div></div>
    </div>
    <div class="music-item-opts" @click.stop>
      <el-tooltip content="保存至本地" placement="top" effect="light" :show-arrow="false">
        <span><DownloadSvg v-if="curTab === 1 && !info.isLocal" height="18" @click="downloadMusic" /></span>
      </el-tooltip>
      <el-tooltip content="上传至云端" placement="top" effect="light" :show-arrow="false">
        <span><UploadSvg v-if="curTab === 1 && !info.isCloud" height="18" @click="uploadMusic" /></span>
      </el-tooltip>
      <el-tooltip content="添加到播放列表" placement="top" effect="light" :show-arrow="false">
        <span><AddToListSvg v-if="curTab === 1" height="18" @click="addToList" /></span>
      </el-tooltip>
      <el-tooltip content="从播放列表中移除" placement="top" effect="light" :show-arrow="false">
        <span><BinSvg v-if="curTab === 2" height="18" @click="removeFromList" /></span>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "@renderer/utils/store";
import AddToListSvg from "@renderer/assets/imgs/add-to-list.svg";
import BinSvg from "@renderer/assets/imgs/bin.svg";
import DownloadSvg from "@renderer/assets/imgs/download.svg";
import UploadSvg from "@renderer/assets/imgs/upload.svg";
import Notify from "@renderer/utils/notify";
import { stop } from "@renderer/utils/MiuzcAudio";

const store = useStore();
const { info, index, curTab } = defineProps(["info", "index", "curTab"]);

const onClick = () => {
  if (!store.curMusicList.find(i => i.name === info.name)) store.curMusicList.push(info);
  store.playMusic(info);
};

const addToList = () => {
  const hasItem = store.curMusicList.find(i => i.name === info.name);
  if (!hasItem) store.curMusicList.push(info);
};

const removeFromList = () => {
  if (store.curMusicList.length === 0) {
    stop();
    store.playingMusic = null;
  } else if (store.playingMusic.name === info.name) store.playNext();
  store.curMusicList = store.curMusicList.filter(i => i.name !== info.name);
};

// 从云端下载音乐
const downloadMusic = () => {
  electron
    .exec("net:download", info.name)
    .then(() => {
      Notify.suc("下载成功");
      store.getLocal();
    })
    .catch(error => {
      Notify.err("下载失败");
      console.error("catch error: ", error);
    });
};

// 上传本地音乐至云端
const uploadMusic = () => {
  electron.exec("net:upload", info.name).catch(err => {
    Notify.err("上传失败");
    console.log("catch error: ", err);
  });
};
</script>

<style lang="less" scoped>
@import "@renderer/style/color";
.music-item {
  display: flex;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  align-items: center;

  &:hover {
    background-color: #ffffff08;

    .music-item-opts {
      display: block;
    }
  }

  &.active {
    color: @pink;
    font-weight: bold;
  }

  .index {
    min-width: 26px;
    font-size: small;
    font-weight: bold;
  }

  .music-item-opts {
    display: none;
    height: 18px;
    color: @front;

    svg {
      margin-left: 6px;
      opacity: 0.1;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
