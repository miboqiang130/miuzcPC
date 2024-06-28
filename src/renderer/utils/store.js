import { defineStore } from "pinia";
import { getRandom } from "@renderer/utils/util";
import api from "./api";
import Notify from "@renderer/utils/notify";
import MusicCoverSvg from "@renderer/assets/imgs/music-cover.svg?url";
import { decodeAudio } from "@renderer/utils/ffmpeg";
import db from "@renderer/utils/indexedDB";
import formats from "@renderer/assets/ffmpegwasm/formats.json";
import * as audio from "@renderer/utils/MiuzcAudio";

export const useStore = defineStore("default", {
  state: () => {
    return {
      setting: {},

      localMusicList: [], // 本地音乐
      cloudMusicList: null, // 云上音乐
      curMusicList: [], // 当前播放音乐的列表

      playingMusic: null, // 正在播放的音乐
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
        if (map.has(i.name)) {
          map.set(i.name, Object.assign({}, map.get(i.name), i));
        } else map.set(i.name, i);
      });
      const rt = Array.from(map.values());
      return rt.sort((a, b) => (a.name > b.name ? 1 : -1));
    },

    // 专辑封面
    cover: state => {
      if (state.playingMusic?.info?.common?.picture?.length > 0) {
        const p = state.playingMusic.info.common.picture[0];
        return URL.createObjectURL(new Blob([p.data], { type: p.format }));
      } else return MusicCoverSvg;
    },
    isCloudOk: state => state.setting.cloud && state.setting.cloudPw,
  },
  setup() {
    console.log("yes");
  },
  actions: {
    // 获取本地音乐列表
    getLocal() {
      if (this.setting.local) electronLocal.getLocalMusicList(this.setting.local).then(rsp => (this.localMusicList = rsp));
    },

    // 获取云端音乐列表
    async getCloud() {
      if (this.isCloudOk) {
        const rsp = await api.getCloudMusicList();
        if (rsp?.status === 200) {
          const l = [];
          rsp.data.forEach(i => {
            const [filename, name, ext] = /(.*)\.(.*?)$/.exec(i.name);
            const isChromeSupport = formats["chromeSupportFormats"].includes(ext);
            if (isChromeSupport || formats["ffmpegSupportDecodeFormats"].includes(ext)) {
              l.push({ name, filename, ext, isChromeSupport, isCloud: true });
            }
          });
          this.cloudMusicList = l;
        } else this.cloudMusicList = [];
      } else this.cloudMusicList = [];
    },

    // 获取歌词
    getLyric(name) {
      this.lyric = "";
      if (this.isCloudOk) api.getCloudLyric(name).then(rsp => (this.lyric = rsp.data));
    },

    // 播放下一首
    playNext(step = 1) {
      try {
        const len = this.curMusicList.length;

        if (len === 0) throw new Error("播放列表为空");
        else if (len === 1) {
          audio.play();
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
          // 随机播放
          case "random":
            const newIndex = getRandom(len, curIndex);
            this.playMusic(this.curMusicList[newIndex]);
            break;
          // 单曲循环
          case "once":
            audio.play();
            break;
        }
      } catch (e) {
        console.error(e);
      }
    },

    // 播放音乐
    async playMusic(item) {
      audio.stop();
      const { name, filename, fullpath, isLocal, isChromeSupport } = item;

      let url;
      this.getLyric(name);

      if (!isChromeSupport) {
        // 当浏览器不支持音频格式时
        // 判断是否有之前的解码
        const result = await db.get(filename);
        let blob;

        if (result) blob = result.blob;
        else {
          let buffer;
          if (isLocal) buffer = await electron.exec("local:getMusic", fullpath);
          else {
            Notify.info("格式需转换，首次播放可能需要较长时间");
            buffer = (await electron.get(encodeURI(this.setting.cloud + "/music/" + filename), null, { responseType: "arraybuffer" })).data;
          }

          // 解码音频
          buffer = await decodeAudio(filename, buffer);
          blob = new Blob([buffer], { type: "application/octet-stream" });

          // 解码后数据存到indexedDB
          db.save({ id: filename, blob });
        }

        url = URL.createObjectURL(blob);
      } else {
        // 浏览器支持格式时
        if (isLocal) {
          let buffer = await electron.exec("local:getMusic", fullpath);
          const blob = new Blob([buffer], { type: "application/octet-stream" });
          url = URL.createObjectURL(blob);
        } else url = encodeURI(this.setting.cloud + "/music/" + filename);
      }

      if (!audio.getAudioPaused()) return;
      this.playingMusic = item;
      audio.play(url);
    },
  },
});
