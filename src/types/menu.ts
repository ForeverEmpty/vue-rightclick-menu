export type MenuItemType = 'normal' | 'multile'

export interface MenuItemBase {
  id: number | string
  label?: string
  disabled?: boolean
  icon?: string
  shortcut?: string
}

export interface NormalMenuItem extends MenuItemBase {
  type?: 'normal'
  onClick?: () => void
  action?: string
}

export interface MultileMenuItem extends MenuItemBase {
  type: 'multile'
  children: MenuItem[]
  action?: string
}

export interface CheckboxMenuItem extends MenuItemBase {
  type: 'checkbox'
  checked?: boolean
  onClick?: (checked: boolean) => void
}

export interface DividerMenuItem {
  id: number | string
  type: 'divider'
}

export type MenuItem = NormalMenuItem | MultileMenuItem | CheckboxMenuItem | DividerMenuItem
