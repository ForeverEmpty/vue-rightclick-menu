import { h, render, type ComponentInternalInstance } from "vue";
import MenuConstructor from "./RightClickContext.vue";
import type {
  RightClickContextProps,
  RightClickMenu,
  RightClickMenuInstance,
} from "./types";
import { isEqual } from "lodash-es";

const MENU_NUM_KEY = "f-menu-num" as const;

const menuPropsMap: Map<number, RightClickContextProps> = new Map();
let instance: ComponentInternalInstance | void;
let container: HTMLDivElement | void;
let id = 0;

function destoryCurrentMenu() {
  if (!container || !instance) return;
  render(null, container);
  instance = void 0;
}

const CreateRightClickMenu = (
  props: RightClickContextProps
): RightClickMenuInstance => {
  let _props: RightClickContextProps = { id: id++, ...props };

  if (!getMenuNumber() || getMenuNumber() === "0") {
    container = document.createElement("div");
    const t_props: RightClickContextProps = { top: 0, left: 0, items: [] };

    const vNode = h(MenuConstructor, t_props);

    render(vNode, container);

    document.body.appendChild(container.firstElementChild!);
    instance = vNode.component!;
  }

  menuPropsMap.set(_props.id!, _props);
  addMenuNumber();

  const updateMenu = () => {
    if (
      instance!.props.id !== _props.id ||
      isEqual(_props, menuPropsMap.get(_props.id!))
    ) {
      const vNode = h(MenuConstructor, _props);
      destoryCurrentMenu();

      render(vNode, container!);

      document.body.appendChild(container!.firstElementChild!);
      instance = vNode.component!;
    }
  };

  const open = () => {
    if (!instance || !container) return;
    if (!menuPropsMap.get(_props.id!)) return;

    updateMenu();
    instance.exposed!.setVisible(true);
  };

  const close = () => {
    if (!instance || !container) return;
    if (!menuPropsMap.get(_props.id!)) return;

    instance.exposed!.close();
  };

  const changeVisible = () => {
    if (!instance || !container) return;
    if (!menuPropsMap.get(_props.id!)) return;

    updateMenu();
    instance.exposed!.changeVisible();
  };

  const setVisible = (value: boolean) => {
    if (!instance || !container) return;
    if (!menuPropsMap.get(_props.id!)) return;

    if (value) updateMenu();
    instance.exposed!.setVisible(value);
  };

  const destroy = () => {
    if (!menuPropsMap.get(_props.id!)) return;

    subMenuNumber();
    if (instance!.props.id === _props.id) close();
    menuPropsMap.delete(_props.id!);

    if (!getMenuNumber() || getMenuNumber() === "0") {
      container && render(null, container);
      container?.remove();
      instance = void 0;
    }
  };

  const setPos = (x: number, y: number) => {
    if (!instance || !container) return menuInstance;
    if (!menuPropsMap.get(_props.id!)) return menuInstance;

    console.log(_props);

    _props.left = x;
    _props.top = y;
    updateMenu();
    menuPropsMap.set(_props.id!, _props);
    return menuInstance;
  };

  const setProps = (props: RightClickContextProps) => {
    if (!instance || !container) return menuInstance;
    if (!menuPropsMap.get(_props.id!)) return menuInstance;
    if (isEqual(_props, { id: _props.id, ...props })) return menuInstance;

    _props = { id: _props.id, ...props };
    updateMenu();
    menuPropsMap.set(_props.id!, _props);
    return menuInstance;
  };

  const menuInstance: RightClickMenuInstance = {
    open,
    close,
    changeVisible,
    setVisible,
    setPos,
    setProps,
    destroy,
  };

  return menuInstance;
};

export const Menu: RightClickMenu = (props: RightClickContextProps) => {
  return CreateRightClickMenu(props);
};

Menu.destroyAll = () => {
  removeMenuNumber();
  container && render(null, container);
  container?.remove();
  instance = void 0;
};

function addMenuNumber() {
  const number = getMenuNumber() ?? "0";
  document.body.setAttribute(MENU_NUM_KEY, `${Number.parseInt(number) + 1}`);
}

function subMenuNumber() {
  const number = getMenuNumber();
  if (number) {
    const newNumber = Number.parseInt(number) - 1;
    if (newNumber === 0) {
      removeMenuNumber();
    } else {
      document.body.setAttribute(MENU_NUM_KEY, `${newNumber}`);
    }
  }
}

function getMenuNumber() {
  return document.body.getAttribute(MENU_NUM_KEY);
}

function removeMenuNumber() {
  document.body.removeAttribute(MENU_NUM_KEY);
}

export default Menu as RightClickMenu;
