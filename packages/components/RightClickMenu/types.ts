import type { ComputedRef, Ref } from "vue";

type RightClickItemType = "default" | "checkbox" | "divide" | "multi";

export interface RightClickContextProps {
  id?: number;
  top: number | string;
  left: number | string;
  autoClose?: boolean;
  items: RightClickItemProps[];
}

export interface RightClickItemProps {
  id: string | number;
  checked?: () => boolean;
  type: RightClickItemType;
  text?: string;
  icon?: string;
  disabled?: boolean;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  onChange?: (newValue: boolean) => void;
  child?: RightClickItemProps[];
}

export interface RightClickContextEmits {
  (e: "visible-change", val: boolean): void;
}

export interface RightClickContextInstance {
  close(): void;
  changeVisible(): void;
  setVisible(value: boolean): void;
}

export interface RightClickMenuInstance {
  open(): void;
  close(): void;
  changeVisible(): void;
  setVisible(value: boolean): void;
  setPos(x: number, y: number): RightClickMenuInstance;
  setProps(
    props: Partial<Omit<RightClickContextProps, "id">>
  ): RightClickMenuInstance;
  destroy(): void;
}

export interface RightClickMenu {
  (props: RightClickContextProps): RightClickMenuInstance;
  destroyAll(): void;
}

export interface RightClickItemEmits {
  (e: "click", event: MouseEvent): void;
  (e: "change", val: boolean): void;
}

export interface RightClickMenuContext {
  close(): void;
  autoClose: ComputedRef<boolean>;
  contextPaddingAndMargin: Ref<number | void>;
}
