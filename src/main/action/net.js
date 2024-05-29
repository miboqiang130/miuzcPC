const axios = require("axios");

const headers = {
  "React-Auth": "Miuzc",
};

export default {
  "net:get": async ({ url, params, config }) => {
    const rsp = await axios.get(url, { params, headers, ...config });
    return rsp.data;
  },
  "net:post": async ({ url, params }) => {
    const rsp = axios.post(url, params, { headers });
    return rsp.data;
  },
};
