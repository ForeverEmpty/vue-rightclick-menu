# RightClick Menu（Vue 3 + TS + Vite）

一个现代化、可访问（ARIA）、可扩展的右键菜单组件，支持：

- 多级子菜单（hover 弹出）
- 复选项（checkbox）与分隔线（divider）
- 禁用态、快捷键提示、图标占位
- 自动/手动关闭（autoClose 开关）
- 边界防溢出定位、点击外部与 ESC 关闭

目录结构与代码基于 Vite + Vue 3 + TypeScript。

## 快速开始

```bash
npm install
npm run dev
```

打开浏览器访问终端显示的本地地址即可预览。

## 使用方法

1. 作为库安装与使用

```bash
npm install @foreverempty_/vue-rightclick-menu
```

在项目中：

```ts
import { ContextMenu, registerComponentMenu } from '@foreverempty_/vue-rightclick-menu'
import '@foreverempty_/vue-rightclick-menu/style/context-menu.css'
```

2. 在任意元素上注册菜单：

```ts
import { registerComponentMenu } from '@/util/registerComponentMenu'
import type { MenuItem } from '@/types/menu'

const items: MenuItem[] = [
  { id: 'copy', label: '复制', onClick: () => console.log('copy') },
  { id: 'paste', label: '粘贴', disabled: true },
  { id: 'div1', type: 'divider' },
  {
    id: 'showLine',
    type: 'checkbox',
    label: '显示行号',
    checked: true,
    onClick: (c) => console.log('checked', c),
  },
  {
    id: 'view',
    type: 'multile',
    label: '视图',
    children: [
      { id: 'zoomIn', label: '放大', onClick: () => console.log('zoom in') },
      { id: 'zoomOut', label: '缩小', onClick: () => console.log('zoom out') },
    ],
  },
]

// 选择器批量注册示例
document.querySelectorAll<HTMLElement>('.test').forEach((el) => {
  registerComponentMenu(el, items)
})
```

3. 在根组件挂载一次菜单容器：

```vue
<ContextMenu :autoClose="true" />
```

当 `autoClose` 设为 `false` 时，点击菜单项不会自动关闭（仍可通过外部点击或 ESC 关闭）。

## API 概览

- 组件：`ContextMenu`
  - `autoClose?: boolean`：是否点击后自动关闭（默认 true）。

- 工具函数：`registerComponentMenu(el: HTMLElement, items: MenuItem[]): () => void`
  - 绑定右键事件并显示菜单；返回解注册函数用于移除监听。

- 类型：`MenuItem`（见下）

```ts
export type MenuItem =
  | {
      id: string | number
      type?: 'normal'
      label?: string
      disabled?: boolean
      icon?: string
      shortcut?: string
      onClick?: () => void
    }
  | {
      id: string | number
      type: 'checkbox'
      label?: string
      disabled?: boolean
      icon?: string
      shortcut?: string
      checked?: boolean
      onClick?: (checked: boolean) => void
    }
  | { id: string | number; type: 'divider' }
  | {
      id: string | number
      type: 'multile'
      label?: string
      disabled?: boolean
      icon?: string
      shortcut?: string
      children: MenuItem[]
    }
```

## 多级菜单

使用 `type: 'multile'` 并提供 `children: MenuItem[]` 即可递归渲染。悬停父项会在右侧弹出子菜单。

## 可访问性

- 容器使用 `role="menu"`、子项使用 `role="menuitem"`/`role="separator"`
- 支持 ESC 关闭与点击外部关闭

## 自定义样式

你可以通过以下方式自定义右键菜单的样式：

### 1. 覆盖默认 CSS

组件默认样式位于 `styles/context-menu.css`。你可以在你的项目中引入自己的 CSS 文件，并覆盖默认样式。例如：

```css
/* 覆盖菜单背景色和字体颜色 */
.context-menu {
  background: #222;
  color: #fff;
}

/* 自定义菜单项悬停效果 */
.context-menu-item:hover {
  background: #444;
  color: #ffd700;
}
```

或参考 `exampless/coustomStyle.css`。

确保你的自定义样式在默认样式之后加载。

### 2. 使用深度选择器（Vue 3）

如果你在 `App.vue` 或其他组件中使用 `<style scoped>`，可以通过深度选择器覆盖子组件样式：

```vue
<style scoped>
/* ::v-deep 用于穿透子组件样式 */
::v-deep .context-menu {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}
</style>
```

### 3. 直接修改样式文件

你也可以直接修改 `styles/context-menu.css` 文件，来满足你的个性化需求。

## 许可证

MIT
