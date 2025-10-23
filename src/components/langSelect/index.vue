<template>
  <n-select :value="modelValue" :menu-props="menuProps" filterable :options="langs" @update:value="handleValueChange" />
</template>

<script setup>
import { useLang } from '@/hooks/useLang';

// 定义 props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  menuProps: {
    type: Object,
    default: () => ({})
  }
});

const { langs } = useLang();

const emit = defineEmits(['update:modelValue', 'change']);

// 处理值变化
const handleValueChange = (value) => {
  emit('change', value);
  emit('update:modelValue', value);
};
</script>

<style scoped></style>
