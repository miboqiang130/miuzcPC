export default {
  // 获取远程音乐列表
  getCloudMusicList() {
    return electron.get("/music");
  },
  //获取远程歌词
  getCloudLyric(musicName) {
    const url = encodeURI("/lyric?name=" + musicName);
    return electron.get(url);
  },
};
