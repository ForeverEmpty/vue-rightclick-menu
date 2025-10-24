# RightClick-Menu

基于 Vue3 + Ts 的一个现代化、可扩展的右键菜单，支持

- 多级子菜单（hover 弹出）
- 复选项（checkbox）与分隔线（divider）
- 禁用态、图标占位
- 自动/手动关闭（autoClose 开关）
- 边界防溢出定位、点击外部

# 使用方法

## 作为库安装与使用

安装

```bash
npm install @foreverempty_/vue-rightclick-menu
```

在项目中

1. 全量引入

```ts
// main.ts
import RightClickMenu from "@foreverempty_/vue-rightclick-menu";
import "@foreverempty_/vue-rightclick-menu/index.css";
//...
app.use(RightClickMenu);
```

2. 按需引用

自定义指令(Custom Directives)

```ts
// main.ts
import { MenuDirective as vMenu } from "@foreverempty_/vue-rightclick-menu/RightClickMenu";
//...
app.directive("menu", vMenu);
```

命令式调用

```ts
import { MenuService as Menu } from "@foreverempty_/vue-rightclick-menu/RightClickMenu";

const menu = Menu({ props });
```

3. 使用用例

```ts
<script setup lang="ts">
import { delay, noop } from "lodash-es";
import { ref } from "vue";

const check = ref(false);

const items1 = ref<RightClickItemProps[]>([
  {
    id: 4,
    type: "multi",
    text: "4",
    child: [
      { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
      {
        id: 2,
        type: "checkbox",
        text: "2",
        checked: () => check.value,
        onClick: (e) => console.log(e),
        onChange: (val) => (check.value = val),
      },
      {
        id: 3,
        type: "divide",
      },
      {
        id: 4,
        type: "multi",
        text: "4",
        child: [
          { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
          {
            id: 2,
            type: "checkbox",
            text: "2",
            checked: () => check.value,
            onClick: (e) => console.log(e),
            onChange: (val) => (check.value = val),
          },
          {
            id: 3,
            type: "divide",
          },
        ],
      },
    ],
  },
  { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
  {
    id: 2,
    type: "checkbox",
    text: "2",
    checked: () => check.value,
    onClick: (e) => console.log(e),
    onChange: (val) => (check.value = val),
  },
  {
    id: 3,
    type: "divide",
  },
  {
    id: 5,
    type: "default",
    text: "Lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng text",
  },
]);

const items2 = ref<RightClickItemProps[]>([
  {
    id: 4,
    type: "multi",
    text: "4",
    child: [
      { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
      {
        id: 2,
        type: "checkbox",
        text: "2",
        checked: () => check.value,
        onClick: (e) => console.log(e),
        onChange: (val) => (check.value = val),
      },
      {
        id: 3,
        type: "divide",
      },
      { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 5, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 6, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 7, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 8, type: "default", text: "1", onClick: (e) => noop(e) },
    ],
  },
  { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
  {
    id: 3,
    type: "divide",
  },
  {
    id: 2,
    type: "checkbox",
    text: "2",
    checked: () => check.value,
    onClick: (e) => console.log(e),
    onChange: (val) => (check.value = val),
  },
]);


// 指令调用
const menu1 = MenuService({
  top: 10,
  left: 10,
  items: items1.value,
});
menu1.setPos(100, 100).open();

const menu2 = MenuService({
  top: 20,
  left: 20,
  items: items2.value,
});
delay(() => menu2.open(), 1000);
delay(() => menu2.destroy(), 1500);
delay(() => menu2.open(), 2000);
</script>

<template>
  <!--自定义指令调用-->
  <div
    class="test"
    v-menu="{
      items: items1,
    }"
  ></div>
  <hr></hr>
  <div
    class="test"
    v-menu="{
      items: items2,
    }"
  ></div>
</template>

<style scoped>
.test {
  width: 500px;
  height: 500px;
  background: red;
}
</style>
```

# API

## RightClickContextProps

| Name      | Description                | Type                    |
| --------- | -------------------------- | ----------------------- |
| id        | 自动生成                   | `number`                |
| top       | 菜单距离屏幕顶部位置       | `number \| string`      |
| left      | 菜单距离屏幕左侧位置       | `number \| string`      |
| autoClose | 点击复选项是否自动关闭菜单 | `boolen`                |
| items     | 菜单项                     | `RightClickItemProps[]` |

## RightClickItemProps

| Name     | Description          | Type                                                  |
| -------- | -------------------- | ----------------------------------------------------- |
| id       | 菜单项 ID 值         | `number`                                              |
| checked  | 复选项的值           | `() => boolean`                                       |
| type     | 菜单类型             | `enum` - `'default'\|'checkedbox'\|'divide'\|'multi'` |
| text     | 菜单项内容           | `string`                                              |
| icon     | 菜单图标             | `string`                                              |
| disable  | 菜单项是否可用       | `boolean`                                             |
| shortcut | 快捷键显示内容       | `string`                                              |
| onClick  | 点击后的回调函数     | `(e: MouseEvent) => void`                             |
| onChange | 复选项值更改后的回调 | `(newValue: boolean) => void`                         |
| child    | 子菜单项             | `RightClickItemProps[]`                               |

## Handler

| Name          | Description  | Type                                                                             |
| ------------- | ------------ | -------------------------------------------------------------------------------- |
| open          | 打开菜单     | `() => void`                                                                     |
| close         | 关闭菜单     | `() => void`                                                                     |
| changeVisible | 更改菜单显示 | `() => void`                                                                     |
| setVisible    | 设置菜单显示 | `(value:boolean) => void`                                                        |
| setPos        | 设置菜单位置 | `(x: number, y: number) => RightClickMenuInstance`                               |
| setProps      | 设置菜单参数 | `(props: Partial<Omit<RightClickContextProps, "id">>) => RightClickMenuInstance` |
| destory       | 销毁菜单实例 | `() => void`                                                                     |

# 未来

- 深色模式
- 快捷键实现
- 支持键盘交互

# 许可证

MIT
