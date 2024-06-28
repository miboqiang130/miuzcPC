import { reactive } from "vue";

const react = reactive({
  status: "none", // 状态。none：空 | waiting：加载中 | playing：播放中 | pause：暂停
  volume: 1, // 音量
  currentTime: 0, // 当前播放时间
  duration: 0, // 总时长
});
const audio = new Audio();

audio.preload = "auto";
audio.volume = Number(localStorage.getItem("volume") || 1);

// 状态改变
audio.onwaiting = () => {
  react.status = "waiting";
};
audio.onplaying = () => {
  react.status = "playing";
};
audio.onplay = () => {
  react.status = "playing";
};
audio.onended = () => {
  react.status = "none";
};
audio.onpause = () => {
  react.status = "pause";
};
audio.ondurationchange = () => {
  react.duration = audio.duration;
};
audio.ontimeupdate = () => {
  react.currentTime = audio.currentTime;
};

// 发生错误时
audio.onerror = err => {
  console.log(err);
};
// 音量改变时，避免频繁调用localStorage
audio.onvolumechange = (() => {
  let timeout;
  return () => {
    if (timeout) clearTimeout(timeout);
    react.volume = audio.volume;
    timeout = setTimeout(() => {
      localStorage.setItem("volume", audio.volume);
      timeout = null;
    }, 1000);
  };
})();

// 属性
export { react as audioAttr };

// 播放
export const play = src => {
  if (src) {
    react.currentTime = 0;
    react.duration = 0;
    audio.src = src;
    audio.play();
  } else if (audio.src) {
    audio.play();
  }
};

// 暂停
export const pause = () => {
  audio.pause();
};

// 停止播放
export const stop = () => {
  audio.src = "";
};

// 设置进度
export const setCurrentTime = time => {
  audio.currentTime = time;
};

// 设置音量
export const setVolume = volume => {
  audio.volume = volume;
};

// 事件绑定
export const on = (name, cb) => {
  audio.addEventListener(name, cb);
};

// 取消绑定
export const off = (name, cb) => {
  audio.removeEventListener(name, cb);
};
