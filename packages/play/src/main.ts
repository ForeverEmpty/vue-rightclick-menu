import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { vMenu } from "@vue-rightclick-menu/components";

createApp(App).directive("menu", vMenu).mount("#app");
