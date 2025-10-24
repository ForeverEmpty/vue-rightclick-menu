import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { compression } from "vite-plugin-compression2";
import { resolve } from "path";
import hooksPlugin from "./hooksPlugins";
import { readFile } from "fs";
import shell from "shelljs";
import { defer, delay } from "lodash-es";

const TRY_MOVE_STYLES_DELAY = 800 as const;

function moveStyles() {
  readFile("./dist/umd/index.css.gz", (err) => {
    if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
    defer(() => shell.cp("./dist/umd/index.css", "./dist/index.css"));
  });
}

export default defineConfig({
  plugins: [
    vue(),
    compression({
      include: /.(cjs|css)$/i,
    }),
    hooksPlugin({
      rmFiles: ["./dist/umd", "./dist/index.css"],
      afterBuild: moveStyles,
    }),
  ],
  build: {
    outDir: "dist/umd",
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "vue-rightclick-menu",
      fileName: "index",
      formats: ["umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name === "style.css") return "index.css";
          return assetInfo.name as string;
        },
      },
    },
  },
});
