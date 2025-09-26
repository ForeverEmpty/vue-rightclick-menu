<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, nextTick, ref, watch, computed } from 'vue'
import type { ContextMenuProps } from './types'
import MenuTree from './MenuTree.vue'
import { menuState } from '@/store/menuStateStore'

const props = defineProps<ContextMenuProps>()
const contextMenuRef = useTemplateRef<HTMLElement>('contextMenu')
const menuStyle = ref<Record<string, string>>({})

const visible = computed(() => menuState.visible)

const calculatePosition = async () => {
  await nextTick()

  if (!contextMenuRef.value) return

  const menu = contextMenuRef.value
  const menuRect = menu.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  let x = menuState.x
  let y = menuState.y

  if (x + menuRect.width > viewportWidth) x = viewportWidth - menuRect.width - 10
  if (x < 10) x = 10
  if (y + menuRect.height > viewportHeight) y = viewportHeight - menuRect.height - 10
  if (y < 10) y = 10

  menuStyle.value = { left: `${x}px`, top: `${y}px` }
}

const handleClickOutside = (e: MouseEvent) => {
  if (contextMenuRef.value && !contextMenuRef.value.contains(e.target as HTMLElement)) {
    menuState.close()
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') menuState.close()
}

watch(
  () => [menuState.x, menuState.y, menuState.visible],
  () => {
    if (menuState.visible) calculatePosition()
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('contextmenu', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('contextmenu', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>
<template>
  <div
    v-if="visible"
    class="context-menu"
    :style="menuStyle"
    ref="contextMenu"
    role="menu"
    aria-label="上下文菜单"
    @contextmenu.prevent
    @click.stop
  >
    <MenuTree :items="menuState.menuItems" :autoClose="props.autoClose" />
  </div>
</template>
