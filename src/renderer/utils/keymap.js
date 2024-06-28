import * as audio from "@renderer/utils/MiuzcAudio";
import { useStore } from "@renderer/utils/store";

const store = useStore();

// 快捷键
window.top.document.addEventListener("keydown", event => {
  switch (event.code) {
    case "Space":
      if (audio.audioAttr.status !== "playing") {
        if (store.playingMusic) audio.play();
        else if (store.curMusicList.length > 0) store.playMusic(store.curMusicList[0]);
      } else audio.pause();
      event.preventDefault();
      break;
    case "ArrowUp": {
      const v = audio.audioAttr.volume + 0.1;
      if (v > 1) audio.setVolume(1);
      else audio.setVolume(v);
      break;
    }
    case "ArrowDown": {
      const v = audio.audioAttr.volume - 0.1;
      if (v < 0) audio.setVolume(0);
      else audio.setVolume(v);
      break;
    }
    case "ArrowLeft":
      store.playNext(-1);
      break;
    case "ArrowRight":
      store.playNext();
      break;
  }
});
