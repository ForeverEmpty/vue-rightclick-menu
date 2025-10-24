import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick } from "vue";
import { vMenu, MenuService as Menu } from "./index";
import ResizeObserver from "resize-observer-polyfill";
import RightClickItem from "./RightClickItem.vue";
import RightClickContext from "./RightClickContext.vue";
import { ref } from "process";

global.ResizeObserver = ResizeObserver;

const mountCtx = (props = {}) =>
  mount(RightClickContext, {
    props: {
      top: 0,
      left: 0,
      items: [],
      getContainer: () => document.body,
      ...props,
    },
  });

// 简易触发右键
function rightClick(el: Element, x = 100, y = 200) {
  const evt = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
  el.dispatchEvent(evt);
}

// 简易触发左键
function leftClick(el: Element) {
  const evt = new MouseEvent("click", { bubbles: true, cancelable: true });
  el.dispatchEvent(evt);
}

describe("RightClickMenu", () => {
  const TestComp = defineComponent({
    template: `<div v-menu="menuProps" class="trigger">target</div>`,
    directives: { menu: vMenu },
    data() {
      return {
        menuProps: {
          top: 0,
          left: 0,
          items: [
            { id: 1, text: "cut", type: "default" as const },
            { id: 2, text: "copy", type: "default" as const },
          ],
        },
      };
    },
  });

  it("指令绑定后，右键打开菜单", async () => {
    const wrapper = mount(TestComp);
    rightClick(wrapper.element, 150, 160);
    await nextTick();
    const menuEl = document.querySelector(".context-menu") as HTMLElement;
    expect(menuEl).toBeTruthy();
    expect(menuEl.style.transform).toContain("translate(150px, 160px)");
    wrapper.unmount();
  });

  it("点击外部自动关闭", async () => {
    const wrapper = mount(TestComp);
    rightClick(wrapper.element);
    await nextTick();
    expect(document.querySelector(".context-menu")).toBeTruthy();
    leftClick(document.body);
    await nextTick();
    const menuEl = document.querySelector(".context-menu") as HTMLElement;
    expect(menuEl.style.display).toBe("none");
    wrapper.unmount();
  });

  it("props 更新后菜单同步", async () => {
    const wrapper = mount(TestComp);
    rightClick(wrapper.element);
    await nextTick();
    const vm = wrapper.vm as any;
    vm.menuProps.items.push({ id: 3, text: "paste", type: "default" });
    await nextTick();
    const items = document.querySelectorAll(".menu-item");
    expect(items.length).toBe(3);
    wrapper.unmount();
  });

  it("service 方式调用", async () => {
    const inst = Menu({
      top: 300,
      left: 400,
      items: [{ id: 1, text: "hello", type: "default" }],
    });
    inst.open();
    await nextTick();
    const menuEl = document.querySelector(".context-menu") as HTMLElement;
    expect(menuEl).toBeTruthy();
    expect(menuEl.style.transform).toContain("translate(400px, 300px)");
    inst.destroy();
    await nextTick();
    expect(document.querySelector(".context-menu")).toBeFalsy();
  });

  it("多级菜单（multi）渲染子项", async () => {
    const wrapper = mount(
      defineComponent({
        template: `<div v-menu="menuProps" class="trigger">target</div>`,
        directives: { menu: vMenu },
        data() {
          return {
            menuProps: {
              top: 0,
              left: 0,
              items: [
                {
                  id: 1,
                  text: "more",
                  type: "multi" as const,
                  child: [
                    { id: 11, text: "sub1", type: "default" as const },
                    { id: 12, text: "sub2", type: "default" as const },
                  ],
                },
              ],
            },
          };
        },
      })
    );
    rightClick(wrapper.element);
    await nextTick();
    const sub = document.querySelectorAll(".context-menu");
    // 主菜单 + 子菜单 共 2 个节点
    expect(sub.length).toBe(2);
    wrapper.unmount();
  });

  it("parentItemEl 分支 → 计算偏移", async () => {
    const parentBtn = document.createElement("button");
    document.body.appendChild(parentBtn);
    parentBtn.getBoundingClientRect = () =>
      ({
        right: 1000,
        top: 200,
        bottom: 230,
        height: 30,
        width: 120,
      } as DOMRect);

    // 2. 挂载组件，不提供 calculatePosition，也不暴露
    const wrapper = mount(RightClickContext, {
      global: {
        provide: {
          parentItemEl: ref(parentBtn), // 注入父级
        },
      },
      props: {
        top: 0,
        left: 0,
        items: [{ id: 1, text: "sub", type: "default" }],
        visible: false, // 先不显示
      },
    });

    // 3. 显示菜单 -> 触发 calculatePosition
    await wrapper.vm.setVisible(true);
    await nextTick();

    // 4. 再改坐标 -> 再次触发 calculatePosition
    await wrapper.setProps({ top: 300, left: 400 });
    await nextTick();

    // 5. 断言：left 已被计算成相对于 parent 的偏移
    const left = Number(wrapper.vm.left);
    expect(left).toBeLessThanOrEqual(1000); // 在 parent 右侧

    // 6. 清理
    parentBtn.remove();
  });

  it("viewport 溢出翻转", async () => {
    Object.defineProperty(window, "innerWidth", { value: 500, writable: true });
    Object.defineProperty(window, "innerHeight", {
      value: 300,
      writable: true,
    });

    const wrapper = mountCtx({
      items: [{ id: 1, text: "a", type: "default" }],
      top: 290,
      left: 480,
    });
    wrapper.vm.setVisible(true);
    await nextTick();
    wrapper.vm.setVisible(true);
    await nextTick();

    expect(wrapper.vm.left).toBeLessThan(480); // 被拉回
    expect(wrapper.vm.top).toBeLessThan(290);
  });

  describe("RightClickItem", () => {
    it("multi 分支渲染子菜单", () => {
      const wrapper = mount(RightClickItem, {
        props: {
          id: 1,
          type: "multi",
          text: "more",
          child: [{ id: 11, text: "sub", type: "default" }],
        },
      });
      expect(wrapper.findComponent(RightClickContext).exists()).toBe(true);
    });

    it("checkbox 分支展示勾选", async () => {
      const wrapper = mount(RightClickItem, {
        props: {
          id: 1,
          type: "checkbox",
          checked: () => true,
        },
      });
      expect(wrapper.find(".check").text()).toBe("✔");
    });

    it("disabled 分支不触发 click", () => {
      const fn = vi.fn();
      const wrapper = mount(RightClickItem, {
        props: {
          id: 1,
          type: "default",
          disabled: true,
          onClick: fn,
        },
      });
      wrapper.trigger("click");
      expect(fn).not.toHaveBeenCalled();
    });

    it("divide 分支渲染分割线", () => {
      const wrapper = mount(RightClickItem, {
        props: {
          id: 1,
          type: "divide",
        },
      });
      expect(wrapper.find("hr.divider").exists()).toBe(true);
    });
  });
});
