<script setup lang="ts">
import { addUnit } from "@vue-rightclick-menu/utils";
import type {
  RightClickContextProps,
  RightClickContextInstance,
  RightClickContextEmits,
} from "./types";
import RightClickItem from "./RightClickItem.vue";
import { computed, inject, nextTick, provide, ref, watch, type Ref } from "vue";
import { RIGHTCLICKMENU_CTX_KEY } from "./contants";
import { useEventListener } from "../../hooks";
import { isNumber } from "lodash-es";

const props = defineProps<RightClickContextProps>();
const emits = defineEmits<RightClickContextEmits>();

const top = ref(0);
const left = ref(0);

const topOffset = computed(() => addUnit(props.top));
const leftOffset = computed(() => addUnit(props.left));

const _ref = ref<HTMLDivElement>();
const contextPaddingAndMargin = computed(() => {
  if (!_ref.value) return;
  const style = window.getComputedStyle(_ref.value);
  const paddingLeft = parseFloat(style.paddingLeft);
  const marginLeft = parseFloat(style.marginLeft);
  return paddingLeft + marginLeft;
});

const visible = ref(false);

function setVisible(val: boolean) {
  visible.value = val;
  emits("visible-change", val);
}

function close() {
  setVisible(false);
}

useEventListener(document, "click", (e: Event) => {
  if (_ref.value && e.target) {
    if (!_ref.value.contains(e.target as HTMLElement)) {
      close();
    }
  }
});

const parentItemEl = inject<Ref<HTMLButtonElement> | void>(
  "parentItemEl",
  void 0
);

const calculatePosition = async () => {
  await nextTick();

  if (!_ref.value) return;

  const menu = _ref.value;
  const menuRect = menu.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = isNumber(left.value) ? left.value : parseFloat(left.value);
  let y = isNumber(top.value) ? top.value : parseFloat(top.value);

  if (parentItemEl) {
    const pRect = parentItemEl.value.getBoundingClientRect();

    let pX = pRect.right;
    let pY = pRect.top;

    if (pX + menuRect.width > viewportWidth - 10)
      x = -menuRect.width - contextPaddingAndMargin.value!;

    if (pY + menuRect.height > viewportHeight - 10)
      y = viewportHeight - pRect.bottom - menuRect.height;

    if (menuRect.height > viewportHeight) y = -pRect.height;

    left.value = x;
    top.value = y;
    return;
  }

  if (x + menuRect.width > viewportWidth)
    x = viewportWidth - menuRect.width - 10;
  if (x < 10) x = 10;
  if (y + menuRect.height > viewportHeight)
    y = viewportHeight - menuRect.height - 10;
  if (y < 10) y = 10;

  left.value = x;
  top.value = y;
};

watch(
  () => [() => props.top, () => props.left, () => visible.value],
  () => {
    if (visible.value) calculatePosition();
  },
  { immediate: true }
);

provide(RIGHTCLICKMENU_CTX_KEY, {
  close: () => setVisible(false),
  autoClose: computed(() => props.autoClose ?? false),
  contextPaddingAndMargin,
});

defineExpose<RightClickContextInstance>({
  close,
  changeVisible: () => setVisible(!visible.value),
  setVisible,
});
</script>

<template>
  <div
    class="context-menu"
    :style="{
      transform: `translate(${leftOffset}, ${topOffset})`,
    }"
    v-show="visible"
    ref="_ref"
  >
    <RightClickItem v-for="item in props.items" :key="item.id" v-bind="item" />
  </div>
</template>

<style scoped>
@import "./style.css";
</style>
