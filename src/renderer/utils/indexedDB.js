import Notify from "@renderer/utils/notify";

const openDB = indexedDB.open("default", 1);
let db;

openDB.onsuccess = () => {
  db = openDB.result;
};

openDB.onerror = () => {
  Notify.err("数据库打开失败");
};

openDB.onupgradeneeded = e => {
  const db = e.target.result;
  if (!db.objectStoreNames.contains("audioList")) {
    db.createObjectStore("audioList", { keyPath: "name" });
  }
};

export default {
  // 保存数据
  save(data) {
    return new Promise((res, rej) => {
      const os = db.transaction(["audioList"], "readwrite").objectStore("audioList");
      const action = os.add(data);

      action.onerror = () => {
        Notify.err("数据库新增失败");
        rej();
      };

      action.onsuccess = () => {
        res();
      };
    });
  },

  // 获取某项
  get(name) {
    return new Promise((res, rej) => {
      const os = db.transaction(["audioList"], "readwrite").objectStore("audioList");
      const action = os.get(name);

      action.onerror = () => {
        Notify.err("数据库新增失败");
        rej();
      };

      action.onsuccess = e => {
        res(e.target.result);
      };
    });
  },
};
