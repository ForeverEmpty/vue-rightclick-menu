import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import shell from "shelljs";
import { readdir, readdirSync } from "fs";
import { filter, map, includes, delay, defer } from "lodash-es";
import hooksPlugin from "./hooksPlugins";

const TRY_MOVE_STYLES_DELAY = 800 as const;

function getDirectoriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true });

  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}

function moveStyles() {
  readdir("./dist/es/theme", (err) => {
    if (err) return delay(moveStyles, TRY_MOVE_STYLES_DELAY);
    defer(() => shell.mv("./dist/es/theme", "./dist"));
  });
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      outDir: "dist/types",
    }),
    hooksPlugin({
      rmFiles: ["./dist/es", "./dist/theme", "./dist/types"],
      afterBuild: moveStyles,
    }),
  ],
  build: {
    outDir: "dist/es",
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "vue-rightclick-menu",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/free-brands-svg-icons",
        "@fortawesome/vue-fontawesome",
      ],
      output: {
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name === "style.css") return "index.css";
          if (
            assetInfo.type === "asset" &&
            /\.(css)$/i.test(assetInfo.name as string)
          )
            return "theme/[name].[ext]";
          return assetInfo.name as string;
        },
        manualChunks(id) {
          if (includes(id, "node_modules")) return "vendor";

          if (includes(id, "/packages/hooks")) return "hooks";

          if (
            includes(id, "/packages/utils") ||
            includes(id, "plugin-vue:export-helper")
          )
            return "utils";
          for (const item of getDirectoriesSync("./packages/components")) {
            if (includes(id, `/packages/components/${item}`)) {
              return item;
            }
          }
        },
      },
    },
  },
});
