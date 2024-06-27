import { FFmpeg } from "@renderer/assets/ffmpegwasm/ffmpeg/index.js";

// 初始化ffmpeg
const ffmpeg = new FFmpeg();

ffmpeg.on("log", ({ message }) => {
  console.log(message);
});
ffmpeg.load({
  coreURL: new URL(`@renderer/assets/ffmpegwasm/ffmpeg-core.js`, import.meta.url).href,
  wasmURL: new URL(`@renderer/assets/ffmpegwasm/ffmpeg-core.wasm`, import.meta.url).href,
});

export default {
  // 解码浏览器不支持的文件格式
  async decodeAudio(name, buffer) {
    console.log(buffer);
    await ffmpeg.writeFile(name, buffer);
    await ffmpeg.exec(["-i", name, "output.wav"]);
    buffer = await ffmpeg.readFile("output.wav");
    return buffer;
  },

  // 从云端获取文件并解码
  async decodeAudioFromUrl(name, url) {
    const rsp = await electron.get(url, null, { responseType: "arraybuffer" });
    await ffmpeg.writeFile(name, rsp.data);
    await ffmpeg.exec(["-i", name, "output.wav"]);
    const buffer = await ffmpeg.readFile("output.wav");
    return buffer;
  },
};
