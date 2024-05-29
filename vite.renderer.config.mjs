import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config.mjs";
import vue from "@vitejs/plugin-vue";
import path from "path";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config
export default defineConfig(env => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  /** @type {import('vite').UserConfig} */
  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [pluginExposeRenderer(name), vue(), svgLoader()],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@src": path.resolve(__dirname, "src"),
        "@renderer": path.resolve(__dirname, "src/renderer"),
      },
    },
    clearScreen: false,
  };
});
