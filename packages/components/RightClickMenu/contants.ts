import type { InjectionKey } from "vue";
import type { RightClickMenuContext } from "./types";

export const RIGHTCLICKMENU_CTX_KEY: InjectionKey<RightClickMenuContext> =
  Symbol("rightClickMenuKey");
