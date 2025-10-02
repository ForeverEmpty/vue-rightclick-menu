import { menuState } from '@/store/menuStateStore'
import type { MenuItem } from '@/types/menu'

export function registerComponentMenu(component: HTMLElement, menuItems: MenuItem[]) {
  if (!component) {
    throw new Error('Component is null or undefined')
  }
  if (menuItems.length === 0) {
    throw new Error('Menu items are empty')
  }

  const handler = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    menuState.open(e.clientX, e.clientY, menuItems)
  }
  component.addEventListener('contextmenu', handler, true)

  return () => component.removeEventListener('contextmenu', handler, true)
}
