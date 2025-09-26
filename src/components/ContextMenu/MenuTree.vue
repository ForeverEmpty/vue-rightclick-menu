<script setup lang="ts">
import type { MenuItem } from '@/types/menu'
import { menuState } from '@/store/menuStateStore'
import type { MenuTreeProps } from './types'
import { menuTypeAction } from './menuTypeAction'

const props = defineProps<MenuTreeProps>()

const handleItemClick = (item: MenuItem) => {
  menuTypeAction().get(item.type)?.(item)
  if (props.autoClose !== false) menuState.close()
}
</script>

<template>
  <ul class="menu-items" role="menu">
    <li
      v-for="item in props.items"
      :key="item.id"
      role="none"
      :class="item.type === 'multile' ? 'has-submenu' : ''"
    >
      <button
        v-if="item.type !== 'divider'"
        class="menu-item"
        :disabled="item.disabled"
        role="menuitem"
        @click="() => handleItemClick(item)"
      >
        <span v-if="item.icon" class="icon" aria-hidden="true">{{ item.icon }}</span>
        <span class="label">{{ item.label }}</span>
        <span v-if="item.type === 'checkbox'" class="check" aria-hidden="true">{{
          item.checked ? '✔' : ''
        }}</span>
        <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
      </button>
      <hr v-else class="divider" role="separator" />

      <MenuTree
        v-if="item.type === 'multile' && Array.isArray(item.children)"
        :items="item.children"
        :autoClose="props.autoClose"
      />
    </li>
  </ul>
</template>
