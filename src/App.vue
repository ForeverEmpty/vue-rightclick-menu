<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { registerComponentMenu } from './util/registerComponentMenu'
import ContextMenu from './components/ContextMenu/ContextMenu.vue'
import type { MenuItem } from '@/types/menu'

onMounted(() => {
  const demoItems = ref<MenuItem[]>([
    { id: 'copy', type: 'normal', label: '复制', action: 'copy', onClick: () => console.log('copy') },
    { id: 'paste', type: 'normal', label: '粘贴', action: 'paste', disabled: true },
    { id: 'div1', type: 'divider' },
    {
      id: 'check1',
      type: 'checkbox',
      label: '显示行号',
      checked: true,
      onClick: (checked) => {
        console.log('checked', checked)
      },
    },
    {
    id: 'view',
    type: 'multile',
    label: '视图',
    children: [
      { id: 'zoomIn', type: 'normal', label: '放大', onClick: () => console.log('zoom in') },
      { id: 'zoomOut', type: 'normal', label: '缩小', onClick: () => console.log('zoom out') },
      { id: 'div1', type: 'divider' },
      { id: 'showLine', type: 'checkbox', label: '显示行号', checked: true, onClick: c => console.log('checked', c) },
      {
        id: 'more',
        type: 'multile',
        label: '更多',
        children: [
          { id: 'toggleStatusBar', type: 'normal', label: '状态栏', onClick: () => {} },
        ],
      },
    ],
  }
  ])

  const selectors = ['.test', '.custom-element', '#special-div', '[data-menu]']
  const cleaners: Array<() => void> = []
  selectors.forEach((selector) => {
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll(selector)
    elements.forEach((element) => {
      const cleanup = registerComponentMenu(element, demoItems.value)
      if (cleanup) cleaners.push(cleanup)
    })
  })

  onUnmounted(() => cleaners.forEach((fn) => fn()))
})
</script>

<template>
  <!-- 类选择器测试 -->
  <div class="test"></div>
  <div class="test"></div>

  <!-- 自定义类名测试 -->
  <div class="custom-element"></div>
  <div class="custom-element"></div>

  <!-- ID选择器测试 -->
  <div id="special-div"></div>

  <!-- 属性选择器测试 -->
  <div data-menu="true"></div>
  <div data-menu="true"></div>

  <!-- 未注册的元素 -->
  <div class="unregistered"></div>

  <ContextMenu />
  <!-- 若需点击不自动关闭 -->
  <!-- <ContextMenu :autoClose="false" /> -->
</template>

<style scoped>
.test {
  width: 300px;
  height: 300px;
  background-color: red;
  margin: 10px;
}

.custom-element {
  width: 200px;
  height: 200px;
  background-color: blue;
  margin: 10px;
}

#special-div {
  width: 250px;
  height: 150px;
  background-color: green;
  margin: 10px;
}

[data-menu] {
  width: 180px;
  height: 180px;
  background-color: orange;
  margin: 10px;
}

.unregistered {
  width: 150px;
  height: 150px;
  background-color: gray;
  margin: 10px;
  border: 2px dashed #666;
}
</style>
