import type { MenuItem, CheckboxMenuItem, NormalMenuItem } from '@/types/menu'
import { menuState } from '@/store/menuStateStore'

export function menuTypeAction() {
  const action: Map<string | undefined, (item: MenuItem) => void> = new Map()
  action.set('checkbox', (item: MenuItem) => {
    const checkboxItem = item as CheckboxMenuItem
    checkboxItem.checked = !checkboxItem.checked
    checkboxItem.onClick?.(checkboxItem.checked ?? false)
  })
  action.set('normal', (item: MenuItem) => {
    const normalItem = item as NormalMenuItem
    normalItem.onClick?.()
    menuState.close()
  })
  action.set('multile', () => void 0)
  action.set('divider', () => void 0)
  return { get: (type: string | undefined) => action.get(type ?? 'normal') }
}
