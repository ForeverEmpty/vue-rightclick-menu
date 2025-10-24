import Menu from "./methods";
import { vMenu } from "./directive";
import type { App } from "vue";

export const RightClickMenu = {
  name: "RightClickMenu",
  install(app: App) {
    app.directive("menu", vMenu);
    app.config.globalProperties.$menu = Menu;
  },
  directive: vMenu,
  service: Menu,
};

export default RightClickMenu;
export { vMenu, Menu as MenuService, vMenu as MenuDirective };
export * from "./types";
