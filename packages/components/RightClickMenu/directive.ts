import type { Directive } from "vue";
import type { RightClickContextProps, RightClickMenuInstance } from "./types";
import Menu from "./methods";

const INSTANCE_KEY = Symbol("menu");

export interface ELemnetMenu extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: RightClickMenuInstance;
    removeEventLinster: () => void;
  };
}

export const vMenu: Directive<
  ELemnetMenu,
  Omit<RightClickContextProps, "id" | "top" | "left">
> = {
  mounted(el, binding) {
    if (!binding.value) return;
    const props: RightClickContextProps = { top: 0, left: 0, ...binding.value };
    const instance = Menu(props);
    const handler = (e: Event) => {
      e.preventDefault();
      const mouseEvent = e as MouseEvent;
      el[INSTANCE_KEY]?.instance
        .setPos(mouseEvent.clientX, mouseEvent.clientY)
        .open();
    };

    el.addEventListener("contextmenu", handler);

    el[INSTANCE_KEY] = {
      instance: instance,
      removeEventLinster: () => el.removeEventListener("contextmenu", handler),
    };
  },
  updated(el, binding) {
    if (!binding.value) return;
    if (binding.oldValue === binding.value) return;
    el[INSTANCE_KEY]?.instance.setProps(binding.value);
  },
  unmounted(el) {
    el[INSTANCE_KEY]?.removeEventLinster();
    el[INSTANCE_KEY]?.instance.destroy();
    el[INSTANCE_KEY] = void 0;
  },
};
