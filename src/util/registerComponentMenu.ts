import { menuState } from '@/store/menuStateStore'
import type { MenuItem } from '@/types/menu'

export function registerComponentMenu(component: HTMLElement, menuItems: MenuItem[]) {
  if (!component) {
    console.log('组件不存在，退出')
    return
  }
  if (menuItems.length === 0) {
    console.log('菜单项为空，退出')
    return
  }

  const handler = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // 阻止事件冒泡，避免触发document的contextmenu事件

    menuState.open(e.clientX, e.clientY, menuItems)
  }
  component.addEventListener('contextmenu', handler, true) // 使用捕获阶段，确保优先处理

  // 返回解注册函数，便于在组件卸载或变更时移除
  return () => component.removeEventListener('contextmenu', handler, true)
}
