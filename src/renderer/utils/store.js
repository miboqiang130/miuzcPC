import { defineStore } from "pinia";
import { getRandom } from "@renderer/utils/util";
import api from "./api";
import mime from "mime";
import Notify from "@renderer/utils/notify";
import MusicCoverSvg from "@renderer/assets/imgs/music-cover.svg?url";

export const useStore = defineStore("default", {
  state: () => {
    return {
      setting: {},
      audio: null, // 音频对象

      localMusicList: [], // 本地音乐
      cloudMusicList: null, // 云上音乐
      curMusicList: [], // 当前播放音乐的列表

      playingMusic: null, // 正在播放的音乐
      progress: 0,
      volume: 0,
      lyric: "", // 歌词

      playMode: localStorage.getItem("playMode") || "cycle", // 循环播放，单个播放
    };
  },
  getters: {
    // 全部列表
    musicList: state => {
      // 避免本地和云端分别加载出来
      if (!state.cloudMusicList) return [];
      const map = new Map();
      state.localMusicList.forEach(i => map.set(i.name, i));
      state.cloudMusicList?.forEach(i => {
        i.isCloud = true;
        if (map.has(i.name)) {
          map.set(i.name, Object.assign({}, map.get(i.name), i));
        } else map.set(i.name, i);
      });
      const rt = Array.from(map.values()).map(i => {
        i.showName = /(.*)\..*?$/.exec(i.name)[1];
        return i;
      });
      return rt.sort((a, b) => (a.showName > b.showName ? 1 : -1));
    },

    // 专辑封面
    cover: state => {
      if (state.playingMusic?.info?.common?.picture?.length > 0) {
        const p = state.playingMusic.info.common.picture[0];
        return URL.createObjectURL(new Blob([p.data], { type: p.format }));
      } else return MusicCoverSvg;
    },
  },
  actions: {
    // 获取本地音乐列表
    getLocal() {
      if (this.setting.local) electronLocal.getLocalMusicList(this.setting.local).then(rsp => ((this.localMusicList = rsp), console.log(rsp)));
    },

    // 获取云端音乐列表
    async getCloud() {
      if (this.setting.cloud && this.setting.cloudPw) {
        const rsp = await api.getCloudMusicList();
        if (rsp?.status === 200) {
          this.cloudMusicList = rsp.data;
        } else this.cloudMusicList = [];
      }
    },

    // 播放对象初始化
    audioInit() {
      // audio对象
      const audio = new Audio();
      audio.preload = "auto";
      // 进度更新时
      audio.ontimeupdate = () => {
        this.progress = audio.currentTime;
      };
      // 播放结束时
      audio.onended = () => {
        this.playNext();
      };
      // 音量改变时，避免频繁调用localStorage
      audio.onvolumechange = (() => {
        let timeout;
        return () => {
          if (timeout) clearTimeout(timeout);
          this.volume = audio.volume;
          timeout = setTimeout(() => {
            localStorage.setItem("volume", audio.volume);
            timeout = null;
          }, 1000);
        };
      })();

      window.aaa = audio;
      audio.volume = Number(localStorage.getItem("volume") || 1);
      this.audio = audio;

      // 快捷键
      false &&
        window.top.document.addEventListener("keydown", event => {
          switch (event.code) {
            case "Space":
              if (audio.paused) {
                if (this.playingMusic) audio.play();
                else if (this.curMusicList.length > 0) this.playMusic(this.curMusicList[0]);
              } else audio.pause();
              break;
            case "ArrowUp":
              if (audio.volume + 0.1 > 1) audio.volume = 1;
              else audio.volume += 0.1;
              break;
            case "ArrowDown":
              if (audio.volume - 0.1 < 0) audio.volume = 0;
              else audio.volume -= 0.1;
              break;
            case "ArrowLeft":
              this.playNext(-1);
              break;
            case "ArrowRight":
              this.playNext();
              break;
          }
        });
    },

    // 播放下一首
    playNext(step = 1) {
      try {
        const len = this.curMusicList.length;

        if (len === 0) throw new Error("播放列表为空");
        else if (len === 1) {
          this.audio.play();
          return;
        }

        // 当前播放音乐的序号
        const curIndex = this.playingMusic ? this.curMusicList.findIndex(i => i.name === this.playingMusic.name) : -1;

        switch (this.playMode) {
          // 顺序循环
          case "cycle":
            const nextIndex = curIndex < 0 ? 0 : (len + curIndex + step) % len;
            this.playMusic(this.curMusicList[nextIndex]);
            break;
          // 随机播放F
          case "random":
            const newIndex = getRandom(len, curIndex);
            this.playMusic(this.curMusicList[newIndex]);
            break;
          // 单曲循环
          case "once":
            this.audio.play();
            break;
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 播放音乐
    async playMusic(item) {
      const { name, fullpath, isLocal } = item;
      let url;
      // 获取歌词
      this.lyric = "";
      api.getCloudLyric(item.showName).then(rsp => (this.lyric = rsp.data));
      // 是否存在在本地
      if (isLocal) {
        const buffer = await electronLocal.playMusic({ name, fullpath });
        const blob = new Blob([buffer], { type: mime.getType(name) });
        url = URL.createObjectURL(blob);
      } else url = encodeURI(this.setting.cloud + "/music/" + item.name);

      this.playingMusic = item;
      this.audio.src = url;
      this.audio.play();
    },
  },
});
