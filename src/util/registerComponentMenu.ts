import { menuState } from '@/store/menuStateStore'
import type { MenuItem } from '@/types/menu'

export function registerComponentMenu(component: HTMLElement, menuItems: MenuItem[]) {
  if (!component) {
    console.error('组件不存在')
    return
  }
  if (menuItems.length === 0) {
    console.error('菜单项为空')
    return
  }

  const handler = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    menuState.open(e.clientX, e.clientY, menuItems)
  }
  component.addEventListener('contextmenu', handler, true)

  return () => component.removeEventListener('contextmenu', handler, true)
}
