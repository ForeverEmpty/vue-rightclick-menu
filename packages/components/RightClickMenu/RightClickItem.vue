<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, provide, ref } from "vue";
import type {
  RightClickItemProps,
  RightClickItemEmits,
  RightClickContextInstance,
} from "./types";
import { RIGHTCLICKMENU_CTX_KEY } from "./contants";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { bind, debounce, type DebouncedFunc } from "lodash-es";
import RightClickContext from "./RightClickContext.vue";

const props = defineProps<RightClickItemProps>();
const emits = defineEmits<RightClickItemEmits>();

const _ref = ref<HTMLButtonElement>();
const width = ref(0);
const height = ref(0);
const multiContextLeft = computed(
  () => ctx?.contextPaddingAndMargin.value! + width.value
);
const multiContextTop = computed(() => -height.value);

const checkValue = computed(() => {
  if (props.type !== "checkbox") return false;
  return props.checked?.() ?? false;
});
const hasChild = computed(() => {
  if (props.type !== "multi") return false;
  return (props.child ?? []).length > 0;
});

const multiContextRef = ref<RightClickContextInstance>();

const ctx = inject(RIGHTCLICKMENU_CTX_KEY);

function handleClick(e: MouseEvent) {
  if (props.type === "multi" || props.type === "divide") return;
  if (props.disabled) return;

  if (props.type === "checkbox") emits("change", !checkValue.value);
  emits("click", e);

  if (props.type === "default" || ctx?.autoClose.value === true) ctx?.close();
}

function multiMouse(val: boolean) {
  if (!hasChild.value) return;
  mulitCloseDebounce.cancel();
  multiContextRef.value?.setVisible(val);
}

const mulitCloseDebounce: DebouncedFunc<() => void> = debounce(
  bind(multiMouse, null, false),
  100
);

let ro: ResizeObserver | undefined;

onMounted(() => {
  if (!_ref.value) return;
  width.value = _ref.value?.getBoundingClientRect().width;
  height.value = _ref.value?.getBoundingClientRect().height;

  ro = new ResizeObserver(() => {
    if (_ref.value) {
      width.value = _ref.value.getBoundingClientRect().width;
      height.value = _ref.value?.getBoundingClientRect().height;
    }
  });
  ro.observe(_ref.value);
});

onUnmounted(() => {
  ro?.disconnect();
});

provide("parentItemEl", _ref);
</script>

<template>
  <button
    v-if="props.type !== 'divide'"
    ref="_ref"
    class="menu-item"
    :class="{
      'has-submenu': props.type === 'multi',
    }"
    :disabled="props.disabled"
    @click="handleClick"
    @mouseenter="() => multiMouse(true)"
    @mouseleave="mulitCloseDebounce()"
  >
    <FontAwesomeIcon v-if="props.icon" :icon="props.icon" />
    <span class="label">{{ props.text }}</span>
    <span v-if="props.type === 'checkbox'" class="check" aria-hidden="true">{{
      checkValue ? "✔" : ""
    }}</span>
    <span v-if="props.shortcut" class="shortcut">{{ props.shortcut }}</span>
  </button>

  <hr v-else class="divider" />

  <RightClickContext
    v-if="props.type === 'multi'"
    :top="multiContextTop"
    :left="multiContextLeft"
    :items="props.child ?? []"
    ref="multiContextRef"
    @mouseenter="() => multiMouse(true)"
    @mouseleave="mulitCloseDebounce()"
    :autoClose="ctx?.autoClose.value"
  ></RightClickContext>
</template>

<style scoped>
@import "./style.css";
</style>
