import { reactive } from 'vue'
import type { MenuItem } from '@/types/menu'

export const menuState = reactive({
  visible: false,
  x: 0,
  y: 0,
  menuItems: [] as MenuItem[],
  open(x: number, y: number, items: MenuItem[]) {
    this.x = x
    this.y = y
    this.menuItems = items
    this.visible = true
  },
  close() {
    this.visible = false
  },
  toggle(x: number, y: number, items: MenuItem[]) {
    if (this.visible) {
      this.close()
    } else {
      this.open(x, y, items)
    }
  },
})
