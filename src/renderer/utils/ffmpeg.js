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

export const decodeAudio = async (filename, buffer) => {
  await ffmpeg.writeFile(filename, buffer);
  await ffmpeg.exec(["-i", filename, "output.wav"]);
  buffer = await ffmpeg.readFile("output.wav");
  return buffer;
};
