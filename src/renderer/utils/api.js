const cloud = localStorage.getItem("cloud");

export default {
  // 获取远程音乐列表
  getCloudMusicList() {
    return electron.get(cloud + "/music");
  },
  // 获取远程音乐
  getCloudMusic(filename) {
    const url = encodeURI(cloud + "/music/" + filename + "?React-Auth=Miuzc");
    return url;
  },
  //获取远程歌词
  getCloudLyric(musicName) {
    const url = encodeURI(cloud + "/lyric/" + musicName);
    return electron.get(url);
  },
};
