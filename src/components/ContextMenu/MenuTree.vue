<script setup lang="ts">
import type { MenuItem } from '@/types/menu'
import { menuState } from '@/store/menuStateStore'
import type { MenuTreeProps } from './types';
import { menuTypeAction } from './menuTypeAction';

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

<style scoped>
.menu-items {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}
.has-submenu > .menu-items {
  display: none;
}
.has-submenu:hover > .menu-items {
  display: block;
  position: absolute;
  top: 0;
  left: 100%;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 4px;
  min-width: 200px;
  z-index: 1001;
}
.has-submenu {
  position: relative;
}
.has-submenu > .menu-item::after {
  content: '▶';
  margin-left: auto;
  color: #9ca3af;
  font-size: 12px;
}
.menu-item {
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
}
.menu-item:hover:not(:disabled) {
  background-color: #f3f4f6;
}
.menu-item:disabled {
  color: #9ca3af;
}
.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 6px 8px;
}
.label {
  flex: 1;
}
.shortcut {
  color: #6b7280;
  font-size: 12px;
}
</style>