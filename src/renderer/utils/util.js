import { dayjs } from "element-plus";

export const formatTime = time => (time ? dayjs.unix(time).format("mm:ss") : "00:00");
