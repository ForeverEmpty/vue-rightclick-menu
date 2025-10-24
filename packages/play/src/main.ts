import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import RightClickMenu from "@foreverempty_/vue-rightclick-menu";
import "@foreverempty_/vue-rightclick-menu/dist/index.css";

createApp(App).use(RightClickMenu).mount("#app");
