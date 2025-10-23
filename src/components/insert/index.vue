<template>
  <!-- 这个组件本身不渲染任何内容，只负责动态插入其他组件 -->
  <div style="display: none"></div>
</template>

<script setup>
// 定义 props
const props = defineProps({
  // 要渲染的组件
  component: {
    type: Object,
    required: true
  },
  // 组件的 props
  componentProps: {
    type: Object,
    default: () => ({})
  },
  // 目标选择器
  targetSelector: {
    type: String,
    required: true
  },
  // 插入位置：'first' | 'last' | 'before' | 'after'
  position: {
    type: String,
    default: 'first',
    validator: (value) => ['first', 'last', 'before', 'after'].includes(value)
  },
  // 参考元素选择器（用于 before/after 位置）
  referenceSelector: {
    type: String,
    default: ''
  }
});

let app = null;
let container = null;

onMounted(() => {
  const target = document.querySelector(props.targetSelector);
  if (!target) {
    console.warn(`Target element not found: ${props.targetSelector}`);
    return;
  }

  // 创建容器
  container = document.createElement('div');

  // 创建 Vue 应用
  app = createApp(props.component, props.componentProps);

  // 挂载到容器
  app.mount(container);

  // 根据位置插入
  switch (props.position) {
    case 'first':
      target.insertBefore(container, target.firstChild);
      break;
    case 'last':
      target.appendChild(container);
      break;
    case 'before':
      if (props.referenceSelector) {
        const reference = target.querySelector(props.referenceSelector);
        if (reference) {
          target.insertBefore(container, reference);
        } else {
          target.appendChild(container);
        }
      } else {
        target.appendChild(container);
      }
      break;
    case 'after':
      if (props.referenceSelector) {
        const reference = target.querySelector(props.referenceSelector);
        if (reference) {
          target.insertBefore(container, reference.nextSibling);
        } else {
          target.appendChild(container);
        }
      } else {
        target.appendChild(container);
      }
      break;
    default:
      target.appendChild(container);
  }
});

onUnmounted(() => {
  if (app) {
    app.unmount();
  }
  if (container) {
    container.remove();
  }
});
</script>

<style scoped>
/* 这个组件不需要样式 */
</style>
