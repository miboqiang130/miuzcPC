import { dayjs } from "element-plus";

export const formatTime = time => (time ? dayjs.unix(time).format("mm:ss") : "00:00");

export function strToBase64() {}

export function base64ToStr(str) {
  const binString = atob(str);
  return new TextDecoder().decode(Uint8Array.from(binString, m => m.codePointAt(0)));
}

/**
 *
 * @param {number} max 随机的最大值
 * @param {number} cur 不要的值
 * @returns 随机0-max之间不是cur的值
 */
export function getRandom(max, cur) {
  while (true) {
    let rt = Math.floor(Math.random() * max);
    if (cur != rt) return rt;
  }
}
