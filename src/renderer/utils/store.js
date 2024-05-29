import { defineStore } from "pinia";
import { formatTime } from "@renderer/utils/util";
import api from "./api";
import mime from "mime";

export const useStore = defineStore("default", {
  state: () => {
    return {
      audio: null, // 音频对象

      localMusicList: [], // 本地音乐
      cloudMusicList: [], // 云上音乐
      curMusicList: [], // 当前播放音乐的列表

      playingMusic: null, // 正在播放的音乐
      progress: 0, // 已播放进度
      lyric: "", // 歌词
    };
  },
  getters: {
    // 格式化后的已播放时常
    formatProgress: state => formatTime(state.progress),
    // 全部列表
    musicList: state => {
      const map = new Map();
      state.localMusicList.forEach(i => map.set(i.name, i));
      state.cloudMusicList.forEach(i => {
        if (map.has(i.name)) {
          map.set(i.name, Object.assign({}, map.get(i.name), i));
        } else map.set(i.name, i);
      });
      const rt = Array.from(map.values());
      return rt.map(i => {
        i.showName = /(.*)\..*?$/.exec(i.name)[1];
        return i;
      });
    },
  },
  actions: {
    // 播放对象初始化
    audioInit() {
      // 获取音乐列表
      api.getCloudMusicList().then(rsp => (this.cloudMusicList = rsp));
      electronLocal.getLocalMusicList().then(rsp => (this.localMusicList = rsp));
      // audio对象
      const audio = new Audio();
      audio.volume = Number(localStorage.getItem("volumn") || 1);
      audio.preload = "auto";
      audio.onended = () => {
        this.progress = 0;
        this.lyric = "";
      };
      audio.ontimeupdate = () => {
        const f = this.audio.currentTime.toFixed(2);
        this.progress = parseFloat(f);
      };
      window.aaa = audio;
      this.audio = audio;
    },
    // 开始播放
    play(src) {
      if (src) {
        this.audio.src = src;
      }
      this.audio.play();
    },
    // 播放音乐
    async playMusic(item) {
      if (!this.curMusicList.find(i => i.name === item.name)) this.curMusicList.push(item);
      const { name, fullpath, isLocal } = item;
      let url;
      // 获取歌词
      // api.getCloudLyric(item.name).then(rsp => {
      //   if (rsp) store.lyric = rsp;
      // });
      // 是否存在在本地
      if (isLocal) {
        const buffer = await electronLocal.playMusic({ name, fullpath });
        const blob = new Blob([buffer], { type: mime.getType(name) });
        url = URL.createObjectURL(blob);
      } else {
        const rsp = api.getCloudMusic(name);
        url = rsp;
      }
      this.playingMusic = item;
      this.play(url);
    },
    // 改变音量
    changeVolumn(value) {
      this.audio.volume = Number(value);
      localStorage.setItem("volumn", value);
    },
    // 改变进度
    changeProgress(value) {
      this.audio.currentTime = value;
      this.progress = value;
    },
  },
});
