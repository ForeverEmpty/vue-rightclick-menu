<script setup lang="ts">
import {
  MenuService,
  type RightClickItemProps,
} from "@vue-rightclick-menu/components";
import { delay, noop } from "lodash-es";
import { ref } from "vue";

const check = ref(false);

const items = ref<RightClickItemProps[]>([
  {
    id: 4,
    type: "multi",
    text: "4",
    child: [
      { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
      {
        id: 2,
        type: "checkbox",
        text: "2",
        checked: () => check.value,
        onClick: (e) => console.log(e),
        onChange: (val) => (check.value = val),
      },
      {
        id: 3,
        type: "divide",
      },
      {
        id: 4,
        type: "multi",
        text: "4",
        child: [
          { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
          {
            id: 2,
            type: "checkbox",
            text: "2",
            checked: () => check.value,
            onClick: (e) => console.log(e),
            onChange: (val) => (check.value = val),
          },
          {
            id: 3,
            type: "divide",
          },
        ],
      },
    ],
  },
  { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
  {
    id: 2,
    type: "checkbox",
    text: "2",
    checked: () => check.value,
    onClick: (e) => console.log(e),
    onChange: (val) => (check.value = val),
  },
  {
    id: 3,
    type: "divide",
  },
  {
    id: 5,
    type: "default",
    text: "Lonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnng text",
  },
]);

const items_t = ref<RightClickItemProps[]>([
  {
    id: 4,
    type: "multi",
    text: "4",
    child: [
      { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
      {
        id: 2,
        type: "checkbox",
        text: "2",
        checked: () => check.value,
        onClick: (e) => console.log(e),
        onChange: (val) => (check.value = val),
      },
      {
        id: 3,
        type: "divide",
      },
      { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 5, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 6, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 7, type: "default", text: "1", onClick: (e) => noop(e) },
      { id: 8, type: "default", text: "1", onClick: (e) => noop(e) },
    ],
  },
  { id: 1, type: "default", text: "1", onClick: (e) => noop(e) },
  {
    id: 2,
    type: "checkbox",
    text: "2",
    checked: () => check.value,
    onClick: (e) => console.log(e),
    onChange: (val) => (check.value = val),
  },
  {
    id: 3,
    type: "divide",
  },
]);

const menu1 = MenuService({
  top: 10,
  left: 10,
  items: items.value,
});
menu1.open();
menu1.setPos(100, 100);

const menu2 = MenuService({
  top: 20,
  left: 20,
  items: items_t.value,
});
delay(() => menu2.open(), 1000);
delay(() => menu2.destroy(), 1500);
delay(() => menu2.open(), 2000);
</script>

<template>
  <button @click="items = items_t">test</button>

  <div
    class="test"
    v-menu="{
      top: 10,
      left: 10,
      items: items,
    }"
  ></div>
  <hr></hr>
  <div
    class="test"
    v-menu="{
      top: 10,
      left: 10,
      items: items_t,
    }"
  ></div>
</template>

<style scoped>
.test {
  width: 500px;
  height: 500px;
  background: red;
}
</style>
