import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { RightClickMenu } from "@vue-rightclick-menu/components";
import "@vue-rightclick-menu/theme/index.css";
import type { App } from "vue";

library.add(fas);
const installer = (app: App) => app.use(RightClickMenu);

export * from "@vue-rightclick-menu/components";
export default installer;
