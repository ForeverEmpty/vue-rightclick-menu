import type { MenuItem } from '@/types/menu'

export interface ContextMenuProps {
  itemsClass?: string
  autoClose?: boolean
}

export interface MenuTreeProps {
  items: MenuItem[]
  autoClose?: boolean
}
